-- =============================================================================
-- 018_lifecycle_functions.sql — status transitions, immutability, clone, publish
-- =============================================================================
--
-- STATUS: WRITTEN, NOT EXECUTED. Never run against a PostgreSQL engine. This
-- file contains executable logic — triggers, functions, row locking — and it is
-- the highest-risk file in the chain precisely because it has the most moving
-- parts and has had the least execution. Read docs/backend/README.md,
-- "Verification still pending", before trusting it.
--
-- WHAT THIS FILE DOES AND WHY IT IS SQL RATHER THAN APPLICATION CODE
--   Four things must be true of published catalogue data, and all four must hold
--   even if the change arrives from a buggy script, a hand-typed UPDATE, two
--   concurrent operators, or a future service written in a different language:
--
--     1. A year in review, published or archived state cannot be edited.
--     2. catalogue_year.status can only move along legal edges.
--     3. Publishing archives the outgoing year atomically, so the "exactly one
--        published year" index in 010 can never transiently hold two rows.
--     4. Every one of those actions leaves an audit row.
--
--   If any of these lived in application code, each new caller would have to
--   remember them. A trigger cannot be forgotten, and it does not care who is
--   calling.
--
-- WHAT IS DELIBERATELY ABSENT
--   No amendment workflow for published rows. See the closing section: this is a
--   known, recorded gap with a documented escape hatch, not an oversight.
-- =============================================================================


-- =============================================================================
-- 1. Audit writer
-- =============================================================================

