# IGNIS — research synthesis, selected solution and adversarial review

**Research date:** 14 November 2026.  
**Project/team:** IGNIS / Emberfall.  
**Decision type:** research-backed refinement of the existing user-led concept, not a new application, organizer ruling, independent scientific review or performance claim.

## Executive decision

Keep IGNIS. Make its primary output a **scenario-specific, source-backed fire-safety research brief** spanning prevention, detection and suppression. Let the researcher change the scenario or the scientific claim and see exactly which findings, qualifications and comparisons change. Retain the existing model-validation engine as the deep-analysis operation, not the entrance requirement for every user.

The core question becomes:

> What does the reviewed NASA evidence establish about this fire-safety research problem, how applicable is it to my stated conditions, and what changes when I change those conditions or the claim I want to test?

This is not a general hazard predictor, an emergency response adviser, an automatic certification system, or a promise to simulate a lunar fire. No custom-trained model is required. A bounded pretrained-language-model workflow can help retrieve, clarify and explain; scientific records and executable comparison rules retain authority over accepted calculations and history.

This recommendation repairs two opposite failures in earlier designs. A generic paper chatbot lacks meaningful scientific operation. A model-validation-only application makes an optional research direction the whole challenge response. One connected brief-and-analysis workflow can serve the actual brief without pretending all investigation families have equivalent numerical depth. [R01]

**Competitive judgment:** the direction is defensible, but its advantage is not established. Existing tools already provide mission scenarios, source-linked findings, gaps and research planning. Winning cannot be inferred from the architecture or from citations alone. The claim to earn is a measurable improvement in correct, useful synthesis and revision under the same evidence and resource access—not “the first combustion graph.” [R19, R21, R29, R30]

## 1. What was actually reviewed

This pass examined the supplied challenge and current guides; the existing scientific/runtime handoffs; the old ARIES SRS; original combustion papers, NASA/NIST reports and investigator records; scientific-AI work; and current public competitor descriptions. Fourteen relevant disciplines were mapped to decisions rather than expanded into fourteen subsystems.

Primary HTML and selected PDF text were directly inspected. Some publisher access yielded abstracts and methods excerpts, not complete papers. Web screenshots failed for the external NASA PDFs attempted in this pass. The supplied submission guide page and ARIES specification pages were visually inspected through the file reader. Consequently, this report does not claim a new visual audit of every numerical table or figure. Source-specific access levels appear in the register.

The Saffire calibration/initialization reconstruction is principally inherited from the uploaded source-audited contracts. Its stated arithmetic was rerun here. No synchronized Saffire series, new original experiment, solver run, independently adjudicated user task or LLM inference was produced. A direct-container download attempt failed at DNS resolution; these failures were not interpreted as unavailable science. Public web retrieval supplied the inspected external content.

This is a targeted interdisciplinary research pass, not a systematic review of all combustion literature or all products. The old ARIES SRS demonstrates documented design ideas, not current implementation performance. No user repository was modified.

## 2. Findings that change the design

### 2.1 Oxygen fraction and total pressure cannot collapse into one number

Ries et al. studied thin-PMMA flame spread under specified microgravity and ground configurations. Their publisher abstract reports increased spread along a near-constant-oxygen-partial-pressure path as oxygen fraction increased and total pressure decreased. This is a tested-domain result, not a universal material law. [R05]

For illustration only, `101.3 kPa × 0.21 = 21.273 kPa`, whereas `60 kPa × 0.354 = 21.240 kPa`. These combinations lie within the reported parameter ranges; they are not newly transcribed paired experimental rows. The partial pressures differ by about 0.16%, but that calculation cannot establish equal flammability.

**Design consequence:** store oxygen fraction, pressure, mixture/basis and gravity separately. Preserve geometry, flow, heating history and protocol. A calculated similarity cannot override physical differences.

### 2.2 Intermediate gravity is not automatically intermediate fire behaviour

A 2024 PMMA-rod study using a centrifuge drop apparatus reports greatest flammability near lunar gravity in its particular concurrent-stagnation configuration. It supplies a counterexample to universal monotonic interpolation between microgravity and 1g, not a general lunar-material prediction. [R06]

**Design consequence:** switching the research scenario to the Moon changes evidence applicability; it does not interpolate a curve. Partial-gravity work outside PSI must not be confused with acquired partial-gravity PSI data. Current repository access needs verification independently of whether research exists elsewhere.

### 2.3 Extinction is not a single endpoint

The 2026 opposed-rod study distinguishes cessation of flame spread from later extinction of regressing burning, reporting different limiting oxygen concentrations. [R07] FLEX investigators also describe cool-flame droplet burning after hot-flame extinction, through low-temperature chemical pathways. [R14]

**Design consequence:** an endpoint record must distinguish visible flame, spread cessation, sustained reaction, complete extinction and operational test termination. These studies inform research interpretation; they do not supply a universal suppressant dose or verify extinction in a crew habitat.

### 2.4 Investigation objectives are not observed results

The SAME hypothesis and the actual detector paper must not be merged into a generic assertion that microgravity always produces larger smoke. The inspected results describe particle variability, no significant difference from equivalent ground particles in that comparison, and incomplete smoke-type coverage by the two tested detectors. [R09]

**Design consequence:** objective, hypothesis, observation, published model result and our derived calculation need separate roles. Detector conclusions must retain the tested materials, instrument and setup. They cannot become blanket judgments about every current detector.

