# Interactive figure visibility — 15 November 2026

Figure 2 and Smoke detection's statistical scatter now support first-click isolation and subsequent multiple-material toggling. **Show all** returns to the initial isolation behavior. **Hide all** leaves the axes visible with an explicit empty-state label. Buttons support keyboard activation, expose their pressed state and report visible counts. Material identity uses both shape and Okabe–Ito colour; monochrome retains the shapes.

## Scientific contract

- **Display selection is separate from analytical selection.** Figure 2 retains the same 134 non-reference source rows as its baseline. Every panel uses its complete baseline to define the vertical axis; material/flight offsets and source-row layout offsets do not move when visibility changes. Horizontal spread is layout, not measured data. Twenty DBP reference rows remain outside this figure.
- **Unavailable readings remain explicit.** A hidden material contributes no visible marks. An included row with an unavailable cell stays in the visible-row export and denominator but contributes no point in that channel. Finite, missing, error and nonnumeric counts are per channel. Missing values are never plotted as zero.
- **Statistical filtering is deliberate.** The scatter's legend hides points only. Axes, ranks, coefficient, material strata and deletion results continue to use the full analysis selection set by the flight/material/channel controls. Changing those analysis controls resets display visibility. This avoids silently changing a reported statistic while a researcher compares visible strata.
- **No geometric drift.** A surviving point keeps its coordinates when another material is hidden. Ranked coordinates retain ranks from the full selected paired population. No line fit or uncertainty estimate is added by the view.
- **Flight encoding is explicit.** Figure 2 places SAME on the left half of each material column and SAME-R on the right. Closed symbols are filled/open respectively; cross/plus shapes use their position to distinguish flight.

## Reproduction and export

Figure 2's visible SVG contains its recipe and exact visible source rows in metadata, and standalone print styles; no external image, font or script is required. The JSON contains source/workbook identity, source rows and cells, channel counts, visible material/record IDs, fixed axes, offsets, palette, shape encoding and a canonical checksum. The white-paper SVG preserves Okabe–Ito hues with a dark outline for light marks; monochrome uses black. The checksum is an integrity check, not authorship authentication.

The statistical visible-view JSON uses `ignis-association-view-1`. It embeds the full replayable `ignis-association-export-1` analysis and records visible record IDs and their plotted raw or ranked coordinates. Its embedded analysis remains the input for source-bound analytical replay; the outer view wrapper is not itself the statistical replay format. The main statistical analysis download and Python checker still describe the complete analysis selection.

Publication PDF/PNG/SVG downloads and their Python bundle are explicitly the static full/default figures. They are not silently substituted for a filtered download. Other publication figures remain static; this release does not claim every chart is interactive.

## Research-tool priorities

The useful practices carried into this release are linked source-cell inspection, explicit missingness, stable visual coordinates, separate analytical/display populations, and exact view receipts. These let a researcher check what a mark means and reproduce the comparison. They are standard research-tool practices, not a claim of methodological novelty or superiority over every competitor.

Production-browser tests inspect actual rendered marks and exported data rather than testing a duplicate plotting implementation. They compare source IDs/cells, counts and point positions; exercise one/multiple/all/none selections; verify missing-cell behavior; and check that hiding materials does not alter the association coefficient or ranks. Final execution results are recorded in [BUILD_STATUS](BUILD_STATUS.md).
