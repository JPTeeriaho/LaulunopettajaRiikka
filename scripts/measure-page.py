#!/usr/bin/env python3
"""Measure element sizes on a web page at multiple viewport widths using Playwright.
Usage: python3 scripts/measure-page.py [URL] [--widths 1280,1920,2560]
"""

import argparse, json, sys
from playwright.sync_api import sync_playwright

VIEWPORTS = [1280, 1920, 2560]
SELECTORS = [
    ("Main content wrapper", "div.max-w-\\[960px\\], div[class*='max-w-']"),
    ("Pricing table", "table"),
    ("Booking CTA section", "section:has(a[href*='vello'])"),
    ("Booking text div", "section:has(a[href*='vello']) > div:first-child"),
    ("Contact grid", "section#yhteystiedot, section#contact"),
    ("Body", "body"),
]

def measure(page, label, sel, vp_width):
    els = page.query_selector_all(sel)
    results = []
    for i, el in enumerate(els):
        box = el.bounding_box()
        if box:
            results.append({
                "element": f"{label}[{i}]" if len(els) > 1 else label,
                "selector": sel,
                "viewport": vp_width,
                "x": round(box["x"], 1),
                "y": round(box["y"], 1),
                "width": round(box["width"], 1),
                "height": round(box["height"], 1),
                "pct_of_viewport": round(box["width"] / vp_width * 100, 1),
            })
    return results

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("url", nargs="?", default="http://localhost:4321/hinnat")
    parser.add_argument("--widths", default=",".join(str(w) for w in VIEWPORTS))
    parser.add_argument("--screenshot", action="store_true", help="Save screenshots")
    args = parser.parse_args()
    widths = [int(w) for w in args.widths.split(",")]

    all_results = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for vp_w in widths:
            page = browser.new_page(viewport={"width": vp_w, "height": 900})
            page.goto(args.url, wait_until="networkidle")
            page.wait_for_timeout(500)

            if args.screenshot:
                page.screenshot(path=f"/tmp/page_{vp_w}.png", full_page=True)
                print(f"  Screenshot: /tmp/page_{vp_w}.png", file=sys.stderr)

            for label, sel in SELECTORS:
                all_results.extend(measure(page, label, sel, vp_w))

            page.close()
        browser.close()

    # Pretty print results grouped by viewport
    for vp_w in widths:
        print(f"\n{'='*60}")
        print(f"  VIEWPORT: {vp_w}px")
        print(f"{'='*60}")
        vp_results = [r for r in all_results if r["viewport"] == vp_w]
        for r in vp_results:
            pct = r["pct_of_viewport"]
            flag = " ⚠ NARROW" if pct < 60 and r["element"] not in ("Body",) else ""
            print(f"  {r['element']:30s}  {r['width']:7.0f}px  ({pct:5.1f}% of viewport){flag}")
            if r["height"] > 300:
                print(f"  {'':30s}  height: {r['height']:.0f}px")

if __name__ == "__main__":
    main()
