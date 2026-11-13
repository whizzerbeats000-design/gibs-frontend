# GIBS — Backend Cleanup Decision

Status: **catalogue QA repaired · documentation corrected · QA entry point created ·
`api/` tree REMOVED (2026-10-04).**

**Still not done, pending separate authorization:** no database archival or removal.
`db/schema/` (8 files), `scripts/db/` (2), `scripts/qa/schema_chain_check.py`, and
`scripts/import/programmes_to_sql.py` are all untouched.

The vacuous `or True` assertion previously deferred in §4 has since been
**replaced with a real assertion**, and the gate has been strengthened to
**26 assertions**. See §4 and `docs/BACKEND_CATALOGUE_QA.md`.

Method: read-only analysis plus the specifically authorized repairs. No PostgreSQL,
no `initdb`, no `psql`, no `su`/`runuser`, no `rm`/`kill`/`pkill`, no
`git reset`/`clean`/`stash`/`checkout`, no commit, no push, no deploy.
All unrelated working-tree changes preserved.

Supersedes `BACKEND_SCOPE_RESET.md`, `BACKEND_ARCHITECTURE_DECISION.md`, and the
inventory section of `BACKEND_SCOPE_RESET_VERIFIED.md` on all facts.

---

## 1. Current architecture

```
Public visitor
     ↓
Static React/Vite SPA — one self-contained index.html, no server runtime
     ↓
src/lib/data.ts          authoritative programme catalogue (135 programmes, 137 fees)
     ↓                      generated; drift-checked byte-for-byte
mailto:                   Contact page builds a validated mailto: link
     ↓
GIBS inbox                all follow-up handled outside the website
```

- React/Vite frontend · source-controlled catalogue in `src/lib/data.ts`
- Version/year concept retained (source control, not a DB column)
- No database · no PostgreSQL · no API/backend requirement
- No accounts, payments, admissions workflow, CRM, enquiry persistence,
  subscriptions, audit logs, or transactional backend

## 2. Why no backend is required

Verified this session, not assumed:

- `grep` for `fetch(`/`axios`/`XMLHttpRequest`/`/api/` across `src/` and
  `index.html` → **no matches**. The frontend has zero backend dependency.
- `src/pages/Contact.tsx:67` constructs `mailto:`; `onSubmit` (line 70) only
  guards the anchor. Nothing is transmitted to a server.
- `npm run build` → exit 0. `dist/index.html` 971.12 kB / 202.50 kB gzip —
  byte-identical to the pre-change figure, confirming nothing entered the bundle.
- The catalogue is already a controlled artefact: it is generated, and
  `generator_drift_check.py` proves the committed file is reproducible.

A visitor reading institutional information needs content and a way to make
contact. Both are delivered statically. A database would add a runtime dependency
without adding a product capability.

## 3. Catalogue QA retained

| Gate | Protects | Status |
|---|---|---|
| `scripts/qa/parity_check.py` (repaired) | 26 catalogue invariants of the shipped data | **PASS 26/26** |
| `scripts/qa/generator_drift_check.py` | `data.ts` == generator output; 6 runtime-required exports | **PASS** |
| `scripts/import/export_snapshot.py --check` | snapshot ↔ live catalogue SHA-256 binding | **PASS** |

Also retained unchanged: `scripts/generate_data_ts.py`,
`scripts/generate_gibs_data.py`, `scripts/validate_current_data.py`,
`scripts/qa/regression.mjs`, `scripts/import/_programme_source.py`,
`db/legacy/programmes.snapshot.json`, `src/lib/data.ts`.

`_programme_source.py` and `export_snapshot.py` were **kept inside
`scripts/import/`** deliberately: the repaired parity gate imports
`_programme_source`, so deleting that directory wholesale would break catalogue QA.

## 4. Exactly how `parity_check.py` was repaired

Repair by **subtraction only**. No catalogue assertion was rewritten, relaxed, or
simplified.

