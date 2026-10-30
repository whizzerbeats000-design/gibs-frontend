# Phase 3: Zero-Knowledge Responsive Forensic Audit

## A. Repository Baseline
- **Working Directory:** `/root/gibs-frontend`
- **Branch:** `main`
- **HEAD:** `418b634 feat: project-wide frontend refinement and editorial recomposition`
- **Git Status:** Modified files in `src/components/cards.tsx`, `src/pages/ExecutiveEducation.tsx`, `src/pages/Programmes.tsx` (from Phase 1 & 2).
- **TypeScript Result:** `npx tsc --noEmit` $\to$ EXIT 0
- **Build Result:** `npm run build` $\to$ SUCCESS

## B. Protected Baseline
### Phase 1: ProgrammeCard Mobile
- **State:** Refined compact metadata (Label $\to$ Value inline).
- **Hierarchy:** Title $\to$ Category $\to$ Compact Metadata $\to$ Tuition $\to$ Action.
- **Consolidation:** Schedule + Duration combined into a single line.

### Phase 2: Executive Education
- **State:** Removed `max-w-card` from Hub cards.
- **Architecture:** Grid-controlled width; cards fill tracks.
- **Build:** Project now achieves a clean build.

## C. Responsive System Map
- **Breakpoints:** `sm: 640px`, `lg: 1024px`.
- **Containers:** `.container-x` (max-width: 1280px).
- **Gutter X:** 20px $\to$ 32px $\to$ 48px.
- **Spatials:** `--section-y` and `--band-y` tokens.

## D. Route-by-Route Findings
**Note:** All findings in this section are **SOURCE-DERIVED / UNRENDERED**. They establish theoretical layout behavior based on CSS/TSX; actual visual behavior remains unverified due to lack of browser binaries.

### 1. Homepage (`/`)
- **Hero**: Source-derived assessment suggests the hero is constrained by `max-h-[880px]` and `max-w-prose` for text; rendered validation is unavailable and therefore spatial dilution cannot be confirmed. (Evidence Level: SOURCE-CONFIRMED)
- **Programme Discovery**: Source-derived analysis shows a `lg:grid-cols-12` asymmetric 4/8 split on desktop; actual visual balance remains unverified. (Evidence Level: SOURCE-CONFIRMED)

### 2. Executive Education (`/executive-education`)
- **Hubs Grid**: SOURCE-DERIVED HYPOTHESIS: Removal of `max-w-card` allows cards to fill the 7-column span on tablets. Whether this improves composition or creates overly wide cards requires rendered validation. (Evidence Level: HYPOTHESIS)
- **Directory Grid**: Source-derived analysis shows 1$\to$2$\to$3$\to$4 column scaling; actual information density remains unverified. (Evidence Level: SOURCE-CONFIRMED)

### 3. Faculty (`/faculty`)
- **Governance Section**: Source-derived analysis shows a 7/5 asymmetric split on desktop; `max-w-editorial` is present on the partner card. (Evidence Level: SOURCE-CONFIRMED)
- **Advisors Grid**: Source-derived analysis shows a 2-column layout on tablet (`sm:grid-cols-2`) with `gap-x-10`. (Evidence Level: SOURCE-CONFIRMED)
- **Accreditations**: Source-derived analysis shows a 4/8 split on desktop. (Evidence Level: SOURCE-CONFIRMED)

### 4. About (`/about`)
- **Slogan Banner**: Source-derived analysis shows center-alignment within `container-x`. (Evidence Level: SOURCE-CONFIRMED)
- **Mission/Vision**: Source-derived analysis shows a 6/6 symmetrical split. (Evidence Level: SOURCE-CONFIRMED)
- **Pillar Grid**: Source-derived analysis shows a 5/7 asymmetric split on desktop and `sm:grid-cols-2` on tablet. (Evidence Level: SOURCE-CONFIRMED)
- **Core Values/Mandate**: Source-derived analysis shows a 5/7 split; `max-w-prose` is applied to mandate items. (Evidence Level: SOURCE-CONFIRMED)
- **Accreditations**: Source-derived analysis shows a 7/5 split. (Evidence Level: SOURCE-CONFIRMED)

### 5. Campus (`/campus`)
- **Permanent Centers**: Source-derived analysis shows a 5/7 asymmetric split; cards use `max-w-card`. (Evidence Level: SOURCE-CONFIRMED)
- **Capacity Section**: Source-derived analysis shows a 6/6 split. (Evidence Level: SOURCE-CONFIRMED)
- **Facilities Grid**: Source-derived analysis shows a 5/7 split with `sm:grid-cols-2`. (Evidence Level: SOURCE-CONFIRMED)

