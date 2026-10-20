"""Check the manual transcriptions in research/data/ against the PDF text layers they came from.

Usage (from repo root):
    py -3 -I research/analysis/verify_transcriptions.py _raw/link2018/41598_2017_18398_MOESM1_ESM.pdf \
        _raw/ntrs_20210011385/TM-20210011385.pdf

What is checked:
  * Link 2018 Tables S1 and S2: the multiset of printed data cells in the CSV (merged cells counted once,
    via the *_cell_start flags) must equal the multiset of tokens in the PDF text layer's table region.
  * NASA TM-20210011385 Table 2.1: every printed cell appears in the page's text layer.
  * NASA Table A.3: test number, as-run number, sample number and calibrated O2 cells appear on the stated page.
What is NOT checked: row/column placement of merged cells (that was checked visually) and the meaning of any value.
"""
import csv
import os
import re
import sys
from collections import Counter

import fitz

DATA = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")


def rows(name):
    with open(os.path.join(DATA, name), newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def page_lines(pdf, page_no):
    return [ln.strip() for ln in fitz.open(pdf)[page_no - 1].get_text("text").splitlines()]


def region_tokens(lines, first, last):
    """Tokens between the first line equal to `first` (inclusive, after the header) and the last data line."""
    start = lines.index(first)
    end = max(i for i, ln in enumerate(lines) if ln == last)
    return Counter(ln for ln in lines[start:end + 1] if ln)


def csv_tokens(table, cols_always, merged):
    c = Counter()
    for r in table:
        for col in cols_always:
            c[r[col]] += 1
        for col, flag in merged:
            if r[flag] == "1":
                c[r[col]] += 1
    return c


def positional(label, table, lines, value_cols, label_cols):
    """Row placement check. With merged-cell label tokens (d, O2, sample) removed, the text layer reads the
    per-row value cells in visual row order, left half then right half. Relies on label tokens never
    colliding with value tokens, which is asserted rather than assumed."""
    label_tokens = {r[c] for r in table for c in label_cols}
    value_tokens = {r[c] for r in table for c in value_cols}
    clash = label_tokens & value_tokens
    if clash:
        print(f"[FAIL] {label}: label/value token collision {sorted(clash)}; positional check not possible")
        return False
    got = [ln for ln in lines if ln and ln not in label_tokens]
    by_half = {h: [r for r in table if r["half"] == h] for h in ("left", "right")}
    want = []
    for i in range(max(len(v) for v in by_half.values())):
        for h in ("left", "right"):
            if i < len(by_half[h]):
                want.extend(by_half[h][i][c] for c in value_cols)
    ok = got == want
    first_diff = next((k for k, (a, b) in enumerate(zip(got, want)) if a != b), None)
    print(f"[{'PASS' if ok else 'FAIL'}] {label}: row-order sequence of {len(want)} value cells"
          + ("" if ok else f"; first mismatch at position {first_diff}: PDF {got[first_diff:first_diff + 3]} vs CSV {want[first_diff:first_diff + 3]}"))
    return ok


def compare(label, expected, found):
    missing, extra = found - expected, expected - found
    ok = not missing and not extra
    print(f"[{'PASS' if ok else 'FAIL'}] {label}: {sum(expected.values())} transcribed cells vs {sum(found.values())} text-layer tokens")
    if missing:
        print("    in PDF but not in CSV:", dict(missing))
    if extra:
        print("    in CSV but not in PDF:", dict(extra))
    return ok


def main(esm_pdf, ntrs_pdf):
    results = []

    s1 = rows("link2018_tableS1_microgravity.csv")
    lines = page_lines(esm_pdf, 1)
    # Data region: from the first data cell after the "(mm/s)" header to the last P17 rate.
    hdr = max(i for i, ln in enumerate(lines) if ln == "(mm/s)")
    found = Counter(ln for ln in lines[hdr + 1:] if ln)
    expected = csv_tokens(s1, ["vg_printed", "dt_printed", "vf_x1e3_printed"],
                          [("d_printed", "d_cell_start"), ("xo2_pct_printed", "xo2_cell_start"),
                           ("sample_label_printed", "sample_cell_start")])
    results.append(compare("Link 2018 Table S1 (52 rows)", expected, found))
    results.append(positional("Link 2018 Table S1", s1, lines[hdr + 1:], ["vg_printed", "dt_printed", "vf_x1e3_printed"],
                              ["d_printed", "xo2_pct_printed", "sample_label_printed"]))

    s2 = rows("link2018_tableS2_normal_gravity.csv")
    lines = page_lines(esm_pdf, 2)
    hdr = max(i for i, ln in enumerate(lines) if ln == "(%)")
    fig = next(i for i, ln in enumerate(lines) if ln.startswith("Figure S1"))
    found = Counter(ln for ln in lines[hdr + 1:fig] if ln)
    expected = csv_tokens(s2, ["vg_printed", "vf_x1e3_printed", "pm_pct_printed"],
                          [("d_printed", "d_cell_start"), ("xo2_pct_printed", "xo2_cell_start")])
    results.append(compare("Link 2018 Table S2 (46 rows)", expected, found))
    # "-" and "2" are value tokens in S2; O2 and diameter tokens never equal them (asserted inside).
    results.append(positional("Link 2018 Table S2", s2, lines[hdr + 1:fig], ["vg_printed", "vf_x1e3_printed", "pm_pct_printed"],
                              ["d_printed", "xo2_pct_printed"]))

    t21 = rows("bass2_TM20210011385_table2_1.csv")
    text = fitz.open(ntrs_pdf)[int(t21[0]["pdf_page"]) - 1].get_text("text").replace("±", "±")
    page_tokens = set(text.split())
    want = [r[c] for r in t21 for c in ("o2_pct_printed", "experiment_printed", "computation_printed", "theory_eq2_5_printed")]
    miss = [w for w in want if w not in page_tokens]
    ok = not miss and "28" in page_tokens and "TABLE 2.1" in text
    print(f"[{'PASS' if ok else 'FAIL'}] NASA TM Table 2.1: {len(want)} cells present on PDF p.{t21[0]['pdf_page']}" + (f"; missing {miss}" if miss else ""))
    results.append(ok)

    a3 = rows("bass2_TM20210011385_tableA3_rods.csv")
    doc = fitz.open(ntrs_pdf)
    bad = []
    for r in a3:
        toks = set(re.split(r"\s+", doc[int(r["pdf_page"]) - 1].get_text("text")))
        for col in ("test_number", "as_run_test_number", "sample_number_printed", "cal_o2_initial_vol_pct", "cal_o2_final_vol_pct"):
            if r[col] not in toks:
                bad.append((r["test_number"], col, r[col]))
    ok = not bad
    print(f"[{'PASS' if ok else 'FAIL'}] NASA TM Table A.3: key cells of {len(a3)} tests present on stated pages" + (f"; not found {bad}" if bad else ""))
    results.append(ok)

    print(f"\n{sum(results)}/{len(results)} checks passed")
    return 0 if all(results) else 1


if __name__ == "__main__":
    sys.exit(main(*sys.argv[1:]))
