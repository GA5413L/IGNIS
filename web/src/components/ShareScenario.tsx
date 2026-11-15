'use client';
import { useState } from 'react';
import { digestOf } from '../core/canonicalize';
import type { ResearchSelection } from '../core/researchSelections';
import { encodeScenario, makeScenario } from '../core/scenario';

export default function ShareScenario({ selection }: { selection: ResearchSelection }) {
  const [link, setLink] = useState<{ url: string; selectionDigest: string } | null>(null);
  const [message, setMessage] = useState('');
  const current = link?.selectionDigest === digestOf(selection);
  const create = () => {
    try {
      const url = new URL(window.location.href); url.search = ''; url.hash = encodeScenario(makeScenario(selection));
      setLink({ url: url.href, selectionDigest: digestOf(selection) }); setMessage('Scenario link ready. It reopens this analysis and rechecks its source, method and result.');
    } catch (error) { setMessage((error as Error).message); }
  };
  return <div className="scenario-share">
    <button className="btn" onClick={create}>Create scenario link</button>
    {link && current && <div className="scenario-link-fields"><label>Scenario URL<input readOnly value={link.url} onFocus={(e) => e.target.select()} /></label>
      <div className="row"><button className="btn" onClick={async () => {
        try { await navigator.clipboard.writeText(link.url); setMessage('Scenario link copied.'); }
        catch { setMessage('Copy is unavailable here. Select and copy the Scenario URL above.'); }
      }}>Copy link</button><a className="linkbtn" href={link.url} target="_blank" rel="noreferrer">Open scenario ↗</a></div>
      <p className="hint">Includes analysis settings and any written exclusion reasons. Notebook history and question text are separate. A localhost link opens on this computer.</p>
    </div>}
    {link && !current && <p className="hint">Settings changed. Create a new link for the current selection.</p>}
    {message && <p className="hint" role="status">{message}</p>}
  </div>;
}
