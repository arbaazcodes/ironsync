-- ==============================================================================
-- IronSync Database Schema Migration
-- Copy and execute this script inside your Supabase Project > SQL Editor
-- ==============================================================================

-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  display_name text check (display_name is null or length(display_name) <= 100),
  goal text,
  gender text,
  age integer check (age is null or (age >= 10 and age <= 120)),
  height numeric check (height is null or (height >= 50 and height <= 300)),
  weight numeric check (weight is null or (weight >= 20 and weight <= 350)),
  target_weight numeric check (target_weight is null or (target_weight >= 20 and target_weight <= 350)),
  experience text,
  equipment text,
  days_per_week integer check (days_per_week is null or (days_per_week >= 1 and days_per_week <= 7)),
  session_duration integer check (session_duration is null or (session_duration >= 15 and session_duration <= 180)),
  training_time text,
  diet_type text,
  meals_per_day integer check (meals_per_day is null or (meals_per_day >= 1 and meals_per_day <= 8)),
  budget text,
  food_restrictions text[] default '{}'::text[]
);

-- 2. Plans Table (Supports Plan Versioning: v1 -> archived, v2 -> active)
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  version integer default 1 not null,
  goal text not null,
  calories integer not null,
  protein integer not null,
  carbs integer not null,
  fat integer not null,
  training_days integer not null,
  status text default 'active' check (status in ('active', 'archived')) not null
);

-- 3. Plan Workouts Table
create table if not exists public.plan_workouts (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references public.plans(id) on delete cascade not null,
  day text not null,
  title text not null,
  exercise_data jsonb default '[]'::jsonb not null
);

-- 4. Plan Meals Table
create table if not exists public.plan_meals (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references public.plans(id) on delete cascade not null,
  meal_type text not null,
  meal_data jsonb default '{}'::jsonb not null
);

-- Indexes for optimal querying
create index if not exists idx_profiles_user_id on public.profiles(user_id);
create index if not exists idx_plans_user_status on public.plans(user_id, status);
create index if not exists idx_plan_workouts_plan_id on public.plan_workouts(plan_id);
create index if not exists idx_plan_meals_plan_id on public.plan_meals(plan_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.plan_workouts enable row level security;
alter table public.plan_meals enable row level security;

-- Profiles Policies: Users only access their own profile
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id or auth.uid() = user_id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id or auth.uid() = user_id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id or auth.uid() = user_id)
  with check (auth.uid() = id or auth.uid() = user_id);

drop policy if exists "Users can delete own profile" on public.profiles;
create policy "Users can delete own profile"
  on public.profiles for delete
  using (auth.uid() = id or auth.uid() = user_id);

-- Plans Policies: Users only access their own plans
drop policy if exists "Users can view own plans" on public.plans;
create policy "Users can view own plans"
  on public.plans for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own plans" on public.plans;
create policy "Users can insert own plans"
  on public.plans for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own plans" on public.plans;
create policy "Users can update own plans"
  on public.plans for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own plans" on public.plans;
create policy "Users can delete own plans"
  on public.plans for delete
  using (auth.uid() = user_id);

