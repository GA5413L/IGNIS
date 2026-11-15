import { handleSession } from '../../../server/sessions';
import { boundedJsonPost } from '../../../server/http';
import { MAX_SESSION_BYTES } from '../../../core/researchSession';
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  return boundedJsonPost(req, MAX_SESSION_BYTES, handleSession);
}
