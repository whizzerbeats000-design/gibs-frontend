# GIBS — Backend Legacy Archive Plan

Status: **EXECUTED 2026-10-04 under explicit authorization.** See §11 for the
implementation result. Sections 1–10 below are the plan as approved and are
retained as the reasoning of record.

> ⚠ The `010`–`020` sequence in the archive is **not an executable migration
> chain** — `018` writes to `catalogue_audit_log`, and `019` enables RLS on
> `enquiry`, `subscriber`, and `catalogue_audit_log`, all of which were deleted.
> No migration was ever executed in this repository. See
> `archive/backend/README.md`.

---

## 1. Current architecture (unchanged, confirmed)

Public informational GIBS website · React/Vite SPA · source-controlled catalogue in
`src/lib/data.ts` (135 programmes) · stable slugs · year/version concept ·
`mailto:` contact workflow.

**No backend. No API (tree removed 2026-10-04). No database. No PostgreSQL.**

Current QA — `npm run qa` → exit 0 (23/23 catalogue checks, generator drift
byte-identical, snapshot hash current); `npx tsc --noEmit` → exit 0;
`npm run build` → exit 0.

---

## 2. Inventory of remaining legacy material (read-only)

| Path | Bytes | Structural content |
|---|---|---|
| `db/schema/010_catalogue_year.sql` | 5,336 | 1 table (`catalogue_year`), 4 CHECKs |
| `db/schema/011_programme_lineage.sql` | 3,896 | 1 table (`programme_lineage`), 1 CHECK, 2 COMMENTs |
| `db/schema/012_catalogue_programme.sql` | 12,092 | 3 tables (`programme_category`, `destination`, `catalogue_programme`), 4 CHECKs, 5 COMMENTs |
| `db/schema/013_programme_url.sql` | 8,308 | 1 table (`programme_url`), 1 function (`resolve_programme_url`), 2 CHECKs, 2 COMMENTs |
| `db/schema/017_programme_fee.sql` | 6,902 | 1 table (`catalogue_programme_fee`), 3 CHECKs, 2 COMMENTs |
| `db/schema/018_lifecycle_functions.sql` | 29,103 | 5 functions, 3 triggers (audit writer, mutation guards, publish/clone/submit transitions) |
| `db/schema/019_rls_policies.sql` | 16,416 | 10 × `ENABLE ROW LEVEL SECURITY`, 15 policies, 5 CHECKs |
| `db/schema/020_reference_seed.sql` | 9,507 | seed only — 15 categories + 5 destinations (20 hand-written rows) |
| `scripts/db/apply_schema.py` | 38,513 | psql migration applier: ledger, content hashes, `--check` mode |
| `scripts/db/provision_roles.sql` | 7,340 | 3 cluster roles (`anon`, `authenticated`, `service_role`) |
| `scripts/import/programmes_to_sql.py` | 8,097 | snapshot → SQL for the deleted year-less prototype |
| `scripts/qa/schema_chain_check.py` | 18,268 | static pre-flight checker for the 010-020 chain |

**Retained and active — must not be touched:** `scripts/qa/parity_check.py`,
`scripts/import/_programme_source.py`, `scripts/import/export_snapshot.py`,
`db/legacy/programmes.snapshot.json`, `src/lib/data.ts`,
`scripts/qa/generator_drift_check.py`.

> Structural note: `db/` **cannot** be removed wholesale. After archiving
> `db/schema/`, `db/legacy/programmes.snapshot.json` remains and is an active QA
> input for both `parity_check.py` and `export_snapshot.py --check`.

---

## 3. A decisive new finding: two migrations are already broken

Stripping comments and string literals and then searching for the deleted tables
(`enquiry` = old 014, `subscriber` = old 015, `catalogue_audit_log` = old 016):

```
EXECUTABLE references to deleted tables:
  018_lifecycle_functions.sql   catalogue_audit_log × 1     <-- would FAIL on a real engine
  019_rls_policies.sql          enquiry × 3, subscriber × 3,
                                catalogue_audit_log × 4    <-- would FAIL on a real engine
  (all other files: zero executable references)
```

Concretely, `018_lifecycle_functions.sql:48` executes
`INSERT INTO catalogue_audit_log (…)`, and `019_rls_policies.sql` issues
`ALTER TABLE enquiry/subscriber/catalogue_audit_log ENABLE ROW LEVEL SECURITY`
plus policies on all three.

