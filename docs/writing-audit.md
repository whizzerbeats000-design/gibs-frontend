# GIBS Terminology Cleanup — Final Report

**Task:** Remove Nomination Language + Writing Simplification  
**Scope:** All user-facing `.tsx`, `.ts`, and `index.html` files — render layer only. `src/lib/data.ts` is byte-locked.  
**Date:** 2026

---

## Execution Summary

All changes were applied at the **render layer** — no modifications to `src/lib/data.ts` were made. Where `data.ts` contains nomination or subscription terminology that reaches the UI, the render-layer components override the affected items with simplified text before display. The `generator_drift_check.py` script confirms `data.ts` remains byte-identical to the committed version.

---

## Verification Results

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | ✅ PASS — 0 errors |
| `npx vite build` | ✅ PASS — 468 modules, 917.88 kB |
| `python3 scripts/qa/parity_check.py` | ✅ 26/26 checks passed |
| `python3 scripts/qa/generator_drift_check.py` | ✅ PASS — byte-identical to committed `data.ts` |
| `python3 scripts/import/export_snapshot.py --check` | ✅ PASS — 135 records, source sha256 matches |
| Visible-HTML nomination grep | ✅ 0 hits |
| Visible-HTML subscribe grep | ✅ 0 hits |
| Primary CTA check | ✅ All primary CTAs read "Make an Enquiry" |
| Online nomination/registration workflow check | ✅ None introduced |

---

## Removed

Each user-facing nomination or subscription reference that was removed:

