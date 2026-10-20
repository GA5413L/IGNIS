# Evidence Case 02: Black cast PMMA rods, microgravity, opposed flow, two recorded flow settings

**Date:** 20 October 2026 (pre-event research; not a submission artifact)
**Status:** Source measurements **recovered and transcription-checked**. One positive descriptive comparison is
admitted (primary: sample B4 / NASA test P4). Five further burns are computed with flags. Link et al.'s headline
microgravity series (B16, B19) is **quarantined** because of a cross-source flow-configuration conflict. No model,
prediction, significance test, or safety verdict is produced.
**Supersedes:** the rod part of "IGNIS Evidence Case 01" (15 Oct 2026), which recorded Tables S1/S2 as unobtainable.
They were downloaded today from the publisher (see `research/data_access_audit.md`).

## 1. Confirmed question

> **Q1.** For black cast PMMA rods burned aboard the ISS (BASS-II, Microgravity Science Glovebox), what is the
> source-reported difference in **axial flame-leading-edge spread rate** between two recorded **opposed-flow**
> settings **within the same burn**, with rod diameter and burn oxygen as recorded?

| Element | Value |
|---|---|
| Endpoint | V_f, flame spread rate from tracking the flame leading edge in photos (~1 s apart) with an image-tracking code; quasi-steady segment ([L18] p.4). Not extinction velocity, not burning/regression rate. |
| Material | cast **black** PMMA (B-prefix in [L18-ESM]; "black rod" in [TM] Table A.3) |
| Geometry | cylindrical rod, hemispherical ends, 57.2 mm long ([L18] p.3; [TM] p.47: 57.15 mm) |
| Gravity | microgravity, ISS |
| Flow | forced **opposed** flow, V_g as tabulated (cm/s) |
| Oxygen | X_O₂ (vol %) as tabulated = NASA calibrated *initial* O₂ (C-05) |
| Pressure | **no value stated** in [L18] or [L18-ESM]. [L18] says only that the Fig. 1 μg/1 g photos were taken "under the same ambient pressure". Unknown, not assumed. Does not block a *within-burn* comparison; does block pooling with other datasets. |
| Intended use | descriptive within-burn comparison. **Not** a flow-effect estimate, **not** a prediction. |

## 2. Exact observations

All values are as printed in [L18-ESM] Table S1 (left half; header "V_f×10³ (cm/s)"), transcribed in
`research/data/link2018_tableS1_microgravity.csv` and checked by `research/analysis/verify_transcriptions.py`.
Normalisation: 1 printed unit = 10⁻³ cm/s = 0.01 mm/s = **10 µm/s**.

**Primary record set: B4 (NASA P4)**, d = 0.95 cm (NASA: 9.525 mm), X_O₂ = 18.5 %

| Row | V_g (cm/s) | Δt (s, meaning undefined) | V_f printed (×10⁻³ cm/s) | V_f (µm/s) |
|---|---|---|---|---|
| S1-L20 (A) | 2.00 | 177 | 3.25 | 32.5 |
| S1-L21 | 1.87 | 131 | 3.10 | 31.0 |
| S1-L22 (B) | 1.73 | 145 | 2.69 | 26.9 |

NASA cross-reference ([TM] PDF p.115 / printed p.107, Table A.3): test **P4**, as-run 54, 3 Jul 2014, sample
**197m**, "9.525-mm black rod", **Opposed**, calibrated O₂ **18.5 → 17.1**, observations "long slow burn, steady
at multiple pots until turned off flow". Specimen 197m was burned again later as P8 ("would not stay lit"), which
is not in Table S1. **B4 is the first burn of that specimen.**

## 3. Admission rules applied to every Table S1 label