**Consequence:** the 010-020 chain is no longer a coherent migration set. It could
not be applied to PostgreSQL even if that were decided, without first restoring the
three deleted migrations. "Archive as a working migration chain" is therefore not
an available option — there is no working chain to archive. This materially
strengthens the case for archival and removes any argument for repairing 018/019.

---

## 4. File-by-file classification

Entities "still exist in the product" means: represented in the shipped catalogue or
enforced by retained QA. None of these tables exists in the running product — the
product has no tables at all.

### `010_catalogue_year.sql` — **EXTRACT KNOWLEDGE THEN ARCHIVE**
- **Purpose:** annual catalogue dimension.
- **Entities:** `catalogue_year`. Product: no table; the *year concept* survives in source control.
- **Referenced by frontend/current scripts:** no.
- **Useful business rules:** the year-model rationale — "GIBS programmes are not permanent… the requirement is not 'a table of programmes' but 'a sequence of annual catalogues', where publishing one never destroys the previous one." **This is the conceptual origin of the retained year/version concept and must survive.**
- **Historical-only:** `status` enum (`draft|review|published|archived`), `year BETWEEN 2000 AND 2100`, `published_at`/`archived_at` conditional CHECKs, UUID PK.
- **Reason:** the publishing state machine is abandoned; the "never destroys the previous one" principle is the one live idea.

### `011_programme_lineage.sql` — **ARCHIVE** (no extraction needed)
- **Purpose:** cross-year continuity for a renamed/re-coded programme.
- **Entities:** `programme_lineage`. Product: none.
- **Referenced by:** nothing.
- **Useful business rules:** the three-concept disambiguation (lineage = continuity; catalogue_programme = the year-specific record; programme_url = an independently managed URL). Only the URL half is still relevant, and it is already extracted from 013.
- **Historical-only:** table DDL, `lineage_key` regex CHECK, the 2 COMMENTs.
- **Reason:** no current product concept maps to lineage. Its one durable idea is captured via 013.

### `012_catalogue_programme.sql` — **EXTRACT KNOWLEDGE THEN ARCHIVE**
- **Purpose:** the year-specific programme record plus the two lookup tables.
- **Entities:** `programme_category`, `destination`, `catalogue_programme`. Product: represented as plain strings in `data.ts` and enforced by parity.
- **Referenced by:** nothing executable.
- **Useful business rules — two of them are verified live and currently UNENFORCED by retained QA:**
  1. **Programme code format** (line 189): `^GIBS-[A-Z]{3}-(?:[A-Z0-9]{2,3}-)?[0-9]{2,3}$`. *Verified: 135/135 live codes conform* (e.g. `GIBS-LOC-001`). `parity_check.py:107` asserts code **uniqueness only** — the format is unverified by active QA.
  2. **Category/destination are matched by exact string equality in the frontend** (COMMENT, lines 57-60). *Verified true* at `src/pages/Programmes.tsx:54` (`p.category === category`) and `:58-60` (`p.destination === destination`). The stated consequence — "a typo would silently drop a programme out of a filter with no error anywhere" — is a real trap for anyone editing the catalogue.
  3. "Local is a real destination, not a NULL; 113 of 135" — already enforced by the retained `inPlantAvailable ≡ is Local` check.
- **Historical-only:** table DDL, `num > 0`, `entry_status` enum, the year FK.
- **Reason:** two verified, currently-unenforced invariants would be lost.

### `013_programme_url.sql` — **EXTRACT KNOWLEDGE THEN ARCHIVE** *(highest value)*
- **Purpose:** model public URLs as independently managed, immutable assets.
- **Entities:** `programme_url`, `resolve_programme_url()`. Product: slugs exist in `data.ts`; resolution is done client-side by `getProgramme()`.
- **Referenced by:** nothing executable (`resolve_programme_url` was called only by the removed API).
- **Useful business rules — four, three of which are verified live:**
  1. **Slugs are live public URLs, ugly and load-bearing, never regenerated or cleaned** (lines 11-14). *Verified:* 135 unique slugs, mid-word truncation present.
  2. **A programme rename must NOT change its slug** (lines 16-19): "If the URL were derived from the title, every rename would break an inbound link and a search ranking. So the slug is pinned here, independently, and a rename does not touch it." **This is a forward-looking rule that is NOT yet in `docs/PROGRAMME_CATALOGUE_RULES.md` and must be added.**
  3. **No URL redirects have ever existed** (COMMENT lines 73-75): "the 2026 import creates no redirects at all." *Verified:* the current router contains no redirect logic whatsoever. So the slug space has never been remapped, and no legacy redirect needs honouring.
  4. **Slug format** (CHECK line 56): `^[a-z0-9][a-z0-9-]{0,127}$`. *Verified:* 135/135 conform; longest is 78 chars. Currently unenforced by retained QA.
