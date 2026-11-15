'use client';
import { useMemo, useState } from 'react';
import { analyzePairedDetector, DEFAULT_PAIR_SELECTION, type PairSelection, type PairSummary, type PairedDetectorResult } from '../core/pairedDetector';
import { detectorDataset, DETECTOR_CHANNEL_IDS, DETECTOR_CHANNELS, DETECTOR_MATERIALS } from '../core/detector';
import type { PairResearchSelection } from '../core/researchSelections';
import { downloadResearch, ResearchHeading, SourceHash, Stat } from './researchShared';
import ShareScenario from './ShareScenario';

const fraction = (s: PairSummary) => s.pairedDifference.denominator ? `${s.pairedDifference.numerator > 0 ? '+' : ''}${s.pairedDifference.numerator} / ${s.pairedDifference.denominator}` : 'No finite pairs';
function CohortPlot({ result }: { result: PairedDetectorResult }) {
  const groups = [{ label: 'Pooled', summary: result.summary }, ...result.byFlight.map((r) => ({ label: `Flight ${r.flight}`, summary: r.summary }))];
  const x = (n: number) => 350 + n * 200;
  return <svg className="scientific-chart" viewBox="0 0 650 230" role="img" aria-labelledby="pair-plot-title pair-plot-desc">
    <title id="pair-plot-title">At-or-above fraction difference by flight</title><desc id="pair-plot-desc">A fraction minus B fraction on jointly finite rows at independently declared cutoffs. Markers show descriptive fractions, not predictions or confidence intervals. The table gives exact denominators.</desc>
    {[-1, -.5, 0, .5, 1].map((n) => <g key={n}><line x1={x(n)} x2={x(n)} y1="22" y2="169" className={n === 0 ? 'target-line' : 'plot-grid'} /><text x={x(n)} y="192" textAnchor="middle">{n > 0 ? '+' : ''}{n}</text></g>)}
    {groups.map((g, i) => <g key={g.label}><text x="115" y={52 + i * 48} textAnchor="end">{g.label}</text>{g.summary.pairedDifference.fraction === null ? <text x="350" y={52 + i * 48} textAnchor="middle">Unavailable</text> : <><line x1={x(0)} x2={x(g.summary.pairedDifference.fraction)} y1={47 + i * 48} y2={47 + i * 48} stroke="#087b72" strokeWidth="4" /><circle cx={x(g.summary.pairedDifference.fraction)} cy={47 + i * 48} r="7" fill="#087b72" /></>}</g>)}
    <text x="350" y="220" textAnchor="middle" className="axis-caption">A fraction − B fraction · descriptive cutoffs</text>
  </svg>;
}
export default function PairedDetector({ onBrief, onRange, initialSelection }: { onBrief: (selection: PairResearchSelection) => void; onRange: (selection: PairSelection) => void; initialSelection?: PairResearchSelection }) {
  const [selection, setSelection] = useState<PairSelection>(initialSelection?.options ?? { ...DEFAULT_PAIR_SELECTION, exclusions: [] });
  const [cutoffA, setCutoffA] = useState(String(selection.cutoffA)), [cutoffB, setCutoffB] = useState(String(selection.cutoffB));
  const [excludeId, setExcludeId] = useState(''), [reason, setReason] = useState('');
  const update = (patch: Partial<PairSelection>) => setSelection((s) => ({ ...s, ...patch }));
  const calculated = useMemo(() => {
    try {
      if (!cutoffA.trim() || !cutoffB.trim()) throw new Error('Enter both descriptive cutoffs in volts.');
      return { result: analyzePairedDetector({ ...selection, cutoffA: Number(cutoffA), cutoffB: Number(cutoffB) }), error: null };
    } catch (e) { return { result: null, error: (e as Error).message }; }
  }, [selection, cutoffA, cutoffB]);
  const r = calculated.result, c = r?.summary;
  const available = detectorDataset.records.filter((row) => (selection.flight === 'all' || row.flight === selection.flight) && (selection.material === 'all' || row.material === selection.material) && (selection.includeReference || row.materialRole !== 'reference') && !selection.exclusions.some((e) => e.recordId === row.id));
  return <>
    <ResearchHeading eyebrow="SMOKE LAB / PAIRED AUDIT" title="Does the pattern survive a different cohort?">Compare two recorded channels on the same source rows, then inspect what changes with flight, material, missing values and explicit exclusions.</ResearchHeading>
    <section className="panel"><h2>Define the comparison</h2><p className="hint">Each channel has its own descriptive voltage cutoff. Equal voltages do not establish equivalent physical responses or alarm settings.</p>
      <div className="form-grid">
        <label>Paired flight<select value={selection.flight} onChange={(e) => update({ flight: e.target.value as PairSelection['flight'] })}><option value="all">Both flights</option><option value="1">Flight 1 · SAME</option><option value="2">Flight 2 · SAME-R</option></select></label>
        <label>Paired material<select value={selection.material} onChange={(e) => update({ material: e.target.value as PairSelection['material'] })}><option value="all">All materials</option>{DETECTOR_MATERIALS.map((m) => <option key={m}>{m}</option>)}</select></label>
        <label>Channel A<select value={selection.channelA} onChange={(e) => update({ channelA: e.target.value as PairSelection['channelA'] })}>{DETECTOR_CHANNEL_IDS.map((id) => <option key={id} value={id}>{DETECTOR_CHANNELS[id].label}</option>)}</select></label>
        <label>Channel A cutoff (V)<input type="number" min="0" step="any" value={cutoffA} onChange={(e) => setCutoffA(e.target.value)} /></label>
        <label>Channel B<select value={selection.channelB} onChange={(e) => update({ channelB: e.target.value as PairSelection['channelB'] })}>{DETECTOR_CHANNEL_IDS.map((id) => <option key={id} value={id}>{DETECTOR_CHANNELS[id].label}</option>)}</select></label>
        <label>Channel B cutoff (V)<input type="number" min="0" step="any" value={cutoffB} onChange={(e) => setCutoffB(e.target.value)} /></label>
      </div>
      <div className="row"><label><input type="checkbox" checked={selection.includeReference} onChange={(e) => update({ includeReference: e.target.checked })} /> Include paired DBP reference rows</label>
        <label><input type="checkbox" checked={!!selection.requireRecordedNoFanProblem} onChange={(e) => update({ requireRecordedNoFanProblem: e.target.checked })} /> Require literal “n” in the fan-problem field</label></div>
      <p className="hint">The fan-field option is a selection-sensitivity check. Blank status fields are unclassified, not evidence of a fan problem.</p>
      <details><summary>Explicit row exclusions</summary><p className="hint">Every excluded row and reason stays in the export. Changing the cohort can require clearing exclusions that are outside it.</p>
        <div className="form-grid"><label>Source row to exclude<select value={excludeId} onChange={(e) => setExcludeId(e.target.value)}><option value="">Choose a row</option>{available.map((row) => <option key={row.id} value={row.id}>Row {row.excelRow} · flight {row.flight} · {row.material} · sample {row.sampleId ?? 'unrecorded'}</option>)}</select></label>
          <label>Exclusion reason<input value={reason} maxLength={500} onChange={(e) => setReason(e.target.value)} /></label></div>
        <div className="row"><button className="btn" disabled={!available.some((row) => row.id === excludeId) || !reason.trim()} onClick={() => { update({ exclusions: [...selection.exclusions, { recordId: excludeId, reason: reason.trim() }] }); setExcludeId(''); setReason(''); }}>Add explicit exclusion</button>
          <button className="linkbtn" disabled={!selection.exclusions.length} onClick={() => update({ exclusions: [] })}>Clear explicit exclusions</button></div>
        <ul>{selection.exclusions.map((e) => <li key={e.recordId}>{e.recordId}: {e.reason}</li>)}</ul>
      </details>
      {calculated.error && <p className="notice err" role="alert">{calculated.error}</p>}
    </section>
    {r && c && <>
      <section className="panel" aria-labelledby="paired-result-h"><p className="eyebrow">DESCRIPTIVE RESULT</p><h2 id="paired-result-h">Paired readings and cohort sensitivity</h2>
        <div className="stats paired-stats"><Stat value={`${c.pairedFiniteRows} / ${c.selectedRows}`} label="jointly finite / retained rows" /><Stat value={fraction(c)} label="A minus B at/above fraction" /><Stat value={r.excludedRows.length} label="excluded source rows" /></div>
        <div className="notice info"><strong>Interpretation check:</strong><ul>{r.flags.map((f) => <li key={f.code}>{f.message}</li>)}</ul></div>
        <CohortPlot result={r} />
        <div className="scroll-x"><table aria-label="Paired flight comparison"><thead><tr><th scope="col">Cohort</th><th scope="col">Retained rows</th><th scope="col">Joint finite</th><th scope="col">A at/above − B at/above</th></tr></thead><tbody>
          <tr><th scope="row">Before exclusions</th><td>{r.baseSummary.selectedRows}</td><td>{r.baseSummary.pairedFiniteRows}</td><td>{fraction(r.baseSummary)}</td></tr>
          <tr><th scope="row">Retained pooled</th><td>{c.selectedRows}</td><td>{c.pairedFiniteRows}</td><td>{fraction(c)}</td></tr>
          {r.byFlight.map((f) => <tr key={f.flight}><th scope="row">Flight {f.flight} · {f.label}</th><td>{f.summary.selectedRows}</td><td>{f.summary.pairedFiniteRows}</td><td>{fraction(f.summary)}</td></tr>)}
        </tbody></table></div>
        <div className="scroll-x"><table aria-label="Paired two by two counts"><thead><tr><th scope="col">Jointly finite rows only</th><th scope="col">B below {r.channelB.cutoff} V</th><th scope="col">B at/above {r.channelB.cutoff} V</th></tr></thead><tbody>
          <tr><th scope="row">A below {r.channelA.cutoff} V</th><td>{c.pairCounts.aBelowBBelow}</td><td>{c.pairCounts.aBelowBAtOrAbove}</td></tr><tr><th scope="row">A at/above {r.channelA.cutoff} V</th><td>{c.pairCounts.aAtOrAboveBBelow}</td><td>{c.pairCounts.aAtOrAboveBAtOrAbove}</td></tr>
        </tbody></table></div>
        <details><summary>Missing values, material strata and finite completion bounds</summary><p>A: {c.marginalA.finite} finite, {c.marginalA.missing} blank, {c.marginalA.error} errors, {c.marginalA.nonNumeric} non-numeric. B: {c.marginalB.finite} finite, {c.marginalB.missing} blank, {c.marginalB.error} errors, {c.marginalB.nonNumeric} non-numeric.</p>
          <p>{c.availability.aOnly} A-only, {c.availability.bOnly} B-only and {c.availability.neither} neither-finite rows.</p>
          <p>Full-selection fraction difference bounds: {c.selectedRows ? `${c.completionDifferenceBounds.lowerNumerator}/${c.selectedRows} to ${c.completionDifferenceBounds.upperNumerator}/${c.selectedRows}` : 'undefined'}. {r.policy.completionBoundsMeaning}</p>
          <ul>{r.byMaterial.filter((m) => m.summary.selectedRows).map((m) => <li key={m.material}>{m.material}: {fraction(m.summary)}; {m.summary.selectedRows} retained rows.</li>)}</ul></details>
        <details><summary>Source cells, instrument notes and excluded rows</summary><ul>{r.instrumentNotes.map((s) => <li key={s}>{s}</li>)}</ul><p>{r.policy.pairing} The existing CSV/workbook identity conflict remains unresolved.</p>
          <div className="scroll-x"><table aria-label="Paired source witnesses"><thead><tr><th scope="col">Row / material</th><th scope="col">A cell / stored reading</th><th scope="col">B cell / stored reading</th><th scope="col">Fan flag / cell</th></tr></thead><tbody>{r.rows.map((row) => <tr key={row.record.id}><td>{row.record.excelRow} · {row.record.material}</td><td>{row.measurementA.cell}: {row.measurementA.originalValue ?? '(blank)'}</td><td>{row.measurementB.cell}: {row.measurementB.originalValue ?? '(blank)'}</td><td>{row.record.instrumentStatusAsRecorded.fanProblem.originalValue ?? '(unrecorded)'} · {row.record.instrumentStatusAsRecorded.fanProblem.cell}</td></tr>)}</tbody></table></div>
          <ul>{r.excludedRows.map((row) => <li key={row.record.id}>Row {row.record.excelRow}: {row.reasons.join('; ')}</li>)}</ul><a href={r.source.recordUrl} target="_blank" rel="noreferrer">NASA source record ↗</a><SourceHash hash={r.source.workbook.sha256} /></details>
        <p className="hint">{r.reviewStatement}</p><div className="row"><button className="btn" onClick={() => downloadResearch('ignis-paired-detector-audit.json', r)}>Export paired audit</button><button className="btn primary" onClick={() => onBrief({ kind: 'detector_pair', options: r.selection })}>Attach paired audit to brief</button></div>
        <ShareScenario selection={{ kind: 'detector_pair', options: r.selection }} />
        <div className="next-step"><p>Test whether this cohort’s result depends on one cutoff pair.</p><button className="btn" onClick={() => onRange(r.selection)}>Audit this cohort across cutoff ranges →</button></div>
      </section>
    </>}
  </>;
}
