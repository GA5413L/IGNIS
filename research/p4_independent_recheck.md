# P4 / B4 positive case: recheck against the sources

> **Scientific correction, 7 Nov 2026:** The numerical conversion and difference below survive rechecking. Segment oxygen and an unchanged inter-burn atmosphere are not established by boundary readings. References below to lower oxygen in a particular segment or to a definitely inherited atmosphere are superseded by the [current assessment, section 2](../IGNIS_Astra_Research_and_Winning_Solution.md#2-reality-audit-and-scientific-repairs). This remains an assistant check, not independent human validation.

**Date:** 20 October 2026, second session (adversarial audit). This recheck was done by an AI assistant from the
publisher and NTRS PDFs, without using the earlier verification script for the values. It is **not** an independent
human review. The earlier script was re-run separately, for reproducibility only (6/6 PASS).

**Verdict:**
- **Values: PASS.**
- **Descriptive statement: PASS**, once its wording is qualified as in §6.
- **"Reducing flow reduces spread by 17.2 %": FAIL** (not supported).
- **Use as a demonstration record: CONDITIONAL.** It is fit as the primary *descriptive* example, provided the flow values are shown as nominal settings and the burn context is shown.

## 1. Each value against the source
| Item | Value | Source location | How checked today |
|---|---|---|---|
| Row A | V_g 2.00 cm/s, Δt 177 s, V_f×10³ 3.25 | [L18-ESM] p.1, Table S1 left half, 0.95 cm / 18.5 % / B4 block, row 1 | 220-dpi render read cell by cell |
| Intermediate row | 1.87, 131, 3.10 | same block, row 2 | same |
| Row B | 1.73, 145, 2.69 | same block, row 3 | same |
| Unit | header "V_f×10³ (cm/s)" on the left half | [L18-ESM] p.1 | same (the conflicting "(mm/s)" header is on the *right* half only, C-02) |
| Diameter / O₂ / label | 0.95 cm (merged cell spanning rows 13–26); 18.5 (merged over 3 rows); B4 (merged over 3 rows) | same | same |
| NASA burn | as-run **54**, **P4**, 7/3/2014, GMT 184, sample **197m**, "9.525-mm black rod", igniter –35, restrictor 2, **Opposed**, fan display "48, 41", air display "5, pots 0.4, 0.36, 0.32, 0.308, .3, off", cal. O₂ **18.5 → 17.1**, uncal. 17.6 → 16.2, "HCl 0.9 > 1.8, long slow burn, steady at multiple pots until turned off flow" | [TM] p.115/107, Table A.3 | text layer + render |
| Second NASA-derived record | PSI-25 table copy: P4, 7/3/2014, 197m, `3/8" black rod`, fan "48 41", air "5 pots 0.4 0.36 0.32 0.308 .3 off", O₂ 18.5 → 17.1 | third-party copy of PSI-25 (Fotia repo; see `prior_art_comparison.md`) | read; agrees with A.3. Not verified against PSI itself |
| Same values plotted by NASA | TM Fig. 4.1(a), 0.9525-cm panel: three points near 1.7–2.0 cm/s at ≈ 0.0027–0.0032 cm/s | [TM] p.57/49 | visual, consistent; not digitised |

Arithmetic (by hand):
- **Rate change:** 2.69 − 3.25 = −0.56 (×10⁻³ cm/s) = **−5.6 µm/s**; −0.56 / 3.25 = −0.1723, i.e. **−17.2 %**.
- **Unit conversion:** 3.25 × 10⁻³ cm/s = 32.5 µm/s, and 2.69 × 10⁻³ cm/s = 26.9 µm/s.
- **Nominal flow change:** 1.73 − 2.00 = −0.27 cm/s (−13.5 %).

## 2. Units
The left-half header prints cm/s and is not affected by C-02. TM Fig. 4.1 puts the 0.9525-cm points at the
cm/s magnitude, which is consistent. **Units: PASS.**

## 3. Flow sequence and what V_g means (new finding)
- **Order:** the three tabulated V_g values decrease 2.00 → 1.87 → 1.73, matching Link's protocol ("subsequently reduced") and NASA's pot sequence 0.4 → 0.36 → 0.32.
- **Coverage:** the tabulated segments do **not** cover the whole burn.
  - NASA records a 5 cm/s ignition setting first.
  - It also records two later settings (pots 0.308 and 0.3) before the flow was turned off.
  - Row B is the **last tabulated** segment, not the end of the burn.
  - The burn ended by **flow off**, not by extinction (endpoint E-08).
- **V_g values repeat across burns run on the same day:**
  - 3 Jul 2014: **2.00 / 1.87 / 1.73** for B4 (P4), B6 (P6) and B10 (P10), all at pots 0.4 / 0.36 / 0.32.
  - 14 Jul: 1.64 / 1.54 / 1.43 / 1.38 for B13a, B13b, B5 and B9.
  - 8 Jul: 1.58 / 1.52 / 1.48 for B22 and C25.
  - 22 Jul: 7.55 / 1.67 / 0.83 / 0.72 for B16 and B19.
- **Inference (not stated by either source):** Table S1 V_g appears to be a **nominal value per fan setting from the daily calibration** ("The fan voltage was calibrated with the hot wire reading at the end of every ops day", [L18] p.3; [TM] p.13/5). It is probably not a separate measurement for each segment.
  - The airspeed transducer had "a response time of approximately 1 minute" ([TM] p.12/4).
  - Consequence: ΔV_g = −0.27 cm/s is a **difference between nominal settings**, of unknown accuracy ([L18] p.4: "it was difficult to determine how accurate were the values for … flow velocity").
- **Status:** the same-day repetition is CONFIRMED from the table. The interpretation is INFERRED.

## 4. Time windows
- **Values:** Δt = 177, 131, 145 s. Neither source defines Δt (C-12).
- **Likely meaning:** for B16/B19, the supplement's Fig. S1 tracking spans visually match the tabulated Δt (e.g. B16 at 7.6 cm/s: tracked points span roughly 70–80 s; Δt 72). So Δt is *probably* the length of the tracking window. That is inferred from another burn and not established for B4.
- **If that reading is right** (conditional arithmetic, not a source value), the leading edge moved about 3.25×177 + 3.10×131 + 2.69×145 ≈ 1,372 ×10⁻³ cm ≈ 13.7 mm during the three tabulated windows. That is roughly a quarter of the 57.2 mm rod.

## 5. Is the spread rate measured or derived?
- **Derived from measured positions.** "the flame spread rate was measured by tracking the flame leading edge from high-resolution photos (about every 1 s) using an imaging tracking code … linear dependence of the flame position with time indicates a quasi-steady-state flame spread" ([L18] p.4).
- Each V_f is therefore the slope of a fitted line. The supplement caption calls the table "raw and processed" data.
- No fit uncertainty, position data or residuals are published. The raw images are in PSI (not accessible to us, B-03).

## 6. What changed at the same time as the flow
| Factor | Evidence | Direction of concern |
|---|---|---|
| Elapsed time and rod heating | segments are sequential in one burn | later segments run on a pre-heated rod |
| O₂ | calibrated 18.5 → 17.1 % over the **whole burn**; values at each segment not recorded (C-05) | O₂ was lower during B than during A |
| Combustion products | CO₂ 0.62 → 1.8 %, CO 64 → 493 ppm over the burn ([TM] A.3 P4 row). **Added 21 Oct:** P4's starting O₂, CO₂ and CO equal P6's final readings, so the burn began in P6's atmosphere (C-26) | product build-up in the working volume |
| Position along the rod | opposed spread moves the flame toward the mounted (upstream) end | possible change in heat loss near the holder (physical consideration only, not established for this burn) |
| Flow accuracy | nominal per-setting values; transducer response ~1 min | ΔV_g is nominal |

**Permitted statement (recommended wording):**
> In NASA BASS-II burn P4 (Link et al. sample B4; NASA specimen 197m; black cast PMMA rod, 9.525 mm; calibrated
> initial O₂ 18.5 %; opposed flow; ISS), Link et al. (2018, Table S1) tabulate flame-spread rates of 3.25, 3.10 and
> 2.69 × 10⁻³ cm/s (32.5, 31.0 and 26.9 µm/s) for three successive segments at nominal flow settings of 2.00, 1.87
> and 1.73 cm/s. From the first to the last tabulated segment, the tabulated rate is 5.6 µm/s (17.2 %) lower while
> the nominal flow is 0.27 cm/s lower. Over the same interval the burn aged and the chamber O₂ fell (18.5 → 17.1 %
> across the whole burn), so the change cannot be attributed to flow alone.

**Not permitted:**
- "Reducing airflow by 0.27 cm/s reduces spread by 17.2 %."
- Any per-cm/s sensitivity.
- Any uncertainty interval.
- Pooling with other burns.

## 7. Findings from the previous session: status
| Previous finding | Status |
|---|---|
| Values 2.00/3.25, 1.87/3.10, 1.73/2.69; d 0.95 cm; O₂ 18.5; B4 = P4 = specimen 197m; first burn of 197m (P8 is the reburn) | **PASS** |
| B − A = −5.6 µm/s, −17.2 % | **PASS** (arithmetic) |
| "Opposed in both sources" | **PASS** (Link text + A.3 "Opposed" + PSI copy agrees on everything else) |
| "Descriptive only; segments not independent; no uncertainty propagation" | **PASS** |
| Implied meaning of "B" | **Qualified:** last *tabulated* segment, not the end of the burn |
| Implied meaning of V_g | **Qualified:** nominal per-setting values (new) |
| Confounder list | **Extended:** combustion products; position along the rod |
