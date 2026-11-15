import { describe, expect, it } from 'vitest';
import { assess } from '../../src/core/assess';
import { getCatalog, parseRegistry, RAW_REGISTRY, requireCatalog } from '../../src/core/registry';
import { analyzeDetector, detectorDataset, detectorDatasetSchema } from '../../src/core/detector';
import { analyzePairedDetector } from '../../src/core/pairedDetector';
import { analyzeCutoffEnvelope } from '../../src/core/cutoffEnvelope';
import { evaluatePredicate } from '../../src/core/predicates';
import { runDerivations } from '../../src/core/derive';
import { compare } from '../../src/core/revisions';
import { deriveHandling } from '../../src/core/handling';
import { payloadDigest } from '../../src/core/digest';
import type { Predicate } from '../../src/core/schemas';
import { W1, W2, W3, BRIEF, NOW, request, run, claim, syntheticRegistry } from '../helpers';

const ratioSpec = [{ id: 'D-AUDIT-RATIO', operationKey: 'ratio' as const, inputs: { numerator: 'OBS-SV6-REMOTE-TOTAL', denominator: 'OBS-SV6-PROXY-TOTAL' }, label: 'Printed source ratio' }];
const sameMeasurand: Predicate = { id: 'PR-AUDIT', description: 'Quantity, unit and basis are defined and equal', scope: 'calculation', fieldIds: [], sourceAssertionIds: [], criticalForThisUse: true,
  operation: 'same_measurand', argument: { observationIds: ['OBS-SV6-PROXY-TOTAL', 'OBS-SV6-REMOTE-TOTAL'] } };

describe('scientific catalogue and detector isolation', () => {
  it('detaches an assessment snapshot so editing it cannot alter another assessment or the catalogue identity', () => {
    const catalogue = requireCatalog();
    const before = run(W2);
    const originalPayload = before.payloadSha256;
    const observation = (before.evidenceSnapshot.observations as typeof catalogue.observations).find((row) => row.id === 'OBS-SV6-PROXY-TOTAL')!;
    expect(observation).not.toBe(catalogue.observations.find((row) => row.id === observation.id));
    observation.value!.value = 1; observation.value!.originalText = '1 g';
    const after = run(W2);
    expect(after.id).toBe(before.id);
    expect(after.payloadSha256).toBe(originalPayload);
    expect(after.derivations.find((row) => row.id.endsWith('/DV-T2-RATIO'))?.exactText).toBe('1.819397993311');
    expect(payloadDigest(before)).not.toBe(originalPayload); // edited caller copy is still detected at export
    expect(catalogue.observations.find((row) => row.id === observation.id)!.value!.value).toBe(29.9);
  });

  it('protects cached and raw catalogue records and does not expose a mutable cache wrapper', () => {
    const catalogue = requireCatalog();
    expect(Object.isFrozen(catalogue)).toBe(true);
    expect(Object.isFrozen(catalogue.observations[0])).toBe(true);
    expect(Object.isFrozen(RAW_REGISTRY)).toBe(true);
    const reply = getCatalog(); reply.snapshot = null; reply.errors.push('caller mutation');
    expect(getCatalog()).toEqual({ snapshot: catalogue, errors: [] });
  });

  it('detaches detector cells, records, source metadata and policies from subsequent operations', () => {
    const before = analyzeDetector();
    const original = JSON.stringify(before);
    const row = before.rows.find((item) => item.classification === 'below')!;
    row.measurement.value = 999;
    row.record.material = 'DBP';
    before.source.title = 'Caller copy'; before.policy.cutoffMeaning = 'Caller copy';
    expect(JSON.stringify(analyzeDetector())).toBe(original);
    expect(analyzePairedDetector().summary.pairedDifference.numerator).toBe(70);
    expect(analyzeCutoffEnvelope().summary.pairedDifferenceEnvelope.lowerNumerator).toBe(66);
    expect(Object.isFrozen(detectorDataset.records[0].channels.issScatterV)).toBe(true);
  });

  it('validates injected detector data and rejects inconsistent cache text and repeated source rows', () => {
    const inconsistent = structuredClone(detectorDataset);
    inconsistent.records[0].channels.issScatterV.value = 999;
    expect(() => analyzeDetector({}, inconsistent)).toThrow(/original numeric cache text/);
    const duplicate = structuredClone(detectorDataset);
    duplicate.records.push({ ...structuredClone(duplicate.records[0]), id: 'different-id-same-workbook-row' });
    expect(() => analyzeDetector({}, duplicate)).toThrow(/row identity/);
    const shifted = structuredClone(detectorDataset);
    shifted.records[0].channels.issScatterV.cell = 'AW999';
    expect(() => detectorDatasetSchema.parse(shifted)).toThrow(/Source cell/);
  });
});

