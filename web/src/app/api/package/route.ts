import { handlePackageCreate } from '../../../server/packages';
import { boundedJsonPost } from '../../../server/http';
import { MAX_PACKAGE_BYTES } from '../../../core/evidencePackage';
export const dynamic = 'force-dynamic';
export async function POST(req: Request) { return boundedJsonPost(req, MAX_PACKAGE_BYTES, handlePackageCreate); }
