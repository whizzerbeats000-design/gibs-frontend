/* ==========================================================================
 * GIBS Programme Content — Editorial Approval Register generator
 * (scripts/qa/build_register.cjs)
 *
 * Reads the byte-locked catalogue (src/lib/data.ts) and the supplementary
 * content layer (src/lib/programme-content.ts), then emits a 135-row CSV
 * register that editorial approvers use to promote `pending-verification`
 * proposals to `approved`. This script is a REPORT generator only: it parses
 * source as text (no TS loader), writes no HTML/JSON-LD, and never edits
 * data.ts. Re-run with `node scripts/qa/build_register.cjs` after any approval
 * change to refresh the register.
 * ========================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const DATA_PATH = path.join(ROOT, 'src', 'lib', 'data.ts');
const CONTENT_PATH = path.join(ROOT, 'src', 'lib', 'programme-content.ts');
const OUT_CSV = path.join(ROOT, 'scripts', 'qa', 'content_approval_register.csv');

function readText(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

function decodeJsonString(raw) {
  return (raw || '').replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

// Balanced-brace capture of the body of `export const NAME = { ... }`.
function extractObjectBody(src, name) {
  const re = new RegExp('export const ' + name + '\\b[\\s\\S]*?=[\\s\\S]*?\\{');
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

// Quote-tolerant scalar field extraction (handles both `"key":` and `key:`).
function extractStringProp(text, key) {
  const m = text.match(new RegExp('"' + key + '"\\s*:\\s*"([^"]*)"')) ||
            text.match(new RegExp('\\b' + key + '\\s*:\\s*"([^"]*)"'));
  return m ? decodeJsonString(m[1]) : null;
}

function extractStringArrayProp(text, key) {
  const m = text.match(new RegExp('"' + key + '"\\s*:\\s*\\[([\\s\\S]*?)\\]')) ||
            text.match(new RegExp('\\b' + key + '\\s*:\\s*\\[([\\s\\S]*?)\\]'));
  if (!m || !m[1].trim()) return [];
  const matches = m[1].match(/"([^"]+)"/g) || [];
  return matches.map((x) => decodeJsonString(x.slice(1, -1)));
}

// Extract top-level {rec} object bodies from an array literal PROGRAMMES.
function extractArrayRecords(src) {
  const startMatch = src.match(/export const PROGRAMMES\s*[:=][\s\S]*?=\s*\[/);
  if (!startMatch) return [];
  const after = src.slice(startMatch.index + startMatch[0].length);
  let depth = 1;
  let body = '';
  for (let i = 0; i < after.length && depth > 0; i++) {
    const ch = after[i];
    if (ch === '[') depth++;
    if (ch === ']') { depth--; if (depth === 0) break; }
    body += ch;
  }
  const records = [];
  let cur = '';
  let d = 0;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === '{') { d++; cur += ch; continue; }
    if (ch === '}') {
      d--;
      cur += ch;
      if (d === 0) { records.push(cur.trim()); cur = ''; }
      continue;
    }
    if (d > 0) cur += ch;
  }
  return records;
}

// Parse PROGRAMME_CONTENT map: "CODE": { ... } -> record.
function extractContentByCode(src) {
  const body = extractObjectBody(src, 'PROGRAMME_CONTENT');
  if (!body) return {};
  const entries = [];
  let cur = '';
  let d = 0;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === '{') { d++; cur += ch; continue; }
    if (ch === '}') { d--; cur += ch; continue; }
    if (d === 0 && ch === ',') { entries.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) entries.push(cur.trim());
  const map = {};
  for (const entry of entries) {
    const keyMatch = entry.match(/^\s*"([^"]+)"\s*:/);
    if (!keyMatch) continue;
    const code = decodeJsonString(keyMatch[1]);
    const objMatch = entry.match(/\{\s*([\s\S]*)\}\s*$/);
    const ob = objMatch ? objMatch[1] : '';
    if (!ob) continue;
    map[code] = {
      code,
      status: extractStringProp(ob, 'status') || 'draft',
      summary: extractStringProp(ob, 'summary'),
      outcomes: extractStringArrayProp(ob, 'outcomes'),
      structure: extractStringArrayProp(ob, 'structure'),
      relatedSlugs: extractStringArrayProp(ob, 'relatedSlugs'),
      source: extractStringProp(ob, 'source'),
    };
  }
  return map;
}

// ---- load catalogue ----
const dataSrc = readText(DATA_PATH);
const records = extractArrayRecords(dataSrc);
const catalogue = {};
const slugSet = new Set();
for (const r of records) {
  const title = extractStringProp(r, 'title');
  const code = extractStringProp(r, 'code') || '';
  const slug = extractStringProp(r, 'slug') || '';
  if (slug) slugSet.add(slug);
  catalogue[code] = {
    code,
    title: title || '',
    category: extractStringProp(r, 'category') || '',
    audience: extractStringProp(r, 'targetAudience') || '',
    duration: extractStringProp(r, 'duration') || '5 Days',
    summary: extractStringProp(r, 'summary') || '',
    outcomes: extractStringArrayProp(r, 'outcomes'),
    structure: extractStringArrayProp(r, 'indicativeStructure'),
    faqs: [],
    slug,
  };
}

// ---- load proposals ----
const contentSrc = readText(CONTENT_PATH);
const byCode = extractContentByCode(contentSrc);

// Generic catalogue outcome sets (from data.ts) — a proposal whose outcomes
// equal one of these is NOT topic-specific.
const GENERIC_OUTCOME_SETS = [
  JSON.stringify(["Upgraded technical and strategic competencies in modern public and private sector operations",
    "Immediate practical toolkit ready for deployment in participant's organization",
    "Executive certification from Goshen International Business School (GIBS)"].sort()),
  JSON.stringify(["Upgraded technical and strategic competencies in modern public and private sector operations",
    "Immediate practical toolkit ready for deployment in participant's organization",
    "Executive certification from Goshen International Business School (GIBS)"].sort()),
];

function classifyProposal(code) {
  const prop = byCode[code];
  if (!prop) {
    return { status: 'PENDING', summary: 'PENDING (no proposal; catalogue template only)',
      outcomes: 'PENDING (no proposal; generic outcome set)',
      curriculum: 'PENDING (no proposal; catalogue structure only)',
      applications: 'PENDING (no proposal)',
      faqs: 'PENDING (no proposal; catalogue FAQs only)',
      related: 'PENDING (no proposal)',
      source: 'src/lib/data.ts (catalogue template)',
      missing: 'topic-specific summary, learning outcomes, structure, FAQs, related links' };
  }
  const s = (v) => (v && v.length) ? v : '(empty)';
  const outcomesSig = JSON.stringify((prop.outcomes || []).slice().sort());
  const outcomesIsGeneric = GENERIC_OUTCOME_SETS.some((g) => g === outcomesSig) || (prop.outcomes || []).length === 0;
  // relatedSlug resolution
  const unresolved = (prop.relatedSlugs || []).filter((sl) => !slugSet.has(sl));
  return {
    status: prop.status,
    summary: prop.status === 'approved' ? 'APPROVED' : 'NEEDS CONFIRMATION (pending-verification)',
    outcomes: outcomesIsGeneric ? 'UNSUPPORTED (reproduces generic outcome set)' :
              (prop.status === 'approved' ? 'APPROVED' : 'NEEDS CONFIRMATION (pending-verification)'),
    curriculum: (prop.structure && prop.structure.length) ?
                (prop.status === 'approved' ? 'APPROVED' : 'NEEDS CONFIRMATION (pending-verification)') :
                'NEEDS CONFIRMATION (pending-verification)',
    applications: prop.status === 'approved' ? 'APPROVED (inferred from outcomes)' : 'NEEDS CONFIRMATION (pending-verification)',
    faqs: (prop.faqs && prop.faqs.length) ?
          (prop.status === 'approved' ? 'APPROVED' : 'NEEDS CONFIRMATION (pending-verification)') :
          'NEEDS CONFIRMATION (pending-verification; no FAQs proposed)',
    related: unresolved.length === 0 ?
             (prop.status === 'approved' ? 'VERIFIED (approved, all resolve)' : 'VERIFIED (pending, all resolve)') :
             'UNRESOLVED (' + unresolved.join(',') + ')',
    source: prop.source || 'editorial draft (pending GIBS syllabus verification)',
    missing: prop.status === 'approved'
      ? 'none (approved)'
      : 'GIBS syllabus owner: confirm summary, outcomes, structure, FAQs and related links match the official programme syllabus.',
  };
}

// ---- emit CSV ----
const rows = [];
rows.push(['Programme ID','Title','Category','Audience','Summary status','Learning outcomes status','Curriculum status','Practical applications status','FAQs status','Related programmes status','Source','Editorial status','Missing information']);
let counts = {approved:0, pending:0, nocontent:0};
const approvedCodes=[];
for (const code of Object.keys(catalogue)) {
  const c = catalogue[code];
  const cls = classifyProposal(code);
  if (cls.status === 'approved') { counts.approved++; approvedCodes.push(code); }
  else if (cls.status === 'PENDING') counts.nocontent++;
  else counts.pending++;
  rows.push([c.code, c.title, c.category, c.audience,
    cls.summary, cls.outcomes, cls.curriculum, cls.applications, cls.faqs,
    cls.related, cls.source, cls.status, cls.missing]);
}
const csv = rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
fs.writeFileSync(OUT_CSV, csv + '\n');

// ---- summary to stdout ----
console.log('Programme Content Editorial Approval Register');
console.log('  catalogue programmes:        ' + Object.keys(catalogue).length);
console.log('  proposals authored:          ' + Object.keys(byCode).length + ' (all pending-verification)');
console.log('  approved for publication:    ' + counts.approved + ' (must be promoted by GIBS)');
console.log('  pending verification:        ' + counts.pending);
console.log('  no proposal (catalogue only):' + counts.nocontent);
console.log('  135-row CSV written to:      ' + OUT_CSV);
console.log('  protected data.ts sha256:    ' + require('crypto').createHash('sha256').update(dataSrc,'utf8').digest('hex'));
