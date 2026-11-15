# IGNIS: cross-disciplinary improvement decision

**Research date:** 7 November 2026, Pakistan Standard Time. **Team:** Emberfall, Universal Event; one active builder, 2–3 reported members. **Status:** assistant-authored research and proposed design. No application, new solver execution, independent scientific review, user study or demonstrated software advantage.

## 1. Recommendation and what changed

**Keep validation planning, but make its central operation the derivation of a specific, qualified comparison claim from a model version's actual information use.** A list of input/calibration/target labels is insufficient. The revised output must say what quantity can still be tested, what has already been imposed, which uncertainty or history remains unresolved, and exactly which conclusions change after a revision.

One primary enhancement is selected: **claim-specific comparison and revision**. Add only two small supports: an explicit measurement/transformation record and a separate asset-readiness view. These are parts of one usable workflow, not three research programmes.

The new scientific operation is concrete. Given a prediction aligned to a measured initial concentration, derive a comparison of subsequent concentration changes; do not count initial agreement as validation. Given a source normalized to a measured total, retain possible conditional spatial/transient comparisons while withholding an independent-total claim. Given a different requested model boundary, preserve the old run and its information history, and identify what a genuinely new model would have to predict. The current report already anticipates conditioning and response increments; this proposal makes that reasoning explicit, versioned and testable rather than crediting it as an entirely new insight.

**New evidence changes the recommendation in four ways.**

1. The inherited Saffire V/VI interpretation survives checks against the original methods. It supports a useful conditional comparison, not a general independence certificate. A changed question cannot transform the published transport calculation into a combustion prediction.
2. An author-posted full-text version of the **2026 Saffire heat/smoke paper** was recovered through ResearchGate's readable text. Its differing clock conventions and detection-observable definitions reinforce the need for an explicit measurement record. Its PDF download returned 403; new table numbers have not been visually verified and are not adopted here. The separate 2026 spacecraft-prediction follow-up remains **abstract-only**.
3. A genuinely different context was acquired: **NIST/MaCFP anaerobic PMMA gasification**, including experimental CSVs, submitted prediction CSVs, a material-property calibration record and an FDS input deck. This supports a worked comparison outside Saffire. Negative tared mass readings are meaningful; clipping them would corrupt the observable. The poster and archived input describe different heat-transfer coefficients, so publication identity is insufficient to identify a numerical run.
4. Strong prior art is closer than a generic evidence graph: **PrIMe already specifies quantities of interest, transformations, uncertainty bounds and instrument-model parameters; MaCFP already distributes calibration and validation artifacts.** IGNIS's credible contribution is easier construction, revision and audit of claim-specific plans across this evidence—not invention of provenance, calibration separation or validation mathematics.

The decision is stronger scientifically and more demanding commercially: a researcher with an equally informed worksheet can reproduce every answer below. Adoption depends on reducing correct revision and audit effort enough to repay curation. That remains a hypothesis.

## 2. State recovered and dependency map

The complete competitive-core report was read, with the earlier research report used for scientific and competitor context. Repository instructions, decisions, blockers, chronology, source/access records, endpoint definitions, conflicts, cases, evaluation proposals and implementation gates were inspected. HEAD was **95a6a99**; earlier uncommitted work was retained. The older report's claim-reconstruction recommendation, the newer validation-planning recommendation and this proposed refinement remain separate historical stages.

No complete synchronized Saffire series or runnable Saffire model package was acquired. The new MaCFP files improve access for that particular context; they do not repair Saffire access. All examples selected by this assistant are development material. The rod data remain a control: 52 microgravity and 46 ground rows are not 98 independent experiments; the 27-burn log and specimen/history links matter. No renewed claims of fresh specimens, known oxygen trajectories, unchanged carried-over atmosphere, causal airflow effects or resolved B16/B19 direction are made.

The dependency map explains research depth. Physical boundaries determine the predicted quantity; instruments determine the observed quantity; actual information use determines what agreement means. Software can preserve these distinctions but cannot supply missing physics.

~~~mermaid
flowchart TD
    Q["Research question and intended use"] --> P["A–C: physics, environment, detection chain"]
    P --> B["Model version: what is predicted and supplied"]
    O["E: instruments, clock, processing and uncertainty"] --> T["Comparable observation and prediction"]
    B --> T
    H["F–H: fitting, shared information, excitation and transfer"] --> C["Claim-specific comparison"]
    T --> C
    V["D: numerical verification and validation evidence"] --> C
    I["I–J: identity, provenance, contracts and revision history"] --> B
    I --> O
    C --> R["Useful result, limits and changed conclusions"]
    R --> L["L: justified missing measurements or assets"]
    R --> U["K, M, N: checked AI interaction, readable view and export"]
~~~

“Deep” below means the relevant methods and consequential source details were examined, not mastery of an entire discipline. “Screened” means enough to make an inclusion/exclusion decision; “deferred” identifies work that needs additional data or a separate programme. This is a decision-oriented review through the research date, not an exhaustive survey.

### A. Combustion chemistry and material behaviour — deep for model boundaries; broader chemistry deferred

**Decision:** does the model predict fuel decomposition/chemical heat release, or transport measured products? Established practice separates material characterization, pyrolysis, gas-phase reaction and heat feedback. Current MaCFP work couples multi-scale calibration with uncertainty analysis; the inspected NIST kinetics paper examines probabilistic parameter estimation, not a universal material predictor. Accessible resources include the Saffire papers, MaCFP property JSON, calibration data and FDS decks. Material name alone omits formulation, thickness, backing, melt/char behaviour and thermal history. **Change:** require a declared physical source model and input list before offering a burning-validation target. **No addition:** no event-time combustion predictor, soot-yield inference or transfer from a PMMA rod to a backed slab. [V24], [VI25], [M1], [M2], [M3], [M4], [UQ]

### B. Heat/mass transfer, fluids and habitat environments — deep for the inspected transport cases

**Decision:** which transport response and environment does a comparison address? Established methods use conservation, ventilation, mixing, radiation/convection and geometry-specific boundary conditions. Current validated simulation infrastructure already handles much of the numerical work. In Saffire, source-region treatment and cabin losses differ from combustion chemistry; a fitted effective cargo coefficient is not a universal material constant. Nominal flow, oxygen fraction or fuel name does not fix the evolving environment. **Change:** record source domain, receiving domain, time-dependent boundary inputs and environmental applicability separately. **No addition:** no lunar interpolation, universal microgravity/1g bound, or numerical similarity score without the governing assumptions. [VI24], [VI25], [FDS]

### C. Aerosols, detection and suppression — screened; one detection interpretation retained

**Decision:** does a record test smoke production, transport to a sensor, instrument response, alarm logic or suppression? These are separate stages. Established aerosol/instrument models include deposition, particle-dependent response and transport delay; the 2026 Saffire paper supplies a concrete detection-chain example. Its DustTrak reference crossing and a flown alarm event are different observables; the direct path toward the detection unit limits transfer to another ventilation layout. **Change:** support one sourced detection interpretation/navigation task that identifies the measured stage and required clock/threshold definition. **Defer:** numerical alarm-delay prediction, aerosol aging/deposition estimation and suppression effectiveness. SAME/SAME-R and FLEX retain navigation roles; spread, droplet extinction and cabin-fire suppression are not substituted for one another. [H26], earlier report's source inventory

### D. Computational physics and verification/validation — deep for the workflow distinction

**Decision:** what evidence makes a comparison credible for its intended use? FDS separates numerical verification from comparisons with experiments; its validation overview leaves application acceptance to the user. NASA's current modelling handbook also distinguishes intended, proposed and actual use. Mesh/time-step studies, conservation checks, input sensitivity and model discrepancy require substantive analysis; possessing an FDS file proves none of them. **Change:** export separate statuses for code/solution verification, empirical comparison and intended-use acceptance. **No addition:** no “validated model” badge derived from a paper title or schema pass. Current FDS documentation is version 6.11.1; Saffire and the MaCFP artifact use older versions, which remain distinct. [FDS], [NASA]

### E. Metrology and instrumentation — deep; materially changes the selected mechanism

