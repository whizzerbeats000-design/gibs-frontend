-- =============================================================================
-- 012_catalogue_programme.sql — the year-specific published programme record
-- =============================================================================
--
-- STATUS: WRITTEN, NOT EXECUTED. See docs/backend/README.md.
--
-- RELATIONSHIP TO THE EXISTING PROTOTYPE (001_programme.sql, 002_programme_seed.sql)
--   001/002 are a pre-existing, unexecuted local prototype whose fee table
--   hangs off a non-versioned `programme` table. That shape cannot express a
--   catalogue year, so it is structurally incompatible with this model rather
--   than merely out of date. Those two files are left untouched as historical
--   artifacts and must NOT be applied together with this chain — see
--   scripts/db/apply_schema.py, which applies 010-020 only.
--
--   The two lookup tables (programme_category, destination) are NOT duplicated:
--   they are created here only if absent, with a shape identical to 001's, so
--   either file can introduce them without conflict.
--
-- WHAT THIS TABLE IS
--   One row = one programme as published in one catalogue year. A 2026 record
--   and a 2027 record for the same course are DIFFERENT ROWS with different
--   ids, even when they are the same course. This is what allows 2027 to change
--   a fee without touching what a 2026 enquiry points at.
--
-- WHAT IS DELIBERATELY NOT NORMALISED AWAY
--   Programmes are sold with published fees. An "obvious" cleanup is a content
--   change that only GIBS may authorise, so source awkwardness is preserved:
--
--   * title is NOT unique. Seven titles are shared by eight extra records; one
--     title is delivered at three hubs (int-kigali-2 / int-london-3 /
--     int-houston-5). Two Local pairs (loc-12/loc-103, loc-55/loc-77) share a
--     title with different category and different fee and look like data-entry
--     duplication. That is a GIBS question. All are imported unchanged.
--   * num is a GLOBAL 1-135 sequence that does NOT match the per-destination
--     sequence used by source_id and code. The inconsistency is real and is
--     preserved; "correcting" it would renumber published records.
--   * schedule_text stays free text. There are 128 distinct strings across 135
--     records in the form "<range> (<venue>), <range> (<venue>)". It is never
--     parsed into sessions, dates or weekdays.
--   * duration_label stays source text ("5 Days", "1 Week", "2 Weeks",
--     "1-2 Weeks"). The source is not machine-consistent and inventing a
--     numeric day count would be new data.
--   * legacy keeps the untouched source record so parity can be proven by
--     comparison and so "what did the source actually say?" never requires
--     re-deriving anything.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Reference tables. Created only if absent (see header note).
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS programme_category (
  id         smallserial PRIMARY KEY,
  name       text      NOT NULL UNIQUE,
  sort_order smallint  NOT NULL
);

COMMENT ON TABLE programme_category IS
  'The 15 ProgrammeCategory values, seeded verbatim by 020_reference_seed.sql '
  'including exact punctuation ("&", "and"). The frontend filters by exact '
  'string equality, so these are foreign keys rather than free text: a typo '
  'would silently drop a programme out of a filter with no error anywhere.';

CREATE TABLE IF NOT EXISTS destination (
  id               smallserial PRIMARY KEY,
  name             text      NOT NULL UNIQUE,
  default_currency char(3)   NOT NULL,
  is_local         boolean   NOT NULL,
  sort_order       smallint  NOT NULL,
  CONSTRAINT destination_currency_chk
    CHECK (default_currency IN ('NGN', 'USD', 'GBP'))
);

COMMENT ON TABLE destination IS
  'The 5 destinations. "Local" is a real destination here, not a NULL: the '
  'source distinguishes it that way and 113 of 135 programmes are Local. '
  'default_currency is recorded per hub for reference and for parity; the '
  'authoritative currency still lives on programme_fee, because that is where '
  'the source puts it.';

