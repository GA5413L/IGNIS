/** Finite, same-row comparisons of recorded voltage cutoffs; no physical or alarm model. */
import { z } from 'zod';
import {
  DETECTOR_CHANNEL_IDS, DETECTOR_MATERIALS, detectorDataset, detectorDatasetSchema,
  type DetectorCell, type DetectorChannelId, type DetectorDataset, type DetectorMaterial,
  type DetectorRecord,
} from './detector';

export const PairSelectionSchema = z.object({
  flight: z.enum(['all', '1', '2']),
  material: z.enum(['all', ...DETECTOR_MATERIALS]),
  includeReference: z.boolean(),
  channelA: z.enum(DETECTOR_CHANNEL_IDS),
  channelB: z.enum(DETECTOR_CHANNEL_IDS),
  cutoffA: z.number().finite().nonnegative(),
  cutoffB: z.number().finite().nonnegative(),
  exclusions: z.array(z.object({
    recordId: z.string().min(1), reason: z.string().trim().min(1).max(500),
  }).strict()).max(154),
  requireRecordedNoFanProblem: z.boolean().optional(),
}).strict().superRefine((selection, context) => {
  if (selection.channelA === selection.channelB) {
    context.addIssue({ code: 'custom', path: ['channelB'], message: 'Choose two distinct recorded channels.' });
  }
  const seen = new Set<string>();
  for (const exclusion of selection.exclusions) {
    if (seen.has(exclusion.recordId)) {
      context.addIssue({ code: 'custom', path: ['exclusions'], message: 'Exclusion record IDs must be unique.' });
    }
    seen.add(exclusion.recordId);
  }
});
export type PairSelection = z.infer<typeof PairSelectionSchema>;
export const DEFAULT_PAIR_SELECTION: Readonly<PairSelection> = Object.freeze({
  flight: 'all', material: 'all', includeReference: false,
  channelA: 'issScatterV', channelB: 'issObscurationV', cutoffA: 2, cutoffB: 2,
  exclusions: [], requireRecordedNoFanProblem: false,
});
Object.freeze(DEFAULT_PAIR_SELECTION.exclusions);

export interface PairBounds {
  lowerNumerator: number;
  upperNumerator: number;
  denominator: number;
  lowerFraction: number | null;
  upperFraction: number | null;
}
export interface PairMarginal {
  finite: number;
  below: number;
  atOrAbove: number;
  missing: number;
  error: number;
  nonNumeric: number;
  unavailable: number;
  atOrAboveFraction: number | null;
  completionBounds: PairBounds;
}
export type PairAvailability = 'bothFinite' | 'aOnly' | 'bOnly' | 'neither';
export interface PairRow {
  record: DetectorRecord;
  measurementA: DetectorCell;
  measurementB: DetectorCell;
  aAtOrAbove: boolean | null;
  bAtOrAbove: boolean | null;
  availability: PairAvailability;
}
export interface PairSummary {
  selectedRows: number;
  pairedFiniteRows: number;
  availability: Record<PairAvailability, number>;
  pairCounts: {
    aBelowBBelow: number;
    aBelowBAtOrAbove: number;
    aAtOrAboveBBelow: number;
    aAtOrAboveBAtOrAbove: number;
  };
  marginalA: PairMarginal;
  marginalB: PairMarginal;
  pairedDifference: { numerator: number; denominator: number; fraction: number | null };
  completionDifferenceBounds: PairBounds;
}
export type PairFlagCode = 'different_measurement_operators' | 'unavailable_pairs'
  | 'flight_stratum_reversal' | 'selection_direction_reversal' | 'recorded_fan_filter'
  | 'flight_coverage_changed' | 'explicit_exclusions' | 'empty_selection';
