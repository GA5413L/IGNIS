# Judge walkthrough and seven-slide storyboard

Prepared 15 November 2026 PKT. **IGNIS is the working product label; Emberfall is the registered team name.** Replace the working label only after the team selects its final name. Insert the actual registered members' names; AI agents are tools, not team members.

This is a local rehearsal and slide-content package. The three-minute script is for an invited live walkthrough or internal rehearsal, **not the required submission video**. The saved official guide permits a deck of at most seven slides, including title/intro, **or a video of at most 30 seconds**. The storyboard below has exactly seven slides. [Submission guide, PDF pp. 6, 10–11](../../DOCS/NASA%20Space%20Apps%20Challenge.pdf)

The atlas and condition JSON generation has passed its reproducibility check; the detector data has passed its source recount. The new interface is being integrated by the lead builder. **This document does not claim that the new UI, browser journey or public deployment has been tested.** Screen actions below are the rehearsal targets. If a view is unfinished, show the corresponding labeled data artifact and say so; do not substitute a mockup while calling it a working screen.

## Current research-patch demonstration

Build `web-2026-11-15.3` adds the paired cohort audit, exact selection handoff and notebook recheck. The refreshed seven-slide `briefing.html`/PDF is the current presentation artifact. The earlier script/storyboard below remains a source of optional examples; it predates these additions and its slide numbering is not the current deck numbering.

| Time | Current action | Evidence to explain |
|---|---|---|
| 0:00–0:25 | State the problem; briefly show the atlas and a source link. | Researchers need the experiment configuration and measurement meaning, not only a retrieved sentence. Counts are artifact inventories, not independent burns. |
| 0:25–0:55 | Conditions → two-axis tradeoff → prepare prevention brief. | Separate oxygen and pressure gaps within a material/sides cohort; the exact selection now travels with the request. No fire prediction follows from proximity. |
| 0:55–1:40 | Smoke lab → Paired cohort audit; retain default AW/AV cutoffs; toggle literal recorded-n fan filter. | Pooled +70/133 versus flight 1 −6/25 and flight 2 +76/108. The status filter removes 109 unrecorded flight 2 rows and retains −6/25. This is selection/measurement context, not detector quality or alarm failures. |
| 1:40–2:20 | Attach paired audit, confirm, inspect selected source analysis; export. | Joint/marginal denominators, original cells, missingness and exclusion reasons remain available. The attached descriptive result does not validate a physical model. |
| 2:20–2:45 | Research notebook → save/download → import/recheck → review source/method/result fingerprints. | Recompute from current local sources; do not trust imported conclusions. Keep separate assessment JSON for original row/result bytes. A checksum is not a signature. |
| 2:45–3:00 | Data & methods; name the next validation step. | Source-role and ML readiness decisions; independent human review and a fair researcher-task comparison remain needed. No NASA adoption or measured competitive superiority is claimed. |

If time permits, retain the W1→W3 model-claim change as a second research example. The three-minute walkthrough is rehearsal material; the submission video option remains at most 30 seconds, or use the seven-slide option. Live AI remains unavailable, and publication is still held.

## Earlier three-minute script (before the research patch)

Approximately 350 spoken words, leaving time for the indicated actions. Keep a local copy of the sources and exported data open; no login, inference request or public deployment is needed for rehearsal.

| Time | Show or do | Spoken text |
| --- | --- | --- |
| **0:00–0:20** | Title and one question: “What does this NASA result support for my question?” | “NASA has decades of combustion research. A researcher still has to work out which experiment fits a question, what the measurement means, and what a model comparison actually proves. IGNIS is our local evidence workbench for making that reasoning inspectable.” |
| **0:20–0:45** | Atlas: open PSI-101, then its table/workbook inventory. Keep source link and evidence-role label visible. | “We curated 24 NASA PSI profiles, 22 experimental-table files and an analyzed SAME workbook. Profiles are labeled as catalog metadata. A table's record count is not a burn count. The researcher can move from an investigation's purpose to the actual acquired artifact and its provenance.” |
| **0:45–1:10** | Condition view: PMMA, two burning sides. Select `SAFFIRE-VI-3`; open source locator and flow conflict. | “Here is a specific solid-fire case: two-sided PMMA, 30 percent oxygen and 54.4 kilopascals, from the 2026 Saffire table. The earlier publication differs. We retain the version and the opposed-versus-concurrent flow conflict. Pressure and oxygen gaps describe nearby conditions; they do not certify lunar transfer or safety.” |
| **1:10–1:40** | Detector view: all flights; Kapton; ISS scatter; analyst cutoff 2 V; exclude DBP. Show AW50 missing. Then select Teflon. | “The detector workspace starts with 134 spacecraft-material records and keeps 20 DBP reference records separate. For Kapton, 20 of 35 finite scatter readings fall below an analyst-selected two-volt cutoff; one reading is missing. Teflon gives 18 of 23. Those are channel-value counts, not missed alarms. The source cell and denominator stay attached.” |
| **1:40–2:20** | Model examples: W1; inspect evidence; change to W3 as a revision; show “What changed.” | “Now ask what can test a published Saffire model's later remote carbon-dioxide response. IGNIS specifies a conditional comparison and the missing synchronized data. Change only the question: did that transport model independently predict chemical heat release? The model stays the same; the requested claim becomes unsupported. We preserve the useful earlier result and explain the change.” |
| **2:20–2:40** | W2, source-total normalization. Show 29.9 g, 54.4 g and reported factor 1.82. | “A second example keeps the useful arithmetic. A source total normalized to a measured target cannot independently validate that same total. Later spatial or transient response may still be worth comparing under explicit conditions. We provide that next step rather than stopping at a warning.” |
| **2:40–3:00** | Assessment export/revision artifact and source references. End on the contribution sentence. | “The researcher can carry the question, sources, assumptions and changed conclusion into a reviewable export. Our contribution is this connected workflow. Source reproduction is checked; predictive superiority, independent scientific review and real-world adoption remain untested. AI assisted the research and implementation; the current runtime remains deterministic.” |

