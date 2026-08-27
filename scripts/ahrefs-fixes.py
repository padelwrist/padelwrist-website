from pathlib import Path
import re

ROOT = Path('.')
SOCIAL_IMAGE = 'https://padelwrist.com/assets/padelwrist-social-card.png'

META_DESCRIPTIONS = {
    '/privacy/': 'Read the PadelWrist privacy policy covering app and website data, analytics, subscriptions, optional fitness features, support and your data rights.',
    '/why-net-position-matters-padel/': 'Why net position matters in padel, how to take the net safely, when to retreat and how doubles partners should move together.',
    '/move-as-pair-padel/': 'Learn how padel partners should move together at the net and back of court, protect the middle and avoid the one-up-one-back split.',
    '/who-takes-middle-ball-padel/': 'Learn who should take the middle ball in padel using forehand priority, handedness, movement, ball height and clear partner communication.',
    '/first-padel-game/': 'Playing padel for the first time? Learn what to wear, bring and expect, plus the key serve, wall and etiquette basics before you play.',
    '/stop-getting-lobbed-padel/': 'Learn how to stop getting lobbed in padel by adjusting net position, reading contact early, choosing the right overhead and retreating together.',
    '/padel-match-history/': 'Keep a simple padel match history with PadelWrist. Review results, edit saved matches, resume unfinished matches and manage history on iPhone or iPad.',
    '/playing-against-tennis-players-padel/': 'Learn how to play against hard-hitting tennis players in padel using the glass, lobs, net control and smarter rally selection.',
    '/defend-fast-balls-back-glass-padel/': 'Learn how to defend hard padel shots off the back glass using better spacing, compact swings, rebound reading and safer resets.',
    '/left-handed-padel-partner/': 'Learn how to play with a left-handed padel partner, including side selection, middle-ball responsibility, overhead coverage and positioning.',
    '/defend-corner-glass-padel/': 'Learn how to read and defend padel balls in the back-and-side-glass corner, including spacing, rebound order and movement after one or two walls.',
    '/best-padel-scoring-apps-apple-watch/': 'Compare Apple Watch padel scoring apps including PadelWrist, Padel - Score, Padel Score Watch Counter, PadelScore and ScorePadel.',
}


def page_url(path: Path) -> str:
    if path == Path('index.html'):
        return 'https://padelwrist.com/'
    return f"https://padelwrist.com/{path.parent.as_posix()}/"


def meta_content(html: str, pattern: str):
    m = re.search(pattern, html, re.I)
    return m.group(1) if m else None


def insert_before_script_or_styles(html: str, tags: str) -> str:
    marker = '<script type="application/ld+json">'
    if marker in html:
        return html.replace(marker, tags + marker, 1)
    marker = '<link rel="stylesheet"'
    if marker in html:
        return html.replace(marker, tags + marker, 1)
    return html.replace('</head>', tags + '</head>', 1)


changed = []
for path in sorted(ROOT.glob('**/*.html')):
    if '.git' in path.parts:
        continue
    html = path.read_text(encoding='utf-8')
    original = html
    url = page_url(path)
    route = '/' if url == 'https://padelwrist.com/' else '/' + path.parent.as_posix().strip('/') + '/'

    # Avoid linking crawlers through a deliberate 302 for the legacy raster mark.
    html = html.replace('https://padelwrist.com/assets/padelwrist-mark.png', 'https://padelwrist.com/assets/padelwrist-mark-v2.svg')
    html = html.replace('src="/assets/padelwrist-mark.png"', 'src="/assets/padelwrist-mark-v2.svg"')

    # Keep descriptions within normal snippet guidance without making them vague.
    if route in META_DESCRIPTIONS:
        desc = META_DESCRIPTIONS[route]
        html = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{desc}">', html, count=1, flags=re.I)

    canonical = meta_content(html, r'<link rel="canonical" href="([^"]+)">') or url
    title = meta_content(html, r'<meta property="og:title" content="([^"]+)">') or meta_content(html, r'<title>(.*?)</title>') or 'PadelWrist'
    desc = meta_content(html, r'<meta property="og:description" content="([^"]+)">') or meta_content(html, r'<meta name="description" content="([^"]+)">') or 'Padel scoring for Apple Watch, iPhone and iPad.'
    image = meta_content(html, r'<meta property="og:image" content="([^"]+)">') or SOCIAL_IMAGE

    # Complete Open Graph metadata. Ahrefs expects title, description, image, URL and type.
    additions = []
    if not re.search(r'<meta property="og:site_name"', html, re.I):
        additions.append('<meta property="og:site_name" content="PadelWrist">')
    if not re.search(r'<meta property="og:url"', html, re.I):
        additions.append(f'<meta property="og:url" content="{canonical}">')
    if not re.search(r'<meta property="og:type"', html, re.I):
        additions.append(f'<meta property="og:type" content="{("website" if route in ["/", "/guides/", "/support/", "/privacy/"] else "article")}">')

    # Add a complete X/Twitter card wherever one is absent.
    if not re.search(r'<meta name="twitter:card"', html, re.I):
        additions.extend([
            '<meta name="twitter:card" content="summary_large_image">',
            f'<meta name="twitter:title" content="{title}">',
            f'<meta name="twitter:description" content="{desc}">',
            f'<meta name="twitter:image" content="{image}">',
        ])

    if additions:
        html = insert_before_script_or_styles(html, ''.join(additions))

    if html != original:
        path.write_text(html, encoding='utf-8')
        changed.append(path.as_posix())

print(f'Updated {len(changed)} HTML files')
for p in changed:
    print(p)
