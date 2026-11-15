import { describe, it, expect } from 'vitest';
import { assess, type Assessment } from '../../src/core/assess';
import { compare } from '../../src/core/revisions';
import { exportJson, exportMarkdown } from '../../src/core/export';
import { payloadDigest } from '../../src/core/digest';
import { digestOf } from '../../src/core/canonicalize';
import { makeSession, parseSession, methodFingerprint, type ResearchSession, type RecheckedSession } from '../../src/core/researchSession';
import { buildResearchAnalysis, type ResearchSelection } from '../../src/core/researchSelections';
import { DEFAULT_PAIR_SELECTION } from '../../src/core/pairedDetector';
import { DEFAULT_CUTOFF_ENVELOPE_SELECTION } from '../../src/core/cutoffEnvelope';
import { handleSession } from '../../src/server/sessions';
import { handleAssess } from '../../src/server/handlers';
import { POST } from '../../src/app/api/session/route';
import { catalog, request, BRIEF, NOW, W1 } from '../helpers';

const condition: ResearchSelection = { kind: 'conditions', cohortId: 'PMMA-2', oxygenPercent: 22, pressureKPa: 54.4 };
const detector: ResearchSelection = { kind: 'detector', flight: 'all', material: 'Kapton', channel: 'issScatterV', cutoff: 2, includeReference: false };
const paired: ResearchSelection = { kind: 'detector_pair', options: { ...DEFAULT_PAIR_SELECTION, exclusions: [] } };
const run = (selections: ResearchSelection[] = [condition, detector]) => assess(request(BRIEF), catalog(), { now: NOW, researchSelections: selections });
const packetFor = (a: Assessment = run()) => makeSession({ question: a.request.originalText, proposal: a.request.proposal }, a.researchAnalyses!.map((r) => r.selection), [a], NOW);
function seal(packet: ResearchSession) { const { checksum: oldChecksum, ...body } = packet; expect(oldChecksum).toHaveLength(64); return { ...body, checksum: digestOf(body) }; }
function recheck(packet: ResearchSession): RecheckedSession { const reply = handleSession(JSON.stringify(packet), NOW); expect(reply.status).toBe(200); return reply.body as RecheckedSession; }

