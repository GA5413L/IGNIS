import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { digestOf, sha256Bytes } from '../../src/core/canonicalize';
import { MAX_CSV_BYTES, WORKBENCH_METHOD, defaultRecipe, inspectCsv, makeWorkbenchPackage, numericCell, parseCsv,
  replayWorkbenchPackage, serializeWorkbenchPackage, validateImportSpec, type ImportSpec, type WorkbenchPackage } from '../../src/core/workbench';

const spec = (): ImportSpec => ({ delimiter: ',', headerRecord: 1, firstDataRecord: 2, lastDataRecord: null,
  origin: 'user_observation', sourceDescription: null, context: null, timeOrigin: null,
  timeColumn: 0, timeUnit: 'ms', run: { kind: 'column', column: 1 }, phase: { kind: 'constant', value: 'unspecified' },
  channels: [{ column: 2, quantity: 'Coordinate', unit: 'mm', operator: null, missingTokens: [] }], timeMissingTokens: [] });
const doc = (raw = 'time,run,x\n0,a,1\n1000,a,2\n2000,a,3\n') => parseCsv(new TextEncoder().encode(raw), ',');
const resign = (packet: WorkbenchPackage) => { const body: Record<string, unknown> = { ...packet }; delete body.checksum; packet.checksum = digestOf(body); return packet; };

describe('byte-preserving bounded CSV parser', () => {
  it.each(['\uFEFFtime,run,x\r\n0,µ,1\r\n', 'time,run,x\n0,a,1\r1000,a,2\r\n', 'time,run,x\n0,a,1'])('preserves exact original UTF-8 bytes and replays %j', (raw) => {
    const bytes = new TextEncoder().encode(raw), document = parseCsv(bytes, ',');
    expect(document.sha256).toBe(createHash('sha256').update(bytes).digest('hex'));
    expect(new TextEncoder().encode(document.rawText)).toEqual(bytes);
    const packet = makeWorkbenchPackage(document, 'input.csv', spec(), defaultRecipe(spec()));
    expect(replayWorkbenchPackage(serializeWorkbenchPackage(packet)).document.rawText).toBe(raw);
  });
  it('uses byte offsets and physical lines even with quotes, newlines and multibyte characters', () => {
    const document = doc('time,run,x\r\n0,"µ\r\n""α""",1\r\n1000,b,2');
    expect(document.records[1]).toMatchObject({ record: 2, lineStart: 2, lineEnd: 3, byteStart: 12, cells: ['0', 'µ\r\n"α"', '1'] });
    const bytes = new TextEncoder().encode(document.rawText), r = document.records[1];
    expect(new TextDecoder().decode(bytes.slice(r.byteStart, r.byteEnd))).toBe('0,"µ\r\n""α""",1');
    expect(document.records[2].lineStart).toBe(4);
  });
  it.each([[0xc0, 0xaf], [0x80], [0xff, 0xfe, 0x61, 0], [0xed, 0xa0, 0x80]])('rejects invalid encodings %j', (...bytes) => {
    expect(() => parseCsv(new Uint8Array(bytes), ',')).toThrow(/UTF-8/);
  });
  it.each(['a,b\n1,"oops', 'a,b\n1,a"b', 'a,b\n1,"b"x', 'a,b\n1, "b"'])('rejects malformed quoting %j', (raw) => expect(() => doc(raw)).toThrow(/quote|quoted/));
  it('rejects controls, empty files, overlarge files and too many columns', () => {
    expect(() => doc('a\n\0')).toThrow(/control/);
    expect(() => doc('')).toThrow(/1 byte/);
    expect(() => parseCsv(new Uint8Array(MAX_CSV_BYTES + 1), ',')).toThrow(/1 MiB/);
    expect(() => doc(Array(33).fill('x').join(','))).toThrow(/32 columns/);
  });
  it('allows a declared preamble, units record and footer without deleting them', () => {
    const document = doc('instrument note\ntime,run,x\nms,id,mm\n0,a,1\nsummary');
    const s = { ...spec(), headerRecord: 2, firstDataRecord: 4, lastDataRecord: 4 };
    const result = inspectCsv(document, s, defaultRecipe(s));
    expect(result.skippedRecords).toEqual([1, 2, 3, 5]); expect(result.includedRecords).toEqual([4]);
    expect(document.records[0].cells[0]).toBe('instrument note');
  });
  it.each(['time,run,x\n0,a', 'time,run,x\n\n0,a,1', 'time,run,run\n0,a,1', 'time, ,x\n0,a,1'])('rejects ragged data and ambiguous headers %j', (raw) => expect(() => validateImportSpec(doc(raw), spec())).toThrow());
  it('does not permit aliased mappings, absent columns or invalid ranges', () => {
    expect(() => validateImportSpec(doc(), { ...spec(), timeColumn: 2 })).toThrow(/distinct/);
    expect(() => validateImportSpec(doc(), { ...spec(), timeColumn: 31 })).toThrow(/absent/);
    expect(() => validateImportSpec(doc(), { ...spec(), firstDataRecord: 1 })).toThrow();
    expect(() => validateImportSpec(doc(), { ...spec(), lastDataRecord: 100 })).toThrow(/range/);
  });
  it('rejects oversized row/channel/group counts', () => {
    const many = doc('time,run,x\n' + '0,a,1\n'.repeat(5001));
    expect(() => validateImportSpec(many, spec())).toThrow(/5000/);
    expect(() => validateImportSpec(doc(), { ...spec(), channels: Array(5).fill(spec().channels[0]) })).toThrow();
    const groups = doc('time,run,x\n' + Array.from({ length: 129 }, (_, i) => `0,run${i},1\n`).join(''));
    expect(() => inspectCsv(groups, spec(), defaultRecipe(spec()))).toThrow(/128/);
  });
});

