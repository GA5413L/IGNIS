/** Historical payloads stay opaque. Only current recomputation can enter the workspace. */
import { z } from 'zod';
import { canonicalJson, digestOf } from './canonicalize';
import { payloadDigest } from './digest';
import { RevisionParentSchema } from './revisionParent';
import { ResearchSelectionsSchema, ResearchSelectionSchema } from './researchSelections';
import { SessionSchema, SessionReceiptSchema, parseSession, sourceFingerprint, resultFingerprint, methodFingerprint, type RecheckedSession } from './researchSession';

export const PACKAGE_SCHEMA = 'ignis-evidence-package-1';
export const MAX_PACKAGE_BYTES = 8 * 1024 * 1024;
const hash = z.string().regex(/^[a-f0-9]{64}$/);
const object = z.record(z.string(), z.unknown());
const collection = z.strictObject({ digest: hash, data: object });
export const CollectionsSchema = z.strictObject({ registry: collection, conditions: collection, detectors: collection, atlas: collection, opportunities: collection });
export const PackageBodySchema = z.strictObject({
  schemaVersion: z.literal(PACKAGE_SCHEMA), createdAt: z.iso.datetime(), integrityMeaning: z.literal('checksum_not_signature'),
  scope: z.literal('normalized_application_collections_and_original_assessments'),
  originalSourceFilesIncluded: z.literal(false), historicalEngineIncluded: z.literal(false),
  session: SessionSchema, originals: z.array(object).max(16), collections: CollectionsSchema,
});
export const PackageSchema = PackageBodySchema.extend({ checksum: hash });
export type EvidencePackage = z.infer<typeof PackageSchema>;
export type EvidenceCollections = z.infer<typeof CollectionsSchema>;
export type CollectionKind = keyof EvidenceCollections;
export interface PackageReview {
  historical: { status: 'self_consistent_not_authenticated'; checksum: string; createdAt: string; assessmentCount: number;
    collections: { kind: CollectionKind; savedDigest: string; currentDigest: string; changed: boolean }[];
    originals: { id: string; question: string; createdAt: string; claims: { title: string; text: string; qualifications: string[]; missing: string[]; forbidden: string[] }[]; analyses: { title: string; summary: string[]; limitations: string[] }[] }[] };
  current: RecheckedSession | null; currentError: string | null;
  payloadChanges: { assessmentId: string; fields: string[]; unexplainedResultChange: boolean }[];
  notice: string;
}

const analysisFields = z.looseObject({ kind: z.enum(['conditions', 'detector', 'detector_pair', 'cutoff_envelope']),
  selection: ResearchSelectionSchema, sourceDigest: hash, resultDigest: hash, methodRevision: z.string().min(1),
  result: object, title: z.string(), summary: z.array(z.string()), limitations: z.array(z.string()),
});
const originalFields = RevisionParentSchema.extend({
  createdAt: z.iso.datetime(), handling: object, requestedAreas: z.array(z.string()), ranking: z.array(z.unknown()),
  derivations: z.array(z.unknown()), readiness: object, limitations: z.array(z.string()),
  evidenceSnapshot: z.record(z.string(), z.array(z.unknown())), researchAnalyses: z.array(analysisFields).max(4).optional(),
});

/** Bound nesting and work before recursive canonicalization. Do not merge imported objects. */
export function checkJsonShape(value: unknown): void {
  let nodes = 0;
  const stack: { value: unknown; depth: number }[] = [{ value, depth: 0 }];
  while (stack.length) {
    const next = stack.pop()!;
    if (++nodes > 400_000 || next.depth > 64) throw new Error('Package exceeds structural limits; nothing loaded.');
    if (typeof next.value === 'number' && (!Number.isFinite(next.value) || (Number.isInteger(next.value) && !Number.isSafeInteger(next.value))))
      throw new Error('Package contains a nonfinite or unsafe integer.');
    if (next.value && typeof next.value === 'object') {
      for (const child of Object.values(next.value)) stack.push({ value: child, depth: next.depth + 1 });
    }
  }
}
export function checkPackageBytes(text: string): void {
  if (new TextEncoder().encode(text).length > MAX_PACKAGE_BYTES) throw new Error('Evidence package exceeds 8 MiB; nothing was truncated or loaded.');
}

export function inspectOriginal(raw: Record<string, unknown>) {
  const fields = originalFields.parse(raw);
  if (payloadDigest(raw) !== fields.payloadSha256) throw new Error('Original assessment checksum mismatch.');
  const analyses = fields.researchAnalyses ?? [];
  const selections = ResearchSelectionsSchema.parse(analyses.map((a) => a.selection));
  for (const a of analyses) {
    if (a.kind !== a.selection.kind || digestOf(a.result) !== a.resultDigest) throw new Error('Original analysis result or selection mismatch.');
  }
  // Fingerprint from original fields, not schema-stripped nested objects.
  const receipt = SessionReceiptSchema.parse({ assessmentId: fields.id, parentAssessmentId: fields.parentAssessmentId,
    request: fields.request, selections, catalogDigest: fields.catalogDigest,
    sourceDigest: sourceFingerprint(fields), methodDigest: methodFingerprint(fields),
    resultDigest: resultFingerprint({ handling: raw.handling, requestedAreas: raw.requestedAreas, ranking: raw.ranking,
      claims: raw.claims, derivations: raw.derivations, readiness: raw.readiness, limitations: raw.limitations, researchAnalyses: analyses }),
    engineRevision: fields.engineRevision, rendererRevision: fields.rendererRevision,
  });
  return { fields, receipt };
}

export function parseEvidencePackage(text: string): EvidencePackage {
  checkPackageBytes(text);
  const raw: unknown = JSON.parse(text); checkJsonShape(raw);
  const packet = PackageSchema.parse(raw);
  const { checksum, ...body } = packet;
  if (digestOf(body) !== checksum) throw new Error('Evidence package checksum mismatch.');
  parseSession(JSON.stringify(packet.session));
  if (packet.originals.length !== packet.session.receipts.length) throw new Error('Every receipt needs exactly one original assessment in order.');
  for (const item of Object.values(packet.collections)) {
    if (digestOf(item.data) !== item.digest) throw new Error('Embedded collection checksum mismatch.');
  }
  for (let i = 0; i < packet.originals.length; i++) {
    const { receipt } = inspectOriginal(packet.originals[i]);
    if (canonicalJson(receipt) !== canonicalJson(packet.session.receipts[i])) throw new Error('Original assessment does not match its saved receipt.');
  }
  return packet;
}
