# Adversarial source audit (20 October 2026, second session)

**Mandate:** try to disprove the findings of the first 20 Oct session, and record what survives. This is pre-event
source review only: no application code and no submission assets. Each claim below was re-tested against the
publisher and NASA PDFs, not against the repository's own notes.

**Who did it:** an AI assistant (Claude, via Claude Code). **No person has independently reviewed anything in this
file** (blocker B-07). Mechanical re-runs of the earlier scripts only show the results are reproducible.

Companion files:
- `b16_b19_discrepancy_review.md`: the C-03 audit, in full.
- `p4_independent_recheck.md`: the positive case.
- `prior_art_comparison.md`: competitors and prior art.

---

## 0. Exactly what was inspected, and at what access level
| Source | Access level | Parts inspected this session | Method |
|---|---|---|---|
| [L18] Link et al. 2018, *Sci. Rep.* 8:120 (publisher PDF, 9 pp.) | **full text** | pp.1–9 text; Fig. 4 rendered at 300 dpi; correspondence block | text layer + visual |
| [L18-ESM] Supplementary Information (SHA-256 `e17c9511…1b23`, re-hashed today) | **full** (4 pp.) | Table S1 rendered at 220 dpi (both halves, every cell); Table S2 at 200 dpi (every cell); Fig. S1; Fig. S2 legend | visual, cell by cell, against the CSVs |
| [TM] NASA/TM-20210011385 (SHA-256 `5ffa911f…f770`, re-hashed today) | **full PDF** | text of PDF pp.12–17, 55–62, 72–82, 109–121; renders of p.13 (Fig. 1.2, 300 dpi), p.57 (Fig. 4.1, 150 dpi), p.114 (A.3 header, P16, P19 rows, 220 dpi) | text layer + visual |
| NASA PSI-25 (BASS-II) | **no direct access** (403 on 20 Oct; not re-attempted; no account registered, D-013) | a **third-party copy** of the PSI-25 test table (`BASS-II.csv`, 129 rows) from the public GitHub repo `AnteurAbderraouf/Fotia`, SHA-256 `71e792bf…c042` | read only. **Not verified against PSI** |
| Rivera et al. 2026; Liveretou et al. 2024 | **not accessed** (paywall / no file) | — | — |
| Competitor repositories (MicroFire Atlas, Fotia, FLARENEXUS) | **public GitHub**: README, file tree, selected data files | see `prior_art_comparison.md` | read only; **no third-party code was run** |
| Space Apps official pages | public | FAQ, Team Formation Guide, T&C, home and challenge page re-fetched 16:53–16:56 UTC (text unchanged from the morning); **Awards page** fetched for the first time | `tools/fetch.ps1`; `tools/spaceapps_page.py` |

Renders are in `_raw/audit_2026-10-20b/` and the competitor copies in `_raw/competitors/` (both local and gitignored).

---

## 1. Scientific approval decisions (brief §11)
These labels grade the **quality of the evidence for the stated use**. They say nothing about the safety of any material or spacecraft.

