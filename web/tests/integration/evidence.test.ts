import { afterEach, describe, expect, it, vi } from 'vitest';
import atlasDataset from '../../data/investigation-atlas.json';
import * as conditionsCore from '../../src/core/conditions';
import { conditionDataset, type ConditionComparison } from '../../src/core/conditions';
import { DEFAULT_DETECTOR_SELECTION, detectorDataset, exportDetectorAnalysis, type DetectorExport } from '../../src/core/detector';
import { handleEvidence, MAX_EVIDENCE_QUERY_BYTES } from '../../src/server/evidence';
import { GET } from '../../src/app/api/evidence/route';

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

function success<T>(query = ''): T {
  const reply = handleEvidence(new URLSearchParams(query));
  expect(reply.status).toBe(200);
  expect(JSON.parse(JSON.stringify(reply.body))).toEqual(reply.body);
  return reply.body as T;
}

function bad(query: string | URLSearchParams, code: string) {
  const reply = handleEvidence(typeof query === 'string' ? new URLSearchParams(query) : query);
  expect(reply.status).toBe(400);
  expect(reply.body).toMatchObject({ schemaVersion: 'ignis-evidence-error-1', code, message: expect.any(String) });
  expect(Object.keys(reply.body as object)).toEqual(['schemaVersion', 'code', 'message', 'parameter']);
  return reply;
}

const comparisonQuery = 'collection=condition-comparison&cohort=PMMA-2&oxygen=34&pressure=56.5';

