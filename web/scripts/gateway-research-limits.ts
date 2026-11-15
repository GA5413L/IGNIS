/** Extra fail-closed bounds for the owner-workspace Cloudflare research runners.
 * This does not create authorization or relax the existing canonical budget ledger.
 */
import { LEGACY_HISTORY, readBudgetState } from './eval-ie1';

export function gatewayResearchStopReason(lines: readonly unknown[], runId: string, requiredAttempts: number, reserveEachUsd: number): string | null {
  const state = readBudgetState(lines);
  if (!Number.isSafeInteger(requiredAttempts) || requiredAttempts < 1 || !Number.isFinite(reserveEachUsd) || reserveEachUsd <= 0) return 'Invalid research reservation.';
  const reservations = lines.filter((line): line is { type: 'reserve'; configId: string; runId: string } => !!line && typeof line === 'object' && (line as { type?: unknown }).type === 'reserve');
  if (reservations.some((line) => line.runId.startsWith('CF-EVAL-') && line.runId !== runId))
    return 'This frozen gateway configuration already has an evaluation attempt. A new invocation cannot resume, retune or repeat it; review the saved outcome and record a separately authorized protocol first.';
  // These runners make one attempt per logical call; counting every historical attempt as a call is conservative.
  const groqAttempts = reservations.filter((line) => line.configId === 'GROQ-OSS120-LOW').length;
  if (groqAttempts + requiredAttempts > 60) return 'The 60-call Groq research ceiling cannot accommodate this plan.';
  const legacyAttempts = LEGACY_HISTORY.reduce((total, item) => total + item.probes, 0);
  if (legacyAttempts + reservations.length + requiredAttempts > 240) return 'The 240-attempt research ceiling cannot accommodate this plan.';
  // Retained unknown-call reservations are already in accountedUsd. The narrower ceiling is not a spending target.
  if (state.accountedUsd + reserveEachUsd * requiredAttempts > 2) return 'The additional $2 conservative research ceiling cannot accommodate this plan.';
  return null;
}
