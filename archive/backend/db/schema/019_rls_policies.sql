-- =============================================================================
-- 019_rls_policies.sql — deny by default, grant the minimum
-- =============================================================================
--
-- STATUS: WRITTEN, NOT EXECUTED at the time of writing. See
-- docs/backend/README.md, "Verification still pending", for what has and has not
-- been run against a real engine since.
--
-- POSTURE
--   Every table gets RLS enabled, which means every table denies everything until
--   a policy says otherwise. The aim is that "what can the public do?" has an
--   answer that is a short readable list at the bottom of this file, rather than
--   an accumulation of grants made over time.
--
--   001_programme.sql listed the intended posture in prose. This file is that
--   list, made executable.
--
-- THE PUBLIC ROLE CANNOT WRITE. AT ALL.
--   anon gets SELECT and nothing else — no INSERT, no UPDATE, no DELETE,
--   anywhere. This matters for enquiry and subscriber submission: if the browser
--   held INSERT, a caller could forge the server-resolved columns on an enquiry
--   (catalogue_year, programme_code, programme_title — see 014) and defeat the
--   entire point of resolving them server-side.
--
--   Public writes therefore go through the server API, which holds the service
--   key. That function does not exist yet; it is Phase 2. Until it does, the
--   frontend's simulated submit flows remain simulations, which is the correct
--   and honest state — nothing is lost by having no write path.
--
-- ROLES ARE NOT PROVISIONED HERE. THIS IS THE IMPORTANT INVARIANT.
--   Roles are CLUSTER-scoped in PostgreSQL, not database-scoped. An earlier
--   revision of this file created anon / authenticated / service_role itself and
--   then granted BYPASSRLS to service_role. That was a real hazard, and it was not
--   hypothetical: the guard it used was an EXISTENCE check, so on any cluster
--   where a role named service_role already existed — a developer's machine, a
--   shared staging box, anything with an unrelated role of that name — this
--   migration would have silently executed
--
--       ALTER ROLE service_role BYPASSRLS
--
--   against a role it did not create and knew nothing about. A schema migration
--   escalating an unrelated cluster role is exactly the kind of thing that must
--   be impossible rather than unlikely.
--
--   So this file now REQUIRES the roles and fails loudly if they are absent. It
--   creates nothing and alters no role. Provisioning moved to
--   scripts/db/provision_roles.sql, which is operator-run and explicitly not part
--   of the migration chain.
--
--   On Supabase all three roles already exist and nothing needs applying at all —
--   which is the deployment this design was written for. The provisioning script
--   exists for plain PostgreSQL and disposable test environments, where they do
--   not.
--
--   If the deployment target uses different role names, THIS FILE MUST BE
--   RECONCILED BEFORE IT IS APPLIED. Silently renaming roles is not a safe
--   default, because a policy that names a role nobody holds applies to nobody
--   and the table simply stays closed — a failure that looks like working
--   security right up until it is tested with real data.
--
-- TABLE OWNERSHIP AND FORCE ROW LEVEL SECURITY
--   RLS does not apply to the table owner. That is intentional here: the
--   lifecycle functions in 018 are SECURITY DEFINER and owned by the migration
--   role, and they must be able to archive one year while publishing another.
--   FORCE ROW LEVEL SECURITY is NOT used, precisely so that those functions work.
--
--   The consequence must be stated plainly: whoever owns these tables can do
--   anything to them, including rewriting published history. That is a smaller
--   circle of people than the application roles below, and it is managed by not
--   giving the application its ownership. It is not enforced by this file.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Require the roles. Fail loudly; provision nothing.
-- -----------------------------------------------------------------------------
DO $require_roles$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon')
     OR NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated')
     OR NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role')
  THEN
    RAISE EXCEPTION
      'required roles anon/authenticated/service_role are missing. '
      'Role provisioning is cluster-scoped and is deliberately NOT part of this '
      'migration: apply scripts/db/provision_roles.sql first. On Supabase these '
      'roles already exist and this check passes with nothing to apply.'
      USING HINT = 'psql -f scripts/db/provision_roles.sql';
  END IF;
END
$require_roles$;

COMMENT ON ROLE anon IS
  'Unauthenticated public traffic. SELECT on the published catalogue and its '
  'reference data only. No INSERT, UPDATE or DELETE anywhere.';

COMMENT ON ROLE authenticated IS
  'Staff. Created by this file but unused in Phase 1: there is no login flow and '
  'no staff user store yet. Its policies are written but unreachable, and they '
  'grant far more than Phase 1 needs — see the warning above them.';


