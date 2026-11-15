/**
 * Three-valued predicate evaluation (master §8.4): satisfied / contradicted / unknown.
 * unknown never passes a contract and is never treated as false evidence of absence.
 */
import type { Predicate } from './schemas';
import type { CatalogSnapshot } from './registry';
import { byId } from './registry';

export type Truth = 'satisfied' | 'contradicted' | 'unknown';
export interface PredicateResult {
  predicateId: string; truth: Truth; reason: string; consumedRefs: { id: string; revision: string }[];
  missingFieldIds: string[]; critical: boolean; description: string;
}

const ref = (x: { id: string; revision: string }) => ({ id: x.id, revision: x.revision });

export function evaluatePredicate(p: Predicate, s: CatalogSnapshot): PredicateResult {
  const base = { predicateId: p.id, critical: p.criticalForThisUse, description: p.description, missingFieldIds: [] as string[] };
  switch (p.operation) {
    case 'documented_use':
    case 'no_documented_use': {
      const u = byId(s.uses, p.argument.useId);
      if (!u) return { ...base, truth: 'unknown', reason: `Use record ${p.argument.useId} is not in the registry.`, consumedRefs: [], missingFieldIds: [p.argument.useId] };
      const documented = u.historicalUse === 'documented_use';
      const nonUse = u.historicalUse === 'scoped_reviewed_non_use';
      let truth: Truth = 'unknown';
      if (p.operation === 'documented_use') truth = documented ? 'satisfied' : nonUse ? 'contradicted' : 'unknown';
      else truth = documented ? 'contradicted' : nonUse ? 'satisfied' : 'unknown';
      const what = `${u.role.replace(/_/g, ' ')} use of ${u.observationRef.id} (${u.historicalUse.replace(/_/g, ' ')})`;
      return { ...base, truth, reason: truth === 'unknown' ? `Information use is unresolved: ${what}. Missing evidence is not proof of independence.` : `Documented: ${what}.`, consumedRefs: [ref(u)] };
    }
    case 'transform_supported': {
      const u = byId(s.uses, p.argument.useId);
      if (!u || u.transform === null) return { ...base, truth: 'unknown', reason: 'The transformation applied to the model output is not documented.', consumedRefs: u ? [ref(u)] : [], missingFieldIds: [p.argument.useId] };
      const ok = u.transform === p.argument.transform;
      return { ...base, truth: ok ? 'satisfied' : 'contradicted', reason: ok ? `Documented transform: ${u.transform.replace(/_/g, ' ')}.` : `Documented transform is ${u.transform}, not ${p.argument.transform}.`, consumedRefs: [ref(u)] };
    }
    case 'asset_matched': {
      const obs = p.argument.observationIds.map((id) => byId(s.observations, id));
      const missing = p.argument.observationIds.filter((id, i) => !obs[i] || obs[i]!.value?.state !== 'known');
      return missing.length
        ? { ...base, truth: 'unknown', reason: `Not acquired: ${missing.map((id) => byId(s.observations, id)?.operatorDescription ?? id).join('; ')}.`, consumedRefs: obs.filter(Boolean).map((o) => ref(o!)), missingFieldIds: missing }
        : { ...base, truth: 'satisfied', reason: 'All required series are acquired.', consumedRefs: obs.map((o) => ref(o!)) };
    }
    case 'operator_compatible': {
      const a = byId(s.entities, p.argument.quantityA);
      const b = byId(s.entities, p.argument.quantityB);
      const oa = a?.attributes.operatorClass; const ob = b?.attributes.operatorClass;
      if (!a || !b || oa?.state !== 'known' || ob?.state !== 'known'
        || typeof oa.value !== 'string' || !oa.value.trim() || typeof ob.value !== 'string' || !ob.value.trim())
        return { ...base, truth: 'unknown', reason: 'At least one measurement operator is undefined; compatibility is unresolved.', consumedRefs: [a, b].filter(Boolean).map((e) => ref(e!)), missingFieldIds: [p.argument.quantityA, p.argument.quantityB] };
      if (oa.value !== ob.value) return { ...base, truth: 'contradicted', consumedRefs: [ref(a), ref(b)],
        reason: `${a.displayName} (${oa.value.replace(/_/g, ' ')}) and ${b.displayName} (${ob.value.replace(/_/g, ' ')}) have different reviewed measurement operators.` };
      const ba = a.attributes.boundary; const bb = b.attributes.boundary;
      if (ba?.state !== 'known' || bb?.state !== 'known' || typeof ba.value !== 'string' || !ba.value.trim() || typeof bb.value !== 'string' || !bb.value.trim())
        return { ...base, truth: 'unknown', consumedRefs: [ref(a), ref(b)], missingFieldIds: [a.id, b.id],
          reason: 'The operator classes agree, but at least one measurement boundary is undefined; missing boundaries do not establish compatibility.' };
      const same = ba.value === bb.value;
      return { ...base, truth: same ? 'satisfied' : 'contradicted', consumedRefs: [ref(a), ref(b)],
        reason: same ? 'Same documented operator and boundary.' : 'The reviewed measurement boundaries differ.' };
    }
    case 'model_predicts': {
      const m = byId(s.models, p.argument.modelId);
      const q = byId(s.entities, p.argument.quantityId);
      if (!m) return { ...base, truth: 'unknown', reason: `Model ${p.argument.modelId} is not in the registry.`, consumedRefs: [], missingFieldIds: [p.argument.modelId] };
      const predicts = m.predictedQuantityIds.includes(p.argument.quantityId);
      if (predicts) return { ...base, truth: 'satisfied', reason: `${m.displayName} predicts ${q?.displayName ?? p.argument.quantityId}.`, consumedRefs: [ref(m)] };
      return m.predictedQuantitiesReviewed
        ? { ...base, truth: 'contradicted', consumedRefs: [ref(m)], reason: `${m.displayName} does not output ${q?.displayName ?? p.argument.quantityId}. ${m.predictedQuantitiesNote ?? ''}`.trim() }
        : { ...base, truth: 'unknown', consumedRefs: [ref(m)], reason: `The reviewed record does not establish whether ${m.displayName} outputs ${q?.displayName ?? p.argument.quantityId}.` };
    }
    case 'positive_value': {
      const o = byId(s.observations, p.argument.observationId);
      const v = o?.value;
      if (!o || v?.state !== 'known' || typeof v.value !== 'number')
        return { ...base, truth: 'unknown', reason: `${p.argument.observationId} has no known numeric value.`, consumedRefs: o ? [ref(o)] : [], missingFieldIds: [p.argument.observationId] };
      return { ...base, truth: v.value > 0 ? 'satisfied' : 'contradicted', reason: v.value > 0 ? `${v.originalText} is positive.` : `${v.originalText} is not positive; no scale can be formed.`, consumedRefs: [ref(o)] };
    }
    case 'same_measurand': {
      const obs = p.argument.observationIds.map((id) => byId(s.observations, id));
      if (obs.some((o) => !o)) return { ...base, truth: 'unknown', reason: 'An observation is missing.', consumedRefs: obs.filter(Boolean).map((o) => ref(o!)), missingFieldIds: p.argument.observationIds };
      const present = obs.map((o) => o!);
      const defined = (value: string | null): value is string => typeof value === 'string' && value.trim().length > 0;
      const incompatible = new Set(present.map((o) => o.measurandId)).size > 1
        || new Set(present.map((o) => o.unit).filter(defined)).size > 1
        || new Set(present.map((o) => o.basis).filter(defined)).size > 1;
      if (incompatible) return { ...base, truth: 'contradicted', consumedRefs: present.map(ref), reason: 'Different quantity, unit or basis.' };
      const missing = present.filter((o) => !defined(o.unit) || !defined(o.basis));
      if (missing.length) return { ...base, truth: 'unknown', consumedRefs: present.map(ref), missingFieldIds: missing.map((o) => o.id),
        reason: 'At least one unit or measurement basis is undefined; matching missing values do not establish the same measurand.' };
      return { ...base, truth: 'satisfied', consumedRefs: present.map(ref), reason: `Same documented quantity, unit and basis (${present[0].unit}, ${present[0].basis}).` };
    }
    case 'window_defined': {
      const o = byId(s.observations, p.argument.observationId);
      if (!o) return { ...base, truth: 'unknown', reason: 'Observation missing.', consumedRefs: [], missingFieldIds: [p.argument.observationId] };
      return o.windowDescription
        ? { ...base, truth: 'satisfied', reason: `Window: ${o.windowDescription}.`, consumedRefs: [ref(o)] }
        : { ...base, truth: 'unknown', reason: `The integration window of ${o.operatorDescription.toLowerCase()} is not stated in the reviewed passage.`, consumedRefs: [ref(o)], missingFieldIds: [o.id] };
    }
  }
}

/** Critical rule: any contradicted -> contradicted; else any unknown -> unknown; else satisfied. */
export function combine(results: PredicateResult[]): Truth {
  const crit = results.filter((r) => r.critical);
  if (crit.some((r) => r.truth === 'contradicted')) return 'contradicted';
  if (crit.some((r) => r.truth === 'unknown')) return 'unknown';
  return 'satisfied';
}