describe('numeric grammar and inspection boundaries', () => {
  it.each(['', ' ', '\t', '\r\n'])('keeps %j missing', (raw) => expect(numericCell(raw).status).toBe('blank'));
  it.each(['0x10', 'Infinity', '-Infinity', 'NaN', '1,5', '−1', '1/2', '=2+2', '1e', '1e400', '1e-400'])('does not evaluate or silently coerce %j', (raw) => expect(numericCell(raw).status).toBe('invalid'));
  it.each([['+1', 1], ['.5', 0.5], ['5.', 5], [' 1 ', 1], ['-0', 0], ['2e3', 2000], ['0e-999', 0], ['5e-324', 5e-324]] as const)('accepts %s retaining raw text', (raw, value) => expect(numericCell(raw)).toEqual({ raw, value, status: 'finite', reason: null }));
  it('matches declared sentinel tokens exactly and does not guess zeros', () => {
    expect(numericCell('-9999', ['-9999']).status).toBe('declared_missing');
    expect(numericCell(' -9999', ['-9999']).value).toBe(-9999);
    expect(numericCell('0').value).toBe(0);
    const result = inspectCsv(doc('time,run,x\n0,a,-9999'), spec(), defaultRecipe(spec()));
    expect(result.channels[0].minimum).toBe(-9999); expect(result.warnings.join(' ')).toContain('No sentinel');
  });
  it('keeps missing/invalid cells, identities and times in a full ledger without sorting', () => {
    const s = spec(), document = doc('time,run,x\n2,a,4\n1,a,\n1,a,bad\n, a,5\n3,,2\n4,a,6');
    const result = inspectCsv(document, s, defaultRecipe(s));
    expect(result.rows.map((r) => r.record)).toEqual([2, 3, 4, 5, 6, 7]);
    expect(result.includedRecords).toEqual([2, 3, 4, 7]); expect(result.excludedRecords).toEqual([5, 6]);
    expect(result.rows[1].timeFlags).toContain('Time decreases in source order');
    expect(result.rows[2].timeFlags.join(' ')).toContain('Repeated binary64');
    expect(result.channels[0]).toMatchObject({ finite: 2, unavailable: 2, minimum: 4, maximum: 6, minRecords: [2], maxRecords: [7] });
    expect(result.groups.map((g) => g.run)).toEqual(['a', ' a']);
    expect(result.metadataVerified).toBe(false); expect(result.measurementValidated).toBe(false);
  });
  it('windows in supplied coordinates, inclusive at both edges, without pretending unit conversion', () => {
    const s = spec(), document = doc();
    const result = inspectCsv(document, s, { ...defaultRecipe(s), timeMin: 1000, timeMax: 2000 });
    expect(result.includedRecords).toEqual([3, 4]); expect(result.unitConversion).toBe('none');
    expect(result.rows[1].time.value).toBe(1000);
  });
  it('flags binary64 timestamp collisions explicitly without calling them identical raw times', () => {
    const result = inspectCsv(doc('time,run,x\n9007199254740992,a,1\n9007199254740993,a,2'), spec(), defaultRecipe(spec()));
    expect(result.rows[0].time.raw).not.toBe(result.rows[1].time.raw);
    expect(result.rows[1].timeFlags[0]).toContain('rounding collisions');
  });
  it('does not infer known units, operators, source quality or missing-run identities', () => {
    const s = { ...spec(), timeUnit: 'unknown', channels: [{ ...spec().channels[0], unit: 'unknown' }] };
    const result = inspectCsv(doc(), s, defaultRecipe(s));
    expect(result.channels[0].operator).toBeNull(); expect(result.warnings.join(' ')).toContain('unknown');
    expect(() => inspectCsv(doc(), s, { ...defaultRecipe(s), run: 'not present' })).toThrow(/absent/);
  });
});