**Decision:** what does the sensor-derived number actually measure? Established measurement models include calibration, units, location, lag, baseline, synchronization and covariance. The GUM explicitly covers shared instruments/reference data; FDS distinguishes gas temperature from a modelled thermocouple response. Frontier probabilistic treatment cannot rescue an unspecified measurement chain. Accessible evidence includes source equations, the NIST apparatus procedure and CSV headers. **Change:** record the measurement operator, time origin, averaging, tare, exclusions and whether each choice used the target response. Unknown lag or covariance remains unknown. Instrument calibration is distinct from fitting a transport parameter. **No addition:** fabricated sensor corrections or uncertainty intervals. [GUM], [FDS], [M1], [M2], [M3]

### F. Statistics, inverse problems and uncertainty — deep for interpretation; numerical inference deferred

**Decision:** which part of agreement survives fitting and correlated errors? Established approaches include joint input/target uncertainty, parameter identifiability, residual checks and explicit model discrepancy. The inspected NIST Bayesian kinetics work demonstrates parameter compensation; its likelihood/prior assumptions and computational requirements must not be transferred automatically to these data. O'Hagan's model-discrepancy work was screened at author-abstract level only. **Change:** distinguish conditioned quantities, remaining response features and unresolved dependence; report measurement, fitted-parameter, structural and source-assertion uncertainty separately. **No addition:** independent-sample counts from sensor points, Bayesian-looking confidence from missing information, or automatic degrees-of-freedom corrections. [UQ], [GUM], [DISC]

### G. Causal inference, transportability and information reuse — screened, with deep case-specific history review

**Decision:** what information influenced a model, and what transfers to another setting? Selection diagrams and causal transport theory make transfer assumptions explicit; they need a defensible causal structure and target-domain information. A bibliographic dependency graph supplies neither. Post-response parameter selection, geometry adjustment and exclusions can affect evaluation even when no target column enters a solver. **Change:** preserve construction, tuning, selection and evaluation history, including unknowns. Describe a conditional transport response without claiming the causal effect of oxygen, gravity or ventilation. **Defer:** do-calculus, causal discovery and transportability certificates. Source matching is a retrieval aid, not an identification theorem. [TR], [V24], [VI24], [VI25], [M2]

### H. System identification and control-oriented modelling — screened; automated diagnostics deferred

**Decision:** can the available input/output histories inform the proposed dynamic response? Established system identification uses sufficiently informative excitation, distinct estimation/evaluation data and residual diagnostics. Schoukens and Ljung show why nonlinear structure, noise and experimental design matter; simple models can remain useful within the right task. A single fire transient and final total do not establish observability or unique cargo-loss parameters. **Change:** request input timing, sampling and the response feature needed for the claim; distinguish steady closure from transient response. **No addition:** controller, system-identification toolbox integration, observability rank or identifiability verdict from metadata alone. [SYS]

### I. Scientific databases, ontologies and provenance — deep for the relevant representations

**Decision:** can experimental identity, transformations and dependencies survive retrieval and revision? OntoChemExp already connects experiments to calibration workflows. PrIMe's quantities of interest include conditions, bounds and transformations; its B2BDC analysis can include instrument parameters. PROV provides interoperable entities, activities and derivations. **Change:** reuse those concepts in a small versioned record set; distinguish a cited document from an activity that numerically consumed a measurement. Explicit review coverage and unresolved use are mandatory. **No addition:** a new universal combustion ontology or claim that missing edges establish independence. RDF/graph infrastructure is unnecessary for the small event corpus. [ONTO], [PRIME], [PROV]

### J. Formal methods, scientific workflow and assurance — screened; small contracts selected

**Decision:** can a plan be internally consistent and show the consequences of revision? Typed contracts and requirement/evidence traceability are established; SHACL validates data against declared constraints, not against the physical world. **Change:** a small declarative rule set checks quantity/clock compatibility, consumes reviewed information-use records and returns a traceable explanation. Version changes invalidate affected claims, not every record. **No addition:** theorem prover, safety certificate, NASA approval claim or proof of complete lineage. The guarantee is limited to consistent application of stated rules to supplied records; source interpretation and real-world completeness remain review obligations. [SHACL], [PROV], [NASA]

### K. Scientific AI, extraction and retrieval — screened against current methods; bounded runtime role selected

**Decision:** where does AI reduce task effort without inventing scientific facts? OpenScholar is a serious retrieval/synthesis comparator. A July 2026 citation-faithfulness preprint shows why verifier choice and deployment/calibration mismatch matter; its experiment holds retrieved context fixed. Neither validates IGNIS dependency discovery. **Change:** use one structured runtime call to interpret a research question and explain already-derived claims with supplied evidence identifiers. Deterministic checks and editable fields constrain it. **Defer:** automatic table ingestion, autonomous role discovery, agent teams, model training and probabilistic citation guarantees. Table text still needs visual/semantic checking; a supported quotation is not proof that a whole scientific conclusion is justified. [OS], [AI26]

### L. Experimental design and value of information — screened; numerical optimization deferred

**Decision:** which missing observation would make a specific claim testable? Bayesian design can optimize expected information gain or decision utility when a model, uncertainty distribution and experimental cost are specified. None is complete for the Saffire planner. **Change:** derive a claim-specific acquisition sequence: first establish clocks and source provenance, then obtain the target histories and numerical verification needed for the chosen response. A second measurement channel can help discriminate thermal versus transport explanations, but information gain is unquantified. **No addition:** “optimal next experiment” rankings or dollar-valued information without a loss/cost model. [VOI], [SYS], [M1]

### M. Human factors and visualization — screened; empirical usability work deferred

**Decision:** can a researcher see and correct the condition that changes a conclusion? Munzner's nested model separates domain-task validity, abstraction, interface and algorithm performance. A polished diagram cannot fix the wrong task. **Change:** show the allowed comparison first, its imposed quantities beside it, and the revision difference with source links; expose detailed lineage progressively. Use text status labels, keyboard-operable controls, readable tables and accessible contrast. **No addition:** a graph wall, decorative 3D cabin or untested claim that visualization improves scientific decisions. Evaluate correction effort and accuracy, not preference alone. [VIS]

### N. Research software engineering and interoperability — deep for available artifacts; integration deferred

**Decision:** can another researcher reconstruct the exact plan and know what can be executed? MaCFP's CSV/property/deck files demonstrate practical reuse; source, solver, preprocessing and output identity must still match. **Change:** export human-readable claims plus machine-readable records, locators, hashes, rule version and missing assets. Keep source/model versions and caches explicit. Treat retrieved content as data, and validate structured AI output before rendering it. **No addition:** claimed FDS compatibility without a tested adapter, automatic execution of uploaded code, or a runnable-package label for a document-only plan. This transfers useful workflow ideas from other simulation fields without pretending to review every domain. [M1], [M2], [M3], [M4], [PRIME], [FDS]

## 3. Frontier and the strongest alternatives

The closest scientific infrastructure already does more numerical work than IGNIS proposes. PrIMe/B2BDC constructs model–data consistency problems using quantitative bounds and numerical models; its result is conditional on those bounds and model choices. We have neither the inputs nor the event capacity to reproduce that capability. OntoChemExp already implements experimental retrieval, sensitivity analysis and calibration. MaCFP is a stronger artifact baseline than an unstructured literature folder. These findings rule out “first combustion knowledge graph,” “first validation planner,” and “new calibration/validation mathematics” claims.

The practical competitor remains an expert's **same-information worksheet plus a strong source-grounded assistant**. Give it all reviewed use records, transformations, conflicts and rule descriptions. A spreadsheet can derive the residuals and track versions below. A good assistant can explain them. IGNIS must earn its place through reliable propagation across multiple claims, repeated revisions and portable audit—not by hiding the hard curation from the comparator.

The earlier pinned product audit remains applicable: MicroFire already has evidence/coverage planning and Saffire VI records; Fotia has investigation views and retrieval; declared synthetic demonstrations are not physical validation. Current public heads were checked: MicroFire **acb9aaa69486154da657c61469d3a1886e4c12b1**, Fotia **01e3842cdfd55be45bbd15ec1ab6e8d0816b3f8f**, unchanged from the earlier audit. Their applications were not executed here. This audit does not establish that competitors lack every proposed operation.

The credible frontier for IGNIS is **correct, economical maintenance of conditional validation claims under changing model and measurement records**. General scientific-AI reasoning, causal transport, formal verification and predictive fire modelling are adjacent research frontiers, not capabilities delivered by adding their names.

