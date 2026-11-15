"""Publication-style figures for IGNIS, drawn with paperplot (matplotlib).

Input: artifacts/figures/figure-data.json, written by scripts/export-figure-data.ts from src/core.
Output: public/figures/*.svg|pdf|png. Descriptive plots of source values and exact counts only:
no fit, no smoothing, no confidence interval, no prediction. Horizontal jitter in the strip plots
is for legibility and carries no data.

Run: uv run --python 3.12 --with paperplot-quantum python -I scripts/make-figures.py
"""
import argparse
import json
import pathlib
import random

import matplotlib
matplotlib.use("Agg")
import paperplot as pp

ROOT = pathlib.Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser(description="Reproduce IGNIS figures from the exported data packet.")
parser.add_argument("--data", type=pathlib.Path, default=ROOT / "artifacts/figures/figure-data.json")
parser.add_argument("--out", type=pathlib.Path, default=ROOT / "public/figures")
parser.add_argument("--figure", choices=("all", "1", "2", "3", "4"), default="all")
parser.add_argument("--palette", choices=("okabe-ito", "monochrome"), default="okabe-ito")
args = parser.parse_args()
DATA = json.loads(args.data.read_text(encoding="utf-8"))
OUT = args.out
OUT.mkdir(parents=True, exist_ok=True)

pp.use("nature")
BLACK, BLUE, VERMILLION, GREEN, ORANGE, SKY, GREY = "#000000", "#0072B2", "#D55E00", "#009E73", "#E69F00", "#56B4E9", "#8a8a8a"
if args.palette == "monochrome":
    BLUE, VERMILLION, GREEN, ORANGE, SKY, GREY = "#111111", "#777777", "#444444", "#999999", "#BBBBBB", "#8a8a8a"
MATERIALS = ["Kapton", "Teflon", "Lampwick", "Silicone", "Pyrell"]
AREA_COLOUR = {"prevention": GREEN, "detection": BLUE, "suppression": VERMILLION}


def save(fig, name):
    for ext in ("pdf", "svg", "png"):
        kwargs = {"dpi": 300} if ext == "png" else {}
        fig.savefig(OUT / f"{name}.{ext}", bbox_inches="tight", **kwargs)
        if ext == "svg":
            path = OUT / f"{name}.{ext}"
            path.write_text("\n".join(line.rstrip() for line in path.read_text(encoding="utf-8").splitlines()) + "\n", encoding="utf-8", newline="\n")
    report = pp.preflight(fig)
    print(name, "preflight:", str(report).splitlines()[0] if str(report) else "ok")


def fig_atmospheres():
    fig, axes = pp.figure(width="double", ncols=2, aspect=0.42)
    ax, bx = axes
    moon = DATA["moonRange"]
    ax.axvspan(moon["minOxygenPercent"], 36, ymin=0, ymax=(moon["maxPressureKPa"] - 45) / 60, color=SKY, alpha=0.25, lw=0)
    ax.text(35.8, 46.5, "Moon Base range\n(challenge statement)", ha="right", va="bottom", color=BLUE)
    markers = {"PMMA": "o", "SIBAL": "s", "Cotton": "^"}
    seen = set()
    for case in DATA["conditions"]:
        filled = case["sides"] == 2
        label = f'{case["material"]}, {"two" if filled else "one"} side{"s" if filled else ""}'
        ax.plot(case["oxygenPercent"], case["pressureKPa"], markers[case["material"]], ms=5.5, mfc=BLACK if filled else "white", mec=BLACK, mew=0.9,
                label=None if label in seen else label, ls="none")
        seen.add(label)
        dy = -5.5 if case["sample"] in ("VI-3", "IV-1", "V-2") else 3.5
        ax.annotate(case["sample"], (case["oxygenPercent"], case["pressureKPa"]), xytext=(0, dy), textcoords="offset points", ha="center", va="bottom" if dy > 0 else "top")
    ax.set_xlim(20, 36); ax.set_ylim(45, 105)
    ax.set_xlabel("Oxygen (mole %)"); ax.set_ylabel("Pressure (kPa)")
    ax.legend(frameon=False, loc="upper right")
    order = sorted(DATA["conditions"], key=lambda c: c["oxygenPartialPressureKPa"])
    bx.barh([c["sample"] for c in order], [c["oxygenPartialPressureKPa"] for c in order], color=[BLUE if c["oxygenPercent"] >= 30 and c["pressureKPa"] <= moon["maxPressureKPa"] else GREY for c in order], height=0.62)
    for i, c in enumerate(order):
        bx.text(c["oxygenPartialPressureKPa"] + 0.3, i, f'{c["oxygenPartialPressureKPa"]:g}', va="center")
    bx.set_xlim(0, 27); bx.set_xlabel("Oxygen partial pressure (kPa), arithmetic from printed values")
    pp.despine(ax); pp.despine(bx)
    pp.panel_labels(axes)
    save(fig, "fig1-atmosphere-cases")


