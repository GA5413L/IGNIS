/**
 * Provider adapters, catalogue-bound wire schema and IE-1 scorer. Transport is MOCKED in every test:
 * no network call, no credential. These are application tests, not evidence of model quality.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { catalog } from '../helpers';
import { catalogIdSets, wireJsonSchema, wireToProposal, type WireProposal } from '../../src/core/wireProposal';
import { buildInterpretationMessages } from '../../src/core/interpretation';
import { deriveHandling, validateProposalIds } from '../../src/core/handling';
import { callProvider, type RuntimeConfig, type Transport } from '../../src/server/providers';
import { buildOpenAiCompatibleBody } from '../../src/server/providers/openaiCompatible';
import { buildGeminiBody } from '../../src/server/providers/gemini';
import { CANDIDATE_CONFIGS, configById } from '../../src/server/providers/configs';
import { scoreCase, type Key } from '../../scripts/ie1/score';
import { accountAttempt, budgetStopReason, estimateReservation, INITIAL_LEDGER_HEADER, readBudgetState,
  type BudgetReservation, type BudgetSettlement } from '../../scripts/eval-ie1';

const s = catalog();
const schema = wireJsonSchema(s);
const input = { system: 'SYS', user: '{"question":"q"}', schema, schemaName: 'ignis_interpretation' };

const wire = (over: Partial<WireProposal> = {}): WireProposal => ({
  intent: 'assess_physical_model', safetyAreas: [], investigationIds: ['INV-SAFFIRE-VI'], physicalModelId: 'PM-SVI25', eventIds: [], quantityIds: ['Q-CO2-REMOTE-CONC'],
  endpointIds: [], requestedFeature: 'unspecified', temporalScope: 'unspecified', requestedClaim: 'comparison', constraints: [], explicitExclusions: [], ambiguities: [],
  unknownTerms: [], proposedModelNote: null, requestedExecutionText: null, supportingContextIds: [], ...over,
});

/** Records the request and returns a canned reply. */
function mock(status: number, body: unknown, seen: { url?: string; headers?: Record<string, string>; body?: any } = {}): Transport {
  return async (url, init) => {
    seen.url = url; seen.headers = init.headers; seen.body = JSON.parse(init.body);
    return { status, headers: { get: () => null }, text: async () => (typeof body === 'string' ? body : JSON.stringify(body)) };
  };
}
const chat = (content: string | null, finish = 'stop', extra: Record<string, unknown> = {}) => ({
  id: 'gen-1', model: 'anthropic/claude-haiku-5.5', provider: 'Anthropic',
  choices: [{ finish_reason: finish, message: { content, ...extra } }], usage: { prompt_tokens: 3100, completion_tokens: 420, cost: 0.00052 },
});

function walk(node: unknown, visit: (o: Record<string, unknown>) => void) {
  if (Array.isArray(node)) node.forEach((n) => walk(n, visit));
  else if (node && typeof node === 'object') { visit(node as Record<string, unknown>); Object.values(node).forEach((v) => walk(v, visit)); }
}

