import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createServer } from "node:http";
import { homedir } from "node:os";
import { chromium } from "playwright-core";

const ROOT = join(process.cwd(), "dist");
const EXT = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".woff2": "font/woff2", ".json": "application/json", ".ico": "image/x-icon",
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
const browser = await chromium.launch({ executablePath, args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"] });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await context.newPage();

await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);

// Capture initial element positions
const initialElements = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('header, section, footer'))
    .filter(el => el.id || el.className)
    .map((el, i) => {
      const rect = el.getBoundingClientRect();
      return {
        i, tag: el.tagName, id: el.id || "", 
        cls: el.className.slice(0, 50),
        offsetTop: el.offsetTop,
        offsetHeight: el.offsetHeight,
        rectTop: Math.round(rect.top),
        rectHeight: Math.round(rect.height),
        position: getComputedStyle(el).position,
      };
    });
});

console.log("Initial element layout:");
for (const el of initialElements) {
  console.log(`  ${el.tag}#${el.id} .${el.cls} top=${el.offsetTop} height=${el.offsetHeight} pos=${el.position}`);
}

// Check layout shifts via PerformanceObserver
await page.addInitScript(() => {
  window.__layoutShifts = [];
  const po = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput && entry.value > 0.001) {
        window.__layoutShifts.push({
          value: entry.value,
          sources: entry.sources.map(s => ({
            node: s.node?.nodeName || '?',
            cls: s.node?.className || '',
            prevY: Math.round(s.previousRect.y),
            currY: Math.round(s.currentRect.y),
            prevH: Math.round(s.previousRect.height),
            currH: Math.round(s.currentRect.height),
          })),
        });
      }
    }
  });
  po.observe({ entryTypes: ["layout-shift"] });
});

// Reload to capture layout shifts from fresh
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// Scroll down in steps and check for jumps
const pageHeight = await page.evaluate(() => document.body.scrollHeight);
const viewportHeight = await page.evaluate(() => window.innerHeight);
const scrollRange = pageHeight - viewportHeight;
console.log(`\nPage height: ${pageHeight}px, viewport: ${viewportHeight}px, scroll range: ${scrollRange}px`);

// Track element positions at each scroll position
const scrollSteps = 15;
for (let i = 0; i <= scrollSteps; i++) {
  const targetY = Math.round((scrollRange * i) / scrollSteps);
  await page.evaluate((y) => window.scrollTo(0, y), targetY);
  await page.waitForTimeout(200);
}

// Check for layout shifts that occurred (excluding scroll-triggered ones)
const shifts = await page.evaluate(() => window.__layoutShifts || []);
console.log(`\nLayout shifts captured: ${shifts.length}`);

if (shifts.length > 0) {
  console.log("\n=== LAYOUT SHIFTS (CLS) ===\n");
  let totalCLS = 0;
  for (const s of shifts) {
    totalCLS += s.value;
    console.log(`Value: ${s.value.toFixed(4)}`);
    for (const src of s.sources) {
      const deltaY = src.currY - src.prevY;
      const deltaH = src.currH - src.prevH;
      console.log(`  ${src.node} .${src.cls.slice(0,30)}: y ${src.prevY}→${src.currY} (Δ${deltaY}), h ${src.prevH}→${src.currH} (Δ${deltaH})`);
    }
  }
  console.log(`\nTotal CLS: ${totalCLS.toFixed(4)}`);
}

// Now check height stability of key elements during scroll
console.log("\n=== ELEMENT SIZE STABILITY DURING SCROLL ===\n");
const stableElements = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('header, section, footer'))
    .filter(el => el.id || el.className)
    .map((el, i) => {
      const rect = el.getBoundingClientRect();
      const computed = getComputedStyle(el);
      return { i, tag: el.tagName, id: el.id || "", cls: el.className.slice(0,40), 
        rectH: Math.round(rect.height), rectTop: Math.round(rect.top),
        pos: computed.position, zIndex: computed.zIndex,
        transform: computed.transform,
      };
    });
});