If a live interpretation configuration is later accepted, update the final runtime sentence to describe only the accepted, actually demonstrated behavior. Do not infer acceptance from an API adapter or a successful credential probe.

## Rehearsal cues and expected content

These are content anchors, not a declaration that the new screen interactions passed.

| Stop | Exact selection or existing example | Expected evidence |
| --- | --- | --- |
| Atlas | `PSI-101` | Record version 4; analyzed workbook file version 1; source DOI; acquired CSV and workbook distinguished. PSI-10's license remains unknown when inspected. |
| Conditions | Cohort `PMMA-2`; case `SAFFIRE-VI-3` | Original strings `544` mbar and `0.30` oxygen mole fraction; 54.4 kPa and 30 mole%; PDF p. 6; flow conflict visible. Do not substitute the 2024 54.6 kPa / 30.3 mol% values. |
| Detector | All flights; Kapton; `issScatterV`; cutoff `2`; reference excluded | 36 selected records, 35 finite, one missing; 20 below cutoff. Missing cell AW50 remains missing. Teflon: 23 finite, 18 below. |
| W1 | **Saffire VI model: what tests its later CO₂ response?** → confirm/assess | Main route `conditional_model_candidate`; outcome `specified_conditional_comparison` under amendment A-001. Initial alignment is conditioning, not independent initial predictive accuracy. Missing series prevent a numerical score. |
| W3 | **Saffire VI model: does it predict chemical heat release?** → reassess as a revision | Same model `PM-SVI25`, changed requested quantity/claim. Unsupported for independent burning prediction; earlier remote-response comparison preserved. |
| W2 | **Saffire V model: was the CO₂ total independently predicted?** | Descriptive scale check; independent source-total interpretation incompatible; a conditional spatial/transient comparison remains possible. |
| Export | Existing assessment Markdown and JSON exports | Same assessment content and provenance; revision explains changed premises. Confirm actual downloads during final browser verification. |

An optional illustrative atmosphere target is **30 mole% O₂ / 55 kPa**, explicitly labeled “user-entered example,” not a NASA-prescribed habitat condition. For VI-3 the coordinate differences are 0 percentage points and −0.6 kPa. Only compare cases within the selected material/sides cohort. A nearby point does not establish matching flow, gravity, thermal history or measurement conditions.

## Seven-slide text and storyboard

Use original layout and original plots/tables built from the curated values. Do not paste publisher figures or NASA branding into the deck. Capture the actual interface only after the relevant view works; until then, label the visual “curated data artifact” or “workflow storyboard.” Put citations in a readable footer, not an eighth references slide.

### Slide 1 — What does this NASA result support?

**On-slide text**

> **IGNIS — working title**  
> NASA fire evidence, from source to reviewable comparison  
> Team **Emberfall** · [verified registered member names]  
> Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data

**Visual:** one actual workspace screenshot, or a clearly labeled original workflow sketch: question → source → comparison → revision. Do not add a separate title or introduction slide.

**Say:** “We help a researcher understand what evidence supports a question and what further work a stronger claim needs.”

### Slide 2 — The researcher's problem

**On-slide text**

> Same material ≠ same experiment.  
> Similar atmosphere ≠ physical equivalence.  
> A detector voltage ≠ an alarm decision.  
> A supplied model input ≠ an independent prediction.

**Visual:** four short, labeled pairs: material/configuration; oxygen/pressure/flow; channel/criterion; supplied input/test target. These are concepts, not a quantitative risk model.

**Say:** “The hard part is connecting evidence to the intended claim without losing the experimental context.”

**Footer:** [Official challenge](https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/).

### Slide 3 — NASA data is the working material

**On-slide text**

> **24** PSI investigation profiles · **22** acquired CSV tables  
> **7** versioned Saffire condition cases  
> **134** spacecraft-material detector records · **20** separate DBP reference records  
> Prevention · Detection · Suppression

**Visual:** atlas inventory with a source detail expanded. Explain the different evidence depths with labels: metadata, acquired table, curated cells, model-comparison contract.