describe('catalogue-bound wire schema', () => {
  it('closes every object, requires every property and uses no keyword that providers ignore or reject', () => {
    walk(schema, (o) => {
      if (o.type === 'object') {
        expect(o.additionalProperties).toBe(false);
        expect([...(o.required as string[])].sort()).toEqual(Object.keys(o.properties as object).sort());
      }
      for (const bad of ['minLength', 'maxLength', 'maxItems', 'minItems', 'pattern', 'minimum', 'maximum', '$ref']) expect(o).not.toHaveProperty(bad);
    });
  });

  it('offers exactly the live catalogue IDs of each kind as enums', () => {
    const ids = catalogIdSets(s);
    const props = (schema as any).properties;
    expect(props.investigationIds.items.enum).toEqual(ids.investigations);
    expect(props.physicalModelId.anyOf[0].enum).toEqual(['PM-SV24', 'PM-SVI25']);
    expect(props.quantityIds.items.enum).toContain('Q-FLAME-SPREAD-RATE');
    expect(props.quantityIds.items.enum).not.toContain('PH-HEAT');
    expect(props.endpointIds.items.enum).toEqual(['EP-COMPLETE-EXTINCTION', 'EP-VISIBLE-FLAME-LOSS']);
  });

  it('preserves a valid numeric wire constraint while requiring clarification for unsupported filtering', () => {
    const r = wireToProposal(wire({ constraints: [{ fieldId: 'PH-OXYGEN', valueText: '30', unit: '%', rawSpan: 'about 30% oxygen', hypothetical: true }] }));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(validateProposalIds(r.proposal, s)).toEqual([]);
    expect(r.proposal.constraints[0].value).toMatchObject({ state: 'known', value: '30', unit: '%', evidence: [] });
    expect(r.proposal.constraints[0].provenance).toBe('proposed_interpretation');
    expect(deriveHandling(r.proposal)).toMatchObject({ handling: 'clarification_needed', missingRoutingFields: ['constraints'] });
    const unconstrained = wireToProposal(wire());
    expect(unconstrained.ok && deriveHandling(unconstrained.proposal).handling).toBe('ready');
  });

  it('rejects unknown keys and verdict fields instead of coercing them', () => {
    const r = wireToProposal({ ...wire(), verdict: 'validated' });
    expect(r.ok).toBe(false);
    expect(wireToProposal({ ...wire(), intent: 'run_simulation' }).ok).toBe(false);
  });

  it('still catches invented IDs and constraint fields locally (enum casing is not guaranteed by providers)', () => {
    const r = wireToProposal(wire({ physicalModelId: 'PM-SVI26', constraints: [{ fieldId: 'Q-INVENTED', valueText: '1', unit: null, rawSpan: null, hypothetical: false }] }));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const problems = validateProposalIds(r.proposal, s);
    expect(problems).toContain('unknown physical model PM-SVI26');
    expect(problems.some((p) => p.includes('unknown field Q-INVENTED'))).toBe(true);
  });

  it('sends the provider only instructions, the public catalogue and the question; never test questions or keys', () => {
    const q = JSON.parse(readFileSync(join(__dirname, '../../eval/ie1/questions.json'), 'utf8')).questions as { question: string }[];
    const m = buildInterpretationMessages(s, 'Show me FLEX.', ['INV-FLEX']);
    expect(JSON.parse(m.user)).toEqual({ question: 'Show me FLEX.', explicitlySelectedIds: ['INV-FLEX'] });
    for (const x of q) expect(m.system).not.toContain(x.question);
    expect(m.system).not.toMatch(/\bF\d{2}\b|rationale|criticalErrors/);
    expect(m.system).toContain('event EV-SVI-5: S-VI event 5 (investigation INV-SAFFIRE-VI; material=SIBAL fabric');
  });
});

