/** Descriptive rank association of same-row cached channels; no inferential model. */
import { z } from 'zod';
import { digestOf } from './canonicalize';
import {
  DETECTOR_CHANNEL_IDS, DETECTOR_MATERIALS, detectorDataset, detectorDatasetSchema,
  type DetectorCell, type DetectorChannelId, type DetectorDataset, type DetectorMaterial,
  type DetectorRecord,
} from './detector';

export const ASSOCIATION_METHOD_REVISION = 'detector-association-2026-11-15.1';
export const DetectorAssociationSelectionSchema = z.object({
  flight: z.enum(['all', '1', '2']), material: z.enum(['all', ...DETECTOR_MATERIALS]),
  includeReference: z.boolean(), channelA: z.enum(DETECTOR_CHANNEL_IDS), channelB: z.enum(DETECTOR_CHANNEL_IDS),
}).strict().refine((selection) => selection.channelA !== selection.channelB, {
  path: ['channelB'], message: 'Choose two distinct recorded channels.',
});
export type DetectorAssociationSelection = z.infer<typeof DetectorAssociationSelectionSchema>;
export const DEFAULT_DETECTOR_ASSOCIATION_SELECTION: Readonly<DetectorAssociationSelection> = Object.freeze({
  flight: '2', material: 'all', includeReference: false, channelA: 'issScatterV', channelB: 'ionDeltaV',
});

export type AssociationAvailability = 'bothFinite' | 'aOnly' | 'bOnly' | 'neither';
export type AssociationStatus = 'defined' | 'insufficient_pairs' | 'constant_a' | 'constant_b' | 'constant_both';
export interface AssociationRange {
  minimum: number | null;
  maximum: number | null;
  span: number | null;
  spanStatus: 'defined' | 'no_pairs' | 'overflow';
  minimumRecordIds: string[];
  maximumRecordIds: string[];
}
export interface RankAssociationStatistic {
  status: AssociationStatus;
  rho: number | null;
  pairedRows: number;
  distinctA: number;
  distinctB: number;
  tiedRowsA: number;
  tiedRowsB: number;
  /** Exact integer products of centered doubled average ranks for this bounded corpus. */
  centeredRankProducts: { cross: number; sumSquaresA: number; sumSquaresB: number };
}
export interface RankAssociation extends RankAssociationStatistic {
  /** Voltage ranges on precisely the jointly finite pairs used for this coefficient. */
  rangeA: AssociationRange;
  rangeB: AssociationRange;
}
export interface AssociationMarginal {
  finite: number; missing: number; error: number; nonNumeric: number;
}
export interface AssociationRow {
  record: DetectorRecord;
  measurementA: DetectorCell;
  measurementB: DetectorCell;
  availability: AssociationAvailability;
  /** Average ranks in the overall selected finite-pair population, not in every stratum. */
  rankA: number | null;
  rankB: number | null;
  groupKey: string | null;
}
export interface RecordedGroupDeletion {
  groupKey: string;
  flight: '1' | '2';
  sampleId: string;
  recordIds: string[];
  removedRows: number;
  removedPairedRows: number;
  remainingRows: number;
  association: RankAssociationStatistic;
}
export interface AssociationDeletionAudit {
  status: 'computed' | 'unidentified_rows' | 'no_rows' | 'insufficient_groups';
  grouping: 'exact_recorded_flight_and_sampleId';
  identifiedGroups: number;
  unidentifiedRecordIds: string[];
  deletions: RecordedGroupDeletion[];
  definedDeletions: number;
  undefinedDeletions: number;
  /** Range over computed deletions only; not a confidence or completion interval. */
  minimumRho: number | null;
  maximumRho: number | null;
  minimumGroupKeys: string[];
  maximumGroupKeys: string[];
  signChangeFromBaseline: boolean;
}
export interface AssociationSummary {
  selectedRows: number;
  pairedFiniteRows: number;
  availability: Record<AssociationAvailability, number>;
  marginalA: AssociationMarginal;
  marginalB: AssociationMarginal;
  association: RankAssociation;
  deletion: AssociationDeletionAudit;
}
export interface AssociationMaterialSummary { material: DetectorMaterial; summary: AssociationSummary }
export interface DetectorAssociationResult {
  schemaVersion: 'ignis-detector-association-1';
  methodRevision: typeof ASSOCIATION_METHOD_REVISION;
  selection: DetectorAssociationSelection;
  source: DetectorDataset['source'];
  sourcePolicy: DetectorDataset['policy'];
  channelA: DetectorDataset['channels'][DetectorChannelId] & { id: DetectorChannelId };
  channelB: DetectorDataset['channels'][DetectorChannelId] & { id: DetectorChannelId };
  summary: AssociationSummary;
  byFlight: Array<{ flight: '1' | '2'; label: 'SAME' | 'SAME-R'; summary: AssociationSummary; byMaterial: AssociationMaterialSummary[] }>;
  byMaterial: AssociationMaterialSummary[];
  rows: AssociationRow[];
  identityConflicts: DetectorDataset['identityConflicts'];
  method: {
    statistic: 'spearman_average_ranks'; minimumPairs: 3; tiePolicy: string; pairing: string;
    deletionMeaning: string; pValues: false; confidenceIntervals: false; physicalPrediction: false; independentTrials: false;
    references: Array<{ title: string; url: string }>;
  };
  flags: Array<{ code: string; message: string; recordIds: string[] }>;
  instrumentNotes: string[];
  reviewStatement: string;
}

