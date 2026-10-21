# IGNIS human review packet

**Prepared 22 Oct 2026 (local) by an AI assistant for a human reviewer. No human review has taken place yet.** Nothing in this packet records or implies one.

## Why this packet exists
- Every transcription, record link and conclusion in this project was produced and re-checked by AI assistants (Claude, via Claude Code). That is **not** independent verification.
- This packet lets a scientifically literate person check the work **from the original sources**, without first seeing our answers.
- The reviewer needs **no** access to our chat history. They need the two public documents below, this folder and, for step A2, the CSV files in `research/data/`.
- The packet supersedes `planning/human_review_checklist.md` and `planning/independent_reviewer_instructions.md` (D-028). Both anchored the reviewer:
  - the checklist printed our expected values next to each instruction;
  - the instructions had our CSV read alongside the PDF.

## Three activities, kept separate
| Activity | File | Who | Time | Sees our claims? |
|---|---|---|---|---|
| **A. Source transcription check** | `A_source_reading.md` | reviewer 1 | ≈ 75 min | **No** in A1 (blind reading of the PDFs). Yes in A2, after A1 is written down |
| **B. Scientific interpretation check** | `B_interpretation_check.md` | reviewer 1, after A | ≈ 60 min | yes; the claims are stated so they can be tested |
| **C. Held-out evaluation tasks** | `C_task_author_brief.md` | **a different person** (or reviewer 1 **before** starting A) | ≈ 45 min | **No, never** |

All of them return `review_form.md` (one copy per person).

## Blinding rules
1. **Do C first, or give it to someone else.** The task author receives **only** `C_task_author_brief.md` and the two source documents. Don't send them the repository, this README's other files or any project notes.
2. In A, write down what the PDFs show (A1) **before** opening any CSV or project note.
3. In B, form your own view from the pages cited **before** reading the project file named at the end of each item.
4. Don't show any of this to an AI assistant while reviewing, and don't ask one to do the check. If you used one for anything (e.g. zooming or OCR), say so on the form.
5. "Not checked" is an acceptable answer. Guesses are not.

## The source documents (not included here)
The packet contains **no PDFs**. Download them yourself and check the SHA-256 (PowerShell `Get-FileHash <file>`, macOS/Linux `shasum -a 256 <file>`). If a hash differs, write the new hash on the form and continue; page numbers may then differ.

| Short name | Document | Where to get it | SHA-256 (as downloaded 20 Oct 2026) | Rights |
|---|---|---|---|---|
| **[L18]** | Link S., Huang X., Fernandez-Pello C., Olson S., Ferkul P. "The Effect of Gravity on Flame Spread over PMMA Cylinders." *Sci. Rep.* **8**, 120 (2018). DOI 10.1038/s41598-017-18398-4 | https://www.nature.com/articles/s41598-017-18398-4.pdf (9 pages) | `dce00fad61256396e348cf3b979e8f977e690fdbc46e7c3f9b84c0328d678584` | CC BY 4.0 |
| **[ESM]** | Supplementary Information of [L18] (Tables S1, S2; 4 pages) | the "Supplementary information" link on https://doi.org/10.1038/s41598-017-18398-4, or directly https://media.springernature.com/original/springer-static/esm/art%3A10.1038%2Fs41598-017-18398-4/MediaObjects/41598_2017_18398_MOESM1_ESM.pdf | `e17c9511c4b4b253cd0795b3984ffb9347ad5db6354c4ce792adcaf805f21b23` | licence not stated in the file. **Don't redistribute the PDF**; get it from the publisher |
| **[TM]** | Olson S.L., Ferkul P.V., et al. *Burning and Suppression of Solids–II (BASS–II) Summary Report.* NASA/TM-20210011385 (2021) | https://ntrs.nasa.gov/citations/20210011385 (PDF: https://ntrs.nasa.gov/api/citations/20210011385/downloads/TM-20210011385.pdf; 144 pages, ≈ 49 MB) | `5ffa911fd9b6356f204646003fb9342e341810dcdfdf5cb15756e7f01ec5f770` | NTRS: "GOV_PERMITTED"; link to NTRS rather than redistributing |

**Page numbers** are PDF pages. For [TM] the printed page number is also given, as "PDF / printed". In the appendix, printed = PDF − 8.

| Location | What is there |
|---|---|
| [ESM] p.1 | Table S1: microgravity (ISS) flame spread rates, PMMA rods |
| [ESM] p.2 | Table S2: normal-gravity (1 g) flame spread rates, PMMA rods |
| [L18] pp.3–7 | methods; text statements on flame limits; Figs 6 and 8 |
| [TM] p.14 / 6 | sensor readings and the sealed work volume |
| [TM] p.58 / 50 | Chapter 4 statements on oxygen limits for rods |
| [TM] pp.114–115 / 106–107 | Table A.3, "Fernandez-Pello Test Matrix": NASA's as-run log for the rod tests |

## What to hand back
- One `review_form.md` per person, saved as `planning/reviewer_log_<initials>_<YYYY-MM-DD>.md`, or sent to the team as a file.
- The task author (C) returns **only** the SHA-256 of their sealed task file, never the tasks.
- **Never edit** anything in `research/data/`. Disagreements go on the form.

## For the team: timing
The organizer ruling on pre-event work (blocker B-01, `planning/organizer_clarification_email.md`) may decide whether these transcriptions can be reused at the event. A review of A and B still checks the scientific case, which applies to any re-transcription of the same tables. Whether to start before the reply is **your** decision. If you send Email A with its final paragraph unchanged, wait for the reply first.
