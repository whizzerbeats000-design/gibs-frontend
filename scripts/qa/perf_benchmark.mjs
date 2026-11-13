import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { join, extname, normalize } from "node:path";

const ROOT = join(process.cwd(), "dist");
const SHOTS_DIR = join(process.cwd(), "shots");
if (!existsSync(SHOTS_DIR)) mkdirSync(SHOTS_DIR, { recursive: true });

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".woff2": "font/woff2", ".json": "application/json",
};

const server = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p === "/" || !extname(p)) {
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

const configuredPath = process.env.CHROMIUM_PATH;
const executablePath = configuredPath && existsSync(configuredPath)
  ? configuredPath
  : (chromium.executablePath() || "");

const browser = await chromium.launch({
  executablePath: executablePath || undefined,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
});

const label = process.argv[2] || "baseline";

async function measureDevice(name, width, height, isMobile) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
    isMobile,
  });
  const page = await context.newPage();

  // Inject performance observer before navigation
  await page.addInitScript(() => {
    window.__perf = { lcp: 0, cls: 0, fcp: 0, frames: [] };
    
    // LCP
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const last = entries[entries.length - 1];
      if (last) window.__perf.lcp = last.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });

    // CLS
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__perf.cls += entry.value;
        }
      }
    }).observe({ type: "layout-shift", buffered: true });

    // FCP
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          window.__perf.fcp = entry.startTime;
        }
      }
    }).observe({ type: "paint", buffered: true });
  });

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);

  // Take top hero screenshot
  await page.screenshot({ path: join(SHOTS_DIR, `${label}-${name}-hero.png`) });

  // Measure scroll frame stability
  const scrollMetrics = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const frameDeltas = [];
      let lastTime = performance.now();
      let scrollY = 0;
      const maxScroll = Math.min(document.body.scrollHeight - window.innerHeight, 800);

      function step(now) {
        frameDeltas.push(now - lastTime);
        lastTime = now;
        scrollY += 25;
        window.scrollTo(0, scrollY);
        if (scrollY < maxScroll) {
          requestAnimationFrame(step);
        } else {
          resolve(frameDeltas);
        }
      }
      requestAnimationFrame(step);
    });
  });

  await page.waitForTimeout(400);

  // Take scrolled screenshot (showing floating nav over content)
  await page.screenshot({ path: join(SHOTS_DIR, `${label}-${name}-scrolled.png`) });

  const metrics = await page.evaluate(() => {
    const memory = performance.memory
      ? {
          usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / (1024 * 1024) * 100) / 100,
          totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / (1024 * 1024) * 100) / 100,
        }
      : null;
    return {
      fcp: Math.round(window.__perf.fcp),
      lcp: Math.round(window.__perf.lcp),
      cls: Math.round(window.__perf.cls * 1000) / 1000,
      memory,
    };
  });

  // Calculate scroll smoothness
  const totalFrames = scrollMetrics.length;
  const slowFrames = scrollMetrics.filter((d) => d > 20).length; // >20ms (~<50fps)
  const avgFrameTime = Math.round(scrollMetrics.reduce((a, b) => a + b, 0) / (totalFrames || 1) * 10) / 10;
  const fps = Math.round(1000 / (avgFrameTime || 16.7));

  await context.close();

  return {
    name,
    fcp: `${metrics.fcp} ms`,
    lcp: `${metrics.lcp} ms`,
    cls: metrics.cls,
    scrollFps: `~${fps} fps`,
    slowFrameRatio: `${Math.round((slowFrames / (totalFrames || 1)) * 100)}% (${slowFrames}/${totalFrames})`,
    avgFrameDelta: `${avgFrameTime} ms`,
    usedMemoryMB: metrics.memory ? `${metrics.memory.usedJSHeapSize} MB` : "N/A",
  };
}

console.log(`\n=== RUNNING BENCHMARK (${label.toUpperCase()}) ===\n`);
const desktop = await measureDevice("desktop", 1440, 900, false);
const mobile = await measureDevice("mobile", 390, 844, true);

console.log("Desktop Results:", desktop);
console.log("Mobile Results:", mobile);

await browser.close();
server.close();
