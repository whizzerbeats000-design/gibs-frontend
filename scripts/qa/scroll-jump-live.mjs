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

// Test LIVE site on desktop
console.log("=== LIVE SITE TEST: Desktop 1440x900 ===\n");
const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const desktopPage = await desktopContext.newPage();

await desktopPage.addInitScript(() => {
  window.__layoutShifts = [];
  window.__jumpLog = [];
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput && entry.value > 0.001) {
        window.__layoutShifts.push({
          value: entry.value,
          sources: entry.sources.map(s => ({
            node: s.node?.nodeName, id: s.node?.id, cls: s.node?.className?.slice(0,40) || '',
            prevY: Math.round(s.previousRect.y), currY: Math.round(s.currentRect.y),
            prevH: Math.round(s.previousRect.height), currH: Math.round(s.currentRect.height),
          })),
        });
      }
    }
  });
  po.observe({ entryTypes: ["layout-shift"] });
});

try {
  await desktopPage.goto("https://gibs.com.ng", { waitUntil: "networkidle", timeout: 30000 });
} catch(e) {
  console.log("Live site not accessible:", e.message);
  await desktopContext.close();
  await browser.close();
  process.exit(0);
}

await desktopPage.waitForTimeout(3000);

// Track element positions at scroll intervals
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

// Scroll and capture positions
const scrollPoints = [0, 100, 300, 500, 700, 1000, 1500, 2000, 2500, 3000, 4000];
const positions = [];

for (const y of scrollPoints) {
  await desktopPage.evaluate((y) => window.scrollTo({ top: y, behavior: 'auto' }), y);
  await desktopPage.waitForTimeout(150);
  
  const pos = await desktopPage.evaluate((elems) => {
    return elems.map(({ name, selector }) => {
      const el = document.querySelector(selector);
      if (!el) return { name, found: false };
      return {
        name, found: true,
        offsetTop: el.offsetTop, offsetHeight: el.offsetHeight,
        rectTop: Math.round(el.getBoundingClientRect().top),
      };
    });
  }, elements);
  positions.push({ scrollY: y, elements: pos });
}

// Check for jumps (height or top changes during scroll)
console.log("\nElement position tracking:");
let jumpFound = false;

// Print all positions
for (const pos of positions) {
  console.log(`\nscrollY=${pos.scrollY}`);
  for (const el of pos.elements) {
    if (el.found) {
      console.log(`  ${el.name}: top=${el.offsetTop} height=${el.offsetHeight} rectTop=${el.rectTop}`);
    }
  }
}

// Check for height/top changes
console.log("\n=== JUMP ANALYSIS ===\n");
const baseline = positions[0].elements;
for (let i = 1; i < positions.length; i++) {
  const prev = positions[i-1].elements;
  const curr = positions[i].elements;
  for (let j = 0; j < curr.length; j++) {
    if (curr[j].found && prev[j] && prev[j].found) {
      const hDelta = curr[j].offsetHeight - prev[j].offsetHeight;
      const tDelta = curr[j].offsetTop - prev[j].offsetTop;
      // offsetTop should NOT change during scroll for non-sticky/fixed elements
      // offsetHeight should NEVER change
      if (Math.abs(hDelta) > 1) {
        console.log(`HEIGHT JUMP: ${curr[j].name} ${prev[j].offsetHeight}→${curr[j].offsetHeight} at scrollY=${positions[i].scrollY}`);
        jumpFound = true;
      }
      if (Math.abs(tDelta) > 1 && curr[j].name !== 'header' && curr[j].name !== 'hero') {
        // Non-fixed elements shouldn't have offsetTop change during scroll
        // But for fixed elements (header), offsetTop is always relative to viewport
        console.log(`TOP JUMP: ${curr[j].name} ${prev[j].offsetTop}→${curr[j].offsetTop} at scrollY=${positions[i].scrollY}`);
        jumpFound = true;
      }
    }
  }
}

// Check layout shifts
const shifts = await desktopPage.evaluate(() => window.__layoutShifts || []);
console.log(`\nLayout shifts: ${shifts.length}`);
if (shifts.length > 0) {
  for (const s of shifts) {
    console.log(`  CLS=${s.value.toFixed(4)}:`);
    for (const src of s.sources) {
      console.log(`    ${src.node}.${src.cls}: y ${src.prevY}→${src.currY}, h ${src.prevH}→${src.currH}`);
    }
  }
  jumpFound = true;
}

