# Atlas and published-condition data provenance

Snapshot: 15 November 2026, Pakistan time. These datasets were curated by the AI research team from previously acquired public source bytes. No independent human review, new experiment, model validation or exhaustive literature search is claimed. This work made no network requests and did not modify the acquired sources, existing scientific registry or frozen evaluation.

## Files and regeneration

- [`investigation-atlas.json`](../data/investigation-atlas.json): 24 NASA PSI profiles, their 22 acquired experimental-table CSVs, and one acquired analyzed workbook.
- [`condition-cases.json`](../data/condition-cases.json): seven Saffire cases from one primary publication version, with original strings, arithmetic conversions, source locators and the unresolved flow-direction conflict.
- [`curate-atlas.py`](../scripts/curate-atlas.py): deterministic, offline generator using the Python standard library. It writes only those two JSON files.

Run from the repository root with an installed Python 3.10 or later:

```text
python -I web/scripts/curate-atlas.py
python -I web/scripts/curate-atlas.py --check
```

The local run used `C:\Users\Arbaz\AppData\Local\Python\pythoncore-3.14-64\python.exe -I -X utf8`. `--check` is read-only: it verifies inputs, recomputes counts and conversions, checks required fields, and compares the resulting UTF-8 bytes with both committed JSON outputs. Timestamps come from acquisition records; regeneration does not insert the current clock time. Output order and formatting are fixed.

The generator verifies **55 raw files** with SHA-256. Nine fixed trust roots include the acquisition logs, table manifest, workbook/audit and primary papers. The pinned PSI acquisition log supplies the expected hashes and sizes for all 24 PSI records and 22 CSVs. The generator then verifies those 46 files individually. It also checks table names, versions and sizes against each investigation's `experimentalTable` inventory. It fails on missing or changed input bytes, a changed profile/table set, inconsistent required fields, changed recounts or stale generated output. Source hashes establish which bytes were used; they do not independently validate the scientific transcription.

The generator reads the current app investigation registry only to ensure eight fixed navigation IDs exist. It does not import scientific findings from that registry. Changes to those navigation IDs require explicit mapping maintenance; changing unrelated registry text does not change the atlas.

## PSI catalog metadata and acquired inventory

Sources are the 24 `*.record.json` files and `tables_manifest.json` under [`_raw/psi_2026-11-15`](../../_raw/psi_2026-11-15) in the repository root. **Repository-relative paths in JSON start at the repository root**, not at `web/`; raw artifacts need not be exposed by the public website. Public NASA links and DOI links are provided separately.

Each profile retains the stable PSI accession, title, stated acronym, DOI, individual record license fields, source version/hash and acquisition time. `metadata.objective` and `metadata.description` retain the source's stated text. Their role is explicitly `source_stated_catalog_metadata`: an objective is an intended investigation, not a verified result or prediction. All 24 acquired description fields are empty and become `null`; five empty acronyms also remain `null`. No acronym or scientific observation is invented to fill them.

PSI-10's three license fields are blank in its acquired record. Its generated license is `status: "not_reported"` with null identifier, name and URL. The CC0 statements on the other records are not inherited by PSI-10. Public availability does not supply the missing license field.

The acquired table inventory contains **22 CSV files across 20 profiles**, with **2,009 nonblank data records** after one header record per file. This count includes summary rows, references and notes. It is **not a count of burns, specimens, observations or independent trials**. A CSV parser handles quoted fields; this is not a physical-line count. Original decoded headers are retained without correcting spelling, spacing or unit labels.

| PSI accession | Acquired experimental-table file | Nonblank data records | Blank data records |
| --- | --- | ---: | ---: |
| PSI-10 | Flame Design — Normal Flame | 207 | 0 |
| PSI-10 | Flame Design — Inverse Flame | 120 | 0 |
| PSI-20 | ACME BRE | 18 | 0 |
| PSI-21 | CLD Flame | 32 | 0 |
| PSI-22 | ACME E-FIELD Flames | 32 | 0 |
| PSI-23 | ACME s-Flame | 18 | 0 |
| PSI-25 | BASS-II | 129 | 0 |
| PSI-26 | BASS | 122 | 0 |
| PSI-39 | CFI | 87 | 0 |
| PSI-47 | DAFT | 2 | 0 |
| PSI-68 | Flex2 | 8 | 0 |
| PSI-69 | FLEX | 274 | 0 |
| PSI-98 | SAFFIRE-1 | 4 | 0 |
| PSI-99 | SAFFIRE-2 | 15 | 0 |
| PSI-100 | SAFFIRE-3 | 2 | 0 |
| PSI-101 | SAME-R | 109 | 0 |
| PSI-102 | SAME | 8 | 0 |
| PSI-106 | Slice | 12 | 0 |
| PSI-107 | Spice | 469 | 0 |
| PSI-142 | Data Summary Table | 8 | 0 |
| PSI-159 | CFI-G — Normal Flames | 179 | 0 |
| PSI-159 | CFI-G — Inverse Flames | 154 | 861 |
| **Total** | **22 files** | **2,009** | **861** |

