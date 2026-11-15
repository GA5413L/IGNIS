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

## 2026-10-21 UTC / 22 Oct local, fourth session (handoff preparation; Claude Code, model Claude Opus 5.5, acting on the user's brief)
**Pre-event and subject to the organizer ruling (B-01).** No application code; no data file or repository script changed.

| Time (UTC, approx.) | Work |
|---|---|
| ~19:40 | Read the brief and the repository (working tree clean at `7a2e277`) |
| 19:45–19:47 | Re-fetched the FAQ, Team Formation Guide, T&C, home, Awards and Contact Us pages, and the challenge page (by GraphQL page ID) into `_raw/spaceapps_2026-10-22/`. Rule text unchanged; the challenge resources tab now reads "Resources coming soon." Re-hashed the three source PDFs: they match |
| ~19:50–20:30 | Wrote and updated the documents below |

### Files written or changed in the fourth session (documents only)
- **New:**
  - `planning/review_packet/`: `README.md`, `A_source_reading.md`, `B_interpretation_check.md`, `C_task_author_brief.md`, `review_form.md`
  - `planning/researcher_invitation.md` (draft, **not sent**)
  - `planning/implementation_gate.md`
- **Rewritten in place:** `planning/organizer_clarification_email.md` (final draft, **not sent**)
- **Marked superseded:** `planning/human_review_checklist.md` (replaced by a pointer), `planning/independent_reviewer_instructions.md` (banner)
- **Updated:**
  - `planning/value_hypothesis.md`: secondary outcomes, effort accounting; the decision rule is unchanged
  - `planning/future_evaluation_plan.md`: packet pointers, and the missing P21a→P21b pair added
  - `planning/competition_rules.md`, `planning/competition_readiness.md`, `planning/implementation_blueprint.md`: pointers and re-check
  - `DECISIONS.md` (D-027–D-029), `BLOCKERS.md`, `README.md`, `manifests/data_sources.csv`, this file

### Code run in the fourth session (scratch only, outside the repository)
Three helpers in the session scratchpad:
- `gql_probe.py`: read-only GraphQL queries for the challenge page;
- `cf_contacts.py`: lists the e-mail addresses published, obfuscated, on a saved page;
- `find_pages.py`: finds the PDF page of a quoted phrase.

None is an application or part of a submission.

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
documents listed above. It, too, was the same kind of assistant. A fourth session (22 Oct local) prepared the
organizer e-mail, the human review packet, a researcher invitation and the implementation gate. It performed no
review itself.

## 7 November 2026 PKT: Astra research and decision assessment

The user supplied `IGNIS_Astra_Research_and_Winning_Solution_Prompt (1).md` and authorized a substantive research/design assessment. The user confirmed Emberfall will submit IGNIS and reported one active builder, 2–3 team members and Pakistan Standard Time. This session did not build the submission application, publish anything, register an account, or contact organizers/researchers.

### Work and files

- Inspected repository history, current research/plan files, selected analysis scripts and primary PDFs. HEAD at the start was `95a6a99`; initial worktree clean.
- Rechecked the official challenge/FAQ/team guide/terms through the public content API. Current challenge text is available; resources and judging/submission guides are scheduled for 13 Nov. Read only relevant connected registration notifications; no mailbox changes or messages sent. Personal mailbox content was not included in the report or research captures.
- Reviewed primary scientific sources through the research date with explicit full-text/abstract/metadata access distinctions. Audited the three named competitor repositories at pinned commits and a bounded 2023–2025 cohort sample. Third-party source snapshots were cached read-only under gitignored `_raw/`; none of that code was executed or incorporated into an application.
- Created `IGNIS_Astra_Research_and_Winning_Solution.md`: one cited report covering scientific repairs, current rules, prior art, the selected product, evaluation, scope, adoption, self-review and direct answers. No evaluation results or independent reviewers were invented.
- Added D-030–D-032 and updated current README/blocker/instruction pointers. Added correction notices to EC03/P4 and corrected the implementation gate's no-reply re-derive assumption. Historical evidence/plans and original transcriptions remain available; data files and analysis scripts were not changed.

### Code run and checks (research scratch only)

- Ran the existing `research/analysis/verify_transcriptions.py` unchanged after reading it: **6/6 checks passed**. The A.3 portion verifies key tokens on pages, not complete row/column semantics; this is not independent scientific validation.
- Inline Python read CSVs, counted rows/specimens/crosswalk labels, recalculated the stated table minima and P4 descriptive difference, and checked PDF hashes. Inline PyMuPDF rendered the relevant source pages for assistant visual inspection.
- Inline Python/requests made read-only public source/API requests and saved response/hash manifests. An introspection request was rejected and the protected project-detail endpoint returned forbidden; neither restriction was bypassed. Some frontend fetches failed or returned shells. TLS verification was not disabled.
- Used the installed Python executable directly because the Windows `py` alias failed. The existing PowerShell fetch helper was blocked by execution policy; policy was not changed. Public-source requests requiring network escalation used the tool's approval review.
- Checked the report for placeholder/encoding problems, table structure, local links and consistency with the final recommendation. These document checks are not application tests or a user study.

All new scientific checks, interpretation and writing in this session were performed by the Codex assistant. Independent human scientific review, a user-value evaluation and an asset-specific organizer ruling remain outstanding.


## 7 November 2026 PKT: competitive contribution assessment

The user supplied `IGNIS_Astra_Competitive_Contribution_Prompt.md`, authorizing new research, a worked scientific case and one focused decision report. This session preserved the earlier report and existing uncommitted work. It did not build a competition application, send messages, publish, register accounts or change source transcriptions.

- Read the current recommendation and relevant repository records/history. Evaluated three task candidates and selected construction/revision of a model-validation plan; the PMMA rod reconstruction remains a control. Added `IGNIS_Competitive_Core_Decision.md` and proposed decisions D-033/D-034; historical decisions, H1, the 25% protocol and frozen evaluation tasks remain intact.
- Acquired NASA-hosted Saffire V modeling (ICES-2024-310), preliminary VI measurements (ICES-2024-365), and VI modeling (ICES-2025-156) PDFs and NTRS metadata. Read the relevant original methods/results and visually inspected load-bearing tables, equations and figures. Reconstructed model-input/calibration/test-target roles across V and VI, retaining same-campaign and shared-calibration dependencies.
- Calculated the published V normalization (54.4/29.9, and 29.9 x 1.82), three VI source-versus-remote-inferred mass differences, and the VI-3 initial oxygen partial pressure. These are checks on published rounded values, not reproduced CFD predictions, new experimental data or model-validation scores. No figures were digitized.
- Inspected additional pinned MicroFire research-planning/export/Saffire files and Fotia's Saffire view. Third-party code was only cached for static review under gitignored `_raw/competitive_core_2026-11-07/`; none was executed or incorporated into IGNIS.
- Checked the official challenge, FAQ, team guide and terms through the public content API. The complete query succeeded after correcting an invalid content-field selection. Challenge body, relevant timing/team rules and legal content remain consistent with the previous report; resources/guides are still announced for 13 November. This does not settle preparation reuse or verify the actual team creator's zone/accepted roster.
- Retained access limits: publisher full-text failures; OpenAlex metadata without usable full datasets; university-repository HTTP 403 for the original 2023 calibration paper and two 2026 Saffire follow-ups. No access restriction was bypassed. No raw synchronized sensor series or runnable FDS deck was acquired from the inspected source inventories.