describe('OpenAI-compatible adapter (OpenRouter, Groq) with mocked transport', () => {
  const or = configById('OR-HAIKU55');
  const groq = configById('GROQ-OSS120-LOW');

  it('sends strict JSON-schema output, routing preferences and the key only in the Authorization header', async () => {
    const seen: any = {};
    const r = await callProvider(or, input, 'k-test', mock(200, chat(JSON.stringify(wire())), seen));
    expect(seen.url).toBe('https://openrouter.ai/api/v1/chat/completions');
    expect(seen.headers.Authorization).toBe('Bearer k-test');
    expect(seen.body.response_format).toEqual({ type: 'json_schema', json_schema: { name: 'ignis_interpretation', strict: true, schema } });
    expect(seen.body.provider).toEqual({ data_collection: 'deny', require_parameters: true, allow_fallbacks: true,
      max_price: { prompt: 0.1, completion: 0.5, request: 0 } });
    expect(seen.body.max_tokens).toBe(3000);
    expect(seen.body).not.toHaveProperty('temperature');
    expect(JSON.stringify(seen.body)).not.toContain('k-test');
    expect(r).toMatchObject({ ok: true, failure: null, httpStatus: 200, stopReason: 'stop', modelReturned: 'anthropic/claude-haiku-5.5' });
    expect(r.usage).toMatchObject({ inputTokens: 3100, outputTokens: 420, reportedCostUsd: 0.00052 });
    expect(wireToProposal(r.json).ok).toBe(true);
  });

  it('uses max_completion_tokens for Groq', () => {
    const b = buildOpenAiCompatibleBody(groq, input);
    expect(b.max_completion_tokens).toBe(4000);
    expect(b).not.toHaveProperty('max_tokens');
    expect(b.reasoning_effort).toBe('low');
  });

  it('treats truncation, refusal, empty, non-JSON and error bodies as failures that are never parsed', async () => {
    expect((await callProvider(or, input, 'k', mock(200, chat('{"intent":', 'length')))).failure).toBe('truncated');
    expect((await callProvider(or, input, 'k', mock(200, chat(null, 'stop', { refusal: 'I cannot help' })))).failure).toBe('refusal');
    expect((await callProvider(or, input, 'k', mock(200, chat(null, 'content_filter')))).failure).toBe('refusal');
    expect((await callProvider(or, input, 'k', mock(200, chat('   ')))).failure).toBe('empty');
    expect((await callProvider(or, input, 'k', mock(200, chat('not json')))).failure).toBe('not_json');
    const upstream = await callProvider(or, input, 'k', mock(200, { error: { code: 502, message: 'upstream' } }));
    expect(upstream).toMatchObject({ ok: false, failure: 'http', retryable: true });
  });

  it('allows one retry only for 429/5xx, not for 400', async () => {
    expect(await callProvider(or, input, 'k', mock(429, { error: { message: 'rate' } }))).toMatchObject({ failure: 'http', retryable: true });
    expect(await callProvider(or, input, 'k', mock(503, 'Service Unavailable'))).toMatchObject({ failure: 'http', retryable: true });
    expect(await callProvider(or, input, 'k', mock(400, { error: { message: 'bad schema' } }))).toMatchObject({ failure: 'http', retryable: false });
    expect(await callProvider(or, input, 'k', mock(200, { error: { code: 401, message: 'unauthorized' } }))).toMatchObject({ failure: 'http', retryable: false });
    expect(await callProvider(or, input, 'k', mock(200, { error: { message: 'unknown error' } }))).toMatchObject({ failure: 'http', retryable: false });
  });

  it('preserves billable usage and request identity on non-200 failures', async () => {
    const r = await callProvider(or, input, 'k', mock(502, { id: 'failed-billable', error: { code: 502 },
      usage: { prompt_tokens: 3100, completion_tokens: 420, cost: 0.003 } }));
    expect(r).toMatchObject({ ok: false, retryable: true, requestId: 'failed-billable',
      usage: { inputTokens: 3100, outputTokens: 420, reportedCostUsd: 0.003 } });
  });

  it('does not accept negative usage as a budget credit or scalar JSON as an API response', async () => {
    const r = await callProvider(or, input, 'k', mock(200, { ...chat('{}'), usage: { prompt_tokens: -1, completion_tokens: -3, cost: -0.2 } }));
    expect(r.usage).toMatchObject({ inputTokens: null, outputTokens: null, reportedCostUsd: null });
    expect(await callProvider(or, input, 'k', mock(200, 'null'))).toMatchObject({ ok: false, failure: 'http', retryable: false });
    expect(await callProvider(or, input, 'k', mock(200, '5'))).toMatchObject({ ok: false, failure: 'http', retryable: false });
  });

  it('times out with an abort and reports a retryable timeout', async () => {
    const slow: Transport = (_u, init) => new Promise((_res, rej) => init.signal.addEventListener('abort', () => rej(new Error('aborted'))));
    const r = await callProvider({ ...or, timeoutMs: 20 }, input, 'k', slow);
    expect(r).toMatchObject({ ok: false, failure: 'timeout', retryable: true });
  });
});

