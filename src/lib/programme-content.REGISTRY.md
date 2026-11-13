# GIBS Programme Content Requirements Register

> Authoritative inventory of the **supplementary content layer** that sits in
> front of the byte-locked catalogue (`src/lib/data.ts`). This register is the
> single source of truth for *what* topic-specific content exists, *what* its
> approval state is, and *what* is still required before any new copy reaches a
> published page.

- **Catalogue source (byte-locked, do not edit):** `src/lib/data.ts`
  - SHA-256: `910ff4d75ad3110aa3062e0fbc3e6ea73074d0004a53780c35a961cef64dbde7`
- **Supplementary content layer:** `src/lib/programme-content.ts`
- **Generator (static HTML + JSON-LD + sitemap + llms.txt):** `scripts/seo-gen.mjs`
- **Gate (client + static parity):** `scripts/qa/content_quality.cjs` (`npm run qa:content`)
- **React rendering:** `src/pages/ProgrammeDetail.tsx`, `src/pages/Programmes.tsx`

## 1. Status-gate architecture (read this first)

Every record carries an explicit `status`:

| Status | Meaning | May render in published output? |
|---|---|---|
| `approved` | Verified against a GIBS syllabus / subject-matter owner. | **Yes** — into the static HTML shell, JSON-LD, sitemap, llms.txt, and the React page. |
| `pending-verification` | Subject-specific draft written from public-domain sector knowledge; **not yet** confirmed against a GIBS syllabus. | **No** — withheld everywhere; page falls back to the data.ts catalogue values. |
| `draft` | Unusable / placeholder. | **No.** |

The gate is enforced in **three** places, identically:

1. **`scripts/seo-gen.mjs`** — `applyContent(programme, contentByCode.programmes)` returns a record only when `status === 'approved'`; `generateStaticBody` (catMatch branch) renders a category intro only when `catIntroRec.status === 'approved' && catIntroRec.intro`.
2. **`src/pages/ProgrammeDetail.tsx`** — `approvedContent(programme)` returns a record only when approved.
3. **`src/pages/Programmes.tsx`** — `approvedCategoryIntro(category)` returns a record only when approved.

**Hard guarantee:** `npm run qa:content` fails the build if any `pending-verification` or `draft` token appears in any `.html`, `.xml`, or `.txt` file in `dist/`. Today (all content `pending-verification`) the published static output contains **zero** such tokens — pages render the verified catalogue values, so there is no regression and no unverified claim is published.

> The status gate was **positive-proven** with a fully-reverted mutation test: approving a single record (with a unique marker string) caused the marker to appear in the body `<p>`, the `<meta name="description">`, and the JSON-LD `Course.description`; reverting restored the generic line. The same test on a category intro confirmed the intro `<p>` swaps from the generic line to the approved intro. Drafts are withheld in every case.

## 2. Per-programme content proposals (10 seeded)

A first batch of 10 subject-specific proposals has been authored (5 "weakest"
+ 5 representative). **All are `pending-verification`** — they are written from
the public domain knowledge of each subject area and **must be verified against
a GIBS syllabus before promotion to `approved`**. No faculty names, no CPD
credits, no employment-outcome claims, no invented case studies are included.

| Code | Title (catalogue) | Topic area | Outcomes focus | Status |
|---|---|---|---|---|
| GIBS-LOC-001 | Advanced Public Speaking & Presentation Skills | Executive communication | Briefing, presence, hostile Q&A, slide architecture | pending-verification |
| GIBS-LOC-021 | Conflict Resolution and Negotiation | Organisational conflict | Interest-based negotiation, de-escalation, mediation | pending-verification |
| GIBS-LOC-035 | Telecom & Utilities Regulation | Sector regulation | Licensing, spectrum, USP, QoS, cross-subsidy | pending-verification |
| GIBS-LOC-046 | Project Planning and Management | Project delivery | Work breakdown, risk, stakeholder, PMO | pending-verification |
| GIBS-LOC-062 | Strategic Planning and Policy Analysis | Public-sector strategy | Evidence-based policy, KPI dashboards, foresight | pending-verification |
| GIBS-LOC-076 | Oil & Gas Sector Operations | Hydrocarbon value chain | Upstream/midstream/downstream, local content, fiscal regime | pending-verification |
| GIBS-LOC-079 | Oil & Gas Sector Operations (advanced) | Hydrocarbon value chain | Advanced upstream economics, project finance | pending-verification |
| GIBS-LOC-096 | Pension Management | Pension regulation | RSA/NSITF/PFDSA, funding, risk, PFRDA compliance | pending-verification |
| GIBS-LOC-101 | Advanced Public Speaking & Presentation Skills | Executive communication | (distinct sibling module of LOC-001) | pending-verification |
| GIBS-LOC-003 | Strategic Planning and Policy Analysis (beginner) | Public-sector strategy | (entry-level sibling of LOC-062) | pending-verification |

