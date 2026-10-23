import Link from "next/link";
export const metadata = {
  title: "Terms — IronSync",
  description: "Using your IronSync account, training log and suggested plans.",
};
export default function TermsPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-8 px-5 py-24 text-sm leading-relaxed">
      <Link
        href="/dashboard"
        className="inline-flex min-h-11 items-center underline"
      >
        Back to your app
      </Link>
      <header>
        <h1 className="text-3xl font-semibold">Using IronSync.</h1>
        <p className="mt-3 text-primary-muted">Updated 23 October 2026</p>
      </header>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Your account</h2>
        <p>
          Use your own email address and keep your password private. Access only
          accounts and records you are authorized to use. The automatic planner
          currently supports adults aged 18–75 within the measurement ranges
          shown in the form.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Training and meal suggestions</h2>
        <p>
          IronSync helps organize training and food choices. Its rules use the
          preferences you enter; they are not an individual assessment by a
          trainer, clinician or dietitian. Exercise photos show example
          positions, not a full demonstration or a check of your technique.
          Start with manageable loads and stop an exercise that causes pain.
        </p>
        <p>
          Calorie needs are estimates. Food totals are calculated from reference
          records and weighed portions; brands, recipes and cooking methods
          vary. The starter menu does not assess every vitamin, mineral or
          medical need, and results are not guaranteed. Check ingredients and
          cross-contact information for allergies. Pregnancy, breastfeeding,
          injuries and medical dietary restrictions need qualified individual
          guidance; the app pauses automatic recommendations when you declare
          these needs.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Saving and availability</h2>
        <p>
          The app distinguishes device drafts from workouts saved to your
          account. Wait for the cloud-save confirmation before clearing browser
          data or switching devices. An internet connection is needed for
          account access, plan generation and cloud saving. Service
          interruptions can delay synchronization.
        </p>
        <p>
          The current consumer release has no payment or subscription checkout.
          Features may change as the app develops. Updating a plan retains
          previous workout history.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Sources and support</h2>
        <p>
          Exercise media attribution and food record links are available in the
          app. Their inclusion does not imply endorsement by the source
          organization. For questions about your account or these terms, contact{" "}
          <a className="underline" href="mailto:support@ironsync.online">
            support@ironsync.online
          </a>
          . See the{" "}
          <Link href="/privacy" className="underline">
            privacy notice
          </Link>{" "}
          for information about stored records and service providers.
        </p>
      </section>
    </article>
  );
}
