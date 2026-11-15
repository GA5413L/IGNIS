import { handleEvidence } from '../../../server/evidence';

export const dynamic = 'force-dynamic';

export function GET(request: Request) {
  const reply = handleEvidence(new URL(request.url).searchParams);
  return Response.json(reply.body, { status: reply.status, headers: { 'Cache-Control': 'no-store' } });
}
