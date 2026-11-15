/** Source-bound descriptive analyses attached to a confirmed request. Never model-validation evidence. */
import { z } from 'zod';
import { digestOf } from './canonicalize';
import { compareConditions, conditionDataset, type ConditionComparison } from './conditions';
import { exportDetectorAnalysis, detectorDataset, DETECTOR_CHANNEL_IDS, DETECTOR_MATERIALS, type DetectorExport } from './detector';
import { PairSelectionSchema, analyzePairedDetector, type PairedDetectorResult } from './pairedDetector';
import { CutoffEnvelopeSelectionSchema, analyzeCutoffEnvelope, type CutoffEnvelopeResult } from './cutoffEnvelope';

export const RESEARCH_METHOD_REVISION = 'descriptive-analysis-2026-11-15.2';
export const ConditionSelectionSchema = z.strictObject({
  kind: z.literal('conditions'), cohortId: z.string().min(1).max(60),
  oxygenPercent: z.number().finite().positive().max(100), pressureKPa: z.number().finite().positive().max(2000),
});
export const DetectorSelectionSchema = z.strictObject({
  kind: z.literal('detector'), flight: z.enum(['all', '1', '2']), material: z.enum(['all', ...DETECTOR_MATERIALS]),
  channel: z.enum(DETECTOR_CHANNEL_IDS), cutoff: z.number().finite().nonnegative().max(1e6), includeReference: z.boolean(),
});
export const PairResearchSelectionSchema = z.strictObject({ kind: z.literal('detector_pair'), options: PairSelectionSchema });
export const CutoffResearchSelectionSchema = z.strictObject({ kind: z.literal('cutoff_envelope'), options: CutoffEnvelopeSelectionSchema });
export const ResearchSelectionSchema = z.discriminatedUnion('kind', [ConditionSelectionSchema, DetectorSelectionSchema, PairResearchSelectionSchema, CutoffResearchSelectionSchema]);
export const ResearchSelectionsSchema = z.array(ResearchSelectionSchema).max(4).refine((selections) => new Set(selections.map((s) => s.kind)).size === selections.length, 'Only one attached selection of each kind is supported.');
export type ResearchSelection = z.infer<typeof ResearchSelectionSchema>;
export type ConditionSelection = z.infer<typeof ConditionSelectionSchema>;
export type DetectorResearchSelection = z.infer<typeof DetectorSelectionSchema>;
export type PairResearchSelection = z.infer<typeof PairResearchSelectionSchema>;
export type CutoffResearchSelection = z.infer<typeof CutoffResearchSelectionSchema>;
interface ResearchAnalysisBase {
  id: string; title: string; methodRevision: string; sourceDigest: string; resultDigest: string;
  summary: string[]; limitations: string[]; sources: { title: string; url: string; sha256: string }[];
  role: 'descriptive_context_not_model_validation';
}
export type ResearchAnalysis = ResearchAnalysisBase & (
  { kind: 'conditions'; selection: ConditionSelection; result: ConditionComparison }
  | { kind: 'detector'; selection: DetectorResearchSelection; result: DetectorExport }
  | { kind: 'detector_pair'; selection: PairResearchSelection; result: PairedDetectorResult }
  | { kind: 'cutoff_envelope'; selection: CutoffResearchSelection; result: CutoffEnvelopeResult }
);

export function selectionLabel(s: ResearchSelection): string {
  if (s.kind === 'cutoff_envelope') return `${s.options.channelA} [${s.options.rangeA.min}, ${s.options.rangeA.max}] V versus ${s.options.channelB} [${s.options.rangeB.min}, ${s.options.rangeB.max}] V; ${s.options.material}, flight ${s.options.flight}${s.options.requireRecordedNoFanProblem ? ', literal recorded-n fan filter' : ''}; ${s.options.exclusions.length} explicit exclusions`;
  if (s.kind === 'detector_pair') return `${s.options.channelA} at ${s.options.cutoffA} V versus ${s.options.channelB} at ${s.options.cutoffB} V; ${s.options.material}, flight ${s.options.flight}${s.options.requireRecordedNoFanProblem ? ', literal recorded-n fan filter' : ''}; ${s.options.exclusions.length} explicit exclusions`;
  return s.kind === 'conditions'
    ? `${s.cohortId}: ${s.oxygenPercent}% oxygen / ${s.pressureKPa} kPa`
    : `${s.material === 'all' ? 'All materials' : s.material}, ${s.channel}, cutoff ${s.cutoff} V, ${s.flight === 'all' ? 'both flights' : `flight ${s.flight}`}`;
}