1. **Material.** B prefix *and* NASA "black" → eligible. C/clear → INAPPLICABLE. Colour not stated in either source → INDETERMINATE (missing required field; never defaulted).
2. **Geometry.** Link diameter and NASA diameter agree within 0.1 mm. All 19 labels pass.
3. **Flow configuration.** NASA "Opposed" required. "Concurrent" vs Link's opposed → QUARANTINED (C-03).
4. **Run identity.** Exactly one NASA test per label. More than one → INDETERMINATE (C-15).
5. **Oxygen.** Link X_O₂ equals NASA calibrated initial O₂. Otherwise QUARANTINED (C-04).
6. **Unit label.** Table half printed "(cm/s)" → eligible. Printed "(mm/s)" → CONDITIONAL: only unit-free statements (sign, ratio) inside the burn (C-02).
7. **Specimen history.** First burn → ADMITTED. Later burn of the same specimen → ADMITTED_WITH_FLAG for within-burn use; INDETERMINATE for any cross-specimen pooling.

These rules give eligibility only. They do **not** permit averaging, fitting, or causal attribution.

| Decision | Labels (NASA test) |
|---|---|
| ADMITTED | B13a (P13a), B5 (P5), **B4 (P4)**, B12 (P12) |
| ADMITTED_WITH_FLAG | B13b (P13b, 2nd burn of 203m), B9 (P9, 2nd burn of 202m, ~39 min after P5) |
| CONDITIONAL (unit label) | B6 (P6), B14 (P14), B1 (P1), B2 (P2), B10 (P10) |
| QUARANTINED | **B16 (P16)**, **B19 (P19)** (flow configuration); B15 (P15) (O₂) |
| INDETERMINATE | B22 (P22a + P22b?), P17 (colour not stated; also a 22 cm/s blow-off attempt mid-burn) |
| INAPPLICABLE | C25 (P25), C3a (P3a), C3b (P3b) (clear PMMA) |

## 4. Result

**Difference = B − A**, A = S1-L20 (V_g 2.00 cm/s, first tabulated segment), B = S1-L22 (V_g 1.73 cm/s, last tabulated segment):

> **V_f(B) − V_f(A) = 2.69 − 3.25 = −0.56 × 10⁻³ cm/s = −5.6 µm/s** (−17.2 % of A).
> Across the three recorded settings (2.00 → 1.87 → 1.73 cm/s), V_f is non-increasing: 32.5 → 31.0 → 26.9 µm/s.

| Item | Value |
|---|---|
| Endpoint | axial flame-leading-edge spread rate, quasi-steady segment |
| Units | original ×10⁻³ cm/s; normalised µm/s (×10, exact) |
| Sign | negative: the lower-flow segment, recorded later in the same burn, spread more slowly |
| Independence | **not independent**: consecutive segments of one burn of one specimen, in time order |
| Uncertainty propagation | **not justified**. No per-row uncertainty is reported. V_g accuracy is not quantified ([L18] p.4). The only quantifiable term is print resolution (±0.005 per value, so ≤ 0.01 units = 0.1 µm/s on the difference). That is a rounding bound, not a measurement uncertainty. |
| Confounders inside the comparison | elapsed burn time and rod preheating; O₂ fall during the burn (calibrated 18.5 → 17.1, C-05); regression of the rod tip; flow-meter accuracy |

**Other admitted and flagged burns** (same rule, first vs last tabulated row; `evidence_case_02.py` output):