### Research scratch code and preservation checks

Inline Python used the installed isolated interpreter with requests/BeautifulSoup for public retrieval and metadata, PyMuPDF for text extraction and page rendering, Decimal for stated calculations, and hashlib/JSON for captures and preservation manifests. PowerShell and git performed read-only repository inspection. No new submission code, UI or demo asset was written. Raw capture manifests retain URLs, access results, times and hashes; a final local inventory records the additional captures.

Document checks cover calculations, cited local paths, table structure, encoding, source fingerprints and preservation of the previous report/data/frozen evaluation files. Original DECISIONS.md and CHRONOLOGY.md content is retained as an unchanged byte prefix, with only these additions. These are research/document checks, not a user study or independent scientific verification. All analysis and writing are assistant-authored; independent review and measured user benefit remain outstanding.


## 7 November 2026 PKT: cross-disciplinary improvement assessment

The user supplied `IGNIS_Astra_Cross_Disciplinary_Improvement_Prompt.md`, requesting a research audit, worked before/after cases and one decision report. Research started at 15:10 UTC (20:10 PKT). The session preserved the earlier reports, existing uncommitted work, original records and frozen evaluations. It did not build an application, run a physical solver, send messages, publish, register accounts or spawn agents.

- Read the current competitive-core report and earlier research context, repository instructions and relevant decisions, blockers, history, sources, endpoint/conflict records, cases and prospective evaluation/gate files. Mapped fields A-N with bounded review depth, considered three enhancement candidates and selected one primary operation plus two small supports.
- Rechecked load-bearing Saffire V/VI source construction, calibration, initial alignment, quantity distinctions and reported totals from the previously acquired original NASA PDFs. Retained known conflicts and missing raw-series/replay assets.
- Recovered the author-posted full-text web transcription of the 2026 heat/smoke paper, ICES-2026-577, through ResearchGate. A public PDF download returned 403/HTML; no restriction was bypassed and new table numbers were not adopted without visual inspection. The separate 2026 spacecraft-prediction follow-up remained abstract-only.
- Acquired and visually inspected the NIST MaCFP-3 gasification poster, and inspected pinned MaCFP apparatus documentation, calibration metadata, the 2023 NIST-StMU property JSON, an FDS 6.8 R3 input deck and measured/submitted mass CSVs. Pinned repository commit: 3174c3407273b211c3e6f0ceb0f6db7828e8f25b. Documented negative tared mass from epoxy loss, separate temperature/mass experiments, missing R3 diameter and the poster/deck heat-transfer-coefficient difference. No deck or third-party software was executed.
- Examined relevant FDS 6.11.1 documentation, NASA-HDBK-7009B, NIST pyrolysis UQ methods/limits, PrIMe/B2BDC quantities-of-interest methods, system-identification guidance, correlated measurement uncertainty, provenance/contracts and current scientific-AI limitations. Screened causal transport, experimental design and visualization where they changed an inclusion decision. Current MicroFire and Fotia heads matched the earlier pinned audit; no competitor app was run.
- Recalculated the published Saffire normalization and VI source/remote summary differences. For NIST R3, checked initial values, tared loss to 480 s (28.14 g), reported PMMA-plus-epoxy mass (28.254 g), and the posted measured/predicted values at labelled 200 s (15.6/17.6 g, +2.0 g). These are disclosed inspection arithmetic, not prespecified time-series scores, reproduced solver results, confidence intervals or physical validation.
- Retrieved the authoritative challenge, FAQ, team guide and legal content once; the full response matched the earlier capture. A targeted read-only connected-mail search found known November 6 confirmations and no newer asset-specific ruling. No private mailbox content is included in the report. Preparation reuse, actual creator zone/accepted roster and forthcoming November 13 guides remain bounded dependencies.
- Created `IGNIS_Cross_Disciplinary_Improvement_Decision.md`; appended proposed D-035 through D-037. No earlier scientific data or frozen protocol was silently rewritten. The report's three worked cases remain assistant-selected development examples.

### Research scratch and checks

Inline Python/requests downloaded public sources with normal TLS verification, PyMuPDF extracted text/rendered the poster, CSV/Decimal performed the stated arithmetic, and hashes/JSON retained capture and preservation records. Public network requests used the tool's approval review. PowerShell/git inspection was read-only. No execution policy or access controls were changed. New raw material and manifests are under `_raw/cross_disciplinary_2026-11-07/`, including failed-access responses.

Document checks cover source references, table structure, arithmetic, encoding and preservation. Earlier reports, data, analysis scripts and frozen evaluations are hash-checked; the original DECISIONS.md and CHRONOLOGY.md remain unchanged byte prefixes. These are research/document checks, not application tests or independent scientific validation. All source interpretation, cases and report writing were performed by this assistant; user benefit and independent adjudication remain unmeasured.


## 7 November 2026 PKT: final scientific contracts and build handoff

The user supplied `IGNIS_Astra_Final_Contracts_and_Build_Handoff_Prompt.md`, authorizing source-grounded specification and targeted checks only. Work began at 16:34 UTC (21:34 PKT). Both requested reports were read completely, starting with the latest template/runtime-AI sections; repository instructions, source manifests, current gate, rules and relevant evaluation/history records were inspected. HEAD was 95a6a999c9a7e1cc862c970463c986f46772e008 and the worktree was already dirty. No application, UI, physical-model run, deployment, communication, registration or sub-agent work occurred.

