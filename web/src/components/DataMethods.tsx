import opportunities from '../data/research-opportunities.json';
import { downloadResearch, ResearchHeading, SourceHash } from './researchShared';

export default function DataMethods() {
  return <>
    <ResearchHeading eyebrow="DATA & METHODS" title="What can this evidence support?">Find the next useful measurement, understand its role, and identify the checks needed before comparing or fitting a model.</ResearchHeading>
    <section className="panel" aria-labelledby="professional-method-h">
      <h2 id="professional-method-h">A model comparison needs a measurement chain</h2>
      <p>In NASA’s published Saffire VI vehicle analysis, the source histories, calibration and comparison measurements serve different roles. Keeping them visible changes which conclusions the comparison can support.</p>
      <div className="scroll-x"><table aria-label="Saffire model data roles"><thead><tr><th scope="col">Role</th><th scope="col">Published Saffire example</th><th scope="col">Consequence for the claim</th></tr></thead><tbody>
        <tr><td>Forcing</td><td>Payload inlet/outlet histories supply heat and species inputs.</td><td>A transport response conditional on these inputs is not an independent material-yield prediction.</td></tr>
        <tr><td>Calibration ancestry</td><td>A cargo heat-transfer coefficient calibrated against Saffire V RS3 is reused in Saffire VI.</td><td>The parameter’s calibration event remains part of the model-use record.</td></tr>
        <tr><td>Comparison and alignment</td><td>Remote CO₂ and temperature histories; simulated baselines aligned to initial sensor readings.</td><td>Subsequent response agreement does not establish unadjusted initial-value agreement.</td></tr>
      </tbody></table></div>
      <p className="hint">Source: <a href="https://ntrs.nasa.gov/citations/20250002675" target="_blank" rel="noreferrer">Vehicle Modeling During the Burn Events in the Saffire VI Experiments</a>, PDF pp. 4, 6–8, 11–12. Role interpretations are assistant-checked. Published simulations were not rerun in IGNIS.</p>
      <details><summary>How specialist tools are constructed</summary><ul>
        <li><a href="https://pages.nist.gov/fds-smv/" target="_blank" rel="noreferrer">FDS and Smokeview</a>: mesh, geometry, source terms and boundary conditions feed a fire-flow solver; a separate viewer displays the outputs. Validation is specific to the output and intended use.</li>
        <li><a href="https://pages.nist.gov/cfast/" target="_blank" rel="noreferrer">CFAST</a>: conservation equations for idealized upper/lower compartment gas layers. Its terrestrial abstraction is not an established zero-gravity cabin model.</li>
        <li><a href="https://cantera.org/stable/reference/index.html" target="_blank" rel="noreferrer">Cantera</a>: chemical mechanisms, thermodynamics and transport feed reactor and reacting-flow solvers. Mechanism sensitivity and numerical convergence answer separate questions.</li>
      </ul><p>No solver is installed or executed by this workspace. Documented Saffire use establishes FDS/PyroSim use; this review does not establish NASA operational use of CFAST or Cantera.</p></details>
    </section>
    <section className="panel" aria-labelledby="range-method-h"><h2 id="range-method-h">A mathematical check on the cutoff choice</h2>
      <p>The cutoff-range audit asks a finite, reproducible question: across two independently declared voltage ranges, what is the smallest and largest difference between the channels’ at-or-above fractions on the same source rows?</p>
      <p>Raising A’s cutoff decreases its count; raising B’s cutoff decreases the subtracted count. The exact extrema therefore occur at opposite corners. Stored-value equality stays included, and the export preserves the step intervals and source-row witnesses. No fitted model or numerical grid is required.</p>
      <p className="hint">The ranges are analyst-selected sensitivity choices. They are not calibrated uncertainty, confidence intervals, alarm thresholds or evidence that the instruments measure equivalent quantities. Missing-reading completion bounds remain separate. Source, method and result fingerprints support rechecking; they do not establish scientific validity.</p>
      <p className="hint"><a href="https://standards.nasa.gov/standard/NASA/NASA-STD-7009" target="_blank" rel="noreferrer">NASA’s model and simulation standard</a> distinguishes verification and intended-use validation. IGNIS uses that distinction without claiming NASA accreditation.</p>
    </section>
    <section className="panel" aria-labelledby="ml-method-h"><h2 id="ml-method-h">Does this task need machine learning?</h2>
      <p><strong>For the present source comparisons: no.</strong> Exact row pairing, missingness, cohort sensitivity, source conflicts and replay are deterministic operations. They can expose a result that changes with the selected population without fitting a predictor.</p>
      <p>A later FLEX model could study the recorded termination category using pre-test information. “Extinction”, “Disruption” and “Completion” are different endpoints. Burn duration and extinction diameter cannot silently become pre-test features. The <a href="https://psi.nasa.gov/physci/repo/data/investigations/PSI-69" target="_blank" rel="noreferrer">FLEX source</a> and run ancestry need review before a model-ready table is defined.</p>
      <p className="hint">Required before fitting: a defined target and prediction time, reconciled source versions/units, dependency-aware holdouts, training-only preprocessing, simple baselines, calibration checks and a separate final evaluation. New physical predictors and live AI comparisons: NOT RUN.</p>
    </section>
    <section className="panel" aria-labelledby="opportunities-h"><div className="section-heading"><div><p className="eyebrow">REVIEWED SOURCE OPPORTUNITIES</p><h2 id="opportunities-h">Four concrete next investigations</h2></div><button className="btn" onClick={() => downloadResearch('ignis-research-opportunities.json', opportunities)}>Export research opportunities</button></div>
      <p className="hint">{opportunities.reviewStatus} {opportunities.admissionPolicy}</p>
      <div className="opportunity-grid">{opportunities.opportunities.map((o) => <article className="research-attachment" key={o.id}><p className="eyebrow">{o.availability.replaceAll('-', ' ')}</p><h3>{o.title}</h3><p>{o.purpose}</p><p><strong>Data role:</strong> {o.sourceRole}</p>
        <details><summary>Measurements, exact sources and next checks</summary><ul>{o.fields.map((f) => <li key={f.name}><strong>{f.name}</strong> · {f.unit}<br /><span className="hint">{f.locator}</span></li>)}</ul>
          {o.sources.map((s) => <div className="source-opportunity" key={s.sha256}><a href={s.url} target="_blank" rel="noreferrer">{s.title} ↗</a><p className="hint">{s.asset}<br />{s.locator}<br />{s.rights}</p><SourceHash hash={s.sha256} /></div>)}
          <h4>What this cannot establish</h4><ul>{o.cannotEstablish.map((s) => <li key={s}>{s}</li>)}</ul><p><strong>Before admission:</strong> {o.nextAdmissionCheck}</p></details>
      </article>)}</div>
    </section>
  </>;
}