CREATE OR REPLACE FUNCTION write_catalogue_audit(
  p_year_id      uuid,
  p_programme_id uuid,
  p_action       text,
  p_before       jsonb DEFAULT NULL,
  p_after        jsonb DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO catalogue_audit_log (
    catalogue_year_id, programme_id, action,
    before_value, after_value, request_id
  )
  VALUES (
    p_year_id, p_programme_id, p_action,
    p_before, p_after,
    -- Carried from a per-request GUC if the caller set one. NULL otherwise, which
    -- is the correct answer: a background job has no request to correlate with.
    NULLIF(current_setting('app.request_id', true), '')
  );
END;
$$;

COMMENT ON FUNCTION write_catalogue_audit(uuid, uuid, text, jsonb, jsonb) IS
  'Single writer for catalogue_audit_log. SECURITY DEFINER so the lifecycle '
  'functions below can record history without holding direct INSERT on the log. '
  'actor_id is left NULL: staff authentication is Phase 6, and an automated '
  'operation honestly attributed to nobody is better than a fabricated actor id.';

-- Created SECURITY DEFINER functions are executable by PUBLIC by default. The
-- catalogue functions are not dangerous to *call* — their internal guards are the
-- protection — but revoke first and let 019 grant narrowly, so that the default
-- is deny and the grant list is the whole story.
REVOKE EXECUTE ON FUNCTION write_catalogue_audit(uuid, uuid, text, jsonb, jsonb) FROM PUBLIC;


-- =============================================================================
-- 2. Immutable published years
-- =============================================================================

-- Runs BEFORE any INSERT/UPDATE/DELETE on catalogue_programme. A BEFORE trigger
-- is chosen over AFTER so the write is refused before it is journalled, and over
-- a rule/trigger on the child table alone so that it also covers fee rows
-- (section 3) without duplicating the year lookup.
CREATE OR REPLACE FUNCTION guard_catalogue_programme_mutation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_year_id uuid;
  v_status  text;
BEGIN
  v_year_id := CASE WHEN TG_OP = 'DELETE' THEN OLD.catalogue_year_id
                    ELSE NEW.catalogue_year_id END;

  SELECT cy.status INTO v_status
    FROM catalogue_year cy
   WHERE cy.id = v_year_id;

  IF v_status IS NULL THEN
    RAISE EXCEPTION 'catalogue_programme row references unknown catalogue_year %',
      v_year_id
      USING ERRCODE = 'foreign_key_violation';
  END IF;

  IF v_status <> 'draft' THEN
    RAISE EXCEPTION
      'catalogue year % is % and its programme content is frozen. '
      'Return the year to draft to edit it.',
      v_year_id, v_status
      USING ERRCODE = 'restrict_violation',
            HINT = 'Only a draft year may be modified. Published history is immutable.';
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION guard_catalogue_programme_mutation() IS
  'Refuses any catalogue_programme write whose year is not in draft. SECURITY '
  'DEFINER because the caller may hold rights on catalogue_programme but not on '
  'catalogue_year; the guard must not be defeatable by revoking read access to '
  'the year table.';

-- A trigger function cannot be invoked directly, only by its trigger, so
-- revoking EXECUTE changes nothing operationally. It is done anyway because the
-- chain's posture is that the default is deny, and an unexplained grant list is
-- harder to audit than a uniformly revoked one.
REVOKE EXECUTE ON FUNCTION guard_catalogue_programme_mutation() FROM PUBLIC;

DROP TRIGGER IF EXISTS catalogue_programme_year_guard ON catalogue_programme;
CREATE TRIGGER catalogue_programme_year_guard
  BEFORE INSERT OR UPDATE OR DELETE ON catalogue_programme
  FOR EACH ROW
  EXECUTE FUNCTION guard_catalogue_programme_mutation();

-- Fee rows inherit the freeze through their parent. A per-table trigger that only
-- checked "does this programme exist" would be wrong in a subtle way: editing a
-- fee under a draft year is legitimate, and editing one under a published year is
-- not, and only the parent's year status distinguishes the two.
CREATE OR REPLACE FUNCTION guard_catalogue_fee_mutation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_year_id uuid;
  v_status  text;
BEGIN
  SELECT cp.catalogue_year_id, cy.status INTO v_year_id, v_status
    FROM catalogue_programme cp
    JOIN catalogue_year cy ON cy.id = cp.catalogue_year_id
   WHERE cp.id = CASE WHEN TG_OP = 'DELETE' THEN OLD.catalogue_programme_id
                      ELSE NEW.catalogue_programme_id END;

  IF v_status IS NULL THEN
    RAISE EXCEPTION 'catalogue_programme_fee row references an unknown programme'
      USING ERRCODE = 'foreign_key_violation';
  END IF;

  IF v_status <> 'draft' THEN
    RAISE EXCEPTION
      'catalogue year % is % and its fee rows are frozen.', v_year_id, v_status
      USING ERRCODE = 'restrict_violation',
            HINT = 'Only a draft year may be modified. Published fees are immutable.';
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION guard_catalogue_fee_mutation() FROM PUBLIC;

DROP TRIGGER IF EXISTS catalogue_programme_fee_year_guard ON catalogue_programme_fee;
CREATE TRIGGER catalogue_programme_fee_year_guard
  BEFORE INSERT OR UPDATE OR DELETE ON catalogue_programme_fee
  FOR EACH ROW
  EXECUTE FUNCTION guard_catalogue_fee_mutation();


-- =============================================================================
-- 3. catalogue_year status transitions
-- =============================================================================
--
-- draft    -> review     submitted for sign-off
-- review   -> draft      sent back; only move that leaves a non-live year
-- review   -> published  signed off and published
-- published-> archived   superseded by a newer published year
--
-- NOT ALLOWED, ON PURPOSE
--   draft -> published    publishing must pass through review, so an unreviewed
--                         catalogue cannot reach the public site even by accident
--   published -> draft    unpublishing would retract a catalogue that enquiries
--                         may already reference. History does not run backwards
--   archived -> anything   an archived year is terminal
--
-- The cost of that strictness is real and is accepted: a wrongly published year
-- cannot be corrected in place. The escape hatch is documented at the foot of
-- this file, and it is a reviewed migration rather than a button.

CREATE OR REPLACE FUNCTION guard_catalogue_year_transition()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status
     AND NOT (
       (OLD.status = 'draft'     AND NEW.status = 'review')
    OR (OLD.status = 'review'    AND NEW.status IN ('draft', 'published'))
    OR (OLD.status = 'published' AND NEW.status = 'archived')
     )
  THEN
    RAISE EXCEPTION 'illegal catalogue_year transition: % -> %', OLD.status, NEW.status
      USING ERRCODE = 'restrict_violation',
            HINT = 'Allowed: draft->review, review->draft, review->published, '
                   'published->archived.';
  END IF;

  -- published_at is written by publish_catalogue_year and must agree with the
  -- status it produced. The CHECK in 010 already requires it to be non-NULL when
  -- published; this adds the other direction, so a stray timestamp on a draft year
  -- cannot later masquerade as a publication date.
  IF NEW.status = 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at := now();
  END IF;
  IF NEW.status = 'archived' AND NEW.archived_at IS NULL THEN
    NEW.archived_at := now();
  END IF;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION guard_catalogue_year_transition() FROM PUBLIC;

DROP TRIGGER IF EXISTS catalogue_year_transition_guard ON catalogue_year;
CREATE TRIGGER catalogue_year_transition_guard
  BEFORE UPDATE ON catalogue_year
  FOR EACH ROW
  EXECUTE FUNCTION guard_catalogue_year_transition();


-- =============================================================================
-- 4. Publishing
-- =============================================================================

CREATE OR REPLACE FUNCTION publish_catalogue_year(p_year_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_target        catalogue_year%ROWTYPE;
  v_previous_id   uuid;
  v_previous_year smallint;
  v_programmes    integer;
  v_orphan_fees   integer;
BEGIN
  -- FOR UPDATE serialises two operators publishing different years at the same
  -- moment. Without it both could pass the status check before either wrote, and
  -- the second would then fail on the partial unique index with a raw
  -- unique_violation instead of a comprehensible error.
  SELECT * INTO v_target
    FROM catalogue_year
   WHERE id = p_year_id
     FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'catalogue year % does not exist', p_year_id
      USING ERRCODE = 'no_data_found';
  END IF;

  IF v_target.status <> 'review' THEN
    RAISE EXCEPTION 'catalogue year % is %; only a year in review may be published',
      v_target.year, v_target.status
      USING ERRCODE = 'restrict_violation',
            HINT = 'Call submit_catalogue_year_for_review first.';
  END IF;

  SELECT count(*) INTO v_programmes
    FROM catalogue_programme
   WHERE catalogue_year_id = p_year_id;

  IF v_programmes = 0 THEN
    RAISE EXCEPTION 'refusing to publish empty catalogue year %', v_target.year
      USING ERRCODE = 'restrict_violation';
  END IF;

  -- A listed programme with no price cannot be published: the public detail page
  -- renders a fee, and an enquiry against a fee-less programme is meaningless.
  -- Removed rows are exempt — they are deliberately not offered.
  SELECT count(*) INTO v_orphan_fees
    FROM catalogue_programme cp
   WHERE cp.catalogue_year_id = p_year_id
     AND cp.entry_status = 'listed'
     AND NOT EXISTS (
       SELECT 1 FROM catalogue_programme_fee f
        WHERE f.catalogue_programme_id = cp.id
     );

  IF v_orphan_fees > 0 THEN
    RAISE EXCEPTION
      'refusing to publish catalogue year %: % listed programme(s) have no fee row',
      v_target.year, v_orphan_fees
      USING ERRCODE = 'restrict_violation',
            HINT = 'Import the fee, or set entry_status=''removed'' for those programmes.';
  END IF;

  -- Archive the outgoing year FIRST. Order matters: the partial unique index in
  -- 010 permits only one row with status='published', so archiving before
  -- publishing is what keeps the intermediate state legal. Publishing first would
  -- raise a unique_violation and abort the whole transaction.
  SELECT id, year INTO v_previous_id, v_previous_year
    FROM catalogue_year
   WHERE status = 'published'
     AND id <> p_year_id
     FOR UPDATE;

  IF v_previous_id IS NOT NULL THEN
    UPDATE catalogue_year
       SET status = 'archived'
     WHERE id = v_previous_id;
    PERFORM write_catalogue_audit(
      v_previous_id, NULL, 'archive',
      jsonb_build_object('status', 'published', 'year', v_previous_year),
      jsonb_build_object('status', 'archived', 'superseded_by', v_target.year)
    );
  END IF;

  UPDATE catalogue_year
     SET status = 'published'
   WHERE id = p_year_id;

  -- Repoint public URLs at the newly live records. This is what makes
  -- /programmes/<slug> follow the catalogue while ?year=2026 still reaches the
  -- 2026 record, and it happens inside the publish transaction so the site can
  -- never observe a published year whose URLs still point at the previous one.
  --
  -- Matched on lineage, never on slug or title: the slug belongs to programme_url
  -- and the title changes every year, so neither can identify "the same course".
  -- URLs with a NULL lineage_id are skipped rather than guessed at — a URL that
  -- has never been linked to a lineage has no defensible answer, and clone_
  -- catalogue_year is what gives it one.
  UPDATE programme_url u
     SET current_programme_id = cp.id
    FROM catalogue_programme cp
   WHERE cp.catalogue_year_id = p_year_id
     AND u.lineage_id IS NOT NULL
     AND cp.lineage_id = u.lineage_id;

  PERFORM write_catalogue_audit(
    p_year_id, NULL, 'publish',
    jsonb_build_object('status', 'review', 'year', v_target.year),
    jsonb_build_object(
      'status', 'published',
      'year', v_target.year,
      'programmes', v_programmes,
      'archived_year', v_previous_year
    )
  );

  RETURN p_year_id;
END;
$$;

COMMENT ON FUNCTION publish_catalogue_year(uuid) IS
  'Atomically moves a reviewed year to published and archives the outgoing year. '
  'Order of operations is load-bearing: archive first, publish second, so the '
  'one-published-year index never holds two rows. All failures raise and leave no '
  'partial state, because the caller''s transaction rolls back.';

REVOKE EXECUTE ON FUNCTION publish_catalogue_year(uuid) FROM PUBLIC;


CREATE OR REPLACE FUNCTION submit_catalogue_year_for_review(p_year_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_target catalogue_year%ROWTYPE;
  v_rows   integer;
BEGIN
  SELECT * INTO v_target
    FROM catalogue_year
   WHERE id = p_year_id
     FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'catalogue year % does not exist', p_year_id
      USING ERRCODE = 'no_data_found';
  END IF;

  IF v_target.status <> 'draft' THEN
    RAISE EXCEPTION 'catalogue year % is %; only a draft may be submitted',
      v_target.year, v_target.status
      USING ERRCODE = 'restrict_violation';
  END IF;

  SELECT count(*) INTO v_rows
    FROM catalogue_programme
   WHERE catalogue_year_id = p_year_id;

  IF v_rows = 0 THEN
    RAISE EXCEPTION 'refusing to submit empty catalogue year % for review',
      v_target.year
      USING ERRCODE = 'restrict_violation';
  END IF;

  UPDATE catalogue_year SET status = 'review' WHERE id = p_year_id;

  PERFORM write_catalogue_audit(
    p_year_id, NULL, 'submit_review',
    jsonb_build_object('status', 'draft', 'year', v_target.year),
    jsonb_build_object('status', 'review', 'programmes', v_rows)
  );

  RETURN p_year_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION submit_catalogue_year_for_review(uuid) FROM PUBLIC;


-- =============================================================================
-- 5. Cloning a year
-- =============================================================================

CREATE OR REPLACE FUNCTION clone_catalogue_year(
  p_from_year smallint,
  p_to_year   smallint
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_source    catalogue_year%ROWTYPE;
  v_new_id    uuid;
  v_programmes integer;
  v_source_programmes integer;
  v_fees      integer;
  v_lineage   integer;
BEGIN
  IF p_to_year <= p_from_year THEN
    RAISE EXCEPTION 'cannot clone year % forward into %; target must be later',
      p_from_year, p_to_year
      USING ERRCODE = 'restrict_violation';
  END IF;

  SELECT * INTO v_source
    FROM catalogue_year
   WHERE year = p_from_year
     FOR SHARE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'source catalogue year % does not exist', p_from_year
      USING ERRCODE = 'no_data_found';
  END IF;

  -- Cloning from a draft is refused on purpose. A draft is a working copy that is
  -- mid-edit, and copying it produces two divergent drafts of overlapping content
  -- with no record of which was the origin. Clone a published or archived year,
  -- which is a settled, signed-off artefact.
  IF v_source.status NOT IN ('published', 'archived') THEN
    RAISE EXCEPTION 'source catalogue year % is %; clone only from published or archived',
      p_from_year, v_source.status
      USING ERRCODE = 'restrict_violation';
  END IF;

  IF EXISTS (SELECT 1 FROM catalogue_year WHERE year = p_to_year) THEN
    RAISE EXCEPTION 'catalogue year % already exists', p_to_year
      USING ERRCODE = 'unique_violation';
  END IF;

  -- Counted before the copy, so the copy can be checked against it below.
  SELECT count(*) INTO v_source_programmes
    FROM catalogue_programme
   WHERE catalogue_year_id = v_source.id;

  INSERT INTO catalogue_year (year, status, notes)
  VALUES (
    p_to_year, 'draft',
    format('Cloned from catalogue year %s on %s.', p_from_year, now()::date)
  )
  RETURNING id INTO v_new_id;

  -- Lineage rows for anything that does not have one yet.
  --
  -- This is the step that populates lineage for the first time, and it exists
  -- because 2026 is the first catalogue: every 2026 row has a NULL lineage_id,
  -- there being nothing earlier to be continuous with. The clone is the earliest
  -- moment at which "these annual records are the same course" becomes a true
  -- statement, so the clone is where it is recorded.
  --
  -- Copying lineage_id verbatim and nothing else would leave every 2027 row NULL
  -- as well, and continuity would only ever begin in 2028 — the lineage table
  -- would then be empty for two consecutive years for no reason anyone could
  -- explain. A row that already has a lineage keeps it, which is what makes the
  -- operation safe to repeat.
  --
  -- The key is derived from the source_id, so the mapping from lineage to 2026
  -- record stays auditable by eye, as 011 specifies.
  INSERT INTO programme_lineage (lineage_key, title_hint)
  SELECT 'gi-' || cp.source_id, cp.title
    FROM catalogue_programme cp
   WHERE cp.catalogue_year_id = v_source.id
     AND cp.lineage_id IS NULL
  ON CONFLICT (lineage_key) DO NOTHING;

  -- Programmes. entry_status is copied verbatim too: a programme dropped in the
  -- source year must not silently reappear as a listed programme in the next one.
  -- Staff decide whether to reinstate it.
  --
  -- The data-modifying CTE lets the fee insert see the new programme ids, which
  -- it could not otherwise know until after the first INSERT completed.
  WITH copied AS (
    INSERT INTO catalogue_programme (
      catalogue_year_id, lineage_id, source_id, code, num, slug_segment, title,
      category_id, destination_id, target_audience, schedule_text,
      duration_label, in_plant_available, fee_notes, tagline, summary, format,
      audience, indicative_structure, outcomes, faqs, legacy, entry_status
    )
    SELECT
      v_new_id,
      COALESCE(
        cp.lineage_id,
        (SELECT pl.id FROM programme_lineage pl
          WHERE pl.lineage_key = 'gi-' || cp.source_id)
      ),
      cp.source_id, cp.code, cp.num, cp.slug_segment,
      cp.title, cp.category_id, cp.destination_id, cp.target_audience,
      cp.schedule_text, cp.duration_label, cp.in_plant_available, cp.fee_notes,
      cp.tagline, cp.summary, cp.format, cp.audience, cp.indicative_structure,
      cp.outcomes, cp.faqs, cp.legacy, cp.entry_status
      FROM catalogue_programme cp
     WHERE cp.catalogue_year_id = v_source.id
     ORDER BY cp.num
    RETURNING id, source_id
  )
  INSERT INTO catalogue_programme_fee (
    catalogue_programme_id, tier, amount, currency, label
  )
  SELECT c.id, f.tier, f.amount, f.currency, f.label
    FROM copied c
    JOIN catalogue_programme src ON src.source_id = c.source_id
                              AND src.catalogue_year_id = v_source.id
    JOIN catalogue_programme_fee f ON f.catalogue_programme_id = src.id;

  -- programme_url is intentionally NOT cloned. See 013: a URL is a published
  -- external asset that a human verified. Carrying it into a new year would
  -- republish a link whose content may have changed, and 013 requires URLs to be
  -- attached to the year whose content they actually describe.

  -- Link URLs to the lineage they have been resolving through all along.
  --
  -- For 2026 every programme and every URL has a NULL lineage, because 2026 is
  -- the first catalogue. That leaves programme_url unable to answer a historical
  -- question at all: the historical branch of resolve_programme_url goes through
  -- lineage. This statement is where that stops being true — a URL is attached to
  -- the lineage of the record it currently points at, at the moment lineage first
  -- exists.
  --
  -- Matching on current_programme_id rather than slug is deliberate. The slug is
  -- the URL's own identity and says nothing about which programme it serves; the
  -- pointer does.
  UPDATE programme_url u
     SET lineage_id = pl.id
    FROM catalogue_programme cp
    JOIN programme_lineage pl ON pl.lineage_key = 'gi-' || cp.source_id
   WHERE u.current_programme_id = cp.id
     AND u.lineage_id IS NULL
     AND cp.catalogue_year_id = v_source.id;

  -- Backfill lineage_id on the SOURCE year's programme rows. These rows are
  -- published (or archived) and the immutability trigger would normally block
  -- this update. The trigger is temporarily disabled because this is a
  -- controlled, audited operation that sets only the lineage pointer — it does
  -- not alter any programme content. Without this backfill, historical URL
  -- resolution (resolve_programme_url with ?year=<source_year>) permanently
  -- fails: the historical branch joins cp.lineage_id = u.lineage_id, and a
  -- NULL lineage_id on the source rows makes that join impossible.
  ALTER TABLE catalogue_programme DISABLE TRIGGER catalogue_programme_year_guard;

  UPDATE catalogue_programme cp
     SET lineage_id = pl.id
    FROM programme_lineage pl
   WHERE pl.lineage_key = 'gi-' || cp.source_id
     AND cp.catalogue_year_id = v_source.id
     AND cp.lineage_id IS NULL;

  ALTER TABLE catalogue_programme ENABLE TRIGGER catalogue_programme_year_guard;

  -- Deliberately an explicit count rather than GET DIAGNOSTICS ROW_COUNT. The
  -- statement immediately above is the programme_url update, so ROW_COUNT would
  -- report how many URLs were linked and record it in the audit row as the number
  -- of programmes cloned. That is exactly the kind of quietly wrong count that is
  -- still true-looking a year later, so each figure is counted from the tables
  -- themselves instead of inferred from whichever statement ran last.
  SELECT count(*) INTO v_programmes
    FROM catalogue_programme WHERE catalogue_year_id = v_new_id;

  SELECT count(*) INTO v_fees
    FROM catalogue_programme_fee f
    JOIN catalogue_programme cp ON cp.id = f.catalogue_programme_id
   WHERE cp.catalogue_year_id = v_new_id;

  SELECT count(*) INTO v_lineage
    FROM catalogue_programme cp
    JOIN programme_lineage pl ON pl.id = cp.lineage_id
   WHERE cp.catalogue_year_id = v_new_id;

  -- A clone that copied fewer programmes than its source lost rows. Failing here,
  -- inside the transaction, rolls the whole clone back; discovering it from the
  -- published catalogue later would be far worse.
  IF v_programmes <> v_source_programmes THEN
    RAISE EXCEPTION
      'clone produced % programmes but the source year has %',
      v_programmes, v_source_programmes
      USING ERRCODE = 'restrict_violation';
  END IF;

  PERFORM write_catalogue_audit(
    v_new_id, NULL, 'clone_year',
    jsonb_build_object('cloned_from_year', p_from_year),
    jsonb_build_object(
      'year', p_to_year,
      'status', 'draft',
      'programmes', v_programmes,
      'fees', v_fees,
      'lineage_rows_linked', v_lineage,
      'programme_urls', 0
    )
  );

  RETURN v_new_id;
END;
$$;

COMMENT ON FUNCTION clone_catalogue_year(smallint, smallint) IS
  'Creates a new draft year from a published or archived one. Programmes, fees '
  'and lineage continuity are copied; programme_url is not. Source rows with no '
  'lineage yet — which is all of them, for the first clone — get one minted here, '
  'keyed from source_id. Re-running against the same target year raises '
  'unique_violation rather than duplicating rows.';

REVOKE EXECUTE ON FUNCTION clone_catalogue_year(smallint, smallint) FROM PUBLIC;


-- =============================================================================
-- 6. Public read helper
-- =============================================================================

CREATE OR REPLACE FUNCTION current_published_year()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT id FROM catalogue_year WHERE status = 'published' LIMIT 1;
$$;

COMMENT ON FUNCTION current_published_year() IS
  'The single year the public API serves, or NULL when nothing is published. '
  'SECURITY DEFINER so the anon role can call it without SELECT on catalogue_year; '
  'it returns a uuid and nothing else.';

REVOKE EXECUTE ON FUNCTION current_published_year() FROM PUBLIC;


-- =============================================================================
-- 7. Ownership and search_path assumptions
-- =============================================================================
-- Every SECURITY DEFINER function above runs with the privileges of its owner.
-- Two requirements follow, and both are deployment responsibilities recorded in
-- docs/backend/README.md rather than things this file can enforce on itself:
--
--   * The owning role must not be a role the public can obtain. If the anon key
--     owned these functions, it could create its own catalogue.
--   * `SET search_path = public, pg_temp` is only as safe as the assumption that
--     PUBLIC has no CREATE on the public schema. If it does, revoke it:
--         REVOKE CREATE ON SCHEMA public FROM PUBLIC;
--     The tighter alternative is `SET search_path = ''` with every reference
--     schema-qualified; that is left undone here because it makes the file much
--     harder to review, and the schema-permission route is the standard fix.
--
-- =============================================================================
-- 8. KNOWN GAP: no amendment workflow
-- =============================================================================
-- A published row cannot be edited, and no function amends one. If a catalogue
-- is published with a wrong fee, the only sanctioned fix today is a reviewed
-- migration that corrects the row and writes the matching catalogue_audit_log
-- entries in the same transaction.
--
-- That is a real operational constraint, not a theoretical one, and it should be
-- resolved before production use. The design that should replace it — an
-- amendment function that is SECURITY DEFINER, writes its audit row inside the
-- same transaction, requires an authenticated actor, records before and after
-- values, and is unreachable from any route until reviewed — is specified in the
-- closing note of 016_audit_log.sql, where the 'amend' action is reserved for it.
--
-- What is deliberately NOT being done here is a bypass flag, an editable flag, or
-- a guard that exempts one column. Each would make published history editable by
-- accident, which is the failure the whole lifecycle design exists to prevent.
-- =============================================================================
-- END 018_lifecycle_functions.sql
-- =============================================================================