**Say:** “Breadth helps discovery; the curated examples support deeper questions. These counts describe records and artifacts, not independent experiments.”

**Footer:** [PSI-101](https://psi.nasa.gov/physci/repo/data/investigations/PSI-101), [Saffire 2026](https://ntrs.nasa.gov/citations/20260001992); full accession/source inventory accompanies the project.

### Slide 4 — A real condition, with its limits intact

**On-slide text**

> **Saffire VI-3: two-sided PMMA**  
> 30 mole% O₂ · 54.4 kPa · microgravity  
> 2026 Table 1, PDF p. 6  
> Flow direction conflicts across publications.  
> Compare atmosphere gaps within a material/sides cohort.

**Visual:** the two PMMA-2 cases on an oxygen/pressure plane with separate axis values; selected case, source version and conflict note visible. No safe/unsafe color scale and no “closest NASA burn to the Moon” label.

**Say:** “The source version matters. We show the actual tuple and the uncertainty in comparability, not a habitat safety verdict.”

**Footer:** [ICES-2026-577, Table 1](https://ntrs.nasa.gov/citations/20260001992); flow-context comparison: [ICES-2024-365, Table 1](https://ntrs.nasa.gov/citations/20240002981).

### Slide 5 — Keep the detector denominator

**On-slide text**

> Analyst-selected ISS scatter cutoff: **2 V**  
> Kapton: **20 / 35 finite readings below** · 1 missing  
> Teflon: **18 / 23 finite readings below**  
> These are channel readings, not demonstrated alarm misses.

**Visual:** two count bars with explicit numerators/denominators and a separate missing-value badge; source cell AW50 shown. No confidence intervals or failure-probability labels.

**Say:** “A useful descriptive result survives. The leap from voltage to an alarm outcome needs detector calibration and the actual alarm rule.”

**Footer:** [PSI-101, DOI 10.60555/2np7-jv14](https://doi.org/10.60555/2np7-jv14), `Material Sort`, columns A/C/AW; raw cell lineage retained.

### Slide 6 — Change the question; preserve the reasoning

**On-slide text**

> **W1:** Later remote CO₂ response → conditional comparison specified  
> **W3:** Independent chemical heat release → unsupported for this transport model  
> **W2:** Normalized source total → useful arithmetic, not independent validation  
> Export the source, assumptions and revision together.

**Visual:** actual W1→W3 revision view and a small W2 calculation card. The model identity remains fixed across the revision. Do not draw a new simulated flame or invented predicted curve.

**Say:** “The workbench keeps the useful comparison while identifying exactly why a stronger claim does not follow.”

**Footer:** [Saffire VI model, ICES-2025-156](https://ntrs.nasa.gov/citations/20250002675); [Saffire V model, ICES-2024-310](https://ntrs.nasa.gov/citations/20240008602); A-001 governs W1.

### Slide 7 — What is demonstrated, and what comes next

**On-slide text**

> **Checked:** source hashes, reproducible curation, exact record counts  
> **Contribution:** source → measurement meaning → comparison → revision → export  
> **Next evidence:** final interface checks; researcher tasks against an equally informed spreadsheet  
> AI-assisted research and code. No NASA endorsement or predictive-validation claim.

**Visual:** three small evidence labels: atlas curator PASS; detector curator PASS; new UI/release checks PENDING at this handoff. Replace that last status only with actual subsequent results, including date and scope.

**Say:** “Other projects already provide strong search, ranking and citations. Our focus is a complete, reviewable comparison workflow. Its user advantage still needs measurement.”

**Footer:** local provenance documents and AI disclosure in the submission package. Add the final public artifact link only after publication and signed-out access verification.

## Short answers for judge follow-up

**What is the improvement over other dashboards?** “A focused connection between source cells, measurement meaning, conditional model reuse and revisions. MARGIN already handles condition relevance; HALO already analyzes detector channels; PYRION already separates interpretation from deterministic decisions. We do not claim those pieces are unique or that we outperformed their running systems. Our testable contribution is whether this complete workflow yields more correct, useful and reviewable answers than an equally informed spreadsheet.” [Bounded public-source comparison](COMPETITIVE_UPDATE_2026-11-15.md)

**Is it a fire simulator or safety certification tool?** “No. It organizes published evidence and specifies what a comparison can support. We did not run a new physical simulation or validate a habitat design.”

**Where is the SI?** “AI assistants helped research, audit sources, curate data, refine the design, write code and prepare the presentation. The current runtime has no accepted live interpretation configuration; its scientific assessments are deterministic. We disclose both the assistance and that limitation.”

**What can a researcher reuse now?** “The source-linked atlas, original condition strings and conversions, detector records with cell-level provenance, and explicit comparison requirements. Run the two curator `--check` commands in the [submission package](SUBMISSION_PACKAGE_2026-11-15.md) to reproduce the local data checks.”

**What would make the next result credible?** “A source-identical spreadsheet baseline, independent task authors/reviewers, recorded errors and task time, and the missing synchronized model/measurement series for any quantitative model comparison. None of those future results is claimed here.”
