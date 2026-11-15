/** Read bounded JSON bodies before allocating an unbounded request.text() string. */
import { sameOrigin } from './origin';
import type { Reply } from './handlers';

class BodyError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}

export async function readBoundedText(request: Request, maxBytes: number): Promise<string> {
  const declared = request.headers.get('content-length');
  const tooLarge = () => new BodyError(413, 'body_too_large', `Request exceeds ${maxBytes} bytes; nothing was truncated.`);
  if (declared && /^\d+$/.test(declared) && Number(declared) > maxBytes) {
    void request.body?.cancel().catch(() => {});
    throw tooLarge();
  }
  if (!request.body) return '';
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let size = 0;
  const parts: string[] = [];
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.byteLength;
      if (size > maxBytes) throw tooLarge();
      parts.push(decoder.decode(next.value, { stream: true }));
    }
    parts.push(decoder.decode());
    return parts.join('');
  } catch (error) {
    void reader.cancel().catch(() => {});
    if (error instanceof BodyError) throw error;
    throw new BodyError(400, 'invalid_body', 'The request body could not be read as UTF-8. Nothing was processed.');
  } finally { reader.releaseLock(); }
}

export async function boundedJsonPost(request: Request, maxBytes: number, handler: (text: string) => Reply | Promise<Reply>): Promise<Response> {
  const headers = { 'Cache-Control': 'no-store' };
  if (!sameOrigin(request)) {
    void request.body?.cancel().catch(() => {});
    return Response.json({ code: 'forbidden_origin', message: 'Cross-origin requests are not accepted.' }, { status: 403, headers });
  }
  let text: string;
  try { text = await readBoundedText(request, maxBytes); }
  catch (error) {
    if (!(error instanceof BodyError)) throw error;
    return Response.json({ code: error.code, message: error.message }, { status: error.status, headers });
  }
  const reply = await handler(text);
  return Response.json(reply.body, { status: reply.status, headers });
}
