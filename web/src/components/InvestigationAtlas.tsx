'use client';
import { useMemo, useState } from 'react';
import atlas from '../../data/investigation-atlas.json';
import conditions from '../../data/condition-cases.json';
import { downloadResearch, SourceHash, Stat } from './researchShared';

export function ResearchLanding({ onConditions, onDetectors, onRobustness, onBrief, onExample }: { onConditions: () => void; onDetectors: () => void; onRobustness: () => void; onBrief: () => void; onExample: () => void }) {
  return <>
    <section className="research-hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow"><span className="live-dot" /> NASA evidence · Independent research workspace</p>
        <h1 id="hero-title">Understand fire.<br /><em>Beyond Earth.</em></h1>
        <p>Trace experiments, compare their conditions, and build research briefs with sources you can inspect.</p>
        <div className="row"><button className="btn primary" onClick={onConditions}>Compare atmospheres <span aria-hidden="true">↗</span></button><button className="btn hero-secondary" onClick={onBrief}>Build a research brief</button></div>
        <button className="linkbtn hero-anchor" onClick={onExample}>New here? Follow a worked example <span aria-hidden="true">↗</span></button>
      </div>
      <div className="hero-figure">
        <div className="figure-label"><span>SAFFIRE IV–VI</span><span>07 published cases</span></div>
        <svg viewBox="0 0 460 290" role="img" aria-labelledby="hero-chart-title hero-chart-desc">
          <title id="hero-chart-title">Seven published Saffire atmosphere coordinates</title>
          <desc id="hero-chart-desc">Oxygen mole percentage on the horizontal axis and pressure in kilopascals on the vertical axis. Exact values are available in Conditions.</desc>
          {[50, 75, 100].map((p) => <g key={p}><line x1="55" x2="415" y1={235 - (p - 45) * 3.5} y2={235 - (p - 45) * 3.5} className="hero-grid" /><text x="42" y={239 - (p - 45) * 3.5} textAnchor="end">{p}</text></g>)}
          {[22, 26, 30, 34].map((o) => <g key={o}><line x1={65 + (o - 20) * 24} x2={65 + (o - 20) * 24} y1="30" y2="235" className="hero-grid" /><text x={65 + (o - 20) * 24} y="258" textAnchor="middle">{o}%</text></g>)}
          <text x="55" y="18" className="axis-caption">Pressure · kPa</text><text x="413" y="283" textAnchor="end" className="axis-caption">Oxygen · mole %</text>
          {conditions.cases.map((c) => <g key={c.id}><circle cx={65 + (c.oxygenPercent - 20) * 24} cy={235 - (c.pressureKPa - 45) * 3.5} r="12" fill="currentColor" opacity=".1" /><circle cx={65 + (c.oxygenPercent - 20) * 24} cy={235 - (c.pressureKPa - 45) * 3.5} r="4.5" fill="currentColor"><title>{`${c.sample}: ${c.oxygenPercent}% O₂, ${c.pressureKPa} kPa, ${c.material}`}</title></circle></g>)}
        </svg>
        <div className="figure-foot"><span className="live-dot" /><span>Published coordinates. Each point keeps its context.</span></div>
      </div>
    </section>
    <div className="stat-strip"><Stat value={atlas.counts.profiles} label="Investigation profiles" note="NASA Physical Sciences Informatics" /><Stat value={conditions.caseCount} label="Atmosphere cases" note="Saffire · 2026 Table 1" /><Stat value="134" label="Material rows" note="SAME / SAME-R · 20 reference rows separate" /><div className="stat stat-action"><span className="eyebrow">Follow the measurement</span><button className="linkbtn" onClick={onDetectors}>Open the smoke lab <span aria-hidden="true">↗</span></button><small>Readings, missing cells and source locators</small></div></div>
    <div className="workflow-cards">
      <button onClick={onConditions}><span className="step-number">01 / CONDITIONS</span><strong>Find relevant atmosphere cases</strong><span>Compare oxygen and pressure gaps within a material cohort.</span><b aria-hidden="true">↗</b></button>
      <button onClick={onRobustness}><span className="step-number">02 / ROBUSTNESS</span><strong>Test a finding’s robustness</strong><span>Vary two cutoffs. Inspect exact bounds, flight differences and the rows behind them.</span><b aria-hidden="true">↗</b></button>
      <button onClick={onBrief}><span className="step-number">03 / EVIDENCE</span><strong>Ask what a model establishes</strong><span>Trace published findings, assumptions and changes to a claim.</span><b aria-hidden="true">↗</b></button>
    </div>
  </>;
}

