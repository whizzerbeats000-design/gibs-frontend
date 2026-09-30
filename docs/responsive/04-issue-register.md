# Issue Register — Prioritised Findings

Evidence IDs map to `01-forensic-audit.md`. Priority: **P0** critical, **P1** major, **P2** consistency, **P3** engineering.

| ID | Priority | Type | Title | Evidence | Proposed fix | Regression risk |
|---|---|---|---|---|---|---|
| `A11y-A2` | **P1** | a11y | Heading order skips on `/programmes` | axe `heading-order` 3× (each vp); probe7: `seq=H1,H3…` 0×h2, 270 h3 | Add one semantic `h2` above the catalogue (e.g. wrap the results-summary / first grid section heading) so `H1→H2→H3` is monotone. Do **not** renumber the 270 card `h3`s (visual change); use a heading on an existing visible group (the sticky filter bar already carries a label semantics gap) | Low |
| `A11y-A1` | **P2** | a11y | axe contrast reads contrast correctly only at rest | 19 combos flagged, all false-positives from reveal-mid-opacity; at rest all ≥4.5 (see audit §3) | No code change. Document: axe runs must be delayed past reveal settle; add test-time disabled-motion gate for reliability | None (process) |
| `Font-A4` | **P3** | perf | Duplicate Google Fonts request | `index.html` `<link>` + `src/index.css` `@import`: both load Instrument Serif; css2 network shows 2 calls, 5 woff2 | Keep ONE request. Move the whole set (Fraunces, Space Grotesk, Instrument Serif, Inter, Libre Baskerville) into the `index.html` `<link>` and delete the `@import` from `src/index.css:1` (the link is already the singlefile-processed entry used by browsers; keep only what the CSS actually references: drop Inter if unused — verify first). Re-build + 160-run to confirm fonts still resolve and since `@import` was parsed by the CSS pipeline, confirm the built single-file still carries the needed faces | Low–med (font regression on test) |
| `Rhythm-R1` | **P3** | layout | Section rhythm not tokenised | `.section-y`/`.band-y` tokens exist but never consumed; 92 raw `py-{16,20,24,28,32,36}` across 23 files | Add Tailwind aliases in `index.css` (`@utility section-y { @apply py-(--section-y); }` swappable by modifier-friendly layout); migrate section-level wrappers to `.section-y`/`.band-y`. Per-batch verify no ox regressions | Low (visual only, measured) |
| `Nav-N3` | **P2** | interaction | Sticky subnav select vs desktop scroll-spy switch at exactly 1024 | detection at 390/768/1023 ✓, 1024+ ✓ | No change required; document as *contractual* breakpoint. Consider `lg:px` guard if 1024 nav overflows; verified ox=0 today | None |
| `Acc-01` | — | decision | Foreign-programme imagery shares hub images | imageSet per capital must not re-use a single hero across all foreign rows; audit confirm site-graph data is official, no fabrication | Investigation **declined** (no fabrication found; images are official hub visuals) | n/a |

## Decision log

| Decision | Result |
|---|---|
| A11y contrast "failures" | Investigated; all false positives due to axe running mid-reveal. Adopted "run axe at rest / reduced-motion" method. |
| Fraunces/Space Grotesk "missing" | Obsolete — both load via `index.html` link (audit §5). Only cleaning (`Font-A4`) remains. |
| `Rhythm-R1` | Confirmed as the one substantive refactor. Estimated migration is additive (aliases + re-export), batch per file, ox-checked. |
| Foreign imagery | Keep official images as-is (no invented content allowed by brief). |
| Heading fix approach | Prefer a real visible `h2` around the results area (allows SR to name the list) over an sr-only `<h2>`; decide during implementation against page layout. |

## Not-in-scope / rejected

- No new dependencies for horizontal-scroll or a11y; use current primitives.
- No conversion to any component/CDN library (stick to CSS utilities + current components).
- No dark mode, no theme toggling.
- No content changes; dataset is official GIBS.
- No change to hash routing, build pipeline, or single-file output contract.