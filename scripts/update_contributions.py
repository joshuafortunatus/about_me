#!/usr/bin/env python3
import json
import re
import sys
import urllib.request

USERNAME = "joshuafortunatus"
URL = f"https://github.com/users/{USERNAME}/contributions"
OUT_PATH = "data/gh-contributions.json"

CELL_RE = re.compile(
    r'data-date="(?P<date>\d{4}-\d{2}-\d{2})"[^>]*data-level="(?P<level>\d)"[^>]*></td>\s*'
    r"<tool-tip[^>]*>(?P<text>[^<]*)</tool-tip>",
    re.S,
)
COUNT_RE = re.compile(r"(\d+) contributions?")


def fetch_html():
    req = urllib.request.Request(URL, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8")


def parse(html):
    days = []
    for m in CELL_RE.finditer(html):
        count_match = COUNT_RE.match(m.group("text"))
        count = int(count_match.group(1)) if count_match else 0
        days.append({"date": m.group("date"), "count": count, "level": int(m.group("level"))})
    days.sort(key=lambda d: d["date"])
    return days


def main():
    html = fetch_html()
    days = parse(html)
    if len(days) < 300:
        print(f"parsed only {len(days)} days, expected ~365 — aborting", file=sys.stderr)
        sys.exit(1)

    data = {"total": {"lastYear": sum(d["count"] for d in days)}, "contributions": days}
    with open(OUT_PATH, "w") as f:
        json.dump(data, f, indent=2)
        f.write("\n")

    print(f"wrote {len(days)} days, total {data['total']['lastYear']} contributions")


if __name__ == "__main__":
    main()
