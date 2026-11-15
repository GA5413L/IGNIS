import { describe, expect, it, vi } from 'vitest';
import { boundedJsonPost, readBoundedText } from '../../src/server/http';
import { sameOrigin } from '../../src/server/origin';
import { handleAssess } from '../../src/server/handlers';
import { payloadDigest } from '../../src/core/digest';
import { makeSession, parseSession } from '../../src/core/researchSession';
import { canonicalJson, digestOf } from '../../src/core/canonicalize';
import { catalog, request, run, W1, W3 } from '../helpers';
import type { Assessment } from '../../src/core/assess';

const post = (body: BodyInit | null, headers?: HeadersInit) => new Request('http://localhost/api/assess', {
  method: 'POST', body, headers, duplex: 'half',
} as RequestInit);
const submit = (req: ReturnType<typeof request>, parent?: unknown) => handleAssess(JSON.stringify({ request: req, catalogRevision: catalog().revision, parent }));

describe('bounded HTTP reading', () => {
  it('cancels forbidden-origin bodies without reading them or invoking a handler', async () => {
    let pulls = 0, cancelled = false;
    const stream = new ReadableStream<Uint8Array>({ pull(c) { pulls++; c.enqueue(new Uint8Array(3)); },
      cancel() { cancelled = true; } }, { highWaterMark: 0 });
    const handler = vi.fn(() => ({ status: 200, body: {} }));
    const reply = await boundedJsonPost(post(stream, { Origin: 'http://other.example' }), 8, handler);
    expect(reply.status).toBe(403); expect(pulls).toBe(0); expect(cancelled).toBe(true);
    expect(handler).not.toHaveBeenCalled();
  });
  it('cancels an oversized chunked stream before reading the remaining body', async () => {
    let pulls = 0, cancelled = false;
    const stream = new ReadableStream<Uint8Array>({ pull(controller) {
      pulls++; controller.enqueue(new Uint8Array(3));
      if (pulls === 30) controller.close();
    }, cancel() { cancelled = true; } }, { highWaterMark: 0 });
    const handler = vi.fn(() => ({ status: 200, body: {} }));
    const result = await boundedJsonPost(post(stream), 8, handler);
    expect(result.status).toBe(413);
    expect(pulls).toBe(3);
    expect(cancelled).toBe(true);
    expect(handler).not.toHaveBeenCalled();
    expect(result.headers.get('cache-control')).toBe('no-store');
  });
  it('rejects excessive content length before reading and still bounds understated lengths', async () => {
    let pulls = 0;
    const stream = new ReadableStream<Uint8Array>({ pull(controller) { pulls++; controller.enqueue(new Uint8Array(20)); } }, { highWaterMark: 0 });
    const response = await boundedJsonPost(post(stream, { 'Content-Length': '20' }), 8, () => ({ status: 200, body: {} }));
    expect(response.status).toBe(413); expect(pulls).toBe(0);
    const understated = await boundedJsonPost(post('0123456789', { 'Content-Length': '1' }), 8, () => ({ status: 200, body: {} }));
    expect(understated.status).toBe(413);
  });
  it('counts UTF-8 bytes, preserves split characters and accepts the exact limit', async () => {
    const bytes = new TextEncoder().encode('a🔥b');
    const stream = new ReadableStream<Uint8Array>({ start(c) { c.enqueue(bytes.slice(0, 3)); c.enqueue(bytes.slice(3)); c.close(); } });
    expect(await readBoundedText(post(stream), 6)).toBe('a🔥b');
    const handler = vi.fn(() => ({ status: 200, body: {} }));
    expect((await boundedJsonPost(post('a🔥b'), 5, handler)).status).toBe(413);
    expect(handler).not.toHaveBeenCalled();
  });
  it('rejects invalid UTF-8 and interrupted streams before invoking a handler', async () => {
    const handler = vi.fn(() => ({ status: 200, body: {} }));
    expect((await boundedJsonPost(post(new Uint8Array([0xff])), 8, handler)).status).toBe(400);
    const broken = new ReadableStream({ start(c) { c.error(new Error('disconnected')); } });
    expect((await boundedJsonPost(post(broken), 8, handler)).status).toBe(400);
    expect(handler).not.toHaveBeenCalled();
  });
  it('compares scheme, host and port and rejects cross-site browser requests missing Origin', () => {
    expect(sameOrigin(post(null, { Origin: 'http://localhost' }))).toBe(true);
    expect(sameOrigin(post(null, { Origin: 'https://localhost:80' }))).toBe(false);
    expect(sameOrigin(post(null, { Origin: 'http://localhost:3000' }))).toBe(false);
    expect(sameOrigin(post(null, { 'Sec-Fetch-Site': 'cross-site' }))).toBe(false);
    expect(sameOrigin(post(null))).toBe(true);
    expect(sameOrigin(post(null, { Origin: 'null' }))).toBe(false);
    expect(sameOrigin(post(null, { Host: '127.0.0.1:3202', Origin: 'http://127.0.0.1:3202' }))).toBe(true);
    expect(sameOrigin(post(null, { Host: 'localhost/ignored', Origin: 'http://localhost' }))).toBe(false);
  });
});