- **Path correction:** the audit request named `scripts/import/parity_check.py`.
  The file is at `scripts/qa/parity_check.py`. Repaired in place.
- **Removed — 249 lines, four definitions:**
  `check_importer()` (snapshot→SQL importer determinism, row counts, upsert-only
  assertions, credential scans), `check_schema()` (parsed
  `db/schema/001_programme.sql` for table/FK/COMMENT/CHECK validity and importer
  column coverage), and the helpers `_strip_sql_noise()` and `_split_statements()`.
- **Removed — supporting dead constants/import:** `SCHEMA`, `IMPORTER`, and the
  now-unused `re` import.
- **Removed from `main()`:** the `check_importer` / `check_schema` calls, and the
  closing "Not verified here: that a PostgreSQL server accepts this schema"
  message, which described a gate that no longer exists.
- **Rewritten:** the module docstring and the print banner only, to describe the
  gate's actual scope. No assertion text or logic changed.
- **Deleted lines were bounded by assertion, not by guesswork.** A first attempt
  used an off-by-one end boundary; the boundary assertion caught it before any
  write. Deletion then ran with six content assertions on the cut points.
- Sections 1–3 (`check_snapshot`, `check_source_invariants`, `check_fees`) are
  byte-identical to before.

Result: 463 → 214 lines; **23/23 PASS, exit 0** (later strengthened to 26/26 — §4a).

### 4a. The vacuous assertion has since been fixed, and the gate strengthened

The defect flagged in §4 was later authorized and fixed. `parity_check.py` is now
**26/26 PASS, exit 0**. The full assertion inventory is in
`docs/BACKEND_CATALOGUE_QA.md`.

**The `or True` defect.** The original check tested only `programmes[0]`, so it was
both vacuous *and* under-scoped. It was replaced by two-sided assertions over the
**full** record set:

| Assertion | Purpose |
|---|---|
| `no source field named 'requirements' is rendered` | the field is absent from the canonical record |
| `omitted 'requirements' is not promoted to a canonical field` | absence holds for **every** record, not just the first |
| `omitted 'requirements' survives inside the legacy blob` | the data is preserved, not discarded |

Both directions were mutation-tested: injecting a canonical `requirements` key fails
the first pair, and deleting the legacy-blob copy fails the third. Neither can pass
vacuously.

**Two further invariants added.** Both are format checks over all records, and both
were negative-tested against deliberately mutated copies:

- `slug matches the public URL format` — enforces the rule in
  `docs/PROGRAMME_CATALOGUE_RULES.md`. Caught a real gap: slugs are the public URL
  segment, and nothing previously verified they were URL-safe. The pattern is
  `[a-z0-9]+(?:-[a-z0-9]+)*`; note it permits a trailing hyphen, which the rule
  documents and the router tolerates, so that shape is intentionally accepted.
- `code matches the established programme code format` — pins the `KGL-01` /
  `DUB-02` shape so a malformed code cannot silently pass uniqueness checks.

**Catalogue data was not touched.** `src/lib/data.ts` remains byte-for-byte
identical (SHA-256 prefix `910ff4d75ad3110aa3062e0f`) and the snapshot binding
still verifies. This was a gate-honesty change only: no catalogue value, count, or
ordering changed.

## 5. DB gates archived rather than repaired

Neither was repaired, adapted, or made to pass. Both remain on disk, untouched.

| Gate | Why it is legacy tooling | Action |
|---|---|---|
| `scripts/qa/schema_chain_check.py` | Own docstring: catches cross-file SQL defects *before the chain is applied to PostgreSQL*. That will never happen. Fails on deleted `014/015/016` and asserts `001/002` still exist. | **ARCHIVE** (pending approval) |
| `scripts/db/apply_schema.py` | Applies `010-020` to PostgreSQL. Only `--check` (offline) ever run; now fails on the same missing files. | **ARCHIVE** (pending approval) |