export const MAX_ASSOCIATION_PACKAGE_BYTES = 2 * 1024 * 1024;
export interface AssociationPackage {
  schemaVersion: 'ignis-association-export-1';
  result: DetectorAssociationResult;
  resultSha256: string;
}

function compareText(a: string, b: string): number { return a < b ? -1 : a > b ? 1 : 0; }

/** Doubled average ranks are exact integers, including ties. No rounding of source values. */
function doubledRanks(values: readonly number[]): number[] {
  const order = values.map((_, index) => index).sort((a, b) => values[a] - values[b]);
  const ranks = Array<number>(values.length);
  for (let first = 0; first < order.length;) {
    let end = first + 1;
    while (end < order.length && values[order[end]] === values[order[first]]) end += 1;
    for (let index = first; index < end; index += 1) ranks[order[index]] = first + 1 + end;
    first = end;
  }
  return ranks;
}

function pairedRange(rows: readonly AssociationRow[], side: 'A' | 'B'): AssociationRange {
  if (!rows.length) return { minimum: null, maximum: null, span: null, spanStatus: 'no_pairs', minimumRecordIds: [], maximumRecordIds: [] };
  const value = (row: AssociationRow) => (side === 'A' ? row.measurementA : row.measurementB).value!;
  const values = rows.map(value);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const span = maximum - minimum;
  return {
    minimum, maximum, span: Number.isFinite(span) ? span : null,
    spanStatus: Number.isFinite(span) ? 'defined' : 'overflow',
    minimumRecordIds: rows.filter((row) => value(row) === minimum).map((row) => row.record.id),
    maximumRecordIds: rows.filter((row) => value(row) === maximum).map((row) => row.record.id),
  };
}

