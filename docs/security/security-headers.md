# Security headers

Applies to the `headers` block in `vercel.json`. Routing (`rewrites`) is unchanged —
this document only covers headers.

> **Status: local configuration only.** These headers are declared in the repository
> but have **not** been deployed. Nothing here has been verified against the live
> production domain. Treat every value below as *intended*, not *active*.

## What is set, and why

| Header | Value | Reason |
| --- | --- | --- |
| `X-Content-Type-Options` | `nosniff` | Stops browsers re-interpreting a declared content type. The site ships `.webp` and `.woff2`; without `nosniff` a mis-typed response could be sniffed as script. Cheap, no downside. |
| `X-Frame-Options` | `DENY` | Clickjacking. Verified no embedding requirement: the app contains no `<iframe>`, `<embed>` or `<object>`, and nothing in the business model needs the site framed by a third party. `DENY` (rather than `SAMEORIGIN`) also blocks same-origin framing, which we do not use. |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Sends the full URL same-origin and origin-only cross-origin. Note: the Fetch spec always strips the fragment from a referrer, so hash-routed paths (`/#/programmes/...`) are not leaked even same-origin. |
| `Permissions-Policy` | see below | Disables powerful device APIs the site never uses. `payment=()` is deliberate: GIBS does not handle payments. |
| `Content-Security-Policy` | see below | **Enforced.** Promotion from report-only was evidence-gated — see "Promotion to enforcement" below. |
| `Cache-Control` | Stable files: `public, max-age=0, must-revalidate`; content-hashed files under `/assets/`: `public, max-age=31536000, immutable` | Stable URLs can receive updated bytes without a year-long client cache; only URL-versioned assets are immutable. See "Caching" below. |

### HSTS — not declared here, and why that is a known unknown

`strict-transport-security` is **not** set in `vercel.json`.

Vercel is *documented* as sending its own HSTS header on served traffic, but that
has **not been verified for the GIBS custom domain**, and an earlier version of
this document asserted a specific value (`max-age=63072000; includeSubDomains;
preload`) as though it were confirmed. It was not, and an assertion like that is
worse than an admission of ignorance.

Do not add HSTS here on the strength of this document. Verify it first:

```sh
curl -sI https://<official-domain>/ | grep -i strict-transport-security
```

If Vercel already sends a policy that includes `includeSubDomains` and
`preload`, leave it alone — duplicating the header risks a conflicting value.
If it sends nothing, adding `max-age=31536000` (without `includeSubDomains`,
because the subdomain inventory is unknown) is a reasonable first step. Adding
`preload` is a commitment that cannot be withdrawn quickly and should only
follow an explicit decision.

### Caching

Stable public files (`/images/*`, `/fonts/*`, `/favicon.ico`, `/robots.txt`,
and `/sitemap.xml`) receive `Cache-Control: public, max-age=0, must-revalidate`.
This includes the current stable image and font filenames and the generated SEO
files, which can all change at the same URL on a later deploy.

The only long-lived rule is scoped to `/assets/<name>-<hash>.<ext>` paths and
sets `Cache-Control: public, max-age=31536000, immutable`. The filename must
carry an 8-or-more-character version token. Since commit `5a3b363` the build
emits the application bundle and the stylesheet as **hashed external assets**
under `/assets/`, so the application JS and CSS now do rely on this rule. The
public images and fonts keep stable names and are served under
`must-revalidate` instead.

Generated HTML shells and fallback HTML use `public, max-age=0, must-revalidate`.
This avoids retaining an old application shell or metadata after a deploy.

### Permissions-Policy

```
accelerometer=(), camera=(), geolocation=(), gyroscope=(),
magnetometer=(), microphone=(), payment=(), usb=()
```

Each feature is explicitly `()`, which is the strongest value. If a future feature
genuinely needs one of these, remove that single entry rather than the whole header.

## Why each CSP directive

Directives were chosen from the **actual build**, not from a generic template.

