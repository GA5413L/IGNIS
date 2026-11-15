import { describe, expect, it } from 'vitest';
import { auditDesign, DesignAuditRequestSchema, TWO_POINT_DESIGN_EXAMPLE, type DesignPoint } from '../../src/core/designAudit';
import { add, decimal, div, equal, fraction, mul, ONE, rankCertificate, sub, ZERO, type Fraction } from '../../src/core/exactDesign';
import study from '../../data/design-studies/ries2024.json';

const run = (candidates: DesignPoint[]) => auditDesign({ ...TWO_POINT_DESIGN_EXAMPLE, candidates });
const point = (id: string, x: string, p: string, u: string): DesignPoint => ({ id, oxygenVolPercent: x, pressureKPa: p, flowMmS: u });
const parse = (s: string) => { const [n, d = '1'] = s.split('/'); return fraction(BigInt(n), BigInt(d)); };
const dot = (a: Fraction[], b: Fraction[]) => a.reduce((total, value, i) => add(total, mul(value, b[i])), ZERO);

describe('source-bound nominal experimental design', () => {
  it('distinguishes in-range joint extrapolation, sparse plane membership and a table cell', () => {
    const result = run([
      point('joint', '28.3', '75', '50'), point('plane', '22', '80', '100'),
      point('cell', '28.30', '75.00', '100.0'), point('outside', '36', '75', '100'),
    ]);
    expect(result.candidates.map((p) => p.classification)).toEqual([
      'inside_marginal_box_outside_reported_outer_support', 'within_outer_support_but_not_listed_as_table_X',
      'listed_table_X_condition_with_source_conflict_unresolved', 'outside_reported_marginal_ranges',
    ]);
    expect(result.candidates[0]).toMatchObject({ insideMarginalBox: true, withinReportedOuterSupport: false });
    expect(result.candidates[1]).toMatchObject({ withinReportedOuterSupport: true, tableCellId: null });
    expect(result.candidates[2].tableCellId).toBe('X09');
    expect(result.candidates[3]).toMatchObject({ onFixedFlowPlane: true, withinReportedOuterSupport: false });
  });

  it('does not invent exact flow runs or infer that the full fixed-flow plane was measured', () => {
    const result = run(['30', '100', '123.456', '200'].map((u, i) => point(`sweep-${i}`, '35.4', '60', u)));
    expect(result.sourceStudy.design.tableOFlowSweep.exactRunVelocities).toBeNull();
    for (const p of result.candidates) {
      expect(p).toMatchObject({ classification: 'within_reported_flow_sweep_range_discrete_run_unknown', exactFlowSweepRunConfirmed: false, measurementAvailableInThisModule: false });
    }
    expect(result.certificate.fixedFlowPlaneIsFilledWithMeasurements).toBe(false);
  });

  it('has zero rank at all printed X cells and across the continuous flow-line formula', () => {
    const candidates = study.design.tableXConditions.map((p) => point(p.id, p.oxygenVolPercent, p.pressureKPa, '100'));
    candidates.push(...['30', '43.219876', '99.999999', '100', '200'].map((u, i) => point(`flow-${i}`, '35.4', '60', u)));
    const result = run(candidates);
    expect(result.classes.twoTerm).toMatchObject({ rank: 0, nullity: 2 });
    expect(result.classes.expandedFiveTerm).toMatchObject({ rank: 0, nullity: 5 });
    for (const p of result.candidates) expect(p.interactionRow).toEqual(['0', '0', '0', '0', '0']);
    expect(result.certificate.symbolicZeroProof).toHaveLength(3);
  });

  it('keeps the matrix conflict and is invariant to either pressure reading at fixed flow', () => {
    for (const p of ['70', '75']) {
      const result = run(['21', '23.6', '26.5', '28.3', '35.4'].map((x, i) => point(`pressure-${i}`, x, p, '100')));
      expect(result.classes.expandedFiveTerm.rank).toBe(0);
      expect(result.sourceStudy.conflicts[0].status).toBe('unresolved_publication_conflict');
      expect(result.certificate.sourcePressureConflictChangesThisProof).toBe(false);
    }
    expect(study.design.tableXConditions.find((p) => p.id === 'X12')?.pressureKPa).toBe('70.0');
    expect(run([point('caption-only', '35.4', '75', '100')]).candidates[0].tableCellId).toBeNull();
  });

  it('reproduces the exact two-point witness without claiming a larger class or physical validation', () => {
    const result = auditDesign(TWO_POINT_DESIGN_EXAMPLE);
    expect(result.classes.twoTerm.rows).toEqual([['71/708', '0'], ['0', '-1/8']]);
    expect(result.classes.twoTerm).toMatchObject({ rank: 2, nullity: 0, noDistinctCoordinateFalsificationConstraint: true, distinctCoordinateResponseConstraints: 0, statisticalResidualDegreesOfFreedom: null });
    expect(result.classes.expandedFiveTerm).toMatchObject({ rank: 2, nullity: 3, coefficientsIdentifiableConditionalOnFixedBaseline: false });
    expect(result.boundaries).toMatchObject({ physicalPredictionProvided: false, experimentRecommended: false, independentValidation: false });
    expect(result.classes.twoTerm.validation).toContain('NOT RUN');
  });

  it('shows that repeated and collinear coordinates cannot buy independent rank', () => {
    const repeated = run([point('a', '28.3', '60', '50'), point('b', '28.30', '60.0', '50.00')]);
    expect(repeated.duplicateCoordinateGroups).toEqual([['a', 'b']]);
    expect(repeated.classes.twoTerm).toMatchObject({ rank: 1, nullity: 1, distinctCoordinateResponseConstraints: 0, extraRowsBeyondRank: 1 });
    const collinear = run([point('a', '28.3', '60', '50'), point('b', '21', '60', '50')]);
    expect(collinear.classes.twoTerm).toMatchObject({ rank: 1, nullity: 1 });
    expect(collinear.classes.expandedFiveTerm.rank).toBe(1);
  });

  it('exposes higher-order aliasing and its conditional resolution with crossed algebraic coordinates', () => {
    const grid = [point('a1', '28.3', '60', '50'), point('a2', '28.3', '60', '75'), point('b1', '35.4', '75', '50'), point('b2', '35.4', '75', '75'), point('ab', '28.3', '75', '50')];
    const result = run(grid);
    expect(result.classes.expandedFiveTerm).toMatchObject({ rank: 5, nullity: 0, noDistinctCoordinateFalsificationConstraint: true });
    expect(result.classes.twoTerm).toMatchObject({ rank: 2, distinctCoordinateResponseConstraints: 3 });
    // A further distinct coordinate supplies a compatibility constraint, not validation data.
    const extra = run([...grid, point('extra', '26.5', '90', '150')]);
    expect(extra.classes.expandedFiveTerm).toMatchObject({ rank: 5, distinctCoordinateResponseConstraints: 1 });
    expect(extra.classes.expandedFiveTerm.validation).toContain('NOT RUN');
  });

  it('returns an exact nullspace that annihilates every candidate row, including fractional near-center values', () => {
    const result = run([point('a', '35.399999', '60.000001', '99.999999'), ...TWO_POINT_DESIGN_EXAMPLE.candidates]);
    expect(result.classes.twoTerm.rank).toBe(2);
    expect(result.candidates[0].withinReportedOuterSupport).toBe(false);
    for (const c of Object.values(result.classes)) {
      for (const v of c.nullspace.map((row) => row.map(parse))) for (const row of c.rows.map((r) => r.map(parse))) expect(equal(dot(row, v), ZERO)).toBe(true);
      expect(c.rank + c.nullspace.length).toBe(c.columns);
    }
    expect(run([]).classes.expandedFiveTerm).toMatchObject({ rank: 0, nullity: 5, rows: [] });
  });

  it('negative controls reject unrelated nonvanishing columns and do not use floating rank tolerances', () => {
    const a = sub(div(decimal('28.3'), decimal('35.4')), ONE);
    const b = sub(div(decimal('75'), decimal('60')), ONE);
    expect(rankCertificate([[mul(a, b)]], 1).rank).toBe(1); // a*b does not vanish on the fixed-flow plane.
    expect(rankCertificate([[mul(decimal('28.3'), decimal('100'))]], 1).rank).toBe(1); // uncentered x*u also fails.
    const tiny = fraction(1n, 10n ** 30n);
    expect(rankCertificate([[ONE, ONE], [ONE, add(ONE, tiny)]], 2).rank).toBe(2);
  });

  it('preserves provenance and isolates outputs against consumer mutation', () => {
    const result = auditDesign(TWO_POINT_DESIGN_EXAMPLE);
    expect(result.sourceStudy.source.pdfSha256).toBe('3c4fa8278cae1da73bc15a4b5443d927006a8150b3d8a83d4c79582f127008f2');
    expect(result.sourceStudy.scope.measurementOperator).toMatchObject({ thresholdK: '603', comparison: 'strictly_greater_than', parallelLines: 11, windowSeconds: ['3', '7'] });
    const original = JSON.stringify(result);
    result.sourceStudy.design.fixedFlowMmS = '200';
    result.certificate.coordinateUnits.pressureKPa = 'Pa';
    result.request.candidates[0].flowMmS = '200';
    expect(JSON.stringify(auditDesign(TWO_POINT_DESIGN_EXAMPLE))).toBe(original);
  });

  it.each([35.4, '', ' 35.4', '35.4 ', '035.4', '3.54e1', 'NaN', 'Infinity', '0x23', '35.4000001', '-1', '0', '100.000001'])('rejects ambiguous/out-of-limit oxygen input %s', (oxygenVolPercent) => {
    const request = { ...TWO_POINT_DESIGN_EXAMPLE, candidates: [{ ...TWO_POINT_DESIGN_EXAMPLE.candidates[0], oxygenVolPercent }] };
    expect(DesignAuditRequestSchema.safeParse(request).success).toBe(false);
  });
  it('does not guess that a small volume-percent value is a mole fraction', () => {
    expect(run([point('fraction-looking', '0.354', '60', '50')]).candidates[0]).toMatchObject({ insideMarginalBox: false, classification: 'outside_reported_marginal_ranges' });
  });
});
