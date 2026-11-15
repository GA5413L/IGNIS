import { afterEach, describe, expect, it, vi } from 'vitest';
import { auditEndpoints, endpointExample } from '../../src/core/endpointAudit';
import { endpointAuditIndex, handleEndpointAudit, MAX_ENDPOINT_AUDIT_BODY_BYTES } from '../../src/server/endpointAudit';
import { GET, POST } from '../../src/app/api/endpoint-audit/route';

afterEach(() => vi.unstubAllGlobals());
const request = (body: string, headers: Record<string, string> = {}) => new Request('https://ignis.test/api/endpoint-audit', { method: 'POST', headers, body });
describe('bounded observation audit API', () => {
  it('exposes source provenance and the exact local result with no external requests', async () => {
    const fetch = vi.fn(() => { throw new Error('No network allowed'); }); vi.stubGlobal('fetch', fetch);
    const indexResponse = GET(new Request('https://ignis.test/api/endpoint-audit'));
    const index = await indexResponse.json();
    expect(indexResponse.headers.get('cache-control')).toBe('no-store');
    expect(index).toMatchObject({ maxRuns: 8, maxTotalSteps: 64, outboundRequests: false });
    expect(index.sourceDossier.methodologicalSource.source).toMatchObject({ canonicalPdfSha256: 'a1899bf28581fa30a480a65d7868a94019821e7fc7b02b3f51ff2c34fc2b6bb0', alternatePdfSha256: '8ff9c5214eac0f2d7da53ddac4493578b1cba9954ccd6fbbf813c0cfef5398fc' });
    const reply = await POST(request(JSON.stringify(index.example)));
    expect(reply.status).toBe(200);
    expect(reply.headers.get('cache-control')).toBe('no-store');
    expect(await reply.json()).toEqual(auditEndpoints(endpointExample()));
    expect(fetch).not.toHaveBeenCalled();
  });
  it.each(['17,5', '1e1', 'NaN', 'Infinity', ' 19', '-1', '101', '17.0000001', '', 17])('rejects malformed or ambiguous oxygen %s', (value) => {
    const example = endpointExample();
    const invalid = { ...example, runs: [{ ...example.runs[0], steps: [{ ...example.runs[0].steps[0], oxygenVolPercent: value }] }] };
    expect(handleEndpointAudit(JSON.stringify(invalid))).toMatchObject({ status: 400, body: { code: 'invalid_request' } });
  });
  it('rejects source-observation roles, aggregates, undefined statuses and incomplete assumptions', () => {
    for (const patch of [{ dataRole: 'source_observation' }, { meanLOC: 18.3, sd: 0.5 }, { idealizedModel: { monotoneBinaryResponse: true } }]) {
      expect(handleEndpointAudit(JSON.stringify({ ...endpointExample(), ...patch })).status).toBe(400);
    }
    const r = endpointExample();
    const invalid = { ...r, runs: [{ ...r.runs[0], steps: [{ ...r.runs[0].steps[0], observations: { sustainedFlameSpread: 'extinguished', visibleFlame: 'unknown', fuelRegression: 'unknown' } }] }] };
    expect(handleEndpointAudit(JSON.stringify(invalid)).status).toBe(400);
  });
  it('bounds total steps across runs, run counts and duplicate identities', () => {
    const r = endpointExample(); const first = r.runs[0];
    for (const runs of [
      [first, first],
      [{ ...first, steps: [first.steps[0], first.steps[0]] }],
      Array.from({ length: 9 }, (_, i) => ({ ...first, id: `run${i}`, steps: [] })),
      Array.from({ length: 2 }, (_, i) => ({ ...first, id: `run${i}`, steps: Array.from({ length: 33 }, (_, j) => ({ ...first.steps[0], id: `step${j}` })) })),
    ]) expect(handleEndpointAudit(JSON.stringify({ ...r, runs })).status).toBe(400);
    const allowed = { ...r, runs: [{ ...first, steps: Array.from({ length: 64 }, (_, i) => ({ ...first.steps[0], id: `step${i}` })) }] };
    expect(handleEndpointAudit(JSON.stringify(allowed)).status).toBe(200);
  });
  it('enforces HTTP/body boundaries without deriving an extinction result', async () => {
    expect(handleEndpointAudit('{').body).toMatchObject({ code: 'bad_json' });
    expect(handleEndpointAudit(' '.repeat(MAX_ENDPOINT_AUDIT_BODY_BYTES + 1)).status).toBe(413);
    expect((await POST(request(' '.repeat(MAX_ENDPOINT_AUDIT_BODY_BYTES + 1)))).status).toBe(413);
    expect((await POST(request('{}', { 'content-length': String(MAX_ENDPOINT_AUDIT_BODY_BYTES + 1) }))).status).toBe(413);
    expect((await POST(request(JSON.stringify(endpointExample()), { origin: 'https://other.test' }))).status).toBe(403);
    expect(endpointAuditIndex(new URLSearchParams('limit=0')).status).toBe(400);
  });
});
