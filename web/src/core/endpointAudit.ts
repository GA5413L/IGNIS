/** Observation-level criterion audit; optional idealized compatibility sets, never a physical extinction verdict. */
import { z } from 'zod';
import sourceData from '../../data/endpoint-studies/liveretou2024.json';
import { compare, decimal, rationalString, sub } from './exactDesign';

export const ENDPOINT_AUDIT_REVISION = 'endpoint-audit-2026-11-15.1';
export const MAX_ENDPOINT_STEPS = 64;
export const CRITERIA = Object.freeze(['sustainedFlameSpread', 'visibleFlame', 'fuelRegression'] as const);
type Criterion = (typeof CRITERIA)[number];
const id = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,47}$/);
const exact = z.string().regex(/^(?:0|[1-9]\d{0,4})(?:\.\d{1,6})?$/);
const bounded = (maximum: string, positive: boolean) => exact.refine((value) => {
  try { const n = decimal(value); return (!positive || n.n > 0n) && compare(n, decimal(maximum)) <= 0; }
  catch { return false; }
}, 'Use a bounded exact decimal string in the stated units.');
const status = z.enum(['detected', 'not_detected', 'unknown']);
const operator = z.object({
  method: z.string().trim().min(1).max(160).nullable(),
  windowSeconds: bounded('86400', true).nullable(),
  resolutionDescription: z.string().trim().min(1).max(240).nullable(),
}).strict();
export const EndpointStepSchema = z.object({
  id, oxygenVolPercent: bounded('100', false),
  observations: z.object({ sustainedFlameSpread: status, visibleFlame: status, fuelRegression: status }).strict(),
  testEnded: z.boolean(),
}).strict();
const runSchema = z.object({
  id, contextDescription: z.string().trim().min(1).max(400).nullable(),
  operators: z.object({ sustainedFlameSpread: operator, visibleFlame: operator, fuelRegression: operator }).strict(),
  steps: z.array(EndpointStepSchema).max(MAX_ENDPOINT_STEPS),
}).strict();
export const EndpointAuditRequestSchema = z.object({
  schemaVersion: z.literal('ignis-endpoint-audit-request-1'),
  dataRole: z.enum(['hypothetical', 'user_supplied_unverified']),
  runs: z.array(runSchema).max(8),
  idealizedModel: z.object({
    monotoneBinaryResponse: z.literal(true), fixedContextWithinRun: z.literal(true),
    settledResponseAtEachStep: z.literal(true), errorFreeDetection: z.literal(true),
    boundaryConvention: z.enum(['detected_at_or_above', 'detected_above', 'unspecified']),
  }).strict().nullable(),
}).strict().superRefine((request, context) => {
  const runIds = new Set<string>();
  let total = 0;
  request.runs.forEach((run, i) => {
    if (runIds.has(run.id)) context.addIssue({ code: 'custom', path: ['runs', i, 'id'], message: 'Run IDs must be unique.' });
    runIds.add(run.id);
    const stepIds = new Set<string>();
    run.steps.forEach((step, j) => {
      if (stepIds.has(step.id)) context.addIssue({ code: 'custom', path: ['runs', i, 'steps', j, 'id'], message: 'Step IDs must be unique within a run.' });
      stepIds.add(step.id);
    });
    total += run.steps.length;
  });
  if (total > MAX_ENDPOINT_STEPS) context.addIssue({ code: 'custom', path: ['runs'], message: 'At most 64 steps in total, across all runs.' });
});
export type EndpointAuditRequest = z.infer<typeof EndpointAuditRequestSchema>;
export type EndpointRun = EndpointAuditRequest['runs'][number];
export type EndpointStep = EndpointRun['steps'][number];
const source = structuredClone(sourceData);

