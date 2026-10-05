-- =============================================================================
-- 010_catalogue_year.sql — the annual catalogue dimension
-- =============================================================================
--
-- STATUS: WRITTEN, NOT EXECUTED.
-- This file has never been run against a PostgreSQL engine. It is complete and
-- self-consistent SQL, but "looks right" is not "verified" — see
-- docs/backend/README.md, "Verification still pending". Nothing in this
-- repository may be described as database-verified until a real PostgreSQL
-- instance has applied this file and the results have been recorded.
--
-- WHY A YEAR DIMENSION AT ALL
--   GIBS programmes are not permanent. The 135 programmes shipped in 2026 are
--   the 2026 catalogue. A future catalogue may add, remove, rename, re-code,
--   re-fee, re-schedule or relocate any of them. The requirement is therefore
--   not "a table of programmes" but "a sequence of annual catalogues", where
--   publishing one never destroys the previous one.
--
--   This dimension is what makes the 2026 → 2027 → 2028 progression possible:
--
--     2026  archived     (immutable, retained for historical enquiries)
--     2027  published    (what the public site reads)
--     2028  draft        (staff may edit freely; the public cannot see it)
--
--   The 2026 rows are never updated to "become" 2027. A new year gets NEW rows
--   (see catalogue_programme in 012). Continuity between years is expressed by
--   programme_lineage (011), never by mutating history.
--
-- LIFECYCLE
--   draft     staff may create and edit freely; invisible to the public
--   review    submitted for sign-off; editing should be frozen
--   published exactly one at a time; the only year the public API serves
--   archived  superseded but permanently readable
--
--   Transitions are enforced by 018_lifecycle_functions.sql (publish_catalogue_year,
--   clone_catalogue_year, submit_catalogue_year_for_review), never by ad-hoc
--   UPDATE statements written by hand.
--
-- NO EXTENSIONS REQUIRED
--   gen_random_uuid() is built in from PostgreSQL 13 onward, so pgcrypto is not
--   needed. No citext: subscriber email uniqueness is a lower() expression
--   index (015). No pg_trgm: search stays a frontend concern for now and no
--   search endpoint exists, so a trigram index would be unjustified. If a
--   server-side search surface is added later, that is the moment to add it.
-- =============================================================================

CREATE TABLE IF NOT EXISTS catalogue_year (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  year         smallint    NOT NULL,
  status       text        NOT NULL DEFAULT 'draft',
  notes        text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  archived_at  timestamptz,

  CONSTRAINT catalogue_year_year_chk
    CHECK (year BETWEEN 2000 AND 2100),
  CONSTRAINT catalogue_year_status_chk
    CHECK (status IN ('draft', 'review', 'published', 'archived')),
  -- A published year must carry the moment it went live; an archived year must
  -- say when it was superseded. Enforced here so history cannot be published
  -- with a NULL timestamp and later "fixed".
  CONSTRAINT catalogue_year_published_at_chk
    CHECK (status <> 'published' OR published_at IS NOT NULL),
  CONSTRAINT catalogue_year_archived_at_chk
    CHECK (status <> 'archived'  OR archived_at  IS NOT NULL),
  CONSTRAINT catalogue_year_unique UNIQUE (year)
);

COMMENT ON TABLE catalogue_year IS
  'One row per annual GIBS programme catalogue. Exactly one row may hold '
  'status=''published'' at any moment (enforced by one_published_catalogue_year). '
  'Published and archived rows are immutable history and are retained forever: '
  'historical enquiries reference a specific year''s programme, so deleting an '
  'archived year would break them.';

-- ---------------------------------------------------------------------------
-- At most one published year
-- ---------------------------------------------------------------------------
-- The single most important invariant in the model. It is a database
-- constraint rather than application logic so that two concurrent publishes,
-- a manual psql session, or a buggy migration cannot both win.
--
-- The expression index is on (status) filtered to the published row, so it
-- holds exactly one row. A second concurrent INSERT/UPDATE to 'published'
-- raises unique_violation and, because publishing happens inside a single
-- transaction (018), the failed attempt leaves no partial state behind.
--
-- CREATE ... IF NOT EXISTS is deliberate: this file must be safe to re-run.
CREATE UNIQUE INDEX IF NOT EXISTS one_published_catalogue_year
  ON catalogue_year ((status))
  WHERE status = 'published';

COMMENT ON INDEX one_published_catalogue_year IS
  'Guarantees at most one published catalogue year. A second publish attempt '
  'fails at the database, not at the application layer.';

-- Lookup used by every public read: "what is live right now?"
CREATE INDEX IF NOT EXISTS catalogue_year_status_idx
  ON catalogue_year (status);

-- =============================================================================
-- END 010_catalogue_year.sql
-- =============================================================================
