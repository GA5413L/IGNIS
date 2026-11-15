/**
 * Provider-neutral interpretation call types. Transport is injected so tests and dry runs use a mock;
 * nothing here reads a credential or makes a call by itself.
 */
export type ProviderKind = 'openrouter' | 'groq' | 'gemini';

export interface RuntimeConfig {
  /** Stable configuration ID recorded with every call (e.g. OR-OPUS55-LOW). */
  id: string;
  provider: ProviderKind;
  model: string;
  /** Environment variable that must hold the credential. The value is never logged. */
  keyEnv: string;
  /** Extra provider parameters, frozen with the configuration. */
  params: Record<string, unknown>;
  maxOutputTokens: number;
  timeoutMs: number;
  /** USD per million tokens, checked 14 Nov 2026 (MODEL_SELECTION.md §2); used for reservations. */
  rates: { inputPerM: number; outputPerM: number };
  note: string;
}

export interface ProviderCallInput { system: string; user: string; schema: Record<string, unknown>; schemaName: string }

export type CallFailure = 'transport' | 'timeout' | 'http' | 'refusal' | 'truncated' | 'incomplete' | 'empty' | 'not_json';

export interface ProviderUsage {
  inputTokens: number | null; outputTokens: number | null; reasoningTokens: number | null; cachedTokens: number | null;
  /** Cost reported by the provider (OpenRouter), else null. */
  reportedCostUsd: number | null;
}

export interface ProviderCallResult {
  ok: boolean;
  failure: CallFailure | null;
  /** True when one retry is allowed (transport, timeout, HTTP 429/500/502/503/504). Semantic failures never retry. */
  retryable: boolean;
  httpStatus: number | null;
  /** Parsed JSON object from the model, or null. Still unvalidated: the caller runs wireToProposal. */
  json: unknown;
  text: string | null;
  modelReturned: string | null;
  providerReturned: string | null;
  stopReason: string | null;
  usage: ProviderUsage;
  latencyMs: number;
  requestId: string | null;
  errorText: string | null;
}

export interface TransportResponse { status: number; headers: { get(name: string): string | null }; text(): Promise<string> }
export type Transport = (url: string, init: { method: 'POST'; headers: Record<string, string>; body: string; signal: AbortSignal }) => Promise<TransportResponse>;

export const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

export function emptyUsage(): ProviderUsage {
  return { inputTokens: null, outputTokens: null, reasoningTokens: null, cachedTokens: null, reportedCostUsd: null };
}

/** Cost from usage at the frozen rates; reasoning tokens are billed as output by every candidate provider. */
export function usageCostUsd(u: ProviderUsage, cfg: RuntimeConfig): number | null {
  if (u.reportedCostUsd !== null) return u.reportedCostUsd;
  if (u.inputTokens === null || u.outputTokens === null) return null;
  return (u.inputTokens * cfg.rates.inputPerM + u.outputTokens * cfg.rates.outputPerM) / 1e6;
}
