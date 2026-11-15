# Build and verification status

The application remains **web-2026-11-15.13**, with landing page `/` and eight console sections at `/console`. The floating SI chat replaces the former dedicated SI page. Current catalogue search works without provider credentials; live interpretation remains disabled.

## Executed before this cleanup

| Verification | Recorded result and scope |
| --- | --- |
| Shared offline suite | 568 tests passed after the staging-token diagnostic patch on 15 November. Private provider evaluation fixtures are excluded from `test:team`. |
| Final navigation/chat browser pass | 26 desktop/mobile tests passed after removal of the dedicated SI page: remaining views, legacy redirects, chat confirmation with mocked transport, citations and figure exports. |
| Production compilation | Affected-file lint, TypeScript and webpack build passed with that UI update. |
| Portable start command | `npm start` was checked with `PORT=3101`; `/api/health` returned `ok`. |
| Source identity | Earlier source/server/browser checks and arithmetic receipts remain in the [research artifacts](../artifacts/). These describe their original dated scope. |

These are software and arithmetic checks. They do not establish independent scientific validity, physical prediction accuracy or external deployment success. Actual provider evaluation remains incomplete and unaccepted; see [SI preparation](SI_PREPARATION.md).

## Repository housekeeping on 16 November

The owner requested removal of obsolete internal documents and historical UI previews, plus a clearer README with existing figures and new screenshots. Application code, scientific data, scripts, tests, public assets, dependency manifests and runtime configuration are preserved against the [baseline commit](https://github.com/GA5413L/IGNIS/tree/6dc8f5e0c1bc9c1202e70b803c9e26f202f9cdd5).

The cleanup verification record is [repository-cleanup.json](repository-cleanup.json). It reports byte comparisons and documentation checks; it does not relabel earlier test results as a new full execution. No new provider inference, feature development or deployment is part of this housekeeping.

Old screenshot and internal-report paths in historical verification receipts belong to their original snapshots and remain available through Git history. See [PROJECT_RECORD.md](../../PROJECT_RECORD.md) for preparation reuse, submission status and maintenance dates.
