import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

async function run() {
  const tempDir = join(process.cwd(), "temp_repro");
  const fs = await import("node:fs");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  fs.writeFileSync(join(tempDir, "data.ts"), readFileSync(join(process.cwd(), "src/lib/data.ts"), "utf8"));
  fs.writeFileSync(join(tempDir, "phones.ts"), readFileSync(join(process.cwd(), "src/lib/phones.ts"), "utf8"));
  
  const source = readFileSync(join(process.cwd(), "src/lib/concierge.ts"), "utf8")
    .replace('from "./data"', 'from "./data.ts"')
    .replace('from "./phones"', 'from "./phones.ts"');
  fs.writeFileSync(join(tempDir, "concierge.ts"), source);

  const { getConciergeReply } = await import(pathToFileURL(join(tempDir, "concierge.ts")).href);

  const query = "I'm interested in leadership training.";
  const reply = getConciergeReply(query);
  console.log(`Query: ${query}`);
  console.log(`Reply: ${reply.text}`);
  console.log(`Cards: ${JSON.stringify(reply.cards)}`);

  fs.rmSync(tempDir, { recursive: true, force: true });
}
run().catch(console.error);
