import { parseRegistry, RAW_REGISTRY, requireCatalog, type RawRegistry } from '../src/core/registry';
import { assess, type Assessment } from '../src/core/assess';
import { proposalFromForm, type FormChoices } from '../src/core/interpretation';
import { deriveHandling } from '../src/core/handling';
import type { ConfirmedRequest } from '../src/core/schemas';

export const NOW = '2026-11-14T13:00:00.000Z';
export const catalog = () => requireCatalog();

export function request(form: FormChoices, text = 'test question', id = 'REQ-TEST-1'): ConfirmedRequest {
  const proposal = proposalFromForm(form);
  return { id, revision: 'r1', originalText: text, confirmedAt: NOW, proposal, handling: deriveHandling(proposal).handling,
    inputMode: 'form', parentRequestRef: null, runtimeProvenanceRef: null, remainingScientificGaps: [] };
}
export const run = (form: FormChoices, opts: { parent?: Assessment | null; id?: string; text?: string } = {}) => {
  const req = request(form, opts.text, opts.id ?? (opts.parent ? `${opts.parent.request.id}-next` : undefined));
  if (opts.parent) req.parentRequestRef = { id: opts.parent.request.id, revision: opts.parent.request.revision };
  return assess(req, catalog(), { now: NOW, parent: opts.parent ?? null });
};

export const claim = (a: Assessment, contractOrFinding: string) =>
  a.claims.find((c) => c.contractRef?.id === contractOrFinding || c.findingRef?.id === contractOrFinding && c.kind === 'source_finding');

/** Deep-copied raw registry for SYNTHETIC mutation tests. Mutations never enter the shipped data files. */
export function syntheticRegistry(mutate: (raw: Record<string, any>) => void) {
  const raw = JSON.parse(JSON.stringify(RAW_REGISTRY)) as Record<string, any>;
  raw.manifest.revision = 'synthetic-test';
  mutate(raw);
  const r = parseRegistry(raw as RawRegistry);
  if (!r.snapshot) throw new Error('synthetic registry invalid: ' + r.errors.join('; '));
  return r.snapshot;
}

export const W1: FormChoices = { intent: 'assess_physical_model', physicalModelId: 'PM-SVI25', eventIds: ['EV-SVI-6'], quantityIds: ['Q-CO2-REMOTE-CONC'], requestedClaim: 'conditional_response', temporalScope: 'subsequent', requestedFeature: 'change' };
export const W2: FormChoices = { intent: 'assess_physical_model', physicalModelId: 'PM-SV24', quantityIds: ['Q-CO2-SOURCE-TOTAL'], requestedClaim: 'independent_prediction' };
export const W3: FormChoices = { intent: 'assess_physical_model', physicalModelId: 'PM-SVI25', eventIds: ['EV-SVI-6'], quantityIds: ['Q-HEAT-CHEMICAL-RELEASE'], requestedClaim: 'independent_prediction' };
export const BRIEF: FormChoices = { intent: 'synthesize_findings', safetyAreas: [] };
