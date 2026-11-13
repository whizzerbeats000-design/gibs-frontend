# GIBS RESPONSIVE DESIGN FORENSIC AUDIT

## Executive Finding

The GIBS interface appears more professional on mobile because it relies on **natural structural compression**. On mobile, the viewport width (320px–430px) acts as a strict constraint that forces content into a tight, singular vertical column, creating an accidental but effective visual hierarchy and high information density.

On desktop, the interface **expands without re-composing**. While it introduces some multi-column grids, it fails to implement an editorial layout strategy. The result is a "stretched billboard" effect where components maintain their internal padding and font scales but are placed on a much wider canvas (up to 1280px), leading to excessive whitespace, low information density, and a loss of the "composed" feel present on mobile.

**Root Causes:**
1. **Lack of Content-Width Constraints:** The `.container-x` max-width is 1280px, but internal components (like the Programme cards) stretch to fill available grid columns without an upper bound on their own width, leading to oversized cards on desktop.
2. **Linear Typography Scaling:** Typography uses `clamp()` functions that scale linearly with viewport width. While this prevents "tiny text," it causes headings to grow in a way that consumes excessive vertical space on desktop without adding structural value.
3. **Insufficient Density Shift:** The transition from 1 column (mobile) to 2 or 3 columns (desktop) is treated as a layout change rather than a density change. The "Programme Directory Strip" is a step in the right direction, but it only activates at `lg` (1024px), leaving a "dead zone" on tablets and small laptops.

---

## 1. Architecture

The project uses a **Token-Driven Responsive Architecture** based on Tailwind CSS v4.

- **Breakpoints:** Standard Tailwind defaults (`sm: 640px`, `lg: 1024px`) with some custom logic for `xl` (though mostly removed).
- **Layout Primitive:** `.container-x` (max-width: 1280px, centered).
- **Vertical Rhythm:** Managed via CSS variables (`--section-y`, `--band-y`) that increase in steps:
  - `< 640px`: 64px / 48px
  - `640px - 1023px`: 80px / 64px
  - `≥ 1024px`: 88px / 64px
- **Typography:** Uses a `clamp()` based fluid scale for H1, H2, H3, and Body.

---

## 2. Mobile Evidence

Mobile compositions feel tighter due to ** Forced Verticality**.

- **Measurement (approx. 390px):**
  - Content Width: ~350px (after 20px gutters).
  - Card Width: ~350px.
  - Line Length: ~30-40 characters (ideal for readability).
  - Vertical Rhythm: Constant 64px section padding.
- **Result:** The eye moves in a predictable, fast vertical scan. There is no "empty space" because the content occupies almost 100% of the available horizontal real estate.

---

## 3. Desktop Evidence

Desktop compositions lose quality due to **Spatial Dilution**.

- **Measurement (1440px):**
  - Container Width: 1280px.
  - Section Padding: 88px (vertical).
  - Programme Card Width (in 2-col grid): ~620px.
  - Line Length (in 2-col grid): ~70-90 characters (exceeding the ideal 68ch measure).
- **Result:** The "Programme Cards" become oversized tiles. The distance between the eye's start-of-line and end-of-line increases significantly, slowing down the scan and making the interface feel "sparse" and "amateur."

---

## 4. Breakpoint Evidence

| Transition | What changes | Measurement | Problem |
|---|---|---|---|
| 390 $\rightarrow$ 640 | 1 $\rightarrow$ 2 cols (some) | Gutter 20px $\rightarrow$ 32px | Initial expansion; still feels composed. |
| 640 $\rightarrow$ 1024 | Layout stays similar | Section-y 80px $\rightarrow$ 88px | Vertical growth without density increase. |
| 1024 $\rightarrow$ 1280 | Strip layout active | Container $\rightarrow$ 1280px | "Billboard" effect begins as cards stretch to fill 1280px. |

---

## 5. Typography Evidence

| Element | Mobile | Tablet | 1024 | 1280 | 1440 | 1920 |
|---|---:|---:|---:|---:|---:|---:|
| **Type-H1** | 36px | ~42px | ~50px | 56px | 56px | 56px |
| **Type-H2** | 28px | ~32px | ~36px | 40px | 40px | 40px |
| **Type-H3** | 24px | ~24px | ~25px | 26px | 26px | 26px |
| **Body** | 15px | ~16px | ~17px | 17px | 17px | 17px |

*Note: Values based on `clamp()` calculations in `index.css`.*

---

## 6. Spatial Evidence

| Component | Mobile | Desktop | Difference | Consequence |
|---|---:|---:|---:|---|
| Section Padding | 64px | 88px | +37.5% | Increased vertical "drift" between content. |
| Gutter X | 20px | 48px | +140% | Pushes content inward, but doesn't fix internal density. |
| Programme Card | 350px | ~620px | +77% | Card becomes a "tile"; information is spread too thin. |

---

## 7. Grid Evidence

| Page | Mobile | Tablet | Desktop | Problem |
|---|---|---|---|---|
| /programmes | 1 col | 2 col | 2 col (Strips) | The "Strip" layout fixes width but only at `lg`. |
| /about | 1 col | 1 col | 2 col | Grid items stretch to fill 50% of 1280px. |
| /campus | 1 col | 2 col | 4 col | 4-col grid on 1280px creates very wide, empty cards. |

