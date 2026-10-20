# Primary value hypothesis and fair spreadsheet comparator

**Status (21 Oct 2026):** a hypothesis with a pre-specified test.
- **Nothing has been measured.** No software exists, no participant has been tested, and no score is reported or estimated.
- The comparator below is the strongest fair baseline (D-011), with nothing withheld.

## 1. Keep two kinds of value apart
| Kind | What it is | Evidence so far | How it would be shown |
|---|---|---|---|
| **Data-curation value** | Reconciled records: transcriptions, journal↔NASA crosswalk, specimen and atmosphere history, conflict register | **Shown qualitatively, in one case.** Without NASA's log, B9 reads as an ordinary 1.27-cm observation; with it, the 1.27-cm answer changes (Evidence Case 03). Any spreadsheet holding the same records inherits this value | M0 (published tables only) vs M1 (curated), same people and tasks |
| **Software value** | whatever IGNIS adds **on top of** M1 | **None shown.** A curated spreadsheet reproduces every current IGNIS answer | M1 vs M2 (IGNIS), same information |

If only curation value is found, the submission says: *"the contribution is the curated, reconciled dataset."*

## 2. Choosing one primary hypothesis
| Candidate | Why it is or isn't primary |
|---|---|
| A. Fewer overlooked specimen-reuse errors | **Subsumed by B.** M1 carries the reuse flag. The realistic failure is a flagged record entering a *derived* answer (a minimum, a curve, a comparison) without the analyst re-checking the flag. That is B |
| **B. Fewer incorrect evidence admissions in multi-record answers** | **Primary.** It is the failure seen in Evidence Case 03: a filter over correct rows gives a conclusion that a record's history should qualify. Software can plausibly help, because history fields can travel with each record into every derived answer. It is countable per answer |
| C. Fewer endpoint-interpretation errors | M1 includes the endpoint dictionary. These errors are conceptual; software adds little more than a label |
| D. Faster audit or reproduction | plausible; measured as a **secondary** outcome |
| E. Disagreements easier to detect | overlaps with B (conflicts are one admission criterion) |

## 3. The hypothesis
> **H1.** On derived questions that combine records from more than one burn or test (minima, rankings, cross-burn
> or cross-gravity comparisons), researchers using IGNIS state fewer conclusions that rest on a record whose own
> history (reuse, shared atmosphere, open conflict, unit or configuration flag) disqualifies or qualifies it for
> that question, without stating that qualification, than researchers using the curated spreadsheet M1. They do
> this with no increase in wrongly excluded records and no material increase in time.

| Question | Answer |
|---|---|
| **What improves?** | the number of *incorrectly admitted records* per answer: a record used in a number or conclusion without the exclusion or qualification that the human-written key requires |
| **For whom?** | researchers, students and reviewers assembling evidence from published microgravity combustion tables. **Not** crew and not operational decision-makers |
| **Compared with what?** | M1 (§4), with identical information |
| **How will it be measured?** | §5 |
| **What would falsify it?** | §6 |

## 4. The comparator M1 (nothing withheld)
**M1 gets everything IGNIS uses:**
- **Sources:** the same source PDFs.
- **Tables:** the same CSV records, **including every field IGNIS displays**. If IGNIS shows burn index, atmosphere predecessor or the A.3 gas readings, M1 gets the same columns in its sheets.
- **Curation files:** the crosswalk with all flags, `source_conflicts.md`, the endpoint dictionary, and the admission rules written in plain words.
- **Linking note:** a one-page note on how the sheets link (label ↔ NASA test ↔ specimen).

**Tools:** any spreadsheet software. Formulas, filters, pivots, lookups and helper columns are all allowed.

**Fairness rules:**
- equal briefing time per condition (10 min);
- the same time limit per task;
- answers scored on **substance** (`evaluation_audit.md` §4), so IGNIS vocabulary is never required;
- people who built IGNIS or wrote the keys are not participants.

## 5. Measurement (pilot scale; runs only after an authorized build)
1. **Tasks:** at least 4 **held-out** derived tasks written and keyed by a person who did not build IGNIS (`future_evaluation_plan.md` §3). Plus ≥ 1 plain lookup task where a spreadsheet should do well; it is reported, but outside H1.
2. **Design:** each participant answers half the tasks with M1 and half with M2. Task halves and condition order are counterbalanced, and no participant sees the same task twice.
3. **Scoring:** an adjudicator scores answers **blind to condition** (answers transcribed to plain text).
   - **Primary:** incorrectly admitted records.
   - **Guard:** wrongly excluded records.
   - **Secondary:** minutes per task, and a second person's minutes to verify the answer against the sources.
4. **Reporting:** per task and per participant counts, with n stated. No pooled percentage, no significance test. The result is called a *pilot*.

## 6. Decision rule (fixed now, before any data)
- **H1 is supported (pilot)** only if all of the following hold:
  - (a) M2's total incorrectly admitted records is **lower** than M1's;
  - (b) M2's wrongly excluded records ≤ M1's;
  - (c) M2's median time per task ≤ 1.25 × M1's.
- **H1 is not supported** if (a) fails, or if (a) holds only together with a failure of (b) or (c).
- **No room to test:** if M1 participants make **no** incorrect admissions (a ceiling), H1 cannot be supported. The finding is then "curation is sufficient".
- **Language limits:**
  - Whatever the outcome, no claim beyond "in a small pilot".
  - With no participants at all (B-10), the submission says the software value is **untested**.
