# ARCHIVED — legacy backend implementation

> ## ⚠ READ THIS BEFORE USING ANYTHING IN THIS DIRECTORY
>
> **These files are HISTORICAL / LEGACY material retained for reference only.**
>
> - They are **NOT active application infrastructure.**
> - They are **NOT part of `npm run qa`** and are not invoked by it.
> - They are **NOT intended to be executed, applied, or run in place.**
> - The **current GIBS product does not use PostgreSQL.**
> - The **current GIBS product has no backend and no API.**
>
> **Do not treat anything here as a live migration path.**

## What the current product actually is

A public informational website:

```
Public visitor → static React/Vite SPA (one self-contained index.html)
              → src/lib/data.ts  (authoritative source-controlled catalogue,
                                  135 programmes)
              → validated mailto: link  → GIBS inbox
```

No database. No API. No serverless functions. No environment variables.
Catalogue integrity is enforced by `npm run qa`, which reads only
`src/lib/data.ts` and `db/legacy/programmes.snapshot.json` — **neither of which
is in this directory.**

## The migration chain here is NOT executable

The `010`–`020` sequence must not be described as a working migration chain. It
**cannot currently be applied to PostgreSQL**, because two of its files reference
tables that were deliberately deleted:

| File | Executable reference to a deleted table |
|---|---|
| `018_lifecycle_functions.sql` | `INSERT INTO catalogue_audit_log` (old `016`) |
| `019_rls_policies.sql` | `ALTER TABLE` + `CREATE POLICY` on `enquiry` (old `014`), `subscriber` (old `015`), `catalogue_audit_log` (old `016`) |

Verified by stripping comments and string literals, then searching for those
table names. Neither file was repaired, and restoring the missing migrations was
never approved. **No PostgreSQL migration was ever executed, in this repository,
at any point.**

These files also will not run in place: `scripts/db/apply_schema.py` derives its
repository root from its own location, and its file list still expects the deleted
`014`/`015`/`016`. That is expected. Do not "fix" them into a working migration
path without a confirmed GIBS requirement.

## Contents

### `db/schema/` — never-executed PostgreSQL migrations
| File | Purpose |
|---|---|
| `010_catalogue_year.sql` | Annual catalogue dimension |
| `011_programme_lineage.sql` | Cross-year continuity |
| `012_catalogue_programme.sql` | Year-specific programme record + lookup tables |
| `013_programme_url.sql` | Public URL asset model (slug stability rationale) |
| `017_programme_fee.sql` | Fee price tiers |
| `018_lifecycle_functions.sql` | Clone/publish/archive state machine — **broken**, see above |
| `019_rls_policies.sql` | Deny-by-default RLS — **broken**, see above |
| `020_reference_seed.sql` | Seed: 15 categories, 5 destinations |

### `scripts/db/` — database infrastructure, never executed
| File | Purpose |
|---|---|
| `apply_schema.py` | `psql` migration applier with a content-hash ledger |
| `provision_roles.sql` | Creates `anon` / `authenticated` / `service_role` cluster roles (a Supabase-style model GIBS never adopted) |

### `scripts/qa/` — legacy QA, not part of `npm run qa`
| File | Purpose |
|---|---|
| `schema_chain_check.py` | Static pre-flight checker for the 010-020 chain. **Fails by design** — it requires the deleted `014/015/016` to exist and asserts `001/002` are still present. |

## Durable knowledge was extracted before archiving

The genuinely useful rules from these files were moved into current documentation
**before** the files were archived. See `docs/PROGRAMME_CATALOGUE_RULES.md`:

- Programme slugs are stable public URL identifiers; never regenerated, normalized,
  or tidied for aesthetics.
- A programme **rename does not imply a slug rename** — slugs are pinned
  independently of titles, because a title-derived slug breaks inbound links and
  search rankings on every rename.
- There is **no slug redirect/remapping system**, and none has ever existed; do not
  assume old slugs redirect.
- Slug format `^[a-z0-9][a-z0-9-]{0,127}$`.
- Programme code format `^GIBS-[A-Z]{3}-(?:[A-Z0-9]{2,3}-)?[0-9]{2,3}$`.
- Category and destination are matched by **exact string equality** in the UI, so a
  typo silently empties a filter.

Fee representation, the year model, and the reference category/destination values
are all still enforced by the live `npm run qa` gate.

## Provenance

Archived 2026-10-04 by explicit authorization, following
`BACKEND_ARCHIVE_PLAN.md`. Files were copied unmodified and verified
byte-for-byte (SHA-256) before the originals were removed. Record of the original
paths and hashes is in `BACKEND_ARCHIVE_PLAN.md`.

The obsolete Vercel API (`api/`) and the obsolete SQL generator
(`scripts/import/programmes_to_sql.py`) were removed outright rather than archived.
The SQL generator held no unique catalogue logic — all of its transformations live
in `scripts/import/_programme_source.py`, which is retained and actively used by
`npm run qa`.