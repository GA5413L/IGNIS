import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleAssess, handleCatalog, handleHealth, handleInterpret } from '../../src/server/handlers';
import { runtimeStatus } from '../../src/server/runtime';
import { checkProviderProposal, envelopeIsCurrent, proposalFromForm } from '../../src/core/interpretation';
import { W1, W2, W3, catalog, request, run } from '../helpers';

const envelope = (over: Record<string, unknown> = {}) => ({ draftId: 'D1', draftRevision: 3, catalogRevision: catalog().revision, runtimeConfigRevision: 'unselected', logicalCallId: 'CALL-1', ...over });

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe('health and catalogue', () => {
  it('reports AI unavailable and a valid registry', () => {
    const r = handleHealth();
    expect(r.status).toBe(200);
    expect((r.body as any).aiAvailable).toBe(false);
    expect((r.body as any).registryErrors).toBe(0);
  });
  it('catalogue counts come from validated records and expose no private paths', () => {
    const r = handleCatalog();
    const b = r.body as any;
    expect(b.counts.investigations).toBe(10);
    expect(b.counts.objectives).toBeGreaterThan(0);
    expect(JSON.stringify(b)).not.toMatch(/_raw|E:\\\\|F:\\\\|dpapi|api_key/i);
  });
});

describe('/api/interpret (M17, M27, AC22)', () => {
  it('M17: makes zero outbound inference and returns 503 with a typed fallback message', () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const r = handleInterpret(JSON.stringify({ envelope: envelope(), question: 'Compare heat release', selectedIds: [] }));
    expect(r.status).toBe(503);
    expect((r.body as any).code).toBe('ai_unavailable');
    expect((r.body as any).message).toMatch(/structured form/);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
  it('flags alone never enable a provider (no accepted configuration)', () => {
    const st = runtimeStatus({ AI_ENABLED: 'true', AI_PROVIDER: 'groq', AI_MODEL: 'openai/gpt-oss-20b', AI_RUNTIME_CONFIG_REVISION: 'r1', AI_AUTHORIZATION_ID: 'x', AI_USD_CAP: '1', AI_LOGICAL_CALL_CAP: '5' });
    expect(st.aiAvailable).toBe(false);
    expect(st.config.acceptance).toBe('rejected');
  });
  it('M27: oversized question → 413 without truncation; bad JSON → 400; stale catalogue → 409', () => {
    expect(handleInterpret(JSON.stringify({ envelope: envelope(), question: 'x'.repeat(2001), selectedIds: [] })).status).toBe(413);
    expect(handleInterpret('{not json').status).toBe(400);
    expect(handleInterpret(JSON.stringify({ envelope: envelope({ catalogRevision: 'old' }), question: 'q', selectedIds: [] })).status).toBe(409);
    expect(handleInterpret('x'.repeat(33 * 1024)).status).toBe(413);
  });
});

describe('interpretation contract, offline (amendment A-002, AC19, AC20, M16, M21)', () => {
  const s = catalog();
  const good = proposalFromForm(W1);
  it('accepts a valid closed proposal and derives handling in the application', () => {
    const r = checkProviderProposal(good, s);
    expect(r.state).toBe('proposal_ready');
    expect(r.handling!.handling).toBe('ready');
  });
  it('rejects extra verdict fields, invented IDs and invalid nested alternatives without coercion', () => {
    expect(checkProviderProposal({ ...good, verdict: 'validated' }, s).state).toBe('invalid');
    expect(checkProviderProposal({ ...good, physicalModelId: 'PM-INVENTED' }, s).state).toBe('invalid');
    expect(checkProviderProposal({ ...good, physicalModelId: 'pm-svi25' }, s).state).toBe('invalid');
    const nested = { ...good, ambiguities: [{ field: 'quantityIds', question: 'Which heat?', alternativeIds: ['Q-HEAT-CHEMICAL-RELEASE', 'normalized_source_total'] }] };
    const r = checkProviderProposal(nested, s);
    expect(r.state).toBe('invalid');
    expect(r.problems.join(' ')).toMatch(/unregistered alternative normalized_source_total/);
  });
  it('keeps intent separate from handling (master §10.2 examples)', () => {
    const assessModelNoQuantity = proposalFromForm({ intent: 'assess_physical_model', physicalModelId: 'PM-SVI25' });
    expect(checkProviderProposal(assessModelNoQuantity, s).handling!.handling).toBe('clarification_needed');
    expect(checkProviderProposal(assessModelNoQuantity, s).proposal!.intent).toBe('assess_physical_model');
    const exec = proposalFromForm({ intent: 'request_execution', requestedExecutionText: 'Run a new Mars simulation using my PDF.' });
    expect(checkProviderProposal(exec, s).handling!.handling).toBe('unsupported_action');
    const same = proposalFromForm({ intent: 'synthesize_findings', safetyAreas: ['detection'], investigationIds: ['INV-SAME'] });
    expect(checkProviderProposal(same, s).handling!.handling).toBe('ready');
    const heat = { ...proposalFromForm({ intent: 'assess_physical_model', physicalModelId: 'PM-SVI25' }), ambiguities: [{ field: 'quantityIds', question: 'Chemical heat release or sensible cabin heat?', alternativeIds: ['Q-HEAT-CHEMICAL-RELEASE', 'Q-HEAT-SENSIBLE-CABIN'] }] };
    const h = checkProviderProposal(heat, s);
    expect(h.state).toBe('proposal_ready');
    expect(h.handling!.handling).toBe('clarification_needed');
  });
  it('AC19/M16: a reply bound to an older draft or runtime configuration is not current', () => {
    const reply = { draftId: 'D1', draftRevision: 2, catalogRevision: s.revision, runtimeConfigRevision: 'unselected', callId: 'C1' };
    expect(envelopeIsCurrent(reply, { ...reply, draftRevision: 3 })).toBe(false);
    expect(envelopeIsCurrent(reply, { ...reply, runtimeConfigRevision: 'other' })).toBe(false);
    expect(envelopeIsCurrent(reply, reply)).toBe(true);
  });
});

describe('/api/assess', () => {
  it('returns a scientific incompatibility as 200, not an HTTP error', () => {
    const r = handleAssess(JSON.stringify({ request: request(W3), catalogRevision: catalog().revision }));
    expect(r.status).toBe(200);
    expect((r.body as any).claims.some((c: any) => c.outcome === 'incompatible_requested_claim')).toBe(true);
  });
  it('rejects a stale catalogue, a tampered parent and invalid IDs', () => {
    expect(handleAssess(JSON.stringify({ request: request(W2), catalogRevision: 'old' })).status).toBe(409);
    const parent = run(W1);
    const tampered = { ...parent, limitations: [] };
    expect(handleAssess(JSON.stringify({ request: request(W3), catalogRevision: catalog().revision, parent: tampered })).status).toBe(409);
    const bad = request(W2); bad.proposal.quantityIds = ['Q-NOT-REAL'];
    expect(handleAssess(JSON.stringify({ request: bad, catalogRevision: catalog().revision })).status).toBe(400);
  });
  it('accepts a verified parent and returns a revision difference', () => {
    const parent = run(W1);
    const child = request(W3, 'q', 'REQ-2');
    child.parentRequestRef = { id: parent.request.id, revision: parent.request.revision };
    const r = handleAssess(JSON.stringify({ request: child, catalogRevision: catalog().revision, parent }));
    expect(r.status).toBe(200);
    expect((r.body as any).revisionDifference.operation).toBe('question_change');
  });
  it('rejects local assessment bodies over 2 MiB', () => {
    expect(handleAssess('x'.repeat(2 * 1024 * 1024 + 1)).status).toBe(413);
  });
});