## 4. Three enhancement candidates and one choice

| Candidate | Exact operation and improvement over the current plan | Evidence, prerequisites and cost | Decision and failure condition |
|---|---|---|---|
| **1. Claim-specific comparison and revision** | Input: model/run version, actual information use, observation definitions and requested claim. Output: a qualified claim, eligible comparison quantity/metric, exclusions specific to that claim, unresolved review items and a revision difference. Applies reviewed transformation rules and traces their dependencies. | Saffire baseline/normalization and NIST tare/version cases below support the need. Requires human source interpretation. Reuses provenance and quantity-of-interest concepts; algorithmic novelty is not established. Highest cost is curation, not graph storage. | **Select.** Reject if the rules cannot retain useful conditional tests, silently promote unknown use to independence, or offer no benefit over an equally informed worksheet. |
| **2. Quantitative informativeness/identifiability assessment** | Input: executable model, parameterization, input/output histories, noise model and sensitivities. Output: evidence about which parameters or competing mechanisms the experiment can distinguish. Goes beyond relevance matching. | System-identification, UQ and experimental-design literature support it. We lack the required Saffire assets; MaCFP alone does not validate a general diagnostic. Several days to weeks of scientific work, not a small event addition. | **Defer.** Retain only a request for the response features needed by a claim. Fails if metadata is used as a substitute for numerical identification. |
| **3. Runnable validation/replay package** | Input: compatible data, deck, solver version, processing and protocol. Output: reproducible comparison with verified provenance and metrics. Resolves the gap between a plan and executed evidence. | MaCFP provides a real starting package; Saffire does not. Matching the NIST deck to submitted outputs and resolving version differences still needs work. Solver integration, packaging and verification displace the core. | **Defer full replay.** Select only a small manifest/readiness support. Reject “runnable” until a clean reproduction succeeds; mere file availability is insufficient. |

**Supporting change 1:** an observation/transformation record is needed for candidate 1 to distinguish sensible heat, chemical heat, baseline change, tare and clock origin. **Supporting change 2:** show scientific relevance, review coverage, acquired assets and execution status separately. Neither receives an arbitrary confidence score. A relevant but incomplete Saffire case can rank ahead for the research question while a MaCFP case is more ready for replay.

Added event work should replace the ambiguous scope toggle and generic confidence badges in the older concept. It should not extend the 23-hour assumption with three new subsystems. The measurable benefits are fewer incorrect claim admissions, more useful correct comparisons at the same error level, and lower revision/audit effort. None has yet been measured in users.

## 5. Worked cases

### Case A — Saffire V/VI: preserve conditional information

**Question:** can the published cabin-transport model be compared with remote CO₂ or thermal responses, and what would agreement establish?

The load-bearing source reconstruction was checked against the original papers:

| Record | Source finding and precise location | Consequence for this research case |
|---|---|---|
| V source construction | V24 pp. 5–6, Eq. 2 and accompanying text: RS3 supplies an outlet proxy; the integrated CO₂ source is scaled using the remote-sensor inferred total. | The remote total participates in constructing the input. Treating its subsequent agreement as an independent total prediction is circular. |
| V cargo loss | V24 p. 7: effective h = 150 W/(m² K) comes from the V cotton RS3 temperature fit. | Preserve this parameter's calibration lineage when it is reused. |
| VI measurement/model boundary | VI24 p. 2: outlet sensing moved to a verified mixing location. VI25 pp. 4–6: measured inlet/outlet histories construct source inputs; combustion itself is outside the model. | VI supports a different source/response comparison from V; it still conditions on the measured fire. |
| VI initialization and response | VI25 pp. 7–11: remote predictions are initially aligned, close total consistency coexists with transient/spatial discrepancies. | Initial agreement, final mass consistency and dynamic response are different claims. |

References: [V24], [VI24], [VI25]. Event identities must be explicit: VI sample 3/two-sided PMMA is model event 6; sample 4/one-sided PMMA is event 8. SIBAL is model event 5. Do not join solely on an integer called “test.”

**Before — the current proposed planner.** It returns VI as a candidate conditional transport test, labels measured source histories as inputs, retains V calibration, and warns against an independent V mass-total claim. It can suggest response increments and missing raw data. It does not yet define a complete operation tying every proposed metric and revised conclusion to preprocessing/history.

**After — the additional output.** It produces separate assessment rows for initial concentration, final inferred mass, transient concentration change and thermal response. Each row states its own conditioning and review gaps. A problem in one row does not erase the others.

**A1. A positive consistency calculation with a limited claim.** Recalculation of published rounded V values gives 54.4 / 29.9 = **1.819398**, and 29.9 × 1.82 = **54.418 g**. That is a check of source normalization, not a new mass prediction. VI source versus remote-inferred totals give the following descriptive differences, using the remote total as denominator:

| VI event | Source / remote-inferred mass | Calculated relative difference |
|---|---|---|
| SIBAL, event 5 | 46.5 / 46.8 g | −0.64% |
| Two-sided PMMA, event 6 | 127.8 / 128.1 g | −0.23% |
| One-sided PMMA, event 8 | 130.8 / 130.3 g | +0.38% |

These values are from VI25 pp. 7, 9 and 11; percentages are this report's arithmetic. They do not measure a reproduced CFD error, independence, or dynamic accuracy. Their useful result is narrower: the published source and remote-inferred totals are closely consistent under their stated conversions. Shared density, volume, composition or calibration assumptions could affect both. No covariance matrix was acquired.

**A2. Derive what remains after initial alignment.** Suppose the plotted prediction is

~~~text
aligned_prediction_i(t) = f_i(t; source, parameters) + a_i
a_i = observed_i(t0) - f_i(t0; source, parameters)
~~~

Agreement at t0 then follows by construction. A candidate comparison that exposes remaining response information is

~~~text
response_error_i(t) =
    [f_i(t) - f_i(t0)] - [observed_i(t) - observed_i(t0)].
~~~

This derivation is our analysis, not a newly executed Saffire result. It yields an actionable plan: compare changes at specified sensor locations and times, conditional on supplied source histories, initial observations and the inherited parameter set. Baseline subtraction does not remove baseline uncertainty; it can correlate errors across the whole trace. Specify units, location, common clock and a fixed window before a future evaluation. If an analyst later shifts time to match a peak, arrival timing ceases to be an untouched test, even if amplitude/shape comparison remains useful.

For V, conditioning on the source proxy and normalized total still leaves possible spatial or transient discrepancies to examine. Those residual features are not automatically statistically independent of the proxy or total. Do not manufacture a holdout by dropping RS3 after using it to construct the source. For VI, the measured source is a legitimate input for a transport question. Calling that input “post-fire information” does not invalidate a deliberately conditional transport study.

**A3. Repair quantity matching.** Oxygen-consumption chemical heat release and sensible heat carried from the flow unit into the cabin are different quantities. The source formula involving heat capacity, density, volume flow and inlet/outlet temperature difference defines the latter. VI24's 1,280 kJ chemical-energy entry and VI25's 497 kJ cabin heat addition for the two-sided case must not become an error or efficiency ratio without a common energy balance, boundary and integration window. A unit check alone cannot establish comparability. The revised planner returns a compatible thermal-response proposal and separately identifies what a chemical-release claim would require. [VI24] (Table 2, p. 6); [VI25] (Eq. 1, p. 6 and p. 9)

The recorded source construction should retain these definitions, with consistent units:

~~~text
sensible_heat_addition_rate = cp × air_density × volume_flow × (Tout − Tin)
CO2_mass_generation_rate = air_density × volume_flow × (Yout − Yin)
~~~

Here Y is mass fraction, not a ppm reading inserted unchanged. V adds the documented normalization factor to its proxy construction. Density/composition assumptions, flow history and integration windows belong to the derivation record; the same assumptions can connect apparently separate source and target estimates. The formula specifies an observable, not an independent error model. [V24] (Eqs. 1–2); [VI25] (Eqs. 1–2)

**A4. Incorporate 2026 evidence without silently replacing earlier records.** The recovered H26 text distinguishes an ignitor-off reference in the flame-growth analysis from other experimental clocks, treats some gas values as increases above background, and uses a specified smoke reference crossing. It also notes the detection unit's flow-path context. These facts make automatic merging unsafe. Its text-layer table differs from earlier tabulated reporting and includes a flow-direction wording discrepancy with VI24. Because the H26 table was not visually inspected, numerical updates and resolution of that wording are **unresolved**, not corrections. A changed source assertion invalidates only affected comparisons. [H26] (pp. 4–9)

