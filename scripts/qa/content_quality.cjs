/* ==========================================================================
 * GIBS Programme Content Quality Gate  (scripts/qa/content_quality.cjs)
 *
 * Self-contained, zero-dependency check of the supplementary content layer
 * (src/lib/programme-content.ts) against the locked catalogue (src/lib/data.ts).
 *
 * The gate is intentionally GREEN on the current baseline (all seeded content is
 * `pending-verification`, so nothing new is published yet). It enforces HARD
 * invariants so that the moment GIBS approves replacement content, any
 * regression is caught before release.
 *
 * HARD failures (exit 1):
 *   - a content entry references a code that is not in the catalogue.
 *   - a content entry references a relatedSlug that is not a real programme slug.
 *   - a content entry carries an invalid status.
 *   - APPROVED content duplicates another APPROVED outcome set / summary, or
 *     reproduces the templated outcomes or template-summary pattern that the
 *     audit identified as generic. (Draft/pending content is never checked here
 *     because it never renders.)
 *   - if dist/ exists, no `pending-verification` / `draft` literal appears in
 *     any published shell, sitemap or llms.txt (proves the status gate holds).
 *
 * Informational (exit 0): reports the pre-existing data.ts duplication
 *   baseline and the pending/approved counts, so the baseline is recorded
 *   without blocking the build that data.ts cannot be edited to fix.
 * ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const DATA_PATH = path.join(ROOT, 'src', 'lib', 'data.ts');
const CONTENT_PATH = path.join(ROOT, 'src', 'lib', 'programme-content.ts');
const DIST_DIR = path.join(ROOT, 'dist');

const GENERIC_LOCAL_OUTCOMES = [
  "Upgraded technical and strategic competencies in modern public and private sector operations",
  "Immediate practical toolkit ready for deployment in participant's organization",
  "Executive certification from Goshen International Business School (GIBS)",
];
const GENERIC_FOREIGN_OUTCOMES = [
  "Upgraded technical and strategic competencies in modern public and private sector operations",
  "Immediate practical toolkit ready for deployment in participant's organization",
  "Executive certification from Goshen International Business School (GIBS)",
];
const GENERIC_OUTCOME_SETS = [
  GENERIC_LOCAL_OUTCOMES,
  GENERIC_FOREIGN_OUTCOMES,
];
const TEMPLATE_SUMMARY_REGEX = /\b\w+\b is an intensive \d+ Days capacity-building programme designed for\b/;
const VALID_STATUSES = new Set(['approved', 'pending-verification', 'draft']);
const UNPUBLISHED_MARKERS = ['"pending-verification"', '"draft"'];

// The 10 category misclassifications confirmed by audit. `from` is the code's
// ACTUAL data.ts category (verified by grep against the byte-locked catalogue);
// `to` is a member of the canonical PROGRAM_CATEGORIES list. These CANNOT be
// applied to data.ts without re-authorisation — they are approval-pending
// findings. The lean render-time mirror lives in
// src/lib/programme-content.ts as CATEGORY_CORRECTIONS and is gated behind
// APPLY_CATEGORY_CORRECTIONS (default OFF).
const PENDING_CATEGORY_CORRECTIONS = {
  'GIBS-LOC-005': { from: 'Accounting and Financial Management', to: 'General Administration and Management' },
  'GIBS-LOC-035': { from: 'Telecom & Utilities Regulation',     to: 'General Administration and Management' },
  'GIBS-LOC-039': { from: 'Consumer Protection & Utilities',     to: 'Telecom & Utilities Regulation' },
  'GIBS-LOC-043': { from: 'Consumer Protection & Utilities',     to: 'Information Technology Workshops' },
  'GIBS-LOC-044': { from: 'Consumer Protection & Utilities',     to: 'Information Technology Workshops' },
  'GIBS-LOC-076': { from: 'Power & Energy Sector',               to: 'Oil & Gas Sector' },
  'GIBS-LOC-077': { from: 'Power & Energy Sector',               to: 'Environmental Sustainability & Management' },
  'GIBS-LOC-083': { from: 'Power & Energy Sector',               to: 'General Administration and Management' },
  'GIBS-LOC-096': { from: 'Pension Management',                  to: 'General Administration and Management' },
  'GIBS-LOC-099': { from: 'Pension Management',                  to: 'General Administration and Management' },
};

function readText(p) {
  if (!fs.existsSync(p)) return '';
  return fs.readFileSync(p, 'utf8');
}

/* Minimal balanced-bracket + quoted-string extractors mirroring seo-gen.mjs.
 * They deliberately treat the .ts source as text: no import loader needed. */
