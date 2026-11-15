'use client';

import { useEffect, useRef, useState } from 'react';
import type { Assessment } from '../core/assess';
import { digestOf } from '../core/canonicalize';
import { exportJson, exportMarkdown, outcomeLabel } from '../core/export';
import { deriveHandling } from '../core/handling';
import { proposalFromForm, type FormChoices } from '../core/interpretation';
import { selectionLabel } from '../core/researchSelections';
import type { Shared } from './Dashboard';
import { AREAS, AREA_LABEL, buildRequest, download } from './lib';

type Provider = 'groq' | 'gemini';
interface Draft { question: string; choices: FormChoices }
interface Review { draft: Draft; binding: string }
const DEFAULT: Draft = { question: '', choices: { intent: 'synthesize_findings', safetyAreas: [] } };
const EXAMPLES: { label: string; draft: Draft }[] = [
  { label: 'Smoke detection evidence', draft: { question: 'What do the reviewed smoke detection experiments report, and what are their limitations?', choices: { intent: 'synthesize_findings', safetyAreas: ['detection'] } } },
  { label: 'Later CO₂ response', draft: { question: 'Can the Saffire VI cabin model support a conditional claim about the later remote CO₂ concentration response?', choices: { intent: 'assess_physical_model', physicalModelId: 'PM-SVI25', eventIds: ['EV-SVI-6'], quantityIds: ['Q-CO2-REMOTE-CONC'], requestedClaim: 'conditional_response', temporalScope: 'subsequent', requestedFeature: 'change' } } },
];
const CONFIG = { groq: 'GROQ-OSS120-LOW', gemini: 'GEM38-LOW' };

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: { id: string; label: string }[]; onChange: (value: string) => void }) {
  return <label className="field"><span>{label}</span><select value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select></label>;
}

