import fs from 'node:fs';
import path from 'node:path';

const distDir = process.env.GIBS_DIST_DIR || 'dist';

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "is"));
  return match ? decodeEntities(match[2]) : null;
}

function getMetaValue(html, key, kind = "name") {
  const matches = [...html.matchAll(/<meta\b[^>]*>/gi)].filter((match) => attribute(match[0], kind) === key);
  if (matches.length === 0) return null;
  return attribute(matches[0][0], "content");
}

function getTitleValue(html) {
  return decodeEntities(html.match(/<title>(.*?)<\/title>/is)?.[1] ?? "");
}

function getShells(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getShells(fullPath));
    } else if (entry.isFile() && entry.name === 'index.html') {
      results.push({ path: fullPath, route: fullPath.replace(distDir, '').replace(/\\/g, '/').replace(/\/index\.html$/, '') || '/' });
    }
  }
  return results;
}

const shells = getShells(distDir);
const violations = [];

console.log(`Auditing ${shells.length} shells...`);

for (const shell of shells) {
  const html = fs.readFileSync(shell.path, 'utf8');
  const title = getTitleValue(html);
  const ogTitle = getMetaValue(html, 'og:title', 'property');
  const twTitle = getMetaValue(html, 'twitter:title');
  const desc = getMetaValue(html, 'description');

  const titleLen = title.length;
  const ogTitleLen = ogTitle ? ogTitle.length : 0;
  const twTitleLen = twTitle ? twTitle.length : 0;
  const descLen = desc ? desc.length : 0;

  if (titleLen > 60 || ogTitleLen > 60 || twTitleLen > 60 || descLen > 160) {
    violations.push({
      route: shell.route,
      title, titleLen,
      ogTitle, ogTitleLen,
      twTitle, twTitleLen,
      desc, descLen
    });
  }
}

if (violations.length > 0) {
  console.log(`\nFound ${violations.length} metadata violations:`);
  violations.slice(0, 10).forEach(v => {
    console.log(`Route: ${v.route}`);
    console.log(`  <title>: ${v.titleLen} chars - "${v.title}"`);
    console.log(`  og:title: ${v.ogTitleLen} chars - "${v.ogTitle}"`);
    console.log(`  tw:title: ${v.twTitleLen} chars - "${v.twTitle}"`);
    console.log(`  desc: ${v.descLen} chars - "${v.desc}"`);
    console.log('---');
  });
  if (violations.length > 10) console.log(`... and ${violations.length - 10} more.`);
} else {
  console.log('\nZero metadata violations found. All rendered values are within limits.');
}

process.exit(violations.length > 0 ? 1 : 0);
