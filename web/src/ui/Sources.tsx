'use client';

import atlas from '../../data/investigation-atlas.json';
import opportunities from '../data/research-opportunities.json';
import { conditionDataset } from '../core/conditions';
import { detectorDataset } from '../core/detector';
import { makeSession } from '../core/researchSession';
import { proposalFromForm } from '../core/interpretation';
import type { Shared } from './Dashboard';
import { short } from './lib';
import SessionControls from './SessionControls';
import ScientificTools from './ScientificTools';

export default function Sources({ shared }: { shared: Shared }) {
  const { catalog, history, selections } = shared;
  const session = () => makeSession({ question: 'IGNIS dashboard session', proposal: proposalFromForm({ intent: 'synthesize_findings' }) }, selections, history);

  return (
    <div className="page">
      <header className="page-head">
        <span className="crumb">07 · Sources</span>
        <h1>Sources, methods and limits behind every number</h1>
        <p>The curated NASA collections are pinned to source files by SHA-256. Download your session to rerun it later, or inspect the evidence API. Files in Your data have a separate, user-supplied provenance record.</p>
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

      <ScientificTools />
      <SessionControls makePacket={session} getOriginals={() => history} onLoad={shared.restore} />
      <div className="row between"><p className="muted">{history.length} of 16 notebook places used. Keep a downloaded copy before starting over.</p>
        <button type="button" className="btn ghost" onClick={shared.clearNotebook}>Start a new notebook</button></div>

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

    </div>
  );
}
