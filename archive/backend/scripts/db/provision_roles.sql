-- =============================================================================
-- provision_roles.sql — operator-run role provisioning. NOT A MIGRATION.
-- =============================================================================
--
-- STATUS: designed, not yet executed. See docs/backend/README.md.
--
-- WHAT THIS IS
--   Creates the three cluster roles that db/schema/019_rls_policies.sql expects
--   to already exist:
--
--     anon           unauthenticated public traffic. SELECT only.
--     authenticated  staff. Unused in Phase 1; no login flow exists yet.
--     service_role   server-side API. Holds BYPASSRLS.
--
-- WHY IT IS NOT PART OF THE MIGRATION CHAIN
--   Roles are CLUSTER-scoped in PostgreSQL, not database-scoped. A schema
--   migration that creates roles mutates the whole cluster, and 019 used to do
--   exactly that with an existence check that would have escalated an unrelated
--   pre-existing role:
--
--       ALTER ROLE service_role BYPASSRLS
--
--   run against whatever role happened to be called service_role. On Supabase
--   that role is the platform's own and the grant would have been harmless. On a
--   developer's machine or a shared cluster it would have been a privilege
--   escalation performed silently by a routine deploy.
--
--   Moving provisioning out of the chain makes that impossible rather than
--   unlikely. The invariant now enforced by 019 is:
--
--       The migration chain never creates or alters a cluster role.
--
--   019 requires these roles and raises a clear exception naming this file if
--   they are absent.
--
-- WHEN YOU NEED THIS
--   * Disposable and local test clusters (initdb creates none of these).
--   * A plain PostgreSQL server you administer.
--
--   NOT on Supabase: anon, authenticated and service_role all already exist
--   there, and this script would be a no-op at best and a conflict at worst.
--
-- HOW TO RUN IT
--   psql "$GIBS_DATABASE_URL" -f scripts/db/provision_roles.sql
--
--   It must be applied to each database that needs it, even though the roles
--   themselves are cluster-wide: the GRANTs in 019 are per-database, and this
--   script creates the roles only.
--
-- PRIVILEGES THIS SCRIPT ASSIGNS, AND WHY
--   BYPASSRLS on service_role is the whole reason this file is operator-run:
--   it requires superuser, and it is a real privilege. It is granted to exactly
--   one role, which is created NOLOGIN so that no one logs in as it directly —
--   the deployment owns the login role that inherits it. No other role receives
--   BYPASSRLS, and nothing here grants superuser, CREATEDB or CREATEROLE.
--
--   The "already exists" branches are deliberately loud. If a role of the same
--   name already exists, this script adopts it and reports what it found rather
--   than failing silently or overwriting it. The one thing it will not do is
--   quietly grant BYPASSRLS to a role whose current state it did not create —
--   it prints the state and tells you to decide.
-- =============================================================================

\set ON_ERROR_STOP on

BEGIN;

DO $provision$
DECLARE
  v_exists       boolean;
  v_bypass       boolean;
  v_needs_change text;
BEGIN
  -- ---------------------------------------------------------------------------
  -- anon
  -- ---------------------------------------------------------------------------
  SELECT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') INTO v_exists;
  IF v_exists THEN
    RAISE NOTICE 'anon already exists; adopting it unchanged';
  ELSE
    EXECUTE 'CREATE ROLE anon NOLOGIN';
    RAISE NOTICE 'created role anon';
  END IF;

  -- ---------------------------------------------------------------------------
  -- authenticated
  -- ---------------------------------------------------------------------------
  SELECT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated')
    INTO v_exists;
  IF v_exists THEN
    RAISE NOTICE 'authenticated already exists; adopting it unchanged';
  ELSE
    EXECUTE 'CREATE ROLE authenticated NOLOGIN';
    RAISE NOTICE 'created role authenticated';
  END IF;

  -- ---------------------------------------------------------------------------
  -- service_role — the only role that needs BYPASSRLS
  -- ---------------------------------------------------------------------------
  SELECT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role'),
         COALESCE((SELECT rolbypassrls FROM pg_roles
                    WHERE rolname = 'service_role'), false)
    INTO v_exists, v_bypass;

  IF v_exists THEN
    IF v_bypass THEN
      RAISE NOTICE 'service_role already exists with BYPASSRLS; adopting it';
    ELSE
      -- Refuse rather than escalate. A role named service_role that already
      -- exists without BYPASSRLS is not necessarily ours — it may belong to
      -- another application on a shared cluster. Granting BYPASSRLS to it here
      -- would be the exact hazard this file was extracted to prevent, only moved
      -- one level down. Make the operator decide.
      RAISE EXCEPTION
        'a role named service_role already exists and does NOT have BYPASSRLS. '
        'It may belong to another application on this cluster, so this script '
        'will not grant it BYPASSRLS automatically. If it is yours, run: '
        'ALTER ROLE service_role BYPASSRLS; yourself, after checking who owns it.'
        USING HINT = 'SELECT rolname, rolbypassrls, rolsuper FROM pg_roles ORDER BY rolname;';
    END IF;
  ELSE
    EXECUTE 'CREATE ROLE service_role NOLOGIN';
    EXECUTE 'ALTER ROLE service_role BYPASSRLS';
    RAISE NOTICE 'created role service_role with BYPASSRLS';
  END IF;

  -- ---------------------------------------------------------------------------
  -- Report, so the operator can see the final state rather than assume it
  -- ---------------------------------------------------------------------------
  SELECT string_agg(format('%s (login=%s, bypassrls=%s, superuser=%s)',
                           rolname, rolcanlogin, rolbypassrls, rolsuper), '; '
           ORDER BY rolname)
    INTO v_needs_change
    FROM pg_roles
   WHERE rolname IN ('anon', 'authenticated', 'service_role');

  RAISE NOTICE 'roles provisioned: %', v_needs_change;

  IF EXISTS (SELECT 1 FROM pg_roles
              WHERE rolname IN ('anon', 'authenticated', 'service_role')
                AND rolsuper) THEN
    RAISE EXCEPTION
      'one of the application roles has SUPERUSER; that is never intended here';
  END IF;
END;
$provision$;

COMMENT ON ROLE anon IS
  'Unauthenticated public traffic. SELECT on the published catalogue and its '
  'reference data only. No INSERT, UPDATE or DELETE anywhere. Created by '
  'scripts/db/provision_roles.sql, not by the migration chain.';

COMMENT ON ROLE authenticated IS
  'Staff. Provisioned but unused in Phase 1: there is no login flow and no staff '
  'user store yet. Its policies exist in 019 but are unreachable, and they grant '
  'far more than Phase 1 needs — see the warning in that file.';

COMMENT ON ROLE service_role IS
  'Server-side API role. Holds BYPASSRLS because the API must read and write '
  'through the policies the public role is subject to. NOLOGIN: the deployment '
  'owns the login role that inherits it, so this privilege is never used for a '
  'direct connection.';

COMMIT;