The other 2026 follow-up's abstract describes validation-related gas transport followed by ECLSS-off and battery-source scenarios. It does not establish measured outcomes for those counterfactual scenarios. Full methods and numerical results remain inaccessible in this session. [P26]

**Unresolved and scoped:** complete source/remote clocks, source-generation processing, parameter/model-selection history, shared instrument calibration, exclusions and numerical verification are not fully available. VI24's experimental free volume and VI25's modelling volume are distinct reported quantities; they should not be silently reconciled. The earlier V oxygen assertions also remain separate. A questionable sensor does not invalidate every location, and a suspected sensor issue is not permission to omit an inconvenient trace.

**What changed and why it matters:** one general “conditional validation” statement becomes several explicit claim/metric decisions, including a useful response comparison and a precise acquisition plan. **What a strong baseline can do:** all the same arithmetic and reasoning with the same records. **Still unmeasured:** physical replay, complete information-use history, independent scientific agreement and any user-effort advantage.

### Case B — change the model boundary without changing its history

**Question:** “Now test whether this model predicts PMMA burning and chemical heat release.”

**Before:** the previous demonstration proposed switching from transport to burning and changing observation roles. Read literally, that could make source measurements disappear from a model's history just because the question changed. This is a design defect to repair, not evidence that an implemented application made that mistake.

**After:** distinguish a new requested claim from a new physical model.

| Item | Existing transport model T, as described in VI25 | Proposed combustion model B |
|---|---|---|
| Prediction | Cabin responses to prescribed products/heat | A specified fuel-decomposition/combustion output; possibly coupled cabin transport |
| Fire-source histories | Actual supplied input; history cannot be erased | Must be predicted if their independent prediction is the claim |
| Initial conditions | Recorded conditioning remains attached to T | New specification must identify what is supplied and why |
| V-derived cargo parameter | Retained in T's calibration lineage | If reused, B inherits that dependence; a changed name does not remove it |
| Oxygen-calorimetry observation | Does not validate an output T never calculated | Candidate chemical-release target only after quantity/window definitions and actual calibration/selection history are reviewed |
| Run status | Published analysis, not reproduced here | Proposed model; no implementation, output or test yet |

The useful result is a **difference in required evidence**: to test burning, acquire material formulation and geometry/backing, thermal history, pyrolysis/combustion parameter sources, ignition/flow/composition history, heat-feedback treatment, a matched calorimetry definition and a record of all tuning. Source heat addition cannot simply be relabelled chemical heat release. A model that predicts fuel mass loss but supplies gas chemistry tests a narrower boundary than fully coupled burning.

Revising a model can genuinely remove dependence on an old input for a future calculation. It does not retroactively change the old calculation, nor erase the fact that the developer saw the target while choosing the revision. Record both facts. A future prospectively specified test or a genuinely separate dataset can strengthen evidence; a new identifier alone cannot create a blind holdout.

**Logical stress case, not a NASA observation:** copy the VI record and mark its remote total as used for source normalization. The same rule used for V should remove an independent-total interpretation and retain eligible conditional response proposals. Remove the use-history assertion entirely and the result should become unresolved, not independent. Change only the query wording and T's input history must remain unchanged. These are proposed checks; no application or rule engine was implemented to run them.

**What changed:** the switch produces an auditable new model specification and a claim difference, instead of rewriting the old role map. **Why it matters:** it prevents a scientifically stronger claim from being created through interface wording. **Strong baseline:** a versioned workbook can perform exactly this separation. **Unmeasured:** whether users make fewer mistakes or revise more quickly with software.

### Case C — NIST/MaCFP gasification: a different model and a different measurement trap

**Context:** solid-phase prediction of anaerobic thermal decomposition under imposed radiant heating. This is a ground apparatus, not spacecraft transport or a microgravity fire. It is independently sourced relative to Saffire, but remains an assistant-selected development case—not independent evaluation of IGNIS.

The inspected package is pinned to MaCFP/matl-db commit **3174c3407273b211c3e6f0ceb0f6db7828e8f25b**. It contains the apparatus description, measured q50 Mass R3 CSV, NIST-StMU-FSRI predicted Mass R3 CSV, 2023 NIST-StMU property JSON, contribution README and R3 FDS input. The 2023 NIST poster was also visually inspected. [M1], [M2], [M3], [M4]

**Source reconstruction.** The contribution specifies FDS 6.8, solid-phase-only calculations and measured-mass-based geometry. Its property record identifies TGA, DSC and MCC calibration sources, direct density measurement and literature-based properties. The posted input uses h = **13 W/(m² K)**; the poster describes **13.5 W/(m² K)** fitted using inert insulation tests. This is an unresolved artifact/version difference, not proof of a faulty model. The apparatus records mass and back-surface temperature in separate experiments; matching suffixes cannot justify treating them as simultaneous measurements of one sample. [M2] (boundary conditions and pyrolysis); [M3] (R3 deck, SURF); [M5] (Calibration); [M4] (1D simulation details); [M1] (apparatus description)

**Before:** a role-only plan could mark gasification mass as a target, list material calibration as a dependency, and call the available CSVs/deck ready. It could still compare initial mass as a prediction, clip negative values, combine separate mass/temperature experiments, or select the poster's coefficient for a mismatched replay.

**After: three useful decisions and one unresolved claim.**

1. **Retain the recorded observable.** M1 explicitly explains that the balance is tared to initial PMMA mass and later negative readings represent epoxy mass loss. Define the comparison as the published tared sample/epoxy mass signal. Do not label it pure remaining PMMA mass throughout, enforce a nonnegative range, or quietly drop its tail. Isolating PMMA would require additional component information.
2. **Separate imposed starting mass from later response.** The posted measured/predicted initial values are 26.69/26.7 g, but matching the initial mass is part of construction/processing. It does not independently validate density, geometry or mass. Later tared mass evolution remains a legitimate conditional comparison candidate given the material properties, imposed heating, geometric construction and boundary coefficient.
3. **Select a matched artifact before replay.** Use the h = 13 input as that specific artifact, and retain the poster's different statement. Do not assert the archived deck generated every submitted CSV until output provenance or a reproduction confirms it. The apparatus table also marks the R3 diameter “NR”; the contribution's general reference to reported diameter is not enough to reconstruct every geometric assumption for R3. This limits exact replay, not access to the measured curve.
4. **Keep calibration coverage unresolved where it is unresolved.** The JSON identifies several calibration datasets; it is not a complete attestation that no gasification response informed model selection, boundary simplification or later adjustment. A folder named “Validation_Results” is not proof of a preregistered blind test. The useful conditional comparison survives without that stronger claim.

**A calculation that can be performed now.** In the posted experimental R3 CSV, mass changes from 26.69 g at 0 s to −1.45 g at 480 s. The apparent loss is **28.14 g**. M1 Table 3 reports 26.689 g PMMA and 1.565 g epoxy, totaling **28.254 g**. Thus a loss exceeding the starting PMMA-only mass is consistent with the stated tare convention; it is not automatically a conservation violation. The remaining 0.114 g difference is not assigned wholly to char, balance error or epoxy without further evidence. Rounding and the measurement definition matter.

A second, deliberately descriptive check uses the two posted CSVs at their labelled **200 s**: measured **15.6 g**, predicted **17.6 g**, difference **+2.0 g**. This is arithmetic on existing rounded entries, selected during inspection. It is **not** an aligned whole-trace score, an uncertainty-normalized error, a new solver result or a prespecified validation endpoint. It shows why initial agreement does not establish later agreement and gives a reproducible inspection point while leaving time alignment and provenance visible. [M1] (measurements/Table 3 and measured CSV); [M2], [M3] (submitted output and processing)

**Completed candidate comparison specification:**

