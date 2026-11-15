import { describe, expect, it } from 'vitest';
import { digestOf } from '../../src/core/canonicalize';
import { channelDifferences, makeDifferencePackage, replayDifferencePackage, serializeDifferencePackage, type Pairing } from '../../src/core/channelDifferences';
import { defaultRecipe, parseCsv, type ImportSpec } from '../../src/core/workbench';

const spec: ImportSpec = { delimiter: ',', headerRecord: 1, firstDataRecord: 2, lastDataRecord: null, origin: 'hypothetical', sourceDescription: 'Invented arithmetic test',
  context: 'One invented fixed context', timeOrigin: 'Shared synthetic clock', timeColumn: 0, timeUnit: 's', timeMissingTokens: [], run: { kind: 'column', column: 1 }, phase: { kind: 'constant', value: 'spread' },
  channels: [2, 3].map((column) => ({ column, quantity: 'Coordinate', unit: 'mm', operator: 'Invented same coordinate operator', missingTokens: ['-9999'] })) };
const recipe = { ...defaultRecipe(spec), run: 'a', phase: 'spread' }, pair: Pairing = { leftColumn: 2, rightColumn: 3, alignedByRecord: true,
  linearAdditiveQuantity: true, sharedReferenceDatum: true, referenceDatum: 'Same invented coordinate zero and axis', upstreamProcessing: 'Invented same-row values, no fit or resampling.' };
const doc = (rows = '0,a,1,0\n1,a,2,4\n2,a,,3\n3,a,-9999,1\n4,b,100,0\n') => parseCsv(new TextEncoder().encode('\uFEFFtime,run,a,b\r\n' + rows), ',');
const resign = (packet: ReturnType<typeof makeDifferencePackage>) => { const body: Record<string, unknown> = { ...packet }; delete body.checksum; packet.checksum = digestOf(body); };

