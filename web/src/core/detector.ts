/**
 * Descriptive cutoffs on cached SAME voltage readings. This module does not
 * classify alarms, infer sensor operation, or treat source rows as independent trials.
 */
import { z } from 'zod';
import detectorJson from '../../data/detector-data.json';

export const DETECTOR_MATERIALS = ['Kapton', 'Teflon', 'Lampwick', 'Silicone', 'Pyrell', 'DBP'] as const;
export type DetectorMaterial = (typeof DETECTOR_MATERIALS)[number];
export const DETECTOR_CHANNEL_IDS = ['issScatterV', 'issObscurationV', 'stsV', 'ionDeltaV'] as const;
export type DetectorChannelId = (typeof DETECTOR_CHANNEL_IDS)[number];

const sourceCellSchema = z.object({
  cell: z.string().regex(/^[A-Z]+[1-9][0-9]*$/),
  originalValue: z.string().nullable(),
  storageType: z.string().nullable(),
  formula: z.string().nullable(),
}).strict();

const detectorCellSchema = sourceCellSchema.extend({
  value: z.number().finite().nullable(),
  error: z.string().nullable(),
  status: z.enum(['finite', 'missing', 'error', 'non_numeric']),
}).superRefine((cell, context) => {
  if ((cell.status === 'finite') !== (cell.value !== null)) {
    context.addIssue({ code: 'custom', message: 'Only finite source readings may have a numeric value.' });
  }
  if ((cell.status === 'error') !== (cell.error !== null)) {
    context.addIssue({ code: 'custom', message: 'Only source error cells may carry an error value.' });
  }
  if (cell.status === 'finite' && (cell.originalValue === null
    || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(cell.originalValue.trim())
    || Number(cell.originalValue) !== cell.value)) {
    context.addIssue({ code: 'custom', message: 'Finite readings must agree with the original numeric cache text.' });
  }
});
export type DetectorCell = z.infer<typeof detectorCellSchema>;

const identityCellsSchema = z.object({
  flight: sourceCellSchema, carousel: sourceCellSchema, material: sourceCellSchema,
  sampleId: sourceCellSchema, testId: sourceCellSchema, sameTestNumber: sourceCellSchema,
  description: sourceCellSchema,
}).strict();

const detectorRecordSchema = z.object({
  id: z.string(), workbookSha256: z.string().regex(/^[a-f0-9]{64}$/),
  sheet: z.literal('Material Sort'), excelRow: z.number().int().positive(),
  flight: z.enum(['1', '2']), flightLabel: z.enum(['SAME', 'SAME-R']),
  material: z.enum(DETECTOR_MATERIALS), materialRole: z.enum(['reference', 'spacecraft_material']),
  sampleId: z.string().nullable(), testId: z.string().nullable(),
  sameTestNumber: z.string().nullable(), description: z.string().nullable(),
  identityCells: identityCellsSchema,
  conditions: z.object({
    inletVelocityCmPerSec: detectorCellSchema, heatingResistanceRatio: detectorCellSchema,
    heatingDurationSec: detectorCellSchema, primaryAgingDurationSec: detectorCellSchema,
    primaryMixingDurationSec: detectorCellSchema, netAgingDurationSec: detectorCellSchema,
  }).strict(),
  instrumentStatusAsRecorded: z.object({
    primaryStsUse: sourceCellSchema, secondaryStsUse: sourceCellSchema,
    fanProblem: sourceCellSchema, flatProfiles: sourceCellSchema,
  }).strict(),
  channels: z.object({
    issScatterV: detectorCellSchema, issObscurationV: detectorCellSchema,
    stsV: detectorCellSchema, ionDeltaV: detectorCellSchema,
  }).strict(),
  sizes: z.object({ countMeanUm: detectorCellSchema, diameterOfAverageMassUm: detectorCellSchema }).strict(),
}).strict();
export type DetectorRecord = z.infer<typeof detectorRecordSchema>;

const channelDefinitionSchema = z.object({
  label: z.string(), column: z.string(), unit: z.literal('V'),
  sourceHeader: z.string(), interpretation: z.string(),
}).strict();

