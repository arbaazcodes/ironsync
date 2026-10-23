# IronSync: step-by-step development roadmap

**Completed:** 23 October 2026 · **Target:** public workout and exercise app · **Status:** planned; these tasks have not been implemented by this planning work.

See the [product and architecture plan](D:/Projects/IronSync/PRODUCTION_PLAN.md) and [audit evidence](D:/Projects/IronSync/docs/PRODUCTION_AUDIT.md).

**Implementation follow-up:** Core work for R01, R02, R04, R09, R10, and R11, plus part of R03, is now implemented. The live security migration is applied. Full task acceptance still requires the remaining production checks in the [implementation and rollout guide](IMPLEMENTATION_2026-10-23.md); this does not mark the complete public release as finished.

**Homepage follow-up:** Public workout messaging and metadata now replace gym-management marketing on the homepage. Mobile navigation and responsive browser checks are complete for this page; see the [homepage release report](HOMEPAGE_RELEASE_2026-10-23.md). This is partial work on R19 and R15; full-site accessibility/SEO and physical-device acceptance remain open.

**Exercise library follow-up:** Public search, combined muscle/equipment/difficulty filters, URL state, pagination, and 24 exercise detail pages are implemented, with homepage links and public-page SEO. See the [exercise library release report](EXERCISE_LIBRARY_RELEASE_2026-10-23.md). This delivers the discovery/detail portion of R06 and partial R05/R15/R19. Source comparison was AI-assisted; qualified trainer review, licensed media, direct add-to-routine integration, expanded content, and physical-device acceptance remain open.

## 1. Sequencing, ownership, and effort

P0 = blocks a safe/useful release. P1 = required for the intended public product. P2 = post-launch experiment. Effort is estimated engineering person-days, including task-level tests and review, excluding exercise filming, trainer/editorial review, recruitment, and legal review. Tasks can overlap where dependencies permit. Estimates must be revised after the first vertical slice and live-schema inventory.

| ID | Priority | Work item | Accountable role | Depends on | Days |
| --- | --- | --- | --- | --- | --- |
| R01 | P0 | Fix authorization, RLS, and exposed endpoint controls | Backend lead | Live-schema/grant inventory | 6–8 |
| R02 | P0 | Dependency remediation and CI foundation | Engineering lead | — | 3–4 |
| R03 | P0 | Reproducible database baseline and consumer data contracts | Backend lead | R01 policy model | 4–6 |
| R04 | P0 | Consumer authentication, routes, and onboarding | Full-stack developer | R01, R03 | 5–6 |
| R05 | P0 | Exercise publishing and media-review pipeline | Full-stack developer + content lead | Stable exercise contract | 4–5 |
| R06 | P1 | Public exercise discovery and detail pages | Frontend developer | R05 | 5–6 |
| R07 | P1 | Reviewed templates and constraint-based planning | Full-stack developer + trainer | R03, R05 | 5–6 |
| R08 | P1 | Custom routine builder and versioning | Frontend developer | R04, R06, R07 | 4–5 |
| R09 | P0 | Session/set APIs and authorization | Backend lead | R01, R03, R04 identity contract | 6–7 |
| R10 | P0 | Real workout logger and timer | Frontend developer | R08, R09 | 6–8 |
| R11 | P0 | Local drafts, offline queue, and conflict recovery | Full-stack developer | R09, R10 | 8–9 |
| R12 | P1 | Workout history and truthful progress | Full-stack developer | R09, R10 | 4–5 |
| R13 | P0 | Export, account deletion, and privacy controls | Backend lead | R04, R09 | 3–4 |
| R14 | P1 | Analytics and error monitoring | Full-stack developer | R04; event contract available early | 3–4 |
| R15 | P1 | Accessibility, performance, and device validation | Frontend developer + QA | R06, R10, R11 | 3–4 |
| R16 | P1 | Support, feedback, and notification preferences | Full-stack developer | R04, R14 | 2–3 |
| R17 | P0 | Load checks, backup restore, and incident runbook | Backend lead + QA | R02, R09, R11, R14 | 3–4 |
| R18 | P0 | Closed-beta observation and defect resolution | Engineering lead + product owner | R01–R17 | 4–5 |
| R19 | P1 | Public SEO and content release preparation | Frontend developer + content lead | R05, R06 | 2–3 |
| R20 | P0 | Production release and rollback rehearsal | Engineering lead | R18, R19 | 2–3 |
| **Total** | | **Core free public release** | | | **82–105** |

