# Deeper research and the implemented researcher workflow

**15 November 2026, PKT.** IGNIS now does more than expose individual source values: it shows when a descriptive conclusion changes with the selected cohort, carries that exact analysis into a brief, and rechecks portable research recipes against current sources and methods. The local build is `web-2026-11-15.3`; the core scientific registry remains `2026-11-15.r2`. This is a concrete software contribution, not a claim of new fire physics, unique discovery, competitive victory or NASA adoption.

The recommendation is to make IGNIS a useful companion to specialist modeling: specify the measurement and intended claim, expose source/calibration dependencies, inspect sensitivity to population and missingness, and preserve a reproducible handoff. Do not fit a new physical predictor merely to add an ML label. The present data and endpoint contracts do not justify that step.

## What professional tools actually teach us

The [professional-tools investigation](lab/11_professional_tools_2026-11-15.md) contains 22 primary references, pinned software/source versions, acquired examples and source manifests. It distinguishes documented use from relevance:

| Tool or practice | Construction and documented use | Consequence for IGNIS |
|---|---|---|
| FDS with PyroSim | FDS models low-speed fire-related flow using geometry, meshes, source terms and boundary conditions. The Saffire VI paper documents vehicle geometry/model preparation with PyroSim, supplied payload histories, and remote-sensor comparisons. | Preserve the supplied inputs and comparison quantities. Conditional smoke/heat transport is a different task from independently predicting material burning or yield. |
| Smokeview | Displays solver outputs and has separate visualization/verification documentation. | A convincing picture does not establish that a physical model was run or validated. |
| CFAST | A compartment zone model with idealized upper/lower gas layers and conservation equations. | Useful specialist reference; this review did not establish applicability of its terrestrial layer abstraction to a zero-gravity cabin, or NASA operational use. |
| Cantera | Chemical mechanisms, thermodynamics and transport feed reactor/reacting-flow calculations. Official examples separate reaction sensitivity, grid convergence and saved-state replay. | A later chemistry task needs a specified mechanism, target and validation domain. No justified quantum-computing feature follows from molecular physics being relevant to combustion. |
| NASA/NIST model-use practices | Intended use, numerical verification, validation, uncertainty and acceptance are distinct. FDS validation is organized by output quantity. | Track forcing, calibration, comparison data and transformations separately; keep unknown uncertainties unknown. Following these concepts is not certification or NASA acceptance. |

