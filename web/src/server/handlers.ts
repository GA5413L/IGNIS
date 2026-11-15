/**
 * HTTP handler logic (master §13), written as plain functions over parsed bodies so integration tests can call
 * them without a server. Scientific incompatibility is a 200 result, not an HTTP error.
 */
import { z } from 'zod';
import { ConfirmedRequest } from '../core/schemas';
import { getCatalog, requireCatalog, type CatalogSnapshot } from '../core/registry';
import { assess, AssessError, type Assessment } from '../core/assess';
import { verifyAssessment, ExportIntegrityError } from '../core/export';
import { InterpretRequest, MAX_INTERPRET_BODY_BYTES } from '../core/interpretation';
import { runtimeStatus } from './runtime';
import { gatewayConfig, gatewayReadiness } from './gateway/policy';
import { ResearchSelectionsSchema, type ResearchSelection } from '../core/researchSelections';
import { RevisionParentSchema } from '../core/revisionParent';

export const BUILD_REVISION = 'web-2026-11-15.13';
// A revision carries one immutable parent with up to four source-bound analyses.
// The all-analysis source snapshot can exceed 1 MiB; retain a finite 2 MiB local-only cap.
// This does not change interpreter/provider input, output, probe or spend limits.
export const MAX_ASSESS_BODY_BYTES = 2 * 1024 * 1024;

export interface Reply { status: number; body: unknown }
const err = (status: number, code: string, message: string, fieldErrors: string[] = [], draftBinding: unknown = null): Reply => ({
  status, body: { code, message, fieldErrors, retryAfterSeconds: null, draftBinding, requestId: `req-${Date.now().toString(36)}` },
});

export function handleHealth(): Reply {
  const { snapshot, errors } = getCatalog();
  const rt = runtimeStatus();
  const gateway = gatewayReadiness(gatewayConfig());
  return { status: snapshot ? 200 : 503, body: {
    status: snapshot ? 'ok' : 'registry_invalid', catalogRevision: snapshot?.revision ?? null, catalogDigest: snapshot?.digest ?? null,
    buildRevision: BUILD_REVISION, siAvailable: rt.aiAvailable || gateway.ready, siReason: gateway.ready ? 'Accepted gateway interpretation available' : rt.reason,
    aiAvailable: rt.aiAvailable || gateway.ready, acceptedConfiguration: gateway.ready ? gateway.routes.map((r) => r.model).join(', ') : rt.label, aiReason: gateway.ready ? 'Accepted gateway interpretation available' : rt.reason,
    featureFlags: { liveInterpretation: gateway.ready, synthesisCall: false, nistModule: false, rodControl: false, transferMethods: false },
    registryErrors: snapshot ? 0 : errors.length,
  } };
}

export function handleCatalog(): Reply {
  const { snapshot: s, errors } = getCatalog();
  if (!s) return err(503, 'registry_invalid', 'The reviewed registry failed validation; no sample data is substituted.', errors.slice(0, 10));
  const counts = {
    investigations: s.investigations.length,
    findingsByKind: s.findings.reduce<Record<string, number>>((acc, f) => {
      const k = s.assertions.find((a) => a.id === f.assertionRef.id)!.kind; acc[k] = (acc[k] ?? 0) + 1; return acc; }, {}),
    objectives: s.assertions.filter((a) => a.kind === 'objective').length,
    reviewLevels: s.assertions.reduce<Record<string, number>>((acc, a) => { acc[a.review.level] = (acc[a.review.level] ?? 0) + 1; return acc; }, {}),
    sources: s.sources.length, models: s.models.length, contracts: s.contracts.length,
  };
  return { status: 200, body: {
    revision: s.revision, digest: s.digest, manifest: s.manifest, counts, families: s.families,
    investigations: s.investigations.map((i) => ({ ...i, objectives: i.objectiveAssertionIds.map((id) => s.assertions.find((a) => a.id === id)) })),
    findings: s.findings.map((f) => ({ id: f.id, title: f.title, safetyAreas: f.safetyAreas, briefRole: f.briefRole, investigationIds: f.investigationRefs.map((r) => r.id) })),
    models: s.models.map((m) => ({ id: m.id, displayName: m.displayName, investigationId: m.investigationRef?.id ?? null, predictedQuantityIds: m.predictedQuantityIds })),
    events: s.events.map((e) => ({ id: e.id, label: e.sourceLabels.join(' / '), investigationId: e.investigationRef.id })),
    quantities: s.entities.filter((e) => e.kind === 'quantity').map((e) => ({ id: e.id, displayName: e.displayName, definition: e.definition })),
    endpoints: s.entities.filter((e) => e.kind === 'endpoint').map((e) => ({ id: e.id, displayName: e.displayName, definition: e.definition })),
    sources: s.sources.map((x) => ({ id: x.id, title: x.title, canonicalUri: x.canonicalUri, access: x.access, publicationDate: x.publicationDate, observedSha256: x.observedSha256, review: x.review })),
  } };
}

