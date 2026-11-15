import { handleCatalog } from '../../../server/handlers';
export const dynamic = 'force-static';
export function GET() { const r = handleCatalog(); return Response.json(r.body, { status: r.status }); }
