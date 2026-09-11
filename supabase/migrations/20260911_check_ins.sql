-- ==============================================================================
-- IronSync Migration: check_ins table and RLS policies
-- ==============================================================================

create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  plan_id uuid references public.plans(id) on delete set null,
  weight_kg numeric not null check (weight_kg > 20 and weight_kg < 350),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  notes text
);

-- Indexes for fast chronological lookups
create index if not exists idx_check_ins_user_id on public.check_ins(user_id);
create index if not exists idx_check_ins_plan_id on public.check_ins(plan_id);
create index if not exists idx_check_ins_created_at on public.check_ins(created_at desc);

-- Enable Row Level Security
alter table public.check_ins enable row level security;

-- Strict User Isolation: Users can only query, insert, update, and delete their own records
drop policy if exists "Users can view own check-ins" on public.check_ins;
create policy "Users can view own check-ins"
  on public.check_ins for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own check-ins" on public.check_ins;
create policy "Users can insert own check-ins"
  on public.check_ins for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own check-ins" on public.check_ins;
create policy "Users can update own check-ins"
  on public.check_ins for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own check-ins" on public.check_ins;
create policy "Users can delete own check-ins"
  on public.check_ins for delete
  using (auth.uid() = user_id);
