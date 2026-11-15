# Implementation gate: GO / NO-GO handoff for the first authorized development session

## Current governing gate — 7 November 2026 PKT

**NO-GO for application development.** The user authorized the [contract closure and build handoff](../IGNIS_Contract_Closure_and_Build_Handoff.md), not an application. **Its section 10 supplies the current G1–G7, dependency order, 23-hour effort assumption and cut order.** This section and that handoff supersede conflicting requirements in the historical checklist below, `competition_readiness.md` and `implementation_blueprint.md`.

- Build starts only after the applicable 14 Nov 09:00 event start, an asset-specific permitted preparation path, the remaining current gates, and an explicit user instruction. No reply, fresh folder or retyping is an eligibility exemption.
- The full challenge is already available. Recheck the announced 13 Nov guides/resources; do not wait for an obsolete 28 Oct release.
- Saffire is the principal path. Implement the typed assessment/templates and applicable acceptance cases before the single UI/export, then ordered live AI and broader navigation. The rod-first M1 below is **historical**, not an additional prerequisite. NIST UI and rod controls are optional.
- A permitted pinned source can be verified from its acquired bytes. Redownload only if needed for identity, changes, access or the ruling; never fabricate missing synchronized series.
- The typed form remains a useful failure fallback. Demonstrated live interpretation is required for the complete SI-powered function; the older optional-AI wording is superseded.
- Record assistant versus external review honestly. Independent tasks/participants are needed for the corresponding evaluation claims, not invented as completed prerequisites for an event build. Historical evaluation protocols remain unchanged and unrun.

## Historical checklist — 22 October 2026 (not current build requirements)

**Written 22 Oct 2026 (local). Decision today: NO-GO.**
- This is a checklist, **not** permission to build.
- It supersedes the "next authorized implementation step" in `competition_readiness.md` §0. Where the build order differs from `implementation_blueprint.md` §4, this file governs (D-029).

