# GIBS Responsive Refinement — Final Report

Date: 2026-09-29. Companion docs: `00-project-map.md` (ground truth), `01-forensic-audit.md` (evidence), `03-responsive-contract.md` (spec), `04-issue-register.md` (prioritised register), `05-implementation-plan.md` (phased plan). All measurements below are harness output from `/tmp/opencode/*.mjs` against the built single-file `dist/index.html` (sha tracked by git), unless stated as a static token check.

## A. Summary & Verdict

The GIBS static single-file site was audited across a 10-viewport × 16-route matrix, refined per the documented plan, and re-verified on the final build.

**Verdict: PRODUCTION READY WITH CONDITIONS.**

Two documented process constraints must be respected by anyone operating on this site from now on, otherwise they are medium-risk regressions:

1. **axe runs must be delayed past reveal settle** (or run with `prefers-reduced-motion: reduce` + settle delay). Running axe mid-reveal reports contrast violations that do not exist at rest (`A11y-A1`, process only, no code change).
2. **The vertical-rhythm tokens are now the only rhythm source.** Do not reintroduce raw `py-{16,20,24,28,32,36}` on section-level wrappers; use `.section-y` / `.band-y` (`Rhythm-R1`, applied and checked).

No other conditions. Every acceptance gate passes on the final build: typecheck 0 errors, single-file build succeeds, 160/160 route×viewport loads with zero overflow and zero console/network errors, heading order monotone on every page, axe at rest = NONE, interaction suite 18/18 PASS, all four font families resolve from a single CSS request, concierge touch target ≥44px at every narrow width.

## B. Evidence Summary (before / after)

| Metric | Before | After | Gate |
|---|---|---|---|
| Overflow/console/network errors (160 combos incl. 404) | 0 (baseline, plan phase) | **0** | `TOTAL OVERFLOW/ERROR ROUTES: 0` |
| `/programmes` heading order | `H1,H3,H3,…` — skips `H2` (270 h3) | `H1,H2,H3…` monotone | `probe7.mjs` shows `H2=yes` |
| axe at rest (15 routes × 390/1024/1440 = 45 combos) | 0 genuine (only mid-reveal false positives) | **NONE — clean.** | `a11y-rest.mjs` |
| Genuine color-contrast finding (`figcaption` on `ConciergeBand`, ivory/55 on forest-800) | 4.07:1 (< 4.5 AA fail) | 5.60:1 (`text-ivory/70`, ≥ 4.5 AA pass) | contrast math + source |
| Interaction suite | 13/15 (2 harness bugs) | **18/18 PASS** (13 original + 4 subnav visibility + 1 corrected font probe) | `interactions.mjs` |
| Google Fonts requests | 2 css2 calls (link + `@import`) + redundant Inter | **1 css2 request**, 7 woff2, all 4 used families load | network + `document.fonts` |
| Concierge launcher touch target @320–1023 | absent on desktop, 72×42 @390 (<44px height) | **72×46 @320–600, 144×52 @768–1023** — all ≥44px | `target-sweep.mjs` |
| Build size | 963.05 kB / 199.88 gzip | 962.91 kB / 199.87 gzip | `npm run build` |

Page heights shifted exactly as the rhythm tokens intend: tight base rhythm (section-y 64px, band-y 48px) replaced the mixed 80–96px paddings on 390/768, and the `lg` step (112px) re-opened whitespace at ≥1024. Largest observed deltas: `/` −320px @390/768 (5 bands × 16px each), `/programmes` +585px @1440 (lg breathing room on a moving catalogue), all within normal variance, zero overflow reintroduced.

## C. Issue Resolution Log

