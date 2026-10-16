# GIBS Responsive Refinement — Implementation Plan

Audit-before-edit is satisfied: `00-project-map.md` (ground truth), `01-forensic-audit.md` (evidence), `03-responsive-contract.md` (spec) and `04-issue-register.md` (prioritised) are written. **No source edits have been made yet.** This plan is the required written plan before implementation, with acceptance criteria verified by the /tmp/opencode harness.

## Phases

### P1 — Accessibility conformance (`A11y-A2`)
- Goal: `/programmes` heading order is a monotone `H1→H2→H3…`.
- Work: add one visible `h2` above the catalogue that names the results area (the existing results-summary line is the natural host, e.g. "2026 Programme Catalogue"; keep content official). Do NOT renumber cards.
- Verify: heading sweep (`probe7.mjs`) shows `/programmes` `H1,H2,H3`; axe at rest shows 0 violations; 160-load overflow matrix unaffected.

### P2 — Consistency & interaction hardening
- Goal: no interaction breaks; documented breakpoints hold.
- Work: re-run interaction probe for subnav (390/768/1023/1024/1280), search, filters, concierge, gallery lightbox keyboard + touch (add a 920px run), contact validation. Tighten the concierge touch target only if a measured target is <44px.
- Verify: `interactions.mjs` expect 15/15; axe sweep clean at rest.

### P3 — Engineering cleanup
- `Font-A4`: consolidate to one Google Fonts request (move to `index.html` link; drop `@import` from `index.css`; drop Inter if unreferenced). Re-run font-load probe5 (all five true) + rebuild + 160-run.
- `Rhythm-R1`: add `.section-y`/`.band-y` utilities (tokens already in `@theme`); migrate section wrappers file-by-file; node-count check: remaining bare `py-…` on section wrappers = 0.
- `A11y-A1` (process): document axe-at-rest gate in the final report; no code change.
- After each file batch: `npm run build` (must pass, single-file size stable) + a reduced overflow sweep (the 6 core widths) before merging into the next batch.

## Acceptance gates (applied after each phase AND at final)

| Gate | Command / probe | Pass condition |
|---|---|---|
| Typecheck | `npx tsc --noEmit` | 0 errors |
| Build | `npm run build` | succeeds; `dist/index.html` present |
| Overflow matrix | `forensic-audit.mjs` | `TOTAL OVERFLOW/ERROR ROUTES: 0` (all 160) |
| Heading sweep | `probe7.mjs` / axe | no skips anywhere; `/programmes` now monotone |
| Interaction suite | `interactions.mjs` (fixed) | 15/15 PASS |
| Fonts | probe5 | all five families `document.fonts.load()` true |
| Reduced-motion | interactions reduced-motion block | cards visible immediately |

## Final report (written on completion)
Produce `docs/responsive/02-final-report.md` with sections A–F:
- **A** Summary & verdictes: NOT PRODUCTION READY / PRODUCTION READY WITH CONDITIONS / PRODUCTION READY.
- **B** Evidence summary (measurement tables before/after).
- **C** Each issue ID: evidence, resolution, regression result.
- **D** Responsive behaviour per viewport (from matrix + screens).
- **E** Accessibility results (axe rest / heading / keyboard / reduced-motion / target sizes).
- **F** Outstanding risks & follow-ups (including declined `Acc-01`, process checks).
- Then run the **Anti-Slop Delivery Gate** (brief's 6-skill verification) before closing.

## Constraints (from the brief)
- No source edits until this plan + docs were written (satisfied).
- No new dependencies without justification (none needed).
- Preserve brand/identity, light-only, official content, hash router, build.
- Evidence over claims: every final claim must trace to a harness output.