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
| `Cache-Control` | `public, max-age=0, must-revalidate` | Explicitly pins revalidation. See "Caching" below for why this is deliberately conservative. |

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

`Cache-Control: public, max-age=0, must-revalidate` is set on every response.

This is intentionally conservative. `vite-plugin-singlefile` emits stable,
**non-content-hashed** asset names — `/images/gibs-logo.webp`,
`fonts/fraunces-var-latin.woff2`, and so on. A deploy can replace the bytes
behind an unchanged filename, so any long-lived or `immutable` cache would
serve stale assets after release. `max-age=0, must-revalidate` costs a
conditional request per asset and buys correctness.

Raising this to `max-age=31536000, immutable` requires content-hashed filenames
first. That means dropping `viteSingleFile()` in favour of emitted external
assets, which changes the deployment assumptions the build is built around. Until
someone makes that decision, do not set a long cache.

The HTML entry point must never be cached for long regardless: it is the whole
application, and it changes on every deploy.

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
| `script-src` | `'self' 'unsafe-inline'` | `'unsafe-inline'` is **currently unavoidable**. `vite.config.ts` uses `viteSingleFile()`, so the production build emits the module as an *inline* `<script type="module">` in `dist/index.html`. Verified. |
| `style-src` | `'self' 'unsafe-inline'` | Also unavoidable today: the same plugin inlines CSS into a `<style>` tag, and `framer-motion` writes inline `style` attributes at runtime. |
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

1. **`'unsafe-inline'` is the price of the single-file build.** It meaningfully
   weakens `script-src`: an injected inline script would execute. Removing it
   requires either dropping `viteSingleFile()` in favour of hashed external assets
   (which changes deployment assumptions) or a per-build nonce, which
   `vite-plugin-singlefile` does not emit. **Do not remove it casually.**
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