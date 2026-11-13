import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { after, before, test } from "node:test";

/**
 * Regression coverage for the retired-phone-number policy.
 *
 * `src/lib/data.ts` is byte-locked and still lists two retired desk numbers
 * — one in `INSTITUTIONAL_DATA.phoneNumbers` and one inside a free-text FAQ
 * answer. The policy in `src/lib/phones.ts` is what keeps them out of every
 * rendered path, so these tests pin both halves of it: the retired numbers
 * are removed, and the approved current numbers survive.
 */

let activePhoneNumbers;
let scrubRetiredNumbers;
let scrubRetiredNumbersInProse;
let RETIRED_PHONE_NUMBERS;
let CURRENT_TRAINING_DESK_NUMBER;
let temporaryDirectory;

before(async () => {
  temporaryDirectory = mkdtempSync(join(tmpdir(), "gibs-phones-test-"));
  const source = readFileSync(new URL("../../src/lib/phones.ts", import.meta.url), "utf8");
  writeFileSync(join(temporaryDirectory, "phones.ts"), source);
  const module = await import(pathToFileURL(join(temporaryDirectory, "phones.ts")));
  ({
    activePhoneNumbers,
    scrubRetiredNumbers,
    scrubRetiredNumbersInProse,
    RETIRED_PHONE_NUMBERS,
    CURRENT_TRAINING_DESK_NUMBER,
  } = module);
});

after(() => {
  if (temporaryDirectory) rmSync(temporaryDirectory, { recursive: true, force: true });
});

const RETIRED = ["08033429427", "08032296041"];
const CURRENT = ["08160010401", "08160010400", "08186464474", "07085792767"];

test("the policy names exactly the two retired numbers", () => {
  assert.deepEqual([...RETIRED_PHONE_NUMBERS].sort(), [...RETIRED].sort());
  assert.equal(CURRENT_TRAINING_DESK_NUMBER, "08160010400");
});

test("activePhoneNumbers drops the retired numbers and keeps every current one", () => {
  const result = activePhoneNumbers([...RETIRED, ...CURRENT]);

  for (const retired of RETIRED) {
    assert.ok(!result.includes(retired), `${retired} must not be published`);
  }
  for (const current of CURRENT) {
    assert.ok(result.includes(current), `${current} must remain published`);
  }
});

test("activePhoneNumbers appends the training-desk number when data.ts lacks it", () => {
  const result = activePhoneNumbers(["08160010401"]);

  assert.ok(result.includes("08160010400"));
  assert.equal(result.filter((n) => n === "08160010400").length, 1, "must not duplicate");
});

test("activePhoneNumbers does not duplicate the training-desk number when it is already present", () => {
  const result = activePhoneNumbers(["08160010400", "08160010401"]);

  assert.equal(result.filter((n) => n === "08160010400").length, 1);
});

test("scrubRetiredNumbers removes a retired number from prose and leaves the rest intact", () => {
  const input =
    "Organizations can send official nomination letters or emails to gibsilorin@gmail.com / goshenibs22@gmail.com, or contact the training desk via 08160010401 or 08033429427.";

  const result = scrubRetiredNumbers(input);

  assert.ok(!result.includes("08033429427"));
  assert.ok(result.includes("08160010401"), "the approved number must survive");
  assert.ok(result.includes("gibsilorin@gmail.com"), "unrelated text must survive");
  assert.ok(result.includes("goshenibs22@gmail.com"));
});

test("scrubRetiredNumbers removes both retired numbers", () => {
  const result = scrubRetiredNumbers("Call 08033429427 or 08032296041 today.");

  for (const retired of RETIRED) {
    assert.ok(!result.includes(retired), `${retired} must be removed`);
  }
});

test("scrubRetiredNumbers does not touch a different number that merely shares a prefix", () => {
  /* 080334294270 is a different number; it must not be mangled. */
  const result = scrubRetiredNumbers("Call 080334294270 for the registry.");

  assert.ok(result.includes("080334294270"));
});

test("scrubRetiredNumbersInProse tidies the separator left behind by the removal", () => {
  const result = scrubRetiredNumbersInProse(
    "Organisations can email gibsilorin@gmail.com / goshenibs22@gmail.com, or contact the training desk via 08160010401 or 08033429427."
  );

  assert.ok(!result.includes("08033429427"));
  assert.ok(!/\s+\.$/.test(result), "must not leave a dangling separator before the full stop");
  assert.ok(!/\s{2,}/.test(result), "must not leave doubled whitespace");
  assert.ok(result.endsWith("08160010401."), `unexpected tail: ${result}`);
});

test("scrubRetiredNumbersInProse leaves unrelated text byte-identical", () => {
  const input = "Where are the training venues located? Ilorin, Abuja and Ibafo.";
  assert.equal(scrubRetiredNumbersInProse(input), input);
});

test("scrubRetiredNumbersInProse handles empty and non-string input safely", () => {
  assert.equal(scrubRetiredNumbersInProse(""), "");
  assert.equal(scrubRetiredNumbersInProse(undefined), undefined);
});

/**
 * End-to-end: run the policy over the real `data.ts` content, so a future
 * edit that reintroduces a retired number into the source is caught here
 * rather than in production.
 */
test("the real data.ts phone list publishes no retired number", async () => {
  const data = await import(pathToFileURL(new URL("../../src/lib/data.ts", import.meta.url).pathname).href);
  const published = activePhoneNumbers(data.INSTITUTIONAL_DATA.phoneNumbers);

  for (const retired of RETIRED) {
    assert.ok(
      !published.includes(retired),
      `${retired} is in data.ts but must not reach the published list`,
    );
  }
  assert.ok(published.includes("08160010401"));
  assert.ok(published.includes("08160010400"));
});

test("the real data.ts FAQ prose publishes no retired number", async () => {
  const data = await import(pathToFileURL(new URL("../../src/lib/data.ts", import.meta.url).pathname).href);

  for (const faq of data.SUBSCRIPTION_FAQS) {
    const published = scrubRetiredNumbersInProse(faq.a);
    for (const retired of RETIRED) {
      assert.ok(
        !published.includes(retired),
        `FAQ "${faq.q}" still publishes ${retired} after scrubbing`,
      );
    }
  }
});

console.log("PASS retired phone-number policy regression");
