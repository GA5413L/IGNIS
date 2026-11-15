import { designAuditIndex, handleDesignAudit, MAX_DESIGN_AUDIT_BODY_BYTES } from '../../../server/designAudit';
import { boundedJsonPost } from '../../../server/http';
export const dynamic = 'force-dynamic';
export function GET(request: Request) {
  const reply = designAuditIndex(new URL(request.url).searchParams);
  return Response.json(reply.body, { status: reply.status, headers: { 'Cache-Control': 'no-store' } });
}
export async function POST(request: Request) {
  return boundedJsonPost(request, MAX_DESIGN_AUDIT_BODY_BYTES, handleDesignAudit);
}