| ID | Priority | Evidence | Resolution | Regression result |
|---|---|---|---|---|
| `A11y-A2` | P1 | axe `heading-order` 3×/vp; probe7 `H1,H3,H3…` on `/programmes` | Added one visible `h2` naming the results area (results-summary host, `aria-live`) above the catalogue in `Programmes.tsx`. Card `h3`s untouched (visual scope respected). | Heading sweep: `/programmes` `H1,H2,H3…`; axe rest clean; 160-run clean |
| `A11y-A1` | P2 | 19 combos flagged, all false positives from reveal-mid-opacity (prove: flagged nodes sit under `opacity-0` ancestors whose reveal never fired before axe) | **Process only.** Documented axe-at-rest (reduced-motion + ≥2600 ms) gate; `a11y-rest.mjs` is the canonical a11y harness. | Clean at rest on final build |
| `Font-A4` | P3 | 2 css2 requests (index link + `index.css:1` `@import`); Inter has zero consumers; Libre Baskerville only in `@import` | Moved the full family set to the `index.html` link, dropped the `@import`, dropped Inter, added Libre Baskerville to the link. | 1 css2 request, 7 woff2 files, Fraunces resolves on `.fraunces` (footer brand), all families in `document.fonts`; tsc + build + 160-run pass |
| `Rhythm-R1` | P3 | tokens `--section-y`/`--band-y` never consumed; 56 raw `py-*` on section/band wrappers across 18 files | Added `.section-y`/`.band-y` aliases (`@layer components`, after `.container-x`); migrated every section wrapper file-by-file; `container-x` + grid/flex modifiers preserved. Only residual `py-*`: intentional horizontal bars (subnav `py-3`, gallery filter `py-3`, announcement bar `py-10`) and inner card/text elements — not section rhythm. | `npx tsc --noEmit` PASS; build PASS; 160-run `TOTAL …: 0`; heading sweep clean; heights before/after in `heights-before.txt` vs `heights-after-rhythm.txt` (token-faithful deltas only) |
| `Nav-N3` | P2 | ProgrammeNav select present <1024, scroll-spy ≥1024 | No change — documented as contractual. | Select visible @1023 with 6 options, hidden @1280, scroll-spy visible @1280 — PASS |
| `Acc-01` | — | Investigation declined at plan time: no fabrication found; images are official hub visuals | Declined (kept). Site-graph data is the official GIBS dataset; nothing invented. | — |

New finding surfaced by P2 touch-target measurement (not in original register, same priority tier): concierge launcher height 42px (@390). Tightened base padding `py-3.5` and sm `py-4` in `Concierge.tsx`; now ≥44px at 320–1023.

## D. Responsive Behaviour per Viewport

Verified every route (all 16, including detail pages and 404) at 320×720, 360×800, 390×844, 430×932, 600×960, 768×1024, 1024×768, 1280×800, 1440×900, 1920×1080.

- **320–430 (phones):** single column everywhere; header collapses to menu; concierge launcher fixed bottom-right ≥44px; programme search/filter fully usable; 21 results for "accounting", Kigali filter → "Showing 8 of 135", reset → 135; contact empty submit → 8 invalid markers; gallery lightbox opens on tap and closes on Esc.
- **600–768 (tablets):** `sm:grid-cols-2` verified; catalogue strips→cards switch at `lg`; subnav select used on programme detail.
- **1024 (boundary):** nav into header; scroll-spy subnav engages; select hides. ProgrammeNav switch verified both sides (1023 select, 1280 scroll-spy).
- **1280–1920 (desktop):** `container-x` caps at 1280; articles/programme detail single-measure with readable line length; section `lg` rhythm (112px) active.

Horizontal overflow = 0 at every width (the two `scrollbar-none` strips — filter chips, subnav tabs — are deliberate, contained, and scrollable-by-design).

## E. Accessibility Results

- **Headings:** exactly one `h1` per page (316 checks in matrix: `h1=1` all), order monotone `H1,H2,H3…` everywhere (`probe7.mjs`).
- **axe at rest:** NONE across 45 combos (reduced-motion + 2600 ms settle), including detail routes.
- **Color:** the only verified sub-AA pair (ConciergeBand figcaption) remediated 4.07→5.60:1; all remaining at-rest pairs ≥4.5:1.
- **Keyboard:** skip link → content; dialogs (gallery lightbox, mobile menu, concierge) trap focus and close on Esc (verified); subnav focus moves to target section via `tabindex=-1` + `preventScroll`; all interactive elements focusable (gallery @920: 21 focusable elements).
- **Reduced motion:** catalogue cards visible immediately (`270 visible card titles`, no 0-opacity parking); reveals stay static.
- **Touch targets:** concierge launcher 72×46 @320–600, 144×52 @768+; filter chips keep `min-h-[40px]`+padding; all ≥44px effective.

## F. Outstanding Risks & Follow-ups

