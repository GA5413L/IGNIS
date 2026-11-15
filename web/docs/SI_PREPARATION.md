# SI connection, evaluation and operational handoff

SI means **Scientific Intelligence**. Build .13 has a complete browser proposal-review workflow and server-only Cloudflare transport. The ordinary app remains in structured mode because **no runtime configuration passed/received acceptance**. Keys and environment flags cannot bypass that gate. The owner authorized use of the designated existing token for local research checks and confirmed free-only/BYOK/no-logging settings; replacement remains required for public activation. No deployment was performed.

## Actual execution on 15 November

The designated local RTF was read without printing or saving its token. A read-only Cloudflare management request returned HTTP 403/code 10000, so account settings could not be independently inspected. The owner subsequently confirmed "Require provider credentials" ON, request/response logging OFF, and Groq/OpenRouter free usage with no paid fallback/overage. This is owner verification, not a successful API settings audit.

| Item | Observed result |
| --- | --- |
| Cloudflare -> Groq `openai/gpt-oss-120b`, one compatibility probe | HTTP 200, valid proposal, 1.789 s; 3,151 input / 213 output tokens, including 56 reported reasoning tokens |
| Frozen IE-1 evaluation through the new transport | 10 of 42 planned requests attempted; nine HTTP-200 schema-valid proposals, then one transport failure with no HTTP response |
| Reference checks | Four passed; two interpretation/routing mismatches; three failures reflect the app's unsupported free-text-exclusion handling while the frozen reference expected readiness |
| Concrete interpretation errors | Old investigation retained after replacing the selected model; a published-model comparison routed as generic evidence comparison |
| Returned schema failures | Zero among the nine completed evaluation responses; one request had no completed response. Not a complete first-attempt-structure gate pass |
| Latency | Evaluation p50 1.598 s and p95 2.045 s across ten attempts, including the 5 ms transport failure; probe reported separately |
| Usage across probe and evaluation | 31,778 reported input / 3,096 reported output tokens; failed-call usage unknown |
| Conservative accounting | About $0.008993 across probe/evaluation, using Groq's $0.15/$0.60 per-million list rates and a retained $0.0023688 reservation for the failed call. This is not a bill |
| Expected/billed charge | Expected $0 under owner-confirmed free controls; actual billed charge **NOT VERIFIED** |
| Remaining evaluation calls | **32 NOT RUN**; no retries or tuning after inspecting failures |
| OpenRouter/free, Gemini, public runtime | **NOT RUN**; no accepted runtime model and no deployment |

[Sanitized result receipt](../artifacts/refinement/gateway-evaluation.json). Individual question outputs and answer keys stay in ignored local evaluation storage. The probe and evaluation used only public development/evaluation questions, catalogue definitions, instructions and schema. The existing shared D-051/D-054 ledger was retained; the compatibility probe consumed one of the existing Groq probe allowance. No new budget, paid route, account or billing change was introduced. The original direct-provider configuration remains frozen; this Cloudflare transport is separately identified as `cf-si-2026-11-15.1`, with the tighter 512-token/10-second limits.

**Model choice:** do not activate the tested configuration on this evidence. A successful connection is insufficient, and the incomplete evaluation already contains meaning errors. This is not evidence of general Groq inferiority or another model's superiority. The existing at least 23/24 core-correct, zero-critical-error, first-attempt-structure and owner-acceptance requirements remain. Three application/reference mismatches need transparent reconciliation in a separately versioned evaluation design; do not edit frozen answers to make this run pass.

## Application data flow

`/console#si` -> `GET /api/si/gateway` status/session -> public-data acknowledgement and `POST /api/si/gateway` -> closed interpretation proposal -> full scope review -> explicit confirmation -> local `/api/si/gateway/assess` -> source-linked result/notebook/export.

The model interprets the question; the deterministic assessment produces the scientific result. Numeric conditions, exclusions, ambiguities and unknown terms are kept intact. Unsupported scope blocks confirmation. Request identity, question, catalogue digest/revision and configuration bind responses; edits/cancellation reject late replies. A visitor-bound HMAC signature and 15-minute expiry authenticate the complete receipt at server confirmation. Ordinary `/api/assess` rejects client-created AI provenance; imported historical receipts remain untrusted history, not publicly authenticated authorship. The interpretation receipt records actual returned model, successful-attempt usage/latency, packet digest and reserved tokens. Full attempt accounting remains in the server ledger; an assessment contains its runtime-provenance reference and its entire confirmed proposal. Download the interpretation receipt as well when preserving provider provenance.

User CSV, notebook history and attached analyses are not automatically included in the provider packet. Any text pasted into the question is included after the public-data acknowledgement. Private evaluation keys never enter the packet. Public-data acknowledgement does not make the browser an appropriate place for secrets or unpublished work. The browser never receives provider credentials. No model tools, arbitrary URL fetching, code execution, generated citation or scientific-verdict channel is enabled.

Existing `/api/si` preview and `/api/interpret` behavior are retained. Direct Groq/Gemini preview candidates are historical preparation, not active fallbacks. User-facing terminology is SI; legacy `ai_assisted`, `AI_*` and schema fields remain compatible.

## Routes and limits

Only these fixed provider routes are prepared; they must also appear in the server acceptance list and have verified free-account controls before runtime use:

