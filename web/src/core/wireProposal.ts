/**
 * Provider wire format for the interpretation proposal (SI selection plan, MODEL_SELECTION.md §4).
 *
 * The provider never sees the full InterpretationProposal: constraint values there carry evidence locators,
 * which a model must not invent. Instead the provider fills a closed "wire" object whose ID fields are
 * enums of the live catalogue (constrained decoding, so an invented ID cannot be emitted). The app then
 * maps wire → proposal deterministically and runs the normal allow-list, handling and envelope checks.
 *
 * The JSON Schema uses only the subset accepted by Claude, OpenAI-style strict mode (OpenRouter, Groq)
 * and Gemini: closed objects, all properties required, enums, and anyOf-with-null. Length limits are
 * enforced locally by Zod because several providers ignore them.
 */
import { z } from 'zod';
import { Id, Intent, InterpretationProposal, RequestedClaim, RequestedFeature, SafetyArea, TemporalScope } from './schemas';
import type { CatalogSnapshot } from './registry';

const MAX = 12;
export const AMBIGUITY_FIELDS = ['intent', 'investigationIds', 'physicalModelId', 'eventIds', 'quantityIds', 'endpointIds', 'requestedFeature', 'temporalScope', 'requestedClaim', 'other'] as const;

export const WireConstraint = z.strictObject({
  fieldId: Id, valueText: z.string().min(1).max(120), unit: z.string().max(40).nullable(), rawSpan: z.string().max(300).nullable(), hypothetical: z.boolean(),
});
export const WireProposal = z.strictObject({
  intent: Intent, safetyAreas: z.array(SafetyArea).max(3),
  investigationIds: z.array(Id).max(MAX), physicalModelId: Id.nullable(), eventIds: z.array(Id).max(MAX),
  quantityIds: z.array(Id).max(MAX), endpointIds: z.array(Id).max(MAX),
  requestedFeature: RequestedFeature, temporalScope: TemporalScope, requestedClaim: RequestedClaim,
  constraints: z.array(WireConstraint).max(MAX), explicitExclusions: z.array(z.string().min(1).max(300)).max(MAX),
  ambiguities: z.array(z.strictObject({ field: z.enum(AMBIGUITY_FIELDS), question: z.string().min(1).max(300), alternativeIds: z.array(Id).max(MAX) })).max(MAX),
  unknownTerms: z.array(z.string().min(1).max(120)).max(MAX), proposedModelNote: z.string().min(1).max(600).nullable(),
  requestedExecutionText: z.string().min(1).max(600).nullable(), supportingContextIds: z.array(Id).max(MAX),
});
export type WireProposal = z.infer<typeof WireProposal>;

export type WireParse = { ok: true; proposal: InterpretationProposal } | { ok: false; problems: string[] };

/** Closed parse of the provider's object, then a deterministic, lossless mapping into the proposal shape. */
export function wireToProposal(raw: unknown): WireParse {
  const w = WireProposal.safeParse(raw);
  if (!w.success) return { ok: false, problems: w.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`) };
  const d = w.data;
  const p = InterpretationProposal.safeParse({
    ...d,
    constraints: d.constraints.map((c) => ({
      fieldId: c.fieldId, provenance: 'proposed_interpretation', rawSpan: c.rawSpan, hypothetical: c.hypothetical,
      value: { state: 'known', value: c.valueText, unit: c.unit, basis: null, originalText: c.rawSpan, originalUnit: c.unit, uncertaintyText: null, reason: null, evidence: [] },
    })),
  });
  if (!p.success) return { ok: false, problems: p.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`) };
  return { ok: true, proposal: p.data };
}

type Json = Record<string, unknown>;
const str = (): Json => ({ type: 'string' });
const nullable = (s: Json): Json => ({ anyOf: [s, { type: 'null' }] });
const arr = (items: Json): Json => ({ type: 'array', items });
const enumOf = (values: readonly string[]): Json => ({ type: 'string', enum: values.length ? [...values] : ['NONE_AVAILABLE'] });
const obj = (properties: Record<string, Json>): Json => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });

/** Catalogue ID sets offered to the provider, by kind. */
export function catalogIdSets(s: CatalogSnapshot) {
  const sorted = (xs: { id: string }[]) => xs.map((x) => x.id).sort();
  const investigations = sorted(s.investigations);
  const models = sorted(s.models);
  const events = sorted(s.events);
  const quantities = sorted(s.entities.filter((e) => e.kind === 'quantity'));
  const endpoints = sorted(s.entities.filter((e) => e.kind === 'endpoint'));
  const context = [...sorted(s.findings), ...sorted(s.sources)];
  const entities = sorted(s.entities);
  const alternatives = [...new Set([...investigations, ...models, ...events, ...quantities, ...endpoints])].sort();
  return { investigations, models, events, quantities, endpoints, entities, context, alternatives };
}

/** JSON Schema sent to providers. Generated per catalogue revision; its SHA-256 is recorded with each call. */
export function wireJsonSchema(s: CatalogSnapshot): Json {
  const ids = catalogIdSets(s);
  return obj({
    intent: enumOf(Intent.options),
    safetyAreas: arr(enumOf(SafetyArea.options)),
    investigationIds: arr(enumOf(ids.investigations)),
    physicalModelId: nullable(enumOf(ids.models)),
    eventIds: arr(enumOf(ids.events)),
    quantityIds: arr(enumOf(ids.quantities)),
    endpointIds: arr(enumOf(ids.endpoints)),
    requestedFeature: enumOf(RequestedFeature.options),
    temporalScope: enumOf(TemporalScope.options),
    requestedClaim: enumOf(RequestedClaim.options),
    constraints: arr(obj({ fieldId: enumOf(ids.entities), valueText: str(), unit: nullable(str()), rawSpan: nullable(str()), hypothetical: { type: 'boolean' } })),
    explicitExclusions: arr(str()),
    ambiguities: arr(obj({ field: enumOf(AMBIGUITY_FIELDS), question: str(), alternativeIds: arr(enumOf(ids.alternatives)) })),
    unknownTerms: arr(str()),
    proposedModelNote: nullable(str()),
    requestedExecutionText: nullable(str()),
    supportingContextIds: arr(enumOf(ids.context)),
  });
}
