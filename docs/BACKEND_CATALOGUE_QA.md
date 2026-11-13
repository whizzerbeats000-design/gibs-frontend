# GIBS — Catalogue QA Reference

Status: current. Describes the QA that actually exists and runs.

GIBS has **no database, no API, and no backend**. The product QA is
**source and catalogue integrity QA**.

## Canonical command

```
npm run qa
```

Must exit 0. Chained, so the first failure stops the run.

## What it runs

| Gate | Protects |
|---|---|
| `scripts/qa/parity_check.py` | snapshot provenance + catalogue invariants |
| `scripts/qa/generator_drift_check.py` | `src/lib/data.ts` is byte-identical to generator output; runtime-required exports still exist |
| `scripts/import/export_snapshot.py --check` | snapshot still matches the live catalogue by SHA-256 |

## parity_check.py — all 26 assertions

Every assertion below is a condition that can genuinely fail. There are no
unconditional checks.

| # | Assertion | Group |
|---|---|---|
| 1 | `snapshot is readable` | provenance |
| 2 | `snapshot is not stale` | provenance |
| 3 | `snapshot record count matches source` | provenance |
| 4 | `snapshot carries a derivation notice` | provenance |
| 5 | `destination distribution` | distribution |
| 6 | `category count` | distribution |
| 7 | `id is unique` | uniqueness |
| 8 | `code is unique` | uniqueness |
| 9 | `slug is unique` | uniqueness |
| 10 | `num is unique` | uniqueness |
| 11 | `slug matches the public URL format` | format |
| 12 | `code matches the established programme code format` | format |
| 13 | `duplicated titles are preserved, not deduplicated` | distribution |
| 14 | `destination names match the seeded set` | distribution |
| 15 | `category names match the seeded set` | distribution |
| 16 | `currencies are the known three` | distribution |
| 17 | `inPlantAvailable is exactly 'is Local'` | distribution |
| 18 | `secondary fee tiers are the known two` | distribution |
| 19 | `omitted startDate really is a copy of schedule` | omitted-field contract |
| 20 | `omitted officialOnly really is empty everywhere` | omitted-field contract |
| 21 | `omitted 'requirements' is not promoted to a canonical field` | omitted-field contract |
| 22 | `omitted 'requirements' survives inside the legacy blob` | omitted-field contract |
| 23 | `formatted fee string is reproducible from amount+currency` | fee representation |
| 24 | `every display exception is explained by fee_notes` | fee representation |
| 25 | `tier 2 never carries a currency of its own` | fee representation |
| 26 | `legacy blob round-trips the source record exactly` | fee representation |
