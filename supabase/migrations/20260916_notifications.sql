-- In-App Notifications table for Admin and Member
-- Supports Supabase Realtime subscriptions

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  audience text not null check (audience in ('admin','member')),
  member_uuid uuid references public.members(id) on delete cascade,
  member_id text,
  title text not null,
  body text not null,
  link text,
  type text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Performance Indexes
create index if not exists notifications_audience_created_idx
  on public.notifications (audience, created_at desc);
create index if not exists notifications_member_created_idx
  on public.notifications (member_uuid, created_at desc);

-- Enable RLS and Replica Identity
alter table public.notifications enable row level security;
alter table public.notifications replica identity full;

-- Allow service role full access
drop policy if exists "Service role full access on notifications" on public.notifications;
create policy "Service role full access on notifications"
  on public.notifications
  for all
  using (true)
  with check (true);

-- Allow anon/authenticated select for Realtime listeners
drop policy if exists "Allow read on notifications for realtime" on public.notifications;
create policy "Allow read on notifications for realtime"
  on public.notifications
  for select
  using (true);

-- Enable Realtime replication for public.notifications
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'notifications'
  ) then
    alter publication supabase_realtime add table public.notifications;
  end if;
end $$;

notify pgrst, 'reload schema';
