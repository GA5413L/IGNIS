/** Same-origin check for state-changing JSON endpoints (master §15.1). CORS is not treated as a spending firewall. */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return req.headers.get('sec-fetch-site') !== 'cross-site';
  try {
    const source = new URL(origin), requestUrl = new URL(req.url);
    // Next can canonicalize req.url to localhost while the browser uses 127.0.0.1.
    // Preserve the incoming authority, but still compare the protocol and port.
    const host = req.headers.get('host') ?? requestUrl.host;
    if (/[\\/?#@\s]/.test(host)) return false;
    const target = new URL(`${requestUrl.protocol}//${host}`);
    return (source.protocol === 'http:' || source.protocol === 'https:') && source.origin === target.origin;
  } catch { return false; }
}
