# Image licensing policy

PadelWrist only uses photography and illustration that is suitable for commercial website use without mandatory attribution, or assets owned by PadelWrist.

## Current approved sources

### PadelWrist-owned assets

The PadelWrist app icon, favicon and touch icon are first-party brand assets. They are not third-party stock photography.

### Unsplash free library

Current Unsplash photography has been individually checked against its source page and is marked **Download free / Free to use under the Unsplash License**.

The Unsplash License permits commercial and non-commercial use without permission or mandatory attribution. Attribution is appreciated by Unsplash but is not required.

Current reviewed assets are recorded in `image-licenses.json`.

### Pexels

Current Pexels photography has been individually checked against its source page and is marked **Free to use**.

The Pexels License permits free commercial and non-commercial use and does not require attribution.

Current reviewed assets are recorded in `image-licenses.json`.

## Additional third-party-rights rule

A stock-photo copyright licence does not automatically remove every possible trademark, privacy, publicity or property-right issue in every use.

For future PadelWrist imagery:

- Prefer photographs without prominent third-party logos, copyrighted artwork or recognisable private property.
- Prefer photographs without clearly identifiable people where an equivalent image is available.
- Never imply that a person, club, brand or equipment manufacturer shown in stock photography endorses PadelWrist.
- If a commercial use depends materially on an identifiable person, brand or property, verify the relevant release or replace the image.
- Do not use Unsplash+ imagery unless the applicable Unsplash+ licence has been separately obtained and recorded.
- Do not add imagery from a new provider until its commercial-use and attribution terms have been reviewed and added to the register.

## Attribution

PadelWrist may voluntarily credit a photographer, but no current stock image used by the website requires attribution as a condition of the licence.

## Repository enforcement

`scripts/image-license-audit.mjs` checks external image URLs in HTML against `image-licenses.json`. The GitHub SEO audit workflow runs this check on pushes and pull requests. Any new external image must therefore be reviewed and explicitly added to the register before CI passes.

## Review date

Last reviewed: 18 August 2026.

This register is an operational licensing record, not legal advice. Provider terms can change, so licences should be rechecked when imagery is materially changed or replaced.


## Shop imagery (1 November 2026)

Shop imagery has stricter surface-specific records in `data/shop/catalogue.json`. Accepted sources are `padelwristOwned`, `manufacturerLicensed` and `padelwristIllustration`. Every published asset requires an exact URL/license match, `status: approved` in the publication image register (`imageReview.verificationStatus` during intake), dated review, documentary evidence and `permittedSurfaces` covering **web and mobile**. A manufacturer's public product page alone is not permission. Record the rights holder, exact assets and authorised uses in the referenced evidence; do not commit private correspondence or sensitive personal information. Permission revocation requires removing the asset from editorial publication and reviewing cached-content exposure.

Ten original geometric category illustrations are in `catalogue/images/`; their creation and first-party permission are recorded in `data/shop/rights/category-illustrations.md`. Native bundles derived PNGs. These depict categories, never an asserted product likeness, and product fallbacks say “Category illustration” / “Ilustración de categoría”. Missing/failed photos use these fallbacks. Alt text describes licensed product photography; category decoration is hidden from assistive technology beside its category title.

Do not download, scrape, hotlink or rehost Amazon product photography without authorisation. Future Creators API image URLs are a separate transient content channel: never copy them into this static editorial image register, generated HTML/Markdown, the public curated feed, local fallback, durable native cache or asset library. Do not fetch/rehost image bytes on Cloudflare. Optional authorised display must obey then-current licensing and refresh limits; expired or unavailable content returns to original artwork. See `CREATORS-API.md`. No Amazon images are currently displayed.

## Shop category photography — 2 November 2026

This revision supersedes geometric artwork as the primary Shop category visual. Individually checked free Unsplash photographs are locally hosted with original artwork retained as a technical fallback. Branded context is permitted by the user's review direction; it must not imply endorsement or exact product identity. `unsplashCategory` is a category-only source and **cannot** pass the product-image approval function. See `data/shop/rights/unsplash-category-photography.md` for each original photo, exclusions, licence terms, crop and rights evidence; `image-licenses.json.shopCategoryAssets` and native mirrored records retain exact hashes and web/app coverage. Public v1/v2 feeds and product approvals are unchanged. The image audit now checks these local assets as well as external references.
