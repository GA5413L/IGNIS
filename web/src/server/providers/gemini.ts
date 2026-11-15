/**
 * Gemini Developer API adapter (Interactions API, structured JSON output).
 * Shape per the Interactions API reference saved 8 Nov (`_raw/runtime_ai_2026-11-08/google_api.source`) and
 * the structured-output guide read 14 Nov 2026: POST /v1beta/interactions with `x-goog-api-key`, `model`,
 * `input`, `system_instruction`, `generation_config{thinking_level,max_output_tokens}`,
 * `response_format{type:text,mime_type:application/json,schema}` and `store:false`. The reply's text is in the
 * final `model_output` step; usage is `total_input_tokens`/`total_output_tokens`/`total_thought_tokens`.
 * Any status other than `completed` is a failure.
 */
import { emptyUsage, RETRYABLE_STATUS, type ProviderCallInput, type ProviderCallResult, type RuntimeConfig, type Transport } from './types';

export const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/interactions';

export function buildGeminiBody(cfg: RuntimeConfig, input: ProviderCallInput): Record<string, unknown> {
  const { thinking_level, ...rest } = cfg.params as { thinking_level?: string };
  return {
    model: cfg.model,
    input: input.user,
    system_instruction: input.system,
    generation_config: { ...(thinking_level ? { thinking_level } : {}), max_output_tokens: cfg.maxOutputTokens },
    response_format: { type: 'text', mime_type: 'application/json', schema: input.schema },
    store: false,
    ...rest,
  };
}

const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);

export async function callGemini(cfg: RuntimeConfig, input: ProviderCallInput, apiKey: string, transport: Transport): Promise<ProviderCallResult> {
  if (cfg.provider !== 'gemini') throw new Error(`not a Gemini config: ${cfg.provider}`);
  const base: ProviderCallResult = {
    ok: false, failure: null, retryable: false, httpStatus: null, json: null, text: null, modelReturned: null, providerReturned: 'gemini',
    stopReason: null, usage: emptyUsage(), latencyMs: 0, requestId: null, errorText: null,
  };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), cfg.timeoutMs);
  const t0 = performance.now();
  let status = 0; let bodyText = '';
  try {
    const res = await transport(GEMINI_ENDPOINT, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify(buildGeminiBody(cfg, input)), signal: controller.signal,
    });
    status = res.status; bodyText = await res.text();
  } catch (e) {
    clearTimeout(timer);
    const aborted = controller.signal.aborted;
    return { ...base, failure: aborted ? 'timeout' : 'transport', retryable: true, latencyMs: performance.now() - t0, errorText: aborted ? 'timeout' : String((e as Error).message ?? e).slice(0, 300) };
  }
  clearTimeout(timer);
  base.latencyMs = performance.now() - t0; base.httpStatus = status;
  let parsed: Record<string, unknown> | null = null;
  try { parsed = JSON.parse(bodyText) as Record<string, unknown>; } catch { parsed = null; }
  if (status !== 200 || !parsed) return { ...base, failure: 'http', retryable: RETRYABLE_STATUS.has(status), errorText: bodyText.slice(0, 500) };
  const usage = (parsed.usage ?? {}) as Record<string, unknown>;
  const out = num(usage.total_output_tokens); const thought = num(usage.total_thought_tokens);
  base.usage = {
    inputTokens: num(usage.total_input_tokens), outputTokens: out === null ? null : out + (thought ?? 0), reasoningTokens: thought,
    cachedTokens: num(usage.total_cached_tokens), reportedCostUsd: null,
  };
  base.modelReturned = typeof parsed.model === 'string' ? parsed.model : null;
  base.requestId = typeof parsed.id === 'string' ? parsed.id : null;
  base.stopReason = typeof parsed.status === 'string' ? parsed.status : null;
  if (base.stopReason !== 'completed') return { ...base, failure: base.stopReason === 'incomplete' ? 'truncated' : 'incomplete' };
  const steps = Array.isArray(parsed.steps) ? (parsed.steps as Record<string, unknown>[]) : [];
  const outputs = steps.filter((st) => st.type === 'model_output');
  const last = outputs[outputs.length - 1];
  const parts = last && Array.isArray(last.content) ? (last.content as Record<string, unknown>[]) : [];
  const text = parts.filter((c) => c.type === 'text' && typeof c.text === 'string').map((c) => c.text as string).join('');
  base.text = text || null;
  if (!text.trim()) return { ...base, failure: 'empty' };
  try { base.json = JSON.parse(text); } catch { return { ...base, failure: 'not_json' }; }
  return { ...base, ok: true };
}
