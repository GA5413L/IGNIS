'use client';

import { useMemo, useRef, useState } from 'react';
import atlas from '../../data/investigation-atlas.json';
import type { SafetyArea } from '../core/schemas';
import type { Shared } from './Dashboard';
import { AREAS, AREA_LABEL, plural, short } from './lib';

type Profile = (typeof atlas.records)[number];
type Filter = 'all' | SafetyArea | 'catalogue';
type Sort = 'rank' | 'accession' | 'records';

const records = (profile: Profile) => profile.experimentalTables.reduce((sum, table) => sum + table.dataRecordCount, 0);
const columns = (profile: Profile) => [...new Set(profile.experimentalTables.flatMap((table) => table.header.map((name) => name.trim()).filter(Boolean)))];
const name = (profile: Profile) => profile.acronym ?? profile.title;
const accessionNumber = (profile: Profile) => Number(profile.accession.replace('PSI-', ''));

export default function Investigations({ shared }: { shared: Shared }) {
  const { catalog, brief, focus, go } = shared;
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('rank');
  const [openId, setOpenId] = useState<string>(() => atlas.records.find((profile) => profile.appInvestigationId === focus.investigation)?.id ?? 'PSI-101');
  const [compare, setCompare] = useState<string[]>([]);
  const detailRef = useRef<HTMLDivElement>(null);

  const rankOf = useMemo(() => {
    const map = new Map<string, number>();
    brief?.ranking.forEach((entry, index) => map.set(entry.investigationId, index + 1));
    return map;
  }, [brief]);
  const registry = (profile: Profile) => catalog?.investigations.find((item) => item.id === profile.appInvestigationId) ?? null;
  const areas = (profile: Profile): SafetyArea[] => registry(profile)?.safetyAreas ?? [];
  const rank = (profile: Profile) => (profile.appInvestigationId ? rankOf.get(profile.appInvestigationId) ?? null : null);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return atlas.records
      .filter((profile) => {
        if (filter === 'catalogue') return profile.appInvestigationId === null;
        if (filter !== 'all') return areas(profile).includes(filter);
        return true;
      })
      .filter((profile) => !needle || [profile.accession, profile.title, profile.acronym ?? '', profile.metadata.objective ?? '', profile.metadata.description ?? '', ...columns(profile)]
        .some((text) => text.toLowerCase().includes(needle)))
      .sort((a, b) => {
        if (sort === 'records') return records(b) - records(a) || accessionNumber(a) - accessionNumber(b);
        if (sort === 'rank') return (rank(a) ?? 999) - (rank(b) ?? 999) || accessionNumber(a) - accessionNumber(b);
        return accessionNumber(a) - accessionNumber(b);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filter, sort, catalog, rankOf]);

  const open = atlas.records.find((profile) => profile.id === openId) ?? null;
  const pair = compare.map((id) => atlas.records.find((profile) => profile.id === id)!).filter(Boolean);
  const select = (id: string) => {
    setOpenId(id);
    if (window.matchMedia('(max-width: 1100px)').matches) requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  const toggleCompare = (id: string) => setCompare((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id].slice(-2));

  return (
    <div className="page">
      <header className="page-head">
        <span className="crumb">02 · Investigations</span>
        <h1>{atlas.counts.profiles} NASA combustion investigations, searchable and ranked</h1>
        <p>Every profile comes from NASA&rsquo;s Physical Sciences Informatics repository. Search by fuel, hardware or measurement, then compare what two investigations recorded.</p>
      </header>

      <section className="section" aria-label="Find investigations">
        <div className="fields">
          <label className="field" style={{ gridColumn: 'span 2' }}>
            <span>Search title, objective or table column</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} name="investigation-search" placeholder="e.g. droplet, oxygen, smoke, PMMA…" autoComplete="off" spellCheck={false} />
          </label>
          <label className="field">
            <span>Sort by</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as Sort)}>
              <option value="rank">Fire-safety rank</option>
              <option value="accession">PSI accession number</option>
              <option value="records">Table records, most first</option>
            </select>
          </label>
        </div>
        <div className="chips" role="group" aria-label="Filter by fire-safety area">
          <button type="button" className="chip" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All {atlas.counts.profiles}</button>
          {AREAS.map((area) => <button key={area} type="button" className="chip" aria-pressed={filter === area} onClick={() => setFilter(area)}>{AREA_LABEL[area]}</button>)}
          <button type="button" className="chip" aria-pressed={filter === 'catalogue'} onClick={() => setFilter('catalogue')}>Catalogue profile only</button>
        </div>
      </section>

      {pair.length === 2 && <Comparison a={pair[0]} b={pair[1]} onClear={() => setCompare([])} />}

      <div className="split">
        <section className="stack" aria-label="Investigation list">
          <p className="muted" aria-live="polite">{plural(visible.length, 'investigation')} shown{compare.length === 1 ? '. Pick one more to compare.' : ''}</p>
          {visible.length === 0 ? (
            <div className="empty">No investigation matches &ldquo;{query}&rdquo;. <button type="button" className="link-btn" onClick={() => { setQuery(''); setFilter('all'); }}>Clear the search</button></div>
          ) : (
            <div className="table-wrap" style={{ maxHeight: 'none' }}>
              <table>
                <thead><tr><th scope="col">Rank</th><th scope="col">Investigation</th><th scope="col">Safety areas</th><th scope="col" className="n">Table records</th><th scope="col">Compare</th></tr></thead>
                <tbody>
                  {visible.map((profile) => (
                    <tr key={profile.id} className={`clickable${profile.id === openId ? ' is-on' : ''}`} onClick={() => select(profile.id)}>
                      <td className="rank">{rank(profile) ? String(rank(profile)).padStart(2, '0') : '–'}</td>
                      <th scope="row">
                        <button type="button" className="link-btn" aria-expanded={profile.id === openId} onClick={(event) => { event.stopPropagation(); select(profile.id); }}>{name(profile)}</button>
                        <div className="mono muted">{profile.accession}</div>
                      </th>
                      <td><span className="row">{areas(profile).length ? areas(profile).map((area) => <span key={area} className={`tag area-${area}`}>{AREA_LABEL[area]}</span>) : <span className="tag outline">Catalogue only</span>}</span></td>
                      <td className="n">{profile.experimentalTables.length ? records(profile).toLocaleString('en-US') : 'none'}</td>
                      <td onClick={(event) => event.stopPropagation()}>
                        <label className="check" style={{ minHeight: 28 }}><input type="checkbox" checked={compare.includes(profile.id)} onChange={() => toggleCompare(profile.id)} /><span className="sr">Compare {name(profile)}</span></label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="muted" style={{ fontSize: 13 }}>{atlas.countMeaning} Saffire V and VI are ranked on the overview from published papers; they have no PSI profile in this snapshot, so ranks 02 and 07 are not listed here.</p>
        </section>

        <div ref={detailRef} className="sticky">
          {open && (
            <article className="card" aria-label={`${name(open)} profile`} key={open.id} style={{ animation: 'enter 220ms var(--ease) both' }}>
              <div className="row between">
                <span className="mono muted">{open.accession}</span>
                <span className="row">{areas(open).map((area) => <span key={area} className={`tag area-${area}`}>{AREA_LABEL[area]}</span>)}{rank(open) && <span className="tag strong">Rank {rank(open)}</span>}</span>
              </div>
              <h2>{open.title}</h2>
              {registry(open) && <p>{registry(open)!.summary} <span className="muted">{registry(open)!.depthNote}</span></p>}
              <div className="stack">
                <h4>Objective, as NASA&rsquo;s catalogue states it</h4>
                <blockquote>{open.metadata.objective ?? 'The catalogue record states no objective.'}</blockquote>
              </div>
              {open.experimentalTables.length > 0 ? (
                <div className="stack">
                  <h4>What the experimental table records ({plural(columns(open).length, 'column')}, {records(open).toLocaleString('en-US')} records)</h4>
                  <div className="cols">{columns(open).map((column) => <span key={column} className="tag">{column}</span>)}</div>
                </div>
              ) : <p className="muted">No experimental table was published with this record.</p>}
              {registry(open) && registry(open)!.findingIds.length > 0 && (
                <div className="stack">
                  <h4>Reviewed findings</h4>
                  <ul className="bullets">{catalog!.findings.filter((finding) => finding.investigationIds.includes(registry(open)!.id)).map((finding) => <li key={finding.id}>{finding.title}</li>)}</ul>
                  <button type="button" className="btn ghost small" style={{ justifySelf: 'start' }} onClick={() => go('findings', { area: areas(open)[0] })}>Read these findings</button>
                </div>
              )}
              <dl className="kv">
                <dt>Licence</dt><dd>{open.license.status === 'stated' ? open.license.name : 'Not reported in the NASA record'}</dd>
                {open.doi && <><dt>DOI</dt><dd><a href={open.doiUrl!} target="_blank" rel="noreferrer">{open.doi}</a></dd></>}
              </dl>
              <a className="btn" style={{ justifySelf: 'start' }} href={open.publicUrl} target="_blank" rel="noreferrer">Open the NASA record</a>
              <div className="card-foot"><span>record v{open.source.recordVersion}</span><span>sha256 {short(open.source.sha256)}</span><span>snapshot {atlas.snapshotDate}</span></div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}

function Comparison({ a, b, onClear }: { a: Profile; b: Profile; onClear: () => void }) {
  const [colsA, colsB] = [columns(a), columns(b)];
  const key = (text: string) => text.toLowerCase().replace(/\s+/g, ' ');
  const setB = new Set(colsB.map(key)), setA = new Set(colsA.map(key));
  const both = colsA.filter((column) => setB.has(key(column)));
  const onlyA = colsA.filter((column) => !setB.has(key(column)));
  const onlyB = colsB.filter((column) => !setA.has(key(column)));
  const list = (items: string[]) => items.length ? <div className="cols">{items.map((item) => <span key={item} className="tag">{item}</span>)}</div> : <p className="muted">None.</p>;
  return (
    <section className="section" aria-labelledby="compare-title">
      <div className="section-head">
        <h2 id="compare-title">{name(a)} and {name(b)}: what each table records</h2>
        <button type="button" className="btn ghost small" onClick={onClear}>Clear comparison</button>
      </div>
      <div className="compare">
        <div className="card"><h3>Recorded by both ({both.length})</h3>{list(both)}</div>
        <div className="card"><h3>Only {name(a)} ({onlyA.length})</h3>{list(onlyA)}</div>
        <div className="card"><h3>Only {name(b)} ({onlyB.length})</h3>{list(onlyB)}</div>
      </div>
      <div className="limit"><b>Limit</b><p>Matching column names show that both tables record a variable with that label. They do not show the two measurements are comparable; method, hardware and conditions still differ.</p></div>
    </section>
  );
}