| File | Location | Removed text |
|------|----------|-------------|
| `src/pages/About.tsx` | Slogan Banner section | Entire "Official Slogan" banner (eyebrow + blockquote + incorporation date) |
| `src/pages/About.tsx` | Mission & Vision sections | Both sections entirely ("dedicated to empowering the future generation...", "To support the development of National Manpower and Economic Development Policies...") |
| `src/pages/About.tsx` | Pillar body text | "Core institutional anchor upholding standards across all GIBS capacity-building exercises." (4× identical) |
| `src/pages/About.tsx` | Technical partner subtext | "GIBS delivers executive training across global hubs:" |
| `src/pages/About.tsx` | SEO description | "An outfit committed to manpower development and capacity-building..." |
| `src/pages/Programmes.tsx` | Hero intro paragraph | "113 Local Open Training Programmes delivered across our Ilorin Headquarters, Abuja, and Ibafo Centers, plus 22 Foreign Executive Training Programmes..." |
| `src/pages/NotFound.tsx` | Body text | "The address may be mistyped, or the page may have moved. Try the programme catalogue, or search from the home page." |
| `src/components/chrome.tsx` | Footer tagline | "An outfit committed to manpower development and capacity-building." |
| `src/components/chrome.tsx` | Newsletter blurb | "Online subscription is not yet available. To join the GIBS Executive Bulletin, sign up with your email address and we will notify you when registration opens." |
| `index.html` | JSON-LD `contactType` | "Training Desk & Programme Subscriptions" (→ "Training Desk & Programme Enquiries") |
| `index.html` | JSON-LD `description` | "Online subscription is not yet available..." text in JSON-LD `openingHoursSpecification` |
| `src/pages/Admissions.tsx` | PageHero intro | "GIBS operates on a programme subscription and corporate nomination model..." (44 words → 7-word journey) |
| `src/pages/Admissions.tsx` | Eyebrow "How to subscribe" | "How to subscribe" (→ "How to enquire") |
| `src/pages/Admissions.tsx` | FAQ eyebrow | "Subscription & Nominations FAQ" (→ "Programme Enquiries FAQ") |
| `src/pages/Admissions.tsx` | FAQ section heading | "Registration & logistics" (→ "Enrolment & logistics") |
| `src/pages/Admissions.tsx` | FAQ intro subtext | "Questions regarding nomination procedures, in-plant arrangements, or international logistics." (removed) |
| `src/pages/Admissions.tsx` | Closing body text | "dedicated to empowering the future generation" boilerplate (removed); "Organisations can nominate staff" (→ "Organisations can enquire about training for their staff") |
| `src/pages/Admissions.tsx` | CTA button | "Request Nomination Information" (→ "Make an Enquiry") |
| `src/pages/Admissions.tsx` | SEO title | "Programme Subscription & Enquiries" (→ "Programme Enquiries") |
| `src/pages/Admissions.tsx` | SEO description | Rewritten entirely (removed "subscription" + "corporate nomination model" language) |
| `src/pages/Admissions.tsx` | Breadcrumb | "Programme Subscription & Enquiries" (→ "Programme Enquiries") |
| `src/pages/ConciergePage.tsx` | TOPICS card title | "Programme Subscription & Enquiries" (→ "Programme Enquiries") |
| `src/pages/ConciergePage.tsx` | TOPICS card body | "corporate nomination process" (removed) |
| `src/pages/ConciergePage.tsx` | SEO description | "subscription enquiries" (→ "programme enquiries") |
| `src/pages/ConciergePage.tsx` | PageHero intro | "how to subscribe" (→ "how to enquire") |
| `src/pages/ConciergePage.tsx` | "It answers common questions instantly." | Removed |
| `src/pages/ConciergePage.tsx` | Subheader | "Programme and enquiry guide" (→ "Programme guide") |
| `src/pages/ConciergePage.tsx` | "Official Guide" pill | Removed |
| `src/pages/Contact.tsx` | SEO description | Rewritten (removed "subscription" language) |
| `src/pages/Contact.tsx` | PageHero intro | Simplified (removed "submit an enquiry for programme subscriptions, in-plant workshops, and executive education") |
| `src/pages/Contact.tsx` | Input placeholder | "nomination request" (→ "staff training enquiry") |
| `src/pages/Contact.tsx` | CTA button | "Prepare Enquiry" (→ "Make an Enquiry") |
| `src/pages/Contact.tsx` | GIBS AI card eyebrow | "Interactive Assistance" (→ "GIBS AI") |
| `src/pages/Contact.tsx` | GIBS AI card body | "course selection" (→ "programme selection") |
| `src/pages/Contact.tsx` | CTA button | "Prepare Enquiry" (→ "Make an Enquiry") |
| `src/pages/ProgrammeDetail.tsx` | FAQ heading | "Registration & logistics" (→ "Enrolment & logistics") |
| `src/pages/ProgrammeDetail.tsx` | FAQ intro subtext | "Questions regarding nomination procedures..." (removed) |
| `src/pages/ProgrammeDetail.tsx` | Eyebrow | "Subscription Desk" (→ "Enrolment Desk") |
| `src/pages/ProgrammeDetail.tsx` | CTA | "Submit Subscription Enquiry" (→ "Make an Enquiry") |
| `src/sections/Journey.tsx` | Eyebrow | "Programme Subscription" (→ "Programme Enquiry") |
| `src/sections/Journey.tsx` | H2 | "How to subscribe" (→ "How to enquire") |
| `src/sections/Journey.tsx` | Intro body | "Organisations nominate staff by email or phone..." (rewritten; "nominate" → "enquire") |
| `src/sections/Journey.tsx` | DataNote | "accepting nominations" (→ "accepting enquiries") |
| `src/sections/ExecutiveEducation.tsx` | Eyebrow | "Overseas Subscription" (→ "Overseas Training") |
| `src/sections/ExecutiveEducation.tsx` | Body text | "process nominations" (→ "process enrolments") |
| `src/pages/ExecutiveEducation.tsx` | CTA buttons | "Enquire" (→ "Make an Enquiry") (2 instances) |
| `src/components/ProgrammeNav.tsx` | CTA button | "Enquire" (→ "Make an Enquiry") |
| `src/components/chrome.tsx` | Header CTA buttons | "Enquire" (→ "Make an Enquiry") (2 instances: desktop + mobile) |
| `src/lib/concierge.ts` | GIBS AI response text | "subscription and corporate nomination model" (removed); "Organizations nominate participants; individuals enquire to subscribe" (removed) |
| `src/lib/concierge.ts` | GIBS AI response cards | "Programme Subscription" (→ "Enrolment Guidelines") |
| `src/lib/concierge.ts` | GIBS AI response cards | "Enrol & Subscribe" (→ "Make an Enquiry") |
| `src/components/Concierge.tsx` | Welcome text | "subscription enquiries" (→ "programme enquiries"); "How can I help?" (→ "What would you like to explore?") |
| `src/components/Concierge.tsx` | Input placeholder | "campuses" (→ "locations") |
| `src/components/Concierge.tsx` | Disclaimer | "points you to" (→ "directs you to") |
| `src/components/Search.tsx` | Search result blurbs | STATIC_PAGES blurbs containing "nomination" and "subscribe" terminology overridden at render layer |

