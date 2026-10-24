# GIBS Frontend — Project Map

Ground truth for the responsive audit and refinement brief. All file references are relative to `/root/gibs-frontend`.

**How this document was verified.** Every claim below was read out of the working tree at the revision named in §7, not carried forward from an earlier draft. Route inventory comes from `src/App.tsx` and `src/lib/router.tsx`; the source inventory from a full traversal of `src/`; the build description from `vite.config.ts`, `scripts/seo-gen.mjs` and the actual contents of `dist/`; the data counts from `src/lib/data.ts`; the sizes in §7 from a measured build. Statements that could not be confirmed were removed rather than softened — the previous revision of this file listed six routes and two components that do not exist in the tree, and described a single-file build that the build no longer produces.

## 1. Stack

| Layer | Choice | Notes |
|---|---|---|
| Build | Vite 7.3.7 + `@vitejs/plugin-react` 5.1.1 | Emits **hashed external assets**, not a single inlined HTML file. See §2. |
| Language | TypeScript 5.9.3, `strict` | `npx tsc --noEmit` is the type gate. |
| UI | React 19.2.6 | |
| Styling | Tailwind CSS 4.1.17 via `@tailwindcss/vite` | Design system lives in `src/index.css` (`@theme` tokens + `@utility`/`@apply` blocks). |
| Motion | framer-motion ^13.4.0 | Used for `Stagger`/list sequencing and card micro-interaction. The 105 `Reveal` instances are CSS-transition based — see §6. |
| Router | custom hash router (`src/lib/router.tsx`) | No router dependency. `#/route` is the single source of truth. |
| Data | `src/lib/data.ts` (7,548 lines) | Official GIBS data, RC 1178333. **Read-only for this work** — see §8. |
| Testing | `@playwright/test` 1.64.1 (E2E) + `node:test` (unit) + `axe-core` + `tsc` | Unit tests are plain `node:test` files under `scripts/qa/`. |

`vite-plugin-singlefile` is **not** used. It was in `vite.config.ts` until commit `5a3b363` ("perf(seo): externalize asset bundles and add crawlable static navigation"), which replaced the inlined single file with hashed external assets so the static SEO shells could reference real, cacheable assets. The dependency was left behind in `package.json` and has been removed.

## 2. Build architecture

`npm run build` is three stages:

1. **`vite build`** — bundles the SPA into `dist/assets/`:
   - `dist/assets/index-<hash>.js` — application bundle
   - `dist/assets/index-<hash>.css` — the Tailwind output
   - `public/` is copied verbatim to `dist/` (`images/`, `fonts/`, `favicon.ico`, `robots.txt`).
   The `<hash>` is Vite's content hash. `vercel.json` serves `/assets/<name>-<8+ char token>.<ext>` with `Cache-Control: public, max-age=31536000, immutable`, and everything else with `must-revalidate`.

2. **`node scripts/seo-gen.mjs`** — generates the static SEO shells. It reads the programme catalogue out of `src/lib/data.ts`, then emits **158 HTML shells**:
   - 135 programme shells (`/programmes/<slug>`)
   - 15 category shells (`/programmes/category/<slug>`)
   - 8 institutional shells (`/programmes`, `/about`, `/contact`, `/admissions`, `/executive-education`, `/gallery`, `/concierge`, `/privacy-policy`)

   Each shell is written **twice** — as `<route>.html` and as `<route>/index.html` — so that both extension-ful links and clean paths resolve without a rewrite. That is why `dist/` holds 317 `.html` files for 158 logical routes. The same script writes `dist/sitemap.xml`, which lists 159 URLs (the 158 routes plus the homepage).

3. **`node scripts/qa/seo_shell_metadata_check.mjs`** — validates the generated shells (title/description/canonical/OG metadata, crawlable navigation, shell size) and fails the build if a shell is malformed. It is part of `npm run build`, so a broken shell fails the build rather than shipping.

Tailwind's automatic source scan is disabled in `src/index.css` with `@import "tailwindcss" source(none)`. Only `src/` and `index.html` are explicit sources. This prevents generated build output, Playwright reports, or other root-level artifacts from changing the CSS bundle.

## 3. Routes

Resolved in `src/App.tsx` (`RouteView`) against the hash router.

