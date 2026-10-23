import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, SearchX, BookOpen } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ExerciseFilters } from "@/components/exercises/ExerciseFilters";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import { PUBLISHED_EXERCISES } from "@/lib/exercises/catalog";
import { exerciseListHref, PAGE_SIZE, searchExercises, type ExerciseSearchParams } from "@/lib/exercises/search";

type Props = { searchParams: Promise<ExerciseSearchParams> };
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  return {
    title: "Exercise Library — Search by Muscle & Equipment",
    description: "Find exercises by name, muscle group, equipment, and difficulty. Read setup steps and movement cues before your next workout. No account needed to browse.",
    alternates: { canonical: "/exercises" },
    robots: Object.values(params).some(Boolean) ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { title: "IronSync Exercise Library", description: "Find your next exercise. Explore setup steps, muscles, and equipment.", url: "/exercises", type: "website" },
    twitter: { card: "summary", title: "IronSync Exercise Library", description: "Find exercises by muscle and equipment, with clear setup steps." },
  };
}

export default async function ExerciseLibraryPage({ searchParams }: Props) {
  const result = searchExercises(PUBLISHED_EXERCISES, await searchParams);
  const first = result.total ? (result.page - 1) * PAGE_SIZE + 1 : 0;
  const last = Math.min(result.page * PAGE_SIZE, result.total);
  return (
    <Container className="pb-20 pt-28 sm:pt-36">
      <header className="mb-8 max-w-3xl">
        <p className="mb-4 flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-accent"><BookOpen className="h-4 w-4" aria-hidden="true" />Exercise library</p>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">Find your next<br /><span className="text-accent">movement.</span></h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-muted">Explore {PUBLISHED_EXERCISES.length} exercise guides. Find what fits your workout, check the setup, and make each rep count.</p>
        <p className="mt-3 text-sm text-primary-muted">Open to everyone. No account needed to browse.</p>
      </header>
      <ExerciseFilters key={exerciseListHref(result.filters)} filters={result.filters} />
      {result.ignoredFilters && <p role="status" className="mt-4 text-sm text-primary-muted">Some filters in this link were not recognized. The valid filters are still applied.</p>}
      <section aria-labelledby="exercise-results" className="mt-8 scroll-mt-24" id="results">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="exercise-results" className="text-xl font-bold">{result.total} {result.total === 1 ? "exercise" : "exercises"} found</h2>
          <p className="text-sm text-primary-muted" role="status">{result.total ? `Showing ${first}–${last} · A–Z` : "Try a broader search"}</p>
        </div>
        {result.total ? <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{result.exercises.map(exercise => <ExerciseCard key={exercise.id} exercise={exercise} />)}</ul> : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center sm:p-14">
            <SearchX className="mx-auto mb-4 h-8 w-8 text-accent" aria-hidden="true" />
            <h3 className="text-xl font-bold">No exercises match yet</h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-primary-muted">Try a shorter name, another muscle group, or remove an equipment filter. This library is growing.</p>
            <Link href="/exercises" className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-accent px-5 text-sm font-bold text-white">Show all exercises</Link>
          </div>
        )}
        {result.totalPages > 1 && <nav aria-label="Exercise results pages" className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {result.page > 1 && <Link href={exerciseListHref(result.filters, result.page - 1) + "#results"} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Previous</Link>}
          <span className="px-2 text-sm text-primary-muted">Page {result.page} of {result.totalPages}</span>
          {result.page < result.totalPages && <Link href={exerciseListHref(result.filters, result.page + 1) + "#results"} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold">Next<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}
        </nav>}
      </section>
      <aside className="mt-12 flex flex-col justify-between gap-5 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center">
        <div><h2 className="text-xl font-bold">Put it into practice.</h2><p className="mt-2 text-sm text-primary-muted">Open your workout log and record your exercises, weights, and reps.</p></div>
        <Link href="/dashboard/workout" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-5 text-sm font-bold text-white">Open workout log<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
      </aside>
    </Container>
  );
}
