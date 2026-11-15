# IGNIS local application

**Working from GitHub:** see [the team setup guide](../CONTRIBUTING.md). Run `npm ci`, `npm run dev`, and `npm run test:team` from this directory. The source push is authorized; website deployment remains separate. Local review ZIP links in historical reports refer to the owner's retained artifacts and are intentionally absent from GitHub.

IGNIS connects NASA fire experiment profiles, published atmosphere coordinates, stored detector readings and source-based model assessments. Working project name: IGNIS. Team: Emberfall. Independent NASA Space Apps 2026 project; not affiliated with or endorsed by NASA.

**Current local build: web-2026-11-15.5.** The [competitor refresh and adversarial audit](docs/CODEBASE_AUDIT_AND_COMPETITOR_DELTA_2026-11-15.md) records 37 refreshed public heads (18 changed), reproduced scientific/workflow defects and repairs. Verified: 341 offline checks and 49 production browser checks passed, one duplicate skipped; 22 affected notebook checks passed after the final readability fix. Eight current visual states are clean. No live inference or publication occurred.

## See the interface

- [Current revision detail](artifacts/previews/audit-patch/desktop-revision.png)
- [Current mobile notebook](artifacts/previews/audit-patch/mobile-notebook.png)
- [Current cutoff workflow](artifacts/previews/audit-patch/desktop-cutoff.png)
- [Current local review ZIP](artifacts/IGNIS-local-review-2026-11-15-audit-patch.zip)

- [Previous cutoff-range preview](artifacts/previews/cutoff-patch/desktop-cutoff.png)
- [Previous mobile cutoff preview](artifacts/previews/cutoff-patch/mobile-cutoff.png)
- [Exact bound plot](artifacts/previews/cutoff-patch/desktop-cutoff-plot.png)
- [Previous cutoff-patch ZIP](artifacts/IGNIS-local-review-2026-11-15-cutoff-patch.zip) and [manifest](artifacts/CUTOFF_PATCH_REVIEW_MANIFEST.json)
- [Desktop preview](artifacts/previews/desktop-explore.png)
- [Atmosphere comparison](artifacts/previews/desktop-conditions.png)
- [Smoke lab](artifacts/previews/desktop-smoke.png)
- [New paired cohort audit](artifacts/previews/research-patch/desktop-paired.png)
- [Session recheck](artifacts/previews/research-patch/desktop-session.png)
- [Data and methods](artifacts/previews/research-patch/desktop-data-methods.png)
- [Mobile preview](artifacts/previews/mobile-explore.png)
- [Seven-page briefing PDF](artifacts/IGNIS-briefing-2026-11-15.pdf), or [printable HTML](public/briefing.html)
- [Previous build-3 review ZIP](artifacts/IGNIS-local-review-2026-11-15-research-patch.zip) and [file/check manifest](artifacts/RESEARCH_PATCH_REVIEW_MANIFEST.json) (dated snapshot, not a published release)

The images are captures of the local application. Run the server to use filters, comparisons, source inspectors, revisions and downloads.

## Start locally

Node.js 22.13 or later is required. The lockfile pins the application dependencies.

```powershell
Set-Location 'E:\Projects\IGNIS\web'
npm ci
npm run build
npm run start -- -H 127.0.0.1
```

Open `http://127.0.0.1:3000`. No API key is needed for the implemented research workflows. `npm ci` downloads dependencies; the app's source collections are local. No deployment is performed by these commands.

On this workstation the existing, tested copy with installed dependencies is on F: because E: is slower. Start that copy without reinstalling:

```powershell
Set-Location 'F:\ignis extra\web-build'
& 'C:\Program Files\nodejs\node.exe' 'node_modules\next\dist\bin\next' start -p 3000 -H 127.0.0.1
```

Keep that terminal open; Ctrl+C stops the server. E: remains the source of truth. A local launcher is provided as [Start-IGNIS.cmd](Start-IGNIS.cmd) for this workstation's existing F: build.

## What to try

