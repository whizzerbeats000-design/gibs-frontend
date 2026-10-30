import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve(process.env.GIBS_DIST_DIR || 'dist');

function decodeEntities(value) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "is"));
  return match ? decodeEntities(match[2]) : null;
}

function metaValue(html, key, kind = "name") {
  const matches = [...html.matchAll(/<meta\b[^>]*>/gi)].filter((match) => attribute(match[0], kind) === key);
  return matches.length > 0 ? attribute(matches[0][0], "content") : null;
}

function titleValue(html) {
  return decodeEntities(html.match(/<title>(.*?)<\/title>/is)?.[1] ?? "");
}

function getShells(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getShells(fullPath));
    } else if (entry.isFile() && entry.name === 'index.html') {
      results.push({ path: fullPath, route: fullPath.replace(DIST_DIR, '').replace(/\\/g, '/').replace(/\/index\.html$/, '') || '/' });
    }
  }
  return results;
}

const shells = getShells(DIST_DIR);
const results = {
  total: shells.length,
  titles: { over60: 0, max: 0, duplicates: new Map() },
  descriptions: { over160: 0, empty: 0, duplicates: new Map() },
  integrity: { missingTitle: 0, missingDesc: 0, badCanonical: 0 }
};

for (const shell of shells) {
  const html = fs.readFileSync(shell.path, 'utf8');
  const title = titleValue(html);
  const desc = metaValue(html, 'description');
  
  if (!title) results.integrity.missingTitle++;
  else {
    if (title.length > 60) results.titles.over60++;
    if (title.length > results.titles.max) results.titles.max = title.length;
    results.titles.duplicates.set(title, (results.titles.duplicates.get(title) || 0) + 1);
  }

  if (!desc) results.descriptions.empty++;
  else {
    if (desc.length > 160) results.descriptions.over160++;
    results.descriptions.duplicates.set(desc, (results.descriptions.duplicates.get(desc) || 0) + 1);
  }
}

// Convert Map to object for JSON stringify
results.titles.duplicates = Object.fromEntries(results.titles.duplicates);
results.descriptions.duplicates = Object.fromEntries(results.descriptions.duplicates);

console.log(JSON.stringify(results, null, 2));
