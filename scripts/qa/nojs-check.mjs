import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, normalize } from "node:path";
import { homedir } from "node:os";
import { createServer } from "node:http";
import { chromium } from "playwright-core";

const ROOT = process.env.DIST_DIR || join(process.cwd(), "dist");
const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".woff2": "font/woff2", ".json": "application/json",
};

function findChromium() {
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

// Inject a capture script just before the module script to record pre-React state
const CAPTURE_SCRIPT = `
<script>
  window.__preReactState = (function() {
    const htmlClass = document.documentElement.className;
    const staticMain = document.querySelector('#root > main:not(#main)');
    const cs = staticMain ? getComputedStyle(staticMain).display : "not-found";
    const h1Text = staticMain ? (staticMain.querySelector("h1")?.textContent || "") : "";
    const visible = cs !== "none";
    return { htmlClass, staticMainDisplay: cs, h1Text: (h1Text||"").slice(0,40), staticMainVisible: visible };
  })();
</script>
`;

const server = createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p === "/" || !p.match(/\.[^.]+$/)) p = "/index.html";
  try {
    let body = readFileSync(join(ROOT, normalize(p).replace(/^(\.\.[^/\\])+/, ""))).toString();
    // For HTML files, inject capture script at end of body (after #root, before module executes)
    if (p.endsWith(".html") && body.includes('<div id="root">')) {
      body = body.replace('</body>', CAPTURE_SCRIPT + '</body>');
    }
    res.writeHead(200, { "content-type": p.endsWith(".html") ? "text/html" : (MIME[extname(p)] || "application/octet-stream"), });
    res.end(body);
  } catch {
    res.writeHead(404); res.end();
  }
});
const { extname } = await import("node:path");
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${server.address().port}`;

const executablePath = findChromium();
if (!executablePath) {
  console.error("No Chromium found.");
  process.exit(2);
}
const browser = await chromium.launch({
  executablePath,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
});

let failures = 0;
const fail = (msg) => { failures++; console.log(`  FAIL ${msg}`); };
const pass = (msg) => console.log(`  PASS ${msg}`);

// ── 1. Verify raw HTML structure (no script execution) ──────────────
console.log("1. Raw HTML structure (no-script execution)");
console.log("-".repeat(70));

const rawHtml = readFileSync(join(ROOT, "index.html"), "utf8");

if (rawHtml.includes('<html lang="en" class="no-js">')) pass("html has class=\"no-js\"");
else fail("html missing class=\"no-js\"");

if (rawHtml.includes('<script>document.documentElement.classList.replace(\'no-js\',\'js\')</script>')) pass("inline no-js→js swap script present");
else fail("inline no-js→js swap script missing");

const cssRulePattern = /\.js[^{]*#root[^}]*main:not\(#main\)[^{]*\{[^}]*display[^{]*none/i;
if (cssRulePattern.test(rawHtml)) pass("CSS rule .js #root>main:not(#main) {display:none} present");
else fail("CSS rule not found");

if (rawHtml.includes('<div id="root"><main>')) pass("static <main> injected inside #root");
else fail("static <main> not found inside #root");

// ── 2. JS enabled: verify swap + hidden pre-React + React content visible ──
console.log("\n2. JS enabled (with pre-React capture)");
console.log("-".repeat(70));

const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const consoleErrors = [];
page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });

await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 15000 });
await new Promise((r) => setTimeout(r, 200));

// Check captured pre-React state
const preReact = await page.evaluate(() => (window).__preReactState || null);
if (preReact) {
  if (preReact.htmlClass === "js") pass("html class swapped to .js during parse (before React)");
  else fail(`html class is "${preReact.htmlClass}", expected "js"`);

  if (preReact.staticMainDisplay === "none") pass("static <main> is display:none before React mount");
  else fail(`static <main> display="${preReact.staticMainDisplay}", expected "none"`);

  if (preReact.staticMainVisible === false) pass("static <main> confirmed hidden (not visible) before React");
  else fail("static <main> is visible before React — regression!");

  if (preReact.h1Text.includes("Goshen")) pass("static <main> content present in DOM (h1 has GIBS) before React");
  else fail("static <main> h1 content not found before React");
} else {
  fail("pre-React state not captured");
}

// Now check React has mounted
await page.waitForTimeout(2500);
const afterReact = await page.evaluate(() => {
  const staticMain = document.querySelector('#root > main:not(#main)');
  const reactMain = document.querySelector('#root > main#main');
  const h1 = document.querySelector('h1');
  return {
    staticMainExists: !!staticMain,
    reactMainExists: !!reactMain,
    reactMainDisplay: reactMain ? getComputedStyle(reactMain).display : "not-found",
    h1Text: h1 ? h1.textContent.slice(0, 60) : "",
  };
});

if (afterReact.reactMainExists) pass("React <main id=main> mounted");
else fail("React <main id=main> not mounted");

if (afterReact.staticMainExists === false) pass("static <main> removed by React mount");
else fail("static <main> still present after React mount");

if (afterReact.h1Text.includes("Goshen")) pass(`React-rendered h1 visible: "${afterReact.h1Text.slice(0, 50)}"`);
else fail(`React h1 text unexpected: "${afterReact.h1Text}"`);

if (consoleErrors.length) fail(`console errors: ${[...new Set(consoleErrors)].slice(0, 2).join(" | ")}`);
else pass("no console errors");

await page.close();

// ── 3. JS disabled: static content visible ──────────────────────────
console.log("\n3. JS disabled: .no-js preserved, static content visible");
console.log("-".repeat(70));

const noJsPage = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
  javaScriptEnabled: false,
});

await noJsPage.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 15000 });
await new Promise((r) => setTimeout(r, 500));

const noJsHtmlClass = await noJsPage.$eval("html", (el) => el.className);
if (noJsHtmlClass === "no-js") pass("html retains .no-js class when JS disabled");
else fail(`html class is "${noJsHtmlClass}", expected "no-js"`);

const noJsStaticMain = await noJsPage.evaluate(() => {
  const staticMain = document.querySelector('#root > main:not(#main)');
  if (!staticMain) return "not-found";
  const cs = getComputedStyle(staticMain);
  return { display: cs.display, h1Text: staticMain.querySelector("h1")?.textContent || "" };
});

if (noJsStaticMain !== "not-found" && noJsStaticMain.display !== "none") {
  pass(`static <main> visible (display="${noJsStaticMain.display}") when JS disabled`);
} else if (noJsStaticMain === "not-found") {
  fail("static <main> not found");
} else {
  fail(`static <main> hidden (display=none) when JS disabled — should be visible`);
}

const noJsH1 = await noJsPage.$eval("main h1", (el) => el.textContent);
if (noJsH1 && noJsH1.includes("GIBS")) pass(`static h1 content visible: "${noJsH1.slice(0, 50)}"`);
else fail("static h1 content not visible");

await noJsPage.close();
await browser.close();
server.close();

console.log(failures ? `\nREGRESSION FAILURES: ${failures}` : "\nALL NO-JS CHECKS PASS");
process.exit(failures ? 1 : 0);
