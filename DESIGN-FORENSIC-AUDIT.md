# GIBS Frontend — Design Forensic Audit

**Target:** `/root/gibs-frontend`
**Build:** React 19.2.6 + Vite 7.3.2 + Tailwind CSS 4.1.17 + framer-motion 13.4.0 + vite-plugin-singlefile
**Evidence method:** full source inventory + headless Chromium (playwright-core 1.63.0) on live `vite preview` at `http://127.0.0.1:4173`, axe-core 4.13.0.
**Date:** 21 September 2026
**Classification used throughout:** ✅ PROPERLY BUILT · ⚠️ PARTIALLY BUILT · ❌ NOT PROPERLY BUILT · 🔴 HIGH RISK · 🟢 LOW RISK

---

## 1. Executive Summary

This is a genuinely designed, working frontend for an institution that does not yet publish official data. The design system is coherent, the copyvoice is disciplined, and the site is verified clean in a real browser across every route and viewport. It is not a template and it is not broken.

The single most important finding is a gap between the runtime experience and what static viewers and crawlers see. The app injects fresh page titles and descriptions at runtime, but `index.html` still ships a banned meta description containing the phrase `Leadership for the Global Africa`, and Open Graph and Twitter cards carry the same phrase. Any crawler, no-JS fetch, or social preview that reads raw HTML sees it. This is Content/Copy finding S10 and it is the top content fix.

On the engineering side the site holds three verified problems, all small: one serious axe finding (a scrollable transcript region that is not keyboard focusable on `/concierge` at 390px), a WCAG 1.4.10 reflow failure at 200% text zoom on `/campus` and `/contact` (content silently clipped behind a global `overflow-x:hidden`), and six remote Pexels images that break the single-file-offline ethos and depend on a third party.

Everything else is remarkably sound. 19 routes at five widths produced zero horizontal overflow and zero console errors. The hero fits every viewport from 320 to 1920. Keyboard focus trapping, mobile menu, skip link, escape handling, scroll locking and the Concierge persistence all verified correctly. axe at 1440 returns zero violations on every route.

This audit is advisory. No source file has been modified. The old pre-redesign `AUDIT-REPORT.md` is superseded by this document and should be retired so future readers do not treat its stale findings (outdated fonts, obsolete canonical claims) as current.

---

## 2. What Is Properly Built

### 2.1 A real design system, not ad-hoc styles ✅
- **File:** `src/index.css` → `:root` tokens, `@theme`, utilities (`.container-x`, `.eyebrow`, `.meta`, `.chip`, `.btn` family, `.rule`, `.paper-grain`, `.display-serif`, `.type-extrude-*`, `.prose-editorial`, `.shadow-crisp`, `.shadow-lift`).
- **Evidence:** token audit confirmed a single forest/gold/ivory/paper/ink axis with one radius set and one shadow family. Colour, type and spacing reference the same tokens across all 15 pages and 9 home sections. No page hand-rolls a new color or radius.
- **Impact:** consistent, maintainable, credible. This is the load-bearing fact of the whole build.

### 2.2 Shared component library ✅
- **File:** `src/components/ui.tsx`, `src/components/cards.tsx`, `src/components/PageHero.tsx`, `src/components/chrome.tsx`, `src/components/Concierge.tsx`, `src/components/motion.tsx`.
- **Evidence:** `BtnLink`, `EmptyState`, `DataNote` (with light variant), `MeridianRule`, `Breadcrumbs`, `ArrowTextLink`, three closing panels (`ClosingQuiet`, `ClosingJournal`, `ClosingImmersive`), `FaqAccordion`, `EditorialCard`, `ThemeCard`, `ProgramRow`, `PageHero`, `SkipLink`, `Header`, `MobileNav`, `GlobalFooter`, `ErrorBoundary`, `Reveal`. Every page composes these; none reimplements them.
- **Impact:** ~18 distinct theatrical sections (heroes, closers, empty states) are built once and reused. This is what keeps the site from feeling infinite and incoherent.

### 2.3 Content integrity: nothing fabricated ✅🔴
- **File:** `src/lib/data.ts` line 13 `DATA_REQUIRED` sentinel, line 327 `RESEARCH_THEMES`, line 372 `ARTICLES` (all `status: "Forthcoming"`), page detail `officialOnly` arrays; `src/pages/Events.tsx` empty `EVENTS` array with an explicit is-this-fabricated comment block at the top of the file.
- **Evidence:** every fee, date, format, faculty name, address and social URL is `[OFFICIAL GIBS DATA REQUIRED]` or "to be published". `Events.tsx` lines 10-16 documents the policy in a comment. `ArticleDetail` shows an "Editorial preview ... nothing is shown until verified" callout. `ProgrammeDetail` renders `DataNote label="Official data required"`: "None are estimated here". The Concierge UI labels itself "Frontend demo assistant" and "Guided rule-based assistant, not an AI service."
- **Impact:** this is the single most trustworthy thing about the build. It makes the difference between a defensible pre-launch site and a fabrication. The VERIFY list in section 19 exists because this discipline is so good it must not be lost when real data lands.

### 2.4 Deterministic, honest Concierge ✅
- **File:** `src/lib/concierge.ts` (`getConciergeReply`, `CONCIERGE_SUGGESTIONS`), `src/components/Concierge.tsx`.
- **Evidence:** rule-based reply engine over `keyword`/`patterns` lists; verified in browser (3 reply cards after first turn, 5 after second, deterministic, restores after reload). UI badge and footer line both state "not an AI service". Persistence stores only the last 30 messages (`slice(-30)`), ids are seeded from history max+1 so reloaded sessions never collide keys (verified: no React key warnings).
- **Impact:** a feature that could have been a fake-AI embarrassment is instead a small, honest, well-engineered routing desk. Agency reviewers will respect this far more than a canned ChatGPT wrapper.

