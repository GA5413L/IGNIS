# Professional fire tools: what IGNIS should learn and build next

15 November 2026. Bounded primary-source research by the authorized AI specialist team. No simulator or model was run, no physical predictions were generated, and no app code was changed. Findings distinguish source statements from our interpretation and proposed work. This is not an independent NASA review or an exhaustive software survey.

**Recommendation:** make IGNIS a useful preparation and audit layer for a scientific comparison: identify the quantity and observation operator, expose which data forced or calibrated the model, record uncertainty by source, and export an exact replay specification. FDS, CFAST and Cantera show that professional credibility comes from this chain of evidence, together with numerical and experimental evaluation. A new ML score or a visual flame would not provide that chain.

## 1. What the tools actually do—and documented NASA use

| Tool / workflow | How it is constructed and used | What this establishes for IGNIS |
|---|---|---|
| **NIST FDS** | A computational fluid-dynamics solver using large-eddy simulation for low-speed fire-related flow, particularly heat and smoke transport. Input files describe the mesh, geometry, materials, sources, boundary conditions and requested measurements. Physical models, numerical verification, experimental validation and configuration management are separately documented. | A mesh or material name alone does not specify an adequate model. The intended output quantity, supplied source terms and validation conditions matter. Actual FDS use in NASA-associated Saffire research is documented below. [Official description][NIST-project], [release documentation][FDS-manuals], [inspected case input][FDS-case]. |
| **NIST Smokeview** | Visualization/postprocessing of FDS and CFAST results, with its own manuals and verification material. It displays the solver output; the visualization is not another independently validated prediction. | Separate result existence, visual rendering and scientific validity in any future IGNIS replay. Do not call an animation a simulation merely because it resembles fire. [Official FDS/SMV site][FDS-home]. |
| **NIST CFAST** | A compartment zone model: upper and lower gas layers, each with a uniform temperature, evolving through mass/energy conservation equations and connected through vents and other submodels. It is built for fire environments in compartmented structures. | Useful comparison reference for building-scale aggregate quantities, not evidence that a uniform upper/lower-layer abstraction transfers to a zero-g cabin. That transfer objection is our physical inference; no NASA CFAST operational use was established in this review. [Technical reference, PDF pp.19–22 / printed pp.1–4][CFAST-tech]. |
| **Cantera** | Thermodynamics, kinetics and transport models feed zero-dimensional reactors and one-dimensional reacting-flow solvers. Mechanism files define species, thermochemistry, transport and reactions. Official examples expose mesh refinement, reaction-rate sensitivity and saved/restarted solutions. | Useful for a narrowly specified chemical/laminar-flame question. It is not, by itself, a spacecraft fire-spread or smoke-detector model. No NASA operational adoption is claimed here. [Science/API reference][CT-reference], [sensitivity example][CT-sensitivity], [restart example][CT-replay]. |
| **NASA model-use workflow** | NASA-STD-7009B distinguishes intended use, permissible/proposed use, model development, setup/execution, verification, validation, uncertainty and results assessment. Acceptance criteria are recorded for the actual use. | A structured comparison record is closer to professional practice than a universal confidence badge. Following a few concepts does not establish compliance or NASA acceptance. [Standard, PDF pp.20–21 and 28–35][NASA-standard]. |

The official NIST project page is unusually relevant to scope: it says the tools are strong at smoke/heat transport when fire size is prescribed, and identifies prediction of growth and spread from bench-scale material properties as a continuing research frontier. The site was updated in October 2026. This supports separating **prescribed-fire transport**, **material burning response**, and **detector response** in the product rather than treating all as one fire-risk target. [NIST Advanced Fire Modeling][NIST-project].

The inspected current releases were FDS **6.11.1**, CFAST **7.7.7**, and Cantera **3.2.0**. Their exact source commits are in Section 6. The FDS/SMV landing pages report different Smokeview bundle/standalone versions; we therefore do not invent one universal installed version. No package was installed.

