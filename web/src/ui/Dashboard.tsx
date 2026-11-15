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
import LocalData from './LocalData';
import SI from './SI';
import type { RecheckedSession } from '../core/researchSession';
import { PALETTES, type ChartPalette } from './palette';

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
  restore: (review: RecheckedSession) => void;
  clearNotebook: () => void;
  palette: ChartPalette;
  setPalette: (palette: ChartPalette) => void;
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
  const historyRef = useRef<Assessment[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [palette, setPalette] = useState<ChartPalette>('okabe-ito');
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
        if (live) {
          setBrief(nextBrief);
          if (!historyRef.current.length) { historyRef.current = [nextBrief]; setHistory([nextBrief]); }
        }
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
  const record = useCallback((assessment: Assessment) => {
    const current = historyRef.current;
    if (current.some((a) => a.id === assessment.id)) return;
    if (current.length >= 16) throw new Error('Notebook is full (16 assessments). Download it, then start a new notebook in Sources. Nothing was truncated.');
    if (assessment.parentAssessmentId && !current.some((a) => a.id === assessment.parentAssessmentId)) throw new Error('The parent assessment is absent from the notebook. Start a new question.');
    historyRef.current = [...current, assessment]; setHistory(historyRef.current);
  }, []);
  const restore = useCallback((review: RecheckedSession) => {
    historyRef.current = review.assessments; setHistory(review.assessments); setSelections(review.session.selections);
    notify('Recomputed assessments loaded into the notebook. Historical originals remain separate.');
  }, [notify]);
  const clearNotebook = useCallback(() => { historyRef.current = []; setHistory([]); notify('New empty notebook started.'); }, [notify]);

  const shared = useMemo<Shared>(() => ({ catalog, health, brief, loadError, selections, attach, detach, go, notify, focus, history, record, restore, clearNotebook, palette, setPalette }),
    [catalog, health, brief, loadError, selections, attach, detach, go, notify, focus, history, record, restore, clearNotebook, palette]);

  const current = VIEWS.find((item) => item.id === view)!;
  useEffect(() => {
    document.title = `${current.title} · IGNIS`;
    document.querySelector('.nav [aria-current="page"]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [current.title]);

  return (
    <div className="shell" data-palette={palette}>
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
        <div className="rail-foot"><label className="field"><span>Chart palette</span>
          <select value={palette} onChange={(event) => setPalette(event.target.value as ChartPalette)}>
            {PALETTES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select></label></div>
      </header>
      <main className="main" id="main" tabIndex={-1} ref={mainRef}>
        {view === 'overview' && <Overview shared={shared} />}
        {view === 'investigations' && <Investigations shared={shared} />}
        {view === 'atmospheres' && <Atmospheres shared={shared} />}
        {view === 'smoke' && <SmokeLab shared={shared} />}
        {view === 'findings' && <Findings shared={shared} />}
        {view === 'figures' && <Figures shared={shared} />}
        {view === 'sources' && <Sources shared={shared} />}
        <div hidden={view !== 'local-data'}>{/* Keep supplied data in memory when switching views; never persist it. */}
          <LocalData />
        </div>
        <div hidden={view !== 'si'}><SI shared={shared} /></div>
      </main>
      <div aria-live="polite" role="status">{toast && <div className="toast">{toast}</div>}</div>
    </div>
  );
}
