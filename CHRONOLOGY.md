# Work and reuse chronology

This is a transparent record of pre-event work, for disclosure to organizers and judges. Times are UTC where
known.

## Before this repository existed (reported by the user; not present here)
- Concept reviews "v0.2 to v0.4" (adversarial reviews of the IGNIS concept). **Not in this repository.**
- **2026-10-15:** "IGNIS Evidence Case 01" packet (Markdown). It describes a provisional Table 2.1 transcription, a SQLite/direct-arithmetic baseline, `test_analysis.py` (12 checks), `rod_case_status.json`, a frozen JSON and a chart. **Those code and data files are not in this repository** and were not run in this session. Under the confirmed rules (D-001) they should not be reused in a submission without an organizer ruling.

## 2026-10-20 session (Claude Code, model Claude Opus 5.5, acting on the user's brief)
| Time (UTC) | Work |
|---|---|
| ~12:57 | `git init`; created `research/`, `planning/`, `manifests/`, `tools/`, `_raw/` |
| 12:58–13:00 | Retrieved and read the Space Apps FAQ, home page, Team Formation Guide, Terms & Conditions, and challenge page (via the site's public GraphQL) |
| 13:01 | Retrieved Link et al. 2018 article + **Supplementary Information PDF (Tables S1/S2)** |
| 13:03–13:04 | Retrieved NASA/TM-20210011385 (NTRS); attempted PSI-25 |
| 13:04–13:08 | Read Table 2.1 (visual), Ch. 4, Appendix Tables A.1/A.3/A.5; visually verified P16, P19, P22a/b rows |
| 13:08–13:12 | Crossref, NTRS, arXiv, PubMed, NIST and NASA-standards identity checks; PSI API probing; PMC mirror attempt |
| afterwards | Wrote transcriptions (`research/data/*.csv`), verification script with a negative control, crosswalk, Evidence Case 02 arithmetic, and all notes and plans in this repo |

### Code written in this session (research tooling, not an application)
- `tools/fetch.ps1`: download + log + hash
- `tools/html2text.py`, `tools/pdf_extract.py`, `tools/pdf_crop.py`: source inspection
- `tools/spaceapps_page.py`: reads the public challenge page body via the site's GraphQL
- `research/analysis/verify_transcriptions.py`: transcription check
- `research/analysis/crosswalk.py`: candidate Link ↔ NASA crosswalk
- `research/analysis/evidence_case_02.py`: admission rules + B − A arithmetic

None contains UI, dashboard, retrieval or LLM code. Whether even these count as "working on the project" is open
(U1). They are disclosed here either way.

## 2026-10-20, second session (adversarial audit; Claude Code, model Claude Opus 5.5, acting on the user's audit brief)
| Time (UTC, approx.) | Work |
|---|---|
| ~16:40 | Read the audit brief and the whole repository (working tree clean at `bc662b7`) |
| ~16:42–16:50 | Re-hashed the ESM and TM PDFs (match the manifest). Rendered and read [L18] Fig. 4, ESM Tables S1/S2 (every cell, 200–220 dpi), ESM Fig. S1, TM Fig. 1.2, Fig. 4.1 and the Table A.3 header/P16/P19 rows. Read TM text pp.12–17, 55–62, 72–82, 109–121 |
| 16:50–16:53 | GitHub public API searches and reads (README, file tree, selected data files) of competitor repositories MicroFire Atlas, Fotia and FLARENEXUS; read a third-party copy of the PSI-25 test table. **No third-party code was run** |
| 16:53–16:56 | Re-fetched the Space Apps FAQ, Team Formation Guide, T&C, home and challenge pages (text unchanged); fetched the Awards page |
| ~16:56–17:30 | Wrote the audit documents (below); updated the registers |

### Files written or changed in the second session (documents only)
- **New:**
  - `research/adversarial_source_audit.md`
  - `research/b16_b19_discrepancy_review.md`
  - `research/p4_independent_recheck.md`
  - `research/prior_art_comparison.md`
  - `planning/evaluation_audit.md`
  - `planning/independent_reviewer_instructions.md`
  - `planning/organizer_clarification_email.md` (draft, **not sent**)
  - `planning/author_clarification_email.md` (draft, **not sent**)
  - `planning/competition_readiness.md`
- **Updated:**
  - `research/source_conflicts.md` (C-02, C-03, C-04, C-14, C-15, C-16, C-18 updates; new C-24, C-25)
  - `research/evidence_case_02.md` (N3 reworded; nominal V_g; confounders)
  - `DECISIONS.md` (D-015–D-020), `BLOCKERS.md`, this file
  - `README.md`, `planning/competition_rules.md`, `planning/evaluation_plan.md` (pointer only; v1 unchanged), `planning/implementation_blueprint.md` (§5 demo framing)
  - `research/data_access_audit.md`, `research/source_register.md`, `research/experiment_inventory.md`, `research/session_report_2026-10-20.md` (superseded-in-part note)
  - `manifests/data_sources.csv`
- **No data file in `research/data/` was changed.** No script in the repository was changed or added.

### Code run in the second session (scratch only, outside the repository)
Four short Python helpers in the session scratchpad, reading local PDFs or CSVs:
- `render_clip.py`: render a PDF region to PNG.
- `appendix_rows.py`: list the appendix test rows from the extracted text.
- `lowest_o2.py`: a filter over the two Link CSVs.
- `cf_contacts.py`: list the contact addresses published in the saved FAQ HTML.

None is an application or part of a submission. The existing `verify_transcriptions.py` and `evidence_case_02.py` were re-run unchanged.

## 2026-10-20/21, third session (scientific closure; Claude Code, model Claude Opus 5.5, acting on the user's brief)
Times are UTC on 20 Oct (local date 21 Oct, UTC+5). **All work below is pre-event and subject to the organizer ruling for any reuse (B-01).**

| Time (UTC, approx.) | Work |
|---|---|
| ~18:56 | Read the brief and the repository (working tree clean at `1550c07`) |
| ~19:00–19:03 | Re-hashed the three source PDFs (match the manifest). Re-read [L18] pp.3–7 and the ESM captions. Re-read [TM] pp.13–16 (work-volume procedure) and the full Table A.3 text, including the CO₂/CO columns. Rendered Table A.3 gas columns (pp.114–115) and [L18] Fig. 8(a, c) into `_raw/audit_2026-10-20c/` (local, gitignored) |
| 19:04 | Re-fetched the FAQ, Team Formation Guide and T&C (text identical) and the challenge page (byte-identical) into `_raw/spaceapps_2026-10-21/` |
| ~19:05–19:20 | Wrote and updated the documents below |

### Files written or changed in the third session (documents only)
- **New:**
  - `research/evidence_case_03.md`
  - `planning/researcher_workflow.md`
  - `planning/value_hypothesis.md`
  - `planning/future_evaluation_plan.md`
  - `planning/human_review_checklist.md`
- **Rewritten in place:**
  - `research/endpoint_dictionary.md`: layered model; original E-01…E-08 table kept with its meaning.
  - `planning/organizer_clarification_email.md`: still a draft, **not sent**.
- **Updated:**
  - `research/source_conflicts.md` (new C-26, C-27; earlier entries unchanged)
  - `DECISIONS.md` (D-021–D-026), `BLOCKERS.md` (B-01, B-07, new B-10), this file
  - `README.md`, `planning/competition_readiness.md` (§0 decision), `planning/competition_rules.md`
  - one-line pointers or notes in: `research/evidence_case_02.md`, `research/adversarial_source_audit.md`, `research/p4_independent_recheck.md`, `research/experiment_inventory.md`, `planning/evaluation_plan.md` (frozen v1 tasks unchanged), `planning/evaluation_audit.md`, `planning/independent_reviewer_instructions.md`, `planning/implementation_blueprint.md`, `planning/scientific_scope.md`
- **No data file in `research/data/` and no repository script was changed or added.**

### Code run in the third session (scratch only, outside the repository)
- `render_clip.py` (existing helper): PDF region renders.
- `burn_history.py`, new, in the session scratchpad. It:
  - checks the hand-typed Table A.3 gas readings against the repository's O₂ columns;
  - lists the adjacent-burn carry-over;
  - recomputes the per-diameter minima and the B5/B9 and B13a/B13b contrasts from the CSVs.

Neither is an application or part of a submission.

## Reused third-party resources
- Python 3.14.0 with pre-installed PyMuPDF (fitz), BeautifulSoup4 and requests; Windows `curl.exe`. No third-party code was copied into this repository.
- Data: see `manifests/data_sources.csv` and `manifests/rights_and_attribution.csv`.

## SI (AI) usage, for the mandatory submission statement
An AI assistant (Claude, via Claude Code) carried out the source retrieval, transcription, verification
scripting, cross-source analysis and the writing of these notes, following the user's written brief. Every number
in `research/data/` is checked mechanically against the publisher or NASA PDF text layer. In a second session the
same kind of assistant also checked every cell visually against the PDF renders, as an adversarial audit. **No human
has yet independently reviewed them** (B-07). An assistant re-check is not independent verification. A third
session (21 Oct local) re-read the records behind Evidence Case 03 and wrote the specification and planning
documents listed above. It, too, was the same kind of assistant.
