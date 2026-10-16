# GIBS — Backend Scope Reset (Verified, Section A–G)

> **SUPERSEDED — HISTORICAL RECORD ONLY.** Accurate as of 2026-10-04 morning, but
> superseded by `BACKEND_CLEANUP_DECISION.md`: the `api/` tree described in §B.3
> was removed later the same day, and `parity_check.py` has since been repaired.

Status: READ-ONLY audit. One new file written (this report). No existing file
modified or deleted. No PostgreSQL started. No `initdb`/`su`/`runuser`. No build
run (would write `dist/`). No deployment. Frontend untouched.

Prior reports were **not** taken as accurate. Every claim below was re-derived
from the working tree; corrections are listed in §H.

---

## A. What the website actually needs

GIBS is a public institutional information website.

Needs: accurate institutional content, programme discovery, programme details
and fees, events/gallery/research, and a working way for a visitor to reach GIBS.

Explicitly **not** needed: accounts/login, profiles, student records, admission
or enrolment, payment, transaction history, dashboards, CRM, ticketing, or a
staff queue.

**Verified frontend is already independent of any backend:**
- `src/` contains zero `fetch(`, `XMLHttpRequest`, `axios`, or `/api/` references.
- `src/pages/Contact.tsx:67` builds `mailto:${primaryEmail}?subject=…&body=…`;
  `onSubmit` (line 70) only guards the anchor — nothing is posted to a server.
- `src/lib/data.ts` (394,667 bytes) is the authoritative catalogue.

Conclusion: the public site needs **no backend to function today**.

---

## B. Every backend artifact currently present (verified, not recalled)

### B.1 Retained SQL schema — `db/schema/` (6 reference files)
| File | Bytes | Object role |
|---|---|---|
| `010_catalogue_year.sql` | 5,336 | annual catalogue dimension |
| `011_programme_lineage.sql` | 3,896 | cross-year continuity |
| `012_catalogue_programme.sql` | 12,092 | programme per year, category + destination |
| `013_programme_url.sql` | 8,308 | URL slugs, `resolve_programme_url()` |
| `017_programme_fee.sql` | 6,902 | fee tiers |
| `020_reference_seed.sql` | 9,507 | category + destination seeds |

### B.2 Deferred SQL — still present, unused
| File | Bytes | Note |
|---|---|---|
| `018_lifecycle_functions.sql` | 29,103 | clone/publish/archive triggers |
| `019_rls_policies.sql` | 16,416 | deny-by-default RLS |

### B.3 API functions — `api/` (4 files, **non-buildable**, see §B.5)
| File | Bytes | Route |
|---|---|---|
| `api/catalogue.ts` | 4,440 | `GET /api/catalogue` |
| `api/programmes/[slug].ts` | 6,020 | `GET /api/programmes/:slug` |
| `api/_lib/db.ts` | 1,297 | `pg` pool + `query()` |
| `api/_lib/shared.ts` | 3,675 | request-id, CORS, rate limit, method guard |

### B.4 Tooling and docs
| Path | Bytes | Status |
|---|---|---|
| `db/legacy/programmes.snapshot.json` | present | frozen migration input |
| `scripts/db/apply_schema.py` | 38,513 | psql migration applier, never executed |
| `scripts/db/provision_roles.sql` | 7,340 | role provisioning, never executed |
| `scripts/import/_programme_source.py` | 11,366 | source→schema mapping |
| `scripts/import/programmes_to_sql.py` | 8,097 | SQL generator |
| `scripts/import/export_snapshot.py` | 3,266 | snapshot export (`.py`, not `.js`) |
| `scripts/qa/parity_check.py` | 18,493 | **BROKEN — exit 1** |
| `scripts/qa/schema_chain_check.py` | 18,268 | **BROKEN — exit 1** |
| `scripts/qa/generator_drift_check.py` | 4,204 | PASS — exit 0 |
| `scripts/qa/regression.mjs` | 11,397 | Playwright; blocked (no Chromium) |
| `scripts/validate_current_data.py` | present | data-layer validator |
| `docs/backend/README.md` | 5,706 | rewritten minimal doc |
| `docs/backend/API_CONTRACTS.md` | 807 | stub pointing at `.deprecated` |
| `docs/backend/API_CONTRACTS.md.deprecated` | 7,213 | old spec, retained |
| `docs/security/security-headers.md` | 8,109 | honest about unverified deployment |

### B.5 Findings that change the picture
1. **`api/` cannot compile.** `package.json` declares only `clsx`, `framer-motion`,
   `react`, `react-dom`, `tailwind-merge` (+ dev tooling). Neither `pg`
   (`api/_lib/db.ts:10`) nor `@vercel/node` (`catalogue.ts:21`,
   `[slug].ts:16`, `shared.ts:5`) is a declared or installed dependency.
