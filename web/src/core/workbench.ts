/** Local CSV inspection. Supplied bytes and user assertions are never promoted to curated evidence. */
import { z } from 'zod';
import { digestOf, sha256Bytes } from './canonicalize';

export const WORKBENCH_METHOD = 'csv-inspection-2026-11-15.1';
export const WORKBENCH_SCHEMA = 'ignis-local-data-1';
export const MAX_CSV_BYTES = 1024 * 1024;
export const MAX_WORKBENCH_PACKAGE_BYTES = 8 * 1024 * 1024;
const MAX_RECORDS = 5201, MAX_COLUMNS = 32, MAX_DATA_ROWS = 5000;
const text = z.string().min(1).max(200).refine((v) => v.trim().length > 0, 'Use an explicit value or the word unknown, not whitespace.');
const note = z.string().min(1).max(1000).refine((v) => v.trim().length > 0, 'Use null for an unknown declaration.').nullable();
const index = z.number().int().min(0).max(MAX_COLUMNS - 1);
const identity = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('column'), column: index }),
  z.strictObject({ kind: z.literal('constant'), value: text }),
]);
export const ImportSpecSchema = z.strictObject({
  delimiter: z.enum([',', ';', '\t']),
  headerRecord: z.number().int().min(1).max(100),
  firstDataRecord: z.number().int().min(2).max(200),
  lastDataRecord: z.number().int().min(2).max(MAX_RECORDS).nullable(),
  origin: z.enum(['user_observation', 'user_solver_output', 'hypothetical']),
  sourceDescription: note, context: note, timeOrigin: note,
  timeColumn: index, timeUnit: text,
  run: identity, phase: identity,
  channels: z.array(z.strictObject({ column: index, quantity: text, unit: text, operator: note,
    missingTokens: z.array(z.string().max(100)).max(16) })).min(1).max(4),
  timeMissingTokens: z.array(z.string().max(100)).max(16),
});
export type ImportSpec = z.infer<typeof ImportSpecSchema>;
export const ViewRecipeSchema = z.strictObject({
  run: text.nullable(), phase: text.nullable(),
  timeMin: z.number().finite().nullable(), timeMax: z.number().finite().nullable(),
  channels: z.array(index).min(1).max(4), selectedRecord: z.number().int().min(2).max(MAX_RECORDS).nullable(),
});
export type ViewRecipe = z.infer<typeof ViewRecipeSchema>;
export interface CsvRecord { record: number; lineStart: number; lineEnd: number; byteStart: number; byteEnd: number; cells: string[] }
export interface CsvDocument { rawText: string; sha256: string; byteCount: number; bom: boolean; delimiter: ImportSpec['delimiter']; records: CsvRecord[] }
export type NumericCell = { raw: string; value: number | null; status: 'finite' | 'blank' | 'declared_missing' | 'invalid'; reason: string | null };
export interface InspectedRow {
  record: number; lineStart: number; lineEnd: number; byteStart: number; byteEnd: number;
  run: string; phase: string; time: NumericCell; values: { column: number; cell: NumericCell }[];
  included: boolean; exclusions: string[]; timeFlags: string[];
}
export interface InspectionResult {
  methodRevision: string; sourceSha256: string; specDigest: string; recipeDigest: string;
  origin: ImportSpec['origin']; metadataVerified: false; measurementValidated: false; unitConversion: 'none';
  precision: string; skippedRecords: number[]; rows: InspectedRow[];
  groups: { run: string; phase: string; records: number[] }[];
  channels: { column: number; quantity: string; unit: string; operator: string | null;
    finite: number; unavailable: number; minimum: number | null; maximum: number | null; minRecords: number[]; maxRecords: number[] }[];
  includedRecords: number[]; excludedRecords: number[]; warnings: string[];
}

