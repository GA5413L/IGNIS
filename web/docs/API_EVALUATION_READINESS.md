# IE-1 evaluation readiness — 15 November 2026

The runner now enforces the existing D051/D054 combined **$5 authorization** across configurations and invocations. No inference, credential check, account action or runtime enablement was performed for this audit. The checks below use canned transports and do not establish model quality, account access or live schema compatibility.

## Existing history and remaining limits

The two original live development runs in `F:/ignis extra/eval-runs` each contain three calls and three attempts. Haiku returned three HTTP 401 errors; Gemini returned three HTTP 400 errors. Both summaries recorded $0, with missing usage/cost fields. These are invalid-credential results, **not invoice-verified zero charges**. The earlier prose description of a single Gemini probe is inconsistent with the actual three-call run; the stricter observed count is retained.

| Existing configuration ID | Published/reserved input / output USD per million | Output limit | Timeout per attempt | Compatibility probes remaining |
|---|---:|---:|---:|---:|
| `OR-HAIKU55` | 0.10 / 0.50 | 3,000 | 45 seconds | **0 of 3** |
| `OR-OPUS55-LOW` | 4 / 20 | 4,000 | 60 seconds | 3 of 3 |
| `OR-SONNET55-LOW` | 2 / 10 | 4,000 | 60 seconds | 3 of 3; existing reserve-only condition still applies |
| `GEM38-LOW` | 0.75 / 3.75 | 4,000 | 60 seconds | **0 of 3** |
| `GROQ-OSS120-LOW` | 0.15 / 0.60 | 4,000 | 45 seconds | 3 of 3; only a user-designated key |

The recorded accounting balance is $0 used and $5 remaining across all five configurations, not $5 per configuration or a provider-credit balance. Frozen IE-1 evaluation remains distinct from compatibility probes. Neither a new key nor a renamed run/output directory restores a probe allowance. Retries consume an additional attempt and, in development mode, an additional probe. The shortlist and current public price references are in [API_SHORTLIST_2026-11-15.md](API_SHORTLIST_2026-11-15.md); no prices, model IDs, reasoning settings or output limits were raised here.

Byte-preserved copies of the six original run/call/summary files and their SHA-256 hashes are in [`api_readiness/history_manifest.json`](../../_raw/build_completion_2026-11-15/api_readiness/history_manifest.json). Before-change source bytes/hashes are in [`api_readiness_before/manifest.json`](../../_raw/build_completion_2026-11-15/api_readiness_before/manifest.json). Historical files were not edited.

## Price and accounting repair

OpenRouter's `provider.max_price` filters eligible providers by maximum **USD per million prompt/completion tokens**; it also accepts a per-request price ceiling. All three existing OpenRouter configurations now send ceilings equal to their reserved rates, plus `request: 0`. `allow_fallbacks: true`, `require_parameters: true` and `data_collection: deny` remain. A more expensive fallback therefore cannot be intentionally selected under this request policy. An unavailable or rejected route stops; it does not raise the ceiling. These are routing limits, not an invoice or an account-level spending cap. [Official OpenRouter provider routing, “Max Price”](https://openrouter.ai/docs/guides/routing/provider-selection#max-price).

