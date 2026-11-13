import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import { categoryToSlug, formatCategoryDisplayName } from '../src/lib/categoryUtils.ts';
import { activePhoneNumbers, scrubRetiredNumbersInProse } from '../src/lib/phones.ts';

const CANONICAL_DOMAIN = 'https://gibs.com.ng';
const DIST_DIR = path.resolve(process.env.GIBS_DIST_DIR || 'dist');
const MASTER_SHELL_PATH = path.join(DIST_DIR, 'index.html');
const CLEAN_TEMPLATE_PATH = path.join(tmpdir(), 'gibs-master-template.html');

/* Category-correction approval gate. The 10 audited reclassifications live in
 * src/lib/programme-content.ts (CATEGORY_CORRECTIONS). They are applied to
 * static shells / JSON-LD / breadcrumbs / sitemap / llms.txt ONLY when an
 * operator sets APPLY_CATEGORY_CORRECTIONS=true at generation time; when the
 * gate is OFF (default) resolveCategory() returns each programme's locked
 * data.ts category verbatim, so published output is byte-identical to the
 * verified catalogue. data.ts is never edited. */
const APPLY_CATEGORY_CORRECTIONS = process.env.APPLY_CATEGORY_CORRECTIONS === 'true';

/* Programme schedules in src/lib/data.ts reference 2026 calendar sessions.
   As of November 2026, all 2026 dates have passed. Suppress expired schedule
   information in generated shells without modifying the protected catalogue.
   Replace with an enquiry message. */
const EXPIRED_SCHEDULE_MESSAGE = 'Contact GIBS for the current programme schedule.';
const EXPIRED_FAQ_MESSAGE = 'Contact GIBS for the current programme schedule and dates.';

function suppressExpiredSchedule(schedule) {
  if (!schedule) return schedule;
  return EXPIRED_SCHEDULE_MESSAGE;
}

function suppressExpiredFaqAnswer(answer) {
  if (!answer) return answer;
  if (/2026 calendar sessions/.test(answer)) {
    return EXPIRED_FAQ_MESSAGE;
  }
  // Foreign programme FAQs: "The programme takes place in [place] on the confirmed dates: [dates]."
  if (/confirmed dates:.*/.test(answer)) {
    return EXPIRED_FAQ_MESSAGE;
  }
  return answer;
}

/* Suppress expired 2026 schedule dates from programme summaries used in
 * meta descriptions, Open Graph descriptions, Twitter descriptions, and
 * Course JSON-LD. All programme summaries in data.ts end with a date
 * schedule that has passed as of November 2026. Remove only the date
 * schedule, preserving the accurate programme name, audience, duration,
 * and description. Handles both " Scheduled across ...:" and " Dates: ..."
 * patterns. */
function suppressExpiredDatesInSummary(text) {
  if (!text) return text;
  // Remove expired schedule: " Scheduled across [locations] and regional hubs: [dates]."
  let result = text.replace(/\s+Scheduled across.*$/, '');
  // Remove expired schedule: " Dates: [dates]." (foreign programmes)
  result = result.replace(/\s+Dates:.*$/, '');
  // Clean up double periods left behind (e.g. "Dept.." → "Dept.")
  result = result.replace(/\.\./g, '.');
  return result.trim();
}

/* Suppress expired 2026 schedule dates from programme taglines used in
 * PageHero intros. Taglines end with " · [dates]." which has passed. */
function suppressExpiredDatesInTagline(text) {
  if (!text) return text;
  const dotIndex = text.lastIndexOf('\u00b7');
  if (dotIndex > 0) {
    const afterDot = text.slice(dotIndex + 1).trim();
    // Check if after · contains date patterns
    if (/\d[\u2013\-]\d/.test(afterDot) || /2026/.test(afterDot)) {
      return text.slice(0, dotIndex).trim();
    }
  }
  return text;
}

/* Vite build manifest (dist/manifest.json) maps source modules to their
 * emitted chunk file. Loaded in run() so every static shell can emit a
 * <link rel="modulepreload"> for the lazy chunk that hydrates it — this is
 * what keeps the statically-rendered shell from blanking during the brief
 * React.lazy suspense window on direct entry. */
let MANIFEST = null;

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

/* ----- Content layer (src/lib/programme-content.ts) -----
 * The catalogue duplication (outcomes/structure/summary/faqs) lives in the
 * byte-locked src/lib/data.ts, which cannot be edited. Curated, topic-specific
 * copy lives in the SEPARATE src/lib/programme-content.ts and is parsed here
 * with the SAME balanced-bracket + quoted-key extractors used above for
 * data.ts. Only content whose `status` is `approved` is applied; every other
 * entry is ignored so drafts can never reach generated HTML/JSON-LD/sitemap/
 * llms.txt. This parser must stay in lock-step with ProgrammeContent fields. */
/* Capture the body (excluding the outer braces) of `export const NAME = { ... }`
 * using balanced-brace scanning. A regex capture with a greedy `([\s\S]*)\}`
 * is unsafe: once a second `export const ... = {...};` appears later in the
 * same file, the greedy capture extends into it and over-counts entries. */
function extractObjectBody(src, constName) {
  const re = new RegExp('export const ' + constName + '\\b[\\s\\S]*?=[\\s\\S]*?\\{');
  const m = src.match(re);
  if (!m) return null;
  let i = m.index + m[0].length;
  let depth = 1;
  let body = '';
  while (i < src.length && depth > 0) {
    const ch = src[i++];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) break;
    }
    body += ch;
  }
  return body;
}

function extractProgrammeContent() {
  const contentPath = path.join(process.cwd(), 'src', 'lib', 'programme-content.ts');
  const content = fs.readFileSync(contentPath, 'utf8');

  // Find the export const PROGRAMME_CONTENT = { ... } literal (balanced-brace).
  const objectBody = extractObjectBody(content, 'PROGRAMME_CONTENT');
  if (!objectBody) return {};
  // Split top-level entries: "CODE": { ... }  (braceDepth tracks nested braces)
  const entries = [];
  let current = '';
  let braceDepth = 0;
  for (let i = 0; i < objectBody.length; i++) {
    const ch = objectBody[i];
    if (ch === '{') { braceDepth++; current += ch; continue; }
    if (ch === '}') { braceDepth--; current += ch; continue; }
    if (braceDepth === 0 && ch === ',') { entries.push(current.trim()); current = ''; continue; }
    current += ch;
  }
  if (current.trim()) entries.push(current.trim());

  const map = {};
  for (const entry of entries) {
    // Each entry is: "CODE": { ...object body... }
    const keyMatch = entry.match(/^\s*"([^"]+)"\s*:/);
    if (!keyMatch) continue;
    const code = decodeJsonString(keyMatch[1]);
    const objMatch = entry.match(/\{\s*([\s\S]*)\}\s*$/);
    const objBody = objMatch ? objMatch[1] : '';
    if (!objBody) continue;

    const record = {
      code,
      status: extractStringProp(objBody, 'status') || 'draft',
      summary: extractStringProp(objBody, 'summary'),
      outcomes: extractStringArrayProp(objBody, 'outcomes'),
      structure: extractStringArrayProp(objBody, 'structure'),
      relatedSlugs: extractStringArrayProp(objBody, 'relatedSlugs'),
      intro: extractStringProp(objBody, 'intro'),
      source: extractStringProp(objBody, 'source'),
      faqs: extractFaqProp(objBody, 'faqs'),
    };
    map[code] = record;
  }
  return map;
}

/* Parse CATEGORY_INTRO_CONTENT (keyed by canonical category name) the same way
 * PROGRAMME_CONTENT is parsed. Returns Record<category, {status,intro,source}>. */
function extractCategoryIntros() {
  const contentPath = path.join(process.cwd(), 'src', 'lib', 'programme-content.ts');
  const src = fs.readFileSync(contentPath, 'utf8');
  // Balanced-brace capture of the CATEGORY_INTRO_CONTENT object body.
  const objectBody = extractObjectBody(src, 'CATEGORY_INTRO_CONTENT');
  if (!objectBody) return {};
  const entries = [];
  let current = '';
  let braceDepth = 0;
  for (let i = 0; i < objectBody.length; i++) {
    const ch = objectBody[i];
    if (ch === '{') { braceDepth++; current += ch; continue; }
    if (ch === '}') { braceDepth--; current += ch; continue; }
    if (braceDepth === 0 && ch === ',') { entries.push(current.trim()); current = ''; continue; }
    current += ch;
  }
  if (current.trim()) entries.push(current.trim());
  const map = {};
  for (const entry of entries) {
    const keyMatch = entry.match(/^\s*"([^"]+)"\s*:\s*\{([\s\S]*)\}\s*$/);
    if (!keyMatch) continue;
    const category = decodeJsonString(keyMatch[1]);
    const objBody = keyMatch[2];
    if (!objBody) continue;
    map[category] = {
      category,
      status: extractStringProp(objBody, 'status') || 'draft',
      intro: extractStringProp(objBody, 'intro'),
      source: extractStringProp(objBody, 'source'),
    };
  }
  return map;
}

