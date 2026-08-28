from pathlib import Path


def replace_all(path, replacements):
    p = Path(path)
    text = p.read_text()
    for old, new in replacements:
        if old not in text:
            raise SystemExit(f'Missing expected text in {path}: {old[:100]!r}')
        text = text.replace(old, new)
    p.write_text(text)


replace_all('index.html', [
    ('<meta name="description" content="Score padel matches on Apple Watch, iPhone or iPad with PadelWrist. Get live sync, spoken scores, server tracking, match history and offline scoring.">', '<meta name="description" content="Score padel on Apple Watch, iPhone or iPad with PadelWrist. Version 1.3 adds Player Intelligence, match sharing, richer scoring controls and workout context.">'),
    ('<meta property="og:description" content="Score padel from your wrist, keep the live match in sync across Apple devices and save your match history without an account.">', '<meta property="og:description" content="Score padel across Apple Watch, iPhone and iPad, then analyse, share and review the match with the new features in PadelWrist 1.3.">'),
    ('<meta name="twitter:description" content="Padel scoring for Apple Watch, iPhone and iPad, with live match continuity, history and spoken scores.">', '<meta name="twitter:description" content="PadelWrist 1.3 combines wrist-first scoring with Player Intelligence, sharing, richer match rules and workout context.">'),
    ('"description":"A padel scoring app for Apple Watch, iPhone and iPad with wrist-first scoring, live match continuity, spoken scores, server tracking and local match history."', '"description":"A padel scoring and match companion for Apple Watch, iPhone and iPad with wrist-first scoring, Player Intelligence, match sharing, configurable rules and workout context."'),
    ('"Resume unfinished matches","No account required"]', '"Resume unfinished matches","Player Intelligence and performance trends","Partner and opponent analysis","Head-to-head records and match timelines","Match result sharing","Live match sharing","Expanded scoring-rule configuration","Optional Health and workout context","No account required"]'),
    ('<a href="/whats-new/">What\'s next</a>', '<a href="/whats-new/">What\'s new</a>'),
    ('<p class="section-kicker">Coming in PadelWrist 1.3</p>', '<p class="section-kicker">New in PadelWrist 1.3</p>'),
    ('<p>Version 1.3 is the next step beyond scorekeeping: richer player insight, better ways to share a match, more flexible rules and optional workout context. The live scoring experience stays focused and fast.</p>', '<p>Version 1.3 is live now, adding richer player insight, better ways to share a match, more flexible rules and optional workout context while keeping the live scoring experience focused and fast.</p>'),
    ('<p>Planned performance views include trends, partner and opponent analysis, head-to-head records, point timelines, momentum and deeper filters where the recorded match data can support a truthful insight.</p>', '<p>Player Intelligence now brings together trends, partner and opponent analysis, head-to-head records, point timelines, momentum and deeper filters where the recorded match data can support a truthful insight.</p>'),
    ('<p>1.3 work includes richer result sharing and live match sharing flows, designed to work without turning PadelWrist into a social network or requiring an account for the core experience.</p>', '<p>Version 1.3 includes richer result sharing and live match sharing flows, designed to work without turning PadelWrist into a social network or requiring an account for the core experience.</p>'),
    ('<p>Expanded scoring-rule configuration and optional Health/workout context are being prepared alongside the existing Standard Match and Fixed Points modes.</p>', '<p>Expanded scoring-rule configuration and optional Health/workout context now sit alongside the existing Standard Match and Fixed Points modes.</p>'),
    ('See what is planned for 1.3', 'See what\'s new in 1.3')
])

replace_all('assets/site.js', [
    ('>What\'s next<', '>What\'s new<')
])