| Question | Grade | Basis (detail in the sections below) |
|---|---|---|
| Can we trust the **B4/P4 positive case**? | **PASS** for the values and for the qualified descriptive statement. **FAIL** for any flow-effect or causal reading | §2 F-6; `p4_independent_recheck.md` |
| Can we trust the **B16↔P16 and B19↔P19 crosswalk**? | **PASS** (multi-attribute inference: diameter, colour, exact initial O₂ unique among the 27 burns, the unique 8-cm/s step, the burn ending). Not author-confirmed | `b16_b19_discrepancy_review.md` §3 |
| Does the **flow-configuration discrepancy** survive alternative explanations? | **CONDITIONAL.** It survives as a *documentary* conflict: Table A.3 does print "Concurrent". It does **not** survive as evidence that the burns *were* concurrent: NASA's own Ch. 4, the article and the photographs favour opposed. Classification: **GENUINE UNRESOLVED CONFLICT**; the quarantine is kept | ibid. §6–7 |
| Are the **supplementary tables transcribed correctly**? | **PASS (assistant-checked).** All 52 + 46 rows and every merged span match the PDF at 200–220 dpi, and the text-layer check passes 6/6. **Independent human verification: not done (UNKNOWN)** | §3 |
| Can we **distinguish independent burns from repeated observations**? | **PASS** for the 20 NASA burns behind Table S1. Specimen numbers and burn order come from Table A.3, and the PSI-25 copy agrees. **CONDITIONAL** for B22 (two burns under one label, likely but inferred) | §4 (B5/B9, C-15) |
| Is the **evidence-provenance workflow genuinely useful**? | **UNKNOWN (untested).** There is one concrete case where specimen identity changes a fire-safety-relevant conclusion (§5, F-9). But a curated spreadsheet carrying the same crosswalk flags reaches the same answer. No user test has been run | §5; `planning/evaluation_audit.md` |
| Is any **algorithmic SOTA claim** justified? | **FAIL.** No algorithm, no benchmark, no comparator | `prior_art_comparison.md` |
| What must IGNIS **definitely not claim**? | See §6 | — |

---

## 2. Previous findings: what survived and what failed
| # | Previous finding (first 20 Oct session) | Verdict | Why |
|---|---|---|---|
| P-1 | Tables S1/S2 are recoverable; 52 and 46 rows | **PASS** | re-read in full |
| P-2 | Transcriptions are exact, as printed | **PASS** (assistant) | §3. Human review is still pending |
| P-3 | All 19 labels map to NASA tests; diameters agree 19/19; O₂ exact in 17/19 | **PASS** | 17/19 exact if B22 is compared with P22a (20.8); B15 does not match (18.4 vs 18.0) |
| P-4 | Some specimens were burned more than once (197m, 200m, 202m, 203m, 215M, 196M; 217m earlier in Olson O12) | **PASS** | Table A.3 sample numbers; the PSI-25 copy agrees for every pair |
| P-5 | B16/B19 disagree with NASA's recorded configuration | **CONDITIONAL** | true for **Table A.3 only**. NASA's Ch. 4 Tables 4.1/4.2 and Fig. 4.1 include those burns among opposed-flow results (inferred) |
| P-6 | "Most consequential distinction … the literature's headline result depends on the two records whose flow configuration is in dispute" | **FAIL as framed** | omitted the contrary NASA evidence and overstated what a single log cell shows. Reworded in `evidence_case_02.md` N3 |
| P-7 | C-02: Table S1 right half printed "(mm/s)"; cm/s favoured internally; rows CONDITIONAL | **PASS, strengthened** | NASA's TM Fig. 4.1 (a second document) plots the right-half values at the cm/s magnitude (F-2). The label is unchanged in the data |
| P-8 | C-14: "B16" is a rod in Link and a film in NASA A.1 | **PASS, extended** | **"B19" collides as well** (A.1 B19 = sample 151m, 100-µm film). A public competitor tool uses the film B16/B19/B20 (F-5) |
| P-9 | C-15: B22 may merge P22a and P22b | **CONDITIONAL, strengthened** | same-day V_g pattern and TM Table 4.1 burn count (F-7). Still inferred |
| P-10 | C-04: B15 O₂ 18.4 (Link) vs 18.0 (NASA) | **PASS** (conflict real) | new hypothesis: a merged-cell artefact (F-11) |
| P-11 | P17: colour "not stated in either source", so INDETERMINATE | **CONDITIONAL** | still true of [L18] and [TM]. The PSI-25 table copy says `1/4"  black rod` (F-8). Verify against PSI before changing the decision |
| P-12 | B4/P4 values and arithmetic | **PASS** | see the P4 recheck. Qualified: V_g is nominal per setting; "B" is the last tabulated segment, not the end of the burn |
| P-13 | N1: μg vs 1 g at matched nominal conditions is INDETERMINATE | **PASS** | reasoning re-checked |
| P-14 | C-18: NASA Table 4.1 counts don't reconcile with S1 | **CONDITIONAL, partly reconciled** | F-10 |
| P-15 | PSI-25 inaccessible | **CONDITIONAL** | still inaccessible to us. The test table is publicly redistributed by a third party, which says PSI data are "public and re-downloadable"; raw video availability is unknown |
| P-16 | "No algorithmic advantage; value is curation" | **PASS** | unchanged |
| P-17 | Novelty hypothesis: the journal ↔ NASA crosswalk is unpublished | **CONDITIONAL** | none of the three competitors inspected has it; no exhaustive search was done |

