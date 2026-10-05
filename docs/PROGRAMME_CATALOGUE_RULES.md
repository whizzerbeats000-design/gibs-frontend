# GIBS Programme Catalogue Rules

Status: **CURRENT.** This file is authoritative for programme-catalogue rules.
It is not historical, not deprecated, and not a description of an abandoned design.

Scope: the programme catalogue in `src/lib/data.ts` — the data visitors actually
see. The site is a public informational website. There is no database and no API;
this catalogue is the source of truth.

---

## 1. Programme URLs

### 1.1 Existing slugs are a public contract — never regenerate them

**Existing programme slugs are stable public URL identifiers. They must not be
regenerated, normalized, or renamed merely for aesthetic reasons. Any
intentional slug change requires an explicit migration/redirect strategy.**

Many existing slugs are truncated mid-word because the generator derives the slug
from the programme title under a fixed length budget. They are ugly. **They are
also live, inbound-facing URLs, and they are load-bearing.** An improvement that
silently rewrites them is a regression, not a cleanup.

Consequently, for the existing catalogue:

- Do not regenerate slugs.
- Do not normalize, tidy, prettify, or "improve" them.
- Do not change punctuation, hyphenation, truncation points, or word boundaries.
- Do not derive ids from names, and do not introduce automatic slug regeneration
  for existing records.
- Do not shorten, re-case, or transliterate a slug.

### 1.2 Verified properties of the current 135 slugs

Measured from `src/lib/data.ts` on 2026-10-04 (135 programmes):

| Property | Value |
|---|---|
| Total slugs | 135 |
| Unique slugs | 135 (no duplicates) |
| Prefix families | `course-*` (113, all Local) · `foreign-*` (22, all out-of-country) |
| Length range | 38–78 characters |
| Length clustering | 45 slugs sit at exactly 70 characters |
| Unambiguous mid-word cuts | 12 slugs end in a single-character segment (e.g. `…-for-the-private-and-public-s`) |

The 70-character cluster and the 12 single-character endings are the observable
signature of title-derived truncation under a length budget. That truncation is
part of the current URL contract and is **not** a defect to be corrected.

### 1.3 Why the rule is technically enforced today

Two existing gates protect this, and both must stay green:

- `scripts/qa/generator_drift_check.py` compares `src/lib/data.ts`
  byte-for-byte against the output of `scripts/generate_data_ts.py`. Editing a
  slug directly in `data.ts` **fails** this gate. The only way to change a slug
  is to change the generator, which makes the change deliberate and reviewable in
  a diff rather than silent.
- `scripts/qa/parity_check.py` asserts slug uniqueness across all 135 records.

### 1.4 If a slug must ever change

A slug change is a URL-contract change, not a data edit. It requires an explicit
migration and redirect strategy agreed before the change lands, so existing
inbound links and search rankings survive. No such strategy is defined today
because no slug change is currently proposed.

### 1.5 A programme rename does not imply a slug rename

A programme's public slug is **pinned independently of its title**. Renaming a
programme must not automatically regenerate its existing slug: a slug derived from
the title means every rename breaks an inbound link and a search ranking.

When a programme title changes, the slug stays as it is unless the slug change is
itself an explicitly agreed URL-contract decision.

### 1.6 There is no historical slug remapping

There is currently **no redirect or remapping system for programme slugs**. The
frontend router contains no redirect logic, and no slug has ever been remapped.

Therefore existing slugs must be treated as stable public URL identifiers. **Do not
assume an old slug automatically redirects to a new one** — if that assumption is
ever needed, the redirect layer does not exist yet and would have to be built
deliberately, with its own migration plan.

### 1.7 Slug format

All 135 existing slugs conform to:

```
^[a-z0-9][a-z0-9-]{0,127}$
```

Lowercase alphanumerics and hyphens only, maximum 128 characters (the longest
actual slug is 78). Do not introduce automatic slug normalization or
regeneration for existing records. This format is now **enforced** by
`npm run qa`, so a malformed slug fails the gate rather than passing silently.

