import { createHash } from 'node:crypto';
import conditionCases from '../../data/condition-cases.json';

export interface CitationTarget { id: string; provider: 'ntrs' | 'crossref' | 'datacite'; identifier: string; title: string }
export type CitationStatus = 'metadata_match' | 'title_differs' | 'identifier_mismatch' | 'unavailable' | 'not_found' | 'invalid_response';
export interface CitationCheck {
  id: string; provider: CitationTarget['provider']; identifier: string; expectedTitle: string; endpoint: string;
  checkedAt: string; status: CitationStatus; httpStatus: number | null; returnedIdentifier: string | null;
  returnedTitle: string | null; metadataSha256: string | null; method: 'identifier-and-normalized-title-v1';
}
// Only existing, publicly cited records. There is no endpoint that accepts an arbitrary URL or model citation.
export const CITATION_TARGETS: readonly CitationTarget[] = [
  { id: 'SRC-S-V', provider: 'ntrs', identifier: '20240008602', title: 'Vehicle Modeling During the Burning of Thermally Thick Samples in the Saffire V Experiments' },
  { id: 'SRC-S-VI', provider: 'ntrs', identifier: '20250002675', title: 'Vehicle Modeling During the Burn Events in the Saffire VI Experiments' },
  { id: 'SRC-S-CAL', provider: 'ntrs', identifier: '20240002981', title: 'Preliminary Results from the Saffire VI Experiment' },
  { id: 'SRC-R14', provider: 'ntrs', identifier: '20210022617', title: 'Isolated Single Droplet Combustion: FLEX Experiments onboard the International Space Station' },
  { id: 'SRC-R09', provider: 'crossref', identifier: '10.1016/j.firesaf.2018.04.004', title: 'Evaluation of spacecraft smoke detector performance in the low-gravity environment' },
  { id: 'DATA-CONDITIONS', provider: 'ntrs', identifier: '20260001992', title: conditionCases.source.title },
  { id: 'DATA-SAME-R', provider: 'datacite', identifier: '10.60555/2np7-jv14', title: 'Smoke Aerosol Measurement Experiment-Reflight' },
];

export function citationEndpoint(target: CitationTarget): string {
  if (target.provider === 'ntrs') {
    if (!/^\d{11}$/.test(target.identifier)) throw new Error('invalid NTRS identifier');
    return `https://ntrs.nasa.gov/api/citations/${target.identifier}`;
  }
  if (!/^10\.\d{4,9}\/[A-Za-z0-9._;()/:+-]+$/.test(target.identifier)) throw new Error('invalid DOI');
  if (target.provider === 'crossref') return `https://api.crossref.org/works/${encodeURIComponent(target.identifier)}`;
  if (target.provider === 'datacite') return `https://api.datacite.org/dois/${encodeURIComponent(target.identifier)}`;
  throw new Error('unsupported citation provider');
}
export function normalizeCitationTitle(title: string) {
  return title.normalize('NFKC').toLocaleLowerCase('en-US').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}
type ObjectValue = Record<string, unknown>;
function obj(value: unknown): ObjectValue { return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as ObjectValue : {}; }
function metadata(target: CitationTarget, value: unknown): { id: string | null; title: string | null } {
  const root = obj(value), row = target.provider === 'ntrs' ? root : target.provider === 'crossref' ? obj(root.message) : obj(obj(root.data).attributes);
  const id = target.provider === 'ntrs' ? row.id : target.provider === 'crossref' ? row.DOI : row.doi;
  const title = target.provider === 'ntrs' ? row.title : target.provider === 'crossref' ? (Array.isArray(row.title) ? row.title[0] : null)
    : Array.isArray(row.titles) ? obj(row.titles[0]).title : null;
  return { id: typeof id === 'string' || typeof id === 'number' ? String(id) : null, title: typeof title === 'string' && title.length <= 2000 ? title : null };
}
export async function checkCitation(target: CitationTarget, transport: typeof fetch = fetch, now = new Date().toISOString()): Promise<CitationCheck> {
  const endpoint = citationEndpoint(target);
  const result: CitationCheck = { id: target.id, provider: target.provider, identifier: target.identifier, expectedTitle: target.title, endpoint, checkedAt: now,
    status: 'unavailable', httpStatus: null, returnedIdentifier: null, returnedTitle: null, metadataSha256: null, method: 'identifier-and-normalized-title-v1' };
  try {
    const response = await transport(endpoint, { method: 'GET', redirect: 'error', signal: AbortSignal.timeout(10_000),
      headers: { Accept: 'application/json', 'User-Agent': 'IGNIS-citation-metadata-check/1.0 (+https://github.com/GA5413L/IGNIS)' }, cache: 'no-store' });
    result.httpStatus = response.status;
    if (!response.ok) { result.status = response.status === 404 ? 'not_found' : 'unavailable'; await response.body?.cancel(); return result; }
    if (!response.body) { result.status = 'invalid_response'; return result; }
    const reader = response.body.getReader(), parts: Uint8Array[] = []; let size = 0;
    try {
      while (true) { const next = await reader.read(); if (next.done) break; size += next.value.length;
        if (size > 1024 * 1024) { await reader.cancel(); result.status = 'invalid_response'; return result; } parts.push(next.value); }
    } finally { reader.releaseLock(); }
    const raw = Buffer.concat(parts); result.metadataSha256 = createHash('sha256').update(raw).digest('hex');
    let value: unknown; try { value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(raw)); } catch { result.status = 'invalid_response'; return result; }
    const record = metadata(target, value); result.returnedIdentifier = record.id; result.returnedTitle = record.title;
    if (!record.id || !record.title) result.status = 'invalid_response';
    else if (record.id.toLowerCase() !== target.identifier.toLowerCase()) result.status = 'identifier_mismatch';
    else result.status = normalizeCitationTitle(record.title) === normalizeCitationTitle(target.title) ? 'metadata_match' : 'title_differs';
    return result;
  } catch { return result; }
}
