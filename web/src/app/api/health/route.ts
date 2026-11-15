import { handleHealth } from '../../../server/handlers';
export const dynamic = 'force-dynamic';
export function GET() { const r = handleHealth(); return Response.json(r.body, { status: r.status, headers: { 'Cache-Control': 'no-store' } }); }
