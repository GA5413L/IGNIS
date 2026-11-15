import { describe, expect, it } from 'vitest';
import { auditEndpoints, CRITERIA, endpointExample, EndpointAuditRequestSchema, type EndpointAuditRequest, type EndpointStep } from '../../src/core/endpointAudit';
import { compare, decimal, fraction, type Fraction } from '../../src/core/exactDesign';

const model = (boundaryConvention: 'detected_at_or_above' | 'detected_above' | 'unspecified' = 'unspecified'): NonNullable<EndpointAuditRequest['idealizedModel']> => ({ monotoneBinaryResponse: true, fixedContextWithinRun: true, settledResponseAtEachStep: true, errorFreeDetection: true, boundaryConvention });
const spread = (request = endpointExample()) => auditEndpoints(request).runs[0].criteria.sustainedFlameSpread;
const step = (id: string, x: string, value: EndpointStep['observations']['sustainedFlameSpread']): EndpointStep => ({ id, oxygenVolPercent: x, observations: { sustainedFlameSpread: value, visibleFlame: 'unknown', fuelRegression: 'unknown' }, testEnded: false });
const withSteps = (steps: EndpointStep[]) => { const r = endpointExample(); r.runs[0].steps = steps; return r; };
const rational = (s: string): Fraction => { const [n, d = '1'] = s.split('/'); return fraction(BigInt(n), BigInt(d)); };