### 2.5 Heat, smoke and gas products are different hazards and observables

Saffire VI reports that combustion products were a substantial concern even when the cabin-wide pressure/temperature response was modest. The 2026 follow-up adds relevant heat/smoke context, but its uninspected table values are not promoted here. [R11, R16]

**Design consequence:** prevention cannot be summarized solely by flame size; detection cannot be inferred from total heat; suppression cannot be equated with complete post-fire recovery. The three challenge areas should participate in the research brief, not sit in unused navigation tabs. This does not authorize numerical hazard aggregation across different studies.

### 2.6 The model-validation work remains useful

From the inherited Saffire record, `54.4/29.9 = 1.81939799…` and `29.9 × 1.82 = 54.418 g`. Reproducing a source total used in normalization is not an independent prediction of that total. The VI source/remote summaries `127.8` and `128.1 g` differ by approximately `−0.2342%`, but that is not a new transport-model accuracy score. [R12, R13; uploaded contract]

**Design consequence:** retain the existing tools for quantity matching, input/calibration history, conditional comparison and version-preserving revision. Put them behind a meaningful fire-safety question rather than requiring every visitor to start with an FDS model.

## 3. The interdisciplinary map: what each field contributes

The following are design consequences of the reviewed science, not a list of features promised for the event.

| Field | Critical question | Representation or operation needed | What not to claim |
|---|---|---|---|
| Combustion chemistry | Is the observed process hot burning, low-temperature oxidation, smouldering or extinction? | Fuel phase, reaction/endpoint semantics and source-defined mechanism | Visible disappearance proves all reaction ceased |
| Materials science | Does material name conceal formulation, char/melt, thickness or prior conditioning? | Material grade/configuration/history records | Every PMMA record describes interchangeable material behaviour |
| Thermodynamics and atmospheres | What do pressure, composition and temperature actually specify? | Separate pressure/fraction/basis; explicitly derived partial pressure | Equal partial pressure implies equivalent fire response |
| Heat transfer | What roles do conduction, convection, radiation and solid heating play? | Geometry, thermal boundary, exposure history and quantity definition | Chemical heat release equals sensible heat delivered to a cabin |
| Fluid mechanics | What flow actually reaches the flame or sensor? | Direction/reference frame, forced versus buoyant flow, enclosure and apparatus | Matching nominal velocity establishes dynamic similarity |
| Aerosol science | What smoke distribution, age and material is being measured? | Particle observable, source material, aging/transport and instrument response | One smoke surrogate proves all-material detection performance |
| Instrumentation/metrology | What does this number mean and when/where was it measured? | Operator, units, clocks, sampling, baseline, calibration and censoring | Equal units alone establish equal quantities |
| Suppression and post-fire systems | Which extinction endpoint and residual products were studied? | Endpoint and fuel-specific mechanism; separate post-fire context | Droplet extinction supplies a solid-cabin suppressant prescription |
| Numerical modelling | What was predicted and what was supplied or fitted? | Model/run and information-use records; T1–T4 | A fitted/initialized match certifies general prediction |
| Statistics and experimental design | What is an independent observation and what does selection change? | Run/specimen/campaign/calibration lineage; selection provenance | Table rows, paraphrases or repeated papers are independent replications |
| Dimensional analysis and transportability | Which mechanisms permit a comparison across conditions? | Regime descriptors with defined scales and explicit assumptions | A distance metric or matching dimensionless group guarantees transfer |
| Information science and provenance | Can findings be found, attributed and revised? | Stable source/claim identifiers and dependency versions | Missing links prove absence or independence |
| AI and decision support | What useful action or clarification should happen next? | Bounded evidence retrieval, semantic interpretation and verified state | More agents or a larger model guarantees correctness |
| Human factors and software engineering | Can a user complete and audit the intended task? | Result-first workspace, clear corrections, one export object and task tests | Attractive diagrams prove usefulness or scientific validity |

Relevant foundations include R05–R17 for physical questions, R23–R26 for scientific validity/provenance, and R19–R20/R27–R28 for AI and interface design. NASA's own gap 0302 connects these domains explicitly; the agency's funded partial-gravity synthesis project also seeks cross-investigation comparisons and dimensionless understanding. This establishes relevance, not a customer commitment. [R04, R17, R18]

## 4. The selected product: one research brief that can be revised

### Intended task

A researcher asks: **“What evidence should I consider for material burning, smoke detection and extinction in an oxygen-enriched, lower-pressure crew environment, and which parts need additional evidence for my intended use?”**

The first response must be useful before the person supplies every possible field. Broad questions can receive broad sourced findings; exact comparison questions need the relevant conditions. The system asks for a critical missing distinction only when it changes the task or the admissible conclusion.

### Result structure

The brief has five compact sections:

1. **What the selected evidence establishes.** Concise positive findings with experiment scope.
2. **Why these investigations are relevant.** Ranked findings and investigations with transparent reasons.
3. **Where the question differs from the evidence.** Material, geometry, atmosphere, gravity, duration, flow, instrument and endpoint mismatches.
4. **What can be analysed now.** A source-backed descriptive operation or the existing conditional model-comparison plan.
5. **What is required next.** Specific missing measurements or artifacts, not an invented optimal experiment or a generic “more research needed.”