-- ---------------------------------------------------------------------------
-- catalogue_programme
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS catalogue_programme (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  catalogue_year_id uuid     NOT NULL REFERENCES catalogue_year(id) ON DELETE CASCADE,
  -- NULL means "new programme with no predecessor". See 011 for why this is a
  -- true statement rather than missing data.
  lineage_id     uuid        REFERENCES programme_lineage(id) ON DELETE SET NULL,
  -- The 2026 source id (loc-1, int-kigali-2, ...). Preserved verbatim so the
  -- database can always be traced back to the exact source record.
  source_id      text        NOT NULL,

  code           text        NOT NULL,
  num            smallint    NOT NULL,
  -- Exactly the generator's `slugify(title)[:60]` — the 60-character truncated
  -- title segment, unmodified.
  --
  -- 77 of the 135 titles slugify to more than 60 characters, so 77 of these
  -- segments are cut mid-word and end on a partial word ("...in-the-pu"). NEVER
  -- regenerate, normalise or re-slug; the public URL lives in programme_url and is
  -- immutable for the same reason.
  --
  -- This is NOT the whole slug, and reconstructing a URL from this column alone
  -- will produce a wrong URL for the 22 foreign programmes. The generator writes
  --
  --   Local:   course-{num}-{segment}
  --   Foreign: foreign-{destination}-{per-destination-num}-{segment}
  --
  -- and for foreign rows that embedded number is the per-destination sequence
  -- (int-kigali-1 carries 1) while `num` is the global sequence (114). Uniqueness
  -- of a foreign slug therefore comes from that embedded per-destination number,
  -- not from `num`.
  slug_segment   text        NOT NULL,

  title          text        NOT NULL,
  -- NOT NULL, NOT UNIQUE: see header.
  category_id    smallint    NOT NULL REFERENCES programme_category(id),
  destination_id smallint    NOT NULL REFERENCES destination(id),

  target_audience    text NOT NULL,
  schedule_text      text NOT NULL,
  duration_label     text NOT NULL,
  -- Verified true for all 113 Local and false for all 22 foreign, zero
  -- exceptions. Currently derivable from destination.is_local; stored because
  -- the live detail page renders it and parity asserts the invariant.
  in_plant_available boolean NOT NULL,
  fee_notes          text,

  -- Derived content, retained so the database can render a programme without
  -- reimplementing the Python generator templates, and so parity can be proven
  -- by comparison rather than by re-derivation. Regenerating them remains the
  -- Python pipeline's job.
  tagline              text   NOT NULL,
  summary              text   NOT NULL,
  format               text,
  audience             jsonb  NOT NULL,
  indicative_structure jsonb  NOT NULL,
  outcomes             jsonb  NOT NULL,
  faqs                 jsonb  NOT NULL,

  -- The complete, untouched source record, key for key. Deliberately
  -- duplicates the columns above: it is the faithfulness anchor and the
  -- audit answer to "what did the source say?". Revisit only once the database
  -- is canonical and verified — not before.
  legacy jsonb NOT NULL,

  -- 'listed' = part of this year's catalogue. 'removed' = dropped for THIS year
  -- but retained, so the year keeps a complete and auditable record of what was
  -- dropped and when.
  --
  -- Publication deliberately does NOT change this column. If it flipped to
  -- 'active' at publish time, the write would have to happen while the year is
  -- already non-draft, which would require either freezing the guard before the
  -- status flip or building a bypass into it. Keeping the column orthogonal to
  -- the year status makes the public read predicate a plain two-term condition
  -- (year is published AND entry_status = 'listed') and needs no bypass at all.
  entry_status text NOT NULL DEFAULT 'listed',

  -- Uniqueness is PER YEAR, not global. This is what lets the code policy stay
  -- a business decision: "GIBS-LOC-001" may be reused in 2027, or 2027 may
  -- start at GIBS-LOC-136, and neither choice needs a schema change. Historical
  -- rows always keep their originally published code.
  CONSTRAINT catalogue_programme_code_per_year_unique
    UNIQUE (catalogue_year_id, code),
  CONSTRAINT catalogue_programme_num_per_year_unique
    UNIQUE (catalogue_year_id, num),
  -- source_id is unique within a year too: it is the importer's conflict key.
  CONSTRAINT catalogue_programme_source_per_year_unique
    UNIQUE (catalogue_year_id, source_id),
  CONSTRAINT catalogue_programme_num_chk  CHECK (num > 0),
  -- Two code shapes exist in the source, and the CHECK has to accept both:
  --
  --   Local    GIBS-LOC-001          GIBS-[3 letters]-[3 digits]
  --   Foreign  GIBS-INT-KIG-01       GIBS-[3 letters]-[3 letters]-[2 digits]
  --
  -- An earlier draft of this CHECK used 'GIBS-[A-Z]{3}-[A-Z0-9]{2,4}', which
  -- silently accepts every Local code and rejects all 22 foreign ones, because
  -- the final group cannot contain the hyphen in "KIG-01". That failure was found
  -- by scripts/qa/schema_chain_check.py against the real 135 codes, not by
  -- reading — it would have surfaced as 22 constraint violations part way through
  -- the first import.
  --
  -- The CHECK is a typo-catcher, not a business rule: staff re-issue codes between
  -- years (that is why uniqueness is per-year), so this must not be tightened into
  -- a format the catalogue does not actually use.
  CONSTRAINT catalogue_programme_code_chk
    CHECK (code ~ '^GIBS-[A-Z]{3}-(?:[A-Z0-9]{2,3}-)?[0-9]{2,3}$'),
  CONSTRAINT catalogue_programme_entry_status_chk
    CHECK (entry_status IN ('listed', 'removed'))
);

COMMENT ON TABLE catalogue_programme IS
  'One row per programme per catalogue year. 135 rows expected for 2026. Row '
  'identity is the uuid; (catalogue_year_id, source_id) is the importer''s '
  'idempotency key and (catalogue_year_id, code) is the published-code key.';

COMMENT ON COLUMN catalogue_programme.source_id IS
  'Verbatim 2026 source id (loc-1 … int-houston-5). Never renumbered.';

COMMENT ON COLUMN catalogue_programme.slug_segment IS
  'The generator''s slugify(title)[:60] output, unmodified. 77 of 135 are '
  'truncated mid-word. Immutable.';

COMMENT ON COLUMN catalogue_programme.title IS
  'Intentionally NOT unique. Seven titles are shared by eight extra records; '
  'one title appears at three hubs. Do not deduplicate.';

COMMENT ON COLUMN catalogue_programme.schedule_text IS
  'Authoritative free text, 128 distinct values across 135 records. Never '
  'parsed into sessions, dates or weekdays. A structured programme_session '
  'model is a separate, human-verified project.';

COMMENT ON COLUMN catalogue_programme.legacy IS
  'The complete untouched source record. Parity anchor and audit answer.';

-- Public catalogue reads filter by year, then fan out by destination and by
-- category. These two composite indexes serve the exact queries the SPA makes.
CREATE INDEX IF NOT EXISTS catalogue_programme_year_destination_idx
  ON catalogue_programme (catalogue_year_id, destination_id);

CREATE INDEX IF NOT EXISTS catalogue_programme_year_category_idx
  ON catalogue_programme (catalogue_year_id, category_id);

CREATE INDEX IF NOT EXISTS catalogue_programme_slug_segment_idx
  ON catalogue_programme (slug_segment);

CREATE INDEX IF NOT EXISTS catalogue_programme_lineage_idx
  ON catalogue_programme (lineage_id)
  WHERE lineage_id IS NOT NULL;

-- =============================================================================
-- END 012_catalogue_programme.sql
-- =============================================================================
