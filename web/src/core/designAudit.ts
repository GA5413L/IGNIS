/** Source-bound nominal-design identifiability. No responses, fits, predictions or experiment recommendations. */
import { z } from 'zod';
import studyData from '../../data/design-studies/ries2024.json';
import { compare, decimal, div, equal, mul, ONE, rankCertificate, rationalString, sub, type Fraction } from './exactDesign';

export const DESIGN_AUDIT_REVISION = 'design-audit-2026-11-15.1';
export const MAX_DESIGN_POINTS = 32;
const exactDecimal = z.string().regex(/^(?:0|[1-9]\d{0,4})(?:\.\d{1,6})?$/, 'Use an exact decimal string: up to five integer and six fractional digits, without exponent or leading zeros.');
const bounded = (max: string, allowZero = false) => exactDecimal.refine((value) => {
  try { const n = decimal(value); return (allowZero ? n.n >= 0n : n.n > 0n) && compare(n, decimal(max)) <= 0; }
  catch { return false; }
}, `Value must be ${allowZero ? 'at least zero' : 'positive'} and at most ${max}; these are software limits, not physical validity bounds.`);
export const DesignPointSchema = z.object({
  id: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,47}$/),
  oxygenVolPercent: bounded('100'), pressureKPa: bounded('2000'), flowMmS: bounded('10000', true),
}).strict();
export const DesignAuditRequestSchema = z.object({
  schemaVersion: z.literal('ignis-design-audit-request-1'), studyId: z.literal('RIES24'),
  gravity: z.literal('microgravity'),
  candidates: z.array(DesignPointSchema).max(MAX_DESIGN_POINTS),
}).strict().superRefine((value, context) => {
  const seen = new Set<string>();
  value.candidates.forEach((point, i) => {
    if (seen.has(point.id)) context.addIssue({ code: 'custom', path: ['candidates', i, 'id'], message: 'Candidate IDs must be unique; duplicate coordinates are permitted and reported.' });
    seen.add(point.id);
  });
});
export type DesignAuditRequest = z.infer<typeof DesignAuditRequestSchema>;
export type DesignPoint = z.infer<typeof DesignPointSchema>;
const study = structuredClone(studyData);
const axes = ['oxygenVolPercent', 'pressureKPa', 'flowMmS'] as const;
const center = axes.map((axis) => decimal(study.design.center[axis]));
const terms = ['a*c', 'b*c', 'a*c^2', 'b*c^2', 'a*b*c'] as const;

/** Fixed centering is the intersection of the reported flow line and fixed-flow plane. */
function coordinates(point: DesignPoint) {
  const [a, b, c] = axes.map((axis, i) => sub(div(decimal(point[axis]), center[i]), ONE));
  const ac = mul(a, c), bc = mul(b, c);
  return { centered: [a, b, c], basis: [ac, bc, mul(ac, c), mul(bc, c), mul(ac, b)] };
}

function inspectPoint(point: DesignPoint) {
  const { centered: [a, b, c], basis } = coordinates(point);
  const withinMarginalRanges = Object.fromEntries(axes.map((axis) => {
    const [low, high] = study.design.marginalBounds[axis].map(decimal);
    const value = decimal(point[axis]);
    return [axis, compare(value, low) >= 0 && compare(value, high) <= 0];
  })) as Record<(typeof axes)[number], boolean>;
  const insideMarginalBox = Object.values(withinMarginalRanges).every(Boolean);
  const onFixedFlowPlane = c.n === 0n;
  const onFlowSweepLine = a.n === 0n && b.n === 0n;
  const listedCell = onFixedFlowPlane ? study.design.tableXConditions.find((row) =>
    equal(decimal(row.oxygenVolPercent), decimal(point.oxygenVolPercent)) && equal(decimal(row.pressureKPa), decimal(point.pressureKPa))) : undefined;
  const onReportedSweepRange = onFlowSweepLine && withinMarginalRanges.flowMmS;
  const classification = !insideMarginalBox ? 'outside_reported_marginal_ranges'
    : listedCell ? 'listed_table_X_condition_with_source_conflict_unresolved'
    : onReportedSweepRange ? 'within_reported_flow_sweep_range_discrete_run_unknown'
    : onFixedFlowPlane ? 'within_outer_support_but_not_listed_as_table_X'
    : 'inside_marginal_box_outside_reported_outer_support';
  return {
    input: { ...point }, status: 'hypothetical_coordinate_only' as const,
    centered: { a: rationalString(a), b: rationalString(b), c: rationalString(c) },
    interactionRow: basis.map(rationalString), withinMarginalRanges, insideMarginalBox,
    onFixedFlowPlane, onFlowSweepLine,
    withinReportedOuterSupport: insideMarginalBox && (onFixedFlowPlane || onFlowSweepLine),
    classification, tableCellId: listedCell?.id ?? null,
    exactFlowSweepRunConfirmed: false,
    measurementAvailableInThisModule: false,
    sourceConflictIds: study.conflicts.map((conflict) => conflict.id),
  };
}

