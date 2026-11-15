import { endpointAuditIndex, handleEndpointAudit, MAX_ENDPOINT_AUDIT_BODY_BYTES } from '../../../server/endpointAudit';
import { boundedJsonPost } from '../../../server/http';
export const dynamic = 'force-dynamic';
export function GET(request: Request) {
  const reply = endpointAuditIndex(new URL(request.url).searchParams);
  return Response.json(reply.body, { status: reply.status, headers: { 'Cache-Control': 'no-store' } });
}
export async function POST(request: Request) {
  return boundedJsonPost(request, MAX_ENDPOINT_AUDIT_BODY_BYTES, handleEndpointAudit);
}