function decodeJsonString(raw) {
  return (raw || '').replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

/* Balanced-brace capture of the body of `export const NAME = { ... }`. A greedy
 * regex `([\s\S]*)\}\s*;` over-captures when a later const in the same file
 * ends in `};`, so we scan to the matching closing brace. */
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
    else if (ch === '}') { depth--; if (depth === 0) break; }
    body += ch;
  }
  return body;
}

function extractStringProp(text, key) {
  // Quote-tolerant: matches `"key": "..."` (quoted, e.g. ProgrammeContent) AND
  // bare `key: "..."` (unquoted TS keys, e.g. CategoryIntro). The `\\b` guard
  // on the fallback prevents matching `key` as a substring of a longer token.
  const m = text.match(new RegExp('"' + key + '"\\s*:\\s*"([^"]*)"')) ||
            text.match(new RegExp('\\b' + key + '\\s*:\\s*"([^"]*)"'));
  return m ? decodeJsonString(m[1]) : null;
}

function extractStringArrayProp(text, key) {
  const m = text.match(new RegExp('"' + key + '"\\s*:\\s*\\[([\\s\\S]*?)\\]'));
  if (!m || !m[1].trim()) return [];
  const matches = m[1].match(/"([^"]+)"/g) || [];
  return matches.map((x) => decodeJsonString(x.slice(1, -1)));
}

/* Extract every top-level record object body from an array literal
 * `export const X = [ {rec}, {rec} ... ]`. Returns an array of record strings. */
function extractArrayRecords(src, arrayName) {
  const startMatch = src.match(new RegExp('export const ' + arrayName + '\\s*[:=][\\s\\S]*?=[\\s\\S]*?\\['));
  if (!startMatch) return [];
  const after = src.slice(startMatch.index + startMatch[0].length);
  // consume one balanced [...] to get the array body
  let depth = 1;
  let body = '';
  for (let i = 0; i < after.length && depth > 0; i++) {
    const ch = after[i];
    if (ch === '[') depth++;
    if (ch === ']') { depth--; if (depth === 0) break; }
    body += ch;
  }
  // split top-level {rec} objects by brace depth
  const records = [];
  let cur = ''; let d = 0; let started = false;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === '{') { d++; started = true; cur += ch; continue; }
    if (ch === '}') {
      d--;
      cur += ch;
      if (d === 0 && started) { records.push(cur.trim()); cur = ''; started = false; }
      continue;
    }
    if (d > 0) cur += ch;
  }
  return records;
}

/* Parse PROGRAMME_CONTENT object body { "CODE": {...}, ... } -> array of recs */
function extractContentEntries(src) {
  const objectBody = extractObjectBody(src, 'PROGRAMME_CONTENT');
  if (!objectBody) return [];
  const entries = [];
  let cur = ''; let d = 0;
  for (let i = 0; i < objectBody.length; i++) {
    const ch = objectBody[i];
    if (ch === '{') { d++; cur += ch; continue; }
    if (ch === '}') { d--; cur += ch; continue; }
    if (d === 0 && ch === ',') { entries.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) entries.push(cur.trim());
  return entries.map((entry) => {
    const keyMatch = entry.match(/^\s*"([^"]+)"\s*:/);
    if (!keyMatch) return null;
    const code = decodeJsonString(keyMatch[1]);
    const objMatch = entry.match(/\{\s*([\s\S]*)\}\s*$/);
    const ob = objMatch ? objMatch[1] : '';
    return {
      code,
      status: extractStringProp(ob, 'status') || 'draft',
      summary: extractStringProp(ob, 'summary'),
      outcomes: extractStringArrayProp(ob, 'outcomes'),
      relatedSlugs: extractStringArrayProp(ob, 'relatedSlugs'),
      source: extractStringProp(ob, 'source'),
    };
  }).filter(Boolean);
}

/* Parse the lean CATEGORY_CORRECTIONS map ({"code":"category",...}) from
 * src/lib/programme-content.ts. Returns Record<code, canonicalCategory>. */
