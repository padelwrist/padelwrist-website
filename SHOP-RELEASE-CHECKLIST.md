# PadelWrist Shop: web-first release checklist

## Updated 2 November: full supplied-range launch target

The owner has confirmed that `padelwrist.com` **and PadelWrist's App Store URL are registered** under the Amazon Associates account and requested that the entire user-supplied range be considered for launch, not only the initial 10-family curated set. Do not mistake registration for confirmation of Amazon's separate **Approved Mobile Application** acceptance. Account and app-specific approval status must be checked in the relevant programme before native affiliate links are enabled.

**Inventory now staged:** 78 ASIN intake references, of which **76 distinct ASINs are represented in 74 draft catalogue cards**. The other two remain identity-quarantined: `B07D9M6C6G` (conflicting NOX/Babolat branding) and `B0DQY6CKVJ` (MaxPadel storefront parameter only, no verified product identity). Twenty research-only leads have no verified ASIN and remain outside the launch count.

- The original 11 editorial-ready families (13 ASINs), plus held PUSUN (one ASIN), remain in their original controlled catalogue records. The additional 62 ASINs have **draft-only** identifiers, source names, EN/ES placeholder copy and UK Amazon links with `tag=thediaryroom-21`; **none are confirmed saleable or published**.
- The previously proposed 10-family website pilot remains a contingency for a phased release, **not the agreed scope of the full-catalogue launch**. Do not silently ship a small selection as the promised full launch.
- To launch the full eligible range, independently validate the remaining specific listings, selected child ASIN/quantity and variant relationships, brand identity, site linking eligibility, compliant original descriptions and translated copy, and country-specific destinations. Disallow every unverified combination and excluded product. The UK candidate link for a given ASIN is `https://www.amazon.co.uk/dp/<ASIN>?tag=thediaryroom-21`, with special selection parameters retained when required to choose the correct child. This format does not itself establish tracked attribution.
- Preserve the **SiteStripe excluded-product hold** on Raquex Enhance `B0755HRLQD` unless Amazon explicitly clears its eligibility. Preserve PUSUN's UK charger/manual/support hold. Neither can enter an enabled link set on an assumption.
- Every public product and selected variant must pass separate editorial, identity, publication and commercial approval. The publisher now checks explicit `review.publicationApproved` and `review.commercialApproved` rather than treating an ASIN record or `status=verified` alone as sufficient.
- Until the full verified set is ready, protected preview only. Don't expose an empty Shop to ordinary users or enable unsanctioned links. A smaller release remains an explicit scope decision to be made later if needed.


Reviewed 2 November 2026. User has approved the visual direction and requested progression towards website and app release. **This file is not evidence of Amazon authorisation or permission to bypass release checks.**

## Amazon application clarification: launch permission versus programme acceptance

**Owner authorisation received 2 November 2026:** proceed with the full submitted range for website and native release preparation. UK Store ID `thediaryroom-21` appears in the signed-in Associates dashboard and the owner confirms the website and app have been submitted. The Associates application has **not yet completed three qualifying sales** and final site review is pending.

**Website:** Amazon permits Special Links on a registered site after the Associates application is submitted, before the three-sale review. A properly formatted UK website referral can therefore be used once the individual product/child ASIN, claims, listing eligibility and legally required disclosure are verified. Three qualifying sales are a *review trigger*, not a blanket pre-publication prohibition on website links. Source: https://affiliate-program.amazon.co.uk/help/node/topic/G8TW5AE9XL2VX9VM and https://affiliate-program.amazon.co.uk/help/operating/policies .

**Native app:** merely submitting an app/URL or awaiting the three-sale Associates review is **not** equivalent to an **Approved Mobile Application**. Amazon's policy excludes purchases via unapproved mobile applications, and Amazon says it will issue an acceptance/rejection decision. Keep the app-owned native commerce gate shut until the approval is documented and mobile-specific tracking IDs are confirmed. Source: https://affiliate-program.amazon.co.uk/help/node/topic/GHBY6W8UPTEFD3ZX and https://affiliate-program.amazon.co.uk/help/node/topic/GFP8AD2UDZDQTJPP .