They are **excluded from `npm run qa`**, so no obsolete database gate is presented
as current QA. No PostgreSQL was started or installed; no DB dependency was added.

## 6. The `api/` tree — REMOVED

**Removed 2026-10-04 under explicit authorization.** Exact files, with the
pre-removal state recorded for the audit trail:

| File | Bytes | sha256 (first 16) |
|---|---|---|
| `api/_lib/db.ts` | 1,297 | `2e50776e5b1fb8ce` |
| `api/_lib/shared.ts` | 3,675 | `512e87f527904db7` |
| `api/catalogue.ts` | 4,440 | `b0990fdc8c6976fb` |
| `api/programmes/[slug].ts` | 6,020 | `361d1370e1526de6` |

15,432 bytes across 4 files, plus the now-empty directories `api/`,
`api/_lib/`, `api/programmes/`. These are exactly the four files classified as
REMOVE in §13 item 1 of the previous revision of this document.

Removed individually with explicit paths (no `rm -rf`, no wildcards; the
`[slug].ts` path was quoted so the glob characters could not expand), then the
empty directories with `rmdir`, which cannot remove a non-empty directory.

Read-only inventory performed immediately before removal, re-confirmed:

| Check | Result |
|---|---|
| Referenced by frontend | **No** — no `fetch`/`axios`/`XMLHttpRequest`/`/api/` in `src/` or `index.html` |
| Referenced by package scripts | **No** |
| Referenced by any retained script | **No** |
| Imported by anything | **No** |
| Deployment dependencies added | **None.** `pg` and `@vercel/node` were not installed and were not added. |

**Rationale for removal:** it was obsolete backend implementation for a
PostgreSQL catalogue API. Every query targeted abandoned-chain tables;
`[slug].ts` was a thin wrapper over the DB function `resolve_programme_url()`;
`shared.ts` was generic Vercel boilerplate whose only reusable piece (an email
regex) is already duplicated in `Contact.tsx`. Because Vercel auto-detects an
`api/` directory and builds it as serverless functions, leaving it in place meant
`pg`/`@vercel/node` would be unresolvable at deploy time — a build-failure risk
for a product that needs no backend at all.

**⚠ The Vercel auto-detection risk is now resolved.** No `api/` directory
remains, so no serverless function will be built. `vercel.json:5` retains
`api/` in its SPA-rewrite negative lookahead; that is harmless (it excludes a
path that does not exist) and was left untouched as frontend configuration.

**Database archival was NOT started.** `db/schema/`, `scripts/db/`,
`programmes_to_sql.py`, and `schema_chain_check.py` are untouched.

## 7. What happened to `db/schema/`

**Nothing was deleted or moved.** Classified:

| File | Classification | Reason |
|---|---|---|
| `013_programme_url.sql` | **ARCHIVE** (after extraction) | Carries the slug-stability rule — now extracted to `docs/PROGRAMME_CATALOGUE_RULES.md`, so archiving loses no knowledge |
| `010`, `011`, `012`, `017`, `020` | **ARCHIVE** | Never executed; prose records real domain rationale (year model, fee representation) |
| `018_lifecycle_functions.sql` | **ARCHIVE** | Never-executed clone/publish/archive machinery; no current role |
| `019_rls_policies.sql` | **ARCHIVE** | Never-executed RLS posture; no current role |

No current code, QA gate, or deployment config depends on any of them.

## 8. What happened to import scripts

| Path | Classification | Reason |
|---|---|---|
| `scripts/import/_programme_source.py` | **KEEP** | Imported by the repaired parity gate; supplies `CATEGORY_ORDER`, `DESTINATION_ORDER`, `CURRENCIES`, `source_sha256()`, `build_canonical_rows()`, `expected_display_fee()` |
| `scripts/import/export_snapshot.py` | **KEEP** | `--check` is a live catalogue gate in `npm run qa` |
| `scripts/import/programmes_to_sql.py` | **REMOVE** (pending) | Importer for the deleted `001_programme.sql`. No gate uses it once §4–5 are gone |

