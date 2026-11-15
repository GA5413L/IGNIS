# Endpoint dictionary

## Current access/method addendum: 15 November 2026

The supplied LIV24 accepted manuscript is now fully read. Its intended quantity concerns downward opposed flame-spread limits, but its condition-level reported outcome is spread cessation **or** flame extinction. A residual blue flame after spread cessation is described. Individual failure branches and transition pairs are unavailable; the source cannot be silently assigned to a pure full-extinction endpoint. RIES24's newly read operator is instead the propagation rate of an IR pyrolysis marker strictly above 603 K over 3–7 s, not an oxygen limit or automatically an optical flame-leading-edge rate.

The separate [LIV24 dossier](../web/data/endpoint-studies/liveretou2024.json) and [endpoint audit](../web/docs/ENDPOINT_PROTOCOL_AUDIT_2026-11-15.md) implement observation criteria for detected spread, visible flame and fuel regression. These are detector/method-dependent records, not a relabeling of M-03/M-04 physical quantities. No automatic implication connects them. A test-ended event with unknown observation status supplies no threshold inequality. Conditional mathematical sets are opt-in and do not establish physical absence or a material constant.

Legacy E-01–E-08 and their source meanings below are unchanged. The frozen r2 registry is unchanged. The original statement below that this dictionary was specification-only describes its October revision; the new source-specific backend is a separate November implementation.

## Historical dictionary revision

**Revised 21 Oct 2026 (third session): measurand layer added.** The first version bundled three things into each
endpoint ID: the quantity measured, the conditions, and the protocol. It then ruled that "Records with different
endpoint IDs are **never** pooled, compared numerically, or substituted for one another." That rule confused *what
is measured* with *where and how it was measured*. E-01 and E-02 measure the same physical quantity, axial flame-front
propagation rate, under different gravity, protocol and statistic. E-03 is a genuinely different quantity.

What changed (D-021):
- The rule is replaced by the layered rules in §4.
- **All existing IDs (E-01 to E-08) keep their original meaning** (§3, unchanged). They are now read as *operational endpoints*: a measurand plus a source-specific operational definition and context.
- No ID is renamed. The analysis scripts don't use these IDs, so no code changes.
- This is a scientific specification only. It does **not** implement or authorize a production data model.

A synonym in a query (e.g. "extinction") resolves to a measurand and an endpoint only after the user confirms it.

## 1. The layers
| Layer | Question it answers | Field (proposed name) | Example (B4 row S1-L20) |
|---|---|---|---|
| A. Measurand | What physical quantity? | `measurand_id` (M-xx) | M-01 axial flame-front propagation rate |
| B. Operational definition | How was the number obtained? | `method_id` (MT-xx) | MT-01 slope of tracked leading-edge position vs time over a quasi-steady segment |
| C. Experimental context | Under what physical conditions? | `context` (fields in §5) | ISS μg; black cast PMMA rod 0.95 cm; initial O₂ 18.5 % in a sealed, depleting volume; nominal opposed flow 2.00 cm/s; pressure unknown; first burn of 197m; began in P6's residual atmosphere (C-26) |
| D. Protocol | How was the experiment run? | `protocol_id` (PR-xx) | PR-01 hot-wire ignition, stepwise flow reduction |
| E. Statistic | What does the number represent? | `statistic_id` (ST-xx) | ST-01 one fitted segment of one burn |
| F. Analytical use | What may be done with it alongside other records? | rules in §4 | — |
| (legacy) Operational endpoint | the source-specific bundle | `endpoint_id` (E-xx) | E-01 |
| (provenance) | which printed cell | `source_measurement_id` | S1-L20 |

## 2. Measurands
| ID | Physical quantity | Dimension | Operational endpoints | Not the same as |
|---|---|---|---|---|
| **M-01** | Axial flame-front (leading-edge) propagation rate along a solid specimen, relative to the solid | length / time | E-01, E-02 | burning (regression) rate; any flow velocity |
| **M-02** | Limiting (critical) opposed-flow velocity below which steady flame spread is not sustained: a boundary of the flammability map, not a rate of the flame | length / time (of the gas) | E-03 (thin sheets, defined quantity); E-04 (rods, statements only) | M-01: the shared unit (cm/s) is a dimensional coincidence |
| **M-03** | Limiting O₂ volume fraction for flame **spread** | vol % | E-05 | M-04; ASTM D2863 oxygen index |
| **M-04** | Limiting O₂ volume fraction for **any sustained burning** | vol % | E-06 | M-03 |
| **M-05** | High-flow (blow-off) extinction velocity | length / time (of the gas) | E-07 | M-02 (the low-flow limit) |
| — | *Not a measurand:* test-termination **event** | — | E-08 | any extinction measurand. "Test ended" ≠ "flame extinguished" |

**Derived record-set statistics are not measurands.** For example, "lowest tabulated initial O₂ at which a spread
rate is printed" is computed over M-01 records. At best it bounds M-03 from above, under that protocol and that
specimen history. It does not measure it (Evidence Case 03).