| Route | Page | Detail |
|---|---|---|
| `/` | `src/pages/Home.tsx` | Sections in order: `Hero`, `Perspective` (`sections/Approach`), `ProgrammeDiscovery` (`sections/Programs`), `GlobalPerspective` (`sections/Institution`), `ConciergeBand`, `AdmissionsTeaser` (`sections/Journey`) |
| `/programmes` | `src/pages/Programmes.tsx` | Destination tabs, category chips, sticky filter + search, catalogue |
| `/programmes/category/:slug` | `src/pages/Programmes.tsx` | Same component, pre-filtered by category; unknown slug renders `NotFound` |
| `/programmes/:slug` | `src/pages/ProgrammeDetail.tsx` | Detail, `ProgrammeNav` scroll-spy, FAQs |
| `/executive-education` | `src/pages/ExecutiveEducation.tsx` | Foreign hubs |
| `/admissions` | `src/pages/Admissions.tsx` | Enquiry process, FAQs, form CTA |
| `/about` | `src/pages/About.tsx` | Genesis, governance, timeline |
| `/gallery` | `src/pages/Gallery.tsx` | Filterable grid + lightbox |
| `/contact` | `src/pages/Contact.tsx` | Contact details + form with validation |
| `/concierge` | `src/pages/ConciergePage.tsx` | GIBS AI landing |
| `/privacy-policy` | `src/pages/PrivacyPolicy.tsx` | Website privacy and data-protection notice |
| *unmatched* | `src/pages/NotFound.tsx` | Renders for any unmatched hash route |

There are **no** `/faculty`, `/research-insights`, `/research-insights/:slug`, `/campus`, `/events` or `/events/:slug` routes, and no `Loader` component. The previous revision of this file listed all of them.

### Routing and path adoption

`src/lib/router.tsx` is a dependency-free hash router:

- Every in-site link emits `#/route`. The hash is the single source of truth.
- On entry, if the URL has **no** hash, the served path is adopted as the route and mirrored into the fragment with `replaceState` — so a shared clean URL like `https://gibs.com.ng/programmes` renders the programmes page instead of silently falling back to the homepage. `replaceState` (not `pushState`) keeps Back/Forward unaffected.
- The pathname is reset to `/`, so every reachable URL has the same shape (`/#/route`), which is what the canonical/`og:url` strategy in `index.html` assumes.
- A direct hit on `/index.html` is not treated as a route named `index.html` (`DOCUMENT_PATHS`).
- An unknown **hash** route reaches the client router and renders `NotFound`. An unknown **clean** path gets the platform's HTTP 404 before the app runs, so the client router cannot replace it. This asymmetry is intentional and should be preserved.

Shared chrome lives in `src/components/chrome.tsx`: Header, skip link, mobile nav sheet, nav backdrop, `GlobalFooter`, `SearchModal`, `ErrorBoundary`. The **GIBS AI concierge** launcher (`src/components/Concierge.tsx`) is `xl:hidden` on mobile/tablet and a header button on desktop; it opens a bottom sheet on mobile and a 400px panel from `sm` up.

## 4. Source structure

```
src/
  main.tsx              entry point
  App.tsx               route table + chrome composition
  index.css             design tokens, Tailwind entry, component classes
  components/           chrome.tsx, Concierge.tsx, Search.tsx, cards.tsx,
                        icons.tsx, motion.tsx, ui.tsx, Logo.tsx,
                        PageHero.tsx, ProgrammeNav.tsx
  lib/                  data.ts, router.tsx, seoMetadata.ts, concierge.ts,
                        categoryUtils.ts, hooks.ts, phones.ts,
                        gibsResponsiveImages.ts
  pages/                one file per route (§3) + NotFound.tsx
  sections/             home-page sections: Hero, Approach, Programs,
                        Institution, ConciergeBand, Journey
  types/data.ts         programme/category type definitions
  utils/cn.ts           class-name merge helper
scripts/
  e2e-preview.mjs      isolated production build + preview for Playwright
  seo-gen.mjs           static SEO shell + sitemap generator
  qa/                   unit tests and standalone checks
  import/               catalogue import tooling
tests/e2e/              Playwright suite
```

`src/lib/phones.ts` is the single place where retired phone numbers are defined and removed from published output. `src/pages/Contact.tsx`, `src/components/chrome.tsx` (the shared footer), `src/lib/concierge.ts`, `scripts/seo-gen.mjs`, `src/pages/Admissions.tsx`, `src/pages/ProgrammeDetail.tsx` and `src/components/Search.tsx` all consume it — there is no duplicated retired-number list anywhere else. The published phone list is `08160010401 · 08186464474 · 07085792767 · 08160010400`: the three non-retired entries in `data.ts` followed by the current training-desk number, which `data.ts` does not list.