export interface PairFlag { code: PairFlagCode; message: string; recordIds: string[] }
type PairChannel = DetectorDataset['channels'][DetectorChannelId] & { id: DetectorChannelId; cutoff: number };
export interface PairedDetectorResult {
  schemaVersion: 'ignis-paired-detector-1';
  selection: PairSelection & { requireRecordedNoFanProblem: boolean };
  source: DetectorDataset['source'];
  policy: Omit<DetectorDataset['policy'], 'analysisKind'> & {
    analysisKind: 'paired_descriptive_voltage_cutoff'; pairing: string; completionBoundsMeaning: string;
  };
  channelA: PairChannel;
  channelB: PairChannel;
  baseSummary: PairSummary;
  summary: PairSummary;
  byFlight: Array<{ flight: '1' | '2'; label: 'SAME' | 'SAME-R'; summary: PairSummary }>;
  byMaterial: Array<{ material: DetectorMaterial; summary: PairSummary }>;
  rows: PairRow[];
  excludedRows: Array<{ record: DetectorRecord; reasons: string[]; explicit: boolean; fanFilter: boolean }>;
  flags: PairFlag[];
  instrumentNotes: string[];
  identityConflicts: DetectorDataset['identityConflicts'];
  reviewStatement: string;
}

function bounds(lower: number, upper: number, denominator: number): PairBounds {
  return {
    lowerNumerator: lower, upperNumerator: upper, denominator,
    lowerFraction: denominator ? lower / denominator : null,
    upperFraction: denominator ? upper / denominator : null,
  };
}

function classify(cell: DetectorCell, cutoff: number): boolean | null {
  return cell.status === 'finite' && cell.value !== null ? cell.value >= cutoff : null;
}

function pairedRow(record: DetectorRecord, selection: PairSelection): PairRow {
  const measurementA = record.channels[selection.channelA];
  const measurementB = record.channels[selection.channelB];
  const aAtOrAbove = classify(measurementA, selection.cutoffA);
  const bAtOrAbove = classify(measurementB, selection.cutoffB);
  const availability: PairAvailability = aAtOrAbove !== null
    ? bAtOrAbove !== null ? 'bothFinite' : 'aOnly'
    : bAtOrAbove !== null ? 'bOnly' : 'neither';
  return { record, measurementA, measurementB, aAtOrAbove, bAtOrAbove, availability };
}

function marginal(rows: readonly PairRow[], side: 'A' | 'B'): PairMarginal {
  const result: PairMarginal = {
    finite: 0, below: 0, atOrAbove: 0, missing: 0, error: 0, nonNumeric: 0,
    unavailable: 0, atOrAboveFraction: null, completionBounds: bounds(0, 0, rows.length),
  };
  for (const row of rows) {
    const cell = side === 'A' ? row.measurementA : row.measurementB;
    const above = side === 'A' ? row.aAtOrAbove : row.bAtOrAbove;
    if (above !== null) {
      result.finite += 1;
      if (above) result.atOrAbove += 1;
      else result.below += 1;
    } else {
      result.unavailable += 1;
      if (cell.status === 'missing') result.missing += 1;
      else if (cell.status === 'error') result.error += 1;
      else result.nonNumeric += 1;
    }
  }
  result.atOrAboveFraction = result.finite ? result.atOrAbove / result.finite : null;
  result.completionBounds = bounds(result.atOrAbove, result.atOrAbove + result.unavailable, rows.length);
  return result;
}

function summarize(rows: readonly PairRow[]): PairSummary {
  const availability: PairSummary['availability'] = { bothFinite: 0, aOnly: 0, bOnly: 0, neither: 0 };
  const pairCounts: PairSummary['pairCounts'] = {
    aBelowBBelow: 0, aBelowBAtOrAbove: 0, aAtOrAboveBBelow: 0, aAtOrAboveBAtOrAbove: 0,
  };
  let lower = 0;
  let upper = 0;
  for (const row of rows) {
    const a = row.aAtOrAbove;
    const b = row.bAtOrAbove;
    availability[row.availability] += 1;
    if (a !== null && b !== null) {
      if (a && b) pairCounts.aAtOrAboveBAtOrAbove += 1;
      else if (a) pairCounts.aAtOrAboveBBelow += 1;
      else if (b) pairCounts.aBelowBAtOrAbove += 1;
      else pairCounts.aBelowBBelow += 1;
    }
    lower += Number(a ?? false) - Number(b ?? true);
    upper += Number(a ?? true) - Number(b ?? false);
  }
  const denominator = availability.bothFinite;
  const numerator = pairCounts.aAtOrAboveBBelow - pairCounts.aBelowBAtOrAbove;
  return {
    selectedRows: rows.length, pairedFiniteRows: denominator, availability, pairCounts,
    marginalA: marginal(rows, 'A'), marginalB: marginal(rows, 'B'),
    pairedDifference: { numerator, denominator, fraction: denominator ? numerator / denominator : null },
    completionDifferenceBounds: bounds(lower, upper, rows.length),
  };
}