## 3. Legacy operational endpoints (original table, meaning unchanged; measurand column added)
| ID | Measurand | Endpoint | Operational definition (source wording) | Units seen | Where it appears | Must not be confused with |
|---|---|---|---|---|---|---|
| **E-01** | M-01 | Axial flame-leading-edge spread rate, μg, opposed flow, rod | "the flame spread rate was measured by tracking the flame leading edge from high-resolution photos (about every 1 s) using an imaging tracking code"; "linear dependence of the flame position with time indicates a quasi-steady-state flame spread" ([L18] p.4) | printed V_f×10³ in cm/s (S1 left) or **mm/s (S1 right, C-02)** | [L18-ESM] Table S1 | E-02 (same measurand; different gravity, protocol and statistic); burning/regression rate; E-03 |
| **E-02** | M-01 | Flame spread rate, 1 g, opposed forced flow, rod | "average of at least 3 repeating tests and the flame spread over sample at stead[y] state for at least 5 min or 4 cm" ([L18-ESM] Table S2 caption) | V_f×10³ cm/s, ± % (statistic undefined) | [L18-ESM] Table S2 | E-01: same measurand, so display and descriptive contrast are allowed; pooling and causal attribution are not (§4, N1) |
| **E-03** | M-02 | Critical opposed-flow velocity for radiative extinction, V_g,cr, thin sheet | "A critical flow velocity below which steady spread cannot be sustained" ([TM] p.28) | mm/s; "10±5" etc. | [TM] Table 2.1; [R2] | E-04 (same measurand, different geometry; no defined rod value); any spread rate (different measurand) |
| **E-04** | M-02 | Low-flow limit for sustained spread on a rod (qualitative statements) | "No flame spread was observed at flow velocities less than 0.6 cm/s" ([L18] p.5); "not observed … below approximately 4 mm/s" ([TM] p.48) | cm/s, mm/s | text only | E-03 (thin-sheet V_g,cr is a defined quantity; E-04 is a set of conflicting statements, C-06) |
| **E-05** | M-03 | Limiting O₂ for **flame spread** | "the limiting oxygen concentration (LOC), below which flame spread cannot occur" ([L18] p.6) | vol % | [L18] text; [TM] text | E-06; ASTM D2863 oxygen index (candle-like burning, a different test) |
| **E-06** | M-04 | Limiting O₂ for **any sustained burning** (incl. tip/regression burning without spread) | no source defines this numerically. Example evidence: [TM] Fig. 4.4(f), a flame at 16.3 % O₂ that burned the rod tip flat and extinguished, having "never spread along the outer surface" | vol % | [TM] Fig. 4.4 caption; Table A.3 P21a notes | E-05: a flame can exist below the spread limit |
| **E-07** | M-05 | Blow-off (high-flow extinction) | "the microgravity flame extinction at high flow velocities (blow off) was not observed" ([L18] p.7); P17/P19 blow-off attempts failed ([TM] A.3) | — | text | E-04 (low-flow extinction) |
| **E-08** | (event) | Test termination | NASA notes such as "turned off flow", "fan off", "Loss of signal" ([TM] A.3) | — | Table A.3 | E-04/E-07. **"Test ended" ≠ "flame extinguished".** P2: "did not get extinction on stills, but was just fan off" |

### Methods, protocols and statistics referenced above
| ID | Definition | Source |
|---|---|---|
| **MT-01** | slope of the tracked flame-leading-edge position vs time, from photos about 1 s apart, image-tracking code, over a segment judged quasi-steady (linear). No fit uncertainty published | [L18] p.4; ESM Fig. S1 |
| **MT-02** | steady-state spread rate from camera records ("The same Nikon D300 camera was used"). Steady for "at least 5 min or 4 cm". The 1 g tracking procedure is **not described** (UNKNOWN whether it was MT-01) | [L18] p.4; [L18-ESM] Table S2 caption |
| **MT-03** | critical velocity from tests at several flows, with separate experiment, computation and theory columns | [TM] §2.2, Table 2.1 |
| **PR-01** (μg rods) | hot-wire coil ignition at a "relatively high" opposed flow (NASA air display 5 cm/s); flow then stepped down (~30 s to ≥ 1 min per step) to extinction or flow-off; some burns had excursions (C-23). Sealed work volume: "The O2 decreased during each burn and the CO and CO2 increased accordingly"; consecutive burns may share an atmosphere (C-26); some specimens were burned twice | [L18] pp.3–4; [TM] p.14/6; Table A.3 |
| **PR-02** (1 g rods) | methane diffusion-flame ignition in still air; then the designed flow and O₂ are applied; flow increased stepwise to blow-off; flowing metered O₂/N₂ mixture ("controlled flows of gas with a prescribed oxygen … concentration"); ≥ 3 repeats | [L18] pp.3–4 |
| **ST-01** | one fitted segment of one burn; no uncertainty reported | Table S1 |
| **ST-02** | mean of ≥ 3 repeat tests; "±%" printed, statistic undefined (not a confidence interval) | Table S2 |
| **ST-03** | experimental central value ± (meaning per Evidence Case 01) | [TM] Table 2.1 |
| **ST-04** | derived record-set statistic (e.g. minimum tabulated O₂ with a printed rate). **Not a measurement** | computed |

