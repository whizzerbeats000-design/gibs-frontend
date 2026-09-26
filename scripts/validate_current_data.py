import re

with open("src/lib/data.ts", "r", encoding="utf-8") as f:
    content = f.read()

print("File read successfully, size:", len(content))

# Extract PROGRAMMES array
# Count programmes
matches = re.findall(r"id:\s*[\"']([^\"']+)[\"']", content)
print("Total IDs found:", len(matches))

# Let's check local vs foreign
prog_blocks = re.findall(r"\{\s*id:\s*[\"'](local|kigali|dubai|london|houston)-", content)
print("Prefixes found in objects:", len(prog_blocks))

from collections import Counter
c = Counter(prog_blocks)
print("Counts by prefix:", c)
