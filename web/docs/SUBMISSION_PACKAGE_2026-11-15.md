# Local submission and researcher handoff

Prepared 15 November 2026 PKT. This is **paste-ready content and a local package plan**, not an externally published project or a confirmed submission. **Emberfall** is the registered team; **IGNIS** is the working product label pending the user's naming decision. No public host, URL, final product name or registered-member roster is assumed.

## Confirmed submission format and timing

The source is the user-supplied official **Project Submission Guide**, dated 13 November and printed 14 November, plus the **Judging & Awards Guide** printed 14 November. They were read directly during this handoff. These are saved official captures, not a claim of a fresh live-page check.

| Requirement | Verified source and current consequence |
| --- | --- |
| Deadline | Universal Event uses the Team Owner's area-of-residence time. The owner zone is confirmed as PKT in the project record: **15 November 2026, 23:59 PKT = 18:59 UTC**. Opening was 14 November 09:00 PKT. Submission Guide pp. 2, 12. |
| Demo | **At most seven slides including title/intro, OR a video no longer than 30 seconds.** The separate three-minute walkthrough is a rehearsal/live-pitch script, not the required video. Submission Guide pp. 6, 10–11. |
| Access | Demo and final-project links must be public without login, permission or registration. The final project may be a website or a hosted repository/artifact; a deployed app is not the only accepted form. Submission Guide pp. 4, 6–7. |
| Required content | Complete the project name, high-level summary, demo link, final-project link, detailed description, SI-use response, NASA data and other references. English is required; a non-English video needs English subtitles. Submission Guide pp. 6–9, 12; Judging Guide p. 3. |
| Team | Universal Event Global Judging requires **2–6 registered members** on the same event/team roster. One active builder is known; this does not verify the full registered roster. Do not count AI agents as members. Judging Guide p. 3. |
| NASA resources | At least one NASA resource is required for Global Award eligibility; the curated PSI data and NTRS sources directly satisfy the project's NASA-resource use, subject to the remaining submission requirements. Submission Guide p. 8. |
| Submission action | Saving a draft is not submitting. The owner must complete the required declarations, click **Submit for Judging**, and verify the confirmation and final submitted revision before the deadline. Submission Guide p. 12. |

