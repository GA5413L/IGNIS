# Additional implementation and model audit — 15 November 2026

This is a read-only source inspection, not a competitor runtime benchmark. Archives are pinned by the full commit in GitHub's codeload ZIP comment and SHA-256 acquisition records under `_raw/competitive_round2_2026-11-15/`. No competitor dependencies, training scripts, models or inference endpoints were executed. Source findings below are narrower than product-wide judgments.

## PROMETHEUS: a real tool-using agent, with a narrower validator than its architectural aspiration

At `598a7b2dbb60d111ded491d54d9ee2955de95f5f`, the root package's `agent:start` points to `agent/`, not the older `server/src/` implementation. The active agent exposes five tools: evidence search, exact experiment retrieval, pair comparison, source resolution, and descriptive dataset analysis. Numeric provenance/locator checks, bounded tool arguments and trace output are substantive strengths. The Android wrapper also broadens delivery beyond our browser workspace.

The inspected active response path returns generated text and the tool trace after checking for a nonempty response. Its causal-language restrictions are instructions to the model; I did not find a post-generation semantic or causal-entailment validator in that path. Thus the README's intended claim/causal/uncertainty-validation architecture should not be counted as a demonstrated end-to-end scientific validator. The model card calls evaluation something the project **should** maintain; no executed answer-quality score is established by this inspection.

