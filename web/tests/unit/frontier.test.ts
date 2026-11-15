import { describe, expect, it } from 'vitest';
import { AXES, computeFrontier, dominates, FrontierInputError, placePoint, type AxisId, type FrontierErrorCode, type FrontierPoint, type FrontierResult, type FrontierTarget, type PlacedPoint } from '../../src/core/frontier';

const target: FrontierTarget = { o2: 34, pressure: 56.5 };
const pt = (id: string, o2: number | null, pressure: number | null, flow?: number | null): FrontierPoint => ({ id, values: { o2, pressure, flow } });
const TEST_AXES: AxisId[] = ['o2', 'pressure', 'flow'];

function expectInputError(action: () => unknown, code: FrontierErrorCode): void {
  let error: unknown;
  try { action(); } catch (caught) { error = caught; }
  expect(error).toBeInstanceOf(FrontierInputError);
  expect((error as FrontierInputError).code).toBe(code);
}

/** Independent all-pairs oracle; fixtures use small integers so native subtraction is exact. */
function assertMatchesIntegerOracle(points: FrontierPoint[], tgt: FrontierTarget): void {
  const rows = points.map((p) => {
    const axes = TEST_AXES.filter((axis) => tgt[axis] !== undefined && p.values[axis] !== undefined && p.values[axis] !== null);
    return { id: p.id, signature: axes.join('+'), gaps: axes.map((axis) => Math.abs(p.values[axis]! - tgt[axis]!)) };
  });
  type Row = (typeof rows)[number];
  const better = (a: Row, b: Row): boolean => a.signature !== '' && a.signature === b.signature
    && a.gaps.every((gap, i) => gap <= b.gaps[i]) && a.gaps.some((gap, i) => gap < b.gaps[i]);
  const expected = rows.filter((p) => p.signature !== '' && !rows.some((q) => better(q, p))).map((p) => p.id).sort();
  const result = computeFrontier(points, tgt);
  expect(result.strata.flatMap((s) => s.frontier.map((p) => p.id)).sort()).toEqual(expected);
  expect(result.unplaced).toEqual(rows.filter((p) => p.signature === '').map((p) => p.id).sort());
  const outputIds = [...result.unplaced, ...result.strata.flatMap((s) => [...s.frontier.map((p) => p.id), ...s.dominated.map((d) => d.point.id)])];
  expect(outputIds.sort()).toEqual(points.map((p) => p.id).sort());
  for (const stratum of result.strata) {
    for (const dominated of stratum.dominated) {
      expect(stratum.frontier.some((p) => p.id === dominated.dominatedBy)).toBe(true);
      expect(better(rows.find((p) => p.id === dominated.dominatedBy)!, rows.find((p) => p.id === dominated.point.id)!)).toBe(true);
    }
  }
}

function membership(result: FrontierResult): unknown {
  return {
    targetAxes: result.targetAxes,
    strata: result.strata.map((s) => ({ signature: s.signature, frontier: s.frontier.map((p) => p.id), dominated: s.dominated.map((d) => [d.point.id, d.dominatedBy]) })),
    unplaced: result.unplaced,
  };
}

function* permutations<T>(items: T[]): Generator<T[]> {
  if (items.length === 0) { yield []; return; }
  for (let i = 0; i < items.length; i += 1) {
    for (const tail of permutations([...items.slice(0, i), ...items.slice(i + 1)])) yield [items[i], ...tail];
  }
}

