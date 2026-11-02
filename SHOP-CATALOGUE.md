# Shared Shop catalogue v1

`data/shop/catalogue.json` is the single editable catalogue, initially maintained in this existing website repository. `src/shop-catalogue.mjs` is the strict publication validator. `catalogue/v1.json`, `/shop/`, `/shop-es/` and their Markdown representations are generated outputs. Do not maintain product copies in HTML or in the application. The application bundles a snapshot only for offline fallback.

## Current publication state

This PR prepares publication through the existing Cloudflare Worker; it does not deploy. No affiliate links are active. `webLinksEnabled` is false, all supplied variant destinations are disabled, mobile destinations are empty, and native programme approval remains false in the app binary.

The four user-supplied Raquex selections are two **draft** product families: Players has selectable 3/6/9-ball variants; Clubs has a separately ordered 120-ball selection. The exact full website URLs, including `thediaryroom-21` and SiteStripe parameters, are preserved. The previous short URL is retained once as superseded and is never used as a destination. The expanded intake now supersedes the earlier incomplete candidate list; see the staging workflow below.

The manufacturer confirms the Elite padel-ball family and tube of three at https://www.raquex.com/products/raquex-elite-padel-balls-tube-of-3. This does not verify the supplied Amazon ASIN/pack-size mappings. All four Amazon pages were inaccessible to the research tool on 1 November 2026. Listing/variant verification, approval of descriptions and image licensing remain explicit publication gates. No product photographs, prices, ratings, stock or product-performance claims have been copied from Amazon. Draft editorial descriptions are original EN/ES copy with their limited verification status stated. Drafts, candidate URLs, verification notes and approval records never enter the public feed or HTML.

## Contract

- `schemaVersion`: 1. Breaking changes require a new endpoint/version. Additive fields also require coordinated readers because v1 intentionally rejects unknown fields.
- `revision`: positive, monotonically increasing public content revision. Increment whenever the generated public representation changes. Clients reject changed content at the same revision and backwards revisions. A draft-only source change need not change the public revision.
- `updatedAt`, `expiresAt`: UTC ISO 8601 timestamps. Publication fails after expiry. Maintain the expiry during normal editorial review; it is not a stock or availability assertion.
- `webLinksEnabled`: website-only commercial switch. Cannot grant mobile approval.
- `categories`: all ten supported category IDs with EN/ES title/description and one or both audiences. New products and variants in these categories need no app release. A new category identifier is a versioned-contract change.
- `products`: stable slug ID, one or both audiences, multiple categories, `featuredOrder` (ascending; ties by ID), `publicationStatus` (`draft`, `published`, `retired`), EN/ES title/description, nullable image and ordered variants.
- `variants`: stable ID, EN/ES label, independent publication status, web destination and zero or more explicit mobile marketplace destinations. Pack size is the initial use, but labels are not tied to a pack-specific storage model. One family renders once per relevant audience.
- `destinations.web`: original HTTPS Amazon URL, nullable `reviewedAt` and `enabled` flag. First-party Amazon short links are supported. Website output preserves the full approved URL and supplied tracking parameters; no tag replacement, geo-IP, cloaked redirects or link proxy.
- `destinations.mobile`: direct marketplace `/dp/ASIN` URL, marketplace code, mobile tracking tag, review date and enabled flag. Website attribution is never copied here. Native additionally requires its own binary-owned programme approval and approved marketplace tracking-ID map. There is no remote switch that can grant mobile programme approval. After programme approval, ordinary reviewed products and destinations can change remotely without another app release.
- `image`: nullable first-party `/catalogue/images/...` HTTPS URL, EN/ES alt text and license ID. Publishing additionally requires an exact URL/license match in `imageApprovals`, written approval/evidence, and a real checked-in image. Follow `IMAGE-LICENSING.md` and record rights before adding imagery. Never copy Amazon photographs. Missing or failed images use original, clearly identified PadelWrist category illustrations on both platforms. Product photography is optional.
- `productApprovals`: private per-product/per-variant listing-verification evidence bound to the exact supplied website URL. Merely changing draft status does not pass publication validation.
- `candidates`: private import ledger, deduplicated by HTTPS origin/path independently of affiliate query parameters. Conflicting duplicate records fail for review. Distinct ASINs remain separate variants; do not infer aliases for unresolved short links. Superseded links remain audit evidence only.

