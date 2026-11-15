'use client';

import type { ChartPalette } from './palette';

const COLORS: Record<string, string> = { Kapton: '#56B4E9', Teflon: '#E69F00', Lampwick: '#009E73', Silicone: '#CC79A7', Pyrell: '#F0E442', DBP: '#D55E00' };
export const MATERIAL_SHAPES: Record<string, string> = { Kapton: 'circle', Teflon: 'square', Lampwick: 'triangle', Silicone: 'diamond', Pyrell: 'cross', DBP: 'plus' };

export function materialColor(material: string, palette: ChartPalette, surface: 'dark' | 'light' = 'dark'): string {
  return palette === 'monochrome' ? (surface === 'light' ? '#111111' : '#f4f4f4') : COLORS[material] ?? '#56B4E9';
}

/** Shape carries material identity even when colour is unavailable. */
export function MaterialMark({ material, x, y, color, size = 4, filled = false }: {
  material: string; x: number; y: number; color: string; size?: number; filled?: boolean;
}) {
  const shape = MATERIAL_SHAPES[material] ?? 'circle';
  return <g data-material-mark={material} data-filled={filled ? 'true' : 'false'} stroke={color} strokeWidth={1.6} fill={filled ? color : 'none'}>
    {shape === 'square' ? <rect x={x - size} y={y - size} width={size * 2} height={size * 2} />
      : shape === 'triangle' ? <path d={`M ${x} ${y - size * 1.2} L ${x - size} ${y + size} L ${x + size} ${y + size} Z`} />
      : shape === 'diamond' ? <path d={`M ${x} ${y - size * 1.2} L ${x - size * 1.2} ${y} L ${x} ${y + size * 1.2} L ${x + size * 1.2} ${y} Z`} />
      : shape === 'cross' ? <path d={`M ${x - size} ${y - size} L ${x + size} ${y + size} M ${x - size} ${y + size} L ${x + size} ${y - size}`} />
      : shape === 'plus' ? <path d={`M ${x - size} ${y} L ${x + size} ${y} M ${x} ${y - size} L ${x} ${y + size}`} />
      : <circle cx={x} cy={y} r={size} />}
  </g>;
}

export interface MaterialLegendItem<T extends string = string> { id: T; label?: string; count: number }
export interface MaterialLegendProps<T extends string> {
  items: readonly MaterialLegendItem<T>[]; selected: T[] | null; onChange: (next: T[] | null) => void;
  palette: ChartPalette; label?: string; countLabel?: string;
}

/** null is the initial/show-all intent; an array is explicit toggling, including [] and all IDs. */
export default function MaterialLegend<T extends string>({ items, selected, onChange, palette, label = 'Material visibility', countLabel = 'rows' }: MaterialLegendProps<T>) {
  const visible = items.filter((item) => selected === null || selected.includes(item.id));
  const total = visible.reduce((n, item) => n + item.count, 0);
  return <div className="stack" role="group" aria-label={label}>
    <div className="btn-row">{items.map((item) => {
      const active = selected === null || selected.includes(item.id);
      return <button type="button" key={item.id} className="chip" aria-pressed={active} aria-label={`${item.label ?? item.id}, ${item.count} ${countLabel}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: active ? 'var(--accent-soft)' : 'transparent', borderColor: active ? 'var(--accent)' : 'var(--line-2)', color: 'var(--ink)' }}
        onClick={() => onChange(selected === null ? [item.id] : selected.includes(item.id) ? selected.filter((id) => id !== item.id) : [...selected, item.id])}>
        <svg width={18} height={18} viewBox="0 0 18 18" aria-hidden="true" style={{ flexShrink: 0 }}><MaterialMark material={item.id} x={9} y={9} size={4} color={materialColor(item.id, palette)} /></svg>
        <span>{item.label ?? item.id}</span><span className="muted">n={item.count}</span>
      </button>;
    })}</div>
    <div className="btn-row"><button type="button" className="btn ghost small" aria-pressed={selected === null} onClick={() => onChange(null)}>Show all</button>
      <button type="button" className="btn ghost small" aria-pressed={visible.length === 0} onClick={() => onChange([])}>Hide all</button></div>
    <p role="status" aria-live="polite" style={{ margin: 0 }}>{visible.length === 0 ? 'No materials visible' : visible.length === items.length ? `All ${items.length} materials visible` : `${visible.length} of ${items.length} materials visible`} · {total} {countLabel}.</p>
    <p className="muted" style={{ margin: 0 }}>{selected === null ? 'Click a material to isolate it; further clicks add or hide materials.' : 'Click materials to add or hide them. Show all restores the initial view and isolation behaviour.'}</p>
  </div>;
}
