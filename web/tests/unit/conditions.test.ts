import { describe, expect, it, vi } from 'vitest';
import rawDataset from '../../data/condition-cases.json';
import { compareConditions, conditionDataset } from '../../src/core/conditions';

const target = { oxygenPercent: 34, pressureKPa: 56.5 };
const compare = (cohortId = 'PMMA-2') => compareConditions({ cohortId, ...target });
const allPlaced = (result: ReturnType<typeof compare>) => result.frontier.strata.flatMap((stratum) => [...stratum.frontier, ...stratum.dominated.map((item) => item.point)]);

describe('curated condition comparison', () => {
  it('loads all seven canonical records without changing printed values, conversions or unknowns', () => {
    expect(conditionDataset).toEqual(rawDataset);
    expect(conditionDataset.cases).toHaveLength(7);
    expect(conditionDataset.cohorts).toHaveLength(4);
    expect(conditionDataset.source.version).toBe('ICES-2026-577');
    const pmma = conditionDataset.cases.find((item) => item.id === 'SAFFIRE-VI-3')!;
    expect(pmma.original.oxygenMoleFraction).toBe('0.30');
    expect(pmma.original.pressureMbar).toBe('544');
    expect(pmma.oxygenPercent).toBe(30);
    expect(pmma.pressureKPa).toBe(54.4);
    expect(pmma.oxygenPartialPressureKPa).toBe(16.32);
    const sibal = conditionDataset.cases.find((item) => item.id === 'SAFFIRE-IV-1')!;
    expect(sibal.geometry.thicknessMm).toBeNull();
    expect(sibal.original.thicknessMm).toBeNull();
    expect(sibal.thermalHistory.preheatMinutes).toBeNull();
    expect(sibal.thermalHistory.preheatDescription).toBeNull();
    expect(Object.isFrozen(conditionDataset)).toBe(true);
    expect(Object.isFrozen(pmma.original)).toBe(true);
  });

  it.each([
    ['PMMA-2', 'SAFFIRE-VI-3', 4, 2.1],
    ['PMMA-1', 'SAFFIRE-VI-4', 5, 1.5],
    ['SIBAL-2', 'SAFFIRE-VI-2', 3, 2.4],
    ['Cotton-2', 'SAFFIRE-V-2', 6, 17.6],
  ] as const)('compares the 34 percent / 56.5 kPa target only within %s', (cohortId, id, oxygenGap, pressureGap) => {
    const result = compare(cohortId);
    expect(result.target).toEqual(target);
    expect(result.cases.map((item) => item.id)).toEqual(result.cohort.caseIds);
    expect(result.cases.every((item) => item.material === result.cohort.material && item.sidesBurning === result.cohort.sidesBurning)).toBe(true);
    expect(result.frontier.targetAxes).toEqual(['o2', 'pressure']);
    expect(result.frontier.strata).toHaveLength(1);
    expect(result.frontier.strata[0].frontier.map((point) => point.id)).toEqual([id]);
    expect(result.frontier.strata[0].frontier[0].gaps).toEqual({ o2: oxygenGap, pressure: pressureGap });
    expect(result.frontier.unplaced).toEqual([]);
    expect(allPlaced(result).every((point) => Object.keys(point.gaps).join('+') === 'o2+pressure')).toBe(true);
  });

  it('keeps an oxygen/pressure tradeoff without introducing a scalar score', () => {
    const result = compareConditions({ cohortId: 'PMMA-2', oxygenPercent: 22, pressureKPa: 54.4 });
    expect(result.frontier.strata[0].frontier.map((point) => [point.id, point.gaps])).toEqual([
      ['SAFFIRE-IV-2', { o2: 0, pressure: 45.6 }], ['SAFFIRE-VI-3', { o2: 8, pressure: 0 }],
    ]);
    expect(result.frontier.strata[0].dominated).toEqual([]);
    expect(result.comparisonPolicy.scalarScoreProvided).toBe(false);
    expect(result.comparisonPolicy.physicalTransferEstablished).toBe(false);
  });

  it('retains both midpoint ties and their opposite signed directions', () => {
    const result = compareConditions({ cohortId: 'PMMA-2', oxygenPercent: 26, pressureKPa: 77.2 });
    const points = result.frontier.strata[0].frontier;
    expect(points.map((point) => point.id)).toEqual(['SAFFIRE-IV-2', 'SAFFIRE-VI-3']);
    expect(points.map((point) => point.gaps)).toEqual([{ o2: 4, pressure: 22.8 }, { o2: 4, pressure: 22.8 }]);
    expect(points.map((point) => point.signed)).toEqual([{ o2: -4, pressure: 22.8 }, { o2: 4, pressure: -22.8 }]);
  });

  it('does not treat equal oxygen partial pressure as equal atmosphere coordinates', () => {
    // 40% of 55 kPa equals the IV-2 arithmetic pO2 of 22 kPa. That is not a comparison axis.
    const result = compareConditions({ cohortId: 'PMMA-2', oxygenPercent: 40, pressureKPa: 55 });
    const iv2 = allPlaced(result).find((point) => point.id === 'SAFFIRE-IV-2')!;
    expect(iv2.gaps).toEqual({ o2: 18, pressure: 45 });
    expect(result.frontier.strata[0].frontier.map((point) => point.id)).toEqual(['SAFFIRE-VI-3']);
    expect(result.cases.every((item) => item.transferStatus === 'not_assessed')).toBe(true);
  });

  it('exports full canonical provenance and originals as deterministic detached JSON', () => {
    const input = Object.freeze({ cohortId: 'PMMA-2', ...target });
    const first = compareConditions(input), second = compareConditions(input);
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    expect(JSON.parse(JSON.stringify(first))).toEqual(first);
    expect(Object.keys(first)).toEqual(['schemaVersion', 'target', 'cohort', 'cases', 'frontier', 'source', 'earlierSourceContext', 'flowConflict', 'comparisonPolicy', 'reviewStatement']);
    expect(first.schemaVersion).toBe('ignis-condition-comparison-1');
    expect(first.source).toEqual(rawDataset.source);
    expect(first.source.sha256).toBe('59315478dbf26b833238df7166cf2a4649f4731f51fc01f8fc0eef602966d80d');
    expect(first.source.pdfPage).toBe(6);
    expect(first.source.table).toBe('Table 1');
    expect(first.earlierSourceContext).toEqual(rawDataset.earlierSourceContext);
    expect(first.earlierSourceContext[0]).toMatchObject({
      publicUrl: 'https://ntrs.nasa.gov/citations/20240002981',
      sha256: '7f875da1d6abeeeeac64aeba67d3f160074cf98430e714fe7606b34b37e0aa59',
      pdfPage: 3,
      caseIds: ['SAFFIRE-IV-1', 'SAFFIRE-V-2', 'SAFFIRE-VI-2', 'SAFFIRE-VI-3', 'SAFFIRE-VI-4'],
    });
    expect(first.flowConflict).toEqual(rawDataset.flowConflict);
    expect(first.flowConflict.status).toBe('unresolved_publication_conflict');
    expect(first.comparisonPolicy).toEqual(rawDataset.comparisonPolicy);
    expect(first.reviewStatement).toEqual(rawDataset.reviewStatement);
    for (const item of first.cases) expect(item).toEqual(rawDataset.cases.find((original) => original.id === item.id));
    first.source.title = 'consumer edit';
    first.cases[0].original.pressureMbar = 'consumer edit';
    first.cohort.caseIds.length = 0;
    first.comparisonPolicy.unreportedOrUnresolvedRequirements.length = 0;
    expect(compareConditions(input)).toEqual(second);
    expect(input).toEqual({ cohortId: 'PMMA-2', ...target });
  });

  it.each([0, -1, 100.001, NaN, Infinity, -Infinity, '34', null, undefined])('rejects invalid oxygen percentage %s', (oxygenPercent) => {
    expect(() => compareConditions({ cohortId: 'PMMA-2', oxygenPercent, pressureKPa: 56.5 } as Parameters<typeof compareConditions>[0])).toThrow(/Invalid condition comparison: oxygenPercent/);
  });

  it.each([0, -1, 2000.001, NaN, Infinity, -Infinity, '56.5', null, undefined])('rejects invalid pressure %s', (pressureKPa) => {
    expect(() => compareConditions({ cohortId: 'PMMA-2', oxygenPercent: 34, pressureKPa } as Parameters<typeof compareConditions>[0])).toThrow(/Invalid condition comparison: pressureKPa/);
  });

  it('accepts stated inclusive upper limits without treating them as safety limits', () => {
    const result = compareConditions({ cohortId: 'Cotton-2', oxygenPercent: 100, pressureKPa: 2000 });
    expect(result.target).toEqual({ oxygenPercent: 100, pressureKPa: 2000 });
    expect(result.comparisonPolicy.physicalTransferEstablished).toBe(false);
  });

  it.each([null, [], {}, { cohortId: 'PMMA-2', ...target, flow: 20 }, { cohortId: 'PMMA-2', ...target, oxygenPartialPressureKPa: 19.21 }])('rejects malformed inputs or undeclared axes: %j', (input) => {
    expect(() => compareConditions(input as Parameters<typeof compareConditions>[0])).toThrow(/Invalid condition comparison/);
  });

  it.each(['', '  ', 'all', 'PMMA', 'Cotton-1'])('rejects unknown or blank cohort %s', (cohortId) => {
    expect(() => compareConditions({ cohortId, ...target })).toThrow(/condition comparison|Unknown condition cohort/);
  });
});

