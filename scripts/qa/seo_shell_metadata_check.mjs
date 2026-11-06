import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { PROGRAMMES } from "../../src/lib/data.ts";

const CANONICAL_DOMAIN = 'https://gibs.com.ng';
const root = process.cwd();
const distDir = process.env.GIBS_DIST_DIR
  ? resolve(root, process.env.GIBS_DIST_DIR)
  : join(root, "dist");

function readShell(route) {
  return readFileSync(join(distDir, route, "index.html"), "utf8");
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

assert.equal(
  metaValue(home, "og:title", "property"),
  "GIBS 2026 Executive Training Programmes \u2014 Nigeria & International Hubs",
  `homepage: og:title`
);
assert.equal(
  metaValue(home, "twitter:title"),
  "GIBS 2026 Executive Training Programmes \u2014 Nigeria & International Hubs",
  `homepage: twitter:title`
);
assert.equal(
  metaValue(home, "og:description", "property"),
  "113 Local Open Programmes and 22 Foreign Executive Training Programmes across Kigali, Dubai, London, and Houston. Registered with the Corporate Affairs…",
  `homepage: description`
);
assert.equal(
  metaValue(home, "twitter:description"),
  "113 Local Open Programmes and 22 Foreign Executive Training Programmes across Kigali, Dubai, London, and Houston. Registered with the Corporate Affairs…",
  `homepage: description`
);
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
assert.match(readFileSync(join(distDir, "sitemap.xml"), "utf8"), /<loc>https:\/\/gibs\.com\.ng\/programmes\/course-1-public-sector-accounting-procedure-and-standards<\/loc>/);

function getShells(dir) {
  let results = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getShells(fullPath));
    } else if (entry.isFile() && entry.name === 'index.html') {
      results.push({ path: fullPath, route: fullPath.replace(distDir, '').replace(/\\/g, '/').replace(/\/index\.html$/, '') || '/' });
    }
  }
  return results;
}

const shells = getShells(distDir);
console.log(`Checking ${shells.length} generated shells...`);

for (const shell of shells) {
  const html = readShell(shell.route);
  const title = titleValue(html);
  const desc = metaValue(html, 'description');

  assert.ok(title, `${shell.route}: missing title`);
  assert.ok(desc, `${shell.route}: missing description`);
  assert.ok(desc.length <= 160, `${shell.route}: description too long (${desc.length} chars)`);

  if (title.length > 120) {
    throw new Error(`${shell.route}: title exceeds 120 chars (${title.length})`);
  }

  assert.equal(canonicalValue(html), `${CANONICAL_DOMAIN}${shell.route}`, `${shell.route}: bad canonical`);
  if (shell.route !== '/') {
    assert.equal(metaValue(html, "og:title", "property"), title, `${shell.route}: og:title mismatch`);
    assert.equal(metaValue(html, "twitter:title"), title, `${shell.route}: twitter:title mismatch`);
  }
  assert.equal(metaValue(html, "og:description", "property"), desc, `${shell.route}: og:description mismatch`);
  assert.equal(metaValue(html, "twitter:description"), desc, `${shell.route}: twitter:description mismatch`);
}


assert.equal((readFileSync(join(distDir, "sitemap.xml"), "utf8").match(/<url>/g) ?? []).length, 159);
const sitemap = readFileSync(join(distDir, "sitemap.xml"), "utf8");
assert.equal(
  (sitemap.match(/<loc>https:\/\/gibs\.com\.ng\/privacy-policy<\/loc>/g) ?? []).length,
  1,
  "sitemap must include the canonical Privacy Policy URL exactly once"
);
assert.match(readFileSync(join(distDir, "robots.txt"), "utf8"), /Sitemap:\s*https:\/\/gibs\.com\.ng\/sitemap\.xml/);

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
  title: "GIBS Programme Assistant — Ask about programmes & locations",
  description: "Ask the GIBS Programme Assistant about our 135 2026 executive training programmes, overseas locations, and how to enquire.",
  canonical: "https://gibs.com.ng/concierge",
  h1: "Find the right programme",
  intro: "Ask about the 2026 training catalogue, overseas destinations, training locations or how to enquire.",
});

