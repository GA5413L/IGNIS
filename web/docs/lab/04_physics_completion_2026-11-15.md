# Physics completion: atmosphere coverage, extinction and defensible transfer

**Prepared:** 15 November 2026, PKT. **Role:** AI research-team fire-physics specialist; no independent human review. **Scope:** consequential gaps after [lab note 01](01_solid_flammability_and_atmospheres.md), [lab note 03](03_modelling_and_transfer_methods.md), the [physics-transfer report](../../../DOCS/IGNIS_Physics_Transfer_and_Pareto_Decision.md), and master scientific principles/amendments. This is a focused completion, not an exhaustive review or a new physical prediction. No simulator, API inference, deployment or production change was run.

## Recommended contribution

Build a small, source-bound operation that answers **which actual burns address the requested atmosphere and observable, and which additional assumptions a stronger comparison consumes**. The evidence supports useful positive descriptions and conditional comparisons. It does not support interpreting a scalar condition-proximity score as physical equivalence or safety, a universal lunar flammability correction, or a new quantum module. A transparently defined descriptive proximity score is a design choice to evaluate fairly.

The most consequential additions are: a later SoFIE-GEL paper with pressure/oxygen campaign coverage and measured solid-heating effects; corroboration of completed RTDFS tests at elevated oxygen and reduced pressure; full-text limits of the 2026 centrifuge model; and exact Saffire VI sample identities. The recommendations below are design inferences. Their application behavior and user benefit remain **UNRUN**.

## 1. Correct the claims before building a demonstration

| Claim under review | Defensible conclusion | Evidence and boundary |
|---|---|---|
| “No real solid burned above 22.2% O2 or below about 1 atm.” | False as a statement about NASA experiments or the literature. | Multiple counterexamples below. Do not redefine a solid as only a rod, or exclude short-duration tests without saying so. |
| “No such solid burn appears in the acquired PSI tables.” | Potentially a statement about a particular acquisition, not a global scientific gap. | Requires the exact table set, retrieval date, inclusion rules, units/bases and treatment of unknown pressure. This task did **not** query PSI or inspect the competitor's table inventory. Papers alone do not prove present PSI availability or absence. |
| “The closest NASA burns to the Moon-base atmosphere aren't in PSI.” | Unestablished as written. | “Closest” needs a declared target, candidate corpus, quantities and metric; “aren't in PSI” needs a catalog/artifact audit. Atmospheric proximity does not establish the same gravity, flame mechanism, material or endpoint. |
| “Saffire VI burned cabin fabric at 31.0% and 30.3% O2.” | The first is SIBAL cloth; the second is **two-sided PMMA**. | The 2024 sample labels and 2025 event labels use different namespaces; bind them through material/configuration evidence, not identical numbers. [S1, S2] |
| “Moon atmosphere means one fixed pressure and oxygen percentage.” | Use an explicitly named habitat/vehicle scenario. | A 2026 NASA atmosphere paper describes 56.5 kPa/34% O2 as a sustained-mission target and also discusses 66.2 kPa/28.5% O2 testing. These are design contexts, not certified fire-equivalent environments. [S10] |

**Source-reported counterexamples, without treating their endpoints as interchangeable:**

| Source/configuration | Reported atmosphere and platform | What this actually establishes |
|---|---|---|
| Saffire VI sample VI-2 / event 5 | SIBAL cloth; **31.0 mol% O2, 54.1 kPa**; orbital Cygnus | A large solid fabric burn at oxygen-enriched reduced pressure. |
| Saffire VI sample VI-3 / event 6 | Two-sided PMMA; **30.3 mol% O2, 54.6 kPa**; orbital Cygnus | A different solid geometry; not a second fabric replicate. |
| Saffire VI sample VI-4 / event 8 | One-sided PMMA; **28.8 mol% O2, 55.2 kPa**; orbital Cygnus | Another joint condition and configuration. |
| SoFIE-GEL case 4, sample 1409C | ISS PMMA sphere; the reported pulsation starts at **26.25% O2**, with subsequent depletion; nominal one-atmosphere campaign | Burning above 22.2% is explicit in the case narrative, not merely the campaign's advertised upper limit. |
| RTDFS / Carmignani et al. 2026 | ISS acrylic sheets, **30 vol% O2 at 0.5 and 1 atm**, quiescent microgravity | Completed solid-fuel work at jointly stated elevated oxygen and reduced pressure; not a lunar-gravity experiment. |

