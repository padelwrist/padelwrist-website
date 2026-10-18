# PadelWrist product context

## Product

PadelWrist is a padel scoring and match-tracking app for Apple Watch, iPhone and iPad. It is designed to make live scoring almost disappear during play, then make every recorded match more useful afterwards through searchable history, Insights, player analysis and sharing.

PadelWrist is live on the Apple App Store: https://apps.apple.com/gb/app/padelwrist/id6799725420

App Store ID: `6799725420`.

Current website-promoted release: **1.9**. The product owner has explicitly authorised presenting 1.9 as released on the website, regardless of App Store rollout status. The merged 1.9 app feature is **Play Again from Match History on iPhone and iPad**, supporting review of previous setup, a new match or preparation for Watch from iPhone, with the original result retained. A separate direct Watch Play Again flow is still under draft review and must NOT be promoted as available. Do not represent the App Store review outcome as independently verified. 1.8 introduced foreground Watch Match Assistant; 1.7 added Watch complications and Smart Stack; 1.6 added rating feedback prompts.

## Audience

Two complementary audiences: **(1) individual padel players** using the released scorekeeper on Apple Watch, iPhone and iPad, who care about intuitive scoring, History, sharing and Insights; **(2) padel clubs, coaches and social tournament hosts** exploring Events, a native iPhone/iPad organiser feature still in development. The site should make both journeys immediately visible, without conflating roadmap functionality with released app functionality.

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

PadelWrist Events is separately **in development** as a native iPhone/iPad organiser feature for Americano/Mexicano. The current design proposes rosters, courts, flexible rounds, organiser-controlled draws, individual standings and optional read-only participant views. Stacked draft PRs #30 and #31 have native official score entry and audited corrections under development: current and historic fixtures, required reasons, explicit before/after review, durable recovery from interrupted responses and server-side stale-edit protection. These are **not merged or available in the released app**. Real-device accessibility, production authentication and further Events flows remain release gates. Do not announce Events launch dates, pricing, account requirements, booking or tournament registration; developer drafts do not imply production availability. Match Assistant is best-effort, foreground-only and does not provide spoken assistant instructions, system notifications or background haptic alerts. Do not promise catch-up cues after reconnect, Undo, editing or resuming a match. Do not imply automatic shot tracking, tactical analysis, public social profiles, court booking, tournament management or automatic Americano/Mexicano partner rotation.

## New website content

- `/play-again-padel-match/`: help for using Play Again and distinguishing it from Resume.
- `/how-to-read-padel-match-stats/`: interpretation of trends, match volume, partner/opponent records and statistics limitations.
- `/padel-tournament-organiser-checklist/`: organiser education, practical scoring examples and transparent rules.
- `/players/`: purpose-built released-app landing page for players, with Apple Watch, iPhone/iPad, live scoring, Play Again, History and Insights.
- `/clubs/`: top-level clubs and tournament hosts landing page, explaining their needs and directing to the Events product preview.
- `/events/`: an in-development product page under Clubs, with proposed setup, players/courts, round-by-round flow, standings and host feedback. Illustrations are explicitly marked concepts. Score corrections are a minor supporting detail, not a headline selling point.
- `/americano-vs-mexicano-padel/`: comparison of partner rotations, pairing rules, fixed-point totals and organiser decisions.
- `/padel-tournament-score-corrections/`: practical advice on correcting official scores, approval, rank recalculation, stable Mexicano fixtures and connectivity conflicts.

## Brand naming

Use **PadelWrist** everywhere the product name appears in ordinary copy, metadata, accessibility labels and documentation.

Use **PADELWRIST** only when rendering the visual wordmark itself.

## Website mode

The homepage is a **two-audience Persuade** surface with an early, equally visible choice: Players → `/players/` and Clubs → `/clubs/`. **Events** is an in-development product page nested under the Clubs journey at `/events/`. The main navigation labels are **Players, Clubs, Features, What’s New, Guides, Support, Privacy**. Both audience routes are discoverable from primary navigation and Guides. The player route sells the released personal match lifecycle (score on Watch, share, History, Insights and Play Again); the organiser route sells the planned value for clubs (players, courts, pairing/rounds and standings), while repeatedly and truthfully identifying Events as in development. Do not use a generic App Store download CTA to imply Events is available. Supporting guides are **Read** surfaces answering intent first and routing appropriately.
