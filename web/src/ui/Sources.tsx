'use client';

import { useState } from 'react';
import atlas from '../../data/investigation-atlas.json';
import opportunities from '../data/research-opportunities.json';
import { conditionDataset } from '../core/conditions';
import { detectorDataset } from '../core/detector';
import { makeSession, serializeSession } from '../core/researchSession';
import { proposalFromForm } from '../core/interpretation';
import type { Shared } from './Dashboard';
import { download, plural, short } from './lib';

export default function Sources({ shared }: { shared: Shared }) {
  const { catalog, health, history, selections, notify } = shared;
  const [busy, setBusy] = useState(false);

  const session = () => makeSession({ question: 'IGNIS dashboard session', proposal: proposalFromForm({ intent: 'synthesize_findings' }) }, selections, history);
  const saveNotebook = () => {
    try { download(`ignis-notebook-${new Date().toISOString().slice(0, 10)}.json`, serializeSession(session())); notify('Notebook downloaded.'); }
    catch (error) { notify(error instanceof Error ? error.message : 'The notebook could not be saved.'); }
  };
  const savePackage = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/package', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session: session(), originals: history }) });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message ?? 'The evidence package could not be built.');
      download(`ignis-evidence-package-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(body, null, 2) + '\n');
      notify('Evidence package downloaded.');
    } catch (error) { notify(error instanceof Error ? error.message : 'The evidence package could not be built.'); }
    finally { setBusy(false); }
  };

  return (
    <div className="page">
      <header className="page-head">
        <span className="crumb">07 · Sources</span>
        <h1>Sources, methods and limits behind every number</h1>
        <p>Each dataset in this dashboard is pinned to a NASA file by its SHA-256 hash. Download your session to rerun it later, or read the data directly from the evidence API.</p>
      </header>

      <section className="section" aria-labelledby="datasets">
        <div className="section-head"><h2 id="datasets">Three datasets</h2><p>All values are kept as NASA published them. Blank and error cells stay blank.</p></div>
        <div className="grid-3">
          <article className="card">
            <h3>Investigation atlas</h3>
            <p className="big">{atlas.counts.profiles}</p>
            <p>PSI catalogue profiles, with {atlas.counts.experimentalCsvFiles} experimental tables holding {atlas.counts.experimentalCsvDataRecords.toLocaleString('en-US')} records.</p>
            <p className="muted">{atlas.inventoryScope}</p>
            <div className="card-foot"><a href="/api/evidence?collection=atlas">/api/evidence?collection=atlas</a><span>snapshot {atlas.snapshotDate}</span></div>
          </article>
          <article className="card">
            <h3>Atmosphere cases</h3>
            <p className="big">{conditionDataset.cases.length}</p>
            <p>Saffire IV, V and VI burns from one table: {conditionDataset.source.title}.</p>
            <p className="muted">{conditionDataset.reviewStatement}</p>
            <div className="card-foot"><a href={conditionDataset.source.publicUrl} target="_blank" rel="noreferrer">{conditionDataset.source.version}</a><span>sha256 {short(conditionDataset.source.sha256)}</span></div>
          </article>
          <article className="card">
            <h3>Smoke detector readings</h3>
            <p className="big">{detectorDataset.records.length}</p>
            <p>Rows from the {detectorDataset.source.workbook.sheet} sheet of the SAME and SAME-R results workbook, read as stored without recalculation.</p>
            <p className="muted">{detectorDataset.source.review.method}</p>
            <div className="card-foot"><a href={detectorDataset.source.doiUrl} target="_blank" rel="noreferrer">doi {detectorDataset.source.doi}</a><span>{detectorDataset.source.license.id}</span></div>
          </article>
        </div>
      </section>

      <section className="section" aria-labelledby="notebook">
        <div className="section-head"><h2 id="notebook">Session notebook</h2><p>Save what you attached and assessed. The file carries checksums, so a later run can show whether a source, method or result changed.</p></div>
        <div className="card">
          <dl className="kv">
            <dt>Attached analyses</dt><dd>{selections.length ? plural(selections.length, 'analysis', 'analyses') : 'None yet. Attach one from Atmospheres or Smoke detection.'}</dd>
            <dt>Model claim checks</dt><dd>{history.length ? plural(history.length, 'assessment') : 'None yet. Run one from Findings.'}</dd>
          </dl>
          <div className="btn-row">
            <button type="button" className="btn" onClick={saveNotebook}>Download session notebook</button>
            <button type="button" className="btn ghost" onClick={() => void savePackage()} disabled={busy || history.length === 0}>{busy ? 'Building the package\u2026' : 'Download evidence package'}</button>
          </div>
          <p className="muted" style={{ fontSize: 13 }}>A checksum detects accidental changes. It is not a signature and does not validate the science. The evidence package needs at least one model claim check.</p>
        </div>
      </section>

      <section className="section" aria-labelledby="publications">
        <div className="section-head"><h2 id="publications">{catalog ? catalog.sources.length : ''} cited publications</h2><p>Reviewed findings and model checks quote these sources.</p></div>
        {catalog ? (
          <div className="table-wrap" style={{ maxHeight: 'none' }}>
            <table>
              <thead><tr><th scope="col">Source</th><th scope="col">Published</th><th scope="col">Access</th><th scope="col">File hash</th></tr></thead>
              <tbody>{catalog.sources.map((source) => (
                <tr key={source.id}>
                  <th scope="row">{source.canonicalUri ? <a href={source.canonicalUri} target="_blank" rel="noreferrer">{source.title}</a> : source.title}</th>
                  <td className="mono nowrap">{source.publicationDate ?? 'not stated'}</td>
                  <td>{source.access.replace(/_/g, ' ')}</td>
                  <td className="mono">{source.observedSha256 ? short(source.observedSha256) : 'not pinned'}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : <div className="skeleton" style={{ height: 120 }} aria-busy="true" />}
      </section>

      <section className="section" aria-labelledby="next-data">
        <div className="section-head"><h2 id="next-data">{opportunities.opportunities.length} datasets worth adding next</h2><p>{opportunities.admissionPolicy}</p></div>
        <div className="grid-2">
          {opportunities.opportunities.map((item) => (
            <article className="card" key={item.id}>
              <span className="tag outline">{item.availability.replace(/-/g, ' ')}</span>
              <h3>{item.title}</h3>
              <p>{item.purpose}</p>
              <details><summary>What it cannot establish</summary><div className="details-body"><ul className="bullets">{item.cannotEstablish.map((line) => <li key={line}>{line}</li>)}</ul></div></details>
              <div className="card-foot">{item.sources.map((source) => <a key={source.title + (('asset' in source && source.asset) || '')} href={source.url} target="_blank" rel="noreferrer">{source.title}</a>)}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="disclosure">
        <div className="section-head"><h2 id="disclosure">How IGNIS was built and checked</h2></div>
        <div className="grid-2">
          <div className="card">
            <h3>AI assistance</h3>
            <p>Research, data curation, design and code were developed with Claude Code and OpenAI Codex. Preparation began before the hackathon and is disclosed in the project record.</p>
            <p>{health?.aiAvailable ? 'A language model interprets typed questions.' : 'No language model runs inside this dashboard. Every answer comes from fixed, reviewed rules applied to the source values.'}</p>
          </div>
          <div className="card">
            <h3>Review status</h3>
            <ul className="bullets">
              <li>Source values were checked with AI assistance against the downloaded NASA files.</li>
              <li>No independent human scientific review has taken place.</li>
              <li>IGNIS makes no fire prediction, safety rating or alarm classification.</li>
              <li>Independent project by team Emberfall. Not affiliated with or endorsed by NASA.</li>
            </ul>
            <div className="card-foot"><span>registry {catalog?.revision ?? 'Loading\u2026'}</span><span>{catalog ? `digest ${short(catalog.digest)}` : ''}</span><span>{health?.buildRevision ?? ''}</span><a href="/api/evidence">Evidence API</a></div>
          </div>
        </div>
      </section>
    </div>
  );
}