Each substantive statement should expose the original finding separately from our scenario implication. “A study reported X under Y” can be well supported while “X will happen in this habitat” remains unsupported.

### The crucial interactive operation

Changing a confirmed scenario, quantity or model question must update both the selected evidence and the conclusion's scope. It must not merely alter a heading or ranking weight. Source history stays immutable. An inherited calibration does not disappear when the user changes the question.

Example changes:

- Microgravity to lunar gravity: measured microgravity behaviour remains real, but direct transfer becomes a separately qualified claim. Surface-gravity evidence has its own apparatus limits.
- Particle-size question to detector-response question: select instrument-response evidence rather than relabelling particle measurements as alarm performance.
- Later cabin CO2 response to independent combustion prediction: preserve the published model and show the different requirements.
- Visible-flame disappearance to complete extinction: retrieve the correct endpoint evidence; do not merge the two.

These are scientific query changes, not predictions that the UI has already implemented.

## 5. A worked research brief, not a hypothetical output screenshot

**Research scenario:** an analyst is reviewing a lower-pressure, oxygen-enriched crew environment. Pressure, O2 fraction and gravity must be explicit before asking for quantitative transfer. No mission configuration is approved by this exercise.

**Prevention answer:** the reviewed thin-PMMA result defeats the shortcut “same oxygen partial pressure means equivalent flame spread.” A source-supported comparison should retain flow and geometry; missing thick-material evidence is a specific gap rather than permission to transfer a thin-sheet rate. [R05]

**Detection answer:** the SAME findings make material-specific smoke and instrument response relevant. A detector assessment needs actual response evidence; selecting material-flammability literature alone does not establish detectability. [R09, R10]

**Suppression answer:** define whether the research concerns spread stopping, disappearance of the luminous flame, or cessation of reaction. The rod and droplet sources demonstrate why those endpoints cannot be treated as synonyms. Their role here is endpoint clarification, not a numerical cross-fuel suppression calculation. [R07, R14]

**Advanced analysis:** when the analyst asks which Saffire observations could test a supplied-source transport model, open the current T1/T2/T4 workflow. Return the conditional response comparison and the unacquired synchronized-series requirements. Asking about burning instead changes the requested claim, not the historical model's outputs. [R12, R13; uploaded contract]

**What this completed exercise proves:** the source material can support a useful multi-area brief with distinct analysis paths. **What it does not prove:** that IGNIS generates it correctly, that the selected sources cover the entire literature, that a user's task is faster, or that a habitat is safe.

## 6. Mathematical foundations without invented certainty

### 6.1 Physical normalization versus physical equivalence

Use `p_O2 = x_O2 P` as a unit-aware contextual calculation with mixture/basis assumptions. Keep x and P separately. The calculation itself contains no kinetics, heat transfer or geometry and cannot be a fire-risk model.

Dimensionless groups may help diagnose which additional conditions matter. For appropriate definitions, `Re = UL/nu`, `Pe = UL/D`, `Da = tau_transport/tau_chem`, and a buoyancy-to-inertia comparison such as `Ri = g beta DeltaT L/U^2` organize different balances. Definitions and characteristic scales vary with the problem. At zero or negligible U, blindly computing ratios can be meaningless. Do not infer missing length scales, reaction times, temperatures or diffusivities. These are explanatory metadata requirements in the minimum, not a calibrated similarity engine. The partial-gravity literature itself warns that a scaling useful for one regime need not describe extinction or melting materials. [R06, R17]

### 6.2 Dependence-aware uncertainty

For a difference, `Var(B−A) = Var(B) + Var(A) − 2Cov(A,B)`. Shared sensors or calibration make covariance relevant; different rows do not establish independence. If necessary uncertainty is missing, show the descriptive difference and missing uncertainty requirements rather than fabricate a confidence interval. Nonlinear derived quantities can require more than first-order propagation. [R25]

Do not call a span across analytical selections a statistical interval. Do not use the highest reported count as the number of independent experiments.

### 6.3 Evidence applicability is an explicit relation

For each requested use and finding, evaluate required facts as satisfied, violated or unknown. A known mismatch blocks that particular numerical transfer; unknown requirements remain unresolved. The same finding can still be mechanism-level context for another use.

This is a proposed rule system, not proof that every applicability predicate is scientifically correct. Preserve source-backed policies, reviewer level and exact affected claims. The minimum does not learn universal tolerances from the current small corpus.

### 6.4 Ranking is not a safety score

Use transparent ordered criteria: the requested phenomenon/observable, tested configuration relevance, information-use suitability when a model is involved, and disclosed data access. Separate unresolved conditions from known matches. Prefer stable ties over false precision.

Broader summaries should represent each requested safety area and relevant counterevidence. Repeated publications from one campaign should not inflate corroboration. With a small claim bank, screen every reviewed claim before claiming a corpus-scoped absence; a truncated retrieval result cannot establish that absence.

No arbitrary weighted percentage should be displayed as risk, truth probability or evidence confidence. Missingness in the reviewed corpus is not a proven global research gap.

### 6.5 Adaptive inquiry is not automatically information theory

The old ARIES SRS motivates coverage-aware questioning and separate broad/clarifying/validating strategies. Its coverage heuristics do not establish calibrated answer probabilities or expected information gain.

