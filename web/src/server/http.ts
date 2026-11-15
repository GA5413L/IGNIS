/** Read bounded JSON bodies before allocating an unbounded request.text() string. */
import { sameOrigin } from './origin';
import type { Reply } from './handlers';

// Transport policy, independent of the core library's larger local package format.
// This module has only browser-safe runtime imports; notebook UI shares this bound.
export const MAX_HTTP_PAYLOAD_BYTES = 4 * 1024 * 1024;

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
  try { text = await readBoundedText(request, Math.min(maxBytes, MAX_HTTP_PAYLOAD_BYTES)); }
  catch (error) {
    if (!(error instanceof BodyError)) throw error;
    return Response.json({ code: error.code, message: error.message }, { status: error.status, headers });
  }
  const reply = await handler(text);
  return boundedJsonReply(reply);
}

/** Serialize once, check the actual UTF-8 payload, then send those same bytes.
 * The fixed small error bypasses this helper so rejection cannot recurse.
 */
export function boundedJsonReply(reply: Reply): Response {
  const headers = { 'Cache-Control': 'no-store', 'Content-Type': 'application/json' };
  const text = JSON.stringify(reply.body);
  if (text === undefined) throw new TypeError('Response body is not JSON serializable.');
  if (new TextEncoder().encode(text).length > MAX_HTTP_PAYLOAD_BYTES)
    return Response.json({ code: 'response_too_large', message: 'The result exceeds the 4 MiB hosted HTTP response limit. Nothing was truncated. Reduce the selection or use the local package library for packages up to 8 MiB.' }, { status: 413, headers });
  return new Response(text, { status: reply.status, headers });
}
