begin;
create table public.training_programs (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  revision integer not null check (revision > 0),
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object' and octet_length(snapshot::text) <= 200000),
  created_at timestamptz not null default now(),
  unique (user_id, revision)
);
create index training_programs_owner_created on public.training_programs(user_id, created_at desc);
alter table public.training_programs enable row level security;
revoke all on public.training_programs from anon, authenticated;
grant select, insert on public.training_programs to authenticated;
create policy training_program_read on public.training_programs for select to authenticated using ((select auth.uid()) = user_id);
create policy training_program_create on public.training_programs for insert to authenticated with check ((select auth.uid()) = user_id);

create table public.training_day_overrides (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  status text not null check (status in ('skipped', 'planned')),
  updated_at timestamptz not null default now(),
  primary key(user_id, day)
);
alter table public.training_day_overrides enable row level security;
revoke all on public.training_day_overrides from anon, authenticated;
grant select, insert, update on public.training_day_overrides to authenticated;
create policy training_day_read on public.training_day_overrides for select to authenticated using ((select auth.uid()) = user_id);
create policy training_day_create on public.training_day_overrides for insert to authenticated with check ((select auth.uid()) = user_id);
create policy training_day_update on public.training_day_overrides for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
commit;