| Field | Proposed value or explicit gap |
|---|---|
| Model scope | Solid-phase gasification with the pinned material record and the specifically selected input version |
| Observation | Published tared mass signal, grams; retain negative tail and epoxy convention |
| Conditioning | Measured starting mass/constructed thickness, supplied radiant flux, material calibration and chosen thermal boundary treatment |
| Candidate response | Subsequent mass-history change and separately defined decomposition timing; no independent initial-mass claim |
| Metric protocol | Freeze common clock, window, resampling and tare before a future full-trace evaluation; use no target-fitted time shift as an unqualified timing test |
| Useful positive result now | Accessible source/prediction inspection, corrected observable definition, starting-mass and point-difference arithmetic, precise replay questions |
| Missing for stronger interpretation | Verified deck-to-output link, complete tuning history, resolved boundary/geometry versions, clock convention, uncertainty treatment and numerical checks |
| Transfer limit | No conclusion about flames, oxygen heat release, smoke, suppression or microgravity from this inert calculation alone |

This case changes the core for a reason different from Saffire: the measurement transformation itself determines what the target means, and an apparently harmless cleaning rule would destroy valid data. **A strong baseline can do all of this** with the same README and files. **Unmeasured:** independent adjudication, replay reproducibility, generalization beyond these lineages and user advantage. One material across two physical contexts is useful development evidence, not broad validation of IGNIS.

## 6. Minimum revised contracts and reasoning operation

Use the earlier SourceAssertion, Event, ObservationDefinition, ModelBoundary, UseOfObservation and ValidationPlan concepts; extend them rather than inventing a parallel ontology. The following is a proposed data/analysis contract, not implemented software.

| Record | Required content and reason |
|---|---|
| Source assertion | Source/version/hash, page/table/section, exact claim scope, access level, extraction/visual-review status, reviewer and conflicting assertions. Never silently replace a value with a later paper. |
| Model version and run | Physical boundary, predicted outputs, supplied inputs, parameter/deck/solver identity, parent version, actual versus proposed status. A publication is not necessarily one run. |
| Information-use activity | Measurement or derived quantity consumed; input, instrument calibration, parameter fit, geometry construction, initial condition, normalization, preprocessing, exclusion or model selection; affected quantity/window; timing of the choice; evidence and review status. |
| Observation/transformation | Physical quantity, units/basis, location/domain, event identity, time origin/window, sampling/filtering, measurement operator, baseline/tare/normalization, censoring and uncertainty/shared-calibration references. |
| Requested claim | Model version, intended use, target quantity/feature, domain/window, required conditions and permitted interpretation. |
| Comparison assessment | Compatible quantity/operator, exact conditioning, candidate metric, known dependencies, unresolved review items, trace of applied rules and source locators. Include useful outputs even where stronger claims are unavailable. |
| Asset manifest | Acquired data/deck/output/protocol identities, rights/access, missing items, replay status and rule/schema version. Availability does not equal reproducibility. |

**Review completeness is scoped, not presumed.** For each requested claim, review at least source inputs, parameter fitting, geometry/model choice, preprocessing/alignment, exclusions and target-informed decisions. An item can be (a) documented use, (b) reviewed non-use asserted for a specified scope, or (c) unresolved. A paper may not support category (b); leave it unresolved. Reviewing every available paper is not proof that every historical influence is known. Shared measurement processes are recorded even without a numerical covariance.

Do not offer an automatic “independent” state. Useful outputs are: **specified conditional comparison**, **descriptive consistency check**, **incompatible with this requested claim**, or **unresolved claim requirement**. A later independent-use conclusion requires additional reviewed design/history evidence and remains distinct from statistical independence of errors.

**The minimum reasoning sequence:**

1. Bind the request to an actual model/run or label a proposed new one.
2. Match physical quantities and their measurement operators; reject unit-compatible but physically different substitutions.
3. Trace actual information use and review coverage, including preprocessing and selection.
4. Identify what agreement was imposed and derive a supported remaining comparison using a small set of reviewed transformation templates.
5. Attach conditioning and unknowns; identify the assets required for that particular test.
6. On a revision, preserve the previous assessment and recompute affected claims, showing changed premises and unchanged dependencies.

The first templates need only cover initial-offset response changes, source-total normalization, mass tare/normalization and incompatible physical quantities. They operate on typed records rather than mission names. They do not automatically identify every informative residual, calculate statistical degrees of freedom or prove independence. Unknown transformation effects require a proposed comparison plus review, not a guessed formula.

For a source or model update, cache identity includes model/run version, observation/transformation version, reviewed use assertions and rule version. A descriptive source update unrelated to a claim need not invalidate that claim. Export must preserve the previous version and the reason for any changed assessment.

**This is more than a checklist only if it performs the derivation and revision.** Showing “consider baseline correction” is a checklist. Producing the baseline-relative comparison, identifying the initial-value claim that no longer follows, carrying its uncertainty dependence and updating all affected exported claims is the additional operation. It remains conventional mathematics and dependency tracking.

## 7. Runtime AI and simpler alternatives

The scientific decision precedes the AI choice. Retrieval locates reviewed evidence, deterministic rules apply the comparison contract, ordinary arithmetic computes stated quantities, and a person reviews consequential source interpretation. A language model must not fill missing use history.

| Proposed AI component | Input → output | Authority, fallback and simpler comparator | Evaluation that earns its cost |
|---|---|---|---|
| **One runtime structured interpretation/explanation call** | User question plus supported vocabulary, reviewed candidate records and derived assessment → proposed typed request fields, ambiguity flags and concise explanation citing supplied assertion IDs | May propose the question's meaning and explain an existing result. Cannot change observations, certify independence or choose a new physical model secretly. Schema/evidence-ID checks; user-editable fields; deterministic explanation template on failure. Strong baseline: form controls plus keyword retrieval and templates; also give a strong general assistant the identical records. | Correct quantity/boundary mapping on independently written tasks; source-supported explanations; correction time, latency, cost and complete end-to-end success. Count unsupported confident answers and over-refusal. Retain only if it improves the workflow. |
| **Later extraction assistance, not in event scope** | Source pages/tables → draft assertions, locations and possible conflicts for review | No autonomous publication into trusted records; visual and scientific review still required. Comparator: manual extraction with usable forms. | Total extraction plus verification/correction effort, consequential omission/role errors and reviewer agreement across new source lineages. Drop if review costs erase the gain. |

No separate AI judge or agent ensemble is needed for the minimum. The 2026 citation-guard work is a warning about evaluation assumptions, not a guarantee available by copying a threshold. Deterministic consistency checks also cannot decide whether an ambiguous sentence describes a fit or an independent measurement; the UI must show that unresolved interpretation.

The intended entry needs useful runtime SI functionality. AI-assisted coding alone does not satisfy that ambition. If the runtime call fails, the form/template path preserves utility, but the team must repair or honestly disclose the missing SI feature before claiming a complete challenge response.

## 8. Fair evaluation, narrow SOTA route and falsifiers

**No superiority has been established.** The cases above demonstrate source-supported design consequences and limited arithmetic. They are not user results, independent tests or successful application checks.

Preserve the October H1/frozen tasks, the first report's 25% proposal and the competitive-core report's five-minute proposal as historical prospective protocols. This report proposes a new **primary scientific outcome for the revised task: correct useful claim coverage under revision**, with critical-error and effort reporting. The five-minute improvement can remain a secondary practical target if explicitly adopted before testing; no threshold has been met. Do not retrofit success criteria to observed results.

| Evaluation layer | Fair comparison and unit | Outcome and failure condition |
|---|---|---|
| **Curation** | Identical source documents; manual structured extraction versus proposed assistance; include source checking, rule authoring and corrections | Total effort, consequential assertion omissions/errors and reproducibility. Better answers obtained only by more manual curation are credited to curation. |
| **Method** | Identical reviewed records, roles, transformations, conflicts and rule descriptions. Compare a usable worksheet/formula workflow, strong source-grounded assistant, earlier role-only planner and revised operation | Correct eligible claims, false admissions, unjustified exclusions, missing conditions and correct revision differences. Baseline gets the answers' ingredients, not impoverished metadata. |
| **End-to-end** | Start from identical papers/artifacts; charge setup, extraction, interpretation, review, runtime and maintenance to each method | Time to an auditable usable plan, unresolved-task rate and corrections. Report one-time versus recurring costs and measured break-even task count if one exists. |
| **Researcher workflow** | Independently authored realistic tasks, counterbalanced tool order and equivalent training; explicit expertise and conflicts of interest | Correct completion, total effort, correction burden, evidence acquisition/usefulness and independent reproduction. Preference is secondary. |

