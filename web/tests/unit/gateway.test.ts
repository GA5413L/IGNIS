import { afterEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { requireCatalog } from '../../src/core/registry';
import { proposalFromForm } from '../../src/core/interpretation';
import { digestOf } from '../../src/core/canonicalize';
import { verifyAssessment } from '../../src/core/export';
import { gatewayAssess, gatewayPost, gatewayStatus, RECEIPT_LIFETIME_MS } from '../../src/server/gateway/handler';
import { handleAssess, MAX_ASSESS_BODY_BYTES } from '../../src/server/handlers';
import { gatewayInterpret } from '../../src/server/gateway/client';
import { GatewayStore } from '../../src/server/gateway/store';
import { gatewayReadiness, GATEWAY_LIMITS as L, GATEWAY_REVISION, GATEWAY_ROUTES, type GatewayConfig } from '../../src/server/gateway/policy';
import { request as formRequest, BRIEF } from '../helpers';

const c: GatewayConfig = { enabled: true, account: 'a'.repeat(32), gateway: 'webiste-chatbot', token: 'TEST_TOKEN_NEVER_RETURN', signingKey: 'TEST_SIGNING_KEY'.repeat(4),
  database: 'C:/ignis-test/quota.sqlite', origin: 'http://127.0.0.1:3000', mode: 'local', turnstileSecret: '', turnstileSiteKey: '', tokenRotated: false,
  byokOnlyVerified: true, privacyVerified: true, sharedStoreVerified: true, freeVerified: ['cf-groq-oss120', 'cf-openrouter-free'] };
const s = requireCatalog(), accepted = GATEWAY_ROUTES.map((r) => r.id), opened: GatewayStore[] = [], directories: string[] = [];
const memory = () => { const db = new GatewayStore(':memory:'); opened.push(db); return db; };
const wire = () => proposalFromForm({ intent: 'synthesize_findings', safetyAreas: ['detection'] });
const completion = (value: unknown = wire(), patch: Record<string, unknown> = {}) => ({ model: 'openai/gpt-oss-120b',
  choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(value) } }], usage: { prompt_tokens: 100, completion_tokens: 100 }, ...patch });