- **Historical-only:** the `programme_url` DDL, 3 partial indexes, `resolve_programme_url()` and its 4-outcome enum (`redirect|current|historical|not_found`), `SECURITY DEFINER` + pinned `search_path`, self-redirect CHECK.
- **Reason:** it is the single densest source of durable URL-contract knowledge in the repository.

### `017_programme_fee.sql` — **ARCHIVE** (knowledge already protected)
- **Purpose:** fee price tiers per catalogue programme.
- **Entities:** `catalogue_programme_fee`. Product: fee fields in `data.ts`.
- **Referenced by:** nothing executable.
- **Useful business rules:** the three-way fee representation — `fee` numeric, `fees` display string (sometimes a composite of two tiers), `feeSecondary` (2 records), `feeNotes` free text (3 records, not derivable) — and the explicit instruction "Do not 'tidy' them into the primary tier," plus the 137-row expectation.
- **Already protected:** every one of these is asserted by the **retained** `parity_check.py` (fee display reproducibility, `fee_notes` explanations, exactly 2 secondary tiers, 137-row total). No extraction needed.
- **Historical-only:** tier CHECK (`IN (1,2)`), currency CHECK, uniqueness constraint, DDL.
- **Reason:** the only durable content is already enforced by an active gate.

### `018_lifecycle_functions.sql` — **ARCHIVE** (already broken)
- **Purpose:** clone / submit / publish / archive state machine with immutability guards.
- **Entities:** 5 functions, 3 triggers; writes to `catalogue_audit_log` (deleted).
- **Referenced by:** nothing.
- **Useful business rules:** none of GIBS-specific value — it is generic publish-workflow engineering expressing a multi-operator editorial process GIBS never confirmed it had.
- **Historical-only:** everything. Also **broken** (§3).
- **Reason:** no product concept, no current dependency, and it cannot run.

### `019_rls_policies.sql` — **ARCHIVE** (already broken)
- **Purpose:** deny-by-default RLS with least-privilege grants.
- **Entities:** RLS on 10 tables, 3 of which are deleted; 15 policies.
- **Referenced by:** nothing.
- **Useful business rules:** none specific to GIBS. Its "public role cannot write at all" posture is a generic security stance with no application here (no DB, no writers, no authenticated users).
- **Historical-only:** everything. Also **broken** (§3).
- **Reason:** RLS is meaningless without a database and without staff roles.

### `020_reference_seed.sql` — **ARCHIVE**
- **Purpose:** seed the 15 categories and 5 destinations (20 hand-written rows).
- **Entities:** rows into `programme_category`, `destination`.
- **Referenced by:** nothing executable.
- **Useful business rules:** the exact-string-equality warning and the note that these are the most transcription-prone rows in the chain. The *values themselves* are already authoritative in `_programme_source.py` (`CATEGORY_ORDER`, `DESTINATION_ORDER`) and enforced live by the retained parity gate (15 categories; the `{Local:113, Kigali:8, Dubai:5, London:4, Houston:5}` distribution).
- **Historical-only:** `INSERT` statements, sort orders, currency defaults.
- **Reason:** duplicative of retained, actively-checked definitions.

### `scripts/import/programmes_to_sql.py` — **REMOVE** (nothing unique to preserve)
- **What it generates:** upsert `INSERT` statements for `programme_category`, `destination`, `programme`, `programme_fee` — the **year-less prototype** shapes, *not* the 010-020 chain (`catalogue_programme`, `catalogue_programme_fee`).
- **Files it expects:** `db/legacy/programmes.snapshot.json` (**retained**) and `db/schema/001_programme.sql` (**deleted**, hardcoded at line 40, read at line 178 in the `--dsn` apply path only).
- **Exclusively tied to the deleted DB schema?** **Yes.** It emits SQL for tables that no longer exist and reads a file that no longer exists. `build_sql()` would still run; `main()` with `--dsn` would crash.
- **Useful catalogue transformation logic elsewhere?** **No — it holds none.** Every transformation it performs is delegated to `_programme_source.py` (`load_snapshot`, `build_canonical_rows`, `expected_display_fee`), which is **retained and actively used** by `parity_check.py`. Its own file is a thin SQL emitter: one function (`build_sql`) plus `main()`.
- **Reason:** the valuable logic is already in a retained file, so removal loses nothing.