---

## 8. Programme Catalogue

- **Total Programmes:** 135.
- **Columns (Desktop):** 2 (using `ProgrammeDirectoryStrip`).
- **Card Width:** ~620px.
- **Observation:** While the `ProgrammeDirectoryStrip` is more dense than the `ProgramRow`, it still suffers from excessive width. A 620px wide strip for a simple "Identity | Schedule | Fee" layout creates massive amounts of unused horizontal space.
- **Conclusion:** It behaves as a **collection of oversized marketing cards** rather than a dense institutional directory.

---

## 9. Root Cause Tree

DESKTOP FEELS AMATEUR
├── LACK OF COMPOSITIONAL DENSITY
│   ├── Container expands to 1280px without internal width caps
│   └── Grid columns are too few for the available width (e.g., 2 cols at 1280px)
├── VERTICAL OVER-EXPANSION
│   ├── Section padding grows linearly (64px $\rightarrow$ 88px)
│   └── Typography `clamp()` increases vertical footprint of headings
└── LOSS OF HIERARCHY
    └── Everything scales up; nothing remains "small" or "detailed" to provide contrast

---

## 10. Severity

### P1
- Programme catalogue density is too low on desktop.
- Core pages (/about, /campus) lack an editorial grid (e.g., 12-col system with specific span constraints).

### P2
- Linear typography scaling leads to oversized headings on wide screens.
- Section vertical padding is too aggressive on desktop.

---

## 11. Recommended Responsive Architecture

1. **Container Strategy:** Maintain `max-width: 1280px` but introduce **Component-Level Max-Widths**. No card or text block should exceed 70-80ch unless it's a deliberate full-width feature.
2. **Density Shift:**
   - Mobile: 1 col.
   - Tablet: 2 col.
   - Desktop: 3 or 4 col for catalogue items, NOT 2 oversized columns.
3. **Typography Scale:** Replace linear `clamp()` with a **Stepped Scale** at breakpoints. Stop growth at 1280px to prevent "poster" feel.
4. **Grid Strategy:** Adopt a strict 12-column grid for page layouts. Use offsets and varying spans (e.g., 5 col content + 7 col whitespace/accent) to create an editorial feel rather than centered blocks.
5. **Ultrawide Behaviour:** Content must strictly stop at 1280px. Backgrounds can bleed, but the "composition" must remain locked.

---

## 12. EXACT FILES RESPONSIBLE

- **File:** `src/index.css`
  - **Component:** `.container-x`
  - **Relevant lines:** 313-315
  - **Observed behaviour:** `max-width: 1280px` is the only constraint.
  - **Root cause:** No internal constraints on child component widths.

- **File:** `src/index.css`
  - **Component:** `@utility type-h1` through `type-body`
  - **Relevant lines:** 249-306
  - **Observed behaviour:** Use of `clamp()` with `vw` units.
  - **Root cause:** Typography grows too large on desktop.

- **File:** `src/components/cards.tsx`
  - **Component:** `DIRECTORY_GRID`
  - **Relevant lines:** 25-27
  - **Observed behaviour:** `lg:grid-cols-2`
  - **Root cause:** Two columns at 1280px creates oversized, low-density strips.

---

## 13. IMPLEMENTATION PLAN

### Phase 1 — Structural Corrections
- **Files:** `src/index.css`
- **Problem:** Unconstrained component expansion.
- **Change:** Introduce `.max-w-prose` and `.max-w-card` utilities.
- **Expected Effect:** Content stops stretching; whitespace becomes intentional.

### Phase 2 — Responsive Corrections
- **Files:** `src/components/cards.tsx`
- **Problem:** Low density in catalogue.
- **Change:** Update `DIRECTORY_GRID` to `lg:grid-cols-3` or `xl:grid-cols-4`.
- **Expected Effect:** Information density increases; scan speed improves.

### Phase 3 — Density Corrections
- **Files:** `src/pages/About.tsx`, `src/pages/Campus.tsx`
- **Problem:** Centered blocks feel like "stretched mobile".
- **Change:** Implement 12-col grid spans (e.g., `lg:col-span-7` for text, `lg:col-span-5` for empty/image).
- **Expected Effect:** Editorial composition replaces linear stacking.

### Phase 4 — Typography Corrections
- **Files:** `src/index.css`
- **Problem:** Oversized headings.
- **Change:** Cap `clamp()` upper bounds or switch to breakpoint-based sizes.
- **Expected Effect:** Refined, professional typographic scale.

### Phase 5 — Dimensional/Premium Refinement
- **Files:** `src/index.css`
- **Problem:** Vertical drift.
- **Change:** Reduce `--section-y` on desktop from 88px to 72px.
- **Expected Effect:** Tighter vertical rhythm.

### Phase 6 — Regression Validation
- **Task:** Audit all 19 viewports again using DOM geometry.
- **Goal:** Confirm no "orphans" in grids and that line lengths stay under 80ch.
