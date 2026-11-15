# IGNIS web build status

**Updated:** 14 Nov 2026, 19:30 PKT (event day 1).
**Milestone reached:** B3 (first visible vertical slice), plus parts of B4 (revision, source inspector, second NASA input) and the A-002 interpretation contract (offline only).
**Nothing is committed, deployed or published.**

## Gates, checked once at session start (master §22.1)
| Gate | Status | Evidence / blocked action |
|---|---|---|
| G1 clock | **Event window open** | Build started 14 Nov ≈17:05 PKT, after 09:00. The deadline is Sun 15 Nov 23:59 in the Team Owner's local time; **the user confirmed the Team Owner is in PKT** (14 Nov). Feature freeze 15 Nov 18:00 PKT (`WIN_PLAN.md`). |
| G2 asset use | **User decision (D-050, 14 Nov)** | The user ruled that pre-event work was research and may all be reused. No organizer ruling was received or is implied. Disclosure stays in `AI_DISCLOSURE.md`. (Earlier status: unresolved, B-01.) |
| G3 instruction | Satisfied | User brief, 14 Nov ("We are moving IGNIS from specification into implementation"), within existing documented permissions. |
| G4 guides | Satisfied | 13 Nov submission and judging guides read (`DOCS/*.pdf`). |
| G5 source subset | Frozen | Catalogue `2026-11-14.r1`; 12 sources, all fetched 14 Nov 12:10–12:25 UTC with SHA-256 (`_raw/event_2026-11-14/acquisition_manifest.json`). The three Saffire PDFs match their inherited expected hashes. |
| G6 review | Assistant-checked only | All 26 assertions are `assistant_checked`. **No independent human review.** |
| G7 delivery | Partial | Stack pinned and building locally. Roster, owner time zone and hosting account are not inspected. |
| G8 live inference | **AUTHORIZED FOR TESTING (D-051), BLOCKED BY KEYS** | The user authorized IE-1 on OpenRouter, Gemini and Groq (cap $5). Compatibility probes: OpenRouter 401 "User not found", Gemini 400 "API key not valid"; there is no Groq key. $0 spent. No configuration is enabled in the app (`MODEL_SELECTION.md` §10). |
| G9 release | **NOT RUN** | No deployment or submission is authorized. |

**What G2 blocks (exact actions):**
- copying pre-event bespoke assets into `web/`: rod transcriptions in `research/data/`, pre-event analysis scripts, `_raw/ui_preview_*`, and the pre-event Groq packets or prompts as runtime data;
- submitting at all, until the team decides on eligibility.

**What was done instead under G2:**
- every registry record was written today from sources fetched today, with exact passages located today;
- the app code is new event-time code.

The *design* still comes from pre-event specification documents written with AI assistance. The judging guide says SI "should not be used to come up with your idea of how to solve the challenge". **This is the team's eligibility decision, not settled here.**

## Stack (actual resolved versions)
- **Runtime:** Node 22.13.1, npm 11.12.1.
- **App:** Next 16.4.6 (App Router, Turbopack build), React 19.3.1, Zod 4.6.7.
- **Tooling:** TypeScript 5.9.3, Vitest 5.1.0, Playwright 1.65.1 using local Chrome (`channel: chrome`), ESLint 9.39.5 (now marked deprecated upstream) with eslint-config-next 16.4.6.
- **Lockfile:** `web/package-lock.json`.

**Environment note:**
- E: is a USB flash drive, so `npm install` stalled there for more than 30 minutes.
- Installs, builds and tests therefore run in a mirror, `F:\ignis extra\web-build`, synced from `E:\Projects\IGNIS\web` by `F:\ignis extra\sync.ps1` (robocopy `/MIR`, excluding `node_modules` and `.next`).
- The **source of truth is `E:\Projects\IGNIS\web`**.
- Tarballs were prefetched with integrity checks, then installed with `npm ci --offline` (75 s on F:).

## Commands executed (in the F: mirror) and outcomes
| Command | Result |
|---|---|
| `npx tsx scripts/validate-catalog.ts` (`npm run validate:data`) | **PASS**: registry valid; 10 investigations (3 profile-only), 16 findings (9 observed results, 6 published-model statements, 1 hypothesis-context), 10 objectives, 12 sources, 12 observations (2 unknown series), 2 models, 10 contracts |
| `npx tsc --noEmit` (`npm run typecheck`) | **PASS** (exit 0) |
| `npx eslint .` (`npm run lint`) | **PASS** (exit 0). It first found 3 real issues (ref mutation, hook-like name, `let`); fixed |
| `npx vitest run` (unit + integration + exports) | **PASS 73/73**: core 10, assess 26, providers 17 (mocked transport), integration 13, exports 7 (19:28 PKT) |
| `npx next build` | **PASS** (8 s) |
| `npx playwright test` (desktop 1366 + mobile 375, production server) | **PASS 7, SKIPPED 1** (full W1→W3 path runs on desktop only, by design) |

