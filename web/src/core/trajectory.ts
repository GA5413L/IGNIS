/** Net displacement arithmetic on supplied coordinates; not an instantaneous-velocity estimator. */
import { z } from 'zod';
import { add, compare, decimal, div, fraction, mul, neg, rationalString, sub, type Fraction } from './exactDesign';

export const TRAJECTORY_REVISION = 'trajectory-ops-2026-11-15.1';
export const MAX_TRAJECTORY_BYTES = 32 * 1024;
const id = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,47}$/);
const text = z.string().trim().min(1).max(300).nullable();
const exactDecimal = z.string().regex(/^(?:0|[1-9]\d{0,4})(?:\.\d{1,6})?$/);
const signedDecimal = z.string().regex(/^-?(?:0|[1-9]\d{0,4})(?:\.\d{1,6})?$/).refine((s) => !/^-0(?:\.0+)?$/.test(s), 'Use unsigned zero.');
const unsignedInteger = z.string().regex(/^(?:0|[1-9]\d{0,8})$/);
const positiveInteger = z.string().regex(/^[1-9]\d{0,8}$/);
const rationalTime = z.string().regex(/^-?(?:0|[1-9]\d{0,8})(?:\/[1-9]\d{0,8})?$/).refine((s) => !/^-0(?:\/\d+)?$/.test(s), 'Use unsigned zero.');
const point = z.object({ id, positionMM: signedDecimal, absolutePositionErrorBoundMM: exactDecimal.nullable() }).strict();
const samples = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('rational_seconds'), points: z.array(point.extend({ timeSeconds: rationalTime }).strict()).min(2).max(32) }).strict(),
  z.object({
    kind: z.literal('video_frames'),
    framesPerSecond: z.object({ numerator: positiveInteger, denominator: positiveInteger }).strict(),
    points: z.array(point.extend({ frameIndex: unsignedInteger }).strict()).min(2).max(32),
  }).strict(),
]);

function rational(value: string): Fraction {
  const [n, d = '1'] = value.split('/'); return fraction(BigInt(n), BigInt(d));
}
function signed(value: string): Fraction { return value.startsWith('-') ? neg(decimal(value.slice(1))) : decimal(value); }
function sampleTimes(input: z.infer<typeof samples>) {
  if (input.kind === 'rational_seconds') return input.points.map((p) => rational(p.timeSeconds));
  const period = fraction(BigInt(input.framesPerSecond.denominator), BigInt(input.framesPerSecond.numerator));
  return input.points.map((p) => mul(fraction(BigInt(p.frameIndex)), period));
}
export const TrajectoryRequestSchema = z.object({
  schemaVersion: z.literal('ignis-trajectory-request-1'),
  dataRole: z.enum(['hypothetical', 'user_supplied_unverified']),
  runId: id, phaseId: id, lineageDescription: text,
  positionUnit: z.literal('mm'), timeUnit: z.literal('s'),
  contract: z.object({ trackedFeature: text, positiveAxis: text, spatialCalibration: text, timeOrigin: text, phaseSelection: text }).strict(),
  measurementAssumptions: z.object({
    timestampsExact: z.literal(true), positionBoundsAreAbsolute: z.literal(true), sameTrackedFeatureAndCoordinateSystem: z.literal(true),
  }).strict().nullable(),
  samples,
  windows: z.array(z.object({ id, from: id, to: id }).strict()).max(32),
}).strict().superRefine((request, ctx) => {
  const times = sampleTimes(request.samples), ids = new Map<string, number>();
  request.samples.points.forEach((p, i) => {
    if (ids.has(p.id)) ctx.addIssue({ code: 'custom', path: ['samples', 'points', i, 'id'], message: 'Sample IDs must be unique.' });
    ids.set(p.id, i);
    if (i && compare(times[i], times[i - 1]) <= 0) ctx.addIssue({ code: 'custom', path: ['samples', 'points', i], message: 'Sample times must be strictly increasing; no silent sorting or duplicate averaging.' });
  });
  const windows = new Set<string>();
  request.windows.forEach((w, i) => {
    if (windows.has(w.id)) ctx.addIssue({ code: 'custom', path: ['windows', i, 'id'], message: 'Window IDs must be unique.' });
    windows.add(w.id);
    const a = ids.get(w.from), b = ids.get(w.to);
    if (a === undefined || b === undefined || b <= a) ctx.addIssue({ code: 'custom', path: ['windows', i], message: 'Window endpoints must be distinct samples in this run and phase, in forward time order.' });
  });
});
export type TrajectoryRequest = z.infer<typeof TrajectoryRequestSchema>;

