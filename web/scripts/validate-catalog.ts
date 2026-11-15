/** npm run validate:data — schemas, IDs, references, units/values, contracts and coverage counts. Exit 1 on any error. */
import { getCatalog } from '../src/core/registry';

const { snapshot, errors } = getCatalog();
if (!snapshot) {
  console.error(`REGISTRY INVALID (${errors.length} problem(s)):`);
  for (const e of errors) console.error(' -', e);
  process.exit(1);
}
const kinds = snapshot.findings.reduce<Record<string, number>>((acc, f) => {
  const k = snapshot.assertions.find((a) => a.id === f.assertionRef.id)!.kind; acc[k] = (acc[k] ?? 0) + 1; return acc; }, {});
console.log(`registry ${snapshot.revision} valid; digest ${snapshot.digest}`);
console.log(`investigations ${snapshot.investigations.length} (profile-only ${snapshot.investigations.filter((i) => i.coverage === 'profile_only').length}); findings ${snapshot.findings.length} ${JSON.stringify(kinds)}; objectives ${snapshot.assertions.filter((a) => a.kind === 'objective').length}`);
console.log(`sources ${snapshot.sources.length} (hash-verified against inherited fingerprints: ${snapshot.sources.filter((s) => s.expectedSha256 && s.expectedSha256 === s.observedSha256).length}); observations ${snapshot.observations.length} (unknown ${snapshot.observations.filter((o) => o.value?.state === 'unknown').length}); models ${snapshot.models.length}; contracts ${snapshot.contracts.length}`);
console.log(`review levels: ${JSON.stringify(snapshot.assertions.reduce<Record<string, number>>((a, x) => { a[x.review.level] = (a[x.review.level] ?? 0) + 1; return a; }, {}))}`);