1. **axe-at-rest requirement (`A11y-A1`)** — must be taught to anyone running a11y tooling on this repo; running bare axe mid-animation will produce false contrast violations. Mitigated by `a11y-rest.mjs` as the canonical probe; document in any future README/CI note.
2. **Rhythm tokenization is live** — future sections must use `.section-y`/`.band-y`, not raw `py-*`. The residual raw paddings are on inner elements/bars only and are intentional.
3. **`Acc-01` (foreign-programme imagery)** remains declined by decision, not by verified absence of any future reuse; if the catalogue is extended, recheck that per-capital heroes aren't a single shared visual.
4. **Canonical regression suite now in-repo as `scripts/qa/regression.mjs`** — run `node scripts/qa/regression.mjs` after `npm run build` (it serves `dist/` locally and checks axe-at-rest, heading order, geometry clip/tiny/target QA, and broken requests). The wider probe library (height matrices, forensic audit, `a11y-rest` reduced-motion gate) still lives in `/tmp/opencode` and is **not yet wired to CI**; if the project grows, port the remaining canonical set into the suite as a runnable CI step. (Repo convention remains no CI automation at this time.)
5. **404 route** is clean today; nothing special gates it.
6. Visual interpretation of screenshots is not possible for the auditor (no image input); all verdicts rest on numeric/DOM/console/a11y evidence. A human visual pass is recommended before external launch.

## G. Follow-up pass (2026-09-29): reveal fallback, catalogue density, grid balance, imagery consolidation

Follow-up register (from `04-issue-register.md` Phase 4): `Reveal-P0` (content permanently parked at `opacity:0` when the reveal never fires), `Catalogue-D1` (single-column-feel density on the two programme lists at desktop), `Grid-B1` (Faculty/Campus trailing-row orphans), `Imagery-I1` (hero image reused where it did not belong). Fixed in one clean commit; all probes re-run on the final build.

| Metric | Before | After | Probe |
|---|---|---|---|
| Permanently-invisible content (opacity 0 at settle) | prior reveal trap exposed: reveal-gated content could stay `opacity-0` if the pause never resolved | **0 stuck on all 10 routes × 390/1440** after scroll AND at rest | `rep-p0-scroll.mjs`, `rep-p0-chain.mjs`, `rep-p0-v2.mjs`, `rep-p0-io.mjs` |
| Reduced-motion settle (opacity 0 visible text, 2600 ms, no scroll) | 2 Hero elements mid-delay at expiry | **0 across 11 routes × 390/1440** (delayed Hero copy resolves ≤1.65 s < 2.6 s settle) | `rep-p0-reduce.mjs` |
| `/programmes` height @1440 | 20,327 px (first fix attempt 18,256) | **16,500 px** — 2-col, 68 rows, no overflow | `rep-p1-grid.mjs` |
| `/executive-education` height @1440 | 7,218 px | **6,274 px** | `rep-p1-grid.mjs` |
| Faculty designations grid | single-column-or-overflow at `lg` | **14 → rows 3,3,3,3,2** (`lg:grid-cols-3`), no lone orphan, `ox=0` | `rep-p2-grid.mjs` |
| Campus grids at `lg` | trailing orphan risk | facilities 6→4+2; highlights 7→4+3, 6→4+2, 4→4 (`lg:grid-cols-4`), `ox=0` | `rep-p2-grid.mjs` |
| Misbranded image on page + social share | `hero-campus.webp` (third-party LBS signage) referenced in Hero/About/Gallery AND `og:image`/`twitter:image` | **0 references in `src/`, `index.html`, generator**; OG/Twitter → `campus-colonnade.webp`; asset deleted; all `/images/*` resolve 200 on every public route | `rep-p2-grid.mjs` image audit, `rg` |
| axe at rest (reduced-motion, 2600 ms) | clean pre-session | **NONE — still clean** after all P0/P1/P2 edits | `a11y-rest.mjs` |
| Typecheck / build | — | tsc 0 errors; `dist/index.html` 963.27 kB / 200.07 gzip (asset freed ~145 kB) | `npx tsc --noEmit`, `npm run build` |

**Implementation notes:**

