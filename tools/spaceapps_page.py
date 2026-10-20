"""Fetch a public Space Apps page body via the site's own GraphQL endpoint (the same call the website makes).

Usage: py -3 -I spaceapps_page.py <site path, e.g. /2026/challenges/slug/> <out.json>
"""
import json
import sys

import requests

QUERY = """
query PageByPath($input: String!) {
  pageByPath(path: $input) {
    __typename
    id
    title
    ... on ChallengePage { event skills excerpt detailsContent resourcesTabContent teamsTabContent }
  }
}
"""


def main(path, out):
    r = requests.post(
        "https://api.spaceappschallenge.org/graphql",
        json={"query": QUERY, "variables": {"input": path}},
        headers={"User-Agent": "IGNIS-research", "Origin": "https://www.spaceappschallenge.org"},
        timeout=60,
    )
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"status": r.status_code, "path": path, "body": r.json() if r.ok else r.text}, f, indent=2, ensure_ascii=False)
    print(r.status_code, out)


if __name__ == "__main__":
    main(*sys.argv[1:])
