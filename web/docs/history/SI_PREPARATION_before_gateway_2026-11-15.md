# SI preparation and key handoff

SI means **Scientific Intelligence** in IGNIS. The current implementation is a structured research workflow with a prepared interpretation boundary, not an enabled language-model runtime.

## Implemented now

- `/#si`: question → explicit scope → review → confirmation → source-linked assessment, notebook record and Markdown/JSON export.
- Exact question, proposal and catalogue bindings. Edits, cancellation and context changes reject late results; form mode stays labelled `form` in saved records.
- `GET /api/si`: public candidate/status information, without key values or environment contents.
- `POST /api/si`: bounded preview containing question, explicit registered IDs, public catalogue definitions, instructions and closed response schema. No dispatch, key lookup, automatic retry or spending.
- Existing direct Groq and Gemini adapters, tested with controlled transports. Documentation compatibility does not prove a live account accepts a request.

Prepared candidates are `GROQ-OSS120-LOW` (Groq `openai/gpt-oss-120b`) and `GEM38-LOW` (Gemini `gemini-3.8-flash`). Frozen configurations, token caps and evaluation scope are unchanged. No configuration is accepted.

## Providing keys locally

The owner said keys will be supplied shortly. No credential path has been newly designated or inspected. The evaluator already supports `GROQ_API_KEY` and `GEMINI_API_KEY`, optionally read from an explicitly designated `IGNIS_KEYS_FILE` path. Keep the file outside the repository and share **only its path and provider names**, never values, in chat. Do not use a `NEXT_PUBLIC_` prefix.

This handoff does not authorize searching for keys, creating accounts, buying credits, changing billing or starting inference. The current application deliberately does not activate because keys exist.

## Before a live research call

Apply the already recorded permission/data-scope rules, frozen question split, bounded tuning, semantic/schema scoring and cumulative ledger in [API_EVALUATION_READINESS](API_EVALUATION_READINESS.md). Verify the designated account/credential, current endpoint/rates/parameters, actual packet and remaining logical-call/attempt/probe allowances. A replacement key does not reset consumed probes or resolve accounting holds. Never create a new ledger to get a fresh allowance.

A preview can contain a user's question; that does not make arbitrary text part of the approved public evaluation packet. CSVs, unpublished data, personal information, notebook history, private evaluation material, answer keys and credentials must not be automatically sent. Provider output proposes interpretation, not a scientific verdict or solver execution.

Runtime activation still needs an accepted configuration, recorded authorization, durable conservative reservations and response/envelope validation. Current live dispatch is not merely hidden behind an environment switch. Acceptance would not establish independent scientific validation or general model superiority.

## Current measured state

| Item | Result |
| --- | --- |
| Public packet/schema construction | Tested offline for both candidates |
| Extra fields, unknown IDs, stale bindings, oversized input | Rejected in tests |
| Provider egress during preview | Zero outbound calls in controlled checks |
| Confirmation/export and late-reply rejection | Production Chromium desktop/mobile checks passed |
| Live interpretation errors, schema failures and latency | **NOT RUN** |
| Live billed/estimated provider usage in this continuation | **NOT RUN**; no dispatch |
| Runtime acceptance | None |

Claude development calls are disclosed separately in the [research-workbench report](RESEARCH_WORKBENCH_AND_COMPETITOR_REVIEW_2026-11-15.md). They are not runtime performance results. SI product labels coexist with legacy `AI_*`, `aiAvailable`, `aiUse` and stored schemas for compatibility. Development AI disclosure retains its accurate name.