**Account administration:** the signed-in Associates dashboard showed an incomplete primary account tax-information notice on 2 November. Complete this in Associates Central so any earned commissions can be paid; don't record tax particulars or credentials in this repository.

**Current catalogue preparation:** 76 proposed exact UK ASIN URL candidates in 74 draft cards; 30 product families have sourced bilingual merchandising copy, with independent reviews pending. All 76 listing approvals and all web/mobile link activations remain pending. An isolated full-catalogue test simulates approved 74-card v3 output without changing any live approvals.

## Current release state

- Website PR [#21](https://github.com/padelwrist/padelwrist-website/pull/21) is draft, based on `main`. It includes v1/v2/v3 shared feeds, EN/ES pages, Markdown, licensing audits and Cloudflare preview support.
- App PR [#76](https://github.com/padelwrist/padelwrist-app/pull/76) is draft, stacked on app PR [#75](https://github.com/padelwrist/padelwrist-app/pull/75), itself based on the 2.1 reliability branch. The app still reports version **2.1 (1)**, not a releasable 2.2 build.
- The website-owned catalogue currently has **12 draft families / 14 draft ASIN variants**. Eleven families / thirteen ASINs received editorial review; the PUSUN ball machine remains outside that shortlist.
- All public feeds and bundled native fallbacks currently have **zero published products**. All commercial links and native programme approval gates are disabled.
- The Raquex Enhance replacement grip has an unresolved SiteStripe excluded-product warning; PUSUN PT-Max C requires manufacturer instructions and UK charger/support verification.
- Creators API is unavailable and **not** required for this release. Reviewed Unsplash contextual/category photography is permitted; no Amazon product-image reuse.

## Stage 1: confirm the UK website Associates account

Amazon UK permits a new Associates application to acquire its first **three qualifying sales within 180 days** before final application review. This is distinct from the **10 qualifying sales in 30 days** Creators API requirement.

Before website retail links are enabled:

- [ ] In **Amazon Associates Central**, confirm that the account is active (including an eligible pending-review account), `padelwrist.com` is listed as a website, and `thediaryroom-21` is a valid authorised UK website tracking ID.
- [ ] Confirm the account is not rejected/closed or restricted for this use; save date/status as private approval evidence, **never credentials**.
- [ ] Ensure compliant EN/ES Associate disclosure is visible on the relevant Shop pages before an outbound click. Check legal wording against current UK Associates requirements.
- [ ] For each selected child ASIN, verify that its exact tagged link resolves to the intended UK product/size and is eligible for special linking. Confirm the Raquex Pace 3/6/9 mappings and 120-ball format.
- [ ] Do **not** claim successful attribution without evidence. Opening a link or seeing the `tag` parameter is not proof of a tracked purchase. Test the landing and Amazon app handoff; check Associates link checker/reporting where available.
- [ ] Keep other marketplace and OneLink destinations disabled until those accounts and behaviour are individually verified.

Sources:
- UK application review: https://affiliate-program.amazon.co.uk/help/node/topic/G8TW5AE9XL2VX9VM
- UK mobile application policy: https://affiliate-program.amazon.co.uk/help/node/topic/GHBY6W8UPTEFD3ZX
- Operating agreement: https://affiliate-program.amazon.co.uk/help/operating/agreement
- UK programme policies: https://affiliate-program.amazon.co.uk/help/operating/policies

## Stage 2: publish a curated, verified website launch set

**Proposed first website set: 10 families / 12 ASINs.** This is the 11-family editorial shortlist minus the Raquex Enhance grip, which remains held. Exclude PUSUN, all unverified variants, 20 research leads and all unapproved other-marketplace destinations.

Selection: Raquex Elite Pace (3, 6, 9), Raquex Elite Pace club pack (120), Raquex quilted cover (black), NOX AT10 Genius 18K Alum 2026, NOX Future Hybrid 12K Alum, NOX perforated overgrips (three white), NOX Pro Series backpack (blue), Bullpadel Premium Pro (nine), Vermont pressureless training-ball bucket (60), Bounce Tube FilterTech (night blue).

- [ ] Confirm final owner-approved **English and Spanish** card summaries, two highlights, relevant evidence, categories, suitability capsules and audience ordering.
- [ ] For the ten included families, mark corresponding `productMerchandising.review.en/es` approved following the independent language review; keep non-launch items pending.
- [ ] Review each listed variant again; only then set its `productApprovals.status='verified'`, `review.publicationApproved=true` and `review.commercialApproved=true` with documented rationale/account registration. Do not set these fields merely because the same ASIN appeared in an intake spreadsheet.
- [ ] Record independently verified Raquex 3/6/9 family relationship in `variantApprovals`; keep all other unchecked variants hidden.
- [ ] Mark only approved variants and families `published`, and enable their exact authorised **web** destinations; set `webLinksEnabled=true` only after account and disclosure checks. Keep **all mobile destinations and gates disabled**.
- [ ] Advance `catalogue.revision` and its valid expiry, regenerate v1/v2/v3 JSON + HTML + Markdown using `node scripts/build-shop.mjs`, then run catalogue tests, licensing, revision/SEO and responsive visual checks.
- [ ] Verify **v1/v2 old-client compatibility** and v3 cache/ETag behaviour. Verify 10 families/12 child ASINs, correct variant selection, disclosure, each destination, category filters, featured order and non-empty Players/Clubs on the **protected staging preview**.
- [ ] Reconfirm no unpublished candidates, source rights notes, Amazon images, credentials or private registration evidence are included in public assets.

No production merge/deploy until these checks are passed. If Amazon account registration/links are not approved for the website, **do not publish a non-functional empty Shop**; keep the draft/preview only.

## Stage 3: website production and rollback

- [ ] Confirm Cloudflare Workers Builds deployment settings and production route/branch before merging. Protected automatic previews are allowed.
- [ ] Review PR #21 and the final successful CI runs; record the release SHA.
- [ ] Merge and deploy to production only after the above checks and an explicit production change-control decision, with rollback SHA recorded.
- [ ] Smoke-test `/shop/`, `/shop-es/`, `/catalogue/v3.json`, generated Markdown, mobile/desktop EN/ES, Amazon links, attribution disclosure, and search-engine indexability of published pages versus blocked previews.
- [ ] Revert the deployment or disable web links immediately if destination or compliance checks fail. Use the versioned catalogue and preserved Git history for rollback.
- [ ] Observe outbound clicks and referral reports without sending tracking URLs, private match data or visitor identities into PadelWrist analytics.

## Stage 4: iPhone/iPad release, independent of web activation

- [ ] Obtain Amazon confirmation that the **specific PadelWrist app** is an Approved Mobile Application, register its App Store URL, verify free-download/link-accessibility conditions and obtain dedicated mobile Store/tracking IDs. Website authorisation does not cover the app.
- [ ] Configure approved per-marketplace mobile destinations and the **binary-owned** mobile programme gate in a reviewed native release. A remote catalogue value must never open this gate.
- [ ] Complete physical iPhone/iPad + paired Watch regressions, Activity/History/Insights/Events/scoring, full VoiceOver, Dynamic Type, restored purchases and entitlement checks, Amazon-installed/not-installed handoff and outbound attribution tests.
- [ ] Resolve the stacked app branch dependencies (#75, #76 and 2.1 baseline); establish the exact approved merge/base sequence. Preserve project settings, signing, local edits and archives.
- [ ] Prepare the actual 2.2 version/build bump, App Store Connect EN/ES metadata and screenshots, archive/sign/upload, internal TestFlight, release review and phased App Store submission.
- [ ] **Do not publish a visible empty or disabled Shop tab to general users.** If Amazon mobile approval is not available when Activity is otherwise ready, choose between holding the combined 2.2 release and shipping an Activity-only build with Shop safely hidden, then a later Shop update. Do not equate website link approval with native approval.

## Production change-control

No approval flags are currently changed by this checklist. Draft PR status and existing website/app deployment state remain unchanged. The user requested progression towards launch, but account status and mobile approval cannot be inferred. Do not publish unsupported product claims or bypass the established evidence fields.
