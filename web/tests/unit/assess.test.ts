import { describe, expect, it } from 'vitest';
import { assess } from '../../src/core/assess';
import { BRIEF, W1, W2, W3, NOW, claim, request, run, syntheticRegistry } from '../helpers';

const dv = (a: ReturnType<typeof run>, suffix: string) => a.derivations.find((d) => d.id.endsWith(suffix));

describe('W1 — Saffire VI later remote CO2 response (amendment A-001, AC02, AC07)', () => {
  const a = run(W1);
  it('is a conditional model candidate with a specified conditional comparison', () => {
    const c = claim(a, 'AC-SVI25-T1-LATER')!;
    expect(c.route).toBe('conditional_model_candidate');
    expect(c.outcome).toBe('specified_conditional_comparison');
    expect(c.authoritativeText).toMatch(/not the initial agreement/);
  });
  it('keeps numerical scoring unresolved: no residual, no curve', () => {
    const c = claim(a, 'AC-SVI25-T1-SCORE')!;
    expect(c.route).toBe('no_supported_route');
    expect(c.outcome).toBe('unresolved_requirement');
    expect(a.derivations.filter((d) => d.id.startsWith('AC-SVI25-T1-')).map((d) => d.operationKey)).toEqual(['t1_identity']);
    expect(c.derivationIds).toEqual([]);
    expect(a.readiness.assets.every((x) => x.state === 'not_acquired')).toBe(true);
  });
  it('states the T1 identity as a specification', () => {
    const d = dv(a, 'DV-T1-IDENTITY')!;
    expect(d.executionKind).toBe('specification');
    expect(d.expression).toContain('[f(t) − f(t0)] − [y(t) − y(t0)]');
  });
  it('the event-6 descriptive totals check runs because event 6 is selected', () => {
    const c = claim(a, 'AC-SVI25-EV6-TOTAL')!;
    expect(c.outcome).toBe('descriptive_consistency_check');
    expect(dv(a, 'DV-EV6-REL')!.exactText).toBe('-0.234192037471');
  });
});

describe('AC02 — initial agreement is not an independent prediction', () => {
  it('returns an incompatible requested claim', () => {
    const a = run({ ...W1, requestedClaim: 'independent_prediction', temporalScope: 'initial' });
    const c = claim(a, 'AC-SVI25-T1-INITIAL')!;
    expect(c.outcome).toBe('incompatible_requested_claim');
    expect(c.authoritativeText).toMatch(/imposed/);
    expect(claim(a, 'AC-SVI25-T1-LATER')).toBeUndefined();
  });
});

describe('W2 / AC05 — Saffire V normalization', () => {
  const a = run(W2);
  it('returns D, I and S outcomes for one question', () => {
    expect(claim(a, 'AC-SV24-T2-CHECK')!.outcome).toBe('descriptive_consistency_check');
    expect(claim(a, 'AC-SV24-T2-INDEP')!.outcome).toBe('incompatible_requested_claim');
    const later = claim(a, 'AC-SV24-T2-LATER')!;
    expect(later.outcome).toBe('specified_conditional_comparison');
    expect(later.missingRequirements.join(' ')).toMatch(/integration window/);
  });
  it('computes the published arithmetic exactly and calls the residual a rounding effect', () => {
    expect(dv(a, 'DV-T2-RATIO')!.exactText).toBe('1.819397993311');
    expect(dv(a, 'DV-T2-PRODUCT')!.exactText).toBe('54.418');
    expect(dv(a, 'DV-T2-RESID')!.exactText).toBe('0.018');
    expect(claim(a, 'AC-SV24-T2-CHECK')!.authoritativeText).toMatch(/rounding effect/);
  });
});

describe('W3 / AC08 / AC13 — chemical heat release from a transport model', () => {
  const a = run(W3);
  it('is incompatible for the requested claim and keeps both values without a ratio', () => {
    const c = claim(a, 'AC-SVI25-T4-BURNING')!;
    expect(c.outcome).toBe('incompatible_requested_claim');
    expect(c.authoritativeText).toContain('497 kJ');
    expect(c.authoritativeText).toContain('1280 kJ');
    expect(c.authoritativeText).toMatch(/not an accuracy or efficiency/);
    expect(a.derivations.some((d) => d.operationKey === 'ratio')).toBe(false);
  });
  it('W1 → W3 revision changes only the question, preserves the model and explains the change', () => {
    const w1 = run(W1, { id: 'REQ-W1' });
    const w3 = run(W3, { parent: w1, id: 'REQ-W3' });
    const r = w3.revisionDifference!;
    expect(w3.parentAssessmentId).toBe(w1.id);
    expect(r.operation).toBe('question_change');
    expect(r.changedFields).toEqual(expect.arrayContaining(['quantityIds', 'requestedClaim', 'temporalScope']));
    expect(r.changedFields).not.toContain('physicalModelId');
    expect(r.witnesses.some((w) => w.affectedRef.id === 'AC-SVI25-T4-BURNING' && /incompatible/.test(w.newConclusion))).toBe(true);
    expect(r.witnesses.some((w) => w.affectedRef.id === 'AC-SVI25-T1-LATER' && /history/.test(w.newConclusion))).toBe(true);
  });
});