export function buildResearchAnalysis(raw: ResearchSelection): ResearchAnalysis {
  const selection = ResearchSelectionSchema.parse(raw);
  const common = {
    id: `RESEARCH-${digestOf(selection).slice(0, 16)}`, methodRevision: RESEARCH_METHOD_REVISION,
    role: 'descriptive_context_not_model_validation' as const,
  };
  if (selection.kind === 'cutoff_envelope') {
    const result = analyzeCutoffEnvelope(selection.options);
    const describe = (summary: CutoffEnvelopeResult['summary']) => {
      const b = summary.pairedDifferenceEnvelope;
      return b.denominator ? `[${b.lowerNumerator}, ${b.upperNumerator}] / ${b.denominator}; ${b.stability.replaceAll('_', ' ')}` : 'undefined; no jointly finite pairs';
    };
    return { ...common, kind: selection.kind, selection, result, title: 'Exact cutoff-range sensitivity',
      sourceDigest: digestOf(detectorDataset), resultDigest: digestOf(result),
      summary: [selectionLabel(selection), `Pooled jointly finite A-minus-B difference: ${describe(result.summary)}.`,
        ...result.byFlight.map((f) => `Flight ${f.flight}: ${describe(f.summary)}.`),
        `Exact endpoint witnesses: minimum at A=${result.selection.rangeA.max} V, B=${result.selection.rangeB.min} V; maximum at A=${result.selection.rangeA.min} V, B=${result.selection.rangeB.max} V.`],
      limitations: [result.policy.rangeMeaning, result.policy.completionBoundsMeaning, ...result.flags.map((f) => f.message), ...result.instrumentNotes, result.reviewStatement],
      sources: [{ title: `${result.source.workbook.fileName}, ${result.source.workbook.sheet}`, url: result.source.recordUrl, sha256: result.source.workbook.sha256 }],
    };
  }
  if (selection.kind === 'conditions') {
    const result = compareConditions({ cohortId: selection.cohortId, oxygenPercent: selection.oxygenPercent, pressureKPa: selection.pressureKPa });
    const frontier = result.frontier.strata.flatMap((s) => s.frontier.map((p) => p.id));
    return { ...common, kind: selection.kind, selection, result, title: 'Selected atmosphere comparison',
      sourceDigest: digestOf(conditionDataset), resultDigest: digestOf(result),
      summary: [selectionLabel(selection), `${frontier.length} of ${result.cases.length} cases on the condition-gap frontier: ${frontier.join(', ') || 'none'}.`,
        `Cohort: ${result.cohort.material}, ${result.cohort.sidesBurning} burning side(s). Flow is excluded: direction descriptions conflict for five overlapping cases, and complete flow histories are not established.`],
      limitations: ['Coordinate proximity is not physical equivalence or a fire prediction.', 'These selected cases do not become validation evidence for the published-model contracts.'],
      sources: [{ title: `${result.source.version}, ${result.source.table}, PDF page ${result.source.pdfPage}`, url: result.source.publicUrl, sha256: result.source.sha256 },
        ...result.earlierSourceContext.map((s) => ({ title: `${s.version}: source-conflict context`, url: s.publicUrl, sha256: s.sha256 }))],
    };
  }
  if (selection.kind === 'detector_pair') {
    const result = analyzePairedDetector(selection.options);
    const c = result.summary;
    return { ...common, kind: selection.kind, selection, result, title: 'Paired-channel cohort sensitivity',
      sourceDigest: digestOf(detectorDataset), resultDigest: digestOf(result),
      summary: [selectionLabel(selection), `${c.pairedFiniteRows} jointly finite pairs / ${c.selectedRows} retained source rows; ${result.excludedRows.length} excluded rows.`,
        `At/above-cutoff fraction difference (A minus B): ${c.pairedDifference.denominator ? `${c.pairedDifference.numerator}/${c.pairedDifference.denominator}` : 'undefined; no finite pairs'}.`,
        ...result.byFlight.map((s) => `Flight ${s.flight}: ${s.summary.pairedDifference.denominator ? `${s.summary.pairedDifference.numerator}/${s.summary.pairedDifference.denominator}` : 'no jointly finite pairs'}.`)],
      limitations: [...result.flags.map((f) => f.message), ...result.instrumentNotes, result.reviewStatement],
      sources: [{ title: `${result.source.workbook.fileName}, ${result.source.workbook.sheet}`, url: result.source.recordUrl, sha256: result.source.workbook.sha256 }],
    };
  }
  const result = exportDetectorAnalysis({ flight: selection.flight, material: selection.material, channel: selection.channel, cutoff: selection.cutoff, includeReference: selection.includeReference });
  const c = result.counts;
  return { ...common, kind: selection.kind, selection, result, title: 'Selected detector readings',
    sourceDigest: digestOf(detectorDataset), resultDigest: digestOf(result),
    summary: [selectionLabel(selection), `${c.below} / ${c.finite} finite readings below ${selection.cutoff} V; ${c.total} total source rows.`,
      `${c.missing} missing, ${c.error} source errors, ${c.nonNumeric} non-numeric. DBP reference rows ${selection.includeReference ? 'included and identified' : 'excluded'}.`],
    limitations: ['The selected cutoff is descriptive, not an alarm threshold or missed-alarm rate.', 'Stored readings do not establish independent trials or normal instrument operation.',
      'The CSV/workbook identity conflict remains unresolved; this analysis uses workbook rows only.'],
    sources: [{ title: `${result.source.workbook.fileName}, ${result.source.workbook.sheet}`, url: result.source.recordUrl, sha256: result.source.workbook.sha256 }],
  };
}

export function buildResearchAnalyses(raw: ResearchSelection[] = []): ResearchAnalysis[] {
  const selections = ResearchSelectionsSchema.parse(raw);
  const unique = new Map(selections.map((s) => [digestOf(s), s]));
  return [...unique.values()].map(buildResearchAnalysis);
}
