# GIBS — Backend Scope Reset & Minimal Architecture Plan

> **SUPERSEDED — HISTORICAL RECORD ONLY.** The inventory below is stale: it lists
> `db/schema/001,002,014,015,016` and `api/enquiries.ts`, `api/subscribers.ts`,
> which have since been deleted, and the whole `api/` tree was removed on
> 2026-10-04. Current facts: `BACKEND_CLEANUP_DECISION.md`.

Status: AUDIT + PLANNING ONLY. No backend code changed. No database started.
Working tree preserved. No destructive commands used.

---

## A. Actual Product Definition (authoritative)

GIBS is a public institutional information website.

Primary purpose: Visitors read accurate information about GIBS, discover programmes,
view details/fees, learn about the institution, view research/events/gallery, and
contact GIBS.

NOT: student portal, SaaS, admission system, payment platform, CRM, or
authenticated user platform.

Users do NOT need: accounts, profiles, dashboards, student records, online
enrollment, online payment, transaction history, applications tracking, or
conversation management.

GIBS handles enrollment/payment outside the website.

---

## B. Current Backend Inventory (every artifact verified)

| Path | What it does | Source evidence |
|---|---|---|
| db/schema/001_programme.sql | Prototype table (legacy) | 13925 bytes, never applied per README |
| db/schema/002_programme_seed.sql | Prototype seed | 732KB, never applied per README |
| db/schema/010_catalogue_year.sql | Annual catalogue dimension | 5336 bytes |
| db/schema/011_programme_lineage.sql | Cross-year continuity | 3896 bytes |
| db/schema/012_catalogue_programme.sql | Programme per year | 12092 bytes |
| db/schema/013_programme_url.sql | URL slug management | 8308 bytes |
| db/schema/014_enquiry.sql | Enquiry persistence | 10080 bytes |
| db/schema/015_subscriber.sql | Subscriber storage | 2977 bytes |
| db/schema/016_audit_log.sql | Audit log | 6707 bytes |
| db/schema/017_programme_fee.sql | Fee tiers | 6902 bytes |
| db/schema/018_lifecycle_functions.sql | Clone/publish/archive | 29103 bytes |
| db/schema/019_rls_policies.sql | RLS deny-by-default | 16416 bytes |
| db/schema/020_reference_seed.sql | Categories + destinations | 9507 bytes |
| api/catalogue.ts | GET /api/catalogue | Vercel serverless; reads DB; 4440 bytes |
| api/enquiries.ts | POST /api/enquiries | Validation + persistence + duplicate guard; 7345 bytes |
| api/subscribers.ts | POST /api/subscribers | Duplicate/reactivate; 3949 bytes |
| api/programmes/[slug].ts | GET /api/programmes/:slug | Historical resolution; 6020 bytes |
| api/_lib/db.ts | PG pool + query | 1297 bytes |
| api/_lib/shared.ts | Validation/CORS/rate limit | 3675 bytes |
| scripts/db/apply_schema.py | Migration applier (psql-based) | ~38KB, never executed |
| scripts/db/provision_roles.sql | Role provisioning script | 7340 bytes |
| scripts/import/_programme_source.py | Source-to-schema mapping | 11KB |
| scripts/import/export_snapshot.js | Snapshot export | 3KB |
| scripts/import/programmes_to_sql.py | SQL import | 8KB |
| scripts/qa/parity_check.py | Static parity (prototype) | 18KB; 45/45 PASS |
| scripts/qa/generator_drift_check.py | Regeneration check | 4KB; PASS |
| scripts/qa/schema_chain_check.py | Schema chain (010-020) | 18KB; 201/201 PASS |
| scripts/qa/regression.mjs | Playwright regression | 11KB; TIMEOUT (no browser) |
| docs/backend/API_CONTRACTS.md | API spec documentation | ~7KB |
| docs/backend/README.md | Backend design doc; states "never executed" | ~16KB |
| docs/security/security-headers.md | Header config doc; states "local only" | ~8KB |

No authentication tables, no student tables, no payment tables, no wallet/table,
no CRM tables, no application tracking, no conversation/thread tables.

---

## C. Feature Classification (with justification)

