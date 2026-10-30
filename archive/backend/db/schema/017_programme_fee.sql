-- =============================================================================
-- 017_programme_fee.sql — year-specific price tiers for a catalogue programme
-- =============================================================================
--
-- STATUS: WRITTEN, NOT EXECUTED. See docs/backend/README.md.
--
-- WHY FEES ARE A CHILD TABLE AND NOT A COLUMN
--   The source stores a price three ways and none of them is a single column:
--
--     fee          390000            numeric primary tier
--     fees         "₦390,000"        display string, sometimes a COMPOSITE of
--                                    two tiers joined with " / "
--     feeSecondary 9500              optional second tier (2 records)
--     feeNotes     "$5,000 USD ..."  free text, NOT derivable from the numbers
--                                    (3 records)
--
--   A single "fee numeric" column would silently drop the second Houston tier.
--   So the tiers become rows, and the two fields that are genuinely text stay
--   text and stay where they already are.
--
-- WHAT IS EXPECTED AFTER IMPORT
--   137 rows for 2026: 135 tier-1 rows (one per programme) plus 2 tier-2 rows.
--   scripts/qa/parity_check.py asserts both the 137 total and the identity of
--   the two tier-2 records. Do not "tidy" them into the primary tier.
--
-- WHY fee_notes IS NOT REPEATED HERE
--   The free-text note belongs to the programme, not to a tier: on all three
--   records it describes the tier *pair*. It is stored once on
--   catalogue_programme.fee_notes (012) and deliberately not duplicated, because
--   a second copy would be free to drift from the first.
--
-- WHY THE DISPLAY STRING IS NOT STORED
--   The formatted string is fully derivable from (amount, currency) — verified
--   byte-for-byte against the source:
--
--     NGN  "₦390,000"          sign + grouped integer, no currency code
--     USD  "$4,800 USD"        sign + grouped integer + " USD"
--     GBP  "£4,800 GBP"        sign + grouped integer + " GBP"
--
--   Storing it would create two sources of truth for one number. It is
--   regenerated at render time instead, and parity proves the rule matches.
--
--   The 133/135 figure is exact and is a genuine exception, not a gap: the two
--   records int-houston-3 and int-houston-4 publish a COMPOSITE string
--     "$5,000 USD (1wk) / $9,500 USD (2wks)"
--   which is derived from BOTH tiers joined by " / ", with the per-tier durations
--   living only in fee_notes. The renderer must therefore check tier count before
--   formatting. A renderer that formats tier 1 alone prints "$5,000 USD" for
--   those two programmes and silently understates the published price. This is
--   called out here because it is the single most likely rendering bug in the
--   catalogue.
--
-- WHY currency LIVES ON THE FEE ROW
--   Because that is where the source puts it. It is not derivable in SQL from
--   the destination without a join the write path cannot perform declaratively,
--   and the verified invariant below is enforced by parity rather than by a
--   trigger.
-- =============================================================================

CREATE TABLE IF NOT EXISTS catalogue_programme_fee (
  id                     bigserial PRIMARY KEY,
  catalogue_programme_id uuid        NOT NULL
                           REFERENCES catalogue_programme(id) ON DELETE CASCADE,

  -- 1 = primary tier (source `fee`). 2 = secondary tier (source `feeSecondary`).
  -- Only 2 records carry a tier 2 in the 2026 source: int-houston-3 and
  -- int-houston-4, both 9500 USD. The vocabulary is 1..2 because the source has
  -- exactly two price points; a third is not anticipated and would be new data,
  -- not a bug fix.
  tier                   smallint    NOT NULL DEFAULT 1,
  amount                 numeric(12, 2) NOT NULL,
  currency               char(3)     NOT NULL,
  -- Always NULL after import. The only per-tier labels that exist ("1wk",
  -- "2wks") are embedded in int-houston-3/4's feeNotes free text. Extracting them
  -- means parsing prose, which is a GIBS authoring decision, not an import one.
  label                  text,

  CONSTRAINT catalogue_programme_fee_tier_chk  CHECK (tier IN (1, 2)),
  CONSTRAINT catalogue_programme_fee_amount_chk CHECK (amount IS NOT NULL AND amount >= 0),
  CONSTRAINT catalogue_programme_fee_currency_chk CHECK (currency IN ('NGN', 'USD', 'GBP')),
  -- One price point per tier per programme. Also makes the importer idempotent:
  -- re-running the import cannot create a duplicate tier.
  CONSTRAINT catalogue_programme_fee_tier_unique UNIQUE (catalogue_programme_id, tier)
);

COMMENT ON TABLE catalogue_programme_fee IS
  'Price tiers for one programme in one catalogue year. 137 rows expected for '
  '2026: 135 tier-1 plus 2 tier-2 (int-houston-3, int-houston-4). Because fees '
  'hang off catalogue_programme, they are year-specific automatically: changing a '
  '2027 fee cannot alter what a 2026 enquiry points at.';

COMMENT ON CONSTRAINT catalogue_programme_fee_tier_chk ON catalogue_programme_fee IS
  'The source has exactly two price points and no third. An unexpected third tier '
  'means either new data or an import defect, and both should fail loudly rather '
  'than widen the vocabulary silently.';

COMMENT ON COLUMN catalogue_programme_fee.currency IS
  'Always equals the owning programme''s destination default_currency. Verified '
  'with zero exceptions across all 137 rows: all 113 Local are NGN, all 8 Kigali '
  'and all 5 Dubai and all 5 Houston are USD, all 4 London are GBP. That invariant '
  'is asserted by scripts/qa/parity_check.py rather than by a trigger, because a '
  'trigger would put a write-path cost and a second failure mode in front of an '
  'invariant the importer can simply verify. If it ever needs to be structural, '
  'the declarative route is a UNIQUE (id, default_currency) on destination plus a '
  'composite FK carrying a denormalised destination_id — rejected for now because '
  'it adds a column that must itself be kept in step.';

COMMENT ON COLUMN catalogue_programme_fee.label IS
  'Always NULL after import. Populating it requires parsing Houston feeNotes prose.';

-- -----------------------------------------------------------------------------
-- Immutability is NOT enforced here
-- -----------------------------------------------------------------------------
-- Published fee rows are frozen by the guard in 018_lifecycle_functions.sql,
-- which refuses edits to any catalogue_programme in a published year, and by
-- the policies in 019_rls_policies.sql. A trigger on this table alone would be
-- wrong: a fee row can legitimately be edited while its year is still a draft.
--
-- =============================================================================
-- END 017_programme_fee.sql
-- =============================================================================