Local sources: [Submission Guide](../../DOCS/NASA%20Space%20Apps%20Challenge.pdf), SHA-256 `4830a380355af14c35d836653b359c9935e64def3cfcdf5bc5976ab8bc7b00c5`; [Judging & Awards Guide](../../DOCS/NASA%20Space%20Apps%20Challenge2.pdf), SHA-256 `7010523e8e8a91fd4854db5c8bff0d5dc7ced2b33e2ea82dd032d77953f200e2`. Public originals: [submission guide](https://www.spaceappschallenge.org/resources/project-submission-guide/), [judging guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/). The project's 18:00 PKT feature freeze is an internal planning cutoff, not a competition rule.

## Project-form copy

The following copy describes the current local implementation and audited data. Retain its pending-verification sentence until the builder records actual current UI checks. Replace bracketed identity/link fields with verified values; no external upload or submission has been performed by this handoff.

### Project name and links

**Project name:** `[final selected name; IGNIS is the current working label]`  
**Team:** Emberfall  
**Challenge:** Flame in Freefall: SI-Powered Fire Safety Insights from Microgravity Combustion Data  
**Project demo:** `[public link to the final seven-slide deck, verified signed out]`  
**Final project:** `[public project or repository/artifact link, verified signed out]`

### High-level project summary

IGNIS is a local research workbench that helps people find NASA fire evidence, understand what was measured, and assess what a comparison can support. It brings together 24 PSI investigation profiles, seven versioned Saffire atmosphere cases and a source-audited SAME/SAME-R detector dataset. Researchers can inspect conditions, preserve missing readings and separate a useful model comparison from an unsupported predictive claim. The existing assessment workflow keeps sources, assumptions and revisions together in reviewable exports. AI assistants supported research, curation, design and implementation; current scientific assessments are deterministic. The new data layer is reproducible, while final interface and public-release checks remain pending. The prototype does not predict fire safety or claim NASA endorsement.

### Detailed project description

NASA's microgravity experiments address prevention, detection and suppression, but their results cannot be combined solely because they use the same material name or similar oxygen conditions. A researcher must also understand geometry, gravity, flow, thermal history, measurement location, instrument response and what information a published model already used. IGNIS makes those decisions visible and preserves them for review.

The investigation atlas contains 24 acquired NASA PSI profiles and an explicit inventory of 22 experimental-table CSVs plus an analyzed SAME/SAME-R workbook. Source-stated objectives are labeled as catalog metadata. The CSVs contain 2,009 nonblank records, including summaries and notes; we do not present them as 2,009 burns. Each acquired artifact carries its source identity, version and hash. Missing license information remains unknown.

The condition dataset curates seven cases from one 2026 Saffire table. It retains original oxygen mole-fraction and pressure strings, exact unit conversions, material, burning sides, geometry and reported preheating. For example, the 2026 VI-3 case is two-sided PMMA at 30 mole% oxygen and 54.4 kPa. Earlier publications differ, including an unresolved flow-direction conflict. Condition-gap inspection is restricted to material/sides cohorts and does not establish physical equivalence, lunar transfer or safety.

The detector dataset preserves 134 spacecraft-material records and 20 separately marked DBP reference records from the workbook's `Material Sort` sheet. Missing and error cells are retained. At an analyst-selected ISS scatter cutoff of 2 V, the descriptive source recount is 20 of 35 finite Kapton readings and 18 of 23 finite Teflon readings below the cutoff. These are not measured alarm failures. The workbook and condition CSV also have an unresolved record-identity mismatch, which remains visible rather than being silently repaired.

The new paired audit asks whether a descriptive pattern survives a change of cohort. With AW scatter and AV obscuration each compared to its own declared 2 V cutoff, 133 of 134 nonreference rows are jointly finite. The at/above-fraction difference is +70/133 pooled, −6/25 for flight 1 and +76/108 for flight 2. Requiring a literal recorded-n fan flag excludes all 109 flight-2 material rows with unrecorded status and reverses the retained pooled sign. This is an instrument/population-context finding, not an alarm-performance or detector-superiority result. Missingness bounds and exact source witnesses remain inspectable.

Condition, single-channel and paired selections now attach to a brief and its exports. A portable notebook saves the draft, attached selections and up to 16 assessment recipes/receipts. Import recomputes locally and distinguishes source, method and result changes. Original result bytes are preserved by the separate assessment JSON; checksums are not signatures. A Data & methods view links newly reviewed SAME aging, NIST reference-trial and Saffire clock resources and explains why a new physical ML predictor is not justified for the current release.

Three worked model questions demonstrate the reasoning workflow. W1 specifies a conditional comparison for the later remote CO₂ response of the published Saffire VI transport model, with synchronized series still required for a numerical comparison. W2 explains why a measured target used to normalize the Saffire V source total cannot independently validate that same total, while retaining useful descriptive arithmetic and potential downstream comparisons. W3 changes the requested outcome to independent chemical heat release, keeps the original transport model, and explains why that stronger claim is unsupported. The revision and assessment exports preserve the changed question and source history.

The local stack uses Next.js, React, TypeScript and deterministic assessment/data-processing code; Python scripts curate the pinned source files. AI assistants helped inspect primary sources, design and implement the workflow, generate tests and documentation, and prepare this submission text. No live interpretation configuration is accepted in the current runtime. The local interface passed 280 offline tests and 27 production-browser tests, with one intentional duplicate browser test skipped. Six new desktop/mobile workflow states were checked after the patch; prior captures remain dated snapshots. These are software checks performed with AI assistance. The owner is preparing Groq and Gemini keys; no new designated credential or funded/credited status has been verified, and live interpretation remains unavailable. Source reproducibility does not establish independent scientific validation, user advantage, a held-out evaluation or predictive state of the art.

The intended benefit is a shorter, more reviewable path from NASA evidence to a defensible research comparison and a concrete next data requirement. Strong public projects already offer source-linked search, condition matching and detector analysis. Our focused contribution is connecting those steps to measurement meaning, conditional model reuse, changed assumptions and exportable reasoning. A controlled researcher-task comparison against an equally informed spreadsheet is future work; no measured superiority is claimed.

### SI use and preparation disclosure — paste-ready

We used AI assistants extensively in preparing this project, including Claude Code and OpenAI Codex. AI assistance covered literature and competitor research, source retrieval/inspection, table and workbook curation, scientific-contract development, product-design refinement, application code, tests, documentation and this presentation text. The 15 November continuation used AI specialist agents for physics, detection and mathematical/model assessment. These agents were software tools, not independent human reviewers or registered team members. NASA measurements remain attributed to their original sources; AI-authored selections, paraphrases, conversions and code are identified as such.

Preparation began before the 14–15 November hackathon. It included literature reading, source acquisition, bespoke table transcriptions, crosswalks, evidence cases, analysis/research scripts, audits, specification documents and substantial AI-assisted concept/design development. Event-window work on 14–15 November included the application build and further curation, integration and documentation. The project owner authorized reuse of the preparation under recorded decision D-050. That is the owner's decision, not an organizer ruling or an eligibility exemption. We preserve the chronology and disclose the actual AI and preparation history rather than claiming human-only ideation or that all project-specific work began during the hackathon.

The current runtime has no accepted live AI interpretation configuration. Scientific assessment outcomes come from explicit, deterministic contracts; the current package does not claim live model inference, simulated fire behavior or independently validated predictions. AI-assisted research and design should not be described as an independently validated scientific panel. No AI-generated image, video or audio is included in this text/storyboard package; the planned visuals are original data displays and actual interface captures. If generated media is added later, the required visible/metadata SI labeling must be added too.

The saved Submission Guide p. 8 permits SI assistance, requires code/data attribution in descriptive text and metadata, and restricts SI-originated solution ideas and generated NASA branding/design elements. This disclosure describes the substantial assistance honestly; it does not settle organizer interpretation of that history. Although the guide says the SI form response is for data collection and not shown to judges, retain the disclosure in the project itself as well.

### NASA data used — paste-ready

Our principal data source is NASA's Physical Sciences Informatics repository. The atlas covers PSI-10, 20, 21, 22, 23, 25, 26, 39, 47, 60, 62, 68, 69, 98, 99, 100, 101, 102, 106, 107, 115, 117, 142 and 159. Each profile includes its NASA public-record link, DOI when stated, record version, license fields and source hash. We acquired the 22 experimental-table CSVs listed in those records and separately inspected the PSI-101 analyzed SAME/SAME-R workbook. The detector selection retains the original workbook sheet, row, cell and stored-value provenance.

NASA NTRS publication 20260001992, *Heat and Smoke Emission from Tests on the Saffire VI Experiment*, ICES-2026-577, Table 1 on PDF page 6, supplies the seven canonical condition cases. NTRS 20240002981 provides earlier Saffire context and a preserved publication conflict. NTRS 20240008602 and 20250002675 supply the Saffire V and VI model-method cases. FLEX and NASA/NIST overview sources support the broader prevention/detection/suppression brief. Findings are scoped to the acquired source, version and measurement; a PSI subset is not presented as all NASA research.

## References and licensing for the final artifact

Keep the public source links in the generated atlas and assessment exports. The submission References field should also include the compact source list below and the actual public project's source/provenance inventory once its URL exists. Do not replace the References field with an inaccessible local path.

**PSI accession references:** [PSI-10](https://psi.nasa.gov/physci/repo/data/investigations/PSI-10), [PSI-20](https://psi.nasa.gov/physci/repo/data/investigations/PSI-20), [PSI-21](https://psi.nasa.gov/physci/repo/data/investigations/PSI-21), [PSI-22](https://psi.nasa.gov/physci/repo/data/investigations/PSI-22), [PSI-23](https://psi.nasa.gov/physci/repo/data/investigations/PSI-23), [PSI-25](https://psi.nasa.gov/physci/repo/data/investigations/PSI-25), [PSI-26](https://psi.nasa.gov/physci/repo/data/investigations/PSI-26), [PSI-39](https://psi.nasa.gov/physci/repo/data/investigations/PSI-39), [PSI-47](https://psi.nasa.gov/physci/repo/data/investigations/PSI-47), [PSI-60](https://psi.nasa.gov/physci/repo/data/investigations/PSI-60), [PSI-62](https://psi.nasa.gov/physci/repo/data/investigations/PSI-62), [PSI-68](https://psi.nasa.gov/physci/repo/data/investigations/PSI-68), [PSI-69](https://psi.nasa.gov/physci/repo/data/investigations/PSI-69), [PSI-98](https://psi.nasa.gov/physci/repo/data/investigations/PSI-98), [PSI-99](https://psi.nasa.gov/physci/repo/data/investigations/PSI-99), [PSI-100](https://psi.nasa.gov/physci/repo/data/investigations/PSI-100), [PSI-101](https://psi.nasa.gov/physci/repo/data/investigations/PSI-101), [PSI-102](https://psi.nasa.gov/physci/repo/data/investigations/PSI-102), [PSI-106](https://psi.nasa.gov/physci/repo/data/investigations/PSI-106), [PSI-107](https://psi.nasa.gov/physci/repo/data/investigations/PSI-107), [PSI-115](https://psi.nasa.gov/physci/repo/data/investigations/PSI-115), [PSI-117](https://psi.nasa.gov/physci/repo/data/investigations/PSI-117), [PSI-142](https://psi.nasa.gov/physci/repo/data/investigations/PSI-142), [PSI-159](https://psi.nasa.gov/physci/repo/data/investigations/PSI-159).

**Primary model/condition and broader-brief references:** [Saffire 2026 conditions](https://ntrs.nasa.gov/citations/20260001992); [Saffire 2024 preliminary results](https://ntrs.nasa.gov/citations/20240002981); [Saffire V transport model](https://ntrs.nasa.gov/citations/20240008602); [Saffire VI transport model](https://ntrs.nasa.gov/citations/20250002675); [FLEX presentation](https://ntrs.nasa.gov/citations/20210022617); [NASA SAME overview PDF](https://www.nasa.gov/wp-content/uploads/2025/07/smoke-aerosol-measurement-experiment-same.pdf); [NASA combustion science](https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/); [NASA combustion and fire safety overview](https://www.nasa.gov/missions/station/studying-combustion-and-fire-safety/); [NASA Saffire overview](https://www.nasa.gov/humans-in-space/the-flame-of-discovery-grows-as-saffire-sets-new-fires-in-space/); [NASA ISS research summary](https://www.nasa.gov/missions/station/20-breakthroughs-from-20-years-of-science-aboard-the-international-space-station/); [NIST detector-performance publication page](https://www.nist.gov/publications/evaluation-spacecraft-smoke-detector-performance-low-gravity-environment); [NIST/NASA detector article](https://www.nist.gov/news-events/news/2018/05/nistnasa-study-shows-one-detector-doesnt-fit-all-smoke-spacecraft); [official challenge and linked resources](https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/). The NIST publication-page abstract and its related news story are not independent studies.

**Tools and prior-art acknowledgement:** Next.js, React, TypeScript, Zod, Python, Vitest, Playwright and ESLint; versions are recorded in `web/package.json` and the lockfile. Source inspection also used PyMuPDF and standard XLSX ZIP/XML reading. Claude Code and OpenAI Codex assisted development. Public competitor repositories informed the comparison and scope, not a claim of originality of their existing features; pinned links and inspection limits are in [Competitive Update](COMPETITIVE_UPDATE_2026-11-15.md). Keep that acknowledgement in the public research documentation when released.

| Material | Accurate licensing/rights statement |
| --- | --- |
| PSI catalog records | Twenty-three of the acquired records state **CC0-1.0**. **PSI-10's license is not reported**; keep that explicit and do not inherit CC0 from neighboring records. Every profile retains its own license fields and source link. |
| PSI-101 detector selection | Its source record states CC0-1.0. Attribute NASA PSI-101, DOI [10.60555/2np7-jv14](https://doi.org/10.60555/2np7-jv14), file/hash, sheet and selected cells; preserve source labels and derived-analysis descriptions. |
| NTRS papers and publisher material | Public access is not a blanket license. NTRS 20260001992 is PUBLIC but its rights determination is `MAY_INCLUDE_COPYRIGHT_MATERIAL`. Link primary papers and retain short quotations, factual transcriptions and locators. Do not bundle full PDFs or copied figures in the release package. |
| Original code/documentation | No repository-wide LICENSE file was found in the inspected tree. Record the final open-source license and include its actual file before publishing. Do not describe the current repository as already MIT/Apache licensed. The saved Participant Terms require original content to be freely available or under an OSI-approved license and describe an Apache-2.0 fallback; that does not supply licenses for third-party material. |
| Dependencies, media and branding | Preserve each dependency's license/attribution. Use original data graphics and properly attributed interface captures. Do not imply NASA affiliation or reuse NASA logos/mission insignia as product branding. No generated media is included by this handoff. |

The new curated PSI records/cells are part of the data artifact; an older statement that “no third-party dataset is bundled” is no longer an accurate blanket description. Raw acquisitions remain in the local `_raw/` cache and are excluded from the proposed public package. [Atlas provenance](ATLAS_DATA_PROVENANCE.md) and [detector provenance](DETECTOR_DATA_PROVENANCE.md) describe exactly what was selected or transformed.

## Local reviewer and researcher reuse

The generated JSON files can be inspected without credentials or model inference. Full re-curation additionally requires the **same pinned local raw files**. Those inputs are not bundled by this package; a public clone without them cannot run the source checks until the originals are obtained from the cited NASA records and match the documented hashes. The scripts deliberately fail on mismatched bytes rather than substituting a newer source silently.

From the repository root, using the available local Python interpreter:

```powershell
& 'C:/Users/Arbaz/AppData/Local/Python/pythoncore-3.14-64/python.exe' -I -X utf8 web/scripts/curate-atlas.py --check
& 'C:/Users/Arbaz/AppData/Local/Python/pythoncore-3.14-64/python.exe' -I -X utf8 web/scripts/curate-detector-data.py --check
```

Both commands passed during this local work. The atlas check verifies 55 raw-file hashes and reproduces 24 profiles, 22 CSV inventories, seven condition cases and four cohorts. The detector check reproduces all 154 flight-marked workbook records: 134 spacecraft-material and 20 DBP reference records. To regenerate those JSON artifacts, omit `--check`; this changes generated files, not the original raw inputs. It does not run a simulator, spreadsheet formulas, a language model or a network request.

For application review, use the current `web/package.json` scripts in an environment with its Node/dependency requirements satisfied. These are review commands, not new pass claims in this document:

```text
cd web
npm run validate:data
npm run typecheck
npm run test:unit
npm run test:integration
npm run test:exports
npm run lint
npm run build
npm run dev
```

Then follow the [judge walkthrough](JUDGE_WALKTHROUGH_2026-11-15.md): inspect one atlas source, a PMMA-2 condition, the Kapton missing-cell denominator, and W1→W3 with W2 as a second check. Use the existing Playwright script (`npm run test:e2e`) with its configured server to verify the final interface after integration. The E: workspace is the source of truth; the existing F: tool mirror must match the chosen revision before mirror test results are attributed to it. No dependency install, browser run or deployment was performed by this documentation task.

## Concrete remaining release items

| Item | Status at this handoff |
| --- | --- |
| Local text, three-minute script, seven-slide storyboard | Prepared here. A rendered seven-slide deck and actual screenshots still need to be produced from the final interface. |
| Source data | Atlas and detector curator checks passed. Source-specific scientific limits remain in the artifacts. |
| New interface and exports | Lead builder is integrating them. Record current browser/test results; do not recycle earlier counts as validation of the new interface. |
| Final name and roster | Product name unresolved. Registered team is Emberfall; verify the displayed registered member names/count from the team page before completing the deck. |
| Disclosure/rights metadata | Retain the paste-ready disclosure above. Update older app disclosure/rights text to include Codex contributions, new curated data and current inference-authorization status; authorization is not runtime acceptance. Add the final original-code license. |
| Hosting/public access | Deployment remains on hold under D-053. No host or URL is assumed. Once an external release is authorized and performed, verify public demo and project links while signed out. |
| Portal submission | Not performed. Complete the required fields/declarations and confirm the submitted revision before **15 November 23:59 PKT**. An organizer's eligibility decision and acceptance are not established by this document. |

The claimed contribution is an auditable research workflow and reproducible source curation. The next empirical question is whether researchers make more correct, useful comparisons with less verification effort than with an equally informed spreadsheet. Held-out evaluation, independent scientific review, NASA adoption and predictive SOTA remain unclaimed.
