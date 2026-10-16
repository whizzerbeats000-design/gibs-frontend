import re
from collections import Counter
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parent.parent / "src" / "lib" / "data.ts"

content = DATA_PATH.read_text(encoding="utf-8")

print("File read successfully, size:", len(content))

# Scope to the PROGRAMMES literal: everything outside it is hand-written
# TypeScript, so only this block carries the JSON-quoted `"id"` keys.
block_match = re.search(
    r"export const PROGRAMMES: Programme\[\] = \[(.*?)\n\];", content, re.S
)
if not block_match:
    raise SystemExit("Could not locate the PROGRAMMES array in src/lib/data.ts")

block = block_match.group(1)

ids = re.findall(r'"id"\s*:\s*"([^"]+)"', block)
print("Total IDs found:", len(ids))

# Local programmes are `loc-<n>`; foreign are `int-<city>-<n>`.
prefixes = Counter()
for pid in ids:
    if pid.startswith("loc-"):
        prefixes["local"] += 1
        continue
    city = re.match(r"int-([a-z]+)-", pid)
    if city:
        prefixes[city.group(1)] += 1
    else:
        prefixes["unrecognised:" + pid] += 1

print("Prefixes found in objects:", sum(prefixes.values()))
print("Counts by prefix:", dict(prefixes))
