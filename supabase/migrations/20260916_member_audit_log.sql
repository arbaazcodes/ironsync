-- Migration: Member Audit Log
-- Tracks member change requests, approvals, rejections, direct admin edits, and email skip events.
-- IMPORTANT: Never store or log pin_hash or raw PINs.

create table if not exists public.member_audit_log (
  id uuid primary key default gen_random_uuid(),
  member_uuid uuid not null references public.members(id) on delete cascade,
  member_id text not null,
  action text not null,
  actor_type text not null check (actor_type in ('member','admin','system')),
  actor_label text,
  request_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

-- Performance Indexes
create index if not exists idx_member_audit_log_member_uuid 
  on public.member_audit_log(member_uuid);

create index if not exists idx_member_audit_log_member_id 
  on public.member_audit_log(member_id);

create index if not exists idx_member_audit_log_created_at 
  on public.member_audit_log(created_at desc);

create index if not exists idx_member_audit_log_action 
  on public.member_audit_log(action);

-- Enable Row Level Security (RLS)
alter table public.member_audit_log enable row level security;

-- Policies:
-- Service role has full access (used by server actions / API routes)
create policy "Service role full access on member_audit_log"
  on public.member_audit_log
  for all
  using (true)
  with check (true);
