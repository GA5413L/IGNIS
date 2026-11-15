import { callGemini } from './gemini';
import { callOpenAiCompatible } from './openaiCompatible';
import type { ProviderCallInput, ProviderCallResult, RuntimeConfig, Transport } from './types';

export * from './types';

/** Dispatch one call. The caller supplies the key and the transport; this module reads no environment. */
export function callProvider(cfg: RuntimeConfig, input: ProviderCallInput, apiKey: string, transport: Transport): Promise<ProviderCallResult> {
  return cfg.provider === 'gemini' ? callGemini(cfg, input, apiKey, transport) : callOpenAiCompatible(cfg, input, apiKey, transport);
}

/** Real network transport (global fetch, normal TLS verification). */
export const fetchTransport: Transport = async (url, init) => {
  const res = await fetch(url, init);
  return { status: res.status, headers: res.headers, text: () => res.text() };
};