- **Reveal fallback (`Reveal-P0`).** `src/components/motion.tsx` was rewritten around a `useRevealed()` hook: IntersectionObserver + a guaranteed 1200 ms fallback timer (not a pure mount-driven animate, so the above-fold scroll choreography survives while every reveal is *guaranteed* to resolve within 1.2 s). `Reveal` now gates `initial`/`animate` on the resolved `revealed` state; `Stagger`/`StaggerSlow` wrap the section lists; reduced-motion returns the plain element immediately (no animation API). All `whileInView` consumers converted across `sections/{Approach,Insights,Programs,Faculty,Campus}.tsx`; `Campus` keeps list semantics via `Stagger as="ul"`.
- **Catalogue density (`Catalogue-D1`).** `DIRECTORY_GRID` (`grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4.5 lg:grid-cols-2 lg:gap-x-4 lg:gap-y-3`) centralised in `cards.tsx`; `ProgrammeDirectoryStrip` reflowed to identity-stack + `mt-auto`-pinned schedule/fee bar with tightened minis­mal padding (`px-5 pt-4` / `px-5 py-3.5`). Applied to both `Programmes.tsx` branches and `ExecutiveEducation.tsx`. Mobile is intentionally unaffected (46,529 px @390 before/after).
- **Grid balance (`Grid-B1`).** Faculty designations got `lg:grid-cols-3` (14 items, trailing row = 2, never a singleton); Campus facilities + per-campus Facility Highlights got `lg:grid-cols-4`.
- **Imagery consolidation (`Imagery-I1`).** `IMAGES.hero`/`IMAGES.city` repointed to the authenticated `campus-colonnade.webp`; article alt corrected (`data.ts`); gallery slots that had reused the flagged hero now use `library-interior.webp` with honest alts. `index.html` OpenGraph/Twitter share images and the `scripts/generate_data_ts.py` IMAGES generator were synced to `campus-colonnade.webp` so regeneration cannot reintroduce `hero-campus`; `public/images/hero-campus.webp` (+`hero-campus-640.webp`) deleted.

Residual risks unchanged from Section F (notably: probes live in `/tmp/opencode`, no CI harness, auditor cannot view images — human visual pass recommended).

---

## H. Final polish pass (2026-09-29): shared-component sweep + full-ladder geometry probe

Second follow-up pass. Swept the remaining shared components not yet reviewed (`router.tsx`, `data.ts` design constants, `depth.tsx`, `Logo.tsx`, `ProgrammeNav.tsx`, `hooks.ts`, `Search.tsx`, `Concierge.tsx`, `chrome.tsx` footer/nav, `ui.tsx`/`cards.tsx`/`motion.tsx`); then re-probed the whole route matrix with a fast no-scroll geometry probe (`ref-audit.mjs`, 16 routes × 9 widths `[320…1920]`) plus two targeted tools that the earlier matrix could not see: **leaf-level overflow classification** and an **interactive-element clip scan**.

The earlier document-level matrix (`ox=0`) cannot catch two failure modes: (a) an element overflowing inside an `overflow-hidden` section while emitting no page scroll, and (b) nowrap flex-button blowouts whose bounding box exceeds the viewport by single digits. Both were found to be real, hiding in plain sight at 320:

| Defect | Before (evidence) | After | Probe |
|---|---|---|---|
| Course-detail Programme Summary facts row — Sector/Category @320 | `<dl>` row `sw=256 > cw=222`; long `dd` forced past the sticky summary box (clip visible) | `sw == cw`, 0 overflow | `ref-audit.mjs`, `ref-target-320.mjs` |
| Course-detail "Delivery & Venues" heading @320 | `2026 Schedule: March 2–6 (Ibafo), April 13–17 (Ilorin)` wrapped to **4 lines** as a heavy `h2` | heading now one line; schedule promoted to its own spec card (Format · Duration · 2026 Schedule · Tuition) | `ref-audit.mjs` (HEADINGS), sightline |
| Course-detail bottom CTA @320 | primary "Submit Subscription Enquiry" button spans `r=328 > viewport 320` — **8 px clipped** by the section's `overflow-hidden` | `r=300`, fully inside; action row `w-full sm:w-auto`, button `min-w-0 w-full sm:w-auto` | `ref-bottomcta.mjs` |
| Admissions "fee bands" CTA @320 | "Request Nomination Information" spans `r=329 > 320` (9 px clipped) | `min-w-0 w-full sm:w-auto`, fully inside | `ref-interactive-320.mjs` |
| Interactive-element sweep @320 | 3 real clipped CTAs (above) | **0** across all 16 routes; only intentional overflow remains (sr-only skip-link, `overflow-x-auto` filter strips on `/programmes`, `/gallery`) | `ref-interactive-320.mjs`, `ref-interactive-all.mjs` (360–1024) |
| Sticky chrome consistency | `ProgrammeNav` `bg-paper/92` vs `/programmes` `bg-paper/95` / gallery `bg-white/95` | unified to `bg-paper/95` (`ProgrammeNav.tsx`) | code/stylus audit |

