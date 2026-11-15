'use client';

import { useMemo, useRef, useState } from 'react';
import { digestOf } from '../core/canonicalize';
import { MAX_CSV_BYTES, MAX_WORKBENCH_PACKAGE_BYTES, WORKBENCH_METHOD, defaultRecipe, inspectCsv, makeWorkbenchPackage,
  parseCsv, replayWorkbenchPackage, serializeWorkbenchPackage, validateImportSpec,
  type CsvDocument, type ImportSpec, type InspectionResult, type ViewRecipe } from '../core/workbench';
import { download, short } from './lib';

const ORIGINS = { user_observation: 'Observation · user supplied, unverified', user_solver_output: 'Solver output · user supplied, unverified', hypothetical: 'Hypothetical example · not an experiment' };
const emptySpec = (): ImportSpec => ({ delimiter: ',', headerRecord: 1, firstDataRecord: 2, lastDataRecord: null,
  origin: 'user_observation', sourceDescription: null, context: null, timeOrigin: null, timeColumn: -1, timeUnit: 'unknown',
  run: { kind: 'constant', value: '' }, phase: { kind: 'constant', value: 'unspecified' },
  channels: [{ column: -1, quantity: '', unit: 'unknown', operator: null, missingTokens: [] }], timeMissingTokens: [] });
const EXAMPLE = 'time_ms,run,phase,position_mm,signal_V\r\n0,demo-A,spread,0,0.2\r\n500,demo-A,spread,1,0.4\r\n1000,demo-A,spread,,0.6\r\n1500,demo-A,spread,3,-9999\r\n2000,demo-A,spread,4,0.8\r\n0,demo-B,spread,0,0.3\r\n1000,demo-B,spread,1.5,bad\r\n500,demo-B,spread,0.7,0.5\r\n1000,demo-B,spread,1.6,0.6\r\n';
const EXAMPLE_SPEC: ImportSpec = { ...emptySpec(), origin: 'hypothetical', sourceDescription: 'Invented software demonstration. No physical experiment or solver.',
  context: 'Two invented runs illustrating missing values and time-order checks.', timeOrigin: 'Zero assigned separately for each invented run', timeColumn: 0, timeUnit: 'ms',
  run: { kind: 'column', column: 1 }, phase: { kind: 'column', column: 2 },
  channels: [{ column: 3, quantity: 'Tracked coordinate', unit: 'mm', operator: 'Invented coordinate; no instrument', missingTokens: [] },
    { column: 4, quantity: 'Sensor signal', unit: 'V', operator: 'Invented signal; no instrument', missingTokens: ['-9999'] }] };

