# PadelWrist 2.2 Shop: verification and release-readiness review

Reviewed 2 November 2026. **Editorial review can proceed; the Shop is not commercially release-ready.** Twelve proposed cards cover fourteen ASINs. Eleven cards (thirteen ASINs) are ready for the owner's editorial approval; the PUSUN machine remains on hold for manufacturer/regional evidence. Ready means the reviewed listing supports the restrained copy and selected option, not that publication, programme participation or attribution is approved.

All twelve products and fourteen variants remain `draft`. All fourteen `productApprovals` entries remain `pending`; the Raquex `variantApprovals` entry is also pending. No public product approval, active destination, image-photography approval or mobile attribution is granted. The public feed and bundled native fallback contain zero products. Revision 2 adds coaching equipment to Players as well as Clubs; no product is exposed by that category correction. The 78-record staging intake and twenty research leads are unchanged.

## Evidence and method

Read individual Amazon UK listings manually in the browser, including selected options and expanded item details. The research tool could not open the listings, but the normal browser could. No scraping, automated product ingestion, downloads, product-photo copies, prices, stock, ratings or review text are used in the catalogue. Evidence is an original factual review note plus the exact listing URL, date, ASIN, quantity, selected option, category and destination in `data/shop/catalogue.json` → `productApprovals`. Original EN/ES descriptions are stored in the twelve draft products. Approval notes are private publication inputs and excluded from Cloudflare assets.

Checked candidate destinations using the supplied `thediaryroom-21` tag. The four original full Raquex SiteStripe URLs are preserved byte-for-byte. For the grip and Vermont bucket, the proposed reviewed destination adds `th=1&psc=1` to make the child selection explicit; the immutable intake URL is retained in staging. A tag present in a URL is not proof of Associates authorisation or successful commission attribution. Tests cover syntax and the closed gates; browser observations cover the selected UK product, not a purchase or international/mobile attribution test.

No Amazon parent ASIN is invented. The three small Raquex packs were observed in one size/speed selection interface; their independent approval record remains pending. Colours not checked in this review are not promoted as selectable variants. Racket years, editions, constructions and models remain separate cards.

## Ready for editorial approval

All entries below have original EN/ES draft copy, appropriate category artwork, a reviewed UK landing identity and a disabled destination. The owner still needs to approve copy, merchandising and any future publication.

