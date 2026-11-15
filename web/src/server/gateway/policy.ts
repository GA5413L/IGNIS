/** Cloudflare transport preparation. A key or an environment flag is not model acceptance. */
import { isAbsolute } from 'node:path';
export const GATEWAY_REVISION = 'cf-si-2026-11-15.1';
export const GATEWAY_ROUTES = [
  { id: 'cf-groq-oss120', provider: 'groq', model: 'openai/gpt-oss-120b', path: 'groq/chat/completions' },
  { id: 'cf-openrouter-free', provider: 'openrouter', model: 'openrouter/free', path: 'openrouter/v1/chat/completions' },
] as const;
export type GatewayRoute = typeof GATEWAY_ROUTES[number];
export type GatewayRouteId = GatewayRoute['id'];
// Populated only after the existing semantic evaluation and owner acceptance, never from client input.
export const ACCEPTED_GATEWAY_ROUTES: readonly GatewayRouteId[] = [];
export const GATEWAY_LIMITS = Object.freeze({ questionChars: 2000, bodyBytes: 32 * 1024, packetBytes: 64 * 1024,
  outputTokens: 512, responseBytes: 32 * 1024, attempts: 2, timeoutMs: 10_000, concurrent: 2,
  visitorMinute: 2, visitorDay: 10, globalMinute: 20, globalDay: 100, reservedTokensDay: 500_000 });

export interface GatewayConfig {
  enabled: boolean; account: string; gateway: string; token: string; signingKey: string; database: string;
  origin: string; mode: 'local' | 'public'; turnstileSecret: string; turnstileSiteKey: string;
  tokenRotated: boolean; byokOnlyVerified: boolean; privacyVerified: boolean; sharedStoreVerified: boolean;
  freeVerified: GatewayRouteId[];
}

export function gatewayConfig(env: NodeJS.ProcessEnv = process.env): GatewayConfig {
  return {
    enabled: env.CF_SI_ENABLED === 'true', account: env.CF_ACCOUNT_ID ?? '', gateway: env.CF_AI_GATEWAY_ID ?? 'webiste-chatbot',
    token: env.CF_AI_GATEWAY_TOKEN ?? '', signingKey: env.CF_SI_SIGNING_KEY ?? '', database: env.CF_SI_QUOTA_DB ?? '',
    origin: env.CF_SI_APP_ORIGIN ?? 'http://127.0.0.1:3000', mode: env.CF_SI_MODE === 'public' ? 'public' : 'local',
    turnstileSecret: env.CF_TURNSTILE_SECRET ?? '', turnstileSiteKey: env.CF_TURNSTILE_SITE_KEY ?? '',
    tokenRotated: env.CF_TOKEN_ROTATED === 'true', byokOnlyVerified: env.CF_BYOK_ONLY_VERIFIED === 'true',
    privacyVerified: env.CF_PRIVACY_SETTINGS_VERIFIED === 'true', sharedStoreVerified: env.CF_SHARED_QUOTA_STORE_VERIFIED === 'true',
    freeVerified: GATEWAY_ROUTES.filter((r) => env[r.provider === 'groq' ? 'CF_GROQ_FREE_VERIFIED' : 'CF_OPENROUTER_FREE_VERIFIED'] === 'true').map((r) => r.id),
  };
}

export function gatewayReadiness(c: GatewayConfig, accepted: readonly GatewayRouteId[] = ACCEPTED_GATEWAY_ROUTES) {
  const reasons: string[] = [];
  if (!c.enabled) reasons.push('connection_disabled');
  if (!/^[a-f0-9]{32}$/i.test(c.account) || !/^[a-z0-9][a-z0-9-]{0,63}$/.test(c.gateway)) reasons.push('routing_not_configured');
  if (!c.token || /[\r\n]/.test(c.token)) reasons.push('token_not_configured');
  if (c.signingKey.length < 32) reasons.push('visitor_signing_key_missing');
  if (!c.database || !isAbsolute(c.database) || /(?:^|[\\/])(?:public|\.git|\.next)(?:[\\/]|$)/i.test(c.database) || !c.sharedStoreVerified) reasons.push('durable_quota_store_unverified');
  if (!c.byokOnlyVerified) reasons.push('byok_only_unverified');
  if (!c.privacyVerified) reasons.push('gateway_privacy_unverified');
  let url: URL | null = null;
  try { url = new URL(c.origin); } catch { /* Report configuration, never guess an origin. */ }
  if (!url || url.origin !== c.origin || url.username || url.password || !['http:', 'https:'].includes(url.protocol)) reasons.push('invalid_app_origin');
  if (c.mode === 'local' && !url?.hostname.match(/^(127\.0\.0\.1|localhost|\[::1\])$/)) reasons.push('local_mode_requires_loopback');
  if (c.mode === 'public') {
    if (url?.protocol !== 'https:') reasons.push('public_https_required');
    if (!c.tokenRotated) reasons.push('public_token_rotation_required');
    if (!c.turnstileSecret || !c.turnstileSiteKey) reasons.push('public_turnstile_required');
  }
  const routes = GATEWAY_ROUTES.filter((r) => c.freeVerified.includes(r.id) && accepted.includes(r.id));
  if (!c.freeVerified.length) reasons.push('free_account_controls_unverified');
  if (!routes.length) reasons.push('provider_evaluation_pending');
  return { ready: reasons.length === 0, reasons, routes };
}

/** This reduces accidental off-topic requests; the closed proposal + deterministic answers enforce output scope. */
export function combustionTopic(question: string): boolean {
  return (/\b(fire|flames?|combustion|microgravity|saffire|flex|bass|smoke|aerosol|extinction|flammability|pyrolysis|ignition|detectors?|oxygen|buoyancy|ventilation|radiation|gravity|ignis)\b/i.test(question) || /\bSAME(?:-R)?\b/.test(question))
    && !/\b(?:sk-[A-Za-z0-9_-]{16,}|AIza[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9_]{20,})\b/.test(question);
}
