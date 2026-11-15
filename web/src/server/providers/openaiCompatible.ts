/**
 * OpenAI-compatible chat-completions adapter for OpenRouter and Groq (strict JSON-schema output).
 * Request shape per OpenRouter structured-outputs and provider-routing docs and Groq structured-outputs docs,
 * read 14 Nov 2026. A refusal, truncation, empty or non-JSON reply is a failure, never parsed as success.
 */
import { emptyUsage, RETRYABLE_STATUS, type ProviderCallInput, type ProviderCallResult, type RuntimeConfig, type Transport } from './types';

export const ENDPOINTS = {
  openrouter: 'https://openrouter.ai/api/v1/chat/completions',
  groq: 'https://api.groq.com/openai/v1/chat/completions',
} as const;

export function buildOpenAiCompatibleBody(cfg: RuntimeConfig, input: ProviderCallInput): Record<string, unknown> {
  const body: Record<string, unknown> = {
    model: cfg.model,
    messages: [{ role: 'system', content: input.system }, { role: 'user', content: input.user }],
    response_format: { type: 'json_schema', json_schema: { name: input.schemaName, strict: true, schema: input.schema } },
    stream: false,
    ...cfg.params,
  };
  if (cfg.provider === 'groq') body.max_completion_tokens = cfg.maxOutputTokens;
  else body.max_tokens = cfg.maxOutputTokens;
  return body;
}

const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null);

export async function callOpenAiCompatible(cfg: RuntimeConfig, input: ProviderCallInput, apiKey: string, transport: Transport): Promise<ProviderCallResult> {
  if (cfg.provider !== 'openrouter' && cfg.provider !== 'groq') throw new Error(`not an OpenAI-compatible provider: ${cfg.provider}`);
  const base: ProviderCallResult = {
    ok: false, failure: null, retryable: false, httpStatus: null, json: null, text: null, modelReturned: null, providerReturned: null,
    stopReason: null, usage: emptyUsage(), latencyMs: 0, requestId: null, errorText: null,
  };
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` };
  if (cfg.provider === 'openrouter') headers['X-Title'] = 'IGNIS evaluation';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), cfg.timeoutMs);
  const t0 = performance.now();
  let status = 0; let bodyText = '';
  try {
    const res = await transport(ENDPOINTS[cfg.provider], { method: 'POST', headers, body: JSON.stringify(buildOpenAiCompatibleBody(cfg, input)), signal: controller.signal });
    status = res.status; bodyText = await res.text();
    base.requestId = res.headers.get('x-request-id') ?? res.headers.get('x-groq-id') ?? null;
  } catch (e) {
    clearTimeout(timer);
    const aborted = controller.signal.aborted;
    return { ...base, failure: aborted ? 'timeout' : 'transport', retryable: true, latencyMs: performance.now() - t0, errorText: aborted ? 'timeout' : String((e as Error).message ?? e).slice(0, 300) };
  }
  clearTimeout(timer);
  base.latencyMs = performance.now() - t0; base.httpStatus = status;
  let parsed: Record<string, unknown> | null = null;
  try {
    const candidate: unknown = JSON.parse(bodyText);
    parsed = candidate && typeof candidate === 'object' && !Array.isArray(candidate) ? candidate as Record<string, unknown> : null;
  } catch { parsed = null; }
  // Failed requests can still carry billable usage. Preserve it before classifying HTTP failures.
  const usage = (parsed?.usage ?? {}) as Record<string, unknown>;
  const details = (usage.completion_tokens_details ?? {}) as Record<string, unknown>;
  const promptDetails = (usage.prompt_tokens_details ?? {}) as Record<string, unknown>;
  base.usage = {
    inputTokens: num(usage.prompt_tokens), outputTokens: num(usage.completion_tokens), reasoningTokens: num(details.reasoning_tokens),
    cachedTokens: num(promptDetails.cached_tokens), reportedCostUsd: cfg.provider === 'openrouter' ? num(usage.cost) : null,
  };
  base.modelReturned = typeof parsed?.model === 'string' ? parsed.model : null;
  base.providerReturned = typeof parsed?.provider === 'string' ? parsed.provider : cfg.provider;
  base.requestId = base.requestId ?? (typeof parsed?.id === 'string' ? parsed.id : null);
  if (status !== 200 || !parsed) {
    const err = parsed && typeof parsed.error === 'object' && parsed.error ? JSON.stringify(parsed.error).slice(0, 500) : bodyText.slice(0, 500);
    return { ...base, failure: 'http', retryable: RETRYABLE_STATUS.has(status), errorText: err };
  }
  // OpenRouter can return HTTP 200 with an error object (e.g. upstream failure).
  if (parsed.error) {
    const code = typeof parsed.error === 'object' ? Number((parsed.error as Record<string, unknown>).code) : NaN;
    return { ...base, failure: 'http', retryable: RETRYABLE_STATUS.has(code), errorText: JSON.stringify(parsed.error).slice(0, 500) };
  }
  const choice = Array.isArray(parsed.choices) ? (parsed.choices[0] as Record<string, unknown> | undefined) : undefined;
  const message = (choice?.message ?? {}) as Record<string, unknown>;
  base.stopReason = typeof choice?.finish_reason === 'string' ? choice.finish_reason : null;
  const content = typeof message.content === 'string' ? message.content : null;
  base.text = content;
  if (typeof message.refusal === 'string' && message.refusal) return { ...base, failure: 'refusal', errorText: message.refusal.slice(0, 300) };
  if (base.stopReason === 'content_filter' || base.stopReason === 'refusal') return { ...base, failure: 'refusal' };
  if (base.stopReason === 'length') return { ...base, failure: 'truncated' };
  if (!content || !content.trim()) return { ...base, failure: 'empty' };
  try { base.json = JSON.parse(content); } catch { return { ...base, failure: 'not_json' }; }
  return { ...base, ok: true };
}
