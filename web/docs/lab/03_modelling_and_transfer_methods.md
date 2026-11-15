# 03 Modelling and transfer methods: route cards

Lab note, modelling and transfer-methods lead. Retrieved and read on 2026-11-15 (session date). Status of everything below: **published by the named source; not reproduced by IGNIS**.

## How to read this file

- Every line that starts with `>` is a verbatim quote copied from text retrieved in this session. The tag after it is machine-checkable: `SRC:<id> p.N` means 1-indexed PDF page N of `<id>.pdf`; `SRC:<id> web` means the saved HTML page.
- Files: new downloads are in `E:\Projects\IGNIS\_raw\lab_2026-11-15\modelling\` with `acquisition_log.json` (url, status, bytes, sha256, utc). Page text is in `F:\ignis extra\tmp\lab_text\modelling\<id>_pNNN.txt`. Already-acquired files were read in place and not re-downloaded.
- Quote hygiene: whitespace and line breaks were collapsed, and hyphens that only mark a line break in the PDF text layer were closed up. Nothing else was changed. Spelling errors in the sources are kept (for example "sparcity", "fablic", "criterions").
- Equations: several sources print equations that the PDF text layer garbles. They are **not** transcribed here. A card names the equation number and quotes the source's prose statement of it. Nobody should execute these relations from this file.
- No value was read from a figure. No formula was executed. No new physical prediction, confidence figure or safe/unsafe label is made here. Where a source uses words such as "safe" or "margin of safety", that is the source's wording inside a quote.
- "Proposed IGNIS route label" is a lab proposal for the registry, not a claim made by the source.
- No request was sent to psi.nasa.gov or psi.ndc.nasa.gov. No account, login, API key or message was used.

## Summary of cards

| ID | Method | Maps | Evidence type | Access | Card type |
|---|---|---|---|---|---|
| TM-01 | U-shaped flammability boundary in low-speed flow (SIBAL) | oxygen % and flow velocity to flammable or not | numerical model, theory | open full text (NTRS) | route card |
| TM-02 | Gravity level as the buoyant analogue of forced flow | gravity level and pressure to spread rate and extinction boundary | aircraft experiment plus 3-D model | open full text (NTRS) | route card |
| TM-03 | Oxygen margin, 1g Test 1 limit to reduced-gravity limit | 1g ULOI/MOC and reduced-g ULOI*/MOC* to ΔO2 % | drop-tower experiment | open full text (NTRS) | route card |
| TM-04 | Normoxic Upward Limiting Pressure (NULP) | Test 1 results along the normoxic band to a limiting total pressure | proposal built on published 1g data | open full text (NTRS) | route card |
| TM-05 | Flame-spread correlations in exploration atmospheres | oxygen, pressure, flow velocity to spread rate (Kimwipes) | drop-tower experiment plus correlation | open full text (NTRS) | route card |
| TM-06 | Reduced pressure as a ground surrogate for reduced gravity | ambient pressure at 1g to spread rate at reduced g | numerical (FDS) with 1g experiments | open full text (NTRS) | route card |
| TM-07 | FLARE scale-analysis prediction of microgravity MLOC | 1g downward LOC and forced-flow blow-off tests to microgravity limiting curve | scale analysis plus experiment | open full text (J-STAGE) | route card |
| TM-08 | Closed-form extinction criteria, opposed flow, microgravity | oxygen, opposing velocity, fuel thickness to spread or extinction | simplified analysis, qualitative check | open full text (NTRS) | route card |
| TM-09 | NASA Task Book project: partial gravity from microgravity and ground data | micro-g and 1g data to partial-g behaviour (goal) | project record, work in progress | open record (Task Book) | route card, in progress |
| TM-10 | Buoyant blow-off mechanism (Damkohler argument) | qualitative only | extended abstract, review statement | open full text (NTRS) | mechanism-level context |
| TM-C1 to C6 | see section A2 | | | abstract or citation only | candidate plans |

---

## A. Route cards (open full text read in this session)

### TM-01 U-shaped flammability boundary for thin solids in low-speed flow

- **Source:** T'ien, Ferkul, Sacksteder, Shih, Kumar, Kleinhenz, Bedir, Pettegrew, Piltch, Frate, "Solid Inflammability Boundary at Low-Speed (SIBAL)", Sixth International Microgravity Combustion Workshop, NASA/CP-2001-210826, printed pp. 9 to 12 (PDF pp. 1 to 4). NTRS 20010073996. https://ntrs.nasa.gov/api/citations/20010073996/downloads/20010073996.pdf (sha256 fcfc71961376...)
- **Maps:** oxygen percentage and free-stream velocity to flammable or not, plus spread rate, for a thin solid in concurrent or opposed forced flow.
- **Relation, in the source's words:**

> "In both cases, the flammability boundary is a typical U-shaped curve which consists of two branches, namely a low-speed quenching branch which is due to radiative losses from both the gas phase and the fuel surface, and a high-speed blowoff branch which is due to inadequate flow residence time." — SRC:20010073996 p.3

> "Flammability limits and spread rates are computed using oxygen percentage and free stream velocity as parameters." — SRC:20010073996 p.3

> "The primary objective is to verify the theoretically predicted extinction boundary, using oxygen percentage and flow velocity as coordinates. Of particular interest are the low-speed quenching limits and the existence of the critical oxygen flammability limit." — SRC:20010073996 p.1

- **Domain stated:** thin fuel, forced low-speed flow, model study.

> "The solid obeys a zeroth-order pyrolysis relation and is thermally and aerodynamically thin." — SRC:20010073996 p.1

  The experiment fuel is described on PDF p.1 as a custom fabric, a 1:1 blend of cotton and fiberglass. The comparison of opposed and concurrent boundaries uses a two-dimensional model (PDF p.3).
- **Limitations and failure region stated:**

> "Thus far, the computed solutions are restricted to the case with surface radiative loss only." — SRC:20010073996 p.1

> "The competition between wall heat loss, wall quenching, and oxygen side diffusion creates a number of unusual phenomena for the near-limit flames." — SRC:20010073996 p.2

> "These include faster spread for narrower samples and an extension of flammability beyond the two-dimensional limit for moderately narrow samples" — SRC:20010073996 p.2

  The statement that the opposed-flow and concurrent-flow boundaries cross over at low velocity is on PDF p.4, but the text layer of that page has no word spacing, so it is not quoted. The same point is quoted cleanly in TM-02.
- **Evidence type:** numerical model and theory. The paper describes the boundary as a prediction that the flight experiment was meant to verify.
- **Access:** open full text, NTRS, public. Scanned document with OCR text layer.
- **Status:** published; not reproduced by IGNIS.
- **Proposed IGNIS route label:** mechanism-level context for any thin fuel. Conditional only for a thin cellulosic or cotton-fiberglass sample in forced flow, and then only as "which branch of the boundary is this test near".

### TM-02 Gravity level as the buoyant analogue of forced-flow velocity

- **Source:** Sacksteder, Ferkul, Feier, Kumar, T'ien, "Upward and Downward Flame Spreading and Extinction in Partial Gravity Environments", Seventh International Workshop on Microgravity Combustion and Chemically Reacting Systems, NASA/CP-2003-212376/REV1, printed pp. 141 to 144 (PDF pp. 1 to 4). NTRS 20040053567. https://ntrs.nasa.gov/api/citations/20040053567/downloads/20040053567.pdf (sha256 f4021961886...)
- **Maps:** gravity level (0.1 to 1 g/gEarth, aircraft) and pressure to spread rate and extinction boundary, upward and downward, and compares the gravity dependence with the forced-flow dependence.
- **Relation, in the source's words:**

> "In forced flow, concurrent flame spread rate is approximately proportional to upstream velocity (similar to the gravity dependence" — SRC:20040053567 p.1

> "in buoyant case) but opposed flame spread rate is non-monotonic." — SRC:20040053567 p.2

  (The two fragments above are one sentence split by the page break.)

> "The upward burning spread rate varied linearly with gravity level for all pressure environments and sample widths tested (the inset shows data or 1 cm sample width), which has been predicted in scaling analysis [9]." — SRC:20040053567 p.2

> "This spread rate behavior is qualitatively similar to composite observations of forced flow spreading." — SRC:20040053567 p.3

> "The downward spreading boundary is U-shaped showing the dual extinction limits (insufficient residence time in high g, radiative loss in low g) now predicted by several diffusion flame models." — SRC:20040053567 p.3

> "However, the lowest flammable oxygen percentage is always in the concurrent flow case. [6]" — SRC:20040053567 p.2

  On the mixed-convection limiting oxygen index computed for an LOI-like duct:

> "The normal gravity boundary is monotonic with respect to the forced velocity while the LOI at zero gravity is non-monotonic and has a minimum around 5 cm/s. The LOI at normal gravity are higher than those at zero gravity for the range of forced velocity computed." — SRC:20040053567 p.3

- **Domain stated:**

> "Fuel samples were a thin cellulosic tissue, trade name “Kimwipes.”" — SRC:20040053567 p.2

> "Test pressures between 0.2-0.4 atmospheres were established using primary standard, precision mixtures of 21% O2, balance N2. Flight tests were performed onboard the NASA KC-135 aircraft providing partial-gravity environments of 0.1, 0.16, and 0.38 g/gEarth." — SRC:20040053567 p.2

  The computed LOI case is for a cotton and fiberglass fuel (PDF p.3 and Figure 3 caption, p.4).
- **Limitations and failure region stated:**

> "From a fundamental point of view, flame spreading in upward (concurrent) buoyant flow is considerably different from concurrent forced flow." — SRC:20040053567 p.1

> "If the upward and downward spread rates were extrapolated to lower gravity levels, a merging or crossover would occur. While this possibility has not been confirmed by experiment, the forced flow analog has been predicted [6]." — SRC:20040053567 p.3

> "computed using a three dimensional model with as-yet uncalibrated kinetic constants" — SRC:20040053567 p.4

> "This exploratory study of flame spreading and material flammability in partial gravity environments provides some practical results that require further study." — SRC:20040053567 p.4

- **Evidence type:** partial-gravity aircraft experiment (reduced-pressure air) plus three-dimensional numerical model.
- **Access:** open full text, NTRS, public.
- **Status:** published; not reproduced by IGNIS.
- **Proposed IGNIS route label:** conditional, qualitative. The source states an analogy and also states that buoyant and forced concurrent flow differ. It does not give a gravity-to-velocity conversion, so IGNIS must not compute one.

### TM-03 Oxygen margin between the 1g Test 1 limit and reduced-gravity limits

- **Source:** Olson and Ferkul, "Evaluating Material Flammability in Microgravity and Martian Gravity Compared to the NASA Standard Normal Gravity Test", AIAA conference paper, NTRS publication date 2012-07-15. NTRS 20130010991 (the NTRS record spells the first author "Oslon"). https://ntrs.nasa.gov/api/citations/20130010991/downloads/20130010991.pdf (sha256 2b0cabdfe794...)
- **Maps:** 1g ULOI and 1g MOC (modified NASA-STD-6001 Test 1) and reduced-gravity ULOI* and MOC* (drop tower) to a difference ΔO2 % per material and gravity level.
- **Relation, in the source's words:**

> "The oxygen margin of safety, or ∆O2 %, is defined here as the mean 0g limit or the Lunar limit minus the mean 1g limit as follows:" — SRC:20130010991 p.6

  Eq. (1) follows on PDF p.6. Its text layer is garbled, so it is not transcribed.

> "As shown in Fig. 6 and Table I, the 1g flammability limits are generally not conservative for these materials as evidenced by the negative ∆O2%, by up to -5.75% oxygen." — SRC:20130010991 p.7

> "There appears to be a range of g-levels within which a flame can survive. This is similar to the forced convective flammability boundary10. The two u-shaped curves are presumed to bound the flammability boundary of this material." — SRC:20130010991 p.7

> "It may be that with adequate but not excessive convection, materials burn better, as predicted by flammability maps.10" — SRC:20130010991 p.7

- **Domain stated:** three thin materials (Ultem 1000 10 mil film, Nomex HT90-40, Mylar G), concurrent flow, drop tower of 5.18 s, Martian g by centrifuge, compared with earlier 1g (White Sands), Lunar-g and 0g data with a 30 cm/s concurrent flow (PDF pp. 2 to 4).
- **Table I as printed** (PDF p.6, taken from the text layer; column assignment follows the text order and should be checked against the page image before any use). Units are oxygen molar concentration in percent.

| Row as printed | Mylar G, 10.2 psia | Ultem 1000, 10.2 psia | Nomex HT90-40, 14.7 psia |
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

- **Limitations and failure region stated:**

> "Slightly different than the 1-g definitions of MOC and ULOI, the MOC* for these tests was defined as the maximum oxygen concentration at which the flame was observed to self-extinguish during the drop time. The ULOI* criterion was minimum oxygen concentration where the flame survived the full drop time." — SRC:20130010991 p.4

> "It should be noted that the low g extinction limit criteria are not the same as 1g due to time constraints in drop testing." — SRC:20130010991 p.6

> "Since it is likely that these very weak flames might have extinguished given longer time in Martian g, the limits found are conservative." — SRC:20130010991 p.4

> "Given the sparcity of points, the exact shapes of the curves are not known, nor are the absolute minimums." — SRC:20130010991 p.8

> "If proven for more materials, this may indicate the need to include a factor of safety on 1g flammability limits." — SRC:20130010991 p.8

- **Printed inconsistencies, recorded and not corrected:** (i) the Figure 6 caption gives the Martian average without a minus sign while Table I rows are negative; (ii) footnote a on PDF p.4, about Martian-g tests, says "(lunar g)". These belong in `research/source_conflicts.md`; this lab was not allowed to edit that file.

> "The average 0g oxygen margin of safety for these three materials is -2.6% and the average Martian oxygen margin of safety is 2.7%." — SRC:20130010991 p.7

> "this means that the flame stays in a region of approximately constant g-level (lunar g)" — SRC:20130010991 p.4

- **Evidence type:** experiment (drop tower with centrifuge), three materials, different pass criteria in 1g and reduced g.
- **Access:** open full text, NTRS, public.
- **Status:** published; not reproduced by IGNIS.
- **Proposed IGNIS route label:** conditional, for these three materials at the printed pressures only, with the criterion mismatch shown next to the number. For any other material it is mechanism-level context.

### TM-04 Normoxic Upward Limiting Pressure (NULP)

- **Source:** Olson, Beeson, Fernandez-Pello, "Applying Flammability Limit Probabilities and the Normoxic Upward Limiting Pressure Concept to NASA STD-6001 Test 1", ICES-2014-179. NTRS 20150004099. https://ntrs.nasa.gov/api/citations/20150004099/downloads/20150004099.pdf (sha256 ef34b3ed1981...)
- **Maps:** 1g Test 1 pass and fail results taken along the normoxic control band to one limiting total pressure per material, then adds a factor for spaceflight.
- **Relation, in the source's words:**

> "The normoxic atmosphere is where the partial pressure of oxygen is held constant at Earth normal (ppO2=21 kPa), and the total pressure is varied by changing the relative amount of diluent." — SRC:20150004099 p.8

> "Material flammability, on the other hand, is a function of both pressure and oxygen." — SRC:20150004099 p.8

> "The general trend for all these materials shown in Figures 7-8 is for flammability to be worst at the lower total pressures for fixed partial pressure of O2, which corresponds to the highest % O2." — SRC:20150004099 p.9

> "Where the material crosses the upper limit of the spacecraft normoxic control band (±2% on the fixed partial pressure of oxygen) can be considered the Normoxic Upward Limiting Pressure (NULP). At pressures above this, the material is not flammable." — SRC:20150004099 p.9

> "This is the μNULP = NULP + SF (where SF is on the order of 10 kPa, based on existing flammability data)." — SRC:20150004099 p.9

> "SF = safety factor to account for enhanced flammability in spacecraft" — SRC:20150004099 p.1

- **Domain stated:** NASA-STD-6001 Test 1, upward, normal gravity, spacecraft cabin atmospheres along the normoxic band (EVA suits excluded as a special case, PDF p.8). One worked value is printed in text:

> "Published data [17] for Nomex HT-90-40 indicates that the NULP in 1g is approximately 90 kPa for the concurrent vertical worst case test geometry, most similar to NASA’s Test 1." — SRC:20150004099 p.9

- **Limitations and failure region stated:**

> "It is pass-fail and is only valid at the atmosphere tested." — SRC:20150004099 p.2

> "A material’s flammability boundary is shown here to be a fuzzy boundary due to the stochastic nature of the flame spread and burning processes near extinction." — SRC:20150004099 p.10

> "It is hypothesized here that the extinction process can be modeled as a Poisson process" — SRC:20150004099 p.3

> "It is thus possible to pass Test 1 with a material that is thick enough so that the observed limit is actually an ignition limit, and not a flammability limit." — SRC:20150004099 p.9

- **What this card says about normoxic equivalence:** the source treats constant oxygen partial pressure as a physiological control band. It states that flammability depends on both pressure and oxygen and is worst at the low-pressure end of the band. It does not say that normoxic atmospheres are equally flammable.
- **Evidence type:** method proposal and statistical hypothesis, built on published 1g Test 1 data. The safety factor is described only as "on the order of 10 kPa".
- **Access:** open full text, NTRS, public.
- **Status:** published; not reproduced by IGNIS.
- **Proposed IGNIS route label:** conditional, for 1g Test 1 evidence along the normoxic band. The step from NULP to a spaceflight value is a stated order-of-magnitude factor, so IGNIS should show it as the source's proposal and not apply it.

### TM-05 Flame-spread correlations in exploration atmospheres (oxygen, pressure, flow)

- **Source:** Olson, Ruff, Miller, "Microgravity Flame Spread in Exploration Atmospheres: Pressure, Oxygen, and Velocity Effects on Opposed and Concurrent Flame Spread", NASA/TM-2008-215260. NTRS 20080034883. https://ntrs.nasa.gov/api/citations/20080034883/downloads/20080034883.pdf (sha256 bb3dd1a5b3a0...)
- **Maps:** oxygen fraction, pressure and forced-flow velocity to flame spread rate for one thin fuel in microgravity, then extrapolates along the normoxic curve. Also compares 0g and 1g limits for three thin fuels.
- **Relation, in the source's words:**

> "Flame spread tests with Kimwipes were used to develop correlations that capture the effects of flow velocity, oxygen concentration, and pressure on flame spread rate." — SRC:20080034883 p.5

> "previous investigators found the flame spread rate correlated with (O2)0.9(P)0.05, with oxygen in mole-fraction and pressure in atm. (ref. 13)" — SRC:20080034883 p.9

  (Opposed flow. The text layer flattens the exponents: 0.9 on oxygen and 0.05 on pressure.)

> "The best fit of the available experimental data was obtained by using the correlation parameter shown in figure 7, which captures the linear dependencies we observed for flow and oxygen, and a square root variation with pressure." — SRC:20080034883 p.9

  (Concurrent flow. The correlation parameter is defined only on the Figure 7 axis, so it is not transcribed.)

> "While this figure shows that the flame spread rate increases as the percent O2 increases along the normoxic curve, the magnitude of the change depends on the direction of the spread." — SRC:20080034883 p.10

> "As shown in figure 5, the 1g flammability limits are generally not conservative for these materials as evidenced by the negative ΔO2%0g-1g, by up to -4% oxygen." — SRC:20080034883 p.8

  On pressure dependence and the pressure-gravity scaling used by others:

> "The Test 1 materials flammability data published by WSTF (ref. 7) demonstrate that the 1g MOCs are not generally a strong function of pressure but instead vary primarily with oxygen concentration." — SRC:20080034883 p.10

> "Also, the partial gravity correlations for upward flame spread developed by Kleinhenz et al., showed a P2-g dependence (refs. 22 and 23)." — SRC:20080034883 p.10

- **Domain stated:** spread correlations are for Kimwipes (thin cellulose) in a low-speed flow tunnel on a 5.18 s drop vehicle.

> "The flow velocity varied between 0 and 30 cm/s, the pressure varied between 3.6 and 14.7 psia, and the oxygen percentage ranged" — SRC:20080034883 p.8

> "from 24 to 85%." — SRC:20080034883 p.9

- **Limitations and failure region stated:**

> "well-correlated by this relationship except near the quench limit where flow effects play a role" — SRC:20080034883 p.9

> "For most of the range, the spread rate depends linearly on the correlation parameter, but at very low near-limit values the data show a fall off from the linear fit, as predicted (ref. 21)." — SRC:20080034883 p.9

> "Thus, the correlation can be viewed as a worst-case (i.e., highest) prediction of spread rate for a given oxygen and pressure condition." — SRC:20080034883 p.9

> "This trend should be investigated using other types of materials." — SRC:20080034883 p.10

> "If this hypothesis is verified by further experiments and analysis, it could help to understand the flammability limits derived from Test 1." — SRC:20080034883 p.11

- **Evidence type:** drop-tower experiment and empirical correlation, one fuel for spread rate, three fuels for limits.
- **Access:** open full text, NTRS, public (NASA Technical Memorandum).
- **Status:** published; not reproduced by IGNIS.
- **Proposed IGNIS route label:** conditional, away from the limit, for thin cellulose in the stated ranges. Near the limit the source itself reports fall-off, so the route closes there.

### TM-06 Reduced pressure at 1g as a surrogate for reduced gravity

- **Source:** Thomsen, Carmignani, Fernandez-Pello, Fereres, Urban, Ruff, "Determining the Cause of Reduced Concurrent Flame Spread over Thin Solid Fuels in Low Pressure and Low Gravity", ICES-2021-102. NTRS 20210017787. https://ntrs.nasa.gov/api/citations/20210017787/downloads/ICES-2021-102_Final.pdf (sha256 d453aa4b75c8...)
- **Maps:** ambient pressure at 1g to concurrent flame spread rate at reduced gravity, through reduced buoyant flow.
- **Relation, in the source's words:**

> "Thus, the effect on the flame characteristics and the spread rate, of reducing the ambient pressure is similar to that of reducing the flow velocity since it also increases the boundary layer thickness and in turn the flame stand-off distance." — SRC:20210017787 p.2

> "The results of Fig. 7 agree with the hypothesis that suggest that reduced pressure can be used to replicate the flame spread behavior observed at reduced gravity level." — SRC:20210017787 p.9

> "In such a case, flame spread rates under lunar gravity (0.17g) could be replicated by a reduction in ambient pressure to 46 kPa, and flame spread rate in a martian gravity (0.38g) would be similar to that encountered at 54 kPa." — SRC:20210017787 p.9

  (These two pressures are the source's simulation-based statement for its own case. They are quoted as the source's claim and must not be reused as a conversion.)
- **Domain stated:**

> "The numerical model is a two-dimensional simulation of the experiment done using the Fire Dynamics Simulator (FDS) [35] version 6.7.0." — SRC:20210017787 p.3

> "The fuel used is cotton and the sample thickness is 0.3 mm" — SRC:20210017787 p.3

  Inlet flow in the model is 20 cm/s at 21 % oxygen by volume (PDF p.3). The quantity compared is average flame spread rate, not a flammability limit.
- **Limitations and failure region stated:**

> "These results may indicate another aspect in which reduced buoyant flows (gravity and pressure) may differ and caution should be exercised when extrapolating results from one to the other condition." — SRC:20210017787 p.10

> "despite having similar average flame spread rates, the conditions at low pressure in 1g and 100 kPa in low gravity exhibit very different profiles, particularly at the end of the spread" — SRC:20210017787 p.11

> "This agrees with previous analytical studies, that predicted a reduced buoyant flow would have these effects but highlights the differences between reducing gravity or ambient pressure." — SRC:20210017787 p.12

> "Decoupling chemical effects from heat transfer effects shows that the chemical kinetic parameters selected are particularly important at lower ambient pressure environments where, if a detailed finite rate model is used, no propagation is observed." — SRC:20210017787 p.12

- **Evidence type:** numerical study (FDS), compared with 1g reduced-pressure experiments.
- **Access:** open full text, NTRS, public.
- **Status:** published; not reproduced by IGNIS.
- **Proposed IGNIS route label:** conditional, spread rate only, thin cotton, away from the limit, with the source's caution displayed. Not a route for flammability limits.

### TM-07 FLARE scale-analysis prediction of the microgravity limiting oxygen curve

- **Source:** Takahashi and Maruta, "Prediction of Limiting Oxygen Concentration of Thin Materials in Microgravity", Trans. JSASS Aerospace Tech. Japan, Vol. 16, No. 1, pp. 28 to 34, 2018, DOI 10.2322/tastj.16.28 (PDF p.N is printed p.N+27). https://www.jstage.jst.go.jp/article/tastj/16/1/16_28/_pdf (sha256 in acquisition log, file `jstage_tastj_16_28.pdf`)
- **Maps:** a 1g downward limiting oxygen concentration plus forced-flow blow-off tests on the ground to the limiting oxygen curve against opposed-flow velocity in microgravity, and its minimum (MLOC).
- **Relation, in the source's words:**

> "In order to predict the flammability limit of thin materials in microgravity environments without conducting microgravity experiments, we developed a simplified model for flame spread in an opposed flow by introducing two non-dimensional parameters which represent radiative quenching and blow-off extinction." — SRC:jstage_tastj_16_28 p.1

> "Equation (5) states that the extinction occurs if the sum of Rrad and 1/Da is more than unity." — SRC:jstage_tastj_16_28 p.3

> "Therefore, when the opposed flow has intermediate velocity, the limiting oxygen concentration becomes the minimum, and our aim is to predict the minimum point of the limiting curve with the data that can be obtained by the tests conducted in normal gravity." — SRC:jstage_tastj_16_28 p.2

  Eqs. (1) to (5) are printed on PDF pp. 2 to 3 but garbled in the text layer, so they are not transcribed. Reported agreement, in text:

> "The minimal point of the curve in Fig. 3 corresponds to the MLOC, which is 14.8 %." — SRC:jstage_tastj_16_28 p.3

> "The MLOC obtained by the parabolic flights is 29.5 %. On the other hand, the predicted MLOC is 29.6 %" — SRC:jstage_tastj_16_28 p.6

- **Inputs the source says are needed:**

> "In order to calculate the limiting oxygen concentration as the function of the opposed velocity, we have to know the following parameter; the flame temperature, Tf, the pyrolysis temperature, Tv, the ambient gas properties such as λg, ρg, etc., and the pre-exponential factor, A, and the activation energy, E." — SRC:jstage_tastj_16_28 p.3

- **Domain stated:**

> "In this paper, we apply the simplified model for thin PMMA (thickness: 0.125 mm), which is well-known, and the fire-resistant material, NOMEX HT90-40 (fablic)." — SRC:jstage_tastj_16_28 p.3

  Opposed flow, thin flat samples, two-dimensional flame; comparison data from parabolic flights and an earlier drop-tower result.
- **Limitations and failure region stated:**

> "The B2 has been determined by the microgravity experimental results obtained with 4.5 s drop tower in past" — SRC:jstage_tastj_16_28 p.3

> "In the following discussion, we will use the same B1 and B2 for both PMMA and NOMEX." — SRC:jstage_tastj_16_28 p.3

> "The buoyant flow velocity is assumed to 35 cm/s." — SRC:jstage_tastj_16_28 p.5

> "On the other hand, the calculated E* increases slightly with the opposed flow velocity, which means that the Eq. (4) does not strictly represent the details of the blow-off phenomena." — SRC:jstage_tastj_16_28 p.5

> "When the opposed flow velocity is very high in particular, the velocity gradient in the boundary layer becomes very steep and the estimation of the effective velocity becomes difficult." — SRC:jstage_tastj_16_28 p.5

> "The experimental results for PMMA and NOMEX showed that the empirical A* and E* obtained by the downward blow-off test in a forced flow ranging between 70 and 120 cm/s could predict the actual blow-off limit correctly." — SRC:jstage_tastj_16_28 p.6

  Lab reading of the above (not a source statement): the radiative constant was fixed from one microgravity drop-tower condition for PMMA and then reused for Nomex, so the method is "ground tests plus one microgravity calibration", and it is shown for two thin materials in opposed flow.
- **Evidence type:** scale analysis with two empirical constants, ground blow-off experiments, comparison with parabolic-flight data.
- **Access:** open full text (J-STAGE free PDF). Copyright JSASS; quote, do not redistribute the PDF.
- **Status:** published; not reproduced by IGNIS.
- **Proposed IGNIS route label:** conditional through a named published method, for thin flat materials in opposed flow in microgravity. It does not address partial gravity or concurrent flow.

### TM-08 Closed-form extinction criteria for opposed-flow spread in microgravity

- **Source:** Bhattacharjee, Paolini, Wakai, Takahashi, "Extinction Criteria for Opposed-Flow Flame Spread in a Microgravity Environment", NASA/CP-2003-212376/REV1, printed pp. 201 to 204 (PDF pp. 1 to 4). NTRS 20040053557. https://ntrs.nasa.gov/api/citations/20040053557/downloads/20040053557.pdf (sha256 d237a76afe3a...)
- **Maps:** oxygen level, opposing-flow velocity and fuel thickness to a non-dimensional spread rate and an extinction criterion, for thin and thick fuels.
- **Relation, in the source's words:**

> "The energy balance equation, that includes surface re-radiation, is solved to yield a closed form spread rate expression in terms of its thermal limit, and a radiation number that can be evaluated from the known parameters of the problem." — SRC:20040053557 p.1

> "Flammability maps with oxygen level, opposing flow velocity and fuel thickness as independent variables are extracted from the theory that explains the well-established trends in the existing experimental data [3]." — SRC:20040053557 p.1

  Eqs. (1) to (6) and the extinction inequalities are printed on PDF pp. 1 to 2 but garbled in the text layer, so they are not transcribed. The printed flammability map (Figure 7, PDF p.4) is for PMMA at 1 atm at several half-thicknesses; no value was read from it.
- **Domain stated:** opposed flow, mild flow, microgravity; thin and thick limits; PMMA; data from the MGLAB drop facility.

> "extinction criterions for a flame over solid fuels, both thin and thick, have been developed that are qualitatively verified with experiments conducted at the MGLAB [2] in Japan" — SRC:20040053557 p.1

- **Limitations and failure region stated:**

> "Although the spread of the data around the prediction of Eq. (6) is substantial, the onset of radiative effects seems to be well correlated by the analytical prediction." — SRC:20040053557 p.2

> "Not much data in the thick-thin transitional region is available to verify this simple transition criterion." — SRC:20040053557 p.2

> "The results presented are supported by experiments on thin PMMA conducted in the MGLAB." — SRC:20040053557 p.2

- **Evidence type:** simplified analysis (scaling), qualitative comparison with thin-PMMA drop experiments.
- **Access:** open full text, NTRS, public.
- **Status:** published; not reproduced by IGNIS.
- **Proposed IGNIS route label:** mechanism-level context for thick fuels (the thick limit is not supported by data in this paper); conditional and qualitative for thin PMMA in opposed flow.

### TM-09 NASA Task Book project: predicting partial-gravity flammability from microgravity and ground data (in progress)

- **Source:** NASA Task Book record, "Predicting Material Flammability in Partial Gravity Using Microgravity and Ground Data", PI Ya-Ting Liao, Case Western Reserve University, grant 80NSSC24K0310, FY 2026 record, start 11/01/2023, end 11/02/2026, task last updated 10/08/2025, project type "Ground, Physical Sciences Informatics (PSI)". https://taskbook.nasaprs.com/tbp/index.cfm?action=public_query_taskbook_content&TASKID=99BEAE9E7F5F1420D1506AD0FE9C1A6D (saved as `taskbook_task_liao_partial_gravity.html`). Two open-science posters attached to the record were also read: `tb_poster_thinnakornsutibutr_2025.pdf` and `tb_poster_neupane_imece_2024.pdf` (URLs in the acquisition log).
- **Maps (goal):** microgravity data and normal-gravity data to burning behaviour and flammability boundaries in partial gravity, through dimensionless correlations.
- **Relation, in the source's words:**

> "In this project, it is hypothesized that burning behaviors and flammability boundaries of solid materials in partial gravity can be predicted using data collected in normal and microgravity." — SRC:taskbook_task_liao_partial_gravity web

> "This will allow us to correlate the gravity-induced buoyancy flows (in normal gravity) to the imposed flows in microgravity, in terms of their effects on the burning process." — SRC:taskbook_task_liao_partial_gravity web

> "It was found that approximating δf ~ δv for forced flow and δf ~ 1/3 δv for natural flow can predict the flame spread rate reasonably well for data obtained in micro-, partial, and normal gravities, for a wide range of environmental conditions away from extinction limits." — SRC:taskbook_task_liao_partial_gravity web

> "Based on pressure modeling, fire behavior in partial gravity can be correlated to that in a reduced pressure environment if p2g are kept constant. Further analysis of the simulation results is ongoing." — SRC:taskbook_task_liao_partial_gravity web

  (In the last quote "p2g" is the record's plain-text rendering. The attached poster prints a Grashof-number relation labelled as pressure modelling and cites De Ris, Kanury and Yuen, 1973; its symbols are garbled in the text layer and are not transcribed.)
- **Domain stated:** thin fuels (cellulose filter paper, 0.2 mm PMMA, SIBAL fabric in simulations); upward and downward spread; reduced pressure used to lower buoyant flow; spread rate correlation stated as valid "away from extinction limits".
- **Limitations and failure region stated:**

> "Flame spread rates will be eventually predicted using a proposed correlation for buoyant-flow, purely-forced flow, and mixed flow conditions." — SRC:taskbook_task_liao_partial_gravity web

> "Through these efforts, we will identify invariant dimensionless parameters for flame spread and develop correlations between burning characteristics and the identified dimensionless parameters." — SRC:taskbook_task_liao_partial_gravity web

> "Although reducing gravity and pressure levels both demonstrated thicker boundary layer thicknesses, the magnitude of the buoyant flow decreases only with the gravity level (i.e., reduced convection). While pressure decreases, the thicker boundary layer is caused by enhanced thermal diffusion." — SRC:tb_poster_thinnakornsutibutr_2025 p.1

> "Despite these distinct mechanisms, both contribute to a thicker boundary layer, greater flame standoff distance from the sample surface, and reduced convective heat transfer to the solid." — SRC:tb_poster_neupane_imece_2024 p.1

- **Evidence type:** project record (work in progress), ground experiments, numerical simulations, posters. The peer-reviewed paper the record cites for the standoff-distance correlation (Neupane and Liao, Combustion and Flame 272, 113880, 2025) was not retrieved, see TM-C5.
- **Access:** open (public Task Book record and attached open-science PDFs).
- **Status:** published as a project report; method not complete; not reproduced by IGNIS.
- **Proposed IGNIS route label:** conditional for spread rate away from limits, as a named in-progress method. For flammability boundaries in partial gravity the record states a hypothesis, so the route label is "not yet available".
- **Positioning note:** this project is funded under the Physical Sciences Informatics call and its first component is close to IGNIS's subject:

> "This will result in a comprehensive inter-project meta-analysis of the current knowledge on microgravity combustion." — SRC:taskbook_task_liao_partial_gravity web

### TM-10 Buoyant blow-off mechanism (mechanism-level context only)

- **Sources:** Ferkul, Kralik, Liao, "Material Flammability at Lunar and Martian Gravity", 57th LPSC extended abstract, 2 pages, NTRS 20260000646, https://ntrs.nasa.gov/api/citations/20260000646/downloads/Ferkul-Lunar%20and%20Planetary%20Science%20Conference%202026.pdf (sha256 5889dd8e7728...). Also the already-acquired ICES-2026-324, NTRS 20260002050 (not re-downloaded).
- **Maps:** nothing quantitative. It explains why a material that does not burn at 1g may burn at lower gravity or in microgravity with a slow forced flow.

> "The governing non-dimensional parameter is the Damkohler Number, which is the ratio of the characteristic flow time to the chemical reaction time." — SRC:20260000646 p.1

> "Applying a flow below the buoyant blowoff limit speed permits a material to burn in microgravity, albeit with a smaller flame size, even though it may not burn at all in 1-g." — SRC:20260000646 p.1

> "Related work suggests that oxygen concentration for flammability reaches a minimum value in the vicinity of g = g Lunar." — SRC:20260000646 p.1

> "Thus, a material that self-extinguishes in Earth gravity may continue to burn in lunar gravity." — SRC:20260002050 p.4

- **Limitations stated:**

> "but the available times are too short to provide significant flame development (5 s for drop tower and ~25 s for aircraft)" — SRC:20260000646 p.1

> "but again the Coriolis force introduces uncertainty" — SRC:20260000646 p.1

> "The first-ever combustion experiments on another world will be performed, with a planned launch date of late 2026." — SRC:20260000646 p.1

> "would validate models and theories developed using 0-g and 1-g testing" — SRC:20260000646 p.2

- **Evidence type:** extended abstract summarising prior work; systems paper statement.
- **Access:** open full text, NTRS, public.
- **Status:** published; not reproduced by IGNIS.
- **Proposed IGNIS route label:** mechanism-level context only.

---

## A2. Candidate plans (abstract, citation or foreign-language body only; not executable)

- **TM-C1 FLARE conversion equation, ground test to microgravity MLOC.** Takahashi, Int. J. Microgravity Sci. Appl. 32 (4) 2015, 320403. https://www.jstage.jst.go.jp/article/ijmsa/32/4/32_320403/_pdf . The PDF is open, but the body is in Japanese and was not read. Only the English abstract was read. Candidate plan.

> "In the FLARE project, it is one of the main objectives to derive a conversion equation which can predict the minimum limiting oxygen concentration (MLOC) of flat materials in microgravity from a ground-based flammability test, such as JIS K 7201." — SRC:jstage_ijmsa_32_320403 p.1

- **TM-C2 Two-stage approach from ISO 4589-2 LOI to reduced-gravity limits.** Nakamura and Hosogai, Int. J. Microgravity Sci. Appl. 32 (4) 2015, 320405. https://www.jstage.jst.go.jp/article/ijmsa/32/4/32_320405/_pdf . Open PDF, Japanese body not read, English abstract only. Candidate plan. Note that this source names ISO 4589-2, not ISO 4589-4.

> "Assuming that the sample thickness and the gravity are independent factors, “two-stage approach” has been proposed to obtain the flammability limit under reduced gravity field of any thickness sample by using LOI." — SRC:jstage_ijmsa_32_320405 p.1

- **TM-C3 Thickness extension of the FLARE model.** "Flammability Limits of Flat Materials with Moderate Thickness in Microgravity", Fire Technology 57, pp. 2387 to 2406, published 20 April 2021, DOI 10.1007/s10694-021-01121-1. https://link.springer.com/article/10.1007/s10694-021-01121-1 . Abstract only; the PDF link redirected to a purchase page. Authors were not captured in the saved text. Candidate plan.

> "The limiting oxygen concentration (LOC) of each sample was obtained by 20 s parabolic flight experiments in mild and low flow velocity condition, and by blow-off tests on ground in high flow velocity condition." — SRC:springer_s10694-021-01121-1 web

> "Although the hypothesis was not confirmed by experimentally, the obtained empirical model based on the hypothesis well represented the trend of the change of LOC when the sample thickness varied" — SRC:springer_s10694-021-01121-1 web

- **TM-C4 Pressure modelling of upward spread in partial gravity (P²g).** Kleinhenz, Feier, Hsu, T'ien, Ferkul, Sacksteder, Combustion and Flame, 2008, DOI 10.1016/j.combustflame.2008.05.023. Not retrieved. Known here only through citations in TM-05 (the "P2-g dependence" quote), TM-06 (reference 13) and the Task Book record. Candidate plan.
- **TM-C5 Standoff-distance correlation across micro, partial and normal gravity.** Neupane and Liao, Combustion and Flame 272, 113880, 2025, https://doi.org/10.1016/j.combustflame.2024.113880 . Not retrieved. Known through the Task Book record quoted in TM-09. Candidate plan.
- **TM-C6 FLARE Task Group 5 correlation pathway (NASA White Sands).** NTRS 20160001023, presentation slides, open full text read, but it states a work plan, not a method. https://ntrs.nasa.gov/api/citations/20160001023/downloads/20160001023.pdf

> "Correlation Pathway to compare NASA-STD-6001 Data to flight LOI data" — SRC:20160001023 p.4

> "Develop pressure cal. curve to correlate final flight test final P to corresponding MOC for a given material" — SRC:20160001023 p.4

- **Not found:** any open text that links ISO 4589-4 to FLARE. One discovery search returned none.

---

## B. What a modeller needs (at most five statements)

- **MOD-01 Inputs versus verification targets, vehicle-scale transport model (Saffire VI).** `E:\Projects\IGNIS\_raw\event_2026-11-14\S-VI_ICES-2025-156.pdf`, already on disk.

> "Inlet and outlet sensors to the Saffire payload served as the main inputs into the model, while six remote sensors placed throughout the cabin served as the verification of the model." — SRC:S-VI_ICES-2025-156 p.12

- **MOD-02 Stated model limitation: no flame physics.** Same file; the Saffire V paper says the same on its PDF p.4.

> "Since no flame or combustion properties are inputted into the model, the SFU simply acts as an object that intakes cool cabin air and outputs combustion products and hot air." — SRC:S-VI_ICES-2025-156 p.4

- **MOD-03 Calibrated heat input versus validation thermocouples, crew-cabin model run at lunar g.** Niehaus and Urban, ASGSR 2024 poster, NTRS 20240015018, https://ntrs.nasa.gov/api/citations/20240015018/downloads/ASGSR%20Poster%202024.pdf

> "The profile from the top thermocouple at the door was used as the heat input of the model and the magnitude of the heat input was calibrated until the model matched the experiment" — SRC:20240015018 p.1

> "Other thermocouples at the door were used to validate the model" — SRC:20240015018 p.1

- **MOD-04 Material and kinetic inputs needed by a limit-prediction model.** See the input list quoted in TM-07 (PDF p.3), and:

> "Computational fluid dynamic models usually rely in representative thermochemical and kinetic parameters, as well as material properties that are not readily available for most engineering materials." — SRC:20210017787 p.3

- **MOD-05 Stated limits of current solid-phase and gas-phase modelling.** Gollner et al., "Topical: Solid Fuel Combustion in Partial and Micro-Gravity", decadal-survey white paper, NTRS 20210022402, https://ntrs.nasa.gov/api/citations/20210022402/downloads/217-_GollnerMichaelJ.pdf

> "In addition, determination of solid kinetic models (both decomposition steps and kinetic parameters) remains challenging. The model parameters depend on the geometry and scale of the test to which they are deduced." — SRC:20210022402 p.6

> "However, these assumptions have been based solely on Earth observations." — SRC:20210022402 p.6

**Lab reading for the data model (not a source statement).** The sources separate three roles for a measured quantity: boundary or source input (inlet and outlet sensors, a heat-input profile, flow velocity, oxygen, pressure, gravity), material input (thickness, pyrolysis temperature, kinetic constants, emissivity), and validation target (remote sensor histories, spread rate, pyrolysis length, limiting oxygen). IGNIS should tag each extracted quantity with one of these roles and with "calibrated against" where the source tuned a parameter, because a quantity used for calibration is not an independent validation target.

---

## C. Positioning scan

Stopped before this target by a coordinator instruction (no further retrieval). What is in hand:

- **Full text read:** the NASA Task Book project in TM-09 is an existing NASA-funded informatics project whose first component is a cross-experiment meta-analysis of BASS, BASS-II and Saffire data aimed at partial-gravity prediction. It is the closest prior work to IGNIS found in this session. https://taskbook.nasaprs.com/tbp/index.cfm?action=public_query_taskbook_content&TASKID=99BEAE9E7F5F1420D1506AD0FE9C1A6D
- **Full text read:** the 2021 decadal white paper (NTRS 20210022402) names machine learning as a possible way to connect spaceflight and 1g results, with a constraint:

> "however, correlations must remain grounded in chemical and physical properties known to scale [36]." — SRC:20210022402 p.5

- **Search-result level only, pages not retrieved:** NASA Glenn FLARE page, https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/flammability-limits-at-reduced-g-experiment-flare/ ; JAXA FLARE experiment page, https://humans-in-space.jaxa.jp/en/biz-lab/experiment/theme/detail/000807.html .
- **Not scanned:** NASA MAPTIS, JAXA and ESA material databases, OpenScholar, PaperQA2, and 2025 to 2026 work on language models for combustion science. Nothing is claimed about them here.

---

## D. Bibliographic pointers (bibliographic, from memory, to be verified)

These were not retrieved. Each is labelled "bibliographic, from memory, to be verified".

- Börzsönyi, Kossmann, Stocker, "The Skyline Operator", ICDE 2001. Bibliographic, from memory, to be verified.
- Kung, Luccio, Preparata, "On Finding the Maxima of a Set of Vectors", Journal of the ACM 22(4), 1975. Bibliographic, from memory, to be verified.
- Papadias, Tao, Fu, Seeger, "Progressive Skyline Computation in Database Systems", ACM TODS 30(1), 2005. Bibliographic, from memory, to be verified.
- Khalefa, Mokbel, Levandoski, "Skyline Query Processing for Incomplete Data", ICDE 2008. Bibliographic, from memory, to be verified.
- Miao, Gao and co-authors, work on top-k dominating and skyline queries over incomplete data, IEEE TKDE, around 2016. Bibliographic, from memory, to be verified; exact title and year uncertain.

---

## E. State of the science (for the lab head)

What the retrieved sources establish:

1. For thin solids the flammable region in oxygen and flow space, or oxygen and gravity space, is U-shaped: radiative quenching at low flow or low gravity, blow-off at high flow or high gravity (TM-01, TM-02, TM-07, TM-08).
2. NASA drop-tower data for three thin materials put reduced-gravity limiting oxygen generally below the 1g Test 1 values, under different extinction criteria (TM-03, TM-05).
3. The most developed ground-to-microgravity predictor retrieved is the FLARE scale-analysis model: opposed flow, thin PMMA and Nomex, one constant calibrated on drop-tower data (TM-07).
4. For partial gravity the candidate ground surrogate is pressure modelling. The sources that state it also state its limits: similar average spread rates arise from different mechanisms (TM-06), and the NASA project testing it reports the analysis as ongoing (TM-09).
5. Along the normoxic band the sources say flammability depends on both pressure and oxygen and is worst at the lowest total pressure (TM-04). None presents constant oxygen partial pressure as preserving flammability.

What remains unsolved, according to the sources: a validated mapping from microgravity plus 1g data to lunar or Martian gravity; long-duration partial-gravity limits; thick fuels; near-limit behaviour, where correlations fall off; kinetic parameters for real materials. The 2021 white paper puts it this way:

> "However, a connection between actual microgravity and simulated microgravity, as has been established in the Narrow Channel Apparatus in prior BASS and BASS-II research [38] or pressure modeling [33,34], is completely absent for the condition of partial gravity." — SRC:20210022402 p.5

> "This may include further pursuit of pressure modeling, where lower pressures on Earth simulate some effects of microgravity on fire, however these may not all be realistic with associated changes in mass and heat transfer arising from lower pressures [33,34]." — SRC:20210022402 p.4

---

## F. What was tried and not retrieved, and other gaps

- **Kleinhenz et al. 2008 (pressure modelling, P²g):** an NTRS search for "Kleinhenz partial gravity" returned nothing; the journal article was not attempted. Candidate only (TM-C4).
- **Sacksteder and T'ien partial-gravity papers,** NTRS 19930040901 and 19990054085: the NTRS records carry no PDF.
- **Springer Fire Technology 2021 paper:** abstract only; the PDF URL redirected to the article page with a purchase option (TM-C3).
- **Neupane and Liao 2025, Combustion and Flame:** not attempted (TM-C5).
- **ISO 4589-4 and a FLARE conversion equation in English full text:** not found in one discovery search.
- **J-STAGE IJMSA 2015 papers:** PDFs retrieved, bodies are Japanese and were not read; English abstracts only.
- **NTRS 20100015582** ("Pressure Flammability Thresholds of Selected Aerospace Materials", already on disk): a search of its page text for "normoxic", "partial pressure" and related terms found no usable statement, so no card was made from it. It was not read in full in this session.
- **NASA-STD-7009 summary pages and the NIST FDS validation guide:** not attempted before the stop instruction.
- **Positioning scan (P3):** not done beyond section C.
- **Downloaded but not read:** `tb_cssci_neupane_2024.pdf` (8 pages, Task Book attachment).
- **Text-layer limits:** PDF p.4 of NTRS 20010073996 has no word spacing; equations in TM-03, TM-07 and TM-08 are garbled. A person should check those pages against the page images.
- **Search behaviour:** the NTRS search API returned nothing for long multi-term queries; short queries worked. Coverage of NTRS is therefore partial.
- **Housekeeping the lab could not do** (no edits to existing files allowed): the two printed inconsistencies in TM-03 are not yet in `research/source_conflicts.md`, and the retrieval and verification scripts (in the session scratchpad under `lab\modelling\`) are not yet logged in `CHRONOLOGY.md`.
- **Verification performed:** quotes were checked by script against the saved page text for exact match after whitespace and line-break-hyphen normalisation. This is a self-check by the same assistant that selected the quotes. It is not an independent verification.
