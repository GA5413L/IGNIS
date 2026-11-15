# Condition-gap frontier contract

`src/core/frontier.ts` computes the nondominated documented gaps inside a cohort supplied by the caller. The caller must establish eligibility, common material/configuration and units before calling it. A frontier position is not evidence of physical transfer, safety, equivalent fire behaviour, or predictive accuracy. The module does not infer eligibility from numeric proximity.

## Public API and validation

`computeFrontier(points, target)`, `placePoint(point, target)` and the existing result interfaces retain their shapes. Results contain ordinary numbers and objects, support JSON serialization, and require no hidden state for `dominates(a, b, axes)`.

- The known axes are `o2`, `pressure`, `flow`. Values must share units with the corresponding target. Physical ranges and supported product inputs belong in the calling UI; this generic arithmetic module accepts any finite number.
- A target axis with `undefined` is omitted. A target `null`, numeric string, boolean, `NaN` or infinity is invalid. An empty target is valid: all valid records become unplaced.
- A source value of `null` or `undefined` is unrecorded. Other source values must be finite numbers. All supplied source axes are validated, including axes unused by the target. Invalid supplied data never becomes missing data.
- Axis maps must be plain objects (including null-prototype maps). Unknown own keys, including keys whose value is `undefined` and symbol keys, are rejected. Arrays and malformed containers are rejected; numeric strings are never coerced.
- Points must be an array. IDs must be nonblank strings and unique across the entire input, including unplaced points. IDs are preserved exactly; the module does not trim or normalize them.
- A difference that overflows ordinary numeric subtraction, or whose decimal-policy result cannot be represented as a finite nonzero Number when nonzero, is rejected. No result can contain an infinite or `NaN` gap. Signed zero is normalized to zero.
- Public `dominates` validates known, unique comparison axes and finite nonnegative gaps. A supplied placed point's signature must match its documented gap axes. Comparison requires both complete signatures to equal the requested axis set; selecting only the intersection of different signatures returns `false`. Axis order may differ from canonical order. No axes means no dominance. `dominates` uses gaps only; signed values and IDs do not participate in this relation.

Invalid input throws exported `FrontierInputError`, with its `code` drawn from:

| Code | Meaning |
| --- | --- |
| `INVALID_INPUT` | Malformed container/ID/signature or repeated comparison axis |
| `UNKNOWN_AXIS` | Axis outside the supported set |
| `INVALID_NUMBER` | Invalid supplied numeric value or negative placed gap |
| `DUPLICATE_ID` | Repeated point ID |
| `GAP_OUT_OF_RANGE` | Difference outside the supported numeric representation |

The UI should catch this error and show an input error. Do not turn it into a successful empty frontier, discard the invalid row silently, or recast an invalid number as missing.

## Decimal comparison policy

The previous `toPrecision(12)` cleanup could merge distinct gaps and erase a tradeoff. It has been removed. For each source/target pair:

1. Read each finite Number's shortest round-trip decimal representation using `Number.toString()`.
2. Subtract those base-10 representations exactly using integer coefficients and powers of ten.
3. Convert the result once to a finite Number; take its absolute value for the gap and retain its sign separately.
4. Compare those public numeric gaps directly with `<`, `>` and equality. Apply no extra significant-digit rounding, epsilon or tolerance.

Thus `34 - 22.2` gives `11.8`, and the gaps of `0.1` and `0.5` around `0.3` both equal `0.2`. A caller-computed `0.1 + 0.2` is already the Number whose shortest representation is `0.30000000000000004`; its gap to `0.3` remains `4e-17`. The module cannot recover original source text or intended precision from that Number.

This is a representation policy, not measurement uncertainty, significant-figure inference or physical equivalence. The final Number conversion can still merge exact decimal differences too close to distinguish in binary floating point; the implementation does not promise arbitrary-precision ordering. Source intervals, uncertainty and censoring require a separately specified comparison method. UI display rounding must not feed back into the comparison inputs.

