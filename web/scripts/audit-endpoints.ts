/** Prints a local observation audit; no inference, network or data storage. */
import { readFileSync, statSync } from 'node:fs';
import { auditEndpoints, endpointExample } from '../src/core/endpointAudit';
import { MAX_ENDPOINT_AUDIT_BODY_BYTES } from '../src/server/endpointAudit';
try {
  const args = process.argv.slice(2);
  let request: unknown;
  if (args.length === 1 && args[0] === '--example') request = endpointExample();
  else if (args.length === 2 && args[0] === '--input') {
    if (statSync(args[1]).size > MAX_ENDPOINT_AUDIT_BODY_BYTES) throw new Error('Input exceeds byte limit');
    const bytes = readFileSync(args[1]);
    if (bytes.byteLength > MAX_ENDPOINT_AUDIT_BODY_BYTES) throw new Error('Input exceeds byte limit');
    request = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } else throw new Error('Use --example or --input request.json');
  process.stdout.write(JSON.stringify(auditEndpoints(request), null, 2) + '\n');
} catch (caught) {
  process.stderr.write(`Endpoint audit failed: ${caught instanceof Error ? caught.name : 'unknown error'}. Check the documented request schema and file size.\n`);
  process.exitCode = 2;
}