| Directive | Value | Why this value |
| --- | --- | --- |
| `default-src` | `'self'` | Baseline. Nothing is loaded from a third party. |
| `script-src` | `'self' 'unsafe-inline'` | The build no longer inlines the application bundle: `dist/index.html` loads `<script type="module" src="/assets/index-<hash>.js">`. The only inline script is the one-line `no-js` → `js` class swap in `index.html`, which still needs `'unsafe-inline'`. See limitation 1 — this directive can be tightened to `'self'`. |
| `style-src` | `'self' 'unsafe-inline'` | The Tailwind output is an external stylesheet (`/assets/index-<hash>.css`), not an inlined `<style>` tag. `'unsafe-inline'` is still required for the 46-character no-js guard in `index.html` and because `framer-motion` writes inline `style` attributes at runtime. |
| `font-src` | `'self'` | All seven faces are self-hosted `woff2` under `/fonts/`. The `fonts.googleapis.com` reference at `src/index.css:15` is **inside a comment** recording why Google Fonts was removed — it is not a live request. Verified. |
| `img-src` | `'self' data:` | Images are local `/images/*.webp`. `data:` is required by the two inline `data:image/svg+xml` noise textures at `src/index.css:959` and `:994`. |
| `connect-src` | `'self'` | The app makes **zero** network requests today (no `fetch`, `XHR`, analytics, or beacons). **When a backend is added, its origin must be added here**, or XHR/fetch to it will be reported and later blocked. |
| `object-src` | `'none'` | No `<object>`/`<embed>` anywhere. |
| `base-uri` | `'self'` | Prevents `<base>` hijacking. |
| `form-action` | `'self'` | The enquiry form is JS-handled with no `action`; this constrains any future real submission to same-origin. It does **not** affect the `mailto:` links, which are anchors. |
| `frame-ancestors` | `'none'` | Modern equivalent of `X-Frame-Options`; kept alongside it for browsers that still honour only the header. |

**Deliberately omitted:** `report-uri` / `report-to` (no reporting endpoint exists —
inventing one would be worse than none), `upgrade-insecure-requests` (HSTS already
covers it and it would only add noise), and `manifest-src` / `worker-src` (no
manifest and no workers; verified 0 `blob:` and 0 `Worker` references).

## Known limitations — read before changing the policy

1. **`'unsafe-inline'` in `script-src` is now a one-line liability, not a
   structural necessity.** It meaningfully weakens `script-src`: an injected
   inline script would execute. The application bundle is an external hashed
   asset, so the only thing that still requires `'unsafe-inline'` is the
   one-line `document.documentElement.classList.replace('no-js','js')` script
   in `index.html` (with the matching 46-character `<style>` guard in the same
   file). Moving that swap into an external script, authorizing its exact inline
   source with a CSP hash, or dropping it would let `script-src` become `'self'`.
   A nonce is appropriate only when the server generates a unique value for each
   response and sets the matching policy; a per-build nonce is unsuitable for
   this static deployment. This changes `index.html` and the `vercel.json`
   CSP, and deployment configuration was not in scope for this pass, so it has
   **not** been changed. **Do not remove `'unsafe-inline'` from `vercel.json`
   without also removing the inline swap in `index.html`** — the class swap is
   what prevents the no-JS fallback from flashing.
2. **No violation reports leave the browser.** There is no `report-uri` /
   `report-to`, so violations surface in the DevTools console only. That is
   acceptable for a manual verification pass and useless for ongoing monitoring.
   If violations need collecting, that endpoint has to be built deliberately.
3. **`connect-src` will need updating** when a backend is introduced.
4. `<script type="application/ld+json">` in `index.html` is a non-executable data
   block, so it is not subject to `script-src`.
5. **Enforcement is now live in configuration, but not in production.** The header
   is only in the working tree; the deployed site predates it. See the status
   banner above.

## Promotion to enforcement — completed 2026-10-04

The policy was promoted from `Content-Security-Policy-Report-Only` to
`Content-Security-Policy` with **no directive changes**, after this verification:

The real `dist/` build was served locally with this exact policy value applied as
an **enforced** `Content-Security-Policy` (not report-only), then driven with
Chromium while listening for `securitypolicyviolation` events and console errors.

| Surface exercised | Result |
| --- | --- |
| All 16 routes (13 static, 3 dynamic, plus unknown-route 404) | rendered, correct `h1` and text, 0 broken images, `document.fonts.status === "loaded"` |
| Global search modal — open, type "leadership" | opened, returned 5 result links |
| Mobile nav sheet — open, Tab ×20 | opened, focus stayed contained |
| Concierge dialog — open, type a message | opened, input accepted text |
| Gallery lightbox | opened |
| Contact form | present, 5 fields, JS-handled submit path unaffected by `form-action` |

**Result: 0 CSP violations, 0 console errors.** The directive list was kept
byte-identical, so this is a mode change only.

**Residual risk, stated honestly:** this was verified against the real build
artifact served from localhost, not against Vercel. Vercel does not inject
first-party scripts into a static Vite output, and no Vercel Analytics or Speed
Insights script is present, so an unexpected violation at the edge is unlikely —
but it is unverified. Re-check the console on the production alias after the
deploy lands.

**If enforcement ever breaks the site**, the correct response is to fix the
offending resource, not to revert to report-only. Reverting silently restores a
policy that blocks nothing.
