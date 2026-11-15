import { handlePackageCreate } from '../../../server/packages';
import { boundedJsonPost, MAX_HTTP_PAYLOAD_BYTES } from '../../../server/http';
export const dynamic = 'force-dynamic';
export async function POST(req: Request) { return boundedJsonPost(req, MAX_HTTP_PAYLOAD_BYTES, handlePackageCreate); }
