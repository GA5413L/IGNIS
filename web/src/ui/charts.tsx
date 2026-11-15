import { MOON_RANGE } from './lib';

/**
 * Interactive SVG charts. Colours come from CSS custom properties (--d-*) so the same chart renders on the
 * light console and the dark landing page. Conventions follow the paperplot figures: Okabe-Ito data colours,
 * open left/bottom axes, direct labels, shape as well as colour for every category.
 */
export interface AtmospherePoint { id: string; label: string; oxygen: number; pressure: number; material: string }

const W = 560, H = 344, L = 54, R = 18, T = 32, B = 44;
const OX = [20, 36] as const, PR = [45, 105] as const;
const x = (oxygen: number) => L + ((oxygen - OX[0]) / (OX[1] - OX[0])) * (W - L - R);
const y = (pressure: number) => T + (1 - (pressure - PR[0]) / (PR[1] - PR[0])) * (H - T - B);
const clamp = (value: number, [lo, hi]: readonly [number, number]) => Math.min(hi, Math.max(lo, value));

/** Oxygen and pressure coordinates only. Position says nothing about flammability or transfer. */
export function AtmosphereChart({ points, active, frontier = [], target, onPick, picked, title }: {
  points: AtmospherePoint[]; active?: string[]; frontier?: string[]; target?: { oxygen: number; pressure: number };
  onPick?: (id: string) => void; picked?: string | null; title: string;
}) {
  const sorted = [...points].sort((a, b) => a.oxygen - b.oxygen || a.pressure - b.pressure);
  const targetOff = target ? target.oxygen < OX[0] || target.oxygen > OX[1] || target.pressure < PR[0] || target.pressure > PR[1] : false;
  return (
    <div className="chart-box"><svg className="chart fit" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={title}>
      <rect className="moon" x={x(MOON_RANGE.minOxygenPercent)} y={y(MOON_RANGE.maxPressureKPa)} width={x(OX[1]) - x(MOON_RANGE.minOxygenPercent)}
        height={y(PR[0]) - y(MOON_RANGE.maxPressureKPa)} />
      <line className="moon-edge" x1={x(MOON_RANGE.minOxygenPercent)} x2={x(OX[1])} y1={y(MOON_RANGE.maxPressureKPa)} y2={y(MOON_RANGE.maxPressureKPa)} />
      <line className="moon-edge" x1={x(MOON_RANGE.minOxygenPercent)} x2={x(MOON_RANGE.minOxygenPercent)} y1={y(MOON_RANGE.maxPressureKPa)} y2={y(PR[0])} />
      <text className="t-a" x={x(OX[1]) - 6} y={y(PR[0]) - 8} textAnchor="end">Moon Base range</text>
      {[50, 60, 70, 80, 90, 100].map((value) => (
        <g key={value}><line className="grid" x1={L} x2={W - R} y1={y(value)} y2={y(value)} /><line className="axis" x1={L} x2={L + 5} y1={y(value)} y2={y(value)} /><text x={L - 8} y={y(value) + 4} textAnchor="end">{value}</text></g>
      ))}
      {[20, 24, 28, 32, 36].map((value) => (
        <g key={value}><line className="axis" x1={x(value)} x2={x(value)} y1={H - B - 5} y2={H - B} /><text x={x(value)} y={H - B + 16} textAnchor="middle">{value}%</text></g>
      ))}
      <line className="axis" x1={L} x2={W - R} y1={H - B} y2={H - B} />
      <line className="axis" x1={L} x2={L} y1={T} y2={H - B} />
      <text x={W - R} y={H - 6} textAnchor="end">Oxygen, mole %</text>
      <text x={L - 40} y={12}>Pressure, kPa</text>
      {target && (
        <g className="target" style={{ transform: `translate(${x(clamp(target.oxygen, OX))}px, ${y(clamp(target.pressure, PR))}px)` }}>
          <line className="s-a" x1={-11} x2={11} y1={0} y2={0} strokeWidth="2" />
          <line className="s-a" x1={0} x2={0} y1={-11} y2={11} strokeWidth="2" />
          <circle className="s-a" r="5" fill="none" strokeWidth="2" />
          <text className="t-a" x={10} y={-10}>{targetOff ? 'target (off chart)' : 'target'}</text>
        </g>
      )}
      {sorted.map((point, index) => {
        const on = !active || active.includes(point.id);
        const best = frontier.includes(point.id);
        const below = index % 2 === 1;
        return (
          <g key={point.id} opacity={on ? 1 : 0.32} onClick={onPick ? () => onPick(point.id) : undefined} style={onPick ? { cursor: 'pointer' } : undefined}>
            <title>{`${point.label}: ${point.material}, ${point.oxygen} mole % oxygen, ${point.pressure} kPa`}</title>
            {onPick && <circle cx={x(point.oxygen)} cy={y(point.pressure)} r={16} fill="transparent" />}
            {best && <circle className="pt s-ink" cx={x(point.oxygen)} cy={y(point.pressure)} r={10} fill="none" strokeWidth="1.5" />}
            {picked === point.id && <circle className="s-a" cx={x(point.oxygen)} cy={y(point.pressure)} r={13} fill="none" strokeWidth="2" />}
            <circle className={`pt ${on ? 'f-ink' : 'f-muted'}`} cx={x(point.oxygen)} cy={y(point.pressure)} r={5.5} />
            <text className="lbl" x={x(point.oxygen)} y={y(point.pressure) + (below ? 24 : -14)} textAnchor="middle">{point.label}</text>
          </g>
        );
      })}
    </svg></div>
  );
}

export interface IntervalRow { label: string; note: string; lower: number | null; upper: number | null; outerLower?: number | null; outerUpper?: number | null }

