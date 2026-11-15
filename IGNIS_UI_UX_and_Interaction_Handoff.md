# IGNIS: UI/UX and interaction handoff

**8 November 2026 PKT · Emberfall · one active builder · written specification only**

**Promise:** “IGNIS helps researchers choose the right NASA fire experiments to test their models—and understand what the comparisons can actually establish.”

The [scientific handoff](IGNIS_Contract_Closure_and_Build_Handoff.md) governs quantities, history, outcomes and permissions. This companion specifies their interaction and presentation. **AC04 is repaired**, with its old wording preserved in a dated note there: documented target-fitting contradicts untouched timing; documented post-response selection contradicts prespecification. Missing transformation details/rules remain unresolved for the affected specification; supported conditional comparisons survive.

No application, prototype, rendering, user study or accessibility conformance is established. **Every application/UI acceptance test is NOT RUN.** Scientific examples below inherit the named source checks from 7 November; today’s work checks their use in the design, not new physical results.

## 1. One workspace, two views

Choose **Explore / Analysis** as the two top-level views of one session. Analysis has **Result / Changes / Export** tabs. A claim’s **Evidence** inspector opens on demand. A compact **History** disclosure lists session assessments; it is not another project-management page. Switching views preserves the question draft, selected investigation and active assessment. No account or separate judge mode.

The primary researcher follows **question → review interpretation → relevant investigations → comparison plan → evidence → revision → export**. The secondary explorer can browse without choosing a model. A short promise, an actionable question and a real example establish the job on first visit; there is no marketing splash screen.

| Place | Content and next action |
|---|---|
| Explore | Question field, three optional entry points (Prevention / Detection / Suppression), “Browse investigations,” and question examples. An example fills a draft, never a precomputed conclusion. “Review interpretation” makes the one AI call. |
| Review interpretation | Original text and editable task, published/proposed model, target quantity and event side by side or stacked. Resolve only routing-critical ambiguity now. Confirm to create the request and derive its result. |
| Relevant investigations | Ordered rows with a sourced objective/finding, quantities, fuel/configuration/known conditions, rank reason, coverage depth, important unknowns and source-access label. “Open result” reveals an existing assessed candidate; changing the analytical event/target requires reconfirmation. |
| Analysis: Result | Useful comparison first, supplied information second, supported/unsupported claims and execution needs adjacent. Evidence and equations are one action away. |
| Analysis: Changes / Export | Changed question/premises and affected claims; then a preview and download from the same assessment. Evidence remains reachable here. |

Browsing the whole catalogue is a list, not a relevance ranking. Selecting a purpose/filter prepares navigation scope; **“Apply scope”** confirms that navigation request. A natural-language navigation question uses interpretation and confirmation, with no required model. Labels say “Relevant to this question”; ties remain ties. A stable display order within a tie must not imply a scientific distinction. Readiness filtering is explicit; it does not turn relevance into hazard, confidence or model quality.

| Profile | Maximum initial display depth from current records |
|---|---|
| BASS-II | Reviewed rod observations and qualified source summary; no rebuilt rod-analysis interface |
| Saffire V | Source summary plus T2 normalization/conditional-comparison specification |
| Saffire VI | Principal T1/T4 response plan; PMMA event 6 and SIBAL event 5 through the same components |
| SAME | Source summary about aerosol measurements and detector relevance; no acquired raw particle-series claim |
| SAME-R | Summary at the reviewed metadata depth; show that access level, and do not inherit SAME’s data availability |
| FLEX | Sourced extinction/cool-flame navigation; no cabin suppression-dose calculation |

Use the six profiles only where reviewed assertions support their displayed content. At the source freeze, a row missing a sourced finding must say **“Finding not yet reviewed”** and remain a catalogue entry outside evidence-backed ranking. Do not fill a symmetric card grid with invented findings. The six-profile count is a scope choice. “No matching record in this reviewed catalogue” does not imply that research is absent elsewhere.

## 2. Text wireframes and reading order

These are **low-fidelity written specifications**, not screenshots or executable UI. Bracketed controls denote proposed actions. `{…}` denotes an identity assigned by the later application, not an existing run or assertion ID. Copy is proposed interface wording, not a source quotation.

### Question and confirmation

~~~text
IGNIS · Emberfall                    Explore | Analysis       [History]
Choose a NASA fire experiment and understand what it can test.

What do you want to compare?
[ Can the published Saffire VI transport model test the later
  remote CO2 response from the two-sided PMMA burn?             ]
[Review interpretation]     [Browse investigations]
Explore by purpose: [Prevention] [Detection] [Suppression]
Try a question: [PMMA cabin response] [Smoke measurement] [Extinction]

