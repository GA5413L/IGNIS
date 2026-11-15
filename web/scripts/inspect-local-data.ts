/** Local only. Never fetches URLs or sends supplied data to a provider. */
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { basename } from 'node:path';
import { MAX_CSV_BYTES, MAX_WORKBENCH_PACKAGE_BYTES, parseCsv, defaultRecipe, makeWorkbenchPackage, serializeWorkbenchPackage, replayWorkbenchPackage, ImportSpecSchema } from '../src/core/workbench';

function read(path: string, cap: number): Buffer {
  if (statSync(path).size > cap) throw new Error(`Input exceeds ${cap} bytes; nothing was read.`);
  const bytes = readFileSync(path);
  if (bytes.length > cap) throw new Error('Input grew beyond its limit.');
  return bytes;
}
try {
  const args = process.argv.slice(2);
  if (args[0] === '--replay' && args.length === 2) {
    const { packet, result } = replayWorkbenchPackage(read(args[1], MAX_WORKBENCH_PACKAGE_BYTES).toString('utf8'));
    console.log(JSON.stringify({ status: 'recomputed_identically', sourceSha256: packet.file.sha256, resultDigest: packet.resultDigest, included: result.includedRecords.length, excluded: result.excludedRecords.length, measurementValidated: false }, null, 2));
  } else if (args[0] === '--csv' && args.length === 6 && args[2] === '--spec' && args[4] === '--out') {
    const spec = ImportSpecSchema.parse(JSON.parse(read(args[3], 32768).toString('utf8')));
    const doc = parseCsv(read(args[1], MAX_CSV_BYTES), spec.delimiter);
    const packet = makeWorkbenchPackage(doc, basename(args[1]), spec, defaultRecipe(spec));
    // Never overwrite an input or a prior analysis package accidentally.
    writeFileSync(args[5], serializeWorkbenchPackage(packet), { encoding: 'utf8', flag: 'wx' });
    console.log(JSON.stringify({ status: 'saved', sourceSha256: packet.file.sha256, resultDigest: packet.resultDigest }, null, 2));
  } else throw new Error('Usage: inspect:local -- --csv input.csv --spec mapping.json --out new-package.json OR --replay package.json');
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Local inspection failed.'); process.exitCode = 1;
}
