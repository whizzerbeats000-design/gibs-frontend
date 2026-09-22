# GIBS Frontend — Production Audit Report

**Target:** `/root/gibs-frontend` · React 19 + Vite 7 + Tailwind 4 + framer-motion
**Audit type:** Evidence-based (static + automated browser testing with Playwright/Chromium)
**Build verified:** `npm run build` ✅ · `npx tsc --noEmit` ✅ (exit 0, strict)
**Screenshots:** `/tmp/gibs-test/shots/` (23 desktop full-page) · `/tmp/gibs-test/mobile/` · `/tmp/gibs-test/results.json`

---

## 1. Route inventory (all 22 routes render, no page errors)

Every route serves `HTTP 200`, renders a single unique `h1`, unique `<title>` and a page-specific meta description. 404 is a designed page, not a crash.

| Route | Title | Status |
|---|---|---|
| `/#/` | GIBS — Goshen International Business School | ✅ Hero parallax hero |
| `/#/programmes` | Programmes — GIBS | ✅ filter + search |
| `/#/programmes/mba` … `/executive-mba`, `/doctorate-business-administration`, `/executive-education`, `/custom-programmes`, `/undergraduate-business` | Programme-name — GIBS | ✅ full profile pages, scroll-spy nav, FAQ |
| `/#/executive-education` | Executive Education — GIBS | ✅ |
| `/#/admissions` | Admissions — GIBS | ✅ 5-step journey + FAQ |
| `/#/about` | About GIBS — …Business School | ✅ |
| `/#/faculty` | Faculty & Research — GIBS | ✅ (dir "in preparation") |
| `/#/research-insights` + 3 article slugs | — GIBS Journal | ✅ article renderer + related |
| `/#/campus` | Campus — GIBS | ✅ |
| `/#/events` | Events — GIBS | ✅ empty-state (by design) |
| `/#/events/<anything>` | Event — GIBS | ✅ graceful "not yet published" |
| `/#/contact` | Contact — GIBS | ✅ form + validation + success |
| `/#/concierge` | GIBS Concierge — Guided assistance | ✅ |
| `/#/<unknown>` | Page not found — GIBS | ✅ "This corridor doesn't exist." |

## 2. Deep homepage audit

H1, hero (100 svh, parallax + gradient overlays), 9 sections all render. CTAs route correctly (`Explore Programmes → #/programmes`). No horizontal overflow at 320–1920. LCP ~1.5 s warm.

## 3. Visual system

Real system, not ad hoc: `@theme` tokens (forest `#006B1B`, gold `#EBD375`, ivory/paper/ink, radii `rounded-panel/pill`, shadow `crisp`), type scale matching fonts (display serif Libre Baskerville + Plus Jakarta Sans), `btn/chip/rule/container-x` utilities, grain overlays, revealed/sectional motion with shared `EASE`. Consistent across all 22 pages.

## 4. Header / nav / footer

13 nav links + secondary row; active-underline indicator; sticky "Apply Now" / "Apply"; search button; Concierge button; mobile menu = 10-link dialog. **Tab order verified:** Skip link → secondary nav → primary → actions. Focus trap, scroll lock, `aria-expanded`, `aria-current="page"` all present.

## 5. Interaction testing (all pass)

- Search: ⌘/Ctrl+K opens; "MBA" → 7 results; Enter → `#/programmes/mba` ✅
- Mobile menu: opens, navigates to `#/programmes`, closes cleanly ✅
- Programme filters: "Degree" → 2 rows; search "dba"/"administration" → DBA ✅
- Scroll-spy: after scroll, nav highlights `FACULTY` ✅
- FAQ accordion: opens ✅
- Contact: empty submit → 4 inline errors + focus to `#name`; valid submit → success panel + prefilled `mailto:admissions@gibs.example` ✅
- Events: 6 category chips, empty-state copy ✅
- Concierge dialog: opens; suggestion click returns programme cards; **Escape closes it** (verified in clean session) ✅
- Concierge page: typed question → deterministic reply + "Explore the campus / Arrange a visit" cards ✅
- Broken external links: **none**

## 6. Content authenticity

**Strength — the site never fabricates facts.** Every statistic, date, fee, format, requirement and contact detail is literally marked `[OFFICIAL GIBS DATA REQUIRED]` (37+ sites in `src/lib/data.ts`), rendered through `<DataNote/>`. Events are intentionally empty ("calendar in preparation"). Faculty directory, social channels, legal pages, and institutional address are all declared "pending publication."

**Weakness — imagery cannot be machine-verified.** The 3 local campus JPEGs (`hero-campus.jpg`, `campus-colonnade.jpg`, `library-interior.jpg`, all 1376×768, likely AI/mock-sourced — no EXIF/provenance) carry detailed alt text ("sandstone pavilions, reflecting pool, members of the school community walking the promenade"). The model cannot visually confirm these match a real campus. **A human must eyeball these against the alt text before launch.** Three detail images are stock Pexels URLs.

## 7. Assets

Local: 3 JPEGs (229–293 KB), `gibs-logo.svg` (2.5 KB), `gibs-favicon.svg` (2.1 KB). Remote: 3 Pexels images + 2 Google Fonts. All **load successfully** (0 failed requests recorded during a full 22-route pass). `og:image`/`twitter:image` point at local `/images/hero-campus.jpg` (relative — fine for hostless preview, needs absolute URL at launch).

## 8. Responsive

Sweep 320→1920 (320/375/430/768/1024/1280/1440/1920): **zero horizontal overflow.** Breakpoints tuned (header collapses, nav reflows, grid columns drop). Mobile menu verified.

