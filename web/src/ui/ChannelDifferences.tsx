'use client';
import { useMemo, useState } from 'react';
import { ZodError } from 'zod';
import { channelDifferences, makeDifferencePackage, serializeDifferencePackage, type Pairing, type ChannelDifferences as DifferenceResult } from '../core/channelDifferences';
import type { CsvDocument, ImportSpec, ViewRecipe } from '../core/workbench';
import { download } from './lib';

const message = (error: unknown) => error instanceof ZodError ? error.issues.map((issue) => issue.message).join(' ') : (error as Error).message;

export default function ChannelDifferences({ document, name, spec, recipe, pairing, setPairing, consent, select }: {
  document: CsvDocument; name: string; spec: ImportSpec; recipe: ViewRecipe; pairing: Pairing | null; setPairing: (value: Pairing | null) => void; consent: boolean; select: (record: number) => void;
}) {
  const [left, setLeft] = useState(pairing?.leftColumn ?? -1), [right, setRight] = useState(pairing?.rightColumn ?? -1);
  const [aligned, setAligned] = useState(!!pairing), [processing, setProcessing] = useState(pairing?.upstreamProcessing ?? ''), [error, setError] = useState('');
  const [linear, setLinear] = useState(!!pairing?.linearAdditiveQuantity), [sharedDatum, setSharedDatum] = useState(!!pairing?.sharedReferenceDatum), [datum, setDatum] = useState(pairing?.referenceDatum ?? '');
  const state = useMemo(() => { if (!pairing) return { result: null, error: '' }; try { return { result: channelDifferences(document, spec, recipe, pairing), error: '' }; } catch (e) { return { result: null, error: message(e) }; } }, [document, spec, recipe, pairing]);
  const edit = () => { setPairing(null); setError(''); };
  const result = state.result;
  return <section className="section" aria-labelledby="channel-difference-title"><div className="section-head"><h2 id="channel-difference-title">Compare two channels</h2><span className="tag outline">Within one run and phase</span></div>
    <p>Inspect left-minus-right differences for a linear, additive quantity with a shared reference or datum. Matching quantity labels, units and operators alone cannot establish this: circular angles and logarithmic readings require a different comparison. Declare the upstream alignment and processing.</p>
    <div className="fields">{(['Left channel', 'Right channel'] as const).map((label, i) => <label className="field" key={label}><span>{label}</span><select value={i ? right : left} onChange={(e) => { edit(); (i ? setRight : setLeft)(Number(e.target.value)); }}>
      <option value={-1}>Choose a channel</option>{spec.channels.map((c) => <option key={c.column} value={c.column}>{c.column + 1}: {document.records[spec.headerRecord - 1].cells[c.column]} · {c.quantity} ({c.unit})</option>)}</select></label>)}</div>
    <label className="field"><span>Upstream alignment and processing</span><textarea rows={2} maxLength={1000} value={processing} onChange={(e) => { edit(); setProcessing(e.target.value); }} placeholder="State the common clock, any resampling or offsets, and which data were used to fit or calibrate either channel." /></label>
    <label className="field"><span>Shared reference or datum</span><input type="text" maxLength={500} value={datum} onChange={(e) => { edit(); setDatum(e.target.value); }} placeholder="Describe the common zero, reference frame or baseline for both channels." /></label>
    <label className="check"><input type="checkbox" checked={linear} onChange={(e) => { edit(); setLinear(e.target.checked); }} />I assert that ordinary subtraction is meaningful on a linear, additive scale, without circular wrapping or logarithmic subtraction.</label>
    <label className="check"><input type="checkbox" checked={sharedDatum} onChange={(e) => { edit(); setSharedDatum(e.target.checked); }} />I assert that both channels use the stated common reference or datum.</label>
    <label className="check"><input type="checkbox" checked={aligned} onChange={(e) => { edit(); setAligned(e.target.checked); }} />I assert that the two values in each selected row refer to the same time and physical context.</label>
    <button type="button" className="btn ghost" disabled={left < 0 || right < 0 || left === right || !aligned || !linear || !sharedDatum || !datum.trim() || !processing.trim()} onClick={() => setPairing({ leftColumn: left, rightColumn: right, alignedByRecord: true, linearAdditiveQuantity: true, sharedReferenceDatum: true, referenceDatum: datum, upstreamProcessing: processing })}>Compute channel differences</button>
    {(error || state.error) && <p className="error" role="alert">{error || state.error}</p>}
    {result && <div className="stack">
      {result.blockers.length > 0 && <div className="card flat" role="status"><h3>Comparison needs compatible declarations</h3><ul className="bullets">{result.blockers.map((b) => <li key={b}>{b}</li>)}</ul><p>Equal units do not imply equal measurement meaning. Review the mapping above.</p></div>}
      <p>{result.counts.paired} paired of {result.counts.selected} selected records · {result.counts.unavailablePairs} unavailable pairs · {result.counts.arithmeticOverflow} arithmetic overflows. {result.counts.excludedRecords} source records remain outside this selection or have unusable time/identity.</p>
      <aside className="card flat" aria-label="Declared comparison assumptions">
        <h3>Declared comparison assumptions</h3><p>{result.assumptions.linearAdditiveQuantity}</p>
        <p style={{ overflowWrap: 'anywhere' }}><strong>Shared reference or datum:</strong> {result.assumptions.referenceDatum}</p>
        <p style={{ overflowWrap: 'anywhere' }}><strong>Upstream processing:</strong> {result.assumptions.upstreamProcessing}</p>
        <p>{result.declarationStatus}</p><p>{result.alignmentCaveat}</p><p>{result.interpretation}</p>
      </aside>
      {result.metrics && <><div className="local-plot-scroll" role="region" tabIndex={0} aria-label="Channel difference plot"><DifferencePlot result={result} timeUnit={spec.timeUnit} select={select} /></div>
        <dl className="kv"><dt>Mean difference</dt><dd>{result.metrics.meanDifference === null ? 'Unavailable (numeric range)' : `${result.metrics.meanDifference} ${result.unit}`}</dd><dt>Mean absolute difference</dt><dd>{result.metrics.meanAbsoluteDifference === null ? 'Unavailable (numeric range)' : `${result.metrics.meanAbsoluteDifference} ${result.unit}`}</dd>
          <dt>Root mean square difference</dt><dd>{result.metrics.rootMeanSquareDifference === null ? 'Unavailable (numeric range)' : `${result.metrics.rootMeanSquareDifference} ${result.unit}`}</dd><dt>Largest absolute difference</dt><dd>{result.metrics.maximumAbsoluteDifference} {result.unit} · records {result.metrics.maximumRecords.join(', ')}</dd></dl></>}
      {result.numericalWarnings.length > 0 && <div role="status"><ul className="bullets">{result.numericalWarnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div>}
      {!result.metrics && !result.blockers.length && <p>No aggregate is available. Missing pairs remain missing; any arithmetic overflow blocks the aggregate.</p>}
      <p className="muted">{result.scope}</p>
      <details><summary>Pair ledger and declarations</summary><pre className="local-json">{JSON.stringify({ pairing, result }, null, 2)}</pre></details>
      <button type="button" className="btn ghost" disabled={!consent || !pairing} onClick={() => { try { download('ignis-channel-differences.json', serializeDifferencePackage(makeDifferencePackage(document, name, spec, recipe, pairing!))); } catch (e) { setError(message(e)); } }}>Download comparison replay package</button>
      {!consent && <p className="muted">To export, confirm raw-file inclusion in “Save a replayable analysis” below. Load this comparison package through the same replay input to recompute it.</p>}
    </div>}
  </section>;
}

function DifferencePlot({ result, timeUnit, select }: { result: DifferenceResult; timeUnit: string; select: (record: number) => void }) {
  const points = result.pairs.filter((p) => p.difference !== null), min = Math.min(...points.map((p) => p.time)), max = Math.max(...points.map((p) => p.time));
  const span = max - min, extent = result.metrics!.maximumAbsoluteDifference;
  const x = (v: number) => 58 + 432 * (max === min ? 0.5 : Number.isFinite(span) ? (v - min) / span : (v / 2 - min / 2) / (max / 2 - min / 2));
  const y = (v: number) => 108 - (extent === 0 ? 0 : 72 * (v / extent));
  const fmt = (v: number) => Number(v.toPrecision(5)).toString();
  return <svg className="local-plot" viewBox="0 0 540 250" role="group" aria-label={`Left minus right, ${result.unit}; ${result.origin}`}>
    <text x={58} y={16} className="plot-label">Left − right ({result.unit})</text><path d="M58 30V180H490" fill="none" stroke="currentColor" opacity={0.35} /><path d="M58 108H490" stroke="currentColor" strokeDasharray="5 4" opacity={0.4} />
    <text x={54} y={39} textAnchor="end">{fmt(extent)}</text><text x={54} y={112} textAnchor="end">0</text><text x={54} y={180} textAnchor="end">{fmt(-extent)}</text>
    <text x={58} y={200}>{fmt(min)}</text><text x={490} y={200} textAnchor="end">{fmt(max)}</text><text x={275} y={222} textAnchor="middle">Time ({timeUnit}), supplied clock</text>
    <text x={58} y={244}>Select a point to inspect its source row</text>
    {points.map((p) => <g role="button" tabIndex={0} key={p.record} aria-label={`Difference record ${p.record}: ${p.difference} ${result.unit}`} onClick={() => select(p.record)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(p.record); } }}>
      <title>{`Record ${p.record}; ${p.leftRaw} minus ${p.rightRaw}`}</title><circle cx={x(p.time)} cy={y(p.difference!)} r={4} fill="var(--d-a)" stroke="currentColor" strokeWidth={0.5} /></g>)}
  </svg>;
}