replace_all('whats-new/index.html', [
    ("<title>What's Coming in PadelWrist 1.3 | PadelWrist</title>", "<title>What's New in PadelWrist 1.3 | PadelWrist</title>"),
    ('<meta name="description" content="Preview PadelWrist 1.3: Player Intelligence, richer match sharing, expanded scoring controls and optional workout context across Apple devices.">', '<meta name="description" content="Discover what is new in PadelWrist 1.3: Player Intelligence, richer match sharing, expanded scoring controls and optional workout context across Apple devices.">'),
    ("<meta property=\"og:site_name\" content=\"PadelWrist\"><meta property=\"og:title\" content=\"What's Coming in PadelWrist 1.3\">", "<meta property=\"og:site_name\" content=\"PadelWrist\"><meta property=\"og:title\" content=\"What's New in PadelWrist 1.3\">"),
    ('content="A preview of the next PadelWrist release, including Player Intelligence, sharing, scoring configuration and optional workout context."', 'content="PadelWrist 1.3 is live with Player Intelligence, match sharing, expanded scoring configuration and optional workout context."'),
    ("<meta name=\"twitter:card\" content=\"summary_large_image\"><meta name=\"twitter:title\" content=\"What's Coming in PadelWrist 1.3\">", "<meta name=\"twitter:card\" content=\"summary_large_image\"><meta name=\"twitter:title\" content=\"What's New in PadelWrist 1.3\">"),
    ('content="Preview the next PadelWrist release: Player Intelligence, sharing, scoring control and optional workout context."', 'content="PadelWrist 1.3 is live with Player Intelligence, sharing, richer scoring control and optional workout context."'),
    ("\"name\":\"What's Coming in PadelWrist 1.3\"", "\"name\":\"What's New in PadelWrist 1.3\""),
    ('"description":"Preview of upcoming PadelWrist 1.3 features."', '"description":"Features available in PadelWrist 1.3."'),
    ('<p class="eyebrow">In development · PadelWrist 1.3</p>', '<p class="eyebrow">Available now · PadelWrist 1.3</p>'),
    ('<h1>The next step beyond keeping score.</h1>', '<h1>PadelWrist 1.3 is here.</h1>'),
    ('<p>PadelWrist 1.3 is being shaped as a more complete match companion: still fast and focused during play, but much more useful when you want to understand, share or review the match afterwards.</p>', '<p>PadelWrist 1.3 turns the app into a more complete match companion: still fast and focused during play, but much more useful when you want to understand, share or review the match afterwards.</p>'),
    ('<h2>What is already live today</h2>', '<h2>The complete 1.3 experience</h2>'),
    ('<p>The current App Store release already covers the core job: Standard Match and Fixed Points scoring, Apple Watch-first live controls, server tracking, spoken score announcements, undo and correction, saved players, local match history, resume and cross-device continuity between supported Apple devices.</p><p>Those fundamentals are not being replaced. Version 1.3 builds around them.</p>', '<p>The App Store release combines the core PadelWrist experience with the new 1.3 features: Standard Match and Fixed Points scoring, Apple Watch-first live controls, server tracking, spoken score announcements, undo and correction, saved players, local match history, resume, cross-device continuity, Player Intelligence, sharing, richer scoring configuration and optional workout context.</p><p>The fundamentals remain fast and dependable. Version 1.3 builds around them rather than making live scoring heavier.</p>'),
    ('Planned Player Intelligence surfaces include', 'Player Intelligence includes'),
    ('Sharing is also becoming a larger part', 'Sharing is now a larger part'),
    ('The direction includes', 'Version 1.3 includes'),
    ('Version 1.3 work includes broader scoring-rule configuration', 'Version 1.3 includes broader scoring-rule configuration'),
    ('Health-related functionality is being explored as an optional layer', 'Health-related functionality is available as an optional layer'),
    ('The intention is to let players connect', 'Players can connect'),
    ('The 1.3 work also lays foundations for a future Pro tier around higher-value intelligence and deeper analysis. Exact paid features and pricing will only be presented as available when they are actually released.', 'Version 1.3 also introduces the deeper intelligence and analysis that form the higher-value side of PadelWrist, while the core scoring experience remains strong.'),
    ('<h2>Help shape 1.3</h2>', '<h2>Help shape what comes next</h2>')
])

