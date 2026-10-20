# research/data: transcribed source tables

Pre-event **research transcriptions** (made 2026-10-20). They are not submission assets. Whether any of this may
be reused during the hackathon is an open rules question (see `planning/competition_rules.md`).

Every file copies values **exactly as printed**: same digits, same dashes, and the unit labels as printed, even
where they conflict. Nothing has been normalised, corrected, or gap-filled. Interpretation lives in
`research/evidence_case_02.md` and `research/source_conflicts.md`, not here.

| File | Source | Location | Rows | How checked |
|---|---|---|---|---|
| `link2018_tableS1_microgravity.csv` | Link et al. 2018, Sci. Rep. 8:120, Supplementary Information (Springer ESM PDF, SHA-256 `e17c9511…1b23`) | ESM p.1, Table S1 | 52 | text-layer multiset + row-order checks; merged-cell spans checked visually (150-dpi render) |
| `link2018_tableS2_normal_gravity.csv` | same ESM PDF | ESM p.2, Table S2 | 46 | as above |
| `bass2_TM20210011385_table2_1.csv` | NASA/TM-20210011385 (NTRS PDF, SHA-256 `5ffa911f…f770`) | PDF p.36 = printed p.28, Table 2.1 | 2 | all cells found in the page text layer; table image inspected visually (160 dpi) |
| `bass2_TM20210011385_tableA3_rods.csv` | same NTRS PDF | PDF pp.114–115 = printed pp.106–107, Table A.3 (Fernandez-Pello test matrix) | 27 tests | key cells found in the page text layer; rows P16, P19, P22a, P22b, header visually inspected; **selected columns only** (camera/radiometer/CO₂/CO columns omitted) |
| `crosswalk_link2018_S1_to_bass2_A3.csv` | **derived** by `research/analysis/crosswalk.py` | — | 19 labels | regenerated from the two CSVs above; contains hypotheses and flags, not facts |

## Column conventions

- `*_printed` columns contain the literal printed text. `-` is printed as a dash in Table S2. The caption does not
  define what it means, so it must **not** be read as zero, extinction, or "no spread" without a source statement.
- `*_cell_start = 1` marks the row where a merged (spanning) cell is printed. On rows with 0, the value is carried
  down from the merged cell and is not a separate printed token.
- `vf_x1e3_unit_label_printed` reproduces each table half's header. Table S1 prints **cm/s on the left half and
  mm/s on the right half** (conflict C-02).
- In Table A.3, the column holding `Opposed` / `Concurrent` / `Stagnation` is **headed "Sample distance"** in the
  source. We store it as `config_printed_in_col_headed_sample_distance`. Reading it as flow configuration is an
  inference: every Table A.3 row holds Opposed or Concurrent there, and the few Table A.1 and A.5 rows inspected
  hold Opposed or Stagnation.

## Verification run (actual output, 2026-10-20)

```
py -3 -I research/analysis/verify_transcriptions.py _raw/link2018/41598_2017_18398_MOESM1_ESM.pdf _raw/ntrs_20210011385/TM-20210011385.pdf
[PASS] Link 2018 Table S1 (52 rows): 194 transcribed cells vs 194 text-layer tokens
[PASS] Link 2018 Table S1: row-order sequence of 156 value cells
[PASS] Link 2018 Table S2 (46 rows): 172 transcribed cells vs 172 text-layer tokens
[PASS] Link 2018 Table S2: row-order sequence of 138 value cells
[PASS] NASA TM Table 2.1: 8 cells present on PDF p.36
[PASS] NASA TM Table A.3: key cells of 27 tests present on stated pages
6/6 checks passed
```

**Negative control** (also run): changing S1-L20 V_f from 3.25 to 3.52 in memory, and dropping one separately
printed `18.5` cell from S2, made both checks FAIL with the exact offending tokens reported. So the check is not
vacuous.

**Limits of the check.** The PDF text layer is the publisher's own characters, not OCR, so digit-level agreement
is strong evidence. The check cannot detect a value that is wrong in the source itself, and it cannot verify the
row span of a merged label. Those spans were checked visually only, by the same assistant that did the
transcription. No independent human has reviewed these files yet. **Before the files are relied on, a person
should re-check the merged-cell spans against the PDF page images.**