2. **`api/` is excluded from typecheck.** `tsconfig.json` `include` is
   `["src", "vite.config.ts"]`. A passing `tsc --noEmit` says nothing about
   `api/` correctness.
3. **No orphaned SQL.** Every object `api/` queries — `catalogue_year`,
   `catalogue_programme`, `catalogue_programme_fee`, `programme_url`,
   `programme_category`, `destination`, `resolve_programme_url` — still exists
   in retained schema. Deleting 014/015/016 broke no endpoint.
4. **`.gitignore` is stale.** It still ignores `db/schema/002_programme_seed.sql`
   with a 4-line comment about regenerating a ~725KB seed file that no longer exists.
5. **Nothing is tracked in git.** `db/`, `api/`, `docs/backend/`, `docs/security/`,
   `scripts/db/`, `scripts/import/` are all untracked; the 12 modified files are
   unstaged. HEAD is `ec1c30a`.

---

## C. Feature classification

| Artifact | Real requirement? | Decision | Reason |
|---|---|---|---|
| `src/lib/data.ts` catalogue | YES | **KEEP** | Core product; verified authoritative; drift check passes |
| Contact `mailto:` workflow | YES | **KEEP** | Meets the only confirmed contact requirement; zero server dependency |
| `vercel.json` SPA rewrite | YES | **KEEP** | Required for client routing; `api/` exclusion harmless |
| Security headers | YES | **KEEP** | Correct for public site |
| `scripts/qa/generator_drift_check.py` | YES | **KEEP** | Only QA gate that still passes |
| `scripts/qa/parity_check.py` | YES (as a gate) | **REPAIR or DELETE** | Guards the data layer but now crashes |
| `scripts/qa/schema_chain_check.py` | NO | **DELETE** | Guards schema that no longer exists |
| `api/*` (4 files) | NO | **DELETE** | Non-buildable, untyped, uncalled, no DB — pure liability |
| `db/schema/010-013,017,020` | NO | **DELETE or ARCHIVE** | Unrunnable design reference only |
| `018_lifecycle_functions.sql` | NO | **DELETE or ARCHIVE** | State machine for a catalogue that is a file |
| `019_rls_policies.sql` | NO | **DELETE or ARCHIVE** | RLS is moot with no DB and no staff roles |
| `scripts/db/*` | NO | **DELETE or ARCHIVE** | Only meaningful if the schema above is kept |
| `scripts/import/*` | NO | **DELETE or ARCHIVE** | Only meaningful if the schema above is kept |
| `docs/backend/API_CONTRACTS.md.deprecated` | NO | **DELETE** | Spec for deleted endpoints |
| `scripts/qa/regression.mjs` | LATER | **KEEP** | Browser regression still wanted post-deploy |

---

## D. Business requirement mapping

| Requirement | Backend needed? | Minimal implementation |
|---|---|---|
| Institutional information | No | Static content |
| Programme list / details / fees | No | `src/lib/data.ts` (already done) |
| Year-versioned catalogue | No | Versioned file (`data-2027.ts`) or a `year` field |
| Visitor can contact GIBS | **No** | Validated `mailto:` (already done) |
| GIBS keeps a record of enquiries | Only if GIBS staff confirms | Then: one small table + one POST route + email-to-staff |
| Newsletter | Not confirmed | Nothing |
| Audit / approval workflow | Not confirmed | Nothing |
| Enrolment / payment / student records | Out of scope | Handled outside the website |

---

## E. Removal plan (dependency-ordered, pending your approval)

Nothing below has been executed. Order matters because the QA scripts read the
schema.

1. **Decide the QA scripts first** — they are the only thing that depends on the
   schema. Deleting schema without fixing them leaves two permanently red checks
   (they are already red today).
   - `schema_chain_check.py` → delete. It hard-fails on missing `014/015/016`
     and asserts `001/002` are "retained as artefacts" (line 55-56, 160-162).
   - `parity_check.py` → repair to read `db/legacy/programmes.snapshot.json` or
     `src/lib/data.ts` instead of `db/schema/001_programme.sql` (line 33), or delete.
2. **`api/`** (4 files) — delete. No dependency on anything kept; nothing imports it;
   it cannot compile without adding `pg` + `@vercel/node`.
3. **`db/schema/`** (8 files) + `db/legacy/` — delete, or move to a single
   `docs/backend/archive/` note. Removing them makes `apply_schema.py`,
   `provision_roles.sql`, and `scripts/import/*` dead too.
4. **`scripts/db/` and `scripts/import/`** (5 files) — delete together with step 3,
   or keep only if you intend to adopt the DB later.