## 2. A real NASA-associated use case: Saffire vehicle transport

The 2025 Saffire VI paper documents FDS vehicle modeling with geometry developed using PyroSim. Inlet/outlet measurements supplied heat/species source terms; remote cabin sensors supplied comparison histories. An effective cargo heat-transfer coefficient previously calibrated against Saffire V RS3 was reused. The authors also shifted simulated CO2 and temperature baselines to match each remote sensor's initial reading. They report agreement in some portions and locations, and discuss a remote-sensor dip not captured by the model. These details are in PDF pp.4, 6–8 and 11–12. [Primary Saffire VI paper][SVI].

**Our interpretation:** this is a conditional transport prediction with known forcing, calibration ancestry and comparison transformations. A successful comparison of remote CO2 after a supplied source history is not an independent prediction of the burning material's gas yield. Agreement after an initial-value adjustment is not evidence for the unadjusted initial concentration. Reusing a parameter calibrated in a previous campaign is scientifically meaningful, but the calibration event should remain visible. These distinctions are useful to a researcher; they do not negate the authors' reported transport results.

The existing IGNIS W1/W2/W3 contracts already address parts of this problem. The next improvement should make their data-role and transformation structure visible and exportable. It should not restate the paper's use of “verification” as proof that the software's numerical equations, every output, or a new gravity regime were independently validated. For a broader historical example, NASA's 2015 presentation explicitly describes FDS for detailed transport alongside a simpler one-dimensional model for parametric studies; the two served different questions. [NASA 2015 modeling presentation][NASA-2015].

## 3. What professional validation architecture adds

**Validation is quantity- and application-specific.** The release-pinned FDS overview says its guide compares predictions with experiments and quantifies differences, while fitness for a user's application remains the user's decision. It organizes comparisons by output quantity, not just by experiment. It also distinguishes blind, specified and open calculations. Access to the experimental result during setup changes the evaluation question; it is not automatically misconduct or invalid work. Older successful runs may need repeating with the version intended for use. [FDS validation overview, lines 5–35][FDS-overview].

**Uncertainty has several origins.** The FDS error chapter separates model discrepancy from uncertainty in inputs. Its comparison method uses experimental uncertainty and a model bias/spread description; an uncertainty estimate for a specific measured quantity is not a universal solver accuracy. Instrument response, data reduction, uncertain heat-release forcing and numerical resolution can all matter differently. IGNIS should record these separately and leave absent values unknown. It should not import a published percentage into unrelated microgravity cases. [FDS uncertainty chapter, opening and model-uncertainty sections][FDS-error].

**Numerical agreement is not physical validation.** The CFAST materials separate numerical verification from experimental comparisons. Its development process includes known-answer tests, limits and sensitivities; the verification guide contains mathematical/numerical checks. An application therefore needs both “was this implementation solved correctly?” and “does this abstraction reproduce the selected observation under these conditions?” [CFAST verification chapter][CFAST-verification], [CFAST validation overview][CFAST-overview].

**Replay is a maintained process.** FDS's configuration-management plan documents version control plus automated build, verification, validation and regression checks across revisions. This is a reason to preserve the solver version, input deck, data bytes, processing recipe and output identity together—not merely an image of a comparison. [Configuration plan, PDF pp.9, 24–25 and 31–34][FDS-config].

**Mechanism sensitivity and grid uncertainty are distinct.** Cantera's flame-speed sensitivity example uses a specified mechanism and computes sensitivity to reaction rates. A separate convergence example estimates the effect of grid size using an explicitly chosen extrapolation form. Neither operation establishes the mechanism's validity for a new fuel or solid-pyrolysis process. Its replay example saves and reloads YAML/HDF solutions and exports CSV, illustrating that a portable result includes state and configuration. All examples were read, not executed. [Sensitivity][CT-sensitivity], [convergence][CT-convergence], [replay][CT-replay].

