#!/usr/bin/env python3
"""Apply the year-versioned GIBS catalogue schema, 010 through 020, in order.

STATUS: never executed against any database while this repository was built.
`--check` is the only mode that has been run, and it is offline.

WHY THIS USES psql AND NOT A PYTHON DRIVER
    A driver-based script would be dead on arrival in this repository. None of
    psycopg, psycopg2, pg8000 or asyncpg is installed, and installing one is out
    of scope. `psql` is present (verified: PostgreSQL 18.6 client). Shelling out
    to it means the applier has no third-party dependency at all, which is the
    property that matters for a script whose whole job is to be trustworthy at
    the moment a schema lands on a database nobody has tested it against.

WHAT IT DOES
    * creates a migration ledger, if absent
    * applies each of 010..020 in one transaction per file
    * skips files already applied at the same content hash
    * refuses to continue if an applied file's content has changed
    * refuses to run against PostgreSQL older than 13 (gen_random_uuid)

WHAT IT REFUSES TO DO, DELIBERATELY
    * apply 001_programme.sql or 002_programme_seed.sql. Those are the earlier
      unexecuted prototype whose `programme` table has no catalogue year and no
      fee scoping to speak of. They are kept as historical artefacts and are
      structurally incompatible with this chain, not merely superseded. Applying
      both would produce two incompatible programme tables in one database and
      a very confusing afternoon.
    * take a connection string from a file, a default, or a flag. It comes from
      GIBS_DATABASE_URL in the environment, so it is never written to the
      repository and never appears in a command line that would end up in shell
      history.
    * write to any database without GIBS_ALLOW_SCHEMA_APPLY=1 also being set. An
      environment gate on a schema applier is cheap insurance against a mistyped
      DSN pointing at a real database.

USAGE
    python3 scripts/db/apply_schema.py --check
    GIBS_DATABASE_URL=... GIBS_ALLOW_SCHEMA_APPLY=1 python3 scripts/db/apply_schema.py
    GIBS_DATABASE_URL=... GIBS_ALLOW_SCHEMA_APPLY=1 python3 scripts/db/apply_schema.py --status
    python3 scripts/db/apply_schema.py --emit-sql /tmp/kilo/catalogue_load.sql
    GIBS_DATABASE_URL=... GIBS_ALLOW_CATALOGUE_IMPORT=1 python3 scripts/db/apply_schema.py --load
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
from pathlib import Path

# The catalogue importer and the schema applier must agree about what the source
# says, so both go through the same extraction module rather than each parsing
# data.ts and the snapshot in their own way.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "import"))

from _programme_source import (  # noqa: E402
    load_snapshot,
    source_sha256,
    sql_literal,
)

REPO = Path(__file__).resolve().parent.parent.parent
SCHEMA_DIR = REPO / "db" / "schema"

# --- what the loaded catalogue must look like ------------------------------

CATALOGUE_YEAR = 2026
EXPECTED_PROGRAMMES = 135
EXPECTED_FEES = 137

# Every field the schema stores as a NOT NULL column. A record missing any of them
# cannot be inserted, and discovering that from a constraint violation part way
# through a 135-row import is a worse error message than checking it up front.
EXPECTED_PROGRAMME_FIELDS = {
    "id", "code", "num", "slug", "title", "category", "destination",
    "targetAudience", "schedule", "duration", "inPlantAvailable",
    "tagline", "summary", "audience", "indicativeStructure", "outcomes",
    "faqs", "fee", "currency",
}

# `feeSecondary` and `feeNotes` appear as keys on 22 of the 135 records and are
# empty on most of them, so "absent" and "present but empty" are treated alike.
# `fees` is the formatted display string; it is regenerated from amount and
# currency rather than stored, and parity_check.py proves the rule matches.
OPTIONAL_PROGRAMME_FIELDS = {
    "format", "feeSecondary", "feeNotes", "requirements",
    "startDate", "officialOnly", "fees",
}


class CatalogueError(RuntimeError):
    """Raised when the catalogue to load is not the expected catalogue."""

# The chain. Explicit rather than glob-sorted so that adding an unrelated .sql
# file to db/schema cannot silently become part of the migration order.
SCRIPT_FILES = [
    "010_catalogue_year.sql",
    "011_programme_lineage.sql",
    "012_catalogue_programme.sql",
    "013_programme_url.sql",
    "014_enquiry.sql",
    "015_subscriber.sql",
    "016_audit_log.sql",
    "017_programme_fee.sql",
    "018_lifecycle_functions.sql",
    "019_rls_policies.sql",
    "020_reference_seed.sql",
]

# Present in the directory, intentionally never applied. See module docstring.
FORBIDDEN = {
    "001_programme.sql": (
        "pre-migration prototype; its `programme` table has no catalogue year"
    ),
    "002_programme_seed.sql": (
        "seeds the prototype's year-less `programme` table"
    ),
}

LEDGER_DDL = """
CREATE TABLE IF NOT EXISTS gibs_schema_migration (
  filename   text        PRIMARY KEY,
  sha256     text        NOT NULL,
  applied_at timestamptz NOT NULL DEFAULT now()
);
"""

MIN_POSTGRES_MAJOR = 13


class ApplyError(RuntimeError):
    pass


def sha256_of(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def redact_dsn(dsn: str) -> str:
    """Strip the password so a DSN can be shown to a human or logged.

    A connection string is a credential. It is the single most common thing to
    leak into a bug report, and `psql` errors sometimes quote the URI it was
    given. Everything this script prints goes through here.
    """
    return re.sub(r"://([^:/@]+):[^@]*@", r"://\1:***@", dsn)


def run_psql(dsn: str, sql: str, *, capture: bool = True) -> str:
    """Run one statement batch, failing loudly.

    -v ON_ERROR_STOP=1  abort on the first error instead of continuing and
                        leaving a half-applied file
    -1                 wrap the whole batch in a single transaction, so a file
                        applies completely or not at all
    --no-psqlrc        a developer's ~/.psqlrc must not change the outcome
    """
    cmd = [
        "psql",
        "--no-psqlrc",
        "--quiet",
        "--set", "ON_ERROR_STOP=1",
        "--dbname", dsn,
    ]
    if capture:
        cmd.append("--tuples-only")
        cmd.append("--no-align")

    proc = subprocess.run(
        cmd,
        input=sql,
        text=True,
        capture_output=capture,
    )
    if proc.returncode != 0:
        detail = (proc.stderr or "").strip() if capture else ""
        raise ApplyError(f"psql failed ({proc.returncode})\n{detail}")
    return (proc.stdout or "").strip() if capture else ""


def server_major(dsn: str) -> int:
    out = run_psql(dsn, "SHOW server_version_num;")
    if not out:
        raise ApplyError("could not read server_version_num")
    try:
        return int(out.splitlines()[0].strip()) // 10000
    except (ValueError, IndexError) as exc:
        raise ApplyError(f"unparseable server_version_num: {out!r}") from exc


def ledger_rows(dsn: str) -> dict[str, str]:
    exists = run_psql(
        dsn,
        "SELECT to_regclass('public.gibs_schema_migration') IS NOT NULL;",
    )
    if exists.lower() != "t":
        return {}
    out = run_psql(dsn, "SELECT filename || ' ' || sha256 FROM gibs_schema_migration;")
    rows = {}
    for line in out.splitlines():
        if not line.strip():
            continue
        name, _, digest = line.strip().partition(" ")
        rows[name] = digest
    return rows


def check_files() -> list[str]:
    """Offline checks. Returns a list of problems; empty means clean."""
    problems: list[str] = []

    for name in SCRIPT_FILES:
        path = SCHEMA_DIR / name
        if not path.is_file():
            problems.append(f"missing migration file: db/schema/{name}")
            continue
        text = path.read_text()
        if not text.strip():
            problems.append(f"empty migration file: db/schema/{name}")
        if "DROP TABLE" in text.upper():
            problems.append(
                f"{name} contains DROP TABLE; the chain must be additive"
            )

    present = {p.name for p in SCHEMA_DIR.glob("*.sql")}
    for name in FORBIDDEN:
        if name not in present:
            problems.append(
                f"expected historical file db/schema/{name} to still be present; "
                "it is documented as a kept artefact and its absence would make "
                "the FORBIDDEN list misleading"
            )
    unlisted = present - set(SCRIPT_FILES) - set(FORBIDDEN)
    for name in sorted(unlisted):
        problems.append(
            f"db/schema/{name} is not in SCRIPT_FILES or FORBIDDEN; "
            "add it to one of them so its status is explicit"
        )

    numbers = [name.split("_", 1)[0] for name in SCRIPT_FILES]
    if numbers != sorted(numbers):
        problems.append("SCRIPT_FILES is not in ascending numeric order")

    return problems


def load_catalogue() -> list[dict]:
    """Load the source catalogue, or refuse.

    Every check here exists because the alternative is a database that looks fine
    and is quietly wrong. A catalogue published with fees is a content artefact;
    an import that drops a record, doubles a code or invents a fee is worse than
    no import, because nobody would notice.

    The snapshot is verified against the live sha256 of src/lib/data.ts first. A
    stale snapshot is the most likely source of a silent divergence, because it
    looks perfectly valid and nothing about it is wrong on its own.
    """
    snapshot = load_snapshot()
    live = source_sha256()
    if snapshot.get("source_sha256") != live:
        raise CatalogueError(
            "the committed snapshot is stale.\n"
            f"  snapshot: {snapshot.get('source_sha256')}\n"
            f"  data.ts : {live}\n"
            "Regenerate it with: python3 scripts/import/export_snapshot.py"
        )

    programmes = snapshot.get("programmes") or []
    if len(programmes) != EXPECTED_PROGRAMMES:
        raise CatalogueError(
            f"expected {EXPECTED_PROGRAMMES} programmes, snapshot has "
            f"{len(programmes)}"
        )
    if snapshot.get("record_count") != len(programmes):
        raise CatalogueError("snapshot record_count disagrees with its own contents")

    categories = snapshot.get("categories")
    if categories is not None and len(categories) != len(CATEGORY_ORDER):
        raise CatalogueError("snapshot carries an unexpected category list")

    problems: list[str] = []
    seen: dict[str, set] = {"id": set(), "code": set(), "num": set(), "slug": set()}
    fee_rows = 0

    for record in programmes:
        ident = record.get("id", "<no id>")
        missing = EXPECTED_PROGRAMME_FIELDS - record.keys()
        if missing:
            problems.append(f"{ident}: missing required field(s) "
                            f"{sorted(missing)}")
            continue
        unexpected = record.keys() - EXPECTED_PROGRAMME_FIELDS - OPTIONAL_PROGRAMME_FIELDS
        if unexpected:
            problems.append(f"{ident}: unrecognised field(s) {sorted(unexpected)}; "
                            "the schema does not know where to put them")

        for key in ("id", "code", "slug"):
            if record[key] in seen[key]:
                problems.append(f"{ident}: duplicate {key} {record[key]!r}")
            seen[key].add(record[key])
        if record["num"] in seen["num"]:
            problems.append(f"{ident}: duplicate num {record['num']}")
        seen["num"].add(record["num"])

        # in_plant_available is derived from destination locality in the source.
        # It is stored because the detail page renders it, so a divergence means
        # the two sources disagree about something a visitor will read.
        is_local = record["destination"] == "Local"
        if bool(record["inPlantAvailable"]) != is_local:
            problems.append(
                f"{ident}: inPlantAvailable={record['inPlantAvailable']} but "
                f"destination={record['destination']}"
            )

        if record["currency"] not in ("NGN", "USD", "GBP"):
            problems.append(f"{ident}: unknown currency {record['currency']!r}")

        expected_currency = {"Local": "NGN", "Kigali": "USD", "Dubai": "USD",
                             "London": "GBP", "Houston": "USD"}.get(
            record["destination"])
        if expected_currency and record["currency"] != expected_currency:
            problems.append(
                f"{ident}: currency {record['currency']} contradicts destination "
                f"{record['destination']} (expected {expected_currency})"
            )

        fee_rows += 1
        if record.get("feeSecondary") is not None:
            fee_rows += 1

    if problems:
        raise CatalogueError(
            "the source catalogue failed validation:\n  - "
            + "\n  - ".join(problems)
        )

    if fee_rows != EXPECTED_FEES:
        raise CatalogueError(
            f"expected {EXPECTED_FEES} fee rows, derived {fee_rows}"
        )

    return programmes


def render_load_sql(programmes: list[dict]) -> str:
    """Render the 2026 catalogue load as one reviewable SQL transaction.

    Staged through TEMP tables rather than emitted as blind INSERTs so that the
    audit rows record genuine before-and-after values read from the database. An
    import that silently overwrote 12 rows would otherwise leave no trace of what
    it changed, which is the exact failure catalogue_audit_log exists to prevent.
    """
    from _programme_source import CATEGORY_ORDER, DESTINATION_ORDER

    # Ids are resolved by NAME here, and then asserted to equal the sort_order the
    # seed file used. Resolving by name is what makes the import independent of
    # insertion order; the assertion is what makes a mismatch loud instead of
    # silent, because a shifted id would attach programmes to the wrong category
    # and every filter on the site would quietly return the wrong set.
    cat_id = {name: i + 1 for i, name in enumerate(CATEGORY_ORDER)}
    dest_id = {name: i + 1 for i, (name, _cur, _local) in enumerate(
        DESTINATION_ORDER)}

    year_expr = "(SELECT id FROM catalogue_year WHERE year = %d)" % CATALOGUE_YEAR

    programme_values = []
    fee_values = []
    for record in programmes:
        if record["category"] not in cat_id:
            raise CatalogueError(f"{record['id']}: unknown category "
                                 f"{record['category']!r}")
        if record["destination"] not in dest_id:
            raise CatalogueError(f"{record['id']}: unknown destination "
                                 f"{record['destination']!r}")

        programme_values.append("(" + ", ".join([
            sql_literal(record["slug"]),
            sql_literal(record["id"]),
            sql_literal(record["code"]),
            sql_literal(record["num"]),
            sql_literal(record["slug"]),
            sql_literal(record["title"]),
            sql_literal(cat_id[record["category"]]),
            sql_literal(dest_id[record["destination"]]),
            sql_literal(record["targetAudience"]),
            sql_literal(record["schedule"]),
            sql_literal(record["duration"]),
            sql_literal(bool(record["inPlantAvailable"])),
            sql_literal(record.get("feeNotes")),
            sql_literal(record["tagline"]),
            sql_literal(record["summary"]),
            sql_literal(record.get("format")),
            sql_literal(record["audience"]),
            sql_literal(record["indicativeStructure"]),
            sql_literal(record["outcomes"]),
            sql_literal(record["faqs"]),
            sql_literal(record),
        ]) + ")")

        fee_values.append("(" + ", ".join([
            sql_literal(record["id"]),
            "1",
            sql_literal(record["fee"]),
            sql_literal(record["currency"]),
            "NULL",
        ]) + ")")
        if record.get("feeSecondary") is not None:
            fee_values.append("(" + ", ".join([
                sql_literal(record["id"]),
                "2",
                sql_literal(record["feeSecondary"]),
                sql_literal(record["currency"]),
                "NULL",
            ]) + ")")

    digest = source_sha256()

    return f"""\