function auditClass(rows: Fraction[][], count: number, uniqueCoordinateCount: number) {
  const certificate = rankCertificate(rows.map((row) => row.slice(0, count)), count);
  // Unique-coordinate residual constraints are algebraic, not statistical degrees of freedom.
  const responseConstraintCount = uniqueCoordinateCount - certificate.rank;
  return {
    terms: terms.slice(0, count), classIsTruncation: true, ...certificate,
    reportedDesignRank: 0, rankGainOverReportedNominalDesign: certificate.rank,
    remainingUnidentifiedDirections: certificate.nullity,
    coefficientsIdentifiableConditionalOnFixedBaseline: certificate.nullity === 0,
    distinctCoordinateResponseConstraints: responseConstraintCount,
    extraRowsBeyondRank: rows.length - certificate.rank,
    noDistinctCoordinateFalsificationConstraint: responseConstraintCount === 0,
    statisticalResidualDegreesOfFreedom: null,
    conclusion: certificate.nullity === 0
      ? 'Full column rank only in this declared finite class, conditional on a fixed baseline and the source measurement operator.'
      : 'At least one coefficient direction remains invisible in this declared finite class.',
    validation: 'NOT RUN: no measured candidate responses, independent runs, uncertainty model or physical validation are provided.',
  };
}

/** A detached JSON certificate; source collections and frozen model-assessment contracts are not mutated. */
export function auditDesign(input: unknown) {
  const request = DesignAuditRequestSchema.parse(input);
  const rows = request.candidates.map((point) => coordinates(point).basis);
  const keys = request.candidates.map((point) => axes.map((axis) => rationalString(decimal(point[axis]))).join('|'));
  const uniqueCoordinateCount = new Set(keys).size;
  const duplicateCoordinateGroups = [...new Set(keys)].map((key) => request.candidates.filter((_, i) => keys[i] === key).map((point) => point.id)).filter((ids) => ids.length > 1);
  return {
    schemaVersion: 'ignis-design-audit-1' as const, methodRevision: DESIGN_AUDIT_REVISION,
    claimType: 'nominal_design_rank' as const, request: structuredClone(request), sourceStudy: structuredClone(study),
    certificate: {
      scope: 'Reported microgravity nominal design only; not the combined 1g/microgravity data behind the published fit.',
      normalizedCoordinates: { a: 'x/35.4 - 1', b: 'p/60 - 1', c: 'u/100 - 1' },
      coordinateUnits: { ...study.design.units },
      modelClass: 'For a specified fixed baseline f0, f_theta = f0 + sum(theta_j * basis_j). Theta has the response units. These are deviations from the baseline, not a claim that its mixed partials are zero.',
      symbolicZeroProof: [
        'At u=100, c=0, so all declared basis terms vanish for any oxygen and pressure.',
        'At x=35.4 and p=60, a=b=0, so all declared basis terms vanish for every flow velocity.',
        'Section 2.2 places the reported microgravity nominal design in this union. Therefore restriction of f_theta to that design is constant in theta for a fixed f0.',
      ],
      reportedDesignRank: 0, minimumUnidentifiedDirectionsInTwoTermClass: 2,
      expandedClassUnidentifiedDirections: 5,
      proofUsesOuterSupportOnly: true,
      sourcePressureConflictChangesThisProof: false,
      reportedFlowRunEnumerationRequired: false,
      fixedFlowPlaneIsFilledWithMeasurements: false,
      largerUnidentifiedFamiliesExist: true,
    },
    candidateCount: request.candidates.length, uniqueCoordinateCount, duplicateCoordinateGroups,
    candidates: request.candidates.map(inspectPoint),
    classes: {
      twoTerm: auditClass(rows, 2, uniqueCoordinateCount),
      expandedFiveTerm: auditClass(rows, 5, uniqueCoordinateCount),
    },
    conditions: ['Baseline held fixed; its parameters or discrepancies are not estimated here.', 'Same material, geometry and 603 K / 3-7 s IR measurement operator.', 'Exact reported nominal coordinates; realized coordinate uncertainty and numerical conditioning are not assessed.', 'Any prospective scalar response would have to exist; extinction or unsteady propagation can require a different/censored endpoint.'],
    boundaries: {
      physicalPredictionProvided: false, modelFitPerformed: false, experimentRecommended: false,
      actualRunCountKnown: false, independentValidation: false, uncertaintyQuantified: false,
      note: 'Algebraic rank does not establish physical feasibility, safety, precision, predictive validity, optimality or identification beyond the declared class. Repeats at old nominal coordinates cannot resolve these directions. Nonzero realized-coordinate jitter would require a separate conditioning and measurement-error analysis.',
    },
  };
}
export type DesignAuditResult = ReturnType<typeof auditDesign>;
export const TWO_POINT_DESIGN_EXAMPLE: DesignAuditRequest = {
  schemaVersion: 'ignis-design-audit-request-1', studyId: 'RIES24', gravity: 'microgravity',
  candidates: [
    { id: 'algebraic-A', oxygenVolPercent: '28.3', pressureKPa: '60', flowMmS: '50' },
    { id: 'algebraic-B', oxygenVolPercent: '35.4', pressureKPa: '75', flowMmS: '50' },
  ],
};
TWO_POINT_DESIGN_EXAMPLE.candidates.forEach(Object.freeze);
Object.freeze(TWO_POINT_DESIGN_EXAMPLE.candidates);
Object.freeze(TWO_POINT_DESIGN_EXAMPLE);
