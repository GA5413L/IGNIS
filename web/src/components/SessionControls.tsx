'use client';
import { useRef, useState } from 'react';
import { MAX_SESSION_BYTES, type ResearchSession, type RecheckedSession } from '../core/researchSession';
import { downloadResearch } from './researchShared';

const STORAGE_KEY = 'ignis-research-session-v1';
export default function SessionControls({ makePacket, onLoad }: { makePacket: () => ResearchSession; onLoad: (r: RecheckedSession) => void }) {
  const file = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState<RecheckedSession | null>(null);
  const [busy, setBusy] = useState(false);
  const operation = useRef(0);
  const pendingOperation = useRef<number | null>(null);
  function beginImport() {
    const id = ++operation.current;
    pendingOperation.current = null; setPending(null); setBusy(true);
    return id;
  }
  function stopImport(id: number, text: string) {
    if (id !== operation.current) return;
    setMessage(text); setBusy(false);
  }
  function clearReview() {
    operation.current += 1; pendingOperation.current = null; setPending(null); setBusy(false);
  }
  function save(browser: boolean) {
    try {
      const packet = makePacket();
      if (browser) { localStorage.setItem(STORAGE_KEY, JSON.stringify(packet)); setMessage('Session saved in this browser. Use Restore browser save to recheck it.'); }
      else { downloadResearch('ignis-research-session.json', packet); setMessage('Session downloaded with the draft, exact selections and assessment receipts.'); }
    } catch (e) { setMessage(`Save stopped: ${(e as Error).message}`); }
  }
  async function recheck(text: string, id: number) {
    if (id !== operation.current) return;
    setMessage('Recomputing the saved recipes against this installation…');
    try {
      if (new TextEncoder().encode(text).length > MAX_SESSION_BYTES) throw new Error('Session exceeds 2 MiB.');
      const response = await fetch('/api/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: text });
      const body = await response.json();
      if (id !== operation.current) return;
      if (!response.ok) throw new Error(body.message ?? 'Session recheck failed.');
      pendingOperation.current = id;
      setPending(body); setMessage('Recheck complete. Review the comparison before loading.');
    } catch (e) { if (id === operation.current) setMessage(`Nothing loaded: ${(e as Error).message}`); }
    finally { if (id === operation.current) setBusy(false); }
  }
  return <section className="panel session-panel" aria-labelledby="session-h">
    <div className="section-heading"><div><p className="eyebrow">RESEARCH NOTEBOOK</p><h2 id="session-h">Save, reopen and recheck</h2></div>
      <p className="hint">Portable recipes preserve your question, attached selections and assessment receipts. Imports recompute those recipes from this installation’s sources. Keep the assessment JSON to retain the original results and source rows.</p></div>
    <div className="row">
      <button className="btn" disabled={busy} onClick={() => save(false)}>Download session</button>
      <button className="btn" disabled={busy} onClick={() => save(true)}>Save in this browser</button>
      <button className="btn" disabled={busy} onClick={() => file.current?.click()}>Import session</button>
      <button className="linkbtn" disabled={busy} onClick={() => {
        const id = beginImport();
        try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) void recheck(saved, id); else stopImport(id, 'No session has been saved in this browser.'); }
        catch { stopImport(id, 'Browser storage is unavailable. Import a downloaded session instead.'); }
      }}>Restore browser save</button>
      <input ref={file} aria-label="Session JSON file" type="file" accept=".json,application/json" hidden onChange={async (e) => {
        const selected = e.currentTarget.files?.[0]; e.currentTarget.value = '';
        if (!selected) return;
        const id = beginImport(); setMessage('Reading the selected session…');
        if (selected.size > MAX_SESSION_BYTES) { stopImport(id, 'Nothing loaded: session exceeds 2 MiB.'); return; }
        try { await recheck(await selected.text(), id); } catch { stopImport(id, 'The file could not be read. Nothing was loaded.'); }
      }} />
    </div>
    {message && <p role="status" className="hint session-message">{message}</p>}
    {pending && <div className="session-review">
      <h3>Recheck report</h3>
      <p>{pending.checks.length} saved assessment(s). {pending.checks.filter((c) => c.status === 'unchanged').length} reproduced with unchanged source, method and result fingerprints.</p>
      {pending.checks.length > 0 && <><div className="scroll-x" role="region" tabIndex={0} aria-label="Notebook recheck comparison" aria-describedby="session-table-help"><table className="data-table session-checks-table"><thead><tr><th scope="col">Saved assessment</th><th scope="col">Source basis</th><th scope="col">Method</th><th scope="col">Result</th></tr></thead><tbody>
        {pending.checks.map((c) => <tr key={c.previousAssessmentId}><td className="num">{c.previousAssessmentId}</td><td>{c.sourceChanged ? 'Changed' : 'Unchanged'}</td><td>{c.methodChanged ? 'Changed' : 'Unchanged'}</td><td>{c.resultChanged ? 'Changed' : 'Unchanged'}</td></tr>)}
      </tbody></table></div><p className="hint" id="session-table-help">Scroll sideways on a small screen to compare source, method and result.</p></>}
      <p className="hint">{pending.notice}</p>
      <div className="row"><button className="btn primary" onClick={() => {
        if (pendingOperation.current !== operation.current) return;
        clearReview(); onLoad(pending); setMessage('Rechecked workspace loaded.');
      }}>Load rechecked workspace</button>
        <button className="btn" onClick={() => downloadResearch('ignis-session-recheck.json', { savedChecksum: pending.session.checksum, checks: pending.checks, notice: pending.notice })}>Download recheck report</button>
        <button className="linkbtn" onClick={clearReview}>Keep current workspace</button></div>
    </div>}
    <p className="hint">Up to 16 assessments per session. Browser saving is manual; downloading a file keeps a copy outside this browser. Checksums are not signatures.</p>
  </section>;
}
