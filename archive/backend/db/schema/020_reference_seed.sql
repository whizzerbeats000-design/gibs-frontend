-- =============================================================================
-- 020_reference_seed.sql — the 15 categories and 5 destinations
-- =============================================================================
--
-- STATUS: WRITTEN, NOT EXECUTED. Never applied to any database.
--
-- WHAT THIS IS
--   The two lookup tables, seeded. That is all. There are 20 rows in this file
--   and they are the only rows in the whole chain that are written by hand rather
--   than imported, which makes them the most transcription-prone part of the
--   schema. Everything below exists to make that transcription checkable.
--
-- WHY THESE TABLES ARE FOREIGN KEYS AND NOT FREE TEXT
--   The frontend filters the catalogue by exact string equality on category and
--   destination (src/pages/Programmes.tsx). A misspelling — "Telecom & Utility
--   Regulation" instead of "Telecom & Utilities Regulation" — would not raise an
--   error anywhere. It would silently make that category return zero programmes,
--   and the filter chip would appear to work while selecting nothing. A foreign
--   key cannot be misspelled that way.
--
-- WHY THE PUNCTUATION IS EXACT
--   The ampersands in "Telecom & Utilities Regulation", "Consumer Protection &
--   Utilities", "Oil & Gas Sector", "Secretarial Administration & Management",
--   "Capital Market & Securities Management" and "Power & Energy Sector" are
--   literal ampersands in the source, not a stand-in for "and". The rest of the
--   categories genuinely contain the word "and". Rewriting either form silently
--   re-partitions the catalogue's filter facets.
--
-- DOUBLE-ENTRY, AND HOW IT IS MITIGATED
--   These 20 strings now exist in two places: scripts/import/_programme_source.py
--   (CATEGORY_ORDER, DESTINATION_ORDER) and in this file. That is a real
--   transcription risk and it is handled by checking rather than by trusting:
--
--     * This file re-reads its own table at the end and raises if a name or a
--       sort_order does not match what it inserted.
--     * scripts/qa/parity_check.py independently compares the database's lookup
--       contents against the snapshot, so a transcription error that survived this
--       file would still be caught before anyone relies on it.
--
--   Do not edit either copy to fix a mismatch. Find out which one is wrong first;
--   they are not both authoritative and "the database is now the truth" is how a
--   catalogue loses its filter facets without anyone noticing.
--
-- sort_order
--   The source declaration order of the TypeScript unions, 1-based. It is not a
--   business ranking — GIBS has not expressed one — and it exists so an imported
--   catalogue can be diffed against the source in a stable order. Nothing in the
--   frontend sorts by it.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Categories: 15
-- -----------------------------------------------------------------------------
INSERT INTO programme_category (name, sort_order) VALUES
  ('Accounting and Financial Management',       1),
  ('General Administration and Management',     2),
  ('Telecom & Utilities Regulation',            3),
  ('Consumer Protection & Utilities',           4),
  ('Environmental Sustainability & Management', 5),
  ('Oil & Gas Sector',                          6),
  ('Secretarial Administration & Management',   7),
  ('Capital Market & Securities Management',    8),
  ('Information Technology Workshops',          9),
  ('Legal & Legislative Studies',              10),
  ('Power & Energy Sector',                    11),
  ('Maritime & Transportation',               12),
  ('Pension Management',                       13),
  ('Special Executive Training',               14),
  ('Foreign Executive Training',               15)
ON CONFLICT (name) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Destinations: 5
-- -----------------------------------------------------------------------------
-- default_currency is the currency recorded for the hub. The authoritative
-- currency still lives on each catalogue_programme_fee row, because that is where
-- the source puts it; this column exists for reference and for parity. The
-- verified invariant — all 137 fees match their hub's default currency, with zero
-- exceptions — is asserted by scripts/qa/parity_check.py, not by a constraint.
--
-- "Local" is a destination here, not a NULL or a flag. The source treats it as
-- one of five, and 113 of 135 programmes are Local. Modelling it as NULL or as
-- "not foreign" would make the common case the awkward one.
INSERT INTO destination (name, default_currency, is_local, sort_order) VALUES
  ('Local',   'NGN', true,  1),
  ('Kigali',  'USD', false, 2),
  ('Dubai',   'USD', false, 3),
  ('London',  'GBP', false, 4),
  ('Houston', 'USD', false, 5)
ON CONFLICT (name) DO NOTHING;


