'use client';

import Image from 'next/image';
import { useState } from 'react';
import { conditionDataset } from '../core/conditions';
import { detectorDataset } from '../core/detector';
import type { Shared } from './Dashboard';
import { PALETTES, type ChartPalette } from './palette';
import FigureExplorer from './FigureExplorer';

const FIGURES = [
  { file: 'fig1-atmosphere-cases', height: 888, title: 'Saffire atmosphere cases and the Moon Base range',
    caption: '(a) Seven Saffire IV to VI burns by oxygen and pressure; markers show material, filled markers burned on two sides. The shaded area is the challenge statement’s Moon Base range. (b) Oxygen partial pressure for each case, computed from the printed values; the darker bars identify cases inside the range.',
    limit: 'Coordinates only. Position inside the range is not a flammability or safety result.' },
  { file: 'fig2-detector-readings', height: 1321, title: 'Every stored detector reading, by material and flight',
    caption: 'Four detector channels from the SAME and SAME-R results workbook. Each mark is one finite stored reading; circles are SAME, diamonds are SAME-R; the dashed line is a 2 V analyst cutoff. Horizontal spread within a column is layout only.',
    limit: 'A cutoff is not an alarm threshold, and rows are not independent trials.' },
  { file: 'fig3-paired-channels', height: 759, title: 'Scatter minus obscuration, pooled and by flight',
    caption: '(a) Difference in the share of readings at or above 2 V, scatter minus obscuration; grey ticks show the range if unavailable cells could fall either way. (b) Exact range of the same difference when each cutoff varies over 1 to 3 V and over 0 to 5 V.',
    limit: 'Exact bounds over a cutoff rectangle, not confidence intervals. The channels measure different things.' },
  { file: 'fig4-evidence-coverage', height: 1061, title: 'Evidence coverage by investigation',
    caption: '(a) Reviewed findings per ranked investigation, coloured by first fire-safety area. (b) Records in each NASA PSI experimental table, log scale; tables with no records are omitted.',
    limit: 'Table records include summaries and notes; they are not counts of burns.' },
];