describe('AC23 — second NASA input: SIBAL event 5', () => {
  it('gives a descriptive check with the transient limitation', () => {
    const a = run({ intent: 'assess_physical_model', physicalModelId: 'PM-SVI25', eventIds: ['EV-SVI-5'], quantityIds: ['Q-CO2-SOURCE-TOTAL'], requestedClaim: 'description' });
    const c = claim(a, 'AC-SVI25-SIBAL-TOTAL')!;
    expect(c.outcome).toBe('descriptive_consistency_check');
    expect(dv(a, 'DV-SIBAL-DIFF')!.exactText).toBe('-0.3');
    expect(dv(a, 'DV-SIBAL-REL')!.displayText).toBe('-0.64 %');
    expect(c.authoritativeText).toMatch(/underpredicts the rise/);
  });
});

describe('broad brief and navigation (16.1, M01, M04, AC24, AC25, M05)', () => {
  it('M01: three-area brief without a physical model', () => {
    const a = run(BRIEF, { text: 'What NASA findings should I consider for material burning, smoke detection and extinction in an oxygen-enriched, lower-pressure crew environment?' });
    expect(a.handling.handling).toBe('ready');
    expect(a.claims.some((c) => c.kind === 'contract')).toBe(false);
    for (const area of ['prevention', 'detection', 'suppression'] as const) {
      expect(a.claims.some((c) => c.safetyAreas.includes(area) && c.presentation === 'lead' && c.route === 'direct')).toBe(true);
    }
  });
  it('AC24/M04: detection-only question selects SAME evidence, no model or pressure needed', () => {
    const a = run({ intent: 'synthesize_findings', safetyAreas: ['detection'] }, { text: 'Which investigation addresses smoke particle sizes relevant to detector response?' });
    expect(a.handling.missingRoutingFields).toEqual([]);
    expect(a.claims.every((c) => c.safetyAreas.includes('detection') || c.id.startsWith('CL-FD-') )).toBe(true);
    expect(a.ranking[0].investigationId).toBe('INV-SAME');
    expect(claim(a, 'FD-D-SAME-01')!.presentation).toBe('lead');
  });
  it('AC25: FLEX distinguishes visible flame loss from complete extinction', () => {
    const a = run({ intent: 'synthesize_findings', safetyAreas: ['suppression'], endpointIds: ['EP-COMPLETE-EXTINCTION'] }, { text: 'Can visible droplet-flame disappearance alone define complete extinction?' });
    const c = claim(a, 'FD-S-FLEX-01')!;
    expect(c.presentation).toBe('lead');
    expect(a.ranking[0].investigationId).toBe('INV-FLEX');
    expect(c.qualifications.join(' ')).toMatch(/not solid materials or cabin fires/);
  });
  it('M05: a qualification travels with the finding it qualifies', () => {
    const a = run({ intent: 'synthesize_findings', safetyAreas: ['prevention'] }, { text: 'reduced pressure flame spread' });
    expect(claim(a, 'FD-P-PRESSURE-01')).toBeDefined();
    expect(claim(a, 'FD-C-MOON-01')!.route).toBe('context');
  });
  it('M06: a question with no lexical match still returns the reviewed area findings (no global-absence claim)', () => {
    const a = run({ intent: 'synthesize_findings', safetyAreas: ['suppression'] }, { text: 'zzzz unrelated words' });
    expect(a.claims.length).toBeGreaterThan(0);
    expect(a.ranking.find((r) => r.investigationId === 'INV-FLEX')!.humanReasons.join(' ')).toMatch(/reviewed finding/);
  });
});

