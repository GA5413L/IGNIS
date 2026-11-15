import { describe, expect, it, vi } from 'vitest';
import { checkCitation, citationEndpoint, CITATION_TARGETS, normalizeCitationTitle } from '../../src/server/citations';

describe('citation identity checks', () => {
  it('builds only fixed API hosts from constrained identifiers', () => {
    expect(citationEndpoint(CITATION_TARGETS[0])).toBe('https://ntrs.nasa.gov/api/citations/20240008602');
    for (const identifier of ['https://evil.invalid', '123/../../secret', '10.1234/foo?token=x', '10.1234/foo#redirect']) expect(() => citationEndpoint({ ...CITATION_TARGETS[4], identifier })).toThrow();
  });
  it('distinguishes identifier mismatch, title mismatch, unavailability and a matching record', async () => {
    const target = CITATION_TARGETS[0];
    for (const [body, status] of [[{ id: target.identifier, title: target.title }, 'metadata_match'], [{ id: target.identifier, title: 'Another paper' }, 'title_differs'],
      [{ id: '20240000000', title: target.title }, 'identifier_mismatch'], [{ title: target.title }, 'invalid_response']] as const) {
      const result = await checkCitation(target, async () => Response.json(body)); expect(result.status).toBe(status); expect(result.metadataSha256).toMatch(/^[a-f0-9]{64}$/);
    }
    expect((await checkCitation(target, async () => new Response('', { status: 404 }))).status).toBe('not_found');
    expect((await checkCitation(target, async () => new Response('', { status: 429 }))).status).toBe('unavailable');
    expect((await checkCitation(target, async () => { throw new Error('offline'); })).status).toBe('unavailable');
  });
  it('handles Crossref and DataCite envelopes without equating registration with claim support', async () => {
    const cross = CITATION_TARGETS[4], data = CITATION_TARGETS[6];
    expect((await checkCitation(cross, async () => Response.json({ message: { DOI: cross.identifier.toUpperCase(), title: [cross.title] } }))).status).toBe('metadata_match');
    expect((await checkCitation(data, async () => Response.json({ data: { attributes: { doi: data.identifier, titles: [{ title: data.title }] } } }))).status).toBe('metadata_match');
    expect(normalizeCitationTitle('Low-Gravity  Environment')).toBe('low gravity environment');
  });
  it('rejects redirects and oversized/malformed metadata without retry', async () => {
    for (const response of [new Response('x'.repeat(1024 * 1024 + 1)), new Response('{broken')]) {
      const transport = vi.fn(async () => response); const result = await checkCitation(CITATION_TARGETS[0], transport);
      expect(result.status).toBe('invalid_response'); expect(transport).toHaveBeenCalledTimes(1);
      expect((transport.mock.calls[0] as unknown as [string, RequestInit])[1].redirect).toBe('error');
    }
  });
});