/** Isolated from fetch/provider helpers. Source bytes and metadata stay in component memory. */
export default function LocalData() {
  const [document, setDocument] = useState<CsvDocument | null>(null), [name, setName] = useState('');
  const [draft, setDraft] = useState<ImportSpec>(emptySpec), [spec, setSpec] = useState<ImportSpec | null>(null);
  const [recipe, setRecipe] = useState<ViewRecipe | null>(null), [message, setMessage] = useState(''), [error, setError] = useState('');
  const [exportConsent, setExportConsent] = useState(false), [windowMin, setWindowMin] = useState(''), [windowMax, setWindowMax] = useState('');
  const [page, setPage] = useState(0);
  const readGeneration = useRef(0);
  const resultState = useMemo(() => {
    if (!document || !spec || !recipe) return { result: null, error: '' };
    try { return { result: inspectCsv(document, spec, recipe), error: '' }; }
    catch (e) { return { result: null, error: (e as Error).message }; }
  }, [document, spec, recipe]);
  const result = resultState.result;
  const headers = document?.records[draft.headerRecord - 1]?.cells ?? [];
  const update = (patch: Partial<ImportSpec>) => { setDraft((d) => ({ ...d, ...patch })); setSpec(null); setRecipe(null); setExportConsent(false); setMessage('Mapping changed. Confirm it again to inspect.'); setError(''); };
  const confirm = (doc = document, next = draft) => {
    if (!doc) return;
    try {
      const checked = validateImportSpec(doc, next), view = defaultRecipe(checked);
      // Default to one run/phase panel: shared time values never imply synchronized runs.
      const probe = inspectCsv(doc, checked, view), group = probe.groups[0];
      setSpec(checked); setRecipe({ ...view, run: group?.run ?? null, phase: group?.phase ?? null });
      setWindowMin(''); setWindowMax(''); setPage(0); setError(''); setMessage('Mapping confirmed as your assertion. Source bytes and analysis stay in this tab.');
    } catch (e) { setSpec(null); setRecipe(null); setError((e as Error).message); }
  };
  const load = async (file: File, replay: boolean) => {
    const generation = ++readGeneration.current;
    setError(''); setMessage('Reading locally…'); setExportConsent(false);
    // Clear previous conclusions before any asynchronous read completes.
    setDocument(null); setSpec(null); setRecipe(null); setName('');
    try {
      if (file.size > (replay ? MAX_WORKBENCH_PACKAGE_BYTES : MAX_CSV_BYTES)) throw new Error(replay ? 'Package exceeds 8 MiB.' : 'CSV exceeds 1 MiB.');
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (generation !== readGeneration.current) return;
      if (replay) {
        const raw = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
        const checked = replayWorkbenchPackage(raw);
        setDocument(checked.document); setName(checked.packet.file.name); setDraft(checked.packet.spec); setSpec(checked.packet.spec); setRecipe(checked.packet.recipe);
        setWindowMin(checked.packet.recipe.timeMin === null ? '' : String(checked.packet.recipe.timeMin));
        setWindowMax(checked.packet.recipe.timeMax === null ? '' : String(checked.packet.recipe.timeMax));
        setMessage(`Recomputed identically. Result checksum ${checked.packet.resultDigest}. This checks software replay, not measurement accuracy.`);
      } else {
        const doc = parseCsv(bytes, draft.delimiter);
        setDocument(doc); setName(file.name); setDraft({ ...emptySpec(), delimiter: draft.delimiter });
        setMessage('Review the source records and explicitly declare the mapping below. Nothing has been sent to a server.');
      }
      setPage(0);
    } catch (e) { if (generation === readGeneration.current) { setError((e as Error).message); setMessage('Nothing loaded.'); } }
  };
  const selectColumn = (label: string, value: number, onChange: (value: number) => void) => <label className="field"><span>{label}</span>
    <select value={value} onChange={(e) => onChange(Number(e.target.value))}><option value={-1}>Choose a column</option>
      {headers.map((header, i) => <option key={i} value={i}>{i + 1}: {header.slice(0, 80)}</option>)}</select></label>;
  const identity = (key: 'run' | 'phase') => <div className="card flat"><h3>{key === 'run' ? 'Run identity' : 'Phase identity'}</h3>
    <label className="field"><span>{key} mapping</span><select value={draft[key].kind} onChange={(e) => update({ [key]: e.target.value === 'column' ? { kind: 'column', column: -1 } : { kind: 'constant', value: '' } })}>
      <option value="constant">One declared identity for these records</option><option value="column">Read exact identities from a column</option></select></label>
    {draft[key].kind === 'column' ? selectColumn(`${key} column`, draft[key].column, (column) => update({ [key]: { kind: 'column', column } }))
      : <label className="field"><span>{key} name</span><input value={draft[key].value} maxLength={200} onChange={(e) => update({ [key]: { kind: 'constant', value: e.target.value } })} /></label>}
  </div>;
  const applyWindow = () => {
    if (!recipe) return;
    const decimal = (s: string) => s.trim() === '' ? null : /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(s.trim()) ? Number(s) : NaN;
    const lo = decimal(windowMin), hi = decimal(windowMax);
    if ((lo !== null && !Number.isFinite(lo)) || (hi !== null && !Number.isFinite(hi)) || (lo !== null && hi !== null && lo > hi)) { setError('Enter finite decimal window bounds, minimum at or below maximum.'); return; }
    setRecipe({ ...recipe, timeMin: lo, timeMax: hi, selectedRecord: null }); setPage(0); setError('');
  };
  const selected = result?.rows.find((r) => r.record === recipe?.selectedRecord);
  const rawSelected = document?.records.find((r) => r.record === selected?.record);

  return <div className="page">
    <header className="page-head"><span className="crumb">08 · Your data</span><h1>Inspect your data and replay the analysis</h1>
      <p>Map a CSV to runs, phases and measured quantities. Follow each point back to its raw cell, inspect missing readings and save a reproducible package. Your file stays in this browser tab.</p></header>
    <section className="section" aria-label="Local data input">
      <div className="fields">
        <label className="field"><span>CSV file · UTF-8, up to 1 MiB</span><input type="file" accept=".csv,.tsv,.txt,text/csv" onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ''; if (file) void load(file, false); }} /></label>
        <label className="field"><span>Replay package · JSON, up to 8 MiB</span><input type="file" accept=".json,application/json" onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ''; if (file) void load(file, true); }} /></label>
      </div>
      <div className="btn-row"><button type="button" className="btn ghost" onClick={() => {
        ++readGeneration.current; const doc = parseCsv(new TextEncoder().encode(EXAMPLE), ','); setDocument(doc); setName('hypothetical-example.csv'); setDraft(EXAMPLE_SPEC); setExportConsent(false); confirm(doc, EXAMPLE_SPEC);
      }}>Load hypothetical example</button>
        <button type="button" className="btn ghost" onClick={() => { ++readGeneration.current; setDocument(null); setSpec(null); setRecipe(null); setDraft(emptySpec()); setName(''); setMessage('Local data cleared from this workspace.'); setError(''); }}>Clear local data</button></div>
      {message && <p role="status" className="muted local-message">{message}</p>}
      {(error || resultState.error) && <p role="alert" className="error">{error || resultState.error}</p>}
      <p className="muted">Your data stay in this browser. Reloading clears them. A replay package includes the raw CSV, filename and your declarations; inspect them before sharing.</p>
    </section>
    {document && <section className="section" aria-labelledby="mapping-title">
      <div className="section-head"><h2 id="mapping-title">Declare what the columns mean</h2><p>{name} · {document.byteCount} bytes · SHA-256 {short(document.sha256)}</p></div>
      <details open={!spec}><summary>Source mapping and metadata {spec ? '(confirmed)' : '(confirmation required)'}</summary><div className="details-body">
        <div className="fields">
          <label className="field"><span>Delimiter</span><select value={draft.delimiter} onChange={(e) => {
            const delimiter = e.target.value as ImportSpec['delimiter']; update({ delimiter });
            try { setDocument(parseCsv(new TextEncoder().encode(document.rawText), delimiter)); } catch (err) { setError((err as Error).message); }
          }}><option value=",">Comma</option><option value=";">Semicolon</option><option value={'\t'}>Tab</option></select></label>
          <label className="field"><span>Header record (1-based)</span><input type="number" min={1} max={100} value={draft.headerRecord} onChange={(e) => update({ headerRecord: Number(e.target.value) })} /></label>
          <label className="field"><span>First data record (1-based)</span><input type="number" min={2} max={200} value={draft.firstDataRecord} onChange={(e) => update({ firstDataRecord: Number(e.target.value) })} /></label>
          <label className="field"><span>Last data record (blank = end)</span><input type="number" min={2} value={draft.lastDataRecord ?? ''} onChange={(e) => update({ lastDataRecord: e.target.value === '' ? null : Number(e.target.value) })} /></label>
          <label className="field"><span>Declared origin</span><select value={draft.origin} onChange={(e) => update({ origin: e.target.value as ImportSpec['origin'] })}>{Object.entries(ORIGINS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
          {selectColumn('Time column', draft.timeColumn, (timeColumn) => update({ timeColumn }))}
          <label className="field"><span>Time unit as supplied</span><input value={draft.timeUnit} maxLength={200} onChange={(e) => update({ timeUnit: e.target.value })} /></label>
          <label className="field"><span>Time origin (blank = unknown)</span><input value={draft.timeOrigin ?? ''} maxLength={1000} onChange={(e) => update({ timeOrigin: e.target.value || null })} /></label>
        </div>
        <div className="table-wrap"><table><caption>First source records, before interpretation. Record numbers include the header; quoted records may span several lines.</caption><tbody>
          {document.records.slice(0, 6).map((r) => <tr key={r.record}><th scope="row">Record {r.record} · lines {r.lineStart}–{r.lineEnd}</th>{r.cells.slice(0, 8).map((cell, i) => <td key={i}><code>{cell.slice(0, 120) || '(blank)'}</code></td>)}</tr>)}
        </tbody></table></div>
        <div className="grid-2">{identity('run')}{identity('phase')}</div>
        <p className="muted">Identities are exact strings: “1”, “1.0” and “ 1” stay different. A constant identity asserts that these records belong together; it does not verify their provenance.</p>
        {draft.channels.map((channel, ci) => {
          const change = (patch: Partial<ImportSpec['channels'][number]>) => update({ channels: draft.channels.map((c, i) => i === ci ? { ...c, ...patch } : c) });
          return <div className="card flat" key={ci}><h3>Channel {ci + 1}</h3><div className="fields">
            {selectColumn(`Channel ${ci + 1} column`, channel.column, (column) => change({ column }))}
            <label className="field"><span>Quantity {ci + 1}</span><input value={channel.quantity} maxLength={200} onChange={(e) => change({ quantity: e.target.value })} /></label>
            <label className="field"><span>Unit {ci + 1} as supplied</span><input value={channel.unit} maxLength={200} onChange={(e) => change({ unit: e.target.value })} /></label>
            <label className="field"><span>Measurement operator {ci + 1} (blank = unknown)</span><input value={channel.operator ?? ''} maxLength={1000} placeholder="How was this quantity measured or calculated?" onChange={(e) => change({ operator: e.target.value || null })} /></label>
            <label className="field"><span>Missing tokens {ci + 1} (one exact token per line)</span><textarea value={channel.missingTokens.join('\n')} maxLength={1600} onChange={(e) => change({ missingTokens: e.target.value ? e.target.value.split('\n') : [] })} /></label>
          </div>{draft.channels.length > 1 && <button type="button" className="btn ghost small" onClick={() => update({ channels: draft.channels.filter((_, i) => i !== ci) })}>Remove channel {ci + 1}</button>}</div>;
        })}
        <button type="button" className="btn ghost" disabled={draft.channels.length >= 4} onClick={() => update({ channels: [...draft.channels, { column: -1, quantity: '', unit: 'unknown', operator: null, missingTokens: [] }] })}>Add channel</button>
        <div className="fields">
          <label className="field"><span>Time missing tokens (one exact token per line)</span><textarea value={draft.timeMissingTokens.join('\n')} maxLength={1600} onChange={(e) => update({ timeMissingTokens: e.target.value ? e.target.value.split('\n') : [] })} /></label>
          <label className="field"><span>Source description (blank = unknown)</span><textarea value={draft.sourceDescription ?? ''} maxLength={1000} onChange={(e) => update({ sourceDescription: e.target.value || null })} /></label>
          <label className="field"><span>Experimental or solver context (blank = unknown)</span><textarea value={draft.context ?? ''} maxLength={1000} onChange={(e) => update({ context: e.target.value || null })} /></label>
        </div>
        <button type="button" className="btn" onClick={() => confirm()}>Confirm mapping and inspect</button>
        <p className="muted">Units are labels only; no conversion is performed. Keep pressure reference, oxygen basis and absolute versus differential temperatures explicit in the quantity and context. Unknown stays unknown.</p>
      </div></details>
    </section>}
    {result && recipe && spec && document && <>
      <section className="section" aria-labelledby="inspection-title">
        <div className="section-head"><h2 id="inspection-title">Inspect one run and phase</h2><span className="tag outline">{ORIGINS[spec.origin]}</span></div>
        <div className="fields">
          <label className="field"><span>Run and phase</span><select value={JSON.stringify([recipe.run, recipe.phase])} onChange={(e) => { const [run, phase] = JSON.parse(e.target.value); setRecipe({ ...recipe, run, phase, selectedRecord: null }); setPage(0); }}>
            {!result.groups.length && <option value="[null,null]">No usable run identities</option>}
            {result.groups.map((g) => <option key={JSON.stringify([g.run, g.phase])} value={JSON.stringify([g.run, g.phase])}>{JSON.stringify(g.run)} / {JSON.stringify(g.phase)}</option>)}
          </select></label>
          <label className="field"><span>Time from ({spec.timeUnit})</span><input value={windowMin} onChange={(e) => setWindowMin(e.target.value)} /></label>
          <label className="field"><span>Time to ({spec.timeUnit})</span><input value={windowMax} onChange={(e) => setWindowMax(e.target.value)} /></label>
        </div>
        <div className="btn-row"><button type="button" className="btn ghost" onClick={applyWindow}>Apply inclusive time window</button><button type="button" className="btn ghost" onClick={() => { setWindowMin(''); setWindowMax(''); setRecipe({ ...recipe, timeMin: null, timeMax: null, selectedRecord: null }); setPage(0); }}>Use whole time range</button></div>
        <p className="muted">Time origin: {spec.timeOrigin ?? 'unknown'}. Common row positions link the channels; this does not verify acquisition timing. {result.includedRecords.length} included records, {result.excludedRecords.length} outside the selection or unusable. {result.skippedRecords.length} header/preamble/footer records retained in the file.</p>
        <div className="grid-2">{result.channels.map((channel) => <div className="card" key={channel.column}>
          <h3>{channel.quantity} · {channel.unit}</h3><p className="muted">{ORIGINS[spec.origin]} · operator: {channel.operator ?? 'unknown'}</p>
          <div className="local-plot-scroll" role="region" tabIndex={0} aria-label={`${channel.quantity} plot; scroll horizontally on a small screen`}><RawPlot result={result} column={channel.column} timeUnit={spec.timeUnit} selected={recipe.selectedRecord} pick={(record) => setRecipe({ ...recipe, selectedRecord: record })} /></div>
          <p>{channel.finite} finite of {result.includedRecords.length} included records · {channel.unavailable} unavailable.</p>
          <dl className="kv"><dt>Selected minimum</dt><dd>{channel.minimum ?? 'unavailable'} {channel.unit}</dd><dt>Selected maximum</dt><dd>{channel.maximum ?? 'unavailable'} {channel.unit}</dd></dl>
          <p className="muted">Extrema of supplied numeric cells; no uncertainty interval or inference.</p>
        </div>)}</div>
        {selected && rawSelected && <article className="card" aria-label="Raw record inspector"><h3>Record {selected.record} · physical lines {selected.lineStart}–{selected.lineEnd}</h3>
          <p>UTF-8 bytes [{selected.byteStart}, {selected.byteEnd}), excluding the record separator. Run {JSON.stringify(selected.run)}, phase {JSON.stringify(selected.phase)}.</p>
          <div className="table-wrap"><table><thead><tr><th>Column</th><th>Header</th><th>Raw cell</th></tr></thead><tbody>{rawSelected.cells.map((cell, i) => <tr key={i}><th>{i + 1}</th><td>{document.records[spec.headerRecord - 1].cells[i]}</td><td className="raw-cell"><code>{JSON.stringify(cell)}</code></td></tr>)}</tbody></table></div>
          <p>{[...selected.exclusions, ...selected.timeFlags].join(' · ') || 'Included; no time-order flag.'}</p>
        </article>}
      </section>
      <section className="section" aria-labelledby="ledger-title"><h2 id="ledger-title">Complete row ledger</h2><p>Every declared data record remains here, including invalid times, missing values and excluded runs. No rows are sorted or silently removed.</p>
        <div className="table-wrap"><table><thead><tr><th>Record</th><th>Run / phase</th><th>Raw time</th><th>Selection</th><th>Channel states</th><th>Time flags</th></tr></thead><tbody>
          {result.rows.slice(page * 25, (page + 1) * 25).map((r) => <tr key={r.record}><th><button className="link-btn" onClick={() => setRecipe({ ...recipe, selectedRecord: r.record })}>Record {r.record}</button></th><td>{JSON.stringify(r.run)} / {JSON.stringify(r.phase)}</td><td><code>{JSON.stringify(r.time.raw)}</code></td><td>{r.included ? 'Included' : r.exclusions.join('; ')}</td><td>{r.values.map((v) => `${v.column + 1}: ${v.cell.status}`).join('; ')}</td><td>{r.timeFlags.join('; ') || '—'}</td></tr>)}
        </tbody></table></div>
        <div className="btn-row"><button className="btn ghost" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous records</button><span>Page {page + 1} of {Math.max(1, Math.ceil(result.rows.length / 25))}</span><button className="btn ghost" disabled={(page + 1) * 25 >= result.rows.length} onClick={() => setPage(page + 1)}>Next records</button></div>
      </section>
      <section className="section" aria-labelledby="replay-title"><h2 id="replay-title">Save a replayable analysis</h2>
        <p>Contains the complete supplied file <b>{name}</b> ({document.byteCount} bytes), source description, context, mapping, selected run/phase/time window/record, method revision, row ledger and numeric result. It contains no historical engine code. Hashes detect changes; they do not authenticate the author or validate the measurements.</p>
        <details><summary>Review package metadata</summary><pre className="local-json">{JSON.stringify({ file: name, sourceSha256: document.sha256, spec, recipe, methodRevision: WORKBENCH_METHOD, resultDigest: digestOf(result) }, null, 2)}</pre></details>
        <label className="check"><input type="checkbox" checked={exportConsent} onChange={(e) => setExportConsent(e.target.checked)} />I want the downloaded package to include this raw file and its metadata.</label>
        <button type="button" className="btn" disabled={!exportConsent} onClick={() => {
          try { const packet = makeWorkbenchPackage(document, name, spec, recipe); download('ignis-local-data-package.json', serializeWorkbenchPackage(packet)); setMessage('Replay package downloaded locally. Keep it private unless you intend to share its data.'); }
          catch (e) { setError((e as Error).message); }
        }}>Download local replay package</button>
        <details><summary>Method and limits</summary><div className="details-body"><p className="mono">{WORKBENCH_METHOD}</p><ul className="bullets">{result.warnings.map((w) => <li key={w}>{w}</li>)}</ul></div></details>
      </section>
    </>}
  </div>;
}

function RawPlot({ result, column, timeUnit, selected, pick }: { result: InspectionResult; column: number; timeUnit: string; selected: number | null; pick: (record: number) => void }) {
  const rows = result.rows.filter((r) => r.included), channel = result.channels.find((c) => c.column === column)!;
  const points = rows.map((r) => ({ row: r, value: r.values.find((v) => v.column === column)!.cell.value }));
  const times = rows.map((r) => r.time.value!), values = points.filter((p) => p.value !== null).map((p) => p.value!);
  if (!times.length) return <p className="flag">No usable time coordinates in this selection. Inspect the ledger.</p>;
  const xmin = Math.min(...times), xmax = Math.max(...times), ymin = values.length ? Math.min(...values) : 0, ymax = values.length ? Math.max(...values) : 1;
  // Normalize safely even when a range spans close to the full finite binary64 range.
  const scale = (v: number, min: number, max: number) => {
    if (min === max) return 0.5;
    const span = max - min;
    return Number.isFinite(span) ? (v - min) / span : (v / 2 - min / 2) / (max / 2 - min / 2);
  };
  const x = (t: number) => 58 + 432 * scale(t, xmin, xmax), y = (v: number) => 178 - 144 * scale(v, ymin, ymax);
  const fmt = (v: number) => Number(v.toPrecision(5)).toString();
  return <svg className="local-plot" viewBox="0 0 540 260" role="group" aria-label={`${channel.quantity}: raw scatter points, ${channel.unit}; ${ORIGINS[result.origin]}`}>
    <text x={58} y={16} className="plot-label">{channel.unit} · supplied values</text>
    <path d="M58 30V180H490" fill="none" stroke="currentColor" opacity={0.35} />
    <text x={54} y={38} textAnchor="end">{fmt(ymax)}</text><text x={54} y={180} textAnchor="end">{fmt(ymin)}</text>
    <text x={58} y={200}>{fmt(xmin)}</text><text x={490} y={200} textAnchor="end">{fmt(xmax)}</text><text x={275} y={221} textAnchor="middle">Time ({timeUnit}), supplied clock</text>
    <text x={58} y={250}>× unavailable · select a point to inspect its row</text>
    {points.map(({ row, value }) => <g key={row.record} role="button" tabIndex={0} aria-label={`Record ${row.record}, time ${row.time.raw}, ${value === null ? 'unavailable' : `${channel.quantity} ${value} ${channel.unit}`}`}
      onClick={() => pick(row.record)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(row.record); } }}>
      <title>{`Record ${row.record} · physical line ${row.lineStart} · ${row.values.find((v) => v.column === column)!.cell.raw}`}</title>
      {value === null ? <text x={x(row.time.value!)} y={236} textAnchor="middle" style={{ fill: 'var(--d-b)' }}>×</text>
        : <circle cx={x(row.time.value!)} cy={y(value)} r={selected === row.record ? 6 : 4} fill={selected === row.record ? 'var(--d-b)' : 'var(--d-a)'} stroke="currentColor" strokeWidth={selected === row.record ? 2 : 0.5} />}
    </g>)}
  </svg>;
}
