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

  // Verify font URLs and font assets across all shells
  console.log('Verifying root-relative font URL resolution in all shells...');
  for (const shellPath of shells) {
    const html = fs.readFileSync(shellPath, 'utf8');
    if (html.includes('url(./fonts/') || html.includes('href="./fonts/')) {
      console.error(`CRITICAL: Shell contains relative font path (breaks deep routes): ${shellPath}`);
      failures++;
    }
    if (!html.includes('href="/fonts/instrument-serif-400-latin.woff2"') || !html.includes('url(/fonts/instrument-serif-400-latin.woff2)')) {
      console.error(`CRITICAL: Shell missing expected root-relative font path: ${shellPath}`);
      failures++;
    }
  }

  // Verify all 7 font files exist in dist/fonts/
  const expectedFonts = [
    'instrument-serif-400-latin.woff2',
    'instrument-serif-italic-latin.woff2',
    'space-grotesk-var-latin.woff2',
    'fraunces-var-latin.woff2',
    'fraunces-italic-var-latin.woff2',
    'libre-baskerville-var-latin.woff2',
    'libre-baskerville-italic-latin.woff2',
  ];
  for (const font of expectedFonts) {
    const fontPath = path.join(DIST_DIR, 'fonts', font);
    if (!fs.existsSync(fontPath)) {
      console.error(`CRITICAL: Expected font file missing from ${DIST_DIR}/fonts/: ${font}`);
      failures++;
    }
  }

  // Verify homepage hero image preload in master shell and ensure no leakage to subroutes
  const masterContent = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');
  if (!masterContent.includes('rel="preload" as="image" href="/images/gibs-hero-branded.webp"')) {
    console.error('CRITICAL: Master shell (homepage) missing responsive hero image preload.');
    failures++;
  }
  for (const shellPath of shells) {
    if (shellPath.endsWith('/index.html') && shellPath !== path.join(DIST_DIR, 'index.html')) {
      const subHtml = fs.readFileSync(shellPath, 'utf8');
      if (subHtml.includes('rel="preload" as="image" href="/images/gibs-hero-branded.webp"')) {
        console.error(`CRITICAL: Subroute shell incorrectly contains homepage hero preload: ${shellPath}`);
        failures++;
      }
    }
  }
  const hero640 = path.join(DIST_DIR, 'images', 'gibs-hero-branded-640.webp');
  const hero1050 = path.join(DIST_DIR, 'images', 'gibs-hero-branded.webp');
  if (!fs.existsSync(hero640) || !fs.existsSync(hero1050)) {
    console.error('CRITICAL: Hero image assets missing from dist/images/');
    failures++;
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
