import { z } from 'zod';
import rawDataset from '../../data/condition-cases.json';
import { mul, parseDec, toNumber } from './decimal';
import { computeFrontier, type FrontierResult } from './frontier';

const text = z.string().refine((value) => value.trim().length > 0, 'must be nonblank');
const finite = z.number().finite();
const positive = finite.positive();
const positiveInteger = positive.int();
const printedNumber = z.string().regex(/^\d+(?:\.\d+)?$/, 'must retain a plain printed decimal');
const hash = z.string().regex(/^[a-f0-9]{64}$/, 'must be a lowercase SHA-256 digest');
const httpsUrl = z.string().url().refine((value) => value.startsWith('https://'), 'must use HTTPS');
const coordinateUse = z.literal('atmosphere_coordinates_only');
const flowStatus = z.literal('unresolved_publication_conflict');
const pinnedFile = z.object({ path: text, sha256: hash }).strict();

const sourceSchema = z.object({
  id: text, title: text, version: z.literal('ICES-2026-577'), publicUrl: httpsUrl, pdfUrl: httpsUrl,
  path: text, sha256: hash, pdfPage: positiveInteger, printedPage: positiveInteger,
  table: text, tableTitle: text, acquiredAtUtc: text, distributionDate: text,
  metadataPath: text, metadataSha256: hash, inspectionStatus: text, transcriptionMethod: text,
}).strict();

const cohortSchema = z.object({
  id: text, material: text, sidesBurning: positiveInteger, caseIds: z.array(text).min(1),
  caseCount: positiveInteger, use: coordinateUse,
}).strict();

const caseSchema = z.object({
  id: text, flight: text, sample: text, material: text, sidesBurning: positiveInteger, cohortId: text,
  oxygenMoleFraction: positive.max(1), oxygenPercent: positive.max(100), pressureKPa: positive,
  oxygenPartialPressureKPa: positive, nominalFlowCmS: positive,
  nominalFlowDirection: z.literal('opposed (2026 caption)'), flowEquivalenceStatus: flowStatus,
  initialFlowDurationS: positive, ignitionDurationS: positive, freeVolumeM3: positive,
  sourceId: text, pdfPage: positiveInteger, platform: text, gravityRegime: z.literal('microgravity'),
  geometry: z.object({
    widthCm: positive, lengthCm: positive, thicknessMm: positive.nullable(),
    thicknessStatus: z.enum(['reported_in_table_caption', 'not_reported_in_table_caption']),
  }).strict(),
  thermalHistory: z.object({
    preheatMinutes: finite.nonnegative().nullable(), preheatDescription: text.nullable(),
    status: z.enum(['reported_in_table_caption', 'not_reported_in_table_caption']),
    specimenPriorHistory: z.literal('not_established_by_this_table'),
  }).strict(),
  flowHistory: z.object({
    status: z.literal('partial_source_context'), note: text,
    reportedChange: z.object({ atSeconds: finite.nonnegative(), toCmS: finite.nonnegative(), pdfPage: positiveInteger, sourceDescription: text }).strict().nullable(),
  }).strict(),
  original: z.object({
    flightSample: text, material: text, sidesBurning: printedNumber, pressureMbar: printedNumber,
    oxygenMoleFraction: printedNumber, freeVolumeM3: printedNumber, ignitionDurationS: printedNumber,
    initialFlowDurationS: printedNumber, nominalFlow: text, widthCm: printedNumber, lengthCm: printedNumber,
    thicknessMm: printedNumber.nullable(), preheatMinutes: printedNumber.nullable(),
  }).strict(),
  conversions: z.object({
    pressureKPa: z.object({ operation: z.literal('pressureMbar * 0.1'), factor: z.literal(0.1), value: positive }).strict(),
    oxygenPercent: z.object({ operation: z.literal('oxygenMoleFraction * 100'), factor: z.literal(100), value: positive, basis: z.literal('mole percent') }).strict(),
    oxygenPartialPressureKPa: z.object({ operation: z.literal('oxygenMoleFraction * pressureKPa'), value: positive, status: z.literal('derived_arithmetic_not_separately_measured') }).strict(),
  }).strict(),
  transferStatus: z.literal('not_assessed'),
}).strict();