Note on the rule as written: only the **first** character is constrained to
`[a-z0-9]`, so a trailing hyphen is permitted by this pattern. All 135 current
slugs conform. Tightening this to also forbid trailing hyphens would be a change
to the URL contract, not a QA fix, and would require updating this rule first.

---

## 2. Programme code format

All 135 programme codes conform to:

```
^GIBS-[A-Z]{3}-(?:[A-Z0-9]{2,3}-)?[0-9]{2,3}$
```

For example `GIBS-LOC-001`, `GIBS-FHO-004`. **Do not invent alternative code
formats.** Both slug and code formats are now **enforced** by `npm run qa`, so a
violation fails the gate rather than passing silently.

---

## 3. Category and destination values must match the UI exactly

Programme filtering depends on **exact string equality** for category and
destination. Verified in the consuming UI: `src/pages/Programmes.tsx` compares
`p.category === category` and `p.destination === destination`.

A typo, or a label changed in one place but not the other, **silently produces an
empty filter result** — there is no error anywhere to signal it.

Therefore catalogue category and destination values must be changed deliberately
and consistently with the consuming UI. `"Local"` is a real destination value, not
a null or an empty string.

---

## 4. Catalogue integrity rules

These are enforced by `npm run qa` and must remain true:

- Exactly **135** programme records.
- `id`, `code`, `slug`, and `num` are each unique across all records.
- Every `slug` matches the public URL format (§1.7).
- Every `code` matches the programme code format (§2).
- Destination distribution is exactly `Local: 113`, `Kigali: 8`, `Dubai: 5`,
  `London: 4`, `Houston: 5`.
- Exactly **15** categories.
- `inPlantAvailable` is true if and only if the destination is `Local`.
- Exactly two records carry a secondary fee tier: `int-houston-3`, `int-houston-4`.
- Currencies are exactly `NGN`, `USD`, `GBP`.
- The formatted fee display string is reproducible from amount + currency, except
  for three records that carry an explicit `fee_notes` override.
- 7 programme titles are legitimately shared across records (one delivered at
  three hubs, six at two). Duplicates are preserved deliberately and must not be
  deduplicated.
- `db/legacy/programmes.snapshot.json` must match the live catalogue by SHA-256.
- `requirements` is never promoted to a field of its own in the canonical
  representation, and always survives inside the `legacy` blob.

### What `npm run qa` runs

`npm run qa` is **source and catalogue integrity QA only**. It runs three gates,
each of which must exit 0:

| Gate | Protects |
|---|---|
| `scripts/qa/parity_check.py` | 26 assertions over snapshot provenance and catalogue invariants |
| `scripts/qa/generator_drift_check.py` | `src/lib/data.ts` is byte-identical to generator output, and the exports the frontend imports at runtime still exist |
| `scripts/import/export_snapshot.py --check` | the snapshot still matches the live catalogue |

Every one of those 26 assertions is a condition that can genuinely fail; the gate
has no unconditional checks. See `BACKEND_CATALOGUE_QA.md` for the full list.

**There is no database QA in this project.** The PostgreSQL schema-chain checker
and the migration applier were archived to `archive/backend/` and are not part of
`npm run qa`; they are not claimed to pass.

## 5. Data generation rules

- `src/lib/data.ts` is **generated**. Hand edits are not durable; the next
  regeneration discards them. This has already caused one real breakage
  (`NAV_SECONDARY` was hand-added and would have been silently deleted).
- `db/legacy/programmes.snapshot.json` is a **derived artefact**, not canonical.
  `src/lib/data.ts` always wins if the two disagree.

## 6. Year / version concept

The catalogue is versioned by source control and file naming, not by a database
column. A future catalogue year is a new data version; publishing a new year never
destroys the previous one, because history is git history. No `year` field is
carried on individual programme records today, and none is required.

## 7. Contact workflow

Visitors reach GIBS through a validated `mailto:` link built in
`src/pages/Contact.tsx`. Nothing is posted to a server and no enquiry is stored.
There is no database, no API, and no enquiry persistence. GIBS handles all
follow-up outside this website.