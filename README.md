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
- **Consequential limitation:** the paper's headline microgravity series (B16/B19) are recorded as **"Concurrent"** in NASA's test log, so they are quarantined.
- A spreadsheet reproduces all the arithmetic. The contribution so far is **curation and conflict detection**, not algorithms.

## Layout
| Path | Contents |
|---|---|
| `research/evidence_case_02.md` | **primary rod case**: question, rules, admitted result, negative cases |
| `research/evidence_case_01.md` | auxiliary thin-sheet critical-velocity case (re-verified) |
| `research/source_conflicts.md` | 23 conflicts with exact locations and treatments |
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
