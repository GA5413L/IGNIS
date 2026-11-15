# Lab note 01: Solid flammability, partial gravity and exploration atmospheres

Prepared 2026-11-15 by the lab's combustion physicist role. Status: research note for registry records. Not a prediction, not a safety rating.

**Conventions**

- Quotes are verbatim from the PDF text layer of files read in this session. Line wraps and line-break hyphens were removed; nothing else was changed. Misspellings are as printed.
- "PDF p." is the 1-indexed page of the file.
- "Rendered" means the page was also rendered to PNG and read by eye. Other tables are text-layer only.
- No value was read from a figure. Where a source gives a value only in a figure, it is not reported here.
- Files downloaded this session: `E:\Projects\IGNIS\_raw\lab_2026-11-15\physicist\<NTRS id>.pdf`, logged in `acquisition_log.json` in that folder (71 requests, 17 PDFs, all HTTP 200). Files marked "local copy" were acquired on 2026-11-14 and only read this session.
- psi.nasa.gov was not contacted. Whether any run below is also held in PSI is unknown.

---

## (a) Anchors

### PHY-01. Printed limiting-oxygen values at 1 g, Martian g, Lunar g and 0 g for three thin materials

- **Statement:** A drop-tower centrifuge study tabulates upward limiting oxygen values at four gravity levels. For all three materials the printed Lunar values are lower than both the printed 1g and 0g* values.
- **Quote (Table I, "Limiting Oxygen Molar Concentrations and Oxygen Margin of Safety for Different Gravity Levels", rendered):**

| Row as printed | Mylar® G, 10.2 psia | Ultem® 1000, 10.2 psia | Nomex® HT90-40, 14.7 psia |
|---|---|---|---|
| 1g ULOI | 21.2 | 23.5 | 23.5 |
| 1g MOC | 20.0 | 23.0 | 22.1 |
| Martian ULOI* | 18.0 | 22.0 | 19.9 |
| Martian MOC* | 17.0 | 21.1 | 19.0 |
| Lunar ULOI* | 15.6 | 21.0 | 21.0 |
| Lunar MOC* | 14.1 | 19.9 | 19.9 |
| 0g* ULOI* | 17.0 | 24.0 | 23.0 |
| 0g* MOC* | 16.0 | 23.0 | 22.0 |
| Martian ∆O2 % | -3.1 | -1.7 | -3.35 |
| Lunar ∆O2 % | -5.75 | -2.8 | -2.35 |
| 0g ∆O2 % | -4.1 | 0.25 | -0.3 |

- **Source:** Olson and Ferkul, "Evaluating Material Flammability in Microgravity and Martian Gravity Compared to the NASA Standard Normal Gravity Test" (2012). NTRS 20130010991. https://ntrs.nasa.gov/api/citations/20130010991/downloads/20130010991.pdf
- **PDF p.:** 6. **Access:** full text read (9 pages).
- **Scope:** thin film or fabric, concurrent (upward) spread, 5.18 s drop tower with centrifuge. 0g* is with 30 cm/s forced concurrent flow, not quiescent. Definitions (PDF p. 4): "the MOC* for these tests was defined as the maximum oxygen concentration at which the flame was observed to self-extinguish during the drop time. The ULOI* criterion was minimum oxygen concentration where the flame survived the full drop time."
- **Cautions:**
  - The starred low-g criteria are not the 1-g Test 1 criteria. The paper says so (PHY-02).
  - Lunar and 0g values are reprinted "from ref. 8" (Ferkul and Olson 2011), which was not retrieved.
  - Nomex is at 14.7 psia, the other two at 10.2 psia. Do not compare across columns.
  - Lunar ULOI*/MOC* are identical for Ultem and Nomex as printed.
  - Do not quote the Fig. 6 caption averages (PDF p. 7): "The average 0g oxygen margin of safety for these three materials is -2.6% and the average Martian oxygen margin of safety is 2.7%." The second has no minus sign as printed.
  - The ∆O2 rows reproduce from the limit rows with the paper's Eq. 1. That is an arithmetic check, not independent validation.
  - Three materials only. Not a general law.
- **Panel:** partial gravity, Moon view.

### PHY-02. The authors' own statement on where partial-gravity limits fall

- **Statement:** The authors place Martian limits typically between the normal-gravity and Lunar values, and say 1-g screening may not be conservative.
- **Quote:** "The limiting oxygen levels at Martian gravity were significantly lower than normal gravity (up to 5.75% O2 lower), and typically between the normal gravity and Lunar gravity values. However, it should be noted that the low-g extinction limit criteria are not the same as 1g due to time constraints in drop testing."
- **Second quote (PDF p. 7):** "There appears to be a range of g-levels within which a flame can survive."
- **Source:** as PHY-01. **PDF p.:** 8 (second quote p. 7). **Access:** full text read.
- **Scope:** same three materials and method as PHY-01.
- **Cautions:** The sentence attributes "up to 5.75%" to Martian gravity, but -5.75 is printed in the Lunar ∆O2 row of Table I; the largest Martian value printed is -3.35. Record as an internal inconsistency. The authors do not say partial-gravity limits lie between 0 g and 1 g.
- **Panel:** partial gravity.

### PHY-03. 2026 statement: flammability oxygen reaches a minimum near lunar gravity

