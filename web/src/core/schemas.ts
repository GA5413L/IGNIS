/**
 * Runtime contracts for the reviewed registry, confirmed requests and interpreter proposals (master spec §7.3).
 * Static TypeScript types are inferred from these schemas; JSON from disk or from a provider is always parsed here.
 */
import { z } from 'zod';

export const Id = z.string().min(1).max(120).regex(/^[A-Za-z0-9][A-Za-z0-9._:-]*$/, 'invalid identifier');
export const Revision = z.string().min(1).max(40);
export const Ref = z.object({ id: Id, revision: Revision });
export type Ref = z.infer<typeof Ref>;

export const SafetyArea = z.enum(['prevention', 'detection', 'suppression']);
export type SafetyArea = z.infer<typeof SafetyArea>;
export const EvidenceKind = z.enum(['objective', 'hypothesis', 'observed_result', 'published_model_result', 'derived_calculation']);
export const ReviewLevel = z.enum(['unreviewed', 'assistant_checked', 'human_checked']);
export const Route = z.enum(['direct', 'conditional_model_candidate', 'context', 'no_supported_route']);
export type Route = z.infer<typeof Route>;
export const ScientificOutcome = z.enum(['specified_conditional_comparison', 'descriptive_consistency_check', 'incompatible_requested_claim', 'unresolved_requirement']);
export type ScientificOutcome = z.infer<typeof ScientificOutcome>;
export const ExecutionKind = z.enum(['source_description', 'specification', 'source_arithmetic', 'published_result_not_reproduced', 'reproduced_computation']);
export type ExecutionKind = z.infer<typeof ExecutionKind>;
export const Intent = z.enum(['browse_investigations', 'synthesize_findings', 'compare_evidence', 'assess_physical_model', 'propose_physical_model', 'request_execution', 'other']);
export type Intent = z.infer<typeof Intent>;
export const Handling = z.enum(['ready', 'clarification_needed', 'unsupported_action']);
export type Handling = z.infer<typeof Handling>;
export const RequestedFeature = z.enum(['level', 'change', 'series', 'definition', 'unspecified']);
export const TemporalScope = z.enum(['initial', 'subsequent', 'whole_record', 'unspecified']);
export type TemporalScope = z.infer<typeof TemporalScope>;
export const RequestedClaim = z.enum(['description', 'comparison', 'independent_prediction', 'conditional_response', 'transfer', 'unspecified']);
export type RequestedClaim = z.infer<typeof RequestedClaim>;

export const Locator = z.object({
  source: Ref, pdfPage: z.number().int().positive().nullable(), printedPage: z.string().nullable(),
  section: z.string().nullable(), tableOrFigure: z.string().nullable(), rowOrCell: z.string().nullable(), textAnchor: z.string().nullable(),
});
export type Locator = z.infer<typeof Locator>;

export const Review = z.object({
  level: ReviewLevel, reviewerLabel: z.string().nullable(), reviewedAt: z.string().nullable(), scope: z.string(), method: z.string(),
  inheritedFrom: Ref.nullable(), independentOfDesign: z.boolean().nullable(),
});
export type Review = z.infer<typeof Review>;

export const QuantityValue = z.object({
  state: z.enum(['known', 'unknown', 'not_applicable', 'conflicted']),
  value: z.union([z.number(), z.string(), z.boolean(), z.array(z.number())]).nullable(),
  unit: z.string().nullable(), basis: z.string().nullable(), originalText: z.string().nullable(), originalUnit: z.string().nullable(),
  uncertaintyText: z.string().nullable(), reason: z.string().nullable(), evidence: z.array(Locator),
}).superRefine((v, ctx) => {
  if (v.state === 'known' && v.value === null) ctx.addIssue({ code: 'custom', message: 'known value must not be null' });
  if (v.state !== 'known' && v.value !== null) ctx.addIssue({ code: 'custom', message: 'unknown/not-applicable value must be null, never a placeholder' });
  if (v.state === 'unknown' && !v.reason) ctx.addIssue({ code: 'custom', message: 'unknown value needs a reason' });
});
export type QuantityValue = z.infer<typeof QuantityValue>;

const file = <T extends z.ZodTypeAny>(record: T) => z.object({ schemaVersion: z.literal('ignis-registry-1'), note: z.string().optional(), records: z.array(record) });