### `scripts/db/apply_schema.py` — **ARCHIVE** (no extraction needed)
- **Purpose:** apply 010-020 in order via `psql`, with a content-hash migration ledger.
- **Referenced by:** nothing (`npm run qa` does not invoke it).
- **Useful business rules:** none GIBS-specific. It contains sound generic migration engineering — per-file transactions, skip-if-unchanged, refuse-on-content-change, refuse below PostgreSQL 13 (`gen_random_uuid`), a `FORBIDDEN` list keeping 001/002 unapplied, and a `psql`-not-driver rationale for zero third-party dependencies.
- **Historical-only:** all of it, plus `SCRIPT_FILES` (lines 101-113) which still lists the deleted 014/015/016 — another reason `--check` fails.
- **Reason:** no GIBS knowledge, and its file list is already stale.

### `scripts/db/provision_roles.sql` — **ARCHIVE** (no extraction needed)
- **Purpose:** create the `anon` / `authenticated` / `service_role` cluster roles.
- **Referenced by:** nothing.
- **Useful business rules:** none for GIBS. The role vocabulary is Supabase-derived — the file itself notes "NOT on Supabase: `anon`, `authenticated` and `service_role` all already exist," i.e. it was written for a hosting model GIBS never adopted. Its careful reasoning about not granting BYPASSRLS to a pre-existing role is good practice but generic.
- **Historical-only:** everything.
- **Reason:** describes a deployment model that was never adopted.

### `scripts/qa/schema_chain_check.py` — **ARCHIVE** as legacy QA
- **Historical assumptions it encodes:** (a) the 010-020 order is a deployable chain; (b) `014/015/016` will exist; (c) `001/002` must be retained as artefacts and never applied alongside; (d) the chain's purpose is to reach a PostgreSQL engine; (e) tables need RLS and grants revoked.
- **Useful knowledge lost if archived?** Nothing GIBS-specific. Its assertion list is generic SQL-review hygiene — every table has a primary key, FK targets exist, every table has RLS + `FORCE ROW LEVEL SECURITY`, no `CREATE/ALTER ROLE` in migrations, functions are `SECURITY DEFINER` with pinned `search_path`.
  - One exception worth noting: it asserts *"every source code satisfies the code CHECK"* — the `GIBS-XXX-###` format rule also stated in `012`. That rule is being extracted under `012`, so nothing is lost.
  - Its process lesson — keep the prototype checker and the chain checker separate so "a green run cannot be mistaken for a verdict on the live chain" — is a good instinct, but it is about a distinction that no longer exists.
- **Belongs in current documentation?** One line: that a legacy DB-chain checker exists in the archive and does not pass. Already recorded in `docs/backend/README.md`.
- **Part of `npm run qa`?** **No, and it must not be.** It fails by design against a chain that will not be applied.

---

## 5. Valuable knowledge identified

| # | Knowledge | Source | Verified? | Already protected? |
|---|---|---|---|---|
| K1 | Slugs are live public URLs; never regenerated, normalized, or tidied for aesthetics | 013:11-14 | Yes | **Yes** — `docs/PROGRAMME_CATALOGUE_RULES.md` §1.1 |
| K2 | **A programme rename must not change its slug** (URL pinned independently of title) | 013:16-19 | Yes (design rule) | **NO — must be added** |
| K3 | **No URL redirects have ever existed**; slug space never remapped | 013:73-75 | Yes — router has no redirect logic | **NO — must be added** |
| K4 | Slug format `^[a-z0-9][a-z0-9-]{0,127}$` | 013:56 | **Yes — 135/135 conform**, max 78 chars | **NO — unenforced by active QA** |
| K5 | Programme code format `^GIBS-[A-Z]{3}-(?:[A-Z0-9]{2,3}-)?[0-9]{2,3}$` | 012:189 | **Yes — 135/135 conform** | **NO — parity checks uniqueness only** |
| K6 | Category/destination filtered by exact string equality; a typo silently empties a filter | 012:57-60, 020:13-15 | **Yes** — `Programmes.tsx:54,58-60` | Partially (distribution enforced; the *why* is not stated) |
| K7 | Year model: publishing a catalogue year never destroys the previous one | 010:15-17 | Concept | **Yes** — rules doc §4 |
| K8 | Fee representation is three-way; the 2 secondary tiers must not be tidied away | 017:8-30 | Yes | **Yes** — retained parity gate |
| K9 | "Local" is a real destination, not NULL (113/135) | 012 COMMENT | Yes | **Yes** — retained parity gate |
| K10 | Reference values (15 categories, 5 destinations) | 020 | Yes | **Yes** — `_programme_source.py` + parity |

