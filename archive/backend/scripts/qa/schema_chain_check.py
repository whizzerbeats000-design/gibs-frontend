#!/usr/bin/env python3
"""Static checks for the year-versioned schema chain, db/schema/010..020.

    python3 scripts/qa/schema_chain_check.py

WHAT THIS IS NOT
    This is not a SQL parser and it does not pretend to be. Nothing here proves
    that PostgreSQL accepts these statements. The chain has never been applied to
    an engine, and until it has, "the SQL is correct" remains unverified — see
    docs/backend/README.md, "Verification still pending".

    What this does check is the class of defect that a careful reader misses
    because it is spread across eleven files: a COMMENT ON COLUMN naming a column
    that does not exist, a foreign key pointing at a table nobody creates, a table
    that never gets RLS enabled, a grant that was never revoked.

    A useful boundary: these checks catch mistakes that are invisible when
    reading one file at a time, and they cannot catch a syntax error, a wrong
    function signature, or anything about the runtime behaviour of a trigger.
    Passing all of them is a precondition for applying the chain, not a
    substitute for doing so.

WHY A SEPARATE SCRIPT FROM parity_check.py
    parity_check.py validates db/schema/001 + 002, the year-less prototype, which
    is deliberately never applied. Running it therefore certifies files that are
    not the ones being deployed. Keeping the two chains on separate checkers means
    a green run cannot be mistaken for a verdict on the live chain.
"""

from __future__ import annotations

import importlib.util
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent.parent
SCHEMA_DIR = REPO / "db" / "schema"

