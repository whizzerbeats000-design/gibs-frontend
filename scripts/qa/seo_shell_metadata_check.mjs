import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
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

// --- Crawlability & Static Navigation Checks ---
const dataTsContent = readFileSync(join(root, "src", "lib", "data.ts"), "utf8");
const catalogueSha = createHash("sha256").update(dataTsContent).digest("hex");
assert.equal(
  catalogueSha,
  "910ff4d75ad3110aa3062e0fbc3e6ea73074d0004a53780c35a961cef64dbde7",
  "src/lib/data.ts must maintain protected SHA-256 checksum"
);

const homeMain = home.match(/<div id="root">[\s\S]*?<main\b[^>]*>([\s\S]*?)<\/main>[\s\S]*?<\/div>/i);
assert.ok(homeMain, "homepage static main must exist inside React root");

// 1. Check semantic navigation containers on homepage
assert.match(homeMain[1], /<nav\s+aria-label="Institutional Navigation">/i, "homepage must have Institutional Navigation");
assert.match(homeMain[1], /<nav\s+aria-label="Programme Categories">/i, "homepage must have Programme Categories navigation");

// 2. Extract all anchor links from homepage static body
const homeLinks = [...homeMain[1].matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi)].map((m) => ({
  href: m[1],
  text: decodeEntities(m[2].trim()),
}));

assert.ok(homeLinks.length >= 22, `homepage must have at least 22 static internal links (got ${homeLinks.length})`);

// 3. Verify all 7 primary institutional routes are present
const expectedInstitutional = [
  "/programmes",
  "/about",
  "/contact",
  "/admissions",
  "/executive-education",
  "/gallery",
  "/concierge",
];
for (const route of expectedInstitutional) {
  assert.ok(
    homeLinks.some((l) => l.href === route),
    `homepage must contain link to primary route: ${route}`
  );
}

// 4. Verify all 15 category hubs are present on homepage
const expectedCategories = [
  "accounting-and-financial-management",
  "general-administration-and-management",
  "telecom-and-utilities-regulation",
  "consumer-protection-and-utilities",
  "environmental-sustainability-and-management",
  "oil-and-gas-sector",
  "secretarial-administration-and-management",
  "capital-market-and-securities-management",
  "information-technology-workshops",
  "legal-and-legislative-studies",
  "power-and-energy-sector",
  "maritime-and-transportation",
  "pension-management",
  "special-executive-training",
  "foreign-executive-training",
];
for (const slug of expectedCategories) {
  const catPath = `/programmes/category/${slug}`;
  assert.ok(
    homeLinks.some((l) => l.href === catPath),
    `homepage must contain link to category hub: ${catPath}`
  );
}

// 5. Verify every generated internal link on homepage points to a valid generated route file on disk
for (const link of homeLinks) {
  assert.ok(link.href.startsWith("/"), `internal link must be root-relative: ${link.href}`);
  const htmlPath = join(root, "dist", `${link.href}.html`);
  const indexPath = join(root, "dist", link.href, "index.html");
  assert.ok(
    existsSync(htmlPath) || existsSync(indexPath),
    `internal link target must exist in dist: ${link.href}`
  );
}

// 6. Verify /programmes shell contains all 15 category links
const programmesShell = readShell("programmes");
assert.match(programmesShell, /<nav\s+aria-label="Programme Categories">/i);
for (const slug of expectedCategories) {
  assert.match(
    programmesShell,
    new RegExp(`href="/programmes/category/${slug}"`),
    `programmes shell must link to category: ${slug}`
  );
}

// 7. Verify category shell has breadcrumb and programme links
assert.match(category, /<nav\s+aria-label="Breadcrumb">/i);
assert.match(category, /href="\/programmes\/course-1-public-sector-accounting-procedure-and-standards"/);

// 8. Verify programme shell has breadcrumb
assert.match(programme, /<nav\s+aria-label="Breadcrumb">/i);
assert.match(programme, /href="\/programmes\/category\/accounting-and-financial-management"/);

// --- External Asset Delivery & Shell Payload Size Checks ---
const homeBytes = readFileSync(join(root, "dist", "index.html")).length;
const categoryBytes = readFileSync(join(root, "dist", "programmes", "category", "accounting-and-financial-management", "index.html")).length;
const programmeBytes = readFileSync(join(root, "dist", "programmes", "course-1-public-sector-accounting-procedure-and-standards", "index.html")).length;

assert.ok(homeBytes < 50_000, `Homepage shell payload must be < 50 KB (got ${(homeBytes / 1024).toFixed(1)} KB)`);
assert.ok(categoryBytes < 50_000, `Category shell payload must be < 50 KB (got ${(categoryBytes / 1024).toFixed(1)} KB)`);
assert.ok(programmeBytes < 50_000, `Programme shell payload must be < 50 KB (got ${(programmeBytes / 1024).toFixed(1)} KB)`);

// Verify external assets exist in dist/assets
const assetsDir = join(root, "dist", "assets");
assert.ok(existsSync(assetsDir), "dist/assets directory must exist");
const jsAssets = readdirSync(assetsDir).filter((f) => f.endsWith(".js"));
const cssAssets = readdirSync(assetsDir).filter((f) => f.endsWith(".css"));
assert.ok(jsAssets.length >= 1, "At least one JavaScript asset bundle must exist in dist/assets");
assert.ok(cssAssets.length >= 1, "At least one CSS asset bundle must exist in dist/assets");

// Verify shells reference external assets with root-relative paths
assert.match(home, /<script\s+type="module"\s+crossorigin\s+src="\/assets\/[^"]+\.js"><\/script>/i);
assert.match(home, /<link\s+rel="stylesheet"\s+crossorigin\s+href="\/assets\/[^"]+\.css">/i);
assert.match(category, /<script\s+type="module"\s+crossorigin\s+src="\/assets\/[^"]+\.js"><\/script>/i);
assert.match(category, /<link\s+rel="stylesheet"\s+crossorigin\s+href="\/assets\/[^"]+\.css">/i);
assert.match(programme, /<script\s+type="module"\s+crossorigin\s+src="\/assets\/[^"]+\.js"><\/script>/i);
assert.match(programme, /<link\s+rel="stylesheet"\s+crossorigin\s+href="\/assets\/[^"]+\.css">/i);

// Ensure no relative ./assets/, ./fonts/, or ./images/ paths remain
assert.doesNotMatch(home, /href="\.\/(assets|fonts|images)\//);
assert.doesNotMatch(category, /href="\.\/(assets|fonts|images)\//);
assert.doesNotMatch(programme, /href="\.\/(assets|fonts|images)\//);

console.log("PASS static Admissions, Gallery, and Concierge shell content and metadata; homepage, contact, category, programme, sitemap, structured metadata, crawlable navigation, and external asset bundle delivery (<50KB shells)");