describe('revision import integrity', () => {
  it('rejects checksummed malformed parents without throwing an internal error', () => {
    const parent = run(W1);
    for (const patch of [{ claims: [null] }, { claims: [{ ...parent.claims[0], predicateResults: null }] }, { researchAnalyses: [null] }, { request: null }]) {
      const malformed = { ...parent, ...patch }; malformed.payloadSha256 = payloadDigest(malformed);
      expect(submit(request(W3, 'q', 'REQ-CHILD'), malformed).status).toBe(409);
    }
    expect(submit(request(W3), false).status).toBe(409);
  });
  it('rejects mismatched, absent, self and orphan ancestry', () => {
    const parent = run(W1), child = request(W3, 'q', 'REQ-CHILD');
    expect(submit(child, parent).status).toBe(409);
    child.parentRequestRef = { id: parent.request.id, revision: 'wrong' };
    expect(submit(child, parent).status).toBe(409);
    child.parentRequestRef.revision = parent.request.revision;
    expect(submit(child).status).toBe(409);
    child.id = parent.request.id;
    expect(submit(child, parent).status).toBe(409);
  });
  it('an accepted revision round-trips through the notebook ancestry validator', () => {
    const parent = run(W1), child = request(W3, 'q', 'REQ-CHILD');
    child.parentRequestRef = { id: parent.request.id, revision: parent.request.revision };
    const reply = submit(child, parent); expect(reply.status).toBe(200);
    const session = makeSession({ question: child.originalText, proposal: child.proposal }, [], [parent, reply.body as Assessment]);
    expect(parseSession(JSON.stringify(session)).receipts).toHaveLength(2);
  });
  it('rejects reusing a visible ancestor and refuses saving invalid complete histories', () => {
    const a = run(W1, { id: 'REQ-A' });
    const b = run(W3, { id: 'REQ-B', parent: a });
    const reuse = request(W1, 'q', 'REQ-A');
    reuse.parentRequestRef = { id: b.request.id, revision: b.request.revision };
    expect(submit(reuse, b).status).toBe(409);
    const duplicate = structuredClone(a); duplicate.id += '-other'; duplicate.payloadSha256 = payloadDigest(duplicate);
    expect(() => makeSession({ question: 'q', proposal: a.request.proposal }, [], [a, duplicate])).toThrow(/duplicate/);
    const orphan = structuredClone(a); orphan.request.parentRequestRef = { id: 'missing', revision: 'r1' }; orphan.payloadSha256 = payloadDigest(orphan);
    expect(() => makeSession({ question: 'q', proposal: a.request.proposal }, [], [orphan])).toThrow(/ancestry/);
  });
  it('does not drop prototype-looking JSON keys from the canonical payload checksum', () => {
    const value = JSON.parse('{"__proto__":{"lost":true},"a":1}');
    expect(canonicalJson(value)).toBe('{"__proto__":{"lost":true},"a":1}');
    expect(digestOf(value)).not.toBe(digestOf({ a: 1 }));
    expect(canonicalJson(JSON.parse('{"constructor":1,"prototype":2}'))).toBe('{"constructor":1,"prototype":2}');
  });
});