describe('bounded evidence HTTP reads', () => {
  it('provides a readable index with executable collection URLs, counts, provenance and limits', () => {
    const index = success<{ collections: Record<string, { url: string }> }>();
    expect(index).toMatchObject({
      schemaVersion: 'ignis-evidence-index-1', title: 'IGNIS evidence API',
      datasets: {
        atlas: { schemaVersion: atlasDataset.schemaVersion, counts: atlasDataset.counts, reviewStatement: atlasDataset.reviewStatement },
        conditions: { caseCount: 7, cohortCount: 4, source: conditionDataset.source, reviewStatement: conditionDataset.reviewStatement },
        detectors: { counts: { flightMarkedRows: 154, referenceRows: 20, materialRows: 134 }, source: detectorDataset.source, review: { humanReviewed: false, independentValidation: false } },
      },
      requestPolicy: { method: 'GET', maxSerializedQueryBytes: MAX_EVIDENCE_QUERY_BYTES, outboundRequests: false, caching: 'no-store' },
      boundaries: { safeAtmosphereAssessmentProvided: false, physicalPredictionProvided: false, alarmClassificationProvided: false },
    });
    expect(JSON.stringify(index)).toContain('does not determine whether any atmosphere is safe');
    expect(JSON.stringify(index)).toMatch(/not a count of burns/i);
    expect(Object.keys(index.collections)).toEqual(['atlas', 'conditions', 'condition-comparison', 'detectors']);
    for (const collection of Object.values(index.collections)) {
      expect(handleEvidence(new URL(collection.url, 'https://ignis.test').searchParams).status).toBe(200);
    }
  });

  it('returns complete detached atlas and condition datasets without filling missing metadata', () => {
    const atlas = success<typeof atlasDataset>('collection=atlas');
    const conditions = success<typeof conditionDataset>('collection=conditions');
    expect(atlas).toEqual(atlasDataset);
    expect(conditions).toEqual(conditionDataset);
    expect(atlas.records.find((record) => record.id === 'PSI-10')?.license.identifier).toBeNull();
    expect(conditions.cases.find((item) => item.id === 'SAFFIRE-IV-1')?.geometry.thicknessMm).toBeNull();
    atlas.records[0].source.sha256 = 'consumer edit';
    conditions.cases[0].original.pressureMbar = 'consumer edit';
    expect(success('collection=atlas')).toEqual(atlasDataset);
    expect(success('collection=conditions')).toEqual(conditionDataset);
  });

  it('returns the authoritative condition result and full source records for the default example', () => {
    const result = success<ConditionComparison>(comparisonQuery);
    expect(result).toEqual(conditionsCore.compareConditions({ cohortId: 'PMMA-2', oxygenPercent: 34, pressureKPa: 56.5 }));
    expect(result.frontier.strata[0].frontier).toMatchObject([{ id: 'SAFFIRE-VI-3', gaps: { o2: 4, pressure: 2.1 } }]);
    expect(result.cases.map((item) => item.original.pressureMbar)).toEqual(['1000', '544']);
    expect(result.source).toEqual(conditionDataset.source);
    expect(result.earlierSourceContext).toEqual(conditionDataset.earlierSourceContext);
    expect(result.earlierSourceContext[0].publicUrl).toBe('https://ntrs.nasa.gov/citations/20240002981');
    expect(result.flowConflict.status).toBe('unresolved_publication_conflict');
    expect(result.comparisonPolicy.physicalTransferEstablished).toBe(false);
  });

  it('changes target gaps while retaining source metadata, cohort, original values and conflict', () => {
    const initial = success<ConditionComparison>(comparisonQuery);
    const changed = success<ConditionComparison>('collection=condition-comparison&cohort=PMMA-2&oxygen=22&pressure=54.4');
    const { target: firstTarget, frontier: firstFrontier, ...firstMetadata } = initial;
    const { target: secondTarget, frontier: secondFrontier, ...secondMetadata } = changed;
    expect(firstTarget).not.toEqual(secondTarget);
    expect(firstFrontier).not.toEqual(secondFrontier);
    expect(firstMetadata).toEqual(secondMetadata);
    expect(secondFrontier.strata[0].frontier.map((point) => point.id)).toEqual(['SAFFIRE-IV-2', 'SAFFIRE-VI-3']);
    expect(secondFrontier.targetAxes).toEqual(['o2', 'pressure']);
    expect(success(comparisonQuery)).toEqual(initial);
  });

  it('uses detector defaults exactly and retains the audited Kapton finite denominator and missing cell', () => {
    const defaults = success<DetectorExport>('collection=detectors');
    expect(defaults).toEqual(exportDetectorAnalysis());
    expect(defaults.selection).toEqual(DEFAULT_DETECTOR_SELECTION);
    expect(defaults.counts.total).toBe(134);
    const kapton = success<DetectorExport>('collection=detectors&material=Kapton&channel=issScatterV&cutoff=2');
    expect(kapton).toEqual(exportDetectorAnalysis({ material: 'Kapton', channel: 'issScatterV', cutoff: 2 }));
    expect(kapton.counts).toEqual({ total: 36, finite: 35, missing: 1, error: 0, nonNumeric: 0, below: 20, atOrAbove: 15, belowPercent: 100 * 20 / 35, atOrAbovePercent: 100 * 15 / 35 });
    expect(kapton.rows.find((row) => row.measurement.cell === 'AW50')).toMatchObject({
      classification: 'missing', measurement: { value: null, originalValue: null, status: 'missing' }, record: { sameTestNumber: '51a' },
    });
    expect(kapton.source.workbook.sha256).toBe('6d3a539ccf425b1fa8edc19cc75d828f57d650c7ce734d4e7aa686fea9593218');
    expect(kapton.policy.alarmClassification).toBe(false);
    expect(kapton.policy.independentTrials).toBe(false);
  });

  it('maps all detector selectors and requires explicit inclusion of reference rows', () => {
    const query = 'collection=detectors&flight=2&material=Kapton&channel=ionDeltaV&cutoff=1.5&includeReference=false';
    expect(success(query)).toEqual(exportDetectorAnalysis({ flight: '2', material: 'Kapton', channel: 'ionDeltaV', cutoff: 1.5, includeReference: false }));
    const withoutReference = success<DetectorExport>('collection=detectors&material=DBP&includeReference=false');
    const withReference = success<DetectorExport>('collection=detectors&material=DBP&includeReference=true');
    expect(withoutReference.counts).toMatchObject({ total: 0, finite: 0, belowPercent: null });
    expect(withReference.counts.total).toBe(20);
    expect(withReference.rows.every((row) => row.record.materialRole === 'reference')).toBe(true);
  });

  it('supports finite cutoff extremes while changing only derived selection and classification', () => {
    const initial = success<DetectorExport>('collection=detectors&material=Kapton&cutoff=2');
    const high = success<DetectorExport>('collection=detectors&material=Kapton&cutoff=1e308');
    expect(high.counts).toMatchObject({ total: 36, finite: 35, missing: 1, below: 35, atOrAbove: 0 });
    expect(high.source).toEqual(initial.source);
    expect(high.policy).toEqual(initial.policy);
    expect(high.identityConflicts).toEqual(initial.identityConflicts);
    expect(high.rows.map((row) => [row.record, row.measurement])).toEqual(initial.rows.map((row) => [row.record, row.measurement]));
    const zero = success<DetectorExport>('collection=detectors&cutoff=0');
    expect(zero.selection.cutoff).toBe(0);
    expect(success('collection=condition-comparison&cohort=Cotton-2&oxygen=100&pressure=2000')).toEqual(conditionsCore.compareConditions({ cohortId: 'Cotton-2', oxygenPercent: 100, pressureKPa: 2000 }));
  });

  it.each([
    ['collection=unknown', 'unknown_collection'], ['collection=', 'invalid_parameter'],
    ['oxygen=34', 'missing_parameter'], ['extra=1', 'unknown_parameter'],
    ['collection=atlas&oxygen=34', 'unknown_parameter'], ['collection=conditions&cutoff=2', 'unknown_parameter'],
    ['collection=condition-comparison&flight=2', 'unknown_parameter'], ['collection=detectors&cohort=PMMA-2', 'unknown_parameter'],
    ['collection=atlas&collection=conditions', 'duplicate_parameter'],
    ['collection=detectors&cutoff=2&cutoff=3', 'duplicate_parameter'],
    ['collection=detectors&includeReference=false&includeReference=true', 'duplicate_parameter'],
    ['collection=condition-comparison&cohort=PMMA-2&oxygen=34&oxygen=34&pressure=56.5', 'duplicate_parameter'],
    ['collection=Atlas', 'unknown_collection'], ['Collection=atlas', 'unknown_parameter'],
    ['collection=condition-comparison', 'missing_parameter'],
    ['collection=condition-comparison&cohort=PMMA-2&oxygen=34', 'missing_parameter'],
    ['collection=condition-comparison&cohort=all&oxygen=34&pressure=56.5', 'invalid_parameter'],
    ['collection=detectors&flight=SAME', 'invalid_parameter'], ['collection=detectors&material=kapton', 'invalid_parameter'],
    ['collection=detectors&channel=alarm', 'invalid_parameter'], ['collection=detectors&includeReference=1', 'invalid_parameter'],
    ['collection=detectors&includeReference=True', 'invalid_parameter'], ['collection=detectors&includeReference=', 'invalid_parameter'],
    ['collection=detectors&cutoff=', 'invalid_parameter'], ['collection=detectors&cutoff=-1', 'invalid_parameter'],
  ])('rejects invalid, unknown and ambiguous query %s', (query, code) => { bad(query, code); });

  it.each(['', ' ', ' 34', '34 ', 'NaN', 'Infinity', '-Infinity', '1e309', '1e-999', '0x22', '34,0', 'true', '34kPa'])('rejects malformed numeric text %j without substituting a default', (value) => {
    bad(new URLSearchParams({ collection: 'detectors', cutoff: value }), 'invalid_parameter');
    bad(new URLSearchParams({ collection: 'condition-comparison', cohort: 'PMMA-2', oxygen: value, pressure: '56.5' }), 'invalid_parameter');
  });

  it.each([
    ['0', '56.5'], ['-1', '56.5'], ['100.001', '56.5'], ['1e308', '56.5'],
    ['34', '0'], ['34', '-1'], ['34', '2000.001'], ['34', '1e308'],
  ])('rejects out-of-range target oxygen=%s pressure=%s through the authoritative service', (oxygen, pressure) => {
    bad(new URLSearchParams({ collection: 'condition-comparison', cohort: 'PMMA-2', oxygen, pressure }), 'invalid_parameter');
  });

  it('accepts explicit finite decimal exponents and is independent of parameter order', () => {
    const alternative = 'pressure=5.65e1&oxygen=3.4e1&cohort=PMMA-2&collection=condition-comparison';
    expect(success(alternative)).toEqual(success(comparisonQuery));
  });

  it('bounds serialized query size before processing keys or values', () => {
    const large = new URLSearchParams({ collection: 'atlas', ignored: 'x'.repeat(MAX_EVIDENCE_QUERY_BYTES) });
    bad(large, 'query_too_large');
    const encoded = new URLSearchParams({ collection: 'atlas', ignored: 'é'.repeat(400) });
    expect(encoded.toString().length).toBeGreaterThan(MAX_EVIDENCE_QUERY_BYTES);
    bad(encoded, 'query_too_large');
    const malformed = handleEvidence(null as unknown as URLSearchParams);
    expect(malformed).toMatchObject({ status: 400, body: { code: 'invalid_query' } });
  });

  it('masks unexpected internal failures without returning a stack or substitute result', () => {
    vi.spyOn(conditionsCore, 'compareConditions').mockImplementationOnce(() => { throw new Error('Private internal path E:\\secret\\file.ts:10'); });
    const reply = handleEvidence(new URLSearchParams(comparisonQuery));
    expect(reply).toEqual({ status: 500, body: { schemaVersion: 'ignis-evidence-error-1', code: 'evidence_unavailable', message: 'Evidence could not be read. No substitute data or result was returned.', parameter: null } });
    expect(JSON.stringify(reply)).not.toContain('secret');
  });

  it('serializes actual GET replies with no-store for index, comparisons and errors', async () => {
    for (const query of ['', comparisonQuery, 'collection=detectors&material=Kapton', 'collection=unknown']) {
      const response = GET(new Request(`https://ignis.test/api/evidence?${query}`));
      const expected = handleEvidence(new URLSearchParams(query));
      expect(response.status).toBe(expected.status);
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(response.headers.get('content-type')).toContain('application/json');
      expect(await response.json()).toEqual(expected.body);
    }
  });

  it('makes zero outbound requests across collections, analysis and errors', () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    for (const query of ['', 'collection=atlas', 'collection=conditions', comparisonQuery, 'collection=detectors', 'collection=unknown']) {
      handleEvidence(new URLSearchParams(query));
    }
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
