/** Read-only HTTP adapter for curated evidence. Core analysis functions remain authoritative. */
import { ZodError } from 'zod';
import atlasDataset from '../../data/investigation-atlas.json';
import { compareConditions, conditionDataset } from '../core/conditions';
import {
  DEFAULT_DETECTOR_SELECTION, DETECTOR_CHANNEL_IDS, DETECTOR_MATERIALS,
  detectorDataset, exportDetectorAnalysis,
} from '../core/detector';

export interface EvidenceReply { status: number; body: unknown }
export const MAX_EVIDENCE_QUERY_BYTES = 2048;
const collections = ['atlas', 'conditions', 'condition-comparison', 'detectors'] as const;
type Collection = (typeof collections)[number];
const parameters: Record<Collection, readonly string[]> = {
  atlas: ['collection'],
  conditions: ['collection'],
  'condition-comparison': ['collection', 'cohort', 'oxygen', 'pressure'],
  detectors: ['collection', 'flight', 'material', 'channel', 'cutoff', 'includeReference'],
};
const knownParameters = new Set(Object.values(parameters).flat());

class QueryError extends Error {
  constructor(public readonly code: string, message: string, public readonly parameter: string | null = null) { super(message); }
}

function error(status: number, code: string, message: string, parameter: string | null = null): EvidenceReply {
  return { status, body: { schemaVersion: 'ignis-evidence-error-1', code, message, parameter } };
}

function required(query: URLSearchParams, parameter: string): string {
  const value = query.get(parameter);
  if (value === null) throw new QueryError('missing_parameter', `Parameter ${parameter} is required.`, parameter);
  if (value.length === 0) throw new QueryError('invalid_parameter', `Parameter ${parameter} must not be empty.`, parameter);
  return value;
}

/** Reject JavaScript coercions such as blank strings, hexadecimal and nonfinite numbers. */
function number(query: URLSearchParams, parameter: string): number {
  const raw = required(query, parameter);
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(raw)) {
    throw new QueryError('invalid_parameter', `${parameter} must be a decimal number, without surrounding whitespace.`, parameter);
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || (parsed === 0 && /[1-9]/.test(raw.split(/[eE]/)[0]))) {
    throw new QueryError('invalid_parameter', `${parameter} must fit a finite number without nonzero underflow.`, parameter);
  }
  return parsed === 0 ? 0 : parsed;
}

function choice<T extends string>(query: URLSearchParams, parameter: string, allowed: readonly T[], fallback: T): T {
  if (!query.has(parameter)) return fallback;
  const value = required(query, parameter);
  if (!(allowed as readonly string[]).includes(value)) {
    throw new QueryError('invalid_parameter', `${parameter} must be one of: ${allowed.join(', ')}.`, parameter);
  }
  return value as T;
}

function index() {
  return {
    schemaVersion: 'ignis-evidence-index-1',
    title: 'IGNIS evidence API',
    description: 'Read curated NASA source inventories, published atmosphere coordinates, and descriptive cached detector readings. No model inference runs here.',
    collections: {
      atlas: { url: '/api/evidence?collection=atlas', description: 'Complete acquired investigation inventory with source versions, hashes, record counts and limits.' },
      conditions: { url: '/api/evidence?collection=conditions', description: 'Seven canonical Saffire 2026 cases, original printed strings, conversions, cohorts and source conflict.' },
      'condition-comparison': {
        url: '/api/evidence?collection=condition-comparison&cohort=PMMA-2&oxygen=34&pressure=56.5',
        description: 'Separate oxygen and pressure gaps within one material and burning-side cohort. The URL is an example target, not a recommended atmosphere.',
        parameters: { cohort: conditionDataset.cohorts.map((cohort) => cohort.id), oxygen: 'Required mole percent: greater than 0 and at most 100.', pressure: 'Required kPa: greater than 0 and at most 2000.' },
      },
      detectors: {
        url: '/api/evidence?collection=detectors',
        exampleUrl: '/api/evidence?collection=detectors&material=Kapton&channel=issScatterV&cutoff=2',
        description: 'Complete selected source rows and descriptive voltage-cutoff counts. A cutoff is not a calibrated alarm threshold.',
        defaults: DEFAULT_DETECTOR_SELECTION,
        parameters: { flight: ['all', '1', '2'], material: ['all', ...DETECTOR_MATERIALS], channel: DETECTOR_CHANNEL_IDS, cutoff: 'Optional finite nonnegative voltage in V.', includeReference: ['true', 'false'] },
      },
    },
    datasets: {
      atlas: {
        schemaVersion: atlasDataset.schemaVersion, snapshotDate: atlasDataset.snapshotDate, counts: atlasDataset.counts,
        countMeaning: atlasDataset.countMeaning, inventoryScope: atlasDataset.inventoryScope,
        provenance: atlasDataset.records.map((record) => ({ accession: record.accession, publicUrl: record.publicUrl, source: record.source })),
        reviewStatement: atlasDataset.reviewStatement,
      },
      conditions: {
        schemaVersion: conditionDataset.schemaVersion, snapshotDate: conditionDataset.snapshotDate,
        caseCount: conditionDataset.cases.length, cohortCount: conditionDataset.cohorts.length,
        source: conditionDataset.source, earlierSourceContext: conditionDataset.earlierSourceContext,
        flowConflict: conditionDataset.flowConflict, reviewStatement: conditionDataset.reviewStatement,
      },
      detectors: {
        schemaVersion: detectorDataset.schemaVersion, curationDate: detectorDataset.curationDate,
        counts: {
          flightMarkedRows: detectorDataset.records.length,
          referenceRows: detectorDataset.records.filter((record) => record.materialRole === 'reference').length,
          materialRows: detectorDataset.records.filter((record) => record.materialRole === 'spacecraft_material').length,
        },
        source: detectorDataset.source, review: detectorDataset.source.review,
      },
    },
    requestPolicy: {
      method: 'GET', maxSerializedQueryBytes: MAX_EVIDENCE_QUERY_BYTES,
      parameterPolicy: 'Parameter names and enums are case sensitive. Unknown, repeated and collection-inapplicable parameters are rejected. Decimal numbers may use an exponent; blanks, surrounding whitespace, nonfinite values and nonzero underflow are rejected. Booleans must be exactly true or false.',
      caching: 'no-store', outboundRequests: false,
    },
    boundaries: {
      safeAtmosphereAssessmentProvided: false, physicalPredictionProvided: false, alarmClassificationProvided: false,
      reviewStatement: 'AI-assisted curation and deterministic checks; no independent human review or physical model validation is claimed.',
      statements: [
        'This API does not determine whether any atmosphere is safe or recommend a habitat atmosphere.',
        'Condition proximity does not establish physical equivalence or transfer; the flow-direction publication conflict remains unresolved.',
        'Detector counts describe cached workbook values and exclude unavailable cells from finite-value percentages. Source rows are not independent trials.',
        'Atlas counts describe acquired files and records, not an exhaustive NASA inventory or a count of burns.',
      ],
    },
  };
}