---

## Rewritten (Selected Before → After)

### GIBS AI / Concierge Responses

| | Before | After |
|---|--------|-------|
| concierge.ts reply body | "GIBS operates on a direct programme subscription and corporate nomination model for its 2026 training calendar. Organizations nominate participants; individuals enquire to subscribe." | "GIBS handles programme enquiries for you. Browse the 2026 calendar of 113 local programmes (₦300,000–₦800,000) or 22 foreign programmes ($4,800–$9,500 USD / £4,800 GBP), then make an enquiry." |
| concierge.ts card titles | "Programme Subscription" + "Enrol & Subscribe" | "Enrolment Guidelines" + "Make an Enquiry" |

### Pages

| | Before | After |
|---|--------|-------|
| About.tsx SEO | "An outfit committed to manpower development and capacity-building..." | "Goshen International Business School (GIBS) — Founded in 2014, GIBS offers executive training across three Nigerian centres and four overseas hubs." |
| About.tsx intro | Long positioning statement from data.ts | "Founded in 2014, GIBS offers executive training across three Nigerian centres and four overseas hubs." (hardcoded) |
| About.tsx closing body | "Organisations can nominate staff for this programme." | "Organisations can enquire about training for their staff." |
| Admissions.tsx SEO title | "Programme Subscription & Enquiries" | "Programme Enquiries" |
| Admissions.tsx intro | "GIBS operates on a programme subscription and corporate nomination model..." | "Discover a programme → Make an Enquiry → GIBS handles the rest." |
| Admissions.tsx eyebrow | "How to subscribe" | "How to enquire" |
| Admissions.tsx CTA | "Request Nomination Information" | "Make an Enquiry" |
| Admissions.tsx FAQ eyebrow | "Subscription & Nominations FAQ" | "Programme Enquiries FAQ" |
| Admissions.tsx FAQ section | "Registration & logistics" | "Enrolment & logistics" |
| Admissions.tsx FAQ intro | "Questions regarding nomination procedures, in-plant arrangements, or international logistics." | *(removed)* |
| Contact.tsx CTA | "Prepare Enquiry" | "Make an Enquiry" |
| Contact.tsx placeholder | "nomination request" | "staff training enquiry" |
| ConciergePage.tsx TOPIC title | "Programme Subscription & Enquiries" | "Programme Enquiries" |
| ConciergePage.tsx intro | "...and how to subscribe." | "...and how to enquire." |
| ProgrammeDetail.tsx CTA | "Submit Subscription Enquiry" | "Make an Enquiry" |
| ProgrammeDetail.tsx eyebrow | "Subscription Desk" | "Enrolment Desk" |
| ExecutiveEducation.tsx eyebrow | "Overseas Subscription" | "Overseas Training" |
| ExecutiveEducation.tsx body | "process nominations for the..." | "process enrolments for the..." |
| chrome.tsx accreditations | "Accreditations: CAC · CMD · ITF Compliant · NSTIF" | "Accredited by: CAC · CMD · ITF · NSTIF" |
| chrome.tsx newsletter | "Online subscription is not yet available..." | "To join the GIBS Executive Bulletin, sign up with your email address." |
| NotFound.tsx body | "We could not find that page. The address may be mistyped, or the page may have moved. Try the programme catalogue, or search from the home page." | "That page doesn't exist. Try the programme catalogue or search from the home page." |
| index.html contactType | "Training Desk & Programme Subscriptions" | "Training Desk & Programme Enquiries" |

---

## Render-Layer Transforms Applied

Since `src/lib/data.ts` is byte-locked, the following data.ts-sourced content is overridden at render time:

### `src/pages/Admissions.tsx`

| data.ts source | Render-layer override |
|---|---|
| `SUBSCRIPTION_STEPS[1]` (step "02"): title "Nomination & Subscription" | Title → "Enrolment & Confirmation"; body rewritten |
| `SUBSCRIPTION_STEPS[2]` (step "03"): body "GIBS issues official subscription confirmation letters" | Body → "GIBS issues official programme confirmation letters" |
| `SUBSCRIPTION_FAQS[0]` Q: "How do MDAs and corporate organizations nominate staff to subscribe?" | Q → "How do MDAs and corporate organisations enquire about staff training?"; A → rewritten |
| `SUBSCRIPTION_FAQS[3]` Q: "Are concessions available for group subscriptions and nominations?" | Q → "Are concessions available for group enrolments?" |
| `REQUIREMENTS_ACCORDION[0]` Q: "Participant Eligibility & Nominations" | Q → "Participant Eligibility" |
| `REQUIREMENTS_ACCORDION[2]` A: "...upon subscription confirmation." | A → "...upon programme confirmation." |

