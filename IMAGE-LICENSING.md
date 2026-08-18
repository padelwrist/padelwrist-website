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