**Defects found by screenshot review and fixed, with regression tests:**
- "CO₂" was matching the alias "co" (carbon monoxide);
- ranking rewarded the number of records and marked a non-selected investigation as group 1;
- revision premises were shown as raw IDs;
- a finding linked to two safety areas was duplicated;
- a CSS-grid overflow at 375 px.

## Demonstrated behaviour (application tests, not scientific validation)
**Broad brief (M01):** a three-area research brief with no model required. Example findings:
- spacecraft-scale fires, where gases rather than heat were the larger hazard (S-CAL);
- the Saffire pressure statement (R15);
- SAME detectors missing some smoke types (R09);
- an alarm threshold reached only at 981 s (S-CAL);
- FLEX cool flames (R14).

**Model analyses:**
- **W1, Saffire VI later CO₂ response:** `conditional_model_candidate` / `specified_conditional_comparison` (amendment A-001), with the T1 identity as a specification. Numerical scoring stays `unresolved_requirement` (series not acquired).
- **AC02:** initial-agreement-as-prediction → incompatible.
- **W2, Saffire V:** descriptive check (54.4/29.9 = 1.819397993311; 29.9×1.82 = 54.418 g; +0.018 g rounding effect), the independent-total claim incompatible, and a conditional later comparison with the source window listed as missing.
- **W3:** chemical heat release from the transport model → incompatible. The 497 kJ sensible heat versus 1280 kJ calorimetry figures are shown and no ratio is formed (operator check plus rendered-table check of S-CAL Table 2).
- **AC23, SIBAL second NASA input:** −0.3 g (−0.64 %) descriptive, with the authors' transient caveat.

**Revision:** W1 → W3 records the changed premise, the affected contract and before/now outcomes; the previous assessment is kept as history.

**Exports:** Markdown and JSON come from the same immutable assessment, with the checksum verified before export.

**Interpretation contract:** invented IDs, extra verdict keys and stale envelopes are rejected.

**Handling:**
- an execution request stays `unsupported_action` with its text preserved;
- a missing quantity asks for clarification and keeps the model.

## Known scientific gaps (honest coverage)
**Not acquired, so no finding is asserted from them:**
- the pressure/oxygen paper F02 (publisher redirect only);
- PSI investigation pages (a JavaScript shell; no accession, DOI or file inventory);
- PSI data files;
- SAME-R results;
- BASS/BASS-II results (profile-only).

**Not implemented:**
- published transfer-method candidates (F03, F04);
- the NIST T3 module;
- the rod control;
- recording a new proposed model (operation B, AC14);
- the unit-display conversion test (M22);
- the optional synthesis call;
- the SQLite budget ledger (no paid calls exist).

**Review:** all records are assistant-checked; there is no independent human review.

## SI adapter and evaluation (added 19:30 PKT)
**Implemented:**
- `src/core/wireProposal.ts`: a catalogue-bound closed wire schema with ID enums, and a deterministic wire → proposal mapping;
- `src/server/providers/`: OpenRouter and Groq (OpenAI-compatible strict JSON schema) and Gemini (Interactions) adapters, with injectable transport and the frozen candidate configurations;
- the field guide in the interpretation prompt (contract `ir-v3-2026-11-14`);
- `scripts/eval-ie1.ts`, the runner, with a budget ledger, a retry rule and the test-set freeze;
- `eval/ie1/`: 24 core and 6 supplementary questions, assistant-authored keys and `MAPPING.md`.

**Mock dry run:** it executed end to end, so the scorer correctly fails a fixed browse proposal. **No model has been scored.**

**Registry:** `Q-FLAME-SPREAD-RATE` was added as a definition, with no observation. The catalogue digest is now `f8f5f00b…`.

## Spend and inference
**$0.** No hosted or local inference, account creation, purchase, deployment, publication or message.

## Next concrete tasks
1. **(User decision)** Resolve G2 and the AI-origin question for the submission: ruling, disclosure wording, or stop.
2. **(User decision)** Approve or decline one live interpretation configuration (endpoint, model, data scope, call cap and $ cap) if the "SI-powered" requirement is to be met by live AI. Without it, the app is a typed-form prototype and must be described that way.
3. **(Build, permitted now)** Second safety-area depth:
   - acquire the full SAME paper or the PSI SAME record if publicly reachable;
   - add the M07 partial-pressure contextual calculation, with the basis kept unknown where it is not stated;
   - add the M22 unit-display test.
4. **(Release, needs authorization)** Hosting choice and deployment, then a signed-out test (M29 on a public URL), then the 7-slide or 30-second demo.
