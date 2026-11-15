'use client';

import { useMemo, useState } from 'react';
import { compareConditions, conditionDataset } from '../core/conditions';
import type { Shared } from './Dashboard';
import { MOON_RANGE, download, inMoonRange, psi, short, signed } from './lib';
import { AtmosphereChart } from './charts';

const PRESETS = [
  { id: 'moon', label: 'Moon Base range edge', oxygen: 30, pressure: 70.3, note: `${MOON_RANGE.minOxygenPercent}% oxygen at ${MOON_RANGE.maxPressurePsi} psi, converted to 70.3 kPa` },
  { id: 'explore', label: '34% oxygen, 56.5 kPa', oxygen: 34, pressure: 56.5, note: 'An example exploration atmosphere' },
];

export default function Atmospheres({ shared }: { shared: Shared }) {
  const [cohortId, setCohortId] = useState('PMMA-2');
  const [oxygenText, setOxygenText] = useState('30');
  const [pressureText, setPressureText] = useState('70.3');
  const [picked, setPicked] = useState<string | null>(null);
  const oxygen = Number(oxygenText), pressure = Number(pressureText);
  const oxygenError = !(oxygen > 0 && oxygen <= 100) ? 'Enter oxygen between 0 and 100 mole %.' : null;
  const pressureError = !(pressure > 0 && pressure <= 2000) ? 'Enter pressure between 0 and 2000 kPa.' : null;

  const result = useMemo(() => {
    if (oxygenError || pressureError) return null;
    try { return compareConditions({ cohortId, oxygenPercent: oxygen, pressureKPa: pressure }); } catch { return null; }
  }, [cohortId, oxygen, pressure, oxygenError, pressureError]);

  const stratum = result?.frontier.strata[0];
  const frontierIds = stratum?.frontier.map((point) => point.id) ?? [];
  const placed = stratum ? [...stratum.frontier.map((point) => ({ point, beatenBy: null as string | null })), ...stratum.dominated.map((item) => ({ point: item.point, beatenBy: item.dominatedBy }))] : [];
  const caseOf = (id: string) => conditionDataset.cases.find((item) => item.id === id)!;
  const cohort = conditionDataset.cohorts.find((item) => item.id === cohortId)!;
  const detail = caseOf(picked && cohort.caseIds.includes(picked) ? picked : frontierIds[0] ?? cohort.caseIds[0]);
  const preset = PRESETS.find((item) => item.oxygen === oxygen && item.pressure === pressure);

  const headline = !result ? 'Enter a target atmosphere to compare'
    : frontierIds.length === 1 && placed.length > 1 ? <><b>{caseOf(frontierIds[0]).sample}</b> is nearer to the target on both oxygen and pressure</>
    : frontierIds.length === 1 ? <><b>{caseOf(frontierIds[0]).sample}</b> is the only {cohort.material} case in this group</>
    : <>No single case is nearest: <b>{frontierIds.map((id) => caseOf(id).sample).join(' and ')}</b> each win on one axis</>;

  return (
    <div className="page">
      <header className="page-head">
        <span className="crumb">03 · Atmospheres</span>
        <h1>Seven Saffire atmosphere cases against a target atmosphere</h1>
        <p>Moon Base and rover cabins are expected to run richer in oxygen at lower pressure. Set a target and see which NASA burns were run closest to it, material by material.</p>
      </header>

      <section className="section" aria-label="Target atmosphere">
        <div className="fields">
          <label className="field">
            <span>Material and burning sides</span>
            <select value={cohortId} onChange={(event) => { setCohortId(event.target.value); setPicked(null); }}>
              {conditionDataset.cohorts.map((item) => <option key={item.id} value={item.id}>{item.material}, {item.sidesBurning === 1 ? 'one side' : 'two sides'} ({item.caseCount} {item.caseCount === 1 ? 'case' : 'cases'})</option>)}
            </select>
          </label>
          <label className="field">
            <span>Target oxygen, mole %</span>
            <input type="number" inputMode="decimal" autoComplete="off" min={1} max={100} step={0.5} value={oxygenText} onChange={(event) => setOxygenText(event.target.value)} aria-invalid={!!oxygenError} aria-describedby="oxygen-help" />
            <input type="range" min={20} max={36} step={0.5} value={Number.isFinite(oxygen) ? oxygen : 30} onChange={(event) => setOxygenText(event.target.value)} aria-label="Target oxygen slider" />
            <span id="oxygen-help" className="hint" role={oxygenError ? 'alert' : undefined}>{oxygenError ?? 'Slider covers the charted 20 to 36%.'}</span>
          </label>
          <label className="field">
            <span>Target pressure, kPa</span>
            <input type="number" inputMode="decimal" autoComplete="off" min={1} max={2000} step={0.5} value={pressureText} onChange={(event) => setPressureText(event.target.value)} aria-invalid={!!pressureError} aria-describedby="pressure-help" />
            <input type="range" min={45} max={105} step={0.5} value={Number.isFinite(pressure) ? pressure : 70} onChange={(event) => setPressureText(event.target.value)} aria-label="Target pressure slider" />
            <span id="pressure-help" className="hint" role={pressureError ? 'alert' : undefined}>{pressureError ?? `${psi(pressure)} psi. Slider covers 45 to 105 kPa.`}</span>
          </label>
        </div>
        <div className="chips" role="group" aria-label="Example targets">
          {PRESETS.map((item) => (
            <button key={item.id} type="button" className="chip" aria-pressed={preset?.id === item.id} title={item.note}
              onClick={() => { setOxygenText(String(item.oxygen)); setPressureText(String(item.pressure)); }}>{item.label}</button>
          ))}
        </div>
        <p className="muted" style={{ fontSize: 13 }}>{preset ? `${preset.note}. ` : ''}Example targets are starting points for comparison, not recommended atmospheres.</p>
      </section>

      <div className="split">
        <section className="card" aria-labelledby="atm-headline">
          <h2 id="atm-headline" className="headline" aria-live="polite">{headline}</h2>
          <AtmosphereChart title="Saffire atmosphere cases plotted by oxygen and pressure, with the target marked."
            points={conditionDataset.cases.map((item) => ({ id: item.id, label: item.sample, oxygen: item.oxygenPercent, pressure: item.pressureKPa, material: item.material }))}
            active={cohort.caseIds} frontier={frontierIds} target={result ? { oxygen, pressure } : undefined} picked={detail.id}
            onPick={(id) => { const item = caseOf(id); if (item.cohortId !== cohortId) setCohortId(item.cohortId); setPicked(id); }} />
          <div className="legend">
            <span><i className="sw-ink" style={{ borderRadius: '50%' }} />Case in this material group</span>
            <span><i className="sw-ring" />Not beaten on both axes</span>
            <span><i className="sw-accent" />Target</span>
            <span><i className="sw-moon" />Moon Base range in the challenge</span>
          </div>
          {result && (
            <div className="table-wrap">
              <table>
                <caption className="sr">Gap between each case and the target</caption>
                <thead><tr><th scope="col">Case</th><th scope="col" className="n">Oxygen</th><th scope="col" className="n">Gap</th><th scope="col" className="n">Pressure</th><th scope="col" className="n">Gap</th><th scope="col" className="n">O₂ partial pressure</th><th scope="col">Reading</th></tr></thead>
                <tbody>
                  {placed.map(({ point, beatenBy }) => {
                    const item = caseOf(point.id);
                    return (
                      <tr key={point.id} className={`clickable${detail.id === point.id ? ' is-on' : ''}`} onClick={() => setPicked(point.id)}>
                        <th scope="row" className="nowrap"><button type="button" className="link-btn" onClick={() => setPicked(point.id)}>{item.sample}</button></th>
                        <td className="n">{item.oxygenPercent}%</td>
                        <td className="n">{signed(point.signed.o2 ?? 0)} pts</td>
                        <td className="n">{item.pressureKPa} kPa</td>
                        <td className="n">{signed(point.signed.pressure ?? 0)} kPa</td>
                        <td className="n">{item.oxygenPartialPressureKPa} kPa</td>
                        <td className="wide">{beatenBy ? `Farther than ${caseOf(beatenBy).sample} on both axes` : placed.length === 1 ? 'Only case in this group' : 'Not beaten on both axes'}{inMoonRange(item.oxygenPercent, item.pressureKPa) ? ' · inside Moon Base range' : ''}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="btn-row">
            <button type="button" className="btn" disabled={!result} onClick={() => shared.attach({ kind: 'conditions', cohortId, oxygenPercent: oxygen, pressureKPa: pressure })}>Attach this comparison to a brief</button>
            <button type="button" className="btn ghost" disabled={!result} onClick={() => result && download(`ignis-atmosphere-${cohortId}-${oxygen}-${pressure}.json`, JSON.stringify(result, null, 2))}>Download comparison JSON</button>
          </div>
          <div className="card-foot"><a href={conditionDataset.source.publicUrl} target="_blank" rel="noreferrer">{conditionDataset.source.version}, {conditionDataset.source.table}</a><span>PDF p. {conditionDataset.source.pdfPage}</span><span>sha256 {short(conditionDataset.source.sha256)}</span></div>
        </section>

        <aside className="stack" aria-label="Selected case">
          <article className="card" key={detail.id} style={{ animation: 'enter 220ms var(--ease) both' }}>
            <div className="row between"><span className="mono muted">{detail.id}</span><span className="tag">{detail.platform}</span></div>
            <h3>{detail.sample}: {detail.material}, {detail.sidesBurning === 1 ? 'one side' : 'two sides'} burning</h3>
            <dl className="kv">
              <dt>Oxygen</dt><dd>{detail.oxygenPercent} mole % <span className="muted">(printed {detail.original.oxygenMoleFraction})</span></dd>
              <dt>Pressure</dt><dd>{detail.pressureKPa} kPa · {psi(detail.pressureKPa)} psi <span className="muted">(printed {detail.original.pressureMbar} mbar)</span></dd>
              <dt>Oxygen partial pressure</dt><dd>{detail.oxygenPartialPressureKPa} kPa <span className="muted">(arithmetic, not measured)</span></dd>
              <dt>Sample</dt><dd>{detail.geometry.widthCm} × {detail.geometry.lengthCm} cm{detail.geometry.thicknessMm !== null ? `, ${detail.geometry.thicknessMm} mm thick` : ', thickness not reported'}</dd>
              <dt>Preheat</dt><dd>{detail.thermalHistory.preheatDescription ?? 'Not reported in the table'}</dd>
              <dt>Flow</dt><dd>{detail.original.nominalFlow} <span className="muted">(2026 caption)</span></dd>
              <dt>Ignition</dt><dd>{detail.ignitionDurationS} s</dd>
              <dt>Gravity</dt><dd>{detail.gravityRegime}</dd>
            </dl>
          </article>
          <div className="limit">
            <b>Conflict</b>
            <p>{conditionDataset.flowConflict.canonicalSourceStatement} {conditionDataset.flowConflict.earlierSourceStatement} The two publications disagree, so flow direction is left out of the comparison.</p>
          </div>
          <details>
            <summary>What this comparison cannot tell you</summary>
            <div className="details-body"><ul className="bullets">{conditionDataset.boundaries.map((line) => <li key={line}>{line}</li>)}</ul></div>
          </details>
        </aside>
      </div>
    </div>
  );
}