REVIEW YOUR QUESTION                     Interpretation: AI-proposed
Original question: <the user's complete text, still visible>
Task          [Plan a model comparison v]
Model         [Published VI transport model v] [What does it predict?]
Target        [Later remote CO2 response v]
Event         [VI event 6 · two-sided PMMA v]
Known gap: exact baseline samples and synchronized series unavailable.
[More scope details: sensors / window / units]

Confirmation means this represents your question; source review is separate.
[Confirm question and assess]       [Edit original question]
~~~

Choose a published model representation from the reviewed catalogue, or explicitly choose **“Specify a proposed model.”** Never silently reinterpret the published model as the user’s new model. Proposed-model fields ask what is predicted and supplied; unknown parameters and absent outputs remain visible. For navigation, remove the model requirement rather than invent a default. Advanced scope fields expose known values and “Unknown—not supplied,” not mandatory guessed numbers.

### Main result, before opening evidence

~~~text
IGNIS                                  Explore | Analysis     [History]
Question: later remote CO2 response    [Change question]
Published VI transport model · event 6 · two-sided PMMA
Assessment {ID/version} · current      [Result] [Changes] [Export]

COMPARE LATER REMOTE CO2 RESPONSE
Conditional on measured fire inputs, inherited calibration and initial alignment.
Conditional comparison                 [Why this comparison?]

Given to the model     Measured source histories; initialization; cargo parameter
Can establish         A specified test of matched later response changes
Cannot establish      Independent success from the aligned initial agreement

Claims
Later response        Conditional comparison            [Evidence]
Initial agreement     Cannot support this claim*         [Evidence]
Numerical score       Requirement unresolved             [Needed assets]
*The claim is independent prediction of the aligned initial value.

Execution: comparison specified; numerical evaluation not run.
Needed: synchronized source/target series, baseline samples, common window.
Review: assistant-checked; no independent review recorded.
[Review scope] [Preview export]
Below: source/measurement-role table; [Comparison formula and domain]
~~~

W1 is useful without a plot. Keep the initial-alignment qualification and missing-series notice beside the result; they are not tooltips. The role table names supplied inputs, fitted/transferred parameters and requested responses separately. An unfamiliar viewer can read the useful output, inspect its reason, change the question and take away the same plan.

### Evidence inspector

~~~text
Result stays visible when space permits | EVIDENCE · Initial agreement [Close]
                                       | Requested claim: independent initial prediction
                                       | Outcome: Cannot support this claim
                                       |
                                       | SOURCE-REPORTED · S-VI, PDF p. 7
                                       | Curves were adjusted after simulation to match
                                       | initial experimental CO2 values. [Open source]
                                       |
                                       | OUR INTERPRETATION · assistant-checked
                                       | Initial agreement is imposed by alignment.
                                       | Later response comparison remains useful.
                                       |
                                       | DERIVATION · T1 · [Expand formula/domain]
                                       | r_aligned = r_change; r(t0) = 0
                                       | No synchronized numerical score computed.
                                       |
                                       | Definition: remote CO2; location/basis/clock details
                                       | Use: initialization + post-simulation alignment
                                       | Gaps: exact samples; complete historical use
                                       | [Suggest correction] [Record versions]
~~~

Show assertion text, source title/URI, PDF page or section, relevant operator and use, uncertainty/conflicts, review scope and version. Exact assertion IDs are assigned during curation; show `{assertion ID/version}` in implementation notes until then. W1 claim aliases already exist in the scientific handoff, but are not real solver-run IDs.

Use external source links with explicit locators as the minimum; opening a link must not discard the workspace. PDF `#page=` is only a convenience when supported; retain the written locator. No fake highlight, embedded viewer or copied figure is required. An optional relationship strip says **“Documented information use—schematic”**; every edge resolves to an assertion and has an equivalent readable list. It is neither a causal graph nor a flow-magnitude diagram.

### Revision and export

~~~text
Analysis · Changes           {previous assessment} -> {current assessment}
Change: research question    Same published model and information-use history

Before: later remote CO2 response
After:  chemical heat release predicted by the same transport model

Changed   Requested burning-prediction claim -> Cannot support this claim
Retained  Later-response comparison -> supported as a conditional alternative
Unchanged Measured source inputs; inherited calibration; initial alignment
Reason    This published model supplies fire outputs rather than predicting burning.
          S-VI p. 4 [Evidence]
[Use the response-comparison alternative] [Specify a proposed burning model]
[View previous assessment] [Preview current export]