- **Statement:** The FM2 team states that related work suggests a minimum in flammability oxygen near lunar gravity, and expects partial-g habitat fire to be worse than 0-g.
- **Quote:** "Related work suggests that oxygen concentration for flammability reaches a minimum value in the vicinity of g = g Lunar."
- **Second quote:** "Consequently, partial-g fire in an extraterrestrial habitat is a real hazard that is expected to be substantially worse than in 0-g and potentially worse than even 1-g."
- **Source:** Ferkul, Kralik and Liao, "Material Flammability at Lunar and Martian Gravity", 57th LPSC (2026). NTRS 20260000646. https://ntrs.nasa.gov/api/citations/20260000646/downloads/Ferkul-Lunar%20and%20Planetary%20Science%20Conference%202026.pdf
- **PDF p.:** 1. **Access:** full text read (2-page extended abstract).
- **Scope:** summary and expectation in an extended abstract. No table, no new data.
- **Cautions:** "suggests" and "expected" are the authors' words. Not a measurement. Read with PHY-04, which reports the enhancement is not universal.
- **Panel:** Moon view, partial gravity.

### PHY-04. 2025 result at 8.2 psia: lunar-gravity enhancement is material dependent

- **Statement:** Comparative 1-g forced-flow and lunar-g centrifuge testing found clearly increased flammability at lunar gravity for some materials and possibly decreased flammability for higher-temperature materials.
- **Quote:** "Comparative testing in 1-g under forced flow and buoyant flow at lunar-g conditions has demonstrated that for some materials, there is a clear increased flammability at lunar gravity conditions. Other, higher temperature materials may show decreased flammability at lunar conditions than would be predicted from 1-g testing. This suggests that increased flammability at lunar conditions may not be a universal issue, however further research is needed to validate this possibility."
- **Source:** Urban et al., "Solid Fuel Ignition Testing for Lunar Applications, Theory and Experimental Results", ICES-2025-392. NTRS 20250002114. https://ntrs.nasa.gov/api/citations/20250002114/downloads/ICES_2025-392-correctedcaptions.pdf
- **PDF p.:** 11. **Access:** full text read (12 pages).
- **Scope:** five materials (0.8 mm PMMA, P213 tape, cotton T-shirt "Beefy-T", polycarbonate, Nomex Velcro) at "the planned NASA lunar habitat pressure of 56.5 kPa (8.2 psia)" (PDF p. 6). 1-g side: WSTF forced upward flow at 60 to 144 cm/s. Lunar side: GRC centrifuge in the 5.2 s drop tower. Both use a 5-second extinction criterion, not the Test 1 burn length.
- **Cautions:** Lunar-g limit values appear only in Figures 7 to 12 and are not reported here. For polycarbonate and Nomex Velcro the paper says (PDF p. 11) "the lunar-g buoyant extinction is at substantially higher oxygen concentrations that the WSTF data." The lunar-g igniter region used gas "5 to 10% higher" in oxygen than ambient (PDF p. 7).
- **Panel:** partial gravity, prevention.

### PHY-05. Proposed 1-g to lunar-g compensation factors (extrapolated, not measured)

- **Statement:** The same paper tabulates a conservative oxygen offset per material, with a stated worst case of 2.3%.
- **Quote (Table 2, "Flammability Compensation Factors", rendered):**

| Material | Best Fit Slope (s/cm) | 95% Confidence Interval Slope (s/cm) | ∆O2% (at 35 cm/s) for 95% Confidence Interval |
|---|---|---|---|
| PMMA | 0.00022 | 0.00056 | 1.9 |
| Polycarbonate | 0.00040 | 0.00065 | 2.3 |
| Nomex Velcro | 0.000016 | 0.000090 | 0.32 |
| P 213 | 0.00030 | 0.00040 | 1.4 |
| Beefy-T (flaming) | 0.00017 | 0.00023 | 0.82 |
| Beefy-T (smolder) | 0.00034 | 0.00050 | 1.8 |

- **Second quote (PDF p. 10):** "The worst-case delta for these materials can be seen to be 2.3%."
- **Source:** as PHY-04. **PDF p.:** 11 (table), 10 (quote). **Access:** full text read.
- **Scope:** slopes fitted to 1-g WSTF limit points, extrapolated from an assumed 35 cm/s buoyant velocity to zero flow.
- **Cautions:** This is not a measured lunar-minus-Earth difference. The authors say the buoyant velocity is "considered to be not determined in this paper" (PDF p. 10). For PMMA, P213 and flaming Beefy-T the measured lunar limit was below the extrapolation: "This result is contrary to expected behavior." (PDF p. 9). Slope units are as printed.
- **Panel:** modelling, prevention.

### PHY-06. Where 8.2 psia / 34% O2 comes from, and its link to 10.2 psia / 26.5% O2

- **Statement:** The 8.2/34 atmosphere is a 2012 alteration of the 8.0 psia / 32% recommendation, made to reduce hypoxic stress, and is described as physiologically equivalent to the Shuttle 10.2 psia / 26.5% atmosphere.
- **Quote:** "After re-evaluation in 2012, the 8/32 environment was altered to 8.2 psia and 34% O2 to reduce the hypoxic stress to a crewmember."
- **Second quote:** "The 8.2/34 environment (inspired O2 pressure = 128 mmHg) is also physiologically equivalent to the staged decompression atmosphere of 10.2 psia / 26.5% O2 (inspired O2 pressure = 127 mmHg) used on 34 different shuttle missions for approximately a week each flight."
- **Source:** Norcross et al., "Evidence Report: Risk of Hypobaric Hypoxia from the Exploration Atmosphere" (2015), JSC-CN-34806. NTRS 20150021491. https://ntrs.nasa.gov/api/citations/20150021491/downloads/20150021491.pdf
- **PDF p.:** 4. **Access:** pages 4 to 6 read (43 pages).
- **Scope:** human-health evidence report. The equivalence is physiological (inspired oxygen pressure).
- **Cautions:** Physiological equivalence is not flammability equivalence (see PHY-08, PHY-09). A later page (PDF p. 9, seen as one line only) refers to "33 missions"; the count differs from "34" as printed here.
- **Panel:** Moon view.

