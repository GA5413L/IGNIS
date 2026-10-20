# Evaluation repair note and future evaluation plan

**Date:** 21 October 2026 (third session).
**Scope:**
- Task set v1 in `evaluation_plan.md` is **frozen and not edited**.
- This note records problems and proposed corrections; a person decides whether to adopt them (D-018, D-025).
- No score exists or is estimated.

## 1. What the existing tests are
| Set | Written by | Status |
|---|---|---|
| v1 tasks T01–T12 and keys | the AI assistant that also wrote the admission rules and the conflict register | **DEVELOPMENT CASES**: an internal regression and consistency suite. **Not validation.** An IGNIS built from the same rules matches them by construction (`evaluation_audit.md` S1) |
| Candidate T13 (`evaluation_audit.md` §7) | same assistant | development case. Not held-out, not independent |
| Held-out tasks | **a person**, per §3 | **none exist yet** (B-07) |

## 2. Repair note (v1 unchanged; proposed v1.1 elements)
Items already recorded in `evaluation_audit.md` (S1–S7; T03, T07 and T10 contested or outdated) are not repeated. Below are only the problems found under today's corrected endpoint rules and burn-history re-read.

| Original task | Problem | Proposed correction | Reason | Status change |
|---|---|---|---|---|
| **T04** "Is spread faster in μg or 1 g for 0.95 cm rods at 18.5 % O₂ and 2 cm/s?" | The question invites a causal answer. The key is right to refuse a gravity effect, but it doesn't credit the permitted descriptive part | Key, two required elements: (1) the descriptive contrast, 1 g − μg = +0.08 ×10⁻³ cm/s, with both statistics named; (2) no isolated gravity effect, with ≥ 2 valid reasons. Add P4's carried-over starting atmosphere as an optional reason | under the corrected rules E-01/E-02 share measurand M-01, so U2 (descriptive contrast) is allowed and U4 (causal) is not | stays **stable**; rubric refined |
| **T06** "LOC for black PMMA rods in microgravity?" | the key lists source claims but not the record-level reading | Add an optional element: lowest tabulated starting O₂ per diameter, with 1.27 cm resting only on the reburn B9 | Evidence Case 03 | stable; element added |
| **T12** "Do B5 → B9 show lower O₂ slows spread?" | The key ("No; same specimen …") is correct but incomplete. It omits (a) that at 1.64 cm/s B9 is *faster* than B5 (+8.1 µm/s) and at 1.54 slower (−4.0 µm/s); (b) that P9 began in P5's unrenewed atmosphere (CO 525 ppm) | Required elements: same rod 202m; second burn; same atmosphere carried over; mixed-sign differences; no O₂ or reburn effect inferred | the task presumes a direction that the data don't show | stable; **key incomplete**, elements added |
| **T13** (candidate) | draft key "1.27 cm: only through the reburn B9" omits the atmosphere history and the fresh-rod flame persistence | Key = Evidence Case 03 §5 | re-read 21 Oct | candidate key revised. **Still a development case** |
| **T01** | key omits that P4 began in P6's residual atmosphere (CO₂ 0.62 %, CO 64 ppm) | optional element | C-26 | stable |
| **T05** | reason given as "different endpoint" | Reason: same measurand M-02 as rod statements (E-04), but different geometry (thin vs thick) and E-04 has no defined value, so substitution (U6) is not allowed | corrected rules | stable; reason reworded |
| **All tasks** | **Leakage.** Every task, including any future held-out task, draws on the same 52 + 46 + 27 rows. "Held-out" means *unseen by the method designers*, not out-of-distribution | state this in every report | — | — |
| **All tasks** | **Independence.** Shared burns and conflicts (S5), and now shared **atmospheres**: P6→P4, P10→P8, P5→P9, P12→P17, P14→P15, P3a→P3b, P18→P24, P20→P23 (C-26) | report per task; annotate the atmosphere sequence; never pool | — | — |
| **All tasks** | **Unresolved metadata** affects answerability: pressure unknown; Δt undefined (C-12); V_g nominal (C-24); "-" undefined | a key may not require a value for these. "Unknown" is a correct answer | — | — |

## 3. Future evaluation plan
Four activities, **kept separate**. None of them is done by the assistant.

### (a) Human review of transcriptions and records
- **What it checks:** whether the data are right. **It is not an evaluation of any software.**
- **How:** `human_review_checklist.md` (≈ 90 min), with `independent_reviewer_instructions.md` for detail.
- **Output:** a dated reviewer log. Only after it may the project say "transcriptions reviewed by [name]".

### (b) Held-out task creation (a person who did not write the rules or the keys)
Instructions for that person:
1. **Do this first, before reading anything under `research/` or `planning/`** except this section and the checklist. Work only from the two PDFs.
2. Write **at least 4** questions a fire-safety researcher might really ask, with your own answer keys:
   - ≥ 1 **derived multi-record** question (a minimum, ranking or comparison across burns or across gravity);
   - ≥ 1 with a clear numeric answer;
   - ≥ 1 where the sources conflict or a record's history matters;
   - ≥ 1 that should be answered "not supported";
   - ≥ 1 plain lookup or filter task where a spreadsheet should do well.
3. Each key lists:
   - the substantive points (plain words, no project vocabulary);
   - every source location (document, page, table, row);
   - what an overclaim would look like;
   - what you could not determine.
4. Save the tasks **outside the repository**. Compute the SHA-256 and give **only the hash** to the team, to be recorded in `DECISIONS.md` with your initials and the date.
5. Do not share the tasks with anyone building IGNIS, or with any AI assistant, until the evaluation run.

### (c) Software evaluation
Only after an authorized build (14 Nov onward):
- **Freeze first:** the rule set version (hash) is frozen **before** the held-out file is unsealed.
- **Development cases** (v1, T13) are run as regression tests only and reported separately.
- **Held-out tasks** are run as M0, M1 and M2, per `value_hypothesis.md` §5–6.
- An adjudicator who did not build IGNIS scores blind to condition. Disagreements are logged, not averaged.

### (d) User study (pilot)
The M1-vs-M2 comparison with participants is a **user study of the software**. It is distinct from (a). It needs participants who did not build IGNIS (B-10). With 1–3 people it is reported as a pilot with n.

## 4. Rules for the AI assistant
- It may not write, see, rephrase or tune on held-out tasks, and may not score any evaluation.
- Any key it drafts is labelled **"assistant draft"** and is never called independent or gold.
- An assistant re-check is never reported as human verification.

## 5. Sequence
1. **Now, any day before 14 Nov:** (a) human review; (b) held-out tasks sealed by hash.
2. **28 Oct:** reconcile tasks with the official challenge statement. Held-out tasks are not edited; new ones may be added.
3. **14–15 Nov** (if the ruling and the build allow): (c), then (d) if participants exist.
4. **If nobody is available:** B-07 and B-10 stay open, and the submission calls its tests internal consistency checks.
