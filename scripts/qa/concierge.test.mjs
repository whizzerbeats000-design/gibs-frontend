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
    .replace('from "./data"', 'from "./data.ts"');
  writeFileSync(join(temporaryDirectory, "concierge.ts"), source);
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
