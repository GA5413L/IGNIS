# Instructions for an independent reviewer (teammate)

**Why this exists.**
- Every transcription, crosswalk decision and evaluation key in this repository was produced by one AI assistant.
- Nothing has been checked by a person. Until someone does, the project may say only "assistant-checked", never "independently verified" (blocker B-07).
- **Who should do it:** someone who has **not** worked on the IGNIS rules or the v1 evaluation keys.
- **Time:** about 2–3 hours in total. Parts A–C can be done in separate sittings.

**Ground rules**
- Never edit files in `research/data/`. Record everything in your own review log (Part E).
- Work from the **original PDFs**, not from our notes. Our notes tell you *where* to look, never *what* is true.
- If you can't check something, write "not checked". Partial honest coverage is more useful than a full tick-list.
- Don't share Part D tasks with anyone working on the rules or the app, or with the AI assistant.

## Part A: supplement tables (≈ 45 min)
1. Download the Supplementary Information of Link et al. 2018 (*Sci. Rep.* 8:120), using the "Supplementary information" link on https://doi.org/10.1038/s41598-017-18398-4.
2. Check its SHA-256 equals `e17c9511c4b4b253cd0795b3984ffb9347ad5db6354c4ce792adcaf805f21b23`. (PowerShell: `Get-FileHash <file>`.)
3. Open `research/data/link2018_tableS1_microgravity.csv` next to the PDF page 1, zoomed to ≥ 200 %. For **each of the 52 rows**, tick or flag these columns:
   - `d_printed`, `xo2_pct_printed`, `sample_label_printed`, `vg_printed`, `dt_printed`, `vf_x1e3_printed`.
   - For merged (spanning) cells, check that `*_cell_start = 1` is on the first row of each span and 0 on the rest.
4. Check that both header unit labels read as in the CSV: left half "(cm/s)", right half "(mm/s)".
5. Repeat for `link2018_tableS2_normal_gravity.csv` (46 rows; PDF page 2), including every "-" and the `pm_pct_printed` column.

## Part B: NASA as-run log (≈ 30 min)
1. Download NASA/TM-20210011385 from https://ntrs.nasa.gov/citations/20210011385. Check SHA-256 `5ffa911fd9b6356f204646003fb9342e341810dcdfdf5cb15756e7f01ec5f770`.
2. Go to PDF pages 114–115 (printed pp.106–107), Table A.3. For rows **P4, P5, P9, P13a, P13b, P16, P17, P19, P22a, P22b**, check against `research/data/bass2_TM20210011385_tableA3_rods.csv`:
   - date and as-run number;
   - sample number;
   - material text;
   - the word in the column headed "Sample distance";
   - fan and air displays;
   - calibrated initial and final O₂.
3. Also look at PDF pp.118–119 (Table A.5) and note what is recorded for as-run numbers 89–96.

## Part C: crosswalk and the B16/B19 question (≈ 45 min)
1. For each of the 19 labels in `research/data/crosswalk_link2018_S1_to_bass2_A3.csv`, decide whether the proposed NASA test is right, using diameter, colour, initial O₂ and the flow sequence. **Do not rely on the label alone.** Mark any you disagree with.
2. Read `research/b16_b19_discrepancy_review.md` **after** forming your own view from the PDFs:
   - [L18] p.4 (Fig. 4) and p.5 (Fig. 6);
   - [TM] p.13 (Fig. 1.2), pp.55–57 (Tables 4.1, 4.2 and Fig. 4.1), and p.114.
   - Then record: (a) do you agree with "GENUINE UNRESOLVED CONFLICT, evidence favours opposed"? (b) Did we miss anything, or over-read the images?
3. Optional: check B22 against P22a/P22b, and P17's colour.

## Part D: held-out evaluation tasks (≈ 45 min)
Write **at least 4** questions that a fire-safety researcher might really ask of these sources, with your own answer keys. Requirements:
- **Mix:**
  - ≥ 1 with a clear numeric answer;
  - ≥ 1 where the sources conflict;
  - ≥ 1 that should be declined or answered "not supported";
  - ≥ 1 ordinary lookup or filter task where a spreadsheet should do well.
- **Each key lists:** the expected answer as substantive points (not method words like "QUARANTINED"); every source location (document, page, table, row); and what an overclaim would look like.
- **Don't read** `planning/evaluation_plan.md` keys or `research/analysis/*.py` first, so you aren't anchored to our rules.
- **Save** the tasks in a file **outside this repository**. Compute its SHA-256 and give only the hash to the team, to be recorded in `DECISIONS.md` with your initials and the date. Keep the file sealed until the final evaluation run.

## Part E: your review log (what to hand back)
Create `planning/reviewer_log_<initials>_<date>.md` containing:
- **Who and when:** name or initials, role, date, time spent.
- **Sources:** which files you checked and their hashes.
- **Part A/B results:** rows checked; each discrepancy with the CSV value, the PDF value and the location. "None found" is a valid result.
- **Part C:** your crosswalk disagreements and your view on C-03.
- **Part D:** the SHA-256 of your sealed task file (not the tasks).
- **Limits:** anything you didn't check.

## If no independent reviewer is available
Say so in `BLOCKERS.md` (B-07 stays open). In that case:
- The submission must describe the data as "transcribed and checked by an AI assistant against the publisher PDF; not independently reviewed".
- The evaluation must be called an internal consistency check.