The PSI-159 inverse table contains 861 records whose cells are all empty/whitespace; these are counted separately, not silently presented as experiments. The full parsed count after headers is 2,870. The FLEX CSV requires Windows-1252 decoding; the other 21 tables use UTF-8 with optional BOM. Decoding never uses replacement characters, and raw files are unchanged.

PSI-60, PSI-62, PSI-115 and PSI-117 have no entries in the acquired record's `experimentalTable` list. Their status is `none_listed_in_acquired_record`; this does not mean their investigations have no results or no other archive files. The inventory does not claim acquisition of the full PSI archive. For example, SAME's eight CSV records are summary/design entries, while SAME-R includes baseline/aged entries; row counts do not establish identical units of analysis across files. [Detection/source audit](lab/05_detection_completion_2026-11-15.md)

`appInvestigationId` provides navigation for PSI-25, 26, 69, 98, 99, 100, 101 and 102. The mapping was checked against `web/data/investigations.json`; it does not join observations or inherit that registry's source depth or applicability decisions.

### Acquired analyzed workbook

The workbook `PSI-101_Analyzed Data_SAME, SAME-R_Results.xlsx` is inventoried once under its acquisition accession, [PSI-101](https://psi.nasa.gov/physci/repo/data/investigations/PSI-101). It also contains SAME records, represented by `relatedAccessions`, without double-counting the asset under PSI-102.

- Investigation metadata version: **4**; file version: **1**. These are different version fields.
- Size: **4,061,669 bytes**; SHA-256: `6d3a539ccf425b1fa8edc19cc75d828f57d650c7ce734d4e7aa686fea9593218`.
- **43 worksheets**, with names and source dimensions inventoried from workbook XML.
- `Material Sort` contains **154 flight-marked records**: source flight code 1/SAME has 45; code 2/SAME-R has 109. There are 20 DBP reference records and 134 records across the five listed solid material categories. These are record counts, not independent burns.

The generator independently recounts the stored XML flight and material fields and compares them with the existing pinned workbook audit. It does not execute formulas, macros or external links. Cached errors and missing cells remain unresolved. The SAME-R CSV and workbook each have 109 campaign rows but differ in their material/test-label sets: the CSV has the Teflon 57 reburn entry; the workbook has Kapton `65 K`/specimen K15. No observation join is performed. Full details and cell locators remain in the [detection completion report](lab/05_detection_completion_2026-11-15.md).

## Canonical Saffire conditions: 2026 Table 1 only

Primary source: Urban et al., **Heat and Smoke Emission from Tests on the Saffire VI Experiment**, ICES-2026-577, [NASA NTRS record](https://ntrs.nasa.gov/citations/20260001992), [full PDF](https://ntrs.nasa.gov/api/citations/20260001992/downloads/ICES%20Saffire%202026%2005%2004%20b.pdf). The acquired PDF has SHA-256 `59315478dbf26b833238df7166cf2a4649f4731f51fc01f8fc0eef602966d80d`. Table 1 is on **PDF page 6 / printed page 6**. The full PDF was acquired earlier; the primary page image was personally inspected by the AI physics agent during this implementation and checked against extracted text. These are table entries, not digitized plotted figures.

The table's original pressure and oxygen strings are retained. The only unit transformations are `kPa = mbar × 0.1` and `mole percent = mole fraction × 100`. Optional oxygen partial pressure is arithmetic `xO2 × P`; it is not a new measurement or an equivalence criterion. Decimal arithmetic prevents binary floating-point artifacts during conversion. Additional decimal places in a derived value do not imply additional source precision or known measurement uncertainty.

| Case ID | Material | Burning sides | Original pressure, mbar | Pressure, kPa | Original O2 mole fraction | O2 mole percent | Cohort |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| SAFFIRE-IV-2 | PMMA | 2 | 1000 | 100 | 0.22 | 22 | PMMA-2 |
| SAFFIRE-V-3 | PMMA | 1 | 745 | 74.5 | 0.26 | 26 | PMMA-1 |
| SAFFIRE-VI-3 | PMMA | 2 | 544 | 54.4 | 0.30 | 30 | PMMA-2 |
| SAFFIRE-VI-4 | PMMA | 1 | 550 | 55 | 0.29 | 29 | PMMA-1 |
| SAFFIRE-IV-1 | SIBAL | 2 | 980 | 98 | 0.23 | 23 | SIBAL-2 |
| SAFFIRE-V-2 | Cotton | 2 | 741 | 74.1 | 0.28 | 28 | Cotton-2 |
| SAFFIRE-VI-2 | SIBAL | 2 | 541 | 54.1 | 0.31 | 31 | SIBAL-2 |

The 2026 caption reports all samples 40 cm wide in nominal 20 cm/s **opposed** flow. PMMA samples are 18 cm long; one-sided samples are 5 mm thick and two-sided samples 10 mm thick. All PMMA samples were preheated for 10 minutes at low ignitor power. SIBAL and Cotton samples are 50 cm long; their thickness and preheating are not supplied in this table and remain unknown in this dataset. Ignition duration, initial-flow duration and free volume also retain their original table strings and parsed values.

The table's nominal flow is not a full time history. Page 6 explicitly describes VI-3 flow reduction to 5 cm/s at 480 s and the end of flame tracking. That source-specific context is included only for VI-3; later histories for other cases are not inferred from it. `transferStatus` remains `not_assessed` for every case.

### Publication conflict and version separation

[Preliminary Results from the Saffire VI Experiment](https://ntrs.nasa.gov/citations/20240002981), ICES-2024-365, Table 1 on PDF page 3, reports **Concurrent** flow at 20 cm/s for its five listed cases. Its acquired PDF SHA-256 is `7f875da1d6abeeeeac64aeba67d3f160074cf98430e714fe7606b34b37e0aa59`. That statement conflicts with the 2026 caption. The dataset records both source-specific statements and labels the conflict unresolved; it does not choose a physical direction by assumption. [Conflict discussion](lab/05_detection_completion_2026-11-15.md)

Several 2024 atmosphere entries also differ from 2026. For example, the 2024 two-sided VI-3 PMMA row is 30.3 mol% at 54.6 kPa, whereas the canonical 2026 table gives 0.30 and 544 mbar. VI-2 is **SIBAL**, while VI-3 is **PMMA**; both must not be relabeled as cabin fabric. Earlier numeric conditions are not copied into the canonical cases. The 2024 source appears only in `earlierSourceContext` for provenance and the flow conflict.

## Contract and scientific boundaries for the interface

The atlas root uses `schemaVersion: "ignis-investigation-atlas-1"`, `counts`, `boundaries` and `records`. A record has `id/accession`, `title`, nullable `acronym`, `publicUrl`, `doi/doiUrl`, explicit `license`, `source`, `metadata`, nullable `appInvestigationId`, `experimentalTables` and `analyzedWorkbooks`. Each table carries its source filename, relative path, hash, file version, byte count, acquisition time, original header and unambiguous record counts. Empty arrays mean no asset in this acquired inventory, not no scientific work.

The condition root uses `schemaVersion: "ignis-condition-cases-1"`, `source`, `flowConflict`, `earlierSourceContext`, `comparisonPolicy`, `cohorts` and `cases`. Stable case IDs are those in the table above. Source ID `SRC-SAFFIRE-2026-T1` is local to this dataset; it does not silently create a new source or observation in the existing scientific registry. Optional assay/detection data must cite their own operators and locators.

The intended operations are source browsing, explicit inventory inspection, and bounded **atmosphere-coordinate gap inspection**. The interface can select a material and burning-side cohort and show separate signed differences: case oxygen percent minus target oxygen percent, in mole percentage points; case pressure minus target pressure, in kPa. A Cotton-2 cohort has only one case. Neither equal coordinates nor a zero difference establish physical equivalence.

The material/sides gate is a restriction for that display, **not proof of comparability**. Physical transfer additionally requires appropriate gravity/platform, flow history and direction, confinement, geometry/mounting, material formulation and thermal properties, specimen history, ignition/preheating, measurement operator, time window, uncertainty and campaign/calibration ancestry. Oxygen mole fraction, pressure and oxygen partial pressure are not interchangeable controls. The experiments are aboard Cygnus in low-Earth-orbit microgravity; they are not lunar-gravity experiments and do not represent the Moon's external environment.

Do not render a NASA or literature completeness claim, a count of burns from CSV rows, a safety verdict, a predicted flame or alarm response, an independence claim, an error bar inferred from source rounding, or a scalar condition score interpreted as physical equivalence. The unresolved flow conflict must remain visible with any condition-gap view. No physical simulation or model inference runs in this layer.

## Verification performed

The generator completed successfully with **55 verified raw inputs; 24 profiles; 22 CSVs; 2,009 nonblank and 861 blank CSV records; one analyzed workbook; seven condition cases and four cohorts**. Its required-field and identity checks passed. A subsequent `--check` compared the generated bytes without writing. This verifies data plumbing, fixed source identity, conversions and recounts within the stated scope; it is not independent scientific review or new validation of the source experiments.
