import { describe, it, expect } from 'vitest';
import { assess } from '../../src/core/assess';
import { digestOf, canonicalJson } from '../../src/core/canonicalize';
import { payloadDigest } from '../../src/core/digest';
import { makeSession, receiptFor } from '../../src/core/researchSession';
import { parseEvidencePackage, checkJsonShape, MAX_PACKAGE_BYTES, type EvidencePackage } from '../../src/core/evidencePackage';
import { createEvidencePackage, reviewEvidencePackage, handlePackageCreate, handlePackageReview } from '../../src/server/packages';
import { DEFAULT_CUTOFF_ENVELOPE_SELECTION } from '../../src/core/cutoffEnvelope';
import { POST } from '../../src/app/api/package/recheck/route';
import { catalog, request, BRIEF, NOW, syntheticRegistry } from '../helpers';

function workspace() {
  const a = assess(request(BRIEF), catalog(), { now: NOW, researchSelections: [{ kind: 'cutoff_envelope', options: { ...DEFAULT_CUTOFF_ENVELOPE_SELECTION } }] });
  const session = makeSession({ question: a.request.originalText, proposal: a.request.proposal }, a.researchAnalyses!.map((r) => r.selection), [a], NOW);
  return { a, session };
}
const objectCopy = (value: unknown): Record<string, unknown> => JSON.parse(JSON.stringify(value));
function packet() { const { a, session } = workspace(); return createEvidencePackage(session, [objectCopy(a)], NOW); }
function reseal(p: EvidencePackage) { const { checksum: ignored, ...body } = p; void ignored; p.checksum = digestOf(body); return p; }
function resealSession(p: EvidencePackage) { const { checksum: ignored, ...body } = p.session; void ignored; p.session.checksum = digestOf(body); return reseal(p); }

