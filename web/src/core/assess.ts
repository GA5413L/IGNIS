/**
 * Deterministic assessment pipeline (master §8.6). One immutable Assessment drives the view and both exports.
 * Scientific text comes from reviewed records and contract templates; no language model writes a claim.
 */
import type { ApplicabilityContract, ConfirmedRequest, ExecutionKind, Route, SafetyArea, ScientificOutcome } from './schemas';
import type { CatalogSnapshot } from './registry';
import { byId } from './registry';
import { evaluatePredicate, combine, type PredicateResult, type Truth } from './predicates';
import { runDerivations, type Derivation } from './derive';
import { retrieveFindings, rankInvestigations, requestedAreas, type RankingEntry } from './retrieval';
import { deriveHandling, validateProposalIds } from './handling';
import { digestOf } from './canonicalize';
import { compare, type RevisionDifference } from './revisions';
import { payloadDigest } from './digest';
import { buildResearchAnalyses, type ResearchAnalysis, type ResearchSelection } from './researchSelections';

export const SCHEMA_VERSION = 'ignis-assessment-1';
export const ENGINE_REVISION = 'engine-2026-11-15.5';
export const RENDERER_REVISION = 'renderer-2026-11-15.4';

export interface ClaimResult {
  id: string; kind: 'source_finding' | 'contract'; findingRef: { id: string; revision: string } | null;
  contractRef: { id: string; revision: string } | null; safetyAreas: SafetyArea[]; title: string; requestedUse: string;
  route: Route; outcome: ScientificOutcome | null; contractTruth: Truth | null; authoritativeText: string; sourceFindingText: string | null;
  qualifications: string[]; forbiddenStrongerClaims: string[]; predicateResults: PredicateResult[]; derivationIds: string[];
  consumedRefs: { id: string; revision: string }[]; missingRequirements: string[]; executionKind: ExecutionKind;
  evidenceKind: string | null; reviewLevel: string; sourceIds: string[]; presentation: 'lead' | 'more';
}

export interface Assessment {
  id: string; schemaVersion: string; request: ConfirmedRequest; catalogRevision: string; catalogDigest: string;
  engineRevision: string; rendererRevision: string; parentAssessmentId: string | null; state: 'current' | 'historical' | 'proposed' | 'synthetic';
  handling: { handling: string; missingRoutingFields: string[]; reasons: string[] };
  requestedAreas: SafetyArea[]; ranking: RankingEntry[]; claims: ClaimResult[]; derivations: Derivation[];
  evidenceSnapshot: Record<string, unknown[]>;
  readiness: { assets: { ref: { id: string; revision: string }; state: 'acquired' | 'not_acquired' | 'unresolved' }[];
    linkage: string; protocol: string; replay: string; numericalVerification: string; externalReview: unknown[] };
  revisionDifference: RevisionDifference | null; limitations: string[]; aiUse: string;
  dependencyDigest: string; payloadSha256: string; integrityMeaning: 'checksum_not_signature';
  reproductionScope: 'selected_analysis'; createdAt: string;
  researchAnalyses?: ResearchAnalysis[];
}

export { payloadDigest } from './digest';

function contractMatches(c: ApplicabilityContract, r: ConfirmedRequest): boolean {
  const p = r.proposal;
  if (c.selector.modelId !== p.physicalModelId) return false;
  if (!c.selector.quantityIds.some((q) => p.quantityIds.includes(q))) return false;
  if (!c.selector.requestedClaims.includes(p.requestedClaim)) return false;
  if (c.selector.temporalScopes && !c.selector.temporalScopes.includes(p.temporalScope)) return false;
  if (c.selector.eventIds && !c.selector.eventIds.some((e) => p.eventIds.includes(e))) return false;
  return true;
}

function interpolate(text: string, s: CatalogSnapshot, dv: Map<string, Derivation>): string {
  return text.replace(/\{(obs|dv):([^}]+)\}/g, (_, kind: string, id: string) => {
    if (kind === 'obs') {
      const o = byId(s.observations, id);
      const v = o?.value;
      if (!v || v.state !== 'known') return '[value not available]';
      return v.originalText && v.unit && v.unit !== '1' && !v.originalText.includes(v.unit) ? `${v.originalText} ${v.unit}` : (v.originalText ?? String(v.value));
    }
    const d = dv.get(id);
    return d && d.output.state === 'known' ? d.displayText : '[not computed]';
  });
}

export interface AssessOptions { now?: string; parent?: Assessment | null; researchSelections?: ResearchSelection[] }

