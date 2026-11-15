/** Public, read-only metadata refresh. No LLM, credentials, private text or arbitrary target URLs. */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { checkCitation, CITATION_TARGETS } from '../src/server/citations';

async function main() {
  const target = process.argv[2];
  if (!target) throw new Error('Pass the output snapshot path explicitly.');
  const records = [];
  for (const source of CITATION_TARGETS) { const result = await checkCitation(source); records.push(result); console.log(`${result.id}: ${result.status} (${result.httpStatus ?? 'network unavailable'})`); }
  writeFileSync(resolve(target), JSON.stringify({ version: 'citation-metadata-1', checkedAt: new Date().toISOString(),
    scope: 'Seven existing publication/dataset identifiers. Metadata identity checks do not verify a scientific claim, full-text access, retractions or dataset values.',
    titleComparison: 'Case, punctuation and whitespace normalization only. Conference/report labels are kept in the catalogue; the expected publication titles here omit those labels.',
    records }, null, 2) + '\n', 'utf8');
}
main().catch(() => { console.error('Citation refresh failed; no source catalogue changes were made.'); process.exitCode = 1; });