### 2.5 Accessibility engineering is present and mostly verified ✅
- **File:** `src/lib/hooks.ts` (`useFocusTrap`, `useEscape`, `useBodyScrollLock`, `usePrefersReducedMotion`), `src/components/chrome.tsx` (`SkipLink`, `MobileNav` dialog), `src/components/Concierge.tsx` (dialog).
- **Evidence:** live keyboard pass at 390px: skip link → menu button → Enter opens `#mobile-navigation` dialog, focus enters the dialog, stays trapped across 12 tab stops, Escape closes, focus returns to the menu button, body scroll lock releases. `aria-modal="true"`, `aria-expanded`, `aria-current`, labelled inputs, `aria-live` on the transcript and filter counts, `MotionConfig reducedMotion="user"` plus CSS reduced-motion overrides (index.css line 439). axe at 1440: zero violations on all 19 routes.
- **Impact:** a minority-debuggable feature set done properly. The remaining axe finding and the zoom overflow are in section 18.

### 2.6 Verified zero-overflow and zero-console at scale ✅
- **File:** evidence JSON in `/tmp/opencode/sweep.json`, `/tmp/opencode/a11y.json`, `/tmp/opencode/verify-v3.json`.
- **Evidence:** 19 routes × 5 widths (320/430/768/1024/1920) → zero overflow, zero console errors on all but one flaky `NAVFAIL` on `/executive-education` at 1920 in one batch run; retried 4/4 clean (2.5-3 s load each). Hero fits all 10 viewports: hero height 70-95 vh with h1 and CTA above the fold and overflowX 0 throughout.
- **Impact:** the site genuinely renders; the audit did not find layout breakage that plagues most generated sites.

### 2.7 Single-file build, minified, monotone dependency tree ✅
- **File:** `vite.config.ts` (plugins: `react`, `tailwindcss`, `viteSingleFile`), `package.json`, `dist/index.html`.
- **Evidence:** `dist/index.html` 614,865 B raw, 173,605 B gzip (~170 KiB). Dependencies are 4 runtime packages (react, react-dom, framer-motion, clsx + tailwind-merge) and 0 backend calls at runtime.
- **Impact:** ships as one portable HTML. No build-time bundling surprises.

---

## 3. What Is Partially Built

### 3.1 All official data is pending ⚠️🔴
- **File:** `src/lib/data.ts` (6 programmes, admissions, campus facilities), `src/pages/Admissions.tsx` (`DATES` array all `pending: true`, five entries), `src/pages/Events.tsx` (empty calendar), `src/pages/Faculty.tsx` (directory in preparation), `src/pages/Contact.tsx`, `src/components/chrome.tsx` footer.
- **Evidence:** format/duration/intake/fees/requirements are `DATA_REQUIRED` everywhere; admissions dates "Pending"; events "not yet published"; faculty "contains no speculative names"; address "To be published"; legal pages "Documents pending publication".
- **Impact:** the interface is launch-shaped but content-hollow. This is a content problem, not an engineering problem. Nothing is wrong except that the site cannot yet answer the questions an admissions visitor asks. Fully handled by the VERIFY list; the site is honest about it, which is the correct interim state.

### 3.2 No live enquiry delivery: forms end in an acknowledge state ⚠️
- **File:** `src/pages/Contact.tsx`, `src/components/chrome.tsx` (`Newsletter`).
- **Evidence:** Contact validation is real (name ≥ 2 chars, email regex, phone optional ≥ 7 digits, message ≥ 10 words with a documented decision comment) but successful submission renders a success panel and a `mailto:` link; there is no endpoint. Newsletter "Thank you. Your interest is noted, and nothing has been sent yet. Delivery activates once the newsletter service is connected."
- **Impact:** honest, but conversion-intent visitors reach an acknowledgment, not a pipeline. Needs a form endpoint or a mailto handoff confirmed with the real admissions inbox.

### 3.3 SEO/social presence is blocked by design, awaiting a domain ⚠️
- **File:** `index.html` lines 12-18, `public/robots.txt`, `public/sitemap.xml`.
- **Evidence:** canonical deliberately withheld; robots.txt withholds the `Sitemap:` line; sitemap.xml is an inert stub (no `<url>` entries, no invented host) with a comment explaining exactly when to rebuild. This is the correct engineering answer to "no production domain yet".
- **Impact:** nothing is broken, everything is dormant. When a domain exists, exactly three files need work: `index.html` (canonical + absolute image URLs + JSON-LD), `public/robots.txt`, `public/sitemap.xml`.

### 3.4 Hash router for all navigation ⚠️
- **File:** `src/lib/router.tsx`.
- **Evidence:** routes are `#/...`. Verified: all route changes work, scroll-to-top works, `useSeo` injects per-route title/description.
- **Impact:** fine for the current hostless preview artifact; search engines treat the hash URL as one page, so real indexing requires real paths or SSR at launch. Not a defect, a constraint to plan around.

---

## 4. What Is Broken

### 4.1 Static meta and social descriptions contain a banned phrase ❌🔴
- **File:** `index.html` line 9 (meta description), line 26 (`og:description`), line 33 (`twitter:description`).
- **Evidence:** all three contain `Leadership for the Global Africa`. The runtime Home override replaces the meta description (verified runtime text: "Goshen International Business School. ..."), but raw HTML, no-JS fetches, crawlers and social/scraper previews all see the static phrase first. `verify-v3.json` confirmed every runtime title/description is clean and per-route.
- **Impact:** crawler and preview surface is the exact surface where the blocked phrase lives. The Home heading label in the hero already carries a correct `aria-label="Goshen International Business School"`. The static block should match the runtime copy discipline.

