'use client';
import { useMemo, useState } from 'react';
import { compareConditions, conditionDataset, type ConditionComparison } from '../core/conditions';
import { downloadResearch, ResearchHeading, SourceHash, Stat } from './researchShared';
import type { ConditionSelection } from '../core/researchSelections';
import ShareScenario from './ShareScenario';

const signed = (n: number) => `${n > 0 ? '+' : ''}${n}`;

function ConditionPlot({ comparison }: { comparison: ConditionComparison }) {
  const { target, cases } = comparison;
  const ox = [target.oxygenPercent, ...cases.map((c) => c.oxygenPercent)];
  const pr = [target.pressureKPa, ...cases.map((c) => c.pressureKPa)];
  const minO = Math.max(0, Math.min(...ox) - 2); const maxO = Math.min(100, Math.max(...ox) + 2);
  const minP = Math.max(0, Math.min(...pr) - 8); const maxP = Math.max(...pr) + 8;
  const x = (v: number) => 68 + (v - minO) / (maxO - minO) * 500;
  const y = (v: number) => 298 - (v - minP) / (maxP - minP) * 247;
  const frontier = new Set(comparison.frontier.strata.flatMap((s) => s.frontier.map((p) => p.id)));
  return <svg viewBox="0 0 630 365" className="scientific-chart" role="img" aria-labelledby="condition-plot-title condition-plot-desc">
    <title id="condition-plot-title">Atmosphere coordinates for the selected cohort</title>
    <desc id="condition-plot-desc">Squares show published cases; an outlined circle shows your target. The table below gives exact coordinates and gaps. No trajectory or interpolation is implied.</desc>
    {[0, .25, .5, .75, 1].map((t) => <g key={t}><line x1="68" x2="568" y1={51 + t * 247} y2={51 + t * 247} className="plot-grid" /><text x="57" y={55 + t * 247} textAnchor="end">{(maxP - t * (maxP - minP)).toFixed(1)}</text><text x={68 + t * 500} y="321" textAnchor="middle">{(minO + t * (maxO - minO)).toFixed(1)}</text></g>)}
    <text x="68" y="24" className="axis-caption">Pressure · kPa</text><text x="568" y="352" textAnchor="end" className="axis-caption">Oxygen · mole %</text>
    <line x1={x(target.oxygenPercent)} x2={x(target.oxygenPercent)} y1="51" y2="298" className="target-line" /><line x1="68" x2="568" y1={y(target.pressureKPa)} y2={y(target.pressureKPa)} className="target-line" />
    {cases.map((c, i) => <g key={c.id}><rect x={x(c.oxygenPercent) - 6} y={y(c.pressureKPa) - 6} width="12" height="12" rx="2" fill={frontier.has(c.id) ? '#087b72' : '#718096'} /><text x={x(c.oxygenPercent)} y={y(c.pressureKPa) + (i % 2 ? 24 : -14)} textAnchor="middle" className="plot-point-label">{c.sample}</text></g>)}
    <circle cx={x(target.oxygenPercent)} cy={y(target.pressureKPa)} r="9" fill="none" stroke="#b93815" strokeWidth="3" /><circle cx={x(target.oxygenPercent)} cy={y(target.pressureKPa)} r="2" fill="#b93815" /><text x={x(target.oxygenPercent)} y={y(target.pressureKPa) - 19} textAnchor="middle" className="plot-target-label">Your target</text>
  </svg>;
}