Before a formal study, independent task authors specify the required and acceptable qualified claims, material errors and scope of legitimate abstention without seeing this report's answer keys. Another reviewer adjudicates disagreements from the sources; retained ambiguity is a valid result. Task authors or reviewers cannot be invented from the team's 2–3 reported members.

**Proposed scoring, frozen before use:** for each task, count prespecified useful claims delivered correctly with required conditions; count every unsupported or incompatible claim as a critical error; count unnecessary refusals separately. Measure completion only when an exported plan contains the required question/model identity, quantity/operator, history/conditions, metric or justified gap, and source trail. Report accuracy and useful coverage jointly, not a single weighted confidence score. Use a fixed task cap, such as the earlier 30-minute proposal, only after piloting task length outside the evaluation set; report timeouts, not fabricated completion times.

**Grouping:** the unit is a task nested within investigation/model-calibration/measurement lineage. Saffire V and VI share relevant history; their sensors, materials and paraphrases are not independent test cases. NIST TGA/property/gasification artifacts likewise share calibration and measurement processes. Hold out whole lineages when testing generalization, disclose any development exposure and cluster analysis accordingly. With only a few lineages, give descriptive results rather than misleading precision.

**Positive and negative controls:** baseline-relative transport and tared mass-history tasks should yield useful answers; an independent fitted-total claim, chemical/sensible-heat substitution and query-only history erasure should not. Include easy lookup/unit-conversion tasks where a worksheet may be faster. Include an incomplete history where a useful descriptive result is possible despite unresolved stronger claims.

**Ablations:** remove transformation semantics while keeping role records; remove use-history review states while keeping documents; disable automatic revision while keeping the readable plan; remove runtime AI while retaining forms; give the comparator the same new transformation/use records. The last ablation is essential: otherwise manual understanding is mistaken for algorithmic discovery.

**Possible narrow SOTA claim, only later:** on an independently maintained, multi-lineage benchmark of validation-claim construction and revision, the method achieves a better useful-coverage/critical-error/total-effort trade-off than strong retrieval/synthesis and same-information structured workflows. That would be workflow/method evidence, not superior fire prediction or universal scientific reasoning. PrIMe-style quantity/transform representation is a necessary baseline concept. A benchmark created and won only by IGNIS's designers is insufficient.

**Deciding experiment:** blinded, matched-information revision tasks from independent combustion/model-validation researchers, spanning at least transport and material models, with external task authorship and adjudication. Compare final scientific correctness, useful coverage, correction effort and export reproducibility. A subsequent identical-documents study tests whether the benefit survives curation cost. Sample size and effect threshold require a real pilot and prespecification; they are not guessed here.

**Falsifiers:** a corrected source reading reverses a load-bearing claim; the rules discard legitimate conditional information; incomplete lineage yields false assurance; matching artifacts cannot support a usable next step; equivalent worksheets match the trade-off; or researchers seldom need the operation. If value is only reviewed curation, retain a useful evidence package and drop the software-superiority claim. If runtime AI adds effort without useful interpretation, simplify its role while reassessing challenge fit.

## 9. Challenge demonstration, scope and practical limits

The official challenge remains an **interactive SI-powered web dashboard that summarizes, ranks and interprets combustion investigations for human-exploration fire-safety research**. Six profiles and 23 productive hours are our planning choices, not official requirements. Prevention/detection/suppression navigation remains necessary to the intended response; the deepest quantitative case does not have to pretend to cover all three.

**A self-contained demonstration should show a changed scientific decision:**

1. Ask whether the VI transport model can test cabin CO₂ response. Rank relevant investigations with reasons, then show a useful conditional comparison and its missing replay assets.
2. Open the initial-alignment record. Show the derived response-change comparison and why initial agreement is not an additional success.
3. Contrast the V normalization total. Preserve useful conditional questions while exposing the imposed total.
4. Ask to predict burning. Preserve the transport model's history and produce the new model/evidence requirements rather than changing an old input into an independent target.
5. In the competitive scope, open the NIST case: keep the negative mass tail, explain the tare, identify the coefficient/version difference and export the specific comparison.
6. Answer one sourced detection-chain navigation question, then export a plan that reproduces the on-screen decisions and limitations.

The skeptical judge's strongest objection is: **“Your assistant read the papers and wrote a clever checklist; what did the product do?”** The answer must be visible derivation and revision driven by records: change a genuine information-use or measurement assertion, and the affected claim and comparison update consistently in the view and export. If the application merely replays these paragraphs, that objection stands.

| Scope | Deliverable and acceptance |
|---|---|
| **Minimum complete** | Question → ranked investigation navigation → one specified conditional comparison → editable request → sourced export, with real runtime AI. Include an input/normalization contrast and useful prevention/detection/suppression context. All source/metric values must agree across view/export. |
| **Competitive** | Primary mechanism operating on V/VI and the compact NIST example, version-preserving boundary changes, explicit transformation/review states and reproducible claim differences. Independent checking strengthens evidence only if actually obtained. |
| **Stretch** | One externally authored new-lineage task or a verified MaCFP replay with matched versions and uncertainty treatment. Neither is on the event critical path. |

Keep the six previously proposed NASA navigation profiles—BASS-II, Saffire V, Saffire VI, SAME, SAME-R and FLEX—only at supportable depth. The NIST comparison is a targeted cross-context example, not a demand to curate a seventh broad mission profile. A source-backed prose summary is acceptable where quantitative coverage is unavailable; do not populate missing numbers for visual symmetry.

**Conditional 23-hour plan for one builder:**

| PKT period | Productive hours and gate |
|---|---|
| Sat 14 Nov, 09:00–13:00 | **4:** verify permitted assets/current guides, curate the authorized small record set and freeze scientific definitions. Charge review time here. |
| Sat 14:00–19:00 | **5:** implement comparison records, transformation rules, history-preserving revision and a single export object. No further breadth until a positive and a qualified case agree. |
| Sat 20:00–23:00 | **3:** connect the dashboard and runtime AI to the working operation. A complete question-to-export path is the overnight gate. |
| Sun 15 Nov, 08:00–12:00 | **4:** check quantity/history/unknown-state behavior; add the compact NIST record if the core is sound; verify navigation breadth. |
| Sun 13:00–17:00 | **4:** debugging, source checking, accessibility and honest demonstration/submission content. Freeze claims after consequential errors are resolved. |
| Sun 18:00–21:00 | **3:** complete submission, citations/rights/SI disclosure, clean-session link checks and confirmation. |

This leaves 15h59 in the conditional 38h59 window for meals, rest, interruptions and a final 2h59 buffer. Nine overnight hours are left free. This is an effort allocation, not measured delivery capacity; no additional developer or scientific reviewer is assumed.

**Cut first:** solver integration, automatic extraction, graph/vector infrastructure, parameter inference, VOI optimization, separate AI critics, full rod-interface rebuild, ornamental plots/animation, additional quantitative profiles and general uploads. If the Saturday core slips, cut the NIST interface before sacrificing the working conditional comparison, navigation, runtime AI or export. Keep its research finding in the evidence discussion. Do not claim cross-context implementation merely because the report contains Case C.

**Post-event research:** independent task/user evaluation; broader lineages including detection; matched numerical replay; uncertainty/identifiability extensions only after model/data prerequisites exist; interoperable export adapters tested with real workflows.

### Rules and authorization checked once in this assessment

The official challenge, FAQ, team-formation guide and legal content were retrieved through the public content API on 7 November; the complete response matched the earlier session's capture. Resources and judging/submission guides are still scheduled for **13 November**. No scoring weights, video duration or mandatory profile count are invented. The team guide gives **14 November, 09:00 local** for the project start and **15 November, 23:59 in the team creator's local time** for the Universal deadline. PKT is the planning basis; the actual creator's zone and accepted roster still need final verification. Universal participation requires at least two members. [Official challenge](https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/), [FAQ](https://www.spaceappschallenge.org/resources/participant-faqs/), [team guide](https://www.spaceappschallenge.org/resources/team-formation-guide/), [terms](https://www.spaceappschallenge.org/legal/)

A targeted read-only connected-mail search found the known November 6 confirmations and no newer asset-specific organizer ruling. This is a bounded search, not proof no ruling exists elsewhere. The supplied GO messages permit topic research; reuse of bespoke preparation remains unresolved. No external message, app, release, registration or solver execution was authorized or performed. This report and its calculations/curation belong in the preparation chronology. The historical implementation gate remains in force until explicitly reconciled for an authorized build; a new folder or in-event retyping is not an eligibility exemption.

