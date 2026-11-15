/**
 * IE-1 scorer. Compares one interpretation proposal with a hand-authored key (eval/ie1/keys.json).
 * Keys were written before any inference by the assistant and are NOT independent; scores are
 * "assistant-scored". Critical rules mark errors that would change meaning in front of a user.
 */
import type { InterpretationProposal } from '../../src/core/schemas';
import type { HandlingDecision } from '../../src/core/handling';

export interface SetCheck { exact?: string[]; include?: string[]; exclude?: string[] }
export type CriticalRule =
  | { rule: 'model_must_be'; value: string | null }
  | { rule: 'quantity_forbidden'; ids: string[] }
  | { rule: 'quantity_must_be_empty' }
  | { rule: 'event_forbidden'; ids: string[] }
  | { rule: 'claim_forbidden'; values: string[] }
  | { rule: 'claim_must_be'; value: string }
  | { rule: 'intent_forbidden'; values: string[] }
  | { rule: 'temporal_forbidden'; values: string[] }
  | { rule: 'not_single_choice'; ids: string[] };

export interface Key {
  id: string; rationale: string; intent: string[]; physicalModelId?: string | null;
  investigationIds?: SetCheck; eventIds?: SetCheck; quantityIds?: SetCheck; endpointIds?: SetCheck; safetyAreas?: SetCheck;
  requestedClaim?: string[]; temporalScope?: string[]; requestedFeature?: string[];
  exclusions?: 'required' | 'none'; ambiguity?: 'required' | 'none'; ambiguityAlternativesWithin?: string[];
  proposedModelNote?: 'required' | 'null'; requestedExecutionText?: 'required' | 'null';
  handling: string[]; critical: CriticalRule[];
}

export interface CaseScore { correct: boolean; meaningErrors: string[]; criticalErrors: string[]; reviewFlags: string[] }

function setCheck(name: string, actual: string[], c: SetCheck | undefined, errs: string[]) {
  if (!c) return;
  const a = new Set(actual);
  if (c.exact && (a.size !== c.exact.length || c.exact.some((x) => !a.has(x)))) errs.push(`${name}: expected exactly [${c.exact.join(', ')}], got [${actual.join(', ')}]`);
  c.include?.forEach((x) => { if (!a.has(x)) errs.push(`${name}: missing ${x}`); });
  c.exclude?.forEach((x) => { if (a.has(x)) errs.push(`${name}: must not include ${x}`); });
}

const VERDICT = /\b(is|are|was|were)\s+(validated|safe|unsafe|compatible|incompatible|accurate)\b|\bindependently validated\b|\b\d{1,3}\s?%\s+confiden|\bconfidence\s+of\s+\d/i;

