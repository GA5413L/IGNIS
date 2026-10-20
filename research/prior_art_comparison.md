# Prior art and competitor comparison (20 October 2026, second session)

**Question:** is IGNIS doing anything that a well-curated spreadsheet plus an experienced researcher, or an
existing tool, does not already do?

**Answer today: no, not demonstrably.** IGNIS's assets so far are curated data products: a journal↔NASA crosswalk
for one rod campaign and a conflict register. A spreadsheet can hold both. Whether software adds value on top of
them has not been tested.

## How the statuses are used
| Status | Meaning |
|---|---|
| **IMPLEMENTED AND INSPECTED** | we read the implementing artefact (a data file or code) and saw the function in it. We did **not** run any third-party code |
| **DOCUMENTED BUT UNVERIFIED** | described in a README, paper or abstract; not checked in an artefact |
| **PROPOSED** | the authors describe it as planned or next |
| **UNKNOWN** | no evidence either way |
| **ABSENT IN INSPECTED FILES** | looked for in the files we read and not found. That does not prove it is absent elsewhere |

All competitor material was read on 2026-10-20 from public GitHub, via the API and raw file URLs, and saved under
`_raw/competitors/` (gitignored). No code was executed and no live site was used.

## 1. The three named competitors

### MicroFire Atlas (`A-K-M-Asifuzzaman/MicroFire-Atlas`; MIT; created 2026-10-01, last push 2026-10-08; live site per README)
This is the strongest comparator. It is already a built pre-event application covering BASS-II, Saffire and LUCI.

| Function | Status | Evidence |
|---|---|---|
| Per-record provenance: source, table, PDF page; each field marked observed / series-level / derived; derived-value explanations | **IMPLEMENTED AND INSPECTED** | `apps/web/data/experiments.json`: `provenance.record{table, pdf_page}`, `observed[]`, `series{…quote, page}`, `derived{…}` |
| **Reused-sample flags** (specimen identity within the NASA appendix) | **IMPLEMENTED AND INSPECTED** | `quality_flags: reused_sample` on 8 records; also `o2_reading_suspect` (4) |
| 56 BASS-II records: 31 SIBAL fabric (concurrent), 22 PMMA film (opposed, Table A.1 B1–B22), 3 Nomex | **IMPLEMENTED AND INSPECTED** | `experiments.json` family counts |
| **PMMA rods / Link et al. 2018 / journal↔NASA crosswalk** | **ABSENT IN INSPECTED FILES** | no rod family in `experiments.json`; "Link"/"s41598" absent from `findings.json`. The TM is cited only as a whole report |
| **Cross-source conflict register** | **ABSENT IN INSPECTED FILES** | "conflict" does not occur in `findings.json`. Code not searched |
| Evidence ladder (direct / analogous / mechanistic / gap), comparability warnings, mismatch budget, abstention ("MicroFire says no") | **DOCUMENTED BUT UNVERIFIED** | README; files exist in the tree |
| AI claim checker (citations, numbers, units, gravity context, causal and safety wording) | **DOCUMENTED BUT UNVERIFIED** | README |
| Evaluation sets: 100-question MicroFire-Eval, 42-case finding gold set; reported scores | **DOCUMENTED BUT UNVERIFIED** | README; `apps/web/eval/*.json` present, contents not read |
| ML "flame established" classifier (AUC 0.80, interval 0.60–1.00) with a domain gate | **DOCUMENTED BUT UNVERIFIED** | README |
| Children's adventure, 3D lab, OpenCV "Flame Vision" | **DOCUMENTED BUT UNVERIFIED** | README; screenshots |

**Consequences:**
- MicroFire already **documents or implements** what our brief calls "protocol-aware evidence admission", "provenance" and "specimen reuse", for other BASS-II material families.
- IGNIS can't present those as new.
- MicroFire's Compare Lab uses NASA's thin-film **B16, B19 and B20**, while IGNIS's B16/B19 are Link's rods. That is a live example of the label-collision hazard (C-14), across tools.

### Fotia (`AnteurAbderraouf/Fotia`; MIT code; created 2026-09-22, last push 2026-10-01)
| Function | Status | Evidence |
|---|---|---|
| Catalogue of 24 NASA PSI investigations, with cleaned tables for 10 | **IMPLEMENTED AND INSPECTED** (paths), partly read | tree: `combustion_science/<PSI-xxx>/csv/`; PSI-25 `BASS-II.csv` read (129 rows) |
| PSI-25 BASS-II test table (copy) | **INSPECTED** | it has **no flow-configuration column and no spread rates**; it agrees with TM A.3 on P-test dates, samples and O₂; P17 = `1/4"  black rod` |
| Data-quality notes, e.g. that PSI-25 has "no trainable label" and impossible O₂ values | **DOCUMENTED BUT UNVERIFIED** (consistent with our C-16) | README |
| Per-dataset models with "Measured here / Between tests / Never tested" badges | **PROPOSED / DOCUMENTED** | the README's "Status" says "Baseline models and the dashboard are next" |
| Hybrid search over report PDFs; Streamlit dashboard | **DOCUMENTED BUT UNVERIFIED** | README; code paths exist |
| Rod spread rates or Link 2018 | **ABSENT IN INSPECTED FILES** | PSI-25 has no rates |

