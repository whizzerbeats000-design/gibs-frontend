# GIBS Editorial Direction — Reduction Report

Date: 2026-09-22
Scope: editorial-direction rework of the GIBS frontend (quiet, art-directed, campaign).
Contract honoured: reduce visual noise first; rebuild typographic hierarchy; no redesign; no novelty effects; nothing invented.

## Diagnostic (what the audit found)

The core problem was **"every section is the loudest version of itself."** Each surface stacked
several competing signatures at once — gold diamonds, gold meridian rules, numbered indices,
uppercase category tags, italic emphasis, gradient/extruded text. When every element claims
"important", none is, and the page reads as template-scan rather than editorial.

Specific findings:
1. **Three-layer header** — a utility bar (Business / Leadership / Impact + 5 secondary links)
   sat above the primary nav plus search + Concierge + Apply + hamburger.
2. **Programme rows carried 4–5 signals** — index, gold uppercase category beside the title,
   serif title, tagline, a repeated "Duration & intake: to be published" line, and an
   arrow-in-a-circle.
3. **Homepage bands doubled down** — Diamond + gold rule + `01 · Undergraduate & Degree`
   label + note, for every band.
4. **Micro-labels everywhere** — eyebrows, meta, categories and captions were semibold/bold with
   0.14–0.18em tracking, i.e. decoration at every level instead of rarity.
5. **Section headings all at the same ceiling** — every `type-h2` rendered at max size, so the
   hero lost its status as the "giant" moment.
6. **Continuous motion** — the floating Concierge launched an infinitely pulsing gold ring
   (banned under "no continuous motion").
7. **Redundant eyebrow double-nouns** — "Admissions · The Journey", "For Organizations · The
   Method", "Global Perspective · The Future", "Faculty expertise · The environment".

## Changes made

**Design tokens (`src/index.css`)**
- `eyebrow`, `eyebrow-light`, `meta`: medium weight (was semibold/bold), tracking 0.10–0.12em
  (was 0.12–0.14em), forest-700 instead of hard-coded `#006837`. Hierarchy now comes from size
  and space, not shouty labels.
- `type-h2` section scale lowered: `clamp(2.1rem, 4vw, 3.4rem)` lh 1.1 (was up to 3.8rem).
  `type-h3` likewise (`clamp(1.5rem, 2.5vw, 2.1rem)`). Prose article headings aligned. The hero
  keeps the largest step, so the page reads as an intentional climb. Hero `type-h1` unchanged.
- Removed the unused `concierge-ping` keyframe and class.
- `prefers-reduced-motion`, coarse-pointer, existing restraint layers intact.

**Header (`src/components/chrome.tsx`)**
- Removed the desktop utility bar entirely (per "keep it simple — Logo, Search, Apply, Menu").
  Header is now a single primary bar. Secondary destinations remain in the mobile menu and footer.
- Sticky filter offsets that assumed the old 108px header corrected to 72px
  (`Programmes.tsx`, `Gallery.tsx`); hero/ArticleDetail xl top-padding trimmed to match the
  slimmer header.

**Hero (`src/sections/Hero.tsx`)**
- Supporting line sharpened: "A business school for the people and institutions building the
  Global Africa." (specific, human, no banned clichés; consistent with the school's published
  positioning).
- Primary CTA relabelled "Explore programmes" (was "Discover our programs"); one primary CTA +
  one quiet text link, per brief.

**Programme catalogue (home + list page)**
- `Programs.tsx`: band headers reduced to a single quiet label `01 — Undergraduate & Degree`
  plus a small muted note (Diamond + gold rule removed). ProgrammePanel rows now follow the
  editorial pattern: category label (quiet, top) → serif title (dominant) → tagline → one
  audience line built honestly from each programme's own data (`For mid-career professionals…`).
  Arrow reduced to a plain hover-slide arrow (circle badge removed).
- `cards.tsx` `ProgramRow` (Programmes page + Executive Education two-track): same pattern.
  Gold uppercase category moved off the title line to a quiet label above; the repeated
  "Duration & intake: to be published" line (identical across every row) removed and replaced
  with the audience line. Bold index numbers calmed to medium/muted.

**Section-level quieting**
- `Approach.tsx`: Diamond + gold rule before the intro removed; commitment indices calmed.
- `Insights.tsx`: featured meta de-tripled (`CATEGORY · STATUS`, gold dash removed); secondary
  category labels quieted.
- `Institution.tsx` / `Campus.tsx`: gold key labels and floating plaque softened.
- `Journey.tsx`: eyebrow "Admissions · The Journey" → "Admissions"; step indices calmed.
- `ConciergeBand.tsx`: removed the gold chat pill badge from the quote card; caption quieted.
- `Concierge.tsx` floating button: pulsing gold ring removed; a single static gold dot reads as
  a live service, not a promo badge.
