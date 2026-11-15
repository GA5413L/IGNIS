'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Assessment } from '../core/assess';
import { digestOf } from '../core/canonicalize';
import { exportJson, exportMarkdown, outcomeLabel } from '../core/export';
import { deriveHandling } from '../core/handling';
import { ConfirmedRequest, InterpretationProposal } from '../core/schemas';
import type { Shared } from './Dashboard';
import { download } from './lib';

interface Status { available: boolean; revision: string; mode: 'local' | 'public'; turnstileSiteKey: string | null }
interface ProposalReceipt {
  receiptVersion: 'ignis-si-receipt-1'; state: 'proposal_ready'; signature: string; issuedAt: number; expiresAt: number;
  question: string; envelope: { draftId: string; draftRevision: number; catalogRevision: string; runtimeConfigRevision: string; logicalCallId: string };
  selectedIds: string[]; catalogDigest: string; proposal: InterpretationProposal; proposalDigest: string; handling: ReturnType<typeof deriveHandling>;
  provenance: { requestId: string; revision: string; returnedModel: string; provider: string } & Record<string, unknown>;
}
interface TurnstileApi { render: (container: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void }
declare global { interface Window { turnstile?: TurnstileApi } }

function Verification({ siteKey, onToken }: { siteKey: string; onToken: (token: string) => void }) {
  const container = useRef<HTMLDivElement>(null), [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const api = window.turnstile;
    if (!loaded || !api || !container.current) return;
    const id = api.render(container.current, { sitekey: siteKey, action: 'si-interpret', callback: onToken,
      'expired-callback': () => onToken(''), 'error-callback': () => onToken('') });
    return () => { api.remove(id); };
  }, [loaded, siteKey, onToken]);
  return <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={() => setLoaded(true)} /><div ref={container} /></>;
}