describe('D051/D054 cumulative evaluation accounting (pure helpers and mocked transport)', () => {
  const cfg = configById('OR-OPUS55-LOW');
  const reserve = (id: string, usd = 0.2, probe = false): BudgetReservation => ({
    type: 'reserve', attemptId: id, runId: 'mock-run', configId: cfg.id, probe, reservedUsd: usd,
    inputTokensReserved: 5000, outputTokensReserved: 4000, createdAtUtc: '2026-11-15T00:00:00Z',
  });
  const settled = (id: string, actual = 0.1): BudgetSettlement => ({
    type: 'settle', attemptId: id, accountedUsd: actual, actualCostUsd: actual, basis: 'reported_usage_cost',
    unexpectedBilling: false, httpStatus: 200, failure: null, latencyMs: 50, createdAtUtc: '2026-11-15T00:00:01Z',
  });

  it('keeps both historical three-probe allowances consumed and rejects a new cap or configuration identity', () => {
    const state = readBudgetState([INITIAL_LEDGER_HEADER]);
    expect(state.probesByConfig['OR-HAIKU55']).toBe(3);
    expect(state.probesByConfig['GEM38-LOW']).toBe(3);
    expect(state.accountedUsd).toBe(0);
    expect(budgetStopReason(state, 'OR-HAIKU55', true, 0, 0.1, 1)).toContain('exhausted');
    expect(budgetStopReason(state, 'GEM38-LOW', true, 0, 0.1, 1)).toContain('exhausted');
    expect(budgetStopReason(state, cfg.id, false, 0, 0.1, 6)).toContain('$5');
    expect(() => budgetStopReason(state, 'OR-HAIKU55-NEW', true, 0, 0.1, 1)).toThrow('unknown configuration');
    expect(() => readBudgetState([{ ...INITIAL_LEDGER_HEADER, legacyHistorySha256: 'reset' }])).toThrow('history');
  });

  it('uses one combined budget across configurations and independently applies the invocation cap', () => {
    const state = readBudgetState([INITIAL_LEDGER_HEADER, reserve('prior', 4.9), settled('prior', 4.9)]);
    expect(budgetStopReason(state, 'GROQ-OSS120-LOW', false, 0, 0.2, 5)).toContain('cumulative');
    expect(budgetStopReason(state, 'GROQ-OSS120-LOW', false, 0, 0.1, 5)).toBeNull();
    expect(budgetStopReason(readBudgetState([INITIAL_LEDGER_HEADER]), cfg.id, false, 0.19, 0.02, 0.2)).toContain('--cap');
  });

  it('holds an interrupted attempt and rejects duplicate, orphan or malformed accounting records', () => {
    const state = readBudgetState([INITIAL_LEDGER_HEADER, reserve('interrupted')]);
    expect(state).toMatchObject({ accountedUsd: 0.2, heldUsd: 0.2, pendingAttempts: 1 });
    expect(budgetStopReason(state, cfg.id, false, 0, 0.2, 5)).toContain('interrupted');
    expect(() => readBudgetState([INITIAL_LEDGER_HEADER, reserve('same'), reserve('same')])).toThrow('duplicate');
    expect(() => readBudgetState([INITIAL_LEDGER_HEADER, settled('orphan')])).toThrow('unsettled');
    expect(() => readBudgetState([INITIAL_LEDGER_HEADER, { ...reserve('negative'), reservedUsd: -1 }])).toThrow();
  });

  it('retains unknown failed-request cost and then adds the retry cost instead of replacing it', async () => {
    const failed = await callProvider(cfg, input, 'mock', mock(503, { error: { code: 503 } }));
    const a = accountAttempt(failed, cfg, reserve('first'));
    expect(a).toMatchObject({ actualCostUsd: null, accountedUsd: 0.2, basis: 'reservation_usage_unknown' });
    const state = readBudgetState([INITIAL_LEDGER_HEADER, reserve('first', 0.2, true),
      { ...settled('first'), ...a }, reserve('retry', 0.2, true), settled('retry')]);
    expect(state).toMatchObject({ accountedUsd: 0.3, heldUsd: 0.2, pendingAttempts: 0 });
    expect(state.probesByConfig[cfg.id]).toBe(2);
    const complete = [...[INITIAL_LEDGER_HEADER, reserve('first', 0.2, true), { ...settled('first'), ...a },
      reserve('retry', 0.2, true), settled('retry')], reserve('third', 0.2, true), settled('third')];
    expect(budgetStopReason(readBudgetState(complete), cfg.id, true, 0, 0.2, 5)).toContain('exhausted');
    expect(() => readBudgetState([...complete, reserve('fourth', 0.2, true)])).toThrow('probe');
  });

  it('accounts for billable failures and blocks further attempts after unexpected billing', async () => {
    const response = await callProvider(cfg, input, 'mock', mock(502, { error: { code: 502 }, usage: { cost: 0.25 } }));
    const a = accountAttempt(response, cfg, reserve('costly'));
    expect(a).toMatchObject({ actualCostUsd: 0.25, accountedUsd: 0.25, unexpectedBilling: true });
    const state = readBudgetState([INITIAL_LEDGER_HEADER, reserve('costly'), { ...settled('costly'), ...a }]);
    expect(state.accountedUsd).toBe(0.25);
    expect(budgetStopReason(state, cfg.id, false, 0, 0.2, 5)).toContain('unexpected billing');
  });

  it('reserves UTF-8 request bytes and output allowance without cache discounts, guarded by matching prices', () => {
    for (const candidate of CANDIDATE_CONFIGS.filter((c) => c.provider === 'openrouter')) {
      expect((candidate.params.provider as any).max_price).toEqual({ prompt: candidate.rates.inputPerM, completion: candidate.rates.outputPerM, request: 0 });
      const r = estimateReservation(candidate, input);
      expect(r.inputTokensReserved).toBeGreaterThan(Buffer.byteLength(input.system + input.user + JSON.stringify(input.schema), 'utf8'));
      expect(r.outputTokensReserved).toBe(candidate.maxOutputTokens);
    }
    const unicode = estimateReservation(cfg, { ...input, user: '🔥'.repeat(10) });
    const ascii = estimateReservation(cfg, { ...input, user: 'a'.repeat(10) });
    expect(unicode.inputTokensReserved).toBeGreaterThan(ascii.inputTokensReserved);
    expect(() => estimateReservation({ ...cfg, params: { ...cfg.params, provider: { allow_fallbacks: true } } }, input)).toThrow('price guard');
  });
});