function rankDetails(rows: readonly AssociationRow[]): { association: RankAssociationStatistic; ranksA: number[]; ranksB: number[] } {
  const paired = rows.filter((row) => row.availability === 'bothFinite');
  const a = paired.map((row) => row.measurementA.value!);
  const b = paired.map((row) => row.measurementB.value!);
  const ranksA = doubledRanks(a);
  const ranksB = doubledRanks(b);
  const n = paired.length;
  let cross = 0;
  let sumSquaresA = 0;
  let sumSquaresB = 0;
  for (let index = 0; index < n; index += 1) {
    const x = ranksA[index] - (n + 1);
    const y = ranksB[index] - (n + 1);
    cross += x * y;
    sumSquaresA += x * x;
    sumSquaresB += y * y;
  }
  const status: AssociationStatus = n < 3 ? 'insufficient_pairs'
    : sumSquaresA === 0 && sumSquaresB === 0 ? 'constant_both'
      : sumSquaresA === 0 ? 'constant_a' : sumSquaresB === 0 ? 'constant_b' : 'defined';
  const tiedRows = (values: number[]) => {
    const counts = new Map<number, number>();
    for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
    return [...counts.values()].reduce((sum, count) => sum + (count > 1 ? count : 0), 0);
  };
  return {
    association: {
      status, rho: status === 'defined' ? cross / Math.sqrt(sumSquaresA * sumSquaresB) : null,
      pairedRows: n, distinctA: new Set(a).size, distinctB: new Set(b).size,
      tiedRowsA: tiedRows(a), tiedRowsB: tiedRows(b),
      centeredRankProducts: { cross, sumSquaresA, sumSquaresB },
    }, ranksA, ranksB,
  };
}

function recordedGroupKey(record: DetectorRecord): string | null {
  // No inferred singleton, suffix stripping, cross-source reconciliation, or label normalization.
  if (record.flight !== record.identityCells.flight.originalValue
    || record.sampleId === null || record.sampleId.trim().length === 0
    || record.sampleId !== record.identityCells.sampleId.originalValue) return null;
  return JSON.stringify([record.flight, record.sampleId]);
}

function rowFor(record: DetectorRecord, selection: DetectorAssociationSelection): AssociationRow {
  const measurementA = record.channels[selection.channelA];
  const measurementB = record.channels[selection.channelB];
  const a = measurementA.status === 'finite';
  const b = measurementB.status === 'finite';
  return {
    record, measurementA, measurementB, availability: a ? b ? 'bothFinite' : 'aOnly' : b ? 'bOnly' : 'neither',
    rankA: null, rankB: null, groupKey: recordedGroupKey(record),
  };
}

function marginal(rows: readonly AssociationRow[], side: 'A' | 'B'): AssociationMarginal {
  const counts: AssociationMarginal = { finite: 0, missing: 0, error: 0, nonNumeric: 0 };
  for (const row of rows) {
    const status = (side === 'A' ? row.measurementA : row.measurementB).status;
    if (status === 'non_numeric') counts.nonNumeric += 1;
    else counts[status] += 1;
  }
  return counts;
}

function deletionAudit(rows: readonly AssociationRow[], baseline: RankAssociationStatistic): AssociationDeletionAudit {
  const unidentifiedRecordIds = rows.filter((row) => row.groupKey === null).map((row) => row.record.id);
  const groups = new Map<string, AssociationRow[]>();
  for (const row of rows) if (row.groupKey !== null) {
    const members = groups.get(row.groupKey) ?? [];
    members.push(row);
    groups.set(row.groupKey, members);
  }
  const status: AssociationDeletionAudit['status'] = rows.length === 0 ? 'no_rows'
    : unidentifiedRecordIds.length ? 'unidentified_rows' : groups.size < 2 ? 'insufficient_groups' : 'computed';
  const deletions: RecordedGroupDeletion[] = [];
  if (status === 'computed') {
    for (const [groupKey, members] of [...groups].sort(([a], [b]) => compareText(a, b))) {
      const remaining = rows.filter((row) => row.groupKey !== groupKey);
      deletions.push({
        groupKey, flight: members[0].record.flight, sampleId: members[0].record.sampleId!,
        recordIds: members.map((row) => row.record.id), removedRows: members.length,
        removedPairedRows: members.filter((row) => row.availability === 'bothFinite').length,
        remainingRows: remaining.length, association: rankDetails(remaining).association,
      });
    }
  }
  const defined = deletions.filter((entry) => entry.association.rho !== null);
  const values = defined.map((entry) => entry.association.rho!);
  const minimumRho = values.length ? Math.min(...values) : null;
  const maximumRho = values.length ? Math.max(...values) : null;
  return {
    status, grouping: 'exact_recorded_flight_and_sampleId', identifiedGroups: groups.size, unidentifiedRecordIds, deletions,
    definedDeletions: defined.length, undefinedDeletions: deletions.length - defined.length,
    minimumRho, maximumRho,
    minimumGroupKeys: defined.filter((entry) => entry.association.rho === minimumRho).map((entry) => entry.groupKey),
    maximumGroupKeys: defined.filter((entry) => entry.association.rho === maximumRho).map((entry) => entry.groupKey),
    signChangeFromBaseline: baseline.rho !== null && values.some((value) => Math.sign(value) !== Math.sign(baseline.rho!)),
  };
}