---

## 3. Transcription audit (Tables S1, S2, A.3)
- **Table S1:** all 52 rows read from 220-dpi renders, every cell (d, X_O₂, label, V_g, Δt, V_f). **All match the CSV.**
  - Merged spans match `*_cell_start`: 1.27 over rows L01–L12; 0.95 over L13–L26; 0.64 over all R rows.
  - O₂ spans: 20.7×4, 20.6×2, 19.3×2, 17.6×4, 20.9×3, 20.8×4, 18.5×3, 17.5×4, 18.9×3, 18.4×2 (B15 and B14), 18.2×4, 17.7×4 (B1 and C3a), 17.5×4, 17.4×3 (B2 and C3b), 17.0×3, 16.8×3.
  - Headers confirmed: left "V_f×10³ (cm/s)", right "V_f×10³ (mm/s)".
- **Table S2:** all 46 rows at 200 dpi, including every "-" pair and the split versus merged O₂ cells (0.64-cm block: separate 18.5, 18.5, 18.0, 18.0; 0.95-cm block: merged 18.5 over 25 and 2). **All match.**
- **Table A.3:** the header and the P16, P19 and P4 rows were re-read at 220 dpi or from the text layer, and **all match the CSV**. The remaining rows were checked against the text layer only.
- **Mechanical re-run:** `verify_transcriptions.py` gives 6/6 PASS, and the input hashes match the manifest.
- **What this does not establish:** independent human verification (B-07), or the correctness of the sources themselves.

---

## 4. Discrepancies, one by one
Format: **Sources say** / **Location** / **Confirmed** / **Inferred** / **Unknown** / **Effect**.

### C-03: B16/B19 configuration
Summary only; the full audit is in `b16_b19_discrepancy_review.md`.
- **Sources say:**
  - Link: opposed.
  - TM Table A.3: "Concurrent".
  - TM Ch. 4: opposed-flow tables and figure that include the 7.5-cm/s 6.35-mm points.
- **Classification:** GENUINE UNRESOLVED CONFLICT. The evidence favours opposed, and the quarantine is kept.

### C-02 / F-2: unit label of the Table S1 right half
- **Sources say:**
  - [L18-ESM] right-half header "(mm/s)".
  - [L18] Figs 5 and 6a use a cm/s axis at the same magnitudes.
  - ESM Fig. S1 slopes are consistent with cm/s.
  - **New:** [TM] Fig. 4.1, 0.635-cm panel, puts these points on a "Flame spread rate, cm/s" axis at about 0.002–0.010. That matches the cm/s reading (e.g. B6 10.00 → ≈0.010; B16 6.78 at 7.55 cm/s → ≈0.0068). Under the mm/s label they would sit about ten times lower.
- **Location:** [L18-ESM] p.1; [L18] p.5; [TM] p.57/49.
- **Confirmed:** the label as printed; the figure magnitudes (visual, not digitised).
- **Inferred:** the "(mm/s)" header is a typo for "(cm/s)".
- **Unknown:** any author or publisher statement.
- **Effect:**
  - Absolute right-half values are well supported under the cm/s reading.
  - Proposal (D-019): a **separate, reviewed normalised record** with `vf_x1e3_unit_reviewed = cm/s`, its evidence list and a reviewer name. It stays in a new file after a person reviews it.
  - The as-printed CSV is never edited. Until that review, D-007 (CONDITIONAL) stands.

