'use client';

import { useMemo, useState } from 'react';
import { DETECTOR_CHANNELS, DETECTOR_CHANNEL_IDS, DETECTOR_MATERIALS, analyzeDetector, detectorDataset, type DetectorChannelId, type DetectorMaterial } from '../core/detector';
import { analyzePairedDetector, type PairSummary } from '../core/pairedDetector';
import { analyzeCutoffEnvelope, type CutoffEnvelopeSummary, type CutoffStability } from '../core/cutoffEnvelope';
import type { Shared } from './Dashboard';
import { download, pct, plural, short, signedInt } from './lib';
import { IntervalChart, StripChart, type StripPoint } from './charts';
import DetectorAssociation from './DetectorAssociation';

type Mode = 'single' | 'paired' | 'range' | 'association';
type Flight = 'all' | '1' | '2';
const MODES: { id: Mode; label: string; question: string }[] = [
  { id: 'single', label: 'One channel', question: 'How many readings fall below a cutoff?' },
  { id: 'paired', label: 'Two channels', question: 'How do two cutoff results differ on the same rows?' },
  { id: 'range', label: 'Cutoff range', question: 'Does the answer survive a different cutoff?' },
  { id: 'association', label: 'Statistical relationships', question: 'Does a pooled relationship hold within each material?' },
];
const STABILITY: Record<CutoffStability, string> = {
  strictly_positive: 'Positive for every cutoff in the range', strictly_negative: 'Negative for every cutoff in the range',
  identically_zero: 'Zero for every cutoff in the range', nonnegative_including_zero: 'Positive or zero across the range',
  nonpositive_including_zero: 'Negative or zero across the range', both_signs: 'Changes sign inside the range', no_data: 'No jointly finite readings',
};
const CLASS_LABEL = { below: 'Below cutoff', at_or_above: 'At or above', missing: 'Blank cell', error: 'Error cell', non_numeric: 'Not a number' } as const;
const num = (text: string) => (text.trim() === '' ? NaN : Number(text));