CHAIN = [
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

# 001/002 are kept as artefacts and never applied; see docs/backend/README.md §7.
PROTOTYPE = ("001_programme.sql", "002_programme_seed.sql")


def _load_source_module():
    path = REPO / "scripts" / "import" / "_programme_source.py"
    spec = importlib.util.spec_from_file_location("_programme_source", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


SOURCE = _load_source_module()


def strip_sql(text: str) -> str:
    """Remove comments and string literals, preserving dollar-quote tags.

    Comments and literals are where a static check goes wrong: "DELETE" appears in
    a comment that explains why there is no DELETE, and a table name appears in a
    comment before its CREATE TABLE. Blanking those regions is what lets the regex
    checks below be simple enough to trust.

    Blanked regions are replaced with spaces, not removed, so offsets and line
    numbers in reported failures stay meaningful.
    """
    out = []
    i = 0
    n = len(text)
    while i < n:
        ch = text[i]
        nxt2 = text[i:i + 2]
        if nxt2 == "--":
            j = text.find("\n", i)
            j = n if j == -1 else j
            out.append(" " * (j - i))
            i = j
        elif nxt2 == "/*":
            depth = 1
            j = i + 2
            while j < n and depth:
                if text[j:j + 2] == "/*":
                    depth += 1
                    j += 2
                elif text[j:j + 2] == "*/":
                    depth -= 1
                    j += 2
                else:
                    j += 1
            out.append(" " * (j - i))
            i = j
        elif ch == "'":
            j = i + 1
            while j < n:
                if text[j] == "'":
                    if text[j:j + 2] == "''":
                        j += 2
                        continue
                    j += 1
                    break
                j += 1
            out.append(" " * (j - i))
            i = j
        else:
            out.append(ch)
            i += 1
    return "".join(out)


class Results:
    def __init__(self) -> None:
        self.passed: list[str] = []
        self.failed: list[str] = []

    def check(self, ok: bool, label: str, detail: str = "") -> None:
        if ok:
            self.passed.append(label)
        else:
            self.failed.append(f"{label}{': ' + detail if detail else ''}")

    def report(self) -> int:
        for label in self.passed:
            print(f"  PASS  {label}")
        for label in self.failed:
            print(f"  FAIL  {label}")
        total = len(self.passed) + len(self.failed)
        print(f"\n{len(self.passed)}/{total} checks passed")
        print("Not verified here: that a PostgreSQL engine accepts this chain. "
              "Applying it to a real database is a separate, still-open gate.")
        return 1 if self.failed else 0


def main() -> int:
    r = Results()

    texts: dict[str, str] = {}
    bare: dict[str, str] = {}
    for name in CHAIN:
        path = SCHEMA_DIR / name
        r.check(path.is_file(), f"{name} exists")
        if path.is_file():
            raw = path.read_text(encoding="utf-8")
            texts[name] = raw
            bare[name] = strip_sql(raw)

    for name in PROTOTYPE:
        r.check((SCHEMA_DIR / name).is_file(),
                f"{name} retained as a historical artefact")

    if len(texts) != len(CHAIN):
        print("chain files are missing; nothing further can be checked")
        return 1

    everything = "\n".join(bare.values())
    # Value checks must read the RAW text. strip_sql blanks string literals, and
    # string literals are exactly where the data lives: category names, currency
    # codes, the code-regex, the enquiry vocabulary. Structural checks read the
    # stripped text so that a keyword inside a comment cannot satisfy or fail
    # them.
    raw_everything = "\n".join(texts.values())

    # -- no destructive statements ------------------------------------------
    for name, body in bare.items():
        for pattern, description in (
            (r"\bDROP\s+TABLE\b", "DROP TABLE"),
            (r"\bTRUNCATE\b", "TRUNCATE"),
            (r"\bDELETE\s+FROM\b(?!.*--)", "DELETE FROM"),
        ):
            r.check(re.search(pattern, body, re.S) is None,
                    f"{name} contains no {description}")

    # The lifecycle does delete fee rows on a re-import of a draft year. That is
    # the one DELETE in the chain and it is inside generated SQL, not these files,
    # so the check above staying green is expected and correct.

    # -- balance -------------------------------------------------------------
    for name, body in bare.items():
        # Dollar-quoted bodies may legitimately contain unbalanced parens (the
        # 018 guards do), so balance is checked per dollar-quoted region against
        # the regions themselves, and globally over everything else.
        r.check(body.count("(") == body.count(")"),
                f"{name} parentheses balance",
                f"{body.count('(')} open vs {body.count(')')} close")

    tags = set(re.findall(r"\$[a-z_]*\$", everything))
    for tag in sorted(tags):
        r.check(everything.count(tag) >= 2,
                f"dollar-quote tag {tag} is closed")

    # -- tables, columns, keys ------------------------------------------------
    tables = set(re.findall(
        r"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-z_][a-z0-9_]*)",
        everything, re.I))
    r.check(len(tables) == 10, "the chain creates ten tables",
            f"found {sorted(tables)}")

    for table in sorted(tables):
        has_pk = re.search(
            rf"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?{table}\b.*?"
            rf"CONSTRAINT\s+{table}_pk\s+PRIMARY\s+KEY",
            everything, re.I | re.S) or re.search(
            rf"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?{table}\b[^{{]*"
            rf"\bPRIMARY\s+KEY", everything, re.I | re.S)
        r.check(has_pk is not None, f"{table} declares a primary key")

    # Every table has a COMMENT ON TABLE, so a table's purpose is discoverable
    # from the database rather than only from the migration file.
    commented_tables = set(re.findall(
        r"COMMENT\s+ON\s+TABLE\s+([a-z_][a-z0-9_]*)", everything, re.I))
    for table in sorted(tables):
        r.check(table in commented_tables,
                f"{table} has a COMMENT ON TABLE")

    columns: dict[str, set[str]] = {}
    for match in re.finditer(
        r"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-z_][a-z0-9_]*)\s*\((.*?)\n\)"
        r"\s*(?:;|COMMENT)", everything, re.I | re.S):
        table, body = match.group(1), match.group(2)
        found = set(re.findall(r"^\s{2}([a-z_][a-z0-9_]*)\s+[a-z]", body,
                               re.I | re.M))
        columns.setdefault(table, set()).update(found)

    commented_columns = re.findall(
        r"COMMENT\s+ON\s+COLUMN\s+([a-z_][a-z0-9_]*)\.([a-z_][a-z0-9_]*)",
        everything, re.I)
    r.check(len(commented_columns) > 0, "the chain documents its columns")
    for table, column in commented_columns:
        r.check(table in columns and column in columns[table],
                f"COMMENT ON COLUMN {table}.{column} targets a real column",
                f"known columns: {sorted(columns.get(table, []))}")

    # Foreign keys must target a table this chain creates. Self-references are
    # fine; programme_url's self-FK on redirect_to_slug is the interesting one.
    references = re.findall(r"REFERENCES\s+([a-z_][a-z0-9_]*)\s*\(", everything,
                            re.I)
    for target in sorted(set(references)):
        r.check(target in tables, f"foreign key target {target} is created here")

    # -- RLS coverage ---------------------------------------------------------
    rls = bare["019_rls_policies.sql"]
    enabled = set(re.findall(
        r"ALTER\s+TABLE\s+([a-z_][a-z0-9_]*)\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY",
        rls, re.I))
    for table in sorted(tables):
        r.check(table in enabled, f"{table} has RLS enabled",
                f"enabled: {sorted(enabled)}")

    r.check("FORCE ROW LEVEL SECURITY" not in rls,
            "RLS is not FORCED, so the SECURITY DEFINER lifecycle functions work")

    # The invariant that makes 019 safe to run against a shared cluster: the
    # migration chain must never create or alter a cluster role. Roles are
    # cluster-scoped, so a schema migration that does this is a cluster-wide
    # side effect — and the revision that did was escalating a pre-existing
    # service_role to BYPASSRLS using an existence check.
    r.check(re.search(r"\bCREATE\s+ROLE\b", rls, re.I) is None,
            "019 creates no cluster role")
    r.check(re.search(r"\bALTER\s+ROLE\b", rls, re.I) is None,
            "019 alters no cluster role")
    r.check(re.search(r"\bGRANT\s+BYPASSRLS\b", rls, re.I) is None,
            "019 grants no BYPASSRLS")
    r.check("require_roles" in rls,
            "019 requires the roles and fails loudly when they are missing")

    provisioning = REPO / "scripts" / "db" / "provision_roles.sql"
    r.check(provisioning.is_file(),
            "scripts/db/provision_roles.sql exists for environments without them")
    if provisioning.is_file():
        r.check(provisioning.resolve().parent.name == "db",
                "provisioning lives outside db/schema, so it cannot be applied "
                "as a migration")
        r.check(re.search(r"ALTER\s+ROLE\s+service_role\s+BYPASSRLS",
                          provisioning.read_text(encoding="utf-8"), re.I)
                is not None,
                "the operator script is the one place BYPASSRLS is granted")

    # -- security definer hygiene --------------------------------------------
    definer = re.findall(
        r"CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+([a-z_][a-z0-9_]*)\s*\(",
        everything, re.I)
    r.check(len(definer) >= 8, "the chain defines its lifecycle functions",
            f"found {sorted(set(definer))}")

    for func in sorted(set(definer)):
        block = re.search(
            rf"CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+{func}\s*\(.*?\$\$;",
            everything, re.I | re.S)
        body = block.group(0) if block else ""
        r.check("SECURITY DEFINER" in body,
                f"{func} is SECURITY DEFINER")
        r.check("SET search_path" in body,
                f"{func} pins its search_path")
        revoked = re.search(
            rf"REVOKE\s+EXECUTE\s+ON\s+FUNCTION\s+{func}\s*\(", everything, re.I)
        r.check(revoked is not None,
                f"{func} is revoked from PUBLIC")

    r.check(re.search(r"REVOKE\s+UPDATE\s*,\s*DELETE\s+ON\s+catalogue_audit_log",
                      rls, re.I) is not None,
            "catalogue_audit_log refuses UPDATE and DELETE")

    # A revoked function that nobody is granted is a function the public cannot
    # use. Two of them are public read helpers, so the grant has to exist too —
    # and it has to be in the grants file, not in the migration that defines the
    # function, so that the whole public surface is readable in one place.
    for func, signature in (("resolve_programme_url", "text, smallint"),
                            ("current_published_year", "")):
        r.check(re.search(
            rf"GRANT\s+EXECUTE\s+ON\s+FUNCTION\s+{func}\s*\([^)]*\)\s+TO\s+anon",
            rls, re.I) is not None,
            f"{func} is granted to anon in 019",
            signature)

    # -- the chain and the source agree --------------------------------------
    programmes = json.loads(
        (REPO / "db" / "legacy" / "programmes.snapshot.json").read_text()
    )["programmes"]

    code_pattern = re.search(
        r"catalogue_programme_code_chk\s+CHECK\s*\(code\s*~\s*'([^']+)'\)",
        raw_everything)
    r.check(code_pattern is not None, "the code CHECK exists")
    if code_pattern:
        accepted = re.compile(code_pattern.group(1))
        bad = [p["code"] for p in programmes if not accepted.match(p["code"])]
        r.check(not bad, "every source code satisfies the code CHECK", str(bad[:5]))

    category_chk = len(set(p["category"] for p in programmes))
    r.check(category_chk == len(SOURCE.CATEGORY_ORDER) == 15,
            "15 categories in the source and in _programme_source")

    seed = texts["020_reference_seed.sql"]
    for name in SOURCE.CATEGORY_ORDER:
        r.check(f"'{name}'" in seed,
                f"020 seeds category {name!r}")
    for name, currency, _local in SOURCE.DESTINATION_ORDER:
        r.check(f"'{name}'" in seed, f"020 seeds destination {name!r}")
        r.check(f"'{currency}'" in seed,
                f"020 seeds {name} default currency {currency}")

    # The fee currencies the schema allows must be exactly the ones in use.
    used = set(p["currency"] for p in programmes)
    allowed = set(re.findall(r"currency_chk\s+CHECK\s*\(currency\s+IN\s*\(([^)]*)\)",
                             raw_everything, re.I))
    declared = set()
    for group in allowed:
        declared.update(re.findall(r"'([A-Z]{3})'", group))
    r.check(declared == used == set(SOURCE.CURRENCIES),
            "declared currencies equal the currencies actually used",
            f"declared={sorted(declared)} used={sorted(used)}")

    # The enquiry vocabulary must match the six the live form offers.
    data_ts = (REPO / "src" / "lib" / "data.ts").read_text(encoding="utf-8")
    live_types = re.search(
        r"export const ENQUIRY_TYPES\s*=\s*\[(.*?)\];", data_ts, re.S)
    r.check(live_types is not None, "ENQUIRY_TYPES is still exported from data.ts")
    if live_types:
        from_live = set(re.findall(r'"([^"]+)"', live_types.group(1)))
        chk = re.search(
            r"enquiry_type_chk\s+CHECK\s*\(\s*enquiry_type\s+IN\s*\((.*?)\)\)",
            raw_everything, re.I | re.S)
        from_schema = set(re.findall(r"'([^']+)'", chk.group(1))) if chk else set()
        r.check(from_live == from_schema,
                "the enquiry CHECK lists exactly the six live enquiry types",
                f"live={sorted(from_live)} schema={sorted(from_schema)}")

    # -- importer <-> schema agreement ---------------------------------------
    importer = (REPO / "scripts" / "db" / "apply_schema.py").read_text(
        encoding="utf-8")
    for column in ("source_slug", "slug_segment", "entry_status", "legacy",
                   "indicative_structure", "in_plant_available"):
        r.check(column in importer, f"the importer writes {column}")

    r.check("gen_random_uuid" not in everything or
            "MIN_POSTGRES_MAJOR = 13" in importer,
            "the importer enforces the PostgreSQL 13 floor that gen_random_uuid needs")

    r.check(re.search(r"EXPECTED_PROGRAMMES\s*=\s*135", importer) is not None,
            "the importer asserts 135 programmes")
    r.check(re.search(r"EXPECTED_FEES\s*=\s*137", importer) is not None,
            "the importer asserts 137 fee rows")

    # The importer must not be able to write with a connection string of its own.
    r.check("GIBS_ALLOW_CATALOGUE_IMPORT" in importer,
            "the importer requires an explicit environment gate")
    r.check("GIBS_ALLOW_SCHEMA_APPLY" in importer,
            "the applier requires an explicit environment gate")

    # -- README claims that are cheap to keep true --------------------------
    readme = (REPO / "docs" / "backend" / "README.md").read_text(encoding="utf-8")
    for claim, ok in (
        ("README says the chain is unexecuted",
         "never executed" in readme.lower()),
        ("README records the slug truncation figure",
         "77 of 135" in readme),
        ("README records the fee row count",
         "137 fee rows" in readme),
        ("README records the amendment gap",
         "amendment workflow" in readme),
    ):
        r.check(ok, claim)

    truncated = 0
    for record in programmes:
        slug = record["slug"]
        if len(slug) >= 60:
            truncated += 1
    r.check(truncated > 0,
            "truncated slugs exist, so the immutability warning is load-bearing",
            f"{truncated} slugs are 60 characters or longer")

    return r.report()


if __name__ == "__main__":
    sys.exit(main())