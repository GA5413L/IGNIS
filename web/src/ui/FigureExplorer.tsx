'use client';

import { useRef, useState } from 'react';
import { digestOf } from '../core/canonicalize';
import { DETECTOR_CHANNEL_IDS, DETECTOR_MATERIALS, detectorDataset, type DetectorChannelId, type DetectorMaterial, type DetectorRecord } from '../core/detector';
import MaterialLegend, { MATERIAL_SHAPES, MaterialMark, materialColor } from './MaterialLegend';
import type { ChartPalette } from './palette';
import { download, short } from './lib';

const MATERIALS = DETECTOR_MATERIALS.filter((material) => material !== 'DBP');
const BASE_ROWS = detectorDataset.records.filter((record) => record.materialRole !== 'reference');
const REFERENCE_ROWS = detectorDataset.records.length - BASE_ROWS.length;
const CUTOFF = 2;
const AXES = Object.fromEntries(DETECTOR_CHANNEL_IDS.map((channel) => {
  const values = BASE_ROWS.flatMap((record) => record.channels[channel].value === null ? [] : [record.channels[channel].value!]);
  return [channel, { minimum: Math.floor(Math.min(0, ...values)), maximum: Math.ceil(Math.max(CUTOFF * 1.15, ...values)) }];
})) as Record<DetectorChannelId, { minimum: number; maximum: number }>;
const ITEMS = MATERIALS.map((id) => ({ id, count: BASE_ROWS.filter((record) => record.material === id).length }));
const VIEW_REVISION = 'detector-figure-view-2026-11-15.1';
const compact = (value: number) => Number(value.toPrecision(5)).toString();

function channelCounts(rows: readonly DetectorRecord[], channel: DetectorChannelId) {
  return { rows: rows.length, finite: rows.filter((row) => row.channels[channel].status === 'finite').length,
    missing: rows.filter((row) => row.channels[channel].status === 'missing').length,
    error: rows.filter((row) => row.channels[channel].status === 'error').length,
    nonNumeric: rows.filter((row) => row.channels[channel].status === 'non_numeric').length };
}

function DetectorPanel({ channel, rows, visible, palette, onInspect }: {
  channel: DetectorChannelId; rows: readonly DetectorRecord[]; visible: readonly DetectorMaterial[]; palette: ChartPalette; onInspect: (id: string) => void;
}) {
  const definition = detectorDataset.channels[channel], domain = AXES[channel], counts = channelCounts(rows, channel);
  const w = 640, h = 360, l = 54, r = 16, t = 64, b = 64, band = (w - l - r) / MATERIALS.length;
  const py = (value: number) => t + (1 - (value - domain.minimum) / (domain.maximum - domain.minimum)) * (h - t - b);
  return <div className="chart-box" role="region" tabIndex={0} aria-label={`${definition.label} figure panel; scroll horizontally on a small screen`}>
    <svg className="chart" viewBox={`0 0 ${w} ${h}`} data-detector-panel={channel} data-y-domain={`${domain.minimum},${domain.maximum}`} role="group" aria-label={`${definition.label}: ${counts.finite} finite readings of ${counts.rows} visible source rows`}>
      <title>{definition.label}; fixed domain {domain.minimum} to {domain.maximum} V</title>
      <text className="lbl" x={l} y={19} style={{ fontSize: 15 }}>{definition.label} · {definition.column}</text>
      <text x={l} y={40}>{counts.finite} finite / {counts.rows} rows · {counts.missing} missing · {counts.error} error · {counts.nonNumeric} nonnumeric</text>
      {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
        const tick = domain.minimum + fraction * (domain.maximum - domain.minimum);
        return <g key={fraction}><line className="grid" x1={l} x2={w - r} y1={py(tick)} y2={py(tick)} /><text x={l - 9} y={py(tick) + 4} textAnchor="end">{compact(tick)}</text></g>;
      })}
      <path className="axis" d={`M${l} ${t}V${h - b}H${w - r}`} fill="none" />
      <text x={9} y={t - 8}>V</text>
      <line className="cut" x1={l} x2={w - r} y1={py(CUTOFF)} y2={py(CUTOFF)} />
      <text className="t-ink" x={w - r} y={py(CUTOFF) - 6} textAnchor="end">2 V analyst cutoff</text>
      {MATERIALS.map((material, i) => <g key={material} opacity={visible.includes(material) ? 1 : 0.45}>
        <text className="lbl" x={l + band * (i + 0.5)} y={h - b + 20} textAnchor="middle">{material}</text>
        <text x={l + band * (i + 0.5)} y={h - b + 38} textAnchor="middle">{visible.includes(material) ? 'SAME | SAME-R' : 'hidden'}</text>
      </g>)}
      {rows.filter((row) => row.channels[channel].status === 'finite').map((row) => {
        const cell = row.channels[channel], index = MATERIALS.indexOf(row.material as (typeof MATERIALS)[number]);
        // A deterministic source-row layout offset, independent of visibility. It is not a measured coordinate.
        const cx = l + band * (index + 0.5) + (row.flight === '1' ? -1 : 1) * band * 0.19 + (((row.excelRow * 7) % 11) - 5) * band * 0.023;
        const cy = py(cell.value!);
        return <g key={row.id} data-record-id={row.id} data-source-cell={cell.cell} data-material={row.material} data-point-x={cx} data-point-y={cy}
          role="button" tabIndex={0} aria-label={`Inspect ${cell.cell}: ${cell.originalValue} V, ${row.material}, ${row.flightLabel}`} style={{ cursor: 'pointer' }}
          onClick={() => onInspect(row.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onInspect(row.id); } }}>
          <title>{`${cell.cell}: ${cell.originalValue} V; ${row.material}; ${row.flightLabel}; ${row.sheet} row ${row.excelRow}`}</title>
          <circle data-hit-target="true" cx={cx} cy={cy} r={8} fill="transparent" />
          <MaterialMark material={row.material} x={cx} y={cy} color={materialColor(row.material, palette)} filled={row.flight === '1'} size={3.5} />
        </g>;
      })}
      {rows.length === 0 && <text className="lbl" x={(l + w - r) / 2} y={t + 24} textAnchor="middle">No materials selected</text>}
    </svg>
  </div>;
}