/* The resolved (post-gate) narrative for a programme. Only `approved` content
 * overrides the locked catalogue values; everything else falls back to data.ts,
 * so the published output is identical to today unless/until GIBS approves a
 * replacement. `relatedSlugs` is empty unless approved content supplies it. */
function applyContent(programme, contentByCode) {
  const cc = contentByCode && contentByCode[programme.code];
  const approved = cc && cc.status === 'approved';
  if (!approved) {
    return {
      summary: programme.summary,
      outcomes: programme.outcomes || [],
      structure: programme.indicativeStructure || [],
      faqs: programme.faqs || [],
      relatedSlugs: [],
    };
  }
  return {
    summary: cc.summary || programme.summary,
    outcomes: (cc.outcomes && cc.outcomes.length) ? cc.outcomes : (programme.outcomes || []),
    structure: (cc.structure && cc.structure.length) ? cc.structure : (programme.indicativeStructure || []),
    faqs: (cc.faqs && cc.faqs.length) ? cc.faqs : (programme.faqs || []),
    relatedSlugs: (cc.relatedSlugs || []).slice(0, 3),
  };
}

/* Parse the lean CATEGORY_CORRECTIONS map from src/lib/programme-content.ts
 * ({ "code": "canonicalCategory", ... }). Returns Record<code, category>. */
function extractCategoryCorrections() {
  const contentPath = path.join(process.cwd(), 'src', 'lib', 'programme-content.ts');
  const content = fs.readFileSync(contentPath, 'utf8');
  const body = extractObjectBody(content, 'CATEGORY_CORRECTIONS');
  if (!body) return {};
  const map = {};
  const re = /"([^"]+)"\s*:\s*"([^"]+)"/g;
  for (const m of body.matchAll(re)) {
    map[decodeJsonString(m[1])] = decodeJsonString(m[2]);
  }
  return map;
}

/* Category resolver honoring the approval gate. OFF (default) → data.ts
 * category verbatim → output identical to verified catalogue. ON (operator
 * authorisation via APPLY_CATEGORY_CORRECTIONS=true) → audited destination. */
function resolveCategory(programme, contentByCode) {
  const corrections = (contentByCode && contentByCode.corrections) || {};
  if (APPLY_CATEGORY_CORRECTIONS && programme && programme.code && corrections[programme.code]) {
    return corrections[programme.code];
  }
  return programme ? (programme.category || '') : '';
}

// Extract a quoted string property value from a record body.
function extractStringProp(rec, key) {
  // Quote-tolerant: matches `"key": "value"` (data.ts / ProgrammeContent) AND
  // bare `key: "value"` (unquoted TS object keys). The `\\b` guard on the bare
  // fallback prevents matching `key` as a substring of a longer identifier.
  const m = rec.match(new RegExp(`"${key}"\\s*:\\s*"([^"]*)"`)) ||
            rec.match(new RegExp(`\\b${key}\\s*:\\s*"([^"]*)"`));
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

function formatE164(phone) {
  if (!phone) return '';
  const cleaned = phone.replace(/[\s\-()]/g, '');
  if (cleaned.startsWith('+')) return cleaned;
  if (cleaned.startsWith('234')) return `+${cleaned}`;
  if (cleaned.startsWith('0')) return `+234${cleaned.slice(1)}`;
  return cleaned;
}

function programmeTitle(pOrTitle, maybeDestination, maybeCode) {
  const isObj = typeof pOrTitle === 'object' && pOrTitle !== null;
  const title = isObj ? pOrTitle.title : pOrTitle;
  const destination = isObj ? pOrTitle.destination : maybeDestination;
  const code = isObj ? pOrTitle.code : maybeCode;

  // Primary full suffix for institutional brand clarity
  let fullSuffix = ' | Goshen International Business School';
  let shortSuffix = ' | GIBS';
  if (destination && destination !== 'Local') {
    fullSuffix = ` (${destination} Hub) | Goshen International Business School`;
    shortSuffix = ` (${destination} Hub) | GIBS`;
  } else if (code === 'GIBS-LOC-103') {
    fullSuffix = ' (Special Executive) | Goshen International Business School';
    shortSuffix = ' (Special Executive) | GIBS';
  } else if (code === 'GIBS-LOC-077') {
    fullSuffix = ' (Power & Energy) | Goshen International Business School';
    shortSuffix = ' (Power & Energy) | GIBS';
  }

  const limit = 120;
  // If full institutional title fits within 120 characters, use it
  if (title.length + fullSuffix.length <= limit) return `${title}${fullSuffix}`;

  // If full suffix overflows 120 chars, use recognised short suffix GIBS
  // to avoid prematurely truncating vital course subject keywords
  let suffix = shortSuffix;
  if (title.length + suffix.length <= limit) return `${title}${suffix}`;

  const maxTitleLength = limit - suffix.length;
  const excerpt = title.slice(0, maxTitleLength);
  const boundary = excerpt.lastIndexOf(' ');

  // If we have a reasonable boundary, use it.
  if (boundary > 15) {
    return `${title.slice(0, boundary).trim()}${suffix}`;
  }

  // FALLBACK: If the title is very long and has no early boundary,
  // we must still cap it at the limit.
  const forcedBoundary = title.slice(0, maxTitleLength).lastIndexOf(' ');
  if (forcedBoundary > 0) {
    return `${title.slice(0, forcedBoundary).trim()}${suffix}`;
  }

  // Absolute last resort: hard cut
  return `${title.slice(0, maxTitleLength)}${suffix}`;
}

function parseOffer(feeString) {
  if (!feeString) return null;
  let currency = 'NGN';
  if (feeString.includes('₦')) currency = 'NGN';
  else if (feeString.includes('$') || feeString.includes('USD')) currency = 'USD';
  else if (feeString.includes('£') || feeString.includes('GBP')) currency = 'GBP';

  const m = feeString.match(/([0-9]+(?:,[0-9]+)*)/);
  if (!m) return null;
  const price = parseInt(m[1].replace(/,/g, ''), 10);
  if (!price || isNaN(price)) return null;
  return {
    "@type": "Offer",
    "price": price,
    "priceCurrency": currency,
    "category": "Tuition Fee",
    "url": `${CANONICAL_DOMAIN}/admissions`
  };
}

function programmeMetaDescription(summary) {
  const maxLength = 160;
  if (!summary) return 'Executive training programme at Goshen International Business School.';

  // The metadata value is what matters.
  // We must account for the ellipsis (...) which is 1 character.
  const effectiveMax = maxLength - 1;

  if (summary.length <= maxLength) return summary;

  // Truncate to effectiveMax then find the last word boundary.
  const excerpt = summary.slice(0, effectiveMax);
  const boundary = excerpt.search(/\s+\S*$/u);

  if (boundary <= 0) return `${excerpt}…`;

  return `${excerpt.slice(0, boundary).replace(/[\s,;:—–-]+$/u, '')}…`;
}

function getOrgSchema(inst) {
  const activePhones = activePhoneNumbers(inst.phoneNumbers);
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${CANONICAL_DOMAIN}/#organization`,
    "name": "Goshen International Business School",
    "legalName": "Goshen International Business School Limited",
    "alternateName": "GIBS",
    "identifier": "RC 1178333",
    "slogan": inst.slogan,
    "url": CANONICAL_DOMAIN,
    "logo": `${CANONICAL_DOMAIN}/images/gibs-logo.webp`,
    "description": "Goshen International Business School Limited (RC 1178333) is an accredited executive education and capacity-building institution offering 113 local programmes across Ilorin, Abuja, and Ibafo, and 22 foreign executive programmes across Kigali, Dubai, London, and Houston.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": inst.postalAddress,
      "addressLocality": "Ilorin",
      "addressRegion": "Kwara State",
      "addressCountry": "NG"
    },
    "contactPoint": activePhones.map((ph, idx) => ({
      "@type": "ContactPoint",
      "telephone": formatE164(ph),
      "contactType": idx === 0 ? "Training Desk & Programme Enquiries" : "Programme Enquiries",
      "email": inst.emails[idx] || inst.emails[0]
    }))
  });
}

