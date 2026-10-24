import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { after, before, test } from "node:test";

let getConciergeReply;
let temporaryDirectory;

before(async () => {
  temporaryDirectory = mkdtempSync(join(tmpdir(), "gibs-concierge-test-"));
  writeFileSync(
    join(temporaryDirectory, "data.ts"),
    readFileSync(new URL("../../src/lib/data.ts", import.meta.url), "utf8")
  );
  const source = readFileSync(new URL("../../src/lib/concierge.ts", import.meta.url), "utf8")
    .replace('from "./data"', 'from "./data.ts"')
    .replace('from "./phones"', 'from "./phones.ts"');
  writeFileSync(join(temporaryDirectory, "concierge.ts"), source);
  /* concierge.ts imports the shared phone policy, so the module under test
     has to bring it along — the temp directory is a standalone import root. */
  writeFileSync(
    join(temporaryDirectory, "phones.ts"),
    readFileSync(new URL("../../src/lib/phones.ts", import.meta.url), "utf8")
  );
  ({ getConciergeReply } = await import(pathToFileURL(join(temporaryDirectory, "concierge.ts"))));
});

after(() => {
  if (temporaryDirectory) rmSync(temporaryDirectory, { recursive: true, force: true });
});

test("topic recommendations rank actual catalogue matches instead of fixed examples", () => {
  const reply = getConciergeReply("Show me a cybersecurity programme, please");
  const programmeLabels = reply.cards?.filter((card) => card.kind === "programme").map((card) => card.label);

  assert.equal(programmeLabels?.[0], "Strategies Against Cybersecurity Vulnerability and Threats");
  assert.equal(programmeLabels?.length, 1);
});

test("location and quarter constraints match the programme schedule", () => {
  const reply = getConciergeReply("accounting programme in Abuja Q3");
  const programmeLabels = reply.cards?.filter((card) => card.kind === "programme").map((card) => card.label);

  assert.ok(programmeLabels?.includes("Public Sector Accounting Procedure and Standards"));
  assert.ok(programmeLabels?.every((label) => label !== "Customer Relationship Management and Retention"));
});

test("destination-only and hub-overview questions reach the foreign hubs guidance", () => {
  for (const question of [
    "Show me programmes in Kigali",
    "Tell me about training hubs",
  ]) {
    const reply = getConciergeReply(question);

    assert.match(reply.text, /22 Foreign Executive Training Programmes across 4 international hubs/i);
    assert.equal(reply.cards?.[0]?.label, "Explore All Foreign Programmes");
  }
});

test("a local campus hub question reaches the campus locations guidance", () => {
  for (const question of [
    "Where is your Ilorin hub?",
    "Where are your local training hubs?",
  ]) {
    const reply = getConciergeReply(question);

    assert.match(reply.text, /Ilorin Main HQ/i);
    assert.doesNotMatch(reply.text, /Foreign Executive Training Programmes/i);
  }
});

test("unmatched audience terms do not return unrelated programme cards", () => {
  const reply = getConciergeReply("training for a hospital department in Q1");

  assert.match(reply.text, /could(?:n't| not) find a programme/i);
  assert.match(reply.text, /sector, cadre, and department/i);
  assert.equal(reply.cards?.filter((card) => card.kind === "programme").length ?? 0, 0);
});

test("a broad programme query asks for a topic instead of guessing", () => {
  const reply = getConciergeReply("recommend a programme");

  assert.match(reply.text, /what programme topic|share a topic|name a category/i);
  assert.equal(reply.cards?.filter((card) => card.kind === "programme").length ?? 0, 0);
});

test("empty input remains a concise clarification", () => {
  const reply = getConciergeReply("   ");

  assert.match(reply.text, /what training or institutional information/i);
  assert.equal(reply.cards, undefined);
});

test("a fee question that also mentions a programme still reaches the enrolment rule", () => {
  /* The word "fee" or "cost" stops the programme match, so the query fell
     into the "no programme matches those terms" answer and the visitor was
     told nothing about fees. A question that names a programme and asks
     about the fee has to reach the enrolment rule. */
  for (const question of [
    "How much does a programme cost?",
    "What is the fee of the Public Sector Accounting programme?",
  ]) {
    const reply = getConciergeReply(question);

    assert.match(reply.text, /Local programme fees range from/i);
    assert.match(reply.text, /enquir/i);
    assert.equal(reply.cards?.filter((card) => card.kind === "programme").length ?? 0, 0);
  }
});
