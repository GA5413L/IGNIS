/**
 * Runtime configuration (master §11.2, §22.4). Default and only state in this build: disabled.
 * Evaluation adapters exist under providers/, but no configuration has passed the current acceptance gate
 * and received user acceptance. Research authorization is not runtime activation. The app returns 503;
 * the separate evaluator requires a designated credential and its cumulative reservation ledger.
 */
export interface RuntimeConfig {
  id: string; revision: string; provider: 'disabled' | 'groq' | 'openrouter' | 'openai' | 'anthropic' | 'gemini' | 'local';
  modelId: string | null; acceptance: 'disabled' | 'research_only' | 'rejected' | 'accepted';
  authorizationId: string | null; usdCap: number; logicalCallCap: number;
}

export interface RuntimeStatus { aiAvailable: boolean; label: string; reason: string; config: RuntimeConfig }

export function readRuntimeConfig(env: Record<string, string | undefined> = process.env): RuntimeConfig {
  const num = (k: string) => { const n = Number(env[k] ?? '0'); return Number.isFinite(n) && n > 0 ? n : 0; };
  return {
    id: 'runtime', revision: env.AI_RUNTIME_CONFIG_REVISION || 'unselected',
    provider: (['groq', 'openrouter', 'openai', 'anthropic', 'gemini', 'local'].includes(env.AI_PROVIDER ?? '') ? env.AI_PROVIDER : 'disabled') as RuntimeConfig['provider'],
    modelId: env.AI_MODEL || null, acceptance: 'disabled', authorizationId: env.AI_AUTHORIZATION_ID || null,
    usdCap: num('AI_USD_CAP'), logicalCallCap: num('AI_LOGICAL_CALL_CAP'),
  };
}

/** No configuration is accepted in this build (D-046, B-11); flags alone never enable a provider. */
export const ACCEPTED_CONFIGURATIONS: readonly string[] = [];

export function runtimeStatus(env: Record<string, string | undefined> = process.env): RuntimeStatus {
  const config = readRuntimeConfig(env);
  const accepted = config.provider !== 'disabled' && ACCEPTED_CONFIGURATIONS.includes(`${config.provider}:${config.modelId}:${config.revision}`);
  const authorized = !!config.authorizationId && config.usdCap > 0 && config.logicalCallCap > 0;
  if (env.AI_ENABLED === 'true' && accepted && authorized) {
    return { aiAvailable: false, label: 'none', config, reason: 'Research adapters are available, but application runtime activation has not been completed.' };
  }
  const reason = env.AI_ENABLED !== 'true' ? 'SI interpretation is awaiting provider setup and evaluation.'
    : !accepted ? 'No configuration is accepted for the current interpretation packet. Earlier Groq configurations failed an earlier gate; new candidates have not completed scored evaluation.'
    : 'No recorded authorization, spending cap and call cap for live inference.';
  return { aiAvailable: false, label: 'none', reason, config: { ...config, acceptance: accepted ? 'accepted' : config.provider === 'disabled' ? 'disabled' : 'rejected' } };
}