## 9. Performance (production single-file build)

- Single `dist/index.html`: 620 KB (175 KB gzip) — inlines JS+CSS+public assets
- Home: 724 DOM nodes, DCL 931 ms, load 935 ms, **LCP ~1.5 s** (warm)
- Warm network: 8 requests / 245 KB transferred (below-fold images are lazy)
- Remote Pexels images defer naturally; fonts preconnected
- Risk: one 175 KB-gz HTML for the whole app is fine for marketing scale; consider splitting only if route-level code-splitting is ever wanted

## 10. Accessibility

Passes pretty well by design; **4 serious contrast clusters** block AA:
- `color-contrast` (serious): home 11 nodes, programmes 5, about 5, contact 5, concierge 6 — all are **opacity-dimmed text** (`text-ivory/35–45` footer legal copy, `text-muted/70` programme duration meta). Ratio ~3.0–4.49:1 vs required 4.5:1. Fix: use darker tints/solid tokens instead of low-opacity overlays.
- `landmark-complementary-is-top-level` (moderate) ×2: `<aside>` sideboards inside `<main>` (Contact, Concierge) — either hoist or use `<div aria-label>`.
- ✅ Keyboard: skip link, focus trap, logical tab order, visible focus rings.
- ✅ Landmark/ARIA quality is high (labeled dialogs, `aria-live` concierge transcript, breadcrumbs, `aria-pressed`/`aria-current`).

## 11. SEO

- Unique title + meta description on **every** route ✅ · canonical ✅
- **Not launch-ready:** canonical `https://gibs.example/`; `robots.txt` + `sitemap.xml` use placeholder `gibs.example` and list **hash-routes** (`research-insights/…`), which real crawlers cannot resolve per-page.
- Hash router ⇒ all routes are the same URL to search engines; acceptable only for a hostless/preview artifact. Real launch needs paths (or a prerendering/SSR step).

## 12. Engineering

- No `lint` script in `package.json` (only dev/build/preview). `tsc --noEmit` clean.
- Clean component architecture: `pages/`, `components/`, `lib/` (data, router, hooks, concierge), content all in one `data.ts` contract.
- Hash router + `useSeo`, `navigate`, `hrefFor` — coherent tiny router with zero deps.
- Deterministic rule-based Concierge — **honestly documented as NOT an AI service** (badge in UI).

## 13. Console / runtime health

- **0 page errors**, 0 failed requests, 0 overflows.
- **One real bug — duplicate React keys in the Concierge.** Reproduced: dialog conversation persisted ids `[0,1,3]` to `localStorage`; opening `/concierge` re-mounts a fresh `idRef` at `1`, so new sends reuse ids `1,3` (`[0,1,3,1,3]`) → repeated `"Encountered two children with the same key"` warnings and risk of duplicated React children. Root cause: `const idRef = useRef(1)` ignores restored history (`src/components/Concierge.tsx:106,138`). Fix: seed `idRef` from `max(history.id)+1` (or use a monotonic UUID).
- Minor: concierge dialog persists across route changes (arguably fine for a global desk); in one long session Escape failed to close it once (not reproduced in a clean session).

## 14. Gaps · severity matrix

| # | Gap | Px |
|---|---|---|
| G1 | Duplicate-key bug in Concierge (localStorage replay + `idRef` reset) | **P1** |
| G2 | All real institutional data pending (`DATA_REQUIRED`) — dates, fees, faculty, events, address, socials, legal pages | P0* |
| G3 | Placeholder domain everywhere (`gibs.example`, robots, sitemap, canonical, contact email) | P0* |
| G4 | No backend for enquiries — success screen only produces a `mailto:` | P0* |
| G5 | Campus imagery unauthenticated (human visual QA needed) | P0* |
| G6 | WCAG contrast: dimmed footer/meta text fails AA (17 nodes across pages) | P2 |
| G7 | No `lint` script in CI/`package.json` | P3 |
| G8 | Contact message validation message says "ten words" but checks 10 chars | P3 |
| G9 | `sitemap.xml` lists hash-URLs + placeholder domain | P2 |
| G10 | `<aside>` landmarks nested in `<main>` (moderate) | P3 |

\* P0 = ship-blockers for a real launch; all are **content/ops**, not code. The engineering layer is launch-ready.

## 15. Agency-readiness verdict

**Would an international design agency consider this production-ready? No — but it is a remarkably strong, near-shippable skeleton and clearly more than a mockup.**

Ceiling reasons: the visual system is genuinely designed (not templated), content integrity is exemplary (no fabricated data anywhere), the interaction layer is complete and functional, and there are no console/page/render failures across all 22 routes and 8 viewports.

Ship-blockers are **institutional, not technical**: official data, a delivery mechanism for enquiries, a real domain/identity, and authenticated campus photography. Fix those (plus the P1 key bug and contrast pass) and this becomes a credible production marketing site — likely without any structural redesign.

**Remediation order (A→O):**
1. P1 Concierge key fix (5-line change)
2. Seed official data into `data.ts` (replace `DATA_REQUIRED` field by field)
3. Stand up enquiry delivery (form endpoint or route to the real inbox)
4. Own domain + canonical + robots/sitemap rewrite (drop hash-route URLs)
5. Human visual QA of campus imagery ↔ alt text; commission real photography
6. WCAG contrast pass on dimmed copy (replace `/opacity` tints with solid tokens), hoist `<aside>`s
7. Add `lint`; fix "ten words" validation copy; ongoing: events calendar fills naturally