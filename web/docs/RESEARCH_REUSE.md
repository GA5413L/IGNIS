# Researcher reuse: local evidence and reproducibility

The retained application supports source inspection, descriptive comparisons and reproducible exports. Use the [application guide](../README.md) for the current interface and [build status](BUILD_STATUS.md) for dated verification. Historical receipts retain their original source and method identities.

**15 November 2026.** IGNIS is the working name for a local, AI-assisted research workbench. Its present contribution is measurable evidence exploration: inspect sources, compare stated coordinates, recount selected readings and revise an assessment. It provides no field certification, predictive SOTA result or NASA adoption/endorsement. No final public URL or original-code license is implied.

**Licensing update, 16 November 2026:** original IGNIS code and documentation are now licensed under the [Apache License 2.0](../../LICENSE). Third-party data and source material retain their own terms. This supersedes the original-code licensing status in the dated introduction above.

## Run the local application

Use Node **22.13.0 or later within 22.x**, npm, the committed lockfile and matching application source. From the repository root:

```text
cd web
npm ci --include=dev
npm run validate:data
npm run build
npm start
```

The production server uses `PORT`, defaulting to 3000. Installation requires registry access; the deterministic evidence workflows require no credentials or inference service.

## Read-only API

Parameter names below were checked against [`src/server/evidence.ts`](../src/server/evidence.ts). Use `http://127.0.0.1:3000` locally.

| GET path | Response contract |
| --- | --- |
| `/api/evidence` | `ignis-evidence-index-1`: collections, defaults, provenance and boundaries |
| `/api/evidence?collection=atlas` | `ignis-investigation-atlas-1`: profiles and acquired-file inventory |
| `/api/evidence?collection=conditions` | `ignis-condition-cases-1`: seven canonical cases, four cohorts, source versions/conflict |
| `/api/evidence?collection=condition-comparison&cohort=PMMA-2&oxygen=30&pressure=55` | `ignis-condition-comparison-1`: selected cohort, separate gaps, frontier and provenance |
| `/api/evidence?collection=detectors&flight=all&material=Kapton&channel=issScatterV&cutoff=2&includeReference=false` | `ignis-detector-analysis-1`, plus `exportSchemaVersion: ignis-detector-export-1`: selected cells and counts |
| `/api/catalog` | Core registry revision/digest, counts and source summaries |
| `/api/health` | Registry/build revision, digest and actual AI availability |

The condition example uses an **illustrative target**, not a recommended atmosphere. `oxygen` is mole percent; `pressure` is kPa. Both are required with `cohort`; bounds are `0 < oxygen ≤ 100`, `0 < pressure ≤ 2000`. Cohorts are `PMMA-2`, `PMMA-1`, `SIBAL-2`, `Cotton-2`. For VI-3, the example yields signed gaps of **0 percentage points and −0.6 kPa**. This is coordinate proximity, not physical transfer.

The detector example should return **36 selected rows, 35 finite readings, 20 below 2 V and one missing**. Its 20/35 fraction is not an alarm-miss rate. `flight` accepts `all`, `1`, `2`; channels are `issScatterV`, `issObscurationV`, `stsV`, `ionDeltaV`. `includeReference` accepts exactly `true`/`false`; the default excludes DBP. Names/enums are case-sensitive. Unknown, duplicate or collection-inapplicable parameters fail with HTTP 400 and `ignis-evidence-error-1`; the serialized query limit is 2,048 bytes. Evidence responses use `no-store` and make no outbound requests.

## Portable selected analyses and session recipes

Build `web-2026-11-15.3` supports attaching an exact condition, detector or paired-channel selection before confirming a brief. Matching assessment JSON/Markdown preserve its descriptive result, source references and method identity. These attachments do not alter the physical-model contracts or promote supplemental rows to validation evidence.

Open **Research notebook** to download a session or save it manually in this browser. Session schema `ignis-research-session-1` contains a draft, up to one attached selection of each kind, and up to 16 chronological assessment recipes/receipts. Import is a local `POST /api/session`: a closed, bounded packet is checked and every recipe recomputed using current installed sources. The recheck reports source, method and result drift separately, then lets the researcher load the recomputed workspace. It rejects checksum corruption, unsupported fields and inconsistent ancestry. It performs no upstream call.

Keep the original **assessment JSON** as well as the session: recipes and receipt fingerprints do not embed all original results/source rows. A changed installed source can produce a new result; the imported receipt is a comparison reference, not an authenticated scientific assertion. Checksums are not signatures and matching results are not independent validation. No automatic browser saving occurs.

