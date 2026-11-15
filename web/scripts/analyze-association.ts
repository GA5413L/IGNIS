/** Offline current-source rank analysis or bounded exported-package replay. */
import { readFile, stat, writeFile } from 'node:fs/promises';
import {
  analyzeDetectorAssociation, createAssociationPackage, replayAssociationPackage, MAX_ASSOCIATION_PACKAGE_BYTES,
  type DetectorAssociationSelection,
} from '../src/core/detectorAssociation';

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === '--help') {
    process.stdout.write('Usage: tsx scripts/analyze-association.ts [--selection selection.json | --replay package.json] [--out package.json]\nDefault: SAME-R, spacecraft materials, AW scatter versus BK ion delta; descriptive ranks only.\n');
    return;
  }
  const options = new Map<string, string>();
  for (let index = 0; index < args.length; index += 2) {
    const name = args[index]; const value = args[index + 1];
    if (!['--selection', '--replay', '--out'].includes(name) || !value || value.startsWith('--') || options.has(name)) {
      throw new Error('Use unique --selection, --replay or --out options with explicit file paths.');
    }
    options.set(name, value);
  }
  if (options.has('--selection') && options.has('--replay')) throw new Error('Choose either --selection or --replay.');
  async function readBounded(path: string, maximum: number): Promise<string> {
    if ((await stat(path)).size > maximum) throw new Error(`Input exceeds ${maximum} bytes.`);
    const bytes = await readFile(path);
    if (bytes.length > maximum) throw new Error(`Input exceeds ${maximum} bytes.`);
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  }
  let packet;
  if (options.has('--replay')) packet = replayAssociationPackage(await readBounded(options.get('--replay')!, MAX_ASSOCIATION_PACKAGE_BYTES));
  else {
    const selection: Partial<DetectorAssociationSelection> = options.has('--selection')
      ? JSON.parse(await readBounded(options.get('--selection')!, 16384)) : {};
    packet = createAssociationPackage(analyzeDetectorAssociation(selection));
  }
  const text = `${JSON.stringify(packet, null, 2)}\n`;
  if (new TextEncoder().encode(text).length > MAX_ASSOCIATION_PACKAGE_BYTES) throw new Error('Formatted export exceeds the replay size limit.');
  if (options.has('--out')) await writeFile(options.get('--out')!, text, { encoding: 'utf8', flag: 'wx' });
  else process.stdout.write(text);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : 'Association analysis failed.'}\n`);
  process.exitCode = 1;
});
