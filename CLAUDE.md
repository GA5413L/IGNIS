# CLAUDE.md: working rules for this repository

## Operating mode
- **Pre-event research mode is the default.** Do not build the submission application, UI, dashboard, or demo assets before 14 Nov 2026 09:00 local time, unless the user gives an explicit instruction **and** a written organizer ruling permits it (see `planning/competition_rules.md`, U1/U2). Don't infer authorization from the brief's existence.
- Pre-event work allowed: reading and verifying public sources, transcribing and checking records, writing research notes, and planning. Log any new code in `CHRONOLOGY.md`.
- Don't contact organizers, authors or NASA, and don't register accounts. Propose these to the user (D-013).

## Scientific rules (non-negotiable)
- Similarity ≠ comparability. Every comparison needs a confirmed endpoint ID (`research/endpoint_dictionary.md`), configuration, and intended use.
- Data files under `research/data/` are **as printed**: never correct, normalise or gap-fill them. Interpretation goes in notes; conflicts go in `research/source_conflicts.md` with exact locations.
- Unknown stays unknown: pressure is not reported for the rod data. Don't default it.
- No label-only joins across sources (C-14). Independence group = NASA physical sample number (D-009).
- B16/B19 are quarantined (C-03). Table S1 right-half rows are conditional (C-02).
- "Test ended" ≠ "flame extinguished". A Table S2 "-" is undefined, not zero.
- No predictions, confidence percentages, safe/unsafe labels, or causal claims from within-burn differences.
- Never fabricate numbers. Never digitise figures as data.

## Conventions
- Retrieval: `tools/fetch.ps1 -Url … -Slug … -FileName …` (logs time, status, size and SHA-256 to `_raw/fetch_log.tsv`). WebFetch fails TLS here, so use the script.
- Python: run with `py -3 -I` (isolated mode). Scripts read `research/data/` and take PDF paths as arguments.
- After changing any transcription, run `research/analysis/verify_transcriptions.py` (expect 6/6 PASS) and re-run `crosswalk.py` and `evidence_case_02.py`.
- Record source locators as PDF page / printed page for NASA TM-20210011385 (printed = PDF − 8 in the appendix and Ch. 2–4).
- New decisions go in `DECISIONS.md`; blockers in `BLOCKERS.md`.
- Commit messages: imperative, describing the research change.
