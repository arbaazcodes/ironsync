# IronSync consumer rebuild — 23 October 2026

The product now follows the user's requested journey: sign in, choose a goal and body/training/food preferences, get a starter plan, learn each movement, record the workout, and see actual attendance. The five primary screens are **Today, Plan, Food, Calendar and Profile**, with the same flow on mobile and desktop. The existing public exercise library remains available. Old dashboard destinations redirect to the relevant new screen; existing workout records are retained.

## Implemented behavior

- Login precedes preference collection. Five short steps cover goal, age/height/weight, optional calorie-formula sex, daily activity, experience, days, session time, equipment, diet, meals and exclusions. An account-scoped tab draft resumes incomplete onboarding for up to 24 hours; successful submission clears it.
- Server-generated, immutable plan snapshots use explicit ownership and revision checks. Concurrent saves cannot silently replace another device's plan. Database or validation failures show an error instead of claiming success.
- Training uses only selected equipment and beginner-appropriate movements. There are 2–5 chosen days, full-body or upper/lower schedules, prescribed sets, repetition/hold targets and rest intervals. Instructions and two real photographs are available beside each exercise and inside the logger. Suggested workloads are starter rules, not individualized trainer approval.
- Food suggestions contain weighed ingredients and sum actual per-100g records. Preparation states, included oil, calorie estimates, actual menu totals, protein references and source links are visible. Diet/allergen exclusions are enforced before portion calculation. Seven days provide rotating protein, grain, fruit and vegetable combinations, from 18 verified records.
- Pregnancy/breastfeeding, declared injury/medical restrictions or clinician-prescribed dietary needs pause automatic recommendations. Other/severe allergies pause menus. Unsupported combinations fail visibly rather than inserting excluded foods. Calorie estimation can be skipped.
- A single account-scoped workout store connects Today, the logger and Calendar. Timed holds use seconds without inflating repetitions or lifting volume. Existing local-draft recovery, pending mutations, cloud retries and conflict handling remain in place. Prescribed rest intervals reach the timer.
- Calendar reads bounded monthly workout history, honors the user's timezone and historical plan versions, and distinguishes completed, explicitly skipped, past not-logged, future planned and rest days. A completed record takes precedence over a skip marker. Updating preferences preserves history.
- The Android launcher now opens the same HTTPS consumer flow. The old native credential flow, including offline mock authentication and role inference from email, has been removed. Android backups are disabled; no new privileged native login is introduced.

## Data and reasoning provenance

