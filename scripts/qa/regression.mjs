import { readFileSync, existsSync, readdirSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { homedir } from "node:os";
import { createServer } from "node:http";
import { chromium } from "playwright-core";

const ROOT = process.env.DIST_DIR || join(process.cwd(), "dist");
const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".woff2": "font/woff2", ".json": "application/json",
};

function findChromium() {
  if (process.env.CHROMIUM_PATH && existsSync(process.env.CHROMIUM_PATH)) return process.env.CHROMIUM_PATH;
  const cacheRoots = [process.env.PLAYWRIGHT_BROWSERS_PATH, join(homedir(), ".cache", "ms-playwright")]
    .filter(Boolean);
  for (const root of cacheRoots) {
    for (const base of existsSync(root) ? readdirSync(root) : []) {
      const exe = join(root, base, "chrome-linux", "chrome");
      if (base.startsWith("chromium") && existsSync(exe)) return exe;
    }
  }
  return undefined;
}

const server = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p === "/" || !extname(p)) p = "/index.html";
  try {
    res.writeHead(200, { "content-type": MIME[extname(p)] || "application/octet-stream" });
    res.end(readFileSync(join(ROOT, normalize(p).replace(/^(\.\.[/\\])+/, ""))));
  } catch {
    res.writeHead(404); res.end();
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}`;

const VIEWPORTS = [
  [320, 720], [360, 800], [390, 844], [430, 932],
  [600, 960], [768, 1024], [1024, 768],
  [1280, 800], [1440, 900], [1920, 1080],
];

const ROUTES = [
  "/",
  "/programmes",
  "/executive-education",
  "/admissions",
  "/about",
  "/faculty",
  "/research-insights",
  "/campus",
  "/gallery",
  "/events",
  "/contact",
  "/concierge",
  "/programmes/course-1-public-sector-accounting-procedure-and-standards",
  "/research-insights/capacity-building-and-national-manpower-development",
  "/events/telecom-utilities-regulatory-roundtable",
  "/definitely-not-a-real-page",
];

const AXE = existsSync(join(process.cwd(), "node_modules/axe-core/axe.min.js"))
  ? readFileSync(join(process.cwd(), "node_modules/axe-core/axe.min.js"), "utf8")
  : null;

const executablePath = findChromium();
if (!executablePath) {
  console.error("No Chromium found. Set CHROMIUM_PATH or run `npx playwright-core install chromium`.");
  process.exit(2);
}
const browser = await chromium.launch({
  executablePath,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
});

let failures = 0;
const fail = (msg) => { failures++; console.log(`  FAIL ${msg}`); };

/* ---------- 1. Forensic overflow sweep ---------- */
console.log("1. Overflow / errors / console / network (all routes x viewports)");
let oxRoutes = 0;
for (const [w, h] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  const consoleErrors = [];
  const failedRequests = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
  page.on("requestfailed", (r) => failedRequests.push(`${r.url()} :: ${r.failure()?.errorText}`));
  page.on("response", (r) => { if (r.status() >= 400) failedRequests.push(`${r.status()} ${r.url()}`); });

  for (const route of ROUTES) {
    try {
      await page.goto(`${BASE}/#${route}`, { waitUntil: "domcontentloaded", timeout: 15000 });
      await page.waitForTimeout(900);
      const m = await page.evaluate((hashRoute) => {
        const doc = document.documentElement;
        const ox = doc.scrollWidth - doc.clientWidth;
        const offenders = [];
        if (ox > 0) {
          for (const el of document.querySelectorAll("*")) {
            const r = el.getBoundingClientRect();
            if (r.right > doc.clientWidth + 0.5 && r.width > 0) {
              const cls = (el.className && typeof el.className === "string") ? el.className.slice(0, 90) : el.tagName;
              offenders.push(`${el.tagName}##${cls}##x=${Math.round(r.left)} right=${Math.round(r.right)} >${doc.clientWidth}`);
            }
          }
        }
        const cards = [];
        if (hashRoute === "/programmes" || hashRoute === "/executive-education") {
          document.querySelectorAll(".programme-card").forEach((c) => {
            const fee = c.querySelector("span.block.font-serif");
            if (fee && fee.scrollWidth > fee.clientWidth + 2) cards.push("fee-clip");
          });
        }
        return { ox, offenders: offenders.slice(0, 8), cards, imgNoAlt: [...document.querySelectorAll("img")].filter((i) => i.getAttribute("alt") === null).length };
      }, route);
      if (m.ox > 0) { oxRoutes++; fail(`${w}x${h} ${route} oveflow-x=${m.ox} ${m.offenders[0] ?? ""}`); }
      if (m.cards.length) { fail(`${w}x${h} ${route} fee-clip on ${m.cards.length} card(s)`); }
      if (m.imgNoAlt) fail(`${w}x${h} ${route} ${m.imgNoAlt} img(s) missing alt`);
      if (consoleErrors.length) fail(`${w}x${h} ${route} console: ${[...new Set(consoleErrors)].slice(0, 2).join(" | ")}`);
      if (failedRequests.length) fail(`${w}x${h} ${route} net: ${[...new Set(failedRequests)].slice(0, 2).join(" | ")}`);
    } catch (err) {
      fail(`${w}x${h} ${route} ${String(err).slice(0, 120)}`);
    }
    consoleErrors.length = 0;
    failedRequests.length = 0;
  }
  await page.close();
}
console.log(`  overflow/error routes: ${oxRoutes}`);

