import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createServer } from "node:http";
import { homedir } from "node:os";
import { chromium } from "playwright-core";

const ROOT = join(process.cwd(), "dist");
const EXT = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".woff2": "font/woff2", ".json": "application/json", ".ico": "image/x-icon", ".txt": "text/plain",
};
const EXTENSIONS = Object.keys(EXT);

function findChromium() {
  const cacheRoots = [process.env.PLAYWRIGHT_BROWSERS_PATH, join(homedir(), ".cache", "ms-playwright")]
    .filter(Boolean);
  for (const root of cacheRoots) {
    if (!existsSync(root)) continue;
    for (const base of readdirSync(root)) {
      const exe = join(root, base, "chrome-linux", "chrome");
      if (base.startsWith("chromium") && existsSync(exe)) return exe;
    }
  }
  return undefined;
}

const server = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p === "/" || !EXTENSIONS.some((e) => p.endsWith(e))) p = "/index.html";
  const fp = join(ROOT, p.replace(/^(\.\.[^/\\])+/, ""));
  if (!existsSync(fp)) { res.writeHead(404); res.end(); return; }
  const ext = EXTENSIONS.find((e) => p.endsWith(e)) || ".html";
  res.writeHead(200, { "content-type": EXT[ext] });
  res.end(readFileSync(fp));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}`;

const executablePath = findChromium();
if (!executablePath) { console.error("No Chromium found."); process.exit(2); }

// Test WITHOUT reduced motion (default)
const browser = await chromium.launch({ executablePath, args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

// Capture CLS via LayoutShift
await page.addInitScript(() => {
  window.__layoutShifts = [];
  window.__scrollLog = [];
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput && entry.value > 0.001) {
        window.__layoutShifts.push({
          value: entry.value,
          sources: entry.sources.map(s => ({
            node: s.node?.nodeName || '?',
            cls: s.node?.className ? s.node.className.slice(0,40) : '',
            prevY: Math.round(s.previousRect.y), currY: Math.round(s.currentRect.y),
            prevH: Math.round(s.previousRect.height), currH: Math.round(s.currentRect.height),
          })),
        });
      }
    }
  });
  po.observe({ entryTypes: ["layout-shift"] });
});

await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);

console.log("=== TEST 1: Desktop 1440x900 (no reduced motion) ===\n");

// Track positions of elements at scroll intervals
// Focus on the area between hero (height 648) and the end
const pageHeight = await page.evaluate(() => document.body.scrollHeight);
const viewportHeight = await page.evaluate(() => window.innerHeight);
const scrollRange = pageHeight - viewportHeight;

// Track specific elements
const elements = [
  { name: 'hero', selector: '#home-hero' },
  { name: 'perspective', selector: '#perspective' },
  { name: 'programmes', selector: '#programmes' },
  { name: 'institution', selector: 'section:nth-of-type(4)' },
  { name: 'concierge', selector: 'section:nth-of-type(5)' },
  { name: 'journey', selector: '#subscription' },
  { name: 'footer', selector: 'footer' },
  { name: 'header', selector: 'header' },
];

// Take screenshots at key scroll points
const screenshots = [];
const scrollPoints = [0, 200, 400, 600, 700, 800, 900, 1000, 1200, 1500, 2000, 2500, 3000, 3500, 4000, 4693];

for (const y of scrollPoints.filter(p => p <= scrollRange)) {
  await page.evaluate((scrollY) => window.scrollTo({ top: scrollY, behavior: 'auto' }), y);
  await page.waitForTimeout(100);
  
  const data = await page.evaluate((elems) => {
    return elems.map(({ name, selector }) => {
      const el = document.querySelector(selector);
      if (!el) return { name, found: false };
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { name, found: true, 
        offsetTop: el.offsetTop, offsetHeight: el.offsetHeight,
        rectTop: Math.round(r.top), rectHeight: Math.round(r.height),
        opacity: cs.opacity, transform: cs.transform,
        position: cs.position,
      };
    });
  }, elements);
  
  const scrollY = await page.evaluate(() => window.scrollY);
  
  // Check for unexpected changes
  console.log(`\nscrollY=${scrollY}`);
  for (const el of data) {
    if (el.found) {
      console.log(`  ${el.name}: offsetTop=${el.offsetTop} offsetH=${el.offsetHeight} rectTop=${el.rectTop} opacity=${el.opacity} pos=${el.position}`);
    }
  }
}

// Check layout shifts
const shifts = await page.evaluate(() => window.__layoutShifts || []);
console.log(`\nLayout shifts (CLS) captured: ${shifts.length}`);
if (shifts.length > 0) {
  let totalCLS = 0;
  for (const s of shifts) {
    totalCLS += s.value;
    console.log(`  CLS=${s.value.toFixed(4)}:`);
    for (const src of s.sources) {
      console.log(`    ${src.node}.${src.cls}: y ${src.prevY}→${src.currY}, h ${src.prevH}→${src.currH}`);
    }
  }
  console.log(`Total CLS: ${totalCLS.toFixed(4)}`);
} else {
  console.log("No layout shifts detected.\n");
}

// Now check if any element's height changes during scroll (which would indicate a jump)
console.log("\n=== Checking element height stability ===\n");
const firstPositions = await page.evaluate((elems) => {
  return elems.map(({ name, selector }) => {
    const el = document.querySelector(selector);
    if (!el) return { name, found: false };
    return { name, offsetHeight: el.offsetHeight, offsetTop: el.offsetTop };
  });
}, elements);

// Scroll to various points and check again
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);
const midPositions = await page.evaluate((scY) => {
  window.scrollTo(0, scY);
  return window.scrollY;
}, 800);
await page.waitForTimeout(500);
const afterPositions = await page.evaluate((elems) => {
  return elems.map(({ name, selector }) => {
    const el = document.querySelector(selector);
    if (!el) return { name, found: false };
    return { name, offsetHeight: el.offsetHeight, offsetTop: el.offsetTop };
  });
}, elements);

console.log("Height/Top stability (top vs scrollY=800):");
for (let i = 0; i < firstPositions.length; i++) {
  const a = firstPositions[i];
  const b = afterPositions[i];
  if (a.found && b.found) {
    const hDelta = b.offsetHeight - a.offsetHeight;
    const tDelta = b.offsetTop - a.offsetTop;
    if (hDelta !== 0 || tDelta !== 0) {
      console.log(`  JUMP: ${a.name} height ${a.offsetHeight}→${b.offsetHeight} (Δ${hDelta}), top ${a.offsetTop}→${b.offsetTop} (Δ${tDelta})`);
    } else {
      console.log(`  OK: ${a.name} height=${a.offsetHeight} top=${a.offsetTop}`);
    }
  }
}

// Check font loading status
const fontStatus = await page.evaluate(() => {
  const statuses = [];
  if ('fonts' in document) {
    // @ts-ignore
    document.fonts.forEach((f) => {
      statuses.push({ family: f.family, status: f.status });
    });
  }
  return statuses;
});
console.log("\nFont loading status:", JSON.stringify(fontStatuses || "N/A"));

// Check the Hero's scroll-linked animation
console.log("\n=== Hero scroll-linked animation check ===\n");
for (const y of [0, 200, 400, 600]) {
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
  await page.waitForTimeout(100);
  const heroState = await page.evaluate(() => {
    const hero = document.querySelector('#home-hero');
    if (!hero) return null;
    const inner = hero.querySelector('.layer-z-fore > div');
    const bg = hero.querySelector('.layer-z-deep > div > div');
    return {
      heroRect: hero.getBoundingClientRect(),
      innerTransform: inner ? getComputedStyle(inner).transform : "N/A",
      innerOpacity: inner ? getComputedStyle(inner).opacity : "N/A",
    };
  });
  console.log(`scrollY=${y}: ${JSON.stringify(heroState)}`);
}

await browser.close();
server.close();
console.log("\nDone.");
