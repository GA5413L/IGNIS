/** Usage: npm run audit:design -- --example OR --input request.json. JSON is written to stdout. */
import { readFileSync, statSync } from 'node:fs';
import { auditDesign, TWO_POINT_DESIGN_EXAMPLE } from '../src/core/designAudit';
import { MAX_DESIGN_AUDIT_BODY_BYTES } from '../src/server/designAudit';

try {
  const args = process.argv.slice(2);
  let request: unknown;
  if (args.length === 1 && args[0] === '--example') request = TWO_POINT_DESIGN_EXAMPLE;
  else if (args.length === 2 && args[0] === '--input') {
    if (statSync(args[1]).size > MAX_DESIGN_AUDIT_BODY_BYTES) throw new Error('Input exceeds the 16384-byte request limit.');
    const data = readFileSync(args[1]);
    if (data.byteLength > MAX_DESIGN_AUDIT_BODY_BYTES) throw new Error('Input exceeds the 16384-byte request limit.');
    request = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(data));
  } else throw new Error('Use --example or --input request.json. No network access or inference is performed.');
  process.stdout.write(JSON.stringify(auditDesign(request), null, 2) + '\n');
} catch (caught) {
  // Input errors may contain supplied source text; do not dump raw request bodies or filesystem contents.
  process.stderr.write(`Design audit failed: ${caught instanceof Error ? caught.name : 'unknown error'}. Check the documented request schema and file size.\n`);
  process.exitCode = 2;
}
