/**
 * Loads and validates the reviewed registry (web/data/*.json). Every file is parsed through the runtime
 * schemas; cross-record integrity is checked by validateCatalog. A failing registry is reported, never
 * replaced by sample data (master §12.4).
 */
import manifestJson from '../../data/catalog-manifest.json';
import sourcesJson from '../../data/sources.json';
import investigationsJson from '../../data/investigations.json';
import assertionsJson from '../../data/assertions.json';
import entitiesJson from '../../data/entities.json';
import eventsJson from '../../data/events.json';
import observationsJson from '../../data/observations.json';
import modelsJson from '../../data/physical-models.json';
import usesJson from '../../data/observation-uses.json';
import contractsJson from '../../data/applicability-contracts.json';
import findingsJson from '../../data/findings.json';
import conflictsJson from '../../data/conflicts.json';
import methodsJson from '../../data/transfer-methods.json';
import { z } from 'zod';
import {
  ApplicabilityContract, Assertion, CatalogManifest, EntityRecord, ExperimentEvent, Finding, Investigation, InvestigationFile,
  ObservationDefinition, ObservationUse, PhysicalModel, RegistryFiles, Source, SourceConflict, TransferMethod,
} from './schemas';
import { digestOf } from './canonicalize';

export interface CatalogSnapshot {
  revision: string;
  digest: string;
  manifest: z.infer<typeof CatalogManifest>;
  families: { id: string; displayName: string }[];
  sources: Source[];
  investigations: Investigation[];
  assertions: Assertion[];
  entities: EntityRecord[];
  events: ExperimentEvent[];
  observations: ObservationDefinition[];
  models: PhysicalModel[];
  uses: ObservationUse[];
  contracts: ApplicabilityContract[];
  findings: Finding[];
  conflicts: z.infer<typeof SourceConflict>[];
  methods: z.infer<typeof TransferMethod>[];
}

export interface RawRegistry {
  manifest: unknown; sources: unknown; investigations: unknown; assertions: unknown; entities: unknown; events: unknown;
  observations: unknown; models: unknown; uses: unknown; contracts: unknown; findings: unknown; conflicts: unknown; methods: unknown;
}

function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}

export const RAW_REGISTRY: RawRegistry = deepFreeze({
  manifest: manifestJson, sources: sourcesJson, investigations: investigationsJson, assertions: assertionsJson, entities: entitiesJson,
  events: eventsJson, observations: observationsJson, models: modelsJson, uses: usesJson, contracts: contractsJson,
  findings: findingsJson, conflicts: conflictsJson, methods: methodsJson,
});

export function parseRegistry(raw: RawRegistry): { snapshot: CatalogSnapshot | null; errors: string[] } {
  const errors: string[] = [];
  const parse = <T>(name: string, schema: z.ZodType<T>, value: unknown): T | null => {
    const r = schema.safeParse(value);
    if (!r.success) {
      for (const i of r.error.issues.slice(0, 20)) errors.push(`${name}: ${i.path.join('.')}: ${i.message}`);
      return null;
    }
    return r.data;
  };
  const manifest = parse('catalog-manifest', CatalogManifest, raw.manifest);
  const inv = parse('investigations', InvestigationFile, raw.investigations);
  const f = {
    sources: parse('sources', RegistryFiles.sources, raw.sources), assertions: parse('assertions', RegistryFiles.assertions, raw.assertions),
    entities: parse('entities', RegistryFiles.entities, raw.entities), events: parse('events', RegistryFiles.events, raw.events),
    observations: parse('observations', RegistryFiles.observations, raw.observations), models: parse('physical-models', RegistryFiles.models, raw.models),
    uses: parse('observation-uses', RegistryFiles.uses, raw.uses), contracts: parse('applicability-contracts', RegistryFiles.contracts, raw.contracts),
    findings: parse('findings', RegistryFiles.findings, raw.findings), conflicts: parse('conflicts', RegistryFiles.conflicts, raw.conflicts),
    methods: parse('transfer-methods', RegistryFiles.methods, raw.methods),
  };
  if (!manifest || !inv || Object.values(f).some((x) => x === null)) return { snapshot: null, errors };
  const body = {
    revision: manifest.revision, manifest, families: inv.families, investigations: inv.records,
    sources: f.sources!.records, assertions: f.assertions!.records, entities: f.entities!.records, events: f.events!.records,
    observations: f.observations!.records, models: f.models!.records, uses: f.uses!.records, contracts: f.contracts!.records,
    findings: f.findings!.records, conflicts: f.conflicts!.records, methods: f.methods!.records,
  };
  const snapshot: CatalogSnapshot = { ...body, digest: digestOf(body) };
  errors.push(...validateCatalog(snapshot));
  return { snapshot: errors.length ? null : deepFreeze(snapshot), errors };
}