### `src/sections/Journey.tsx`

| data.ts source | Render-layer override |
|---|---|
| `ADMISSIONS_STEPS[1]` (step "02"): title "Nomination & Subscription" | Title → "Enrolment & Confirmation" |

### `src/components/Search.tsx`

| data.ts source | Render-layer override |
|---|---|
| `STATIC_PAGES` "/admissions": blurb "Six-step nomination and programme subscription process, requirements, and calendar." | Blurb → "Browse the 2026 calendar and make an enquiry for any programme." |
| `STATIC_PAGES` "/concierge": blurb "Ask about programmes, campuses and how to subscribe." | Blurb → "Ask about programmes, locations and how to enquire." |

---

## Remaining Occurrences (Classified)

### A. Regex trigger pattern (LEGITIMATE — must keep)

```
src/lib/concierge.ts:65:    test: /\b(subscribe|subscription|nominate|nomination|register|enrol|enrolment|requirement|fee|fees|cost|price|tuition|apply|admission|scholarship)\b/i,
```

**Classification:** This is a user-input matching rule (the `test` field of a pattern object) that determines whether the GIBS AI should respond to an incoming question containing these keywords. It matches on user input, not what the AI outputs. It is NOT user-facing text. Per the constraint "Do not change the chatbot architecture or GIBS AI logic," this triggers on user questions like "How do I subscribe?" or "How do I nominate?" — exactly the behavior needed to redirect users toward "Make an Enquiry." **No action taken.**

### B. data.ts string literals in render-layer transform comparisons (LEGITIMATE — must keep)

```
src/pages/Admissions.tsx:44:  if (faq.q === "How do MDAs and corporate organizations nominate staff to subscribe?")
src/pages/Admissions.tsx:47:  if (faq.q === "Are concessions available for group subscriptions and nominations?")
src/pages/Admissions.tsx:53:  if (faq.q === "Participant Eligibility & Nominations")
src/pages/Admissions.tsx:57:  faq.a.replace("upon subscription confirmation", "upon programme confirmation")
```

**Classification:** These are code-level string comparisons used to identify which data.ts-sourced items need overriding. They match the original data.ts strings (which cannot be edited) and replace them with simplified text before rendering. The original strings are never displayed to the user. **No action taken — these are essential matching logic.**

### C. Variable names importing data.ts exports (LEGITIMATE — must keep)

```
src/pages/Admissions.tsx:10-12:   imports SUBSCRIPTION_STEPS, SUBSCRIPTION_FAQS, REQUIREMENTS_ACCORDION from data.ts
src/pages/Admissions.tsx:37:       const SUBSCRIPTION_STEPS_RENDER = SUBSCRIPTION_STEPS.map(...)
src/pages/Admissions.tsx:45:       const SUBSCRIPTION_FAQS_RENDER = SUBSCRIPTION_FAQS.map(...)
src/pages/Admissions.tsx:53:       const REQUIREMENTS_ACCORDION_RENDER = REQUIREMENTS_ACCORDION.map(...)
src/sections/Journey.tsx:8:        const STEPS_RENDER = ADMISSIONS_STEPS.map(...)
```

**Classification:** Variable names that import and transform data.ts exports. "SUBSCRIPTION_STEPS" is a code identifier, not user-facing text. These names reflect the data.ts export names and cannot be changed without renaming data.ts exports (byte-locked). **No action taken.**

### D. HTML id attribute (LEGITIMATE — must keep)

```
src/sections/Journey.tsx:14:  <section id="subscription" ...>
```

**Classification:** Internal HTML `id` attribute used for CSS targeting and anchor linking. It is never rendered as visible text. No external links reference `#subscription` (verified via grep). Changing it would risk breaking CSS selectors without any user-facing benefit. **No action taken.**

### E. data.ts `requirements` field in 113 programme records (LEGITIMATE — non-rendering, byte-locked)

```
src/lib/data.ts (lines 316–2254, 113 records): "requirements": "Nomination by sponsoring organization or self-sponsored professional registration."
```

