"use client";

import React, { useState } from "react";
import { useOnboarding } from "@/lib/context/OnboardingContext";
import { GenderType } from "@/lib/types/onboarding";

export function StepBody() {
  const { data, updateData } = useOnboarding();

  // Unit toggles
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");

  // Local helper states for ft/in
  const currentCm = typeof data.heightCm === "number" ? data.heightCm : 175;
  const initialFeet = Math.floor(currentCm / 30.48);
  const initialInches = Math.round((currentCm % 30.48) / 2.54);

  const [feet, setFeet] = useState<number | "">(initialFeet || 5);
  const [inches, setInches] = useState<number | "">(initialInches || 9);

  // Local helper state for lb
  const currentKg = typeof data.weightKg === "number" ? data.weightKg : 75;
  const [weightLb, setWeightLb] = useState<number | "">(
    Math.round(currentKg * 2.20462) || 165
  );

  // Target weight in lb
  const currentTargetKg =
    typeof data.targetWeightKg === "number" ? data.targetWeightKg : "";
  const [targetWeightLb, setTargetWeightLb] = useState<number | "">(
    typeof currentTargetKg === "number"
      ? Math.round(currentTargetKg * 2.20462)
      : ""
  );

  // Height Handlers
  const handleCmChange = (val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      updateData({ heightCm: "" });
    } else {
      updateData({ heightCm: num });
      setFeet(Math.floor(num / 30.48));
      setInches(Math.round((num % 30.48) / 2.54));
    }
  };

  const handleFtInChange = (newFt: number | "", newIn: number | "") => {
    setFeet(newFt);
    setInches(newIn);
    const f = typeof newFt === "number" ? newFt : 5;
    const i = typeof newIn === "number" ? newIn : 0;
    const calculatedCm = Math.round((f * 12 + i) * 2.54);
    updateData({ heightCm: calculatedCm });
  };

  // Weight Handlers
  const handleKgChange = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      updateData({ weightKg: "" });
    } else {
      updateData({ weightKg: num });
      setWeightLb(Math.round(num * 2.20462));
    }
  };

  const handleLbChange = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      setWeightLb("");
      updateData({ weightKg: "" });
    } else {
      setWeightLb(num);
      updateData({ weightKg: Math.round(num / 2.20462) });
    }
  };

  // Target Weight Handlers
  const handleTargetKgChange = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      updateData({ targetWeightKg: "" });
    } else {
      updateData({ targetWeightKg: num });
      setTargetWeightLb(Math.round(num * 2.20462));
    }
  };

  const handleTargetLbChange = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      setTargetWeightLb("");
      updateData({ targetWeightKg: "" });
    } else {
      setTargetWeightLb(num);
      updateData({ targetWeightKg: Math.round(num / 2.20462) });
    }
  };

  const shouldShowTargetWeight =
    data.goal === "fat_loss" || data.goal === "muscle_gain";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-250">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
          QUESTION 02
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
          Let&apos;s understand your starting point.
        </h1>
        <p className="text-sm sm:text-base text-primary-muted leading-relaxed max-w-xl">
          We use baseline biometrics to calculate your Basal Metabolic Rate and safe macronutrient floors.
        </p>
      </div>

      <div className="space-y-6">
        {/* Gender Selection */}
        <div className="space-y-2.5">
          <label className="text-xs font-mono uppercase tracking-wider text-primary-dim font-semibold">
            Biological Sex / Baseline
          </label>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {(
              [
                { id: "male", label: "Male" },
                { id: "female", label: "Female" },
                { id: "prefer_not_to_say", label: "Prefer not to say" },
              ] as const
            ).map((g) => {
              const isSelected = data.gender === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => updateData({ gender: g.id as GenderType })}
                  className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isSelected
                      ? "bg-surface-elevated text-accent border-accent shadow-accent-glow"
                      : "bg-surface text-primary-muted border-border hover:border-border-hover hover:text-primary"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Age & Height Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Age Input */}
          <div className="space-y-2">
            <label
              htmlFor="age-input"
              className="text-xs font-mono uppercase tracking-wider text-primary-dim font-semibold flex justify-between"
            >
              <span>Age</span>
              <span className="text-primary-dim">Years</span>
            </label>
            <div className="relative rounded-2xl bg-surface border border-border focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all p-4 flex items-center justify-between">
              <input
                id="age-input"
                type="number"
                min="14"
                max="95"
                placeholder="26"
                value={data.age === "" ? "" : data.age}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  updateData({ age: isNaN(val) ? "" : val });
                }}
                className="w-full bg-transparent text-2xl sm:text-3xl font-bold tracking-tight text-primary outline-none tabular-nums placeholder:text-primary-dim/40"
              />
              <span className="text-xs font-mono text-primary-dim uppercase ml-2 shrink-0">
                Yrs
              </span>
            </div>
            {typeof data.age === "number" && (data.age < 14 || data.age > 95) && (
              <p className="text-[11px] text-amber-400 font-mono">
                Please enter a realistic age (14-95).
              </p>
            )}
          </div>

          {/* Height Input with Unit Switch */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-primary-dim font-semibold">
                Height
              </label>
              {/* Unit Toggle */}
              <div className="flex items-center p-0.5 rounded-lg bg-surface border border-border text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setHeightUnit("cm")}
                  className={`px-2 py-0.5 rounded ${
                    heightUnit === "cm"
                      ? "bg-accent text-background font-bold"
                      : "text-primary-dim hover:text-primary"
                  }`}
                >
                  cm
                </button>
                <button
                  type="button"
                  onClick={() => setHeightUnit("ft")}
                  className={`px-2 py-0.5 rounded ${
                    heightUnit === "ft"
                      ? "bg-accent text-background font-bold"
                      : "text-primary-dim hover:text-primary"
                  }`}
                >
                  ft/in
                </button>
              </div>
            </div>

            <div className="relative rounded-2xl bg-surface border border-border focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all p-4 flex items-center justify-between">
              {heightUnit === "cm" ? (
                <>
                  <input
                    type="number"
                    min="100"
                    max="240"
                    placeholder="175"
                    value={data.heightCm === "" ? "" : data.heightCm}
                    onChange={(e) => handleCmChange(e.target.value)}
                    className="w-full bg-transparent text-2xl sm:text-3xl font-bold tracking-tight text-primary outline-none tabular-nums placeholder:text-primary-dim/40"
                  />
                  <span className="text-xs font-mono text-primary-dim uppercase ml-2 shrink-0">
                    cm
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-3 w-full">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="3"
                      max="7"
                      value={feet}
                      onChange={(e) =>
                        handleFtInChange(
                          e.target.value === "" ? "" : parseInt(e.target.value, 10),
                          inches
                        )
                      }
                      className="w-14 bg-transparent text-2xl sm:text-3xl font-bold text-primary outline-none tabular-nums"
                    />
                    <span className="text-xs font-mono text-primary-dim">ft</span>
                  </div>
                  <span className="text-border">/</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={inches}
                      onChange={(e) =>
                        handleFtInChange(
                          feet,
                          e.target.value === "" ? "" : parseInt(e.target.value, 10)
                        )
                      }
                      className="w-14 bg-transparent text-2xl sm:text-3xl font-bold text-primary outline-none tabular-nums"
                    />
                    <span className="text-xs font-mono text-primary-dim">in</span>
                  </div>
                </div>
              )}
            </div>
            {typeof data.heightCm === "number" &&
              (data.heightCm < 100 || data.heightCm > 240) && (
                <p className="text-[11px] text-amber-400 font-mono">
                  Please enter a realistic height.
                </p>
              )}
          </div>
        </div>

        {/* Current Weight & Conditional Target Weight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Current Weight Input with Unit Switch */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-primary-dim font-semibold">
                Current Weight
              </label>
              {/* Unit Toggle */}
              <div className="flex items-center p-0.5 rounded-lg bg-surface border border-border text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setWeightUnit("kg")}
                  className={`px-2 py-0.5 rounded ${
                    weightUnit === "kg"
                      ? "bg-accent text-background font-bold"
                      : "text-primary-dim hover:text-primary"
                  }`}
                >
                  kg
                </button>
                <button
                  type="button"
                  onClick={() => setWeightUnit("lb")}
                  className={`px-2 py-0.5 rounded ${
                    weightUnit === "lb"
                      ? "bg-accent text-background font-bold"
                      : "text-primary-dim hover:text-primary"
                  }`}
                >
                  lb
                </button>
              </div>
            </div>

            <div className="relative rounded-2xl bg-surface border border-border focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all p-4 flex items-center justify-between">
              {weightUnit === "kg" ? (
                <>
                  <input
                    type="number"
                    min="30"
                    max="250"
                    step="0.5"
                    placeholder="75"
                    value={data.weightKg === "" ? "" : data.weightKg}
                    onChange={(e) => handleKgChange(e.target.value)}
                    className="w-full bg-transparent text-2xl sm:text-3xl font-bold tracking-tight text-primary outline-none tabular-nums placeholder:text-primary-dim/40"
                  />
                  <span className="text-xs font-mono text-primary-dim uppercase ml-2 shrink-0">
                    kg
                  </span>
                </>
              ) : (
                <>
                  <input
                    type="number"
                    min="66"
                    max="550"
                    placeholder="165"
                    value={weightLb === "" ? "" : weightLb}
                    onChange={(e) => handleLbChange(e.target.value)}
                    className="w-full bg-transparent text-2xl sm:text-3xl font-bold tracking-tight text-primary outline-none tabular-nums placeholder:text-primary-dim/40"
                  />
                  <span className="text-xs font-mono text-primary-dim uppercase ml-2 shrink-0">
                    lb
                  </span>
                </>
              )}
            </div>
            {typeof data.weightKg === "number" &&
              (data.weightKg < 30 || data.weightKg > 250) && (
                <p className="text-[11px] text-amber-400 font-mono">
                  Please enter a valid weight (30-250 kg).
                </p>
              )}
          </div>

          {/* Conditional Target Weight */}
          {shouldShowTargetWeight && (
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-primary-dim font-semibold flex justify-between">
                <span>Target Weight (Optional)</span>
                <span className="text-accent text-[10px]">
                  {data.goal === "fat_loss" ? "Deficit Goal" : "Surplus Goal"}
                </span>
              </label>

              <div className="relative rounded-2xl bg-surface border border-border focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all p-4 flex items-center justify-between">
                {weightUnit === "kg" ? (
                  <>
                    <input
                      type="number"
                      min="30"
                      max="250"
                      step="0.5"
                      placeholder={data.goal === "fat_loss" ? "68" : "80"}
                      value={data.targetWeightKg === "" ? "" : data.targetWeightKg}
                      onChange={(e) => handleTargetKgChange(e.target.value)}
                      className="w-full bg-transparent text-2xl sm:text-3xl font-bold tracking-tight text-primary outline-none tabular-nums placeholder:text-primary-dim/40"
                    />
                    <span className="text-xs font-mono text-primary-dim uppercase ml-2 shrink-0">
                      kg
                    </span>
                  </>
                ) : (
                  <>
                    <input
                      type="number"
                      min="66"
                      max="550"
                      placeholder={data.goal === "fat_loss" ? "150" : "176"}
                      value={targetWeightLb === "" ? "" : targetWeightLb}
                      onChange={(e) => handleTargetLbChange(e.target.value)}
                      className="w-full bg-transparent text-2xl sm:text-3xl font-bold tracking-tight text-primary outline-none tabular-nums placeholder:text-primary-dim/40"
                    />
                    <span className="text-xs font-mono text-primary-dim uppercase ml-2 shrink-0">
                      lb
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