### PHY-07. The 2006 EAWG recommendation and the place of flammability in it

- **Statement:** The working group traded hypoxia, flammability and decompression sickness, and chose 8 psia / 32% O2 as having acceptable flammability risk.
- **Quote:** "The 8 psia / 32% O2 (henceforth referred to as 8/32) environment was selected because it was considered to be a mildly hypoxic atmosphere with acceptable flammability risk and low O2 prebreathe (PB) overhead to maintain acceptable DCS risk [1]."
- **Second quote:** "The Exploration Atmosphere Action Team convened in 2012 to review the 8/32 atmospheric recommendation and moved to alter the environment to 8.2 psia and 34% O2 to reduce the hypoxic stress without affecting DCS risk or materials concerns [3]."
- **Source:** as PHY-06. **PDF p.:** 5. **Access:** pages 4 to 6 read.
- **Scope:** secondary account of the EAWG final report (its refs [1], [2]), which was not retrieved. The same page lists the 2006 recommendations, including "Lunar and Mars landers should operate at both 10.2 psia / 26.5% O2 and 8.0 psia / 32% O2" and a control box of "± 0.2 psia total pressure and ± 2.0% O2 concentration".
- **Cautions:** "acceptable flammability risk" and "without affecting ... materials concerns" are judgments reported by this source. They are not test results and predate the partial-gravity work above.
- **Panel:** Moon view, prevention.

### PHY-08. Lower oxygen percentage at higher pressure can be the more flammable condition

- **Statement:** In 1-g Test 1 data, the maximum self-extinguishing oxygen concentration falls roughly linearly as total pressure rises, enough that a material limited at 30% O2 / 10.2 psia would fail at 25.9% O2 / 14.7 psia.
- **Quote:** "For at least one of the materials tested, the data indicate that a material with an MOC of 30% oxygen at 10.2 psia would fail NASA-STD-(I)-6001B Test 1 at 25.9% oxygen and 14.7 psia."
- **Second quote:** "The maximum slope was -0.975% oxygen/psia and the minimum was -0.251% oxygen/psia, with an average of -0.607% oxygen/psia."
- **Source:** Hirsch, Juarez, Peyton, Harper and Olson, "Selected Parametric Effects on Materials Flammability Limits" (2011), JSC-CN-23164. NTRS 20110008636. https://ntrs.nasa.gov/api/citations/20110008636/downloads/20110008636.pdf
- **PDF p.:** 2. **Access:** page 2 read (9 pages).
- **Scope:** normal gravity, quiescent, NASA-STD-(I)-6001B Test 1. Stated for "materials with maximum oxygen concentrations (MOCs) at which extinguishment occurs in the range of 25-35% oxygen". Summarises an earlier study (its ref. 2), which has no download on NTRS.
- **Cautions:** 1 g only. Do not carry the slopes to reduced gravity or outside the tested pressure range.
- **Panel:** modelling, prevention.

### PHY-09. Printed 1-g thresholds at 7, 12.4 and 14.7 psia for eleven polymers

- **Statement:** For every listed material the printed MOC is equal or higher at lower total pressure, while the corresponding oxygen partial pressure is lower.
- **Quote:** "For the 48.2 to 101.3 kPa (7 to 14.7 psia) total pressure range, the oxygen concentration and partial pressure flammability thresholds show a near linear function of total pressure."
- **Table 2 as printed (MOC in vol %, MOP in psia; text layer, not rendered):**

| Material | MOC at 7 psia | MOP | MOC at 12.4 psia | MOP | MOC at 14.7 psia | MOP |
|---|---|---|---|---|---|---|
| PTFE | 53 | 3.7 | 46 | 5.7 | 42 | 6.2 |
| Kel-F 81 | 76 | 5.3 | 56 | 6.9 | 53 | 7.8 |
| Silicone | 28 | 2.0 | 23 | 2.8 | 21 | 3.1 |
| Zytel 42 | 25 | 1.8 | 23 | 2.8 | 23 | 3.4 |
| Viton A | 29 | 2.0 | 21 | 2.6 | 21 | 3.1 |
| Buna S | 18 | 1.3 | 17 | 2.1 | 16 | 2.4 |
| Neoprene | 18 | 1.3 | 17 | 2.1 | 16 | 2.4 |
| Buna N | 18 | 1.3 | 16 | 2.0 | 15 | 2.2 |
| EPDM Rubber | 18 | 1.3 | 16 | 2.0 | 16 | 2.4 |
| Polyethylene | 18 | 1.3 | 18 | 2.2 | 17 | 2.5 |
| Delrin | 13 | 0.9 | 12 | 1.5 | 11 | 1.6 |

- **Source:** Hirsch, Williams and Beeson, "Pressure Effects on Oxygen Concentration Flammability Thresholds of Materials for Aerospace Applications" (2006 preprint). NTRS 20070005041. https://ntrs.nasa.gov/api/citations/20070005041/downloads/20070005041.pdf
- **PDF p.:** 3 (quote), 4 (table). **Access:** full text read (6 pages; page 6 text layer is scrambled).
- **Scope:** normal gravity, quiescent, Test 1 procedure, samples about 1.5 mm thick, ambient initial temperature. "MOP = Maximum oxygen partial pressure when extinguishment occurs (based on MOC)."
- **Cautions:** The table was not rendered. Column assignment was cross-checked only against the table's own MOP definition. No thin films or fabrics. 1 g only.
- **Panel:** modelling.

