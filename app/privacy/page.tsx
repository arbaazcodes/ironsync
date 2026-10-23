import Link from "next/link";
export const metadata = {
  title: "Privacy — IronSync",
  description:
    "How IronSync uses your account, training preferences and workout records.",
};
export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-8 px-5 py-24 text-sm leading-relaxed">
      <Link
        href="/dashboard"
        className="inline-flex min-h-11 items-center underline"
      >
        Back to your app
      </Link>
      <header>
        <h1 className="text-3xl font-semibold">Your privacy.</h1>
        <p className="mt-3 text-primary-muted">Updated 23 October 2026</p>
      </header>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What you share</h2>
        <p>
          Your account includes your email and display name. When you make a
          plan, we save your age, height, weight, optional sex used for calorie
          estimation, goal, experience, equipment, schedule, activity, food
          preferences, exclusions and timezone. The form also records whether
          you need professional guidance; it does not ask for a diagnosis.
        </p>
        <p>
          Workout records contain the exercises, weights, repetitions or hold
          times, completion status and dates you enter. Skipped-day choices are
          saved separately.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Why we use it</h2>
        <p>
          These details generate and display your training and meal suggestions,
          restore your workout log and build your calendar. Suggestions use
          rules in the app; this flow does not send your body details to an
          external generative AI service.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Storage and service providers</h2>
        <p>
          Supabase provides account authentication and database storage. Vercel
          hosts the web application. Your account data is restricted to your
          account through database access controls; authorized service operators
          can access data needed to maintain the service. Authentication emails
          pass through the configured email delivery provider.
        </p>
        <p>
          Session cookies keep you signed in. The browser or Android WebView
          also keeps your theme and an account-specific workout draft so
          interrupted edits can recover. Unsubmitted preferences remain in this
          tab’s session storage and are restored only when the draft is less
          than 24 hours old. Sign out on shared devices, and clear site data if
          you need to remove local copies.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">History and your choices</h2>
        <p>
          Updating preferences creates a new plan version. Earlier versions and
          workouts are retained to keep your training history accurate. Local
          workout drafts can remain on a device after sign-out and are only
          loaded when the matching account signs in.
        </p>
        <p>
          For account-data access, correction or deletion requests, contact{" "}
          <a className="underline" href="mailto:support@ironsync.online">
            support@ironsync.online
          </a>
          . Account deletion is currently handled through support rather than a
          button in the app. Hosting and database providers may retain
          operational logs or backups under their own retention policies.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">External sources</h2>
        <p>
          Food and exercise source links open external websites. Those sites
          have their own privacy practices. Exercise photos are served as app
          assets; no third-party video player is embedded in the training flow.
        </p>
      </section>
    </article>
  );
}
