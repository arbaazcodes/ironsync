import Link from "next/link";
import { ArrowUpRight, Dumbbell } from "lucide-react";
import type { PublicExercise } from "@/lib/exercises/types";

export function ExerciseCard({ exercise }: { exercise: PublicExercise }) {
  return (
    <li className="min-w-0">
      <Link href={`/exercises/${exercise.id}`} className="group flex h-full min-w-0 flex-col rounded-2xl border border-border bg-card p-5 sm:p-6 transition-colors hover:border-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-accent"><Dumbbell className="h-4 w-4 shrink-0" aria-hidden="true" />{exercise.muscleGroup}</span>
          <span className="rounded-full border border-border px-2 py-1 text-[11px] text-primary-muted">{exercise.difficulty}</span>
        </div>
        <h3 className="text-xl font-bold leading-snug tracking-tight group-hover:text-accent">{exercise.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-primary-muted">{exercise.summary}</p>
        <p className="mt-4 text-xs text-primary-muted"><span className="font-semibold text-primary">Focus:</span> {exercise.primaryMuscles.join(", ")}</p>
        <div className="mt-5 flex flex-wrap gap-2">{exercise.equipment.map(item => <span key={item} className="rounded-md bg-surface-elevated px-2 py-1 text-xs text-primary-muted">{item}</span>)}</div>
        <div className="mt-auto pt-6"><span className="flex items-center justify-between border-t border-border pt-4 text-sm font-semibold">View exercise<ArrowUpRight className="h-4 w-4 text-accent" aria-hidden="true" /></span></div>
      </Link>
    </li>
  );
}
