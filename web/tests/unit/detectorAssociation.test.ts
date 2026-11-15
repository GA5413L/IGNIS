import { describe, expect, it } from 'vitest';
import { digestOf } from '../../src/core/canonicalize';
import { detectorDataset, type DetectorCell, type DetectorDataset } from '../../src/core/detector';
import {
  analyzeDetectorAssociation, createAssociationPackage, replayAssociationPackage,
  DetectorAssociationSelectionSchema, DEFAULT_DETECTOR_ASSOCIATION_SELECTION, MAX_ASSOCIATION_PACKAGE_BYTES,
} from '../../src/core/detectorAssociation';

type Value = number | 'missing' | 'error' | 'non_numeric';
function cell(original: DetectorCell, value: Value): DetectorCell {
  return typeof value === 'number'
    ? { ...original, value, originalValue: String(value), status: 'finite', error: null }
    : { ...original, value: null, originalValue: value === 'missing' ? null : value === 'error' ? '#NUM!' : 'n/a', status: value, error: value === 'error' ? '#NUM!' : null };
}
/** Algorithm fixtures only, never added to the curated source dataset. */
function fixture(values: Array<[Value, Value]>, groups?: Array<string | null>): DetectorDataset {
  const originals = detectorDataset.records.filter((record) => record.flight === '2' && record.materialRole !== 'reference');
  return {
    ...structuredClone(detectorDataset), records: values.map(([a, b], index) => {
      const record = structuredClone(originals[index]);
      record.channels.issScatterV = cell(record.channels.issScatterV, a);
      record.channels.ionDeltaV = cell(record.channels.ionDeltaV, b);
      record.sampleId = groups ? groups[index] : `fixture-${index}`;
      record.identityCells.sampleId.originalValue = record.sampleId;
      return record;
    }),
  };
}

/** Independent O(n²) midranks: count smaller/equal values, without production sorting/rank helpers. */
function oracle(values: Array<[number, number]>): number | null {
  if (values.length < 3) return null;
  const rank = (side: 0 | 1) => values.map((item) => 1 + values.filter((other) => other[side] < item[side]).length
    + (values.filter((other) => other[side] === item[side]).length - 1) / 2);
  const a = rank(0); const b = rank(1); const mean = (values.length + 1) / 2;
  const cross = a.reduce((sum, value, index) => sum + (value - mean) * (b[index] - mean), 0);
  const aa = a.reduce((sum, value) => sum + (value - mean) ** 2, 0);
  const bb = b.reduce((sum, value) => sum + (value - mean) ** 2, 0);
  return aa && bb ? cross / Math.sqrt(aa * bb) : null;
}