export default function InvestigationAtlas({ onReviewedProfile }: { onReviewedProfile: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'tables' | 'findings'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const rows = useMemo(() => atlas.records.filter((r) => {
    const match = `${r.title} ${r.acronym} ${r.accession} ${r.metadata.objective ?? ''}`.toLowerCase().includes(query.toLowerCase().trim());
    return match && (filter !== 'tables' || r.experimentalTables.length > 0) && (filter !== 'findings' || r.appInvestigationId !== null);
  }), [query, filter]);
  const selected = atlas.records.find((r) => r.id === selectedId);
  return <section className="panel atlas-panel" id="atlas" aria-labelledby="atlas-title">
    <div className="section-heading"><div><p className="eyebrow">THE RESEARCH MAP</p><h2 id="atlas-title">Investigation atlas</h2><p className="hint">24 source profiles, with acquired file inventories. Catalog objectives describe intended work; reviewed findings are shown separately below.</p></div><button className="btn" onClick={() => downloadResearch('IGNIS-investigation-atlas.json', atlas)}>Export atlas JSON</button></div>
    <div className="atlas-controls"><div><label htmlFor="atlas-search">Find an investigation</label><input type="search" id="atlas-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search FLEX, soot, droplet…" /></div><div><label htmlFor="atlas-filter">Show profiles</label><select id="atlas-filter" value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}><option value="all">All profiles</option><option value="tables">Acquired CSV tables</option><option value="findings">Linked to the reviewed bank</option></select></div><p className="hint" role="status">{rows.length} of {atlas.counts.profiles}</p></div>
    <div className="atlas-grid">{(expanded || query || filter !== 'all' ? rows : rows.slice(0, 8)).map((r) => <button className={`atlas-card ${selectedId === r.id ? 'selected' : ''}`} key={r.id} onClick={() => setSelectedId(selectedId === r.id ? null : r.id)} aria-expanded={selectedId === r.id} aria-controls="atlas-detail"><span className="atlas-accession">{r.accession}<span aria-hidden="true">↗</span></span><strong>{r.acronym}</strong><span className="atlas-name">{r.title}</span><span className="atlas-meta">{r.experimentalTables.length ? `${r.experimentalTables.length} CSV ${r.experimentalTables.length === 1 ? 'table' : 'tables'}` : 'Profile metadata'}{r.analyzedWorkbooks.length ? ' · Workbook' : ''}{r.appInvestigationId ? ' · Bank link' : ''}</span></button>)}</div>
    {!query && filter === 'all' && <button className="btn atlas-expand" onClick={() => setExpanded(!expanded)}>{expanded ? 'Show fewer profiles' : 'View all 24 profiles'}</button>}
    {rows.length === 0 && <p className="notice info">No profiles match. Try a different name or remove the filter.</p>}
    {selected && <div className="atlas-detail" id="atlas-detail" role="region" aria-label={`${selected.acronym} source profile`}>
      <div className="section-heading"><div><span className="eyebrow">{selected.accession} · SOURCE PROFILE</span><h3>{selected.title}</h3></div><button className="btn" onClick={() => setSelectedId(null)}>Close profile details</button></div>
      <p className="hint">Record version {selected.source.recordVersion} · {selected.license.name ?? 'License not reported in this catalog record'} · DOI <a href={selected.doiUrl} target="_blank" rel="noreferrer">{selected.doi}</a></p>
      {selected.metadata.objective && <details><summary>Source-stated objectives</summary><p className="preserve-lines">{selected.metadata.objective}</p></details>}
      {selected.metadata.description && <details><summary>Source-stated description</summary><p className="preserve-lines">{selected.metadata.description}</p></details>}
      <h4>Acquired experimental tables</h4>
      {selected.experimentalTables.length ? <ul className="file-list">{selected.experimentalTables.map((t) => <li key={t.id}><strong>{t.fileName}</strong><span>{t.dataRecordCount} nonblank records · File version {t.fileVersion} · {t.bytes.toLocaleString()} bytes</span><SourceHash hash={t.sha256} /></li>)}</ul> : <p>No experimental CSV was acquired for this profile in the bounded inventory.</p>}
      {selected.analyzedWorkbooks.length > 0 && <p>The acquired SAME / SAME-R results workbook is explored in Smoke lab.</p>}
      <p className="hint">CSV record counts include source summaries and notes. They are not counts of burns or independent experiments.</p>
      <SourceHash hash={selected.source.sha256} />
      <div className="row"><a className="btn" href={selected.publicUrl} target="_blank" rel="noreferrer">Open NASA PSI record ↗</a>{selected.appInvestigationId && <button className="btn" onClick={() => onReviewedProfile(selected.appInvestigationId!)}>Open reviewed bank profile</button>}</div>
    </div>}
    <p className="hint atlas-note">22 CSV files · 2,009 nonblank records · 861 blank records excluded. Snapshot 15 Nov 2026. Acquired raw files remain in the local research archive; this view exports metadata and provenance.</p>
  </section>;
}
