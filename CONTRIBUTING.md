# Contributing to IGNIS

The application is in `web/`. The submission snapshot is documented in [PROJECT_RECORD.md](PROJECT_RECORD.md). Keep later development on a clearly dated branch; the current repository cleanup makes no application changes.

## Development

Use Node.js 22.13 or newer within 22.x.

```sh
git clone https://github.com/GA5413L/IGNIS.git
cd IGNIS/web
npm ci --include=dev
npm run dev
```

Open http://localhost:3000. No provider key is needed for catalogue search or deterministic research workflows.

## Verification

```sh
npm run validate:data
npm run test:team
npm run lint
npm run build
npm run typecheck
```

`test:team` excludes the provider evaluation file that depends on private frozen fixtures. Its result is a software check, not a live model evaluation. Private questions, answer keys and spending ledgers are not distributed.

Browser tests use the production build at port 3000 and an installed compatible Chromium browser:

```sh
npm run test:e2e
```

Set `IGNIS_CHROMIUM_EXECUTABLE` to the browser executable when needed. The test command does not install a browser. Keep the webpack build configuration: source/server/browser numeric identity is explicitly tested.

## Scientific conventions

- Preserve source values, units, locators, missing/error states and version identities. Never fill an unreported value with zero or an assumed default.
- Establish the measured quantity, instrument/operator, configuration and observation window before combining records. Similar labels alone do not make experiments comparable.
- Keep analytical populations separate from display-only material visibility. Source-cell witnesses and export recipes must reproduce the stated result.
- Do not promote descriptive fractions or rank associations to alarms, causal effects, calibration, physical predictions or confidence intervals.
- Preserve source conflicts and qualifications. Independent scientific review must be identified separately from AI assistance and software verification.
- Model interpretation remains subject to its existing acceptance, public-data, confirmation and server-side accounting contracts.

## Changes and source rights

Use a branch and a focused pull request. Explain the observed problem, resulting behaviour and relevant verification. Do not rewrite submission history or imply later changes were made during the challenge.

Keep credentials, environment files, raw third-party downloads, private evaluation material, local notes and build caches out of Git. The public figure-code bundle is intentionally included; source PDFs and workbooks are not. Original IGNIS code and documentation are licensed under the [Apache License 2.0](LICENSE). [Source rights](web/docs/SOURCE_RIGHTS.md), [AI disclosure](web/docs/AI_DISCLOSURE.md) and the original dependency licenses remain applicable; third-party content is not relicensed by IGNIS.
