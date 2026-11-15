/** Local-only comparison/replay. Never calls a service and never overwrites an output file. */
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { makeDifferencePackage, replayDifferencePackage, serializeDifferencePackage, PairingSchema } from '../src/core/channelDifferences';
import { MAX_WORKBENCH_PACKAGE_BYTES, replayWorkbenchPackage } from '../src/core/workbench';

const arg = (key: string) => { const i = process.argv.indexOf(`--${key}`); return i < 0 ? undefined : process.argv[i + 1]; };
const read = (path: string, cap = MAX_WORKBENCH_PACKAGE_BYTES) => { if (statSync(path).size > cap) throw new Error('Input exceeds the local package limit.'); return readFileSync(path, 'utf8'); };
try {
  const replay = arg('replay');
  if (replay) {
    const result = replayDifferencePackage(read(replay));
    console.log(JSON.stringify({ status: 'recomputed_identically', sourceSha256: result.document.sha256, resultDigest: result.packet.resultDigest, metrics: result.result.metrics, blockers: result.result.blockers,
      numericalWarnings: result.result.numericalWarnings, assumptions: result.result.assumptions, declarationStatus: result.result.declarationStatus, alignmentCaveat: result.result.alignmentCaveat, interpretation: result.result.interpretation }, null, 2));
  } else {
    const source = arg('source'), pairing = arg('pairing'), out = arg('out');
    if (!source || !pairing || !out) throw new Error('Use --source workbench-package.json --pairing pairing.json --out new-comparison.json, or --replay comparison.json.');
    const original = replayWorkbenchPackage(read(source)), contract = PairingSchema.parse(JSON.parse(read(pairing, 8192)));
    const packet = makeDifferencePackage(original.document, original.packet.file.name, original.packet.spec, original.packet.recipe, contract);
    writeFileSync(out, serializeDifferencePackage(packet), { encoding: 'utf8', flag: 'wx' });
    console.log(JSON.stringify({ status: 'written', resultDigest: packet.resultDigest, metrics: packet.result.metrics, blockers: packet.result.blockers,
      numericalWarnings: packet.result.numericalWarnings, assumptions: packet.result.assumptions, declarationStatus: packet.result.declarationStatus, alignmentCaveat: packet.result.alignmentCaveat, interpretation: packet.result.interpretation }, null, 2));
  }
} catch (e) { console.error((e as Error).message); process.exitCode = 1; }
