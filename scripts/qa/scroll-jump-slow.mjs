import { chromium } from "playwright-core";
import { join } from "node:path";
import { homedir } from "node:os";
import { existsSync, readdirSync } from "node:fs";

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

const executablePath = findChromium();
const browser = await chromium.launch({ executablePath, args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] });

// Test with slow 4G to trigger font loading reflows
console.log("=== LIVE SITE: Slow 4G (150ms RTT, 1.6Mbps down) ===\n");
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "no-preference",
  ...{
    offline: false,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
});
const page = await context.newPage();

await page.route("**/*", async (route) => {
  const url = route.request().url();
  // Slow down font and CSS requests to simulate slow loading
  const type = route.request().resourceType();
  if (type === "font" || type === "stylesheet" || type === "script" || type === "image") {
    await new Promise((r) => setTimeout(r, 500)); await route.continue();
  } else {
    await route.continue();
  }
});

await page.addInitScript(() => {
  window.__layoutShifts = [];
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput && entry.value > 0.001) {
        window.__layoutShifts.push({
          value: entry.value,
          sources: entry.sources.map(s => ({
            node: s.node?.nodeName, id: s.node?.id, cls: s.node?.className?.slice(0,40) || '',
            prevY: Math.round(s.previousRect.y), currY: Math.round(s.currentRect.y),
            prevH: Math.round(s.previousRect.height), currH: Math.round(s.currentRect.height),
            prevW: Math.round(s.previousRect.width), currW: Math.round(s.currentRect.width),
          })),
        });
      }
    }
  });
  po.observe({ entryTypes: ["layout-shift"] });
});

await page.goto("https://gibs.com.ng", { waitUntil: "domcontentloaded", timeout: 30000 });

// Track font loading status
const initialFontStatus = await page.evaluate(() => {
  const statuses = [];
  document.fonts.forEach((f) => { statuses.push({ family: f.family, status: f.status }); });
  return statuses;
});
console.log("Initial font status:", JSON.stringify(initialFontStatus));

// Start scrolling immediately (during potential font load)
let scrollY = 0;
let jumps = [];

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

let prevPositions = null;

for (let step = 0; step <= 20; step++) {
  const targetY = step * 100;
  await page.evaluate((y) => window.scrollTo(0, y), targetY);
  await page.waitForTimeout(200);
  
  const currentPositions = await page.evaluate((elems) => {
    return elems.map(({ name, selector }) => {
      const el = document.querySelector(selector);
      if (!el) return { name, found: false };
      return { name, found: true, offsetHeight: el.offsetHeight, offsetTop: el.offsetTop };
    });
  }, elements);
  
  if (prevPositions) {
    for (let i = 0; i < currentPositions.length; i++) {
      const prev = prevPositions[i];
      const curr = currentPositions[i];
      if (prev.found && curr.found) {
        const hDelta = Math.abs(curr.offsetHeight - prev.offsetHeight);
        if (hDelta > 1) {
          jumps.push({ step, scrollY: targetY, element: curr.name, from: prev.offsetHeight, to: curr.offsetHeight, delta: hDelta });
        }
      }
    }
  }
  prevPositions = currentPositions;
}

console.log("\n=== JUMPS DETECTED ===\n");
if (jumps.length > 0) {
  for (const j of jumps) {
    console.log(`  scrollY=${j.scrollY}px: ${j.element} height ${j.from}→${j.to} (Δ${j.delta})`);
  }
} else {
  console.log("No element size jumps detected during slow-load scroll.");
}

const shifts = await page.evaluate(() => window.__layoutShifts || []);
console.log(`\nLayout shifts during slow load: ${shifts.length}`);
if (shifts.length > 0) {
  let totalCLS = 0;
  for (const s of shifts) {
    totalCLS += s.value;
    console.log(`  CLS=${s.value.toFixed(4)}`);
    for (const src of s.sources) {
      console.log(`  ${src.node}.${src.cls}: y ${src.prevY}→${src.currY}, h ${src.prevH}→${src.currH}, w ${src.prevW}→${src.currW}`);
    }
  }
  console.log(`Total CLS: ${totalCLS.toFixed(4)}`);
}

// Check font loading status at end
const fontStatusEnd = await page.evaluate(() => {
  const statuses = [];
  document.fonts.forEach((f) => {
    statuses.push({ family: f.family, status: f.status });
  });
  return statuses;
});
console.log("\nFont status at end:", JSON.stringify(fontStatusEnd));

await context.close();
await browser.close();
