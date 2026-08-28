from pathlib import Path


def replace(path, old, new):
    p = Path(path)
    text = p.read_text()
    text = text.replace(old, new)
    p.write_text(text)

# Homepage and shared navigation
replace('index.html', 'Score padel matches on Apple Watch, iPhone or iPad with PadelWrist. Get live sync, spoken scores, server tracking, match history and offline scoring.', 'Score padel on Apple Watch, iPhone or iPad with PadelWrist. Version 1.3 adds Player Intelligence, match sharing, richer scoring controls and workout context.')
replace('index.html', 'Score padel from your wrist, keep the live match in sync across Apple devices and save your match history without an account.', 'Score padel across Apple Watch, iPhone and iPad, then analyse, share and review the match with the new features in PadelWrist 1.3.')
replace('index.html', 'Padel scoring for Apple Watch, iPhone and iPad, with live match continuity, history and spoken scores.', 'PadelWrist 1.3 combines wrist-first scoring with Player Intelligence, sharing, richer match rules and workout context.')
replace('index.html', 'A padel scoring app for Apple Watch, iPhone and iPad with wrist-first scoring, live match continuity, spoken scores, server tracking and local match history.', 'A padel scoring and match companion for Apple Watch, iPhone and iPad with wrist-first scoring, Player Intelligence, match sharing, configurable rules and workout context.')
replace('index.html', '"Resume unfinished matches","No account required"]', '"Resume unfinished matches","Player Intelligence and performance trends","Partner and opponent analysis","Head-to-head records and match timelines","Match result sharing","Live match sharing","Expanded scoring-rule configuration","Optional Health and workout context","No account required"]')
replace('index.html', "What's next", "What's new")
replace('index.html', 'Coming in PadelWrist 1.3', 'New in PadelWrist 1.3')
replace('index.html', 'Version 1.3 is the next step beyond scorekeeping: richer player insight, better ways to share a match, more flexible rules and optional workout context. The live scoring experience stays focused and fast.', 'Version 1.3 is live now, adding richer player insight, better ways to share a match, more flexible rules and optional workout context while keeping the live scoring experience focused and fast.')
replace('index.html', 'Planned performance views include trends, partner and opponent analysis, head-to-head records, point timelines, momentum and deeper filters where the recorded match data can support a truthful insight.', 'Player Intelligence now brings together trends, partner and opponent analysis, head-to-head records, point timelines, momentum and deeper filters where the recorded match data can support a truthful insight.')
replace('index.html', '1.3 work includes richer result sharing and live match sharing flows', 'Version 1.3 includes richer result sharing and live match sharing flows')
replace('index.html', 'Expanded scoring-rule configuration and optional Health/workout context are being prepared', 'Expanded scoring-rule configuration and optional Health/workout context are available')
replace('index.html', 'See what is planned for 1.3', "See what's new in 1.3")
replace('assets/site.js', "What's next", "What's new")

# What's new page
for old, new in [
    ("What's Coming in PadelWrist 1.3", "What's New in PadelWrist 1.3"),
    ('Preview PadelWrist 1.3:', 'Discover PadelWrist 1.3:'),
    ('A preview of the next PadelWrist release, including', 'PadelWrist 1.3 is live with'),
    ('Preview the next PadelWrist release:', 'PadelWrist 1.3 is live with'),
    ('Preview of upcoming PadelWrist 1.3 features.', 'Features available in PadelWrist 1.3.'),
    ('In development · PadelWrist 1.3', 'Available now · PadelWrist 1.3'),
    ('The next step beyond keeping score.', 'PadelWrist 1.3 is here.'),
    ('PadelWrist 1.3 is being shaped as', 'PadelWrist 1.3 is'),
    ('What is already live today', 'The complete 1.3 experience'),
    ('The current App Store release already covers the core job:', 'The App Store release combines the core PadelWrist experience with:'),
    ('Those fundamentals are not being replaced. Version 1.3 builds around them.', 'Those fundamentals remain fast and dependable. Version 1.3 builds around them rather than making live scoring heavier.'),
    ('Planned Player Intelligence surfaces include', 'Player Intelligence includes'),
    ('Sharing is also becoming a larger part of the post-match experience.', 'Sharing is now a larger part of the post-match experience.'),
    ('The direction includes polished result cards', 'Version 1.3 includes polished result cards'),
    ('Version 1.3 work includes broader scoring-rule configuration', 'Version 1.3 includes broader scoring-rule configuration'),
    ('Health-related functionality is being explored as an optional layer', 'Health-related functionality is available as an optional layer'),
    ('The intention is to let players connect useful workout context', 'Players can connect useful workout context'),
    ('The 1.3 work also lays foundations for a future Pro tier around higher-value intelligence and deeper analysis. Exact paid features and pricing will only be presented as available when they are actually released.', 'Version 1.3 also introduces deeper intelligence and analysis while keeping the core scoring experience strong.'),
    ('Help shape 1.3', 'Help shape what comes next')
]: replace('whats-new/index.html', old, new)

