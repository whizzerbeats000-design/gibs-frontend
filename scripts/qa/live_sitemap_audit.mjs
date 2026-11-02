// Live production sitemap audit (read-only). Verifies the *live* endpoint, not
// the local dist. Used for GSC/Bing submission confirmation.
import { readFileSync } from 'node:fs';

const SITEMAP = 'https://gibs.com.ng/sitemap.xml';
const ROBOTS = 'https://gibs.com.ng/robots.txt';
const BASE = 'https://gibs.com.ng';

function extractLocs(xml) {
  // Only count <loc> (canonical). Ignore <xhtml:link ...> alternates.
  const locs = [];
  let m;
  const re = /<loc>([^<]*)<\/loc>/g;
  while ((m = re.exec(xml)) !== null) locs.push(m[1].trim());
  return locs;
}

async function fetchWith(code, url, { method = 'GET' } = {}) {
  const opts = { method, redirect: 'manual' }; // manual so we can SEE redirects
  const res = await fetch(url, opts);
  return { status: res.status, location: res.headers.get('location') };
}

const report = {};
try {
  const head = await fetch(SITEMAP, { method: 'HEAD', redirect: 'manual' });
  report.sitemapStatus = head.status;
  report.sitemapType = head.headers.get('content-type') || '';
  report.sitemapBytes = Number(head.headers.get('content-length') || '0');
  report.sitemapUrl = SITEMAP;
} catch (e) {
  report.sitemapFetchError = String(e);
}

const raw = await fetch(SITEMAP, { redirect: 'manual' });
const xml = await raw.text();
const locs = extractLocs(xml);

const total = locs.length;
const unique = new Set(locs).size;
const nonCanonical = locs.filter((u) => !u.startsWith(BASE + '/') && u !== BASE + '/');
const nonHttps = locs.filter((u) => !u.startsWith('https://'));
const duplicates = total - unique;
const hasNoindex = /<noindex>/i.test(xml);

// Concurrency-bounded HTTP check of every <loc>.
const results = [];
const CONCURRENCY = 12;
let i = 0;
async function worker() {
  while (i < locs.length) {
    const idx = i++;
    const url = locs[idx];
    try {
      const r = await fetchWith(null, url);
      results[idx] = { url, status: r.status, redirected: r.status === 301 || r.status === 302 || r.status === 307 || r.status === 308 };
    } catch (e) {
      results[idx] = { url, status: 'ERR', error: String(e) };
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const statuses = {};
for (const r of results) {
  statuses[r.status] = (statuses[r.status] || 0) + 1;
}
const redirects = results.filter((r) => r.redirected).map((r) => r.url);
const notFound = results.filter((r) => String(r.status).startsWith('4') || String(r.status).startsWith('5')).map((r) => `${r.status} ${r.url}`);
const okCount = results.filter((r) => r.status === 200).length;

// robots.txt
let robotsText = '';
let robotsHasSitemap = false;
let robotsSitemapUrl = '';
try {
  const rr = await fetch(ROBOTS, { redirect: 'manual' });
  robotsText = await rr.text();
  const rm = robotsText.match(/Sitemap:\s*(.*)/i);
  if (rm) {
    robotsSitemapUrl = rm[1].trim();
    robotsHasSitemap = true;
  }
} catch (e) {
  report.robotsFetchError = String(e);
}

const xmlValid = /^<\?xml[^>]*>\s*<urlset/.test(xml.trim()) && locs.length > 0;

console.log(JSON.stringify({
  report,
  sitemapUrl: SITEMAP,
  httpStatus: raw.status,
  contentType: raw.headers.get('content-type') || '',
  xmlValid: !!xmlValid,
  totalUrls: total,
  uniqueUrls: unique,
  duplicates,
  allHttps: nonHttps.length === 0,
  nonHttpsSample: nonHttps.slice(0, 5),
  allCanonical: nonCanonical.length === 0,
  nonCanonicalSample: nonCanonical.slice(0, 5),
  hasNoindex,
  statusBreakdown: statuses,
  ok200: okCount,
  redirectsCount: redirects.length,
  redirectsSample: redirects.slice(0, 5),
  notFoundCount: notFound.length,
  notFoundSample: notFound.slice(0, 10),
  robotsStatus: raw.status,
  robotsReferencesSitemap: robotsHasSitemap,
  robotsSitemapUrl: robotsSitemapUrl,
  sitemapMatchesRobots: robotsSitemapUrl === SITEMAP,
  non200: results.filter((r) => r.status !== 200).map((r) => ({ url: r.url, status: r.status, error: r.error, redirected: r.redirected })),
}, null, 2));
