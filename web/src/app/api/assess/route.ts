import { handleAssess, MAX_ASSESS_BODY_BYTES } from '../../../server/handlers';
import { boundedJsonPost } from '../../../server/http';
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  return boundedJsonPost(req, MAX_ASSESS_BODY_BYTES, handleAssess);
}