describe('single-file historical evidence handoff', () => {
  it('round-trips every original field, exact bounds and unused normalized source records', () => {
    const { a, session } = workspace(); const p = createEvidencePackage(session, [objectCopy(a)], NOW);
    const reopened = parseEvidencePackage(JSON.stringify(p));
    expect(canonicalJson(reopened.originals[0])).toBe(canonicalJson(a));
    expect(reopened.collections.detectors.data.records).toHaveLength(154);
    const review = reviewEvidencePackage(JSON.stringify(p), NOW);
    expect(review.historical.status).toBe('self_consistent_not_authenticated');
    expect(review.historical.collections.every((c) => !c.changed)).toBe(true);
    expect(review.current!.checks[0].status).toBe('unchanged');
    expect(review.payloadChanges[0].fields).toEqual([]);
    expect(review.current!.assessments[0].researchAnalyses![0].result).toEqual(a.researchAnalyses![0].result);
    expect(new TextEncoder().encode(JSON.stringify(p, null, 2)).length).toBeLessThan(MAX_PACKAGE_BYTES);
    expect(p.originalSourceFilesIncluded).toBe(false); expect(p.historicalEngineIncluded).toBe(false);
  });
  it('rejects partial tampering even after the outer checksum is recomputed', () => {
    const p = packet(); p.originals[0].limitations = ['Tampered'];
    expect(handlePackageReview(JSON.stringify(reseal(p))).status).toBe(400);
    const q = packet(); q.collections.detectors.data.title = 'Changed';
    expect(handlePackageReview(JSON.stringify(reseal(q))).status).toBe(400);
  });
  it('accepts a consistently forged result only as historical and recomputes current evidence independently', () => {
    const { a, session } = workspace(); const p = createEvidencePackage(session, [objectCopy(a)], NOW);
    a.claims[0].authoritativeText = 'An invented historical claim'; a.payloadSha256 = payloadDigest(a);
    p.originals[0] = objectCopy(a); p.session.receipts[0] = receiptFor(a); resealSession(p);
    const review = reviewEvidencePackage(JSON.stringify(p), NOW);
    expect(review.historical.originals[0].claims[0].text).toBe('An invented historical claim');
    expect(review.current!.assessments[0].claims[0].authoritativeText).not.toBe('An invented historical claim');
    expect(review.current!.checks[0].resultChanged).toBe(true);
    expect(review.payloadChanges[0].unexplainedResultChange).toBe(true);
  });
  it('detects altered narrative even when scientific-result fingerprints are unchanged', () => {
    const { a, session } = workspace(); const p = createEvidencePackage(session, [objectCopy(a)], NOW);
    a.researchAnalyses![0].summary = ['Historical wording differs']; a.payloadSha256 = payloadDigest(a);
    p.originals[0] = objectCopy(a); p.session.receipts[0] = receiptFor(a); resealSession(p);
    const review = reviewEvidencePackage(JSON.stringify(p), NOW);
    expect(review.current!.checks[0].resultChanged).toBe(false);
    expect(review.payloadChanges[0].fields).toContain('researchAnalyses');
  });
  it('rejects missing originals, duplicates, unsupported envelope fields and mismatched collections', () => {
    for (const change of [
      (p: EvidencePackage) => { p.originals = []; },
      (p: EvidencePackage) => { p.originals.push(p.originals[0]); },
      (p: EvidencePackage) => { p.collections.detectors.data.title = 'Different collection'; p.collections.detectors.digest = digestOf(p.collections.detectors.data); },
    ]) { const p = packet(); change(p); expect(handlePackageReview(JSON.stringify(reseal(p))).status).toBe(400); }
    expect(handlePackageReview(JSON.stringify({ ...packet(), trusted: true })).status).toBe(400);
  });
  it('retains a readable historical package when its request cannot be recomputed by this installation', () => {
    const historical = syntheticRegistry((raw) => { raw.investigations.records[0].id = 'INV-OLD';
      const oldId = catalog().investigations[0].id;
      const replace = (value: unknown): unknown => typeof value === 'string' ? value === oldId ? 'INV-OLD' : value
        : Array.isArray(value) ? value.map(replace) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, replace(v)])) : value;
      Object.assign(raw, replace(raw));
    });
    // Build the historical packet deliberately, rather than asking the current server to label old sources current.
    const req = request({ intent: 'browse_investigations', investigationIds: ['INV-OLD'] });
    const old = assess(req, historical, { now: NOW });
    const p = packet();
    p.originals = [objectCopy(old)]; p.session = makeSession({ question: req.originalText, proposal: req.proposal }, [], [old], NOW);
    const raw = p.collections.registry.data;
    const oldId = catalog().investigations[0].id;
    const replace = (value: unknown): unknown => typeof value === 'string' ? value === oldId ? 'INV-OLD' : value
      : Array.isArray(value) ? value.map(replace) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, replace(v)])) : value;
    const edited = objectCopy(replace(raw));
    (edited.manifest as Record<string, unknown>).revision = 'synthetic-test';
    p.collections.registry = { data: edited, digest: digestOf(edited) }; reseal(p);
    const review = reviewEvidencePackage(JSON.stringify(p), NOW);
    expect(review.current).toBeNull(); expect(review.currentError).toContain('unavailable');
    expect(review.historical.originals[0].id).toBe(old.id);
    expect(review.historical.collections.find((c) => c.kind === 'registry')!.changed).toBe(true);
  });
  it('rejects source substitution on export instead of assigning current sources to old results', () => {
    const { a, session } = workspace(); a.catalogDigest = 'a'.repeat(64); a.payloadSha256 = payloadDigest(a);
    session.receipts = [receiptFor(a)]; const { checksum: ignored, ...body } = session; void ignored; session.checksum = digestOf(body);
    expect(() => createEvidencePackage(session, [objectCopy(a)], NOW)).toThrow('embedded registry');
  });
  it('keeps draft-only work and the legacy session checksum unchanged', () => {
    const { session } = workspace(); const before = canonicalJson(session);
    const draft = makeSession(session.draft, session.selections, [], NOW);
    const p = createEvidencePackage(draft, [], NOW);
    expect(reviewEvidencePackage(JSON.stringify(p), NOW).current!.assessments).toEqual([]);
    const { a } = workspace(); expect(createEvidencePackage(session, [objectCopy(a)], NOW).session).toEqual(session);
    expect(canonicalJson(session)).toBe(before);
  });
  it('bounds bodies and nesting, rejects unsafe values and refuses cross-origin imports', async () => {
    expect(handlePackageReview(' '.repeat(MAX_PACKAGE_BYTES + 1)).status).toBe(400);
    expect(handlePackageCreate('{"session":{}}').status).toBe(400);
    expect(() => checkJsonShape({ value: Infinity })).toThrow();
    expect(() => checkJsonShape({ value: Number.MAX_SAFE_INTEGER + 1 })).toThrow();
    let nested: unknown = {}; for (let i = 0; i < 66; i++) nested = { nested };
    expect(() => checkJsonShape(nested)).toThrow('structural');
    const response = await POST(new Request('http://localhost:3000/api/package/recheck', { method: 'POST', headers: { origin: 'https://unrelated.invalid' }, body: '{}' }));
    expect(response.status).toBe(403);
  });
});
