# Adversarial workflow audit — 15 November 2026

Three consequential state-management defects were reproduced in the local `web-2026-11-15.4` preview. All three received focused fixes. This review used isolated browser contexts, artificial notebook fixtures and controlled asynchronous delays; no external service or inference provider was called. Application changes are confined to `SessionControls.tsx`, `Workspace.tsx` and the new `tests/e2e/notebook-races.spec.ts`.

The earlier scenario-only source review did not establish these notebook/inter-operation races. The new findings come from actual local reproductions, not from treating passing normal-flow tests as a complete audit.

## Findings and fixes

| ID | Severity | Reproduction and consequence | Fix |
|---|---|---|---|
| WF-01 | P2 | Recheck notebook A; choose an oversized replacement B. The UI says nothing was loaded but retains A's active Load action. Clicking it replaces current draft C with A. | Every import/restore attempt invalidates the old pending review before checking size or reading content. Read/storage failures also finish only their own operation. |
| WF-02 | P2 | Delay older A's `File.text()`, then select and successfully recheck B. Release A's read: its later recheck replaces the pending report, and Load restores A instead of the newer selection B. | One operation token spans file reading and the POST recheck. All response, error and final-state updates require that token to remain current. Busy state starts before file reading. Load/keep-current invalidate outstanding work. |
| WF-03 | P2 | Start interpretation A; edit the question and begin assessment B. While B's deterministic response is held, deliver A's mocked unavailable response. The stale-interpretation branch resets status and re-enables Confirm while B is still pending. | Interpretation now participates in the workspace operation epoch already used by assessments and session loading. Both response and network-error paths ignore superseded operations before changing status or notices. |

WF-01 and WF-02 used the real local `/api/session` implementation. Only the older file read was delayed for WF-02. WF-03 used an intercepted mock 503; it never reached `/api/interpret` or a provider. The real local deterministic assessment response was held in transit to make the race observable.

Original evidence is retained under [`_raw/codebase_audit_2026-11-15/workflow`](../../../_raw/codebase_audit_2026-11-15/workflow): `workflow_probe_results.json`, `stale_interpret_results.json`, screenshots, artificial notebook A/B files, reproduction scripts, and before-edit component copies. The result files include timestamps and source hashes; the fixed files do not overwrite the reproduction evidence.

## Revision wording

The separate scientific-core audit expanded revision witnesses to include changes in qualifications and reasons even when route/outcome labels stay the same. The previous Workspace UI displayed only the text before `": "`, hiding those differences on screen. Each witness now retains its compact summary and adds a native keyboard-accessible disclosure containing complete before/after text. Both are rendered as React text. A clearly marked synthetic UI response tests identical compact outcomes with different qualifications; it edits no source data and is not a scientific-validation test.

## Verification record

The baseline reproduction ran against production preview `.4` on `127.0.0.1:3000`. Targeted post-fix verification uses the `.5` development checkout on separate port `3202`, Chrome, desktop 1366×768 and mobile-width 375×812. It does not reuse or restart the production preview.

The first post-fix attempt stopped at six origin-check failures before testing the workflow fixes. That run exposed a separate root-owned localhost/127.0.0.1 origin regression; root repaired it and retained the same test host. The failed report remains `browser-regressions.json`. It must not be counted as a passing workflow check or attributed to the notebook fix.

The focused rerun is recorded separately in `browser-regressions-fixed.json`: **12 passed in 26.8 seconds**, six cases on each viewport. It covers rejected replacement files, out-of-order file reads, late recheck responses, stale interpretation response/network-error paths, and keyboard disclosure of complete revision wording. No broad suite was rerun by this specialist; consolidated compilation and regression checks remain root-owned.

## Reviewed boundaries

Scenario decoding remains length-limited and schema/checksum checked; source IDs are recomputed before view state changes. A malformed scenario leaves question, attachments and assessment history intact. Generated scenario links are hidden when their selection digest no longer matches. Source, method and result drift remain separate checks; a checksum is not an authenticity signature or independent scientific review.

Notebook parsing rejects invalid checksums, duplicate identities, orphan/out-of-order parents and mismatched request ancestry. Unsupported draft fields fail rather than silently disappear. The root-owned assessment API ancestry check was flagged for that reviewer; it is not an additional fix claimed by this workflow specialist.

No additional consequential XSS, size-limit bypass or source-selection restoration defect was established in this bounded review. Browser viewport checks are not a general accessibility certification, and controlled delay reproductions do not estimate how frequently a race occurs on users' devices. The documented 16-assessment notebook cap remains an explicit product limit, not silent truncation.
