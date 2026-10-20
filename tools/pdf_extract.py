"""Extract per-page text and optional page renders from a PDF (PyMuPDF).

Usage: py -3 -I pdf_extract.py <in.pdf> <out_dir> [dpi] [first_page-last_page]
Writes page_NNN.txt for every page; renders page_NNN.png at `dpi` for the page range (1-based) when given.
"""
import os
import sys

import fitz


def main(src, out_dir, dpi=None, page_range=None):
    os.makedirs(out_dir, exist_ok=True)
    doc = fitz.open(src)
    lo, hi = 1, doc.page_count
    if page_range:
        lo, hi = (int(x) for x in page_range.split("-"))
    print(f"pages={doc.page_count} metadata={doc.metadata}")
    for i, page in enumerate(doc, start=1):
        with open(os.path.join(out_dir, f"page_{i:03d}.txt"), "w", encoding="utf-8") as f:
            f.write(page.get_text("text"))
        if dpi and lo <= i <= hi:
            page.get_pixmap(dpi=int(dpi)).save(os.path.join(out_dir, f"page_{i:03d}.png"))


if __name__ == "__main__":
    main(*sys.argv[1:])
