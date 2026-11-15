# IGNIS: research verdict and competition solution

**Decision report · 7 November 2026, Pakistan Standard Time (UTC+5)**  
**Team:** Emberfall, Universal Event, confirmed by the user. **Capacity:** one active builder; 2–3 reported team members. **Status:** research and design assessment, not an application or submission. No external messages were sent.

## 1. Executive verdict

**Keep the research navigator; replace the expanding safeguard architecture with one useful operation: reconstruct a scientific claim from its source records, revise the evidence selection, and regenerate a consistent, inspectable analysis.** Put that operation inside the interactive, SI-powered investigation dashboard the challenge requests.

The recommended product is **IGNIS — trace, compare, and reuse space-fire evidence**. A researcher asks a question, receives ranked investigations, selects an analysis scope, inspects the supporting measurements and experimental histories, and exports the result with its sources and assumptions. The distinguishing demonstration is an analysis that updates correctly when the researcher changes specimen-history requirements or a qualified source interpretation. Investigation summaries provide breadth across prevention, detection and suppression; the PMMA rod records provide numerical depth.

The weakest assumption in the existing plan is that meticulous source reconciliation automatically establishes a valuable new software product. It does not. A carefully prepared spreadsheet already reproduces the arithmetic. MicroFire Atlas already has substantial provenance, comparability, reuse, ranking and sensitivity functionality. The opportunity is therefore **less work to produce and revise a defensible research result**, measured against equally informed alternatives. That advantage remains untested.

Four decisions follow:

1. **Do not build a flammability predictor for this event.** These processed tables, repeated specimens, incomplete environmental histories and heterogeneous endpoints do not support a credible new predictive SOTA claim.
2. **Make the positive output an evidence package for a research decision.** It should identify usable measurements, perform permitted descriptive calculations, explain changed results, and carry enough information for another person to reproduce them. Abstention is one outcome, not the product.
3. **Use reviewed links and deterministic calculations; use a language model for question interpretation and grounded explanation.** Automatic scientific entity resolution, general PDF ingestion, custom training and a dedicated graph database are outside the minimum entry.
4. **Treat competition eligibility as unresolved for reuse of pre-event assets.** Registration is now established; permission to reuse bespoke transcriptions, scripts and designs is not. An in-event rebuild is not an automatic exemption for earlier preparation.

The best plausible competition entry is a complete, modest tool with a striking, verifiable research workflow and honest comparison evidence. The current repository is a useful preparation corpus, not yet a competitive product. Neither a Global Award nor research superiority can be inferred from this report.

**Exact claim to try to earn:** “On researcher-authored tasks that require assembling or revising a source-backed combustion evidence package, against a same-data spreadsheet with expert rules and a conflict register, using identical reviewed records, links, conflicts and source access, IGNIS reduces median capped task-completion time by at least 25%, while task correctness is no more than five percentage points worse, at least 90% of answerable tasks receive a useful answer, and no critical unsupported scientific conclusion is introduced.” These are proposed acceptance margins, not results. Section 8 defines this primary user-workflow comparison, additional strong method baselines, and the larger evidence required before any SOTA wording.

## 2. Reality audit and scientific repairs

### What actually exists

The local repository is available. Its HEAD is **95a6a99**, matching the handoff; the earlier preparation milestones are present in history. The initial working tree was clean. I inspected the repository instructions, chronology, decision and blocker records, principal evidence cases, source/access records, selected analysis scripts, current value/evaluation plans and implementation gate. I did not read every historical proposal or every page of the 144-page NASA report.

| Item | Verified status on this pass | What it does not establish |
|---|---|---|
| Publisher supplement and NASA BASS-II report | Local PDFs present; hashes match the recorded copies. Key source pages rendered and inspected again. | Raw experimental telemetry, complete calibration or an independent scientific review. |
| Table transcriptions | 52 S1 rows, 46 S2 rows, 27 A.3 burn records; A.3 contains 21 distinct specimen labels. Counts recomputed. | 98 independent experiments, 27 independent error sources, or a representative sample of all combustion conditions. |
| Journal-to-NASA crosswalk | 19 journal labels; candidate relationships use attributes as well as labels. The code was read. | 19 certain one-to-one identities or a validated automatic entity-resolution algorithm. B22 is not a simple one-burn match. |
| Existing transcription checker | Read and run unchanged: 6/6 checks passed. S1/S2 checks include tabular token/sequence comparisons; A.3 checks are narrower token checks. | Full semantic verification of every A.3 row and column, or independent human validation. |
| P4 and history-dependent minima | Recomputed from the CSVs; the load-bearing table cells were visually checked against source pages. | A causal effect, a limiting oxygen concentration, or a new predictive benchmark. |
| Existing test questions | Assistant-authored development cases, including the later T13 addition. | Sealed, independent validation. |
| Application and evaluation | No dashboard, live analyst, validated predictor, external user study or independent scientific review found. | Software advantage, operational readiness or NASA endorsement. |
| Organizer/reviewer communications | Drafts exist; no asset-reuse ruling or scientific-review response was established. | Permission arising from a draft or from general registration approval. |
| Registration and effort | Relevant November 6 notifications confirm Universal registration and approval to join Emberfall; user confirmed Emberfall will submit IGNIS. User reports one active builder and 2–3 members. | A checked final roster, confirmed scientific-review capacity, or several parallel developers. |

The local checks are **assistant checks**. The filename “p4_independent_recheck” does not turn that earlier assistant pass into an independent expert assessment. The present review also is not one.

### Recomputed results that survive

The following uses the existing stated policy: black-prefix S1 records; B15, B16, B19 and B22 excluded from this particular calculation for their recorded qualifications; ground rows require an actual printed rate rather than an undefined dash. A first logged burn is determined from the inspected A.3 as-run order and the candidate crosswalk. This is a reproducible selection policy, not a universal scientific truth.

| Nominal diameter | Minimum initial O2 among selected microgravity rows with a printed rate | Same calculation, first logged burns only | Minimum O2 among ground rows with a printed rate |
|---|---:|---:|---:|
| 0.64 cm | 17.0% | 17.0% | 18.0% |
| 0.95 cm | 17.5% | 17.5% | 18.5% |
| 1.27 cm | 17.6% | **19.3%** | 18.5% |