**Net: five items (K2, K3, K4, K5, K6) are verified live knowledge that is not yet
protected anywhere and would be lost on archival.** K4 and K5 are also currently
*unenforced* — nothing in `npm run qa` would catch a malformed slug or code.

---

## 6. Recommended archive location

**`archive/backend/` at the repository root**, mirroring the original paths:

```
archive/
└── backend/
    ├── README.md              ← mandatory status banner (see below)
    ├── db/schema/             ← the 8 .sql files, unmodified
    └── scripts/
        ├── db/                ← apply_schema.py, provision_roles.sql
        ├── import/            ← programmes_to_sql.py  (or delete; see §7)
        └── qa/                ← schema_chain_check.py
```

Justification, against the `docs/archive/backend/` alternative:

- **These are code artefacts, not prose.** They are `.sql` and `.py`. Keeping
  `docs/` purely documentary preserves its current meaning (every file in `docs/`
  today is Markdown). This was verified: `find . -name "*.md"` returns Markdown only.
- **Strongest separation signal.** `archive/` sits outside `src/`, `scripts/`, and
  `db/`, so nothing can mistake it for runtime or tooling. `tsconfig.json` `include`
  is `["src","vite.config.ts"]`, so no archived `.py` can ever enter a typecheck or
  build.
- **One obvious location** rather than scattering archives across `docs/`.

`archive/backend/README.md` must state, in the first lines:

> Historical / legacy backend implementation retained for reference.
> **Not active application infrastructure.** Never executed against any database.
> GIBS has no backend, no API, and no database. Do not apply, run, or wire this up.

Honest caveat to record in that README: archived scripts **will not run in place**,
because `apply_schema.py` computes `REPO` from its own location and because it
references three migrations that were deleted. That is acceptable for reference
material, but it must be stated so nobody later "fixes" it into a live migration path.

---

## 7. What can safely be removed vs. must be extracted first

**Extract into `docs/PROGRAMME_CATALOGUE_RULES.md` (a docs-only edit — no code, no data, no slugs):**
1. K2 — rename must not change the slug.
2. K3 — no redirects have ever existed.
3. K4 — slug format rule.
4. K5 — programme code format rule.
5. K6 — exact-string-equality filtering trap.

**Then:**
- **Archive (retain for reference):** the 8 SQL files, `apply_schema.py`, `provision_roles.sql`, `schema_chain_check.py`.
- **Remove (nothing unique lost):** `programmes_to_sql.py` — proven in §4 to hold no
  transformation logic of its own; all of it lives in the retained `_programme_source.py`.
  If you would rather keep it, archive it alongside the rest; that is also acceptable
  and is the lower-risk option.
- **Must remain in the active tree:** `src/lib/data.ts`, `db/legacy/programmes.snapshot.json`,
  `scripts/qa/parity_check.py`, `scripts/qa/generator_drift_check.py`,
  `scripts/import/_programme_source.py`, `scripts/import/export_snapshot.py`,
  `scripts/qa/regression.mjs`, `scripts/validate_current_data.py`, `scripts/generate_data_ts.py`,
  `scripts/generate_gibs_data.py`, `src/`, `docs/`, `package.json`, `vercel.json`.

---

## 8. What must remain in the active tree

`db/` remains in the active tree, but only for `db/legacy/programmes.snapshot.json`,
which is an active input to two gates in `npm run qa`. `db/schema/` leaving the
active tree does **not** mean `db/` becomes empty. Do not delete `db/`.

---

## 9. Exact proposed next-step operations (NOT performed)

Sequenced so that no knowledge is ever at risk:

