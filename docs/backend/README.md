# GIBS Minimal Backend Architecture (Simplified)

Status: Simplified per scope reset (approved 2026-10-04).

**The current GIBS website has no active serverless API/backend. Contact uses the
frontend's `mailto:` workflow, and the programme catalogue is source-controlled.**
No PostgreSQL is required or connected. `src/lib/data.ts` is the authoritative
programme catalogue.

---

## Active

- `src/lib/data.ts` — authoritative source-controlled programme catalogue (135 programmes, 113 local + 22 foreign, 137 fees). Year-versioned by source control, not by a database column.
- `docs/PROGRAMME_CATALOGUE_RULES.md` — **current** catalogue and URL rules, including the standing rule that existing slugs must never be regenerated or tidied, that a rename does not imply a slug rename, and that no slug-redirect system exists.
- `scripts/qa/` — the product's catalogue gates, all run by `npm run qa` (`parity_check.py`, `generator_drift_check.py`).
- `scripts/import/_programme_source.py` and `export_snapshot.py` — shared catalogue parser and snapshot tooling used by those gates.
- `db/legacy/programmes.snapshot.json` — derived provenance snapshot; an active input to `npm run qa`. Deliberately left at this path.
- `docs/security/security-headers.md` — deployment header intent (honest about being unverified against the live domain).

## Archived — NOT part of this product

Moved to [`archive/backend/`](../../archive/backend/README.md) on 2026-10-04.
Never executed against any database. **Not part of `npm run qa`; not intended to be
run.** The `010`–`020` sequence is not an executable migration chain: `018` writes
to `catalogue_audit_log` and `019` enables RLS on `enquiry`, `subscriber`, and
`catalogue_audit_log` — all deleted tables.

- `db/schema/010,011,012,013,017,020` — never-executed migrations. Their durable
  domain rationale now lives in `docs/PROGRAMME_CATALOGUE_RULES.md`.
- `db/schema/018_lifecycle_functions.sql`, `019_rls_policies.sql` — never-executed
  clone/publish/archive machinery and RLS policy.
- `scripts/db/apply_schema.py`, `scripts/db/provision_roles.sql` — migration
  applier and role provisioning. Never executed.
- `scripts/qa/schema_chain_check.py` — pre-flight checker for the 010-020 chain.
  **It fails by design and is deliberately excluded from `npm run qa`.** It is not
  claimed to pass.

## Removed

- The entire `api/` tree — `catalogue.ts`, `programmes/[slug].ts`, `_lib/db.ts`,
  `_lib/shared.ts`. Obsolete PostgreSQL catalogue API. Nothing in `src/`, no
  package script, and no retained script imported it; `pg` and `@vercel/node`
  were never installed and were deliberately **not** added. Removing the tree also
  removed the Vercel serverless-function auto-detection risk.
- Prototype `db/schema/001_programme.sql`, `002_programme_seed.sql` (superseded per README)
- `db/schema/014_enquiry.sql` + `api/enquiries.ts` (mail-to workflow sufficient; no staff review mechanism confirmed)
- `db/schema/015_subscriber.sql` + `api/subscribers.ts` (no confirmed newsletter operation)
- `db/schema/016_audit_log.sql` (no confirmed audit/review requirement)
- `scripts/import/programmes_to_sql.py` — SQL emitter for the deleted prototype
  schema. Held no unique catalogue transformation logic; all of it is delegated to
  `scripts/import/_programme_source.py`, which is retained and actively used.

---

## What is deferred (not removed; not currently used; keep for future requirement only)

- Lifecycle functions/triggers (`018_lifecycle_functions.sql`) — only if DB-managed year versioning required
- Row-level security (`019_rls_policies.sql`) — only if multi-role DB adopted
- Any database connection layer — only if a DB is adopted; prefer a minimal connection
- Full PostgreSQL server — deferred until a concrete requirement demands server-side persistence

---

## What this is NOT

- Not a student portal, admission system, payment platform, CRM, or authenticated platform
- Not an enquiry-ticking, conversation-management, or staff-queue system
- Not a subscription/newsletter delivery system (no mailing provider connection)
- Not an audit/review control system (no staff review interface)
- Not a transaction/payment/record-keeping platform

---

## Contact / Enquiry

Current working flow: visitor completes Contact form → `mailto:` link opens user's email client. No server-side persistence claim is made to the visitor.

If GIBS later requires server-side enquiry persistence, the minimal requirement would be:
- A small table: enquiry (name, email, message, consent, programme_ref optional, created_at)
- A single POST endpoint — none exists today, and none should be built before the requirement is confirmed
- A notification mechanism (email to staff) — only if staff genuinely needs to receive enquiries
- No dashboard, no ticketing, no conversation tracking

Until then: mailto is the accurate, honest workflow.

---

## Catalogue / Year Versioning

Programme data is maintained as source-controlled `src/lib/data.ts`.
Year-specific versions can be maintained as separate files (`data-2026.ts`, `data-2027.ts`) or as structured data with year fields.

Historical programme URLs and continuity can be represented in source data (slug + year + code) without complex database machinery.

If server-side management of the catalogue is required in future, introduce only:
- A minimal database connection
- Minimal programme + fee tables (year-scoped)
- Simple read endpoint (optional; data can also be served statically)
- No student records, no enrollment, no payment

---

## Security (proportionate to informational site)

- No authentication required (public site)
- No server-side secrets in source (GIBS_DATABASE_URL absent; VERCEL_OIDC_TOKEN is deployment auth only)
- CSP configured in `vercel.json` (Report-Only; not enforcing — valid for informational site; can be made enforcing once verified)
- Security headers declared; live verification deferred until deployment inspection
- Validation exists in code (Contact form validation); no injection patterns found
- No over-privileged database access required (no DB currently used)

---

## Deployment

- Vercel configuration (`vercel.json`): SPA rewrite for non-API paths
- Build: `vite` + `vite-plugin-singlefile` produces `dist/index.html`
- No backend deployment required until DB needed
- No production changes made; no deployment executed

---

## What is genuinely required for production readiness (current scope)

1. Verified programme source data (`src/lib/data.ts`) — complete
2. Verified build (`npm run build`) — complete
3. Verified TypeScript (`tsc --noEmit`) — complete
4. Verified catalogue QA (`npm run qa`: parity, generator drift, snapshot hash) — complete
5. Verified frontend preservation (no redesign, design intact) — complete
6. Accurate contact workflow (mailto with proper construction) — complete
7. Secure environment (no exposed secrets; CSP/config present) — configured
8. Live deployment verification — deferred until needed

Note on QA scope: `npm run qa` runs the three current-product catalogue gates. The
legacy PostgreSQL chain check (`scripts/qa/schema_chain_check.py`) is archived and
is **not** part of `npm run qa`; it does not pass and is not claimed to.