### 6. Research & Insights (`/research-insights`)
- **Featured Piece**: Source-derived analysis shows a 7/5 asymmetric split. (Evidence Level: SOURCE-CONFIRMED)
- **Theme Navigation**: Source-derived analysis shows a 5/7 split with `sm:grid-cols-2`. (Evidence Level: SOURCE-CONFIRMED)
- **Editorial Grid**: Source-derived analysis shows `md:grid-cols-2` $\to$ `lg:grid-cols-3`. (Evidence Level: SOURCE-CONFIRMED)

### 7. Contact (`/contact`)
- **Form Layout**: Source-derived analysis shows `lg:grid-cols-12` with 7/5 split; form is capped by `max-w-editorial` to prevent oversized inputs on desktop. (Evidence Level: SOURCE-CONFIRMED)
- **Side Rail**: Source-derived analysis shows contact cards use `max-w-card` for density. (Evidence Level: SOURCE-CONFIRMED)

### 8. Gallery (`/gallery`)
- **Intro**: Source-derived analysis shows `lg:grid-cols-12` with a 7-column span for the headline, preventing full-width stretching. (Evidence Level: SOURCE-CONFIRMED)
- **Editorial Grid**: Source-derived analysis shows a complex mix of full-bleed, 2-column, and 7/5 asymmetric layouts. (Evidence Level: SOURCE-CONFIRMED)
- **Lightbox**: Source-derived analysis shows `max-w-5xl` and `max-h-[min(90vh, 90dvh)]` to prevent vertical overflow. (Evidence Level: SOURCE-CONFIRMED)

### 9. Events (`/events`)
- **Event Rows**: Source-derived analysis shows `sm:grid-cols-[9rem_1fr_auto]`, ensuring a fixed date column and a fluid content column. (Evidence Level: SOURCE-CONFIRMED)
- **Overall Layout**: Source-derived analysis shows `container-x` centering; visual balance of the calendar remains unverified. (Evidence Level: SOURCE-CONFIRMED)