## 10. Adversarial review and outstanding evidence

| Objection | Repair or consequence | What remains to establish |
|---|---|---|
| “No recorded edge means independent.” | Explicit claim-scoped review coverage; unknown never becomes non-use. No automatic independence state. | Review of real construction/selection history beyond published methods. |
| “Conditioning makes every test worthless.” | Derive remaining response features; report useful consistency and conditional comparisons. | Adequate measurement/uncertainty treatment for numerical acceptance. |
| “Different sensors are independent.” | Shared calibration, volume/composition, processing and clocks remain dependencies. | Quantified covariance only if supporting records exist. |
| “Same units mean the quantities match.” | Physical quantity, boundary, operator and window precede numeric comparison. | Domain review of ambiguous operators. |
| “The user switched to a predictive model.” | A query change does not mutate the old run; create a proposed model specification and preserve history. | Actual new model, data-use history and output. |
| “You improved the fit by alignment or exclusion.” | Record whether offset/time-shift/exclusion/geometry choices used the target; narrow affected claims. | Prespecified protocol or a clearly labelled retrospective analysis. |
| “One conflict invalidates the entire study.” | Scope each conflict to its quantity, run or claim; retain unaffected results. | Resolution for the affected comparisons, not a blanket verdict. |
| “Readiness is hidden inside a confidence score.” | Separate relevance, review coverage, acquired assets and execution status. | User evidence that the presentation improves selection. |
| “PrIMe or a worksheet already does this.” | Acknowledge prior art; compare equal information and conventional methods. | Measured advantage in repeated revision or audit; otherwise simplify. |
| “The model inferred all the dependencies.” | Trusted records are reviewed curation; AI proposes request interpretation, not historical facts. | End-to-end extraction study before claiming automation. |
| “Your three cases prove generality.” | A/B share Saffire; C is a different source/context but assistant-selected. | Independently authored, multi-lineage tasks and external adjudication. |
| “The near-zero endpoint error validates the model.” | Separate endpoint closure, transient shape, timing, spatial distribution and intended use. | Actual prespecified multi-feature comparison with uncertainty and numerical checks. |

These are this assistant's adversarial checks. They are not independent peer review, NASA endorsement or evidence of an award probability.

## 11. Compact source and decision ledger

Access levels matter: “full text” does not mean raw data, “artifact inspected” does not mean executed, and a current webpage does not prove the documented method is suitable here. Source citations below support the factual premises; the comparison derivations and proposed design are this report's analysis.

| Key / title and version | Access, method and evaluated task | Assumptions, failure modes and exact implication |
|---|---|---|
| **V24** — Saffire V vehicle modelling, ICES-2024-310; NTRS 20240008602 | NASA PDF; original methods pp. 5–7 rechecked; earlier visual inspection retained. Source-history construction and cabin comparison. | Input normalization and fitted losses constrain claims. Use for A, not a new combustion prediction. |
| **VI24** — Saffire VI preliminary results, ICES-2024-365; NTRS 20240002981 | NASA-hosted PDF; measurement-location text and Tables 1–2 checked. | Preliminary reporting and differing quantities/versions must remain explicit. |
| **VI25** — vehicle modelling, ICES-2025-156; NTRS 20250002675 | NASA PDF; source/initialization/results checked at cited pages. | Given-source transport, inherited calibration and initial alignment; no complete replay assets obtained. |
| **H26** — Urban et al., Heat and Smoke Emission from Tests on the Saffire IV–VI Experiments; ICES-2026-577, DOI 10.32865/2346/109144 | Author-posted full-text web transcription, methods/results pp. 3–9. Public PDF download failed 403. | Clock/observable distinctions inform the contract. New table numbers and apparent wording conflict remain unverified visually. |
| **P26** — Niehaus et al., Spacecraft Fire Safety Predictions using Validated Saffire Model; DOI 10.32865/2346/108820 | Author-associated abstract only. | Scenario simulations are not observed counterfactual outcomes; no numerical claims adopted. |
| **M1** — NIST gasification apparatus dataset, DOI 10.18434/mds2-2940; pinned MaCFP README/CSV | Full apparatus procedure, table and measured R3 CSV inspected. README labels results preliminary. | Tare/epoxy, separate experiments and missing diameter affect interpretation. |
| **M2–M3, M5** — NIST-StMU-FSRI contribution; 2023 material JSON, R3 FDS deck/output | Full small files inspected at pinned commit; no third-party code or solver run. | Calibration provenance exists but is not a complete non-use attestation; output/deck linkage needs confirmation. |
| **M4** — Floyd et al., Modeling of Black PMMA in the NIST Gasification Apparatus using FDS (MaCFP–3), 2023 | NIST poster PDF, text and direct visual inspection. Solid-phase and boundary-sensitivity examples. | Poster settings differ from the archived deck. Do not digitize plots into unsupported performance scores. |
| **UQ** — Bruns, Canez, Leventon, Uncertainty Quantification and Propagation of Pyrolysis Kinetics Parameters Used in Fire Models; NIST publication 959988 | Full PDF; relevant model, likelihood/prior, compensation and limitations sections read. TGA parameter inference. | Assumed independent observations/likelihood and priors need justification; computational convergence matters. Supports caution, not an IGNIS posterior. |
| **FDS** — official manuals/source tag FDS-6.11.1 | Validation overview/error chapter and relevant device documentation inspected; thermocouple definition checked. | Application acceptance and numerical verification remain separate from metadata. No automatic compatibility with older runs. |
| **NASA** — NASA-HDBK-7009B, approved 2026-02-03 | Official PDF/standards listing; intended/proposed/actual-use and data-pedigree guidance examined. | Cover/listing identify B as approved; internal pages retain “DRAFT” headers, recorded rather than silently normalized. Guidance does not confer project certification. |
| **GUM** — JCGM 100:2008, §5.2, official ISO rendering | Correlated-input treatment read. | Shared references can induce covariance. No covariance values inferred here. |
| **SYS** — Schoukens & Ljung, Nonlinear System Identification: A User-Oriented Roadmap; arXiv:1902.00683, 2019 | Full PDF accessed; relevant validation, excitation and structural-error guidance screened. | Informative input/output data and modelling assumptions required; not a metadata classifier. |
| **PRIME** — Oreluk et al., Dynamic Chemical Model for H₂/O₂ Combustion Developed Through a Community Workflow; arXiv:1801.10093v2, 2018 | Full paper; §§2.1–2.6 examined, including QOI transformation and B2BDC construction. | Quantitative bounds, model/surrogate assumptions matter. Strong prior art against claiming a new general validation formalism. |
| **ONTO** — Bai et al., Automated Calibration of a PODE Oxidation Mechanism Using Knowledge Graph Technology; DOI 10.1021/acs.jcim.0c01322, 2021 | Earlier primary methods audit retained; current bibliographic/abstract check. Current PMC access encountered a browser challenge. | Existing ontology/calibration implementation, not a demonstrated IGNIS comparator result. |
| **PROV / SHACL** — W3C recommendations, 2013 / 2017 | Official ontology and constraint specifications screened. | Interchange and declared consistency checks do not discover complete history or establish physics. |
| **DISC / TR / VOI** — model discrepancy; causal transport; Bayesian design | Author abstract for Brynjarsdottir/O'Hagan; primary Pearl/Bareinboim report and Huan/Marzouk abstract screened. | Priors/discrepancy, causal structure, or utility/likelihood are required respectively. Numerical extensions deferred. |
| **OS / AI26** — OpenScholar, Nature 2026; Goo et al., citation-faithfulness preprint, arXiv:2607.20527v1 | Earlier OpenScholar methods/limits audit retained; current publisher access was intermittent. AI26 methods §§4–5 and limitations §7 read. | Fair source-grounded assistant baseline; verifier/domain mismatch prevents importing a scientific correctness guarantee. |
| **VIS** — Munzner, A Nested Model for Visualization Design and Validation, 2009 | Author-hosted paper, model and validity threats screened. | Correct interface abstraction/task must be tested separately from speed or visual preference. |

### Claim status and proposed decisions