describe('replay integrity and actual recomputation', () => {
  const packet = () => makeWorkbenchPackage(doc(), 'source.csv', spec(), defaultRecipe(spec()));
  it('agrees with Node SHA-256 on arbitrary bytes', () => {
    const bytes = Uint8Array.from({ length: 1025 }, (_, i) => i % 256);
    expect(sha256Bytes(bytes)).toBe(createHash('sha256').update(bytes).digest('hex'));
  });
  it('replays exact data/mapping/view/results and has deterministic checksums', () => {
    const p = packet(); expect(packet()).toEqual(p);
    expect(replayWorkbenchPackage(serializeWorkbenchPackage(p)).result.methodRevision).toBe(WORKBENCH_METHOD);
  });
  it.each(['raw', 'mapping', 'result'])('detects a changed %s even if the envelope is resigned', (field) => {
    const p = packet();
    if (field === 'raw') p.file.rawUtf8 += '\n';
    if (field === 'mapping') p.spec.channels[0].unit = 'm';
    if (field === 'result') { p.result.includedRecords = []; p.resultDigest = digestOf(p.result); }
    expect(() => replayWorkbenchPackage(JSON.stringify(resign(p)))).toThrow(/mismatch|differs/);
  });
  it('refuses an unavailable historical method instead of substituting current results', () => {
    const p = packet(); p.methodRevision = 'older-method';
    expect(() => replayWorkbenchPackage(JSON.stringify(resign(p)))).toThrow(/not installed/);
  });
  it('reparses raw bytes when exporting instead of trusting modified cached records', () => {
    const document = doc(); document.records[1].cells[2] = '999';
    const p = makeWorkbenchPackage(document, 'source.csv', spec(), defaultRecipe(spec()));
    expect(replayWorkbenchPackage(JSON.stringify(p)).result.channels[0].minimum).toBe(1);
  });
  it('refuses invalid JSON strings that cannot roundtrip as original UTF-8', () => {
    const p = packet(); p.file.rawUtf8 = 'time,run,x\n0,a,\uD800';
    p.file.byteCount = new TextEncoder().encode(p.file.rawUtf8).length; p.file.sha256 = sha256Bytes(new TextEncoder().encode(p.file.rawUtf8));
    expect(() => replayWorkbenchPackage(JSON.stringify(resign(p)))).toThrow(/byte/);
  });
});
