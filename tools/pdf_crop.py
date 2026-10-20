"""Render a horizontal strip of a PDF page around every hit of a search string, for visual verification.

Usage: py -3 -I pdf_crop.py <in.pdf> <page 1-based> <search text> <out_prefix> [dpi] [pad_pt_above] [pad_pt_below]
"""
import sys

import fitz


def main(src, page_no, needle, out_prefix, dpi="200", above="12", below="70"):
    doc = fitz.open(src)
    page = doc[int(page_no) - 1]
    hits = page.search_for(needle)
    print(f"{len(hits)} hit(s) for {needle!r} on page {page_no}")
    for k, r in enumerate(hits):
        clip = fitz.Rect(page.rect.x0, r.y0 - float(above), page.rect.x1, r.y1 + float(below))
        out = f"{out_prefix}_{k}.png"
        page.get_pixmap(dpi=int(dpi), clip=clip).save(out)
        print(out, tuple(round(v, 1) for v in r))


if __name__ == "__main__":
    main(*sys.argv[1:])
