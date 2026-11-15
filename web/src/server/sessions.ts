import { assess, type Assessment } from '../core/assess';
import { requireCatalog } from '../core/registry';
import { validateProposalIds } from '../core/handling';
import { proposalFromForm } from '../core/interpretation';
import { digestOf } from '../core/canonicalize';
import { buildResearchAnalyses } from '../core/researchSelections';
import { parseSession, resultFingerprint, sourceFingerprint, methodFingerprint, type RecheckedSession, type SessionCheck } from '../core/researchSession';
import type { Reply } from './handlers';

export function handleSession(rawText: string, now?: string): Reply {
  try {
    const session = parseSession(rawText);
    const catalog = requireCatalog();
    const draftErrors = validateProposalIds(session.draft.proposal, catalog);
    if (draftErrors.length) throw new Error(`Draft references unavailable catalogue entries: ${draftErrors.join('; ')}`);
    if (digestOf(proposalFromForm(session.draft.proposal)) !== digestOf(session.draft.proposal)) throw new Error('This draft contains fields that the current structured form cannot preserve. The session was not loaded.');
    buildResearchAnalyses(session.selections); // Validate the draft selection, even without any saved assessments.
    const byOldId = new Map<string, Assessment>();
    const checks: SessionCheck[] = [];
    for (const receipt of session.receipts) {
      const parent = receipt.parentAssessmentId ? byOldId.get(receipt.parentAssessmentId)! : null;
      const a = assess(receipt.request, catalog, { parent, now, researchSelections: receipt.selections });
      const sourceChanged = sourceFingerprint(a) !== receipt.sourceDigest || a.catalogDigest !== receipt.catalogDigest;
      const methodChanged = methodFingerprint(a) !== receipt.methodDigest || a.engineRevision !== receipt.engineRevision || a.rendererRevision !== receipt.rendererRevision;
      const resultChanged = resultFingerprint(a) !== receipt.resultDigest;
      checks.push({ previousAssessmentId: receipt.assessmentId, recomputedAssessmentId: a.id, sourceChanged, methodChanged, resultChanged,
        status: sourceChanged || methodChanged || resultChanged ? 'changed' : 'unchanged' });
      byOldId.set(receipt.assessmentId, a);
    }
    const body: RecheckedSession = { session, assessments: [...byOldId.values()], checks,
      notice: 'Recomputed locally from the current reviewed sources. A matching checksum detects accidental alteration; it does not authenticate the author or independently validate the science. Saved receipts are comparison references, not trusted results.' };
    return { status: 200, body };
  } catch (e) {
    return { status: 400, body: { code: 'invalid_session', message: e instanceof Error ? e.message : 'Session could not be rechecked. Nothing was loaded.' } };
  }
}
