# PREMIUM DEPTH POLISH REPORT — GIBS Frontend

**Status: IMPLEMENTED — restrained cinematic depth, zero WebGL, no meaningful performance cost.**

Strategy: depth is **felt, not seen**. Everything below is transform/opacity-only, opportunistically applied to a *hierarchy* (hero strongest → cards → mostly-flat editorial), and fully disabled for coarse pointers and `prefers-reduced-motion`.

---

## What was added

| # | Effect | Where | Cost |
|---|---|---|---|
| 1 | **Ken Burns hero breathing** — scale 1.02→1.05 over 46s (60s on mobile, origin lower) | Homepage hero photograph | transform-only, compositor thread, `overflow-hidden` clips |
| 2 | **Film grain** 1.5% static SVG turbulence (no download, no JS) | Hero, interior page-heroes, full-bleed closes, framed campus feature, editorial card images | static paint, composited once |
| 3 | **Card tilt** — sub‑3° (2.25° actual) pointer-responsive `rotateX/rotateY` with 0.24s trailing ease + physical raise | `EditorialCard` (research/insights/related-article grids) | one passive `pointermove` per card, writes CSS vars, **zero React re-renders**, cached rect (no per-move layout reads) |
| 4 | **Card lighting** — 5% ivory radial `--mx/--my` highlight that follows the pointer; `:focus-within` for keyboard | same cards | CSS only |
| 5 | **CTA illumination** — top ivory highlight, hairline amber edge (rgba gold 0.16→0.26), dark contact edge, long soft pool; lifts 1px on hover, seats flat on press | every `btn-primary` | CSS only |
| 6 | **Shadow hierarchy** (L1 flat → L4 floating) — new `--shadow-card` / `--shadow-card-strong` tokens; page-body feature cards (Campus framed photo, ConciergeBand quote) demoted from `shadow-lift` → `shadow-card` | cards, programme "at a glance" + "indicative structure" panels | CSS only |

## Explicitly NOT done (per brief)
- No WebGL / three.js / canvas / shaders.
- No new dependencies (added `src/components/depth.tsx`, ~60 lines, React-hook only).
- No neon, no RGB, no huge blurred shadows, no glassmorphism spread (header/search/concierge glass was already the single sanctioned treatment — untouched).
- Programme rows, theme cards, FAQ, nav, and most editorial surfaces stay flat on purpose.

## Performance — before / after
- Bundle: **629.70 kB → 633.35 kB** (+3.65 kB), gzip **175.86 → 177.05 kB** (+1.19 kB, **+0.68%**). No new runtime libraries.
- Images unchanged; no extra network requests (grain is an inline SVG data URI, tiles at 180×180).
- Mobile/coarse: `@media (pointer: coarse)` strips tilt + spotlight; the hook attaches listeners only when `(pointer: fine) && not (prefers-reduced-motion: reduce)` — on phones it is fully inert (zero listeners).
- Reduced motion: `@media (prefers-reduced-motion: reduce)` disables Ken Burns (`animation:none`) and card tilt (`transform:none`); grain (static) remains.
- No scroll/pointer-driven React state; no forced reflow; passive listeners only.

## Verification (production build, served at :4173)
- `tsc --noEmit` → **0 errors**.
- Props actually take effect: Ken Burns `animation-name` active; tilt sets `--rx`/`--ry` exactly (`0.750deg` at 25% — verified); reduced-motion → `animation:none`; touch context → `.card-depth` `transform:none`; `.shadow-card` renders its layered box-shadow.
- Declutter verify (18 routes × 390/1440): **0 findings**.
- Full QA (22 routes × 11 widths, 320→1920): **0 console errors**; only findings are (a) the intentional scrollable Gallery chip row and (b) Ken Burns wrappers mid-scale flagged wide — **both confirmed non-issues**: document `scrollWidth === clientWidth` at 320/360/390/768/1920 (**overflow 0**), hero is `overflow-hidden`.
- 19 screenshots captured: `/tmp/shots-depth` (compare `/tmp/shots-before`).

## Decision-rule sweep (§22)
- Hero should feel expensive: ✔ (photographic, green light spills, breathes imperceptibly).
- Cards physical not gimmicky: ✔ (2.25°, 5% light).
- Nothing looks like a template / SaaS / game: ✔.
- No effect kept "because it looks impressive": grain at 1.5% is near-invisible by design; tilt range deliberately tiny.
- Cost-benefit: kept everything except the `shadow-lift` demotions, which were kept as *removals* (less = more).

Files changed: `src/index.css`, `src/sections/Hero.tsx`, `src/components/cards.tsx`, `src/components/PageHero.tsx`, `src/components/ui.tsx`, `src/sections/Campus.tsx`, `src/sections/ConciergeBand.tsx`, `src/pages/ProgrammeDetail.tsx`, `src/lib/router.tsx` (link ref forwarding), new `src/components/depth.tsx`.

**Ready for handoff — hero produces the strongest depth, everything else recedes.**