The actual NASA case is instructive: Saffire VI reused a cargo heat-transfer coefficient calibrated against Saffire V RS3 and aligned simulated baselines with initial sensor readings. These choices support a qualified transport comparison; they do not independently validate every input, initial concentration or combustion quantity. The new **Data & methods** view makes these roles visible. The existing W1/W2/W3 contracts still determine permitted model claims. [NASA Saffire VI paper, PDF pp. 4, 6–8, 11–12](https://ntrs.nasa.gov/citations/20250002675).

NIST explicitly distinguishes prescribed-fire transport capability from the continuing challenge of predicting growth/spread from material properties. That is a reason to narrow the intended use before expanding the solver or model list. [NIST Advanced Fire Modeling](https://www.nist.gov/programs-projects/advanced-fire-modeling).

## New useful insight: a pooled detector pattern depends on flight

The implemented paired audit uses the exact SAME/SAME-R workbook hash, sheet and Excel row. Displayed sample/test labels are not join keys. It compares **A = AW, ISS scatter** and **B = AV, ISS obscuration** at two independently declared illustrative cutoffs of **2 V**. These channels have different measurement operators; equal cutoffs do not put them on a common physical response scale.

With DBP references excluded, there are **134 selected rows and 133 jointly finite pairs**:

| A state / B state | B below 2 V | B at or above 2 V |
|---|---:|---:|
| A below 2 V | 32 | 6 |
| A at or above 2 V | 76 | 19 |

The pooled difference between at/above fractions is **70/133**. The flight-specific differences are **−6/25** for flight 1 and **+76/108** for flight 2. The pooled result therefore conceals opposite descriptive patterns. Configuration, offsets, processing and windows require investigation; the result is not evidence that one detector is better, that either missed an alarm, or that a calibration change has been established.

A superficially reasonable quality filter also changes the answer. Requiring the literal source token `n` in the fan-problem field excludes **109 rows**, all flight-2 material rows, whose flags are unrecorded. The retained difference becomes **−6/25**. This demonstrates a population-selection effect, not actual fan failure. Zeros and negative values remain finite readings; they do not certify instrument operation.

Missingness is explicit. At the default selection one row has neither channel finite. Unrestricted binary completions at the selected cutoffs bound the full-selection fraction difference between **69/134 and 71/134**. These are finite combinatorial bounds, not confidence intervals, imputed readings or physical predictions. Marginal channel denominators, joint denominators, material/flight strata, exclusions, original cells and instrument notes remain distinct in the output.

The [Python recount and ML investigation](lab/13_ml_decision_2026-11-15.md), TypeScript implementation and synthetic enumeration tests agree on these finite quantities. This is cross-language software checking by AI assistants, not independent scientific validation. Source: [NASA PSI-101](https://psi.nasa.gov/physci/repo/data/investigations/PSI-101), workbook SHA-256 `6d3a539ccf425b1fa8edc19cc75d828f57d650c7ce734d4e7aa686fea9593218`.

## New data opportunities, with admission requirements

The [data investigation](lab/12_data_opportunities_2026-11-15.md) checks eight selected original assets totaling **13,044,966 bytes**, preserving source identities, rights evidence, hashes and exact cells. The new UI inventory is [exportable JSON](../src/data/research-opportunities.json). Acquired bytes are not automatically analysis-ready observations.

| Resource | Verified useful detail | Next step and boundary |
|---|---|---|
| SAME-R final report | Reports 67 generation runs, including two reused-sample runs; aging observations expand the listing to 109. Physical-carousel reuse is described. | Reconcile run/sample/aging ancestry before estimating independent sample size or splitting a model dataset. The report does not automatically resolve the existing workbook/CSV mismatch. |
| Kapton run-62 TEM workbooks | Separate aged/unaged particle-processing sheets, copied templates, cached errors and an explicitly source-flagged bin issue. | Review image/grid/particle exclusions and bin definitions. Do not join particles to detector rows by run label alone or silently choose a preferred total. |
| NIST TN 1947 alarm trials | Actual alarm times, obscuration and measuring-ionization-chamber readings with unit/configuration/repeat identifiers and published uncertainty conventions. | A distinct ground reference collection. It does not convert SAME volts into alarms or establish microgravity performance. [NIST data](https://www.nist.gov/el/fire/engineered-fire-safety/data-smoke-alarm-performance). |
| Saffire-I telemetry | Side-by-side detector arrays have different clocks: the example row records timestamps 1465931204893 and 1465932848063. Headers identify voltage signals and separate relative-time columns. | Spreadsheet row equality is not synchronization. Resolve clock origins, units, calibration, windows and pairing rules before estimating lag. Bare radiometer/anemometer headers do not establish chemical heat-release histories. |
| NIST/NRC Test 01 | Official measurement CSVs, a distinct derived-layer file and a pinned FDS input are available in the professional-tools capture. | A concrete future benchmark package. Review quantities, channel mappings, units and sentinel conventions; do not promote terrestrial compartment data to microgravity evidence. |

## Does IGNIS need an ML model now?

**No new physical-model fit is justified for this release.** The bounded [ML decision](lab/13_ml_decision_2026-11-15.md) reviews grouped evaluation, competing endpoints, calibration, exchangeability and model discrepancy using primary papers and official method documentation.

The pinned local FLEX CSV has **274 rows: 186 Extinction, 61 Disruption, 27 Completion**. Only 262 have the six inspected finite initial predictors. Competitor artifacts referring to 276 rows must be reconciled by version/cohort before score comparisons; the difference alone does not prove a competitor error. Burn time is not automatically time to extinction, and disruption cannot simply be assumed to be non-informative censoring. Post-test diameter and burn measurements cannot become pre-test features.

A defensible later candidate is a small regularized model of the **recorded termination category under a specified protocol**, compared with a training-only class-proportion baseline. It needs reconciled labels/units/ancestry, a prediction-time contract, dependency-aware holdouts, nested tuning where required, calibration/proper-score checks and an untouched final evaluation. Unknown dependence cannot be repaired by calling a split “grouped.” A surrogate trained on simulations also needs its own applicability and validation case.

ML could separately assist candidate metadata extraction or interpretation, provided it reduces correction effort without inventing fields. That is a different task from predicting fire behavior. Existing frozen IE-1 tasks, tuning, scoring and cumulative limits remain unchanged. **Training, new physical prediction and current live inference: NOT RUN.**

## What changed in the working application

1. **Paired cohort audit:** independent channel cutoffs, joint/marginal denominators, flight/material breakdowns, exact-cell witnesses, explicit exclusions with reasons, literal-status sensitivity and finite missingness bounds.
2. **Exact evidence handoff:** Conditions, single-channel readings and paired audits attach their confirmed selection to an immutable assessment. The view and Markdown/JSON exports use that result. Supplemental analyses do not become model-validation evidence.
3. **Portable research sessions:** download or manually save the draft, attached selections and up to 16 assessment recipes/receipts. Import recomputes locally and reports source, method and result changes separately before loading. Original result/row bytes require the separate assessment JSON; a session is not a full archival bundle. Checksums do not authenticate authorship.
4. **Research guidance:** Data & methods exposes Saffire data roles, the ML decision and four source opportunities with exact assets, locators, units, rights and next admission checks.

Session checks reject corrupted checksums, duplicate identities/kinds, orphan or mismatched ancestry, unsupported fields and oversized packets. An old in-flight assessment cannot overwrite a newly imported workspace. Assessment identity now binds the full confirmed request and selected source/method/result identities. Import makes no upstream calls.

## Competitive meaning and remaining proof

The [17-project comparison](COMPETITIVE_COMPARISON_AFTER_BUILD_2026-11-15.md) remains the source-level baseline; no new competitor performance benchmark ran during this patch.

| Strong public comparator | What this patch changes | What remains unproven |
|---|---|---|
| MARGIN | IGNIS now connects condition selections to briefs and replay. | Seven-case coverage and condition tradeoffs were already present in MARGIN; these are not unique. |
| VESTA / MORS | Source/method/result recheck and portable recipes close a previously verified workflow gap. | This does not establish parity on every receipt, persistence or replay feature, or better user performance. |
| FlameBound / MicroFire Atlas | Source analyses now travel through a coherent evidence workflow. | Their sharing/planning/AI capabilities are different tasks; no common scored comparison exists. |
| Flamefall / IGNIS LAB | IGNIS contributes cohort/measurement audits without pretending to have fitted their models. | Competitors have substantive numerical/model artifacts; IGNIS has no comparable trained-predictor score. |
| HALO and detector summaries | The new audit demonstrates why pooled cutoff counts and status filtering need careful interpretation. | The same public sources are available to others. No exhaustive novelty search or general detector-superiority result is claimed. |

The best demonstration is now a concrete scientific question: **“Does the descriptive detector pattern survive a change in cohort or status-selection rule?”** Show the reversal, inspect exact cells, attach the result, export it, and reopen the session. Then show a model claim whose information-use restriction differs. This is more reviewable than a universal confidence score, but its researcher benefit still needs measurement.

Next evidence needed: independent human review of source/measurement contracts; a blinded task comparison against an equally informed spreadsheet and selected runnable competitors; reconciliation of new datasets before numerical admission; a frozen prediction/validation plan if ML becomes justified. NASA reuse would require a usable licensed release, reproducible artifact, domain review and actual engagement. No contact, endorsement or adoption has occurred.

## Verification and release state

Final checks: **280 offline tests in 11 files; 27 production-Chrome tests passed, one intentional duplicate skipped**. Catalogue validation, TypeScript, lint and production build passed. Six desktop/mobile workflow states showed zero page errors, console errors and page-wide overflow. The first browser run caught a 33-pixel mobile navigation overflow; a three-column mobile navigation layout fixed it, and the full browser suite was rerun. [Verification artifacts](../../_raw/professional_research_2026-11-15/build/) preserve the initial failure and final results.

The local UI is available at `http://127.0.0.1:3000`. No new credentials were inspected, no inference or simulation ran, and no account/billing/deployment action occurred. The existing competition, preparation-reuse, runtime-acceptance and D-053 publication gates remain unchanged. Software checks do not establish an award, measured competitive superiority or independent scientific validation.