- Added the single focused `IGNIS_Contract_Closure_and_Build_Handoff.md`: non-circular interpretation/confirmation/assessment pipeline; four bounded contracts with domains and counterexamples; immutable history and claim-specific outcomes; one assessment for view/export; four manual traces; 26 proposed acceptance cases, all application tests NOT RUN; one fair revision exercise and the finite authorized-build sequence.
- Reinspected original cached NASA Saffire V/VI methods and results. Visually inspected the VI modelling paper's p. 6 equations and p. 9 result text, and the preliminary VI paper's Table 2 on p. 6. Recorded chemical versus sensible heat and distinguished the preliminary paper's sample VI-3 (two-sided PMMA) from the modelling paper's event 6. SIBAL is the separate event-5 navigation/comparison input. No figure was digitized.
- Reinspected the pinned NIST/MaCFP apparatus and contribution descriptions, R3 FDS declarations, measured/submitted CSVs and material-property provenance. Retained the exact declared deck output expression without asserting deck-to-output linkage. The experimental raw-tare procedure remains incomplete; preserve the documented posted signal and valid negative tail. The h=13 versus 13.5 discrepancy, R3 diameter, clocks and full fitting history remain unresolved. No third-party executable or solver was run.
- Checked T1 by symbolic coefficient cancellation and a labelled synthetic gain counterexample. Recomputed the rounded Saffire source ratio 54.4/29.9 and product 29.9*1.82, and NIST signal loss 28.14 g, separately reported total 28.254 g and labelled 200 s difference +2.0 g. These are source/arithmetic checks, not time-series scores, uncertainty estimates or application tests.
- Checked the official NASA SAME overview for detection navigation and the current NASA FLEX account for visible-flame versus complete-extinction scope. The SAME web-reader open failed but direct public PDF retrieval succeeded; the older FLEX blog link redirected to a general page, so a supported official account was used. Prior 2026 follow-up findings remain inherited, with no new numerical claims.
- Refreshed the official challenge/FAQ/team-guide/legal content once at 16:38 UTC; HTTP 200 and identical hash to the prior capture. A bounded read-only mailbox search returned known confirmations and no newer asset-specific ruling; private mailbox details were not copied into the report. Full challenge availability is established; preparation reuse, final creator zone/accepted roster and November 13 guides remain external dependencies.
- Reconciled current pointers in README, CLAUDE, BLOCKERS, competition_rules and implementation_gate. The old rod-first/optional-AI checklist is explicitly historical. Appended D-038 through D-040; did not edit earlier reports, original measurements, analysis scripts or frozen evaluations. Existing organizer/reviewer drafts remain unsent. No commit was made.

### Research scratch and document verification

Inline isolated Python performed public retrieval with normal TLS verification, PDF text/render inspection, CSV/Decimal arithmetic, symbolic coefficient comparison, hashing and document/preservation checks. PowerShell/git inspected state. Public network escalation used automatic approval review; no policy or access control was changed. No submission code or test implementation was created. Captures, arithmetic and source fingerprints are under gitignored `_raw/contract_closure_2026-11-07/`.

Final local checks cover the 16 protected-file hashes, unchanged byte prefixes for the decisions/chronology, inspected-source hashes, document references/table structure and Git status. These checks are recorded in `final_document_checks.json`; they do not establish application correctness, independent scientific review or user benefit. All new interpretations, cases and writing are assistant-authored. The existing 23-hour effort assumption and all earlier evaluation protocols remain unchanged; an external reviewer/adjudicator and an explicit adopted protocol are still needed for the corresponding claims.


## 8 November 2026 PKT: UI/UX specification and AC04 correction

The user supplied `IGNIS_Astra_UI_UX_Plan_and_Final_Patch_Prompt.md`, authorizing one written interaction handoff and a narrow acceptance-expectation repair. Read the complete current scientific handoff, the relevant scientific-purpose/value sections of the two preceding reports, current repository instructions, README, decisions, blockers, chronology and implementation gate. Inspected Git status and existing differences; HEAD remained 95a6a999c9a7e1cc862c970463c986f46772e008. The dirty worktree and untracked reports were preserved.

- Verified that AC04 still incorrectly assigned unresolved to stronger claims contradicted by documented timing/baseline choices. Corrected that row to claim-specific incompatible/unresolved/conditional outcomes, preserving the complete prior row in an 8 November change note. Other acceptance cases, scientific contracts, source records and historical evaluation protocols were not changed.
- Added `IGNIS_UI_UX_and_Interaction_Handoff.md`: one Explore/Analysis workspace, four text wireframes, one proposed visual direction, assessment-bound components and controls, version/stale-export rules, recovery states, source-bound copy and future acceptance checks. No rendered asset, clickable prototype, frontend dependency or application code was created.
- Rebalanced the inherited 23-hour one-builder assumption explicitly: 1.5 hours move from core expansion to UI integration, retaining the four-hour checking block, rest periods and submission margin. The first thin confirmation-to-real-assessment-to-result-to-export integration follows the W1 scientific core and its checks. Runtime AI remains required for the complete function. Existing permission/reuse gates remain in force.
- Checked proposed copy against the current reviewed source/claim records. Scientific source checks remain inherited from 7 November; no new fire-model finding, synchronized data acquisition or physical run is claimed. Read targeted primary W3C guidance on contrast, reflow and focus not being obscured to ground future accessibility checks. No rendering, accessibility conformance, independent review, user study or application-test success was established.
- Appended D-041/D-042. No rule/mail refresh or external communication was needed for this scoped design pass. Existing organizer/reviewer drafts remain unsent; no account, deployment, submission, physical-model execution, agent delegation, staging or commit occurred.

Inline isolated Python and read-only Git commands recorded a 62-file starting preservation manifest, snapshots, scoped diffs, document/link/table checks and the effort totals. Local verification records are under gitignored `_raw/ui_ux_handoff_2026-11-08/`. Final checks compare every pre-existing file, allowing only the explicit AC04 patch and append-only decision/chronology entries. These are document/preservation checks, not tests of the proposed application. All application/UI tests remain NOT RUN.


## 8 November 2026 PKT: user-requested visual UI preview

After the written handoff, the user asked to see the UI. Generated and visually inspected one static Analysis-screen mockup with the built-in image_gen tool, using the imagegen skill and the existing UI specification. This later request authorizes the visual preview beyond the preceding written-only task; it does not establish organizer permission to reuse the preparation. The image explicitly says DESIGN PREVIEW and retains the conditional-comparison, missing-assets and numerical-evaluation-not-run labels. No application, clickable prototype, source-data change or live assessment was implemented; all application tests remain NOT RUN.

The preview was displayed inline and remains in the tool's generated-images directory. Its exact prompt, file reference and fingerprint are recorded in gitignored `_raw/ui_preview_2026-11-08/`. No deployment, external message, account registration, staging or commit occurred.


## 8 November 2026 PKT: affordable runtime AI selection and cost research

The user supplied `IGNIS_Astra_Affordable_Runtime_AI_Research_Prompt.md`, authorizing research and evaluation design only. Read the complete prompt, current scientific and UI handoffs, repository instructions and current gate/logs. Inspected the repaired AC04 rather than restoring its historical wording. Recorded a 63-file starting preservation manifest and byte snapshots of these logs; HEAD remained 95a6a999c9a7e1cc862c970463c986f46772e008.

