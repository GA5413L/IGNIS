/**
 * Revision difference (master §9.2): changed premise -> affected assumption/measurement meaning -> affected
 * record -> previous and new permitted conclusion. A record of reasoning under declared contracts, not a causal estimate.
 */
import type { Assessment, ClaimResult } from './assess';
import { digestOf } from './canonicalize';

export interface RevisionDifference {
  operation: 'question_change' | 'proposed_model' | 'reviewed_assertion_change' | 'analytical_scope_change' | 'synthetic_test';
  changedFields: string[]; affectedClaimIds: string[]; unchangedClaimIds: string[]; addedClaimIds: string[]; removedClaimIds: string[];
  witnesses: { premise: string; assumption: string; affectedRef: { id: string; revision: string }; previousConclusion: string; newConclusion: string }[];
  note: string;
}

const FIELDS = ['intent', 'safetyAreas', 'investigationIds', 'physicalModelId', 'eventIds', 'quantityIds', 'endpointIds', 'requestedFeature', 'temporalScope', 'requestedClaim', 'constraints', 'explicitExclusions', 'ambiguities', 'unknownTerms', 'proposedModelNote', 'requestedExecutionText', 'supportingContextIds'] as const;

const FIELD_LABEL: Record<(typeof FIELDS)[number], string> = { intent: 'task', safetyAreas: 'safety areas', investigationIds: 'investigations', physicalModelId: 'published model', eventIds: 'burn event', quantityIds: 'physical quantity', endpointIds: 'endpoint', requestedFeature: 'feature', temporalScope: 'time scope', requestedClaim: 'requested claim', constraints: 'numeric conditions', explicitExclusions: 'exclusions', ambiguities: 'unresolved routing choices', unknownTerms: 'unmapped terms', proposedModelNote: 'new model proposal', requestedExecutionText: 'requested execution', supportingContextIds: 'supporting context' };
const outcomeText = (c: ClaimResult) => (c.outcome ? `${c.route.replace(/_/g, ' ')} · ${c.outcome.replace(/_/g, ' ')}` : c.route.replace(/_/g, ' '));
const keyOf = (c: ClaimResult) => c.contractRef?.id ?? c.findingRef?.id ?? c.id;

export type Labeler = (id: string) => string;
const show = (v: unknown, label: Labeler): string => Array.isArray(v)
  ? (v.length ? v.map((x) => show(x, label)).join(', ') : 'none')
  : v === null ? 'none' : typeof v === 'object' ? JSON.stringify(v) : label(String(v));

const CLAIM_FIELDS = ['kind', 'findingRef', 'contractRef', 'safetyAreas', 'title', 'requestedUse', 'route', 'outcome', 'contractTruth',
  'authoritativeText', 'sourceFindingText', 'qualifications', 'forbiddenStrongerClaims', 'predicateResults', 'derivationIds',
  'consumedRefs', 'missingRequirements', 'executionKind', 'evidenceKind', 'reviewLevel', 'sourceIds'] as const;
type ChangedClaimField = (typeof CLAIM_FIELDS)[number];
function changedDetails(claim: ClaimResult, fields: readonly ChangedClaimField[]): string {
  return fields.filter((field) => !['route', 'outcome', 'authoritativeText'].includes(field)).map((field) => {
    if (field === 'predicateResults') return `predicate results: ${claim.predicateResults.map((p) => `${p.description} → ${p.truth}: ${p.reason}`).join('; ') || 'none'}`;
    const value = claim[field];
    return `${field}: ${typeof value === 'string' ? value : JSON.stringify(value)}`;
  }).join('\n');
}
const conclusion = (claim: ClaimResult, fields: readonly ChangedClaimField[] = []) => {
  const details = changedDetails(claim, fields);
  return `${outcomeText(claim)}: ${claim.authoritativeText}${details ? `\n${details}` : ''}`;
};

