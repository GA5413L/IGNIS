/**
 * Allow-listed source arithmetic (master §4.4). Operations run only on known printed values; anything else
 * returns an unknown output with a reason. Results keep the exact internal value and a declared display rounding.
 */
import type { DerivationSpec, ExecutionKind, QuantityValue } from './schemas';
import type { CatalogSnapshot } from './registry';
import { byId } from './registry';
import { type Dec, parseDec, sub, mul, div, scaleBy100, toText, round } from './decimal';

export interface Derivation {
  id: string; operationKey: string; operationRevision: string; inputRefs: { id: string; revision: string }[]; expression: string;
  output: QuantityValue; exactText: string | null; displayText: string; executionKind: ExecutionKind; assumptions: string[]; label: string;
}

const OP_REV = 'ops-2';
const qv = (value: number | string | null, unit: string | null, state: QuantityValue['state'], reason: string | null, original: string | null): QuantityValue =>
  ({ state, value, unit, basis: null, originalText: original, originalUnit: unit, uncertaintyText: null, reason, evidence: [] });

function printed(s: CatalogSnapshot, id: string): { dec: Dec; unit: string | null; text: string; ref: { id: string; revision: string } } | string {
  const o = byId(s.observations, id);
  if (!o) return `${id} is not in the registry`;
  const v = o.value;
  if (!v || v.state !== 'known' || typeof v.value !== 'number' || !v.originalText) return `${id} has no known printed number`;
  if (!Number.isFinite(v.value) || !v.unit?.trim() || v.unit !== o.unit) return `${id} numeric value or declared unit is inconsistent`;
  if (v.originalUnit !== null && v.originalUnit !== v.unit) return `${id} original and declared units differ; no implicit conversion is allowed`;
  // Accept only one complete decimal, optionally followed by its declared unit. A first-number
  // search would incorrectly read the 2 in "CO2 mass: 29.9 g", or part of a range/exponent.
  const m = v.originalText.trim().match(/^([+-]?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?)(?:\s+(.+))?$/);
  if (!m || (m[2] !== undefined && m[2] !== v.unit)) return `${id} printed text is ambiguous or has a different unit; no number was inferred`;
  if (Number(m[1].replace(/,/g, '')) !== v.value) return `${id} printed number disagrees with its stored numeric value`;
  return { dec: parseDec(m[1]), unit: v.unit === '1' ? null : v.unit, text: `${m[1]}${v.unit !== '1' ? ` ${v.unit}` : ''}`, ref: { id: o.id, revision: o.revision } };
}

export function runDerivations(specs: DerivationSpec[], s: CatalogSnapshot): Derivation[] {
  const done = new Map<string, Derivation>();
  for (const d of specs) done.set(d.id, run(d, s, done));
  return [...done.values()];
}

