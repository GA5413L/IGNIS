/** Same-row, same-operator channel differences. Descriptive arithmetic, never predictive validation. */
import { z } from 'zod';
import { digestOf } from './canonicalize';
import { inspectCsv, makeWorkbenchPackage, MAX_WORKBENCH_PACKAGE_BYTES, parseCsv, replayWorkbenchPackage, validateImportSpec, ViewRecipeSchema,
  type CsvDocument, type ImportSpec, type ViewRecipe, type WorkbenchPackage } from './workbench';

export const DIFFERENCE_METHOD = 'paired-channel-differences-2026-11-15.2';
const unknown = (s: string | null) => s === null || /^(unknown|unspecified|n\/a|not known)$/i.test(s.trim());
export const PairingSchema = z.strictObject({ leftColumn: z.number().int().min(0).max(31), rightColumn: z.number().int().min(0).max(31),
  alignedByRecord: z.literal(true), linearAdditiveQuantity: z.literal(true), sharedReferenceDatum: z.literal(true),
  referenceDatum: z.string().trim().min(1).max(500).refine((s) => !unknown(s), 'Describe the shared reference or datum; unknown is insufficient.'),
  upstreamProcessing: z.string().min(1).max(1000).refine((s) => s.trim().length > 0) });
export type Pairing = z.infer<typeof PairingSchema>;

/** Neumaier compensation retains small residuals that ordinary or Kahan sums can lose. */
const sum = (values: Iterable<number>): number | null => {
  let total = 0, correction = 0;
  for (const value of values) {
    const next = total + value;
    if (!Number.isFinite(next)) return null;
    correction += Math.abs(total) >= Math.abs(value) ? (total - next) + value : (value - next) + total;
    if (!Number.isFinite(correction)) return null;
    total = next;
  }
  const result = total + correction;
  return Number.isFinite(result) ? result : null;
};

// A single compensation can itself lose a small residual when cancellations span
// several scales. Keep non-overlapping residuals for the signed total. With the
// larger operand first, low retains the rounding remainder of each finite addition.
const signedSum = (values: Iterable<number>): number | null => {
  const partials: number[] = [];
  for (let value of values) {
    let kept = 0;
    for (let i = 0; i < partials.length; i++) {
      let other = partials[i];
      if (Math.abs(value) < Math.abs(other)) [value, other] = [other, value];
      const high = value + other;
      if (!Number.isFinite(high)) return null;
      const low = other - (high - value);
      if (low !== 0) partials[kept++] = low;
      value = high;
    }
    partials.length = kept;
    partials.push(value);
  }
  return sum(partials);
};

// Cancel opposite signs before an avoidable overflowing partial sum. Only summation
// order changes: paired source records, their order and their differences stay intact.
function* balanced(values: number[]): Generator<number> {
  const positive = values.filter((v) => v >= 0), negative = values.filter((v) => v < 0);
  let partial = 0;
  while (positive.length || negative.length) {
    const value = (partial >= 0 && negative.length) || !positive.length ? negative.pop()! : positive.pop()!;
    partial += value;
    yield value;
  }
}