R18's effort is the engineering allocation within a two-week observation window, not two weeks of full-team coding. Research and content work run in parallel throughout. The 12-week schedule assumes two developers and supporting roles; its upper effort estimate requires contingency time or scope cuts. Do not interpret every task estimate as an elapsed duration or add a second full QA budget to the same tests.

## 2. Task definitions and acceptance criteria

### R01 — Close access-control gaps before public signup

Start in middleware, lib/security/adminAuth.ts, lib/security/rate-limit.ts, the existing coach routes, and the four permissive migration areas identified in audit A02. Inventory existing grants and all applicable policies before adding replacements. Disable unused privileged/AI endpoints with a server-side feature switch until their controls are complete.

- An authenticated non-admin receives denial even if the gym-admin lookup returns an error or the table is unavailable.
- Editing user metadata cannot create admin privileges.
- Anonymous and user B cannot read, insert, update, delete, or subscribe to user A's private records through either API or direct Supabase access.
- Service-role keys remain server-only; ownership checks still apply to service-role-backed handlers.
- Shared throttling persists across two running instances and a restart for each exposed login/paid-provider endpoint.
- Database policies and grants are versioned, tested, and reviewed before applying them to production.

### R02 — Establish reproducible checks and patch dependencies

Preserve the lockfile, review advisory applicability, update to patched compatible dependencies, and rerun the build. Add an explicit test runner and CI commands; migrate relevant assertions from scratch scripts. Move away from deprecated lint invocation as part of the selected Next.js version strategy.

- A clean install followed by type check, lint, critical unit/integration tests, and build succeeds in CI.
- Relevant high/critical advisories are resolved or have documented, time-limited applicability decisions; the app owner can see exceptions.
- No test touches production data or sends paid provider requests by default.
- CI fails on a deliberately failing authorization test and reports useful diagnostics.
- No major framework rewrite is bundled into this task unless the security/support decision requires it.

### R03 — Baseline the database and define consumer ownership

Reconcile schema.sql, ordered migrations, generated types, and the deployed schema. Define consumer ownership through auth user IDs, separate from legacy gym member IDs. Document the exercise, routine, session, set, and operation contracts before UI integration.

- A clean staging database can be created and seeded with fake data from the documented workflow.
- Each private entity has an unambiguous owner and indexed foreign keys needed by the main queries.
- A draft migration of existing data preserves counts, IDs, and relationships; orphaned records are reported, not silently discarded.
- New migration paths are additive; the previous app release remains compatible during the rollout window.
- Database types are generated or validated against the baseline and checked in consistently.

### R04 — Make consumer signup and onboarding work

Define one consumer route tree. Keep exercise/program browsing public; require a consumer session for durable routines/history. Update AuthContext, auth callbacks, login routing, and onboarding to agree. Retain a safe role boundary for legacy gym users.

- A new visitor chooses a routine, signs up, verifies email, and returns to that selection.
- Login, logout, expired session, password recovery, and returning-user navigation all work.
- No button displays recovery success unless the provider accepted the request; use a non-enumerating confirmation message.
- An ordinary consumer reaches their dashboard and is not mistaken for a gym administrator.
- Incomplete onboarding resumes; optional body/nutrition fields do not block basic exercise use.
- Demo mode is isolated from real accounts and cannot bypass server authorization.

### R05 — Create a trusted exercise publishing process

