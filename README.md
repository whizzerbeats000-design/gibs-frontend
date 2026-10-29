# GIBS Frontend — Developer Guide

This repository contains the frontend for the Goshen International Business School (GIBS) official website.

## 🏗️ Architecture

The GIBS application is a **static, read-only frontend**. It is designed to be lean, high-performance, and entirely independent of a server-side API or database.

### Core Principles
- **Static First**: All product data is bundled with the application.
- **Authoritative Data**: The file `src/lib/data.ts` is the single source of truth for the programme catalogue. **Do not modify this file without following the catalogue QA process.**
- **Client-Side Routing**: Routing is handled on the frontend using a custom hash-router.
- **Direct Communication**: The Contact and Newsletter flows use `mailto:` workflows to avoid the complexity and cost of a backend management system.

### Legacy Backend References
You may encounter directories or files that reference "backend", "api", or "db".
- **`db/legacy/`**: Contains historical snapshots used for QA parity checks (`npm run qa`). This is **not** an active database.
- **`archive/backend/`**: contains historical architectural experiments and unexecuted SQL migrations. These are preserved for reference only.
- **`docs/backend/`**: Documents the decision to move to a static architecture and explains why the API was removed.

**Crucially: There is no active API or database associated with this project.** Any references to `/api/` endpoints are obsolete.

---

## 🚀 Developer Workflow

### Prerequisites
- Node.js (LTS recommended)
- npm

### Installation & Development
```bash
npm install
npm run dev
```
The app runs on Vite. Use the local development server to preview changes.

### Quality Assurance (QA)
The project has strict catalogue integrity gates. Before any change to the data layer or routing, run:
```bash
npm run qa
```
This verifies:
- Catalogue parity (comparing current data against `db/legacy/programmes.snapshot.json`).
- Generator drift (ensuring SEO shells match source data).
- Snapshot hash consistency.

### Production Build & Deployment
To generate the production build and SEO shells:
```bash
npm run build
```
This produces a `dist/` directory ready for deployment to Vercel.

### Browser Testing
To run the visual regression and accessibility sweep:
```bash
npm run qa:browser:dist
```
*Note: This requires a Chromium installation. If it fails, set the `CHROMIUM_PATH` environment variable.*

### E2E Tests
```bash
npm run test:e2e
```

---

## ⚠️ Backend Integration Policy

**Do not introduce a backend, database, or external API integration without explicit approval.**

If a future requirement demands server-side persistence:
1. Propose the requirement with a clear business case.
2. Design a minimal endpoint that preserves the current static-first priority.
3. Ensure the `src/lib/data.ts` catalogue remains the primary authoritative source for the frontend.
