# Competitor re-audit and cutoff-range patch — 15 November 2026

IGNIS now adds exact cutoff-range sensitivity and source-bound scenario links to the existing notebook/brief workflow. The strongest public competitors already have substantial evidence, analysis, replay and evaluation implementations. We are not ahead on every axis, and this review does not establish a win, independent scientific validation or NASA adoption.

Local build: **web-2026-11-15.4**. Open **http://127.0.0.1:3000**, then **Test a finding’s robustness**, or **Smoke lab → Cutoff-range audit**. The earlier build-3 report and briefing remain dated snapshots.

## Coverage and what “deep” means here

The [per-repository coverage ledger](COMPETITOR_COVERAGE_2026-11-15.csv) contains **282 discovered repositories**, including **244 acquired READMEs** and **200 README challenge-phrase matches**. These are not verified counts of distinct registered entrants: repositories can be forks, related projects, historical work or multiple repositories for one team. The official public team directory was not successfully enumerated; private, unindexed and newly changed submissions remain unknown.

The three expanded GitHub searches were `"flame in freefall"` (179 results), `"microgravity" "2026"` (76) and `"NASA" "combustion"` (161), with all returned pages for those query totals acquired. Earlier discovery and primary-web discoveries were merged; FLARE-X surfaced separately after the bulk pass. Searches describe the public index at acquisition time, not an exhaustive entrant roster.

- **246 candidates received bounded archive probes**, and FLARE-X received a pinned raw-source review. The first wave used a 6 MiB archive limit; a second, smaller 2 MiB wave covered candidates deferred by the first wave's total transfer cap. Large, unavailable and incomplete captures remain explicit. No archive size or file-priority cap is presented as a complete repository audit.
- **171 distinct repositories have root-captured commit-pinned archives.** Specialist direct-source/browser captures and four additional bounded archive captures supplement these. Capturing source files is not semantic review or validation.
- **37 repositories received focused pinned implementation/evaluation reviews.** Depth varies by path: active request routes, data and units, formulas, labels, model splits, scoring, saved predictions, tests, public artifacts and selected browser flows. The reports identify exactly what was checked. No competitor dependencies, models, inference endpoints or training scripts were executed.
- The coverage ledger distinguishes focused review, bounded capture, README-only screening and metadata-only records. A “validated” name or citation token does not by itself establish source entailment or independent accuracy.

Detailed source witnesses: [physics/model review](lab/14_competitor_physics_round2_2026-11-15.md), [product/workflow review and breadth supplement](lab/15_competitor_product_round2_2026-11-15.md), [AI/evaluation/model review](lab/16_competitor_evaluation_models_round2_2026-11-15.md), [additional implementation audit](lab/17_additional_source_audit_2026-11-15.md). Raw acquisition logs, failed accesses, hashes, exact pins and structured claim ledgers are under `_raw/competitive_round2_2026-11-15/` in the project root. They remain local research artifacts.

## The comparison after checking implementation

The rows below summarize the focused reviews; the linked reports carry file/line witnesses and limitations. “Exists” describes inspected source or the stated captured artifact, not an independently verified deployed backend.

