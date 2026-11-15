import { afterEach, describe, expect, it, vi } from 'vitest';
import { handleSIPreview, handleSIStatus } from '../../src/server/si';
import { requireCatalog } from '../../src/core/registry';
import { buildInterpretationMessages } from '../../src/core/interpretation';
import { wireJsonSchema } from '../../src/core/wireProposal';
import { digestOf } from '../../src/core/canonicalize';

const request = () => ({ provider: 'groq', question: 'Can Saffire VI predict chemical heat release?', selectedIds: ['PM-SVI25', 'Q-HEAT-CHEMICAL-RELEASE'],
  envelope: { draftId: 'draft-1', draftRevision: 3, logicalCallId: 'preview-1', catalogRevision: requireCatalog().revision, runtimeConfigRevision: 'GROQ-OSS120-LOW' } });
afterEach(() => vi.unstubAllGlobals());

describe('SI packet preparation', () => {
  it('exposes only the two prepared candidates, never secrets or live availability', () => {
    const status = handleSIStatus();
    expect(status.status).toBe(200);
    expect(status.body).toMatchObject({ label: 'SI', liveAvailable: false, structuredAvailable: true, providers: [
      { provider: 'groq', accepted: false, execution: 'NOT RUN' }, { provider: 'gemini', accepted: false, execution: 'NOT RUN' },
    ] });
    expect(JSON.stringify(status.body)).not.toMatch(/API_KEY|authorizationId|keyEnv|process.env|C:\\|F:\\/);
  });
  it.each(['groq', 'gemini'])('prepares the exact public schema/instructions for %s with zero outbound calls', (provider) => {
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
    const input = request(); input.provider = provider; input.envelope.runtimeConfigRevision = provider === 'groq' ? 'GROQ-OSS120-LOW' : 'GEM38-LOW';
    const result = handleSIPreview(JSON.stringify(input));
    expect(result.status).toBe(200);
    const body = result.body as Record<string, unknown>;
    expect(body).toMatchObject({ provider, dispatched: false, inference: 'NOT RUN', envelope: input.envelope });
    expect(body.messages).toEqual(buildInterpretationMessages(requireCatalog(), input.question, input.selectedIds));
    expect(body.schema).toEqual(wireJsonSchema(requireCatalog()));
    const { packetSha256, dispatched, inference, ...packet } = body;
    expect([dispatched, inference]).toEqual([false, 'NOT RUN']);
    expect(packetSha256).toBe(digestOf(packet));
    expect(fetch).not.toHaveBeenCalled();
  });
  it('rejects BYOD, notebooks, history, supplied system prompts and credentials as additional fields', () => {
    for (const key of ['rawCsv', 'notebook', 'history', 'system', 'apiKey', 'researchSelections']) {
      expect(handleSIPreview(JSON.stringify({ ...request(), [key]: 'unapproved' })).status, key).toBe(400);
    }
  });
  it('rejects unknown/duplicate selected IDs and other providers', () => {
    for (const selectedIds of [['invented'], ['PM-SVI25', 'PM-SVI25'], Array(13).fill('PM-SVI25')]) {
      expect(handleSIPreview(JSON.stringify({ ...request(), selectedIds })).status).toBe(400);
    }
    expect(handleSIPreview(JSON.stringify({ ...request(), provider: 'openrouter' })).status).toBe(400);
  });
  it('fails closed on stale catalogue or mismatched provider configuration', () => {
    const input = request(); input.envelope.catalogRevision = 'old';
    expect(handleSIPreview(JSON.stringify(input)).status).toBe(409);
    input.envelope = request().envelope; input.envelope.runtimeConfigRevision = 'GEM38-LOW';
    expect(handleSIPreview(JSON.stringify(input)).status).toBe(409);
  });
  it('preserves a question verbatim and rejects empty, oversized and malformed input', () => {
    const input = request(); input.question = ' Do not substitute sensible heat for chemical heat.\n Keep my scope. ';
    const result = handleSIPreview(JSON.stringify(input));
    expect(result.status).toBe(200);
    const body = result.body as { messages: { user: string } };
    expect(JSON.parse(body.messages.user).question).toBe(input.question);
    for (const question of ['', '   ', 'x'.repeat(2001)]) expect(handleSIPreview(JSON.stringify({ ...input, question })).status).toBe(400);
    expect(handleSIPreview('{')).toMatchObject({ status: 400 });
    expect(handleSIPreview('x'.repeat(32769))).toMatchObject({ status: 413 });
  });
});
