'use client';

import { useEffect, useMemo, useState } from 'react';
import atlas from '../../data/investigation-atlas.json';
import type { ClaimResult } from '../core/assess';
import { conditionDataset } from '../core/conditions';
import { analyzeCutoffEnvelope } from '../core/cutoffEnvelope';
import { detectorDataset } from '../core/detector';
import { outcomeLabel } from '../core/export';
import { analyzePairedDetector } from '../core/pairedDetector';
import type { Shared } from './Dashboard';
import Flame, { type FlameLook } from './Flame';
import FlowMap, { BOTTOM, STAGES, TOP, VH, type FlowEdge, type FlowNode } from './FlowMap';
import { AREA_LABEL, MOON_RANGE, inMoonRange, postAssess, psi, signedInt } from './lib';
import { AtmosphereChart, IntervalChart } from './charts';

type QuestionId = 'find' | 'prevention' | 'detection' | 'suppression' | 'modelling';
const QUESTIONS: { id: QuestionId; tag: string; label: string }[] = [
  { id: 'find', tag: 'Relevance', label: 'Which investigations matter for crew fire safety?' },
  { id: 'prevention', tag: 'Prevention', label: 'Which burns match my cabin atmosphere?' },
  { id: 'detection', tag: 'Detection', label: 'Do detector readings agree across flights?' },
  { id: 'suppression', tag: 'Suppression', label: 'Is a flame that looks out really out?' },
  { id: 'modelling', tag: 'Modelling', label: 'What can a published fire model claim?' },
];
const FLAME_MOOD: Record<QuestionId, FlameLook> = {
  find: { x: 0.5, y: 0.5, glow: 0.9, radius: 0.7, warm: 0.5, rings: 0 },
  prevention: { x: 0.5, y: 0.5, glow: 1, radius: 0.8, warm: 0.9, rings: 0 },
  detection: { x: 0.5, y: 0.5, glow: 0.8, radius: 0.68, warm: 0.3, rings: 1 },
  suppression: { x: 0.5, y: 0.5, glow: 0.22, radius: 0.66, warm: 0, rings: 0 },
  modelling: { x: 0.5, y: 0.5, glow: 0.6, radius: 0.66, warm: 0.25, rings: 0 },
};
interface Verdict { label: string; claim: ClaimResult | null }