`scripts/db/apply_schema.py` and `scripts/db/provision_roles.sql` →
**ARCHIVE** (pending). `provision_roles.sql` exists solely to create the three
cluster roles that `019` expects.

## 9. URL invariants preserved

Created **`docs/PROGRAMME_CATALOGUE_RULES.md`** (current, non-deprecated) carrying
the rule forward before any archival of `013`:

> Existing programme slugs are stable public URL identifiers. They must not be
> regenerated, normalized, or renamed merely for aesthetic reasons. Any
> intentional slug change requires an explicit migration/redirect strategy.

No URL policy was invented. Verified facts recorded: 135 slugs, all unique;
prefix families `course-*` (113) and `foreign-*` (22); length 38–78 chars; 45
slugs at exactly 70 chars; 12 ending in a single-character segment
(mid-word cuts). Enforcement is documented: a hand edit to `data.ts` fails the
drift gate, so a slug can only change by changing the generator — making it a
reviewable act.

## 10. Documentation corrected

| File | Correction |
|---|---|
| `docs/PROGRAMME_CATALOGUE_RULES.md` | **NEW.** Current catalogue + URL rules. |
| `docs/backend/API_CONTRACTS.md.deprecated` | Header rewritten from `**Status**: Implemented as Vercel serverless functions` to **"ARCHIVED HISTORICAL MATERIAL. NOTHING HERE IS IMPLEMENTED."** This was the clearest false statement in the repo. |
| `.env.example` | Removed the backend variable block (`GIBS_DATABASE_URL`, `GIBS_DATABASE_SSL`, `GIBS_CORS_ORIGIN`), which claimed to be *"Required for all API endpoints to function"* while the same file claimed no env vars are required. Replaced with an explicit no-backend statement. **No new variables invented.** |
| `docs/backend/README.md` | Replaced "What remains" with "What is actually in use" + "Legacy backend material — NOT part of this product". Removed the false claim that `api/_lib/*` was kept "to avoid breaking unrelated imports if present" (no such imports exist). Added the Vercel auto-detection warning. |
| `docs/security/security-headers.md` | Audited — already honest ("intended, not active"). **Unchanged.** |
| `.gitignore` | Removed the stale `db/schema/002_programme_seed.sql` rule and its 4-line comment. The file now matches HEAD exactly. No other rule touched — `__pycache__/`, `*.py[cod]`, `.env*`, `node_modules`, `dist`, logs, screenshot globs, OS/IDE entries all remain valid. |

The three `BACKEND_*.md` reports were **not** modified; they are superseded by this
file. `vercel.json` was left unchanged (its `api/` exclusion is harmless).

## 11. New canonical QA command

```
npm run qa
```

Runs exactly the three current-product gates, chained so any failure stops the run:

```
python3 scripts/qa/parity_check.py
  && python3 scripts/qa/generator_drift_check.py
  && python3 scripts/import/export_snapshot.py --check
```

This is the minimal appropriate solution: no CI system, no new services, no new
dependencies. It exists because the audit found **no QA entry point at all**,
which is how a stale "45/45 PASS" survived unnoticed.

**Current QA** = the three gates above.
**Archived legacy DB QA** = `schema_chain_check.py`, `apply_schema.py --check`.
Neither is invoked by `npm run qa`, and this document does not claim they pass.

## 12. Exact verification results