function extremum(steps: EndpointStep[], direction: 'minimum' | 'maximum') {
  if (!steps.length) return null;
  let bound = decimal(steps[0].oxygenVolPercent);
  for (const step of steps.slice(1)) {
    const value = decimal(step.oxygenVolPercent);
    if (compare(value, bound) === (direction === 'minimum' ? -1 : 1)) bound = value;
  }
  return { value: bound, oxygenVolPercent: rationalString(bound), witnessStepIds: steps.filter((step) => compare(decimal(step.oxygenVolPercent), bound) === 0).map((step) => step.id) };
}
function exported(bound: ReturnType<typeof extremum>) {
  return bound ? { oxygenVolPercent: bound.oxygenVolPercent, witnessStepIds: [...bound.witnessStepIds] } : null;
}
function sequence(run: EndpointRun, criterion: Criterion) {
  const steps = run.steps;
  const changes = steps.slice(1).map((step, i) => compare(decimal(step.oxygenVolPercent), decimal(steps[i].oxygenVolPercent)));
  const oxygenOrder = steps.length < 2 ? 'too_few_steps' : changes.every((c) => c === -1) ? 'strictly_decreasing' : changes.every((c) => c <= 0) ? 'nonincreasing_with_repeats' : 'contains_increase';
  const known = steps.filter((step) => step.observations[criterion] !== 'unknown');
  const firstNot = known.findIndex((step) => step.observations[criterion] === 'not_detected');
  const firstNonDetectionAtLastKnownStep = firstNot > 0 && firstNot === known.length - 1;
  return {
    oxygenOrder, firstNonDetectionAtLastKnownStep,
    descendingStopAtFirstNonDetectionPattern: oxygenOrder === 'strictly_decreasing' && firstNonDetectionAtLastKnownStep,
    monotonicityValidated: false,
    note: 'A descending record ending at first non-detection automatically separates the observed levels. It does not test steady-state monotonicity. Later non-detections after flame-out can reflect history or an absorbing state.',
  };
}
function auditCriterion(run: EndpointRun, criterion: Criterion, model: EndpointAuditRequest['idealizedModel']) {
  const detected = run.steps.filter((step) => step.observations[criterion] === 'detected');
  const notDetected = run.steps.filter((step) => step.observations[criterion] === 'not_detected');
  const unknown = run.steps.filter((step) => step.observations[criterion] === 'unknown');
  const lower = extremum(notDetected, 'maximum'), upper = extremum(detected, 'minimum');
  const inconsistent = lower !== null && upper !== null && compare(lower.value, upper.value) >= 0;
  const observationPattern = inconsistent ? 'inconsistent_with_idealized_monotone_model'
    : lower && upper ? 'ordered_separation' : lower ? 'not_detected_only' : upper ? 'detected_only' : 'no_information';
  const contract = run.operators[criterion];
  const missingContract = [
    ...(run.contextDescription === null ? ['contextDescription'] : []),
    ...Object.entries(contract).filter(([, value]) => value === null).map(([key]) => `operators.${criterion}.${key}`),
  ];
  const conditionalStatus = !model ? 'not_requested' : !lower && !upper ? 'no_information'
    : missingContract.length ? 'withheld_missing_observation_contract' : inconsistent ? 'withheld_inconsistent_with_model' : 'conditional_compatibility_set';
  const enabled = conditionalStatus === 'conditional_compatibility_set';
  const boundary = (side: 'lower' | 'upper') => !model || model.boundaryConvention === 'unspecified' ? 'undetermined'
    : ((side === 'lower') === (model.boundaryConvention === 'detected_above')) ? 'closed' : 'open';
  const exportBound = (bound: ReturnType<typeof extremum>, side: 'lower' | 'upper') => bound ? { ...exported(bound)!, boundary: boundary(side) } : null;
  return {
    criterion, operator: { ...contract }, observationPattern,
    counts: { detected: detected.length, notDetected: notDetected.length, unknown: unknown.length },
    maximumNotDetected: exported(lower), minimumDetected: exported(upper),
    chronology: { lastDetectedStepId: detected.at(-1)?.id ?? null, firstNotDetectedStepId: notDetected[0]?.id ?? null },
    orderedSeparationGapPercentagePoints: lower && upper && !inconsistent ? rationalString(sub(upper.value, lower.value)) : null,
    contradictionWitness: inconsistent ? { notDetectedAtOrAbove: exported(lower), detectedAtOrBelow: exported(upper) } : null,
    excludedUnknownStepIds: unknown.map((step) => step.id),
    testEndWithoutCriterionEvidenceIds: unknown.filter((step) => step.testEnded).map((step) => step.id),
    sequence: sequence(run, criterion),
    conditionalSet: {
      status: conditionalStatus, target: 'idealized_detection_transition_parameter', missingContract,
      lower: enabled ? exportBound(lower, 'lower') : null,
      upper: enabled ? exportBound(upper, 'upper') : null,
      intervalMeaning: !model ? 'No idealized parameter set requested.' : model.boundaryConvention === 'unspecified' ? 'Closed enclosure only; boundary membership convention is unspecified.' : 'Exact open/closed inequalities only within the declared idealized model.',
      confidenceInterval: false, physicalThresholdEstablished: false,
    },
    criterionCaveat: criterion === 'fuelRegression'
      ? 'Fuel regression under external heating need not be monotone in oxygen or establish flaming combustion; the model requires separate justification.'
      : criterion === 'visibleFlame' ? 'Failure to detect a flame does not prove that all combustion or fuel regression has ceased.'
      : 'Spread detection depends on spatial resolution and observation duration; no detected spread does not prove zero regression or no flame.',
  };
}