| Project | Substantive capability found | Limit and consequence for IGNIS |
|---|---|---|
| MARGIN | Condition matching, comparability and seven updated Saffire cases; latest head reviewed. | Our updated Saffire source/conflict handling is not unique. Compare task completion and claim discipline, not record totals. |
| HALO | Recorded-channel analysis and a concrete FLEX classifier. | Its target/splits and the distinction between voltage and alarm performance remain material. Detector percentages alone do not distinguish us. |
| IGNIS LAB | Droplet-history fitting, published-versus-refit comparisons and grouped/stress evaluation. | A stronger quantitative model baseline; separate project and naming collision. |
| Flamefall | Grouped evaluation, saved predictions and fuel-transfer stress tests; weak solid estimator withheld. | Ahead of IGNIS on predictive artifacts. Transfer performance is narrower than a single pooled score. |
| PYRION | Substantive models, scientific contracts, audit outputs and improved geometry/gravity records. | Fresh validation reports 0 blocker/1 major/131 minor issues on 10,022 records; the older major-issue count is obsolete. Record count is not independent experiments or scientific validation. |
| FLARE-X / ALPINE IBEX | Current 200-row corpus and report-held-out/nested evaluation artifacts, with explicit limitations. | Old 145-row search-cache claims are stale. Fixed-model accuracy .84 vs .815 majority coexists with balanced accuracy about .403. Nested-search accuracy .255 concerns the full selection procedure, a different estimand. Rare-class and selection limitations matter. |
| FIRE-X | Broad ingestion, SQL and visualization implementation. | Interpolated/planned records and imputed physical fields need separate treatment; canonical row counts are not measured-test counts. |
| z1xO Flame in Freefall | Reduced spread model and transient reactive-transport implementation. | Explicitly unvalidated; assumed-parameter Monte Carlo bands do not establish empirical prediction coverage. |
| AERO-IGNIS / Joshua | RF/GBR/CNN and sensor-classifier code/artifacts. | The inspected CNN/sensor 100% artifacts concern training on generated inputs, not held-out NASA detector validation. |
| VESTA | Portable receipts, replay and source/method/result identity; public evidence workflow. | Latest source and deployed evidence-module bytes differ. Credit the deployed workflow, but do not assume a pin certifies the backend. Generic provenance is not unique. |
| MORS AEGIS | Measurement plots, stored recipes/replay and bilingual navigation. | Ahead on some analysis presentation and reuse flows; source implementation is not a common-task performance win. |
| FlameBound | Source-cell matching, scenario URLs, reports and bounded question/brief paths. | A useful exact-scenario handoff baseline. Its declared ranking still depends on selected metrics/weights and admitted data. |
| MicroFire Atlas | Guided research journey and a real downloadable, versioned planning artifact. | Published AI checker rescoring is not a new model run or semantic validation. Still ahead on an explicit question-to-plan journey. |
| MicroFire V2 | Small admitted corpus, source-role discipline, claim support and campaign workflow. | Stale Passport wording conflicts with the advertised playable missions; that does not prove missions fail. A small corpus can support a coherent tool. |
| SPICA | Source rows, printable briefs and next-test selection. | Separate marginal condition ranges do not prove joint coverage. Its planning UX remains a useful comparator. |
| ZERO FLARE | Broad source/model workspaces and saved-work packets. | No claim that all scientific models were validated. Breadth and navigation remain competitive strengths. |
| FLARENEXUS | Real routes and a clearly disclosed synthetic prototype. | Synthetic data are expressly labeled; do not call the disclosure hidden fabrication. Demonstration breadth is not empirical performance. |
| Sayeed's page | Polished interface and export behavior. | The inspected source hardcodes the 1,482-test headline, implements the “neural” score with thresholds and generates NASA-CR identifiers. These are concrete provenance/authority problems, not a measured accuracy verdict. |
| Firebreak | Connected scenario → evidence → dossier/JSON/print/link workflow. | Its four-role “court” is rule-based summarization, not independent scientific agents. The coherent dossier workflow is still valuable. |
| AegisμG | Source-located 20-test/43-segment Table 5.1 atlas; 39 numeric rates and four explicit nulls. | Preserves missing segment oxygen and dependence warnings. Hypothetical 0D/replay outputs are disclosed separately; this is a serious scope comparator. |
| Fireline Atlas | Local optical-boundary extraction with irregular NASA timestamps and linked export; 129-record CO status handling. | Optical extraction itself is not validated flame-front ground truth. It offers a useful measurement workflow absent from IGNIS. |
| PYRA | Reviewed transactional ingestion, comparison/report modules and answer checks. | The old planning-phase README understates the implementation. Its ingestion/workflow depth is a real gap for us. |
| AstroLab | Custom physics/model outputs distinguished from provided-source inputs. | Default source CSV is absent from the inspected archive; installer/runtime acquisition is unknown. Do not equate modelled values with NASA measurements. |
| Fire Readiness | Curated loader exists despite a stale “mock” README. | Predictor, ranking and report paths inspected are explicitly stubbed. Separate real data loading from unfinished analysis. |
| Kenyalang Blue Flame | Saved 100-question live evaluation with failures, latency/usage diagnostics and disabled response cache. | Recount: 94/100 under its checker. Six passing answers still contain unmatched numbers; numeric fidelity is a separate diagnostic. No common IGNIS task comparison or semantic validation follows. |
| StarryNight | Deterministic evidence selection, narration and question-level error/latency artifacts. | Small mixed AI/template evaluation; citation/fact substring checks are narrower than expert correctness. |
| Other Emberfall | Broad retrieval and an inspectable query benchmark. | Retrieval scores and an extractive run are not generated-answer correctness. This is a different project from our registered team. |
| Entropy | Quote-checked extraction and a transparently bounded manual cell audit. | A selected nonrepresentative audit does not validate a whole corpus. Credit the source discipline. |
| FlameGuard | Actual retrieval/synthesis service, curated records and tests. | Source structure/citation checks are not entailment; inspected API tests stub providers. A static no-hit fallback issue is documented as static, not a runtime failure. |
| Altug PINN project | A trainable intensity-fitting network. | The inspected loss uses soft bounds, without a PDE residual or held-out physical target. “PINN” and “strictly obeying physics” exceed what that file establishes. |
| Muneer's Tested-or-Silent | FLEX decision tree, explicit 55-row holdout and deployment artifact. | 41/55 correct vs 37/55 majority; global min/max abstention is not joint support or calibrated confidence. More model evidence than IGNIS, but narrow. |
| ERU Stellar AI / Noha | Browser-exported 60-tree model for BASS-II chamber CO, with declared features and limits. | Repeated folds reuse the same 111 rows; exploratory thresholds/model choices lack a separate nested/final confirmation in the inspected paths. Chance percentages lack demonstrated calibration. |
| PROMETHEUS | Five active scientific retrieval/descriptive tools, provenance checks, agent traces and Android wrapper. | Causal/claim restrictions in the active final-answer path are instructions, not an observed semantic post-validator. The root entry point differs from legacy server code. |
| EMBER / PyroTensor | Contract-separated apps, ingestion and a 30-question API evaluation harness. | No saved evaluation result found in the acquired archive. Citation membership checks are not entailment. Its synthetic bootstrap is disclosed. |
| Ignimetheus | Reduced-order thermo-fluid engine, two calibration records and two labeled held-out rate comparisons. | Very small comparison domain; assumptions are disclosed per field, while one record's PSI locator/program metadata conflict. No engine rerun or independent transcription check here. |
| Anurag's FLEX ensemble | 276 rows, two feature variants, model/OOF artifacts and explicit weak-class limits. | Hyperparameters, weights and class multipliers are selected/scored on reused folds/outcomes. Pre-ignition inputs do not make the whole evaluation selection-free. |
| FireGuard | Explicit risk abstention without a supplied validated policy; source/policy identities. | A policy type name is not empirical validation. Honest abstention is already a competitor capability. |

