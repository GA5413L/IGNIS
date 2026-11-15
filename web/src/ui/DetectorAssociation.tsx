'use client';

import { useMemo, useRef, useState } from 'react';
import { analyzeDetectorAssociation, createAssociationPackage, replayAssociationPackage, type AssociationRow, type AssociationSummary, type DetectorAssociationSelection } from '../core/detectorAssociation';
import { type DetectorMaterial } from '../core/detector';
import { digestOf } from '../core/canonicalize';
import { download, short, signed } from './lib';
import type { ChartPalette } from './palette';
import MaterialLegend, { MaterialMark, materialColor } from './MaterialLegend';

const rhoText = (value: number | null) => value === null ? 'Undefined' : signed(value, 4);
const voltageText = (value: number | null) => value === null ? 'unavailable' : Number(value.toPrecision(7)).toString();
const STATUS: Record<string, string> = {
  insufficient_pairs: 'Fewer than three paired rows', constant_a: 'Channel A is constant', constant_b: 'Channel B is constant', constant_both: 'Both channels are constant',
};

function Scatter({ rows, visibleMaterials, ranks, palette, labelA, labelB, onInspect }: {
  rows: AssociationRow[]; visibleMaterials: DetectorMaterial[]; ranks: boolean; palette: ChartPalette; labelA: string; labelB: string; onInspect: (id: string) => void;
}) {
  const pairs = rows.filter((r) => r.availability === 'bothFinite');
  const values = pairs.map((row) => ({ row, a: ranks ? row.rankA! : row.measurementA.value!, b: ranks ? row.rankB! : row.measurementB.value! }));
  const extent = (v: number[]) => { const lo = Math.min(...v), hi = Math.max(...v); return lo === hi ? [lo - 0.5, hi + 0.5] : [lo, hi]; };
  if (!pairs.length) return <p>No jointly finite rows to plot.</p>;
  const [a0, a1] = extent(values.map((v) => v.a)), [b0, b1] = extent(values.map((v) => v.b));
  const w = 650, h = 360, l = 66, r = 18, t = 18, b = 64;
  const px = (v: number) => l + (v - a0) / (a1 - a0) * (w - l - r), py = (v: number) => h - b - (v - b0) / (b1 - b0) * (h - t - b);
  const compact = (v: number) => Number(v.toPrecision(4)).toString();
  return <div className="chart-box" role="region" tabIndex={0} aria-label="Association plot; scroll horizontally on a small screen"><svg className="chart" viewBox={`0 0 ${w} ${h}`} data-testid="association-scatter" data-x-domain={`${a0},${a1}`} data-y-domain={`${b0},${b1}`} role="group" aria-label={`Paired ${ranks ? 'average ranks' : 'stored voltages'} by material; select a point to inspect its source cells`}>
    {[0, 0.25, 0.5, 0.75, 1].map((f) => <g key={f}>
      <line className="grid" x1={px(a0 + f * (a1 - a0))} x2={px(a0 + f * (a1 - a0))} y1={t} y2={h - b} />
      <text x={px(a0 + f * (a1 - a0))} y={h - b + 20} textAnchor="middle">{compact(a0 + f * (a1 - a0))}</text>
      <line className="grid" x1={l} x2={w - r} y1={py(b0 + f * (b1 - b0))} y2={py(b0 + f * (b1 - b0))} />
      <text x={l - 10} y={py(b0 + f * (b1 - b0)) + 4} textAnchor="end">{compact(b0 + f * (b1 - b0))}</text>
    </g>)}
    <text className="lbl" x={(l + w - r) / 2} y={h - 18} textAnchor="middle">{labelA} · {ranks ? 'average rank' : 'stored V'}</text>
    <text className="lbl" transform={`translate(17 ${(t + h - b) / 2}) rotate(-90)`} textAnchor="middle">{labelB} · {ranks ? 'average rank' : 'stored V'}</text>
    {values.filter(({ row }) => visibleMaterials.includes(row.record.material)).map(({ row, a, b: bv }) => {
      const color = materialColor(row.record.material, palette);
      const label = `${row.record.material}, ${row.record.flightLabel}, ${row.measurementA.cell} ${row.measurementA.value} V, ${row.measurementB.cell} ${row.measurementB.value} V`;
      return <g key={row.record.id} data-record-id={row.record.id} data-material={row.record.material} data-point-x={px(a)} data-point-y={py(bv)} tabIndex={0} role="button" aria-label={`Inspect ${row.measurementA.cell} and ${row.measurementB.cell}`} style={{ cursor: 'pointer' }}
        onClick={() => onInspect(row.record.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onInspect(row.record.id); } }}>
        <title>{label}</title><circle cx={px(a)} cy={py(bv)} r={8} fill="transparent" /><MaterialMark material={row.record.material} x={px(a)} y={py(bv)} color={color} />
      </g>;
    })}
    {!values.some(({ row }) => visibleMaterials.includes(row.record.material)) && <text x={(l + w - r) / 2} y={(t + h - b) / 2} textAnchor="middle">No jointly finite rows visible</text>}
  </svg></div>;
}