function getWebSiteSchema() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${CANONICAL_DOMAIN}/#website`,
    "name": "Goshen International Business School (GIBS)",
    "alternateName": "GIBS",
    "url": CANONICAL_DOMAIN,
    "inLanguage": "en",
    "description": "Goshen International Business School offers executive training programmes across Nigeria and four overseas hubs: Kigali, Dubai, London, and Houston. Registered with the Corporate Affairs Commission (CAC RC 1178333).",
    "publisher": {
      "@type": "EducationalOrganization",
      "@id": `${CANONICAL_DOMAIN}/#organization`,
      "name": "Goshen International Business School Limited",
      "legalName": "Goshen International Business School Limited",
      "identifier": "RC 1178333",
      "url": CANONICAL_DOMAIN
    }
  });
}

function convertDurationToIso(durationStr) {
  if (!durationStr) return null;
  const s = durationStr.trim();
  if (s === '5 Days') return 'P5D';
  if (s === '1 Week') return 'P1W';
  if (s === '2 Weeks') return 'P2W';
  // Duration ranges (e.g. '1–2 Weeks') are omitted to avoid misleading exact representation
  return null;
}

function getCourseSchema(p) {
  const offer = parseOffer(p.fees);
  const isoDuration = convertDurationToIso(p.duration);
  const locationName = p.destination === 'Local'
    ? 'GIBS Training Centres, Nigeria'
    : `GIBS ${p.destination} Executive Training Centre`;

  // Map destination to correct ISO 3166-1 alpha-2 country codes
  const destinationCountryMap = {
    'Kigali': 'RW',
    'Dubai': 'AE',
    'London': 'GB',
    'Houston': 'US',
    'Local': 'NG'
  };
  const addressCountry = destinationCountryMap[p.destination] || 'NG';

  const instance = {
    "@type": "CourseInstance",
    "@id": `${CANONICAL_DOMAIN}/programmes/${p.slug}#course-instance`,
    "courseMode": "onsite",
    "location": {
      "@type": "Place",
      "name": locationName,
      "address": p.destination === 'Local' ? {
        "@type": "PostalAddress",
        "addressCountry": "NG"
      } : {
        "@type": "PostalAddress",
        "addressLocality": p.destination,
        "addressCountry": addressCountry
      }
    }
  };
  if (isoDuration) {
    instance.duration = isoDuration;
  }
  if (offer) {
    instance.offers = offer;
  }

  const courseObj = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${CANONICAL_DOMAIN}/programmes/${p.slug}`,
    "name": p.title,
    "courseCode": p.code,
    "description": p.summary,
    "provider": {
      "@type": "EducationalOrganization",
      "@id": `${CANONICAL_DOMAIN}/#organization`,
      "name": "Goshen International Business School",
      "legalName": "Goshen International Business School Limited"
    },
    "url": `${CANONICAL_DOMAIN}/programmes/${p.slug}`,
    "inLanguage": "en",
    "timeRequired": isoDuration,
    "hasCourseInstance": instance
  };

  return JSON.stringify(courseObj);
}

function getBreadcrumbSchema(items) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${CANONICAL_DOMAIN}/#breadcrumb`,
    "itemListElement": items.map((item, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": item.name,
      "item": item.url
    }))
  });
}

function getCourseListSchema(programmes, categoryUrl) {
  const catName = programmes[0] && programmes[0].category ? programmes[0].category : 'Training';
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${categoryUrl}#itemlist`,
    "name": `${catName} Programmes`,
    "itemListElement": programmes.map((p, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": p.title,
      "url": `${CANONICAL_DOMAIN}/programmes/${p.slug}`
    }))
  });
}

function getLocationSchema(loc) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${CANONICAL_DOMAIN}${loc.path}#facility`,
    "name": `${loc.name} — Goshen International Business School`,
    "alternateName": `GIBS ${loc.shortName}`,
    "url": `${CANONICAL_DOMAIN}${loc.path}`,
    "description": loc.desc,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": loc.address,
      "addressLocality": loc.city,
      "addressRegion": loc.state,
      "addressCountry": "NG"
    },
    "telephone": loc.telephone || "+2348160010401",
    "parentOrganization": {
      "@type": "EducationalOrganization",
      "@id": `${CANONICAL_DOMAIN}/#organization`,
      "name": "Goshen International Business School",
      "url": CANONICAL_DOMAIN
    }
  });
}

function getWebPageSchema(page) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${page.url}#webpage`,
    "name": page.title,
    "description": page.description,
    "url": page.url,
    "inLanguage": "en",
    "isPartOf": {
      "@type": "WebSite",
      "@id": `${CANONICAL_DOMAIN}/#website`
    },
    "publisher": {
      "@type": "EducationalOrganization",
      "@id": `${CANONICAL_DOMAIN}/#organization`,
      "name": "Goshen International Business School Limited",
      "legalName": "Goshen International Business School Limited",
      "identifier": "RC 1178333",
      "url": CANONICAL_DOMAIN
    }
  });
}


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

const PRIMARY_INSTITUTIONAL_ROUTES = [
  { path: '/programmes', label: '2026 Training Calendar (135 Programmes)' },
  { path: '/about', label: 'About Us — Mission, Governance & Accreditations' },
  { path: '/contact', label: 'Contact & Training Registry' },
  { path: '/locations/ilorin', label: 'Ilorin Training Headquarters' },
  { path: '/locations/abuja', label: 'Abuja Executive Training Centre' },
  { path: '/locations/ibafo', label: 'Ibafo Training Centre' },
  { path: '/admissions', label: 'Programme Enquiries & Registration' },
  { path: '/executive-education', label: 'Foreign Executive Training (Kigali, Dubai, London, Houston)' },
  { path: '/gallery', label: 'Campus & Facility Gallery' },
  { path: '/concierge', label: 'GIBS Programme Assistant' },
  { path: '/privacy-policy', label: 'Privacy Policy' },
];

function generateInstitutionalNav() {
  const items = PRIMARY_INSTITUTIONAL_ROUTES
    .map((r) => `<li><a href="${r.path}">${escapeHtml(r.label)}</a></li>`)
    .join('');
  return `<nav aria-label="Institutional Navigation">
        <h2>Institutional Overview</h2>
        <ul>${items}</ul>
      </nav>`;
}

function generateCategoryNav(allProgrammes) {
  const categories = [...new Set((allProgrammes || []).map((p) => p.category))];
  const items = categories
    .map((cat) => {
      const slug = categoryToSlug(cat);
      const label = cat.endsWith('Training') ? `${cat} Programmes` : `${cat} Training Programmes`;
      return `<li><a href="/programmes/category/${slug}">${escapeHtml(label)}</a></li>`;
    })
    .join('');
  return `<nav aria-label="Programme Categories">
        <h2>Training Sectors & Categories</h2>
        <ul>${items}</ul>
      </nav>`;
}

