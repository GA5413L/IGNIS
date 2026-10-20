# Implementation blueprint (for the authorized event window only)

**Nothing in this file has been implemented.** It is a plan to execute from **14 Nov 2026 09:00 local**, and only
after the official challenge statement (28 Oct) and the organizer ruling on pre-event material (U1/U2 in
`competition_rules.md`) have been read. If the challenge statement changes the target, revise this file first.

## 0. Decision gate D0 (first 30 min of the event)
- Is reuse of pre-event research files allowed (U2)?
  - **Yes:** import `research/data/*.csv` and the conflict register, and re-run `verify_transcriptions.py` on freshly downloaded PDFs.
  - **No or unknown:** re-download the sources and re-transcribe Tables S1, S2 and A.3 during the event, following `research/data/README.md`. Budget **2 h**. The verification check is what makes this fast and safe.
- Read the official statement and resources. Reconcile with `scientific_scope.md` before writing code.

## 1. The product in one sentence
A researcher picks a black-PMMA-rod question (or a reviewed example). IGNIS shows the result first: the actual
NASA/ISS measurements, the descriptive difference, and the one distinction that limits it. Below that come the
evidence decisions, and the user can export a dossier that reproduces every number.

## 2. Architecture: the simplest thing that can be credible
| Layer | Choice | Why |
|---|---|---|
| Records | CSV transcriptions → **one JSON bundle** built and validated by a Python build script | ~100 rows; no database server needed; the JSON carries source hashes and the rule-set version |
| Rule engine + comparison | **TypeScript pure functions** in the front-end bundle | one runtime and no backend; deterministic and unit-testable (Vitest) |
| UI | Next.js (static export) + TypeScript + Tailwind, as suggested in the brief. **Fallback** if the team is Python-only: Streamlit + Altair, with the same rules ported to Python (the research scripts already contain them) | pick by team skills at D0; do not run both |
| Chart | Vega-Lite (via vega-embed) | the spec is data, so the same spec goes into the dossier; points link to row IDs |
| Dossier | Markdown + machine-readable JSON, rendered to HTML/PDF with browser print | auditable; no PDF library needed |
| Language layer (optional) | an LLM maps free text to the structured query form, and the **user confirms** before anything runs. Explanations come from deterministic templates. An LLM paraphrase is allowed only if a checker confirms every number and decision in it matches the engine output | the LLM never produces numbers or decisions. The app must work with **no API key** (form input is the fallback) |
| Not used | graph DB, vector DB, orchestration frameworks, ML training | nothing in the data justifies them |

## 3. Canonical data model (minimal, mapped to what the sources contain)
Entities are written `Name{fields}`. `?` marks fields that are known to be absent in current sources; these stay
`null` with a reason and are never defaulted.

- **Source**{id, citation, doi/ntrs_id, url, sha256, licence, accessed_utc, version}
- **Investigation**{id: "BASS-II", platform: "ISS MSG", psi_id: "PSI-25"}
- **Specimen**{nasa_sample_number (e.g. 197m), material: {polymer: PMMA, grade: "cast", colour: black|clear|null}, geometry: {kind: rod, size_mm, size_kind: diameter|radius|unspecified, length_mm, end: hemispherical}, burn_sequence: [test ids]}
- **PhysicalRun** (= one burn){nasa_test_number, as_run, date, specimen, configuration: opposed|concurrent|stagnation|conflict, o2_cal_initial, o2_cal_final, igniter, air_display_sequence, observations, independence_group = specimen}
- **ProtocolSegment**{run, order_in_table, v_g_cm_s, dt_s(meaning: unknown), protocol_flags[]}
- **Measurement**{segment, endpoint_id (E-01…E-08), value_printed, unit_label_printed, value_normalised_um_s | {reading_a, reading_b} if unit conflict, statistic: single|mean_of_≥3, pm_printed, measurement_status: admitted|flagged|conditional|quarantined|indeterminate|inapplicable, provenance: {source, table, row_id, page}}
- **Claim**{text_quoted, source, page, endpoint_id, scope, conflicts[]}
- **Conflict**{id (C-01…), values[{source, location, value}], status, affected_records[], treatment}
- **Comparison**{question, A, B, difference_B_minus_A, units, sign, independence, uncertainty_status, confounders[], rule_version}
- Model and ValidationRecord exist only to state that **no model is used**. Reserved for later.

Derived variables are always marked derived: O₂ fraction = % / 100; µm/s = printed × 10 (cm/s reading). O₂
partial pressure is **not derivable**, because pressure is unknown.

