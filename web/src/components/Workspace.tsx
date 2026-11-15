'use client';
/**
 * One connected Explore / Analysis workspace (master §14). The browser holds the draft and the immutable
 * assessments returned by the server; it renders and exports them but never computes a conflicting answer.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Assessment, ClaimResult } from '../core/assess';
import type { SafetyArea } from '../core/schemas';
import { proposalFromForm, type FormChoices } from '../core/interpretation';
import { deriveHandling } from '../core/handling';
import { exportJson, exportMarkdown, outcomeLabel, routeLabel } from '../core/export';
import { EXAMPLES } from './examples';
import dynamic from 'next/dynamic';
import InvestigationAtlas, { ResearchLanding } from './InvestigationAtlas';
import Conditions from './Conditions';
import SessionControls from './SessionControls';
import SelectedAnalyses from './SelectedAnalyses';
import { selectionLabel, type ResearchSelection } from '../core/researchSelections';
import { makeSession, type RecheckedSession } from '../core/researchSession';
import { reviewScenario } from '../core/scenario';
import { DEFAULT_CUTOFF_ENVELOPE_SELECTION } from '../core/cutoffEnvelope';
import type { PairSelection } from '../core/pairedDetector';
const DetectorLab = dynamic(() => import('./DetectorLab'), { loading: () => <section className="panel" aria-busy="true"><p>Loading the source readings…</p></section> });
const DataMethods = dynamic(() => import('./DataMethods'));
const PairedDetector = dynamic(() => import('./PairedDetector'));
const CutoffEnvelope = dynamic(() => import('./CutoffEnvelope'));
type WorkspaceTab = 'explore' | 'conditions' | 'detectors' | 'analysis' | 'data' | 'about';
const TAB_LABELS: Record<WorkspaceTab, string> = { explore: 'Explore', conditions: 'Conditions', detectors: 'Smoke lab', analysis: 'Analysis', data: 'Data & methods', about: 'About' };

interface CatalogView {
  revision: string; digest: string;
  counts: { investigations: number; findingsByKind: Record<string, number>; objectives: number; sources: number; models: number; contracts: number };
  manifest: { reviewStatement: string; unacquiredSources: { label: string; observation: string; effect: string }[]; omittedOptionalModules: string[] };
  families: { id: string; displayName: string }[];
  investigations: { id: string; displayName: string; familyId: string; safetyAreas: SafetyArea[]; coverage: string; summary: string; depthNote: string; findingIds: string[]; objectives: { id: string; statement: string; sourceLocators: { source: { id: string } }[] }[] }[];
  findings: { id: string; title: string; safetyAreas: SafetyArea[]; briefRole: string; investigationIds: string[] }[];
  models: { id: string; displayName: string; investigationId: string | null }[];
  events: { id: string; label: string; investigationId: string }[];
  quantities: { id: string; displayName: string; definition: string }[];
  endpoints: { id: string; displayName: string; definition: string }[];
  sources: { id: string; title: string; canonicalUri: string; access: string; publicationDate: string | null; observedSha256: string | null; review: { level: string; scope: string; method: string } }[];
}
interface Health { aiAvailable: boolean; aiReason: string; catalogRevision: string | null; buildRevision: string }
type Status = 'empty' | 'interpreting' | 'runtime_unavailable' | 'assessing' | 'result_ready' | 'error';

const AREAS: SafetyArea[] = ['prevention', 'detection', 'suppression'];
const INTENTS: { v: FormChoices['intent']; l: string }[] = [
  { v: 'synthesize_findings', l: 'Research brief across findings' }, { v: 'browse_investigations', l: 'Browse investigations' },
  { v: 'assess_physical_model', l: 'Assess a published physical model' }, { v: 'request_execution', l: 'Run a simulation (not supported)' },
];
const CLAIMS: { v: NonNullable<FormChoices['requestedClaim']>; l: string }[] = [
  { v: 'unspecified', l: 'Not specified' }, { v: 'description', l: 'Describe what was reported' }, { v: 'comparison', l: 'Compare' },
  { v: 'conditional_response', l: 'Conditional response comparison' }, { v: 'independent_prediction', l: 'Independent prediction' },
];
const SCOPES: { v: NonNullable<FormChoices['temporalScope']>; l: string }[] = [
  { v: 'unspecified', l: 'Not specified' }, { v: 'initial', l: 'Initial agreement' }, { v: 'subsequent', l: 'Later response (after start)' }, { v: 'whole_record', l: 'Whole record' },
];
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const rid = (p: string) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

function download(name: string, text: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function outcomeBadge(c: ClaimResult) {
  if (!c.outcome) return <span className={`badge ${c.route === 'context' ? 'ctx' : 'ok'}`}>{c.route === 'context' ? 'Context, not a measurement' : 'Source finding'}</span>;
  const cls = c.outcome === 'incompatible_requested_claim' ? 'no' : c.outcome === 'unresolved_requirement' ? 'warn' : 'ok';
  return <span className={`badge ${cls}`}>{outcomeLabel(c)}</span>;
}

export default function Workspace() {
  const [tab, setTab] = useState<WorkspaceTab>('explore');
  const [visited, setVisited] = useState<WorkspaceTab[]>(['explore']);
  const [catalog, setCatalog] = useState<CatalogView | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [draftRevision, setDraftRevision] = useState(0);
  const draftId = useRef(rid('DRAFT'));
  const [form, setForm] = useState<FormChoices>({ intent: 'synthesize_findings', safetyAreas: [] });
  const [status, setStatus] = useState<Status>('empty');
  const [notice, setNotice] = useState<{ kind: 'warn' | 'err' | 'info'; text: string } | null>(null);
  const [current, setCurrent] = useState<Assessment | null>(null);
  const [history, setHistory] = useState<Assessment[]>([]);
  const [researchSelections, setResearchSelections] = useState<ResearchSelection[]>([]);
  const [restoredSelections, setRestoredSelections] = useState<ResearchSelection[]>([]);
  const [restoreRevision, setRestoreRevision] = useState(0);
  const [viewRevisions, setViewRevisions] = useState<Record<ResearchSelection['kind'], number>>({ conditions: 0, detector: 0, detector_pair: 0, cutoff_envelope: 0 });
  const [detectorMode, setDetectorMode] = useState<'single' | 'paired' | 'range'>('single');
  const [recomputedHistory, setRecomputedHistory] = useState(false);
  const [scenarioNotice, setScenarioNotice] = useState<{ error: boolean; text: string } | null>(null);
  const workspaceEpoch = useRef(0);
  const formVersion = useRef(0);
  const [viewing, setViewing] = useState<Assessment | null>(null);
  const [inspect, setInspect] = useState<{ kind: 'claim'; id: string } | { kind: 'investigation'; id: string } | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [formChangedAfterResult, setFormChangedAfterResult] = useState(false);
  const live = useRef<HTMLParagraphElement>(null);
  const drawerHeading = useRef<HTMLHeadingElement>(null);
  const lastOpener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    Promise.all([fetch('/api/catalog').then((r) => r.json()), fetch('/api/health').then((r) => r.json())])
      .then(([c, h]) => { if (c.code) setLoadError(c.message); else setCatalog(c); setHealth(h); })
      .catch(() => setLoadError('The catalogue could not be loaded.'));
  }, []);

  useEffect(() => {
    const openLink = () => {
      try {
        const review = reviewScenario(window.location.hash);
        if (!review) return;
        const selected = review.current.selection;
        setRestoredSelections((previous) => [...previous.filter((s) => s.kind !== selected.kind), selected]);
        setViewRevisions((previous) => ({ ...previous, [selected.kind]: previous[selected.kind] + 1 }));
        const nextTab = selected.kind === 'conditions' ? 'conditions' : 'detectors';
        setTab(nextTab); setVisited((previous) => [...new Set([...previous, nextTab] as WorkspaceTab[])]);
        setDetectorMode(selected.kind === 'cutoff_envelope' ? 'range' : selected.kind === 'detector_pair' ? 'paired' : 'single');
        const changed = Object.entries(review.checks).filter(([, status]) => status === 'changed').map(([key]) => key);
        setScenarioNotice({ error: false, text: changed.length
          ? `Scenario opened and recomputed. Changed since link creation: ${changed.join(', ')}. Review the current result; the link is not an archived result.`
          : 'Scenario reopened: source, method and result match the link. Your question, attachments and assessment history are kept. Changed controls need a new link; checksums are not validation.' });
      } catch (error) { setScenarioNotice({ error: true, text: `Scenario was not loaded. ${(error as Error).message} Existing work is kept.` }); }
    };
    const timer = window.setTimeout(openLink, 0);
    window.addEventListener('hashchange', openLink);
    return () => { window.clearTimeout(timer); window.removeEventListener('hashchange', openLink); };
  }, []);

  const shown = viewing ?? current;
  const announce = (t: string) => { if (live.current) live.current.textContent = t; };
  const updateForm = (patch: Partial<FormChoices>) => { formVersion.current += 1; setForm((f) => ({ ...f, ...patch })); if (current) setFormChangedAfterResult(true); };
  const draftRevisionRef = useRef(0);
  const editQuestion = (t: string) => { formVersion.current += 1; setQuestion(t); draftRevisionRef.current += 1; setDraftRevision(draftRevisionRef.current); if (current) setFormChangedAfterResult(true); };

  const interpret = useCallback(async () => {
    if (!catalog || !question.trim()) return;
    const operationEpoch = ++workspaceEpoch.current;
    const sentRevision = draftRevision;
    setStatus('interpreting'); setNotice(null);
    try {
      const r = await fetch('/api/interpret', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ envelope: { draftId: draftId.current, draftRevision: sentRevision, catalogRevision: catalog.revision, runtimeConfigRevision: 'unselected', logicalCallId: rid('CALL') }, question, selectedIds: [] }) });
      const body = await r.json();
      if (operationEpoch !== workspaceEpoch.current) return;
      if (sentRevision !== draftRevisionRef.current) { setStatus('empty'); setNotice({ kind: 'info', text: 'Your question changed while it was being interpreted; the old reply was discarded.' }); return; }
      if (r.status === 503) { setStatus('runtime_unavailable'); setNotice({ kind: 'warn', text: body.message }); announce('AI interpretation unavailable. Use the structured request.'); return; }
      setStatus('error'); setNotice({ kind: 'err', text: body.message ?? 'Interpretation failed.' });
    } catch { if (operationEpoch === workspaceEpoch.current) { setStatus('error'); setNotice({ kind: 'err', text: 'Network error; your question is kept.' }); } }
  }, [catalog, question, draftRevision]);

  const runAssessment = useCallback(async (asRevision: boolean) => {
    if (!catalog) return;
    let proposal;
    try { proposal = proposalFromForm(form); } catch { setNotice({ kind: 'err', text: 'The structured request is incomplete.' }); return; }
    const parent = asRevision ? current : null;
    const operationEpoch = ++workspaceEpoch.current;
    const sentFormVersion = formVersion.current;
    const request = {
      id: rid('REQ'), revision: 'r1', originalText: question, confirmedAt: new Date().toISOString(), proposal,
      handling: deriveHandling(proposal).handling, inputMode: 'form' as const,
      parentRequestRef: parent ? { id: parent.request.id, revision: parent.request.revision } : null, runtimeProvenanceRef: null, remainingScientificGaps: [],
    };
    setStatus('assessing'); setNotice(null); announce('Assessing against the reviewed registry…');
    try {
      const r = await fetch('/api/assess', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ request, catalogRevision: catalog.revision, parent, researchSelections }) });
      const body = await r.json();
      if (operationEpoch !== workspaceEpoch.current) return;
      if (!r.ok) { setStatus('error'); setNotice({ kind: 'err', text: body.message ?? 'Assessment failed.' }); return; }
      if (current) setHistory((h) => [current, ...h]);
      setCurrent(body as Assessment); setViewing(null); setStatus('result_ready'); setFormChangedAfterResult(sentFormVersion !== formVersion.current); setShowAll(false);
      setInspect(null); setTab('analysis'); announce('Result ready.');
    } catch { if (operationEpoch === workspaceEpoch.current) { setStatus('error'); setNotice({ kind: 'err', text: 'Network error; your request is kept.' }); } }
  }, [catalog, form, question, current, researchSelections]);

  const loadExample = (i: number) => {
    const ex = EXAMPLES[i];
    editQuestion(ex.question);
    setForm({ safetyAreas: [], ...ex.form });
    if (current) setFormChangedAfterResult(true);
    setNotice({ kind: 'info', text: 'Example loaded into the question and the structured request. Confirm to run the assessment on the reviewed records.' });
  };

  const exportAs = (kind: 'md' | 'json') => {
    if (!shown) return;
    try {
      if (kind === 'md') download(`${shown.id}.md`, exportMarkdown(shown), 'text/markdown');
      else download(`${shown.id}.json`, exportJson(shown), 'application/json');
      announce(`${kind === 'md' ? 'Markdown' : 'JSON'} exported.`);
    } catch (e) { setNotice({ kind: 'err', text: `Export stopped: ${(e as Error).message}. The assessment is kept.` }); }
  };

  const openInspector = (target: NonNullable<typeof inspect>, el: HTMLElement) => { lastOpener.current = el; setInspect(target); setTimeout(() => drawerHeading.current?.focus(), 0); };
  const closeInspector = () => { setInspect(null); setTimeout(() => lastOpener.current?.focus(), 0); };

  const modelEvents = useMemo(() => {
    if (!catalog || !form.physicalModelId) return [];
    const inv = catalog.models.find((m) => m.id === form.physicalModelId)?.investigationId;
    return catalog.events.filter((e) => e.investigationId === inv);
  }, [catalog, form.physicalModelId]);

  const navigate = (next: WorkspaceTab) => {
    setTab(next); setVisited((v) => v.includes(next) ? v : [...v, next]); setInspect(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };
  const prepareBrief = (area?: SafetyArea, selection?: ResearchSelection) => {
    loadExample(area === 'detection' ? 1 : 0);
    if (area === 'prevention') setForm({ intent: 'synthesize_findings', safetyAreas: ['prevention'] });
    if (selection) {
      setResearchSelections((saved) => [...saved.filter((s) => s.kind !== selection.kind), selection]);
      editQuestion(`What do the reviewed ${area ?? 'fire-safety'} findings establish alongside this source analysis: ${selectionLabel(selection)}?`);
    }
    setTab('explore');
    setNotice({ kind: 'info', text: selection ? 'Your exact source selection is attached below. Confirm the request to include its recomputed result in the brief and both exports.' : 'A structured brief request is ready below. Review any attached selections, then confirm.' });
    setTimeout(() => document.getElementById('research-request')?.scrollIntoView({ block: 'start' }), 0);
  };
  const loadSession = (rechecked: RecheckedSession) => {
    workspaceEpoch.current += 1; setRecomputedHistory(true);
    const { session, assessments } = rechecked;
    editQuestion(session.draft.question); setForm(session.draft.proposal);
    setResearchSelections(session.selections); setRestoredSelections(session.selections); setRestoreRevision((r) => r + 1);
    setDetectorMode(session.selections.some((s) => s.kind === 'cutoff_envelope') ? 'range' : session.selections.some((s) => s.kind === 'detector_pair') ? 'paired' : 'single');
    setCurrent(assessments.at(-1) ?? null); setHistory(assessments.slice(0, -1).reverse());
    setViewing(null); setInspect(null); setShowAll(false); setFormChangedAfterResult(assessments.length > 0);
    setStatus(assessments.length ? 'result_ready' : 'empty'); setTab(assessments.length ? 'analysis' : 'explore');
    setNotice({ kind: 'info', text: 'The saved recipes were recomputed. Review the restored draft before confirming another assessment.' });
  };
  const openCutoffRange = (pair?: PairSelection) => {
    const options = pair ? {
      ...DEFAULT_CUTOFF_ENVELOPE_SELECTION,
      flight: pair.flight, material: pair.material, channelA: pair.channelA, channelB: pair.channelB,
      includeReference: pair.includeReference, exclusions: pair.exclusions, requireRecordedNoFanProblem: pair.requireRecordedNoFanProblem,
    } : { ...DEFAULT_CUTOFF_ENVELOPE_SELECTION };
    setRestoredSelections((previous) => [...previous.filter((s) => s.kind !== 'cutoff_envelope'), { kind: 'cutoff_envelope', options }]);
    setViewRevisions((previous) => ({ ...previous, cutoff_envelope: previous.cutoff_envelope + 1 }));
    setDetectorMode('range'); navigate('detectors');
  };

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="brand"><svg viewBox="0 0 24 32" width="21" height="28" aria-hidden="true"><path d="M14 1c2 10-9 9-7 18 1-4 4-5 5-8 1 5 8 6 8 13a8 8 0 0 1-16 0C0 15 8 11 14 1Z" fill="currentColor" /></svg><span>IGNIS<small>Fire research, in context</small></span></div>
          <nav className="tabs" aria-label="Workspace">
            {(Object.keys(TAB_LABELS) as WorkspaceTab[]).map((t) => (
              <button key={t} aria-pressed={tab === t} onClick={() => navigate(t)}>{TAB_LABELS[t]}</button>))}
          </nav>
          <span className="ai-pill" title={health?.aiReason}>AI interpretation: {health ? (health.aiAvailable ? 'ready' : 'unavailable') : '…'}</span>
        </div>
        <p className="sub">NASA microgravity fire evidence, with its conditions and limits. Independent NASA Space Apps 2026 project (team Emberfall); not affiliated with or endorsed by NASA.</p>
      </header>
      <p className="visually-hidden" aria-live="polite" ref={live} />
      <main>
        {loadError && <div className="notice err" role="alert">{loadError}</div>}
        {scenarioNotice && <div className={`notice ${scenarioNotice.error ? 'err' : 'info'}`} role={scenarioNotice.error ? 'alert' : 'status'}><p>{scenarioNotice.text}</p><button className="linkbtn" onClick={() => { setScenarioNotice(null); window.history.replaceState(null, '', window.location.pathname + window.location.search); }}>Dismiss scenario notice</button></div>}
        <details className="notebook-toggle"><summary>Research notebook · save or reopen a session</summary>
          <SessionControls makePacket={() => makeSession({ question, proposal: proposalFromForm(form) }, researchSelections, [...history].reverse().concat(current ? [current] : []))} onLoad={loadSession} />
        </details>
        {tab === 'explore' && (
          <>
            <ResearchLanding onConditions={() => navigate('conditions')} onDetectors={() => navigate('detectors')} onRobustness={() => openCutoffRange()} onBrief={() => prepareBrief()} />
            <InvestigationAtlas onReviewedProfile={(id) => { setInspect({ kind: 'investigation', id }); setTimeout(() => drawerHeading.current?.focus(), 0); }} />
            <section className="panel" id="research-request" aria-labelledby="q-h">
              <p className="eyebrow">03 / EVIDENCE WORKSPACE</p>
              <h2 id="q-h">What fire-safety question are you investigating?</h2>
              <label htmlFor="q" className="visually-hidden">Question</label>
              <textarea id="q" value={question} maxLength={2000} placeholder="e.g. What evidence matters for an oxygen-enriched crew environment?"
                onChange={(e) => editQuestion(e.target.value)} />
              {researchSelections.length > 0 && <div className="attached-selections"><h3>Attached source selections</h3>
                <p className="hint">Each selection is recomputed on confirmation and included in the result and exports. Later filter changes do not change an attachment until you attach it again.</p>
                <ul>{researchSelections.map((s) => <li key={s.kind}>{selectionLabel(s)}{' '}
                  <button className="linkbtn" aria-label={`Remove ${s.kind} attachment`} onClick={() => { formVersion.current += 1; setResearchSelections((list) => list.filter((x) => x.kind !== s.kind)); if (current) setFormChangedAfterResult(true); }}>Remove</button></li>)}</ul>
              </div>}
              <div className="row" style={{ marginTop: 8 }}>
                <button className="btn" onClick={interpret} disabled={!question.trim() || status === 'interpreting'}>{status === 'interpreting' ? 'Interpreting…' : 'Interpret with AI'}</button>
                <button className="btn" onClick={() => { updateForm({ intent: 'browse_investigations' }); document.getElementById('catalogue')?.scrollIntoView(); }}>Browse investigations</button>
                <span className="hint">{question.length}/2000</span>
              </div>
              {notice && <div className={`notice ${notice.kind}`} role={notice.kind === 'err' ? 'alert' : 'status'}>{notice.text}</div>}
              <div className="chips" aria-label="Example questions">
                {EXAMPLES.map((ex, i) => <button key={ex.label} className="chip" onClick={() => loadExample(i)}>{ex.label}</button>)}
              </div>
              <p className="hint">Examples fill the question and a structured request; they do not return prerecorded answers.</p>
            </section>

            <section className="panel" aria-labelledby="form-h">
              <h2 id="form-h">Confirm the meaning (structured request)</h2>
              <p className="hint">This typed form is the fallback when AI interpretation is unavailable. Confirming states what you are asking; it does not verify any source fact.</p>
              <div className="form-grid">
                <div><label htmlFor="intent">Task</label>
                  <select id="intent" value={form.intent} onChange={(e) => updateForm({ intent: e.target.value as FormChoices['intent'], requestedExecutionText: e.target.value === 'request_execution' ? question || 'Run a simulation' : null })}>
                    {INTENTS.map((x) => <option key={x.v} value={x.v}>{x.l}</option>)}</select></div>
                {form.intent === 'assess_physical_model' && <>
                  <div><label htmlFor="model">Published model</label>
                    <select id="model" value={form.physicalModelId ?? ''} onChange={(e) => updateForm({ physicalModelId: e.target.value || null, eventIds: [] })}>
                      <option value="">Choose a model…</option>
                      {catalog?.models.map((m) => <option key={m.id} value={m.id}>{m.displayName}</option>)}</select></div>
                  <div><label htmlFor="event">Burn event (optional)</label>
                    <select id="event" value={form.eventIds?.[0] ?? ''} onChange={(e) => updateForm({ eventIds: e.target.value ? [e.target.value] : [] })}>
                      <option value="">Any</option>{modelEvents.map((ev) => <option key={ev.id} value={ev.id}>{ev.label}</option>)}</select></div>
                  <div><label htmlFor="qty">Physical quantity</label>
                    <select id="qty" value={form.quantityIds?.[0] ?? ''} onChange={(e) => updateForm({ quantityIds: e.target.value ? [e.target.value] : [] })}>
                      <option value="">Choose a quantity…</option>{catalog?.quantities.map((q) => <option key={q.id} value={q.id}>{q.displayName}</option>)}</select></div>
                  <div><label htmlFor="claim">What do you want to establish?</label>
                    <select id="claim" value={form.requestedClaim ?? 'unspecified'} onChange={(e) => updateForm({ requestedClaim: e.target.value as FormChoices['requestedClaim'] })}>
                      {CLAIMS.map((x) => <option key={x.v} value={x.v}>{x.l}</option>)}</select></div>
                  <div><label htmlFor="scope">Time scope</label>
                    <select id="scope" value={form.temporalScope ?? 'unspecified'} onChange={(e) => updateForm({ temporalScope: e.target.value as FormChoices['temporalScope'] })}>
                      {SCOPES.map((x) => <option key={x.v} value={x.v}>{x.l}</option>)}</select></div>
                </>}
              </div>
              {form.intent !== 'assess_physical_model' && form.intent !== 'request_execution' && (
                <fieldset className="areas" style={{ border: 'none', padding: 0 }}>
                  <legend className="hint">Safety areas (none selected = all three)</legend>
                  {AREAS.map((a) => (
                    <label key={a}><input type="checkbox" checked={form.safetyAreas?.includes(a) ?? false}
                      onChange={(e) => updateForm({ safetyAreas: e.target.checked ? [...(form.safetyAreas ?? []), a] : (form.safetyAreas ?? []).filter((x) => x !== a) })} />{cap(a)}</label>))}
                </fieldset>)}
              <div className="row" style={{ marginTop: 12 }}>
                <button className="btn primary" onClick={() => runAssessment(false)} disabled={!catalog || status === 'assessing'}>{status === 'assessing' ? 'Assessing…' : 'Confirm and assess'}</button>
                {current && <button className="btn" onClick={() => runAssessment(true)} disabled={status === 'assessing'}>Reassess as a revision of the current result</button>}
              </div>
              {formChangedAfterResult && current && <div className="notice info" role="status">Your request changed since the last result. The shown result belongs to the earlier request until you reassess.</div>}
            </section>

            <section className="panel" id="catalogue" aria-labelledby="cat-h">
              <h2 id="cat-h">Investigations in this reviewed bank</h2>
              {catalog && <p className="hint">{catalog.counts.investigations} investigations · {Object.entries(catalog.counts.findingsByKind).map(([k, n]) => `${n} ${k.replace(/_/g, ' ')}`).join(' · ')} · {catalog.counts.objectives} objectives (counted separately) · {catalog.counts.sources} sources. {catalog.manifest.reviewStatement}</p>}
              <div className="scroll-x"><table className="inv-table">
                <thead><tr><th scope="col">Investigation</th><th scope="col">Areas</th><th scope="col">Depth in this release</th><th scope="col"><span className="visually-hidden">Open</span></th></tr></thead>
                <tbody>{catalog?.investigations.map((i) => (
                  <tr key={i.id}><td><strong>{i.displayName}</strong><br /><span className="hint">{i.summary}</span></td>
                    <td>{i.safetyAreas.map(cap).join(', ')}</td>
                    <td><span className={`badge ${i.coverage === 'profile_only' ? 'warn' : 'ok'}`}>{i.coverage === 'profile_only' ? 'Objectives only' : i.coverage === 'structured_observations' ? 'Findings + source values' : 'Reviewed findings'}</span><br /><span className="hint">{i.depthNote}</span></td>
                    <td><button className="linkbtn" onClick={(e) => openInspector({ kind: 'investigation', id: i.id }, e.currentTarget)}>Open profile</button></td></tr>))}</tbody>
              </table></div>
            </section>
            {inspect?.kind === 'investigation' && catalog && <InvestigationProfile catalog={catalog} id={inspect.id} onClose={closeInspector} headingRef={drawerHeading} />}
          </>)}

        {visited.includes('conditions') && <div hidden={tab !== 'conditions'}><Conditions key={`conditions-${restoreRevision}-${viewRevisions.conditions}`} initialSelection={restoredSelections.find((s) => s.kind === 'conditions')} onBrief={(s) => prepareBrief('prevention', s)} /></div>}
        {visited.includes('detectors') && <div hidden={tab !== 'detectors'}><div className="row detector-modes" aria-label="Smoke lab view"><button className="btn" aria-pressed={detectorMode === 'single'} onClick={() => setDetectorMode('single')}>Single-channel readings</button><button className="btn" aria-pressed={detectorMode === 'paired'} onClick={() => setDetectorMode('paired')}>Paired cohort audit</button><button className="btn" aria-pressed={detectorMode === 'range'} onClick={() => setDetectorMode('range')}>Cutoff-range audit</button></div>
          <div hidden={detectorMode !== 'single'}><DetectorLab key={`detector-${restoreRevision}-${viewRevisions.detector}`} initialSelection={restoredSelections.find((s) => s.kind === 'detector')} onBrief={(s) => prepareBrief('detection', s)} /></div>
          <div hidden={detectorMode !== 'paired'}><PairedDetector key={`paired-${restoreRevision}-${viewRevisions.detector_pair}`} initialSelection={restoredSelections.find((s) => s.kind === 'detector_pair')} onBrief={(s) => prepareBrief('detection', s)} onRange={openCutoffRange} /></div>
          <div hidden={detectorMode !== 'range'}><CutoffEnvelope key={`range-${restoreRevision}-${viewRevisions.cutoff_envelope}`} initialSelection={restoredSelections.find((s) => s.kind === 'cutoff_envelope')} onBrief={(s) => prepareBrief('detection', s)} /></div>
        </div>}

        {tab === 'analysis' && (
          !shown ? <section className="panel"><h2>No assessment yet</h2><p>Ask a question in Explore and confirm it to see a result.</p></section> :
          <div className="layout">
            <div>
              {recomputedHistory && <p className="notice info">Saved assessment recipes were recomputed against the current sources and methods. Original result bytes remain in your separately exported assessment files.</p>}
              <AssessmentView a={shown} historical={!!viewing} showAll={showAll} setShowAll={setShowAll}
                onInspect={(id, el) => openInspector({ kind: 'claim', id }, el)} onExport={exportAs}
                onRevise={() => setTab('explore')} />
              {history.length > 0 && (
                <section className="panel" aria-labelledby="hist-h">
                  <h2 id="hist-h">History</h2>
                  <ul>{[current!, ...history].map((h) => (
                    <li key={h.id}><button className="linkbtn" onClick={() => setViewing(h.id === current!.id ? null : h)}>{h.id}</button> — {h.request.originalText.slice(0, 90) || h.request.proposal.intent}{h.id === current!.id ? ' (current)' : ' (historical)'}</li>))}</ul>
                </section>)}
            </div>
            <aside className="drawer" aria-label="Evidence inspector">
              {inspect?.kind === 'claim' ? <EvidenceDrawer a={shown} claimId={inspect.id} onClose={closeInspector} headingRef={drawerHeading} />
                : <section className="panel"><h2>Evidence inspector</h2><p className="hint">Choose “Inspect evidence” on any result to see the exact source, locator, the source’s own words beside IGNIS wording, and its review and access level.</p></section>}
            </aside>
          </div>)}

        {tab === 'data' && <DataMethods />}
        {tab === 'about' && <About catalog={catalog} health={health} />}
      </main>
      <footer className="footer"><strong>IGNIS / Emberfall</strong><span>Publications are linked; curated source metadata and readings are exportable. Assistant-checked, with no independent human review. Research exploration does not establish a safe atmosphere or certified detector performance.</span><a href="/api/evidence" target="_blank" rel="noreferrer">Evidence API ↗</a></footer>
    </>
  );
}

function AssessmentView({ a, historical, showAll, setShowAll, onInspect, onExport, onRevise }: {
  a: Assessment; historical: boolean; showAll: boolean; setShowAll: (b: boolean) => void;
  onInspect: (id: string, el: HTMLElement) => void; onExport: (k: 'md' | 'json') => void; onRevise: () => void;
}) {
  const contracts = a.claims.filter((c) => c.kind === 'contract');
  const findings = a.claims.filter((c) => c.kind === 'source_finding');
  const p = a.request.proposal;
  return (
    <>
      <section className="panel" aria-labelledby="res-h">
        {historical && <div className="notice warn">Historical assessment, kept for comparison. It is not the current result.</div>}
        <h2 id="res-h">{p.intent === 'assess_physical_model' ? 'Model assessment' : p.intent === 'request_execution' ? 'Requested action' : 'Research brief'}</h2>
        <p><strong>Question:</strong> {a.request.originalText || '(structured request)'}</p>
        <p className="hint">Assessment <span className="num">{a.id}</span> · catalogue {a.catalogRevision} · {a.aiUse}</p>
        <div className="row">
          <button className="btn" onClick={onRevise}>Revise question</button>
          <button className="btn" onClick={() => onExport('md')}>Export Markdown</button>
          <button className="btn" onClick={() => onExport('json')}>Export JSON</button>
        </div>
        {a.handling.handling !== 'ready' && (
          <div className={`notice ${a.handling.handling === 'unsupported_action' ? 'err' : 'warn'}`} role="status">
            <strong>{a.handling.handling === 'unsupported_action' ? 'Action not available' : 'Needs clarification'}:</strong> {a.handling.reasons.join(' ')}
            {p.requestedExecutionText && <p>Your request, kept as written: “{p.requestedExecutionText}”</p>}
          </div>)}
        {a.handling.handling === 'ready' && a.handling.reasons.length > 0 && <div className="notice info">{a.handling.reasons.join(' ')}</div>}
      </section>

      <SelectedAnalyses analyses={a.researchAnalyses ?? []} />

      {contracts.length > 0 && (
        <section className="panel" aria-labelledby="an-h">
          <h2 id="an-h">Useful result</h2>
          {contracts.map((c) => <ClaimCard key={c.id} c={c} onInspect={onInspect} />)}
          {a.derivations.length > 0 && <>
            <h3>Calculations from published values</h3>
            <div className="scroll-x"><table className="calc"><thead><tr><th scope="col">Calculation</th><th scope="col">Expression</th><th scope="col">Result</th><th scope="col">Status</th></tr></thead>
              <tbody>{a.derivations.map((d) => <tr key={d.id}><td>{d.label}</td><td className="num">{d.expression}</td><td className="num">{d.displayText}</td><td>{d.executionKind.replace(/_/g, ' ')}</td></tr>)}</tbody></table></div>
            <p className="hint">Source arithmetic on rounded published numbers; not measurement uncertainty, not a model run.</p></>}
        </section>)}

      {a.revisionDifference && (
        <section className="panel" aria-labelledby="diff-h">
          <h2 id="diff-h">What changed</h2>
          <p><strong>Changed premise:</strong> {a.revisionDifference.witnesses[0]?.premise ?? a.revisionDifference.changedFields.join(', ')}</p>
          <p>{a.revisionDifference.note}</p>
          <ul className="diff">{a.revisionDifference.witnesses.map((w, i) => (
            <li key={i}><strong>{w.affectedRef.id}</strong> — {w.assumption}<br /><span className="hint">Before:</span> {w.previousConclusion.split(': ')[0]} · <span className="hint">Now:</span> {w.newConclusion.split(': ')[0]}
              <details><summary>Read full before and after for {w.affectedRef.id}</summary><dl><dt>Before</dt><dd>{w.previousConclusion}</dd><dt>Now</dt><dd>{w.newConclusion}</dd></dl></details>
            </li>))}</ul>
          <p className="hint">{a.revisionDifference.unchangedClaimIds.length} claims unchanged. Previous assessment {a.parentAssessmentId} is preserved in History. Expand a witness above to inspect its full wording; both exports retain it.</p>
        </section>)}

      {findings.length > 0 && (
        <section className="panel" aria-labelledby="br-h">
          <h2 id="br-h">{contracts.length ? 'Supporting source findings' : 'Findings by safety area'}</h2>
          {a.requestedAreas.map((area) => {
            const home = (c: ClaimResult) => a.requestedAreas.find((x) => c.safetyAreas.includes(x));
            const list = findings.filter((c) => home(c) === area && (showAll || c.presentation === 'lead'));
            const total = findings.filter((c) => home(c) === area).length;
            if (!total) return null;
            return (<div key={area}><h3>{cap(area)}</h3>{list.map((c) => <ClaimCard key={c.id} c={c} onInspect={onInspect} />)}
              {!showAll && total > list.length && <p className="hint">{total - list.length} more reviewed finding(s) or qualification(s) in this area.</p>}</div>);
          })}
          <button className="btn" onClick={() => setShowAll(!showAll)}>{showAll ? 'Show leading findings only' : 'Show all reviewed findings'}</button>
        </section>)}

      <section className="panel" aria-labelledby="rank-h">
        <h2 id="rank-h">Investigations ranked for this question</h2>
        <div className="scroll-x"><table className="inv-table">
          <thead><tr><th scope="col">Group</th><th scope="col">Investigation</th><th scope="col">Why</th></tr></thead>
          <tbody>{a.ranking.map((r) => <tr key={r.investigationId}><td className="num">{r.rankGroup}</td><td>{r.displayName}<br /><span className="hint">{r.coverage.replace(/_/g, ' ')}</span></td><td>{[...r.humanReasons, ...r.unknownConditions].join(' ')}</td></tr>)}</tbody>
        </table></div>
        <p className="hint">Groups follow a transparent product policy (1 = selected … 5 = objectives only). Equal groups are not ranked against each other; this is not a risk or truth score.</p>
      </section>

      <section className="panel" aria-labelledby="lim-h">
        <h2 id="lim-h">Readiness and limits</h2>
        <p>Assets: {a.readiness.assets.map((x) => `${x.ref.id} ${x.state.replace(/_/g, ' ')}`).join('; ') || 'none required'} · replay {a.readiness.replay.replace(/_/g, ' ')} · numerical verification {a.readiness.numericalVerification.replace(/_/g, ' ')}</p>
        <ul>{a.limitations.map((l) => <li key={l}>{l}</li>)}</ul>
        <p className="hint">Checksum {a.payloadSha256.slice(0, 16)}… (checksum, not a signature). Scientific gaps are not application errors.</p>
      </section>
    </>
  );
}

function ClaimCard({ c, onInspect }: { c: ClaimResult; onInspect: (id: string, el: HTMLElement) => void }) {
  return (
    <article className="claim" aria-label={c.title}>
      <h4>{c.title}</h4>
      <div className="badges">
        {outcomeBadge(c)}
        <span className="badge">{routeLabel(c)}</span>
        <span className="badge">{c.executionKind === 'source_description' ? 'Source-reported' : c.executionKind === 'source_arithmetic' ? 'IGNIS calculation on source values' : 'Specification only'}</span>
        <span className="badge">{c.reviewLevel === 'assistant_checked' ? 'Assistant-checked' : c.reviewLevel}</span>
      </div>
      <p>{c.kind === 'source_finding' && <span className="hint">IGNIS wording: </span>}{c.authoritativeText}</p>
      {c.sourceFindingText && <p className="quote">Source: “{c.sourceFindingText}”</p>}
      {c.missingRequirements.length > 0 && <><strong>Still needed:</strong><ul className="quals">{c.missingRequirements.map((m) => <li key={m}>{m}</li>)}</ul></>}
      {c.forbiddenStrongerClaims.length > 0 && <><strong>Does not establish:</strong><ul className="quals">{c.forbiddenStrongerClaims.map((m) => <li key={m}>{m}</li>)}</ul></>}
      {c.qualifications.length > 0 && <ul className="quals">{c.qualifications.map((q) => <li key={q}>{q}</li>)}</ul>}
      <button className="linkbtn" onClick={(e) => onInspect(c.id, e.currentTarget)}>Inspect evidence</button>
    </article>
  );
}

type Snap = { sources: CatalogView['sources'][number][]; assertions: { id: string; statement: string; kind: string; review: { level: string; scope: string; method: string }; sourceLocators: { source: { id: string }; pdfPage: number | null; printedPage: string | null; section: string | null; tableOrFigure: string | null; rowOrCell: string | null; textAnchor: string | null }[] }[]; findings: { id: string; assertionRef: { id: string }; domain: { description: string; representation: string } }[] };

function EvidenceDrawer({ a, claimId, onClose, headingRef }: { a: Assessment; claimId: string; onClose: () => void; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  const c = a.claims.find((x) => x.id === claimId);
  const snap = a.evidenceSnapshot as unknown as Snap;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  if (!c) return null;
  const finding = c.findingRef ? snap.findings.find((f) => f.id === c.findingRef!.id) : undefined;
  const assertion = finding ? snap.assertions.find((x) => x.id === finding.assertionRef.id) : undefined;
  const sourceIds = assertion ? [...new Set(assertion.sourceLocators.map((l) => l.source.id))] : [];
  return (
    <section className="panel" aria-labelledby="ev-h">
      <h2 id="ev-h" tabIndex={-1} ref={headingRef}>Evidence</h2>
      <p><strong>{c.title}</strong></p>
      {assertion && <dl>
        <dt>Source statement</dt><dd className="quote">“{assertion.statement}”</dd>
        <dt>IGNIS wording (our inference)</dt><dd>{c.authoritativeText}</dd>
        <dt>Evidence kind</dt><dd>{assertion.kind.replace(/_/g, ' ')}</dd>
        {finding && <><dt>Tested conditions / domain</dt><dd>{finding.domain.description} <span className="hint">({finding.domain.representation.replace(/_/g, ' ')})</span></dd></>}
        <dt>Locators</dt><dd><ul className="quals">{assertion.sourceLocators.map((l, i) => <li key={i}>{l.source.id}{l.pdfPage ? `, PDF p.${l.pdfPage}` : ''}{l.tableOrFigure ? `, ${l.tableOrFigure}` : ''}{l.rowOrCell ? ` (${l.rowOrCell})` : ''}{l.section ? `, ${l.section}` : ''}{l.textAnchor ? ` — “${l.textAnchor}”` : ''}</li>)}</ul></dd>
        <dt>Review</dt><dd>{assertion.review.level.replace(/_/g, ' ')} — {assertion.review.scope}; {assertion.review.method}</dd>
      </dl>}
      {c.kind === 'contract' && <dl>
        <dt>Checks applied</dt><dd><ul className="quals">{c.predicateResults.map((r) => <li key={r.predicateId}><strong>{r.truth}</strong> — {r.description}. {r.reason}</li>)}</ul></dd>
        <dt>Records consumed</dt><dd className="hint">{c.consumedRefs.map((r) => r.id).join(', ')}</dd>
      </dl>}
      {sourceIds.map((id) => { const s = snap.sources.find((x) => x.id === id); return s ? (
        <div key={id} className="claim"><strong>{s.title}</strong><br /><span className="hint">{s.publicationDate ?? 'date not stated'} · access: {s.access.replace(/_/g, ' ')}{s.observedSha256 ? ` · SHA-256 ${s.observedSha256.slice(0, 12)}…` : ''}</span><br />
          <a href={s.canonicalUri} target="_blank" rel="noopener noreferrer">Open original</a></div>) : null; })}
      <button className="btn" onClick={onClose}>Close inspector</button>
    </section>
  );
}

function InvestigationProfile({ catalog, id, onClose, headingRef }: { catalog: CatalogView; id: string; onClose: () => void; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  const i = catalog.investigations.find((x) => x.id === id)!;
  const fs = catalog.findings.filter((f) => i.findingIds.includes(f.id));
  return (
    <section className="panel" aria-labelledby="prof-h">
      <h2 id="prof-h" tabIndex={-1} ref={headingRef}>{i.displayName}</h2>
      <p>{i.summary}</p><p className="hint">{i.depthNote}</p>
      <h3>Objectives (not results)</h3>
      <ul>{i.objectives.map((o) => <li key={o.id}>“{o.statement}” <span className="hint">— {o.sourceLocators.map((l) => l.source.id).join(', ')}</span></li>)}</ul>
      <h3>Reviewed findings</h3>
      {fs.length ? <ul>{fs.map((f) => <li key={f.id}>{f.title}</li>)}</ul> : <p className="hint">None in this reviewed bank (not a statement that none exist).</p>}
      <button className="btn" onClick={onClose}>Close profile</button>
    </section>
  );
}

function About({ catalog, health }: { catalog: CatalogView | null; health: Health | null }) {
  return (
    <section className="panel" aria-labelledby="about-h">
      <h2 id="about-h">About this prototype</h2>
      <p>IGNIS helps researchers find NASA fire-safety evidence, see what each finding supports for a particular question, and revise an analysis without losing its physical assumptions or history.</p>
      <h3>How answers are produced</h3>
      <p>Research briefs and model assessments use a deterministic engine over a reviewed registry. Source findings have locators; IGNIS wording is labelled. Model calculations use exact arithmetic on printed values. Model assessments apply generic contracts (additive alignment T1, source normalization T2, quantity compatibility T4) bound to records.</p>
      <h3>Three source collections</h3>
      <p>The atlas covers 24 NASA PSI profiles and 22 acquired CSV inventories. Conditions compares seven Saffire atmosphere cases within four material and burning-side cohorts. Smoke lab exposes 154 stored workbook rows, with 20 reference rows excluded by default. Each collection preserves its own source version, hashes and limits; the ten-investigation brief registry is a separate selection.</p>
      <p>The condition frontier orders documented gaps. The detector cutoff counts finite stored readings. Neither calculation establishes physical equivalence, safety, or certified detector performance. <a href="/api/evidence" target="_blank" rel="noreferrer">Explore the read-only evidence API</a> or <a href="/briefing.html" target="_blank" rel="noreferrer">open the seven-slide project briefing</a>.</p>
      <h3>AI use</h3>
      <p>Live AI interpretation: <strong>{health?.aiAvailable ? 'ready' : 'unavailable'}</strong>. {health?.aiReason} The structured form gives the same assessment without AI. Claude Code and OpenAI Codex assisted research, curation, design, code, tests and presentation. Specialist agents are software tools, not independent reviewers. Pre-event research and design were reused under the owner’s instruction; that is not an organizer eligibility ruling.</p>
      <h3>Coverage and gaps</h3>
      <p>{catalog?.manifest.reviewStatement}</p>
      <ul>{catalog?.manifest.unacquiredSources.map((u) => <li key={u.label}><strong>{u.label}:</strong> {u.observation}. {u.effect}.</li>)}</ul>
      <p className="hint">Not implemented in this release: {catalog?.manifest.omittedOptionalModules.join('; ')}.</p>
      <h3>Sources</h3>
      <ul>{catalog?.sources.map((s) => <li key={s.id}><a href={s.canonicalUri} target="_blank" rel="noopener noreferrer">{s.title}</a> <span className="hint">({s.access.replace(/_/g, ' ')})</span></li>)}</ul>
      <p className="hint">Build {health?.buildRevision} · catalogue {catalog?.revision}. Not affiliated with or endorsed by NASA.</p>
    </section>
  );
}