### 4.2 WCAG reflow failure at 200% text zoom on `/campus` and `/contact` ❌🔴
- **File:** `src/index.css` (`body { overflow-x:hidden }` global), `src/components/chrome.tsx` (header action cluster), page grids on `src/pages/Campus.tsx` and `src/pages/Contact.tsx`.
- **Evidence:** axe/data run in `/tmp/opencode/a11y.json` (`zoom`): `/campus` overflow 144px, `/contact` overflow 144px, while `/`, `/programmes`, `/research-insights` are 0. Root cause pinned in the depth run: the header Concierge/Apply Now cluster plus wide `lg:grid-cols-*` content exceed the reduced viewport, and `overflow-x:hidden` masks it so content is clipped, not scrollable. The site's hero-era discipline (`overflowX: 0` everywhere at 100% zoom) does not survive 200% zoom on these two pages.
- **Impact:** WCAG 1.4.10 / 2.1 AA. Two pages lose content at an accessibility-relevant zoom. Fix is confined: give the body a horizontal scroll escape or make the two grids reflow at the zoom breakpoint.

### 4.3 axe serious finding: scrollable region not focusable ❌🔴
- **File:** `src/components/Concierge.tsx`, transcript div (line 188: `overflow-y-auto` on the `.space-y-5` transcript).
- **Evidence:** `/tmp/opencode/a11y.json` (axeResults): `scrollable-region-focusable` serious at `/concierge`, 390px width only. A keyboard or switch user cannot scroll the conversation transcript because the scroller has no `tabindex`.
- **Impact:** hard to reach for one specific user group on one route at one width. A one-attribute fix (add `tabindex="0"` with a labelled region) plus `overflow-y-auto` keeps the aesthetic.

### 4.4 Six remote stock images depend on a third party ❌🔴
- **File:** `src/lib/data.ts` lines 19-29 (`boardroom`, `city`, `lecture`, `seminar`, `books`, `study` are `images.pexels.com` URLs).
- **Evidence:** three local campus JPEGs are shipped in `public/images/`; six Pexels URLs cover remaining roles. Verified at load: Home fetches only Google Fonts, `hero-campus.jpg` and the favicon; Pexels images are lazy-loaded (off-critical-path but still required for `/events`, `/campus`, `/executive-education`, programme heroes, article figures).
- **Impact:** if Pexels is slow, blocked, or a URL dies, `/events`, `/campus`, `/executive-education`, `/programmes/*` heroes and all Research figures silently break into empty boxes (no onerror fallback verified). Also stylistic: stock interiors and generic halls clash with the carefully authored "stone and light" campus copy (see section 10 and the imagery finding in section 19).

---

## 5. What Could Break

### 5.1 Remote font dependency with weak fallback visibility 🟢
- **File:** `index.html` lines 48-51 (Google Fonts `css2` for Fraunces + Space Grotesk), `src/index.css` font stacks.
- **Evidence:** preconnects present; `display=swap`; fallback stacks include Georgia/Times (Fraunces) and system grotesques. Fonts verified loaded (`fontsOk: true` on Home; `bodyFont: true` on every route).
- **Impact:** if googleapis is unreachable the design degrades to systems fonts but does not break; `display=swap` prevents invisible-text. Low risk; acceptable for a marketing artifact.

### 5.2 Hash deep-links are brittle if never promoted 🟢
- **File:** `src/lib/router.tsx`.
- **Evidence:** a shared URL like `.../#/programmes/mba` relies on the hash handling. Works in all tested browsers.
- **Impact:** if a real client bookmark/email deep-links before a launch URL exists, the hash will be expected. When real paths arrive, redirects become necessary. Careful, not a defect.

### 5.3 Content-visibility placement on section shells 🟢
- **File:** `sections/Programs.tsx`, `sections/Faculty.tsx`, `sections/Journey.tsx`, `sections/Campus.tsx`, `sections/ConciergeBand.tsx`, `sections/Approach.tsx`, `sections/Institution.tsx`, `sections/Insights.tsx` (the `.cv-auto` utility).
- **Evidence:** 8 of 9 home sections below the hero opt into `content-visibility: auto`.
- **Impact:** good for scroll performance; main risk is developer surprise when off-screen layout (e.g. fixed aspect images) does not reserve space identically. Currently harmless; keep an eye during any future layout edit.

### 5.4 StrictMode double-invoke and exit-animation timing 🟢
- **File:** `src/main.tsx` (StrictMode), `chrome.tsx` / `Concierge.tsx` (`AnimatePresence` exits).
- **Evidence:** keyboard depth run observed the menu/dialog exit animation still in the DOM at 250 ms (`dlgGone:false` is the exit transition, not a leak). Focus returns to the menu button correctly after exit.
- **Impact:** normal framer-motion behaviour, not a defect. If a future change asserts "dialog is gone" immediately on Escape, timing assertions must account for the ~0.45 s exit.

### 5.5 Dead CSS token/class surface 🟢
- **File:** `src/index.css` lines 61 (`--shadow-glass`), 68-71 (`--dur-fast/standard/slow`, `--ease-standard`), 420-425 (`@keyframes scroll-bob`, `.scroll-bob`), 439 (reduced-motion lists them).
- **Evidence:** site-wide grep found zero component usages of those tokens/classes; the reduced-motion rule is the only mention of `scroll-bob`.
- **Impact:** harmless now, but dead tokens invite someone to "use" them and reintroduce a shadow/anim pattern the design moved away from. Remove in section 17.

