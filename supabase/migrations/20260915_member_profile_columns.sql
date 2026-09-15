-- ==============================================================================
-- Member Profile Attributes & Attendance RLS
-- ==============================================================================

-- 1. Extend members table with profile calculation attributes
alter table public.members
  add column if not exists age integer,
  add column if not exists height numeric,
  add column if not exists weight numeric,
  add column if not exists experience text default 'intermediate',
  add column if not exists diet_type text default 'non_vegetarian',
  add column if not exists days_per_week integer default 4;

-- 2. Enable RLS on attendance table and add security policies
alter table public.attendance enable row level security;

drop policy if exists "Admins have full access to attendance" on public.attendance;
create policy "Admins have full access to attendance"
  on public.attendance for all
  using (true)
  with check (true);
