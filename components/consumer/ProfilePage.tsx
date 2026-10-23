"use client";
import { useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useProgram } from "./ProgramProvider";
import {
  dietLabels,
  goalLabels,
  equipmentLabels,
  weekdayNames,
} from "@/lib/program/types";
import { PageHeading, Panel, TextLink, secondary } from "./ui";
export function ProfilePage() {
  const { user, signOut } = useAuth();
  const { program } = useProgram();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (!program) return null;
  const p = program.preferences;
  return (
    <>
      <PageHeading eyebrow="Your account" title="Made around you." />
      <div className="grid items-start gap-6 md:grid-cols-2">
        <Panel>
          <h2 className="text-xl font-semibold">
            {user?.user_metadata?.full_name || "Your profile"}
          </h2>
          <p className="mt-2 break-words text-sm text-primary-muted">
            {user?.email}
          </p>
          <dl className="mt-6 space-y-5 text-sm">
            {[
              ["Goal", goalLabels[p.goal]],
              ["Measurements", `${p.weightKg} kg · ${p.heightCm} cm`],
              [
                "Training days",
                p.trainingDays
                  .map((d) => weekdayNames[d].slice(0, 3))
                  .join(", "),
              ],
              ["Experience", p.experience],
              [
                "Equipment",
                p.equipment.map((e) => equipmentLabels[e]).join(", ") ||
                  "Bodyweight",
              ],
              ["Food", dietLabels[p.diet]],
              ["Timezone", p.timeZone],
            ].map(([name, value]) => (
              <div key={name} className="flex justify-between gap-5">
                <dt className="text-primary-muted">{name}</dt>
                <dd className="max-w-[65%] text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 border-t border-border pt-3">
            <TextLink href="/onboarding">Update my preferences</TextLink>
          </div>
        </Panel>
        <div className="space-y-6">
          <Panel>
            <h2 className="font-semibold">Simple. Personal. Yours.</h2>
            <p className="mt-3 text-sm leading-relaxed text-primary-muted">
              Your training plan and skipped days save to your account.
              Completed workouts stay in your calendar when you update your
              preferences.
            </p>
            <div className="mt-4 flex flex-col items-start">
              <TextLink href="/exercises">Browse exercise library</TextLink>
              <TextLink href="/privacy">Privacy policy</TextLink>
              <TextLink href="/terms">Terms</TextLink>
            </div>
          </Panel>
          <button
            className={secondary + " w-full"}
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                await signOut();
              } catch {
                setError("Could not sign out. Try again.");
                setBusy(false);
              }
            }}
          >
            {busy ? "Signing out…" : "Sign out"}
          </button>
          {error && (
            <p role="alert" className="text-sm">
              {error}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
