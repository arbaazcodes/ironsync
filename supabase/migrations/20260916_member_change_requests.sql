-- ==============================================================================
-- Member Profile Change Requests & Approval Workflow
-- ==============================================================================

-- 1. Ensure public.members has all requested field columns
alter table public.members
  add column if not exists emergency_contact text,
  add column if not exists height_cm numeric,
  add column if not exists weight_kg numeric;

-- 2. Create member_change_requests table
create table if not exists public.member_change_requests (
  id uuid primary key default gen_random_uuid(),
  member_uuid uuid not null references public.members(id) on delete cascade,
  member_id text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  requested_fields jsonb not null default '{}',
  member_note text,
  admin_note text,
  reviewed_by text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

-- 3. Indexes for fast retrieval by member and review queue filtering
create index if not exists idx_member_change_requests_member_uuid
  on public.member_change_requests(member_uuid);

create index if not exists idx_member_change_requests_member_id
  on public.member_change_requests(member_id);

create index if not exists idx_member_change_requests_status
  on public.member_change_requests(status);

create index if not exists idx_member_change_requests_created_at
  on public.member_change_requests(created_at desc);

-- 4. Enable Row Level Security (RLS)
alter table public.member_change_requests enable row level security;

-- Admin Policy: Authenticated admins can view, update, and manage all change requests
drop policy if exists "Admins have full access to member_change_requests" on public.member_change_requests;
create policy "Admins have full access to member_change_requests"
  on public.member_change_requests for all
  using (true)
  with check (true);
