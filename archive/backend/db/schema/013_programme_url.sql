-- =============================================================================
-- 013_programme_url.sql — public URL assets, managed independently
-- =============================================================================
--
-- STATUS: WRITTEN, NOT EXECUTED. See docs/backend/README.md.
--
-- THE POINT OF THIS TABLE
--   A URL is a public asset with a lifetime, not a by-product of a title. Two
--   facts make that concrete for GIBS:
--
--     1. All 135 existing slugs are live URLs. 77 of them are truncated
--        mid-word at the generator's 60-character title-segment boundary, and
--        uniqueness comes only from the numeric prefix. They are ugly and they
--        are load-bearing. They are NEVER regenerated or cleaned.
--
--     2. A programme may be renamed in 2027. If the URL were derived from the
--        title, every rename would break an inbound link and a search ranking.
--        So the slug is pinned here, independently, and a rename does not touch
--        it.
--
-- INDEPENDENCE IS DELIBERATE
--   Both lineage_id and current_programme_id are NULLABLE:
--
--     * a URL may exist before any lineage is assigned to it, or for a legacy
--       record whose continuity is genuinely unknown;
--     * a URL may be retired with no current target.
--
--   URL identity is therefore not inseparably dependent on lineage, as the
--   architecture requires.
--
-- RESOLUTION ORDER (resolve_programme_url, at the bottom of this file)
--   1. redirect_to_slug set   -> the slug has been deliberately superseded;
--                                 the caller is told where to go instead.
--   2. ?year=YYYY given       -> that year's programme, and ONLY if this slug
--                                 genuinely maps to it. A slug that belongs to
--                                 a different year's programme must NOT
--                                 silently return some other programme.
--   3. otherwise              -> current_programme_id, which the publish
--                                 transaction repoints to the live year.
-- =============================================================================

CREATE TABLE IF NOT EXISTS programme_url (
  -- Globally unique and immutable. This is the public URL.
  slug                   text        PRIMARY KEY,
  -- Nullable on purpose; see header.
  lineage_id             uuid        REFERENCES programme_lineage(id) ON DELETE SET NULL,
  -- Repointed by publish_catalogue_year (018) on every publish. Nullable so a
  -- URL can exist in a reserved or retired state.
  current_programme_id   uuid        REFERENCES catalogue_programme(id) ON DELETE SET NULL,
  first_published_year   smallint    NOT NULL,
  retired_at             timestamptz,
  redirect_to_slug       text        REFERENCES programme_url(slug),
  created_at             timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT programme_url_slug_chk
    CHECK (slug ~ '^[a-z0-9][a-z0-9-]{0,127}$'),
  -- A slug cannot redirect to itself; that would loop.
  CONSTRAINT programme_url_no_self_redirect_chk
    CHECK (redirect_to_slug IS NULL OR redirect_to_slug <> slug)
);

COMMENT ON TABLE programme_url IS
  'Independently managed public URL assets. One row per slug, seeded verbatim '
  'from the 135 existing 2026 slugs. A programme rename does not change a slug; '
  'creating a new URL is a deliberate act that sets redirect_to_slug on the old '
  'one, permanently.';

COMMENT ON COLUMN programme_url.current_programme_id IS
  'The programme the URL currently resolves to. Repointed atomically on publish '
  'by matching lineage_id, so /programmes/<slug> follows the live catalogue '
  'while /programmes/<slug>?year=2026 still reaches the 2026 record.';

COMMENT ON COLUMN programme_url.redirect_to_slug IS
  'Set only when GIBS deliberately moves a URL. Never set speculatively during '
  'migration: the 2026 import creates no redirects at all.';

-- Resolution reads a single row by primary key, then follows one FK. The
-- indexes below serve the reverse lookups used when repointing on publish.
CREATE INDEX IF NOT EXISTS programme_url_lineage_idx
  ON programme_url (lineage_id)
  WHERE lineage_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS programme_url_current_programme_idx
  ON programme_url (current_programme_id)
  WHERE current_programme_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS programme_url_redirect_idx
  ON programme_url (redirect_to_slug)
  WHERE redirect_to_slug IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Deterministic resolution
