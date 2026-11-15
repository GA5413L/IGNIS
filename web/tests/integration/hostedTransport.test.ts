import { describe, expect, it, vi } from 'vitest';
import { boundedJsonPost, MAX_HTTP_PAYLOAD_BYTES } from '../../src/server/http';
import { MAX_PACKAGE_BYTES, parseEvidencePackage } from '../../src/core/evidencePackage';
import { makeSession } from '../../src/core/researchSession';
import { POST as createPackage } from '../../src/app/api/package/route';
import { POST as recheckPackage } from '../../src/app/api/package/recheck/route';
import { run, W1, NOW } from '../helpers';

const request = (body: string, path = '/api/package') => new Request(`http://localhost${path}`, {
  method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://localhost' }, body,
});

describe('hosted JSON transport is separate from the local evidence format', () => {
  it('caps a permissive caller at 4 MiB and still accepts the exact request limit', async () => {
    const handler = vi.fn(() => ({ status: 200, body: { accepted: true } }));
    const exact = await boundedJsonPost(request(' '.repeat(MAX_HTTP_PAYLOAD_BYTES)), MAX_PACKAGE_BYTES, handler);
    expect(exact.status).toBe(200); expect(handler).toHaveBeenCalledTimes(1);
    handler.mockClear();
    const over = await boundedJsonPost(request(' '.repeat(MAX_HTTP_PAYLOAD_BYTES + 1)), MAX_PACKAGE_BYTES, handler);
    expect(over.status).toBe(413); expect(handler).not.toHaveBeenCalled();
    expect(await over.json()).toMatchObject({ code: 'body_too_large' });
  });

  it('sends an exact-limit serialized response unchanged', async () => {
    const payload = 'a'.repeat(MAX_HTTP_PAYLOAD_BYTES - 2); // JSON string quotes count too.
    const reply = await boundedJsonPost(request('{}'), 1024, () => ({ status: 200, body: payload }));
    expect(reply.status).toBe(200);
    expect(reply.headers.get('cache-control')).toBe('no-store');
    expect(reply.headers.get('content-type')).toContain('application/json');
    const text = await reply.text();
    expect(new TextEncoder().encode(text).length).toBe(MAX_HTTP_PAYLOAD_BYTES);
    expect(JSON.parse(text)).toBe(payload);
  });

  it('counts response UTF-8 bytes and replaces an oversize result with a small nonrecursive error', async () => {
    let serializations = 0;
    const reply = await boundedJsonPost(request('{}'), 1024, () => ({ status: 200, body: {
      toJSON() { serializations++; return '\u{1f525}'.repeat(MAX_HTTP_PAYLOAD_BYTES / 4); },
    } }));
    expect(reply.status).toBe(413); expect(serializations).toBe(1);
    expect(reply.headers.get('cache-control')).toBe('no-store');
    const text = await reply.text();
    expect(new TextEncoder().encode(text).length).toBeLessThan(1024);
    expect(JSON.parse(text)).toMatchObject({ code: 'response_too_large', message: expect.stringContaining('Nothing was truncated') });
  });

  it('creates and rechecks a normal package while retaining larger valid files for local use', async () => {
    const assessment = run(W1);
    const session = makeSession({ question: assessment.request.originalText, proposal: assessment.request.proposal }, [], [assessment], NOW);
    const created = await createPackage(request(JSON.stringify({ session, originals: [assessment] })));
    expect(created.status).toBe(200);
    const text = await created.text(), packet = parseEvidencePackage(text);
    expect(packet.originals[0].payloadSha256).toBe(assessment.payloadSha256);
    expect(new TextEncoder().encode(text).length).toBeLessThan(MAX_HTTP_PAYLOAD_BYTES);
    const checked = await recheckPackage(request(text, '/api/package/recheck'));
    expect(checked.status).toBe(200);
    const review = await checked.json();
    expect(review.historical.status).toBe('self_consistent_not_authenticated');
    expect(review.current.checks[0].status).toBe('unchanged');

    // Valid JSON whitespace makes the same package exceed transport, not the local format.
    const padded = text + ' '.repeat(MAX_HTTP_PAYLOAD_BYTES + 1 - new TextEncoder().encode(text).length);
    expect(MAX_PACKAGE_BYTES).toBe(8 * 1024 * 1024);
    expect(parseEvidencePackage(padded).checksum).toBe(packet.checksum);
    for (const route of [createPackage, recheckPackage]) {
      const rejected = await route(request(padded));
      expect(rejected.status).toBe(413);
      expect(await rejected.json()).toMatchObject({ code: 'body_too_large' });
    }
  });
});