| Feature / Artifact | Real GIBS Requirement? | Decision | Why |
|---|---|---|---|
| Programme catalogue (year-versioned) | YES | KEEP (simplify) | Site's core purpose; must support 2026/2027/2028; needs year-specific records; simplest sufficient model is a versioned table or structured data |
| Programme details + fees | YES | KEEP (simplify) | Required for visitor discovery and accurate institutional info |
| Programme URLs/slugs | YES | KEEP (simplify) | Public links needed; year-scoped resolution useful |
| Enquiry form persistence | MAYBE | SIMPLIFY / DECIDE | Current frontend uses `mailto:`; backend persistence exists but has no staff review/notification mechanism; keep only if GIBS genuinely needs server record; simplest option is `mailto:` + optionally lightweight server log |
| Subscriber database/API | NO (current) | REMOVE / DEFER | No mailing provider integration; no newsletter confirmed; no staff operation confirmed; endpoint unused by frontend |
| Audit log (catalogue_audit_log) | NO (current) | DEFER / REMOVE | No review/approval workflow confirmed; no staff operation confirmed; can be added only when audit requirement arises |
| Lifecycle machinery (clone/publish/archive/transition guards) | MAYBE (future) | SIMPLIFY | Needed if GIBS manages year versions; over-engineered for static source-controlled data; simplify to data version rather than complex SQL state machine if DB kept; remove if source-controlled |
| RLS (full deny-by-default + staff grants) | NO (current) | REMOVE / SIMPLIFY | Only needed with real DB and staff roles; for minimal architecture, access control handled by server environment (service key) not complex RLS; can add only if DB adopted |
| Service-role DB usage | MAYBE | SIMPLIFY | If any DB adopted, use minimal connection; service-role is over-privileged; prefer least-privilege |
| 001/002 prototype schema | NO | REMOVE | Explicitly superseded by README; kept only as historical artifact; do not apply |
| Importer scripts + source module | YES (if DB adopted) | KEEP / SIMPLIFY | Needed if catalogue managed outside code; over-engineered for source-controlled data; simplify to direct content file or minimal loader |
| API endpoints (catalogue, programme/[slug], enquiries, subscribers) | MAYBE | SIMPLIFY / PRUNE | Catalogue/programme reads support the site; enquiry/subscriber only needed if persistence decided; simplify to minimal required endpoints |
| DB connection client (api/_lib/db.ts) | MAYBE | SIMPLIFY | If DB adopted, minimal connection only; remove if no DB |
| Vercel serverless / rewrite config | MAYBE | KEEP | Supports SPA routing; doesn't require DB |
| Backend docs (API_CONTRACTS.md, README.md) | NO (as-is) | SIMPLIFY / REMOVE | Document was written for unexecuted complex backend; replace with minimal architecture doc once scope reduced |

---

## D. Business Requirement Mapping (concise)

| Requirement | Backend Needed? | Minimal Implementation |
|---|---|---|
| Show institution info | No | Static content / frontend |
| Show 2026 programme list | No / maybe | Source-controlled data file (current `src/lib/data.ts`) or minimal DB table |
| Show programme details + fees | No / maybe | Same data source |
| Show historical years | Maybe | Separate year-versioned data source (file or minimal table) |
| Allow visitor to contact GIBS | Yes (minimal) | `mailto:` with validated link OR lightweight server-side email endpoint; persistence only if GIBS needs it |
| Receive enquiries | Only if persistence required | If persistence required: minimal DB table (name, email, message, consent, date, optional programme reference); no ticketing, no dashboard |
| Newsletter / subscribers | No — not confirmed | Remove endpoint; no frontend integration; no mailing provider connection |
| Audit history | No — not confirmed | Defer until audit requirement exists |
| Staff dashboard / review | No — not confirmed | Defer; no staff interface exists; operational review not in product definition |
| Program enrolment / payment | OUT OF SCOPE | Explicitly not this application's purpose; GIBS handles externally |

---

## E. Removal Plan (ordered, with dependency awareness)

Before removing anything, dependencies must be understood.

Order of removal (after approval):