For the event, prioritize questions by whether their answer changes the allowed comparison or selected evidence. Ask about chemical versus sensible heat before irrelevant interface preferences. Ask no question whose answer is already in confirmed state. Numerical value-of-information or entropy optimization is deferred until a proper probability/utility model exists.

## 7. Data and system design

### The smallest useful evidence representation

Use a few typed records in JSON/SQLite or the builder's existing equivalent, not a graph-database requirement:

- **Source:** identity, version, location, access and rights.
- **Investigation / physical event:** separate from publication and specimen.
- **Finding:** statement, quantity/endpoint, result type, tested scope and evidence lineage.
- **Model use:** existing T1–T4 records, where applicable.
- **Confirmed request:** desired task, known conditions, exclusions and unresolved details.
- **Assessment / brief:** selected claim IDs, applicability reasons, derived operations, source snapshot and revision difference.

A finding's role can be objective, hypothesis, observed result, published-model result or derived calculation. Review level is separate. A source statement may qualify or conflict with another without proving fraud or establishing independent evidence.

An initial target of about 12–18 carefully reviewed claims across the six proposed profiles is an implementation budget, not a claim that a complete production bank exists. Supplementary papers can be contextual sources without becoming full numerical datasets. Expose actual coverage and source dates.

### AI workflow: narrow jobs, useful outcomes

Use a bounded workflow rather than an autonomous agent swarm:

1. Interpret broad intent and explicit constraints using a small vocabulary. Keep requested intent separate from completeness and supported-operation status.
2. Retrieve reviewed candidate findings using ordinary lexical/structured search; scan the finite bank for relevant qualifications.
3. Ask a targeted clarification only when needed, then confirm routing-critical meaning.
4. Deterministically apply applicability and existing comparison contracts.
5. Compose a brief from approved claim references and actual computed results. Allow a model to select/organize or explain within those records, not create new physical assertions.
6. Validate references, quantities, scope and version binding; render authoritative facts and tool results directly. Unsupported narrative is omitted or replaced with a template, with failure visible.

A target of one interpretation call and one grounded synthesis call per completed turn is a proposed ceiling to test—not permission to spend or a guarantee of quality. Tool access is read-only and allowlisted. No arbitrary code, PDF upload or web browsing is in the event path. Clarification uses confirmed state and does not reset the scientific question.

OpenScholar shows that retrieval/reranking/feedback can improve scientific synthesis using existing models. It does not guarantee this workflow's success. The combustion-RAG preprint identifies distracting context and retrieval misses; its unimplemented later stages cannot justify mandatory training. These findings favour selective, typed context and bounded steps, not a large dump of papers into a cheap model. [R19, R20]

### What the failed Groq test means

The uploaded executed report remains authoritative: neither tested configuration passed. Valid JSON is not semantic success. Adaptive decomposition is a hypothesis to test, not a cure already established by the literature.

The next evaluation must compare a repaired simple interpretation pipeline with the bounded adaptive variant on matched tasks and resource budgets, preserving historical scores. Legacy failures become regression cases; new questions are frozen before another authorized run. User repairs are reported separately. No model is selected merely because it is larger, cheaper, or nominally premium.

### UI: one workspace, two levels of depth

Keep Explore / Analysis. The first result is a readable research brief organized by requested safety area. A source drawer shows exact findings and conditions. A change strip shows what changed after a revision. Advanced Analysis exposes the existing mathematical/validation contracts when the question needs them.

Do not display invented Saffire time-series plots. Use claim tables, source relationships, available summary arithmetic and revision differences. A navigation source and an acquired numerical dataset have visibly different badges. The result, explanation and Markdown/JSON export share one versioned assessment. Old exports remain historical, not magically updated.

UI quality is judged by whether the person completes the research task, not preference or a graph's visual density. [R27]

## 8. Prior art and the proposed contribution

| Alternative | What is established | Consequence |
|---|---|---|
| MicroFire Atlas | Its publicly indexed first-party documentation already describes mission scenarios, a gap registry, research planning and exports; no application benchmark was reproduced here | Mission framing, gaps or a graph are not sufficient novelty |
| OpenScholar and strong scientific assistants | Published evidence-backed retrieval/synthesis infrastructure and evaluation | Generic literature summaries are a strong baseline, not a unique contribution |
| OntoChemExp / PrIMe | Established experimental semantics, calibration and model–data consistency work | Do not claim invention of calibration separation or combustion knowledge representation |
| FDS and validation packages | Actual physical simulation and model-validation infrastructure | IGNIS prepares/interprets evidence; it does not replace the solver |
| Same-information worksheet + assistant | Can reproduce the existing arithmetic and reviewed reasoning | The new application must earn its integration, revision or interaction benefit |

The candidate contribution is **a consistent relationship between the user's research context, supported cross-area findings, and permitted quantitative claims as the context changes**. It is an application-method hypothesis, not demonstrated algorithmic novelty.

A future superiority claim must specify task, corpus, comparator, accuracy, useful coverage, user effort and curation cost. It must survive giving the comparator the same reviewed facts and rules. No advantage is established by withholding our conflict register from the baseline.

## 9. Brutal review and repairs

