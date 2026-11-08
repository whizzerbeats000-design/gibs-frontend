import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, normalize } from "node:path";

const ROOT = join(process.cwd(), "dist");
const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".woff2": "font/woff2", ".json": "application/json",
};

const server = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p === "/" || !extname(p)) {
    // If exact HTML file exists, serve it, else serve index.html
    const directHtml = join(ROOT, normalize(p) + ".html");
    if (existsSync(directHtml)) {
      res.writeHead(200, { "content-type": "text/html" });
      res.end(readFileSync(directHtml));
      return;
    }
    p = "/index.html";
  }
  const file = join(ROOT, normalize(p));
  try {
    const body = readFileSync(file);
    res.writeHead(200, { "content-type": MIME[extname(p)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});

await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}`;

const ROUTES = [
  "/",
  "/locations/ilorin",
  "/locations/abuja",
  "/locations/ibafo",
  "/programmes",
  "/programmes/category/accounting-and-financial-management",
  "/programmes/course-1-public-sector-accounting-procedure-and-standards",
  "/about",
  "/contact"
];

const VIEWPORTS = [
  { width: 320, height: 720, name: "mobile-xs-320" },
  { width: 390, height: 844, name: "mobile-390" },
  { width: 768, height: 1024, name: "tablet-768" },
  { width: 1440, height: 900, name: "desktop-1440" },
];

const configuredPath = process.env.CHROMIUM_PATH;
const executablePath = configuredPath && existsSync(configuredPath)
  ? configuredPath
  : (chromium.executablePath() || "");

const browser = await chromium.launch({
  executablePath: executablePath || undefined,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
});

let totalErrors = 0;

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();

  for (const r of ROUTES) {
    const consoleErrors = [];
    page.on("pageerror", (err) => consoleErrors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    const resp = await page.goto(`${BASE}${r}`, { waitUntil: "networkidle" });
    const status = resp?.status();
    const title = await page.title();
    const h1 = await page.$eval("h1", (el) => el.textContent?.trim()).catch(() => "NO_H1");
    const canonical = await page.$eval('link[rel="canonical"]', (el) => el.getAttribute("href")).catch(() => "NO_CANONICAL");
    
    // Check horizontal overflow
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    const isOk = status === 200 && consoleErrors.length === 0 && !overflow;
    if (!isOk) {
      console.error(`FAIL [${vp.name}] ${r}: status=${status}, overflow=${overflow}, consoleErrors=${JSON.stringify(consoleErrors)}`);
      totalErrors++;
    } else {
      console.log(`OK [${vp.name}] ${r} | H1: "${h1}" | Canonical: ${canonical}`);
    }
  }
  await context.close();
}

await browser.close();
server.close();

if (totalErrors > 0) {
  console.error(`\nCompleted with ${totalErrors} errors.`);
  process.exit(1);
} else {
  console.log(`\nAll targeted route and viewport checks PASSED cleanly!`);
  process.exit(0);
}