1. Edit `docs/PROGRAMME_CATALOGUE_RULES.md` — add K2, K3, K4, K5, K6. Verify `npm run qa` still exit 0 and all 135 slugs byte-identical.
2. Create `archive/backend/README.md` with the status banner and the not-runnable caveat.
3. Create `archive/backend/db/schema/` and `archive/backend/scripts/{db,qa}/`; copy the 8 SQL files, `apply_schema.py`, `provision_roles.sql`, `schema_chain_check.py` in **unmodified**.
4. Verify copies are byte-identical (`sha256sum` before/after).
5. Update `docs/backend/README.md`: move those entries from "Legacy backend material" to "Archived at `archive/backend/`"; keep the `npm run qa` scope note.
6. Delete the now-empty originals: `db/schema/`, `scripts/db/`, `scripts/qa/schema_chain_check.py`. **Confirm the copies first, and confirm `scripts/import/` still holds `_programme_source.py` and `export_snapshot.py`.**
7. Decide `programmes_to_sql.py`: remove, or copy to the archive.
8. Update `BACKEND_CLEANUP_DECISION.md` §7/§8/§13 to record the archival.
9. Final verification: `npm run qa`, `npx tsc --noEmit`, `npm run build`; 135 programmes; 135 slugs byte-for-byte; `src/lib/data.ts` sha256 `910ff4d75ad3110aa3062e0f…` unchanged; no `/api/` in `src/`.

Note on step 6: `scripts/qa/schema_chain_check.py` is the only file in
`scripts/qa/` to be removed. `parity_check.py`, `generator_drift_check.py`, and
`regression.mjs` stay. Removing it will also remove the last importer of nothing —
`_programme_source` is still imported by `parity_check.py`, which is retained.

---

## 10. Decisions requiring explicit authorization

Nothing in §9 has been done. I need approval on:

1. **Archive location:** `archive/backend/` at root (recommended) vs `docs/archive/backend/`.
2. **Archive vs remove** for the 8 SQL files. Recommended: **archive** — `013`, `012`, and `010` carry K2–K7, and archiving preserves the full rationale even after extraction.
3. **`programmes_to_sql.py`:** remove (nothing unique) or archive (lower risk)? Recommended **remove**, with the option to archive if you prefer belt-and-braces.
4. **`apply_schema.py` / `provision_roles.sql`:** archive (recommended) — no GIBS-specific knowledge, but the applier's design is decent reference material.
5. **`schema_chain_check.py`:** archive as legacy QA (recommended). Confirm it stays out of `npm run qa`.
6. **Adding K2–K6 to the rules doc**, including two currently-unenforced invariants (slug format, code format). Confirm you want these documented now. Optionally they could later become enforced assertions — a **separate** decision, and explicitly not part of this step.
7. **Relocating `db/legacy/programmes.snapshot.json`** out of `db/` now that `db/schema/` is leaving, so the retained artefact is not left under a directory whose name implies an absent database. Recommended: yes, but purely cosmetic and it touches an active QA input's path, so it needs care and re-verification.

No ambiguity blocks the plan. The single judgement call with real consequence is
**#2 (archive vs remove the SQL)**: removing would discard the written rationale
behind K2–K7 permanently, which is why archival is recommended.
---

# 11. Implementation result (executed 2026-10-04)

Executed under explicit authorization. No PostgreSQL started or installed, no SQL
executed, no migration run, no `rm -rf`/`kill`/`su`/`runuser`, no commit, push,
deploy, reset, checkout, stash, or clean. `vercel.json` untouched. The `or True`
assertion untouched.

## 11.1 Files archived (11) — copied, verified byte-identical, then originals removed

