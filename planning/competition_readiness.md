# Competition readiness (20 October 2026, second session)

This file covers three things: the status of the rules (re-checked today), what this session was and was not allowed to do, and an honest strategy assessment. It contains **no submission content**.

## 0. Readiness decision (21 Oct 2026, third session; supersedes §4–§5 where they differ)
**Decision: do not build.** Until a written organizer ruling and the 28 Oct challenge statement arrive, limit work to source review, scientific documentation and planning. All of it stays subject to the ruling for reuse.

**Rule check.**
- **Re-fetched** 2026-10-20 19:04 UTC (21 Oct local): the FAQ, Team Formation Guide and Terms & Conditions. Their text is identical to the 16:53 UTC copies. The challenge page is byte-identical, and its resources tab is still empty.
- **Reading:** no official text *clearly* prohibits reading or documentation. "Working on the challenges / project" is undefined, so the situation is **ambiguous, not clearly prohibitive** (U1).
- **Caveat:** a strict reading could cover this repository's work. That is exactly what Email A asks.

| Gate | Status | Change since 20 Oct |
|---|---|---|
| Rules: may pre-event work be reused? | **UNKNOWN** | Email A revised; **not sent** |
| Team and event registration | **UNKNOWN** | — |
| Challenge-statement fit | **UNKNOWN** until 28 Oct | — |
| Data integrity | **PASS (assistant-checked)**; CONDITIONAL until a person reviews it | `human_review_checklist.md` ready |
| Measurand / protocol specification | **PASS** (specification level) | new: `research/endpoint_dictionary.md` (D-021) |
| Primary demonstration (burn history, `research/evidence_case_03.md`) | **CONDITIONAL**: strongest available case; assistant-checked | new (D-022) |
| Secondary demonstration (matched μg/1 g pair) | **PASS** for display and contrast; **FAIL** for any causal reading | reframed under the measurand rules |
| Software value over a curated spreadsheet | **UNKNOWN (untested)**. H1 and its decision rule are defined | new: `value_hypothesis.md` (D-024) |
| Evaluation readiness | **FAIL.** Development cases only; held-out tasks need a person | repair note: `future_evaluation_plan.md` (D-025) |
| Judging criteria | **UNKNOWN** until 13 Nov | — |

**Can be done now, by people (no building):**
1. The user sends Email A and records the reply.
2. A reviewer runs `human_review_checklist.md`. Separately, a person writes and seals ≥ 4 held-out tasks.
3. The user decides on a PSI account (B-03), library access to Rivera 2026 (B-04) and Email B (B-05).
4. On 28 Oct, read the challenge statement and record a scope decision.
5. Ask 2–4 people whether they could take part in a short pilot during the event (B-10). Send no materials.

**Must wait until 14 Nov 09:00 local, and the ruling:**
- all code: application, UI, dashboard, rule engine, record bundle;
- any dataset or transcription made for the submission, including the A.3 gas columns (D-023);
- demo assets, video, submission text;
- every evaluation run and the user study.

**Next authorized implementation step (defined precisely).**
- **Preconditions:**
  - (i) the organizer ruling is recorded, or its absence is recorded and the re-derive path is chosen;
  - (ii) the 28 Oct statement has been reconciled with the Evidence Case 03 scope, in `DECISIONS.md`;
  - (iii) it is 14 Nov, 09:00 local or later.
- **Step 1, event hours 0.5–3: build the record set for the primary and secondary demonstrations.**
  - **Inputs:** freshly downloaded, hash-checked ESM and TM PDFs. If reuse is not permitted, Tables S1, S2 and A.3 (including the CO₂/CO columns) are re-transcribed during the event.
  - **Fields per record:** source row ID, measurand, legacy endpoint, method, statistic, protocol, the context fields of `endpoint_dictionary.md` §5, specimen burn number, and atmosphere predecessor.
  - **Acceptance:**
    - the transcription check passes on the fresh PDFs;
    - an automated test reproduces exactly the Evidence Case 03 §2 table, D2 and D5, and the +0.08 contrast of §10;
    - **no UI work starts before this passes.**
- **After Step 1:** follow `implementation_blueprint.md` §4, scoped to `researcher_workflow.md`.

## 1. Rule status
All pages were re-fetched 2026-10-20 between 16:53 and 16:56 UTC.
- **FAQ, Team Formation Guide, T&C, home page:** text unchanged from the morning copies.
- **Challenge page:** byte-identical GraphQL response; the resources tab is still empty.
- **Awards page:** fetched for the first time.

Raw copies are in `_raw/spaceapps_recheck/`.