- Added `IGNIS_Runtime_AI_Selection_and_Cost_Decision.md`: a provisional Groq GPT-OSS 20B default, same-provider 120B quality alternative, paid Gemini 3.5 Flash-Lite comparison with backup integration deferred, optional economical/stronger OpenAI and Anthropic configurations, and a deferred local deployment. The fixed interpretation -> confirmation -> deterministic assessment -> template sequence and physical-model/runtime-LLM distinction remain intact.
- Checked current primary model cards, exact IDs, endpoints, schema/reasoning restrictions, token accounting, prices, quotas, billing/credits, supported regions, retention/training and model lifecycle policies. Screened DeepSeek, hosted Qwen, Mistral and Llama without adding more finalists. Current documents verify the previously questioned GPT-6.1 Sol/Gemini 3.5 Flash-Lite names, correct Groq 120B output to $0.60/M tokens, and document economical Luna/Haiku choices. API credits remain distinct from chat credentials. OpenAI's current enforced project limit replaces older soft-budget-only advice; enforcement delay remains relevant.
- Google documentation redirected to Markdown the web reader could not parse; unauthenticated direct HTTPS retrieval with normal TLS supplied primary captures. One guessed old Claude URL failed and its official replacement was used. The published Anthropic regions policy is effective November 12; its Pakistan listing is not treated as proof of pre-effective-date eligibility. No account, card acceptance, credit balance or user quota was inspected or assumed.
- Read-only local metadata established an RTX 3060 with 12,288 MiB VRAM, approximately 15.1 GiB system RAM, Ollama 0.21.0 and installed Qwen 3.5 Q4_K_M model metadata/manifest. CIM queries were denied; a read-only Windows memory call supplied the RAM observation. No local inference, downloads, driver change, cloud toggle or public exposure occurred. Memory/startup/power/latency scenarios are explicitly estimates, not performance measurements.
- Recomputed compact/ordinary/long token scenarios, 100/1,000/10,000-attempt totals, retry/usable denominators, $5/$10/$25 sensitivities, cache differences and conservative reservations. Proposed a finite 36-question development comparison, with separate tuning, repeated trials, critical-error gates and at most $2 of API consumption after explicit endpoint/data/cap approval. No API probe, credential access, model judge or local inference occurred; all performance results remain NOT RUN.
- Proposed a thin adapter and small UI/status/provenance changes only inside the new report. No app, UI, production adapter, integration harness, dependency installation, scientific-template change, source-record correction or evaluation replacement was made. Appended D-043/D-044 without changing older decisions. Existing dirty work, scientific/UI handoffs and gates were preserved. No external message, account creation, purchase, deployment, staging, commit or agent delegation occurred.

Applied the openai-docs skill for the OpenAI-specific audit. Public source captures, retrieval metadata/hashes, local metadata, isolated arithmetic and preservation checks are under gitignored `_raw/runtime_ai_2026-11-08/`. Direct public retrieval used automatic network approval; no access control or policy was changed. Final checks cover unchanged pre-existing files apart from append-only log entries, unchanged log prefixes/HEAD, report references/table structure and the cost arithmetic. These checks establish document integrity, not application correctness, independent validation or measured runtime-model quality. The next requested action is approval of the report's narrowly scoped comparison; research completion does not depend on supplying a secret.


## 8 November 2026 PKT: two-model authorization and local key setup guidance

The user authorized the research comparison only for Groq GPT-OSS 20B/120B at the exact chat/completions endpoint, with a shared USD $2 ceiling, at most 60 logical calls per model and 240 total attempts including probes/retries. Recorded the narrower scope before inference in the report and D-045; preserved the original split, tuning allowance, critical-error rules, input/output caps and unresolved-spend reservations. Other providers, local inference and application/build/deployment permissions remain excluded.

Rechecked the two public model prices, strict-schema support, GPT-OSS-specific reasoning controls, Groq key-setup guidance and Microsoft Windows secure-string encryption documentation. The API-reference web reader failed on this refresh; the earlier capture is retained and live exact-request compatibility remains NOT RUN. No authenticated API request was sent. Proposed a masked PowerShell prompt that stores only a Windows-encrypted key at a designated local path; `git check-ignore` verified the proposed path is ignored. The user must explicitly designate that credential and establish the existing funded/credited account before use. No credential source was searched, opened, printed or transmitted, and no key file or account was created.

An isolated local script recorded the authorization and preservation baseline and recalculated the two-model maximum: $0.545184 at the existing token caps, $0.6542208 with 20% margin. These are ceilings for the configured call allowance, not observed spend or targets. No application, integration harness or inference runner was implemented. Public packet finalization and actual execution remain pending; all interpretation/schema/latency results are NOT RUN. Existing scientific files, repaired AC04, historical evaluations and permission gates remain unchanged. No external communication, billing change, staging or commit occurred.


### Authorized Groq comparison: packet frozen before dispatch

The user's done reply designates the encrypted key source and confirms completion of the instructed existing-funded-account setup. The exact key was checked without display; DPAPI required the Windows user context. No unrelated credentials were searched. Created isolated, gitignored research preparation and bounded dispatch scripts, public questions/catalogue/schema and separate LOCAL_ONLY answer criteria under `_raw/runtime_ai_groq_comparison/`. These are one-off authorized research code, not a submission app or adapter. Reviewed all serialized public payloads, rechecked public source definitions and current Groq parameter/rate documentation, validated the schema locally and froze hashes before inference. Initial compatibility calls use A cases and consume the approved allowances. The shared $2/240-attempt/60-logical-per-model limits, conservative unknown-usage reservations and all existing build/reuse gates remain unchanged.


### Authorized Groq comparison completed

Completed 120 logical calls and 120 attempts: 60 per approved GPT-OSS model, including 12 A cases in each of two development passes and 24 distinct B/C cases plus 12 specified repeated trials. Initial A calls served as compatibility probes. Every call used the approved chat/completions endpoint, designated key and frozen reviewed public packet. No other inference provider, local model, private prose, answer key or personal/mailbox content was used as task data. No secret or hidden reasoning trace was displayed or exported.

- Actual strict-schema validity: 120/120, HTTP 200: 120/120, no retries, timeouts, truncations or provider refusals. Usage was reported for all attempts. The observed token/minute header was 8,000; research requests were paced before admission. Multiple returned serving fingerprints limit reproducibility claims.
- One permitted generic instruction clarification plus medium reasoning was evaluated on A for both models. G20's original low configuration was retained (6/12 versus 4/12 full success); G120 used revised medium (5/12 versus 4/12). Schema/catalogue/expected values stayed fixed; no B/C output informed tuning. A scoring-label bug was corrected before comparison, preserving expected values and full-success scores. One local launch before manifest completion stopped before dispatch and added no API attempts.
- Final distinct B/C full correctness: 13/24 G20, 9/24 G120. With repeats: 21/36 and 14/36. Automated critical-field failures: 5/36 and 4/36; annotation review found one additional G20 fabricated alternative ID (attempt 101, normalized_source_total), giving 6/36 and 4/36 critical calls. No independent reviewer or model-judge API was used. No human repair counted as automatic success.
- Median complete research-task latency was 4.089 s and 5.317 s; full network-response medians were 0.736 s and 2.191 s. Durable journaling/process/validation overhead is included in the former, so neither is presented as production UI latency or a pure provider comparison. All 36 comparison calls per model completed within 10 s.
- Reported totals: 225,188 input and 60,244 completion tokens, including 46,963 reasoning tokens counted once. Estimated standard uncached consumption is $0.05608425; accounting including 20% margin is $0.06730110. No unknown-usage reservation remains. Actual invoice/cash charge was not inspected. The $2 ceiling was respected; all 60 logical calls per model are used, so no extra tasks were sent to use unused funds.
- Added measured results to the runtime report, D-046 and B-11. Neither configuration is accepted for adoption. One-off preparation, dispatch, deterministic scoring and usage-summary scripts remain gitignored research artifacts. Exact requests, local answer keys, hashes, receipts and logs are retained; scientific records and repaired AC04 remain intact. Typed UI, app integration, public load/outage behavior and independent validation remain NOT RUN. No app build, deployment, publication, account creation, funding purchase, billing change, external message, staging, commit or delegation occurred.

