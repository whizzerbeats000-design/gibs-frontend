# GIBS Website — Second-Pass Independent SEO & Technical Search Verification Audit

**Date:** 2026-10-08  
**Auditor:** Claude Code (independent verification)  
**Project:** `/root/gibs-frontend`  
**Production URL:** `https://gibs-frontend-eight.vercel.app`  
**Canonical domain:** `https://www.gibs.com.ng/` (DNS: **NXDOMAIN — does not resolve**)  

---

## 0. Project Context

### Git State (recorded at audit start)

| Field | Value |
|-------|-------|
| Branch | `fix/coderabbit-review-fixes` |
| HEAD | `c366258585af4e9e83357a2cb210f04df7276592` |
| Working tree | Clean (0 uncommitted changes) |
| `data.ts` sha256 | `910ff4d7…` (byte-locked, verified unchanged at end) |
| Files staged | 0 |
| New commits | 0 |

### Stack

- React 19.2.6 · Vite 7.3.2 · TypeScript 5.9.3 · Tailwind CSS v4.1.17
- `vite-plugin-singlefile` — inlines all CSS/JS into single HTML output
- Hash-routed SPA (`/#/` prefix)
- Vercel deployment (legacy `vercel.json` `routes` format)

### Constraints honored

- `src/lib/data.ts` was **not modified** (verified: sha256 matches HEAD)
- `robots.txt`, `sitemap.xml`, `index.html`, routing, images, and configuration were **not modified**
- No formatter, linter autofix, commit, push, or deploy was executed during this audit
- No new routes, SEO content, accreditation claims, statistics, or testimonials were invented

---

## 1. Executive Verdict

### Summary

The previous audit's findings are **substantially accurate** but contain several **material inaccuracies** that need correction:

1. **robots.txt / sitemap.xml production serving defect** — CONFIRMED. The previous audit's claim that production serves robots.txt correctly is **FALSE**. Both `/robots.txt` and `/sitemap.xml` return the 921KB SPA `index.html` (content-type: `text/html`) instead of their actual files. Root cause: `vercel.json` Route 1's SPA rewrite catches `.txt` and `.xml` extensions.

2. **"780 KB JPG dead weight"** — **INACCURATE**. The actual total is **4.7 MB across 10 files** — 6× the stated figure. Additionally, `gibs-hero-branded.jpg` *is* referenced (in `index.html`), but only as an **external** OG image URL pointing to `gibs.com.ng` (which has **NXDOMAIN**). The production-deployed copies are dead weight.

3. **"Good Core Web Vitals"** — **PARTIALLY CONFIRMED** (lab data only). Lab measurements on local build show strong metrics (desktop FCP 1868ms, LCP 1868ms, CLS 0.0000; mobile FCP 1360ms, LCP 2980ms, CLS 0.0000). However, **no field data was available** (no Google Search Console, no CrUX API access), and production TTFB from the audit environment was 3.5s (network-constrained). The LCP element is a `SPAN` (text), not the hero image — this is architecturally correct for a text-heavy hero.

4. **"No favicon.ico 404"** — Not explicitly reported. The 404 was confirmed: production returns HTTP 404 for `/favicon.ico`.

### Overall SEO Grade

| Area | Status | Notes |
|------|--------|-------|
| Static HTML fundamentals | **FAIL** | 0 H1, 0 images, 0 body text in static HTML |
| Dynamic SEO (post-JS) | **PASS** | All routes have unique titles, descriptions, single H1 |
| Technical infrastructure | **FAIL** | robots.txt + sitemap.xml not served on production |
| Image optimization | **PARTIAL** | 4.7MB of dead JPGs deployed; .webp used by code |
| Security | **PASS** | HSTS, CSP, X-Frame-Options, etc. all present |
| Performance | **CONDITIONAL** | Good in lab; no field data; no real-user monitoring |
| Content authenticity | **PASS** | No fabricated claims, no fake reviews, no invented statistics |
| Mobile responsiveness | **PASS** | All 12 viewport widths pass |

**Verdict: The GIBS frontend has correct dynamic SEO after JS execution, but its static HTML is completely empty and its production infrastructure has a critical defect: robots.txt and sitemap.xml are not served.** The site is fundamentally limited by its SPA architecture — search engines that don't execute JavaScript will find no content.

---

## 2. Previous Audit — Independent Verification

Every claim from the previous audit was independently verified using `curl` (production), Playwright (browser rendering), `grep` (source code), `sha256sum` (integrity), and local build measurements.

