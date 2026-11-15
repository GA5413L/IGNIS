# Competitor deep dive (15 Nov 2026, ≈00:30–01:30 PKT)

> **Historical snapshot.** The [15 November continuation](COMPETITIVE_UPDATE_2026-11-15.md) supersedes the current-status and strategy conclusions below, including PSI access, the two-fabric description, novelty inferences and the “table stakes” claim. Original content is retained for traceability.

**Supersedes parts of** `COMPETITIVE_RESEARCH_2026-11-14.md` and `IMPROVEMENT_RESEARCH_2026-11-14.md` §4 (see "Corrections" below).

## Method and provenance
- **Search:** GitHub public search API, unauthenticated, 6 queries, 14 Nov ≈20:05 UTC. **193 unique repos**, 69 of them created before 14 Nov. Raw data: `_raw/research_2026-11-15/gh_competitors_2026-11-15.json` and `gh_search_log_2026-11-15.json` (URL, status, bytes, SHA-256, UTC).
- **File trees:** fetched for 38 selected repos (`gh_trees_2026-11-15.json` and its log). `Moa-01/flame-in-freefall` returned 404.
- **Text copies:** 37 repos were cloned shallow and sparse into `F:\ignis extra\competitors\`, text files only, ≤1.5 MB each. The pinned commit SHAs are in `_raw/research_2026-11-15/competitors_clone_log.txt`. **No competitor code was run, and no competitor site was opened.**
- **Scripts:** `search.py`, `trees.py`, `select.py`, `clone.sh` and `analyze.py` in the same folder. The metrics in `competitors_analysis.json` are regex counts: rough signals, not measurements.
- **Status of claims:** README statements are what each team *documents*. They are not verified. Nothing from competitor repos enters IGNIS code or data.

## 1. The field has moved a long way. What is now table stakes
Almost every serious entry has the following. Lacking any of them now costs points rather than adding them.

| Table-stakes feature | Seen in (examples) |
|---|---|
| **All 24 PSI "Combustion Science" investigations**, plus the **PSI experimental tables** (CC0 per record) | VESTA, MARGIN (1,870 run rows), HALO, StarryNight (263 solid tests), FIREWISE, Entropy (747 O₂+pressure tests), PYRION, ZERO FLARE, nasavior, ignis-lab |
| **Moon/exploration atmosphere view** (34 % O₂ / 8.2 psia / 56.5 kPa; 26.5 % / 10.2 psia; 21 % / 14.7 psia, from the PSI-20 record) | about 30 of the 37 repos; "8.2 psi" appears in nearly all |
| **Headline gap:** "no real solid in PSI burned above 22.2 % O₂ or below ~1 atm" | MARGIN, HALO, StarryNight |
| **"Evidence coverage, not safety"** wording, with abstention ("Insufficient validated evidence") | VESTA (PROVEN / EXTRAPOLATED / NEVER TESTED), MARGIN (DIRECT / NEAR / DISTANT / NONE), StarryNight, FIREWISE |
| Every value linked to a PSI row or a verbatim quote | VESTA, Entropy, MARGIN, FIREWISE, StarryNight |
| **An SI evaluation set with published metrics** | StarryNight (26 questions: 83 % facts, 96 % citations, 100 % refusals), Emberfall (40 questions: hit@k, refusal 1.0), MicroFire (gold sets), HALO, Caped-Crussader |
| Live URL, deck or video | MARGIN (Vercel), VESTA (GitHub Pages), MicroFire (Vercel + 3:57 video), StarryNight (Vercel + API docs), Entropy (Vercel + 7-slide PDF), ZERO FLARE (Cloudflare) |
| Open data or API | VESTA (static API, CSV, **MCP server**), ZERO FLARE (`/corpus`), StarryNight (`/docs`) |

**How they get PSI data.** At least 10 teams read PSI's public JSON backend:
- `psi.nasa.gov/geode-py/ws/repo/search` with `ffield=Research Area&fvalue=combustion science`;
- `…/repo/investigations/PSI-N` for each record;
- `…/studies/PSI-N/download?file=…` for the table files.

Example: MARGIN `pipeline/fetch-psi.mjs` (read, not run). MARGIN reports that 23 records state CC0-1.0, PSI-10 states no licence, and each record has a DOI `10.60555/…`. **We have not verified this.** Our own fetch of that backend was denied by this session's permission classifier (see `IMPROVEMENT_RESEARCH_2026-11-14.md` §1).

## 2. The strongest entries

| Team / product | Core idea | Runtime SI | Notable strengths | Things IGNIS rules would not allow |
|---|---|---|---|---|
| **VESTA** (itzjk/vesta) | Verified findings plus PSI table rows; cabin coverage map | **None.** SI used at build time only; deterministic checks. | Quote-in-sentence verification, row-level provenance, static API, MCP server (4 tools), NTRS feed, 37 test files, scripted fire drill | Fixed-weight relevance score (pillar 30, atmosphere 25, …); "EXTRAPOLATED" status |
| **MARGIN** (ADAI-ALEX/margin) | "How close is the evidence?" An evidence distance **D** from a cabin atmosphere to the nearest comparable test | **None** | Comparability gate before any distance; gravity kept categorical; robustness at ½×/2× scales; worked example with Saffire VI-2 SIBAL as the nearest published test; e2e oracle test | The distance scales are expert judgement (stated); weighted ranking |
| **HALO** (MaanavKrishna) | One-page "Fire Brief" for a habitat | Build-time summaries; live explanations planned | Detector blind-spot counts from SAME/SAME-R runs ("20 of 35 Kapton runs below 2.0 V proxy"); "next test to fly"; 47 test files | **A–F readiness grade**; **droplet self-extinction probability** from a model fitted to FLEX (a new prediction) |
| **StarryNight** (G3hamza/astrofire) | "Will it burn? What proves it? How sure are we?" | gpt-oss-120b on Groq writes text from evidence chosen by deterministic code; guardrails | Published 26-question eval; English and Arabic; habitat ranking 0–100; gaps map; API docs | 0–100 ranking with fixed weights |
| **MicroFire V2** | Evidence observatory plus a 5-mission learning game | **None** (fixed-template guide) | One admitted record after primary-source check (BASS-II **B20, 17.4 vol% calibrated**, TM-20210011385 Table A.1, p.112) and 55 quarantined; server-checked missions; video | — (very conservative, close to IGNIS rules) |
| **ZERO FLARE** | "AI-first" research platform; CIR-1 copilot with 26 typed tools | Gemini or Workers AI | Comparability gate in Compare; 63 equations; selftest endpoint; corpus mirror | "Prediction" section, model playgrounds, d²-law validation |
| **Emberfall** (0xdevabir) | Cited Q&A over 1,334 NTRS reports | Claude Opus 5.5 (with Gemini and Groq as fallbacks) | Consensus and contradiction detection (58 contradictions); retrieval eval with baselines | Evidence-strength scoring of 13 risks |
| **Entropy** (astrot777) | 12-fact catalogue per investigation, side-by-side compare | LLM extraction, kept only if the quote matches the source | Honest hand-check (53/55 cells correct); 7-slide PDF; 42 test files | — |
| **FIREWISE** (Ahmedvini) | Dashboard plus a **3D digital twin** | Groq copilot with web-search fallback | Measurement-status labels on every value | Physics twin (ideal gas, convection), presented as a model |

Other repos named IGNIS or Emberfall: `BlguunBN/ignis-space-fire` ("IGNIS … Evidence Intelligence Dashboard"), `Bodda59/Ignis_9th_…`, `WingManOO7/ignis-lab`, `IGNIS-Innovators/…` and `0xdevabir` (product "Emberfall"). That makes **four other IGNIS repos and one Emberfall**.

## 3. Where IGNIS stands now

### Behind
1. **No PSI tables.** IGNIS is paper-only.
2. **Coverage of 8 of the 24 PSI records**, by its equivalent investigations from papers (see the table below).
3. **No deployment, deck or video.**
4. **No executed SI evaluation.** Keys are blocked.

### Already common, so these are no longer distinctive
- Moon atmospheres;
- comparability gates (MARGIN, ZERO FLARE);
- provenance;
- abstention;
- an SI evaluation with metrics.

### Still uncommon (checked by searching the 37 cloned repos)
1. **Saffire IV–VI are not in PSI.** The competitor snapshot lists only Saffire I–III as PSI-98/99/100.
   - IGNIS already holds the published Saffire V/VI events at **31.0 % O₂ / 54.1 kPa** and **30.3 % / 54.6 kPa** (as printed). These are the large-scale burns of a real cabin fabric (SIBAL) nearest the exploration atmosphere.
   - Only MARGIN and SPICA contain "54.1 kPa".
   - HALO and StarryNight headline that no solid was burned at Moon conditions "in PSI". IGNIS can show the precise statement: **not in PSI, but published for Saffire VI**, and exactly what can and cannot be compared.
2. **Checks of NASA's published Saffire cabin models against flight measurements (W1–W3).** The S-CAL figures **497 kJ** (none of the 37) and **1280 kJ** (HALO only) suggest nobody else does this.
3. **Typed interpretation into a deterministic contract, plus revision history.** Most teams use SI to narrate or extract. PYRION has a similar idea ("LM parses and narrates, never decides") but is unfinished.
4. **Critical-error rules in the SI evaluation.** Others report aggregate rates; IE-1 fails a configuration on a single critical error. **This can be claimed only after IE-1 runs.**

### IGNIS coverage against the 24-record PSI list
The list is as found in competitor snapshots (`nasavior/data/raw/psi_investigations_2026-11-14.json`; MARGIN). **It is not verified against PSI.**

| PSI | Investigation | IGNIS |
|---|---|---|
| 26 / 25 | BASS / BASS-II | profile only (papers) |
| 98 / 99 / 100 | Saffire I / II / III | yes (papers) |
| 102 / 101 | SAME / SAME-R | yes / profile only |
| 69 | FLEX | yes (papers) |
| 68 | FLEX-2 | no |
| 10, 20, 21, 22, 23 | ACME Flame Design, BRE, CLD Flame, E-FIELD, s-Flame | no (the JASMAC ACME paper is acquired) |
| 159 | ACME CFI-G | no |
| 39 | CFI | no |
| 47 | DAFT | no |
| 106 | SLICE | no |
| 107, 60 | SPICE, SPICE analysis | no (SPICE objective acquired) |
| 62, 115, 117, 142 | Modelling and analysis studies (flame spread, SAME, cool flames) | no |
| — | Saffire IV–VI (not in PSI) | **V and VI yes** |

## 4. Recommendations (time now ≈01:30 PKT 15 Nov; freeze 18:00; deadline 23:59)
1. **Decision needed (the biggest single lever): PSI primary data.** Without the 24 records, IGNIS cannot reach table stakes from primary sources in time. The options are unchanged:
   - **(a)** you download the records;
   - **(b)** you explicitly authorize read-only use of PSI's public JSON backend, which most top teams use;
   - **(c)** NTRS only. This would leave IGNIS short of PSI coverage.

   Competitor snapshots are **not** a substitute: their provenance is second-hand, and reusing their data is not our work.
2. **Rebuild the story around what only IGNIS shows:** *"The closest NASA burns to the Moon-base atmosphere aren't in PSI, and here is precisely what they can and cannot tell you."* That means Saffire VI conditions, the comparability contracts, the model-vs-experiment checks and the honest W1–W3 results, presented in the Moon view.
3. **Do not copy competitor features that break IGNIS rules:** A–F grades, extinction probabilities, 0–100 weighted rankings, "EXTRAPOLATED" verdicts. Judges may like them, but IGNIS's validity case is that it refuses them. The pitch should **say** this.
4. **Table stakes still to meet:** a live URL, a 7-slide deck or 30-second video, and the SI evaluation run. Several top teams (VESTA, MARGIN, MicroFire) use **no runtime SI**. If keys stay blocked, a credible fallback is SI at build time (for example, verified extraction). That still needs inference approval and a key.
5. **Name:** with four other IGNIS repos (one called "IGNIS … Evidence Intelligence Dashboard") and one Emberfall, a distinctive product name or subtitle is advisable. **This is your decision.**

## 5. Context for G2 (preparation reuse), reported only, not judged
- 69 of 193 repos were created before 14 Nov.
- MARGIN states it had "written permission from the Space Apps organisers" for pre-event SI research. Its own TODO says the date and scope are still to be confirmed.
- Emberfall's evaluation file is dated 30 Sep.

## Corrections to the 14 Nov notes
- `COMPETITIVE_RESEARCH_2026-11-14.md` said that no README read reported an SI evaluation except MicroFire's. **That is wrong:** StarryNight, Emberfall, HALO and Caped-Crussader also publish eval sets or metrics.
- `IMPROVEMENT_RESEARCH_2026-11-14.md` §4.2 said the Moon framing was "not in the competitor READMEs read". **That is wrong:** most top entries use 34 % / 8.2 psia.