Saffire rows come from Table 1 of [S1, PDF p.3] and [S2, PDF p.4], visually checked. In those source descriptions their flow setting is nominally 20 cm/s concurrent flow; S2 p.4 also describes flow reductions during burns to promote extinction. The later 2026 Table 1 caption instead says opposed flow: retain that unresolved publication conflict as documented in the [detection completion](05_detection_completion_2026-11-15.md). Do not turn a table setting into an unchanging time history. S2 reports unsuccessful Nomex ignition separately; that is neither a successful burn nor a general material certification.

The GEL case narrative and Table 1 were checked visually [S3, PDF pp.3,5]. The RTDFS paper is available here through the publisher's indexed abstract, corroborated by the investigator's NASA Task Book progress report [S5, S6]. Earlier counterexamples in lab note 01 also stand: Saffire V and the 2008 drop-tower cellulose tests. They need not be rediscovered or counted as new independent evidence.

**Recommended replacement headline — our wording:** “Compare published solid-fire evidence near selected exploration-atmosphere conditions, and see which conclusions survive changes in gravity, material, flow and measurement.” A narrower Saffire story can say “large orbital burns at oxygen-enriched reduced pressure.” Neither wording asserts uniqueness, catalog absence or lunar validation.

## 2. Consequential physics findings

### Atmosphere coordinates must remain separate

**Source reported:** The later GEL paper describes campaign ranges of 13–34% O2, 0.15–1.1 atm and 0.2–80 cm/s for 4-cm PMMA spheres. Its presented extinction map is explicitly for **one atmosphere**, and it reports that more solid preheating enlarges the flammable domain. [S4]

**Our inference:** These are not a Cartesian test grid. The abstract does not establish a burn at the simultaneous pair 34% O2 and 0.56 atm. It also does not provide an exploration-atmosphere extinction map ready for execution. Distinguish campaign capabilities/ranges, actual tested tuples, time-varying records and the subset analyzed in a paper.

The master’s restriction on `pO2 = xO2 × P` remains appropriate: absolute pressure, mole-fraction basis and contemporaneous values are prerequisites. Equal partial pressure is only equal partial pressure. The previously inspected 1-g pressure-threshold results in lab note 01 (PHY-08–10) cannot supply low-gravity coefficients. No new pressure/gravity scaling was derived here.

### Extinction is a process with an observation window

**Source reported:** GEL low-flow quenching and high-flow blowoff have different moving flame fronts. Case 5 continues as a shoulder-stabilized flame after local stagnation-region blowoff. The authors state that stretch rate alone does not capture all geometric extinction behavior, and heat loss is needed when interpreting a chemical/flow-time ratio. The case table prints pressures of 1.03–1.07 atm, despite the campaign's rounded one-atmosphere description. [S3, PDF pp.3,7–8]

**Our inference:** Store “local stabilization lost,” “remaining flame persists,” “complete flame extinction,” “spread stopped” and “test ended” as different events. A camera threshold or final frame cannot silently certify cessation of all combustion. A five-second survival test and a many-minute depletion experiment have different measured outcomes even if both use the term limiting oxygen.

### Thermal history belongs in the physical state

**Source reported:** GEL's later analysis uses embedded temperatures to characterize heat transfer into the solid; its extinction boundary is a band containing different preheat states [S4]. The investigator's report records sample reuse, 17 spheres and 54 tests, and a hardware interruption separating test periods [S7]. These are not 54 demonstrated independent specimens.

**Our inference:** Record the ignition sequence, elapsed heating, prior burns, relevant solid temperatures/gradients, atmosphere interventions, sample regression and campaign hardware history. “First logged” does not establish lifetime freshness. If thermal state is unavailable, preserve the descriptive result and mark history-dependent numerical transfer unresolved.