/** UTF-8 only. ignoreBOM=true keeps U+FEFF in rawText so re-encoding preserves the original bytes. */
export function parseCsv(bytes: Uint8Array, delimiter: ImportSpec['delimiter']): CsvDocument {
  if (bytes.byteLength === 0 || bytes.byteLength > MAX_CSV_BYTES) throw new Error('CSV must contain 1 byte to 1 MiB. Nothing was truncated.');
  if (![',', ';', '\t'].includes(delimiter)) throw new Error('Choose comma, semicolon or tab explicitly.');
  let rawText: string;
  try { rawText = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes); }
  catch { throw new Error('CSV must be valid UTF-8. Convert an original copy explicitly; do not rename an Excel or UTF-16 file.'); }
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(rawText)) throw new Error('CSV contains unsupported control characters.');
  const bom = rawText.startsWith('\uFEFF');
  const records: CsvRecord[] = [];
  let cells: string[] = [], cell = '', quoted = false, closed = false, line = 1, lineStart = 1;
  let byte = bom ? 3 : 0, byteStart = byte, active = false;
  const pushCell = () => {
    cells.push(cell); cell = ''; closed = false;
    if (cells.length > MAX_COLUMNS) throw new Error(`Record ${records.length + 1} exceeds 32 columns.`);
  };
  const pushRecord = (byteEnd: number) => {
    pushCell(); records.push({ record: records.length + 1, lineStart, lineEnd: line, byteStart, byteEnd, cells });
    if (records.length > MAX_RECORDS) throw new Error('CSV exceeds the bounded record limit.');
    cells = []; active = false;
  };
  for (let i = bom ? 1 : 0; i < rawText.length;) {
    const ch = String.fromCodePoint(rawText.codePointAt(i)!);
    const cp = ch.codePointAt(0)!;
    const width = cp < 0x80 ? 1 : cp < 0x800 ? 2 : cp < 0x10000 ? 3 : 4;
    const newline = ch === '\n' || ch === '\r';
    const nl = ch === '\r' && rawText[i + 1] === '\n' ? '\r\n' : ch;
    if (quoted) {
      if (ch === '"') {
        if (rawText[i + 1] === '"') { cell += '"'; i += 2; byte += 2; continue; }
        quoted = false; closed = true;
      } else if (newline) { cell += nl; line++; i += nl.length; byte += nl.length; continue; }
      else cell += ch;
    } else if (ch === delimiter) { pushCell(); active = true; }
    else if (newline) {
      pushRecord(byte); i += nl.length; byte += nl.length; line++; lineStart = line; byteStart = byte; continue;
    } else if (closed) throw new Error(`Unexpected content after a closing quote at physical line ${line}.`);
    else if (ch === '"') {
      if (cell.length) throw new Error(`Quote inside an unquoted field at physical line ${line}.`);
      quoted = true; active = true;
    } else { cell += ch; active = true; }
    i += ch.length; byte += width;
  }
  if (quoted) throw new Error(`Unclosed quoted field at physical line ${line}.`);
  if (active || cell.length || cells.length || closed) pushRecord(byte);
  if (!records.length) throw new Error('CSV has no records.');
  return { rawText, sha256: sha256Bytes(bytes), byteCount: bytes.length, bom, delimiter, records };
}

export function numericCell(raw: string, missingTokens: readonly string[] = []): NumericCell {
  const base = { raw, value: null };
  if (missingTokens.includes(raw)) return { ...base, status: 'declared_missing', reason: 'Exact user-declared missing token' };
  const valueText = raw.trim();
  if (!valueText) return { ...base, status: 'blank', reason: 'Blank or whitespace-only cell' };
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(valueText))
    return { ...base, status: 'invalid', reason: 'Expected a decimal number, optionally with e notation; no expressions, hex or decimal commas' };
  const value = Number(valueText);
  if (!Number.isFinite(value)) return { ...base, status: 'invalid', reason: 'Number overflows binary64' };
  if (value === 0 && /[1-9]/.test(valueText.split(/[eE]/)[0])) return { ...base, status: 'invalid', reason: 'Nonzero number underflows to zero in binary64' };
  return { raw, value: Object.is(value, -0) ? 0 : value, status: 'finite', reason: null };
}

