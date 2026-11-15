/** Exact descriptive envelopes over independent closed voltage-cutoff ranges. */
import { z } from 'zod';
import { detectorDataset, type DetectorDataset, type DetectorMaterial } from './detector';
import {
  analyzePairedDetector, PairSelectionSchema, type PairBounds, type PairRow,
  type PairSummary, type PairedDetectorResult,
} from './pairedDetector';

/** Software input limit only; this is not an instrument calibration or validity bound. */
export const MAX_CUTOFF_ENVELOPE_V = 1_000_000;
const rangeSchema = z.object({
  min: z.number().finite().nonnegative().max(MAX_CUTOFF_ENVELOPE_V),
  max: z.number().finite().nonnegative().max(MAX_CUTOFF_ENVELOPE_V),
}).strict().superRefine((range, context) => {
  if (range.min > range.max) context.addIssue({ code: 'custom', path: ['max'], message: 'Range maximum must be at least its minimum.' });
});
export const CutoffEnvelopeSelectionSchema = z.object({
  flight: PairSelectionSchema.shape.flight,
  material: PairSelectionSchema.shape.material,
  includeReference: z.boolean(),
  channelA: PairSelectionSchema.shape.channelA,
  channelB: PairSelectionSchema.shape.channelB,
  exclusions: z.array(z.object({
    recordId: z.string().min(1).max(200), reason: z.string().trim().min(1).max(500),
  }).strict()).max(154),
  requireRecordedNoFanProblem: z.boolean().optional(),
  rangeA: rangeSchema,
  rangeB: rangeSchema,
}).strict().superRefine((selection, context) => {
  const pair = PairSelectionSchema.safeParse({
    flight: selection.flight, material: selection.material, includeReference: selection.includeReference,
    channelA: selection.channelA, channelB: selection.channelB,
    exclusions: selection.exclusions, requireRecordedNoFanProblem: selection.requireRecordedNoFanProblem,
    cutoffA: selection.rangeA.min, cutoffB: selection.rangeB.min,
  });
  if (!pair.success) for (const issue of pair.error.issues) context.addIssue({ code: 'custom', path: issue.path, message: issue.message });
});
export type CutoffEnvelopeSelection = z.infer<typeof CutoffEnvelopeSelectionSchema>;
export const DEFAULT_CUTOFF_ENVELOPE_SELECTION: Readonly<CutoffEnvelopeSelection> = Object.freeze({
  flight: 'all', material: 'all', includeReference: false,
  channelA: 'issScatterV', channelB: 'issObscurationV', exclusions: [],
  requireRecordedNoFanProblem: false,
  rangeA: Object.freeze({ min: 1, max: 3 }), rangeB: Object.freeze({ min: 1, max: 3 }),
});
Object.freeze(DEFAULT_CUTOFF_ENVELOPE_SELECTION.exclusions);

export type CutoffStability = 'strictly_positive' | 'strictly_negative' | 'identically_zero'
  | 'nonnegative_including_zero' | 'nonpositive_including_zero' | 'both_signs' | 'no_data';