**Source reported:** RTDFS reports thickness-dependent spread and quenching, including oscillatory behavior and re-ignition near extinction [S5]. The NASA progress record additionally reports completed 30% and 40% oxygen tests; it does not provide an individually paired pressure for every 40% test [S6].

**Our inference:** Do not present the reported 0.1-mm result as a universal acrylic fire-prevention rule. Geometric thickness, thermal thickness, exposed faces, backing, timescale and initial temperature are distinct. An additive-containing grade, a char-forming fabric and a melting PMMA specimen require different material records and possibly different models.

### Confinement changes both transport and heat feedback

**Source reported:** The confined-combustion paper documents competing effects of baffle distance and surface type. Preflight calibration shows that local inter-baffle flow changes with clearance at the same imposed setting. Its baffle optical characterization is mainly visible-spectrum testing; the authors explicitly identify missing information at longer infrared wavelengths. A near-quenching case also prevents treating polished baffles as universally giving the fastest spread. [S8, PDF pp.4,8–9]

**Our inference:** “Transparent,” “black” and “reflective” are not complete thermal-radiation boundary conditions. Record the relevant spectrum and temperature dependence when a method needs them. Record flow location, calibration and confinement; do not attach a universal speed multiplier to a duct width or extrapolate a local apparatus optimum into a habitat layout recommendation.

### Gravity transfer needs the platform and the fuel phase

**Source reported:** The now-acquired 2026 centrifuge paper uses a **heptane-fed porous-bronze simulated candle**, compared with a model having prescribed fuel supply and fast single-step gas chemistry. The model omits radiation and soot, and does not calculate fuel-surface heat-feedback response. Later recirculation-induced changes are simulated; those changes were not observed in the limited drop duration. [S9, PDF pp.3–4,12–13]

**Our inference:** This strengthens the case for recording rotation rate, radius, orientation, chamber geometry, duration and flow history. It is a useful platform-mechanism source. It cannot serve as a reproduced solid-fuel extinction law or a centrifuge-to-lunar-surface conversion.

**Source reported:** The 2025 lunar-application testing paper describes material-dependent differences and an unresolved disagreement between ground forced-flow extrapolation and centrifuge results. It treats relevant buoyant velocity as undetermined. Its compensation factors depend on an assumed velocity and extrapolation, rather than being measured universal lunar offsets. [S11, PDF pp.7,9–11]

The current NASA FM2 page describes intended first lunar measurements and hardware/objectives [S12]. No completed lunar-surface burn dataset was established by this retrieval. A schedule, project description or illustrative centrifuge image is not evidence that a lunar-surface run occurred.

## 3. Where chemistry and quantum mechanics matter

**Chemistry affects the product through the model and measurement being claimed.** Material decomposition determines fuel-vapor supply and residue; finite gas reaction rates matter near blowoff; heat losses alter temperature and therefore reaction rates. A chemistry record must distinguish an empirical pyrolysis law, a global reaction, a reduced mechanism and detailed kinetics. Different levels can be appropriate for different outputs. A source-driven cabin transport model does not become a predictive burning model by adding a chemical formula to its display.

A concrete primary example is the published reduced MMA oxidation mechanism: its reported checks concern premixed flame speed and burner flame species at atmospheric pressure. Those checks do not validate a polymer's coupled solid/gas behavior in lunar conditions. [S13] IGNIS can preserve mechanism version, species/fuel identity, thermochemical/transport dependencies, calibration targets and validated domain without running that mechanism.

**Quantum chemistry has a real, specific upstream role.** A 2026 MMA kinetics study uses electronic-structure methods, transition-state theory with tunneling corrections and pressure-dependent reaction-rate calculations to update a chemical mechanism and assess ignition data. This is a legitimate route from molecular physics to reaction parameters. Its indexed abstract does not establish a validated habitat-fire model. [S14]

**Quantum computing is a different claim.** The inspected quantum-combustion paper uses Qiskit emulation of HHL for small reduced hydrogen/oxygen steady-state systems; practical uncertainty-quantification advantage and further statistical extraction are future work in that paper. It is not a measured speedup for NASA solid-fire prediction or evidence retrieval. [S15]

