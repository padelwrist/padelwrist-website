# Shop category photography rights review — 2 November 2026

These are category-context photographs, not photographs of the products offered. The curated catalogue's product `image` fields remain null and product/publication/commercial approvals remain pending. Image approval below approves only the stated category use. The 11-family / 13-ASIN isolated review selection is unchanged.

Each selected source page was individually inspected on 2026-11-02 and explicitly marked **Download free / Free to use under the Unsplash License**. The [Unsplash licence](https://unsplash.com/license) permits downloading, modification, distribution and commercial use in websites and apps. No Unsplash API integration, subscription or paid licence is used. Source copyright permission does not establish model, property or trademark releases. Crops exclude identifiable faces and distinctive tattoos; brands are allowed by the user's 2 November direction, with no endorsement assertion. Photographs are decorative next to category names, and every product fallback explicitly says **Image for illustration purposes only** / **Imagen solo con fines ilustrativos**. Neither bulk quantities nor exact model/specification are inferred from generic photographs.

| Category | Original photo / photographer | Visual and rights review |
|---|---|---|
| Rackets | [zTwzxr4BbTA](https://unsplash.com/photos/padel-racket-on-court-zTwzxr4BbTA), Manuel Pappacena | User-selected free photo. HEAD branding is visible; cropped torso/hand, no face. Never an exact NOX/Bullpadel likeness or endorsement. |
| Balls | [e69rGF9Cx7U](https://unsplash.com/photos/a-tennis-ball-with-a-yellow-and-black-logo-on-it-e69rGF9Cx7U), Oskar Hagberg | Photographer explicitly describes a padel ball on court. CABRA branding retained under user direction; generic fallback does not claim Raquex identity. |
| Bags | [FWuRa-0X6G8](https://unsplash.com/photos/a-duffle-bag-sitting-on-top-of-a-tennis-court-FWuRa-0X6G8), SideSpin Padel | Bag/balls, no people; visible SideSpin logo does not imply exact NOX or Raquex product identity. |
| Grips | [LkDwaZPFYfI](https://unsplash.com/photos/a-person-holding-a-tennis-racket-in-their-hand-LkDwaZPFYfI), Antonio Araujo | Orange grip/hand detail; no face or distinctive tattoo. Not a claim about Enhance colour/fit. |
| Accessories | Same Antonio Araujo photo | Racket surface detail. Illustrative equipment context, not a specific pressuriser, accessory or supplied item. |
| Bulk Balls | [LwxVG0VQ3RY](https://unsplash.com/photos/many-tennis-balls-scattered-on-a-court-near-net-LwxVG0VQ3RY), Tahamie Farooqui | User-selected free photo. Photographer describes **tennis training balls**, not independently verified padel balls. Use as illustrative training context only; never evidence of Raquex identity, ball specification or 120-ball quantity. |
| Coaching | [3sSbRisCnmE](https://unsplash.com/photos/a-blue-tiled-floor-with-a-white-line-in-the-middle-3sSbRisCnmE), Oskar Hagberg | Empty indoor padel court/net. Training setting, not a claim to show a ball machine or particular coaching tool. No people. |
| Court Equipment | Same Oskar Hagberg court photo, distinct crop | Net/enclosure detail. No identifiable people or prominent facility branding. No facility endorsement. |
| Tournament Equipment | [aVNyXCpeS-0](https://unsplash.com/photos/a-tennis-court-with-a-net-and-chairs-aVNyXCpeS-0), Bruno Vaccaro Vercellino | Lower court/net crop excludes the venue banner and buildings. Court context, not specific tournament supplies. No people. |
| Footwear | [qBXveRormj0](https://unsplash.com/photos/woman-in-tennis-attire-on-blue-court-with-racket-qBXveRormj0), erjola qerimi | Free source caption says Padel. Lower-leg/shoe crop excludes face, torso and identifiable body details. Generic footwear context; no model specification asserted. |

## Rejected and alternate sources

- User's `0iZDFQPkDJY` and `aVPiVRUn2Zg`, both Andy Quezada: original pages explicitly say **Unsplash+ License**. Not downloaded or included.
- Tomasz Krawczyk `M2x3A8Q4JbY`: free, but misleading source title; the inspected image shows a racket, not shoes. Not included.
- Original high-angle rackets `Cj35lHL4atY`, Vincenzo Morelli (caption credits Emanuela D’Ambrosi), and Sergio Contreras `wLAtpQ53Pfw`: free candidates reviewed but superseded; not included in shipped derivatives.
- Additional provider discovery: Pexels includes free padel photographs; Pixabay includes padel results, Shopify/Burst and StockSnap provide free libraries. None of their assets is used in this revision. The supplied mister-chad resource URL returned Not Found, so it is not licensing evidence. Provider adverts/Unsplash+ tiles are excluded.

## Evidence and asset controls

`data/shop/catalogue.json` holds exact source URL, photographer, licence URL, date, verification, surfaces, rights considerations, crop in downloaded-source pixels, original dimensions, download URL/SHA-256, native asset name and each derived file SHA-256. `image-licenses.json.shopCategoryAssets` mirrors these records. Native bundles the same evidence in `Resources/Shop/category-photo-licenses.json` and identical JPEG derivatives in named asset catalogues. Original downloads are not committed; no Amazon photograph is downloaded or included.

All crops use a reserved 8:5 composition with restrained saturation (0.88) and contrast (1.03), no generated content or object removal. Web has 320/640/960 WebP plus progressive 960px JPEG; native uses the same 960px JPEG through the asset catalogue, with no stock-provider network requests. Images load lazily/async on web; native category images are local. Category text and product copy remain separate from photographs. Failed approved product photos fall back to category context; failed category files fall back to original geometric SVG/PNG artwork. Native missing-asset fallback uses the original artwork and its original label. No image metadata is added to the strict public v1/v2 catalogue contracts.

`node scripts/audit-shop-photography.mjs [NATIVE_SOURCE_ROOT]` checks licence fields, web/mobile permission, registry parity, exact derivative hashes, four responsive files per category, bounded file sizes and unknown assets. With the native root it also checks identical JPEG bytes and native licensing records. The normal image audit invokes this check; catalogue tests reject paid/unverified/wrong-surface category records and prevent generic stock from passing as approved exact-product imagery.

Creators API content remains a separate dormant, transient content path; existing permissions, expiry, cache and mobile approval guards are unchanged. Manufacturer product images still require documented permission for website and app. SiteStripe is not an image source. No product or affiliate approval is granted by this document.

## Final product-card direction (user review, 2 November)

Category navigation retains the reviewed branded photographs where useful. Individual product cards use a **separate unbranded contextual crop set**, recorded in `productFallbackPhotography`, `photo-context-*` web files and `shop-context-*` native assets. Bag cards use strap/zip detail with the SideSpin mark excluded; racket/accessory cards use unbranded racket-surface detail; grip cards show only the handle/hand; ball cards use the unbranded training-ball context selected by the user. Cropped generic photos never establish exact model, colour, pack size or manufacturer. Category and product-fallback records are separately hash-bound even when they share an original source. No generic photograph is inserted into product `image` metadata.

The current caption is “Image for illustration purposes only” / “Imagen solo con fines ilustrativos”. “Click to view product” is omitted while destinations are disabled. Approved links, if later authorised, already have their own explicit View on Amazon action. The original artwork remains the final technical fallback. Product/publication/commercial records are unchanged.
