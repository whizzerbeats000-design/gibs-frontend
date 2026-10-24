-- =============================================================================
-- 011_programme_lineage.sql — continuity across annual catalogues
-- =============================================================================
--
-- STATUS: WRITTEN, NOT EXECUTED. See docs/backend/README.md.
--
-- WHAT THIS IS, AND WHAT IT IS NOT
--   GIBS identity has three separate concepts that are easy to conflate. This
--   file owns only the first:
--
--     A. programme_lineage     continuity. "These annual records are the same
--                               course, year on year." Carries no content.
--     B. catalogue_programme   the year-specific published record that actually
--                               holds title, code, fees, schedule. See 012.
--     C. programme_url         an independently managed public URL asset.
--                               See 013.
--
--   A concrete example:
--
--     lineage "Public Sector Accounting"
--       ├── catalogue_programme  2026  GIBS-LOC-001  ₦390,000  Mar/Apr/Sep
--       ├── catalogue_programme  2027  GIBS-LOC-001  ₦425,000  Feb/May
--       └── catalogue_programme  2028  ...archived later
--
--   Lineage is deliberately NOT the URL. Renaming a programme must not force a
--   URL change, and a URL may legitimately outlive or predate any lineage (see
--   013, where both lineage_id and current_programme_id are nullable).
--
-- WHY lineage_id IS NULLABLE ON catalogue_programme
--   A genuinely new programme has no predecessor, so there is nothing to be
--   continuous with. Forcing a lineage row for it would invent history. NULL
--   therefore means "this is new", which is a true statement rather than a gap.
--   The 2026 import leaves every lineage_id NULL because 2026 is the first
--   catalogue and there is nothing before it to be continuous with; the 2027
--   clone is what populates lineage, by linking each 2027 row to a freshly
--   created lineage row seeded from its 2026 source_id.
--
-- LINEAGE KEYS
--   lineage_key is a stable, human-readable surrogate ("gi-loc-001"). It is
--   seeded from the 2026 source_id so the mapping stays auditable by eye. It is
--   NOT the public code and NOT the URL: codes may be re-issued between years,
--   and URLs are managed separately.
-- =============================================================================

CREATE TABLE IF NOT EXISTS programme_lineage (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  lineage_key text        NOT NULL,
  title_hint  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  retired_at  timestamptz,

  CONSTRAINT programme_lineage_key_chk
    CHECK (lineage_key ~ '^[a-z0-9][a-z0-9-]{0,79}$'),
  CONSTRAINT programme_lineage_key_unique UNIQUE (lineage_key)
);

COMMENT ON TABLE programme_lineage IS
  'Cross-year continuity for a GIBS programme. Holds no publishable content: '
  'title, code, fees, schedule and description all live on catalogue_programme, '
  'because those legitimately change every year. A lineage row with '
  'retired_at set means the programme left the catalogue; it does not delete any '
  'catalogue_programme row.';

COMMENT ON COLUMN programme_lineage.lineage_key IS
  'Stable surrogate, seeded from the 2026 source_id (e.g. "loc-1" -> "gi-loc-1"). '
  'Independent of programme code, which is a per-year published value.';

COMMENT ON COLUMN programme_lineage.retired_at IS
  'Set when the programme leaves the catalogue. Historical catalogue_programme '
  'rows are untouched and remain readable, including for old enquiries.';

CREATE INDEX IF NOT EXISTS programme_lineage_retired_idx
  ON programme_lineage (retired_at)
  WHERE retired_at IS NOT NULL;

-- =============================================================================
-- END 011_programme_lineage.sql
-- =============================================================================
