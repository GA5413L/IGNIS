# Working on IGNIS

The shared application is in `web/`, build **web-2026-11-15.12**. The landing page is at `/`; the integrated teammate dashboard is at `/console`. Components live in `web/src/ui/`. See the [workbench/competitor report](web/docs/RESEARCH_WORKBENCH_AND_COMPETITOR_REVIEW_2026-11-15.md), [SI handoff](web/docs/SI_PREPARATION.md), [build status](web/docs/BUILD_STATUS.md) and [scientific rules](CLAUDE.md).

## Clone and run

Install Node.js **22.13.0 or later** and Git. These commands work from a fresh clone on Windows, macOS or Linux:

```sh
git clone https://github.com/GA5413L/IGNIS.git
cd IGNIS/web
npm ci
npm run dev
```

Open `http://localhost:3000`. No API key or environment file is needed for the structured research workflows. Live SI interpretation is disabled; cloning the repository does not authorize provider calls or reset evaluation budgets.

For the production app:

```sh
npm run validate:data
npm run test:team
npm run build
npm run typecheck
npm start
```

Use the package scripts: `dev` and `build` explicitly select **webpack**. The audited Turbopack output changed imported detector numbers. Keep the source-text checks strict. `Start-IGNIS.cmd` is the original owner's workstation shortcut; other contributors should use the portable commands above.

## Verify a change

`npm run test:team` runs **479 offline application checks**. The 25-test provider/IE-1 file needs private frozen evaluation fixtures and is deliberately excluded from the team command. This is not a live interpretation acceptance result. Private fixtures, score keys and cumulative spend/probe ledgers stay local; do not invent replacements or start a new ledger to bypass them.

Run `npm run lint` and a production build before handing off a change. The existing browser suite uses installed **Chromium** at desktop 1366/mobile 375 widths and starts/reuses a production server on port 3000:

```sh
npm run build
npm run test:e2e
```

Set `IGNIS_CHROMIUM_EXECUTABLE` to an installed compatible binary if needed. The command does not download a browser. If none is available, record checks as NOT RUN. Optional Firefox checks require `IGNIS_TEST_FIREFOX=1`; the owner's installed Firefox protocol was incompatible and checks were NOT RUN. Do not silently replace failed source assertions, weaken equality to an epsilon, or change frozen answers to make tests pass. Source-curation scripts require the pinned local `_raw/` downloads; the app itself runs from the committed curated data.

## Collaborate without overwriting one another

```sh
git switch main
git pull --ff-only
git switch -c yourname/short-task
# make and check the change
git add <changed-files>
git commit -m "Describe the concrete change"
git push -u origin yourname/short-task
```

Open a pull request against `main`. Explain the trigger, resulting behavior, verification and remaining limitations. Coordinate shared files such as `ui/Dashboard.tsx` and the scientific core before editing them concurrently. Keep the authoritative source in this repository; dependencies and generated builds are local.

Useful workstreams for the team are:

- **Research review:** independently check source mappings and claim qualifications, preserving locators and disagreements. Separate development examples from any later blinded comparison.
- **Product workflow:** improve guided tasks and historical evidence preservation, with narrow-screen and keyboard checks.
- **Core reliability:** protect scientific scope, source identity, exact arithmetic and revision/session behavior with consequential counterexamples.

## Sharing boundaries

The owner explicitly authorized this GitHub source handoff on 15 November 2026. Website deployment, competition submission and outreach remain separate actions. No new provider use or billing change is implied.

Do not commit credentials, `.env` files, private evaluation state, mailbox exports, raw third-party downloads, `node_modules`, build caches or local review ZIPs. The reviewed public figure-code ZIP is a specific exception: it contains our script, derived figure inputs, pins and manifest, not private data or third-party source binaries. Safe empty `.env.example` defaults are included. [Source rights](web/docs/SOURCE_RIGHTS.md) and [AI/preparation disclosure](web/docs/AI_DISCLOSURE.md) remain applicable. No repository-wide original-code license is assigned by this push.

Current and historical UI previews and dated research reports are included. Historical reports can link `_raw/` evidence or local ZIPs that are intentionally absent from GitHub; their absence is not evidence that those measurements were rerun by a teammate. See the pinned public source links and retained SHA-256 identities in the reports.
