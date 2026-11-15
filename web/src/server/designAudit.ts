import { ZodError } from 'zod';
import { auditDesign, DESIGN_AUDIT_REVISION, MAX_DESIGN_POINTS, TWO_POINT_DESIGN_EXAMPLE } from '../core/designAudit';
import type { Reply } from './handlers';

export const MAX_DESIGN_AUDIT_BODY_BYTES = 16 * 1024;
const error = (status: number, code: string, message: string, fields: string[] = []): Reply => ({
  status, body: { schemaVersion: 'ignis-design-audit-error-1', code, message, fields },
});
export function designAuditIndex(query: URLSearchParams): Reply {
  if (query.size) return error(400, 'unknown_parameter', 'This index accepts no query parameters. Use the documented POST body.');
  return { status: 200, body: {
    schemaVersion: 'ignis-design-audit-index-1', methodRevision: DESIGN_AUDIT_REVISION,
    endpoint: '/api/design-audit', method: 'POST',
    purpose: 'Exact rank and unresolved coefficient directions for one source-bound microgravity nominal design.',
    maxBodyBytes: MAX_DESIGN_AUDIT_BODY_BYTES, maxCandidates: MAX_DESIGN_POINTS,
    inputPolicy: 'Strict JSON schema; coordinates are bounded decimal strings in the field-name units. Numbers, exponents, unknown fields, other gravity regimes and other study IDs are rejected.',
    outputPolicy: 'All candidates are hypothetical coordinates. No response values, fitting, physical predictions or recommendations.',
    exampleLabel: 'Algebraic example only; not an experiment protocol or recommended atmosphere.',
    example: structuredClone(TWO_POINT_DESIGN_EXAMPLE),
    reportedDesign: auditDesign({ ...TWO_POINT_DESIGN_EXAMPLE, candidates: [] }),
    outboundRequests: false, caching: 'no-store',
  } };
}
export function handleDesignAudit(rawText: string): Reply {
  if (new TextEncoder().encode(rawText).length > MAX_DESIGN_AUDIT_BODY_BYTES) return error(413, 'body_too_large', 'Design-audit request exceeds 16384 bytes; nothing was truncated.');
  let json: unknown;
  try { json = JSON.parse(rawText); }
  catch { return error(400, 'bad_json', 'Body is not valid JSON.'); }
  try { return { status: 200, body: auditDesign(json) }; }
  catch (caught) {
    if (caught instanceof ZodError) return error(400, 'invalid_request', 'The source-bound design request is invalid.', caught.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`));
    return error(500, 'design_audit_unavailable', 'The audit could not be computed. No substitute result was returned.');
  }
}
