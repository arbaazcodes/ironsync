"use client";

import { useState } from "react";
import { Check, Dumbbell, Timer } from "lucide-react";

const examples = [
  { label: "Gym session", exercise: "Decline Dumbbell Press", sets: [{ weight: 22.5, reps: 12 }, { weight: 25, reps: 10 }] },
  { label: "Home session", exercise: "Dumbbell Goblet Squat", sets: [{ weight: 12, reps: 12 }, { weight: 14, reps: 10 }] },
];

export function BlueprintPreview() {
  const [selected, setSelected] = useState(0);
  const example = examples[selected];
  const reps = example.sets.reduce((total, set) => total + set.reps, 0);
  const volume = example.sets.reduce((total, set) => total + set.weight * set.reps, 0);

  return (
    <section aria-label="Workout log preview" className="relative w-full max-w-lg mx-auto">
      <div className="absolute -inset-2 bg-accent/10 rounded-[32px] blur-2xl pointer-events-none" />
      <div className="relative rounded-[28px] bg-card border border-border shadow-card p-4 sm:p-7 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
          <span className="flex items-center gap-2 text-sm font-bold">
            <Dumbbell className="h-4 w-4 text-accent" aria-hidden="true" />Your training log
          </span>
          <span className="text-xs font-mono text-primary-muted">Example workout</span>
        </div>
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Example sessions">
          {examples.map((item, index) => (
            <button key={item.label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}
              className={"min-h-11 rounded-xl border px-2 py-2 text-xs sm:text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent " +
                (selected === index ? "border-accent bg-accent text-white" : "border-border bg-surface-elevated text-primary-muted")}>
              {item.label}
            </button>
          ))}
        </div>
        <div aria-live="polite" aria-atomic="true" className="space-y-5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{example.exercise}</h2>
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Example completed sets for {example.exercise}</caption>
            <thead className="text-xs text-primary-muted">
              <tr><th scope="col" className="pb-3 font-medium">Set</th><th scope="col" className="pb-3 font-medium">Kg</th><th scope="col" className="pb-3 font-medium">Reps</th><th scope="col" className="pb-3 text-right font-medium">Done</th></tr>
            </thead>
            <tbody>
              {example.sets.map((set, index) => (
                <tr key={index} className="border-t border-border">
                  <th scope="row" className="py-4 font-mono font-medium">{index + 1}</th>
                  <td className="py-4 font-mono font-bold">{set.weight}</td>
                  <td className="py-4 font-mono font-bold">{set.reps}</td>
                  <td className="py-4 text-right"><span className="inline-flex rounded-lg bg-accent/10 p-2 text-accent"><Check className="h-4 w-4" aria-hidden="true" /><span className="sr-only">Completed</span></span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <dl className="grid grid-cols-3 gap-2 rounded-2xl bg-surface-elevated p-3 text-center">
            {[["Sets", example.sets.length], ["Reps", reps], ["Kg lifted", volume]].map(([label, value]) => (
              <div key={label}><dt className="text-[10px] sm:text-xs text-primary-muted">{label}</dt><dd className="mt-1 text-xl font-bold font-mono">{value}</dd></div>
            ))}
          </dl>
        </div>
        <p className="flex items-start gap-2 border-t border-border pt-4 text-xs text-primary-muted leading-relaxed">
          <Timer className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />Log a set. Take a rest. Keep your place for the next one.
        </p>
      </div>
    </section>
  );
}