export const Source = z.object({
  id: Id, revision: Revision, title: z.string(), authors: z.array(z.string()), canonicalUri: z.string().url(), doi: z.string().nullable(),
  publicationDate: z.string().nullable(), retrievalDate: z.string().nullable(),
  access: z.enum(['metadata_only', 'abstract_or_excerpt', 'full_text', 'full_text_and_visual_check', 'artifact_bytes', 'unavailable']),
  expectedSha256: z.string().regex(/^[0-9a-f]{64}$/).nullable(), observedSha256: z.string().regex(/^[0-9a-f]{64}$/).nullable(),
  originalLocation: z.string().nullable(), rights: z.string(), redistributionAllowed: z.boolean(), review: Review, limitations: z.array(z.string()),
});
export type Source = z.infer<typeof Source>;

export const Family = z.object({ id: Id, displayName: z.string() });
export const Investigation = z.object({
  id: Id, revision: Revision, displayName: z.string(), familyId: Id, nasaInvestigationId: z.string().nullable(), psiUri: z.string().nullable(),
  safetyAreas: z.array(SafetyArea), objectiveAssertionIds: z.array(Id), findingIds: z.array(Id), eventIds: z.array(Id), apparatusRefs: z.array(Ref),
  coverage: z.enum(['profile_only', 'reviewed_findings', 'structured_observations', 'matched_replay_assets']), sourceRefs: z.array(Ref),
  summary: z.string(), depthNote: z.string(),
});
export type Investigation = z.infer<typeof Investigation>;
export const InvestigationFile = z.object({ schemaVersion: z.literal('ignis-registry-1'), families: z.array(Family), records: z.array(Investigation) });

export const Assertion = z.object({
  id: Id, revision: Revision, statement: z.string().min(1), state: z.enum(['proposed', 'active', 'withdrawn']), kind: EvidenceKind,
  sourceLocators: z.array(Locator).min(1), review: Review, qualifications: z.array(z.string()), conflictIds: z.array(Id), lineageRefs: z.array(Ref),
});
export type Assertion = z.infer<typeof Assertion>;

export const EntityRecord = z.object({
  id: Id, revision: Revision, kind: z.enum(['apparatus', 'specimen', 'campaign', 'calibration', 'artifact', 'quantity', 'endpoint', 'phenomenon', 'variable']),
  displayName: z.string(), definition: z.string(), aliases: z.array(z.string()), attributes: z.record(z.string(), QuantityValue),
  sourceLocators: z.array(Locator), review: Review.nullable(),
});
export type EntityRecord = z.infer<typeof EntityRecord>;

export const ExperimentEvent = z.object({
  id: Id, revision: Revision, investigationRef: Ref, sourceLabels: z.array(z.string()), specimenRefs: z.array(Ref), campaignRef: Ref.nullable(),
  parentBurnRef: Ref.nullable(), conditions: z.record(z.string(), QuantityValue), protocolAssertionIds: z.array(Id), lineageRefs: z.array(Ref),
  sourceLocators: z.array(Locator), note: z.string().optional(),
});
export type ExperimentEvent = z.infer<typeof ExperimentEvent>;

export const ObservationDefinition = z.object({
  id: Id, revision: Revision, eventRef: Ref.nullable(), measurandId: Id, endpointId: Id.nullable(), operatorDescription: z.string(),
  statisticDescription: z.string(), unit: z.string().nullable(), basis: z.string().nullable(), locationDescription: z.string().nullable(),
  clockDescription: z.string().nullable(), windowDescription: z.string().nullable(), value: QuantityValue.nullable(),
  assertionIds: z.array(Id), lineageRefs: z.array(Ref),
});
export type ObservationDefinition = z.infer<typeof ObservationDefinition>;

export const CoverageDomain = z.object({
  representation: z.enum(['joint_rows', 'joint_region', 'experiment_path', 'marginal_ranges_only', 'source_description_only']),
  description: z.string(), conditionRefs: z.array(Ref), exclusions: z.array(z.string()), sourceLocators: z.array(Locator),
});

