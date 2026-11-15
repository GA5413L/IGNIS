import { describe, expect, it } from 'vitest';
import { INITIAL_LEDGER_HEADER } from '../../scripts/eval-ie1';
import { gatewayResearchStopReason } from '../../scripts/gateway-research-limits';

function events(count: number, configId = 'GROQ-OSS120-LOW', runId = 'previous-authorized-run') {
  return Array.from({ length: count }, (_, i) => ({ type: 'reserve', attemptId: `attempt-${i}`, runId, configId, probe: false,
    reservedUsd: 0.001, inputTokensReserved: 1000, outputTokensReserved: 512, createdAtUtc: '2026-11-15T00:00:00Z' }));
}
describe('additional gateway research limits', () => {
  it('keeps the bounded first plan within narrower limits', () => {
    expect(gatewayResearchStopReason([INITIAL_LEDGER_HEADER], 'CF-EVAL-new', 42, 0.003)).toBeNull();
  });
  it('blocks repeating an earlier partial evaluation but allows accounting within the same run', () => {
    const lines = [INITIAL_LEDGER_HEADER, ...events(1, 'GROQ-OSS120-LOW', 'CF-EVAL-existing')];
    expect(gatewayResearchStopReason(lines, 'CF-EVAL-new', 1, 0.003)).toContain('already has an evaluation');
    expect(gatewayResearchStopReason(lines, 'CF-EVAL-existing', 1, 0.003)).toBeNull();
  });
  it('respects per-model, total-attempt and cumulative-reservation bounds', () => {
    expect(gatewayResearchStopReason([INITIAL_LEDGER_HEADER, ...events(60)], 'CF-new', 1, 0.003)).toContain('60-call');
    expect(gatewayResearchStopReason([INITIAL_LEDGER_HEADER, ...events(234, 'GEM38-LOW')], 'CF-new', 1, 0.003)).toContain('240-attempt');
    expect(gatewayResearchStopReason([INITIAL_LEDGER_HEADER], 'CF-new', 42, 0.05)).toContain('$2');
    expect(gatewayResearchStopReason([INITIAL_LEDGER_HEADER], 'CF-new', 1, NaN)).toContain('Invalid');
  });
});