export function calculateTrajectory(input: unknown) {
  const request = TrajectoryRequestSchema.parse(input);
  const times = sampleTimes(request.samples), points = request.samples.points;
  const missingContract = Object.entries(request.contract).filter(([, value]) => value === null).map(([key]) => key);
  const windows = request.windows.map((window) => {
    const i = points.findIndex((p) => p.id === window.from), j = points.findIndex((p) => p.id === window.to);
    const elapsed = sub(times[j], times[i]);
    const displacement = sub(signed(points[j].positionMM), signed(points[i].positionMM));
    const rate = div(displacement, elapsed);
    const e0 = points[i].absolutePositionErrorBoundMM, e1 = points[j].absolutePositionErrorBoundMM;
    const status = !request.measurementAssumptions ? 'not_requested' : missingContract.length ? 'withheld_missing_contract'
      : e0 === null || e1 === null ? 'withheld_missing_endpoint_bound' : 'conditional_worst_case_interval';
    const halfWidth = status === 'conditional_worst_case_interval' ? div(add(decimal(e0!), decimal(e1!)), elapsed) : null;
    return {
      ...window, elapsedSeconds: rationalString(elapsed), displacementMM: rationalString(displacement),
      netDisplacementPerElapsedSecond: rationalString(rate), unit: 'mm/s' as const,
      interpretation: 'Net displacement divided by elapsed time for the supplied tracked coordinate; no instantaneous-rate or physical-front validation.',
      conditionalPositionBound: {
        status, lowerMMPerS: halfWidth ? rationalString(sub(rate, halfWidth)) : null,
        upperMMPerS: halfWidth ? rationalString(add(rate, halfWidth)) : null,
        halfWidthMMPerS: halfWidth ? rationalString(halfWidth) : null,
        confidenceInterval: false,
      },
      instantaneousRateEstablished: false, withinWindowMonotonicityEstablished: false,
    };
  });
  const sharedEndpointPairs = windows.flatMap((a, i) => windows.slice(i + 1).flatMap((b) => {
    const sampleIds = [a.from, a.to].filter((value) => value === b.from || value === b.to);
    return sampleIds.length ? [{ windowIds: [a.id, b.id], sampleIds }] : [];
  }));
  return {
    schemaVersion: 'ignis-trajectory-result-1' as const, methodRevision: TRAJECTORY_REVISION,
    label: 'Arithmetic on supplied coordinates; measurement validity unverified.',
    request: structuredClone(request), missingContract,
    normalizedTimesSeconds: points.map((p, i) => ({ sampleId: p.id, timeSeconds: rationalString(times[i]) })),
    windows, sharedEndpointPairs,
    interpretationLimits: [
      'A supplied run/phase/lineage label or complete metadata does not establish experimental validity or independence.',
      'Error bounds are asserted absolute endpoint bounds, not standard deviations or estimated confidence. Calibration, tracking and scale errors must already be covered by those bounds.',
      'Frame-rate timing assumes the supplied rate is exact and indices refer to correctly timed acquisition frames. Dropped/duplicated frames, clock drift, timestamp rounding and timing error are not estimated.',
      'Worst-case intervals need no probabilistic independence assumption. They may be conservative for common offsets, and adjacent windows can share endpoint errors.',
      'The bound half-width is (e_from + e_to)/elapsed; shorter windows amplify asserted coordinate uncertainty.',
      'An interval excluding zero does not rule out reversals or identify an instantaneous derivative, spread cessation, fuel regression or extinction.',
      'No smoothing, polynomial fitting, source trajectory reconstruction, oxygen alignment, HRR calculation or automatic cross-run pooling is performed.',
    ],
    boundaries: { physicalPrediction: false, measurementValidated: false, sourceDataReconstructed: false, statisticalIndependenceEstablished: false, safetyAssessment: false },
  };
}

export function trajectoryExample(): TrajectoryRequest {
  return {
    schemaVersion: 'ignis-trajectory-request-1', dataRole: 'hypothetical', runId: 'example-run', phaseId: 'example-phase',
    lineageDescription: 'Constructed coordinates, not dissertation measurements.', positionUnit: 'mm', timeUnit: 's',
    contract: { trackedFeature: 'Hypothetical image feature', positiveAxis: 'Positive coordinate along the example axis', spatialCalibration: 'Hypothetical coordinates expressed in mm; no actual camera calibration', timeOrigin: 'Frame zero in a hypothetical constant-rate acquisition', phaseSelection: 'One explicitly constructed phase' },
    measurementAssumptions: null,
    samples: { kind: 'video_frames', framesPerSecond: { numerator: '30', denominator: '1' }, points: [
      { id: 'a', frameIndex: '0', positionMM: '0', absolutePositionErrorBoundMM: '0.1' },
      { id: 'b', frameIndex: '1', positionMM: '0.1', absolutePositionErrorBoundMM: '0.1' },
      { id: 'c', frameIndex: '30', positionMM: '2.5', absolutePositionErrorBoundMM: '0.1' },
    ] },
    windows: [{ id: 'one-frame', from: 'a', to: 'b' }, { id: 'one-second', from: 'a', to: 'c' }],
  };
}