| Objection | Severity | Repair / decision | Evidence still required |
|---|---|---|---|
| The planner solves an optional modelling task but not the whole brief | Critical | Put multi-area findings and synthesis first; retain planner as depth | End-to-end completion of broad and advanced tasks |
| A new scenario dashboard merely copies existing scope | High | Do not claim scenario novelty; demonstrate claim-level revision and analysis | Matched-information comparison against real alternatives |
| The broad brief secretly combines incompatible experiments | Critical | Keep source finding and scenario implication separate; prohibit cross-fuel numerical pooling | Expert adjudication of selected transfers and implications |
| The actual interpreter already failed badly | Critical | No deployment approval; audit contract and test a bounded alternative | New authorized semantic evaluation; original result preserved |
| Claims, hypotheses and source objectives are mixed | Critical | Type each claim and retain negative/corrective results | SAME and other adversarial source-role cases |
| A graph implies causal or statistical independence | High | Track ancestry and unresolved use without independence certificates | Appropriate scientific review and dependence-aware tests |
| No raw Saffire series means impressive curves would be fabricated | Critical | Show honest specifications and summary checks; no invented plots | Acquired matched data for any later numerical evaluation |
| The solution becomes twelve agents and a new data platform | High | Finite read-only workflow, one claim bank, one interface, few tools | Actual integration time and reliability measurements |
| Curation is doing all the valuable work | High | Charge curation and compare equal information; publish that outcome honestly | External task and effort study |
| Research samples are too few for SOTA claims | High | Label internal checks; seek external multi-context tasks later | Properly designed and sufficiently informative evaluation |
| A beautiful demo can hide poor ordinary-query coverage | High | Include ordinary and surprising inputs, a second material and no-model navigation | Task coverage and failure ledger, not selected screenshots |
| Pre-event/AI-origin assistance may affect eligibility | Critical administrative issue | Preserve chronology and disclosure; request an authoritative ruling | Organizer decision, not an assistant's interpretation |

**Review outcome:** conditional design GO; software, scientific transfer, user benefit and eligibility gates remain separate. It would be dishonest to stamp the whole project PASS now. No paper review can close tests that require a working application or external people.

## 10. Evaluation and build decision

### Test the actual product, not only the parser

Use tasks covering an atmosphere query, a detection question, an extinction-definition question, and advanced Saffire analysis. Include revisions and true ambiguity. Compare the same-information worksheet/assistant, a simple retrieval-and-answer baseline and the proposed bounded workflow.

Score useful correct completion, correct scope/endpoint, citation and number binding, appropriate clarification, unsupported claims, unnecessary refusal, reproducibility, latency and total effort. Report both raw AI interpretation and user-assisted final completion. Source curation, rule authoring and corrections are costs, not free inputs.

Existing 23/24 interpretation and zero-observed-critical-error criteria remain historical gates for that test. A new broader product protocol must be explicit and frozen before new results; changing the operation does not retroactively pass the failed test. Internal task variants are not independent validation. A human reviewer is valuable, but absence of one is disclosed rather than fabricated.

Key adversarial checks: equal partial pressure must not imply equal flammability; lunar change must not trigger arbitrary interpolation; hypotheses must not become observed results; a quoted number must retain material/quantity/source; a reused source total must not become an independent prediction; a missing fact must not become a match; a source update must invalidate only affected claims; an irrelevant study must not dilute a precise answer.

### Finite event scope

Plan around the existing one-builder, 23-productive-hour assumption only after applicable authorization. This is a reallocation, not extra invisible time:

| Work | Proposed hours |
|---|---:|
| Permitted source subset and reviewed finding bank | 4 |
| Applicability/ranking plus existing comparison integration | 4 |
| Explore/Analysis, revision and consistent exports | 5 |
| Bounded runtime AI and confirmation | 3 |
| Semantic/scientific checks and defect repair | 4 |
| Deployment, citations/disclosure and actual submission | 3 |
| **Total** | **23** |

Reserve rest outside productive hours and verify the actual remaining event window. Unknown permissions, accounts or runtime access can consume time. The first vertical slice must reach a useful NASA brief and export before optional additions.

Cut NIST UI, automatic extraction, extra providers, graph visualization, animations, local hosting and optional profile detail first. Do not cut scientific source identity, broad challenge functions, runtime AI demonstration, public access, error handling or truthful disclosure. Do not add a generic safety score, full CFD or learned physical predictor.

### Completion evidence

A minimum completed entry should answer one broad fire-safety research question, one detection/suppression follow-up, and one advanced Saffire question using the same reviewed corpus and application. It must respond appropriately to a genuine revision, expose the sources and export the same result. Public users must not need our developer credentials or a paid chat subscription.

A research contribution requires more: actual researcher tasks, independent source review, and evidence that this is easier or more reliable than the matched baseline. A predictive-SOTA claim requires a different, validated modelling experiment. None is established by a polished seven-slide demonstration.

## 11. Competition rules that materially affect this decision

The supplied 2026 guides confirm five criteria and a demo of at most seven slides or 30 seconds. Their main evaluation is the project submission, not only the pitch. The public result and supporting material must be accessible. [R02, R03]

Most importantly, the submission guide both permits SI tools and states that SI should not originate the solution idea. It also requires disclosure and restricts generated NASA branding/design elements. This report develops the user's existing project using AI assistance; that history must be disclosed accurately. It does not settle how organizers apply the rule to extensive AI-assisted research/design or pre-event assets. Do not conceal this report, claim human-only ideation, or infer that the event starting resolves earlier reuse.