The scientific/UI handoffs, historical evaluations and competition/preparation gates remain unchanged. Final preservation, reference, token/cost and protocol-count checks are stored in `_raw/runtime_ai_groq_comparison/final_checks.json`. These are integrity checks, not independent validation.


## 8 November 2026 PKT: offline interpreter failure audit and finite repair proposal

Executed the user's Interpreter Failure Audit prompt as an offline artifact review. Paused the pending Gemini setup/test direction; no new hosted/local inference, provider request, automated model judge, credential read/decryption, billing action or external communication occurred in this audit. Read current repository/scientific/UI contracts and the latest executed runtime results without repeating the combustion review or opening sealed human tasks.

Copied and hashed 286 sanitized study artifacts into `_raw/interpreter_failure_audit_2026-11-08/evidence/`. Matched all 120 logical/attempt records to saved requests, selections, receipts, schemas and scorer rows; independently recomputed the recorded arithmetic using the same historical keys (not independent scientific validation). Results remain G20 13/24 distinct and 21/36 with repeats; G120 9/24 and 14/36. Historical critical counts stay 6/36 and 4/36. Estimated consumption remains $0.05608425, invoice UNKNOWN. All transport/schema results and latency qualifications are preserved. Verified the critical-label correction preceded every B/C dispatch; no full-score change or post-test scorer manipulation was found.

Read all 26 distinct failed B/C outputs, repetitions, development responses and successful controls. Found actual lost scope, guessed heat, omitted questions and execution-to-proposal substitutions, alongside missing follow-up context, incomplete counterpart/capability conventions, mixed operation semantics and unconstrained alternatives. The all-output diagnostic guard identifies attempts 86 and 101 without altering historical scores. No retrospective adoption claim is made.

Created one focused report, `IGNIS_Interpreter_Failure_Audit_and_Repair.md`, and D-047. IR2 draft 1 separates intent/gaps from derived handling with typed alternatives; no production implementation was made. Added eight HAND-AUTHORED EXPECTED OUTPUTS (not model responses), 24 fresh assistant-authored questions/labels, a common prospective rubric, 60 prepared public request bodies and a frozen retest proposal. Same G20/low model in both arms; at most 84 logical calls/168 attempts; proposed NEW $0.35 cap. All new inference and provider schema compatibility are NOT RUN.

Logged new one-off offline research code in that gitignored namespace: `audit_offline.py`, `prepare_proposal.py`, `diagnose_and_check.py`, `finish_report.py`, plus the local final integrity check. The 79 passing checks cover schema, conditional/identifier rules, literal-field scoring and deterministic handling illustrations; they do not measure model quality or application behaviour. Shortened draft instructions during offline preparation to retain the original conservative input ceiling; largest prepared bound is 11,925, below 12,000. No answer keys enter prepared provider payloads.

The original study, runtime report, source data, T1?T4, repaired AC04, scientific/UI handoffs, frozen evaluations and application/preparation-reuse gates remain unchanged. Existing work is preserved; no staging, commit, deployment, publishing or delegation. Final hash, prefix, payload, link and diff results are recorded in the audit namespace. The next action is review of the new scoped approval block, not automatic inference from the old unused budget.

## 14 November 2026 PKT: event build, day 1 (application code begins)

The user's 14 Nov brief ("We are moving IGNIS from specification into implementation") authorized implementation within existing documented permissions, not an eligibility ruling. Work started about 17:05 PKT, inside the event window (14 Nov 09:00 PKT onward).

- **Sources:** new script `tools/acquire_event_sources.py` fetched 13 public sources plus the challenge statement (official API) into gitignored `_raw/event_2026-11-14/` with SHA-256. S-V, S-VI and S-CAL match their inherited expected hashes. The F02 DOI returned only a publisher redirect, and the PSI-69 page a JavaScript shell; both are recorded as not acquired.
- **Registry:** new registry `web/data/*.json` (catalogue `2026-11-14.r1`), written from passages located today by text extraction. S-CAL Table 2 was checked from a rendered page image (1280 kJ is under Oxygen Consumption Calorimetry, VI-3). All records are assistant-checked.
- **Application:** new Next.js/TypeScript application in `web/`: deterministic engine (T1, T2, T4 and descriptive totals contracts), ranking, revision difference, checksum-verified Markdown/JSON export, API routes, workspace UI, and an offline interpretation contract. No pre-event bespoke asset was copied in.
- **Tests:** validate, typecheck, lint, Vitest 56/56, build, and Playwright 7 passed / 1 skipped. Screenshot review found 5 UI or ranking defects; all fixed, with regression tests.
- **Environment:** `npm install` on E: (a USB flash drive) stalled. Installs and builds run in `F:\ignis extra\web-build`, mirrored from `web/`.
- **Not done:** no inference, account, purchase, deployment, publication, message or commit. Dated amendments are in `DOCS/IGNIS_MASTER_AMENDMENTS.md`; status is in `web/docs/BUILD_STATUS.md`.

### 14 Nov 2026, 18:40–19:30 PKT: SI selection research, adapters and the IE-1 harness
- **User decisions:**
  - D-050: pre-event research may be reused.
  - D-051: test OpenRouter, Gemini and Groq, cap $5; Team Owner in PKT.
- **Provider facts checked today** (`web/docs/MODEL_SELECTION.md` §2):
  - Anthropic pricing and the Pakistan listing (effective 12 Nov);
  - Gemini pricing, regions and structured output;
  - OpenRouter routing and structured outputs, plus its public model list (`_raw/ai_selection_2026-11-14/openrouter_models.json`, SHA-256 `03ba5504…`);
  - Groq strict-mode models.
- **New code:**
  - `web/src/core/wireProposal.ts`;
  - `web/src/server/providers/*`;
  - `web/scripts/eval-ie1.ts` and `web/scripts/ie1/score.ts`;
  - `web/eval/ie1/*`;
  - `web/tests/unit/providers.test.ts`.
- **New docs:** `web/docs/MODEL_SELECTION.md` and `web/docs/WIN_PLAN.md`.
- **Registry:** added `Q-FLAME-SPREAD-RATE` (definition only).
- **Verification:**
  - typecheck and lint pass; vitest **73/73** pass (17 new, mocked transport);
  - mock dry run of the runner OK.
- **Live probes** (dev questions only):
  - OpenRouter key: 401 "User not found";
  - Gemini key: 400 "API key not valid";
  - no Groq key.
  - **$0 spent; IE-1 not run.**