**Design decision, not a literature impossibility theorem:** Do not add a quantum module for this event. None of the proposed operations below needs a new reaction-rate calculation, electronic Hamiltonian or quantum linear solve. Molecular calculations cannot reconstruct missing pressure, specimen history, local flow or measurement definitions. A future chemistry project would first need a narrowly identified kinetic bottleneck, accessible rate/thermochemistry artifacts, sensitivity evidence, a coupled model and independent target-domain validation. Its comparison should include existing classical mechanisms and solvers. No such bottleneck or advantage was established here.

## 4. Minimum variables and eligibility rules

These are **task-dependent record requirements**, not a mandatory questionnaire for every user. “Eligibility” here means eligibility for a scientific operation, not competition eligibility.

| Requested operation | Minimum consequential facts | Return when missing or contradicted |
|---|---|---|
| Describe a reported burn | Source version/locator; experiment/sample/event namespace; material/configuration; reported observable and interval | Describe only the supported scope; show missing facts. |
| Search atmosphere coverage | Actual pressure/O2 tuple or explicitly marginal ranges; pressure reference; concentration basis; sensor/time basis; platform | Unknown pressure stays unknown; marginal ranges do not become an executed joint condition. |
| Calculate oxygen partial pressure | Absolute pressure, mole fraction or justified equivalence, contemporaneous values, original units | Unresolved if basis/pressure is unknown; output no flammability equivalence. |
| Compare spread rates | Same rate operator/front/statistic/window; material grade; exposed geometry; thermal/history state; flow direction and measurement location; confinement | Descriptive side-by-side may remain useful; numerical transfer needs an applicable reviewed method. |
| Compare extinction results | Initiation and intervention sequence; local/global endpoint; observation duration/censoring; atmosphere trajectory; flow regime; sample thermal state | Preserve survival, failed ignition and observed extinction as distinct outcomes. |
| Use a pressure/gravity correlation | Exact relation/version, joint domain, scale/property definitions, fuel/configuration, regime and endpoint, artifact availability, reproduction status | Candidate comparison plan if unrun; reject that route when its documented domain is contradicted. |
| Generalize uncertainty or combine evidence | Specimen/burn/segment/campaign lineage; shared apparatus/calibration; selection and fitting history; reported uncertainties and known dependencies | Do not count papers/segments as independent trials, or unknown covariance as zero. |

Numerical precision in a table is not its measurement uncertainty. A physical boundary band containing different preheat states is not automatically a confidence interval. Finite sample length, facility flow limits, terminated observations, unknown sensor lag and uncertain atmosphere history are separate uncertainty/coverage limitations. Preserve them separately from model-form limitations and unknown cross-study bias. Do not synthesize a percentage “confidence” score from missing fields.

## 5. Three implementable operations and their falsifiers

All are **proposals, unimplemented and untested in this task**. They extend the reviewed registry and current deterministic contracts; they do not require a new simulator or replacement architecture. Apply master amendment A-001 to conditional model candidates and retain A-002's unavailable-live-inference status.

### Operation A — Find the actual tested condition

Give each finding a joint-condition representation: exact reported tuple, time-dependent trajectory, marginal campaign ranges, or unknown. Show a short atmosphere table with material, platform and endpoint beside it. Bind the evidence to the acquisition corpus/date. A source can be relevant even when it cannot yield a requested numeric comparison.

**Concrete review case:** “Which reviewed solid burns used enriched oxygen and reduced pressure?” returns Saffire VI and RTDFS descriptions with their access limits. GEL's broad ranges remain a campaign-coverage lead until the requested joint case is verified. A PSI-only query restricts the evidence bank explicitly, rather than silently declaring a global gap.

**Falsifiers:** The operation asserts that GEL tested every combination of its ranges; it silently supplies missing rod pressure; it treats 23% oxygen mass fraction as 23 mol%; it calls a literature item absent from PSI without a catalog audit; or it merges the Saffire fabric and PMMA cases. Any such outcome defeats the proposed correctness benefit.

### Operation B — Explain what changed in the permitted comparison

For a reviewed route, check each necessary premise as satisfied, contradicted or unknown. Display `changed condition → affected assumption → source/method → permitted conclusion`. Keep useful source descriptions when a stronger route fails. An atmosphere-only change should not erase unrelated measurement or lineage findings.

