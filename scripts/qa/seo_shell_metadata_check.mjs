import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function readShell(route) {
  return readFileSync(join(root, "dist", route, "index.html"), "utf8");
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "is"));
  return match ? decodeEntities(match[2]) : null;
}

function metaValue(html, key, kind = "name") {
  const matches = [...html.matchAll(/<meta\b[^>]*>/gi)].filter((match) => attribute(match[0], kind) === key);
  assert.equal(matches.length, 1, `${key} must exist exactly once`);
  return attribute(matches[0][0], "content");
}

function canonicalValue(html) {
  const matches = [...html.matchAll(/<link\b[^>]*>/gi)].filter((match) =>
    (attribute(match[0], "rel") ?? "").split(/\s+/).includes("canonical")
  );
  assert.equal(matches.length, 1, "canonical link must exist exactly once");
  return attribute(matches[0][0], "href");
}

function titleValue(html) {
  return decodeEntities(html.match(/<title>(.*?)<\/title>/is)?.[1] ?? "");
}

function staticText(markup) {
  return decodeEntities(markup.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function checkStaticShell(route, expected) {
  const html = readShell(route);
  checkSocialPair(html, { ...expected, shell: route });

  assert.match(
    html,
    /\.js\s+#root\s*>\s*main:not\(#main\)\s*\{\s*display:\s*none;?\s*\}/i,
    `${route}: static body must be hidden when JavaScript is available to prevent a mount flash`
  );
  const root = html.match(/<div id="root">([\s\S]*?)<\/div>/i);
  assert.ok(root, `${route}: static body must be inside the React root`);
  const main = root[1].match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  assert.ok(main, `${route}: static main must exist before JavaScript executes`);

  const headings = [...main[1].matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  assert.equal(headings.length, 1, `${route}: static body must contain one H1`);
  assert.equal(staticText(headings[0][1]), expected.h1, `${route}: static H1`);

  const paragraphs = [...main[1].matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)];
  assert.equal(paragraphs.length, 1, `${route}: static body must contain one introductory paragraph`);
  assert.equal(staticText(paragraphs[0][1]), expected.intro, `${route}: static introduction`);
}

function checkSocialPair(html, { title, description, canonical, shell }) {
  assert.equal(titleValue(html), title, `${shell}: document title`);
  assert.equal(metaValue(html, "description"), description, `${shell}: description`);
  assert.equal(metaValue(html, "og:title", "property"), title, `${shell}: Open Graph title`);
  assert.equal(metaValue(html, "og:description", "property"), description, `${shell}: Open Graph description`);
  assert.equal(metaValue(html, "twitter:title"), title, `${shell}: Twitter title`);
  assert.equal(metaValue(html, "twitter:description"), description, `${shell}: Twitter description`);
  assert.equal(canonicalValue(html), canonical, `${shell}: canonical`);
  assert.equal(metaValue(html, "og:url", "property"), canonical, `${shell}: Open Graph URL`);
  assert.equal(metaValue(html, "twitter:card"), "summary_large_image", `${shell}: Twitter card type`);
}

const home = readShell("");
const contact = readShell("contact");
const category = readShell("programmes/category/accounting-and-financial-management");
const programme = readShell("programmes/course-1-public-sector-accounting-procedure-and-standards");

assert.equal(titleValue(home), "GIBS — Goshen International Business School");
assert.equal(metaValue(home, "og:title", "property"), "GIBS — 2026 Executive Training Calendar & International Programmes");
assert.equal(metaValue(home, "twitter:title"), "GIBS — 2026 Executive Training Calendar & International Programmes");
assert.equal(metaValue(home, "og:description", "property"), "113 Local Open Programmes and 22 Foreign Executive Training Programmes across Kigali, Dubai, London, and Houston. Registered with the Corporate Affairs Commission (CAC), RC 1178333.");
assert.equal(metaValue(home, "twitter:description"), "113 Local Open Programmes and 22 Foreign Executive Training Programmes across Kigali, Dubai, London, and Houston.");
assert.equal(canonicalValue(home), "https://gibs.com.ng/");
assert.equal(metaValue(home, "og:url", "property"), canonicalValue(home));
assert.equal(metaValue(home, "twitter:card"), "summary_large_image");
checkSocialPair(contact, {
  title: "Contact GIBS | Training Desk & Enquiries",
  description: "Get in touch with GIBS for programme registration and campus visits.",
  canonical: "https://gibs.com.ng/contact",
  shell: "contact",
});
checkSocialPair(category, {
  title: "Accounting and Financial Management Training Programmes | GIBS",
  description: "Explore our executive training programmes in Accounting and Financial Management at GIBS.",
  canonical: "https://gibs.com.ng/programmes/category/accounting-and-financial-management",
  shell: "category",
});
assert.equal(titleValue(programme), "Public Sector Accounting Procedure and Standards | GIBS");
assert.equal(metaValue(programme, "og:title", "property"), titleValue(programme));
assert.equal(metaValue(programme, "twitter:title"), titleValue(programme));
assert.ok(metaValue(programme, "description"), "programme description must be present");
assert.equal(metaValue(programme, "og:description", "property"), metaValue(programme, "description"));
assert.equal(metaValue(programme, "twitter:description"), metaValue(programme, "description"));
assert.equal(canonicalValue(programme), "https://gibs.com.ng/programmes/course-1-public-sector-accounting-procedure-and-standards");
assert.equal(metaValue(programme, "og:url", "property"), canonicalValue(programme));
assert.match(programme, /"@type":\s*"EducationalOrganization"/);
assert.match(readFileSync(join(root, "dist", "sitemap.xml"), "utf8"), /<loc>https:\/\/gibs\.com\.ng\/programmes\/course-1-public-sector-accounting-procedure-and-standards<\/loc>/);
assert.equal((readFileSync(join(root, "dist", "sitemap.xml"), "utf8").match(/<url>/g) ?? []).length, 158);
assert.match(readFileSync(join(root, "dist", "robots.txt"), "utf8"), /Sitemap:\s*https:\/\/gibs\.com\.ng\/sitemap\.xml/);

checkStaticShell("admissions", {
  title: "Programme Enquiries — Goshen International Business School",
  description: "The GIBS programme enquiry process: browse the 2026 calendar, make an enquiry, and GIBS handles the rest.",
  canonical: "https://gibs.com.ng/admissions",
  h1: "Enquire About a programme.",
  intro: "Discover a programme, make an enquiry, and GIBS handles the rest. Whether you are an individual professional or an organisation enquiring about staff training, our team guides you through the process.",
});
checkStaticShell("gallery", {
  title: "Gallery — GIBS",
  description: "Photographs of GIBS headquarters architecture, training rooms, guest residence and the Ibafo facility.",
  canonical: "https://gibs.com.ng/gallery",
  h1: "The GIBS campus",
  intro: "Photographs of GIBS headquarters architecture, classroom, reception and guest residence, and the Ibafo facility.",
});
checkStaticShell("concierge", {
  title: "GIBS AI — Ask about programmes and locations",
  description: "GIBS AI provides guided assistance for exploring our 113 local programmes, 22 foreign executive programmes, training locations, and programme enquiries.",
  canonical: "https://gibs.com.ng/concierge",
  h1: "Find the right programme",
  intro: "Ask about the 2026 training catalogue, overseas destinations, training locations or how to enquire.",
});

console.log("PASS static Admissions, Gallery, and Concierge shell content and metadata; homepage, contact, category, programme, sitemap, and structured metadata");