describe('condition dataset module-load integrity checks', () => {
  const mutations: Array<[string, (data: typeof rawDataset) => void, RegExp]> = [
    ['nonfinite value', (data) => { data.cases[0].pressureKPa = NaN; }, /cases.0.pressureKPa/],
    ['duplicate case ID', (data) => { data.cases[1].id = data.cases[0].id; }, /case IDs must be unique/],
    ['duplicate cohort ID', (data) => { data.cohorts[1].id = data.cohorts[0].id; }, /cohort IDs must be unique/],
    ['wrong total count', (data) => { data.caseCount += 1; }, /caseCount must match/],
    ['material mismatch', (data) => { data.cases[0].material = 'SIBAL'; }, /cohort material\/sides membership/],
    ['sides mismatch', (data) => { data.cases[0].sidesBurning = 1; }, /cohort material\/sides membership/],
    ['unknown cohort', (data) => { data.cases[0].cohortId = 'unknown'; }, /cohort material\/sides membership/],
    ['duplicated membership', (data) => { data.cohorts[0].caseIds[1] = data.cohorts[0].caseIds[0]; }, /exactly one cohort/],
    ['pressure conversion', (data) => { data.cases[0].pressureKPa += 0.1; }, /pressure conversion is inconsistent/],
    ['oxygen conversion', (data) => { data.cases[0].conversions.oxygenPercent.value += 1; }, /oxygen percent conversion is inconsistent/],
    ['changed printed fraction', (data) => { data.cases[0].original.oxygenMoleFraction = '0.21'; }, /oxygen fraction must match/],
    ['partial pressure arithmetic', (data) => { data.cases[0].oxygenPartialPressureKPa += 0.1; }, /partial-pressure arithmetic/],
    ['conversion unit factor', (data) => { data.cases[0].conversions.pressureKPa.factor = 1; }, /conversions.pressureKPa.factor/],
    ['blank printed pressure', (data) => { data.cases[0].original.pressureMbar = ''; }, /original.pressureMbar/],
    ['mixed source version', (data) => { data.source.version = 'ICES-2024-365'; }, /source.version/],
    ['wrong case source', (data) => { data.cases[0].sourceId = data.earlierSourceContext[0].id; }, /source locator must identify/],
    ['wrong case page', (data) => { data.cases[0].pdfPage = 3; }, /source locator must identify/],
    ['invalid source page', (data) => { data.source.pdfPage = 0; }, /source.pdfPage/],
    ['invalid source link', (data) => { data.source.pdfUrl = 'not-a-url'; }, /source.pdfUrl/],
    ['source digest disagreement', (data) => { data.source.sha256 = '0'.repeat(64); }, /source hashes must agree/],
    ['false physical transfer flag', (data) => { data.comparisonPolicy.physicalTransferEstablished = true; }, /physicalTransferEstablished/],
    ['assumed missing thickness', (data) => { data.cases[4].geometry.thicknessMm = 5; }, /thicknessMm must match its original value or missingness/],
  ];

  it.each(mutations)('rejects %s before exporting a comparison corpus', async (_name, mutate, expected) => {
    const corrupted = structuredClone(rawDataset);
    mutate(corrupted);
    vi.resetModules();
    vi.doMock('../../data/condition-cases.json', () => ({ default: corrupted }));
    try {
      await expect(import('../../src/core/conditions')).rejects.toThrow(expected);
    } finally {
      vi.doUnmock('../../data/condition-cases.json');
      vi.resetModules();
    }
  });
});