export function compare(prev: Assessment, cur: Assessment, label: Labeler = (x) => x): RevisionDifference {
  const a = prev.request.proposal, b = cur.request.proposal;
  const changed = FIELDS.filter((f) => JSON.stringify(a[f]) !== JSON.stringify(b[f]));
  const beforeResearch = prev.researchAnalyses ?? [], afterResearch = cur.researchAnalyses ?? [];
  const researchResultChanged = digestOf(beforeResearch.map((r) => r.resultDigest)) !== digestOf(afterResearch.map((r) => r.resultDigest));
  const researchSelectionChanged = digestOf(beforeResearch.map((r) => r.selection)) !== digestOf(afterResearch.map((r) => r.selection));
  const researchSourceChanged = digestOf(beforeResearch.map((r) => r.sourceDigest)) !== digestOf(afterResearch.map((r) => r.sourceDigest));
  const researchMethodChanged = digestOf(beforeResearch.map((r) => r.methodRevision)) !== digestOf(afterResearch.map((r) => r.methodRevision));
  const researchChanged = researchResultChanged || researchSelectionChanged || researchSourceChanged || researchMethodChanged;
  const catalogueChanged = prev.catalogDigest !== cur.catalogDigest;
  const methodChanged = prev.engineRevision !== cur.engineRevision || prev.rendererRevision !== cur.rendererRevision;
  const textChanged = prev.request.originalText !== cur.request.originalText;
  const prevBy = new Map(prev.claims.map((c) => [keyOf(c), c]));
  const curBy = new Map(cur.claims.map((c) => [keyOf(c), c]));
  const affected: string[] = [], unchanged: string[] = [], added: string[] = [], removed: string[] = [];
  const witnesses: RevisionDifference['witnesses'] = [];
  let premise = changed.length
    ? changed.map((f) => `${FIELD_LABEL[f]}: ${show(a[f], label)} → ${show(b[f], label)}`).join('; ')
    : 'no request field changed';
  if (catalogueChanged) premise += `; catalogue source basis: ${prev.catalogDigest} → ${cur.catalogDigest}`;
  if (methodChanged) premise += `; assessment method: ${prev.engineRevision}/${prev.rendererRevision} → ${cur.engineRevision}/${cur.rendererRevision}`;
  if (textChanged) premise += `; original question: ${prev.request.originalText} → ${cur.request.originalText}`;
  for (const [k, c] of curBy) {
    const p = prevBy.get(k);
    if (!p) { added.push(c.id); if (c.kind === 'contract') witnesses.push(witness(premise, c, 'not assessed in the previous request')); continue; }
    const changedClaimFields = CLAIM_FIELDS.filter((field) => digestOf(p[field]) !== digestOf(c[field]));
    if (changedClaimFields.length) {
      affected.push(c.id);
      witnesses.push(witness(premise, c, conclusion(p, changedClaimFields), changedClaimFields));
    } else unchanged.push(c.id);
  }
  for (const [k, p] of prevBy) if (!curBy.has(k)) {
    removed.push(p.id);
    if (p.kind === 'contract') witnesses.push({ premise, assumption: 'This claim is outside the revised request.', affectedRef: p.contractRef!, previousConclusion: `${outcomeText(p)}: ${p.authoritativeText}`, newConclusion: 'not part of the revised request (the earlier assessment is preserved as history)' });
  }
  const scopeOnly = changed.length > 0 && changed.every((f) => f === 'safetyAreas' || f === 'investigationIds');
  return {
    operation: changed.length === 0 && catalogueChanged ? 'reviewed_assertion_change' : scopeOnly || (changed.length === 0 && (researchChanged || methodChanged)) ? 'analytical_scope_change' : 'question_change',
    changedFields: [...changed, ...(textChanged ? ['originalText'] : []), ...(catalogueChanged ? ['catalogue_source_basis'] : []), ...(methodChanged ? ['assessment_method'] : []), ...(researchChanged ? ['selected_source_analysis'] : []), ...(researchSourceChanged ? ['analysis_source_basis'] : []), ...(researchMethodChanged ? ['analysis_method'] : [])], affectedClaimIds: affected, unchangedClaimIds: unchanged, addedClaimIds: added, removedClaimIds: removed, witnesses,
    note: (catalogueChanged ? 'The catalogue source basis changed. Claims are compared by their scientific wording, qualifications, predicates, references and review state; unchanged output does not establish fresh independent validation. ' : '') + (researchChanged ? 'The selected descriptive analysis changed; its source rows and counts are preserved with each result. It does not alter the model-validation contracts. ' : '') + (scopeOnly
      ? 'Requested coverage changed. Findings outside the new scope were not disproved; they are simply not requested.'
      : changed.includes('physicalModelId')
        ? 'A different published model was selected. Each model keeps its own information-use history; no record was rewritten and no model run was created.'
        : 'This comparison preserves both assessment records. It creates no new measurement or model run. Source and method identity changes, when present, are listed separately.'),
  };
}

function witness(premise: string, c: ClaimResult, previous: string, fields: readonly ChangedClaimField[] = []) {
  const driver = c.predicateResults.find((r) => r.critical && r.truth !== 'satisfied') ?? c.predicateResults.find((r) => r.critical);
  return {
    premise,
    assumption: `${fields.length ? `Changed scientific fields: ${fields.join(', ')}. ` : ''}${driver ? `${driver.description} → ${driver.truth}: ${driver.reason}` : 'Source finding as reported.'}`,
    affectedRef: c.contractRef ?? c.findingRef!,
    previousConclusion: previous,
    newConclusion: conclusion(c, fields),
  };
}
