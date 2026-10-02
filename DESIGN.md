# PadelWrist website design direction

## Design thesis

PadelWrist should feel like a premium sports product made for Apple devices: dark, precise, energetic and confident. The visual hierarchy should keep the product itself at the centre rather than relying on generic marketing decoration.

Material Design 3 is the structural reference for adaptive layout, type roles, spacing discipline, shape roles and accessible interaction. It is **not** a visual instruction to make the PadelWrist website look like an Android application. PadelWrist branding, real product imagery and the Apple-oriented product character remain the visual layer.

## Adaptive layout system

Use one responsive model across the whole site.

- **Compact:** below 600px, 4-column grid, 16px outer margin, 16px gutter.
- **Medium:** 600px to 839px, 8-column grid, 24px outer margin, 24px gutter.
- **Expanded:** 840px and above, 12-column grid, 32px outer margin, 24px gutter, maximum content width 1280px.

Do not add component-specific breakpoints unless there is a documented content requirement that cannot be solved within these window-size classes.

Elements that appear visually aligned must resolve to the same grid lines. Similar page types should use the same column spans unless their information hierarchy genuinely differs.

## Spacing system

Use a 4px base unit and this shared spacing scale only:

`4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 120, 144`

Default relationships:

- label to heading: 16px
- heading to supporting description: 16-24px
- paragraphs within a section: 12-16px
- meaningful surface padding: 24px compact, 32px expanded
- sibling component gap: 16px compact, 24px medium/expanded
- page-heading to content: 48px compact, 64px expanded
- major section spacing: 80px compact, 96px medium, 120px expanded

Zero-gap layouts are only allowed when adjoining elements intentionally form one composed surface, such as the image and copy areas of a single final CTA.

## Brand palette

- **Bandeja Blue** `#335FFF` — primary product/action surface.
- **Nevera Navy** `#0D2433` — dark supporting surface.
- **Net Neon** `#ECFE00` — high-energy sporting state/accent.
- **Lob Lilac** `#8099F9` — supporting informational accent.
- **Overgrip Orange** `#FF6B45` — secondary sporting accent.
- **Baseline Black** `#000000` — deepest background.

Use colour with purpose. Do not turn every section into a different coloured card. White remains the default high-contrast text colour on dark surfaces.

## Typography

Use Material-style semantic type roles, implemented with PadelWrist typography:

- **Display:** Montserrat SemiBold for the largest marketing statement only.
- **Headline:** Montserrat SemiBold for page and section headings.
- **Title:** Montserrat SemiBold for component headings.
- **Body:** SF/system-first sans serif for readable content.
- **Label:** SF/system-first for navigation, metadata and controls.
- **Wordmark:** Montserrat SemiBold 600, uppercase `PADELWRIST`, with deliberate tracking.

Avoid creating one-off font sizes per component. A heading and its equivalent on another page should share the same role, line height and spacing relationship.

Keep body copy comfortably readable and avoid overly wide measures. Use large display type selectively. Headings should carry hierarchy, not decoration alone.

## Composition

- Prefer editorial sections, strong type and meaningful whitespace over repeated nested cards.
- Use asymmetric layouts where they strengthen the product story, but keep their edges on the shared grid.
- The homepage reading order should be: product promise → product proof → key reasons → grouped capabilities → device roles → guides → launch action.
- Related information should group through proximity before containers are added.
- All heading/description pairs should share a predictable vertical rhythm and baseline logic.
- Cards should have consistent internal alignment. When cards form a row, headings and descriptions should begin from consistent vertical positions unless the content hierarchy deliberately differs.

## Product imagery

- Prefer real PadelWrist interface screenshots and real Apple device compositions.
- Do not invent fake in-app screens when real product UI exists or will be supplied.
- The homepage hero should ultimately feature Apple Watch, iPhone and iPad together.
- Until final device artwork is available, use the real PadelWrist app icon or a restrained placeholder rather than a fabricated scoreboard.
- Use consistent image aspect ratios within equivalent content collections.

## Surfaces and shape

Use a constrained shape scale:

- 12px small
- 16px medium
- 24px large
- 28px extra large
- full/pill only for genuinely pill-shaped controls

Dark surfaces can use subtle navy/black atmosphere and restrained blue/lilac glow. Prefer tonal separation and restrained borders to heavy shadows.

Avoid excessive rounded cards. Rounded containers should represent a meaningful surface or focal product image, not every content group.

## Navigation and controls

- Use one shared top-app-bar treatment across homepage and inner pages.
- Interactive targets should be at least 48px high where practical.
- Related links should use the same treatment across equivalent pages. Do not alternate arbitrarily between pills, chips, plain text and card links.
- Primary and secondary actions must be visually distinct without relying on novelty styling.

## Motion

- Motion should feel purposeful and polished, not bouncy or playful for its own sake.
- Respect `prefers-reduced-motion`.
- Use subtle reveal/transition behaviour only where it reinforces hierarchy.
- Motion must not alter layout geometry, create horizontal overflow or make alignment depend on animation state.

## Accessibility

- Maintain strong text contrast, especially on brand colours.
- Keep keyboard focus obvious.
- Maintain logical DOM and focus order when layouts reflow.
- Keep tappable controls comfortably sized on mobile.
- Product imagery must have useful alt text without repeating nearby copy unnecessarily.

## Visual QA requirement

A design-system change is not complete from code review alone. Before merging a layout change, review representative full-page screenshots at:

- 390px compact width
- 768px medium width
- 1440px expanded width

At minimum review the homepage, Guides hub, a normal guide, a product page, Support, Privacy and 404. Check grid alignment, horizontal overflow, sibling gaps, heading/description rhythm, footer alignment and control sizing.

## Anti-patterns

Avoid:

- competing breakpoint systems;
- one-off gap values outside the spacing scale;
- zero gaps between unrelated sibling elements;
- arbitrary card radii;
- generic purple-to-blue SaaS gradients;
- card grids for every section;
- cards nested inside cards;
- grey text on bright coloured backgrounds;
- invented device UI presented as real product imagery;
- excessive icon tiles above headings;
- excessive pill labels;
- copy or imagery that makes PadelWrist feel like a generic fitness tracker rather than a padel scoring product.

## Naming rule

Ordinary brand references: **PadelWrist**.

Visual wordmark only: **PADELWRIST**.
