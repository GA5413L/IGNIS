# Evidence Case 01: Auxiliary thin-sheet case (critical opposed-flow extinction velocity)

**Date:** 20 October 2026. Re-verification of the "IGNIS Evidence Case 01" packet dated 15 October 2026.
**Status:** Table values are **visually verified** against the official NTRS PDF. The 15 Oct packet's
"provisional transcription" caveat is lifted for the numbers. Interpretation is unchanged: this is an
**auxiliary** case on a **different endpoint and geometry** from the rod case (Evidence Case 02), and it must
never be pooled with rod data.

## What changed since 15 October
| Item | 15 Oct packet | 20 Oct (this file) |
|---|---|---|
| Table 2.1 source inspected | author-uploaded ResearchGate representation; PDF table image **not** inspected | official NTRS PDF, SHA-256 `5ffa911f…f770`; PDF p.36 = printed p.28 rendered at 160 dpi and read; text-layer check passed (`research/data/README.md`) |
| Values | 21 %: 10±5 / 15 / 7.5; 16 %: 30±5 / 35 / 10 | **identical** |
| Context | — | the experimental value pools results "from four different fuel thicknesses" (p.28); the section was "Previously published as" Bhattacharjee et al. 2016, Combust. Flame 163:472–477 (p.27 footnote). So [TM] §2.2 and [R2] are **one** result, not two |
| "B16" label collision | quarantined warning; appendix row not audited | **confirmed** from the text layer: Table A.1 (Bhattacharjee, PDF p.111) test B16 = sample 150m, "2-cm 100-µm-thick PMMA" film, while Link's B16 is a 6.35 mm rod (NASA P16). See C-14 |
| Rod Tables S1/S2 | unobtainable | **obtained** from the publisher; see Evidence Case 02 |
| Code referenced by the packet (`test_analysis.py`, `rod_case_status.json`, frozen JSON, chart, SQLite baseline) | reported as run | **not present in this repository** and not re-run here. Their reported results are neither confirmed nor refuted. Under the confirmed competition rules (see `planning/competition_rules.md`), pre-event code should not be carried into a submission without an organizer ruling |

## Source values
[TM] NASA/TM-20210011385, §2.2, **TABLE 2.1.—COMPARISON OF EXTINCTION VELOCITY V_g,cr FOR THIN
POLYMETHYLMETHACRYLATE AT 1 atm**, units mm/s:

| O₂, percent | Experiment | Computation | Theory, Eq. (2.5) |
|---:|---:|---:|---:|
| 21 | 10±5 | 15 | 7.5 |
| 16 | 30±5 | 35 | 10 |

Endpoint: **V_g,cr**, the opposed-flow velocity below which steady flame spread cannot be sustained (radiative
extinction), for **thin** PMMA sheets in microgravity. Two condition summaries, not independent runs. The meaning
of ± (SD, range, or other) is not stated, so it is **not** treated as a confidence interval.

## Recomputed comparison (unchanged arithmetic, re-checked by hand)
For each published model output p and experimental central value y: |p − y|.

| O₂ % | Computation | Theory | Closer to the central value |
|---:|---:|---:|---|
| 21 | \|15 − 10\| = 5 | \|7.5 − 10\| = 2.5 | theory |
| 16 | \|35 − 30\| = 5 | \|10 − 30\| = 20 | computation |

Means of the two absolute differences: computation 5 mm/s, theory 11.25 mm/s. These are descriptive arithmetic
on published outputs, not validation errors.

**Sensitivity (labelled exercise only).** Let the observation range over the printed centre ± amount, with the
model outputs held fixed:
- At 21 % the two outputs are equidistant at y = (7.5 + 15)/2 = **11.25** mm/s, which lies **inside** 5–15, so the 21 % ordering is **not robust**.
- At 16 % the equidistance point (10 + 35)/2 = **22.5** mm/s lies **outside** 25–35, so computation stays closer across that range.

(That the 21 % equidistance point and the theory's mean absolute difference are both 11.25 is a numerical
coincidence.)

## Dispositions
| Use | Disposition |
|---|---|
| Recompute absolute differences | done (verified values) |
| Rank-sensitivity to the printed ± | done, as a labelled exercise |
| Use as a rod spread rate or rod extinction velocity | **INAPPLICABLE**: wrong geometry and endpoint (Evidence Case 02, N2) |
| Treat model columns as extra experiments | excluded: model outputs are not measurements |
| "Theory is better at 21 %" | not supported |
| Recommend a model for new conditions | not established |
| Count [TM] §2.2 and Bhattacharjee 2016 as two confirmations | excluded: same result republished |
