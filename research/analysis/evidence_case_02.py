"""Evidence Case 02 arithmetic: within-burn spread-rate differences for black PMMA rods in microgravity (BASS-II).

Usage (from repo root, after crosswalk.py): py -3 -I research/analysis/evidence_case_02.py
Reads only research/data/*.csv. Prints the admission decision for every Table S1 label and the B - A differences
for the labels the rules admit. The rules are the ones written in research/evidence_case_02.md section 3; this
script restates them so the numbers can be regenerated, it does not add any.

Units: Table S1 prints V_f x 10^3. Under the cm/s label, 1 printed unit = 1e-3 cm/s = 10 um/s.
"""
import csv
import os

DATA = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
UM_PER_UNIT = {"cm/s": 10.0, "mm/s": 1.0}  # micrometres per second per printed table unit


def load(name):
    with open(os.path.join(DATA, name), newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def classify(cw):
    """Decision for the Q1 question (within-burn, black rod, opposed flow, microgravity)."""
    f = cw["flags"]
    if cw["link_colour_from_prefix"] == "clear":
        return "INAPPLICABLE", "clear PMMA (scope is black cast PMMA)"
    if "UNDEFINED_IN_CAPTION" in f or "COLOUR_NOT_STATED" in f:
        return "INDETERMINATE", "material colour not stated in either source"
    if "FLOW_CONFIG_CONFLICT" in f:
        return "QUARANTINED", "NASA as-run matrix records Concurrent; Link presents opposed"
    if "AMBIGUOUS_MULTIPLE_NASA_TESTS" in f:
        return "INDETERMINATE", "label maps to more than one NASA burn; run identity unresolved"
    if "O2_MISMATCH" in f:
        return "QUARANTINED", "oxygen value conflicts between sources"
    if "VF_UNIT_LABEL_CONFLICT" in f:
        return "CONDITIONAL", "printed unit label conflicts with article figures; relative comparison only"
    if "REBURN" in f:
        return "ADMITTED_WITH_FLAG", "second burn of the same physical specimen"
    return "ADMITTED", ""


def main():
    s1 = load("link2018_tableS1_microgravity.csv")
    s2 = load("link2018_tableS2_normal_gravity.csv")
    cw = load("crosswalk_link2018_S1_to_bass2_A3.csv")
    rows_by_label = {}
    for r in s1:
        rows_by_label.setdefault(r["sample_label_printed"], []).append(r)

    print("== Q1 admission decisions (Table S1 labels) ==")
    decisions = {}
    for c in cw:
        status, why = classify(c)
        decisions[c["link_label"]] = status
        print(f"{c['link_label']:>5} ({c['nasa_candidates']:<9}) {status:<19} {why}")

    print("\n== Within-burn differences, A = first tabulated (highest V_g) row, B = last tabulated row ==")
    print("label  d_cm  O2%   A: row  Vg   Vf  | B: row  Vg   Vf  | B-A (table units) | B-A um/s | (B-A)/A | monotonic?")
    for label, rs in rows_by_label.items():
        status = decisions[label]
        if status not in ("ADMITTED", "ADMITTED_WITH_FLAG", "CONDITIONAL"):
            continue
        if len(rs) < 2:
            continue
        a, b = rs[0], rs[-1]
        va, vb = float(a["vf_x1e3_printed"]), float(b["vf_x1e3_printed"])
        diff = round(vb - va, 2)
        vfs = [float(r["vf_x1e3_printed"]) for r in rs]
        mono = "non-increasing" if all(x >= y for x, y in zip(vfs, vfs[1:])) else "no"
        if status == "CONDITIONAL":
            um = f"{diff * UM_PER_UNIT['cm/s']:+.1f} (cm/s reading) or {diff * UM_PER_UNIT['mm/s']:+.2f} (mm/s as printed)"
        else:
            um = f"{diff * UM_PER_UNIT['cm/s']:+.1f}"
        print(f"{label:>5} {a['d_printed']:>5} {a['xo2_pct_printed']:>5}  {a['row_id']} {a['vg_printed']:>4} {a['vf_x1e3_printed']:>5} | "
              f"{b['row_id']} {b['vg_printed']:>4} {b['vf_x1e3_printed']:>5} | {diff:+.2f} | {um} | {diff / va:+.1%} | {mono}   [{status}]")

    print("\n== Negative case N1: nominally matched microgravity vs normal gravity (d = 0.95 cm, 18.5% O2, V_g = 2 cm/s) ==")
    ug = next(r for r in s1 if r["row_id"] == "S1-L20")
    g1 = next(r for r in s2 if r["row_id"] == "S2-R09")
    du = float(g1["vf_x1e3_printed"]) - float(ug["vf_x1e3_printed"])
    print(f"ug  {ug['row_id']} {ug['sample_label_printed']}: Vg {ug['vg_printed']} cm/s, Vf {ug['vf_x1e3_printed']} (single segment, dt {ug['dt_printed']} s)")
    print(f"1g  {g1['row_id']}: Vg {g1['vg_printed']} cm/s, Vf {g1['vf_x1e3_printed']} +/- {g1['pm_pct_printed']}% (mean of >=3 tests per caption)")
    print(f"arithmetic 1g - ug = {du:+.2f} table units = {du * 10:+.1f} um/s ({du / float(ug['vf_x1e3_printed']):+.1%}); "
          f"classification for a gravity-effect claim: INDETERMINATE (see evidence_case_02.md N1)")


if __name__ == "__main__":
    main()