export const Finding = z.object({
  id: Id, revision: Revision, briefRole: z.enum(['finding', 'context']), title: z.string(), implication: z.string(), assertionRef: Ref,
  investigationRefs: z.array(Ref), familyIds: z.array(Id), eventRefs: z.array(Ref), observationRefs: z.array(Ref), safetyAreas: z.array(SafetyArea).min(1),
  phenomenonIds: z.array(Id), quantityIds: z.array(Id), endpointIds: z.array(Id), domain: CoverageDomain, regimeAssertionIds: z.array(Id),
  applicabilityContractIds: z.array(Id), qualifyingFindingIds: z.array(Id), lineageRefs: z.array(Ref),
});
export type Finding = z.infer<typeof Finding>;

export const PhysicalModel = z.object({
  id: Id, revision: Revision, displayName: z.string(), status: z.enum(['published_representation', 'proposed', 'implemented']),
  runRef: Ref.nullable(), parentModelRef: Ref.nullable(), investigationRef: Ref.nullable(), predictedQuantityIds: z.array(Id),
  predictedQuantitiesReviewed: z.boolean(), suppliedObservationIds: z.array(Id), useRecordIds: z.array(Id), assumptionAssertionIds: z.array(Id),
  artifactRefs: z.array(Ref), historyGaps: z.array(z.string()), predictedQuantitiesNote: z.string().optional(),
});
export type PhysicalModel = z.infer<typeof PhysicalModel>;

export const ObservationUse = z.object({
  id: Id, revision: Revision, modelRef: Ref, observationRef: Ref,
  role: z.enum(['boundary_input', 'initial_condition', 'fit_target', 'normalization', 'preprocessing', 'geometry_construction', 'selection', 'candidate_response', 'context']),
  historicalUse: z.enum(['documented_use', 'scoped_reviewed_non_use', 'unresolved']), transform: z.string().nullable(),
  windowDescription: z.string().nullable(), assertionIds: z.array(Id), review: Review,
});
export type ObservationUse = z.infer<typeof ObservationUse>;

/** Discriminated predicate arguments: no expression, code or SQL can be expressed here (master §7.3 note). */
const predicateBase = { id: Id, description: z.string(), scope: z.enum(['summary', 'transfer', 'calculation']), fieldIds: z.array(Id), sourceAssertionIds: z.array(Id), criticalForThisUse: z.boolean() };
export const Predicate = z.discriminatedUnion('operation', [
  z.strictObject({ ...predicateBase, operation: z.literal('documented_use'), argument: z.strictObject({ useId: Id }) }),
  z.strictObject({ ...predicateBase, operation: z.literal('no_documented_use'), argument: z.strictObject({ useId: Id }) }),
  z.strictObject({ ...predicateBase, operation: z.literal('transform_supported'), argument: z.strictObject({ useId: Id, transform: z.string().min(1) }) }),
  z.strictObject({ ...predicateBase, operation: z.literal('asset_matched'), argument: z.strictObject({ observationIds: z.array(Id).min(1) }) }),
  z.strictObject({ ...predicateBase, operation: z.literal('operator_compatible'), argument: z.strictObject({ quantityA: Id, quantityB: Id }) }),
  z.strictObject({ ...predicateBase, operation: z.literal('model_predicts'), argument: z.strictObject({ modelId: Id, quantityId: Id }) }),
  z.strictObject({ ...predicateBase, operation: z.literal('positive_value'), argument: z.strictObject({ observationId: Id }) }),
  z.strictObject({ ...predicateBase, operation: z.literal('same_measurand'), argument: z.strictObject({ observationIds: z.array(Id).min(2) }) }),
  z.strictObject({ ...predicateBase, operation: z.literal('window_defined'), argument: z.strictObject({ observationId: Id }) }),
]);
export type Predicate = z.infer<typeof Predicate>;

export const OPERATION_KEYS = ['ratio', 'product', 'difference', 'relative_difference_pct', 'difference_of_derivation', 't1_identity'] as const;
export const DerivationSpec = z.object({
  id: Id, operationKey: z.enum(OPERATION_KEYS), inputs: z.record(z.string(), Id), label: z.string(),
});
export type DerivationSpec = z.infer<typeof DerivationSpec>;
const Branch = z.object({ route: Route, outcome: ScientificOutcome.nullable(), executionKind: ExecutionKind, text: z.string().min(1) });
export type Branch = z.infer<typeof Branch>;