Analysis · Export            Assessment {current ID/version} · current
Question | model/run status | claims and conditions | sources | readiness | changes
Preview: same complete plan, including qualifications and unresolved assets
[Download Markdown] [Download JSON]
Session history is temporary. Download snapshots before closing this session.
~~~

The two alternative actions create a draft to confirm; neither executes a model. Changes are a compact table, stacked on mobile, not two complete dashboards. Exports include source/assertion/template versions and a self-contained relevant evidence snapshot. No export is built by scraping visible page text. Hidden/collapsed details remain in the artifact. No Saffire observation CSV is offered without actual applicable observations; HTML and optional NIST CSV are later additions, not minimum controls.

## 3. One visual direction

Propose **restrained scientific instrumentation**: navy chrome, light reading surfaces, dark text and one ember primary action. This is a design choice, not an established user preference. Use one light-content theme, system fonts and familiar components; no new logo, decorative KPIs, background painting, gradient hero or graph wall. IGNIS is the product and Emberfall the team; no implied NASA endorsement.

| Token | Recommendation |
|---|---|
| Background / surface / chrome | `#F3F5F7` / `#FFFFFF` / `#142235`; chrome text `#F8FAFC` |
| Main / secondary text | `#192733` / `#46576B`; secondary text still carries readable contrast |
| Primary action | Ember `#B74718` with white text; one dominant action for the current stage |
| Link / focus | `#005FCC`; underlined source links; 3 px focus outline with 3 px separation and contrasting inner edge on dark chrome |
| Type | System sans; body 16/24 px, section 20/28, result title 24/32, metadata/table 14/20 minimum; tabular numerals; units never dropped |
| Spacing / width | 4, 8, 12, 16, 24, 32 px scale; 24 px desktop / 16 px mobile gutters; content max 1200 px; prose around 65–75 characters |
| Tables / controls | Left-align labels, right-align numeric values; units in headers and accessible names; rows at least 44 px, growing for wrapping; main controls at least 44 px tall |
| Borders / shapes | Subtle section divider `#CBD5E1`; control boundary `#64748B`; modest 6 px radius; no reliance on shadows to identify controls |
| Status treatment | Text label plus distinct symbol, restrained tint; no safe/unsafe colour scale; separate outcome, review and execution labels |

| Short label (design copy) | Exact contract outcome, retained in details/exports | Suggested treatment |
|---|---|---|
| Conditional comparison | Specified conditional comparison | Document symbol; blue text `#1E4E79` on `#EAF2F8` |
| Descriptive check | Descriptive consistency check | Calculation symbol; slate `#334155` on `#F1F5F9` |
| Cannot support this claim | Incompatible with the requested claim | Cross symbol; burgundy `#8C2D3E` on `#FFF1F2`; name the affected claim |
| Requirement unresolved | Unresolved claim requirement | Question symbol; ochre `#724C00` on `#FFF8E1`; name the missing requirement |

Use **Source: reported by publication** separately from **Review: assistant-checked** or **Review: externally reviewed**, with actual reviewer/date/scope when present. Source reporting is not itself a review level. Execution says **not run here / reported by source / reproduced here** only when the underlying record supports it. A conditional comparison is not a green approval; an incompatible claim is not an invalid experiment.

At **1366×768**, use one result column; opening Evidence adds a roughly 400 px pane only while at least 600 px remains for the result. Below 1200 px, Evidence uses the full content area with **“Back to result”**, preserving the selected claim and scroll position. Below 760 px, stack question, context, result and actions; wrap tabs without abbreviating away meaning. Avoid persistent panels at zoom. Compact metadata may scroll below the result; essential conditions stay adjacent to it.