export interface CutoffDifferenceEnvelope extends PairBounds { stability: CutoffStability }
export interface CutoffCorner {
  cutoffA: number;
  cutoffB: number;
  summary: PairSummary;
}
export interface CutoffStep {
  lower: number;
  upper: number;
  lowerInclusive: boolean;
  upperInclusive: true;
  representativeCutoff: number;
  finiteAtOrAbove: number;
  jointFiniteAtOrAbove: number;
  finiteFraction: number | null;
  jointFiniteFraction: number | null;
  /** Equal values remain included at the upper endpoint. */
  tiedRecordIdsAtUpper: string[];
  /** Values dropped immediately after the excluded lower endpoint; empty for a singleton. */
  droppedRecordIdsAfterLower: string[];
}
export interface CutoffAxisProfile {
  range: { min: number; max: number };
  finiteRows: number;
  jointFiniteRows: number;
  unavailableRows: number;
  steps: CutoffStep[];
}
export interface CutoffEnvelopeSummary {
  selectedRows: number;
  pairedFiniteRows: number;
  availability: PairSummary['availability'];
  pairedDifferenceEnvelope: CutoffDifferenceEnvelope;
  completionDifferenceEnvelope: CutoffDifferenceEnvelope;
  minimum: CutoffCorner;
  maximum: CutoffCorner;
  profiles: { channelA: CutoffAxisProfile; channelB: CutoffAxisProfile };
}
export interface CutoffWitnessRow {
  record: PairRow['record'];
  measurementA: PairRow['measurementA'];
  measurementB: PairRow['measurementB'];
  availability: PairRow['availability'];
  atMinimum: { aAtOrAbove: boolean | null; bAtOrAbove: boolean | null };
  atMaximum: { aAtOrAbove: boolean | null; bAtOrAbove: boolean | null };
}
export interface CutoffEnvelopeFlag { code: string; message: string; recordIds: string[] }
export interface CutoffEnvelopeResult {
  schemaVersion: 'ignis-cutoff-envelope-1';
  selection: CutoffEnvelopeSelection & { requireRecordedNoFanProblem: boolean };
  source: DetectorDataset['source'];
  policy: Omit<PairedDetectorResult['policy'], 'analysisKind'> & {
    analysisKind: 'descriptive_cutoff_range_certificate';
    rangeMeaning: string; extremaRule: string; comparison: string; profileMeaning: string;
  };
  channelA: Omit<PairedDetectorResult['channelA'], 'cutoff'> & { range: { min: number; max: number } };
  channelB: Omit<PairedDetectorResult['channelB'], 'cutoff'> & { range: { min: number; max: number } };
  summary: CutoffEnvelopeSummary;
  byFlight: Array<{ flight: '1' | '2'; label: 'SAME' | 'SAME-R'; summary: CutoffEnvelopeSummary }>;
  byMaterial: Array<{ material: DetectorMaterial; summary: CutoffEnvelopeSummary }>;
  baseEnvelopes: {
    selectedRows: number; pairedFiniteRows: number;
    pairedDifferenceEnvelope: CutoffDifferenceEnvelope;
    completionDifferenceEnvelope: CutoffDifferenceEnvelope;
  };
  rows: CutoffWitnessRow[];
  excludedRows: PairedDetectorResult['excludedRows'];
  flags: CutoffEnvelopeFlag[];
  instrumentNotes: string[];
  identityConflicts: DetectorDataset['identityConflicts'];
  reviewStatement: string;
}

function stability(lower: number, upper: number, denominator: number): CutoffStability {
  if (!denominator) return 'no_data';
  if (lower > 0) return 'strictly_positive';
  if (upper < 0) return 'strictly_negative';
  if (lower === 0 && upper === 0) return 'identically_zero';
  if (lower === 0) return 'nonnegative_including_zero';
  if (upper === 0) return 'nonpositive_including_zero';
  return 'both_signs';
}
function envelope(lower: number, upper: number, denominator: number): CutoffDifferenceEnvelope {
  if (lower > upper) throw new Error('Cutoff extrema are inconsistent.');
  return {
    lowerNumerator: lower, upperNumerator: upper, denominator,
    lowerFraction: denominator ? lower / denominator : null,
    upperFraction: denominator ? upper / denominator : null,
    stability: stability(lower, upper, denominator),
  };
}
function envelopes(minimum: PairSummary, maximum: PairSummary) {
  if (minimum.selectedRows !== maximum.selectedRows || minimum.pairedFiniteRows !== maximum.pairedFiniteRows
    || JSON.stringify(minimum.availability) !== JSON.stringify(maximum.availability)) {
    throw new Error('Cutoff ranges must preserve the selected population and channel availability.');
  }
  return {
    selectedRows: minimum.selectedRows, pairedFiniteRows: minimum.pairedFiniteRows,
    pairedDifferenceEnvelope: envelope(minimum.pairedDifference.numerator, maximum.pairedDifference.numerator, minimum.pairedFiniteRows),
    completionDifferenceEnvelope: envelope(minimum.completionDifferenceBounds.lowerNumerator, maximum.completionDifferenceBounds.upperNumerator, minimum.selectedRows),
  };
}