/** Fraction difference on a fixed -1..+1 axis. A dot is one cutoff pair; a bar is an exact range. Never a confidence interval. */
export function IntervalChart({ rows, title }: { rows: IntervalRow[]; title: string }) {
  const w = 560, l = 96, r = 108, rowH = 46, top = 10;
  const h = top + rows.length * rowH + 30;
  const px = (value: number) => l + ((value + 1) / 2) * (w - l - r);
  return (
    <div className="chart-box"><svg className="chart" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={title}>
      {[-1, -0.5, 0, 0.5, 1].map((tick) => (
        <g key={tick}>
          <line className={tick === 0 ? 'zero' : 'grid'} x1={px(tick)} x2={px(tick)} y1={top} y2={h - 26} />
          <text x={px(tick)} y={h - 10} textAnchor="middle">{tick > 0 ? `+${tick}` : tick === 0 ? '0' : `−${Math.abs(tick)}`}</text>
        </g>
      ))}
      {rows.map((row, index) => {
        const cy = top + index * rowH + rowH / 2;
        const has = row.lower !== null && row.upper !== null;
        const hasOuter = row.outerLower !== null && row.outerLower !== undefined && row.outerUpper !== null && row.outerUpper !== undefined;
        const tone = !has ? 'f-muted' : row.lower! > 0 ? 'f-a' : row.upper! < 0 ? 'f-b' : 'f-ink';
        return (
          <g key={row.label}>
            <text className="lbl" x={0} y={cy + 4}>{row.label}</text>
            {hasOuter && <rect className="bar f-line" x={px(row.outerLower!)} y={cy + 7} width={Math.max(2, px(row.outerUpper!) - px(row.outerLower!))} height={4} />}
            {has && (px(row.upper!) - px(row.lower!) < 3
              ? <circle className={`pt ${tone}`} cx={px(row.lower!)} cy={cy} r={6} />
              : <rect className={`bar ${tone}`} x={px(row.lower!)} y={cy - 5} width={px(row.upper!) - px(row.lower!)} height={10} rx={2} />)}
            <text x={w} y={cy + 4} textAnchor="end">{row.note}</text>
          </g>
        );
      })}
    </svg></div>
  );
}

export interface StripPoint { id: string; group: string; series: 'SAME' | 'SAME-R'; value: number; cell: string }

/**
 * Every finite reading as one mark. Circles are SAME (flight 1), diamonds are SAME-R (flight 2). Horizontal
 * spread inside a column is a fixed layout offset for legibility and carries no data.
 */
export function StripChart({ points, groups, cutoff, unit, title, unavailable }: {
  points: StripPoint[]; groups: string[]; cutoff: number; unit: string; title: string; unavailable: Record<string, number>;
}) {
  const w = 640, h = 320, l = 48, r = 12, t = 16, b = 52;
  const values = points.map((point) => point.value);
  const lo = Math.min(0, ...values), hi = Math.max(cutoff * 1.15, ...values, 1);
  const span = hi - lo || 1;
  const py = (value: number) => t + (1 - (value - lo) / span) * (h - t - b);
  const band = (w - l - r) / Math.max(1, groups.length);
  const step = span <= 2 ? 0.5 : span <= 5 ? 1 : 2;
  const ticks: number[] = [];
  for (let tick = Math.ceil(lo / step) * step; tick <= hi + 1e-9; tick += step) ticks.push(Number(tick.toFixed(6)));
  const counters = new Map<string, number>();
  return (
    <div className="chart-box"><svg className="chart" viewBox={`0 0 ${w} ${h}`} role="img" aria-label={title}>
      {ticks.map((tick) => (
        <g key={tick}><line className="grid" x1={l} x2={w - r} y1={py(tick)} y2={py(tick)} /><text x={l - 8} y={py(tick) + 4} textAnchor="end">{tick}</text></g>
      ))}
      <line className="axis" x1={l} x2={l} y1={t} y2={h - b} />
      <line className="axis" x1={l} x2={w - r} y1={h - b} y2={h - b} />
      <text x={l - 40} y={10}>{unit}</text>
      {cutoff >= lo && cutoff <= hi && <>
        <line className="cut" x1={l} x2={w - r} y1={py(cutoff)} y2={py(cutoff)} />
        <text className="t-ink" x={w - r} y={py(cutoff) - 5} textAnchor="end">cutoff {cutoff} V</text>
      </>}
      {groups.map((group, index) => {
        const cx = l + band * (index + 0.5);
        return (
          <g key={group}>
            <text className="lbl" x={cx} y={h - b + 18} textAnchor="middle">{group}</text>
            <text x={cx} y={h - b + 34} textAnchor="middle">{unavailable[group] ? `${unavailable[group]} n/a` : ''}</text>
          </g>
        );
      })}
      {points.map((point) => {
        const index = groups.indexOf(point.group);
        if (index < 0) return null;
        const key = `${point.group}|${point.series}`;
        const n = counters.get(key) ?? 0;
        counters.set(key, n + 1);
        const side = point.series === 'SAME' ? -1 : 1;
        const cx = l + band * (index + 0.5) + side * band * 0.2 + (((n * 7) % 11) - 5) * (band * 0.028);
        const cy = py(point.value);
        const label = `${point.cell}: ${point.value.toFixed(3)} V, ${point.group}, ${point.series}`;
        return point.series === 'SAME'
          ? <circle key={point.id} className="mark s-b" cx={cx} cy={cy} r={3.6}><title>{label}</title></circle>
          : <rect key={point.id} className="mark s-a" x={cx - 3.2} y={cy - 3.2} width={6.4} height={6.4} transform={`rotate(45 ${cx} ${cy})`}><title>{label}</title></rect>;
      })}
    </svg></div>
  );
}
