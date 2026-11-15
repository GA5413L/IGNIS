import { describe, expect, it } from 'vitest';
import { detectorDataset, type DetectorCell, type DetectorDataset } from '../../src/core/detector';
import { analyzePairedDetector } from '../../src/core/pairedDetector';
import {
  analyzeCutoffEnvelope, CutoffEnvelopeSelectionSchema, DEFAULT_CUTOFF_ENVELOPE_SELECTION,
  MAX_CUTOFF_ENVELOPE_V, type CutoffEnvelopeSelection, type CutoffStability,
} from '../../src/core/cutoffEnvelope';

type Value = number | 'missing' | 'error' | 'non_numeric';
function cell(original: DetectorCell, value: Value): DetectorCell {
  return typeof value === 'number'
    ? { ...original, value, originalValue: String(value), status: 'finite', error: null }
    : { ...original, value: null, originalValue: value === 'missing' ? null : value === 'error' ? '#NUM!' : 'n/a', status: value, error: value === 'error' ? '#NUM!' : null };
}
/** These are algorithm fixtures, not fabricated scientific measurements. */
function fixture(values: Array<[Value, Value]>): DetectorDataset {
  const originals = detectorDataset.records.filter((row) => row.materialRole !== 'reference');
  return {
    ...structuredClone(detectorDataset), records: values.map(([a, b], index) => {
      const record = structuredClone(originals[index]);
      record.channels.issScatterV = cell(record.channels.issScatterV, a);
      record.channels.issObscurationV = cell(record.channels.issObscurationV, b);
      return record;
    }),
  };
}

/** Independent raw-array enumeration: no production corner/profile helpers. */
function countAt(values: Array<[Value, Value]>, a: number, b: number) {
  let numerator = 0;
  let denominator = 0;
  let completions = [0];
  for (const [av, bv] of values) {
    if (typeof av === 'number' && typeof bv === 'number') {
      numerator += Number(av >= a) - Number(bv >= b);
      denominator += 1;
    }
    const aa = typeof av === 'number' ? [Number(av >= a)] : [0, 1];
    const bb = typeof bv === 'number' ? [Number(bv >= b)] : [0, 1];
    completions = completions.flatMap((sum) => aa.flatMap((x) => bb.map((y) => sum + x - y)));
  }
  return { numerator, denominator, lower: Math.min(...completions), upper: Math.max(...completions) };
}
function probes(values: Value[], min: number, max: number): number[] {
  const edges = [...new Set([min, max, ...values.filter((value): value is number => typeof value === 'number' && value >= min && value <= max)])].sort((a, b) => a - b);
  // Endpoints and interior points test both exact ties and the states between them.
  return edges.flatMap((edge, index) => index ? [edge, (edges[index - 1] + edge) / 2] : [edge]);
}