describe('condition-gap frontier', () => {
  it('keeps tradeoffs and gives a frontier witness for every dominated record', () => {
    const r = computeFrontier([pt('A', 31, 54.1), pt('B', 30.3, 54.6), pt('C', 22.2, 101.3), pt('D', 21, 101.3), pt('E', 22.2, null), pt('F', null, null)], target);
    expect(AXES).toEqual(TEST_AXES);
    expect(r.targetAxes).toEqual(['o2', 'pressure']);
    expect(r.strata[0].signature).toBe('o2+pressure');
    expect(r.strata[0].frontier.map((p) => p.id)).toEqual(['A', 'B']);
    expect(r.strata[0].dominated.map((d) => [d.point.id, d.dominatedBy])).toEqual([['C', 'A'], ['D', 'A']]);
    expect(r.strata[1].frontier.map((p) => p.id)).toEqual(['E']);
    expect(r.unplaced).toEqual(['F']);
  });

  it('subtracts shortest decimal representations without an arbitrary precision cutoff', () => {
    const p = placePoint(pt('X', 22.2, 101.3), target)!;
    expect(p.gaps).toEqual({ o2: 11.8, pressure: 44.8 });
    expect(p.signed).toEqual({ o2: -11.8, pressure: 44.8 });
    const symmetric = computeFrontier([pt('A', 0.1, null), pt('B', 0.5, null)], { o2: 0.3 });
    expect(symmetric.strata[0].frontier.map((p) => p.gaps.o2)).toEqual([0.2, 0.2]);
    expect(placePoint(pt('Computed', 0.1 + 0.2, null), { o2: 0.3 })!.gaps.o2).toBe(4e-17);
    const fine = computeFrontier([pt('A', 1.0000000000001, 0), pt('B', 1, 1)], { o2: 0, pressure: 0 });
    expect(fine.strata[0].frontier.map((point) => point.id)).toEqual(['B', 'A']);
    expect(fine.strata[0].dominated).toEqual([]);
  });

  it.each([
    [1e21, 9e20, 1e20], [1e-200, 2e-200, -1e-200],
    [Number.MIN_VALUE, 0, Number.MIN_VALUE], [Number.MAX_VALUE, 0, Number.MAX_VALUE], [-0, 0, 0],
  ])('handles exponent and signed-zero values: %s minus %s', (value, statedTarget, difference) => {
    const p = placePoint(pt('P', value, null), { o2: statedTarget })!;
    expect(p.signed.o2).toBe(difference);
    expect(p.gaps.o2).toBe(Math.abs(difference));
    if (difference === 0) expect(Object.is(p.signed.o2, -0)).toBe(false);
  });

  it('keeps all equal-gap records and their different signed directions', () => {
    const r = computeFrontier([pt('T1', 30, 60), pt('T2', 30, 60), pt('T3', 38, 53), pt('Far', 21, 101.3)], target);
    expect(r.strata[0].frontier.map((p) => p.id)).toEqual(['T1', 'T2', 'T3']);
    expect(r.strata[0].frontier.map((p) => p.signed)).toEqual([{ o2: -4, pressure: 3.5 }, { o2: -4, pressure: 3.5 }, { o2: 4, pressure: -3.5 }]);
    expect(r.strata[0].dominated.map((d) => d.point.id)).toEqual(['Far']);
  });

  it('keeps null/undefined missingness separate and refuses shared-axis comparisons across signatures', () => {
    const r = computeFrontier([pt('Full', 21, 101.3), pt('NoPressure', 33.9, null), { id: 'NoO2', values: { o2: undefined, pressure: 56.5 } }, { id: 'Neither', values: {} }], target);
    expect(r.strata.map((s) => s.signature)).toEqual(['o2+pressure', 'o2', 'pressure']);
    expect(r.strata.every((s) => s.frontier.length === 1)).toBe(true);
    expect(r.unplaced).toEqual(['Neither']);
    const full = r.strata[0].frontier[0], partial = r.strata[1].frontier[0];
    expect(dominates(partial, full, ['o2', 'pressure'])).toBe(false);
    expect(dominates(full, partial, ['o2', 'pressure'])).toBe(false);
    expect(dominates(partial, full, ['o2'])).toBe(false);
    const cycle = computeFrontier([pt('A', 1, null, 3), pt('B', 2, 1, null), pt('C', null, 2, 2)], { o2: 0, pressure: 0, flow: 0 });
    expect(cycle.strata).toHaveLength(3);
    expect(cycle.strata.every((s) => s.frontier.length === 1 && s.dominated.length === 0)).toBe(true);
  });

  it('only compares stated target axes and handles empty targets and cohorts', () => {
    const points = [pt('Slow', 30, 60, 5), pt('Fast', 30, 60, 50)];
    expect(computeFrontier(points, target).strata[0].frontier.map((p) => p.id)).toEqual(['Fast', 'Slow']);
    expect(computeFrontier(points, { ...target, flow: 10 }).strata[0].frontier.map((p) => p.id)).toEqual(['Slow']);
    expect(computeFrontier(points, { o2: undefined })).toEqual({ targetAxes: [], strata: [], unplaced: ['Fast', 'Slow'] });
    expect(computeFrontier([], target)).toEqual({ targetAxes: ['o2', 'pressure'], strata: [], unplaced: [] });
  });

  it.each([NaN, Infinity, -Infinity, '34', null, true])('rejects invalid target values even for an empty cohort: %s', (value) => {
    const invalid = { o2: value } as FrontierTarget;
    expectInputError(() => computeFrontier([], invalid), 'INVALID_NUMBER');
    expectInputError(() => placePoint(pt('P', 20, 50), invalid), 'INVALID_NUMBER');
  });

  it.each([NaN, Infinity, -Infinity, '20', false])('rejects invalid supplied source values even on unused axes: %s', (value) => {
    const invalid = { id: 'P', values: { o2: 20, flow: value } } as FrontierPoint;
    expectInputError(() => computeFrontier([invalid], { o2: 20 }), 'INVALID_NUMBER');
    expectInputError(() => placePoint(invalid, {}), 'INVALID_NUMBER');
  });

  it('rejects overflow instead of producing infinite gaps', () => {
    const point = pt('P', Number.MAX_VALUE, null), tgt = { o2: -Number.MAX_VALUE };
    expectInputError(() => computeFrontier([point], tgt), 'GAP_OUT_OF_RANGE');
    expectInputError(() => placePoint(point, tgt), 'GAP_OUT_OF_RANGE');
  });

  it('rejects unknown axes even when their value is missing', () => {
    expectInputError(() => computeFrontier([], { oxygen: undefined } as FrontierTarget), 'UNKNOWN_AXIS');
    expectInputError(() => placePoint({ id: 'P', values: { o2: 20, temperature: null } } as FrontierPoint, target), 'UNKNOWN_AXIS');
    const point = placePoint(pt('P', 20, 50), target)!;
    expectInputError(() => dominates(point, point, ['oxygen'] as unknown as AxisId[]), 'UNKNOWN_AXIS');
  });

  it('requires nonblank unique IDs, including unplaced records', () => {
    expectInputError(() => computeFrontier([pt('P', 20, 50), pt('P', null, null)], {}), 'DUPLICATE_ID');
    expectInputError(() => placePoint(pt('  ', 20, 50), target), 'INVALID_INPUT');
  });

  it('guards malformed containers and externally supplied comparison gaps', () => {
    expectInputError(() => computeFrontier([], null as unknown as FrontierTarget), 'INVALID_INPUT');
    expectInputError(() => computeFrontier(null as unknown as FrontierPoint[], {}), 'INVALID_INPUT');
    expectInputError(() => placePoint({ id: 'P', values: null } as unknown as FrontierPoint, target), 'INVALID_INPUT');
    const point = placePoint(pt('P', 20, 50), target)!;
    expectInputError(() => dominates({ ...point, gaps: { o2: NaN, pressure: 1 } }, point, ['o2', 'pressure']), 'INVALID_NUMBER');
    expectInputError(() => dominates({ ...point, gaps: { o2: -1, pressure: 1 } }, point, ['o2', 'pressure']), 'INVALID_NUMBER');
    expectInputError(() => dominates({ ...point, gaps: { o2: 1 } }, point, ['o2']), 'INVALID_INPUT');
    expectInputError(() => dominates(point, point, ['o2', 'o2']), 'INVALID_INPUT');
    expect(dominates(point, point, [])).toBe(false);
  });

  it('matches an independent pairwise oracle on every nonempty subset of bounded 2D/3D grids', () => {
    const grids: Array<{ points: FrontierPoint[]; target: FrontierTarget }> = [
      { points: Array.from({ length: 9 }, (_, i) => pt(`P${i}`, i % 3, Math.floor(i / 3))), target: { o2: 0, pressure: 0 } },
      { points: Array.from({ length: 8 }, (_, i) => pt(`P${i}`, i & 1, (i >> 1) & 1, (i >> 2) & 1)), target: { o2: 0, pressure: 0, flow: 0 } },
    ];
    let checked = 0;
    for (const grid of grids) for (let mask = 1; mask < 2 ** grid.points.length; mask += 1) {
      assertMatchesIntegerOracle(grid.points.filter((_, i) => (mask & (1 << i)) !== 0), grid.target);
      checked += 1;
    }
    expect(checked).toBe(766);
  });

  it('matches the independent oracle across target subsets, negative values and missingness', () => {
    for (let seed = 0; seed < 49; seed += 1) {
      const tgt = Object.fromEntries(TEST_AXES.filter((_, i) => (((seed % 7) + 1) & (1 << i)) !== 0).map((axis) => [axis, 1]));
      const points = Array.from({ length: 18 }, (_, i) => ({ id: `P${i}`, values: Object.fromEntries(TEST_AXES.map((axis, j) => [axis, (i + j + seed) % 4 === 0 ? null : (i * (j + 3) + seed) % 17 - 8])) }));
      assertMatchesIntegerOracle(points, tgt);
    }
  });

  it('keeps the entire result and chosen witnesses stable across all 720 input permutations', () => {
    const points = [pt('A', 31, 54.1), pt('B', 30.3, 54.6), pt('Atie', 31, 54.1), pt('Far', 21, 101.3), pt('Partial', 22.2, null), pt('Unplaced', null, null)];
    const expected = computeFrontier(points, target);
    let checked = 0;
    for (const permutation of permutations(points)) { expect(computeFrontier(permutation, target)).toEqual(expected); checked += 1; }
    expect(checked).toBe(720);
  });

  it('preserves membership, ties and witnesses under ordinary unit conversions and positive affine changes', () => {
    const points = [pt('A', 31, 54.1, 5), pt('B', 30.3, 54.6, 10), pt('C', 22.2, 101.3, 50), pt('Tie', 31, 54.1, 5), pt('Partial', 33.9, null)];
    const tgt: Record<AxisId, number> = { o2: 34, pressure: 56.5, flow: 10 };
    const expected = membership(computeFrontier(points, tgt));
    const changes: Array<Record<AxisId, (x: number) => number>> = [
      { o2: (x) => x / 100, pressure: (x) => x * 1000, flow: (x) => x / 100 },
      { o2: (x) => 2 * x + 10, pressure: (x) => x + 273.15, flow: (x) => 3 * x - 20 },
    ];
    for (const convert of changes) {
      const convertedTarget = Object.fromEntries(TEST_AXES.map((axis) => [axis, convert[axis](tgt[axis])]));
      const convertedPoints = points.map((p) => ({ id: p.id, values: Object.fromEntries(TEST_AXES.map((axis) => [axis, p.values[axis] == null ? p.values[axis] : convert[axis](p.values[axis]!)])) }));
      expect(membership(computeFrontier(convertedPoints, convertedTarget))).toEqual(expected);
    }
  });

  it('does not mutate frozen input and supports JSON-round-tripped placed points', () => {
    const points = Object.freeze([Object.freeze({ id: 'A', values: Object.freeze({ o2: 1, pressure: 2 }) }), Object.freeze({ id: 'B', values: Object.freeze({ o2: 2, pressure: 3 }) })]);
    const tgt = Object.freeze({ o2: 0, pressure: 0 });
    const before = JSON.stringify({ points, tgt });
    const result = computeFrontier(points, tgt);
    const [a, b] = JSON.parse(JSON.stringify([result.strata[0].frontier[0], result.strata[0].dominated[0].point])) as PlacedPoint[];
    expect(dominates(a, b, ['pressure', 'o2'])).toBe(true);
    expect(JSON.stringify({ points, tgt })).toBe(before);
  });

  it('exhibits the fixed-epsilon converse counterexample and checks one bounded adaptive choice', () => {
    const result = computeFrontier([pt('F', 35, 57.5), pt('B', 35.0000000001, 56.5)], target);
    expect(result.strata[0].frontier).toHaveLength(2);
    const f = result.strata[0].frontier.find((p) => p.id === 'F')!, b = result.strata[0].frontier.find((p) => p.id === 'B')!;
    const axes: AxisId[] = ['o2', 'pressure'];
    const ratios = (point: PlacedPoint) => axes.map((axis) => (point.gaps[axis]! + 1) / (f.gaps[axis]! + 1));
    const score = (point: PlacedPoint, epsilon: number) => Math.max(...ratios(point)) + epsilon * ratios(point).reduce((sum, value) => sum + value, 0);
    expect(score(f, 1e-9)).toBe(1.000000002);
    expect(score(b, 1e-9)).toBeLessThan(score(f, 1e-9));
    const delta = Math.max(...ratios(b)) - 1;
    expect(delta).toBeGreaterThan(0);
    const boundedEpsilon = delta / (2 * axes.length);
    expect(score(f, boundedEpsilon)).toBeLessThan(score(b, boundedEpsilon));
    // This finite fixture is a regression check; the real-arithmetic proof is in the contract.
  });
});
