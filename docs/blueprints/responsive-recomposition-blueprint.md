# GIBS RESPONSIVE RECOMPOSITION IMPLEMENTATION BLUEPRINT

## 1. Target Responsive Model

The interface will move from a "linear expansion" model to an **Intentional Tiered Composition** model. Each tier represents a distinct structural strategy, not just a viewport width.

| Tier | Name | Range | Composition Strategy |
|---|---|---|---|
| **Tier 1** | Compact Mobile | 320–639px | **Forced Verticality**: High-density singular column. |
| **Tier 2** | Adaptive Tablet | 640–1023px | **Hybrid Density**: 2-column grids; moderate spacing. |
| **Tier 3** | Editorial Laptop | 1024–1279px | **Compositional Shift**: Introduction of 3/4 col grids; editorial offsets. |
| **Tier 4** | Primary Desktop | 1280–1535px | **Locked Composition**: Max-width constraints on components; fixed rhythm. |
| **Tier 5** | Ultrawide | 1536px+ | **Centric Lock**: Content locked at 1280px; bleeds for backgrounds only. |

---

## 2. Container & Width System

To solve "Spatial Dilution," the project will implement a hierarchical container system.

### 2.1 Page Level
- **`.container-x`**: `max-width: 1280px`. Remains the outer boundary.

### 2.2 Component Level (New Constraints)
We will introduce semantic width caps to prevent the "stretched billboard" effect.

| Utility | Target Width | Purpose |
|---|---|---|
| `.max-w-prose` | `68ch` (~650px) | Optimal reading measure for paragraphs and editorial body text. |
| `.max-w-card` | `420px` | Prevents cards from stretching too wide in 2-col grids. |
| `.max-w-editorial` | `800px` | For large focused sections (e.g., About mission statements). |

---

## 3. Desktop Composition Model

Desktop will no longer be "mobile + width." It will use an **Editorial Grid** approach.

### 3.1 General Page Layout
- **Strategy**: Shift from centered blocks to **Asymmetric Editorial Spans**.
- **Mechanism**: Implement a 12-column grid on `lg+`.
- **Rule**: Instead of `w-full` centered, use `lg:col-span-X` with `lg:col-start-Y`.
  - *Example*: A text block spans 7 columns, leaving 5 columns of intentional whitespace/accent.

### 3.2 Page-Specific Re-composition

#### /programmes & /executive-education (The Catalogue)
- **Current**: 2 columns at 1280px $\rightarrow$ oversized cards (~620px).
- **Target**: 
  - `lg` (1024px): 3 columns.
  - `xl` (1280px+): 4 columns.
- **Geometry**: 
  - Card Width: $\approx 300\text{--}320\text{px}$.
  - Gap: `gap-x-4 gap-y-3`.
- **Result**: Higher information density; faster scannability.

#### /about & /campus
- **Current**: 1 or 2 columns stretching to fill the container.
- **Target**: 
  - Use 12-col grid.
  - Limit text blocks to `.max-w-prose`.
  - Offset content to create "breathing room" rather than "empty space."

---

## 4. Typography Blueprint

Replace linear `clamp()` inflation with **Controlled Stepped Scaling**.

| Element | Mobile (T1) | Tablet (T2) | Desktop (T3-T5) | Constraint |
|---|---|---|---|---|
| **Type-H1** | 36px | 42px | 56px (CAP) | Stop growth at 1280px. |
| **Type-H2** | 28px | 32px | 40px (CAP) | Stop growth at 1280px. |
| **Type-H3** | 24px | 24px | 26px (CAP) | Maintain compact editorial scale. |
| **Body** | 15px | 16px | 17px (CAP) | Fixed cap to prevent "oversized" feel. |

**Implementation**: Update `src/index.css` utilities to use fixed upper bounds in `clamp()` or breakpoint-specific values.

---

## 5. Spacing Blueprint

Reduce "Desktop Drift" by tightening the vertical rhythm at larger widths.

| Tier | `--section-y` | `--band-y` | Gutter-X |
|---|---|---|---|
| **T1 (Mobile)** | 64px | 48px | 20px |
| **T2 (Tablet)** | 80px | 64px | 32px |
| **T3+ (Desktop)**| **72px** (was 88px) | 64px | 48px |

**Reasoning**: Reducing section padding from 88px to 72px on desktop restores the relationship between content blocks and prevents the page from feeling "fragmented."

---

## 6. Implementation Roadmap (Detailed)

### Phase 1: Structural Foundation
- **File**: `src/index.css`
- **Action**: 
  - Add `.max-w-prose`, `.max-w-card`, `.max-w-editorial` utilities.
  - Update `--section-y` for `min-width: 1024px` to `72px`.
  - Cap `clamp()` values for `type-h1`, `type-h2`, `type-h3`, `type-body`.

### Phase 2: Catalogue Density Shift
- **File**: `src/components/cards.tsx`
- **Action**:
  - Update `DIRECTORY_GRID` to: `grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-4.5 lg:grid-cols-3 xl:grid-cols-4 lg:gap-x-4 lg:gap-y-3`.
- **Verification**: Ensure `ProgrammeDirectoryStrip` remains readable at 3/4 columns.

### Phase 3: Page Re-composition
- **Files**: `src/pages/About.tsx`, `src/pages/Campus.tsx`, `src/pages/Home.tsx`
- **Action**:
  - Replace `div className="container-x"` with `div className="container-x grid lg:grid-cols-12"`.
  - Wrap long text in `.max-w-prose`.
  - Use `lg:col-span-X` to create asymmetric editorial layouts.

### Phase 4: Regression & Geometry Validation
- **Task**: Measure `getBoundingClientRect()` for Programme cards at 1280px and 1920px.
- **Target**: Card width $\le 320\text{px}$; Line length $\le 80\text{ch}$.