**Concrete review case:** A user revises “describe orbital PMMA combustion at enriched oxygen” to “predict extinction in a 34% lunar cabin.” The description remains supported; the prediction requires a matched endpoint, material/thermal configuration, buoyant/forced flow and a validated transfer route. Another revision from source-driven Saffire transport comparison to independent fire-source prediction must expose the supplied-source dependency already covered by T1–T4.

**Falsifiers:** A changed display name alters scientific applicability; a changed endpoint leaves an incompatible route approved; unknown premises are treated as satisfied; or the engine rejects every cross-environment use despite an explicitly in-domain published method. Test useful positive results as well as justified rejection.

### Operation C — Compare the endpoint and history before the number

Add compact event/protocol records for finite-duration survival, failed ignition, local blowoff, continued residual burning, and complete extinction as defined by the source. Carry prior heating and shared-specimen ancestry into comparisons. The output is a supported descriptive contrast or a precise unmet prerequisite, not a fitted universal flammability surface.

**Concrete review case:** A five-second survival result and a later oxygen-depletion extinction result can both inform a research brief, while their thresholds remain ineligible for a direct “same LOC” subtraction without a reviewed mapping. The user can inspect exactly why.

**Falsifiers:** Local blowoff is reported as complete extinction; “test ended” becomes “flame extinguished”; a reused sphere is treated as a fresh independent sample; or an unspecified heating state produces a fabricated numerical correction. Adding a second publication of the same campaign must not increase independent replication count.

**Evaluation proposal:** Use a small adjudicated task set with positive, conditional and unsupported requests; keep related campaigns together when separating development and evaluation. Compare against an equally informed citation table and a retrieval assistant, measuring supported useful completion, consequential scope errors, researcher corrections and time. This task produced no performance measurements, novelty result or SOTA claim.

## 6. Primary-source access and exact locators

“Acquired” means original response bytes were saved. “Indexed” means content returned by web search; a publisher's full article was not acquired. Page numbers below are 1-indexed PDF pages. Sources may share experiments; source count is not replication count.

