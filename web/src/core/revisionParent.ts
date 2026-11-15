/** Validate the fields a historical parent contributes to revision comparison.
 * This is a structural boundary, not author authentication or scientific validation.
 * The original payload is retained, so unknown historical fields remain checksum-bound.
 */
import { z } from 'zod';
import { ConfirmedRequest, ExecutionKind, Id, Ref, Route, SafetyArea, ScientificOutcome } from './schemas';
import { ResearchSelectionSchema } from './researchSelections';

const hash = z.string().regex(/^[a-f0-9]{64}$/);
const strings = z.array(z.string());
const truth = z.enum(['satisfied', 'contradicted', 'unknown']);
const claim = z.object({
  id: Id, kind: z.enum(['source_finding', 'contract']), findingRef: Ref.nullable(), contractRef: Ref.nullable(),
  safetyAreas: z.array(SafetyArea), title: z.string(), requestedUse: z.string(), route: Route,
  outcome: ScientificOutcome.nullable(), contractTruth: truth.nullable(), authoritativeText: z.string(),
  sourceFindingText: z.string().nullable(), qualifications: strings, forbiddenStrongerClaims: strings,
  predicateResults: z.array(z.object({ predicateId: Id, truth, reason: z.string(), consumedRefs: z.array(Ref),
    missingFieldIds: strings, critical: z.boolean(), description: z.string() })),
  derivationIds: strings, consumedRefs: z.array(Ref), missingRequirements: strings, executionKind: ExecutionKind,
  evidenceKind: z.string().nullable(), reviewLevel: z.string(), sourceIds: strings, presentation: z.enum(['lead', 'more']),
}).refine((c) => c.kind === 'contract' ? c.contractRef !== null : c.findingRef !== null, 'Claim is missing its typed source reference.');

export const RevisionParentSchema = z.object({
  schemaVersion: z.literal('ignis-assessment-1'), id: Id, request: ConfirmedRequest,
  catalogDigest: hash, catalogRevision: z.string().min(1), payloadSha256: hash, dependencyDigest: hash,
  engineRevision: z.string().min(1), rendererRevision: z.string().min(1), parentAssessmentId: Id.nullable(),
  claims: z.array(claim),
  researchAnalyses: z.array(z.object({ kind: z.enum(['conditions', 'detector', 'detector_pair', 'cutoff_envelope']),
    selection: ResearchSelectionSchema, resultDigest: hash, sourceDigest: hash, methodRevision: z.string().min(1),
  }).refine((a) => a.kind === a.selection.kind, 'Analysis kind and selection differ.')).max(4).optional(),
});
