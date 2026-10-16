import fs from 'fs';
import path from 'path';
import { categoryToSlug } from '../src/lib/categoryUtils.ts';

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
      title: decodeJsonString(titleMatch[1]),
      summary: summaryMatch ? decodeJsonString(summaryMatch[1]) : 'Executive training programme at GIBS.',
      category: categoryMatch ? decodeJsonString(categoryMatch[1]) : 'General',
      code: extractStringProp(rec, 'code') || '',
      destination: extractStringProp(rec, 'destination') || 'Local',
      schedule: extractStringProp(rec, 'schedule') || '',
      fees: extractStringProp(rec, 'fees') || '',
      duration: extractStringProp(rec, 'duration') || '5 Days',
      targetAudience: extractStringProp(rec, 'targetAudience') || '',
      outcomes: extractStringArrayProp(rec, 'outcomes'),
      indicativeStructure: extractStringArrayProp(rec, 'indicativeStructure'),
      audience: extractStringArrayProp(rec, 'audience'),
      faqs: extractFaqProp(rec, 'faqs'),
    };
  });
}

// Resolve JSON string escape sequences (\uXXXX, \', etc.) that the regex
// extraction captures as literal characters rather than decoded Unicode values.
function decodeJsonString(raw) {
  return raw.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

// Extract a quoted string property value from a record body.
function extractStringProp(rec, key) {
  const m = rec.match(new RegExp(`"${key}"\\s*:\\s*"([^"]*)"`));
  return m ? decodeJsonString(m[1]) : null;
}

// Extract all quoted string elements from inside an array body.
function extractStringArray(content) {
  const matches = content.match(/"([^"]+)"/g) || [];
  return matches.map((m) => decodeJsonString(m.slice(1, -1)));
}

// Extract a string array property from a record body.
function extractStringArrayProp(rec, key) {
  const m = rec.match(new RegExp(`"${key}"\\s*:\\s*\\[([\\s\\S]*?)\\]`));
  return m && m[1].trim() ? extractStringArray(m[1]) : [];
}

// Extract { q, a } pairs from a FAQ array body.
function extractFaqs(content) {
  const faqs = [];
  const objRegex = /\{\s*"q"\s*:\s*"([^"]*)"\s*,\s*"a"\s*:\s*"([^"]*)"\s*\}/g;
  let match;
  while ((match = objRegex.exec(content)) !== null) {
    faqs.push({ q: decodeJsonString(match[1]), a: decodeJsonString(match[2]) });
  }
  return faqs;
}

// Extract FAQ objects from a record body.
function extractFaqProp(rec, key) {
  const m = rec.match(new RegExp(`"${key}"\\s*:\\s*\\[([\\s\\S]*?)\\]`));
  return m && m[1].trim() ? extractFaqs(m[1]) : [];
}

// Extract all quoted string elements from inside an object body (INSTITUTIONAL_DATA).
// Keys in INSTITUTIONAL_DATA are unquoted (e.g. legalName:), so the regex makes
// quotes optional around the key.
function extractInstitutionalArray(instContent, key) {
  const m = instContent.match(new RegExp(`"?${key}"?\\s*:\\s*\\[([\\s\\S]*?)\\]`));
  return m && m[1].trim() ? extractStringArray(m[1]) : [];
}

