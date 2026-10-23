# Public workout homepage — 23 October 2026

## Scope

The homepage now introduces IronSync as a public workout tracker. Hero, benefits, getting-started steps, feature cards, final call to action, footer, page title, search description, and social metadata describe choosing exercises, recording weights and reps, using the rest timer, and returning to saved workouts.

Gym enrollment, front-desk operations, member PINs, and gym-management positioning were removed from homepage marketing. Unsupported claims about automatic adaptation, readiness scores, nutrition precision, and being free forever were removed. The interactive preview is explicitly labeled **Example workout** and shows two illustrative sessions with calculated set, rep, and volume totals.

Visitors can create a public account, sign in, open the workout log through authentication with the destination retained, or enter the existing plan builder. Signed-in accounts receive a My Workouts call to action. No authentication, database, SMTP, or workout-save logic changed in this phase.

## Mobile improvements

- Fixed the mobile **Sign in** link, which previously opened signup.
- Moved the full navigation to the large-screen breakpoint so tablets have a compact menu.
- Made menu and theme controls at least 44 CSS pixels; added navigation labels and Escape-to-close with focus returned to the menu button.
- Positioned the menu below the header and constrained its height so it scrolls on short landscape screens.
- Reduced small-screen CTA padding so Start Training stays on one line at 320 pixels.
- Public-account logout now returns to public sign-in.

## Verification

Checks ran against the local **production build**, served at port 3100, using Chrome responsive viewport overrides. These are browser-size checks, not physical-phone or Safari certification.

| Check | Result |
| --- | --- |
| Existing automated suite | 41 tests passed across 5 files |
| Production build | Passed: compilation, TypeScript, lint, and 45 generated pages |
| Diff whitespace | Passed |
| Portrait viewports | 320×740, 360×800, and 390×844: no horizontal content overflow |
| Tablet and desktop | 768×1024 and 1440×900: no horizontal content overflow |
| Landscape menu | 844×390: menu stays inside the viewport and scrolls; navigation targets remain reachable |
| Mobile sign-in and signup | Correct forms and query modes opened; no email submission was needed for this copy-only phase |
| Workout entry | Redirected to sign-in with `next=/dashboard/workout` retained |
| Plan-builder entry | Opened the goal-selection screen |
| Anchor navigation | How it works closes the menu and lands below the fixed header |
| Keyboard menu | Escape closes the drawer and returns focus to its button |
| Example preview | Home session changes exercise and totals to 2 sets, 22 reps, 284 kg; gym example totals 520 kg |
| Narrow CTA | Final Start Training label fits on one line at 320 pixels after padding adjustment |
| Theme | Light and dark states were checked at a narrow viewport |
| Browser console | No application errors observed; an unrelated Speechify extension error was excluded |

Existing image/font lint warnings elsewhere in the app remain. Local screenshots are retained under `docs/evidence/`, which is excluded from the public repository.

## Release and remaining scope

Publish through the existing main-branch GitHub → Vercel integration, then verify the new heading, metadata, mobile navigation, and account-aware CTA on [the production site](https://www.ironsync.online). The deployment status and live screenshots should accompany the release result.

This completes the homepage slice of R19 and responsive/navigation work within R15. It does not complete the public exercise directory, reviewed exercise media, full-site SEO, full accessibility audit, legal-copy review, monitoring, or real-device validation. Those acceptance gates remain in the [production backlog](PRODUCTION_BACKLOG.md).
