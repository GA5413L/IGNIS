'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Assessment, ClaimResult } from '../core/assess';
import { exportJson, exportMarkdown, outcomeLabel, routeLabel } from '../core/export';
import { selectionLabel } from '../core/researchSelections';
import type { FormChoices } from '../core/interpretation';
import type { RequestedClaim, SafetyArea, TemporalScope } from '../core/schemas';
import type { Shared } from './Dashboard';
import { AREAS, AREA_LABEL, download, plural, postAssess } from './lib';

const CLAIMS: { id: RequestedClaim; label: string }[] = [
  { id: 'conditional_response', label: 'Response, given the fire source the model was fed' },
  { id: 'independent_prediction', label: 'Independent prediction' },
  { id: 'comparison', label: 'Comparison with measurements' },
  { id: 'description', label: 'Description of what was reported' },
  { id: 'transfer', label: 'Transfer to another setting' },
];
const SCOPES: { id: TemporalScope; label: string }[] = [
  { id: 'unspecified', label: 'Not specified' }, { id: 'initial', label: 'Start of the burn' },
  { id: 'subsequent', label: 'After the start' }, { id: 'whole_record', label: 'Whole record' },
];
interface ModelForm { model: string; event: string; quantity: string; claim: RequestedClaim; scope: TemporalScope }
const WORKED: { label: string; form: ModelForm }[] = [
  { label: 'Later CO₂ response, Saffire VI', form: { model: 'PM-SVI25', event: 'EV-SVI-6', quantity: 'Q-CO2-REMOTE-CONC', claim: 'conditional_response', scope: 'subsequent' } },
  { label: 'Total CO₂ prediction, Saffire V', form: { model: 'PM-SV24', event: '', quantity: 'Q-CO2-SOURCE-TOTAL', claim: 'independent_prediction', scope: 'unspecified' } },
  { label: 'Chemical heat release, Saffire VI', form: { model: 'PM-SVI25', event: 'EV-SVI-6', quantity: 'Q-HEAT-CHEMICAL-RELEASE', claim: 'independent_prediction', scope: 'unspecified' } },
];
const outcomeClass = (claim: ClaimResult) => claim.outcome === 'specified_conditional_comparison' ? 'yes'
  : claim.outcome === 'descriptive_consistency_check' ? 'partial' : claim.outcome ? 'no' : '';
const TRUTH: Record<string, string> = { satisfied: 'Met', violated: 'Not met', unknown: 'Unknown' };

