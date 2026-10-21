# Activity A: source transcription check (≈ 75 min)

**Order matters.**
- **A1 (blind):** read the PDFs and fill in the blanks below. Don't open any CSV or project note until A1 is written down.
- **A2:** compare with our transcriptions.

Sources, links and hashes: `README.md`. Zoom to ≥ 200 %. Copy values **exactly as printed**, including dashes, missing decimals and odd units. Write "?" for anything you can't read.

## A1. Blind reading

### A1.1 Table S1, microgravity ([ESM] p.1)
1. The table is printed in two halves. **Unit label above the spread-rate (V_f) column:**
   - left half: ________
   - right half: ________
2. Labels of the other columns, as printed (diameter, O₂, sample, flow velocity, time): ________
3. **Per sample label:** fill in one line for every label in the table.

| Half | Sample label | Diameter printed | O₂ printed | Rows it spans | Is its O₂ (or diameter) cell shared with another label? Which? |
|---|---|---|---|---|---|
| | | | | | |
| | | | | | |
| | | | | | |
| *(add lines)* | | | | | |

4. **Every cell** for labels **B5, B9, B4, B12, B10**, one line per row:

| Label | Row | Flow velocity | Time | V_f |
|---|---|---|---|---|
| | | | | |
| *(add lines)* | | | | |

5. Does Table S1, its caption, or the article ([L18]) say that any rod was burned more than once? Yes / no / unclear. Location: ________

### A1.2 Table S2, normal gravity ([ESM] p.2)
1. What does the caption say each rate is (e.g. a single test or an average)? ________
2. **Per diameter:** the lowest O₂ that has a printed rate.

| Diameter | Lowest O₂ with a printed rate | Its flow velocity | Rate | ± |
|---|---|---|---|---|
| 1.27 | | | | |
| 0.95 | | | | |
| 0.64 | | | | |

3. **Every row whose rate is printed as "-"**:

| Diameter | O₂ | Flow velocity |
|---|---|---|
| | | |
| *(add lines)* | | |

4. Is "-" defined in the caption, the supplement or the article? Location, or "not defined": ________
5. Any O₂ cell that spans more than one row (diameter, O₂, which rows): ________
6. The row for 0.95 cm, O₂ 18.5, flow velocity 2: rate ________ ± ________

### A1.3 NASA Table A.3, "Fernandez-Pello Test Matrix" ([TM] pp.114–115 / 106–107)
1. **Column headings**, exactly as printed:
   - the time column: ________
   - the eight O₂, CO₂ and CO columns: ________
   - the footnote attached to the date column: ________
2. **Every rod row**, sorted by **as-run test number** (smallest first). Rod rows have "rod" in the material column.
   - "Config word" = the flow-configuration word printed in the row, if any. Note which column heading it appears under.
   - Leave a cell blank rather than guess.

| As-run | Test no. | Date | Time | Sample no. | Material | Config word (column) | Cal. O₂ initial | Cal. O₂ final | O₂ initial | O₂ final | CO₂ initial | CO₂ final | CO initial | CO final |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | | | | | |
| *(27 rod rows expected; add lines; say if you count a different number)* | | | | | | | | | | | | | | |

3. **Sample numbers that appear in more than one row:** ________
4. For each row with such a sample number, copy the words in the observations column about:
   - flow (fan/pot) settings;
   - whether the flame persisted or went out;
   - the shape of the sample afterwards.

   ________

### A1.4 [TM] p.14 / 6
Copy the sentence(s) about sensor readings, the working volume, purging and how long dilution took: ________

**Stop. Note the time. Only now open the transcriptions.**

## A2. Compare with our transcriptions (`research/data/`)
| File | Source | Rows |
|---|---|---|
| `link2018_tableS1_microgravity.csv` | Table S1 | 52 |
| `link2018_tableS2_normal_gravity.csv` | Table S2 | 46 |
| `bass2_TM20210011385_tableA3_rods.csv` | Table A.3 rod rows | 27 |
| `crosswalk_link2018_S1_to_bass2_A3.csv` | our proposed link from each S1 label to a NASA test | 19 |
| `bass2_TM20210011385_table2_1.csv` | [TM] Table 2.1 (PDF p.36 / 28); optional | 2 |

**How the files are written:**
- Values are kept **as printed**: "17" stays "17"; dashes stay "-"; nothing is corrected or filled in.
- A merged (spanning) cell is repeated on every row it covers. `*_cell_start = 1` marks the first row of the span, 0 the rest.
- The A.3 file holds the O₂ columns but **not** the CO₂ and CO columns. Those are checked in Activity B.

**Steps:**
1. **Your A1 answers against the files.** List every difference on the form, with: file, row ID, column, our value, your value, PDF page.
2. **Full pass, quicker.** Go through every remaining row of the S1, S2 and A.3 files against the PDF, including the `*_cell_start` flags.
   - If you stop early, record where you stopped.
3. **Crosswalk.** For each of the 19 labels, decide from your A1 tables whether the proposed NASA test is plausible. Use diameter, colour, initial O₂, flow sequence and number of segments. Never the label alone, because some labels mean different things in the two documents. Mark any link you disagree with.

"No discrepancies found" is a valid result. Don't edit any file in `research/data/`.
