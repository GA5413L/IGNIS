'use client';
import { useEffect, useRef, useState } from 'react';
import { MAX_SESSION_BYTES, serializeSession, type ResearchSession, type RecheckedSession } from '../core/researchSession';
import { download } from './lib';
const downloadResearch = (name: string, value: unknown) => download(name, JSON.stringify(value, null, 2) + '\n');
function downloadBlob(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob), anchor = document.createElement('a');
  anchor.href = url; anchor.download = name; document.body.appendChild(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
import { PACKAGE_SCHEMA, type PackageReview } from '../core/evidencePackage';
import { MAX_HTTP_PAYLOAD_BYTES } from '../server/http';
import type { Assessment } from '../core/assess';

const STORAGE_KEY = 'ignis-research-session-v1';
const HOSTED_LIMIT_MESSAGE = 'This operation exceeds the 4 MiB hosted HTTP limit. Nothing was sent or truncated. The local package library and browser-only data workbench retain their 8 MiB package limits.';
export default function SessionControls({ makePacket, getOriginals, onLoad }: { makePacket: () => ResearchSession; getOriginals: () => Assessment[]; onLoad: (r: RecheckedSession) => void }) {
  const file = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState<RecheckedSession | null>(null);
  const [archive, setArchive] = useState<{ review: PackageReview; original: Blob } | null>(null);
  const [busy, setBusy] = useState(false);
  const operation = useRef(0);
  const pendingOperation = useRef<number | null>(null);
  const activeRequest = useRef<AbortController | null>(null);
  useEffect(() => () => { operation.current += 1; activeRequest.current?.abort(); }, []);
  async function post(url: string, text: string) {
    if (new TextEncoder().encode(text).length > MAX_HTTP_PAYLOAD_BYTES) throw new Error(HOSTED_LIMIT_MESSAGE);
    const controller = new AbortController(); activeRequest.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 30_000);
    try {
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: text, signal: controller.signal });
      const body = await response.json();
      return { response, body };
    } catch (error) {
      if (controller.signal.aborted) throw new Error('Request cancelled or timed out after 30 seconds. Your workspace is kept.');
      throw error;
    } finally { window.clearTimeout(timeout); if (activeRequest.current === controller) activeRequest.current = null; }
  }
  function beginImport() {
    const id = ++operation.current;
    pendingOperation.current = null; setPending(null); setArchive(null); setBusy(true);
    return id;
  }
  function stopImport(id: number, text: string) {
    if (id !== operation.current) return;
    setMessage(text); setBusy(false);
  }
  function clearReview() {
    activeRequest.current?.abort();
    operation.current += 1; pendingOperation.current = null; setPending(null); setArchive(null); setBusy(false);
  }
  function save(browser: boolean) {
    try {
      const text = serializeSession(makePacket());
      if (browser) { localStorage.setItem(STORAGE_KEY, text); setMessage('Session saved in this browser. Use Restore browser save to recheck it.'); }
      else { downloadBlob('ignis-research-session.json', new Blob([text], { type: 'application/json' })); setMessage('Session downloaded with the draft, exact selections and assessment receipts.'); }
    } catch (e) { setMessage(`Save stopped: ${(e as Error).message}`); }
  }
  async function saveEvidence() {
    activeRequest.current?.abort();
    const id = ++operation.current; pendingOperation.current = pending ? id : null;
    setBusy(true); setMessage('Packaging original assessments and normalized source collections…');
    try {
      const input = JSON.stringify({ session: makePacket(), originals: getOriginals() });
      const { response, body } = await post('/api/package', input);
      if (id !== operation.current) return;
      if (!response.ok) throw new Error(body.message ?? 'Evidence package could not be saved.');
      // Compact JSON keeps a hosted response within the same limit on later reimport.
      const text = JSON.stringify(body);
      if (new TextEncoder().encode(text).length > MAX_HTTP_PAYLOAD_BYTES) throw new Error('The downloaded result exceeds the 4 MiB hosted limit. Nothing was truncated or downloaded.');
      downloadBlob('ignis-evidence-package.json', new Blob([text], { type: 'application/json' }));
      setMessage('Evidence package downloaded: original assessments, recipes and normalized collections in one file. Original source binaries and historical engine code are not included.');
    } catch (e) { if (id === operation.current) setMessage(`Save stopped: ${(e as Error).message}`); }
    finally { if (id === operation.current) setBusy(false); }
  }
  async function recheck(text: string, id: number, originalFile?: File) {
    if (id !== operation.current) return;
    setMessage('Recomputing the saved recipes against this installation…');
    try {
      if (new TextEncoder().encode(text).length > MAX_HTTP_PAYLOAD_BYTES) throw new Error(HOSTED_LIMIT_MESSAGE);
      const original: unknown = JSON.parse(text);
      const isPackage = original !== null && typeof original === 'object' && 'schemaVersion' in original && original.schemaVersion === PACKAGE_SCHEMA;
      if (!isPackage && new TextEncoder().encode(text).length > MAX_SESSION_BYTES) throw new Error('session exceeds 2 MiB.');
      const { response, body } = await post(isPackage ? '/api/package/recheck' : '/api/session', text);
      if (id !== operation.current) return;
      if (!response.ok) throw new Error(body.message ?? 'Session recheck failed.');
      pendingOperation.current = id;
      if (isPackage) { setArchive({ review: body, original: originalFile ?? new Blob([text], { type: 'application/json' }) }); setPending(body.current); }
      else setPending(body);
      setMessage(isPackage && !body.current ? 'Historical package inspected. Current recomputation is unavailable; your workspace is kept.' : 'Recheck complete. Review the comparison before loading.');
    } catch (e) { if (id === operation.current) setMessage(`Nothing loaded: ${(e as Error).message}`); }
    finally { if (id === operation.current) setBusy(false); }
  }
  return <section className="section session-panel" aria-labelledby="session-h">
    <div className="section-head"><div><p className="crumb">RESEARCH NOTEBOOK</p><h2 id="session-h">Save, reopen and recheck</h2></div>
      <p className="hint">An evidence package keeps original assessments, recipes and the normalized application collections together. Reopening separates what the file recorded from what this installation computes now. Lightweight sessions keep recipes only.</p></div>
    <div className="row">
      <button className="btn" disabled={busy} onClick={() => void saveEvidence()}>Download evidence package</button>
      <button className="btn" disabled={busy} onClick={() => save(false)}>Download session</button>
      <button className="btn" disabled={busy} onClick={() => save(true)}>Save in this browser</button>
      <button className="btn" disabled={busy} onClick={() => file.current?.click()}>Import session or package</button>
      <button className="btn ghost" disabled={busy} onClick={() => {
        const id = beginImport();
        try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) void recheck(saved, id); else stopImport(id, 'No session has been saved in this browser.'); }
        catch { stopImport(id, 'Browser storage is unavailable. Import a downloaded session instead.'); }
      }}>Restore browser save</button>
      <input ref={file} aria-label="Session JSON file" type="file" accept=".json,application/json" hidden onChange={async (e) => {
        const selected = e.currentTarget.files?.[0]; e.currentTarget.value = '';
        if (!selected) return;
        const id = beginImport(); setMessage('Reading the selected session…');
        if (selected.size > MAX_HTTP_PAYLOAD_BYTES) { stopImport(id, `Nothing loaded: ${HOSTED_LIMIT_MESSAGE}`); return; }
        try { await recheck(await selected.text(), id, selected); } catch { stopImport(id, 'The file could not be read. Nothing was loaded.'); }
      }} />
    </div>
    {message && <p role="status" className="hint session-message">{message}</p>}
    {busy && <button className="btn" onClick={() => {
      activeRequest.current?.abort(); operation.current += 1; pendingOperation.current = pending ? operation.current : null;
      setBusy(false); setMessage('Operation cancelled. Your current workspace and any earlier review are kept.');
    }}>Cancel notebook operation</button>}
    {archive && <div className="historical-review">
      <p className="crumb">HISTORICAL RECORD · STATED BY THE FILE</p>
      <h3>Preserved evidence</h3>
      <p>{archive.review.historical.assessmentCount} original assessment(s). Checksums and source bindings are internally consistent; the author and science are not authenticated.</p>
      <div className="table-wrap" role="region" tabIndex={0} aria-label="Archived collection comparison"><table className="data-table"><thead><tr><th>Normalized collection</th><th>Compared with this installation</th></tr></thead><tbody>
        {archive.review.historical.collections.map((c) => <tr key={c.kind}><td>{c.kind}</td><td>{c.changed ? 'Changed' : 'Same digest'}</td></tr>)}
      </tbody></table></div>
      {archive.review.historical.originals.map((o) => <details key={o.id}><summary>Original assessment {o.id}</summary><p>{o.question}</p>
        {o.analyses.map((a, i) => <div key={i}><h4>{a.title}</h4><ul>{a.summary.map((s, j) => <li key={j}>{s}</li>)}</ul><p className="hint">{a.limitations.join(' ')}</p></div>)}
        {o.claims.map((c, i) => <div key={i}><p><strong>{c.title}:</strong> {c.text}</p><ul>{[...c.qualifications, ...c.missing, ...c.forbidden].map((text, j) => <li key={j}>{text}</li>)}</ul></div>)}
      </details>)}
      {archive.review.payloadChanges.map((c) => <p className="hint" key={c.assessmentId}>{c.assessmentId}: {c.fields.length ? `stored payload fields changed: ${c.fields.join(', ')}` : 'stored payload fields match (creation time excluded)'}.{c.unexplainedResultChange && ' Result changed despite unchanged source and method fingerprints; investigate before reuse.'}</p>)}
      {archive.review.currentError && <p className="flag">Current recomputation unavailable: {archive.review.currentError} No historical result can be loaded as a current assessment.</p>}
      <p className="hint">{archive.review.notice}</p>
      <div className="row"><button className="btn" onClick={() => downloadBlob('ignis-original-evidence-package.json', archive.original)}>Download original package</button>
        <button className="btn" onClick={() => downloadResearch('ignis-package-review.json', archive.review)}>Download package comparison</button>
        {!pending && <button className="btn ghost" onClick={clearReview}>Keep current workspace</button>}</div>
    </div>}
    {pending && <div className="session-review">
      <h3>Recheck report</h3>
      <p>{pending.checks.length} saved assessment(s). {pending.checks.filter((c) => c.status === 'unchanged').length} reproduced with unchanged source, method and result fingerprints.</p>
      {pending.checks.length > 0 && <><div className="table-wrap" role="region" tabIndex={0} aria-label="Notebook recheck comparison" aria-describedby="session-table-help"><table className="data-table session-checks-table"><thead><tr><th scope="col">Saved assessment</th><th scope="col">Source basis</th><th scope="col">Method</th><th scope="col">Result</th></tr></thead><tbody>
        {pending.checks.map((c) => <tr key={c.previousAssessmentId}><td className="num">{c.previousAssessmentId}</td><td>{c.sourceChanged ? 'Changed' : 'Unchanged'}</td><td>{c.methodChanged ? 'Changed' : 'Unchanged'}</td><td>{c.resultChanged ? 'Changed' : 'Unchanged'}</td></tr>)}
      </tbody></table></div><p className="hint" id="session-table-help">Scroll sideways on a small screen to compare source, method and result.</p></>}
      <p className="hint">{pending.notice}</p>
      <div className="row"><button className="btn" disabled={busy} onClick={() => {
        if (pendingOperation.current !== operation.current) return;
        clearReview(); onLoad(pending); setMessage('Rechecked workspace loaded.');
      }}>Load rechecked workspace</button>
        <button className="btn" onClick={() => downloadResearch('ignis-session-recheck.json', { savedChecksum: pending.session.checksum, checks: pending.checks, notice: pending.notice })}>Download recheck report</button>
        <button className="btn ghost" onClick={clearReview}>Keep current workspace</button></div>
    </div>}
    <p className="hint">Up to 16 assessments. Hosted package requests and responses: 4 MiB maximum. The local package library and browser-only data workbench support 8 MiB packages. Sessions: 2 MiB maximum; browser saving is manual. Oversize work is never truncated. Checksums are not signatures.</p>
  </section>;
}