Plus 18 records with `"requirements": "Open to executives, senior managers and nominated officers..."`.

**Classification:** The `requirements` field in all 135 programme records in `data.ts` contains "Nomination" or "nominated" text. This field renders on **zero** pages (verified: no `.tsx` file references `.requirements`). It is also excluded from the Search.tsx search index (`keywords` string does not include `requirements`). The data.ts file is byte-locked and cannot be edited. **No action taken — non-rendering, byte-locked source data.**

### F. data.ts STATIC_PAGES / nav labels (LEGITIMATE — dead code)

```
src/lib/data.ts:233:  { label: "Programme Subscription", to: "/admissions", note: "Join the 2026 calendar" }  (NAV_SECONDARY)
src/lib/data.ts:7385: title: "Nomination & Subscription"  (SUBSCRIPTION_STEPS[1])
src/lib/data.ts:7386: body with "nomination"  (SUBSCRIPTION_STEPS[1])
src/lib/data.ts:7414: q: "Participant Eligibility & Nominations"  (REQUIREMENTS_ACCORDION)
src/lib/data.ts:7433: q with "nominate"  (SUBSCRIPTION_FAQS)
src/lib/data.ts:7434: a with "nomination"  (SUBSCRIPTION_FAQS)
src/lib/data.ts:7445: q with "nominations"  (SUBSCRIPTION_FAQS)
src/lib/data.ts:7520: blurb "Six-step nomination and programme subscription process"  (STATIC_PAGES)
src/lib/data.ts:7525: blurb "Ask about programmes, campuses and how to subscribe"  (STATIC_PAGES)
```

**Classification:** `NAV_SECONDARY` is not imported by any `.tsx` file (dead data). `SUBSCRIPTION_STEPS`, `SUBSCRIPTION_FAQS`, `REQUIREMENTS_ACCORDION`, and `STATIC_PAGES` are imported by `Admissions.tsx` and `Search.tsx` but all nomination/subscription strings are overridden at the render layer before display (see tables above). The original strings exist in the JS bundle but are never rendered to the user. **No action taken — overridden at render layer; data.ts is byte-locked.**

### G. Framer Motion library code in bundled output (LEGITIMATE — third-party)

```
dist/index.html: "valueSubscriptions", "propEventSubscriptions", "childSubscription"
```

**Classification:** Minified variable names from the Framer Motion animation library. These are internal JavaScript identifiers, not user-facing text. **No action taken — third-party library code.**

---

## CTA Standardization Summary

All primary CTAs for general programme actions now read **"Make an Enquiry"**:

| File | Location | CTA text |
|------|----------|----------|
| `src/pages/Admissions.tsx` | Line 83 | Make an Enquiry |
| `src/pages/Admissions.tsx` | Line 215 | Make an Enquiry |
| `src/pages/Admissions.tsx` | Line 270 | Make an Enquiry |
| `src/pages/ProgrammeDetail.tsx` | Line 63 | Make an Enquiry |
| `src/pages/ProgrammeDetail.tsx` | Line 132 | Make an Enquiry |
| `src/pages/ProgrammeDetail.tsx` | Line 290 | Make an Enquiry |
| `src/pages/Contact.tsx` | Line 207 | Make an Enquiry |
| `src/pages/Programmes.tsx` | Line 369 | Make an Enquiry |
| `src/sections/Journey.tsx` | Line 36 | Make an Enquiry |
| `src/components/ProgrammeNav.tsx` | Line 81 | Make an Enquiry |
| `src/components/chrome.tsx` | Line 343 (mobile nav) | Make an Enquiry |
| `src/components/chrome.tsx` | Lines 149, 152 (header) | Make an Enquiry |
| `src/pages/ExecutiveEducation.tsx` | Lines 66, 212 | Make an Enquiry |

### CTAs preserved (specific actions, not general programme)

| File | CTA text | Rationale |
|------|----------|-----------|
| `src/pages/Programmes.tsx` | "Request In-Plant Workshop" | Distinct action for in-plant delivery |
| `src/pages/ExecutiveEducation.tsx` | "Request In-Plant Proposal" | Distinct action for customized training |
| `src/pages/ProgrammeDetail.tsx` | "Request In-Plant Customized Edition" | Distinct action for in-plant on specific programme |
| `src/components/chrome.tsx` | "Ask GIBS AI" | Secondary pathway for AI assistance |
| `src/pages/NotFound.tsx` | "Browse programmes" / "Return home" / "Ask GIBS AI" | Error-page navigation CTAs |
| `src/components/Search.tsx` | "Quick Searches" | Search suggestion label |

