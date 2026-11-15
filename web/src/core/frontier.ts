/**
 * Condition-gap frontier over an eligibility cohort supplied by the caller.
 *
 * Given a stated target (for example a habitat atmosphere) and a set of tests whose conditions
 * are documented, this module answers one question without any weights or scores:
 * "Which records are not beaten on every documented target axis by another record in this cohort?"
 *
 * It is a Pareto (skyline) computation over documented gaps. It orders documented differences
 * only. It is not a similarity score, not a comparability verdict and not a prediction.
 *
 * Rules:
 *  - Only axes the target states are compared. All supplied values are validated.
 *  - A value that is not recorded stays unknown. Tests are grouped by WHICH axes they document
 *    (their signature), and dominance is only ever evaluated inside one group. No claim is made
 *    between a fully documented test and a partly documented one.
 *  - Ties are kept: tests with identical comparison gaps are all on the frontier.
 *  - Invalid inputs throw FrontierInputError; they never become missing observations.
 *
 * Decimal policy and scientific boundaries: docs/FRONTIER_CONTRACT.md.
 */

export const AXES = ['o2', 'pressure', 'flow'] as const;
export type AxisId = (typeof AXES)[number];

export interface FrontierPoint {
  id: string;
  /** Canonical numeric value per axis, or null when the source does not record it. */
  values: Partial<Record<AxisId, number | null>>;
}

/** Only the axes present here take part. */
export type FrontierTarget = Partial<Record<AxisId, number>>;

export interface PlacedPoint {
  id: string;
  /** Documented target axes, in AXES order, joined by '+'. */
  signature: string;
  /** Absolute gap to the target on each documented axis. */
  gaps: Partial<Record<AxisId, number>>;
  /** Signed difference (test minus target) on each documented axis. */
  signed: Partial<Record<AxisId, number>>;
}

export interface DominatedPoint {
  point: PlacedPoint;
  /** One frontier test that is at least as near on every documented axis and nearer on one. */
  dominatedBy: string;
}

export interface Stratum {
  signature: string;
  axes: AxisId[];
  frontier: PlacedPoint[];
  dominated: DominatedPoint[];
}

export interface FrontierResult {
  targetAxes: AxisId[];
  /** Fully documented group first, then by number of documented axes, then by signature. */
  strata: Stratum[];
  /** Tests that document none of the target axes. */
  unplaced: string[];
}

export type FrontierErrorCode = 'INVALID_INPUT' | 'UNKNOWN_AXIS' | 'INVALID_NUMBER' | 'DUPLICATE_ID' | 'GAP_OUT_OF_RANGE';

/** A malformed supplied value is an input error, not an unreported measurement. */
export class FrontierInputError extends Error {
  constructor(public readonly code: FrontierErrorCode, message: string) {
    super(message);
    this.name = 'FrontierInputError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function validateAxisRecord(value: unknown, label: string): asserts value is Record<string, unknown> {
  if (!isRecord(value)) throw new FrontierInputError('INVALID_INPUT', `${label} must be an axis-value object.`);
  for (const axis of Reflect.ownKeys(value)) {
    if (typeof axis !== 'string' || !(AXES as readonly string[]).includes(axis)) {
      throw new FrontierInputError('UNKNOWN_AXIS', `${label} contains unknown axis ${String(axis)}.`);
    }
  }
}

function validateNumber(value: unknown, label: string): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new FrontierInputError('INVALID_NUMBER', `${label} must be a finite number.`);
  }
}

function validateTarget(target: FrontierTarget): AxisId[] {
  validateAxisRecord(target, 'Target');
  return AXES.filter((axis) => {
    const value = target[axis];
    if (value === undefined) return false;
    validateNumber(value, `Target ${axis}`);
    return true;
  });
}

function validatePoint(point: FrontierPoint): void {
  if (!isRecord(point) || typeof point.id !== 'string' || point.id.trim().length === 0) {
    throw new FrontierInputError('INVALID_INPUT', 'Every point must have a nonempty string ID.');
  }
  validateAxisRecord(point.values, `Point ${point.id} values`);
  for (const axis of AXES) {
    const value = point.values[axis];
    if (value !== null && value !== undefined) validateNumber(value, `Point ${point.id} ${axis}`);
  }
}

/** Exact base-10 representation of the finite Number's shortest round-trip decimal string. */
function decimal(value: number): { coefficient: bigint; exponent: number } {
  const [mantissa, exponent = '0'] = value.toString().split('e');
  const [whole, fraction = ''] = mantissa.split('.');
  return { coefficient: BigInt(whole + fraction), exponent: Number(exponent) - fraction.length };
}

/**
 * Subtract the declared decimal representations exactly, then convert once to a Number.
 * Comparison uses that finite Number without further rounding or a tolerance. This is a
 * representation policy, not a claim about source precision or physical uncertainty.
 */
function decimalDifference(value: number, target: number, label: string): number {
  if (!Number.isFinite(value - target)) {
    throw new FrontierInputError('GAP_OUT_OF_RANGE', `${label} difference exceeds the finite numeric range.`);
  }
  const a = decimal(value);
  const b = decimal(target);
  const exponent = Math.min(a.exponent, b.exponent);
  const coefficient = a.coefficient * 10n ** BigInt(a.exponent - exponent) - b.coefficient * 10n ** BigInt(b.exponent - exponent);
  const difference = Number(`${coefficient}e${exponent}`);
  if (!Number.isFinite(difference) || (coefficient !== 0n && difference === 0)) {
    throw new FrontierInputError('GAP_OUT_OF_RANGE', `${label} difference cannot be represented as a finite nonzero number.`);
  }
  return difference === 0 ? 0 : difference;
}