# Player Intelligence page
for old, new in [
    ('Coming in PadelWrist 1.3', 'Available now · PadelWrist 1.3'),
    ('is being designed to help you understand', 'helps you understand'),
    ('The 1.3 direction builds on those recorded matches', 'Version 1.3 builds on those recorded matches'),
    ('Planned views include', 'Available views include'),
    ('The intention is to surface', 'PadelWrist surfaces'),
    ('the planned Player Intelligence experience can show', 'Player Intelligence can show'),
    ('Richer filters are planned for players', 'Richer filters let players'),
    ('Player Intelligence is being designed around that same privacy-conscious approach.', 'Player Intelligence follows that same privacy-conscious approach.'),
    ('<h2>What is live today?</h2><p>Today you can save matches, review results, edit historic set scores and resume unfinished matches. The richer Player Intelligence described on this page is upcoming work for the 1.3 direction and should not be read as a claim that every analysis view is already available in the App Store release.</p>', '<h2>Available in version 1.3</h2><p>You can save matches, review results, edit historic set scores, resume unfinished matches and use Player Intelligence to explore the patterns around those results in more depth.</p>'),
    ("What's coming in 1.3", "What's new in 1.3")
]: replace('padel-player-statistics/index.html', old, new)

# Sharing page
for old, new in [
    ('Preview PadelWrist match sharing:', 'PadelWrist match sharing includes:'),
    ('A preview of richer result sharing and live match sharing coming to PadelWrist.', 'Richer result sharing and live match sharing in PadelWrist 1.3.'),
    ('Preview richer result cards, shareable match summaries and live match sharing in PadelWrist.', 'Share result cards, match summaries and live scores with PadelWrist 1.3.'),
    ('Preview of upcoming PadelWrist match-result and live-match sharing.', 'PadelWrist match-result and live-match sharing.'),
    ('Coming in PadelWrist 1.3', 'Available now · PadelWrist 1.3'),
    ('PadelWrist sharing is being designed around the useful moments', 'PadelWrist sharing is designed around the useful moments'),
    ('The direction for 1.3 includes', 'Version 1.3 includes'),
    ('The 1.3 work also includes host and join flows', 'Version 1.3 also includes host and join flows'),
    ('the sharing direction is being shaped so', 'the sharing experience is built so'),
    ('<h2>What is available today?</h2><p>The current App Store release is centred on scoring, match history and cross-device continuity. The richer result cards and live host/join experiences described here are upcoming 1.3 work, so this page is a preview rather than a claim that all sharing features are already live.</p>', '<h2>Available in version 1.3</h2><p>PadelWrist 1.3 includes richer result sharing and live host/join experiences alongside scoring, match history and cross-device continuity.</p>'),
    ("What's coming in 1.3", "What's new in 1.3")
]: replace('padel-match-sharing/index.html', old, new)

# Existing feature pages
for old, new in [
    ('Version 1.3 is planned to build on that foundation', 'Version 1.3 builds on that foundation'),
    ('That work includes performance trends', 'Player Intelligence includes performance trends'),
    ('Preview the Player Intelligence direction', 'Explore Player Intelligence'),
    ("What's next in 1.3", "What's new in 1.3")
]: replace('padel-match-history/index.html', old, new)

for old, new in [
    ('What 1.3 adds around Apple Watch', 'What version 1.3 adds around Apple Watch'),
    ('The 1.3 work keeps the score', 'Version 1.3 keeps the score'),
    ('Optional Health and workout integration is being prepared so players can connect', 'Optional Health and workout integration lets players connect'),
    ('See the PadelWrist 1.3 preview', "See what's new in PadelWrist 1.3")
]: replace('apple-watch-padel-scoring/index.html', old, new)

for old, new in [
    ('More scoring-rule control is coming', 'More scoring-rule control in version 1.3'),
    ('The 1.3 work is expanding the configuration available around a match', 'Version 1.3 expands the configuration available around a match'),
    ('See the upcoming 1.3 features', "See what's new in 1.3")
]: replace('fixed-points-padel-scoring/index.html', old, new)