-- -----------------------------------------------------------------------------
-- Self-verification
-- -----------------------------------------------------------------------------
-- Re-reads what actually landed and compares it against the literal values above.
-- If ON CONFLICT silently kept a different row — because 001_programme.sql had
-- already created these tables with different contents — this raises instead of
-- leaving a subtly wrong lookup table in place.
DO $$
DECLARE
  v_bad text;
BEGIN
  SELECT string_agg(format('%s (db=%s, file=%s)', name, sort_order, v_file), '; ')
    INTO v_bad
    FROM (VALUES
      ('Accounting and Financial Management',        1),
      ('General Administration and Management',      2),
      ('Telecom & Utilities Regulation',             3),
      ('Consumer Protection & Utilities',            4),
      ('Environmental Sustainability & Management',  5),
      ('Oil & Gas Sector',                           6),
      ('Secretarial Administration & Management',    7),
      ('Capital Market & Securities Management',     8),
      ('Information Technology Workshops',           9),
      ('Legal & Legislative Studies',               10),
      ('Power & Energy Sector',                     11),
      ('Maritime & Transportation',                12),
      ('Pension Management',                        13),
      ('Special Executive Training',                14),
      ('Foreign Executive Training',                15)
    ) AS f(name, v_file)
   LEFT JOIN programme_category pc ON pc.name = f.name
  WHERE pc.id IS NULL OR pc.sort_order <> f.v_file;

  IF v_bad IS NOT NULL THEN
    RAISE EXCEPTION
      'programme_category does not match this seed file: %', v_bad;
  END IF;

  SELECT string_agg(format('%s (file=%s/%s/%s, db=%s/%s/%s)', name,
                           v_file, v_is_local, v_sort,
                           default_currency, is_local, sort_order), '; ')
    INTO v_bad
    FROM (VALUES
      ('Local',   'NGN', true,  1),
      ('Kigali',  'USD', false, 2),
      ('Dubai',   'USD', false, 3),
      ('London',  'GBP', false, 4),
      ('Houston', 'USD', false, 5)
    ) AS f(name, v_file, v_is_local, v_sort)
   LEFT JOIN destination d ON d.name = f.name
  WHERE d.id IS NULL
     OR d.default_currency <> f.v_file
     OR d.is_local          IS DISTINCT FROM f.v_is_local
     OR d.sort_order        <> f.v_sort;

  IF v_bad IS NOT NULL THEN
    RAISE EXCEPTION
      'destination does not match this seed file: %', v_bad;
  END IF;

  -- Counts, not just contents. A table holding 16 categories, one of which is a
  -- typo, would pass every comparison above.
  IF (SELECT count(*) FROM programme_category) <> 15 THEN
    RAISE EXCEPTION 'expected exactly 15 programme categories, found %',
      (SELECT count(*) FROM programme_category);
  END IF;
  IF (SELECT count(*) FROM destination) <> 5 THEN
    RAISE EXCEPTION 'expected exactly 5 destinations, found %',
      (SELECT count(*) FROM destination);
  END IF;

  RAISE NOTICE 'reference seed verified: 15 categories, 5 destinations';
END;
$$;


-- -----------------------------------------------------------------------------
-- Post-import verification — run AFTER the catalogue import, not here
-- -----------------------------------------------------------------------------
-- The seed cannot know whether the imported programmes referenced only these 20
-- values. Run this once the data is loaded; it must return zero rows.
--
--   SELECT 'unknown category' AS problem, cp.source_id, cp.category_id::text AS detail
--     FROM catalogue_programme cp
--     LEFT JOIN programme_category pc ON pc.id = cp.category_id
--    WHERE pc.id IS NULL
--   UNION ALL
--   SELECT 'unknown destination', cp.source_id, cp.destination_id::text
--     FROM catalogue_programme cp
--     LEFT JOIN destination d ON d.id = cp.destination_id
--    WHERE d.id IS NULL;
--
-- And the currency invariant, which must also return zero rows:
--
--   SELECT 'currency mismatch' AS problem, cp.source_id,
--          f.currency::text || ' != ' || d.default_currency::text AS detail
--     FROM catalogue_programme_fee f
--     JOIN catalogue_programme cp ON cp.id = f.catalogue_programme_id
--     JOIN destination d ON d.id = cp.destination_id
--    WHERE f.currency <> d.default_currency;
-- =============================================================================
-- END 020_reference_seed.sql
-- =============================================================================