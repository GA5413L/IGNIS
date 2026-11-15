/** Shared helpers for the dashboard views. Scientific results always come from src/core or the API. */
import type { Assessment } from '../core/assess';
import type { ConfirmedRequest, SafetyArea } from '../core/schemas';
import { proposalFromForm, type FormChoices } from '../core/interpretation';
import { deriveHandling } from '../core/handling';
import type { ResearchSelection } from '../core/researchSelections';

export type ViewId = 'overview' | 'investigations' | 'atmospheres' | 'smoke' | 'findings' | 'figures' | 'sources' | 'local-data' | 'si';
export const VIEWS: { id: ViewId; label: string; title: string }[] = [
  { id: 'overview', label: 'Overview', title: 'Overview' },
  { id: 'investigations', label: 'Investigations', title: 'Investigations' },
  { id: 'atmospheres', label: 'Atmospheres', title: 'Atmosphere cases' },
  { id: 'smoke', label: 'Smoke detection', title: 'Smoke detection lab' },
  { id: 'findings', label: 'Findings', title: 'Findings and model claims' },
  { id: 'figures', label: 'Figures', title: 'Publication figures' },
  { id: 'sources', label: 'Sources', title: 'Sources and methods' },
  { id: 'local-data', label: 'Your data', title: 'Local data workbench' },
  { id: 'si', label: 'SI', title: 'SI · Scientific Intelligence' },
];

export const AREAS: SafetyArea[] = ['prevention', 'detection', 'suppression'];
export const AREA_LABEL: Record<SafetyArea, string> = { prevention: 'Prevention', detection: 'Detection', suppression: 'Suppression' };
export const AREA_QUESTION: Record<SafetyArea, string> = {
  prevention: 'Which materials burn, and in which atmospheres?',
  detection: 'How soon does smoke reach a detector?',
  suppression: 'What puts a flame out, and is it really out?',
};

export interface CatalogInvestigation {
  id: string; displayName: string; familyId: string; safetyAreas: SafetyArea[]; coverage: string; summary: string; depthNote: string;
  findingIds: string[]; objectives: ({ id: string; statement?: string; text?: string } & Record<string, unknown> | undefined)[];
}
export interface CatalogBody {
  revision: string; digest: string;
  counts: { investigations: number; findingsByKind: Record<string, number>; objectives: number; reviewLevels: Record<string, number>; sources: number; models: number; contracts: number };
  families: { id: string; displayName: string }[];
  investigations: CatalogInvestigation[];
  findings: { id: string; title: string; safetyAreas: SafetyArea[]; briefRole: string; investigationIds: string[] }[];
  models: { id: string; displayName: string; investigationId: string | null; predictedQuantityIds: string[] }[];
  events: { id: string; label: string; investigationId: string }[];
  quantities: { id: string; displayName: string; definition?: string }[];
  endpoints: { id: string; displayName: string; definition?: string }[];
  sources: { id: string; title: string; canonicalUri: string | null; access: string; publicationDate: string | null; observedSha256: string | null }[];
}
export interface Health { status: string; catalogRevision: string | null; buildRevision: string; aiAvailable: boolean; aiReason: string }

export const pct = (v: number | null, digits = 0) => (v === null ? 'n/a' : `${v.toFixed(digits)}%`);
export const signed = (v: number, digits = 1) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v).toFixed(digits)}`;
export const signedInt = (v: number) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${Math.abs(v)}`;
export const short = (hash: string, n = 10) => `${hash.slice(0, n)}…`;
export const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export function download(name: string, text: string, mime = 'application/json') {
  const url = URL.createObjectURL(new Blob([text], { type: `${mime};charset=utf-8` }));
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

let seq = 0;
export function buildRequest(form: FormChoices, text: string, parent: Assessment | null = null): ConfirmedRequest {
  const proposal = proposalFromForm(form);
  seq += 1;
  return {
    id: `REQ-${Date.now().toString(36)}-${seq}`, revision: 'r1', originalText: text, confirmedAt: new Date().toISOString(), proposal,
    handling: deriveHandling(proposal).handling, inputMode: 'form',
    parentRequestRef: parent ? { id: parent.request.id, revision: parent.request.revision } : null,
    runtimeProvenanceRef: null, remainingScientificGaps: [],
  };
}

export class ApiError extends Error {}
export async function postAssess(form: FormChoices, text: string, catalogRevision: string, opts: { parent?: Assessment | null; selections?: ResearchSelection[] } = {}): Promise<Assessment> {
  const body: Record<string, unknown> = { request: buildRequest(form, text, opts.parent ?? null), catalogRevision, parent: opts.parent ?? null };
  if (opts.selections?.length) body.researchSelections = opts.selections;
  const res = await fetch('/api/assess', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const json = await res.json();
  if (!res.ok) throw new ApiError(typeof json?.message === 'string' ? json.message : `Assessment failed (${res.status}).`);
  return json as Assessment;
}
export async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new ApiError(`Request failed (${res.status}).`);
  return res.json() as Promise<T>;
}

/** Challenge statement: Moon Base oxygen "30% or greater" at "10.2 psi or less". Unit conversion only: 1 psi = 6.894757 kPa. */
export const MOON_RANGE = { minOxygenPercent: 30, maxPressurePsi: 10.2, maxPressureKPa: 10.2 * 6.894757 };
export const inMoonRange = (oxygenPercent: number, pressureKPa: number) => oxygenPercent >= MOON_RANGE.minOxygenPercent && pressureKPa <= MOON_RANGE.maxPressureKPa;

export const PSI_PER_KPA = 1 / 6.894757;
export const psi = (kPa: number) => (kPa * PSI_PER_KPA).toFixed(2);
