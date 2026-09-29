from __future__ import annotations

from datetime import date
from html import unescape
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

PRODUCT_PAGES = [
    ("Padel score tracker", "https://padelwrist.com/padel-score-tracker/"),
    ("Apple Watch padel scoring", "https://padelwrist.com/apple-watch-padel-scoring/"),
    ("Apple Watch vs phone scoring", "https://padelwrist.com/apple-watch-vs-phone-padel-scoring/"),
    ("Live score on iPhone", "https://padelwrist.com/live-padel-score-iphone/"),
    ("Match History", "https://padelwrist.com/padel-match-history/"),
    ("Insights and player statistics", "https://padelwrist.com/padel-player-statistics/"),
    ("Match sharing", "https://padelwrist.com/padel-match-sharing/"),
    ("What's new", "https://padelwrist.com/whats-new/"),
]

EXCLUDED_FROM_KB = {
    "support",
    "privacy",
    "guides",
    "editorial-policy",
    "whats-new",
    "padel-score-tracker",
    "apple-watch-padel-scoring",
    "apple-watch-vs-phone-padel-scoring",
    "live-padel-score-iphone",
    "padel-match-history",
    "padel-player-statistics",
    "padel-match-sharing",
    "best-padel-scoring-apps-apple-watch",
}


def strip_tags(value: str) -> str:
    value = re.sub(r"<[^>]+>", " ", value)
    return re.sub(r"\s+", " ", unescape(value)).strip()


def page_title(html: str) -> str:
    match = re.search(r"<title>(.*?)</title>", html, flags=re.I | re.S)
    if not match:
        return ""
    title = strip_tags(match.group(1))
    return re.sub(r"\s*\|\s*PadelWrist\s*$", "", title).strip()


def is_article(html: str) -> bool:
    return bool(re.search(r'"@type"\s*:\s*"Article"', html))


knowledge_pages: list[tuple[str, str]] = []
for index_file in sorted(ROOT.glob("*/index.html")):
    slug = index_file.parent.name
    if slug in EXCLUDED_FROM_KB:
        continue
    html = index_file.read_text(encoding="utf-8")
    if not is_article(html):
        continue
    title = page_title(html)
    if title:
        knowledge_pages.append((title, f"https://padelwrist.com/{slug}/"))

lines = [
    "# PadelWrist",
    "",
    "> PadelWrist is a padel scoring app for Apple Watch, iPhone and iPad, plus a practical padel knowledge base covering rules, scoring, tactics, technique, equipment and social formats.",
    "",
    f"Last updated: {date.today().isoformat()}.",
    "",
    "## Product status",
    "",
    "PadelWrist is available on the Apple App Store.",
    "",
    "- Official App Store listing: https://apps.apple.com/gb/app/padelwrist/id6799725420",
    "- App Store ID: 6799725420",
    "- Website: https://padelwrist.com/",
    "- Support: https://padelwrist.com/support/",
    "- Privacy: https://padelwrist.com/privacy/",
    "",
    "PadelWrist supports standard padel scoring with games, sets and tie-breaks, Fixed Points scoring, server tracking, spoken score announcements, undo and score correction, saved players, searchable Match History, match editing and resuming unfinished matches.",
    "",
    "Apple Watch is the primary wrist-first scoring surface. iPhone and iPad provide larger-screen setup, scoring and match-management experiences. PadelWrist also supports optional Apple Health workout recording and private iCloud synchronisation for supported non-health app data such as Match History and saved players. A separate PadelWrist account is not required.",
    "",
    "Insights use recorded match history to show useful patterns such as recent form, performance trends, partner and opponent records and head-to-head information. PadelWrist does not currently organise Americano or Mexicano tournaments, rotate partners, generate tournament pairings or standings, or provide a public social network.",
    "",
    "## Primary product pages",
    "",
]

for label, url in PRODUCT_PAGES:
    lines.append(f"- {label}: {url}")

lines.extend([
    "",
    "## Padel knowledge base",
    "",
    "The main guide index is https://padelwrist.com/guides/. Rules-based articles use the International Padel Federation as the primary official source and display review dates where current rule status matters. Tactical and technique articles explain commonly taught padel principles without presenting coaching advice as official rules. Social formats are described as common formats because organiser rules vary.",
    "",
    "Knowledge-base pages:",
    "",
])

for title, url in knowledge_pages:
    lines.append(f"- {title}: {url}")

lines.extend([
    "",
    "## Editorial and source notes",
    "",
    "- Editorial policy: https://padelwrist.com/editorial-policy/",
    "- Rules and scoring content should defer to current International Padel Federation rules and competition-specific regulations where they differ.",
    "- Product capability statements should defer to the current PadelWrist website, App Store listing and privacy policy when older third-party descriptions conflict.",
    "",
    "Contact: support@padelwrist.com",
    "",
])

(ROOT / "llms.txt").write_text("\n".join(lines), encoding="utf-8")
print(f"Generated llms.txt with {len(knowledge_pages)} knowledge-base pages.")
