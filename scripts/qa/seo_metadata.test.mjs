import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { after, before, test } from "node:test";

let syncRouteMetadata;
let temporaryDirectory;

function createDocument() {
  const elements = [];
  return {
    title: "",
    elements,
    head: {
      appendChild(element) {
        elements.push(element);
      },
    },
    createElement(tagName) {
      const attributes = new Map();
      return {
        tagName,
        setAttribute(name, value) {
          attributes.set(name, String(value));
        },
        getAttribute(name) {
          return attributes.get(name) ?? null;
        },
        set content(value) {
          attributes.set("content", String(value));
        },
        get content() {
          return attributes.get("content") ?? "";
        },
        set href(value) {
          attributes.set("href", String(value));
        },
        set rel(value) {
          attributes.set("rel", String(value));
        },
        get rel() {
          return attributes.get("rel") ?? "";
        },
        get href() {
          return attributes.get("href") ?? "";
        },
      };
    },
    querySelector(selector) {
      const meta = selector.match(/^meta\[(name|property)="([^"]+)"\]$/);
      if (meta) {
        return elements.find((element) => element.tagName === "meta" && element.getAttribute(meta[1]) === meta[2]) ?? null;
      }
      if (selector === 'link[rel="canonical"]') {
        return elements.find((element) => element.tagName === "link" && element.getAttribute("rel") === "canonical") ?? null;
      }
      return null;
    },
  };
}

before(async () => {
  temporaryDirectory = mkdtempSync(join(tmpdir(), "gibs-seo-metadata-test-"));
  writeFileSync(
    join(temporaryDirectory, "seoMetadata.ts"),
    readFileSync(new URL("../../src/lib/seoMetadata.ts", import.meta.url), "utf8")
  );
  ({ syncRouteMetadata } = await import(pathToFileURL(join(temporaryDirectory, "seoMetadata.ts"))));
});

after(() => {
  if (temporaryDirectory) rmSync(temporaryDirectory, { recursive: true, force: true });
});

test("route changes update canonical, Open Graph, Twitter, and document title", () => {
  const document = createDocument();

  syncRouteMetadata(document, "/contact", "Contact GIBS", "Contact the training desk.");
  syncRouteMetadata(document, "/programmes", "Programmes | GIBS", "Browse GIBS programmes.");

  assert.equal(document.title, "Programmes | GIBS");
  assert.equal(document.querySelector('link[rel="canonical"]')?.getAttribute("href"), "https://gibs.com.ng/programmes");
  assert.equal(document.querySelector('meta[property="og:url"]')?.content, "https://gibs.com.ng/programmes");
  assert.equal(document.querySelector('meta[property="og:title"]')?.content, "Programmes | GIBS");
  assert.equal(document.querySelector('meta[property="og:description"]')?.content, "Browse GIBS programmes.");
  assert.equal(document.querySelector('meta[name="twitter:title"]')?.content, "Programmes | GIBS");
  assert.equal(document.querySelector('meta[name="twitter:description"]')?.content, "Browse GIBS programmes.");
  assert.equal(document.elements.filter((element) => element.tagName === "link").length, 1);
});

test("homepage route metadata retains the canonical root slash", () => {
  const document = createDocument();

  syncRouteMetadata(document, "/", "GIBS", "GIBS homepage.");

  assert.equal(document.querySelector('link[rel="canonical"]')?.getAttribute("href"), "https://gibs.com.ng/");
  assert.equal(document.querySelector('meta[property="og:url"]')?.content, "https://gibs.com.ng/");
});