const datasetSchema = z.object({
  schemaVersion: z.literal('ignis-condition-cases-1'), snapshotDate: text, title: text, caseCount: positiveInteger,
  source: sourceSchema,
  flowConflict: z.object({ id: text, status: flowStatus, canonicalSourceStatement: text, earlierSourceStatement: text, effect: text, reportPath: text }).strict(),
  earlierSourceContext: z.array(z.object({
    id: text, role: z.literal('conflict_context_only_not_canonical_condition_values'), title: text, version: text,
    publicUrl: httpsUrl, path: text, sha256: hash, pdfPage: positiveInteger, table: text,
    flowDirectionOriginal: text, nominalFlowCmS: positive, caseIds: z.array(text), conditionVersionNote: text,
  }).strict()),
  boundaries: z.array(text).min(1),
  comparisonPolicy: z.object({
    allowedUse: coordinateUse, requiredCohortFields: z.tuple([z.literal('material'), z.literal('sidesBurning')]),
    coordinateUnits: z.object({ oxygenPercent: z.literal('mole percentage points'), pressureKPa: z.literal('kPa') }).strict(),
    differenceConvention: text, scalarScoreProvided: z.literal(false), physicalTransferEstablished: z.literal(false),
    unreportedOrUnresolvedRequirements: z.array(text).min(1),
  }).strict(),
  cohorts: z.array(cohortSchema).min(1), cases: z.array(caseSchema).min(1), reviewStatement: text,
  verification: z.object({
    algorithm: z.literal('SHA-256'), checkedRawFileCount: positiveInteger, pinnedRootInputs: z.array(pinnedFile).min(1),
    psiRecordsAndCsvHashes: text, requiredFieldsValidated: z.literal(true), networkUsed: z.literal(false),
    appLinkValidation: text, generatorPath: text,
  }).strict(),
}).strict();

export type ConditionCase = z.infer<typeof caseSchema>;
type ConditionDataset = z.infer<typeof datasetSchema>;
export interface ConditionComparison {
  schemaVersion: 'ignis-condition-comparison-1';
  target: { oxygenPercent: number; pressureKPa: number };
  cohort: ConditionDataset['cohorts'][number];
  cases: ConditionCase[];
  frontier: FrontierResult;
  source: ConditionDataset['source'];
  earlierSourceContext: ConditionDataset['earlierSourceContext'];
  flowConflict: ConditionDataset['flowConflict'];
  comparisonPolicy: ConditionDataset['comparisonPolicy'];
  reviewStatement: string;
}

function requireMatch(condition: boolean, description: string): void {
  if (!condition) throw new Error(`Invalid condition dataset: ${description}.`);
}