// Extract a quoted string property from INSTITUTIONAL_DATA object body.
function extractInstitutionalString(instContent, key) {
  const m = instContent.match(new RegExp(`"?${key}"?\\s*:\\s*"([^"]*)"`));
  return m ? decodeJsonString(m[1]) : null;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ----- Institutional Data Extraction -----

function extractInstitutionalData() {
  const content = fs.readFileSync('src/lib/data.ts', 'utf8');
  const instStart = content.match(/export const INSTITUTIONAL_DATA: InstitutionalMetadata = \{/);
  if (!instStart) throw new Error('Could not find INSTITUTIONAL_DATA in data.ts');

  let instContent = '';
  let depth = 1;
  const startIdx = instStart.index + instStart[0].length;
  for (let i = startIdx; i < content.length; i++) {
    if (content[i] === '{') depth++;
    if (content[i] === '}') depth--;
    if (depth === 0) break;
    instContent += content[i];
  }

  return {
    legalName: extractInstitutionalString(instContent, 'legalName') || 'Goshen International Business School Limited (GIBS)',
    slogan: extractInstitutionalString(instContent, 'slogan') || '',
    positioningStatement: extractInstitutionalString(instContent, 'positioningStatement') || '',
    mission: extractInstitutionalString(instContent, 'mission') || '',
    vision: extractInstitutionalString(instContent, 'vision') || '',
    guidingPrinciples: extractInstitutionalArray(instContent, 'guidingPrinciples'),
    coreValues: extractInstitutionalArray(instContent, 'coreValues'),
    strategicFocusAreas: extractInstitutionalArray(instContent, 'strategicFocusAreas'),
    website: extractInstitutionalString(instContent, 'website') || 'www.gibs.com.ng',
    emails: extractInstitutionalArray(instContent, 'emails'),
    phoneNumbers: extractInstitutionalArray(instContent, 'phoneNumbers'),
    postalAddress: extractInstitutionalString(instContent, 'postalAddress') || '',
    technicalPartner: extractInstitutionalString(instContent, 'technicalPartner') || '',
    overseasHubs: extractInstitutionalArray(instContent, 'overseasHubs'),
    accreditations: extractInstitutionalArray(instContent, 'accreditations'),
  };
}

// ----- Static Body Content Generation -----

function generateStaticBody(route, programme, inst, allProgrammes) {
  const catMatch = route.match(/^\/programmes\/category\/(.+)$/);
  const progMatch = route.match(/^\/programmes\/(.+)$/);

  if (route === '/') {
    const positioning = escapeHtml(inst.positioningStatement || '');
    const mission = escapeHtml(inst.mission || '');
    const vision = escapeHtml(inst.vision || '');
    return `<main>
      <h1>Goshen International Business School (GIBS)</h1>
      <p>${positioning}</p>
      <p><strong>Mission:</strong> ${mission}</p>
      <p><strong>Vision:</strong> ${vision}</p>
    </main>`;
  }

  if (route === '/about') {
    const mission = escapeHtml(inst.mission || '');
    const vision = escapeHtml(inst.vision || '');
    const positioning = escapeHtml(inst.positioningStatement || '');
    const slogan = escapeHtml(inst.slogan || '');
    const principles = inst.guidingPrinciples.map((p) => `<li>${escapeHtml(p)}</li>`).join('');
    const values = inst.coreValues.map((v) => `<li>${escapeHtml(v)}</li>`).join('');
    const focusAreas = inst.strategicFocusAreas.map((a) => `<li>${escapeHtml(a)}</li>`).join('');
    const accreds = inst.accreditations.map((a) => `<li>${escapeHtml(a)}</li>`).join('');
    return `<main>
      <h1>About GIBS — Goshen International Business School</h1>
      <p>${positioning}</p>
      <p><strong>Slogan:</strong> ${slogan}</p>
      <h2>Mission</h2>
      <p>${mission}</p>
      <h2>Vision</h2>
      <p>${vision}</p>
      <h2>Guiding Principles</h2>
      <ul>${principles}</ul>
      <h2>Core Values</h2>
      <ul>${values}</ul>
      <h2>Strategic Focus Areas</h2>
      <ul>${focusAreas}</ul>
      <h2>Accreditations</h2>
      <ul>${accreds}</ul>
    </main>`;
  }

  if (route === '/contact') {
    const address = escapeHtml(inst.postalAddress || '');
    const website = escapeHtml(inst.website || '');
    /* The contact page in data.ts is the source of phoneNumbers, but data.ts
       is byte-locked. Retired numbers are filtered out and the new official
       number is appended, mirroring the render-layer transform in
       src/pages/Contact.tsx. */
    const RETIRED = new Set(["08033429427", "08032296041"]);
    const NEW_NUMBER = "08160010400";
    const activePhones = [
      ...inst.phoneNumbers.filter((n) => !RETIRED.has(n)),
      ...(inst.phoneNumbers.includes(NEW_NUMBER) ? [] : [NEW_NUMBER]),
    ];
    const phones = activePhones
      .map((n) => `<li><strong>Phone:</strong> ${escapeHtml(n)}</li>`)
      .join('');
    const emails = inst.emails
      .map((e) => `<li><strong>Email:</strong> ${escapeHtml(e)}</li>`)
      .join('');
    const hubs = inst.overseasHubs.map((h) => `<li>${escapeHtml(h)}</li>`).join('');
    return `<main>
      <h1>Contact GIBS</h1>
      <h2>Postal Address</h2>
      <p>${address}</p>
      <h2>Website</h2>
      <p>${website}</p>
      <h2>Phone Numbers</h2>
      <ul>${phones}</ul>
      <h2>Email Addresses</h2>
      <ul>${emails}</ul>
      <h2>Overseas Hubs</h2>
      <ul>${hubs}</ul>
    </main>`;
  }

  if (route === '/executive-education') {
    const hubs = inst.overseasHubs.map((h) => `<li>${escapeHtml(h)}</li>`).join('');
    const partner = escapeHtml(inst.technicalPartner || '');
    return `<main>
      <h1>Foreign Executive Training | GIBS</h1>
      <p>GIBS offers executive training programmes across global hubs in Kigali, Dubai, London, and Houston.</p>
      <h2>Overseas Training Hubs</h2>
      <ul>${hubs}</ul>
      <p><strong>Technical Partner:</strong> ${partner}</p>
    </main>`;
  }

  if (route === '/programmes') {
    const desc = escapeHtml(
      'Complete 2026 GIBS Training Calendar: 113 Local Open Programmes and 22 Foreign Executive Training Programmes in Kigali, Dubai, London, and Houston.',
    );
    return `<main>
      <h1>2026 Training Calendar (135 Programmes) | GIBS</h1>
      <p>${desc}</p>
    </main>`;
  }

  if (catMatch && programme === null) {
    const categorySlug = catMatch[1];
    const catProgrammes = (allProgrammes || []).filter(
      (p) => categoryToSlug(p.category) === categorySlug,
    );
    const catName = catProgrammes[0]?.category || 'Training Programmes';
    const links = catProgrammes
      .slice(0, 15)
      .map(
        (p) =>
          `<li><a href="${CANONICAL_DOMAIN}/programmes/${p.slug}">${escapeHtml(p.code)} — ${escapeHtml(p.title)}</a></li>`,
      )
      .join('');
    return `<main>
      <h1>${escapeHtml(catName)} Training Programmes | GIBS</h1>
      <p>Explore our executive training programmes in ${escapeHtml(catName)} at GIBS.</p>
      <h2>Programmes in this category</h2>
      <ol>${links}</ol>
    </main>`;
  }

  if (progMatch && programme) {
    const code = escapeHtml(programme.code || '');
    const title = escapeHtml(programme.title || '');
    const category = escapeHtml(programme.category || '');
    const destination = escapeHtml(programme.destination || 'Local');
    const schedule = escapeHtml(programme.schedule || '');
    const fees = escapeHtml(programme.fees || '');
    const duration = escapeHtml(programme.duration || '5 Days');
    const targetAudience = escapeHtml(programme.targetAudience || '');
    const summary = escapeHtml(programme.summary || '');
    const outcomes = programme.outcomes?.length
      ? '<h2>Learning Outcomes</h2><ul>' +
        programme.outcomes.map((o) => `<li>${escapeHtml(o)}</li>`).join('') +
        '</ul>'
      : '';
    const structure = programme.indicativeStructure?.length
      ? '<h2>Programme Structure</h2><ol>' +
        programme.indicativeStructure.map((s) => `<li>${escapeHtml(s)}</li>`).join('') +
        '</ol>'
      : '';
    const faqList = programme.faqs?.length
      ? '<h2>Frequently Asked Questions</h2>' +
        programme.faqs
          .map(
            (f) =>
              `<div><strong>${escapeHtml(f.q)}</strong><p>${escapeHtml(f.a)}</p></div>`,
          )
          .join('')
      : '';
    return `<main>
      <h1>${title}</h1>
      <p><strong>Code:</strong> ${code}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Location:</strong> ${destination} Training</p>
      <p><strong>Duration:</strong> ${duration}</p>
      <p><strong>Schedule:</strong> ${schedule}</p>
      <p><strong>Tuition Fee:</strong> ${fees}</p>
      <p><strong>Target Audience:</strong> ${targetAudience}</p>
      <p>${summary}</p>
      ${outcomes}
      ${structure}
      ${faqList}
    </main>`;
  }

  return '';
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

function generateShell(masterHtml, route, meta, staticBody) {
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
  if (html.includes('property="og:url"')) {
    html = replaceMetaContent(html, 'og:url', `${CANONICAL_DOMAIN}${route}`);
  }
  html = replaceMetaContent(html, 'og:image', `${CANONICAL_DOMAIN}/images/gibs-hero-branded.webp`);
  if (staticBody) {
    html = html.replace('<div id="root"></div>', `<div id="root">${staticBody}</div>`);
  }
  return html;
}

function normalizeAssetUrls(html) {
  // vite-plugin-singlefile sets config.base = "./" for file:// compatibility,
  // rewriting root-relative assets to relative paths (e.g. ./fonts/..., ./favicon.ico).
  // For deep route shells (e.g. /programmes/category/:slug and /programmes/:slug),
  // relative asset paths cause the browser to resolve assets against the nested path,
  // resulting in 404s. We restore root-relative paths for fonts, favicon, and icon images.
  return html
    .replaceAll('href="./fonts/', 'href="/fonts/')
    .replaceAll('url(./fonts/', 'url(/fonts/')
    .replaceAll('href="./favicon.ico"', 'href="/favicon.ico"')
    .replaceAll('href="./images/', 'href="/images/')
    .replaceAll('src="./images/', 'src="/images/');
}

function writeShell(route, shellHtml) {
  const dir = path.join(DIST_DIR, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), shellHtml);

  // Also write clean-url HTML file (e.g. dist/about.html) alongside dist/about/index.html
  // to guarantee direct static resolution across all server / routing configurations
  const cleanPath = `${path.join(DIST_DIR, route)}.html`;
  fs.mkdirSync(path.dirname(cleanPath), { recursive: true });
  fs.writeFileSync(cleanPath, shellHtml);
}

async function run() {
  try {
    console.log('Starting SEO Shell Generation...');
    if (!fs.existsSync(MASTER_SHELL_PATH)) throw new Error('Master shell not found. Run npm run build first.');
    let masterHtml = fs.readFileSync(MASTER_SHELL_PATH, 'utf8');
    masterHtml = normalizeAssetUrls(masterHtml);
    fs.writeFileSync(MASTER_SHELL_PATH, masterHtml);

    // Validate that all referenced fonts exist on disk
    const fontMatches = masterHtml.matchAll(/(?:href|url)\(["']?\/fonts\/([^"')\s]+)["']?\)/g);
    const checkedFonts = new Set();
    for (const m of fontMatches) {
      const fontFile = m[1];
      if (checkedFonts.has(fontFile)) continue;
      checkedFonts.add(fontFile);
      const fontDiskPath = path.join(DIST_DIR, 'fonts', fontFile);
      if (!fs.existsSync(fontDiskPath)) {
        throw new Error(`Referenced font file does not exist on disk: ${fontDiskPath}`);
      }
    }
    console.log(`Validated ${checkedFonts.size} font assets exist on disk in ${DIST_DIR}/fonts/.`);

    const programmes = extractProgrammes();
    console.log(`Extracted ${programmes.length} programmes.`);

    const inst = extractInstitutionalData();
    console.log(`Extracted institutional metadata ${inst.website ? 'OK' : '(partial)'}.`);

    const routes = [];

    // 1. Programmes
    for (const p of programmes) {
      const route = `/programmes/${p.slug}`;
      routes.push({ path: route, meta: { title: `${p.title} | GIBS`, description: p.summary.substring(0, 155) }});
      const shellHtml = generateShell(masterHtml, route, { title: `${p.title} | GIBS`, description: p.summary.substring(0, 155) }, generateStaticBody(route, p, inst, programmes));
      writeShell(route, shellHtml);
    }

    // 2. Institutional
    const instRoutes = [
      { path: '/programmes', title: '2026 Training Calendar (135 Programmes) | GIBS', desc: 'Complete 2026 GIBS Training Calendar: 113 Local Open Programmes and 22 Foreign Executive Programmes in Kigali, Dubai, London, and Houston.' },
      { path: '/about', title: 'About GIBS | Goshen International Business School', desc: 'Learn about our mission, vision and guiding principles.' },
      { path: '/contact', title: 'Contact GIBS | Training Desk & Enquiries', desc: 'Get in touch with GIBS for programme registration and campus visits.' },
      { path: '/admissions', title: 'Admissions & Enrolment | GIBS', desc: 'Admission procedures, executive nomination and registration details for GIBS programmes.' },
      { path: '/executive-education', title: 'Foreign Executive Training | GIBS', desc: 'Global training hubs in Kigali, Dubai, London and Houston.' },
      { path: '/gallery', title: 'Campus & Training Gallery | GIBS', desc: 'Visual archive of GIBS executive training sessions, campus facilities and global cohorts.' },
      { path: '/concierge', title: 'GIBS AI | Institutional Guide', desc: 'Ask our AI about programmes, locations and enrolment.' },
    ];
    for (const r of instRoutes) {
      routes.push({ path: r.path, meta: { title: r.title, description: r.desc }});
      const shellHtml = generateShell(masterHtml, r.path, { title: r.title, description: r.desc }, generateStaticBody(r.path, null, inst, programmes));
      writeShell(r.path, shellHtml);
    }

    // 3. Categories
    const categories = [...new Set(programmes.map(p => p.category))];
    const seenCategorySlugs = new Set();
    for (const cat of categories) {
      const slug = categoryToSlug(cat);
      if (seenCategorySlugs.has(slug)) {
        throw new Error(`Category slug collision detected for "${cat}": "${slug}" is already used.`);
      }
      seenCategorySlugs.add(slug);

      const route = `/programmes/category/${slug}`;
      routes.push({ path: route, meta: { title: `${cat} Training Programmes | GIBS`, description: `Explore our executive training programmes in ${cat} at GIBS.` }});
      const shellHtml = generateShell(masterHtml, route, { title: `${cat} Training Programmes | GIBS`, description: `Explore our executive training programmes in ${cat} at GIBS.` }, generateStaticBody(route, null, inst, programmes));
      writeShell(route, shellHtml);
    }

    // 4. Sitemap
    const sitemapEntries = routes.map(r => `  <url>\n    <loc>${escapeHtml(CANONICAL_DOMAIN + r.path)}</loc>\n  </url>`).join('\n');
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${CANONICAL_DOMAIN}/</loc>\n  </url>\n${sitemapEntries}\n</urlset>`;
    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml);

    // 5. Inject homepage-specific hero image preload into master shell (dist/index.html)
    // Preloads the exact responsive image selected by src/sections/Hero.tsx without leaking to other routes.
    const hero640Path = path.join(DIST_DIR, 'images', 'gibs-hero-branded-640.webp');
    const hero1050Path = path.join(DIST_DIR, 'images', 'gibs-hero-branded.webp');
    if (!fs.existsSync(hero640Path) || !fs.existsSync(hero1050Path)) {
      throw new Error('Referenced hero image files do not exist in dist/images/');
    }
    const heroPreloadTag = '<link rel="preload" as="image" href="/images/gibs-hero-branded.webp" imagesrcset="/images/gibs-hero-branded-640.webp 640w, /images/gibs-hero-branded.webp 1050w" imagesizes="100vw" fetchpriority="high" />';

    // Inject static body content into the homepage for non-JS crawlers
    const homepageStaticBody = generateStaticBody('/', null, inst, programmes);
    if (homepageStaticBody) {
      masterHtml = masterHtml.replace('<div id="root"></div>', `<div id="root">${homepageStaticBody}</div>`);
      fs.writeFileSync(MASTER_SHELL_PATH, masterHtml);
      console.log('Injected static body content into dist/index.html (homepage)');
    }

    if (!masterHtml.includes('href="/images/gibs-hero-branded.webp"')) {
      const homepageHtml = masterHtml.replace('</head>', `  ${heroPreloadTag}\n  </head>`);
      fs.writeFileSync(MASTER_SHELL_PATH, homepageHtml);
      console.log('Injected homepage-specific hero image preload into dist/index.html');
    }

    console.log(`SUCCESS: Generated ${routes.length} shells and sitemap.xml`);
  } catch (err) {
    console.error('SEO Generation failed:', err);
    process.exit(1);
  }
}

run();