| Verification | Command | Result |
|---|---|---|
| Canonical QA | `npm run qa` | **exit 0** — 26/26 catalogue checks, drift byte-identical (394,667 B), snapshot current (`910ff4d7…`) |
| TypeScript | `npx tsc --noEmit` | **exit 0** |
| Production build | `npm run build` | **exit 0** — `dist/index.html` 971.12 kB, gzip 202.50 kB, built in 21.27s |
| Frontend backend coupling | `grep` `fetch(`/`axios`/`XMLHttpRequest`/`/api/` in `src/`, `index.html` | **no matches** |
| Catalogue count | parity gate | 135 records |
| Destinations | parity gate | Local 113 · Kigali 8 · Dubai 5 · London 4 · Houston 5 |
| Categories | parity gate | 15 |
| Uniqueness | parity gate | `id`, `code`, `slug`, `num` all unique |
| Fee invariants | parity gate | display reproducible; 2 secondary tiers; currencies `{NGN,USD,GBP}` |
| Snapshot hash | parity gate + `--check` | matches live `src/lib/data.ts` |

**URL safety — before/after, recorded before any change was made:**

| Field | Before | After | Match |
|---|---|---|---|
| `data.ts` sha256 | `910ff4d75ad3110a…` | `910ff4d75ad3110a…` | YES |
| slug list sha256 | `301733c40f38fa6d…` | `301733c40f38fa6d…` | YES |
| slug order sha256 | `215cb92caa3a2fdc…` | `215cb92caa3a2fdc…` | YES |
| ids / codes / nums sha256 | — | — | YES (all four) |
| Full ordered slug list | 135 lines | 135 lines | **identical** |

`src/lib/data.ts` was not modified. The remaining modified `src/` files
(`PageHero`, `ProgrammeNav`, `cards`, `chrome`, `router`, `Contact`) are
pre-existing frontend remediation work, untouched.

**Deployment safety:** `api/` is **still present**, so the Vercel auto-detection
risk is **still live**. This cannot be resolved without removal approval.
Nothing was deployed.

## 13. Remaining ambiguity requiring explicit approval

Nothing below was executed. Tracked-file changes this session: `package.json`
(+1 line) and `.gitignore` (now identical to HEAD).

| # | Item | My recommendation |
|---|---|---|
| 1 | ~~**`api/` (4 files)**~~ | ✅ **DONE 2026-10-04** — removed; Vercel risk resolved |
| 2 | **Archive destination and format** for SQL + DB scripts | `docs/backend/archive/`, each file headed "ARCHIVED — never executed, no current role". *Awaiting authorization.* |
| 3 | `db/schema/` (8 files) after `013` is extracted | ARCHIVE. *Not started — separate decision.* |
| 4 | `scripts/db/` (2 files) | ARCHIVE. *Not started — separate decision.* |
| 5 | `scripts/qa/schema_chain_check.py` | ARCHIVE (excluded from `npm run qa` either way). *Not started.* |
| 6 | `scripts/import/programmes_to_sql.py` | REMOVE — **held**, not started. It is coupled to the database-archive decision (it targets `001_programme.sql` and is referenced by the same legacy cluster), so it was deliberately left in place rather than removed out of sequence. |
| 7 | Fix the vacuous `requirements` assertion | REPAIR — makes the gate honest. **DONE** — replaced with three two-sided, mutation-tested assertions over all records. See §4a. |
| 8 | Drop `api/` from the `vercel.json` rewrite lookahead | Optional, cosmetic. Now referencing a non-existent path; harmless. Not modified — frontend config. |
| 9 | Relocate the snapshot out of `db/legacy/`; its `artifact_notice` still calls it a "MIGRATION ARTIFACT" | Cosmetic wording fix |
| 10 | Keep, relabel, or delete `BACKEND_SCOPE_RESET.md` / `BACKEND_ARCHITECTURE_DECISION.md` / `BACKEND_SCOPE_RESET_VERIFIED.md` | **Partially done** — all three now carry a SUPERSEDED banner; bodies left intact as history |

**Recommendation on sequencing:** item 1 first, since it is the only one with a
live deployment consequence. Items 3–6 are safe to execute together once an
archive location is agreed.

Nothing in this repository is being optimised for size. The standard applied was:
correct current architecture, trustworthy QA, preserved catalogue integrity,
preserved URL knowledge, honest documentation, safe Vercel deployment.