-- Plan Workouts Policies: Relies on parent plan relationship
drop policy if exists "Users can view own plan workouts" on public.plan_workouts;
create policy "Users can view own plan workouts"
  on public.plan_workouts for select
  using (
    exists (
      select 1 from public.plans
      where plans.id = plan_workouts.plan_id
      and plans.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert own plan workouts" on public.plan_workouts;
create policy "Users can insert own plan workouts"
  on public.plan_workouts for insert
  with check (
    exists (
      select 1 from public.plans
      where plans.id = plan_workouts.plan_id
      and plans.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update own plan workouts" on public.plan_workouts;
create policy "Users can update own plan workouts"
  on public.plan_workouts for update
  using (
    exists (
      select 1 from public.plans
      where plans.id = plan_workouts.plan_id
      and plans.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.plans
      where plans.id = plan_workouts.plan_id
      and plans.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete own plan workouts" on public.plan_workouts;
create policy "Users can delete own plan workouts"
  on public.plan_workouts for delete
  using (
    exists (
      select 1 from public.plans
      where plans.id = plan_workouts.plan_id
      and plans.user_id = auth.uid()
    )
  );

-- Plan Meals Policies: Relies on parent plan relationship
drop policy if exists "Users can view own plan meals" on public.plan_meals;
create policy "Users can view own plan meals"
  on public.plan_meals for select
  using (
    exists (
      select 1 from public.plans
      where plans.id = plan_meals.plan_id
      and plans.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert own plan meals" on public.plan_meals;
create policy "Users can insert own plan meals"
  on public.plan_meals for insert
  with check (
    exists (
      select 1 from public.plans
      where plans.id = plan_meals.plan_id
      and plans.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update own plan meals" on public.plan_meals;
create policy "Users can update own plan meals"
  on public.plan_meals for update
  using (
    exists (
      select 1 from public.plans
      where plans.id = plan_meals.plan_id
      and plans.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.plans
      where plans.id = plan_meals.plan_id
      and plans.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete own plan meals" on public.plan_meals;
create policy "Users can delete own plan meals"
  on public.plan_meals for delete
  using (
    exists (
      select 1 from public.plans
      where plans.id = plan_meals.plan_id
      and plans.user_id = auth.uid()
    )
  );

-- Automatic updated_at timestamp trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_profiles_updated on public.profiles;
create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

drop trigger if exists on_plans_updated on public.plans;
create trigger on_plans_updated
  before update on public.plans
  for each row execute procedure public.handle_updated_at();

-- ==============================================================================
-- 5. Check-Ins Table (Progress Tracking & Plan Recalibration)
-- ==============================================================================
create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  plan_id uuid references public.plans(id) on delete set null,
  weight_kg numeric not null check (weight_kg > 20 and weight_kg < 350),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  notes text check (notes is null or length(notes) <= 1000)
);

create index if not exists idx_check_ins_user_id on public.check_ins(user_id);
create index if not exists idx_check_ins_plan_id on public.check_ins(plan_id);
create index if not exists idx_check_ins_created_at on public.check_ins(created_at desc);

alter table public.check_ins enable row level security;

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
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own check-ins" on public.check_ins;
create policy "Users can delete own check-ins"
  on public.check_ins for delete
  using (auth.uid() = user_id);

-- ==============================================================================
-- 6. Exports Table (PDF & Share Card Export Tracking)
-- ==============================================================================
create table if not exists public.exports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  plan_id uuid references public.plans(id) on delete set null,
  type text not null check (type in ('pdf', 'share_card')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_exports_user_id on public.exports(user_id);
create index if not exists idx_exports_plan_id on public.exports(plan_id);
create index if not exists idx_exports_created_at on public.exports(created_at desc);

alter table public.exports enable row level security;

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

-- ==============================================================================
-- 7. Reminder Preferences Table (Smart Reminders Foundation)
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

create index if not exists idx_reminder_preferences_user_id on public.reminder_preferences(user_id);

alter table public.reminder_preferences enable row level security;

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
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own reminder preferences" on public.reminder_preferences;
create policy "Users can delete own reminder preferences"
  on public.reminder_preferences for delete
  using (auth.uid() = user_id);

drop trigger if exists on_reminder_preferences_updated on public.reminder_preferences;
create trigger on_reminder_preferences_updated
  before update on public.reminder_preferences
  for each row execute procedure public.handle_updated_at();

-- ==============================================================================
-- 8. Members Table (Gym Member Management & Access Control)
-- ==============================================================================
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  member_id text not null unique, -- format: 'IS-2026-0001'
  full_name text not null check (length(full_name) <= 120),
  phone text not null,
  email text,
  pin_hash text not null, -- salted scrypt hash (salt:hash), NEVER plaintext
  status text default 'active' check (status in ('active', 'inactive', 'suspended', 'expired')) not null,
  fitness_goal text default 'muscle_gain' not null,
  plan_id uuid references public.plans(id) on delete set null,
  start_date date default current_date not null,
  expiry_date date,
  date_of_birth date,
  gender text,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_login_at timestamp with time zone
);

create index if not exists idx_members_member_id on public.members(member_id);
create index if not exists idx_members_status on public.members(status);
create index if not exists idx_members_created_by on public.members(created_by);
create index if not exists idx_members_plan_id on public.members(plan_id);

alter table public.members enable row level security;

-- Admin RLS: Admins can view/manage members created by their organization
drop policy if exists "Admins can view own gym members" on public.members;
create policy "Admins can view own gym members"
  on public.members for select
  using (auth.uid() = created_by);

drop policy if exists "Admins can insert gym members" on public.members;
create policy "Admins can insert gym members"
  on public.members for insert
  with check (auth.uid() = created_by);

drop policy if exists "Admins can update gym members" on public.members;
create policy "Admins can update gym members"
  on public.members for update
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

drop policy if exists "Admins can delete gym members" on public.members;
create policy "Admins can delete gym members"
  on public.members for delete
  using (auth.uid() = created_by);

drop trigger if exists on_members_updated on public.members;
create trigger on_members_updated
  before update on public.members
  for each row execute procedure public.handle_updated_at();