The previous reservation divided character count by 2.5 and called the result a worst case. The replacement conservatively reserves one input token per byte of the entire UTF-8 request plus 1,024 tokens of framing/schema allowance, and the configured output maximum, without cache discounts. This remains a local estimate: provider tokenization, transformations and billing are external. Returned usage beyond the token/cost reservation stops further attempts and leaves a persistent reconciliation block. Output allowance includes reasoning under the documented provider semantics; it is not an allowance for visible text plus an unbounded second reasoning budget. [OpenRouter token-limit semantics](https://openrouter.ai/docs/api_reference/parameters#max-tokens), [Gemini combined thinking/output limit](https://aistudio.google.com/docs/thinking#token-limits).

The accounting changes are bounded to the evaluation runner and the OpenAI-compatible adapter:

- One existing append-only ledger tracks all configurations. A run must fit its own `--cap` and the remaining combined $5; `--cap > 5` is rejected. Exclusive locking prevents concurrent runs from reserving the same balance.
- A durable reservation is written **before every request**, including retries. A crash leaves the reservation and probe consumed. An unresolved reservation or stale lock needs reconciliation; neither expires automatically.
- Each response settles to valid reported cost, otherwise complete token usage at reserved rates. Missing usage retains the full reservation, including non-200 failures and timeouts. A retained estimate is labelled as a hold, not measured spending. Negative/nonfinite usage cannot create budget credits.
- Non-200 OpenAI-compatible responses retain any supplied usage, request ID and model/provider identity. Embedded HTTP-200 error objects are retryable only for the existing retryable status codes. Refusal/nonretryable HTTP rejection stops the run.
- `attempts.jsonl` retains each reservation and settlement. `calls.jsonl` keeps the final response plus totals for all attempts. A failed first attempt is still recorded when a retry is blocked. Latency summaries include retries; per-attempt timeouts remain 45/60 seconds. No new wall-clock allowance was introduced.

## Designated state and external input

For an authorized live run, `IGNIS_EVAL_LEDGER` must point to this existing file:

```text
E:/Projects/IGNIS/_raw/build_completion_2026-11-15/api_readiness/ie1-live-ledger.jsonl
```

The CLI refuses a missing file, another path, a different authorization/history header, malformed records or unresolved prior accounting. It has no initialization/reset option. A future workspace migration must preserve the complete ledger and archived history; copying the baseline to make a fresh allowance is not authorized. This local ledger does not protect against deliberate filesystem tampering or independent requests made outside this runner.

Still needed for live work: a valid user-designated credential (`OPENROUTER_API_KEY`, `GEMINI_API_KEY` or `GROQ_API_KEY`, optionally via the already-supported `IGNIS_KEYS_FILE`) and the explicit ledger path above. Credential material was not inspected. Gemini account tier remains relevant to the existing public-data-only policy. Any billing uncertainty, interrupted request or unexpected charge needs reconciliation before resumption. Haiku/Gemini cannot receive another compatibility probe under the present allowance; no extra probe or budget is implied by this repair. Sonnet remains the already documented conditional reserve.

## Mock verification

The focused suite passed **25/25 tests**, including price guards, cumulative cross-provider accounting, exhausted historical probes, duplicate/orphan ledger records, interrupted reservations, missing usage, billable failures, retry cost retention, embedded auth errors and timeout aborts. An isolated strict TypeScript check passed.

A CLI `--mock --dev --config OR-HAIKU55 --cap 0.1` run made three canned, structurally valid responses and wrote three reservation/settlement pairs. It reported `gate: NOT_EVALUATED`; its $0.00135 is simulated accounting. The live ledger hash stayed `cc10d464aedcf447899bb11631965535f6aebaf85e9d74b20d97c8dfd9de31ba` throughout. Mock artifacts are under [`api_readiness/mock_runs`](../../_raw/build_completion_2026-11-15/api_readiness/mock_runs).

Frozen question and answer-key SHA-256 hashes remain `4f27f1ab18f4827125062ea23e80ca10151ea7b56a6f89a60ce2723542d7c6e1` and `32d1f2e6d82d103b91099bf8b1f810e6fcf100276c97b2f50c98dbaad0b75dbc`. Existing run records, acceptance gates and runtime enablement were not changed. Validation is assistant-performed local testing, not independent review.

## Latest account state

The user replied "no funded account for now" on 15 November. No credential or live comparison is pending execution. Keep the current comparison NOT RUN and the runtime disabled until that prerequisite changes explicitly. No account creation, credit purchase, extra probe, local inference or alternative-provider activation is implied. The app remains usable through its structured workflow.