The official terminology explicitly includes ML, chatbots and LLMs under SI. There is no need to claim artificial superintelligence or train a foundation model. The proposed application's runtime contribution must still work in practice. [R02]

## 12. Final recommendation

**Build a source-backed fire-safety research workspace, not a universal fire predictor and not a standalone validation checklist.** The positive output is a useful cross-area brief; the distinctive operation to test is maintaining the relationship between changing questions, experimental applicability and permitted scientific claims. The existing validation contracts provide analytical depth.

This is a more direct response to the actual challenge. It remains vulnerable to strong competitors, curation cost and failed language interpretation. The responsible answer is not to promise victory or add fashionable components; it is to complete and test one clear operation with enough breadth to address prevention, detection and suppression.

The next useful artifact is the first permitted end-to-end implementation and its error record, accompanied by an independently reviewed real task when available. Additional research should be triggered by a concrete missing claim or failed test, not by the possibility of another discipline.

---

## Source register and access ledger

Dates below are publication or record dates where stated; retrieval was 14 November 2026. Access labels describe this pass, not everything earlier assistants reported. No third-party papers or source images are bundled.

### R01 — NASA Space Apps 2026, Flame in Freefall challenge
**Date:** 2026  
**Source:** https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/  
**Access:** Full challenge supplied by user; official indexed description checked. Direct page fetch was unreliable.  
**Decision implication:** Required product: an interactive SI-powered dashboard summarizing, ranking and interpreting combustion findings for human-exploration fire-safety research. Optional suggestions are not all mandatory.

### R02 — NASA Space Apps Project Submission Guide
**Date:** 2026-11-13  
**Source:** https://www.spaceappschallenge.org/resources/project-submission-guide/  
**Access:** User-uploaded 14-page printout; complete supplied text; page 8 visually inspected with Files.  
**Decision implication:** SI includes ML, chatbots and LLMs. Disclosure and the solution-origin restriction need attention; no new ruling on earlier work is established.

### R03 — NASA Space Apps Judging & Awards Guide
**Date:** 2026-11-13  
**Source:** https://www.spaceappschallenge.org/resources/judging-awards-guide/  
**Access:** User-uploaded 12-page printout; criterion and eligibility text read.  
**Decision implication:** Impact, Creativity, Validity, Relevance and Presentation; each scored 1–5. No private judging scores or winning probabilities.

### R04 — NASA Moon to Mars Architecture Definition Document, Revision C, gap 0302
**Date:** 2025-12  
**Source:** https://ntrs.nasa.gov/api/citations/20250010956/downloads/20250010956.pdf?attachment=true  
**Access:** NASA PDF parsed text, specific gap section inspected; web page screenshot retrieval failed.  
**Decision implication:** Fire safety spans material behaviour, detection, suppression, response and cleanup in demanding exploration environments. This establishes an agency research context, not adoption of IGNIS.

### R05 — Ries, Eigenbrod & Meyer: Effect of oxygen concentration, pressure, and opposed flow velocity on flame spread along thin PMMA sheets
**Date:** 2024  
**Source:** https://doi.org/10.1016/j.proci.2024.105358  
**Access:** Publisher abstract and methods-scope excerpts; full data tables not inspected in this pass.  
**Decision implication:** Near-constant oxygen partial pressure did not imply unchanged flame spread in the tested thin-sheet configurations. Do not generalize a coefficient or effect size.

### R06 — Olson et al.: Partial gravity flammability of cast PMMA rods in concurrent axial stagnation flow
**Date:** 2024  
**Source:** https://doi.org/10.1016/j.firesaf.2024.104267  
**Access:** Publisher abstract, introduction and selected methods/conclusion excerpts. Figures not newly inspected.  
**Decision implication:** A configuration-specific maximum near lunar gravity defeats an automatic monotonic-gravity assumption. The apparatus is a centrifuge drop experiment, not a lunar-surface test.

### R07 — Opposed flame spread limit over PMMA rods in normal and micro gravity
**Date:** 2026-07  
**Source:** https://doi.org/10.1016/j.firesaf.2026.104719  
**Access:** Publisher abstract, highlights and introduction excerpts recovered; not full numerical data or visuals.  
**Decision implication:** Spread cessation and later fuel-regression extinction are distinct endpoints; their reported limits differ. Prior full-text access blocker is only partially improved.

### R08 — Link et al.: The Effect of Gravity on Flame Spread over PMMA Cylinders
**Date:** 2018  
**Source:** https://www.nature.com/articles/s41598-017-18398-4  
**Access:** Primary article HTML inspected. The complete supplement transcription audit remains inherited from uploaded reports.  
**Decision implication:** Flow response and geometry/protocol details matter. Do not treat all tabulated segments as independent experiments or infer a causal effect from the P4 sequence.

### R09 — Yang et al.: Evaluation of Spacecraft Smoke Detector Performance in the Low-Gravity Environment
**Date:** 2018  
**Source:** https://www.nist.gov/publications/evaluation-spacecraft-smoke-detector-performance-low-gravity-environment  
**Access:** NIST publication abstract fully read; original paper indexed methods/results excerpts also located.  
**Decision implication:** The studied detectors did not cover every tested smoke type. Equivalent ground/microgravity particles were not significantly different in the reported comparison; distinguish hypothesis from result.