5. **`.gitignore`** — drop the `002_programme_seed.sql` rule and its 4-line comment.
6. **Docs** — fold `docs/backend/README.md`, `API_CONTRACTS.md`, and
   `API_CONTRACTS.md.deprecated` into one short file, then delete `BACKEND_SCOPE_RESET.md`
   and `BACKEND_ARCHITECTURE_DECISION.md` once you are satisfied their open questions are closed.
7. **Keep untouched**: `src/`, `scripts/qa/generator_drift_check.py`,
   `scripts/qa/regression.mjs`, `scripts/validate_current_data.py`,
   `docs/security/security-headers.md`, `vercel.json`, `.env.example`.

**Net effect if you approve all of it: the repository loses every backend artifact
and keeps a static, fully working institutional site with one passing data-integrity gate.**

---

## F. What remains (minimum viable product)

```
Public visitor
   ↓
Static React SPA (single inlined index.html)
   ↓
src/lib/data.ts          ← authoritative catalogue (135 programmes, 137 fees)
   ↓
mailto:                  ← contact workflow
   ↓
GIBS inbox               ← all follow-up happens outside the website
```

No server, no database, no accounts, no jobs, no third-party services, no secrets.

---

## G. Database decision

**Recommendation: no database. Adopt Option A (file-based) permanently.**

Reasoning, given verification rather than assumption:
- The frontend already serves the entire catalogue from a committed 394KB file.
- `generator_drift_check.py` proves that file regenerates byte-identically — the
  file is already a controlled data artifact, which is what a DB would replace.
- No retained API route is called, and none can run without two uninstalled deps.
- No confirmed staff workflow needs server-side edits.

If GIBS later requires staff to edit programmes without a code deploy, the minimal
step is: disposable PostgreSQL + `catalogue_year` / `catalogue_programme` /
`catalogue_programme_fee` + one read route. Do **not** resurrect 018 lifecycle
triggers or 019 RLS — those encode a multi-staff publishing process nobody has asked for.

**Environment note:** the container cannot run PostgreSQL
(`/tmp/gibs_pg/data` is a partial initdb that will not start). Any DB work needs a
disposable environment outside this container. Irrelevant if Option A is confirmed.

---

## H. Corrections to prior reports (found by inspection)

| Prior claim | Source | Reality |
|---|---|---|
| `db/schema/001_programme.sql` present, 13,925 bytes | SCOPE_RESET §B | **Deleted** |
| `db/schema/002_programme_seed.sql` present, 732KB | SCOPE_RESET §B | **Deleted** |
| `db/schema/014_enquiry.sql` present | SCOPE_RESET §B | **Deleted** |
| `db/schema/015_subscriber.sql` present | SCOPE_RESET §B | **Deleted** |
| `db/schema/016_audit_log.sql` present | SCOPE_RESET §B | **Deleted** |
| `api/enquiries.ts` present, 7,345 bytes | SCOPE_RESET §B | **Deleted** |
| `api/subscribers.ts` present, 3,949 bytes | SCOPE_RESET §B | **Deleted** |
| `scripts/import/export_snapshot.js` | SCOPE_RESET §B | Actual file is `export_snapshot.py` |
| "parity 45/45 PASS" | SCOPE_RESET §B | **exit 1** — `FileNotFoundError: 001_programme.sql` |
| "chain 201/201 PASS" | SCOPE_RESET §B | **exit 1** — `chain files are missing` |
| "Verified static QA (parity, drift, chain) — complete" | DECISION §8 | **False** — 2 of 3 fail |
| "TypeScript passes (EXIT 0)" | DECISION §8 | Exit 0 is real, but `tsconfig` excludes `api/`, so it does not cover it |
| "chain 201/201" / "parity 45/45" as evidence | both docs | Counts describe the pre-deletion layout; stale |

Net: both prior docs describe a repository state that no longer exists. The
*direction* of their conclusion (no backend required) is independently confirmed by
§A. Their *evidence tables* are not usable.

---

## I. Open decisions (I need your answer before touching anything)

1. **Catalogue storage** — confirm file-based permanently (recommended), or keep the DB design as an archive?
2. **`api/`** — delete all 4 files (recommended), or keep and add `pg` + `@vercel/node`?
3. **`db/schema/018` + `019`** — delete, or archive as design reference?
4. **`scripts/qa/schema_chain_check.py`** — delete, or rewrite against the retained/chosen schema?
5. **`scripts/qa/parity_check.py`** — repair to read the snapshot/data.ts (recommended), or delete?
6. **`scripts/db/` + `scripts/import/`** — keep for a possible future DB, or delete?
7. **Docs** — consolidate to one short file, and may I delete the two prior reports?