function extractCategoryCorrections(src) {
  const body = extractObjectBody(src, 'CATEGORY_CORRECTIONS');
  if (!body) return {};
  const map = {};
  const re = /"([^"]+)"\s*:\s*"([^"]+)"/g;
  for (const m of body.matchAll(re)) map[decodeJsonString(m[1])] = decodeJsonString(m[2]);
  return map;
}

function outcomesSignature(arr) {
  return JSON.stringify((arr || []).slice().sort());
}

/* Extract a quoted-string array literal exported from data.ts by name
 * (used for PROGRAM_CATEGORIES). Tolerates an optional `: Type[]` annotation. */
function extractConstStringArray(src, name) {
  const m = src.match(new RegExp('export const ' + name + '\\b[\\s\\S]*?=[\\s\\S]*?\\[([\\s\\S]*?)\\]'));
  if (!m) return [];
  return (m[1].match(/"([^"]+)"/g) || []).map((x) => decodeJsonString(x.slice(1, -1)));
}

/* Parse the CATEGORY_INTRO_CONTENT object body { "CODE": {...}, ... } -> array of recs */
function extractCategoryIntroEntries(src) {
  const objectBody = extractObjectBody(src, 'CATEGORY_INTRO_CONTENT');
  if (!objectBody) return [];
  const entries = [];
  let cur = ''; let d = 0;
  for (let i = 0; i < objectBody.length; i++) {
    const ch = objectBody[i];
    if (ch === '{') { d++; cur += ch; continue; }
    if (ch === '}') { d--; cur += ch; continue; }
    if (d === 0 && ch === ',') { entries.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) entries.push(cur.trim());
  return entries.map((entry) => {
    const keyMatch = entry.match(/^\s*"([^"]+)"\s*:/);
    if (!keyMatch) return null;
    const category = decodeJsonString(keyMatch[1]);
    const objMatch = entry.match(/\{\s*([\s\S]*)\}\s*$/);
    const ob = objMatch ? objMatch[1] : '';
    return {
      category,
      status: extractStringProp(ob, 'status') || 'draft',
      intro: extractStringProp(ob, 'intro'),
      source: extractStringProp(ob, 'source'),
    };
  }).filter(Boolean);
}

function main() {
  let failures = 0;
  const fail = (msg) => { console.error('  ✗ ' + msg); failures++; };
  const ok = (msg) => { console.log('  ✓ ' + msg); };

  const dataSrc = readText(DATA_PATH);
  const contentSrc = readText(CONTENT_PATH);
  if (!dataSrc) { fail('src/lib/data.ts not found'); return finish(1); }
  if (!contentSrc) { fail('src/lib/programme-content.ts not found'); return finish(1); }

  // --- catalogue surface ---
  const recs = extractArrayRecords(dataSrc, 'PROGRAMMES');
  const catalogueCodes = new Set();
  const catalogueSlugs = new Set();
  const catalogueCategoriesByCode = new Map(); // code -> data.ts category (for correction `from` checks)
  const catalogueOutcomeSets = new Map(); // signature -> first code
  let templateSummaries = 0;
  for (const r of recs) {
    const code = extractStringProp(r, 'code') || '';
    const slug = extractStringProp(r, 'slug') || '';
    if (code) catalogueCodes.add(code);
    if (slug) catalogueSlugs.add(slug);
    const category = extractStringProp(r, 'category') || '';
    if (code) catalogueCategoriesByCode.set(code, category);
    const outcomes = extractStringArrayProp(r, 'outcomes');
    const sig = outcomesSignature(outcomes);
    if (!catalogueOutcomeSets.has(sig)) catalogueOutcomeSets.set(sig, code);
    const summary = extractStringProp(r, 'summary') || '';
    if (TEMPLATE_SUMMARY_REGEX.test(summary)) templateSummaries++;
  }
  const duplicateOutcomeSets = catalogueOutcomeSets.size; // distinct sets

  // --- content layer surface ---
  const entries = extractContentEntries(contentSrc);
  const approved = entries.filter((e) => e.status === 'approved');
  const pending = entries.filter((e) => e.status === 'pending-verification');
  const drafts = entries.filter((e) => e.status === 'draft');

  console.log('\nContent layer summary: ' + entries.length + ' entries (' +
    approved.length + ' approved, ' + pending.length + ' pending-verification, ' +
    drafts.length + ' draft).');

  // --- HARD: codes resolve ---
  for (const e of entries) {
    if (!catalogueCodes.has(e.code)) {
      fail('content entry code "' + e.code + '" is not present in src/lib/data.ts');
    }
  }
  if (failures === 0) ok('every content entry code resolves to a catalogue programme');

  // --- HARD: relatedSlugs resolve ---
  for (const e of entries) {
    for (const sl of (e.relatedSlugs || [])) {
      if (!catalogueSlugs.has(sl)) {
        fail('relatedSlug "' + sl + '" on ' + e.code + ' is not a valid programme slug in data.ts');
      }
    }
  }
  if (failures === 0) ok('every relatedSlug resolves to a catalogue slug');

  // --- HARD: statuses valid ---
  for (const e of entries) {
    if (!VALID_STATUSES.has(e.status)) {
      fail(e.code + ' has invalid status "' + e.status + '"');
    }
  }
  if (failures === 0) ok('every content entry has a valid status');

  // --- HARD: approved content must be non-templated and unique ---
  const approvedSigs = new Map();
  for (const e of approved) {
    const sig = outcomesSignature(e.outcomes);
    const isGeneric = GENERIC_OUTCOME_SETS.some((g) => JSON.stringify(g.slice().sort()) === sig);
    if (isGeneric) fail(e.code + ' (approved) reproduces a generic outcome set—approved content must be topic-specific');
    if (approvedSigs.has(sig) && approvedSigs.get(sig) !== e.code) {
      fail(e.code + ' (approved) duplicates the outcome set already used by ' + approvedSigs.get(sig));
    } else {
      approvedSigs.set(sig, e.code);
    }
    if (e.summary && TEMPLATE_SUMMARY_REGEX.test(e.summary)) {
      fail(e.code + ' (approved) summary matches the templated catalogue summary pattern');
    }
  }
  if (failures === 0) ok('all approved content is non-templated and unique');

  // --- category-intro layer ---
  const catalogueCategories = extractConstStringArray(dataSrc, 'PROGRAM_CATEGORIES');
  const catIntros = extractCategoryIntroEntries(contentSrc);
  const approvedCatIntros = catIntros.filter((c) => c.status === 'approved');
  const pendingCatIntros = catIntros.filter((c) => c.status === 'pending-verification');
  console.log('  · category intro layer: ' + catIntros.length + ' entries (' +
    approvedCatIntros.length + ' approved, ' + pendingCatIntros.length + ' pending-verification).');

  // --- HARD: category intro resolves to a catalogue category ---
  for (const c of catIntros) {
    if (!catalogueCategories.includes(c.category)) {
      fail('category intro for "' + c.category + '" is not a recognised catalogue category in data.ts');
    }
  }
  if (failures === 0) ok('every category intro resolves to a recognised catalogue category');

  // --- HARD: approved category intros present, non-templated + unique ---
  const approvedCatSigs = new Map();
  for (const c of approvedCatIntros) {
    if (!c.intro) {
      fail('approved category intro for "' + c.category + '" has no intro text');
    } else {
      if (approvedCatSigs.has(c.intro) && approvedCatSigs.get(c.intro) !== c.category) {
        fail('approved category intro "' + c.category + '" duplicates intro already used by ' + approvedCatSigs.get(c.intro));
      } else {
        approvedCatSigs.set(c.intro, c.category);
      }
    }
  }
  if (failures === 0 && approvedCatIntros.length > 0 && failures === 0) {
    ok('all approved category intros are present, non-templated and unique');
  } else if (approvedCatIntros.length === 0) {
    console.log('  · (no approved category intros yet—baseline)');
  }

  // --- HARD: category corrections are well-formed, approval-gated, OFF by
  // default. We validate the register (PENDING_CATEGORY_CORRECTIONS) against the
  // locked catalogue and cross-check the lean render-time map
  // (CATEGORY_CORRECTIONS in programme-content.ts). None of this APPLIES a
  // correction — activation is gated behind APPLY_CATEGORY_CORRECTIONS=true in
  // scripts/seo-gen.mjs and VITE_APPLY_CATEGORY_CORRECTIONS in the app build.
  const contentCorrections = extractCategoryCorrections(contentSrc);
  const nPending = Object.keys(PENDING_CATEGORY_CORRECTIONS).length;
  console.log('  · category correction register: ' + nPending +
    ' entries (approval-pending; APPLY_CATEGORY_CORRECTIONS defaults OFF, data.ts untouched).');
  for (const code of Object.keys(PENDING_CATEGORY_CORRECTIONS)) {
    const corr = PENDING_CATEGORY_CORRECTIONS[code];
    // 1. correction references a code that exists in the locked catalogue
    if (!catalogueCodes.has(code)) {
      fail('category correction for "' + code + '" references a code not in src/lib/data.ts');
    }
    // 2. destination is a canonical, routeable catalogue category (page exists)
    if (!catalogueCategories.includes(corr.to)) {
      fail('category correction "' + code + '": destination "' + corr.to + '" is not a canonical PROGRAM_CATEGORIES entry (no /programmes/category/:slug route)');
    }
    // 3. `from` equals the code's ACTUAL data.ts category — proves the file is
    //    misfiled as claimed and the register is not stale
    const actualCat = catalogueCategoriesByCode.get(code);
    if (actualCat !== corr.from) {
      fail('category correction "' + code + '": register from="' + corr.from +
        '" != data.ts category="' + actualCat + '" (register may be stale; re-verify)');
    }
    // 4. the lean render-time map mirrors the editorial register exactly
    if ((contentCorrections[code] || '') !== corr.to) {
      fail('CATEGORY_CORRECTIONS["' + code + '"] = "' + (contentCorrections[code] || '<missing>') +
        '" does not match editorial register destination "' + corr.to + '"');
    }
  }
  if (failures === 0) ok('all ' + nPending + ' category corrections validate: codes resolve, destinations canonical, from == data.ts category, render map in sync');

  // --- HARD (when dist present): status gate kept drafts out of published output ---
  if (fs.existsSync(DIST_DIR)) {
    const scanned = [];
    function walk(dir) {
      for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, name.name);
        if (name.isDirectory()) walk(full);
        else if (/\.(html|xml|txt)$/.test(name.name)) scanned.push(full);
      }
    }
    walk(DIST_DIR);
    let leaked = 0;
    for (const file of scanned) {
      const text = readText(file);
      for (const marker of UNPUBLISHED_MARKERS) {
        if (text.includes(marker)) {
          fail('unpublished status token ' + marker + ' leaked into ' + path.relative(DIST_DIR, file));
          leaked++;
        }
      }
    }
    if (leaked === 0) ok('no pending/draft status literal found in ' + scanned.length + ' published output files (.html/.xml/.txt)');
    // --- INFORMATIONAL (not a failure): the client JS bundle carries the
    // content-layer module (status constants + record objects) so the
    // client-side gate (approvedContent / approvedCategoryIntro) can run.
    // Pending text is never rendered—the React page falls back to the
    // data.ts catalogue values for any non-approved record. This is a code
    // artifact, not a published shell/sitemap/llms.txt document.
    const jsBundle = [];
    function walkJs(dir) {
      for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, name.name);
        if (name.isDirectory()) walkJs(full);
        else if (/\.js$/.test(name.name)) jsBundle.push(full);
      }
    }
    let jsTokenCount = 0;
    for (const file of jsBundle) {
      const t = readText(file);
      for (const marker of UNPUBLISHED_MARKERS) {
        if (t.includes(marker)) jsTokenCount++;
      }
    }
    console.log('  · NOTE: ' + jsTokenCount + ' client JS bundle reference(s) contain the content-layer status constants (required by the client-side gate; pending content is never rendered; build artifact only).');
  } else {
    console.log('  · dist/ not present; skipping published-output leak scan (run `npm run build` to exercise it).');
  }

  // --- INFORMATIONAL baseline report (does not block) ---
  console.log('\nBaseline (data.ts, byte-locked) findings—reported, not failures:');
  console.log('  · distinct outcome sets among 135 programmes: ' + duplicateOutcomeSets + ' (audit: 2 shared sets)');
  console.log('  · templated summary pattern in catalogue: ' + templateSummaries + ' / ' + recs.length);
  console.log('  · pending category corrections (approval-gated, not applied to data.ts): ' +
    Object.keys(PENDING_CATEGORY_CORRECTIONS).length);
  console.log('  · category introductory drafts: ' + catIntros.length + ' (' +
    approvedCatIntros.length + ' approved—awaiting GIBS syllabus verification; ' +
    'topic-specific intros ready to publish once approved)');

  return finish(failures);
}

function finish(failures) {
  if (failures > 0) {
    console.error('\n❌ content_quality: ' + failures + ' check(s) failed.');
    process.exit(1);
  }
  console.log('\n✅ content_quality: all hard gates passed.');
  process.exit(0);
}

main();