function summarize(rows: readonly AssociationRow[]): AssociationSummary {
  const availability: Record<AssociationAvailability, number> = { bothFinite: 0, aOnly: 0, bOnly: 0, neither: 0 };
  for (const row of rows) availability[row.availability] += 1;
  const pairs = rows.filter((row) => row.availability === 'bothFinite');
  const association: RankAssociation = {
    ...rankDetails(rows).association, rangeA: pairedRange(pairs, 'A'), rangeB: pairedRange(pairs, 'B'),
  };
  return {
    selectedRows: rows.length, pairedFiniteRows: availability.bothFinite, availability,
    marginalA: marginal(rows, 'A'), marginalB: marginal(rows, 'B'), association,
    deletion: deletionAudit(rows, association),
  };
}

function materials(rows: readonly AssociationRow[]): AssociationMaterialSummary[] {
  return DETECTOR_MATERIALS.map((material) => ({
    material, summary: summarize(rows.filter((row) => row.record.material === material)),
  }));
}

/** Every injected dataset is validated; outputs are detached, source-bound and deterministic. */
export function analyzeDetectorAssociation(
  requested: Partial<DetectorAssociationSelection> = {},
  suppliedDataset: DetectorDataset = detectorDataset,
): DetectorAssociationResult {
  if (requested === null || typeof requested !== 'object' || Array.isArray(requested)) {
    throw new Error('A detector association selection must be an object.');
  }
  const selection = DetectorAssociationSelectionSchema.parse({ ...DEFAULT_DETECTOR_ASSOCIATION_SELECTION, ...requested });
  if (Array.isArray(suppliedDataset?.records) && suppliedDataset.records.length > 154) {
    throw new Error('This source-bound association audit supports at most 154 source records.');
  }
  const dataset = detectorDatasetSchema.parse(suppliedDataset);
  const rows = dataset.records
    .filter((record) => selection.flight === 'all' || record.flight === selection.flight)
    .filter((record) => selection.material === 'all' || record.material === selection.material)
    .filter((record) => selection.includeReference || record.materialRole !== 'reference')
    .sort((a, b) => a.excelRow - b.excelRow)
    .map((record) => rowFor(record, selection));
  const paired = rows.filter((row) => row.availability === 'bothFinite');
  const { ranksA, ranksB } = rankDetails(rows);
  paired.forEach((row, index) => { row.rankA = ranksA[index] / 2; row.rankB = ranksB[index] / 2; });
  const summary = summarize(rows);
  const byFlight: DetectorAssociationResult['byFlight'] = (['1', '2'] as const).map((flight) => {
    const members = rows.filter((row) => row.record.flight === flight);
    return { flight, label: flight === '1' ? 'SAME' : 'SAME-R', summary: summarize(members), byMaterial: materials(members) };
  });
  const byMaterial = materials(rows);
  const flags: DetectorAssociationResult['flags'] = [{
    code: 'descriptive_association_only', recordIds: [],
    message: 'Rank association describes co-ordering of recorded channels, not agreement, calibration, causality, alarms, superiority or prediction.',
  }];
  const unavailable = rows.filter((row) => row.availability !== 'bothFinite').map((row) => row.record.id);
  if (unavailable.length) flags.push({
    code: 'unavailable_pairs', recordIds: unavailable,
    message: 'Association uses only jointly finite same-row pairs. No values are imputed and no bound for missing readings is claimed.',
  });
  if (summary.deletion.status === 'unidentified_rows') flags.push({
    code: 'unidentified_group_rows', recordIds: summary.deletion.unidentifiedRecordIds,
    message: 'Selected rows lack complete matching recorded sample labels, so pooled group-deletion sensitivity is skipped. Inspect separately identified flight/material strata.',
  });
  for (const flight of byFlight) {
    const positive = flight.byMaterial.filter((entry) => (entry.summary.association.rho ?? 0) > 0);
    const negative = flight.byMaterial.filter((entry) => (entry.summary.association.rho ?? 0) < 0);
    if (positive.length && negative.length) flags.push({
      code: `within_flight_material_signs_${flight.flight}`, recordIds: [],
      message: `Flight ${flight.flight} has positive and negative material-stratum rank associations. A pooled coefficient does not describe every material. These are descriptive signs, not significance findings.`,
    });
  }
  if (summary.deletion.signChangeFromBaseline) flags.push({
    code: 'recorded_group_deletion_sign_change', recordIds: [],
    message: 'At least one complete recorded-group deletion changes the sign of the descriptive coefficient; inspect its rows before interpreting the pooled result.',
  });
  const result: DetectorAssociationResult = {
    schemaVersion: 'ignis-detector-association-1', methodRevision: ASSOCIATION_METHOD_REVISION,
    selection, source: dataset.source, sourcePolicy: dataset.policy,
    channelA: { ...dataset.channels[selection.channelA], id: selection.channelA },
    channelB: { ...dataset.channels[selection.channelB], id: selection.channelB },
    summary, byFlight, byMaterial, rows, identityConflicts: dataset.identityConflicts,
    method: {
      statistic: 'spearman_average_ranks', minimumPairs: 3,
      tiePolicy: 'Exact equality of admitted cached numbers; tied observations receive average ranks. No rounding, tie-breaking jitter or epsilon.',
      pairing: 'Exact workbook hash, sheet and Excel row; sample labels group deletions only and never join observations.',
      deletionMeaning: 'Delete every selected row with one exact recorded (flight, sampleId) label, then rerank the retained finite pairs. The minimum/maximum are a finite sensitivity range, not a confidence interval or independence correction. Unknown labels block this operation within that stratum.',
      pValues: false, confidenceIntervals: false, physicalPrediction: false, independentTrials: false,
      references: [
        { title: 'SciPy: Spearman rank-order correlation; constant inputs are undefined', url: 'https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.spearmanr.html' },
        { title: 'SciPy: rankdata average-rank tie convention', url: 'https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.rankdata.html' },
      ],
    },
    flags,
    instrumentNotes: [
      'Both channels are stored volts but have different measurement operators. Association does not require or establish equivalent physical response.',
      'Zeros and negative values remain finite; they do not establish sensor operation. Recorded use, fan and flat-profile cells remain available in every source row.',
      'A recorded sample label is a deletion block, not a verified independent experiment. Aging, reused samples, apparatus and calibration can create additional dependence.',
      'The workbook/condition-table identity conflict is retained. No cross-source identity join or correction is performed.',
      'The three-pair minimum is a display policy, not sufficient sample size for inference. Constant inputs return null; no missing-data association interval is claimed.',
      'Ranks ignore amplitude: inspect both paired voltage ranges. Stable signs under group deletion do not establish robustness to measurement error or rounding; instrument resolution, noise and saturation thresholds are not established here.',
    ],
    reviewStatement: 'Assistant-checked source transcription and descriptive rank computation. Not independent scientific validation, a fitted physical model, an alarm evaluation or a confidence estimate.',
  };
  return structuredClone(result);
}

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Limit recursion work before hashing imported structures. */
function boundedJson(value: unknown): void {
  const pending: Array<{ value: unknown; depth: number }> = [{ value, depth: 0 }];
  const seen = new Set<object>();
  let entries = 0;
  while (pending.length) {
    const current = pending.pop()!;
    if (++entries > 150000 || current.depth > 40) throw new Error('Association package structure exceeds its bounds.');
    if (current.value === null || typeof current.value === 'string' || typeof current.value === 'boolean') continue;
    if (typeof current.value === 'number') {
      if (!Number.isFinite(current.value)) throw new Error('Association packages require finite JSON numbers.');
      continue;
    }
    if (typeof current.value !== 'object') throw new Error('Association packages require JSON values.');
    if (seen.has(current.value)) throw new Error('Association packages cannot contain circular or shared object references.');
    seen.add(current.value);
    for (const child of Object.values(current.value)) pending.push({ value: child, depth: current.depth + 1 });
  }
}

