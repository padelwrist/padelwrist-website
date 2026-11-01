# Optional Amazon Creators API enhancement

## Eligibility and release decision

The account owner reports zero qualifying sales; API access is unavailable. This is an enhancement blocker, **not a Shop release blocker**. Amazon currently documents target-marketplace Associates registration, at least ten qualifying sales in the past 30 days, final Associates acceptance and application registration by the primary account owner. Recheck eligibility and terms when access becomes useful. GitHub secret names/configuration were inspected without reading values; no Creators credentials were present there. Cloudflare secrets were not inspected and their absence is not asserted. No account, programme, credential or paid-resource changes were made.

When eligible, the owner registers a Creators application in Associates Central and obtains Credential ID, Secret and Version. Store these only as Cloudflare Worker secrets (`CREATORS_CREDENTIAL_ID`, `CREATORS_CREDENTIAL_SECRET`, `CREATORS_CREDENTIAL_VERSION`), never source, static assets, HTML, mobile resources, analytics or logs. The secret command must be run by an authorised operator outside this draft task. No PA-API 5.0 integration is introduced.

## Implemented dormant boundary

`src/amazon-creators.mjs` uses server-side OAuth client credentials and fixed Amazon endpoints. Credential version selects the documented regional token endpoint. GetItems requests only authorised image/title/product-info/parent metadata for up to ten ASINs; GetVariations supports bounded paging and transient parent/child/variation attributes for future authenticated editorial review. Neither operation requests offers, prices, ratings or stock. Synthetic mocked tests exercise the adapter; live credentials/schema/account permission have **not** been validated.

The read-only `/catalogue/amazon/v1.json` endpoint is disabled by default. Global `CREATORS_API_ENABLED`, independent `CREATORS_WEB_CONTENT_APPROVED` / `CREATORS_MOBILE_CONTENT_APPROVED`, marketplace-specific surface tracking IDs, credentials and a matching published/reviewed/enabled catalogue destination are all required. Arbitrary candidate, private staging or research-ASIN lookup is rejected. The public endpoint does not expose GetVariations or an editor. Mobile additionally requires the app's independent binary programme/content approval and tracking-ID map. Website approval never grants native permission.

All current flags are false, all destination gates remain closed. Fixed hosts, HTTPS, redirect rejection, bounded JSON, request timeout and generic errors limit exposure. API responses are stripped to a small transient envelope, exact ASIN/tag/marketplace matched, and marked `Cache-Control: no-store`. Tokens live only in Worker memory with bounded expiry. No KV, R2, D1, scheduled jobs, credentials provisioning or paid infrastructure is added. On any failure the endpoint returns unavailable; the editorial feed and Shop continue normally. Before activation review quota/rate abuse controls against the account allowance; no operational capacity claim is made by mocked tests.

## Licensing, expiry and optional rendering

The current UK content licence prohibits caching image bytes; image URLs and other Product Advertising Content have short retention limits (currently at most 24 hours). Client applications may not cache Product Advertising Content. ASIN identifiers can be retained for editorial identity. Use a conservative one-hour maximum transient server envelope, refreshed on a future authorised render, and never the curated native seven-day disk cache. Responses use no-store; no official content is checked into static HTML, Markdown or JSON. Do not download, permanently store or rehost Amazon images. Any future renderer must use the authorised URL directly only on a permitted surface, link content to the corresponding approved Amazon product and replace it with first-party artwork at expiry/failure. No official renderer is enabled in this PR.

Native `ShopCreatorsContent` is Decodable-only and held outside the durable catalogue. Its dormant client fails before networking while programme/content gates are closed; it validates surface, exact destination/tag/ASIN, permitted image host, size and expiry. It is not wired into the current image renderer. Before enabling that renderer, implement and verify memory-only/no-disk image loading, on-screen expiry removal, revocation/failure fallback, required Amazon content notices and refreshed terms for each marketplace. Never use ordinary cached image loading for official content. Existing first-party photo loading and original artwork remain independent.

Manufacturer and PadelWrist-owned photography follow separate documented rights and do not depend on API eligibility. Amazon API content use on the website and on an approved mobile app must be authorised separately; approval to link and approval to use content are not interchangeable. Existing OneLink website URLs remain untouched. Mobile uses explicitly approved marketplace IDs/URLs, with no website-tag reuse, geo-IP or tracking proxy.

## Enablement checklist (future approval)

- Reconfirm qualifying sales, final Associates acceptance, target-marketplace terms and account-owner registration.
- Obtain credentials securely, establish rate limits within existing infrastructure and verify real GetItems/GetVariations responses without logging secrets/content.
- Obtain separate website/mobile content permissions and mobile programme/tracking approval; verify actual selected child ASINs and links.
- Review current licence, notices and Amazon-link obligations; implement expiry-aware authorised renderers and privacy tests, including revoked access and expired images.
- Review a draft PR and explicit deployment/commercial activation approval. Never enable flags simply because credentials exist.

Official sources checked 1 November 2026:
- [Creators API prerequisites](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction)
- [Registration and credential ownership](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/onboarding/register-for-creators-api)
- [OAuth, GetItems and GetVariations examples](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/get-started/using-curl)
- [Official image resources](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/api-reference/resources/images)
- [UK programme policies and content licence](https://affiliate-program.amazon.co.uk/help/operating/policies)
- [Mobile application approval](https://affiliate-program.amazon.co.uk/help/node/topic/GHBY6W8UPTEFD3ZX)