-- =============================================================================
-- 2026 catalogue load — GENERATED by scripts/db/apply_schema.py --load
-- =============================================================================
-- Source            : src/lib/data.ts (PROGRAMMES)
-- Source sha256     : {digest}
-- Records           : {len(programmes)} programmes, {len(fee_values)} fee rows
--
-- GENERATED SQL. Do not hand-edit: regenerate rather than patching, so the file
-- and the source stay traceable to each other.
--
-- The load is staged through TEMP tables so that the audit rows below carry real
-- before-and-after values read from the database. The audit INSERT deliberately
-- runs BEFORE the upsert, because after the upsert the "before" state is gone.
--
-- Everything is one transaction. A failure anywhere leaves the database exactly
-- as it was.
-- =============================================================================

BEGIN;

SELECT set_config('app.request_id', 'catalogue-import-{CATALOGUE_YEAR}', true);

-- -----------------------------------------------------------------------------
-- The year. 2026 is the first catalogue, so it loads as a draft: nothing becomes
-- public until submit_catalogue_year_for_review and publish_catalogue_year have
-- both run deliberately.
-- -----------------------------------------------------------------------------
INSERT INTO catalogue_year (year, status, notes)
VALUES (
  {CATALOGUE_YEAR}, 'draft',
  'Imported from src/lib/data.ts. Source of truth for the catalogue remains the '
  || 'generator until this database is verified and promoted.'
)
ON CONFLICT (year) DO NOTHING;

