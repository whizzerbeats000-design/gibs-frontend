# GIBS Frontend — Project Map

Evidence basis for the responsive audit and refinement brief. All file references are relative to `/root/gibs-frontend`. Route inventory verified from `src/lib/router.tsx` and source-tree traversal; data counts verified from `src/lib/data.ts`.

## 1. Stack

| Layer | Choice | Notes |
|---|---|---|
| Build | Vite 7.3.2 + React 19.2.6 + `vite-plugin-singlefile` | Ships one `dist/index.html` (963.67 kB / 200.00 kB gzip) |
| Styling | Tailwind CSS 4.1.17 (`@tailwindcss/vite`) | Design system lives in `src/index.css` `@theme` + `@utility/@apply` blocks |
| Motion | framer-motion ^13.4.0 | Loader wraps every route; reveals + list stagger; card hover tilt; `useReducedMotion` honored in catalogue + loader |
| Router | custom hash router (`src/lib/router.tsx`) | `#/route`; `useSeo`; route change triggers a full-page `Loader` fade |
| Data | `src/lib/data.ts` (7,525 lines) | Official GIBS data, RC 1178333 |
| Testing | playwright-core + axe-core + `tsc` + `vite build` | No unit-test framework; verification is browser-driven |

## 2. Routes (17 + 3 detail edges + 404)

| Route | Source | Detail |
|---|---|---|
| `/` | `src/pages/Home.tsx` | Sections: Hero, Programmes, About preview, Insights, Campus, Events, Concierge band |
| `/programmes` | `src/pages/Programmes.tsx` | Scope/destination tabs, sticky filter+search, catalogue |
| `/programmes/:slug` | `src/pages/ProgrammeDetail.tsx` | ProgrammeNav scroll-spy, detail + FAQs |
| `/executive-education` | `src/pages/ExecutiveEducation.tsx` | Foreign hubs, 4 destinations |
| `/admissions` | `src/pages/Admissions.tsx` | Subscription process, form CTA |
| `/about` | `src/pages/About.tsx` | Genesis, governance, timeline |
| `/faculty` | `src/pages/Faculty.tsx` | Advisors + governance |
| `/research-insights` | `src/pages/ResearchInsights.tsx` | Themes + article index |
| `/research-insights/:slug` | `src/pages/ArticleDetail.tsx` | Prose editorial |
| `/campus` | `src/pages/Campus.tsx` | Locations, facilities, capacity |
| `/gallery` | `src/pages/Gallery.tsx` | Filterable grid + lightbox |
| `/events` | `src/pages/Events.tsx` | Executive sessions / conferences |
| `/events/:slug` | `src/pages/EventDetail.tsx` | Event detail |
| `/contact` | `src/pages/Contact.tsx` | Full form + validation |
| `/concierge` | `src/pages/ConciergePage.tsx` | GIBS AI landing |
| 404 | `src/pages/NotFound.tsx` | Any unmatched hash |

Shared chrome in `src/components/chrome.tsx`: Header (72px), skip link, mobile nav sheet, nav backdrop, GlobalFooter, SearchModal, ErrorBoundary. Floating **GIBS AI concierge** launcher (`src/components/Concierge.tsx`) is `xl:hidden` (mobile/tablet) with a desktop header button; opens a bottom-sheet (mobile) / 400px panel (≥sm).

## 3. Design system (`src/index.css`, 885 lines)

- **Colors**: forest `50→950` (#006B1B = 600 brand), gold `100→700` (#EBD375 = 300 accent), `ivory #f3f0e8`, `paper #faf7ef`, `stone #ece8dc`, `ink #121212`, `muted #4a5568`, `line #e4e1d5`; status colors for forms only. **Light-only**; no dark mode.
- **Type**: `--font-display: "Instrument Serif"` (hero), `--font-serif: "Fraunces"` (card titles/blockquotes), `--font-sans: "Space Grotesk"` (body), `--font-baskerville: "Libre Baskerville"` (mobile menu sheet). All four families confirmed loaded at runtime via the `index.html` `<link>` (see audit).
- **Rhythm**: `--section-y` (64/80/112), `--band-y` (48/64/64), `--pt-*` hero paddings, `--gutter-x` = `px-(--gutter-x)` on `.container-x` (max-w 1280). 92 raw `py-16/20/24/28/32/36` utilities remain un-tokenised across 23 files.
- **Z-scale**: header 50, nav 60, search 70, concierge 80, skip 55, subnav 30, sticky panel 20, lightbox 100. Header height token `--header-height: 72px`; sticky offsets derive from it.
- **Components**: `.container-x`, `.eyebrow` (forest-700 label), `.meta`, `.type-h1/h2/h3`, `.card-title`, `.btn-primary/outline`, `.prose-editorial`, `.film-grain`, `.card-spot`, `.card-depth` (no-JS progressive reward), motion utilities honoring reduced-motion.

## 4. Data layer (`src/lib/data.ts`)

- **PROGRAMMES**: 135 official (113 Local + 22 Foreign). Foreign destinations: Kigali (8), Dubai (5), London (4), Houston (5).
- CATEGORIES: 15 (verified in `src/types/data.ts`); **EVENTS** (status date-derived), **ARTICLES**, **FACULTY_ADVISORS** (49), **CAMPUS_LOCATIONS**, NAV_LINKS, RESEARCH_THEMES, STATIC_PAGES.
- `imageSet(url)` emits `-640.webp`/1376w srcset. Foreign programmes share a **single destination image** per hub (verified `imageSet` per-capital query — no site-graph leak; see audit note ACCPT-01).
- Constants verified: `DIRECTORY_MIN = 9`, `GRID_COLS {1,2,3}`, `listStagger` capped at 0.5s, `colsFor(n)` balances low-count rows.

## 5. Interaction model

- Global search modal: `/` and button; live index over programmes/pages/research/insights; Enter opens first result; focus trap + Esc close.
- Mobile nav: sheet with focus trap, Esc close; menu link entries.
- Programme filters: destination tabs + category chips + search; results summary `aria-live`.
- Gallery lightbox: arrow-key/touch swipe, focus trap, Esc.
- Contact form: required-field validation (8 invalid markers observed).
- Concierge: keyboard shortcut support (tests showed launcher + panel open/close work).