### PHY-10. In nearly pure oxygen, typical cabin materials become flammable between 0.4 and 0.9 psia

- **Statement:** A Test 1 based pressure-threshold study in 99.8% oxygen found thresholds of 0.4 to 0.9 psia and no correlation with the oxygen-concentration threshold at 10.2 psia.
- **Quote (rendered):** "Otherwise, for the materials tested (which had MOCs in the range of 24 to 32 at 10.2 psia), there was no correlation between the MOC and MTP. The results show that CEV CM materials may be flammable in oxygen at pressures as low as 0.4 psia and that the pressure should be kept below 0.4 psia to ensure they are still self-extinguishing."
- **Table 2 as printed (rendered):**

| Material | ULPI | MTP | ULOI | MOC |
|---|---|---|---|---|
| Epoxy/glass | 0.9 | 0.8 | 28.6 | 24 |
| Udel P1700 | 1.0 | 0.9 | 31.7 | 29 |
| Kydex 100 | 1.8 | 0.6 | 33.5 | 32 |
| Solimide TA-301 | 0.7 | 0.5 | 29.3 | 28 |
| Melinex 515 | 0.9 | 0.4 | 21.2 | 20 |
| Nomex HT90-40 | 0.6 | 0.5 | 28.5 | 25 |
| Ultem 1000 | 1.5 | 0.9 | 26.5 | 24 |

  Footnotes as printed: "ULPIs and MTPs have units of psia and were determined in 99.8% oxygen"; "ULOIs and MOCs have units of % oxygen by volume and were determined at 10.2 psia".
- **Source:** Hirsch et al., "Pressure Flammability Thresholds of Selected Aerospace Materials" (2010). NTRS 20100015582. https://ntrs.nasa.gov/citations/20100015582 (local copy).
- **PDF p.:** 2 (quote), 5 (table). **Access:** full text read (5 pages, scanned; quotes checked against rendered pages because the OCR layer has errors).
- **Scope:** normal gravity, quiescent, closed 1400-L chamber. "The NASA-STD-6001 Test 1 burn length criterion was used"; 6-in. samples; a hot-wire ignition source replaced the standard chemical igniter. Scenario: Orion cabin depressurised with suit oxygen leakage.
- **Cautions:** Not a habitat atmosphere. Useful only to show that oxygen partial pressure alone does not order materials.
- **Panel:** modelling, prevention.

### PHY-11. Microgravity versus 1-g limits for three thin materials (drop tower)

- **Statement:** With 30 cm/s concurrent flow, three thin materials burned in microgravity at lower oxygen concentrations than their 1-g Test 1 limits, by up to 4% oxygen.
- **Quote:** "The 1g ULOI and 1g MOC are found to be greater than those in 0g, by up to 4% oxygen mole fraction, meaning that the fuels burned in 0g at lower oxygen concentrations than they did using the Test 1 protocol."
- **Table 1 as printed (rendered):**

| Fuel | 1g ULOI | 1g MOC | 0g ULOI (burns) | 0g MOC (extinguishes) |
|---|---|---|---|---|
| Nomex HT90-40 fabric | 25.4% O2 (±0.6), 14.7 psia* | 22% O2, 14.7 psia* | 23% O2, 14.7 psia, 30 cm/s | 22% O2, 14.7 psia, 30 cm/s |
| Ultem 1000, 10 mil | 26.5% O2, 10.2 psia* | 24% O2, 10.2 psia* | 24% O2, 10.2 psia, 30 cm/s | 23% O2, 10.2 psia, 30 cm/s |
| Mylar G | 20.8% O2, 10.2 psia* | 20% O2, 10.2 psia* | 17% O2, 10.2 psia, 30 cm/s | 16% O2, 10.2 psia, 30 cm/s |

  "*WSTF data (ref. 8)"; ref. 8 is a personal communication.
- **Source:** Olson, Ruff and Miller, "Microgravity Flame Spread in Exploration Atmospheres: Pressure, Oxygen, and Velocity Effects on Opposed and Concurrent Flame Spread", NASA/TM-2008-215260. NTRS 20080034883. https://ntrs.nasa.gov/api/citations/20080034883/downloads/20080034883.pdf
- **PDF p.:** 7 (table), 11 (quote). **Access:** full text read (15 pages).
- **Scope:** 5.18 s drop tower, low-speed flow tunnel, 5 cm by 10 cm samples, concurrent flow at 30 cm/s.
- **Cautions:** The 0g values match the 0g* rows of PHY-01, but the 1g values do not (Nomex ULOI 25.4 here against 23.5 in PHY-01). See conflict 1 below. The paper notes "these limits are not identical to the 1g limits due to the intrinsic limitations of the drop time" (PDF p. 6).
- **Panel:** prevention, modelling.

### PHY-12. Microgravity solid-fuel tests at 24 to 85% oxygen and 3.6 to 14.7 psia exist (2008, drop tower)