-- Refuse to load into a year that is not a draft. An import that ran against a
-- published year would be stopped by the 018 triggers anyway, but it would stop
-- with a constraint error halfway through rather than before writing anything.
DO $load_guard$
DECLARE
  v_status text;
BEGIN
  SELECT status INTO v_status FROM catalogue_year WHERE year = {CATALOGUE_YEAR};
  IF v_status IS NULL THEN
    RAISE EXCEPTION 'catalogue year {CATALOGUE_YEAR} could not be created';
  END IF;
  IF v_status <> 'draft' THEN
    RAISE EXCEPTION
      'catalogue year {CATALOGUE_YEAR} is %, and loading into it is refused',
      v_status;
  END IF;
END
$load_guard$;

-- -----------------------------------------------------------------------------
-- Staging
-- -----------------------------------------------------------------------------
-- LIKE without INCLUDING DEFAULTS: the copied id column must NOT inherit
-- gen_random_uuid(), because these rows are matched to existing rows by
-- (catalogue_year_id, source_id) and a fresh uuid per run would make every
-- re-import look like 135 new programmes.
--
-- source_slug is a staging-only column. The full slug does not live on
-- catalogue_programme, which stores only the title segment (012), because the
-- complete public URL is an independently managed asset (013).
CREATE TEMP TABLE stage_programme (LIKE catalogue_programme) ON COMMIT DROP;
ALTER TABLE stage_programme ADD COLUMN source_slug text;

