# Researcher workflow (one page): "lowest oxygen with recorded flame spread, by rod diameter"

**Status:** a description of a user task, written 21 Oct 2026 for planning. **Nothing is built** (D-001).
- The answers quoted come from `research/evidence_case_03.md` and are assistant-checked only (B-07).
- The full challenge statement (28 Oct) may change what the product must do. This page describes the scientific task, not the interface.

**User:** a fire-safety or combustion researcher (or a reviewer of one) assembling published microgravity evidence.
**Task:** *"For black PMMA rods, at which diameters is flame spread recorded at lower O₂ in ISS low-flow
microgravity than on Earth, and which records carry that answer?"*

## What the tool has to answer, in order
| # | Researcher's question | Answer for this task | Where it comes from |
|---|---|---|---|
| 1 | Which records support the request? | 19 μg sample labels (20 NASA burns; Table S1) and 46 1 g rows (Table S2), filtered to black PMMA. Conflicted burns are listed, not used | S1, S2; admission rules (Evidence Case 02 §3) |
| 2 | Are they the same measurand? | The rates are all M-01 (spread rate). The question, though, is about M-03 (limiting O₂). Rates only **bound** it, and a minimum over records is a derived statistic, not a measurement | `endpoint_dictionary.md` §2 |
| 3 | What experiment and specimen produced each result? | NASA burn, as-run number, date and time, specimen number | crosswalk; A.3 |
| 4 | Was the specimen burned before? Did the burn start in another burn's atmosphere? | B9 = second burn of 202m, started in P5's unrenewed atmosphere. B13b = second burn of 203m, in a renewed atmosphere | A.3 sample numbers; gas readings (C-26) |
| 5 | Do the protocols support the comparison? | Display and descriptive contrast: yes. Pooling, causal attribution, model training: no | `endpoint_dictionary.md` §4 |
| 6 | Which conclusions remain observational? | the bounded statement in Evidence Case 03 §5 | — |
| 7 | Which inferences would be unsupported? | any LOC value; "gravity alone"; "reburning increases spread"; "fresh 1.27-cm rods cannot spread at 17.6 %" | Evidence Case 03 §9 |
| 8 | What can be exported? | the record table (row IDs and PDF pages), the derived minima, the flags, the bounded statement and the "not supported" list, with source hashes | — |

## Primary demonstration (positive): burn history changes the answer
1. **Real finding.** Link et al. (p.6): flames in microgravity "can spread at lower oxygen concentrations than in normal gravity".
2. **First reading.** Filter the published tables for the lowest μg O₂ with a rate, per diameter. All three diameters sit below the 1 g minimum (17.0 vs 18.0; 17.5 vs 18.5; 17.6 vs 18.5).
3. **Reveal the history.**
   - The 1.27-cm record (B9) is NASA burn P9, the second ignition of rod 202m.
   - It started 39 min after that rod's first burn, in the same unrenewed atmosphere: O₂ 17.6 %, CO₂ 1.67 %, CO 525 ppm, all equal to P5's final readings.
4. **Corrected qualification.**
   - **0.95 and 0.64 cm:** supported by fresh rods, at every tabulated segment.
   - **1.27 cm:** supported only by the reburned rod.
   - **Fresh 1.27-cm rods:** undetermined. NASA's log shows the fresh rod's flame persisting as O₂ fell to 17.6 %, but no rate was tabulated.
5. **Why it matters.** A curve, fit or LOC estimate that treats B9 as a fresh-rod point mixes two histories. The researcher now knows which part of the published conclusion rests on fresh specimens.
6. **Export** the traceable result (#8).

## Secondary demonstration (negative): matched nominal conditions, different gravity
B4/P4 3.25 vs S2-R09 3.33 (×10⁻³ cm/s; 0.95 cm, 18.5 %, 2 cm/s nominal):
- Shown side by side, with the contrast +0.8 µm/s.
- **"These observations may be displayed and arithmetically contrasted, with their distinct protocols shown, but they cannot identify gravity's isolated causal effect."**
- The reasons are listed: statistic, ignition, flow history, effective buoyant flow, O₂ drift, and starting atmosphere.

## Where other material appears
- **B16/B19:** only as a listed record with an open documentary conflict. Not needed for this answer (B10 is lower).
- **P4 within-burn case:** a plain descriptive example.

## Deliberately absent
Risk scores, safe/unsafe labels, predictions, confidence percentages, a single LOC, and any claim that a source is wrong.

## What a spreadsheet already does here
- A curated spreadsheet with the crosswalk and flags (M1) can reach every answer above.
- What software might add, fewer missed flags in derived answers, is a **hypothesis**, not a result (`value_hypothesis.md`).
