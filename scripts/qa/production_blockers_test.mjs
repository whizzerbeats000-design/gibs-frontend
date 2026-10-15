import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { chromium } from "playwright-core";
import { VALID_CATEGORIES, categoryToSlug } from "../../src/lib/categoryUtils.ts";
import { PROGRAMMES } from "../../src/lib/data.ts";

const ROOT = path.join(process.cwd(), "dist");

function findChromium() {
  if (process.env.CHROMIUM_PATH && fs.existsSync(process.env.CHROMIUM_PATH)) return process.env.CHROMIUM_PATH;
  const cacheRoots = [process.env.PLAYWRIGHT_BROWSERS_PATH, path.join(process.env.HOME || "/root", ".cache", "ms-playwright")].filter(Boolean);
  for (const root of cacheRoots) {
    if (fs.existsSync(root)) {
      for (const base of fs.readdirSync(root)) {
        const exe = path.join(root, base, "chrome-linux", "chrome");
        if (base.startsWith("chromium") && fs.existsSync(exe)) return exe;
      }
    }
  }
  return undefined;
}

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".json": "application/json",
};

// Emulate Vercel routing with cleanUrls, filesystem check, and SPA fallback
const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  let filePath = path.join(ROOT, urlPath);

  // 1. Exact file match
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200, { "content-type": MIME[path.extname(filePath)] || "application/octet-stream" });
    return res.end(fs.readFileSync(filePath));
  }

  // 2. Directory index match
  const indexPath = path.join(filePath, "index.html");
  if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
    res.writeHead(200, { "content-type": "text/html" });
    return res.end(fs.readFileSync(indexPath));
  }

  // 3. Clean url match (e.g. /about -> /about.html)
  const cleanPath = `${filePath}.html`;
  if (fs.existsSync(cleanPath) && fs.statSync(cleanPath).isFile()) {
    res.writeHead(200, { "content-type": "text/html" });
    return res.end(fs.readFileSync(cleanPath));
  }

  // 4. SPA Fallback
  const fallback = path.join(ROOT, "index.html");
  if (fs.existsSync(fallback)) {
    res.writeHead(200, { "content-type": "text/html" });
    return res.end(fs.readFileSync(fallback));
  }

  res.writeHead(404);
  res.end("Not Found");
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const BASE = `http://127.0.0.1:${server.address().port}`;

let failures = 0;
function assert(name, condition, detail = "") {
  if (condition) {
    console.log(`  PASS: ${name}`);
  } else {
    failures++;
    console.error(`  FAIL: ${name}${detail ? ` (${detail})` : ""}`);
  }
}

console.log("=== VERIFYING THREE PRODUCTION BLOCKERS ===\n");

// -------------------------------------------------------------
// CHECK 1: Route-Specific HTML Delivery & Shell Inventory
// -------------------------------------------------------------
console.log("1. Route-specific HTML Delivery & Vercel Configuration");

const vercelJson = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
assert("vercel.json cleanUrls is enabled", vercelJson.cleanUrls === true);
const hasFilesystemHandle = vercelJson.routes?.some((r) => r.handle === "filesystem");
assert("vercel.json contains handle: filesystem before SPA rewrite", hasFilesystemHandle);
const hasWwwRedirect = vercelJson.routes?.some((r) => r.has?.some((h) => h.value === "www.gibs.com.ng") && r.status === 301);
assert("vercel.json contains www -> apex 301 redirect rule", hasWwwRedirect);

// Check distinct pre-rendered shells
const aboutHtml = fs.readFileSync(path.join(ROOT, "about", "index.html"), "utf8");
assert("/about shell has distinct title", aboutHtml.includes("<title>About GIBS"));
assert("/about shell has distinct canonical", aboutHtml.includes('href="https://gibs.com.ng/about"'));

const progHtml = fs.readFileSync(path.join(ROOT, "programmes", "index.html"), "utf8");
assert("/programmes shell has distinct title", progHtml.includes("<title>2026 Training Calendar"));
assert("/programmes shell has distinct canonical", progHtml.includes('href="https://gibs.com.ng/programmes"'));

// -------------------------------------------------------------
// CHECK 2: Canonical Metadata & Apex Consolidation
// -------------------------------------------------------------
console.log("\n2. Canonical Host Unification");

const indexHtml = fs.readFileSync("index.html", "utf8");
assert("index.html canonical is apex", indexHtml.includes('<link rel="canonical" href="https://gibs.com.ng/" />'));
assert("index.html og:url is apex", indexHtml.includes('<meta property="og:url" content="https://gibs.com.ng/" />'));
assert("index.html contains zero www.gibs.com.ng references", !indexHtml.includes("www.gibs.com.ng"));

const robotsTxt = fs.readFileSync("public/robots.txt", "utf8");
assert("public/robots.txt points to apex sitemap", robotsTxt.includes("Sitemap: https://gibs.com.ng/sitemap.xml"));

