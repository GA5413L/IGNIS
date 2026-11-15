import { describe, expect, it } from 'vitest';
import { detectorDataset, type DetectorCell, type DetectorDataset } from '../../src/core/detector';
import {
  analyzePairedDetector, DEFAULT_PAIR_SELECTION, PairSelectionSchema,
  type PairSelection,
} from '../../src/core/pairedDetector';

type SyntheticValue = number | 'missing' | 'error' | 'non_numeric';
function cell(original: DetectorCell, value: SyntheticValue): DetectorCell {
  if (typeof value === 'number') return { ...original, value, originalValue: String(value), status: 'finite', error: null };
  return {
    ...original, value: null, status: value,
    originalValue: value === 'missing' ? null : value === 'error' ? '#NUM!' : 'n/a',
    error: value === 'error' ? '#NUM!' : null,
  };
}
/** Synthetic values validate the algorithm; they are not new scientific measurements. */
function fixture(values: Array<[SyntheticValue, SyntheticValue]>): DetectorDataset {
  const source = detectorDataset.records.filter((row) => row.materialRole !== 'reference');
  const records = values.map(([a, b], index) => {
    const record = structuredClone(source[index]);
    record.channels.issScatterV = cell(record.channels.issScatterV, a);
    record.channels.issObscurationV = cell(record.channels.issObscurationV, b);
    return record;
  });
  return { ...structuredClone(detectorDataset), records };
}

