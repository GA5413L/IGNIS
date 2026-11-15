# IGNIS research workspace

IGNIS connects NASA microgravity combustion evidence, descriptive analyses and reproducible research records. Independent project by team Emberfall; see [development/preparation disclosure](docs/AI_DISCLOSURE.md) and [source rights](docs/SOURCE_RIGHTS.md).

**Current build: `web-2026-11-15.11`.** The complete `UI_REVAMP` push (`26a952d`) is integrated with the current scientific backend. The dashboard is at `/`; `/example` redirects to Smoke detection. The landing page and `/console` described in older teammate notes were absent from that complete push.

[Open IGNIS locally](http://127.0.0.1:3000) · [SI](http://127.0.0.1:3000/#si) · [Figures and code](http://127.0.0.1:3000/#figures) · [Your data](http://127.0.0.1:3000/#local-data)

## Run

Use Node.js 22.13 or later. From `web/`:

```sh
npm ci
npm run build
npm start
```

For development, use `npm run dev`. Both scripts explicitly select webpack: a prior Turbopack build altered imported detector numbers, so exact source/server/browser identity checks are mandatory. No key is needed for the implemented workflows. `Start-IGNIS.cmd` starts the owner's existing F: installation; contributors should use the portable commands above.

## Research workflows

| View | Use it to |
| --- | --- |
| Overview | Follow a question through evidence; inspect coverage and source gaps. |
| Investigations | Search 24 PSI profiles, inspect objectives/source inventory and compare profiles. |
| Atmospheres | Compare seven printed Saffire conditions with a target and inspect the condition-gap frontier. |
| Smoke detection | Inspect 154 workbook rows, missing cells, paired channels, flight strata and exact cutoff-range bounds. |
| Findings | Assemble a source-linked brief or check a published model's support for a specific claim. |
| Figures | Download PNG/SVG/PDF, choose Okabe–Ito or monochrome, and obtain exact data and Python code. |
| Sources | Inspect evidence, export/recheck notebooks and use trajectory, design and endpoint calculators. |
| Your data | Map a local CSV, declare its clock/units/operator, inspect raw records and export/replay an analysis. |
| SI | Write a question, review scope, confirm/export an assessment; preview a Groq/Gemini interpretation packet. |

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

SI means **Scientific Intelligence**. Structured mode works now. Groq `openai/gpt-oss-120b` and Gemini `gemini-3.8-flash` are prepared candidates, not accepted runtime configurations. `/api/si` returns public setup status or previews the interpretation packet; it makes no provider call. CSV contents and notebook history are excluded.

**Live interpretation: NOT RUN.** A key does not bypass the existing evaluation/accounting/acceptance gates. Keep keys in an owner-designated local file or process environment, never source, a browser bundle or chat. Legacy `AI_*` and stored fields retain compatibility. [SI handoff](docs/SI_PREPARATION.md), [evaluation readiness](docs/API_EVALUATION_READINESS.md).

## Verify and contribute

```sh
npm run validate:data
npm run test:team
npm run lint
npm run build
npm run typecheck
npm run test:e2e
```

**479 offline checks and 34 production browser checks pass**, plus TypeScript, lint, webpack build and figure replay. Browser checks use installed Chromium at 1366/375 pixels, port 3000; set `IGNIS_CHROMIUM_EXECUTABLE` if needed. Private provider/evaluation fixtures and historical specs targeting deleted components are excluded. Firefox is NOT RUN because the installed binary is incompatible with this Playwright version.

The r2 catalogue, engine .5, renderer .5 and all 20 existing curated collections remain unchanged. [Build status](docs/BUILD_STATUS.md), [current competitor/research review](docs/RESEARCH_WORKBENCH_AND_COMPETITOR_REVIEW_2026-11-15.md), [contributor setup](../CONTRIBUTING.md).

GitHub source sharing is authorized. Deployment, competition submission and outreach remain separate. Historical reports/screenshots describe their dated builds. No independent scientific validation, measured competitive superiority or NASA adoption is claimed.
