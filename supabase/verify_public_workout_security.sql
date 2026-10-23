-- Read-only checks after 20261023043606_public_signup_and_workout_security.sql.
select to_regclass('public.workout_sessions') as workout_table,
       to_regprocedure('public.consume_request_limit(text,integer,integer)') as quota_rpc;

select c.relname as table_name, c.relrowsecurity as rls_enabled,
       has_table_privilege('anon', c.oid, 'select') as anon_can_select,
       has_table_privilege('authenticated', c.oid, 'insert') as authenticated_can_insert
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
  and c.relname in ('workout_sessions','gym_admins','profiles','members','attendance',
                   'member_change_requests','member_audit_log','notifications')
order by c.relname;

select tablename, policyname, roles, cmd, qual, with_check from pg_policies
where schemaname = 'public'
  and tablename in ('workout_sessions','gym_admins','profiles','members','attendance',
                   'member_change_requests','member_audit_log','notifications')
order by tablename, policyname;

select role_name,
       has_function_privilege(role_name, 'public.consume_request_limit(text,integer,integer)', 'execute') as can_execute_quota
from (values ('anon'), ('authenticated'), ('service_role')) roles(role_name);

select indexname, indexdef from pg_indexes
where schemaname = 'public' and tablename = 'workout_sessions';

select proname, proconfig from pg_proc
where oid = to_regprocedure('public.handle_updated_at()');
-- Expected after the follow-up migration: search_path is explicitly empty.

-- Expected: all listed tables have RLS. Anon cannot select workouts or legacy gym
-- tables. Authenticated can insert own workouts/profiles, but cannot insert gym
-- admins or legacy gym rows. Quota execution is allowed only for service_role.