## 4. Accessible material worth adding as reviewable resources

| Resource | What is accessible now | Appropriate next use and boundary |
|---|---|---|
| **NIST/NRC compartment experiment family** | Official experimental CSV repository; inspected Test 01 measurement-channel CSV and a separate `Time, Height, T_lower, T_upper` layer file. A corresponding release-pinned FDS input deck is public. The FDS experiment chapter describes 15 large-scale tests representing a nuclear-power-plant compartment. [Data repository][EXP-root], [channel CSV][EXP-channels], [layer CSV][EXP-layer], [input deck][FDS-case], [experiment description, section NIST/NRC][FDS-experiments]. | A concrete benchmark-package entry with links, version, quantity, environment and readiness state. **Not** new microgravity evidence. The layer file and point/instrument channels require different observation operators. Units, channel mapping, reductions and sentinel conventions need source review before admission. |
| **NASA Saffire VI paper and its antecedent model work** | Public paper; exact PDF bytes already acquired in IGNIS and re-inspected. The reported forcing/calibration/baseline operations are available, but this review did not recover a complete public executable input/output archive. [Paper][SVI]. | Immediately useful for a model-use lineage view. Record raw replay as **not established from available artifacts**, rather than saying the published simulation was reproduced. |
| **Cantera pinned examples and mechanism file** | Source for convergence, sensitivity, saved solutions and `gri30.yaml` is public. [Examples][CT-convergence], [mechanism][CT-mechanism]. | A professional-method reference card. A bundled mechanism is a model input, not experimental truth or a verified spacecraft-material mechanism. Do not add its example predictions to the observation catalog. |

The inspected CSVs contain values whose missing/sentinel semantics are not resolved by a numeric parser alone. We retained the bytes and did not reinterpret them. That is a useful admission boundary: a downloadable dataset is not automatically analysis-ready.

## 5. Three feasible improvements to today's app

These are **proposed, unimplemented features**, sized to reuse the existing registry, source inspector, deterministic assessment and export paths. They require no new physical prediction or ML fit.

### A. Quantity-specific comparison specification

Add a small researcher-facing panel to a model assessment with fields for: requested quantity; source observation; units/basis; location or spatial averaging; time window; instrument/derived operator; initialization and baseline treatment; output transformation; intended claim; missing requirements. Preserve original source values and display every conversion separately. Export this alongside the existing assessment.

**First concrete case:** Saffire VI remote CO2 response, with inlet/outlet forcing separated from remote sensing and baseline alignment disclosed. A temperature-rise comparison must not silently become absolute-temperature validation. A source-reported comparison remains labeled published, not locally rerun.

**Acceptance checks:** conflicting units or operators prevent a comparable status; an unknown operator remains missing; the export contains the same transformation/version shown on screen; changing the window creates a new comparison specification rather than replacing an observation. **Researcher benefit:** a collaborator can see exactly what could be compared before running an expensive solver. This follows the output-specific FDS guide and NASA intended-use requirements. [FDS overview][FDS-overview], [NASA-STD-7009B][NASA-standard].

### B. Data-role and independence view

Represent each existing observation/source artifact's role in a model use as **forcing/input**, **parameter calibration**, **comparison referent**, **initialization/normalization**, or **context**. Allow more than one role and show shared event/campaign, sensor, calibration or processing ancestry. A role is source-attested or explicitly unknown, not inferred from a matching label. Present unresolved dependence as a review question, not an automatic invalidation.

**First concrete case:** display Saffire V RS3 calibration → reused cargo heat-transfer parameter → Saffire VI transport run; separately show remote-sensor baseline adjustment → response comparison. The current detector inspector can similarly preserve common workbook/source ancestry without equating 134 rows to 134 independent trials.