| Proposed card / audience | Exact ASIN(s) | Verified option and quantity | Editorial decision |
|---|---|---|---|
| Raquex Elite **Pace** balls / Players + Clubs | [B0D123Q6RL](https://www.amazon.co.uk/dp/B0D123Q6RL), [B0D1VZ4VNJ](https://www.amazon.co.uk/dp/B0D1VZ4VNJ), [B0D1VXLW6J](https://www.amazon.co.uk/dp/B0D1VXLW6J) | Yellow Elite Pace; 3, 6 and 9 balls respectively (one, two and three tubes). Exact full links select these children. A bare three-ball URL initially presented an unselected family. | One family with pack selector. Name the speed explicitly; do not describe these as the standard-speed Elite option. |
| Raquex Elite Pace club pack / Clubs | [B0FLQKZ7Y3](https://www.amazon.co.uk/dp/B0FLQKZ7Y3) | Elite Pace, 120 balls; forty tubes of three. | Separate featured club card, ordered first in Clubs. |
| Raquex Elite quilted cover / Players | [B0DHQX4RY2](https://www.amazon.co.uk/dp/B0DHQX4RY2) | Black, Padel Cover; one cover. | Cross-listed Bags/Accessories; original bag illustration. Do not group the blue option until checked. |
| Raquex Enhance replacement grip / Players + Clubs | [B0755HRLQD](https://www.amazon.co.uk/dp/B0755HRLQD) | Black, one replacement/base grip with finishing tape. Product details and an explicitly selected fresh destination agree. | Grip category. No overgrip or multipack assumption; keep selection parameters. |
| NOX AT10 Genius 18K Alum 2026 / Players | [B0FX4M8T89](https://www.amazon.co.uk/dp/B0FX4M8T89) | One racket, named 2026 AT10 Genius 18K Alum in the listing and ASIN details. | Separate from 2025, 12K, Attack and Buenos Aires versions. No weight/performance claims. |
| NOX Future Hybrid 12K Alum / Players | [B0DXJN4ZQ1](https://www.amazon.co.uk/dp/B0DXJN4ZQ1) | One Hybrid racket; item details confirm the ASIN and count. | No model year inferred; Attack/Control are separate products. |
| NOX perforated overgrips / Players | [B08125ZP7X](https://www.amazon.co.uk/dp/B08125ZP7X) | Three white perforated overgrips; item count three. | Grip category; not smooth PRO grips or a bulk carton. |
| NOX Pro Series backpack / Players | [B0CBW85PYV](https://www.amazon.co.uk/dp/B0CBW85PYV) | Blue, 28-litre backpack, one item. | Bags category; brown/white colour mappings remain unverified. |
| Bullpadel Premium Pro / Players + Clubs | [B07F18MPQQ](https://www.amazon.co.uk/dp/B07F18MPQQ) | Yellow; three tubes of three, nine balls total. | One nine-ball card; do not substitute a single tube or carton. |
| Vermont pressureless training balls / Players + Clubs | [B0DMTJVPKS](https://www.amazon.co.uk/dp/B0DMTJVPKS) | Selected sixty-ball pressureless bucket. Details show sixty items and one bucket. Explicit `th=1&psc=1` destination retained that selection on a fresh visit. | Coaching/Balls. Do not group with the differently constructed pressurised three-ball tube. |
| Bounce Tube FilterTech / Players + Clubs | [B0H5XFQWPQ](https://www.amazon.co.uk/dp/B0H5XFQWPQ) | Night-blue padel pressuriser, one item, integrated pump. Listed brand: Bounce Sports International. | Accessories; no ball-pack, guaranteed lifespan, duration or five-times-life claim. Green child unverified. |

## Further evidence needed

- **PUSUN PT-Max C, [B0GV226SKF](https://www.amazon.co.uk/dp/B0GV226SKF):** identity, black option and one-machine quantity match. Details list a charger, external battery, remote and manual, with English manual availability not guaranteed. Obtain the current manufacturer manual, UK charger/plug specification, padel configuration and regional support/servicing details before editorial approval. Keep coaching classification; hopper capacity is not a number of balls supplied. Copy deliberately excludes speed, modes, battery duration and capacity claims.
- Other colour children, NOX X-Zero year/colour relationships, ambiguous adidas carton units and Palbea tube mappings remain outside this launch shortlist and unverified. Do not infer those relationships from the proposed staging keys.
- MaxPadel B0DQY6CKVJ remains a quarantined storefront reference, not a verified product. Twenty research-only leads remain non-buyable.

## Actual UX findings

| Priority / state | Finding and action |
|---|---|
| P1 — open launch gap | **Brand filtering is absent on both platforms**, and the public product contract has no explicit brand field. Brand names in titles are insufficient for a reliable filter. Add a small coordinated, validated brand field plus native/web controls in a focused follow-up; do not guess brands from title prefixes. The requested multibrand browsing experience is not complete. |
| P1 — open launch gap | **Website categories are informational cards, not navigation/filter controls.** Players/Clubs anchors work, while category headings do not narrow the product list. Native has pushed category screens. Implement accessible category navigation/filtering on the web and a matching no-results/reset state before describing this as equivalent category browsing. No new catalogue architecture or project is needed. |
| Fixed | Website single-option rackets/bags/accessories previously had an unnecessary “Pack size” selector. Single options now render as labelled text; multi-option balls retain their native HTML selector. Future non-ball multi-options use “Option”. |
| Fixed | Failed first-party product photos previously left a broken image. The website now switches to the original category illustration. A deliberately nonexistent local test image exercised the error path; no third-party photography was loaded. Native already falls back on AsyncImage failure. |
| Fixed | Coaching category was Clubs-only although supplied machines/training equipment support Players too. Category metadata now supports both; schema/versioned architecture is unchanged and public revision advances to 2. |
| Fixed in drafts | All four supplied Raquex packs are Elite **Pace**. Corrected proposed titles/copy and recorded exact speed/quantity evidence. The 120-ball club card remains separate and first in Clubs. |
| P2 — open refinement | With eleven Player cards, native category navigation is below a long product grid. Move category access higher in a focused browsing follow-up; current navigation is usable but slow to discover. |

Local review uses synthetic visibility solely to exercise unpublished data. It does not approve any product. Debug Simulator fixtures carry the existing unverified-preview notice; web QA pages are noindex and excluded under `visual-audit/`. Original illustrations are clearly labelled, decorative next to readable titles, and use consistent 8:5 artwork. No manufacturer or Amazon photography has been approved by this review. The normal public preview intentionally remains an empty product collection.

## Commercial release blockers (independent of editorial readiness)

**Website:** obtain evidence that padelwrist.com and the existing tracking ID are authorised in the relevant Associates programme; confirm disclosure wording in EN/ES; approve each final destination and record commercial sign-off separately. The reviewed UK landings do not prove international matching or attribution. The cited [OneLink guide](https://affiliate-program.amazon.com/help/node/topic/GAGAL4V362SH7EC5) describes US Associates and account-level mappings/preferences. Do not assume these UK-origin links automatically have that behaviour. Check the actual account's applicable OneLink/local matching setup and supported countries with Amazon, then exercise exact/close/search/unmatched outcomes and installed/uninstalled Amazon-app handoff. No account settings or matching rules were changed.

**Native:** obtain separate approved-mobile-app evidence, registered App Store URL, suitable mobile Store/tracking IDs for the app/marketplaces, and explicit approved per-marketplace destinations. [Amazon's mobile policy](https://affiliate-program.amazon.co.uk/help/node/topic/GHBY6W8UPTEFD3ZX) requires store availability, free download, original content, freely accessible links, and prohibits embedded Amazon pages and price tracking. Confirm PadelWrist's distribution/paywall model against these conditions without changing entitlements. No account-level mobile approval was available to inspect; no tracking attribution is asserted. Binary mobile programme/content gates remain false and IDs remain empty. Do not reuse the website tag or use the website as a mobile-approval workaround.

**Shared:** owner editorial approval/publication authorisation remains pending; current public products are zero. No private manufacturer permissions are on file for product photography; original PadelWrist artwork provides a compliant release path. Final disclosure/operating-agreement review and approved-link real-device checks remain. The [operating agreement](https://affiliate-program.amazon.co.uk/help/operating/agreement) remains the source for programme obligations. No purchase, checkout, account, tracking permission, new analytics or paid infrastructure is added.

**Not a blocker:** Creators API currently lacks qualifying-sales eligibility, as reported by the owner. [Amazon's current prerequisites](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction) were rechecked; optional API content remains disabled. Curated cards and original illustrations work without API access and do not depend on later eligibility.

## Validation and limits

- 672 native tests passed, including scoring/persistence, History/Insights, Events, purchases/entitlements and catalogue cache/expiry/gates. Eight focused Shop tests also passed.
- Canonical Debug iPhone Simulator build passed with zero application-owned warnings/errors. No release version/signing/archive or existing Activity/Events/scoring implementation changed.
- 33 website tests passed: pending review cannot publish, exact source/tag preservation, quantity safeguards, EN/ES, variant grouping, read-only feed, cache/ETag/expiry, image fallback markup and closed mobile/API gates. Generated JSON/HTML/Markdown and revision checks are required in CI.
- Manual Simulator review on isolated iPhone 17 and iPad Pro 11-inch (M5), iOS 27.0: responsive product grid, original artwork and longer Spanish titles; three-to-nine selector and unavailable-link state. Web review at desktop, 390px phone and 768px tablet widths: no horizontal overflow or active Amazon links; selector changed to nine in Spanish; synthetic photo failure switched to artwork.
- Full VoiceOver interaction, all accessibility text sizes, real hardware, paired Watch timing, purchase sandbox and approved international attribution are **not certified** by these checks. Existing regression results do not replace those release checks. Outstanding brand/category gaps above prevent an unconditional UX readiness claim.
