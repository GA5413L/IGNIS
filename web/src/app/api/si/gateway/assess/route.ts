import { gatewayAssess } from '../../../../../server/gateway/handler';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export function POST(request: Request) { return gatewayAssess(request); }
