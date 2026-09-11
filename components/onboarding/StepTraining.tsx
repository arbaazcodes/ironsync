"use client";

import React from "react";
import { useOnboarding } from "@/lib/context/OnboardingContext";
import {
  ExperienceLevel,
  TrainingEnvironment,
  TrainingTime,
} from "@/lib/types/onboarding";
import {
  Building2,
  Home,
  User,
  SunMedium,
  Sun,
  Moon,
  Check,
} from "lucide-react";

export function StepTraining() {
  const { data, updateData } = useOnboarding();

  const experienceOptions: {
    id: ExperienceLevel;
    title: string;
    sub: string;
  }[] = [
    { id: "beginner", title: "Beginner", sub: "Less than 6 months" },
    { id: "intermediate", title: "Intermediate", sub: "6 months – 2 years" },
    { id: "advanced", title: "Advanced", sub: "2+ years regular lifting" },
  ];

  const environmentOptions: {
    id: TrainingEnvironment;
    title: string;
    sub: string;
    icon: React.ElementType;
  }[] = [
    {
      id: "commercial_gym",
      title: "Commercial Gym",
      sub: "Full barbells, cables, & machines",
      icon: Building2,
    },
    {
      id: "home_gym",
      title: "Home Gym",
      sub: "Dumbbells, bench, & basic setup",
      icon: Home,
    },
    {
      id: "bodyweight",
      title: "Bodyweight",
      sub: "Calisthenics & minimal gear",
      icon: User,
    },
  ];

  const timeOptions: {
    id: TrainingTime;
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: "morning", label: "Morning", icon: SunMedium },
    { id: "afternoon", label: "Afternoon", icon: Sun },
    { id: "evening", label: "Evening", icon: Moon },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-250">
      {/* Header */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-accent font-semibold">
          QUESTION 03
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
          How do you train?
        </h1>
        <p className="text-sm sm:text-base text-primary-muted leading-relaxed max-w-xl">
          We tune exercise selection to your gear, and split volume across your available days.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. Experience Level */}
        <div className="space-y-2.5">
          <label className="text-xs font-mono uppercase tracking-wider text-primary-dim font-semibold">
            Lifting Experience
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {experienceOptions.map((opt) => {
              const isSelected = data.experience === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateData({ experience: opt.id })}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    isSelected
                      ? "bg-surface-elevated border-accent text-primary shadow-accent-glow ring-1 ring-accent"
                      : "bg-surface border-border hover:border-border-hover text-primary-muted hover:text-primary"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-primary">{opt.title}</span>
                    {isSelected && <Check className="w-4 h-4 text-accent stroke-[3]" />}
                  </div>
                  <p className="text-xs text-primary-dim">{opt.sub}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Training Environment */}
        <div className="space-y-2.5">
          <label className="text-xs font-mono uppercase tracking-wider text-primary-dim font-semibold">
            Equipment Access
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {environmentOptions.map((env) => {
              const isSelected = data.equipment === env.id;
              const Icon = env.icon;
              return (
                <button
                  key={env.id}
                  type="button"
                  onClick={() => updateData({ equipment: env.id })}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    isSelected
                      ? "bg-surface-elevated border-accent text-primary shadow-accent-glow ring-1 ring-accent"
                      : "bg-surface border-border hover:border-border-hover text-primary-muted hover:text-primary"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                        isSelected
                          ? "bg-accent/15 border-accent/40 text-accent"
                          : "bg-surface-elevated border-border text-primary-dim"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-accent stroke-[3]" />}
                  </div>
                  <span className="text-sm font-bold text-primary block">{env.title}</span>
                  <p className="text-xs text-primary-dim mt-0.5">{env.sub}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Frequency & Duration (Dual Controls) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Days Per Week */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-primary-dim font-semibold">
                Days Per Week
              </label>
              <span className="text-xs font-mono text-accent">
                {data.daysPerWeek} days / wk
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[3, 4, 5, 6].map((days) => {
                const isSelected = data.daysPerWeek === days;
                return (
                  <button
                    key={days}
                    type="button"
                    onClick={() => updateData({ daysPerWeek: days })}
                    className={`py-3 rounded-xl border text-base font-bold font-mono transition-all duration-200 ${
                      isSelected
                        ? "bg-accent text-background border-accent shadow-accent-glow"
                        : "bg-surface text-primary border-border hover:border-border-hover hover:bg-surface-elevated"
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
                  >
                    {days}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Session Duration */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-primary-dim font-semibold">
                Session Duration
              </label>
              <span className="text-xs font-mono text-accent">
                {data.sessionDuration} mins
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[45, 60, 90].map((mins) => {
                const isSelected = data.sessionDuration === mins;
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => updateData({ sessionDuration: mins })}
                    className={`py-3 rounded-xl border text-xs sm:text-sm font-bold font-mono transition-all duration-200 ${
                      isSelected
                        ? "bg-surface-elevated text-accent border-accent shadow-accent-glow"
                        : "bg-surface text-primary border-border hover:border-border-hover hover:bg-surface-elevated"
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
                  >
                    {mins}m
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Preferred Time of Day */}
        <div className="space-y-2.5">
          <label className="text-xs font-mono uppercase tracking-wider text-primary-dim font-semibold">
            Preferred Training Time
          </label>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {timeOptions.map((time) => {
              const isSelected = data.trainingTime === time.id;
              const Icon = time.icon;
              return (
                <button
                  key={time.id}
                  type="button"
                  onClick={() => updateData({ trainingTime: time.id })}
                  className={`py-3 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isSelected
                      ? "bg-surface-elevated text-accent border-accent shadow-accent-glow"
                      : "bg-surface text-primary-muted border-border hover:border-border-hover hover:text-primary"
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{time.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