describe('transitive scientific export dependencies', () => {
  it('includes conflicts, lineage, endpoints and parent/specimen/campaign definitions, including cycles', () => {
    const catalogue = syntheticRegistry((raw) => {
      const source = structuredClone(raw.sources.records[0]); source.id = 'SRC-AUDIT'; raw.sources.records.push(source);
      const lineage = structuredClone(raw.assertions.records[0]); lineage.id = 'AS-AUDIT';
      lineage.sourceLocators[0].source = { id: 'SRC-AUDIT', revision: source.revision };
      lineage.lineageRefs = [{ id: 'AS-M-VNORM-01', revision: 'r1' }];
      raw.assertions.records.push(lineage);
      const active = raw.assertions.records.find((row: { id: string }) => row.id === 'AS-M-VNORM-01');
      active.lineageRefs = [{ id: 'AS-AUDIT', revision: lineage.revision }]; active.conflictIds = ['CF-AUDIT'];
      raw.conflicts.records.push({ id: 'CF-AUDIT', revision: 'r1', subject: 'Synthetic audit conflict',
        assertionRefs: [{ id: active.id, revision: active.revision }, { id: lineage.id, revision: lineage.revision }],
        affectedRecordRefs: [{ id: 'OBS-SV6-PROXY-TOTAL', revision: 'r1' }], status: 'open', scope: 'Audit only', treatment: 'Preserve conflict', resolutionAssertionRef: null });
      for (const [id, kind] of [['SP-AUDIT', 'specimen'], ['CAMPAIGN-AUDIT', 'campaign'], ['EP-AUDIT', 'endpoint']]) {
        const entity = structuredClone(raw.entities.records[0]); Object.assign(entity, { id, kind, attributes: {}, sourceLocators: [] }); raw.entities.records.push(entity);
      }
      const event = raw.events.records.find((row: { id: string }) => row.id === 'EV-SV-6');
      const parent = structuredClone(event); parent.id = 'EV-AUDIT-PARENT'; raw.events.records.push(parent);
      event.parentBurnRef = { id: parent.id, revision: parent.revision };
      event.specimenRefs = [{ id: 'SP-AUDIT', revision: 'r1' }]; event.campaignRef = { id: 'CAMPAIGN-AUDIT', revision: 'r1' };
      raw.observations.records.find((row: { id: string }) => row.id === 'OBS-SV6-PROXY-TOTAL').endpointId = 'EP-AUDIT';
    });
    const result = assess(request(W2), catalogue, { now: NOW });
    const ids = new Set(Object.values(result.evidenceSnapshot).flat().map((row) => (row as { id: string }).id));
    for (const id of ['SRC-AUDIT', 'AS-AUDIT', 'CF-AUDIT', 'SP-AUDIT', 'CAMPAIGN-AUDIT', 'EP-AUDIT', 'EV-AUDIT-PARENT']) expect(ids.has(id), id).toBe(true);
    expect(result.evidenceSnapshot.conflicts).toHaveLength(1);
  });

  it('rejects dangling or stale lineage references during catalogue admission', () => {
    const raw = structuredClone(RAW_REGISTRY) as unknown as { assertions: { records: Array<{ lineageRefs: Array<{ id: string; revision: string }> }> } };
    raw.assertions.records[0].lineageRefs = [{ id: 'AS-NOT-ACQUIRED', revision: 'r1' }];
    const parsed = parseRegistry(raw as unknown as typeof RAW_REGISTRY);
    expect(parsed.snapshot).toBeNull(); expect(parsed.errors.join(' ')).toContain('AS-NOT-ACQUIRED');
  });
});