/** Cross-record integrity (master §7.5). Returns human-readable problems; empty means valid. */
export function validateCatalog(s: CatalogSnapshot): string[] {
  const errs: string[] = [];
  const index = new Map<string, { kind: string; revision: string }>();
  const add = (kind: string, recs: { id: string; revision: string }[]) => {
    for (const r of recs) {
      if (index.has(r.id)) errs.push(`duplicate id ${r.id} (${kind} and ${index.get(r.id)!.kind})`);
      index.set(r.id, { kind, revision: r.revision });
    }
  };
  add('source', s.sources); add('investigation', s.investigations); add('assertion', s.assertions); add('entity', s.entities);
  add('event', s.events); add('observation', s.observations); add('model', s.models); add('use', s.uses); add('contract', s.contracts);
  add('finding', s.findings); add('conflict', s.conflicts); add('method', s.methods);
  const familyIds = new Set(s.families.map((x) => x.id));
  const need = (id: string, kinds: string[], where: string) => {
    const e = index.get(id);
    if (!e) errs.push(`${where}: dangling reference ${id}`);
    else if (!kinds.includes(e.kind)) errs.push(`${where}: ${id} is a ${e.kind}, expected ${kinds.join('/')}`);
  };
  const needRef = (r: { id: string; revision: string }, kinds: string[], where: string) => {
    need(r.id, kinds, where);
    const e = index.get(r.id);
    if (e && e.revision !== r.revision) errs.push(`${where}: ${r.id} revision ${r.revision} != ${e.revision}`);
  };
  const locs = (ls: { source: { id: string; revision: string } }[], where: string) => ls.forEach((l) => needRef(l.source, ['source'], where));
  const entityKind = (id: string, kind: string, where: string) => {
    const e = s.entities.find((x) => x.id === id);
    if (!e) errs.push(`${where}: dangling entity ${id}`);
    else if (e.kind !== kind) errs.push(`${where}: ${id} is ${e.kind}, expected ${kind}`);
  };

  for (const src of s.sources) {
    if (src.access === 'artifact_bytes' && !src.observedSha256) errs.push(`${src.id}: artifact_bytes access without an observed hash`);
    if (src.observedSha256 && src.expectedSha256 && src.observedSha256 !== src.expectedSha256)
      errs.push(`${src.id}: observed hash differs from expected; record a new version instead of overwriting`);
  }
  for (const a of s.assertions) { locs(a.sourceLocators, a.id); a.conflictIds.forEach((c) => need(c, ['conflict'], a.id)); }
  for (const i of s.investigations) {
    if (!familyIds.has(i.familyId)) errs.push(`${i.id}: unknown family ${i.familyId}`);
    i.objectiveAssertionIds.forEach((x) => need(x, ['assertion'], i.id));
    i.findingIds.forEach((x) => {
      need(x, ['finding'], i.id);
      const fd = s.findings.find((y) => y.id === x);
      if (fd && !fd.investigationRefs.some((r) => r.id === i.id)) errs.push(`${i.id}: lists ${x} but the finding does not reference it`);
    });
    i.eventIds.forEach((x) => need(x, ['event'], i.id));
    i.sourceRefs.forEach((r) => needRef(r, ['source'], i.id));
    for (const oid of i.objectiveAssertionIds) {
      const a = s.assertions.find((y) => y.id === oid);
      if (a && a.kind === 'observed_result') errs.push(`${i.id}: objective list contains an observed result ${oid}`);
    }
    if (i.coverage === 'profile_only' && i.findingIds.length) errs.push(`${i.id}: profile_only investigation lists findings`);
  }
  for (const f of s.findings) {
    needRef(f.assertionRef, ['assertion'], f.id);
    f.investigationRefs.forEach((r) => {
      needRef(r, ['investigation'], f.id);
      const inv = s.investigations.find((x) => x.id === r.id);
      if (inv && !inv.findingIds.includes(f.id)) errs.push(`${f.id}: references ${r.id} but the investigation does not list it`);
    });
    f.familyIds.forEach((x) => { if (!familyIds.has(x)) errs.push(`${f.id}: unknown family ${x}`); });
    f.eventRefs.forEach((r) => needRef(r, ['event'], f.id));
    f.observationRefs.forEach((r) => needRef(r, ['observation'], f.id));
    f.phenomenonIds.forEach((x) => entityKind(x, 'phenomenon', f.id));
    f.quantityIds.forEach((x) => entityKind(x, 'quantity', f.id));
    f.endpointIds.forEach((x) => entityKind(x, 'endpoint', f.id));
    f.applicabilityContractIds.forEach((x) => need(x, ['contract'], f.id));
    f.qualifyingFindingIds.forEach((x) => need(x, ['finding'], f.id));
    f.lineageRefs.forEach((r) => needRef(r, ['finding', 'source'], f.id));
    f.domain.conditionRefs.forEach((r) => needRef(r, ['event', 'entity'], f.id));
    locs(f.domain.sourceLocators, f.id);
    const a = s.assertions.find((x) => x.id === f.assertionRef.id);
    if (a && a.state !== 'active') errs.push(`${f.id}: assertion ${a.id} is not active`);
    if (a && f.briefRole === 'finding' && a.kind === 'objective') errs.push(`${f.id}: an objective cannot be a brief finding`);
  }
  for (const e of s.entities) locs(e.sourceLocators, e.id);
  for (const ev of s.events) { needRef(ev.investigationRef, ['investigation'], ev.id); ev.protocolAssertionIds.forEach((x) => need(x, ['assertion'], ev.id)); locs(ev.sourceLocators, ev.id); }
  for (const o of s.observations) {
    if (o.eventRef) needRef(o.eventRef, ['event'], o.id);
    entityKind(o.measurandId, 'quantity', o.id);
    o.assertionIds.forEach((x) => need(x, ['assertion'], o.id));
    if (o.value?.state === 'known' && typeof o.value.value === 'number' && !o.value.originalText) errs.push(`${o.id}: known number without its printed text`);
  }
  for (const m of s.models) {
    m.predictedQuantityIds.forEach((x) => entityKind(x, 'quantity', m.id));
    m.suppliedObservationIds.forEach((x) => need(x, ['observation'], m.id));
    m.useRecordIds.forEach((x) => need(x, ['use'], m.id));
    m.assumptionAssertionIds.forEach((x) => need(x, ['assertion'], m.id));
    if (m.status === 'proposed' && m.runRef) errs.push(`${m.id}: a proposed model cannot have a run`);
  }
  for (const u of s.uses) {
    needRef(u.modelRef, ['model'], u.id); needRef(u.observationRef, ['observation'], u.id);
    u.assertionIds.forEach((x) => need(x, ['assertion'], u.id));
    if (u.historicalUse === 'scoped_reviewed_non_use' && u.assertionIds.length === 0) errs.push(`${u.id}: non-use needs affirmative evidence`);
  }
  for (const c of s.contracts) {
    need(c.selector.modelId, ['model'], c.id);
    c.selector.quantityIds.forEach((x) => entityKind(x, 'quantity', c.id));
    (c.selector.eventIds ?? []).forEach((x) => need(x, ['event'], c.id));
    c.findingRefs.forEach((r) => needRef(r, ['finding'], c.id));
    for (const p of c.requirements) {
      p.sourceAssertionIds.forEach((x) => need(x, ['assertion'], `${c.id}/${p.id}`));
      const a = p.argument as Record<string, unknown>;
      for (const [k, v] of Object.entries(a)) {
        const ids = Array.isArray(v) ? v : [v];
        if (k === 'useId') ids.forEach((x) => need(String(x), ['use'], `${c.id}/${p.id}`));
        if (k === 'observationId' || k === 'observationIds') ids.forEach((x) => need(String(x), ['observation'], `${c.id}/${p.id}`));
        if (k === 'quantityA' || k === 'quantityB' || k === 'quantityId') ids.forEach((x) => entityKind(String(x), 'quantity', `${c.id}/${p.id}`));
        if (k === 'modelId') ids.forEach((x) => need(String(x), ['model'], `${c.id}/${p.id}`));
      }
    }
    const derivIds = new Set(c.derivations.map((d) => d.id));
    for (const d of c.derivations) {
      for (const [k, v] of Object.entries(d.inputs)) {
        if (k === 'derivation') { if (!derivIds.has(v) || v === d.id) errs.push(`${c.id}/${d.id}: derivation input ${v} must be an earlier derivation of the same contract`); }
        else need(v, ['observation'], `${c.id}/${d.id}`);
      }
    }
    for (const b of Object.values(c.branches)) {
      for (const m of b.text.matchAll(/\{(obs|dv):([^}]+)\}/g)) {
        if (m[1] === 'obs') need(m[2], ['observation'], `${c.id} template`);
        else if (!derivIds.has(m[2])) errs.push(`${c.id} template: unknown derivation ${m[2]}`);
      }
    }
  }
  // Lineage, inherited review, parent-model, specimen and artifact references must obey the
  // same revision/existence contract as the primary paths checked above. Cycles between
  // catalogue records are allowed; this walks each finite JSON record, not its references.
  const inspectRefs = (value: unknown, path: string): void => {
    if (Array.isArray(value)) { value.forEach((child, i) => inspectRefs(child, `${path}[${i}]`)); return; }
    if (value === null || typeof value !== 'object') return;
    const record = value as Record<string, unknown>;
    if (typeof record.id === 'string' && typeof record.revision === 'string') {
      const target = index.get(record.id);
      if (!target) errs.push(`${path}: dangling reference ${record.id}`);
      else if (target.revision !== record.revision) errs.push(`${path}: ${record.id} revision ${record.revision} != ${target.revision}`);
    }
    for (const [key, child] of Object.entries(record)) inspectRefs(child, `${path}.${key}`);
  };
  for (const group of ['sources', 'investigations', 'assertions', 'entities', 'events', 'observations', 'models', 'uses', 'contracts', 'findings', 'conflicts', 'methods'] as const) inspectRefs(s[group], group);
  return errs;
}

let cached: { snapshot: CatalogSnapshot | null; errors: string[] } | null = null;
export function getCatalog(): { snapshot: CatalogSnapshot | null; errors: string[] } {
  if (!cached) cached = parseRegistry(RAW_REGISTRY);
  return { snapshot: cached.snapshot, errors: [...cached.errors] };
}
export function requireCatalog(): CatalogSnapshot {
  const { snapshot, errors } = getCatalog();
  if (!snapshot) throw new Error(`registry invalid: ${errors.slice(0, 5).join('; ')}`);
  return snapshot;
}

export const byId = <T extends { id: string }>(xs: T[], id: string): T | undefined => xs.find((x) => x.id === id);
