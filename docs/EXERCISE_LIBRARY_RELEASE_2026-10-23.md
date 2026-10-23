# Public exercise library release — 23 October 2026

This phase adds a public exercise library at `/exercises` and 24 individual guide pages. It implements the requested discovery flow; it does not close every acceptance criterion in the broader production plan.

## What ships

- Search exercise names, common aliases such as RDL, and muscle names. Case, accents, punctuation, and extra spaces are normalized.
- Combine primary muscle group, equipment, and difficulty filters. Equipment includes required accessories, so a dumbbell bench press appears under both Dumbbells and Bench.
- Shareable URL state, refresh and browser-back restoration, A–Z results, 12 results per page, result counts, and a recoverable no-results state.
- Public detail pages with setup requirements, muscles, numbered steps, movement cues, reference links, and related exercises. Browsing requires no account.
- Homepage hero, desktop/mobile navigation, and footer links into the library. The workout CTA uses the existing sign-in route and retains `/dashboard/workout` as its destination.
- Per-page metadata and canonical links, breadcrumb structured data, a sitemap, and robots directives. Filtered/paginated library URLs use `noindex,follow`; the canonical remains `/exercises`. Unknown detail slugs return the site's HTTP 404 page.
- Server-rendered search results and 24 prerendered detail pages. Only filter controls need client JavaScript. The GET form also has a native submission path.

## Content and publishing

The public catalog is defined in `lib/exercises/content.ts`, with its contract in `types.ts` and publication filtering in `catalog.ts`. The legacy workout catalog remains separate because its media includes unrelated demo clips. This release does not copy those media into public pages or change historical workout exercise identities.

The initial 24 guides contain original short summaries based on linked American Council on Exercise references. Source comparison was AI-assisted, performed on 23 October 2026. **A qualified trainer has not reviewed this content.** Publication metadata records that distinction explicitly. No ACE photos or videos were copied; each page links readers to the original reference for images and further guidance. This is a smaller text-first release than the planned 40–60-guide reviewed media catalog.

To add or change a guide:

1. Add an entry as `draft`, using a stable, unique slug. Reuse a legacy ID only if the movement and variation are the same; otherwise create a new ID.
2. Confirm the exact movement, equipment/accessories, primary muscles, difficulty, setup, and cues against the primary reference. Write a concise original summary and record the source and actual check date/method.
3. Obtain qualified trainer/editorial review and record it truthfully before describing a guide as trainer-reviewed. Trainer review and licensed, movement-matched media remain follow-up work for the broader content gate.
4. Set the status to `published` only after the entry is ready for release. `draft` and `withdrawn` entries are excluded from results, generated details, related links, and sitemap.
5. Run the content/search tests and production build; inspect the detail at phone width. Commit and deploy. File-based content changes require deployment.
6. To remove incorrect content, set `withdrawn` and redeploy. Keep the stable ID and history; do not repurpose it for a different movement. Recheck relevant source links when updating content.

## Verification before deployment

| Check | Result |
| --- | --- |
| Existing and new automated tests | 48 tests pass across 6 files; 7 new library tests cover content validity, aliases, AND filtering, publication states, exact slugs, pagination, malformed URLs, sitemap, and related links |
| TypeScript | `npx tsc --noEmit --incremental false` passes |
| Production build | Passes; existing font and legacy `<img>` lint warnings remain outside this change |
| Anonymous HTTP sweep | All 24 details and the library return 200 with one H1 and canonical metadata; sitemap/robots return 200; unknown detail returns 404 |
| Search and filters in Chrome | Bench press → Chest → Dumbbells produces Flat Dumbbell Press; Beginner yields no match; Show all restores the catalog; RDL works with Enter |
| Navigation/state | Filters survive refresh and browser Back from details; page 2 displays the remaining 12 results; Previous restores page 1; mobile menu link closes the menu |
| Responsive browser checks | 320×740, 360×800, 390×844, 844×390, 768×1024, 1440×900: no horizontal page overflow; search/select/button controls are 48px high; grid changes from 1 to 2 to 3 columns |
| Detail rendering | Long title and equipment tags fit at 320px; light/dark views inspected; numbered instructions and source links are readable |
| Account boundary | Anonymous workout CTA reaches sign-in with `next=/dashboard/workout`; no account or workout data was modified |

These are desktop Chrome viewport tests, not physical iOS/Android device tests. Browser extension errors were excluded from app findings. The initial test origin `127.0.0.1` caused an RSC fallback when middleware redirected to `localhost`; repeating the CTA on the matching `localhost` origin succeeded. The production-origin journey is checked after deployment.

## Deployment and rollback

Deploy through the existing GitHub `main` → Vercel production integration. No database migration, dependency change, new secret, or environment variable is required. Before deploying, run tests/build and `git diff --check`; after Vercel succeeds, check the live library, a combined filter, a detail page, refresh/back behavior, sitemap, and unknown-slug status.

The prior production commit is `10b0a2d7de0435403a89952c21686443bcc51438`. Reverting the library commit or promoting that prior Vercel deployment restores the previous app without a database rollback. Local screenshot and live-status evidence is stored in ignored `docs/evidence/` to keep generated artifacts out of Git.

## Remaining roadmap work

This phase delivers the public search/filter/detail part of R06 and partial R05/R15/R19 work. Qualified trainer review, original/licensed media, a larger catalog, direct add-to-routine integration, the reviewed routine builder, full-site accessibility/performance checks, and physical-device acceptance remain open. The workout CTA opens the existing logger; it does not automatically add the viewed exercise to a routine.
