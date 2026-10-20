# Human review checklist (≈ 90 minutes)

**What this is:** a check, by a person, that the **recorded data and main conclusions** match the original PDFs.

**What this is not:** a test of IGNIS software. That is a separate user study (`future_evaluation_plan.md` §3d). No software exists yet.

**Who:** someone who did not produce the transcriptions. Everything here was produced and checked by an AI assistant, which is **not** independent verification.

**If you will also write held-out tasks:** do that first (`future_evaluation_plan.md` §3b), before opening any notes.

## Before you start
- [ ] Download the Link et al. 2018 Supplementary Information (via https://doi.org/10.1038/s41598-017-18398-4). Check its SHA-256 = `e17c9511c4b4b253cd0795b3984ffb9347ad5db6354c4ce792adcaf805f21b23`.
- [ ] Download NASA/TM-20210011385 from https://ntrs.nasa.gov/citations/20210011385. Check its SHA-256 = `5ffa911fd9b6356f204646003fb9342e341810dcdfdf5cb15756e7f01ec5f770`.
- [ ] Open the PDFs at ≥ 200 % zoom. Work from the PDFs. Our notes only say **where** to look.

Mark each item: ✔ agree / ✘ disagree (write what you see) / – not checked.

## 1. Table S1 merged cells (ESM p.1; `research/data/link2018_tableS1_microgravity.csv`)
- [ ] **Diameter spans.** 1.27 spans the first 12 left-half rows. 0.95 spans the next 14. 0.64 spans all 26 right-half rows.
- [ ] **Shared O₂ cells:**
  - one "18.4" covers **both** B15 and B14;
  - one "17.7" covers B1 and C3a;
  - one "17.4" covers B2 and C3b.
- [ ] **Labels.** Each label's rows match the CSV (`*_cell_start = 1` on the first row of each span only).
- [ ] **Header units.** The left half reads "V_f×10³ (cm/s)". The right half reads "(**mm/s**)".
- [ ] **Spot-check values.** Read every cell of B5, B9, B4, B12 and B10.

## 2. Table S2 merged cells (ESM p.2; `…tableS2_normal_gravity.csv`)
- [ ] **0.64-cm block.** 18.5 is printed **twice** (separate cells), and so is 18.0. Both 18.0 rows are at 2 cm/s (4.69 and 3.13).
- [ ] **0.95-cm block.** One 18.5 cell covers 25 and 2 cm/s ("-" and 3.33).
- [ ] **Dashes.** Every "-" pair is in the CSV, and none was turned into 0.
- [ ] **Lowest printed rate per diameter:** 18.5 (1.27); 18.5 (0.95); 18.0 (0.64).

## 3. NASA Table A.3 (TM PDF pp.114–115, printed pp.106–107; `…tableA3_rods.csv`)
- [ ] **Rows P4, P5, P6, P9, P10, P12, P13a, P13b, P16, P17, P19, P22a, P22b.** Check:
  - as-run number, date and time;
  - sample number and material text;
  - the word in the column headed "Sample distance";
  - calibrated and uncalibrated O₂, initial and final.
- [ ] **Gas columns (not in the CSV).** Check CO₂ and CO for P4, P5, P6, P9, P10 and P12 against `research/evidence_case_03.md` §3.

## 4. B5/P5 and B9/P9 identity
- [ ] Both P5 and P9 are 12.7-mm black rods, sample **202m**, on 7/14/14, at 13:18:00 and 13:57:00.
- [ ] Link's B5 O₂ 19.3 = P5's calibrated initial. B9's O₂ 17.6 = P9's calibrated initial.
- [ ] P9's initial calibrated O₂, uncalibrated O₂, CO₂ and CO **equal** P5's final values (17.6 / 16.7 / 1.67 / 525).
- [ ] TM p.14 (printed 6) contains the "sealed working volume" sentence.
- [ ] **Your view:** is B9 the second burn of the same rod, in the same atmosphere?

## 5. B16/P16 and B19/P19 classification
- [ ] A.3 prints "Concurrent" for P16 and P19, and "Opposed" for every other P row.
- [ ] Look at [L18] Fig. 4 (p.4), TM Fig. 1.2 (p.13: images c, f, g) and TM Tables 4.1 and 4.2 (pp.55–56). Form your own view **before** reading `research/b16_b19_discrepancy_review.md`.
- [ ] **Your view:** do you agree with "genuine unresolved conflict; evidence favours opposed"?

## 6. Units
- [ ] **Table S1:** 1 printed V_f unit = 10⁻³ cm/s = **10 µm/s** under the cm/s label. Check that `evidence_case_02.md` uses this only for left-half rows as absolute values.
- [ ] **TM:** diameters 6.35 / 9.525 / 12.7 mm correspond to Link's 0.64 / 0.95 / 1.27 cm.
- [ ] **O₂:** always vol %, never mixed with fractions.

## 7. Main conclusions
For each, mark agree / disagree / can't tell, and give a reason.
- [ ] **Evidence Case 03 §5:** μg spread below the 1 g minimum from fresh 0.95- and 0.64-cm rods; at 1.27 cm only via the reburned rod B9; fresh 1.27-cm rods undetermined.
- [ ] **P4 statement** (`p4_independent_recheck.md` §6): descriptive only, not a flow effect.
- [ ] **Matched μg/1 g pair** (Evidence Case 03 §10): may be contrasted; gravity's isolated effect not identified.
- [ ] **Anything we over-read, missed, or should not claim.**

## Hand back
Save `planning/reviewer_log_<initials>_<date>.md` containing:
- name or initials, date and time spent;
- the file hashes you checked;
- every ✘ with the CSV value, the PDF value and the page;
- what you didn't check.

"No discrepancies found" is a valid result. **Do not edit files in `research/data/`.**