export function scoreCase(p: InterpretationProposal, h: HandlingDecision, k: Key): CaseScore {
  const meaning: string[] = []; const critical: string[] = []; const flags: string[] = [];
  if (!k.intent.includes(p.intent)) meaning.push(`intent: expected one of [${k.intent.join(', ')}], got ${p.intent}`);
  if (k.physicalModelId !== undefined && p.physicalModelId !== k.physicalModelId) meaning.push(`physicalModelId: expected ${k.physicalModelId}, got ${p.physicalModelId}`);
  setCheck('investigationIds', p.investigationIds, k.investigationIds, meaning);
  setCheck('eventIds', p.eventIds, k.eventIds, meaning);
  setCheck('quantityIds', p.quantityIds, k.quantityIds, meaning);
  setCheck('endpointIds', p.endpointIds, k.endpointIds, meaning);
  setCheck('safetyAreas', p.safetyAreas, k.safetyAreas, meaning);
  if (k.requestedClaim && !k.requestedClaim.includes(p.requestedClaim)) meaning.push(`requestedClaim: expected one of [${k.requestedClaim.join(', ')}], got ${p.requestedClaim}`);
  if (k.temporalScope && !k.temporalScope.includes(p.temporalScope)) meaning.push(`temporalScope: expected one of [${k.temporalScope.join(', ')}], got ${p.temporalScope}`);
  if (k.requestedFeature && !k.requestedFeature.includes(p.requestedFeature)) meaning.push(`requestedFeature: expected one of [${k.requestedFeature.join(', ')}], got ${p.requestedFeature}`);
  if (k.exclusions === 'required' && !p.explicitExclusions.length) meaning.push('explicitExclusions: the stated exclusion is not recorded');
  if (k.exclusions === 'none' && p.explicitExclusions.length) meaning.push('explicitExclusions: none were stated');
  if (k.ambiguity === 'required' && !p.ambiguities.length) meaning.push('ambiguities: a routing question is required');
  if (k.ambiguity === 'none' && p.ambiguities.length) meaning.push('ambiguities: an unwarranted blocking question was added');
  if (k.ambiguityAlternativesWithin) {
    const allowed = new Set(k.ambiguityAlternativesWithin);
    p.ambiguities.forEach((a, i) => a.alternativeIds.forEach((id) => { if (!allowed.has(id)) meaning.push(`ambiguities[${i}]: alternative ${id} is not a competing meaning`); }));
  }
  if (k.proposedModelNote === 'required' && !p.proposedModelNote) meaning.push('proposedModelNote: required');
  if (k.proposedModelNote === 'null' && p.proposedModelNote) meaning.push('proposedModelNote: must be null');
  if (k.requestedExecutionText === 'required' && !p.requestedExecutionText) meaning.push('requestedExecutionText: required');
  if (k.requestedExecutionText === 'null' && p.requestedExecutionText) meaning.push('requestedExecutionText: must be null');
  if (!k.handling.includes(h.handling)) meaning.push(`handling: expected ${k.handling.join('/')}, got ${h.handling}`);

  for (const r of k.critical) {
    switch (r.rule) {
      case 'model_must_be': if (p.physicalModelId !== r.value) critical.push(r.value === null ? `assumed model ${p.physicalModelId}` : `model changed to ${p.physicalModelId}`); break;
      case 'quantity_forbidden': r.ids.forEach((id) => { if (p.quantityIds.includes(id)) critical.push(`quantity substitution: ${id}`); }); break;
      case 'quantity_must_be_empty': if (p.quantityIds.length) critical.push(`quantity assumed: ${p.quantityIds.join(', ')}`); break;
      case 'event_forbidden': r.ids.forEach((id) => { if (p.eventIds.includes(id)) critical.push(`excluded event included: ${id}`); }); break;
      case 'claim_forbidden': if (r.values.includes(p.requestedClaim)) critical.push(`forbidden claim: ${p.requestedClaim}`); break;
      case 'claim_must_be': if (p.requestedClaim !== r.value) critical.push(`requested claim lost: ${p.requestedClaim} instead of ${r.value}`); break;
      case 'intent_forbidden': if (r.values.includes(p.intent)) critical.push(`intent converted to ${p.intent}`); break;
      case 'temporal_forbidden': if (r.values.includes(p.temporalScope)) critical.push(`time scope inverted: ${p.temporalScope}`); break;
      case 'not_single_choice': { const chosen = r.ids.filter((id) => p.investigationIds.includes(id)); if (chosen.length === 1) critical.push(`chose ${chosen[0]} without asking`); break; }
    }
  }
  const free = [...p.explicitExclusions, ...p.unknownTerms, ...p.ambiguities.map((a) => a.question), p.proposedModelNote ?? '', p.requestedExecutionText ?? ''];
  free.forEach((t) => { if (VERDICT.test(t)) flags.push(`verdict-like text for manual review: "${t.slice(0, 120)}"`); });
  return { correct: !meaning.length && !critical.length, meaningErrors: meaning, criticalErrors: critical, reviewFlags: flags };
}