export function handleInterpret(rawText: string): Reply {
  if (new TextEncoder().encode(rawText).length > MAX_INTERPRET_BODY_BYTES) return err(413, 'body_too_large', `Request exceeds ${MAX_INTERPRET_BODY_BYTES} bytes; your text was not truncated.`);
  let json: unknown;
  try { json = JSON.parse(rawText); } catch { return err(400, 'bad_json', 'Body is not valid JSON.'); }
  const parsed = InterpretRequest.safeParse(json);
  if (!parsed.success) {
    const tooLong = parsed.error.issues.some((i) => i.path[0] === 'question' && i.code === 'too_big');
    return err(tooLong ? 413 : 400, tooLong ? 'question_too_long' : 'invalid_request', tooLong ? 'Question exceeds 2,000 characters; it was not truncated.' : 'Invalid interpret request.',
      parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`));
  }
  const s = requireCatalog();
  if (parsed.data.envelope.catalogRevision !== s.revision) return err(409, 'stale_catalog', 'Catalogue revision changed; refresh before interpreting.', [], parsed.data.envelope);
  const rt = runtimeStatus();
  // No accepted configuration exists, so no outbound inference is ever attempted (M17).
  return err(503, 'ai_unavailable', `SI interpretation unavailable: ${rt.reason} Use the structured form; it runs the same assessment.`, [], parsed.data.envelope);
}

const AssessBody = z.strictObject({ request: ConfirmedRequest, catalogRevision: z.string(), parent: z.unknown().nullable().optional(), researchSelections: ResearchSelectionsSchema.optional() });

export function handleAssess(rawText: string, now?: string): Reply {
  if (new TextEncoder().encode(rawText).length > MAX_ASSESS_BODY_BYTES) return err(413, 'body_too_large', 'Assessment request exceeds 2 MiB.');
  let json: unknown;
  try { json = JSON.parse(rawText); } catch { return err(400, 'bad_json', 'Body is not valid JSON.'); }
  const parsed = AssessBody.safeParse(json);
  if (!parsed.success) return err(400, 'invalid_request', 'Invalid assessment request.', parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`));
  if (parsed.data.request.inputMode === 'ai_assisted' || parsed.data.request.runtimeProvenanceRef !== null)
    return err(403, 'unverified_ai_provenance', 'SI-assisted requests must be confirmed with their signed interpretation receipt. Use the SI confirmation endpoint or structured mode.');
  return assessConfirmed(parsed.data, requireCatalog(), now);
}

/** Server-only entry point: the gateway verifies a visitor-bound receipt before constructing this request.
 * It is deliberately separate from handleAssess; no JSON flag can enable trusted provenance.
 */
export function handleVerifiedGatewayAssess(request: ConfirmedRequest, s: CatalogSnapshot, researchSelections?: ResearchSelection[], now?: string): Reply {
  if (request.inputMode !== 'ai_assisted' || request.runtimeProvenanceRef === null)
    return err(400, 'invalid_gateway_confirmation', 'The verified SI request is incomplete.');
  return assessConfirmed({ request, catalogRevision: s.revision, researchSelections }, s, now);
}

function assessConfirmed(data: z.infer<typeof AssessBody>, s: CatalogSnapshot, now?: string): Reply {
  if (data.catalogRevision !== s.revision) return err(409, 'stale_catalog', 'Catalogue revision changed; reconfirm the request.');
  let parent: Assessment | null = null;
  if (data.parent !== null && data.parent !== undefined) {
    if (!RevisionParentSchema.safeParse(data.parent).success) return err(409, 'parent_structure', 'Previous assessment has malformed revision fields; load a valid notebook or start a new assessment.');
    parent = data.parent as Assessment;
    try { verifyAssessment(parent); } catch (e) {
      return err(409, 'parent_integrity', e instanceof ExportIntegrityError ? `Previous assessment failed its checksum: ${e.message}` : 'Previous assessment is malformed.');
    }
    if (parent.catalogDigest !== s.digest) return err(409, 'parent_catalog_changed', 'The previous assessment used a different catalogue; it stays historical.');
  }
  try {
    return { status: 200, body: assess(data.request, s, { parent, now, researchSelections: data.researchSelections }) };
  } catch (e) {
    if (e instanceof AssessError) return err(e.status, e.code, e.message);
    throw e;
  }
}