| Original path | Bytes | SHA-256 (original = archived copy) |
|---|---|---|
| `db/schema/010_catalogue_year.sql` | 5,336 | `4e8485e73d8e894211b28a8fcd65d2bdb565f729d8bf265474249b5f6c164c00` |
| `db/schema/011_programme_lineage.sql` | 3,896 | `c97912b836e3582cb1da69e74d33a438c7821f336df10e9cbb69c123f6a249b3` |
| `db/schema/012_catalogue_programme.sql` | 12,092 | `0e877a0ddea26478111fd679acd4d7452ebf40ff73c968c2c1cf2f4f1e4d878a` |
| `db/schema/013_programme_url.sql` | 8,308 | `f14ea5285c8374eb66ca3f2ed8f0b0a7106c90af79a738908a9e5e6bd0ae28b6` |
| `db/schema/017_programme_fee.sql` | 6,902 | `f94d6a3530d9b1c951a578b5f257dbc8174f4e48cb9a467e8b199f5bae669056` |
| `db/schema/018_lifecycle_functions.sql` | 29,103 | `283793b2bc4264023bd8af4ffa8411a4206c61fbfb785ce4dbd1b4ba6031c7f3` |
| `db/schema/019_rls_policies.sql` | 16,416 | `226105280b75081cb22632e12aa8d9e6330aceaddcf101892f45afe003fe76b1` |
| `db/schema/020_reference_seed.sql` | 9,507 | `b822d3b5e44b5fa0cd7327cf891835bb6ff139ba13dafe95c2dc063bf0d61e2c` |
| `scripts/db/apply_schema.py` | 38,513 | `205a5bec23518fe07397b5638acbfab0256fafd23912f233b6f7085d5aecdea6` |
| `scripts/db/provision_roles.sql` | 7,340 | `9c545b9318a053aa9de206fc7b69dffa0e099f2a5c62d9184d093a96c7b98457` |
| `scripts/qa/schema_chain_check.py` | 18,268 | `f0e88e2d686239752566318d16cfa9446375a957eb31f9e9d8d673ddd8525936` |

Hashes recorded **before** any file operation, then re-verified on the archive
copies: **11/11 byte-identical, 0 mismatches.** Only after that verification were
the originals removed, individually, by explicit path. Emptied directories
`db/schema/` and `scripts/db/` were then removed with `rmdir` (which cannot delete
a non-empty directory).

Archive layout, mirroring the original paths:

```
archive/backend/README.md
archive/backend/db/schema/          (8 .sql files)
archive/backend/scripts/db/         (apply_schema.py, provision_roles.sql)
archive/backend/scripts/qa/         (schema_chain_check.py)
```

`archive/backend/README.md` states, in its opening lines, that the files are
historical and not active infrastructure, are not part of `npm run qa`, are not
intended to be executed in place, that the chain is not executable, that GIBS has
no PostgreSQL/backend/API, and that archived scripts will not run in place and
must not be "fixed" into a live migration path.

## 11.2 Files removed (1)

| Path | Bytes | SHA-256 (audit trail) |
|---|---|---|
| `scripts/import/programmes_to_sql.py` | 8,097 | `7db6d5621ae181f0d39e396e8056c22dcee0f4217a6dc93ee8f7406ce2b18ec2` |

Removed, not archived. It held no unique catalogue transformation logic — every
transformation is delegated to `scripts/import/_programme_source.py`, which is
retained and actively used by `npm run qa`.

## 11.3 Files intentionally retained in the active tree

| Path | Why retained |
|---|---|
| `src/lib/data.ts` | The product. Untouched. |
| `db/legacy/programmes.snapshot.json` | Active input to `parity_check.py` and `export_snapshot.py --check`. Left at this exact path per instruction; contents unaltered (376,343 bytes). `db/` therefore still exists — correctly. |
| `scripts/qa/parity_check.py` | Repaired catalogue gate. Not modified in this operation. |
| `scripts/qa/generator_drift_check.py` | Generator-drift gate. Not modified. |
| `scripts/import/_programme_source.py` | Shared catalogue parser. Not modified. |
| `scripts/import/export_snapshot.py` | Snapshot generation + `--check` gate. Not modified. |
| `scripts/qa/regression.mjs` | Playwright regression for post-deploy verification. Not modified. |
| `scripts/generate_data_ts.py`, `generate_gibs_data.py`, `validate_current_data.py` | Catalogue generation/validation. Not modified. |
| `src/`, `package.json`, `vercel.json`, `docs/` | Product and configuration. Not modified. |

## 11.4 Documentation updated

| File | Change |
|---|---|
| `docs/PROGRAMME_CATALOGUE_RULES.md` | Added the five verified rules **before** archival: §1.5 rename ≠ slug rename; §1.6 no slug remapping; §1.7 slug format; §2 programme code format; §3 exact category/destination equality. Existing sections renumbered 4–7. No new rules invented. |
| `docs/backend/README.md` | Restructured into **Active** / **Archived** / **Removed**, with a link to `archive/backend/README.md` and the explicit non-executable-chain warning. |
| `archive/backend/README.md` | **New.** Mandatory status banner, contents listing, extraction summary, provenance. |
| `BACKEND_ARCHIVE_PLAN.md` | This §11. |
| `BACKEND_CLEANUP_DECISION.md` | Superseded for §§7–8 by this document; §13 items 2–6 now closed. |
| `BACKEND_SCOPE_RESET*.md`, `BACKEND_ARCHITECTURE_DECISION.md` | **Not rewritten.** SUPERSEDED banners retained as-is. |