describe('unknown values and source arithmetic guards', () => {
  it('keeps equal missing units/bases unresolved rather than granting a descriptive check', () => {
    const catalogue = syntheticRegistry((raw) => {
      for (const id of ['OBS-SV6-PROXY-TOTAL', 'OBS-SV6-REMOTE-TOTAL']) {
        const row = raw.observations.records.find((r: { id: string }) => r.id === id); row.unit = null; row.basis = null;
      }
    });
    expect(evaluatePredicate(sameMeasurand, catalogue).truth).toBe('unknown');
    expect(claim(assess(request(W2), catalogue, { now: NOW }), 'AC-SV24-T2-CHECK')?.outcome).toBe('unresolved_requirement');
  });

  it('keeps known incompatibility contradicted even if another basis is unknown', () => {
    const catalogue = syntheticRegistry((raw) => {
      const a = raw.observations.records.find((r: { id: string }) => r.id === 'OBS-SV6-PROXY-TOTAL');
      const b = raw.observations.records.find((r: { id: string }) => r.id === 'OBS-SV6-REMOTE-TOTAL');
      a.unit = 'kg'; a.basis = null; b.unit = 'g';
    });
    expect(evaluatePredicate(sameMeasurand, catalogue).truth).toBe('contradicted');
  });

  it('does not make matching operator classes compatible when both boundaries are unknown', () => {
    const catalogue = syntheticRegistry((raw) => {
      const a = raw.entities.records.find((r: { id: string }) => r.id === 'Q-HEAT-SENSIBLE-CABIN');
      const b = raw.entities.records.find((r: { id: string }) => r.id === 'Q-HEAT-CHEMICAL-RELEASE');
      b.attributes.operatorClass = structuredClone(a.attributes.operatorClass);
      for (const item of [a, b]) item.attributes.boundary = { ...item.attributes.boundary, state: 'unknown', value: null, reason: 'Not acquired in synthetic audit.' };
    });
    const predicate: Predicate = { ...sameMeasurand, operation: 'operator_compatible', argument: { quantityA: 'Q-HEAT-SENSIBLE-CABIN', quantityB: 'Q-HEAT-CHEMICAL-RELEASE' } };
    expect(evaluatePredicate(predicate, catalogue).truth).toBe('unknown');
  });

  it.each(['CO2 mass: 29.9 g', '1e3 g', '29.9 to 30.0 g', '29.9 kg', '1,2 g', '30.0 g'])('refuses ambiguous or inconsistent printed input %s', (text) => {
    const catalogue = syntheticRegistry((raw) => { raw.observations.records.find((r: { id: string }) => r.id === 'OBS-SV6-PROXY-TOTAL').value.originalText = text; });
    const calculation = runDerivations(ratioSpec, catalogue)[0];
    expect(calculation.output.state).toBe('unknown'); expect(calculation.exactText).toBeNull();
    const result = assess(request(W2), catalogue, { now: NOW });
    const c = claim(result, 'AC-SV24-T2-CHECK')!;
    expect(c.outcome).toBe('unresolved_requirement'); expect(c.contractTruth).toBe('unknown');
    expect(c.authoritativeText).not.toContain('is consistent');
    expect(c.missingRequirements.join(' ')).toMatch(/Required source arithmetic/);
    expect(c.executionKind).toBe('specification');
  });

  it('rejects inconsistent observation/value units before computation', () => {
    const catalogue = syntheticRegistry((raw) => { raw.observations.records.find((r: { id: string }) => r.id === 'OBS-SV6-PROXY-TOTAL').value.unit = 'kg'; });
    expect(runDerivations(ratioSpec, catalogue)[0].output).toMatchObject({ state: 'unknown', value: null });
  });

  it('preserves the reviewed W1/W2/W3 outcomes and printed arithmetic', () => {
    const w1 = run(W1), w2 = run(W2), w3 = run(W3);
    expect(claim(w1, 'AC-SVI25-T1-LATER')?.outcome).toBe('specified_conditional_comparison');
    expect(claim(w1, 'AC-SVI25-T1-SCORE')?.outcome).toBe('unresolved_requirement');
    expect(w1.derivations.find((d) => d.operationKey === 't1_identity')).toMatchObject({ executionKind: 'specification', output: { state: 'known', value: 'identity' } });
    expect(claim(w2, 'AC-SV24-T2-CHECK')?.outcome).toBe('descriptive_consistency_check');
    expect(w2.derivations.map((d) => d.exactText)).toEqual(['1.819397993311', '54.418', '0.018']);
    expect(w2.derivations.every((d) => d.operationRevision === 'ops-2')).toBe(true);
    expect(claim(w3, 'AC-SVI25-T4-BURNING')?.outcome).toBe('incompatible_requested_claim');
    expect(w3.derivations).toEqual([]);
  });
});

