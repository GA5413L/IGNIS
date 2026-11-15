import { describe, expect, it } from 'vitest';
import { digestOf } from '../../src/core/canonicalize';
import { DEFAULT_PAIR_SELECTION } from '../../src/core/pairedDetector';
import { DEFAULT_CUTOFF_ENVELOPE_SELECTION } from '../../src/core/cutoffEnvelope';
import { buildResearchAnalysis, type ResearchSelection } from '../../src/core/researchSelections';
import { decodeScenario, encodeScenario, makeScenario, MAX_SCENARIO_FRAGMENT_LENGTH, reviewScenario, SCENARIO_PREFIX } from '../../src/core/scenario';

const conditions: ResearchSelection = { kind: 'conditions', cohortId: 'PMMA-2', oxygenPercent: 29, pressureKPa: 68 };
const encodeRaw = (value: unknown) => SCENARIO_PREFIX + Buffer.from(JSON.stringify(value)).toString('base64url');
const resign = (value: ReturnType<typeof makeScenario>) => {
  const { checksum, ...rest } = value;
  expect(checksum).toHaveLength(64);
  return { ...rest, checksum: digestOf(rest) };
};
describe('source-bound scenario links', () => {
  it('recomputes the exact selected result without carrying a notebook or a question', () => {
    const fragment = encodeScenario(makeScenario(conditions));
    const reviewed = reviewScenario(fragment)!;
    expect(reviewed.current.selection).toEqual(conditions);
    expect(reviewed.current.resultDigest).toBe(buildResearchAnalysis(conditions).resultDigest);
    expect(reviewed.checks).toEqual({ source: 'same', method: 'same', result: 'same' });
    expect(Object.keys(reviewed.packet).sort()).toEqual(['checksum', 'methodRevision', 'resultDigest', 'schema', 'selection', 'sourceDigest']);
  });
  it('round trips Unicode exclusion notes and preserves the source cohort', () => {
    const pair = buildResearchAnalysis({ kind: 'detector_pair', options: { ...DEFAULT_PAIR_SELECTION } });
    if (pair.kind !== 'detector_pair') throw new Error('wrong fixture');
    const selection: ResearchSelection = { kind: 'detector_pair', options: { ...DEFAULT_PAIR_SELECTION,
      exclusions: [{ recordId: pair.result.rows[0].record.id, reason: 'Review µg — source note پاکستان' }] } };
    expect(reviewScenario(encodeScenario(makeScenario(selection)))?.current.selection).toEqual(selection);
  });
  it('reports changed source, method and result separately after recomputation', () => {
    const old = resign({ ...makeScenario(conditions), sourceDigest: '0'.repeat(64), methodRevision: 'historical-method', resultDigest: '1'.repeat(64) });
    expect(reviewScenario(encodeScenario(old))?.checks).toEqual({ source: 'changed', method: 'changed', result: 'changed' });
  });
  it('rejects corrupted, unsupported, oversized and source-invalid links', () => {
    const packet = makeScenario(conditions);
    expect(() => decodeScenario(encodeRaw({ ...packet, checksum: '0'.repeat(64) }))).toThrow('checksum');
    expect(() => decodeScenario(encodeRaw({ ...packet, schema: 'future' }))).toThrow('unsupported');
    expect(() => decodeScenario(encodeRaw({ ...packet, question: 'not allowed' }))).toThrow('invalid');
    expect(() => decodeScenario(SCENARIO_PREFIX + 'x'.repeat(MAX_SCENARIO_FRAGMENT_LENGTH))).toThrow('size');
    expect(() => decodeScenario(SCENARIO_PREFIX + '%broken')).toThrow('encoding');
    expect(() => decodeScenario(SCENARIO_PREFIX + 'not-json')).toThrow('decoded');
    const invalidSource = resign({ ...packet, selection: { ...conditions, cohortId: 'unreviewed-cohort' } });
    expect(() => reviewScenario(encodeScenario(invalidSource))).toThrow();
  });
  it('ignores ordinary section anchors and rejects nonfinite values', () => {
    expect(decodeScenario('#atlas')).toBeNull();
    expect(() => makeScenario({ ...conditions, pressureKPa: Infinity })).toThrow();
  });
  it('reopens the exact independent cutoff ranges and their bounded result', () => {
    const selection: ResearchSelection = { kind: 'cutoff_envelope', options: { ...DEFAULT_CUTOFF_ENVELOPE_SELECTION,
      rangeA: { min: 0, max: 5 }, rangeB: { min: 1, max: 3 }, flight: '1' } };
    const reviewed = reviewScenario(encodeScenario(makeScenario(selection)))!;
    expect(reviewed.current.selection).toEqual(selection);
    expect(reviewed.current.resultDigest).toBe(buildResearchAnalysis(selection).resultDigest);
  });
});