/** The complete receipt is confirmed server-side; the browser cannot assign AI provenance. */
export default function SIAssistant({ shared }: { shared: Shared }) {
  const { catalog, selections, record } = shared;
  const [status, setStatus] = useState<Status | null>(null), [question, setQuestion] = useState('');
  const [ack, setAck] = useState(false), [verification, setVerification] = useState(''), [verificationKey, setVerificationKey] = useState(0);
  const [review, setReview] = useState<{ binding: string; receipt: ProposalReceipt } | null>(null);
  const [result, setResult] = useState<{ binding: string; value: Assessment } | null>(null);
  const [pending, setPending] = useState<{ binding: string; call: number } | null>(null), [error, setError] = useState('');
  const operation = useRef(0), controller = useRef<AbortController | null>(null);
  const context = digestOf({ question, revision: catalog?.revision ?? null, selections });
  const busy = pending?.binding === context;
  const current = review?.binding === context ? review.receipt : null;
  const assessment = result?.binding === context ? result.value : null;
  const setToken = useCallback((token: string) => setVerification(token), []);
  useEffect(() => {
    const abort = new AbortController();
    fetch('/api/si/gateway', { cache: 'no-store', signal: abort.signal }).then((r) => r.ok ? r.json() : null)
      .then((value) => { if (value && typeof value.available === 'boolean' && typeof value.revision === 'string') setStatus(value); }).catch(() => {});
    return () => abort.abort();
  }, []);
  useEffect(() => () => { operation.current++; controller.current?.abort(); }, [context]);
  const cancel = () => { operation.current++; controller.current?.abort(); setPending(null); };
  const edit = (value: string) => { cancel(); setQuestion(value); setReview(null); setResult(null); setError(''); };

  async function run(kind: 'interpret' | 'assess') {
    if (!catalog || !status || !question.trim() || question.length > 2000 || (kind === 'interpret' && (!status.available || !ack)) || (kind === 'assess' && !current)) return;
    const binding = context, call = ++operation.current, original = question;
    const abort = new AbortController(); controller.current?.abort(); controller.current = abort;
    abort.signal.addEventListener('abort', () => setPending((previous) => previous?.call === call ? null : previous), { once: true });
    const timer = setTimeout(() => abort.abort(), 28_000);
    setPending({ binding, call }); setError('');
    const envelope = { draftId: `SI-${crypto.randomUUID()}`, draftRevision: call, catalogRevision: catalog.revision, runtimeConfigRevision: status.revision, logicalCallId: crypto.randomUUID() };
    try {
      if (kind === 'interpret') {
        setReview(null); setResult(null);
        const response = await fetch('/api/si/gateway', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: abort.signal,
          body: JSON.stringify({ question: original, selectedIds: [], envelope, publicDataOnly: true, ...(verification ? { turnstileToken: verification } : {}) }) });
        const data = await response.json();
        if (call !== operation.current) return;
        if (!response.ok) throw new Error(data.message ?? 'SI could not interpret the request.');
        const proposal = InterpretationProposal.parse(data.proposal);
        if (data.question !== original || digestOf(data.envelope) !== digestOf(envelope) || data.catalogDigest !== catalog.digest
          || data.proposalDigest !== digestOf(proposal) || data.provenance?.revision !== status.revision || typeof data.provenance?.requestId !== 'string'
          || data.receiptVersion !== 'ignis-si-receipt-1' || typeof data.signature !== 'string' || !/^[a-f0-9]{64}$/.test(data.signature)
          || !Number.isSafeInteger(data.issuedAt) || !Number.isSafeInteger(data.expiresAt)) throw new Error('The interpretation does not match the current question or is missing its confirmation signature.');
        setReview({ binding, receipt: { ...data, proposal } });
      } else if (current) {
        const response = await fetch('/api/si/gateway/assess', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: abort.signal,
          body: JSON.stringify({ receipt: current, researchSelections: selections }) });
        const data = await response.json();
        if (call !== operation.current) return;
        if (!response.ok) throw new Error(data.message ?? 'The assessment could not be prepared.');
        exportJson(data);
        const request = ConfirmedRequest.parse(data.request);
        if (request.originalText !== original || digestOf(request.proposal) !== current.proposalDigest || request.inputMode !== 'ai_assisted'
          || request.handling !== deriveHandling(current.proposal).handling || request.parentRequestRef !== null
          || request.runtimeProvenanceRef?.id !== current.provenance.requestId || request.runtimeProvenanceRef.revision !== current.provenance.revision
          || data.catalogRevision !== catalog.revision || data.catalogDigest !== current.catalogDigest) throw new Error('The assessment does not match the confirmed scope.');
        record(data); setResult({ binding, value: data });
      }
    } catch (e) {
      if (call === operation.current) setError(e instanceof Error && e.name === 'AbortError' ? 'The request was cancelled or timed out. Use structured mode or try later.' : (e as Error).message);
    } finally {
      clearTimeout(timer);
      if (kind === 'interpret') { setVerification(''); setVerificationKey((n) => n + 1); }
      if (call === operation.current) setPending(null);
    }
  }

  return <section className="section" aria-labelledby="si-assistant-heading">
    <div className="section-head"><h2 id="si-assistant-heading">Ask SI</h2><span className="tag outline">{status?.available ? 'Connected' : 'Connection checks pending'}</span></div>
    <p>Describe your spacecraft fire research question. SI proposes a scope for your review; the assessment then uses the curated evidence and published model contracts.</p>
    {!status?.available && <p className="muted">Natural-language interpretation is awaiting provider evaluation and connection checks. You can use the structured workflow below now.</p>}
    <label className="field"><span>Ask SI about the evidence</span><textarea rows={3} value={question} onChange={(e) => edit(e.target.value)} placeholder="Which evidence distinguishes flame disappearance from extinction?" /></label>
    <p className={question.length > 2000 ? 'error' : 'muted'}>{question.length.toLocaleString()} / 2,000 characters</p>
    <label className="row"><input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} /><span>This question contains public research information only. Send it with the public catalogue to the configured SI provider through Cloudflare.</span></label>
    <p className="muted">Your CSV, notebook and analyses are not automatically attached. Anything you type in this question is sent when you confirm public-only and choose Interpret with SI. SI does not run simulations or execute instructions.</p>
    {status?.available && status.mode === 'public' && status.turnstileSiteKey && <Verification key={verificationKey} siteKey={status.turnstileSiteKey} onToken={setToken} />}
    <div className="btn-row"><button type="button" className="btn" disabled={!status?.available || !ack || !catalog || !question.trim() || question.length > 2000 || busy || (status.mode === 'public' && !verification)} onClick={() => void run('interpret')}>Interpret with SI</button>
      {busy && <button type="button" className="btn ghost" onClick={cancel}>Cancel SI interpretation</button>}</div>
    {error && <p role="alert" className="error">{error}</p>}
    {current && <article className="card flat">
      <h3>Review the SI interpretation</h3><blockquote>{current.question}</blockquote>
      <dl className="kv"><dt>Task</dt><dd>{current.proposal.intent.replace(/_/g, ' ')}</dd><dt>Areas</dt><dd>{current.proposal.safetyAreas.join(', ') || 'All areas'}</dd>
        <dt>Investigations</dt><dd>{current.proposal.investigationIds.map((id) => catalog?.investigations.find((x) => x.id === id)?.displayName ?? id).join(', ') || 'Not specified'}</dd>
        <dt>Claim / time / feature</dt><dd>{[current.proposal.requestedClaim, current.proposal.temporalScope, current.proposal.requestedFeature].map((s) => s.replace(/_/g, ' ')).join(' / ')}</dd></dl>
      <details open><summary>Complete proposed scope</summary><pre className="local-json">{JSON.stringify(current.proposal, null, 2)}</pre></details>
      {deriveHandling(current.proposal).reasons.map((reason) => <p key={reason}>{reason}</p>)}
      <p className="muted">{current.provenance.returnedModel} · Review every condition and exclusion. Edit your question or use structured mode if the interpretation needs correction.</p>
      <p className="muted">Confirm within 15 minutes of interpretation; otherwise interpret the question again.</p>
      <div className="btn-row"><button type="button" className="btn" disabled={busy || deriveHandling(current.proposal).handling !== 'ready'} onClick={() => void run('assess')}>Confirm SI scope and assess</button>
        <button type="button" className="btn ghost" onClick={() => download('ignis-si-interpretation-receipt.json', JSON.stringify(current, null, 2))}>Download interpretation receipt</button></div>
    </article>}
    {assessment && <article className="stack"><h3>SI-assisted assessment</h3><p>Saved to your research notebook in Sources.</p>
      <div className="btn-row"><button type="button" className="btn ghost" onClick={() => download('ignis-si-assisted-assessment.json', exportJson(assessment))}>Download assisted assessment</button>
        <button type="button" className="btn ghost" onClick={() => download('ignis-si-assisted-assessment.md', exportMarkdown(assessment), 'text/markdown')}>Download assisted Markdown</button></div>
      {assessment.claims.map((claim) => <article key={claim.id} className="claim"><span className="tag outline">{claim.outcome ? outcomeLabel(claim) : 'Source finding'}</span><h4>{claim.title}</h4><p>{claim.authoritativeText}</p>
        <details><summary>Scope and qualifications</summary><ul className="bullets">{[...claim.qualifications, ...claim.forbiddenStrongerClaims].map((s, i) => <li key={i}>{s}</li>)}</ul></details>
        <div className="card-foot">{claim.sourceIds.map((id) => { const s = catalog?.sources.find((x) => x.id === id); return s?.canonicalUri ? <a key={id} href={s.canonicalUri} target="_blank" rel="noreferrer">{s.title}</a> : <span key={id}>{id}</span>; })}</div></article>)}
      {assessment.researchAnalyses?.map((a) => <article key={a.id} className="card"><h4>{a.title}</h4><ul className="bullets">{a.summary.map((s) => <li key={s}>{s}</li>)}</ul></article>)}
    </article>}
  </section>;
}
