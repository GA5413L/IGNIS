'use client';

import { useEffect, useState } from 'react';
import { VIEWS } from '../lib';
import Flame, { type FlameState } from './Flame';

const SECTIONS = [
  { id: 'prevention', label: 'Prevention' },
  { id: 'detection', label: 'Detection' },
  { id: 'suppression', label: 'Suppression' },
  { id: 'models', label: 'Models' },
  { id: 'gaps', label: 'Gaps' },
];

export default function Navigation() {
  const [active, setActive] = useState('intro');
  const [flame, setFlame] = useState<FlameState>('burning');

  useEffect(() => {
    // Preserve links shared before the dashboard moved from / to /console.
    const redirectLegacy = () => {
      if (VIEWS.some((view) => `#${view.id}` === window.location.hash)) {
        window.location.replace(`/console${window.location.search}${window.location.hash}`);
      }
    };
    redirectLegacy();
    window.addEventListener('hashchange', redirectLegacy);
    const observer = new IntersectionObserver((entries) => {
      const entry = entries.find((candidate) => candidate.isIntersecting);
      if (!entry) return;
      setActive(entry.target.id);
      setFlame((entry.target as HTMLElement).dataset.flame as FlameState);
    }, { rootMargin: '-30% 0px -50% 0px', threshold: 0 });
    document.querySelectorAll('[data-landing-section]').forEach((section) => observer.observe(section));
    return () => { observer.disconnect(); window.removeEventListener('hashchange', redirectLegacy); };
  }, []);

  return <>
    <Flame state={flame} />
    <a className="lp-skip" href="#landing-main">Skip to content</a>
    <header className="lp-nav">
      <a className="lp-brand" href="#intro" aria-label="IGNIS home">
        <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="10" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="16" cy="16" r="3.5" fill="#6ea8ff" /></svg>
        <span translate="no">IGNIS</span>
      </a>
      <nav aria-label="Research highlights">
        {SECTIONS.map((section) => <a key={section.id} href={`#${section.id}`} aria-current={active === section.id ? 'location' : undefined}>{section.label}</a>)}
      </nav>
      <a className="lp-button lp-primary lp-nav-cta" href="/console">Open the console<span aria-hidden="true">↗</span></a>
    </header>
  </>;
}