### 14 Nov 2026, 19:35–20:30 PKT: Competitive and improvement research
- **Competitor scan:** GitHub search found 133 "flame in freefall" repos, and 20 READMEs were read (`_raw/research_2026-11-14/`). Name collisions: IGNIS ×2 and "Emberfall".
- **PSI:**
  - The search API parameters (`term`/`type`/`from`/`size`) were found in the site bundle.
  - A fetch with them was **denied by the permission classifier** and not retried or worked around.
- **NTRS:**
  - 27 searches were logged.
  - 12 PDFs were acquired with SHA-256 (`_raw/ntrs_2026-11-14/`), and text was extracted to F:.
- **Moon-atmosphere quotes** were read from ICES-2026-324 pp.3–4.
- **Docs:** `web/docs/COMPETITIVE_RESEARCH_2026-11-14.md`, `web/docs/IMPROVEMENT_RESEARCH_2026-11-14.md`, and an update to WIN_PLAN.
- No registry change; no inference; $0.

## 15 Nov 2026, ≈00:30–01:30 PKT: competitor deep dive (research only)
- **Search and sampling:**
  - re-searched GitHub: 193 repos;
  - fetched the file trees of 38;
  - sparse-cloned the text files of 37 to `F:\ignis extra\competitors\`;
  - nothing was run.
- **Provenance:** `_raw/research_2026-11-15/`.
- **Write-up:** `web/docs/COMPETITOR_DEEP_DIVE_2026-11-15.md`, with correction notes appended to the two 14 Nov research docs and `WIN_PLAN.md`.
- **Scope:** no fetch from PSI. No code, data or text taken from competitors into IGNIS. $0 spent; no inference.

## 15 Nov 2026, research continuation after the Claude handoff

- **Instruction and team:** the user requested completion of competitor/interdisciplinary research and explicitly asked for a lab-style team. Three AI specialists plus the lead completed this pass. No independent human review is implied.
- **Baseline established in the preceding local review:** catalogue validation and 81/81 offline application tests passed; 53 source/data/test files matched between the E: source and F: tooling mirror. The older production build/browser results were not rerun for this research pass.
- **Public competitive evidence:** refreshed ten pinned repository heads/READMEs; acquired nine selected source/method files; three bounded searches returned 208 unique discovery results, not 208 verified entrants. No competitor code or product was executed. Public response hashes and timestamps are in `_raw/lab_completion_2026-11-15/competition/`.
- **Primary science:** completed selected NASA/NIST/publisher/institutional-source checks, including current SoFIE/RTDFS, centrifuge modelling, detector measurement chains, suppression endpoints and published transfer routes. Full-text failures and abstract-only access remain explicit. Existing first-pass lab notes remain unchanged.
- **New NASA data:** acquired the listed PSI-101 analyzed SAME/SAME-R workbook (4,061,669 bytes, SHA-256 `6d3a539ccf425b1fa8edc19cc75d828f57d650c7ce734d4e7aa686fea9593218`). ZIP/XML cell inspection reproduced the selected 2 V descriptive counts and found a one-key-per-side mismatch against the 109-row SAME-R CSV. No formulas or macros executed; no inferred alarm outcomes. New redirect logs omit temporary query strings.
- **Mathematics:** 766 synthetic finite subsets and 1,058 adaptive scalarizer checks passed; exact arithmetic and JavaScript reproduced the fixed-epsilon test counterexample. The existing application's nonfinite-target issue remains an implementation task. These are mathematical/development checks, not physical or comparative validation.
- **New research code only, under `_raw/lab_completion_2026-11-15/`:** competition `recheck.py`, `inspect_pinned.py`; physics `inspect_sources.py`, `check_report_and_manifest.py`; detection `fetch_primary.py`, `fetch_workbook.py`, `audit_tables.py`, `audit_workbook.py`; mathematics scripts enumerated in `math/artifact_manifest.json`; root `check_completion.py`. Scripts perform bounded public retrieval, source inspection, arithmetic or artifact checks, not application inference.
- **Documents:** new integrated synthesis, competitive update and three specialist completion notes. Replaced current `WIN_PLAN.md`/`BUILD_STATUS.md` while keeping exact earlier copies in `web/docs/history/`. Added a historical notice to the earlier competitive deep dive; reconciled README/CLAUDE/BLOCKERS status so resolved permissions are not reopened. D-056/D-057 record the decisions without expanding authority. Two coordinator clarifications in the physics note distinguish descriptive proximity from equivalence and retain the later flow-caption conflict; the pre-clarification report/manifest are archived and the current fingerprint is updated.
- **Verification:** final source-preservation, document-link, JSON, archive/hash and arithmetic-result checks are recorded in `_raw/lab_completion_2026-11-15/completion_check.json`; artifact fingerprints in `COMPLETION_MANIFEST.json`. No application source/data/tests, pre-event datasets, old acquisition logs, or frozen inference study were changed.
- **Not executed:** paid inference, new model selection, physical model replay, competitor runtime comparison, independent human validation, application integration, deployment, publication or external communication. The user-authorized event build continues from the concrete handoff; release remains on hold.

## Implementation and local review package - 15 November 2026, 05:32 PKT

- Continued the authorized event build after the specialist research handoff. Used the Sites skill for the existing local Next.js stack; no site registration, source upload or publication.
- Added the 24-profile atlas, seven Saffire condition cases/four cohorts, and 154 flight-marked SAME/SAME-R workbook rows (134 material plus 20 DBP reference). Curators retain source hashes, strings, units, missing/error cells and unresolved flow/identity conflicts. CSV counts are 2,009 nonblank and 861 blank records, not independent experiments.
- Added interactive Conditions and Smoke lab views, source inspectors, deterministic selected exports and read-only evidence API. Preserved the prior research brief, model-assessment, revision and export engine. Corrected acquisition statements and 981 s wording in registry 2026-11-15.r2; digest 37ad29b82a13f06d79d392ae21f99003dab36b2a421043f18b9ab0bf844242a2. Frozen questions, answer keys and old study results remain unchanged.
- Repaired frontier finite validation/decimal subtraction and evaluation accounting: OpenRouter route price ceilings, cumulative $5 ledger, durable reservations, failed/retried-call usage and interrupted-call holds. Archived six historical auth probes. Both Haiku and Gemini have used three probes; the previous one-probe Gemini claim was inaccurate. Recorded historical cost is $0, not invoice-verified. No new inference occurred.
- Final checks: catalog, typecheck, lint and production build PASS; 243 offline tests PASS; Chrome 17 PASS and one intentional duplicate SKIP. Ten visual states have zero page/console errors, invalid SVG coordinates or whole-page overflow. Browser review found and fixed SVG-title hydration and test-selector ambiguity; a regression test covers the real initial-load defect. Final disclosure lint fixed a JSX apostrophe. All checks are assistant-performed.
- Created the seven-slide HTML and seven-page 16:9 PDF, inspected every page, and fixed an unintended axis fill. Added submission copy, judge rehearsal, source/AI/pre-event disclosure, reproduction instructions, screenshots, launcher and local allowlisted review bundle with hashes. Excludes credentials, raw publisher PDFs/workbooks, private evaluation keys/ledger, node_modules and .next. Original-code license remains undecided; this is not a public release.
- Latest user reply: "no funded account for now". Current live semantic comparison is NOT RUN; interpretation stays disabled. No account creation, credit purchase, credential search, local inference, external messages, deployment or portal submission. Existing deployment hold and owner release decisions remain.
- Current entry points: web/README.md, web/docs/BUILD_STATUS.md, web/docs/LOCAL_VERIFICATION_2026-11-15.md and web/docs/RESEARCH_REUSE.md. Independent review, comparative human study, external predictive validation and NASA adoption are not established.

## 15 November 2026: deep competitive comparison after the local build

- The user asked for a deep comparison against competitors. Continued the explicitly requested specialist research team: three AI specialists and the lead; no independent human review is implied. The user-requested local application remained running on 127.0.0.1:3000.
- Three fresh public GitHub queries returned 243 unique discovery repositories. The exact challenge-phrase query returned 178 records across two pages; a broader query was capped. These are not 243 verified entrants. Refreshed 22 repository heads and inspected selected source/evaluation artifacts in 17 relevant repositories, including newly examined FlameBound, MicroFire Atlas, Flamefall, MORS AEGIS, IGNIS LAB and Kenyalang Blue Flame.
- Acquired pinned public source through verified-TLS anonymous GETs, with timestamps, status, byte counts and hashes. Source reviews distinguish method choices, disclosed limitations, source/data counterexamples and unexecuted runtime behavior. The product audit preserves and repairs a concurrent-log anomaly through three identical pinned reacquisitions; it does not invent the missing original timestamps.
- Recounted published evaluation artifacts with our own standard-library code. Flamefall's saved grouped/fuel-holdout results and split membership are substantive; StarryNight, the other Emberfall, Entropy, Atlas and PYRION measure different tasks. No combined accuracy league table, model superiority or independent validation is claimed. Existing frozen IE-1 questions, scoring, task split and accounting gates remain unchanged.
- Public frontend rendering inspected FlameBound, MicroFire Atlas and Flamefall at HTTP 200; FIRE-X returned HTTP 503 once. Browser requests were limited to GET/HEAD and AI routes were blocked. A second Flamefall capture waited for animated counters to settle. Other specialist GET observations and their narrower scope are in the reports. No competitor backend or predictive model was installed or rerun, and no AI question was submitted.
- Fresh IGNIS health/catalog/condition/detector GETs returned 200, registry r2, zero registry errors and AI disabled. The current implementation has separate selected-analysis exports and preset brief callbacks; it lacks full selection handoff and save/reopen/recheck. VESTA/MORS/FlameBound demonstrate stronger portable workflow features. MARGIN already has all seven revised 2026 Saffire cases, so that addition is not unique to IGNIS.
- Saved `web/docs/COMPETITIVE_COMPARISON_AFTER_BUILD_2026-11-15.md` and four specialist reports numbered 07–10 under `web/docs/lab/`. Linked the comparison from README/status/plan. Updated current key-preparation context: the user is preparing Groq/Gemini keys, but no new local credential path or funded/credited status is verified. No credential was inspected.
- New research scripts are confined to `_raw/competitive_deep_2026-11-15/`: root `discover.py`, `inspect_new.py`, `fetch_selected.py`, `view_public.mjs`, `capture_settled.mjs`, `inspect_artifacts.py`, `check_report.py`; specialist scripts and exact inventories are recorded in their reports/manifests. The local-link check passed for all five reports; the final manifest fingerprints the research artifacts and reports.
- No application source/data/tests, frozen evaluations, review PDF/ZIP, account/billing state or public deployment changed. New inference, a common blinded benchmark, independent review, public release, external contact and NASA adoption remain NOT RUN or unestablished. The recommended next work is exact selected-evidence handoff, reproducible session recheck, the existing bounded interpreter evaluation and a fair task comparison.

## 15 November 2026: professional-tool research and researcher workflow patch

- Continued the user's explicitly requested specialist research team to inspect professional fire tools, primary datasets and ML readiness. Three reports (lab/11 through lab/13) and the synthesis `web/docs/PROFESSIONAL_RESEARCH_AND_IMPROVEMENTS_2026-11-15.md` retain primary references, exact files, hashes and limitations. No independent human review is implied.
- Documented actual NASA-associated Saffire FDS/PyroSim use and forcing/calibration/baseline/comparison roles. CFAST and Cantera were studied as relevant specialist tools; no NASA operational-use claim was inferred for them. No simulator was installed or executed.
- Verified eight selected source assets totaling 13,044,966 bytes, including SAME-R lineage/TEM materials, NIST ground alarm reference trials and Saffire-I telemetry with separate clocks. Files were not pooled or automatically admitted as model-validation observations. The local FLEX audit found 274 rows with distinct Extinction/Disruption/Completion labels; new physical-model fitting was deferred pending target, unit, lineage and validation contracts.
- Implemented `pairedDetector.ts` and its browser view: source-row pairing, joint and marginal denominators, flight/material strata, missingness completion bounds, explicit exclusions and literal recorded-status sensitivity. At default AW/AV cutoffs of 2 V each: 133 jointly finite of 134 nonreference rows; pooled difference +70/133, flight 1 −6/25, flight 2 +76/108. The literal-n fan filter excludes 109 unrecorded flight-2 rows. These are descriptive selection/operator findings, not alarms, causal effects or detector rankings.
- Connected exact condition/single-channel/paired selections to immutable assessment views and matching exports. Added bounded recipe/receipt download, manual local browser save, import and source/method/result recheck. Original result bytes require separate assessment JSON. Rechecks do not authenticate an author or independently validate science. Protected session loading from late assessment replies and bound IDs to full confirmed requests and selected source/method/result identities.
- Added Data & methods with professional-role explanations and four source opportunities. Preserved the core scientific registry r2 and its digest, frozen IE-1 packet/scoring/counters and runtime-disabled state. New build web-2026-11-15.3; engine-2026-11-15.3; renderer-2026-11-15.2.
- Final verification: 280 offline tests across 11 files; 27 Chrome tests passed with one intentional duplicate skipped; catalogue/type/lint/build checks passed. The initial mobile test run detected a real 33-pixel navigation overflow; the correction passed the full browser rerun. Six new desktop/mobile workflow states show no page/console errors or horizontal overflow. Initial failures and final JSON results are retained.
- Updated the seven-slide briefing, researcher/owner handoff and local review ZIP; checked seven PDF pages at 1152×648 points and reviewed the rendered pages. Original presentation/review snapshots are preserved. The new allowlisted bundle excludes credentials, raw publications/workbooks, private documents, frozen answer keys and live ledgers; it is LOCAL_REVIEW_ONLY_NOT_PUBLISHED.
- Left the user-requested local production UI running at http://127.0.0.1:3000. No credential search/inspection, paid inference, account/billing action, outreach, deployment, portal submission or license decision occurred. Scientific validation, fair competitor task performance, a win and NASA adoption remain unestablished.

## 15 November 2026: second competitor audit and exact cutoff-range patch

- Responded to the user's renewed request to compare broadly/deeply and then improve the site. Continued the explicitly requested specialist team. Expanded all returned pages for three public GitHub discovery queries; merged earlier/web discoveries and separately surfaced FLARE-X. The coverage CSV/JSON contains 282 repositories, 244 acquired READMEs, 247 candidates and 37 focused pinned source reviews. All 246 bulk candidates received a bounded archive probe; FLARE-X was reviewed through pinned raw files. Large/inaccessible captures and shallow review levels remain explicit; no exhaustive entrant/private-source claim.
- Added lab reports14–17 and `web/docs/COMPETITOR_REAUDIT_AND_CUTOFF_PATCH_2026-11-15.md`, with stronger competitors, stale-cache corrections, actual evaluation limitations and specific remaining IGNIS gaps. New root research scripts in `_raw/competitive_round2_2026-11-15/`: discovery.py, expand_discovery.py, source_inventory.py, complete_bounded_probe.py and coverage.py. Specialist manifests enumerate their capture/recount/ledger/verification scripts; physics also includes target_regions.py. No competitor code or models executed.
- Implemented `cutoffEnvelope.ts`: exact monotone corner extrema over independent closed cutoff ranges, integer numerators/denominators, equality-aware profiles, flight/material strata, missing completions and source witnesses. Default [1,3] V pooled envelope [66,78]/133; Flight1 [-6,-3]/25; Flight2 [72,81]/108. Wider [0,5] permits pooled [-51,133]/133. These are descriptive operator/cohort findings, not calibrated uncertainty or detector/physical predictions.
- Added cutoff UI, paired-cohort handoff, guided start, source/method explanation, immutable brief/export/session integration and scenario links for all four source analyses. Links validate/recompute before view mutation, detect drift, preserve draft/history and disclose exclusion-note inclusion. Existing raw research data, registry r2 and frozen IE-1 remain unchanged.
- New full-workflow test found a real oversized-parent revision failure. Bounded local assessment-body allowance changed from1MiB to2MiB; provider/interpreter/token/spend/probe/retry limits remain unchanged. Corrected a Zod type adapter and browser/capture-selector ambiguity; preserved initial failure artifacts. Final results:308offline tests/13files,35browser passes/one duplicate skip, eight affected responsive reruns, catalogue/type/lint/build PASS. Twelve final captures have zero exceptions/console errors/whole-page overflow, with exact plots and controls visually reviewed.
- Build web-2026-11-15.4; engine-2026-11-15.4; renderer-2026-11-15.3; descriptive method .2. E: source remains authoritative; twenty changed source/test files matched the F: installed-tooling mirror. New local review bundle excludes raw competitor/publication archives, credentials, private documents and frozen answer keys. Prior briefing/PDF and review ZIPs remain dated snapshots.
- Local preview remains running at http://127.0.0.1:3000. No inference, key search, billing/account change, external contact, deployment, submission or owner license decision. Common blinded comparison, independent scientific review, predictive validation, a win and NASA adoption remain NOT RUN or unestablished.
- Local verification/handoff helpers for this patch: `sync_build.py`, `build/capture.mjs`, `build/package_review.py` and `build/final_checks.py`, under the same round-two raw directory. The first plot-capture attempt used an overly exact accessible-name locator and timed out; the corrected capture completed all twelve states. This did not reveal an application runtime error.


## 15 November 2026: competitor refresh and adversarial codebase repair

- Reused the user-requested specialist team. Refreshed all 37 focused public heads at 08:38 UTC: 18 changed, 19 unchanged. Captured 134 bounded public responses using 45 GitHub API calls, retained two404s and PYRION's300-file limit. Corrected stale Fire Readiness/PYRA descriptions and documented VESTA's stronger historical snapshot; no competitor code or inference executed. Reports18–20 and the main audit report preserve precise scope.
- Reproduced in-process source aliasing, unknown-equality compatibility, first-number arithmetic, successful-looking unavailable computation, incomplete source closure, unsupported/partial request scope and hidden revision qualification changes. Fixed these in registry/assessment/detector/predicate/arithmetic/handling/revision modules; introduced source arithmetic ops-2. Curated source files and frozen IE-1 fixtures were not edited.
- Fixed three asynchronous notebook/interpretation races and exposed full revision wording through keyboard-accessible disclosures. Repaired parent schema/ancestry admission, save-time complete notebook ancestry, streamed UTF-8 request bounds, origin checks and prototype-key canonicalization. Added scientificIsolation/httpBoundaries/notebook-races/source-identity regression files; adjusted generic mocked-wire expectation for intentionally unsupported numeric conditions.
- The production build caught50 bundled detector values differing from preserved numeric cache strings; safe snippets, hashes and binary64 witnesses were retained before rebuild. Both dev/build scripts now select supported webpack. Strict exact guards remain; all154 detector records, conditions/atlas bodies, catalogue identity and browser cutoff source/result identities match offline values.
- Final verification:341/341offline tests in15files, TypeScript, lint, unchanged r2 catalogue and production build PASS;49Chrome checks PASS/one duplicate SKIP;22affected notebook checks PASS after screenshot-driven table spacing/scroll accessibility repair. Eight final UI states have zero page/console errors and whole-page overflow. E:/F: application files are hash-matched;17curated files unchanged.
- Added bounded local helpers under _raw/codebase_audit_2026-11-15/: root_before.ts, sync_root.py, sync_final.py, capture.mjs, update_docs.py, package_review.py and final_checks.py; specialist capture/delta/finalize/reproduction scripts are inventoried with their reports. Failed checks remain retained. Refreshed current handoff and prepared a local audit-patch ZIP/manifest; earlier bundles/briefing remain dated snapshots.
- No runtime acceptance, provider call, credential/billing change, new model fitting, independent human validation, public deployment, external message or competition submission occurred. Local preview remains on127.0.0.1:3000; existing release/evaluation/reuse gates remain.


## 15 November 2026: prepare the authorized GitHub team handoff

- User explicitly requested pushing to GA5413L/IGNIS for teammates, followed by a competitor comparison. The remote initially contained only README.md at 1c7f8d4; its history is to be preserved alongside the existing local research commits, with no force-push.
- Added CONTRIBUTING.md, the portable test:team command, stronger Git exclusions and current source-sharing scope. The app and curated scientific values are unchanged. Raw downloads, DOCS source PDFs, credentials, private evaluation files and local ZIPs remain local. Website deployment and live inference remain gated.
- Pre-push inspection and verification records live in _raw/team_handoff_2026-11-15/. No secrets are printed by the content checks; findings report only paths and categories. Contributor tests and the production build are verified against a staged clean tree before the actual push.