- Groq: `groq/chat/completions`, model `openai/gpt-oss-120b`, low reasoning, reasoning text excluded, temperature 0, strict closed JSON schema.
- OpenRouter: `openrouter/v1/chat/completions`, `openrouter/free`, zero price ceilings, required parameters, no provider fallback and `data_collection: deny`. This router can change actual model identity. It is **not accepted or live-tested here**; do not substitute a pass from one sampled underlying model for acceptance of all future router outputs.

All requests go to the configured account/gateway under `https://gateway.ai.cloudflare.com/v1/`. The supplied gateway ID is exactly `webiste-chatbot`. The backend uses `cf-aig-authorization`, BYOK alias `default`, `cf-aig-no-wholesale: true`, `cf-aig-skip-cache: true`, both logging headers false, `cf-aig-max-attempts: 1` and a gateway timeout shorter than the backend timeout. Redirects are rejected. No direct-provider Authorization header is forwarded.

| Control | Bound |
| --- | --- |
| Question / HTTP request body | 2,000 characters / 32 KiB |
| Complete provider packet / response | 64 KiB / 32 KiB |
| Generated tokens / attempt timeout | 512, including reasoning / 10 seconds |
| Attempts per interaction | At most two, across eligible routes; never a silent paid retry |
| Concurrent running or unresolved interactions | Two globally |
| Signed visitor quota | Two per rolling minute; ten per UTC day |
| Global request quota | Twenty per rolling minute; 100 per UTC day |
| Global token reservation | 500,000 per UTC day; whole UTF-8 packet bytes plus 1,024 framing tokens and output allowance, reserved for both attempts |

Reservations remain for the day even when reported usage is lower. Transport/timeouts retain concurrency holds, including after a successful fallback; these do not expire automatically. HTTP 429 respects Retry-After; 5xx/transport failures back off; 401/403 disable a route; 402 or positive reported cost halts dispatch. Invalid schema/ID, refusal, truncation or wrong returned model does not trigger a semantic retry. Free-account controls are independent of these code limits: headers/local estimates are not a provider invoice guarantee.

Origin and content type are checked against server configuration. A signed HttpOnly SameSite=Strict visitor cookie reduces casual quota evasion; global quotas still apply when cookies are replaced. A keyword prefilter reduces accidental off-topic questions but is not a semantic security guarantee. The closed output schema, capability checks and deterministic answers constrain what the system can do. Public mode also requires HTTPS, a rotated token and server-verified Turnstile hostname/action. Provider outages and deliberate quota exhaustion can reduce availability; no claim of abuse immunity is made.

## Configuration and deployment constraints

See [.env.example](../.env.example). Set server variables through the hosting environment or a designated private local environment file. Never use `NEXT_PUBLIC_` or commit a credential. `CF_SI_SIGNING_KEY` needs an unpredictable secret of at least 32 characters. `CF_SI_QUOTA_DB` must be an absolute SQLite path outside publicly served/build/Git directories; use durable storage outside the repository. In-memory quota stores are test-only and fail runtime readiness. SQLite files/journals are ignored by Git.

SQLite transactions coordinate processes sharing **one actual durable file**. Separate serverless/container disks are not a shared quota service. The implementation is suitable for a Node process deployment with that storage arrangement; a distributed deployment needs an explicitly implemented and tested shared-store adapter. Setting the verification flag does not create one. The Node SQLite module is experimental in the tested Node version.

Do not expose an admin/reset endpoint. If an unresolved call consumes a slot, inspect provider usage/requests and the server attempt ledger before a controlled operator reconciliation. A restart/new database must not discard reservations. Preserve an audit record of any manual resolution. No automatic "clear all quotas" recovery is provided.

The owner's local token-use override does not waive public rotation or semantic acceptance. Source sharing remains authorized; deployment, billing changes, competition submission and outreach remain separate.

## Reproduce the checks

`tests/unit/gateway.test.ts` covers readiness, strict origin/session checks, closed input and topic rejection, full-proposal preservation, invalid IDs, bounded responses, public Turnstile validation, fixed routes/headers, fallback bounds, cooldowns, auth/billing stops, timeout holds and two-connection SQLite concurrency. Browser tests cover the default unavailable state and the mocked complete review/confirm/export lifecycle. These are software tests, not proof of scientific or model accuracy.

`gateway-probe.ts` and `gateway-evaluate.ts` are owner-workspace research runners, not portable production launch scripts. They require explicit execution and the designated token-file path, use the existing canonical shared ledger, record scope before inference and keep keys local. A new invocation is not permission to repeat this failed/incomplete evaluation, change its scope, refresh a budget or ignore held usage. The partial outcome above is the current measured state.

The runners now additionally reject another invocation of this already-attempted frozen gateway evaluation. They conservatively count every retained attempt toward the 60-call model ceiling, all canonical-ledger/legacy attempts toward 240, and require the planned reservations to fit an additional $2 ceiling alongside the pre-existing shared ledger. These are stricter bounds, not new spending authorization; no additional inference was run to test them.

Current provider documentation: [Cloudflare BYOK](https://developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys/), [unified billing guard](https://developers.cloudflare.com/ai-gateway/features/unified-billing/), [logging](https://developers.cloudflare.com/ai-gateway/observability/logging/), [request handling](https://developers.cloudflare.com/ai-gateway/configuration/request-handling/), [Groq model/rates](https://console.groq.com/docs/model/openai/gpt-oss-120b), [Groq structured output](https://console.groq.com/docs/structured-outputs), [OpenRouter routing](https://openrouter.ai/docs/guides/routing/provider-selection).