## 5. Data layer (`src/lib/data.ts`)

- **PROGRAMMES**: 135 official (113 Local + 22 Foreign). Foreign destinations: Kigali (8), Dubai (5), London (4), Houston (5).
- **PROGRAM_CATEGORIES**: 15 categories (type definitions in `src/types/data.ts`).
- `imageSet(url)` emits `-640.webp` / 1376w srcset. Foreign programmes share a **single destination image** per hub — no site-graph leak.
- Constants: `DIRECTORY_MIN = 9`, `GRID_COLS {1,2,3}`, `listStagger` capped at 0.5s, `colsFor(n)` balances low-count rows.

Exports that exist in `data.ts` but have **no consumer** in `src/` and are therefore not rendered anywhere: `EVENTS`, `ARTICLES`, `RESEARCH_THEMES`, `INSIGHT_TYPES`, `NAV_SECONDARY`, `CAMPUS_CAPACITY`, `CAMPUS_FACILITIES`, `CONTACTS`. They are retained in the protected data file and are not part of the current site. `CAMPUS_LOCATIONS`, `GOVERNANCE_INFO`, `FACULTY_ADVISORS`, `SUBSCRIPTION_STEPS`, `REQUIREMENTS_ACCORDION`, `SUBSCRIPTION_FAQS` and `STATIC_PAGES` are consumed.

`src/lib/data.ts` is a protected file: it must not be modified. Its SHA-256 is `910ff4d75ad3110aa3062e0fbc3e6ea73074d0004a53780c35a961cef64dbde7`.

## 6. Interaction model

- **Scroll reveal.** 105 `Reveal` instances (`src/components/motion.tsx`). Each observes itself with an `IntersectionObserver` and also resolves after a guaranteed-resolve fallback timer (`REVEAL_FALLBACK_MS = 1200`). The animation is a CSS transition on `opacity`/`transform`; the attribute is `data-reveal="hidden" | "shown"`. A CSS escape hatch, `[data-reveal="hidden"]:focus-within`, makes a pending section visible the moment keyboard focus lands inside it, so a keyboard user can never focus an invisible element. `useReducedMotion()` renders the settled state directly and skips the animation.
- **Global search modal**: `/` and the header button; live index over `PROGRAMMES` and `STATIC_PAGES`; Enter opens the first result; focus trap + Esc to close.
- **Mobile nav**: sheet with focus trap, Esc to close.
- **Programme filters**: destination tabs + category chips + search; results summary is an `aria-live` region.
- **Gallery lightbox**: arrow-key/touch swipe, focus trap, Esc.
- **Contact form**: required-field validation.
- **Concierge**: keyboard shortcut support; history is stored in `localStorage` under `gibs-concierge-v2` and expires after 24 hours.

## 7. Commands and build measurements

### Commands

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Vite build → SEO shell generation → shell metadata validation (§2) |
| `npm run qa` | `node:test` unit suites (chromium path, concierge, SEO metadata, terminology, phones) + cache-policy check + catalogue parity + generator drift + import/export snapshot check |
| `npm run qa:browser` | Build, then the browser regression script against `dist/` |
| `npm run qa:browser:dist` | The browser regression script against the existing `dist/` |
| `npm run test:e2e` | Builds SEO shells into an isolated temporary directory, then runs Playwright against that fresh production preview (chromium + mobile projects) |
| `npm run check:all` | `tsc --noEmit` + catalogue integrity + `npm run qa` + `npm run build` |
| `npx tsc --noEmit` | Type check on its own |

### Measured build output

**Measurement method and revision.** Full `npm run build` pipeline in an isolated temporary workspace, using the working tree based on `main` at `5a3b363` plus the uncommitted changes present on 2026-10-23 (including the source-scoping and phone-shell safeguards). Raw sizes are file byte lengths; gzip sizes are `zlib.gzipSync` byte lengths at Node's default compression level. This is a reproducible local build measurement, not a measurement of Vercel's transfer encoding.

| Artefact | Raw | gzip |
|---|---:|---:|
| `dist/assets/index-0y0-Yz5Y.js` | 829,618 B (810.2 kB) | 176,312 B (172.2 kB) |
| `dist/assets/index-BhPP7C1D.css` | 90,687 B (88.6 kB) | 16,181 B (15.8 kB) |
| `dist/index.html` | 10,188 B (9.9 kB) | 3,265 B (3.2 kB) |

