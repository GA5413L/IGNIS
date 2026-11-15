import { callOpenAiCompatible } from '../providers/openaiCompatible';
import type { ProviderCallInput, ProviderCallResult, RuntimeConfig, TransportResponse } from '../providers/types';
import { GATEWAY_LIMITS as LIMIT, GATEWAY_ROUTES, type GatewayConfig, type GatewayRoute } from './policy';
import { GatewayStore } from './store';

export type GatewayFetch = typeof fetch;
export class GatewayError extends Error {
  constructor(public code: string, public status = 503) { super(code); }
}

function retryAfter(value: string | null): number {
  if (!value) return 0;
  const seconds = Number(value);
  const delay = Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000 : Date.parse(value) - Date.now();
  return Number.isFinite(delay) ? Math.max(0, Math.min(86400000, delay)) : 0;
}
async function boundedBody(response: Response): Promise<string> {
  if (!response.body) return '';
  const reader = response.body.getReader(), parts: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.length;
      if (size > LIMIT.responseBytes) { await reader.cancel(); throw new GatewayError('upstream_response_too_large', 502); }
      parts.push(next.value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) { bytes.set(part, offset); offset += part.length; }
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export function routeConfig(route: GatewayRoute): RuntimeConfig {
  return { id: route.id, provider: route.provider, model: route.model, keyEnv: 'CF_AI_GATEWAY_TOKEN', maxOutputTokens: LIMIT.outputTokens, timeoutMs: LIMIT.timeoutMs,
    rates: { inputPerM: 0, outputPerM: 0 }, note: 'Only eligible after verified free account controls and acceptance.',
    params: route.provider === 'groq' ? { reasoning_effort: 'low', include_reasoning: false, temperature: 0 }
      : { provider: { require_parameters: true, allow_fallbacks: false, data_collection: 'deny', max_price: { prompt: 0, completion: 0, request: 0 } }, usage: { include: true } } };
}

export async function gatewayInterpret(c: GatewayConfig, routes: readonly GatewayRoute[], input: ProviderCallInput,
  store: GatewayStore, interactionId: string, transport: GatewayFetch = fetch, callerSignal?: AbortSignal,
  observeAttempt?: (result: ProviderCallResult) => void) {
  let attempts = 0;
  const started = performance.now();
  for (const route of routes) {
    if (!GATEWAY_ROUTES.some((r) => r.id === route.id && r.model === route.model && r.path === route.path && r.provider === route.provider)) throw new GatewayError('route_not_allowed');
    if (attempts >= LIMIT.attempts) break;
    if (callerSignal?.aborted) throw new GatewayError('request_cancelled', 499);
    if (!store.canAttempt(route.id)) continue;
    const attemptId = store.attempt(interactionId, route.id);
    attempts++;
    let delay = 0, responseTooLarge = false, effectiveStatus: number | null = null;
    const cfg = routeConfig(route);
    const result: ProviderCallResult = await callOpenAiCompatible(cfg, input, 'unused-by-gateway-transport', async (_url, init): Promise<TransportResponse> => {
      const url = `https://gateway.ai.cloudflare.com/v1/${c.account}/${c.gateway}/${route.path}`;
      // Never forward the direct-provider Authorization header. Only this fixed Cloudflare host receives the token.
      const signal = callerSignal ? AbortSignal.any([init.signal, callerSignal]) : init.signal;
      const response = await transport(url, { method: 'POST', redirect: 'error', cache: 'no-store', signal, body: init.body,
        headers: { 'Content-Type': 'application/json', 'cf-aig-authorization': `Bearer ${c.token}`,
          'cf-aig-byok-alias': 'default', 'cf-aig-no-wholesale': 'true', 'cf-aig-skip-cache': 'true',
          'cf-aig-collect-log': 'false', 'cf-aig-collect-log-payload': 'false', 'cf-aig-max-attempts': '1',
          'cf-aig-request-timeout': String(LIMIT.timeoutMs - 1000) } });
      delay = retryAfter(response.headers.get('retry-after'));
      effectiveStatus = response.status;
      return { status: response.status, headers: response.headers, text: async () => {
        try {
          const text = await boundedBody(response);
          // OpenRouter sometimes wraps a provider failure in HTTP 200.
          if (response.status === 200) {
            try { const parsed = JSON.parse(text); const code = Number(parsed?.error?.code); if (Number.isInteger(code) && code >= 400 && code <= 599) effectiveStatus = code; } catch { /* The adapter rejects malformed JSON. */ }
          }
          return text;
        } catch (error) { if (error instanceof GatewayError) responseTooLarge = true; throw error; }
      } };
    });
    store.settle(attemptId, result.ok ? 'success' : result.failure ?? 'invalid', result.usage.inputTokens, result.usage.outputTokens, result.usage.reportedCostUsd);
    observeAttempt?.(result);
    if (result.usage.reportedCostUsd !== null && result.usage.reportedCostUsd > 0) throw new GatewayError('unexpected_reported_cost');
    if (result.usage.outputTokens !== null && result.usage.outputTokens > LIMIT.outputTokens) {
      store.halt('output_budget_violation'); throw new GatewayError('upstream_output_limit');
    }
    if (responseTooLarge) throw new GatewayError('upstream_response_too_large', 502);
    if (callerSignal?.aborted) throw new GatewayError('request_cancelled', 499);
    if (result.ok) {
      if (result.stopReason !== 'stop') throw new GatewayError('incomplete_provider_response', 502);
      if (route.provider === 'groq' && result.modelReturned !== route.model) throw new GatewayError('unexpected_model', 502);
      if (!result.modelReturned || result.modelReturned.length > 180) throw new GatewayError('missing_model_identity', 502);
      store.succeed(route.id);
      return { proposal: result.json, provenance: { route: route.id, requestedModel: route.model, returnedModel: result.modelReturned,
        provider: route.provider, attempts, latencyMs: performance.now() - started, usage: result.usage, requestId: interactionId } };
    }
    if (result.retryable || [401, 402, 403].includes(effectiveStatus ?? 0)) store.fail(route.id, effectiveStatus, delay);
    if (!result.retryable) throw new GatewayError(result.failure === 'refusal' ? 'provider_refused' : 'provider_response_invalid', 502);
  }
  throw new GatewayError('no_eligible_free_route');
}
