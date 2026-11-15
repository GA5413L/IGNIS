'use client';
import { useId, useMemo, useState } from 'react';
import { analyzeCutoffEnvelope, DEFAULT_CUTOFF_ENVELOPE_SELECTION, type CutoffDifferenceEnvelope, type CutoffEnvelopeResult, type CutoffEnvelopeSelection, type CutoffStability } from '../core/cutoffEnvelope';
import { DETECTOR_CHANNEL_IDS, DETECTOR_CHANNELS, DETECTOR_MATERIALS } from '../core/detector';
import type { CutoffResearchSelection } from '../core/researchSelections';
import { downloadResearch, ResearchHeading, SourceHash, Stat } from './researchShared';
import ShareScenario from './ShareScenario';

const signLabel: Record<CutoffStability, string> = {
  strictly_positive: 'Positive throughout', strictly_negative: 'Negative throughout', identically_zero: 'Zero throughout',
  nonnegative_including_zero: 'Nonnegative; zero is attainable', nonpositive_including_zero: 'Nonpositive; zero is attainable',
  both_signs: 'Both signs are attainable', no_data: 'Undefined; no rows',
};
const bounds = (b: CutoffDifferenceEnvelope) => b.denominator ? `[${b.lowerNumerator}, ${b.upperNumerator}] / ${b.denominator}` : 'Undefined';

export function EnvelopePlot({ result, pooledOnly = false }: { result: CutoffEnvelopeResult; pooledOnly?: boolean }) {
  const plotId = useId();
  const groups = [{ label: 'Pooled', summary: result.summary }, ...(pooledOnly ? [] : result.byFlight.map((f) => ({ label: `Flight ${f.flight}`, summary: f.summary })))];
  const x = (n: number) => 360 + n * 220;
  return <svg className="scientific-chart" viewBox="0 0 670 260" role="img" aria-labelledby={`${plotId}-title ${plotId}-desc`}>
    <title id={`${plotId}-title`}>{pooledOnly ? 'Pooled range only; flight ranges hidden in this view' : 'Exact difference ranges over the declared cutoff rectangle'}</title>
    <desc id={`${plotId}-desc`}>Solid intervals show the minimum and maximum A-minus-B at-or-above fractions on jointly finite source rows. Faint intervals include unrestricted completions of unavailable readings, on a different denominator. Neither interval is a confidence interval.</desc>
    {[-1, -.5, 0, .5, 1].map((n) => <g key={n}><line x1={x(n)} x2={x(n)} y1="22" y2="190" className={n === 0 ? 'target-line' : 'plot-grid'} /><text x={x(n)} y="215" textAnchor="middle">{n > 0 ? '+' : ''}{n}</text></g>)}
    {groups.map((g, i) => {
      const b = g.summary.pairedDifferenceEnvelope, c = g.summary.completionDifferenceEnvelope, y = 54 + i * 54;
      return <g key={g.label}><text x="118" y={y + 5} textAnchor="end">{g.label}</text>
        {c.lowerFraction !== null && c.upperFraction !== null && <line className="envelope-completion" x1={x(c.lowerFraction)} x2={x(c.upperFraction)} y1={y + 11} y2={y + 11} stroke="#8a9a9e" strokeWidth="4" />}
        {b.lowerFraction !== null && b.upperFraction !== null ? <g className="envelope-finite"><line x1={x(b.lowerFraction)} x2={x(b.upperFraction)} y1={y} y2={y} stroke="#087b72" strokeWidth="6" /><circle cx={x(b.lowerFraction)} cy={y} r="4" fill="#087b72" /><circle cx={x(b.upperFraction)} cy={y} r="4" fill="#087b72" /></g> : <text x="360" y={y} textAnchor="middle">No finite pairs</text>}
      </g>;
    })}
    <text x="360" y="247" textAnchor="middle" className="axis-caption">A fraction − B fraction · exact selected-range bounds</text>
  </svg>;
}