export function assess(request: ConfirmedRequest, s: CatalogSnapshot, opts: AssessOptions = {}): Assessment {
  const parentRequest = opts.parent?.request;
  if (parentRequest ? request.parentRequestRef?.id !== parentRequest.id || request.parentRequestRef.revision !== parentRequest.revision : request.parentRequestRef !== null)
    throw new AssessError(409, 'parent_request_mismatch', 'Request ancestry does not match the supplied assessment. Reconfirm the current request.');
  if (parentRequest?.id === request.id || parentRequest?.parentRequestRef?.id === request.id)
    throw new AssessError(409, 'duplicate_request_identity', 'A revision must not reuse a known ancestor request identity.');
  let researchAnalyses: ResearchAnalysis[];
  try { researchAnalyses = buildResearchAnalyses(opts.researchSelections); }
  catch (e) { throw new AssessError(400, 'invalid_research_selection', e instanceof Error ? e.message : 'Invalid selected analysis.'); }
  const idErrors = validateProposalIds(request.proposal, s);
  if (idErrors.length) throw new AssessError(400, 'invalid_ids', idErrors.join('; '));
  const handling = deriveHandling(request.proposal);
  const p = request.proposal;
  if (handling.handling === 'ready' && p.intent === 'assess_physical_model') {
    const modelInvestigation = byId(s.models, p.physicalModelId!)?.investigationRef?.id;
    const unrelatedEvents = p.eventIds.filter((id) => modelInvestigation && byId(s.events, id)?.investigationRef.id !== modelInvestigation);
    const unrelatedInvestigations = p.investigationIds.filter((id) => modelInvestigation && id !== modelInvestigation);
    if (unrelatedEvents.length || unrelatedInvestigations.length) {
      handling.handling = 'clarification_needed';
      handling.missingRoutingFields.push('reviewedApplicabilityScope');
      handling.reasons.push(`The selected evidence scope (${[...unrelatedEvents, ...unrelatedInvestigations].join(', ')}) is outside the selected model's investigation. No reviewed cross-investigation applicability contract is established; the model and selected evidence remain unchanged.`);
    }
    const candidates = s.contracts.filter((c) => contractMatches(c, request));
    const uncovered = p.quantityIds.filter((id) => !candidates.some((c) => c.selector.quantityIds.includes(id)));
    if (candidates.length && uncovered.length) {
      handling.handling = 'clarification_needed';
      handling.missingRoutingFields.push('reviewedQuantityScope');
      handling.reasons.push(`Only part of the requested quantity/claim scope has a reviewed contract. Uncovered: ${uncovered.map((id) => byId(s.entities, id)?.displayName ?? id).join(', ')}. No partial model verdict is presented as covering the complete request.`);
    }
  }
  const areas = requestedAreas(p);
  const claims: ClaimResult[] = [];
  const derivations: Derivation[] = [];
  const usedContracts: ApplicabilityContract[] = [];

  const retrieved = handling.handling === 'unsupported_action' ? [] : retrieveFindings(p, s, request.originalText);
  const ranking = rankInvestigations(p, s, retrieved);

  // 1. model-specific contracts (only when routing is complete)
  if (handling.handling === 'ready' && p.intent === 'assess_physical_model') {
    for (const c of s.contracts.filter((c) => contractMatches(c, request))) {
      usedContracts.push(c);
      const results = c.requirements.map((pr) => evaluatePredicate(pr, s));
      let truth = combine(results);
      const dv = truth === 'satisfied' ? runDerivations(c.derivations, s) : [];
      // A permitted numeric conclusion also requires its declared arithmetic to be available.
      // A specification-only identity has a known symbolic output and remains eligible.
      for (const d of dv.filter((item) => item.output.state !== 'known')) results.push({
        predicateId: `PR-DERIVATION-${d.id}`, truth: 'unknown', critical: true,
        description: `Required source arithmetic is available: ${d.label}`,
        reason: d.output.reason ?? 'The declared computation was not available.', consumedRefs: d.inputRefs, missingFieldIds: [],
      });
      truth = combine(results);
      const branch = c.branches[truth];
      dv.forEach((d) => derivations.push({ ...d, id: `${c.id}/${d.id}` }));
      const dvMap = new Map(dv.map((d) => [d.id, d]));
      const missing = results.filter((r) => r.truth === 'unknown').map((r) => `${r.description}: ${r.reason}`);
      const firstFinding = c.findingRefs[0] ? byId(s.findings, c.findingRefs[0].id) : undefined;
      claims.push({
        id: `CL-${c.id}`, kind: 'contract', findingRef: c.findingRefs[0] ?? null, contractRef: { id: c.id, revision: c.revision },
        safetyAreas: firstFinding?.safetyAreas ?? [], title: c.permittedUse, requestedUse: c.permittedUse,
        route: branch.route, outcome: branch.outcome, contractTruth: truth, authoritativeText: interpolate(branch.text, s, dvMap),
        sourceFindingText: null, qualifications: [], forbiddenStrongerClaims: c.forbiddenClaims, predicateResults: results,
        derivationIds: dv.map((d) => `${c.id}/${d.id}`), consumedRefs: dedupeRefs([...results.flatMap((r) => r.consumedRefs), ...c.findingRefs, ...dv.flatMap((d) => d.inputRefs)]),
        missingRequirements: missing, executionKind: dv.some((d) => d.executionKind === 'source_arithmetic') ? 'source_arithmetic' : branch.executionKind,
        evidenceKind: null, reviewLevel: c.review.level, sourceIds: [], presentation: 'lead',
      });
    }
    if (!usedContracts.length) {
      handling.reasons.push('No reviewed applicability contract covers this model, quantity and claim combination. Source findings are shown; no comparison is specified.');
    }
  }

  // 2. source findings (brief, browse, or the evidence behind a model assessment)
  const perAreaLead = new Map<SafetyArea, number>();
  const contractFindingIds = new Set(usedContracts.flatMap((c) => c.findingRefs.map((r) => r.id)));
  const findingList = p.intent === 'assess_physical_model' && handling.handling === 'ready'
    ? retrieved.filter((r) => contractFindingIds.has(r.finding.id) || r.tier <= 2)
    : retrieved;
  for (const r of findingList) {
    const f = r.finding;
    const a = byId(s.assertions, f.assertionRef.id)!;
    const srcIds = [...new Set(a.sourceLocators.map((l) => l.source.id))];
    const area = r.area.find((x) => areas.includes(x)) ?? r.area[0];
    const n = perAreaLead.get(area) ?? 0;
    const lead = f.briefRole === 'finding' && r.tier <= 4 && n < 2 && !r.reasonCodes.some((c) => c.startsWith('QUALIFIES_'));
    if (lead) perAreaLead.set(area, n + 1);
    claims.push({
      id: `CL-${f.id}`, kind: 'source_finding', findingRef: { id: f.id, revision: f.revision }, contractRef: null,
      safetyAreas: r.area, title: f.title, requestedUse: f.briefRole === 'context' ? 'Context for the question' : 'Source finding as reported',
      route: f.briefRole === 'context' ? 'context' : 'direct', outcome: null, contractTruth: null,
      authoritativeText: f.implication, sourceFindingText: a.statement,
      qualifications: [...a.qualifications, ...f.domain.exclusions.map((x) => `Not covered: ${x}.`)],
      forbiddenStrongerClaims: [], predicateResults: [], derivationIds: [],
      consumedRefs: dedupeRefs([{ id: f.id, revision: f.revision }, f.assertionRef, ...f.observationRefs, ...f.eventRefs]),
      missingRequirements: [], executionKind: 'source_description', evidenceKind: a.kind, reviewLevel: a.review.level, sourceIds: srcIds,
      presentation: lead ? 'lead' : 'more',
    });
  }

  const assets = usedContracts.flatMap((c) => c.requirements).filter((pr) => pr.operation === 'asset_matched')
    .flatMap((pr) => (pr.argument as { observationIds: string[] }).observationIds)
    .filter((v, i, xs) => xs.indexOf(v) === i)
    .map((id) => { const o = byId(s.observations, id)!; return { ref: { id: o.id, revision: o.revision }, state: o.value?.state === 'known' ? 'acquired' as const : 'not_acquired' as const }; });

  const snapshot = closure(s, claims, derivations, usedContracts, ranking);
  const limitations = [
    'All records are assistant-checked against event-time source bytes; no independent human review has taken place.',
    'Source findings are reported as the sources state them; IGNIS paraphrases are labelled as IGNIS wording.',
    'No risk score, safety threshold, approved atmosphere or new physical prediction is produced.',
    'Export scope is the selected analysis: it reproduces these claims and calculations, not exhaustive retrieval over all literature.',
  ];
  if (handling.handling !== 'ready') limitations.unshift('Routing is incomplete or unsupported; no model-specific scientific verdict was produced.');

  const base: Omit<Assessment, 'id' | 'payloadSha256' | 'dependencyDigest' | 'revisionDifference'> = {
    schemaVersion: SCHEMA_VERSION, request, catalogRevision: s.revision, catalogDigest: s.digest, engineRevision: ENGINE_REVISION,
    rendererRevision: RENDERER_REVISION, parentAssessmentId: opts.parent?.id ?? null, state: 'current', handling,
    requestedAreas: areas, ranking, claims, derivations, evidenceSnapshot: snapshot, researchAnalyses,
    readiness: { assets, linkage: usedContracts.length ? 'unresolved' : 'not_applicable', protocol: usedContracts.length ? 'partial' : 'not_applicable',
      replay: usedContracts.length ? 'not_run' : 'not_applicable',
      numericalVerification: derivations.some((d) => d.executionKind === 'source_arithmetic' && d.output.state === 'known') ? 'checked' : 'not_assessed',
      externalReview: [] },
    limitations, aiUse: request.inputMode === 'ai_assisted' ? 'Question interpreted with AI assistance, then confirmed by the user; all scientific text comes from reviewed records.' : 'No AI was used for this request (structured form). Scientific text comes from reviewed records and contract templates.',
    reproductionScope: 'selected_analysis', integrityMeaning: 'checksum_not_signature', createdAt: opts.now ?? new Date().toISOString(),
  };
  const dependencyDigest = digestOf({ requestId: request.id, request, parent: opts.parent?.id ?? null, catalogDigest: s.digest, engine: ENGINE_REVISION, renderer: RENDERER_REVISION, contracts: usedContracts.map((c) => [c.id, c.revision]), research: researchAnalyses.map((a) => ({ selection: a.selection, sourceDigest: a.sourceDigest, methodRevision: a.methodRevision, resultDigest: a.resultDigest })) });
  const id = `ASMT-${dependencyDigest.slice(0, 16)}`;
  const withDiff = { ...base, id, dependencyDigest, revisionDifference: null as RevisionDifference | null };
  const labelOf = (id: string) => byId(s.entities, id)?.displayName ?? byId(s.models, id)?.displayName ?? byId(s.investigations, id)?.displayName
    ?? byId(s.events, id)?.sourceLabels[0] ?? id.replace(/_/g, ' ');
  if (opts.parent) withDiff.revisionDifference = compare(opts.parent, withDiff as Assessment, labelOf);
  const payloadSha256 = payloadDigest(withDiff);
  return { ...withDiff, payloadSha256 };
}

