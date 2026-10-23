"use client";
import { useState } from "react";
import { useProgram } from "./ProgramProvider";
import {
  dateInZone,
  dietLabels,
  weekdayNames,
  weekdayOf,
} from "@/lib/program/types";
import { foodById } from "@/lib/program/foods";
import { PageHeading, Panel, TextLink } from "./ui";
export function FoodPage() {
  const { program } = useProgram();
  const [selected, setSelected] = useState<number | null>(null);
  if (!program) return null;
  const weekday =
    selected ?? weekdayOf(dateInZone(new Date(), program.preferences.timeZone));
  const day = program.nutrition.days[weekday];
  return (
    <>
      <PageHeading
        eyebrow={dietLabels[program.preferences.diet]}
        title="Eat for your goal."
        action={<TextLink href="/onboarding">Edit</TextLink>}
      />
      {program.nutrition.unavailable ? (
        <Panel>
          <h2 className="text-xl font-semibold">
            Your menu needs a personal review.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-primary-muted">
            {program.nutrition.unavailable}
          </p>
          <TextLink href="/onboarding">Review preferences</TextLink>
        </Panel>
      ) : (
        <>
          <p className="mb-6 max-w-xl text-sm leading-relaxed text-primary-muted">
            A seven-day starter menu built from your eating preferences. Weigh
            foods in the state shown. These are suggestions, not meals you have
            logged.
          </p>
          <div
            className="mb-6 grid grid-cols-7 gap-1 sm:gap-2"
            role="group"
            aria-label="Meal plan day"
          >
            {[1, 2, 3, 4, 5, 6, 0].map((d) => (
              <button
                key={d}
                aria-label={weekdayNames[d]}
                aria-pressed={weekday === d}
                onClick={() => setSelected(d)}
                className={
                  "min-h-12 rounded-xl border text-xs font-medium " +
                  (weekday === d
                    ? "border-primary bg-primary text-background"
                    : "border-border bg-surface")
                }
              >
                {weekdayNames[d].slice(0, 3)}
              </button>
            ))}
          </div>
          {day && (
            <>
              <Panel className="mb-6">
                <div className="grid grid-cols-3 gap-3">
                  <Stat
                    label="Menu energy"
                    value={day.totals.calories.toLocaleString()}
                    unit="kcal"
                  />
                  <Stat
                    label="Protein"
                    value={String(day.totals.protein)}
                    unit="g"
                  />
                  <Stat
                    label="Carbs"
                    value={String(day.totals.carbs)}
                    unit="g"
                  />
                </div>
                <div className="mt-5 flex flex-wrap justify-between gap-2 border-t border-border pt-4 text-xs text-primary-muted">
                  <span>Fat: {day.totals.fat}g</span>
                  <span>
                    {program.nutrition.targetCalories
                      ? `Estimated energy target: ${program.nutrition.targetCalories.toLocaleString()} kcal`
                      : "Calorie estimation is off"}
                  </span>
                </div>
              </Panel>
              <div className="grid items-start gap-5 md:grid-cols-2">
                {day.meals.map((meal, i) => (
                  <Panel key={meal.name}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-widest text-primary-muted">
                        {String(i + 1).padStart(2, "0")} / {meal.name}
                      </span>
                      <span className="text-sm font-semibold">
                        {meal.totals.calories} kcal
                      </span>
                    </div>
                    <h2 className="mt-4 text-xl font-semibold">
                      {meal.ingredients
                        .map((item) => foodById(item.foodId)!.name)
                        .slice(0, 2)
                        .join(" & ")}
                    </h2>
                    <ul className="mt-5 divide-y divide-border">
                      {meal.ingredients.map((item) => {
                        const food = foodById(item.foodId)!;
                        return (
                          <li
                            key={item.foodId}
                            className="flex justify-between gap-3 py-3"
                          >
                            <div>
                              <p className="text-sm font-medium">{food.name}</p>
                              <p className="mt-1 text-xs text-primary-muted">
                                {food.basis}
                              </p>
                            </div>
                            <span className="shrink-0 text-sm font-medium">
                              {item.grams}g
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    <p className="mt-4 text-xs text-primary-muted">
                      P {meal.totals.protein}g · C {meal.totals.carbs}g · F{" "}
                      {meal.totals.fat}g
                    </p>
                    <details className="mt-4 border-t border-border pt-4">
                      <summary className="min-h-8 cursor-pointer text-sm font-semibold">
                        Preparation & food sources
                      </summary>
                      <p className="my-3 text-sm leading-relaxed text-primary-muted">
                        {meal.preparation}
                      </p>
                      <ul className="space-y-2">
                        {meal.ingredients.map((item) => {
                          const f = foodById(item.foodId)!;
                          return (
                            <li key={f.id}>
                              <a
                                href={`https://fdc.nal.usda.gov/food-details/${f.fdcId}/nutrients`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex min-h-9 items-center text-xs underline underline-offset-4"
                              >
                                USDA {f.fdcId} · {f.name}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </details>
                  </Panel>
                ))}
              </div>
            </>
          )}
        </>
      )}
      <details className="mt-7 rounded-2xl border border-border p-5">
        <summary className="cursor-pointer text-sm font-semibold">
          How these numbers are calculated
        </summary>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-primary-muted">
          {program.nutrition.notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
          {program.nutrition.proteinGuide && (
            <p>
              Protein reference: approximately {program.nutrition.proteinGuide}
              g/day. The menu total above is the actual sum of its ingredients
              and may differ; a dietitian can help you close any gap without
              ignoring your restrictions.
            </p>
          )}
          <p>
            Nutrition dataset: USDA FoodData Central SR Legacy, retrieved 23
            October 2026. Source records provide reference measurements, not a
            guarantee for every brand, recipe or individual.
          </p>
          <p>
            <a
              className="underline"
              href="https://fdc.nal.usda.gov/api-guide/"
              target="_blank"
              rel="noreferrer"
            >
              USDA data
            </a>{" "}
            ·{" "}
            <a
              className="underline"
              href="https://pubmed.ncbi.nlm.nih.gov/2305711/"
              target="_blank"
              rel="noreferrer"
            >
              Energy equation
            </a>{" "}
            ·{" "}
            <a
              className="underline"
              href="https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/"
              target="_blank"
              rel="noreferrer"
            >
              Protein reference
            </a>
          </p>
        </div>
      </details>
    </>
  );
}
function Stat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div>
      <p className="text-xs text-primary-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
        {value}
        <span className="ml-1 text-xs font-normal text-primary-muted">
          {unit}
        </span>
      </p>
    </div>
  );
}