function placeValidatedPoint(p: FrontierPoint, target: FrontierTarget, targetAxes: readonly AxisId[]): PlacedPoint | null {
  const gaps: Partial<Record<AxisId, number>> = {};
  const signed: Partial<Record<AxisId, number>> = {};
  const documented: AxisId[] = [];
  for (const axis of targetAxes) {
    const v = p.values[axis];
    if (v === null || v === undefined) continue;
    const d = decimalDifference(v, target[axis]!, `Point ${p.id} ${axis}`);
    signed[axis] = d;
    gaps[axis] = Math.abs(d);
    documented.push(axis);
  }
  if (documented.length === 0) return null;
  return { id: p.id, signature: documented.join('+'), gaps, signed };
}

export function placePoint(p: FrontierPoint, target: FrontierTarget): PlacedPoint | null {
  const targetAxes = validateTarget(target);
  validatePoint(p);
  return placeValidatedPoint(p, target, targetAxes);
}

function validatePlacedGaps(point: PlacedPoint): void {
  if (!isRecord(point)) throw new FrontierInputError('INVALID_INPUT', 'A placed point must be an object.');
  validateAxisRecord(point.gaps, 'Placed point gaps');
  const axes = AXES.filter((axis) => {
    const gap = point.gaps[axis];
    if (gap === undefined) return false;
    validateNumber(gap, `Placed point ${axis} gap`);
    if (gap < 0) throw new FrontierInputError('INVALID_NUMBER', `Placed point ${axis} gap must be nonnegative.`);
    return true;
  });
  if (point.signature !== axes.join('+')) {
    throw new FrontierInputError('INVALID_INPUT', 'Placed point signature must match its documented gap axes.');
  }
}

function dominatesValidated(a: PlacedPoint, b: PlacedPoint, axes: readonly AxisId[]): boolean {
  let strictly = false;
  for (const axis of axes) {
    const ga = a.gaps[axis]!;
    const gb = b.gaps[axis]!;
    if (ga > gb) return false;
    if (ga < gb) strictly = true;
  }
  return strictly;
}

/** a dominates b: no farther on every axis of the group, and strictly nearer on at least one. */
export function dominates(a: PlacedPoint, b: PlacedPoint, axes: readonly AxisId[]): boolean {
  if (!Array.isArray(axes)) throw new FrontierInputError('INVALID_INPUT', 'Comparison axes must be an array.');
  const seen = new Set<AxisId>();
  for (const axis of axes) {
    if (!(AXES as readonly string[]).includes(axis)) throw new FrontierInputError('UNKNOWN_AXIS', `Unknown comparison axis ${String(axis)}.`);
    if (seen.has(axis)) throw new FrontierInputError('INVALID_INPUT', 'Comparison axes must be unique.');
    seen.add(axis);
  }
  validatePlacedGaps(a);
  validatePlacedGaps(b);
  const signature = AXES.filter((axis) => seen.has(axis)).join('+');
  if (axes.length === 0 || a.signature !== signature || b.signature !== signature) return false;
  return dominatesValidated(a, b, axes);
}

function compareForDisplay(axes: readonly AxisId[]) {
  return (a: PlacedPoint, b: PlacedPoint): number => {
    for (const axis of axes) {
      if (a.gaps[axis]! < b.gaps[axis]!) return -1;
      if (a.gaps[axis]! > b.gaps[axis]!) return 1;
    }
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  };
}

export function computeFrontier(points: readonly FrontierPoint[], target: FrontierTarget): FrontierResult {
  const targetAxes = validateTarget(target);
  if (!Array.isArray(points)) throw new FrontierInputError('INVALID_INPUT', 'Points must be an array.');
  const seenIds = new Set<string>();
  const groups = new Map<string, PlacedPoint[]>();
  const unplaced: string[] = [];
  for (const p of points) {
    validatePoint(p);
    if (seenIds.has(p.id)) throw new FrontierInputError('DUPLICATE_ID', `Duplicate point ID ${p.id}.`);
    seenIds.add(p.id);
    const placed = placeValidatedPoint(p, target, targetAxes);
    if (!placed) {
      unplaced.push(p.id);
      continue;
    }
    const g = groups.get(placed.signature);
    if (g) g.push(placed);
    else groups.set(placed.signature, [placed]);
  }

  const strata: Stratum[] = [];
  for (const [signature, members] of groups) {
    const axes = signature.split('+') as AxisId[];
    // After a lexicographic sort by gap, a dominator always comes earlier, and by transitivity
    // some frontier member dominates every dominated point. Each candidate searches the retained
    // frontier: one pass through candidates, but O(d*n^2) comparisons in the worst case.
    const sorted = [...members].sort(compareForDisplay(axes));
    const frontier: PlacedPoint[] = [];
    const dominated: DominatedPoint[] = [];
    for (const candidate of sorted) {
      const witness = frontier.find((f) => dominatesValidated(f, candidate, axes));
      if (witness) dominated.push({ point: candidate, dominatedBy: witness.id });
      else frontier.push(candidate);
    }
    strata.push({ signature, axes, frontier, dominated });
  }

  strata.sort((a, b) => b.axes.length - a.axes.length || (a.signature < b.signature ? -1 : a.signature > b.signature ? 1 : 0));
  unplaced.sort();
  return { targetAxes, strata, unplaced };
}
