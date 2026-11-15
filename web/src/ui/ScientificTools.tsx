'use client';
import { useState } from 'react';
import { auditDesign, TWO_POINT_DESIGN_EXAMPLE } from '../core/designAudit';
import { auditEndpoints, endpointExample } from '../core/endpointAudit';
import { calculateTrajectory, trajectoryExample } from '../core/trajectory';
import { digestOf } from '../core/canonicalize';
import { download } from './lib';

const METHODS = {
  trajectory: { label: 'Tracked-coordinate arithmetic', purpose: 'Exact frame timing and net displacement per elapsed second. Optional asserted endpoint bounds remain separate from confidence intervals.',
    limit: 'A coordinate secant does not identify an instantaneous flame-spread rate or establish calibration.', example: trajectoryExample, run: calculateTrajectory,
    source: 'https://escholarship.org/uc/item/5px3896h', sourceLabel: 'Liveretou dissertation: measurement context' },
  design: { label: 'Nominal design identifiability', purpose: 'Inspect exact rank and unidentified directions for the declared RIES24 nominal-design basis. Candidate coordinates are hypothetical.',
    limit: 'A rank increase is not an optimal experiment, a physical prediction or a safety recommendation.', example: () => structuredClone(TWO_POINT_DESIGN_EXAMPLE), run: auditDesign,
    source: '/api/design-audit', sourceLabel: 'Design contract, source dossier and API' },
  endpoint: { label: 'Endpoint and protocol audit', purpose: 'Keep detected spread, visible flame and fuel regression separate. Check what a supplied observation record does and does not identify.',
    limit: 'Test termination is not an extinction observation. Conditional mathematical sets require the explicitly declared hypotheses.', example: endpointExample, run: auditEndpoints,
    source: '/api/endpoint-audit', sourceLabel: 'Endpoint contract, source dossier and API' },
};
type Method = keyof typeof METHODS;
type Result = ReturnType<typeof calculateTrajectory> | ReturnType<typeof auditDesign> | ReturnType<typeof auditEndpoints>;

export default function ScientificTools() {
  const [method, setMethod] = useState<Method>('trajectory');
  const [input, setInput] = useState(() => JSON.stringify(trajectoryExample(), null, 2));
  const [result, setResult] = useState<Result | null>(null), [error, setError] = useState('');
  const entry = METHODS[method];
  return <section className="section" aria-labelledby="scientific-tools"><div className="section-head"><h2 id="scientific-tools">Additional scientific methods</h2><p>Three audited local calculators from the later research track.</p></div>
    <details><summary>Open scientific calculators</summary><div className="details-body">
      <div className="fields"><label className="field"><span>Scientific method</span><select value={method} onChange={(e) => {
        const next = e.target.value as Method; setMethod(next); setInput(JSON.stringify(METHODS[next].example(), null, 2)); setResult(null); setError('');
      }}>{Object.entries(METHODS).map(([id, m]) => <option key={id} value={id}>{m.label}</option>)}</select></label></div>
      <h3>{entry.label}</h3><p>{entry.purpose}</p><p className="flag">{entry.limit}</p>
      <p>Examples are hypothetical. Source dossiers supply methodological context; example coordinates and observations are not extracted paper measurements. Inputs are processed in this browser.</p>
      <label className="field"><span>Scientific calculation input (JSON, at most 16 KiB)</span><textarea className="local-json" rows={12} maxLength={16384} spellCheck={false} value={input} onChange={(e) => { setInput(e.target.value); setResult(null); setError(''); }} /></label>
      <div className="btn-row"><button type="button" className="btn" onClick={() => {
        try { if (new TextEncoder().encode(input).length > 16384) throw new Error('Input exceeds 16 KiB.'); setResult(entry.run(JSON.parse(input))); setError(''); }
        catch (e) { setResult(null); setError(e instanceof Error ? e.message : 'Calculation failed.'); }
      }}>Run local calculation</button>
        <button type="button" className="btn ghost" onClick={() => { setInput(JSON.stringify(entry.example(), null, 2)); setResult(null); setError(''); }}>Reset hypothetical input</button></div>
      {error && <p className="error" role="alert">{error}</p>}
      {result && <article className="card" aria-label="Scientific calculation result"><h3>Calculated from the supplied input</h3><p className="mono">{result.methodRevision}</p>
        {'windows' in result && <div className="table-wrap"><table><thead><tr><th>Window</th><th>Elapsed seconds</th><th>Displacement / elapsed time (mm/s)</th><th>Asserted bound status</th></tr></thead><tbody>
          {result.windows.map((w) => <tr key={w.id}><th>{w.id}</th><td>{w.elapsedSeconds}</td><td>{w.netDisplacementPerElapsedSecond}</td><td>{w.conditionalPositionBound.status}</td></tr>)}
        </tbody></table></div>}
        {'certificate' in result && <p>Reported-design rank: {result.certificate.reportedDesignRank} for the specified deviation basis. Unidentified directions: at least {result.certificate.minimumUnidentifiedDirectionsInTwoTermClass} in the two-term class and {result.certificate.expandedClassUnidentifiedDirections} in the expanded class, with the baseline fixed.</p>}
        {'runs' in result && <p>{result.runs.length} supplied run records audited. The full result keeps each observation criterion and its assumptions separate.</p>}
        <p className="muted">This verifies the implemented calculation on these inputs. No physical validation, experimental recommendation or independent human review is implied.</p>
        <details><summary>Full calculation, provenance and limits</summary><pre className="local-json">{JSON.stringify(result, null, 2)}</pre></details>
        <button type="button" className="btn ghost" onClick={() => download(`ignis-${method}-calculation.json`, JSON.stringify({ method, input: JSON.parse(input), result, resultDigest: digestOf(result), integrityMeaning: 'checksum_not_signature' }, null, 2) + '\n')}>Download calculation record</button>
      </article>}
      <div className="card-foot"><a href={entry.source} target="_blank" rel="noreferrer">{entry.sourceLabel}</a><span>Scientific contracts are separate from the original r2 registry.</span></div>
    </div></details>
  </section>;
}
