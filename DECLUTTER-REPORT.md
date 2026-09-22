# GIBS Frontend — Declutter & Simplify Pass

Pass rule set applied project-wide:
1. Max 3 text levels per item/card (title + short line + action)
2. One idea per block; section intros ≤1 sentence
3. Length caps: eyebrows 1–4 words, card deks ~60 chars, section intros ~120 chars, hero subtext ≤2 lines mobile
4. All-caps limited to short eyebrows + small numbers (long caps → sentence case, grey, smaller weight, or removed)
5. Eyebrows w600, letter-spacing 0.14–0.16em; bold(700) only on buttons + tiny numbers
6. Minimum type size 11px; body 15–16px; secondary 13–14px
7. No repetition of the same info/tags/levels on one screen
8. Generous padding, hairline rules over boxes
9. ≤1 primary action per section; secondary actions are quiet text links
10. Moved information is never deleted from the data layer — it surfaces as small detail blocks on the relevant page

No routes, data structures, images, or functionality changed. No facts invented; `[OFFICIAL GIBS DATA REQUIRED]` convention and `DataNote` pending markers preserved.

## Global
- `.eyebrow` / `.eyebrow-light` letter-spacing 0.12em → 0.14em (`src/index.css`)
- `prefers-reduced-motion: reduce` block verified present (unchanged)
- All-caps tracking across the app normalized to 0.14–0.16em; no element below 11px remains (build + rendered verification)

## Shared components
- `chrome.tsx` — header "Business School" wordmark 9px→11px, utility tagline 10px→11px (tracking 0.28→0.16em), mobile "More from GIBS" 10.5→11px, footer wordmark 9.5→11px, footer column titles 10.5→11px (0.26→0.16em), mobile-menu numbers 10px→11px (0.12→0.16em), menu + footer caps tracking 0.2em→0.16em
- `cards.tsx` — EditorialCard meta 10.5px→11px, tracking 0.22→0.16em; ProgrammeRow number + gold link tracking →0.16em
- `ui.tsx` — form Field hint/error 12.5px→13px
- `Concierge.tsx` — header label 10→11px, "Suggested questions" + footnote 10.5→11px, drawer login pill 10.5→11px
- `PageHero`, `ProgrammeNav`, `Search` — reviewed; already compliant

## Home sections
- `Programs.tsx` — ProgrammePanel collapsed from two text rows to one sentence-case category line (13px semibold); band labels tracking 0.24→0.16em
- `Approach.tsx` — removed second intro paragraph; commitment numbers tracking 0.22→0.16em
- `Journey.tsx` — intro shortened (dropped sentence already covered by DataNote); step numbers 0.2→0.16em
- `Institution.tsx` — intro shortened; "Global excellence" value shortened; labels 0.2→0.16em
- `Faculty.tsx` — intro shortened
- `Insights.tsx` — removed the "Research themes" chips row (duplicated Faculty) + its unused `RESEARCH_THEMES` import; tag rows 10.5→11px, 0.16em
- `Campus.tsx` — intro shortened; floating gold box 10.5→11px, 0.16em; dropped "Official site details…" (implied by box's DataNote tone)
- `ConciergeBand.tsx` — caption tracking 0.24→0.16em

## Pages
- `Home` — unchanged except shared components (hero + three cards already within the target scale)
- `About` — Chapter IV body shortened (dropped the "nothing here is invented" sentence; the adjacent DataNote already states it)
- `Programmes` — hero intro shortened to one sentence
- `ProgrammeDetail` — hero intro changed from `tagline + summary` to tagline-only (summary moved/kept in Overview, removing in-hero repetition); curriculum step numbers 0.22→0.16em; removed the Admissions-section fact grid that duplicated the "At a glance" sidebar (Format/Duration/Intake/Fees already shown there); kept the requirements DataNote + six-step link
- `ExecutiveEducation` — hero intro shortened to one sentence; method step numbers 0.24→0.16em
- `Admissions` — removed the second "Concierge page" link side-by-side with "Ask the Concierge" (kept single primary action)
- `Campus` — reviewed; sections within scale (descriptive caps on facilities/environments kept as intentional statement labels at 12px/0.14em)
- `Faculty` — removed the caption line under the directory that duplicated the EmptyState body
- `ResearchInsights` — hero intro shortened; featured category tracking 0.24→0.16em
- `ArticleDetail` — status pill 10.5px→11px, tracking 0.22→0.16em; removed the masthead "Authorship" row (it repeated the "Written by" byline block on the same screen — authorship still shown once, lower down)
- `Gallery` — hero intro shortened; category labels tracking 0.2→0.16em
- `Contact`, `Events`, `EventDetail`, `ConciergePage` — PageHero intros shortened; pill labels 10→11px; removed "You can ask…" block + "Prefer a person?" footnote (repeated the Concierge panel copy)

## Data copy (`src/lib/data.ts`)
- 6 programme `summary` strings shortened (kept non-empty — Search/filter consume them)
- 4 research `blurb`s shortened
- 3 article `dek`s shortened

## Concierge engine (`src/lib/concierge.ts`)
- Longest reply ("what can I expect…") trimmed to one focused sentence

## Verification (against the built `dist`, 18 routes × 390px/1440px)
- Font sizes < 11px: **0**
- Hero intros > 2 lines at 390px: **0**
- Tap targets < 28px: **0**
- `prefers-reduced-motion: reduce` present
- `npm run build` exit 0 — 625.79 kB (gzip 175.42 kB)

## Screenshots
- Before: `/tmp/shots-before/` (45 files)
- After: `/tmp/shots-after/` (45 files — all routes at 400/1440 full-page + `menu-open@400`, `search-open@1440`, `concierge-open@1440`)