#!/usr/bin/env python3
"""Regression check: the TypeScript data generator must reproduce src/lib/data.ts.

Background
----------
`scripts/generate_data_ts.py` writes `src/lib/data.ts` in full, from a template
embedded in the script itself. Anything added to `data.ts` by hand is therefore
at risk: the next regeneration silently deletes it. That is not hypothetical —
`NAV_SECONDARY` was hand-added in commit 8b36a2c without updating the generator,
so running the generator would have removed an export that
`src/components/chrome.tsx` imports, breaking the build.

This check regenerates into a TEMPORARY DIRECTORY and compares the result with the
committed file. It never writes inside the repository.

Exit codes
----------
0  regeneration is byte-identical to the committed data.ts
1  drift detected, or the generator could not be run
"""

from __future__ import annotations

import difflib
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent
SCRIPTS = REPO / "scripts"
COMMITTED = REPO / "src" / "lib" / "data.ts"

# Exports that are load-bearing for the frontend and must never disappear from a
# regeneration. `chrome.tsx` imports NAV_SECONDARY at runtime.
REQUIRED_EXPORTS = ("NAV_SECONDARY", "NAV_LINKS", "PROGRAMMES", "LOCAL_PROGRAMMES",
                    "FOREIGN_PROGRAMMES", "HOME_PROGRAMME_BANDS")

GENERATOR_FILES = ("generate_data_ts.py", "generate_gibs_data.py")


def fail(message: str) -> None:
    print(f"FAIL  {message}")
    raise SystemExit(1)


def main() -> None:
    if not COMMITTED.exists():
        fail(f"committed data file not found: {COMMITTED}")

    with tempfile.TemporaryDirectory(prefix="gibs-gencheck-") as tmp:
        work = Path(tmp)
        (work / "scripts").mkdir()
        (work / "src" / "lib").mkdir(parents=True)

        for name in GENERATOR_FILES:
            src = SCRIPTS / name
            if not src.exists():
                fail(f"generator source missing: {src}")
            shutil.copy2(src, work / "scripts" / name)

        try:
            proc = subprocess.run(
                [sys.executable, "scripts/generate_data_ts.py"],
                cwd=work, capture_output=True, text=True, timeout=120,
            )
        except subprocess.TimeoutExpired:
            fail("generator timed out after 120s")

        if proc.returncode != 0:
            print(proc.stdout)
            print(proc.stderr, file=sys.stderr)
            fail(f"generator exited {proc.returncode}")

        generated = work / "src" / "lib" / "data.ts"
        if not generated.exists():
            fail("generator produced no output file")

        new_text = generated.read_text(encoding="utf-8")
        old_text = COMMITTED.read_text(encoding="utf-8")

        print(f"committed : {COMMITTED.relative_to(REPO)} ({len(old_text):,} bytes)")
        print(f"generated : data.ts ({len(new_text):,} bytes)")

        for symbol in REQUIRED_EXPORTS:
            if f"export const {symbol}" not in new_text:
                fail(f"generated output is missing required export: {symbol}")

        if new_text == old_text:
            print("PASS  regeneration is byte-identical to the committed data.ts")
            return

        diff = list(
            difflib.unified_diff(
                old_text.splitlines(), new_text.splitlines(),
                fromfile="committed", tofile="generated", lineterm="", n=2,
            )
        )
        changed = [ln for ln in diff if ln[:1] in "+-" and not ln.startswith(("---", "+++"))]
        print(f"\nDRIFT: {len(changed)} changed lines. First 80:")
        for line in diff[:80]:
            print(f"  {line}")
        print(
            "\nThe generator template and the committed data.ts have diverged.\n"
            "Either the generator is stale (sync it) or data.ts was hand-edited\n"
            "(move the change into the generator). Do NOT overwrite data.ts blindly:\n"
            "  - regenerating would silently delete hand-written exports\n"
            "  - programmes are published with fees; review any programme diff with GIBS"
        )
        raise SystemExit(1)


if __name__ == "__main__":
    main()