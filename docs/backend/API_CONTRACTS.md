# GIBS Minimal Backend API (Simplified)

Status: Simplified. Previous full contract described unexecuted backend.
No database required for current product. No API endpoint verified at runtime.

Remaining (if any): none required for current scope.

Current contact workflow uses `mailto:` directly from the frontend (Contact page).
No server-side form persistence, subscriber endpoint, or audit endpoint is required.

If future requirement demands server-side catalogue or contact persistence:
- Design minimal endpoint (only after requirement confirmed)
- Do NOT assume PostgreSQL; choose storage appropriate to need
- Keep frontend disconnected until verified
- Preserve bundled `src/lib/data.ts` as authoritative source

Previous contract details preserved in `API_CONTRACTS.md.deprecated` for reference.