| Label | d (cm) | X_O₂ | A → B: V_g (cm/s) | V_f (µm/s) A → B | B − A (µm/s) | (B−A)/A | Monotonic? | Decision |
|---|---|---|---|---|---|---|---|---|
| B13a | 1.27 | 20.7 | 1.64 → 1.38 | 52.3 → 46.9 | −5.4 | −10.3 % | no (52.3, 52.7, 46.3, 46.9) | ADMITTED; NASA notes flame "began to wrap around" the sample front |
| B5 | 1.27 | 19.3 | 1.64 → 1.54 | 37.6 → 37.4 | −0.2 | −0.5 % | yes | ADMITTED; difference is 2 print steps |
| B12 | 0.95 | 17.5 | 1.01 → 0.48 | 30.8 → 23.7 | −7.1 | −23.1 % | **no** (30.8, 34.5, 36.5, 23.7) | ADMITTED; NASA: "oscillating at 0.36, out immediately at 0.34" (pot settings) |
| B13b | 1.27 | 20.6 | 1.64 → 1.54 | 70.9 → 49.1 | −21.8 | −30.7 % | yes | FLAG: reburn of 203m |
| B9 | 1.27 | 17.6 | 1.64 → 1.38 | 45.7 → 20.3 | −25.4 | −55.6 % | yes | FLAG: reburn of 202m |

Right-half (CONDITIONAL) burns can only be stated without units. B6 (−16.8 %), B1 (−17.3 %), and B10 (−22.0 %)
decrease from first to last row. **B2 increases (+8.6 %)**, and its Δt values are only 24 s and 28 s (C-12).

**Descriptive statement supported by the admitted records:** in all four admitted first-burn black-rod series
(four distinct physical specimens: 197m, 199m, 202m, 203m), the last tabulated, lowest-flow segment spread more
slowly than the first tabulated segment, by 0.2 to 7.1 µm/s (0.5 to 23 %). In two of the four (B12, B13a) the
intermediate segments were not monotonic. The four burns differ in diameter and O₂, so they are **not**
replicates of one condition and are not averaged.

**Not supported:** "reducing opposed flow reduces spread rate on PMMA rods". Flow was never varied alone: it
changed together with time, specimen heating and O₂. B12's rise at intermediate flows and B2's increase show the
pattern is not uniform. No statement about V_g < 0.48 cm/s, other pressures, other diameters, or partial gravity
follows from these rows.

## 5. Negative and limiting cases

### N1: same nominal conditions, different gravity: a gravity effect is not established
- μg: S1-L20 (B4/P4) d 0.95 cm, X_O₂ 18.5 %, V_g 2.00 cm/s → **3.25** (single segment).
- 1 g: S2-R09 d 0.95 cm, X_O₂ 18.5 %, V_g 2 cm/s → **3.33 ± 0.6 %** (caption: "average of at least 3 repeating tests", steady for "at least 5 min or 4 cm").
- Arithmetic: 1 g − μg = **+0.08 × 10⁻³ cm/s = +0.8 µm/s (+2.5 %)**.
- Classification for "does gravity change the spread rate here?": **INDETERMINATE.** At least six things differ besides gravity:
  1. Ignition: hot wire vs a methane diffusion flame ([L18] p.4).
  2. Flow sequence: decreasing within the burn vs increased stepwise to blow-off.
  3. Statistic: one segment vs a mean of ≥ 3 tests.
  4. Steady-state criterion.
  5. O₂ drift in μg (18.5 → 17.1).
  6. **Effective flow at the flame**: in 1 g the flame-induced buoyant flow (~30 cm/s, [L18] p.5) dominates any forced flow below it, so "V_g = 2 cm/s" does not mean the same flow in both rows.

  The near-equality of the two numbers is a coincidence of conditions. It is not evidence that gravity doesn't matter, and C-09 shows the two source documents themselves disagree on the μg-vs-1 g ordering.

### N2: endpoint substitution, thin-sheet extinction velocity vs rod spread
A query for "the critical opposed-flow velocity for PMMA" could retrieve [TM] Table 2.1 (V_g,cr = 10 ± 5 mm/s at
21 % O₂; 30 ± 5 mm/s at 16 %; see Evidence Case 01). For Q1 that record is **INAPPLICABLE**: different endpoint
(critical velocity below which steady spread cannot be sustained, vs spread rate), different geometry (thin
sheets vs thermally thick rods), and different source experiments. The rod sources give no V_g,cr. They give
conflicting low-flow statements: 0.6 cm/s vs ≈ 4 mm/s, with tabulated spread down to 0.41 cm/s (C-06). The
thin-sheet finding that V_g,cr is independent of thickness was established for thin fuels. Transferring it to
rods is **not supported**.

