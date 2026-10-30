import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const config = JSON.parse(readFileSync(new URL("../../vercel.json", import.meta.url), "utf8"));
const cacheRules = config.routes.filter((route) => route.src && route.headers?.["Cache-Control"]);

function cacheControl(path) {
  for (const route of cacheRules) {
    if (new RegExp(`^${route.src}$`).test(path)) return route.headers["Cache-Control"];
  }
  return null;
}

const stablePaths = [
  "/robots.txt",
  "/sitemap.xml",
  "/images/gibs-logo.webp",
  "/fonts/instrument-serif-400-latin.woff2",
];
for (const path of stablePaths) {
  const value = cacheControl(path);
  assert.equal(value, "public, max-age=0, must-revalidate", `${path} must revalidate`);
}

const versionedPath = "/assets/app-a1B2c3D4.js";
assert.equal(
  cacheControl(versionedPath),
  "public, max-age=31536000, immutable",
  `${versionedPath} should use immutable caching`
);

console.log(`PASS stable paths revalidate (${stablePaths.length}); content-versioned assets are immutable`);