function generateLlmsTxt(inst, allProgrammes, contentLayer) {
  const activePhones = activePhoneNumbers(inst.phoneNumbers);
  const categories = [...new Set((allProgrammes || []).map((p) => p.category))];
  const progPending = Object.values(contentLayer.programmes || {}).filter((c) => c.status === 'pending-verification').length;
  const progApproved = Object.values(contentLayer.programmes || {}).filter((c) => c.status === 'approved').length;
  const catPending = Object.values(contentLayer.categories || {}).filter((c) => c.status === 'pending-verification').length;
  const catApproved = Object.values(contentLayer.categories || {}).filter((c) => c.status === 'approved').length;
  const categoryLinks = categories
    .map((cat, idx) => {
      const slug = categoryToSlug(cat);
      return `${idx + 1}. [${cat}](${CANONICAL_DOMAIN}/programmes/category/${slug})`;
    })
    .join('\n');

  const localCount = allProgrammes.filter((p) => p.destination === 'Local').length;
  const foreignCount = allProgrammes.filter((p) => p.destination !== 'Local').length;

  return `# Goshen International Business School (GIBS)

> ${inst.positioningStatement || 'Goshen International Business School Limited (GIBS) is a premier Nigerian business school and executive education institution offering accredited professional development, executive management programmes, and institutional training.'}

## Institutional Metadata & Governance
- Legal Name: ${inst.legalName}
- Short Name: GIBS
- CAC Registration: RC 1178333
- Slogan: ${inst.slogan}
- Website: ${CANONICAL_DOMAIN}
- Postal Address: ${inst.postalAddress}
- Primary Phone Numbers: ${activePhones.join(', ')}
- Email: ${inst.emails.join(', ')}
- Technical Partner: ${inst.technicalPartner}
- Accreditations: ${inst.accreditations.join(', ')}
- Overseas Executive Hubs: ${inst.overseasHubs.filter((h) => /Kigali|Dubai|London|Houston/.test(h)).join(', ')}
- Domestic Training Centres: Ilorin, Abuja, Lagos, Ibafo

## 2026 Training Programme Catalogue
- Total Canonical Programmes: ${allProgrammes.length}
- Local Open Programmes: ${localCount} programmes (5-day intensive onsite courses in Ilorin, Abuja, Lagos, Ibafo)
- Foreign Executive Programmes: ${foreignCount} programmes (Kigali, Dubai, London, Houston)
- Local Tuition Fees: ₦300,000 to ₦800,000 NGN
- Foreign Tuition Fees: $4,800 USD to $9,500 USD / £4,800 GBP

## Programme Content & Curriculum Architecture
- Canonical 2026 Catalogue: ${allProgrammes.length} programmes across ${categories.length} industry categories
- Category introductions with topic-specific curricula: ${catApproved} of ${categories.length} categories approved (${catPending} pending institutional verification)
- Supplementary content layer: ${Object.keys(contentLayer.programmes || {}).length} per-programme records (${progApproved} approved, ${progPending} pending verification) and ${Object.keys(contentLayer.categories || {}).length} category-page introductions (${catApproved} approved, ${catPending} pending verification)
- Verified catalogue metadata: Every programme specifies official course code, category, destination, duration, 2026 calendar sessions, tuition fee, and target executive audience
- Quality gate policy: Unverified claims are strictly barred; pages render verified catalogue values and approved syllabus content only

## Programme Categories & Specialisations
${categoryLinks}

## Key Institutional Routes & Physical Centres
- 2026 Training Calendar (Full Catalogue): ${CANONICAL_DOMAIN}/programmes
- About Us (Mission, Governance & Accreditations): ${CANONICAL_DOMAIN}/about
- Admissions & Enquiry Desk: ${CANONICAL_DOMAIN}/admissions
- Contact & Campus Registry: ${CANONICAL_DOMAIN}/contact
- Ilorin Headquarters: ${CANONICAL_DOMAIN}/locations/ilorin
- Abuja Executive Centre: ${CANONICAL_DOMAIN}/locations/abuja
- Ibafo Training Centre: ${CANONICAL_DOMAIN}/locations/ibafo
- Foreign Executive Education: ${CANONICAL_DOMAIN}/executive-education
- Campus & Facility Gallery: ${CANONICAL_DOMAIN}/gallery
- GIBS Programme Assistant: ${CANONICAL_DOMAIN}/concierge
- Privacy Policy: ${CANONICAL_DOMAIN}/privacy-policy
- XML Sitemap: ${CANONICAL_DOMAIN}/sitemap.xml
`;
}

