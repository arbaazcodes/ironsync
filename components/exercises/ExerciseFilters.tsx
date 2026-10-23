"use client";

import { useRef, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { DIFFICULTIES, EQUIPMENT, MUSCLE_GROUPS } from "@/lib/exercises/types";
import { exerciseListHref, parseExerciseSearch, type ExerciseFilters as Filters } from "@/lib/exercises/search";

export function ExerciseFilters({ filters }: { filters: Filters }) {
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    const { filters: next } = parseExerciseSearch(values);
    startTransition(() => router.push(exerciseListHref(next), { scroll: false }));
  }
  const field = "mt-2 min-h-12 w-full min-w-0 rounded-xl border border-border bg-background px-3 text-base text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
  return (
    <form ref={form} action="/exercises" method="get" onSubmit={search} role="search" aria-label="Find exercises" className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-card">
      <label htmlFor="exercise-search" className="block text-sm font-semibold">Search exercises</label>
      <div className="relative mt-2">
        <Search aria-hidden="true" className="absolute left-3.5 top-3.5 h-5 w-5 text-primary-muted" />
        <input id="exercise-search" name="q" type="search" defaultValue={filters.q} maxLength={80} placeholder="Try bench press, RDL or biceps" autoComplete="off" className={field + " !mt-0 !pl-11 pr-4"} />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:items-end">
        <label className="min-w-0 text-sm font-semibold">Muscle group
          <select name="muscle" defaultValue={filters.muscle} className={field} onChange={() => form.current?.requestSubmit()}>
            <option value="">All muscles</option>{MUSCLE_GROUPS.map(value => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label className="min-w-0 text-sm font-semibold">Equipment
          <select name="equipment" defaultValue={filters.equipment} className={field} onChange={() => form.current?.requestSubmit()}>
            <option value="">All equipment</option>{EQUIPMENT.map(value => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label className="min-w-0 text-sm font-semibold">Difficulty
          <select name="difficulty" defaultValue={filters.difficulty} className={field} onChange={() => form.current?.requestSubmit()}>
            <option value="">All levels</option>{DIFFICULTIES.map(value => <option key={value}>{value}</option>)}
          </select>
        </label>
        <button type="submit" disabled={pending} className="min-h-12 self-end rounded-xl bg-accent px-4 text-sm font-bold text-white hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60">{pending ? "Searching…" : "Search"}</button>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 text-xs text-primary-muted">
        <p>Filters combine. Equipment lists include required accessories.</p>
        <Link href="/exercises" scroll={false} className="inline-flex min-h-11 items-center font-semibold text-accent underline underline-offset-4">Clear filters</Link>
      </div>
      <span className="sr-only" role="status">{pending ? "Updating exercise results" : ""}</span>
    </form>
  );
}
