# Improvement research, event day 1 (14 Nov 2026, ≈20:00–20:30 PKT)

**Scope:** what would most improve IGNIS's score while the API keys are being fixed. This document follows on from `COMPETITIVE_RESEARCH_2026-11-14.md`.

**Retrieval:**
- Python `requests` with normal TLS verification.
- Each response is stored with URL, status, bytes, SHA-256 and UTC time:
  - `_raw/ntrs_2026-11-14/acquisition_log.json` (searches);
  - `_raw/ntrs_2026-11-14/pdf_acquisition_log.json` (PDFs).
- Text extracts are in `F:\ignis extra\tmp\ntrs_text\`.

**Nothing below has entered the registry yet.** Quotes are given with page locators and were read in the extracted text. They have not been visually checked against the rendered pages.

## 1. PSI investigation list: blocked, user decision
- The PSI site's own search endpoint (`/geode-py/ws/repo/search`) answered publicly on 20 Oct. It returned Elasticsearch hits with rich investigation metadata:
  - accession, title, PI, research area, platform, objectives, related investigations and dates;
  - **133** records in total, 25 per page.
- The site bundle (`_raw/psi/main.js`) shows why every pre-event query returned the same page: the client sends `term`, `type`, `from`, `size`, `sort` and `ffield`/`fvalue`, not `q`.
- **Today a fetch using those parameters was denied by this session's permission classifier as "unauthorized access".** I did not try to work around it.

**Options (your call):**
- **(a)** You open the public PSI catalogue (psi.nasa.gov) in your browser and confirm the list of combustion investigations.
- **(b)** You explicitly authorize read-only use of that public search endpoint.
- **(c)** Build coverage from NTRS only, as in §2.

Competitors cite PSI accession numbers (PSI-10, -20, -25, -26, -68, -69, -98 to -107, -115, -117, -142, -159), so the list is widely used.

## 2. NASA reports acquired today for the coverage gap (12 PDFs, all HTTP 200, all valid PDFs)

| NTRS ID | Title (short) | Adds to IGNIS | Bytes |
|---|---|---|---|
| 20210021781 | Recent Research on Flames of Gaseous Fuel Aboard the ISS (JASMAC, ACME) | Objectives and selected findings of the **six ACME experiments** (CLD Flame, E-FIELD Flames, Flame Design, s-Flame, BRE, CFI-G). The challenge names BRE, CFI-G and E-FIELD. | 1,336,135 |
| 20150023456 | Detailed Results from FLEX, Mar 2009 – Dec 2011 (Technical Publication) | Hardware, procedures and the first **284 tests**: conditions for FLEX beyond the current FLEX findings | 42,900,650 |
| 20160000593 | Combustion of Solids in Microgravity: Results from BASS-II | BASS-II sample types and variables (flow up to 53 cm/s, thickness, preheat, O₂); moves BASS-II beyond profile-only | 2,690,087 |
| 20130000422 | Particle Morphology and Size Results from SAME-2 (the reflight) | The SAME-R gap: five spacecraft materials (Teflon, Kapton, cotton, silicone rubber, Pyrell) | 757,824 |
| 20170007283 | Spacecraft Fire Safety Research at NASA GRC | Detection context (background aerosol, low-g smoke transport) | 5,334,550 |
| 20090014827 | Smoke Point in Co-flow Experiment (SPICE) | SPICE objective; a challenge-named investigation | 52,083 |
| 20210015913 | ACME on the ISS (poster) | ACME overview. **Text extraction returned 0 chars (image-only)**, so use the JASMAC paper instead. | 9,090,639 |
| 20160010073 | A Burning Rate Emulator (BRE) for Study in Microgravity | BRE concept: four properties emulate condensed-fuel burning | 2,569,159 |
| 20260002050 | **Surface Vehicle Atmospheric Considerations for Moon to Mars Exploration** (ICES-2026-324, Jul 2026) | Current NASA atmosphere context for the **Moon lens** (§3) | 894,240 |
| 20240008623 | Flammability of Materials on the Moon (FM², poster) | Partial-gravity context; the challenge names FM² as future PSI data | 1,617,123 |
| 20250010653 | LUCI: Flammability Results from a Rotating Sounding Rocket | Partial-gravity context; the challenge names LUCI as future PSI data | 2,906,408 |
| 20100015582 | Pressure Flammability Thresholds of Selected Aerospace Materials | MOC and pressure-threshold method context (prevention) | 1,184,613 |

Rights fields in the NTRS search records were empty (`copyright: null`), so each file's rights must be checked before quoting beyond short passages. The existing SOURCE_RIGHTS rule applies: short quotes, locators and links; no redistribution.

**Not found on NTRS by these searches:** FLEX-2, CFI, SAME-R by name, CFI-G, and SPICE results (as opposed to the objective). Absence of hits is not evidence of absence.

## 3. Moon-lens context (ICES-2026-324, NTRS 20260002050)
Exact passages from the extracted text:
- **p.3:** "NASA Artemis requirements for sustained missions are targeting an average pressure of 8.2 psi (56.5 kPa) and a 34% oxygen concentration as one solution to those trade-offs."
- **p.3:** "less is known about oxygen concentrations above 30% oxygen, leading to flammability concerns such that NASA teams have alternatively performed testing utilizing a vehicle atmopshere [sic] that stays below 30% (average pressure of 9.6 psi (66.2 kPa) and a 28.5% oxygen concentration)"
- **p.3:** "Generally, higher oxygen concentrations and/or higher oxygen partial pressures equate to a higher flammability risk."
- **p.4:** "Materials to be used in the 34% atmosphere, have typically been tested up to a 37% oxygen concentration"
- **p.4:** "a material that self-extinguishes in Earth gravity may continue to burn in lunar gravity." The paper attributes this to its reference [5].

**Design consequence (display only, no equivalence, no safe/unsafe):** the Moon lens can show three reference atmospheres, each with its source:
- the challenge statement: ≥30 % O₂ at ≤10.2 psi;
- the Artemis sustained-mission target: 8.2 psi / 34 %;
- the alternative test atmosphere: 9.6 psi / 28.5 %.

These sit next to printed test atmospheres already in the registry: Saffire VI event 5 at 31.0 % O₂ / 54.1 kPa and event 6 at 30.3 % / 54.6 kPa, all **as printed**.
- A kPa ↔ psi display conversion is a unit conversion, not a new physical result (M22).
- The page must say that **similar atmosphere ≠ comparable result**. Gravity, flow, material and geometry differ, and the O₂ basis of the Saffire values is not stated.

## 4. What this changes in the plan
1. **P0-2 coverage, now concrete.** Add investigation records with exact-quote objectives and conditions from the JASMAC ACME paper (6 experiments), the FLEX TP, the BASS-II results presentation, SAME-2 and SPICE. That takes IGNIS from 10 to about 18 investigations, with BASS-II and SAME-R no longer profile-only. LUCI and FM² enter as **partial-gravity context, not PSI data**, as the challenge itself says.
2. **P0-3 Moon lens.** Use §3. This is NASA's own current framing, and so far it is not in the competitor READMEs read.
3. **Differentiation** (from the competitive scan): lead with comparability contracts, the constrained and evaluated SI, and honest model-vs-experiment results. Provenance alone is now common.
4. **Name collision.** Two other repos are called IGNIS, and another project calls itself "Emberfall". A distinctive subtitle at minimum is your decision.

## 5. Open items
- PSI list: decision §1.
- Visual check of each quote against the rendered PDF page before it enters the registry. This is assistant-checked only, with no human review.
- Rights check per NTRS file.
- FLEX TP: only the first 40 of 314 pages were extracted.

---
**Correction (15 Nov ≈01:30 PKT):** §4.2 was wrong. The 34 % / 8.2 psia framing appears in most top competitor entries. It is table stakes, not a differentiator. What remains uncommon is the published Saffire V/VI near-exploration-atmosphere data and how to compare it (see `COMPETITOR_DEEP_DIVE_2026-11-15.md` §3).