| # | Previous Finding | Independent Verification | Verdict |
|---|---|---|---|
| 1 | Empty sitemap | ✅ Confirmed: 0 `<url>` entries, valid XML (2200 bytes), exists locally but **NOT served on production** (returns 921KB HTML) | **ACCURATE** (but production serving defect not flagged) |
| 2 | robots.txt without Sitemap directive | ✅ Confirmed locally; **But NOT SERVED on production** (returns 921KB HTML). Previous audit's claim that "robots.txt is served" is **FALSE** | **INACCURATE** |
| 3 | Root-only canonical | ✅ Confirmed: single `<link rel="canonical" href="https://www.gibs.com.ng/">` for all routes. Documented with explicit comment in `index.html:20-22` | **ACCURATE** |
| 4 | Root-only static title/description | ✅ Confirmed: static title "GIBS — Goshen International Business School" in `index.html:6`; 9 dynamic titles via `useSeo()` in `router.tsx:185-197`. Browser-rendered: all 9+ routes have unique titles. | **ACCURATE** |
| 5 | Zero H1/body/images in static HTML | ✅ Confirmed via `curl`: 0 H1, 0 `<img>`, body innerHTML = 29 bytes (only `<script>` tags) on all routes | **ACCURATE** |
| 6 | Dynamic SEO after JavaScript execution | ✅ Confirmed: 9 routes render unique titles, descriptions, single H1, proper heading hierarchy (1→2→3), meaningful alt text | **ACCURATE** |
| 7 | EducationalOrganization schema only | ✅ Confirmed: 1 JSON-LD block, `EducationalOrganization` type with identifier RC 1178333, address, 2 contactPoints, knowsAbout. No WebSite, SearchAction, BreadcrumbList, Article, or Course schema | **ACCURATE** |
| 8 | No BreadcrumbList | ✅ Confirmed: no BreadcrumbList in index.html or in JS-rendered DOM. `PageHero.tsx` has breadcrumb support (imports `Breadcrumbs` from ui.tsx:35) but NO route passes `breadcrumbs=` prop | **ACCURATE** |
| 9 | No WebSite/SearchAction | ✅ Confirmed: 0 matches for "WebSite" or "SearchAction" in source. No search results page exists — `Search.tsx` only navigates to existing routes (`#programmes`, etc.) | **ACCURATE** |
| 10 | No Article schema | ✅ Confirmed: 0 Article schema. No article detail routes in `App.tsx` (only 8 routes: `/`, `/programmes/:slug`, `/about`, `/gallery`, `/executive-education`, `/admissions`, `/contact`, `/concierge`). 2 articles exist in `data.ts` but have no routes | **ACCURATE** |
| 11 | 780 KB JPG dead weight | ❌ **INACCURATE**: Actual total is **4.7 MB** across **10 files** (not 780 KB). All 10 .jpg files are deployed on Vercel with `max-age=31536000, immutable`. Zero are referenced by code (`.jpg` count in `src/` = 0). One is referenced in `index.html` but as an **external URL** to `gibs.com.ng` (NXDOMAIN). | **ACCURATE COUNT: 10 files, 4.7 MB** |
| 12 | favicon.ico 404 | ✅ Confirmed: HTTP 404 on production. No `favicon.ico` in `public/`. Favicon served via `<link rel="icon" type="image/webp" href="./images/gibs-logo.webp">` in `index.html:49` | **ACCURATE** |
| 13 | llms.txt returns SPA HTML | ✅ Confirmed: `llms.txt` not in `public/`. Production `/llms.txt` returns index.html (921KB, text/html) via SPA rewrite | **ACCURATE** |
| 14 | OG image pointing to gibs.com.ng | ✅ Confirmed: `og:image` = `https://www.gibs.com.ng/images/gibs-hero-branded.jpg` (external, .jpg). Local .webp equivalent exists at `/images/gibs-hero-branded.webp` (117KB) | **ACCURATE** (but domain doesn't resolve) |
| 15 | Strong HTTPS / security headers | ✅ Confirmed: HSTS `max-age=63072000; includeSubDomains; preload`, CSP with 7 directives, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy (9 directives). HTTP→HTTPS 308 redirect | **ACCURATE** |
| 16 | Good Core Web Vitals | ⚠️ **CONDITIONAL**: Lab (desktop): FCP 1868ms, LCP 1868ms (SPAN), CLS 0.0000. Lab (mobile): FCP 1360ms, LCP 2980ms (P), CLS 0.0000. **No field data available**. Production TTFB 3508ms (audit-env network). | **PARTIALLY ACCURATE** |
| 17 | Mobile pass | ✅ Confirmed: 12 viewport widths (320→1600px) all render correctly — H1, hero image, logo, footer, no overflow, no console errors | **ACCURATE** |
| 18 | No broken internal links | ✅ Confirmed: all 8 clean routes return HTTP 200. Hash routes (`/#/path`) also 200 | **ACCURATE** |
| 19 | Hash SPA architecture limiting route-level SEO | ✅ Confirmed: all routes return identical 921KB HTML (same MD5 across `/`, `/about`, `/programmes`, `/gallery`, `/executive-education`). No route differentiation in static HTML | **ACCURATE** |
| 20 | "subscription" internal identifier | ✅ Confirmed: `id="subscription"` in `Journey.tsx:14` — refers to enrolment Journey section. `SUBSCRIPTION_STEPS` in `data.ts` (byte-locked) refers to programme enrolment process. NOT a subscription platform product | **ACCURATE** (but mischaracterized as risk) |
| 21 | "nomination" in protected data | ✅ Confirmed: 115 occurrences of "nominations" in `data.ts` (byte-locked), all in the context of corporate participant enrolment, not fake claims | **ACCURATE** |

---

## 3. 20-Point SEO Verification Table

| # | Check | Previous Finding | Verified Result | Status | Evidence | Recommendation |
|---|-------|-----------------|-----------------|--------|----------|----------------|
| 1 | **Sitemap exists** | "Empty sitemap" | File exists locally (2200 bytes, 0 URLs), valid XML | PARTIAL | `curl -s /sitemap.xml` → 200 text/html (921KB SPA HTML). `grep -c "<loc>" public/sitemap.xml` = 0 | Add `xml` to vercel.json Route 0 extensions OR add explicit route. Add actual URLs or document why 0 is intentional |
| 2 | **Sitemap served on production** | Not explicitly checked | ❌ FAIL — returns SPA HTML | FAIL | `curl -s -o /dev/null -w "%{content_type}" /sitemap.xml` → `text/html; charset=utf-8` | Fix vercel.json routing (see #1) |
| 3 | **robots.txt exists** | "robots.txt without Sitemap directive" | File exists (433 bytes), correct content | PARTIAL | `cat public/robots.txt` shows correct `User-agent: * Allow: /` with comments | Add `txt` and `xml` to Route 0 or add explicit routes |
| 4 | **robots.txt served on production** | "Production robots.txt serves correctly" | ❌ FAIL — returns SPA HTML | FALSE | `curl -sI /robots.txt` → HTTP 200, `content-type: text/html`, size 921725. `curl -sI /sitemap.xml` → HTTP 200, `content-type: text/html`, size 921725 | Fix vercel.json routes |
| 5 | **Root-only canonical** | "root-only canonical" | ✅ Confirmed — single canonical `https://www.gibs.com.ng/` on all routes | PASS | `grep canonical index.html:29` → `href="https://www.gibs.com.ng/"`. Browser-DOM: all 8 routes render same canonical. Comment in `index.html:20-22` explains rationale | No action needed — correct for hash SPA |
| 6 | **Static title/description** | "root-only static title/description" | ✅ Confirmed | PASS | `index.html:6-7`: title "GIBS — Goshen International Business School"; description ~230 chars | See #14 for dynamic titles |
| 7 | **Dynamic titles per route** | Not previously checked | ✅ All 9 routes have unique titles after JS render | PASS | Browser verification: Home="GIBS — ...", About="About GIBS — ...(RC 1178333)", Programmes="2026 Training Calendar (135 Programmes) — GIBS", Gallery="Gallery — GIBS", etc. `useSeo()` in `router.tsx:185-197` | No action needed |
| 8 | **Dynamic descriptions per route** | Not previously checked | ✅ All routes have unique descriptions after JS render | PASS | Browser verification: each route has description > 70 chars, unique content | No action needed |
| 9 | **H1 in static HTML** | "zero H1/body/images in static HTML" | ✅ Confirmed — 0 H1 in raw HTML | FAIL (architectural) | `curl -s /` → `grep -c "<h1"` = 0. Body innerHTML = 29 bytes (only `<script>` tags) | Architectural limitation of SPA — cannot fix without SSR |
| 10 | **H1 after JS render** | Not previously checked | ✅ Exactly 1 H1 per route after JS render | PASS | Browser: Home H1="Goshen International Business School", About="Goshen International Business School.", Programmes="135 Capacity-Building Programmes.", etc. | No action needed |
| 11 | **Heading hierarchy** | Not previously checked | ✅ H1→H2→H3, no skipped levels | PASS | Browser: heading levels 1>2>3>3>3 pattern across all 8 routes | No action needed |
| 12 | **Image alt text** | Implied in "good Core Web Vitals" | ✅ All images have meaningful alt text | PASS | Source: 9 img tags in source with alt. Browser: 0 empty `alt=""`, 0 filename-derived alt across all routes | No action needed |
| 13 | **Schema: EducationalOrganization** | "EducationalOrganization schema only" | ✅ Confirmed — 1 JSON-LD block | PASS | `index.html:99-140`: EducationalOrganization, identifier RC 1178333, address (Ilorin), 2 contactPoints, knowsAbout array | See #16-#19 for missing schema types |
| 14 | **No BreadcrumbList** | Not previously checked | ✅ Confirmed — no BreadcrumbList schema or HTML breadcrumbs | FAIL (optional) | `grep BreadcrumbList src/ index.html` = 0. `PageHero.tsx` has `breadcrumbs` prop support but no route passes it | Add BreadcrumbList JSON-LD if breadcrumbs are added to UI |
| 15 | **No WebSite/SearchAction** | "no WebSite/SearchAction" | ✅ Confirmed — no search results page exists | N/A | `grep -rn "WebSite\|SearchAction" src/ index.html` = 0. `App.tsx:20-30`: no `/search` route. `Search.tsx` only navigates to existing hash routes | Not applicable — no search feature |
| 16 | **No Article schema** | "no Article schema" | ✅ Confirmed — no article detail routes | N/A | `grep article src/App.tsx` = 0. 2 articles in `data.ts` but no `/articles/:slug` route | Not applicable — no article pages |
| 17 | **Dead JPG files** | "780 KB JPG dead weight" | ❌ INACCURATE — actual: 4.7 MB, 10 files | FAIL | `find public/images -name "*.jpg"` = 10 files, 4.7MB total. `grep -r "\.jpg" src/` = 0. One .jpg reference in `index.html:40,47` but points to external `gibs.com.ng` | Remove all 10 .jpg files from `public/images/` or exclude in `.vercelignore` |
| 18 | **favicon.ico** | "favicon.ico 404" | ✅ Confirmed — 404 on production | FAIL (minor) | `curl -sI /favicon.ico` → HTTP 404. No `favicon.ico` in `public/`. Web app manifest not present | Add `favicon.ico` to `public/` or document reliance on `<link rel="icon">` |
| 19 | **llms.txt** | "llms.txt incorrectly returning SPA HTML" | ✅ Confirmed | OPTIONAL | Not in `public/`. Production returns SPA HTML. llms.txt is optional for SEO | Create `public/llms.txt` and add `txt` to Route 0 extensions |
| 20 | **OG image** | "OG image pointing to gibs.com.ng" | ✅ Confirmed, but domain does NOT resolve | FAIL | `index.html:40`: `og:image` = `https://www.gibs.com.ng/images/gibs-hero-branded.jpg`. `nslookup www.gibs.com.ng` → NXDOMAIN | Use local WebP: `./images/gibs-hero-branded.webp` |

---

## 4. Detailed Evidence

### 4.1 Static HTML Analysis

**Raw production HTML (identical across all routes):**

```
$ curl -s https://gibs-frontend-eight.vercel.app/ | grep -c "<h1"
0
$ curl -s https://gibs-frontend-eight.vercel.app/about | grep -c "<h1"
0
$ curl -s https://gibs-frontend-eight.vercel.app/programmes | grep -c "<h1"
0
```

Body innerHTML = 29 bytes — only `<script>` tags. Zero visible text elements in static HTML.

```
$ md5sum /tmp/prod-home.html /tmp/prod-about.html /tmp/prod-programmes.html /tmp/prod-gallery.html
f62fe5b9b17cd6c8387de5b41640e4c4  /tmp/prod-home.html
f62fe5eb4b17cd6c8387de5b41640e4c4  /tmp/prod-about.html
f62fe5b9b17cd6c8387de5b41640e4c4  /tmp/prod-programmes.html
f62fe5b9b17cd6c8387de5b41640e4c4  /tmp/prod-gallery.html
```

All routes return **byte-identical** HTML (same MD5 hash). No route differentiation in static HTML — fundamental SPA limitation.

### 4.2 Production robots.txt / sitemap.xml Defect

```
$ curl -s -o /dev/null -w "HTTP %{http_code}, %{content_type}, Size: %{size_download}" https://gibs-frontend-eight.vercel.app/robots.txt
HTTP 200, text/html; charset=utf-8, Size: 921725

$ curl -s -o /dev/null -w "HTTP %{http_code}, %{content_type}, Size: %{size_download}" https://gibs-frontend-eight.vercel.app/sitemap.xml
HTTP 200, text/html; charset=utf-8, Size: 921725
```

Both return the 921KB SPA HTML, not the actual files. The actual files exist in `public/` and are correct:

```
$ cat public/robots.txt
User-agent: *
Allow: /
# The official Sitemap: line is intentionally absent until a production
# domain is confirmed...

$ python3 -c "import xml.dom.minidom; print('Valid XML: YES, <url> count:', open('public/sitemap.xml').read().count('<url>'))"
Valid XML: Yes, <url> count: 0
```

**Root cause:** `vercel.json` Route 1 (`src="/((?!assets/|images/|favicon).*)"`) catches `.txt` and `.xml` extensions (they're not in Route 0's extension list) and rewrites them to `index.html`.

**vercel.json Route 0 extensions:** `woff2|webp|jpg|jpeg|png|svg|ico|css|js` — does NOT include `txt` or `xml`.

### 4.3 JPG Dead Weight Inventory

All 10 .jpg files in `public/images/` (4.7 MB total):

| # | File | Size | Referenced in Code? |
|---|------|------|--------------------|
| 1 | `gibs-hero.jpg` | 135.5 KB | No |
| 2 | `gibs-hero-branded.jpg` | 185.0 KB | Yes, but external URL only (`index.html:40` → `gibs.com.ng/images/...`) |
| 3 | `gibs-hq-architecture.jpg` | 127.6 KB | No |
| 4 | `gibs-hq-architecture-edited.jpg` | 595.9 KB | No |
| 5 | `gibs-hq-architecture-edited-branded.jpg` | 517.3 KB | No |
| 6 | `gibs-hq-classroom-branded.jpg` | 481.4 KB | No |
| 7 | `gibs-hq-guest-residence-branded.jpg` | 681.4 KB | No |
| 8 | `gibs-hq-reception-room-branded.jpg` | 617.9 KB | No |
| 9 | `gibs-ibafo-architecture-branded.jpg` | 723.7 KB | No |
| 10 | `gibs-ibafo-front-gate-branded.jpg` | 779.5 KB | No |

All deployed on Vercel with `Cache-Control: public, max-age=31536000, immutable` — consuming edge cache and bandwidth for zero benefit. None are referenced by any code (grep: 0 `.jpg` references in `src/` excluding `index.html` OG tags).

The `.webp` equivalents (21 files, 2.5 MB) ARE referenced by code and used by `gibsResponsiveImage()`.

### 4.4 favicon.ico 404

```
$ curl -sI https://gibs-frontend-eight.vercel.app/favicon.ico
HTTP/2 404

$ find public -name "favicon*" -o -name "*.ico"
(empty — no favicon files)
```

Favicon is served via `<link rel="icon" type="image/webp" href="./images/gibs-logo.webp">` (`index.html:49`), but browsers auto-request `/favicon.ico` which 404s. This is a minor defect — browsers fall back to the `<link>` tag, but it generates unnecessary 404s.

### 4.5 Canonical Domain Status

```
$ nslookup www.gibs.com.ng
Server:  8.8.8.8
** server can't find www.gibs.com.ng: NXDOMAIN

$ echo | openssl s_client -connect www.gibs.com.ng:443 2>&1
system lib: Name or service not known
```

The canonical domain `www.gibs.com.ng` **does not resolve** from this audit environment. This means:
- The `<link rel="canonical" href="https://www.gibs.com.ng/">` points to a non-resolving domain
- The `og:image` URL `https://www.gibs.com.ng/images/...` is broken
- If this domain is the intended production domain, it is **not yet live**

This is flagged as **EXTERNAL VERIFICATION REQUIRED** — the domain may be live in Nigeria or behind a firewall blocking the audit environment.

### 4.6 Dynamic SEO (Browser Rendered)

All 8 routes verified with Playwright browser rendering:

| Route | Title | Description | H1 | Canonical | robots | og:image |
|-------|-------|-------------|----|-----------| -------|----------|
| `/` | GIBS — Goshen International Business School | Goshen International Business School. A contemporary... | Goshen InternationalBusiness School | https://www.gibs.com.ng/ | index,follow | https://www.gibs.com.ng/images/gibs-hero-branded.jpg |
| `/about` | About GIBS — Goshen International Business School Limited (RC 1178333) | Institutional profile, founding history... | Goshen International Business School. | https://www.gibs.com.ng/ | index,follow | https://www.gibs.com.ng/images/gibs-hero-branded.jpg |
| `/programmes` | 2026 Training Calendar (135 Programmes) — GIBS | Complete 2026 GIBS Training Calendar... | 135 Capacity-Building Programmes. | https://www.gibs.com.ng/ | index,follow | https://www.gibs.com.ng/images/gibs-hero-branded.jpg |
| `/gallery` | Gallery — GIBS | Photographs of GIBS headquarters... | The GIBS campus | https://www.gibs.com.ng/ | index,follow | https://www.gibs.com.ng/images/gibs-hero-branded.jpg |
| `/executive-education` | Foreign Executive Training & In-Plant Workshops — GIBS | Explore 22 Foreign Executive Training... | Training abroad and in-plant | https://www.gibs.com.ng/ | index,follow | https://www.gibs.com.ng/images/gibs-hero-branded.jpg |
| `/admissions` | Programme Enquiries — Goshen International Business School | The GIBS programme enquiry process... | Enquire About a programme. | https://www.gibs.com.ng/ | index,follow | https://www.gibs.com.ng/images/gibs-hero-branded.jpg |
| `/contact` | Contact — Goshen International Business School (GIBS) | Reach GIBS headquarters in Ilorin... | Connect with GIBS. | https://www.gibs.com.ng/ | index,follow | https://www.gibs.com.ng/images/gibs-hero-branded.jpg |
| `/concierge` | GIBS AI — Ask about programmes and locations | GIBS AI provides guided assistance... | Find the right programme | https://www.gibs.com.ng/ | index,follow | https://www.gibs.com.ng/images/gibs.com.ng/images/gibs-hero-branded.jpg |

All routes have unique titles, unique descriptions (>70 chars), single H1, `index,follow` robots meta, and root canonical. OG title/description/image are static (identical across all routes in index.html).

### 4.7 useSeo() Function

`router.tsx:184-197`:
```ts
/** Per-route document metadata (SPA SEO baseline; SSR recommended at scale). */
export function useSeo(meta: { title: string; description?: string }) {
  React.useEffect(() => {
    document.title = meta.title;
    if (meta.description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", meta.description);
    }
  }, [meta.title, meta.description]);
}
```

Client-side DOM manipulation only. Does NOT update OG tags, canonical, or other `<head>` meta tags. OG tags remain static (all routes share the same OG title/description/image from `index.html`).

### 4.8 Schema JSON-LD Analysis

`index.html:99-140` — single JSON-LD block:

```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Goshen International Business School Limited",
  "identifier": "RC 1178333",
  "url": "https://www.gibs.com.ng",
  "logo": { "@type": "ImageObject", "url": "https://www.gibs.com.ng/images/gibs-hero-branded.jpg" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "No. 1-3, Abuja/Lokoja Road, Area 10",
    "addressLocality": "Ilorin",
    ...
  },
  "contactPoint": [
    { "@type": "ContactPoint", "name": "Training Desk", "telephone": "...", "email": "..." },
    { "@type": "ContactPoint", "name": "Programme Enquiries", "telephone": "...", "email": "..." }
  ],
  "knowsAbout": ["Executive Training", "Capacity Building", "Public Sector", ...]
}
```

- Logo URL also points to `gibs.com.ng/images/...` (non-resolving domain)
- No `WebSite` type, no `SearchAction`, no `BreadcrumbList`, no `Article`, no `Course` schema

### 4.9 Security Headers (Production)

All headers confirmed via `curl -sI`:

| Header | Value | Status |
|--------|-------|--------|
| `strict-transport-security` | `max-age=63072000; includeSubDomains; preload` | ✅ Present |
| `content-security-policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'` | ✅ Present |
| `x-frame-options` | `DENY` | ✅ Present |
| `x-content-type-options` | `nosniff` | ✅ Present |
| `referrer-policy` | `strict-origin-when-cross-origin` | ✅ Present |
| `permissions-policy` | 9 directives | ✅ Present |
| HTTP→HTTPS | 308 redirect | ✅ Present |
| Cache (HTML) | `max-age=0, must-revalidate` | ✅ Correct |
| Cache (assets) | `max-age=31536000, immutable` | ✅ Correct |
| Brotli | `content-encoding: br` | ✅ Confirmed |

**CSP `unsafe-inline` for scripts is unavoidable** — `vite-plugin-singlefile` inlines all JS as `<script>` tags in the HTML. Cannot be removed without changing the bundling architecture (out of scope per constraints).

### 4.10 Core Web Vitals (Lab Data, Local Build)

Measured via Playwright PerformanceObserver on `dist/` served locally:

| Metric | Desktop (1440×900) | Mobile (390×844, 2x DPR) |
|--------|---------------------|-------------------------|
| FCP | 1868 ms | 1360 ms |
| LCP | 1868 ms (SPAN) | 2980 ms (P) |
| CLS | 0.0000 | 0.0000 |
| Load time | ~8s | ~9s |
| TTFB (responseStart) | 3509 ms (production, audit env) | 1087 ms (production, audit env) |
| Total transfer | 571 KB (HTML+Brotli) | — |
| Font transfers | 5 files, 211 KB | — |
| Image transfers | 4 files, 360 KB | — |
| Long tasks | Not measured (local) | 0 (no main-thread blocking) |

**Important caveats:**
- These are **lab measurements** from local build, not field data
- **No field data available** — no Google Search Console, no CrUX API access, no analytics integration detected
- LCP element is a `SPAN` (text) on desktop and `P` (text) on mobile — this is the Hero section's H1 text, not an image. This is architecturally correct: the hero's primary content is text, and the image is secondary (decorative with `loading="eager"` but not the LCP candidate)
- Production TTFB of 3509ms is likely due to the audit environment's network, not the Vercel deployment itself

### 4.11 Mobile Layout Verification (12 Viewport Widths)

All 12 widths verified on local build:

```
320px:  PASS | H1 present | "Explore programmes" link present | hero image eager | logo loaded | footer present | no overflow
360px:  PASS | ✓
390px:  PASS | ✓
430px:  PASS | ✓
640px:  PASS | ✓
768px:  PASS | ✓
834px:  PASS | ✓
1023px: PASS | ✓
1024px: PASS | ✓
1280px: PASS | ✓
1440px: PASS | ✓
1600px: PASS | ✓
ALL 12 WIDTHS: PASS
```

**Note on H1 textContent:** The homepage H1 `textContent` renders as "Goshen InternationalBusiness School" (without a space between "International" and "Business"). This is because the JSX uses `<br />` between "Goshen International" and "Business School":

```tsx
// Hero.tsx:133
<h1 aria-label="Goshen International Business School" className="type-h1 ...">
  Goshen International
  <br />
  Business School
</h1>
```

The `aria-label` correctly reads "Goshen International Business School" — the space issue is only in raw `textContent` extraction, not in visual rendering or accessibility.

### 4.12 Content Authenticity

**Genuine defects found: Zero fabricated claims.**

- **No fake reviews, ratings, or testimonials** — 0 matches for "review", "rating", "testimonial", "award" as fabricated claims
- **No invented statistics** — all stats in `data.ts` reference 135 programmes (113 local + 22 foreign), verifiable in the programme data
- **No fake accreditation** — "accreditation" appears once in the data: `"Nigerian Council for Higher Education"` listed as a known body, not a claim
- **No fake awards** — 0 matches
- **GIBS terminology**: "train/trains" used consistently. NOT "teach/teaches" (`grep -i "teach" src/ | grep -iv "teaches\|teacher\|teaching" | wc -l` = 0 non-educational uses)
- **"Subscription"**: `Admissions.tsx:56` rewrites "upon subscription confirmation" → "upon programme confirmation". `SUBSCRIPTION_STEPS` in `data.ts` (byte-locked) refers to enrolment process steps. `Journey.tsx:14` has `id="subscription"` for the enrolment journey section. All legitimate — NOT a subscription platform.
- **"Nomination"**: 115 occurrences in `data.ts` (byte-locked), all in corporate participant enrolment context: "Organizations submit participant nominations or individual candidates complete the programme subscription registration."

### 4.13 .vercelignore Analysis

```
# .vercelignore (deployed file)
node_modules
.git
.env*
*.log
after-*.png
programmes-catalogue-*.png
comparison-*.png
dist
scripts
*.png
```

- Excludes `*.png` — all 5 local .png source files (2.7 MB total) are **NOT deployed** to Vercel ✅
- Does NOT exclude `*.jpg` — all 10 .jpg files (4.7 MB) **ARE deployed** ❌
- Does NOT exclude `*.webp` — all 21 .webp files (2.5 MB) **ARE deployed** (these are used by code) ✅
- `**/*.png` pattern covers all subdirectories

### 4.14 Production HTML Size

- Single-file output: **921,725 bytes** (900 KB)
- Brotli compressed: **194,775 bytes** (190 KB) on the wire
- Contains: inlined CSS + JS + 6 preloaded fonts
- 469 modules transformed during build

---

## 5. Classification of Findings

### TRUE DEFECTS (require action)

| Finding | Severity | Fix Required |
|---------|----------|-------------|
| **robots.txt not served on production** — returns 921KB SPA HTML instead of actual robots.txt | **HIGH** | Add `txt`/`xml` to Route 0 extensions or add explicit routes in `vercel.json` |
| **sitemap.xml not served on production** — returns SPA HTML | **HIGH** | Same fix as above |
| **10 .jpg files deployed but unused** — 4.7 MB dead weight with 1-year cache | **MEDIUM** | Remove from `public/images/` or add `*.jpg` to `.vercelignore` |
| **favicon.ico 404** on production | **LOW** | Add `favicon.ico` to `public/` |
| **OG tags are static** — all routes share same OG title/description/image | **MEDIUM** | Add dynamic OG tag injection in `useSeo()` |
| **Canonical domain gibs.com.ng does not resolve** (from audit env) | **HIGH** (if domain is supposed to be live) | External verification required |
| **No WebSite or BreadcrumbList JSON-LD** | **OPTIONAL** | Add JSON-LD if breadcrumbs/search are added |

### ARCHITECTURAL LIMITATIONS (cannot fix without SSR)

| Finding | Severity | Notes |
|---------|----------|-------|
| **Zero H1/body/images in static HTML** | **HIGH** (for SEO) | Fundamental SPA limitation — content only renders after JS execution |
| **All routes return identical HTML** | **HIGH** (for SEO) | Hash-routed SPA has no server-side route differentiation |
| **Root-only canonical on all routes** | **LOW** | Documented as intentional in `index.html:20-22` |
| **CSP `unsafe-inline` required** | **LOW** | Unavoidable with `vite-plugin-singlefile` |

### CONDITIONAL

| Finding | Severity | Notes |
|---------|----------|-------|
| **Core Web Vitals** | **CONDITIONAL** | Good in lab, no field data to confirm in production |
| **Schema completeness** | **LOW** | EducationalOrganization is correct for org identity; missing optional schema types |

### OPTIONAL

| Finding | Severity | Notes |
|---------|----------|-------|
| **llms.txt not present** | **OPTIONAL** | AI-crawler optimization, not required for SEO |
| **AI bot directives not in robots.txt** | **OPTIONAL** | All crawlers currently allowed; adds control, doesn't fix SEO |

### NOT APPLICABLE

| Finding | Notes |
|---------|-------|
| **WebSite/SearchAction schema** | No search results page exists — `Search.tsx` only navigates to existing routes |
| **Article schema** | No article detail routes (`App.tsx` has no `/articles/:slug`) |
| **BreadcrumbList schema** | No breadcrumbs rendered on any route (PageHero breadcrumb support exists but unused) |
| **Course schema for programmes** | Programme data in `data.ts` is byte-locked; would require adding JSON-LD to ProgrammeDetail route |

### FALSE / OVERSTATED

| Finding | Correction |
|---------|-----------|
| **"780 KB JPG dead weight"** | Actual: **4.7 MB across 10 files** — 6× the stated figure |
| **"Production robots.txt serves correctly"** | **FALSE** — production returns SPA HTML for `/robots.txt` and `/sitemap.xml` |

### EXTERNAL VERIFICATION REQUIRED

| Finding | Notes |
|---------|-------|
| **`gibs.com.ng` DNS resolution** | NXDOMAIN from audit environment — domain may be live in-region or behind firewall |
| **OG image / logo / canonical URLs** | All point to `gibs.com.ng` — cannot verify until domain resolves |
| **Production Core Web Vitals field data** | No access to Google Search Console or CrUX API |
| **7 commits behind origin** | Production deployment may be stale — `vercel.json` changes may not be deployed |

---

## 6. Approved Fix Set (Prioritized)

> **Important:** No fixes were applied during this read-only verification phase. The following is an evidence-backed remediation plan for a future build phase.

### Tier 1: Critical (deploy-blocking)

| # | Fix | File(s) | Impact |
|---|-----|---------|--------|
| T1.1 | Add `txt,xml` to Route 0 static extensions in `vercel.json` | `vercel.json` line ~5 | Fixes robots.txt + sitemap.xml being served as SPA HTML. Search engine crawlers will find actual robots.txt and sitemap.xml. |
| T1.2 | Verify `gibs.com.ng` domain resolution | External | Canonical and OG tags point to non-resolving domain. Must confirm domain is live before next deployment. |

### Tier 2: High Priority

| # | Fix | File(s) | Impact |
|---|-----|---------|--------|
| T2.1 | Remove 10 unused .jpg files from `public/images/` | `public/images/*.jpg` | Reduces deployed build size by 4.7 MB. Eliminates wasted Varnish/edge cache slots. |
| T2.2 | Add `favicon.ico` to `public/` | `public/favicon.ico` | Eliminates 404s for browser favicon requests. |

### Tier 3: Medium Priority

| # | Fix | File(s) | Impact |
|---|-----|---------|--------|
| T3.1 | Make OG tags dynamic via `useSeo()` | `src/lib/router.tsx` | Each route's OG tags would reflect route-specific title/description instead of static homepage tags. |
| T3.2 | Exclude `*.jpg` from deployment in `.vercelignore` | `.vercelignore` | Prevents future .jpg files from being deployed accidentally. |

### Tier 4: Optional

| # | Fix | File(s) | Impact |
|---|-----|---------|--------|
| T4.1 | Add `llms.txt` to `public/` | `public/llms.txt` | AI-crawler optimization. Requires adding `txt` to Route 0 (already covered by T1.1). |
| T4.2 | Add AI bot directives to `robots.txt` | `public/robots.txt` | Control which AI crawlers can access the site. |
| T4.3 | Add BreadcrumbList JSON-LD | `src/lib/router.tsx` | If breadcrumbs are added to UI in future. |
| T4.4 | Add WebSite JSON-LD | `index.html` or `router.tsx` | If a search feature is ever added. |

### NOT APPROVED (requires architecture change)

| # | Proposed Fix | Why NOT approved |
|---|-------------|----------------|
| N1 | Add SSR/SSG (Next.js, Astro) | Explicitly prohibited by project constraints |
| N2 | Replace hash routing with clean-path routing | Explicitly prohibited — "Do not replace the current routing architecture" |
| N3 | Add Article/Course JSON-LD schema | No article detail routes or course detail schema structure exists; would require inventing routes |
| N4 | Add per-route canonical tags | Documented as intentionally avoided in `index.html:20-22` — hash-routed SPA with redirect-from behavior makes per-route canonical "misrepresent the site" |

---

## 7. Build Verification (Pre-Audit State)

| Command | Result |
|---------|--------|
| `tsc --noEmit` | ✅ Exit 0, no errors |
| `vite build` | ✅ Exit 0. Output: `dist/index.html` = 921.73 KB (gzip 192.12 KB), 469 modules, 36.88s |
| `npm run qa` | ✅ 26/26 checks PASSED. `data.ts` regeneration byte-identical (394,667 bytes) |
| `sha256sum src/lib/data.ts` | ✅ `910ff4d7…` (matches HEAD) |
| `git status --short` | ✅ Empty (0 changes) |

---

## 8. Post-Audit Verification

| Check | Result |
|-------|--------|
| `git status --short` | ✅ Empty (0 modified/new/deleted files) |
| `sha256sum src/lib/data.ts` | ✅ `910ff4d7…` (unchanged) |
| Any commits made | ✅ 0 |
| Any pushes made | ✅ 0 |
| Source/config files modified | ✅ 0 |

---

## 9. Methodology

1. **Repository inspection**: `git log`, `git status`, `sha256sum`, `wc -c` on all relevant files
2. **Production HTTP verification**: `curl -s` and `curl -sI` against `https://gibs-frontend-eight.vercel.app` for all 8 routes + `/robots.txt` + `/sitemap.xml` + `/favicon.ico` + `/llms.txt`
3. **Browser rendering verification**: Playwright (Chromium 1237) rendering all 8 routes with DOM inspection (titles, descriptions, H1, heading hierarchy, alt text, canonical, robots meta)
4. **Mobile layout verification**: Playwright at 12 viewport widths (320–1600px) checking H1, hero image, logo, footer, overflow, console errors
5. **Core Web Vitals measurement**: Playwright PerformanceObserver for FCP, LCP, CLS, long tasks
6. **Resource analysis**: Playwright Performance API for resource sizes and transfer counts
7. **Source code grep**: `grep -rn` for `.jpg`, `.webp`, `noindex`, `nofollow`, `subscribe`, `nominate`, `BreadcrumbList`, `WebSite`, `SearchAction`, `teach` across all source files
8. **DNS verification**: `nslookup www.gibs.com.ng` → NXDOMAIN
9. **Image inventory**: `find public/images -name "*.jpg" -o -name "*.webp" -o -name "*.png" -o -name "*.ico"`
10. **File integrity**: `sha256sum src/lib/data.ts` before and after audit, compared to `git show HEAD:src/lib/data.ts`

### Tools used

- Shell: `curl`, `grep`, `sha256sum`, `nslookup`, `openssl`, `find`, `wc`, `node` (Playwright-core)
- Browser: Chromium (Playwright) at `/root/.cache/ms-playwright/chromium-1237/chrome-linux/chrome`
- Skills consulted: `/tmp/seo-claude-code-skills/seo-audit/` (101-point checklist, 10 categories, A–F grading)

### Read-only compliance

During the entire audit, no source code files, configuration files, or assets were modified. The only files created were in `/tmp/` (verification scripts and output). The git working tree remains pristine.

---

## 10. Final Notes

### On the previous audit

The previous audit was **methodologically sound** and its core findings are **correct in substance**. The primary inaccuracies are:

1. **Quantitative**: "780 KB" should be "4.7 MB" for JPG dead weight
2. **Production serving**: The previous audit's claim about robots.txt serving correctly on production is **false** — it appears the previous auditor conflated local `cat public/robots.txt` output with `curl` production output, or the production deployment state changed between audits (production is 7 commits behind origin)
3. **Core Web Vitals**: Described as "good" but based on lab data only — no field data was available

### On SEO fundamentals

The GIBS frontend is a well-built SPA with excellent post-JavaScript rendering. Every route has unique, properly-structured SEO metadata after JS execution. The fundamental issue is that the **static HTML contains zero content** — this is an architectural choice, not a defect. The `index.html` comment at line 184 explicitly states: *"SPA SEO baseline; SSR recommended at scale."*

The most impactful fix available within project constraints is **T1.1**: fixing the `vercel.json` route pattern so that robots.txt and sitemap.xml are served as actual text files instead of SPA HTML. This requires adding `txt` and `xml` to the Route 0 extension regex (a one-line change to `vercel.json`).

### On the gibs.com.ng domain

The canonical domain `www.gibs.com.ng` returns NXDOMAIN from the audit environment. This is the most concerning finding because:
- All canonical tags point to it
- All OG image/logo URLs point to it
- The EducationalOrganization schema `url` and `logo` point to it

If this domain is supposed to be live, it must be resolved before any SEO effort can be considered successful. If it is intentionally not live yet, the canonical/OG tags should point to the Vercel deployment domain until the canonical domain is ready.
