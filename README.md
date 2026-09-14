# IronSync — Gym Management & Member Platform

IronSync is a production-ready gym management platform and personalized athletic portal built with Next.js, Tailwind CSS, Supabase (PostgreSQL + Auth), and cryptographically verified member sessions.

---

## 1. Quickstart (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Configure local environment
cp .env.local.template .env.local
# Edit .env.local with your Supabase credentials and session secret

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Required Environment Variables

Add these variables to `.env.local` for local development and to **Vercel Project Settings > Environment Variables** for production:

| Variable | Description | Example / Origin |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://fdduamdeepiqdytqfwmb.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Supabase Dashboard > API > Project API keys > `anon` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role secret key (bypasses RLS on server) | Supabase Dashboard > API > Project API keys > `service_role` |
| `MEMBER_SESSION_SECRET` | 32+ char secret for HMAC-SHA256 member session signing | `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL | `https://ironsync.vercel.app` |

---

## 3. Database Schema Setup (Supabase SQL)

Ensure your Supabase project has the schema applied from [`supabase/schema.sql`](./supabase/schema.sql).

If your `public.members` table already exists, run this single SQL migration in the [Supabase SQL Editor](https://supabase.com/dashboard/project/fdduamdeepiqdytqfwmb/sql):

```sql
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS plan_template_key text;
CREATE INDEX IF NOT EXISTS idx_members_plan_template_key ON public.members(plan_template_key);
```

---

## 4. Vercel Production Deployment Checklist

To ensure `https://ironsync.vercel.app` serves this authentic IronSync application (and not an outdated project):

1. **Verify Git Repository on Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com).
   - Locate the project serving `ironsync.vercel.app`.
   - Go to **Settings** > **Git**.
   - Verify the Connected Repository is: `arbaazcodes/ironsync` on branch `main`.
   - *(If it is connected to a different repository, disconnect it and re-import `arbaazcodes/ironsync`)*.

2. **Configure Environment Variables**:
   - In Vercel Project **Settings** > **Environment Variables**, configure:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `MEMBER_SESSION_SECRET`
     - `NEXT_PUBLIC_SITE_URL` = `https://ironsync.vercel.app`

3. **Domain Assignment**:
   - In Vercel Project **Settings** > **Domains**, verify `ironsync.vercel.app` is assigned to this project.

4. **Trigger Redeploy**:
   - Go to the **Deployments** tab.
   - Click the latest commit from `main` > **Redeploy** (with *Clear Build Cache* checked).

---

## 5. End-to-End Verification Loop

Follow these steps to verify the core operational loop:

1. **Admin Login**:
   - Visit `/login?tab=admin`.
   - Log in using your Supabase Admin email and password.
   - You are redirected to `/admin/members`.

2. **Add Gym Member**:
   - Click **"Add New Member"**.
   - Enter athlete details (e.g. Name: Marcus Aurelius, Phone: 9876543210, Goal: Hypertrophy).
   - Click **Save**.
   - A modal displays the official Member ID (e.g. `IS-2026-0001`) and the generated 4-digit PIN (e.g. `4821`).

3. **Verify Database Persistence**:
   - The member row is immediately visible in the table.
   - Refresh the page or restart the server (`npm run dev`) — the member row persists from PostgreSQL (`public.members`).

4. **Member Portal Login**:
   - Open a new Incognito window and visit `/login?tab=member`.
   - Enter Member ID `IS-2026-0001` and the 4-digit PIN.
   - You are redirected to `/member/dashboard` with the athlete's name, active status, and assigned workout split.

5. **Security & Rejection Tests**:
   - Attempting to log in with an incorrect PIN is rejected with *"Invalid Member ID or PIN"*.
   - Tampering with the `ironsync_member_session` cookie immediately redirects to `/login?tab=member`.
   - Sensitive hash values (`pin_hash`) are never exposed in API JSON responses.