export function channelDifferences(document: CsvDocument, inputSpec: unknown, inputRecipe: unknown, inputPairing: unknown) {
  const original = parseCsv(new TextEncoder().encode(document.rawText), document.delimiter);
  if (original.sha256 !== document.sha256 || original.byteCount !== document.byteCount) throw new Error('Raw CSV no longer matches its byte receipt.');
  const spec = validateImportSpec(original, inputSpec), recipe = ViewRecipeSchema.parse(inputRecipe), pairing = PairingSchema.parse(inputPairing);
  if (recipe.run === null || recipe.phase === null) throw new Error('Select one explicit run and phase before comparing channels.');
  if (pairing.leftColumn === pairing.rightColumn) throw new Error('Choose two distinct channels.');
  const a = spec.channels.find((c) => c.column === pairing.leftColumn), b = spec.channels.find((c) => c.column === pairing.rightColumn);
  if (!a || !b || !recipe.channels.includes(a.column) || !recipe.channels.includes(b.column)) throw new Error('Both channels must be in the confirmed mapping and current view.');
  const blockers: string[] = [];
  if (unknown(a.quantity) || unknown(b.quantity) || a.quantity.trim() !== b.quantity.trim()) blockers.push('Declare the same physical quantity for both channels.');
  if (unknown(a.unit) || unknown(b.unit) || a.unit.trim() !== b.unit.trim()) blockers.push('Units must be explicitly identical; no conversion is performed.');
  if (unknown(a.operator) || unknown(b.operator) || a.operator?.trim() !== b.operator?.trim()) blockers.push('Measurement operators must be explicitly identical. Equal units alone are insufficient.');
  if (unknown(spec.timeOrigin) || unknown(spec.timeUnit) || unknown(spec.context)) blockers.push('Declare the shared clock origin, time unit and experimental/solver context.');
  const inspection = inspectCsv(original, spec, recipe), selected = inspection.rows.filter((r) => r.included);
  if (selected.some((r) => r.timeFlags.length)) blockers.push('This tool\'s comparison policy blocks aggregates for repeated or decreasing time coordinates pending upstream review. Row subtraction is not mathematically undefined for that reason. No records are sorted or deduplicated.');
  const pairs = selected.map((r) => {
    const left = r.values.find((v) => v.column === a.column)!.cell, right = r.values.find((v) => v.column === b.column)!.cell;
    const delta = !blockers.length && left.value !== null && right.value !== null ? left.value - right.value : null;
    return { record: r.record, lineStart: r.lineStart, lineEnd: r.lineEnd, byteStart: r.byteStart, byteEnd: r.byteEnd, time: r.time.value!,
      leftRaw: left.raw, rightRaw: right.raw, left: left.value, right: right.value,
      leftStatus: left.status, leftReason: left.reason, rightStatus: right.status, rightReason: right.reason,
      difference: delta !== null && Number.isFinite(delta) ? (Object.is(delta, -0) ? 0 : delta) : null,
      state: blockers.length ? 'blocked' : left.value === null || right.value === null ? 'unavailable_pair' : delta !== null && !Number.isFinite(delta) ? 'arithmetic_overflow' : 'paired' };
  });
  const finite = pairs.filter((r) => r.state === 'paired'), overflow = pairs.filter((r) => r.state === 'arithmetic_overflow').length;
  const values = finite.map((r) => r.difference!), scale = Math.max(0, ...values.map(Math.abs));
  const scaled = scale === 0 ? values.map(() => 0) : values.map((v) => v / scale);
  const numericalWarnings: string[] = [];
  const checked = (value: number, nonzero: boolean, label: string): number | null => {
    if (!Number.isFinite(value) || (nonzero && value === 0)) {
      numericalWarnings.push(`${label} is unavailable: floating-point ${Number.isFinite(value) ? 'underflow would display a nonzero statistic as zero' : 'range was exceeded'}. Source pairs and available statistics are retained.`);
      return null;
    }
    return Object.is(value, -0) ? 0 : value;
  };
  // Sum signed values before scaling: scaling 1e308, 1e-100, -1e308 first
  // erases the small, representable residual. An overflowing total can still
  // have a finite mean, so fall back to a compensated normalized sum.
  const signedTotal = signedSum(balanced(values)), scaledTotal = signedSum(scaled)!;
  const fallbackLostNonzero = signedTotal === null && values.some((value, i) => value !== 0 && scaled[i] === 0);
  const mean = signedTotal === null ? scale * (scaledTotal / values.length) : signedTotal / values.length;
  if (!blockers.length && values.length && !overflow && fallbackLostNonzero) numericalWarnings.push('Mean difference is unavailable: the signed total overflowed and normalization erased at least one nonzero difference. This conservative range check retains other finite statistics and all source pairs.');
  // Scale before squaring: 1e200 has a finite RMS despite its overflowing square.
  // Nonnegative normalized sums cannot overflow at the bounded 5000-row limit.
  const metrics = !blockers.length && values.length && !overflow ? {
    meanDifference: fallbackLostNonzero ? null : checked(mean, (signedTotal ?? scaledTotal) !== 0, 'Mean difference'),
    meanAbsoluteDifference: checked(scale * (sum(scaled.map(Math.abs))! / values.length), scale !== 0, 'Mean absolute difference'),
    rootMeanSquareDifference: checked(scale * Math.sqrt(sum(scaled.map((v) => v * v))! / values.length), scale !== 0, 'Root mean square difference'), maximumAbsoluteDifference: scale,
    maximumRecords: finite.filter((r) => Math.abs(r.difference!) === scale).map((r) => r.record),
  } : null;
  return { methodRevision: DIFFERENCE_METHOD, sourceSha256: original.sha256, specDigest: digestOf(spec), recipeDigest: digestOf(recipe), pairingDigest: digestOf(pairing),
    run: recipe.run, phase: recipe.phase, origin: spec.origin, quantity: a.quantity, unit: a.unit, operator: a.operator, sign: 'left_minus_right',
    blockers, pairs, metrics, numericalWarnings, counts: { selected: selected.length, paired: finite.length, unavailablePairs: pairs.filter((r) => r.state === 'unavailable_pair').length, arithmeticOverflow: overflow, excludedRecords: inspection.excludedRecords.length },
    assumptions: { linearAdditiveQuantity: 'Ordinary subtraction on a linear, additive scale; no circular wrapping or logarithmic subtraction.', referenceDatum: pairing.referenceDatum, upstreamProcessing: pairing.upstreamProcessing },
    interpretation: 'Equal weight per available row within one selected run/phase, not time weighting. Dense sampling contributes more rows. Missing pairs change the represented population; these summaries describe available pairs, not all selected records. Counts are paired records, not independent experiments. No fit, offset correction, interpolation, correlation test, uncertainty interval or acceptance threshold.',
    declarationStatus: 'User assertions about linear/additive quantities, shared reference/datum, row alignment, measurement operators and context; none are independently verified.',
    alignmentCaveat: 'A common row or clock does not verify sensor-response alignment. Relative lag, filtering, resampling, calibration, shared processing or fitted offsets can change differences; none are estimated or corrected here. Results do not validate upstream processing or its independence.',
    scope: 'These differences do not establish measurement agreement, causal effects, physical-model validity, alarm performance or safety. Unknown uncertainty stays unknown.',
  };
}
export type ChannelDifferences = ReturnType<typeof channelDifferences>;
export function makeDifferencePackage(document: CsvDocument, name: string, spec: ImportSpec, recipe: ViewRecipe, pairing: Pairing) {
  const source = makeWorkbenchPackage(document, name, spec, recipe), result = channelDifferences(document, spec, recipe, pairing);
  const body = { schemaVersion: 'ignis-channel-differences-1', methodRevision: DIFFERENCE_METHOD, source, pairing, result, resultDigest: digestOf(result) };
  return { ...body, checksum: digestOf(body) };
}
export type DifferencePackage = ReturnType<typeof makeDifferencePackage>;
export function serializeDifferencePackage(packet: DifferencePackage): string {
  const text = JSON.stringify(packet, null, 2) + '\n';
  if (new TextEncoder().encode(text).length > MAX_WORKBENCH_PACKAGE_BYTES) throw new Error('Comparison package exceeds 8 MiB; nothing was truncated.');
  return text;
}
export function replayDifferencePackage(raw: string): { packet: DifferencePackage; document: CsvDocument; source: WorkbenchPackage; result: ChannelDifferences } {
  if (new TextEncoder().encode(raw).length > MAX_WORKBENCH_PACKAGE_BYTES) throw new Error('Comparison package exceeds 8 MiB.');
  const input: unknown = JSON.parse(raw), stack = [{ value: input, depth: 0 }]; let nodes = 0;
  while (stack.length) { const item = stack.pop()!; if (++nodes > 500000 || item.depth > 24) throw new Error('Comparison structure exceeds inspection limits.');
    if (item.value && typeof item.value === 'object') for (const value of Object.values(item.value)) stack.push({ value, depth: item.depth + 1 }); }
  const parsed = z.strictObject({ schemaVersion: z.literal('ignis-channel-differences-1'), methodRevision: z.string().max(100), source: z.unknown(), pairing: z.unknown(),
    result: z.record(z.string(), z.unknown()), resultDigest: z.string().regex(/^[a-f0-9]{64}$/), checksum: z.string().regex(/^[a-f0-9]{64}$/) }).parse(input);
  const { checksum, ...body } = parsed;
  if (digestOf(body) !== checksum) throw new Error('Comparison checksum differs.');
  if (parsed.methodRevision !== DIFFERENCE_METHOD) throw new Error('The historical comparison method is not installed.');
  const pairing = PairingSchema.parse(parsed.pairing);
  const source = replayWorkbenchPackage(JSON.stringify(parsed.source));
  const result = channelDifferences(source.document, source.packet.spec, source.packet.recipe, pairing);
  if (digestOf(result) !== parsed.resultDigest || digestOf(parsed.result) !== parsed.resultDigest) throw new Error('Recomputed comparison differs; nothing accepted.');
  const packet = { ...parsed, source: source.packet, pairing, result };
  return { packet, document: source.document, source: source.packet, result };
}
