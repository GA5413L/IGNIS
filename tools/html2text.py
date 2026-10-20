"""Convert a saved HTML page to readable text (stdlib + bs4). Usage: py -3 -I html2text.py in.html [out.txt]"""
import sys

from bs4 import BeautifulSoup


def main(src, dst=None):
    with open(src, "rb") as f:
        soup = BeautifulSoup(f.read(), "html.parser")
    for tag in soup(["script", "style", "noscript", "svg"]):
        tag.decompose()
    lines = [ln.strip() for ln in soup.get_text("\n").splitlines()]
    text = "\n".join(ln for ln in lines if ln)
    if dst:
        with open(dst, "w", encoding="utf-8") as f:
            f.write(text)
    else:
        sys.stdout.reconfigure(encoding="utf-8")
        print(text)


if __name__ == "__main__":
    main(*sys.argv[1:])
