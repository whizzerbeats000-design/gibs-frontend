# 06 — Desktop Density & Premium Scale Correction (Architecture)

> Status: approved plan. Implementation follows this document, then a 13-width
> verification sweep. This is a **refinement pass**: the GIBS brand language,
> content, data, accessibility bar and mobile/tablet behaviour are unchanged.
> Nothing is committed or pushed until the user explicitly authorises it.

## 1. Problem statement

The desktop system inflates in three ways that read as oversized:

1. **Every section carried `--section-y: 112px`** at `≥1024px` before the
   desktop retune. Adjacent differently-coloured sections stacked `224px` of
   empty canvas between content blocks — a large, hollow rhythm. (Shipped: the
   base token is now `72px` at `lg`; see §3.)
2. **Type rungs scale too far.** `type-h2` climbs to `54px`, `type-h1` to `88px`.
   Section headings compete with page titles; card titles (`type-h3`, `33.6px`)
   and body (`18px`) grow faster than the measure needs.
3. **Column pairs float apart** (`gap-14`/`gap-12` in 12-col grids) and a few
   composite cards spread to consume the whole container width.

## 2. Density contract

| Tier | Guidance | Decision |
| --- | --- | --- |
| < 640 (mobile) | stacked, focused, the reference for restraint | **unchanged** |
| 640–1023 (tablet) | balanced | **unchanged** everywhere below `lg` |
| 1024–1279 | compact editorial desktop | driven by the `lg` tokens below |
| 1280–1535 | primary desktop | driven by the same tokens (caps hold) |
| 1536+ | **no inflation** | hard `clamp()` ceilings + 1280 container hold |

**Viewport width never drives component inflation.** Fluid `vw` terms only let
type catch up to a ceiling; above the ceiling size stops. The 1280px container
already prevents horizontal stretch; this pass makes vertical space and type
follow the same rule.

## 3. Vertical rhythm (`index.css` tokens)

The site already has a semantic two-tier rhythm (`--section-y`, `--band-y`).
We retuned the desktop tier and stopped there. As implemented in `index.css`:

| Token | base | sm (640) | lg (1024) | previous lg |
| --- | --- | --- | --- | --- |
| `--section-y` | 64px | 80px | **72px** | 112px |
| `--section-y-major` | 64px | 80px | **112px** | 112px |
| `--band-y` | 48px | 64px | **64px** | 64px |

- 72px keeps ordinary sections clearly taller than bands, so the tier system
  keeps doing work.
- `--section-y-major` was deliberately **not** retuned: it stays at `112px` at
  `lg` so cinematic closings still read spacious while ordinary sections hold
  the tighter tier. This is the only place `112px` survives.
- `--band-y` was left at `64px`; the `56px` band proposed here did not ship.
- The `--pt-page*` / `--pt-hero*` header-clearance tokens are **not changed** —
  they solve a different problem (clearing the fixed header) and already read
  tight.

The dominant win is automatic: every `section-y` section site-wide tightens from
112 → 72 at `lg`, while nothing on mobile or tablet moves.

## 4. Typography ceilings (`index.css` `@utility` rungs)

Hard caps with flatter `vw` slopes. Floors are kept ≥ current mobile values so
small screens never regress.

| Rung | current | new | floor (mobile) | cap (desktop) |
| --- | --- | --- | --- | --- |
| `type-h1` | `clamp(2.4rem,6.5vw,5.5rem)` | `clamp(2.4rem,5.5vw,5rem)` | 38.4px (same) | 88 → **80px** |
| `type-h2` | `clamp(2.1rem,4vw,3.4rem)` | `clamp(2rem,3vw,2.75rem)` | 33.6 → **32px** | 54.4 → **44px** |
| `type-h3` | `clamp(1.5rem,2.5vw,2.1rem)` | `clamp(1.5rem,1.8vw,1.75rem)` | 24px (same) | 33.6 → **28px** |
| `type-body` | `clamp(0.95rem,1.5vw,1.125rem)` | `clamp(0.95rem,1.2vw,1.0625rem)` | 15.2px (same) | 18 → **17px** |

Notes & rationale:

- **The climb gets steeper, not flatter.** Old ratio hero:section = 88:54 ≈ 1.6;
  new ratio = 80:44 ≈ 1.8. Hero stays the loudest moment; sections sit one quiet
  rung below it. This serves the stated hierarchy
  *hero → page/section → card → body → metadata*.
- `type-h3` is deliberately held at 24px across most desktop widths (floor wins
  until ≈1334px, then a slow ride to 28px) so **card titles read compact and
  editorial**, and programme rows stay dense.
- One `type-h1` rung serves both the home hero and page titles: 80px is still a
  dramatic hero, and page titles gain the "controlled editorial scale" the pass
  asks for, with no second utility to drift.
- The hero paragraph in `Hero.tsx` inlines its own clamp (`1.5vw → 1.125rem`).
  It is realigned to the new `type-body` cap (17px) for system coherence
  (colour stays white — `type-body` is not used there).

## 5. Grid & composition

### 5.1 Intentional 12-col spans

The pass follows the existing asymmetric 12-col patterns and only tightens their
gaps. No layout is redesigned; the intent is "one composed system" instead of
columns floating apart.

