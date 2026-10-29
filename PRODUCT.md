# PadelWrist product context

## Product

PadelWrist is a padel scoring and match-tracking app for Apple Watch, iPhone and iPad. It is designed to make live scoring almost disappear during play, then make every recorded match more useful afterwards through searchable history, Insights, player analysis and sharing.

PadelWrist is live on the Apple App Store: https://apps.apple.com/gb/app/padelwrist/id6799725420

App Store ID: `6799725420`.

**Version 2.0 is the current website product position (29 October 2026).** The product owner authorised the 2.0 public marketing launch, including present-tense copy for Americano and Mexicano Events on iPhone and iPad, while the 2.0 App Store submission remains under review. Do not assert that Apple has approved version 2.0 or that the App Store listing already serves this build unless independently verified. This is launch marketing, not App Store approval evidence. PadelWrist 1.9 added Play Again, 1.8 Match Assistant, 1.7 Watch complications and 1.6 rating prompts. Preserve separate Apple Watch individual scoring and iPhone/iPad event organising roles.

## Audience

Two complementary audiences: **(1) individual padel players** using the released scorekeeper on Apple Watch, iPhone and iPad, who care about intuitive scoring, History, sharing and Insights; **(2) padel clubs, coaches and social tournament hosts** using Americano/Mexicano Events on iPhone and iPad. The site should make both journeys immediately visible, without conflating roadmap functionality with released app functionality.

## Primary promise

**Keep the score. Understand your game.**

The website should make four ideas obvious:

1. Score on Apple Watch in English or Spanish with optional Match Assistant guidance, then use Play Again from Match History on iPhone/iPad to repeat a familiar setup.
2. Keep the active match visible across the Apple ecosystem and share it with other PadelWrist users via a six-digit Match Code.
3. Turn Match History into useful Insights, recent form, player analysis and searchable records.
4. Keep control of the experience without requiring a PadelWrist account.

## Product truth

- Available on the Apple App Store.
- Apple Watch, iPhone and iPad support.
- English and Spanish localisation across the app, Live Activities and spoken score announcements.
- Apple Watch face complications in circular, rectangular and inline designs, and Smart Stack shortcuts for opening PadelWrist, resuming an active match or setting up a new one (1.7).
- Optional post-match App Store rating prompts and a Rate PadelWrist Settings option (1.6).
- Play Again in Match History on iPhone and iPad (1.9): reuse available Standard/Fixed Points settings, saved players and team names, then review and start a new session from zero. The original History result is preserved. iPhone can prepare the new setup for Apple Watch, but direct Watch Play Again remains in a draft PR. iPad cannot relay preparation directly to Watch. Replacing an active match requires confirmation.
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
- Apple Health workout recording.
- Private iCloud sync for match history and saved players.
- Dedicated Insights tab with performance trends, recent form and player analysis.
- Partner and opponent records and head-to-head analysis.
- Post-match insights including milestones, streaks and notable form.
- Search and filter Match History by date, format, result, players and more.
- Match details including match type, playing side and private notes.
- Live Activities and Dynamic Island for an active match on supported iPhones.
- Local-first scoring during temporary device disconnection.
- No PadelWrist account required.

PadelWrist Events is part of the version 2.0 product and is presented in the present tense across the public website. Organisers manage Americano and Mexicano player rosters, courts, fixed-point targets, proposed draws, published rounds, official scores and corrections, resting-player points, withdrawals, final standings and podium on iPhone/iPad. Participants follow published event fixtures, assignments and standings through a code or link with read-only access. The organiser device remains authoritative and works local-first; shared updates require connectivity. No court booking, payment, paid club subscription, live web tournament administration or Watch tournament organiser is implied. PadelWrist 2.0 has been submitted to Apple, but approval and App Store rollout are distinct from website marketing.

## New website content

- `/padel-tournament-app/`: commercial-intent landing page for the native PadelWrist tournament organiser.
- `/americano-tournament-organiser/`: practical Americano host guide.
- `/mexicano-tournament-organiser/`: practical Mexicano host guide.

- `/play-again-padel-match/`: help for using Play Again and distinguishing it from Resume.
- `/how-to-read-padel-match-stats/`: interpretation of trends, match volume, partner/opponent records and statistics limitations.
- `/padel-tournament-organiser-checklist/`: organiser education, practical scoring examples and transparent rules.
- `/players/`: purpose-built released-app landing page for players, with Apple Watch, iPhone/iPad, live scoring, Play Again, History and Insights.
- `/clubs/`: top-level clubs and tournament hosts landing page, explaining their needs and directing to the Events product preview.
- `/events/`: a 2.0 product page under Clubs, with organiser setup, players/courts, round-by-round flow, sharing, standings and host feedback. Illustrations remain explicitly marked examples. Score corrections are a minor supporting detail, not a headline selling point.
- `/americano-vs-mexicano-padel/`: comparison of partner rotations, pairing rules, fixed-point totals and organiser decisions.
- `/padel-tournament-score-corrections/`: practical advice on correcting official scores, approval, rank recalculation, stable Mexicano fixtures and connectivity conflicts.

## Brand naming

Use **PadelWrist** everywhere the product name appears in ordinary copy, metadata, accessibility labels and documentation.

Use **PADELWRIST** only when rendering the visual wordmark itself.

## Website mode

The homepage is a **two-audience Persuade** surface with an early, equally visible choice: Players → `/players/` and Clubs → `/clubs/`. **Events** is a version 2.0 product page nested under the Clubs journey at `/events/`. The main navigation labels are **Players, Clubs, Features, What’s New, Guides, Support, Privacy**. Both audience routes are discoverable from primary navigation and Guides. The player route sells the released personal match lifecycle (score on Watch, share, History, Insights and Play Again); the organiser route sells the planned value for clubs (players, courts, pairing/rounds and standings), while accurately describing Events as part of version 2.0. Do not claim Apple approved the submission or that the public App Store build is already 2.0 without verification. Supporting guides are **Read** surfaces answering intent first and routing appropriately.
