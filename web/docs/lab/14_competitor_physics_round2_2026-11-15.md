# Current scientific competitors: source audit, 15 November 2026

This review compares nine public repositories with the implemented IGNIS evidence workspace. Several projects now contain useful scientific software and unusually candid evaluation artifacts. Their strengths deserve a direct response: more explicit decision operators, reproducible source selection, and tests of the claim a user actually intends to make. AI-assisted authorship is not evidence against a result. Conversely, a physical equation, NASA citation, or high accuracy alone does not establish source fidelity or predictive validity.

**Audit status:** static source review and descriptive arithmetic on saved artifacts; competitor software, models, tests, and live inference **NOT RUN**. No independent external validation or overall winner is claimed. These are discoverable public projects, not independently verified competition entrants. Public repository pages were reachable; interactive demos were not tested in this round.

## Pinned scope and changed evidence

| Project | Current pinned commit | Change from our previous deep inspection |
|---|---|---|
| MARGIN | [`5c5afba01aaf`](https://github.com/ADAI-ALEX/margin/tree/5c5afba01aafb1280d7b199fb6f7225d1646c40e) | README, documentation, demonstration/source presentation and voice assets changed; inspected scientific engine/data blobs unchanged. |
| HALO | [`214fe39815f9`](https://github.com/MaanavKrishna/HALO-Habitat-Assessment-from-Low-Gravity-Observations/tree/214fe39815f9fb2c43c06d5d2d4764917adcb935) | Same head. |
| Flamefall | [`2af60cb09432`](https://github.com/ZOGWORK/flamefall-analytics/tree/2af60cb0943243035bcf81edfbd9d326ce0f9f5f) | Same head. |
| IGNIS LAB, a different project | [`95e601c1c8f1`](https://github.com/WingManOO7/ignis-lab/tree/95e601c1c8f1433cfb1722a95345360b32b373fd) | Same head. |
| PYRION | [`e5632b10ee45`](https://github.com/Lucyyngceo/pyrion/tree/e5632b10ee458674f3fd57bcef4b4a0a2bc26a33) | Material changes to BASS gravity/source records, quantity/geometry handling, navigator and validation artifacts. |
| FIRE-X | [`826b0eefcc86`](https://github.com/Hekimovraiz/FIRE-X/tree/826b0eefcc86b7763978e420668241fe11b5b87f) | Same head. |
| FLARE-X | [`b113fa688d5b`](https://github.com/SoyebuzamanNaim/ALPINE_IBEX/tree/b113fa688d5b85f74ecf17d56f92f85f6af04649) | New deep inspection. Current 200-row model supersedes the cached 145-row/four-report description. |
| Flame in Freefall, z1xO | [`174838fe5efc`](https://github.com/z1xO/flame-in-freefall/tree/174838fe5efc160f8e4eecb7aa7867c5fb8a7568) | New bounded inspection of model, calibration and data paths. |
| AERO-IGNIS SI, Joshua-Sotomayor | [`0850efc656dd`](https://github.com/Joshua-Sotomayor/NASA-flame-in-freefal/tree/0850efc656dd50c4ad410b30ac1003f448efcd24) | New bounded inspection of training and physics paths. |

Full SHA values, acquisition times, hashes and line locators are in the [source manifest](../../../_raw/competitive_round2_2026-11-15/physics/source_manifest.json) and [claim ledger](../../../_raw/competitive_round2_2026-11-15/physics/claim_ledger.json). Unchanged earlier files were checked against their current Git blob identifiers; they were not treated as current merely because a previous report cited them.

## Findings that matter to a researcher

### MARGIN: useful evidence policy; sampled sensitivity is not complete sensitivity

The [eligibility gate](https://github.com/ADAI-ALEX/margin/blob/5c5afba01aafb1280d7b199fb6f7225d1646c40e/lib/engine/gate.ts#L25-L46) separates planned records, fuel/phase requirements, oxygen missingness, gravity mismatches and limit observations. Its distance exposes oxygen, log-pressure and flow contributions. A partial record can win, but the [verdict explicitly qualifies that result and identifies a complete alternative](https://github.com/ADAI-ALEX/margin/blob/5c5afba01aafb1280d7b199fb6f7225d1646c40e/lib/engine/verdict.ts#L39-L61). Declared weighting is a decision policy, not automatically a scientific defect. Neither weight sensitivity nor missing-axis omission supplies a physical equivalence test.

One concrete limitation exists in the [flow-crossing scan](https://github.com/ADAI-ALEX/margin/blob/5c5afba01aafb1280d7b199fb6f7225d1646c40e/lib/engine/sensitivity.ts#L12-L38): it bisects only intervals whose sampled endpoint verdicts differ. For one otherwise eligible forced-flow record, let normalized oxygen gap be 0.99, pressure gap zero, and recorded flow 22.5 cm/s. The declared distance is then `D(u)^2 = 0.99^2 + ((u - 22.5)/5)^2`. At sampled flows 20 and 25 cm/s, both distances are about 1.109 and classified NEAR; at 22.5, distance 0.99 is DIRECT. Both interior crossings, about 21.795 and 23.205 cm/s, can be skipped. This is a **synthetic algebraic counterexample to completeness**, not an observed live failure or an error in the sampled verdicts. The [arithmetic record](../../../_raw/competitive_round2_2026-11-15/physics/static_counterexamples.json) makes that distinction explicit.

### HALO: informative detector summaries; endpoint scope needs care

HALO's [detector combinations](https://github.com/MaanavKrishna/HALO-Habitat-Assessment-from-Low-Gravity-Observations/blob/214fe39815f9fb2c43c06d5d2d4764917adcb935/web/src/lib/engine/detection.ts#L25-L72) use only rows with every selected channel present. This is a coherent complete-case denominator. It also means changing the sensor combination can change the population. Its UI calls the threshold an alarm proxy and discloses the inferred ionization threshold; these are useful boundaries, not evidence of operational detection probabilities.

The [FLEX classifier](https://github.com/MaanavKrishna/HALO-Habitat-Assessment-from-Low-Gravity-Observations/blob/214fe39815f9fb2c43c06d5d2d4764917adcb935/pipeline/halo_pipeline/extinction.py#L29-L73) takes nitrogen-diluted rows, oxygen, log diameter and log pressure. Literal `Extinction` is positive; other outcomes become negative. Shuffled row cross-validation and row bootstrap coefficients describe that recorded-label task, not demonstrated transfer to a new campaign. Mixed fuel and disruption endpoints further constrain a phrase such as extinction before burnout. Row folds alone are not proof of leakage or uselessness; the missing evidence is evaluation against the proposed transfer population and endpoint.

The [current README](https://github.com/MaanavKrishna/HALO-Habitat-Assessment-from-Low-Gravity-Observations/blob/214fe39815f9fb2c43c06d5d2d4764917adcb935/README.md#L31-L47) scopes the absence of solids above 22.2% oxygen to its acquired PSI tables and separately mentions higher-oxygen Saffire literature. It should **not** be criticized as claiming NASA never burned a solid above 22.2%.

### Flamefall and IGNIS LAB: stronger evaluation designs, different targets

Flamefall specifies its [binary endpoint and caption-derived cool-flame task](https://github.com/ZOGWORK/flamefall-analytics/blob/2af60cb0943243035bcf81edfbd9d326ce0f9f5f/flamefall/model.py#L103-L143), and implements nested tuning with [atmosphere-group outer splits](https://github.com/ZOGWORK/flamefall-analytics/blob/2af60cb0943243035bcf81edfbd9d326ce0f9f5f/flamefall/model.py#L263-L310). Our arithmetic on 275 saved out-of-fold predictions reproduces AUC **0.8834834835**. Saved row IDs and atmosphere groups are disjoint in each of five outer folds. Its reported held-out-fuel AUC is lower, **0.7443843844**. These checks validate saved-artifact arithmetic and split membership; fitting, labels, calibration and external performance remain unrerun. Atmosphere grouping also does not establish independence of shared apparatus or campaign errors.

IGNIS LAB [maps Extinction versus Completion and leaves Disruption unlabelled for that task](https://github.com/WingManOO7/ignis-lab/blob/95e601c1c8f1433cfb1722a95345360b32b373fd/scripts/clean_flex.py#L86-L102). Its clean table has 274 rows and 90 condition groups, but those are not automatically the classifier's admitted sample size. It uses pre-ignition inputs and grouped evaluation. The [evidence helper](https://github.com/WingManOO7/ignis-lab/blob/95e601c1c8f1433cfb1722a95345360b32b373fd/ignis/evidence.py#L20-L54) combines per-fuel ranges, joint nearest-neighbor distance and disruption-dominated neighborhoods: useful design beyond one marginal min/max box.

Its [calibration split](https://github.com/WingManOO7/ignis-lab/blob/95e601c1c8f1433cfb1722a95345360b32b373fd/scripts/calibrate_and_evidence.py#L32-L57) separates whole condition groups, then pools row residuals for a quantile. Group-held-out coverage is informative. A distribution-free claim for a new campaign still needs a stated exchangeability unit and coverage target; splitting groups does not by itself prove that guarantee. This is a qualification, not a finding that conformal methods are intrinsically invalid. Comparing these projects' accuracy without their different outcome definitions would be misleading.

### PYRION: source repairs materially improve the current picture

The refreshed [validation report](https://github.com/Lucyyngceo/pyrion/blob/e5632b10ee458674f3fd57bcef4b4a0a2bc26a33/validation/reports/latest.json) contains 10,022 records and reports **0 blocker, 1 major, 131 minor** findings, which our saved-artifact recount confirms. Earlier reports of 67 major findings are obsolete at this pin. The remaining major item concerns a unit/conversion convention; it is not evidence that every associated source value is wrong. Its current authored judge battery reports zero failures over 31 grouped questions and 11 traps; these are parse, lexical and repeatability checks, not independent scientific-answer adjudication.

The [applicability code](https://github.com/Lucyyngceo/pyrion/blob/e5632b10ee458674f3fd57bcef4b4a0a2bc26a33/engine/src/verdict.ts#L307-L370) requires co-recorded axes and excludes unpaired oxygen/pressure points from its two-dimensional hull. Open regimes and mismatches are explicit. Its [0.5% tolerance](https://github.com/Lucyyngceo/pyrion/blob/e5632b10ee458674f3fd57bcef4b4a0a2bc26a33/engine/src/types.ts#L159-L170) is openly a PYRION convention; it is not source-measured uncertainty. Geometric applicability remains distinct from validated physical transfer.

A narrower surviving defect is the duration surrogate's [random-CV baseline](https://github.com/Lucyyngceo/pyrion/blob/e5632b10ee458674f3fd57bcef4b4a0a2bc26a33/models/flex_model.py#L157-L175): the function labelled training mean uses the full target-vector mean, whereas the blocked baseline uses the training subset. This affects baseline interpretation; it does not establish target leakage into the GP fit.

### FIRE-X: the citation contract is contradicted by the function

The canonical file contains 892 rows. That recount does not independently establish 892 verified experiments. The more consequential finding is [the droplet prediction function](https://github.com/Hekimovraiz/FIRE-X/blob/826b0eefcc86b7763978e420668241fe11b5b87f/backend/nasa_combustion_engine.py#L172-L220): its emitted FLEX identifier is constructed from diameter and oxygen inputs rather than looked up from an original flight row. Pressure or diluent can change the computed result while preserving that identifier. This function therefore does not deliver the README's strict original-record citation meaning.

It also selects a fuel-property dictionary without using those properties in its burning-constant and extinction-ratio expressions; fuel affects the cool-flame flag. Defined constants alone do not establish fuel-specific calibration. The [hazard routine](https://github.com/Hekimovraiz/FIRE-X/blob/826b0eefcc86b7763978e420668241fe11b5b87f/backend/nasa_combustion_engine.py#L330-L376) emits `NOMINAL_SAFE` and ventilation recommendations using fixed formulas and thresholds. Their operational validation was not established in the inspected paths. These are direct source findings; no intention or authorship inference is needed.

### FLARE-X: current disclosure is stronger than the stale search description

The current [model card](https://github.com/SoyebuzamanNaim/ALPINE_IBEX/blob/b113fa688d5b85f74ecf17d56f92f85f6af04649/docs/MODEL_CARDS.md) describes an exploratory 200-row classifier across seven report IDs. Our recount finds report sizes 158, 13, 12, 7, 6, 3 and 1; outcomes are 163 spread, 35 no-spread and two marginal. The saved confusion matrix gives **84% accuracy**, compared with the disclosed **81.5% majority baseline**. Its balanced accuracy is **40.3389%** by our arithmetic. The separately reported **25.5%** nested-search accuracy evaluates the whole 135-candidate selection procedure, not the identical fixed-SVM estimand. The project explicitly discloses these weaknesses and lack of independent external validation. The earlier four-report/five-fold allegation must not be carried forward to this version.

Useful safeguards include material-specific joint-domain checks, affine-subspace/convex-hull handling, sparse/conflicting-outcome abstention and model/data hash agreement. These do not recover missing geometry, direction, ignition sequence or specimen history. The [labeling protocol](https://github.com/SoyebuzamanNaim/ALPINE_IBEX/blob/b113fa688d5b85f74ecf17d56f92f85f6af04649/docs/LABELING_PROTOCOL.md#L15-L35) also candidly acknowledges a machine-readable defect: all 200 rows still say `direct_measurement` and `outcome_interpreted=False`, even though outcomes are curated. Consumers need the warning in the metadata itself.

A focused source review remains necessary for its thin-film B18/B19 no-spread entries: 10 cm/s is paired with blowoff observations at fan-pot settings. Reinspection of NASA/TM-20210011385 Table A.1, **PDF page 112 / printed 104**, shows that the nominal/sequence velocity entry and observed fan-pot endpoint are distinct descriptions. Exact endpoint-to-velocity mapping is unresolved, **not proved false**. These thin-film labels must not inherit IGNIS's unrelated rod-label quarantine. We found no justification for treating a reused label as a shared specimen. [NASA primary report](https://ntrs.nasa.gov/citations/20210011385).

### Two additional projects have real computations, with explicit limits

z1xO's [FFR-1](https://github.com/z1xO/flame-in-freefall/blob/174838fe5efc160f8e4eecb7aa7867c5fb8a7568/server/src/ffr1.ts#L15-L85) implements thin/thick reduced spread expressions with kinetic and radiative corrections; one ground record calibrates a temperature parameter. Its bands and extinction fractions come from assumed parameter sampling, not measured prediction coverage or observed event probabilities. The [data notes](https://github.com/z1xO/flame-in-freefall/blob/174838fe5efc160f8e4eecb7aa7867c5fb8a7568/server/src/data.ts#L29-L46) disclose calibration versus validation roles and a curator-read flow value. The critical-flow helper assumes a usable single bracket although the model permits low-flow extinction and high-flow blowoff; this needs a monotonicity/bracketing test, not an unsupported claim of a demonstrated runtime failure.

Its [FFR-2D](https://github.com/z1xO/flame-in-freefall/blob/174838fe5efc160f8e4eecb7aa7867c5fb8a7568/server/src/ffr2d.ts#L1-L35) contains actual transient gas energy/species and sheet-pyrolysis updates, with explicit time stepping. Both models are openly unvalidated. Solver existence and a fitted front speed do not establish grid convergence, reaction-rate validity or partial-gravity transfer. A full solver audit is outside this bounded read.

Joshua's AERO-IGNIS SI [training code](https://github.com/Joshua-Sotomayor/NASA-flame-in-freefal/blob/0850efc656dd50c4ad410b30ac1003f448efcd24/backend/train_models.py#L71-L184) implements RF/GBR, CNN and sensor-tree paths. RF uses five-fold row CV. CNN training uses 180 procedurally generated frames and is evaluated on those training inputs; the sensor tree uses 600 generated feature draws and threshold-derived labels, then reports its training score. Their saved 100% values do not demonstrate held-out NASA image or detector performance; the CNN metric is explicitly named training accuracy. The CSV has 566 rows, but original source-row ancestry is not established by the inspected fields. Its [dimensionless engine](https://github.com/Joshua-Sotomayor/NASA-flame-in-freefal/blob/0850efc656dd50c4ad410b30ac1003f448efcd24/backend/physics_ml.py#L131-L185) defines empirical Da/Pe and extinction expressions. No independent calibration of those formulas was established here. The repository is more than a planning README; its source warrants these concrete distinctions.

## Task comparison with the current IGNIS

IGNIS currently offers 24 PSI investigation profiles, seven version-pinned Saffire condition cases, 134 material-smoke rows plus 20 DBP rows, condition-gap frontiers, W1/W2/W3 assessment boundaries and reproducible research selections. Metadata profiles are not experiments; material-smoke rows are not independent flame burns. The following concerns actual workflow capability, not model-score ranking.

| Research task | Strong public example | Current IGNIS position and useful response |
|---|---|---|
| Find relevant source evidence | MARGIN's explicit gate and distance decomposition | Keep eligibility, missingness and intended use visible; weighting can be useful if its policy meaning is declared. |
| Compare atmospheric coordinates | PYRION's co-recorded-axis geometry; FLARE-X joint-domain guard | IGNIS compares oxygen/pressure only within material and burning-sides cohorts, retaining source-version/flow conflict. It does not establish transfer. |
| Interpret detector combinations | HALO's complete-case channel summaries | IGNIS preserves fixed selected populations, row provenance, missingness and paired contrasts; extend to exact cutoff-policy bounds rather than certified detection claims. |
| Assess a predictive endpoint | Flamefall's grouped OOF artifacts and fuel holdout | IGNIS has no competing validated physical predictor; W1/W2/W3 evidence assessment is a different task. |
| Admit a model query | IGNIS LAB's joint neighbors; FLARE-X conflict/sparsity abstention | Source/operator eligibility should precede any future model. A nearby atmosphere alone is insufficient. |
| Reproduce a claim | PYRION's validation artifacts and MARGIN's visible policy | IGNIS recipes, receipts and source revisions support rechecking current calculations. Checksums do not certify source truth or scientific validity. |
| Study mechanistic behavior | z1xO's reduced model and explicit transport solver | A meaningful physical extension would require numerical verification, source-resolved observables and validation. It is not a same-day decorative formula module. |
| Interpret an impressive score | FLARE-X's majority/nested baselines and honest limits | Display the endpoint, denominator, split unit and inference status. Authored tests and generated training accuracy should retain their actual scope. |

## A finite mathematical improvement without physical prediction

**Proposal, not implemented in the app:** exact target-region sensitivity for the existing condition-gap frontier. It answers where the shortlist changes when the analyst changes the target oxygen and pressure. This is decision-policy sensitivity, not a combustion model or measurement-confidence region.

The underlying dominance operator is established: a point is dominated when another is no worse on every coordinate and strictly better on at least one; equal points remain. The primary skyline paper discusses the operator and duplicate semantics on PDF pages 1–2. [Börzsönyi, Kossmann and Stocker, *The Skyline Operator*, 2001](https://cse.hkust.edu.hk/~raywong/reading/paper/skyline.pdf).

**Our derivation:** for distinct scalar coordinates `a` and `b`, `|a-t| = |b-t|` exactly when `t = (a+b)/2`. Between all such midpoints, pairwise gap order cannot change. Taking products of axis intervals and equality boundaries therefore partitions the target plane into regions with a constant frontier. This supplies an exact change certificate without a weighted score, fitted model or numerical solver.

For the current canonical two-case cohorts, the midpoint pairs are:

| Cohort | Oxygen midpoint, mole % | Pressure midpoint, kPa |
|---|---:|---:|
| PMMA, two burning sides | 26 | 77.2 |
| PMMA, one burning side | 27.5 | 64.75 |
| SIBAL, two burning sides | 27 | 76.05 |

Cotton has one case and no competing-case midpoint. These produce 28 regions including equality boundaries across the four current cohorts. Our [independent exact-rational arithmetic](../../../_raw/competitive_round2_2026-11-15/physics/target_regions.py) passed 161 assertions covering within-region constancy, boundary ties, current examples and pressure-unit rescaling. It reads the pinned condition dataset and is **not an app implementation or a competitor-model run**.

A practical later feature would show the current region, exact coordinate breakpoints and which cases remain on the frontier throughout a user-entered target rectangle, exporting cohort and source revision. Falsifiers include an interior frontier change without crossing a midpoint, a lost equality tie, or a changed result after exact positive unit scaling. Source revision, cohort membership or an added axis must rebuild the regions. Unknown measurement uncertainty must remain unknown: choosing input uncertainty distributions is a separate task, as illustrated by the official [NIST Uncertainty Machine](https://uncertainty.nist.gov/). Decimal display precision alone does not supply those distributions.

The immediate implementation priority remains the detector cutoff certificate and shareable scenario handoff being developed by the other team members. Target-region sensitivity is a bounded subsequent improvement. Neither needs ML. New spread/extinction prediction would instead require source-resolved endpoints, fitting or a verified numerical solver, and prospective validation against data outside the development workflow.

## Reproduction and limits

This directory records 75 successful verified-TLS public GETs, including exactly ten GitHub API calls; there were no failed accesses in this agent's capture log. Two parent-acquired public ZIPs supplement those requests. Thirty-nine cited files were checked against current Git blobs or pinned ZIP bytes. The claim ledger distinguishes **source-supported**, **static-inferred**, and our **observed** file/arithmetic checks; runtime remains **NOT RUN** throughout. Primary Table A.1 was visually re-inspected; the skyline paper's first two pages and NIST tool page were read. No figure was digitized.

Local reproduction, from the project root, requires the saved current and earlier source archives referenced by the scripts:

```powershell
py -3 -I _raw/competitive_round2_2026-11-15/physics/inspect_artifacts.py
py -3 -I _raw/competitive_round2_2026-11-15/physics/build_claim_ledger.py
py -3 -I _raw/competitive_round2_2026-11-15/physics/target_regions.py
```

These scripts inspect bytes, saved metrics and descriptive coordinate arithmetic; they never import competitor packages or fit models. The [descriptive recount](../../../_raw/competitive_round2_2026-11-15/physics/descriptive_recount.json), [primary inspection record](../../../_raw/competitive_round2_2026-11-15/physics/primary_inspection.json), and [target-region result](../../../_raw/competitive_round2_2026-11-15/physics/target_regions.json) retain their scope. This is bounded public-source coverage, not a claim to have discovered every entrant, audited every source label, reproduced every score, or established scientific predictive state of the art.
