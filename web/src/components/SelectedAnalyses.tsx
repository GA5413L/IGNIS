import type { ResearchAnalysis } from '../core/researchSelections';
import { downloadResearch, SourceHash } from './researchShared';

export default function SelectedAnalyses({ analyses }: { analyses: ResearchAnalysis[] }) {
  if (!analyses.length) return null;
  return <section className="panel" aria-labelledby="selected-analysis-h">
    <p className="eyebrow">EXACT SELECTION · SOURCE-BOUND RESULT</p><h2 id="selected-analysis-h">Selected source analyses</h2>
    <p className="hint">These descriptive results belong to this confirmed request. They add context; they do not change the published models’ validation status.</p>
    {analyses.map((a) => <article className="research-attachment" key={a.id}>
      <h3>{a.title}</h3><ul>{a.summary.map((s) => <li key={s}>{s}</li>)}</ul>
      <details><summary>Scope, provenance and limitations</summary><ul>{a.limitations.map((s) => <li key={s}>{s}</li>)}</ul>
        {a.sources.map((s) => <div key={s.sha256}><a href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a><SourceHash hash={s.sha256} /></div>)}
        <p className="hint">Method {a.methodRevision} · source basis <span className="num">{a.sourceDigest}</span> · result <span className="num">{a.resultDigest}</span></p></details>
      <button className="btn" onClick={() => downloadResearch(`${a.id}.json`, a)}>Export this selected analysis</button>
    </article>)}
  </section>;
}