describe('selected research analyses', () => {
  it('preserves an exact cutoff certificate through assessment, both exports and notebook recheck', () => {
    const selection: ResearchSelection = { kind: 'cutoff_envelope', options: { ...DEFAULT_CUTOFF_ENVELOPE_SELECTION } };
    const a = run([selection]);
    const analysis = a.researchAnalyses![0];
    expect(analysis.kind).toBe('cutoff_envelope');
    if (analysis.kind !== 'cutoff_envelope') throw new Error('wrong fixture');
    expect(analysis.result.summary.pairedDifferenceEnvelope).toMatchObject({ lowerNumerator: 66, upperNumerator: 78, denominator: 133 });
    const markdown = exportMarkdown(a);
    expect(markdown).toContain('[66, 78] / 133'); expect(markdown).toContain('AW50'); expect(markdown).toContain('AV50');
    expect(JSON.parse(exportJson(a)).researchAnalyses[0].result).toEqual(analysis.result);
    const replay = recheck(packetFor(a));
    expect(replay.checks[0]).toMatchObject({ status: 'unchanged', sourceChanged: false, methodChanged: false, resultChanged: false });
    expect(replay.assessments[0].researchAnalyses![0].resultDigest).toBe(analysis.resultDigest);
    const wider = run([{ ...selection, options: { ...selection.options, rangeA: { min: 0, max: 5 }, rangeB: { min: 0, max: 5 } } }]);
    expect(wider.id).not.toBe(a.id); expect(compare(a, wider).changedFields).toContain('selected_source_analysis');
    expect(wider.claims).toEqual(a.claims);
  });
  it('can revise a request carrying all four descriptive analyses within the API body cap', () => {
    const selections: ResearchSelection[] = [condition, detector,
      { kind: 'detector_pair', options: { ...DEFAULT_PAIR_SELECTION, includeReference: true } },
      { kind: 'cutoff_envelope', options: { ...DEFAULT_CUTOFF_ENVELOPE_SELECTION, includeReference: true, rangeA: { min: 0, max: 5 }, rangeB: { min: 0, max: 5 } } }];
    const parent = run(selections);
    const revision = request(BRIEF);
    revision.id += '-revision';
    revision.parentRequestRef = { id: parent.request.id, revision: parent.request.revision };
    const reply = handleAssess(JSON.stringify({ request: revision, catalogRevision: catalog().revision, parent, researchSelections: selections }));
    expect(reply.status).toBe(200);
    expect((reply.body as Assessment).researchAnalyses).toHaveLength(4);
  });
  it('does not reuse an immutable assessment identity for different confirmed text', () => {
    const a = assess(request(BRIEF, 'original question'), catalog(), { now: NOW });
    const b = assess(request(BRIEF, 'changed text with the same request identifier'), catalog(), { now: NOW });
    expect(a.id).not.toBe(b.id); expect(a.claims).toEqual(b.claims);
  });
  it('binds exact coordinates, missing readings and source cells to one immutable assessment and exports', () => {
    const a = run();
    const json = JSON.parse(exportJson(a));
    expect(json.researchAnalyses[0].result.target).toEqual({ oxygenPercent: 22, pressureKPa: 54.4 });
    expect(json.researchAnalyses[1].result.counts).toMatchObject({ total: 36, finite: 35, below: 20, missing: 1 });
    expect(json.researchAnalyses[1].result.rows.find((r: any) => r.measurement.cell === 'AW50').measurement.value).toBeNull();
    const md = exportMarkdown(a);
    expect(md).toContain('AW50'); expect(md).toContain('22'); expect(md).toContain('54.4');
    expect(md).toContain(a.researchAnalyses![0].resultDigest);
    expect(a.researchAnalyses!.every((r) => r.role === 'descriptive_context_not_model_validation')).toBe(true);
  });
  it('does not change published model claims or derivations when descriptive context is added', () => {
    const req = request(W1);
    const a = assess(req, catalog(), { now: NOW });
    const b = assess(req, catalog(), { now: NOW, researchSelections: [paired] });
    expect(b.claims).toEqual(a.claims); expect(b.derivations).toEqual(a.derivations);
    expect(b.payloadSha256).not.toBe(a.payloadSha256); expect(b.id).not.toBe(a.id);
    expect(exportMarkdown(b)).toContain('AW50'); expect(exportMarkdown(b)).toContain('AV50');
  });
  it('rejects duplicate kinds and invalid source cohorts instead of dropping an attachment', () => {
    expect(() => run([condition, { ...condition, oxygenPercent: 30 }])).toThrow();
    expect(() => buildResearchAnalysis({ ...condition, cohortId: 'invented' })).toThrow();
    expect(handleAssess(JSON.stringify({ request: request(BRIEF), catalogRevision: catalog().revision, researchSelections: [{ ...detector, invented: true }] })).status).toBe(400);
  });
  it('records selection-only changes as analytical scope changes', () => {
    const a = run([condition]); const b = run([{ ...condition, oxygenPercent: 30 }]);
    const difference = compare(a, b);
    expect(difference.operation).toBe('analytical_scope_change');
    expect(difference.changedFields).toContain('selected_source_analysis');
    expect(difference.changedFields).not.toContain('analysis_source_basis');
  });
  it('separately records source-only and method-only drift', () => {
    const a = run([condition]); const b = structuredClone(a);
    b.researchAnalyses![0].sourceDigest = 'b'.repeat(64); b.researchAnalyses![0].methodRevision = 'historical-method';
    expect(compare(a, b).changedFields).toEqual(expect.arrayContaining(['analysis_source_basis', 'analysis_method']));
  });
});