- `About.tsx`, `ExecutiveEducation.tsx`: trailiing eyebrow suffixes removed
  ("Global Perspective", "The Method", "Faculty Expertise").

## What was deliberately preserved

- Brand identity and system: palette, typefaces, container, pill buttons, meridian rule,
  diamond markers where they earn their place.
- The hero campaign composition (image, four-layer lighting, gold/white extruded type, line
  reveal) — the strongest moment; only copy/CTA hierarchy touched.
- Homepage narrative order (Perspective → Programmes → Experience → Global Perspective →
  Faculty → Insights → Concierge → Admissions).
- Honesty layer: `DataNote`, `officialOnly`, "to be published" markers — nothing invented.
- Accessibility: landmarks, skip link, focus traps, reduced-motion, tap targets, contrast.
- Motion gating and the full-bleed editorial spreads (Institution, Campus, Faculty, Journal).

## Known weaknesses / not addressed

- The Interior pages (Gallery categories, Events chips, Concierge topics, form micro-labels)
  still use `font-bold + 0.16em` uppercase in places; these are functional chrome and were left
  to avoid churn. A later "UI polish" pass could align them with the quieter label style.
- Fractional type-scale calms apply site-wide; long-form article pages (unchanged prose scale)
  may now read slightly smaller relative to headings on desktop — acceptable, but worth an
  eyes-on review.
- The site remains honest about pending official data; the noise reduction does not manufacture
  content density. Marketing copy for closed pages (fees, calendars) still awaits the registrar.

## Performance

- Bundle after this pass: **629.91 kB total / 176.51 kB gzip** (was 633.35 / 177.05) — the
  reduction removed the concierge keyframe and shrank payload slightly; the meaningful win is
  fewer painted labels and one fewer fixed header layer. Known favicon/FontAwesome noise splits
  the rest of the delta; still well under growth targets on mid-range hardware.

## Verification

- `tsc --noEmit`: 0 errors.
- Production build: ✓.
- Full QA sweep (21 routes × 11 widths, 320–1920): 0 console errors; 0 document horizontal
  overflow; screen-reader/focus structure intact. Only known false positives remain (Ken Burns
  mid-scale inside the hero's `overflow:hidden`, and the intentionally scrollable Gallery chip
  row).
- DOM-level assertions confirmed: utility bar gone; `01 — …` band labels render; rows show
  category → title → tagline → audience line; hero copy/CTA updated; concierge ping class gone.

## Appendix — WCAG 2.2 AA gate (Professional-design-system discipline, adapted)

Applied the universal quality gates from the Professional design-system skill to GIBS's own
forest/gold tokens (no brand change; the yellow/black electronics kit was mapped onto GIBS):

- **Semantic tokens only.** Removed the last raw hex values — Hero CTA (`#006837/#005a2f` →
  `bg-forest-600/hover:bg-forest-700`), mobile-nav label (`#006837` → `text-forest-600`), nav
  intro copy (`#4b5563` → `text-muted`). Grep for raw hex in `src` now returns nothing outside
  `index.css` tokens.
- **Visible focus on every interactive element.** Global `:focus-visible` (2px forest-600 ring,
  3px offset) is the default. Suppressed outlines were audited: form fields replace the ring with
  `focus:border-forest-600 + focus:ring`; the global search bar now shows a
  `focus-within:border + focus-within:ring` indicator; skip-link, `<main tabindex=-1>`, and the
  Concierge scroll region retain deliberate focus handling.
- **Dark-surface rings.** Controls on forest-800/900 and hero imagery (`btn-gold`,
  `btn-outline-light`, hero CTA/secondary link, footer subscribe) switch the ring to
  `gold-300` (≈7:1 on forest-800) because forest-600 is invisible there.
- **Target sizes.** `.btn-sm` raised from ≈38 px to a guaranteed 44 px; search suggestion chips
  raised 40 → 44 px. `.chip`, `h-11/h-12` controls, and `field-input` already met 44 px.
- **Form a11y.** All 7 form controls (ProgrammeNav select, programme search, global search,
  concierge, footer email, `Field` input/select/textarea) verified to have an accessible name
  (visible or `sr-only` label, or `aria-label`); errors wired via `aria-invalid`/`aria-describedby`.
- **Verification:** `tsc --noEmit` 0 errors; build ✓ (**630.99 kB / 176.56 gzip**, +1.05 kB for
  the a11y tokens); compiled CSS asserts `min-height:44px` on `.btn-sm` and the gold outline
  overrides render; zero raw-hex leftovers in `dist`.