Notes:
- 5 weakest (highest templated-content risk): LOC-001, LOC-021, LOC-046, LOC-062, LOC-076.
- 5 representative (span the local/foreign and structural variety): LOC-035 (regulation), LOC-046 (project mgmt), LOC-062 (strategy), LOC-076 (oil&gas), LOC-096 (pension).
- Related-progression links are declared in `relatedSlugs` and validated by
  `qa:content` (every slug resolves to a catalogue programme).

## 3. Category-page introductions (15 seeded)

Category pages currently carry only an H1 + programme list (thin SEO). A
domain-grounded introduction (150–250 words, public-sector knowledge) has been
authored for **all 15** catalogue categories. **All 15 are `pending-verification`**
and are withheld until GIBS verifies them against the curriculum for each area.

| Category | Status |
|---|---|
| Accounting and Financial Management | pending-verification |
| General Administration and Management | pending-verification |
| Telecom & Utilities Regulation | pending-verification |
| Consumer Protection & Utilities | pending-verification |
| Environmental Sustainability & Management | pending-verification |
| Oil & Gas Sector | pending-verification |
| Secretarial Administration & Management | pending-verification |
| Capital Market & Securities Management | pending-verification |
| Information Technology Workshops | pending-verification |
| Legal & Legislative Studies | pending-verification |
| Power & Energy Sector | pending-verification |
| Maritime & Transportation | pending-verification |
| Pension Management | pending-verification |
| Special Executive Training | pending-verification |
| Foreign Executive Training | pending-verification |

`qa:content` asserts every intro resolves to a real `PROGRAM_CATEGORIES` entry
in `data.ts`, and that any *approved* intro is present, non-templated and unique.

## 4. Pending category corrections (approval-gated, not applied to data.ts)

The audit confirmed **10** programmes whose catalogue `category` is
mis-filed. These are **not** edited in `data.ts` (byte-locked). They are recorded
in `scripts/qa/content_quality.cjs` as `PENDING_CATEGORY_CORRECTIONS` and will be
applied by `seo-gen.mjs` + the React category page behind an
`APPLY_CATEGORY_CORRECTIONS` flag once an operator authorises them.

| Programme | From (current) | To (correct) |
|---|---|---|
| GIBS-LOC-005 | CSR | General Administration and Management |
| GIBS-LOC-035 | Telecom Beginners | Telecom & Utilities Regulation |
| GIBS-LOC-039 | Telecom & Utilities Regulation | General Administration and Management |
| GIBS-LOC-043 | Consumer Protection | Information Technology Workshops |
| GIBS-LOC-044 | Consumer Protection | Information Technology Workshops |
| GIBS-LOC-076 | Power & Energy Sector | Oil & Gas Sector |
| GIBS-LOC-077 | Environmental Mgmt | Environmental Sustainability & Management |
| GIBS-LOC-083 | Trainer's Workshop | General Administration and Management |
| GIBS-LOC-096 | Pension Management | General Administration and Management |
| GIBS-LOC-099 | Office Management | Pension Management |

Borderline moves (5) and the 135/135 verification baseline are documented in
`scripts/qa/content_quality.cjs`.

## 5. How to promote content to `approved`

1. Open `src/lib/programme-content.ts`.
2. For the target record (programme `code` or category name), change
   `status: "pending-verification"` to `status: "approved"`.
3. Confirm the `intro`/`summary`/`outcomes`/`structure`/`faqs`/`source`/`relatedSlugs`
   fields are final, topic-specific (non-templated) and accurate.
4. Run `npm run qa:content`. The gate will FAIL if the approved record:
   - reproduces a generic outcome set, or
   - duplicates another approved outcome set/summary, or
   - references a code/slug not in `data.ts`.
5. Run `npm run build`. Regenerated shells now contain the approved copy in the
   `<p>` summary, the `<meta name="description">`, and the JSON-LD `Course`
   record — consistently and from the same resolved value.

No other file needs editing for a single programme: `seo-gen.mjs`,
`ProgrammeDetail.tsx`, `Programs.tsx` and `llms.txt` all read the layer
through the `approvedContent` / `approvedCategoryIntro` gate.

## 6. Current baseline (as shipped)

- 135/135 catalogue summaries templated; 2 distinct outcome sets (113 local,
  22 foreign); 0 faculty attributions in `data.ts`.
- Supplementary layer: **10** programme records + **15** category intros, all
  `pending-verification` → **0 approved → 0 topics replaced in published
  output** (no regression; no unverified claims).
- 10 category corrections recorded (not yet applied).
- Duration gate: 135/135 scanned, unknown durations = 0.
- `sha256sum src/lib/data.ts` = `910ff4d75ad3110aa3062e0fbc3e6ea73074d0004a53780c35a961cef64dbde7` (locked).
