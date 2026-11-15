# IGNIS competition and research-use strategy

Current working cutoff: **15 November 2026, 23:00 PKT**, as directed by the owner. Build .13 integrates the teammate dashboard/landing with the technical research workflows. Prior UI-freeze and account assumptions are [historical](history/WIN_PLAN_before_gateway_and_association_2026-11-15.md). The [current 21-project comparison](RESEARCH_WORKBENCH_AND_COMPETITOR_REVIEW_2026-11-15.md) states review depth and real gaps; overall superiority and likelihood of winning are not established.

## A demonstrable technical contribution

The strongest immediate demonstration connects a research question to a consequential, reproducible analysis. The new SAME-R association tool finds that pooled scatter/ionization rank co-variation differs by material, exposes every original cell, recomputes the result after deleting each recorded sample label, and exports both data and executable code. Inspect raw ranges and instrument status before interpreting rank coefficients: this is a descriptive association, not a calibrated sensor-response model or a new physical law. [Method and actual results](DETECTOR_ASSOCIATION_METHOD_2026-11-15.md).

Combine it with the existing exact cutoff-range and missingness analysis, published-model claim checks, source-bound nominal-design identifiability, endpoint protocols and local tracked-coordinate calculation. BYOD adds declared clocks/operators/units, local raw-row inspection, channel differences and replay. This is a concrete research workflow; provenance by itself is shared with strong competitors.

## Do we need statistical or machine-learning models?

We need quantitative analyses that answer a specified question. Statistical association, stratification and influence analysis now provide an immediately executable example. Adding trained models becomes worthwhile when the target, measurement operator, dependencies and evaluation data are defined.

| Candidate | Useful question | Current decision |
| --- | --- | --- |
| Rank association with material/flight strata and recorded-label deletion | Does a pooled channel relationship describe each material, and does one recorded sample drive it? | Implemented; finite descriptive result, no inferential uncertainty or independent-trial assumption. |
| Regularized multinomial FLEX baseline | Can pre-test fields predict the recorded protocol termination category better than a training-only class-frequency baseline on held-out groups? | Next predictive study after endpoint/feature/ancestry adjudication. Local audit has 274 rows, 262 complete initial-diameter records. Do not relabel completion/disruption as safety or extinction time. |
| Hierarchical or mixed-effects response model | How much variation belongs to material, specimen, apparatus or campaign? | Potentially useful after credible grouping/calibration data exist. Two flight labels and repeated rows do not establish a well-estimated random-effects population. |
| Measured-versus-model residual analysis | Where does a published calculation disagree with synchronized observations? | Acquire aligned measured/model series and separate initialization/calibration from evaluation. Current Saffire integral summaries cannot supply a residual trajectory. |
| Calibrated optical extraction | Can a researcher obtain flame-front coordinates, time and uncertainty from images reproducibly? | A significant next capability gap, aligned with NASA's documented RTDFS analysis workflow. Start with manual reference annotations and a classical baseline before deep segmentation. |
| Deep learning / quantum methods | Is there a task and benchmark where their extra complexity earns useful performance? | No current evidence that they are needed for this corpus or deadline. |

Any predictive comparison needs a frozen task, training-only preprocessing, a simple baseline, group-aware splits matching intended transfer, calibration/error analysis and an external or prospective check before a transfer claim. Randomly splitting correlated rows and showing high accuracy would not answer that research question. [Existing data/model decision](lab/13_ml_decision_2026-11-15.md), [grouped evaluation documentation](https://scikit-learn.org/stable/modules/cross_validation.html), [NASA model-use standard](https://standards.nasa.gov/standard/NASA/NASA-STD-7009).

## Highest remaining priorities

1. Rehearse the completed statistical/physical-contract workflow with source-cell inspection and exact replay; distinguish assistant-observed patterns from independently established discoveries.
2. Repair and evaluate the SI interpretation contract under a separately recorded protocol. The live Groq attempt did not earn acceptance. Keep structured mode working and do not change frozen answer keys to manufacture a pass.
3. Obtain calibrated image/time-series records with run/specimen ancestry and an expert-adjudicated target. Add optical extraction or a small predictive baseline where those records support it.
4. Have a researcher reproduce a real task, then compare consequential errors and time against an equally informed spreadsheet/tool baseline. This is the missing evidence for researcher benefit and adoption readiness.
5. Complete the owner's release/submission decisions using the concrete reviewed build. Source sharing is authorized; deployment, competition submission and outreach remain separate.

Best Use of Science and Best Use of Data remain the closest strategy fit; Best Use of Technology requires a convincing integrated demonstration. These are strategy choices, not award predictions. NASA adoption requires demonstrated utility, scientific review and appropriate engineering assurance; none is implied by having a model or a NASA data source.