- **Statement:** Flame-spread tests on thin cellulose were run in microgravity along the normoxic curve and off it, and the authors conclude opposed-flow spread is the faster mode.
- **Quote:** "The normoxic data ranged from 24% oxygen at 12.8 psia to 85% oxygen at 3.6 psia, all at 30 cm/s flow. The oxygen varies from 24 to 50% oxygen at 10.2 psia and 30 cm/s. Velocity varies from 1 to 30 cm/s at 34% oxygen and 10.2 psia. Pressure varies from 5 to 14.7 psia at 40% oxygen and 30 cm/s."
- **Second quote (PDF p. 11):** "This boundary revealed that over virtually the entire range of spacecraft atmospheres and flow conditions, the opposed spread is faster in microgravity, especially for the normoxic case."
- **Source:** as PHY-11. **PDF p.:** 9 (first quote), 11 (second). **Access:** full text read.
- **Scope:** Kimwipes (thin cellulose tissue), "Thirty concurrent and ten opposed flow flame spread tests", 5.18 s drop tower, forced flow 0 to 30 cm/s.
- **Cautions:** One thin, fast-burning fuel. The opposed-faster conclusion comes from fitted correlations, not from paired tests at each condition. The paper asks that it "be investigated using other types of materials" (PDF p. 10). The same paper says (PDF p. 10) "the 1g MOCs are not generally a strong function of pressure but instead vary primarily with oxygen concentration."
- **Panel:** Moon view, modelling.

### PHY-13. Orbital large-scale tests above 22% oxygen at reduced pressure: Saffire V

- **Statement:** Three Saffire V samples burned at about 71 to 73 kPa and 25.4 to 26.2 mol % oxygen.
- **Quote (Table 1, "Saffire IV-V Sample Test Conditions", rendered):**

| Flight/Sample | IV-1 | IV-2 | V-2 | V-3 | V-4 |
|---|---|---|---|---|---|
| Material/configuration | SIBAL Cloth | 2-sided PMMA | Cotton Jersey | 1 sided PMMA | Structured PMMA |
| Length (cm) | 50 | 18 | 50 | 18 | 20 |
| Air Flow Rate (cm/s) | 20 | 20 | 20 | 20 | 20 |
| Flow Direction | Concurrent | Concurrent | Concurrent | Concurrent | Opposed |
| Ambient Pressure (kPa) | 100.0 | 100.0 | 70.7 | 71.3 | 72.6 |
| Oxygen Concentration (mol %) | 22.0 | 22.0 | 26.2 | 25.4 | 25.7 |

- **Source:** Urban et al., "Fire Safety Implications of Preliminary Results from Saffire IV and V Experiments on Large Scale Spacecraft Fires", ICES-2021-266. NTRS 20210011521. https://ntrs.nasa.gov/api/citations/20210011521/downloads/ICES%202021-266%200503-2021%20final.pdf
- **PDF p.:** 3. **Access:** pages 3, 5, 7 and 8 read in part (12 pages).
- **Scope:** Cygnus vehicle in orbit after leaving the station; samples 40 cm wide per the abstract; forced flow 20 cm/s.
- **Cautions:** Titled "preliminary results". The team's own Saffire V and VI papers should be the primary record for these runs. This anchor only establishes that such conditions were flown.
- **Panel:** Moon view.

### PHY-14. Station tests of PMMA spheres span 13 to 28% oxygen at one atmosphere (SoFIE-GEL)

- **Statement:** A SoFIE-GEL results paper reports microgravity extinction tests on 4-cm PMMA spheres over an oxygen range reaching 28%.
- **Quote:** "Upon ignition from an electrically-heated coil, the 4-cm-diameter samples are exposed to forced flows ranging from 0.2 to 80 cm/s and an oxygen ranging from 13 to 28% in one atmosphere total pressure."
- **Source:** Li, T'ien, Ferkul, Olson and Johnston, "Extinction of Solid Diffusion Flame in Microgravity: Details of Quenching and Blowoff Processes", 40th International Symposium on Combustion. NTRS 20240007628. https://ntrs.nasa.gov/api/citations/20240007628/downloads/GELsymposiumfinalRev1.pdf
- **PDF p.:** 1. **Access:** page 1 read in full, pages 2 to 4 in part (9 pages).
- **Scope:** International Space Station, SoFIE insert, forced flow, one atmosphere total pressure. "Extinction is reached as oxygen concentration gradually decreases by natural depletion."
- **Cautions:** The range is an abstract-level statement about the test campaign. The five tabulated extinction cases were not fully read, so no per-case oxygen value is given here. One atmosphere only: this is not a reduced-pressure test.
- **Panel:** Moon view, modelling.

### PHY-15. Saffire I: a large concurrent flame reached a steady, limited length

- **Statement:** A 40.6 cm wide fabric sample burning in 20 cm/s concurrent flow reached a plateau flame length and a steady spread rate; opposed spread was slower.
- **Quote:** "For the concurrent flame, the length reaches a plateau value of around 40 mm, while the opposed-flow flame is a bit shorter at 24 mm."
- **Second quote (same page):** "The average concurrent-flow flame spread rate is 1.8 mm/s. The opposed-flow flame average spread rate 1.3 mm/s."
- **Third quote (PDF p. 26):** "Unlike 1-g, the results revealed that a steady flame could be achieved even for a wide sample burning in concurrent-flow."
- **Source:** Ferkul et al., "Results of Large-Scale Spacecraft Flammability Tests", ICES 2017 presentation. NTRS 20170008805. https://ntrs.nasa.gov/api/citations/20170008805/downloads/20170008805.pdf
- **PDF p.:** 21, 26. **Access:** slides 1 to 26 read (36 slides).
- **Scope:** Saffire-I, cotton-fiberglass "SIBAL" fabric, "Large sample (40.6 cm x 94 cm)", "Flow speed of 20 cm/s", "Initial oxygen concentration 21.7% (ISS reading)" (PDF p. 14). Flow duct 18 by 20 inches.
- **Cautions:** Slide deck, not a paper. Later work attributes flame size and spread partly to duct height (20210011521, PDF p. 7), so do not treat 40 mm as a material property. The later paper generalises (PDF p. 8): "under a variety of conditions, concurrent flames spreading over thin fuels will achieve a limiting size."
- **Panel:** modelling.