Consolidate exerciseLibrary, exerciseDetails, exerciseMedia, and swap mappings around stable exercise IDs. Use a small protected editor or a reviewed content-file workflow; a sophisticated CMS is unnecessary for the first catalog.

- Every published movement has unique ID/slug, aliases, correct equipment requirements, instructions, reviewer/date, and publication status.
- Every demonstration is verified to show that movement, has recorded usage rights, and has an accessible fallback/caption.
- No Google sample-video URL is present in released exercise data.
- Draft, unreviewed, and withdrawn exercises are excluded from public results and new recommended routines.
- Existing workout snapshots remain readable when catalog text changes or an exercise is retired.
- Beta includes 40–60 reviewed movements; every starter-template exercise is covered. Growth toward 80–120 depends on editorial capacity.

### R06 — Build public search and exercise pages

Create /exercises and /exercises/[slug], using the actual published catalog. Include name aliases and equipment/muscle/difficulty filters, useful empty states, and a clear add-to-routine action.

- Direct exercise URLs load useful readable content without login and have stable metadata.
- Search returns relevant exercises rather than only broad muscle cards; filters combine correctly.
- Result counts equal published matching rows and never display a fabricated catalog size.
- Broken media, unknown slugs, missing search results, and slow requests have useful states.
- An observed user can find a movement, understand its setup, and add it to a routine without a moderator.

### R07 — Ship reviewed templates with real constraints

Start with 6–8 reviewed templates for the agreed equipment/schedule combinations. Represent sets, reps, rest, and exercise IDs structurally. Implement consistent equipment checking and duration estimation. Review movement progression rules with the trainer before presenting recommendations.

- Every recommended exercise is available in the user's equipment profile, including required accessories/quantities.
- Unsupported day counts or combinations produce a clear alternative rather than silently falling through to an unrelated split.
- Experience and session duration materially affect suitable selection or generate a clearly explained limitation.
- Identical inputs and template versions produce reproducible recommendations.
- Changes preserve accepted routines and completed sessions; no new load is prescribed solely from fabricated demo history.
- Time estimates state rest/transition assumptions and can be compared with actual session duration.

### R08 — Let users build and revise routines

Support create, duplicate, rename, reorder, add/remove movements, and edit prescriptions. A routine revision defines future workouts; completed sessions retain their original snapshot.

- Users can build a small routine on a phone and reopen it on another device.
- Reordering and repeated occurrences of the same exercise have stable instance IDs.
- Replacing an exercise asks whether the change affects only this workout or future routine versions.
- Invalid fields show inline errors without discarding the entire routine.
- An edit never changes historical sets, exercise names/units, or completed-session totals.

### R09 — Persist sessions and sets through an authorized API

Implement validated session create, operation batch, completion, and history endpoints. Assign ownership server-side. Use transaction boundaries for invariants and an idempotency record for replayable requests.

- Creating the same session twice with the same operation ID yields one session.
- Replaying the same set operation yields one effect; reusing an operation ID with a different payload is rejected.
- Sets cannot reference another user's session; changing a client-supplied user ID cannot change ownership.
- Completing a workout is atomic and recomputes totals from valid performed sets.
- Completed, abandoned, and in-progress sessions remain distinguishable.
- Limits reject oversized batches, malformed types, invalid units, and impossible state transitions with usable errors.

### R10 — Replace demo logging with the real workout loop

Connect mobile and desktop controls to R09. Show previous comparable values, editable set rows, appropriate units, warm-up/working-set labels, optional effort ratings, and timestamps for timers. Keep active state outside a modal that can silently reset it.

- A new session starts at zero elapsed time with no pre-completed fake sets.
- Users can add, edit, complete, undo, and remove sets with one-handed controls.
- Closing an exercise drawer or switching tabs does not reset the workout.
- Screen lock/backgrounding does not introduce timer drift from missed interval ticks.
- An empty or partially completed session cannot generate false records or recovery scores.
- Finishing shows accurate performed-set totals; kg/lb and assisted/bodyweight exercise conventions are explicit.

