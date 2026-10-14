import fs from 'fs';
import path from 'path';

const CANONICAL_DOMAIN = 'https://gibs.com.ng';
const MASTER_SHELL_PATH = 'dist/index.html';
const DIST_DIR = 'dist';

function extractProgrammes() {
  const content = fs.readFileSync('src/lib/data.ts', 'utf8');
  const startMatch = content.match(/export const PROGRAMMES: Programme\[\] = \[(.*)/s);
  if (!startMatch) throw new Error('Could not find PROGRAMMES array start');

  let depth = 1;
  let arrayBody = '';
  const remaining = startMatch[1];

  for (let i = 0; i < remaining.length; i++) {
    const char = remaining[i];
    if (char === '[') depth++;
    if (char === ']') depth--;
    if (depth === 0) break;
    arrayBody += char;
  }

  const records = [];
  let currentRecord = '';
  let recordDepth = 0;

  for (let i = 0; i < arrayBody.length; i++) {
    const char = arrayBody[i];
    if (char === '{') recordDepth++;
    if (char === '}') recordDepth--;
    currentRecord += char;
    if (recordDepth === 0 && char === '}' && arrayBody[i + 1] === ',') {
      records.push(currentRecord.trim());
      currentRecord = '';
      i++;
    }
  }
  if (currentRecord.trim()) records.push(currentRecord.trim());

  return records.map((rec, idx) => {
    const slugMatch = rec.match(/"slug":\s*"([^\"]+)"/) || rec.match(/slug:\s*"([^\"]+)"/);
    const titleMatch = rec.match(/"title":\s*"([^\"]+)"/) || rec.match(/title:\s*"([^\"]+)"/);
    const summaryMatch = rec.match(/"summary":\s*"([^\"]+)"/) || rec.match(/summary:\s*"([^\"]+)"/);
    const categoryMatch = rec.match(/"category":\s*"([^\"]+)"/) || rec.match(/category:\s*"([^\"]+)"/);

    if (!slugMatch || !titleMatch) {
      throw new Error(`Malformed programme record at index ${idx}. Missing slug or title.`);
    }

    return {
      slug: slugMatch[1],
      title: titleMatch[1],
      summary: summaryMatch ? summaryMatch[1] : 'Executive training programme at GIBS.',
      category: categoryMatch ? categoryMatch[1] : 'General',
    };
  });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function replaceMetaContent(html, name, newValue) {
  const escapedValue = escapeHtml(newValue);
  const tagRegex = new RegExp(`<meta\\s+[^>]*?(?:name|property)=["']${name}["'][^>]*>`, 'is');
  const tagMatch = html.match(tagRegex);
  if (!tagMatch) throw new Error(`Required meta tag with ${name} not found in master shell.`);
  const tag = tagMatch[0];
  const allMatches = html.matchAll(new RegExp(tagRegex.source, 'gis'));
  let count = 0;
  for (const m of allMatches) count++;
  if (count > 1) throw new Error(`Duplicate meta tags found for ${name}. Expected exactly one.`);
  const contentRegex = /content=["']([^"']*)["']/;
  if (!contentRegex.test(tag)) throw new Error(`Meta tag ${name} is missing the content attribute.`);
  const updatedTag = tag.replace(contentRegex, `content="${escapedValue}"`);
  return html.replace(tag, updatedTag);
}

function generateShell(masterHtml, route, meta) {
  let html = masterHtml;
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  html = replaceMetaContent(html, 'description', meta.description);
  html = html.replace(/<link rel="canonical" href=".*?"\s*\/?>/, 
    `<link rel="canonical" href="${CANONICAL_DOMAIN}${route}" />`);
  html = replaceMetaContent(html, 'og:title', meta.title);
  if (!html.includes('property="og:description"')) {
    html = html.replace(/(<meta property="og:title".*?\/>)/, 
      `$1\n    <meta property="og:description" content="${escapeHtml(meta.description)}" />`);
  } else {
    html = replaceMetaContent(html, 'og:description', meta.description);
  }
  html = replaceMetaContent(html, 'og:image', `${CANONICAL_DOMAIN}/images/gibs-hero-branded.webp`);
  return html;
}

async function run() {
  try {
    console.log('Starting SEO Shell Generation...');
    if (!fs.existsSync(MASTER_SHELL_PATH)) throw new Error('Master shell not found. Run npm run build first.');
    const masterHtml = fs.readFileSync(MASTER_SHELL_PATH, 'utf8');
    const programmes = extractProgrammes();
    console.log(`Extracted ${programmes.length} programmes.`);

    const routes = [];

    // 1. Programmes
    for (const p of programmes) {
      const route = `/programmes/${p.slug}`;
      routes.push({ path: route, meta: { title: `${p.title} | GIBS`, description: p.summary.substring(0, 155) }});
      const shellHtml = generateShell(masterHtml, route, { title: `${p.title} | GIBS`, description: p.summary.substring(0, 155) });
      const dir = path.join(DIST_DIR, route);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), shellHtml);
    }

    // 2. Institutional
    const instRoutes = [
      { path: '/about', title: 'About GIBS | Goshen International Business School', desc: 'Learn about our mission, vision and guiding principles.' },
      { path: '/contact', title: 'Contact GIBS | Training Desk & Enquiries', desc: 'Get in touch with GIBS for programme registration and campus visits.' },
      { path: '/executive-education', title: 'Foreign Executive Training | GIBS', desc: 'Global training hubs in Kigali, Dubai, London and Houston.' },
      { path: '/concierge', title: 'GIBS AI | Institutional Guide', desc: 'Ask our AI about programmes, locations and enrolment.' },
    ];
    for (const r of instRoutes) {
      routes.push({ path: r.path, meta: { title: r.title, description: r.desc }});
      const shellHtml = generateShell(masterHtml, r.path, { title: r.title, description: r.desc });
      const dir = path.join(DIST_DIR, r.path);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), shellHtml);
    }

    // 3. Categories
    const categories = [...new Set(programmes.map(p => p.category))];
    for (const cat of categories) {
      const slug = cat.toLowerCase().replace(/\s+/g, '-');
      const route = `/programmes/category/${slug}`;
      routes.push({ path: route, meta: { title: `${cat} Training Programmes | GIBS`, description: `Explore our executive training programmes in ${cat} at GIBS.` }});
      const shellHtml = generateShell(masterHtml, route, { title: `${cat} Training Programmes | GIBS`, description: `Explore our executive training programmes in ${cat} at GIBS.` });
      const dir = path.join(DIST_DIR, route);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), shellHtml);
    }

    // 4. Sitemap
    const sitemapEntries = routes.map(r => `  <url>\n    <loc>${CANONICAL_DOMAIN}${r.path}</loc>\n  </url>`).join('\n');
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${CANONICAL_DOMAIN}/</loc>\n  </url>\n${sitemapEntries}\n</urlset>`;
    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml);

    console.log(`SUCCESS: Generated ${routes.length} shells and sitemap.xml`);
  } catch (err) {
    console.error('SEO Generation failed:', err);
    process.exit(1);
  }
}

run();