def fig_detectors():
    rng = random.Random(7)
    fig, axes = pp.figure(width="double", nrows=2, ncols=2, aspect=0.62, sharex=True)
    for ax, channel in zip(axes.flat, DATA["channels"]):
        for i, material in enumerate(MATERIALS):
            for flight, colour, marker in (("SAME", VERMILLION, "o"), ("SAME-R", BLUE, "D")):
                ys = [r["values"][channel["id"]] for r in DATA["detectorRows"] if r["material"] == material and r["flight"] == flight and r["values"][channel["id"]] is not None]
                xs = [i + (-0.17 if flight == "SAME" else 0.17) + rng.uniform(-0.11, 0.11) for _ in ys]
                ax.plot(xs, ys, marker, ms=2.6, mfc="none", mec=colour, mew=0.6, ls="none", label=flight if i == 0 else None)
        ax.axhline(2, color=BLACK, lw=0.6, ls="--")
        ax.set_title(f'{channel["label"]} (column {channel["column"]})', loc="left", x=0.06)
        ax.set_xticks(range(len(MATERIALS))); ax.set_xticklabels(MATERIALS)
        ax.set_ylabel("Stored reading (V)")
        pp.despine(ax)
    handles, labels = axes.flat[0].get_legend_handles_labels()
    axes.flat[2].legend(handles, labels, frameon=False, loc="center", ncols=2, title="Flight")
    axes.flat[0].text(4.45, 2.15, "2 V cutoff", ha="right", va="bottom")
    pp.panel_labels(axes)
    save(fig, "fig2-detector-readings")


def fig_paired():
    fig, axes = pp.figure(width="double", ncols=2, aspect=0.36, sharey=True)
    ax, bx = axes
    labels = [item["label"] for item in DATA["paired"]]
    ys = list(range(len(labels)))[::-1]
    for y, item in zip(ys, DATA["paired"]):
        d, c = item["difference"], item["completion"]
        colour = BLUE if d["fraction"] > 0 else VERMILLION
        ax.plot([c["lowerFraction"], c["upperFraction"]], [y - 0.22, y - 0.22], color=GREY, lw=1.6, solid_capstyle="butt")
        ax.plot(d["fraction"], y, "o", ms=5.5, color=colour)
        ax.text(d["fraction"], y + 0.2, f'{d["numerator"]:+d}/{d["denominator"]}', ha="center", va="bottom")
    ax.set_title("Both cutoffs at 2 V", loc="left", x=0.06)
    for offset, key, alpha in ((0.14, "narrow", 1.0), (-0.14, "wide", 0.45)):
        for y, item in zip(ys, DATA["envelopes"][key]):
            p = item["paired"]
            colour = BLUE if p["lowerFraction"] > 0 else VERMILLION if p["upperFraction"] < 0 else BLACK
            bx.plot([p["lowerFraction"], p["upperFraction"]], [y + offset, y + offset], color=colour, lw=3.2, alpha=alpha, solid_capstyle="butt",
                    label={"narrow": "cutoffs 1 to 3 V", "wide": "cutoffs 0 to 5 V"}[key] if y == ys[0] else None)
    bx.set_title("Exact range over a cutoff rectangle", loc="left", x=0.06)
    bx.legend(frameon=False, loc="upper left")
    for a in axes:
        a.axvline(0, color=BLACK, lw=0.6, ls=":")
        a.set_xlim(-1, 1); a.set_ylim(-0.6, len(labels) + 0.25)
        a.set_xlabel("Share at or above cutoff, scatter minus obscuration")
        pp.despine(a)
    ax.set_yticks(ys); ax.set_yticklabels(labels)
    pp.panel_labels(axes)
    save(fig, "fig3-paired-channels")


def fig_coverage():
    fig, axes = pp.figure(width="double", ncols=2, aspect=0.5)
    ax, bx = axes
    ranking = DATA["ranking"][::-1]
    ax.barh([f'{r["rank"]:02d}  {r["name"]}' for r in ranking], [r["findings"] for r in ranking],
            color=[AREA_COLOUR[r["areas"][0]] if r["areas"] else GREY for r in ranking], height=0.62)
    for i, r in enumerate(ranking):
        ax.text(r["findings"] + 0.15, i, str(r["findings"]) if r["findings"] else "profile only", va="center")
    ax.set_xlim(0, 11.5); ax.set_xlabel("Reviewed findings")
    for area, colour in AREA_COLOUR.items():
        ax.barh([0], [0], color=colour, label=area)
    ax.legend(frameon=False, loc="lower right", title="First safety area")
    tables = sorted([a for a in DATA["atlas"] if a["records"] > 0], key=lambda a: a["records"])
    bx.barh([a["name"] for a in tables], [a["records"] for a in tables], color=BLACK, height=0.62)
    bx.set_xscale("log"); bx.set_xlabel("Records in the published experimental table (log scale)")
    bx.tick_params(axis="y", labelsize=5.5)
    pp.despine(ax); pp.despine(bx)
    pp.panel_labels(axes)
    save(fig, "fig4-evidence-coverage")


for number, draw in enumerate((fig_atmospheres, fig_detectors, fig_paired, fig_coverage), start=1):
    if args.figure in ("all", str(number)):
        draw()
print("figures written to", OUT)