**Acceptance checks:** a calibration observation cannot be relabeled as untouched external validation through export; dual-role observations are visible; adding a new specimen does not automatically establish independent errors. **Useful insight:** a comparison's independence belongs to a **quantity and use**, not to the paper or dataset as a whole. This is an inference supported by the inspected Saffire workflow and professional validation definitions, not a newly measured physical result. [Saffire VI][SVI], [NASA definitions, PDF pp.12–17][NASA-standard].

### C. Uncertainty and replay packet

Add a compact ledger with separate rows for measurement uncertainty, uncertain inputs, numerical resolution/solver settings, model discrepancy, and source disagreement. Each row records `reported / bounded / unknown / not_applicable`, source locator, units, method, applicable quantity/domain and dependencies. A reported bound must retain its definition; no default zero or invented probability. Bundle that ledger with source hashes, registry revision, tool/release, input/output identities, data-reduction recipe, exact query, execution status and missing artifacts.

**First concrete case:** an exportable Saffire comparison packet using existing evidence; a linked NIST/NRC benchmark package with “not imported / not run” status. This is a reproducibility handoff, not a server-side solver service.

**Acceptance checks:** file/version changes invalidate replay identity; missing artifacts keep reproduction status incomplete; unavailable uncertainties remain visibly unknown; an independent colleague can reconstruct the query and see why a model run is still necessary. **Researcher benefit:** a review-ready handoff that avoids repeating provenance and preparation work. [FDS configuration plan][FDS-config], [uncertainty chapter][FDS-error], [Cantera save/restart example][CT-replay].

**Is ML needed?** No ML is needed for these three operations; they require explicit semantics, source review and deterministic checking. ML could later help extract candidate metadata or provide a surrogate for a separately validated expensive model. Extraction still needs source checks; a surrogate needs its own target, training/calibration/test separation, supported domain, baseline comparison and external validation. It should not inherit validation simply because its labels came from a simulator. Chemical mechanisms may depend on experimental and theoretical molecular information, but that does not justify a quantum-computing module in the current product.

The immediate contribution is not a new flame law. It is an actionable answer to **“what evidence and transformations support this comparison, what remains unknown, and what must be supplied to reproduce it?”** Test usefulness with independent source review and a small blinded task comparison against a curated spreadsheet; do not infer utility from feature count.

## 6. Version, access and audit record

