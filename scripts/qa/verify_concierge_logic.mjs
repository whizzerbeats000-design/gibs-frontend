import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";

async function run() {
  const tempDir = join(process.cwd(), "temp_verify");
  const fs = await import("node:fs");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  fs.writeFileSync(join(tempDir, "data.ts"), readFileSync(join(process.cwd(), "src/lib/data.ts"), "utf8"));
  fs.writeFileSync(join(tempDir, "phones.ts"), readFileSync(join(process.cwd(), "src/lib/phones.ts"), "utf8"));
  
  const source = readFileSync(join(process.cwd(), "src/lib/concierge.ts"), "utf8")
    .replace('from "./data"', 'from "./data.ts"')
    .replace('from "./phones"', 'from "./phones.ts"');
  fs.writeFileSync(join(tempDir, "concierge.ts"), source);

  const { getConciergeReply } = await import(pathToFileURL(join(tempDir, "concierge.ts")).href);

  const testCase = (name, turns) => {
    console.log(`\n--- ${name} ---`);
    let history = [];
    for (const turn of turns) {
      const userText = turn.user;
      console.log(`User: ${userText}`);
      const reply = getConciergeReply(userText, history);
      console.log(`AI: ${reply.text}`);
      history = [...history, { role: "user", text: userText }, { role: "concierge", text: reply.text, cards: reply.cards }];
      if (turn.verify) {
        try {
          turn.verify(reply, history);
        } catch (e) {
          console.error(`Verification failed for turn "${userText}": ${e.message}`);
          process.exit(1);
        }
      }
    }
  };

  // Conversation A: Greeting and capabilities
  testCase("Conversation A", [
    { user: "Hi", verify: (r) => {
        assert.ok(/Welcome to Goshen International Business School/i.test(r.text));
        assert.ok(!/Hello again/i.test(r.text));
    }},
    { user: "What can you do?", verify: (r) => {
        assert.ok(/I am the GIBS AI concierge/i.test(r.text));
    }},
    { user: "Tell me more about GIBS", verify: (r) => {
        assert.ok(/professional development institution/i.test(r.text));
    }}
  ]);

  // Conversation B: Programme discovery
  testCase("Conversation B", [
    { user: "I'm interested in leadership training.", verify: (r) => {
        assert.ok(r.cards && r.cards.some(c => c.kind === "programme"));
    }},
    { user: "What programmes are available?", verify: (r) => {
        assert.ok(/closest matches/i.test(r.text));
    }},
    { user: "Tell me more.", verify: (r) => {
        assert.ok(/programme focuses on/i.test(r.text));
    }}
  ]);

  // Conversation C: Foreign training
  testCase("Conversation C", [
    { user: "I'm interested in foreign training.", verify: (r) => {
        assert.ok(/Foreign Executive Training Programmes/i.test(r.text));
    }},
    { user: "What about Dubai?", verify: (r) => {
        assert.ok(/Dubai hub/i.test(r.text));
    }},
    { user: "Where is it held?", verify: (r) => {
        assert.ok(/delivered at our specialized hub in Dubai/i.test(r.text));
    }},
    { user: "How do I make an enquiry?", verify: (r) => {
        assert.ok(/enquiry/i.test(r.text));
    }}
  ]);

  // Conversation D: Unsupported information
  testCase("Conversation D", [
    { user: "How much does it cost?", verify: (r) => {
        assert.ok(/₦300,000 to ₦800,000 NGN/i.test(r.text));
    }},
    { user: "When is the next session?", verify: (r) => {
        assert.ok(!/Next session is on/i.test(r.text));
    }},
    { user: "What qualifications will I receive?", verify: (r) => {
        assert.ok(!/You will receive a PhD/i.test(r.text));
    }}
  ]);

  // Conversation E: Ambiguous context
  testCase("Conversation E", [
    { user: "Tell me about Dubai and Kigali hubs." },
    { user: "How much does it cost?", verify: (r) => {
        assert.ok(/₦300,000 to ₦800,000 NGN/i.test(r.text));
    }},
  ]);

  // Conversation F: Repeat greeting
  testCase("Conversation F", [
    { user: "Hi" },
    { user: "Hello", verify: (r) => {
        assert.ok(/Hello again/i.test(r.text));
    }},
  ]);

  console.log("\nALL MANUAL CONVERSATIONS VERIFIED");
  fs.rmSync(tempDir, { recursive: true, force: true });
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
