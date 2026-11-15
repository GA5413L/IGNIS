import { gatewayPost, gatewayStatus } from '../../../../server/gateway/handler';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export function GET(request: Request) { return gatewayStatus(request); }
export function POST(request: Request) { return gatewayPost(request); }