replace_all('padel-player-statistics/index.html', [
    ('<p class="eyebrow">Coming in PadelWrist 1.3</p>', '<p class="eyebrow">Available now · PadelWrist 1.3</p>'),
    ('<h1>Turn match history into useful Player Intelligence.</h1>', '<h1>Turn match history into useful Player Intelligence.</h1>'),
    ('is being designed to help you understand', 'helps you understand'),
    ('The 1.3 direction builds on those recorded matches', 'Version 1.3 builds on those recorded matches'),
    ('Planned views include', 'Available views include'),
    ('The intention is to surface', 'PadelWrist surfaces'),
    ('the planned Player Intelligence experience can show', 'Player Intelligence can show'),
    ('Richer filters are planned for players', 'Richer filters let players'),
    ('Player Intelligence is being designed around that same privacy-conscious approach.', 'Player Intelligence follows that same privacy-conscious approach.'),
    ('<h2>What is live today?</h2><p>Today you can save matches, review results, edit historic set scores and resume unfinished matches. The richer Player Intelligence described on this page is upcoming work for the 1.3 direction and should not be read as a claim that every analysis view is already available in the App Store release.</p>', '<h2>Available in version 1.3</h2><p>You can save matches, review results, edit historic set scores, resume unfinished matches and use Player Intelligence to explore the patterns around those results in more depth.</p>'),
    ('What\'s coming in 1.3', 'What\'s new in 1.3')
])

replace_all('padel-match-sharing/index.html', [
    ('<p class="eyebrow">Coming in PadelWrist 1.3</p>', '<p class="eyebrow">Available now · PadelWrist 1.3</p>'),
    ('PadelWrist sharing is being designed around the useful moments', 'PadelWrist sharing is designed around the useful moments'),
    ('The direction for 1.3 includes', 'Version 1.3 includes'),
    ('The 1.3 work also includes host and join flows', 'Version 1.3 also includes host and join flows'),
    ('The sharing direction is being shaped so', 'The sharing experience is built so'),
    ('<h2>What is available today?</h2><p>The current App Store release is centred on scoring, match history and cross-device continuity. The richer result cards and live host/join experiences described here are upcoming 1.3 work, so this page is a preview rather than a claim that all sharing features are already live.</p>', '<h2>Available in version 1.3</h2><p>PadelWrist 1.3 includes richer result sharing and live host/join experiences alongside scoring, match history and cross-device continuity.</p>'),
    ('What\'s coming in 1.3', 'What\'s new in 1.3')
])

replace_all('padel-match-history/index.html', [
    ('Version 1.3 is planned to build on that foundation with richer Player Intelligence on iPhone and iPad.', 'Version 1.3 builds on that foundation with richer Player Intelligence on iPhone and iPad.'),
    ('That work includes performance trends', 'Player Intelligence includes performance trends'),
    ('Preview the Player Intelligence direction', 'Explore Player Intelligence'),
    ('What\'s next in 1.3', 'What\'s new in 1.3')
])

replace_all('apple-watch-padel-scoring/index.html', [
    ('<h2>What 1.3 adds around Apple Watch</h2>', '<h2>What version 1.3 adds around Apple Watch</h2>'),
    ('The 1.3 work keeps the score', 'Version 1.3 keeps the score'),
    ('Optional Health and workout integration is being prepared so players can connect', 'Optional Health and workout integration lets players connect'),
    ('See the PadelWrist 1.3 preview', 'See what\'s new in PadelWrist 1.3')
])

replace_all('fixed-points-padel-scoring/index.html', [
    ('<h2>More scoring-rule control is coming</h2>', '<h2>More scoring-rule control in version 1.3</h2>'),
    ('The 1.3 work is expanding the configuration available around a match', 'Version 1.3 expands the configuration available around a match'),
    ('See the upcoming 1.3 features', 'See what\'s new in 1.3')
])
