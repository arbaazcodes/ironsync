export default function LoadingExercises() {
  return <div className="mx-auto max-w-6xl px-5 pb-20 pt-32" role="status"><p className="text-lg font-semibold">Loading exercise guides…</p><div aria-hidden="true" className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map(item => <div key={item} className="h-64 rounded-2xl border border-border bg-surface motion-safe:animate-pulse" />)}</div></div>;
}