// Check for position: sticky or fixed elements on the page
const stickyOrFixed = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('*'))
    .filter(el => {
      const pos = getComputedStyle(el).position;
      return pos === 'sticky' || pos === 'fixed';
    })
    .map(el => ({
      tag: el.tagName, id: el.id || '', cls: el.className.slice(0,50),
      pos: getComputedStyle(el).position,
      rect: el.getBoundingClientRect(),
    }))
    .slice(0, 15);
});
console.log("Position: sticky/fixed elements:");
for (const el of stickyOrFixed) {
  console.log(`  ${el.tag}#${el.id} .${el.cls} ${el.pos} top=${el.rect.top} h=${el.rect.height}`);
}

// Check for viewport-relative units in section heights
const viewportUnitElements = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('header, section, footer, div'))
    .filter(el => {
      const css = getComputedStyle(el);
      const h = css.height;
      return h.includes('vh') || h.includes('svh') || h.includes('dvh') || h.includes('lvh');
    })
    .map(el => ({
      tag: el.tagName, id: el.id || '', cls: el.className.slice(0,50),
      height: getComputedStyle(el).height,
      rectH: Math.round(el.getBoundingClientRect().height),
    }))
    .slice(0, 15);
});
console.log("\nViewport-unit height elements:");
for (const el of viewportUnitElements) {
  console.log(`  ${el.tag}#${el.id} .${el.cls} cssH="${el.height}" actualH=${el.rectH}`);
}

// Check for backdrop-filter on header (can cause repaint issues)
const headerStyles = await page.evaluate(() => {
  const header = document.querySelector('header');
  if (!header) return null;
  const cs = getComputedStyle(header);
  return {
    position: cs.position,
    height: cs.height,
    background: cs.background,
    backdropFilter: cs.backdropFilter,
    boxShadow: cs.boxShadow,
    transform: cs.transform,
  };
});
console.log("\nHeader computed styles:");
console.log(`  ${JSON.stringify(headerStyles, null, 2)}`);

// Track specific element positions at multiple scroll points
console.log("\n=== SCROLL POSITION TRACKING ===\n");
const targets = [0, 100, 300, 500, 800, 1000, 1500, 2000, Math.max(scrollRange, 0)];
const elementTracker = "#home-hero, #perspective, #programmes, section:nth-of-type(4), section:nth-of-type(5), footer";

for (const y of targets) {
  if (y > scrollRange) break;
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
  await page.waitForTimeout(100);
  
  const positions = await page.evaluate(() => {
    const tracked = [
      ['hero', document.querySelector('#home-hero') || document.querySelector('section')],
      ['perspective', document.querySelector('#perspective')],
      ['programmes', document.querySelector('#programmes')],
      ['institution', document.querySelector('#institution') || document.querySelectorAll('section')[3]],
      ['concierge', document.querySelectorAll('section')[4]],
      ['journey', document.querySelectorAll('section')[5]],
      ['footer', document.querySelector('footer')],
    ];
    
    // Also check header
    const header = document.querySelector('header');
    const headerStyles = header ? {
      height: getComputedStyle(header).height,
      bg: getComputedStyle(header).backgroundColor,
      pos: getComputedStyle(header).position,
    } : null;
    
    return tracked.map(([name, el]) => {
      if (!el) return { name, found: false };
      const r = el.getBoundingClientRect();
      return { 
        name, found: true, 
        offsetTop: el.offsetTop, 
        offsetHeight: el.offsetHeight,
        rectTop: Math.round(r.top),
        rectHeight: Math.round(r.height),
        displayed: r.width > 0,
      };
    }).concat([{ name: 'header', offsetTop: header ? header.offsetTop : -1, offsetHeight: header ? header.offsetHeight : -1, ...headerStyles }]);
  });
  
  const scrollY = await page.evaluate(() => window.scrollY);
  console.log(`scrollY=${scrollY}px`);
  for (const p of positions) {
    if (p.found || p.name === 'header') {
      console.log(`  ${p.name}: offsetTop=${p.offsetTop} offsetHeight=${p.offsetHeight} rectTop=${p.rectTop || 'N/A'}`);
    }
  }
}

await browser.close();
server.close();