Future tests must cover visible labelled focus, logical keyboard order, focus restoration after closing Evidence, announced asynchronous status, reduced motion and usable zoom. Text contrast targets are at least 4.5:1 for ordinary text and 3:1 for large text. Reflow should support 320 CSS px without losing the task; sticky controls must not obscure focused content. These are targets, not achieved compliance. [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [focus visibility guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html).

## 4. Small component handoff

Field names below refer to section 6 of the scientific handoff, not a new schema. Draft text, loading, tab and focus state sit outside the immutable assessment. Estimates are **one-builder allocations**, including basic wiring; they are not measured delivery times. The 8.5 hours below are charged once within section 9, not added to its budget.

| Component | Purpose / assessment binding | Inputs, states and permitted actions | Priority / effort |
|---|---|---|---|
| C1 Workspace shell | Maintain task context; `identity`, `request`, presentation binding | View/tab selection, current/historical context, responsive layout, focus and typography; change presentation only | Minimum · UI 1 h |
| C2 Question and confirmation | Human-readable scope; draft → confirmed `request` | Text, allowlisted choices, ambiguities; edit draft, choose published/proposed model, confirm/reconfirm; source history read-only | Minimum · UI 0.75 h |
| C3 Result and readiness | Useful answer; `claims`, `derivations`, `readiness` | Current/qualified/incompatible/unresolved; inspect a claim or open an alternative draft; no component-level scientific calculation | Minimum · UI 0.75 h |
| C4 Evidence inspector | Explain outcome; evidence snapshot and template references | Source assertions/locators, reviewed use, conflicts, arithmetic; open source, expand domain, save a separate correction proposal | Minimum · UI 0.75 h |
| C5 Changes and history | Preserve revisions; parent identity and revision difference | Prior/current assessment selection; inspect affected/retained claims, return to active result; no overwrite/approve-history button | Minimum · UI 0.75 h |
| C6 Export preview | Portable same-assessment record | Current/historical/stale/failure; Markdown + JSON download, retry or readable-text fallback; version check before release | Minimum · UI 0.5 h |
| C7 Investigation list | Summary/ranking/navigation binding | Reviewed profile records + confirmed navigation scope; browse, apply filters, inspect tied ranks, open assessed candidate; no invented score | Minimum · navigation 2 h |
| C8 Interpretation adapter | One AI call before confirmation | Draft/call/catalog envelope; pending/invalid/outage/stale; propose fields only, retry or typed-form continuation | Minimum · AI 2 h |

Use the simplest familiar stack chosen at the authorized gate; no migration for appearance. Live inference needs a configured server-side endpoint or trusted managed service, with secrets held there, not in browser bundles, displayed forms or exports. This small inference boundary is part of C8; it does not justify accounts, a collaboration backend or an audit database. Source text is evidence, never executable instructions; no arbitrary private uploads or user code execution.

## 5. Controls, authority and version transitions

The only default AI sequence is **interpretation → confirmation → deterministic assessment → template rendering**. The optional second explanation call is excluded from minimum scope. A fresh question must actually use live interpretation before that feature is claimed as demonstrated.

| Control/action | Scientific contract and effect |
|---|---|
| Type / choose example / purpose shortcut | New draft revision. Example supplies text and supported context only. Does not display a prewritten verdict or silently replace an assessed question. |
| Review interpretation / Retry | C8 call tied to draft ID/revision, catalog snapshot and call ID; one active interpretation. App-held envelope, not model-echoed identity, decides whether a reply is current. |
| Edit interpreted fields / Confirm question and assess | Validate routing and record a new immutable confirmed request. Confirmation approves intended meaning, not source truth. Deterministic engine binds model/use/template versions. |
| Browse / Apply scope / Open result | Browse needs no model. Apply confirms a navigation request; opening an already assessed candidate changes presentation. Selecting a different analytical event creates a draft and needs confirmation. |
| Change question | Operation A: new request, same published model/history. Current result stays readable as the previous result while the draft is dirty. |
| Specify a proposed model | Operation B: explicit new proposed record with predicted/supplied quantities and missing requirements; no fictional run/output. Reused inputs/parameters remain declared. |
| Suggest correction / Save proposal | Operation C: separate proposed assertion with claim reference, suggested wording, source/locator and reason. Existing source records remain read-only. Missing support keeps the proposal incomplete; it does not change the assessment. |
| Review scope / Apply revised scope | Operation D: sensors, window, quantity, event, exclusions or normalization changes require confirmation and reassessment. Show unavailable definitions as gaps. |
| Sort / expand / switch tab / close inspector | Presentation only; no change in conditions, rule outcome or exported evidence. Column hiding is not needed in minimum; if later added, it has this same limited authority. |
| Use alternative comparison | Prefill a new request for review; do not silently claim that the user accepted a different scientific question. |
| View previous / Return to current | Open an immutable snapshot with explicit version/date and historical status; no reassessment or adoption of old premises by accident. |
| Preview / Download | Serialize the selected assessment and relevant evidence, checking active request and premise versions again before offering a current file. Historical export requires the explicit historical action. |

**Acceptance of a correction is outside ordinary user interaction.** Minimum UI saves a proposal in session history and can include it in a separately labelled proposal download; it has no “make verified” toggle. A reviewed catalogue revision arrives through the curator’s documented source-review/release process, recording actual reviewer, date, evidence and scope. An assistant check remains assistant-checked. No new admin-role system is needed for this event scope. AC16 can exercise receipt of such a revised record; this is distinct from approving it through a UI edit.

Relevant accepted premises invalidate the current assessment/export binding; show affected claims and require reassessment. An unrelated bibliographic change leaves scientific conclusions against their pinned premises unchanged. Question edits invalidate pending interpretation envelopes immediately. No cancellation race may attach an old reply to a new draft.

Keep immutable scientific payloads in session history; label current/historical status in the surrounding view and export context. Historical downloads include their original question, source versions and creation time plus **“Historical snapshot”**. Old downloaded files cannot be retrospectively updated. A refresh may clear the minimum in-memory session; say so beside export and do not promise cloud recovery or snapshot re-import.

Synthetic mutations and the staged earlier baseline interpretation in the scientific handoff remain **development/review fixtures**, outside ordinary results. If exercised, their header, diff and export all carry that label. They use the same rules; no judge-only mode is introduced. A real user-visible question revision W1 → W3 demonstrates changed intent without pretending NASA’s historical model changed.

## 6. States and recovery

All copy is proposed. Loading feedback reports real request state, never simulated “thinking” steps or invented percentages. Local catalogue coverage, source retrieval, scientific uncertainty and runtime failure are distinct.

| State | Visible copy | Controls / next transition | Information preserved |
|---|---|---|---|
| First visit / empty | “What do you want to compare?” | Type, choose an example, browse; interpretation requires nonempty text | Catalogue; no invented default model |
| Interpretation pending | “Interpreting your question…” | Edit or cancel; a completed current reply opens review | Original draft, selected context, previous assessment |
| Ambiguous routing | “Which quantity do you mean by ‘heat’?” | Choose chemical release or cabin sensible addition; confirm only after critical ambiguity is resolved | Original words and known fields; scientific unknowns stay unknown |
| Unsupported quantity | “No reviewed comparison rule for this quantity.” | Keep request text; choose a supported meaning or confirm a related navigation task | Requested meaning; no guessed conversion |
| Invented identifier / invalid reply | “The interpretation did not match the reviewed records.” | Review valid choices manually or retry; invalid draft cannot create an assessment | User text and last valid choices; no invented citation |
| Conditional plan, assets missing | “Comparison specified; numerical evaluation not run.” | Inspect conditions/assets; export the specification | Positive plan, exact missing series/operator/window requirements |
| Incompatible claim | “This model cannot support the requested burning-prediction claim.” | Inspect why; review the response alternative or specify a proposed model | Published history, useful alternative, prior assessment |
| Unknown historical use | “Use of this target in fitting is unresolved.” | Inspect review coverage or suggest evidence; retain separately supported descriptive/conditional claims | Unknown state; no independence inferred |
| No catalogue match | “No matching record in this reviewed catalogue.” | Broaden confirmed scope or browse all entries | Question and applied filters; no universal absence claim |
| Source retrieval failure | “Source could not be opened. View its recorded locator and any retained assertion.” | Retry/open external link; inspect cached reviewed assertion when present | Access status and assertion version; never claim a fresh source check |
| Conflicting source assertions | “Sources disagree on this definition.” | Show both locators and affected claims; suggest a reviewed correction | Both assertions; unaffected useful claims |
| Draft changed after confirmation | “Draft changes have not been assessed. Showing previous result.” | Review/confirm changes or discard draft and return to unchanged request | Previous assessment; current export blocked until reconciled |
| Out-of-order AI reply | “Earlier interpretation ignored because the question changed.” | Continue current draft; no forced focus jump | Current edits and pending current call; old reply cannot overwrite |
| Relevant premise changed | “Evidence changed; reassess before exporting a current result.” | Inspect diff, reassess; explicitly view/download history if needed | Old scientific payload and changed-premise references |
| API unavailable / no key | “AI interpretation is unavailable. You can continue with the form.” | Typed form and confirmation; retry only on request | Draft, deterministic utility and visible AI-unavailable status |
| Historical assessment | “Historical snapshot—not the current question/evidence.” | Return to current; Download historical Markdown/JSON | Original identities, conditions and versions; clear filename/context |
| Export failure | “Export was not completed. Your assessment is still available.” | Retry same version after currency check; show selectable Markdown if download/clipboard fails | Assessment and format selection; no false success notice |
| Session reload / history absent | “This session has no saved assessments.” | Start a question or inspect previously downloaded files outside the app | Only actually retained state; no fabricated restore |

Do not render a source failure notice if the browser provides no reliable result for opening an external link; label that link’s last recorded access status instead. If a relevant version changes during export generation, withhold the current download and offer reassessment. Copy/download fallback still includes all scientific qualifications.

## 7. Source-bound copy and honest displays

These examples are **design copy derived from reviewed contracts**, not new experimental statements. Source labels and claim aliases below are those of the scientific handoff; any missing record ID remains `{assigned during source freeze}`.

| Context | Proposed copy / display | Binding and constraint |
|---|---|---|
| VI PMMA W1 | “Compare later remote CO₂ response, conditional on measured fire inputs, inherited calibration and initial alignment.” | `C-VI6-response`, T1; [S-VI](https://ntrs.nasa.gov/api/citations/20250002675/downloads/Vehicle%20Modeling_FINAL.pdf) pp. 4–7. Plan, not a score. |
| Initial alignment | “Initial agreement is imposed. The response-change residual is the same residual after additive alignment.” | `C-VI6-initial-prediction`, T1; S-VI p. 7 and handoff §4. No improved-fit claim. |
| V normalization W2 | “The source estimate was scaled using a remote-inferred total. Later transport discrepancies can still be examined conditionally.” | `C-V-total-check` / `C-V-spatiotemporal`, T2; [S-V](https://ntrs.nasa.gov/api/citations/20240008602/downloads/ICES-2024-310.pdf) pp. 5–6. Separate 29.9 g, 54.4 g and reported rounded factor 1.82; label derived arithmetic. |
| Burning request W3 | “This transport calculation takes fire outputs as inputs. It does not predict chemical heat release.” | `C-burning-from-T`, T4; S-VI p. 4; calorimetry [S-CAL](https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf) pp. 4,6. Offer model requirements/response alternative. |
| Second NASA input | “SIBAL event 5 supports a source-conditioned response comparison. Close reported totals did not imply accurate transient response at every sensor.” | AC23; S-VI pp. 6–7. Shared Saffire context, not independent generalization. |
| Detection navigation | “SAME addresses smoke-particle measurements relevant to detector response.” | AC24; [NASA SAME overview](https://www.nasa.gov/wp-content/uploads/2025/07/smoke-aerosol-measurement-experiment-same.pdf), Research Overview/Publications. Distinguish measured moments and inferred size parameters; no invented threshold. |
| Extinction navigation | “Visible flame disappearance alone does not establish complete extinction in the cited droplet experiment.” | AC25; [NASA FLEX account](https://www.nasa.gov/missions/station/20-breakthroughs-from-20-years-of-science-aboard-the-international-space-station/), “Discovery of steadily burning cool flames.” No solid-cabin suppression dose. |
| Optional NIST | “At the files’ labelled 200 s, the submitted value exceeds the measured value by 2.0 g.” | W4 / N-EXP / N-PRED; T3. A labelled point inspection, not whole-trace validation; negative tail and unresolved deck-output linkage remain. |

Expose T1 as **“Account for initial alignment,”** T2 as **“Check an imposed source total,”** T3 as **“Interpret the reported mass signal,”** and T4 as **“Check that the quantities match.”** These appear only inside relevant results, with exact template IDs/domain in details, never as unexplained calculator tabs or nonfunctional controls for omitted features.

Use a role table, source-bound dependency list, published-summary arithmetic, formula/domain disclosure, claim differences and precise asset list. There are no acquired synchronized Saffire curves to plot. Do not invent them. Chemical release and cabin sensible addition do not share an “accuracy” axis. If NIST is later included, prefer a labelled table first; any actual CSV plot retains negative readings, exact artifact/time definitions and the unresolved replay link. A schematic, a source-reported value and a derived calculation always have distinct labels.

## 8. Future acceptance plan and design walkthrough

**Every row below is a proposed development check: NOT RUN.** Existing AC cases retain their identity and status; only AC04’s expectation was corrected. UI-01–UI-03 address gaps in interaction testing, not new scientific benchmarks. Capture the request, assessment/export versions, observed behaviour and actual test status when these checks are eventually executed.

| Proposed check | Evidence required from the later application | Mapping |
|---|---|---|
| Fresh PMMA question | A new paraphrase goes through live interpretation, editable confirmation and a real W1 assessment. Useful conditional result precedes expanded evidence; imposed initial agreement and missing numerical assets remain visible. | AC01–AC02, AC20, AC26 |
| Adjustment boundaries | A documented fitted shift contradicts untouched timing; documented post-response baseline selection contradicts prespecification. Unknown details/rules affect only their specification; supported conditional output survives. | Corrected AC04; AC03 |
| Burning versus new model | Changing the request about the same model yields the scoped incompatibility and useful alternative; creating a proposed model gives requirements and no output. Neither erases old history. | AC08–AC09, AC13–AC14 |
| Correction and evidence revision | Ordinary edits save a proposal without changing trusted facts. A separately reviewed relevant record revision makes affected results/exports stale; reassessment updates both. Unrelated updates leave scientific conclusions unchanged. | AC15–AC17; development fixture clearly labelled if used |
| Concurrency and AI failure | Change text during a call; reject invented IDs; simulate outage/no key. Preserve the correct draft, typed fallback and live-AI status. Optional explanation, if later built, rejects stale identity. | AC19–AC22; AC21 remains unimplemented if feature omitted |
| V and second NASA input | T2 derives the disclosed normalization arithmetic from records; SIBAL event 5 uses the same components/rules and retains the transient limitation. Renaming display labels does not alter scientific outcomes. | AC05–AC07, AC18, AC23 |
| Model-free navigation | SAME/FLEX questions summarize, rank with reasons/ties and interpret at supported depth. No invented particle data, alarm score or suppression dose. | AC24–AC25 |
| Revision-to-export consistency | W1 → W3 changes the request/affected claims, retains conditions, and produces matching current preview/Markdown/JSON. Sensor/window edits require reconfirmation; collapsed details stay exported; stale current download is withheld. | AC13, AC16, AC19, AC26 |
| Keyboard and semantics | Complete question → confirmation → evidence → revision → export by keyboard; labels/errors announced, no trap, meaningful reading order, focus restored, no reliance on colour/hover. Check an actual screen reader as well as keyboard navigation. | **UI-01** plus AC26 |
| Responsive reading | Exercise 1366×768, a narrower 1024 px view, 390 px mobile and 320 CSS px reflow; 200% text/400% zoom scenarios. Essential qualifications, labels and actions remain reachable. Check actual contrast, focus visibility and reduced-motion behaviour. | **UI-02** plus AC02/AC26 |
| Recovery and temporary session | Distinguish no match from unavailable source; force export failure, retry against the same/current version, inspect historical download label, and reload an empty session. No missing download is reported as successful. | **UI-03** plus AC16/AC22/AC26 |

For any implemented NIST interface, add the existing AC10–AC11 signal/tare checks; otherwise mark that interface not implemented. No planned test is a software pass, and a schema check is not a physical validation result.

**Document walkthrough finding:** W1 risks looking like a failed simulation if missing assets lead the screen; the proposed reading order leads with the useful plan. “Change model” risks rewriting history, so the controls distinguish changing the question from proposing a model. A generic warning risks discarding all evidence, so outcomes name individual claims. These are design diagnoses, not observed user behaviour.

The demonstration of actual derivation is T1’s rule trace and T2’s arithmetic from typed source values; the demonstration of actual revision is W1 → W3 and the resulting changed export. An application that merely swaps canned paragraphs fails these checks. Relevant-premise changes are additionally exercised through a reviewed-update fixture, with provenance and fixture status visible.

A future independent researcher must adjudicate external tasks before user-benefit claims. Preserve the strongest comparator: the same reviewed sources, assertions, transformations, history and rules in a usable worksheet plus a strong grounded assistant. Report useful completion, unsupported claims, unjustified refusals, correction effort and reproducibility together; charge curation separately. Easy questions may favour the worksheet. No time saving, researcher approval, independent model validity or award prospect is established here; historical H1/25%/five-minute protocols remain untouched.

## 9. Scope, 23-hour allocation and cut order

| Level | Complete scope |
|---|---|
| **Minimum complete UI** | One workspace; current-depth catalogue and grounded ranking; W1/W3 and the V normalization contrast; SIBAL reuse; SAME/FLEX model-free navigation; live interpretation/confirmation; visible conditions/readiness; evidence links; question/scope revision and session history; separate correction proposal; current/historical Markdown + JSON; keyboard/narrow-screen and failure recovery. |
| **Competitive finish within the same budget** | Improve the same path: concise source-bound differences, aligned table typography, consistent copy, direct claim-to-evidence navigation and clean-session reliability. Spend only time available inside the UI/navigation/checking allocations; no extra product subsystem. |
| **Stretch, only with real spare capacity** | Compact NIST artifact inspection, optional role strip, readable HTML export or verified PDF convenience features. Each requires its own rights/assets/checks. No extra time is assumed; omit rather than displace core checks or submission. |

**Explicit rebalance:** keep source freeze **4 h**, live AI **2 h**, navigation **2 h**, checking/repair **4 h**, and submission preparation **3 h**. Move **1.5 h** from the earlier 5-hour core-expansion allocation to the 3-hour UI allocation: core becomes **3.5 h**, UI **4.5 h**. This assumes the reviewed records and bounded contracts avoid new scientific discovery; it is not proven capacity. The C1–C8 estimates sum to UI + AI + navigation = **8.5 h**.

Refine the old phase ordering into a first W1 integration followed by bounded completion. **No UI before the required W1 scientific core and its positive, qualified, unknown and relevant revision checks pass.** Do not wait for every optional context before showing that tested path. Complete the remaining supported template/case coverage before claiming the application complete. This is a scheduling refinement to the handoff’s steps 2–4, recorded in D-042, not a relaxation of its scientific or permission gates.

| Conditional PKT slot | Hours | Dependency and deliverable |
|---|---:|---|
| Sat 14 Nov, 09:00–13:00 | 4 | Establish current G1–G7; select familiar stack, permitted reviewed records and exact source/claim versions. Charge source checking/curation here. |
| Sat, 14:00–16:30 | 2.5 | Implement typed W1 assessment and necessary T1/T4 behaviour; exercise AC01/02, unknown-history and relevant question/revision branches. No UI gate pass by inspecting prose alone. |
| Sat, 16:30–19:00 | 2.5 | First thin integration: typed request confirmation → real assessment → visible result → Markdown/JSON preview/download. This checkpoint has no live-SI claim yet. |
| Sat, 20:00–21:00 | 1 | Complete remaining bounded core/template cases, including T2 and T3 where implemented; no solver or numerical-series expansion. |
| Sat, 21:00–23:00 | 2 | Finish evidence, changes/history and UI consistency; current/historical export distinction. |
| Sun 15 Nov, 08:00–10:00 | 2 | Wire live AI interpretation ahead of confirmation; validate reply identity, failure and typed fallback. |
| Sun, 10:00–12:00 | 2 | Catalogue summary/ranking/navigation; second SIBAL request and SAME/FLEX scope checks through shared components. |
| Sun, 13:00–17:00 | 4 | Scientific consistency, concurrency, export, keyboard/zoom/narrow-screen checks and consequential defect repair. |
| Sun, 18:00–21:00 | 3 | Actual-format submission preparation, citations/rights/SI disclosure and final clean-session checks; publishing/submission still needs its applicable authorization. |
| **Total** | **23** | One builder; no invisible teammate or review hours |

This retains the previous meals/rest periods, nine hours free overnight and planned 2 h 59 min margin after 21:00, conditional on the recorded creator-zone deadline. If early core work overruns, remove optional context work and visual refinements before touching scientific checks, rest or submission margin. Do not claim the entire scope fits if actual progress disproves the estimate.

**Cuts:** optional second AI explanation, complex relationship graph, decorative motion and cloud history are already out. Cut NIST/rod interfaces, embedded PDF features, HTML/CSV extras and optional profile detail next. Preserve the useful NASA result, live interpretation, clear evidence, genuine revision, consistent export, sourced breadth and core accessibility/recovery. A smaller incomplete build must be described honestly.

## 10. Exact implementation start and completion record

This session remains written preparation. **No application/UI implementation starts until the scientific handoff’s G1–G7 are satisfied and the user explicitly instructs the build.** The inherited gate includes applicable event time, an organizer-permitted preparation path, current guides, source/rights checks and team/stack choices. This pass does not repeat the rules/mail investigation or infer a new ruling. Existing drafts remain unsent.

The first later build task is the permitted W1 source/assessment core and its checks. **The first UI task**, immediately after that core gate passes, is C2 + C3 + basic C6 in the small C1 shell: confirm a real request, show its derived conditional plan and export that same assessment. It is not a landing page or a mock chart. Then complete evidence/revision, add live interpretation and broaden using the same components.

**Inspected:** the complete current scientific handoff, relevant purpose/value sections of both preceding reports, repository instructions/history/gate, Git status and existing differences. AC04 was still defective. Targeted W3C guidance informed proposed reading/focus requirements; no new fire-model research or fresh organizer ruling is claimed.

**Designed:** one connected workspace, four text wireframes, visual tokens, field-bound components, controls and recovery states, source-bound copy, future acceptance checks and the explicitly rebalanced budget. These are assistant-authored proposals, not successful rendering or researcher feedback.

**Changed:** added this document; repaired only AC04 plus its dated preserved-wording note in `IGNIS_Contract_Closure_and_Build_Handoff.md`; appended D-041/D-042 and the session chronology. Earlier reports, source data, scripts and frozen evaluations are preserved. Local preservation/diff checks are under gitignored `_raw/ui_ux_handoff_2026-11-08/`. The worktree remains dirty; no commit or staging was performed.

**Untested/unknown:** all application tests, actual UI rendering/usability/accessibility, live AI, exports and user advantage; synchronized Saffire data and full model-use/replay histories; NIST processing/linkage if that optional interface is pursued. The UI exposes these as scoped claim/readiness states, while retaining the supported comparison plan. The design pass is complete; implementation remains separately gated.