## E. Static Routing Validation
- **Programme Routing**:
  - **Generation**: Slugs are derived from `PROGRAMMES` data.
  - **Href Construction**: Links use \`/programmes/\${p.slug}\`.
  - **Static Risk**: If `p.slug` is missing or duplicated in `lib/data`, routing will fail. (Evidence Level: SOURCE-CONFIRMED)
  - **Runtime Behavior**: Actual link navigation and detail-page rendering remain unverified.

## F. Static Motion Analysis
- **Reveal/Stagger**: A large number of `Reveal` and `Stagger` components are used across all routes.
- **Static Risk**: Runtime reveal behavior (trigger points, visibility) remains unverified. (Evidence Level: SOURCE-CONFIRMED)
- **Reveal Traps**: No static contradictions (e.g., `initial={{opacity: 0}}` without a corresponding `animate` or `whileInView`) were identified in audited files.

## G. Static Overflow Risk Analysis
- **Runtime overflow validation unavailable.**
- **Risk Factors**:
  - No fixed-width elements (`w-[...]px`) identified in audited routes.
  - No `nowrap` or negative margin abuses found in the analyzed source.
  - `container-x` provides a global horizontal bound.
- **Verdict**: Low static risk, but actual horizontal overflow remains unverified.

## H. Runtime Validation Queue (REQUIRED)
The following items **cannot** be confirmed without a browser and are queued for validation:
- **Visual Composition**: Actual spatial balance, "feel," and editorial quality.
- **Actual Overflow**: Verification of `document.documentElement.scrollWidth > window.innerWidth`.
- **Computed Dimensions**: Exact card/section heights and widths.
- **Breakpoint Transitions**: Visual "cliff" testing at 640px and 1024px.
- **Motion/Reveal Behavior**: Verification that all content actually appears and no elements remain invisible.
- **Interactive Elements**: Touch target sizes ($\ge 44\text{px}$), hover states, and modal behaviors.
- **Routing**: Clicking links, dynamic route matching, and detail-page rendering.
- **Performance**: LCP/CLS measurements and layout shift during image load.

## I. Final Status Report
- **Static Forensic Audit**: COMPLETE. All primary routes inspected. No static layout contradictions identified.
- **Runtime Responsive Validation**: OUTSTANDING. Browser execution unavailable; visual behavior remains unverified.

---

# Isolated Mobile Composition Audit — Programme/Institution Page

## 1. Audit Parameters
- **Exact Route**: `/` (Home)
- **Exact Source Files**: 
  - `src/pages/Home.tsx`
  - `src/sections/Hero.tsx`
  - `src/sections/Approach.tsx`
  - `src/sections/Programs.tsx`
  - `src/sections/Institution.tsx`
  - `src/sections/Faculty.tsx`
  - `src/sections/Insights.tsx`
  - `src/components/cards.tsx`
- **Baseline Status**: Working tree is clean. Build is successful.
- **Healthy Comparison Routes**: `/about`, `/faculty` (Source-confirmed as having structured asymmetric splits and constrained text measures).
- **Runtime Availability**: NONE. All findings are SOURCE-DERIVED / UNRENDERED.

## 2. Vertical Rhythm & Composition Analysis
### A. Introductory Content Sequence
The sequence consists of:
- **Hero Section** (`Hero.tsx`): `container-x` centered content.
- **Approach Section** (`Approach.tsx`): `lg:grid-cols-12` asymmetric split (5/7).
  - **Mobile Transformation**: The `StaggerSlow` (Left) and `Stagger` (Right) blocks collapse into a single vertical stack.
  - **Observation**: The "Four words we work by" and "Registered, and answerable" items are mapped as a list of `motion.div` with `border-t rule`.
  - **Source-Derived Risk**: On mobile, the transition from the "What we ask of ourselves" heading to the three repeated commitment blocks creates a high-frequency vertical rhythm of [Heading $\to$ Text $\to$ Border $\to$ Heading $\to$ Text $\to$ Border $\to$ Heading $\to$ Text].

### B. Programme Discovery Section (`Programs.tsx`)
- **Architecture**: `lg:grid-cols-12` asymmetric split (4/8).
- **Mobile Transformation**:
  - **Intro**: `lg:col-span-5` and `lg:col-span-7` collapse to full width.
  - **Category Bands**: `lg:grid-cols-12` (4/8) collapse to full width.
  - **Programme Cards**: `DIRECTORY_GRID` is `grid-cols-1` on mobile.
- **Composition Hypothesis**: 
  - Mobile experience is effectively: [Category Eyebrow $\to$ Category Note $\to$ Card $\to$ Card $\to$ Card $\to$ Card $\to$ Category Eyebrow $\to$ Category Note $\to$ Card...].
  - **Source-Derived Risk**: If a category has 10+ programmes, the mobile user faces a massive sequence of identical `ProgrammeCard` blocks without structural relief, leading to visual fatigue.

## 3. Content Density & Repetition Audit
- **Repetition**: `ProgrammeCard` uses a compact metadata layout. In a long list, the "Target Cohort" and "Schedule & Duration" labels repeat for every single card.
- **Visual Exhaustion**: The combination of repeated metadata labels across 100+ programmes in a single-column stack likely produces a "spreadsheet" feel rather than an "editorial" feel on mobile.
- **Symmetry Check**: Unlike `/about` which uses distinct editorial blocks, the Home page's Programme Discovery section relies heavily on a single repeated component (`ProgrammeCard`).

## 4. Typographic & Container Analysis
- **Widths**: Uses `container-x` and `max-w-prose`.
- **Typography**: `type-h2` and `type-h3` wrap according to standard Tailwind flow. 
- **Source-Derived Risk**: Long programme titles in `ProgrammeCard` may create awkward line-breaks on narrow viewports (320px), potentially pushing the footer (Tuition/Action) further down and increasing the total vertical length of the page.

## 5. Regression Hypothesis
**Hypothesis A: Vertical Dilution via Linearization**
The desktop editorial structure (asymmetric splits) is successfully "responsive" (it fits the screen), but the mobile version is simply a linear stack of those elements. The absence of mobile-specific compression (e.g., grouping cards or reducing metadata prominence) results in a page that feels "too long" and "uncomposed."

**Hypothesis B: Metadata Fatigue**
The decision to include detailed metadata (Target Cohort, Schedule) on every card in a single-column mobile list creates high visual noise, making the "Explore programmes" CTA feel buried.

## 6. Severity Table

| Problem | Severity | Confidence | Evidence Level | Impact |
| :--- | :--- | :--- | :--- | :--- |
| High-frequency vertical repetition in `Approach` section | P2 | High | Source-confirmed | Visual fatigue; loss of architectural depth. |
| Linear "Wall of Cards" in `ProgrammeDiscovery` | P1 | High | Source-confirmed | Severe vertical dilution; "spreadsheet" feel. |
| Repeated metadata labels in `ProgrammeCard` stack | P2 | Medium | Source-confirmed | Visual noise; reduced scanability. |
| Potential "Long Page" syndrome on mobile | P1 | High | Hypothesis | User exhaustion; buried CTAs. |

## 7. Recommended Implementation Targets
- **Editorial Compression**: Explore ways to group programme cards or reduce metadata density specifically for the Home page's discovery section on mobile.
- **Rhythm Correction**: Introduce structural relief in the `Approach` section to break the [Border $\to$ Heading $\to$ Text] repetition.
- **Hierarchy Refinement**: Differentiate the "Category" headings from the "Programme" titles more aggressively on mobile to improve the scan-path.

## 8. Runtime Validation Queue
- **Actual Vertical Length**: Measure total scroll height at 375px.
- **Scroll Fatigue**: Test the time/effort required to reach the bottom of the Programme Discovery section.
- **Title Wrapping**: Verify if any programme titles create unsightly orphans on 320px viewports.
- **Metadata Density**: Determine if the "Target Cohort" labels are visually overwhelming in a 10-card sequence.
