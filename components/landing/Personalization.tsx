import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, ListPlus, CalendarDays } from "lucide-react";

export function Personalization() {
  return (
    <section id="personalization" className="py-20 sm:py-28 scroll-mt-24">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <Badge variant="subtle" size="md">START YOUR WAY</Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Your session. Your starting point.</h2>
          <p className="text-base text-primary-muted leading-relaxed">Start with the exercises you already know, or use the plan builder for a starting routine.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <article className="rounded-2xl border border-accent/30 bg-card p-6 sm:p-8 flex flex-col items-start">
            <ListPlus className="h-6 w-6 text-accent" aria-hidden="true" />
            <h3 className="mt-5 text-2xl font-bold">Ready to train?</h3>
            <p className="mt-3 mb-6 text-sm text-primary-muted leading-relaxed">Open an empty workout, choose exercises, and start logging. A training plan is optional.</p>
            <Link href="/dashboard/workout" className="mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-bold text-accent underline underline-offset-4">
              Open workout log <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </article>
          <article className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col items-start">
            <CalendarDays className="h-6 w-6 text-accent" aria-hidden="true" />
            <h3 className="mt-5 text-2xl font-bold">Want a starting routine?</h3>
            <p className="mt-3 mb-6 text-sm text-primary-muted leading-relaxed">Explore the plan builder with your training goals and preferences. Review the routine before using it for a workout.</p>
            <Link href="/onboarding" className="mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-bold text-accent underline underline-offset-4">
              Build a plan <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </article>
        </div>
      </Container>
    </section>
  );
}