describe('portable research-session replay', () => {
  it('recomputes unchanged source, method and results without trusting imported results', () => {
    const packet = packetFor(run([condition, detector, paired]));
    const checked = recheck(packet);
    expect(checked.checks[0]).toMatchObject({ status: 'unchanged', sourceChanged: false, methodChanged: false, resultChanged: false });
    expect(checked.assessments[0].researchAnalyses).toHaveLength(3);
    expect(checked.notice).toContain('not trusted results');
    expect(packet.receipts[0]).not.toHaveProperty('claims');
  });
  it('keeps source, method and result drift distinguishable', () => {
    for (const key of ['sourceDigest', 'methodDigest', 'resultDigest'] as const) {
      const packet = packetFor(); packet.receipts[0][key] = 'b'.repeat(64);
      const check = recheck(seal(packet)).checks[0];
      expect([check.sourceChanged, check.methodChanged, check.resultChanged]).toEqual([key === 'sourceDigest', key === 'methodDigest', key === 'resultDigest']);
    }
  });
  it('detects descriptive-method-only drift even if numeric results and engine are identical', () => {
    const a = run(); const prior = structuredClone(a);
    prior.researchAnalyses![0].methodRevision = 'previous-descriptive-method';
    prior.payloadSha256 = payloadDigest(prior);
    expect(methodFingerprint(a)).not.toBe(methodFingerprint(prior));
    expect(recheck(packetFor(prior)).checks[0]).toMatchObject({ sourceChanged: false, methodChanged: true, resultChanged: false });
  });
  it('recomputes parent chains and preserves original question ancestry', () => {
    const a = run(); const req = request(BRIEF, 'second question', 'REQ-SECOND');
    req.parentRequestRef = { id: a.request.id, revision: a.request.revision };
    const b = assess(req, catalog(), { now: NOW, parent: a, researchSelections: [paired] });
    const packet = makeSession({ question: req.originalText, proposal: req.proposal }, [paired], [a, b], NOW);
    const checked = recheck(packet);
    expect(checked.assessments[1].parentAssessmentId).toBe(checked.assessments[0].id);
    expect(checked.checks.every((c) => c.status === 'unchanged')).toBe(true);
  });
  it('fails atomically on checksum tampering, orphan parents, duplicate identities and unsupported fields', () => {
    const packet = packetFor(); packet.draft.question = 'edited without a new checksum';
    expect(handleSession(JSON.stringify(packet)).status).toBe(400);
    const orphan = packetFor(); orphan.receipts[0].parentAssessmentId = 'missing-parent';
    expect(handleSession(JSON.stringify(seal(orphan))).status).toBe(400);
    const duplicate = packetFor(); duplicate.receipts.push(duplicate.receipts[0]);
    expect(handleSession(JSON.stringify(seal(duplicate))).status).toBe(400);
    expect(handleSession(JSON.stringify({ ...packetFor(), results: [{ claim: 'forged' }] })).status).toBe(400);
  });
  it('rejects ancestry mismatch, ambiguous duplicate selections and unsupported draft context', () => {
    const badParent = packetFor(); badParent.receipts[0].request.parentRequestRef = { id: 'unrecorded', revision: 'r1' };
    expect(handleSession(JSON.stringify(seal(badParent))).status).toBe(400);
    const duplicate = packetFor(); duplicate.selections.push(condition);
    expect(handleSession(JSON.stringify(seal(duplicate))).status).toBe(400);
    const context = packetFor(); context.draft.proposal.unknownTerms = ['unrepresented draft field'];
    expect(handleSession(JSON.stringify(seal(context))).status).toBe(400);
  });
  it('supports draft-only sessions without inventing an assessment', () => {
    const packet = makeSession({ question: 'a draft', proposal: request(BRIEF).proposal }, [condition], [], NOW);
    const checked = recheck(packet); expect(checked.assessments).toEqual([]); expect(checked.checks).toEqual([]);
  });
  it('bounds input size and history and detects altered assessments before saving', () => {
    expect(() => parseSession(' '.repeat(2 * 1024 * 1024 + 1))).toThrow('exceeds');
    expect(() => makeSession({ question: '', proposal: request(BRIEF).proposal }, [], Array(17).fill(run()), NOW)).toThrow();
    const altered = run(); altered.request.originalText = 'changed'; expect(() => packetFor(altered)).toThrow('checksum');
  });
  it('rejects cross-origin session submissions without computing a result', async () => {
    const response = await POST(new Request('http://localhost:3000/api/session', { method: 'POST', headers: { origin: 'https://unrelated.invalid' }, body: JSON.stringify(packetFor()) }));
    expect(response.status).toBe(403);
  });
});