export default function Conditions({ onBrief, initialSelection }: { onBrief: (selection: ConditionSelection) => void; initialSelection?: ConditionSelection }) {
  const [cohortId, setCohort] = useState(initialSelection?.cohortId ?? 'PMMA-2');
  const [oxygen, setOxygen] = useState(String(initialSelection?.oxygenPercent ?? 34)); const [pressure, setPressure] = useState(String(initialSelection?.pressureKPa ?? 56.5));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const result = useMemo(() => {
    try {
      if (!oxygen.trim() || !pressure.trim()) throw new Error('Enter both oxygen and pressure to compare conditions.');
      return { value: compareConditions({ cohortId, oxygenPercent: Number(oxygen), pressureKPa: Number(pressure) }), error: null };
    } catch (e) { return { value: null, error: (e as Error).message }; }
  }, [cohortId, oxygen, pressure]);
  const comparison = result.value;
  const selected = comparison?.cases.find((c) => c.id === selectedId) ?? comparison?.cases[0];
  const placed = comparison?.frontier.strata.flatMap((s) => [...s.frontier, ...s.dominated.map((d) => d.point)]) ?? [];
  const frontierIds = new Set(comparison?.frontier.strata.flatMap((s) => s.frontier.map((p) => p.id)) ?? []);
  return <>
    <ResearchHeading eyebrow="01 / CONDITIONS" title="Which experiments approach your target?">Compare documented oxygen and pressure coordinates within one material and burning-side cohort. Keep each difference visible.</ResearchHeading>
    <div className="research-layout">
      <section className="panel control-panel" aria-labelledby="target-title"><h2 id="target-title">Set your comparison</h2><p className="hint">Your target is a research scenario, not an approved atmosphere.</p>
        <label htmlFor="cohort">Material & burning sides</label><select id="cohort" value={cohortId} onChange={(e) => { setCohort(e.target.value); setSelectedId(null); }}>{conditionDataset.cohorts.map((c) => <option key={c.id} value={c.id}>{c.material} · {c.sidesBurning} {c.sidesBurning === 1 ? 'side' : 'sides'} · {c.caseCount} {c.caseCount === 1 ? 'case' : 'cases'}</option>)}</select>
        <label htmlFor="oxygen">Target oxygen (mole %)</label><input id="oxygen" type="number" inputMode="decimal" min="0.01" max="100" step="any" value={oxygen} onChange={(e) => setOxygen(e.target.value)} />
        <label htmlFor="pressure">Target pressure (kPa)</label><input id="pressure" type="number" inputMode="decimal" min="0.01" max="2000" step="any" value={pressure} onChange={(e) => setPressure(e.target.value)} />
        <p className="hint">Explore a different coordinate:</p><div className="chips"><button className="chip" onClick={() => { setOxygen('34'); setPressure('56.5'); }}>34% / 56.5 kPa</button><button className="chip" onClick={() => { setCohort('PMMA-2'); setOxygen('22'); setPressure('54.4'); }}>Show a two-axis tradeoff</button></div>
        <p className="hint">These controls change the target; source observations stay fixed.</p>
        <button className="btn primary" disabled={!comparison} onClick={() => downloadResearch('IGNIS-condition-comparison.json', comparison)}>Export comparison JSON</button>
        {result.error && <p className="notice err" role="alert">{result.error}</p>}
      </section>
      <section className="panel chart-panel" aria-labelledby="conditions-chart-heading"><div className="section-heading"><div><p className="eyebrow">SAFFIRE IV–VI · 2026 TABLE 1</p><h2 id="conditions-chart-heading">Two axes. No hidden weighting.</h2></div><span className="badge ctx">Published coordinates</span></div>{comparison ? <><ConditionPlot comparison={comparison} /><div className="chart-legend"><span><i className="legend-square" /> On the condition-gap frontier</span><span><i className="legend-square muted" /> Farther on these axes</span><span><i className="legend-target" /> Your target</span></div></> : <p className="empty-chart">Enter valid target coordinates to display the comparison.</p>}</section>
    </div>
    {comparison && <>
      <section className="panel" aria-labelledby="gap-heading"><div className="section-heading"><div><p className="eyebrow">THE COMPARISON</p><h2 id="gap-heading">{frontierIds.size} of {comparison.cases.length} {comparison.cases.length === 1 ? 'case' : 'cases'} {frontierIds.size === 1 ? 'is' : 'are'} on this condition-gap frontier</h2><p className="hint">A case stays on the frontier when no other case is at least as close on both axes and closer on one. Ties are retained. This does not establish physical equivalence or predict fire behavior.</p></div></div>
        <div className="scroll-x"><table className="data-table" aria-label="Condition gaps"><thead><tr><th>Case</th><th>O₂ · mole %</th><th>Pressure · kPa</th><th>Δ O₂ · pp</th><th>Δ pressure · kPa</th><th>Coordinate result</th><th>Source</th></tr></thead><tbody>{comparison.cases.map((c) => {
          const point = placed.find((p) => p.id === c.id)!; const witness = comparison.frontier.strata.flatMap((s) => s.dominated).find((d) => d.point.id === c.id);
          return <tr key={c.id}><td><strong>{c.sample}</strong><small>{c.material} · {c.sidesBurning} sides</small></td><td className="num">{c.oxygenPercent}</td><td className="num">{c.pressureKPa}</td><td className="num">{signed(point.signed.o2!)}</td><td className="num">{signed(point.signed.pressure!)}</td><td><span className={`badge ${frontierIds.has(c.id) ? 'ok' : 'ctx'}`}>{frontierIds.has(c.id) ? 'Frontier' : `Closer case: ${comparison.cases.find((x) => x.id === witness?.dominatedBy)?.sample}`}</span></td><td><button className="linkbtn" onClick={() => setSelectedId(c.id)}>Inspect {c.sample}</button></td></tr>;
        })}</tbody></table></div><p className="hint">Δ = published coordinate minus your target; pp = percentage points. Dominance uses absolute gaps. Decimal arithmetic preserves the supplied decimal representation; measurement uncertainty is not inferred.</p>
      </section>
      {selected && <section className="panel source-panel" aria-labelledby="case-source-title"><div className="section-heading"><div><p className="eyebrow">SOURCE TRACE / {selected.sample}</p><h2 id="case-source-title">Keep the experiment attached</h2></div><a className="btn" href={comparison.source.pdfUrl + '#page=6'} target="_blank" rel="noreferrer">Read Table 1 · page 6 ↗</a></div>
        <div className="source-stats"><Stat value={selected.original.pressureMbar} label="mbar in the source" note={`× 0.1 = ${selected.pressureKPa} kPa`} /><Stat value={selected.original.oxygenMoleFraction} label="oxygen mole fraction" note={`× 100 = ${selected.oxygenPercent} mole %`} /><Stat value={`${selected.geometry.widthCm} × ${selected.geometry.lengthCm}`} label="specimen width × length · cm" note={`Thickness: ${selected.geometry.thicknessMm === null ? 'not reported' : `${selected.geometry.thicknessMm} mm`}`} /></div>
        <p>{selected.platform} · {selected.gravityRegime}. {selected.sidesBurning} burning {selected.sidesBurning === 1 ? 'side' : 'sides'}; {selected.thermalHistory.preheatMinutes === null ? 'preheating not established in this table' : `${selected.thermalHistory.preheatMinutes} minutes preheating (${selected.thermalHistory.preheatDescription})`}.</p>
        <div className="notice warn"><strong>Flow remains unresolved.</strong> The 2026 caption says opposed flow for all seven cases; the 2024 table says concurrent flow for its five listed cases (IV-1, V-2, VI-2, VI-3, VI-4). IV-2 and V-3 are absent from that earlier table. Flow is excluded from this comparison. Nominal 20 cm/s does not establish the full velocity history.</div>
        <p className="hint">Initial-flow duration: {selected.initialFlowDurationS === null ? 'not reported' : `${selected.initialFlowDurationS} s`}.{selected.flowHistory.reportedChange && ` The source also reports a reduction to ${selected.flowHistory.reportedChange.toCmS} cm/s at ${selected.flowHistory.reportedChange.atSeconds} s for this case.`}</p>
        {comparison.earlierSourceContext.map((source) => <div key={source.id}><a href={source.publicUrl} target="_blank" rel="noreferrer">Earlier flow statement: {source.version}, Table 1, PDF page {source.pdfPage} ↗</a><SourceHash hash={source.sha256} /></div>)}
        <details><summary>What a transfer assessment still needs</summary><ul>{comparison.comparisonPolicy.unreportedOrUnresolvedRequirements.map((r) => <li key={r}>{r}</li>)}</ul><p>Seven source cases across four cohorts are a bounded literature slice, not a map of all feasible atmospheres. Uncertainty is unreported here, not zero.</p></details>
        <SourceHash hash={comparison.source.sha256} /><p className="hint">{comparison.reviewStatement}</p>
      </section>}
    </>}
    {comparison && <ShareScenario selection={{ kind: 'conditions', cohortId, oxygenPercent: Number(oxygen), pressureKPa: Number(pressure) }} />}
    <div className="next-step"><div><span className="eyebrow">TAKE THE NEXT STEP</span><p>Attach this exact atmosphere comparison to published prevention findings.</p></div><button className="btn" disabled={!comparison} onClick={() => onBrief({ kind: 'conditions', cohortId, oxygenPercent: Number(oxygen), pressureKPa: Number(pressure) })}>Prepare a prevention brief →</button></div>
  </>;
}