Positive affine changes of units applied consistently to source and target multiply each real-arithmetic absolute gap by a positive constant and therefore preserve dominance. The tests cover ordinary percent/fraction and kPa/Pa conversions and representative affine transformations. Arbitrary floating-point transformations can lose information before reaching this API, so universal machine-arithmetic invariance is not claimed.

## Strata, ties and witnesses

Only stated target axes enter gaps. Each record's signature lists the target axes it documents, in `AXES` order. Dominance is computed separately within each signature. Records documenting none of them are unplaced. More complete strata appear first for display; this order does not certify quality or comparable uncertainty.

Within a stratum, `a` dominates `b` precisely when every numeric gap of `a` is at most that of `b` and at least one is smaller. Identical gap vectors remain tied, including source conditions on opposite sides of the target; signed differences preserve that distinction. Each dominated point names one actual frontier witness. Lexicographic gap ordering followed by exact ID ordering makes output and witness selection independent of input order.

The sorted scan is correct because every strict dominator precedes the dominated candidate in lexicographic order. If such a dominator was itself removed, transitivity provides an earlier retained frontier witness. The algorithm checks each candidate against the retained frontier. It is `O(d n²)` in the worst case per stratum, plus sorting, for `d` axes and `n` records; a single traversal of sorted candidates is not a linear-time guarantee.

## What the mathematical claims establish

For a finite cohort within one signature, over the comparison gap vectors:

- Every minimizer of a **strictly increasing** scalar objective is nondominated. If an objective is merely nondecreasing, a dominated record can tie for best; at least one nondominated minimizer exists in a nonempty finite cohort.
- Every nondominated distinct vector can be selected by some strictly increasing objective. This finite-set existence statement does not supply a preferred scientific score, guarantee selection by a weighted sum, or extend to an unseen continuous design space. Identical vectors necessarily tie under any objective of the gaps alone.

A valid real-arithmetic construction for the second statement uses a selected frontier vector `f`, any positive per-axis offsets `s_i`, and `r_i(x) = (x_i + s_i)/(f_i + s_i)`. For each distinct other vector `x`, nondominance ensures `max_i r_i(x) > 1`. For a finite nonempty set of such vectors, let `delta` be the positive minimum of `max_i r_i(x) - 1`, and choose `0 < epsilon < delta/d`. Then `S(x) = max_i r_i(x) + epsilon sum_i r_i(x)` is strictly increasing in every coordinate. `S(f) = 1 + epsilon d < 1 + delta`, while every distinct other vector has `S(x) > 1 + delta`; hence `f` wins. If no distinct vector remains, any positive epsilon works. This is a proof in real arithmetic, not a new product score or a promise that floating-point evaluation resolves arbitrarily small separation.

There is no universal fixed `1e-9` sufficient for that construction. With `f = (1,1)`, `b = (1.0000000001,0)` and `s = (1,1)`, both vectors are nondominated, but epsilon `1e-9` makes `S(b) < S(f)`. A regression fixture checks that counterexample and one separation-dependent choice. The old test labelled a sampled numerical check a theorem and used an absolute closeness assertion; it did not establish the converse.

## Verification scope

The replacement tests independently enumerate all pairwise dominators for all 766 nonempty subsets of a `3 × 3` two-axis grid and a `2 × 2 × 2` three-axis grid, plus 49 integer cohorts with varying target axes and missingness. This oracle does not call production placement or dominance helpers. Small integer arithmetic is exact in these fixtures; separate explicit decimal fixtures check the representation policy. Every output ID and every cited frontier witness are checked.

Further tests cover all 720 permutations of a six-record fixture, ties and signed direction, ordinary units, absent target axes, empty cohorts, frozen inputs, serialized placed points, nonfinite values, numeric strings, malformed data, duplicate IDs, unknown axes and overflow. These are bounded implementation checks. The proof above supplies the finite-set reasoning; neither proves physical transfer or experimental validity.

A condition-gap frontier, a measured system-performance Pareto comparison, and predictive-physics SOTA are separate claims requiring different evidence. This module establishes only the first on validated supplied records.
