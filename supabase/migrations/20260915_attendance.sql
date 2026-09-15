-- ==============================================================================
-- Attendance Table Migration for IronSync
-- Track daily workout attendance for gym members (present, missed, skipped)
-- ==============================================================================

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  member_uuid uuid not null references public.members(id) on delete cascade,
  day date not null default current_date,
  status text not null check (status in ('present','missed','skipped')),
  source text not null default 'member' check (source in ('member','admin','auto')),
  created_at timestamptz not null default now(),
  unique (member_uuid, day)
);

create index if not exists idx_attendance_member_day on public.attendance(member_uuid, day desc);
create index if not exists idx_attendance_day on public.attendance(day desc);
create index if not exists idx_attendance_status on public.attendance(status);

-- Enable RLS
alter table public.attendance enable row level security;

-- Admin access policy: Admins can view/manage attendance of their members
drop policy if exists "Admins can view member attendance" on public.attendance;
create policy "Admins can view member attendance"
  on public.attendance for select
  using (
    exists (
      select 1 from public.members
      where members.id = attendance.member_uuid
      and members.created_by = auth.uid()
    )
  );

drop policy if exists "Admins can insert member attendance" on public.attendance;
create policy "Admins can insert member attendance"
  on public.attendance for insert
  with check (
    exists (
      select 1 from public.members
      where members.id = attendance.member_uuid
      and members.created_by = auth.uid()
    )
  );

drop policy if exists "Admins can update member attendance" on public.attendance;
create policy "Admins can update member attendance"
  on public.attendance for update
  using (
    exists (
      select 1 from public.members
      where members.id = attendance.member_uuid
      and members.created_by = auth.uid()
    )
  );
