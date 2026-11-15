# IGNIS SI (AI) selection: research, frozen evaluation plan and recommendation

> **Current status, 15 November 2026, build .13:** the owner designated a Cloudflare gateway token and verified free-only/BYOK/no-logging account settings. One Groq compatibility probe succeeded. A separately recorded Cloudflare configuration attempted 10/42 frozen evaluation calls: nine schema-valid responses, two actual interpretation errors, three application/reference handling mismatches and one transport failure. Four reference passes; 32 calls NOT RUN. No configuration is accepted and runtime interpretation stays disabled. See [current SI handoff](SI_PREPARATION.md) and [sanitized receipt](../artifacts/refinement/gateway-evaluation.json). Earlier prices, candidate rankings, account states and “NOT RUN” statements below are dated historical records, not the current outcome. Frozen questions/keys and cumulative accounting were preserved.

**Date:** 14 Nov 2026, ≈19:00 PKT (event day 1).
**Status:** research and offline engineering only. **No inference has been run.** Every price or capability below is either *checked today* (with its source) or marked *as recorded 8 Nov, not rechecked*. Costs are **estimates** from stated assumptions, not measurements.

## 1. What SI does in IGNIS and what it never does
The challenge asks for "an interactive, super intelligence (SI) powered dashboard that summarizes, ranks, and interprets" combustion findings (challenge statement, `_raw/event_2026-11-14/challenge_gql.json`). IGNIS uses SI where language understanding is the hard part. Evidence and verdicts stay deterministic.

| Role | What the model does | What decides the result | Status |
|---|---|---|---|
| **R1 Interpreter (core)** | Turns the user's free-text question into the closed `InterpretationProposal` (intent, investigations, model, quantities, scope, exclusions, ambiguities). The user confirms or edits it. | App: allow-list validation → `deriveHandling` → contract engine | Contract, schema and handling implemented offline. Adapter and evaluation harness: this document's plan. |
| **R2 Verified insight summary (new)** | Writes a short plain-language summary of a finished brief or assessment, citing record IDs. | A verifier blocks any sentence that does not cite a record in the evidence closure, contains a number not printed in a cited record, or uses forbidden claim language (safe/unsafe, validated, predicts, causes, confidence %). On failure the template text is shown. | Planned |
| R3 Embedding search | — | — | **Not adopted.** Curated aliases cover the 10–25 investigations in scope. A second model and evaluation would need a demonstrated retrieval miss first. |

**Never:** model-written numbers, verdicts, safe/unsafe labels, causal claims, new physical predictions, training or fine-tuning, autonomous agents or tool loops, or AI-generated images.

**Why this split scores:**
- *Relevance:* the dashboard is visibly SI-powered: you can ask in plain English and get a plain-English summary.
- *Validity:* the SI cannot invent evidence, because IDs are constrained to the live catalogue and every result comes from reviewed records.
- *Creativity:* "SI that is structurally unable to fabricate" is the story, and a demo can show it, for example with the quoted-instruction case F24.

## 2. Facts checked today (14 Nov 2026)
| Fact | Value | Source (fetched 14 Nov) |
|---|---|---|
| Claude prices, per million tokens (input / output / cache hit) | Opus 5.5: $4 / $20 / $0.20. Sonnet 5.5: $2 / $10 / $0.10. Haiku 5.5: $0.10 / $0.50 / $0.01 for prompts ≤100K tokens. | platform.claude.com/docs/en/about-claude/pricing |
| Anthropic availability | **Pakistan listed** for Claude.ai and the API; policy **effective 12 Nov 2026** | anthropic.com/supported-countries |
| Gemini prices (paid tier, per million tokens) | gemini-3.5-flash-lite: $0.30 / $2.50.<br>gemini-3.6-flash and gemini-3.8-flash: $0.75 / $3.75 until 31 Dec 2026.<br>gemini-4-hydrogen: $1.50 / $7.50.<br>gemini-4-carbon and -argon: $2 / $10 until 30 Nov. | aistudio.google.com/docs/pricing |
| Gemini free tier | It exists for several models, but **free-tier data is used to improve Google products**. | same page |
| Gemini availability | **Pakistan listed** (page undated) | aistudio.google.com/docs/available-regions |
| Gemini structured output | Interactions API `response_format{type:text, mime_type:application/json, schema}`. Supported: `enum`, `anyOf`, `additionalProperties`, enforced `minItems`/`maxItems`. **`minLength`/`maxLength` are silently ignored.** Large or deep schemas may be rejected with 400. | aistudio.google.com/docs/structured-output |
| Claude structured output | `output_config.format` JSON schema. Supported: `enum`, `anyOf`, `$ref`. `additionalProperties:false` is required on every object. **Not supported:** length, numeric and complex array constraints, or recursion. The first request compiles the schema, which is then cached for 24 h. `stop_reason:"refusal"` or `max_tokens` can break the shape. | Claude API reference bundled with Claude Code 2.1.323 (`shared/tool-use-concepts.md`) |
| Claude request rules | API version 2026-10-21 rejects `temperature`, `top_p` and `top_k`, and prefill is not supported.<br>Opus 5.5: thinking is always on; set `output_config.effort` (default medium).<br>Sonnet 5.5: thinking is off only via `thinking:{type:"between_tools"}`.<br>Haiku 5.5: `thinking:{type:"disabled"}` is allowed at effort ≤ high. | same reference (`shared/models.md`) |

