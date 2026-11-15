/**
 * Deterministic retrieval and Ranking v1 (master §8.1-8.2). The whole reviewed bank is scanned; curated aliases
 * give candidate signals, not verdicts. Rank tiers are a product policy, not a risk or truth score.
 */
import type { Finding, InterpretationProposal, SafetyArea } from './schemas';
import type { CatalogSnapshot } from './registry';
import { byId } from './registry';

export interface RankingEntry {
  investigationId: string; displayName: string; findingIds: string[]; rankGroup: number;
  reasonCodes: string[]; humanReasons: string[]; unknownConditions: string[]; coverage: string; matchedTermCount: number;
}
export interface Retrieved { finding: Finding; tier: number; reasonCodes: string[]; matchedTerms: string[]; area: SafetyArea[] }

const ALL_AREAS: SafetyArea[] = ['prevention', 'detection', 'suppression'];
export const requestedAreas = (p: InterpretationProposal): SafetyArea[] => (p.safetyAreas.length ? p.safetyAreas : ALL_AREAS);

const SUB: Record<string, string> = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
// subscript digits are folded first so that "CO₂" reads as "co2", never as the alias "co" (carbon monoxide)
const norm = (t: string) => ` ${t.toLowerCase().replace(/[₀-₉]/g, (c) => SUB[c]).replace(/[^a-z0-9.+%-]+/g, ' ').replace(/\s+/g, ' ').trim()} `;

/** Alias hits for one finding: phenomena, quantities and endpoints it is linked to. */
export function termHits(f: Finding, s: CatalogSnapshot, question: string): string[] {
  const q = norm(question);
  const hits = new Set<string>();
  for (const id of [...f.phenomenonIds, ...f.quantityIds, ...f.endpointIds]) {
    const e = byId(s.entities, id);
    for (const a of e?.aliases ?? []) if (q.includes(norm(a))) hits.add(a);
  }
  return [...hits].sort();
}

export function retrieveFindings(p: InterpretationProposal, s: CatalogSnapshot, question: string): Retrieved[] {
  const areas = requestedAreas(p);
  const explicitInv = new Set(p.investigationIds);
  const explicitModelInv = p.physicalModelId ? byId(s.models, p.physicalModelId)?.investigationRef?.id : undefined;
  const out: Retrieved[] = [];
  for (const f of s.findings) {
    const a = byId(s.assertions, f.assertionRef.id);
    if (!a || a.state !== 'active') continue;
    const inArea = f.safetyAreas.filter((x) => areas.includes(x));
    const selected = f.investigationRefs.some((r) => explicitInv.has(r.id) || r.id === explicitModelInv)
      || f.familyIds.some((fam) => s.investigations.some((i) => explicitInv.has(i.id) && i.familyId === fam) && f.investigationRefs.length === 0);
    if (!inArea.length && !selected) continue;
    const hits = termHits(f, s, question);
    const codes: string[] = [];
    let tier = 4;
    if (selected) { tier = 1; codes.push('EXPLICIT_SELECTION'); }
    if (hits.length) { tier = Math.min(tier, 2); codes.push('PHENOMENON_MATCH'); }
    if (f.endpointIds.some((e) => p.endpointIds.includes(e))) { tier = Math.min(tier, 2); codes.push('ENDPOINT_MATCH'); }
    if (f.quantityIds.some((qid) => p.quantityIds.includes(qid))) { tier = Math.min(tier, 2); codes.push('QUANTITY_MATCH'); }
    if (f.briefRole === 'context') { tier = Math.max(tier, 4); codes.push('CONTEXT_ONLY'); }
    if (!hits.length && !selected) codes.push('AREA_ONLY');
    out.push({ finding: f, tier, reasonCodes: codes, matchedTerms: hits, area: inArea.length ? inArea : f.safetyAreas });
  }
  // qualifications travel with what they qualify, even when lexically dissimilar (M05)
  const included = new Set(out.map((r) => r.finding.id));
  for (const r of [...out]) {
    for (const qid of r.finding.qualifyingFindingIds) {
      if (included.has(qid)) continue;
      const qf = byId(s.findings, qid);
      if (!qf) continue;
      included.add(qid);
      out.push({ finding: qf, tier: Math.max(r.tier, 4), reasonCodes: ['QUALIFIES_' + r.finding.id], matchedTerms: [], area: qf.safetyAreas });
    }
  }
  return out.sort((a, b) => a.tier - b.tier || b.matchedTerms.length - a.matchedTerms.length || a.finding.id.localeCompare(b.finding.id));
}

export function rankInvestigations(p: InterpretationProposal, s: CatalogSnapshot, retrieved: Retrieved[]): RankingEntry[] {
  const areas = requestedAreas(p);
  const entries: RankingEntry[] = [];
  for (const inv of s.investigations) {
    const fs = retrieved.filter((r) => r.finding.investigationRefs.some((x) => x.id === inv.id) || (r.finding.investigationRefs.length === 0 && r.finding.familyIds.includes(inv.familyId)));
    const modelInv = p.physicalModelId ? byId(s.models, p.physicalModelId)?.investigationRef?.id : undefined;
    const explicit = p.investigationIds.includes(inv.id) || inv.id === modelInv;
    const inArea = inv.safetyAreas.some((a) => areas.includes(a));
    if (!fs.length && !explicit && !inArea) continue;
    // a model-specific question lists only investigations that matched it, not every entry in the areas
    if (modelInv && !explicit && !fs.some((r) => r.matchedTerms.length)) continue;
    const codes = new Set<string>();
    const reasons: string[] = [];
    let group = 5;
    if (explicit) { group = 1; codes.add('EXPLICIT_SELECTION'); reasons.push(inv.id === modelInv ? 'The selected published model belongs to this investigation.' : 'You selected this investigation.'); }
    // tier 1 belongs to the investigation the user selected; another investigation sharing that finding is not 'selected'
    const best = fs.length ? Math.min(...fs.map((r) => (r.tier === 1 && !explicit ? (r.matchedTerms.length ? 2 : 4) : r.tier))) : 5;
    if (fs.length) {
      group = Math.min(group, best);
      const terms = [...new Set(fs.flatMap((r) => r.matchedTerms))];
      if (terms.length) { codes.add('PHENOMENON_MATCH'); reasons.push(`Reviewed findings match: ${terms.join(', ')}.`); }
      else reasons.push(`Has ${fs.length} reviewed finding${fs.length > 1 ? 's' : ''} in the requested area.`);
      fs.forEach((r) => r.reasonCodes.filter((c) => c === 'CONTEXT_ONLY').forEach((c) => codes.add(c)));
    }
    if (inv.coverage === 'profile_only') { codes.add('PROFILE_ONLY'); reasons.push('Objectives only in this release; no curated result.'); group = Math.max(group, explicit ? 1 : 5); }
    const unknown: string[] = [];
    if (inv.coverage === 'profile_only') unknown.push('No reviewed result in this bank (not a statement that none exists).');
    const matched = new Set(fs.filter((r) => r.tier === best).flatMap((r) => r.matchedTerms)).size;
    entries.push({ investigationId: inv.id, displayName: inv.displayName, findingIds: fs.map((r) => r.finding.id), rankGroup: group,
      reasonCodes: [...codes].sort(), humanReasons: reasons, unknownConditions: unknown, coverage: inv.coverage, matchedTermCount: matched });
  }
  // within a group: more distinct requested terms matched first, then stable ID. The number of records is never rewarded (master §8.2).
  return entries.sort((a, b) => a.rankGroup - b.rankGroup || b.matchedTermCount - a.matchedTermCount || a.investigationId.localeCompare(b.investigationId));
}