export const detectorDatasetSchema = z.object({
  schemaVersion: z.literal('ignis-detector-data-1'), curationDate: z.string(),
  source: z.object({
    accession: z.literal('PSI-101'), recordVersion: z.literal(4), title: z.string(),
    recordUrl: z.string().url(), doi: z.string(), doiUrl: z.string().url(),
    license: z.object({ id: z.string(), name: z.string(), url: z.string().url(), basis: z.string() }).strict(),
    recordModifiedDate: z.string(), recordSha256: z.string().regex(/^[a-f0-9]{64}$/),
    workbook: z.object({
      fileName: z.string(), legacyFileName: z.string(), sha256: z.string().regex(/^[a-f0-9]{64}$/),
      sizeBytes: z.number().int().positive(), sheet: z.literal('Material Sort'), headersRow: z.literal(2),
      parseMode: z.literal('stored_XLSX_cache_no_recalculation'), retrievedAtUtc: z.string(),
    }).strict(),
    review: z.object({
      level: z.literal('assistant_checked'), humanReviewed: z.literal(false), method: z.string(),
      independentValidation: z.literal(false),
    }).strict(),
  }).strict(),
  sheetHeaders: z.record(z.string(), z.string()),
  channels: z.object({
    issScatterV: channelDefinitionSchema, issObscurationV: channelDefinitionSchema,
    stsV: channelDefinitionSchema, ionDeltaV: channelDefinitionSchema,
  }).strict(),
  policy: z.object({
    analysisKind: z.literal('descriptive_voltage_cutoff'), cutoffMeaning: z.string(),
    denominator: z.string(), rowMeaning: z.string(), zeroMeaning: z.string(),
    missingMeaning: z.string(), channelMeaning: z.string(), filterMeaning: z.string(),
    sourceScope: z.string(), referenceMeaning: z.string(), alarmClassification: z.literal(false),
    physicalPrediction: z.literal(false), independentTrials: z.literal(false),
  }).strict(),
  identityConflicts: z.array(z.object({
    id: z.string(), status: z.literal('unresolved'), statement: z.string(), keyExamined: z.array(z.string()),
    conditionTable: z.object({ fileName: z.string(), sha256: z.string(), rowCount: z.number().int() }).strict(),
    workbookFlight2RowCount: z.number().int(),
    csvOnlyRecords: z.array(z.object({
      csvLineIncludingHeader: z.number().int().positive(), originalFields: z.record(z.string(), z.string()),
    }).strict()),
    workbookOnlyRecords: z.array(z.object({
      recordId: z.string(), sheet: z.string(), excelRow: z.number().int().positive(),
      identityCells: identityCellsSchema,
    }).strict()),
  }).strict()),
  records: z.array(detectorRecordSchema),
}).strict().superRefine((dataset, context) => {
  const seen = new Set<string>();
  const rows = new Set<string>();
  for (const record of dataset.records) {
    if (seen.has(record.id) || record.workbookSha256 !== dataset.source.workbook.sha256) {
      context.addIssue({ code: 'custom', message: 'Detector record identity or workbook hash is inconsistent.' });
    }
    seen.add(record.id);
    const sourceRow = JSON.stringify([record.workbookSha256, record.sheet, record.excelRow]);
    if (rows.has(sourceRow)) context.addIssue({ code: 'custom', message: 'Repeated workbook/sheet/row identity cannot be counted twice.' });
    rows.add(sourceRow);
    for (const channel of DETECTOR_CHANNEL_IDS) {
      if (record.channels[channel].cell !== `${dataset.channels[channel].column}${record.excelRow}`) {
        context.addIssue({ code: 'custom', message: `Source cell does not match its channel and row: ${record.id}.` });
      }
    }
    if ((record.material === 'DBP') !== (record.materialRole === 'reference')) {
      context.addIssue({ code: 'custom', message: 'DBP must remain a reference material.' });
    }
    if (record.flightLabel !== (record.flight === '1' ? 'SAME' : 'SAME-R')) {
      context.addIssue({ code: 'custom', message: 'Flight label does not match the recorded flight marker.' });
    }
  }
});
export type DetectorDataset = z.infer<typeof detectorDatasetSchema>;
function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}
export const detectorDataset: DetectorDataset = deepFreeze(detectorDatasetSchema.parse(detectorJson));
export const DETECTOR_CHANNELS = detectorDataset.channels;

const selectionSchema = z.object({
  flight: z.enum(['all', '1', '2']), material: z.enum(['all', ...DETECTOR_MATERIALS]),
  channel: z.enum(DETECTOR_CHANNEL_IDS), cutoff: z.number().finite().nonnegative(),
  includeReference: z.boolean(),
}).strict();
export type DetectorSelection = z.infer<typeof selectionSchema>;
export const DEFAULT_DETECTOR_SELECTION: Readonly<DetectorSelection> = Object.freeze({
  flight: 'all', material: 'all', channel: 'issScatterV', cutoff: 2, includeReference: false,
});