### PHY-16. Saffire II: silicone burned less readily in microgravity than in 1 g

- **Statement:** Silicone sheets that burn in 1-g upward tests did not sustain flame spread in orbit at the flow speeds tested, and Nomex was not ignited by a PMMA pilot flame.
- **Quote:** "Flammability of silicone in microgravity appears to be reduced compared to normal gravity, at least for the flow speeds tested."
- **Second quote (same page):** "Nomex®, a common material used on the ISS and rated “safe,” could not be ignited even when bathed by a pilot flame."
- **Source:** as PHY-15. **PDF p.:** 26 (details on pp. 9 to 13, 24, 25). **Access:** slides 1 to 26 read.
- **Scope:** Saffire-2 samples 5 cm wide by 29 cm long; "20 cm/s flow for all tests except for Sample 2-6 (25 cm/s)"; "Initial oxygen concentration 22.1% (ISS reading, slightly higher than Saffire-1’s 21.7%)".
- **Cautions:** The authors call the silicone result "perplexing" and say "More work is needed" (PDF p. 13). It is a counter-example to any blanket claim that low gravity is more flammable. Flow was below typical 1-g buoyant speeds.
- **Panel:** prevention.

### PHY-17. BASS-II: PMMA rods burned in orbit below their 1-g blowoff limit

- **Statement:** A quarter-inch PMMA rod spread steadily at 13.6% oxygen in microgravity against a 1-g blowoff at 16%.
- **Quote:** "The 1g blowoff for the ¼” rod is at 16% oxygen, whereas we obtained steady spreading at 13.6% oxygen in BASS-II. Thus the material has a negative Oxygen Margin of Safety of 2.4% O2, and the normal gravity flammability limits should be de-rated by at least that much."
- **Second quote (same page):** "The minimum in the flammability boundary is at low speed, on the order of diffusive flows."
- **Source:** Ferkul et al., "Combustion of Solids in Microgravity: Results from the BASS-II Experiment" (2014 poster). NTRS 20160000593. https://ntrs.nasa.gov/citations/20160000593 (local copy).
- **PDF p.:** 18. **Access:** full text read (21 slides).
- **Scope:** station glovebox flow tunnel; 24 PMMA rods "burned in concurrent (stagnation point) flow"; oxygen at 21% and below; pressure not stated on this slide.
- **Cautions:** Pressure is not stated: leave it unknown. A later SoFIE overview slide prints a different figure for what appears to be the same quantity (conflict 3 below). Do not merge them.
- **Panel:** prevention, modelling.

### PHY-18. LUCI: first extended burns in simulated lunar gravity, with printed spread rates

- **Statement:** On a spinning sounding rocket, fabric and a PMMA rod burned for over two and a half minutes in simulated lunar gravity; fitted spread rates were lower than in the 1-g comparison burns.
- **Quote (PDF p. 12):** "These are the first-ever, extended-duration (greater than 25 seconds) combustion tests performed in simulated Lunar gravity."
- **Printed values (text layer, not rendered):**
  - PDF p. 33, SIBAL fabric, "Flame Spread Rates (from linear fits)": Flame Base, Partial-G .9 mm/s, 1-G 1.5 mm/s, Ratio .6. Flame Tip, Partial-G 1.1 mm/s, 1-G 2.8 mm/s, Ratio .39.
  - PDF p. 36, PMMA, "Flame Tip Spread (from linear fits)": Partial-G .15 cm/s, 1-G .40 cm/s, Ratio .38.
- **Second quote (PDF p. 34):** "1-g extinction happens ~ 45 seconds sooner than partial-g extinction"
- **Source:** Ferkul, Johnston, Kralik and Liao, "Lunar Combustion Investigation: Flammability Results from a Rotating Sounding Rocket" (2025 presentation). NTRS 20250010653. https://ntrs.nasa.gov/citations/20250010653 (local copy).
- **PDF p.:** 12, 33, 34, 36. **Access:** full text read (44 slides).
- **Scope:** Blue Origin New Shepard, "A steady vehicle rotation of 11 RPM is established, with an effective radius of rotation of 1.22 m at the experiment location." "Two samples are burned simultaneously in air at normal pressure". Fabric burned downward, rod upward (PDF p. 16). One flight.
- **Cautions:** Chamber oxygen fell during the burns (PDF p. 22: "O2% decreases from 20% to 14.3%"), so rates are not at fixed oxygen. No limiting oxygen value is stated; do not treat 14.3% as a limit. Coriolis force affected the flame (PDF p. 17). Slower spread did not mean earlier extinction. Not an exploration atmosphere.
- **Panel:** partial gravity, Moon view.

### Supporting context (verified quotes, not counted as anchors)

