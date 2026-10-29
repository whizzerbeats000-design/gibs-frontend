import fs from 'fs';
import path from 'path';

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function getAttr(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'is'));
  return match ? decodeEntities(match[2]) : null;
}

function audit() {
  const files = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name === 'index.html') files.push(p);
    }
  }
  walk('dist');

  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    const descMatches = [...html.matchAll(/<meta\b[^>]*name=["']description["'][^>]*>/gi)];
    if (descMatches.length > 0) {
      const desc = getAttr(descMatches[0][0], 'content');
      if (desc && desc.length > 160) {
        console.log(`${file}: ${desc.length} chars - ${desc}`);
      }
    }
  }
}
audit();