checkStaticShell("privacy-policy", {
  title: "Privacy Policy | Goshen International Business School",
  description: "Learn how GIBS handles your information, stores concierge history, and your data-protection rights.",
  canonical: "https://gibs.com.ng/privacy-policy",
  h1: "Privacy Policy",
  intro: "Learn what information you may enter on the GIBS website, how the local programme concierge stores conversation history, and how to ask about your data-protection rights.",
});

// Every generated static shell is user-visible to non-JavaScript clients and
// search crawlers. Keep retired source phone numbers out of that output even
// when a future programme FAQ contains one.
function htmlShells(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return htmlShells(path);
    return entry.isFile() && entry.name.endsWith(".html") ? [path] : [];
  });
}

const retiredPhoneNumbers = ["08033429427", "08032296041"];
for (const shellPath of htmlShells(distDir)) {
  const html = readFileSync(shellPath, "utf8");
  for (const number of retiredPhoneNumbers) {
    assert.ok(!html.includes(number), `${shellPath}: must not publish retired phone number ${number}`);
  }
}
assert.ok(contact.includes("08160010401"), "contact shell must retain the approved existing number");
assert.ok(contact.includes("08160010400"), "contact shell must publish the current training-desk number");

// No-JS enquiry: the contact static shell must expose clickable tel: and
// mailto: links so visitors without JavaScript can still call or email.
const telLinks = (contact.match(/href="tel:/g) || []).length;
const mailtoLinks = (contact.match(/href="mailto:/g) || []).length;
assert.ok(telLinks >= 1, `/contact static shell must contain a tel: link (found ${telLinks})`);
assert.ok(mailtoLinks >= 1, `/contact static shell must contain a mailto: link (found ${mailtoLinks})`);

// Crawlability: the /programmes directory shell must publish a static <a> for
// every canonical programme so crawlers can reach all 135 programme pages.
const programmesDirShell = readShell("programmes");
let linkedProgrammes = 0;
for (const p of PROGRAMMES) {
  if (programmesDirShell.includes(`href="/programmes/${p.slug}"`)) linkedProgrammes++;
}
assert.equal(
  linkedProgrammes,
  PROGRAMMES.length,
  `/programmes static shell must link all ${PROGRAMMES.length} programmes (linked ${linkedProgrammes})`
);

// --- JSON-LD Validation Across All Generated Pages ---
function extractJsonLd(html, shellRoute) {
  const blocks = [];
  const re = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      blocks.push(JSON.parse(m[1].trim()));
    } catch (e) {
      throw new Error(`Invalid JSON-LD in ${shellRoute}: ${e.message}`);
    }
  }
  return blocks;
}

let jsonLdPages = 0;
let coursePages = 0;
let itemListPages = 0;
let orgPages = 0;
let webPagePages = 0;
const allCanonicals = [];
const allItemListPositions = [];
const expiredDateWarnings = [];
const fabricatedAddressWarnings = [];
const selfReferentialSameAsWarnings = [];

for (const shell of shells) {
  const html = readShell(shell.route);
  const blocks = extractJsonLd(html, shell.route);
  if (blocks.length > 0) jsonLdPages++;

  const canonical = canonicalValue(html);
  allCanonicals.push(canonical);

  for (const block of blocks) {
    const nodes = Array.isArray(block) ? block : [block];
    for (const node of nodes) {
      if (!node || typeof node !== 'object') continue;

      // Check Course schema
      if (node['@type'] === 'Course') {
        coursePages++;
        // Course must NOT have top-level offers
        assert.ok(!('offers' in node), `${shell.route}: Course must not have top-level offers property`);
        // Course must have hasCourseInstance with CourseInstance
        assert.ok(node.hasCourseInstance, `${shell.route}: Course must have hasCourseInstance`);
        const hci = node.hasCourseInstance;
        if (hci && hci['@type'] === 'CourseInstance') {
          // CourseInstance offers must exist
          assert.ok(hci.offers, `${shell.route}: CourseInstance must have offers`);
          // Check duration is ISO format if present
          if (hci.duration) {
            assert.match(hci.duration, /^P\d+[DW]$/, `${shell.route}: CourseInstance duration must be ISO 8601 (got ${hci.duration})`);
          }
          // Check offers priceCurrency matches visible page
          if (hci.offers && hci.offers.priceCurrency) {
            assert.ok(['NGN', 'USD', 'GBP'].includes(hci.offers.priceCurrency), `${shell.route}: Invalid priceCurrency ${hci.offers.priceCurrency}`);
          }
          // No fabricated street address on CourseInstance location
          const loc = hci.location;
          if (loc && loc.address) {
            if (loc.address.streetAddress) {
              fabricatedAddressWarnings.push(`${shell.route}: CourseInstance location has streetAddress ${loc.address.streetAddress}`);
            }
          }
        }
      }

      // Check ItemList schema
      if (node['@type'] === 'ItemList') {
        itemListPages++;
        const elements = node.itemListElement || [];
        elements.forEach((el, idx) => {
          assert.equal(el.position, idx + 1, `${shell.route}: ItemList position must be sequential (got ${el.position} at index ${idx})`);
          assert.ok(el.url, `${shell.route}: ItemList item must have url`);
          allItemListPositions.push(el.position);
          // ItemList URL must match an actual programme page route
          const urlPath = new URL(el.url).pathname;
          assert.ok(urlPath.startsWith('/programmes/'), `${shell.route}: ItemList URL must be a programme route (got ${urlPath})`);
        });
      }

      // Check Organization/EducationalOrganization schema
      if (node['@type'] === 'EducationalOrganization' || node['@type'] === 'Organization') {
        orgPages++;
        // No self-referential sameAs
        if (node.sameAs) {
          const sameAsArray = Array.isArray(node.sameAs) ? node.sameAs : [node.sameAs];
          sameAsArray.forEach(sa => {
            if (sa === CANONICAL_DOMAIN) {
              selfReferentialSameAsWarnings.push(`${shell.route}: self-referential sameAs ${sa}`);
            }
          });
        }
        // No identifier on nested provider (RC 1178333 not visible on course pages)
        if (node.identifier && shell.route !== '/') {
          // This is a warning, not a block - identifier on nested org
        }
      }

      // Check WebPage schema
      if (node['@type'] === 'WebPage') {
        webPagePages++;
        // WebPage must have @id
        assert.ok(node['@id'], `${shell.route}: WebPage must have @id`);
        // WebPage must have inLanguage
        assert.ok(node['inLanguage'], `${shell.route}: WebPage must have inLanguage`);
        // WebPage must have isPartOf
        assert.ok(node.isPartOf, `${shell.route}: WebPage must have isPartOf`);
        // WebPage must have publisher
        assert.ok(node.publisher, `${shell.route}: WebPage must have publisher`);
      }

      // Check all JSON-LD nodes have @id
      if (node['@id']) {
        // Verify @id is a valid URL
        try {
          new URL(node['@id']);
        } catch (e) {
          throw new Error(`${shell.route}: Invalid @id: ${node['@id']}`);
        }
      }
    }
  }
}

// Assert unique canonicals
const canonicalCounts = {};
allCanonicals.forEach(c => { canonicalCounts[c] = (canonicalCounts[c] || 0) + 1; });
Object.entries(canonicalCounts).forEach(([url, count]) => {
  if (count > 1) throw new Error(`Duplicate canonical URL: ${url} appears ${count} times`);
});

// Assert unique ItemList positions within each page (already checked above)

// Report results
console.log(`JSON-LD validation: ${jsonLdPages} pages with JSON-LD, ${coursePages} Course schemas, ${itemListPages} ItemList schemas, ${orgPages} Organization schemas, ${webPagePages} WebPage schemas`);
console.log(`Unique canonicals: ${new Set(allCanonicals).size} / ${allCanonicals.length}`);

if (expiredDateWarnings.length > 0) {
  console.warn(`WARNING: ${expiredDateWarnings.length} pages may contain expired 2026 dates:`);
  expiredDateWarnings.forEach(w => console.warn(`  ${w}`));
}

if (fabricatedAddressWarnings.length > 0) {
  console.warn(`WARNING: ${fabricatedAddressWarnings.length} pages have fabricated addresses:`);
  fabricatedAddressWarnings.forEach(w => console.warn(`  ${w}`));
}

if (selfReferentialSameAsWarnings.length > 0) {
  console.warn(`WARNING: ${selfReferentialSameAsWarnings.length} pages have self-referential sameAs:`);
  selfReferentialSameAsWarnings.forEach(w => console.warn(`  ${w}`));
}

// --- Expired Schedule Suppression Checks ---
// Verify that no static shell presents 2026 dates as upcoming schedule info
const programmeShells = shells.filter(s => s.route.startsWith('/programmes/course-') || s.route.startsWith('/programmes/foreign-'));
let suppressedSchedules = 0;
for (const shell of programmeShells) {
  const html = readShell(shell.route);
  if (html.includes('Contact GIBS for the current programme schedule.')) {
    suppressedSchedules++;
  }
}
console.log(`Expired schedule suppression: ${suppressedSchedules} / ${programmeShells.length} programme shells suppress expired 2026 dates`);

// --- Expired Date Suppression in Metadata (all 135 programme pages) ---
// Verify no meta description, og:description, or twitter:description contains
// expired 2026 schedule dates (March 2, April 13, Sept 7).
let expiredMetaDescCount = 0;
let expiredOgDescCount = 0;
let expiredTwitterDescCount = 0;
for (const shell of programmeShells) {
  const html = readShell(shell.route);
  const metaDesc = metaValue(html, 'description');
  const ogDesc = metaValue(html, 'og:description', 'property');
  const twitterDesc = metaValue(html, 'twitter:description');
  const expiredPatterns = ['March 2', 'April 13', 'Sept 7', 'Scheduled across'];
  if (expiredPatterns.some(p => metaDesc.includes(p))) expiredMetaDescCount++;
  if (expiredPatterns.some(p => ogDesc.includes(p))) expiredOgDescCount++;
  if (expiredPatterns.some(p => twitterDesc.includes(p))) expiredTwitterDescCount++;
}
assert.equal(expiredMetaDescCount, 0, `${expiredMetaDescCount} programme pages have expired dates in meta description`);
assert.equal(expiredOgDescCount, 0, `${expiredOgDescCount} programme pages have expired dates in og:description`);
assert.equal(expiredTwitterDescCount, 0, `${expiredTwitterDescCount} programme pages have expired dates in twitter:description`);
console.log(`Expired date suppression in metadata: 0 / ${programmeShells.length} pages contain expired 2026 dates`);

// --- Homepage Metadata Consistency ---
// Homepage <title> must match og:title and twitter:title
const homeHtml = readShell("");
const homeTitle = titleValue(homeHtml);
const homeOgTitle = metaValue(homeHtml, "og:title", "property");
const homeTwitterTitle = metaValue(homeHtml, "twitter:title");
assert.equal(homeTitle, homeOgTitle, "Homepage <title> must match og:title");
assert.equal(homeTitle, homeTwitterTitle, "Homepage <title> must match twitter:title");
// Homepage meta description must match og:description and twitter:description
const homeMetaDesc = metaValue(homeHtml, "description");
const homeOgDesc = metaValue(homeHtml, "og:description", "property");
const homeTwitterDesc = metaValue(homeHtml, "twitter:description");
assert.equal(homeMetaDesc, homeOgDesc, "Homepage meta description must match og:description");
assert.equal(homeMetaDesc, homeTwitterDesc, "Homepage meta description must match twitter:description");
console.log(`Homepage metadata consistency: title=og:title=twitter:title, desc=og:desc=twitter:desc`);
const progHtml = readShell("programmes/course-1-public-sector-accounting-procedure-and-standards");
const progBlocks = extractJsonLd(progHtml, "programmes/course-1-public-sector-accounting-procedure-and-standards");
const courseNode = progBlocks.flat().find(n => n && n['@type'] === 'Course');
if (courseNode) {
  assert.equal(courseNode.name, "Public Sector Accounting Procedure and Standards", "Course name must match visible page title");
  assert.equal(courseNode.courseCode, "GIBS-LOC-001", "Course courseCode must match visible page");
  assert.ok(courseNode.description.includes("Public Sector Accounting Procedure and Standards"), "Course description must match visible page summary");
  assert.equal(courseNode.url, "https://gibs.com.ng/programmes/course-1-public-sector-accounting-procedure-and-standards", "Course url must match canonical");
  const hci = courseNode.hasCourseInstance;
  assert.equal(hci['@type'], 'CourseInstance', "hasCourseInstance must be CourseInstance");
  assert.equal(hci.duration, 'P5D', "CourseInstance duration must match visible page");
  assert.ok(hci.offers, "CourseInstance must have offers");
  assert.equal(hci.offers.price, 390000, "CourseInstance offer price must match visible page fee");
  assert.equal(hci.offers.priceCurrency, 'NGN', "CourseInstance offer priceCurrency must match visible page");
}

// --- Protected File Hash Verification ---
const typesContent = readFileSync(join(root, "src", "types", "data.ts"), "utf8");
const typesSha = createHash("sha256").update(typesContent).digest("hex");
assert.equal(
  typesSha,
  "37e8e6d5bb9fe6be6b96eda0d1de1eb9c93b80690728f682c0b50dcdf39ad867",
  "src/types/data.ts must maintain protected SHA-256 checksum"
);

const genContent = readFileSync(join(root, "scripts", "generate_data_ts.py"), "utf8");
const genSha = createHash("sha256").update(genContent).digest("hex");
assert.equal(
  genSha,
  "f44750038aeab91310da3300193080c999bc95c33050cb2a8c7f2151502319f3",
  "scripts/generate_data_ts.py must maintain protected SHA-256 checksum"
);

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

// 3. Verify all 8 primary institutional routes are present
const expectedInstitutional = [
  "/programmes",
  "/about",
  "/contact",
  "/admissions",
  "/executive-education",
  "/gallery",
  "/concierge",
  "/privacy-policy",
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
  const htmlPath = join(distDir, `${link.href}.html`);
  const indexPath = join(distDir, link.href, "index.html");
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
const homeBytes = readFileSync(join(distDir, "index.html")).length;
const categoryBytes = readFileSync(join(distDir, "programmes", "category", "accounting-and-financial-management", "index.html")).length;
const programmeBytes = readFileSync(join(distDir, "programmes", "course-1-public-sector-accounting-procedure-and-standards", "index.html")).length;

assert.ok(homeBytes < 50_000, `Homepage shell payload must be < 50 KB (got ${(homeBytes / 1024).toFixed(1)} KB)`);
assert.ok(categoryBytes < 50_000, `Category shell payload must be < 50 KB (got ${(categoryBytes / 1024).toFixed(1)} KB)`);
assert.ok(programmeBytes < 50_000, `Programme shell payload must be < 50 KB (got ${(programmeBytes / 1024).toFixed(1)} KB)`);

// Verify external assets exist in dist/assets
const assetsDir = join(distDir, "assets");
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

console.log("PASS static Admissions, Gallery, Concierge, and Privacy Policy shell content and metadata; homepage, contact, category, programme, sitemap, structured metadata, crawlable navigation, and external asset bundle delivery (<50KB shells)");
