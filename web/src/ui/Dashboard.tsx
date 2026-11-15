'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Assessment } from '../core/assess';
import type { ResearchSelection } from '../core/researchSelections';
import type { SafetyArea } from '../core/schemas';
import { VIEWS, getJson, postAssess, type CatalogBody, type Health, type ViewId } from './lib';
import Overview from './Overview';
import Investigations from './Investigations';
import Atmospheres from './Atmospheres';
import SmokeLab from './SmokeLab';
import Findings from './Findings';
import Sources from './Sources';
import Figures from './Figures';

export interface Shared {
  catalog: CatalogBody | null;
  health: Health | null;
  brief: Assessment | null;
  loadError: string | null;
  selections: ResearchSelection[];
  attach: (selection: ResearchSelection) => void;
  detach: (kind: ResearchSelection['kind']) => void;
  go: (view: ViewId, focus?: { area?: SafetyArea; investigation?: string }) => void;
  notify: (message: string) => void;
  focus: { area?: SafetyArea; investigation?: string };
  history: Assessment[];
  record: (assessment: Assessment) => void;
}

const isView = (value: string): value is ViewId => VIEWS.some((view) => view.id === value);

export default function Dashboard() {
  const [view, setView] = useState<ViewId>('overview');
  const [catalog, setCatalog] = useState<CatalogBody | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [brief, setBrief] = useState<Assessment | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selections, setSelections] = useState<ResearchSelection[]>([]);
  const [focus, setFocus] = useState<Shared['focus']>({});
  const [history, setHistory] = useState<Assessment[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const mainRef = useRef<HTMLElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const read = () => {
      const id = window.location.hash.replace('#', '');
      if (isView(id)) setView(id);
    };
    read();
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, []);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const [nextCatalog, nextHealth] = await Promise.all([getJson<CatalogBody>('/api/catalog'), getJson<Health>('/api/health')]);
        if (!live) return;
        setCatalog(nextCatalog);
        setHealth(nextHealth);
        const nextBrief = await postAssess({ intent: 'synthesize_findings', safetyAreas: [] }, 'Fire-safety brief across prevention, detection and suppression', nextCatalog.revision);
        if (live) setBrief(nextBrief);
      } catch (error) {
        if (live) setLoadError(error instanceof Error ? error.message : 'The evidence registry could not be loaded.');
      }
    })();
    return () => { live = false; };
  }, []);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const go = useCallback<Shared['go']>((next, nextFocus = {}) => {
    setFocus(nextFocus);
    setView(next);
    window.history.pushState(null, '', `#${next}`);
    window.scrollTo({ top: 0 });
    mainRef.current?.focus({ preventScroll: true });
  }, []);

  const attach = useCallback((selection: ResearchSelection) => {
    setSelections((current) => [...current.filter((item) => item.kind !== selection.kind), selection]);
    notify('Analysis attached. It will travel with your next brief or model claim.');
  }, [notify]);
  const detach = useCallback((kind: ResearchSelection['kind']) => setSelections((current) => current.filter((item) => item.kind !== kind)), []);
  const record = useCallback((assessment: Assessment) => setHistory((current) => [...current, assessment].slice(-16)), []);

  const shared = useMemo<Shared>(() => ({ catalog, health, brief, loadError, selections, attach, detach, go, notify, focus, history, record }),
    [catalog, health, brief, loadError, selections, attach, detach, go, notify, focus, history, record]);

  const current = VIEWS.find((item) => item.id === view)!;
  useEffect(() => {
    document.title = `${current.title} · IGNIS`;
    document.querySelector('.nav [aria-current="page"]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [current.title]);

  return (
    <div className="shell">
      <a className="skip" href="#main">Skip to content</a>
      <header className="rail">
        <a className="brand" href="#overview" onClick={(event) => { event.preventDefault(); go('overview'); }}>
          <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="16" cy="16" r="3.5" fill="#6ea8ff" />
          </svg>
          <span className="brand-name" translate="no">IGNIS<span className="brand-sub">Fire-safety evidence</span></span>
        </a>
        <nav className="nav" aria-label="Dashboard sections">
          {VIEWS.map((item, index) => (
            <a key={item.id} href={`#${item.id}`} aria-current={item.id === view ? 'page' : undefined}
              onClick={(event) => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return; event.preventDefault(); go(item.id); }}>
              <span className="mono" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{item.label}
            </a>
          ))}
        </nav>
        <div className="rail-foot">
          <dl>
            <div><dt>Evidence registry</dt><dd>{catalog ? catalog.revision : 'Loading\u2026'}</dd></div>
            <div><dt>Build</dt><dd>{health ? health.buildRevision : 'Loading\u2026'}</dd></div>
          </dl>
          <span className="status"><i className={`dot${health?.aiAvailable ? '' : ' off'}`} aria-hidden="true" />
            {health?.aiAvailable ? 'Language interpretation on' : 'Answers come from fixed, reviewed rules'}</span>
          <p>Independent NASA Space Apps 2026 project by team Emberfall. Not affiliated with or endorsed by NASA.</p>
        </div>
      </header>
      <main className="main" id="main" tabIndex={-1} ref={mainRef}>
        {view === 'overview' && <Overview shared={shared} />}
        {view === 'investigations' && <Investigations shared={shared} />}
        {view === 'atmospheres' && <Atmospheres shared={shared} />}
        {view === 'smoke' && <SmokeLab shared={shared} />}
        {view === 'findings' && <Findings shared={shared} />}
        {view === 'figures' && <Figures shared={shared} />}
        {view === 'sources' && <Sources shared={shared} />}
      </main>
      <div aria-live="polite" role="status">{toast && <div className="toast">{toast}</div>}</div>
    </div>
  );
}