function verifyCurrentResult(raw: unknown): DetectorAssociationResult {
  if (!object(raw) || raw.schemaVersion !== 'ignis-detector-association-1') throw new Error('Unsupported association result schema.');
  if (raw.methodRevision !== ASSOCIATION_METHOD_REVISION) throw new Error('METHOD_DRIFT: this package uses a different association method.');
  const source = object(raw.source) ? raw.source : null;
  const workbook = source && object(source.workbook) ? source.workbook : null;
  if (workbook?.sha256 !== detectorDataset.source.workbook.sha256) {
    throw new Error('SOURCE_DRIFT: the package workbook does not match the currently pinned source.');
  }
  const selection = DetectorAssociationSelectionSchema.parse(raw.selection);
  boundedJson(raw);
  const recomputed = analyzeDetectorAssociation(selection);
  if (digestOf(raw) !== digestOf(recomputed)) {
    throw new Error('REPLAY_MISMATCH: package results or source details differ from current pinned-source recomputation.');
  }
  return recomputed;
}

/** Export only a result that reproduces against the current curated corpus. No workbook binary is embedded. */
export function createAssociationPackage(result: DetectorAssociationResult): AssociationPackage {
  // Structured-clone outputs can contain benign aliases; JSON serialization removes those aliases.
  const text = JSON.stringify(result);
  if (text.length > MAX_ASSOCIATION_PACKAGE_BYTES || new TextEncoder().encode(text).length > MAX_ASSOCIATION_PACKAGE_BYTES) {
    throw new Error('Association package exceeds 2 MiB.');
  }
  const current = verifyCurrentResult(JSON.parse(text));
  return { schemaVersion: 'ignis-association-export-1', result: current, resultSha256: digestOf(current) };
}

/** A checksum checks consistency, not authenticity; successful replay replaces the payload with recomputation. */
export function replayAssociationPackage(text: string): AssociationPackage {
  if (typeof text !== 'string' || text.length > MAX_ASSOCIATION_PACKAGE_BYTES
    || new TextEncoder().encode(text).length > MAX_ASSOCIATION_PACKAGE_BYTES) throw new Error('Association package exceeds 2 MiB.');
  let parsed: unknown;
  try { parsed = JSON.parse(text); } catch { throw new Error('Association package is not valid JSON.'); }
  if (!object(parsed) || Object.keys(parsed).sort().join(',') !== 'result,resultSha256,schemaVersion'
    || parsed.schemaVersion !== 'ignis-association-export-1'
    || typeof parsed.resultSha256 !== 'string' || !/^[a-f0-9]{64}$/.test(parsed.resultSha256)) {
    throw new Error('Unsupported association package fields or checksum.');
  }
  boundedJson(parsed.result);
  if (digestOf(parsed.result) !== parsed.resultSha256) throw new Error('Association package checksum mismatch.');
  const result = verifyCurrentResult(parsed.result);
  return { schemaVersion: 'ignis-association-export-1', result, resultSha256: digestOf(result) };
}