1. **Subscriber endpoint + DB schema (015_subscriber.sql)** — independent; no other schema depends on subscriber; no frontend uses it. Remove after confirming no operational mailing-list process.
2. **Audit log table/function (016_audit_log.sql)** — independent; no other schema references it; no operational review process exists. Remove unless audit requirement confirmed.
3. **Prototype 001/002** — already superseded; safe to delete (README confirms).
4. **Complex lifecycle machinery (018)** — only needed if catalogue lifecycle is required; if source-controlled versioning adopted, can simplify/remove; do NOT remove until catalogue storage approach decided.
5. **Full RLS (019)** — only needed with DB + staff roles; can be removed if DB adopted with simpler access control; do NOT weaken RLS if DB kept; simplify only after storage decision.
6. **Enquiry persistence (014)** — only if persistence required; if `mailto:` sufficient, can remove table + endpoint; if persistence needed, simplify to minimal table (reduce fields to what's operationally needed: name, email, message, consent, programme_ref optional, created_at).
7. **Service-role architecture** — simplify to minimal DB connection only if DB adopted; no service-role if not needed.
8. **Backend documentation (README.md / API_CONTRACTS.md)** — replace after architecture decided; keep only what's accurate for simplified architecture.

What to keep during simplification:
- `db/schema/010-020` core (catalogue_year, lineage, programme, URL, fee) — but simplify if source-controlled
- `src/lib/data.ts` — the actual working data layer
- Frontend — never modified

---

## F. What Remains After Simplification (minimum)

Based on actual GIBS product needs:

**Public visitor (no auth):**
- Browse institutional info (static / source-controlled)
- Browse programme catalogue (2026, with annual version if needed)
- View programme details + fees
- View location/contact
- Submit contact/enquiry (if persistence required: minimal; else: `mailto:`)

**Possible minimal backend (only if catalogue needs management outside deployments):**
- Minimal database or structured content file containing: programme, code, slug, title, description, category, location, fee, year/version, active flag
- Simple read endpoint (optional if data served statically)
- Minimal enquiry endpoint (only if persistence required by GIBS staff)

**What is deliberately NOT in the minimal architecture:**
- Subscriber/newsletter database
- Audit log table
- Authentication / login / profiles / dashboards
- Student records / application tracking
- Payment / enrollment / wallet / transaction / invoice
- Complex RLS / staff roles / privilege escalation / multi-role security
- Background workers / notification queues / CRM abstractions
- Service-role over-privileged architecture (only needed if DB adopted with staff access)
- Complex lifecycle machinery (only needed if DB-managed year versioning required; simpler file/version approach possible)

---

## G. Database Decision (explicit)

Start with the question, not with PostgreSQL.

Question: Does GIBS need programme catalogue management outside of source-controlled deployments?

If NO (current state): Source-controlled `src/lib/data.ts` + versioned copies (e.g., `data-2026.ts`, `data-2027.ts`) is sufficient. No database needed for the site.

If YES (future need): Small database with minimal tables: `catalogue_year` (year, status), `catalogue_programme` (id, year_ref, code, slug, title, category, destination, fees). No student/transaction/enquiry tables unless separately required.

Recommendation for current product: **Option A (no DB for catalogue) or Option B (minimal DB only if management required)** — not Option C (full relational backend). The existing PostgreSQL design (010-020 + RLS + lifecycle + service role) is over-engineered for an informational site.

---

## H. Target Minimal Architecture (possible)

```
Public Visitor
      ↓
GIBS Frontend (React + Vite, static / SPA)
      ↓
Content Source (source-controlled data file: src/lib/data-<year>.ts, OR minimal DB if adopted)
      ↓
Optional minimal backend (only if needed):
  - Read: programme catalogue (public)
  - Optional: minimal enquiry endpoint (only if staff needs persistence)
  - No auth, no student, no payment, no CRM
      ↓
GIBS Email / Contact (mailto: or minimal server-side email)
```

No authentication layer. No dashboards. No student portal. No subscription management. No complex state machine.

---

## I. Implementation Phases (only after this scope reset is approved)

1. **Scope confirmation** — Confirm with GIBS: mailto sufficient? Subscriber endpoint remove? Audit log deferred? Catalogue needs DB or file-based?
2. **Cleanup** (only after confirmation) — Remove subscriber DB/API (015 + endpoint + docs); remove audit log (016); remove prototype (001/002); simplify enquiry to minimal (or keep `mailto:`); simplify/remove 018/019 if DB not adopted; simplify 010-020 to what remains; replace docs with minimal architecture doc
3. **Data architecture** — If DB adopted: minimal schema; if file-based: versioned source files + import from source
4. **Contact** — Confirm `mailto:` or minimal server endpoint; implement staff notification only if required
5. **Verification** — Build + typecheck + QA + (if DB adopted) minimal runtime check
6. **Optional future** — Only when actual requirement arises (e.g., staff requests catalogue management tool, newsletter confirmed, audit required)

---

## J. What Is Deliberately NOT Built (prevent future scope creep)

- No student portal
- No admission/enrollment system
- No payment/transaction infrastructure
- No wallet/invoice/receipt
- No CRM / conversation / ticketing
- No authentication / profiles / dashboards
- No notification queue / background worker
- No complex RLS / service-role / privilege architecture (beyond minimal if DB adopted)
- No audit-log table (until audit requirement confirmed)
- No subscriber database/API (until newsletter operation confirmed)
- No complex catalogue lifecycle machinery (unless DB management is confirmed required)

---

## K. Safety Status (this session)

- No PostgreSQL initdb attempted since stop order
- No `su` / `runuser` / `kill` / `rm -rf` / destructive commands executed
- No file modifications during this audit/planning phase (only `write` to new audit doc at /root/gibs-frontend/BACKEND_SCOPE_RESET.md)
- No frontend modifications
- No production/deployment/hosted-resource changes
- No secrets exposed
- Working tree preserved (same 22 status lines)
- Database environment blocker documented honestly (`/tmp/gibs_pg/data` partial initdb; server does not start)

---

## L. Required Authorization Before Implementation Resumes

Before removing or simplifying any backend code, confirm:

1. **Mailto vs persistence**: Is current `mailto:` acceptable temporarily? If yes, keep contact as-is; if no, what minimal persistence is needed?
2. **Subscriber endpoint**: Confirm removal (no confirmed newsletter operation)
3. **Audit log**: Confirm defer/remove (no confirmed audit operation)
4. **Catalogue storage**: Confirm source-controlled (file) vs minimal DB vs full DB
5. **DB environment**: Confirm when/where safe disposable PostgreSQL is available (separate from this container) — without this, no DB-related changes can be verified at runtime
6. **Integration approval**: Confirm whether frontend should remain disconnected (current state) until backend verified, or whether minimal integration is approved after DB verified

Wait for explicit approval on these points before implementing Phase 2 (cleanup) or Phase 3 (integration).
