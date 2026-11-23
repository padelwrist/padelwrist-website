# PadelWrist product context

## Product

PadelWrist is a padel scoring and match-tracking app for Apple Watch, iPhone and iPad. It is designed to make live scoring almost disappear during play, then make every recorded match more useful afterwards through searchable history, Insights, player analysis and sharing.

PadelWrist is live on the Apple App Store: https://apps.apple.com/gb/app/padelwrist/id6799725420

App Store ID: `6799725420`.

**Version 2.3 is available on the UK App Store, independently verified 23 November 2026.** It improves Watch/iPhone scoring and recovery, Apple Health workout reliability, direct Apple Watch Play Again, organiser choices for club or individual/social Events, layout consistency and accessibility. Version 2.2 restored direct Watch Play Again, 2.1 refined Events, and 2.0 introduced native Americano/Mexicano tournament organisation. Earlier releases added Match History Play Again (1.9), Match Assistant (1.8), Watch complications (1.7) and rating prompts (1.6). Preserve individual scoring on Apple Watch and event administration on iPhone/iPad. Confirm future version claims against the public App Store listing.

## Audience

Two complementary audiences: **(1) individual padel players** using the released scorekeeper on Apple Watch, iPhone and iPad, who care about intuitive scoring, History, sharing and Insights; **(2) padel clubs, coaches and social tournament hosts** using Americano/Mexicano Events on iPhone and iPad. The site should make both journeys immediately visible, without conflating roadmap functionality with released app functionality.

## Primary promise

**Keep the score. Understand your game.**

The website should make four ideas obvious:

1. Score on Apple Watch in English or Spanish with optional Match Assistant guidance and optional Apple Health recording; use direct Watch Play Again or review a past setup in Match History on iPhone/iPad.
2. Keep the active match visible across the Apple ecosystem and share it with other PadelWrist users via a six-digit Match Code.
3. Turn Match History into useful Insights, recent form, player analysis and searchable records.
4. Keep control of the experience without requiring a PadelWrist account.

## Product truth

- Available on the Apple App Store.
- Apple Watch, iPhone and iPad support.
- English and Spanish localisation across the app, Live Activities and spoken score announcements.
- Apple Watch face complications in circular, rectangular and inline designs, and Smart Stack shortcuts for opening PadelWrist, resuming an active match or setting up a new one (1.7).
- Optional post-match App Store rating prompts and a Rate PadelWrist Settings option (1.6).
- Play Again in Match History on iPhone and iPad (1.9) and directly on Apple Watch after completing supported Standard/Fixed Points matches (restored in 2.2). Reuse available settings for a new match from zero while preserving the original result; iPhone can prepare a Watch match, but iPad cannot pair directly with Watch. Replacing an active match requires confirmation.
- Match Assistant in the actively used Apple Watch app: first server, next server and change ends prompts, combining simultaneous instructions into one prompt (1.8).
- Native attention haptics accompanying fresh Match Assistant guidance while the Watch app is in the foreground (subject to watchOS settings and delivery); no background notifications or guaranteed background haptics (1.8).
- A separate Watch-local Match Assistant toggle (on by default), independent of spoken score announcements; assistant prompts are available in English and Spanish, with VoiceOver-friendly names (1.8).
- More reliable individual service-order continuity after History edits and tie-break transitions, preserving the existing rotation and manual corrections (1.8).
- Standard padel scoring with Advantage, Golden Point, Star Point and Silver Point options.
- Match tie-break support and Fixed Points for point-based formats.
- Server tracking and spoken score announcements.
- Undo and score correction.
- Live match sharing using a six-digit Match Code, with players/spectators and host control of scoring access.
- Match result cards and standard iOS sharing.
- Optional Apple Health workout recording from Apple Watch; supported sessions are classified as Tennis workouts in Apple Health/Fitness as of 2.2. Health data is not sent to product analytics.
- Private iCloud sync for match history and saved players.
- Dedicated Insights tab with performance trends, recent form and player analysis.
- Partner and opponent records and head-to-head analysis.
- Post-match insights including milestones, streaks and notable form.
- Search and filter Match History by date, format, result, players and more.
- Match details including match type, playing side and private notes.
- Live Activities and Dynamic Island for an active match on supported iPhones.
- Local-first scoring during temporary device disconnection.
- No PadelWrist account required.

PadelWrist Events was introduced in version 2.0 and is available in the current 2.3 release. Organisers manage Americano and Mexicano player rosters, courts, fixed-point targets, proposed draws, published rounds, official scores and corrections, resting-player points, withdrawals, final standings and podium on iPhone/iPad. Participants follow published event fixtures, assignments and standings through a code or link with read-only access. The organiser device remains authoritative and works local-first; shared updates require connectivity. Version 2.3 adds an optional club versus individual/social organiser choice; no user location permission is required for it. No court booking, payments, paid club subscription, live web tournament administration or Watch tournament organiser is implied.

## New website content

- `/padel-tournament-app/`: commercial-intent landing page for the native PadelWrist tournament organiser.
- `/americano-tournament-organiser/`: practical Americano host guide.
- `/mexicano-tournament-organiser/`: practical Mexicano host guide.

- `/play-again-padel-match/`: help for using Play Again and distinguishing it from Resume.
- `/how-to-read-padel-match-stats/`: interpretation of trends, match volume, partner/opponent records and statistics limitations.
- `/padel-tournament-organiser-checklist/`: organiser education, practical scoring examples and transparent rules.
- `/players/`: purpose-built released-app landing page for players, with Apple Watch, iPhone/iPad, live scoring, Play Again, History and Insights.
- `/clubs/`: top-level clubs and tournament hosts landing page, explaining their needs and directing to the Events product preview.
- `/events/`: a current 2.3 product page under Clubs, with organiser setup, optional club/social context, players/courts, round-by-round flow, sharing, standings and host feedback. Illustrations remain explicitly marked examples. Score corrections are a minor supporting detail, not a headline selling point.
- `/americano-vs-mexicano-padel/`: comparison of partner rotations, pairing rules, fixed-point totals and organiser decisions.
- `/padel-tournament-score-corrections/`: practical advice on correcting official scores, approval, rank recalculation, stable Mexicano fixtures and connectivity conflicts.

## Brand naming

Use **PadelWrist** everywhere the product name appears in ordinary copy, metadata, accessibility labels and documentation.

Use **PADELWRIST** only when rendering the visual wordmark itself.

## Website mode

The homepage is a **two-audience Persuade** surface with an early, equally visible choice: Players → `/players/` and Clubs → `/clubs/`. **Events** is an established feature introduced in 2.0, nested under the Clubs journey at `/events/`. The main navigation labels are **Players, Clubs, Features, What’s New, Guides, Support, Privacy**. Both audience routes are discoverable from primary navigation and Guides. The player route sells the released personal match lifecycle (score on Watch, share, History, Insights and Play Again); the organiser route promotes released functionality for clubs (players, courts, pairings/rounds and standings) while explaining Events' 2.0 introduction and subsequent improvements. Do not promote unshipped capabilities or imply app location access. Supporting guides are **Read** surfaces answering intent first and routing appropriately.