### R11 — Protect workout drafts and synchronize safely

Use a user-scoped IndexedDB draft and operation queue. Add a service worker for the app shell/chosen public resources. Implement pending/synced/conflict states and safe queue processing on reconnect or app reopen.

- Refresh, tab close/reopen, and an interrupted request preserve the last locally acknowledged edit.
- A previously loaded workout can be logged without a connection; first-ever offline launch has a clear limitation.
- Reconnect retries do not duplicate sessions, sets, personal records, or weekly totals.
- Concurrent edits to the same set produce an explicit resolution; unrelated new sets can merge.
- Deletions do not reappear from an old device's pending queue.
- A second account never sees the first account's local data; unsynced changes receive an explicit logout decision.
- Storage quota failure or unavailable IndexedDB is surfaced immediately rather than displaying false saved status.
- Auth expiry queues local work safely and requests reauthentication before sending it.

### R12 — Build progress from completed training data

Provide calendar/list history, session detail, per-exercise history, and simple weekly trends. Define records precisely, including exercise variation, set type, and unit normalization. Show estimated statistics as estimates.

- New accounts have honest empty states; seeded demo names, streaks, and percentages are absent.
- Only eligible performed sets affect the chosen record metric; planned or skipped work does not.
- Editing/deleting a mistaken session updates derived metrics without losing unrelated data.
- kg/lb conversions preserve the original input and rounding conventions.
- Timezone changes and midnight sessions do not double-count or vanish from weekly totals.
- Historical records remain readable after a routine or exercise catalog revision.

### R13 — Make export and deletion real

Implement private CSV/JSON export and a reauthenticated server deletion workflow. Enumerate owned tables/storage, account identity, provider data, and permitted retention exceptions. Make long-running deletion retryable and observable.

- Export includes dates, units, exercise names/IDs, sets, reps/load/time, and relevant history; spreadsheet formulas in user text are neutralized.
- A user cannot download someone else's export by guessing an ID or reusing an expired link.
- Deletion removes or lawfully retains each data category according to the published policy; it is not just a profiles-row deletion.
- Access is revoked/blocked as required during deletion, including existing sessions on sensitive operations.
- A failed deletion does not show a completed success state; retries safely resume.
- The next login cannot accidentally restore supposedly deleted data from a stale local cache.

### R14 — Measure activation and catch real failures

Wire a privacy-aware analytics provider and error monitoring through shared services. Keep operational alerts independent from optional marketing/product analytics consent. Define event names and denominators before creating dashboards.

- Activation, session completion, sync failure, and weekly usage can be calculated centrally with clear cohort definitions.
- Event retries do not double-count completed sessions.
- Passwords, access tokens, body metrics, medical notes, and free-text workout notes are absent from telemetry.
- Logs carry request/release IDs; a synthetic test error reaches the monitored alert channel.
- Consent choices and retention settings actually change collection behavior.
- Product dashboards clearly label small cohorts and exclude internal/demo accounts.

### R15 — Validate the real mobile experience

Check keyboard/screen-reader access, contrast, focus, reduced motion, captions, touch targets, slow-network behavior, and representative Android/iOS/desktop devices. Optimize real user routes, not only a Lighthouse score.

- Logging works at small widths, landscape, large text, and with the virtual keyboard open.
- Dialog focus is restored and all essential actions are keyboard accessible.
- Large videos are lazy-loaded; the app remains usable when video delivery fails.
- p75 performance targets from the plan are measured on appropriate devices; lab values are labeled as lab values until field data exists.
- Dependency and background-timer behavior is checked on the minimum supported browser/WebView versions.
- A user can recover from loss of connectivity without restarting the full onboarding flow.

### R16 — Add support and respectful communication

