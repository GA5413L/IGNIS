'use client';

export function downloadResearch(name: string, data: unknown) {
  downloadBlob(name, new Blob([JSON.stringify(data, null, 2) + '\n'], { type: 'application/json' }));
}

export function downloadBlob(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function SourceHash({ hash }: { hash: string }) {
  return <details className="hash-detail"><summary>Source fingerprint (SHA-256)</summary><code>{hash}</code></details>;
}

export function ResearchHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <div className="research-heading"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="lede">{children}</p></div>;
}

export function Stat({ value, label, note }: { value: React.ReactNode; label: string; note?: string }) {
  return <div className="stat"><strong className="num">{value}</strong><span>{label}</span>{note && <small>{note}</small>}</div>;
}
