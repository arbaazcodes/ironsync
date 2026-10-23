# IronSync implementation and rollout — 23 October 2026

This implements the first public-app milestone: authorization fixes, public authentication, and a persistent workout logger. It does not complete every item in the [production roadmap](PRODUCTION_BACKLOG.md).

## Status

- Application release `383191c` was deployed through the existing GitHub-to-Vercel integration and verified at `https://www.ironsync.online`. See the [live release record](RELEASE_2026-10-23.md) for deployment, SMTP, and browser-test results.
- Migration `20261023043606_public_signup_and_workout_security` was applied transactionally to Supabase project `fdduamdeepiqdytqfwmb` through its authenticated SQL Editor, then recorded and verified in `supabase_migrations.schema_migrations`.
- Follow-up migration `20261023052640_harden_timestamp_function` fixes the legacy timestamp trigger's mutable search path. Its behavior was checked in PGlite before applying it live and recording migration history.
- The existing admin account explicitly identified by the owner was added to the allowlist. Public signup never grants admin membership.
- Live SQL checks passed for workout ownership policies, private gym tables, the single requested admin, and server-only quota permissions.
- Live REST checks returned 401 for anonymous access to workouts, gym admins, members, and notifications; the server credential returned 200 for zero-row schema probes.
- Auth settings responded successfully: email and Google providers enabled, public signup enabled, email confirmation required. This confirms configuration flags, not SMTP delivery or a completed Google OAuth flow.
- Added and verified exact password-recovery callback URLs for the existing production, backup, and localhost origins. Canonical Site URL remains `https://ironsync.online`.
- **Custom Gmail SMTP is configured and tested.** The settings persisted after refresh, and a recovery email from the configured IronSync sender arrived at the test inbox at 11:27 AM IST. Its link opened the deployed password-update page. Initial signup confirmation and password update also passed. See the [release record](RELEASE_2026-10-23.md) for scope and evidence. Use a transactional provider and verified domain before broad public launch; the [official SMTP setup guide](https://supabase.com/docs/guides/auth/auth-smtp) explains provider setup.

Local verification screenshots are retained in `docs/evidence/` and excluded from the public repository.

## Implemented behavior

### Security

Admin access requires a verified Supabase identity and a successful lookup in `gym_admins`. Missing configuration, lookup errors, and absent allowlist entries deny access. User-editable metadata cannot grant admin privileges.

The migration removes public/client access to legacy gym data and confines it to authenticated server routes. Profile ownership uses the profile primary key. Notification reads and updates include the intended member identity; browser subscriptions to unrestricted notifications were removed.

Legacy member sessions require a private secret of at least 32 characters. APIs verify current membership status, expiry, and a credential version derived from the PIN hash. Suspended/expired accounts lose access, and resetting a PIN invalidates existing sessions. Old member cookies require a fresh login after deploying this version.

PIN login attempts use an atomic database quota shared by server instances. Quota failures deny login instead of bypassing limits. Cross-origin mutations and unsafe redirect destinations are rejected. Unprotected AI endpoints are disabled with an explicit unavailable response until authenticated usage limits are implemented.

### Public signup

`/auth` provides email signup/sign-in, email confirmation guidance and resend, password reset, and Google sign-in. `/auth/callback` handles both PKCE and token-hash email links, retains auth cookies, and validates redirect destinations. `/auth/update-password` completes password recovery.

Public users go to `/dashboard/workout`; they do not need a gym member ID or an existing generated plan. Onboarding remains public, reports plan-sync failures, and retains the draft for retry. Plan caches are checked against the signed-in user.

### Workout logger

Users can start an empty session or a day from their saved plan, choose kg/lb, add exercises, edit actual weights/reps, add/remove sets, complete/undo sets, use a persistent rest timer, finish a workout, and inspect completed history and totals.

Every edit is saved immediately in account-scoped browser storage, then sent to the authenticated workout API. Refresh restores completed sets, values, exercise IDs, and timer state. Temporary cloud failures retain the draft and expose retry status. Pending requests retain their mutation IDs across refresh, preventing duplicate writes after a lost response.

Cloud writes use revision checks. Conflicting device versions require an explicit choice; accepting the cloud copy first backs up the local draft. Completed workouts must sync before a new session starts. Accounts cannot see each other's history through the API or database policies.

The first implementation uses one versioned JSONB snapshot per workout so all sets are saved atomically. This deliberately precedes the roadmap's normalized analytics tables. A later migration can extract exercise/set rows while preserving IDs and workout history.

## Verification

| Check | Result | Scope |
| --- | --- | --- |
| Vitest | 41 tests passed across 5 files | Redirect/origin checks, auth routing, member revocation, draft recovery, retries/conflicts, actual Postgres migration/RLS/quotas in PGlite |
| Playwright | 2 complete scenarios passed | Public onboarding/signup/reset requests; sign-in, set edits, refresh recovery, failed cloud save and retry, completion/history, admin denial, account isolation |
| Production build | Passed, Next.js 15.5.28 | Compilation, route generation, TypeScript and lint checks |
| Lint and diff whitespace check | Passed | Existing image/font warnings remain |
| Production dependency audit | 0 known vulnerabilities reported | `npm audit --omit=dev` at implementation time |
| Full dependency audit | 13 development-tool advisories | 5 moderate, 8 high in development chains; major-tool upgrades remain separate work |
| Live Supabase verification | Passed | Migration applied, access grants checked, admin enrollment verified, anonymous/server REST probes |

The final live security advisor rerun reported **zero errors, one warning, and six informational notices**. The mutable search path on `handle_updated_at` was fixed by the follow-up migration. Leaked-password protection remains disabled: Supabase makes that feature available on Pro plans and above, while this project is on Free. See the [official password-security documentation](https://supabase.com/docs/guides/auth/password-security). No subscription or billing changes were made. The six informational notices are RLS-without-policy notices for tables intentionally restricted to service-role access.

The automated browser tests above use a local Supabase protocol fixture backed by the real migration in PGlite. They do not send real emails or prove production OAuth/SMTP delivery. Subsequent tests against the deployed site are recorded separately in the [live release record](RELEASE_2026-10-23.md). Physical-device QA and Google OAuth verification remain outstanding.

## Deployment steps

1. Keep the current Supabase URL; it already matches `.env.local`. The project became reachable during implementation. Do not replace keys with values from another project.
2. Both new security migrations are already applied to this project. For a separate environment, inspect its existing schema and apply the [workout/security migration](../supabase/migrations/20261023043606_public_signup_and_workout_security.sql) and [timestamp hardening](../supabase/migrations/20261023052640_harden_timestamp_function.sql), then run [verification SQL](../supabase/verify_public_workout_security.sql). Do not replay historical baseline SQL on this live database: old migrations contain permissive policies and the legacy migration history needs reconciliation before an unrestricted `db push`.
3. Confirm the deployment has matching public Supabase credentials, the server-only service-role key, `MEMBER_SESSION_SECRET` with at least 32 characters, and the correct `NEXT_PUBLIC_SITE_URL`. Never put the service-role key or member secret in `NEXT_PUBLIC_` variables.
4. Auth Site URL is `https://ironsync.online`. Existing signup callbacks were preserved. Recovery callbacks with `?next=/auth/update-password` were added for `https://www.ironsync.online`, `https://ironsync.online`, `https://ironsync-peach.vercel.app`, and `http://localhost:3000`. Review preview-origin allowlists separately before beta.
5. Custom Gmail SMTP is now saved in **Supabase → Authentication → Emails → SMTP Settings** and recovery email delivery is verified. When changing providers, configure the verified sender/domain, host, port, username, and provider password, then repeat delivery tests. Email confirmation remains required. Complete a Google login test to verify provider credentials and redirect configuration.
6. The deployed public-account smoke test passed: a user with no generated plan logged two completed sets, refreshed, finished, refreshed again, and saw the saved workout in history. An independent live database read matched the values. Repeat using a second account to check live account isolation beyond the automated tests.
7. Verify the approved admin can access `/admin/members`, ordinary users cannot, legacy members can log in, notifications remain scoped, and a PIN reset invalidates the old member session.
8. Run Supabase advisors, review production errors, verify backups/restore capability, and record release evidence before opening a public beta.

For email links that work in a different browser, the callback supports token hashes. The signup template can link to `{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email`; recovery can use the same path with `type=recovery`. Default PKCE links are also supported, but depend on the browser that initiated the flow. Review the [official email-template documentation](https://supabase.com/docs/guides/auth/auth-email-templates) when configuring these links.

## Reproduce local checks

```powershell
npm ci
npm test
npx playwright install chromium
npm run test:e2e
npx tsc --noEmit --incremental false
npm run lint
npm run build
npm audit --omit=dev
```

## Operational limits and next work

Browser storage is a recovery copy, not a backup. Clearing site data removes unsynced drafts; the UI reports storage failures and offers an export when conflicts occur. Drafts remain account-scoped across logout to avoid silently deleting unsynced sets. Full offline page loading and multi-tab editing are not certified by this milestone.

Schedule trusted maintenance for expired `private.request_limits` entries as traffic grows. Keep server secrets private. If rolling back application code, preserve the ownership policies and saved workouts; do not restore unrestricted grants as a rollback shortcut.

Next roadmap work includes atomic plan publishing, reviewed exercise content and media, custom routines, account deletion/export, monitoring and backup drills, physical-device QA, and beta feedback. The legacy multi-gym tenant model has not been redesigned.

