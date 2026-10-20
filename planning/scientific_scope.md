# Scientific scope (based on the data actually found, 20 Oct 2026)

> **21 Oct:**
> - The primary demonstration is now Evidence Case 03, on burn history and the lowest O₂ with recorded spread (D-022). The researcher task is in `researcher_workflow.md`.
> - Query type 3 below is the secondary, negative demonstration, restated under the corrected endpoint rules (`research/endpoint_dictionary.md` §4).


## First domain: confirmed as feasible
**Black cast PMMA rods, microgravity (ISS BASS-II), forced opposed flow, endpoint E-01 (axial flame-leading-edge
spread rate).** The numbers exist and can be traced to NASA's as-run record: [L18-ESM] Table S1 crosswalked to
[TM] Table A.3. A positive descriptive result has been produced (Evidence Case 02).

Records available for this domain, after admission rules (Evidence Case 02 §3):

| Decision | Burns | Rows |
|---|---|---|
| ADMITTED | B4, B5, B12, B13a | 13 |
| ADMITTED_WITH_FLAG (reburn) | B9, B13b | 6 |
| CONDITIONAL (unit-label conflict, right half) | B1, B2, B6, B10, B14 | 11 |
| QUARANTINED | B15, B16, B19 | 9 |
| INDETERMINATE | B22, P17 | 7 |
| INAPPLICABLE (clear PMMA) | C25, C3a, C3b | 6 |

This is a **small** domain: 4 admitted first burns from 4 specimens, at different diameters and O₂ levels. It
supports descriptive comparisons and provenance-rich explanations. It does **not** support fitting, prediction,
or pooled statistics.

## Query types the vertical slice should answer (all with real records)
1. **Within-burn comparison** of two recorded flow settings (Evidence Case 02 §4). Several genuine instances: B4, B5, B12, B13a, plus flagged and conditional burns.
2. **Provenance / identity:** "which NASA test is Link's B16, and what do the sources disagree on?" (crosswalk; C-03, C-14).
3. **Gravity comparison at matched nominal conditions** gives arithmetic plus INDETERMINATE (Evidence Case 02 N1). This is the main "conclusion stops transferring" demonstration.
4. **Endpoint guard:** a thin-sheet V_g,cr query is answered for its own endpoint (Evidence Case 01) and refused for rods (N2).
5. **Limit claims (LOC, low-flow limit):** the answer is the set of conflicting source statements with scope, never one number (N4; C-06 to C-08).

## Explicitly out of scope for the hackathon slice
- Predictions of any kind (no admitted dataset of independent burns large enough; no named baseline model was validated here).
- Re-running Link et al.'s multivariate regression.
- Digitising figures.
- Partial gravity, pressure effects (pressure is unknown for E-01/E-02), concurrent flow (only quarantined records), other materials and programmes (context layer only).
- Any safe/unsafe label or confidence percentage.

## Scope decisions pending new evidence
- **Rivera et al. 2026** (FSJ 162:104719): if it reports opposed-flow rod spread limits with tabulated data, it may add records or settle C-03, C-06 and C-07. Read it before the event (library access) to decide whether it is in or out.
- **PSI-25 raw data:** if accessible, Δt (C-12), the flow sequences (C-23) and the P16/P19 configuration (C-03) might be checkable from video overlays.
- **Author replies** on C-02, C-03, C-15.