export class AssessError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}

function dedupeRefs(rs: { id: string; revision: string }[]) {
  const seen = new Set<string>();
  return rs.filter((r) => (seen.has(r.id) ? false : (seen.add(r.id), true))).map((r) => ({ id: r.id, revision: r.revision }));
}

/** Transitive closure of everything the exported claims and derivations consume (master §9.5). */
function closure(s: CatalogSnapshot, claims: ClaimResult[], dv: Derivation[], contracts: ApplicabilityContract[], ranking: RankingEntry[]) {
  const groups = ['sources', 'assertions', 'entities', 'conflicts', 'investigations', 'events', 'models', 'uses', 'observations', 'findings', 'contracts', 'methods', 'families'] as const;
  const records = new Map<string, { id: string }>();
  for (const group of groups) for (const record of s[group]) records.set(record.id, record);
  const selected = new Set<string>();
  const queue: string[] = [];
  const add = (id: string) => {
    if (!records.has(id)) throw new Error(`Export dependency is missing from the catalogue: ${id}.`);
    if (!selected.has(id)) { selected.add(id); queue.push(id); }
  };
  [...claims.flatMap((c) => c.consumedRefs.map((r) => r.id)), ...dv.flatMap((d) => d.inputRefs.map((r) => r.id)),
    ...contracts.map((c) => c.id), ...ranking.map((r) => r.investigationId)].forEach(add);

  // Follow the actual registered identifiers throughout each selected record, including
  // conditions, endpoint definitions, source locators, lineage, review ancestry, conflicts
  // and model-use records. Queue membership terminates bibliographic/reference cycles.
  // Linked context may be included; this does not claim exhaustive literature retrieval.
  const visit = (value: unknown): void => {
    if (typeof value === 'string') { if (records.has(value)) add(value); return; }
    if (Array.isArray(value)) { value.forEach(visit); return; }
    if (value !== null && typeof value === 'object') Object.values(value).forEach(visit);
  };
  for (let i = 0; i < queue.length; i += 1) visit(records.get(queue[i])!);
  const snapshot: Record<string, unknown[]> = {};
  for (const group of groups) snapshot[group] = s[group].filter((record) => selected.has(record.id));
  // An exported assessment must never become a write-through view of the shared catalogue.
  return structuredClone(snapshot);
}