describe('separate observation criteria and conditional threshold mathematics', () => {
  it('keeps source composite outcomes and unpublished run data distinct from the hypothetical example', () => {
    const result = auditEndpoints(endpointExample());
    expect(result.methodologicalSource.source).toMatchObject({ version: 'accepted_manuscript', pages: 9, independentHumanReview: false });
    expect(result.methodologicalSource.endpoint).toMatchObject({ sourceCompositeRepresentableAsSingleAuditCriterion: false, perRunTransitionsAvailable: false, rawResponseValuesAdmitted: false });
    expect(result.request.dataRole).toBe('hypothetical');
    expect(result.boundaries).toMatchObject({ sourceDataReconstructed: false, extinctionDeclared: false, physicalPredictionProvided: false });
  });
  it('does not leak spread non-detection into visible-flame or fuel-regression results', () => {
    const criteria = auditEndpoints(endpointExample()).runs[0].criteria;
    expect(criteria.sustainedFlameSpread).toMatchObject({ maximumNotDetected: { oxygenVolPercent: '19', witnessStepIds: ['B'] }, minimumDetected: { oxygenVolPercent: '20', witnessStepIds: ['A'] }, orderedSeparationGapPercentagePoints: '1' });
    expect(criteria.visibleFlame).toMatchObject({ maximumNotDetected: { oxygenVolPercent: '18', witnessStepIds: ['C'] }, minimumDetected: { oxygenVolPercent: '19', witnessStepIds: ['B'] } });
    expect(criteria.fuelRegression).toMatchObject({ observationPattern: 'no_information', maximumNotDetected: null, minimumDetected: null, testEndWithoutCriterionEvidenceIds: ['C'] });
    for (const c of Object.values(criteria)) expect(c.conditionalSet.status).toBe('not_requested');
  });
  it('requires an explicit settled-response model and complete observation contract for derived sets', () => {
    const request = endpointExample(); request.idealizedModel = model();
    expect(spread(request).conditionalSet).toMatchObject({ status: 'conditional_compatibility_set', lower: { oxygenVolPercent: '19', boundary: 'undetermined' }, upper: { oxygenVolPercent: '20', boundary: 'undetermined' }, physicalThresholdEstablished: false });
    request.runs[0].operators.sustainedFlameSpread.resolutionDescription = null;
    expect(spread(request).conditionalSet).toMatchObject({ status: 'withheld_missing_observation_contract', lower: null, upper: null });
    expect(EndpointAuditRequestSchema.safeParse({ ...request, idealizedModel: { ...model(), settledResponseAtEachStep: false } }).success).toBe(false);
  });
  it.each([
    ['detected_at_or_above', 'open', 'closed'], ['detected_above', 'closed', 'open'], ['unspecified', 'undetermined', 'undetermined'],
  ] as const)('preserves boundary membership for %s', (convention, lower, upper) => {
    const request = endpointExample(); request.idealizedModel = model(convention);
    expect(spread(request).conditionalSet).toMatchObject({ lower: { boundary: lower }, upper: { boundary: upper } });
  });
  it('withholds the deterministic model for equal-coordinate and reversed detection witnesses', () => {
    for (const failedX of ['17.50', '18']) {
      const request = withSteps([step('det', '17.5', 'detected'), step('not', failedX, 'not_detected')]); request.idealizedModel = model();
      expect(spread(request)).toMatchObject({ observationPattern: 'inconsistent_with_idealized_monotone_model', orderedSeparationGapPercentagePoints: null, contradictionWitness: { notDetectedAtOrAbove: { witnessStepIds: ['not'] }, detectedAtOrBelow: { witnessStepIds: ['det'] } }, conditionalSet: { status: 'withheld_inconsistent_with_model', lower: null, upper: null } });
    }
  });
  it('keeps empty, unknown, one-sided and test-ended information distinct without domain clipping', () => {
    expect(spread(withSteps([])).observationPattern).toBe('no_information');
    const unknown = withSteps([step('u', '19', 'unknown')]); unknown.idealizedModel = model();
    expect(spread(unknown).conditionalSet.status).toBe('no_information');
    const present = withSteps([{ ...step('end', '0', 'detected'), testEnded: true }]); present.idealizedModel = model('detected_at_or_above');
    expect(spread(present)).toMatchObject({ observationPattern: 'detected_only', maximumNotDetected: null, conditionalSet: { lower: null, upper: { oxygenVolPercent: '0', boundary: 'closed' } } });
    const absent = withSteps([step('not', '100', 'not_detected')]); absent.idealizedModel = model('detected_above');
    expect(spread(absent)).toMatchObject({ observationPattern: 'not_detected_only', conditionalSet: { lower: { oxygenVolPercent: '100', boundary: 'closed' }, upper: null } });
  });
  it('reports exact step gap, preserves unknowns and does not invent a midpoint', () => {
    const r = withSteps([step('d', '17.5', 'detected'), step('u', '17.25', 'unknown'), step('n', '17', 'not_detected')]);
    expect(spread(r)).toMatchObject({ orderedSeparationGapPercentagePoints: '1/2', excludedUnknownStepIds: ['u'] });
    expect(spread(r)).not.toHaveProperty('midpoint');
    expect(spread(r).conditionalSet.confidenceInterval).toBe(false);
  });
  it('distinguishes order-free inequalities from sequence history and does not validate monotonicity', () => {
    const r = withSteps([step('a', '20', 'detected'), step('b', '19', 'detected'), step('c', '18', 'not_detected')]);
    const initial = spread(r);
    expect(initial.sequence).toMatchObject({ descendingStopAtFirstNonDetectionPattern: true, monotonicityValidated: false });
    r.runs[0].steps.reverse();
    const reversed = spread(r);
    expect(reversed.maximumNotDetected).toEqual(initial.maximumNotDetected);
    expect(reversed.minimumDetected).toEqual(initial.minimumDetected);
    expect(reversed.sequence).toMatchObject({ oxygenOrder: 'contains_increase', descendingStopAtFirstNonDetectionPattern: false, monotonicityValidated: false });
  });
  it('does not pool contradictory-looking thresholds across runs or count repeats as independent runs', () => {
    const r = endpointExample();
    r.runs.push({ ...structuredClone(r.runs[0]), id: 'other', steps: [step('other-D', '17', 'detected'), step('other-N', '16', 'not_detected')] });
    r.runs[0].steps.push({ ...r.runs[0].steps[0], id: 'A-duplicate', oxygenVolPercent: '20.0' });
    const result = auditEndpoints(r);
    expect(result.runs[0].duplicateCoordinateGroups).toEqual([{ oxygenVolPercent: '20', stepIds: ['A', 'A-duplicate'] }]);
    expect(result.runs.every((run) => run.criteria.sustainedFlameSpread.observationPattern === 'ordered_separation')).toBe(true);
    expect(result.boundaries).toMatchObject({ poolingAcrossRuns: false, independentRunsEstablished: false });
    expect(result).not.toHaveProperty('pooledThreshold');
  });
  it('matches a direct inequality oracle over all 27 three-level assignments and both boundary conventions', () => {
    const statuses = ['detected', 'not_detected', 'unknown'] as const;
    const thetaValues = ['17', '18', '18.5', '19', '19.5', '20', '21'].map(decimal);
    for (const convention of ['detected_at_or_above', 'detected_above'] as const) for (const a of statuses) for (const b of statuses) for (const c of statuses) {
      const r = withSteps([step('a', '18', a), step('b', '19', b), step('c', '20', c)]); r.idealizedModel = model(convention);
      const audit = spread(r);
      for (const theta of thetaValues) {
        const compatible = r.runs[0].steps.every((s) => {
          if (s.observations.sustainedFlameSpread === 'unknown') return true;
          const hit = convention === 'detected_at_or_above' ? compare(decimal(s.oxygenVolPercent), theta) >= 0 : compare(decimal(s.oxygenVolPercent), theta) > 0;
          return hit === (s.observations.sustainedFlameSpread === 'detected');
        });
        // Direct membership of the exposed intervals.
        const lo = audit.conditionalSet.lower, hi = audit.conditionalSet.upper;
        const membership = (audit.conditionalSet.status === 'no_information' || audit.conditionalSet.status === 'conditional_compatibility_set')
          && (!lo || compare(theta, rational(lo.oxygenVolPercent)) > 0 || (compare(theta, rational(lo.oxygenVolPercent)) === 0 && lo.boundary === 'closed'))
          && (!hi || compare(theta, rational(hi.oxygenVolPercent)) < 0 || (compare(theta, rational(hi.oxygenVolPercent)) === 0 && hi.boundary === 'closed'));
        expect(membership).toBe(compatible);
      }
    }
  });
  it('detaches source, request and output and preserves explicit partial observation contracts', () => {
    const r = endpointExample(); const before = auditEndpoints(r);
    const snapshot = JSON.stringify(before);
    before.methodologicalSource.endpoint.perRunTransitionsAvailable = true;
    before.request.runs[0].steps[0].oxygenVolPercent = '99';
    before.runs[0].criteria.sustainedFlameSpread.operator.method = 'mutated';
    expect(JSON.stringify(auditEndpoints(r))).toBe(snapshot);
    expect(CRITERIA).toHaveLength(3);
  });
});