export function validateImportSpec(document: CsvDocument, input: unknown): ImportSpec {
  const spec = ImportSpecSchema.parse(input);
  if (spec.delimiter !== document.delimiter) throw new Error('Delimiter changed; parse the original bytes again.');
  const header = document.records[spec.headerRecord - 1];
  if (!header) throw new Error('Header record does not exist.');
  const names = header.cells.map((x) => x.trim());
  if (names.some((x) => !x) || new Set(names).size !== names.length) throw new Error('Header names must be nonblank and unique after trimming. Original text is retained.');
  const last = spec.lastDataRecord ?? document.records.length;
  if (spec.firstDataRecord <= spec.headerRecord || last < spec.firstDataRecord || last > document.records.length)
    throw new Error('Choose a data range after the header and within the file.');
  if (last - spec.firstDataRecord + 1 > MAX_DATA_ROWS) throw new Error('At most 5000 data records can be inspected.');
  const columns = [spec.timeColumn, ...spec.channels.map((x) => x.column),
    ...(spec.run.kind === 'column' ? [spec.run.column] : []), ...(spec.phase.kind === 'column' ? [spec.phase.column] : [])];
  if (new Set(columns).size !== columns.length) throw new Error('Time, identities and channel columns must be distinct.');
  if (columns.some((x) => x >= names.length)) throw new Error('A mapped column is absent from the header.');
  for (const r of document.records.slice(spec.firstDataRecord - 1, last))
    if (r.cells.length !== names.length) throw new Error(`Record ${r.record}, physical lines ${r.lineStart}–${r.lineEnd}: expected ${names.length} columns, found ${r.cells.length}. Nothing was loaded.`);
  return spec;
}

export function defaultRecipe(spec: ImportSpec): ViewRecipe {
  return { run: null, phase: null, timeMin: null, timeMax: null, channels: spec.channels.map((c) => c.column), selectedRecord: null };
}