describe('operator-bound channel differences', () => {
  it('computes signed, absolute and RMS differences with explicit missing-pair counts and source witnesses', () => {
    const result = channelDifferences(doc(), spec, recipe, pair);
    expect(result.counts).toEqual({ selected: 4, paired: 2, unavailablePairs: 2, arithmeticOverflow: 0, excludedRecords: 1 });
    expect(result.metrics?.meanDifference).toBe(-0.5); expect(result.metrics?.meanAbsoluteDifference).toBe(1.5);
    expect(result.metrics?.rootMeanSquareDifference).toBeCloseTo(Math.sqrt(2.5), 14); expect(result.metrics?.maximumRecords).toEqual([3]);
    expect(result.pairs[0]).toMatchObject({ record: 2, leftRaw: '1', rightRaw: '0', difference: 1 });
    expect(result.pairs[2]).toMatchObject({ state: 'unavailable_pair', leftStatus: 'blank' });
    expect(result.pairs[3]).toMatchObject({ rightRaw: '1', leftRaw: '-9999', leftStatus: 'declared_missing' });
  });
  it('single-pair descriptive metrics are defined; zero is retained; empty selections produce no aggregate', () => {
    expect(channelDifferences(doc('0,a,3,1'), spec, recipe, pair).metrics).toMatchObject({ meanDifference: 2, rootMeanSquareDifference: 2 });
    expect(channelDifferences(doc('0,a,0,0'), spec, recipe, pair).metrics?.rootMeanSquareDifference).toBe(0);
    expect(channelDifferences(doc('0,a,,1'), spec, recipe, pair).metrics).toBeNull();
  });
  it('rejects pooling across runs/phases and self-comparison', () => {
    expect(() => channelDifferences(doc(), spec, { ...recipe, run: null }, pair)).toThrow(/one explicit run/);
    expect(() => channelDifferences(doc(), spec, recipe, { ...pair, rightColumn: 2 })).toThrow(/distinct/);
  });
  it('requires explicit additive-scale and common-datum assertions even when labels, units and operators match', () => {
    for (const field of ['linearAdditiveQuantity', 'sharedReferenceDatum', 'referenceDatum'] as const) {
      const missing: Record<string, unknown> = { ...pair }; delete missing[field];
      expect(() => channelDifferences(doc(), spec, recipe, missing)).toThrow();
    }
    for (const field of ['linearAdditiveQuantity', 'sharedReferenceDatum'] as const) expect(() => channelDifferences(doc(), spec, recipe, { ...pair, [field]: false })).toThrow();
    for (const datum of ['', '  ', 'unknown', 'Not known']) expect(() => channelDifferences(doc(), spec, recipe, { ...pair, referenceDatum: datum })).toThrow();
    const result = channelDifferences(doc(), spec, recipe, pair);
    expect(result.assumptions.referenceDatum).toBe(pair.referenceDatum);
    expect(result.declarationStatus).toMatch(/none are independently verified/);
    expect(result.alignmentCaveat).toMatch(/Relative lag/);
  });
  it('blocks different or unknown quantities, units, operators and time/context declarations', () => {
    for (const field of ['quantity', 'unit', 'operator'] as const) {
      const changed = structuredClone(spec); changed.channels[1][field] = 'different';
      const result = channelDifferences(doc(), changed, recipe, pair); expect(result.metrics).toBeNull(); expect(result.blockers.length).toBeGreaterThan(0);
      expect(result.pairs.every((p) => p.difference === null)).toBe(true);
    }
    for (const field of ['timeOrigin', 'context'] as const) expect(channelDifferences(doc(), { ...spec, [field]: null }, recipe, pair).metrics).toBeNull();
    expect(channelDifferences(doc(), { ...spec, timeUnit: 'unknown' }, recipe, pair).metrics).toBeNull();
  });
  it('does not silently sort, deduplicate, synchronize or interpolate times', () => {
    for (const rows of ['1,a,2,1\n0,a,3,1', '0,a,2,1\n0,a,3,1']) {
      const result = channelDifferences(doc(rows), spec, recipe, pair); expect(result.metrics).toBeNull(); expect(result.blockers.join(' ')).toMatch(/repeated or decreasing/);
      expect(result.blockers.join(' ')).toMatch(/policy/); expect(result.blockers.join(' ')).toMatch(/not mathematically undefined/);
      expect(result.pairs.map((p) => p.record)).toEqual([2, 3]);
    }
  });
  it('computes finite large RMS without overflowing squared intermediates and blocks true subtraction overflow', () => {
    expect(channelDifferences(doc('0,a,1e200,0\n1,a,-1e200,0'), spec, recipe, pair).metrics).toMatchObject({ meanDifference: 0, rootMeanSquareDifference: 1e200 });
    const overflow = channelDifferences(doc('0,a,1e308,-1e308\n1,a,1,0'), spec, recipe, pair);
    expect(overflow.counts.arithmeticOverflow).toBe(1); expect(overflow.metrics).toBeNull();
    expect(overflow.pairs[0]).toMatchObject({ state: 'arithmetic_overflow', leftRaw: '1e308', rightRaw: '-1e308', difference: null });
    expect(overflow.pairs[1].difference).toBe(1);
  });
  it('retains cancellation residuals across dynamic range and avoids overflowing an otherwise finite mean', () => {
    const compare = (values: number[]) => channelDifferences(doc(values.map((v, i) => `${i},a,${v},0`).join('\n')), spec, recipe, pair);
    for (const values of [[1e16, 1, -1e16], [-1e16, 1, 1e16], [1, 1e16, -1e16]]) expect(compare(values).metrics?.meanDifference).toBe(1 / 3);
    expect(compare([1e308, 1e-100, -1e308]).metrics?.meanDifference).toBe(1e-100 / 3);
    expect(compare([1e308, 1e308, 1e-100, -1e308, -1e308]).metrics?.meanDifference).toBe(1e-100 / 5);
    expect(compare([1, 1e200, 1e308, 1, 1e100, -1e200, -1e100, -1e308]).metrics?.meanDifference).toBe(0.25);
    expect(compare([1e308, 1e308, -1e308]).metrics?.meanDifference).toBe(1e308 / 3);
    const allLarge = compare([1e308, 1e308]);
    expect(allLarge.metrics).toMatchObject({ meanDifference: 1e308, meanAbsoluteDifference: 1e308, rootMeanSquareDifference: 1e308 });
    expect(allLarge.numericalWarnings).toEqual([]);
  });
  it('keeps one tiny finite difference and marks unrepresentable nonzero summaries unavailable, never zero', () => {
    const one = channelDifferences(doc('0,a,5e-324,0'), spec, recipe, pair);
    expect(one.metrics).toMatchObject({ meanDifference: Number.MIN_VALUE, meanAbsoluteDifference: Number.MIN_VALUE, rootMeanSquareDifference: Number.MIN_VALUE });
    expect(one.pairs[0].difference).toBe(Number.MIN_VALUE); expect(one.numericalWarnings).toEqual([]);
    const tiny = channelDifferences(doc('0,a,1e-300,0\n1,a,-1e-300,0'), spec, recipe, pair);
    expect(tiny.metrics).toMatchObject({ meanDifference: 0, meanAbsoluteDifference: 1e-300, rootMeanSquareDifference: 1e-300 });
    const underflow = channelDifferences(doc('0,a,5e-324,0\n1,a,0,0\n2,a,0,0\n3,a,0,0\n4,a,0,0'), spec, recipe, pair);
    expect(underflow.metrics).toMatchObject({ meanDifference: null, meanAbsoluteDifference: null, rootMeanSquareDifference: null, maximumAbsoluteDifference: Number.MIN_VALUE, maximumRecords: [2] });
    expect(underflow.counts.paired).toBe(5); expect(underflow.numericalWarnings).toHaveLength(3);
    expect(underflow.numericalWarnings.every((warning) => warning.includes('underflow'))).toBe(true);
    const invalid = channelDifferences(doc('0,a,1e-400,0'), spec, recipe, pair);
    expect(invalid.pairs[0]).toMatchObject({ leftRaw: '1e-400', left: null, leftStatus: 'invalid', state: 'unavailable_pair', difference: null });
    expect(invalid.pairs[0].leftReason).toMatch(/underflows/); expect(invalid.metrics).toBeNull();
  });
  it('withholds only the mean if overflow recovery also erases an original nonzero difference', () => {
    // Reachable combined condition: the direct total overflows, while 1e-100 / 1e308 is zero.
    // This tests the conservative fallback boundary, not a claim that this fixture's true mean is zero.
    const result = channelDifferences(doc('0,a,1e308,0\n1,a,1e308,0\n2,a,1e-100,0'), spec, recipe, pair);
    expect(result.metrics?.meanDifference).toBeNull(); expect(result.metrics?.maximumAbsoluteDifference).toBe(1e308);
    expect(Number.isFinite(result.metrics?.meanAbsoluteDifference)).toBe(true);
    expect(Number.isFinite(result.metrics?.rootMeanSquareDifference)).toBe(true);
    expect(result.metrics!.meanAbsoluteDifference!).toBeGreaterThan(0); expect(result.metrics!.rootMeanSquareDifference!).toBeGreaterThan(0);
    expect(result.counts).toMatchObject({ paired: 3, arithmeticOverflow: 0 });
    expect(result.pairs[2]).toMatchObject({ leftRaw: '1e-100', difference: 1e-100, state: 'paired' });
    expect(result.numericalWarnings).toHaveLength(1); expect(result.numericalWarnings[0]).toMatch(/signed total overflowed and normalization erased/);
  });
  it('weights available rows equally, retains original witnesses and describes the changed missing-pair population', () => {
    const source = doc('0,a,2,1\n100,a,4,1\n101,a,,1'), result = channelDifferences(source, spec, recipe, pair);
    expect(result.metrics?.meanDifference).toBe(2); expect(result.counts).toMatchObject({ selected: 3, paired: 2, unavailablePairs: 1 });
    expect(result.interpretation).toMatch(/not time weighting/); expect(result.interpretation).toMatch(/Missing pairs change the represented population/);
    for (const witness of result.pairs) expect(witness).toMatchObject({ record: source.records[witness.record - 1].record, lineStart: source.records[witness.record - 1].lineStart, lineEnd: source.records[witness.record - 1].lineEnd, byteStart: source.records[witness.record - 1].byteStart, byteEnd: source.records[witness.record - 1].byteEnd });
  });
  it('recomputes from exact raw bytes and rejects tampering even when outer hashes are recomputed', () => {
    const source = doc(), packet = makeDifferencePackage(source, 'hypothetical.csv', spec, recipe, pair);
    const replay = replayDifferencePackage(serializeDifferencePackage(packet)); expect(replay.document.rawText).toBe(source.rawText); expect(replay.result).toEqual(packet.result);
    packet.result.metrics!.meanDifference = 123; packet.resultDigest = digestOf(packet.result); resign(packet);
    expect(() => replayDifferencePackage(serializeDifferencePackage(packet))).toThrow(/Recomputed comparison differs/);
  });
  it('refuses stale cached documents and unsupported historical method revisions', () => {
    const changed = doc(); changed.rawText += '5,a,9,3\n'; expect(() => channelDifferences(changed, spec, recipe, pair)).toThrow(/byte receipt/);
    const packet = makeDifferencePackage(doc(), 'hypothetical.csv', spec, recipe, pair); packet.methodRevision = 'paired-channel-differences-2026-11-15.1';
    delete (packet.pairing as Partial<Pairing>).linearAdditiveQuantity;
    delete (packet.pairing as Partial<Pairing>).sharedReferenceDatum;
    delete (packet.pairing as Partial<Pairing>).referenceDatum;
    resign(packet);
    expect(() => replayDifferencePackage(serializeDifferencePackage(packet))).toThrow(/historical comparison/);
  });
});
