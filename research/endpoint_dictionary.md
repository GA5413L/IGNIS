# Endpoint dictionary

Each endpoint carries an ID. Records with different endpoint IDs are **never** pooled, compared numerically, or
substituted for one another. A synonym in a query (e.g. "extinction") resolves to an endpoint ID only after the
user confirms it.

| ID | Endpoint | Operational definition (source wording) | Units seen | Where it appears | Must not be confused with |
|---|---|---|---|---|---|
| **E-01** | Axial flame-leading-edge spread rate, μg, opposed flow, rod | "the flame spread rate was measured by tracking the flame leading edge from high-resolution photos (about every 1 s) using an imaging tracking code"; "linear dependence of the flame position with time indicates a quasi-steady-state flame spread" ([L18] p.4) | printed V_f×10³ in cm/s (S1 left) or **mm/s (S1 right, C-02)** | [L18-ESM] Table S1 | E-02 (different gravity and protocol); burning/regression rate; E-03 |
| **E-02** | Flame spread rate, 1 g, opposed forced flow, rod | "average of at least 3 repeating tests and the flame spread over sample at stead[y] state for at least 5 min or 4 cm" ([L18-ESM] Table S2 caption) | V_f×10³ cm/s, ± % (statistic undefined) | [L18-ESM] Table S2 | E-01: comparing the two is a *cross-endpoint-context* comparison (N1) |
| **E-03** | Critical opposed-flow velocity for radiative extinction, V_g,cr, thin sheet | "A critical flow velocity below which steady spread cannot be sustained" ([TM] p.28) | mm/s; "10±5" etc. | [TM] Table 2.1; [R2] | E-04; any spread rate |
| **E-04** | Low-flow limit for sustained spread on a rod (qualitative statements) | "No flame spread was observed at flow velocities less than 0.6 cm/s" ([L18] p.5); "not observed … below approximately 4 mm/s" ([TM] p.48) | cm/s, mm/s | text only | E-03 (thin-sheet V_g,cr is a defined quantity; E-04 is a set of conflicting statements, C-06) |
| **E-05** | Limiting O₂ for **flame spread** | "the limiting oxygen concentration (LOC), below which flame spread cannot occur" ([L18] p.6) | vol % | [L18] text; [TM] text | E-06; ASTM D2863 oxygen index (candle-like burning, a different test) |
| **E-06** | Limiting O₂ for **any sustained burning** (incl. tip/regression burning without spread) | no source defines this numerically. Example evidence: [TM] Fig. 4.4(f), a flame at 16.3 % O₂ that burned the rod tip flat and extinguished, having "never spread along the outer surface" | vol % | [TM] Fig. 4.4 caption; Table A.3 P21a notes | E-05: a flame can exist below the spread limit |
| **E-07** | Blow-off (high-flow extinction) | "the microgravity flame extinction at high flow velocities (blow off) was not observed" ([L18] p.7); P17/P19 blow-off attempts failed ([TM] A.3) | — | text | E-04 (low-flow extinction) |
| **E-08** | Test termination | NASA notes such as "turned off flow", "fan off", "Loss of signal" ([TM] A.3) | — | Table A.3 | E-04/E-07. **"Test ended" ≠ "flame extinguished".** P2: "did not get extinction on stills, but was just fan off" |

## Variable definitions used with E-01

| Variable | Definition / status |
|---|---|
| V_g | forced opposed-flow velocity, cm/s, per segment ([L18-ESM] S1). Flow-meter accuracy is not quantified ([L18] p.4). In 1 g, not the effective flow at the flame (buoyant ~30 cm/s, [L18] p.5) |
| X_O₂ | O₂ volume fraction (%) "defined by the volume fraction" ([L18] p.3). In S1, equals the NASA *calibrated initial* value; drift during the burn is recorded only in [TM] (C-05). Store original % and the fraction (÷100) separately; never mix them |
| d | rod diameter. S1/S2 in cm (rounded); [TM] in mm (nominal inch sizes). Some [TM] captions give **radius** (C-19). Store `size_kind` |
| Δt | printed in S1 (s); **definition not given** (C-12) |
| ± (%) | S2 only; relative, statistic not defined; **not** a confidence interval |
| pressure | not reported for E-01/E-02 (unknown, never defaulted to 101.3 kPa) |
| O₂ partial pressure | **cannot be derived** for E-01/E-02, because pressure is unknown |