CREATE TEMP TABLE stage_fee (
  source_id text          NOT NULL,
  tier      smallint      NOT NULL,
  amount    numeric(12,2) NOT NULL,
  currency  char(3)       NOT NULL,
  label     text
) ON COMMIT DROP;

INSERT INTO stage_programme (
  source_slug, source_id, code, num, slug_segment, title, category_id,
  destination_id, target_audience, schedule_text, duration_label,
  in_plant_available, fee_notes, tagline, summary, format, audience,
  indicative_structure, outcomes, faqs, legacy
) VALUES
  {",\n  ".join(programme_values)};

INSERT INTO stage_fee (source_id, tier, amount, currency, label) VALUES
  {",\n  ".join(fee_values)};

-- -----------------------------------------------------------------------------
-- Audit, before mutating anything
-- -----------------------------------------------------------------------------
-- One row per programme that is new or whose content actually differs. A re-run
-- against unchanged data writes nothing, which is what makes the log a record of
-- events rather than of runs.
--
-- Fees are included in the before/after values because a fee change is a content
-- change; the fee subqueries read the live rows, so this only works before the
-- rewrite below.
INSERT INTO catalogue_audit_log (
  catalogue_year_id, programme_id, action, before_value, after_value, request_id
)
SELECT
  {year_expr},
  cp.id,
  CASE WHEN cp.id IS NULL THEN 'create' ELSE 'update' END,
  CASE WHEN cp.id IS NULL THEN NULL ELSE jsonb_build_object(
    'code', cp.code, 'title', cp.title, 'num', cp.num,
    'slug_segment', cp.slug_segment, 'category_id', cp.category_id,
    'destination_id', cp.destination_id, 'schedule_text', cp.schedule_text,
    'duration_label', cp.duration_label, 'in_plant_available', cp.in_plant_available,
    'fee_notes', cp.fee_notes, 'tagline', cp.tagline, 'summary', cp.summary,
    'entry_status', cp.entry_status,
    'fees', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'tier', f.tier, 'amount', f.amount, 'currency', f.currency)
               ORDER BY f.tier)
        FROM catalogue_programme_fee f
       WHERE f.catalogue_programme_id = cp.id), '[]'::jsonb)
  ) END,
  jsonb_build_object(
    'source_id', s.source_id, 'code', s.code, 'title', s.title, 'num', s.num,
    'slug_segment', s.slug_segment, 'category_id', s.category_id,
    'destination_id', s.destination_id, 'schedule_text', s.schedule_text,
    'duration_label', s.duration_label, 'in_plant_available', s.in_plant_available,
    'fee_notes', s.fee_notes, 'tagline', s.tagline, 'summary', s.summary,
    'entry_status', s.entry_status,
    'fees', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'tier', f.tier, 'amount', f.amount, 'currency', f.currency)
               ORDER BY f.tier)
        FROM stage_fee f
       WHERE f.source_id = s.source_id), '[]'::jsonb)
  ),
  'catalogue-import-{CATALOGUE_YEAR}'
  FROM stage_programme s
  LEFT JOIN catalogue_programme cp
    ON cp.catalogue_year_id = {year_expr}
   AND cp.source_id = s.source_id
 WHERE cp.id IS NULL
    OR (cp.code, cp.title, cp.num, cp.slug_segment, cp.category_id,
        cp.destination_id, cp.target_audience, cp.schedule_text,
        cp.duration_label, cp.in_plant_available, cp.fee_notes, cp.tagline,
        cp.summary, cp.format, cp.audience, cp.indicative_structure,
        cp.outcomes, cp.faqs, cp.entry_status)
     IS DISTINCT FROM
       (s.code, s.title, s.num, s.slug_segment, s.category_id,
        s.destination_id, s.target_audience, s.schedule_text,
        s.duration_label, s.in_plant_available, s.fee_notes, s.tagline,
        s.summary, s.format, s.audience, s.indicative_structure,
        s.outcomes, s.faqs, s.entry_status);