export function validateConditionDataset(value: unknown): ConditionDataset {
  const parsed = datasetSchema.safeParse(value);
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
    throw new Error(`Invalid condition dataset: ${details}`);
  }
  const data = parsed.data;
  const cases = new Map(data.cases.map((item) => [item.id, item]));
  const cohorts = new Map(data.cohorts.map((item) => [item.id, item]));
  requireMatch(cases.size === data.cases.length, 'case IDs must be unique');
  requireMatch(cohorts.size === data.cohorts.length, 'cohort IDs must be unique');
  requireMatch(data.caseCount === data.cases.length, 'caseCount must match the case array');
  const cohortKeys = data.cohorts.map((item) => JSON.stringify([item.material, item.sidesBurning]));
  requireMatch(new Set(cohortKeys).size === cohortKeys.length, 'each material and burning-side pair must have one cohort');
  const assigned = new Set<string>();
  for (const cohort of data.cohorts) {
    requireMatch(cohort.caseCount === cohort.caseIds.length, `${cohort.id} caseCount must match caseIds`);
    for (const id of cohort.caseIds) {
      const item = cases.get(id);
      requireMatch(!assigned.has(id), `${id} must belong to exactly one cohort`);
      requireMatch(item !== undefined && item.cohortId === cohort.id && item.material === cohort.material && item.sidesBurning === cohort.sidesBurning, `${id} cohort material/sides membership is inconsistent`);
      assigned.add(id);
    }
  }
  requireMatch(assigned.size === cases.size, 'every case must be assigned to a cohort');
  for (const item of data.cases) {
    requireMatch(cohorts.has(item.cohortId), `${item.id} references an unknown cohort`);
    requireMatch(item.sourceId === data.source.id && item.pdfPage === data.source.pdfPage, `${item.id} source locator must identify the canonical publication and table page`);
    requireMatch(item.id === `SAFFIRE-${item.sample}` && item.sample.startsWith(`${item.flight}-`), `${item.id} flight/sample identity is inconsistent`);
    requireMatch(item.original.flightSample === item.sample && item.original.material === item.material, `${item.id} original identity must match`);
    const original = item.original;
    const oxygen = parseDec(original.oxygenMoleFraction);
    const pressure = mul(parseDec(original.pressureMbar), parseDec('0.1'));
    const expectedOxygenPercent = toNumber(mul(oxygen, parseDec('100')));
    const expectedPressure = toNumber(pressure);
    const expectedPartialPressure = toNumber(mul(oxygen, pressure));
    requireMatch(item.oxygenMoleFraction === toNumber(oxygen), `${item.id} oxygen fraction must match its original string`);
    requireMatch(item.oxygenPercent === expectedOxygenPercent && item.conversions.oxygenPercent.value === expectedOxygenPercent, `${item.id} oxygen percent conversion is inconsistent`);
    requireMatch(item.pressureKPa === expectedPressure && item.conversions.pressureKPa.value === expectedPressure, `${item.id} pressure conversion is inconsistent`);
    requireMatch(item.oxygenPartialPressureKPa === expectedPartialPressure && item.conversions.oxygenPartialPressureKPa.value === expectedPartialPressure, `${item.id} partial-pressure arithmetic is inconsistent`);
    const printedPairs: Array<[string, number | null, string | null]> = [
      ['sidesBurning', item.sidesBurning, original.sidesBurning], ['freeVolumeM3', item.freeVolumeM3, original.freeVolumeM3],
      ['ignitionDurationS', item.ignitionDurationS, original.ignitionDurationS], ['initialFlowDurationS', item.initialFlowDurationS, original.initialFlowDurationS],
      ['widthCm', item.geometry.widthCm, original.widthCm], ['lengthCm', item.geometry.lengthCm, original.lengthCm],
      ['thicknessMm', item.geometry.thicknessMm, original.thicknessMm], ['preheatMinutes', item.thermalHistory.preheatMinutes, original.preheatMinutes],
    ];
    for (const [label, number, printed] of printedPairs) {
      requireMatch(printed === null ? number === null : number === toNumber(parseDec(printed)), `${item.id} ${label} must match its original value or missingness`);
    }
    requireMatch(original.nominalFlow === `${item.nominalFlowCmS} cm/s opposed flow`, `${item.id} source-specific nominal flow must match its original text`);
    requireMatch((item.geometry.thicknessMm !== null) === (item.geometry.thicknessStatus === 'reported_in_table_caption'), `${item.id} thickness status is inconsistent`);
    requireMatch((item.thermalHistory.preheatMinutes !== null && item.thermalHistory.preheatDescription !== null) === (item.thermalHistory.status === 'reported_in_table_caption'), `${item.id} preheat status is inconsistent`);
    if (item.flowHistory.reportedChange) requireMatch(item.flowHistory.reportedChange.pdfPage === data.source.pdfPage, `${item.id} flow-change source page is inconsistent`);
  }
  const sourceIds = [data.source.id, ...data.earlierSourceContext.map((source) => source.id)];
  requireMatch(new Set(sourceIds).size === sourceIds.length, 'canonical and context source IDs must be unique');
  for (const source of data.earlierSourceContext) {
    requireMatch(new Set(source.caseIds).size === source.caseIds.length && source.caseIds.every((id) => cases.has(id)), `${source.id} context case references are inconsistent`);
  }
  for (const [path, sha256] of [[data.source.path, data.source.sha256], [data.source.metadataPath, data.source.metadataSha256], ...data.earlierSourceContext.map((source) => [source.path, source.sha256])]) {
    requireMatch(data.verification.pinnedRootInputs.some((file) => file.path === path && file.sha256 === sha256), 'source hashes must agree with the pinned-file inventory');
  }
  return data;
}

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

/** Validated once at module load. Freezing prevents later UI code from changing the comparison corpus. */
export const conditionDataset = deepFreeze(validateConditionDataset(rawDataset));

const inputSchema = z.object({
  cohortId: text,
  oxygenPercent: positive.max(100),
  pressureKPa: positive.max(2000),
}).strict();

/** Coordinates within one curated cohort; no physical transfer, response or flow-equivalence inference. */
export function compareConditions(input: { cohortId: string; oxygenPercent: number; pressureKPa: number }): ConditionComparison {
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => `${issue.path.join('.') || 'input'}: ${issue.message}`).join('; ');
    throw new Error(`Invalid condition comparison: ${details}`);
  }
  const { cohortId, oxygenPercent, pressureKPa } = parsed.data;
  const cohort = conditionDataset.cohorts.find((item) => item.id === cohortId);
  if (!cohort) throw new Error(`Unknown condition cohort: ${cohortId}.`);
  const cases = cohort.caseIds.map((id) => conditionDataset.cases.find((item) => item.id === id)!);
  const result: ConditionComparison = {
    schemaVersion: 'ignis-condition-comparison-1',
    target: { oxygenPercent, pressureKPa },
    cohort, cases,
    frontier: computeFrontier(cases.map((item) => ({ id: item.id, values: { o2: item.oxygenPercent, pressure: item.pressureKPa } })), { o2: oxygenPercent, pressure: pressureKPa }),
    source: conditionDataset.source, earlierSourceContext: conditionDataset.earlierSourceContext,
    flowConflict: conditionDataset.flowConflict,
    comparisonPolicy: conditionDataset.comparisonPolicy, reviewStatement: conditionDataset.reviewStatement,
  };
  // All fields have validated JSON primitives. A detached copy prevents export consumers from
  // mutating the frozen dataset; property/array order is fixed and no runtime timestamp is added.
  return JSON.parse(JSON.stringify(result)) as ConditionComparison;
}