These are **table minima under a declared selection**, not LOC values. The corresponding comparisons do not control flow, measurement protocol, thermal history or all atmospheric conditions. The first-logged selection leaves two diameter groups with a tabulated initial-O2 minimum below the ground-table minimum; the third is unresolved for that research question. It does not show that the third diameter behaves oppositely. [Publisher Tables S1/S2](https://media.springernature.com/original/springer-static/esm/art%3A10.1038%2Fs41598-017-18398-4/MediaObjects/41598_2017_18398_MOESM1_ESM.pdf), [NASA report, Table A.3](https://ntrs.nasa.gov/citations/20210011385).

For B4/P4, specimen 197m, the three tabulated rates convert to **32.5, 31.0 and 26.9 µm/s** at nominal flows **2.00, 1.87 and 1.73 cm/s**. The last-minus-first difference is **−5.6 µm/s**, or **−17.23%**. This arithmetic is useful as an explicit, exportable descriptive comparison. It cannot isolate an airflow effect from an evolving burn. The last tabulated segment is not the end of the test. [Link et al. supplement, S1 left half](https://media.springernature.com/original/springer-static/esm/art%3A10.1038%2Fs41598-017-18398-4/MediaObjects/41598_2017_18398_MOESM1_ESM.pdf).

P5 and P9 share specimen 202m. Their approximate logged start times differ by 39 minutes; that is not a cooling interval. P5's final and P9's initial reported O2/CO2/CO entries match. The log also records continued flame presence during P5 beyond its two tabulated rate segments. Those facts are enough to make history relevant; no claim of a fully observed inter-burn atmosphere is needed. [NASA Table A.3, PDF page 115 / printed page 107](https://ntrs.nasa.gov/citations/20210011385).

### Corrections required before these notes become product claims

| Existing or tempting statement | Decision and replacement |
|---|---|
| “Oxygen only fell, therefore each segment was below initial O2.” | **Withdraw.** Endpoints and a general report description do not establish every segment's oxygen or a monotonic time series. Store initial, final and contemporaneous values as different fields. |
| “Matching or copied gas cells prove nothing changed between burns.” | **Withdraw.** Matching readings are consistent with continuity. Copying, rounding and unrecorded gas management remain alternatives. Do not present “unrenewed atmosphere” as established. |
| “Fresh-specimen sensitivity proves a three-diameter claim fails.” | **Repair.** Changing from all eligible burns to first logged burns changes the target population. Show it as a changed research scope. Reserve interpretation sensitivity for alternative defensible readings of the same scope. |
| “Observed minima bound a physical LOC.” | **Do not claim this from these tables alone.** A bound requires an endpoint definition and assumptions connecting initial atmosphere to actual spread conditions and testing history. Undefined ground dashes do not supply negative observations. |
| “NASA disproves the paper's B16/B19 interpretation.” | **Withdraw permanently.** The inherited detailed audit finds an appendix inconsistency, while the paper, NASA chapter and image interpretation favor opposed flow. Author/raw-data resolution remains absent. |
| “A physical specimen is the independence unit.” | **Incomplete.** Track burn, segment, specimen, campaign, apparatus/calibration and possible shared-atmosphere relationships. Distinct specimens can share errors. |
| “Different endpoint identifiers can never be compared.” | **Replace.** Side-by-side description and qualified contrasts can be useful. Pooling, fitting and causal transfer require stronger compatibility. |
| “No ruling means retype or rebuild during the event.” | **Replace.** Eligibility with disclosed preparation still needs clarification; a fresh directory does not resolve it. |

These repairs apply to the recommendation even where historical repository files retain the older wording. No as-printed data were changed. Nine matching-atmosphere pairs are reported in the earlier audit; this pass directly rechecked the P5/P9 example, not all nine. P17's colour, B22's allocation, the S1 right-half rate-unit discrepancy and missing raw telemetry remain open.

## 3. Challenge and rules map

The **current full challenge text was retrieved from the official site's public content API** and agrees with the supplied statement. Frontend fetches often returned a shell or failed; those failures were not treated as missing requirements. Current captures and hashes are under `_raw/astra_2026-11-07/`. The resources tab says resources will be available **Friday, November 13**. The old “full statement pending October 28” blocker is obsolete. [Official challenge](https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/).

| Requirement or consideration | Interpretation | Proof the entry should show |
|---|---|---|
| Interactive, SI-powered web dashboard | Required product form. Ordinary AI/LLM systems are included in the current FAQ's definition; no invented superhuman model is necessary. | A live model interprets a new question and helps generate a source-grounded answer; users can change evidence selections. |
| Summarize, rank and interpret investigations | All three are required capabilities. | Investigation profiles; query-dependent ranking reasons; interpretations tied to specific sources and quantities. |
| Foundational fire-safety insights for human exploration | Required purpose. It does not require certified operational advice. | A researcher can identify applicable evidence and an explicit limitation relevant to a spacecraft research question. |
| Prevention, detection and suppression | Organize the product around all three challenge areas. Every named investigation is not individually mandated. | Useful sourced navigation in each area, with quantitative depth clearly distinguished from catalogue coverage. |
| Attributes, hardware relationships, audiences, terrestrial uses | The brief describes these as potential considerations, not a checklist of mandatory features. | Prioritize material, geometry, atmosphere, endpoint, measurements and apparatus context; defer terrestrial applications. |
| Mission atmospheres and partial gravity | Source-specific research context. Pressure and O2 fraction remain separate; burner-stream composition is not cabin composition. | No automatic lunar interpolation, habitat safety score or 85%-O2 cabin inference from CFI-G. |

This map is based on the [full challenge](https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/) and [current FAQ](https://www.spaceappschallenge.org/resources/participant-faqs/). Using AI only to write the project code would leave the dashboard's own SI-powered function unproved. A no-key form fallback is useful resilience, but is not by itself evidence of that function.

### Event, team and outstanding ruling

The official Team Formation Guide sets the project window at **November 14, 09:00 to November 15, 23:59 local time**. For the Universal Event, the relevant time is that of the **person who created the team**. Using the user's Pakistan Standard Time answer as the planning basis gives **38 hours 59 minutes**, from **November 14, 04:00 UTC to November 15, 18:59 UTC**. Confirm the creator's actual zone in the team record before relying on this deadline; the joined-team email does not identify the user as creator. [Team Formation Guide](https://www.spaceappschallenge.org/resources/team-formation-guide/).

Universal teams need at least two participants for global judging, a maximum of six, and everyone registered for the same event. One active coder is not inherently a breach of those membership rules. The reported 2–3 members should be checked against the accepted roster, without inventing additional contributors. Current scoring details and submission format limits remain unverified: the FAQ schedules the judging and submission guides for November 13. Do not treat old weights or a remembered video duration as current. [Participant FAQ](https://www.spaceappschallenge.org/resources/participant-faqs/).

The supplied GO messages permit topic research and team formation. Current public rules still prohibit beginning project work before the event. General “join your team/begin work” wording is not a specific ruling on this repository. The narrow unresolved question is:

> Given the disclosed chronology, may Emberfall use these pre-event source transcriptions, crosswalks, analysis/checking scripts, design notes and this report during the event? If particular assets cannot be reused, is participation with an in-event re-derivation permitted despite the disclosed preparation, and what disclosure is required?

Ask asset by asset, including any earlier prototype described in historical notes even if absent here. This report is research/design preparation and must not be represented as event-created work. The existing organizer draft is the starting point; **no message was sent**. Space Apps Connect is now open; its official discussion guidance is available. [Team guide](https://www.spaceappschallenge.org/resources/team-formation-guide/), [official Connect guidance](https://github.com/nasa/spaceapps/discussions/1769).

There are two conditional competition paths: **A**, use specifically permitted preparation with disclosure; **B**, rederive only the allowed subset during the event if organizers expressly permit that path with the disclosed history. Without a ruling, eligibility remains unknown. Neither other teams' public repositories nor renaming files establishes permission.

The current terms require source attribution, applicable license documentation and rights to submitted material; original solution content must be freely available or appropriately open licensed. A GitHub code license does not automatically license its underlying scientific data. Do not bundle an Elsevier article, raw NASA-branded material or third-party media merely because it was downloadable. Prefer citations, permitted factual records and item-specific rights records. [Participant terms, updated August 7, 2026](https://www.spaceappschallenge.org/legal/).

## 4. Research frontier and its consequences

This was a focused primary-source pass through **7 November 2026 PKT**, not a systematic review. Access labels below are part of the evidence: an indexed publisher abstract establishes much less than inspected methods and tables. No external paper's experiments or benchmark scores were reproduced. Exact new scientific performance numbers are deliberately not used where their underlying tables were not inspected. The limitations column distinguishes reported findings from applicability concerns; recommendations and statements about what IGNIS can infer are this report's judgments, not endorsements by the cited authors.

### Combustion, materials, environments and measurement

| Source, version and access | Contribution, data and evaluation | Assumptions, limitations or negative evidence | Reusable component and concrete IGNIS consequence |
|---|---|---|---|
| [Link et al., 2018, Scientific Reports 8:120](https://doi.org/10.1038/s41598-017-18398-4). Local article methods and both supplement tables inspected; earlier figure audit reviewed. | Opposed spread over PMMA cylinders in microgravity and normal gravity; printed rates and condition histories supply the numerical case. | Sequential segments, limited/non-systematic conditions, initial versus segment atmosphere, differing ground statistics and ambiguous unit printing constrain inference. No raw image fits recovered. | Preserve the measurement definition, table location and history. Reuse the descriptive observations; do not train an unqualified gravity-effect model. |
| [Olson et al., NASA/TM-20210011385, 2021](https://ntrs.nasa.gov/citations/20210011385). Downloaded report; selected methods/chapter/appendix pages, not a complete reread. | BASS-II campaign methods and as-run records connect journal labels to burns and specimens. | It is another account of the same campaign, not independent replication. Some appendix entries conflict with other evidence; raw telemetry is absent here. | Make journal→burn→specimen relationships explicit, qualified and reversible. |
| [Ries, Eigenbrod and Meyer, 2024, PROCI 105358](https://doi.org/10.1016/j.proci.2024.105358). Publisher abstract/metadata. | Thin-PMMA spread experiments vary pressure, oxygen and flow in short microgravity experiments; thermal observations support interpretation. | Short-duration thin-sheet conditions do not supply a thick-rod or habitat predictor. Full numerical tables were not inspected. | Keep total pressure, composition, thickness and exposure time as separate applicability dimensions; equal oxygen partial pressure is insufficient evidence of equivalence. |
| [T'ien et al., 2025, Combustion and Flame 114244](https://doi.org/10.1016/j.combustflame.2025.114244). Publisher and institutional abstract/record. | SoFIE-GEL PMMA-sphere extinction mapping addresses flow, pressure, oxygen and heating history. Experimental interpretation makes solid heating relevant. | Sphere geometry and long heating differ from rod spread. Full results/uncertainty not reviewed. | Use as a strong lead for thermal-history metadata and extinction questions, not as another rod rate dataset. |
| [Rivera et al., 2026, Fire Safety Journal 162:104719](https://doi.org/10.1016/j.firesaf.2026.104719). Publisher abstract/highlights; full text inaccessible. | Opposed PMMA-rod work distinguishes oxygen limits for flame spread and flame reaction/persistence under changing oxygen and pressure. | Abstract access cannot settle the old mapping conflict, recover its data or establish numerical superiority. | Separate spread cessation from continued burning. This is the highest-priority missing full text for a later scientific expansion. |
| [Takahashi et al., 2026, Combustion and Flame 286:114803](https://doi.org/10.1016/j.combustflame.2026.114803). Publisher abstract/highlights. | FLARE comparisons examine charring and non-charring material spread and different spatial burning regimes. | Geometry and material behavior change the applicable simplifications; full model/data verification absent. | “Polymer” or shared hardware is not enough to pool PMMA, films and Nomex. Record char, melt and geometry information when known. |
| [Olson et al., 2024, Fire Safety Journal 150:104267](https://doi.org/10.1016/j.firesaf.2024.104267). Publisher abstract. | Partial-gravity cast-PMMA work in concurrent axial stagnation flow reports a flammability maximum near lunar gravity. | Different configuration from the selected opposed-flow records; not direct lunar-surface testing. | A counterexample to automatic monotonic interpolation or assuming microgravity and 1g bracket intermediate gravity. |
| [Nakaya et al., 2025 journal publication, DOI registered with 2024 suffix](https://doi.org/10.1016/j.combustflame.2024.113828). Publisher abstract. | Bayesian modeling of thick-PMMA spread with gravity/forced-flow experiments and a physical model. | Calibration depends on that model and experimental design; centrifuge/Coriolis effects matter. It does not validate a lunar prediction from our tables. | A future physics-based comparator if its data, assumptions and full method become accessible. Do not label our descriptive calculations Bayesian inference. |
| [Ferkul et al., LUCI, 2025 presentation record](https://ntrs.nasa.gov/citations/20250010653); [Sharma et al., 2026 modeling record](https://ntrs.nasa.gov/citations/20260000641). NTRS abstracts; presentations/full simulations not reproduced. | Partial gravity generated on a spinning suborbital platform and modeling of platform-related effects. | Effective gravity and rotating flow are experimental context; these are not measurements made on the Moon. | Partial-gravity research exists outside PSI. The challenge's current “not yet in PSI” statement is an access/coverage statement, not a claim of no research. |
| [NASA SAME overview](https://www.nasa.gov/wp-content/uploads/2025/07/smoke-aerosol-measurement-experiment-same.pdf), [SAME-R PSI-101](https://psi.nasa.gov/physci/repo/data/investigations/PSI-101), [SAME PSI-102](https://psi.nasa.gov/physci/repo/data/investigations/PSI-102). Overview text and indexed repository metadata; app pages returned shells. | Smoke aerosol characterization, measured moments and instrument interpretation; SAME-R metadata describes reflight after contamination of original collection grids. | Inferred distribution parameters can depend on a lognormal assumption. Pyrolysis smoke, flaming soot, aged aerosols and detector response are different endpoints. Raw particle datasets not acquired. | Detection profiles can explain what a diagnostic measures and which sources address a user's question. Do not turn a material spread rate into an alarm threshold. |
| [FLEX PSI-69](https://psi.nasa.gov/physci/repo/data/investigations/PSI-69) metadata and [NASA investigator account of cool flames](https://blogs.nasa.gov/ISS_Science_Blog/2013/11/25/cool-flames-on-the-international-space-station-an-anatomy-of-discovery/). Metadata/first-party account. | Droplet combustion, extinction and continued low-temperature behavior after visible flame disappears. | Visible flame disappearance need not imply that all reaction has ended. Droplet/diluent results do not determine solid-fuel cabin suppression doses. | A useful suppression interpretation and endpoint distinction, with phase-specific applicability. |

The synthesis is physical, not just semantic. Buoyancy, forced transport, diffusion, radiation and heat feedback can compete, so slower ventilation is not a universal safety intervention. Ignition, sustained spread, quenching, blowoff and cool-flame persistence must stay distinct. Material formulation, pigmentation, thickness, char formation, melting, holder proximity and prior heating can matter even when two records both say PMMA. The product should expose the measured factors and missing factors that affect a comparison, without pretending to solve a coupled transport/chemistry problem from metadata.

The statistical problem also precedes the AI. Published rate segments are not a complete census of everything that occurred during each burn. Missing rates might reflect what could be measured or reported rather than random missingness; that mechanism has not been established here. Operational termination and loss of observation can censor the endpoint of interest. Publication selection and the sampled condition grid affect observed minima. Do not impute dashes as zeros, infer unobserved failures from absent rows, or claim calibrated parameter identifiability without a specified model and suitable independent measurements.

### Evidence methods, scientific AI and failure modes

| Source, version and access | What was actually contributed/evaluated | Limitation or failure relevant here | Reuse decision |
|---|---|---|---|
| [Bai et al., 2021, JCIM, OntoChemExp/calibration](https://doi.org/10.1021/acs.jcim.0c01322). Primary full-text methods excerpts. | Ontologies and linked computational agents connect experimental chemistry data to sensitivity analysis and mechanism calibration. Implemented work, not merely a future knowledge-graph proposal. | Its kinetic observables and model assumptions differ from specimen-history reconstruction; no IGNIS task comparison. | Reuse established concepts for experiments, species, quantities and provenance. “A combustion knowledge graph” is not our novelty claim. |
| [Oreluk et al., 2018, arXiv:1801.10093v2](https://arxiv.org/abs/1801.10093). Abstract. | Community H2/O2 mechanism development with PrIMe and bound-to-bound data collaboration; consistency analysis relates data uncertainty to model feasibility. | Some observations/model predictions are inconsistent under the stated bounds; uncertain or estimated bounds matter. A feasible set requires a specified model and quantitative uncertainty. | Keep model–data consistency as a later pathway. Our flags and descriptive envelopes are not a substitute. |
| [Meyer and Pebesma, 2020 preprint / 2021 journal, area of applicability](https://arxiv.org/abs/2005.07939). Abstract/method description. | Training-distance and cross-validation-based applicability estimates evaluated in spatial prediction examples. | Being near training inputs is not proof of physical transportability; feature choices and validation design matter. | Borrow explicit coverage reporting, not a universal confidence score. |
| [Schumacher et al., 2025, GMD 18:10185–10202](https://gmd.copernicus.org/articles/18/10185/2025/). Primary HTML abstract, methods and limitations. | Local training-density information addresses limitations of nearest-training-point applicability summaries. | Dense repeated observations can look reassuring without adding independent information. It concerns trained prediction models, which IGNIS does not yet have. | Count relevant independent groups and joint condition coverage; do not advertise a calibrated “area of safe use.” |
| [Green, Karvounarakis and Tannen, 2007, Provenance Semirings](https://www.cs.ucdavis.edu/~green/papers/pods07.pdf). PDF abstract/formal introduction. | Established algebraic treatment of how output records depend on input records. | Relational lineage does not resolve experimental identity or validate physical claims. | Typed derivation links are mature prior art. A small relational implementation is sufficient. |
| [Simonsohn, Simmons and Nelson, 2020, specification-curve analysis](https://doi.org/10.1038/s41562-020-0912-z). Author manuscript abstract/method overview. | Evaluates results across defensible specifications rather than one selectively reported analysis. | Not every specification is scientifically defensible; changing the population can change the estimand. IGNIS will not implement the paper's full joint inference. | Show explicit branches and their effect; do not call a range across choices a confidence interval. |
| [Wilkinson et al., 2016, FAIR principles](https://www.nature.com/articles/sdata201618); [W3C PROV overview, 2013](https://www.w3.org/TR/prov-overview/). Primary principles/overview. | Reusable identifiers, metadata, access conditions and interoperable provenance. These are infrastructure principles, not prediction benchmarks. | “FAIR” does not mean all files are public, licensed for any use, or scientifically correct. | Stable identifiers, source hashes, rights, processing history and exportable records; no claim of complete standards conformance without validation. |
| [Yang et al., 2026, arXiv:2603.04452v1](https://arxiv.org/html/2603.04452v1). Full HTML framework/evaluation sections. | CombustionQA and a domain corpus evaluate naive retrieval augmentation; relevant context helps and noisy context hurts. | Knowledge-graph and pretraining stages are proposed, not demonstrated here. Difficulty filtering and same-context answer construction affect benchmark interpretation. A reported best score is not a universal RAG ceiling. | Use as a domain-specific baseline and warning about irrelevant evidence. Test our actual source-reconstruction tasks separately. |
| [OpenScholar, Nature, 2026](https://www.nature.com/articles/s41586-025-10072-4). Primary HTML methods/results/limitations. | Retrieval, iterative feedback and synthesis over a large scholarly corpus; ScholarQABench and expert evaluation test evidence-backed scientific answers. | Missing relevant papers and factual errors remain; fluency preferences need not equal factual quality, and benchmark exposure can contaminate evaluation. | Strong retrieval-and-synthesis comparator. IGNIS must show an advantage on structured quantities, histories and reproducible revisions, rather than generic literature QA. |
| [Ouyang et al., OmniDocBench, CVPR 2025](https://openaccess.thecvf.com/content/CVPR2025/html/Ouyang_OmniDocBench_Benchmarking_Diverse_PDF_Document_Parsing_with_Comprehensive_Annotations_CVPR_2025_paper.html). Primary paper/benchmark description. | Diverse PDF parsing evaluation makes layout, reading order, formulas and table structure measurable. | Structural table success does not certify units, merged-cell inheritance, experimental identity or meaning of dashes. No combustion-specific validation. | Keep extraction and scientific validation separate. Manual review is affordable for the event-sized corpus. |
| [Xiao et al., TableParseMap/DEC, arXiv:2608.09842v1, August 2026](https://arxiv.org/abs/2608.09842); [Li et al., PureDocBench v2, September 27, 2026](https://arxiv.org/abs/2605.07492v2). Abstracts only. | Recent parsing benchmarks analyze structural ambiguity and clean-versus-distorted document behavior; DEC proposes staged correction. | Benchmark performance does not establish semantic correctness on our scientific tables. No implementation or score replicated. | Later extraction study candidates; not a justification for unattended ingestion this weekend. |
| [Yuan et al., ConfRAG, ACL 2026](https://aclanthology.org/2026.acl-long.11/). Primary abstract/record. | Contradictory retrieved evidence and reason coverage are explicit evaluation subjects. | Contradiction handling is already an active research area. Language conflict is not automatically a conflict between independent experiments. | Evaluate support, contrary evidence and reasons separately. Do not claim invention of contradiction-aware RAG. |

The strongest current evidence-processing systems already combine retrieval, structured knowledge, provenance, uncertainty or contradiction handling. The remaining opportunity is a **specific application-level integration with measured effort savings**. It must earn its value through usable results and an honest experiment, not through the number of safeguards or the word “graph.”

## 5. Current alternatives: substantial overlap, bounded remaining gap

The three named repositories were rechecked through public GitHub metadata and pinned files. The review was static: **no third-party code or tests were executed, no application behavior was independently reproduced, and official 2026 competition status was not established**. The READMEs matched the earlier saved versions, but the present inspection included additional implementation files. A current repository is not necessarily a frozen submission.

| Alternative and pinned version | User task and evidence | What the inspected artifacts establish | Remaining gap and comparison obligation |
|---|---|---|---|
| **MicroFire Atlas**, commit **acb9aaa69486154da657c61469d3a1886e4c12b1**, October 5, 2026; MIT code. [Pinned README](https://github.com/A-K-M-Asifuzzaman/MicroFire-Atlas/blob/acb9aaa69486154da657c61469d3a1886e4c12b1/README.md). | Search and compare combustion evidence, inspect sources and obtain qualified answers. Data inspected include SIBAL, PMMA films and Nomex, plus publication-level findings. | 56 experiment records in the inspected data file, including eight reuse flags. Comparison code distinguishes held, changed and unrecorded context. The finding-ranking implementation uses query-dependent direct/analogous/mechanistic/context relevance. | Strong overlap with the proposed navigator. The inspected files did not establish the specific journal→burn→specimen recalculation workflow proposed here; this is a scoped observation, not proof that no comparable function exists anywhere in the repo. |
| **Fotia**, commit **01e3842cdfd55be45bbd15ec1ab6e8d0816b3f8f**, October 1, 2026; MIT code. [Pinned repository](https://github.com/AnteurAbderraouf/Fotia/tree/01e3842cdfd55be45bbd15ec1ab6e8d0816b3f8f). | Curated PSI-family browsing, report search, coverage and modeling exploration. | Read hybrid search and coverage code; inspected dashboard imports and shared modeling/evaluation code. It has implementation beyond a proposed catalogue, even where README roadmap wording lags. Its PSI-25 copy remains unauthenticated against the original repository in this session. | Coverage-aware search is already available. The common classifier evaluator uses stratified folds; whether any particular dataset needs additional grouping requires its own audit. No demonstrated leakage or performance failure is asserted. Compare the actual implementation, not an obsolete roadmap. |
| **FLARENEXUS**, commit **44dc68271f2daa0c830f3883867548fea794c2d0**, October 5, 2026. [Pinned data](https://github.com/KhalidHasan03/Flame-in-Freefall/blob/44dc68271f2daa0c830f3883867548fea794c2d0/data/experiments.js). | Interactive fire-investigation exploration and AI-assisted demonstration. | README and data-file header explicitly identify synthetic demonstration records. Data and AI adapter source were inspected, not run. A license file was not recovered in this audit; repository API license metadata was empty. | A relevant interaction-design comparator, not evidence that its displayed quantities are NASA observations. Do not copy its assets without establishing permission. No conclusion about the quality of unseen/live features. |

Two MicroFire details materially narrow our claims. Its [finding-relevance implementation](https://github.com/A-K-M-Asifuzzaman/MicroFire-Atlas/blob/acb9aaa69486154da657c61469d3a1886e4c12b1/apps/web/lib/finding-relevance.ts) already varies ranking weights to report robustness. Therefore “we add sensitivity analysis” is insufficient differentiation. Its data also distinguish publication findings from explicitly linked supporting records. IGNIS must connect a **computed answer** to the exact observations and permitted transformations, and revise that answer when its evidence assumptions change.

MicroFire's [answer-grounding code](https://github.com/A-K-M-Asifuzzaman/MicroFire-Atlas/blob/acb9aaa69486154da657c61469d3a1886e4c12b1/apps/web/lib/ask-core.ts) includes numerical/unit and causal-language checks. A general weakness of numeric-membership checking is that a number can occur in evidence but belong to the wrong specimen or endpoint. This is a **static methodological concern**, not a reproduced MicroFire bug. IGNIS should bind each generated numerical statement to a typed quantity and result identifier. Its reported evaluation results remain author-reported; the saved file contains original and rescored results, so comparing one subset against a README headline would be misleading.

Other tools solve consequential adjacent tasks:

| Tool or infrastructure | What it already does | Relationship to IGNIS |
|---|---|---|
| [NIST Material Flammability Database](https://www.nist.gov/publications/nist-material-flammability-database) and [current characterization program](https://www.nist.gov/programs-projects/material-flammability-characterization) | Experimental measurements, property calibration tools, material models and validation comparisons across scales. Primary program description reviewed; its entire database was not audited. | More scientifically mature for relevant material-model tasks. Complement it by identifying candidate microgravity evidence and preserving the conditions required before reuse. |
| [NASA MAPTIS](https://maptis.nasa.gov/register) | Materials information infrastructure with an access process. Public access information reviewed; records were not inspected. | A qualification/materials-information system, not a demonstrated replacement for our narrowly specified analysis workflow. Do not claim IGNIS qualifies materials. |
| [Cantera](https://cantera.org/) and NIST fire-modeling infrastructure | Chemical kinetics, thermodynamics, transport and physics-based simulation workflows. | Complementary computation. IGNIS can prepare an auditable selection of potential observations; it does not replace the solver, material properties or validation. |
| PrIMe/B2BDC and OntoChemExp | Structured scientific information and real model calibration/consistency workflows. | Closest scientific infrastructure prior art. Interoperable data is more useful than inventing another ontology. |
| OpenScholar-style retrieval/synthesis; filtered tables and expert-authored SQL/rules | Find relevant sources, summarize evidence, and reproduce selections and calculations. | Strong task baselines. If these match IGNIS on quality and effort, simplify the product and abandon algorithmic-superiority language. |

**Interoperability decision:** build a small reconciliation and calculation core with the required dashboard as its interface. Export plain CSV/JSON, stable source identifiers and derivation metadata. Do not rebuild a comprehensive PSI mirror. Reusing external schemas or code later is possible after checking licenses and event permission; no competitor implementation was incorporated here. External catalogues can consume the same exported records without adopting the IGNIS interface.

## 6. Three directions considered, one selected

| Direction | Named user role and input→output task | Evidence, independent units and nearest comparator | Added mechanism, failure condition and feasibility |
|---|---|---|---|
| **A. Automatic cross-document experiment linkage** | A combustion data curator supplies papers and reports; the system proposes publication→burn→specimen links with supporting attributes. | Current evidence is 19 labels in one campaign, with unresolved cases. Evaluation must hold out campaigns/documents, not rows from the same labeled crosswalk. Closest methods are rule-based record linkage and schema-aware extraction. | Potentially saves expensive integration work. Abandon automatic claims if it cannot beat expert rules at high link precision with human review effort included. Too little independent training/test evidence for a research claim this event. Use reviewed links as infrastructure; investigate automation later only if demand exists. |
| **B. Dependency-aware evidence selection** | A model-validation engineer asks for observations relevant to an endpoint and condition range; output is a justified, non-duplicative candidate set. | Current repeated specimens and common source ancestry expose the problem. Need several campaigns and user-agreed admissibility judgments. Closest comparators are filtered tables, expert rules, MicroFire and coverage-aware scientific workflows. | Could improve useful coverage while making dependence visible. Defeated if transparent filtering yields the same selection and effort. An “optimal” evidence set is undefined without a justified objective and loss function. Do not invent one this weekend. |
| **C. Source-linked claim reconstruction and revision — SELECTED** | A graduate combustion researcher or experimental analyst asks, “Which observations support this comparison, and how does the result change under this evidence scope or interpretation?” Sources and reviewed records become an executable, exportable analysis. | The two primary rod sources already support a concrete case. Later evaluation needs human-authored tasks across campaigns and endpoints. Closest comparators combine a curated spreadsheet, explicit rules, provenance and structured retrieval; specification analysis is established prior art. | Binds quantitative results, source choices and explanations to one reproducible result object. It can save revision/review work without discovering new physics. Defeated if users do not need revisions, or the best baseline is equally fast and correct. A small complete implementation is plausible for one builder; broader workflow research is post-event. |

C is selected because it turns the existing reconciliation into an operation a user can perform repeatedly. A and B remain limited supporting functions: human-reviewed linkage and transparent filtering. They are not three parallel research programs.

The positive research decision is **which evidence to carry into a literature comparison or model-validation plan, with what interpretation and missing information**. A dossier can contain usable data even when it cannot answer every physical question. “No certified safe cabin setting can be inferred” should not obscure “these are the relevant records, here is their descriptive contrast, and this is the next measurement needed.”

## 7. Implementable product design

### One complete journey

The landing view presents prevention, detection and suppression, plus a question field. A researcher asks for PMMA rod spread evidence at low initial oxygen. IGNIS identifies the endpoint and shows the interpreted question in editable fields. It ranks relevant investigations, displays source-backed findings and exposes a numerical analysis only where reviewed observations support it.

The researcher opens BASS-II, chooses the all-eligible-burn scope, and obtains the minima table and supporting records. Changing to first logged burns changes the stated population and regenerates the table. The 1.27-cm microgravity minimum becomes 19.3% under that scope, with the reason visible in the P5/P9 specimen history. The user can inspect the unchanged underlying B9 observation and the alternative research question it answers. A dossier exports the exact selection, calculations, caveats and source locations.

For a new smoke-detection question, the same navigator ranks SAME/SAME-R and explains measured versus inferred aerosol properties. For a droplet-extinction question, it ranks FLEX and distinguishes visible-flame extinction from other reaction endpoints. Those are useful qualitative evidence results; the interface does not fabricate run-level coverage for those domains.

### Breadth and numerical depth

The minimum catalogue should contain **eight investigation profiles**: BASS, BASS-II, Saffire-I, Saffire-II, Saffire-III, SAME, SAME-R and FLEX. Group related profiles visually without presenting each mission as an independent confirmation. Each profile needs an objective, material/fuel phase, geometry, environment, varied/fixed factors, measurements, hardware context, at least one supported finding and an explicit source/access level. This is a proposed build target, not completed curation. ACME/CFI-G, SoFIE-GEL, FLARE, DAFT and future LUCI/FM2 repository additions are contextual links or stretch coverage.

The quantitative module uses the reviewed rod evidence only. If reuse is permitted, retain all printed rows and their qualifications rather than silently removing awkward data. If organizers allow only in-event re-derivation, use a transparently labeled smaller reviewed subset with enough records for the chosen calculations. A subset must not display itself as complete S1/S2 coverage. Do not quote full-table minima from an incomplete subset; use “minimum in the displayed subset” or omit that calculation.

### Data contracts

Use a small relational store and typed validation. The word “Graph” in IGNIS's expanded name does not require a graph database.

| Object | Essential fields and invariants |
|---|---|
| **SourceVersion** | Stable source ID, DOI/NTRS/PSI identifier, URL, title, version/date, retrieval time, content hash where acquired, access level, license/rights note, page/table locator. A failed fetch is an access event, not a statement that data do not exist. |
| **Investigation / campaign** | Objective, platform, apparatus, fuel phase, materials and available measurements. Distinguish investigation identity from a publication that describes it. |
| **Specimen / burn / segment / observation** | Separate IDs and relationships. Journal labels are source-local aliases. Reused specimen, sequential burn and shared calibration relationships are explicit. Unknown identity remains unknown. |
| **SourceAssertion** | Exact as-printed value/text, unit string, location and asserted subject. Two sources can make incompatible assertions without either being overwritten. |
| **NormalizedQuantity** | Numeric value only when interpretation is established; canonical unit, original assertion ID, conversion rule and rounding. Ambiguous units produce named alternatives or unavailable absolute-rate calculations. |
| **MeasurementDefinition** | Physical quantity, operational definition, statistic, time window, environment, protocol and permitted analytical uses. S1 segment slopes and S2 reported repeat-test means are not identical estimands. |
| **Condition** | Pressure, O2 fraction, atmosphere components, flow magnitude/direction/location, gravity/platform, geometry, thermal/conditioning history; initial/final/contemporaneous phase and calibrated/uncalibrated status. No default pressure. |
| **LinkAssertion** | Candidate endpoints, evidence attributes, contradictions, reviewer/status, alternatives and source ancestry. Qualitative review status is not a calibrated match probability. |
| **DerivedResult** | Operation, input IDs, filters, units, output value, dependency groups, derivation version, unknowns and allowed interpretation. No language model arithmetic. |
| **AnalysisResult** | Question scope, ranked investigations, supporting/contrary findings, selected and excluded-for-calculation records with reasons, derived results, assumptions, source hashes, model/prompt version and timestamp. It is the sole input to screen, narrative and export. |

Keep four layers visibly distinct: **original**, **normalized**, **derived**, **interpreted**. A unit correction is not an original observation; a candidate linkage is not a new NASA identifier; a fitted rate is derived from experimental positions even if copied exactly from a published table. Missing, not applicable, not measured, inaccessible and undefined dash are different states.

Do not merge B22's possible burn allocations into a made-up average. Preserve the B16/B19 conflict and the balance of evidence; a conservative numeric mode may exclude them while a clearly labeled interpretation mode includes them as likely opposed. That switch must be explicit and its effect recomputed. For the S1 right-half unit issue, the existence-of-a-rate query can proceed while an absolute-rate comparison remains conditional. This avoids blocking every useful question because one field is unresolved.

### Ranking and calculation

For investigation navigation, rank by transparent, query-dependent criteria: endpoint relevance, fuel phase/material, geometry/protocol, environmental coverage and available evidence granularity. Prefer a simple ordered comparison of these criteria over an invented weighted “confidence” number. Show why a study appears and what differs. A qualitative question can use publication-level findings; a numerical question requires observation-level support.

Missing pressure is **unknown**, not “matches cabin pressure” and not automatic exclusion from all navigation. An explicit incompatible fuel phase may bar a quantitative transfer while remaining useful mechanistic context. Relevance ranking is neither hazard ranking nor certainty ranking. More publications from the same campaign do not automatically mean more independent support. If score weights are introduced later, publish them and test ranking stability; MicroFire already supplies a relevant comparator.

Implement only a short allowlist of scientific operations:

1. List and count records, with distinct counts for rows, segments, burns and specimens.
2. Compute minima/maxima among **observed printed quantities under a displayed selection**; do not relabel them physical thresholds.
3. Convert unambiguous units and calculate descriptive differences or relative changes with a declared denominator.
4. Compare compatible quantities side by side while retaining protocol/statistic differences.
5. Recalculate the same operation under a declared scope or interpretation branch and identify the records responsible for the change.

A branch can change the **population** (all burns→first logged burns), the **source interpretation** (a qualified mapping or unit reading), or the **display question**. Label these separately. Do not average branches or give them probability weights without a model. Report branch disagreement as sensitivity to choices, not measurement uncertainty. Group influence shows dependence of a calculation on data; it does not estimate a causal effect of the group.

### The AI role and smallest architecture

**Default stack:** Python, Streamlit, SQLite or small in-memory tables, typed models, and a mature plotting library. This uses the existing data-analysis environment and avoids a second frontend/backend integration for one builder. If the builder already knows another stack substantially better, preserve the data contracts and workflow rather than forcing a learning exercise. No stack has been installed or application code written for this assessment.

| Stage | Method | Reason |
|---|---|---|
| Natural question→editable query | One model call returning validated structured fields and requested operation | Useful flexibility beyond exact preset wording. Reject invented IDs and unsupported operations. |
| Retrieve and rank | Lexical search plus metadata rules; semantic retrieval only if it improves a measured case | Corpus size does not require a vector database. The ranking must remain inspectable. |
| Select, compare and recalculate | Deterministic functions over reviewed records | Repeatable arithmetic and consistent exclusions. |
| Explain the result | Model receives the bounded AnalysisResult and permitted source excerpts | The model can explain relevance and limitations without independently choosing new numbers. |
| Validate/render/export | Deterministic quantity/citation checks; one result object drives all outputs | Prevent stale charts, prose and exports from disagreeing. |

A generated numerical sentence must reference a result ID, subject, quantity, unit and scope. Checking that “17.6” exists somewhere in the context is insufficient. If explanation validation fails, display a templated explanation of the computed result and expose the failed-generation status. Evidence content is untrusted input: it cannot issue instructions, execute code, write arbitrary SQL or fetch arbitrary URLs through the model.

The interface needs four connected views, not a dashboard full of unrelated widgets: **question and ranked investigations**, **evidence/comparison table**, **source and history inspector**, and **export preview**. A compact plot is useful where it clarifies the displayed calculation; avoid a continuous fitted curve through incomparable or ambiguous observations. Keyboard operation, legible units, visible unknown states and expandable detail matter more than 3D visuals.

Export a readable HTML/Markdown dossier and a CSV/JSON bundle: question, scope, source list, reviewed rows, link assertions, operations, result values, contrary evidence, missing fields, rights and version hashes. Call it an **evidence package or model-input candidate**, not automatically model-ready data. Importing into a model requires its own endpoint, parameter and validation checks.

### Failure paths and maintenance boundaries

| Failure | Required behavior / fallback |
|---|---|
| Model outage or no API key | Typed form and deterministic calculations remain usable; clearly show AI unavailable. A recorded AI interaction may document actual earlier behavior if the submission rules allow it, but is not a live response. |
| Ambiguous question | Show the interpreted scope and let the user edit it; offer the useful answerable portion. Do not silently assume pressure, endpoint or material. |
| Source inaccessible | Use a permitted cached version with hash/date if available; otherwise retain the citation and downgrade access granularity. Never fabricate source content. |
| Hash mismatch/corrupted source | Quarantine dependent calculations and explain which source must be repaired; unrelated catalogue functions can continue. |
| Changed filters, source or interpretation | Invalidate the affected AnalysisResult. Recompute before enabling export. No old narrative under a new chart. |
| Invalid model citation/quantity | Use verified result text and show the generation failure; do not preserve unsupported wording for fluency. |
| API quota/latency/cost spike | Bound question/excerpt sizes, rate-limit calls and cache only appropriately keyed public results; typed controls still work. |
| Missing human scientific review | Mark assistant-checked status; narrow claims. Do not manufacture a reviewer badge. |

Keep API credentials server-side, outside the repository and exports. The event version accepts public curated sources only; arbitrary private uploads add unnecessary permissions and isolation work. Do not include mailbox contents, personal contact details, unpublished data or user queries in public dossiers by default. Streamlit caches can be shared across sessions, so key and scope them deliberately; use session state for private user choices. [Official secrets guidance](https://docs.streamlit.io/develop/concepts/connections/secrets-management), [caching documentation](https://docs.streamlit.io/develop/concepts/architecture/caching).

## 8. SOTA feasibility and a fair validation program

### What can be earned

| Contribution | Present status | Event-feasible claim | Evidence for a stronger later claim |
|---|---|---|---|
| Curated scientific data | Useful assistant-checked reconstruction of one campaign | “We expose traceable measurements and experimental history, with listed unresolved fields.” | Independent review, a reusable release with rights/provenance, correction process and demonstrated reuse. |
| Workflow improvement | Plausible, untested | Small external pilot and fully reported matched-data examples, if reviewers are available | Representative researcher tasks and users; time/quality benefit against strong matched baselines. |
| Novel algorithm | Not established; core ingredients have substantial prior art | No algorithmic SOTA claim | A genuinely new mechanism plus controlled component experiments, not merely the UI's overall performance. |
| Predictive combustion SOTA | Unsupported | None | Independent campaigns, appropriate endpoints and raw/uncertainty information, strong physics/statistical comparators, leakage-safe external validation. |
| Evidence-processing SOTA | A possible research direction, not a current achievement | Demonstrate the task and release the protocol | A broader, independently authored benchmark, strong current methods, fair inputs/resources and a reproducible meaningful advantage. Creating a narrow benchmark and winning it alone is insufficient. |

The closest comparator to the selected mechanism is **a knowledgeable researcher using the same curated data, conflict register and explicit rules**. MicroFire is the closest audited product comparator; OpenScholar-style retrieval/synthesis is a strong adjacent scientific-AI method. The event is too short, and the independent evidence too thin, to earn a defensible broad SOTA claim. A narrow workflow claim could later be earned even if no novel algorithm survives the comparison.

### Four evaluations, with different questions

| Evaluation | Inputs and comparators | Outcome and fair interpretation |
|---|---|---|
| **Curation value** | Compare unreconciled documents with the reviewed crosswalk/history package. Hold task and assessor criteria fixed; record all curation/review effort. | Link accuracy, missing context recovered, usable answer completeness and effort. Inputs are intentionally unequal. Any improvement is attributed to curation, not algorithmic superiority. |
| **Method value** | Give IGNIS, spreadsheet+conflict register, expert rules/SQL, and hybrid metadata retrieval the **same reviewed records, links, conflicts and source access**. For generative comparators use the same model, evidence budget and task information where feasible. | Correct selections, valid derived results, grounded claims, useful-answer coverage and resource use. A stronger prompt or extra manual facts must not be hidden in IGNIS. |
| **End-to-end value** | Begin with identical PDFs/metadata and no privileged crosswalk. Compare extraction, linking, review, correction and answering workflows under declared budgets. | Total curator+reviewer+user time, errors left after review and reproducible deliverables. Include the cost of authoring the special rules. Reused reviewed assets must be charged or separately amortized. |
| **User value** | Real researchers use the app and a usable same-data spreadsheet/filtered-table workflow on matched, counterbalanced tasks. Provide equal training and source access. | Correctly completed tasks, capped completion time, reviewer corrections and usefulness to their actual work. Preference and visual polish are secondary. |

A baseline spreadsheet should have filters, documented formulas, source links and the same history/conflict fields. Do not hand it raw PDFs while IGNIS receives a curated knowledge base and call the difference reasoning. The expert-rules baseline may reproduce every number; that is expected. The interface must then earn its place through lower total effort, easier revisions or better completion of actual research tasks.

### Proposed prespecification

The existing October 21 H1 focuses on fewer incorrect admissions, no more wrongful exclusions, and median time no greater than 1.25× the spreadsheet. Preserve it as a dated earlier hypothesis; it has no results. The following is a **new prospective protocol**, not a retrospective change to a completed study. Lock its task set, scoring and margins before examining final outcomes.

| Measure | Definition | Proposed decision threshold |
|---|---|---|
| **Primary: capped task-completion time** | Active user time plus waiting needed to produce a dossier that meets the task rubric. Set a 15-minute task cap; failures/timeouts receive the cap. Do not analyze only successful easy answers. | Median paired proportional time reduction at least **25%** against the prespecified spreadsheet+expert-rules workflow. This is a chosen useful margin, not an estimated effect. |
| Task correctness | Predefined required findings, source links, admissible selection, numeric correctness and interpretation; assessor blind to condition where practical. | Correct-completion rate no more than **5 percentage points lower**. A small pilot may be unable to establish this statistically. |
| Useful answer coverage | Answerable tasks receiving a correct complete or explicitly correct partial answer with the required usable content. | At least **90%** on the agreed answerable set; report complete and partial counts separately. |
| Critical unsupported conclusion | Fabricated measurement, wrong experimental subject, unsupported threshold/causality/transfer, or materially wrong exclusion/admission that changes the research conclusion. | **Zero observed** in the held-out evaluation. This is not proof of zero future risk. |
| Numerical grounding | Each number has the correct quantity, subject, unit, scope and derivation/source. | **100% of reported numeric claims** in the reviewed test set; withheld numeric output counts against coverage where an answer was warranted. |
| Reproducibility | Independent recomputation from exported rows/operations; agreement between UI, explanation and export. | All evaluated dossiers reproduce to the declared precision. |
| Total effort | Curator, reviewer, user and correction time, plus compute/cost and task latency. | Report separately for first use and a stated repeated-use workload; do not hide maintenance or manually prepared exceptions. |

Report link precision/recall, ranking relevance, unjustified admission/exclusion and citation entailment as diagnostic measures. Overall QA accuracy can hide the important failure. Classify outcomes as correct complete, correct partial, warranted abstention, unwarranted abstention, incorrect answer and tool failure. A system that refuses every question fails coverage and task completion even if it makes no numerical errors.

Freeze the primary comparator before sealed evaluation. Report rule-based and hybrid-retrieval method comparisons separately; when comparing human completion time with those methods, provide a usable interface and count their review effort too. If another strong comparator matches IGNIS, a time advantage over the spreadsheet alone does not establish method SOTA. Until confidence intervals support the margins, report an observed pilot difference rather than asserting superiority or noninferiority.

### Independent tasks, controls and uncertainty

The current 12 tasks and T13 are development material. Additional assistant-written variations remain development material. First obtain an independent source reviewer for the existing case; separately ask researchers unfamiliar with the implementation to author tasks and scoring rubrics. The designer should not see sealed tasks before the implementation freeze. If tasks are exposed for debugging, move them to development and replace them before any held-out claim.

A feasible event check is a few genuinely external tasks and one or two external users, if available; report per-task outcomes without a SOTA conclusion. A post-event pilot could recruit **6–8 relevant users with eight counterbalanced tasks each**. That is a planning target, not recruitment completed or a power calculation. A later benchmark should span several independently conducted campaigns and more than the known PMMA examples. Use pilot variance and task dependence to determine the study size needed to test the chosen margins; participant×task counts are not counts of independent experiments.

For methods, split by campaign/source ancestry and shared calibration where possible; group specimens, burns and segments within them. For users, account for both participant and task clustering and order effects. Do not bootstrap 98 table rows as independent combustion evidence. With only one useful campaign, report descriptive results and acknowledge that cross-campaign transfer is untested. Do not infer measurement confidence intervals from missing uncertainties or from alternative source interpretations.

| Test or ablation | What it should reveal |
|---|---|
| Positive control: B4 unit conversion and −5.6 µm/s difference | The system produces a useful correct result, not only caveats. |
| Positive control: an independently chosen detection/suppression navigation question | The required breadth works beyond the PMMA preset. |
| History control: all selected burns versus first logged burns | Selection, question scope and the 1.27-cm result update together; neither branch is called a causal treatment effect. |
| Interpretation control: qualified unit or mapping branch | Exact affected calculations change or become unavailable; unrelated findings remain usable. |
| Negative control: unsupported pressure-specific cabin recommendation | The system gives relevant research evidence but declines the unsupported engineering conclusion. |
| Same label on unrelated specimens; swapped unit; duplicate publication | No label-only join, silent conversion or double-counted independent support. These synthetic mutations test software, not new physics. |
| Remove lineage while retaining text; remove revision calculation while retaining sources | Tests whether the selected mechanism adds anything beyond good retrieval and explanatory prose. |
| Remove LLM; use typed form and templates | Tests the AI contribution separately from deterministic analysis and interface value. If natural-language interaction adds no value, simplify it while still satisfying the challenge's actual AI requirement. |
| Strong retrieval baseline given the complete reviewed crosswalk | Tests whether apparent superiority was merely privileged information. |
| Change filters after a successful answer; corrupt a source hash; deny the API | Tests stale-output invalidation and graceful failure. |

Avoid outcome-derived labels in purported prediction, answers embedded in retrieved benchmark notes, source copies divided between train/test, and model choices tuned on sealed questions. For a public task benchmark, document potential model pretraining exposure; use newly authored tasks and unpublished answer keys rather than claiming absence of contamination.

**Falsifiers:** if a strong matched-data baseline meets the time/quality criterion equally well, no method-superiority claim survives. If curation helps but the interface does not, release the reviewed data and simple rules as the useful contribution. If researchers already possess these histories and do not need repeated revisions, the principal user-value hypothesis fails. If success depends on hard-coded answers to the known case, it is a demonstration, not a general workflow. If independent source review invalidates a key mapping, retain the useful verified operations and replace the affected demonstration rather than defending it.

## 9. Competition evidence and demonstration

### What the past cohorts actually support

This is a deliberately bounded, non-random comparison: seven requested winner leads from 2023–2025, one well-documented non-winning Global Finalist, and two additional Seoul comparison entries with more limited artifacts. It cannot estimate winning probabilities or isolate the causal effect of any feature. Official outcomes, team descriptions and this report's strategic inferences are separated below. Current sites/repos may have changed after their event; no inspected repository was certified as the exact submitted snapshot.

| Team, year and outcome | Challenge and original artifact evidence | What is verifiable; what remains missing | Inference for IGNIS, not a claimed reason for selection |
|---|---|---|---|
| **LunarTech Ensemble, 2023 — Best Use of Science** | Make a Moonquake Map 2.0. [NASA outcome](https://science.nasa.gov/directorates/smd/2023-nasa-international-space-apps-challenge-announces-10-global-winners/); [team-member technical description](https://www.linkedin.com/posts/yousef-kotp_spaceapps-nasa-moonquakemap-activity-7125759655527464961-ADRp). | Team descriptions identify an interactive mapping/immersive lunar experience. Original project page did not yield inspectable submission content; no method or performance reproduction. | A scientific dataset can be communicated through a comprehensible experience. An immersive interface is not evidence of scientific superiority. |
| **Spacebee, 2023 — Best Use of Technology** | Same moonquake-map challenge. [NASA outcome](https://science.nasa.gov/directorates/smd/2023-nasa-international-space-apps-challenge-announces-10-global-winners/); [team repository](https://github.com/spacebee-technologies/Moonquakes-SpaceApps2023). | README/tree expose lunar-seismic/map assets and related tools. Current repository inspected, not executed or frozen to 2023. | A coherent artifact with accessible data paths is a stronger reference than an award announcement alone. Different award outcomes on the same challenge do not reveal hidden scoring weights. |
| **WMPGang / SkyShield, 2024 — Best Use of Science** | Create an Orrery Web App that Displays Near-Earth Objects. [NASA outcome](https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-international-space-apps-challenge-announces-2024-global-winners/); [team-authored 2025 conference abstract](https://meteoroids2025.gfo.rocks/abstracts_received.html). | The later abstract describes a 3D orrery connecting NEOs and meteor streams. It is explicitly post-event evidence; the original entry's full method was not recovered. | Link the visualization to a concrete scientific question. Do not imitate unvalidated risk numbers or treat post-event capabilities as what judges saw. |
| **GaamaRamma / Waterwise, 2024 — Best Use of Data** | Leveraging Earth Observation Data for Informed Agricultural Decision-Making. [NASA outcome](https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-international-space-apps-challenge-announces-2024-global-winners/); [original project link](https://www.spaceappschallenge.org/nasa-space-apps-2024/find-a-team/gaamaramma/?tab=project); [demo](https://nasa-hackathon-2024-nine.vercel.app/). | Official announcement supports the agricultural water-management purpose. Project API access was denied; demo yielded an empty shell and the video could not be inspected. Detailed formula claims found in secondary summaries were not promoted to verified capabilities. | An actionable user result is a useful design target. Missing artifacts prevent a technical comparison or a claim that a particular formula caused the award. |
| **42 QuakeHeroes, 2024 — Best Use of Technology** | Seismic Detection Across the Solar System. [NASA outcome](https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-international-space-apps-challenge-announces-2024-global-winners/); [repository](https://github.com/gabrielchayb/42-quake-heroes). | Official description and current README/tree identify an AI seismic-detection application. No training split, accuracy claim or notebook result was independently validated. | A narrow detection task can be legible and consequential. This does not mean our data justify a predictive model merely because another winner used one. |
| **SpaceGenes+, 2025 — Best Use of Science** | Build a Space Biology Knowledge Engine. [NASA outcome](https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-announces-2025-international-space-apps-challenge-global-winners/); [team site](https://spacegenes-plus.framer.website/). | The site distinguishes a specific prototype case from conceptual additional cases and future cross-study/custom-upload work. It was read, not run as a validated scientific analysis; event freeze unknown. | Label implemented depth and future breadth clearly. An award does not validate a heuristic synergy formula or turn observational biological contrasts into causality. |
| **Astro Sweepers, 2025 — Galactic Impact** | Commercializing Low Earth Orbit. [NASA outcome](https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-announces-2025-international-space-apps-challenge-global-winners/); [team site](https://astro-sweepers.vercel.app/home). | Current product/mission landing page inspected. Accuracy and certification-style marketing claims were not reproduced or adopted as facts. | Explain the intended user's consequential workflow and delivered artifact. Avoid borrowing the authority of unverified performance labels. |
| **SPACEWALK, 2025 — Global Finalist, not Global Winner** | Stellar Stories: Space Weather Through the Eyes of Earthlings. [Official indexed team record](https://www.spaceappschallenge.org/2025/find-a-team/jakdang-moui/?tab=details); [team retrospective](https://blog.devstory.co.kr/en/post/nasa-space-app-challenge/); [repository](https://github.com/chxhyxn/SpacerWalker). | Official team metadata includes finalist status; team retrospective explicitly reports not winning. It describes an interactive iPad story and links code/demo. Current repo and post-event retrospective are not a frozen submission; no app test performed. | A complete, polished, audience-specific artifact can reach finalist status without winning. Completeness and presentation are necessary work, not a guarantee. |
| **NUPS / EXOHUNT and !DS / Space Biology Knowledge Explorer, 2025 — bounded comparison entries** | [Seoul organizer's results](https://nasaspaceappskr.org/2025/en/awardees/) list NUPS third locally and !DS first locally. The SPACEWALK retrospective also lists NUPS among Global Finalists. | Local outcomes and project names verified. NUPS global status is secondary within this audit; official project pages could not be read. No technical inference from missing artifacts. Ignore generic image alt-text saying “Global Winner” on a page of local awards. | The comparison sample exposes missing evidence rather than supplying a manufactured loser narrative. Local placement and technical quality cannot be reverse-engineered into global judges' reasons. |

These cases support studying **specific users, demonstrable artifacts, clear data use and legible outputs**. They do not prove that a graph, chatbot, game, neural model or polished video increases award odds. Our previous IEEE outcome remains unexplained because judging evidence is unavailable. Measure scientific quality, user value and challenge alignment separately; do not invent a retrospective explanation.

### One memorable demonstration

Use the central question: **“Which low-oxygen PMMA spread observations can I carry into a comparison of first-use specimens?”** Start by showing the useful evidence set and calculation, not an error warning.

1. Enter the question in natural language. Show the interpreted endpoint and scope, then the ranked investigations with reasons. BASS-II is relevant; FLEX and SAME can be useful elsewhere but do not supply rod-spread rates.
2. Open the quantitative comparison. Display the source-backed minima and an inspectable list of observations. Briefly show that IGNIS can also calculate a plain descriptive rate contrast correctly.
3. Compare all selected burns with first logged burns. The 1.27-cm result changes from 17.6% to 19.3% because B9/P9 is a reburn of specimen 202m. The screen explicitly states that the population changed and that these are initial-O2 table minima.
4. Open P5/P9's source history. Show why the lower-O2 observation remains useful for a previously burned specimen and why it cannot answer every fresh-specimen question. Do not dramatize this as an author error or newly discovered physical law.
5. Export the dossier and open it. The exported result must match the displayed scope and calculations and include the underlying record IDs.
6. Enter a different, unprepared question about smoke aerosol measurements or droplet extinction. Show a useful answer with the proper investigation, endpoint and source granularity. This is the proof that the dashboard is broader than one scripted arithmetic story.

Budget this narrative for roughly three minutes as a design constraint, **not a verified submission video limit**. Adapt it to the November 13 guide. If the full-table dataset cannot be used, change the demonstration wording and claims to the actual reviewed subset; never present retained full-table results as newly derived from that subset.

### Rubric-to-proof map, provisional until the guide appears

The five familiar criteria below are historical planning lenses. **Their 2026 applicability, weights and scoring procedure are not verified.** Reconcile this table against the actual guide on November 13; do not publish invented weights.

| Planning lens | Concrete proof | Likely dismissal risk addressed |
|---|---|---|
| Impact | A named research task, usable dossier, and external evidence of effort or decision improvement | “Nobody needs this extra interface.” |
| Creativity | Executable revision of a source-backed comparison, with honest prior-art differentiation | “Another catalogue/chat wrapper with familiar safeguards.” |
| Validity | Source locations, stable records, correct calculations, endpoint distinctions, independent review if obtained | “A plausible story built on misread experiments.” |
| Relevance | Live summarize/rank/interpret workflow across all three challenge areas | “A rod-table audit that avoids most of the brief.” |
| Presentation | A self-contained question→result→source→export demonstration, readable without narration | “The authors must explain everything for the system to seem useful.” |

Best Use of Data and Best Use of Science are sensible positioning themes, not lanes we select or protect. The project page should state what works, what is measured, what is proposed, what data/AI were used and what limitations affect the result. A scientific advantage and an award-winning entry are different claims.

For submission reliability, complete and save the required project-page fields early, test public links without a logged-in developer session, verify the live AI path with available quota, and make the readable dossier accessible if the hosted app is unavailable. A recording must be labeled as recorded behavior. Test exports from a newly changed query, not just the default view. No particular video length, file limit or mandatory hosting provider is assumed before the guide is read.

## 10. Adoption path and maintenance

A plausible first user is a graduate researcher or experimental analyst preparing a cross-study comparison or selecting candidate data for a model-validation plan. The deliverable is an evidence package they can cite, inspect and import into their existing analysis tools. This is more plausible than asking a spacecraft operator to accept a new safety recommendation from a hackathon dashboard.

There is a real adjacent task: a [NASA TaskBook research record led by Ya-Ting Liao](https://taskbook.nasaprs.com/tbp/index.cfm?TASKID=31FF2895CF11A3D63C9B8986DB12A22A&action=public_query_taskbook_content) describes synthesis of microgravity/partial-gravity flame-spread evidence using BASS/Saffire and related analyses. That supports the existence of an evidence-integration workload; it also shows that researchers already pursue such synthesis with their own methods. It is **not** a partnership, endorsement, unmet-demand measurement or promise that this group would use IGNIS.

The adoption sequence should be small:

1. Have an independent domain researcher check one real comparison and identify the decision they need to make. Capture missing fields and how they currently work.
2. Let a second person reproduce the resulting dossier in their usual spreadsheet, Python or MATLAB workflow. Preserve source IDs and derivations through the round trip.
3. Add a second campaign only if its data can be reviewed and it exercises a new need. Measure curation and update cost before expanding coverage.
4. Provide a documented correction process: new source versions do not silently overwrite old dossiers; reviewer decisions and uncertainty changes remain visible.

Maintenance consists of source monitoring, changed-rights/access checks, schema migration, scientific review of new mappings and regression checks for known calculations. Assign one maintainer and publish a coverage date. A tiny well-maintained corpus is preferable to nominally comprehensive records nobody can audit. Plan first-use and repeated-use economics explicitly: a few seconds saved per question will not justify days of bespoke curation unless the data are reused enough or avert consequential errors.

Before engineering use, establish intended use, acceptance criteria, uncertainty treatment, domain validation, independent review and the consequences of incorrect outputs. [NASA-STD-7009B](https://standards.nasa.gov/node/263) and the [NASA-HDBK-7009B handbook approved February 3, 2026](https://standards.nasa.gov/system/files/tmp/NASA-HDBK-7009B_Final%2002-03-2026.pdf) are relevant credibility guidance. Reading or citing them does not certify IGNIS, establish compliance, or validate any material for flight.

## 11. Adversarial review of the selected design

These are six perspectives applied by this assistant, **not six independent expert reviews**. “Repaired” below means the design instruction changed; it does not imply that software or empirical validation is complete.

| Perspective and concrete counterexample | Severity / affected claim | Repair made in this design | Evidence needed to close the objection |
|---|---|---|---|
| **Combustion/materials:** a flame persists after spread stops; the system labels both “extinction.” | Critical for physical interpretation. | Separate operational endpoints and retain measurement phase/protocol; exclude universal safety recommendations. | Independent review of endpoint mapping and at least one external task distinguishing spread, visible flame and continuing reaction. |
| **Combustion/materials:** PMMA rods at unknown pressure are used to recommend an oxygen-rich reduced-pressure cabin condition. | Critical for transfer/engineering claims. | Pressure unknown remains explicit; provide candidate evidence and missing conditions rather than a recommendation. | Reviewer acceptance of the allowed inference and any future physics/model validation for transfer. |
| **Data/statistics:** four segments from one burn and a second publication become five independent confirmations. | Critical for uncertainty and generalization. | Typed lineage and multiple dependence relationships; no row-level confidence interval. | Export inspection plus grouped evaluation on genuinely separate campaigns. |
| **Data/statistics:** selecting first logged burns is marketed as proving the original all-burn conclusion wrong. | High for the headline. | Display the changed population and preserve both useful results; no causal reburn claim. | Blind reviewer explains the difference correctly from the dossier without author coaching. |
| **SOTA:** a baseline given the same crosswalk, conflicts and rules reproduces every result. | High for algorithmic novelty; expected for arithmetic. | Claim workflow benefit only if measured; compare effort and completeness against that strong baseline. | Prespecified matched-data study. If no meaningful improvement, replace the product claim with a simpler data/rules contribution. |
| **SOTA:** the literature search misses a tool already doing source-linked revision. | High for uniqueness claims. | No first-ever claim; bounded repository inspection and explicit prior art. | Broader task-specific review before a paper, plus direct comparison with the closest discovered method. |
| **Research user:** the scientist already knows the specimen history and needs raw uncertainty estimates that IGNIS lacks. | High for product demand. | Target evidence assembly/revision, expose missing raw data, and test a user-originated task before expanding. | An observed real workflow where the dossier saves work or changes a justified selection. One enthusiastic comment is insufficient. |
| **Research user:** every answer is a caveat and nothing can be exported for analysis. | High for usefulness. | Positive calculations, compatible side-by-side comparisons and useful partial answers are minimum features. | Coverage and task-completion criteria; correct exports verified by another person. |
| **Engineering:** the chart updates but a cached LLM explanation/export retains the old filter. | Critical for trust. | One versioned AnalysisResult drives every surface; changing scope invalidates prior results. | State-change tests and an independently recomputed exported dossier. |
| **Engineering:** the solo builder spends the event on PDF extraction, deployment or a graph database. | High for delivery. | Reviewed data, one runtime, simple tables, bounded AI calls; explicit cut list and time gates. | End-to-end workflow working by Saturday evening, with no new infrastructure dependency afterward. |
| **Competition:** a polished PMMA case omits detection/suppression and has no live AI capability. | High for alignment. | Eight profiles, three-domain navigation and an actual model-backed new-question path. | Fresh cross-domain queries and a working submitted URL. |
| **Competition:** an excellent application reuses disallowed pre-event assets or the roster is ineligible. | Critical for participation. | Asset-specific ruling and disclosure; verify accepted roster and creator's zone; no assumed clean-room exemption. | Written organizer clarification and actual registration records. Current user confirmation alone does not settle asset permission. |

### Component decisions

| Component | Decision | Reason |
|---|---|---|
| Broad fire-safety research navigator | **KEEP** | Directly aligned with the required investigation-level dashboard. |
| Source-linked claim reconstruction and revision | **KEEP as the primary hypothesis** | Clear positive operation, testable beyond arithmetic and bounded enough to implement. |
| PMMA specimen-history case | **REPAIR** | Strong worked example once population changes, oxygen timing and atmosphere inference are handled correctly. |
| P4 arithmetic case | **KEEP as a control** | Useful transparent calculation; too ordinary to be the main novelty claim. |
| B16/B19 “NASA contradicts the paper” headline | **CUT** | Overstates the evidence and distracts from user value. |
| Conflict register and use constraints | **KEEP, subordinate to useful output** | Necessary context, not an automatic conflict detector or the entire product. |
| Specimen-only independence rule | **REPLACE** | Shared source, apparatus, calibration and atmosphere can matter across specimens. |
| Automatic PDF-to-science pipeline | **CUT from event scope** | Extraction and semantic review costs exceed the value for this tiny corpus. |
| Learned linkage, universal predictor, custom training | **CUT from event scope** | No adequate independent validation set or justified modeling target. |
| Dedicated graph/vector database and multi-agent system | **CUT** | No measured need; relational records and simple retrieval suffice. |
| Reproducible dossier and interoperable export | **KEEP** | Concrete research artifact and a way to test the workflow independently. |
| Existing evaluation centered on refusals/admissions | **REPAIR** | Retain diagnostic errors; make useful completion and effort the primary product test. |
| Pre-event rebuild-as-exemption assumption | **REPLACE** | Re-derivation is a possible organizer-approved path, not unilateral permission. |

The project can still fail despite excellent implementation: the task may be too infrequent to justify a tool; strong existing products may match it; the public dataset may lack the fields researchers actually need; one campaign may not generalize; broad coverage may remain superficial; external review may defeat the central interpretation; the judges may value a different well-supported solution; or eligibility/submission problems may prevent consideration. None of these has a defensible probability from the evidence available.

## 12. Execution decision, gates and realistic effort

**Decision now:** finish this research assessment and stop widening the architecture. Seek the narrow permission ruling and external source/task evidence. Do not start the submission application before the permitted event. Research preparation remains disclosed regardless of the path later authorized.

### Scope tiers

| Tier | Required contents | Honest claim |
|---|---|---|
| **Minimum complete entry** | Eight sourced investigation profiles across three areas; query-dependent summaries/ranking; real AI question interpretation/explanation; one reviewed quantitative family; editable scope, source/history inspection, deterministic calculations and consistent export; service fallback and complete submission. | A functioning research prototype with clearly stated coverage and assistant/human review status. |
| **Competitive target** | Minimum plus independent scientific check, useful new questions from someone outside design, and a matched-data pilot showing a meaningful advantage or honestly characterizing its absence. | A distinct workflow with preliminary external evidence; not SOTA or engineering readiness. |
| **Stretch** | A second independently reviewed campaign, richer interpretation-branch comparison, or a measured retrieval improvement. Add only after the minimum works and evidence justifies it. | State exactly what has been reviewed and evaluated. |
| **Cut** | Automatic ingestion of arbitrary papers; raw-video extraction; 3D mission control; universal hazard/risk scores; lunar interpolation; ventilation/suppression prescriptions; custom training; elaborate graph infrastructure; authentication/private uploads; automated optimization of an undefined evidence objective. | No loss of the core research workflow. |

The minimum is still ambitious for one builder. Treat **20–24 productive hours** inside the 38h59 window as a planning assumption, including integration and submission work; allow sleep, meals and interruptions. Do not allocate the other members as expert developers or reviewers without their actual commitment. They can help with source checking, usability or submission if available, but the critical path assumes one coder.

### Before coding

By the evening of **November 13 PKT**, aim to have: the published challenge resources and guides rechecked; the accepted roster and creator's time zone verified; the asset-reuse question answered or explicitly unresolved; a source/rights manifest; an agreed minimum quantitative subset; and the scientific interpretation checked by an independent person if one is available. If no scientific reviewer is available, retain the assistant-checked label and do not claim external validation. If eligibility is unresolved, do not describe the proposed path as assuredly eligible.

No new generic literature sweep is necessary to choose the product. The missing evidence that could change the decision is now specific: organizer interpretation of the preparation, a real user's task, and an independent reading of the source relationships. Rivera 2026 full text is valuable for a later scientific expansion, but it is not a dependency for demonstrating the qualified calculations already checked.

### Event schedule — Pakistan Standard Time, conditional on the authorized path

| Time | Work and productive hours | Acceptance gate / fallback |
|---|---|---|
| **Sat Nov 14, 09:00–12:00** | Freeze permitted inputs; create minimal schema and reviewed quantitative subset; establish all eight profile records. **3 h** | Sources, rights and scope explicit; one calculation runs. If re-derivation takes longer, reduce numerical coverage and change claims to that subset. Do not quietly import disallowed files. |
| **Sat 12:00–15:00** | Ranking, typed question model and deterministic selection/recalculation. **3 h** | Same query yields same records/results; positive arithmetic and changed-scope cases work. If complexity grows, retain explicit rules and remove optional scoring. |
| **Sat 16:00–20:00** | Connected views, source/history inspection, plots where useful. **4 h** | End-to-end question→investigation→evidence→result path. No new framework or database after this gate. |
| **Sat 20:00–22:00** | Integrate bounded AI path and dossier export. **2 h** | At least one genuinely new question works through the model; export matches the screen. If AI fails, keep deterministic behavior while repairing the model path before claiming a complete SI-powered entry. |
| **Sun Nov 15, 09:00–12:00** | Cross-domain questions, source review, meaningful software checks and any available external pilot. **3 h** | Detection and suppression return useful grounded results; no critical numerical or scope errors. Failed pilot means report failure, not change the success rule. |
| **Sun 13:00–16:00** | Fix critical failures, freeze claims/data, record demonstration in the allowed format. **3 h** | Everything shown is implemented; record missing review and test limits. Cut stretch work. |
| **Sun 17:00–20:00** | Complete submission fields, citations, licenses, SI disclosure, public-link checks and accessible fallback artifact. **3 h** | Saved submission is complete; no author-only links or secrets. |
| **Sun 20:00–21:00** | Final clean-session check and submission confirmation. **1 h** | Finish by **21:00 PKT**, leaving **2h59** before the planned 23:59 deadline. Verify the actual platform deadline. |

This totals **22 productive hours**. It is a budget, not a delivery promise. The critical dependencies are permitted inputs, a small correct analysis core, a working AI path, hosting and the submission platform. Each needs an early check; a fallback does not erase a missing mandatory capability.

### Stop conditions

Stop adding features as soon as the complete workflow works. If the Saturday evening path is incomplete, drop extra visualizations and extra numeric families. If a source cannot be reviewed, downgrade its granularity or remove the dependent calculation. If the event's ruling disallows the planned use of preparation, follow the specified alternative only; do not infer an exemption. If external evidence shows no user benefit, present a transparent data/reconciliation prototype and make the post-event continuation conditional on a stronger task.

After the event, the next research increment is a grouped, matched-data evaluation on independently authored tasks and a second campaign. A predictive model is a separate project requiring suitable data and a scientifically defined endpoint. Keep scientific claims identical in the competition entry and any research release.

## 13. Claim ledger and audit trail

| Claim | Evidence class | Status / limit |
|---|---|---|
| The required product is an interactive SI-powered investigation dashboard that summarizes, ranks and interprets. | Current official source | Full challenge body retrieved through the public content API; source linked in section 3. |
| Emberfall is the submitting Universal team; one active builder, 2–3 members; user uses PKT. | Connected registration evidence plus user confirmation | Team identity established; actual roster and creator's zone still require the final record check. No personal mailbox data included here. |
| The PKT planning window is 38h59. | Official timing rule plus arithmetic and user time-zone assumption | November 14 09:00→November 15 23:59 PKT; conditional on creator using that zone. |
| Repository HEAD and transcribed row counts match the handoff. | Direct local inspection/computation | Verified this pass; not independent scientific validation. |
| P4 rate change is −5.6 µm/s, approximately −17.2%. | Recomputed descriptive result | Selected source cells visually checked; no causal flow effect. |
| First-logged selection changes the 1.27-cm initial-O2 table minimum from 17.6% to 19.3%. | Recomputed result using reviewed-but-qualified crosswalk | A population/selection result; no physical LOC or causal reburn effect. |
| P5/P9 share specimen 202m and matching reported gas boundary values. | Direct source check | Supports history relevance and possible atmospheric continuity; does not prove unchanged atmosphere. |
| Nine consecutive pairs have matching atmosphere entries. | Inherited assistant audit | Only the central P5/P9 gas example was directly rechecked on this pass. Not necessary to the headline. |
| B16/B19 are probably opposed despite appendix wording. | Inherited detailed multi-source audit, reviewed here | Balance of evidence, not author confirmation. Full raw experiment not inspected. |
| MicroFire and Fotia already overlap materially. | Current pinned code/data inspection | Static implementation evidence; no reproduced performance or exhaustive absence claim. |
| Certain new physics papers distinguish endpoints or challenge simple transfer. | Primary abstracts/selected full text, access marked in section 4 | No uninspected numerical results treated as validated data. |
| IGNIS will save researchers time while preserving quality. | Design hypothesis | Unmeasured; prospective margin and falsifiers specified. |
| Automatic linkage, novel algorithm, predictive SOTA or flight readiness exists. | Unsupported | No such claim is made. |
| Preparation reuse is permitted. | Unknown | Needs asset-specific organizer ruling; general research permission is narrower. |
| The final current rubric/video requirements are known. | Unknown as of this report | Guides scheduled for November 13; historical lenses are provisional. |
| Awards imply a feature caused success or reveal odds for IGNIS. | Unsupported inference | Explicitly rejected. |

The key local source fingerprints rechecked on this pass are:

| File | SHA-256 |
|---|---|
| Link supplement, 41598_2017_18398_MOESM1_ESM.pdf | e17c9511c4b4b253cd0795b3984ffb9347ad5db6354c4ce792adcaf805f21b23 |
| NASA TM-20210011385.pdf | 5ffa911fd9b6356f204646003fb9342e341810dcdfdf5cb15756e7f01ec5f770 |

Official page bodies, competitor snapshots, API failure records and retrieval/hash manifests are retained locally in `_raw/astra_2026-11-07/` (gitignored). The report's public links identify the sources; those local captures make the access/version claims inspectable. PSI app shells and access failures were recorded as session limitations. Third-party PSI copies were not silently promoted to primary records. No competitor code was executed, no new app was built, no source transcriptions were altered, and no organizer or researcher was contacted.

## 14. Direct answers

**What exactly should we build?**  
A small SI-powered fire-safety research dashboard with eight investigation profiles and one deep quantitative family. Its central operation reconstructs a comparison from source records, lets the researcher revise scope or qualified interpretations, and exports a consistent evidence package.

**What useful result will it deliver beyond a polished evidence catalogue?**  
An executable, revisable analysis: which observations were used, what was calculated, why a result changed, and how another researcher can reproduce it. The PMMA example produces useful observations and descriptive contrasts while exposing the exact role of specimen history.

**Why might a NASA researcher use it?**  
To reduce the effort of assembling and reviewing cross-source evidence for a literature comparison, experimental plan or model-validation dataset. That workload exists, but demand for this implementation is still a hypothesis; the first researcher interaction must test it.

**What is demonstrably different, and what is still only a hypothesis?**  
The repository contains a specific journal-to-burn/specimen reconstruction and checked calculations. The inspected alternatives have strong overlapping cataloguing, provenance, comparison and ranking functions. An integrated revision/export workflow is the selected proposed distinction; its usability, generality, uniqueness and superiority are not demonstrated yet.

**Can a narrowly scoped SOTA claim realistically be earned, and what experiment decides it?**  
Not predictive SOTA from these data during this event. A later evidence-processing/workflow claim is plausible if independent tasks across campaigns show a meaningful advantage over the same-data spreadsheet, expert rules and strong structured retrieval. The deciding experiment is the matched-data, grouped, prespecified time-and-quality evaluation in section 8. A tied strong baseline defeats superiority language.

**What would make us lose despite building it well?**  
Insufficient user consequence or differentiation, thin evidence beyond one case, poor challenge breadth, a stronger competing entry, or eligibility/submission failure. We do not know the judges' future scores or the causes of the earlier IEEE outcome.

**What must we complete before coding, during the event, and afterward?**  
Before coding: resolve the preparation-use path, verify the roster/time basis and current guides, freeze a reviewable evidence subset, and obtain external source/task feedback if available. During the permitted event: complete the full question→ranked evidence→calculation→source→export workflow, prove the AI path and cross-domain navigation, test it and submit with disclosures. Afterward: independent review, a second campaign and the matched-data study before stronger research claims.

**What single next action provides the most valuable new evidence?**  
Arrange **one 45-minute session with an independent combustion researcher who brings a real comparison task**, using the two original PDFs and current tables. First elicit their task and existing workflow, then ask them to inspect the key identity/history relationships and produce the evidence selection they would actually use. Record whether the reconstruction changes that selection and what review work remains. This tests scientific interpretation and demand together; it is not a sealed validation study or an app usability result. If the case is irrelevant to their decision, narrow or replace it before adding software. The asset-reuse ruling remains a separate critical eligibility dependency. No invitation has been sent.


