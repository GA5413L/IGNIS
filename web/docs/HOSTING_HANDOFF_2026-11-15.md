# Hosting handoff — 15 November 2026

**Recommended first attempt: Vercel Hobby, using the existing Next.js application with SI disabled.** This avoids a new runtime adapter and uses the Node 22 family already tested locally. Hobby is free within its limits; its terms restrict use to personal or non-commercial projects. This recommendation assumes the owner can use an eligible account and authorize access to the repository. No hosting account, deployment, custom domain or public URL was created or verified by this review. [Hobby plan](https://vercel.com/docs/plans/hobby), [Hobby terms, section 4](https://vercel.com/legal/terms).

## Exact Vercel import settings

Sign in to the owner's Vercel account, choose **Add New → Project**, and import **GA5413L/IGNIS** through GitHub. Select the branch containing the final reviewed changes and confirm the commit before deploying. Account sign-in and GitHub repository authorization remain owner steps; no CLI installation is necessary for this dashboard path.

| Setting | Value |
|---|---|
| Plan | Hobby; no paid upgrade or add-on required for this attempt |
| Framework preset | Next.js |
| Root directory | `web` |
| Install command | `npm ci` |
| Build command | `npm run build` — retains `next build --webpack` |
| Output directory | Next.js default; leave override disabled |
| Node.js version | `22.x`; verify the build log reports Node 22.13 or newer |
| Application secrets | None |
| Optional explicit disabled flags | `AI_ENABLED=false`, `CF_SI_ENABLED=false` |
| Start command | Not configured on Vercel; its Next.js integration serves the build |

Vercel supports a separate root directory and detects Next.js build/output settings. Keep the committed lockfile and install development dependencies needed by the build. Do not select a static-site preset or substitute `next export`. [Build settings](https://vercel.com/docs/builds/configure-a-build).

The root agent has now pinned `web/package.json` and the lockfile root metadata to `>=22.13.0 <23`, with `web/.nvmrc` set to `22`. This matters: Vercel gives the package engine range precedence over the dashboard choice, and an open-ended `>=22.13.0` can select a newer major. Vercel rolls minor/patch updates, so exact local/cloud patch equality is not promised. [Node version selection](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

For a private repository, check the account/commit-author requirements before spending time on build debugging. Hobby cannot import a private repository owned by a GitHub organization; its private-repository deployment checks also require the appropriate owner/commit-author association. Do not change repository visibility merely to work around this. [Git deployment rules](https://vercel.com/docs/git#using-hobby-teams).

## What the source inspection establishes

- **SQLite import versus persistence:** [the gateway store](../src/server/gateway/store.ts) imports `DatabaseSync`, but opens a database only inside its constructor. [The gateway handler](../src/server/gateway/handler.ts) returns before constructing that store when readiness fails. Both accepted-provider lists are empty; defaults disable SI. Node 22.13 made `node:sqlite` available without the enabling flag, and Vercel's Node runtime exposes Node APIs. An import is therefore supported by the documented runtime; an actual Vercel startup has not been observed. [Node 22.13 documentation](https://nodejs.org/download/release/v22.13.0/docs/api/cli.html#--no-experimental-sqlite), [Vercel Node runtime](https://vercel.com/docs/functions/runtimes/node-js).
- **Do not activate the existing file-backed quota store on Vercel.** Separate serverless instances do not share a permanent local SQLite file. A `/tmp` filename would not satisfy the app's shared durable quota requirement. No database is needed for the current disabled-SI release. [Vercel's SQLite explanation](https://vercel.com/kb/guide/is-sqlite-supported-in-vercel).
- **Application data are inside `web`.** [The registry](../src/core/registry.ts), evidence APIs and scientific operators import their curated JSON directly. The reviewed runtime source has no ordinary `fs.readFile` dependency on `E:`, `F:`, `_raw`, Python or the parent research archive. Those archives remain reproduction dependencies for curators, not requirements to serve the app. Static assets are under `web/public`; this review counted 32 files totalling 2,137,586 bytes.
- **BYOD and notebooks differ.** [LocalData](../src/ui/LocalData.tsx) reads and calculates CSV data in browser memory. [SessionControls](../src/ui/SessionControls.tsx) sends a session/evidence package to the app's server when the user requests recomputation. Neither behavior needs a persistent hosting database. Do not describe every notebook operation as never leaving the browser.
- **Build-time network remains necessary.** `npm ci` downloads dependencies; [the layout](../src/app/layout.tsx) uses `next/font/google`. A clean cloud install/build must still succeed. Npm version URLs could not be inspected through the web retrieval tool; this is an access limitation, not evidence that the locked packages are unavailable.

**Hosted transport bound implemented:** the shared bounded JSON POST utility now caps requests and responses at **4 MiB**, below Vercel's 4.5 MB limit. Package create/recheck routes use that cap; stricter assessment/session input limits remain 2 MiB. Responses are serialized once, measured as UTF-8 and sent only within the bound; an oversized result produces a small 413 error without truncation. The notebook UI checks 4 MiB before fetching, rejects oversized imports before reading them, and downloads compact package JSON so formatting does not push a valid response over the reimport limit. The [core evidence-package library](../src/core/evidencePackage.ts) and browser-only BYOD workbench still support **8 MiB** packages; that is not the hosted notebook limit. This bound covers routes using the shared HTTP wrapper, not an asserted host-wide middleware limit. Public deployment smoke checks remain outstanding. [Function limits](https://vercel.com/docs/functions/limitations#request-body-size).

Focused coverage is in `tests/integration/hostedTransport.test.ts`: exact request/response byte boundaries, UTF-8 response overflow with one serialization and a bounded error, ordinary package create/recheck, and the same valid package accepted locally above 4 MiB but rejected by both hosted routes. `tests/e2e/workbench.spec.ts` adds oversized-import rejection with all API calls blocked. These checks passed in the consolidated 565-test offline and 70-test production-browser runs. [Verification receipt](../artifacts/refinement/verification.json). Hosted-origin validation remains NOT RUN.

## First public checks, then the domain

After the owner deploys, use the actual generated URL and an incognito browser:

1. Open `/` and `/console`; confirm assets, navigation and figures load without login protection.
2. Check `/api/health` returns 200 with the intended build and catalogue digest; `/api/catalog` must match the reviewed local catalogue.
3. Check `/api/si/gateway` reports `available: false` and pending provider evaluation. No secret or provider configuration is needed.
4. Run one structured assessment over HTTPS, export it, and reopen a small session/package. This exercises the actual proxy/origin handling, not just a successful landing page.
5. Run the existing source-identity/browser checks against the deployed origin where practical. A cloud build alone does not verify scientific data identity.

Vercel supplies a `vercel.app` address. Establish that working URL first. The owner has designated `ignisatlas.earth`; hosting account choice is still under discussion, and no DNS configuration or public deployment is verified here. After the chosen host works, use **Project Settings → Domains → Add Existing**, enter that domain, and copy the exact DNS records Vercel supplies to its current DNS provider. Do not purchase or transfer the domain, guess fixed DNS values, or delay sharing a working generated URL while DNS propagates. [Domain setup](https://vercel.com/docs/domains/working-with-domains/add-a-domain).

## Cloudflare/OpenNext fallback: feasible, not yet verified

An adapter can preserve this Next.js UI. OpenNext **1.20.17**, release commit **`0e007b3`**, declares `next: >=15.5.29 <16 || >=16.4.5`; IGNIS **16.4.6** satisfies that range. Its dependency on `@opennextjs/aws` is 4.1.16. This establishes declared compatibility, not a successful IGNIS Worker build. [Pinned adapter package](https://raw.githubusercontent.com/opennextjs/opennextjs-cloudflare/0e007b3/packages/cloudflare/package.json), [supported features](https://opennext.js.org/cloudflare).

Cloudflare enables a `node:sqlite` **stub** for appropriate compatibility dates from 2026-01-29. The inspected `workerd` implementation exports `DatabaseSync` and throws only when it is constructed. Thus the disabled gateway's import is not, by itself, a demonstrated startup blocker. Its real database operations remain unsupported. This is a source-level inference; no Worker was run. [Compatibility flag](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#enable-nodesqlite-module), [runtime implementation](https://raw.githubusercontent.com/cloudflare/workerd/main/src/node/sqlite.ts).

A **20-minute timeboxed attempt is plausible, not a completion estimate**: install the pinned adapter plus compatible Wrangler, add minimal adapter/Worker configuration, retain webpack, build `.open-next/worker.js` and `.open-next/assets`, then smoke-test in `workerd`. Leave SI off and avoid adding R2/database services for this attempt. The required output includes assets and supporting modules, not simply a renamed Next server file. [Adapter setup](https://opennext.js.org/cloudflare/get-started).

Stop that attempt if the runtime fails, packaging requires unsupported publisher bindings, or the no-purchase deployment exceeds its size allowance. Direct Workers Free has a 3 MiB compressed Worker limit; this app's generated Worker size is unknown. The Sites publisher's managed-account limits and ability to preserve compatibility date, Node imports, `ASSETS` and any required self-reference binding must be checked separately. No adapter installation, conversion, Docker file or deployment configuration was added by this review. [OpenNext size troubleshooting](https://opennext.js.org/cloudflare/troubleshooting).
