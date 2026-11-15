# Source conflicts register

Status as of 2026-10-20. Every entry keeps **all** conflicting values with their exact locations. Nothing here is
corrected in the data files. "Treatment" says what an analysis may do with the affected records until the conflict
is resolved. A conflict counts as **resolved** only when an original author, NASA, or primary record settles it,
not when we find one reading more plausible.

Source keys: **[L18]** Link et al. 2018 article PDF (page numbers are PDF pages); **[L18-ESM]** its Supplementary
Information PDF; **[TM]** NASA/TM-20210011385 (PDF page / printed page). Full identifiers are in
`research/source_register.md`.

## Summary

| ID | Topic | Severity for the rod case | Affected records | Status |
|---|---|---|---|---|
| C-01 | Rod diameter written as "0.64 mm" once | low | B16, B19 | open (likely typographic) |
| C-02 | V_f unit label cm/s vs mm/s within Table S1 | **high** for absolute values | all 26 right-half rows (d = 0.64 cm) | open; **cm/s reading now also supported by NASA TM Fig. 4.1** (audit 20 Oct b) |
| C-03 | Flow configuration of B16/B19: opposed (Link; NASA Ch. 4 by inference) vs **Concurrent** (NASA Table A.3 only) | high (was "critical") | B16, B19 (Link's headline Fig. 6a series) | **GENUINE UNRESOLVED CONFLICT; evidence favours opposed** (`b16_b19_discrepancy_review.md`) |
| C-04 | O₂ for B15: 18.4 vs 18.0 | medium | B15 | open (merged-cell hypothesis added) |
| C-05 | One O₂ per burn vs recorded O₂ drift during the burn | medium (confounder) | all μg rows | definition gap |
| C-06 | Low-flow limit for spread: 0.6 cm/s vs ≈4 mm/s vs tabulated 0.41–0.48 cm/s | high for any "limit" query | rod low-flow claims | open |
| C-07 | Lowest μg O₂ with spread: 17% vs 17.5% | high for LOC queries | LOC claims | open |
| C-08 | Lowest 1 g O₂ with spread: 18 / 18.5 / 19% vs Table S2 values at 18.0% and 17.5% | high for LOC queries | LOC claims, Table S2 | open |
| C-09 | μg vs 1 g ordering of spread rate | high for gravity queries | gravity claims | open |
| C-10 | Flow-velocity trend: non-monotonic (Link) vs increasing (NASA) | medium | trend claims | interpretive |
| C-11 | 1 g diameters "3.2-cm and 1.9-cm" vs Table S2 0.32 cm | low | Table S2 metadata | open |
| C-12 | Dwell per flow step: "about 30 s" vs "at least 1 min" vs Δt = 23–33 s rows | medium | Δt semantics; B1, B2, C3a | open |
| C-13 | Abstract O₂ range "15% to 21%" vs Methods "16% and 21%" | low | metadata | open |
| C-14 | Label schemes; cross-source label collisions (**B16 and B19** = rods in Link, thin films in NASA A.1) | **high** for joins | all labels | mitigated by rule: no label-only joins |
| C-15 | B22 = one label, two NASA burns? | high for B22 | B22 (4 rows) | open; hypothesis strengthened (same-day V_g pattern; Table 4.1 burn count) |
| C-16 | Implausible O₂ cells in NASA rows P22a/P22b | medium | P22a, P22b | open (source data quality) |
| C-17 | NASA Table 4.2 flow range for 9.525 mm rods | low | metadata | open |
| C-18 | Test-condition counts: NASA Table 4.1 vs Table S1 | low | completeness | partly reconciled (3 of 5 groups match exactly; 2 off by one condition) |
| C-19 | Rod size given as radius without saying so (NASA Fig. 4.4 caption) | medium for geometry fields | NASA Fig. 4.4 | inferred |
| C-20 | Pooled thicknesses / wording of agreement in Table 2.1 context | low | auxiliary case | noted |
| C-21 | Duplicate conditions with different values | medium | S2-L20/L21; B22 rows | open |
| C-22 | Figure-to-table traceability (Figs 6b, 7) | medium | figure data | not reproducible from tables |
| C-23 | Flow histories not monotonic as Methods imply | medium | B16, B19, P17 | open |
| C-24 | What V_g in Table S1 is: identical V_g sequences recur across burns on the same day (nominal per-setting calibration values?) | medium (definition gap) | all Table S1 rows; cross-day V_g comparisons | inferred; no source statement |
| C-25 | NASA TM Fig. 4.1 x-axis labelled "Flame velocity, cm/s"; caption says "opposed-flow velocity" | low | figure only (never digitised) | noted |
| C-26 | Shared atmosphere: some burns start exactly at the previous burn's final O₂/CO₂/CO readings (sealed work volume), while [L18] says O₂ was kept "constant" | **high** for cross-burn and O₂-limit questions | P4, P9 (B9), P17, P15, P2, P3b and others (list in details) | added 21 Oct; observed pattern + NASA statement; carry-over itself inferred |
| C-27 | [L18] Fig. 8(c) 1.27-cm μg curve below the 1 g limit passes through a symbol at B9's O₂; the reburn is not mentioned in the article or ESM | medium (traceability) | B9; Fig. 8(c) | added 21 Oct; visual only, never digitised |

## Details

### C-01: "0.64 mm" diameter wording
- [L18] p.4, Results: "…opposed flame spread in microgravity over a **0.64 mm** diameter black cast PMMA rod at two oxygen concentrations… of 17.5% and 18.2%" (describes Fig. 4 = samples B16, B19).
- [L18] p.3, Methods: microgravity rods "with diameters of **6.4, 9.5, and 12.7 mm**".
- [L18] p.5, Fig. 6 caption: "(Sample B16, **0.64 cm**)… (Sample B19, **0.64 cm**)"; p.4: "thin **0.64-cm** sample".
- [L18-ESM] Table S1: d = **0.64** (header "(cm)"); Fig. S1 caption: "black PMMA rod of **0.64 cm** diameter".
- [TM] p.114/106, Table A.3: P16, P19 "**6.35-mm** black rod"; p.55/47: "6.35, 9.525, and 12.7 mm (1/4, 3/8, and 1/2 in.)".
- Treatment: nominal 6.35 mm (¼ in.) is recorded as the NASA value, with Link's 0.64 cm as its rounded form. The single "0.64 mm" is kept as a conflicting source statement. B16/B19 are already quarantined under C-03, so no admitted comparison depends on resolving C-01.

### C-02: unit label of V_f within Table S1
- [L18-ESM] p.1, Table S1: left-half header "V_f×10³ **(cm/s)**" (d = 1.27, 0.95 cm); right-half header "V_f×10³ **(mm/s)**" (d = 0.64 cm). Table S2 uses "(cm/s)" in both halves.
- Internal evidence (not a resolution):
  1. [L18] p.5, Fig. 5 plots the 0.64 cm points on the same axis "Flame spread rate, V_f × 10³ (cm/s)" as the 0.95 and 1.27 cm points, at the same magnitude (2–10).
  2. [L18] p.5, Fig. 6a (axis "V_f × 10³ (cm/s)") shows B16 at about 5.7, 7.0, 7.6, 6.8 and B19 at about 5.4, 6.3, 6.5, 4.7. These match the right-half Table S1 values (5.68, 6.99, 7.62, 6.78 / 5.44, 6.25, 6.52, 4.69) read as cm/s.
  3. [L18-ESM] Fig. S1 (B16, U_g = 1.7 cm/s): the leading edge moves roughly 12 mm in roughly 160 s. That is about 0.08 mm/s, i.e. about 8 × 10⁻³ cm/s, which matches 7.62 under the cm/s reading and not under the mm/s reading (which would mean about 1 mm in that time). This is an approximate visual reading for an order-of-magnitude check only; it is never used as data.
  4. [L18] p.4: "flame spread over thin 0.64-cm sample is clearly faster than thick samples". Under the mm/s label, the 0.64 cm rods would be ten times *slower*.
- Treatment: right-half rows are **CONDITIONAL**. Ratios and signs *within* a right-half burn are allowed, since they don't depend on the unit. Absolute values must be shown under both readings (×10 µm/s or ×1 µm/s per printed unit) and are never pooled with left-half values without the flag. The likely typo has not been "fixed" in the data.
- **Update, 20 Oct (audit):** a second document now supports the cm/s reading. [TM] PDF p.57 / printed p.49, Fig. 4.1, 0.635-cm panel, plots these points on a "Flame spread rate, cm/s" axis at about 0.002–0.010 (e.g. about 0.010 for B6's 10.00, and about 0.0068 at about 7.6 cm/s for B16's 6.78). That matches the cm/s reading; under the printed mm/s label they would sit ten times lower. This is a visual reading, not digitised. Proposed (D-019): a separate, **human-reviewed** normalised record. The as-printed CSV stays unchanged. D-007 stands until that review.

### C-03: flow configuration of B16 and B19
- [L18] p.4: Fig. 4 is "a sequence of photos from an **opposed** flame spread in microgravity" for X_O₂ 17.5% and 18.2% (Samples B16, B19). Fig. 6a presents both as opposed-flow data, and the headline non-monotonic finding (abstract, p.1; p.5) rests on these two series. Link selected them "because they were tested under a larger range of the flow velocities and their measurements are more consistent" (p.5).
- [TM] PDF p.114 / printed p.106, Table A.3: P16 (sample 191m, 6.35-mm black rod, cal. O₂ 18.2 → 17.4) and P19 (sample 194m, 6.35-mm black rod, cal. O₂ 17.5 → 16.7) both carry **"Concurrent"** in the configuration column. **Visually verified** on a 150-dpi render on 2026-10-20. Every other black-rod test in Table A.3 shows "Opposed". The column header reads "Sample distance"; see `research/data/README.md`.
- Matching evidence for B16↔P16 and B19↔P19: same number, same nominal diameter, black in both, Link O₂ = NASA calibrated initial O₂ (18.2; 17.5), and NASA air-display sequences ("5, 8, 2, low"; "5, 8, 2, maximum, 0") consistent with Link's V_g values (7.55, 1.67, 0.83, 0.72).
- Treatment: B16 and B19 are **QUARANTINED** for any opposed-flow question, and also for any concurrent-flow question. We don't know which source is wrong. Link's non-monotonic trend is kept as a **source-reported result** and is not reproduced as a verified opposed-flow observation. Resolution path: contact the authors or NASA GRC, or inspect PSI BASS-II video/overlay data if access is obtained (see BLOCKERS.md B-03).
- **Update, 20 Oct (adversarial audit; full detail in `b16_b19_discrepancy_review.md`):**
  - **Evidence the burns were opposed:**
    - [TM] Ch. 4 is the opposed-flow task. Its Table 4.1 (23 conditions, 9 burns for black 6.35 mm) and Table 4.2 (6.35-mm range up to 0.075 m/s) reconcile with Table S1 only if B16/B19 are included.
    - [TM] Fig. 4.1 ("versus opposed-flow velocity") shows two 0.635-cm points near 7.6 cm/s. Only B16/B19 have that flow.
    - Link's Fig. 4 photographs match NASA's labelled "opposed rod" images ([TM] Fig. 1.2 c, g), not its "concurrent rod" image (f).
    - P16/P19 used igniter –36, as did the PI's opposed burns; the same-day Olson concurrent tests used –29 and –31.
    - Olson's concurrent-rod chapter reports only two black rods, O11 and O14 ([TM] p.75/67; Table A.5), not P16/P19.
  - **Evidence the burns were concurrent:** the A.3 entries themselves. Also, P16/P19 (as-run 93–94) sit inside a block of Olson concurrent tests (as-run 89–92 on 21 Jul, 95–96 on 22 Jul).
  - **Crosswalk:** B16↔P16 and B19↔P19 are established by diameter, colour, unique initial O₂, the unique 8-cm/s step and the burn ending.
  - **Classification:** **GENUINE UNRESOLVED CONFLICT, evidence favours opposed.** The quarantine is kept. Severity is lowered from "critical", because the dispute rests on one appendix column against converging documents.
  - **Framing correction:** the earlier statement that "the literature's headline result depends on the two records whose flow configuration is in dispute" omitted the contrary NASA evidence. It must not be used without that context (D-016, D-017).

### C-04: oxygen for B15
- [L18-ESM] Table S1: B15 and B14 share one merged X_O₂ cell, "18.4".
- [TM] Table A.3: P14 cal. initial **18.4** (final 18.0); P15 cal. initial **18.0** (final 17.5).
- Treatment: B15 (one row) is QUARANTINED. B14 is consistent.
- **Update, 20 Oct (audit):** in the 220-dpi render, "18.4" is a single merged cell spanning the B15 and B14 rows. Hypothesis (unverified): a typesetting merge gave B15 its neighbour's O₂. The PSI-25 table copy gives P15 = 18 and P14 = 18.4, agreeing with [TM].

### C-05: one O₂ per burn vs O₂ drift within a burn
- [L18-ESM] Table S1 gives one X_O₂ per sample. For 17 of 19 labels it equals the NASA **calibrated initial** O₂ exactly; B15 (C-04) and B22 (C-15) are the exceptions.
- [TM] Table A.3 records calibrated **final** O₂ lower by 0.0–1.7 percentage points (e.g. P13a 20.7→19.1; P5 19.3→17.6; P4 18.5→17.1; P6 18.9→18.5).
- [L18] p.6, Fig. 7 caption: "the uncertainty of oxygen concentration in microgravity is ±0.3%". p.4: "it was difficult to determine how accurate were the values for oxygen concentration and flow velocity".
- Treatment: not a value conflict but a **definition gap**. The O₂ attached to a row is the O₂ at the start of the burn, not at that segment. Every within-burn comparison carries the drift range as a confounder. No "constant O₂" claim is allowed.

### C-06: low-flow limit for flame spread on rods
- [L18] p.4: B16/B19 "eventually extinguished when the flow velocity was reduced below **0.6 cm/s**"; p.5: "No flame spread was observed at flow velocities less than **0.6 cm/s**" (scope ambiguous: all tests, or Fig. 6a tests only).
- [L18] p.1 abstract and p.3: flows "ranging from **0.4 to 8 cm/s**".
- [L18-ESM] Table S1: rates are tabulated at **0.48 cm/s** (B12, 0.95 cm) and **0.41 cm/s** (P17, 0.64 cm).
- [TM] p.56/48: "Sustained flame spread … was not observed for opposed-flow velocities below approximately **4 mm/s** for the 0.00635- and 0.009525-m-diameter rods."
- Treatment: no single rod "low-flow extinction velocity" is admitted. Each statement is kept with its scope. This is also a *different endpoint* from thin-sheet V_g,cr (see `endpoint_dictionary.md`, E-03 vs E-04).

### C-07: lowest O₂ with spread in microgravity
- [L18] p.1: spread "sustained at lower oxygen concentration (**17%**)"; p.6: "in microgravity, there is still flame spread at X_O₂ = 17%".
- [L18-ESM] Table S1: lowest rows are 16.8% (P17, colour not stated) and 17.0% (B10, black).
- [TM] p.58/50: "in microgravity, flame spread was observed at O₂ concentrations as low as **17.5 percent**".

### C-08: lowest O₂ with spread in normal gravity
- [L18] p.1: "(**18%**)"; p.6: "flame cannot exist in normal gravity for X_O₂ = **18% and below**"; p.5, Fig. 6 caption (1.27 cm): "flame cannot be sustained at X_O₂ < **18.5%**".
- [L18-ESM] Table S2 prints spread rates at **18.0%** (0.64 cm: 4.69 and 3.13; 0.32 cm: 4.35 and 8.00) and **17.5%** (0.32 cm: 3.88).
- [TM] p.58/50: "in normal gravity, flame spread was not observed below **19 percent**"; p.57/49: "the lowest O₂ concentration at which all four tested rod diameters were successfully burnt … was 19 percent".
- Treatment: any "LOC" answer must name diameter, flow, protocol and source, and show the disagreement. Neither source's LOC is admitted as a general value.

### C-09: microgravity vs normal-gravity ordering
- [L18] p.6: at 21% "the flame spread is faster in normal gravity"; "below X_O₂ = 19% the flame spread becomes faster in microgravity".
- [TM] p.59/51: "flame spread in microgravity is appreciably faster than in 1g for cylindrical rods of PMMA" (Fig. 4.3: "All O₂ concentrations and flow velocities for microgravity experiments are averaged over associated test conditions").
- Treatment: conflicting generalisations from overlapping authors on the same campaign, with different aggregation. Both are kept as claims. See Evidence Case 02 N1 for why a matched-row comparison does not settle this.

### C-10: flow-velocity trend
- [L18] p.5: "as the opposed flow velocity is increased, the flame spread rate first increases, and then decreases" (B16/B19 only; see C-03).
- [TM] p.56/48: "the average flame spread rate increases with opposed-flow velocity, even within the small range of flow velocities tested."

### C-11: normal-gravity diameters
- [L18] p.4: "additional **3.2-cm and 1.9-cm** thick samples were also tested" in 1 g.
- [L18-ESM] Table S2 diameters: 1.27, 0.95, 0.64, **0.32** cm. Fig. S2 marks 0.32 cm. There is no 3.2 cm or 1.9 cm row.

### C-12: dwell per flow step and the meaning of Δt
- [L18] p.4 Methods: "pausing (**about 30 s**) along the way"; p.4 Results (Fig. 4 tests): "Each time step was **at least 1 min**".
- [L18-ESM] Table S1 Δt (s) includes 23 (B1), 24 and 28 (B2), 30 and 33 (C3a). The caption does not define Δt.
- Treatment: Δt is stored as printed with meaning **unknown**. Reading it as the length of the measurement window is plausible (Fig. S1 track durations look similar for B16), but not established. Short-Δt rows are flagged.

### C-13: abstract O₂ range
- [L18] p.1: "oxygen concentrations from **15%** to 21%"; p.3: "varied between **16%** and 21%"; Table S1 minimum 16.8%. NASA's *uncalibrated* O₂ goes as low as 15.0 (P21a/b), but those tests are not in Table S1.

### C-14: label schemes and collisions
- [L18-ESM] Table S1 "Sample No." uses B (black) and C (clear) prefixes, plus one **P17** that the caption does not define.
- [TM] Table A.3 uses **test numbers** P1…P25 and separate **sample numbers** (physical specimens: 185m, 191m, 819L, …). Link's "Sample No." matches NASA's *test* number, not NASA's *sample* number.
- [TM] PDF p.111/103, Table A.1 (Bhattacharjee thin-film matrix): test **B16** is sample 150m, "2-cm 100-µm-thick PMMA" film, opposed. B1 and B10–B22 there are also thin films. **Same tokens, different experiments.**
- Treatment: joins on label strings alone are forbidden. The Link↔NASA crosswalk (`research/data/crosswalk_link2018_S1_to_bass2_A3.csv`) is a candidate mapping scored on diameter, colour, O₂ and configuration.
- **Update, 20 Oct (audit):**
  - **B19 collides too.** [TM] Table A.1 B19 = as-run 52, 7/2/14, sample 151m, "2-cm, 100-µm-thick PMMA", Opposed; B20 = 152m film ([TM] p.111/103). Both of Link's headline labels therefore name thin-film tests in NASA's appendix.
  - **The hazard is live.** The public competitor tool MicroFire Atlas uses NASA's film B16/B19/B20 (`research/prior_art_comparison.md`).

### C-15: B22 identity
- [L18-ESM] B22: one label, X_O₂ 20.8, four rows, V_g 1.58 **twice** (6.45 and 8.31).
- [TM] P22a (cal. O₂ 20.8) and P22b (cal. O₂ 20.0) are two burns of the **same specimen 200m**. P22a: "Extinguished at higher flow, possibly rod not preheated enough"; P22b: "Extinguished at lower flow than P22a".
- Hypothesis (unverified): B22 merges P22a and P22b. Treatment: B22 is **INDETERMINATE**.
- **Update, 20 Oct (audit):** the hypothesis is strengthened, though still inferred.
  1. On 7/8/14, P25 (pots 0.36, 0.34, 0.33) maps to C25's 1.58, 1.52, 1.48. That fits pot 0.36 → 1.58 that day. P22a (pots 5, 0.36, 0.32) and P22b (5, 0.36, 0.34, 0.33, …) would then give exactly B22's 1.58, 1.58, 1.52, 1.48.
  2. [TM] Table 4.1 lists 4 black 9.525-mm burns. Table S1 has 4 only if B22 counts as two.
  The two 1.58 rows probably come from **different burns of one specimen**, so they must never be averaged.

### C-16: NASA row anomalies P22a/P22b
- [TM] PDF p.115/107: P22a calibrated final O₂ printed "0.6"; P22b calibrated final O₂ "39.1", with its calibrated initial "20.0" printed in **red**; neighbouring CO₂/CO cells are blank or shifted. Visually verified. Treatment: these O₂ values are unreliable and are not used.
- **Update, 20 Oct (audit):** the PSI-25 table copy (third-party; see `prior_art_comparison.md`) carries the same 0.6 and 39.1. So the anomaly sits in the underlying log, not in the TM typesetting.

### C-17: NASA Table 4.2 flow range for 9.525 mm rods
- [TM] p.56/48, Table 4.2: flow velocity "0.043 to 0.02" m/s for 0.009525 m rods. Table S1 0.95 cm rows span 0.48–2.00 cm/s (0.0048–0.020 m/s). The 6.35 mm range (0.0041–0.075) and the 12.7 mm range (0.0137–0.0164) are consistent with Table S1.

### C-18: counts
- [TM] p.55/47, Table 4.1: black PMMA test conditions 23 / 12 / 12 (6.35 / 9.525 / 12.7 mm), total 47; samples burnt 9 / 4 / 4. Clear: 4 / 3 / 0 conditions.
- [L18-ESM] Table S1: B-prefixed rows 20 / 11 / 12 (43), plus P17 3 rows at 0.64 cm. C-prefixed rows 3 / 3 / 0.
- If P17 is counted as black, 6.35 mm matches (23) and nine labels match nine samples. Then 9.525 mm black (11 vs 12) and 6.35 mm clear (3 vs 4) are each one short. Not reconciled.
- **Update, 20 Oct (audit):** reading "samples burnt" as **burns**, with B22 counted as two burns:

  | Group | Burns | Conditions |
  |---|---|---|
  | black 6.35 mm | 9 = 9 | 23 = 23 |
  | black 12.7 mm | 4 = 4 | 12 = 12 |
  | clear 9.525 mm | 1 = 1 | 3 = 3 |
  | black 9.525 mm | 4 = 4 | 12 vs 11 |
  | clear 6.35 mm | 2 = 2 | 4 vs 3 |

  So the table is partly reconciled. This supports P17 = black and B22 = two burns, both still inferred. The PSI-25 table copy also lists P17 as `1/4"  black rod` (unverified against PSI).

### C-19: radius vs diameter in NASA figure captions
- [TM] p.60/52, Fig. 4.4 caption: "Black PMMA rod, **4.76 mm**… (f) Black PMMA rod, **3.18 mm**, 16.3 percent O₂, at 5 cm/s". These are half of 9.525 and 6.35 mm. The caption does not say radius. Chapter 6 (PDF p.75) states radii explicitly ("r = 0.318 cm").
- Inference: the caption values are radii. Fig. 4.4(f) (16.3% O₂, 5 cm/s, flame burned the tip then extinguished, "never spread along the outer surface") matches Table A.3 P21a (6.35-mm black rod, cal. O₂ 16.3, air 5, "Flame self-extinguished at 5 cm/s after sample end became flat"). That match is a candidate, not verified.
- Treatment: geometry fields must record `size_kind ∈ {diameter, radius, unspecified}`.

### C-20: Table 2.1 context (auxiliary thin-sheet case)
- [TM] p.36/28: the experiment column pools results "from four different fuel thicknesses". The paragraph under the table calls the agreement "reasonable", and §2.2.8 Conclusions on the same page says the formula "agrees remarkably well". The meaning of ± (e.g. "10±5") is not defined.

### C-21: duplicate conditions with different values
- [L18-ESM] Table S2: d 0.64 cm, X_O₂ 18.0%, V_g 2 cm/s printed twice: 4.69 ± 1.0% and 3.13 ± 2.3%.
- [L18-ESM] Table S1: B22 has V_g 1.58 twice (6.45, 8.31); see C-15.
- Treatment: never average silently. Both values are kept as separate records.

### C-22: figure-to-table traceability
- [L18] Fig. 6b (1 g, 1.27 cm, ~1–500 cm/s, 21% and 19%) has no tabulated data. Table S2 lists only V_g = 25 and 2 cm/s.
- [L18] Fig. 7 μg points ("around 2 cm/s", legend 20.9/19.0/17.5%) could not be mapped one-to-one to Table S1 rows: Table S1 has no black-PMMA row at 20.9% or 19.0%. The 1 g curves are "fitted from experimental data", so they are **model-derived**, not observations.
- Treatment: figure values are not digitised or used as data.

### C-23: non-monotonic flow histories
- [L18] p.4 Methods: flow "subsequently reduced until extinction was observed".
- [TM] Table A.3 air-display sequences: P16 "5, 8, 2, low"; P19 "5, 8, 2, maximum, 0" ("Tried blowoff, did not blowoff"); P17 "5, 3, 2, 22, 2, low" ("tried blowoff without success, turned back down"). P18, P20, P23 and P24 alternated flow between settings.
- [L18] p.4: B16/B19 flow "was initially 7.6 cm/s". NASA's air display starts at 5.
- Treatment: flow history (thermal history) is a protocol variable. Rows from burns with flow excursions carry a `protocol_deviation` flag.

### C-24: what V_g in Table S1 represents (added 20 Oct, audit)
- **Sources:**
  - [L18] p.3: "The fan voltage was calibrated with the hot wire reading at the end of every ops day."
  - [TM] p.12/4: the airspeed transducer "had a response time of approximately 1 minute."
- **Pattern** (Table S1 against the Table A.3 dates): burns on the same day carry identical V_g sequences.
  - 3 Jul: B4, B6, B10 at 2.00 / 1.87 / 1.73, all at pots 0.4 / 0.36 / 0.32.
  - 14 Jul: B13a, B13b, B5, B9 at 1.64 / 1.54 / 1.43 / 1.38.
  - 8 Jul: B22, C25 at 1.58 / 1.52 / 1.48.
  - 22 Jul: B16, B19 at 7.55 / 1.67 / 0.83 / 0.72.
- **Inferred:** V_g is a nominal per-setting value from the daily calibration, not an independent measurement in each segment. The same pot appears to map to different V_g on different days.
- **Treatment:**
  - Within-burn ΔV_g is reported as a **nominal** difference.
  - Any cross-day comparison of V_g carries an unquantified calibration term.
  - No source states this, so it stays a definition gap.

### C-25: TM Fig. 4.1 axis label (added 20 Oct, audit)
- [TM] p.57/49: the x-axes read "Flame velocity, cm/s", while the caption reads "Flame spread rate versus opposed-flow velocity". This only matters if anyone digitises the figure, which this project does not do.

### C-26: shared atmosphere between consecutive burns (added 21 Oct, third session)
- **Sources:**
  - [TM] p.14/6: "The sensor data provided initial and final conditions for repeated tests in a sealed working volume and allowed us to determine when the working volume needed to be purged. The O2 decreased during each burn and the CO and CO2 increased accordingly." Also: "Sensor readings were taken before and after each BASS–II test", and dilution "typically took 1 to 3 h".
  - [L18] pp.3–4: "Keeping the flow oxygen concentration constant, each PMMA sample was ignited …"; "Multiple tests were conducted for each PMMA sample by keeping the airflow of constant oxygen concentration."
- **Pattern** in [TM] Table A.3 (pp.114–115 / 106–107; text layer and 150/220-dpi renders). For burns with adjacent as-run numbers, the second burn's initial calibrated O₂, uncalibrated O₂, CO₂ and CO equal the first burn's final values:
  - **4 of 4 equal:** P6→P4 (18.5 / 17.6 / 0.62 / 64); P10→P8; **P5→P9 (17.6 / 16.7 / 1.67 / 525)**; P12→P17; P14→P15; P21a→P21b; P18→P24; P20→P23.
  - **3 of 3 comparable:** P3a→P3b.
  - **3 of 4:** P1→P2 (calibrated O₂ differs by 0.1).
  - **Not carried over:** P2→P3a; P15→P21a; P4→P10 (O₂ similar, but CO₂ 1.8 → 0.29 and CO 493 → 2); P9→P13a; P13a→P13b; P22b→P25; P24→P20.
  - **Near, not equal:** P16→P19.
  - **Cannot assess:** P22a→P22b (C-16).
- **Confirmed:** the equalities as printed, and NASA's statement on sealed, repeated tests.
- **Inferred:** in the 4-of-4 cases the work volume was not purged or re-diluted between burns, so the later burn began in the earlier burn's residual atmosphere. If the initial cells were copied from the previous final cells, the inference is the same.
- **Unknown:** what happened between burns that were not carried over (purge, dilution, or both).
- **Effect:**
  - "Constant oxygen" holds neither within a burn (C-05) nor necessarily between burns.
  - Burns sharing an atmosphere are not independent in their starting conditions.
  - The independence group stays the specimen (D-009). A shared-atmosphere annotation is added (D-023).
  - B9 is a reburn **and** began in its own first burn's atmosphere (Evidence Case 03).
  - CO₂ and CO are **not** in `bass2_TM20210011385_tableA3_rods.csv`; the as-printed CSV is unchanged.

### C-27: Fig. 8(c) and specimen history (added 21 Oct, third session)
- **Sources:**
  - [L18] Fig. 8(c) (p.7; 1.27 cm) shows μg symbols at about 17.6, 19.3 and 20.6–20.7 % O₂, plus a zero-rate symbol near 16.5 %. The fitted μg curve crosses below the 1 g "Blow off" band through the ≈17.6 % symbol (render `_raw/audit_2026-10-20c/L18_fig8c_400dpi.png`).
  - Table S1's only 1.27-cm burn at 17.6 % is B9, the second burn of specimen 202m ([TM] A.3).
  - The article and supplement do not mention a reburn.
- **Confirmed:** the symbol's approximate position (visual); B9's history (A.3).
- **Inferred:** the ≈17.6 % symbol represents B9.
- **Unknown:** the source of the zero-rate symbol near 16.5 %; how the plotted value was formed (it does not equal any single B9 row; not digitised).
- **Effect:**
  - The 1.27-cm μg curve below 18.5 % rests on a reburned specimen, as far as the tables show.
  - This is a traceability note, **not** a claim that the figure is wrong. The authors describe their μg data as "not systematically taken".

### C-28: RIES24 printed pressure matrix versus captions (15 Nov 2026)
- **Source:** Ries, Eigenbrod and Meyer (2024), DOI 10.1016/j.proci.2024.105358; full publisher PDF SHA-256 `3c4fa8278cae1da73bc15a4b5443d927006a8150b3d8a83d4c79582f127008f2`.
- **Confirmed as printed:** page 4 Table 1 places oxygen-series X cells under 70 kPa. Its pressure columns are 60, 70, 75, 90 and 101.3 kPa. Figure 6's caption instead describes an oxygen series at 75 kPa. Page 3 Figure 3 describes 35.4% oxygen / 75 kPa / 100 mm/s, absent from the printed X cells.
- **Unresolved:** which pressure values correspond to the actual runs. This record does not correct 70 to 75, infer additional runs, or claim that the paper is scientifically invalid. Author clarification has not been requested.
- **Preservation:** `web/data/design-studies/ries2024.json` stores all 12 X cells exactly as printed and one O flow range; discrete flow runs remain unknown. No `research/data` transcription or frozen r2 record is changed.
- **Effect on the new audit:** the proof relies on section 2.2's restriction that only the 35.4% / 60 kPa line varies flow and other microgravity tests use 100 mm/s. Both pressure readings stay on that plane, so the nominal-design zero-basis proof is invariant. The conflict still accompanies every condition classification. This is not a proof about the combined 1g/microgravity fit or about actual coordinate uncertainty.

### C-29: LIV24 combined endpoint and unavailable run transitions (15 Nov 2026)
- **Source:** the supplied nine-page accepted manuscript, DOI 10.1016/j.proci.2024.105224; canonical SHA-256 `a1899bf28581fa30a480a65d7868a94019821e7fc7b02b3f51ff2c34fc2b6bb0`.
- **Confirmed wording tension:** page 4's validity description uses a stable flame at LOC plus a step and extinction at LOC; later on page 4 a residual blue flame is described after spread stops. Page 5 reports mean oxygen fraction where spread stops or the flame extinguishes. These descriptions do not identify each run's failure branch.
- **Unresolved:** per-run branch, exact step size, steady-response adequacy, observation resolution and the relationship of the condition averages to separate spread/regression limits. No claim is made that the authors' measurements are wrong or that all runs used a mixed trigger.
- **Policy:** preserve the source's combined definition and intended spread-limit question. Do not recode it as pure visible-flame extinction, absence of all combustion or fuel-regression cessation. Mean/SD and graph symbols do not provide individual transition records. Do not add synthetic trial rows to the source data.
- **Implementation:** the separate endpoint audit operates on hypothetical or user-supplied unverified step records, with three detected/not-detected/unknown criteria. The source's combined outcome is not automatically representable as any single criterion. Conditional compatibility sets require explicit idealized assumptions; no new physical threshold is inferred from this paper.