## 1. GO requires every item below
| # | Condition | Status 22 Oct | How it is shown |
|---|---|---|---|
| G1 | It is **14 Nov 2026, 09:00 local** (the user's event) or later | ✘ | clock |
| G2 | Record the asset-specific organizer ruling and required disclosure. Re-derivation is an alternative only if organizers permit it with the disclosed preparation; no reply leaves eligibility unresolved | ✘ (no ruling established on 7 Nov) | current assessment §3 and §12; `DECISIONS.md` D-032 |
| G3 | The user explicitly instructs the assistant to start building | ✘ | the user's message |
| G4 | The 28 Oct challenge statement has been read. Each stated requirement is listed with how IGNIS will meet it, or why it won't: interactive, SI-powered, summarize, **rank**, interpret, breadth, and any mandated data | ✘ (not released) | a decision in `DECISIONS.md` |
| G5 | The source PDFs have been re-downloaded and their hashes checked; any change is recorded | ✘ | `manifests/data_sources.csv` |
| G6 | The human review status is recorded. Either a reviewer log exists, or B-07 is still open and everything is labelled "assistant-checked" | open | `BLOCKERS.md` B-07 |
| G7 | The team, roles and stack are chosen at gate D0 (`implementation_blueprint.md` §0) | ✘ | `DECISIONS.md` |

Not needed for GO, but needed before the evaluation step (step 8): sealed held-out tasks (B-07, Activity C) and pilot participants (B-10).

## 2. Already satisfied (assistant-checked; no person has reviewed it)
- **Scientific scope frozen:**
  - the primary case `research/evidence_case_03.md`;
  - the secondary pair (§10 there);
  - the plain descriptive case `research/evidence_case_02.md` (P4).
- **Measurand and protocol model:** `research/endpoint_dictionary.md`. IDs E-01…E-08 are unchanged.
- **Records:**
  - 127 transcribed rows;
  - a 19-label crosswalk;
  - 27 conflicts and definition gaps in `research/source_conflicts.md`;
  - a transcription check (6/6 PASS on 21 Oct).
- **Evaluation design:**
  - H1 and its fixed decision rule (`value_hypothesis.md`);
  - development cases v1 and T13 (frozen, regression use only);
  - the review packet (`review_packet/`).
- **Drafts for external actions:** Email A (final), the researcher invitation. Both unsent.

## 3. External blockers (people, not code)
B-01 organizer ruling · B-02 challenge statement (28 Oct) and judging guide (13 Nov) · B-07 human review and held-out tasks · B-10 pilot participants · optional: B-03 PSI account, B-04 Rivera 2026, B-05 Email B.

## 4. First development session: tasks in dependency order
**Milestone M1:** *"Given one supported scientific question, reproduce the corresponding source-backed analysis deterministically."*
- M1 is complete only when steps 1–4 pass.
- **No interface work before M1.**

| Step | Task | Acceptance test (automated unless stated) |
|---|---|---|
| 1 | **Source-backed records and identity links.** Each record carries its source row ID, PDF page and source hash, plus specimen, NASA test, burn index and atmosphere predecessor | the transcription check passes on the fresh PDFs (or the in-event re-transcription passes the same check). Every S1 label resolves to exactly the crosswalk's NASA test. B9 → P9 → 202m, burn 2, predecessor P5 |
| 2 | **Unit and scientific-field validation** | O₂ % vs fraction round-trip; mm ↔ cm diameters; the right half of S1 stays "(mm/s)" CONDITIONAL; "-" never becomes 0; pressure stays null with a reason |
| 3 | **Explicit evidence-applicability policies.** Versioned rules (admit / qualify / exclude, each with a reason) for reuse, shared atmosphere, configuration conflict (B16/B19), O₂ conflict (B15), merge (B22), colour unknown (P17) | each rule has a passing and a failing fixture. The rule-set version is hashed |
| 4 | **Deterministic Evidence Case 03 analysis** | reproduces EC03 §2 and D1, D2 and D5 **exactly**. The "first burns only" setting gives 1.27 cm → 19.3 (B5) and −0.8. B9's qualification is generated from its record fields (reuse, predecessor), not from fixed text |
| 5 | A simple, useful visualization | every plotted point carries its row ID and matches the step-4 output |
| 6 | Source-linked explanation and dossier | every number in the text and the export equals the engine output (snapshot test) |
| 7 | AI interaction, with verification and a fallback | the LLM maps a question to a structured query that the user confirms. A checker rejects any changed number or decision. Everything works with no API key |
| 8 | Fair baseline evaluation | per `value_hypothesis.md` §5–6 and `future_evaluation_plan.md` §3c. Held-out file unsealed only after the rule set is frozen |
| 9 | Submission polish | `submission_checklist.md`; SI-use statement; citations and licences |

This is a **dependency order**, not permission to implement now. Time boxes: `implementation_blueprint.md` §4.

## 5. Quality gates that apply to every step
1. **The software's scientific results must match the reviewed research case.**
   - The reference is `research/evidence_case_03.md` (and EC02 for P4).
   - If a human review changes a value, the case document is corrected first, with a dated note, then the test.
   - Until then, the app labels results "assistant-checked".
2. **Not a hard-coded example.** In addition to EC03, the same engine must answer **all three** of these from records:
   - **Q-ALT-1 (supported):** *"How did the tabulated spread rate change across the recorded flow settings within NASA burn P4?"*
     - Expected: 32.5 → 31.0 → 26.9 µm/s (EC02 §2, §4), as a description within one burn.
     - It must **not** produce "reducing airflow causes spread to decrease by 17.2 %".
   - **Q-ALT-2 (supported):** the matched μg/1 g pair at 0.95 cm, 18.5 %, 2 cm/s.
     - Expected: 3.25 vs 3.33, a contrast of +0.08 ×10⁻³ cm/s.
     - Statement: "cannot identify gravity's isolated causal effect" (EC03 §10).
   - **Q-DECLINE:** *"What is the microgravity LOC for 1.27-cm rods?"*
     - Expected: no value; the bounded statement and its reasons (EC03 §5, §9).
3. **Anti-hard-coding checks:**
   - Expected numbers live only in test fixtures, never in application code.
   - A mutation test removes or re-flags one record in a test copy, and the output must change exactly as a hand calculation predicts.
4. **Consistency is a test:** records = plot = written conclusion = exported dossier. **Any discrepancy fails the build step.**
5. **Never produced:**
   - SOTA claims or safety certification;
   - safe/unsafe labels, risk scores, predictions or confidence percentages;
   - any LOC value;
   - causal claims from these contrasts.
6. **Architecture:**
   - Use the simplest stack that passes the tests (D-012, chosen at D0). No graph or vector database, no model training, no agent framework.
   - The LLM is optional and comes only at step 7.

## 6. Scope guard
- The PMMA case is the first **verified path**, not the product.
- After M1, broaden only through further supported queries over the same record model. A wider evidence catalogue may come later, if G4 calls for it, and only with task-specific compatibility checks.
- **Not now.**