### R10 — NIST/NASA Study Shows One Detector Does Not Fit All Smoke in Spacecraft
**Date:** 2018  
**Source:** https://www.nist.gov/news-events/news/2018/05/nistnasa-study-shows-one-detector-doesnt-fit-all-smoke-spacecraft  
**Access:** Primary institute account of its own research, readable HTML.  
**Decision implication:** Material/particle-size-specific response helps explain the detector finding. This account and R09 are one study lineage, not two independent confirmations.

### R11 — Urban et al.: Preliminary Results from the Saffire VI Experiment, ICES-2024-365
**Date:** 2024  
**Source:** https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf  
**Access:** NASA PDF methods/conclusion text inspected. Screenshot calls failed, so no new visual table audit is claimed.  
**Decision implication:** Cabin-average thermal effects and combustion-product hazards are different; source, transport and sensor measurements require separate meanings.

### R12 — Niehaus et al.: Vehicle Modeling During the Burn Events in the Saffire VI Experiments, ICES-2025-156
**Date:** 2025  
**Source:** https://ntrs.nasa.gov/citations/20250002675  
**Access:** NASA record checked; detailed use-history and figures inherited from the uploaded source-audited contract. Direct PDF retrieval failed in this pass.  
**Decision implication:** Conditional transport validation is not prediction of burning. Matched integrated totals do not establish correct transients; original calibration and initialization remain relevant.

### R13 — Vehicle Modeling during the Burning of Thermally Thick Samples in the Saffire V Experiments, ICES-2024-310
**Date:** 2024  
**Source:** https://ntrs.nasa.gov/api/citations/20240008602/downloads/ICES-2024-310.pdf  
**Access:** Detailed normalization reconstruction inherited from uploaded report; arithmetic rerun, not solver replay.  
**Decision implication:** Source normalization uses measured information. Preserve that conditioning without discarding every useful downstream comparison.

### R14 — Nayagam, Dietrich & Williams: Isolated Single Droplet Combustion—FLEX Experiments onboard the ISS
**Date:** 2021  
**Source:** https://ntrs.nasa.gov/api/citations/20210022617/downloads/JASMAC-33%20FLEX%20w%20video.pdf  
**Access:** NASA-hosted author presentation text inspected; screenshot retrieval failed.  
**Decision implication:** N-alkane droplets can continue cool-flame burning after hot-flame extinction. No general cabin suppression dose follows.

### R15 — NASA: Studying Combustion and Fire Safety
**Date:** 2023  
**Source:** https://www.nasa.gov/missions/station/studying-combustion-and-fire-safety/  
**Access:** Agency description and indexed content inspected.  
**Decision implication:** Investigation context for BASS/FLEX and chemically different cool-flame behaviour. Agency overview, not a quantitative cross-fuel predictor.

### R16 — Heat and Smoke Emission from Tests on the Saffire IV–VI Experiments, ICES-2026-577
**Date:** 2026-07  
**Source:** https://doi.org/10.32865/2346/109144  
**Access:** Author-uploaded ResearchGate indexed abstract/text and institutional publication list; original full PDF not acquired here.  
**Decision implication:** Recent follow-up confirms importance of smoke/gas observables. Do not adopt uninspected table updates or resolve conflicting clocks from the title/abstract.

### R17 — NASA Task Book: Predicting Material Flammability in Partial Gravity Using Microgravity and Ground Data
**Date:** current record retrieved 2026-11-14  
**Source:** https://taskbook.nasaprs.com/tbp/index.cfm?TASKID=31FF2895CF11A3D63C9B8986DB12A22A&action=public_query_taskbook_content  
**Access:** Primary investigator project record and research objectives/progress inspected through indexed text.  
**Decision implication:** Cross-investigation synthesis, matched experiments and dimensionless analysis are genuine research activities. Does not prove researchers need this particular UI.

### R18 — NASA: PSI NRA Awarded Research by Area
**Date:** current record retrieved 2026-11-14  
**Source:** https://science.nasa.gov/physical-sciences-informatics-psi/psi-nra-awarded-research-by-area/  
**Access:** Agency award listing inspected.  
**Decision implication:** Confirms BASS/BASS-II/Saffire-related synthesis as a funded research direction. Not endorsement of IGNIS.

### R19 — Asai et al.: Synthesizing scientific literature with retrieval-augmented language models (OpenScholar)
**Date:** 2026-02-04  
**Source:** https://www.nature.com/articles/s41586-025-10072-4  
**Access:** Primary HTML abstract, methods and limitations inspected.  
**Decision implication:** Retrieval, reranking and feedback are serious system-level comparators. Off-the-shelf models also benefit in the paper; no custom weight training is required merely to apply these ideas.

### R20 — Yang et al.: A unified foundational framework for knowledge injection and evaluation of LLMs in combustion science
**Date:** 2026, arXiv v1  
**Source:** https://arxiv.org/html/2603.04452v1  
**Access:** Full primary HTML read, with attention to benchmark construction and stage actually evaluated.  
**Decision implication:** Naive-RAG retrieval misses and distracting context matter. KG and continued-pretraining stages are proposals here, not demonstrated improvements or universal requirements.

### R21 — Automated Calibration of a Poly(oxymethylene) Dimethyl Ether Oxidation Mechanism Using Knowledge Graph Technology
**Date:** 2021  
**Source:** https://doi.org/10.1021/acs.jcim.0c01322  
**Access:** Primary publisher/PubMed abstract and indexed methods excerpts.  
**Decision implication:** OntoChemExp/calibration integration already exists. A combustion knowledge graph is not an IGNIS novelty claim.