- **C-1, FM2 plan.** "The environmental control system can replicate and conduct fire experiments automatically in the expected atmospheres, specifically 21% oxygen at 14.7 psia, and 34% oxygen at 8.2 psia, which are of immediate interest to the Human Lander System (HLS) and Lunar Rover." NTRS 20240008623, PDF p. 1 (local copy, poster). The 2026 abstract (20260000646, PDF p. 1) adds: "Flammability of Materials on the Moon (FM2) will burn a total of four solid fuel samples in quiescent habitable atmospheres in actual long duration Lunar gravity (Fig. 1)." Plans only.
- **C-2, non-monotonic spread in gravity.** "The downward spread rate is non-monotonic and peaks near the Martian gravity levels of 0.38 g/gEarth." Sacksteder et al. (2003), NTRS 20040053567, PDF p. 2. Thin cellulose, air at 27.6 kPa, KC-135 aircraft.
- **C-3, 1-g thresholds at 70.1 kPa.** "Many of the materials evaluated passed the 15.2 cm burn criteria in 40 % oxygen at 70.1 kPa." Hirsch et al. (2007), NTRS 20070018178, PDF p. 3. Same page: Nomex HT90-40 "failed in 30 % oxygen in J-configuration in both single and double layers and at 15 degrees from vertical as a single layer."
- **C-4, exploration-atmosphere screening.** "Thin fuel sheets: few materials rated even in 1g at 34% O2, 8.2 psia (exploration atmosphere)." SoFIE overview (2019), NTRS 20200000361, PDF p. 6. Slide statement.

### Check of five quotes from NTRS 20260002050 (ICES-2026-324)

Pages 3 and 4 were rendered at 170 dpi and read by eye. All five are confirmed character for character.

| Quote | PDF p. | Result | Note |
|---|---|---|---|
| (a) "NASA Artemis requirements ... as one solution to those trade-offs." | 3 | Confirmed | The text layer shows a stray space in "trade -offs"; the page shows "trade-offs". |
| (b) "less is known about oxygen concentrations above 30% oxygen ... 28.5% oxygen concentration)" | 3 | Confirmed | "atmopshere" is misspelled as printed. The sentence ends with "[2]." |
| (c) "Generally, higher oxygen concentrations and/or higher oxygen partial pressures equate to a higher flammability risk." | 3 | Confirmed | Stray spaces in the text layer are not on the page. |
| (d) "Materials to be used in the 34% atmosphere, have typically been tested up to a 37% oxygen concentration" | 4 | Confirmed | The comma is as printed. The sentence continues "for the reasons mentioned above." |
| (e) "a material that self-extinguishes in Earth gravity may continue to burn in lunar gravity." | 4 | Confirmed | The sentence begins "Thus, ". |

### Conflicts between sources (do not join by label)

1. **1-g reference limits for the same named materials differ.** Nomex HT90-40 1g ULOI is 25.4% at 14.7 psia (20080034883, p. 7), 23.5 at 14.7 psia (20130010991, p. 6) and 28.5 at 10.2 psia (20100015582, p. 5). Ultem 1000 is 26.5 (2008, 2010) against 23.5 (2012). The 2012 paper says its WSTF tests used "a hot wire igniter ... instead of a chemical igniter" (p. 4).
2. **Internal to 20130010991.** "up to 5.75%" is attributed to Martian gravity in the abstract-level conclusion but printed in the Lunar row; the Fig. 6 caption averages do not carry consistent signs.
3. **PMMA rod oxygen margin.** 2.4% O2 (20160000593, p. 18) against "PMMA rods: NOMS = 1.4% O2" (20200000361, p. 6).
4. **Legacy screening condition.** "tested up to a maximum oxygen concentration (MOC) of 30% at sea level pressure" (20260002050, p. 3) against "only tested and rated to 30% oxygen at 10.2 psia" (20130010991, p. 2).
5. **Where spread rate peaks.** Near Martian gravity for downward spread in 27.6 kPa air (C-2) against "flame spread rate as a function of gravity peaks there" for Lunar gravity (20260000646, p. 1, citing a 1994 paper). Different conditions.
6. **FM2 ride.** The poster (20240008623) names both a CLPS lander mission "CP-21" and "the SpaceX Human Lander System demonstration flight".

---

## (b) State of the science (for the lab head)

NASA screens cabin materials with a 1-g upward-burn pass/fail test (NASA-STD-6001 Test 1) at the worst expected atmosphere. Most legacy data sit at 30% oxygen and 10.2 psia.

The sources read here agree on three points.

- **Gravity is not a monotonic dial.** In 5-second drop-tower tests on three thin materials, printed limiting oxygen was lower in lunar gravity than in either 1 g or 0 g with 30 cm/s flow. The authors describe a window of gravity levels in which a flame survives.
- **The enhancement is not universal.** 2025 centrifuge work at 8.2 psia found clear increases for some materials and the opposite for higher-temperature materials, with an unexplained mismatch against 1-g forced-flow data.
- **In 1 g, thresholds move mainly with oxygen concentration.** Total pressure has a smaller, roughly linear, material-specific effect. Equal oxygen partial pressure does not mean equal flammability.

The 8.2 psia / 34% atmosphere is a 2012 physiological revision of the 2006 recommendation of 8.0 psia / 32%. It is described as physiologically equivalent to the Shuttle 10.2 psia / 26.5% atmosphere.

In orbit, large thin samples reached steady, limited flame sizes (Saffire). PMMA rods burned below their 1-g limit (BASS-II). Silicone burned less readily than on Earth.

Long-duration partial-gravity data amount to one spinning sounding-rocket flight in air at normal pressure (LUCI). Tests in true lunar gravity (FM2) are planned. Every low-gravity limit above rests on 5-second criteria that differ from the 1-g test.

---

## (c) Open gaps stated by the sources

