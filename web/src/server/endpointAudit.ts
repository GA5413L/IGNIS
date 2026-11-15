import { ZodError } from 'zod';
import { auditEndpoints, ENDPOINT_AUDIT_REVISION, endpointExample, MAX_ENDPOINT_STEPS } from '../core/endpointAudit';
import type { Reply } from './handlers';

export const MAX_ENDPOINT_AUDIT_BODY_BYTES = 32 * 1024;
const error = (status: number, code: string, message: string, fields: string[] = []): Reply => ({
  status, body: { schemaVersion: 'ignis-endpoint-audit-error-1', code, message, fields },
});
export function endpointAuditIndex(query: URLSearchParams): Reply {
  if (query.size) return error(400, 'unknown_parameter', 'The endpoint-audit index accepts no query parameters.');
  return { status: 200, body: {
    schemaVersion: 'ignis-endpoint-audit-index-1', methodRevision: ENDPOINT_AUDIT_REVISION,
    endpoint: '/api/endpoint-audit', method: 'POST',
    purpose: 'Audit separate detected-spread, visible-flame and fuel-regression observations. Optional idealized parameter sets are conditional mathematics, not physical extinction thresholds.',
    maxBodyBytes: MAX_ENDPOINT_AUDIT_BODY_BYTES, maxRuns: 8, maxTotalSteps: MAX_ENDPOINT_STEPS,
    inputPolicy: 'Strict JSON; exact decimal strings in oxygen volume percent; explicit unknown observation values and nullable method/window/resolution. Run-level records only, never aggregate means or SDs.',
    exampleLabel: 'Hypothetical mathematical example, not observations from LIV24 or an experiment protocol.',
    example: endpointExample(),
    sourceDossier: auditEndpoints({ ...endpointExample(), runs: [] }),
    outboundRequests: false, caching: 'no-store',
  } };
}
export function handleEndpointAudit(text: string): Reply {
  if (new TextEncoder().encode(text).length > MAX_ENDPOINT_AUDIT_BODY_BYTES) return error(413, 'body_too_large', 'Endpoint-audit body exceeds 32768 bytes; nothing was truncated.');
  let input: unknown;
  try { input = JSON.parse(text); }
  catch { return error(400, 'bad_json', 'Body is not valid JSON.'); }
  try { return { status: 200, body: auditEndpoints(input) }; }
  catch (caught) {
    if (caught instanceof ZodError) return error(400, 'invalid_request', 'The observation audit request is invalid.', caught.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`));
    return error(500, 'endpoint_audit_unavailable', 'No substitute observation result was returned.');
  }
}
