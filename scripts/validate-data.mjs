import {
  INSTITUTION,
  CONTACTS,
  CAMPUSES,
  FACULTY_DESIGNATIONS,
  PROGRAMMES,
  LOCAL_PROGRAMMES,
  FOREIGN_PROGRAMMES,
} from '../src/lib/data.ts';

console.log('--- EXECUTING AUTOMATED DATA & INTEGRITY VALIDATION ---');

let errors = [];

// 1. CAC & Legal
if (!INSTITUTION.cac.includes('1178333')) errors.push('CAC RC 1178333 missing');
if (!INSTITUTION.legalName.includes('Goshen International Business School')) errors.push('Legal name mismatch');
if (!INSTITUTION.incorporationDate.includes('March 17, 2014')) errors.push('Incorporation date mismatch');

// 2. Contacts
if (!CONTACTS.emails.includes('gibsilorin@gmail.com')) errors.push('Primary email missing');
if (!CONTACTS.emails.includes('goshenibs22@gmail.com')) errors.push('Secondary email missing');
if (CONTACTS.phones.length < 5) errors.push('Phone numbers incomplete');

// 3. Campuses & Faculty
if (CAMPUSES.length !== 3) errors.push(`Expected 3 campuses, got ${CAMPUSES.length}`);
if (FACULTY_DESIGNATIONS.length !== 14) errors.push(`Expected 14 faculty designations, got ${FACULTY_DESIGNATIONS.length}`);

// 4. Programme Counts
if (LOCAL_PROGRAMMES.length !== 113) errors.push(`Expected 113 local programmes, got ${LOCAL_PROGRAMMES.length}`);
if (FOREIGN_PROGRAMMES.length !== 22) errors.push(`Expected 22 foreign programmes, got ${FOREIGN_PROGRAMMES.length}`);
if (PROGRAMMES.length !== 135) errors.push(`Expected 135 total programmes, got ${PROGRAMMES.length}`);

// 5. Foreign Destination Breakdown
const kigali = FOREIGN_PROGRAMMES.filter(p => p.destination === 'Kigali');
const dubai = FOREIGN_PROGRAMMES.filter(p => p.destination === 'Dubai');
const london = FOREIGN_PROGRAMMES.filter(p => p.destination === 'London');
const houston = FOREIGN_PROGRAMMES.filter(p => p.destination === 'Houston');

if (kigali.length !== 8) errors.push(`Expected 8 Kigali programmes, got ${kigali.length}`);
if (dubai.length !== 5) errors.push(`Expected 5 Dubai programmes, got ${dubai.length}`);
if (london.length !== 4) errors.push(`Expected 4 London programmes, got ${london.length}`);
if (houston.length !== 5) errors.push(`Expected 5 Houston programmes, got ${houston.length}`);

// 6. Currency Enforcement
london.forEach(p => {
  if (p.currency !== 'GBP') errors.push(`London programme ${p.slug} has wrong currency ${p.currency}`);
});
kigali.concat(dubai, houston).forEach(p => {
  if (p.currency !== 'USD') errors.push(`Foreign programme ${p.slug} has wrong currency ${p.currency}`);
});
LOCAL_PROGRAMMES.forEach(p => {
  if (p.currency !== 'NGN') errors.push(`Local programme ${p.slug} has wrong currency ${p.currency}`);
});

// 7. Unique Slugs and IDs
const slugs = new Set();
PROGRAMMES.forEach(p => {
  if (slugs.has(p.slug)) errors.push(`Duplicate slug found: ${p.slug}`);
  slugs.add(p.slug);
});

if (errors.length > 0) {
  console.error('❌ DATA VALIDATION FAILED:');
  errors.forEach(e => console.error('  -', e));
  process.exit(1);
} else {
  console.log('✅ ALL DATA & PROGRAMME CATALOGUE VALIDATION CHECKS PASSED PERFECTLY!');
  console.log(`- Local Programmes: ${LOCAL_PROGRAMMES.length}`);
  console.log(`- Foreign Programmes: ${FOREIGN_PROGRAMMES.length} (Kigali: ${kigali.length}, Dubai: ${dubai.length}, London: ${london.length}, Houston: ${houston.length})`);
  console.log(`- Total Programmes: ${PROGRAMMES.length}`);
}
