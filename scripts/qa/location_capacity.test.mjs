import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const ROOT = resolve(process.cwd());
const LOCATION_DETAIL_PATH = join(ROOT, "src/pages/LocationDetail.tsx");
const SEO_GEN_PATH = join(ROOT, "scripts/seo-gen.mjs");
const DIST_DIR = join(ROOT, "dist");

test("LocationDetail.tsx does not import or render unverified CAMPUS_CAPACITY", () => {
  const content = readFileSync(LOCATION_DETAIL_PATH, "utf8");

  // Ensure CAMPUS_CAPACITY is not imported
  assert.equal(
    /import\s*\{[^}]*CAMPUS_CAPACITY[^}]*\}\s*from/.test(content),
    false,
    "LocationDetail.tsx must not import CAMPUS_CAPACITY"
  );

  // Ensure CAMPUS_CAPACITY is not referenced in JSX
  assert.equal(
    /CAMPUS_CAPACITY/.test(content),
    false,
    "LocationDetail.tsx must not reference CAMPUS_CAPACITY"
  );
});

test("LocationDetail.tsx has no contradictory 500-delegate plenary claims", () => {
  const content = readFileSync(LOCATION_DETAIL_PATH, "utf8");

  // Catch unverified 500 plenary claims
  const match500Plenary = /500\s*(?:delegates|people|participants|seats|candidates)\s*(?:in\s*plenary|in\s*a\s*single)?/i.test(content);
  assert.equal(
    match500Plenary,
    false,
    "LocationDetail.tsx must not claim 500 delegates/people in plenary"
  );
});

test("LocationDetail.tsx enforces arithmetic consistency for class and delegate counts", () => {
  const content = readFileSync(LOCATION_DETAIL_PATH, "utf8");

  // Check for any arithmetic claim: "X candidates across Y classes of Z"
  const arithmeticRegex = /(\d+)\s*(?:candidates|delegates|participants|people)\s*(?:across|in)\s*(\d+)\s*(?:classes|rooms|groups)\s*(?:of)\s*(\d+)/gi;
  let match;
  while ((match = arithmeticRegex.exec(content)) !== null) {
    const total = parseInt(match[1], 10);
    const groups = parseInt(match[2], 10);
    const perGroup = parseInt(match[3], 10);
    assert.equal(
      total,
      groups * perGroup,
      `Arithmetic inconsistency detected: ${total} != ${groups} * ${perGroup} in "${match[0]}"`
    );
  }

  // Specifically ensure "300 candidates across 6 classes of 25" is absent (6 * 25 = 150 != 300)
  assert.equal(
    /300\s*(?:candidates|delegates|participants)\s*across\s*6\s*classes/i.test(content),
    false,
    "LocationDetail.tsx must not contain contradictory '300 candidates across 6 classes of 25' claim"
  );
});

test("LocationDetail.tsx defines verified, non-contradictory capacity notes for all 3 centres", () => {
  const content = readFileSync(LOCATION_DETAIL_PATH, "utf8");

  // Ilorin: hall is 100-person capacity
  assert.match(
    content,
    /ilorin[\s\S]*?100-person(?:\s*capacity)?\s*(?:Multi-Purpose|conference)?\s*hall/i,
    "Ilorin must reference its verified 100-person capacity hall"
  );

  // Abuja: 2 halls of 100 each (up to 200 total)
  assert.match(
    content,
    /abuja[\s\S]*?100-person\s*capacity\s*each/i,
    "Abuja must state 100-person capacity each"
  );

  // Ibafo: has 4 lecture rooms and does not claim 6 classes
  assert.match(
    content,
    /ibafo[\s\S]*?4\s*(?:Executive\s*)?Lecture\s*Rooms/i,
    "Ibafo must list 4 lecture rooms"
  );
  assert.equal(
    /ibafo[\s\S]*?6\s*classes/i.test(content),
    false,
    "Ibafo cannot claim 6 classes because it only has 4 lecture rooms"
  );
});

test("scripts/seo-gen.mjs has no contradictory capacity statements in static bodies", () => {
  const content = readFileSync(SEO_GEN_PATH, "utf8");

  assert.equal(
    /500\s*(?:delegates|people|participants)/i.test(content),
    false,
    "seo-gen.mjs must not claim 500 delegates/people"
  );

  assert.equal(
    /300\s*candidates/i.test(content),
    false,
    "seo-gen.mjs must not claim 300 candidates across 6 classes"
  );
});

test("Generated location shells (if dist exists) contain no capacity contradictions", () => {
  const locations = ["ilorin", "abuja", "ibafo"];
  for (const loc of locations) {
    const shellPath = join(DIST_DIR, "locations", loc, "index.html");
    if (existsSync(shellPath)) {
      const html = readFileSync(shellPath, "utf8");

      assert.equal(
        /500\s*(?:delegates|people|participants|seats)/i.test(html),
        false,
        `${loc} shell must not contain 500 delegates/people claim`
      );

      assert.equal(
        /300\s*candidates/i.test(html),
        false,
        `${loc} shell must not contain 300 candidates claim`
      );

      assert.equal(
        /6\s*classes\s*of\s*25/i.test(html),
        false,
        `${loc} shell must not claim 6 classes of 25`
      );
    }
  }
});