export default function Overview({ shared }: { shared: Shared }) {
  const { catalog, brief, loadError, go } = shared;
  const [question, setQuestion] = useState<QuestionId>('prevention');
  const [stage, setStage] = useState(4);
  const [playing, setPlaying] = useState(false);
  const [verdicts, setVerdicts] = useState<Verdict[] | null>(null);

  const cases = conditionDataset.cases;
  const inside = cases.filter((item) => inMoonRange(item.oxygenPercent, item.pressureKPa));
  const maxOxygen = Math.max(...cases.map((item) => item.oxygenPercent));
  const paired = useMemo(() => analyzePairedDetector(), []);
  const envelope = useMemo(() => analyzeCutoffEnvelope(), []);
  const sameR = detectorDataset.records.filter((record) => record.flight === '2' && record.materialRole === 'spacecraft_material' && record.channels.issObscurationV.status === 'finite');
  const sameRZero = sameR.filter((record) => record.channels.issObscurationV.value === 0).length;
  const diff = (summary: typeof paired.summary) => `${signedInt(summary.pairedDifference.numerator)}/${summary.pairedDifference.denominator}`;
  const lead = brief?.claims.find((claim) => claim.kind === 'source_finding' && claim.route === 'direct' && claim.safetyAreas.includes('suppression'));

  // The opening run: the path assembles stage by stage, once. It can be replayed or paused.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => { setStage(0); setPlaying(true); }, 500);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => { if (stage >= 4) setPlaying(false); else setStage(stage + 1); }, stage >= 4 ? 0 : 1500);
    return () => window.clearTimeout(timer);
  }, [playing, stage]);

  useEffect(() => {
    if (!catalog) return;
    let live = true;
    const ask = (quantity: string, claim: 'conditional_response' | 'independent_prediction', scope: 'subsequent' | 'unspecified') => postAssess({ intent: 'assess_physical_model', physicalModelId: 'PM-SVI25', eventIds: ['EV-SVI-6'],
      quantityIds: [quantity], requestedClaim: claim, temporalScope: scope, requestedFeature: claim === 'conditional_response' ? 'change' : 'unspecified' }, 'Overview model claim check', catalog.revision)
      .then((assessment) => assessment.claims.find((item) => item.kind === 'contract') ?? null).catch(() => null);
    Promise.all([ask('Q-CO2-REMOTE-CONC', 'conditional_response', 'subsequent'), ask('Q-HEAT-CHEMICAL-RELEASE', 'independent_prediction', 'unspecified')])
      .then(([first, second]) => { if (live) setVerdicts([{ label: 'Later CO₂ response', claim: first }, { label: 'Chemical heat release', claim: second }]); });
    return () => { live = false; };
  }, [catalog]);

  const pick = (id: QuestionId) => { setQuestion(id); setPlaying(false); setStage(4); };
  const replay = () => { setStage(0); setPlaying(true); };

  const flow = useMemo(() => {
    if (!catalog || !brief) return null;
    const ranked = brief.ranking.map((entry, index) => ({ ...entry, rank: index + 1, record: catalog.investigations.find((item) => item.id === entry.investigationId) }));
    const hasFour = cases.some((item) => item.flight === 'IV') && !ranked.some((entry) => entry.displayName === 'Saffire IV');
    const unlinked = atlas.records.filter((record) => record.appInvestigationId === null).length;
    const withModel = new Set(catalog.models.map((model) => model.investigationId));
    const nodes: FlowNode[] = [];
    const edges: FlowEdge[] = [];

    QUESTIONS.forEach((item) => nodes.push({ id: `q:${item.id}`, col: 0, label: item.label, sub: item.tag, hint: `Follow this question through the data`, onSelect: () => pick(item.id), pressed: question === item.id }));
    ranked.forEach((entry) => {
      const id = `inv:${entry.investigationId}`;
      nodes.push({ id, col: 1, label: entry.displayName, value: entry.findingIds.length ? String(entry.findingIds.length) : '–', quiet: entry.findingIds.length === 0,
        hint: `Rank ${entry.rank}. ${entry.findingIds.length} reviewed findings. ${entry.humanReasons.join(' ')}`, onSelect: () => go('investigations', { investigation: entry.investigationId }) });
      edges.push({ from: 'q:find', to: id, weight: 1 });
      (entry.record?.safetyAreas ?? []).forEach((area) => edges.push({ from: `q:${area}`, to: id, weight: 1 }));
      if (withModel.has(entry.investigationId)) { edges.push({ from: 'q:modelling', to: id, weight: 1 }); edges.push({ from: id, to: 'ev:models', weight: 1 }); }
      if (entry.findingIds.length) edges.push({ from: id, to: 'ev:findings', weight: entry.findingIds.length });
      const atmosphere = cases.filter((item) => `Saffire ${item.flight}` === entry.displayName).length;
      if (atmosphere) edges.push({ from: id, to: 'ev:cases', weight: atmosphere });
      const rows = detectorDataset.records.filter((record) => record.flightLabel === entry.displayName).length;
      if (rows) edges.push({ from: id, to: 'ev:rows', weight: rows });
      const profile = atlas.records.find((record) => record.appInvestigationId === entry.investigationId);
      if (profile && profile.experimentalTables.length) edges.push({ from: id, to: 'ev:tables', weight: profile.experimentalTables.reduce((sum, table) => sum + table.dataRecordCount, 0) });
    });
    if (hasFour) {
      nodes.push({ id: 'inv:saffire-iv', col: 1, label: 'Saffire IV', value: '–', quiet: true, hint: 'Two atmosphere cases from the 2026 table. No profile or reviewed finding in this release.', onSelect: () => go('atmospheres') });
      edges.push({ from: 'q:find', to: 'inv:saffire-iv', weight: 1 }, { from: 'q:prevention', to: 'inv:saffire-iv', weight: 1 }, { from: 'inv:saffire-iv', to: 'ev:cases', weight: cases.filter((item) => item.flight === 'IV').length });
    }
    nodes.push({ id: 'inv:catalogue', col: 1, label: `${unlinked} more PSI profiles`, value: '–', quiet: true, hint: 'Catalogue profiles with objectives and data tables but no reviewed finding yet.', onSelect: () => go('investigations') });
    edges.push({ from: 'q:find', to: 'inv:catalogue', weight: 1 }, { from: 'inv:catalogue', to: 'ev:tables', weight: 400 });

    const evidence: [string, string, string, string, () => void][] = [
      ['ev:tables', 'PSI data tables', String(atlas.counts.experimentalCsvFiles), 'Experimental tables published with the NASA records', () => go('investigations')],
      ['ev:cases', 'Atmosphere cases', String(cases.length), conditionDataset.source.title, () => go('atmospheres')],
      ['ev:rows', 'Detector rows', String(detectorDataset.records.length), 'SAME and SAME-R results workbook, Material Sort sheet', () => go('smoke')],
      ['ev:findings', 'Sourced findings', String(catalog.findings.length), 'Each quoted from its source passage, with limits', () => go('findings')],
      ['ev:models', 'Published models', String(catalog.models.length), catalog.models.map((model) => model.displayName).join('; '), () => go('findings')],
    ];
    evidence.forEach(([id, label, value, hint, onSelect]) => nodes.push({ id, col: 2, label, value, hint, onSelect }));
    const tools: [string, string, string, string, () => void][] = [
      ['an:search', 'Investigation search', 'rank, filter, compare', 'Search 24 profiles and compare what two tables record', () => go('investigations')],
      ['an:atmo', 'Atmosphere comparison', 'gap to a target', 'Set target oxygen and pressure; see the nearest cases', () => go('atmospheres')],
      ['an:smoke', 'Smoke lab', 'counts at a cutoff', 'One channel, two channels or a cutoff range', () => go('smoke')],
      ['an:brief', 'Fire-safety brief', 'findings with limits', 'Reviewed findings by safety area', () => go('findings')],
      ['an:model', 'Model claim check', 'rules decide', `${catalog.counts.contracts} reviewed rules`, () => go('findings')],
    ];
    tools.forEach(([id, label, sub, hint, onSelect]) => nodes.push({ id, col: 3, label, sub, hint, onSelect }));
    const supported = verdicts ? verdicts.filter((item) => item.claim?.outcome === 'specified_conditional_comparison').length : null;
    const results: [string, string, string, () => void][] = [
      ['res:search', `${ranked.length} ranked`, `of ${atlas.counts.profiles} profiles`, () => go('investigations')],
      ['res:atmo', `${inside.length} of ${cases.length}`, 'in the Moon Base range', () => go('atmospheres')],
      ['res:smoke', diff(paired.summary), 'pooled; flights disagree', () => go('smoke')],
      ['res:brief', 'Still burning', 'after the flame looks out', () => go('findings', { area: 'suppression' })],
      ['res:model', supported === null ? '…' : `${supported} of ${verdicts!.length}`, 'claims supported', () => go('findings')],
    ];
    results.forEach(([id, value, label, onSelect]) => nodes.push({ id, col: 4, label, value, hint: 'Open this result in its tool', onSelect }));
    edges.push({ from: 'ev:tables', to: 'an:search', weight: 22 }, { from: 'ev:findings', to: 'an:search', weight: 4 }, { from: 'ev:cases', to: 'an:atmo', weight: 7 }, { from: 'ev:rows', to: 'an:smoke', weight: 154 },
      { from: 'ev:findings', to: 'an:brief', weight: 16 }, { from: 'ev:findings', to: 'an:model', weight: 6 }, { from: 'ev:models', to: 'an:model', weight: 2 },
      { from: 'an:search', to: 'res:search', weight: 10 }, { from: 'an:atmo', to: 'res:atmo', weight: 7 }, { from: 'an:smoke', to: 'res:smoke', weight: 133 }, { from: 'an:brief', to: 'res:brief', weight: 16 }, { from: 'an:model', to: 'res:model', weight: 2 });

    const invIds = (test: (entry: (typeof ranked)[number]) => boolean) => ranked.filter(test).map((entry) => `inv:${entry.investigationId}`);
    const lit: Record<QuestionId, string[]> = {
      find: ['q:find', ...nodes.filter((node) => node.col === 1).map((node) => node.id), 'ev:tables', 'ev:findings', 'an:search', 'res:search'],
      prevention: ['q:prevention', ...invIds((entry) => !!entry.record?.safetyAreas.includes('prevention')), 'inv:saffire-iv', 'ev:cases', 'an:atmo', 'res:atmo'],
      detection: ['q:detection', ...invIds((entry) => !!entry.record?.safetyAreas.includes('detection')), 'ev:rows', 'an:smoke', 'res:smoke'],
      suppression: ['q:suppression', ...invIds((entry) => !!entry.record?.safetyAreas.includes('suppression')), 'ev:findings', 'an:brief', 'res:brief'],
      modelling: ['q:modelling', ...invIds((entry) => withModel.has(entry.investigationId)), 'ev:models', 'ev:findings', 'an:model', 'res:model'],
    };
    const count = (area: 'prevention' | 'detection' | 'suppression') => ranked.filter((entry) => entry.record?.safetyAreas.includes(area));
    const names = (list: typeof ranked) => list.map((entry) => entry.displayName).join(', ');
    const deadEnds = (area: 'prevention' | 'detection' | 'suppression', edgeTo: string) => count(area).filter((entry) => !edges.some((edge) => edge.from === `inv:${entry.investigationId}` && edge.to === edgeTo));
    const story: Record<QuestionId, string[]> = {
      find: ['Rank what bears on crew fire safety', `${atlas.counts.profiles} profiles, ${ranked.length} ranked`, `${atlas.counts.experimentalCsvFiles} data tables, ${catalog.findings.length} findings`, 'Search, filter, compare table columns', `Top three: ${names(ranked.slice(0, 3))}`],
      prevention: [`Target: ${MOON_RANGE.minOxygenPercent}%+ oxygen, ${MOON_RANGE.maxPressurePsi} psi or less`, `${count('prevention').length} relevant; ${deadEnds('prevention', 'ev:cases').length} hold no atmosphere case`, `${cases.length} cases, Saffire IV to VI`, 'Oxygen and pressure gap to the target', `${inside.map((item) => item.sample).join(' and ')} inside the range`],
      detection: ['Scatter against obscuration at 2 V', `${count('detection').length} relevant; ${deadEnds('detection', 'ev:rows').length} hold no detector rows`, `${detectorDataset.records.length} workbook rows, 4 channels`, 'Paired counts, then a cutoff range', `SAME ${diff(paired.byFlight[0].summary)}, SAME-R ${diff(paired.byFlight[1].summary)}`],
      suppression: ['Visible flame loss against extinction', `${count('suppression').length} relevant; ${deadEnds('suppression', 'ev:findings').length} holds objectives only`, `${brief.claims.filter((claim) => claim.kind === 'source_finding' && claim.safetyAreas.includes('suppression')).length} reviewed findings`, 'Source wording with its limits', 'A cool flame can keep burning'],
      modelling: ['Claim: response, prediction or transfer', `${withModel.size} investigations have a published model`, `${catalog.models.length} models, ${catalog.counts.contracts} claim rules`, 'Requirements checked one by one', supported === null ? 'Checking two worked claims…' : `${supported} supported, ${verdicts!.length - supported} not`],
    };
    return { nodes, edges, lit, story, ranked };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalog, brief, question, verdicts]);

  const active = QUESTIONS.find((item) => item.id === question)!;
  const profileOnly = brief ? brief.ranking.filter((entry) => entry.findingIds.length === 0).length : null;

  return (
    <div className="page">
      <header className="mission-head">
        <div>
          <span className="crumb">Evidence flow · registry {catalog?.revision ?? 'loading…'}</span>
          <h1>From a fire-safety question to a sourced result</h1>
        </div>
        <div className="btn-row">
          <button type="button" className="btn ghost" onClick={playing ? () => setPlaying(false) : replay}>{playing ? 'Pause the run' : 'Play the workflow'}</button>
        </div>
      </header>

      {loadError && <p className="error" role="alert">{loadError} Reload the page to retry.</p>}

      <section className="mission" aria-label="Evidence flow">
        <div className="flame-box small"><Flame look={FLAME_MOOD[question]} /></div>
        <div className="chips q-chips" role="group" aria-label="Choose a question">
          {QUESTIONS.map((item) => <button key={item.id} type="button" className="chip" aria-pressed={question === item.id} onClick={() => pick(item.id)}>{item.tag}</button>)}
        </div>
        {flow
          ? <FlowMap nodes={flow.nodes} edges={flow.edges} lit={new Set(flow.lit[question])} stage={stage} onStage={(next) => { setPlaying(false); setStage(next); }}>
              <div className="flame-box" style={{ top: `${flameTop(question)}%` }}><Flame look={FLAME_MOOD[question]} /></div>
            </FlowMap>
          : !loadError && <div className="fm fm-wait" aria-busy="true" aria-label="Loading the evidence flow" />}
        <p className="fm-legend"><span><i className="lg-num" />number beside an investigation: reviewed findings</span><span><i className="lg-line" />ribbon width: amount of evidence</span><span><i className="lg-dead" />dashed: the path stops, no data of that kind</span></p>
        <ol className="story" aria-label={`Path for: ${active.label}`}>
          {STAGES.map((label, index) => (
            <li key={label} className={index === stage ? 'now' : index < stage ? 'done' : undefined}>
              <span className="mono">{String(index + 1).padStart(2, '0')} {label}</span>
              <p>{index === 0 ? active.label : flow ? flow.story[question][index] : '…'}</p>
              {index === 0 && flow && <small>{flow.story[question][0]}</small>}
            </li>
          ))}
        </ol>
      </section>

      <section className="result" aria-labelledby="result-title" key={question}>
        {question === 'prevention' && <>
          <div className="result-copy">
            <span className="tag area-prevention">Result · Prevention</span>
            <p className="mega" aria-hidden="true">{inside.length}<span>/{cases.length}</span></p>
            <h2 id="result-title">{inside.length} of {cases.length} Saffire burns ran inside the Moon Base atmosphere range</h2>
            <p>The challenge expects lunar habitats at {MOON_RANGE.minOxygenPercent}% oxygen or more and {MOON_RANGE.maxPressurePsi} psi or less. Only {inside.map((item) => item.sample).join(' and ')} sit inside it, and nothing in the set was burned above {maxOxygen}% oxygen.</p>
            <div className="btn-row">
              <button type="button" className="btn" onClick={() => go('atmospheres')}>Compare atmosphere cases</button>
              <button type="button" className="btn ghost" onClick={() => go('figures')}>See the print figure</button>
            </div>
          </div>
          <div className="result-data">
            <AtmosphereChart title="Seven Saffire atmosphere cases by oxygen and pressure with the Moon Base range shaded."
              points={cases.map((item) => ({ id: item.id, label: item.sample, oxygen: item.oxygenPercent, pressure: item.pressureKPa, material: item.material }))} frontier={inside.map((item) => item.id)} />
            <div className="table-wrap"><table className="spec-table">
              <thead><tr><th scope="col">Case</th><th scope="col">Material</th><th scope="col" className="n">O₂ mol %</th><th scope="col" className="n">kPa</th><th scope="col" className="n">psi</th><th scope="col" className="n">pO₂ kPa</th></tr></thead>
              <tbody>{cases.map((item) => <tr key={item.id} className={inMoonRange(item.oxygenPercent, item.pressureKPa) ? 'is-on' : undefined}><th scope="row">{item.sample}</th><td>{item.material}, {item.sidesBurning}-sided</td><td className="n">{item.oxygenPercent}</td><td className="n">{item.pressureKPa}</td><td className="n">{psi(item.pressureKPa)}</td><td className="n">{item.oxygenPartialPressureKPa}</td></tr>)}</tbody>
            </table></div>
            <p className="source-line">{conditionSource()} · coordinates only, not a flammability result · psi and pO₂ are arithmetic</p>
          </div>
        </>}

        {question === 'detection' && <>
          <div className="result-copy">
            <span className="tag area-detection">Result · Detection</span>
            <p className="mega" aria-hidden="true">{signedInt(paired.summary.pairedDifference.numerator)}<span>/{paired.summary.pairedDifference.denominator}</span></p>
            <h2 id="result-title">A pooled detector result hides two flights that disagree</h2>
            <p>At a 2 V cutoff the scatter channel is at or above cutoff in {paired.summary.pairedDifference.numerator} more rows of {paired.summary.pairedDifference.denominator} than the obscuration channel. Split by flight the sign flips: {diff(paired.byFlight[0].summary)} on SAME, {diff(paired.byFlight[1].summary)} on SAME-R.</p>
            <div className="btn-row">
              <button type="button" className="btn" onClick={() => go('smoke')}>Open the smoke lab</button>
              <button type="button" className="btn ghost" onClick={() => go('figures')}>See every reading plotted</button>
            </div>
          </div>
          <div className="result-data">
            <IntervalChart title="Scatter minus obscuration over cutoffs from 1 to 3 volts, pooled and by flight"
              rows={[{ label: 'Pooled', summary: envelope.summary }, ...envelope.byFlight].map((item) => ({ label: item.label, note: `[${signedInt(item.summary.pairedDifferenceEnvelope.lowerNumerator)}, ${signedInt(item.summary.pairedDifferenceEnvelope.upperNumerator)}]/${item.summary.pairedDifferenceEnvelope.denominator}`,
                lower: item.summary.pairedDifferenceEnvelope.lowerFraction, upper: item.summary.pairedDifferenceEnvelope.upperFraction }))} />
            <dl className="spec">
              <div><dt>Channels</dt><dd>ISS scatter (column AW) minus ISS obscuration (column AV)</dd></div>
              <div><dt>Cutoff range</dt><dd>each cutoff anywhere in 1 to 3 V; bars are exact bounds, not confidence intervals</dd></div>
              <div><dt>Cell audit</dt><dd>{sameRZero} of {sameR.length} SAME-R obscuration readings are stored as exactly 0 V</dd></div>
              <div><dt>Reading</dt><dd>opposite signs hold across the whole range; pooling hides the flight</dd></div>
            </dl>
            <p className="source-line">NASA {detectorDataset.source.accession}, {detectorDataset.source.workbook.sheet} sheet · a cutoff is not an alarm threshold · rows are not independent trials</p>
          </div>
        </>}

        {question === 'suppression' && <>
          <div className="result-copy">
            <span className="tag area-suppression">Result · Suppression</span>
            <p className="mega word" aria-hidden="true">Out?</p>
            <h2 id="result-title">{lead?.title ?? 'Loading the reviewed suppression finding…'}</h2>
            <p>{lead?.authoritativeText}</p>
            <div className="btn-row"><button type="button" className="btn" onClick={() => go('findings', { area: 'suppression' })}>Read the suppression findings</button></div>
          </div>
          <div className="result-data">
            <span className="mono muted">NASA source wording</span>
            <blockquote className="quote">{lead?.sourceFindingText}</blockquote>
            <dl className="spec">
              <div><dt>Scope</dt><dd>{lead?.qualifications[0]}</dd></div>
              <div><dt>Read as</dt><dd>visible flame loss is not proof that the reaction stopped</dd></div>
              <div><dt>Evidence</dt><dd>{lead?.evidenceKind?.replace(/_/g, ' ')}, checked with AI assistance</dd></div>
            </dl>
            <p className="source-line">{catalog?.sources.find((source) => source.id === lead?.sourceIds[0])?.title ?? ''}</p>
          </div>
        </>}

        {question === 'modelling' && <>
          <div className="result-copy">
            <span className="tag">Result · Modelling</span>
            <p className="mega" aria-hidden="true">{verdicts ? verdicts.filter((item) => item.claim?.outcome === 'specified_conditional_comparison').length : '…'}<span>/{verdicts?.length ?? 2}</span></p>
            <h2 id="result-title">The same cabin model supports one claim and not another</h2>
            <p>A requested claim is checked against {catalog?.counts.contracts ?? '…'} reviewed rules. The model stays fixed; the answer changes with the quantity and the claim. Each result lists what was required, what is missing and what must not be claimed.</p>
            <div className="btn-row"><button type="button" className="btn" onClick={() => go('findings')}>Check a model claim</button></div>
          </div>
          <div className="result-data verdicts">
            {(verdicts ?? []).map((item) => (
              <article key={item.label} className={item.claim?.outcome === 'specified_conditional_comparison' ? 'yes' : 'no'}>
                <span className="mono muted">{item.label} · Saffire VI cabin model</span>
                <h3>{item.claim ? outcomeLabel(item.claim) : 'No reviewed rule applies'}</h3>
                <p className="muted">{item.claim?.authoritativeText}</p>
                <dl className="spec">
                  <div><dt>Requirements</dt><dd>{item.claim ? `${item.claim.predicateResults.filter((check) => check.truth === 'satisfied').length} of ${item.claim.predicateResults.length} met` : 'none'}</dd></div>
                  <div><dt>Do not claim</dt><dd>{item.claim?.forbiddenStrongerClaims.slice(0, 2).join('; ')}</dd></div>
                </dl>
              </article>
            ))}
            {!verdicts && <div className="stack" aria-busy="true"><div className="skeleton" style={{ height: 120 }} /><div className="skeleton" style={{ height: 120 }} /></div>}
          </div>
        </>}

        {question === 'find' && <>
          <div className="result-copy">
            <span className="tag">Result · Relevance</span>
            <p className="mega" aria-hidden="true">{flow?.ranked.length ?? '…'}<span>/{atlas.counts.profiles}</span></p>
            <h2 id="result-title">{flow?.ranked.length ?? '…'} investigations ranked for crew fire safety, from {atlas.counts.profiles} NASA profiles</h2>
            <p>Rank follows reviewed evidence for prevention, detection and suppression. {profileOnly ?? '…'} ranked investigations hold objectives only; the other {atlas.records.filter((record) => record.appInvestigationId === null).length} profiles are searchable but not yet reviewed.</p>
            <div className="btn-row"><button type="button" className="btn" onClick={() => go('investigations')}>Search the investigations</button></div>
          </div>
          <div className="result-data">
            <div className="table-wrap" style={{ maxHeight: 'none' }}><table className="matrix-table">
              <thead><tr><th scope="col">Rank</th><th scope="col">Investigation</th><th scope="col">Areas</th><th scope="col">Findings</th><th scope="col">Atm. cases</th><th scope="col">Detector rows</th><th scope="col">Model</th><th scope="col">PSI records</th></tr></thead>
              <tbody>{(flow?.ranked ?? []).map((entry) => {
                const atmosphere = cases.filter((one) => `Saffire ${one.flight}` === entry.displayName).length;
                const detector = detectorDataset.records.filter((record) => record.flightLabel === entry.displayName).length;
                const model = catalog!.models.some((one) => one.investigationId === entry.investigationId);
                const profile = atlas.records.find((record) => record.appInvestigationId === entry.investigationId);
                const records = profile ? profile.experimentalTables.reduce((sum, table) => sum + table.dataRecordCount, 0) : 0;
                const cell = (value: number | string | null) => value ? <td className="has">{value}</td> : <td className="none">none</td>;
                return (
                  <tr key={entry.investigationId} className="clickable" onClick={() => go('investigations', { investigation: entry.investigationId })} title={entry.humanReasons.join(' ')}>
                    <td className="rank">{String(entry.rank).padStart(2, '0')}</td>
                    <th scope="row"><button type="button" className="link-btn" onClick={(event) => { event.stopPropagation(); go('investigations', { investigation: entry.investigationId }); }}>{entry.displayName}</button></th>
                    <td><span className="row">{(entry.record?.safetyAreas ?? []).map((area) => <span key={area} className={`tag area-${area}`}>{AREA_LABEL[area]}</span>)}</span></td>
                    {cell(entry.findingIds.length)}{cell(atmosphere)}{cell(detector)}{cell(model ? 'yes' : null)}{cell(records ? records.toLocaleString('en-US') : null)}
                  </tr>
                );
              })}</tbody>
            </table></div>
            <p className="source-line">Hatched cells: this release holds no data of that kind · PSI records are rows in NASA&rsquo;s published table, not burns</p>
          </div>
        </>}
      </section>

      <section className="section" aria-labelledby="gaps">
        <div className="section-head">
          <h2 id="gaps">Where the data stops</h2>
          <p>Limits a study plan has to work around. Each is stated by a source or counted from the files.</p>
        </div>
        <div className="gaps">
          <div className="gap-card"><span className="mono">Partial gravity</span><b>0</b><p>lunar- or Mars-gravity combustion datasets in NASA&rsquo;s PSI repository. Every case here ran in microgravity.</p><span className="mono">Challenge statement</span></div>
          <div className="gap-card"><span className="mono">Oxygen ceiling</span><b>{maxOxygen}%</b><p>is the highest oxygen level among the {cases.length} atmosphere cases. Nothing in this set was burned above it.</p><span className="mono">{conditionSource()}</span></div>
          <div className="gap-card"><span className="mono">Flow direction</span><b>1</b><p>unresolved conflict: the 2026 table says opposed flow, the 2024 table says concurrent. Flow is left out of every comparison.</p><span className="mono">{conditionDataset.source.version} vs {conditionDataset.earlierSourceContext[0]?.version ?? 'earlier table'}</span></div>
          <div className="gap-card"><span className="mono">Obscuration channel</span><b>{sameRZero}/{sameR.length}</b><p>SAME-R obscuration readings are stored as 0 V. The workbook does not establish the channel state on that flight.</p><span className="mono">PSI-101, Material Sort, column AV</span></div>
          <div className="gap-card"><span className="mono">Objectives only</span><b>{profileOnly ?? '–'}</b><p>ranked investigations have stated objectives but no curated result yet in this release.</p><span className="mono">Registry {catalog?.revision ?? ''}</span></div>
          <div className="gap-card"><span className="mono">Review</span><b>0</b><p>independent human scientific reviews. Values were checked with AI assistance against the downloaded NASA files.</p><span className="mono">Project disclosure</span></div>
        </div>
      </section>

      <div className="limit">
        <b>Limits</b>
        <ul>
          <li>IGNIS reports what NASA sources state and computes descriptive counts. It does not predict fire behaviour or label any atmosphere safe.</li>
          <li>The flame is an illustration drawn in code, not a simulation or NASA footage. Independent NASA Space Apps 2026 project by team Emberfall; not affiliated with or endorsed by NASA.</li>
        </ul>
      </div>
    </div>
  );
}

/** Vertical centre of a question's node, as a percentage of the flow map's height. */
function flameTop(id: QuestionId) {
  const index = QUESTIONS.findIndex((item) => item.id === id), gap = 10;
  const height = (BOTTOM - TOP - gap * (QUESTIONS.length - 1)) / QUESTIONS.length;
  return ((TOP + index * (height + gap) + height / 2) / VH) * 100;
}

function conditionSource() {
  return `${conditionDataset.source.version}, ${conditionDataset.source.table}`;
}