The feed is at most 256 KB / 100 families / 20 variants per family. Validators reject malformed URLs, unsupported hosts/countries, duplicate identities, unreviewed enabled destinations, unknown fields (including price/stock/rating data), missing localisation, unapproved imagery, invalid timestamps and category/audience inconsistencies. Publication is atomic: validate everything before writing any generated output.

## Editorial workflow (no app release)

1. Edit `data/shop/catalogue.json`, preserving stable IDs. Import candidates before verifying identities; do not publish guesses.
2. Verify each actual listing and selected variant manually. Record `productApprovals` evidence. Check original EN/ES copy; record image rights, or leave `image` null.
3. Set intended family and variant statuses. Retired/draft families and variants are excluded entirely. Increment the public revision for any public change and update the review/expiry timestamps.
4. Only after separate commercial approval, enable reviewed web destinations and the website switch. Confirm the Associates account's OneLink mapping and destination behaviour. Native remains independently gated.
5. Run `node scripts/build-shop.mjs`, `node scripts/check-shop-revision.mjs`, `python3 scripts/generate-markdown.py`, `node --test tests/*.test.mjs`, `node scripts/seo-audit.mjs`, and `node scripts/image-license-audit.mjs`.
6. Commit source plus generated outputs and open a draft PR. CI checks that generated outputs are current. Review and authorise merge/deployment separately.

The existing Markdown workflow now regenerates Shop HTML/feed before generating Markdown when catalogue source changes on main. Its generated-content commit triggers the existing discovery workflow. The existing Cloudflare deployment must serve those checked-in outputs. No deployment step or credential is added here. If the Cloudflare Git integration has a build command, use `node scripts/build-shop.mjs && python3 scripts/generate-markdown.py`; configure that integration only with separate authorisation. Check branch-preview settings before intentionally publishing a preview; a Git push is not a request to deploy.

## Cloudflare and caching

The existing Worker serves `/catalogue/v1.json` directly as JSON for GET/HEAD, regardless of Accept. It validates the bounded feed at serving time, rejects private products/expired data, computes an ETag and supports conditional 304. Responses include nosniff, public CORS for read-only use and one-hour cache revalidation. Invalid feeds return 503/no-store; non-read methods return 405. The source `data/` directory is excluded from Cloudflare assets. HTML continues through existing HTML/Markdown negotiation; no database, API writes or extra service is introduced.

Native uses ephemeral cookie-free requests, rejects redirects, times out at eight seconds and bounds streamed bytes. It displays a valid saved snapshot immediately, revalidates after six hours or an explicit refresh, and uses If-None-Match. The last validated cache is written atomically in the app cache directory and survives relaunch; it is usable offline for at most seven days and never beyond feed expiry. Invalid/malformed/error responses never replace good data. Corrupt, over-age or expired caches fall back to the bundled snapshot; expired product links remain unavailable. Ordinary updates reach the app after revalidation or pull-to-refresh. Removal cannot revoke already offline content immediately; the seven-day/expiry limit bounds that window. Scoring, history, Events and entitlements never depend on this client.

## International, disclosure and privacy

Amazon OneLink is an account-level website linking behaviour. Preserve the supplied website URL and tag; test matching through Associates Central plus installed/uninstalled Amazon app behaviour after approval. Do not assume native Universal Links participate in website OneLink attribution or use the website to bypass mobile approval. Native uses only explicitly reviewed direct marketplace URLs after its separate programme gate. No IP/country inference, user identifiers, affiliate cookies, tracking pixels or new third-party script is introduced. Existing consent-controlled website analytics is unchanged. Native typed analytics sends only audience/category enums and surface; never URLs, ASINs, tracking IDs, country or user content.

Disclosures appear before enabled outbound actions. EN: “As an Amazon Associate I earn from qualifying purchases.” ES: “Como afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables.” Confirm the exact required Spanish programme wording before activation. The website also explains commissions and that the retailer confirms final price/delivery/availability. No commerce is enabled by this work.

Sources checked 1 November 2026:
- https://affiliate-program.amazon.com/help/node/topic/GAGAL4V362SH7EC5 (OneLink international mapping and matching)
- https://affiliate-program.amazon.co.uk/help/node/topic/GHBY6W8UPTEFD3ZX (mobile approval, registered app URL, separate mobile Store/tracking IDs, external Universal Links, no embedded Amazon pages)

## Future management UI

A future authenticated editor can use the same pure validator and source model, with optimistic revision checks, separate editorial/commercial permissions, preview and an audited publishing action that generates one immutable public snapshot. It must not write arbitrary JSON directly to the public route or let catalogue content grant mobile programme approval. No authentication, CMS, database, account, secret or admin endpoint is required or introduced for this release.