export default function Findings({ shared }: { shared: Shared }) {
  const { catalog, brief, selections, detach, notify, record, focus } = shared;
  const [areas, setAreas] = useState<SafetyArea[]>(focus.area ? [focus.area] : []);
  const [fetched, setFetched] = useState<{ key: string; data: Assessment | null; error: string | null }>({ key: '', data: null, error: null });
  const [form, setForm] = useState<ModelForm>(WORKED[0].form);
  const [model, setModel] = useState<Assessment | null>(null);
  const [modelError, setModelError] = useState<string | null>(null);
  const [modelBusy, setModelBusy] = useState(false);
  const [tab, setTab] = useState<'brief' | 'model'>('brief');

  const custom = areas.length > 0 || selections.length > 0;
  const key = `${areas.join(',')}|${JSON.stringify(selections)}`;
  useEffect(() => {
    if (!catalog || !custom) return;
    let live = true;
    postAssess({ intent: 'synthesize_findings', safetyAreas: areas }, `Fire-safety brief: ${areas.length ? areas.join(', ') : 'all areas'}`, catalog.revision, { selections })
      .then((data) => { if (live) setFetched({ key, data, error: null }); })
      .catch((error: Error) => { if (live) setFetched((previous) => ({ key, data: previous.data, error: error.message })); });
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalog, key]);
  const busy = custom && fetched.key !== key;
  const briefError = custom && fetched.key === key ? fetched.error : null;

  const current = custom ? (fetched.key === key && !fetched.error ? fetched.data : null) : brief;
  const sourceOf = useMemo(() => new Map((catalog?.sources ?? []).map((source) => [source.id, source])), [catalog]);
  const findings = current?.claims.filter((claim) => claim.kind === 'source_finding') ?? [];
  const ordered = [...findings.filter((claim) => claim.route !== 'context'), ...findings.filter((claim) => claim.route === 'context')];
  const toggle = (area: SafetyArea) => setAreas((list) => list.includes(area) ? list.filter((item) => item !== area) : [...list, area]);
  const save = (assessment: Assessment, kind: 'md' | 'json') => {
    try { download(`ignis-${assessment.id}.${kind}`, kind === 'md' ? exportMarkdown(assessment) : exportJson(assessment), kind === 'md' ? 'text/markdown' : 'application/json'); }
    catch (error) { notify(error instanceof Error ? error.message : 'The export failed its integrity check.'); }
  };

  const modelEntry = catalog?.models.find((item) => item.id === form.model);
  const events = catalog?.events.filter((item) => item.investigationId === modelEntry?.investigationId) ?? [];
  const runModel = async () => {
    if (!catalog) return;
    setModelBusy(true); setModelError(null);
    const choices: FormChoices = { intent: 'assess_physical_model', physicalModelId: form.model, eventIds: form.event ? [form.event] : [], quantityIds: [form.quantity],
      requestedClaim: form.claim, temporalScope: form.scope, requestedFeature: form.claim === 'conditional_response' ? 'change' : 'unspecified' };
    const quantity = catalog.quantities.find((item) => item.id === form.quantity)?.displayName ?? form.quantity;
    try {
      const parent = model && shared.history.some((a) => a.id === model.id) ? model : null;
      const next = await postAssess(choices, `Can ${modelEntry?.displayName ?? form.model} support a ${form.claim.replace(/_/g, ' ')} claim about ${quantity}?`, catalog.revision, { parent, selections });
      record(next); setModel(next);
    } catch (error) { setModelError(error instanceof Error ? error.message : 'The assessment could not be run.'); }
    finally { setModelBusy(false); }
  };
  const contracts = model?.claims.filter((claim) => claim.kind === 'contract') ?? [];

  return (
    <div className="page">
      <header className="page-head">
        <span className="crumb">05 · Findings</span>
        <h1>Reviewed findings and what a model can claim</h1>
        <p>Each finding is tied to its source wording, with its limits attached. Below, test whether a published fire model supports a specific claim.</p>
      </header>

      <div className="seg" role="tablist" aria-label="Findings sections" style={{ justifySelf: 'start' }}>
        <button type="button" role="tab" aria-selected={tab === 'brief'} onClick={() => setTab('brief')}>Fire-safety brief</button>
        <button type="button" role="tab" aria-selected={tab === 'model'} onClick={() => setTab('model')}>Model claim check</button>
      </div>

      {tab === 'brief' && <section className="section" aria-labelledby="brief-title">
        <div className="section-head">
          <h2 id="brief-title">Fire-safety brief</h2>
          <div className="chips" role="group" aria-label="Filter findings by area">
            <button type="button" className="chip" aria-pressed={areas.length === 0} onClick={() => setAreas([])}>All areas</button>
            {AREAS.map((area) => <button key={area} type="button" className="chip" aria-pressed={areas.includes(area)} onClick={() => toggle(area)}>{AREA_LABEL[area]}</button>)}
          </div>
        </div>
        {selections.length > 0 && (
          <div className="card flat">
            <h3>Analyses attached to this brief</h3>
            <ul className="stack">{selections.map((selection) => (
              <li key={selection.kind} className="row between"><span>{selectionLabel(selection)}</span>
                <button type="button" className="btn ghost small" onClick={() => detach(selection.kind)}>Remove analysis</button></li>
            ))}</ul>
            {current?.researchAnalyses?.map((analysis) => (
              <details key={analysis.id}><summary>{analysis.title}</summary>
                <div className="details-body"><ul className="bullets">{analysis.summary.map((line) => <li key={line}>{line}</li>)}</ul>
                  <p className="muted">Descriptive context only. It does not validate any model.</p></div></details>
            ))}
          </div>
        )}
        {briefError && <p className="error" role="alert">{briefError}</p>}
        <div className="row between">
          <p className="muted" aria-live="polite">{current ? `${plural(ordered.length, 'finding')}${busy ? ', updating\u2026' : ''}` : 'Loading findings\u2026'}</p>
          {current && <div className="btn-row">
            <button type="button" className="btn ghost small" onClick={() => { try { record(current); notify('Brief saved to the notebook in Sources.'); } catch (error) { notify((error as Error).message); } }}>Save brief to notebook</button>
            <button type="button" className="btn ghost small" onClick={() => save(current, 'md')}>Download brief as Markdown</button>
            <button type="button" className="btn ghost small" onClick={() => save(current, 'json')}>Download brief as JSON</button>
          </div>}
        </div>
        {!current && !shared.loadError && <div className="stack" aria-busy="true">{[0, 1, 2].map((item) => <div key={item} className="skeleton" style={{ height: 96 }} />)}</div>}
        {shared.loadError && <p className="error" role="alert">{shared.loadError}</p>}
        <div className="claims">
          {ordered.map((claim) => (
            <article key={claim.id} className={`claim${claim.presentation === 'lead' ? ' lead' : ''}`}>
              <div className="row">
                {claim.safetyAreas.map((area) => <span key={area} className={`tag area-${area}`}>{AREA_LABEL[area]}</span>)}
                <span className="tag outline">{claim.route === 'context' ? 'Background, not a result' : claim.evidenceKind === 'published_model_result' ? 'Published model result' : claim.evidenceKind === 'derived_calculation' ? 'Calculation from source values' : 'Observed result'}</span>
              </div>
              <h3>{claim.title}</h3>
              <p>{claim.authoritativeText}</p>
              <details><summary>NASA source wording{claim.qualifications.length ? ` and ${plural(claim.qualifications.length, 'limit')}` : ''}</summary>
                <div className="details-body">
                  {claim.sourceFindingText && <blockquote>{claim.sourceFindingText}</blockquote>}
                  {claim.qualifications.length > 0 && <ul className="bullets">{claim.qualifications.map((line) => <li key={line}>{line}</li>)}</ul>}
                </div></details>
              <div className="card-foot">{claim.sourceIds.map((id) => {
                const source = sourceOf.get(id);
                return source?.canonicalUri ? <a key={id} href={source.canonicalUri} target="_blank" rel="noreferrer">{source.title}</a> : <span key={id}>{source?.title ?? id}</span>;
              })}<span>{routeLabel(claim)}</span></div>
            </article>
          ))}
        </div>
      </section>}

      {tab === 'model' && <section className="section" aria-labelledby="model-title">
        <div className="section-head">
          <h2 id="model-title">Model claim check</h2>
          <p>Choose a published Saffire cabin model, a quantity and a claim. Inspect the supporting evidence and any missing requirements.</p>
        </div>
        <div className="chips" role="group" aria-label="Worked questions">
          {WORKED.map((item) => <button key={item.label} type="button" className="chip" aria-pressed={JSON.stringify(item.form) === JSON.stringify(form)} onClick={() => setForm(item.form)}>{item.label}</button>)}
        </div>
        <form className="fields" onSubmit={(event) => { event.preventDefault(); void runModel(); }}>
          <label className="field"><span>Published model</span>
            <select value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value, event: '' })}>
              {catalog?.models.map((item) => <option key={item.id} value={item.id}>{item.displayName}</option>)}
            </select></label>
          <label className="field"><span>Burn event</span>
            <select value={form.event} onChange={(event) => setForm({ ...form, event: event.target.value })}>
              <option value="">Any event</option>
              {events.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select></label>
          <label className="field"><span>Quantity</span>
            <select value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })}>
              {catalog?.quantities.map((item) => <option key={item.id} value={item.id}>{item.displayName}</option>)}
            </select></label>
          <label className="field"><span>Claim you want to make</span>
            <select value={form.claim} onChange={(event) => setForm({ ...form, claim: event.target.value as RequestedClaim })}>
              {CLAIMS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select></label>
          <label className="field"><span>Part of the burn</span>
            <select value={form.scope} onChange={(event) => setForm({ ...form, scope: event.target.value as TemporalScope })}>
              {SCOPES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select></label>
          <button type="submit" className="btn" disabled={!catalog || modelBusy}>{modelBusy ? 'Checking the claim\u2026' : model ? 'Check the revised claim' : 'Check this claim'}</button>
        </form>
        {modelError && <p className="error" role="alert">{modelError}</p>}
        {!model && !modelError && <div className="empty">Choose a worked question or set the fields, then check the claim. The result shows what is supported, what is missing and what must not be claimed.</div>}
        {model && (
          <div className="stack" aria-live="polite">
            {model.revisionDifference && (
              <div className="card flat">
                <h3>What changed from your previous question</h3>
                <p>{model.revisionDifference.note}</p>
                {model.revisionDifference.witnesses.map((witness) => (
                  <dl className="kv" key={witness.affectedRef.id}><dt>Before</dt><dd>{witness.previousConclusion}</dd><dt>Now</dt><dd>{witness.newConclusion}</dd><dt>Because</dt><dd>{witness.premise}</dd></dl>
                ))}
              </div>
            )}
            {contracts.length === 0 && <div className="card"><h3>No reviewed rule covers this combination</h3><ul className="bullets">{model.handling.reasons.map((line) => <li key={line}>{line}</li>)}</ul></div>}
            <ol className="path" aria-label="How this claim was checked">
              <li><small>Model</small><span>{catalog?.models.find((item) => item.id === model.request.proposal.physicalModelId)?.displayName.split(' (')[0] ?? 'None'}</span></li>
              <li><small>Quantity</small><span>{model.request.proposal.quantityIds.map((id) => catalog?.quantities.find((item) => item.id === id)?.displayName ?? id).join(', ')}</span></li>
              <li><small>Claim</small><span>{CLAIMS.find((item) => item.id === model.request.proposal.requestedClaim)?.label ?? model.request.proposal.requestedClaim}</span></li>
              <li><small>Requirements</small><span>{contracts.length ? `${contracts.flatMap((claim) => claim.predicateResults).filter((check) => check.truth === 'satisfied').length} of ${contracts.flatMap((claim) => claim.predicateResults).length} met` : 'No rule applies'}</span></li>
              <li className="end"><small>Outcome</small><span>{contracts.length ? contracts.map((claim) => outcomeLabel(claim)).join('; ') : 'Not assessed'}</span></li>
            </ol>
            {contracts.map((claim) => (
              <article key={claim.id} className="claim lead">
                <span className={`outcome ${outcomeClass(claim)}`}>{outcomeLabel(claim)}</span>
                <h3>{claim.title}</h3>
                <p>{claim.authoritativeText}</p>
                {claim.predicateResults.length > 0 && <div className="stack"><h4>Requirements checked</h4>
                  <ul className="checks">{claim.predicateResults.map((check) => (
                    <li key={check.predicateId}><span className={`mono t-${check.truth}`}>{TRUTH[check.truth] ?? check.truth}</span><span>{check.description}. <span className="muted">{check.reason}</span></span></li>
                  ))}</ul></div>}
                {model.derivations.filter((item) => claim.derivationIds.includes(item.id)).map((item) => (
                  <dl className="kv" key={item.id}><dt>{item.label}</dt><dd><span className="mono">{item.expression}</span><br />{item.displayText}</dd></dl>
                ))}
                {claim.forbiddenStrongerClaims.length > 0 && <div className="limit"><b>Do not claim</b><ul>{claim.forbiddenStrongerClaims.map((line) => <li key={line}>{line}</li>)}</ul></div>}
              </article>
            ))}
            <div className="btn-row">
              <button type="button" className="btn ghost" onClick={() => save(model, 'md')}>Download assessment as Markdown</button>
              <button type="button" className="btn ghost" onClick={() => save(model, 'json')}>Download assessment as JSON</button>
              <button type="button" className="btn ghost" onClick={() => { setModel(null); setModelError(null); }}>Start a new question</button>
            </div>

          </div>
        )}
      </section>}
    </div>
  );
}
