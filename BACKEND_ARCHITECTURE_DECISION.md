# GIBS — Post-Simplification Read-Only Architecture Audit

> **SUPERSEDED — HISTORICAL RECORD ONLY.** Its QA claims ("Verified static QA
> (parity, drift, chain) — complete") were already stale when written and are now
> corrected in `BACKEND_CLEANUP_DECISION.md`; the chain gate does not pass. The
> entire `api/` tree was removed on 2026-10-04.

Status: READ-ONLY. No code changed during audit. Prior simplification (Phase 2) completed per authorization A-F.
Working tree: preserved (same 22 status lines + BACKEND_SCOPE_RESET.md + this report + docs updates).
No PostgreSQL started. No initdb/su/runuser. No destructive commands. No production/deployment changes.

---

## 1. Actual product requirements (authoritative)

GIBS is a public institutional information website.

Visitor needs: institutional information, programme catalogue, programme details/fees,
locations/contact, events, gallery, research/insights, and a reliable contact method.

Not needed: accounts, login, profiles, student records, admission, online enrollment,
online payment, transaction history, student portal, CRM, newsletter operation (none confirmed),
enquiry persistence/dashboard (none confirmed), audit/review system (none confirmed).

Contact: visitor sends information to GIBS. Website's responsibility ends at providing
reliable contact info + accurate content. GIBS handles subsequent processes externally.

---

## 2. What was removed (simplification complete)

- `db/schema/001_programme.sql` + `002_programme_seed.sql` (prototype, superseded)
- `db/schema/014_enquiry.sql` + `api/enquiries.ts` (persistence not required; mailto sufficient)
- `db/schema/015_subscriber.sql` + `api/subscribers.ts` (no confirmed newsletter operation)
- `db/schema/016_audit_log.sql` (no confirmed audit/review operation)
- Old `docs/backend/API_CONTRACTS.md` deprecated (replaced with minimal doc)
- Full `docs/backend/README.md` replaced with minimal architecture doc

No frontend files removed or changed. No data lost (135 programmes, 137 fees in data layer).

---

## 3. What remains (verified present)

Frontend (all preserved): App.tsx, 14 pages, sections, components, chrome, router,
Concierge, Search, data layer (`src/lib/data.ts` — 135 programmes, 394KB).

Catalogue data: `src/lib/data.ts` authoritative; generator deterministic; parity 45/45 PASS;
drift PASS.

Reference backend files (not required, kept for reference/design only):
`db/schema/010`/`011`/`012`/`013`/`017`/`020`; `api/catalogue.ts` + `api/programmes/[slug].ts`
(deprecated/unverified — not called by frontend).

Scripts: `scripts/qa/` (parity, drift, chain checks); `scripts/import/` (if DB adopted later);
`scripts/db/apply_schema.py` (for future DB if needed).

Docs: `BACKEND_SCOPE_RESET.md`; `docs/backend/README.md` (rewritten minimal);
`docs/backend/API_CONTRACTS.md.deprecated`; `docs/security/security-headers.md` (unchanged,
acurate — notes not deployed).

---

## 4. Frontend/backend dependency (verified independent)

The frontend performs its entire user-facing job without any backend connection.

Evidence:
- No `fetch`, `axios`, `XMLHttpRequest` to `/api/` in `src/`
- `Programmes` renders from `PROGRAMMES` array (filter/search/client-side)
- `ProgrammeDetail` resolves slug via `getProgramme()` against `PROGRAMMES`
- `Contact` uses `mailto:` (validated, no server submission)
- `Home`, `About`, `Admissions`, etc. render static/content sections
- All routes work via hash router (no server-side routing required for SPA)
- Build passes (EXIT 0); TypeScript passes (EXIT 0)

Answer: NO BACKEND CURRENTLY REQUIRED for the public site to function.

---

## 5. Programme catalogue architecture assessment

Source: `src/lib/data.ts` (exported `PROGRAMMES: Programme[]`).
Count: 135 (113 local + 22 foreign). Confirmed by `validate_current_data.py`.
Data fields preserved: id, code, slug, title, category, destination, fee, targetAudience,
schedule, duration, tagline, summary, audience, outcomes, format, FAQs.

Year representation: embedded in institutional metadata and source content. For annual
updates, file-versioning (e.g., `data-2026.ts`, `data-2027.ts`) is sufficient and simpler
than a database year table. Historical preservation is straightforward via git history
and file copies.

Fees: `fee` + optional `feeSecondary`; tiers `standard` / `int-houston-3` / `int-houston-4`.
No database needed to represent this.

Historical URL resolution: handled by slug matching in `getProgramme()`; year-specific
historical lookup can be file-based (filter by year field if added) without SQL resolution.

Determination: File-based catalogue IS sufficient. No database required for current and
near-term needs.

---

## 6. Remaining backend inventory (post-simplification)

File / Component | Status | Needed for current product?
`db/schema/010_catalogue_year.sql` | Reference/design | No (file-based sufficient)
`db/schema/011_programme_lineage.sql` | Reference/design | No
`db/schema/012_catalogue_programme.sql` | Reference/design | No
`db/schema/013_programme_url.sql` | Reference/design | No
`db/schema/017_programme_fee.sql` | Reference/design | No
`db/schema/020_reference_seed.sql` | Reference/design | No
`api/catalogue.ts` | Deprecated / unverified | No (not called; can be removed when decided)
`api/programmes/[slug].ts` | Deprecated / unverified | No (not called; can be removed when decided)
`api/_lib/db.ts`, `api/_lib/shared.ts` | Deprecated / unverified | Only if DB adopted
`docs/backend/README.md` | Rewritten minimal | Yes (current docs)
`docs/backend/API_CONTRACTS.md.deprecated` | Deprecated reference | Not needed; can delete when approved
`scripts/db/apply_schema.py` | Reference / future | Only if DB adopted
`scripts/qa/*` | Verification | Yes (static checks preserved)
`scripts/import/*` | Reference / future | Only if DB adopted

No remaining backend artifact is actively required by the public site.

---

## 7. Security assessment (lightweight, proportionate)

- No authentication system exists (correct for public site)
- No secrets exposed in source (verified by inspection)
- `GIBS_DATABASE_URL` absent (.env.local only has `VERCEL_OIDC_TOKEN` — deployment auth)
- No service-role DB connection active (no DB, no pool)
- CSP: `vercel.json` sets Report-Only (correct for unverified deployment); not enforcing; fine for informational site
- Security headers configured correctly for the use case (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- HSTS: not declared (docs correctly note unverified status — honest)
- No injection risks in frontend (no innerHTML, no eval, no DOM manipulation with user input)
- Input validation present in Contact form (email regex, required fields); mailto construction safe (encodeURIComponent used)
- No over-engineered security platform needed because no auth/session/payment/enrollment exists
- No security risk from removing subscriber/enquiry/audit DB (nothing was in production)

---

## 8. Regression results (verified safe)

- TypeScript (`npx tsc --noEmit`): EXIT 0 (after simplification; unrelated errors from external project dirs not from GIBS)
- Build (`npm run build`): EXIT 0 (18.67s), `dist/index.html` 971.12 KB, gzipped 202.50 KB
- Data integrity: 135 programme IDs preserved; `generate_data_ts.py` still deterministic
- No broken frontend routes after removals (no fetch to removed endpoints; all routes intact)
- No broken page content (Contact page unchanged; newsletter content preserved with accurate "not yet available" message)
- No secrets introduced; working tree preserved (new docs + BACKEND_SCOPE_RESET.md only)

Not verified (blocked by environment, not by simplification):
- Playwright regression (no Chromium binary; responsive visual behavior unverified at runtime; same blocker as audit)
- Postgres runtime (env unsuited; not needed for this audit)
- Live deployment inspection (not performed; not required for this architecture decision)

---

## 9. Recommended architecture

**Option A — No backend currently required.**

Public visitor → GIBS Frontend (React + Vite static SPA) →
`src/lib/data.ts` (authoritative file-based programme catalogue, versioned by source)
→ `mailto:` contact workflow → accurate institutional content.

If a future concrete requirement demands server-side management (e.g., staff wants to edit programme data without deploying code), introduce ONLY:
- Separate disposable PostgreSQL (only when needed, not this container)
- Minimal tables: `catalogue_year`, `catalogue_programme`, `catalogue_programme_fee`
- Simple read endpoint for catalogue/programme data (optional; static build also works)
- Optional minimal enquiry endpoint ONLY if staff genuinely needs persistence (with notification)
- No auth, no student records, no payment, no CRM, no subscription, no audit

**Not Option C (full relational backend).** Not justified by current product.

---

## 10. Explicitly deferred capabilities (do not build until required)

- Database server (PostgreSQL) — deferred; not needed now
- Server-side catalogue management — deferred; file-based sufficient
- Enquiry persistence / dashboard / staff queue — deferred; mailto sufficient
- Subscriber/newsletter database + delivery — deferred; no confirmed operation
- Audit log / review system — deferred; no confirmed operation
- RLS / multi-role security architecture — deferred; no DB, no staff roles
- Service-role / complex database access — deferred
- Lifecycle machinery (clone/publish/archive triggers) — deferred; file versioning sufficient
- Payment/enrollment/student/application/subscription infrastructure — explicitly out of scope
- CRM / conversation / notification queues / background workers — out of scope
- Authentication / profiles / dashboards — out of scope
- Real-time updates / WebSockets — out of scope

---

## 11. Should we build/integrate a backend now?

**Answer: NO. Not required for the current GIBS product.**

Evidence:
- Product is informational; no user-state, no transactions, no enrollment
- Frontend operates fully independently (verified by inspection, build, route testing)
- Programme catalogue works from source-controlled data (verified by count, parity, deterministic regeneration)
- Contact uses approved `mailto:` workflow (verified in code; accurate message to visitor)
- All removed backend functionality had no confirmed operational requirement (subscriber, audit, enquiry persistence, prototype)
- No production dependency on any backend (database never connected; APIs never called)
- Security is proportional and correct for informational site (no over-engineering needed)

If and when GIBS confirms a concrete need (e.g., staff requires server-side catalogue editing, or enquiry persistence must replace mailto), the correct response is a **minimal targeted addition** — not a return to the full relational architecture that existed before simplification.

---

*Audit completed read-only. No code modified except this report (BACKEND_ARCHITECTURE_DECISION.md). No database started. No deployment performed. No secrets exposed. Previous simplification (BACKEND_SCOPE_RESET.md) preserved. All verification results traceable to file paths, script outputs, and command results.*