export default function Figures({ shared }: { shared: Shared }) {
  const figureRoot = shared.palette === 'monochrome' ? '/figures/monochrome' : '/figures';
  return (
    <div className="page">
      <header className="page-head">
        <span className="crumb">06 · Figures</span>
        <h1>Four publication figures, sized for a journal column</h1>
        <p>Print-ready plots with their data and Python source. Explore Figure 2 by material, export the visible view, or download the full/default publication figures.</p>
      </header>
      <section className="section" aria-label="Figure settings and code">
        <div className="fields"><label className="field"><span>Figure palette</span><select value={shared.palette} onChange={(e) => shared.setPalette(e.target.value as ChartPalette)}>
          {PALETTES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select></label></div>
        <div className="btn-row"><button type="button" className="btn" onClick={() => document.getElementById('interactive-detector-figure')?.scrollIntoView({ block: 'start' })}>Explore materials interactively</button>
          <a className="btn" href="/figures/code/ignis-figure-reproduction.zip" download>Download code and data</a>
          <a className="btn ghost" href="/figures/code/figure-data.json" download>Figure data · JSON</a>
          <a className="btn ghost" href="/figures/code/make-figures.py" download>Plotting code · Python</a>
          <a className="btn ghost" href="/figures/code/requirements.txt" download>Python requirements</a></div>
        <p className="muted">The palette applies to interactive charts and these figure downloads. Symbols and direct labels preserve distinctions in monochrome. Material selection changes only the interactive Figure 2 view and its visible-view downloads.</p>
      </section>
      {FIGURES.map((figure, index) => (
        <section className="section" key={figure.file} aria-labelledby={figure.file}>
          <div className="section-head">
            <h2 id={figure.file}>Figure {index + 1}. {figure.title}</h2>
            <div className="btn-row">
              <a className="btn ghost small" href={`${figureRoot}/${figure.file}.pdf`} download>Download PDF</a>
              <a className="btn ghost small" href={`${figureRoot}/${figure.file}.svg`} download>Download SVG</a>
              <a className="btn ghost small" href={`${figureRoot}/${figure.file}.png`} download>Download PNG</a>
            </div>
          </div>
          <p className="muted">Static publication downloads · full/default view. Material visibility controls do not change these PDF, SVG or PNG files.</p>
          {index === 1 && <FigureExplorer palette={shared.palette} />}
          {index === 1 ? <details><summary>Static full/default Figure 2 preview</summary><figure className="figure">
            <Image src={`${figureRoot}/${figure.file}.png`} alt={`Figure ${index + 1}: ${figure.title}. ${figure.caption}`} width={2142} height={figure.height} loading="lazy" sizes="(max-width: 900px) 100vw, 1100px" />
            <figcaption><b>Static Figure {index + 1} · full/default view.</b> {figure.caption} <span className="muted">{figure.limit}</span></figcaption>
          </figure></details> : <figure className="figure">
            <Image src={`${figureRoot}/${figure.file}.png`} alt={`Figure ${index + 1}: ${figure.title}. ${figure.caption}`} width={2142} height={figure.height} priority={index === 0} loading={index === 0 ? undefined : "eager"} sizes="(max-width: 900px) 100vw, 1100px" />
            <figcaption><b>Figure {index + 1}.</b> {figure.caption} <span className="muted">{figure.limit}</span></figcaption>
          </figure>}
          <PlotCode figure={index + 1} palette={shared.palette} />
        </section>
      ))}
      <section className="section" aria-labelledby="figure-method">
        <div className="section-head"><h2 id="figure-method">Figure method and sources</h2></div>
        <div className="grid-2">
          <div className="card">
            <h3>How the figures are made</h3>
            <ul className="bullets">
              <li>The console&rsquo;s analysis code writes the plotted numbers to one JSON file.</li>
              <li>A paperplot script draws them: no fit, no smoothing, no interval estimate.</li>
              <li>Both palettes use the same numeric input packet and plotting functions.</li>
              <li>The publication PDFs, PNGs and SVG links are fixed at the full/default settings. Figure 2&rsquo;s interactive controls have separate visible-view SVG and JSON downloads.</li>
            </ul>
            <div className="card-foot"><a href="/figures/code/manifest.json" download>Reproduction manifest</a><a href="https://jfly.uni-koeln.de/color/" target="_blank" rel="noreferrer">Okabe–Ito colour guidance</a></div>
          </div>
          <div className="card">
            <h3>Sources plotted</h3>
            <ul className="bullets">
              <li>Figure 1: {conditionDataset.source.title}, {conditionDataset.source.table}.</li>
              <li>Figures 2 and 3: NASA {detectorDataset.source.accession} results workbook, {detectorDataset.source.workbook.sheet} sheet.</li>
              <li>Figure 4: the reviewed-findings registry and 24 NASA PSI catalogue records.</li>
            </ul>
            <div className="btn-row"><button type="button" className="btn ghost small" onClick={() => shared.go('sources')}>See all sources</button></div>
          </div>
        </div>
      </section>
    </div>
  );
}

function PlotCode({ figure, palette }: { figure: number; palette: ChartPalette }) {
  const [code, setCode] = useState<string | null>(null), [error, setError] = useState('');
  const command = `python make-figures.py --data figure-data.json --out output --figure ${figure} --palette ${palette}`;
  return <details onToggle={(event) => {
    if (!event.currentTarget.open || code !== null) return;
    fetch('/figures/code/make-figures.py', { cache: 'force-cache' }).then((res) => { if (!res.ok) throw new Error('Plotting source could not be loaded.'); return res.text(); })
      .then(setCode).catch((e: Error) => setError(e.message));
  }}><summary>Code for Figure {figure}</summary><div className="details-body">
    <p>To reproduce the static full/default figure, extract the code-and-data bundle, install its pinned requirements, then run:</p>
    <pre className="local-json"><code>{command}</code></pre>
    <div className="btn-row"><a className="btn ghost small" href="/figures/code/make-figures.py" download>Download Python source</a>
      <button type="button" className="btn ghost small" onClick={() => { void navigator.clipboard.writeText(command).catch(() => setError('Copy is unavailable here; select the command above.')); }}>Copy command</button></div>
    {error && <p className="error" role="alert">{error}</p>}
    <pre className="local-json"><code>{code ?? 'Loading plotting source…'}</code></pre>
  </div></details>;
}