function generateStaticBody(route, programme, contentByCode, inst, allProgrammes) {
  const catMatch = route.match(/^\/programmes\/category\/(.+)$/);
  const progMatch = route.match(/^\/programmes\/(.+)$/);

  if (route === '/') {
    const positioning = escapeHtml(inst.positioningStatement || '');
    const mission = escapeHtml(inst.mission || '');
    const vision = escapeHtml(inst.vision || '');
    const instNav = generateInstitutionalNav();
    const catNav = generateCategoryNav(allProgrammes);
    return `<main>
      <h1>Goshen International Business School (GIBS)</h1>
      <p>${positioning}</p>
      <p><strong>Mission:</strong> ${mission}</p>
      <p><strong>Vision:</strong> ${vision}</p>
      ${instNav}
      ${catNav}
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
       is byte-locked. Retired numbers are filtered out and the current
       official number is appended, using the same shared policy the Contact
       page and the concierge use (src/lib/phones.ts), so the three cannot
       drift apart. */
    const activePhones = activePhoneNumbers(inst.phoneNumbers);
    const phones = activePhones
      .map((n) => `<li><strong>Phone:</strong> <a href="tel:${n}">${escapeHtml(n)}</a></li>`)
      .join('');
    const emails = inst.emails
      .map((e) => `<li><strong>Email:</strong> <a href="mailto:${e}">${escapeHtml(e)}</a></li>`)
      .join('');
    const hubs = inst.overseasHubs
      .filter((h) => /Kigali|Dubai|London|Houston/.test(h))
      .map((h) => `<li>${escapeHtml(h)}</li>`)
      .join('');
    return `<main>
      <h1>Contact GIBS</h1>
      <h2>Postal Address</h2>
      <p>${address}</p>
      <h2>Website</h2>
      <p>${inst.website ? `<a href="${inst.website}">${website}</a>` : website}</p>
      <h2>Phone Numbers</h2>
      <ul>${phones}</ul>
      <h2>Email Addresses</h2>
      <ul>${emails}</ul>
      <h2>Overseas Hubs</h2>
      <ul>${hubs}</ul>
    </main>`;
  }

  if (route === '/executive-education') {
    const hubs = inst.overseasHubs
      .filter((h) => /Kigali|Dubai|London|Houston/.test(h))
      .map((h) => `<li>${escapeHtml(h)}</li>`)
      .join('');
    const partner = escapeHtml(inst.technicalPartner || '');
    const foreignProgrammes = (allProgrammes || []).filter((p) => p.destination !== 'Local');
    const foreignLinks = foreignProgrammes
      .map(
        (p) =>
          `<li><a href="/programmes/${p.slug}">${escapeHtml(p.code)} — ${escapeHtml(p.title)}</a> &middot; ${escapeHtml(p.destination)} Hub &middot; ${escapeHtml(p.fees || '')}</li>`,
      )
      .join('');
    const enquiryHref = '/contact?type=' + encodeURIComponent('Foreign Training Programmes (Kigali, Dubai, London, Houston)');
    return `<main>
      <h1>Foreign Executive Training | GIBS</h1>
      <p>${escapeHtml(inst.positioningStatement || 'GIBS offers executive training programmes across global hubs in Kigali, Dubai, London, and Houston.')} The foreign executive portfolio is delivered in partnership with ${escapeHtml(inst.technicalPartner || '')}; each of the ${foreignProgrammes.length} programmes below links to its schedule and fee.</p>
      <h2>Overseas Training Hubs</h2>
      <ul>${hubs}</ul>
      <p><strong>Technical Partner:</strong> ${partner}</p>
      <h2>Foreign Executive Programmes (${foreignProgrammes.length})</h2>
      <p>Each programme below links to its full detail shell (duration, schedule, fee and target audience):</p>
      <ul>${foreignLinks}</ul>
      <p><strong>Enrolment:</strong> <a href="${enquiryHref}">Enquire about Foreign Executive Training Programmes (Kigali, Dubai, London, Houston)</a>.</p>
    </main>`;
  }

  if (route === '/admissions') {
    return `<main>
      <h1>${escapeHtml('Enquire About a programme.')}</h1>
      <p>${escapeHtml('Discover a programme, make an enquiry, and GIBS handles the rest. Whether you are an individual professional or an organisation enquiring about staff training, our team guides you through the process.')}</p>
    </main>`;
  }

  if (route === '/gallery') {
    return `<main>
      <h1>${escapeHtml('The GIBS campus')}</h1>
      <p>${escapeHtml('Photographs of GIBS headquarters architecture, classroom, reception and guest residence, and the Ibafo facility.')}</p>
    </main>`;
  }

  if (route === '/concierge') {
    return `<main>
      <h1>${escapeHtml('Find the right programme')}</h1>
      <p>${escapeHtml('Ask about the 2026 training catalogue, overseas destinations, training locations or how to enquire.')}</p>
    </main>`;
  }

  if (route === '/privacy-policy') {
    return `<main>
      <h1>Privacy Policy</h1>
      <p>Learn what information you may enter on the GIBS website, how the local programme concierge stores conversation history, and how to ask about your data-protection rights.</p>
    </main>`;
  }

  if (route === '/locations/ilorin') {
    return `<main>
      <h1>Ilorin Training Headquarters | Goshen International Business School</h1>
      <p>The primary administrative and executive training headquarters of Goshen International Business School (GIBS), located in Upper Gaa-Akanbi, Ilorin, Kwara State. Features 12 modern lecture rooms, a 100-seat multi-purpose hall, executive guest accommodation, and sports grounds.</p>
    </main>`;
  }

  if (route === '/locations/abuja') {
    return `<main>
      <h1>Abuja Executive Training Centre | Goshen International Business School</h1>
      <p>Purpose-built executive training facility in FHA Lugbe, Airport Road, Abuja. Strategically positioned for Federal Ministries, Departments, Agencies (MDAs), and corporate organisations across the Federal Capital Territory.</p>
    </main>`;
  }

  if (route === '/locations/ibafo') {
    return `<main>
      <h1>Ibafo Training Centre | Goshen International Business School</h1>
      <p>Executive training centre situated at KM 36 on the Lagos-Ibadan Expressway, serving corporate and public-sector organisations across Lagos, Ogun, and the South-West commercial corridor with dedicated seminar and syndicate rooms.</p>
    </main>`;
  }

  if (route === '/programmes') {
    const desc = escapeHtml(
      'Complete 2026 GIBS Training Calendar: 113 Local Open Programmes and 22 Foreign Executive Training Programmes in Kigali, Dubai, London, and Houston.',
    );
    const catNav = generateCategoryNav(allProgrammes);
    const localCount = (allProgrammes || []).filter((p) => p.destination === 'Local').length;
    const foreignCount = (allProgrammes || []).filter((p) => p.destination !== 'Local').length;
    const programmeLinks = (allProgrammes || [])
      .map((p) => `<li><a href="/programmes/${p.slug}">${escapeHtml(p.code)} — ${escapeHtml(p.title)}</a></li>`)
      .join('');
    return `<main>
      <h1>2026 Training Calendar (135 Programmes) | GIBS</h1>
      <p>${desc}</p>
      <nav aria-label="Breadcrumb">
        <ol>
          <li><a href="/">Home</a></li>
          <li><span>2026 Training Calendar</span></li>
        </ol>
      </nav>
      ${catNav}
      <section>
        <h2>2026 Programme Directory</h2>
        <p>Canonical listing of all ${allProgrammes.length} programmes: ${localCount} Local Open Training and ${foreignCount} Foreign Executive Training programmes. Each link reaches the full programme shell.</p>
        <ul>${programmeLinks}</ul>
      </section>
    </main>`;
  }

  if (catMatch && programme === null) {
    const categorySlug = catMatch[1];
    const catProgrammes = (allProgrammes || []).filter(
      (p) => categoryToSlug(resolveCategory(p, contentByCode)) === categorySlug,
    );
    const catName = (catProgrammes[0] ? resolveCategory(catProgrammes[0], contentByCode) : '') || 'Training Programmes';
    const links = catProgrammes
      .map(
        (p) =>
          `<li><a href="/programmes/${p.slug}">${escapeHtml(p.code)} — ${escapeHtml(p.title)}</a></li>`,
      )
      .join('');
    const instNav = generateInstitutionalNav();
    /* Approved, topic-specific category introduction (status-gated). When no
     * approved intro exists, fall back to the catalogue's generic line. */
    const catIntroRec = contentByCode.categories && contentByCode.categories[catName];
    /* approvedCatIntro holds the RECORD (or null), not its .intro string, so
     * .intro can be read safely below. */
    const approvedCatIntro = (catIntroRec && catIntroRec.status === 'approved' && catIntroRec.intro) ? catIntroRec : null;
    const introHtml = approvedCatIntro
      ? `<p>${escapeHtml(approvedCatIntro.intro)}</p>`
      : `<p>Explore our executive training programmes in ${escapeHtml(catName)} at Goshen International Business School.</p>`;
    return `<main>
      <h1>${escapeHtml(formatCategoryDisplayName(catName))} | Goshen International Business School</h1>
      ${introHtml}
      <nav aria-label="Breadcrumb">
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/programmes">All Programmes</a></li>
          <li><span>${escapeHtml(catName)}</span></li>
        </ol>
      </nav>
      <h2>Programmes in this category</h2>
      <ol>${links}</ol>
      ${instNav}
    </main>`;
  }

  if (progMatch && programme) {
    const code = escapeHtml(programme.code || '');
    const title = escapeHtml(programme.title || '');
    const resolvedCategory = resolveCategory(programme, contentByCode);
    const category = escapeHtml(resolvedCategory || '');
    const catSlug = categoryToSlug(resolvedCategory || '');
    const destination = escapeHtml(programme.destination || 'Local');
    const schedule = escapeHtml(suppressExpiredSchedule(programme.schedule || ''));
    const fees = escapeHtml(programme.fees || '');
    const duration = escapeHtml(programme.duration || '5 Days');
    const targetAudience = escapeHtml(programme.targetAudience || '');
    const isForeign = programme.destination && programme.destination !== 'Local';
    /* Apply the content-layer status gate: only `approved` overrides the locked
     * catalogue values. Unapproved drafts fall back to data.ts exactly, so the
     * published shell is identical to today unless GIBS approves a replacement.
     * Related links only render when approved content supplies them. */
    const resolved = applyContent(programme, contentByCode.programmes);
    const resolvedSummary = suppressExpiredDatesInSummary(resolved.summary);
    const summary = escapeHtml(resolvedSummary || '');
    const outcomes = (resolved.outcomes || []).length
      ? '<h2>Learning Outcomes</h2><ul>' +
        resolved.outcomes.map((o) => `<li>${escapeHtml(o)}</li>`).join('') +
        '</ul>'
      : '';
    const structure = (resolved.structure || []).length
      ? '<h2>Programme Structure</h2><ol>' +
        resolved.structure.map((s) => `<li>${escapeHtml(s)}</li>`).join('') +
        '</ol>'
      : '';
    const faqList = (resolved.faqs || []).length
      ? '<h2>Frequently Asked Questions</h2>' +
        resolved.faqs
          .map(
            (f) =>
              `<div><strong>${escapeHtml(f.q)}</strong><p>${escapeHtml(scrubRetiredNumbersInProse(suppressExpiredFaqAnswer(f.a)))}</p></div>`,
          )
          .join('')
      : '';
    const relatedLinks = (resolved.relatedSlugs || []).length
      ? '<h2>Related Programmes</h2><ul>' +
        resolved.relatedSlugs
          .map((sl) => {
            const related = (allProgrammes || []).find((p) => p.slug === sl);
            const label = related ? `${related.code} — ${related.title}` : sl;
            return `<li><a href="/programmes/${escapeHtml(sl)}">${escapeHtml(label)}</a></li>`;
          })
          .join('') +
        '</ul>'
      : '';
    const enquiryType = isForeign
      ? 'Foreign Training Programmes (Kigali, Dubai, London, Houston)'
      : 'Local Open Training Registration';
    const enquiryHref = `/contact?type=${encodeURIComponent(enquiryType)}&programme=${encodeURIComponent(programme.slug)}`;
    const instNav = generateInstitutionalNav();

    return `<main>
      <h1>${title}</h1>
      <nav aria-label="Breadcrumb">
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/programmes">All Programmes</a></li>
          <li><a href="/programmes/category/${catSlug}">${category}</a></li>
          <li><span>${title}</span></li>
        </ol>
      </nav>
      <p><strong>Code:</strong> ${code}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Location:</strong> ${destination} Training</p>
      <p><strong>Duration:</strong> ${duration}</p>
      <p><strong>Schedule:</strong> ${schedule}</p>
      <p><strong>Tuition Fee:</strong> ${fees}</p>
      <p><strong>Target Audience:</strong> ${targetAudience}</p>
      <p>${summary}</p>
      <p><a href="${enquiryHref}">Enquire About This Programme &rarr;</a></p>
      ${outcomes}
      ${structure}
      ${faqList}
      ${relatedLinks}
      ${instNav}
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

/* ----- Build-manifest modulepreload injection -----
 * For code-split (React.lazy) routes, Vite emits a separate chunk per page.
 * We modulepreload that chunk into the matching static shell so a direct hit
 * hydrates from a chunk already in flight (the shell's HTML is already
 * complete for non-JS clients). Eager pages have no separate chunk, so they
 * resolve to [] and receive no extra hint. */
function findPreloadFile(moduleSuffixes) {
  if (!MANIFEST) return null;
  for (const suffix of moduleSuffixes) {
    for (const [key, entry] of Object.entries(MANIFEST)) {
      if (
        key.endsWith(suffix) &&
        entry &&
        typeof entry.file === 'string' &&
        /\.(m?js|mjs|css)$/.test(entry.file)
      ) {
        return '/' + entry.file;
      }
    }
  }
  return null;
}

// Map a served route to the lazy module(s) whose chunk hydrates its shell.
function moduleSuffixForRoute(route) {
  if (/^\/programmes\/category\//.test(route)) return ['pages/Programmes.tsx'];
  if (/^\/programmes\//.test(route)) return ['pages/ProgrammeDetail.tsx'];
  switch (route) {
    case '/programmes': return ['pages/Programmes.tsx'];
    case '/executive-education': return ['pages/ExecutiveEducation.tsx'];
    case '/admissions': return ['pages/Admissions.tsx'];
    case '/contact': return ['pages/Contact.tsx'];
    case '/concierge': return ['pages/ConciergePage.tsx'];
    default: return [];
  }
}

function injectModulePreload(html, moduleSuffixes) {
  const file = findPreloadFile(moduleSuffixes);
  if (!file) return html;
  const tag = `<link rel="modulepreload" href="${file}">`;
  if (html.includes(tag)) return html;
  // Place after Vite's own modulepreload cluster in <head>; fall back to just
  // before </head> if the entry preload is absent.
  const m = html.match(/(<link rel="modulepreload"[^>]*>\s*)/);
  if (m) return html.replace(m[1], `${m[0]}${tag}`);
  return html.replace('</head>', `  ${tag}\n  </head>`);
}

/* ----- Duration validation gate -----
 * convertDurationToIso only accepts exact 5 Days / 1 Week / 2 Weeks. Recognised
 * ranges (e.g. "1–2 Weeks") are intentionally OMITTED from ISO 8601 rather than
 * fabricated as an exact value. Anything that is non-empty AND neither an exact
 * mapping nor a recognised range is "unknown": it must be reported (and block
 * the build) instead of being silently dropped. */
const EXACT_DURATIONS = new Set(['5 Days', '1 Week', '2 Weeks']);
function classifyDuration(d) {
  if (!d) return 'empty';
  const s = d.trim();
  if (EXACT_DURATIONS.has(s)) return 'exact';
  if (/^\d+[–\-]\d+ (Days|Weeks)$/.test(s)) return 'range';
  return 'unknown';
}
function reportUnknownDurations(programmes) {
  const unknowns = programmes.filter((p) => classifyDuration(p.duration) === 'unknown');
  if (unknowns.length > 0) {
    console.error('seo-gen: refusing to silently omit unknown durations:');
    for (const p of unknowns) {
      console.error(`  - ${p.code} ("${p.duration}"): "${p.title}"`);
    }
    throw new Error(
      unknowns.length + ' programme(s) have durations that are neither an exact ISO ' +
      'mapping nor a recognised range. Add an exact case to convertDurationToIso, ' +
      'or confirm the range pattern, before omitting. Refusing to fabricate.'
    );
  }
  console.log('Duration gate passed: ' + programmes.length + ' programmes scanned; no unknown durations.');
}

function generateShell(masterHtml, route, meta, staticBody, jsonLd = '') {
  let html = masterHtml;
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  html = replaceMetaContent(html, 'description', meta.description);
  html = html.replace(/<link rel="canonical" href=".*?"\s*\/?>/,
    `<link rel="canonical" href="${CANONICAL_DOMAIN}${route}" />`);
  html = replaceMetaContent(html, 'og:title', meta.title);
  html = replaceMetaContent(html, 'twitter:title', meta.title);
  html = replaceMetaContent(html, 'twitter:description', meta.description);
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
  if (jsonLd) {
    // Replace existing empty JSON-LD tags or inject a new one if missing
    if (html.includes('<script type="application/ld+json"></script>')) {
      html = html.replace('<script type="application/ld+json"></script>', `<script type="application/ld+json">${jsonLd}</script>`);
    } else if (html.includes('<script type="application/ld+json">')) {
       // Handle partially closed tags
       html = html.replace(/<script type="application\/ld\+json">.*?<\/script>/is, `<script type="application/ld+json">${jsonLd}</script>`);
    } else {
      html = html.replace('</head>', `  <script type="application/ld+json">${jsonLd}</script>\n  </head>`);
    }
  }
  if (staticBody) {
    html = html.replace('<div id="root"></div>', `<div id="root">${staticBody}</div>`);
  }
  // Modulepreload the lazy chunk that hydrates this shell (if any).
  html = injectModulePreload(html, moduleSuffixForRoute(route));
  return html;
}

function normalizeAssetUrls(html) {
  // Restore root-relative paths for fonts, favicon, icon images, and assets.
  // For deep route shells (e.g. /programmes/category/:slug and /programmes/:slug),
  // root-relative paths ensure assets resolve correctly from any nesting level.
  return html
    .replaceAll('href="./fonts/', 'href="/fonts/')
    .replaceAll('url(./fonts/', 'url(/fonts/')
    .replaceAll('href="./favicon.ico"', 'href="/favicon.ico"')
    .replaceAll('href="./images/', 'href="/images/')
    .replaceAll('src="./images/', 'src="/images/')
    .replaceAll('href="./assets/', 'href="/assets/')
    .replaceAll('src="./assets/', 'src="/assets/');
}

function writeShell(route, shellHtml) {
  const dir = path.join(DIST_DIR, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), shellHtml);
}

async function run() {
  try {
    console.log('Starting SEO Shell Generation...');
    if (!fs.existsSync(MASTER_SHELL_PATH)) throw new Error('Master shell not found. Run npm run build first.');

    let masterHtml;
    const currentMaster = fs.readFileSync(MASTER_SHELL_PATH, 'utf8');

    // The master shell (dist/index.html) is contaminated if it already contains a static body.
    // A clean Vite shell has <div id="root"></div>.
    const isContaminated = currentMaster.includes('<div id="root"><main>');

    if (isContaminated) {
      if (!fs.existsSync(CLEAN_TEMPLATE_PATH)) {
        throw new Error('Master shell is contaminated and no backup exists. Run npm run build to reset.');
      }
      masterHtml = fs.readFileSync(CLEAN_TEMPLATE_PATH, 'utf8');
      console.log('Using cached clean template from .master-template.html');
    } else {
      masterHtml = currentMaster;
      fs.writeFileSync(CLEAN_TEMPLATE_PATH, masterHtml);
      console.log('Detected clean master shell; saved to .master-template.html');
    }

    masterHtml = normalizeAssetUrls(masterHtml);
    // We no longer write normalized masterHtml back to MASTER_SHELL_PATH here
    // to avoid contaminating the clean shell before we can back it up.

    // Validate that all referenced fonts exist on disk
    let cssContent = '';
    const assetsDir = path.join(DIST_DIR, 'assets');
    if (fs.existsSync(assetsDir)) {
      for (const file of fs.readdirSync(assetsDir)) {
        if (file.endsWith('.css')) {
          cssContent += fs.readFileSync(path.join(assetsDir, file), 'utf8');
        }
      }
    }
    const fontMatches = (masterHtml + cssContent).matchAll(/(?:href|url)\(["']?\/fonts\/([^"')\s]+)["']?\)/g);
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

    const contentByCode = {
      programmes: extractProgrammeContent(),
      categories: extractCategoryIntros(),
      corrections: extractCategoryCorrections(),
    };
    const approvedProgCount = Object.values(contentByCode.programmes).filter((c) => c.status === 'approved').length;
    const approvedCatCount = Object.values(contentByCode.categories).filter((c) => c.status === 'approved').length;
    const correctionCount = Object.keys(contentByCode.corrections).length;
    console.log(`Loaded content layer: ${Object.keys(contentByCode.programmes).length} programme entries (${approvedProgCount} approved), ${Object.keys(contentByCode.categories).length} category intros (${approvedCatCount} approved), ${correctionCount} category corrections (${APPLY_CATEGORY_CORRECTIONS ? 'APPLIED (operator gate ON)' : 'pending — gate OFF'}).`);

    const inst = extractInstitutionalData();
    console.log(`Extracted institutional metadata ${inst.website ? 'OK' : '(partial)'}.`);

    // Load the Vite build manifest so each static shell can modulepreload the
    // exact lazy chunk that hydrates it.
const manifestPath = path.join(DIST_DIR, '.vite', 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      try {
        MANIFEST = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        console.log(`Loaded build manifest (${Object.keys(MANIFEST).length} module entries).`);
      } catch (e) {
        console.warn('seo-gen: manifest.json present but unparseable; skipping modulepreload injection.');
      }
    } else {
      console.warn('seo-gen: dist/manifest.json not found; skipping modulepreload injection (run a fresh vite build first).');
    }

    // Fail fast on any duration that cannot be classified (exact or range)
    // rather than silently omitting it from structured data.
    reportUnknownDurations(programmes);

    const routes = [];

    // Phase 1: Build all programme routes with metadata (no shell generation yet)
const programmeRoutes = [];
for (const p of programmes) {
  const route = `/programmes/${p.slug}`;
  /* Resolved narrative: only `approved` content overrides the locked
   * catalogue; the meta description and Course JSON-LD description must
   * match the rendered body, so both are fed from the same resolved copy. */
  const resolved = applyContent(p, contentByCode);
  const resolvedSummary = suppressExpiredDatesInSummary(resolved.summary);
  const description = programmeMetaDescription(resolvedSummary);
  const title = programmeTitle(p);
  programmeRoutes.push({ path: route, meta: { title, description }, programme: p });
}

// Phase 2: Fix duplicate descriptions across programme pages by adding
// category information to disambiguate them.
const descCounts = {};
programmeRoutes.forEach(r => {
  const desc = r.meta.description;
  descCounts[desc] = (descCounts[desc] || 0) + 1;
});
programmeRoutes.forEach(route => {
  const desc = route.meta.description;
  if (descCounts[desc] > 1) {
    const p = route.programme;
    const category = resolveCategory(p, contentByCode);
    const combined = `${desc} Category: ${category}.`;
    route.meta.description = combined.length > 159 ? `${combined.slice(0, 156)}...` : combined;
    p.summary = combined.length > 159 ? `${combined.slice(0, 156)}...` : combined;
  }
});

// Phase 3: Generate shells for all programme routes
for (const route of programmeRoutes) {
  const p = route.programme;
  const resolvedSummary = route.meta.description;
  const description = resolvedSummary;
  const title = programmeTitle(p);

  const courseJson = getCourseSchema({ ...p, summary: resolvedSummary });
  const resolvedCategory = resolveCategory(p, contentByCode);
  const breadcrumbsJson = getBreadcrumbSchema([
    { name: 'Home', url: CANONICAL_DOMAIN },
    { name: 'All Programmes', url: `${CANONICAL_DOMAIN}/programmes` },
    { name: resolvedCategory, url: `${CANONICAL_DOMAIN}/programmes/category/${categoryToSlug(resolvedCategory)}` },
    { name: p.title, url: `${CANONICAL_DOMAIN}${route.path}` }
  ]);
  const webPageJson = getWebPageSchema({ title, description: route.meta.description, url: `${CANONICAL_DOMAIN}${route.path}` });
  const combinedJsonLd = `[${courseJson}, ${breadcrumbsJson}, ${webPageJson}]`;
  const shellHtml = generateShell(masterHtml, route.path, { title, description: route.meta.description }, generateStaticBody(route.path, p, contentByCode, inst, programmes), combinedJsonLd);
  writeShell(route.path, shellHtml);
}

// Add programme routes to main routes array for sitemap generation
routes.push(...programmeRoutes);


    // 2. Institutional
    const instRoutes = [
      { path: '/programmes', title: '2026 Training Calendar (135 Programmes) | Goshen International Business School', desc: 'Complete 2026 GIBS Training Calendar: 113 Local Open Programmes and 22 Foreign Executive Programmes.' },
      { path: '/about', title: 'About Us | Goshen International Business School (RC 1178333)', desc: 'Learn about our mission, vision, governing council, accreditations, and training centres.' },
      { path: '/contact', title: 'Contact Us | Goshen International Business School', desc: 'Get in touch with GIBS for programme registration, in-plant training, and campus visits.' },
      { path: '/admissions', title: 'Programme Enquiries — Goshen International Business School', desc: 'The GIBS programme enquiry process: browse the 2026 calendar, make an enquiry, and GIBS handles the rest.' },
      { path: '/executive-education', title: 'Foreign Executive Training | Goshen International Business School', desc: 'Global training hubs in Kigali, Dubai, London and Houston.' },
      { path: '/gallery', title: 'Campus & Facility Gallery — GIBS', desc: 'Photographs of GIBS headquarters architecture, training rooms, guest residence and the Ibafo facility.' },
      { path: '/concierge', title: 'GIBS Programme Assistant — Ask about programmes & locations', desc: 'Ask the GIBS Programme Assistant about our 135 2026 executive training programmes, overseas locations, and how to enquire.' },
      { path: '/privacy-policy', title: 'Privacy Policy | Goshen International Business School', desc: 'Learn how GIBS handles your information, stores concierge history, and your data-protection rights.' },
    ];
    for (const r of instRoutes) {
      const boundedTitle = r.title.length <= 120 ? r.title : programmeTitle(r.title);
      routes.push({ path: r.path, meta: { title: boundedTitle, description: r.desc }});

      const breadcrumbsJson = getBreadcrumbSchema([
        { name: 'Home', url: CANONICAL_DOMAIN },
        { name: r.title.split('|')[0].trim(), url: `${CANONICAL_DOMAIN}${r.path}` }
      ]);
      const webPageJson = getWebPageSchema({ title: boundedTitle, description: r.desc, url: `${CANONICAL_DOMAIN}${r.path}` });
      const combinedJsonLd = `[${breadcrumbsJson}, ${webPageJson}]`;
      const shellHtml = generateShell(masterHtml, r.path, { title: boundedTitle, description: r.desc }, generateStaticBody(r.path, null, contentByCode, inst, programmes), combinedJsonLd);
      writeShell(r.path, shellHtml);
    }

    // 2.5. Dedicated Physical Locations
    const locationRoutes = [
      {
        path: '/locations/ilorin',
        slug: 'ilorin',
        name: 'Ilorin Training Headquarters',
        shortName: 'Ilorin Headquarters',
        title: 'Ilorin Training Headquarters | Goshen International Business School',
        desc: 'Official training headquarters of Goshen International Business School (GIBS) in Ilorin, Kwara State. Features 12 lecture rooms, 100-seat hall, and lodge.',
        address: 'No 81, Olorunsogo Street, Off Agbabiaka Road, Upper Gaa - Akanbi',
        city: 'Ilorin',
        state: 'Kwara State',
        telephone: '+2348160010401'
      },
      {
        path: '/locations/abuja',
        slug: 'abuja',
        name: 'Abuja Executive Training Centre',
        shortName: 'Abuja Centre',
        title: 'Abuja Executive Training Centre | Goshen International Business School',
        desc: 'Executive training centre for Goshen International Business School (GIBS) in Lugbe, Airport Road, Abuja. Features 2 conference halls and 7 lecture rooms.',
        address: 'Plot 194, Lugbe 1 Layout, Near Okay Centre, Direct Behind Rainoil filling station, FHA Lugbe, Airport Road',
        city: 'Abuja',
        state: 'Federal Capital Territory',
        telephone: '+2348160010401'
      },
      {
        path: '/locations/ibafo',
        slug: 'ibafo',
        name: 'Ibafo Training Centre',
        shortName: 'Ibafo Centre',
        title: 'Ibafo Training Centre | Goshen International Business School',
        desc: 'GIBS executive training centre at KM 36 Lagos-Ibadan Expressway, Ibafo, Ogun State. Features executive conference hall, lecture halls, and syndicate rooms.',
        address: 'KM 36, Lagos - Ibadan Express Road, Adjacent Dap-Mude Hotel, Behind World Oil Station',
        city: 'Ibafo',
        state: 'Ogun State',
        telephone: '+2348160010401'
      }
    ];

    for (const loc of locationRoutes) {
      routes.push({ path: loc.path, meta: { title: loc.title, description: loc.desc } });

      const breadcrumbsJson = getBreadcrumbSchema([
        { name: 'Home', url: CANONICAL_DOMAIN },
        { name: 'Campuses & Facilities', url: `${CANONICAL_DOMAIN}/contact` },
        { name: loc.shortName, url: `${CANONICAL_DOMAIN}${loc.path}` }
      ]);
      const webPageJson = getWebPageSchema({ title: loc.title, description: loc.desc, url: `${CANONICAL_DOMAIN}${loc.path}` });
      const locSchema = getLocationSchema(loc);
      const combinedJsonLd = `[${locSchema}, ${breadcrumbsJson}, ${webPageJson}]`;
      const shellHtml = generateShell(masterHtml, loc.path, { title: loc.title, description: loc.desc }, generateStaticBody(loc.path, null, contentByCode, inst, programmes), combinedJsonLd);
      writeShell(loc.path, shellHtml);
    }


    // 3. Categories
    const categories = [...new Set(programmes.map((p) => resolveCategory(p, contentByCode)))];
    const seenCategorySlugs = new Set();
    for (const cat of categories) {
      const slug = categoryToSlug(cat);
      if (seenCategorySlugs.has(slug)) {
        throw new Error(`Category slug collision detected for "${cat}": "${slug}" is already used.`);
      }
      seenCategorySlugs.add(slug);

      const route = `/programmes/category/${slug}`;
      const catDisplayName = formatCategoryDisplayName(cat);
      const catTitle = `${catDisplayName} | Goshen International Business School`;

      const catIntroRec = contentByCode.categories && contentByCode.categories[cat];
      const catDescription = (catIntroRec && catIntroRec.status === 'approved' && catIntroRec.intro)
        ? programmeMetaDescription(catIntroRec.intro)
        : `Explore executive training programmes in ${cat} at Goshen International Business School.`;

      routes.push({ path: route, meta: { title: catTitle, description: catDescription }});

      const breadcrumbsJson = getBreadcrumbSchema([
        { name: 'Home', url: CANONICAL_DOMAIN },
        { name: 'All Programmes', url: `${CANONICAL_DOMAIN}/programmes` },
        { name: cat, url: `${CANONICAL_DOMAIN}${route}` }
      ]);
      const webPageJson = getWebPageSchema({ title: catTitle, description: catDescription, url: `${CANONICAL_DOMAIN}${route}` });
      let combinedJsonLd = `[${breadcrumbsJson}, ${webPageJson}]`;
      const catProgrammes = programmes.filter((p) => resolveCategory(p, contentByCode) === cat);
      if (catProgrammes.length >= 3) {
        const listJson = getCourseListSchema(catProgrammes, `${CANONICAL_DOMAIN}${route}`);
        combinedJsonLd = `[${breadcrumbsJson}, ${listJson}, ${webPageJson}]`;
      }

      const shellHtml = generateShell(masterHtml, route, { title: catTitle, description: catDescription }, generateStaticBody(route, null, contentByCode, inst, programmes), combinedJsonLd);
      writeShell(route, shellHtml);
    }


    // 4. Sitemap
    const sitemapEntries = routes.map(r => `  <url>\n    <loc>${escapeHtml(CANONICAL_DOMAIN + r.path)}</loc>\n  </url>`).join('\n');
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${CANONICAL_DOMAIN}/</loc>\n  </url>\n${sitemapEntries}\n</urlset>`;
    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml);

    // 5. Generate llms.txt and .well-known/llms.txt
    const llmsContent = generateLlmsTxt(inst, programmes, contentByCode);
    fs.writeFileSync(path.join(DIST_DIR, 'llms.txt'), llmsContent);
    const wellKnownDir = path.join(DIST_DIR, '.well-known');
    fs.mkdirSync(wellKnownDir, { recursive: true });
    fs.writeFileSync(path.join(wellKnownDir, 'llms.txt'), llmsContent);

    // Also persist in public/ directory so it stays in source control and Vite build
    const publicDir = path.resolve('public');
    if (fs.existsSync(publicDir)) {
      fs.writeFileSync(path.join(publicDir, 'llms.txt'), llmsContent);
      const publicWellKnown = path.join(publicDir, '.well-known');
      fs.mkdirSync(publicWellKnown, { recursive: true });
      fs.writeFileSync(path.join(publicWellKnown, 'llms.txt'), llmsContent);
    }

    // 6. Inject homepage-specific hero image preload into master shell (dist/index.html)
    // Preloads the exact responsive image selected by src/sections/Hero.tsx without leaking to other routes.
    const hero640Path = path.join(DIST_DIR, 'images', 'gibs-hero-branded-640.webp');
    const hero1050Path = path.join(DIST_DIR, 'images', 'gibs-hero-branded.webp');
    if (!fs.existsSync(hero640Path) || !fs.existsSync(hero1050Path)) {
      throw new Error('Referenced hero image files do not exist in dist/images/');
    }
    const heroPreloadTag = '<link rel="preload" as="image" href="/images/gibs-hero-branded.webp" imagesrcset="/images/gibs-hero-branded-640.webp 640w, /images/gibs-hero-branded.webp 1050w" imagesizes="100vw" fetchpriority="high" />';

    // Inject static body content into the homepage for non-JS crawlers
    const homepageStaticBody = generateStaticBody('/', null, contentByCode, inst, programmes);
    if (homepageStaticBody) {
      let homeHtml = masterHtml;
      homeHtml = homeHtml.replace('<div id="root"></div>', `<div id="root">${homepageStaticBody}</div>`);

      // FIX: The homepage (dist/index.html) uses a different meta description source than institutional routes.
      // We must explicitly ensure its metadata is bounded.
      const homeDesc = 'Goshen International Business School Limited — 113 Local Open Programmes and 22 Foreign Executive Training Programmes across Kigali, Dubai, London, and Houston. Registered with the Corporate Affairs Commission (CAC), RC 1178333.';
      const homeTitle = 'GIBS 2026 Executive Training — Goshen International Business School';
      // Explicitly set the homepage <title> to match og:title so static HTML
      // and runtime metadata are consistent. The Vite master shell's default
      // title is replaced here; useSeo() at runtime sets the same value.
      homeHtml = homeHtml.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(homeTitle)}</title>`);
      homeHtml = replaceMetaContent(homeHtml, 'description', programmeMetaDescription(homeDesc));
      homeHtml = replaceMetaContent(homeHtml, 'og:description', programmeMetaDescription(homeDesc));
      homeHtml = replaceMetaContent(homeHtml, 'twitter:description', programmeMetaDescription(homeDesc));

      // Use a bounded title that preserves the brand identity without triggering the programme-specific helper's logic
      // OG titles can be up to ~120 chars; no truncation needed when the value fits.
      homeHtml = replaceMetaContent(homeHtml, 'og:title', homeTitle);
      homeHtml = replaceMetaContent(homeHtml, 'twitter:title', homeTitle);

      // Inject homepage-specific hero image preload
      if (!homeHtml.includes('href="/images/gibs-hero-branded.webp"')) {
        homeHtml = homeHtml.replace('</head>', `  ${heroPreloadTag}\n  </head>`);
      }

      // Modulepreload the lazy homepage ProgrammeDiscovery (catalogue) section
      // chunk so the director hydrates from a chunk already in flight.
      homeHtml = injectModulePreload(homeHtml, ['sections/Programs.tsx']);

      const orgSchema = getOrgSchema(inst);
      const webSiteSchema = getWebSiteSchema();
      const webPageJson = getWebPageSchema({ title: homeTitle, description: homeDesc, url: CANONICAL_DOMAIN });
      const breadcrumbSchema = getBreadcrumbSchema([
        { name: 'Home', url: CANONICAL_DOMAIN }
      ]);
      const combinedSchema = `[${orgSchema}, ${webSiteSchema}, ${webPageJson}, ${breadcrumbSchema}]`;
      if (homeHtml.includes('<script type="application/ld+json"></script>')) {
        homeHtml = homeHtml.replace('<script type="application/ld+json"></script>', `<script type="application/ld+json">${combinedSchema}</script>`);
      } else if (homeHtml.includes('<script type="application/ld+json">')) {
        homeHtml = homeHtml.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/is, `<script type="application/ld+json">${combinedSchema}</script>`);
      } else {
        homeHtml = homeHtml.replace('</head>', `  <script type="application/ld+json">${combinedSchema}</script>\n  </head>`);
      }



      fs.writeFileSync(MASTER_SHELL_PATH, homeHtml);
      console.log('Injected static body content and bounded metadata into dist/index.html (homepage)');
    }

    console.log(`SUCCESS: Generated ${routes.length} shells and sitemap.xml`);
  } catch (err) {
    console.error('SEO Generation failed:', err);
    process.exit(1);
  }
}

run();
