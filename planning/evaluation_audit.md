# Evaluation audit and specification (20 October 2026, second session)

**Status:**
- This is a **proposal**. It is a written specification only: no code, no scores.
- The frozen task set v1 in `evaluation_plan.md` is **not edited**. The problems found are listed here, and changes are proposed as v1.1 / v2 for a person to approve (D-018).
- **No benchmark score exists. None is reported or estimated here.**

## 1. Structural problems with task set v1
| # | Problem | Evidence | Consequence |
|---|---|---|---|
| S1 | **Circular keys.** The assistant that wrote the admission rules (R1–R7) and the conflict register also wrote all 12 keys | `evaluation_plan.md` ("Contamination warning") | an IGNIS built from those rules will match the keys by construction. v1 is a **regression/consistency suite**, not an evaluation |
| S2 | **Method vocabulary in the keys.** Keys are scored as ADMIT / QUARANTINE / CONDITIONAL / INDETERMINATE | v1 key column | a spreadsheet user (M0/M1) who reasons correctly in plain words would be marked wrong. That biases the comparison toward IGNIS |
| S3 | **Trap-heavy.** 10 of 12 tasks are designed around a failure that IGNIS's rules catch (T03, T05, T07–T12, and partly T04/T06). Only T01 and T02 ask for a plain answer | v1 | measures error avoidance, not usefulness. A system that refuses most things would score well |
| S4 | **No task favours the baseline.** There are no ad-hoc filtering, sorting or "show me all rows where…" tasks, where spreadsheets are strong | v1 | inflates IGNIS's relative standing |
| S5 | **Non-independence.** Tasks share burns and conflicts: B22 (T08, T11); C-02 (T03, T07, T10); C-03 (T03, T09); specimen 202m (T12) | v1 | report per task only. No pooled accuracy |
| S6 | **M1 is open-book.** M1 is given `source_conflicts.md`, which states most keys nearly verbatim | D-011 | M1 vs M2 then measures **effort and error under equal information**, not who knows more. That is the correct design for isolating software value, but it must be stated |
| S7 | **Unresolved-source tasks scored as if they had a single answer** | T03, T07, T10 | see §2 |

## 2. Task-by-task audit of v1
| Task | Bias toward IGNIS | Leakage / dependence | Answer status after today's audit | Proposed change |
|---|---|---|---|---|
| T01 B4 within-burn | key in IGNIS vocabulary (S2) | shares rules with M2 | **stable.** Add: V_g is a nominal per-setting value; "B" is the last *tabulated* segment | rubric with plain-language elements (§4) |
| T02 B12 within-burn | S2 | — | **stable** | same |
| T03 B16 7.55 vs 1.67 | the key presumes IGNIS's quarantine | C-03 and C-02 | **CONTESTED.** C-03 is unresolved and the evidence leans opposed. C-02 is now supported toward cm/s by TM Fig. 4.1 | key becomes: report both values with source; state that NASA's appendix lists the burn as concurrent while the article and NASA Ch. 4 present it as opposed; make **no** opposed-flow claim. Score on acknowledgement, not on the word "quarantined" |
| T04 μg vs 1 g | the six-confounder list was written by the same assistant | — | **stable** (indeterminate) | accept any correct statement that the conditions are not comparable, with at least two valid reasons |
| T05 rod critical velocity | — | Evidence Case 01 | **stable** | — |
| T06 μg LOC | — | C-07 | **stable** | — |
| T07 P17 at 0.41 cm/s | — | C-02; P17 colour | **CONTESTED / possibly outdated.** The PSI-25 copy says "black rod"; not verified against PSI | hold until PSI is checked. If confirmed black, the key changes |
| T08 average B22 | trap | B22 also in T11 | **stable**, and strengthened (the two 1.58 rows probably come from different burns) | — |
| T09 label join | trap | C-14 | **stable**, and extended (B19 collides too) | — |
| T10 B6 unit | trap | C-02 | **key outdated.** It says "never pick silently", but a second document now supports cm/s | key: state the printed label, the supported reading (cm/s) and the evidence. Do not edit the source |
| T11 C25 vs B22 | trivial trap | B22 | **stable** | consider dropping (low information) |
| T12 B5 → B9 | trap | specimen 202m | **stable** (two NASA-derived records agree) | — |

## 3. Metrics (definitions to adopt)
Every metric is reported **per task and per method**, with counts. There is no pooled percentage across non-independent tasks.

