# Exact experimental-design audit and technical handoff

**Later access update, 15 November:** the owner supplied LIV24's full accepted manuscript. It is now read and integrated in the separate [endpoint/protocol audit](ENDPOINT_PROTOCOL_AUDIT_2026-11-15.md); the request below for that full text is historical. RIES24 mathematics and source data are unchanged.

15 November 2026. Build `web-2026-11-15.8`; method `design-audit-2026-11-15.1`. The owner transferred UI work to a teammate. This continuation changes the scientific backend, API, CLI, tests and documentation; it makes no component, style or layout changes.

IGNIS can now distinguish being inside published parameter ranges from having joint experimental support, and show exact coefficient directions that the reported design cannot distinguish. This is a response-free identifiability calculation, not a flame-spread predictor. It adds a concrete mathematical question to the existing provenance and sensitivity work. No claim of a new theorem, exclusive competitor capability, SOTA performance or NASA adoption is established.

## Full-text source and measurement definition

The owner supplied the publisher PDF of Ries, Eigenbrod and Meyer, [*Effect of oxygen concentration, pressure, and opposed flow velocity on the flame spread along thin PMMA sheets*](https://doi.org/10.1016/j.proci.2024.105358), Proceedings of the Combustion Institute 40 (2024), 105358. This closes the earlier abstract-only access gap. Seven pages, 2,105,330 bytes; SHA-256 `3c4fa8278cae1da73bc15a4b5443d927006a8150b3d8a83d4c79582f127008f2`. The article states CC BY; its PDF is kept locally, not redistributed here. The [separate source collection](../data/design-studies/ries2024.json) contains factual transcription and assistant-authored interpretation. It is outside the frozen r2 registry and IE-1 packet.

The study uses 0.2 mm cast PMMA sheets and a short microgravity drop. The measured endpoint is the propagation of a pyrolysis-front marker: first IR pixel strictly above 603 K, scanned from the side away from the igniter, across 11 lines spaced 1.9 mm apart. The reported rate comes from regression of mean position over 3–7 s (page 3). A visible flame-edge speed from a camera is not automatically the same quantity. Flow is calculated from metered mass flows, pressure and channel area (page 2), rather than measured as the local velocity at the front.

Section 2.2 (page 4) is the essential provenance: airflow is varied from 30 to 200 mm/s only at 35.4% oxygen and 60 kPa; other microgravity conditions use 100 mm/s. Table 1 has 12 X cells and one O cell representing a flow range. It does not enumerate each flow run. Generally one experiment is performed per parameter; error bars describe within-experiment variation, not between-run replication.

**Unresolved source discrepancy:** Table 1 prints several oxygen-series cells at 70 kPa, while Figure 6 describes a 75 kPa series. Figure 3 also describes a 35.4% / 75 kPa / 100 mm/s condition absent from the printed X matrix. The original values are preserved; no 70-to-75 correction or invented run list is made. Either pressure interpretation leaves those conditions on the 100 mm/s plane, so it does not change the proof below. See `RIES24-C01` and [source conflict C-28](../../research/source_conflicts.md).

The authors also use 1g data, with an assumed 200 mm/s flow in Figure 10. Those points are excluded from this microgravity-design certificate. The certificate does not describe all data behind the combined published correlation, refute that correlation, or determine identifiability within the authors' chosen family.

## The mathematical result

Write oxygen volume percent as x, pressure in kPa as p, and inflow in mm/s as u. Section 2.2 puts the reported nominal microgravity design inside

`S = {u = 100} union {x = 35.4, p = 60, 30 <= u <= 200}`.

The whole plane is an **outer bound on support**, not a filled measurement surface. Actual listed conditions are sparse. Marginal ranges are x in [21,35.4], p in [60,101.3] and u in [30,200]; passing all three range checks is weaker than belonging to S.

Define dimensionless centered coordinates:

`a = x/35.4 - 1`, `b = p/60 - 1`, `c = u/100 - 1`.

For any **specified, fixed baseline** f0, consider the declared two-parameter augmentation

`f_theta = f0 + theta_1*a*c + theta_2*b*c`.

On the fixed-flow plane c=0. On the flow-sweep line a=b=0. Both added terms therefore vanish everywhere on S, including any subset of its flow velocities. Consequently all theta values produce the same values at the reported nominal design: at least these two coefficient directions cannot be identified by those measurements alone. Even additional noiseless repeats at the same nominal coordinates would not change this rank. This is a statement about distinguishability in the declared family, not evidence that either added term exists physically.

The same issue remains for larger families. The implementation also checks `[a*c, b*c, a*c^2, b*c^2, a*b*c]`: all five directions vanish on S. Still larger invisible families exist. A flexible ML model can select an extrapolation through its assumptions or training elsewhere; the same on-design responses alone cannot distinguish these competing deviations. A reported fit score cannot test a term that vanishes at every training coordinate. No new fit score or physical output is calculated here.

The result assumes exact **reported nominal** coordinates. Realized coordinate errors require a separate measurement-error and conditioning analysis; a tiny nonzero leverage is not automatically useful precision. The tool intentionally reports exact rank without a floating-point tolerance and makes no conditioning estimate. Its fixed center is the intersection of the plane and line; it is not a tunable parameter.

## What additional coordinates establish, conditionally

The bundled example contains two **hypothetical algebraic coordinates**, not a recommended protocol or safe atmosphere:

| Coordinate (oxygen %, kPa, mm/s) | a*c | b*c | Source support |
|---|---:|---:|---|
| (28.3, 60, 50) | 71/708 | 0 | Inside each marginal range, outside the reported joint support |
| (35.4, 75, 50) | 0 | -1/8 | Inside each marginal range, outside the reported joint support |

The two-term matrix has rank 2. The five-term matrix has rank 2 and nullity 3. Thus the example distinguishes two declared coefficients only if the baseline and measurement operator are held fixed; it leaves a broader class unresolved. The two-term class is just identified: any two scalar residuals could fit it, with no additional distinct-coordinate compatibility constraint. No candidate responses have been measured. An endpoint might cease to exist under another condition, requiring censored-response treatment instead of a scalar rate.

The API reports `distinctCoordinateResponseConstraints = unique coordinates - rank`. This is an algebraic count conditional on a fixed baseline, **not statistical residual degrees of freedom**. Duplicate coordinates do not count as new distinct-coordinate checks. Rank does not determine sample size, replication, noise, feasibility, safety, optimality, or validation. Determinant magnitude is not presented as a design-quality score because it changes with coordinate normalization.

## Backend contract for the interface teammate

No interface has been added. The separate module does not change existing assessments, scenario URLs, evidence-package schema, engine .5, renderer .5, descriptive method .2 or the r2 digest.

- `GET /api/design-audit`: source snapshot, method, request limits and an example request. Queries are rejected.
- `POST /api/design-audit`: returns a complete detached JSON certificate, exact rational matrices/RREF/nullspaces, source locators, unresolved conflict, support classification and limitations. No upstream calls or credentials.
- `npm run audit:design -- --example`: prints the same two-point certificate. `--input request.json` accepts a bounded request file.
- Request cap: 16,384 bytes, 32 candidate coordinates. Only this study and microgravity scope are admitted. Coordinates are **decimal strings** in explicit field-name units, with at most five integer and six fractional digits. Exponents, whitespace, JSON numbers, unknown fields, duplicate IDs and unsupported gravity/study values are rejected. Repeated coordinates with distinct IDs are allowed and reported.

```json
{
  "schemaVersion": "ignis-design-audit-request-1",
  "studyId": "RIES24",
  "gravity": "microgravity",
  "candidates": [
    { "id": "A", "oxygenVolPercent": "28.3", "pressureKPa": "60", "flowMmS": "50" },
    { "id": "B", "oxygenVolPercent": "35.4", "pressureKPa": "75", "flowMmS": "50" }
  ]
}
```

The software input caps (oxygen <=100%, pressure <=2000 kPa, flow <=10000 mm/s) bound parsing only. They are not study validity or safety limits. `0.354` means 0.354 volume percent, not an automatically converted mole fraction. Every submitted point remains `hypothetical_coordinate_only` even if it matches a printed condition. The source has no response table in this module; `exactFlowSweepRunConfirmed` and `measurementAvailableInThisModule` remain false. Matching an X cell reports source membership with the pressure conflict attached. Lack of an X match does not prove a run never occurred.

Keep these distinctions visible in any future interface: marginal range vs joint support; outer support vs listed condition; reported coordinates vs hypothetical proposals; two-term vs larger-class rank; nominal algebra vs physical validation. Do not relabel a rank gain as a recommended experiment or information gain. Existing evidence exports do not automatically include this new standalone certificate.

## Reproduction and evaluation

The [generated two-point certificate](../artifacts/design-audit/RIES24-two-point-certificate.json) and [verification receipt](../artifacts/design-audit/RIES24-verification.json) are included. Use `npm run --silent audit:design -- --example` to generate JSON without npm's script banner. On Windows PowerShell, save with `Set-Content -Encoding utf8`; the Python verifier accepts a UTF-8 BOM.

From the repository root:

```sh
python -I research/analysis/verify_design_audit.py web/artifacts/design-audit/RIES24-two-point-certificate.json
python -I research/analysis/verify_design_audit.py web/artifacts/design-audit/RIES24-two-point-certificate.json --pdf /path/to/publisher.pdf
```

The arithmetic verifier needs only Python's standard library. `--pdf` additionally needs PyMuPDF and the exact identified PDF. Without it, publisher-file checking is explicitly `NOT RUN`. The verifier recomputes matrices with `Fraction`, obtains rank from Gram principal minors (a different algorithm from the TypeScript row reduction), checks nullspace residuals and verifies vanishing monomial factors. Five deliberate corruptions of rank, matrix, class labels, identification claim and reduced matrix must be rejected. This is a second implementation by the same AI-assisted development process, not independent human validation.

With the supplied PDF, all 12 printed X cells and the O cell match the extraction by text coordinates; the load-bearing fixed-flow sentence is present. No figure points are digitized. New tests cover marginal-box false positives, sparse-plane membership, unknown flow-run enumeration, both pressure interpretations, repeated/collinear proposals, higher-order aliasing, a five-column full-rank counterexample, rational near-center values, nonvanishing negative controls, detached output, incompatible scope and bounded HTTP bodies.

Current checks: **363 shared offline tests pass**, including **36 new design/API checks**; TypeScript and lint pass. The webpack production build and ten production/source checks pass, including byte-value-equivalent production/CLI certificates and unchanged prior source identities; see the [verification addendum](LOCAL_VERIFICATION_2026-11-15.md). Prior UI/browser results remain dated baselines; this backend continuation does not claim a new visual review. The 17 existing curated files are preserved. Provider tests requiring private evaluation state are excluded from the shared suite.

**NOT RUN:** candidate experiments; parameter fitting; physical predictions; measurement-error/conditioning analysis; source-author clarification; independent human review; comparative researcher trial; common-task competitor benchmark; runtime model acceptance; NASA review/adoption. The mathematical method is standard exact linear algebra applied to a traceable source design. Its relative usefulness remains to be measured.

## Technical comparison and next evidence

The [14-project comparison](COMPETITIVE_STRATEGY_AND_VISUAL_REFINEMENT_2026-11-15.md) remains the current pinned audit, not an exhaustive current ranking. The new backend is a concrete capability, not evidence that no other entrant has a similar one.

| Research task | IGNIS now | Remaining gap against observed public tools |
|---|---|---|
| Trace a condition and measurement definition | Source-bound operators, conditions, conflict records and exports | Source/run reconciliation is incomplete across campaigns; provenance also exists in VESTA, MARGIN and Aegis |
| Determine what a design cannot identify | Exact nominal support/rank/nullspace audit for one fully read PMMA paper | One curated study, no arbitrary study importer, no response/noise-aware design optimization |
| Challenge a pooled detector comparison | Paired cutoff sensitivity and exact missing-data bounds | No calibrated alarm task, labeled detector outcomes or prospective validation |
| Measure new experimental observations | No image/video ingestion | Fireline's optical tracking and optional calibration are substantive capabilities; they require endpoint compatibility before reuse |
| Fit and evaluate a physical or ML predictor | No new predictive model accepted | Flamefall, FLARE-X and FireReadiness have implemented model workflows; comparable external-campaign performance is untested |
| Plan and navigate a broad study | Bounded source-specific audit and existing evidence workbench | PYRION and MicroFire have broader planning workflows; researcher task benefit has not been compared |

Prioritize the next technical work by what evidence could change a research decision:

1. **Endpoint and measurement harmonization.** Obtain full methods for spread cessation versus fuel-regression extinction, preserving geometry, gravity and censoring. Do not pool rates merely because all studies use PMMA.
2. **Source/run identity and usable raw observations.** Admit time series or images only with calibrated units/timing, repeated-run identity and a declared measurement operator. Compare simple transparent measurement algorithms before ML.
3. **Group-aware model evaluation if sufficient data become available.** Hold out physical runs/campaigns, preserve calibration ancestry, compare simple baselines and abstention. Additional model complexity alone cannot repair an unidentified experimental design.
4. **Researcher task evaluation.** Compare this audit and an equally informed spreadsheet on the same public source. Predeclare tasks and correctness criteria before timing participants. This has not been executed.

These steps connect combustion/heat transfer, fluid mechanics, thermal metrology, experimental design, inverse problems, statistics and scientific software. No quantum module is justified by the present evidence or task. Award strategy remains Best Use of Science / Best Use of Data as plausible fits, not guaranteed awards. UI work is owned by the teammate.

## Papers still requiring full text

Public publisher previews and institutional searches did not yield inspected full copies in this continuation. The owner offered access; these are the two priority requests, not a claim that no open version exists:

| Paper | Access status | Question the full methods could resolve |
|---|---|---|
| Rivera et al. (2026), [Opposed flame spread limit over PMMA rods in normal and micro gravity](https://doi.org/10.1016/j.firesaf.2026.104719) | Preview only; full text NOT INSPECTED | Distinguish loss of flame spread from cessation of fuel regression, and inspect SoFIE/MIST conditions, window and censoring |
| Liveretou et al. (2024), [The limiting oxygen volume fraction for opposed flame spread extinction](https://doi.org/10.1016/j.proci.2024.105224) | Preview only; full text NOT INSPECTED | Inspect the pressure/radiant-heat protocol, endpoint and volume-fraction definition before any cross-study comparison |

## Claude review and disagreements

The owner authorized Claude as a research helper. One further tool-free Fable 5.2 call received only public paper facts and the proposed proof, with safe/restricted mode, no repository tools and no GPS project contents, application source, credentials or private evaluation material. It completed in 78.780 s. Reported list-price usage was $0.3158058, not a verified invoice or a runtime-comparison charge.

Claude confirmed the two exact fractions and scoped proof, and identified weaknesses in a two-point story: no extra compatibility check, higher-order aliasing, fixed-baseline dependence and excluded 1g information. Those limitations are implemented. We did not adopt its unproved assertion that all parameters in the authors' family are identifiable, equate small coordinate jitter with useful identification, or call a two-point rank gain physical validation. Public facts and algebra were reviewed; the helper did not inspect the PDF itself. Local PDF/source checks were performed by Codex. No independent scientist reviewed this result.