const sitemapXml = fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8");
assert("sitemap.xml contains zero www.gibs.com.ng references", !sitemapXml.includes("www.gibs.com.ng"));
assert("sitemap.xml contains valid XML headers", sitemapXml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));

// -------------------------------------------------------------
// CHECK 3: Functional Category Routes in Real Headless Browser
// -------------------------------------------------------------
console.log("\n3. Functional Category Routes (Browser Execution & Hydration)");

const chromiumPath = findChromium();
const browser = await chromium.launch({
  executablePath: chromiumPath,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  // Test category 1: Accounting and Financial Management
  {
    const page = await browser.newPage();
    const url = `${BASE}/programmes/category/accounting-and-financial-management`;
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const title = await page.title();
    const h1 = await page.$eval("h1", (el) => el.innerText).catch(() => "");
    const is404 = await page.evaluate(() => document.body.innerText.includes("Page not found"));
    const activeChip = await page.$eval('[role="group"] button[aria-pressed="true"]', (el) => el.innerText).catch(() => "");
    const cardCount = await page.$$eval("[data-programme-card]", (els) => els.length);

    assert("Accounting category title is set", title.includes("Accounting and Financial Management Training Programmes"));
    assert("Accounting category H1 is set", h1.includes("Accounting and Financial Management Programmes."));
    assert("Accounting category does NOT render 404", !is404);
    assert("Accounting filter chip is active", activeChip === "Accounting and Financial Management");
    assert("Accounting category displays programmes", cardCount > 0, `found ${cardCount} cards`);
    await page.close();
  }

  // Test category 2: Telecom & Utilities Regulation (tests '&' -> 'and' normalization)
  {
    const page = await browser.newPage();
    const url = `${BASE}/programmes/category/telecom-and-utilities-regulation`;
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const title = await page.title();
    const h1 = await page.$eval("h1", (el) => el.innerText).catch(() => "");
    const is404 = await page.evaluate(() => document.body.innerText.includes("Page not found"));
    const activeChip = await page.$eval('[role="group"] button[aria-pressed="true"]', (el) => el.innerText).catch(() => "");

    assert("Telecom category title is set", title.includes("Telecom & Utilities Regulation Training Programmes"));
    assert("Telecom category H1 is set", h1.includes("Telecom & Utilities Regulation Programmes."));
    assert("Telecom category does NOT render 404", !is404);
    assert("Telecom filter chip is active", activeChip === "Telecom & Utilities Regulation");
    await page.close();
  }

  // Test invalid category route: must render NotFound
  {
    const page = await browser.newPage();
    const url = `${BASE}/programmes/category/invalid-nonexistent-category-slug`;
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const is404 = await page.evaluate(() => document.body.innerText.includes("Page not found"));
    assert("Invalid category route renders NotFound", is404);
    await page.close();
  }

  // Test all 15 category shells exist on disk
  console.log("\n4. Verifying All 15 Category Shells and Sitemap Entries");
  for (const cat of VALID_CATEGORIES) {
    const slug = categoryToSlug(cat);
    const shellFile = path.join(ROOT, "programmes", "category", slug, "index.html");
    const cleanFile = path.join(ROOT, "programmes", "category", `${slug}.html`);
    assert(`Category shell exists on disk: ${slug}`, fs.existsSync(shellFile) && fs.existsSync(cleanFile));
    assert(`Sitemap includes category URL: ${slug}`, sitemapXml.includes(`https://gibs.com.ng/programmes/category/${slug}`));
  }

  console.log("\\n5. Programme shell inventory and metadata");
  const programmeShells = PROGRAMMES.map((programme) => {
    const shellFile = path.join(ROOT, "programmes", programme.slug, "index.html");
    const cleanFile = path.join(ROOT, "programmes", `${programme.slug}.html`);
    const expectedCanonical = `https://gibs.com.ng/programmes/${programme.slug}`;
    const html = fs.existsSync(shellFile) ? fs.readFileSync(shellFile, "utf8") : "";
    assert(`Programme shell exists: ${programme.slug}`, fs.existsSync(shellFile) && fs.existsSync(cleanFile));
    assert(`Programme metadata is route-specific: ${programme.slug}`, html.includes(`<title>${programme.title} | GIBS</title>`) && html.includes(`href="${expectedCanonical}"`));
    assert(`Sitemap includes programme URL: ${programme.slug}`, sitemapXml.includes(`<loc>${expectedCanonical}</loc>`));
  });
  const sitemapLocs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert("Sitemap URLs are unique", new Set(sitemapLocs).size === sitemapLocs.length);
  assert("Sitemap inventory matches generated routes", sitemapLocs.length === PROGRAMMES.length + VALID_CATEGORIES.length + 7 + 1);
} finally {
  await browser.close();
  server.close();
}

console.log(`\n=== RESULTS: ${failures === 0 ? "ALL CHECKS PASSED (0 FAILURES)" : `${failures} FAILURES`} ===`);
process.exit(failures === 0 ? 0 : 1);
