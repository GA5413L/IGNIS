# IGNIS: pre-event research repository

**IGNIS** (Intelligent Graph for NASA In-Space Safety) is a planned evidence workbench for NASA microgravity
fire-safety data, targeting the NASA Space Apps Challenge 2026 challenge *"Flame in Freefall"*. It is **not**
affiliated with or endorsed by NASA.

> **Status (20 Oct 2026): pre-event research only.** Space Apps rules say participants should not begin working on
> their project before **14 Nov 2026, 09:00 local time**. This repository contains research notes, verified source
> transcriptions and a plan. It contains **no application**. See `planning/competition_rules.md` for what is
> confirmed and what is awaiting an organizer ruling.

## The central principle
**Similarity is not scientific comparability.** Two results about "PMMA flame spread" or "extinction" may measure
different things, under different protocols, on different specimens, or even the same specimen burned twice.

## What we found (details in `research/session_report_2026-10-20.md`)
- The ISS PMMA-rod flame-spread data (Link et al. 2018, Tables S1/S2) **are available** and are transcribed here with a mechanical check against the publisher PDF.
- All 19 sample labels map to **NASA's BASS-II as-run test log** (NASA/TM-20210011385, Table A.3), with specimen IDs and burn order.
- **Positive result:** in NASA burn P4 (black PMMA rod, 9.525 mm, 18.5 % O₂), spread rate 32.5 → 26.9 µm/s as opposed flow went 2.00 → 1.73 cm/s (descriptive, within one burn).
- **Open conflict, kept in quarantine:** NASA's appendix log lists the paper's headline series (B16/B19) as **"Concurrent"**. The article, NASA's own Chapter 4 and the published photographs present them as opposed. The adversarial audit (second 20 Oct session) classifies this as a genuine unresolved conflict with the evidence favouring opposed (`research/b16_b19_discrepancy_review.md`). It is **not** a headline finding.
- **Specimen identity can change a fire-safety reading.** Link's tables record μg flame spread at ≥ 1 O₂ point below any recorded 1 g spread for 0.95- and 0.64-cm rods. For 1.27-cm rods, the only such record comes from a reburned specimen (`research/adversarial_source_audit.md` §5).
- A spreadsheet reproduces all the arithmetic. The contribution so far is **curation and conflict detection**, not algorithms. A public competitor (MicroFire Atlas) already does page-level provenance and reused-sample flags for other BASS-II materials (`research/prior_art_comparison.md`).

**Audit status (20 Oct, second session):** see `research/adversarial_source_audit.md` for which earlier findings
survived (PASS), were qualified, or failed. Still **no independent human review** (B-07).

## Layout
| Path | Contents |
|---|---|
| `research/evidence_case_02.md` | **primary rod case**: question, rules, admitted result, negative cases |
| `research/evidence_case_01.md` | auxiliary thin-sheet critical-velocity case (re-verified) |
| `research/source_conflicts.md` | 25 conflicts with exact locations and treatments |
| `research/adversarial_source_audit.md` | second-session audit: approval decisions, surviving/failed findings |
| `research/b16_b19_discrepancy_review.md`, `research/p4_independent_recheck.md`, `research/prior_art_comparison.md` | focused audit reviews |
| `planning/competition_readiness.md`, `planning/evaluation_audit.md`, `planning/independent_reviewer_instructions.md` | rules status, strategy, evaluation audit, reviewer brief |
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