### C-04 / F-11: B15 oxygen
- **Sources say:** [L18-ESM] one merged "18.4" cell spans the B15 and B14 rows. [TM] gives P14 18.4 → 18.0 and P15 **18.0** → 17.5. The PSI copy gives P15 18 and P14 18.4.
- **Location:** [L18-ESM] p.1; [TM] p.114/106.
- **Confirmed:** the two values.
- **Inferred (new hypothesis):** the merge is a typesetting simplification that gave B15 its neighbour's O₂.
- **Unknown:** which value Link used in the regression or figures. (The [TM] Fig. 4.1(b) 0.635-cm panel has a point near 18.0. Not digitised, not relied on.)
- **Effect:** B15 stays QUARANTINED. Its single row was never used.

### C-14 / F-5: label collisions
- **Sources say:**
  - [TM] Table A.1 (Bhattacharjee films): **B16** = as-run 51, 7/2/14, sample 150m, "2-cm 100-µm-thick PMMA", Opposed. **B19** = as-run 52, sample 151m, 100-µm film. **B20** = 152m film.
  - [L18] B16 and B19 are 6.35-mm rods.
- **Location:** [TM] p.111/103.
- **Confirmed:** both collisions.
- **Additional observation:** the public competitor MicroFire Atlas uses NASA's film B16/B19/B20 in its Compare Lab and children's game (README; `apps/web/data/experiments.json`). That is a correct use of NASA's labels. A user moving between that tool and Link-based data would meet the same label for two different experiments.
- **Effect:** the no-label-join rule (D-008) is confirmed by a real-world case. Never display a bare "B16".

### C-15 / F-7: B22 identity
- **Sources say:**
  - [L18-ESM] B22: one label, 20.8 %, V_g 1.58, 1.58, 1.52, 1.48.
  - [TM] P22a: 20.8, pots "5, 0.36, 0.32", extinguished "at higher flow".
  - [TM] P22b: 20.0, pots "5, 0.36, 0.34, 0.33, 0.32, 0.31".
  - [TM] P25 (same day, 7/8): pots "5, 0.36, 0.34, 0.33, 0.32, 0.31". C25: 1.58, 1.52, 1.48.
- **Location:** [L18-ESM] p.1; [TM] p.115/107.
- **Confirmed:** the values; that the three burns ran the same day; and that C25 (P25) and B22 share the V_g ladder 1.58 → 1.52 → 1.48.
- **Inferred:**
  1. On 7/8, pot 0.36 corresponds to 1.58 cm/s. That would explain B22's duplicated 1.58: one segment from P22a and one from P22b, followed by P22b's 0.34 and 0.33 settings at 1.52 and 1.48.
  2. TM Table 4.1 lists **4 black 9.525-mm burns**. S1 reaches 4 only if B22 counts as two burns (B22 ×2, B4, B12).
- **Unknown:** the author's intent.
- **Effect:** B22 stays INDETERMINATE. The merge hypothesis is stronger, which reinforces "never average the two 1.58 rows" (they would come from different burns of one specimen).

### B5/B9 (and other reburns)
- **Sources say:** [TM] P5 7/14/14 13:18, P9 7/14/14 13:57, both sample **202m** (39 min apart). The PSI copy gives 202m for both on 7/14/2014.
- **Location:** [TM] p.115/107; PSI copy.
- **Confirmed** by two NASA-derived records.
- **Inferred:** nothing.
- **Unknown:** the rod's state between burns (NASA's P9 note: "flame did not leave conical portion behind … final sample shape was very irregular").
- **Effect:** B9 is a thermally and geometrically pre-conditioned specimen. It is not a replicate of B5 and not a fresh rod (see F-9).

### P17 / F-8: colour
- **Sources say:** [TM] A.3 "6.35-mm rod" (no colour); [L18-ESM] label "P17" with an undefined prefix; **PSI-25 copy `1/4"  black rod`**.
- **Location:** [TM] p.114/106; PSI copy row "Fernandez-Pello, P17".
- **Confirmed:** what each document prints.
- **Inferred:** P17 was probably black. Consistent with TM Table 4.1's 23 black 6.35-mm conditions.
- **Unknown:** whether the PSI copy is faithful to PSI.
- **Effect:** P17 stays INDETERMINATE until PSI is checked directly (user action, B-03). Task T07's key may need revision (`planning/evaluation_audit.md`).