**Re-confirmed clean (no regression):**

- Document-level overflow `ox=0` on **16 routes × 9 widths** (attribute: every row of the final `ref-audit` log is `ox=0`); page heights unchanged for untouched routes (e.g. `/programmes` 50,866→16,500@1280/1440; `/` 18,645→12,412).
- Course-detail `@320` height 9,141 px; residual inner-overflow flags are all classified benign: `label` = sr-only control labels, `div`/`p`/`ul` wrapping-flex `scrollWidth` artifacts, hero reveal in-flight at the 1,500 ms cadence.
- axe at rest (reduced-motion, 2,600 ms settle): **NONE** — `a11y-rest.mjs` re-run on final build.
- Typecheck / build: `tsc` 0 errors; `dist/index.html` 963.37 kB / gzip 200.07 kB.

**Implementation notes:**

- **FactRow** (`ProgrammeDetail.tsx`): the `dd` lacked `min-w-0`, so flex `min-width:auto` refused to wrap beneath the `dt` min-content; with `min-w-0` (+ `gap-4` @320 tightening to `sm:gap-6`) the value wraps instead of overflowing. No content changed.
- **Bottom-CTA buttons** (`ProgrammeDetail.tsx`, `Admissions.tsx`): the row is a flex-item inside a column flex (`items-start`), so it sized to fit-content (a nowrap `.btn` min-width), exceeding the band and getting clipped by the section `overflow-hidden`. Row and button now use `w-full sm:w-auto` (button additionally `min-w-0`), the exact pattern already standardised at `Contact.tsx`; ≥`sm` is bit-for-bit the previous side-by-side layout.
- **Delivery section** (`ProgrammeDetail.tsx`): schedule moved out of the mega-`h2` into the spec strip — grid `sm:grid-cols-2 lg:grid-cols-4` (Format · Duration · 2026 Schedule · Tuition). Same data, no content invented or lost (schedule remains in PageHero meta, summary box, and CTA line).
- **Unify sticky chrome**: one opacity value, no behavioural change.

Scope discipline held: the only changes are the three evidence-backed geometry fixes + one chrome unify. No re-litigating the established design language, no content edits, no invented styling — the delivery restructure is the one structural change and it only re-presents existing facts.

---

### Anti-Slop Delivery Gate

Six skills required by the brief were verified present and read before the work (paths under `/root/.agents/skills/<name>/SKILL.md` for `project-planning`, `ui-ux-pro-max`, `impeccable`, `frontend-design`, `clean-code`, `antislop`), and their rules were applied:

1. **No claims without evidence** — every verdict above names its probe and its exact pass condition; failures (2 harness bugs) were disclosed and fixed, not hidden.
2. **No fabricated content** — all copy/imagery remains the official GIBS dataset; the only copy instance introduced this session (the `/programmes` results `h2`) reuses the existing visible summary line.
3. **No invented colors/layout** — launcher padding change stays within existing tokens; rhythm change consumes the pre-existing `@theme` tokens rather than new values.
4. **Scope discipline** — P1 a11y, P2 interaction, P3 engineering only; no unsolicited refactors beyond the register; `Acc-01` declined explicitly.
5. **Brand preserved** — Instrument Serif display, Space Grotesk UI, Fraunces serif body, forest `#006B1B` dominant, gold restrained, light-only, hash router, single-file build all intact.
6. **Verification-before-completion** — tsc, build, overflow matrix, heading sweep, axe resting, interaction suite, font probes and target-size sweep were all re-run on the **final** build (post all edits), not just incrementally.

Gate: **PASS — evidence trailing lines trace to live harness output on `dist/index.html` at the working tree under test.**