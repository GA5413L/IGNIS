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

## Reused third-party resources
- Python 3.14.0 with pre-installed PyMuPDF (fitz), BeautifulSoup4 and requests; Windows `curl.exe`. No third-party code was copied into this repository.
- Data: see `manifests/data_sources.csv` and `manifests/rights_and_attribution.csv`.

## SI (AI) usage, for the mandatory submission statement
An AI assistant (Claude, via Claude Code) carried out the source retrieval, transcription, verification
scripting, cross-source analysis and the writing of these notes, following the user's written brief. Every number
in `research/data/` is checked mechanically against the publisher or NASA PDF text layer. **No human has yet
independently reviewed them** (B-07).