/** No sorting, interpolation, aggregation across runs, conversion or physical prediction. */
export function inspectCsv(document: CsvDocument, inputSpec: unknown, inputRecipe: unknown): InspectionResult {
  const spec = validateImportSpec(document, inputSpec), recipe = ViewRecipeSchema.parse(inputRecipe);
  if (recipe.timeMin !== null && recipe.timeMax !== null && recipe.timeMin > recipe.timeMax) throw new Error('Time window minimum exceeds its maximum.');
  if (new Set(recipe.channels).size !== recipe.channels.length || recipe.channels.some((col) => !spec.channels.some((c) => c.column === col))) throw new Error('View contains duplicate or unmapped channels.');
  const last = spec.lastDataRecord ?? document.records.length;
  const data = document.records.slice(spec.firstDataRecord - 1, last);
  const rows: InspectedRow[] = [];
  const groups = new Map<string, { run: string; phase: string; records: number[] }>();
  const previous = new Map<string, number>(), seen = new Map<string, Set<number>>();
  for (const r of data) {
    const id = (mapping: ImportSpec['run']) => mapping.kind === 'constant' ? mapping.value : r.cells[mapping.column];
    const run = id(spec.run), phase = id(spec.phase), time = numericCell(r.cells[spec.timeColumn], spec.timeMissingTokens);
    const exclusions: string[] = [], timeFlags: string[] = [];
    if (!run.trim() || !phase.trim()) exclusions.push('Missing run or phase identity');
    if (run.length > 200 || phase.length > 200) exclusions.push('Run or phase identity exceeds 200 characters');
    if (time.status !== 'finite') exclusions.push(`Time: ${time.reason}`);
    const identityValid = run.trim() && phase.trim() && run.length <= 200 && phase.length <= 200;
    if (identityValid) {
      const groupKey = JSON.stringify([run, phase]);
      if (!groups.has(groupKey)) groups.set(groupKey, { run, phase, records: [] });
      groups.get(groupKey)!.records.push(r.record);
      if (groups.size > 128) throw new Error('At most 128 distinct run/phase pairs can be inspected.');
      if (time.value !== null) {
        const before = previous.get(groupKey), times = seen.get(groupKey) ?? new Set<number>();
        if (before !== undefined && time.value < before) timeFlags.push('Time decreases in source order');
        if (times.has(time.value)) timeFlags.push('Repeated binary64 time coordinate; inspect raw strings for rounding collisions');
        times.add(time.value); seen.set(groupKey, times); previous.set(groupKey, time.value);
      }
    }
    if (recipe.run !== null && run !== recipe.run) exclusions.push('Outside selected run');
    if (recipe.phase !== null && phase !== recipe.phase) exclusions.push('Outside selected phase');
    if (time.value !== null && ((recipe.timeMin !== null && time.value < recipe.timeMin) || (recipe.timeMax !== null && time.value > recipe.timeMax))) exclusions.push('Outside inclusive time window in supplied units');
    rows.push({ record: r.record, lineStart: r.lineStart, lineEnd: r.lineEnd, byteStart: r.byteStart, byteEnd: r.byteEnd, run, phase, time,
      values: spec.channels.map((c) => ({ column: c.column, cell: numericCell(r.cells[c.column], c.missingTokens) })),
      included: exclusions.length === 0, exclusions, timeFlags });
  }
  if (recipe.run !== null && !rows.some((r) => r.run === recipe.run)) throw new Error('Selected run is absent.');
  if (recipe.phase !== null && !rows.some((r) => r.phase === recipe.phase)) throw new Error('Selected phase is absent.');
  if (recipe.selectedRecord !== null && !rows.some((r) => r.record === recipe.selectedRecord)) throw new Error('Selected record is outside the declared data range.');
  const warnings = [
    'Origin, identities, units, operator and context are user assertions, not verified metadata. Hashes identify the supplied bytes, not an instrument original.',
    'Numeric coordinates use IEEE-754 binary64. Distinct decimal texts can round to the same value. Raw strings are retained. Window boundaries use these same coordinates in supplied units.',
    'All units remain as supplied. No conversion, clock synchronization, smoothing, imputation or physical prediction is performed.',
    'Record counts are not counts of independent experiments. Separate runs/phases are plotted separately; matching IDs do not prove independence or comparability.',
    'Unknown measurement uncertainty stays unknown. Extrema describe selected finite cells and are not uncertainty limits or safety thresholds.',
  ];
  if (!spec.channels.some((c) => c.missingTokens.length) && !spec.timeMissingTokens.length) warnings.push('No sentinel tokens declared. Finite values such as -9999 or zero remain numeric.');
  if ([spec.context, spec.timeOrigin, ...spec.channels.map((c) => c.operator)].some((v) => v === null) || spec.timeUnit === 'unknown' || spec.channels.some((c) => c.unit === 'unknown')) warnings.push('One or more context, time-origin, operator or unit declarations are unknown.');
  const included = rows.filter((r) => r.included);
  const channels = spec.channels.filter((c) => recipe.channels.includes(c.column)).map((c) => {
    const finite = included.map((r) => ({ record: r.record, cell: r.values.find((v) => v.column === c.column)!.cell })).filter((v) => v.cell.value !== null);
    const values = finite.map((v) => v.cell.value!);
    const minimum = values.length ? Math.min(...values) : null, maximum = values.length ? Math.max(...values) : null;
    return { column: c.column, quantity: c.quantity, unit: c.unit, operator: c.operator, finite: values.length, unavailable: included.length - values.length,
      minimum, maximum, minRecords: finite.filter((v) => v.cell.value === minimum).map((v) => v.record), maxRecords: finite.filter((v) => v.cell.value === maximum).map((v) => v.record) };
  });
  return { methodRevision: WORKBENCH_METHOD, sourceSha256: document.sha256, specDigest: digestOf(spec), recipeDigest: digestOf(recipe),
    origin: spec.origin, metadataVerified: false, measurementValidated: false, unitConversion: 'none', precision: 'IEEE-754 binary64; raw decimal text retained',
    skippedRecords: document.records.filter((r) => r.record < spec.firstDataRecord || r.record > last).map((r) => r.record),
    rows, groups: [...groups.values()], channels, includedRecords: included.map((r) => r.record), excludedRecords: rows.filter((r) => !r.included).map((r) => r.record), warnings };
}

