# Activity B: scientific interpretation check (≈ 60 min; after Activity A)

Each item states one of our claims (written by an AI assistant) so that you can test it.
- Work from the pages cited and your own A1 tables.
- Read the project file named under "Then compare" **only after** you have formed a view.

For **every** item, record on the form:
- **verdict:** agree / disagree / can't tell;
- the **assumptions** you had to make to reach it;
- the **uncertainties** that remain.

## B1. Specimen identity: B5 ↔ P5 and B9 ↔ P9
- **Claim:** Table S1's B5 and B9 (1.27 cm) are NASA tests P5 (as-run 83) and P9 (as-run 84).
  - Both are sample **202m**, a 12.7-mm black rod, on 7/14/14.
  - The link rests on diameter, colour (the S1 prefix "B" read as black), the initial O₂, and the flow sequence, **not** on the label alone.
- **Assumption built into it:** S1's O₂ equals A.3's *calibrated initial* O₂. Check this for B5/P5 and B9/P9, and for a few other pairs.
- **Questions:**
  - Could any other A.3 row be B9?
  - Which single attribute, if wrong, would break the link?
- *Then compare:* `research/data/crosswalk_link2018_S1_to_bass2_A3.csv`.

## B2. Burn order and elapsed time
- **Claim:** P5's time is 13:18:00 and P9's is 13:57:00 on the same date, so P9 is 202m's second burn, ≈ 39 min after P5 **started**.
  - P5's end time is not known, so the gap between P5's end and P9's start is shorter than 39 min, by an unknown amount.
- **Questions:**
  - The column heading reads "Approximate start time and end time (video display time)". Are these start times? Is "≈ 39 min" defensible?
  - As-run numbers 83 and 84 are adjacent. Is as-run numbering shared across all BASS-II tests (e.g. Tables A.1 and A.5), so that no other test used the chamber in between?

## B3. Atmosphere at the start of P9
- **Claim:** P9's four initial readings equal P5's four final readings, and the HCl note carries 4.7 over.
  - Calibrated O₂ 17.6; O₂ 16.7; CO₂ 1.67 %; CO 525 ppm.
  - P5's note reads "HCL 0 > 4.7"; P9's reads "HCL 4.7 > 4.5".
  - **Inferred:** the work volume was not purged or re-diluted between the two burns. So B9's 17.6 % starting O₂ was produced by the same rod's first burn.
  - [TM] p.14/6 says the volume was sealed, sensor readings were taken before and after each test, and dilution "typically took 1 to 3 h".
- **Questions:**
  - Do your A1 values agree?
  - Equal numbers might also arise if one reading was used as both "final" and "initial", or if gas was handled without being recorded. Which explanations do you consider plausible? Does any of them change the conclusion that nothing renewed the atmosphere?
  - A matching record does not by itself prove that no gas management took place. How strongly do you rate the inference?
- *Then compare:* `research/evidence_case_03.md` §3–§4 (O3–O5, I1).

## B4. The nine consecutive-burn pairs
- **Claim** (conflict register entry C-26): sort the rod rows by as-run number. In **9** adjacent pairs, the later burn's initial readings equal the earlier burn's final readings:

| Equal readings | Pairs (earlier → later) |
|---|---|
| **4 of 4** (cal. O₂, O₂, CO₂, CO) | P6→P4, P10→P8, P5→P9, P12→P17, P14→P15, P21a→P21b, P18→P24, P20→P23 |
| **3 of 3** comparable readings | P3a→P3b |
| 3 of 4; **not counted** | P1→P2 (calibrated O₂ differs by 0.1) |
| not carried over | P2→P3a, P15→P21a, P4→P10, P9→P13a, P13a→P13b, P22b→P25, P24→P20 |
| near, not equal | P16→P19 |
| can't assess | P22a→P22b |

- **Questions:**
  - Using your A1.3 table, how many pairs do **you** count? Which disagree?
  - Is "adjacent as-run number" the right meaning of *consecutive*?
  - Does the pattern support "burns sharing an atmosphere are not independent in their starting conditions"?
- *Then compare:* `research/source_conflicts.md`, C-26.

## B5. Fresh versus reburned specimens
- **Claim:** "first burn" = the earliest as-run row with that sample number in Table A.3.

| Diameter | First burns | Reburns | Other |
|---|---|---|---|
| 1.27 cm | B13a (203m), B5 (202m) | B13b (203m), B9 (202m) | |
| 0.95 cm | B4 (197m), B12 (199m) | | B22 not determined |
| 0.64 cm | B10 (187m) | | |

- **Questions:**
  - Could a specimen have been burned in a test that is **not** in Table A.3 (another table, a ground test)? If so, "first burn" means "first in this log" only.
  - Is P5's note ("lots of fuel left behind, conical shape") enough to call 202m physically altered before P9?

## B6. The three diameter comparisons
- **Claim** (derived from the tables; black rods only; burns with an open conflict excluded):