**As recorded 8 Nov, not rechecked today** (`IGNIS_Runtime_AI_Selection_and_Cost_Decision.md` §3):
- Anthropic: commercial API content is not used for training without opt-in; inputs and outputs are deleted within 30 days, with exceptions.
- Gemini paid tier: abuse logging retains data for 55 days. The Developer API terms restrict apps likely to be used by under-18s.
- OpenAI Luna/Sol and Groq rates.

**Credentials present (presence only, never read or used):**
- `GEMINI_API_KEY` and `OPENROUTER_API_KEY` are set; their tier and credit are unknown.
- `ANTHROPIC_API_KEY` is **not set**.

Presence is not authorization.

## 3. What earlier evidence shows
- **Only Groq was ever run** (8 Nov). G20 `gpt-oss-20b` scored 13/24 and G120 `gpt-oss-120b` scored 9/24; both failed the ≥23/24 gate.
- GEM, LUNA, SOL and HAIKU were configured on paper and **never run**.
- **No configuration has yet passed IGNIS's interpretation task.**

The failures were semantic: quantity substitution, lost scope, assumed models and missing clarifications. That is why the IR2 repair moved enforcement into the schema and the application rather than relying on prompt wording.

## 4. Engineering that makes any model safer (provider-neutral)
1. **Catalogue-bound schema (new).** Each ID field becomes an `enum` of the live catalogue IDs of the right kind: investigations, models, events, quantities, endpoints and findings/sources. Under constrained decoding the model **cannot emit an invented ID**.
   - Local Zod and allow-list validation still runs, because enum casing is not guaranteed and lengths are not enforced.
   - The schema is generated per catalogue revision, and its SHA-256 is recorded with each call.
2. **Prompt caching** of the system prompt plus catalogue prefix: cache hits cost 0.05× input on Opus/Sonnet 5.5.
3. **Failure paths are never parsed as success:**
   - refusal, `max_tokens`, a timeout or schema failure leaves AI unavailable for that question, and the typed form remains;
   - semantic or schema failures are never retried;
   - transport errors, 429 and 5xx get one retry.
4. **Envelope check:** a reply bound to an older draft, catalogue or config is discarded (implemented, test M16).
5. **No automatic cross-provider fallback.** One accepted configuration; otherwise the typed form.

## 5. Candidates
**Token basis:** sizes were measured today with the shipped code:
- prompt: 1,370 chars;
- catalogue context: 2,878 chars;
- JSON schema: 4,563 chars;
- total ≈ 8.8K chars, about 2.5–3.5K tokens.

**Assumed** after registry expansion: 6K input tokens. Output is 0.8–2K tokens including thinking. These are assumptions until usage is recorded.

| ID | Model and settings | Est. cost per call (uncached → cached prefix) | Role |
|---|---|---|---|
| **C-OPUS** | `claude-opus-5-5`, effort `low`, structured output, non-streaming, `max_tokens` 4096, official `@anthropic-ai/sdk` | $0.040–0.064 → $0.017–0.041 | Primary candidate: strongest instruction following, and the subtle distinctions are where earlier runs failed |
| **C-HAIKU** | `claude-haiku-5-5`, thinking disabled, effort `low`, same schema | ≈ $0.001 | Low-latency, low-cost alternative on the same key |
| C-SONNET | `claude-sonnet-5-5`, thinking `between_tools`, effort `low` | $0.020–0.032 | Middle option; test only if C-OPUS latency is too high **and** C-HAIKU fails |
| C-GEM38 | `gemini-3.8-flash`, Interactions API, minimal thinking, `store:false` | ≈ $0.007–0.012 | Distinct-provider option. **Only with the existing key if the user confirms it is paid tier**, because free tier trains on prompts. |

**Excluded:**
- Groq G20/G120: failed 8 Nov.
- Local Qwen: cannot serve a public judge URL.
- OpenAI Luna/Sol: no key.
- OpenRouter: an extra data intermediary over an OpenAI-compatible shim. Use it only if the user explicitly prefers it to an Anthropic key.

## 6. Frozen evaluation IE-1 (frozen and hashed before any call)
**Questions:**
- **24 core questions:** the IR2 fresh set F01–F24 (`_raw/interpreter_failure_audit_2026-11-08/fresh_public_questions.json`), mapped to this registry (`saffire_vi_fds`→`PM-SVI25`, `saffire_vi`→`INV-SAFFIRE-VI`, `saffire_v_fds`→`PM-SV24`, `saffire_v`→`INV-SAFFIRE-V`).
  - F08–F10 referred to a synthetic alignment example that this registry does not contain. They are rewritten onto PM-SVI25's documented initial-value alignment (`USE-SVI25-INIT`), keeping each case's purpose: later change, later level excluding the matched point, and the matched level as an independent prediction.
  - Mapping and rewrites are listed in `web/eval/ie1/MAPPING.md`.
