import { afterEach, describe, expect, it, vi } from 'vitest';
import { TWO_POINT_DESIGN_EXAMPLE } from '../../src/core/designAudit';
import { designAuditIndex, handleDesignAudit, MAX_DESIGN_AUDIT_BODY_BYTES } from '../../src/server/designAudit';
import { GET, POST } from '../../src/app/api/design-audit/route';

afterEach(() => vi.unstubAllGlobals());
const request = (body: string, headers: Record<string, string> = {}) => new Request('https://ignis.test/api/design-audit', { method: 'POST', headers, body });
describe('design audit API', () => {
  it('documents the bounded source-scoped API with zero outbound requests', async () => {
    const fetch = vi.fn(() => { throw new Error('Network prohibited'); });
    vi.stubGlobal('fetch', fetch);
    const response = GET(new Request('https://ignis.test/api/design-audit'));
    expect(response.headers.get('cache-control')).toBe('no-store');
    const index = await response.json();
    expect(index).toMatchObject({ maxCandidates: 32, outboundRequests: false });
    expect(index.reportedDesign.sourceStudy.design.tableXConditions).toHaveLength(12);
    const post = await POST(request(JSON.stringify(index.example)));
    expect(post.status).toBe(200);
    const result = await post.json();
    expect(result.classes.twoTerm.rows).toEqual([['71/708', '0'], ['0', '-1/8']]);
    expect(result.classes.expandedFiveTerm.nullity).toBe(3);
    expect(fetch).not.toHaveBeenCalled();
  });
  it.each([
    { gravity: '1g' }, { studyId: 'BASS-II' }, { schemaVersion: 'future' },
    { baselineFit: true }, { center: [35.4, 60, 100] }, { candidates: null },
    { candidates: [...TWO_POINT_DESIGN_EXAMPLE.candidates, TWO_POINT_DESIGN_EXAMPLE.candidates[0]] },
    { candidates: [{ ...TWO_POINT_DESIGN_EXAMPLE.candidates[0], observedResponse: 1.2 }] },
    { candidates: Array.from({ length: 33 }, (_, i) => ({ ...TWO_POINT_DESIGN_EXAMPLE.candidates[0], id: `p${i}` })) },
  ])('rejects incompatible scope or unsupported input %j', (patch) => {
    const reply = handleDesignAudit(JSON.stringify({ ...TWO_POINT_DESIGN_EXAMPLE, ...patch }));
    expect(reply.status).toBe(400);
    expect(reply.body).toMatchObject({ code: 'invalid_request' });
  });
  it('bounds raw and declared bodies and rejects malformed JSON and unsupported queries', async () => {
    expect(handleDesignAudit('{').body).toMatchObject({ code: 'bad_json' });
    expect(handleDesignAudit(' '.repeat(MAX_DESIGN_AUDIT_BODY_BYTES + 1)).status).toBe(413);
    const large = await POST(request(' '.repeat(MAX_DESIGN_AUDIT_BODY_BYTES + 1)));
    expect(large.status).toBe(413);
    const declared = await POST(request('{}', { 'content-length': String(MAX_DESIGN_AUDIT_BODY_BYTES + 1) }));
    expect(declared.status).toBe(413);
    expect(designAuditIndex(new URLSearchParams('ignored=1')).status).toBe(400);
  });
  it('rejects cross-origin posts and returns detached index examples', async () => {
    expect((await POST(request(JSON.stringify(TWO_POINT_DESIGN_EXAMPLE), { origin: 'https://other.test' }))).status).toBe(403);
    const one = await GET(new Request('https://ignis.test/api/design-audit')).json();
    one.example.candidates[0].flowMmS = '200';
    const two = await GET(new Request('https://ignis.test/api/design-audit')).json();
    expect(two.example.candidates[0].flowMmS).toBe('50');
  });
});
