import { describe, expect, it } from 'vitest';
import {
  analyzeDetector, detectorDataset, detectorDatasetSchema, exportDetectorAnalysis,
  type DetectorCell, type DetectorDataset, type DetectorRecord,
} from '../../src/core/detector';

const sourceRow = (excelRow: number): DetectorRecord => {
  const row = detectorDataset.records.find((record) => record.excelRow === excelRow);
  if (!row) throw new Error(`Missing source row ${excelRow}`);
  return row;
};

/** Synthetic channel states exercise missing/error/equality behavior, not scientific findings. */
function fixtureWithCells(cells: Array<Pick<DetectorCell, 'value' | 'originalValue' | 'status' | 'error'>>): DetectorDataset {
  const records = cells.map((cell, index) => {
    const record = structuredClone(sourceRow(23 + index));
    record.channels.issScatterV = { ...record.channels.issScatterV, ...cell };
    return record;
  });
  return { ...detectorDataset, records };
}

describe('primary SAME detector data and descriptive voltage selection', () => {
  it('preserves pinned provenance, 154 flight-marked rows and 20 separate DBP reference rows', () => {
    expect(detectorDataset.records).toHaveLength(154);
    expect(new Set(detectorDataset.records.map((record) => record.id)).size).toBe(154);
    expect(detectorDataset.records.filter((record) => record.flight === '1')).toHaveLength(45);
    expect(detectorDataset.records.filter((record) => record.flight === '2')).toHaveLength(109);
    expect(detectorDataset.records.filter((record) => record.materialRole === 'reference')).toHaveLength(20);
    expect(detectorDataset.source.workbook.sha256).toBe('6d3a539ccf425b1fa8edc19cc75d828f57d650c7ce734d4e7aa686fea9593218');
    expect(detectorDataset.source.workbook.sizeBytes).toBe(4061669);
    expect(detectorDataset.source.doi).toBe('10.60555/2np7-jv14');
    expect(detectorDataset.source.license.id).toBe('CC0-1.0');
    expect(detectorDataset.source.review.humanReviewed).toBe(false);
    expect(analyzeDetector().counts.total).toBe(134);
    expect(analyzeDetector({ includeReference: true }).counts.total).toBe(154);
  });

  it('reproduces the audited finite-denominator Kapton and Teflon counts at the selected 2 V cutoff', () => {
    const kapton = analyzeDetector({ material: 'Kapton' });
    expect(kapton.counts).toEqual({
      total: 36, finite: 35, missing: 1, error: 0, nonNumeric: 0,
      below: 20, atOrAbove: 15, belowPercent: 100 * 20 / 35, atOrAbovePercent: 100 * 15 / 35,
    });
    expect(kapton.rows.find((row) => row.classification === 'missing')?.measurement).toMatchObject({
      cell: 'AW50', originalValue: null, value: null, error: null, status: 'missing',
    });
    expect(kapton.rows.find((row) => row.measurement.cell === 'AW50')?.record.sameTestNumber).toBe('51a');
    const teflon = analyzeDetector({ material: 'Teflon' });
    expect(teflon.counts).toMatchObject({ total: 23, finite: 23, below: 18, atOrAbove: 5, missing: 0 });
    expect(teflon.counts.belowPercent).toBe(100 * 18 / 23);
    expect(kapton.policy.alarmClassification).toBe(false);
    expect(kapton.policy.independentTrials).toBe(false);
  });

  it('filters by the workbook flight marker without joining or filling the summary CSV', () => {
    const flightTwo = analyzeDetector({ flight: '2', material: 'Kapton' });
    expect(flightTwo.counts).toMatchObject({ total: 30, finite: 29, missing: 1 });
    expect(flightTwo.rows.every((row) => row.record.flight === '2')).toBe(true);
    expect(flightTwo.rows.some((row) => row.record.sameTestNumber === '112')).toBe(true);
    const flightOne = analyzeDetector({ flight: '1', material: 'Kapton' });
    expect(flightOne.counts.total).toBe(6);
    expect(flightOne.rows.every((row) => row.record.flight === '1')).toBe(true);
    const conflict = detectorDataset.identityConflicts[0];
    expect(conflict.csvOnlyRecords[0]).toMatchObject({ csvLineIncludingHeader: 75, originalFields: { 'Sample Type': 'Teflon', 'SAME Test #': '57' } });
    expect(conflict.workbookOnlyRecords[0]).toMatchObject({ excelRow: 57, identityCells: { sameTestNumber: { cell: 'G57', originalValue: '112' } } });
    expect(conflict.status).toBe('unresolved');
  });

  it('retains actual source errors and non-numeric aging values rather than making them zero', () => {
    expect(sourceRow(59).sizes.diameterOfAverageMassUm).toMatchObject({
      cell: 'BS59', originalValue: '#DIV/0!', value: null, error: '#DIV/0!', status: 'error',
    });
    expect(sourceRow(65).conditions.netAgingDurationSec).toMatchObject({
      cell: 'U65', originalValue: 'n/a', value: null, status: 'non_numeric',
    });
    expect(sourceRow(50).conditions.netAgingDurationSec).toMatchObject({ originalValue: null, value: null, status: 'missing' });
  });

  it('places equality at-or-above and excludes missing, error and non-numeric values from percentages', () => {
    const fixture = fixtureWithCells([
      { value: 2, originalValue: '2', status: 'finite', error: null },
      { value: null, originalValue: null, status: 'missing', error: null },
      { value: null, originalValue: '#DIV/0!', status: 'error', error: '#DIV/0!' },
      { value: null, originalValue: 'n/a', status: 'non_numeric', error: null },
    ]);
    const result = analyzeDetector({ cutoff: 2 }, fixture);
    expect(result.counts).toEqual({ total: 4, finite: 1, missing: 1, error: 1, nonNumeric: 1, below: 0, atOrAbove: 1, belowPercent: 0, atOrAbovePercent: 100 });
    expect(result.rows.map((row) => row.classification)).toEqual(['at_or_above', 'missing', 'error', 'non_numeric']);
  });

  it('uses null percentages when no finite readings or no selected records exist', () => {
    const fixture = fixtureWithCells([{ value: null, originalValue: '#NUM!', status: 'error', error: '#NUM!' }]);
    expect(analyzeDetector({}, fixture).counts).toMatchObject({ total: 1, finite: 0, error: 1, belowPercent: null, atOrAbovePercent: null });
    expect(analyzeDetector({ material: 'DBP', includeReference: false }).counts).toMatchObject({ total: 0, finite: 0, belowPercent: null, atOrAbovePercent: null });
    expect(analyzeDetector({ material: 'DBP', includeReference: true }).counts.total).toBe(20);
  });

  it('keeps cached zeros and negative voltages as source readings without inferring alarm or enabled-sensor status', () => {
    const result = analyzeDetector({ material: 'Pyrell', channel: 'issObscurationV' });
    const observed = result.rows.find((row) => row.record.excelRow === 85)!;
    expect(observed.measurement).toMatchObject({ cell: 'AV85', value: 0, originalValue: '0', status: 'finite' });
    expect(observed.classification).toBe('below');
    expect(result.channel.unit).toBe('V');
    expect(result.policy.zeroMeaning).toContain('does not establish');
    const fixture = fixtureWithCells([{ value: -0.25, originalValue: '-0.25', status: 'finite', error: null }]);
    expect(analyzeDetector({ cutoff: 0 }, fixture).counts.below).toBe(1);
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])('rejects invalid analyst cutoffs: %s', (cutoff) => {
    expect(() => analyzeDetector({ cutoff })).toThrow();
  });

  it('rejects unknown selectors and inconsistent imported cell status', () => {
    expect(() => analyzeDetector({ channel: 'alarm' as never })).toThrow();
    expect(() => analyzeDetector({ flight: 'ground' as never })).toThrow();
    expect(() => analyzeDetector({ material: 'other' as never })).toThrow();
    const fixture = fixtureWithCells([{ value: 0, originalValue: null, status: 'missing', error: null }]);
    expect(() => detectorDatasetSchema.parse(fixture)).toThrow();
  });

  it('keeps by-material totals and exported selected records consistent with the displayed analysis', () => {
    const selection = { flight: '2', channel: 'ionDeltaV', cutoff: 1.5 } as const;
    const result = analyzeDetector(selection);
    expect(result.byMaterial.reduce((sum, item) => sum + item.counts.total, 0)).toBe(result.counts.total);
    expect(result.byMaterial.reduce((sum, item) => sum + item.counts.finite, 0)).toBe(result.counts.finite);
    const exported = exportDetectorAnalysis(selection);
    expect(exported.counts).toEqual(result.counts);
    expect(exported.rows).toEqual(result.rows);
    expect(exported.selection).toEqual(result.selection);
    expect(exported.source).toEqual(result.source);
    expect(exported.policy).toEqual(result.policy);
    expect(exported.identityConflicts).toEqual(result.identityConflicts);
    expect(JSON.parse(JSON.stringify(exported))).toEqual(exported);
    const before = result.rows[0].record.description;
    exported.rows[0].record.description = 'Export copy only';
    expect(result.rows[0].record.description).toBe(before);
  });
});