/** UI-only visibility: the source population and every channel domain stay fixed. */
export default function FigureExplorer({ palette }: { palette: ChartPalette }) {
  const [selected, setSelected] = useState<DetectorMaterial[] | null>(null), [inspected, setInspected] = useState<string | null>(null), [error, setError] = useState('');
  const panels = useRef<HTMLDivElement>(null);
  const visible = MATERIALS.filter((material) => selected === null || selected.includes(material));
  const rows = BASE_ROWS.filter((record) => visible.includes(record.material as (typeof MATERIALS)[number]));
  const inspectedRow = rows.find((record) => record.id === inspected);
  const counts = Object.fromEntries(DETECTOR_CHANNEL_IDS.map((channel) => [channel, channelCounts(rows, channel)]));
  const packet = () => {
    const body = { schemaVersion: 'ignis-detector-figure-view-1', rendererRevision: VIEW_REVISION, viewOnly: true,
      source: detectorDataset.source, sourceDataDigest: digestOf(detectorDataset), sourcePolicy: detectorDataset.policy, identityConflicts: detectorDataset.identityConflicts,
      recipe: { figure: 'interactive-figure-2', palette, selectionMode: selected === null ? 'all' : 'explicit', visibleMaterials: visible,
        flights: ['1', '2'], includeReference: false, excludedReferenceRows: REFERENCE_ROWS, baselineRows: BASE_ROWS.length,
        cutoffV: CUTOFF, cutoffMeaning: 'Analyst cutoff only; not an alarm threshold.',
        axes: AXES, axisPolicy: 'Fixed from the complete non-reference source population, independent of material visibility.',
        materialEncoding: MATERIALS.map((material) => ({ material, shape: MATERIAL_SHAPES[material], color: materialColor(material, palette), printColor: materialColor(material, palette, 'light') })),
        flightEncoding: 'SAME occupies the left half of each material column; SAME-R the right. Closed shapes are filled for SAME and open for SAME-R.',
        horizontalLayout: 'Material column plus a flight offset and ((excelRow * 7) % 11 - 5) * 0.023 column widths. Layout only; not data.',
      }, counts, visibleRecordIds: rows.map((record) => record.id), rows,
      interpretation: 'Visibility changes plotted marks and source-cell counts only; no statistical association is computed or revised. Finite stored channel readings only. Missing/error cells remain in the selected source rows and counts. Different channels have different operators; rows are not independent trials. No fit, alarm classification or prediction.',
    };
    return { ...body, checksum: digestOf(body) };
  };
  const exportSvg = () => {
    try {
      if (!panels.current) throw new Error('The visible figure is not ready.');
      const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
      const add = (tag: string, attributes: Record<string, string>, text?: string) => {
        const element = document.createElementNS(ns, tag); for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
        if (text !== undefined) element.textContent = text; svg.appendChild(element); return element;
      };
      svg.setAttribute('xmlns', ns); svg.setAttribute('viewBox', '0 0 1280 910'); svg.setAttribute('width', '1280'); svg.setAttribute('height', '910');
      svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'IGNIS Figure 2, exact visible material selection');
      add('title', {}, `Detector readings: ${visible.length ? visible.join(', ') : 'no materials selected'}`);
      add('desc', {}, 'Fixed axes; source readings, not alarm outcomes. The embedded metadata contains the exact visible-view recipe and source rows.');
      add('metadata', {}, JSON.stringify(packet()));
      add('rect', { width: '1280', height: '910', fill: '#ffffff' });
      add('style', {}, 'text{font-family:Arial,sans-serif;fill:#111111;font-size:12px}.export-title{font-size:22px;font-weight:bold}.chart text{fill:#333333;font-size:11px}.chart .lbl,.chart .t-ink{fill:#111111}.chart .grid{stroke:#dddddd;stroke-width:1}.chart .axis{stroke:#111111;stroke-width:1;fill:none}.chart .cut{stroke:#111111;stroke-width:1;stroke-dasharray:5 4}');
      add('text', { x: '30', y: '31', class: 'export-title' }, 'SAME / SAME-R · four stored detector channels');
      add('text', { x: '30', y: '57' }, `Visible: ${visible.length ? visible.join(', ') : 'none'} · ${rows.length} source rows · ${palette} · fixed axes`);
      add('text', { x: '30', y: '79' }, 'Materials use shape and colour. Within each column: SAME left, SAME-R right. Closed shapes are filled / open.');
      const sourcePanels = panels.current.querySelectorAll<SVGSVGElement>('svg[data-detector-panel]');
      if (sourcePanels.length !== DETECTOR_CHANNEL_IDS.length) throw new Error('All four visible panels are required for this export.');
      sourcePanels.forEach((panel, i) => {
        const clone = panel.cloneNode(true) as SVGSVGElement;
        clone.setAttribute('x', String((i % 2) * 640)); clone.setAttribute('y', String(96 + Math.floor(i / 2) * 360));
        clone.setAttribute('width', '640'); clone.setAttribute('height', '360');
        clone.querySelectorAll('[tabindex]').forEach((node) => { node.removeAttribute('tabindex'); node.removeAttribute('role'); node.removeAttribute('style'); });
        clone.querySelectorAll('[data-hit-target]').forEach((node) => node.remove());
        clone.querySelectorAll<SVGGElement>('[data-material-mark]').forEach((mark) => {
          const material = mark.getAttribute('data-material-mark')!, color = materialColor(material, palette, 'light');
          mark.setAttribute('stroke', color); if (mark.getAttribute('data-filled') === 'true') mark.setAttribute('fill', color);
          // Keep the original Okabe-Ito hues; a dark under-outline makes yellow/light marks legible on white paper.
          if (palette !== 'monochrome') { const outline = mark.cloneNode(true) as SVGGElement; outline.setAttribute('stroke', '#111111'); outline.setAttribute('stroke-width', '2.8'); if (outline.getAttribute('data-filled') === 'true') outline.setAttribute('fill', '#111111'); outline.removeAttribute('data-material-mark'); mark.before(outline); }
        });
        svg.appendChild(clone);
      });
      add('text', { x: '30', y: '841' }, '2 V is an analyst cutoff, not an alarm threshold. Rows are not independent trials; horizontal spread is layout only.');
      add('text', { x: '30', y: '863' }, `NASA ${detectorDataset.source.accession} v${detectorDataset.source.recordVersion} · sheet ${detectorDataset.source.workbook.sheet} · ${REFERENCE_ROWS} DBP reference rows excluded`);
      add('text', { x: '30', y: '885', 'font-size': '10' }, `Workbook SHA-256: ${detectorDataset.source.workbook.sha256}`);
      download(`ignis-figure2-visible-${palette}.svg`, new XMLSerializer().serializeToString(svg), 'image/svg+xml'); setError('');
    } catch (cause) { setError((cause as Error).message); }
  };
  return <section className="card stack" aria-labelledby="interactive-detector-figure" data-testid="detector-figure-explorer">
    <div><h3 id="interactive-detector-figure">Explore Figure 2 · select materials</h3>
      <p>Compare the four stored voltage channels. Start with Teflon, then add another material. The same {BASE_ROWS.length} non-reference rows define every axis; {REFERENCE_ROWS} DBP reference rows are excluded.</p></div>
    <MaterialLegend items={ITEMS} selected={selected} onChange={(next) => { setSelected(next); setInspected(null); setError(''); }} palette={palette} label="Detector figure materials" countLabel="source rows" />
    <p className="muted">Material uses shape and colour. Within each material column, SAME is on the left and SAME-R on the right; closed shapes are filled for SAME and open for SAME-R. Horizontal spread is layout only. All axes and point positions stay fixed when materials are hidden.</p>
    <div className="grid-2" ref={panels}>{DETECTOR_CHANNEL_IDS.map((channel) => <DetectorPanel key={channel} channel={channel} rows={rows} visible={visible} palette={palette} onInspect={setInspected} />)}</div>
    <p>Each panel counts its own finite readings. Missing cells are not zeros. Visibility changes marks and counts only; no statistical association is recomputed. The 2 V line is an analyst cutoff, not an alarm threshold; different channel operators and non-independent rows limit interpretation.</p>
    <div className="btn-row"><button type="button" className="btn" onClick={exportSvg}>Download visible SVG</button>
      <button type="button" className="btn ghost" onClick={() => { try { download(`ignis-figure2-visible-${palette}.json`, JSON.stringify(packet(), null, 2)); setError(''); } catch (cause) { setError((cause as Error).message); } }}>Download visible data · JSON</button></div>
    <p className="muted">These downloads contain exactly the visible materials, fixed axes, palette and source cells. The SVG uses a white print background; a dark outline preserves light-colour marks. Static publication downloads below always retain their full/default view.</p>
    {error && <p className="error" role="alert">{error}</p>}
    {inspectedRow && <article className="card flat" aria-label="Figure source cells"><h4>{inspectedRow.material} · {inspectedRow.flightLabel} · workbook row {inspectedRow.excelRow}</h4>
      <p>Recorded sample: {inspectedRow.sampleId ?? 'unreported'} · Test ID: {inspectedRow.testId ?? 'unreported'} · SAME #: {inspectedRow.sameTestNumber ?? 'unreported'}</p>
      <div className="table-wrap"><table><thead><tr><th scope="col">Channel</th><th scope="col">Source cell</th><th scope="col">Stored text</th><th scope="col">Status</th></tr></thead><tbody>{DETECTOR_CHANNEL_IDS.map((channel) => {
        const cell = inspectedRow.channels[channel]; return <tr key={channel}><th scope="row">{detectorDataset.channels[channel].label}</th><td className="mono">{cell.cell}</td><td className="mono">{cell.originalValue ?? '(blank)'}</td><td>{cell.status}{cell.error ? `: ${cell.error}` : ''}</td></tr>;
      })}</tbody></table></div>
      <p className="muted">{inspectedRow.sheet} · workbook SHA-256 {short(inspectedRow.workbookSha256)}. The complete locator and original cached values are included in the visible-data JSON.</p>
    </article>}
    <details><summary>Every visible source row ({rows.length})</summary><div className="table-wrap" style={{ maxHeight: 420 }}><table aria-label="Visible figure source rows"><thead><tr><th scope="col">Workbook row</th><th scope="col">Material / flight</th>{DETECTOR_CHANNEL_IDS.map((channel) => <th scope="col" key={channel}>{detectorDataset.channels[channel].column} · V</th>)}</tr></thead>
      <tbody>{rows.map((row) => <tr key={row.id}><th scope="row"><button type="button" className="link-btn" onClick={() => setInspected(row.id)}>Inspect row {row.excelRow}</button></th><td>{row.material} / {row.flightLabel}</td>{DETECTOR_CHANNEL_IDS.map((channel) => <td key={channel} className="mono">{row.channels[channel].cell}: {row.channels[channel].originalValue ?? '(blank)'}{row.channels[channel].status !== 'finite' ? ` · ${row.channels[channel].status}` : ''}</td>)}</tr>)}</tbody></table></div></details>
    <p className="muted">Source: <a href={detectorDataset.source.recordUrl} target="_blank" rel="noreferrer">NASA {detectorDataset.source.accession}, version {detectorDataset.source.recordVersion}</a>, {detectorDataset.source.workbook.sheet} sheet, stored workbook caches. This visibility layer does not recalculate formulas or change curated data.</p>
  </section>;
}
