'use client';
import { useMemo, useState } from 'react';
import { buildResearchAnalysis, type CutoffResearchSelection } from '../core/researchSelections';
import { DEFAULT_CUTOFF_ENVELOPE_SELECTION, type CutoffDifferenceEnvelope } from '../core/cutoffEnvelope';
import { EnvelopePlot } from './CutoffEnvelope';
import { downloadResearch, SourceHash } from './researchShared';

const fraction = (b: CutoffDifferenceEnvelope) => b.denominator ? `[${b.lowerNumerator}, ${b.upperNumerator}] / ${b.denominator}` : 'Undefined: no rows';
const direction = (b: CutoffDifferenceEnvelope) => ({ strictly_positive: 'Positive throughout', strictly_negative: 'Negative throughout', both_signs: 'Both signs attainable',
  identically_zero: 'Zero throughout', nonnegative_including_zero: 'Nonnegative, including zero', nonpositive_including_zero: 'Nonpositive, including zero', no_data: 'No data' })[b.stability];

export default function GuidedExample({ onLab, onBrief }: { onLab: (s: CutoffResearchSelection) => void; onBrief: (s: CutoffResearchSelection) => void }) {
  const [wide, setWide] = useState(false);
  const [pooledOnly, setPooledOnly] = useState(false);
  const presets = useMemo(() => [false, true].map((isWide) => {
    const computed = buildResearchAnalysis({ kind: 'cutoff_envelope', options: {
      ...DEFAULT_CUTOFF_ENVELOPE_SELECTION, rangeA: isWide ? { min: 0, max: 5 } : { min: 1, max: 3 }, rangeB: isWide ? { min: 0, max: 5 } : { min: 1, max: 3 },
    } });
    if (computed.kind !== 'cutoff_envelope') throw new Error('Worked example requires the cutoff analysis.');
    return computed;
  }), []);
  const analysis = presets[wide ? 1 : 0];
  const r = analysis.result;
  const rows = [{ label: 'Pooled', summary: r.summary }, ...r.byFlight.map((f) => ({ label: `Flight ${f.flight}`, summary: f.summary }))];
  const flightSigns = r.byFlight.map((f) => f.summary.pairedDifferenceEnvelope.stability);
  const opposite = flightSigns.includes('strictly_positive') && flightSigns.includes('strictly_negative');
  const unavailable = r.rows.filter((row) => row.availability !== 'bothFinite');
  return <article className="guided-example" aria-labelledby="example-title">
    <div className="example-feature">
      <header className="example-intro"><p className="eyebrow"><span className="live-dot" /> SAME / SAME-R · RESEARCH IN FOCUS</p><h1 id="example-title">One pooled result.<br /><em>Two different stories.</em></h1>
        <p className="lede">Before comparing smoke channels, look at what combining the flights can hide.</p>
        <div className="example-source-tag"><span>01</span><div><strong>NASA smoke-detection experiments</strong><small>{r.summary.pairedFiniteRows} finite pairs · {r.byFlight.length} flights · {r.summary.selectedRows - r.summary.pairedFiniteRows} unavailable pair</small></div></div>
        <a className="linkbtn" href="#example-evidence">Follow the evidence ↓</a>
      </header>
      <section className="example-observatory" aria-labelledby="example-result">
        <div className="example-chart-heading"><div><p className="eyebrow">LIVE DESCRIPTIVE ANALYSIS</p><h2 id="example-result">Keep the flights visible</h2></div><span className="example-range-tag">{wide ? '0–5' : '1–3'} V ranges</span></div>
        <div className="example-view-switch" role="group" aria-label="Displayed populations"><button aria-pressed={pooledOnly} onClick={() => setPooledOnly(true)}>Pooled only</button><button aria-pressed={!pooledOnly} onClick={() => setPooledOnly(false)}>Separate the flights</button></div>
        <EnvelopePlot result={r} pooledOnly={pooledOnly} />
        <p className="example-finding" role="status">{pooledOnly ? `With flights pooled: ${direction(r.summary.pairedDifferenceEnvelope).toLowerCase()}. Separate the flights to inspect the structure behind this summary.` : opposite ? 'The two flights retain opposite signs throughout this cutoff rectangle. The pooled direction hides this flight structure.'
          : r.summary.pairedDifferenceEnvelope.stability === 'both_signs' ? 'The pooled difference can have either sign within this cutoff rectangle. Its direction depends on the cutoff choices.'
          : 'Inspect the computed flight ranges: this selection does not establish the opposite-sign contrast throughout the rectangle.'}</p>
        <p className="example-chart-note">A = ISS scatter · B = ISS obscuration. Bars show A-minus-B fractions at or above each channel’s cutoff. Grey bars allow unavailable readings, using all selected rows. Exact bounds, not confidence intervals.</p>
      </section>
    </div>
    <p className="example-boundary">Different channel responses; illustrative cutoffs, not calibrated alarm thresholds. This comparison establishes neither detector superiority, fire safety nor causation.</p>
    <section className="example-assumptions" aria-labelledby="example-assumption-title">
      <div><p className="eyebrow">CHALLENGE THE RESULT</p><h2 id="example-assumption-title">Does the pattern survive a wider range?</h2><p>Both cutoffs vary independently. Choose a range and watch the result change.</p></div>
      <fieldset className="example-ranges"><legend>Independent ranges for both cutoffs</legend>
        <label className={!wide ? 'selected' : ''}><input type="radio" name="example-range" checked={!wide} onChange={() => setWide(false)} /><span>1–3 V · narrower range<small>Pooled: {direction(presets[0].result.summary.pairedDifferenceEnvelope).toLowerCase()}</small></span></label>
        <label className={wide ? 'selected' : ''}><input type="radio" name="example-range" checked={wide} onChange={() => setWide(true)} /><span>0–5 V · wider range<small>Pooled: {direction(presets[1].result.summary.pairedDifferenceEnvelope).toLowerCase()}</small></span></label>
      </fieldset>
    </section>
    <div className="example-evidence-heading" id="example-evidence"><p className="eyebrow">FROM PATTERN TO SOURCE</p><h2>Every result has a trail.</h2><p>The population, missing readings and assumptions stay attached to the finding.</p></div>
    <div className="example-layout">
      <section className="panel example-story" aria-labelledby="example-exact"><p className="eyebrow">01 / CHECK THE NUMBERS</p><h2 id="example-exact">The exact ranges</h2>
        <p><strong>{r.summary.pairedFiniteRows}</strong> jointly finite pairs from <strong>{r.summary.selectedRows}</strong> selected material rows. {r.selection.includeReference ? 'Reference rows are included.' : 'DBP reference rows are outside this material selection.'} {r.excludedRows.length} additional row exclusions. Rows are not established independent trials.</p>
        <div className="scroll-x" role="region" tabIndex={0} aria-label="Worked example exact ranges"><table className="data-table"><caption>A-minus-B fraction range over the selected cutoff rectangle</caption><thead><tr><th scope="col">Population</th><th scope="col">Exact range</th><th scope="col">Direction</th></tr></thead><tbody>
          {rows.map((row) => <tr key={row.label}><th scope="row">{row.label}</th><td className="num">{fraction(row.summary.pairedDifferenceEnvelope)}</td><td>{direction(row.summary.pairedDifferenceEnvelope)}</td></tr>)}
        </tbody></table></div>
        <details><summary>How the cutoff bounds are computed</summary><p>Each channel can take a different cutoff anywhere in its range. This is a rectangular sensitivity analysis, not a probability distribution or calibration-error model.</p><p>Minimum witness: A = {r.summary.minimum.cutoffA} V, B = {r.summary.minimum.cutoffB} V. Maximum witness: A = {r.summary.maximum.cutoffA} V, B = {r.summary.maximum.cutoffB} V.</p></details>
      </section>
      <aside className="example-controls">
        <section className="panel"><p className="eyebrow">02 / ACCOUNT FOR WHAT IS MISSING</p><h2>Keep unavailable readings visible</h2>
          <p>{r.summary.selectedRows - r.summary.pairedFiniteRows} selected row(s) lack a finite pair. Allowing every completion gives pooled bounds <strong className="num">{fraction(r.summary.completionDifferenceEnvelope)}</strong>.</p>
          <ul>{unavailable.map((row) => <li key={row.record.id}>Row {row.record.excelRow}, {row.record.material}: {row.measurementA.cell} = {row.measurementA.originalValue ?? '(blank)'}; {row.measurementB.cell} = {row.measurementB.originalValue ?? '(blank)'}. {row.availability}.</li>)}</ul>
          <p className="hint">No missing value is filled in. Source configuration, recorded instrument status and measurement windows still need review. The workbook/CSV identity conflict remains unresolved.</p>
        </section>
      </aside>
    </div>
    <section className="panel example-handoff"><p className="eyebrow">03 / TAKE THE EVIDENCE WITH YOU</p><h2>Inspect, adapt, then preserve</h2>
      <p>Open the full lab to inspect source cells, flight and material filters, explicit exclusions and the recorded fan-status sensitivity. Attaching this selection to a brief carries its exact settings into the assessment.</p>
      <div className="row"><button className="btn primary" onClick={() => onLab(analysis.selection)}>Open these settings in Smoke lab</button><button className="btn" onClick={() => onBrief(analysis.selection)}>Attach this result to a brief</button>
        <button className="btn" onClick={() => downloadResearch('ignis-worked-example-analysis.json', analysis)}>Download this analysis</button></div>
      <p className="hint">After confirming a brief, use Research notebook → Download evidence package to preserve the assessment, recipe and normalized sources together. This analysis download contains the selected result only.</p>
      <details><summary>Inspect the source cells behind the ranges</summary><div className="scroll-x" role="region" tabIndex={0} aria-label="Worked example source cells"><table className="data-table"><thead><tr><th>Workbook row</th><th>Material</th><th>A: cell / stored value</th><th>B: cell / stored value</th></tr></thead><tbody>
        {r.rows.map((row) => <tr key={row.record.id}><td>{row.record.excelRow}</td><td>{row.record.material}</td><td>{row.measurementA.cell}: {row.measurementA.originalValue ?? '(blank)'}</td><td>{row.measurementB.cell}: {row.measurementB.originalValue ?? '(blank)'}</td></tr>)}
      </tbody></table></div></details>
      <p><a href={r.source.recordUrl} target="_blank" rel="noreferrer">NASA source record ↗</a> · {r.source.workbook.fileName}, sheet {r.source.workbook.sheet}</p>
      <SourceHash hash={r.source.workbook.sha256} /><p className="hint">{r.reviewStatement}</p>
    </section>
  </article>;
}