### N3: the paper's headline series is quarantined
B16 and B19 underlie Link's "first increases, and then decreases" result (Fig. 6a). Their numbers are recovered
(B16: 7.55, 1.67, 0.83, 0.72 cm/s → 6.78, 7.62, 6.99, 5.68; B19: 4.69, 6.52, 6.25, 5.44), but NASA's as-run
matrix records both burns as **Concurrent** (C-03), and they sit in the mm/s-labelled half (C-02). IGNIS may
display them only as a **source-reported result with an open conflict**, never as a verified opposed-flow
observation and never as model support. This is the most consequential distinction found in this pass: the
literature's headline result depends on the two records whose flow configuration is in dispute between sources.

### N4: "limiting oxygen concentration" is not one number
For rods the sources give μg minima of 17 % and 17.5 %, and 1 g minima of 18 %, 18.5 % (1.27 cm) and 19 %.
Table S2 nonetheless prints 1 g spread at 18.0 % (0.64 cm) and 17.5 % (0.32 cm) (C-07, C-08). Separately, a flame
can exist without spreading: NASA Fig. 4.4(f) shows a 6.35 mm rod (caption "3.18 mm", a radius, C-19) at
16.3 % O₂ and 5 cm/s whose cap-shaped flame consumed the tip and extinguished, having "never spread along the
outer surface". The O₂ limit for **flame spread** is therefore not the limit for **any burning** (see
`endpoint_dictionary.md` E-05/E-06).

## 6. Against the practical baseline

A spreadsheet holding these 52 rows computes every number above. **No algorithmic advantage is claimed.** The
work that produced the result was curation, not computation:
- finding and transcribing Tables S1/S2;
- recovering NASA's as-run matrix;
- crosswalking 19 labels;
- surfacing conflicts C-02, C-03, C-04, C-05, C-14 and C-15.

A spreadsheet user given only Table S1 would, without warning:
- read the right half as mm/s;
- treat B16/B19 as opposed flow;
- join on "B16" across sources (thin film ≠ rod);
- average B22's duplicate rows;
- treat row-to-row differences as flow effects.

Whether IGNIS reduces those errors, rather than the conflict register alone doing so, is the hypothesis to test
(`planning/evaluation_plan.md`).

## 7. Reproduce

```
py -3 -I research/analysis/verify_transcriptions.py _raw/link2018/41598_2017_18398_MOESM1_ESM.pdf _raw/ntrs_20210011385/TM-20210011385.pdf
py -3 -I research/analysis/crosswalk.py
py -3 -I research/analysis/evidence_case_02.py
```
Inputs: ESM PDF SHA-256 `e17c9511c4b4b253cd0795b3984ffb9347ad5db6354c4ce792adcaf805f21b23`; NTRS PDF SHA-256
`5ffa911fd9b6356f204646003fb9342e341810dcdfdf5cb15756e7f01ec5f770`. Python 3.14.0, PyMuPDF (fitz). The
arithmetic was also checked by hand: 2.69 − 3.25 = −0.56; −0.56 / 3.25 = −0.172; 3.33 − 3.25 = +0.08.

## 8. Limits of this case
- One assistant transcribed, checked, and interpreted. No independent reviewer has looked at it yet. Merged-cell spans were checked visually only.
- The crosswalk is a scored hypothesis. NASA's appendix has its own anomalies (C-16).
- Pressure, specimen initial temperature, and the exact segment times are not reported. Δt is undefined.
- Raw BASS-II video/overlay data (NASA PSI) were **not** accessed (sign-in required), so no rate was re-measured.
- These are internal worked-case decisions, not adjudicated scientific findings, and not a material-safety assessment.
