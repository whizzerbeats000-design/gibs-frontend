#!/usr/bin/env python3
"""Catalogue integrity checks for the GIBS programme data that ships to visitors.

    python3 scripts/qa/parity_check.py

Answers one question: is the published programme catalogue — the data the
frontend actually renders from `src/lib/data.ts` — internally consistent and
faithful to its recorded provenance in `db/legacy/programmes.snapshot.json`?

It is deliberately static. It never opens a database connection, needs no driver,
no credentials and no network, and it cannot mutate anything.

SCOPE
    This gate protects the live product catalogue: record count, identifier
    uniqueness, destination and category distribution, fee representation, and the
    snapshot-to-source hash relationship.

    It previously also validated the abandoned PostgreSQL migration — the
    snapshot-to-SQL importer and the prototype schema `db/schema/001_programme.sql`.
    Those artefacts are no longer part of this project and were removed by
    subtraction; no catalogue assertion was relaxed in the process.

Exit code is 0 only when every check passes.
"""

from __future__ import annotations

import re
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "import"))

from _programme_source import (  # noqa: E402
    CATEGORY_ORDER, CURRENCIES, DESTINATION_ORDER, SNAPSHOT, SourceError,
    build_canonical_rows, expected_display_fee, load_snapshot, source_sha256,
)

REPO = Path(__file__).resolve().parent.parent.parent

EXPECTED_TOTAL = 135
EXPECTED_DESTINATIONS = {"Local": 113, "Kigali": 8, "Dubai": 5, "London": 4,
                         "Houston": 5}
EXPECTED_CATEGORIES = 15
# int-houston-3 / -4 / -5 publish a feeNotes string that overrides the formatted
# display value, so their `fees` string is not derivable from amount+currency.
DISPLAY_EXCEPTIONS = {"int-houston-3", "int-houston-4", "int-houston-5"}

# Public URL contract — docs/PROGRAMME_CATALOGUE_RULES.md §1.7. Lowercase
# alphanumerics and hyphens only, 1..128 characters. This is validation, never
# normalisation: existing slugs are live inbound URLs, so a violation is a
# catalogue defect to correct at source, not a slug to rewrite.
SLUG_PATTERN = re.compile(r"^[a-z0-9][a-z0-9-]{0,127}$")

# Programme code format — docs/PROGRAMME_CATALOGUE_RULES.md §2.
CODE_PATTERN = re.compile(r"^GIBS-[A-Z]{3}-(?:[A-Z0-9]{2,3}-)?[0-9]{2,3}$")

results: list[tuple[str, bool, str]] = []


def check(name: str, ok: bool, detail: str = "") -> bool:
    results.append((name, ok, detail))
    return ok


def fail_all(lines: list[str]) -> int:
    for name, ok, detail in results:
        print(f"  {'PASS' if ok else 'FAIL'}  {name}" + (f" — {detail}" if detail else ""))
    failed = [n for n, ok, _ in results if not ok]
    if failed:
        for line in lines:
            print(f"\n{line}")
    return 1 if failed else 0


# ---------------------------------------------------------------------------
# 1. Snapshot provenance
# ---------------------------------------------------------------------------

def check_snapshot() -> dict | None:
    try:
        snapshot = load_snapshot()
    except SourceError as exc:
        check("snapshot is readable", False, str(exc))
        return None

    check("snapshot is readable", True)
    check("snapshot is not stale",
          snapshot["source_sha256"] == source_sha256(),
          "src/lib/data.ts changed since export — rerun export_snapshot.py"
          if snapshot["source_sha256"] != source_sha256() else "")
    check("snapshot record count matches source",
          snapshot["record_count"] == len(snapshot["programmes"]) == EXPECTED_TOTAL,
          f"{snapshot['record_count']} records")
    check("snapshot carries a derivation notice",
          "not canonical" in snapshot.get("artifact_notice", "").lower())
    return snapshot


# ---------------------------------------------------------------------------
# 2. Source invariants
# ---------------------------------------------------------------------------