Witnesses: [root package](https://github.com/masudurrahman-ds/prometheus-microgravity/blob/598a7b2dbb60d111ded491d54d9ee2955de95f5f/package.json), [active agent](https://github.com/masudurrahman-ds/prometheus-microgravity/blob/598a7b2dbb60d111ded491d54d9ee2955de95f5f/agent/server.mjs), [evidence operators](https://github.com/masudurrahman-ds/prometheus-microgravity/blob/598a7b2dbb60d111ded491d54d9ee2955de95f5f/agent/evidence.mjs), [model card](https://github.com/masudurrahman-ds/prometheus-microgravity/blob/598a7b2dbb60d111ded491d54d9ee2955de95f5f/docs/MODEL_CARD.md). This corrects the tempting but wrong inference that the legacy `server/src/agent.mjs` is the primary entry point.

## EMBER: operational evaluation code is not a saved result or semantic correctness

At `60cac7712ae44013538439bf1bba7636ed52ce66`, the archive contains a 30-question golden set and an in-process API evaluation runner. Thresholds require supported-flag accuracy ≥0.9, expected citation recall ≥0.8 and zero checker-defined leaks. The checker defines leaks through citation tags, citation membership and evidence IDs. It does not check whether a cited passage entails the sentence's scientific meaning. No `backend/eval/results/` artifact is present in the acquired archive; execution and any passed score remain **NOT RUN / not established here**.

The README explicitly labels its quick-start proxy seed synthetic and points toward real ingestion. Credit the contract-separated frontend/backend, ingestion path and executable evaluation harness; do not count a synthetic bootstrap as hidden fabrication or the harness as a passing run.

Witnesses: [evaluation runner, especially lines 51–100 and 154–160](https://github.com/PyroTensor/EMBER/blob/60cac7712ae44013538439bf1bba7636ed52ce66/backend/eval/run_eval.py), [thresholds](https://github.com/PyroTensor/EMBER/blob/60cac7712ae44013538439bf1bba7636ed52ce66/backend/eval/thresholds.yaml), [README](https://github.com/PyroTensor/EMBER/blob/60cac7712ae44013538439bf1bba7636ed52ce66/README.md).

## Ignimetheus: calibration and a small held-out comparison, not broad validation

At `72f8e85acdd059d18c271df54fb6a923b9bc6e57`, a reduced-order thermo-fluid engine, geometry/duct controls, transient state and explicit source/reference metadata exist. A concurrent-sheet factor is documented as calibrated to two Saffire records. Two other records are labeled held out; the source test allows <15% spread-rate relative error on those and the two calibration records. Two further records are extinction benchmarks. These are concrete, inspectable comparisons, beyond IGNIS's current descriptive operators; I did not execute the engine or independently verify the paper transcription.

Its per-field provenance explicitly identifies assumed pressure/igniter power and midpoint oxygen values. Those must not be read as measured fields merely because the containing row says “Measured (NASA Published Summary).” A four-row rate check, with two used for calibration, does not establish the full interface's gravity/material/geometry envelope. The record `SAFFIRE-III-01` also contains PSI-100 alongside a PSI-99 URL/DOI and program `Saffire-II`; this is an inspectable internal locator inconsistency, not proof every observation is wrong.

Witnesses: [correlations and calibration constant](https://github.com/Zucloak/Ignimetheus/blob/72f8e85acdd059d18c271df54fb6a923b9bc6e57/src/engine/thermoCore.ts), [source metadata](https://github.com/Zucloak/Ignimetheus/blob/72f8e85acdd059d18c271df54fb6a923b9bc6e57/src/data/nasaPsiExperiments.json), [comparison assertions, lines 795–834](https://github.com/Zucloak/Ignimetheus/blob/72f8e85acdd059d18c271df54fb6a923b9bc6e57/src/engine/thermoCore.test.ts).

## FLEX ensemble: more artifacts than IGNIS, but selection and evaluation are entangled

At `effb8c841d31d7883c671df87df107ecd7fca9a1`, Anurag's repository includes 276 source-table rows, XGBoost/CatBoost artifacts, configuration, OOF predictions and separate pre-ignition versus during/after-burn feature variants. It explicitly discloses the single pressure imputation and weak completion recall. The reported pre-ignition accuracy is 0.819 and macro-F1 0.693; these are author results, not a rerun here.

`train_ensemble.py` uses the same stratified folds to select model hyperparameters, computes OOF probabilities, chooses ensemble weights on their outcomes, and tunes class multipliers against those outcomes before reporting final scores. This is not nested evaluation of the full selection process. Pressure preprocessing happens before splitting, and row stratification is not a campaign/condition holdout. Removing post-burn inputs makes the feature timing more appropriate, but the label “leakage-free” does not establish unbiased future-test performance. The author documents the workflow; this is a limitation of the inference, not evidence of intentional deception.

Witnesses: [training, lines 38–79 and 203–267](https://github.com/Anurag-k-007/flames-in-freefall/blob/effb8c841d31d7883c671df87df107ecd7fca9a1/train_ensemble.py), [reported results](https://github.com/Anurag-k-007/flames-in-freefall/blob/effb8c841d31d7883c671df87df107ecd7fca9a1/results_summary.md), [scope/limitations](https://github.com/Anurag-k-007/flames-in-freefall/blob/effb8c841d31d7883c671df87df107ecd7fca9a1/README.md).

## FireGuard: explicit abstention is already a competitor capability

At `e8d6ee0294ad188d473e852480b24c267671a51f`, the inspected assessment engine separates evidence-factor coverage from a risk policy. With no validated policy supplied, it returns insufficient evidence, a null risk score and unavailable confidence. It also retains policy/source identifiers and a coverage gate. That is a concrete alternative to fabricated confidence and overlaps with IGNIS's bounded-claim approach. A type named `ValidatedFireRiskPolicy` does not itself establish empirical validation of any supplied policy; the deployment configuration and a valid policy were not established by this bounded check.

Witness: [assessment engine, lines 223–367](https://github.com/Altamashazam7/FireGuard/blob/e8d6ee0294ad188d473e852480b24c267671a51f/src/features/assessment/assessment-engine.ts). Do not confuse this project with FlameGuard or FIRE-X.

## Consequences for IGNIS

1. Preserve a claim → active entry point → implementation → data → evaluation chain; a polished README is only discovery evidence.
2. Acknowledge real predictive artifacts and live AI evaluations in competing projects. IGNIS currently has neither an accepted interpreter nor externally validated predictive accuracy.
3. Prefer an exact sensitivity operator we can verify now over another fitted score with unclear labels or dependent splits. Make its intended use explicit, retain source rows and expose failure witnesses.
4. Do not market provenance, abstention, saved work or deterministic analysis as unique. Demonstrate their usefulness on equal-information research tasks.

[NASA-STD-7009B](https://standards.nasa.gov/sites/default/files/standards/NASA/B/1/NASA-STD-7009B-Final-3-5-2024.pdf) distinguishes implementation verification, validation against a referent and credibility for a specified use. That distinction guides this comparison; IGNIS does not claim NASA accreditation or compliance certification. The new sensitivity calculation is an exact operation on a finite recorded dataset, not validation of spacecraft fire behavior.