-- -----------------------------------------------------------------------------
-- Upsert programmes
-- -----------------------------------------------------------------------------
-- ON CONFLICT DO UPDATE, not DO NOTHING: DO NOTHING would silently keep stale
-- content and report success. The row's uuid is preserved, so uuids stay stable
-- across re-imports and existing enquiries keep pointing at the right programme.
INSERT INTO catalogue_programme (
  catalogue_year_id, lineage_id, source_id, code, num, slug_segment, title,
  category_id, destination_id, target_audience, schedule_text, duration_label,
  in_plant_available, fee_notes, tagline, summary, format, audience,
  indicative_structure, outcomes, faqs, legacy, entry_status
)
SELECT
  {year_expr}, NULL, s.source_id, s.code, s.num, s.slug_segment, s.title,
  s.category_id, s.destination_id, s.target_audience, s.schedule_text,
  s.duration_label, s.in_plant_available, s.fee_notes, s.tagline, s.summary,
  s.format, s.audience, s.indicative_structure, s.outcomes, s.faqs, s.legacy,
  'listed'
  FROM stage_programme s
ON CONFLICT (catalogue_year_id, source_id) DO UPDATE SET
  code = EXCLUDED.code,
  num = EXCLUDED.num,
  slug_segment = EXCLUDED.slug_segment,
  title = EXCLUDED.title,
  category_id = EXCLUDED.category_id,
  destination_id = EXCLUDED.destination_id,
  target_audience = EXCLUDED.target_audience,
  schedule_text = EXCLUDED.schedule_text,
  duration_label = EXCLUDED.duration_label,
  in_plant_available = EXCLUDED.in_plant_available,
  fee_notes = EXCLUDED.fee_notes,
  tagline = EXCLUDED.tagline,
  summary = EXCLUDED.summary,
  format = EXCLUDED.format,
  audience = EXCLUDED.audience,
  indicative_structure = EXCLUDED.indicative_structure,
  outcomes = EXCLUDED.outcomes,
  faqs = EXCLUDED.faqs,
  legacy = EXCLUDED.legacy
  -- entry_status and lineage_id are intentionally absent from the SET list. A
  -- re-import must not resurrect a programme that staff removed, and must not
  -- overwrite lineage continuity established by a later clone.

