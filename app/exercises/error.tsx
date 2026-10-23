"use client";
import Link from "next/link";
export default function ExerciseError({ reset }: { reset: () => void }) {
  return <div className="mx-auto max-w-xl px-5 pb-20 pt-36 text-center"><h1 className="text-3xl font-bold">The library couldn’t load.</h1><p className="mt-4 text-primary-muted">Please try again to load the exercise guides.</p><button onClick={reset} className="mt-6 min-h-12 rounded-xl bg-accent px-5 font-bold text-white">Try again</button><Link href="/" className="ml-4 inline-flex min-h-12 items-center underline">Go home</Link></div>;
}
