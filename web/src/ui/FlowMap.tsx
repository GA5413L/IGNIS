'use client';

import { useMemo, useState } from 'react';

/**
 * The evidence flow: every path a question can take through the data, drawn left to right.
 * Question → Investigations → Evidence → Analysis → Result. Ribbon width follows how much evidence a link
 * carries. A lit path ends early where an investigation holds no data of the kind the question needs.
 */
export interface FlowNode { id: string; col: number; label: string; value?: string; sub?: string; quiet?: boolean; hint: string; onSelect: () => void; pressed?: boolean }
export interface FlowEdge { from: string; to: string; weight: number }

export const STAGES = ['Question', 'Investigations', 'Evidence', 'Analysis', 'Result'] as const;
export const VW = 1000, VH = 470, TOP = 44, BOTTOM = 466;
export const COLS = [{ x: 0, w: 178 }, { x: 222, w: 150 }, { x: 420, w: 150 }, { x: 618, w: 160 }, { x: 826, w: 174 }];

interface Box { x: number; y: number; w: number; h: number }

export default function FlowMap({ nodes, edges, lit, stage, onStage, children }: {
  nodes: FlowNode[]; edges: FlowEdge[]; lit: Set<string>; stage: number; onStage: (stage: number) => void; children?: React.ReactNode;
}) {
  const [hover, setHover] = useState<string | null>(null);

  const boxes = useMemo(() => {
    const map = new Map<string, Box>();
    COLS.forEach((col, index) => {
      const column = nodes.filter((node) => node.col === index);
      const gap = column.length > 8 ? 4 : 10;
      const height = (BOTTOM - TOP - gap * (column.length - 1)) / Math.max(1, column.length);
      column.forEach((node, row) => map.set(node.id, { x: col.x, y: TOP + row * (height + gap), w: col.w, h: height }));
    });
    return map;
  }, [nodes]);

  const paths = useMemo(() => {
    const outCount = new Map<string, number>(), inCount = new Map<string, number>();
    edges.forEach((edge) => { outCount.set(edge.from, (outCount.get(edge.from) ?? 0) + 1); inCount.set(edge.to, (inCount.get(edge.to) ?? 0) + 1); });
    const outSeen = new Map<string, number>(), inSeen = new Map<string, number>();
    const order = [...edges].sort((a, b) => (boxes.get(a.from)!.y - boxes.get(b.from)!.y) || (boxes.get(a.to)!.y - boxes.get(b.to)!.y));
    return order.map((edge) => {
      const a = boxes.get(edge.from)!, b = boxes.get(edge.to)!;
      const oi = outSeen.get(edge.from) ?? 0, ii = inSeen.get(edge.to) ?? 0;
      outSeen.set(edge.from, oi + 1); inSeen.set(edge.to, ii + 1);
      const spread = (index: number, total: number, height: number) => (total <= 1 ? 0 : ((index + 0.5) / total - 0.5) * Math.min(height * 0.62, 46));
      const y1 = a.y + a.h / 2 + spread(oi, outCount.get(edge.from)!, a.h), y2 = b.y + b.h / 2 + spread(ii, inCount.get(edge.to)!, b.h);
      const x1 = a.x + a.w, x2 = b.x, mid = (x1 + x2) / 2;
      return { ...edge, d: `M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}`, width: Math.min(6, 1 + Math.log2(edge.weight + 1) * 0.75), col: nodes.find((node) => node.id === edge.from)!.col };
    });
  }, [edges, boxes, nodes]);

  const colOf = (id: string) => nodes.find((node) => node.id === id)!.col;
  const nodeOn = (node: FlowNode) => lit.has(node.id) && node.col <= stage;
  const edgeOn = (edge: FlowEdge) => lit.has(edge.from) && lit.has(edge.to) && colOf(edge.to) <= stage;
  const touches = (edge: FlowEdge) => hover !== null && (edge.from === hover || edge.to === hover);
  const dead = (node: FlowNode) => node.col > 0 && node.col < 4 && lit.has(node.id) && !edges.some((edge) => edge.from === node.id && lit.has(edge.to));

  return (
    <div className="fm" role="group" aria-label="Evidence flow from question to result">
      {children}
      <svg className="fm-edges" viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none" aria-hidden="true">
        {paths.map((edge) => {
          const on = edgeOn(edge) || touches(edge);
          return (
            <g key={`${edge.from}>${edge.to}`} style={{ '--c': edge.col } as React.CSSProperties}>
              <path className={`fm-edge${on ? ' on' : ''}`} d={edge.d} pathLength={100} strokeWidth={edge.width} />
              {on && <path className="fm-pulse" d={edge.d} pathLength={100} strokeWidth={Math.max(1.6, edge.width)} />}
            </g>
          );
        })}
      </svg>
      {STAGES.map((label, index) => (
        <button key={label} type="button" className={`fm-stage${index <= stage ? ' on' : ''}`} aria-pressed={index === stage}
          style={{ left: `${(COLS[index].x / VW) * 100}%`, width: `${(COLS[index].w / VW) * 100}%` }} onClick={() => onStage(index)}>
          <span>{String(index + 1).padStart(2, '0')}</span>{label}
        </button>
      ))}
      {nodes.map((node) => {
        const box = boxes.get(node.id)!;
        const on = nodeOn(node);
        return (
          <button key={node.id} type="button" title={node.hint} aria-pressed={node.pressed}
            className={`fm-node c${node.col}${on ? ' on' : ''}${on && dead(node) ? ' dead' : ''}${node.quiet ? ' quiet' : ''}${hover === node.id ? ' hover' : ''}`}
            style={{ left: `${(box.x / VW) * 100}%`, top: `${(box.y / VH) * 100}%`, width: `${(box.w / VW) * 100}%`, height: `${(box.h / VH) * 100}%`, '--c': node.col } as React.CSSProperties}
            onClick={node.onSelect} onMouseEnter={() => setHover(node.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(node.id)} onBlur={() => setHover(null)}>
            <span className="fm-label">{node.label}{node.sub && <small>{node.sub}</small>}</span>
            {node.value && <b>{node.value}</b>}
          </button>
        );
      })}
    </div>
  );
}
