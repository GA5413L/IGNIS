# IGNIS research workspace

IGNIS connects NASA microgravity combustion evidence, descriptive analyses and reproducible research records. Independent project by team Emberfall; see [development/preparation disclosure](docs/AI_DISCLOSURE.md) and [source rights](docs/SOURCE_RIGHTS.md).

**Current build: `web-2026-11-15.13`.** Landing at `/`, research dashboard at `/console`. The integrated teammate design now exposes statistical channel relationships, per-material/flight analysis, recorded-sample deletion sensitivity, local channel comparisons, API citation checks and complete source-linked exports. The protected SI connection has been tested live but has not earned runtime acceptance. [Current verification](docs/BUILD_STATUS.md), [competitor comparison](docs/RESEARCH_WORKBENCH_AND_COMPETITOR_REVIEW_2026-11-15.md).

[Landing page](http://127.0.0.1:3000) · [Research console and SI chat](http://127.0.0.1:3000/console) · [Figures and code](http://127.0.0.1:3000/console#figures) · [Your data](http://127.0.0.1:3000/console#local-data)

## Run

Use Node.js 22.13 or later within the 22.x family. From `web/`:

```sh
npm ci --include=dev
npm run build
npm start
```

Hosting settings: root directory `web`, install `npm ci --include=dev`, build `npm run build`, start `npm start`. The start command binds to `0.0.0.0` and uses the host's `PORT` environment variable (default `3000`). Vercel manages startup itself; leave its start-command setting unset. See the root [requirement.txt](../requirement.txt) deployment checklist; web dependencies are installed from `package.json` and its lockfile, not pip.

**Render:** its Build Command must include installation: `npm ci --include=dev && npm run build`. Keep Root Directory `web`, Start Command `npm start`, and Pre-Deploy Command empty. Running only `npm run build` on a clean checkout produces `next: not found`. After saving the command, use **Manual Deploy → Clear build cache & deploy**. If Render is connected to a fork, synchronize that fork with the team repository before deploying. [Render deployment commands](https://render.com/docs/deploys#build-command).

For development, use `npm run dev`. Both scripts explicitly select webpack: a prior Turbopack build altered imported detector numbers, so exact source/server/browser identity checks are mandatory. No key is needed for the implemented workflows. `Start-IGNIS.cmd` starts the owner's existing F: installation; contributors should use the portable commands above.

## Research workflows

| View | Use it to |
| --- | --- |
| Overview | Follow a question through evidence; inspect coverage and source gaps. |
| Investigations | Search 24 PSI profiles, inspect objectives/source inventory and compare profiles. |
| Atmospheres | Compare seven printed Saffire conditions with a target and inspect the condition-gap frontier. |
| Smoke detection | Inspect 154 workbook rows, cutoff-range bounds, average-rank association and recorded-group deletion sensitivity by material/flight. |
| Findings | Assemble a source-linked brief or check a published model's support for a specific claim. |
| Figures | Isolate or combine materials in four detector panels, export the exact visible SVG/data, or download static publication figures and Python code in either palette. |
| Sources | Inspect evidence, export/recheck notebooks and use trajectory, design and endpoint calculators. |
| Your data | Map a local CSV, declare its clock/units/operator, compare additive channels with a common datum and replay original bytes. |
| Floating SI chat | Search reviewed findings and follow source links from any console view; live interpretation requires an accepted provider. |

Try Kapton at 2 V: 20/35 finite readings fall below the cutoff, with 36 total source rows. In the paired view, scatter-minus-obscuration is +70/133 pooled, −6/25 for SAME and +76/108 for SAME-R. These describe stored readings, not alarms or detector superiority. Changing the cutoff rectangle changes exact sensitivity bounds. For a model question, compare the later Saffire VI CO₂ response with chemical heat release; the requested quantity changes while the model stays fixed.

## Reproduce an analysis

Local CSV processing stays in browser memory. Mapping, units and sentinel strings are explicit; no automatic conversion, synchronization, sorting, interpolation or silent missing-row removal. Limits: 1 MiB, 5,000 data records, 32 columns and four channels. Reloading clears local data. Replay exports explicitly include the raw file and declarations; examples are hypothetical.

```sh
npm run inspect:local -- --csv artifacts/workbench/hypothetical.csv --spec artifacts/workbench/hypothetical-mapping.json --out my-analysis.json
npm run inspect:local -- --replay my-analysis.json
```

The output path must be new. Replay checks checksums and recomputes the result; it does not authenticate measurements or authorship.

The [figure bundle](public/figures/code/ignis-figure-reproduction.zip) contains our script, exact derived input JSON, dependency pins and manifest. Extract into a Python virtual environment:

```sh
python -m pip install -r requirements.txt
python make-figures.py --data figure-data.json --out output --palette okabe-ito
python make-figures.py --data figure-data.json --out output --figure 3 --palette monochrome
```

Original NASA binaries and the full analysis engine are not in the bundle. Rendering bytes can differ by fonts/platform. [Reproduction receipt](artifacts/workbench/reproduction-check.json).

## SI preparation

SI means **Scientific Intelligence**. The floating chat provides catalogue search; the separate SI page has been removed. The server-only Cloudflare integration has fixed free routes, atomic durable quotas, retained unknown-call reservations, circuit breakers, public-mode Turnstile and visitor-bound signed confirmation receipts. Browser CSV/notebook content is not automatically attached; anything typed into an approved public question is sent.

**Actual live result:** one Groq compatibility probe succeeded; the 42-call evaluation stopped after ten attempts. Nine valid schemas, four reference passes, two interpretation errors, three application/reference handling mismatches and one transport failure. Remaining 32 calls, OpenRouter/free and Gemini **NOT RUN**. No runtime configuration accepted. [SI handoff and measured usage](docs/SI_PREPARATION.md). Keys must stay in server configuration and cannot bypass evaluation or acceptance.

## Statistical analysis and figure code

Open Smoke detection → **Statistical relationships**. The preset uses SAME-R, scatter (AW) and ionization delta (BK). Change material/flight/channels, inspect raw and ranked points, then download/recheck the complete result. The deletion range is finite sensitivity, not a confidence interval. [Method, measurements and limits](docs/DETECTOR_ASSOCIATION_METHOD_2026-11-15.md).

In Figure 2 and the statistical scatter, the first material-legend click isolates that material. Further clicks add or remove materials; **Show all** resets this behavior and **Hide all** clears the view. Axes and point coordinates stay fixed. In the statistical plot, visibility does not change the analysis population, ranks or summary coefficients. Its visible-view export embeds the complete analysis package plus the chosen materials and plotted coordinates. Figure 2's separate SVG/JSON exports contain the selected source rows, unavailable-cell counts, fixed domains and view recipe. Static publication downloads retain the full/default view. [Visualization contract](docs/FIGURE_VISIBILITY_2026-11-15.md).

```sh
npm run analyze:association -- --out new-analysis.json
npm run analyze:association -- --replay new-analysis.json --out recomputed-analysis.json
python public/figures/code/plot-detector-association.py --data new-analysis.json
python public/figures/code/plot-detector-association.py --data new-analysis.json --out association.svg --palette okabe-ito
```

The Python arithmetic checker uses only the standard library; figure rendering uses `matplotlib==3.10.8`. It rechecks exported-cell coefficients; the TypeScript CLI additionally verifies the pinned source, method and full result. No source workbook is embedded. Outputs must use new paths.

## Verify and contribute

```sh
npm run validate:data
npm run test:team
npm run lint
npm run build
npm run typecheck
npm run test:e2e
```

**Current verification is recorded in [BUILD_STATUS](docs/BUILD_STATUS.md).** Browser checks use installed Chromium at 1366/375 pixels on port 3000. Set `IGNIS_CHROMIUM_EXECUTABLE` if needed. Private provider/evaluation fixtures and historical specs targeting removed controls remain excluded. Firefox remains NOT RUN because the installed protocol is incompatible with this Playwright version.

The r2 catalogue, engine .5, renderer .5 and all 20 existing curated collections remain unchanged. [Build status](docs/BUILD_STATUS.md), [current competitor/research review](docs/RESEARCH_WORKBENCH_AND_COMPETITOR_REVIEW_2026-11-15.md), [contributor setup](../CONTRIBUTING.md).

GitHub source sharing and hosting preparation are authorized. The owner has designated `ignisatlas.earth` and is discussing the hosting account; deployment is pending that decision. [Hosting handoff](docs/HOSTING_HANDOFF_2026-11-15.md). Competition submission and outreach remain separate. Historical reports/screenshots describe their dated builds. No independent scientific validation, measured competitive superiority or NASA adoption is claimed.