## 11.5 Exact verification results

| Verification | Command | Result |
|---|---|---|
| Catalogue QA | `npm run qa` | **exit 0** — `23/23 checks passed`; `regeneration is byte-identical to the committed data.ts`; `snapshot is current (135 records, source sha256 910ff4d75ad3…)` |
| TypeScript | `npx tsc --noEmit` | **exit 0** |
| Production build | `npm run build` | **exit 0** — `dist/index.html 971.12 kB │ gzip: 202.50 kB`, built in 20.24s |
| Programme count | catalogue | **135** |
| Destinations | catalogue | Local 113 · Kigali 8 · Dubai 5 · London 4 · Houston 5 |
| Slug integrity | before/after SHA-256 | **135/135 byte-for-byte identical, order included** |
| `data.ts` SHA-256 | before/after | `910ff4d75ad3110aa3062e0f…` **UNCHANGED** |
| ids / codes / nums SHA-256 | before/after | all **UNCHANGED** |
| Snapshot | size + hash | 376,343 bytes, `90126451048a22e6…` — **unmodified** |
| `api/` directory | `test -e` | **does not exist** |
| Active code → archived paths | grep | **no functional references** |
| Active code → `programmes_to_sql.py` | grep | **no functional references** |
| Archive in typecheck scope | `tsconfig.json` | `include: ["src","vite.config.ts"]` — **archive excluded** |
| Archive in build scope | grep `vite.config.ts`, `src/` | **no reference** |
| `vercel.json` | git status | **unmodified** |

**The archive is not a runtime dependency.** Nothing in `src/`, `scripts/`,
`package.json`, `vercel.json`, `vite.config.ts`, or `tsconfig.json` references
`archive/`, and no archived file can enter a typecheck or build.

Two prose-only references to now-archived/removed paths remain inside retained
files, both deliberate:
- `scripts/qa/parity_check.py:19` — a docstring line recording *what was removed*
  during the authorized subtraction. Editing it was explicitly out of scope.
- `scripts/import/_programme_source.py:6,236-237` — module docstring and a
  generated SQL header string naming `programmes_to_sql.py` and
  `db/schema/002_programme_seed.sql`. That file was explicitly not to be modified,
  and it is an active QA input, so it was left untouched.

Neither is a functional dependency; both are stale mentions in comments/strings.

## 11.6 Final active architecture

```
Public visitor
     ↓
Static React/Vite SPA — one self-contained index.html, no server runtime
     ↓
src/lib/data.ts          authoritative catalogue (135 programmes, 137 fees)
     ↓                      generated; drift-checked byte-for-byte
mailto:                   Contact page builds a validated mailto: link
     ↓
GIBS inbox                all follow-up handled outside the website
```

No database. No PostgreSQL. No API. No serverless functions. No environment
variables. No secrets. No accounts, payments, admissions workflow, CRM, enquiry
persistence, subscriptions, or audit logging.

Active QA — `npm run qa` → exit 0: `parity_check.py` (23/23),
`generator_drift_check.py` (byte-identical), `export_snapshot.py --check`
(snapshot current).

## 11.7 Remaining backend-related material

**In the active tree: none.** No PostgreSQL schema, no DB provisioning, no
DB schema-chain validation, no SQL generator, no API, no DB directory beyond the
retained snapshot.

**In `archive/` (historical, never executed, not runnable in place):** 8 SQL
migrations, `apply_schema.py`, `provision_roles.sql`, `schema_chain_check.py`.

**Removed outright:** the `api/` tree, and `programmes_to_sql.py`.

## 11.8 Not done, deliberately

- The vacuous `or True` assertion in `parity_check.py:149` — untouched, as
  instructed. Still 22 real assertions presented as 23.
- K4 (slug format) and K5 (code format) are documented conventions, **not
  enforced assertions**. Converting them into `npm run qa` checks is a separate
  decision.
- `vercel.json`'s `api/` SPA-rewrite lookahead — left alone; it now excludes a
  non-existent path and is harmless.