For the paired audit, default AW scatter versus AV obscuration at separately declared 2 V cutoffs gives 133 jointly finite pairs among 134 nonreference rows; A-minus-B fractions are +70/133 pooled, −6/25 flight 1 and +76/108 flight 2. Original workbook/sheet/row identity is the pairing key. Equal voltage cutoffs do not establish a shared physical response scale. The optional literal-n fan filter is a population-sensitivity operation, not an instrument-failure diagnosis. Export the full paired audit to preserve marginal counts, finite completion bounds and exclusion witnesses.

See the [deeper-research report](https://github.com/GA5413L/IGNIS/blob/6dc8f5e0c1bc9c1202e70b803c9e26f202f9cdd5/web/docs/PROFESSIONAL_RESEARCH_AND_IMPROVEMENTS_2026-11-15.md) for new primary sources, the decision to defer physical ML fitting, professional-tool comparisons and concrete data-admission requirements.

## Distinguish evidence depth and versions

The atlas contains **24 source-stated metadata profiles**, not 24 deeply reviewed findings. Its 22 CSVs contain 2,009 nonblank records, including summaries/notes, not that many burns. The separate core registry, currently `2026-11-15.r2`, has 10 investigations and **16 findings**: nine observation statements, six published-model statements and one hypothesis-context statement. These are assistant-checked, not independently human-reviewed. The detector selection contains 134 spacecraft-material records plus 20 separately marked DBP reference records, with shared experimental ancestry.

Canonical atmosphere values come only from **ICES-2026-577, Table 1, PDF p. 6**. The earlier 2024 table remains conflict context, not merged numerical data. Detector values come from **PSI-101 record v4**, workbook file **v1**, `Material Sort`, with original cells and missing/error states preserved.

| Required primary bytes | SHA-256 |
| --- | --- |
| Saffire 2026 PDF | `59315478dbf26b833238df7166cf2a4649f4731f51fc01f8fc0eef602966d80d` |
| SAME/SAME-R workbook | `6d3a539ccf425b1fa8edc19cc75d828f57d650c7ce734d4e7aa686fea9593218` |

## Reproduce source curation

From the repository root, with Python 3.10+:

```text
python -I web/scripts/curate-atlas.py --check
python -I web/scripts/curate-detector-data.py --check
```

Both use the standard library. **The exact local `_raw/` archive is required**, including pinned acquisition manifests/audit metadata, 24 PSI records, 22 CSVs and the relevant papers/workbook. A public clone without that archive can consume generated JSON but cannot reproduce these source checks. Downloading the latest similarly named file is insufficient. The atlas verifies 55 raw hashes; detector curation verifies its pinned source inputs. Neither runs spreadsheet formulas, inference or a simulator. See [atlas provenance](ATLAS_DATA_PROVENANCE.md) and [detector provenance](DETECTOR_DATA_PROVENANCE.md).

The retained source baseline is recorded in [PROJECT_RECORD.md](../../PROJECT_RECORD.md). When citing a reproduced result, record the actual commit and lockfile, dataset/source versions, catalogue digest and exported request/results. A schema identifier alone is not a content version.

Rights remain item-specific: 23 PSI records state CC0-1.0; PSI-10's license is unknown. NTRS 20260001992 is public but marked `MAY_INCLUDE_COPYRIGHT_MATERIAL`. Full PDFs, figures and workbooks are excluded from the proposed public package. Original IGNIS code and documentation use the [Apache License 2.0](../../LICENSE). Retain attribution and [AI/pre-event disclosure](AI_DISCLOSURE.md); consult [source rights](SOURCE_RIGHTS.md).

## Three further validation stages

1. **Independent human source review:** reviewers uninvolved in curation inspect original pages/cells, quantities, identities, conflicts and claim limits. Record disagreements and adjudication. Another AI pass is not independent human review or a new experimental replication.
2. **Small blinded task study:** freeze tasks and compare against an equally informed curated spreadsheet; counterbalance task order and blind graders to tool identity. Measure correct supported answers, unsupported inferences, useful next steps, verification effort and time. Report failures and denominators.
3. **Prospective external-data validation:** only after a physical model exists, freeze its inputs/calibration and intended outputs before testing a separate campaign. Check measurement operators, domain, uncertainty and predictive error. Publish limits and failures; workflow correctness alone cannot establish physical validity.
