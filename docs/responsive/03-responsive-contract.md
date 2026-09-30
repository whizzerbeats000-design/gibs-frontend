# Responsive Contract — GIBS Layout & Behaviour Rules

This contract is the single specification implementer agents/engineers must follow. Derived from the design system in `src/index.css` (ground truth) and the brief. Any change that violates it is a defect.

## 1. Brand, light-only

- Forest green `#006B1B` (forest-600) is the **dominant** signal; Muted Gold `#EBD375` (gold-300) is a **restrained** accent on dark surfaces; warm ivory `#f3f0e8` / paper `#faf7ef` surfaces. No dark mode. No invented colors.
- No content fabrication: GIBS dataset is official; the site must never present invented programmes, stats, testimonials, or photographic content.

## 2. Type

- Display: Instrument Serif. Body/UI: Space Grotesk. Card titles/serif: Fraunces. Mobile menu sheet: Libre Baskerville. All loaded from Google Fonts (the `<link>` in `index.html`; keep the redundant `@import` cleanup coordinated with `Font-A4`).
- Hierarchy: type scale `--pt-hero-sm/lg`, `.type-h1/h2/h3`, `.eyebrow`, `.meta` must not be redefined ad-hoc.

## 3. Layout & rhythm

- **Container**: `.container-x` = `mx-auto w-full max-w-[1280px] px-(--gutter-x)`. Never widen beyond 1280; never remove horizontal gutter.
- **Section rhythm**: `--section-y` (64/80/112) and `--band-y` (48/64/64) are the only vertical-rhythm sources going forward. Raw `py-16/20/24/28/32/36` on section-level wrappers (92 across 23 files) are to be replaced by `.section-y` / `.band-y` utility aliases during implementation — this is the scope of `Rhythm-R1`. (Mirror the existing pattern: tokens already live in `@theme`; the alias utilities are added once and reused.)
- **Header / sticky**: header = 72px single bar at all breakpoints; `--header-height` is the single source. Subnav (programme detail) = `--subnav-height`; sticky offsets reference these tokens. **No** new sticky bars without matching `--sticky-top`/scroll-padding updates.
- **Z-scale**: header 50, nav 60, search 70, concierge 80, skip 55, subnav 30, sticky panel 20, lightbox 100. Never invent new high z-values outside the scale.
- **Breakpoints** (Tailwind default, hardcoded instances approved to remain): catalogues switch strip↔card at `lg` (1024). Tablet `sm:grid-cols-2` verified at 600–768.

## 4. Grids

- Programmes catalogue: `DIRECTORY_MIN = 9`. ≥9 → 3-column flat strips; <9 → `colsFor(n)` balanced cards; 1 result = 1 card col (orphan-free). Flow: mobile = 1 col, `sm:grid-cols-2`, `lg` = strip column. Switching grid cells at breakpoints is done via `lg:hidden`/`hidden lg:block` wrappers.
- Gallery: grid math + lightbox; feature tile indices (`filtered[0]/[1..2]/[3]/[4..5]`) are **length-guarded** and must stay guarded.
- No content grid may exceed the viewport; horizontal scroll is allowed only on deliberately-scannable strips (filter chips, subnav tabs) with `scrollbar-none`.

## 5. Motion

- **Reduced-motion honored**: catalogue (listStagger) and contains `useReducedMotion`; loader and reveals must drop to static when set. Never reintroduce long opacity-0 parking.
- Reveal moves that clipped during the audit at rest are fine; axe must be run **after** reveal settles (see audit §3).
- Card hover tilt only under `(hover:hover)`; no-JS fallback = flat card with depth classes.

## 6. Accessibility floor (non-negotiable)

- Each page: exactly one `h1`; heading order increments by one (no skips) — fixes `A11y-A2`.
- Images: `alt` unless decorative (`aria-hidden`) with matching-empty `alt`.
- Interactive targets ≥44px on mobile (chips/tabs in tabs row keep `min-h-[40px]`+`p-` and must stay tappable; concerge fix touch target as needed).
- Keyboard: skip link → content; all dialogs trap focus; Esc closes overlays; focus visible (`focus-visible` ring).
- `<dl>`-style grouped content stays semantic; `<li>` inside `<ul>` only.
- Contrast at rest ≥4.5:1 text / ≥3:1 large or bold UI (verified current state passes with the eyebrow forest-600 = 6.29:1, primary btn = 5.91:1).
- Sightline: sticky header/subnav must never overlap interactive content during scroll (`scroll-padding`).

## 7. Behaviour rules

- Hash router: never change `#/…` scheme. SEO `useSeo` stays on both document head and per-route; title/desc unique per route.
- All state is client-side (category/destination/query, gallery filter, concierge). No server, no persistence unless the brief adds it.
- No new runtime dependencies without explicit approval (performance gate in plan).

## 8. Verification method

All claims in the final report must be evidenced from the /tmp/opencode harness or equivalent run against this contract: 10-viewport overflow matrix, axe at rest, heading-order sweep, reduced-motion run, keyboard interaction probes, and before/after measurements for each P0–P3 work batch.