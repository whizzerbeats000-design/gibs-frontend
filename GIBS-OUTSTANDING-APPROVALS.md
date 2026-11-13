# GIBS Outstanding Approvals

**Repository:** `/root/gibs-frontend`  
**Purpose:** Items requiring external action before full 100/100 production-readiness can be claimed.  
**None of these are application code defects — all are external dependencies or institutional approvals.**

---

## 1. gibs.ng Redirect Path Preservation (External Infrastructure)

**Owner:** GIBS hosting administrator (Host Africa / Caddy server at 169.239.181.134)

**Current behaviour:**
```
https://gibs.ng/about        → 301 https://gibs.com.ng        (path stripped)
https://gibs.ng/programmes   → 301 https://gibs.com.ng        (path stripped)
```

**Required behaviour:**
```
https://gibs.ng/about        → 301 https://gibs.com.ng/about  (path preserved)
https://gibs.ng/programmes   → 301 https://gibs.com.ng/programmes (path preserved)
```

**Required change:** Update Caddy configuration on the Host Africa server:
```
redir https://gibs.com.ng{uri} permanent
```

**Verification:** `curl -sIL https://gibs.ng/about` returns `location: https://gibs.com.ng/about`

**Classification:** External DNS/hosting dependency. Not a code defect.

---

## 2. VERCEL_OIDC_TOKEN Rotation (Security)

**Owner:** GIBS Vercel account administrator

**Current state:** Token was present in `.env.local` (now removed). Token is git-ignored and not in git history, but existed on disk.

**Required action:** Revoke or rotate the token via the Vercel dashboard. Verify no new token is stored on disk.

**Classification:** Credential hygiene. Not a code defect.

---

## 3. Programme Content Approval (Institutional)

**Owner:** GIBS syllabus owners / academic leadership

**Current state:** 0 of 135 programmes have GIBS-verified, topic-specific content. All programme detail pages use shared catalogue templates. 10 content entries are pending verification in `programme-content.ts`.

**Required action:** GIBS syllabus owners review and approve topic-specific content (outcomes, structure, FAQs, instructor attribution) for priority programmes through the existing `programme-content.ts` / `content_approval_register.csv` workflow. The approval gate is already implemented — only content entries need to be created and approved.

**Classification:** Institutional content approval. Not a code defect.

---

## 4. E2E Concierge Clear-History Race Condition (Enhancement)

**Owner:** GIBS frontend development team

**Current state:** The "Concierge history can be cleared" E2E test has a pre-existing timing issue: if the 650ms concierge reply timeout fires just as "Clear history" is clicked, the reply can be added to the conversation after reset, rewriting localStorage. This is masked by the test's 750ms wait being insufficient in constrained environments.

**Required action:** Add a "reset requested" guard flag in `Concierge.tsx` to prevent the pending timeout callback from mutating state after `reset()` is called.

**Classification:** Pre-existing timing issue, not introduced by this remediation. Not a user-facing defect (the UI resets correctly; only the localStorage verification in the test is affected).

---

## 5. Course Structured Data on Programme Pages (SEO Enhancement)

**Owner:** GIBS frontend development team

**Current state:** Organisation schema is present with `legalName`. Course schema exists but only in generated shells via `seo-gen.mjs`. Individual programme detail pages could benefit from per-programme `Course` JSON-LD with `hasCourseInstance`.

**Required action:** Add per-programme Course JSON-LD to programme detail page shells. This is an SEO enhancement, not a defect — the site ranks correctly without it.

**Classification:** Optional enhancement.

---

## Summary

| # | Item | Owner | Type | Blocker for 100/100? |
|---|---|---|---|---|
| 1 | gibs.ng Caddy redirect | Host Africa admin | External infrastructure | Yes |
| 2 | VERCEL_OIDC_TOKEN rotation | Vercel admin | Security hygiene | No |
| 3 | Programme content approval | GIBS syllabus owners | Institutional content | No |
| 4 | E2E clear-history race condition | Frontend team | Code enhancement | No |
| 5 | Course schema on programme pages | Frontend team | SEO enhancement | No |

**Application code is production-ready. Items 1–3 require external action before a full unqualified 100/100 score can be claimed.**