/** A closed domain is {L}, then (previous, endpoint]. This preserves >= ties without epsilon probes. */
function profile(rows: readonly PairRow[], side: 'A' | 'B', range: { min: number; max: number }): CutoffAxisProfile {
  const finite = rows.flatMap((row) => {
    const cell = side === 'A' ? row.measurementA : row.measurementB;
    return cell.status === 'finite' && cell.value !== null
      ? [{ id: row.record.id, value: cell.value, joint: row.availability === 'bothFinite' }] : [];
  });
  const jointFiniteRows = rows.filter((row) => row.availability === 'bothFinite').length;
  const endpoints = [...new Set([...finite.map((row) => row.value)
    .filter((value) => value > range.min && value <= range.max), range.max])].sort((a, b) => a - b);
  function step(lower: number, upper: number, lowerInclusive: boolean): CutoffStep {
    const atOrAbove = finite.filter((row) => row.value >= upper);
    const jointCount = atOrAbove.filter((row) => row.joint).length;
    return {
      lower, upper, lowerInclusive, upperInclusive: true, representativeCutoff: upper,
      finiteAtOrAbove: atOrAbove.length, jointFiniteAtOrAbove: jointCount,
      finiteFraction: finite.length ? atOrAbove.length / finite.length : null,
      jointFiniteFraction: jointFiniteRows ? jointCount / jointFiniteRows : null,
      tiedRecordIdsAtUpper: finite.filter((row) => row.value === upper).map((row) => row.id),
      droppedRecordIdsAfterLower: lowerInclusive ? [] : finite.filter((row) => row.value === lower).map((row) => row.id),
    };
  }
  const steps = [step(range.min, range.min, true)];
  let previous = range.min;
  for (const endpoint of endpoints) {
    if (endpoint > previous) steps.push(step(previous, endpoint, false));
    previous = endpoint;
  }
  return { range: { ...range }, finiteRows: finite.length, jointFiniteRows, unavailableRows: rows.length - finite.length, steps };
}

function summary(minimum: PairSummary, maximum: PairSummary, rows: readonly PairRow[], selection: CutoffEnvelopeSelection): CutoffEnvelopeSummary {
  return {
    ...envelopes(minimum, maximum), availability: minimum.availability,
    minimum: { cutoffA: selection.rangeA.max, cutoffB: selection.rangeB.min, summary: minimum },
    maximum: { cutoffA: selection.rangeA.min, cutoffB: selection.rangeB.max, summary: maximum },
    profiles: { channelA: profile(rows, 'A', selection.rangeA), channelB: profile(rows, 'B', selection.rangeB) },
  };
}

function oppositeStrictSigns(a: CutoffDifferenceEnvelope, b: CutoffDifferenceEnvelope): boolean {
  return (a.stability === 'strictly_negative' && b.stability === 'strictly_positive')
    || (a.stability === 'strictly_positive' && b.stability === 'strictly_negative');
}