Provide a support contact, in-app bug/content-error report, troubleshooting guide, and opt-in reminder preferences. Schedule reminders only if a reliable delivery mechanism is implemented; otherwise launch with preferences/support and defer delivery claims.

- Bug reports include user-approved diagnostics and release version without exposing credentials or private notes.
- Reported incorrect exercise media can be unpublished quickly and traced to its content version.
- Reminder opt-out and quiet hours work if reminders ship; rest days do not trigger shaming messages.
- Support has an owner, response target, and clear escalation path for data-loss/security issues.

### R17 — Prove recovery and operational limits

Load-test realistic session saves/history reads against staging. Start with an explicit pilot target, such as 100 concurrent active loggers at observed operation frequency, then revise with actual traffic. Confirm provider quotas and cost alerts. Rehearse backup restoration and a failed-release response.

- Valid saves meet the agreed online acknowledgement/success targets without lost or duplicate sets.
- 429/5xx responses leave recoverable pending operations and bounded retries.
- Restore to a separate environment succeeds, data counts reconcile, and measured RPO/RTO meet the published commitments.
- Alerting covers sustained errors, old pending queues, auth/provider outages, and unexpectedly high usage.
- An incident runbook names the responder, containment actions, communication owner, and data-repair procedure.
- No load test runs against production without a separate explicit plan and authorization.

### R18 — Run the closed beta and resolve findings

Recruit 30–50 consenting users and observe usage over approximately two weeks. Conduct moderated tests with at least 10 participants across the supported device/equipment mix. This beta can establish activation/usability; it is too short to establish four-week retention.

- At least 8/10 observed participants can select a routine and log a set without assistance, or the blockers are addressed and retested.
- No open critical authorization, incorrect-demo, or workout-data-loss issue remains.
- Each failed signup, abandonment pattern, and recurring support issue is categorized with evidence.
- Users understand pending versus synced state and can recover after interruption.
- Product decisions record evidence and sample size; wider launch is delayed if core reliability fails.

### R19 — Prepare public discovery and original content

Add canonical URLs, sitemap, robots directives, useful titles/descriptions, internal links, and supported structured data where appropriate. Publish original reviewed content with clear calls to begin training.

- Only approved public exercise/program pages are indexed; personal histories and account pages are private/noindex as appropriate.
- Canonical routes, unknown slugs, retired content, and redirects behave intentionally.
- Metadata accurately reflects visible content and catalog size.
- There are no automatically generated thin pages or copied competitor assets/programs.
- Search landing pages lead into a tested routine/signup journey.

### R20 — Release with a reversible deployment procedure

Use staging verification, an additive database rollout, server-controlled feature switches, and a known previous app release. Release first to a limited cohort before announcing wider availability.

- The release owner can identify the exact commit, migration set, environment configuration, content version, and rollback target.
- Production secrets and data are separate from development/staging; necessary backups are verified.
- Signup, first session, offline recovery, export, and account deletion pass the final smoke checklist using controlled accounts.
- Reverting the app does not require dropping columns/tables that the new version has populated.
- Rollout is paused for data loss, privacy/access failure, or sustained sync degradation; support is staffed.
- The README and public claims match what is actually shipping.

## 3. Week-by-week execution map