FireSight was additionally observed as an existing app with source structure and a public page, correcting a planning-only search-cache impression. It is not included in the 37 pinned focused reviews above. No hidden/private entry is scored as absent or weaker.

## Where IGNIS still falls short

1. **Live AI evidence.** Our current interpreter remains disabled and its live evaluation is **NOT RUN**. Several competitors publish actual run artifacts. A working key alone would not establish acceptance: use the existing reviewed packet, task split, tuning, scoring, cumulative spend/probe caps and runtime-acceptance gate.
2. **Predictive research.** We have no comparable external predictive accuracy, calibrated probability or reproduced physical solver. Flamefall, IGNIS LAB, FLARE-X and other concrete model projects are stronger baselines for this axis, despite their limits.
3. **Measurement and ingestion workflows.** Fireline's optical workflow and PYRA's reviewed ingestion are more direct routes from new source data to analysis. Our present curated source collections do not replace them.
4. **Research planning and presentation.** Atlas, Kenyalang and Firebreak connect questions, evidence gaps and candidate follow-up work more explicitly. Our new guided cutoff start closes one narrow journey, not the entire planning gap.
5. **Demonstrated researcher benefit.** No blinded comparison against an equally informed spreadsheet or competitor workflow has run. Provenance and tests alone do not prove faster or more accurate scientific work.
6. **Release and adoption.** Public deployment, owner roster/name/license decisions, independent scientific review, researcher use and NASA engagement remain unresolved or not performed. Existing deployment/outreach holds remain unchanged.

## Implemented response: exact cutoff-range sensitivity

For a fixed jointly finite cohort, define `D(a,b) = (Σ I(Aᵢ ≥ a) − Σ I(Bᵢ ≥ b)) / n`. Increasing `a` cannot increase D; increasing `b` cannot decrease D. Therefore the minimum over a closed independent rectangle is at `(A maximum, B minimum)` and the maximum at `(A minimum, B maximum)`. This is an exact finite-data result, not a sampled grid or fitted predictor. Equality ties remain included. Profiles partition the lower-endpoint singleton and subsequent open-left/closed-right intervals.

For the default nonreference AW scatter / AV obscuration cohort:

| Analyst-selected ranges | Joint finite A-minus-B envelope | All-row unrestricted completion envelope |
|---|---|---|
| Both [1,3] V; pooled | [66,78] / 133 | [65,79] / 134 |
| Both [1,3] V; Flight 1 | [-6,-3] / 25 | [-6,-3] / 25 |
| Both [1,3] V; Flight 2 | [72,81] / 108 | [71,82] / 109 |
| Both [0,5] V; pooled | [-51,133] / 133 | Wider-range counterexample; inspect the exported completion bounds |

