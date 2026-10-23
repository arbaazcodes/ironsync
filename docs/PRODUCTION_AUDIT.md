# IronSync: project audit and competitor evidence

**Completed:** 23 October 2026 · **Research and checks:** 22–23 October 2026 · **Code baseline:** ec874eb

Read alongside the [production plan](D:/Projects/IronSync/PRODUCTION_PLAN.md) and [development backlog](D:/Projects/IronSync/docs/PRODUCTION_BACKLOG.md). This document separates observed code behavior, externally documented capabilities, and proposed product decisions.

**Implementation follow-up:** The findings below describe baseline `ec874eb`. Security, public authentication, and workout persistence have since been implemented; the live security migration was applied. See the [implementation evidence and remaining rollout steps](IMPLEMENTATION_2026-10-23.md).

## 1. Audit method and limits

Reviewed the repository structure, package scripts, middleware, authentication helpers, SQL schema/migrations, plan engine, exercise data, mobile screens, analytics, and account deletion flow. Ran the installed project's type check, lint, production build, production dependency audit, exercise-data inventory, and six unauthenticated local HTTP checks. The working tree was clean before planning files were added.

This was not an authenticated penetration test or a full visual/device QA pass. Deployed Supabase grants and policies, production database records, payment settings, provider dashboards, signed Android builds, and authenticated end-to-end journeys were not inspected. No production database migration was applied. An unsuccessful web-tool fetch of the public IronSync domain is not evidence that the site is down.

The README's “production-ready” description is a project claim, not verification. The current source and local results support a working application foundation with significant consumer-release gaps.

## 2. Verification results

| Check | Observed result | What it establishes |
| --- | --- | --- |
| npx tsc --noEmit --incremental false | Passed, exit 0 | Current TypeScript compilation succeeds |
| npm run lint | Passed, exit 0; image/font warnings and next lint deprecation | Existing lint rules report no blocking error; not a zero-warning release |
| npm run build | Passed, exit 0; installed Next.js 15.5.25; 44 static pages generated | Current application builds successfully |
| npm audit --omit=dev | Reported 4 vulnerable package entries: 3 high, 1 moderate | Dependency triage is needed; exposure depends on affected code paths and deployment |
| Catalog inventory | 168 entries, 168 unique IDs, 2 unique video URLs | Catalog count and placeholder-media issue confirmed from evaluated static data |
| Test tooling inventory | Six scratch test scripts, Android example tests; no package test script or tracked CI workflow found | Some checks exist, but repeatable release enforcement is incomplete |

The audit command's JSON reported next (moderate), postcss (high), sharp (high), and source-map-js (high). This is a package/advisory count, not four proven exploitable application vulnerabilities. Review applicability, update the relevant dependency tree, and rerun the audit and build. Do not blindly apply a forced major upgrade.