describe('Gemini Interactions adapter with mocked transport', () => {
  const gem = configById('GEM38-LOW');
  const reply = (status: string, text: string) => ({
    id: 'int-1', model: 'gemini-3.8-flash', status, steps: [{ type: 'thought' }, { type: 'model_output', content: [{ type: 'text', text }] }],
    usage: { total_input_tokens: 3000, total_output_tokens: 400, total_thought_tokens: 250, total_cached_tokens: 0 },
  });

  it('sends system instruction, JSON response format, thinking level and store=false with the key in x-goog-api-key', async () => {
    const seen: any = {};
    const r = await callProvider(gem, input, 'g-key', mock(200, reply('completed', JSON.stringify(wire())), seen));
    expect(seen.url).toBe('https://generativelanguage.googleapis.com/v1beta/interactions');
    expect(seen.headers['x-goog-api-key']).toBe('g-key');
    expect(seen.body).toEqual(buildGeminiBody(gem, input));
    expect(seen.body).toMatchObject({ model: 'gemini-3.8-flash', input: input.user, system_instruction: 'SYS', store: false,
      generation_config: { thinking_level: 'low', max_output_tokens: 4000 }, response_format: { type: 'text', mime_type: 'application/json', schema } });
    expect(r.ok).toBe(true);
    expect(r.usage).toMatchObject({ inputTokens: 3000, outputTokens: 650, reasoningTokens: 250 });
  });

  it('fails on any status other than completed', async () => {
    expect((await callProvider(gem, input, 'k', mock(200, reply('incomplete', '{"a":')))).failure).toBe('truncated');
    expect((await callProvider(gem, input, 'k', mock(200, reply('failed', '')))).failure).toBe('incomplete');
  });
});