| Metric | Definition | Unit |
|---|---|---|
| **Evidence-selection accuracy** | for the records the key marks as relevant, the share whose include / exclude / flag decision matches the adjudicated key | k of n records |
| **Incorrectly admitted records** | records the key excludes but that appear in a number or claim in the answer (primary safety metric) | count |
| **Correctly rejected or indeterminate** | records the key excludes or flags that the answer also excludes or flags. Report separately the **over-rejections**: records the key admits that the answer excluded | count, count |
| **Source identity accuracy** | for each cited record: correct document, table, row, NASA test and specimen | k of n citations |
| **Endpoint correctness** | the answer uses the endpoint the key requires and substitutes none (e.g. no thin-sheet V_g,cr for a rod question) | yes / no |
| **Conflict detection** | conflicts the key lists as relevant that the answer surfaces (recall). Also count conflicts asserted that the key says don't exist | k of n; count |
| **Scientific conclusion correctness** | adjudicator's rating against the key's conclusion: correct / partly correct / incorrect / overclaim. For **contested** tasks, "correct" means the unresolved state is acknowledged without taking a side | category |
| **Usable answer coverage** | tasks where the key says an answer is possible and the method gives one (guards against refusal gaming), plus tasks where the key says no answer is possible and the method correctly declines | k of n each |
| **Provenance completeness** | numbers in the answer traceable to row and page | k of n numbers |
| **Unsupported-claim count** | causal, generalising or out-of-scope statements not traceable to a source | count |
| **Analyst effort** | wall-clock minutes to produce the answer | minutes (pilot; give n) |
| **Reviewer effort** | minutes for a second person to check the answer against the sources | minutes (pilot; give n) |

## 4. Scoring rules
- **Keys list substantive elements, not method labels.** Example for T01:
  - the two values and their units;
  - same burn, sequential, not independent;
  - O₂ fell during the burn;
  - no causal claim.
  An answer earns each element in any wording.
- **Contested tasks** (currently T03 and T07, and any held-out task touching C-02, C-03, C-15 or P17) are scored only on acknowledgement and on not overclaiming.
- An **adjudicator** who did not write the method scores each answer. Disagreements are logged, not averaged away.

## 5. Keeping the three kinds of value separate
| Value | Comparison | What it isolates | Caveat |
|---|---|---|---|
| **Data curation value** | M1 (curated spreadsheet) vs M0 (published tables only), same person-type and time box | what the crosswalk and conflict register add | most of IGNIS's current contribution is expected to show up here |
| **New algorithmic value** | IGNIS rule engine (no UI, run on **held-out tasks only**) vs a person using M1 | whether automated admission matches or beats careful manual curation on tasks it was not tuned on | v1 tasks can't be used: S1 (circularity) |
| **Better user-interface value** | IGNIS full app vs M1 at **equal information**, used by people who did not build it | effort, error and reviewer time | with 1–3 participants this is a **pilot**: report raw times and errors with n, no significance |

If curation value is positive but algorithmic and UI value are zero or negative, the submission should say so: **"the contribution is the curated, reconciled dataset."**

## 6. Held-out tasks and gold labels
- At least **4 held-out tasks** written by a person who did not write the rules or v1 (see `independent_reviewer_instructions.md`).
- **Sealing:**
  - The task file is kept outside the repository.
  - Only its SHA-256 is recorded in `DECISIONS.md`.
  - The rules are frozen (rule-version hash) **before** the file is unsealed.
- **The assistant must not write, see or tune on the held-out tasks before final evaluation.**
- **Gold labels** come from the independent reviewer and are adjudicated by a person. Keys drafted by an assistant are labelled "assistant draft" and are never called independent.
- **If no independent person is available,** blocker B-07 stands. The evaluation can then only be reported as an *internal consistency check*.

## 7. Candidate task (assistant-written, so **not** held-out; for v1.1 if approved)
- **T13 (utility, not a trap).** "For black PMMA rods, at which diameters do Link et al.'s tables record μg flame spread at lower O₂ than any recorded 1 g spread, and does specimen history affect that?"
- **Draft key:** `research/adversarial_source_audit.md` §5:
  - 0.95 cm and 0.64 cm: yes, by ≥ 1.0 point;
  - 1.27 cm: only through the reburn B9.
- **Purpose:** one task where a correct, useful answer exists and where specimen identity matters.