| Week | Primary engineering work | Product/content/QA work | Demonstrable outcome |
| --- | --- | --- | --- |
| 1 | R01/R02; begin R03 | Interviews, inventory all 168 entries, nominate reviewers | Access risks characterized and first fixes verified in staging |
| 2 | Finish identity/schema foundation; R04; begin R09 vertical slice | Review/produce first 10 exercise assets; route usability | Consumer can save and retrieve one real set |
| 3 | R05/R06; complete onboarding; telemetry scaffold | Review first beta catalog subset | Public exercise page to account/routine journey |
| 4 | R07/R08; extend R09 | Trainer approves templates and constraints | Equipment-aware routine that persists |
| 5 | R10; complete session completion semantics | Observe logging controls; continue content | Complete workout saved to the backend |
| 6 | R11; begin R12 | Interruption and unit-conversion cases | Session survives refresh and network interruption |
| 7 | Finish sync/conflicts; R12/R13 | Two-account/privacy test matrix | Accurate history, export, and deletion |
| 8 | R14/R15/R16/R17 | Real devices, accessibility, backup drill | Beta candidate passes core release gates |
| 9 | R18 fixes; R19 | Closed beta starts, usability sessions | Real-user task and reliability evidence |
| 10 | R18 fixes; final operational checks | Cohort readout; support/content corrections | Go/no-go decision for wider free release |
| 11 | R19/R20 rehearsal | Publish approved expanded content/help | Rollback-tested production candidate |
| 12 | R20 controlled rollout | Support coverage and activation monitoring | Public free release if gates pass |

Allow weeks 13–14 for verified overruns, particularly offline conflicts, deployed-schema surprises, or content review. Longer-term retention is measured after sufficient observation; it cannot be inferred from a two-week beta. If working solo, sequence the same dependencies over about 20–26 weeks and shrink content breadth to protect quality.

## 4. Release test matrix

| Scenario | Expected result |
| --- | --- |
| Visitor opens an exercise link | Useful public page, no signup wall |
| New signup returns from email verification | Original routine selection retained |
| Consumer visits admin API or crafts another user's IDs | Denied without disclosing another user's record |
| Admin membership lookup fails | Denied and operational error logged |
| User loses network after marking a set complete | Draft retained with pending status |
| Response is lost after server accepted a save | Retry returns original result; no duplicate |
| User refreshes or locks the screen mid-session | Draft and time recover accurately |
| Two devices edit one completed set | Explicit conflict handling; no silent overwrite |
| Equipment is unavailable | Compatible explained replacement or clear no-match result |
| User switches kg/lb | Display converts correctly; source input preserved |
| A plan is regenerated or exercise is renamed | Old session remains unchanged and readable |
| Auth expires with a pending draft | Reauthentication requested; draft retained for its owner |
| User logs out and another user logs in | Previous account's cached data is inaccessible |
| User exports/deletes their account | Correct private export or completed/retryable server deletion |
| A provider or database is down | Useful error, bounded retries, alert, no false success |
| App rollback follows a schema expansion | Old version still operates on compatible schema |

## 5. Post-launch tasks with separate gates

| ID | Proposed work | Prerequisite | Acceptance gate |
| --- | --- | --- | --- |
| F01 | Strong CSV importer | Stable history model and evidence of switching demand | Preview mapping/units/timezone; unmatched exercise handling; duplicate detection; batch rollback |
| F02 | Paid tier and entitlements | Launch market chosen, retention evidence, priced concept interviews | Signed webhook processing; duplicate/out-of-order events; cancellation/refund flows; retained free history/export |
| F03 | Contextual AI explanations | Reviewed content, reliable training data, observed demand | Authenticated quota/cost controls; source-grounded responses; no silent plan changes; failure/safety evaluation |
| F04 | Android store release | Stable web core and device demand | Signed build, auth/deep links, real secure-storage/biometric wiring if claimed, offline checks, current store requirements |
| F05 | Health/wearable integration | Specific platform demand and resources | Explicit consent; real provider connection/revocation; source/timestamps; duplicate suppression; no invented readings |
| F06 | Local-language content | Research supports a language segment | Human-reviewed terminology, captions, search aliases, and content parity |
| F07 | Nutrition or coach services | Separate demand/content and operational validation | Qualified review, appropriate boundaries, truthful claims, own privacy and quality gates |
| F08 | Social/community features | Retention evidence and moderation capacity | Private defaults, sharing consent, reporting/blocking, abuse handling and staffed moderation |

No later feature should displace unresolved workout durability, data isolation, or exercise-content correctness. The initial product succeeds when a person can learn a movement, complete a useful workout, and return to accurate history.
