import atlas from '../../../data/investigation-atlas.json';
import { assess } from '../../core/assess';
import { conditionDataset } from '../../core/conditions';
import { analyzeCutoffEnvelope } from '../../core/cutoffEnvelope';
import { detectorDataset } from '../../core/detector';
import { outcomeLabel } from '../../core/export';
import { deriveHandling } from '../../core/handling';
import { proposalFromForm, type FormChoices } from '../../core/interpretation';
import { analyzePairedDetector } from '../../core/pairedDetector';
import { requireCatalog } from '../../core/registry';
import { AtmosphereChart, IntervalChart } from '../charts';
import { MOON_RANGE, inMoonRange, psi, signedInt } from '../lib';
import Navigation from './Navigation';
import './landing.css';

function Action({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return <a className={`lp-button${primary ? ' lp-primary' : ''}`} href={href}>{children}<span aria-hidden="true">↗</span></a>;
}

/** Server-rendered worked examples, derived through the same reviewed core as the console. */
export default function Landing() {
  const catalog = requireCatalog();
  const cases = conditionDataset.cases;
  const inside = cases.filter((item) => inMoonRange(item.oxygenPercent, item.pressureKPa));
  const paired = analyzePairedDetector();
  const envelope = analyzeCutoffEnvelope();
  const sameR = detectorDataset.records.filter((row) => row.flight === '2' && row.materialRole === 'spacecraft_material' && row.channels.issObscurationV.status === 'finite');
  const zeroCount = sameR.filter((row) => row.channels.issObscurationV.value === 0).length;
  const maxOxygen = Math.max(...cases.map((item) => item.oxygenPercent));
  const now = new Date().toISOString();
  const example = (id: string, form: FormChoices) => {
    const proposal = proposalFromForm(form);
    return assess({ id: `REQ-LANDING-${id}`, revision: 'r1', originalText: `Landing worked example: ${id}`, confirmedAt: now,
      proposal, handling: deriveHandling(proposal).handling, inputMode: 'form', parentRequestRef: null,
      runtimeProvenanceRef: null, remainingScientificGaps: [] }, catalog, { now });
  };
  const brief = example('brief', { intent: 'synthesize_findings', safetyAreas: [] });
  const suppression = brief.claims.find((claim) => claim.kind === 'source_finding' && claim.route === 'direct' && claim.safetyAreas.includes('suppression'));
  if (!suppression) throw new Error('Landing requires the reviewed suppression finding.');
  const suppressionSource = catalog.sources.find((source) => source.id === suppression.sourceIds[0]);
  const models = [
    { label: 'Later CO₂ response', quantity: 'Q-CO2-REMOTE-CONC', claim: 'conditional_response' as const, scope: 'subsequent' as const },
    { label: 'Chemical heat release', quantity: 'Q-HEAT-CHEMICAL-RELEASE', claim: 'independent_prediction' as const, scope: 'unspecified' as const },
  ].map((item) => {
    const result = example(item.quantity, { intent: 'assess_physical_model', physicalModelId: 'PM-SVI25', eventIds: ['EV-SVI-6'],
      quantityIds: [item.quantity], requestedClaim: item.claim, temporalScope: item.scope, requestedFeature: item.claim === 'conditional_response' ? 'change' : 'unspecified' });
    const claim = result.claims.find((candidate) => candidate.kind === 'contract');
    if (!claim) throw new Error(`Landing model example has no reviewed contract: ${item.quantity}`);
    return { label: item.label, claim };
  });
  const difference = (summary: typeof paired.summary) => `${signedInt(summary.pairedDifference.numerator)}/${summary.pairedDifference.denominator}`;
  const stats = [
    { label: 'NASA profiles', value: atlas.records.length },
    { label: 'Findings & context', value: catalog.findings.length },
    { label: 'Atmosphere cases', value: cases.length },
    { label: 'Detector rows', value: detectorDataset.records.length },
    { label: 'Registry sources', value: catalog.sources.length },
  ];

  return <div className="lp">
    <Navigation />
    <main id="landing-main" tabIndex={-1}>
      <section id="intro" className="lp-hero lp-section" data-landing-section data-flame="burning" aria-labelledby="landing-title">
        <div className="lp-hero-copy">
          <p className="lp-eyebrow">NASA Space Apps 2026 · Flame in Freefall</p>
          <h1 id="landing-title">Fire-safety <br />evidence <br />for crewed <br />spaceflight</h1>
          <p className="lp-intro">Explore {atlas.records.length} NASA research profiles. Compare the conditions, inspect the measurements, and trace what the evidence establishes about prevention, detection and suppression.</p>
          <div className="lp-actions"><Action href="/console" primary>Open the research console</Action><Action href="#prevention">Read the four results</Action></div>
        </div>
        <dl className="lp-stats" aria-label="Current evidence collection">{stats.map((stat) => <div key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl>
      </section>

      <section id="prevention" className="lp-section lp-result" data-landing-section data-flame="rich" aria-labelledby="prevention-title">
        <div className="lp-copy">
          <p className="lp-eyebrow">01 / Prevention · Atmosphere</p>
          <p className="lp-number" aria-hidden="true">{inside.length}<span>/{cases.length}</span></p>
          <h2 id="prevention-title">{inside.length} of {cases.length} Saffire burns ran inside the Moon Base atmosphere range</h2>
          <p>The challenge describes {MOON_RANGE.minOxygenPercent}% oxygen or more and {MOON_RANGE.maxPressurePsi} psi or less. Only {inside.map((item) => item.sample).join(' and ')} sit inside that range. The highest oxygen level in this set is {maxOxygen}%.</p>
          <Action href="/console#atmospheres">Compare atmosphere cases</Action>
        </div>
        <div className="lp-panel">
          <div className="lp-chart-scroll" role="region" aria-label="Saffire atmosphere plot" tabIndex={0}>
            <AtmosphereChart title="Seven Saffire cases by oxygen and pressure, with the challenge Moon Base atmosphere range shaded" points={cases.map((item) => ({ id: item.id, label: item.sample, oxygen: item.oxygenPercent, pressure: item.pressureKPa, material: item.material }))} frontier={inside.map((item) => item.id)} />
          </div>
          <p className="lp-chart-hint">Scroll to view the full plot.</p>
          <div className="lp-table-scroll" role="region" aria-label="Saffire atmosphere case table" tabIndex={0}><table>
            <thead><tr><th scope="col">Case</th><th scope="col">Material</th><th scope="col">O₂ mol %</th><th scope="col">kPa</th><th scope="col">psi</th><th scope="col">pO₂ kPa</th></tr></thead>
            <tbody>{cases.map((item) => <tr key={item.id} className={inside.includes(item) ? 'lp-inside' : undefined}><th scope="row">{item.sample}</th><td>{item.material}, {item.sidesBurning}-sided</td><td>{item.oxygenPercent}</td><td>{item.pressureKPa}</td><td>{psi(item.pressureKPa)}</td><td>{item.oxygenPartialPressureKPa}</td></tr>)}</tbody>
          </table></div>
          <p className="lp-source"><a href={conditionDataset.source.publicUrl}>ICES-2026-577, Table 1</a> · atmosphere coordinates, not a flammability result · psi and pO₂ are arithmetic.</p>
        </div>
      </section>

      <section id="detection" className="lp-section lp-result" data-landing-section data-flame="sensed" aria-labelledby="detection-title">
        <div className="lp-copy">
          <p className="lp-eyebrow">02 / Detection · Smoke</p>
          <p className="lp-number" aria-hidden="true">{signedInt(paired.summary.pairedDifference.numerator)}<span>/{paired.summary.pairedDifference.denominator}</span></p>
          <h2 id="detection-title">A pooled detector result hides two flights that disagree</h2>
          <p>At a 2 V cutoff, scatter is at or above cutoff in {paired.summary.pairedDifference.numerator} more rows of {paired.summary.pairedDifference.denominator} than obscuration. Split by flight, the sign flips: {difference(paired.byFlight[0].summary)} on SAME, {difference(paired.byFlight[1].summary)} on SAME-R.</p>
          <Action href="/console#smoke">Open the smoke lab</Action>
        </div>
        <div className="lp-panel">
          <div className="lp-chart-scroll" role="region" aria-label="Detector cutoff ranges" tabIndex={0}>
            <IntervalChart title="Exact scatter minus obscuration fraction bounds over independent 1 to 3 volt cutoffs, pooled and by flight" rows={[{ label: 'Pooled', summary: envelope.summary }, ...envelope.byFlight].map((item) => ({ label: item.label,
              note: `[${signedInt(item.summary.pairedDifferenceEnvelope.lowerNumerator)}, ${signedInt(item.summary.pairedDifferenceEnvelope.upperNumerator)}]/${item.summary.pairedDifferenceEnvelope.denominator}`,
              lower: item.summary.pairedDifferenceEnvelope.lowerFraction, upper: item.summary.pairedDifferenceEnvelope.upperFraction }))} />
          </div>
          <p className="lp-chart-hint">Scroll to view the full plot.</p>
          <dl className="lp-spec">
            <div><dt>Channels</dt><dd>ISS scatter (AW) minus ISS obscuration (AV)</dd></div>
            <div><dt>Cutoff range</dt><dd>Each cutoff anywhere in 1 to 3 V; bars are exact bounds, not confidence intervals.</dd></div>
            <div><dt>Cell audit</dt><dd>{zeroCount} of {sameR.length} SAME-R obscuration readings are stored as exactly 0 V.</dd></div>
            <div><dt>Interpretation</dt><dd>Opposite signs hold across the range. The channels have different measurement operators; these counts do not establish detector superiority.</dd></div>
          </dl>
          <p className="lp-source">NASA {detectorDataset.source.accession}, {detectorDataset.source.workbook.sheet} sheet · a cutoff is not an alarm threshold · rows are not independent trials. <a href="/console#sources">Inspect the source</a></p>
        </div>
      </section>

      <section id="suppression" className="lp-section lp-result" data-landing-section data-flame="cool" aria-labelledby="suppression-title">
        <div className="lp-copy">
          <p className="lp-eyebrow">03 / Suppression · Droplets</p>
          <p className="lp-number lp-word" aria-hidden="true">Out?</p>
          <h2 id="suppression-title">{suppression.title}</h2>
          <p>{suppression.authoritativeText}</p>
          <Action href="/console#findings">Read the suppression findings</Action>
        </div>
        <div className="lp-panel">
          <p className="lp-eyebrow">NASA source wording</p>
          <blockquote className="lp-quote">{suppression.sourceFindingText}</blockquote>
          <dl className="lp-spec"><div><dt>Scope</dt><dd>{suppression.qualifications[0]}</dd></div><div><dt>Interpretation</dt><dd>Visible flame loss is not proof that the reaction stopped.</dd></div></dl>
          <p className="lp-source"><a href={suppressionSource?.canonicalUri ?? '/console#sources'}>{suppressionSource?.title ?? 'Read the source'}</a></p>
        </div>
      </section>

      <section id="models" className="lp-section lp-result" data-landing-section data-flame="model" aria-labelledby="models-title">
        <div className="lp-copy">
          <p className="lp-eyebrow">04 / Models · Claim check</p>
          <p className="lp-number" aria-hidden="true">{catalog.contracts.length}<span>rules</span></p>
          <h2 id="models-title">The same cabin model supports one comparison and rejects a stronger claim</h2>
          <p>IGNIS checks a requested claim against {catalog.contracts.length} reviewed rules. The model stays fixed; the answer depends on the quantity, conditions and intended use. Each result identifies the requirements, missing evidence and claims the source cannot support.</p>
          <Action href="/console#findings">Check a model claim</Action>
        </div>
        <div className="lp-panel lp-verdicts">{models.map(({ label, claim }) => <article key={label}>
          <p className="lp-eyebrow">{label} · Saffire VI cabin model</p>
          <h3><span className={claim.outcome === 'specified_conditional_comparison' ? 'lp-dot' : 'lp-diamond'} aria-hidden="true" />{outcomeLabel(claim)}</h3>
          <p>{claim.authoritativeText}</p>
          <dl className="lp-spec"><div><dt>Requirements</dt><dd>{claim.predicateResults.filter((check) => check.truth === 'satisfied').length} of {claim.predicateResults.length} met</dd></div><div><dt>Do not claim</dt><dd>{claim.forbiddenStrongerClaims.slice(0, 2).join('; ')}</dd></div></dl>
        </article>)}</div>
      </section>

      <section id="gaps" className="lp-section lp-gaps" data-landing-section data-flame="model" aria-labelledby="gaps-title">
        <p className="lp-eyebrow">05 / Gaps · Where the data stops</p>
        <h2 id="gaps-title">Four limits to carry into the next study</h2>
        <div className="lp-gap-grid">
          <article><p className="lp-gap-number">0</p><h3>Lunar or Mars gravity cases</h3><p>All {cases.length} atmosphere cases in this workspace ran in microgravity. They do not establish performance in lunar or Martian gravity.</p><a href="/console#atmospheres">Review the conditions ↗</a></article>
          <article><p className="lp-gap-number">{maxOxygen}%</p><h3>Oxygen ceiling in this set</h3><p>The highest oxygen level among these {cases.length} cases. Richer atmospheres lie beyond the measured coordinates.</p><a href={conditionDataset.source.publicUrl}>ICES-2026-577, Table 1 ↗</a></article>
          <article><p className="lp-gap-number">1</p><h3>Flow-direction conflict</h3><p>{conditionDataset.flowConflict.canonicalSourceStatement} {conditionDataset.flowConflict.earlierSourceStatement} Flow equivalence remains unresolved.</p><a href="/console#atmospheres">Compare the source versions ↗</a></article>
          <article><p className="lp-gap-number">{zeroCount}</p><h3>Stored zeros need context</h3><p>Every finite SAME-R obscuration value in the selected spacecraft-material rows is zero. The values alone cannot establish the channel’s operational state.</p><a href="/console#smoke">Inspect the row audit ↗</a></article>
        </div>
      </section>

      <section id="workflow" className="lp-section lp-close" data-landing-section data-flame="dim" aria-labelledby="workflow-title">
        <p className="lp-eyebrow">From question to exportable evidence</p>
        <h2 id="workflow-title">Five steps in the <br />research console</h2>
        <ol className="lp-steps">
          <li><a href="/console#investigations"><span>01</span><h3>Find</h3><p>{atlas.records.length} NASA profiles; {brief.ranking.length} investigations ranked by reviewed evidence.</p></a></li>
          <li><a href="/console#atmospheres"><span>02</span><h3>Compare</h3><p>{cases.length} atmosphere cases against your oxygen and pressure target.</p></a></li>
          <li><a href="/console#smoke"><span>03</span><h3>Inspect</h3><p>{detectorDataset.records.length} detector rows, with cutoff and missing-data controls.</p></a></li>
          <li><a href="/console#findings"><span>04</span><h3>Check</h3><p>A model claim against {catalog.contracts.length} reviewed applicability rules.</p></a></li>
          <li><a href="/console#figures"><span>05</span><h3>Reproduce</h3><p>Figures with Python code, exact data and an exportable research notebook.</p></a></li>
        </ol>
        <Action href="/console" primary>Open the research console</Action>
        <p className="lp-more">Working with your own measurements? <a href="/console#local-data">Bring your data</a> · <a href="/console">Ask SI in the console</a></p>
      </section>
    </main>
    <footer className="lp-footer"><a className="lp-brand" href="#intro">IGNIS <span> / Emberfall</span></a><nav aria-label="Project resources"><a href="/console#sources">Sources & methods</a><a href="/console#figures">Figures & code</a><a href="https://github.com/GA5413L/IGNIS">GitHub ↗</a></nav></footer>
  </div>;
}