`dist/index.html` is larger than the 6.60 kB Vite reports because `scripts/seo-gen.mjs` injects the static per-route body content and the homepage hero preload into it after the bundle is written. The figure above is the shipped file, measured after that injection.

Two consecutive builds with the same source and a Playwright-like artifact fixture produced identical JavaScript and CSS filenames and hashes. `source(none)` plus the explicit source list keeps the CSS independent of generated artifacts.

**Known build warning.** Vite reports the JS chunk as larger than its 500 kB advisory limit (829.6 kB raw / 176.3 kB gzip). The bundle is a single chunk because the site has one entry point and every route is statically imported.

**Where the bytes actually are.** Measured by building the same sources with source maps enabled into a scratch output directory (`/tmp/gibs-analysis-dist`, with JavaScript byte-identical to the measured `index-0y0-Yz5Y.js`) and attributing every generated byte to its source module through the source map's mappings. Total minified output: 825,403 bytes.

| Group | Bytes | Raw | Share |
|---|---:|---:|---:|
| `src/lib/data.ts` (the 135-programme catalogue) | 314,351 | 307.0 kB | 38.1% |
| `react-dom` | 180,800 | 176.6 kB | 21.9% |
| All application code (pages, components, sections, lib — `data.ts` excluded) | 153,397 | 149.8 kB | 18.6% |
| `motion-dom` | 96,015 | 93.8 kB | 11.6% |
| `framer-motion` | 40,644 | 39.7 kB | 4.9% |
| `tailwind-merge` | 25,298 | 24.7 kB | 3.1% |
| Everything else (`react`, `scheduler`, `motion-utils`, `clsx`) | 14,120 | 13.8 kB | 1.7% |

The three largest contributors are the levers a performance pass would reach for:

- **`data.ts` is 38% of the bundle and is byte-locked** (§5). It cannot be edited, split or moved to a JSON fetch without an authorisation this project does not have.
- **`react-dom` (21.9%)** is irreducible for a React SPA.
- **`framer-motion` + `motion-dom` (16.5% combined)** is the only sizeable, removable dependency. It is also load-bearing: `AnimatePresence` drives the route transition in `src/App.tsx`, `useScroll`/`useTransform` drive the scroll-linked hero in `src/sections/Hero.tsx` and `src/sections/Institution.tsx`, and `Stagger` sequences the catalogue lists. Removing it means reimplementing scroll-linked animation and route transitions in CSS — a design-affecting refactor with real regression risk, not a small targeted correction.

Route-level code splitting is the other obvious lever, and it is a substantial change: every route is statically imported, the static SEO shells assume a single app bundle, and splitting introduces Suspense boundaries that can shift layout on first paint.

**Decision: no performance correction was applied.** The measured trade-off is recorded here and the optimisation is left as a separate piece of work. The measured JavaScript payload is 176.3 kB gzipped, which is reasonable for a catalogue site of this size.

## 8. Working-tree changes covered by this document

At the revision this map describes, the working tree also carries the remediation work: `src/lib/phones.ts` (new), `src/index.css` (Tailwind source scoping), `.gitignore` (Playwright artefacts), `tests/e2e/core-flows.spec.ts` (corrected reveal test plus six added regression tests), `src/pages/Contact.tsx`, `src/lib/concierge.ts`, `scripts/seo-gen.mjs`, `src/pages/Admissions.tsx`, `src/pages/ProgrammeDetail.tsx`, `src/components/Search.tsx`, `src/components/chrome.tsx` (retired-number handling — no contact number is written as a literal anywhere in `src/` outside the policy and the protected data file), `src/pages/Programmes.tsx` (`aria-pressed` on the scope filters), `src/lib/router.tsx` and `src/pages/ProgrammeDetail.tsx` (canonical address for a programme's alternative URLs), `src/components/Concierge.tsx` and `src/pages/ConciergePage.tsx` (separate stored histories for the two mounted conversation instances, and `aria-relevant="additions"` so the transcript announces only new messages), `scripts/qa/concierge.test.mjs` (fee questions reach the enrolment rule), `scripts/qa/phones.test.mjs` (new) and `scripts/qa/regression.mjs` (the static server now reads the file before sending a header, so a missing asset returns a clean 404 instead of throwing `ERR_HTTP_HEADERS_SENT` and killing the sweep), `package.json` and `package-lock.json` (unused dependency removed), and the documentation corrections in `docs/security/security-headers.md`, `docs/backend/README.md` and `SECOND_PASS_SEO_AUDIT.md`.