describe('exact closed cutoff-range certificate', () => {
  it('reproduces the separate Decimal recount and retains unavailable source cells', () => {
    const result = analyzeCutoffEnvelope();
    expect(result.schemaVersion).toBe('ignis-cutoff-envelope-1');
    expect(result.summary).toMatchObject({ selectedRows: 134, pairedFiniteRows: 133 });
    expect(result.summary.pairedDifferenceEnvelope).toEqual({ lowerNumerator: 66, upperNumerator: 78, denominator: 133, lowerFraction: 66 / 133, upperFraction: 78 / 133, stability: 'strictly_positive' });
    expect(result.summary.completionDifferenceEnvelope).toMatchObject({ lowerNumerator: 65, upperNumerator: 79, denominator: 134, stability: 'strictly_positive' });
    expect(result.summary.minimum).toMatchObject({ cutoffA: 3, cutoffB: 1, summary: { pairedDifference: { numerator: 66 } } });
    expect(result.summary.maximum).toMatchObject({ cutoffA: 1, cutoffB: 3, summary: { pairedDifference: { numerator: 78 } } });
    const unavailable = result.rows.find((row) => row.record.excelRow === 50)!;
    expect(unavailable.measurementA).toMatchObject({ cell: 'AW50', status: 'missing', originalValue: null });
    expect(unavailable.measurementB).toMatchObject({ cell: 'AV50', status: 'missing', originalValue: null });
    expect(unavailable.atMinimum).toEqual({ aAtOrAbove: null, bAtOrAbove: null });
    expect(unavailable.atMaximum).toEqual({ aAtOrAbove: null, bAtOrAbove: null });
    expect(result.source.workbook.sha256).toBe('6d3a539ccf425b1fa8edc19cc75d828f57d650c7ce734d4e7aa686fea9593218');
    expect(result.policy).toMatchObject({ alarmClassification: false, physicalPrediction: false, independentTrials: false });
  });

  it('certifies opposite flight signs across the full rectangle and missing completions', () => {
    const result = analyzeCutoffEnvelope();
    expect(result.byFlight[0].summary.pairedDifferenceEnvelope).toMatchObject({ lowerNumerator: -6, upperNumerator: -3, denominator: 25, stability: 'strictly_negative' });
    expect(result.byFlight[1].summary.pairedDifferenceEnvelope).toMatchObject({ lowerNumerator: 72, upperNumerator: 81, denominator: 108, stability: 'strictly_positive' });
    expect(result.byFlight[1].summary.completionDifferenceEnvelope).toMatchObject({ lowerNumerator: 71, upperNumerator: 82, denominator: 109 });
    expect(result.byMaterial.find((row) => row.material === 'Kapton')?.summary).toMatchObject({
      selectedRows: 36, pairedFiniteRows: 35,
      pairedDifferenceEnvelope: { lowerNumerator: 7, upperNumerator: 10, denominator: 35 },
      completionDifferenceEnvelope: { lowerNumerator: 6, upperNumerator: 11, denominator: 36 },
    });
    expect(result.flags.map((flag) => flag.code)).toEqual(expect.arrayContaining(['robust_flight_sign_reversal', 'completion_robust_flight_sign_reversal']));
    expect(result.byMaterial.reduce((sum, row) => sum + row.summary.selectedRows, 0)).toBe(134);
  });

  it('exposes policy-sensitive signs across the wider [0,5] rectangle', () => {
    const result = analyzeCutoffEnvelope({ rangeA: { min: 0, max: 5 }, rangeB: { min: 0, max: 5 } });
    expect(result.summary.pairedDifferenceEnvelope).toMatchObject({ lowerNumerator: -51, upperNumerator: 133, denominator: 133, stability: 'both_signs' });
    expect(result.summary.completionDifferenceEnvelope).toMatchObject({ lowerNumerator: -52, upperNumerator: 134, denominator: 134, stability: 'both_signs' });
    expect(result.flags.some((flag) => flag.code === 'cutoff_direction_changes')).toBe(true);
    expect(result.flags.some((flag) => flag.code === 'robust_flight_sign_reversal')).toBe(false);
  });

  it('preserves the recorded-n selection witness without calling unrecorded flags failures', () => {
    const result = analyzeCutoffEnvelope({ requireRecordedNoFanProblem: true });
    expect(result.summary).toMatchObject({ selectedRows: 25, pairedFiniteRows: 25, pairedDifferenceEnvelope: { lowerNumerator: -6, upperNumerator: -3, stability: 'strictly_negative' } });
    expect(result.baseEnvelopes.pairedDifferenceEnvelope).toMatchObject({ lowerNumerator: 66, upperNumerator: 78, denominator: 133 });
    expect(result.excludedRows).toHaveLength(109);
    expect(result.excludedRows.every((row) => row.record.instrumentStatusAsRecorded.fanProblem.originalValue === null)).toBe(true);
    expect(result.flags.map((flag) => flag.code)).toEqual(expect.arrayContaining(['recorded_fan_filter', 'flight_coverage_changed', 'robust_selection_direction_reversal']));
  });

  it('partitions ties with exact inclusive upper endpoints and no epsilon', () => {
    const dataset = fixture([[1, 3], [2, 2], [2, 0], [3, -1]]);
    const result = analyzeCutoffEnvelope({}, dataset);
    const steps = result.summary.profiles.channelA.steps;
    expect(steps.map((step) => [step.lower, step.upper, step.lowerInclusive, step.upperInclusive, step.finiteAtOrAbove])).toEqual([
      [1, 1, true, true, 4], [1, 2, false, true, 3], [2, 3, false, true, 1],
    ]);
    expect(steps[1].tiedRecordIdsAtUpper).toEqual(dataset.records.slice(1, 3).map((record) => record.id));
    expect(steps[2].droppedRecordIdsAfterLower).toEqual(steps[1].tiedRecordIdsAtUpper);
    expect(result.summary.profiles.channelB.finiteRows).toBe(4);
    expect(result.rows[3].measurementB.value).toBe(-1);
  });

  it('agrees with an independent enumeration of cutoff states and every missing binary completion', () => {
    const examples: Array<Array<[Value, Value]>> = [
      [[3, 'missing'], ['error', 1], ['missing', 'non_numeric'], [0, 4]],
      [[0, -1], [1, 1], [2, 3], [2, 0], [5, 4]],
      [[1, 2], [1, 2], [4, 2], [3, 3], ['error', 5]],
    ];
    for (const values of examples) {
      const result = analyzeCutoffEnvelope({ rangeA: { min: 0, max: 5 }, rangeB: { min: 0, max: 5 } }, fixture(values));
      const states = probes(values.map((row) => row[0]), 0, 5)
        .flatMap((a) => probes(values.map((row) => row[1]), 0, 5).map((b) => countAt(values, a, b)));
      expect(result.summary.pairedDifferenceEnvelope.lowerNumerator).toBe(Math.min(...states.map((row) => row.numerator)));
      expect(result.summary.pairedDifferenceEnvelope.upperNumerator).toBe(Math.max(...states.map((row) => row.numerator)));
      expect(result.summary.completionDifferenceEnvelope.lowerNumerator).toBe(Math.min(...states.map((row) => row.lower)));
      expect(result.summary.completionDifferenceEnvelope.upperNumerator).toBe(Math.max(...states.map((row) => row.upper)));
      for (const a of result.summary.profiles.channelA.steps) for (const b of result.summary.profiles.channelB.steps) {
        const direct = countAt(values, a.representativeCutoff, b.representativeCutoff);
        expect(a.jointFiniteAtOrAbove - b.jointFiniteAtOrAbove).toBe(direct.numerator);
      }
    }
  });

  it('reduces a degenerate rectangle exactly to the existing paired operation', () => {
    const rangeA = { min: 2, max: 2 };
    const rangeB = { min: 3, max: 3 };
    const result = analyzeCutoffEnvelope({ rangeA, rangeB });
    const pair = analyzePairedDetector({ cutoffA: 2, cutoffB: 3 });
    expect(result.summary.minimum.summary).toEqual(pair.summary);
    expect(result.summary.maximum.summary).toEqual(pair.summary);
    expect(result.summary.profiles.channelA.steps).toHaveLength(1);
    expect(result.summary.profiles.channelB.steps).toHaveLength(1);
    expect(result.summary.pairedDifferenceEnvelope.lowerNumerator).toBe(pair.summary.pairedDifference.numerator);
    expect(result.summary.pairedDifferenceEnvelope.upperNumerator).toBe(pair.summary.pairedDifference.numerator);
  });

  it.each<[Array<[Value, Value]>, CutoffStability]>([
    [[[3, 0]], 'strictly_positive'], [[[0, 3]], 'strictly_negative'],
    [[[0, 0]], 'identically_zero'], [[[2, 0]], 'nonnegative_including_zero'],
    [[[0, 2]], 'nonpositive_including_zero'], [[[2, 2]], 'both_signs'],
    [[['missing', 'error']], 'no_data'],
  ])('distinguishes zero-inclusive and no-data signs for %j', (values, expected) => {
    expect(analyzeCutoffEnvelope({}, fixture(values)).summary.pairedDifferenceEnvelope.stability).toBe(expected);
  });

  it('distinguishes no paired observations from no selected observations', () => {
    const unavailable = analyzeCutoffEnvelope({}, fixture([['missing', 'error'], ['non_numeric', 'missing']]));
    expect(unavailable.summary.pairedDifferenceEnvelope).toMatchObject({ denominator: 0, lowerFraction: null, upperFraction: null, stability: 'no_data' });
    expect(unavailable.summary.completionDifferenceEnvelope).toMatchObject({ lowerNumerator: -2, upperNumerator: 2, denominator: 2, stability: 'both_signs' });
    const empty = analyzeCutoffEnvelope({ material: 'DBP' });
    expect(empty.summary.completionDifferenceEnvelope).toMatchObject({ denominator: 0, lowerFraction: null, upperFraction: null, stability: 'no_data' });
    expect(empty.rows).toEqual([]);
    expect(analyzeCutoffEnvelope({ material: 'DBP', includeReference: true }).summary.selectedRows).toBe(20);
  });

  it('negates bounds and swaps axis profiles when channel roles/ranges are exchanged', () => {
    const a = analyzeCutoffEnvelope({ rangeA: { min: 0, max: 3 }, rangeB: { min: 1, max: 4 } });
    const b = analyzeCutoffEnvelope({ channelA: 'issObscurationV', channelB: 'issScatterV', rangeA: a.selection.rangeB, rangeB: a.selection.rangeA });
    expect(b.summary.pairedDifferenceEnvelope.lowerNumerator).toBe(-a.summary.pairedDifferenceEnvelope.upperNumerator);
    expect(b.summary.pairedDifferenceEnvelope.upperNumerator).toBe(-a.summary.pairedDifferenceEnvelope.lowerNumerator);
    expect(b.summary.completionDifferenceEnvelope.lowerNumerator).toBe(-a.summary.completionDifferenceEnvelope.upperNumerator);
    expect(b.summary.completionDifferenceEnvelope.upperNumerator).toBe(-a.summary.completionDifferenceEnvelope.lowerNumerator);
    expect(b.summary.profiles.channelA).toEqual(a.summary.profiles.channelB);
  });

  it('preserves ordinary positive unit scaling and source-row permutation', () => {
    const values: Array<[number, number]> = [[0, -1], [1, 3], [2, 2], [2, 4], [5, 0]];
    const a = analyzeCutoffEnvelope({}, fixture(values));
    const b = analyzeCutoffEnvelope({ rangeA: { min: 1000, max: 3000 }, rangeB: { min: 1000, max: 3000 } }, fixture(values.map(([x, y]) => [x * 1000, y * 1000])));
    expect(b.summary.pairedDifferenceEnvelope).toEqual(a.summary.pairedDifferenceEnvelope);
    expect(b.summary.completionDifferenceEnvelope).toEqual(a.summary.completionDifferenceEnvelope);
    expect(b.summary.profiles.channelA.steps.map((step) => step.finiteAtOrAbove)).toEqual(a.summary.profiles.channelA.steps.map((step) => step.finiteAtOrAbove));
    const shuffled = fixture(values);
    shuffled.records.reverse();
    expect(analyzeCutoffEnvelope({}, shuffled)).toEqual(a);
  });

  it('binds explicit exclusions and retains reasons without changing eligibility with cutoff', () => {
    const id = detectorDataset.records.find((record) => record.excelRow === 50)!.id;
    const result = analyzeCutoffEnvelope({ exclusions: [{ recordId: id, reason: 'Review unavailable source cells.' }] });
    expect(result.summary).toMatchObject({ selectedRows: 133, pairedFiniteRows: 133 });
    expect(result.summary.completionDifferenceEnvelope).toEqual(result.summary.pairedDifferenceEnvelope);
    expect(result.baseEnvelopes.selectedRows).toBe(134);
    expect(result.excludedRows[0]).toMatchObject({ record: { id }, reasons: ['Review unavailable source cells.'], explicit: true });
    expect(() => analyzeCutoffEnvelope({ exclusions: [{ recordId: 'unknown', reason: 'Review.' }] })).toThrow(/unknown or outside/);
  });

  it('rejects malformed/unknown/nonfinite/unbounded selections and ambiguous exclusions', () => {
    const invalid: unknown[] = [null, [], { unexpected: 1 }, { cutoffA: 2 },
      { rangeA: { min: 3, max: 1 } }, { rangeA: { min: -1, max: 3 } },
      { rangeB: { min: 0, max: Infinity } }, { rangeB: { min: NaN, max: 3 } },
      { rangeA: { min: 0, max: MAX_CUTOFF_ENVELOPE_V + 1 } },
      { rangeA: { min: 0, max: 3, unit: 'V' } }, { rangeA: { min: '1', max: 3 } },
      { channelB: 'issScatterV' }, { flight: '3' }, { includeReference: 'false' },
      { exclusions: [{ recordId: 'x', reason: ' ' }] },
      { exclusions: [{ recordId: 'x', reason: 'A' }, { recordId: 'x', reason: 'B' }] },
    ];
    for (const selection of invalid) expect(() => analyzeCutoffEnvelope(selection as Partial<CutoffEnvelopeSelection>)).toThrow();
    expect(CutoffEnvelopeSelectionSchema.safeParse(DEFAULT_CUTOFF_ENVELOPE_SELECTION).success).toBe(true);
  });

  it('is deterministic, detached and JSON-safe, including zero endpoints', () => {
    const result = analyzeCutoffEnvelope({ rangeA: { min: -0, max: 0 }, rangeB: { min: 0, max: 0 } });
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
    const saved = JSON.stringify(analyzeCutoffEnvelope());
    const detached = analyzeCutoffEnvelope();
    detached.rows[0].measurementA.value = 999;
    detached.source.title = 'Caller copy';
    detached.summary.profiles.channelA.steps[0].tiedRecordIdsAtUpper.push('caller-only');
    expect(JSON.stringify(analyzeCutoffEnvelope())).toBe(saved);
    expect(Object.isFrozen(DEFAULT_CUTOFF_ENVELOPE_SELECTION.rangeA)).toBe(true);
  });
});
