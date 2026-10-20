"""Candidate crosswalk: Link et al. 2018 Table S1 sample labels -> NASA TM-20210011385 Table A.3 test numbers.

Usage (from repo root): py -3 -I research/analysis/crosswalk.py
Writes research/data/crosswalk_link2018_S1_to_bass2_A3.csv and prints a summary.

Matching is a hypothesis, not an identity proof. A Link label <prefix><n><suffix> is paired with every NASA test
"P<n>" whose suffix agrees (or with all P<n>* tests when Link has no suffix). Each pairing is then scored on four
independent attributes, and every disagreement is written out as a flag rather than resolved.
"""
import csv
import os
import re
from collections import OrderedDict, defaultdict

DATA = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
PREFIX_COLOUR = {"B": "black", "C": "clear"}  # Table S1 caption defines B and C only


def load(name):
    with open(os.path.join(DATA, name), newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def main():
    s1 = load("link2018_tableS1_microgravity.csv")
    a3 = load("bass2_TM20210011385_tableA3_rods.csv")

    # Specimen reuse: order burns of one physical sample number by as-run test number.
    burns = defaultdict(list)
    for t in a3:
        burns[t["sample_number_printed"]].append(t)
    for v in burns.values():
        v.sort(key=lambda t: int(t["as_run_test_number"]))

    labels = OrderedDict()
    for r in s1:
        labels.setdefault(r["sample_label_printed"], []).append(r)

    out, used = [], set()
    for label, rs in labels.items():
        m = re.fullmatch(r"([A-Z])(\d+)([a-z]?)", label)
        prefix, num, suf = m.groups()
        cands = [t for t in a3 if re.fullmatch(rf"P{num}{suf}" if suf else rf"P{num}[a-z]?", t["test_number"])]
        d_cm, xo2 = float(rs[0]["d_printed"]), rs[0]["xo2_pct_printed"]
        link_colour = PREFIX_COLOUR.get(prefix, "undefined prefix")
        flags = []
        if not cands:
            flags.append("NO_NASA_CANDIDATE")
        if len(cands) > 1:
            flags.append("AMBIGUOUS_MULTIPLE_NASA_TESTS")
        if prefix not in PREFIX_COLOUR:
            flags.append(f"LINK_PREFIX_{prefix}_UNDEFINED_IN_CAPTION")
        for t in cands:
            used.add(t["test_number"])
            if abs(d_cm * 10 - float(t["diameter_mm_from_material"])) > 0.1:
                flags.append(f"DIAMETER_MISMATCH_{t['test_number']}")
            if t["color_from_material"] == "not stated":
                flags.append(f"NASA_COLOUR_NOT_STATED_{t['test_number']}")
            elif link_colour in PREFIX_COLOUR.values() and t["color_from_material"] != link_colour:
                flags.append(f"COLOUR_MISMATCH_{t['test_number']}")
            if float(t["cal_o2_initial_vol_pct"]) != float(xo2):
                flags.append(f"O2_MISMATCH_{t['test_number']}(Link {xo2} vs NASA cal-initial {t['cal_o2_initial_vol_pct']})")
            if t["config_printed_in_col_headed_sample_distance"] != "Opposed":
                flags.append(f"FLOW_CONFIG_CONFLICT_{t['test_number']}(NASA {t['config_printed_in_col_headed_sample_distance']} vs Link opposed)")
            seq = burns[t["sample_number_printed"]]
            pos = [x["test_number"] for x in seq].index(t["test_number"])
            if pos > 0:
                flags.append(f"SPECIMEN_REBURN_{t['test_number']}(burn {pos + 1} of {t['sample_number_printed']}; earlier: {','.join(x['test_number'] for x in seq[:pos])})")
            if "column-shifted" in t["transcription_note"]:
                flags.append(f"NASA_ROW_ANOMALY_{t['test_number']}")
            if "also appears as" in t["transcription_note"]:
                flags.append(f"SPECIMEN_PRIOR_USE_OUTSIDE_A3_{t['test_number']}({t['transcription_note']})")
        v_g = [float(r["vg_printed"]) for r in rs]
        if len(set(v_g)) < len(v_g):
            flags.append("DUPLICATE_VG_WITHIN_LABEL")
        if rs[0]["vf_x1e3_unit_label_printed"] != "cm/s":
            flags.append("VF_UNIT_LABEL_CONFLICT(right half printed mm/s)")
        out.append({
            "link_label": label,
            "link_rows": f"{rs[0]['row_id']}..{rs[-1]['row_id']}" if len(rs) > 1 else rs[0]["row_id"],
            "n_rows": len(rs),
            "link_d_cm": rs[0]["d_printed"],
            "link_xo2_pct": xo2,
            "link_colour_from_prefix": link_colour,
            "nasa_candidates": ";".join(t["test_number"] for t in cands),
            "nasa_specimen": ";".join(sorted({t["sample_number_printed"] for t in cands})),
            "nasa_material": ";".join(t["material_printed"] for t in cands),
            "nasa_config": ";".join(t["config_printed_in_col_headed_sample_distance"] for t in cands),
            "nasa_cal_o2_initial_final": ";".join(f"{t['cal_o2_initial_vol_pct']}->{t['cal_o2_final_vol_pct']}" for t in cands),
            "flags": " | ".join(flags) if flags else "",
        })

    path = os.path.join(DATA, "crosswalk_link2018_S1_to_bass2_A3.csv")
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(out[0]))
        w.writeheader()
        w.writerows(out)

    for o in out:
        print(f"{o['link_label']:>5} -> {o['nasa_candidates'] or '-':<10} {o['nasa_config']:<11} {o['flags'] or 'no flags'}")
    unmatched = [t["test_number"] for t in a3 if t["test_number"] not in used]
    print(f"\n{len(out)} Link labels; {sum(1 for o in out if o['nasa_candidates'])} with >=1 NASA candidate; "
          f"{sum(1 for o in out if not o['flags'])} with no flags")
    print("NASA Table A.3 tests with no Link label:", ", ".join(unmatched))
    print("wrote", os.path.relpath(path))


if __name__ == "__main__":
    main()
