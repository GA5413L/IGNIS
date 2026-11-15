/** SI preparation endpoints. Preview builds a public catalogue packet; it never dispatches inference. */
import { z } from 'zod';
import { InterpretRequest, MAX_INTERPRET_BODY_BYTES, buildInterpretationMessages, INTERPRETER_CONTRACT_VERSION } from '../core/interpretation';
import { catalogIdSets, wireJsonSchema } from '../core/wireProposal';
import { requireCatalog } from '../core/registry';
import { digestOf } from '../core/canonicalize';
import { configById } from './providers/configs';
import type { Reply } from './handlers';

const PROVIDERS = { groq: 'GROQ-OSS120-LOW', gemini: 'GEM38-LOW' } as const;
const PreviewRequest = InterpretRequest.extend({ provider: z.enum(['groq', 'gemini']) });

export function handleSIStatus(): Reply {
  return { status: 200, body: {
    schemaVersion: 'ignis-si-status-1', label: 'SI', name: 'Scientific Intelligence',
    liveAvailable: false, structuredAvailable: true, packetPreviewAvailable: true,
    stage: 'awaiting_provider_evaluation', contractVersion: INTERPRETER_CONTRACT_VERSION,
    providers: Object.entries(PROVIDERS).map(([provider, id]) => {
      const c = configById(id);
      return { provider, configurationId: c.id, model: c.model, accepted: false, execution: 'NOT RUN' };
    }),
    limits: { questionCharacters: 2000, selectedIds: 12, bodyBytes: MAX_INTERPRET_BODY_BYTES },
    dataScope: 'Question, explicit catalogue IDs, public catalogue definitions, instructions and schema. Local CSV files and notebook contents are excluded.',
  } };
}

export function handleSIPreview(raw: string): Reply {
  const error = (status: number, message: string): Reply => ({ status, body: { code: 'si_preview_invalid', message } });
  if (new TextEncoder().encode(raw).byteLength > MAX_INTERPRET_BODY_BYTES) return error(413, 'SI preview exceeds 32 KiB; nothing was truncated.');
  let value: unknown;
  try { value = JSON.parse(raw); } catch { return error(400, 'SI preview must be JSON.'); }
  const parsed = PreviewRequest.safeParse(value);
  if (!parsed.success) return error(400, 'Provide a question up to 2,000 characters, up to 12 selected IDs, a current envelope and either Groq or Gemini. Additional fields are not accepted.');
  const input = parsed.data;
  if (!input.question.trim()) return error(400, 'Enter a nonblank question.');
  const s = requireCatalog();
  if (input.envelope.catalogRevision !== s.revision) return error(409, 'The catalogue changed. Refresh before preparing an SI packet.');
  const cfg = configById(PROVIDERS[input.provider]);
  if (input.envelope.runtimeConfigRevision !== cfg.id) return error(409, 'The chosen SI configuration changed. Prepare a new packet.');
  const ids = new Set(Object.values(catalogIdSets(s)).flat());
  if (new Set(input.selectedIds).size !== input.selectedIds.length || input.selectedIds.some((id) => !ids.has(id))) return error(400, 'Selected IDs must be unique registered catalogue entries.');
  const packet = {
    schemaVersion: 'ignis-si-packet-preview-1', provider: input.provider, configurationId: cfg.id, model: cfg.model,
    envelope: input.envelope, catalogRevision: s.revision, catalogDigest: s.digest,
    messages: buildInterpretationMessages(s, input.question, input.selectedIds),
    schema: wireJsonSchema(s), schemaName: 'ignis_interpretation',
  };
  return { status: 200, body: { ...packet, packetSha256: digestOf(packet), dispatched: false, inference: 'NOT RUN' } };
}