export default function SI({ shared }: { shared: Shared }) {
  const { catalog, selections, record, notify, go } = shared;
  const [draft, setDraft] = useState<Draft>(DEFAULT);
  const [provider, setProvider] = useState<Provider>('groq');
  const [review, setReview] = useState<Review | null>(null);
  const [result, setResult] = useState<{ binding: string; assessment: Assessment } | null>(null);
  const [packet, setPacket] = useState<{ binding: string; value: unknown } | null>(null);
  const [busy, setBusy] = useState<string | null>(null), [error, setError] = useState('');
  const operation = useRef(0), controller = useRef<AbortController | null>(null);
  const binding = digestOf({ draft, provider, selections, catalogRevision: catalog?.revision ?? null });
  const context = `${catalog?.revision ?? ''}|${JSON.stringify(selections)}`;
  // A changed evidence context cancels requests. Rendered review/result also require exact binding.
  useEffect(() => () => { operation.current++; controller.current?.abort(); }, [context]);
  const edit = (next: Draft) => {
    operation.current++; controller.current?.abort(); setBusy(null); setError('');
    setReview(null); setResult(null); setPacket(null); setDraft(structuredClone(next));
  };
  const choices = (patch: Partial<FormChoices>) => edit({ ...draft, choices: { ...draft.choices, ...patch } });
  const proposal = proposalFromForm(draft.choices), handling = deriveHandling(proposal);
  const currentReview = review?.binding === binding ? review : null;
  const current = result?.binding === binding ? result.assessment : null;
  const currentPacket = packet?.binding === binding ? packet.value : null;
  const valid = !!catalog && draft.question.trim().length > 0 && draft.question.length <= 2000;

  const run = async (kind: 'assess' | 'packet') => {
    if (!catalog || !valid || (kind === 'assess' && !currentReview)) return;
    const snapshot = structuredClone(draft), selected = structuredClone(selections);
    const call = ++operation.current, startBinding = binding;
    controller.current?.abort(); const abort = new AbortController(); controller.current = abort;
    const timeout = setTimeout(() => abort.abort(), 30_000);
    setBusy(startBinding); setError('');
    try {
      const ids = [...new Set([...proposal.investigationIds, ...(proposal.physicalModelId ? [proposal.physicalModelId] : []), ...proposal.eventIds, ...proposal.quantityIds, ...proposal.endpointIds])];
      const body = kind === 'assess' ? { request: buildRequest(snapshot.choices, snapshot.question), catalogRevision: catalog.revision, researchSelections: selected }
        : { provider, question: snapshot.question, selectedIds: ids, envelope: { draftId: `SI-${call}`, draftRevision: call, catalogRevision: catalog.revision, runtimeConfigRevision: CONFIG[provider], logicalCallId: `PREVIEW-${call}` } };
      const res = await fetch(kind === 'assess' ? '/api/assess' : '/api/si', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: abort.signal });
      const value = await res.json();
      if (call !== operation.current) return;
      if (!res.ok) throw new Error(typeof value?.message === 'string' ? value.message : 'The SI request could not be prepared.');
      if (kind === 'assess') {
        const assessment = value as Assessment;
        // Validate the response and its content fingerprint before displaying or saving it.
        exportJson(assessment);
        if (assessment.request.originalText !== snapshot.question || digestOf(assessment.request.proposal) !== digestOf(proposalFromForm(snapshot.choices)) || assessment.catalogRevision !== catalog.revision) throw new Error('The returned assessment does not match the confirmed request.');
        record(assessment); setResult({ binding: startBinding, assessment });
      } else setPacket({ binding: startBinding, value });
    } catch (e) {
      if (call === operation.current) setError(e instanceof Error && e.name === 'AbortError' ? 'Request cancelled or timed out. Review the request before trying again.' : (e as Error).message);
    } finally { clearTimeout(timeout); if (call === operation.current) setBusy(null); }
  };
  const save = (kind: 'json' | 'md') => {
    if (!current) return;
    try { download(`ignis-si-${current.id}.${kind}`, kind === 'json' ? exportJson(current) : exportMarkdown(current), kind === 'json' ? 'application/json' : 'text/markdown'); }
    catch (e) { notify((e as Error).message); }
  };
  const c = draft.choices;
  const none = { id: '', label: 'Not specified' };

  return <div className="page">
    <header className="page-head"><span className="crumb">09 · SI</span><h1>SI · Scientific Intelligence</h1><p>Frame a research question, review its scope and follow the evidence to an assessment you can reproduce.</p></header>
    <ol className="path" aria-label="SI workflow"><li><small>01</small><span>Your question</span></li><li><small>02</small><span>Review the scope</span></li><li><small>03</small><span>Source-linked assessment</span></li></ol>
    <section className="section" aria-labelledby="si-question"><div className="section-head"><h2 id="si-question">Your research question</h2><span className="tag outline">Structured mode</span></div>
      <div className="chips">{EXAMPLES.map((x) => <button className="chip" type="button" key={x.label} onClick={() => edit(x.draft)}>{x.label}</button>)}</div>
      <label className="field"><span>Question</span><textarea rows={4} value={draft.question} onChange={(e) => edit({ ...draft, question: e.target.value })} placeholder="What do you want to learn from the experiments?" aria-describedby="si-question-count" /></label>
      <p id="si-question-count" className={draft.question.length > 2000 ? 'error' : 'muted'}>{draft.question.length.toLocaleString()} / 2,000 characters. Structured mode uses your selections below; it does not interpret the question with a language model.</p>
      <div className="fields">
        <SelectField label={'Research task'} value={c.intent} options={[{ id: 'synthesize_findings', label: 'Prepare a research brief' }, { id: 'browse_investigations', label: 'Find investigations' }, { id: 'compare_evidence', label: 'Compare evidence' }, { id: 'assess_physical_model', label: 'Check a published model claim' }]} onChange={(intent) => choices({ intent: intent as FormChoices['intent'], physicalModelId: null, eventIds: [], endpointIds: [], requestedClaim: 'unspecified', temporalScope: 'unspecified', requestedFeature: 'unspecified' })} />
        <SelectField label={'Investigation'} value={c.investigationIds?.[0] ?? ''} options={[none, ...(catalog?.investigations.map((i) => ({ id: i.id, label: i.displayName })) ?? [])]} onChange={(id) => choices({ investigationIds: id ? [id] : [] })} />
        <SelectField label={'Quantity'} value={c.quantityIds?.[0] ?? ''} options={[none, ...(catalog?.quantities.map((q) => ({ id: q.id, label: q.displayName })) ?? [])]} onChange={(id) => choices({ quantityIds: id ? [id] : [] })} />
      </div>
      <div className="chips" role="group" aria-label="SI safety areas">{AREAS.map((a) => <button className="chip" type="button" key={a} aria-pressed={c.safetyAreas?.includes(a) ?? false} onClick={() => choices({ safetyAreas: c.safetyAreas?.includes(a) ? c.safetyAreas.filter((x) => x !== a) : [...c.safetyAreas ?? [], a] })}>{AREA_LABEL[a]}</button>)}</div>
      <p className="muted">No selected safety area means all areas.</p>
      {c.intent === 'assess_physical_model' && <div className="fields">
        <SelectField label={'Published model'} value={c.physicalModelId ?? ''} options={[none, ...(catalog?.models.map((m) => ({ id: m.id, label: m.displayName })) ?? [])]} onChange={(id) => choices({ physicalModelId: id || null, eventIds: [] })} />
        <SelectField label={'Burn event'} value={c.eventIds?.[0] ?? ''} options={[none, ...(catalog?.events.filter((e) => !c.physicalModelId || e.investigationId === catalog.models.find((m) => m.id === c.physicalModelId)?.investigationId).map((e) => ({ id: e.id, label: e.label })) ?? [])]} onChange={(id) => choices({ eventIds: id ? [id] : [] })} />
        <SelectField label={'Requested claim'} value={c.requestedClaim ?? 'unspecified'} options={['unspecified', 'description', 'comparison', 'independent_prediction', 'conditional_response', 'transfer'].map((id) => ({ id, label: id.replace(/_/g, ' ') }))} onChange={(v) => choices({ requestedClaim: v as FormChoices['requestedClaim'] })} />
        <SelectField label={'Time scope'} value={c.temporalScope ?? 'unspecified'} options={['unspecified', 'initial', 'subsequent', 'whole_record'].map((id) => ({ id, label: id.replace(/_/g, ' ') }))} onChange={(v) => choices({ temporalScope: v as FormChoices['temporalScope'] })} />
        <SelectField label={'Requested feature'} value={c.requestedFeature ?? 'unspecified'} options={['unspecified', 'level', 'change', 'series', 'definition'].map((id) => ({ id, label: id }))} onChange={(v) => choices({ requestedFeature: v as FormChoices['requestedFeature'] })} />
        <SelectField label={'Endpoint'} value={c.endpointIds?.[0] ?? ''} options={[none, ...(catalog?.endpoints.map((e) => ({ id: e.id, label: e.displayName })) ?? [])]} onChange={(id) => choices({ endpointIds: id ? [id] : [] })} />
      </div>}
      {selections.length > 0 && <div className="card flat"><h3>Attached source analyses</h3><ul className="bullets">{selections.map((s) => <li key={s.kind}>{selectionLabel(s)}</li>)}</ul><p className="muted">These accompany the local assessment. They are excluded from the provider packet.</p></div>}
      <button type="button" className="btn" disabled={!valid || busy === binding} onClick={() => { setReview({ draft: structuredClone(draft), binding }); setResult(null); setError(''); }}>Review request</button>
    </section>
    {currentReview && <section className="section" aria-labelledby="si-review"><div className="section-head"><h2 id="si-review">Confirm the scope</h2></div>
      <blockquote>{currentReview.draft.question}</blockquote>
      <dl className="kv"><dt>Task</dt><dd>{proposal.intent.replace(/_/g, ' ')}</dd><dt>Safety areas</dt><dd>{proposal.safetyAreas.join(', ') || 'All areas'}</dd><dt>Quantity</dt><dd>{catalog?.quantities.filter((q) => proposal.quantityIds.includes(q.id)).map((q) => q.displayName).join(', ') || 'Not specified'}</dd><dt>Model</dt><dd>{catalog?.models.find((m) => m.id === proposal.physicalModelId)?.displayName ?? 'Not specified'}</dd><dt>Claim / time / feature</dt><dd>{[proposal.requestedClaim, proposal.temporalScope, proposal.requestedFeature].map((x) => x.replace(/_/g, ' ')).join(' / ')}</dd></dl>
      <details><summary>All structured fields</summary><pre className="local-json">{JSON.stringify(proposal, null, 2)}</pre></details>
      {handling.reasons.length > 0 && <ul className="bullets">{handling.reasons.map((r) => <li key={r}>{r}</li>)}</ul>}
      <button type="button" className="btn" disabled={busy === binding || handling.handling !== 'ready'} onClick={() => void run('assess')}>{busy === binding ? 'Preparing…' : 'Confirm and assess'}</button>
    </section>}
    {error && <p className="error" role="alert">{error}</p>}
    {busy === binding && <button type="button" className="btn ghost" onClick={() => { operation.current++; controller.current?.abort(); setBusy(null); }}>Cancel request</button>}
    {current && <section className="section" aria-labelledby="si-results"><div className="section-head"><h2 id="si-results">Assessment</h2><div className="btn-row"><button className="btn ghost small" type="button" onClick={() => save('json')}>Download SI assessment · JSON</button><button className="btn ghost small" type="button" onClick={() => save('md')}>Download SI assessment · Markdown</button></div></div>
      <p>Saved to your research notebook in Sources.</p>
      {current.handling.reasons.length > 0 && <ul className="bullets">{current.handling.reasons.map((r) => <li key={r}>{r}</li>)}</ul>}
      <div className="claims">{current.claims.map((claim) => <article className="claim" key={claim.id}><span className="tag outline">{claim.outcome ? outcomeLabel(claim) : claim.route === 'context' ? 'Background' : 'Source finding'}</span><h3>{claim.title}</h3><p>{claim.authoritativeText}</p>
        {(claim.qualifications.length > 0 || claim.forbiddenStrongerClaims.length > 0) && <details><summary>Scope and qualifications</summary><ul className="bullets">{[...claim.qualifications, ...claim.forbiddenStrongerClaims].map((x, i) => <li key={i}>{x}</li>)}</ul></details>}
        <div className="card-foot">{claim.sourceIds.map((id) => { const s = catalog?.sources.find((x) => x.id === id); return s?.canonicalUri ? <a href={s.canonicalUri} key={id} target="_blank" rel="noreferrer">{s.title}</a> : <span key={id}>{s?.title ?? id}</span>; })}</div></article>)}</div>
      <details><summary>Related investigations</summary><ul className="bullets">{current.ranking.map((r) => <li key={r.investigationId}><button className="btn ghost small" type="button" onClick={() => go('investigations', { investigation: r.investigationId })}>{r.displayName}</button><p>{r.humanReasons.join(' ')}</p></li>)}</ul></details>
      {current.researchAnalyses?.map((a) => <article className="card" key={a.id}><h3>{a.title}</h3><ul className="bullets">{a.summary.map((s) => <li key={s}>{s}</li>)}</ul></article>)}
    </section>}
    <section className="section" aria-labelledby="si-provider"><div className="section-head"><h2 id="si-provider">Question interpretation</h2><span className="tag outline">Provider setup pending</span></div>
      <p>Groq and Gemini connections are prepared. Natural-language interpretation will be available after provider evaluation. A proposal will always be reviewed before an assessment.</p>
      <div className="fields"><SelectField label={'SI provider'} value={provider} options={[{ id: 'groq', label: 'Groq · GPT-OSS 120B' }, { id: 'gemini', label: 'Gemini · 3.8 Flash' }]} onChange={(v) => { edit(draft); setProvider(v as Provider); }} /></div>
      <p className="muted">Preview your question and selected investigations, model, events, quantities and endpoints alongside the public catalogue, instructions and schema. Detailed form choices stay local. Your CSV and notebook are excluded. No provider call is made.</p>
      <button type="button" className="btn ghost" disabled={!valid || busy === binding} onClick={() => void run('packet')}>Preview SI packet</button>
      {currentPacket != null && <div className="stack"><p>Packet prepared locally · inference NOT RUN.</p><button type="button" className="btn ghost small" onClick={() => download('ignis-si-packet-preview.json', JSON.stringify(currentPacket, null, 2))}>Download SI packet preview</button><details><summary>Inspect packet contents</summary><pre className="local-json">{JSON.stringify(currentPacket, null, 2)}</pre></details></div>}
    </section>
  </div>;
}
