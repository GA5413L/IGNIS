# Data access audit

**Priority question:** *Can we retrieve and verify the original PMMA-cylinder test records and their measured
flame-spread rates?*

**Answer (20 Oct 2026):** **Partly yes.**
- Recovered from the publisher and transcription-checked: the **processed** per-segment spread rates (Link et al.
  2018 Tables S1 and S2).
- Recovered from NTRS: NASA's **as-run test matrix** for the same ISS tests (TM-20210011385 Table A.3), which
  allows a candidate crosswalk.
- **Not** recovered: the **raw** records (video, image sequences, overlay telemetry) or any position-time data
  behind the rates. NASA PSI requires sign-in.

All attempts are logged with UTC time, HTTP status, byte count and SHA-256 in `_raw/fetch_log.tsv` (local, not
committed); the durable subset is in `manifests/data_sources.csv`. WebFetch failed on every site with "unable to
get local issuer certificate", so all retrieval used `curl.exe` (Windows certificate store) via
`tools/fetch.ps1`.

## Attempts and outcomes

| # | Target | Route | Outcome | Notes |
|---|---|---|---|---|
| 1 | Link 2018 article | nature.com HTML + PDF | **200**, read in full | CC BY 4.0 (stated on the page). No correction notice found on the landing page; that is not an exhaustive erratum search |
| 2 | Link 2018 Supplementary Information (Tables S1, S2, Figs S1–S3) | Springer static ESM URL linked from the article | **200**, 645 055 B PDF, 4 pages; SHA-256 `e17c9511…1b23` | The 15 Oct packet had recorded this as unobtainable. It was obtained directly today |
| 3 | Same ESM via PubMed Central (PMC5760683) | PMC article page → `/articles/instance/5760683/bin/…MOESM1_ESM.pdf` | article page **200**; supplement link returned a **1 817 B HTML page**, not a PDF | Probably a bot-check interstitial. Not retried (no looping). The publisher copy is the version of record |
| 4 | NASA BASS-II summary report TM-20210011385 | NTRS API citation + download | **200**, 48 972 416 B PDF, 144 pages; SHA-256 `5ffa911f…f770` | Read: §2.2 (Table 2.1), Ch. 4 (rod opposed-flow task), Appendix A (Tables A.1, A.3, A.5 parts). NTRS copyright determination `GOV_PERMITTED` |
| 5 | NASA PSI BASS-II (PSI-25) | landing page `psi.nasa.gov/physci/repo/data/investigations/PSI-25` | **200** but only a 954 B Angular shell | Content loads via `/geode-py/ws/…` |
| 6 | PSI study record | `/geode-py/ws/studies/PSI-25` | **403** "read-protected" | Also **403** for PSI-26 (BASS-I), so this is general access control, not PSI-25-specific |
| 7 | PSI search | `/geode-py/ws/repo/search?q=…` | **200**, but byte-identical results (same SHA-256) for q = BASS, BASS-II, PSI-25, "Burning and Suppression" | The query was ignored. "Not found in search" means nothing. The default list did include PSI-26 "BASS", which names PSI-25 as a related investigation |
| 8 | Other PSI paths `/geode-py/ws/repo/PSI-25`, `/investigations/PSI-25` | — | **404** | — |
| 9 | Rivera et al. 2026, Fire Safety J. 162:104719 ("Opposed flame spread limit over PMMA rods in normal and micro gravity") | Crossref metadata; ScienceDirect | metadata **200**; ScienceDirect **403** (twice; the first PII tried, S0379711226000536, was our wrong guess; correct PII S0379711226000871 also 403) | Directly in scope, but full text and any data not accessed. NTRS search found a related accepted-manuscript record (Liveretou et al., PROCI, doi 10.1016/j.proci.2024.105224) with **no downloadable file** |
| 10 | Other priority DOIs (PROCI 2024 thin sheets; SoFIE-GEL 2025; FLARE 2026; partial-g PMMA 2024; Bhattacharjee 2016) | Crossref | **200** for all; identity confirmed (`source_register.md`) | Elsevier full text not attempted beyond metadata (subscription; no rights to redistribute) |
| 11 | NTRS searches for rod flame-spread reports | NTRS API | 0 hits for `"opposed flame spread" PMMA rods`; 3 hits for `PMMA rod flame spread microgravity` (blow-off and outreach items, not rod opposed-spread data) | NTRS full-text search coverage is unknown. Absence of hits is **not** evidence of absence |
| 12 | Competition pages | spaceappschallenge.org HTML + public GraphQL used by the site | **200** | See `planning/competition_rules.md` |

## What the recovered records contain (variables actually available)

| Variable | Table S1 (μg) | Table S2 (1 g) | NASA Table A.3 (μg) |
|---|---|---|---|
| Material grade/colour | prefix B/C (P undefined) | "black PMMA" (caption) | "black rod" / "clear rod" / unstated |
| Diameter | cm, 2 dp (0.64/0.95/1.27) | cm (0.32/0.64/0.95/1.27) | mm (6.35/9.525/12.7) |
| Length | — (article: 57.2 mm) | — | — (report text: 57.15 mm) |
| O₂ | one value per sample (= cal. initial) | per row | calibrated initial and final; uncalibrated initial and final |
| Pressure | **absent** | **absent** | absent in A.3 (CO₂ and CO present) |
| Forced-flow velocity | V_g cm/s per row | V_g 25 or 2 cm/s | fan and air display sequences (pot settings), not per-segment values |
| Flow direction | opposed (article text) | opposed (article text) | Opposed / **Concurrent**, in the column headed "Sample distance" |
| Spread rate | V_f×10³, cm/s **or mm/s** by half (C-02) | V_f×10³ cm/s, ± % (statistic undefined) | — |
| Segment duration | Δt (s), undefined | — | — |
| Replicates | none (one burn, sequential segments) | "average of at least 3 repeating tests"; individual repeats **not** given | one row per burn |
| Specimen identity / reuse | label only | — | **sample number** (e.g. 197m); reburns identifiable |
| Ignition | hot coil (article) | methane flame (article) | igniter ID |
| Observations / anomalies | — | — | free text (blow-off attempts, oscillation, preheat) |
| Date/time | — | — | date, GMT day, sometimes clock time |

## Scientifically defensible use given the access limits
- Within-burn descriptive comparisons on the processed rates, with a provenance chain to NASA's as-run record (Evidence Case 02).
- No re-measurement of spread rates, no position-time fitting, and no claim about measurement uncertainty: the raw data are not available.
- Thin-sheet Table 2.1 stays an auxiliary, separate endpoint (Evidence Case 01).

## Unblocking steps (for the user; see BLOCKERS.md)
1. Register for a free NASA PSI account and check whether PSI-25 exposes BASS-II video, overlay and image data. Record the licence terms.
2. Ask the corresponding author (Link et al. 2018: X. Huang) or NASA GRC (S. Olson, P. Ferkul) about C-02 (unit label), C-03 (P16/P19 configuration) and C-15 (B22). Record any reply verbatim with its date.
3. Obtain Rivera et al. 2026 through a library, and check its data-availability statement.
