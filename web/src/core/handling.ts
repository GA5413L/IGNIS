/**
 * Application handling derived from the proposal plus a fixed capability table (master §10.2; audit IR2).
 * Intent, missing interpretation, handling and scientific outcome stay separate. No question keywords,
 * case IDs or answer keys are consulted here.
 */
import type { Handling, InterpretationProposal, Intent } from './schemas';
import type { CatalogSnapshot } from './registry';

export interface HandlingDecision { handling: Handling; missingRoutingFields: string[]; reasons: string[] }

const CAPABILITY: Record<Intent, 'supported' | 'unsupported'> = {
  browse_investigations: 'supported', synthesize_findings: 'supported', compare_evidence: 'supported', assess_physical_model: 'supported',
  propose_physical_model: 'unsupported', // recording a new proposed model (operation B) is NOT_IMPLEMENTED in this release
  request_execution: 'unsupported', other: 'supported',
};

/** Allowlist check: every ID must exist with the right kind. Invalid IDs make the draft invalid; nothing is coerced. */
export function validateProposalIds(p: InterpretationProposal, s: CatalogSnapshot): string[] {
  const errs: string[] = [];
  const has = (id: string, set: { id: string }[]) => set.some((x) => x.id === id);
  const kind = (id: string, k: string) => s.entities.some((e) => e.id === id && e.kind === k);
  p.investigationIds.forEach((id) => { if (!has(id, s.investigations)) errs.push(`unknown investigation ${id}`); });
  if (p.physicalModelId && !has(p.physicalModelId, s.models)) errs.push(`unknown physical model ${p.physicalModelId}`);
  p.eventIds.forEach((id) => { if (!has(id, s.events)) errs.push(`unknown event ${id}`); });
  p.quantityIds.forEach((id) => { if (!kind(id, 'quantity')) errs.push(`unknown quantity ${id}`); });
  p.endpointIds.forEach((id) => { if (!kind(id, 'endpoint')) errs.push(`unknown endpoint ${id}`); });
  p.constraints.forEach((c, i) => { if (!s.entities.some((e) => e.id === c.fieldId)) errs.push(`constraints[${i}]: unknown field ${c.fieldId}`); });
  p.supportingContextIds.forEach((id) => { if (!has(id, s.findings) && !has(id, s.sources)) errs.push(`unknown context ${id}`); });
  const anyId = (id: string) => has(id, s.investigations) || has(id, s.models) || has(id, s.events) || has(id, s.entities) || has(id, s.findings);
  p.ambiguities.forEach((a, i) => a.alternativeIds.forEach((id) => { if (!anyId(id)) errs.push(`ambiguities[${i}]: unregistered alternative ${id}`); }));
  const dup = (xs: string[], n: string) => { if (new Set(xs).size !== xs.length) errs.push(`duplicate ids in ${n}`); };
  dup(p.investigationIds, 'investigationIds'); dup(p.eventIds, 'eventIds'); dup(p.quantityIds, 'quantityIds'); dup(p.endpointIds, 'endpointIds');
  if (p.intent === 'propose_physical_model' && !p.proposedModelNote) errs.push('a model proposal needs a proposedModelNote');
  if (p.intent !== 'propose_physical_model' && p.proposedModelNote) errs.push('proposedModelNote is only for a model proposal');
  if (p.intent === 'request_execution' && !p.requestedExecutionText) errs.push('an execution request must preserve requestedExecutionText');
  return errs;
}

export function deriveHandling(p: InterpretationProposal): HandlingDecision {
  if (CAPABILITY[p.intent] === 'unsupported') {
    return { handling: 'unsupported_action', missingRoutingFields: [], reasons: [p.intent === 'request_execution'
      ? 'IGNIS does not run simulations or ingest documents. Your request is kept as written; you can choose a supported alternative such as assessing published evidence.'
      : 'Recording a new proposed physical model is not implemented in this release. Your request is kept as written.'] };
  }
  const missing: string[] = [];
  const reasons: string[] = [];
  if (p.intent === 'assess_physical_model') {
    if (!p.physicalModelId) missing.push('physicalModelId');
    if (!p.quantityIds.length) missing.push('quantityIds');
  }
  if (p.intent === 'compare_evidence' && !p.quantityIds.length && !p.investigationIds.length && !p.physicalModelId) missing.push('quantityIds');
  // The current engine preserves these declarations but has no reviewed evaluator for them.
  // Do not present an unconstrained result as satisfying unsupported user scope.
  if (p.constraints.length) { missing.push('constraints'); reasons.push('The recorded numeric conditions are preserved, but applying them to this evidence/model assessment is not implemented. Clarify or remove this constraint scope before a model-specific verdict.'); }
  if (p.explicitExclusions.length) { missing.push('explicitExclusions'); reasons.push('The recorded text exclusions are preserved, but free-text exclusion filtering is not implemented. Clarify the supported selection before a model-specific verdict; background findings have not been filtered by these exclusions.'); }
  if (p.intent === 'other') reasons.push('The requested task is not recognized; choose browse, brief or assessment.');
  for (const a of p.ambiguities) reasons.push(a.question);
  if (missing.length) reasons.unshift(`Needed before this analysis: ${missing.map((m) => ({ physicalModelId: 'which published model', quantityIds: 'which physical quantity' } as Record<string, string>)[m] ?? m).join(' and ')}.`);
  const handling: Handling = missing.length || p.ambiguities.length || p.intent === 'other' ? 'clarification_needed' : 'ready';
  return { handling, missingRoutingFields: missing, reasons };
}