export default function CutoffEnvelope({ onBrief, initialSelection }: { onBrief: (selection: CutoffResearchSelection) => void; initialSelection?: CutoffResearchSelection }) {
  const [selection, setSelection] = useState<CutoffEnvelopeSelection>(initialSelection?.options ?? { ...DEFAULT_CUTOFF_ENVELOPE_SELECTION, exclusions: [] });
  const [aMin, setAMin] = useState(String(selection.rangeA.min)), [aMax, setAMax] = useState(String(selection.rangeA.max));
  const [bMin, setBMin] = useState(String(selection.rangeB.min)), [bMax, setBMax] = useState(String(selection.rangeB.max));
  const update = (patch: Partial<CutoffEnvelopeSelection>) => setSelection((s) => ({ ...s, ...patch }));
  const calculated = useMemo(() => {
    try {
      const text = [aMin, aMax, bMin, bMax];
      if (text.some((s) => !s.trim() || !Number.isFinite(Number(s)) || Number(s) < 0 || Number(s) > 1e6)) throw new Error('Enter four finite cutoff values between 0 and 1,000,000 V. This is a software input bound, not a calibrated instrument range.');
      if (Number(aMin) > Number(aMax) || Number(bMin) > Number(bMax)) throw new Error('Each range minimum must be at most its maximum.');
      if (selection.channelA === selection.channelB) throw new Error('Choose two different recorded channels.');
      return { result: analyzeCutoffEnvelope({ ...selection, rangeA: { min: Number(aMin), max: Number(aMax) }, rangeB: { min: Number(bMin), max: Number(bMax) } }), error: null };
    } catch (error) { return { result: null, error: (error as Error).message }; }
  }, [selection, aMin, aMax, bMin, bMax]);
  const r = calculated.result;
  const preset = (min: number, max: number) => { setAMin(String(min)); setAMax(String(max)); setBMin(String(min)); setBMax(String(max)); };
  return <>
    <ResearchHeading eyebrow="SMOKE LAB / CUTOFF RANGE" title="Does the finding survive the cutoff choice?">Declare a range for each recorded channel. Inspect the exact extremes, flight differences and source rows across every cutoff pair in that rectangle.</ResearchHeading>
    <section className="panel"><h2>Choose the cohort and cutoff ranges</h2><p className="hint">The two voltage scales remain separate. These ranges are analyst choices, not alarm settings, calibration uncertainty or equivalent physical responses.</p>
      <div className="form-grid range-form-grid">
        <label>Range audit flight<select value={selection.flight} onChange={(e) => update({ flight: e.target.value as CutoffEnvelopeSelection['flight'] })}><option value="all">Both flights</option><option value="1">Flight 1 · SAME</option><option value="2">Flight 2 · SAME-R</option></select></label>
        <label>Range audit material<select value={selection.material} onChange={(e) => update({ material: e.target.value as CutoffEnvelopeSelection['material'] })}><option value="all">All materials</option>{DETECTOR_MATERIALS.map((m) => <option key={m}>{m}</option>)}</select></label>
        <label>Range channel A<select value={selection.channelA} onChange={(e) => update({ channelA: e.target.value as CutoffEnvelopeSelection['channelA'] })}>{DETECTOR_CHANNEL_IDS.map((id) => <option key={id} value={id}>{DETECTOR_CHANNELS[id].label}</option>)}</select></label>
        <label>Range channel B<select value={selection.channelB} onChange={(e) => update({ channelB: e.target.value as CutoffEnvelopeSelection['channelB'] })}>{DETECTOR_CHANNEL_IDS.map((id) => <option key={id} value={id}>{DETECTOR_CHANNELS[id].label}</option>)}</select></label>
        <label>A range minimum (V)<input type="number" min="0" step="any" value={aMin} onChange={(e) => setAMin(e.target.value)} /></label>
        <label>A range maximum (V)<input type="number" min="0" step="any" value={aMax} onChange={(e) => setAMax(e.target.value)} /></label>
        <label>B range minimum (V)<input type="number" min="0" step="any" value={bMin} onChange={(e) => setBMin(e.target.value)} /></label>
        <label>B range maximum (V)<input type="number" min="0" step="any" value={bMax} onChange={(e) => setBMax(e.target.value)} /></label>
      </div>
      <div className="row"><label><input type="checkbox" checked={selection.includeReference} onChange={(e) => update({ includeReference: e.target.checked })} /> Include DBP references in the range audit</label><label><input type="checkbox" checked={!!selection.requireRecordedNoFanProblem} onChange={(e) => update({ requireRecordedNoFanProblem: e.target.checked })} /> Require recorded “n” for the range audit</label></div>
      <p className="hint">Unrecorded fan status is unclassified. Requiring a recorded “n” changes the cohort; it does not prove normal operation.</p>
      <div className="row"><button className="btn" onClick={() => preset(1, 3)}>Use [1, 3] V ranges</button><button className="btn" onClick={() => preset(0, 5)}>Widen to [0, 5] V</button></div>
      {selection.exclusions.length > 0 && <div className="notice info"><p>{selection.exclusions.length} explicit exclusions carried from the paired audit or scenario.</p><ul>{selection.exclusions.map((e) => <li key={e.recordId}>{e.recordId}: {e.reason}</li>)}</ul><button className="btn" onClick={() => update({ exclusions: [] })}>Clear range-audit exclusions</button></div>}
      {calculated.error && <p className="notice err" role="alert">{calculated.error}</p>}
    </section>
    {r && <section className="panel" aria-labelledby="range-result-title"><p className="eyebrow">EXACT FINITE-DATA RESULT</p><h2 id="range-result-title">Cutoff-range audit</h2>
      <div className="envelope-stats"><Stat value={`${r.summary.pairedFiniteRows} / ${r.summary.selectedRows}`} label="jointly finite / retained rows" /><Stat value={bounds(r.summary.pairedDifferenceEnvelope)} label="pooled A-minus-B range" /><Stat value={signLabel[r.summary.pairedDifferenceEnvelope.stability]} label="across every selected cutoff pair" /></div>
      <p className="hint">A-minus-B compares the fractions at or above each channel’s own cutoff on the same finite rows. A positive value does not establish a better detector.</p>
      <div className="notice info"><ul>{r.flags.map((f) => <li key={f.code}>{f.message}</li>)}</ul></div>
      <EnvelopePlot result={r} />
      <p className="hint">Teal: jointly finite rows. Grey: unrestricted completions of unavailable readings, on all retained rows. These are exact descriptive bounds, not confidence intervals.</p>
      <p className="hint">Scroll the table sideways on a small screen to compare both denominators.</p>
      <div className="scroll-x"><table className="range-table" aria-label="Cutoff range by flight"><thead><tr><th scope="col">Cohort</th><th scope="col">Jointly finite range</th><th scope="col">Sign across the rectangle</th><th scope="col">Including unavailable completions</th></tr></thead><tbody>
        {[{ label: 'Pooled', summary: r.summary }, ...r.byFlight.map((f) => ({ label: `Flight ${f.flight}`, summary: f.summary }))].map((g) => <tr key={g.label}><th scope="row">{g.label}</th><td>{bounds(g.summary.pairedDifferenceEnvelope)}</td><td>{signLabel[g.summary.pairedDifferenceEnvelope.stability]}</td><td>{bounds(g.summary.completionDifferenceEnvelope)}</td></tr>)}
      </tbody></table></div>
      <details><summary>Why these bounds are exact</summary><p>Increasing A’s cutoff can only remove A readings from its at-or-above count. Increasing B’s cutoff can only remove B readings, increasing A minus B. The population and denominator stay fixed.</p><p>Minimum witness: A = {r.summary.minimum.cutoffA} V and B = {r.summary.minimum.cutoffB} V. Maximum witness: A = {r.summary.maximum.cutoffA} V and B = {r.summary.maximum.cutoffB} V. Both corners belong to the closed rectangle.</p><p>No fitted model, grid approximation, probability distribution over cutoffs or confidence level is used. Missing-reading bounds allow every unknown binary classification; they do not fill in source measurements.</p></details>
      <details><summary>Exact step intervals and equality ties</summary><p>A reading equal to the cutoff is included. Brackets include the endpoint; parentheses exclude it. Counts remain constant within each listed interval. The JSON identifies tied and dropped source rows.</p>
        <div className="opportunity-grid">{(['channelA', 'channelB'] as const).map((side) => <div key={side}><h3>{side === 'channelA' ? 'Channel A' : 'Channel B'} · {r[side].label}</h3><div className="scroll-x"><table aria-label={`${side} exact steps`}><thead><tr><th>Cutoff interval · V</th><th>Jointly finite at/above</th><th>All finite at/above</th></tr></thead><tbody>{r.summary.profiles[side].steps.map((s, i) => <tr key={i}><td>{s.lower === s.upper ? `{${s.lower}}` : `${s.lowerInclusive ? '[' : '('}${s.lower}, ${s.upper}]`}</td><td>{s.jointFiniteAtOrAbove} / {r.summary.pairedFiniteRows}</td><td>{s.finiteAtOrAbove} / {r.summary.profiles[side].finiteRows}</td></tr>)}</tbody></table></div></div>)}</div>
      </details>
      <details><summary>Material strata, source cells and exclusions</summary><ul>{r.byMaterial.filter((m) => m.summary.selectedRows).map((m) => <li key={m.material}>{m.material}: {bounds(m.summary.pairedDifferenceEnvelope)}; {m.summary.selectedRows} retained rows.</li>)}</ul><p>{r.policy.pairing}</p>
        <div className="scroll-x"><table aria-label="Range source witnesses"><thead><tr><th>Row / material</th><th>A cell / stored reading</th><th>B cell / stored reading</th></tr></thead><tbody>{r.rows.map((row) => <tr key={row.record.id}><td>{row.record.excelRow} · {row.record.material}</td><td>{row.measurementA.cell}: {row.measurementA.originalValue ?? '(blank)'}</td><td>{row.measurementB.cell}: {row.measurementB.originalValue ?? '(blank)'}</td></tr>)}</tbody></table></div>
        <p>{r.excludedRows.length} excluded source rows; the export retains each reason.</p><ul>{r.excludedRows.map((row) => <li key={row.record.id}>Row {row.record.excelRow}: {row.reasons.join('; ')}</li>)}</ul><ul>{r.instrumentNotes.map((note) => <li key={note}>{note}</li>)}</ul><p>The existing CSV/workbook identity conflict remains unresolved.</p><a href={r.source.recordUrl} target="_blank" rel="noreferrer">NASA source record ↗</a><SourceHash hash={r.source.workbook.sha256} />
      </details>
      <p className="hint">{r.reviewStatement}</p><div className="row"><button className="btn" onClick={() => downloadResearch('ignis-cutoff-range-audit.json', r)}>Export cutoff-range audit</button><button className="btn primary" onClick={() => onBrief({ kind: 'cutoff_envelope', options: r.selection })}>Attach cutoff range to brief</button></div>
      <ShareScenario selection={{ kind: 'cutoff_envelope', options: r.selection }} />
    </section>}
  </>;
}