### R22 — Oreluk et al.: Community mechanism development and PrIMe/B2BDC
**Date:** 2018  
**Source:** https://arxiv.org/abs/1801.10093  
**Access:** Primary abstract; deeper mathematical methods were not reproduced.  
**Decision implication:** Quantitative model–data consistency has substantial prior art and requires actual models and uncertainty bounds.

### R23 — NIST FDS and Smokeview manuals
**Date:** current index retrieved 2026-11-14  
**Source:** https://pages.nist.gov/fds-smv/manuals.html  
**Access:** Official documentation index and verification/validation distinction inspected.  
**Decision implication:** A solver is complementary infrastructure. IGNIS does not replace or certify it; exact model/version and test protocol matter.

### R24 — NASA-STD-7009B: Standard for Models and Simulations
**Date:** 2024 revision, current record inspected  
**Source:** https://standards.nasa.gov/standard/nasa/nasa-std-7009  
**Access:** Official standard description and scope; not a full conformance audit.  
**Decision implication:** Credibility depends on intended use and acceptance criteria. Do not imply NASA approval.

### R25 — JCGM GUM, Chapter 5: combined standard uncertainty
**Date:** 2008  
**Source:** https://www.iso.org/sites/JCGM/GUM/JCGM100/C045315e-html/C045315e_FILES/MAIN_C045315e/05_e.html  
**Access:** Official HTML, especially correlated-input section, inspected.  
**Decision implication:** Shared measurements/calibrations require dependence-aware uncertainty. Missing covariance is not zero.

### R26 — W3C PROV overview
**Date:** 2013  
**Source:** https://www.w3.org/TR/prov-overview/  
**Access:** Official overview read.  
**Decision implication:** Entities, activities and derivations provide established provenance concepts; provenance is not scientific truth or statistical independence.

### R27 — Munzner: A Nested Model for Visualization Design and Validation
**Date:** 2009  
**Source:** https://www.cs.ubc.ca/labs/imager/tr/2009/NestedModel/  
**Access:** Author abstract/page read, not a reproduced user study.  
**Decision implication:** Task validity precedes interface polish; judge task, abstraction, interface and algorithm separately.

### R28 — Anthropic: Building effective agents
**Date:** 2024-12-19  
**Source:** https://www.anthropic.com/engineering/building-effective-agents  
**Access:** Primary engineering article read.  
**Decision implication:** Prefer simple controlled workflows when tasks are bounded; extra autonomy trades cost/latency and can compound errors.

### R29 — MicroFire Atlas README and public product descriptions
**Date:** retrieved 2026-11-14  
**Source:** https://github.com/A-K-M-Asifuzzaman/MicroFire-Atlas/blob/main/README.md  
**Access:** Publicly indexed first-party README and site content; direct opens failed; no code execution or user-task benchmark.  
**Decision implication:** Already describes mission scenarios, evidence gaps, research planning and exports. Those are overlapping capabilities, not unique IGNIS inventions.

### R30 — MicroFire Atlas Challenge Mode
**Date:** retrieved 2026-11-14  
**Source:** https://microfire-atlas.vercel.app/challenge  
**Access:** Indexed first-party page; no interactive behaviour reproduced.  
**Decision implication:** Explicit lunar PMMA scenario and limits illustrate meaningful overlap. Do not infer competitor errors, eligibility or overall quality.

### R31 — NASA: Flame of Discovery Grows as Saffire Sets New Fires in Space
**Date:** 2020  
**Source:** https://www.nasa.gov/humans-in-space/the-flame-of-discovery-grows-as-saffire-sets-new-fires-in-space/  
**Access:** Agency account retrieved as context.  
**Decision implication:** Post-fire treatment of products matters separately from visible flame; the dated experiment narrative is not current operating procedure.

### R32 — NASA Physical Sciences Informatics FLEX record PSI-69
**Date:** record retrieved 2026-11-14  
**Source:** https://psi.nasa.gov/physci/repo/data/investigations/PSI-69  
**Access:** Indexed investigation metadata, not authenticated raw-data acquisition.  
**Decision implication:** Repository objectives and variables are not automatically findings; distinguish metadata availability from acquired files.

## User-provided records used as internal evidence

- `IGNIS_Contract_Closure_and_Build_Handoff.md`: scientific domains, source histories, output/readiness and revision contracts. Specification, not running code.
- `IGNIS_Runtime_AI_Selection_and_Cost_Decision(1).md`: executed Groq comparison and its failures. Reported internal measurements, not rerun here.
- `ARIES_SRS(3).pdf`: historical adaptive-query/coverage concepts; no assertion that this document establishes current software capability.
- `NASA Space Apps Challenge.pdf`: supplied 2026 Project Submission Guide.
- `NASA Space Apps Challenge2.pdf`: supplied 2026 Judging & Awards Guide.
- Current user messages supply the challenge wording, team/builder constraints and UI design state. The full latest UI file was not independently supplied/reopened in this pass.

## Arithmetic artifact

`checks/arithmetic.json` contains Decimal calculations for the illustrative partial-pressure comparison and inherited Saffire summary arithmetic. Its qualifications are part of the artifact. It contains no synthetic scientific observations or new model predictions.
