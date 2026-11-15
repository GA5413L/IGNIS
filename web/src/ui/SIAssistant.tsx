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
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ question: string; claims: Assessment['claims'] }[]>([]);
  const launcher = useRef<HTMLButtonElement>(null), composer = useRef<HTMLTextAreaElement>(null), conversation = useRef<HTMLDivElement>(null);
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
    if (!open) return;
    composer.current?.focus();
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); launcher.current?.focus(); } };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [open]);
  useEffect(() => { conversation.current?.scrollTo({ top: conversation.current.scrollHeight }); }, [messages, review, result, pending]);
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
      if (call === operation.current) setError(e instanceof Error && e.name === 'AbortError' ? 'The request was cancelled or timed out. Please try again later.' : (e as Error).message);
    } finally {
      clearTimeout(timer);
      if (kind === 'interpret') { setVerification(''); setVerificationKey((n) => n + 1); }
      if (call === operation.current) setPending(null);
    }
  }

  const close = () => { setOpen(false); launcher.current?.focus(); };
  const send = () => {
    if (busy || !question.trim() || question.length > 2000 || (status?.available && (!ack || (status.mode === 'public' && !verification)))) return;
    if (status?.available) { void run('interpret'); return; }
    if (!shared.brief || !question.trim() || question.length > 2000) return;
    const ignored = new Set(['what', 'which', 'does', 'have', 'with', 'from', 'about', 'there', 'their', 'that', 'this', 'when', 'where', 'research', 'evidence', 'tell', 'show', 'please']);
    const terms = [...new Set(question.toLowerCase().match(/[a-z0-9]{3,}/g) ?? [])].filter((term) => !ignored.has(term));
    const claims = shared.brief.claims.map((claim) => ({ claim, score: terms.reduce((score, term) => score + (new RegExp(`\\b${term}`, 'i').test(`${claim.title} ${claim.authoritativeText}`) ? 1 : 0), 0) }))
      .filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score).slice(0, 3).map((entry) => entry.claim);
    setMessages((previous) => [...previous.slice(-11), { question: question.trim(), claims }]);
    edit('');
    composer.current?.focus();
  };
  const renderClaims = (claims: Assessment['claims']) => claims.map((claim) => <article className="si-chat-finding" key={claim.id}>
    <strong>{claim.title}</strong><p>{claim.authoritativeText}</p>
    <details><summary>Scope and limitations</summary><ul>{[...claim.qualifications, ...claim.forbiddenStrongerClaims].map((text, i) => <li key={i}>{text}</li>)}</ul></details>
    <div className="si-chat-sources">{claim.sourceIds.map((id) => { const source = catalog?.sources.find((item) => item.id === id); return source?.canonicalUri ? <a key={id} href={source.canonicalUri} target="_blank" rel="noreferrer">{source.title}</a> : <span key={id}>{id}</span>; })}</div>
  </article>);
  return <div className="si-chat">
    <button ref={launcher} className="si-chat-launcher" type="button" aria-label={open ? 'Minimize SI chat' : 'Open SI chat'} aria-expanded={open} aria-controls="si-chat-panel" onClick={() => open ? close() : setOpen(true)}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-3 2V11.5a10 10 0 0 1 20 0Z" /><path d="M7 10h8M7 14h5" /></svg><span>Ask SI</span>
    </button>
    {open && <section id="si-chat-panel" role="dialog" aria-modal="false" aria-labelledby="si-assistant-heading" className="si-chat-panel" onKeyDown={(event) => { if (event.key === 'Escape') { event.stopPropagation(); close(); } }}>
      <header className="si-chat-header"><div><h2 id="si-assistant-heading">SI <span>Scientific Intelligence</span></h2><p>{status?.available ? 'Connected · reviewable, source-linked answers' : 'Catalogue search · live SI unavailable'}</p></div><button type="button" aria-label="Close SI chat" onClick={close}>×</button></header>
      <div ref={conversation} className="si-chat-conversation" role="log" aria-label="SI conversation" aria-live="polite" aria-relevant="additions">
        <div className="si-chat-message"><strong>Explore spacecraft combustion.</strong><p>Find reported results, compare measurement limits and follow the original sources.</p>
          <div className="si-chat-prompts">{['Smoke detection', 'Flame extinction', 'Microgravity', 'Oxygen concentration'].map((prompt) => <button key={prompt} type="button" onClick={() => { edit(prompt); composer.current?.focus(); }}>{prompt}</button>)}</div>
          {!status?.available && <p className="si-chat-note">Searches reviewed findings by keyword. Results are source excerpts, not a generated answer or simulation.</p>}
        </div>
        {messages.map((message, i) => <div key={i}><p className="si-chat-question">{message.question}</p><div className="si-chat-message"><span className="si-chat-label">Catalogue matches</span>{message.claims.length ? renderClaims(message.claims) : <p>No reviewed finding matches those terms. Try an investigation name, material or measurement. Absence here does not establish absence of evidence.</p>}</div></div>)}
        {(current || busy || assessment) && <p className="si-chat-question">{question}</p>}
        {busy && <p role="status">{current ? 'Preparing the assessment…' : 'Interpreting your question…'}</p>}
        {error && <p role="alert" className="error">{error}</p>}
    {current && <article className="card flat">
      <h3>Review the SI interpretation</h3><blockquote>{current.question}</blockquote>
      <dl className="kv"><dt>Task</dt><dd>{current.proposal.intent.replace(/_/g, ' ')}</dd><dt>Areas</dt><dd>{current.proposal.safetyAreas.join(', ') || 'All areas'}</dd>
        <dt>Investigations</dt><dd>{current.proposal.investigationIds.map((id) => catalog?.investigations.find((x) => x.id === id)?.displayName ?? id).join(', ') || 'Not specified'}</dd>
        <dt>Claim / time / feature</dt><dd>{[current.proposal.requestedClaim, current.proposal.temporalScope, current.proposal.requestedFeature].map((s) => s.replace(/_/g, ' ')).join(' / ')}</dd></dl>
      <details><summary>Complete proposed scope</summary><pre className="local-json">{JSON.stringify(current.proposal, null, 2)}</pre></details>
      {deriveHandling(current.proposal).reasons.map((reason) => <p key={reason}>{reason}</p>)}
      <p className="muted">{current.provenance.returnedModel} · Review every condition and exclusion. Edit your question if the interpretation needs correction.</p>
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
      </div>
      <footer className="si-chat-compose">
        {status?.available && <label className="si-chat-consent"><input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} /><span>This question contains public research information only. Send it with the public catalogue through Cloudflare. CSVs and notebooks are not attached.</span></label>}
        {status?.available && status.mode === 'public' && status.turnstileSiteKey && <Verification key={verificationKey} siteKey={status.turnstileSiteKey} onToken={setToken} />}
        <div className="si-chat-input"><textarea ref={composer} aria-label="Ask SI about the evidence" rows={2} maxLength={2000} value={question} onChange={(e) => edit(e.target.value)} placeholder="Ask about combustion evidence…" onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(); } }} />
          <button type="button" aria-label={status?.available ? 'Interpret with SI' : 'Search evidence'} disabled={!catalog || !question.trim() || busy || (status?.available ? !ack || (status.mode === 'public' && !verification) : !shared.brief)} onClick={send}>↑</button></div>
        <div className="si-chat-tools"><span>Enter to send · Shift+Enter for a new line</span><button type="button" onClick={() => { close(); shared.go('sources'); }}>Sources &amp; notebook ↗</button></div>
        {busy && <button type="button" className="btn ghost" onClick={cancel}>Cancel SI interpretation</button>}
      </footer>
    </section>}
  </div>;
}