describe('handling (M14, M15, AC22)', () => {
  it('M14: an execution request stays an unsupported action with its text preserved', () => {
    const a = run({ intent: 'request_execution', requestedExecutionText: 'Run a new Mars simulation using my PDF.' });
    expect(a.handling.handling).toBe('unsupported_action');
    expect(a.request.proposal.requestedExecutionText).toBe('Run a new Mars simulation using my PDF.');
    expect(a.claims).toEqual([]);
  });
  it('M15: existing model with a missing quantity asks for the quantity and keeps the model', () => {
    const a = run({ intent: 'assess_physical_model', physicalModelId: 'PM-SVI25' });
    expect(a.handling.handling).toBe('clarification_needed');
    expect(a.handling.missingRoutingFields).toEqual(['quantityIds']);
    expect(a.request.proposal.physicalModelId).toBe('PM-SVI25');
    expect(a.claims.some((c) => c.kind === 'contract')).toBe(false);
  });
  it('AC20: invented IDs are rejected, not coerced', () => {
    expect(() => run({ intent: 'assess_physical_model', physicalModelId: 'PM-MARS-NEW', quantityIds: ['Q-CO2-REMOTE-CONC'] })).toThrow(/unknown physical model/);
  });
  it('form input records no AI use (AC22: useful result without live SI)', () => {
    expect(run(W1).aiUse).toMatch(/No AI was used/);
  });
});

describe('determinism and synthetic mutations (AC18, AC12, AC06, M30)', () => {
  it('same request → same payload checksum', () => {
    expect(run(W2).payloadSha256).toBe(run(W2).payloadSha256);
  });
  it('M30: renaming a model or mission label changes no scientific outcome', () => {
    const s = syntheticRegistry((raw) => { raw.models.records.find((m: any) => m.id === 'PM-SV24').displayName = 'Renamed model (synthetic)'; });
    const a = assess(request(W2), s, { now: NOW });
    const b = run(W2);
    const key = (x: typeof a) => x.claims.filter((c) => c.kind === 'contract').map((c) => `${c.contractRef!.id}:${c.route}:${c.outcome}`);
    expect(key(a)).toEqual(key(b));
  });
  it('AC18/AC12: making the normalization use unresolved changes only the affected claims', () => {
    const s = syntheticRegistry((raw) => { raw.uses.records.find((u: any) => u.id === 'USE-SV24-NORM').historicalUse = 'unresolved'; });
    const a = assess(request(W2), s, { now: NOW });
    expect(claim(a, 'AC-SV24-T2-INDEP')!.outcome).toBe('unresolved_requirement');
    expect(claim(a, 'AC-SV24-T2-CHECK')!.outcome).toBe('descriptive_consistency_check');
    expect(a.catalogRevision).toBe('synthetic-test');
  });
  it('AC06: a zero source total forms no ratio and returns a non-success outcome', () => {
    const s = syntheticRegistry((raw) => {
      const o = raw.observations.records.find((x: any) => x.id === 'OBS-SV6-PROXY-TOTAL');
      o.value.value = 0; o.value.originalText = '0 g';
    });
    const a = assess(request(W2), s, { now: NOW });
    const c = claim(a, 'AC-SV24-T2-CHECK')!;
    expect(c.outcome).toBe('incompatible_requested_claim');
    expect(a.derivations.some((d) => d.id.includes('DV-T2-RATIO'))).toBe(false);
  });
});

describe('regressions found in screenshot review (14 Nov)', () => {
  it('“CO₂” in a question does not match the carbon-monoxide alias “co”', () => {
    const a = run(W1, { text: 'Which measurements can test the later remote CO₂ response of the published Saffire VI two-sided-PMMA transport model?' });
    const reasons = a.ranking.flatMap((r) => r.humanReasons).join(' ');
    expect(reasons).not.toMatch(/match: co[,.]/);
    expect(reasons).toMatch(/co2/);
  });
  it('only the selected model’s investigation is in group 1, and unrelated entries are not listed', () => {
    const a = run(W1, { text: 'Which measurements can test the later remote CO₂ response of the published Saffire VI transport model?' });
    expect(a.ranking.filter((r) => r.rankGroup === 1).map((r) => r.investigationId)).toEqual(['INV-SAFFIRE-VI']);
    expect(a.ranking.some((r) => r.investigationId === 'INV-BASS')).toBe(false);
  });
  it('the revision premise is written with readable names, not raw ids', () => {
    const w3 = run(W3, { parent: run(W1, { id: 'REQ-A' }), id: 'REQ-B' });
    expect(w3.revisionDifference!.witnesses[0].premise).toMatch(/physical quantity: Remote CO2 concentration response → Chemical heat release/);
  });
});
