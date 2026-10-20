# Blockers

| ID | Blocker | Exact evidence | Impact | Next action (owner) |
|---|---|---|---|---|
| B-01 | **Ruling needed on pre-event research** (U1/U2 in `planning/competition_rules.md`) | rules say "not allowed to begin working on the challenges prior to the hackathon"; "working" is undefined | decides whether this repo's notes and transcriptions can be used at the event or must be re-derived | **User**: ask the Local Lead or the GO team (Contact Us; Space Apps Connect opens 3 Nov). Record the answer verbatim with its date |
| B-02 | Official challenge statement not yet released | challenge page `resourcesTabContent` empty on 2026-10-20; FAQ: statements on 28 Oct | the target may shift (e.g. required data sources, "ranking") | re-read on 28 Oct; update `scientific_scope.md` (user or next session) |
| B-03 | **NASA PSI BASS-II (PSI-25) data need sign-in** | `/geode-py/ws/studies/PSI-25` → 403 "read-protected" (PSI-26 also 403) | no raw video or overlay data, so C-02, C-03, C-12 and C-23 can't be checked against primary records | **User**: register a PSI account; then a session can inventory PSI-25 files and their licence |
| B-04 | Rivera et al. 2026 (FSJ 162:104719) full text inaccessible | ScienceDirect 403 | the newest in-scope rod study is unread; it may add data or settle conflicts | **User**: library access, or ask the authors for an accepted manuscript |
| B-05 | Source conflicts that only authors or NASA can settle | C-02 (unit label), C-03 (P16/P19 configuration), C-15 (B22) | the headline series stays quarantined; right-half absolute values stay conditional | **User**: decide whether to email the corresponding author or NASA GRC; log replies |
| B-06 | ESM licence not stated in the file | ESM PDF has no licence text | redistribution of the ESM PDF is not cleared (numeric facts with citation are fine) | check Springer Nature's ESM policy before shipping any ESM content |
| B-07 | No independent human review of the transcriptions or crosswalk | all done by one assistant | residual risk in merged-cell spans and the crosswalk hypotheses | **Teammate**: check S1/S2 spans against the PDF images (~20 min); review the crosswalk flags |
| B-08 | (tooling) WebFetch fails TLS validation in this environment | "unable to get local issuer certificate" on all sites | none (worked around with curl.exe) | — |
| B-09 | (low) PMC supplement link returns HTML, not the PDF | 1 817 B HTML response | none (publisher copy used) | — |

## Resolved
| ID | Was | Resolved | How |
|---|---|---|---|
| R-01 | "Tables S1/S2 could not be obtained" (Evidence Case 01 packet, 15 Oct) | 2026-10-20 | downloaded from the Springer ESM URL linked on the article page (SHA-256 `e17c9511…1b23`) |
| R-02 | "Original PDF table image [Table 2.1] was not successfully inspected" | 2026-10-20 | official NTRS PDF p.36 rendered and read; values identical |
| R-03 | "B16 cross-source label collision … not visually audited" | 2026-10-20 | confirmed from the NTRS text layer: Table A.1 B16 = 100-µm PMMA film (C-14) |
