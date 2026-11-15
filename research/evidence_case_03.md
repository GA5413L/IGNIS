# Evidence Case 03: lowest oxygen with recorded flame spread, by rod diameter, μg vs 1 g, and what burn history changes

> **Scientific correction, 7 Nov 2026:** [Current assessment, section 2](https://github.com/GA5413L/IGNIS/blob/6dc8f5e0c1bc9c1202e70b803c9e26f202f9cdd5/IGNIS_Astra_Research_and_Winning_Solution.md#2-reality-audit-and-scientific-repairs) supersedes the claims below that oxygen was monotonic at every segment, that copied/matching atmosphere cells prove no intervening change, or that these minima alone establish physical LOC bounds. First-logged selection changes the target population. The as-printed data and historical analysis are retained; those stronger interpretations are withdrawn.

**Date:** 21 October 2026 (third session; pre-event research, not a submission artifact)
**Status:**
- Every record below was re-read from the publisher and NTRS PDFs this session: text layer plus 150–220 dpi renders.
- Checked by an AI assistant only. **No person has reviewed it (B-07).**
- Proposed as IGNIS's **primary demonstration** (D-022). Refines `adversarial_source_audit.md` §5 (F-9).

**Labels used:**
- **OBSERVED:** printed in a source, location given.
- **DERIVED:** filter or arithmetic on observed values only.
- **INFERRED:** reasoning that no source states.
- **UNKNOWN:** not recorded in any accessible source.

## 1. The researcher's question
> For black cast PMMA rods, at which diameters do the published tables record flame spread in ISS low-flow
> microgravity at lower oxygen than any recorded spread in 1 g? Which records carry that answer, and do they support it?

Both sources raise this fire-safety question:
- [L18] p.6: "flames in microgravity can spread at lower oxygen concentrations than in normal gravity … the LOC is lower (or the fire risk is higher) in microgravity".
- [TM] p.58/50: "as low as 17.5 percent" in μg; "not observed below 19 percent" in 1 g.

## 2. The records, by diameter
μg: [L18-ESM] Table S1, one row group per burn; X_O₂ is the NASA calibrated **initial** value (C-05). 1 g: Table S2.
Black-prefix labels only. Quarantined and indeterminate burns are listed but not used.

| d (cm) | μg burns with a printed rate (initial O₂ %, NASA burn, specimen and burn number) | Lowest μg, all eligible | Lowest μg, first burns only | Lowest 1 g with a printed rate | 1 g rows printed "-" |
|---|---|---|---|---|---|
| 1.27 | B13a 20.7 (P13a, 203m #1); B13b 20.6 (P13b, 203m #2); B5 19.3 (P5, 202m #1); **B9 17.6 (P9, 202m #2)** | **17.6 (B9)** | **19.3 (B5)** | 18.5 (S2-L07 at 25 cm/s; S2-L08 at 2 cm/s) | 18.3 @25 (L09); 18.1 @2 (L10) |
| 0.95 | B4 18.5 (P4, 197m #1); B12 17.5 (P12, 199m #1); [B22 20.8 INDETERMINATE] | 17.5 (B12) | 17.5 (B12) | 18.5 (S2-R09 @2) | 18.5 @25 (R08); 18.1 @2 (R10) |
| 0.64 | B6 18.9; B14 18.4; B1 17.7; B2 17.4; **B10 17.0 (P10, 187m #1)**; [B15 18.4 O₂ conflict; B16 18.2 and B19 17.5 config conflict; P17 16.8 colour unconfirmed] | 17.0 (B10) | 17.0 (B10) | 18.0 (S2-L20, L21 @2) | 18.2 @25 (L19); 17.8 @2 (L22); 17.5 @2 (L23) |

- The 0.64-cm rows sit in the half printed "(mm/s)" (C-02). This case uses only the **existence** of a printed rate, not its value, so C-02 does not affect it.
- B19 and P17 are not needed: B10 is the lowest admissible 0.64-cm burn either way.

## 3. Burn and atmosphere history of the decisive records ([TM] Table A.3, p.114/106 and p.115/107)
| NASA burn (S1 label) | As-run, date, start time | Specimen, burn # | Cal. O₂ i → f | Uncal. O₂ i → f | CO₂ % i → f | CO ppm i → f | NASA notes (verbatim extracts) |
|---|---|---|---|---|---|---|---|
| P5 (B5) | 83, 7/14/14, 13:18:00 | 202m, #1 | 19.3 → **17.6** | 18.4 → **16.7** | 0.32 → **1.67** | 0 → **525** | "Fan pot 1.5 (5 cm/s), 0.9, 0.4, 0.36, 0.32, 0.308, 0.3, 0.29, 0.28 (flame persisted for all) finally turned down flow to 0 to extinguish; HCL 0 > **4.7**; lots of fuel left behind, conical shape" |
| P9 (B9) | 84, 7/14/14, 13:57:00 | 202m, #2 | **17.6** → 17.1 | **16.7** → 16.2 | **1.67** → 2.10 | **525** → 535 | "Fan pot 1.5 (5 cm/s), 0.9, 0.4, 0.36, 0.32, 0.3, 0.28 flame out at 0.28; HCL **4.7** > 4.5; flame did not leave conical portion behind, rather fuel was consumed but final sample shape was very irregular" |
| P13a (B13a) | 85, 7/14/14, 14:30:00 | 203m, #1 | 20.7 → 19.1 | 19.8 → 18.2 | 0.36 → 1.63 | 38 → 450 | "flame reached front of sample and began to wrap around" |
| P13b (B13b) | 86, 7/14/14, 16:04:00 | 203m, #2 | 20.6 → 20.2 | 19.7 → 19.3 | 0.41 → 0.62 | 5 → 72 | "Fan pot 1.3 (5 cm/s), 0.4, 0.36, 0.32; flame out when pot turned to 0.32" *(our note: starting readings not carried over from P13a)* |
| P12 (B12) | 104, 7/29/14 | 199m, #1 | 17.5 → 16.8 | 16.4 → 15.7 | 0.29 → 0.95 | 2 → 57 | "multiple steady spread flows" |
| P10 (B10) | 55, 7/3/2014 | 187m, #1 | 17 → 16.4 | 16.1 → 15.5 | 0.29 → 0.72 | 2 → 44 | "steady burn at multiple velocities" |

Bold marks the four readings in which P9 starts exactly where P5 ended.

## 4. Evidence, by label

### OBSERVED
- **O1.** S1 rows L09–L12: B9, d 1.27 cm, X_O₂ 17.6, V_f×10³ 4.57, 3.34, 2.67, 2.03 at V_g 1.64, 1.54, 1.43, 1.38 cm/s ([L18-ESM] p.1, left half "(cm/s)").
- **O2.** S1 fresh 1.27-cm burns: B5 19.3 % (rows L07–L08, two segments); B13a 20.7 % (L01–L04). B13b 20.6 % (L05–L06) is the second burn of 203m.
- **O3.** P5 and P9 are both sample **202m**, as-run 83 and 84, with start times 13:18:00 and 13:57:00 on 7/14/14 ([TM] p.115/107; render `_raw/audit_2026-10-20c/A3_P4_P9_gas_220.png`).
- **O4.** P9's initial calibrated O₂, uncalibrated O₂, CO₂ and CO equal P5's final values (17.6, 16.7, 1.67, 525). The HCl note carries 4.7 from P5's end to P9's start.
- **O5.** [TM] p.14/6:
  - "The sensor data provided initial and final conditions for repeated tests in a sealed working volume and allowed us to determine when the working volume needed to be purged. The O2 decreased during each burn and the CO and CO2 increased accordingly."
  - "Sensor readings were taken before and after each BASS–II test."
  - "Many of the BASS–II tests required a diluted atmosphere, which typically took 1 to 3 h to achieve."
- **O6.** P5's notes record "flame persisted for all" pot settings down to 0.28, then flow 0 "to extinguish". [L18-ESM] tabulates **two** segments of that burn.
- **O7.** [L18] p.4: "the limited number of samples available, and the limited resources of oxygen. This resulted in data points that were not systematically taken". The 2018 article and its supplement do not say that any rod was burned twice. p.4 has "Multiple tests were conducted for each PMMA sample", which is ambiguous.
- **O8.** [L18] p.6: "in microgravity, there is still flame spread at X_O₂ = 17%, while flame cannot exist in normal gravity for X_O₂ = 18% and below". p.5, Fig. 6 caption (1 g, 1.27 cm): "flame cannot be sustained at X_O₂ < 18.5%". The 1 g gas is a metered flowing mixture (p.3).
- **O9.** [L18] Fig. 8(c) (1.27 cm) shows a μg symbol at about 17.6 % O₂. The fitted μg curve passes through it, below the 1 g "Blow off" band. Visual only; not digitised (render `_raw/audit_2026-10-20c/L18_fig8c_400dpi.png`).

### DERIVED
- **D1.** Lowest initial μg O₂ with a printed rate: 1.27 → 17.6 (B9); 0.95 → 17.5 (B12); 0.64 → 17.0 (B10). Using **first burns only**, 1.27 → 19.3 (B5).
- **D2.** 1 g minus μg minimum:
  - 0.95 cm: +1.0 point.
  - 0.64 cm: +1.0 point.
  - 1.27 cm, all burns: +0.9 point.
  - 1.27 cm, first burns only: **−0.8 point**.
- **D3.** μg O₂ only fell during each burn (O5; final < initial for every burn in §3). So every tabulated B12 and B10 segment occurred at O₂ at or below 17.5 % and 17.0 %: below the 1 g minima **whenever in the burn it was measured**. B5's two segments occurred somewhere between 19.3 % and 17.6 %. Whether that was above or below 18.5 % **cannot be derived**.
- **D4.** B9 started with the **highest initial CO₂ (1.67 %) and CO (525 ppm)** of the Table S1 burns with printed gas readings. The next highest are CO₂ 0.95 % (P17) and CO 90 ppm (P15).
- **D5.** At the same nominal V_g on the same day:
  - B9 − B5 is **+8.1 µm/s** at 1.64 cm/s and **−4.0** at 1.54.
  - B13b − B13a is **+18.6** at 1.64 and **−3.6** at 1.54.
  - The sign is mixed in both pairs.
- **D6.** Tabulated rates are observations of spread at a recorded O₂. Logically, they bound any limiting O₂ for spread from **above**. To order the μg and 1 g limits you also need 1 g **non-spread** evidence above the μg spread O₂:
  - **0.95 and 0.64 cm:** the 1 g "-" rows at 18.1 and at 17.5–17.8 lie above 17.5 and 17.0. So the ordering holds **if** "-" means no sustained spread.
  - **1.27 cm, fresh rods:** the 1 g "-" rows (18.1, 18.3) lie *below* 19.3, so no ordering follows.
  - **1.27 cm, with B9:** 17.6 < 18.1, so the ordering holds only through the reburn.

### INFERRED
- **I1.** The work volume was not purged or re-diluted between P5 and P9. The evidence:
  - four equal readings, plus the HCl carry-over;
  - start times only 39 min apart, while dilution "typically took 1 to 3 h".
  So B9's 17.6 % was reached by the first burn of the same rod. If P9's "initial" cells were instead copied from P5's "final" cells, the conclusion is the same: nothing changed in between.
- **I2.** Rod 202m entered P9 already burned and reshaped (P5: "conical shape"), possibly still warm. Its temperature was not recorded, and the gap between P5's *end* and P9's start is shorter than 39 min by P5's unknown duration.
- **I3.** The ≈17.6 % symbol in Fig. 8(c) represents B9, the only 1.27-cm Table S1 burn at that O₂.
- **I4.** The fresh rod in P5 carried a flame while chamber O₂ fell towards 17.6 %. Whether it was *spreading* steadily in that phase is not recorded (E-05 vs E-06).
- **I5.** The 1 g "-" entries probably mean no sustained spread, which is consistent with the authors' text (O8). The table itself does not define "-".

### UNKNOWN
- Whether a fresh 1.27-cm rod spreads quasi-steadily in μg under this protocol at a starting O₂ ≤ 18.5 %.
- O₂ at each tabulated segment.
- 202m's temperature and shape at P9 ignition.
- Why P5's later settings were not tabulated.
- The meaning of "-" in Table S2.
- Whether any 1 g specimen was reused.
- What the zero-rate μg symbol near 16.5 % in Fig. 8(c) represents.
- Pressure.
- Whether a person confirms any of this (B-07).

## 5. Best defensible conclusion
> In Link et al.'s tables, matched by rod diameter:
> - **Fresh 0.95-cm and 0.64-cm black PMMA rods.** Microgravity spread is recorded from their first burns at starting O₂ of 17.5 % and 17.0 %. That is at least one point below the lowest O₂ with a printed 1 g spread rate (18.5 %, 18.0 %). Chamber O₂ only fell during each microgravity burn, so this holds for every tabulated segment.
> - **1.27-cm rods.** The only microgravity record below the 1 g minimum is B9 (NASA P9). It is the **second ignition of rod 202m**, started 39 minutes after that rod's first burn, in a work-volume atmosphere that had not been renewed. Its starting O₂ 17.6 %, CO₂ 1.67 % and CO 525 ppm equal the first burn's final readings.
> - **Fresh 1.27-cm rods.** The tables neither show nor exclude spread below 19.3 % starting O₂. NASA's log records the fresh rod's flame persisting at every flow setting while O₂ fell to 17.6 %, but no spread rate was tabulated for that phase.
>
> These records bound, but do not measure, a limiting oxygen concentration. The 1 g comparison also rests on the
> authors' statement that 1 g flames were not sustained at the lower O₂ values, because the table's "-" entries
> are undefined.

## 6. What changes when burn history is included, and what doesn't
| Changes | Does not change |
|---|---|
| Fresh-specimen support for "μg spread recorded below the 1 g minimum": **3 of 3 diameters → 2 of 3**. At 1.27 cm the fresh-rod answer becomes **undetermined**, not "no" | B9's values. B9 remains a valid observation of a **pre-burned rod in a product-laden 17.6 → 17.1 % atmosphere**, a realistic fire scenario in its own right |
| B9 cannot be pooled with fresh-rod records without a history term. Examples: a V_f-vs-O₂ curve such as Fig. 8(c)'s 1.27-cm μg curve below 18.5 % (I3), or a regression | The 0.95- and 0.64-cm readings, which rest on first burns (B12, B10) with low starting CO (2 ppm) |
| B5 → B9 is not an O₂ effect, and B13a → B13b is not a replicate (D5 shows mixed signs) | The authors' qualified conclusion "at least for the present experimental conditions (low opposed flow)" at two diameters |
| Atmosphere history joins specimen history as a record field (C-26). Consecutive burns are not independent in atmosphere | No limiting O₂ is established at any diameter. The gravity cause stays unidentified (§10) |

## 7. The proposed case versus the re-read
| Element of the case as proposed in the 21 Oct brief | Verdict |
|---|---|
| Minima 17.0/18.0 (0.64), 17.5/18.5 (0.95), 17.6/18.5 (1.27) | **PASS** |
| B9 = P9 = specimen 202m, burned before as B5/P5 about 39 min earlier | **PASS** (start times 13:18 and 13:57; the end-to-start gap is shorter) |
| B9 is a reburn, not a fresh specimen | **PASS** |
| "Other recorded fresh 1.27-cm specimens do not provide the same low-oxygen observation" | **QUALIFIED.** True of *tabulated spread rates*. **False** if read as "no fresh 1.27-cm rod burned near 17.6 %": the fresh rod's own first burn (P5) kept a flame while O₂ fell to 17.6 % (O6), with no rate |
| "Specimen history changes the interpretation" | **PASS, extended.** Atmosphere history is part of it: B9's low O₂ was produced by its own first burn (I1) |
| The listed caveats (initial O₂, undefined "-", protocol differences, minima ≠ LOC, P17, assistant-checked only) | **PASS.** Add: tables bound a limit only from above, and the ordering needs the authors' 1 g non-spread statements (D6) |

## 8. Is this the strongest case?
| Candidate | Assessment |
|---|---|
| **This case** | **Strongest available.** It is a question both sources ask, and history changes the answer for one diameter. Every element is checkable in two primary documents within minutes. It does **not** depend on any open conflict: not C-02 (only the existence of a rate is used), not C-03 (B19 not needed), not P17, B22 or B15. It is modest: one diameter, one burn |
| P4 within-burn (Evidence Case 02) | stays the plain descriptive example. No history twist (though P4 also began in P6's residual atmosphere, C-26) |
| B5 vs B9, B13a vs B13b rate contrasts | **FAIL as a demonstration**: n = 2, signs mixed (D5). Usable only as a warning against reading them as O₂ or reburn effects |
| B16/B19 | documentary conflict. Context only (D-017) |
| B22 | inferred merge; no fire-safety reading |

**Overall: CONDITIONAL.** It depends on the transcriptions of S1/S2 O₂ cells and labels, the four crosswalk
links B9↔P9, B5↔P5, B10↔P10 and B12↔P12, and the A.3 gas cells. All of these are assistant-checked only.

## 9. Conclusions this case must not support
- "Reburning PMMA improves flammability" or "reburned rods spread faster" (D5 is mixed and n = 2).
- "Fresh 1.27-cm rods cannot spread at 17.6 %" (UNKNOWN), or that they can.
- "The microgravity LOC is 17.6 %" (or 17.0 %, or 17.5 %); any LOC value.
- "Gravity alone explains the difference" (§10).
- "Combustion products in P9's atmosphere caused …" anything.
- "B9 is invalid", "Fig. 8(c) is wrong", or "the authors hid a reburn". The article states the data were "not systematically taken", and the history is recorded in NASA's public log.

## 10. Secondary demonstration (negative): matched nominal conditions, different gravity
Evidence Case 02 N1, restated under the corrected endpoint rules (`endpoint_dictionary.md` §4):
- **μg:** S1-L20 (B4/P4), d 0.95 cm, starting O₂ 18.5 %, nominal V_g 2.00 cm/s, gives **3.25** ×10⁻³ cm/s. This is ST-01, one segment.
- **1 g:** S2-R09, d 0.95 cm, 18.5 %, V_g 2 cm/s, gives **3.33 ± 0.6 %**. This is ST-02, a mean of ≥ 3 tests.
- **Same measurand (M-01):** display (U1) and descriptive contrast (U2) are allowed. 1 g − μg = **+0.08 ×10⁻³ cm/s = +0.8 µm/s (+2.5 %)**.
- **Not allowed:**
  - pooling (U3): different statistic and protocol (PR-01 hot wire, flow stepped down, sealed depleting volume; PR-02 methane ignition, flow stepped up, flowing mixture);
  - causal attribution (U4): gravity is confounded with effective flow at the flame (buoyant ~30 cm/s in 1 g), ignition, flow history, O₂ drift (18.5 → 17.1), and P4's starting atmosphere (CO₂ 0.62 %, CO 64 ppm carried over from P6).
- **Statement:** *"These observations may be displayed and arithmetically contrasted, with their distinct protocols shown, but they cannot identify gravity's isolated causal effect."*

## 11. Check it yourself
1. Table S1 (ESM p.1): rows for B5, B9, B12 and B10; note d, X_O₂ and that a rate is printed.
2. Table S2 (ESM p.2): for 1.27, 0.95 and 0.64 cm, find the lowest O₂ with a printed rate, and the "-" rows.
3. Table A.3 ([TM] p.115/107): P5 and P9: sample number, start time, the four gas readings, the notes. Then p.114/106 for P10 and P12.
4. [TM] p.14/6: the "sealed working volume" sentence.

A plain spreadsheet filter reproduces D1–D3 and D5. The gas readings in §3 are **not** in the repository CSVs (D-023). They were read from the PDF.