export function auditEndpoints(input: unknown) {
  const request = EndpointAuditRequestSchema.parse(input);
  return {
    schemaVersion: 'ignis-endpoint-audit-1' as const, methodRevision: ENDPOINT_AUDIT_REVISION,
    request: structuredClone(request), methodologicalSource: structuredClone(source),
    sourceAssociation: 'Methodological context only. Submitted steps are not reconstructed LIV24 observations.',
    runs: request.runs.map((run) => {
      const coordinates = new Map<string, string[]>();
      for (const step of run.steps) {
        const key = rationalString(decimal(step.oxygenVolPercent));
        coordinates.set(key, [...coordinates.get(key) ?? [], step.id]);
      }
      return {
        id: run.id, contextDescription: run.contextDescription, suppliedStepCount: run.steps.length,
        uniqueOxygenCoordinateCount: coordinates.size,
        duplicateCoordinateGroups: [...coordinates].filter(([, ids]) => ids.length > 1).map(([oxygenVolPercent, stepIds]) => ({ oxygenVolPercent, stepIds })),
        criteria: Object.fromEntries(CRITERIA.map((criterion) => [criterion, auditCriterion(run, criterion, request.idealizedModel)])) as Record<Criterion, ReturnType<typeof auditCriterion>>,
      };
    }),
    boundaries: {
      physicalPredictionProvided: false, extinctionDeclared: false, safetyAssessmentProvided: false,
      sourceDataReconstructed: false, poolingAcrossRuns: false, independentRunsEstablished: false,
      physicalValidation: 'NOT RUN', independentHumanReview: 'NOT RUN',
      statements: [
        'Detected/not-detected statuses concern a stated observation method, window and resolution; no automatic implications are made between criteria.',
        'Test termination alone is not a non-detection or extinction observation. Unknowns impose no inequality.',
        'The source reports a combined outcome and aggregate statistics; these do not identify individual transitions or a complete-extinction threshold.',
        'Conditional sets require settled, error-free observations of a monotone binary response in fixed context. The source does not establish these assumptions.',
        'Burn history, changing local heating and post-extinction hysteresis may defeat the model. An inconsistency is a model-assumption conflict, not a declaration that the data are erroneous.',
        'Gaps describe the supplied coordinate schedule. They are not uncertainty estimates, confidence intervals, recommendations or material constants.',
        'Run IDs are supplied labels, not verified independence groups. No global threshold is calculated.',
      ],
    },
  };
}
export type EndpointAuditResult = ReturnType<typeof auditEndpoints>;

/** Deliberately hypothetical; no values digitized or inferred from the manuscript. */
export function endpointExample(): EndpointAuditRequest {
  const contract = { method: 'Hypothetical observer', windowSeconds: '60', resolutionDescription: 'Hypothetical fixed detection rule; no instrument calibration established' };
  return {
    schemaVersion: 'ignis-endpoint-audit-request-1', dataRole: 'hypothetical', idealizedModel: null,
    runs: [{ id: 'hypothetical-run', contextDescription: 'Mathematical example; not a material test or experiment protocol',
      operators: { sustainedFlameSpread: { ...contract }, visibleFlame: { ...contract }, fuelRegression: { method: null, windowSeconds: null, resolutionDescription: null } },
      steps: [
        { id: 'A', oxygenVolPercent: '20', observations: { sustainedFlameSpread: 'detected', visibleFlame: 'detected', fuelRegression: 'unknown' }, testEnded: false },
        { id: 'B', oxygenVolPercent: '19', observations: { sustainedFlameSpread: 'not_detected', visibleFlame: 'detected', fuelRegression: 'unknown' }, testEnded: false },
        { id: 'C', oxygenVolPercent: '18', observations: { sustainedFlameSpread: 'not_detected', visibleFlame: 'not_detected', fuelRegression: 'unknown' }, testEnded: true },
      ],
    }],
  };
}