-- -----------------------------------------------------------------------------
-- Enable RLS on everything
-- -----------------------------------------------------------------------------
-- ALTER TABLE ... ENABLE ROW LEVEL SECURITY is idempotent and touches no rows.
ALTER TABLE catalogue_year           ENABLE ROW LEVEL SECURITY;
ALTER TABLE programme_lineage        ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogue_programme      ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogue_programme_fee  ENABLE ROW LEVEL SECURITY;
ALTER TABLE programme_url            ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiry                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriber               ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogue_audit_log      ENABLE ROW LEVEL SECURITY;
ALTER TABLE programme_category       ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination              ENABLE ROW LEVEL SECURITY;


-- -----------------------------------------------------------------------------
-- Reference data: readable by everyone, writable by nobody
-- -----------------------------------------------------------------------------
-- programme_category and destination are reference tables whose contents the
-- frontend already matches by exact string equality. Reading them costs nothing
-- and gains nothing an attacker could not get from the published catalogue.

GRANT SELECT ON programme_category, destination TO anon, authenticated;

CREATE POLICY programme_category_read ON programme_category
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY destination_read ON destination
  FOR SELECT TO anon, authenticated
  USING (true);


-- -----------------------------------------------------------------------------
-- The public catalogue: published year only
-- -----------------------------------------------------------------------------
-- Note the shape of every policy below: the year status is repeated in each one.
-- It is tempting to grant anon SELECT on catalogue_year and rely on a filter
-- elsewhere, but "elsewhere" is a component that can be forgotten, and a draft
-- catalogue leaking because one query forgot its WHERE clause is a real and
-- entirely preventable failure. Each policy states the condition it depends on.

GRANT SELECT ON catalogue_year TO anon;

CREATE POLICY catalogue_year_published_read ON catalogue_year
  FOR SELECT TO anon
  USING (status = 'published');

-- Draft years and their contents are invisible to anon by construction: the
-- subqueries below match on catalogue_year.status = 'published', and anon can see
-- only published rows in catalogue_year, so a draft year never satisfies the join.
CREATE POLICY catalogue_programme_published_read ON catalogue_programme
  FOR SELECT TO anon
  USING (
    entry_status = 'listed'
    AND EXISTS (
      SELECT 1 FROM catalogue_year cy
       WHERE cy.id = catalogue_programme.catalogue_year_id
         AND cy.status = 'published'
    )
  );

CREATE POLICY catalogue_programme_fee_published_read ON catalogue_programme_fee
  FOR SELECT TO anon
  USING (
    EXISTS (
      SELECT 1
        FROM catalogue_programme cp
        JOIN catalogue_year cy ON cy.id = cp.catalogue_year_id
       WHERE cp.id = catalogue_programme_fee.catalogue_programme_id
         AND cp.entry_status = 'listed'
         AND cy.status = 'published'
    )
  );

-- programme_url is readable when it is a redirect, when it is retired, or when
-- it points to a programme in a published year. A removed programme's archived
-- link should still resolve rather than 404.
CREATE POLICY programme_url_published_read ON programme_url
  FOR SELECT TO anon
  USING (
    redirect_to_slug IS NOT NULL
    OR retired_at IS NOT NULL
    OR EXISTS (
      SELECT 1
        FROM catalogue_programme cp
        JOIN catalogue_year cy ON cy.id = cp.catalogue_year_id
       WHERE cp.id = programme_url.current_programme_id
         AND cy.status = 'published'
    )
  );

-- The two public read helpers. Both are SECURITY DEFINER precisely so the public
-- can call them without SELECT on catalogue_year, and both therefore have to be
-- granted explicitly after being revoked at creation. current_published_year
-- returns a uuid; resolve_programme_url returns that slug's programme. Neither
-- can write, and neither can see anything unpublished: both reach the catalogue
-- through the same published-year condition the table policies above use.
GRANT EXECUTE ON FUNCTION current_published_year() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION resolve_programme_url(text, smallint) TO anon, authenticated;

-- Lineage is continuity metadata: it says which 2027 row came from which 2026 row.
-- Nothing in the public UI needs it, and exposing it would publish GIBS's internal
-- revision history. No anon policy.
GRANT SELECT ON catalogue_year, programme_lineage TO authenticated;

-- The RLS policies above filter rows, but the anon role also needs base SELECT
-- privilege on the tables those policies protect. Without these grants the
-- policies are unreachable and the public catalogue returns nothing.
GRANT SELECT ON catalogue_programme TO anon;
GRANT SELECT ON catalogue_programme_fee TO anon;
GRANT SELECT ON programme_url TO anon;


