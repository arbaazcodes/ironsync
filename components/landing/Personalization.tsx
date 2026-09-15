"use client";

import React, { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle2, SlidersHorizontal, Sparkles } from "lucide-react";

interface PersonaConfig {
  id: string;
  name: string;
  tagline: string;
  inputs: {
    goal: string;
    training: string;
    equipment: string;
    diet: string;
    session: string;
    budget: string;
  };
  output: {
    calories: string;
    protein: string;
    splitName: string;
    workoutStyle: string;
    dietStrategy: string;
    timeCommitment: string;
  };
}

const PERSONAS: PersonaConfig[] = [
  {
    id: "busy_pro",
    name: "Busy Professional",
    tagline: "High demands, commercial gym access, vegetarian diet",
    inputs: {
      goal: "Muscle Gain",
      training: "5 days/week",
      equipment: "Commercial Gym",
      diet: "Eggetarian",
      session: "60 minutes",
      budget: "Balanced",
    },
    output: {
      calories: "2,640 kcal/day",
      protein: "165g target",
      splitName: "Upper / Lower / Push / Pull / Legs",
      workoutStyle: "High-density supersets to respect 60m cutoff",
      dietStrategy: "Egg white & dairy protein distribution with high complex carbs",
      timeCommitment: "5.0 hrs total active training/week",
    },
  },
  {
    id: "home_minimalist",
    name: "Home Gym Minimalist",
    tagline: "Limited equipment, high efficiency, fat loss focus",
    inputs: {
      goal: "Fat Loss & Tone",
      training: "3 days/week",
      equipment: "Dumbbells & Bench",
      diet: "High Protein Non-Veg",
      session: "45 minutes",
      budget: "Budget-Friendly",
    },
    output: {
      calories: "1,980 kcal/day",
      protein: "155g target",
      splitName: "3-Day Full Body Density",
      workoutStyle: "Mechanical drop sets utilizing available dumbbells",
      dietStrategy: "High-satiety volume eating; lean whole-food staples",
      timeCommitment: "2.25 hrs total active training/week",
    },
  },
  {
    id: "hybrid_athlete",
    name: "Athletic Recomp",
    tagline: "Balance strength with conditioning & flexible diet",
    inputs: {
      goal: "Athletic Recomp",
      training: "4 days/week",
      equipment: "Full Gym + Outdoor",
      diet: "Plant-Forward",
      session: "50 minutes",
      budget: "Premium",
    },
    output: {
      calories: "2,350 kcal/day",
      protein: "160g target",
      splitName: "Upper / Lower + Hybrid Conditioning",
      workoutStyle: "Compound lifts paired with Zone 2 aerobic base work",
      dietStrategy: "Timed carbohydrate cycling around hard training days",
      timeCommitment: "3.5 hrs total active training/week",
    },
  },
];

export function Personalization() {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("busy_pro");
  const currentPersona =
    PERSONAS.find((p) => p.id === selectedPersonaId) || PERSONAS[0];

  return (
    <section id="personalization" className="py-20 sm:py-28 relative scroll-mt-16">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-14 sm:mb-18 space-y-4">
          <Badge variant="accent" size="md">
            DIFFERENTIATOR
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">
            Built around your real life.
          </h2>
          <p className="text-base text-primary-muted leading-relaxed max-w-lg">
            Generic cookie-cutter templates fail because they ignore your constraints.
            IronSync continuously recalculates every variable to match your reality.
          </p>
        </div>

        {/* Persona Preset Switcher */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {PERSONAS.map((persona) => (
            <button
              key={persona.id}
              onClick={() => setSelectedPersonaId(persona.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 ${
                selectedPersonaId === persona.id
                  ? "bg-surface-elevated text-accent border border-accent/40 shadow-sm"
                  : "bg-surface text-primary-muted border border-border hover:border-border-hover hover:text-primary"
              }`}
            >
              {persona.name}
            </button>
          ))}
        </div>

        {/* Comparative Transformation Board */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left Side: Inputs Card */}
          <Card
            variant="elevated"
            padding="md"
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-border/70">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-accent" />
                  <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
                    YOUR PARAMETERS
                  </span>
                </div>
                <span className="text-[11px] font-mono text-primary-dim">Input profile</span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {Object.entries(currentPersona.inputs).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-3 rounded-xl bg-surface border border-border/60 flex flex-col justify-between"
                  >
                    <span className="text-[10px] font-mono uppercase text-primary-dim tracking-wider font-semibold">
                      {key}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-primary mt-1">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-primary-dim font-mono">
              <span>All 6 constraints considered</span>
              <span className="text-accent">&rarr; Algorithmic match</span>
            </div>
          </Card>

          {/* Center Connector Indicator for Desktop */}
          <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-primary-dim font-mono text-xs">
              <div className="w-12 h-12 rounded-full bg-surface-elevated border border-accent/30 flex items-center justify-center text-accent shadow-accent-glow">
                <ArrowRight className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">
                Synthesized
              </span>
            </div>
          </div>

          {/* Right Side: Output Blueprint Result */}
          <Card
            variant="elevated"
            padding="md"
            className="lg:col-span-5 flex flex-col justify-between border-accent/25 relative overflow-hidden"
          >
            {/* Subtle glow highlight */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 blur-3xl rounded-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-border/70">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                    INDIVIDUALIZED BLUEPRINT
                  </span>
                </div>
                <Badge variant="accent" size="sm">
                  Generated
                </Badge>
              </div>

              <div className="space-y-3.5">
                <div className="p-3.5 rounded-xl bg-surface border border-border/60 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-primary-dim tracking-wider">
                    Calculated Energy Targets
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-lg font-bold text-primary tabular-nums">
                      {currentPersona.output.calories}
                    </span>
                    <span className="text-xs text-accent font-mono">
                      {currentPersona.output.protein}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-border/60 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-primary-dim tracking-wider">
                    Prescribed Split
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-primary">
                    {currentPersona.output.splitName}
                  </p>
                  <p className="text-xs text-primary-muted pt-0.5">
                    {currentPersona.output.workoutStyle}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-border/60 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-primary-dim tracking-wider">
                    Dietary Adherence Strategy
                  </span>
                  <p className="text-xs text-primary-muted">
                    {currentPersona.output.dietStrategy}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-mono">
              <span className="text-primary-dim flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                Zero generic fluff
              </span>
              <span className="text-primary font-semibold">
                {currentPersona.output.timeCommitment}
              </span>
            </div>
          </Card>
        </div>

        {/* Action Prompt */}
        <div className="mt-12 text-center">
          <Button
            href="/login?tab=member"
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Access Member Portal &rarr;
          </Button>
        </div>
      </Container>
    </section>
  );
}