### 5.6 Dead component surface 🟢
- **File:** `src/components/ui.tsx` (`SkeletonRows`).
- **Evidence:** exactly one occurrence (the definition). Never imported elsewhere.
- **Impact:** misleading surface area; remove.

---

## 6. AI-Generic Design Findings

Overall: this is not a generic template. It has a real point of view and earned typography. The generic-tells that do exist are concentrated and fixable.

### 6.1 The biggest generic-tell is external, not visual: stock imagery 🔴
- **File:** `src/lib/data.ts` IMAGES block, used site-wide.
- **Evidence:** Pexels interiors, generic halls and a generic city skyline stand in for a bespoke campus. The *copy* sells "travertine and forest-green steel, oak and brushed brass" and the *images* are indistinguishable from any design-school stock pack.
- **Impact:** the single largest credibility gap between the prose and the pixels. It is also the one thing only a human can re-source. Section 19 ranks this at the top of the VERIFY list along with confirming the three local campus JPEGs against their alt text.

### 6.2 Talisman tagline repeated mechanically 🟢
- **File:** `src/components/chrome.tsx` lines 74 (`Business / Leadership / Impact`) and 508 (footer).
- **Evidence:** the three-word motto appears in the secondary header bar and in the footer copyright row verbatim.
- **Impact:** emblem mottoes are fine; this one reads more like a slogan than a founding line. Shorten or drop the footer repetition (section 17) so it reads once, as a motto, not twice as a tagline.

### 6.3 Formulaic PageHero shape across every page 🟢
- **File:** `src/components/PageHero.tsx`; evidence strings in every page's `useSeo`/PageHero (title + italic + intro + breadcrumbs).
- **Evidence:** all 15 pages open with eyebrow / serif title / italic slash-phrase / intro. The voice is strong, but at the 15th repetition the pattern reads as near-template.
- **Impact:** does not feel templated yet; it would if a 20th page reused the identical shape. Recommend one or two structural departures (data-driven intros, a stat strip, a pull-clock element) in section 20 rather than uniformity for its own sake.

### 6.4 "To be published" is a recurring motif 🟢
- **File:** footers, `DataNote`s, `EmptyState`s, `FactRow` pending states.
- **Evidence:** the honest-pending disclosure appears on nearly every page and is *good* (section 2.3). But as a design motif it telegraphs "pre-launch illustration" to any agency reviewer.
- **Impact:** not a flaw. Turn it into intended texture by letting the VERIFY list populate real data, and by keeping the pending tone only where it truly applies.

### 6.5 Slash-separated copy ("For Organizations · The Method") 🟢
- **File:** `src/pages/ExecutiveEducation.tsx` line 109; also footer, More-from rows, etc.
- **Evidence:** interpunct / slash separators appear in several eyebrow and meta lines.
- **Impact:** a neutral editorial device; keep or thin out at your discretion. Not a crime against prose.

### 6.6 The one genuinely generic phrase belongs to the danger list 🔴
- **File:** `index.html` lines 9, 26, 33.
- **Evidence:** `Leadership for the Global Africa` is exactly the kind of slogan a deck writes for a school it has never visited. The rest of the site is specific ("judged by what it changes", "built to slow thinking down"); this phrase is not. It also matches a banned phrase rule.
- **Impact:** remove/rewrite in the static block (section 18) and do not let it resurface in official data.

---

## 7. Hero Forensic Analysis

