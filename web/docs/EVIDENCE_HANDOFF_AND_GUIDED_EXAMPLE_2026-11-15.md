# Guided scientific example and historical evidence handoff

15 November 2026. Build `web-2026-11-15.6`, engine .5, renderer .5, descriptive analysis .2. These changes address two observed competitive gaps: presenting a complete research task and preserving historical evidence in one file. They do not establish an overall competitive lead or independent scientific validation.

## What changed

- **Computed walkthrough:** `/example`, also available from Explore and the navigation, follows the SAME pooled/flight cutoff contrast. Displayed ranges, denominators, missing-reading bounds and conclusions come from `buildResearchAnalysis`. Switching independent [1,3] V ranges to [0,5] V changes the result. The exact selection transfers to Smoke lab or a confirmed brief; source cells and the selected analysis are downloadable. The ranges are analyst choices, not calibrated alarm thresholds or confidence intervals.
- **Single-file package:** the notebook downloads original assessments, the version-1 session and five normalized collections: registry, conditions, detectors, atlas and research opportunities. The full detector collection includes reference and unselected rows. Checksums, typed receipt correspondence, selected evidence membership and source-digest bindings are checked. Registry/conditions/detectors use their existing admission rules; atlas/opportunities retain opaque records behind version/identity checks. Internal consistency does not establish that extraction or interpretation is correct.
- **Historical/current separation:** imports show file-stated claims and qualifications, saved collection identities, current source/method/result checks and changed top-level payload fields. Result changes without source or method fingerprint changes are flagged. Only recomputed assessments load. Failed current recomputation leaves the historical view and original download available; no partial history loads.
- **Reliable file handling:** original-package downloads retain imported bytes, including BOM/whitespace. Exporting current work keeps an already-open review. Requests have a 30-second timeout and visible cancellation; older completions cannot replace newer selections. Packages are downloaded only, capped at 8 MiB and 16 assessments. Serialized session downloads/browser saves remain capped at 2 MiB. Smaller histories may hit the byte cap; no truncation occurs.
- **Export protection:** multiline questions cannot add Markdown report headings. Invalid creation timestamps are rejected. Renderer .5 records this change, so old receipts can report method drift. The atmosphere overlap count now comes from source context rather than a fixed word.

Packages do **not** include original NASA binaries or historical engine code. They preserve normalized data and original result payloads and compare them with the current installation; they do not rerun an old engine against embedded collections. A forger can update every checksum. Historical content is displayed as escaped text, not rendered Markdown or executable content.

## Claude helper: actual execution

The owner specifically approved the five files named in D-064. Two tool-free CLI reviews completed on **Claude Fable 5.2**, using the existing signed-in Claude Pro subscription. No repository browsing, shell/network tools, credentials or private evaluation material were enabled for the helper.

| Review | Observed model | CLI duration | Reported usage | CLI list-price estimate |
| --- | --- | --- | --- | --- |
| Design | `claude-fable-5-2` | 143.160 s | 2 input + 18,777 cache-creation + 649 cache-read; 12,904 output, including 9,199 thinking | $0.8167378 |
| Implementation | `claude-fable-5-2` | 211.308 s | 2 input + 18,388 cache-creation + 3,069 cache-read; 19,965 output, including 17,955 thinking | $1.0934378 |

Total CLI list-price estimate: **$1.9101756**. This is not a verified invoice or a claim that subscription usage incurred that charge. These development reviews are separate from bounded runtime interpretation experiments; their counters and acceptance status were not reset.

Claude's initial advice led to the separate wrapper, opaque originals, unavailable-current handling and full payload comparison. Its second review identified original-download serialization and stalled-request defects; both were fixed. Output-size checking already existed on the package server, then was strengthened for the browser and lightweight sessions. The Markdown issue was reproduced and fixed. Legacy receipts remain compatible and explicitly disclose that they cannot compare every original presentation field. A second model is not an independent scientific reviewer.

Exact prompts, responses and receipts remain local in `_raw/claude_helper_2026-11-15/`, excluded from Git.

## Competitive effect

The public-head refresh at 09:39 UTC found VESTA at `c5ca71deb825e97c7eb5b9d9dd3c090a6c660330` and PYRION at `e438171995aa990ea8d54a8840c5cae53021cefe`. VESTA's [historical collection replay](https://github.com/itzjk/vesta/blob/c5ca71deb825e97c7eb5b9d9dd3c090a6c660330/web/js/core/replay.js) and PYRION's [computed example](https://github.com/Lucyyngceo/pyrion/blob/e438171995aa990ea8d54a8840c5cae53021cefe/web/app/example/page.tsx) are substantive capabilities. IGNIS now addresses those gaps with its own bounded scientific task; parity across every workflow is not claimed.

The improved path connects a question, an assumption-sensitive result, retained historical evidence and a current recheck. Broader planning, accepted live interpretation, independent source review and measured researcher benefit remain gaps. No competitor runtime, new physics model, held-out user study or NASA adoption test was executed in this patch.

## Verification

Final status: **327 offline checks pass; 61 browser checks pass and one duplicate is skipped** across desktop and mobile, using the full run plus affected rerun. TypeScript, lint and production build pass. Six new visual states are clean. A real catalogue-readiness race found during the final browser run was repaired and covered by deliberate latency testing.

Final results are recorded in [local verification](LOCAL_VERIFICATION_2026-11-15.md). The first implementation passed 325 offline checks. Its first browser pass had 55 passes, one intentional duplicate skip and two incorrect new-test heading selectors; those two passed after correction. Subsequent Claude-review fixes received fresh verification. All 17 curated files retain the handoff's exact bytes; catalogue r2 is unchanged.

Preview: [worked example](http://127.0.0.1:3000/example), [desktop example](../artifacts/previews/evidence-handoff/desktop-example.png), [mobile package](../artifacts/previews/evidence-handoff/mobile-package.png).
