# Dissertation evidence and tracked-position calculations

15 November 2026. Local technical extension `trajectory-ops-2026-11-15.1`; the running application remains `web-2026-11-15.9`. The owner assigned UI work to a teammate. This change adds a factual source dossier, a small pure library/CLI and scientific verification. It adds no application route or UI.

The supplied dissertation resolves an access gap and exposes several limits that matter before building a predictive model. The useful addition is a reproducible calculation on explicitly supplied tracked coordinates, with exact frame timing and optional worst-case position-error bounds. It is not a new flame model, a reconstruction of the thesis experiments or a claim of better performance than competitors.

## Source identity and review scope

Christina Liveretou, [*Effect of Pressure and External Heating on Microgravity and Earth Gravity Fires*](https://escholarship.org/uc/item/5px3896h), UC Berkeley mechanical-engineering PhD dissertation, Summer 2025. The institutional cover lists 1 August 2025. The supplied file has 96 PDF pages, 26,721,273 bytes and SHA-256 `f64dbd7ad0e23e79a5ab2fd686ec858a0e4a5ce31240552760db11c6ff978a6b`.

The full PDF was acquired and text-extracted. Chapters 3–6, PDF 45–85 / printed 33–73, were read. Review also covered the outline, Chapter 2 methods/results excerpts, relevant references and appendix captions. Printed Tables 1–3, the quadratic-fit method and example, and the two differing buoyancy expressions were checked in page images. This is a focused technical review, not a claim that every introductory/background page received a full scientific audit. No graph was digitized. No raw trajectory export or run-level data archive was acquired; a failed text search for a repository is not proof none exists.

No redistribution license was established. The PDF and rendered pages remain local. The [separate factual dossier](../data/trajectory-studies/liveretou2025.json) records locators, source roles and unresolved issues; it does not alter registry r2 or the earlier source collections. The journal version of Chapter 3 has not been compared page by page with the thesis.

## Findings and their consequences

| Finding | Location | Consequence for IGNIS |
|---|---|---|
| Chapters 3 and 4 explicitly reuse the same experiments. | PDF 30 / printed 18 | Treat their oxygen, position and rate results as related measurements/derivations. Separate chapters are not replication; actual experimental units still require run identities. |
| Ground repeats are reported as 3–5; microgravity conditions have 1–2 tests. Exact per-condition membership is absent. | PDF 49 / printed 37 | Thousands of frames do not supply thousands of independent training or validation units. Do not split the same burn across train/test sets. |
| Rod tests deplete oxygen in recirculating chambers, with occasional venting to control pressure. The outline explicitly says no external radiation for Chapter 3. | PDF 30, 47–48 / printed 18, 35–36 | Do not use a fixed closed-vessel oxygen inventory or borrow LIV24's imposed-radiation settings. Ground and flight chamber volumes also differ, 105 versus 100 L. |
| Chapter 3 defines its LOC by visual flame extinction; Figure 15 dots mark the end of the spreading phase. | PDF 46, 50 / printed 34, 38 | Those labels refer to different events. Keep spread cessation, visual extinction and fuel regression separate. |
| Generic initial-air/21% descriptions coexist with explicitly lower microgravity starts and elevated ground starts at 40/60 kPa. | PDF 46–47, 50, 60–61, 65–66 | Preserve the exceptions and unknown per-run values. C-31 records why no universal initial 21% is assigned. |
| Figure 14 starts at sample lowering, after ignition; Figure 15 starts at ignition. | PDF 49–50 / printed 37–38 | Same displayed time is not a verified common physical instant. Secants are origin-invariant, but oxygen/position joins require the missing alignment offset. |
| The video is 30 fps and oxygen is recorded at 1 Hz. | PDF 62 / printed 50 | Preserve acquisition frame indices and rational frame rate. Do not turn interpolated oxygen into new independent measurements. |
| Rates are derivatives of separate quadratic position fits for selected spreading/regression phases. Figure 21's presentation smoothing is explicitly separate. | PDF 62–63 / printed 50–51 | Linear rate-versus-time shape follows from the fit family. Position R² does not itself validate derivatives. This finding does not show that the source rates are wrong. |
| Mean heat-release values are calculated from oxygen depletion. | Table 1, PDF 51 / printed 39 | They are useful source summaries, but not independent calorimeter validation of the same oxygen signal. Do not infer total energy without durations. |
| Thin-sheet results use concurrent upward spread, different geometry, flow and observation windows. | Chapter 5, PDF 72–83 / printed 60–71 | Keep them separate from the opposed rod tests. Tables 2–3 contain approximate correlation exponents, not additional raw trials. |

### Printed heat-release summaries

These eight values are transcribed as printed, in **kW**, averaged from ignition to visual extinction. They are condition summaries derived by the author, not individual runs or newly executed model outputs.

| Pressure, kPa | Microgravity, kW | Earth gravity, kW |
|---:|---:|---:|
| 40 | 0.53 | 0.18 |
| 60 | 0.90 | 0.39 |
| 80 | 1.24 | 0.61 |
| 100 | 1.89 | 0.85 |

Table 1 does not provide uncertainty, per-run membership or durations for these entries. The calculation uses approximately 13.1 kJ per gram of consumed oxygen. Reconstructing the values would require the underlying signals, durations and gas-management accounting; that reconstruction is **NOT RUN**. The separate Chapter 5 discusses both mass-loss and oxygen-consumption HRR methods. That description does not make Chapter 3's table an independent two-instrument validation.

### Unresolved pressure and equation differences

Chapter 3, PDF 51/57, reports a higher visual-extinction oxygen fraction at lower pressure. NASA's [FY2026 MIST Task Book summary](https://taskbook.nasaprs.com/tbp/index.cfm?TASKID=A4E891655E49E9A6A0353DF3D9B4DE14&action=public_query_taskbook_content) reports lower spread/regression limits at lower pressure. C-30 preserves the difference. The available material does not establish identical runs, endpoints or analysis versions, nor identify its cause. A universal pressure rule is withheld. This also means the earlier open-versus-recirculating protocol contrast cannot explain the discrepancy by itself.

Equation 23, PDF 68 / printed 56, places `g` outside the square root; the expression on PDF 53 / printed 41 places it inside. If `g` denotes dimensional gravitational acceleration, the first arrangement does not have velocity dimensions, while the second does. C-32 records this printed difference without silently correcting or executing either expression. This narrow check is not a conclusion that the author's experimental findings are invalid.

## Mathematical interpretation

For a fitted quadratic position `x(t) = a t² + b t + c`, its derivative is `2 a t + b`. Three or more distinct sampling times identify the quadratic coefficients in ordinary full-rank least squares. The concern is adequacy of that restricted family as a representation of motion, not failure to identify its own coefficients. The reported position-fit criterion, R² ≥ 0.94, and appendix example R² = 0.992 do not separately test rate accuracy or prove constant physical acceleration.

A small illustrative counterexample makes the logical limit clear: at times 0, 1, 2 and 3 seconds, let `f(t) = 3t − t²/2` and `g(t) = f(t) + t(t−1)(t−2)(t−3)/2`, with consistent mm/s units for the coefficients. The sampled positions agree exactly; at one second their derivatives are 2 and 3 mm/s. The second curve is **outside** the quadratic family and is not proposed as a physical flame trajectory. This is a standard sampling fact, included as documentation and a unit test, not an API feature or new scientific discovery. Additional defensible regularity assumptions, model checks or derivative measurements could constrain the alternatives.

Chapter 5's pressure exponents need a similar restriction. Under an **idealized exact** normoxic design `P X = P0 X0`, a power-law family

`V = C (P/P0)^a (X/X0)^b`

reduces along that curve to `V = C (P/P0)^(a−b)`. The along-curve exponent alone separates neither fixed-oxygen pressure response nor fixed-pressure oxygen response. This is a mathematical illustration, not a fit to the thesis. Its printed nominal pairs are rounded: 80 kPa × 26.2%, 90 kPa × 23.2%, and 100 kPa × 21% give 20.96, 20.88 and 21 kPa. We therefore do **not** claim exact rank deficiency for those rounded coordinates or for unknown measured trajectories. Oxygen also changes during burning. No correlation is executed as a predictor.

## Local calculation contract

The pure function is [calculateTrajectory](../src/core/trajectory.ts). The CLI is [calculate-trajectory.ts](../scripts/calculate-trajectory.ts). The input is strict JSON:

- `schemaVersion: "ignis-trajectory-request-1"`, `dataRole: "hypothetical"` or `"user_supplied_unverified"`; one supplied `runId`, `phaseId` and nullable lineage description.
- Explicit `positionUnit: "mm"`, `timeUnit: "s"`, and nullable descriptions of the tracked feature, positive axis, spatial calibration, time origin and phase selection. These descriptions are retained, not certified.
- Between 2 and 32 uniquely identified, strictly time-ordered samples. Coordinates are signed decimal strings, up to five integer and six fractional digits; absolute position-error bounds are nonnegative decimal strings or null.
- Time mode is either `rational_seconds` with integer or `numerator/denominator` strings, or `video_frames` with acquisition-frame indices and a positive rational frame rate. Integer components are bounded to nine digits. Decimal seconds are intentionally rejected; use `1/30`, for example. A reported frame rate is not evidence of perfect clock timing or no dropped frames.
- Up to 32 named windows reference two existing sample IDs in forward time order. No implicit sorting, averaging of duplicate times, cross-phase join or truncation is performed. CLI input is capped at 32 KiB.

For each window, the output contains exact elapsed time, displacement and `s = (y_j − y_i)/(t_j − t_i)` in mm/s. This is **net displacement over elapsed time of the tracked coordinate**. It is not assigned to an instantaneous time or relabeled as fuel consumption, physical flame spread or regression. Interpreting it as an average of a physical velocity would need suitable continuity/regularity and a stable, defined tracked feature; a thresholded image feature can jump.

By default, `measurementAssumptions` is null and no error interval is calculated. Explicit opt-in requires exact timestamps, absolute position bounds and the same tracked feature/coordinate system. All contract descriptions and both endpoint bounds must be present. With endpoint bounds `e_i,e_j`, the conditional interval is:

`[(y_j−y_i−e_i−e_j)/(t_j−t_i), (y_j−y_i+e_i+e_j)/(t_j−t_i)]`.

This is a worst-case interval under **asserted** bounds. It requires no probabilistic independence assumption and is not a confidence interval. Scale/calibration errors must already be covered by the asserted bounds; a common position offset cancels, so the separate-bound calculation can be conservative. Time error is not estimated. Smaller elapsed time increases the bound half-width. Shared window endpoints are listed to expose dependent errors; their intervals are not pooled. Neither a positive secant nor a wholly positive interval rules out within-window reversal.

All results, including those with complete metadata, retain `measurementValidated: false`. Labels and field presence do not establish validity. No polynomial is fitted, source trajectory inferred, oxygen signal aligned, physical limit predicted or safety decision made.

### Reproduce the constructed example

From `web/`:

```sh
npm run calculate:trajectory -- --example
npm run calculate:trajectory -- --input artifacts/trajectory/hypothetical-request.json
```

The first command leaves bounds off. The [saved request](../artifacts/trajectory/hypothetical-request.json) opts into stated hypothetical bounds. Its [saved result](../artifacts/trajectory/hypothetical-result.json) contains:

| Constructed window | Elapsed, s | Displacement, mm | Net displacement / elapsed, mm/s | Conditional interval, mm/s |
|---|---:|---:|---:|---:|
| Frame 0 → 1 at 30 fps | 1/30 | 0.1 | 3 | [−3, 9] |
| Frame 0 → 30 at 30 fps | 1 | 2.5 | 2.5 | [2.3, 2.7] |

Each endpoint has an asserted 0.1 mm absolute bound. These numbers are constructed, not measured; the comparison does not select an optimal measurement window or show that rates are constant.

From the repository root:

```sh
python -I research/analysis/verify_trajectory.py web/artifacts/trajectory/hypothetical-result.json
```

Add `--pdf /path/to/dissertation.pdf` for original-file identity and printed-text anchors. That optional operation needs PyMuPDF. Without the PDF, source-file checking is marked **NOT RUN**. The [verification receipt](../artifacts/trajectory/verification.json) records the executed check. The Python implementation enumerates endpoint-error corners using Fraction arithmetic; it shares AI-assisted authorship and is not independent scientific validation.

## Relationship to professional tools and the next evidence needed

Berkeley's [software page](https://firelab.berkeley.edu/software/) identifies Flame Tracker as a community video-analysis tool. Its official [manual-tracking documentation](https://github.com/combustionTools/flameTracker/wiki/3.-Manual-Tracking) supports frame selection, axis direction and CSV export of tracked locations and rates. IGNIS should complement that acquisition workflow. This patch does not add video tracking, a native CSV adapter or a comparison against Flame Tracker's implementation. Its small JSON contract accepts explicitly selected coordinates after the operator supplies their units and provenance. Actual acquisition-frame numbers must survive frame skipping.

For a serious predictive study, the missing inputs remain original tracked-position exports, camera calibration/tracking configuration, synchronized oxygen/pressure/venting records, run and specimen identities, actual initial conditions, exact phase/event definitions and an uncertainty model. Reference trials must be separated by the relevant experiment/campaign dependencies; adjacent frames and thesis chapters are not independent holdouts. A simple baseline and grouped evaluation should precede a complex ML model. The dissertation suggests future ML in its conclusion, but supplies no validated learned model for IGNIS to adopt here.

Still-unread full papers of direct interest are [Rivera, Fire Safety Journal 2026, 104719](https://doi.org/10.1016/j.firesaf.2026.104719) and [Rivera, PROCI 2026, 106460](https://doi.org/10.1016/j.proci.2026.106460). The supplied dissertation is now acquired and should no longer be listed as inaccessible. No author/organizer outreach has been made.

## Executed checks and assistance

All **416 shared offline checks pass**, including 26 new trajectory tests with a direct enumeration of 81 endpoint-error boxes, exact frame/rational agreement, translations/scaling, shared endpoints, missing bounds and malformed inputs. TypeScript and ESLint pass. Ten CLI/source/live-identity checks pass, including byte/encoding/schema rejection and unchanged identity of all 19 previous source collections. Python verification agrees, checks 19 printed PDF anchors and rejects four corrupted reports. The PDF table/method/equation visual checks are separate from the automated text anchors.

No new Next build or browser/visual review was run: the served application entry points are unchanged and its existing build .9 remains running. Physical experiments, source-data reconstruction, learned models, independent human validation, comparative researcher trials, runtime inference, deployment, submission and NASA adoption are **NOT RUN**. This work does not establish competitive superiority.

Fable 5.2 ran through the user's signed-in Claude Code account as a tool-free helper. It received public dissertation facts and proposed mathematics, not the PDF, application source, private project/evaluation material or credentials. The completed call took 107.923 s and reported a $0.4459578 list-price estimate, not an invoice or runtime-evaluation charge. No permission denials occurred. Its review prompted rational frame timing, a smaller CLI/library scope, clear set-bound semantics and separation of fit-family identification from model adequacy. We did not implement its optional regularity-based instantaneous-rate bound or promote its review to independent validation.
