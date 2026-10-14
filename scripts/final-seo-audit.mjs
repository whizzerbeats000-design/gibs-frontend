import fs from 'fs';
import path from 'path';
import { VALID_CATEGORIES, categoryToSlug } from '../src/lib/categoryUtils.ts';

const DIST_DIR = 'dist';
const MASTER_SHELL = 'dist/index.html';
const CANONICAL_DOMAIN = 'https://gibs.com.ng';

function extractMetaValue(html, name) {
  const tagRegex = new RegExp(`<meta\\s+[^>]*?(?:name|property)=["']${name}["'][^>]*>`, 'is');
  const tagMatch = html.match(tagRegex);
  if (!tagMatch) return null;
  const tag = tagMatch[0];
  const contentRegex = /content=["']([^"']*)["']/;
  const contentMatch = tag.match(contentRegex);
  return contentMatch ? contentMatch[1] : null;
}

async function validate() {
  if (!fs.existsSync(MASTER_SHELL)) {
    console.error('Master shell not found. Run npm run build first.');
    process.exit(1);
  }
  const masterHtml = fs.readFileSync(MASTER_SHELL, 'utf8');
  const homeDesc = extractMetaValue(masterHtml, 'description');

  // Verify master shell canonical is apex
  const masterCanon = masterHtml.match(/<link rel="canonical" href="([^"]*)"\s*\/?>/)?.[1];
  if (masterCanon !== `${CANONICAL_DOMAIN}/`) {
    console.error(`Master shell canonical is not apex! Found: "${masterCanon}"`);
    process.exit(1);
  }

  // Verify no www.gibs.com.ng in master shell canonical/og
  if (masterHtml.includes('https://www.gibs.com.ng')) {
    console.error('CRITICAL: Master shell contains forbidden https://www.gibs.com.ng reference!');
    process.exit(1);
  }

  const shells = [];
  const walk = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) walk(fullPath);
      else if (file === 'index.html') shells.push(fullPath);
    }
  };
  walk(DIST_DIR);

  let failures = 0;
  const results = [];

  for (const shellPath of shells) {
    if (shellPath === MASTER_SHELL) continue;
    const html = fs.readFileSync(shellPath, 'utf8');
    
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    const desc = extractMetaValue(html, 'description');
    const canon = html.match(/<link rel="canonical" href="([^"]*)"\s*\/?>/)?.[1];
    const ogTitle = extractMetaValue(html, 'og:title');
    const ogDesc = extractMetaValue(html, 'og:description');
    
    const titleOk = title && title !== 'GIBS — Goshen International Business School';
    const descOk = desc && desc !== homeDesc;
    const canonOk = canon && canon.startsWith(CANONICAL_DOMAIN) && canon !== `${CANONICAL_DOMAIN}/` && !canon.includes('www.');
    const ogTitleOk = ogTitle && ogTitle !== 'GIBS — 2026 Executive Training Calendar & International Programmes';
    const ogDescOk = ogDesc && ogDesc !== homeDesc;

    if (!titleOk || !descOk || !canonOk || !ogTitleOk || !ogDescOk) {
      failures++;
      results.push({ path: shellPath, title: titleOk, desc: descOk, canon: canonOk, ogT: ogTitleOk, ogD: ogDescOk });
    }
  }

  // Verify all 15 category shells exist and have valid slugs
  console.log(`Checking all ${VALID_CATEGORIES.length} categories...`);
  for (const cat of VALID_CATEGORIES) {
    const slug = categoryToSlug(cat);
    if (slug.includes('&') || slug.includes(' ') || slug.includes('%')) {
      console.error(`Invalid category slug format for "${cat}": "${slug}"`);
      failures++;
    }
    const catShellPath = path.join(DIST_DIR, 'programmes', 'category', slug, 'index.html');
    if (!fs.existsSync(catShellPath)) {
      console.error(`Missing category shell: ${catShellPath}`);
      failures++;
    }
  }

  // Verify sitemap.xml
  const sitemapPath = path.join(DIST_DIR, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.error('CRITICAL: sitemap.xml is missing from dist!');
    process.exit(1);
  }
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  if (sitemapContent.includes('www.gibs.com.ng')) {
    console.error('CRITICAL: sitemap.xml contains www.gibs.com.ng!');
    failures++;
  }
  if (sitemapContent.includes('&') && !sitemapContent.includes('&amp;')) {
    // Check for unescaped raw ampersands
    const rawAmp = sitemapContent.match(/&(?!(amp|lt|gt|quot|apos);)/);
    if (rawAmp) {
      console.error(`CRITICAL: sitemap.xml contains unescaped ampersand!`);
      failures++;
    }
  }

  console.log(`Total Shells Verified: ${shells.length - 1}`);
  console.log(`Metadata Failures: ${failures}`);
  if (results.length > 0) {
    console.log('Failure Details:');
    results.forEach(r => console.log(`${r.path} | Title: ${r.title}, Desc: ${r.desc}, Canon: ${r.canon}, ogT: ${r.ogT}, ogD: ${r.ogD}`));
  }
  
  const jsonLdMatch = masterHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!jsonLdMatch) {
    console.error('CRITICAL: EducationalOrganization JSON-LD missing from master shell.');
    process.exit(1);
  }

  if (failures > 0) process.exit(1);
  console.log('ALL AUDIT CHECKS PASSED SUCCESSFULLY.');
}

validate();