function run(d: DerivationSpec, s: CatalogSnapshot, done: Map<string, Derivation>): Derivation {
  const fail = (reason: string, refs: { id: string; revision: string }[] = []): Derivation => ({
    id: d.id, operationKey: d.operationKey, operationRevision: OP_REV, inputRefs: refs, expression: d.label, label: d.label,
    output: qv(null, null, 'unknown', reason, null), exactText: null, displayText: 'not computed', executionKind: 'specification', assumptions: [reason],
  });
  const ok = (dec: Dec, unit: string | null, expression: string, refs: { id: string; revision: string }[], decimals: number, assumptions: string[]): Derivation => {
    const exact = toText(dec);
    const numeric = Number(exact);
    if (!Number.isFinite(numeric) || (dec.m !== 0n && numeric === 0)) return fail('computed value is outside the representable finite numeric range', refs);
    const shown = toText(round(dec, decimals));
    return { id: d.id, operationKey: d.operationKey, operationRevision: OP_REV, inputRefs: refs, expression, label: d.label,
      output: qv(numeric, unit, 'known', null, exact), exactText: exact, displayText: unit ? `${shown} ${unit}` : shown,
      executionKind: 'source_arithmetic', assumptions };
  };
  const ROUNDED = 'Inputs are rounded published values; results inherit that rounding (software arithmetic, not measurement uncertainty).';
  switch (d.operationKey) {
    case 't1_identity':
      return { id: d.id, operationKey: d.operationKey, operationRevision: OP_REV, inputRefs: [], label: d.label, exactText: null,
        expression: 'a = y(t0) − f(t0); r_aligned(t) = f(t) + a − y(t) = [f(t) − f(t0)] − [y(t) − y(t0)] = r_change(t); r_aligned(t0) = 0',
        output: qv('identity', null, 'known', null, null), displayText: 'aligned residual ≡ response-change residual; zero at t0 by construction',
        executionKind: 'specification', assumptions: ['Same f, y and t0', 'Constant additive offset a', 'Identical sampling and alignment', 'Does not improve fit, create an independent residual or remove uncertainty'] };
    case 'ratio': {
      const n = printed(s, d.inputs.numerator); const q = printed(s, d.inputs.denominator);
      if (typeof n === 'string' || typeof q === 'string') return fail([n, q].filter((x) => typeof x === 'string').join('; '));
      if (q.dec.m === 0n) return fail('denominator is zero; no ratio is formed', [n.ref, q.ref]);
      if (n.unit !== q.unit) return fail(`units differ (${n.unit} vs ${q.unit}); no ratio is formed`, [n.ref, q.ref]);
      return ok(div(n.dec, q.dec, 12), null, `${n.text} / ${q.text}`, [n.ref, q.ref], 4, [ROUNDED]);
    }
    case 'product': {
      const a = printed(s, d.inputs.a); const b = printed(s, d.inputs.b);
      if (typeof a === 'string' || typeof b === 'string') return fail([a, b].filter((x) => typeof x === 'string').join('; '));
      if (a.unit && b.unit) return fail('both factors carry units; product is not defined for this operation', [a.ref, b.ref]);
      return ok(mul(a.dec, b.dec), a.unit ?? b.unit, `${a.text} × ${b.text}`, [a.ref, b.ref], 6, [ROUNDED]);
    }
    case 'difference': {
      const a = printed(s, d.inputs.a); const b = printed(s, d.inputs.b);
      if (typeof a === 'string' || typeof b === 'string') return fail([a, b].filter((x) => typeof x === 'string').join('; '));
      if (a.unit !== b.unit) return fail('units differ; no difference is formed', [a.ref, b.ref]);
      const r = sub(b.dec, a.dec);
      const sign = r.m > 0n ? '+' : '';
      const dv = ok(r, a.unit, `${b.text} − ${a.text}`, [a.ref, b.ref], 6, [ROUNDED, 'Descriptive difference; no causal or uncertainty claim.']);
      return { ...dv, displayText: `${sign}${dv.displayText}` };
    }
    case 'relative_difference_pct': {
      const a = printed(s, d.inputs.a); const b = printed(s, d.inputs.b);
      if (typeof a === 'string' || typeof b === 'string') return fail([a, b].filter((x) => typeof x === 'string').join('; '));
      if (a.dec.m === 0n) return fail('reference value is zero', [a.ref, b.ref]);
      if (a.unit !== b.unit) return fail('units differ', [a.ref, b.ref]);
      const r = div(scaleBy100(sub(b.dec, a.dec)), a.dec, 12);
      const dv = ok(r, '%', `100 × (${b.text} − ${a.text}) / ${a.text}`, [a.ref, b.ref], 2, [ROUNDED, `Denominator: ${a.text} (declared reference).`]);
      return { ...dv, displayText: `${r.m > 0n ? '+' : ''}${dv.displayText}` };
    }
    case 'difference_of_derivation': {
      const prev = done.get(d.inputs.derivation);
      const b = printed(s, d.inputs.b);
      if (!prev || prev.exactText === null) return fail('the earlier derivation was not computed');
      if (typeof b === 'string') return fail(b);
      if ((prev.output.unit ?? null) !== b.unit) return fail('units differ', [b.ref]);
      const r = sub(parseDec(prev.exactText), b.dec);
      const dv = ok(r, b.unit, `${prev.exactText}${b.unit ? ` ${b.unit}` : ''} − ${b.text}`, [...prev.inputRefs, b.ref], 6,
        [ROUNDED, 'A difference between products of rounded numbers is a rounding effect, not a physical or model error.']);
      return { ...dv, displayText: `${r.m > 0n ? '+' : ''}${dv.displayText}` };
    }
  }
}