describe('source-bound descriptive detector association', () => {
  it('recounts SAME-R and exposes material heterogeneity without a cutoff', () => {
    const result = analyzeDetectorAssociation();
    expect(result.selection).toEqual(DEFAULT_DETECTOR_ASSOCIATION_SELECTION);
    expect(result.summary).toMatchObject({ selectedRows: 109, pairedFiniteRows: 108 });
    expect(result.summary.association.rho).toBeCloseTo(0.4435817129467917, 12);
    expect(result.byMaterial.find((entry) => entry.material === 'Silicone')?.summary.association.rho).toBeCloseTo(-0.6184693836006114, 12);
    expect(result.byMaterial.find((entry) => entry.material === 'Kapton')?.summary.association.rho).toBeCloseTo(0.023645320197044337, 12);
    expect(result.byMaterial.find((entry) => entry.material === 'Teflon')?.summary.association.rho).toBeCloseTo(0.6274509803921569, 12);
    expect(result.channelA).toMatchObject({ id: 'issScatterV', column: 'AW', unit: 'V' });
    expect(result.channelB).toMatchObject({ id: 'ionDeltaV', column: 'BK', unit: 'V' });
    expect(result.flags.some((flag) => flag.code === 'within_flight_material_signs_2')).toBe(true);
    expect(result.method).toMatchObject({ pValues: false, confidenceIntervals: false, physicalPrediction: false, independentTrials: false });
  });

  it('deletes complete recorded sample blocks and reproduces the independent Python recount', () => {
    const deletion = analyzeDetectorAssociation().summary.deletion;
    expect(deletion).toMatchObject({ status: 'computed', identifiedGroups: 65, definedDeletions: 65, undefinedDeletions: 0, unidentifiedRecordIds: [] });
    expect(deletion.minimumRho).toBeCloseTo(0.4176321367022149, 12);
    expect(deletion.maximumRho).toBeCloseTo(0.5020543789550809, 12);
    expect(deletion.minimumGroupKeys).toEqual(['["2","P06"]']);
    expect(deletion.maximumGroupKeys).toEqual(['["2","P12"]']);
    expect(deletion.signChangeFromBaseline).toBe(false);
    const k02 = deletion.deletions.find((entry) => entry.sampleId === 'K02')!;
    expect(k02.removedRows).toBe(3);
    expect(k02.recordIds).toHaveLength(3);
  });

  it('distinguishes stable Silicone deletion signs from fragile Kapton signs', () => {
    const result = analyzeDetectorAssociation();
    const silicone = result.byMaterial.find((entry) => entry.material === 'Silicone')!.summary;
    expect(silicone).toMatchObject({ pairedFiniteRows: 22, deletion: { identifiedGroups: 14, signChangeFromBaseline: false } });
    expect(silicone.deletion.minimumRho).toBeCloseTo(-0.6677493044612116, 12);
    expect(silicone.deletion.maximumRho).toBeCloseTo(-0.5460699897267173, 12);
    expect(silicone.association.rangeA.minimum).toBeCloseTo(6.238405, 12);
    expect(silicone.association.rangeA.maximum).toBeCloseTo(6.2771295, 12);
    expect(silicone.association.rangeA.span).toBeCloseTo(0.0387245, 12);
    expect(silicone.association.rangeA.minimumRecordIds).toEqual([expect.stringMatching(/:R125$/)]);
    expect(silicone.association.rangeA.maximumRecordIds).toEqual([expect.stringMatching(/:R132$/)]);
    expect(silicone.association.rangeB.span).toBeCloseTo(2.4175725, 12);
    const kapton = result.byMaterial.find((entry) => entry.material === 'Kapton')!.summary;
    expect(kapton).toMatchObject({ selectedRows: 30, pairedFiniteRows: 29, deletion: { identifiedGroups: 16, signChangeFromBaseline: true } });
    expect(kapton.deletion.minimumRho).toBeCloseTo(-0.2094017094017094, 12);
    expect(kapton.deletion.maximumRho).toBeCloseTo(0.1398046398046398, 12);
  });

  it('retains all-flight counts but skips unidentifiable pooled deletion', () => {
    const result = analyzeDetectorAssociation({ flight: 'all' });
    expect(result.summary).toMatchObject({ selectedRows: 134, pairedFiniteRows: 133 });
    expect(result.summary.association.rho).toBeCloseTo(0.47538305571121386, 12);
    expect(result.summary.deletion.status).toBe('unidentified_rows');
    expect(result.summary.deletion.unidentifiedRecordIds).toHaveLength(25);
    expect(result.summary.deletion.deletions).toEqual([]);
    expect(result.byFlight[0].summary).toMatchObject({ pairedFiniteRows: 25, deletion: { status: 'unidentified_rows' } });
    expect(result.byFlight[1].summary).toMatchObject({ pairedFiniteRows: 108, deletion: { status: 'computed' } });
    expect(result.byFlight[1].byMaterial.find((entry) => entry.material === 'Silicone')?.summary.association.rho).toBeLessThan(0);
  });

  it('retains constant zeros as source values and returns an undefined coefficient', () => {
    const result = analyzeDetectorAssociation({ channelB: 'issObscurationV' });
    expect(result.summary.association).toMatchObject({ status: 'constant_b', rho: null, pairedRows: 108, distinctB: 1, tiedRowsB: 108 });
    expect(result.rows.filter((row) => row.availability === 'bothFinite').every((row) => row.measurementB.value === 0)).toBe(true);
    expect(result.summary.deletion).toMatchObject({ definedDeletions: 0, undefinedDeletions: 65, minimumRho: null, maximumRho: null });
  });

  it('uses exact average ranks for ties and retains finite zero', () => {
    const result = analyzeDetectorAssociation({}, fixture([[0, 0], [1, 1], [1, 2], [2, 2]]));
    expect(result.rows.map((row) => row.rankA)).toEqual([1, 2.5, 2.5, 4]);
    expect(result.rows.map((row) => row.rankB)).toEqual([1, 2, 3.5, 3.5]);
    expect(result.summary.association).toMatchObject({ rho: 15 / 18, tiedRowsA: 2, tiedRowsB: 2, centeredRankProducts: { cross: 15, sumSquaresA: 18, sumSquaresB: 18 } });
    expect(result.summary.availability.bothFinite).toBe(4);
  });

  it.each(([[], [[1, 3]], [[1, 3], [2, 2]]] as Array<Array<[number, number]>>).map((values) => ({ values })))('applies the explicit three-pair display minimum: $values', ({ values }) => {
    const result = analyzeDetectorAssociation({}, fixture(values));
    expect(result.summary.association).toMatchObject({ status: 'insufficient_pairs', rho: null, pairedRows: values.length });
  });

  it.each([
    { values: [[1, 2], [1, 3], [1, 4]], status: 'constant_a' },
    { values: [[1, 2], [2, 2], [3, 2]], status: 'constant_b' },
    { values: [[1, 2], [1, 2], [1, 2]], status: 'constant_both' },
  ] as const)('distinguishes $status from zero association', ({ values, status }) => {
    const result = analyzeDetectorAssociation({}, fixture(values.map(([a, b]) => [a, b])));
    expect(result.summary.association).toMatchObject({ status, rho: null });
  });

  it('matches an independent pairwise-rank oracle across ties, reversals and non-monotonic arrays', () => {
    const arrays = [[0, 1, 2, 3], [3, 2, 1, 0], [0, 0, 2, 3], [2, 0, 3, 1], [1, 3, 3, 1]];
    for (const a of arrays) for (const b of arrays) {
      const values = a.map((value, index): [number, number] => [value, b[index]]);
      expect(analyzeDetectorAssociation({}, fixture(values)).summary.association.rho).toBeCloseTo(oracle(values)!, 14);
    }
  });

  it('reranks after whole-group deletion and keeps undefined deletions visible', () => {
    const values: Array<[number, number]> = [[1, 4], [2, 1], [3, 5], [4, 2], [5, 6], [6, 3]];
    const labels = ['a', 'a', 'b', 'b', 'c', 'c'];
    const result = analyzeDetectorAssociation({}, fixture(values, labels));
    for (const deletion of result.summary.deletion.deletions) {
      expect(deletion.removedRows).toBe(2);
      expect(deletion.association.rho).toBeCloseTo(oracle(values.filter((_, index) => labels[index] !== deletion.sampleId))!, 14);
    }
    const small = analyzeDetectorAssociation({}, fixture([[1, 1], [2, 2], [3, 3]], ['a', 'a', 'b']));
    expect(small.summary.deletion).toMatchObject({ status: 'computed', definedDeletions: 0, undefinedDeletions: 2, minimumRho: null, maximumRho: null });
  });

  it('does not merge the same recorded sample label across flights', () => {
    const data = fixture([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6]], ['x', 'x', 'x', 'x', 'x', 'x']);
    for (const record of data.records.slice(0, 3)) { record.flight = '1'; record.flightLabel = 'SAME'; record.identityCells.flight.originalValue = '1'; }
    const result = analyzeDetectorAssociation({ flight: 'all' }, data);
    expect(result.summary.deletion.identifiedGroups).toBe(2);
    expect(result.summary.deletion.deletions.map((entry) => entry.groupKey)).toEqual(['["1","x"]', '["2","x"]']);
    expect(result.summary.deletion.deletions.every((entry) => entry.removedRows === 3)).toBe(true);
  });

  it('blocks group deletion for an unlabeled selected row even when its channels are unavailable', () => {
    const result = analyzeDetectorAssociation({}, fixture([[1, 1], [2, 2], [3, 3], ['missing', 'missing']], ['a', 'b', 'c', null]));
    expect(result.summary.association.rho).toBe(1);
    expect(result.summary.deletion).toMatchObject({ status: 'unidentified_rows', identifiedGroups: 3, deletions: [] });
    expect(result.summary.deletion.unidentifiedRecordIds).toHaveLength(1);
  });

  it('does not trust a derived sample label that disagrees with its source cell', () => {
    const data = fixture([[1, 1], [2, 2], [3, 3]]);
    data.records[0].identityCells.sampleId.originalValue = 'different';
    expect(analyzeDetectorAssociation({}, data).summary.deletion.status).toBe('unidentified_rows');
  });

  it('does not trust a flight grouping that disagrees with its source cell', () => {
    const data = fixture([[1, 1], [2, 2], [3, 3]]);
    data.records[0].identityCells.flight.originalValue = '1';
    expect(analyzeDetectorAssociation({}, data).summary.deletion.status).toBe('unidentified_rows');
  });

  it('accounts for each availability state and each channel-specific unavailable status', () => {
    const result = analyzeDetectorAssociation({}, fixture([[0, 0], [1, 'missing'], ['error', 2], ['non_numeric', 'error']]));
    expect(result.summary.availability).toEqual({ bothFinite: 1, aOnly: 1, bOnly: 1, neither: 1 });
    expect(result.summary.marginalA).toEqual({ finite: 2, missing: 0, error: 1, nonNumeric: 1 });
    expect(result.summary.marginalB).toEqual({ finite: 2, missing: 1, error: 1, nonNumeric: 0 });
    expect(result.rows.slice(1).every((row) => row.rankA === null && row.rankB === null)).toBe(true);
  });

  it('computes ranges only on finite pairs, including a single pair when rho is suppressed', () => {
    const data = fixture([[4, 7], [999, 'missing'], ['error', -999]]);
    const result = analyzeDetectorAssociation({}, data);
    expect(result.summary.association.rho).toBeNull();
    expect(result.summary.association.rangeA).toEqual({ minimum: 4, maximum: 4, span: 0, spanStatus: 'defined', minimumRecordIds: [data.records[0].id], maximumRecordIds: [data.records[0].id] });
    expect(result.summary.association.rangeB).toMatchObject({ minimum: 7, maximum: 7, span: 0 });
    expect(analyzeDetectorAssociation({}, fixture([['missing', 3]])).summary.association.rangeA).toEqual({ minimum: null, maximum: null, span: null, spanStatus: 'no_pairs', minimumRecordIds: [], maximumRecordIds: [] });
  });

  it('retains every tied endpoint witness and does not serialize overflow as a numeric span', () => {
    const tied = analyzeDetectorAssociation({}, fixture([[1, 1], [1, 2], [1, 3]]));
    expect(tied.summary.association.rangeA.minimumRecordIds).toHaveLength(3);
    expect(tied.summary.association.rangeA.maximumRecordIds).toHaveLength(3);
    const extreme = analyzeDetectorAssociation({}, fixture([[-Number.MAX_VALUE, 0], [0, 1], [Number.MAX_VALUE, 2]]));
    expect(extreme.summary.association.rangeA).toMatchObject({ minimum: -Number.MAX_VALUE, maximum: Number.MAX_VALUE, span: null, spanStatus: 'overflow' });
    expect(extreme.summary.association.rho).toBe(1);
    expect(JSON.parse(JSON.stringify(extreme))).toEqual(extreme);
  });

  it('is invariant to input order, channel swap and strictly increasing unit transforms', () => {
    const values: Array<[number, number]> = [[0, 1], [2, 5], [2, 4], [9, -1], [3, 6]];
    const data = fixture(values);
    const baseline = analyzeDetectorAssociation({}, data);
    const reversed = { ...structuredClone(data), records: [...data.records].reverse() };
    expect(analyzeDetectorAssociation({}, reversed)).toEqual(baseline);
    expect(analyzeDetectorAssociation({ channelA: 'ionDeltaV', channelB: 'issScatterV' }, data).summary.association.rho).toBe(baseline.summary.association.rho);
    expect(analyzeDetectorAssociation({}, fixture(values.map(([a, b]) => [1000 * a + 2, 1000 * b - 5]))).summary.association.rho).toBe(baseline.summary.association.rho);
  });

  it('preserves source witnesses, identity conflicts and caller isolation', () => {
    const result = analyzeDetectorAssociation();
    const row = result.rows.find((item) => item.record.excelRow === 50)!;
    expect(row.measurementA).toMatchObject({ cell: 'AW50', status: 'missing', value: null });
    expect(row.measurementB.cell).toBe('BK50');
    expect(result.source.workbook.sha256).toBe('6d3a539ccf425b1fa8edc19cc75d828f57d650c7ce734d4e7aa686fea9593218');
    expect(result.identityConflicts).toEqual(detectorDataset.identityConflicts);
    result.rows[0].measurementA.value = 999;
    result.source.workbook.sha256 = '0'.repeat(64);
    expect(analyzeDetectorAssociation().summary.association.rho).toBeCloseTo(0.4435817129467917, 12);
    expect(JSON.parse(JSON.stringify(analyzeDetectorAssociation()))).toEqual(analyzeDetectorAssociation());
  });

  it('includes references only explicitly and rejects invalid selection/source data', () => {
    expect(analyzeDetectorAssociation({ flight: 'all', includeReference: true }).summary.selectedRows).toBe(154);
    expect(analyzeDetectorAssociation({ material: 'DBP' }).summary.selectedRows).toBe(0);
    expect(DetectorAssociationSelectionSchema.safeParse({ ...DEFAULT_DETECTOR_ASSOCIATION_SELECTION, channelB: 'issScatterV' }).success).toBe(false);
    expect(() => analyzeDetectorAssociation({ flight: '9' } as never)).toThrow();
    expect(() => analyzeDetectorAssociation({ extra: true } as never)).toThrow();
    expect(() => analyzeDetectorAssociation(null as never)).toThrow();
    const data = fixture([[1, 2], [2, 3], [3, 4]]);
    data.records[0].channels.issScatterV.value = 99;
    expect(() => analyzeDetectorAssociation({}, data)).toThrow(/numeric cache/);
  });
});

