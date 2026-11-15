/**
 * IE-1 interpretation evaluation runner (MODEL_SELECTION.md §6).
 *
 *   npx tsx scripts/eval-ie1.ts --config <ID> --cap <USD> [--dev] [--mock] [--only F01,F02]
 *
 * Rules enforced here:
 * - Questions and keys are frozen by eval/ie1/FREEZE_TESTSET.json; every run records context hashes.
 *   Dev probes (--dev) use separate questions and share a cumulative three-attempt limit per config.
 * - Budget: every attempt reserves against --cap AND the existing shared D051/D054 $5 ledger.
 *   Missing usage retains the reservation; estimates are not a provider billing guarantee.
 * - One retry only for transport/timeout/429/5xx. Semantic, schema, refusal or truncation failures never retry.
 * - The provider sees only the system prompt (instructions + field guide + public catalogue) and the question
 *   with its explicit selection. Keys are never sent.
 * - Credentials come from the environment, or from the file named by IGNIS_KEYS_FILE (KEY=VALUE lines).
 *   Values are never printed or written.
 */
import { createHash, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync, openSync, closeSync, fsyncSync, unlinkSync, realpathSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { z } from 'zod';
import { requireCatalog } from '../src/core/registry';
import { buildInterpretationMessages, INTERPRETER_CONTRACT_VERSION } from '../src/core/interpretation';
import { wireJsonSchema, wireToProposal } from '../src/core/wireProposal';
import { deriveHandling, validateProposalIds } from '../src/core/handling';
import { CANDIDATE_CONFIGS, configById } from '../src/server/providers/configs';
import { callProvider, fetchTransport, usageCostUsd, type ProviderCallInput, type ProviderCallResult, type RuntimeConfig, type Transport } from '../src/server/providers';
import { buildOpenAiCompatibleBody } from '../src/server/providers/openaiCompatible';
import { buildGeminiBody } from '../src/server/providers/gemini';
import { scoreCase, type Key, type CaseScore } from './ie1/score';

const sha = (t: string) => createHash('sha256').update(t).digest('hex');
const arg = (name: string) => { const i = process.argv.indexOf(`--${name}`); return i >= 0 ? process.argv[i + 1] : undefined; };
const flag = (name: string) => process.argv.includes(`--${name}`);

export const COMBINED_CAP_USD = 5;
export const MAX_PROBES_PER_CONFIG = 3;
// This is an existing authorization for this workspace, not a new allowance per checkout/output folder.
// Moving it requires an explicit history-preserving migration; the CLI never creates a live ledger.
export const AUTHORIZED_LEDGER_PATH = 'E:/Projects/IGNIS/_raw/build_completion_2026-11-15/api_readiness/ie1-live-ledger.jsonl';
export const LEGACY_HISTORY = [
  { run: '2026-11-14T14-20-03-994Z_OR-HAIKU55_dev', configId: 'OR-HAIKU55', probes: 3, recordedSpendUsd: 0,
    callsSha256: '1761fdc5e60a9475d2ded32b9fee3139597e0ff8f237189e8ac8991a93ee938a' },
  { run: '2026-11-14T14-20-11-292Z_GEM38-LOW_dev', configId: 'GEM38-LOW', probes: 3, recordedSpendUsd: 0,
    callsSha256: 'bd785f8861619db5e79b05b82e99236e9de818d64da60ccd990da231ae5b4ac8' },
] as const;
export const INITIAL_LEDGER_HEADER = {
  type: 'authorization', version: 1, authorizationId: 'D051+D054', combinedCapUsd: COMBINED_CAP_USD,
  canonicalPath: AUTHORIZED_LEDGER_PATH, legacyHistorySha256: sha(JSON.stringify(LEGACY_HISTORY)),
  legacyCostBasis: 'Historical summaries record $0 after invalid-credential errors; not invoice-verified.',
} as const;

const money = z.number().finite().nonnegative();
const reservationSchema = z.object({
  type: z.literal('reserve'), attemptId: z.string().min(1), runId: z.string().min(1), configId: z.string().min(1),
  probe: z.boolean(), reservedUsd: money.positive(), inputTokensReserved: z.number().int().positive(),
  outputTokensReserved: z.number().int().positive(), createdAtUtc: z.string().min(1),
}).strict();
const settlementSchema = z.object({
  type: z.literal('settle'), attemptId: z.string().min(1), accountedUsd: money, actualCostUsd: money.nullable(),
  basis: z.enum(['reported_usage_cost', 'token_rates', 'reservation_usage_unknown']),
  unexpectedBilling: z.boolean(), httpStatus: z.number().int().nullable(), failure: z.string().nullable(),
  latencyMs: money, createdAtUtc: z.string().min(1),
}).strict();
export type BudgetReservation = z.infer<typeof reservationSchema>;
export type BudgetSettlement = z.infer<typeof settlementSchema>;
export interface BudgetState {
  accountedUsd: number;
  heldUsd: number;
  pendingAttempts: number;
  probesByConfig: Record<string, number>;
  unexpectedBilling: boolean;
}
// Round holds up, never down. This is finer than the provider price precision used here.
const roundedUp = (usd: number) => Math.ceil(usd * 1e9) / 1e9;
const sumUsd = (a: number, b: number) => Number((a + b).toFixed(9));

/** Replays immutable history; malformed/truncated/duplicate records fail closed. No credentials or I/O. */
export function readBudgetState(lines: readonly unknown[]): BudgetState {
  if (JSON.stringify(lines[0]) !== JSON.stringify(INITIAL_LEDGER_HEADER)) throw new Error('ledger authorization/history header differs; migration review required');
  const probesByConfig = Object.fromEntries(CANDIDATE_CONFIGS.map((c) => [c.id, 0]));
  let accountedUsd = 0; let heldUsd = 0; let unexpectedBilling = false;
  for (const previous of LEGACY_HISTORY) {
    probesByConfig[previous.configId] += previous.probes;
    accountedUsd = sumUsd(accountedUsd, previous.recordedSpendUsd);
  }
  const pending = new Map<string, BudgetReservation>(); const seen = new Set<string>();
  for (const raw of lines.slice(1)) {
    const type = raw && typeof raw === 'object' ? (raw as { type?: unknown }).type : null;
    if (type === 'reserve') {
      const r = reservationSchema.parse(raw);
      configById(r.configId); // A renamed configuration cannot acquire another allowance.
      if (seen.has(r.attemptId)) throw new Error('duplicate ledger attempt');
      if (unexpectedBilling || sumUsd(accountedUsd, r.reservedUsd) > COMBINED_CAP_USD) throw new Error('ledger reservation exceeds authorization');
      if (r.probe && ++probesByConfig[r.configId] > MAX_PROBES_PER_CONFIG) throw new Error('ledger exceeds compatibility-probe allowance');
      seen.add(r.attemptId); pending.set(r.attemptId, r);
      accountedUsd = sumUsd(accountedUsd, r.reservedUsd); heldUsd = sumUsd(heldUsd, r.reservedUsd);
    } else if (type === 'settle') {
      const r = settlementSchema.parse(raw); const reserved = pending.get(r.attemptId);
      if (!reserved) throw new Error('ledger settlement has no unsettled reservation');
      const unknown = r.basis === 'reservation_usage_unknown';
      if ((unknown && (r.actualCostUsd !== null || r.accountedUsd !== reserved.reservedUsd))
        || (!unknown && (r.actualCostUsd === null || r.accountedUsd !== roundedUp(r.actualCostUsd)))) throw new Error('inconsistent ledger cost/hold');
      if (r.accountedUsd > reserved.reservedUsd && !r.unexpectedBilling) throw new Error('unflagged cost beyond reservation');
      accountedUsd = sumUsd(accountedUsd - reserved.reservedUsd, r.accountedUsd);
      if (!unknown) heldUsd = sumUsd(heldUsd, -reserved.reservedUsd);
      unexpectedBilling ||= r.unexpectedBilling; pending.delete(r.attemptId);
    } else throw new Error('unknown ledger event');
  }
  return { accountedUsd, heldUsd, pendingAttempts: pending.size, probesByConfig, unexpectedBilling };
}

export function budgetStopReason(state: BudgetState, configId: string, probe: boolean, runAccountedUsd: number, reserveUsd: number, cap: number): string | null {
  configById(configId);
  if (!Number.isFinite(cap) || cap <= 0 || cap > COMBINED_CAP_USD) return '--cap must be > 0 and <= the existing combined $5 authorization';
  if (![runAccountedUsd, reserveUsd].every((v) => Number.isFinite(v) && v >= 0) || reserveUsd === 0) return 'invalid budget reservation';
  if (state.unexpectedBilling) return 'previous unexpected billing requires reconciliation; no new attempt';
  if (state.pendingAttempts) return 'an interrupted attempt is still reserved; reconcile its outcome before another live run';
  if (probe && state.probesByConfig[configId] >= MAX_PROBES_PER_CONFIG) return `compatibility probes exhausted for ${configId} (${MAX_PROBES_PER_CONFIG}/${MAX_PROBES_PER_CONFIG})`;
  if (sumUsd(runAccountedUsd, reserveUsd) > cap) return `run accounting plus reservation exceeds --cap $${cap}`;
  if (sumUsd(state.accountedUsd, reserveUsd) > COMBINED_CAP_USD) return 'cumulative accounting plus reservation exceeds the shared $5 authorization';
  return null;
}

/** Conservative local text estimate, not a tokenizer or an invoice guarantee. */
export function estimateReservation(cfg: RuntimeConfig, input: ProviderCallInput) {
  if (cfg.provider === 'openrouter') {
    const routing = cfg.params.provider as { max_price?: { prompt?: number; completion?: number; request?: number } } | undefined;
    const ceiling = routing?.max_price;
    if (!ceiling || ceiling.prompt !== cfg.rates.inputPerM || ceiling.completion !== cfg.rates.outputPerM || ceiling.request !== 0) throw new Error('OpenRouter price guard must match reserved rates and exclude per-request surcharges');
  }
  const body = cfg.provider === 'gemini' ? buildGeminiBody(cfg, input) : buildOpenAiCompatibleBody(cfg, input);
  // The former characters/2.5 estimate was not a safe reservation. Count the ENTIRE UTF-8 request
  // one byte per input token plus 1024 tokens for framing/schema overhead, without cache discounts.
  const inputTokensReserved = Buffer.byteLength(JSON.stringify(body), 'utf8') + 1024;
  const outputTokensReserved = cfg.maxOutputTokens;
  const reservedUsd = roundedUp((inputTokensReserved * cfg.rates.inputPerM + outputTokensReserved * cfg.rates.outputPerM) / 1e6);
  return { inputTokensReserved, outputTokensReserved, reservedUsd };
}

export function accountAttempt(res: ProviderCallResult, cfg: RuntimeConfig, reservation: Pick<BudgetReservation, 'reservedUsd' | 'inputTokensReserved' | 'outputTokensReserved'>) {
  const u = res.usage;
  const invalidUsage = Object.values(u).some((v) => v !== null && (!Number.isFinite(v) || v < 0));
  const rawCost = invalidUsage ? null : usageCostUsd(u, cfg);
  const actualCostUsd = rawCost !== null && Number.isFinite(rawCost) && rawCost >= 0 ? rawCost : null;
  const accountedUsd = actualCostUsd === null ? reservation.reservedUsd : roundedUp(actualCostUsd);
  const basis = actualCostUsd === null ? 'reservation_usage_unknown' : u.reportedCostUsd !== null ? 'reported_usage_cost' : 'token_rates';
  const unexpectedBilling = invalidUsage || accountedUsd > reservation.reservedUsd
    || (u.inputTokens !== null && u.inputTokens > reservation.inputTokensReserved)
    || (u.outputTokens !== null && u.outputTokens > reservation.outputTokensReserved);
  return { actualCostUsd, accountedUsd, basis, unexpectedBilling } as const;
}

function appendDurable(path: string, event: unknown) {
  const fd = openSync(path, 'a');
  try { writeFileSync(fd, JSON.stringify(event) + '\n'); fsyncSync(fd); } finally { closeSync(fd); }
}

interface LiveLedger { state: () => BudgetState; append: (event: BudgetReservation | BudgetSettlement) => void; close: () => void }
function openLiveLedger(path: string | undefined): LiveLedger {
  if (!path || resolve(path) !== resolve(AUTHORIZED_LEDGER_PATH) || !existsSync(path)) throw new Error(`IGNIS_EVAL_LEDGER must designate the existing ${AUTHORIZED_LEDGER_PATH}; no automatic initialization or replacement`);
  if (realpathSync(path) !== realpathSync(AUTHORIZED_LEDGER_PATH)) throw new Error('ledger path does not resolve to its canonical history');
  const lock = path + '.lock';
  const fd = openSync(lock, 'wx'); // Exclusive across configurations and output folders. No stale-lock expiry.
  try {
    writeFileSync(fd, JSON.stringify({ pid: process.pid, startedUtc: new Date().toISOString() })); fsyncSync(fd);
    const lines: unknown[] = readFileSync(path, 'utf8').trimEnd().split(/\r?\n/).map((line) => JSON.parse(line));
    readBudgetState(lines);
    return {
      state: () => readBudgetState(lines),
      append: (event) => { readBudgetState([...lines, event]); appendDurable(path, event); lines.push(event); },
      close: () => { closeSync(fd); unlinkSync(lock); },
    };
  } catch (e) { closeSync(fd); unlinkSync(lock); throw e; }
}

interface Question { id: string; set?: string; question: string; selectedIds: string[] }

function loadKey(cfg: RuntimeConfig, mock: boolean): string {
  if (mock) return 'mock-key';
  // The keys file wins over the environment: the environment held stale keys on 14 Nov (401/400 from providers).
  const file = process.env.IGNIS_KEYS_FILE;
  if (file && existsSync(file)) {
    for (const line of readFileSync(file, 'utf8').replace(/^﻿/, '').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
      if (m && m[1] === cfg.keyEnv) return m[2].replace(/^['"]|['"]$/g, '');
    }
  }
  const fromEnv = process.env[cfg.keyEnv];
  if (fromEnv) return fromEnv.trim();
  throw new Error(`credential ${cfg.keyEnv} not found in IGNIS_KEYS_FILE or the environment; no call made`);
}

/** Mock transport for dry runs: returns a fixed, schema-valid browse proposal. It proves plumbing, not quality. */
const mockTransport: Transport = async (url) => {
  const wire = { intent: 'browse_investigations', safetyAreas: [], investigationIds: [], physicalModelId: null, eventIds: [], quantityIds: [], endpointIds: [],
    requestedFeature: 'unspecified', temporalScope: 'unspecified', requestedClaim: 'unspecified', constraints: [], explicitExclusions: [], ambiguities: [],
    unknownTerms: [], proposedModelNote: null, requestedExecutionText: null, supportingContextIds: [] };
  const text = JSON.stringify(wire);
  const body = url.includes('generativelanguage')
    ? { id: 'mock', model: 'mock', status: 'completed', steps: [{ type: 'model_output', content: [{ type: 'text', text }] }], usage: { total_input_tokens: 3000, total_output_tokens: 300, total_thought_tokens: 0 } }
    : { id: 'mock', model: 'mock', choices: [{ finish_reason: 'stop', message: { content: text } }], usage: { prompt_tokens: 3000, completion_tokens: 300 } };
  return { status: 200, headers: { get: () => null }, text: async () => JSON.stringify(body) };
};

async function runEvaluation(cfg: RuntimeConfig, cap: number, dev: boolean, mock: boolean, ledger: LiveLedger | null) {
  const only = arg('only')?.split(',');
  const root = resolve(__dirname, '..');
  const qPath = join(root, 'eval/ie1', dev ? 'dev_questions.json' : 'questions.json');
  const kPath = join(root, 'eval/ie1/keys.json');
  const qText = readFileSync(qPath, 'utf8'); const kText = readFileSync(kPath, 'utf8');
  const qFile = JSON.parse(qText) as { questions: Question[]; repeatIds?: string[]; repeatsEach?: number };
  const keys = new Map((JSON.parse(kText).keys as Key[]).map((k) => [k.id, k]));
  const s = requireCatalog();
  const schema = wireJsonSchema(s);
  const schemaText = JSON.stringify(schema);
  const probe = buildInterpretationMessages(s, '', []);
  const freeze = {
    contract: INTERPRETER_CONTRACT_VERSION, catalogRevision: s.revision, catalogDigest: s.digest,
    questionsSha256: sha(readFileSync(join(root, 'eval/ie1/questions.json'), 'utf8')), keysSha256: sha(kText),
    systemPromptSha256: sha(probe.system), schemaSha256: sha(schemaText),
  };
  // The test set (questions + keys) is frozen once and may never change. The context (catalogue, prompt, schema)
  // may change between runs; each run records it, and a gate result applies only to the context it ran on.
  const freezePath = join(root, 'eval/ie1/FREEZE_TESTSET.json');
  if (!mock && !dev) {
    if (existsSync(freezePath)) {
      const prev = JSON.parse(readFileSync(freezePath, 'utf8')) as { questionsSha256: string; keysSha256: string };
      if (prev.questionsSha256 !== freeze.questionsSha256 || prev.keysSha256 !== freeze.keysSha256) {
        throw new Error('IE-1 test set changed after freezing (questions or keys hash differs). Aborting with no call.');
      }
    } else {
      writeFileSync(freezePath, JSON.stringify({ questionsSha256: freeze.questionsSha256, keysSha256: freeze.keysSha256, frozenAtUtc: new Date().toISOString(),
        note: 'Written by the first live IE-1 run; questions and keys may not change afterwards.' }, null, 1));
    }
  }
  const apiKey = loadKey(cfg, mock);
  const transport = mock ? mockTransport : fetchTransport;

  // Call plan: distinct questions in order, then the repeat IDs (test mode only).
  let plan = qFile.questions.filter((q) => !only || only.includes(q.id)).map((q) => ({ q, trial: 0 }));
  if (!dev && !only && qFile.repeatIds) {
    for (let r = 1; r <= (qFile.repeatsEach ?? 0); r++) for (const id of qFile.repeatIds) plan.push({ q: qFile.questions.find((x) => x.id === id)!, trial: r });
  }
  if (dev) plan = plan.slice(0, 3);

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outDir = resolve(process.env.IGNIS_EVAL_OUT ?? join(root, '..', 'eval-runs'), `${stamp}_${cfg.id}${dev ? '_dev' : ''}${mock ? '_mock' : ''}`);
  mkdirSync(outDir, { recursive: true });
  const maxAttempts = dev && ledger ? Math.min(plan.length * 2, MAX_PROBES_PER_CONFIG - ledger.state().probesByConfig[cfg.id]) : plan.length * 2;
  writeFileSync(join(outDir, 'run.json'), JSON.stringify({ config: cfg, cap, dev, mock, freeze, plannedCalls: plan.length,
    combinedCapUsd: COMBINED_CAP_USD, ledgerPath: mock ? null : AUTHORIZED_LEDGER_PATH,
    cumulativeBefore: ledger?.state() ?? null, maximumAttempts: maxAttempts, plannedTimeoutCeilingMs: maxAttempts * cfg.timeoutMs,
    startedUtc: new Date().toISOString() }, null, 1));
  const log = join(outDir, 'calls.jsonl');
  const attemptLog = join(outDir, 'attempts.jsonl');
  const runId = `${stamp}_${cfg.id}`;

  let spent = 0; let stopped: string | null = null;
  const results: { id: string; set: string; trial: number; structureOk: boolean; firstAttemptStructureOk: boolean; score: CaseScore | null; latencyMs: number; cost: number; failure: string | null }[] = [];
  for (const { q, trial } of plan) {
    const msgs = buildInterpretationMessages(s, q.question, q.selectedIds);
    const input = { system: msgs.system, user: msgs.user, schema, schemaName: 'ignis_interpretation' };
    const reserve = estimateReservation(cfg, input);
    let res: ProviderCallResult | null = null; let attempts = 0; let firstOk = false;
    let callAccountedUsd = 0; let callLatencyMs = 0;
    while (attempts < 2) {
      const state = ledger?.state() ?? { accountedUsd: spent, heldUsd: 0, pendingAttempts: 0, unexpectedBilling: false, probesByConfig: {} };
      stopped = budgetStopReason(state, cfg.id, dev && !mock, spent, reserve.reservedUsd, cap);
      if (stopped) break;
      attempts++;
      const reservation: BudgetReservation = { type: 'reserve', attemptId: randomUUID(), runId, configId: cfg.id, probe: dev,
        ...reserve, createdAtUtc: new Date().toISOString() };
      ledger?.append(reservation); // Durable BEFORE dispatch: a crash cannot silently release funds or a probe.
      appendDurable(attemptLog, { ...reservation, questionId: q.id, trial, attempt: attempts, mock });
      res = await callProvider(cfg, input, apiKey, transport);
      const accounting = accountAttempt(res, cfg, reserve);
      const settlement: BudgetSettlement = { type: 'settle', attemptId: reservation.attemptId, ...accounting,
        httpStatus: res.httpStatus, failure: res.failure, latencyMs: res.latencyMs, createdAtUtc: new Date().toISOString() };
      ledger?.append(settlement);
      appendDurable(attemptLog, { ...settlement, questionId: q.id, trial, attempt: attempts, usage: res.usage,
        requestId: res.requestId, modelReturned: res.modelReturned, providerReturned: res.providerReturned, mock });
      spent = sumUsd(spent, accounting.accountedUsd);
      callAccountedUsd = sumUsd(callAccountedUsd, accounting.accountedUsd); callLatencyMs += res.latencyMs;
      if (attempts === 1) firstOk = res.ok;
      if (accounting.unexpectedBilling) stopped = 'usage/cost exceeded reservation or was invalid; reconcile billing before further attempts';
      else if (res.failure === 'refusal' || (res.failure === 'http' && !res.retryable)) stopped = 'provider refused or rejected the request; no further calls in this run';
      if (stopped) break;
      if (res.ok || !res.retryable) break;
    }
    // Keep the first failed attempt even when its retry is prevented by a budget/probe limit.
    if (!res) break;
    const r = res;
    let structureOk = false; let score: CaseScore | null = null; let problems: string[] = []; let proposal = null; let handling = null;
    if (r.ok) {
      const w = wireToProposal(r.json);
      if (w.ok) {
        const idp = validateProposalIds(w.proposal, s);
        if (!idp.length) { structureOk = true; proposal = w.proposal; handling = deriveHandling(w.proposal); const k = keys.get(q.id); if (k && !dev) score = scoreCase(w.proposal, handling, k); }
        else problems = idp;
      } else problems = w.problems;
    }
    const cost = usageCostUsd(r.usage, cfg);
    appendFileSync(log, JSON.stringify({
      id: q.id, set: q.set ?? 'dev', trial, attempts, configId: cfg.id, modelReturned: r.modelReturned, providerReturned: r.providerReturned, ok: r.ok, failure: r.failure,
      httpStatus: r.httpStatus, stopReason: r.stopReason, latencyMs: Math.round(r.latencyMs), usage: r.usage, costUsd: cost, requestId: r.requestId, errorText: r.errorText,
      allAttemptsLatencyMs: Math.round(callLatencyMs), allAttemptsAccountedUsd: callAccountedUsd, attemptLog: 'attempts.jsonl',
      rawTextSha256: r.text ? sha(r.text) : null, rawText: r.text, structureOk, problems, proposal, handling, score,
    }) + '\n');
    results.push({ id: q.id, set: q.set ?? 'dev', trial, structureOk, firstAttemptStructureOk: firstOk && structureOk, score, latencyMs: callLatencyMs, cost: callAccountedUsd, failure: r.failure });
    const tag = score ? (score.correct ? 'PASS' : score.criticalErrors.length ? 'CRITICAL' : 'MEANING') : structureOk ? 'STRUCT-OK' : `FAIL(${r.failure ?? 'schema'})`;
    console.log(`${q.id}#${trial} ${tag} ${Math.round(callLatencyMs)}ms accounted $${callAccountedUsd.toFixed(5)}${score && !score.correct ? ` :: ${[...score.criticalErrors, ...score.meaningErrors].join(' | ')}` : ''}${problems.length ? ` :: ${problems.slice(0, 3).join(' | ')}` : ''}${r.errorText ? ` :: ${r.errorText.slice(0, 200)}` : ''}`);
    if (stopped) break;
  }

  const first = results.filter((x) => x.trial === 0);
  const core = first.filter((x) => x.set === 'core');
  const lat = results.map((x) => x.latencyMs).sort((a, b) => a - b);
  const pct = (p: number) => (lat.length ? Math.round(lat[Math.min(lat.length - 1, Math.floor(p * (lat.length - 1)))]) : null);
  const criticalCalls = results.filter((x) => x.score && x.score.criticalErrors.length).map((x) => `${x.id}#${x.trial}`);
  const summary = {
    configId: cfg.id, model: cfg.model, context: freeze, dev, mock, stopped, calls: results.length, plannedCalls: plan.length, spentUsd: spent,
    costMeaning: 'Accounting includes retained reservations for missing usage; it is not an invoice.', cumulativeAfter: ledger?.state() ?? null,
    coreCorrect: core.filter((x) => x.score?.correct).length, coreTotal: core.length,
    supplementaryCorrect: first.filter((x) => x.set === 'supplementary' && x.score?.correct).length, supplementaryTotal: first.filter((x) => x.set === 'supplementary').length,
    criticalCalls, structureFirstAttempt: first.filter((x) => x.firstAttemptStructureOk).length, distinct: first.length,
    repeatsCorrect: results.filter((x) => x.trial > 0 && x.score?.correct).length, repeatsTotal: results.filter((x) => x.trial > 0).length,
    latencyP50ms: pct(0.5), latencyP95ms: pct(0.95),
    gate: !dev && !mock && !stopped && core.length === 24 && results.length === plan.length
      ? (core.filter((x) => x.score?.correct).length >= 23 && criticalCalls.length === 0 && core.every((x) => x.firstAttemptStructureOk) ? 'PASS' : 'FAIL') : 'NOT_EVALUATED',
    scoring: 'assistant-authored keys; NOT independent validation',
    finishedUtc: new Date().toISOString(), outDir,
  };
  writeFileSync(join(outDir, 'summary.json'), JSON.stringify(summary, null, 1));
  console.log(JSON.stringify(summary, null, 1));
}

async function main() {
  const cfg = configById(arg('config') ?? '');
  const cap = Number(arg('cap'));
  if (!Number.isFinite(cap) || cap <= 0 || cap > COMBINED_CAP_USD) throw new Error('--cap must be > 0 and <= the existing combined $5 authorization');
  const dev = flag('dev'); const mock = flag('mock');
  const ledger = mock ? null : openLiveLedger(process.env.IGNIS_EVAL_LEDGER);
  try {
    if (ledger) {
      const state = ledger.state();
      if (state.unexpectedBilling || state.pendingAttempts) throw new Error('unreconciled billing/interrupted attempt in the shared ledger; no call made');
      if (dev && state.probesByConfig[cfg.id] >= MAX_PROBES_PER_CONFIG) throw new Error(`compatibility probes exhausted for ${cfg.id} (3/3); no credential loaded and no call made`);
      if (state.accountedUsd >= COMBINED_CAP_USD) throw new Error('the shared $5 allowance is exhausted; no call made');
    }
    await runEvaluation(cfg, cap, dev, mock, ledger);
  } finally { ledger?.close(); }
}

// Import-safe for mocked tests. Importing accounting helpers never reads credentials or calls providers.
if (process.argv[1] && /^eval-ie1\.(?:ts|js|cjs|mjs)$/.test(process.argv[1].split(/[\\/]/).pop() ?? '')) {
  main().catch((e) => { console.error(String(e?.message ?? e)); process.exitCode = 1; });
}