Advisory examples returned by npm: [Next.js cache poisoning](https://github.com/advisories/GHSA-4jqv-mc3x-m676), [PostCSS source-map disclosure](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp), [sharp/librsvg](https://github.com/advisories/GHSA-wq5f-xc86-pv6w), and [source-map-js denial of service](https://github.com/advisories/GHSA-68fv-2mgg-jv7q). These advisory links came from npm's response; the production exploitability of each was not tested.

### Local unauthenticated smoke checks

The built app was started locally on port 3107. Requests did not follow redirects.

| Path | Status | Result |
| --- | --- | --- |
| / | 200 | Landing page responds |
| /mobile | 200 | Mobile entry responds |
| /onboarding | 307 | Redirects to /login?tab=member |
| /dashboard | 307 | Redirects to /login?tab=member |
| /api/admin/members | 401 | Anonymous request rejected |
| /api/member/dashboard | 401 | Anonymous request rejected |

The 401 responses are positive checks, but they do not establish that authenticated users are isolated from each other or that direct database access is safe. No paid AI request was made.

## 3. Findings tied to the source

### A01 — Public onboarding is blocked

**Priority:** P0 for the consumer release. **Evidence:** [middleware.ts:113](D:/Projects/IronSync/middleware.ts:113) handles the dashboard and [middleware.ts:131](D:/Projects/IronSync/middleware.ts:131) explicitly gates onboarding. The local redirect tests confirm the anonymous behavior. Existing consumer authentication code remains in [AuthContext.tsx](D:/Projects/IronSync/lib/context/AuthContext.tsx) and [auth/page.tsx](D:/Projects/IronSync/app/auth/page.tsx).

**Impact:** a visitor cannot follow a normal public onboarding journey. A valid Supabase consumer also needs a route distinct from admin/member redirection logic. **Action:** define visitor, consumer, gym member, and administrator states; allow public preview; authorize private consumer routes through the authenticated user identity. Do not simply remove all middleware guards.

### A02 — Some RLS policies authorize every row

**Priority:** P0. **Evidence:** [attendance policy:18](D:/Projects/IronSync/supabase/migrations/20260915_member_profile_columns.sql:18), [change-request policy:43](D:/Projects/IronSync/supabase/migrations/20260916_member_change_requests.sql:43), [audit-log policy:36](D:/Projects/IronSync/supabase/migrations/20260916_member_audit_log.sql:36), and [notification policies:29](D:/Projects/IronSync/supabase/migrations/20260916_notifications.sql:29) use unconditional predicates without a role restriction. Naming a policy “Service role” or “Admins” does not limit its role.

**Impact:** if applied and reachable through table grants, these policies allow broad access; hiding a frontend route will not fix it. Existing permissive policies can combine with restrictive-looking ownership policies. **Action:** inventory actual grants and policies, explicitly revoke unwanted access, replace broad predicates with the intended ownership model, and test anonymous and cross-user operations. Actual deployed exposure remains unverified. This distinction between grants and row policies is documented by [Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security).

### A03 — Admin verification can fail open

**Priority:** P0. **Evidence:** [adminAuth.ts:55](D:/Projects/IronSync/lib/security/adminAuth.ts:55) rejects a missing admin only when its database lookup has no error; the catch also allows execution to continue. The function then returns the authenticated user. [middleware.ts:57](D:/Projects/IronSync/middleware.ts:57) has similar behavior. The returned role also reads editable user metadata, although the lookup error path itself is sufficient to establish this finding.

**Impact:** a normal authenticated account may be treated as admin when the admin lookup fails or the table is unavailable. Public signup increases the importance of fixing this. **Action:** require a positively verified admin record and deny on lookup errors; use trusted server-controlled authorization data. Test both missing-admin and database-error paths.

### A04 — Mobile workout logging is a demonstration

**Priority:** P0. **Evidence:** [WorkoutLoggerScreen.tsx:36](D:/Projects/IronSync/components/mobile/screens/WorkoutLoggerScreen.tsx:36) defines fixed exercises; line 87 initializes them into React state; line 89 starts elapsed time at 2,538 seconds; line 180 forwards a summary through a callback. [MobileShell.tsx](D:/Projects/IronSync/components/mobile/MobileShell.tsx) changes screens using local modal state. The checked-in schema has planned workouts but no workout_sessions/workout_sets model.

**Impact:** the presented logger is not an end-to-end durable workout journal. Component unmounting/reopening can reset the draft. **Action:** add actual session and set records, local drafts, acknowledged synchronization, session recovery, and history-driven previous values.

### A05 — Exercise demonstrations and catalog claims are not trustworthy yet

**Priority:** P0 content gate. **Evidence:** [exerciseLibrary.ts:74](D:/Projects/IronSync/lib/data/exerciseLibrary.ts:74) is one example of the repeated sample video URL. Evaluating the exported static catalog showed all 168 entries use just ForBiggerBlazes.mp4 or WeAreGoingOnBullrun.mp4 in Google's sample-video bucket. The catalog contains 20 chest, 22 back, 18 shoulder, 52 leg, 38 arm, and 18 core entries. The mobile library advertises “420+” in [LibraryScreen.tsx:234](D:/Projects/IronSync/components/mobile/screens/LibraryScreen.tsx:234).

The mobile library filters a separate fixed muscle-card list rather than the complete exported exercise catalog. **Impact:** an exercise page can show an unrelated clip, and catalog discovery/counts can mislead users. **Action:** use stable exercise IDs across search, routine building, and details; derive counts from published data; replace media through an editorial rights/review workflow. No correct demonstration should be inferred solely from a field named videoUrl.

### A06 — Workout personalization is narrower than its interface suggests

**Priority:** P1. **Evidence:** [workoutSplit.ts:12](D:/Projects/IronSync/lib/engine/workoutSplit.ts:12) accepts experience but does not use it elsewhere in the function. [engine/index.ts](D:/Projects/IronSync/lib/engine/index.ts) supplies session duration to calorie/activity calculations, but not to workout selection. Equipment is represented by broad environment categories.

**Impact:** choosing different experience levels or time budgets does not reliably produce corresponding exercise prescriptions. **Action:** test structured constraints: complete equipment requirements, session duration estimate, supported training days, experience suitability, and explicit fallback behavior. Keep reviewed templates stable; do not advertise adaptive progression until logged performance actually drives it.

### A07 — AI, wearable, recovery, and some login controls are placeholders

**Priority:** P0 to hide misleading behavior; P2 to implement advanced integrations. **Evidence:** [AIScreen.tsx:67](D:/Projects/IronSync/components/mobile/screens/AIScreen.tsx:67) simulates generation using a timeout; [WearableSyncScreen.tsx:73](D:/Projects/IronSync/components/mobile/screens/WearableSyncScreen.tsx:73) simulates sync; later buttons show calibration/Bluetooth alerts. [mobile/page.tsx:323](D:/Projects/IronSync/app/mobile/page.tsx:323) displays a password-reset success alert without sending a reset request. Dashboard and readiness screens contain fixed names and metrics.

**Impact:** users could mistake display state for a completed action or measured health data. **Action:** release only real actions and derived values. An isolated, clearly labeled demo may remain for product exploration. Native biometric code elsewhere does not prove that the web button is wired to it.

### A08 — Existing limits depend on process memory

**Priority:** P0 for exposed authentication/AI endpoints. **Evidence:** [rate-limit.ts](D:/Projects/IronSync/lib/security/rate-limit.ts), [coach/route.ts:10](D:/Projects/IronSync/app/api/coach/route.ts:10), and [coach/image/route.ts](D:/Projects/IronSync/app/api/coach/image/route.ts) use Maps. The coach text route falls back to an IP identifier for unauthenticated requests and can call a configured provider.

**Impact:** limits are not shared across instances or restarts; public provider usage may exceed the intended quota. **Action:** use durable atomic limits and budget controls, cap the entire body/history, and require authentication before paid provider calls. Retire or separately secure legacy PIN endpoints. This is a source finding; no exhaustion or brute-force test was performed.

### A09 — “Delete account” deletes a profile, not the identity

**Priority:** P0 privacy gate. **Evidence:** [profile/page.tsx:170](D:/Projects/IronSync/app/dashboard/profile/page.tsx:170) deletes the profiles row, clears local storage, and signs out. No auth-user deletion occurs in that handler. Schema relationships point from profiles to auth.users; deleting the child does not delete the parent identity.

**Impact:** the button can imply more deletion than it performs. **Action:** use a reauthenticated server workflow for identity, owned tables, stored objects, and session handling, with retries and a clear status. Define any legitimate retention exceptions explicitly.

### A10 — Analytics and QA need production wiring

**Priority:** P1. **Evidence:** [analytics/index.ts:91](D:/Projects/IronSync/lib/analytics/index.ts:91) registers session-buffer and console providers. No external provider registration was found. The package has no test script. Scratch tests include calculations and privacy sanitizer checks, but are not a CI gate; they were inspected, not executed during this analysis.

**Action:** retain useful privacy sanitization and assertions, add a supported test runner, wire central privacy-aware events, and add database authorization and browser-flow tests. A scratch test passing numeric ranges is not trainer validation of a workout or nutrition prescription.

### A11 — Mobile packaging and deployment need explicit decisions

**Priority:** P1 for mobile web; P2 for store distribution. **Evidence:** [capacitor.config.ts](D:/Projects/IronSync/capacitor.config.ts) points to the hosted /mobile URL with public as webDir. A manifest exists, but no implemented service worker or IndexedDB workout queue was found in the inspected application paths. [vercel.json](D:/Projects/IronSync/vercel.json) identifies Next.js without a broader operational runbook.

**Action:** ship one responsive consumer app first; establish offline behavior and supported browsers. Later validate hosted-versus-bundled native architecture, deep links, authentication, secure storage, permissions, and release signing. A wrapper is not proof of offline capability or store readiness.

## 4. Competitor and reference analysis

Official pages were preferred for product capabilities. Public discussions were used only as problem signals. No competitors were ranked by unverified revenue, market share, or invented scores. The strategic gaps below are opportunities for IronSync to test, not claims that no competitor offers a similar feature.

| Product | Category / public offer | Why a user might choose it | IronSync implication |
| --- | --- | --- | --- |
| [Hevy](https://www.hevyapp.com/) | Freemium workout tracker | Logging, records, routine sharing, and community | Reliability and history are table stakes. Social is a later investment |
| [Strong](https://www.strong.app/) | Free account with PRO features | Focused training journal and export | Make the everyday set-entry loop fast; avoid excessive onboarding |
| [Fitbod](https://fitbod.me/) | Personalized strength-training planner; pricing not verified here | Recommendations tied to goals, equipment, and training history | Explain decisions and honor constraints; do not rely on an “AI” label |
| [JEFIT](https://www.jefit.com/use-case/workout-planner) | Exercise library and customizable routines | Browsing movements and building workouts | Catalog-to-routine handoff must be seamless |
| [Boostcamp](https://www.boostcamp.app/free-workout-app) | Free core program/tracking offer with paid additions | Following structured programs with training tools | Compete on a clear use case and execution, not simply more programs |
| [MuscleWiki](https://musclewiki.com/) | Public exercise discovery and muscle map | Finding movements visually | Use anatomy as an optional entry point, with accessible text navigation |
| [ACE](https://www.acefitness.org/resources/everyone/exercise-library/) | Public exercise instruction reference | Detailed explanations and organized movement metadata | Establish professional review and precise equipment descriptions |
| [Nike Training Club](https://www.nike.com/ntc-app) | Free guided training and programs | Approachable sessions and trainer guidance | Make the first workout understandable without specialist terminology |
| [ABC Trainerize](https://www.trainerize.com/) | Coach/client platform; adjacent rather than primary competitor | Coaching, nutrition, communication, and client management | A useful reference for the existing gym product, but outside the first consumer release |

Full current checkout pricing, regional taxes, in-app purchase terms, limits, and platform parity are unverified. Confirm them in the intended launch market before using competitive price comparisons in marketing or making a pricing decision.

### Research-to-product decisions

1. **Equipment fidelity:** the [Fitbod equipment discussion](https://www.reddit.com/r/fitbod/comments/1j8x03o) suggests metadata errors and travel constraints can interrupt training. Test full requirements and quick replacements, not just a “gym/home” toggle. Fitbod already documents replacement filters in its [official editing guide](https://help.fitbod.me/hc/en-us/articles/360006335593-Editing-Workouts-in-Fitbod), so replacements themselves are not a unique feature.
2. **Instruction clarity:** the [beginner equipment discussion](https://www.reddit.com/r/beginnerfitness/comments/1vrz44p/confused_about_all_the_equipments/) supports testing plain language and practical setup guidance. It does not establish a population-wide rate of confusion.
3. **History portability:** [Hevy's import documentation](https://help.hevyapp.com/hc/en-us/articles/38001424401943-How-to-Import-Strong-App-CSV-Files-and-Export-Your-Data-in-Hevy) illustrates that formats, language, and units need explicit handling. IronSync should offer export first, then add one tested importer with preview and rollback.
4. **Plan continuity:** [Fitbod's explanation](https://help.fitbod.me/hc/en-us/sections/360001078993-How-Fitbod-Works) describes recommendation regeneration when relevant inputs change. IronSync should preserve accepted sessions and make changes reviewable. This is a proposed UX choice, not a claim that Fitbod loses completed history.
5. **Logging continuity:** lost-workout risk is directly demonstrated by IronSync's component-state architecture. It does not need an invented competitor failure rate to justify persistent drafts and retry testing.

## 5. Evidence gaps to close before launch

| Unknown | How to resolve it | Owner |
| --- | --- | --- |
| Actual database exposure and migration state | Inspect staging/production grants and policy catalog; compare to migration history; run authorized isolation tests | Backend lead |
| Best initial consumer segment | 12–15 interviews and observed task tests | Product owner/researcher |
| Correct exercise content and media rights | Trainer review plus rights records for each released asset | Content lead |
| Consumer demand and retention | Consenting 30–50-person beta with defined cohorts and interviews | Product owner |
| Cost and willingness to pay | Actual supplier quotes, measured traffic, and priced concept tests | Product owner |
| Native readiness | Real-device build, deep-link/auth/offline tests, and applicable store review | Mobile owner |

The Supabase changelog also announces removal of certain older TLS configurations starting **10 November 2026 at the earliest**. Include the minimum supported Android/WebView/browser versions in compatibility testing; do not assume this affects modern clients. [Official change notice](https://supabase.com/changelog/cbc-tls-ciphers-deprecated).

**Audit conclusion:** retain the working foundation, secure the existing surface, and deliver a real consumer exercise-to-workout-to-history loop. The implementation backlog follows that order.