| ID | Primary source | Access and inspection in this completion |
|---|---|---|
| S1 | [Urban et al., Preliminary Results from the Saffire VI Experiment, ICES-2024-365](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf) | Reused local 7-page PDF; pp.2–3 text; p.3 Table 1 rendered/read. |
| S2 | [Saffire VI vehicle modeling, ICES-2025-156](https://ntrs.nasa.gov/api/citations/20250002675/downloads/Vehicle%20Modeling_FINAL.pdf) | Reused local 14-page PDF; pp.3–4 inspected, p.4 rendered/read. Existing T1–T4 findings retained from master; not numerically rerun. |
| S3 | [Li et al., Extinction of solid diffusion flame in microgravity, 2024](https://ntrs.nasa.gov/api/citations/20240007628/downloads/GELsymposiumfinalRev1.pdf) | Reused 9-page manuscript; abstract and pp.2–9 text inspected; pp.3 and 5 rendered/read. Five supplementary videos not acquired. |
| S4 | [T'ien et al., Effect of sub-surface solid heating, 2025, DOI 10.1016/j.combustflame.2025.114244](https://commons.case.edu/facultyworks/1290/) | Investigator institutional repository page/abstract acquired HTTP 200. Full PDF request HTTP 403; no table/figure dataset extracted. |
| S5 | [Carmignani et al., Quiescent acrylic-sheet flame spread, 2026, DOI 10.1016/j.proci.2026.106484](https://www.sciencedirect.com/science/article/pii/S1540748926004803) | Publisher indexed abstract inspected and captured; direct HTTP 403. No full methods or per-run table acquired. |
| S6 | [NASA Task Book: RTDFS final phase, FY2026/FY2025](https://taskbook.nasaprs.com/tbp/index.cfm?TASKID=2413F182B9F30E0CDB221036094EFF0F&action=public_query_taskbook_content) | Primary investigator progress report acquired HTTP 200; FY2025/2026 progress inspected. Same research lineage as S5. |
| S7 | [NASA Task Book: Flame Spread and Extinction Over Solid Materials, FY2026/FY2025](https://taskbook.nasaprs.com/tbp/index.cfm?TASKID=AB7D53A58994730B8E16F73F5BF545F7&action=public_query_taskbook_content) | Acquired HTTP 200; FY2025/2026 progress inspected. Shared GEL lineage with S3/S4. |
| S8 | [Li et al., Effects of Confinement on Flame Spread in Microgravity, ICES-2020-407](https://ntrs.nasa.gov/api/citations/20205004657/downloads/ICES-2020-407-final.pdf) | PDF acquired HTTP 200; 10 pages. pp.1–4,6,8–9 text inspected; no new figure values extracted. Earlier full-text inspection existed, but original bytes were not found in the repository before acquisition. |
| S9 | [Sharma et al., Centrifuge flame-dynamics CFD, 2026, DOI 10.1016/j.combustflame.2026.114808](https://ntrs.nasa.gov/citations/20260000641) | NTRS metadata and 15-page accepted manuscript acquired HTTP 200. pp.1–4,12–13 read; other passages searched. Full manuscript access closes the earlier abstract-only limit; not every figure audited. |
| S10 | [NASA atmosphere trade-space paper, ICES-2026-324](https://ntrs.nasa.gov/citations/20260002050) | Reused 9-page PDF; pp.3–4 text inspected. Scope is NASA design/trade context, not a new combustion experiment. |
| S11 | [Urban et al., Solid Fuel Ignition Testing for Lunar Applications, ICES-2025-392](https://ntrs.nasa.gov/api/citations/20250002114/downloads/ICES_2025-392-correctedcaptions.pdf) | Reused 12-page PDF; pp.7,9–11 inspected to resolve protocol, unmeasured velocity and extrapolation limits. No curves digitized. |
| S12 | [NASA, Flammability of Materials on the Moon](https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/flammability-of-materials-on-the-moon-fm2/) | Current project page acquired HTTP 200; background/objectives/hardware inspected. No completed-run record established. |
| S13 | [Bolshova et al., Reduced MMA oxidation mechanism, 2021, DOI 10.1134/S0010508221020040](https://www.pleiades.online/abstract/cesw/21/cesw0159_abstract.pdf) | Publisher's one-page abstract PDF acquired HTTP 200 and read. Full mechanism and full paper not acquired. |
| S14 | [Unraveling the thermolysis mechanisms of methyl methacrylate, 2026, DOI 10.1016/j.jaap.2026.107661](https://www.sciencedirect.com/science/article/pii/S0165237026000689) | Publisher indexed abstract/introduction inspected and captured; direct HTTP 403. No rate files, mechanism or validation dataset acquired. |
| S15 | [Becerra et al., How a quantum computer could accurately solve a hydrogen-air combustion model, 2022](https://pubs.rsc.org/en/content/articlehtml/2022/dd/d2dd00049k) | Indexed primary-paper methods/conclusions inspected and captured. Direct HTML/PDF HTTP 403; no circuit execution or hardware experiment performed here. |

Raw acquisition/provenance is contained in [`_raw/lab_completion_2026-11-15/physics/`](../../../_raw/lab_completion_2026-11-15/physics/): request status, URL, UTC timestamps, byte counts and observed SHA-256; local-source hashes and page-extraction manifests; four page renders; and a separately identified web-index capture. Failed direct requests remain failed records, not acquired papers. All direct retrieval used normal TLS verification. No authentication, account, author communication, PSI request or access-control bypass was used. Raw third-party artifacts are research captures, not proposed public-site assets.

## Remaining unknowns and event decision

The exact PSI snapshot and current catalog availability remain outside this physics audit. So do the requested individual reduced-pressure GEL cases, full RTDFS methods/data, complete atmosphere histories for many older tests, and validated cross-material/cross-platform uncertainty. Neither a source abstract nor a source's own model-validation language closes those gaps for IGNIS.

For the remaining event window, prioritize Operation A and one visible revision from Operation B, using the already implemented T1–T4 path for numerical depth. Add Operation C only where the reviewed endpoint/history records are ready. The concrete contribution is a reusable, testable account of what a requested use consumes and what a changed premise invalidates. Winning, SOTA and independent predictive validation remain unestablished.
