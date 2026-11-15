# SAME detector data: source and calculation contract

The detector view uses cached values from the public PSI-101 results workbook. The curation and analysis are assistant-checked, not human-reviewed or an independent detector validation. The output describes selected voltage readings. It does not classify actual alarms, detector misses, safe conditions, or physical predictions.

## Primary artifact

- Record: [NASA PSI-101, Smoke Aerosol Measurement Experiment-Reflight](https://psi.nasa.gov/physci/repo/data/investigations/PSI-101), captured version 4, modified date 2 June 2025.
- Dataset DOI: [10.60555/2np7-jv14](https://doi.org/10.60555/2np7-jv14).
- Record-declared license: [CC0-1.0](https://spdx.org/licenses/CC0-1.0.html). This is the license metadata recorded by PSI.
- Current file name: `PSI-101_Analyzed Data_SAME, SAME-R_Results.xlsx`; legacy name: `Combined SAMER Results 06 02 14.xlsx`.
- Size: 4,061,669 bytes.
- SHA-256: `6d3a539ccf425b1fa8edc19cc75d828f57d650c7ce734d4e7aa686fea9593218`.
- Downloaded on 14 November 2026 at 23:06:48 UTC through the public PSI endpoint. No signed download query string is embedded in the app data or acquisition log.
- Local original: `_raw/lab_completion_2026-11-15/detection/PSI-101_Analyzed Data_SAME, SAME-R_Results.xlsx`.

Only worksheet **Material Sort** is curated. Headers are Excel row 2. The flight marker in column A selects literal values `1` and `2`, giving **154 records**: 45 SAME and 109 SAME-R. Twenty DBP records remain explicitly marked as reference material. The default analysis excludes them, leaving 134 records. Records are not assumed independent: aged readings, specimens, hardware and calibrations can be shared.

The script reads XLSX ZIP/XML stored cell values. It does not run formulas, recalculate the workbook, access external links, or execute spreadsheet code. Formula strings and source storage types are retained as provenance. Record IDs include the workbook hash, worksheet and Excel row; sample/test labels are not used as unique join keys.

## Preserved measurements

| App channel | Source column | Original header | Unit |
|---|---|---|---|
| `issScatterV` | AW | ISS Detector Scatter (volts) | V |
| `issObscurationV` | AV | ISS Obscuration (volts) | V |
| `stsV` | AX | STS Detector (volts) | V |
| `ionDeltaV` | BK | Ion B Delta (volts) | V |

Every measurement retains its cell address, original cached value, parsed numeric value or null, error or null, and status (`finite`, `missing`, `error`, `non_numeric`). Blank and error cells are never converted to zero. A stored zero remains a finite source value; this alone does not establish that the instrument was enabled or that smoke was absent. Obscuration volts are not percent obscuration. Ion-B delta is a diagnostic channel, not a flight alarm event.

BR/BS size fields, explicit heating/aging values, source sample and test identifiers, descriptions, and selected instrument-use/quality fields remain attached to each record. They are not filled from another worksheet or the condition CSV. For example, AW50 is blank and remains missing; BS59 contains `#DIV/0!`; U65 contains `n/a`. A generic unknown time is not silently replaced by a programmed aging interval.

## Calculation and export

`analyzeDetector(requested, dataset?)` accepts a partial `DetectorSelection` and returns its normalized selection, source, policy, identity conflicts, selected channel, actual selected records, counts, and `byMaterial` summaries. Defaults are all flights, all materials, `issScatterV`, a **2 V analyst-selected cutoff**, and `includeReference: false`. Selecting DBP requires `includeReference: true`.

Filters accept `flight: 'all' | '1' | '2'`, the six recorded material names or `all`, and the four channel IDs above. Cutoffs must be finite, numeric and nonnegative. They are not derived from or substituted for flight alarm criteria. Negative measured voltages, where present, are retained.

`below` means strictly less than the selected cutoff. Equality belongs to `atOrAbove`. Both percentages use **finite selected-channel readings only**. Missing, error and non-numeric counts are displayed separately. With no finite readings, percentages are null. There are no confidence intervals or independent-trial probabilities.

The default scatter calculation for Kapton yields 36 selected records, 35 finite readings, one missing reading (**AW50, test 51a**), and 20 readings below 2 V. Teflon yields 23 finite readings and 18 below 2 V. These reproduce a descriptive source-value recount; they do not mean 20 or 18 missed alarms. The workbook's separate `detection June 14` H158/O158 target is **2 mg/m³**, which does not validate a **2 V** cutoff.

`byMaterial` is an array of `{ material, materialRole, counts }`, with the same count fields as the overall result. `exportDetectorAnalysis` returns a detached JSON-safe copy of the exact selected analysis with its records, source hash, units and policy. No fresh threshold, count, or interpretation is generated for export. It has no nondeterministic timestamp.

## Unresolved CSV/workbook identity mismatch

The already captured SAME-R experimental-table CSV and this workbook both contain 109 relevant records, but a comparison of material and exact test label does not yield the same record set:

- CSV line 75 (including the header): `Teflon`, test `57`, “High RT/R0 reburn sample”; this combination is absent from flight-2 Material Sort.
- Workbook Material Sort row 57: A57=`2`, C57=`Kapton`, D57=`K15`, E57=`65 K`, G57=`112`, H57=`low flow run w STS`; this combination is absent from the CSV.

The CSV SHA-256 is `87164b7dc9168a4273c159f7a9f23699afbd06ad97b77974377e79b9bf8a3bef`. Both identities and their exact source locators are included in `detector-data.json`. This is an unresolved record-identity mismatch, not a claim of a NASA error. No automatic join, correction, omission repair or value substitution is applied.

## Reproduce and verify

Run the curation script with the repository's available Python interpreter in isolated mode:

```powershell
& 'C:/Users/Arbaz/AppData/Local/Python/pythoncore-3.14-64/python.exe' -I web/scripts/curate-detector-data.py --check
```

Omit `--check` to regenerate `web/data/detector-data.json`. The script refuses an unexpected workbook or condition-table hash and validates source headers and the 154-row selection. Optional local input paths are supported; it performs no network requests. Unit tests cover the source-count anchors, missing AW50, the BS59 error, absent/non-numeric values, equality, flight/reference filters, invalid cutoffs, identity conflicts, and consistent detached exports.

This addition was written with OpenAI Codex assistance on 15 November 2026. The broader scientific source audit and its access limitations remain in [lab note 05](lab/05_detection_completion_2026-11-15.md).