Thus opposite flight signs persist throughout the first rectangle, including unrestricted completions of unavailable readings. The wider rectangle permits both pooled signs. This strengthens the *descriptive sensitivity statement*, not detector superiority, alarm performance, causation or cross-flight comparability. The voltage operators remain different. The example ranges are analyst choices, not calibration uncertainty; no probability is assigned to rectangle area.

The site includes cohort/channel/range controls, a bound plot, exact flight/material tables, extremal witnesses, equality-aware steps, source cells, excluded rows/reasons and direct JSON export. The paired audit can hand over its current cohort, channels and exclusions. Confirmed range selections attach to an immutable brief and both exports, participate in revision identity, and survive notebook import/recheck.

## Implemented response: exact scenario handoff

Conditions, single-channel, paired and cutoff-range views can create a bounded scenario URL. It contains the selection and source/method/result identities in the fragment; question text and notebook history are not included. Explicit exclusion reasons are included and disclosed. A reopened link validates the schema/checksum/source IDs and recomputes before changing the view. It reports source, method and result drift separately, preserves the current draft/attachments/history, and does not silently turn a source selection into assessment evidence. Stale generated links disappear when controls change.

Checksums are not signatures. A link is a recipe, not an archival result. Keep assessment JSON for original result bytes and notebook JSON for recipes/receipts. The current localhost links work on this workstation; no hosting or publication occurred.

## Which models should come next?

| Candidate | Decision and prerequisites |
|---|---|
| Exact cutoff-envelope operator | Implemented and software-verified. No training required. |
| Exact target-region condition-frontier sensitivity | Mathematically specified in report14 and a source-pinned arithmetic artifact. Pairwise absolute-gap order changes at coordinate midpoints; preserve boundary ties. Useful next deterministic addition, **not implemented this round**. |
| Optical-front measurement | Investigate a reviewed measurement operator, source video/timebase, exposure/scale, manual reference annotations and extraction errors. Fireline demonstrates a workflow; its code does not provide our validation data. **NOT RUN**. |
| FLEX termination classifier | Potential later study with reconciled source rows, prediction-time features, distinct termination labels, grouped lineage splits, nested tuning, baselines, calibration and external confirmation. Do not fit merely to match competitors' headline scores. **NOT RUN**. |
| FDS/Cantera/surrogate or physics-informed model | Requires a defined geometry, forcing/boundary conditions, chemistry/transport, quantity operator, numerical verification and intended-use validation. The earlier professional-tool research remains applicable. **No new solver installed or run**. |

The cutoff calculation uses standard monotonicity and empirical counting; no global novelty or state-of-the-art claim is made. A useful contribution would be a reproducible source-bound finding and a workflow specialists can inspect, test and reuse.

## Verification and retained failures

- **308 offline tests passed**, 13 files. Independent finite enumeration checks cutoff extrema and missing-value binary completions; tests cover ties, singleton ranges, missing/error/non-numeric cells, empty strata, sign cases, A/B swap, rescaling, permutation, exclusions and detached exports.
- **35 production Chrome tests passed; one intentional duplicate skipped**, at 1366×768 and 375×812. Checks include fresh-browser links, malformed-link draft/result preservation, exact cutoff findings, wider counterexample, paired-cohort handoff and matching brief export.
- All eight affected scenarios passed again after a final responsive control/table adjustment. Twelve current desktop/mobile captures have no page exceptions, console errors or whole-page overflow; controls, exact bound plots and reopening were visually inspected.
- Catalogue validation, TypeScript, lint and production build passed. Registry r2 and source data remain unchanged. Current engine `engine-2026-11-15.4`, renderer `renderer-2026-11-15.3`, descriptive method `descriptive-analysis-2026-11-15.2`.
- A new full-workflow test found that a revision carrying all four source analyses exceeded the old 1 MiB local assessment-body bound. The local bound is now 2 MiB, with a rejection test and a passing all-analysis revision. **Interpreter/provider input/output limits, inference counters and spending gates did not change.**
- Initial checks also found a Zod issue-type adapter mismatch and browser-selector ambiguity from a shared layout class/Next's route announcer. These were corrected and affected checks rerun. Initial failing JSON artifacts are retained alongside final results.
- These are implementation/source checks, not independent scientific validation. New inference, a common blinded benchmark, competitor backend execution and NASA adoption remain **NOT RUN / unestablished**.

See [current status](BUILD_STATUS.md), [local verification](LOCAL_VERIFICATION_2026-11-15.md) and [reuse guide](RESEARCH_REUSE.md). The previous seven-slide briefing illustrates the still-valid single-cutoff paired example; it is not a new cutoff-range presentation.
