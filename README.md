# PadelWrist website

Static marketing website and padel knowledge base for the PadelWrist iOS, iPadOS and watchOS app.

## Front-end architecture

The site intentionally has a small CSS/JavaScript surface. Do not add new override or "final pass" stylesheets for routine changes.

### CSS

- `assets/tokens.css` — PadelWrist colours, typography, spacing, radii, motion and adaptive grid tokens.
- `assets/site.css` — shared shell, 12/8/4-column responsive grid, header, navigation, footer, links, focus states, cookie consent and shared utilities.
- `assets/home.css` — homepage-only promotional layout, photography, feature sections, FAQ and campaign CTA.
- `assets/pages.css` — Guides hub, long-form guides, Support and Privacy layouts/components.

`assets/styles.css` and `assets/launch.css` are temporary compatibility entry points for older static inner-page templates. New pages should use the consolidated files directly. Once all existing templates have been migrated, remove the shims.

### JavaScript

- `assets/site.js` — shared navigation, mobile menu, breadcrumbs, reveal behaviour, App Store CTA preparation, privacy-first GA4 consent and interaction tracking.
- `assets/motion.js` — restrained homepage parallax/motion with `prefers-reduced-motion` support.

## Design direction

PadelWrist uses its own visual identity, with Apple HIG as the hierarchy/accessibility reference and Material 3 as inspiration for adaptive layout discipline, tonal surfaces, component states and responsive behaviour.

The expanded layout uses a 12-column grid, medium layouts use 8 columns and compact layouts use 4 columns. Shared horizontal alignment should use the tokens in `tokens.css` rather than page-specific container widths.

## Local preview

From the project directory, run:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Quality checks

The GitHub Actions SEO audit checks page titles, descriptions, canonical URLs, H1s, Open Graph metadata, image alt text and JSON-LD. Keep it green when adding or changing pages.

## Cloudflare

The site uses plain HTML, CSS and JavaScript and requires no build step. Cloudflare Workers serves the repository root as static assets using `wrangler.jsonc`.