## 4. Build order with time boxes (≈ 36 working hours; cut lines marked ✂)
| Hours | Step | Done when |
|---|---|---|
| 0–0.5 | D0 gate; read the statement; assign roles | written decision in DECISIONS.md |
| 0.5–3 | Records: build the JSON from CSVs (re-transcribe if D0 says so); validation script | verify script 6/6 PASS on fresh PDFs; schema validation passes |
| 3–7 | Rule engine (R1–R7) + comparison B − A; unit tests for the required failure modes (§6) | the 12 frozen tasks' decisions are reproduced by tests |
| 7–12 | UI: question form → **result card first** (numbers, difference, the key limitation) → evidence table with decisions → chart linked to rows | T01 and T02 work end-to-end |
| 12–15 | Negative cases in the UI: gravity (N1), endpoint guard (N2), quarantined headline (N3), LOC conflicts (N4) | T03–T06 work |
| 15–18 | Dossier export (MD + JSON + print-HTML), with source hashes and rule version | dossier numbers equal UI numbers (automated test) |
| ✂ 18 | **Minimum viable submission is complete here.** Everything below is optional | |
| 18–22 | Optional language layer, with the no-key fallback and the number checker | "AI changed the claim" test passes |
| 22–26 | Run the evaluation (M0/M1 by hand, M2) on frozen and held-out tasks; write results honestly | scoring sheet saved |
| 26–32 | Polish, accessibility, SI-usage statement, references, licences, demo video | submission checklist complete |
| 32–36 | Buffer | — |

## 5. Demo storyline (≈ 2 min)
1. **Result:** "In NASA's BASS-II ISS burn P4 (black PMMA rod, 9.5 mm, 18.5 % O₂), the spread rate fell from 32.5 to 26.9 µm/s as opposed flow was stepped from 2.00 to 1.73 cm/s." Show the actual rows.
2. **Distinction:** "That's one burn, in time order, and O₂ fell from 18.5 % to 17.1 % during it. It's a description, not a flow effect."
3. **Consequential limit:** (revised 20 Oct audit, D-017) show where **specimen identity changes a fire-safety reading**. μg spread is recorded at lower O₂ than any 1 g spread for 0.95- and 0.64-cm rods, but for 1.27-cm rods only through a reburned specimen (`research/adversarial_source_audit.md` §5). Then the gravity comparison: the numbers look equal, but the verdict is indeterminate, with the reasons. B16/B19 may appear only as one example of an open documentary conflict, with its evidence balance (the evidence favours opposed). **Never** say "NASA records show the headline series was concurrent".
4. **Output:** export the dossier and show it reproduces every number with page-level provenance.

Do not open with a list of AI technologies.

## 6. Required tests (from the brief), mapped to concrete fixtures
| Failure mode | Fixture |
|---|---|
| Incorrect endpoint substitution | T05: a Table 2.1 record offered for a rod query must be rejected |
| Unknown pressure/geometry | any request needing pressure returns "unknown", not 101.3 kPa |
| Percentage vs fractional O₂ | 18.5 vs 0.185 round-trip; a mixed input is rejected |
| mm vs cm | d 0.95 cm ↔ 9.525 mm match within tolerance; the "0.64 mm" claim stays a conflict |
| Opposed vs concurrent | B16/B19 quarantined (C-03) |
| Preheated vs unheated / thermal history | B9, B13b flagged as reburns; P22a "not preheated enough" note surfaced |
| Duplicated source runs | B22 duplicate 1.58 rows never averaged |
| Model output as measurement | Table 2.1 computation/theory columns are never typed as measurements |
| Incomplete/censored experiments | S2 "-" never becomes 0 or "extinction" |
| Ground/μg conflation | N1 classification INDETERMINATE |
| Conflicting source values | C-02 shows two readings; C-04 quarantines B15 |
| Missing-data eligibility | P17 colour → INDETERMINATE |
| Unsupported prediction | any "predict" request returns "no validated predictor" |
| Plot/text/export consistency | one snapshot test over all three |
| AI changing the claim | the paraphrase checker rejects altered numbers or decisions |
| Search truncation hiding contradictions | conflict lookup runs over **all** records for the selected burn, not top-k |

## 7. Risks
- Rule ambiguity (U1/U2) forces re-transcription → handled by D0 and the 2 h budget.
- Rivera et al. 2026 changes the picture (e.g. settles C-03) → read before the event and record a scope decision.
- Over-building → cut line ✂ 18 h; the language layer is optional.
- The evaluation shows no advantage over M1 → report it. The curated crosswalk and conflict register are still a legitimate data contribution.