-- -----------------------------------------------------------------------------
-- Staff
-- -----------------------------------------------------------------------------
--
-- WARNING — READ BEFORE TRUSTING THESE POLICES
--   These policies grant authenticated users full write access to every catalogue
--   table, with no per-responsibility scoping. That is honest for Phase 1, which
--   has no staff authentication and therefore no way to distinguish an editor from
--   an approver. It is NOT acceptable for production: publication is a
--   governance action and the person who edits should not automatically be the
--   person who signs off.
--
--   Before any staff login exists, these must be split into at least editor and
--   approver roles, and publication restricted to the approver. Recorded in
--   docs/backend/README.md as a production blocker.
--
--   What protects published data in the meantime is NOT these policies but the
--   triggers in 018: even a fully privileged staff session cannot edit a year that
--   is in review, published or archived state.

GRANT SELECT, INSERT, UPDATE, DELETE ON catalogue_year          TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON programme_lineage       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON catalogue_programme     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON catalogue_programme_fee TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON programme_url           TO authenticated;
GRANT SELECT ON enquiry, subscriber TO authenticated;

CREATE POLICY catalogue_year_staff_all ON catalogue_year
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY programme_lineage_staff_all ON programme_lineage
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY catalogue_programme_staff_all ON catalogue_programme
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY catalogue_programme_fee_staff_all ON catalogue_programme_fee
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY programme_url_staff_all ON programme_url
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Staff may read enquiries and subscribers but never modify them: an enquiry is a
-- record of what a person asked, and correcting one is not the same act as reading
-- one. No UPDATE or DELETE policy exists, so no UPDATE or DELETE grant is given.
CREATE POLICY enquiry_staff_read ON enquiry
  FOR SELECT TO authenticated USING (true);

CREATE POLICY subscriber_staff_read ON subscriber
  FOR SELECT TO authenticated USING (true);


-- -----------------------------------------------------------------------------
-- Audit log: INSERT only, for the functions that need it
-- -----------------------------------------------------------------------------
-- write_catalogue_audit is SECURITY DEFINER, so it does not need a grant on the
-- table itself. Nothing else needs INSERT either.
--
-- Update and delete are revoked from every role that could otherwise reach the
-- row. This is what makes the table append-only in practice rather than by
-- convention — see 016 for why a trigger was not used.
REVOKE UPDATE, DELETE ON catalogue_audit_log FROM anon, authenticated;
GRANT SELECT ON catalogue_audit_log TO authenticated;

CREATE POLICY catalogue_audit_log_staff_read ON catalogue_audit_log
  FOR SELECT TO authenticated USING (true);

-- HONEST LIMIT OF THIS SECTION
--   service_role has BYPASSRLS, and a BYPASSRLS role with table grants is not
--   stopped by a REVOKE of UPDATE/DELETE here. Append-only therefore holds against
--   anon and authenticated, and against the ordinary application path — the API
--   holds the service key and has no code path that writes UPDATE or DELETE to
--   this table. It does NOT hold against the table owner or a superuser.
--   Protecting the trail against those requires a separate, separate-database
--   audit sink or a trigger that even a superuser cannot disable. That is a
--   deployment decision and is recorded as such, not silently assumed.


-- -----------------------------------------------------------------------------
-- Enquiries and subscribers: no public policy at all
-- -----------------------------------------------------------------------------
-- RLS is enabled and no policy grants anon anything, so the public cannot read,
-- write, enumerate or infer the existence of these tables. The insert path is the
-- Phase 2 API function; until it exists, these tables stay empty, which is a
-- correct state rather than a broken one.


-- -----------------------------------------------------------------------------
-- Verification
-- -----------------------------------------------------------------------------
-- Run after applying. Expected: every row RLS enabled, and anon holding no
-- INSERT/UPDATE/DELETE grant on anything. Both are cheap to check and neither is
-- visible from application behaviour until it is too late.
--
--   SELECT c.relname, c.relrowsecurity, c.relforcerowsecurity
--     FROM pg_class c
--     JOIN pg_namespace n ON n.oid = c.relnamespace
--    WHERE n.nspname = 'public' AND c.relkind = 'r'
--    ORDER BY c.relname;
--
--   SELECT grantee, table_name, privilege_type
--     FROM information_schema.role_table_grants
--    WHERE table_schema = 'public'
--      AND privilege_type IN ('INSERT', 'UPDATE', 'DELETE')
--      AND grantee IN ('anon', 'authenticated')
--    ORDER BY table_name, grantee, privilege_type;
--   -- expected: no rows for anon; only the six catalogue-table grants to
--   -- authenticated, all INSERT/UPDATE/DELETE as granted above.
-- =============================================================================
-- END 019_rls_policies.sql
-- =============================================================================