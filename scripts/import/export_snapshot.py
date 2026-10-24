#!/usr/bin/env python3
"""Export the PROGRAMMES array to a version-controlled JSON snapshot.

    python3 scripts/import/export_snapshot.py           # write/refresh snapshot
    python3 scripts/import/export_snapshot.py --check    # verify, write nothing

Why a snapshot exists
    `src/lib/data.ts` is TypeScript, not a data file. Parsing it directly from
    the importer would couple the migration to a generator template that has
    already drifted once. Exporting to JSON makes the migration hermetic and the
    import reviewable in Git: a reviewer sees exactly what would be imported.

    This file is an ARTIFACT derived from the source. `src/lib/data.ts` stays
    canonical. If the two disagree, the source wins.

Determinism
    Output is a pure function of the source: key order follows the source array,
    record order is preserved, and indentation is fixed. Re-running without a
    source change produces a byte-identical file, so `--check` is safe in CI.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from _programme_source import (  # noqa: E402
    SNAPSHOT, SourceError, build_snapshot, load_source_programmes, source_sha256,
)


def render(snapshot: dict) -> str:
    return json.dumps(snapshot, indent=2, ensure_ascii=False) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true",
                        help="verify the snapshot matches the source; write nothing")
    args = parser.parse_args()

    try:
        programmes = load_source_programmes()
    except SourceError as exc:
        print(f"ERROR  {exc}", file=sys.stderr)
        return 1

    snapshot = build_snapshot(programmes)
    desired = render(snapshot)

    if args.check:
        if not SNAPSHOT.exists():
            print(f"FAIL  snapshot missing: {SNAPSHOT}")
            return 1
        current = SNAPSHOT.read_text(encoding="utf-8")
        if current == desired:
            print(f"PASS  snapshot is current "
                  f"({snapshot['record_count']} records, "
                  f"source sha256 {snapshot['source_sha256'][:12]}…)")
            return 0
        stored_hash = None
        try:
            stored_hash = json.loads(current).get("source_sha256")
        except json.JSONDecodeError:
            pass
        print("FAIL  snapshot is stale — it no longer matches src/lib/data.ts")
        if stored_hash and stored_hash != snapshot["source_sha256"]:
            print(f"        snapshot was built from source {stored_hash[:12]}…")
            print(f"        current source is        {snapshot['source_sha256'][:12]}…")
        print("        refresh with: python3 scripts/import/export_snapshot.py")
        return 1

    SNAPSHOT.parent.mkdir(parents=True, exist_ok=True)
    SNAPSHOT.write_text(desired, encoding="utf-8")
    print(f"wrote  {SNAPSHOT.relative_to(SNAPSHOT.parent.parent.parent)}")
    print(f"        {snapshot['record_count']} records, "
          f"{len(desired):,} bytes")
    print(f"        source sha256 {source_sha256()[:12]}…")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())