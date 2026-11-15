/**
 * Markdown and JSON exports rendered from the same immutable assessment (master §9.4-9.5). The checksum is
 * verified before export; a mismatch is an export error, never silently re-hashed.
 */
import type { Assessment, ClaimResult } from './assess';
import { payloadDigest } from './digest';
import { canonicalJson } from './canonicalize';

export class ExportIntegrityError extends Error {}

export function verifyAssessment(a: Assessment): void {
  const d = payloadDigest(a);
  if (d !== a.payloadSha256) throw new ExportIntegrityError(`checksum mismatch: stored ${a.payloadSha256.slice(0, 12)}…, recomputed ${d.slice(0, 12)}…`);
}

export function exportJson(a: Assessment): string {
  verifyAssessment(a);
  return JSON.stringify(JSON.parse(canonicalJson(a)), null, 2) + '\n';
}

const OUTCOME: Record<string, string> = {
  specified_conditional_comparison: 'Comparison specified (conditional)',
  descriptive_consistency_check: 'Descriptive check',
  incompatible_requested_claim: 'Not supported for this claim',
  unresolved_requirement: 'Unresolved: requirement missing',
};
const ROUTE: Record<string, string> = {
  direct: 'Direct', conditional_model_candidate: 'Conditional model candidate', context: 'Context', no_supported_route: 'No supported route',
};
export const outcomeLabel = (c: Pick<ClaimResult, 'outcome'>) => (c.outcome ? OUTCOME[c.outcome] : null);
export const routeLabel = (c: Pick<ClaimResult, 'route'>) => ROUTE[c.route];
const md = (t: string) => t.replace(/([\\`*_[\]<>|])/g, '\\$1');

export function exportMarkdown(a: Assessment): string {
  verifyAssessment(a);
  const s = a.evidenceSnapshot as { sources: { id: string; title: string; canonicalUri: string; access: string; observedSha256: string | null }[] };
  const src = new Map(s.sources.map((x) => [x.id, x]));
  const L: string[] = [];
  L.push(`# IGNIS assessment ${a.id}`, '');
  L.push(`- **Question (as typed):** ${md(a.request.originalText || '(structured request)')}`);
  L.push(`- **Confirmed task:** ${a.request.proposal.intent.replace(/_/g, ' ')}; areas: ${a.requestedAreas.join(', ')}`);
  if (a.request.proposal.physicalModelId) L.push(`- **Published model:** ${a.request.proposal.physicalModelId}; quantities: ${a.request.proposal.quantityIds.join(', ') || 'none'}; claim: ${a.request.proposal.requestedClaim.replace(/_/g, ' ')}; time scope: ${a.request.proposal.temporalScope}`);
  L.push(`- **Handling:** ${a.handling.handling.replace(/_/g, ' ')}${a.handling.reasons.length ? ` — ${md(a.handling.reasons.join(' '))}` : ''}`);
  L.push(`- **State:** ${a.state}; catalogue ${a.catalogRevision}; engine ${a.engineRevision}; renderer ${a.rendererRevision}`);
  L.push(`- **AI use:** ${a.aiUse}`, '');
  if (a.researchAnalyses?.length) {
    L.push('## Selected source analyses', '', 'These are the confirmed descriptive selections attached to this request. They do not become validation evidence for a physical model.', '');
    for (const analysis of a.researchAnalyses) {
      L.push(`### ${md(analysis.title)}`, '', ...analysis.summary.map((s) => `- ${md(s)}`),
        ...analysis.limitations.map((s) => `- Limit: ${md(s)}`), '',
        ...analysis.sources.map((s) => `Source: [${md(s.title)}](${s.url}); SHA-256 \`${s.sha256}\`.`),
        `Method: ${analysis.methodRevision}. Source basis: \`${analysis.sourceDigest}\`. Result: \`${analysis.resultDigest}\`.`, '');
      if (analysis.kind === 'detector') {
        L.push('| Source row | Material | Cell | Stored reading | Classification |', '|---|---|---|---|---|');
        for (const r of analysis.result.rows) L.push(`| ${r.record.excelRow} | ${md(r.record.material)} | ${r.measurement.cell} | ${md(r.measurement.originalValue ?? '(empty)')} | ${r.classification} |`);
      } else if (analysis.kind === 'cutoff_envelope') {
        const r = analysis.result;
        L.push('| Cohort | Jointly finite difference range | Unavailable-reading completion range |', '|---|---|---|');
        for (const group of [{ label: 'Pooled', summary: r.summary }, ...r.byFlight.map((f) => ({ label: `Flight ${f.flight}`, summary: f.summary }))]) {
          const p = group.summary.pairedDifferenceEnvelope, c = group.summary.completionDifferenceEnvelope;
          L.push(`| ${group.label} | ${p.denominator ? `[${p.lowerNumerator}, ${p.upperNumerator}] / ${p.denominator}` : 'undefined'} | ${c.denominator ? `[${c.lowerNumerator}, ${c.upperNumerator}] / ${c.denominator}` : 'undefined'} |`);
        }
        L.push('', md(r.policy.extremaRule), md(r.policy.profileMeaning), '', '| Source row | Material | A cell / reading | B cell / reading | Pair availability |', '|---|---|---|---|---|');
        for (const row of r.rows) L.push(`| ${row.record.excelRow} | ${md(row.record.material)} | ${row.measurementA.cell}: ${md(row.measurementA.originalValue ?? '(empty)')} | ${row.measurementB.cell}: ${md(row.measurementB.originalValue ?? '(empty)')} | ${row.availability} |`);
        if (r.excludedRows.length) L.push('', '**Excluded rows:**', ...r.excludedRows.map((row) => `- Row ${row.record.excelRow}: ${md(row.reasons.join('; '))}`));
        L.push('', 'The JSON also retains exact empirical step intervals, closed/open boundary semantics and each row’s classifications at both extremal cutoff pairs.');
      } else if (analysis.kind === 'detector_pair') {
        L.push('| Source row | Material | A cell / reading | B cell / reading | Pair availability |', '|---|---|---|---|---|');
        for (const r of analysis.result.rows) L.push(`| ${r.record.excelRow} | ${md(r.record.material)} | ${r.measurementA.cell}: ${md(r.measurementA.originalValue ?? '(empty)')} | ${r.measurementB.cell}: ${md(r.measurementB.originalValue ?? '(empty)')} | ${r.availability} |`);
        if (analysis.result.excludedRows.length) L.push('', '**Excluded rows (retained in JSON):**', ...analysis.result.excludedRows.map((r) => `- Row ${r.record.excelRow}: ${md(r.reasons.join('; '))}`));
      } else {
        L.push('| Case | Material / sides | Oxygen mole % | Pressure kPa |', '|---|---|---|---|');
        for (const c of analysis.result.cases) L.push(`| ${md(c.id)} | ${md(c.material)} / ${c.sidesBurning} | ${c.oxygenPercent} | ${c.pressureKPa} |`);
      }
      L.push('', 'The matching JSON contains the complete selected source records, original cells/units, missingness and conflict context.', '');
    }
  }
  const contracts = a.claims.filter((c) => c.kind === 'contract');
  if (contracts.length) {
    L.push('## Analysis', '');
    for (const c of contracts) {
      L.push(`### ${md(c.title)}`, '', `**${routeLabel(c)} · ${outcomeLabel(c) ?? 'no outcome'}** (${c.executionKind.replace(/_/g, ' ')})`, '', md(c.authoritativeText), '');
      for (const r of c.predicateResults) L.push(`- ${r.critical ? 'Required' : 'For numerical work'}: ${md(r.description)} — **${r.truth}**. ${md(r.reason)}`);
      if (c.missingRequirements.length) L.push('', '**Still needed:**', ...c.missingRequirements.map((m) => `- ${md(m)}`));
      if (c.forbiddenStrongerClaims.length) L.push('', '**Does not establish:**', ...c.forbiddenStrongerClaims.map((m) => `- ${md(m)}`));
      L.push('');
    }
  }
  if (a.derivations.length) {
    L.push('## Calculations (source arithmetic)', '', '| Calculation | Expression | Result | Exact value | Status |', '|---|---|---|---|---|');
    for (const d of a.derivations) L.push(`| ${md(d.label)} | ${md(d.expression)} | ${md(d.displayText)} | ${d.exactText ?? '—'} | ${d.executionKind.replace(/_/g, ' ')} |`);
    L.push('', ...[...new Set(a.derivations.flatMap((d) => d.assumptions))].map((x) => `- ${md(x)}`), '');
  }
  const findings = a.claims.filter((c) => c.kind === 'source_finding');
  if (findings.length) {
    L.push('## Source findings', '');
    for (const area of a.requestedAreas) {
      const fs = findings.filter((c) => a.requestedAreas.find((x) => c.safetyAreas.includes(x)) === area);
      if (!fs.length) continue;
      L.push(`### ${area[0].toUpperCase() + area.slice(1)}`, '');
      for (const c of fs) {
        L.push(`#### ${md(c.title)}`, '', `*${routeLabel(c)}; ${c.evidenceKind?.replace(/_/g, ' ')}; ${c.reviewLevel.replace(/_/g, ' ')}*`, '');
        L.push(`IGNIS wording: ${md(c.authoritativeText)}`, '');
        if (c.sourceFindingText) L.push(`> Source: “${md(c.sourceFindingText)}”`, '');
        if (c.qualifications.length) L.push(...c.qualifications.map((q) => `- ${md(q)}`), '');
        L.push(`Sources: ${c.sourceIds.map((id) => `[${id}](${src.get(id)?.canonicalUri ?? '#'})`).join(', ')}`, '');
      }
    }
  }
  L.push('## Investigations ranked for this question', '', '| Rank group | Investigation | Coverage | Why |', '|---|---|---|---|');
  for (const r of a.ranking) L.push(`| ${r.rankGroup} | ${md(r.displayName)} | ${r.coverage.replace(/_/g, ' ')} | ${md([...r.humanReasons, ...r.unknownConditions].join(' '))} |`);
  L.push('', 'Rank groups are a transparent product policy (1 = explicitly selected … 5 = profile/objective only), not a risk or truth score.', '');
  if (a.revisionDifference) {
    const r = a.revisionDifference;
    L.push('## What changed from the previous assessment', '', `Operation: ${r.operation.replace(/_/g, ' ')}. Changed: ${md(r.changedFields.join(', ') || 'nothing')}.`, '', md(r.note), '');
    for (const w of r.witnesses) L.push(`- **${md(w.affectedRef.id)}** — changed premise: ${md(w.premise)}; assumption: ${md(w.assumption)}; before: ${md(w.previousConclusion)}; now: ${md(w.newConclusion)}`);
    L.push(`- Unchanged claims: ${r.unchangedClaimIds.length}. Previous assessment: ${a.parentAssessmentId} (preserved as history).`, '');
  }
  L.push('## Readiness', '', `- Assets: ${a.readiness.assets.map((x) => `${x.ref.id} ${x.state.replace(/_/g, ' ')}`).join('; ') || 'none required'}`,
    `- Linkage: ${a.readiness.linkage}; protocol: ${a.readiness.protocol}; replay: ${a.readiness.replay}; numerical verification: ${a.readiness.numericalVerification}`,
    `- External review: ${a.readiness.externalReview.length ? 'recorded' : 'none (assistant-checked only)'}`, '');
  L.push('## Sources', '');
  for (const x of s.sources) L.push(`- **${x.id}** — ${md(x.title)}. <${x.canonicalUri}> (access: ${x.access.replace(/_/g, ' ')}${x.observedSha256 ? `; SHA-256 ${x.observedSha256.slice(0, 16)}…` : ''})`);
  L.push('', '## Limitations', '', ...a.limitations.map((x) => `- ${md(x)}`), '');
  L.push('---', `Payload SHA-256 \`${a.payloadSha256}\` (checksum, not a signature; excludes payloadSha256 and createdAt). Scope: ${a.reproductionScope.replace(/_/g, ' ')}. Created ${a.createdAt}.`,
    'IGNIS is an independent NASA Space Apps 2026 project (team Emberfall), not affiliated with or endorsed by NASA. Built with AI assistance; see the project AI disclosure.', '');
  return L.join('\n');
}
