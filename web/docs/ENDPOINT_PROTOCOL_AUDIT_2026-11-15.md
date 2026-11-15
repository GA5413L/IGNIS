# Endpoint and stepped-observation audit

15 November 2026, build `web-2026-11-15.9`, method `endpoint-audit-2026-11-15.1`. Backend-only continuation under the owner's instruction that a teammate owns the UI. No component, CSS or layout changes.

The newly supplied Liveretou manuscript resolves the earlier full-text access gap. It also prevents an incorrect upgrade of its reported LOC into a universal complete-extinction threshold. IGNIS now audits three observational criteria separately and can produce explicitly conditional mathematical compatibility sets from supplied step records. It does not reproduce the paper's response data or run its physical models.

## What was received and checked

Both files are copies of the accepted manuscript of Liveretou et al., [*The limiting oxygen volume fraction for opposed flame spread extinction*](https://doi.org/10.1016/j.proci.2024.105224), PROCI 40 (2024), 105224. The publisher's record confirms the identity; the version-of-record full text has not been inspected. All nine manuscript pages were read, and the methods/results pages were visually inspected.

| Copy | Bytes | SHA-256 |
|---|---:|---|
| Canonical supplied copy | 1,385,409 | `a1899bf28581fa30a480a65d7868a94019821e7fc7b02b3f51ff2c34fc2b6bb0` |
| Alternate supplied copy | 1,384,104 | `8ff9c5214eac0f2d7da53ddac4493578b1cba9954ccd6fbbf813c0cfef5398fc` |

The bytes differ, but extracted text and all nine page renders at 72 dpi match. These copies are not two independent sources. Page 1 states the Elsevier user license, not CC BY. Only factual method/parameter transcription and original analysis are shared; source PDFs and figures remain local. No plotted measurements are digitized. The [source dossier](../data/endpoint-studies/liveretou2024.json) is separate from the frozen r2 registry and evaluation packet.

## Findings that change how IGNIS should use this paper

| Issue | Full-text evidence | Consequence |
|---|---|---|
| Endpoint is not uniquely disaggregated | Page 4 describes spread stopping while a blue flame remains. Page 5 reports the average oxygen fraction where spread stops or the flame extinguishes. The methods also describe stability at LOC plus a step and extinction at LOC. | Preserve this wording tension as LIV24-Q01 / C-29. Do not infer each trial's failure branch or treat every reported point as complete extinction. |
| Finite oxygen steps | Page 4: approximately 1.5-minute holds, reductions of 0.5–1 percentage point, after initial stabilization of about two minutes. | A stopping setting is not an exact continuous threshold. Per-run step sizes, settled-response adequacy and transition pairs are not supplied. |
| Aggregate uncertainty | Page 5: usually 3–5 repeat tests, means and standard deviations; additional tests at three points are described. | SD is not a confidence interval or a complete measurement-error budget. Do not manufacture trial-level rows or threshold brackets from a mean and SD. |
| Normal-gravity flow | Pages 3–4: 10 cm/s prescribed forced flow, additional buoyancy, obstruction-related deviations up to 4 cm/s. | Nominal 100 mm/s does not make this equivalent to the Ries microgravity tests. The deviation is not an established symmetric uncertainty interval for effective flow. |
| Heating changes along the rod | Page 4: four peak levels, 0/0.9/1.9/3.3 kW/m2, with a half-Gaussian axial profile. | Peak imposed flux is not the local flux at a moving front. Constant chamber settings do not imply an unchanged thermal state. |
| Model is not an executable validated predictor here | Page 5 equation 1 is a reported correlation. Pages 6–8 discuss heat transfer and kinetics; extracting limits from the mechanistic expression is outside the paper's scope because parameters are difficult to determine. | Store equations/parameter roles and locators; do not manufacture missing parameters or evaluate new physical predictions. |

The article's pressure range is 40–100 kPa. Its equation-1 reference values, including 101 kPa, oxygen mole fraction 0.183 and characteristic flux 100 kW/m2, are correlation parameters. They are not extra experimental rows, a generally safe oxygen level, or the applied heat-flux range. The 12.7 mm rods are described as between thermal thin/thick limits; the mechanistic discussion uses a thick-rod approximation.

## Comparison with current NASA work

NASA's [MIST Task Book, FY2026](https://taskbook.nasaprs.com/tbp/index.cfm?TASKID=A4E891655E49E9A6A0353DF3D9B4DE14&action=public_query_taskbook_content) distinguishes spread and regression limits in sealed recirculating tests, and reports lower limits at lower pressure. LIV24 instead prescribes the gas mixture and reports higher LOC at lower pressure. Heating is not matched. This unquantified contrast does not identify a causal effect or justify pooling. The endpoint distinction is prior work; IGNIS did not discover it.

## Implemented mathematical behavior

The primary output describes **observations**, not physical absence. Each run has three separate statuses at each oxygen setting: `sustainedFlameSpread`, `visibleFlame`, and `fuelRegression`, each `detected`, `not_detected`, or `unknown`. Each criterion carries method, observation window and resolution metadata. An explicit test-ended flag is an event only. The module makes no automatic implication from one criterion to another.

For each criterion and run it reports:

- The maximum oxygen setting with non-detection, L, and minimum with detection, U, including the exact step IDs that determine them.
- Last detected and first non-detected step IDs in submitted order, separate from coordinate extrema.
- Unknown and termination-only records, duplicate-coordinate groups, and the oxygen sequence direction.
- An observed pattern: no information, detected only, not detected only, ordered separation, or inconsistency with an idealized monotone binary model.
- An exact schedule gap U-L when both exist and L<U. This is not uncertainty, precision, a confidence interval or an optimal step size.

Every run stays separate. A run ID is a supplied grouping label, not verified experimental independence. Identical-coordinate detections/non-detections conflict with a deterministic fixed-state binary model; they are not averaged away. Such a conflict may reflect dynamics, observation error or history, rather than bad data.

### Optional conditional parameter sets

By default `idealizedModel` is null and no threshold parameter set is produced. Opting in requires all four explicit hypotheses: a monotone binary response, fixed context within each run, settled response at every step and error-free detection. Context and method/window/resolution metadata must also be present. Metadata presence is checked; the program cannot establish that these hypotheses or descriptions are physically true. Changed conditions/operators require separate records and scientific review, not a misleading shared run label.

Under this **declared mathematical model**, for transition parameter theta:

| Detection convention | Conditional compatibility set when L<U |
|---|---|
| Detected exactly when x >= theta | (L,U] |
| Detected exactly when x > theta | [L,U) |
| Boundary convention unspecified | Closed enclosure [L,U]; endpoint convention unresolved |

When L>=U, no deterministic monotone threshold satisfies both witnesses, including equal numeric coordinates such as `17.5` and `17.50`. The derived set is withheld. With one type of observation, only one side is constrained; the other is null, not artificially clipped to 0 or 100. With no informative observation, the status is `no_information`. No midpoint estimate or probability is generated.

A strictly descending series that ends at the first non-detection automatically separates the observed coordinates. The output flags that pattern and always reports `monotonicityValidated: false`. It does not establish steady-state behavior. Following flame-out, later non-detections can reflect an absorbing state, and increasing oxygen need not re-ignite a consumed or cooled sample. Finite holds and a moving front can defeat the fixed-state hypothesis. Fuel regression under external heating may not even have the assumed monotone oxygen response. These limitations are in every result, not merely this report.

### Hypothetical example, not manuscript data

The bundled example deliberately separates the criteria:

| Oxygen volume percent | Spread detected? | Visible flame detected? | Regression assessed? |
|---:|---|---|---|
| 20 | yes | yes | no |
| 19 | no | yes | no |
| 18 | no | no | no |

With the explicitly opted-in `x >= theta` convention, the mathematical sets are (19,20] for detected spread and (18,19] for detected flame; regression has no information. These are hypothetical observation sequences and assumptions, not measured LOC values, a source reconstruction, a material prediction or a test protocol. In particular, visible-flame non-detection does not establish the cessation of all combustion.

## Backend contract and reproduction

- `GET /api/endpoint-audit`: source dossier, limits and a hypothetical example with conditional calculations **off**.
- `POST /api/endpoint-audit`: full detached JSON audit. No network calls, persistence, provider or credential access.
- `npm run audit:endpoints -- --example`: same default output. `--input request.json` processes a local bounded request.
- Strict schema: `ignis-endpoint-audit-request-1`, role `hypothetical` or `user_supplied_unverified`, at most eight runs and 64 steps total, 32 KiB body cap. Oxygen is a decimal **string in volume percent**, not a fraction or coerced JSON number. Unknown observations are explicit. Unknown fields, aggregate mean/SD inputs and a `source_observation` role are rejected.

The [hypothetical request](../artifacts/endpoint-audit/hypothetical-request.json), [conditional audit](../artifacts/endpoint-audit/hypothetical-audit.json), and [verification receipt](../artifacts/endpoint-audit/verification.json) are portable. No actual paper response values are bundled. From `web/`:

```sh
npm run audit:endpoints -- --input artifacts/endpoint-audit/hypothetical-request.json
```

From the repository root, the standard-library arithmetic verifier can run without the source PDFs:

```sh
python -I research/analysis/verify_endpoint_audit.py web/artifacts/endpoint-audit/hypothetical-audit.json
```

Add `--pdf /path/to/canonical.pdf --alternate /path/to/alternate.pdf` for file, printed-method-anchor and duplicate-render checking; these optional checks need PyMuPDF. Without files, they are marked `NOT RUN`. The verifier uses Python Fraction and tests direct binary predicates at boundaries, between them and beyond observed extremes. It also rejects modified physical claims, fabricated source-data availability and altered counts. This second implementation shares the same AI-assisted authorship; it is not independent human validation.

## Verification, limits and next work

**390 shared offline tests pass**, including 27 new endpoint/API checks. A direct-predicate oracle covers all 27 three-level status assignments under both boundary conventions. TypeScript, lint and the webpack production build pass. The Python check agrees with the hypothetical result, verifies 11 printed manuscript anchors and confirms the two copies' identical text/nine renders. No figure measurements are digitized. Twelve production/source checks pass, including equality of both default and conditional API results with CLI/artifact output and the unchanged prior design API; see [local verification](LOCAL_VERIFICATION_2026-11-15.md).

The previous 17 curated collections and RIES24 design collection remain unchanged. Existing engine .5, renderer .5, descriptive method .2, r2 catalogue identity, frozen evaluation questions and source assessment/export schemas are preserved. This new standalone audit is not automatically added to older evidence packages. There is no new UI integration or visual test claim.

**NOT RUN:** physical model execution, fitting, experiments, reconstruction of trial-level observations, measurement/settling validation, arbitrary-source endpoint harmonization, independent human review, common-task competitor evaluation, runtime acceptance, deployment or NASA adoption. More complex ML cannot restore an unrecorded endpoint branch or trial transition from these aggregate plots alone. The technical advance here is explicit, testable handling of observation semantics and conditional inequalities; superiority over other tools remains unmeasured.

Next priorities are the full [Rivera 2026 manuscript](https://doi.org/10.1016/j.firesaf.2026.104719) and Christina Liveretou's 2025 dissertation, [Effect of Pressure and External Heating on Microgravity and Earth Gravity Fires](https://escholarship.org/uc/item/5px3896h). The dissertation's title/authorship were verified through the institutional record and Berkeley lab listing. Its full text was NOT READ: the web reader reported a 26.7 MB size limit and a verified-HTTPS direct retrieval returned 403. It may contain fuller methods or run records; that is an acquisition hypothesis, not a verified data inventory. The related Rivera paper, DOI 10.1016/j.proci.2026.106460, remains preview-only. LIV24 is now read and should no longer be requested as inaccessible.

## Claude/Fable assistance

The owner explicitly asked for Fable and Claude to speed the work. Fable 5.2 was used through the signed-in Claude Code account in parallel with implementation. The first, tool-free review of public facts/algebra completed in 84.677 s, reporting $0.3702818 at list prices. It identified hold-time, history, detection/physical-absence and vacuous-monotonicity limitations; those are incorporated. It did not inspect the PDF.

The second, public-web-only review completed in 151.401 s with six web calls and a $0.6556151 list-price estimate, including reported auxiliary Haiku 5.5 web processing. It found the dissertation lead but did not obtain Rivera's full text. Combined helper list estimate: $1.0258969, not a verified invoice or a runtime-evaluation charge. No permission denials were reported. No new application source, private project material, credentials or private evaluations were sent. These calls are AI assistance, not independent scientific validation.

The review sharpened the distinction between volume fraction and partial pressure, noted common program ancestry and cautioned against a causal trend interpretation. We did not adopt an unquantified suggestion that the reported trend lies within step resolution, a causal explanation from oxygen inventory alone, or an older Task Book rod length as a replacement for the manuscript's explicitly printed 55 mm. Source-study significance, historical apparatus differences and raw data still need examination. The primary assistant checked the current NASA text and dissertation identity independently of the helper's summarized retrieval, without claiming independent human review.
