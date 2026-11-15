"""Acquire the small official/public source subset for the first IGNIS build (event time, 14 Nov 2026).

Normal TLS verification. Saves bytes under the given folder (gitignored _raw/) and writes a manifest with
URL, resolved URL, UTC time, HTTP status, content type, byte count and SHA-256 of the bytes actually received.
An expected (inherited) hash is compared, never copied into the observed field.

Usage: py -3 -I tools/acquire_event_sources.py <out_dir>
"""
import hashlib
import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) IGNIS-research (Emberfall, NASA Space Apps 2026)"
SOURCES = [
    # id, url, filename, expected sha256 (inherited, from master Appendix A.3) or None
    ("S-V", "https://ntrs.nasa.gov/api/citations/20240008602/downloads/ICES-2024-310.pdf", "S-V_ICES-2024-310.pdf",
     "07ea967bf3b9e45f9cae5cbc07075ad465e9eba6ee0298f933319e400fde9016"),
    ("S-VI", "https://ntrs.nasa.gov/api/citations/20250002675/downloads/Vehicle%20Modeling_FINAL.pdf", "S-VI_ICES-2025-156.pdf",
     "56cb93f9426df599bb34c6f2059e8649a5a59aaf3ac6d83c9e3cdf4312a5b75d"),
    ("S-CAL", "https://ntrs.nasa.gov/api/citations/20240002981/downloads/Saffire-ICES-2024-ICES-365-accepted%20final.pdf",
     "S-CAL_ICES-2024-365.pdf", "7f875da1d6abeeeeac64aeba67d3f160074cf98430e714fe7606b34b37e0aa59"),
    ("NAV-D", "https://www.nasa.gov/wp-content/uploads/2025/07/smoke-aerosol-measurement-experiment-same.pdf",
     "NAV-D_SAME_overview.pdf", None),
    ("R14", "https://ntrs.nasa.gov/api/citations/20210022617/downloads/JASMAC-33%20FLEX%20w%20video.pdf",
     "R14_JASMAC-33_FLEX.pdf", None),
    ("NAV-S", "https://www.nasa.gov/missions/station/20-breakthroughs-from-20-years-of-science-aboard-the-international-space-station/",
     "NAV-S_20_breakthroughs.html", None),
    ("R09", "https://www.nist.gov/publications/evaluation-spacecraft-smoke-detector-performance-low-gravity-environment",
     "R09_NIST_detector_publication.html", None),
    ("R10", "https://www.nist.gov/news-events/news/2018/05/nistnasa-study-shows-one-detector-doesnt-fit-all-smoke-spacecraft",
     "R10_NIST_news_2018.html", None),
    ("R15", "https://www.nasa.gov/missions/station/studying-combustion-and-fire-safety/", "R15_studying_combustion.html", None),
    ("R31", "https://www.nasa.gov/humans-in-space/the-flame-of-discovery-grows-as-saffire-sets-new-fires-in-space/",
     "R31_saffire_flame_of_discovery.html", None),
    ("NR02", "https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/",
     "NR02_glenn_combustion_science.html", None),
    ("F02", "https://doi.org/10.1016/j.proci.2024.105358", "F02_proci_2024_105358.html", None),
    ("R32", "https://psi.nasa.gov/physci/repo/data/investigations/PSI-69", "R32_PSI-69.html", None),
]


def main(out):
    out = Path(out)
    out.mkdir(parents=True, exist_ok=True)
    rows = []
    for sid, url, name, expected in SOURCES:
        t = datetime.now(timezone.utc).isoformat(timespec="seconds")
        row = {"id": sid, "url": url, "file": name, "retrieved_utc": t, "expected_sha256": expected}
        try:
            r = requests.get(url, headers={"User-Agent": UA}, timeout=90, allow_redirects=True)
            body = r.content
            row.update(status=r.status_code, resolved_url=r.url, content_type=r.headers.get("content-type"),
                       bytes=len(body))
            if r.status_code == 200 and body:
                (out / name).write_bytes(body)
                h = hashlib.sha256(body).hexdigest()
                row.update(observed_sha256=h, expected_match=(h == expected) if expected else None)
            else:
                row.update(observed_sha256=None, expected_match=None, note="not saved: non-200 or empty")
        except requests.RequestException as e:
            row.update(status=None, error=f"{type(e).__name__}: {e}"[:300], observed_sha256=None, expected_match=None)
        rows.append(row)
        print(f"{sid:6} {row.get('status')} {row.get('bytes')} match={row.get('expected_match')} {row.get('error', '')}")
        time.sleep(0.5)
    (out / "acquisition_manifest.json").write_text(json.dumps(rows, indent=1) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main(sys.argv[1])
