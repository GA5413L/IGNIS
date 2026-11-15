/** Portable recipes and receipts. Imported results are never trusted as newly computed evidence. */
import { z } from 'zod';
import type { Assessment } from './assess';
import { ConfirmedRequest, InterpretationProposal } from './schemas';
import { canonicalJson, digestOf } from './canonicalize';
import { payloadDigest } from './digest';
import { ResearchSelectionsSchema, type ResearchSelection } from './researchSelections';

const hash = z.string().regex(/^[a-f0-9]{64}$/);
const boundedId = z.string().min(1).max(160);
export const MAX_SESSION_BYTES = 2 * 1024 * 1024;
export const SESSION_SCHEMA = 'ignis-research-session-1';
export const SessionReceiptSchema = z.strictObject({
  assessmentId: boundedId, parentAssessmentId: boundedId.nullable(), request: ConfirmedRequest,
  selections: ResearchSelectionsSchema, catalogDigest: hash, sourceDigest: hash,
  engineRevision: boundedId, rendererRevision: boundedId, methodDigest: hash, resultDigest: hash,
});
export const SessionBodySchema = z.strictObject({
  schemaVersion: z.literal(SESSION_SCHEMA), savedAt: z.iso.datetime(), integrityMeaning: z.literal('checksum_not_signature'),
  draft: z.strictObject({ question: z.string().max(2000), proposal: InterpretationProposal }),
  selections: ResearchSelectionsSchema, receipts: z.array(SessionReceiptSchema).max(16),
});
export const SessionSchema = SessionBodySchema.extend({ checksum: hash });
export type ResearchSession = z.infer<typeof SessionSchema>;
export type SessionReceipt = z.infer<typeof SessionReceiptSchema>;
export interface SessionCheck {
  previousAssessmentId: string; recomputedAssessmentId: string;
  sourceChanged: boolean; methodChanged: boolean; resultChanged: boolean;
  status: 'unchanged' | 'changed';
}
export interface RecheckedSession {
  session: ResearchSession; assessments: Assessment[]; checks: SessionCheck[];
  notice: string;
}

export function sourceFingerprint(a: Assessment): string {
  return digestOf({ catalog: a.catalogDigest, analyses: (a.researchAnalyses ?? []).map((r) => ({ kind: r.kind, sourceDigest: r.sourceDigest })) });
}
export function resultFingerprint(a: Assessment): string {
  return digestOf({ handling: a.handling, requestedAreas: a.requestedAreas, ranking: a.ranking, claims: a.claims,
    derivations: a.derivations, readiness: a.readiness, limitations: a.limitations,
    research: (a.researchAnalyses ?? []).map((r) => ({ kind: r.kind, selection: r.selection, resultDigest: r.resultDigest })) });
}
export function methodFingerprint(a: Assessment): string {
  return digestOf({ engine: a.engineRevision, renderer: a.rendererRevision,
    analyses: (a.researchAnalyses ?? []).map((r) => ({ kind: r.kind, methodRevision: r.methodRevision })) });
}
export function receiptFor(a: Assessment): SessionReceipt {
  if (payloadDigest(a) !== a.payloadSha256) throw new Error('Assessment checksum failed; session was not saved.');
  return SessionReceiptSchema.parse({ assessmentId: a.id, parentAssessmentId: a.parentAssessmentId, request: a.request,
    selections: (a.researchAnalyses ?? []).map((r) => r.selection), catalogDigest: a.catalogDigest, sourceDigest: sourceFingerprint(a),
    engineRevision: a.engineRevision, rendererRevision: a.rendererRevision, methodDigest: methodFingerprint(a), resultDigest: resultFingerprint(a) });
}
export function makeSession(draft: ResearchSession['draft'], selections: ResearchSelection[], chronological: Assessment[], now = new Date().toISOString()): ResearchSession {
  const body = SessionBodySchema.parse({ schemaVersion: SESSION_SCHEMA, savedAt: now, integrityMeaning: 'checksum_not_signature',
    draft, selections, receipts: chronological.map(receiptFor) });
  const packet = { ...body, checksum: digestOf(body) };
  if (new TextEncoder().encode(canonicalJson(packet)).length > MAX_SESSION_BYTES) throw new Error('Session exceeds 2 MiB; nothing was truncated.');
  validateSessionAncestry(packet);
  return packet;
}
export function parseSession(rawText: string): ResearchSession {
  if (new TextEncoder().encode(rawText).length > MAX_SESSION_BYTES) throw new Error('Session exceeds 2 MiB; nothing was loaded.');
  const packet = SessionSchema.parse(JSON.parse(rawText));
  const { checksum, ...body } = packet;
  if (digestOf(body) !== checksum) throw new Error('Session checksum mismatch. Nothing was loaded.');
  validateSessionAncestry(packet);
  return packet;
}
/** Validate the complete available chain on both save and import. A single parent API
 * payload cannot prove identity uniqueness across ancestors it does not contain. */
function validateSessionAncestry(packet: ResearchSession): void {
  const ids = new Map<string, SessionReceipt>();
  const requests = new Set<string>();
  for (const r of packet.receipts) {
    if (ids.has(r.assessmentId) || requests.has(r.request.id)) throw new Error('Session contains duplicate assessment or request identities.');
    const parent = r.parentAssessmentId ? ids.get(r.parentAssessmentId) : null;
    if (r.parentAssessmentId && !parent) throw new Error('Session parent is missing or occurs after its child.');
    if (parent ? r.request.parentRequestRef?.id !== parent.request.id || r.request.parentRequestRef.revision !== parent.request.revision : r.request.parentRequestRef !== null)
      throw new Error('Session request ancestry does not match its assessment ancestry.');
    ids.set(r.assessmentId, r); requests.add(r.request.id);
  }
}