describe('same-row paired detector audit', () => {
  it('reproduces the independent Python recount and preserves source provenance', () => {
    const result = analyzePairedDetector();
    expect(result.schemaVersion).toBe('ignis-paired-detector-1');
    expect(result.summary.selectedRows).toBe(134);
    expect(result.summary.pairedFiniteRows).toBe(133);
    expect(result.summary.availability).toEqual({ bothFinite: 133, aOnly: 0, bOnly: 0, neither: 1 });
    expect(result.summary.pairCounts).toEqual({ aBelowBBelow: 32, aBelowBAtOrAbove: 6, aAtOrAboveBBelow: 76, aAtOrAboveBAtOrAbove: 19 });
    expect(result.summary.pairedDifference).toEqual({ numerator: 70, denominator: 133, fraction: 70 / 133 });
    expect(result.summary.completionDifferenceBounds).toEqual({ lowerNumerator: 69, upperNumerator: 71, denominator: 134, lowerFraction: 69 / 134, upperFraction: 71 / 134 });
    expect(result.source.workbook.sha256).toBe('6d3a539ccf425b1fa8edc19cc75d828f57d650c7ce734d4e7aa686fea9593218');
    expect(result.source.workbook.parseMode).toBe('stored_XLSX_cache_no_recalculation');
    expect(result.identityConflicts).toEqual(detectorDataset.identityConflicts);
    expect(result.flags.some((flag) => flag.code === 'flight_stratum_reversal')).toBe(true);
    expect(result.policy).toMatchObject({ alarmClassification: false, physicalPrediction: false, independentTrials: false });
  });

  it('makes opposite flight-stratum signs and own marginal denominators explicit', () => {
    const result = analyzePairedDetector();
    expect(result.byFlight.map((row) => row.summary.pairedDifference)).toEqual([
      { numerator: -6, denominator: 25, fraction: -6 / 25 },
      { numerator: 76, denominator: 108, fraction: 76 / 108 },
    ]);
    expect(result.summary.marginalA).toMatchObject({ finite: 133, atOrAbove: 95, below: 38, unavailable: 1 });
    expect(result.summary.marginalB).toMatchObject({ finite: 133, atOrAbove: 25, below: 108, unavailable: 1 });
    expect(result.byFlight.reduce((sum, row) => sum + row.summary.selectedRows, 0)).toBe(134);
    expect(result.byMaterial.reduce((sum, row) => sum + row.summary.selectedRows, 0)).toBe(134);
  });

  it('reproduces the recorded-n selection-bias witness without inferring fan operation', () => {
    const result = analyzePairedDetector({ requireRecordedNoFanProblem: true });
    expect(result.baseSummary.pairedDifference.numerator).toBe(70);
    expect(result.summary.pairedDifference).toEqual({ numerator: -6, denominator: 25, fraction: -6 / 25 });
    expect(result.excludedRows).toHaveLength(109);
    expect(result.excludedRows.every((row) => row.fanFilter && row.record.instrumentStatusAsRecorded.fanProblem.originalValue === null)).toBe(true);
    expect(result.rows.every((row) => row.record.flight === '1')).toBe(true);
    expect(result.flags.map((flag) => flag.code)).toEqual(expect.arrayContaining(['selection_direction_reversal', 'recorded_fan_filter', 'flight_coverage_changed']));
    expect(result.flags.find((flag) => flag.code === 'recorded_fan_filter')?.recordIds).toHaveLength(109);
  });

  it('preserves Kapton missing-cell identity and exact completion bounds', () => {
    const result = analyzePairedDetector({ material: 'Kapton' });
    expect(result.summary).toMatchObject({ selectedRows: 36, pairedFiniteRows: 35, pairedDifference: { numerator: 9, denominator: 35 } });
    expect(result.summary.completionDifferenceBounds).toMatchObject({ lowerNumerator: 8, upperNumerator: 10, denominator: 36 });
    const missing = result.rows.find((row) => row.availability === 'neither');
    expect(missing?.record).toMatchObject({ excelRow: 50, sampleId: 'K02', testId: '4K', sameTestNumber: '51a' });
    expect(missing?.measurementA).toMatchObject({ cell: 'AW50', originalValue: null, status: 'missing' });
    expect(missing?.measurementB).toMatchObject({ cell: 'AV50', originalValue: null, status: 'missing' });
    expect(missing?.aAtOrAbove).toBeNull();
  });

  it('separates reference inclusion from material selection and handles empty populations', () => {
    expect(analyzePairedDetector({ includeReference: true }).summary.selectedRows).toBe(154);
    expect(analyzePairedDetector({ material: 'DBP', includeReference: true }).summary.selectedRows).toBe(20);
    const empty = analyzePairedDetector({ material: 'DBP' });
    expect(empty.summary.selectedRows).toBe(0);
    expect(empty.summary.pairedDifference.fraction).toBeNull();
    expect(empty.summary.completionDifferenceBounds.lowerFraction).toBeNull();
    expect(empty.summary.marginalA.atOrAboveFraction).toBeNull();
    expect(empty.byMaterial.every((row) => row.summary.pairedDifference.fraction === null)).toBe(true);
    expect(JSON.parse(JSON.stringify(empty))).toEqual(empty);
  });

  it('uses two independent cutoffs and places equality at-or-above', () => {
    const result = analyzePairedDetector({ cutoffA: 1, cutoffB: 3 }, fixture([[1, 3], [1, 2], [0, 3], [0, 2]]));
    expect(result.summary.pairCounts).toEqual({ aBelowBBelow: 1, aBelowBAtOrAbove: 1, aAtOrAboveBBelow: 1, aAtOrAboveBAtOrAbove: 1 });
    expect(result.channelA.cutoff).toBe(1);
    expect(result.channelB.cutoff).toBe(3);
  });

  it('retains zeros and negative readings and never equates missing/error/non-numeric with zero', () => {
    const result = analyzePairedDetector({ cutoffA: 0, cutoffB: 0 }, fixture([[0, -1], ['missing', 0], [1, 'error'], ['error', 'non_numeric']]));
    expect(result.rows[0].aAtOrAbove).toBe(true);
    expect(result.rows[0].bAtOrAbove).toBe(false);
    expect(result.summary.availability).toEqual({ bothFinite: 1, aOnly: 1, bOnly: 1, neither: 1 });
    expect(result.summary.marginalA).toMatchObject({ finite: 2, atOrAbove: 2, missing: 1, error: 1, unavailable: 2 });
    expect(result.summary.marginalB).toMatchObject({ finite: 2, atOrAbove: 1, error: 1, nonNumeric: 1, unavailable: 2 });
    expect(result.summary.pairedDifference).toEqual({ numerator: 1, denominator: 1, fraction: 1 });
  });

  it('matches an independent enumeration of every unknown binary completion', () => {
    const values: Array<[SyntheticValue, SyntheticValue]> = [[3, 'missing'], ['error', 1], ['missing', 'non_numeric'], [0, 4]];
    let possibleDifferences = [0];
    for (const [a, b] of values) {
      const aa = typeof a === 'number' ? [Number(a >= 2)] : [0, 1];
      const bb = typeof b === 'number' ? [Number(b >= 2)] : [0, 1];
      possibleDifferences = possibleDifferences.flatMap((total) => aa.flatMap((av) => bb.map((bv) => total + av - bv)));
    }
    const result = analyzePairedDetector({}, fixture(values));
    expect(result.summary.completionDifferenceBounds.lowerNumerator).toBe(Math.min(...possibleDifferences));
    expect(result.summary.completionDifferenceBounds.upperNumerator).toBe(Math.max(...possibleDifferences));
    expect(result.summary.completionDifferenceBounds.denominator).toBe(values.length);
  });

  it('transposes the table and negates bounds when channels and their cutoffs are swapped', () => {
    const a = analyzePairedDetector({ cutoffA: 1, cutoffB: 3 });
    const b = analyzePairedDetector({ channelA: 'issObscurationV', channelB: 'issScatterV', cutoffA: 3, cutoffB: 1 });
    expect(b.summary.pairCounts.aBelowBAtOrAbove).toBe(a.summary.pairCounts.aAtOrAboveBBelow);
    expect(b.summary.pairCounts.aAtOrAboveBBelow).toBe(a.summary.pairCounts.aBelowBAtOrAbove);
    expect(b.summary.pairedDifference.numerator).toBe(-a.summary.pairedDifference.numerator);
    expect(b.summary.completionDifferenceBounds.lowerNumerator).toBe(-a.summary.completionDifferenceBounds.upperNumerator);
    expect(b.summary.completionDifferenceBounds.upperNumerator).toBe(-a.summary.completionDifferenceBounds.lowerNumerator);
  });

  it('does not change eligibility when a cutoff changes and has monotone marginal counts', () => {
    const low = analyzePairedDetector({ cutoffA: 0 });
    const high = analyzePairedDetector({ cutoffA: 10 });
    expect(low.summary.pairedFiniteRows).toBe(high.summary.pairedFiniteRows);
    expect(low.summary.marginalA.atOrAbove).toBeGreaterThanOrEqual(high.summary.marginalA.atOrAbove);
    expect(low.summary.marginalB).toEqual(high.summary.marginalB);
  });

  it('keeps explicit exclusion reasons, source cells and base population', () => {
    const baseline = analyzePairedDetector();
    const id = baseline.rows.find((row) => row.record.excelRow === 50)!.record.id;
    const result = analyzePairedDetector({ exclusions: [{ recordId: id, reason: 'Inspect the unavailable pair separately.' }] });
    expect(result.baseSummary).toEqual(baseline.summary);
    expect(result.summary).toMatchObject({ selectedRows: 133, pairedFiniteRows: 133 });
    expect(result.excludedRows[0]).toMatchObject({ explicit: true, fanFilter: false, reasons: ['Inspect the unavailable pair separately.'], record: { excelRow: 50 } });
    expect(result.summary.completionDifferenceBounds).toMatchObject({ lowerNumerator: 70, upperNumerator: 70, denominator: 133 });
  });

  it('retains both reasons when an explicit exclusion also fails the recorded-n filter', () => {
    const row = detectorDataset.records.find((record) => record.excelRow === 50)!;
    const result = analyzePairedDetector({ requireRecordedNoFanProblem: true, exclusions: [{ recordId: row.id, reason: 'Review cell availability.' }] });
    const excluded = result.excludedRows.find((item) => item.record.id === row.id)!;
    expect(excluded).toMatchObject({ explicit: true, fanFilter: true });
    expect(excluded.reasons).toHaveLength(2);
    expect(result.excludedRows).toHaveLength(109);
  });

  it('is deterministic under source-row permutation and returns detached JSON-safe evidence', () => {
    const original = analyzePairedDetector();
    const shuffled = { ...structuredClone(detectorDataset), records: [...detectorDataset.records].reverse() };
    expect(analyzePairedDetector({}, shuffled)).toEqual(original);
    expect(JSON.parse(JSON.stringify(original))).toEqual(original);
    const saved = JSON.stringify(original);
    original.source.title = 'Changed only in the caller copy';
    original.rows[0].record.channels.issScatterV.value = 999;
    expect(JSON.stringify(analyzePairedDetector())).toBe(saved);
  });

  it('rejects a second record for the same physical source row even with a different ID', () => {
    const dataset = fixture([[1, 1]]);
    dataset.records.push({ ...structuredClone(dataset.records[0]), id: 'different-id-same-source-row' });
    expect(() => analyzePairedDetector({}, dataset)).toThrow(/row identity/);
  });

  it('rejects a channel value attributed to the wrong source cell', () => {
    const dataset = fixture([[1, 1]]);
    dataset.records[0].channels.issScatterV.cell = 'AW999';
    expect(() => analyzePairedDetector({}, dataset)).toThrow(/Source cell/);
  });

  it('rejects nonfinite source values rather than classifying them', () => {
    const dataset = fixture([[1, 1]]);
    dataset.records[0].channels.issScatterV.value = Number.NaN;
    expect(() => analyzePairedDetector({}, dataset)).toThrow();
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])('rejects invalid cutoffs %s for either channel', (value) => {
    expect(() => analyzePairedDetector({ cutoffA: value })).toThrow();
    expect(() => analyzePairedDetector({ cutoffB: value })).toThrow();
  });

  it('rejects unknown fields/enums, equal channels and non-boolean flags', () => {
    expect(PairSelectionSchema.safeParse({ ...DEFAULT_PAIR_SELECTION, channelA: 'unknown' }).success).toBe(false);
    expect(PairSelectionSchema.safeParse({ ...DEFAULT_PAIR_SELECTION, flight: '3' }).success).toBe(false);
    expect(PairSelectionSchema.safeParse({ ...DEFAULT_PAIR_SELECTION, material: 'unknown' }).success).toBe(false);
    expect(PairSelectionSchema.safeParse({ ...DEFAULT_PAIR_SELECTION, channelB: 'issScatterV' }).success).toBe(false);
    expect(() => analyzePairedDetector({ unknown: true } as unknown as Partial<PairSelection>)).toThrow();
    expect(PairSelectionSchema.safeParse({ ...DEFAULT_PAIR_SELECTION, requireRecordedNoFanProblem: 'false' }).success).toBe(false);
    expect(() => analyzePairedDetector(null as unknown as PairSelection)).toThrow(/must be an object/);
    expect(() => analyzePairedDetector([] as unknown as PairSelection)).toThrow(/must be an object/);
    expect(() => analyzePairedDetector(2 as unknown as PairSelection)).toThrow(/must be an object/);
  });

  it('rejects unknown, duplicate and outside-cohort exclusions or missing reasons', () => {
    const id = detectorDataset.records.find((record) => record.flight === '1' && record.materialRole !== 'reference')!.id;
    expect(() => analyzePairedDetector({ exclusions: [{ recordId: 'unknown', reason: 'Reason' }] })).toThrow(/unknown or outside/);
    expect(() => analyzePairedDetector({ flight: '2', exclusions: [{ recordId: id, reason: 'Reason' }] })).toThrow(/unknown or outside/);
    expect(() => analyzePairedDetector({ exclusions: [{ recordId: id, reason: 'One' }, { recordId: id, reason: 'Two' }] })).toThrow(/unique/);
    expect(() => analyzePairedDetector({ exclusions: [{ recordId: id, reason: ' ' }] })).toThrow();
  });
});