### F-6: what V_g in Table S1 is
- **Sources say:** [L18] "The fan voltage was calibrated with the hot wire reading at the end of every ops day"; [TM] "response time of approximately 1 minute".
- **Pattern in Table S1:** burns on the same day carry **identical V_g sequences**:
  - 3 Jul: B4, B6, B10 at 2.00 / 1.87 / 1.73.
  - 14 Jul: B13a, B13b, B5, B9 at 1.64 / 1.54 / 1.43 / 1.38.
  - 8 Jul: B22, C25 at 1.58 / 1.52 / 1.48.
  - 22 Jul: B16, B19 at 7.55 / 1.67 / 0.83 / 0.72.
- **Location:** [L18] p.3; [TM] p.12/4; Table S1; Table A.3 dates.
- **Confirmed:** the repetition.
- **Inferred:** V_g values are nominal per-setting calibration values, not per-segment measurements. The same pot maps to different V_g on different days (pot 0.4 → 2.00 on 7/3, 1.64 on 7/14, 0.83 on 7/22, assuming the order is as inferred).
- **Unknown:** the calibration curves.
- **Effect:** within-burn ΔV_g is a nominal difference. Comparisons of V_g **across days** carry an extra, unquantified calibration term.

### F-10 / C-18: NASA Table 4.1 counts vs Table S1
Reading "samples burnt" as burns, counting P17 as black and B22 as two burns:

| Group | NASA burns / conditions | Table S1 burns / rows | Result |
|---|---|---|---|
| black 6.35 mm | 9 / 23 | 9 / 23 | match |
| black 12.7 mm | 4 / 12 | 4 / 12 | match |
| clear 9.525 mm | 1 / 3 | 1 / 3 | match |
| black 9.525 mm | 4 / 12 | 4 / **11** | one condition short |
| clear 6.35 mm | 2 / 4 | 2 / **3** | one condition short |

This supports both the P17-is-black and the B22-is-two-burns readings. It is **inferred** and depends on what "samples burnt" means.

### C-16 / F-13: P22a/P22b oxygen anomalies
- The PSI copy carries the same anomalous values (P22a final 0.6; P22b final 39.1).
- So the anomalies sit in the underlying test log, not in the TM typesetting. A third party (Fotia README) independently flagged "final O₂ reaches 40.4%".
- **Effect:** these O₂ cells are still unusable.