| Official source | Pin used |
|---|---|
| FDS 6.11.1 | `ff928dbf68a2623ced3a007be75391c6dc6c9f90` |
| CFAST 7.7.7 | `b43e74e0f43c704582c5782f5446597ce729a07f` |
| Cantera v3.2.0 | `4a8358eb80cfeb50474386b5f9ec0b3a83519889` |
| `firemodels/exp` data snapshot | `704e0d91f15088ae41c6a30a662a7524bf5ff4e8` (separately captured; not assumed identical to a solver release's data state) |
| NASA-STD-7009B existing PDF | SHA-256 `7b95a2065325dc3035c35ce110557d817555d3f22210ce5f6ce0bb2fb4ccd8b4` |

All new bytes, scripts, UTC times, URLs, status codes and hashes are under `_raw/professional_research_2026-11-15/tools/`; the consolidated record is `source_manifest.json`. **38 bounded verified-TLS GETs: 36 HTTP 200, two HTTP 404; zero body-hash mismatches.** The incorrect Cantera sensitivity URL was resolved to the official `flamespeed_sensitivity` page. The guessed FDS `validation.html` endpoint returned 404; the official public data repository and pinned documentation supplied the usable alternative. The web tool could not open Cantera's guessed `/science/index.html`; the documented reference index was used instead.

The 51 MB FDS and 20 MB CFAST validation PDFs were not downloaded under the 16 MiB response bound. Relevant release-pinned TeX chapters were inspected instead; the smaller CFAST technical reference and FDS configuration PDF were acquired and their selected pages extracted. Existing NASA PDFs were reused without duplicate downloads. `build_manifest.py` records the exact inspected PDF pages and their hashes. This report does not imply all manuals, experiments or software capabilities were examined.

NIST's official software page describes FDS/Smokeview as public-domain US-government software. Cantera's captured license is BSD-style. Experimental data, mechanism provenance, NASA papers and images still require their own source terms; none should silently inherit IGNIS's eventual code license. No NASA adoption, compliance, certification, runtime benchmark or new physical result is claimed.

[NIST-project]: https://www.nist.gov/programs-projects/advanced-fire-modeling
[FDS-home]: https://pages.nist.gov/fds-smv/
[FDS-manuals]: https://pages.nist.gov/fds-smv/manuals.html
[CFAST-tech]: https://github.com/firemodels/cfast/releases/download/CFAST-7.7.7/CFAST_Tech_Ref.pdf
[FDS-config]: https://github.com/firemodels/fds/releases/download/FDS-6.11.1/FDS_Config_Management_Plan.pdf
[FDS-overview]: https://github.com/firemodels/fds/blob/ff928dbf68a2623ced3a007be75391c6dc6c9f90/Manuals/FDS_Validation_Guide/Overview_Chapter.tex
[FDS-error]: https://github.com/firemodels/fds/blob/ff928dbf68a2623ced3a007be75391c6dc6c9f90/Manuals/FDS_Validation_Guide/Error_Chapter.tex
[FDS-experiments]: https://github.com/firemodels/fds/blob/ff928dbf68a2623ced3a007be75391c6dc6c9f90/Manuals/FDS_Validation_Guide/Experiment_Chapter.tex#L1847
[FDS-case]: https://github.com/firemodels/fds/blob/ff928dbf68a2623ced3a007be75391c6dc6c9f90/Validation/NIST_NRC/FDS_Input_Files/NIST_NRC_01.fds
[CFAST-overview]: https://github.com/firemodels/cfast/blob/b43e74e0f43c704582c5782f5446597ce729a07f/Manuals/CFAST_Validation_Guide/Overview_Chapter.tex
[CFAST-verification]: https://github.com/firemodels/cfast/blob/b43e74e0f43c704582c5782f5446597ce729a07f/Manuals/CFAST_Validation_Guide/Verification_Chapter.tex
[EXP-root]: https://github.com/firemodels/exp/tree/704e0d91f15088ae41c6a30a662a7524bf5ff4e8/NIST_NRC
[EXP-channels]: https://github.com/firemodels/exp/blob/704e0d91f15088ae41c6a30a662a7524bf5ff4e8/NIST_NRC/NIST_NRC_Test_01_file_1.csv
[EXP-layer]: https://github.com/firemodels/exp/blob/704e0d91f15088ae41c6a30a662a7524bf5ff4e8/NIST_NRC/NIST_NRC_Test_01_layer.csv
[CT-reference]: https://cantera.org/stable/reference/index.html
[CT-sensitivity]: https://github.com/Cantera/cantera/blob/4a8358eb80cfeb50474386b5f9ec0b3a83519889/samples/python/onedim/flamespeed_sensitivity.py
[CT-convergence]: https://github.com/Cantera/cantera/blob/4a8358eb80cfeb50474386b5f9ec0b3a83519889/samples/python/onedim/flame_speed_convergence_analysis.py
[CT-replay]: https://github.com/Cantera/cantera/blob/4a8358eb80cfeb50474386b5f9ec0b3a83519889/samples/python/onedim/flame_initial_guess.py
[CT-mechanism]: https://github.com/Cantera/cantera/blob/4a8358eb80cfeb50474386b5f9ec0b3a83519889/data/gri30.yaml
[NASA-standard]: https://standards.nasa.gov/sites/default/files/standards/NASA/B/1/NASA-STD-7009B-Final-3-5-2024.pdf
[SVI]: https://ntrs.nasa.gov/citations/20250002675
[NASA-2015]: https://ntrs.nasa.gov/citations/20150021283
