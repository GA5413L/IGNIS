import { handleInterpret } from '../../../server/handlers';
import { boundedJsonPost } from '../../../server/http';
import { MAX_INTERPRET_BODY_BYTES } from '../../../core/interpretation';
export const dynamic = 'force-dynamic';
export async function POST(req: Request) {
  return boundedJsonPost(req, MAX_INTERPRET_BODY_BYTES, handleInterpret);
}
