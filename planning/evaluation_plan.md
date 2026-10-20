# Evaluation plan

## What we will and will not claim
- We will measure whether IGNIS answers a **frozen** set of record-level research tasks with fewer admission errors, fewer unsupported claims and complete provenance, compared with the **same curated data in a spreadsheet**.
- We will **not** claim SOTA, statistical superiority, or generalisation. All tasks draw on the same 52 + 46 rows and one NASA appendix, so they are **not independent samples**. Results are reported per task, not as one pooled accuracy with a confidence interval.

## Comparators (same task, same source data)
| ID | Comparator | Contents |
|---|---|---|
| **M0** | Published-table spreadsheet | Tables S1 and S2 exactly as published (our CSVs), filtering and formulas allowed. No crosswalk, no conflict register |
| **M1** | **Curated spreadsheet: the strongest fair baseline** | M0 **plus** the crosswalk CSV (NASA test, specimen, config, O₂ final, flags) and `source_conflicts.md`. A careful researcher with M1 has every fact IGNIS has |
| **M2** | IGNIS vertical slice (built during the event) | same data, plus a rule engine, comparison view, dossier and optional language layer |
| (M3) | Keyword search (BM25) over the source texts | optional, **only** for task T05/T06-style retrieval; not needed for record-level tasks |

**Hypothesis to test:** M2 ≈ M1 on correctness, since M1 has the same information, while M0 makes the errors listed
in Evidence Case 02 §6. If M2 is no better than M1, we report that **the value is in the curation, not the
software**, and say so in the submission.

> **Audit note (20 Oct, second session):** v1 below is unchanged. Problems found:
> - T03 and T07 are CONTESTED.
> - T10's key is outdated: TM Fig. 4.1 supports the cm/s reading.
> - The keys use method vocabulary, which biases the comparison.
> - The set is circular: the same assistant wrote the rules and the keys.
>
> See `evaluation_audit.md` for the proposed v2 rubric and metrics, and D-018. Until a person approves v2, treat v1 as
> an internal consistency suite, not an evaluation.

## Frozen task set (v1, frozen 2026-10-20, before any IGNIS method exists)
Answer keys are derived only from the sources. Each key lists the required decision, numbers and citations.

| ID | Task (as a user would ask it) | Required answer (key) |
|---|---|---|
| T01 | Within burn B4, compare spread rate at 2.00 vs 1.73 cm/s | ADMIT. B − A = 2.69 − 3.25 = −0.56 ×10⁻³ cm/s = −5.6 µm/s (−17.2 %). Same burn, not independent. No uncertainty propagation. Confounders: time/preheat, O₂ 18.5 → 17.1, tip regression. Cite S1-L20, S1-L22, P4 |
| T02 | Within burn B12, compare 1.01 vs 0.48 cm/s | ADMIT. −0.71 ×10⁻³ cm/s = −7.1 µm/s (−23.1 %). Intermediate rows rise (3.45, 3.65), so not monotonic |
| T03 | Within burn B16, compare 7.55 vs 1.67 cm/s | NO ADMITTED DIFFERENCE. Quarantined (C-03 Concurrent in NASA A.3) and unit-label conflict (C-02). May show source values with flags |
| T04 | Is spread faster in μg or 1 g for 0.95 cm rods at 18.5 % O₂ and 2 cm/s? | Arithmetic 3.33 − 3.25 = +0.08 (1 g − μg), shown. INDETERMINATE for a gravity effect: ignition, flow sequence, statistic, steady criterion, O₂ drift, buoyant effective flow. Note C-09 |
| T05 | Critical opposed-flow velocity for black PMMA rods at 17.5 % O₂? | No admitted value. Table 2.1 is thin-sheet E-03, so INAPPLICABLE. Rod statements conflict (0.6 cm/s vs ≈ 4 mm/s; tabulated spread at 0.41/0.48 cm/s) |
| T06 | LOC for black PMMA rods in microgravity? | No single value: 17 % ([L18]) vs 17.5 % ([TM]). LOC for spread ≠ limit for burning (Fig. 4.4f). Name diameter, flow, source |
| T07 | Spread rate of P17 at 0.41 cm/s; usable for black PMMA? | Printed 2.26 (right half, C-02). INDETERMINATE: colour unstated in both sources; NASA records a 22 cm/s blow-off attempt mid-burn |
| T08 | Average B22 at 1.58 cm/s | Refuse to average. 6.45 and 8.31 are kept separate. B22 INDETERMINATE (possible merge of P22a/P22b, C-15) |
| T09 | Join Link B16 with NASA appendix "B16" | Refuse a label join: NASA A.1 B16 is a 100-µm film (C-14). Candidate match is P16, with conflict C-03 |
| T10 | Convert B6's 10.00 (at 2.00 cm/s) to mm/s | Two readings: 0.100 mm/s (cm/s label, supported by Figs 5/6a/S1) or 0.0100 mm/s (as printed). Flag C-02. Never pick silently |
| T11 | Compare C25 and B22 at 1.58 cm/s | INAPPLICABLE: clear vs black PMMA |
| T12 | Do B5 → B9 show lower O₂ slows spread? | No. Consecutive burns of the **same specimen** 202m (P5 then P9, ~39 min apart). O₂, specimen history and time all differ. Descriptive only |

**Contamination warning:** the same assistant wrote these keys and will help build M2. Before the event, a
teammate should add **at least 4 held-out tasks** written from the sources without showing them to whoever
builds the rule engine. Record who wrote them and when.

## Metrics (per task, per method)
| Metric | Definition |
|---|---|
| Correct admission decision | decision matches the key (ADMIT / FLAG / CONDITIONAL / QUARANTINE / INDETERMINATE / INAPPLICABLE / REFUSE) |
| Incorrect admission | a record the key excludes is used in a number or claim |
| Numerical correctness | every number equals the key exactly, including sign and units |
| Unsupported-claim count | statements not traceable to a source row or quoted statement (causal, generalising, LOC-as-one-number…) |
| Provenance completeness | the answer names the row IDs and NASA test (and page) for every number |
| Consistency | plot, text and dossier show identical numbers (automated check in M2) |
| Effort (pilot only) | wall-clock minutes per task for 1–3 people, labelled as a pilot with its n |
| Curation effort | person-hours to build M1 vs to maintain M2's records (log both) |

## Protocol
1. Freeze the tasks (done: v1 above) and add held-out tasks (teammate).
2. Run M0 and M1 by hand (one person each, no IGNIS) and record answers verbatim.
3. Run M2 during the event, after the slice works and before polishing.
4. Score against the keys. Report a per-task table, including tasks where IGNIS is worse.
5. Publish the scoring sheet with the submission (if rules permit), plus all raw answers.