- **Approach ("What we ask of ourselves")**: 4/8 → **5/7** with the intro in the
  left 5 columns and the three commitment rows in the right 7; remove the
  rendered `pl-10` offset that made the right block hover off the grid; rows go
  `py-8/9` → `py-6/7`; grid gap `12/10` → `10/8`.
- **Journey ("How to subscribe")**: `gap-14` → `gap-12`; right column `pl-8` → `pl-6`.
- **Faculty & Scholarship**: `gap-14 lg:gap-12` → `gap-12 lg:gap-10`; theme grid
  `gap-x-10 gap-y-12` → `gap-x-8 gap-y-10`.
- **Campus experience (home)**: `gap-14 lg:gap-10` → `gap-12 lg:gap-10`.
- **ConciergeBand**: `gap-14` → `gap-12`; the green quote card keeps its
  colour-singularity but its `p-9 sm:p-12` padding is trimmed to `p-8 sm:p-10`.
- **ClosingQuiet** (used on several pages): `lg:gap-14` → `lg:gap-10`.

### 5.2 Programme catalogue

Already a compact two-column directory register (`DIRECTORY_GRID`, `gap-y-3`).
This pass does **not** change its column count (a third column would strangle the
schedule + fee bar), but the catalogue benefits automatically from the new
`type-h2`/`type-h3` caps and the tighter section rhythm. The bottom out-band of
`/programmes` is trimmed `pb-24 → pb-20`, `sm:pb-32 → sm:pb-24`.

### 5.3 Over-spread composites

- **Insights featured card (home)**: `lg:p-8 lg:gap-12` → `lg:p-6 lg:gap-8`.
  The 7/5 image–text split stays; the card stops swallowing the whole container.
- **ResearchInsights featured**: top spread `lg:gap-14` → `lg:gap-10`.
- These are the only two "single large card" moments on the site; both keep
  their editorial 7/5 shape but stop consuming the full viewport width.

### 5.4 Executive education

- Hub cards: 4-up grid at `lg` is correct and stays; heading/paragraph type
  tightens via the rungs.
- Dark "In-Plant" panel: `p-8` → `p-7`; `gap-12 lg:items-center` grid stays.
- The 22-programme register uses the shared `DIRECTORY_GRID` (no code change).

### 5.5 Header & hero

- **Header: quiet, unchanged.** It is already a single 72px bar with small nav
  type; making it smaller would add whitespace, not remove it.
- **Hero: dramatic, unchanged.** `h-[84/74/72svh]`, 80px headline after the rung
  change, gradient + film-grain system untouched. The hero is the *one* moment
  that keeps its size — everything around it reads quieter against it, which is
  the "depth via composition, not scale" outcome.

## 6. Files changed (implement)

| File | Change |
| --- | --- |
| `src/index.css` | lg `--section-y` 112→72; `type-h1/h2/h3`/`type-body` clamps |
| `src/sections/Approach.tsx` | 5/7 span, tighter gap, denser commitment rows |
| `src/sections/Programs.tsx` | band rhythm `space-y-14→12`, heading/CTA spacing, `lg:pl-6→4` |
| `src/sections/Insights.tsx` | featured card `p-6 gap-8` |
| `src/sections/Journey.tsx` | `gap-12`, `pl-6` |
| `src/sections/Faculty.tsx` | `gap-12 lg:gap-10`, theme grid `gap-x-8 gap-y-10` |
| `src/sections/Campus.tsx` | `gap-12` |
| `src/sections/ConciergeBand.tsx` | `gap-12`, quote `p-8 sm:p-10` |
| `src/components/ui.tsx` | ClosingQuiet `lg:gap-10` |
| `src/pages/ResearchInsights.tsx` | featured `lg:gap-10` |
| `src/sections/Hero.tsx` | hero paragraph cap → 17px |
| `src/pages/Programmes.tsx` | bottom out-band padding trim |
| `src/pages/ExecutiveEducation.tsx` | in-plant panel `p-7` |

Deliberately **out of scope** (would add churn without addressing the brief):
gallery/open-day layouts (already editorial rows), cards.tsx geometry, header
chrome, `--pt-*` clearance tokens.

## 7. Verification

1. `npm run build` + `tsc` — zero errors.
2. `node scripts/qa/regression.mjs` — axe, heading order, geometry on the built
   `dist/`.
3. Width sweep at 320 / 360 / 390 / 430 / 640 / 768 / 820 / 1024 / 1280 / 1366 /
   1440 / 1536 / 1920 (plus 1024×768, 1280×800, 1366×768, 1440×900, 1920×1080):
   `overflow-x` 0, no clipping, computed font sizes and section paddings captured
   for the "hero → approach → programmes → insights → concierge" run on the home
   page and the key catalogue pages.
4. Before/after screenshots for: home hero, "What we ask of ourselves",
   programme directory, executive education, faculty, campus, gallery,
   research-insights.
5. **Definition of done** (user-specified): desktop no longer oversized; single
   cards do not consume the viewport; type ceilings hold; intentional vertical
   rhythm; 12-col grid serving real spans; desktop compact but not cramped;
   tablet/mobile pixel-comparable to pre-pass.
6. No commit / no push until the user explicitly authorises it.