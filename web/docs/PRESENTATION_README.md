# Seven-slide local presentation

Open [`web/public/briefing.html`](../public/briefing.html) directly in a browser. It is a self-contained presentation with exactly **seven slides including the title**. It uses inline CSS and original SVG graphics, system fonts and no external assets, scripts, fetches or network requests. Primary-source links are ordinary citations; they are not loaded automatically. The only script action is the local print button.

The palette matches the research workspace: dark teal `#102d32`, warm white `#f6f6f1` and burnt orange `#b93815`. Screen layout scales to the browser width. Print CSS specifies `@page { size: 16in 9in; margin: 0; }`, one slide per page, with controls hidden. Use browser **Print → Save as PDF**, background graphics enabled, no headers/footers, and the CSS page size. For Playwright use `page.pdf({ preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false })`; do not override the page format with A4 or Letter.

The lead rendered [the PDF](../artifacts/IGNIS-briefing-2026-11-15.pdf), verified seven 16:9 pages and inspected every page. An unintended axis-path fill was found and fixed before the final render. Final DOM bounds showed no slide clipping. No publication or public-access check occurred.

## Story and source mapping

| Slide | Purpose | Data or evidence used |
|---|---|---|
| 1 | Title and source-to-comparison workflow | Working label IGNIS; registered team Emberfall; official Flame in Freefall challenge. No invented member names. |
| 2 | Problem, implemented workflow and artifact inventory | `investigation-atlas.json`: 24 profiles, 22 CSV tables, one analyzed workbook. Counts describe artifacts, not independent burns. |
| 3 | Seven actual Saffire condition coordinates | `condition-cases.json`, all seven cases from ICES-2026-577 Table 1, PDF p. 6. No interpolation, fitted curve or safety scale. Original oxygen fraction/pressure strings accompany VI-3. The 2024/2026 flow conflict stays visible. |
| 4 | Paired cohort sensitivity | SAME AW scatter and AV obscuration; independently declared 2 V cutoffs, DBP excluded. Joint finite pairs 133/134; A-minus-B fractions +70/133 pooled, −6/25 flight 1, +76/108 flight 2. Literal recorded-n fan selection excludes 109 unrecorded flight 2 rows. These are descriptive patterns, not alarm outcomes or detector rankings. |
| 5 | W1→W3 revision and W2 normalization | Existing deterministic comparison contracts; `observations.json` preserves source-reported 29.9 g, 1.82 and 54.4 g. The deck does not invent a model run, an output curve or a quantitative validation score. |
| 6 | Reusable artifacts and the testable contribution | Curated JSON, provenance, exact selected-analysis exports and portable recipe/receipt rechecks. Original result bytes require assessment JSON. Source/method/result drift is distinguished; measured superiority or NASA adoption is not claimed. |
| 7 | Limits, AI/preparation disclosure and credits | Live runtime AI **NOT RUN**; no accepted configuration; independent review **PENDING**; predictive validation not established; public access not verified. AI assistance and pre-event preparation are disclosed. |

The condition SVG uses the exact data coordinates below, with no jitter. The selected-point ring is a highlight, not another observation or uncertainty interval. Material and burning-sides cohorts have both distinct shapes and colors.

| Case | Material | Burning sides | O₂ (mole%) | Pressure (kPa) |
|---|---|---:|---:|---:|
| IV-2 | PMMA | 2 | 22 | 100 |
| V-3 | PMMA | 1 | 26 | 74.5 |
| VI-3 | PMMA | 2 | 30 | 54.4 |
| VI-4 | PMMA | 1 | 29 | 55 |
| IV-1 | SIBAL | 2 | 23 | 98 |
| V-2 | Cotton | 2 | 28 | 74.1 |
| VI-2 | SIBAL | 2 | 31 | 54.1 |

Plot transform: `x = 80 + (oxygenPercent − 20) × 54`; `y = 360 − (pressureKPa − 50) × 300 / 55`. Each plotted observation carries `data-case`, `data-oxygen` and `data-pressure` attributes for local verification. Shape coordinates are rounded only for SVG display. The seven-row source values above remain authoritative.

The presentation condenses the [judge walkthrough](JUDGE_WALKTHROUGH_2026-11-15.md) and [submission package](SUBMISSION_PACKAGE_2026-11-15.md), combining the original problem/inventory slides so that source conditions, detector denominators, claim revision, reuse and credits fit within seven pages. The three-minute rehearsal script remains distinct from the submission guide's separate video option.

## Before external use

Confirm the final product name and registered member credits; the deck explicitly marks those identity details as pending. Keep the real AI/preparation disclosure. Render and inspect all seven PDF pages for clipping, legibility, correct source values and functioning citation links. Add a public project link only after publication and signed-out verification. Do not replace the disclosure statuses with test-pass or independent-validation claims without actual scoped evidence.

This presentation contains no NASA logo, mission insignia, copied publisher figure, competitor logo, generated raster media, invented public URL or submission/deadline claim. Original data graphics and text were prepared with AI assistance; they are not screenshots or evidence that a browser journey passed.

## Research-patch update

Slide 4 now shows the paired cohort audit. SVG x coordinates use `430 + 280 × fractionDifference`; y positions separate the three groups and carry no scientific time meaning. There are no uncertainty bars. Source values and limitations are in `PROFESSIONAL_RESEARCH_AND_IMPROVEMENTS_2026-11-15.md`. Slide 6 includes implemented save/import/recheck. The previous deck/PDF are preserved under `_raw/professional_research_2026-11-15/build/before_handoff/`. The refreshed PDF and slide checks are recorded in the patch verification artifacts.