describe('bounded current-source association package', () => {
  it('replays the complete result and returns a detached recomputation', () => {
    const result = analyzeDetectorAssociation();
    const packet = createAssociationPackage(result);
    expect(packet.resultSha256).toBe(digestOf(result));
    const replay = replayAssociationPackage(JSON.stringify(packet));
    expect(replay).toEqual(packet);
    expect(replay.result).not.toBe(result);
  });

  it.each(['issObscurationV', 'stsV'] as const)('keeps tie-heavy %s exports below the replay limit', (channelB) => {
    const packet = createAssociationPackage(analyzeDetectorAssociation({ channelB }));
    const text = JSON.stringify(packet, null, 2);
    expect(new TextEncoder().encode(text).length).toBeLessThan(MAX_ASSOCIATION_PACKAGE_BYTES);
    expect(replayAssociationPackage(text)).toEqual(packet);
  });

  it('rejects checksum failure and a rechecksummed changed scientific result', () => {
    const packet = createAssociationPackage(analyzeDetectorAssociation());
    packet.result.summary.association.rho = 0.99;
    expect(() => replayAssociationPackage(JSON.stringify(packet))).toThrow(/checksum/);
    packet.resultSha256 = digestOf(packet.result);
    expect(() => replayAssociationPackage(JSON.stringify(packet))).toThrow(/REPLAY_MISMATCH/);
  });

  it('reports source and method drift even with a valid payload checksum', () => {
    const packet = createAssociationPackage(analyzeDetectorAssociation());
    packet.result.source.workbook.sha256 = '0'.repeat(64);
    packet.resultSha256 = digestOf(packet.result);
    expect(() => replayAssociationPackage(JSON.stringify(packet))).toThrow(/SOURCE_DRIFT/);
    const other = JSON.parse(JSON.stringify(createAssociationPackage(analyzeDetectorAssociation())));
    other.result.methodRevision = 'different-method'; other.resultSha256 = digestOf(other.result);
    expect(() => replayAssociationPackage(JSON.stringify(other))).toThrow(/METHOD_DRIFT/);
  });

  it('rejects unknown fields, malformed/deep JSON and oversized UTF-8', () => {
    const packet = createAssociationPackage(analyzeDetectorAssociation());
    expect(() => replayAssociationPackage(JSON.stringify({ ...packet, extra: 1 }))).toThrow(/fields/);
    expect(() => replayAssociationPackage('{')).toThrow(/valid JSON/);
    expect(() => replayAssociationPackage(' '.repeat(MAX_ASSOCIATION_PACKAGE_BYTES + 1))).toThrow(/2 MiB/);
    expect(() => replayAssociationPackage('é'.repeat(MAX_ASSOCIATION_PACKAGE_BYTES / 2 + 1))).toThrow(/2 MiB/);
    let deep: unknown = null;
    for (let index = 0; index < 50; index += 1) deep = [deep];
    expect(() => replayAssociationPackage(JSON.stringify({ schemaVersion: 'ignis-association-export-1', result: deep, resultSha256: '0'.repeat(64) }))).toThrow(/structure/);
  });
});