**Exercise photographs:** [free-exercise-db](https://github.com/yuhonas/free-exercise-db), pinned commit `f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5`. The repository distributes the dataset under the Unlicense/public-domain dedication. Exact source folders and the license are retained in `public/training/ATTRIBUTION.md` and `public/training/LICENSE.md`. Thirty-six local JPEGs cover 18 movements. Photo identity was visually checked; this is not a qualified form-safety review. Instructions are original app text. Position labels intentionally do not imply that the dataset's image order is a video demonstration.

**Nutrition:** [USDA FoodData Central official downloads](https://fdc.nal.usda.gov/download-datasets/), SR Legacy April 2018 CSV archive, retrieved 23 October 2026. Archive SHA-256: `b80817294b8850530aaedf2e515c02593b1824f763a0ff356e5c2081643e6fd0`. All 18 FDC IDs, exact source descriptions, preparation states and energy/protein/carbohydrate/fat values are included in `lib/program/foods.ts`. Values were cross-checked against `food.csv` and `food_nutrient.csv` (nutrients 1008, 1003, 1005, 1004). FoodData Central data are public domain/CC0. The app makes no runtime USDA requests and needs no food API key. The stored energy value is used directly; it is not incorrectly reconstructed from a universal 4/4/9 factor.

**Planning references:** [ACSM resistance-training guidance, 2026](https://acsm.org/resistance-training-guidelines-update-2026/), [Mifflin–St Jeor original energy equation](https://pubmed.ncbi.nlm.nih.gov/2305711/) and [NIH ODS exercise nutrition guidance](https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/). Activity multipliers, modest goal adjustments, menu limits, exercise order and portion scaling are disclosed app heuristics. The app does not claim measured energy expenditure, comprehensive micronutrient coverage, guaranteed results or a clinician-reviewed plan. Adult-only scope and pregnancy exclusion are consistent with the [NIDDK Body Weight Planner audience](https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner).

## Storage and release

Migration: `supabase/migrations/20261023085028_consumer_program_and_calendar.sql`, created through `supabase migration new`. It adds `training_programs` and `training_day_overrides` without altering existing workouts. Both tables use owner-scoped RLS and explicit authenticated grants; anonymous reads are denied. Program versions allow select/insert but no client update/delete. Skip markers allow owner select/insert/update with both `USING` and `WITH CHECK` ownership predicates. Stored snapshots are validated before rendering.

The migration was applied transactionally to project `fdduamdeepiqdytqfwmb` through its authenticated SQL Editor and recorded in `supabase_migrations.schema_migrations`. The live catalog query confirmed RLS on both tables, anonymous select denied, program update denied, two program policies, three calendar policies and the migration record present. Do not replay the historical baseline or indiscriminately run `db push`; the older schema history still needs reconciliation.

Deploy through the existing `main` → Vercel Git integration after checks. The release can roll back to the preceding application deployment; the additive owner-only tables can remain in place. Do not delete plan/workout data to roll back the UI. Review any compatibility risk before rolling back beyond the workout schema additions (seconds, rest interval, scheduled date).

## Verification

User story verified locally: mobile login → onboarding → saved program → movement photos → prescribed workout → repetition and timed-set entry → refresh → cloud confirmation → completed workout → calendar → preference change → retained history.

| Check | Evidence |
| --- | --- |
| Unit/database tests | 61 passing tests across 7 files. Includes all 32 equipment combinations across 2–5-day schedules, all combinations of listed diet/allergen exclusions, source arithmetic, calendar semantics, immutable versions, ownership and preserved workout compatibility. |
| Real PostgreSQL semantics | PGlite executes the migration; anonymous/cross-user reads and writes, plan mutation, duplicate revisions and owner skip upserts are covered. |
| Local HTTP integration | `node tests/e2e/consumer-api.mjs` passes against the isolated fixture: ownership, invalid input, foreign origin, two simultaneous plan saves (200/409), persisted skip/undo and bounded history. |
| Browser interaction | Chrome mobile viewports 390×844 and 320×740. Onboarding draft resumes after refresh, photo positions open, skip persists after refresh, undo works, weights/reps/hold seconds restore, completion appears in Calendar, vegan/gluten exclusions update ingredients, history survives the new plan. |
| Layout | Today, movement dialog, Food and Calendar visually inspected. Narrow Food/Plan DOM geometry has no horizontal overflow. Screenshots are in ignored `docs/evidence/`. |
| Type and production build | TypeScript check and Next.js production build pass. Existing warnings in old dashboard/media/font components remain documented in the build log. |
| Android | `npx cap sync android` and Gradle `assembleDebug` succeed with Android Studio's JBR/SDK. APK version 1.1.0 (code 2), 10,887,328 bytes; SHA-256 `5f9173c5da5a2f1d17594a0bfaef15e9bd11757fc7ecb9fc5856663207fd6c0f`. |

The local fixture has synthetic accounts and values and no production credentials. Its DATE wire serialization matches PostgREST. A Windows source-encoding issue found on the Calendar route was corrected to UTF-8 before the successful build. Browser extension injections generated separate console/hydration warnings; they were distinguished from application failures rather than suppressed in code.

For reproduction, start `node tests/e2e/supabase-fixture.mjs`, then run Next dev on localhost:3100 with Supabase URL `http://127.0.0.1:54329`, both public keys set to `sb_publishable_fixture`, service role set to `fixture-service`, and site URL set to `http://localhost:3100`. Use `athlete@example.test` / `test-password-123` only in this isolated fixture. HTTP integration expects a fresh fixture. Do not configure those values in production.

## Remaining release limits

- This is a working starter consumer release, not evidence that every item in the original production roadmap is complete. Qualified trainer/dietitian review and broader exercise/food coverage remain necessary before stronger personalization claims.
- The APK is a **debug-signed Android test build**, stored locally at `build/IronSync-1.1.0-debug.apk`. It loads the live HTTPS app and requires internet for initial access/cloud operations. Physical Android/iOS testing, release signing, store policy review and Play Store/App Store publication have not been performed. There is no native iOS build in this repository.
- Self-service account deletion/full account export, monitored support operations, production error monitoring, load testing and backup/restore rehearsal remain backlog work. Confirm delivery for the existing `support@ironsync.online` contact before a broad public launch. The privacy/terms text describes current behavior and needs owner/legal review before broad distribution.
- Supabase's refreshed Security Advisor reports 0 errors, 1 warning (disabled leaked-password protection) and 6 informational suggestions. The advisor UI also lists pre-existing legacy-table performance warnings; this rebuild does not claim to resolve all project-wide advisor findings.
- Production post-deploy evidence is captured separately in `docs/evidence/consumer-live-verification.md` once the new deployment is ready. Do not substitute local fixture success for live verification.