/** Pure over URLSearchParams: deterministic replies, detached JSON data and no network/credential access. */
export function handleEvidence(query: URLSearchParams): EvidenceReply {
  try {
    if (!(query instanceof URLSearchParams)) throw new QueryError('invalid_query', 'Query must be parsed URL search parameters.');
    if (new TextEncoder().encode(query.toString()).length > MAX_EVIDENCE_QUERY_BYTES) {
      throw new QueryError('query_too_large', `Serialized query exceeds ${MAX_EVIDENCE_QUERY_BYTES} bytes; it was not truncated.`);
    }
    const seen = new Set<string>();
    for (const [parameter] of query) {
      if (seen.has(parameter)) throw new QueryError('duplicate_parameter', `Parameter ${parameter} must occur only once.`, parameter);
      seen.add(parameter);
      if (!knownParameters.has(parameter)) throw new QueryError('unknown_parameter', `Unknown parameter ${parameter}.`, parameter);
    }
    if (seen.size === 0) return { status: 200, body: structuredClone(index()) };
    const selected = required(query, 'collection');
    if (!(collections as readonly string[]).includes(selected)) {
      throw new QueryError('unknown_collection', `collection must be one of: ${collections.join(', ')}.`, 'collection');
    }
    const collection = selected as Collection;
    for (const parameter of seen) {
      if (!parameters[collection].includes(parameter)) {
        throw new QueryError('unknown_parameter', `Parameter ${parameter} is not supported for ${collection}.`, parameter);
      }
    }
    if (collection === 'atlas') return { status: 200, body: structuredClone(atlasDataset) };
    if (collection === 'conditions') return { status: 200, body: structuredClone(conditionDataset) };
    if (collection === 'condition-comparison') {
      return { status: 200, body: compareConditions({ cohortId: required(query, 'cohort'), oxygenPercent: number(query, 'oxygen'), pressureKPa: number(query, 'pressure') }) };
    }
    const defaults = DEFAULT_DETECTOR_SELECTION;
    return { status: 200, body: exportDetectorAnalysis({
      flight: choice(query, 'flight', ['all', '1', '2'] as const, defaults.flight),
      material: choice(query, 'material', ['all', ...DETECTOR_MATERIALS] as const, defaults.material),
      channel: choice(query, 'channel', DETECTOR_CHANNEL_IDS, defaults.channel),
      cutoff: query.has('cutoff') ? number(query, 'cutoff') : defaults.cutoff,
      includeReference: choice(query, 'includeReference', ['true', 'false'], defaults.includeReference ? 'true' : 'false') === 'true',
    }) };
  } catch (caught) {
    if (caught instanceof QueryError) return error(400, caught.code, caught.message, caught.parameter);
    if (caught instanceof ZodError) {
      return error(400, 'invalid_parameter', caught.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; '));
    }
    if (caught instanceof Error && /^(Invalid condition comparison:|Unknown condition cohort:)/.test(caught.message)) {
      return error(400, 'invalid_parameter', caught.message);
    }
    return error(500, 'evidence_unavailable', 'Evidence could not be read. No substitute data or result was returned.');
  }
}
