import snapshot from '../data/citation-metadata.json';

const LABELS: Record<string, string> = { metadata_match: 'Identifier + title match', title_differs: 'Title differs — review needed', identifier_mismatch: 'Identifier mismatch',
  unavailable: 'Lookup unavailable', not_found: 'Identifier not found', invalid_response: 'Invalid metadata response' };
export default function CitationChecks() {
  const matches = snapshot.records.filter((r) => r.status === 'metadata_match').length;
  return <section className="section" aria-labelledby="citation-checks">
    <div className="section-head"><h2 id="citation-checks">Citation identity checks</h2><span className="tag outline">{matches} of {snapshot.records.length} metadata matches</span></div>
    <p>Saved responses from NASA NTRS, Crossref and DataCite match the registered identifiers and titles below. A matching record does not establish that a paper supports a particular claim; use the cited source and its locator for that check.</p>
    <p className="muted">Snapshot prepared {snapshot.checkedAt.replace('T', ' ').replace(/\.\d+Z$/, ' UTC')}. These identifiers have not been rechecked since their recorded lookup times. Other catalogue sources have no check in this snapshot.</p>
    <div className="table-wrap"><table><thead><tr><th scope="col">Publication / dataset</th><th scope="col">Registry</th><th scope="col">Check</th></tr></thead>
      <tbody>{snapshot.records.map((r) => <tr key={r.id}><th scope="row">{r.expectedTitle}<small className="muted" style={{ display: 'block' }}>{r.identifier}</small></th>
        <td><a href={r.endpoint} target="_blank" rel="noreferrer">{r.provider === 'ntrs' ? 'NASA NTRS' : r.provider === 'crossref' ? 'Crossref' : 'DataCite'} metadata</a></td>
        <td>{LABELS[r.status] ?? 'Unknown status'}<details><summary>Lookup details</summary><div className="details-body">
          <p>Checked: {r.checkedAt.replace('T', ' ').replace(/\.\d+Z$/, ' UTC')} · HTTP {r.httpStatus ?? 'unavailable'}</p>
          <p>Returned identifier: {r.returnedIdentifier ?? 'unavailable'}</p><p>Returned title: {r.returnedTitle ?? 'unavailable'}</p>
          <p style={{ overflowWrap: 'anywhere' }}>Metadata SHA-256: {r.metadataSha256 ?? 'unavailable'}</p>
          <p className="muted">The hash identifies the retrieved bytes; it does not authenticate the publication or establish its current status.</p>
        </div></details></td></tr>)}</tbody>
    </table></div>
    <details><summary>Method and machine-readable receipt</summary><div className="details-body"><p>{snapshot.titleComparison}</p><p>{snapshot.scope}</p><a href="/api/citations" target="_blank" rel="noreferrer">Open citation check receipt · JSON</a></div></details>
  </section>;
}
