from __future__ import annotations

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

PROMOTION_SIGNALS = (
    "apps.apple.com/gb/app/padelwrist",
    "/padel-score-tracker/",
    "/apple-watch-padel-scoring/",
    "/apple-watch-vs-phone-padel-scoring/",
    "/live-padel-score-iphone/",
    "/padel-match-history/",
    "/padel-player-statistics/",
    "/padel-match-sharing/",
)

SKIP = {"editorial-policy"}

CTA = (
    '<aside class="guide-cta reveal app-promo"><h2>Keep the score. Stay in the match.</h2>'
    '<p>PadelWrist keeps points, games, sets, tie-breaks and serving order visible on Apple Watch, iPhone and iPad, so you can concentrate on playing.</p>'
    '<a class="feedback-link" data-app-store-cta href="https://apps.apple.com/gb/app/padelwrist/id6799725420" target="_blank" rel="noopener noreferrer">Get PadelWrist on the App Store</a></aside>'
)

changed = []
for index_file in sorted(ROOT.glob("*/index.html")):
    slug = index_file.parent.name
    if slug in SKIP:
        continue

    html = index_file.read_text(encoding="utf-8")
    if not re.search(r'"@type"\s*:\s*"Article"', html):
        continue
    if any(signal in html for signal in PROMOTION_SIGNALS):
        continue

    marker = '<nav class="related-guides'
    pos = html.find(marker)
    if pos >= 0:
        html = html[:pos] + CTA + html[pos:]
    else:
        marker = "</article>"
        pos = html.find(marker)
        if pos < 0:
            raise RuntimeError(f"Could not find insertion point in {index_file.relative_to(ROOT)}")
        html = html[:pos] + CTA + html[pos:]

    index_file.write_text(html, encoding="utf-8")
    changed.append(str(index_file.relative_to(ROOT)))

print(f"Backfilled app promotion on {len(changed)} article(s).")
for path in changed:
    print(path)