/** Optional dataset injection supports isolated source/schema tests; every supplied dataset is validated. */
export function analyzePairedDetector(
  requested: Partial<PairSelection> = {},
  suppliedDataset: DetectorDataset = detectorDataset,
): PairedDetectorResult {
  if (requested === null || typeof requested !== 'object' || Array.isArray(requested)) {
    throw new Error('A paired detector selection must be an object.');
  }
  const parsed = PairSelectionSchema.parse({ ...DEFAULT_PAIR_SELECTION, ...requested });
  const selection: PairedDetectorResult['selection'] = {
    ...parsed, requireRecordedNoFanProblem: parsed.requireRecordedNoFanProblem ?? false,
    exclusions: [...parsed.exclusions].sort((a, b) => a.recordId < b.recordId ? -1 : a.recordId > b.recordId ? 1 : 0),
  };
  const dataset = detectorDatasetSchema.parse(suppliedDataset);
  const seen = new Set<string>();
  for (const record of dataset.records) {
    const key = JSON.stringify([record.workbookSha256, record.sheet, record.excelRow]);
    if (seen.has(key)) throw new Error('Repeated workbook/sheet/row identity cannot be paired twice.');
    seen.add(key);
    for (const channel of [selection.channelA, selection.channelB]) {
      if (record.channels[channel].cell !== `${dataset.channels[channel].column}${record.excelRow}`) {
        throw new Error(`Source cell does not match its channel and row: ${record.id}.`);
      }
    }
  }
  const baseRecords = dataset.records
    .filter((record) => selection.flight === 'all' || record.flight === selection.flight)
    .filter((record) => selection.material === 'all' || record.material === selection.material)
    .filter((record) => selection.includeReference || record.materialRole !== 'reference')
    .sort((a, b) => a.excelRow - b.excelRow);
  const availableIds = new Set(baseRecords.map((record) => record.id));
  for (const exclusion of selection.exclusions) {
    if (!availableIds.has(exclusion.recordId)) {
      throw new Error(`Exclusion record is unknown or outside the selected cohort: ${exclusion.recordId}.`);
    }
  }
  const explicit = new Map(selection.exclusions.map((item) => [item.recordId, item.reason]));
  const rows: PairRow[] = [];
  const excludedRows: PairedDetectorResult['excludedRows'] = [];
  for (const record of baseRecords) {
    const reason = explicit.get(record.id);
    const fanFilter = selection.requireRecordedNoFanProblem
      && record.instrumentStatusAsRecorded.fanProblem.originalValue !== 'n';
    const reasons: string[] = [];
    if (reason !== undefined) reasons.push(reason);
    if (fanFilter) reasons.push('Fan-problem source token is not the literal recorded n; actual fan operation remains unclassified.');
    if (reasons.length) excludedRows.push({ record, reasons, explicit: reason !== undefined, fanFilter });
    else rows.push(pairedRow(record, selection));
  }
  const baseSummary = summarize(baseRecords.map((record) => pairedRow(record, selection)));
  const summary = summarize(rows);
  const byFlight: PairedDetectorResult['byFlight'] = (['1', '2'] as const).map((flight) => ({
    flight, label: flight === '1' ? 'SAME' : 'SAME-R',
    summary: summarize(rows.filter((row) => row.record.flight === flight)),
  }));
  const byMaterial = DETECTOR_MATERIALS.map((material) => ({
    material, summary: summarize(rows.filter((row) => row.record.material === material)),
  }));
  const ids = rows.map((row) => row.record.id);
  const flags: PairFlag[] = [{
    code: 'different_measurement_operators',
    message: 'The channels have different measurement operators; equal voltage cutoffs do not establish equivalent responses.', recordIds: [],
  }];
  const unavailable = rows.filter((row) => row.availability !== 'bothFinite').map((row) => row.record.id);
  if (unavailable.length) flags.push({
    code: 'unavailable_pairs', message: `${unavailable.length} selected row(s) lack a jointly finite pair; paired and full-selection denominators differ.`, recordIds: unavailable,
  });
  const signs = new Set(byFlight.filter((row) => row.summary.pairedFiniteRows > 0).map((row) => Math.sign(row.summary.pairedDifference.numerator)));
  if (signs.has(-1) && signs.has(1)) flags.push({
    code: 'flight_stratum_reversal', message: 'The descriptive paired difference has opposite signs in the two flight strata; inspect configuration and population before interpreting the pooled result.', recordIds: ids,
  });
  if (Math.sign(baseSummary.pairedDifference.numerator) * Math.sign(summary.pairedDifference.numerator) === -1) flags.push({
    code: 'selection_direction_reversal', message: 'The paired difference changes sign after the selected exclusions; the retained population differs from the base cohort.', recordIds: excludedRows.map((row) => row.record.id),
  });
  if (selection.requireRecordedNoFanProblem) flags.push({
    code: 'recorded_fan_filter', message: `The literal recorded-n fan filter excluded ${excludedRows.filter((row) => row.fanFilter).length} row(s). An unrecorded flag does not establish a fan problem or its absence.`,
    recordIds: excludedRows.filter((row) => row.fanFilter).map((row) => row.record.id),
  });
  const retainedFlights = new Set(rows.map((row) => row.record.flight));
  const removedFlights = [...new Set(baseRecords.map((row) => row.flight))].filter((flight) => !retainedFlights.has(flight));
  if (removedFlights.length) flags.push({
    code: 'flight_coverage_changed', message: `Exclusions leave no retained rows for base-cohort flight marker(s): ${removedFlights.join(', ')}.`,
    recordIds: excludedRows.filter((row) => removedFlights.includes(row.record.flight)).map((row) => row.record.id),
  });
  if (explicit.size) flags.push({
    code: 'explicit_exclusions', message: `${explicit.size} explicitly selected row(s) were excluded; each reason and source record is retained.`, recordIds: [...explicit.keys()],
  });
  if (!rows.length) flags.push({ code: 'empty_selection', message: 'No rows remain in the selected population; fractions and bounds are null.', recordIds: [] });
  const result: PairedDetectorResult = {
    schemaVersion: 'ignis-paired-detector-1', selection, source: dataset.source,
    policy: {
      ...dataset.policy, analysisKind: 'paired_descriptive_voltage_cutoff',
      denominator: 'The joint table uses only same-row jointly finite pairs. Marginals use their own finite rows; completion bounds use all selected rows.',
      pairing: 'Exact workbook SHA-256, sheet and Excel row; displayed sample/test identifiers are never join keys.',
      completionBoundsMeaning: 'Attainable finite-row bounds over unrestricted binary completions at the analyst cutoffs. Not imputed readings, confidence intervals or physical predictions.',
    },
    channelA: { ...dataset.channels[selection.channelA], id: selection.channelA, cutoff: selection.cutoffA },
    channelB: { ...dataset.channels[selection.channelB], id: selection.channelB, cutoff: selection.cutoffB },
    baseSummary, summary, byFlight, byMaterial, rows, excludedRows, flags,
    instrumentNotes: [
      'Cached zeros and negative voltages remain finite source readings; their values do not establish whether a channel was operating.',
      'Primary/secondary use tokens, fan-problem and flat-profile cells remain as recorded. No unstated status or calibration is inferred.',
      'The optional fan filter requires the exact source token n and changes the population; unrecorded flags are not classified as failures.',
    ],
    identityConflicts: dataset.identityConflicts,
    reviewStatement: 'Assistant-checked source transcription and finite descriptive computation. Not independent scientific validation, an alarm test, a detector-superiority estimate or a physical prediction.',
  };
  return structuredClone(result);
}