-- -----------------------------------------------------------------------------
-- Public URL assets
-- -----------------------------------------------------------------------------
-- 135 rows, one per existing live slug, each already pointing at its 2026
-- programme.
--
-- lineage_id is left NULL and that is not an oversight: 2026 is the first
-- catalogue, so there is no earlier record to be continuous with, and 013 makes
-- both foreign keys nullable precisely for this state. clone_catalogue_year
-- backfills programme_url.lineage_id as soon as lineage first exists, which is
-- what later lets ?year=2026 resolve through lineage.
--
-- ON CONFLICT DO NOTHING, not DO UPDATE: a re-import must never repoint a URL
-- that staff have deliberately moved to a different programme. If a slug is
-- missing from the source, it stays as it is.
--
-- No redirects are created. 2026 is the first catalogue; nothing has been
-- superseded.
INSERT INTO programme_url (slug, current_programme_id, first_published_year)
SELECT s.source_slug, cp.id, {CATALOGUE_YEAR}
  FROM stage_programme s
  JOIN catalogue_programme cp
    ON cp.catalogue_year_id = {year_expr}
   AND cp.source_id = s.source_id
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------------
-- Fees: replace wholesale within the year
-- -----------------------------------------------------------------------------
-- Delete-then-insert rather than a diff, because the fee set is small (137 rows)
-- and a diff would need to distinguish "tier removed" from "tier never existed".
-- Safe here because the year is draft: the 018 freeze only applies once it is not.
DELETE FROM catalogue_programme_fee f
  USING catalogue_programme cp
 WHERE f.catalogue_programme_id = cp.id
   AND cp.catalogue_year_id = {year_expr};

INSERT INTO catalogue_programme_fee (
  catalogue_programme_id, tier, amount, currency, label
)
SELECT cp.id, f.tier, f.amount, f.currency, f.label
  FROM stage_fee f
  JOIN catalogue_programme cp
    ON cp.catalogue_year_id = {year_expr}
   AND cp.source_id = f.source_id;

-- -----------------------------------------------------------------------------
-- Post-load verification. These must match, and a mismatch is a failed load even
-- though the transaction will commit: the numbers are the point.
-- -----------------------------------------------------------------------------
DO $verify$
DECLARE
  v_programmes integer;
  v_fees       integer;
  v_urls       integer;
  v_category   integer;
  v_destination integer;
BEGIN
  SELECT count(*) INTO v_programmes
    FROM catalogue_programme WHERE catalogue_year_id = {year_expr};
  SELECT count(*) INTO v_fees
    FROM catalogue_programme_fee f
    JOIN catalogue_programme cp ON cp.id = f.catalogue_programme_id
   WHERE cp.catalogue_year_id = {year_expr};
  SELECT count(*) INTO v_urls
    FROM programme_url u
    JOIN catalogue_programme cp ON cp.id = u.current_programme_id
   WHERE cp.catalogue_year_id = {year_expr};

  IF v_programmes <> {EXPECTED_PROGRAMMES} THEN
    RAISE EXCEPTION 'expected {EXPECTED_PROGRAMMES} programmes, found %',
      v_programmes;
  END IF;
  IF v_fees <> {EXPECTED_FEES} THEN
    RAISE EXCEPTION 'expected {EXPECTED_FEES} fee rows, found %', v_fees;
  END IF;
  IF v_urls <> {EXPECTED_PROGRAMMES} THEN
    RAISE EXCEPTION 'expected {EXPECTED_PROGRAMMES} programme_url rows pointing '
      'at this year, found %', v_urls;
  END IF;

  -- Every category and destination the import referenced must exist. These must
  -- return zero rows; a non-zero count here means the lookup tables were seeded
  -- differently from the source.
  SELECT count(*) INTO v_category
    FROM catalogue_programme cp
   WHERE cp.catalogue_year_id = {year_expr}
     AND NOT EXISTS (SELECT 1 FROM programme_category pc WHERE pc.id = cp.category_id);
  SELECT count(*) INTO v_destination
    FROM catalogue_programme cp
   WHERE cp.catalogue_year_id = {year_expr}
     AND NOT EXISTS (SELECT 1 FROM destination d WHERE d.id = cp.destination_id);
  IF v_category > 0 OR v_destination > 0 THEN
    RAISE EXCEPTION
      '% programme(s) reference a missing category and % a missing destination',
      v_category, v_destination;
  END IF;

  RAISE NOTICE 'catalogue load verified: % programmes, % fees',
    v_programmes, v_fees;
