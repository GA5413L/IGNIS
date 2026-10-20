# Session report: 20 October 2026 (pre-event research)

## Verified sources
- **Link et al. 2018**, *Sci. Rep.* 8:120 (doi 10.1038/s41598-017-18398-4), CC BY 4.0. Full text read, and its **Supplementary Information** (Tables S1, S2; Figs S1–S3) downloaded from the publisher (SHA-256 `e17c9511…1b23`).
- **NASA/TM-20210011385** BASS-II Summary Report, official NTRS PDF (SHA-256 `5ffa911f…f770`, 144 pp.). Read: Table 2.1, Ch. 4 (rod opposed-flow task), and Appendix Tables A.1, A.3, A.5 (parts).
- Identity-verified (metadata/abstract only): Bhattacharjee 2016; **Rivera et al. 2026 (rods, opposed-flow limit; paywalled)**; Ries 2024; T'ien 2025; Takahashi 2026; Olson 2024; OntoChemExp (Bai 2021); arXiv 2005.07939, 1801.10093, 2603.04452; NIST MFD; NASA-STD-7009B.
- Competition: FAQ (13 Oct 2026), Team Formation Guide (23 Sep 2026), Terms & Conditions (7 Aug 2026), home page, challenge summary.

## Accessible datasets
| Dataset | Status |
|---|---|
| Link 2018 Table S1: μg ISS, 19 labels, 52 per-segment rate rows | **transcribed and checked 6/6** (text-layer multiset + row order + negative control) |
| Link 2018 Table S2: 1 g, 46 rows (means of ≥ 3 repeats) | transcribed and checked |
| NASA TM Table A.3: as-run matrix of 27 BASS-II rod tests | key columns transcribed and checked; P16, P19, P22a/b visually verified |
| NASA TM Table 2.1: thin-sheet V_g,cr (2 rows) | visually verified; identical to the 15 Oct transcription |
| NASA PSI-25 raw BASS-II data | **not accessible** (sign-in; 403) |
| Rivera et al. 2026 data | **not accessible** (403) |

## Actual scientific findings
1. **The rod data exist and are recoverable.** The 15 Oct "blocked" status was wrong for access: the supplement was one link away on the article page.
2. **All 19 Link sample labels map to NASA as-run tests** (B↔P numbering, same nominal diameter in 19/19, Link O₂ = NASA calibrated initial O₂ in 17/19). This links a journal table to NASA's test log, including physical specimen IDs and burn order.
3. **Positive result (Evidence Case 02):** within NASA burn P4 (Link B4; black cast PMMA rod, 9.525 mm, 18.5 % O₂, opposed flow, μg), the spread rate went from **32.5 to 26.9 µm/s** as V_g was stepped from 2.00 to 1.73 cm/s. **B − A = −5.6 µm/s (−17.2 %).** This is descriptive: the segments come from one burn, in time order, with O₂ falling 18.5 → 17.1 %. In all four admitted first-burn series, the last (lowest-flow) segment was slower than the first (−0.2 to −7.1 µm/s). Two of the four were not monotonic in between.
4. **Consequential distinction:** Link's headline "first increases, then decreases" series (B16, B19) are the **two burns NASA's own matrix records as "Concurrent"**. They are quarantined. The paper's key microgravity claim rests on the records whose flow configuration is disputed between sources.
5. **Useful negative case:** at matched nominal conditions (0.95 cm, 18.5 %, 2 cm/s), μg 3.25 vs 1 g 3.33 (×10⁻³ cm/s), +2.5 %. This does **not** show a gravity-neutral result: six protocol and physics differences, including ~30 cm/s buoyant flow in 1 g. The two source documents also disagree on μg-vs-1 g ordering and on the LOC (17 vs 17.5 % μg; 18 / 18.5 / 19 % 1 g).
6. **Specimen reuse is hidden in the journal table:** B5 → B9 are the same rod (202m) burned ~39 min apart, and B13a/b and B22 have the same issue. Independence must be by specimen, not by label.
7. **Thin-sheet auxiliary case re-verified**, with the context that the experiment value pools four thicknesses and that TM §2.2 and Bhattacharjee 2016 are one result, not two.
8. **Against the baseline:** a spreadsheet computes every number. No algorithmic advantage. The value so far is curation.

## Unresolved source problems (23 logged in `source_conflicts.md`)
Most consequential:
- **C-03:** P16/P19 Concurrent vs opposed.
- **C-02:** Table S1 right half labelled mm/s vs cm/s elsewhere (internal evidence favours cm/s; kept as a conflict).
- **C-06/07/08:** low-flow limit and LOC values disagree between sources.
- **C-15/16:** B22 possibly merges two burns; NASA rows P22a/b contain implausible O₂ cells.
- **C-14:** label collisions ("B16" is also a thin film in NASA Table A.1).
- **C-05:** O₂ drifts during burns.
- **C-12:** Δt is undefined.

## Implementation design
`planning/implementation_blueprint.md`:
- Records: CSV → validated JSON. Rules: TS rule engine R1–R7.
- UI: result-first page, evidence decisions, chart linked to rows, dossier export. LLM optional, confirmation-gated, number-checked, with a no-key fallback.
- Build: 36 h time-boxed, with a minimum-viable cut at 18 h.
- Evaluation: 12 tasks frozen today against the **curated-spreadsheet baseline M1** (`planning/evaluation_plan.md`).

## Competition rule status
- **Confirmed:** event 14–15 Nov 2026; statements 28 Oct; guides 13 Nov; work on the project must not begin before **14 Nov 09:00 local**; SI tools allowed with a mandatory usage description; every source must be cited; third-party materials must be open.
- **Unresolved:** whether pre-event research and notes count as "working" (U1) or may be reused (U2); 2026 judging criteria; the user's team and event.

## Next permitted action
1. **User:** ask the Local Lead or the GO team for a written ruling on U1/U2, attaching `CHRONOLOGY.md`.
2. **User:** register for NASA PSI, and get Rivera et al. 2026 through a library.
3. **Teammate:** review the merged-cell spans and the crosswalk (B-07), and write ≥ 4 held-out evaluation tasks.
4. **28 Oct:** read the official challenge statement and reconcile `scientific_scope.md`.
5. **14 Nov 09:00 local:** gate D0, then execute the blueprint.
