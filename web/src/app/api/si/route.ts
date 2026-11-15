import { handleSIStatus, handleSIPreview } from '../../../server/si';
import { boundedJsonPost } from '../../../server/http';
import { MAX_INTERPRET_BODY_BYTES } from '../../../core/interpretation';
export const dynamic = 'force-dynamic';
export function GET() {
  const reply = handleSIStatus();
  return Response.json(reply.body, { status: reply.status, headers: { 'Cache-Control': 'no-store' } });
}
export async function POST(req: Request) { return boundedJsonPost(req, MAX_INTERPRET_BODY_BYTES, handleSIPreview); }