def check_source_invariants(snapshot: dict) -> list[dict]:
    programmes = snapshot["programmes"]

    dest_counts = Counter(p["destination"] for p in programmes)
    check("destination distribution",
          dict(dest_counts) == EXPECTED_DESTINATIONS,
          f"expected {EXPECTED_DESTINATIONS}, got {dict(dest_counts)}")

    cat_counts = Counter(p["category"] for p in programmes)
    check("category count", len(cat_counts) == EXPECTED_CATEGORIES,
          f"{len(cat_counts)} distinct")

    for field in ("id", "code", "slug", "num"):
        dupes = [v for v, c in Counter(p[field] for p in programmes).items() if c > 1]
        check(f"{field} is unique", not dupes, f"duplicates: {dupes}")

    bad_slugs = [p["slug"] for p in programmes if not SLUG_PATTERN.match(p["slug"])]
    check("slug matches the public URL format", not bad_slugs,
          f"{len(bad_slugs)} offending: {bad_slugs[:3]}")

    bad_codes = [p["code"] for p in programmes if not CODE_PATTERN.match(p["code"])]
    check("code matches the established programme code format", not bad_codes,
          f"{len(bad_codes)} offending: {bad_codes[:3]}")

    title_counts = Counter(p["title"] for p in programmes)
    repeated = {t: c for t, c in title_counts.items() if c > 1}
    extra = sum(c - 1 for c in repeated.values())
    # 7 titles are shared; one is delivered at three hubs (Kigali, London,
    # Houston) and six at two, giving 8 extra records in total.
    check("duplicated titles are preserved, not deduplicated",
          len(repeated) == 7 and extra == 8,
          f"{len(repeated)} titles shared by {extra} extra records")

    check("destination names match the seeded set",
          set(dest_counts) == {d[0] for d in DESTINATION_ORDER})
    check("category names match the seeded set",
          set(cat_counts) <= set(CATEGORY_ORDER))
    check("currencies are the known three",
          {p["currency"] for p in programmes} <= set(CURRENCIES),
          f"{sorted({p['currency'] for p in programmes})}")

    in_plant = {p["destination"]: p["inPlantAvailable"] for p in programmes}
    mismatch = [p["id"] for p in programmes
                if bool(p["inPlantAvailable"]) != (p["destination"] == "Local")]
    check("inPlantAvailable is exactly 'is Local'", not mismatch,
          f"exceptions: {mismatch}")

    secondary = sorted(p["id"] for p in programmes if p.get("feeSecondary") is not None)
    check("secondary fee tiers are the known two",
          secondary == ["int-houston-3", "int-houston-4"],
          f"{secondary}")

    start_dupes = [p["id"] for p in programmes
                   if p.get("startDate") not in (None, p["schedule"])]
    check("omitted startDate really is a copy of schedule", not start_dupes,
          f"exceptions: {start_dupes}")

    official = [p["id"] for p in programmes if p.get("officialOnly")]
    check("omitted officialOnly really is empty everywhere", not official,
          f"non-empty: {official}")

    return programmes


# ---------------------------------------------------------------------------
# 3. Canonical rows and fee round-trip
# ---------------------------------------------------------------------------

def check_fees(snapshot: dict) -> None:
    canonical = build_canonical_rows(snapshot["programmes"])

    # `requirements` is generated by the catalogue but rendered by no live page, so
    # the field classification in _programme_source.py omits it: in the canonical
    # representation it must NOT be promoted to a field of its own, and it must
    # still survive inside the opaque `legacy` blob. Asserting both directions
    # keeps the omission honest — promotion would invent a column, and dropping
    # the field entirely would lose data.
    promoted = [row["id"] for row in canonical["programmes"]
                if "requirements" in row]
    check("omitted 'requirements' is not promoted to a canonical field", not promoted,
          f"promoted on: {promoted[:3]}")

    lost = [row["id"] for row in canonical["programmes"]
            if "requirements" not in row["legacy"]]
    check("omitted 'requirements' survives inside the legacy blob", not lost,
          f"missing from legacy: {lost[:3]}")

    mismatched: list[str] = []
    unexpected: list[str] = []
    for row in canonical["programmes"]:
        if row["id"] in DISPLAY_EXCEPTIONS:
            continue
        derived = expected_display_fee(row)
        source_display = row["legacy"].get("fees")
        if source_display is not None and source_display != derived:
            mismatched.append(f"{row['id']}: {source_display!r} != {derived!r}")
    check("formatted fee string is reproducible from amount+currency",
          not mismatched, "; ".join(mismatched[:3]))

    for pid in DISPLAY_EXCEPTIONS:
        if not any(r["id"] == pid and r["fee_notes"] for r in canonical["programmes"]):
            unexpected.append(pid)
    check("every display exception is explained by fee_notes",
          not unexpected, f"unexplained: {unexpected}")

    check("tier 2 never carries a currency of its own",
          all(len({f["currency"] for f in r["fees"]}) == 1
              for r in canonical["programmes"]),
          "source feeSecondary reuses the primary currency")

    check("legacy blob round-trips the source record exactly",
          all(row["legacy"] == src
              for row, src in zip(canonical["programmes"], snapshot["programmes"])))


# ---------------------------------------------------------------------------

def main() -> int:
    print("GIBS programme catalogue integrity check")
    print("static analysis only — no database is contacted\n")

    snapshot = check_snapshot()
    if snapshot is None:
        return fail_all([])
    check_source_invariants(snapshot)
    check_fees(snapshot)

    lines = fail_all([])
    failed = [n for n, ok, _ in results if not ok]
    print(f"\n{len(results) - len(failed)}/{len(results)} checks passed")
    return lines


if __name__ == "__main__":
    raise SystemExit(main())