| Diameter | Lowest μg starting O₂ with a printed rate | Lowest 1 g O₂ with a printed rate | 1 g − μg |
|---|---|---|---|
| 0.64 cm | 17.0 (B10, first burn) | 18.0 | +1.0 point |
| 0.95 cm | 17.5 (B12, first burn) | 18.5 | +1.0 point |
| 1.27 cm, all burns | 17.6 (**B9, reburn**) | 18.5 | +0.9 point |
| 1.27 cm, first burns only | 19.3 (B5) | 18.5 | **−0.8 point** |

- Chamber O₂ only fell during each μg burn. So every tabulated B10 and B12 segment occurred at or below its starting O₂.
- For B5, whether its two segments occurred above or below 18.5 % cannot be told.
- **Questions:**
  - Do your A1 numbers agree?
  - We excluded B15, B16, B19 and B22, and a burn whose colour is unconfirmed (NASA P17). Would including any of them change a conclusion, as opposed to a number?
  - Is "O₂ only fell during each burn" supported for every burn you read?
- *Then compare:* `research/evidence_case_03.md` §2 and D1–D3.

## B7. Tabulated measurements versus flammability thresholds
- **Claim:** a lowest-O₂-with-a-rate is a statistic over records, **not** a limiting oxygen concentration (LOC).
  - Spread observed at a starting O₂ X shows only that the limit, under that protocol, is **at or below** X.
  - To say the μg limit is lower than the 1 g limit, you also need 1 g evidence of **no** spread above the μg value. The only such evidence is:
    - the "-" entries, which the tables do not define;
    - the authors' statements: [L18] p.5, Fig. 6 caption ("cannot be sustained at X_O₂ < 18.5%"), and p.6 ("flame cannot exist in normal gravity for X_O₂ = 18% and below").
  - For **fresh 1.27-cm** rods, the 1 g "-" rows (18.1, 18.3) lie below 19.3, so no ordering follows.
- **Other differences:**
  - μg O₂ is the starting value in a sealed, depleting volume; 1 g is a metered flowing mixture ([L18] p.3).
  - Pressure is not reported.
  - The 1 g rate is an average of several tests; the μg rate is a single segment.
- **Questions:**
  - Is "bounds the limit only from above" correct?
  - Can any LOC value be defended from these tables?
  - Are the authors' statements enough to read "-" as "no sustained spread"?
  - What else must be assumed?

## B8. Spread-rate measurements versus extinction criteria
- **Claim:** the tables' rates measure **how fast** a flame front moves along the rod. An extinction criterion is a **limit**, and it is a different quantity. Examples:
  - the flow velocity below which steady spread stops;
  - the O₂ below which spread, or any burning, stops;
  - blow-off at high flow.
- A test that **ended** is not an extinction observation.
  - P5: "flame persisted for all" settings down to pot 0.28, then the flow was turned "to 0 to extinguish". The operator ended it.
  - P9: "flame out at 0.28".
- **Questions:**
  - Does P5's note show the fresh rod was **spreading** below 18.5 %, or only that a flame persisted?
  - Is P9's "flame out" a measured extinction criterion, or one observation on a reburned rod in a product-laden atmosphere?
  - Can any spread rate in S1 be combined with these notes to give a fresh-rod limit at 1.27 cm?
- *Then compare:* `research/endpoint_dictionary.md` §2 (M-01 to M-05; E-08 "test ended ≠ flame extinguished").

## B9. Secondary pair (optional, ≈ 5 min)
- **Claim:**
  - μg B4 (NASA P4): 0.95 cm, 18.5 %, flow velocity 2.00 gives V_f 3.25 (×10⁻³ cm/s, one segment).
  - 1 g: same diameter, O₂ and nominal flow velocity gives 3.33 ± 0.6 % (an average).
  - The difference, +0.08, may be shown. It does **not** identify an effect of gravity alone. Flow at the flame, ignition, flow history, O₂ drift and the starting atmosphere all differ.
- **Question:** agree?

## B10. Overall conclusion
> **Fresh 0.95-cm and 0.64-cm black PMMA rods.** Link et al.'s tables record microgravity spread from their first burns at starting O₂ of 17.5 % and 17.0 %. That is at least one point below the lowest O₂ with a printed 1 g spread rate.
>
> **1.27-cm rods.** The only microgravity record below the 1 g minimum is B9, the **second burn of rod 202m**. It started about 39 min after that rod's first burn, in a work-volume atmosphere that had not been renewed.
>
> **Fresh 1.27-cm rods.** The tables neither show nor exclude spread below 19.3 %.
>
> **Limits.** No limiting oxygen concentration is established, and no isolated effect of gravity, reburning or atmosphere carry-over is inferred.

- **Record:** supported / partly supported / not supported / can't tell, with your reasons.
- **Then list:**
  - anything we **over-read**;
  - anything we **missed**;
  - anything that should **not** be claimed.
- *Then compare:* `research/evidence_case_03.md` §5–§9.
