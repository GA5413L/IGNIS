import { z } from 'zod';
import atlas from '../../data/investigation-atlas.json';
import opportunities from '../data/research-opportunities.json';
import { RAW_REGISTRY, parseRegistry } from '../core/registry';
import { conditionDataset, validateConditionDataset } from '../core/conditions';
import { detectorDataset, detectorDatasetSchema } from '../core/detector';
import { canonicalJson, digestOf } from '../core/canonicalize';
import { SessionSchema, parseSession, type RecheckedSession } from '../core/researchSession';
import { PACKAGE_SCHEMA, PackageBodySchema, CollectionsSchema, parseEvidencePackage, inspectOriginal, checkPackageBytes, checkJsonShape,
  type EvidencePackage, type EvidenceCollections, type CollectionKind, type PackageReview } from '../core/evidencePackage';
import { handleSession } from './sessions';
import type { Reply } from './handlers';

export function currentCollections(): EvidenceCollections {
  const item = (data: object) => ({ data, digest: digestOf(data) });
  return CollectionsSchema.parse({ registry: item(RAW_REGISTRY), conditions: item(conditionDataset), detectors: item(detectorDataset), atlas: item(atlas), opportunities: item(opportunities) });
}
const rawRegistrySchema = z.strictObject({ manifest: z.unknown(), sources: z.unknown(), investigations: z.unknown(), assertions: z.unknown(),
  entities: z.unknown(), events: z.unknown(), observations: z.unknown(), models: z.unknown(), uses: z.unknown(), contracts: z.unknown(),
  findings: z.unknown(), conflicts: z.unknown(), methods: z.unknown() });

function checkSourceBindings(packet: EvidencePackage): void {
  validateConditionDataset(packet.collections.conditions.data);
  detectorDatasetSchema.parse(packet.collections.detectors.data);
  z.object({ schemaVersion: z.literal('ignis-investigation-atlas-1'), records: z.array(z.object({ id: z.string() })) }).parse(packet.collections.atlas.data);
  z.object({ schemaVersion: z.literal('ignis.research-opportunities.v1'), opportunities: z.array(z.object({ id: z.string() })) }).parse(packet.collections.opportunities.data);
  const parsed = parseRegistry(rawRegistrySchema.parse(packet.collections.registry.data));
  if (!parsed.snapshot) throw new Error(`Embedded registry cannot be read: ${parsed.errors.slice(0, 3).join('; ')}`);
  for (const original of packet.originals) {
    const { fields } = inspectOriginal(original);
    if (fields.catalogDigest !== parsed.snapshot.digest) throw new Error('Original catalogue digest does not match the embedded registry. Recheck old work before creating a new package.');
    for (const analysis of fields.researchAnalyses ?? []) {
      const kind = analysis.kind === 'conditions' ? 'conditions' : 'detectors';
      if (analysis.sourceDigest !== packet.collections[kind].digest) throw new Error('Original analysis source digest does not match the embedded collection.');
    }
    // Stored selected evidence must actually belong to the saved normalized registry.
    const groups = new Map(Object.entries(parsed.snapshot).filter(([, value]) => Array.isArray(value)));
    for (const [name, records] of Object.entries(fields.evidenceSnapshot)) {
      const group = groups.get(name);
      if (!Array.isArray(group)) throw new Error(`Unknown original evidence group: ${name}.`);
      const members = new Set(group.map(digestOf));
      if (records.some((record) => !members.has(digestOf(record)))) throw new Error('Original evidence is absent from the embedded registry.');
    }
  }
}

export function createEvidencePackage(sessionValue: unknown, originals: Record<string, unknown>[], now = new Date().toISOString()): EvidencePackage {
  const session = parseSession(JSON.stringify(sessionValue));
  const body = PackageBodySchema.parse({ schemaVersion: PACKAGE_SCHEMA, createdAt: now, integrityMeaning: 'checksum_not_signature',
    scope: 'normalized_application_collections_and_original_assessments', originalSourceFilesIncluded: false, historicalEngineIncluded: false,
    session, originals, collections: currentCollections() });
  const packet = parseEvidencePackage(canonicalJson({ ...body, checksum: digestOf(body) }));
  checkSourceBindings(packet);
  checkPackageBytes(JSON.stringify(packet, null, 2) + '\n');
  return packet;
}

export function reviewEvidencePackage(text: string, now?: string): PackageReview {
  const packet = parseEvidencePackage(text); checkSourceBindings(packet);
  const installed = currentCollections();
  const reply = handleSession(JSON.stringify(packet.session), now);
  const current = reply.status === 200 ? reply.body as RecheckedSession : null; // Only our recompute handler returns typed assessments.
  const failure = z.object({ message: z.string() }).safeParse(reply.body);
  return {
    historical: { status: 'self_consistent_not_authenticated', checksum: packet.checksum, createdAt: packet.createdAt, assessmentCount: packet.originals.length,
      collections: (Object.keys(installed) as CollectionKind[]).map((kind) => ({ kind, savedDigest: packet.collections[kind].digest,
        currentDigest: installed[kind].digest, changed: packet.collections[kind].digest !== installed[kind].digest })),
      originals: packet.originals.map((o) => { const { fields: f } = inspectOriginal(o); return { id: f.id, question: f.request.originalText, createdAt: f.createdAt,
        claims: f.claims.map((c) => ({ title: c.title, text: c.authoritativeText, qualifications: c.qualifications, missing: c.missingRequirements, forbidden: c.forbiddenStrongerClaims })),
        analyses: (f.researchAnalyses ?? []).map((a) => ({ title: a.title, summary: a.summary, limitations: a.limitations })) }; }),
    },
    current, currentError: current ? null : failure.success ? failure.data.message : 'Current recomputation unavailable.',
    payloadChanges: current ? current.assessments.map((a, i) => {
      const previous = packet.originals[i], next: Record<string, unknown> = { ...a };
      const fields = [...new Set([...Object.keys(previous), ...Object.keys(next)])].filter((key) => key !== 'createdAt'
        && (Object.hasOwn(previous, key) !== Object.hasOwn(next, key) || (Object.hasOwn(previous, key) && digestOf(previous[key]) !== digestOf(next[key]))));
      const check = current.checks[i];
      return { assessmentId: packet.session.receipts[i].assessmentId, fields,
        unexplainedResultChange: check.resultChanged && !check.sourceChanged && !check.methodChanged };
    }) : [],
    notice: 'Historical content is stated by the file. Checksums and source bindings establish internal consistency, not authenticity or scientific correctness. Normalized collections can retain extraction errors. Original NASA binaries and historical engine code are not included. Current results are recomputed separately; imported results are never loaded as current evidence.',
  };
}
const creation = z.strictObject({ session: SessionSchema, originals: z.array(z.record(z.string(), z.unknown())).max(16) });
export function handlePackageCreate(text: string): Reply {
  try { checkPackageBytes(text); const raw: unknown = JSON.parse(text); checkJsonShape(raw); const input = creation.parse(raw);
    return { status: 200, body: createEvidencePackage(input.session, input.originals) };
  } catch (e) { return { status: 400, body: { code: 'invalid_package', message: e instanceof Error ? e.message : 'Package could not be saved.' } }; }
}
export function handlePackageReview(text: string): Reply {
  try { return { status: 200, body: reviewEvidencePackage(text) }; }
  catch (e) { return { status: 400, body: { code: 'invalid_package', message: e instanceof Error ? e.message : 'Package could not be reviewed.' } }; }
}