// Check header behavior at scroll boundary (24px)
console.log("\n=== Header scroll state change ===\n");
for (const y of [0, 20, 25, 30, 50]) {
  await desktopPage.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
  await desktopPage.waitForTimeout(50);
  const headerInfo = await desktopPage.evaluate(() => {
    const h = document.querySelector('header');
    if (!h) return null;
    const inner = h.querySelector('div');
    const cs = getComputedStyle(inner);
    return {
      height: cs.height,
      bg: cs.backgroundColor,
      backdropFilter: cs.backdropFilter,
      boxShadow: cs.boxShadow,
    };
  });
  console.log(`scrollY=${y}: ${JSON.stringify(headerInfo)}`);
}

// Now test MOBILE
console.log("\n=== LIVE SITE TEST: Mobile 390x844 ===\n");
const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mobilePage = await mobileContext.newPage();

await mobilePage.addInitScript(() => {
  window.__layoutShifts = [];
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput && entry.value > 0.001) {
        window.__layoutShifts.push({ value: entry.value, sources: entry.sources.map(s => ({
          node: s.node?.nodeName, cls: s.node?.className?.slice(0,30) || '',
          prevY: Math.round(s.previousRect.y), currY: Math.round(s.currentRect.y),
          prevH: Math.round(s.previousRect.height), currH: Math.round(s.currentRect.height),
        })) });
      }
    }
  });
  po.observe({ entryTypes: ["layout-shift"] });
});

try {
  await mobilePage.goto("https://gibs.com.ng", { waitUntil: "networkidle", timeout: 30000 });
  await mobilePage.waitForTimeout(3000);
} catch (e) {
  console.error("Mobile navigation failed:", e.message);
  await context.close();
  await browser.close();
  process.exit(1);
}

const mobileScrollPoints = [0, 100, 200, 400, 600, 800, 1000, 1200];
const mobilePositions = [];

for (const y of mobileScrollPoints) {
  await mobilePage.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
  await mobilePage.waitForTimeout(150);
  
  const pos = await mobilePage.evaluate((elems) => {
    return elems.map(({ name, selector }) => {
      const el = document.querySelector(selector);
      if (!el) return { name, found: false };
      return { name, found: true, offsetTop: el.offsetTop, offsetHeight: el.offsetHeight, rectTop: Math.round(el.getBoundingClientRect().top) };
    });
  }, elements);
  mobilePositions.push({ scrollY: y, elements: pos });
}

console.log("Mobile element positions:");
for (const pos of mobilePositions) {
  console.log(`\nscrollY=${pos.scrollY}`);
  for (const el of pos.elements) {
    if (el.found) {
      console.log(`  ${el.name}: top=${el.offsetTop} height=${el.offsetHeight} rectTop=${el.rectTop}`);
    }
  }
}

// Check for jumps on mobile
for (let i = 1; i < mobilePositions.length; i++) {
  const prev = mobilePositions[i-1].elements;
  const curr = mobilePositions[i].elements;
  for (let j = 0; j < curr.length; j++) {
    if (curr[j].found && prev[j] && prev[j].found) {
      const hDelta = curr[j].offsetHeight - prev[j].offsetHeight;
      if (Math.abs(hDelta) > 1) {
        console.log(`MOBILE HEIGHT JUMP: ${curr[j].name} ${prev[j].offsetHeight}→${curr[j].offsetHeight} at scrollY=${mobilePositions[i].scrollY}`);
      }
    }
  }
}

const mobileShifts = await mobilePage.evaluate(() => window.__layoutShifts || []);
console.log(`\nMobile layout shifts: ${mobileShifts.length}`);
if (mobileShifts.length > 0) {
  for (const s of mobileShifts) {
    console.log(`  CLS=${s.value.toFixed(4)}`);
    for (const src of s.sources) {
      console.log(`    ${src.node}.${src.cls}: y ${src.prevY}→${src.currY}, h ${src.prevH}→${src.currH}`);
    }
  }
}

await desktopContext.close();
await mobileContext.close();
await browser.close();
console.log(jumpFound ? "\nJUMPS DETECTED" : "\nNo jumps detected");
