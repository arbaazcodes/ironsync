-- ==============================================================================
-- IronSync Migration: exports table and RLS policies
-- ==============================================================================

create table if not exists public.exports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  plan_id uuid references public.plans(id) on delete set null,
  type text not null check (type in ('pdf', 'share_card')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for fast chronological lookups
create index if not exists idx_exports_user_id on public.exports(user_id);
create index if not exists idx_exports_plan_id on public.exports(plan_id);
create index if not exists idx_exports_created_at on public.exports(created_at desc);

-- Enable Row Level Security
alter table public.exports enable row level security;

-- Strict User Isolation: Users can only view, insert, and delete their own export records
drop policy if exists "Users can view own exports" on public.exports;
create policy "Users can view own exports"
  on public.exports for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own exports" on public.exports;
create policy "Users can insert own exports"
  on public.exports for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own exports" on public.exports;
create policy "Users can delete own exports"
  on public.exports for delete
  using (auth.uid() = user_id);