### CONFIRMED (official text)
| Topic | Exact wording | Source |
|---|---|---|
| No pre-event work | "Teams **are not allowed** to begin working on the challenges prior to the hackathon." | Participant FAQs (page dated 13 Oct 2026) |
| No pre-event work | "participants should NOT begin working on their project until the hackathon begins on November 14, 2026 (9:00 a.m. local time) to ensure a fair and equitable process." | Team Formation Guide (23 Sep 2026) |
| Event start | "will be held at each NASA Space Apps Challenge location starting on November 14, 2026 (or a different day during the same week previously expressly approved in writing by the NASA Space Apps Global Organizing Team)" | Terms & Conditions (7 Aug 2026) |
| Submission window | "Project submission opens on Saturday, November 14 at 9:00 AM and closes on Sunday, November 15 at 11:59 PM local time." | 2026 home page |
| SI disclosure | "Each team's project submission must include a description of how SI tools were used during the development of their project." | FAQ |
| Licensing | original content OSI-licensed (Apache-2.0 default); third-party materials "freely and publicly available … or … licensed as open source"; "You must cite every source" | T&C |
| Teams | ≤ 6 members; Universal Event teams ≥ 2 for global judging; one team, one challenge | FAQ |
| Challenge summary | "create an interactive, super intelligence (SI) powered dashboard that summarizes, ranks, and interprets those findings to deliver fire safety insights for human space exploration" | challenge page |
| Global Award categories | 10 awards, among them "**Best Use of Science**: the project that makes the best and most valid use of science and/or the scientific method", "**Best Use of Data**: the project that best makes space data accessible or leverages it for a unique application", "Best Use of Technology", "Galactic Impact", "Best Mission Concept", "Most Inspirational", "Best Use of Storytelling", "Global Connection", "Art & Technology", "Local Impact". Winners are chosen by "an executive committee of NASA and Space Agency Partner Subject Matter Experts" | Awards page (undated; links to the 2025 results) |
| Judging path | Local judges, then Global Nominees, then NASA and partner SME review (Global Finalists, Honorable Mentions), then the executive committee (10 Global Winners) | Awards page; Team Formation Guide |

### UNRESOLVED
| # | Item | Why |
|---|---|---|
| U1 | Whether reading, transcribing, verification scripts or planning count as "working on the challenges / project" | "working" is not defined |
| U2 | Whether pre-event files may be reused | no text addresses it |
| U5 | 2026 judging criteria and scoring | the Judging & Awards Guide comes out on 13 Nov. The award categories above are **not** a scoring rubric |
| U8 | The full challenge statement: requirements, resources, any mandated data | due 28 Oct. **Its future requirements are not known and are not assumed here** |

### EVENT-SPECIFIC
- First-round judging is done by the **Local Event's** judges.
- The submission deadline follows the **Local Event's** end time.
- Local Events may add their own rules.
- All team members must be confirmed at the **same** Local Event.
- The user's event, registration and team are **unknown** to this assistant (U6).

### REQUIRES ORGANIZER CLARIFICATION
U1 and U2, plus reuse of scripts, the format for disclosing AI-assisted preparation, and the eligibility effect of a pre-event repository. All are drafted in `organizer_clarification_email.md` (Email A).

**Observation, not a basis for any decision:** at least 20 public "Flame in Freefall" repositories already exist (`research/prior_art_comparison.md`). One of them is a deployed application. Their existence says **nothing** about what is permitted. Do not infer authorization from it.

## 2. What this session did, under the conservative reading
- The brief says: "If even additional project-specific preparation is prohibited or ambiguous, limit activity to permitted source review and preparation of a clarification request." U1 is ambiguous, so this session limited itself to:
  1. **Source review:** re-reading the publisher and NASA PDFs, and the visual transcription audit.
  2. **Clarification requests:** Emails A and B.
  3. **Audits of existing documents:** the evaluation audit, the prior-art comparison and this file. Two of these are prose planning that the user's brief explicitly requested: the evaluation specification and the reviewer instructions.
- **No application, UI, dashboard, demo asset or algorithm was created.** The only scripts run were scratch scripts for reading PDFs and filtering existing CSVs. They were kept outside the repository, and are disclosed in `CHRONOLOGY.md`.
- **If the organizers rule that planning counts as "working",** these documents should not be reused (D-015).

## 3. Strategy assessment (honest)

### What the challenge summary asks for, and where IGNIS stands
| Asked for | IGNIS today | Gap |
|---|---|---|
| "summarizes … findings" across "decades" of NASA data | one ISS rod campaign (20 burns), plus a thin-sheet table | **large**: breadth |
| "ranks" | nothing | **large**. Competitors have ranking with robustness checks |
| "interprets … to deliver fire safety insights" | record-level, qualified statements (e.g. F-9: μg spread at ≥ 1 O₂ point lower for 0.95 and 0.64 cm rods) | depth exists; packaging doesn't |
| "interactive, SI-powered dashboard" | nothing built (correctly, pre-event) | build window: 14–15 Nov |

