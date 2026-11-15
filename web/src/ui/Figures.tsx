'use client';

import Image from 'next/image';
import { conditionDataset } from '../core/conditions';
import { detectorDataset } from '../core/detector';
import type { Shared } from './Dashboard';

const FIGURES = [
  { file: 'fig1-atmosphere-cases', height: 888, title: 'Saffire atmosphere cases and the Moon Base range',
    caption: '(a) Seven Saffire IV to VI burns by oxygen and pressure; markers show material, filled markers burned on two sides. The shaded area is the challenge statement’s Moon Base range. (b) Oxygen partial pressure for each case, computed from the printed values; blue bars fall inside the range.',
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
  return (
    <div className="page">
      <header className="page-head">
        <span className="crumb">06 · Figures</span>
        <h1>Four publication figures, sized for a journal column</h1>
        <p>Drawn with paperplot on matplotlib at Nature double-column width, with embedded fonts and a colour-blind-safe palette. Every value comes from the same computations as the console.</p>
      </header>
      {FIGURES.map((figure, index) => (
        <section className="section" key={figure.file} aria-labelledby={figure.file}>
          <div className="section-head">
            <h2 id={figure.file}>Figure {index + 1}. {figure.title}</h2>
            <div className="btn-row">
              <a className="btn ghost small" href={`/figures/${figure.file}.pdf`} download>Download PDF</a>
              <a className="btn ghost small" href={`/figures/${figure.file}.svg`} download>Download SVG</a>
              <a className="btn ghost small" href={`/figures/${figure.file}.png`} download>Download PNG</a>
            </div>
          </div>
          <figure className="figure">
            <Image src={`/figures/${figure.file}.png`} alt={`Figure ${index + 1}: ${figure.title}. ${figure.caption}`} width={2142} height={figure.height} priority={index === 0} loading={index === 0 ? undefined : "eager"} sizes="(max-width: 900px) 100vw, 1100px" />
            <figcaption><b>Figure {index + 1}.</b> {figure.caption} <span className="muted">{figure.limit}</span></figcaption>
          </figure>
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
              <li>paperplot&rsquo;s preflight check passed for all four at Nature settings.</li>
              <li>These are fixed at the default settings. Use the console charts to change inputs, then download that analysis as JSON.</li>
            </ul>
            <div className="card-foot"><span>scripts/export-figure-data.ts</span><span>scripts/make-figures.py</span><span>registry {shared.catalog?.revision ?? ''}</span></div>
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
