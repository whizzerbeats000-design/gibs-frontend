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

console.log("=== PHASE 1 PERFORMANCE INVESTIGATION ===");
console.log(`Server listening on ${BASE}`);
console.log(`Chromium executable: ${executablePath}`);

async function runScrollBenchmark({ name, width, height, deviceScaleFactor, isMobile, disableBackdropFilter, disableFramerScroll, scrollMode }) {
  const browser = await chromium.launch({
    executablePath: executablePath || undefined,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });

  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor,
    isMobile,
  });

  const page = await context.newPage();

  // If testing with backdrop-filter disabled
  if (disableBackdropFilter) {
    await page.addInitScript(() => {
      const style = document.createElement("style");
      style.innerHTML = `
        .liquid-glass-header, .liquid-glass-header--scrolled, .liquid-glass-pill {
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
      `;
      document.head.appendChild(style);
    });
  }

  // If testing with Framer Motion scroll parallax disabled
  if (disableFramerScroll) {
    await page.addInitScript(() => {
      // Force prefers-reduced-motion to true
      window.matchMedia = (query) => {
        return {
          matches: query.includes("prefers-reduced-motion"),
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        };
      };
    });
  }

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  let result;
  if (scrollMode === "mouseWheel") {
    // Measure frame times during realistic mouse wheel events
    await page.evaluate(() => {
      window.__wheelDeltas = [];
      let lastTime = performance.now();
      let running = true;
      function recordFrame(now) {
        window.__wheelDeltas.push(now - lastTime);
        lastTime = now;
        if (running) requestAnimationFrame(recordFrame);
      }
      requestAnimationFrame(recordFrame);
      window.__stopRecording = () => { running = false; };
    });

    // Simulate 20 mouse wheel ticks
    for (let i = 0; i < 20; i++) {
      await page.mouse.wheel(0, 40);
      await page.waitForTimeout(30);
    }
    await page.waitForTimeout(100);

    result = await page.evaluate(() => {
      window.__stopRecording();
      return window.__wheelDeltas;
    });
  } else {
    // Synthetic rAF window.scrollTo
    result = await page.evaluate(async () => {
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
  }

  const totalFrames = result.length;
  const avgDelta = Math.round(result.reduce((a, b) => a + b, 0) / (totalFrames || 1) * 10) / 10;
  const fps = Math.round(1000 / (avgDelta || 16.7));
  const slowFrames = result.filter((d) => d > 20).length;
  const slowPercent = Math.round((slowFrames / (totalFrames || 1)) * 100);

  await context.close();
  await browser.close();

  return {
    name,
    totalFrames,
    avgDelta: `${avgDelta} ms`,
    fps,
    slowPercent: `${slowPercent}% (${slowFrames}/${totalFrames})`,
  };
}

const tests = [
  // 1. Desktop Current (Phase 1, 1440x900 @ 2x, rAF scrollTo)
  {
    name: "1. Desktop Current (1440x900 @ 2x, synthetic scrollTo)",
    width: 1440, height: 900, deviceScaleFactor: 2, isMobile: false,
    disableBackdropFilter: false, disableFramerScroll: false, scrollMode: "rafScroll",
  },
  // 2. Desktop with 1x device scale factor (1440x900 @ 1x)
  {
    name: "2. Desktop 1x Scale (1440x900 @ 1x, synthetic scrollTo)",
    width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false,
    disableBackdropFilter: false, disableFramerScroll: false, scrollMode: "rafScroll",
  },
  // 3. Desktop with backdrop-filter disabled
  {
    name: "3. Desktop NO backdrop-filter (1440x900 @ 2x, synthetic scrollTo)",
    width: 1440, height: 900, deviceScaleFactor: 2, isMobile: false,
    disableBackdropFilter: true, disableFramerScroll: false, scrollMode: "rafScroll",
  },
  // 4. Desktop with Framer Motion useScroll disabled
  {
    name: "4. Desktop NO Framer Motion parallax (1440x900 @ 2x, synthetic scrollTo)",
    width: 1440, height: 900, deviceScaleFactor: 2, isMobile: false,
    disableBackdropFilter: false, disableFramerScroll: true, scrollMode: "rafScroll",
  },
  // 5. Desktop with Mouse Wheel (Natural Scroll)
  {
    name: "5. Desktop Natural Mouse Wheel (1440x900 @ 2x, mouse.wheel)",
    width: 1440, height: 900, deviceScaleFactor: 2, isMobile: false,
    disableBackdropFilter: false, disableFramerScroll: false, scrollMode: "mouseWheel",
  },
  // 6. Mobile Current (360x640 @ 2x, synthetic scrollTo)
  {
    name: "6. Mobile Current (360x640 @ 2x, synthetic scrollTo)",
    width: 360, height: 640, deviceScaleFactor: 2, isMobile: true,
    disableBackdropFilter: false, disableFramerScroll: false, scrollMode: "rafScroll",
  },
  // 7. Mobile NO backdrop-filter (360x640 @ 2x, synthetic scrollTo)
  {
    name: "7. Mobile NO backdrop-filter (360x640 @ 2x, synthetic scrollTo)",
    width: 360, height: 640, deviceScaleFactor: 2, isMobile: true,
    disableBackdropFilter: true, disableFramerScroll: false, scrollMode: "rafScroll",
  },
  // 8. Mobile Natural Mouse Wheel (360x640 @ 2x, mouse.wheel)
  {
    name: "8. Mobile Natural Mouse Wheel (360x640 @ 2x, mouse.wheel)",
    width: 360, height: 640, deviceScaleFactor: 2, isMobile: true,
    disableBackdropFilter: false, disableFramerScroll: false, scrollMode: "mouseWheel",
  },
];

const results = [];
for (const t of tests) {
  console.log(`Running: ${t.name}...`);
  const res = await runScrollBenchmark(t);
  results.push(res);
  console.log(`  -> avg: ${res.avgDelta}, fps: ${res.fps}, slow: ${res.slowPercent}`);
}

console.log("\n=== SUMMARY OF CONTROLLED TESTS ===");
console.table(results);

server.close();