- **6 supplementary research-brief questions** (Moon-base atmosphere, detection overview, cool flames, cross-flight comparison, Earth applications, SAME-R), reported separately and not in the gate.

**Keys:**
- They were hand-authored by the assistant. They are **not independent**.
- They are kept local and are **never provider input**; the provider sees only the question, the explicit selection and the public catalogue.

**Scoring:** the IR2 rubric dimensions M (meaning), C (clarification), R (routing) and S (structure). **Critical errors:**
- substituting a quantity (sensible ↔ chemical heat; source total ↔ remote concentration);
- including an explicitly excluded item, or losing an explicit independence request;
- replacing the selected model unasked, or assuming one;
- turning an execution request into a proposal, or the reverse;
- any verdict or result text;
- obeying a quoted instruction (F24);
- an invented or wrong ID that changes meaning.

**Run protocol:**
- 24 distinct calls, then 6 repeat IDs (F02, F04, F08, F12, F14, F21) × 2, giving **36 calls per configuration**;
- sequential;
- record the returned model ID, usage, latency, stop reason and output SHA-256.

**Gate (unchanged from IR2):**
- **≥23/24 core raw-correct;**
- **zero critical errors in all 36 calls;**
- native structure valid on the first attempt.

Latency (p50 and p95) and cost are reported for the user's choice; they are not part of the gate.

**Proposed caps:**
- C-OPUS ≤ $3;
- C-HAIKU ≤ $0.25;
- C-SONNET ≤ $1.50;
- C-GEM38 ≤ $0.50;
- **total ≤ $5**, including development probes (≤ 6 per configuration).

## 7. Recommendation (pending the gate)
1. Test **C-OPUS and C-HAIKU** in one approved session; they need one Anthropic key.
2. Adoption follows the gate. Among passing configurations **the user chooses**. The assistant's recommendation is C-OPUS if its median latency is acceptable for the demo, because a wrong interpretation in front of a judge is the costliest failure. C-HAIKU is the choice if latency dominates.
3. R2 summaries use the adopted Claude model. They have their own 10-case faithfulness check: the verifier must pass 10/10, and blocked sentences are never shown.
4. If nothing passes, the app ships the typed form and must be described as such; it may not claim to be SI-interpreted.

## 8. Public-demo spending controls (before any deploy)
- per-IP limit (proposed 6/min, 40/day);
- global daily call cap (proposed 400);
- a server budget ledger with a hard stop that drops to the typed form, labelled "AI unavailable";
- a provider-side workspace spend limit, set by the user in the Anthropic Console.

**Proposed worst case:** 400 × $0.064 ≈ $26/day on C-OPUS, or ≈ $0.40/day on C-HAIKU.

## 9. Decisions needed from the user
1. Provide an Anthropic API key, exported in the shell only and never committed, and **approve IE-1** on C-OPUS and C-HAIKU with the caps above.
2. Optionally, approve using the existing `GEMINI_API_KEY` for C-GEM38, after confirming it is paid tier.
3. Choose hosting and approve deployment (gate G9). Separate approval.

## 10. Live status, 14 Nov 2026 ≈19:25 PKT
**User authorization (D-051):** test the OpenRouter, Gemini and Groq routes, with a total cap of $5.

**Compatibility probes run** (3 unscored dev questions per configuration; nothing from the test set):

| Configuration | Result | Spend |
|---|---|---|
| OR-HAIKU55, existing `OPENROUTER_API_KEY` | HTTP 401 `"User not found."` on all 3 probes: the key is well formed (`sk-or-…`, 73 chars) but its account is gone or revoked | $0 |
| GEM38-LOW, existing `GEMINI_API_KEY` | HTTP 400 `"API key not valid"` on the first probe: well formed (`AIza…`, 39 chars) but rejected | $0 |
| Groq | Not run: no `GROQ_API_KEY`, and the encrypted research key is not decrypted | $0 |

**The IE-1 test itself has not run.** The test set is not yet frozen by a live run, and no model has been scored.

**Unblocking:**
1. Put valid keys in `F:\ignis extra\keys.env`, outside the repo, one `NAME=value` per line: `OPENROUTER_API_KEY`, `GEMINI_API_KEY` and/or `GROQ_API_KEY`. The runner reads this file before the stale environment variables and never prints the values.
2. **Recommended route:** the official Global Offer from Google Cloud ($300 credit for 90 days, no auto-charge, per the user-pasted offer text). A Gemini key created on a billed Cloud project is paid tier, so prompts are not used for training. The same credit can host the app on Cloud Run, so one offer covers both the SI and the judge URL. Account creation and claiming the offer are the user's actions.

**Mocked-transport tests** (`tests/unit/providers.test.ts`, 17 tests) pass. They cover:
- request shapes;
- refusal, truncation, empty, non-JSON and timeout handling;
- the retry rule;
- the closed schema;
- enum IDs;
- the scorer's critical rules.

These prove plumbing, not model quality.
