# PadelWrist website design-system audit

## Why this audit exists

The current site has accumulated several visual layers over time: the original responsive grid, later homepage-specific responsive overrides, compatibility stylesheets for inner pages, and a recent premium pass. Individually many of those changes are reasonable, but together they create inconsistent gaps, breakpoints, alignment and surface treatment.

This audit replaces ad-hoc page styling with one explicit system inspired by Material Design 3 while keeping the established PadelWrist brand and Apple-product feel.

## Material 3 principles adopted

Material 3 is used as a layout and hierarchy framework, not as an instruction to make the website look like an Android app.

### Adaptive width classes

Use the Material window-size model as the primary breakpoint system:

- **Compact:** below 600px
- **Medium:** 600px to 839px
- **Expanded:** 840px and above
- Additional large-screen constraints are handled by a maximum content width rather than introducing unrelated one-off breakpoints.

### Layout grid

- Compact: 4 columns, 16px outer margin, 16px gutters.
- Medium: 8 columns, 24px outer margin, 24px gutters.
- Expanded: 12 columns, 32px outer margin, 24px gutters, max content width 1280px.
- Elements on the same visual axis must resolve to the same grid line. Avoid one-off widths that visually drift from the main layout.

### Spacing

Use a 4px base unit and a constrained spacing scale:

`4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 120, 144`

Rules:

- Related text: 8-16px.
- Heading to supporting description: 16-24px.
- Inside meaningful surfaces: 24px compact, 32px expanded.
- Between sibling components: 16px compact, 24px medium/expanded.
- Between major sections: 80px compact, 96px medium, 120px expanded.
- Zero-gap layouts are only allowed when two elements are intentionally one composed surface.

### Typography roles

Use Material 3 role thinking with PadelWrist fonts:

- Display: Montserrat, large marketing statements.
- Headline: Montserrat, section/page headings.
- Title: Montserrat, component headings.
- Body: system/SF stack.
- Label: system/SF stack for navigation, metadata and controls.

Typography should preserve a predictable size/line-height relationship rather than using unrelated `clamp()` values per component.

### Shape and elevation

- Use a small shape scale rather than arbitrary radii: 12, 16, 24, 28px and full/pill only for true pill controls.
- Prefer tonal surface separation and borders to heavy shadows.
- Cards are only used for meaningful grouped content. Editorial text should not be boxed by default.

### Interaction and accessibility

- Minimum interactive target: 48px where practical.
- Visible keyboard focus.
- Reduced-motion support.
- Motion must not change information order or alignment.

## Audit findings in the current implementation

### High priority

1. **Three competing responsive systems.** `home.css`, `home-responsive.css`, `pages.css` and `launch.css` use overlapping breakpoints such as 1100, 1024, 920, 860, 820, 760, 560 and 520px. This makes alignment dependent on which stylesheet wins rather than a deliberate adaptive model.
2. **Inconsistent grid gaps.** The site currently mixes 1px, 16px, 18px, 20px, 24px and zero-gap compositions for sibling layouts. The recent premium pass made this more visible.
3. **Grid definitions change independently.** Homepage sections use 12-column layouts, then switch to three-column or single-column overrides at unrelated widths. Inner pages use separate 12/8/4 rules.
4. **Vertical rhythm is component-specific rather than systemic.** Similar heading/description pairs use different margins and alignment rules, causing their baselines and starts to drift.
5. **Compatibility stylesheets contain real layout logic.** `launch.css` is described as a compatibility shim but contains responsive layout overrides. `tokens.css` imports `postlaunch.css`, which means component CSS is loaded as a side effect of the token layer.

### Medium priority

6. **Shape scale is not constrained.** 14, 18, 20, 22, 24, 28, 30, 32 and 36px radii all appear in closely related components.
7. **Typography is visually inconsistent.** Some page headings and section headings are uppercase, others sentence case, with several unrelated fluid sizes and line heights.
8. **Navigation differs structurally between homepage and inner pages.** The recent floating treatment is applied by page-specific CSS instead of one shared top-bar system.
9. **Related links alternate between pills, plain links and bordered rows without a clear semantic distinction.**
10. **The Guides hub inherits article styles and then overrides them heavily.** It should be treated as a distinct collection layout that still uses the same spacing/grid tokens.

## Implementation target

The corrective pass should:

1. Consolidate all breakpoint decisions to Compact / Medium / Expanded.
2. Move all layout, spacing, typography and shape values into shared tokens.
3. Remove `home-responsive.css` from runtime and make `launch.css` a true compatibility-only file.
4. Stop importing component styles from `tokens.css`; homepage final CTA styles belong in `home.css`.
5. Rebuild homepage sections and inner-page layouts on the same 4/8/12 grid.
6. Use one vertical spacing rhythm for all section heading/description combinations.
7. Make visual QA at 390px, 768px and 1440px part of the review process before merging.
8. Preserve product copy, SEO metadata, app-store CTAs, accessibility and existing functionality unless a change is required to repair layout semantics.