/** Optional validated dataset injection is for finite algorithm/source-schema tests. No fitting occurs. */
export function analyzeCutoffEnvelope(
  requested: Partial<CutoffEnvelopeSelection> = {}, suppliedDataset: DetectorDataset = detectorDataset,
): CutoffEnvelopeResult {
  if (requested === null || typeof requested !== 'object' || Array.isArray(requested)) throw new Error('A cutoff envelope selection must be an object.');
  const parsed = CutoffEnvelopeSelectionSchema.parse({ ...DEFAULT_CUTOFF_ENVELOPE_SELECTION, ...requested });
  const { rangeA, rangeB, ...pairSelection } = parsed;
  const minimum = analyzePairedDetector({ ...pairSelection, cutoffA: rangeA.max, cutoffB: rangeB.min }, suppliedDataset);
  const maximum = analyzePairedDetector({ ...pairSelection, cutoffA: rangeA.min, cutoffB: rangeB.max }, suppliedDataset);
  const selection: CutoffEnvelopeResult['selection'] = {
    ...parsed, exclusions: minimum.selection.exclusions,
    requireRecordedNoFanProblem: minimum.selection.requireRecordedNoFanProblem,
    rangeA: { min: rangeA.min || 0, max: rangeA.max || 0 },
    rangeB: { min: rangeB.min || 0, max: rangeB.max || 0 },
  };
  if (minimum.rows.length !== maximum.rows.length || minimum.rows.some((row, index) => {
    const other = maximum.rows[index];
    return row.record.id !== other.record.id || row.record.workbookSha256 !== other.record.workbookSha256
      || row.record.sheet !== other.record.sheet || row.record.excelRow !== other.record.excelRow || row.availability !== other.availability;
  })) throw new Error('Cutoff corners must contain identical source rows and availability.');
  const pooled = summary(minimum.summary, maximum.summary, minimum.rows, selection);
  const byFlight: CutoffEnvelopeResult['byFlight'] = minimum.byFlight.map((item, index) => ({
    flight: item.flight, label: item.label,
    summary: summary(item.summary, maximum.byFlight[index].summary, minimum.rows.filter((row) => row.record.flight === item.flight), selection),
  }));
  const byMaterial = minimum.byMaterial.map((item, index) => ({
    material: item.material,
    summary: summary(item.summary, maximum.byMaterial[index].summary, minimum.rows.filter((row) => row.record.material === item.material), selection),
  }));
  const baseEnvelopes = envelopes(minimum.baseSummary, maximum.baseSummary);
  const flags: CutoffEnvelopeFlag[] = minimum.flags.filter((flag) => !['flight_stratum_reversal', 'selection_direction_reversal'].includes(flag.code));
  if (oppositeStrictSigns(byFlight[0].summary.pairedDifferenceEnvelope, byFlight[1].summary.pairedDifferenceEnvelope)) flags.push({
    code: 'robust_flight_sign_reversal', message: 'The jointly finite flight strata have opposite nonzero signs for every cutoff pair in the selected rectangle. This is descriptive cohort sensitivity.', recordIds: minimum.rows.map((row) => row.record.id),
  });
  if (oppositeStrictSigns(byFlight[0].summary.completionDifferenceEnvelope, byFlight[1].summary.completionDifferenceEnvelope)) flags.push({
    code: 'completion_robust_flight_sign_reversal', message: 'Opposite flight-stratum signs also persist under every unrestricted binary completion of unavailable readings and every cutoff pair in the rectangle.', recordIds: minimum.rows.map((row) => row.record.id),
  });
  if (pooled.pairedDifferenceEnvelope.stability === 'both_signs') flags.push({
    code: 'cutoff_direction_changes', message: 'The selected cutoff rectangle permits both signs of the pooled jointly finite difference.', recordIds: minimum.rows.map((row) => row.record.id),
  });
  if (oppositeStrictSigns(baseEnvelopes.pairedDifferenceEnvelope, pooled.pairedDifferenceEnvelope)) flags.push({
    code: 'robust_selection_direction_reversal', message: 'The retained and base populations have opposite signs throughout the selected cutoff rectangle; inspect the exclusions and changed flight coverage.', recordIds: minimum.excludedRows.map((row) => row.record.id),
  });
  function channelWithRange(channel: PairedDetectorResult['channelA'], range: { min: number; max: number }) {
    return { id: channel.id, label: channel.label, column: channel.column, unit: channel.unit,
      sourceHeader: channel.sourceHeader, interpretation: channel.interpretation, range };
  }
  const result: CutoffEnvelopeResult = {
    schemaVersion: 'ignis-cutoff-envelope-1', selection, source: minimum.source,
    policy: {
      ...minimum.policy, analysisKind: 'descriptive_cutoff_range_certificate',
      rangeMeaning: 'Independent closed analyst-selected cutoff ranges, in each channel\'s stored volts. They are not equivalent physical thresholds or calibrated alarm domains.',
      extremaRule: 'Difference is nonincreasing in cutoff A and nondecreasing in cutoff B. Minimum: (A maximum, B minimum). Maximum: (A minimum, B maximum). The population is fixed.',
      comparison: 'Exact comparisons of stored finite numeric values with >=; no epsilon, rounding tolerance or physical uncertainty is introduced.',
      profileMeaning: 'A singleton at the lower endpoint followed by open-left, closed-right intervals preserves equality ties. Counts are constant within each interval; rectangle area is not a probability.',
    },
    channelA: channelWithRange(minimum.channelA, selection.rangeA), channelB: channelWithRange(minimum.channelB, selection.rangeB),
    summary: pooled, byFlight, byMaterial, baseEnvelopes,
    rows: minimum.rows.map((row, index) => ({
      record: row.record, measurementA: row.measurementA, measurementB: row.measurementB, availability: row.availability,
      atMinimum: { aAtOrAbove: row.aAtOrAbove, bAtOrAbove: row.bAtOrAbove },
      atMaximum: { aAtOrAbove: maximum.rows[index].aAtOrAbove, bAtOrAbove: maximum.rows[index].bAtOrAbove },
    })),
    excludedRows: minimum.excludedRows, flags, instrumentNotes: minimum.instrumentNotes,
    identityConflicts: minimum.identityConflicts,
    reviewStatement: 'Assistant-checked finite descriptive cutoff sensitivity on source-bound rows. Not independent scientific validation, an alarm test, a detector-superiority estimate or a physical prediction.',
  };
  return structuredClone(result);
}
