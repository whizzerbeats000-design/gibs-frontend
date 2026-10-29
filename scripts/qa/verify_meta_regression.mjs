import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve(process.env.GIBS_DIST_DIR || 'dist');

function decodeEntities(value) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
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
let violations = 0;

for (const shell of shells) {
  const html = fs.readFileSync(shell.path, 'utf8');
  const match = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  if (match) {
    const desc = decodeEntities(match[1]);
    if (desc.length > 160) {
      console.log(`Violation at ${shell.route}: ${desc.length} chars`);
      violations++;
    }
  }
}

console.log(`Total shells: ${shells.length}`);
console.log(`Description violations: ${violations}`);
process.exit(violations === 0 ? 0 : 1);