END
$verify$;

COMMIT;
"""


def do_load(args, parser) -> int:
    """Load the 2026 catalogue. Never called before the migration chain is in place."""
    dsn = os.environ.get("GIBS_DATABASE_URL")
    if not dsn:
        print("\nGIBS_DATABASE_URL is not set.", file=sys.stderr)
        return 2

    if os.environ.get("GIBS_ALLOW_CATALOGUE_IMPORT") != "1":
        print("\nRefusing to load the catalogue without "
              "GIBS_ALLOW_CATALOGUE_IMPORT=1.", file=sys.stderr)
        print("A separate flag from GIBS_ALLOW_SCHEMA_APPLY, deliberately: "
              "applying a schema and writing 135 published-programme records are "
              "different consequences and should not share one key.", file=sys.stderr)
        return 2

    applied = ledger_rows(dsn)
    missing = [n for n in SCRIPT_FILES if n not in applied]
    if missing:
        print("\nthe schema is not fully applied; run without --load first:",
              file=sys.stderr)
        for name in missing:
            print(f"  - {name}", file=sys.stderr)
        return 1

    # Loading a catalogue into a database whose reference tables disagree with the
    # source would attach programmes to the wrong categories. Checked here, before
    # any write, rather than by the DO block at the end of the transaction which
    # would have to roll the whole thing back to report it.
    out = run_psql(
        dsn,
        "SELECT string_agg(name, '|' ORDER BY sort_order) FROM programme_category"
        "  || '#' ||"
        " (SELECT string_agg(name, '|' ORDER BY sort_order) FROM destination);",
    )
    live_categories, _, live_destinations = out.partition("#")
    expected_categories = "|".join(CATEGORY_ORDER)
    expected_destinations = "|".join(d[0] for d in DESTINATION_ORDER)
    if live_categories != expected_categories or live_destinations != expected_destinations:
        print("\nreference tables do not match the source catalogue.", file=sys.stderr)
        print(f"  db categories   : {live_categories}", file=sys.stderr)
        print(f"  source categories: {expected_categories}", file=sys.stderr)
        print(f"  db destinations : {live_destinations}", file=sys.stderr)
        print(f"  source destinations: {expected_destinations}", file=sys.stderr)
        print("\nRefusing to import. Fix 020_reference_seed.sql first; do not "
              "hand-edit rows in a dashboard.", file=sys.stderr)
        return 1

    programmes = load_catalogue()
    sql = render_load_sql(programmes)
    print(f"\ntarget: {redact_dsn(dsn)}")
    print(f"loading catalogue year {CATALOGUE_YEAR}: {len(programmes)} programmes")

    out = run_psql(dsn, sql, capture=False)  # type: ignore[assignment]
    del out

    print("\nloaded. The year is a DRAFT: nothing is public yet.")
    print("Next steps, in order:")
    print(f"  psql \"$GIBS_DATABASE_URL\" -c \"SELECT submit_catalogue_year_for_review("
          f"(SELECT id FROM catalogue_year WHERE year = {CATALOGUE_YEAR}));\"")
    print(f"  psql \"$GIBS_DATABASE_URL\" -c \"SELECT publish_catalogue_year("
          f"(SELECT id FROM catalogue_year WHERE year = {CATALOGUE_YEAR}));\"")
    print("  python3 scripts/qa/parity_check.py")
    return 0


def print_manifest() -> None:
    print(f"schema directory: {SCHEMA_DIR}")
    print(f"chain: {len(SCRIPT_FILES)} files, 010 -> 020\n")
    for name in SCRIPT_FILES:
        path = SCHEMA_DIR / name
        digest = sha256_of(path)[:12] if path.is_file() else "MISSING"
        print(f"  {name:34s} {digest}")
    for name, reason in FORBIDDEN.items():
        print(f"  {name:34s} NOT APPLIED  ({reason})")


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Apply db/schema/010..020 to a PostgreSQL database.",
    )
    parser.add_argument(
        "--check", action="store_true",
        help="offline: verify the migration set and print a manifest. No database "
             "contact, no writes. This is the only mode safe to run anywhere.",
    )
    parser.add_argument(
        "--status", action="store_true",
        help="report which migrations are already applied, without applying any",
    )
    parser.add_argument(
        "--emit-sql", metavar="PATH",
        help="offline: write the 2026 catalogue load SQL to PATH without "
             "contacting a database. The output is the exact SQL --load would "
             "run, so it can be read, diffed or reviewed before anything happens.",
    )
    parser.add_argument(
        "--load", action="store_true",
        help="load the 2026 catalogue from src/lib/data.ts into a draft year",
    )
    args = parser.parse_args()

    if args.check and (args.emit_sql or args.load or args.status):
        parser.error("--check cannot be combined with a mode that does work")

    if args.emit_sql:
        programmes = load_catalogue()
        sql = render_load_sql(programmes)
        out = Path(args.emit_sql)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(sql, encoding="utf-8")
        print(f"\nvalidated {len(programmes)} programmes, "
              f"{EXPECTED_FEES} fees against the current source")
        print(f"wrote {out} ({len(sql):,} bytes)")
        print("This file has not been executed by anything. Read it before "
              "running it.")
        return 0

    if args.load:
        return do_load(args, parser)

    print_manifest()

    if args.check:
        problems = check_files()
        if problems:
            print("\nFAILED:")
            for problem in problems:
                print(f"  - {problem}")
            return 1
        print("\noffline check OK: file set, ordering and content are consistent.")
        print("This verifies the FILES, not the SQL. No PostgreSQL engine has "
              "parsed these statements.")
        return 0

    dsn = os.environ.get("GIBS_DATABASE_URL")
    if not dsn:
        print("\nGIBS_DATABASE_URL is not set.", file=sys.stderr)
        print("This script takes its connection string from the environment only, "
              "so no credential is ever written to the repository.", file=sys.stderr)
        return 2

    print(f"\ntarget: {redact_dsn(dsn)}")

    major = server_major(dsn)
    if major < MIN_POSTGRES_MAJOR:
        print(f"PostgreSQL {major} is below the required {MIN_POSTGRES_MAJOR}: "
              "gen_random_uuid() is built in from 13 and no extension is installed "
              "by this chain.", file=sys.stderr)
        return 1

    applied = ledger_rows(dsn)

    if args.status:
        pending = [n for n in SCRIPT_FILES if n not in applied]
        print(f"applied: {len(applied)}   pending: {len(pending)}")
        for name in pending:
            print(f"  pending  {name}")
        return 0

    if os.environ.get("GIBS_ALLOW_SCHEMA_APPLY") != "1":
        print("\nRefusing to write without GIBS_ALLOW_SCHEMA_APPLY=1.", file=sys.stderr)
        print("Set it when you are sure the DSN above is the database you mean.",
              file=sys.stderr)
        return 2

    problems = check_files()
    if problems:
        print("\nFAILED:", file=sys.stderr)
        for problem in problems:
            print(f"  - {problem}", file=sys.stderr)
        return 1

    run_psql(dsn, LEDGER_DDL)

    for name in SCRIPT_FILES:
        path = SCHEMA_DIR / name
        digest = sha256_of(path)

        if name in applied:
            if applied[name] != digest:
                print(f"\n  {name}: content changed since it was applied.",
                      file=sys.stderr)
                print("  An applied migration must never be edited. Write a new "
                      "numbered file instead and record what it changes and why.",
                      file=sys.stderr)
                return 1
            print(f"  {name}: already applied, skipping")
            continue

        print(f"  {name}: applying...")
        sql = (
            f"\\set ON_ERROR_STOP on\n"
            f"SELECT pg_advisory_lock(hashtext('gibs_schema_migration'));\n"
            f"{path.read_text()}\n"
            f"INSERT INTO gibs_schema_migration (filename, sha256)\n"
            f"  VALUES ('{name}', '{digest}');\n"
            f"SELECT pg_advisory_unlock(hashtext('gibs_schema_migration'));\n"
        )
        run_psql(dsn, sql)

    print("\napplied. Run scripts/qa/parity_check.py against the same database "
          "before importing or publishing anything.")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except ApplyError as exc:
        print(f"\nerror: {exc}", file=sys.stderr)
        sys.exit(1)
    except FileNotFoundError as exc:
        print(f"\nerror: {exc}", file=sys.stderr)
        print("psql must be on PATH. It is the only dependency this script has, "
              "by choice.", file=sys.stderr)
        sys.exit(1)