function Deletion({ summary }: { summary: AssociationSummary }) {
  const d = summary.deletion;
  if (d.status === 'unidentified_rows') return <span>{d.unidentifiedRecordIds.length} rows lack a sample ID; deletion audit unavailable</span>;
  if (d.status !== 'computed') return <span>Insufficient recorded groups</span>;
  return <><span className="mono">{rhoText(d.minimumRho)} to {rhoText(d.maximumRho)}</span><small style={{ display: 'block' }}>{d.definedDeletions}/{d.deletions.length} deletions defined{d.signChangeFromBaseline ? ' · sign changes' : ''}</small></>;
}

export default function DetectorAssociation({ selection, palette }: { selection: DetectorAssociationSelection; palette: ChartPalette }) {
  const [ranks, setRanks] = useState(false), [inspected, setInspected] = useState<string | null>(null), [replayMessage, setReplayMessage] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<DetectorMaterial[] | null>(null);
  const readGeneration = useRef(0);
  const computed = useMemo(() => {
    try { return { result: analyzeDetectorAssociation(selection), error: null }; }
    catch (e) { return { result: null, error: selection.channelA === selection.channelB ? 'Choose two distinct channels.' : (e as Error).message }; }
  }, [selection]);
  const result = computed.result;
  if (!result) return <p role="alert" className="error">{computed.error}</p>;
  const summary = result.summary, row = result.rows.find((r) => r.record.id === inspected);
  const positive = result.byMaterial.filter((r) => (r.summary.association.rho ?? 0) > 0), negative = result.byMaterial.filter((r) => (r.summary.association.rho ?? 0) < 0);
  const exported = () => JSON.stringify(createAssociationPackage(result), null, 2);
  const rows: { label: string; summary: AssociationSummary }[] = [{ label: 'All selected rows', summary }, ...result.byMaterial.filter((r) => r.summary.selectedRows).map((r) => ({ label: r.material, summary: r.summary }))];
  const legendItems = result.byMaterial.filter((entry) => entry.summary.selectedRows).map((entry) => ({ id: entry.material, count: entry.summary.pairedFiniteRows }));
  const visibleMaterials = legendItems.filter((item) => selectedMaterials === null || selectedMaterials.includes(item.id)).map((item) => item.id);
  const visibleRows = result.rows.filter((entry) => entry.availability === 'bothFinite' && visibleMaterials.includes(entry.record.material));
  const exportView = () => {
    const body = { schemaVersion: 'ignis-association-view-1', analysis: createAssociationPackage(result),
      recipe: { coordinates: ranks ? 'average-ranks' : 'stored-voltages', palette, visibleMaterials,
        axisPolicy: 'Fixed from all jointly finite rows in the analysis selection; hiding materials does not rerank or refit.',
        populationPolicy: 'Display visibility only. Statistical summaries and ranks retain the complete analysis selection.',
      }, visibleRecordIds: visibleRows.map((entry) => entry.record.id),
      visiblePoints: visibleRows.map((entry) => ({ recordId: entry.record.id, material: entry.record.material,
        a: ranks ? entry.rankA : entry.measurementA.value, b: ranks ? entry.rankB : entry.measurementB.value })),
    };
    download('ignis-association-visible-view.json', JSON.stringify({ ...body, checksum: digestOf(body) }, null, 2));
  };
  return <section className="stack" aria-labelledby="association-heading">
    <div className="card">
      <h2 id="association-heading" className="headline">{positive.length && negative.length ? 'Material-specific associations point in different directions' : 'How closely do the two channels rank the selected rows?'}</h2>
      <p><strong>Spearman ρ = <span data-testid="association-rho">{rhoText(summary.association.rho)}</span></strong> across {summary.pairedFiniteRows} jointly finite rows; {summary.selectedRows - summary.pairedFiniteRows} of {summary.selectedRows} selected rows are unavailable on one or both channels.</p>
      {summary.association.status !== 'defined' && <p>{STATUS[summary.association.status]}</p>}
      <p>Ranks measure monotonic co-variation. These channels have different measurement operators: association does not establish interchangeable readings, detector quality or a causal material effect.</p>
      {positive.length > 0 && negative.length > 0 && <p>Positive within {positive.map((r) => r.material).join(', ')}; negative within {negative.map((r) => r.material).join(', ')}. Compare the strata below before interpreting the pooled coefficient.</p>}
      <div className="btn-row" role="group" aria-label="Association plot values"><button type="button" className="chip" aria-pressed={!ranks} onClick={() => setRanks(false)}>Stored voltages</button><button type="button" className="chip" aria-pressed={ranks} onClick={() => setRanks(true)}>Average ranks</button></div>
      <MaterialLegend items={legendItems} selected={selectedMaterials} onChange={(next) => { setSelectedMaterials(next); setInspected(null); }} palette={palette} label="Association material visibility" countLabel="paired rows" />
      <Scatter rows={result.rows} visibleMaterials={visibleMaterials} ranks={ranks} palette={palette} labelA={result.channelA.label} labelB={result.channelB.label} onInspect={setInspected} />
      <p data-testid="association-visible-count">Showing {visibleRows.length} of {summary.pairedFiniteRows} paired rows. Legend choices change visibility only; axes, ranks and the statistical summaries retain the complete analysis selection.</p>
      <button type="button" className="btn ghost" onClick={exportView}>Download visible plot data</button>
      <p className="muted">No jitter or fitted line. Coincident points can overlap; every selected row is available in the source table and export. Average ranks use the complete selected paired population; each table stratum is ranked separately.</p>
      <p>Ranks ignore response amplitude. Check the paired voltage ranges below: a coefficient can reflect small stored differences. Deleting sample labels does not test sensitivity to measurement error, rounding or instrument saturation; resolution and saturation limits are unverified here.</p>
      {row && <article className="card flat" aria-label="Association source cells"><h3>{row.record.material} · {row.record.flightLabel} · workbook row {row.record.excelRow}</h3>
        <p>{row.measurementA.cell}: {row.measurementA.originalValue ?? '(blank)'} V; {row.measurementB.cell}: {row.measurementB.originalValue ?? '(blank)'} V.</p>
        <p>Recorded sample ID: {row.record.sampleId ?? 'unreported'}; Test ID: {row.record.testId ?? 'unreported'}; SAME #: {row.record.sameTestNumber ?? 'unreported'}.</p><p className="muted">Sheet {row.record.sheet}; workbook {short(row.record.workbookSha256)}. Sample labels are recorded groupings, not verified independent specimens.</p>
      </article>}
    </div>
    <div className="card"><h3>Material strata and sample-deletion sensitivity</h3><p>Recompute the ranks after deleting every row with one recorded flight + sample ID, one group at a time. The resulting range describes influence within these rows; it is not a confidence interval or an estimate of independent replication.</p>
      <div className="table-wrap" role="region" tabIndex={0} aria-label="Material comparison table; scroll horizontally on a small screen"><table aria-label="Association by material"><thead><tr><th scope="col">Stratum</th><th scope="col">Paired / selected</th><th scope="col">Spearman ρ</th><th scope="col">Paired voltage ranges</th><th scope="col">Delete one recorded group</th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r.label}><th scope="row">{r.label}</th><td>{r.summary.pairedFiniteRows} / {r.summary.selectedRows}</td><td className="mono">{rhoText(r.summary.association.rho)}{r.summary.association.status !== 'defined' && <small style={{ display: 'block' }}>{STATUS[r.summary.association.status]}</small>}</td>
          <td>{(['A', 'B'] as const).map((side) => { const range = r.summary.association[side === 'A' ? 'rangeA' : 'rangeB']; return <small key={side} style={{ display: 'block' }}>{side}: {voltageText(range.minimum)} to {voltageText(range.maximum)} V<br />span {voltageText(range.span)} V</small>; })}</td>
          <td><Deletion summary={r.summary} /></td></tr>)}</tbody></table></div>
      <details><summary>Flight strata and every deletion</summary><div className="details-body">
        {result.byFlight.filter((f) => f.summary.selectedRows).map((f) => <div key={f.flight}><h4>{f.label}: {f.summary.pairedFiniteRows} paired rows; ρ {rhoText(f.summary.association.rho)}</h4><p><Deletion summary={f.summary} /></p>
          <div className="table-wrap" style={{ maxHeight: 320 }}><table><thead><tr><th>Recorded sample removed</th><th>Rows removed</th><th>Remaining ρ</th></tr></thead><tbody>{f.summary.deletion.deletions.map((d) => <tr key={d.groupKey}><th scope="row">{d.sampleId}</th><td>{d.removedRows} ({d.removedPairedRows} paired)</td><td>{rhoText(d.association.rho)}</td></tr>)}</tbody></table></div>
        </div>)}
      </div></details>
      <details><summary>Every selected source row</summary><div className="table-wrap" style={{ maxHeight: 420 }}><table><thead><tr><th>Workbook row</th><th>Material / flight</th><th>Channel A</th><th>Channel B</th><th>Recorded sample</th></tr></thead><tbody>{result.rows.map((r) => <tr key={r.record.id}><th scope="row"><button type="button" className="link-btn" onClick={() => setInspected(r.record.id)}>Inspect row {r.record.excelRow}</button></th><td>{r.record.material} / {r.record.flightLabel}</td><td>{r.measurementA.cell}: {r.measurementA.originalValue ?? '(blank)'}</td><td>{r.measurementB.cell}: {r.measurementB.originalValue ?? '(blank)'}</td><td>{r.record.sampleId ?? 'unreported'}</td></tr>)}</tbody></table></div></details>
      <div className="btn-row"><button type="button" className="btn" onClick={() => download('ignis-detector-association.json', exported())}>Download statistical analysis</button>
        <a className="btn ghost" href="/figures/code/plot-detector-association.py" download>Download analysis and figure code</a></div>
      <p className="muted">The JSON contains source cells, strata, all deletion results and source/method hashes. The Python script recomputes the statistics from those cells and can regenerate a figure. Use the CLI to recheck the selection against the current curated source.</p>
      <label className="field"><span>Recheck statistical analysis · JSON, up to 2 MiB</span><input type="file" accept=".json,application/json" onChange={async (e) => {
        const generation = ++readGeneration.current, file = e.target.files?.[0]; e.target.value = ''; setReplayMessage(''); if (!file) return;
        if (file.size > 2 * 1024 * 1024) { setReplayMessage('File exceeds the 2 MiB limit.'); return; }
        try { const checked = replayAssociationPackage(await file.text()); if (generation === readGeneration.current) setReplayMessage(`Recomputed identically against the current curated source: ${file.name}, ${checked.result.summary.pairedFiniteRows} paired rows. The imported selection is checked separately from the current view.`); }
        catch (error) { if (generation === readGeneration.current) setReplayMessage((error as Error).message); }
      }} /></label>{replayMessage && <p role="status">{replayMessage}</p>}
      <details><summary>Definitions, ties and scientific limits</summary><div className="details-body"><p>{result.method.tiePolicy}</p><p>{result.method.deletionMeaning}</p><p>{result.reviewStatement}</p>
        {result.flags.map((flag) => <p key={flag.code}>{flag.message}</p>)}{result.instrumentNotes.map((note) => <p key={note}>{note}</p>)}
        <p>{summary.association.tiedRowsA} paired rows participate in ties on A; {summary.association.tiedRowsB} on B. No p-values or uncertainty intervals are estimated.</p>
        <p>{result.identityConflicts.length} unresolved source-identity conflict(s) remain in the export. The source workbook is not included.</p>
        {result.method.references.map((ref) => <p key={ref.url}><a href={ref.url} target="_blank" rel="noreferrer">{ref.title}</a></p>)}
      </div></details>
      <div className="card-foot"><a href={result.source.recordUrl} target="_blank" rel="noreferrer">NASA {result.source.accession}, v{result.source.recordVersion}</a><span>{result.methodRevision}</span><span>workbook {short(result.source.workbook.sha256)}</span></div>
    </div>
  </section>;
}