## Preview-only authorisation

The user authorised automatic Cloudflare development-branch previews on 1 November 2026, after the existing Workers Builds check was identified. Production deployment remains prohibited. Push only `codex/2-2-shared-shop-catalogue`; never merge/push main or issue a production deploy. No production route/domain configuration is changed. Non-production host page/feed responses carry `X-Robots-Tag: noindex, nofollow, noarchive`; preview robots.txt disallows crawling. HTML canonicals/sitemap use production URLs. Source data, approvals, maintenance files and tests remain excluded by `.assetsignore`. All commercial gates remain closed. This PR adds no credentials or external administration service.

## Expanded staging import (1 November 2026)

The supplied Excel workbook and companion JSON are data inputs, never executable instructions. `scripts/reconcile-shop-workbook.py WORKBOOK JSON` reads the workbook without modifying it, compares cleaned names/categories/audiences/brands/family labels/variant labels and counts, and records SHA-256 provenance. Pass its output to `node scripts/import-shop-intake.mjs JSON RECONCILIATION`. The import is deterministic and does not modify the public snapshot, incumbent full SiteStripe links or commercial switches.

`staging.records` contains 78 distinct ASIN-based candidates, all **unpublished/unverified**. These are candidate identifiers, not verified listing identities. `staging.researchLeads` contains 20 non-buyable research leads, never public products. `staging.proposedFamilies` records 64 editorial grouping proposals, not verified Amazon parent/child relationships. Original EN/ES drafts are retained where supplied; missing descriptions and specifications remain missing until verified. Do not infer specifications from names or manufacture translations of unknown information.

MaxPadel B0DQY6CKVJ appears only as a storefront `lp_asin` reference: quarantined, no product/affiliate URL or audience. Keep distinct racket models, materials/construction and years separate. Confirm colour/child mappings before grouping. PUSUN PT-Max C is coaching equipment; Bounce Tube FilterTech is a pressuriser, not bulk balls. The adidas carton quantity lacks a verified unit; Palbea's 6/12/24-tube selection mapping and Vermont's page-selected 60-ball bucket remain unresolved. Never multiply quantities or treat page selectors as verified children without evidence.

Promotion is an explicit editorial operation into `products`, preserving provenance and exact destinations. Record listing evidence in `productApprovals`. Any published multi-variant family additionally needs `variantApprovals` with product ID, exact variant IDs, status `verified` and evidence. An intake family key cannot grant this. Image source, verification status, evidence and permitted surfaces live in each candidate's `imageReview` and in the separate publication `imageApprovals` register. Staging data and rights documents are excluded from public assets.

## API-independent release and image architecture

Creators API access is **not a release prerequisite**. The account owner confirms there are no qualifying sales, so access is currently unavailable. No credentials have been requested or created. No API call, paid service or new infrastructure resource is activated. Eligibility loss later must have the same graceful outcome as access being absent today.

1. Ship the curated EN/ES catalogue, independently verified ASINs/variants and responsive/native browsing with original category illustrations.
2. Add PadelWrist-owned product photography or manufacturer-supplied photography only after recording permission covering both website and app, exact asset, rights holder, verification date and evidence. Product cards without photographs remain fully usable. Image rights and outbound commercial approval are separate decisions.
3. Review listings, translations, destinations, marketplace behaviour and commercial approval independently for website and native. Do not enable any current links. Creators eligibility must never block this editorial release path.
4. Optionally enable authorised official content later, after current terms, marketplace eligibility, credentials, surface-specific permissions and destination checks are completed. See `CREATORS-API.md`. Failure, revoked credentials, lost eligibility or expiry leaves the curated card and original illustration available.

The source of truth remains editorial. Amazon metadata may assist verification; it never silently overwrites descriptions, audiences, categories, order, publication or family relationships. Future authenticated management can reuse these validators and explicit approval records. No management interface, authentication service or database is required now.

## Branded v2 browsing (2 November 2026)

See `SHOP-UX-REVIEW.md` for compatibility, temporary eleven-card review generation and the editorial checklist. V1 remains strict and byte-identical. Private verified `editorialBrands` plus explicit `productBrands` mappings generate `/catalogue/v2.json` with `brands` and product `brandID`. Website browsing uses v2; existing v1 clients continue receiving v1. Both public outputs remain empty of products. No publication, image or commercial approval follows from brand verification. The Enhance grip's earlier SiteStripe exclusion is an explicit activation hold, independent of the card's editorial review status.