1. **Explore:** search the 24-profile investigation atlas; open the source inventory or reviewed bank profile. Objectives, file counts and reviewed findings remain distinct.
2. **Conditions:** compare the two-sided PMMA cohort with 34 mole% oxygen and 56.5 kPa. Select “Show a two-axis tradeoff” to inspect how changing the target changes the frontier. Export both the source values and the comparison. Flow is excluded because of the documented publication conflict.
3. **Smoke lab:** select Kapton and keep ISS scatter at the descriptive 2 V cutoff. The result is 20/35 finite readings below cutoff, one blank cell, and 36 total source rows. Inspect AW50 or export all selected source cells. “SAME #” is a separate identifier from “Test ID.”
4. **Research brief:** prepare a detection/prevention brief with its exact selected analysis attached, confirm the structured request, and inspect a source passage. The selected result is preserved in the view and Markdown/JSON. Suppression remains available in the broad brief and the complete-extinction example.
5. **Model assessment:** run the example about Saffire VI's later CO₂ response, then revise it to the chemical-heat-release question. The model stays fixed; the requested claim and its assessment change. Markdown and JSON preserve the same assessment.
6. **Paired cohort audit:** in Smoke lab, choose the paired view. At the two declared default cutoffs, 133/134 rows are jointly finite. The descriptive A-minus-B difference is +70/133 pooled, −6/25 in flight 1 and +76/108 in flight 2. Toggle the literal recorded-n fan filter to see how excluding unrecorded status fields removes a whole flight. This is not an alarm or detector-superiority result.
7. **Research notebook:** download a session or save it manually in this browser. Import/recheck compares source, method and result fingerprints before loading. Recipes preserve attached selections and up to 16 assessments; keep the separate assessment JSON for original result/row bytes.
8. **Data & methods:** inspect professional Saffire data roles, the ML readiness decision and four exact source opportunities. New acquisitions remain subject to quantity, lineage and clock checks.
9. **Cutoff-range audit:** use the Explore robustness card or the third Smoke lab view. Default independent [1,3] V ranges give pooled [66,78]/133, Flight 1 [-6,-3]/25 and Flight 2 [72,81]/108. Widen to [0,5] V to expose a pooled sign change. Inspect exact corner witnesses, equality ties, missing completions and source cells; attach the result to a brief.
10. **Scenario links:** create a link from any of the four source analyses. A clean browser reopens the exact selection and reports source/method/result drift. It preserves existing draft/history and includes any exclusion notes. Notebook files carry recipes/receipts; assessment JSON preserves original result bytes. Localhost links work on this workstation.

The brief registry has ten investigations and sixteen findings. The separate atlas, condition cases and detector rows are not silently promoted into new model-validation evidence. A condition-gap frontier is not a system-performance frontier or a fire prediction.

## Verification and research reuse

```powershell
npm run validate:data
npm run typecheck
npm run lint
npm run test:unit
npm run test:integration
npm run test:exports
npm run build
npm run test:e2e
```

The supplied build/dev scripts explicitly use webpack: the previous Turbopack path changed 50 imported detector numbers. Keep the exact source-consistency guard; do not substitute an epsilon. Browser checks use installed Google Chrome. Source-curation checks also require the pinned local `_raw/` archive; they do not fabricate missing source bytes. See [research reuse](docs/RESEARCH_REUSE.md), [current build status](docs/BUILD_STATUS.md) and [verification record](docs/LOCAL_VERIFICATION_2026-11-15.md).

The review ZIP intentionally excludes frozen IE-1 evaluation fixtures. Its public app checks can be run with `npx vitest run tests/unit tests/integration tests/exports --exclude tests/unit/providers.test.ts`; the excluded provider/IE-1 test file needs the original controlled local fixtures. The full 341-check result was obtained in the complete workspace. Source archives needed by curation scripts are also excluded.

`GET /api/evidence` documents the four read-only collections and their parameters. Application data is validated; exports keep source versions, original values, missingness and conflicts. The API makes no upstream requests.

## Interpretation and release state

The [current competitive comparison](docs/CODEBASE_AUDIT_AND_COMPETITOR_DELTA_2026-11-15.md) and [coverage ledger](docs/COMPETITOR_COVERAGE_2026-11-15.csv) distinguish focused source reviews from broad screening. The [earlier comparison](docs/COMPETITIVE_COMPARISON_AFTER_BUILD_2026-11-15.md) is a dated snapshot whose save/replay gaps were subsequently addressed; no overall competitive lead is established.

The preceding [professional research and improvements report](docs/PROFESSIONAL_RESEARCH_AND_IMPROVEMENTS_2026-11-15.md) records build-3 research, the cohort audit, selection handoff and session recheck. Its 280 offline / 27 browser results and seven-slide briefing remain historical snapshots. Current checks establish software behavior, not independent scientific validation or competitor superiority.

The structured workflow is active. Live AI interpretation is disabled because no current configuration has completed the required scored evaluation and user acceptance. [API shortlist](docs/API_SHORTLIST_2026-11-15.md) and [evaluation readiness](docs/API_EVALUATION_READINESS.md) preserve the existing caps, used probes and cumulative budget ledger. Do not place credentials in source code, a browser bundle, a shared archive or chat.

Publication is held under the user's existing instruction. The original-code license, final public URLs, team credits and submission confirmation remain owner release items. [AI disclosure](docs/AI_DISCLOSURE.md), [source rights](docs/SOURCE_RIGHTS.md) and [submission copy](docs/SUBMISSION_PACKAGE_2026-11-15.md) disclose substantial AI assistance and pre-event preparation. No independent scientific validation, measured competitor superiority, NASA adoption or award is claimed.