export const ApplicabilityContract = z.object({
  id: Id, revision: Revision, templateKey: z.enum(['T1', 'T2', 'T3', 'T4', 'DESCRIPTIVE_TOTALS']), permittedUse: z.string(),
  selector: z.object({
    modelId: Id, quantityIds: z.array(Id).min(1), requestedClaims: z.array(RequestedClaim).min(1),
    temporalScopes: z.array(TemporalScope).nullable(), eventIds: z.array(Id).nullable(),
  }),
  findingRefs: z.array(Ref), requirements: z.array(Predicate).min(1),
  branches: z.object({ satisfied: Branch, unknown: Branch, contradicted: Branch }),
  derivations: z.array(DerivationSpec), permittedConclusionTemplate: z.string(), forbiddenClaims: z.array(z.string()), review: Review,
});
export type ApplicabilityContract = z.infer<typeof ApplicabilityContract>;

export const SourceConflict = z.object({
  id: Id, revision: Revision, subject: z.string(), assertionRefs: z.array(Ref), affectedRecordRefs: z.array(Ref),
  status: z.enum(['open', 'qualified', 'resolved']), scope: z.string(), treatment: z.string(), resolutionAssertionRef: Ref.nullable(),
});
export const TransferMethod = z.object({ id: Id, revision: Revision, displayName: z.string() }).loose();

export const CatalogManifest = z.object({
  schemaVersion: z.literal('ignis-registry-1'), catalogId: z.string(), revision: Revision, files: z.array(z.string()), createdDuring: z.string(),
  reviewStatement: z.string(), unacquiredSources: z.array(z.object({ label: z.string(), observation: z.string(), effect: z.string() })),
  omittedOptionalModules: z.array(z.string()),
});

export const RegistryFiles = {
  sources: file(Source), assertions: file(Assertion), entities: file(EntityRecord), events: file(ExperimentEvent),
  observations: file(ObservationDefinition), models: file(PhysicalModel), uses: file(ObservationUse), contracts: file(ApplicabilityContract),
  findings: file(Finding), conflicts: file(SourceConflict), methods: file(TransferMethod),
};

// ---------- interpretation proposal (closed; every key required; master §10.3) ----------
const MAX_LIST = 12;
export const RequestConstraint = z.strictObject({
  fieldId: Id, value: QuantityValue, provenance: z.enum(['user_explicit', 'confirmed_selection', 'proposed_interpretation']),
  rawSpan: z.string().max(300).nullable(), hypothetical: z.boolean(),
});
export const InterpretationProposal = z.strictObject({
  intent: Intent, safetyAreas: z.array(SafetyArea).max(3),
  investigationIds: z.array(Id).max(MAX_LIST), physicalModelId: Id.nullable(), eventIds: z.array(Id).max(MAX_LIST),
  quantityIds: z.array(Id).max(MAX_LIST), endpointIds: z.array(Id).max(MAX_LIST),
  requestedFeature: RequestedFeature, temporalScope: TemporalScope, requestedClaim: RequestedClaim,
  constraints: z.array(RequestConstraint).max(MAX_LIST), explicitExclusions: z.array(z.string().max(300)).max(MAX_LIST),
  ambiguities: z.array(z.strictObject({ field: z.string().max(60), question: z.string().min(1).max(300), alternativeIds: z.array(Id).max(MAX_LIST) })).max(MAX_LIST),
  unknownTerms: z.array(z.string().max(120)).max(MAX_LIST), proposedModelNote: z.string().max(600).nullable(),
  requestedExecutionText: z.string().max(600).nullable(), supportingContextIds: z.array(Id).max(MAX_LIST),
});
export type InterpretationProposal = z.infer<typeof InterpretationProposal>;

export const ConfirmedRequest = z.strictObject({
  id: Id, revision: Revision, originalText: z.string().max(2000), confirmedAt: z.string(), proposal: InterpretationProposal, handling: Handling,
  inputMode: z.enum(['ai_assisted', 'form']), parentRequestRef: Ref.nullable(), runtimeProvenanceRef: Ref.nullable(),
  remainingScientificGaps: z.array(z.string()),
});
export type ConfirmedRequest = z.infer<typeof ConfirmedRequest>;