describe('IE-1 scorer and frozen test files', () => {
  const keys = new Map((JSON.parse(readFileSync(join(__dirname, '../../eval/ie1/keys.json'), 'utf8')).keys as Key[]).map((k) => [k.id, k]));
  const score = (id: string, w: WireProposal) => {
    const r = wireToProposal(w); if (!r.ok) throw new Error(r.problems.join('; '));
    return scoreCase(r.proposal, deriveHandling(r.proposal), keys.get(id)!);
  };

  it('has a key for every question and every key ID is in the catalogue', () => {
    const q = JSON.parse(readFileSync(join(__dirname, '../../eval/ie1/questions.json'), 'utf8')).questions as { id: string; selectedIds: string[] }[];
    expect(q.length).toBe(30);
    expect(q.filter((x) => x.id.startsWith('F')).length).toBe(24);
    for (const x of q) expect(keys.has(x.id)).toBe(true);
    const known = new Set([...s.investigations, ...s.models, ...s.events, ...s.entities].map((x) => x.id));
    for (const k of keys.values()) {
      const ids = [k.physicalModelId, ...['investigationIds', 'eventIds', 'quantityIds', 'endpointIds'].flatMap((f) => { const c = (k as any)[f]; return c ? [...(c.exact ?? []), ...(c.include ?? []), ...(c.exclude ?? [])] : []; })];
      ids.filter((x): x is string => typeof x === 'string').forEach((id) => expect(known.has(id), `${k.id}: ${id}`).toBe(true));
    }
    for (const x of q) x.selectedIds.forEach((id) => expect(known.has(id)).toBe(true));
  });

  it('passes a faithful F04 proposal and flags an assumed heat quantity as critical', () => {
    const faithful = wire({ quantityIds: [], requestedClaim: 'comparison', ambiguities: [{ field: 'quantityIds', question: 'Chemical heat release or sensible cabin heat?', alternativeIds: ['Q-HEAT-CHEMICAL-RELEASE', 'Q-HEAT-SENSIBLE-CABIN'] }] });
    expect(score('F04', faithful).correct).toBe(true);
    const assumed = score('F04', wire({ quantityIds: ['Q-HEAT-CHEMICAL-RELEASE'] }));
    expect(assumed.correct).toBe(false);
    expect(assumed.criticalErrors).toContain('quantity assumed: Q-HEAT-CHEMICAL-RELEASE');
  });

  it('marks obeying the quoted instruction (F24) and choosing one campaign unasked (F23) as critical', () => {
    expect(score('F24', wire({ requestedClaim: 'independent_prediction', explicitExclusions: ['chemical calorimetry'] })).criticalErrors).toContain('forbidden claim: independent_prediction');
    const f23 = score('F23', wire({ intent: 'browse_investigations', physicalModelId: null, quantityIds: [], investigationIds: ['INV-SAFFIRE-VI'] }));
    expect(f23.criticalErrors).toContain('chose INV-SAFFIRE-VI without asking');
  });

  it('keeps every candidate configuration out of the running app until it passes', async () => {
    const { runtimeStatus } = await import('../../src/server/runtime');
    expect(runtimeStatus().aiAvailable).toBe(false);
    expect(CANDIDATE_CONFIGS.every((c: RuntimeConfig) => c.rates.inputPerM > 0 && c.rates.outputPerM > 0)).toBe(true);
  });
});
