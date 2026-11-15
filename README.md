# IGNIS: research and event prototype

**Team development:** [Clone, run, test and contribute](CONTRIBUTING.md). The application is in `web/`; no API key is needed for its structured workflows. Use `npm run test:team` for the checks available in this shared checkout. Raw source downloads and private evaluation state remain local.

> **Current handoff (15 Nov 2026 PKT):** [Endpoint/protocol audit and API contract](web/docs/ENDPOINT_PROTOCOL_AUDIT_2026-11-15.md), [experimental-design audit](web/docs/EXPERIMENTAL_DESIGN_AUDIT_2026-11-15.md), [competitor comparison](web/docs/COMPETITIVE_STRATEGY_AND_VISUAL_REFINEMENT_2026-11-15.md), [build status](web/docs/BUILD_STATUS.md). Build web-2026-11-15.9 adds a separate accepted-manuscript dossier and exact observation audit for spread, visible flame and regression. The two supplied PDFs match in text and nine renders; they are not independent sources. All 390 shared offline tests, TypeScript, lint, webpack build and twelve production/source checks pass. The 18 prior source collections and existing registry/analysis identities are unchanged. UI work remains with the teammate. No paper trial data are reconstructed; physical validation and live interpretation remain NOT RUN, and deployment remains held.

> **Historical handoff (7 Nov 2026 PKT):** [Contract closure and build handoff](IGNIS_Contract_Closure_and_Build_Handoff.md) governed the four scientific templates, ordered runtime AI, versioned assessment/revision and then-current build gate. Saffire was the principal analytical path; NIST was secondary and the rod reconstruction an optional control. At that date preparation reuse was unresolved and no application had been built; those status statements are superseded above. The [cross-disciplinary report](IGNIS_Cross_Disciplinary_Improvement_Decision.md), [competitive-core report](IGNIS_Competitive_Core_Decision.md) and [earlier research verdict](IGNIS_Astra_Research_and_Winning_Solution.md) remain historical research context.

**IGNIS** (Intelligent Graph for NASA In-Space Safety) is a prototype evidence workbench for NASA microgravity
fire-safety data, targeting the NASA Space Apps Challenge 2026 challenge *"Flame in Freefall"*. It is **not**
affiliated with or endorsed by NASA.

> **Historical status (20 Oct 2026): pre-event research only.** Space Apps rules say participants should not begin working on
> their project before **14 Nov 2026, 09:00 local time**. This repository contains research notes, verified source
> transcriptions and a plan. It contains **no application**. See `planning/competition_rules.md` for what is
> confirmed and what is awaiting an organizer ruling.

## The central principle
**Similarity is not scientific comparability.** Two results about "PMMA flame spread" or "extinction" may measure
different things, under different protocols, on different specimens, or even the same specimen burned twice.

## What we found (details in `research/session_report_2026-10-20.md`)
- The ISS PMMA-rod flame-spread data (Link et al. 2018, Tables S1/S2) **are available** and are transcribed here with a mechanical check against the publisher PDF.
- A **19-label candidate crosswalk** links journal records to NASA's BASS-II as-run log (NASA/TM-20210011385, Table A.3), with qualified specimen identities and burn order; not every relationship is one-to-one or resolved.
- **Positive result:** in NASA burn P4 (black PMMA rod, 9.525 mm, 18.5 % O₂), spread rate 32.5 → 26.9 µm/s as opposed flow went 2.00 → 1.73 cm/s (descriptive, within one burn).
- **Open conflict, kept in quarantine:** NASA's appendix log lists the paper's headline series (B16/B19) as **"Concurrent"**. The article, NASA's own Chapter 4 and the published photographs present them as opposed. The adversarial audit (second 20 Oct session) classifies this as a genuine unresolved conflict with the evidence favouring opposed (`research/b16_b19_discrepancy_review.md`). It is **not** a headline finding.
- **Historical rod demonstration, now an optional control: burn history changes a fire-safety reading** (`research/evidence_case_03.md`, 21 Oct).
  - **0.95- and 0.64-cm rods:** selected first-logged microgravity burns have printed spread rates at initial O₂ values below the ground-table minima; protocols differ and segment oxygen is unknown.
  - **1.27-cm rods:** the low-initial-O₂ record B9/P9 is a reburn of specimen 202m. Matching gas entries support possible atmospheric continuity, not proof of an unchanged atmosphere.
  - **First-logged 1.27-cm rods:** the selected table minimum becomes 19.3%; the corresponding low-initial-O₂ spread question remains unresolved. Changing this selection changes the target population.
  - **Not claimed:** no limiting oxygen value.
