-- Apply after the existing schema and migrations. This migration is transactional.
begin;

-- Legacy gym data is accessed only through server routes that verify a gym session.
-- Custom member cookies are NOT Supabase identities and must never imply anon table access.
do $$
declare target text; p record;
begin
  foreach target in array array['attendance','member_change_requests','member_audit_log','notifications','members'] loop
    if to_regclass('public.' || target) is not null then
      execute format('alter table public.%I enable row level security', target);
      for p in select policyname from pg_policies where schemaname='public' and tablename=target loop
        execute format('drop policy %I on public.%I', p.policyname, target);
      end loop;
      execute format('revoke all on public.%I from anon, authenticated', target);
      execute format('grant all on public.%I to service_role', target);
    end if;
  end loop;
end $$;

create table if not exists public.gym_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.gym_admins enable row level security;
do $$ declare p record; begin
  for p in select policyname from pg_policies where schemaname='public' and tablename='gym_admins' loop
    execute format('drop policy %I on public.gym_admins', p.policyname);
  end loop;
end $$;
revoke all on public.gym_admins from anon, authenticated;
grant select on public.gym_admins to authenticated;
grant all on public.gym_admins to service_role;
create policy own_admin_membership on public.gym_admins for select to authenticated
  using (user_id = (select auth.uid()));

-- The primary key, not a second user-controlled column, owns a profile.
do $$ declare p record; begin
  if to_regclass('public.profiles') is not null then
    for p in select policyname from pg_policies where schemaname='public' and tablename='profiles' loop
      execute format('drop policy %I on public.profiles', p.policyname);
    end loop;
    execute 'alter table public.profiles enable row level security';
    execute 'create policy own_profile on public.profiles for all to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()) and (user_id is null or user_id = id))';
  end if;
end $$;

-- A session is a versioned aggregate. Stable IDs inside the snapshot identify exercises/sets.
-- One row update atomically saves all sets; clients cannot see another account's snapshots.
create table public.workout_sessions (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('active','completed')),
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object' and octet_length(snapshot::text) <= 200000),
  revision integer not null default 1 check (revision > 0),
  last_mutation_id uuid not null,
  started_at timestamptz not null,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  check ((status = 'active' and completed_at is null) or (status = 'completed' and completed_at is not null)),
  check (completed_at is null or completed_at >= started_at)
);
create unique index one_active_workout_per_user on public.workout_sessions(user_id) where status = 'active';
create index workout_history_by_user on public.workout_sessions(user_id, started_at desc);
alter table public.workout_sessions enable row level security;
revoke all on public.workout_sessions from anon;
grant select, insert, update, delete on public.workout_sessions to authenticated;
grant all on public.workout_sessions to service_role;
create policy own_workout_sessions on public.workout_sessions for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Durable atomic quotas shared by every server instance. No public or user RPC access.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;
create table private.request_limits (
  key_hash text primary key,
  count integer not null,
  expires_at timestamptz not null
);
create index request_limits_expiry on private.request_limits(expires_at);
alter table private.request_limits enable row level security;
grant all on private.request_limits to service_role;
create or replace function public.consume_request_limit(p_key text, p_limit integer, p_window_seconds integer)
returns table(allowed boolean, remaining integer, retry_after integer)
language plpgsql security invoker set search_path = '' as $$
declare hit private.request_limits;
begin
  if p_limit < 1 or p_limit > 1000 or p_window_seconds < 1 or p_window_seconds > 86400 or length(p_key) <> 64 then
    raise exception 'Invalid quota parameters';
  end if;
  insert into private.request_limits as limits(key_hash, count, expires_at)
    values (p_key, 1, now() + make_interval(secs => p_window_seconds))
  on conflict (key_hash) do update set
    count = case when limits.expires_at <= now() then 1 else least(limits.count + 1, p_limit + 1) end,
    expires_at = case when limits.expires_at <= now() then now() + make_interval(secs => p_window_seconds) else limits.expires_at end
  returning * into hit;
  return query select hit.count <= p_limit, greatest(0, p_limit - hit.count),
    greatest(1, ceil(extract(epoch from hit.expires_at - now()))::integer);
end $$;
revoke all on function public.consume_request_limit(text,integer,integer) from public, anon, authenticated;
grant execute on function public.consume_request_limit(text,integer,integer) to service_role;
commit;