### Against the competition
- **MicroFire Atlas** already covers BASS-II (films, fabric), Saffire and LUCI. It has page-level provenance, reused-sample flags, an evidence ladder, abstention, a claim checker and evaluation sets (`prior_art_comparison.md`).
  - Competing with it on breadth, UI or "trustworthy AI" features would be competing on its strengths.
  - Its coverage gaps that IGNIS fills: **journal-side data** (Link 2018 rod rates), **cross-document identity** (journal label ↔ NASA test ↔ specimen) and **cross-source conflicts**.
- **The curated-spreadsheet baseline (M1)** reproduces every IGNIS number today. That is the bar the judges' "most valid use of science" reading will implicitly apply.

### The proposed signature demonstration, re-tested
| Step (from the brief) | Fit | Verdict |
|---|---|---|
| 1. Source-backed observation | P4 (descriptive) or F-9 (lower O₂ for spread in μg at matched diameter) | **F-9 is the stronger opener.** It is a fire-safety question that both sources raise |
| 2. Reconstruct conditions and specimen | crosswalk to NASA A.3 (specimen, burn order, O₂ drift) | supported |
| 3. Connect to NASA's log | yes | supported |
| 4. Reveal a consequential discrepancy | **not B16/B19 as a headline** (D-017). Best candidate: at 1.27 cm, the only supporting μg record is a **reburned** specimen (B9 = second burn of 202m). It is consequential because it changes the answer for one diameter, and it is not a claim that anyone made an error | supported, modest |
| 5. What conclusion remains supported | "for 0.95 and 0.64 cm rods, spread recorded ≥ 1 O₂ point lower in ISS low flow than in 1 g; not shown for fresh 1.27-cm rods; no single LOC" | supported, with limits |
| 6. Export an auditable result | planned (blueprint) | not built |

- **Is this more useful than the curated spreadsheet?** **UNKNOWN.** An M1 analyst with the crosswalk flags reaches the same answer.
- **What the demo can honestly claim:**
  - (a) the reconciled dataset exists and is open;
  - (b) the reconciliation changes at least one fire-safety reading;
  - (c) whatever the measured effort or error difference against M1 turns out to be (`evaluation_audit.md`).
- **What it can't claim:** that software beats curation, unless measured.

### Practical fire-safety value (keep the project anchored here)
- The rod data bear on a real design question: material flammability limits at low ventilation flow in microgravity, compared with ground tests. That question is set out in [L18] p.6 and [TM] p.58/50.
- IGNIS's value is to answer that kind of question **with its limits**:
  - which diameters;
  - which flows;
  - which specimens;
  - what the sources disagree on.
- IGNIS should **not** become a tool for finding documentation errors.

## 4. Gates
| Gate | Status | Why |
|---|---|---|
| Rules: may pre-event work be reused? | **UNKNOWN** | U1/U2 awaiting a ruling (Email A not yet sent) |
| Team and event registration | **UNKNOWN** | U6 |
| Challenge-statement fit | **UNKNOWN** until 28 Oct; **CONDITIONAL** on the summary (narrow scope) | U8 |
| Data integrity (S1, S2, A.3 transcriptions) | **PASS (assistant-checked)**; **CONDITIONAL** until human review | B-07 |
| Crosswalk (19 labels) | **PASS** (inference); B22 and P17 **CONDITIONAL** | `adversarial_source_audit.md` |
| C-03 discrepancy as a demo headline | **FAIL** | `b16_b19_discrepancy_review.md` §10 |
| Positive case P4 | **PASS** (descriptive) | `research/p4_independent_recheck.md` |
| Novelty: algorithmic or SOTA | **FAIL** | `prior_art_comparison.md` |
| Novelty: curated reconciliation | **CONDITIONAL** | must be shown to change answers or effort against M1 |
| Evaluation readiness | **FAIL** | no held-out tasks; keys circular (`evaluation_audit.md`) |
| Judging criteria known | **UNKNOWN** | 13 Nov |

## 5. Next permitted action (single most useful)
*(Still current on 21 Oct; Email A was revised and is still unsent.)*

**The user sends Email A to their Local Lead, or via the Contact Us page, now.**
- Every other path (reusing the data and scripts, or the 2-hour re-transcription budget at gate D0) depends on that answer.
- The answer has to arrive before 14 Nov to be useful.

**Second:** recruit the independent reviewer (`independent_reviewer_instructions.md`), because the evaluation gate cannot pass without them.

**Then:** read the challenge statement on 28 Oct and record a scope decision.
