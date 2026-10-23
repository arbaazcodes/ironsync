import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Check, Dumbbell } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ExerciseCard } from "@/components/exercises/ExerciseCard";
import { getPublicExercise, PUBLISHED_EXERCISES, relatedExercises } from "@/lib/exercises/catalog";
import { exerciseListHref } from "@/lib/exercises/search";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return PUBLISHED_EXERCISES.map(exercise => ({ slug: exercise.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const exercise = getPublicExercise((await params).slug);
  if (!exercise) return { title: "Exercise not found", robots: { index: false, follow: true } };
  const title = `${exercise.name} — Setup & Form`;
  const description = `${exercise.summary} Equipment, muscles, and step-by-step instructions on IronSync.`;
  return { title, description, alternates: { canonical: `/exercises/${exercise.id}` }, openGraph: { title, description, url: `/exercises/${exercise.id}`, type: "article" }, twitter: { card: "summary", title, description } };
}

export default async function ExerciseDetailPage({ params }: Props) {
  const exercise = getPublicExercise((await params).slug);
  if (!exercise) notFound();
  const related = relatedExercises(exercise);
  const referenceDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(exercise.publication.checkedAt));
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Exercise library", item: "https://www.ironsync.online/exercises" },
    { "@type": "ListItem", position: 2, name: exercise.name, item: `https://www.ironsync.online/exercises/${exercise.id}` },
  ] };
  return (
    <Container className="pb-20 pt-24 sm:pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="mb-6"><Link href="/exercises" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-muted hover:text-accent"><ArrowLeft className="h-4 w-4" aria-hidden="true" />All exercises</Link></nav>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
        <article className="min-w-0">
          <header>
            <Link href={exerciseListHref({ muscle: exercise.muscleGroup })} className="mb-3 inline-flex min-h-11 items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent"><Dumbbell className="h-4 w-4" aria-hidden="true" />{exercise.muscleGroup} exercises</Link>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{exercise.name}</h1>
            <p className="mt-4 text-lg leading-relaxed text-primary-muted">{exercise.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs"><span className="rounded-full border border-border px-3 py-2">{exercise.difficulty}</span>{exercise.equipment.map(item => <span key={item} className="rounded-full bg-surface-elevated px-3 py-2 text-primary-muted">{item}</span>)}</div>
          </header>
          <section aria-labelledby="equipment-heading" className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
            <h2 id="equipment-heading" className="text-lg font-bold">What you need</h2>
            <p className="mt-2 text-sm leading-relaxed text-primary-muted">{exercise.equipmentNote}</p>
          </section>
          <section aria-labelledby="steps-heading" className="mt-10">
            <h2 id="steps-heading" className="text-2xl font-bold">How to do it</h2>
            <ol className="mt-6 space-y-6">{exercise.steps.map((step, index) => <li key={step} className="flex gap-4"><span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-sm font-bold text-accent">{index + 1}</span><p className="pt-1 text-base leading-relaxed text-primary-muted">{step}</p></li>)}</ol>
          </section>
          <section aria-labelledby="cues-heading" className="mt-10 rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <h2 id="cues-heading" className="text-xl font-bold">Keep in mind</h2>
            <ul className="mt-4 space-y-3">{exercise.cues.map(cue => <li key={cue} className="flex items-start gap-3 text-sm leading-relaxed text-primary-muted"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />{cue}</li>)}</ul>
          </section>
          <section aria-labelledby="reference-heading" className="mt-8 border-t border-border pt-6">
            <h2 id="reference-heading" className="flex items-center gap-2 text-sm font-bold"><BookOpen className="h-4 w-4 text-accent" aria-hidden="true" />Guide reference</h2>
            <p className="mt-3 text-sm leading-relaxed text-primary-muted">This general guide summarizes the linked reference. Read the original for photos and additional guidance.</p>
            <a href={exercise.source.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-accent underline underline-offset-4">{exercise.source.title}<span className="sr-only"> (opens in a new tab)</span></a>
            <p className="mt-2 text-xs text-primary-muted">Reference checked <time dateTime={exercise.publication.checkedAt}>{referenceDate}</time>. Use a comfortable range of motion; stop if a movement hurts. A qualified trainer can help with your individual setup.</p>
          </section>
        </article>
        <aside className="space-y-5 lg:sticky lg:top-28">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">Muscles involved</h2>
            <dl className="mt-5 space-y-5 text-sm"><div><dt className="text-xs font-bold uppercase tracking-wide text-primary-muted">Primary focus</dt><dd className="mt-2 font-semibold">{exercise.primaryMuscles.join(", ")}</dd></div>{exercise.secondaryMuscles.length > 0 && <div><dt className="text-xs font-bold uppercase tracking-wide text-primary-muted">Also involved</dt><dd className="mt-2 leading-relaxed">{exercise.secondaryMuscles.join(", ")}</dd></div>}</dl>
          </div>
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
            <h2 className="text-xl font-bold">Ready for your next set?</h2>
            <p className="mt-3 text-sm leading-relaxed text-primary-muted">Open your training log to choose exercises and record what you lift.</p>
            <Link href="/dashboard/workout" className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-bold text-white">Open workout log<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></Link>
          </div>
        </aside>
      </div>
      {related.length > 0 && <section aria-labelledby="related-heading" className="mt-16 border-t border-border pt-10"><h2 id="related-heading" className="mb-6 text-2xl font-bold">More {exercise.muscleGroup.toLowerCase()} exercises</h2><ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{related.map(item => <ExerciseCard key={item.id} exercise={item} />)}</ul></section>}
    </Container>
  );
}