### C-25 (new, minor): TM Fig. 4.1 axis label
- The panels label the x-axis "Flame velocity, cm/s", while the caption says "opposed-flow velocity" ([TM] p.57/49).
- **Effect:** none on the data. It is a labelling hazard if anyone ever digitises the figure (which we don't).

---

## 5. A fire-safety-relevant descriptive result that survives source reconciliation (F-9)
> **Refined 21 Oct (third session): see `evidence_case_03.md`.** The values below are unchanged. The re-read adds:
> - P9 began in P5's unrenewed atmosphere (O₂ 17.6 %, CO₂ 1.67 %, CO 525 ppm all carried over, C-26).
> - The fresh rod's flame in P5 persisted while O₂ fell to 17.6 %, untabulated. So "fresh 1.27-cm rods were not tabulated below 19.3 %" stays true, but the fresh-rod answer is **undetermined**, not "no".
> - The μg-vs-1 g ordering also relies on the authors' 1 g non-spread statements, because the "-" entries are undefined.

**Question.** At matched rod diameter, is flame spread recorded at lower O₂ in the ISS low-flow tests than in the
1 g tests? This is the practical point both sources make: [L18] p.6, "LOC is lower (or the fire risk is higher) in
microgravity"; [TM] p.58/50, "as low as 17.5 percent" vs "not observed below 19 percent".

From the transcriptions (a plain filter, which any spreadsheet can reproduce):

| d (cm) | Lowest μg X_O₂ with a tabulated V_f | Lowest 1 g X_O₂ with a printed V_f | 1 g rows printed "-" | Reading |
|---|---|---|---|---|
| 0.95 | **17.5** (B12/P12, first burn of 199m, ADMITTED) | **18.5** (S2-R09, 2 cm/s) | 18.5 at 25 cm/s; 18.1 | μg spread tabulated 1.0 point lower |
| 0.64 | **17.0** (B10/P10, first burn of 187m); 16.8 (P17, colour unconfirmed) | **18.0** (S2-L20/L21) | 17.8, 17.5 (2 cm/s); 18.2 (25 cm/s) | μg spread tabulated ≥ 1.0 point lower |
| 1.27 | **17.6 only from B9 = second burn of specimen 202m** (P9, 39 min after P5). First burns: 19.3 (B5), 20.6–20.7 (B13a/b) | **18.5** (S2-L07/L08) | 18.3, 18.1 | **depends on specimen history.** Fresh 1.27-cm rods were not tabulated in μg below 19.3 % |

**Statement supported by the records:**
> For 0.95-cm and 0.64-cm black PMMA rods, Link et al.'s tables record flame spread in ISS low-flow microgravity
> at oxygen levels at least one percentage point below the lowest oxygen at which they record spread in 1 g.
> For 1.27-cm rods, the only microgravity record below the 1 g minimum comes from a rod that had already been
> burned 39 minutes earlier.

**Limits:**
1. μg X_O₂ is the *initial* calibrated value. O₂ fell during each burn, so spread occurred at or below the tabulated value.
2. The 1 g "-" entries are undefined: they may mean no spread, no test, or no steady state.
3. Flow differs (forced 0.4–2 cm/s in μg vs buoyant ~30 cm/s in 1 g).
4. Neither series is a limit search on fresh specimens at fine O₂ steps.
5. Thermal history and ignition method differ.

**What it is and isn't:** a record-level re-check of the authors' own conclusion. It is not a new LOC value and not a new discovery.

**Why it matters for IGNIS:** this is a concrete case where **specimen identity changes a fire-safety-relevant
reading**. A spreadsheet of Table S1 alone would put 1.27-cm rods in the "μg lower" column. The NASA log shows the
only supporting record is a reburn. A curated spreadsheet that carries the crosswalk flags (baseline M1) would
catch it too. The value is in the curation, so whether software adds anything stays an open, testable question.

---

## 6. Claims IGNIS must NOT make
1. "NASA's records show Link's headline experiments were concurrent-flow", or any variant presenting C-03 as settled or as a NASA finding.
2. "The paper's non-monotonic flow result is invalid / wrong", or calling the authors or NASA mistaken.
3. "Reducing opposed flow by 0.27 cm/s reduces spread rate by 17.2 %", or any causal or per-unit flow sensitivity from within-burn differences.
4. A single "LOC for PMMA in microgravity", or any O₂ limit applied beyond the tested diameters, flows and protocol.
5. "Gravity does not matter" from N1.
6. "IGNIS discovered an error / a new physical effect." Source conflicts are documentation issues.
7. "Independently verified", "validated", "SOTA", "NASA-approved", or any affiliation or endorsement.
8. "First / only tool to track provenance, comparability or specimen reuse." MicroFire Atlas already documents provenance labels, comparability warnings and reused-sample flags for other BASS-II families.
9. Any number derived from a figure (none were digitised).
10. P17 "is black PMMA" (unconfirmed), or B22 "is P22a + P22b" (inferred).

---

## 7. Still unknown
- What the raw video shows for as-run 93 and 94 (C-03).
- Whether PSI-25 can be accessed with a free account, and its licence.
- What Rivera 2026 and Liveretou 2024 contain.
- Author intent on the C-02 label, B15, B22 and P17.
- Whether any of this is more useful to a real researcher than a curated spreadsheet (no user test).
