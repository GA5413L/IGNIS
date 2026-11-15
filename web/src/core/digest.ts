/** Assessment payload checksum (master §9.4): canonical JSON excluding payloadSha256 and createdAt. Shared by server and browser. */
import { digestOf } from './canonicalize';

export const EXCLUDED_FROM_HASH = ['payloadSha256', 'createdAt'] as const;
export function payloadDigest(a: object): string {
  const copy: Record<string, unknown> = { ...(a as Record<string, unknown>) };
  for (const k of EXCLUDED_FROM_HASH) delete copy[k];
  return digestOf(copy);
}
