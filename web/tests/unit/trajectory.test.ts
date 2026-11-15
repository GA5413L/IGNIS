import { describe, expect, it } from 'vitest';
import { calculateTrajectory, trajectoryExample, type TrajectoryRequest } from '../../src/core/trajectory';
import { add, equal, fraction, mul, sub } from '../../src/core/exactDesign';

const optedIn = (): TrajectoryRequest => ({ ...trajectoryExample(), measurementAssumptions: { timestampsExact: true, positionBoundsAreAbsolute: true, sameTrackedFeatureAndCoordinateSystem: true } });
const rationalExample = (): TrajectoryRequest => ({ ...optedIn(), samples: { kind: 'rational_seconds', points: [
  { id: 'a', timeSeconds: '0', positionMM: '0', absolutePositionErrorBoundMM: '0.1' },
  { id: 'b', timeSeconds: '1/30', positionMM: '0.1', absolutePositionErrorBoundMM: '0.1' },
  { id: 'c', timeSeconds: '1', positionMM: '2.5', absolutePositionErrorBoundMM: '0.1' },
] } });

describe('tracked-coordinate arithmetic with explicit assumptions', () => {
  it('preserves frame timing exactly and does not enable measurement bounds by default', () => {
    const r = calculateTrajectory(trajectoryExample());
    expect(r.normalizedTimesSeconds.map((p) => p.timeSeconds)).toEqual(['0', '1/30', '1']);
    expect(r.windows.map((w) => w.netDisplacementPerElapsedSecond)).toEqual(['3', '5/2']);
    expect(r.windows.every((w) => w.conditionalPositionBound.status === 'not_requested')).toBe(true);
    expect(r.boundaries).toEqual({ physicalPrediction: false, measurementValidated: false, sourceDataReconstructed: false, statisticalIndependenceEstablished: false, safetyAssessment: false });
  });
  it('exposes the uncertainty amplification for short windows without inventing instantaneous signs', () => {
    const r = calculateTrajectory(optedIn());
    expect(r.windows.map((w) => w.conditionalPositionBound)).toEqual([
      { status: 'conditional_worst_case_interval', lowerMMPerS: '-3', upperMMPerS: '9', halfWidthMMPerS: '6', confidenceInterval: false },
      { status: 'conditional_worst_case_interval', lowerMMPerS: '23/10', upperMMPerS: '27/10', halfWidthMMPerS: '1/5', confidenceInterval: false },
    ]);
    expect(r.windows.every((w) => !w.instantaneousRateEstablished && !w.withinWindowMonotonicityEstablished)).toBe(true);
    expect(r.sharedEndpointPairs).toEqual([{ windowIds: ['one-frame', 'one-second'], sampleIds: ['a'] }]);
  });
  it('agrees across frame and rational-second representations, including fractional frame rates', () => {
    expect(calculateTrajectory(rationalExample()).windows).toEqual(calculateTrajectory(optedIn()).windows);
    const q = optedIn();
    if (q.samples.kind !== 'video_frames') throw new Error('fixture');
    q.samples.framesPerSecond = { numerator: '30000', denominator: '1001' };
    const r = calculateTrajectory(q);
    expect(r.normalizedTimesSeconds[1].timeSeconds).toBe('1001/30000');
    expect(r.windows[0].netDisplacementPerElapsedSecond).toBe('3000/1001');
  });
  it('is invariant to time origins and spatial offsets and scales with coordinates', () => {
    const base = rationalExample(), q = rationalExample();
    if (q.samples.kind !== 'rational_seconds') throw new Error('fixture');
    q.samples.points[0].timeSeconds = '-3'; q.samples.points[1].timeSeconds = '-89/30'; q.samples.points[2].timeSeconds = '-2';
    q.samples.points.forEach((p, i) => { p.positionMM = ['10', '10.1', '12.5'][i]; });
    expect(calculateTrajectory(q).windows).toEqual(calculateTrajectory(base).windows);
    q.samples.points.forEach((p, i) => { p.positionMM = ['20', '20.2', '25'][i]; p.absolutePositionErrorBoundMM = '0.2'; });
    expect(calculateTrajectory(q).windows[0].conditionalPositionBound).toMatchObject({ lowerMMPerS: '-6', upperMMPerS: '18' });
  });
  it('treats a backwards-moving coordinate as signed displacement, not fuel regression or extinction', () => {
    const q = optedIn(); q.samples.points[1].positionMM = '-0.1';
    const r = calculateTrajectory(q).windows[0];
    expect(r.netDisplacementPerElapsedSecond).toBe('-3');
    expect(r.conditionalPositionBound).toMatchObject({ lowerMMPerS: '-9', upperMMPerS: '3' });
    expect(r.instantaneousRateEstablished).toBe(false);
  });
  it('withholds missing bounds and incomplete contracts while never promoting metadata to validity', () => {
    const q = optedIn(); q.samples.points[1].absolutePositionErrorBoundMM = null;
    expect(calculateTrajectory(q).windows[0].conditionalPositionBound.status).toBe('withheld_missing_endpoint_bound');
    q.contract.trackedFeature = null;
    expect(calculateTrajectory(q).windows[1].conditionalPositionBound.status).toBe('withheld_missing_contract');
    q.contract.trackedFeature = 'n/a';
    expect(calculateTrajectory(q).boundaries.measurementValidated).toBe(false);
  });
  it('accepts zero asserted error without inventing uncertainty', () => {
    const q = optedIn(); q.samples.points.forEach((p) => { p.absolutePositionErrorBoundMM = '0'; });
    expect(calculateTrajectory(q).windows[0].conditionalPositionBound).toMatchObject({ lowerMMPerS: '3', upperMMPerS: '3', halfWidthMMPerS: '0' });
  });
  it('matches all four endpoint-error corners across signed positions and unequal errors', () => {
    // Independent enumeration of allowed true endpoints, using exactly representable integers.
    for (const start of [-4, 0, 3]) for (const end of [-2, 1, 5]) for (const e0 of [0, 1, 2]) for (const e1 of [0, 1, 3]) {
      const q = rationalExample();
      q.samples = { kind: 'rational_seconds', points: [
        { id: 'a', timeSeconds: '0', positionMM: String(start), absolutePositionErrorBoundMM: String(e0) },
        { id: 'b', timeSeconds: '1', positionMM: String(end), absolutePositionErrorBoundMM: String(e1) },
      ] }; q.windows = [{ id: 'test', from: 'a', to: 'b' }];
      const corners = [-1, 1].flatMap((u) => [-1, 1].map((v) => (end + v * e1) - (start + u * e0)));
      const interval = calculateTrajectory(q).windows[0].conditionalPositionBound;
      expect(interval.lowerMMPerS).toBe(String(Math.min(...corners)));
      expect(interval.upperMMPerS).toBe(String(Math.max(...corners)));
    }
  });
  it('preserves displacement telescoping without aggregating dependent bounds', () => {
    const q = rationalExample(); q.windows.push({ id: 'remaining', from: 'b', to: 'c' });
    const r = calculateTrajectory(q), a = r.windows[0], b = r.windows[2];
    expect([a.displacementMM, b.displacementMM, r.windows[1].displacementMM]).toEqual(['1/10', '12/5', '5/2']);
    expect(r.sharedEndpointPairs).toContainEqual({ windowIds: ['one-frame', 'remaining'], sampleIds: ['b'] });
  });
  it('does not alias inputs or previous returned results', () => {
    const q = optedIn(), a = calculateTrajectory(q); a.request.samples.points[0].positionMM = '999';
    expect(calculateTrajectory(q).windows[0].netDisplacementPerElapsedSecond).toBe('3');
  });
  it.each(['1e-3', 'NaN', 'Infinity', '1,2', '+1', '-0', '-0.000', ' 1', '100000', '1.0000001', 1])('rejects ambiguous or out-of-contract positions %s', (positionMM) => {
    const q = trajectoryExample(); expect(() => calculateTrajectory({ ...q, samples: { ...q.samples, points: [{ ...q.samples.points[0], positionMM }, ...q.samples.points.slice(1)] } })).toThrow();
  });
  it('rejects wrong units, undeclared data roles, model assertions and extra source/fit fields', () => {
    for (const patch of [{ positionUnit: 'px' }, { timeUnit: 'ms' }, { dataRole: 'source_observation' }, { measurementAssumptions: { timestampsExact: true } }, { rSquared: 0.992 }]) {
      expect(() => calculateTrajectory({ ...trajectoryExample(), ...patch })).toThrow();
    }
  });
  it('rejects negative position bounds and invalid rational/decimal seconds', () => {
    const q = rationalExample(); if (q.samples.kind !== 'rational_seconds') throw new Error('fixture');
    for (const t of ['1/0', '1.0', '0.03333', '-0/2', '1/1000000000', '1e-3']) {
      q.samples.points[1].timeSeconds = t; expect(() => calculateTrajectory(q)).toThrow();
    }
    const b = optedIn(); b.samples.points[0].absolutePositionErrorBoundMM = '-1'; expect(() => calculateTrajectory(b)).toThrow();
  });
  it('rejects equivalent duplicate times, unordered frames and invalid frame rates', () => {
    const q = rationalExample(); if (q.samples.kind !== 'rational_seconds') throw new Error('fixture');
    q.samples.points[1].timeSeconds = '0/30'; expect(() => calculateTrajectory(q)).toThrow();
    q.samples.points[0].timeSeconds = '1'; q.samples.points[1].timeSeconds = '30/30'; expect(() => calculateTrajectory(q)).toThrow();
    const f = optedIn(); if (f.samples.kind !== 'video_frames') throw new Error('fixture');
    f.samples.framesPerSecond.denominator = '0'; expect(() => calculateTrajectory(f)).toThrow();
    f.samples.framesPerSecond.denominator = '1'; f.samples.points[1].frameIndex = '31'; expect(() => calculateTrajectory(f)).toThrow();
  });
  it('rejects cross-record endpoints, duplicates, reversed intervals and oversized samples/windows', () => {
    for (const window of [{ id: 'w', from: 'missing', to: 'c' }, { id: 'w', from: 'c', to: 'a' }, { id: 'w', from: 'a', to: 'a' }]) {
      expect(() => calculateTrajectory({ ...optedIn(), windows: [window] })).toThrow();
    }
    const q = optedIn(); q.samples.points[1].id = 'a'; expect(() => calculateTrajectory(q)).toThrow();
    expect(() => calculateTrajectory({ ...optedIn(), windows: [q.windows[0], q.windows[0]] })).toThrow();
    const f = optedIn(); if (f.samples.kind !== 'video_frames') throw new Error('fixture');
    f.samples.points = Array.from({ length: 33 }, (_, i) => ({ ...f.samples.points[0], id: `s${i}`, frameIndex: String(i) })); f.windows = [];
    expect(() => calculateTrajectory(f)).toThrow();
    expect(() => calculateTrajectory({ ...optedIn(), windows: Array.from({ length: 33 }, (_, i) => ({ ...q.windows[0], id: `w${i}` })) })).toThrow();
  });
  it('keeps the documented interpolation counterexample a mathematical illustration, not a source model', () => {
    // f=3t-t²/2; g=f+product(t-i)/2, i=0,1,2,3. Identical samples; different derivatives at t=1.
    const nodes = [0n, 1n, 2n, 3n], half = fraction(1n, 2n);
    const base = (t: bigint) => sub(fraction(3n * t), fraction(t * t, 2n));
    const perturbation = (t: bigint) => mul(half, nodes.map((i) => fraction(t - i)).reduce(mul, fraction(1n)));
    for (const t of nodes) expect(equal(base(t), add(base(t), perturbation(t)))).toBe(true);
    const derivativeShift = mul(half, nodes.filter((i) => i !== 1n).map((i) => fraction(1n - i)).reduce(mul, fraction(1n)));
    expect(equal(derivativeShift, fraction(1n))).toBe(true);
    // This higher-degree alternative is outside the dissertation's fitted quadratic family.
    expect(equal(add(fraction(2n), derivativeShift), fraction(3n))).toBe(true);
  });
});
