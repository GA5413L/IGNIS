# Detector rank association and recorded-group sensitivity

15 November 2026. Method `detector-association-2026-11-15.1`.

The new operation asks whether two recorded detector channels co-vary in the same direction within a flight/material population, and whether that description changes when all rows carrying one recorded sample label are removed. It adds a statistical description that does not depend on an analyst's voltage cutoff. It does not fit a physical predictor, establish detector agreement, estimate alarm accuracy or correct the data's dependence structure.

## Actual data and a useful finding

The unchanged [curated detector collection](../data/detector-data.json) contains 154 cached workbook rows, including 20 DBP reference rows. Default selection is SAME-R (flight 2), all spacecraft materials, AW `ISS Detector Scatter (volts)` versus BK `Ion B Delta (volts)`. Both numbers are volts, but their measurement operators differ. The source is [NASA PSI-101](https://psi.nasa.gov/physci/repo/data/investigations/PSI-101), workbook `PSI-101_Analyzed Data_SAME, SAME-R_Results.xlsx`, SHA-256 `6d3a539ccf425b1fa8edc19cc75d828f57d650c7ce734d4e7aa686fea9593218`, worksheet `Material Sort`.

The default has 109 selected rows and 108 jointly finite AW/BK pairs. The missing pair remains visible with its cells AW50/BK50. Two standalone Python recounts were performed read-only: one used sorted tied ranks, the second counted smaller/equal observations directly. They agree on these descriptive results:

| SAME-R selection | Selected / paired rows | Recorded sample-label groups | Spearman rho | Range after deleting each whole recorded group |
|---|---:|---:|---:|---:|
| All spacecraft materials | 109 / 108 | 65 | 0.443582 | [0.417632, 0.502054] |
| Kapton | 30 / 29 | 16 | 0.023645 | [-0.209402, 0.139805] |
| Lampwick | 20 / 20 | 12 | 0.415194 | [0.244708, 0.542075] |
| Pyrell | 20 / 20 | 12 | 0.496241 | [0.320949, 0.611971] |
| Silicone | 22 / 22 | 14 | -0.618469 | [-0.667749, -0.546070] |
| Teflon | 17 / 17 | 11 | 0.627451 | [0.571429, 0.820588] |

Positive pooled co-ordering does not describe every material. Silicone's coefficient remains negative after each one-label deletion; Kapton's near-zero sign changes under some deletions. This is a source-specific finding about the ordering of stored values, not evidence of a physical mechanism or a material effect. Heating/aging conditions, sample reuse and instrumentation can also differ. The default was selected after exploratory examination of available channel combinations; it is not a preregistered hypothesis test.

**Amplitude matters to interpretation:** Silicone's 22 paired scatter readings occupy only **6.238405–6.2771295 V**, a span of **0.0387245 V**, with 21 distinct cached values. The corresponding ion-delta span is 0.685852–3.1034245 V (2.4175725 V). Spearman ranks ignore these amplitude differences. Stability under removing a recorded sample label does **not** establish stability to measurement error or rounding, calibrated sensitivity, or a physical mechanism. All 22 Silicone flat-profile status cells are unrecorded, as are all 109 SAME-R flat-profile cells in this collection. This is not proof of saturation, a plateau, or normal operation. No resolution/noise/saturation threshold is established or inferred here.

Every overall/flight/material summary includes paired `rangeA`/`rangeB` minimum, maximum, span and exact endpoint record IDs, in the selected channels' volts. These ranges use the same jointly finite pairs as rho, not mismatched marginal populations. A single finite pair still has a range even though the display policy suppresses its coefficient. No paired observations gives null bounds; an unrepresentable floating-point span is explicitly null with `spanStatus: 'overflow'`. Raw endpoints remain available. Individual deletion records retain the coefficient, rank products and removed row IDs without duplicating every tied range witness; the retained source rows suffice to recompute them. The UI should show ranges alongside rank plots and coefficients; no automatic saturation or plateau flag is justified.

Including both flights gives 134 spacecraft rows and 133 finite pairs, rho 0.475383. Flight 1 contributes 25 rows and has no recorded sample IDs in this collection. The pooled deletion audit therefore refuses to invent groups; flight 2's separate audit remains available. For AW versus AV obscuration within flight 2, all 108 finite AV readings are cached zeros: the coefficient is **undefined**, not zero. Those zeros do not establish sensor operation.

## Statistic and exact bookkeeping

For the selected jointly finite pairs `(x_i, y_i)`, assign each tied set the average of its occupied ranks. Compute Pearson correlation of those ranks:

`rho = sum((R_i - Rbar)*(S_i - Sbar)) / sqrt(sum((R_i - Rbar)^2)*sum((S_i - Sbar)^2))`.

This is standard Spearman rank correlation. The primary software documentation describes the monotonic-association statistic and its undefined constant-input case; its ranking documentation specifies the average-rank convention. No p-value from those APIs is used. [SciPy Spearman documentation](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.spearmanr.html), [SciPy average-rank documentation](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.rankdata.html), inspected 15 November 2026.

Implementation uses centered doubled ranks `u_i=2*R_i-(n+1)` and `v_i=2*S_i-(n+1)`. These are integers even with ties. The exported cross-product and two sums of squares are exact integers for this bounded, at-most-154-row collection; only the final square root/division uses floating point. Exact equality of admitted cached numbers defines ties. No decimal rounding, jitter, epsilon or source correction is applied. Source numeric-cache admission remains strict, and the existing Webpack/source-identity requirements still apply.

The coefficient is null for a constant input or fewer than three finite pairs. Two nonconstant pairs mathematically produce a coefficient of +1 or -1; suppressing that case is an explicit product display policy, not a claim of mathematical nonexistence. Three pairs is not an adequate-inference threshold. Marginal finite/missing/error/non-numeric counts and the four paired-availability counts accompany every summary. Missing readings are not zero and no missing-value completion interval for correlation is claimed.

## Dependence and deletion interpretation

Pairing uses the exact workbook hash, sheet and Excel row. It does not join on sample, test, carousel or displayed labels. For deletion only, a block is the exact recorded tuple `(flight, sampleId)`; both parsed labels must match their retained source cells. All selected rows in that block are removed together, including unavailable-channel rows, and ranks are recomputed on the remaining finite pairs.

If any selected row in a summary lacks a usable matching label, group deletion is skipped for that summary. We do not silently drop the unlabeled row or invent one-row groups. The same operation is available independently within the flight and material strata with complete labels. A single group cannot support a between-group deletion range. Deletions leaving fewer than three pairs or constant channels remain listed as undefined rather than disappearing.

The reported minimum/maximum range enumerates those finite deletion operations. It is **not** a confidence interval, bootstrap interval, standard error, proof of statistical independence, or bound against all unobserved data. It does not guarantee robustness to removing multiple groups or changing measurement operators. No p-values, random permutations, IID bootstrap, population effect or causal estimate are produced. A recorded label is not proof of a distinct independent burn: this source includes secondary aging and reused samples, and shares apparatus/calibration. The unresolved workbook/condition-table identity conflict is retained without a cross-source reconciliation.

## API, export and validation

[`detectorAssociation.ts`](../src/core/detectorAssociation.ts) exports `analyzeDetectorAssociation(selection, optionalDataset)`, `DetectorAssociationSelectionSchema`, the default selection, typed result, `createAssociationPackage(result)` and `replayAssociationPackage(text)`. Selection has only `flight`, `material`, `includeReference`, `channelA`, and `channelB`; unknown fields and equal channels are rejected. All supplied datasets pass the existing detector schema, and outputs are detached and deterministic. The result retains every selected record, source cell, raw value/status, overall paired rank, source metadata, unresolved identities, method and claim limits. Nested flight/material tables prevent pooled and within-flight coefficients being confused.

The package is `{schemaVersion:'ignis-association-export-1', result, resultSha256}`. Replay caps UTF-8 input at 2 MiB, checks wrapper fields and checksum, rejects source/method drift, and recomputes the complete result from the currently pinned dataset and selection. A rechecksummed altered result still fails recomputation. Success returns the recomputed result. No workbook binary or historical execution environment is embedded; arbitrary historical/injected-source replay is not promised. Checksums establish consistency, not authorship or scientific validity.

The optional offline CLI is `tsx scripts/analyze-association.ts [--selection selection.json | --replay package.json] [--out package.json]`. The output path must be new; exclusive creation prevents overwriting an existing file. No provider or network call occurs. Selection files are bounded to 16 KiB; exported/replayed packages use the same 2 MiB ceiling. The application exposes this operation through Smoke detection → Statistical relationships.

The new unit tests cover the actual counts/signs/deletion witnesses, an independent pairwise-rank oracle, ties, finite zero, constants, the display minimum, all missingness classes, source/label identity, complete-group removal, undefined deletions, paired ranges and witnesses, permutation/ordinary-unit invariance, channel symmetry, detached outputs and checksum/source/method/recomputation rejection. The final module and application pass the shared 565-test offline suite, production source-identity checks and desktop/mobile association tests. The default package has result SHA-256 `5d7b10b5f2c8722a85b92e29f59c4ecd7fe973840be56e69ed1bef656a2289cf`; CLI replay reproduces it against the pinned source. The Python script recomputes 281 overall/stratum/deletion coefficients from exported cells and regenerates the figure. [Final receipt](../artifacts/refinement/verification.json). Interactive legend visibility is separate from this analytical selection; [the view contract](FIGURE_VISIBILITY_2026-11-15.md) defines its fixed axes, unchanged ranks and export recipe.

Saffire model-residual fitting remains unjustified here: synchronized measured/model output series are explicitly unavailable, normalization inputs are not independent validation observations, and the few reported integral totals do not supply a residual distribution. RIES24 provides nominal design support and an existing exact identifiability audit, but this module has no run-level response table. Neither gap is repaired by fitting a more flexible learner. The new association audit is a bounded statistical analysis, not an ML performance claim or a forecast of competition results.