describe('scientific request and revision completeness', () => {
  it('requires clarification for unsupported exclusions and numeric constraints without pretending to filter background evidence', () => {
    const excluded = request({ ...W2, explicitExclusions: ['SAME'] });
    expect(deriveHandling(excluded.proposal).handling).toBe('clarification_needed');
    expect(assess(excluded, requireCatalog(), { now: NOW }).claims.some((row) => row.kind === 'contract')).toBe(false);
    const constrained = request(BRIEF);
    constrained.proposal.constraints = [{ fieldId: 'PH-OXYGEN', value: { state: 'known', value: 100, unit: '%', basis: 'mole percent', originalText: '100%', originalUnit: '%', uncertaintyText: null, reason: null, evidence: [] }, provenance: 'user_explicit', rawSpan: '100% oxygen', hypothetical: true }];
    const result = assess(constrained, requireCatalog(), { now: NOW });
    expect(result.handling.handling).toBe('clarification_needed');
    const revision = compare(run(BRIEF), result);
    expect(revision.changedFields).toContain('constraints');
    expect(result.request.proposal.constraints[0].value.value).toBe(100);
  });

  it('does not imply full coverage when only one of two requested quantities has contracts', () => {
    const result = run({ ...W2, quantityIds: ['Q-CO2-SOURCE-TOTAL', 'Q-SMOKE-PARTICLE-SIZE'] });
    expect(result.handling.handling).toBe('clarification_needed');
    expect(result.handling.reasons.join(' ')).toMatch(/Only part.*quantity/);
    expect(result.claims.some((row) => row.kind === 'contract')).toBe(false);
    expect(result.request.proposal.quantityIds).toHaveLength(2);
  });

  it('does not substitute Saffire V event6 arithmetic for a selected Saffire VI event', () => {
    const result = run({ ...W2, eventIds: ['EV-SVI-5'] });
    expect(result.handling.handling).toBe('clarification_needed');
    expect(result.handling.reasons.join(' ')).toMatch(/outside.*investigation/);
    expect(result.derivations).toEqual([]);
    expect(result.request.proposal.eventIds).toEqual(['EV-SVI-5']);
  });

  it('reports changed qualifications with full old/new details even when route and main wording match', () => {
    const before = run(W2);
    const catalogue = syntheticRegistry((raw) => { raw.assertions.records.find((r: { id: string }) => r.id === 'AS-M-VNORM-01').qualifications.push('Synthetic audit: additional measurement-window restriction.'); });
    const after = assess(request(W2), catalogue, { now: NOW });
    const diff = compare(before, after);
    expect(diff.affectedClaimIds).toContain('CL-FD-M-V-NORM-01');
    expect(diff.unchangedClaimIds).not.toContain('CL-FD-M-V-NORM-01');
    expect(diff.changedFields).toContain('catalogue_source_basis');
    const witness = diff.witnesses.find((w) => w.affectedRef.id === 'FD-M-V-NORM-01')!;
    expect(witness.newConclusion).toContain('additional measurement-window restriction');
    expect(witness.previousConclusion).not.toContain('additional measurement-window restriction');
    expect(witness.assumption).toContain('qualifications');
  });

  it('reports changed predicate reasons and consumed revisions without changing a scientific outcome', () => {
    const before = run(W2), after = structuredClone(before);
    const c = after.claims.find((row) => row.kind === 'contract')!;
    c.predicateResults[0].reason = 'Synthetic audit: same truth, newly restricted source statement.';
    c.consumedRefs[0].revision = 'r2';
    const diff = compare(before, after);
    expect(diff.affectedClaimIds).toContain(c.id);
    const witness = diff.witnesses.find((w) => w.affectedRef.id === c.contractRef!.id)!;
    expect(witness.newConclusion).toContain('newly restricted source statement');
    expect(witness.newConclusion).toContain('r2');
    expect(witness.previousConclusion).not.toContain('newly restricted source statement');
  });
});
