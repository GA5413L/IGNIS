/**
 * Writes the numbers behind the publication figures. Every value is computed by src/core from the curated
 * source files; nothing is fitted, smoothed or filled in. Run: npx tsx scripts/export-figure-data.ts
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import atlas from '../data/investigation-atlas.json';
import { conditionDataset } from '../src/core/conditions';
import { DETECTOR_CHANNEL_IDS, DETECTOR_CHANNELS, detectorDataset } from '../src/core/detector';
import { analyzePairedDetector } from '../src/core/pairedDetector';
import { analyzeCutoffEnvelope } from '../src/core/cutoffEnvelope';
import { assess } from '../src/core/assess';
import { requireCatalog } from '../src/core/registry';
import { proposalFromForm } from '../src/core/interpretation';
import { deriveHandling } from '../src/core/handling';

const catalog = requireCatalog();
const proposal = proposalFromForm({ intent: 'synthesize_findings', safetyAreas: [] });
const brief = assess({ id: 'REQ-FIGURES', revision: 'r1', originalText: 'Fire-safety brief across prevention, detection and suppression', confirmedAt: '2026-11-15T00:00:00.000Z', proposal,
  handling: deriveHandling(proposal).handling, inputMode: 'form', parentRequestRef: null, runtimeProvenanceRef: null, remainingScientificGaps: [] }, catalog, { now: '2026-11-15T00:00:00.000Z' });
const paired = analyzePairedDetector();
const envelope = (min: number, max: number) => {
  const result = analyzeCutoffEnvelope({ rangeA: { min, max }, rangeB: { min, max } });
  return [{ label: 'Pooled', summary: result.summary }, ...result.byFlight].map((item) => ({
    label: item.label, paired: item.summary.pairedDifferenceEnvelope, completion: item.summary.completionDifferenceEnvelope }));
};

const data = {
  generated: 'from src/core; catalogue ' + catalog.revision,
  moonRange: { minOxygenPercent: 30, maxPressureKPa: 10.2 * 6.894757, note: 'Challenge statement: 30% oxygen or greater at 10.2 psi or less; 1 psi = 6.894757 kPa' },
  conditions: conditionDataset.cases.map((item) => ({ sample: item.sample, material: item.material, sides: item.sidesBurning, oxygenPercent: item.oxygenPercent,
    pressureKPa: item.pressureKPa, oxygenPartialPressureKPa: item.oxygenPartialPressureKPa })),
  conditionSource: `${conditionDataset.source.version}, ${conditionDataset.source.table}`,
  channels: DETECTOR_CHANNEL_IDS.map((id) => ({ id, label: DETECTOR_CHANNELS[id].label, column: DETECTOR_CHANNELS[id].column })),
  detectorRows: detectorDataset.records.map((record) => ({ row: record.excelRow, flight: record.flightLabel, material: record.material, role: record.materialRole,
    values: Object.fromEntries(DETECTOR_CHANNEL_IDS.map((id) => [id, record.channels[id].status === 'finite' ? record.channels[id].value : null])) })),
  paired: [{ label: 'Pooled', summary: paired.summary }, ...paired.byFlight].map((item) => ({ label: item.label, difference: item.summary.pairedDifference, completion: item.summary.completionDifferenceBounds })),
  envelopes: { narrow: envelope(1, 3), wide: envelope(0, 5) },
  ranking: brief.ranking.map((entry, index) => ({ rank: index + 1, name: entry.displayName, findings: entry.findingIds.length,
    areas: catalog.investigations.find((item) => item.id === entry.investigationId)?.safetyAreas ?? [] })),
  atlas: atlas.records.map((record) => ({ accession: record.accession, name: record.acronym ?? record.accession,
    records: record.experimentalTables.reduce((sum, table) => sum + table.dataRecordCount, 0) })),
};
mkdirSync('artifacts/figures', { recursive: true });
writeFileSync('artifacts/figures/figure-data.json', JSON.stringify(data, null, 1) + '\n');
console.log(`figure data written: ${data.conditions.length} cases, ${data.detectorRows.length} detector rows, ${data.ranking.length} ranked investigations`);