export type DetectorClassification = 'below' | 'at_or_above' | 'missing' | 'error' | 'non_numeric';
export interface DetectorSelectedRow {
  record: DetectorRecord;
  measurement: DetectorCell;
  classification: DetectorClassification;
}
export interface DetectorCounts {
  total: number;
  finite: number;
  missing: number;
  error: number;
  nonNumeric: number;
  below: number;
  atOrAbove: number;
  /** Null when there are no finite readings. Unrounded descriptive percentages. */
  belowPercent: number | null;
  atOrAbovePercent: number | null;
}
export interface DetectorMaterialSummary {
  material: DetectorMaterial;
  materialRole: 'reference' | 'spacecraft_material';
  counts: DetectorCounts;
}
export interface DetectorAnalysis {
  schemaVersion: 'ignis-detector-analysis-1';
  selection: DetectorSelection;
  source: DetectorDataset['source'];
  policy: DetectorDataset['policy'];
  identityConflicts: DetectorDataset['identityConflicts'];
  channel: DetectorDataset['channels'][DetectorChannelId];
  counts: DetectorCounts;
  byMaterial: DetectorMaterialSummary[];
  rows: DetectorSelectedRow[];
}
export interface DetectorExport extends DetectorAnalysis {
  exportSchemaVersion: 'ignis-detector-export-1';
  exportDescription: string;
}

function classify(cell: DetectorCell, cutoff: number): DetectorClassification {
  if (cell.status === 'missing' || cell.status === 'error' || cell.status === 'non_numeric') return cell.status;
  if (cell.value === null || !Number.isFinite(cell.value)) return 'non_numeric';
  return cell.value < cutoff ? 'below' : 'at_or_above';
}

function countRows(rows: readonly DetectorSelectedRow[]): DetectorCounts {
  const counts: DetectorCounts = {
    total: rows.length, finite: 0, missing: 0, error: 0, nonNumeric: 0,
    below: 0, atOrAbove: 0, belowPercent: null, atOrAbovePercent: null,
  };
  for (const row of rows) {
    switch (row.classification) {
      case 'below': counts.below += 1; counts.finite += 1; break;
      case 'at_or_above': counts.atOrAbove += 1; counts.finite += 1; break;
      case 'missing': counts.missing += 1; break;
      case 'error': counts.error += 1; break;
      case 'non_numeric': counts.nonNumeric += 1; break;
    }
  }
  if (counts.finite !== 0) {
    counts.belowPercent = 100 * counts.below / counts.finite;
    counts.atOrAbovePercent = 100 * counts.atOrAbove / counts.finite;
  }
  return counts;
}

/** Source records only: defaults exclude the 20 DBP reference rows. */
export function analyzeDetector(
  requested: Partial<DetectorSelection> = {},
  suppliedDataset: DetectorDataset = detectorDataset,
): DetectorAnalysis {
  const partial = selectionSchema.partial().parse(requested);
  const selection = selectionSchema.parse({ ...DEFAULT_DETECTOR_SELECTION, ...partial });
  const dataset = detectorDatasetSchema.parse(suppliedDataset);
  const rows: DetectorSelectedRow[] = dataset.records
    .filter((record) => selection.flight === 'all' || record.flight === selection.flight)
    .filter((record) => selection.material === 'all' || record.material === selection.material)
    .filter((record) => selection.includeReference || record.materialRole !== 'reference')
    .map((record) => {
      const measurement = record.channels[selection.channel];
      return { record, measurement, classification: classify(measurement, selection.cutoff) };
    });
  const byMaterial: DetectorMaterialSummary[] = DETECTOR_MATERIALS.flatMap((material) => {
    const materialRows = rows.filter((row) => row.record.material === material);
    return materialRows.length === 0 ? [] : [{
      material, materialRole: material === 'DBP' ? 'reference' : 'spacecraft_material',
      counts: countRows(materialRows),
    }];
  });
  return structuredClone({
    schemaVersion: 'ignis-detector-analysis-1', selection,
    source: dataset.source, policy: dataset.policy, identityConflicts: dataset.identityConflicts,
    channel: dataset.channels[selection.channel], counts: countRows(rows), byMaterial, rows,
  });
}

/** Deterministic, detached export of precisely the selected analysis and source records. */
export function exportDetectorAnalysis(
  requested: Partial<DetectorSelection> = {},
  dataset: DetectorDataset = detectorDataset,
): DetectorExport {
  return structuredClone({
    ...analyzeDetector(requested, dataset),
    exportSchemaVersion: 'ignis-detector-export-1' as const,
    exportDescription: 'Cached source readings and descriptive voltage cutoffs; not raw telemetry, alarm outcomes or a physical prediction.',
  });
}