export default function SmokeLab({ shared }: { shared: Shared }) {
  const [mode, setMode] = useState<Mode>('single');
  const [flight, setFlight] = useState<Flight>('all');
  const [material, setMaterial] = useState<'all' | DetectorMaterial>('all');
  const [reference, setReference] = useState(false);
  const [channel, setChannel] = useState<DetectorChannelId>('issScatterV');
  const [channelB, setChannelB] = useState<DetectorChannelId>('issObscurationV');
  const [cutoff, setCutoff] = useState('2');
  const [cutoffB, setCutoffB] = useState('2');
  const [fan, setFan] = useState(false);
  const [range, setRange] = useState({ aMin: '1', aMax: '3', bMin: '1', bMax: '3' });
  const [showAll, setShowAll] = useState(false);
  const includeReference = reference || material === 'DBP';
  const base = { flight, material, includeReference };

  const single = useMemo(() => {
    try { return { ok: analyzeDetector({ ...base, channel, cutoff: num(cutoff) }) }; } catch { return { error: 'Enter a cutoff of 0 V or more.' }; }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flight, material, includeReference, channel, cutoff]);
  const paired = useMemo(() => {
    if (mode !== 'paired') return null;
    try { return { ok: analyzePairedDetector({ ...base, channelA: channel, channelB, cutoffA: num(cutoff), cutoffB: num(cutoffB), requireRecordedNoFanProblem: fan }) }; }
    catch { return { error: channel === channelB ? 'Choose two different channels.' : 'Enter cutoffs of 0 V or more.' }; }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, flight, material, includeReference, channel, channelB, cutoff, cutoffB, fan]);
  const envelope = useMemo(() => {
    if (mode !== 'range') return null;
    try {
      return { ok: analyzeCutoffEnvelope({ ...base, channelA: channel, channelB, requireRecordedNoFanProblem: fan,
        rangeA: { min: num(range.aMin), max: num(range.aMax) }, rangeB: { min: num(range.bMin), max: num(range.bMax) } }) };
    } catch { return { error: channel === channelB ? 'Choose two different channels.' : 'Each range needs a minimum of 0 V or more and a maximum at or above it.' }; }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, flight, material, includeReference, channel, channelB, fan, range]);

  const channelSelect = (label: string, value: DetectorChannelId, onChange: (id: DetectorChannelId) => void) => (
    <label className="field"><span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value as DetectorChannelId)}>
        {DETECTOR_CHANNEL_IDS.map((id) => <option key={id} value={id}>{DETECTOR_CHANNELS[id].label} (column {DETECTOR_CHANNELS[id].column})</option>)}
      </select></label>
  );
  const volt = (label: string, value: string, onChange: (text: string) => void) => (
    <label className="field"><span>{label}</span><input type="number" inputMode="decimal" autoComplete="off" min={0} step={0.1} value={value} onChange={(event) => onChange(event.target.value)} /></label>
  );
  const source = detectorDataset.source;
  const foot = (
    <div className="card-foot"><a href={source.recordUrl} target="_blank" rel="noreferrer">NASA {source.accession}, record v{source.recordVersion}</a>
      <span>sheet {source.workbook.sheet}</span><span>sha256 {short(source.workbook.sha256)}</span><span>{source.license.id}</span></div>
  );

  return (
    <div className="page">
      <header className="page-head">
        <span className="crumb">04 · Smoke detection</span>
        <h1>Smoke detector readings from the SAME and SAME-R experiments</h1>
        <p>{detectorDataset.records.length} workbook rows of detector voltages for five spacecraft materials and one reference liquid. Explore cutoff sensitivity and statistical relationships; inspect the source cells behind each result.</p>
      </header>

      <section className="section" aria-label="Analysis settings">
        <div className="row between">
          <div className="seg" role="tablist" aria-label="Analysis type">
            {MODES.map((item) => <button key={item.id} type="button" role="tab" aria-selected={mode === item.id} onClick={() => {
              setMode(item.id);
              if (item.id === 'association') { setFlight('2'); setMaterial('all'); setReference(false); setChannel('issScatterV'); setChannelB('ionDeltaV'); }
            }}>{item.label}</button>)}
          </div>
          <p className="muted">{MODES.find((item) => item.id === mode)!.question}</p>
        </div>
        <div className="fields">
          <label className="field"><span>Flight</span>
            <select value={flight} onChange={(event) => setFlight(event.target.value as Flight)}>
              <option value="all">Both flights</option><option value="1">SAME (flight 1)</option><option value="2">SAME-R (flight 2)</option>
            </select></label>
          <label className="field"><span>Material</span>
            <select value={material} onChange={(event) => setMaterial(event.target.value as 'all' | DetectorMaterial)}>
              <option value="all">All spacecraft materials</option>
              {DETECTOR_MATERIALS.map((item) => <option key={item} value={item}>{item}{item === 'DBP' ? ' (reference liquid)' : ''}</option>)}
            </select></label>
          {channelSelect(mode === 'single' ? 'Detector channel' : 'Channel A', channel, setChannel)}
          {mode !== 'single' && channelSelect('Channel B', channelB, setChannelB)}
          {mode === 'single' && volt('Cutoff, volts', cutoff, setCutoff)}
          {mode === 'paired' && <>{volt('Cutoff A, volts', cutoff, setCutoff)}{volt('Cutoff B, volts', cutoffB, setCutoffB)}</>}
          {mode === 'range' && <>
            {volt('Cutoff A from, volts', range.aMin, (text) => setRange({ ...range, aMin: text }))}
            {volt('Cutoff A to, volts', range.aMax, (text) => setRange({ ...range, aMax: text }))}
            {volt('Cutoff B from, volts', range.bMin, (text) => setRange({ ...range, bMin: text }))}
            {volt('Cutoff B to, volts', range.bMax, (text) => setRange({ ...range, bMax: text }))}
          </>}
        </div>
        <div className="row">
          <label className="check"><input type="checkbox" checked={includeReference} disabled={material === 'DBP'} onChange={(event) => setReference(event.target.checked)} />Include the 20 DBP reference rows</label>
          {(mode === 'paired' || mode === 'range') && <label className="check"><input type="checkbox" checked={fan} onChange={(event) => setFan(event.target.checked)} />Keep only rows recorded with no fan problem</label>}
          {mode === 'range' && (
            <span className="chips" role="group" aria-label="Range presets">
              <button type="button" className="chip" aria-pressed={range.aMin === '1' && range.aMax === '3' && range.bMin === '1' && range.bMax === '3'} onClick={() => setRange({ aMin: '1', aMax: '3', bMin: '1', bMax: '3' })}>1 to 3 V</button>
              <button type="button" className="chip" aria-pressed={range.aMin === '0' && range.aMax === '5' && range.bMin === '0' && range.bMax === '5'} onClick={() => setRange({ aMin: '0', aMax: '5', bMin: '0', bMax: '5' })}>0 to 5 V</button>
            </span>
          )}
        </div>
      </section>

      {mode === 'association' && <DetectorAssociation key={`${flight}|${material}|${includeReference}|${channel}|${channelB}`} selection={{ ...base, channelA: channel, channelB }} palette={shared.palette} />}

      {mode === 'single' && ('error' in single ? <p className="error" role="alert">{single.error}</p> : (() => {
        const a = single.ok!, c = a.counts, gaps = c.missing + c.error + c.nonNumeric;
        const rows = showAll ? a.rows : a.rows.slice(0, 12);
        return (
          <div className="split">
            <section className="card" aria-labelledby="single-headline">
              <h2 id="single-headline" className="headline" aria-live="polite">{c.finite === 0 ? 'No finite readings in this selection'
                : <><b>{c.below} of {c.finite}</b> finite readings are below {a.selection.cutoff}{'\u00a0'}V on the {a.channel.label.replace(/ channel$/, '')} channel</>}</h2>
              <p className="muted">{plural(c.total, 'row')} selected, {c.finite} with a finite reading{gaps ? `, ${gaps} unavailable and left out of the percentage` : ''}. {pct(c.belowPercent, 1)} below, {pct(c.atOrAbovePercent, 1)} at or above.</p>
              <StripChart title={`Every finite ${a.channel.label} reading by material, with the ${a.selection.cutoff} volt cutoff marked.`} cutoff={a.selection.cutoff} unit="Stored reading, V"
                groups={a.byMaterial.map((item) => item.material)}
                unavailable={Object.fromEntries(a.byMaterial.map((item) => [item.material, item.counts.total - item.counts.finite]))}
                points={a.rows.filter((row) => row.measurement.status === 'finite').map((row): StripPoint => ({ id: row.record.id, group: row.record.material, series: row.record.flightLabel as StripPoint['series'], value: row.measurement.value as number, cell: row.measurement.cell }))} />
              <div className="legend"><span><i className="sw-circle" />SAME, flight 1</span><span><i className="sw-diamond" />SAME-R, flight 2</span><span>Each mark is one workbook cell. Hover for the cell and value.</span></div>
              <div className="bars" role="list" aria-label="Readings by material">
                {a.byMaterial.map((item) => {
                  const total = item.counts.total || 1, missing = item.counts.total - item.counts.finite;
                  return (
                    <div className="bar-row" role="listitem" key={item.material}>
                      <span>{item.material}</span>
                      <span className="bar-track" aria-hidden="true">
                        <i className="below" style={{ width: `${(item.counts.below / total) * 100}%` }} />
                        <i className="above" style={{ width: `${(item.counts.atOrAbove / total) * 100}%` }} />
                        <i className="gap" style={{ width: `${(missing / total) * 100}%` }} />
                      </span>
                      <span className="mono">{item.counts.below} below · {item.counts.atOrAbove} at/above{missing ? ` · ${missing} n/a` : ''}</span>
                    </div>
                  );
                })}
              </div>
              <div className="legend"><span><i className="sw-ink" />Below cutoff</span><span><i className="sw-heat" />At or above cutoff</span><span><i className="sw-hatch" />Blank or error cell</span></div>
              <div className="btn-row">
                <button type="button" className="btn" onClick={() => shared.attach({ kind: 'detector', ...a.selection })}>Attach this count to a brief</button>
                <button type="button" className="btn ghost" onClick={() => download(`ignis-detector-${a.selection.channel}-${a.selection.cutoff}V.json`, JSON.stringify({ ...a, exportSchemaVersion: 'ignis-detector-export-1' }, null, 2))}>Download source cells</button>
              </div>
              {foot}
            </section>
            <aside className="stack">
              <div className="card">
                <h3>Channel audit by flight</h3>
                <div className="table-wrap"><table>
                  <thead><tr><th scope="col">Flight</th><th scope="col" className="n">Finite</th><th scope="col" className="n">Exactly 0 V</th><th scope="col" className="n">Min, V</th><th scope="col" className="n">Max, V</th></tr></thead>
                  <tbody>{(['SAME', 'SAME-R'] as const).map((label) => {
                    const values = a.rows.filter((row) => row.record.flightLabel === label && row.measurement.status === 'finite').map((row) => row.measurement.value as number);
                    return (<tr key={label}><th scope="row">{label}</th><td className="n">{values.length}</td><td className="n">{values.filter((value) => value === 0).length}</td>
                      <td className="n">{values.length ? Math.min(...values).toFixed(2) : 'n/a'}</td><td className="n">{values.length ? Math.max(...values).toFixed(2) : 'n/a'}</td></tr>);
                  })}</tbody>
                </table></div>
                <p className="muted" style={{ fontSize: 13 }}>Check this before comparing flights: a channel stored as 0 V on one flight changes any pooled count.</p>
              </div>
              <div className="limit"><b>Limit</b><ul><li>{a.policy.cutoffMeaning}</li><li>{a.policy.rowMeaning}</li><li>{a.policy.zeroMeaning}</li></ul></div>
              <div className="table-wrap" style={{ maxHeight: 420 }}>
                <table>
                  <caption className="sr">Source cells behind this count</caption>
                  <thead><tr><th scope="col">Cell</th><th scope="col">Material</th><th scope="col" className="n">Stored value</th><th scope="col">Reading</th></tr></thead>
                  <tbody>{rows.map((row) => (
                    <tr key={row.record.id}><th scope="row" className="mono">{row.measurement.cell}</th><td>{row.record.material} <span className="muted">{row.record.flightLabel}</span></td>
                      <td className="n mono">{row.measurement.originalValue === null ? '(blank)' : Number.isFinite(row.measurement.value) ? row.measurement.value!.toFixed(3) : row.measurement.originalValue}</td>
                      <td>{CLASS_LABEL[row.classification]}</td></tr>
                  ))}</tbody>
                </table>
              </div>
              {a.rows.length > 12 && <button type="button" className="btn ghost small" style={{ justifySelf: 'start' }} onClick={() => setShowAll(!showAll)}>{showAll ? 'Show fewer cells' : `Show all ${a.rows.length} source cells`}</button>}
            </aside>
          </div>
        );
      })())}

      {mode === 'paired' && paired && ('error' in paired ? <p className="error" role="alert">{paired.error}</p> : (() => {
        const p = paired.ok!, s = p.summary, d = s.pairedDifference;
        const row = (label: string, summary: PairSummary) => ({ label, note: `${signedInt(summary.pairedDifference.numerator)}/${summary.pairedDifference.denominator}`,
          lower: summary.pairedDifference.fraction, upper: summary.pairedDifference.fraction, outerLower: summary.completionDifferenceBounds.lowerFraction, outerUpper: summary.completionDifferenceBounds.upperFraction });
        const reversal = p.flags.some((flag) => flag.code === 'flight_stratum_reversal');
        return (
          <div className="split">
            <section className="card" aria-labelledby="pair-headline">
              <h2 id="pair-headline" className="headline" aria-live="polite">{d.denominator === 0 ? 'No row has a finite reading on both channels'
                : reversal ? <>Pooled difference <b>{signedInt(d.numerator)}/{d.denominator}</b>, but the two flights point in opposite directions</>
                : <>Channel A is at or above its cutoff in <b>{signedInt(d.numerator)}/{d.denominator}</b> more rows than channel B</>}</h2>
              <p className="muted">{s.pairedFiniteRows} of {s.selectedRows} selected rows have a finite reading on both channels. A is {p.channelA.label} at {p.channelA.cutoff} V; B is {p.channelB.label} at {p.channelB.cutoff} V.</p>
              <IntervalChart title="Share at or above cutoff, channel A minus channel B, pooled and by flight"
                rows={[row('Pooled', s), ...p.byFlight.map((item) => row(item.label, item.summary))]} />
              <div className="legend"><span><i className="sw-accent" />A higher</span><span><i className="sw-heat" />B higher</span><span><i className="sw-line" />Range if unavailable cells could be either</span></div>
              <div className="matrix" role="table" aria-label="Rows by channel result">
                <span className="h" role="columnheader" /><span className="h" role="columnheader">B below</span><span className="h" role="columnheader">B at or above</span>
                <span className="h" role="rowheader">A below</span><span role="cell"><b>{s.pairCounts.aBelowBBelow}</b></span><span role="cell"><b>{s.pairCounts.aBelowBAtOrAbove}</b></span>
                <span className="h" role="rowheader">A at or above</span><span role="cell"><b>{s.pairCounts.aAtOrAboveBBelow}</b></span><span role="cell"><b>{s.pairCounts.aAtOrAboveBAtOrAbove}</b></span>
              </div>
              <div className="btn-row">
                <button type="button" className="btn" onClick={() => shared.attach({ kind: 'detector_pair', options: p.selection })}>Attach this comparison to a brief</button>
                <button type="button" className="btn ghost" onClick={() => download('ignis-paired-detector.json', JSON.stringify(p, null, 2))}>Download paired analysis</button>
              </div>
              {foot}
            </section>
            <aside className="stack">
              <h3>What to check before trusting this</h3>
              {p.flags.map((flag) => <p className="flag" key={flag.code}>{flag.message}</p>)}
              {p.excludedRows.length > 0 && <p className="muted">{plural(p.excludedRows.length, 'row')} left out by the fan filter.</p>}
              <div className="limit"><b>Limit</b><p>{p.reviewStatement}</p></div>
            </aside>
          </div>
        );
      })())}

      {mode === 'range' && envelope && ('error' in envelope ? <p className="error" role="alert">{envelope.error}</p> : (() => {
        const e = envelope.ok!;
        const row = (label: string, summary: CutoffEnvelopeSummary) => {
          const env = summary.pairedDifferenceEnvelope, outer = summary.completionDifferenceEnvelope;
          return { label, note: env.denominator ? `[${signedInt(env.lowerNumerator)}, ${signedInt(env.upperNumerator)}]/${env.denominator}` : 'no data',
            lower: env.lowerFraction, upper: env.upperFraction, outerLower: outer.lowerFraction, outerUpper: outer.upperFraction };
        };
        const pooled = e.summary.pairedDifferenceEnvelope;
        const robust = e.flags.some((flag) => flag.code === 'robust_flight_sign_reversal');
        return (
          <div className="split">
            <section className="card" aria-labelledby="range-headline">
              <h2 id="range-headline" className="headline" aria-live="polite">{pooled.denominator === 0 ? 'No row has a finite reading on both channels'
                : robust ? <>The two flights keep <b>opposite signs</b> for every cutoff in this range</>
                : pooled.stability === 'both_signs' ? <>The pooled result <b>changes sign</b> somewhere inside this cutoff range</>
                : <>Pooled difference stays between <b>{signedInt(pooled.lowerNumerator)} and {signedInt(pooled.upperNumerator)}</b> of {pooled.denominator} rows</>}</h2>
              <p className="muted">Cutoff A anywhere in {e.selection.rangeA.min} to {e.selection.rangeA.max} V, cutoff B anywhere in {e.selection.rangeB.min} to {e.selection.rangeB.max} V. Bars are exact bounds over that rectangle, not confidence intervals.</p>
              <IntervalChart title="Range of the A minus B difference over the selected cutoff ranges, pooled and by flight"
                rows={[row('Pooled', e.summary), ...e.byFlight.map((item) => row(item.label, item.summary))]} />
              <div className="legend"><span><i className="sw-accent" />Always A higher</span><span><i className="sw-heat" />Always B higher</span><span><i className="sw-ink" />Crosses zero</span><span><i className="sw-line" />Range if unavailable cells could be either</span></div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th scope="col">Rows</th><th scope="col" className="n">Exact range</th><th scope="col">Direction</th></tr></thead>
                  <tbody>{[{ label: 'Pooled', summary: e.summary }, ...e.byFlight].map((item) => (
                    <tr key={item.label}><th scope="row">{item.label}</th><td className="n mono">{row(item.label, item.summary).note}</td><td>{STABILITY[item.summary.pairedDifferenceEnvelope.stability]}</td></tr>
                  ))}</tbody>
                </table>
              </div>
              <div className="btn-row">
                <button type="button" className="btn" onClick={() => shared.attach({ kind: 'cutoff_envelope', options: e.selection })}>Attach this range to a brief</button>
                <button type="button" className="btn ghost" onClick={() => download('ignis-cutoff-range.json', JSON.stringify(e, null, 2))}>Download range analysis</button>
              </div>
              {foot}
            </section>
            <aside className="stack">
              <h3>What to check before trusting this</h3>
              {e.flags.map((flag) => <p className="flag" key={flag.code}>{flag.message}</p>)}
              <dl className="kv">
                <dt>Lowest value at</dt><dd className="mono">A = {e.summary.minimum.cutoffA} V, B = {e.summary.minimum.cutoffB} V</dd>
                <dt>Highest value at</dt><dd className="mono">A = {e.summary.maximum.cutoffA} V, B = {e.summary.maximum.cutoffB} V</dd>
                <dt>Unavailable pairs</dt><dd>{e.summary.selectedRows - e.summary.pairedFiniteRows} of {e.summary.selectedRows} rows</dd>
              </dl>
              <div className="limit"><b>Limit</b><p>{e.reviewStatement}</p></div>
            </aside>
          </div>
        );
      })())}
    </div>
  );
}
