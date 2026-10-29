import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { after, before, test } from "node:test";

let getConciergeReply;
let ENQUIRY_TYPES;
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
  ({ ENQUIRY_TYPES } = await import(pathToFileURL(join(temporaryDirectory, "data.ts"))));
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

test("duplicate greeting is prevented mid-conversation", () => {
  const history = [
    { role: "user", text: "Hello" },
    { role: "concierge", text: "Welcome to Goshen International Business School (GIBS)..." },
  ];
  const reply = getConciergeReply("Hello", history);
  assert.match(reply.text, /Hello again/i);
  assert.doesNotMatch(reply.text, /Welcome to Goshen International Business School \(GIBS\)\. We offer 113/i);
});

test("multi-turn follow-up narrows topic to foreign hub", () => {
  const turn1 = getConciergeReply("I want a leadership course");
  assert.ok(turn1.cards?.some((c) => c.kind === "programme"));

  const history1 = [
    { role: "user", text: "I want a leadership course" },
    { role: "concierge", text: turn1.text, cards: turn1.cards },
  ];

  const turn2 = getConciergeReply("Foreign", history1);
  assert.match(turn2.text, /overseas executive training|Foreign Executive Training Programmes/i);
  assert.match(turn2.text, /Which international hub suits your schedule best|explore—Kigali, Dubai, London, or Houston/i);

  const history2 = [
    ...history1,
    { role: "user", text: "Foreign" },
    { role: "concierge", text: turn2.text, cards: turn2.cards },
  ];

  const turn3 = getConciergeReply("Dubai", history2);
  assert.match(turn3.text, /Leadership and Management Innovation/i);
  assert.match(turn3.text, /\$4,800 USD/i);
  assert.ok(turn3.cards?.some((c) => c.kind === "programme" && c.slug.includes("dubai")));
  assert.ok(turn3.cards?.some((c) => c.to === "/contact?type=Foreign+Training+Programmes+(Kigali,+Dubai,+London,+Houston)"));
});

test("new question correctly resets and replaces stale context", () => {
  const history = [
    { role: "user", text: "I want a leadership course" },
    { role: "concierge", text: "Here are leadership programmes..." },
  ];
  const reply = getConciergeReply("Where is your Ilorin office?", history);
  assert.match(reply.text, /Ilorin Main HQ/i);
  assert.doesNotMatch(reply.text, /leadership/i);
});

test("corporate staff training query directs to customized in-plant workshops", () => {
  const reply = getConciergeReply("I need a training for my staff");
  assert.match(reply.text, /capacity building for teams/i);
  assert.ok(reply.cards?.some((c) => c.to.includes("Customized+In-Plant+Workshop+Request")));
});

test("query for specific foreign hub returns that hub's verified programmes", () => {
  const reply = getConciergeReply("Which courses are available in Dubai?");
  assert.match(reply.text, /Dubai/i);
  assert.match(reply.text, /22 Foreign Executive Training Programmes across 4 international hubs/i);
  assert.equal(reply.cards?.[0]?.label, "Explore All Foreign Programmes");
  const progCards = reply.cards?.filter((c) => c.kind === "programme");
  assert.ok(progCards && progCards.length > 0);
  assert.ok(progCards.some((c) => c.slug.includes("dubai")));
});

test("conversational gratitude returns polite acknowledgment and next steps", () => {
  const reply = getConciergeReply("Thank you so much for the help!");
  assert.match(reply.text, /You are welcome/i);
  assert.ok(reply.cards?.some((c) => c.to === "/programmes"));
});

test("foreign executive course enquiry link matches canonical ENQUIRY_TYPES and preselects in contact form", () => {
  const history = [
    { role: "user", text: "I want a leadership course" },
    { role: "concierge", text: "Here are leadership programmes..." },
    { role: "user", text: "Foreign" },
    { role: "concierge", text: "Which international hub suits your schedule best..." },
  ];
  const reply = getConciergeReply("Dubai", history);
  const enquiryCard = reply.cards?.find((c) => c.kind === "link" && c.label === "Make an Enquiry");

  // 1. The concierge generates the correct canonical enquiry URL
  assert.ok(enquiryCard, "Make an Enquiry card should be present in foreign hub reply");
  assert.equal(
    enquiryCard.to,
    "/contact?type=Foreign+Training+Programmes+(Kigali,+Dubai,+London,+Houston)"
  );

  // 2. The query parameter is decoded and matches the intended ENQUIRY_TYPES entry
  const parsedUrl = new URL(enquiryCard.to, "https://gibs.com.ng");
  const decodedType = parsedUrl.searchParams.get("type");
  assert.equal(decodedType, "Foreign Training Programmes (Kigali, Dubai, London, Houston)");
  assert.ok(ENQUIRY_TYPES.includes(decodedType), "decoded parameter must be present in canonical ENQUIRY_TYPES");

  // 3. The contact form preselects that option instead of falling back to an empty selection
  const contactFormPreselectedType = ENQUIRY_TYPES.includes(decodedType) ? decodedType : "";
  assert.equal(contactFormPreselectedType, "Foreign Training Programmes (Kigali, Dubai, London, Houston)");
  assert.notEqual(contactFormPreselectedType, "", "contact form must not fall back to empty selection");
});

test("location questions for all GIBS cities return the campus reply without conversation history", () => {
  // Regression guard for the concierge rewrite that hijacked "Where is your
  // <city> office?" to programme recommendations. The fix routes explicit
  // location-seeking questions to the authoritative campus-locations rule
  // before rankProgrammes can score programme matches. Covers Ilorin, Abuja
  // and Ibafo, with no prior conversation so the case cannot lean on context.
  for (const city of ["Ilorin", "Abuja", "Ibafo"]) {
    const reply = getConciergeReply(`Where is your ${city} office?`, []);
    assert.match(reply.text, /Ilorin Main HQ/i, `${city}: must return the campus-locations reply`);
    assert.doesNotMatch(
      reply.text,
      /closest matches from programme/i,
      `${city}: must not be hijacked by the programme-ranking reply`
    );
    assert.equal(
      reply.cards?.filter((c) => c.kind === "programme").length ?? 0,
      0,
      `${city}: must not return programme cards`
    );
    assert.ok(
      reply.cards?.some((c) => c.kind === "link" && c.to === "/about"),
      `${city}: must offer the Campus Locations link card`
    );
  }
});

test("a programme query that names a GIBS city still returns programme recommendations", () => {
  // Counterpart to the location-regression guard: a genuine programme request
  // that happens to name a city must still reach programme ranking and return
  // programme cards, not the campus-address reply. "course" flags programme
  // intent and "where is"/"address" phrasing is absent, so the location guard
  // must not intercept it.
  const reply = getConciergeReply("leadership course in Ilorin", []);
  assert.ok(
    reply.cards?.some((c) => c.kind === "programme"),
    "must still return programme cards for a genuine programme query naming a city"
  );
  assert.doesNotMatch(
    reply.text,
    /Ilorin Main HQ/i,
    "must not be hijacked to the campus-address reply"
  );
});
