-- ==============================================================================
-- IronSync Migration: reminder_preferences table and RLS policies
-- ==============================================================================

create table if not exists public.reminder_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  workout_reminder_enabled boolean default false not null,
  workout_reminder_time text default '07:00' not null,
  workout_reminder_days text[] default '{"MON","TUE","THU","FRI"}'::text[] not null,
  check_in_reminder_enabled boolean default false not null,
  check_in_frequency text default 'weekly' check (check_in_frequency in ('weekly', 'bi_weekly')) not null,
  check_in_day text default 'SUN' not null,
  check_in_time text default '08:00' not null,
  plan_review_reminder_enabled boolean default false not null,
  plan_review_frequency_days integer default 30 not null,
  preferred_channels text[] default '{"email"}'::text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for fast user lookup
create index if not exists idx_reminder_preferences_user_id on public.reminder_preferences(user_id);

-- Enable Row Level Security
alter table public.reminder_preferences enable row level security;

-- Strict User Isolation: Users can only view, insert, update, and delete their own reminder preferences
drop policy if exists "Users can view own reminder preferences" on public.reminder_preferences;
create policy "Users can view own reminder preferences"
  on public.reminder_preferences for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own reminder preferences" on public.reminder_preferences;
create policy "Users can insert own reminder preferences"
  on public.reminder_preferences for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own reminder preferences" on public.reminder_preferences;
create policy "Users can update own reminder preferences"
  on public.reminder_preferences for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own reminder preferences" on public.reminder_preferences;
create policy "Users can delete own reminder preferences"
  on public.reminder_preferences for delete
  using (auth.uid() = user_id);

-- Updated_at trigger
drop trigger if exists on_reminder_preferences_updated on public.reminder_preferences;
create trigger on_reminder_preferences_updated
  before update on public.reminder_preferences
  for each row execute procedure public.handle_updated_at();
