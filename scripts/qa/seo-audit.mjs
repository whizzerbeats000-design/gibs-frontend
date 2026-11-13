import fs from 'fs';
import path from 'path';

const DIST_DIR = 'dist';

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
  walk(DIST_DIR);

  let titlesOver60 = 0;
  let descriptionsOver160 = 0;
  let emptyDescriptions = 0;
  let duplicateTitles = new Map();
  let duplicateDescriptions = new Map();
  let missingMeta = 0;
  let duplicateMeta = 0;
  let maxTitleLen = 0;
  let totalRoutes = files.length;

  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    
    // Title
    const titleMatch = html.match(/<title>(.*?)<\/title>/is);
    if (titleMatch) {
      const title = decodeEntities(titleMatch[1]);
      if (title.length > 60) titlesOver60++;
      if (title.length > maxTitleLen) maxTitleLen = title.length;
      duplicateTitles.set(title, (duplicateTitles.get(title) || 0) + 1);
    } else {
      missingMeta++;
    }

    // Description
    const descMatches = [...html.matchAll(/<meta\b[^>]*name=["']description["'][^>]*>/gi)];
    if (descMatches.length === 0) {
      missingMeta++;
    } else if (descMatches.length > 1) {
      duplicateMeta++;
    } else {
      const desc = getAttr(descMatches[0][0], 'content');
      if (!desc) emptyDescriptions++;
      else {
        if (desc.length > 160) descriptionsOver160++;
        duplicateDescriptions.set(desc, (duplicateDescriptions.get(desc) || 0) + 1);
      }
    }

    // Canonical
    const canMatches = [...html.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi)];
    if (canMatches.length !== 1) missingMeta++;
    if (canMatches.length > 1) duplicateMeta++;
  }

  console.log(`Total routes audited: ${totalRoutes}`);
  console.log(`Titles over 60 chars: ${titlesOver60}`);
  console.log(`Longest title: ${maxTitleLen} chars`);
  console.log(`Descriptions over 160 chars: ${descriptionsOver160}`);
  console.log(`Empty descriptions: ${emptyDescriptions}`);
  console.log(`Missing/Duplicate meta tags: ${missingMeta + duplicateMeta}`);
  
  const dupT = [...duplicateTitles.entries()].filter(([_, count]) => count > 1).length;
  console.log(`Duplicate titles: ${dupT}`);
}

audit();
