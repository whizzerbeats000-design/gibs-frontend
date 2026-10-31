import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { PROGRAMMES, ENQUIRY_TYPES, getProgramme } from "../../src/lib/data.ts";

test("every programme in catalogue can be resolved by slug, code, and id", () => {
  for (const p of PROGRAMMES) {
    const bySlug = getProgramme(p.slug);
    assert.ok(bySlug, `Programme ${p.slug} must resolve by slug`);
    assert.equal(bySlug.slug, p.slug);

    const byCode = getProgramme(p.code);
    assert.ok(byCode, `Programme ${p.code} must resolve by code`);
    assert.equal(byCode.code, p.code);

    const byId = getProgramme(p.id);
    assert.ok(byId, `Programme ${p.id} must resolve by id`);
    assert.equal(byId.id, p.id);
  }
});

test("static programme shells contain canonical enquiry links with valid enquiry type and programme slug", () => {
  const distDir = join(process.cwd(), "dist");
  if (!existsSync(distDir)) return; // skip if dist not built

  for (const p of PROGRAMMES) {
    const file = join(distDir, "programmes", `${p.slug}.html`);
    if (!existsSync(file)) continue;

    const html = readFileSync(file, "utf8");
    const m = html.match(/href="(\/contact\?type=[^"]+)"/);
    assert.ok(m, `Programme shell ${p.slug} must contain a contact enquiry link`);

    const url = new URL(m[1], "https://gibs.com.ng");
    const type = url.searchParams.get("type");
    const prog = url.searchParams.get("programme");

    assert.ok(ENQUIRY_TYPES.includes(type), `Enquiry type "${type}" in ${p.slug} must be in ENQUIRY_TYPES`);
    assert.equal(prog, p.slug, `Enquiry programme parameter in ${p.slug} must match slug`);

    if (p.destination === "Local") {
      assert.equal(type, "Local Open Training Registration");
    } else {
      assert.equal(type, "Foreign Training Programmes (Kigali, Dubai, London, Houston)");
    }
  }
});