- **Endpoint specification corrected** (`research/endpoint_dictionary.md`). The measured quantity (measurand) is now separated from method, statistic, context and protocol. The same measurand under different protocols may be displayed and contrasted, but not pooled or read causally.
- A spreadsheet reproduces all the arithmetic. The contribution so far is **curation and conflict detection**, not algorithms. A public competitor (MicroFire Atlas) already does page-level provenance and reused-sample flags for other BASS-II materials (`research/prior_art_comparison.md`).

**Audit status (20 Oct, second session):** see `research/adversarial_source_audit.md` for which earlier findings
survived (PASS), were qualified, or failed. Still **no independent human review** (B-07).

**Third session (21 Oct):**
- The endpoint specification was corrected; Evidence Case 03 was written; the shared-atmosphere pattern was recorded (C-26).
- A value hypothesis, an evaluation repair note, a human-review checklist and a revised (unsent) organizer email were added.
- Readiness decision: **do not build** (`planning/competition_readiness.md` §0).

**Fourth session (22 Oct): handoff, nothing built.**
- **Ready for the user to send** (unsent): the final organizer e-mail and one researcher invitation.
- **Ready for a person:** the human review packet `planning/review_packet/`.
- **Build gate:** `planning/implementation_gate.md`. **NO-GO** until the ruling, 14 Nov and an explicit instruction.

## Layout
| Path | Contents |
|---|---|
| `IGNIS_Contract_Closure_and_Build_Handoff.md` | **current handoff**: four contracts, manual traces, proposed acceptance cases, AI/revision rules and first authorized build |
| `research/evidence_case_03.md` | optional rod control: lowest O₂ with recorded spread, μg vs 1 g, and what burn history changes |
| `research/evidence_case_02.md` | rod case: question, admission rules, within-burn result (P4), negative cases |
| `planning/researcher_workflow.md`, `planning/value_hypothesis.md` | one-page user task; falsifiable value hypothesis and spreadsheet comparator |
| `planning/review_packet/` | **human review packet**: blind source reading (A), interpretation check (B), held-out task brief (C), review form |
| `planning/implementation_gate.md`, `planning/researcher_invitation.md` | GO/NO-GO handoff for the first authorized build; unsent pilot invitation |
| `planning/future_evaluation_plan.md` | evaluation repair note and future plan (`human_review_checklist.md` is superseded) |
| `research/evidence_case_01.md` | auxiliary thin-sheet critical-velocity case (re-verified) |
| `research/source_conflicts.md` | 27 conflicts and definition gaps, with exact locations and treatments |
| `research/adversarial_source_audit.md` | second-session audit: approval decisions, surviving/failed findings |
| `research/b16_b19_discrepancy_review.md`, `research/p4_independent_recheck.md`, `research/prior_art_comparison.md` | focused audit reviews |
| `planning/competition_readiness.md`, `planning/evaluation_audit.md`, `planning/independent_reviewer_instructions.md` | rules status, strategy, evaluation audit, reviewer brief (superseded by `review_packet/`) |
| `planning/organizer_clarification_email.md`, `planning/author_clarification_email.md` | **drafts, not sent** |
| `research/data/` | as-printed transcriptions + crosswalk + verification results |
| `research/analysis/` | verification, crosswalk and evidence-case scripts |
| `research/` (other) | source register, data access audit, endpoint dictionary, inventory, literature matrix, prior art |
| `planning/` | rules status, scope, evaluation plan (frozen tasks), implementation blueprint, submission checklist |
| `manifests/` | retrieval provenance with SHA-256; rights and attribution |
| `DECISIONS.md`, `BLOCKERS.md`, `CHRONOLOGY.md` | decision log, blockers, disclosure timeline |
| `tools/` | download and PDF inspection utilities |
| `_raw/` | local third-party downloads (**gitignored**; re-fetch with `tools/fetch.ps1`) |

## Reproduce the checks
Requires Windows PowerShell, `curl.exe`, and Python 3 with PyMuPDF.
```powershell
.\tools\fetch.ps1 -Url "https://media.springernature.com/original/springer-static/esm/art%3A10.1038%2Fs41598-017-18398-4/MediaObjects/41598_2017_18398_MOESM1_ESM.pdf" -Slug link2018 -FileName 41598_2017_18398_MOESM1_ESM.pdf
.\tools\fetch.ps1 -Url "https://ntrs.nasa.gov/api/citations/20210011385/downloads/TM-20210011385.pdf" -Slug ntrs_20210011385 -FileName TM-20210011385.pdf
py -3 -I research\analysis\verify_transcriptions.py _raw\link2018\41598_2017_18398_MOESM1_ESM.pdf _raw\ntrs_20210011385\TM-20210011385.pdf
py -3 -I research\analysis\crosswalk.py
py -3 -I research\analysis\evidence_case_02.py
```
Compare the downloaded files' SHA-256 with `manifests/data_sources.csv` before trusting the results.