/* ---------- 2. Axe at rest (reduced motion, 2600ms settle) ---------- */
if (AXE) {
  console.log("2. axe at rest (reduced-motion, 2600ms settle; 390/1024/1440)");
  const byRule = {};
  for (const vp of [390, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width: vp, height: 900 }, reducedMotion: "reduce" });
    for (const route of ROUTES) {
      await page.goto(`${BASE}/#${route}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2600);
      await page.addScriptTag({ content: AXE });
      const res = await page.evaluate(async () => (await window.axe.run(document, { resultTypes: ["violations"] })));
      for (const v of res.violations) {
        const key = `${v.id}[${v.impact}]`;
        byRule[key] = byRule[key] || [];
        byRule[key].push(`${vp}:${route}`);
      }
    }
    await page.close();
  }
  if (Object.keys(byRule).length === 0) {
    console.log("  NONE — clean.");
  } else {
    for (const [k, v] of Object.entries(byRule).sort((a, b) => b[1].length - a[1].length)) {
      fail(`axe ${k} ${v.length}x ${[...new Set(v)].slice(0, 4).join(", ")}`);
    }
  }
} else {
  console.log("2. axe not installed – skipped (npm i -D axe-core to enable)");
}

/* ---------- 3. Heading order monotone ---------- */
console.log("3. Heading order monotone (1440)");
for (const route of ROUTES) {
  if (route === "/definitely-not-a-real-page") continue;
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await page.goto(`${BASE}/#${route}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  const info = await page.evaluate(() => {
    const seq = [];
    document.querySelectorAll("h1,h2,h3,h4").forEach((h) => { if (h.offsetParent) seq.push(h.tagName); });
    const bad = seq.findIndex((t, i) => i > 0 && parseInt(t[1]) > parseInt(seq[i - 1][1]) + 1);
    return { bad: bad >= 0 ? `H${seq[bad - 1]}->${seq[bad]}` : null };
  });
  if (info.bad) fail(`${route} heading skip ${info.bad}`);
  await page.close();
}

/* ---------- 4. Geometry visual QA (clip / tiny / target) ---------- */
console.log("4. Geometry visual QA (320/390/768/920/1440/1920)");
const gqaRoutes = ["/", "/programmes", "/about", "/admissions", "/contact", "/campus",
  "/executive-education", "/research-insights", "/gallery", "/events", "/concierge",
  "/programmes/course-1-public-sector-accounting-procedure-and-standards"];
for (const w of [320, 390, 768, 920, 1440, 1920]) {
  for (const route of gqaRoutes) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
    await page.goto(`${BASE}/#${route}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    const finds = await page.evaluate(() => {
      const out = [];
      const SELECTOR = "h1,h2,h3,h4,p,li,button,a,label,span,td,th";
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (!el.offsetParent) return;
        if (el.scrollWidth > el.clientWidth + 2) {
          out.push({ t: (el.textContent || "").trim().slice(0, 40), w: el.clientWidth, s: el.scrollWidth });
        }
      });
      return out;
    });
    for (const f of finds) fail(`${w} ${route} clip "${f.t}" (${f.w}<=${f.s})`);
    await page.close();
  }
}

/* ---------- 5. Detail-page CTA text spill ---------- */
console.log("5. Detail CTA / contact-email text spill + target min 24px");
for (const w of [320, 360, 375, 390]) {
  const page = await browser.newPage({ viewport: { width: w, height: 1000 }, reducedMotion: "reduce" });
  await page.goto(`${BASE}/#/programmes/course-1-public-sector-accounting-procedure-and-standards`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(900);
  const m = await page.evaluate(() => {
    return [...document.querySelectorAll("a.btn")].map((a) => {
      const r = a.getBoundingClientRect();
      return { t: a.textContent.trim().replace(/\s+/g, " ").slice(0, 30), spill: a.scrollWidth > a.clientWidth + 2, h: Math.round(r.height) };
    }).filter((x) => x.spill);
  });
  for (const x of m) fail(`${w} btn spill "${x.t}" h=${x.h}`);
  await page.close();

  const c = await browser.newPage({ viewport: { width: w, height: 1000 }, reducedMotion: "reduce" });
  await c.goto(`${BASE}/#/contact`, { waitUntil: "domcontentloaded" });
  await c.waitForTimeout(900);
  const emails = await c.evaluate(() => [...document.querySelectorAll('a[href^="mailto:"]')].map((a) => Math.round(a.getBoundingClientRect().height)));
  for (const h of emails) if (h < 24) fail(`${w} contact email target height ${h}px < 24px`);
  await c.close();
}

await browser.close();
server.close();

console.log(failures ? `\nREGRESSION FAILURES: ${failures}` : "\nALL REGRESSION CHECKS PASS");
process.exit(failures ? 1 : 0);