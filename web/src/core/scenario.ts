/** A bounded analysis recipe in the URL fragment. No question, notebook or assessment history. */
import { z } from 'zod';
import { canonicalJson, digestOf } from './canonicalize';
import { buildResearchAnalysis, ResearchSelectionSchema, type ResearchSelection } from './researchSelections';

export const SCENARIO_PREFIX = '#ignis-scenario=';
export const MAX_SCENARIO_FRAGMENT_LENGTH = 12000;
const Hash = z.string().regex(/^[a-f0-9]{64}$/);
const ScenarioSchema = z.strictObject({
  schema: z.literal('ignis-scenario-1'), selection: ResearchSelectionSchema,
  sourceDigest: Hash, methodRevision: z.string().min(1).max(100), resultDigest: Hash, checksum: Hash,
});
export type Scenario = z.infer<typeof ScenarioSchema>;

function unsigned(packet: Scenario) {
  return { schema: packet.schema, selection: packet.selection, sourceDigest: packet.sourceDigest,
    methodRevision: packet.methodRevision, resultDigest: packet.resultDigest };
}

export function makeScenario(selection: ResearchSelection): Scenario {
  const analysis = buildResearchAnalysis(selection);
  const payload = { schema: 'ignis-scenario-1' as const, selection: analysis.selection,
    sourceDigest: analysis.sourceDigest, methodRevision: analysis.methodRevision, resultDigest: analysis.resultDigest };
  return { ...payload, checksum: digestOf(payload) };
}

export function encodeScenario(packet: Scenario): string {
  const checked = ScenarioSchema.parse(packet);
  if (digestOf(unsigned(checked)) !== checked.checksum) throw new Error('Scenario checksum mismatch.');
  const bytes = new TextEncoder().encode(canonicalJson(checked));
  const encoded = btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
  const fragment = SCENARIO_PREFIX + encoded;
  if (fragment.length > MAX_SCENARIO_FRAGMENT_LENGTH) throw new Error('This selection is too long for a scenario link. Use the research notebook file instead.');
  return fragment;
}

export function decodeScenario(fragment: string): Scenario | null {
  if (!fragment.startsWith(SCENARIO_PREFIX)) return null;
  if (fragment.length > MAX_SCENARIO_FRAGMENT_LENGTH) throw new Error('Scenario link exceeds the supported size.');
  const encoded = fragment.slice(SCENARIO_PREFIX.length);
  if (!/^[A-Za-z0-9_-]+$/.test(encoded)) throw new Error('Scenario link encoding is invalid.');
  let value: unknown;
  try {
    const bytes = Uint8Array.from(atob(encoded.replaceAll('-', '+').replaceAll('_', '/')), (char) => char.charCodeAt(0));
    value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch { throw new Error('Scenario link could not be decoded.'); }
  const parsed = ScenarioSchema.safeParse(value);
  if (!parsed.success) throw new Error('Scenario link has an unsupported version or invalid settings.');
  if (digestOf(unsigned(parsed.data)) !== parsed.data.checksum) throw new Error('Scenario checksum mismatch.');
  return parsed.data;
}

export function reviewScenario(fragment: string) {
  const packet = decodeScenario(fragment);
  if (!packet) return null;
  const current = buildResearchAnalysis(packet.selection); // Revalidate source IDs and recompute before any UI mutation.
  return { packet, current, checks: {
    source: packet.sourceDigest === current.sourceDigest ? 'same' : 'changed',
    method: packet.methodRevision === current.methodRevision ? 'same' : 'changed',
    result: packet.resultDigest === current.resultDigest ? 'same' : 'changed',
  } as const };
}