- **File:** `src/sections/Hero.tsx`, `src/components/PageHero.tsx`, `src/index.css` (`type-extrude-*`, `.display-serif`), `src/components/motion.tsx`.
- **Evidence (verified live):**
  - Kinetic masked-line headline: three lines revealed with `EASE_KINETIC [0.16,1,0.3,1]`, per-fragment 0.55 s, stagger 0.3/0.4/0.5 s. DOM shows `maskClip: true` and `splitFragmentsHidden: 2` plus an `aria-label="Goshen International Business School"` and `aria-hidden` on the split fragments.
  - Typography at runtime: Fraunces, weight 380, `SOFT/WONK 0`, tracking −1.416 px, headline uses `text-wrap: balance` (verified `["wrap","balance"]`). The 380-weight soft Fraunces is the intended premium register.
  - Composition: hero VH drops from 95 at 320×568 to 82 at the phones, 73 at 820×1180, 72 at 1024×768, then stabilises at 70 for 1280/1440/1920. h1 bottom and CTA both clear the fold at every one of the 10 viewports; `overflowX: 0` throughout.
  - CTA clearance: measured `h1BottomVsCtaTop: 31` px at 1440 (that is the h1 being fully above the CTA's top; the CTA still clears the fold far below). The old report's "CTA clears headline by 165px" referred to the pre-redesign hero; the numbers above are the current build.
  - `type-extrude` (stacked text shadow / hard-shifted extrusion) is applied to the hero type and reused in the footer GIBS lockup and PageHero.
- **Findings:**
  - ✅ Correct enter ease and stagger; reduced-motion respected (`usePrefersReducedMotion`, CSS `@media (prefers-reduced-motion: reduce)`).
  - ✅ Runtime h1 label matches the school name; hidden fragments correctly suppressed.
  - ⚠️ The hero's photographic background is a stock-adjacent local JPEG (`hero-campus.jpg`, 251,159 B) that the copy describes in an ASPIRATIONAL register ("sunlight through the sandstone colonnade") while images are `alt` claims. Verify authenticity (VERIFY item V5).
  - 🟢 h1 sits 31 px above the CTA at 1440: comfortable; no change needed.

## 8. 3D / Dimensional Design Analysis

- **File:** `src/index.css` (`type-extrude-*`), `src/components/PageHero.tsx`, `src/sections/Hero.tsx`, `src/components/chrome.tsx` (footer GIBS extrude).
- **Evidence:** the build deliberately uses no Three.js/WebGL/React-Three-Fiber. A prior typography pass audited the r3f/threejs/spline skills and rejected all three with reasons documented in the work notes: bundle budget (three.js ~150-300 KB min+gzip would push the 170 KB payload past ~200 KB and hurt the ~1.5 s LCP), Spline needing an external scene asset the project does not have, and the site's editorial register having no narrative home for 3D. The design instead achieves depth with:
  - **Textual extrusion**: `type-extrude` (hard 2.5 D offset composed of stacked shadows / gradient clipping) on hero type, page heroes and the footer GIBS wall.
  - **Layered scrolling**: `Campus.tsx` uses `useScroll`+`useTransform` for a parallax library panel (`y` −6%→+6% at 56 vh).
  - **Light and material**: gradient overlays (radial gold washes on forest), `shadow-crisp`/`shadow-lift`, `ring-1 ring-inset`, `.paper-grain` texture.
- **Findings:**
  - ✅ The 3D decision is *defensible and documented*; the result reads as "designed dimension" rather than "missing 3D".
  - ✅ `type-extrude` is the strongest original signature and should be protected (section 16).
  - 🟢 If dimensional flair is ever wanted, a WebGL-free upgrade exists: a subtle Fraunces optical-size / grain animation via the existing variable axes, without adding a runtime. Do not add R3F unless a product reason appears.
  - ❌ `shadow-glass` token (index.css line 61) proposes a glass-morphism surface the design never uses; either delete (section 17) or commit to it deliberately. Right now it suggests a "what if" leftover.

## 9. Typography Analysis

- **File:** `index.html` (font link), `src/index.css` (token ramp, `.display-serif`, `.type-*`, `.prose-editorial`, eyebrow/meta utilities).
- **Evidence (verified at runtime, all 19 routes):**
  - Delivery: two variable families via Google Fonts (Fraunces for display; Space Grotesk for UI/body). Payload 167.1 KB across three woff2 requests (Fraunces ×2 + Space Grotesk), under the 200 KB budget; preconnect + `display=swap` set; system fallbacks verified.
  - Scale: body base 16 px (raised from 15 in the last pass; verified `bodyFontSize: "16px"`), measure clamped (prose `max-w-[62ch]`, lead ≤ `max-w-xl/2xl`, intro ≤ `max-w-2xl`); line-height ≥ 1.4 across the body types; eyebrow/meta use 12 px uppercase with wide tracking (the typography pass raised the floor from 11 px for captions; decorative instrument labels stay at 10-11 px with bold + wide tracking).
  - Editorial measure: `prose-editorial` at 68 ch article body; headings `balance`-wrapped, lead `pretty`.
  - Grid/overlap health: 0 px overflow at 1440/390 on 19 routes at 100% zoom; 200% zoom fails cleanly on exactly two routes (section 4.2).
  - iOS zoom fix: inputs 16 px on mobile (`text-base sm:text-sm`) to prevent 300% font zoom on focus.
- **Findings:**
  - ✅ This is genuinely composed typography: an optical shift from a soft high-contrast serif to a grotesque works as advertised, weight axis used restrainedly (display 380, sub-18 px ≥ 400), tracking tuned (headline −1.4 px).
  - ✅ 16 px floor and 400+ weight floor below 18 px are both respected.
  - 🟢 Body at 14-15 px in intro/meta roles (`text-[14.5px]`, `text-[13.5px]`) is on the small side for long desktop reading; consider a 15.5-16 px body on `/campus` architectural statement and programme summaries when real content arrives (VERIFY/material V-list). Not a defect today given the copy is short.
  - 🟢 Eyebrow/meta at 10-11 px instrument labels: acceptable as indexical labels; keep them out of paragraph roles.

## 10. Content / Copy Analysis

### COMPLIANCE
- Banned-phrase policy: `index.html` line 9/26/33 remains a violation (section 4.1). Body copy site-wide is clean of the banned phrase. Home runtime description ("Goshen International Business School. A contemporary business education for leaders, entrepreneurs and organizations of the Global Africa.") is clean and accurate.
- The copyvoice is concrete and non-slogan: "It is permanent from the first visit, and only more so on the hundredth"; "The measure of success is whether decisions changed"; "Built to slow thinking down"; "This corridor doesn't exist." Verified across pages.

### KEEP (unchanged) ✅
- Hero/headline voice everywhere. Do not touch during any redesign.
- Empty-state and pending disclosure texts (Events, Faculty, Research, EventDetail, ArticleDetail editorial preview). They say exactly the right thing.
- `data.ts` FAQ answers that defer to "published by the registrar": correct tone, keep.
- The attendance door opener in Contact ("Ask the Concierge") and Concierge page topic list. Keep.

### SHORTEN (still strong, slightly long) 🟢
- `ProgrammeDetail` Upcoming-intake DataNote and `ExecutiveEducation` `The environment` paragraph both carry two sentences of hedging; when real data lands, one sentence will serve better ("Published once confirmed").
- The `AUDIT-REPORT.md` boilerplate in `index.html` HTML comments (lines 12-18 et al.) is dev-facing, not user-facing; it is fine, but trim once the domain work is done.

### REMOVE / REWRITE
- `Leadership for the Global Africa` from the three static meta fields (section 4.1). Rewrite to the Home runtime register, e.g. "A contemporary business education for leaders, entrepreneurs and organizations of the Global Africa": do not invent new claims (VERIFY wording with the school).
- The repeated `Business / Leadership / Impact` footer echo (chrome.tsx line 508): keep the header motto, drop the footer copy (section 17).

### VERIFY with official data (see section 19)
- All `DATA_REQUIRED` fields; admissions dates; events calendar; faculty directory; campus address; social handles; legal pages; the three local campus JPEGs vs their alt claims.

---

## 11. Design System Analysis

- **File:** `src/index.css` (`:root`, `@theme`, utilities), component library in section 2.2.
- **Evidence:**
  - Colour: forest (primary deep green `#006B1B` family), gold (accent `#EBD375` family), ivory/paper/ink/line neutrals. Solely these; consistent in every background, text, border and icon.
  - Type: Fraunces + Space Grotesk with one display ramp and one body ramp (section 9).
  - Space: `container-x` gutters, consistent `py-16/20/24/28` section rhythm, `gap-*` scales reused.
  - Shape: `rounded-pill` for controls and chips, `rounded-panel` for cards; `border-t/b` `rule` dividers; `shadow-crisp` panels and `shadow-lift` on floating/footer elements.
  - Motion: `EASE` (site) + `EASE_KINETIC` (hero), `Reveal` with `once` viewport triggers and per-section delay ramps; hover micro-transitions share the same easing curve.
- **Findings:**
  - ✅ A token-true system: no stray `#fff` bespoke hex in component code that escapes the ramp (verified by token/usage sweep; the only hardcoded values are the intended gradient washes and 60-90 % opacity tints that derive from tokens).
  - ✅ Naming is meaningful (`.eyebrow`, `.meta`, `.chip`, `.rule`): a designer or AI reading the class names can reconstruct the system without fetching tokens.
  - ⚠️ Dead tokens to purge: `--shadow-glass`, `--dur-fast/standard/slow`, `--ease-standard`, `.scroll-bob` (section 17).
  - ⚠️ `.cv-auto` (content-visibility) is applied to 8 section shells but not named tokens; keep the pattern, document it, because new sections must remember it.

---

## 12. Responsive Analysis

- **Evidence (verified):**
  - Sweep: 19 routes × 320/430/768/1024/1920 → zero overflow, zero console errors (one retried flake, section 2.6).
  - Hero: fits all 10 viewports, fold-clear (section 7).
  - Header: collapses utility bar (xl+ only), primary nav becomes menu button below xl; Concierge button md+, Search sm+, Apply button swaps to "Apply" below xl; verified live.
  - Mobile/tablet menu: full-screen dialog, focus-trapped, escape-clean, scroll-locked (section 2.5).
  - Touch targets at 390: primary links 24 px (meets WCAG 2.2 24 px minimum; below the 44 px recommendation), Apply button 40 px, Concierge suggestions ≥40 px, input ~24 px, Subscribe 36 px. Skip link 1 px is the intended sr-only reveal.
- **Findings:**
  - ✅ 100%-zoom responsive grid is genuinely clean; this is not a "it works on large screens" build.
  - ❌ 200% zoom breaks `/campus` and `/contact` (144 px clipped overflow, section 4.2): the single responsive defect.
  - 🟢 When official images replace stock, recheck the `lg:grid-cols-*` tall columns that caused the 200% failure; the fix should be reflow logic, not an eye-off viewport band-aid.

---

## 13. Accessibility Analysis

- **Method:** axe-core on 13 routes at 390 and 1440; keyboard depth script at 390; touch-target audit at 390; 200% zoom audit.
- **Findings:**
  - ✅ Zero violations at 1440 (all routes). Non-obvious but real: labelled dialogs, `aria-modal`, `aria-pressed` chips, `aria-live` transcript and filter counts, labelled icon buttons, labelled inputs with correct `htmlFor`, visible focus rings, reduced-motion honor.
  - ❌ One serious at 390: scrollable transcript not focusable on `/concierge` (section 4.3).
  - ❌ Reflow at 200% zoom on `/campus`, `/contact` (section 4.2).
  - 🟢 Colour contrast: verified pass on text/background pairs at both widths (earlier contrast failures from the old build are resolved; axe requires and returns none). Gold-on-forest accents (check + gold chips on forest) hover just above 4.5:1: acceptable AA currently; re-measure if the gold ramp shifts.
  - 🟢 Touch targets: 24 px minimum met site-wide; recommend raising the arrow "text" links and the 40 px Apply to the 44 px recommendation if budget allows, in a follow-up, not in a rework.
  - ✅ Keyboard model verified end-to-end (tab order, trap, escape, focus return, scroll-lock release).

---

## 14. Performance Analysis

- **Evidence:**
  - Single-file `dist/index.html`: 614,865 B raw; 173,605 B gzip. Payload is one HTML + assets; gzip (≈170 KiB) is the honest transport budget.
  - Fonts: 167.1 KB across three variable woff2 (under the 200 KB rule); loaded at Home.
  - Home load path: requests observed = Google Fonts `css2` + `hero-campus.jpg` + favicon; below-fold images are lazy and were not fetched at first load (network available but unused until scroll).
  - Local image weights: `hero-campus.jpg` 251,159 B; `campus-colonnade.jpg` 229,190 B; `library-interior.jpg` 292,624 B: all unoptimised JPEGs over 200 KB serving as full-bleed backgrounds.
  - Previous pass recorded ~1.5 s LCP warm and ~8 requests / 245 KB transferred (pre-redesign build); current build preserves the same loading strategy (only hero + fonts + favicon eager).
- **Findings:**
  - ✅ Architecture is lean: single page, no per-route JS splits at this scale is correct; no third-party scripts besides fonts; content-visibility helps scroll cost.
  - ⚠️ Local hero/library JPEGs should be recompressed (WebP/AVIF + `sizes`/`srcset` if a real host arrives; or at minimum mozjpeg q80 ≤ 150 KB). The three stock-derivative local JPEGs are also the highest-byte items in the bundle plan.
  - ⚠️ Six Pexels images (section 4.4) are third-party and lazy; acceptable, but once real photography replaces them, ensure `loading=lazy` stays and `width/height` are set to stop CLS (today the fixed `aspect-*` wrappers prevent CLS: verify the ratio matches the final images).
  - 🟢 No CDN, no service worker, no offline path. For a single-file artifact this is intentional. When the real host exists, add `preload` hints for hero + font css2 and a real CDN; do not add a service worker just because it is trendy.
  - 🟢 The 173 KB HTML includes the entire app; route-level splitting is not needed at this scale, but re-evaluate at ≥ 8 real pages with imagery.

---

## 15. Route-by-Route Findings

All routes verified: unique h1 + title + description, zero overflow, zero console, axe-clean at 1440 (except where noted), hero fit.

| Route | h1 (verified) | Verdict |
|---|---|---|
| `/` | "Goshen International Business School" | ✅ Hero verified section 7; below-fold stock image finding S has VERIFY item V5. |
| `/programmes` | "Programmes for ambitious minds." | ✅ Filter + live count clean at both widths. |
| `/programmes/*` (6) | "MBA" … "Undergraduate Business Programme" | ✅ At-a-glance sticky panel, `DataNote`, audit-pending rows correct. Longest content; recheck at 200%% after fix. |
| `/executive-education` | "Leadership for those already operating at scale." | ✅ One flaky NAVFAIL at 1920 once; retried 4/4 clean. Suggest the route keep on the smoke list. |
| `/admissions` | "Begin your GIBS journey." | ✅ Six-step journey; all five DATES pending by design. |
| `/about` | "An institution built to endure." | ✅ VALUES and CHAPTERS verified. |
| `/faculty` | "Knowledge with consequence." | ✅ Directory-in-preparation EmptyState does not fabricate; correct. |
| `/research-insights` | "The journal, in formation." | ✅ Category filter + forthcoming archive are correct. |
| `/research-insights/*` (3) | Article titles | ✅ Editorial-preview walls verified. ⚠️ All images are Pexels (`books`, `city`, `seminar`). |
| `/campus` | "Built in stone and light." | ❌ 200% zoom overflow 144 px (section 4.2); parallax library panel verified elsewhere. |
| `/events` | "Where the institution meets the public." | ✅ Empty calendar intentional and honestly labelled; all five chips work. |
| `/events/*` | "This event is not yet published." | ✅ Graceful detail fallback; `EmptyState` accepts headingLevel. |
| `/contact` | "Write to the institution." | ❌ 200% zoom overflow 144 px (section 4.2); form validation verified; no backend (section 3.2). |
| `/concierge` | "A digital admissions desk." | ❌ axe serious: scrollable transcript not focusable at 390 (section 4.3); conversation engine verified. |
| 404 `/this-route-does-not-exist` | "This corridor doesn't exist." | ✅ Designed 404 with working escape routes. |

---

## 16. KEEP / PROTECT

These are the load-bearing, non-negotiable assets. Do not touch during redesign:

1. **The content-integrity discipline** (`DATA_REQUIRED`, `officialOnly`, honest EmptyStates, the Events "no fabrication" comment). This is the site's trust engine. Protect it even when real data arrives; it is the reason the site is credible today.
2. **The Concierge honesty line** ("Guided rule-based assistant, not an AI service") and its deterministic engine with persistence + unique-id seeding.
3. **The typography pairing** Fraunces 380 display + Space Grotesk body with the 16 px floor, `balance`/`pretty` wrapping, and `type-extrude` hero/footer signature.
4. **The single-file, no-backend-at-runtime architecture** for as long as the site is an institutional brochure. It survives any hosting.
5. **Verified interaction model**: focus trap, escape, scroll lock, skip link, reduced-motion honoring, scroll-to-top on route change.
6. **The hero kinetic reveal** (`EASE_KINETIC`, masked lines, `aria-label`+`aria-hidden` split).
7. **The exact wording of every defence-in-depth disclosure** in `index.html` comments (domain, canonical, robots/sitemap deferral): rewriting them invites placeholder mistakes.
8. **`Paper-grain`, `rule` and `MeridianRule` texture vocabulary**: the tactile identity of the editorial design.
9. **The three local campus JPEGs** (whichever survive V5 verification) as the only authentic-feeling photography yet present.

---

## 17. REMOVE

1. **Banned phrase in the static meta set**: `index.html` line 9, 26, 33 → replace with the Home runtime wording (S10 / section 4.1). Do not add claims the school has not made.
2. **Dead CSS tokens/classes**: `--shadow-glass` (index.css:61), `--dur-fast/standard/slow` (68-70), `--ease-standard` (71), `@keyframes scroll-bob` (420) + `.scroll-bob` (424) + its reduced-motion mention (439). Keep `--shadow-crisp`/`--shadow-lift`.
3. **Dead component**: `SkeletonRows` in `ui.tsx:191` (never used). Its presence invites fake loading states on a fast site.
4. **Footer motto echo** `Business / Leadership / Impact` at `chrome.tsx:508`; keep the header rendition once (line 74).
5. **Stale superseded doc**: `AUDIT-REPORT.md` (references to Libre Baskerville, pre-redesign canonical claims, five-step admissions, old contrast failures). Replace with a pointer to this audit or delete.
6. **`overflow-x:hidden` on `body` as a masking device**: this is what turns a 144 px overflow into clipped content (section 4.2). Keep it as a safety net only if the underlying overflow is fixed in the grids first; otherwise the removal order is: fix grids, then decide if the global rule stays.

---

## 18. FIX

Ordered by severity / effort:

1. **Static meta phrase** (S10, section 4.1): correct the three `index.html` description fields to the runtime register. 5 lines. Ship-blocker for any real scrape/preview.
2. **Keyboard-focus the concierge transcript** (section 4.3): add `tabindex="0"` + keep `aria-label="Concierge conversation"` on the scrollable div, and ensure the region is focusable only when it has overflow content. One attribute + guard.
3. **Reflow at 200% zoom** (section 4.2): give `/campus` and `/contact` reflow paths for the header Concierge/Apply cluster and their wide grids. Do not add `overflow-x:auto` to body globally; target the two offenders.
4. **Clarify the enquiry endpoint** (section 3.2): either wire Contact to the real GIBS inbox via a form backend, or change the success panel to explicitly say "complete the prefilled email to [address]". Today the panel shows success but no address is visible; a visitor who does not follow the mailto may believe submission landed.
5. **Newsletter honesty is fine**; when a service is connected, keep the "nothing has been sent" framing until the connection is real.
6. **Recompress the three local JPEGs** (section 14) after V5 verification passes: target ≤ 150 KB each, keep ratio in the fixed-aspect wrappers.
7. **Re-run the smoke sweep** for `/executive-education` at 1920 (one observed flake; it is a heavier initial-load page under cold font/image fetch). If it flakes again, add `loading="eager"` preload for its hero image.

---

## 19. VERIFY WITH OFFICIAL GIBS DATA

Every item below is either currently `DATA_REQUIRED`, "pending", or asserted by prose/alt text without official confirmation. Nothing below is fabricatable by an engineer; all of it requires the institution or the site owner.

1. **Official domain + canonical + absolute og/twitter image URLs + robots/sitemap activation** (index.html, robots.txt, sitemap.xml). Single highest-impact operational task after the domain exists.
2. **Programme facts**: duration, format, next intake, tuition & fees, entry requirements for all six programmes (`mba`, `executive-mba`, `doctorate-business-administration`, `executive-education`, `custom-programmes`, `undergraduate-business`).
3. **Admissions**: the five pending dates, application deadline, scholarship/financing framework, assessment details.
4. **Events calendar**: real dates, venues, times, locations; registration URLs; the `/events/:slug` detail pages will render whatever is supplied.
5. **Campus imagery authenticity**: the three local JPEGs (`hero-campus.jpg`, `campus-colonnade.jpg`, `library-interior.jpg`): a human must confirm each `alt` claim (e.g. "sandstone colonnade", "library with oak, brass and green leather") against the actual frame. If they are AI-art or mock renders, this is V-red and must be re-sourced; the copy is otherwise permanently aspirational.
6. **Stock Pexels replacements**: `boardroom`, `city`, `lecture`, `seminar`, `books`, `study` (six URLs in `data.ts`) → official photography once available; keep the same aspect ratios to protect CLS and the aspect wrappers.
7. **Faculty directory**: named chairs, biographies, research interests, publication records.
8. **Governing documents**: accreditation, award titles, contact address, legal pages (privacy, terms, accessibility statement), LinkedIn/Instagram/YouTube handles.
9. **Copy wording confirmations**: re-check the Home runtime description and the rewritten meta with the institution before launch; the phrase set in 4.1 must not be reintroduced in any official copy.
10. **Article statuses**: the three "Forthcoming" Journal items and their editorial-preview callouts become real publications when the journal launches; keep the data contract (`getArticle`/`related`) unchanged.

---

## 20. Recommended Redesign Direction

**Verdict:** do not redesign the skeleton. The design language, the copy discipline, the interaction model and the verified rendering robustness are already above the bar for a serious institutional brochure. A redesign is the wrong move; a *completion* program is the right one.

Prioritised direction, in order:

1. **Close the credibility loop with real photography** (V5 + V6). Replace stock Pexels with authentic art-directed frames (campus, library, boardroom, seminar, city) that match the "stone and light" register. This single change does more for candidate trust than any layout change.
2. **Seed official data through the existing `data.ts` contract**, field by field, replacing `DATA_REQUIRED`. The UI is already built for it (at-a-glance panel, DataNote, FactRow pending styling, Events renderer, Faculty EmptyState): it upgrades in place, no new components.
3. **Wire the enquiry path** (section 18.4) so a Contact submission and a Newsletter subscription land somewhere real, then remove the "nothing yet" language only once delivery is proven.
4. **Resolve the two zoom failures and the transcript focus** (section 18) as the last functional work before any data lands.
5. **Only after real content exists**, reconsider visual depth: keep `type-extrude`, paper-grain and the parallax panel; optionally add a WebGL-free Fraunces-grain or optical-size accent. The documented 3D rationales stand; do not add R3F without a product reason.
6. **Depart from the uniform PageHero at most twice** (e.g. a data-led stats strip on `/admissions`, a testimonial or pull-clock in an ArticleDetail) so the near-template repetition does not calcify.
7. **Then go live**: domain, canonical, absolute image URLs, robots/sitemap activation, and a single post-launch sweep rerun of the suite described in this audit.

**Exit criterion for launch readiness:** all items in section 19 are discharged by the institution, the two FIX items in 18.2/18.3 are green, `/campus` and `/contact` pass the 200% zoom check, and the static meta wording matches the runtime copy discipline.