const ok = (value?: unknown, patch?: Record<string, unknown>) => Response.json(completion(value, patch));
function request(body: unknown, cookie: string, origin = c.origin, path = '/api/si/gateway') {
  return new Request(`${c.origin}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin, Cookie: cookie }, body: JSON.stringify(body) });
}
const confirmation = (body: unknown, cookie: string, origin = c.origin) => request(body, cookie, origin, '/api/si/gateway/assess');
function context(config = c) {
  const store = memory(), deps = { config, accepted, snapshot: s, store };
  const cookie = gatewayStatus(new Request(`${c.origin}/api/si/gateway`), deps).headers.get('set-cookie')!.split(';')[0];
  const body = { envelope: { draftId: 'draft', draftRevision: 1, catalogRevision: s.revision, runtimeConfigRevision: GATEWAY_REVISION, logicalCallId: 'one' },
    question: 'Which spacecraft smoke detection evidence is available?', selectedIds: [], publicDataOnly: true };
  return { store, deps, cookie, body };
}
afterEach(() => { opened.splice(0).forEach((s) => s.close()); directories.splice(0).forEach((p) => rmSync(p, { recursive: true, force: true })); vi.useRealTimers(); });

describe('Cloudflare readiness and HTTP contract', () => {
  it('cannot activate by adding a key or environment flags; semantic acceptance remains separate', async () => {
    expect(gatewayReadiness(c).ready).toBe(false);
    const transport = vi.fn(); const x = context();
    const response = await gatewayPost(request(x.body, x.cookie), { ...x.deps, accepted: [], transport });
    expect(response.status).toBe(503); expect(transport).not.toHaveBeenCalled();
  });
  it('requires verified free accounts, privacy, BYOK and shared quota storage', () => {
    for (const patch of [{ byokOnlyVerified: false }, { privacyVerified: false }, { sharedStoreVerified: false }, { freeVerified: [] }, { database: ':memory:' }, { database: 'C:/app/public/quota.sqlite' }, { database: 'C:/app/.next/static/quota.sqlite' }]) expect(gatewayReadiness({ ...c, ...patch }, accepted).ready).toBe(false);
    expect(gatewayReadiness(c, accepted).ready).toBe(true);
  });
  it('allows the owner-authorized unrotated token locally but requires rotation, HTTPS and Turnstile publicly', () => {
    expect(gatewayReadiness(c, accepted).ready).toBe(true);
    expect(gatewayReadiness({ ...c, mode: 'public' }, accepted).reasons).toEqual(expect.arrayContaining(['public_https_required', 'public_token_rotation_required', 'public_turnstile_required']));
    expect(gatewayReadiness({ ...c, origin: 'http://example.com' }, accepted).ready).toBe(false);
  });
  it('rejects cross-origin, missing or forged visitor cookies before any provider call', async () => {
    const x = context(), transport = vi.fn();
    for (const r of [request(x.body, x.cookie, 'https://attacker.invalid'), request(x.body, ''), request(x.body, `${x.cookie}x`)]) {
      expect((await gatewayPost(r, { ...x.deps, transport })).status).toBe(403);
    }
    expect(transport).not.toHaveBeenCalled();
  });
  it('rejects secrets, unrelated questions, arbitrary URLs/model overrides, stale scope and unknown IDs', async () => {
    const x = context(), transport = vi.fn();
    for (const patch of [{ question: 'Write a cryptocurrency trading bot' }, { question: 'Please make the same stock trading bot' }, { question: `fire sk-${'a'.repeat(40)}` }, { url: 'https://attacker.invalid' },
      { model: 'paid-model' }, { question: 'fire'.repeat(700) }, { selectedIds: ['invented-id'] }, { publicDataOnly: false },
      { envelope: { ...x.body.envelope, catalogRevision: 'old' } }]) {
      expect((await gatewayPost(request({ ...x.body, ...patch }, x.cookie), { ...x.deps, transport })).status).toBeGreaterThanOrEqual(400);
    }
    expect(transport).not.toHaveBeenCalled(); expect(x.store.counts().attempts).toBe(0);
  });
  it('returns the complete proposal with a bound receipt and prevents replay billing', async () => {
    const x = context(), transport = vi.fn(async () => ok());
    const response = await gatewayPost(request(x.body, x.cookie), { ...x.deps, transport });
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.proposal).toEqual(wire()); expect(json.envelope).toEqual(x.body.envelope);
    expect(json.catalogDigest).toBe(s.digest); expect(json.provenance.returnedModel).toBe('openai/gpt-oss-120b');
    expect(json.receiptVersion).toBe('ignis-si-receipt-1'); expect(json.signature).toMatch(/^[a-f0-9]{64}$/);
    expect(json.expiresAt - json.issuedAt).toBe(RECEIPT_LIFETIME_MS);
    expect(JSON.stringify(json)).not.toContain(c.token);
    expect(JSON.stringify(json)).not.toContain(c.signingKey);
    expect((await gatewayPost(request(x.body, x.cookie), { ...x.deps, transport })).status).toBe(409);
    expect(transport).toHaveBeenCalledTimes(1);
  });
  it('keeps proposed numeric conditions, unknowns and exclusions rather than converting them into form defaults', async () => {
    const x = context();
    const value = { ...wire(), constraints: [{ fieldId: s.entities[0].id, valueText: '21', unit: '%', rawSpan: '21%', hypothetical: true }],
      explicitExclusions: ['Exclude initial alignment'], unknownTerms: ['unregistered material'] };
    const response = await gatewayPost(request(x.body, x.cookie), { ...x.deps, transport: async () => ok(value) });
    expect(response.status).toBe(200); const json = await response.json();
    expect(json.proposal.constraints[0].value.value).toBe('21'); expect(json.proposal.constraints[0].provenance).toBe('proposed_interpretation');
    expect(json.proposal.explicitExclusions).toEqual(value.explicitExclusions); expect(json.proposal.unknownTerms).toEqual(value.unknownTerms);
    const confirmed = await gatewayAssess(confirmation({ receipt: json }, x.cookie), x.deps);
    expect(confirmed.status).toBe(200);
    const assessment = await confirmed.json();
    expect(assessment.request.proposal).toEqual(json.proposal);
    expect(assessment.handling.handling).toBe('clarification_needed');
  });
  it('does not retry schema or invented-ID failures and exposes no upstream prose', async () => {
    for (const value of [{ ...wire(), verdict: c.token }, { ...wire(), investigationIds: ['FAKE'] }]) {
      const x = context(), transport = vi.fn(async () => ok(value));
      const response = await gatewayPost(request(x.body, x.cookie), { ...x.deps, transport });
      expect(response.status).toBe(502); expect(await response.text()).not.toContain(c.token); expect(transport).toHaveBeenCalledTimes(1);
    }
  });
  it('blocks public requests without successful hostname/action-bound Turnstile verification', async () => {
    const config = { ...c, mode: 'public' as const, origin: 'https://ignis.example', tokenRotated: true, turnstileSecret: 'test', turnstileSiteKey: 'test' };
    const x = context(config), transport = vi.fn(async () => Response.json({ success: true, action: 'wrong', hostname: 'ignis.example' }));
    const response = await gatewayPost(request({ ...x.body, turnstileToken: 'test' }, x.cookie, config.origin), { ...x.deps, transport });
    expect(response.status).toBe(403); expect(transport).toHaveBeenCalledTimes(1); expect(x.store.counts().attempts).toBe(0);
  });
});

describe('visitor-bound SI receipt confirmation', () => {
  const issuedAt = Date.parse('2026-11-15T12:00:00.000Z');
  async function issued() {
    const x = context(), transport = vi.fn(async () => ok()), deps = { ...x.deps, transport, now: () => issuedAt };
    const response = await gatewayPost(request(x.body, x.cookie), deps);
    expect(response.status).toBe(200);
    return { ...x, deps, transport, receipt: await response.json() };
  }
  it('constructs the request on the server without depending on transport readiness or making another provider call', async () => {
    const x = await issued();
    const before = x.store.counts();
    const response = await gatewayAssess(confirmation({ receipt: x.receipt, researchSelections: [] }, x.cookie), {
      ...x.deps, config: { ...c, enabled: false, token: '', database: '', sharedStoreVerified: false, freeVerified: [] },
    });
    expect(response.status).toBe(200);
    const assessment = await response.json();
    expect(() => verifyAssessment(assessment)).not.toThrow();
    expect(assessment.request.id).toMatch(/^REQ-[0-9a-f-]{36}$/);
    expect(assessment.request.originalText).toBe(x.receipt.question);
    expect(assessment.request.proposal).toEqual(x.receipt.proposal);
    expect(assessment.request.confirmedAt).toBe(new Date(issuedAt).toISOString());
    expect(assessment.request.inputMode).toBe('ai_assisted');
    expect(assessment.request.runtimeProvenanceRef).toEqual({ id: x.receipt.provenance.requestId, revision: GATEWAY_REVISION });
    expect(assessment.request.parentRequestRef).toBeNull();
    expect(x.transport).toHaveBeenCalledTimes(1); expect(x.store.counts()).toEqual(before);
  });
  it('rejects edits to all receipt bindings even when public digests are recomputed', async () => {
    const x = await issued();
    const changes = [
      (r: typeof x.receipt) => { r.question += ' Changed'; },
      (r: typeof x.receipt) => { r.envelope.draftId = 'other'; },
      (r: typeof x.receipt) => { r.selectedIds = [s.sources[0].id]; },
      (r: typeof x.receipt) => { r.proposal.unknownTerms = ['changed']; r.proposalDigest = digestOf(r.proposal); },
      (r: typeof x.receipt) => { r.catalogDigest = '0'.repeat(64); },
      (r: typeof x.receipt) => { r.proposalDigest = '0'.repeat(64); },
      (r: typeof x.receipt) => { r.handling.reasons = ['changed']; },
      (r: typeof x.receipt) => { r.provenance.returnedModel = 'invented-model'; },
      (r: typeof x.receipt) => { r.provenance.usage.inputTokens = 1; },
      (r: typeof x.receipt) => { r.provenance.requestId = 'CF-invented'; },
      (r: typeof x.receipt) => { r.provenance.packetDigest = '0'.repeat(64); },
      (r: typeof x.receipt) => { r.issuedAt += 1; },
      (r: typeof x.receipt) => { r.expiresAt += RECEIPT_LIFETIME_MS; },
      (r: typeof x.receipt) => { r.signature = '0'.repeat(64); },
    ];
    for (const change of changes) {
      const receipt = structuredClone(x.receipt); change(receipt);
      const response = await gatewayAssess(confirmation({ receipt }, x.cookie), x.deps);
      expect(response.status).toBe(403); expect((await response.json()).code).toBe('invalid_receipt_signature');
    }
    expect(x.transport).toHaveBeenCalledTimes(1);
  });
  it('checks the original JSON including nested fields that a schema projection would discard', async () => {
    const x = context();
    const value = { ...wire(), constraints: [{ fieldId: s.entities[0].id, valueText: '21', unit: '%', rawSpan: '21%', hypothetical: true }] };
    const response = await gatewayPost(request(x.body, x.cookie), { ...x.deps, transport: async () => ok(value) });
    const receipt = await response.json();
    receipt.proposal.constraints[0].value.injected = 'must remain authenticated';
    const confirmed = await gatewayAssess(confirmation({ receipt }, x.cookie), x.deps);
    expect(confirmed.status).toBe(403); expect((await confirmed.json()).code).toBe('invalid_receipt_signature');
  });
  it('rejects unsigned or malformed receipts and client-supplied confirmed request fields', async () => {
    const x = await issued(), unsigned = { ...x.receipt }; delete unsigned.signature;
    for (const body of [{ receipt: unsigned }, { receipt: { ...x.receipt, signature: 'ab' } }, { receipt: { ...x.receipt, extra: true } },
      { receipt: x.receipt, request: formRequest(BRIEF) }, { receipt: x.receipt, runtimeProvenanceRef: { id: 'forged', revision: 'r1' } }]) {
      expect((await gatewayAssess(confirmation(body, x.cookie), x.deps)).status).toBe(400);
    }
  });
  it('enforces the exact expiry boundary, future-issued receipts and visitor identity', async () => {
    const x = await issued();
    expect((await gatewayAssess(confirmation({ receipt: x.receipt }, x.cookie), { ...x.deps, now: () => issuedAt + RECEIPT_LIFETIME_MS - 1 })).status).toBe(200);
    for (const now of [issuedAt - 1, issuedAt + RECEIPT_LIFETIME_MS, issuedAt + RECEIPT_LIFETIME_MS + 1]) {
      const response = await gatewayAssess(confirmation({ receipt: x.receipt }, x.cookie), { ...x.deps, now: () => now });
      expect(response.status).toBe(409); expect((await response.json()).code).toBe('receipt_expired');
    }
    const other = context();
    const crossed = await gatewayAssess(confirmation({ receipt: x.receipt }, other.cookie), x.deps);
    expect(crossed.status).toBe(403); expect((await crossed.json()).code).toBe('invalid_receipt_signature');
    expect((await gatewayAssess(confirmation({ receipt: x.receipt }, ''), x.deps)).status).toBe(403);
    expect(x.transport).toHaveBeenCalledTimes(1);
  });
  it('rejects withdrawn acceptance and current catalogue drift without dispatching', async () => {
    const x = await issued();
    expect((await gatewayAssess(confirmation({ receipt: x.receipt }, x.cookie), { ...x.deps, accepted: [] })).status).toBe(503);
    for (const snapshot of [{ ...s, digest: '0'.repeat(64) }, { ...s, revision: 'changed' }]) {
      const response = await gatewayAssess(confirmation({ receipt: x.receipt }, x.cookie), { ...x.deps, snapshot });
      expect(response.status).toBe(409); expect((await response.json()).code).toBe('stale_receipt');
    }
    expect(x.transport).toHaveBeenCalledTimes(1);
  });
  it('keeps origin, JSON and bounded-body checks on the confirmation endpoint', async () => {
    const x = await issued();
    expect((await gatewayAssess(confirmation({ receipt: x.receipt }, x.cookie, 'https://attacker.invalid'), x.deps)).status).toBe(403);
    const nonJson = confirmation({ receipt: x.receipt }, x.cookie); nonJson.headers.set('Content-Type', 'text/plain');
    expect((await gatewayAssess(nonJson, x.deps)).status).toBe(415);
    const large = confirmation({ receipt: x.receipt }, x.cookie); large.headers.set('Content-Length', String(MAX_ASSESS_BODY_BYTES + 1));
    expect((await gatewayAssess(large, x.deps)).status).toBe(413);
    expect(x.transport).toHaveBeenCalledTimes(1);
  });
  it('rejects forged AI provenance at the ordinary assessment endpoint while keeping structured mode usable', () => {
    const base = formRequest(BRIEF), ref = { id: 'CF-client-forgery', revision: GATEWAY_REVISION };
    for (const patch of [{ inputMode: 'ai_assisted' }, { runtimeProvenanceRef: ref }, { inputMode: 'ai_assisted', runtimeProvenanceRef: ref }]) {
      const response = handleAssess(JSON.stringify({ request: { ...base, ...patch }, catalogRevision: s.revision }));
      expect(response.status).toBe(403); expect(response.body).toMatchObject({ code: 'unverified_ai_provenance' });
    }
    expect(handleAssess(JSON.stringify({ request: base, catalogRevision: s.revision })).status).toBe(200);
  });
});

describe('bounded provider transport and durable quota', () => {
  const input = { system: 'Public instructions', user: 'Public fire question', schema: {}, schemaName: 'test' };
  function started() { const db = memory(); db.begin('test', 'visitor', 'binding', 2000); return db; }
  it('sends secrets only to the fixed gateway; disables wholesale, logging, caching, redirects and nested retries', async () => {
    const db = started(), transport = vi.fn(async () => ok());
    await gatewayInterpret(c, GATEWAY_ROUTES, input, db, 'test', transport);
    const args = transport.mock.calls[0] as unknown as [string, RequestInit];
    expect(args[0]).toBe(`https://gateway.ai.cloudflare.com/v1/${c.account}/webiste-chatbot/groq/chat/completions`);
    expect(args[1].redirect).toBe('error');
    const h = new Headers(args[1].headers); expect(h.has('authorization')).toBe(false);
    expect(h.get('cf-aig-no-wholesale')).toBe('true'); expect(h.get('cf-aig-collect-log')).toBe('false'); expect(h.get('cf-aig-skip-cache')).toBe('true'); expect(h.get('cf-aig-max-attempts')).toBe('1');
    const body = JSON.parse(args[1].body as string); expect(body.max_completion_tokens).toBe(512); expect(body.messages).toHaveLength(2);
  });
  it('allows at most two attempts on 429/503, respects cooldown, and never silently selects a paid model', async () => {
    const db = started(), transport = vi.fn(async () => Response.json({ error: 'busy' }, { status: 429, headers: { 'Retry-After': '300' } }));
    await expect(gatewayInterpret(c, GATEWAY_ROUTES, input, db, 'test', transport)).rejects.toThrow('no_eligible_free_route');
    expect(transport).toHaveBeenCalledTimes(2); expect(db.canAttempt('cf-groq-oss120', Date.now() + 100_000)).toBe(false);
    const second = (transport.mock.calls[1] as unknown as [string, RequestInit])[1];
    const body = JSON.parse(second.body as string); expect(body.model).toBe('openrouter/free');
    expect(body.provider.max_price).toEqual({ prompt: 0, completion: 0, request: 0 }); expect(body.provider.allow_fallbacks).toBe(false);
  });
  it.each([401, 402, 403])('does not retry HTTP %i and disables the route', async (status) => {
    const db = started(), transport = vi.fn(async () => Response.json({ error: { message: c.token } }, { status }));
    await expect(gatewayInterpret(c, GATEWAY_ROUTES, input, db, 'test', transport)).rejects.toThrow('provider_response_invalid');
    expect(transport).toHaveBeenCalledTimes(1); expect(db.canAttempt('cf-groq-oss120', Date.now() + 86400001)).toBe(false);
  });
  it('handles HTTP-200 wrapped billing errors as a halt, not a successful completion', async () => {
    const db = started();
    await expect(gatewayInterpret(c, GATEWAY_ROUTES, input, db, 'test', async () => Response.json({ error: { code: 402 } }))).rejects.toThrow();
    expect(() => db.begin('another', 'visitor2', 'binding', 10)).toThrow('gateway_halted');
  });
  it('retains an unresolved transport reservation even after successful fallback', async () => {
    const db = started(), transport = vi.fn().mockRejectedValueOnce(new Error('connection reset')).mockResolvedValueOnce(ok());
    const result = await gatewayInterpret(c, GATEWAY_ROUTES, input, db, 'test', transport);
    expect(result.provenance.attempts).toBe(2); db.finish('test', true); expect(db.counts().held).toBe(1);
  });
  it('aborts an attempt at the timeout and keeps its reservation', async () => {
    vi.useFakeTimers(); const db = started();
    const transport = vi.fn((_url: string | URL | Request, options?: RequestInit) => new Promise<Response>((_resolve, reject) => options?.signal?.addEventListener('abort', () => reject(new Error('aborted')))));
    const pending = gatewayInterpret(c, [GATEWAY_ROUTES[0]], input, db, 'test', transport);
    const assertion = expect(pending).rejects.toThrow('no_eligible_free_route');
    await vi.advanceTimersByTimeAsync(L.timeoutMs + 1); await assertion;
    db.finish('test', false); expect(db.counts().held).toBe(1);
  });
  it.each(['length', 'tool_calls', null])('rejects incomplete/unknown finish reason %s without retry', async (finish_reason) => {
    const db = started(), transport = vi.fn(async () => ok(undefined, { choices: [{ finish_reason, message: { content: JSON.stringify(wire()) } }] }));
    await expect(gatewayInterpret(c, GATEWAY_ROUTES, input, db, 'test', transport)).rejects.toThrow(); expect(transport).toHaveBeenCalledTimes(1);
  });
  it('rejects oversized responses and unexpected returned models without retry', async () => {
    for (const response of [new Response('x'.repeat(L.responseBytes + 1)), ok(undefined, { model: 'unapproved-model' })]) {
      const db = started(), transport = vi.fn(async () => response);
      await expect(gatewayInterpret(c, GATEWAY_ROUTES, input, db, 'test', transport)).rejects.toThrow(); expect(transport).toHaveBeenCalledTimes(1);
    }
  });
  it('halts on positive reported cost and on an output-token cap violation', async () => {
    for (const usage of [{ cost: 0.01, completion_tokens: 100 }, { cost: 0, completion_tokens: 513 }]) {
      const db = started();
      await expect(gatewayInterpret(c, [GATEWAY_ROUTES[1]], input, db, 'test', async () => ok(undefined, { usage }))).rejects.toThrow();
      expect(() => db.begin('another', 'v2', 'binding', 10)).toThrow('gateway_halted');
    }
  });
  it('enforces shared concurrency across two SQLite connections and retains holds after reopening', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ignis-gateway-')); directories.push(dir);
    const filename = join(dir, 'quota.sqlite'), a = new GatewayStore(filename), b = new GatewayStore(filename); opened.push(a, b);
    a.begin('a', 'v1', 'binding', 1000); b.begin('b', 'v2', 'binding', 1000);
    expect(() => a.begin('c', 'v3', 'binding', 1000)).toThrow('concurrency_limit');
    const attempt = a.attempt('a', 'cf-groq-oss120'); a.settle(attempt, 'timeout', null, null, null); a.finish('a', false); b.finish('b', true);
    const d = new GatewayStore(filename); opened.push(d); expect(d.counts().held).toBe(1);
    d.begin('c', 'v3', 'binding', 1000); expect(() => b.begin('d', 'v4', 'binding', 1000)).toThrow('concurrency_limit');
  });
  it('enforces per-visitor, global and cumulative token reservations even for failed requests', () => {
    const db = memory(), now = Date.now();
    db.begin('a', 'v', 'binding', 1000, now); db.finish('a', false); db.begin('b', 'v', 'binding', 1000, now); db.finish('b', false);
    expect(() => db.begin('c', 'v', 'binding', 1000, now)).toThrow('visitor_minute_limit');
    for (let i = 0; i < L.globalMinute - 2; i++) { db.begin(`g${i}`, `v${i}`, 'binding', 1, now); db.finish(`g${i}`, false); }
    expect(() => db.begin('global', 'different', 'binding', 1, now)).toThrow('global_minute_limit');
    const other = memory(); other.begin('large', 'one', 'binding', L.reservedTokensDay, now); other.finish('large', true);
    expect(() => other.begin('small', 'two', 'binding', 1, now)).toThrow('token_reservation_limit');
  });
});