## 4. Analytical-use rules (replace the original "never compared numerically" rule)
These are separate questions. Passing one does not pass the next.

| Use | Minimum conditions |
|---|---|
| **U1 Display side by side** | Each record shows its measurand, statistic, context and protocol. Different measurands are shown as different quantities, never on one axis as if the same |
| **U2 Descriptive arithmetic contrast** (difference, ratio) | **Same measurand**; units reconciled (unit conflicts shown, C-02); both statistics shown. The result is labelled *"contrast of observations under different contexts/protocols"*, never an "effect" |
| **U3 Pooling** (average, fit, regression, shared summary) | U2 **plus**: same method; same statistic type; independence groups defined (specimen, D-009; shared atmosphere noted, C-26); the remaining context differences are either absent or modelled explicitly |
| **U4 Causal attribution** of a difference to one factor | U3 **plus**: by design, that factor is the only systematic difference (controlled variation or randomisation), or a justified adjustment exists. **No pair of records in this repository meets U4** |
| **U5 Training one model on both** | U3 plus a consistently defined target statistic and representativeness. Not planned |
| **U6 Substitution** (answering a question about one endpoint with another's record) | Same measurand, and context and protocol inside the question's stated scope. **Never across measurands** |

**The rule now reads:**
- Records with **different measurands** are never contrasted numerically and never substituted for one another.
- Records with the **same measurand but different operational endpoints** may be displayed together and contrasted arithmetically (U1, U2), with their protocols and contexts shown.
- They are never pooled, causally attributed or used to train one model unless U3/U4 hold.

### Applied to current pairs
| Pair | Shared layers | U1 | U2 | U3 | U4 | U5 | U6 |
|---|---|---|---|---|---|---|---|
| E-01 vs E-02 at matched nominal d, O₂, V_g (N1) | measurand | yes | **yes**, descriptive | no: ST-01 vs ST-02; PR-01 vs PR-02; effective flow differs | **no** | no | no |
| E-01 within one burn (P4) | measurand, method, protocol, specimen | yes | yes | no: same burn, segments not independent | no: flow changed together with time, O₂ and products | no | — |
| E-01 across first burns of different specimens | measurand, method, protocol | yes | yes | only as the authors' own regression did; not re-run here | no | no | — |
| E-01 first burn vs reburn of the same rod (B5 vs B9) | measurand, method, protocol, specimen | yes | yes, with history shown | no: specimen and atmosphere history differ | no | no | no |
| E-03 vs E-01 | none | as different quantities only | **no** | no | no | no | **no** (N2) |
| E-03 vs E-04 | measurand M-02 | yes | no: E-04 has no defined value | no | no | no | **no**: thin sheet ≠ thick rod |

## 5. Context fields (what must travel with every record)
- gravity (ISS μg / 1 g)
- material and colour
- geometry and size, plus `size_kind` (C-19)
- **O₂ regime**: initial value of a sealed, depleting volume (μg), or a prescribed flowing mixture (1 g)
- pressure (unknown for E-01/E-02)
- forced flow: nominal setting (C-24) and direction; **effective** flow at the flame (in 1 g, buoyant ~30 cm/s)
- **specimen history**: NASA sample number and burn index (D-009)
- **atmosphere history**: whether the burn began in a previous burn's residual atmosphere, and that burn's as-run number (C-26)

## Variable definitions used with E-01
| Variable | Definition / status |
|---|---|
| V_g | forced opposed-flow velocity, cm/s, per segment ([L18-ESM] S1). Flow-meter accuracy is not quantified ([L18] p.4). Probably a **nominal per-setting** value from the daily calibration (C-24). In 1 g, not the effective flow at the flame (buoyant ~30 cm/s, [L18] p.5) |
| X_O₂ | O₂ volume fraction (%) "defined by the volume fraction" ([L18] p.3). In S1, equals the NASA *calibrated initial* value. Drift during the burn is recorded only in [TM] (C-05). The starting atmosphere may be the previous burn's residue (C-26). Store original % and the fraction (÷100) separately; never mix them |
| d | rod diameter. S1/S2 in cm (rounded); [TM] in mm (nominal inch sizes). Some [TM] captions give **radius** (C-19). Store `size_kind` |
| Δt | printed in S1 (s); **definition not given** (C-12) |
| ± (%) | S2 only; relative, statistic not defined; **not** a confidence interval |
| pressure | not reported for E-01/E-02 (unknown, never defaulted to 101.3 kPa) |
| O₂ partial pressure | **cannot be derived** for E-01/E-02, because pressure is unknown |
