"use client";
import { useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { trainingExercise } from "@/lib/program/exercises";
import { equipmentLabels, type Prescription } from "@/lib/program/types";
import { secondary } from "./ui";
export function ExerciseGuide({
  exerciseId,
  children,
  className = "",
}: {
  exerciseId: string;
  children: React.ReactNode;
  className?: string;
}) {
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const [photo, setPhoto] = useState(0);
  const exercise = trainingExercise(exerciseId);
  if (!exercise) return <>{children}</>;
  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => {
          setPhoto(0);
          dialog.current?.showModal();
        }}
        aria-label={`How to do ${exercise.name}`}
      >
        {children}
      </button>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-border bg-surface p-0 text-primary shadow-xl backdrop:bg-black/50"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wider text-primary-muted">
                Movement guide
              </p>
              <h2 id={titleId} className="text-2xl font-semibold">
                {exercise.name}
              </h2>
            </div>
            <button
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border"
              aria-label="Close exercise guide"
              onClick={() => dialog.current?.close()}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-5 overflow-hidden rounded-xl bg-white">
            <Image
              src={exercise.images[photo]}
              width={640}
              height={420}
              alt={`${exercise.name}: position ${photo + 1}`}
              className="h-56 w-full object-contain sm:h-72"
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[0, 1].map((i) => (
              <button
                key={i}
                className={secondary + (photo === i ? " !border-primary" : "")}
                aria-pressed={photo === i}
                onClick={() => setPhoto(i)}
              >
                Position {i + 1}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-primary-muted">
            {exercise.muscle} ·{" "}
            {exercise.equipment.map((e) => equipmentLabels[e]).join(" + ") ||
              "Bodyweight"}
          </p>
          <ol className="mt-5 space-y-4">
            {exercise.steps.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-xs font-semibold">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-5 rounded-xl bg-background p-4 text-sm leading-relaxed">
            {exercise.cue}
          </p>
          <p className="mt-4 text-xs leading-relaxed text-primary-muted">
            Start light, breathe normally and stop if a movement hurts. Photos
            show two positions; ask a qualified trainer to check your form.
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs">
            {exercise.guideSlug && (
              <Link
                href={`/exercises/${exercise.guideSlug}`}
                className="inline-flex min-h-11 items-center gap-1 underline"
              >
                Read full guide
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            )}
            <a
              href={`https://github.com/yuhonas/free-exercise-db/tree/f00c92c7dcf1216a928a52c3706c7ce8e2f71ed5/exercises/${exercise.sourceId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center underline"
            >
              Photo source · public-domain dataset
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
export function ExerciseRow({
  prescription,
  index,
}: {
  prescription: Prescription;
  index: number;
}) {
  const e = trainingExercise(prescription.exerciseId);
  if (!e) return null;
  return (
    <ExerciseGuide
      exerciseId={e.id}
      className="flex w-full items-center gap-3 border-b border-border py-4 text-left last:border-b-0 sm:gap-4"
    >
      <span className="hidden w-5 text-xs text-primary-muted sm:inline">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border bg-white">
        <Image
          src={e.images[0]}
          width={112}
          height={112}
          alt={e.name}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-snug">{e.name}</p>
        <p className="mt-1 text-sm text-primary-muted">
          {prescription.sets} sets · {prescription.target}
        </p>
        <p className="mt-1 text-xs text-primary-muted">
          {e.muscle} · {prescription.restSeconds}s rest
        </p>
      </div>
      <ArrowUpRight
        className="h-4 w-4 shrink-0 text-primary-muted"
        aria-hidden="true"
      />
    </ExerciseGuide>
  );
}
