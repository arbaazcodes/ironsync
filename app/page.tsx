import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Dumbbell,
  Utensils,
} from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
export const metadata = {
  title: "IronSync — Your daily training plan",
  description:
    "Choose your goal, follow a workout with exercise photos, plan your meals, and keep track of training days.",
  alternates: { canonical: "/" },
};
export default function HomePage() {
  return (
    <div className="mx-auto grid min-h-dvh w-full max-w-5xl items-center gap-10 px-5 py-8 md:grid-cols-2 md:gap-16">
      <section>
        <div className="mb-8 flex items-center gap-2 text-xl font-bold">
          <Activity className="h-7 w-7 text-accent" />
          IronSync
        </div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-muted">
          Made for your everyday
        </p>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          A plan for today.
          <br />
          <span className="text-accent">Progress for you.</span>
        </h1>
        <p className="mt-5 max-w-sm text-base leading-relaxed text-primary-muted">
          Tell us your goal. Open your workout, learn each movement, and make
          training part of your day.
        </p>
        <ul className="mt-7 hidden space-y-4 text-sm text-primary-muted md:block">
          <li className="flex gap-3">
            <Dumbbell className="h-5 w-5" />
            Your exercises, with movement photos
          </li>
          <li className="flex gap-3">
            <Utensils className="h-5 w-5" />
            Meals around your food preferences
          </li>
          <li className="flex gap-3">
            <CalendarDays className="h-5 w-5" />A calendar of the work you put
            in
          </li>
        </ul>
        <Link
          href="/exercises"
          className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold"
        >
          Explore the exercise library
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
      <AuthCard headingLevel={2} initialMode="signin" />
    </div>
  );
}
