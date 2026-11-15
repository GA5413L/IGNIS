/**
 * Candidate interpretation configurations, frozen before the IE-1 evaluation (MODEL_SELECTION.md §5–6).
 * The user authorized testing OpenRouter, Gemini and Groq on 14 Nov 2026. None of these is accepted for the
 * running app until it passes the IE-1 gate; ACCEPTED_CONFIGURATIONS in runtime.ts stays empty until then.
 * Rates: OpenRouter public model list and Gemini pricing page, both fetched 14 Nov 2026; Groq as recorded 8 Nov.
 */
import type { RuntimeConfig } from './types';

// OpenRouter max_price uses USD per MILLION tokens. Fallbacks remain permitted only within these
// ceilings; they must match the rates reserved by the evaluation runner. No per-request surcharge.
// https://openrouter.ai/docs/guides/routing/provider-selection#max-price (15 Nov 2026)
const openRouterRouting = (prompt: number, completion: number) => ({
  data_collection: 'deny', require_parameters: true, allow_fallbacks: true,
  max_price: { prompt, completion, request: 0 },
});

export const CANDIDATE_CONFIGS: RuntimeConfig[] = [
  {
    id: 'OR-OPUS55-LOW', provider: 'openrouter', model: 'anthropic/claude-opus-5.5', keyEnv: 'OPENROUTER_API_KEY',
    params: { reasoning: { effort: 'low' }, provider: openRouterRouting(4, 20), usage: { include: true } },
    maxOutputTokens: 4000, timeoutMs: 60_000, rates: { inputPerM: 4, outputPerM: 20 },
    note: 'Claude Opus 5.5 through OpenRouter; providers that may store data are excluded; strict JSON schema required.',
  },
  {
    id: 'OR-HAIKU55', provider: 'openrouter', model: 'anthropic/claude-haiku-5.5', keyEnv: 'OPENROUTER_API_KEY',
    params: { provider: openRouterRouting(0.1, 0.5), usage: { include: true } },
    maxOutputTokens: 3000, timeoutMs: 45_000, rates: { inputPerM: 0.1, outputPerM: 0.5 },
    note: 'Claude Haiku 5.5 through OpenRouter; no reasoning parameter sent.',
  },
  {
    id: 'OR-SONNET55-LOW', provider: 'openrouter', model: 'anthropic/claude-sonnet-5.5', keyEnv: 'OPENROUTER_API_KEY',
    params: { reasoning: { effort: 'low' }, provider: openRouterRouting(2, 10), usage: { include: true } },
    maxOutputTokens: 4000, timeoutMs: 60_000, rates: { inputPerM: 2, outputPerM: 10 },
    note: 'Reserve: run only if Opus latency is unacceptable and Haiku fails.',
  },
  {
    id: 'GEM38-LOW', provider: 'gemini', model: 'gemini-3.8-flash', keyEnv: 'GEMINI_API_KEY',
    params: { thinking_level: 'low' },
    maxOutputTokens: 4000, timeoutMs: 60_000, rates: { inputPerM: 0.75, outputPerM: 3.75 },
    note: 'Gemini 3.8 Flash direct (Interactions API, store=false). Key tier unknown: if free tier, prompts may be used by Google.',
  },
  {
    id: 'GROQ-OSS120-LOW', provider: 'groq', model: 'openai/gpt-oss-120b', keyEnv: 'GROQ_API_KEY',
    params: { reasoning_effort: 'low', include_reasoning: false, temperature: 0, service_tier: 'on_demand' },
    maxOutputTokens: 4000, timeoutMs: 45_000, rates: { inputPerM: 0.15, outputPerM: 0.6 },
    note: 'Same model that failed the 8 Nov study under the old contract; retested with the catalogue-bound schema.',
  },
];

export function configById(id: string): RuntimeConfig {
  const c = CANDIDATE_CONFIGS.find((x) => x.id === id);
  if (!c) throw new Error(`unknown configuration ${id}; known: ${CANDIDATE_CONFIGS.map((x) => x.id).join(', ')}`);
  return c;
}