| Claim / decision | Status | Evidence, added work, measurable benefit and rejection condition |
|---|---|---|
| V's normalized total is not an independent predicted total | **Source finding + interpretation** | V24 source construction. Arithmetic confirms the normalization, not the model. Revisit if the source-role interpretation is corrected. |
| VI supports a specified conditional transport comparison | **Interpretation/proposal** | VI24–VI25. Needs clocks, histories and matched operators for replay. Reject stronger claims without those inputs. |
| Baseline-relative response excludes imposed initial agreement | **Mathematical derivation** | Equation in A2. No physical accuracy or independence follows from the algebra. |
| NIST negative tail must retain its tare semantics | **Source finding** | M1 and inspected CSV. Reject pure-PMMA interpretation without extra information. |
| NIST +2.0 g at labelled 200 s; 28.14 g tared loss | **Assistant calculation** | Posted rounded CSVs; diagnostic only. No prespecified score or uncertainty claim. |
| Claim-specific comparison/revision is the primary enhancement | **Proposed D-035** | Cases A–C and established representation methods. Added work: reviewed use/transform records and small rules. Benefit: correct useful claim coverage/revision effort. Reject if same-information alternatives match it. |
| Measurement contract and separate readiness are the only small supports | **Proposed D-036** | GUM, FDS, source clocks/tare and actual artifact gaps. Added work: explicit fields/manifests. Benefit: fewer quantity/version mistakes and precise acquisition tasks. Remove fields that do not change a real decision. |
| Revised evaluation emphasizes useful coverage and critical errors | **Proposed D-037** | Avoids winning by refusal; identical-information and identical-documents comparisons. Cost: independent task/reviewer work and measured effort. No silent replacement of frozen protocols. |
| Broad SOTA, NASA adoption and global-award advantage | **Unknown** | No independent benchmark, user study, physical validation or judging evidence establishes them. |

### Source links

[V24]: https://ntrs.nasa.gov/api/citations/20240008602/downloads/ICES-2024-310.pdf
[VI24]: https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf
[VI25]: https://ntrs.nasa.gov/api/citations/20250002675/downloads/Vehicle%20Modeling_FINAL.pdf
[H26]: https://www.researchgate.net/publication/410245330_Heat_and_Smoke_Emission_from_Tests_on_the_SAFFIRE_IV-VI_Experiments
[P26]: https://www.researchgate.net/publication/410982183_Spacecraft_Fire_Safety_Predictions_using_Validated_Saffire_Model
[M1]: https://github.com/MaCFP/matl-db/blob/3174c3407273b211c3e6f0ceb0f6db7828e8f25b/PMMA/Validation_Data/NIST_Gasification_Apparatus/README.md
[M2]: https://github.com/MaCFP/matl-db/blob/3174c3407273b211c3e6f0ceb0f6db7828e8f25b/PMMA/Validation_Results/NIST-StMU-FSRI/README.md
[M3]: https://github.com/MaCFP/matl-db/tree/3174c3407273b211c3e6f0ceb0f6db7828e8f25b/PMMA/Validation_Results/NIST-StMU-FSRI
[M4]: https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=956809
[M5]: https://github.com/MaCFP/matl-db/blob/3174c3407273b211c3e6f0ceb0f6db7828e8f25b/PMMA/Material_Properties/2023/MaCFP_PMMA_NIST-StMU.json
[UQ]: https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=959988
[FDS]: https://pages.nist.gov/fds-smv/manuals.html
[NASA]: https://standards.nasa.gov/system/files/tmp/NASA-HDBK-7009B_Final%2002-03-2026.pdf
[GUM]: https://www.iso.org/sites/JCGM/GUM/JCGM100/C045315e-html/C045315e_FILES/MAIN_C045315e/05_e.html
[SYS]: https://arxiv.org/abs/1902.00683
[PRIME]: https://arxiv.org/abs/1801.10093
[ONTO]: https://doi.org/10.1021/acs.jcim.0c01322
[PROV]: https://www.w3.org/TR/prov-o/
[SHACL]: https://www.w3.org/TR/shacl/
[DISC]: https://mail.tonyohagan.co.uk/academic/abs/simmach.html
[TR]: https://web.cs.ucla.edu/~kaoru/r372.pdf
[VOI]: https://arxiv.org/abs/1108.4146
[OS]: https://www.nature.com/articles/s41586-025-10072-4
[AI26]: https://arxiv.org/html/2607.20527v1
[VIS]: https://www.cs.ubc.ca/labs/imager/tr/2009/NestedModel/

### Preservation and access audit

Both earlier reports, original data/scripts and frozen evaluation files are preserved. Proposed decisions and this session's activities are appended to DECISIONS.md and CHRONOLOGY.md. Research captures, source hashes, inspected artifacts, access failures and arithmetic are under the gitignored **_raw/cross_disciplinary_2026-11-07/** directory; this is a research cache, not a submission package.

Primary new fingerprints: NIST poster SHA-256 is recorded in retrieval_manifest_1.json; the MaCFP measured R3 CSV is **69d0bda84b3330ed9e237ced42593d359150126db04dcd05bff476cebeecd74d**, the predicted CSV **aff690d9c93b0f4598302345602bc2b3b16bae50fc20659a8d141518d9ff6906**, and the R3 deck **9b83e6ff92926a170bc7dad3e0b626ffe2a5650238152f0ce66b8ceb00297329**. Calculation details are in research_calculations.json. The file named saffire_heat_2026.pdf in the cache is the failed HTML response, not an acquired PDF; the access manifest records that failure.

No access restriction was bypassed. Source rights remain item-specific: NASA hosting is not a universal reuse licence; MaCFP repository metadata does not settle every item's terms; the author-hosted 2026 text is not permission to redistribute its figures. This report uses attributed facts and original analysis. Inline research code only retrieved/read sources, rendered inspected material, calculated the disclosed arithmetic and checked preservation/documents.

## 12. Direct answers

**Which fields materially changed our understanding?** Metrology, information-use history, material-model calibration, provenance and computational validation. They reveal why roles alone are too coarse, why conditional tests can remain useful, and why a matching file or unit is insufficient.

**What exact capability should we add, repair, remove or replace?** Add claim-specific comparison derivation and revision. Repair the model-boundary switch so it preserves actual history. Add explicit measurement semantics and separate readiness. Remove automatic independence/confidence implications; defer numerical identifiability and solver replay.

**What useful result can the revised solution produce that the current planner cannot?** The current plan can describe conditioning. The revised operation must derive the eligible response quantity, identify precisely which claim was imposed or lost, and propagate a real change through every affected assessment/export. Saffire baseline changes and NIST's tared mass provide concrete specifications now.

**What did the worked cases establish, and what is still only a hypothesis?** They establish source-backed distinctions, reproducible limited arithmetic and consequences for a proposed comparison. They do not establish implemented generality, independent scientific agreement, complete historical independence, new physical validation or user benefit.

**Why might a NASA researcher adopt this instead of an equally informed worksheet or existing tool?** To maintain several model/measurement claims through revisions with less checking and fewer stale conclusions, while exporting an auditable plan. If their existing workflow does this effortlessly, there is no established reason to switch.

**Is there a credible narrow SOTA route, and what experiment decides it?** Possibly a better correctness/coverage/effort trade-off on independently authored multi-lineage claim-revision tasks. The matched-information comparison against a strong assistant and structured worksheet decides the method claim; identical-document effort accounting decides whether it is economically useful.

**What makes this a stronger competition entry without exaggerating its science?** A visible scientific consequence: derive a useful conditional test, preserve history during revision, retain valid negative data and expose exactly what prevents replay. That is more demonstrable than a generic evidence graph. It does not predict an award.

**What should we build during the permitted event and what should remain later research?** Build the small reviewed claim/transformation operation, navigation, runtime question interpretation and consistent export, with the compact NIST case only after the core works. Leave automatic extraction, independent evaluation at scale, numerical uncertainty/identifiability, solver integration and validated transfer to later work.

**What single next action would most change confidence in the decision?** Prepare and run one blind, same-information revision exercise with an independent model-validation researcher: give the original source/artifact packet and a usable worksheet, ask for the admissible comparisons before and after a genuine information-use change, and measure correctness and total effort before revealing this report's answers. This can falsify the need for the proposed operation before an application is built. It is a proposed next action, not a review that has occurred or an invitation sent.