const hash = z.string().regex(/^[0-9a-f]{64}$/);
const PackageSchema = z.strictObject({
  schemaVersion: z.literal(WORKBENCH_SCHEMA), methodRevision: z.string().max(100), integrityMeaning: z.literal('checksum_not_signature'),
  file: z.strictObject({ name: text, byteCount: z.number().int().min(1).max(MAX_CSV_BYTES), sha256: hash, rawUtf8: z.string().max(MAX_CSV_BYTES) }),
  spec: ImportSpecSchema, recipe: ViewRecipeSchema, result: z.record(z.string(), z.unknown()), resultDigest: hash, checksum: hash,
});
export type WorkbenchPackage = z.infer<typeof PackageSchema>;
export function makeWorkbenchPackage(document: CsvDocument, name: string, inputSpec: unknown, inputRecipe: unknown): WorkbenchPackage {
  // Re-parse exact bytes: exported conclusions never depend on mutable cached rows/hash fields.
  const original = parseCsv(new TextEncoder().encode(document.rawText), document.delimiter);
  if (original.sha256 !== document.sha256 || original.byteCount !== document.byteCount) throw new Error('Supplied raw text no longer matches its byte receipt.');
  const spec = validateImportSpec(original, inputSpec), recipe = ViewRecipeSchema.parse(inputRecipe), result = inspectCsv(original, spec, recipe);
  const body = { schemaVersion: WORKBENCH_SCHEMA, methodRevision: WORKBENCH_METHOD, integrityMeaning: 'checksum_not_signature',
    file: { name, byteCount: original.byteCount, sha256: original.sha256, rawUtf8: original.rawText }, spec, recipe, result, resultDigest: digestOf(result) };
  const packet = PackageSchema.parse({ ...body, checksum: digestOf(body) });
  serializeWorkbenchPackage(packet);
  return packet;
}
export function serializeWorkbenchPackage(packet: WorkbenchPackage): string {
  const text = JSON.stringify(packet, null, 2) + '\n';
  if (new TextEncoder().encode(text).length > MAX_WORKBENCH_PACKAGE_BYTES) throw new Error('Replay package exceeds 8 MiB. Narrow the file explicitly; nothing was truncated.');
  return text;
}
export function replayWorkbenchPackage(raw: string): { packet: WorkbenchPackage; document: CsvDocument; result: InspectionResult } {
  if (new TextEncoder().encode(raw).length > MAX_WORKBENCH_PACKAGE_BYTES) throw new Error('Replay package exceeds 8 MiB.');
  const input: unknown = JSON.parse(raw);
  // Reject extreme nesting before canonicalization/Zod can recurse into opaque result fields.
  const stack: { value: unknown; depth: number }[] = [{ value: input, depth: 0 }]; let nodes = 0;
  while (stack.length) {
    const { value, depth } = stack.pop()!;
    if (++nodes > 500_000 || depth > 20) throw new Error('Replay package structure exceeds inspection limits.');
    if (value && typeof value === 'object') for (const v of Object.values(value)) stack.push({ value: v, depth: depth + 1 });
  }
  const packet = PackageSchema.parse(input), { checksum, ...body } = packet;
  if (digestOf(body) !== checksum) throw new Error('Replay package checksum mismatch.');
  if (packet.methodRevision !== WORKBENCH_METHOD) throw new Error(`Historical method ${packet.methodRevision} is not installed. Original package is unchanged; no current result was substituted.`);
  const bytes = new TextEncoder().encode(packet.file.rawUtf8);
  const document = parseCsv(bytes, packet.spec.delimiter);
  if (document.rawText !== packet.file.rawUtf8 || document.sha256 !== packet.file.sha256 || document.byteCount !== packet.file.byteCount) throw new Error('Raw-byte receipt mismatch.');
  const result = inspectCsv(document, packet.spec, packet.recipe);
  if (digestOf(packet.result) !== packet.resultDigest || digestOf(result) !== packet.resultDigest) throw new Error('Recomputed result differs from the stored result. Nothing was accepted.');
  return { packet, document, result };
}