- **Partial gravity is barely tested.** "The lack of direct tests in partial gravity is troubling from the viewpoint of fire safety because available results suggest that Lunar and Martian gravity levels could actually enhance the propensity for concurrent-flow flame spread [21]." (Gollner et al., 2021 decadal white paper, NTRS 20210022402, PDF p. 3)
- **No way yet to simulate partial gravity on Earth.** "An open, and very challenging question is therefore: “How does one simulate, on Earth, the partial gravity conditions encountered in destinations such as the Moon, or Mars?.”" (20210022402, PDF p. 5)
- **Test times are too short.** "Partial gravity tests can be performed in drop towers [8] and aboard aircraft [2], but the available times are too short to provide significant flame development (5 s for drop tower and ~25 s for aircraft)." (20260000646, PDF p. 1)
- **The shape of the gravity dependence is unknown.** "Given the sparcity of points, the exact shapes of the curves are not known, nor are the absolute minimums." (20130010991, PDF p. 8)
- **The lunar test method is not settled.** "Further study of this unexplained behavior is warranted to before the UHOI can be accepted as a material flammability standard." (20250002114, PDF p. 9)
- **The governing flow speed in lunar gravity is unknown.** "A major limitation to this analysis is identification of the relevant buoyant velocity which is an area worthy of significant research." (20250002114, PDF p. 10)
- **Above 30% oxygen.** "less is known about oxygen concentrations above 30% oxygen" (20260002050, PDF p. 3, rendered)
- **Thresholds beyond 40% oxygen and at other pressures.** "Additional testing is recommended to determine the oxygen concentration thresholds at higher oxygen concentrations than 40 % by volume, and at different pressures than 70.1 kPa." (20070018178, PDF p. 3)
- **Pressure dependence needs more materials.** "Oxygen concentration or oxygen partial pressure flammability threshold dependency on total pressures needs to be evaluated using additional materials to establish general correlations for flammability parameters." (20070005041, PDF p. 4)
- **Opposed-flow limits in microgravity along the normoxic curve.** "it is plausible that the flammability limits in 0g may also be different, especially for materials whose limits lie at higher oxygen concentrations along the normoxic curve, and should be investigated in future work." (20080034883, PDF p. 10)
- **Silicone.** "More work is needed to understand the differences between the normal and micro-g flammability of silicone." (20170008805, PDF p. 13)
- **Limited study overall.** "Material flammability in lunar gravity, or any gravity level other than earth, has received a limited amount of study" (Ruff, 2021 presentation, NTRS 20210020446, PDF p. 2)

---

## (d) What was tried and could not be retrieved

Work stopped early on instruction (compute limit), so several items below are "not reached" rather than "not found".

**Not found on NTRS with the queries used**

- Ferkul and Olson, "Zero-Gravity Centrifuge Used for the Evaluation of Material Flammability in Lunar Gravity" (2011). Queries: the full title (0 results), "zero-gravity centrifuge flammability" (2, neither the paper), "Ferkul Olson lunar" (2). Its lunar values are available only as reprinted in PHY-01. A 2021 slide cites a conference version, AIAA 2010-6260; it was not searched for.
- Any NTRS-hosted version of the 2024 PMMA-rod partial-gravity centrifuge work. Queries "partial gravity flammability" (23 results) and "lunar gravity flammability" (24) were scanned; none matched.
- The Exploration Atmospheres Working Group final report (NASA/TP-2010-216134, JSC-63309). Queries "Exploration Atmospheres Working Group" (14), "216134" (0), "JSC-63309" (0), "Recommendations for Exploration Spacecraft Internal Atmospheres" (2), "Exploration Spacecraft Internal Atmospheres" (16). The origin is documented through the 2015 Evidence Report instead (PHY-06, PHY-07).
- SoFIE results other than GEL. Queries "SoFIE-MIST", "SoFIE-RTDFS", "SoFIE SMuRF" and "Residence Time Driven Flame Spread" returned 0; "SoFIE-GEL" returned one paper (PHY-14). No NTRS-hosted SoFIE result at reduced pressure was found. That is a search result, not proof that none exists.

**Downloaded but not read, or read only in part**

- 20130013505, "Effects of the 8 psia / 32% O2 Atmosphere on the Human in the Spaceflight Environment" (72 pages): abstract only.
- 20050185597, "Bounding the Spacecraft Atmosphere Design Space for Future Exploration Missions" (53 pages): abstract only.
- 20210022402 (white paper): pages 3 and 5 only. 20210020446 (Ruff 2021): scattered lines. 20040053567: page 2 only. 20240007628: pages 5 to 9 unread. 20200000361: pages 5 to 7 only. 20110008636: page 2 only. 20210011521: four pages in part.

**Identified but not downloaded**

- 20260001966 and 20250006779 (presentation versions of PHY-03 and PHY-04), 20250010975 (Nomex poster for FM2), 20210020516 ("Fire on the Moon"), 20240015307, 20210017789 and 20210017787 (reduced-pressure flame spread), 20220009086, 20240002981 (Saffire VI preliminary results), 20200000557, 20150023467 (MIST summary of research), 20260003546, 20260003925, 20250001364.
- 20090012334 and 20090037002 have no download on NTRS.

**P6 not done**

- Moon to Mars Architecture Definition Document (NTRS 20250010956): the record was retrieved and lists three PDFs, but no PDF was downloaded. No quote for gap 0302.

**Housekeeping**

- Scripts used (`ntrs.py`, `render.py`) are in `C:\Users\Arbaz\AppData\Local\Temp\claude\aa1c8ee50eea9bf1\a78172de-00a1-4fef-bc4e-8fb127010ac5\scratchpad\lab\physicist\`. `CHRONOLOGY.md` and `research/source_conflicts.md` were not updated, because this task could not modify existing files. The six conflicts above are candidates for the conflicts log.