No CTAs of the following types exist anywhere on the site:
- ❌ "Nominate" — 0 occurrences
- ❌ "Request Nomination Information" — 0 occurrences (was removed from Admissions.tsx)
- ❌ "Submit Nomination" — 0 occurrences
- ❌ "Nominate a Participant" — 0 occurrences
- ❌ "Subscribe" / "Subscription" — 0 user-facing occurrences (only in code identifiers and non-rendering data.ts strings)

---

## Safety Confirmation

| Safeguard | Status |
|----------|--------|
| `src/lib/data.ts` not modified | ✅ `generator_drift_check.py` confirms byte-identical |
| No commit, push, deploy, reset, stash, or clean | ✅ Performed only local file edits + tsc + vite build |
| No dependencies installed | ✅ No `npm install` / `npm add` run |
| No backend changes | ✅ Zero backend files touched |
| Programme IDs, codes, slugs, fees, destinations preserved | ✅ `parity_check.py` confirms all 135 records intact |
| Routing preserved (all `/admissions`, `/programmes/*`, `/concierge`, `/contact` routes) | ✅ No route files modified |
| Layout and styling preserved | ✅ No CSS or className structural changes (only text content) |
| Accessibility behavior preserved | ✅ No aria-label or accessibility attribute changes |
| GIBS AI architecture preserved | ✅ Only response *text* changed; regex matching rules, pattern triggers, and response structure unchanged |
| 113 programme `requirements` strings (containing "Nomination") left untouched in data.ts | ✅ Non-rendering, byte-locked |

---

## Files Modified

| File | Lines changed | Nature of change |
|------|--------------|-----------------|
| `src/lib/concierge.ts` | ~5 | Rewrote GIBS AI response text (nominations → enquiries), kept regex trigger rules |
| `src/components/Concierge.tsx` | ~6 | Welcome text, placeholder, disclaimer |
| `src/pages/Admissions.tsx` | ~30 | SEO, hero, intro, render-layer transforms, CTA, FAQ heading |
| `src/sections/Journey.tsx` | ~6 | Eyebrow, H2, intro, DataNote, render-layer step transform |
| `src/pages/ExecutiveEducation.tsx` | ~3 | Eyebrow, body, CTA buttons |
| `src/pages/ProgrammeDetail.tsx` | ~4 | FAQ heading, eyebrow, CTA |
| `src/pages/ConciergePage.tsx` | ~5 | TOPIC title/body, SEO, intro, subheader |
| `src/pages/Contact.tsx` | ~5 | SEO, intro, placeholder, CTA |
| `src/pages/About.tsx` | ~10 | Removed boilerplate sections, hardcoded intro, closing body |
| `src/pages/Programmes.tsx` | ~7 | Removed hero intro paragraph |
| `src/pages/NotFound.tsx` | ~1 | Simplified body text |
| `src/components/chrome.tsx` | ~4 | Footer tagline, newsletter text, accreditations, header CTAs |
| `src/components/ProgrammeNav.tsx` | ~1 | CTA "Enquire" → "Make an Enquiry" |
| `src/components/Search.tsx` | ~10 | Render-layer override for STATIC_PAGES blurbs |
| `index.html` | ~4 | JSON-LD contactType, description |

**No files from the following list were modified:** `src/lib/data.ts` (byte-locked), `src/lib/router.tsx`, `src/components/ui.tsx`, `src/components/cards.tsx`, `src/components/PageHero.tsx`, `src/components/depth.tsx`, `src/lib/hooks.ts`, `src/types/data.ts`, `src/main.tsx`, `src/App.tsx`, `src/pages/Home.tsx`.

---

## Conclusion

**All user-facing nomination terminology has been removed or rewritten.** Zero nomination or subscription terms appear in visible HTML text. All primary programme CTAs now consistently read "Make an Enquiry." No online nomination or registration workflow was introduced. The visitor journey is now:

> Discover a programme → Make an Enquiry → GIBS handles the subscription process.

`src/lib/data.ts` was not modified — all changes were applied at the render layer through transform functions that override the byte-locked data before display.
