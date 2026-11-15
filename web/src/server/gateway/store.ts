import { DatabaseSync } from 'node:sqlite';
import { isAbsolute } from 'node:path';
import { GATEWAY_LIMITS as LIMIT, type GatewayRouteId } from './policy';

export class QuotaError extends Error {
  constructor(public code: string, public retryAfter = 60) { super(code); }
}

/** Atomic across processes sharing this one SQLite file. Separate serverless disks are NOT a shared store. */
export class GatewayStore {
  private db: DatabaseSync;
  constructor(filename: string) {
    if (filename !== ':memory:' && (!isAbsolute(filename) || /(?:^|[\\/])(?:public|\.git|\.next)(?:[\\/]|$)/i.test(filename))) throw new QuotaError('invalid_quota_store');
    this.db = new DatabaseSync(filename);
    this.db.exec(`PRAGMA busy_timeout=1500; PRAGMA journal_mode=WAL;
      CREATE TABLE IF NOT EXISTS interactions (id TEXT PRIMARY KEY, visitor TEXT NOT NULL, binding TEXT NOT NULL, started INTEGER NOT NULL, reserved INTEGER NOT NULL, state TEXT NOT NULL);
      CREATE INDEX IF NOT EXISTS interaction_start ON interactions(started);
      CREATE TABLE IF NOT EXISTS attempts (id INTEGER PRIMARY KEY, interaction TEXT NOT NULL, route TEXT NOT NULL, started INTEGER NOT NULL, outcome TEXT NOT NULL, input_tokens INTEGER, output_tokens INTEGER, reported_usd REAL);
      CREATE TABLE IF NOT EXISTS circuits (route TEXT PRIMARY KEY, until_time INTEGER NOT NULL, failures INTEGER NOT NULL, disabled INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS controls (name TEXT PRIMARY KEY, value TEXT NOT NULL);`);
  }
  private transaction<T>(fn: () => T): T {
    this.db.exec('BEGIN IMMEDIATE');
    try { const result = fn(); this.db.exec('COMMIT'); return result; }
    catch (error) { this.db.exec('ROLLBACK'); throw error; }
  }
  begin(id: string, visitor: string, binding: string, tokens: number, now = Date.now()) {
    return this.transaction(() => {
      if (!Number.isSafeInteger(tokens) || tokens <= 0 || tokens > LIMIT.reservedTokensDay) throw new QuotaError('packet_budget_exceeded');
      if (this.db.prepare("SELECT value FROM controls WHERE name='halt'").get()) throw new QuotaError('gateway_halted', 86400);
      if (this.db.prepare('SELECT id FROM interactions WHERE id=?').get(id)) throw new QuotaError('duplicate_interaction', 0);
      const count = (query: string, ...args: (number | string)[]) => Number((this.db.prepare(query).get(...args) as { n: number }).n);
      const day = Math.floor(now / 86400000) * 86400000;
      if (count("SELECT count(*) n FROM interactions WHERE state IN ('running','held')") >= LIMIT.concurrent) throw new QuotaError('concurrency_limit');
      if (count('SELECT count(*) n FROM interactions WHERE visitor=? AND started>?', visitor, now - 60000) >= LIMIT.visitorMinute) throw new QuotaError('visitor_minute_limit');
      if (count('SELECT count(*) n FROM interactions WHERE visitor=? AND started>=?', visitor, day) >= LIMIT.visitorDay) throw new QuotaError('visitor_day_limit', 86400);
      if (count('SELECT count(*) n FROM interactions WHERE started>?', now - 60000) >= LIMIT.globalMinute) throw new QuotaError('global_minute_limit');
      if (count('SELECT count(*) n FROM interactions WHERE started>=?', day) >= LIMIT.globalDay) throw new QuotaError('global_day_limit', 86400);
      if (count('SELECT coalesce(sum(reserved),0) n FROM interactions WHERE started>=?', day) + tokens > LIMIT.reservedTokensDay) throw new QuotaError('token_reservation_limit', 86400);
      this.db.prepare('INSERT INTO interactions VALUES (?,?,?,?,?,?)').run(id, visitor, binding, now, tokens, 'running');
    });
  }
  canAttempt(route: GatewayRouteId, now = Date.now()): boolean {
    const row = this.db.prepare('SELECT * FROM circuits WHERE route=?').get(route) as { disabled: number; until_time: number } | undefined;
    return !row || (!row.disabled && row.until_time <= now);
  }
  attempt(id: string, route: GatewayRouteId, now = Date.now()): number {
    return this.transaction(() => {
      if (this.db.prepare("SELECT value FROM controls WHERE name='halt'").get()) throw new QuotaError('gateway_halted');
      const request = this.db.prepare('SELECT state FROM interactions WHERE id=?').get(id) as { state: string } | undefined;
      if (!request || request.state !== 'running') throw new QuotaError('interaction_not_active');
      if (!this.canAttempt(route, now)) throw new QuotaError('route_cooling_down');
      const n = (this.db.prepare('SELECT count(*) n FROM attempts WHERE interaction=?').get(id) as { n: number }).n;
      if (n >= LIMIT.attempts) throw new QuotaError('attempt_limit');
      return Number(this.db.prepare('INSERT INTO attempts(interaction,route,started,outcome) VALUES(?,?,?,?)').run(id, route, now, 'unresolved').lastInsertRowid);
    });
  }
  settle(attempt: number, outcome: string, input: number | null, output: number | null, cost: number | null) {
    this.db.prepare('UPDATE attempts SET outcome=?,input_tokens=?,output_tokens=?,reported_usd=? WHERE id=?').run(outcome, input, output, cost, attempt);
    if (cost !== null && cost > 0) this.halt('unexpected_reported_cost');
  }
  finish(id: string, success: boolean) {
    // An unresolved transport timeout remains held, even when fallback succeeds. No automatic lease expiry.
    const held = (this.db.prepare("SELECT count(*) n FROM attempts WHERE interaction=? AND outcome IN ('unresolved','timeout','transport')").get(id) as { n: number }).n > 0;
    this.db.prepare('UPDATE interactions SET state=? WHERE id=?').run(held ? 'held' : success ? 'completed' : 'failed', id);
  }
  fail(route: GatewayRouteId, status: number | null, retryAfterMs = 0, now = Date.now()) {
    const prior = this.db.prepare('SELECT failures FROM circuits WHERE route=?').get(route) as { failures: number } | undefined;
    const failures = (prior?.failures ?? 0) + 1;
    const disabled = status === 401 || status === 403 || status === 402 ? 1 : 0;
    const delay = status === 429 ? Math.max(60000, retryAfterMs) : Math.min(300000, 15000 * 2 ** Math.min(failures - 1, 4));
    this.db.prepare('INSERT OR REPLACE INTO circuits VALUES (?,?,?,?)').run(route, now + Math.min(86400000, delay), failures, disabled);
    if (status === 402) this.halt('billing_response');
  }
  succeed(route: GatewayRouteId) { this.db.prepare('DELETE FROM circuits WHERE route=? AND disabled=0').run(route); }
  halt(reason: string) { this.db.prepare("INSERT OR REPLACE INTO controls VALUES('halt',?)").run(reason); }
  counts() {
    return { interactions: Number((this.db.prepare('SELECT count(*) n FROM interactions').get() as { n: number }).n),
      attempts: Number((this.db.prepare('SELECT count(*) n FROM attempts').get() as { n: number }).n),
      held: Number((this.db.prepare("SELECT count(*) n FROM interactions WHERE state='held'").get() as { n: number }).n) };
  }
  close() { this.db.close(); }
}