**Consequence:** Fotia shows that **PSI-25 tables are obtainable** (the README says PSI data are "public and
re-downloadable"). That weakens our blocker B-03 as written. It is a lead for the user to check directly.

### FLARENEXUS (`KhalidHasan03/Flame-in-Freefall`, "Team Cosmic Nexus"; no licence file in the API metadata; created 2026-10-04)
| Function | Status | Evidence |
|---|---|---|
| Next.js dashboard: explore, compare, Flame Lab, Mission Lab, assistant, insights with "conflicts" | **IMPLEMENTED (UI), structure inspected** | file tree |
| Real NASA data | **ABSENT.** The README says "Every experiment record, metric, risk score … is **synthetic demonstration data** … no record is a representation of a specific real NASA, TM or NTRS document" | README |
| Conflict detection on real sources | **ABSENT** (only synthetic) | README |

**Consequence:** this is a UI-first prototype. Its "conflicts" feature carries no evidential weight.

### The wider field
The GitHub search of 2026-10-20 found ≥ 20 other public "Flame in Freefall" repositories created in Sep–Oct 2026, for example "Emberfall" (NTRS report retrieval), FlameSense, FireGuard-AI, PROMETHEUS and FlameAtlas. **None was inspected (status UNKNOWN).** The field is crowded. Several teams are building before the event; whether that is permitted is *their* question and tells us nothing about ours (see `planning/competition_readiness.md`).

## 2. Established systems and methods
| System | What it does | Status | Overlap with IGNIS |
|---|---|---|---|
| **NASA PSI** | NASA's repository of physical-science data, including BASS-II (PSI-25) | test table seen via a third-party copy; our direct access returns 403; raw video unknown | the primary data home. IGNIS does not replace it |
| **NIST Material Flammability Database** | curated, source-linked flammability data for fire modelling | **DOCUMENTED** (nist.gov page, 20 Oct) | curation pattern only. Not microgravity rods |
| **OntoChemExp** (Bai et al. 2021) | ontology for combustion experiments within the J-Park Simulator, linked to PrIMe | **DOCUMENTED BUT UNVERIFIED** (abstract only) | a combustion-experiment KG exists. IGNIS must not claim a first ontology |
| **PrIMe / Bound-to-Bound Data Collaboration** (Oreluk et al., arXiv:1801.10093) | community data with uncertainties; formal model–data consistency | **DOCUMENTED** (arXiv abstract) | formal consistency methods exist. IGNIS's arithmetic is not B2B-DC |
| **Combustion LLM framework** (arXiv:2603.04452) | combustion QA with RAG/KG; reports RAG peaking at 60 % | **DOCUMENTED** (abstract) | IGNIS should not compete on general QA |

## 3. IGNIS's proposed differentiators, tested one by one
| Component | Who else has it | What IGNIS actually has | Beyond a curated spreadsheet? |
|---|---|---|---|
| **Source-level experimental identity** | MicroFire: as-run test numbers and `reused_sample` flags *within* the NASA appendix (films, fabric) | identity **across documents**: journal label ↔ NASA test ↔ physical specimen ↔ burn order, for 19 rod labels | **No.** The crosswalk is a CSV. Its value is the curation work |
| **Protocol-aware evidence admission** | MicroFire documents comparability warnings, an evidence ladder and abstention | 7 admission rules, applied by a Python script to one table | **No.** The rules are filters a careful analyst applies by hand |
| **Cross-source conflict detection** | not found in MicroFire's inspected files; synthetic in FLARENEXUS | a register of 25 conflicts with page locations, found **manually** by an assistant. No automated detection exists | **No** for detection (it was manual). The register content is the asset |
| **Reproducible scientific comparison** | MicroFire (hashes, exports, build-failing tests); Fotia (rebuild scripts) | scripts plus SHA-256 manifests | **No.** Comparable practice exists |

**Honest position:**
- **Distinctive today (content, not method):**
  - Recovering the PMMA-rod data.
  - Reconciling it record by record with NASA's as-run log.
  - The conflict register.
- **Where it changes a conclusion:** in at least one fire-safety-relevant reading (`adversarial_source_audit.md` §5, F-9).
- **Not distinctive:** method, provenance UI, admission logic, abstention and claim checking. Competitors already document these.
- **The defensible novelty hypothesis for the event:** cross-document reconciliation, shown to change a fire-safety-relevant answer, measured against the M1 spreadsheet baseline. It must be tested, not asserted.

## 4. What this means for strategy
See `planning/competition_readiness.md`. In short:
1. Do not compete on breadth or UI. MicroFire has already covered three families with a polished interface.
2. Compete on depth for one consequential question, with the reconciliation visible and measured.
3. Consider whether IGNIS's reconciliation could be offered as a layer that **complements** catalogues like MicroFire or Fotia, which lack journal-side data and cross-document conflicts, rather than as a competing atlas.