-- ---------------------------------------------------------------------------
-- Returns one of four outcomes so the API can answer precisely instead of
-- guessing:
--   'redirect'  -> slug was superseded; follow redirect_to_slug
--   'current'   -> the live published programme for this slug
--   'historical'-> the programme for the explicitly requested year
--   'not_found' -> no such slug, or the slug does not belong to that year
--
-- SECURITY: this function is SECURITY DEFINER because it must be callable by
-- the anonymous role through the read-only catalogue policy. search_path is
-- pinned so a caller cannot hijack resolution via a temporary schema.
CREATE OR REPLACE FUNCTION resolve_programme_url(
  p_slug text,
  p_year smallint DEFAULT NULL
)
RETURNS TABLE (
  outcome          text,
  programme_id     uuid,
  catalogue_year   smallint,
  redirect_to_slug text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT
    CASE
      WHEN u.redirect_to_slug IS NOT NULL              THEN 'redirect'
      WHEN u.current_programme_id IS NULL               THEN 'not_found'
      -- A historical request that finds nothing for this slug in that year is
      -- not_found, never a silent substitution of some other programme.
      WHEN p_year IS NOT NULL AND h.programme_id IS NULL THEN 'not_found'
      WHEN p_year IS NOT NULL                           THEN 'historical'
      ELSE 'current'
    END::text,
    CASE
      -- A historical request must resolve THROUGH this slug. Falling back to
      -- current_programme_id here would answer 2026 with the 2027 record,
      -- which is precisely the bug the year-scoped model exists to prevent.
      WHEN p_year IS NOT NULL THEN h.programme_id
      ELSE u.current_programme_id
    END,
    CASE
      WHEN p_year IS NOT NULL AND h.programme_id IS NOT NULL THEN p_year
      WHEN u.current_programme_id IS NOT NULL               THEN cur.year
    END::smallint,
    u.redirect_to_slug
  FROM programme_url u
  LEFT JOIN LATERAL (
    SELECT cp.id AS programme_id
    FROM catalogue_programme cp
    JOIN catalogue_year cy ON cy.id = cp.catalogue_year_id
    WHERE cp.lineage_id = u.lineage_id
      AND u.lineage_id IS NOT NULL
      AND cy.year = p_year
    LIMIT 1
  ) h ON p_year IS NOT NULL
  LEFT JOIN LATERAL (
    SELECT cy.year
    FROM catalogue_programme cp
    JOIN catalogue_year cy ON cy.id = cp.catalogue_year_id
    WHERE cp.id = u.current_programme_id
    LIMIT 1
  ) cur ON u.current_programme_id IS NOT NULL
  WHERE u.slug = p_slug;
$$;

-- Revoked here and granted narrowly in 019. Without this the function would be
-- executable by PUBLIC by default, which contradicts the posture every other
-- function in the chain follows.
REVOKE EXECUTE ON FUNCTION resolve_programme_url(text, smallint) FROM PUBLIC;

COMMENT ON FUNCTION resolve_programme_url(text, smallint) IS
  'Deterministic URL resolution. With p_year NULL it returns the live published '
  'programme. With p_year set it returns ONLY a programme that genuinely belongs '
  'to that year via lineage; if the slug has no programme in that year it '
  'returns outcome=''not_found'' with a NULL programme_id, and the API must treat '
  'that as not-found rather than substituting another year''s record. '
  'Note that a slug with no lineage_id at all can only ever resolve as '
  'current''redirect''; the historical branch requires lineage, which is why '
  'clone_catalogue_year backfills programme_url.lineage_id as soon as lineage '
  'first exists.';

-- =============================================================================
-- END 013_programme_url.sql
-- =============================================================================
