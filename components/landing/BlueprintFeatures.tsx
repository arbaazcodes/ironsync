import React from "react";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Dumbbell, Utensils, Moon, Check } from "lucide-react";

export function BlueprintFeatures() {
  return (
    <section id="features" className="py-20 sm:py-28 bg-background-subtle border-y border-border scroll-mt-16">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-4">
          <Badge variant="accent" size="md">
            THE TRIAD
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">
            More than a workout plan.
          </h2>
          <p className="text-base text-primary-muted leading-relaxed max-w-lg">
            One blueprint for training, nutrition and recovery. Engineered together so every workout produces measurable adaptation.
          </p>
        </div>

        {/* 3 Pillar Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Card 1: WORKOUT */}
          <Card
            variant="elevated"
            padding="none"
            className="flex flex-col justify-between overflow-hidden border-border/80 hover:border-border-hover transition-all duration-300 group"
          >
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-accent group-hover:border-accent/40 transition-colors">
                  <Dumbbell className="w-5 h-5 text-accent" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-primary-dim">
                  Pillar 01
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-primary tracking-tight mb-2">
                  Workout
                </h3>
                <p className="text-xs text-accent font-mono uppercase tracking-wider mb-4">
                  Progressive Overload Framework
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-primary-muted">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    <span>Exercise selection tuned to equipment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    <span>Sets, reps & progressive intensity guidance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    <span>Intelligent weekly split design</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    <span>Form cues & mechanical safety</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Realistic Mini UI Preview */}
            <div className="bg-surface/80 border-t border-border p-5 sm:p-6 space-y-3 font-sans">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-border/40">
                <span className="font-mono text-primary-dim uppercase text-[10px]">Active Session Sample</span>
                <span className="text-[10px] text-accent font-mono">PUSH DAY 1</span>
              </div>

              <div className="rounded-xl bg-surface-elevated p-3 border border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary">Incline Barbell Bench</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface text-accent">RPE 8.0</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-primary-muted font-mono">
                  <span>4 sets &times; 8-10 reps</span>
                  <span>120s Rest</span>
                </div>
              </div>

              <div className="rounded-xl bg-surface-elevated/70 p-3 border border-border/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary-muted">Weighted Dips</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface text-primary-dim">RPE 8.5</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-primary-dim font-mono">
                  <span>3 sets &times; 10-12 reps</span>
                  <span>90s Rest</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Card 2: NUTRITION */}
          <Card
            variant="elevated"
            padding="none"
            className="flex flex-col justify-between overflow-hidden border-border/80 hover:border-border-hover transition-all duration-300 group"
          >
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-accent group-hover:border-accent/40 transition-colors">
                  <Utensils className="w-5 h-5 text-accent" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-primary-dim">
                  Pillar 02
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-primary tracking-tight mb-2">
                  Nutrition
                </h3>
                <p className="text-xs text-accent font-mono uppercase tracking-wider mb-4">
                  Metabolic Energy Precision
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-primary-muted">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    <span>Daily calorie target calculated for your goal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    <span>Protein & macronutrient distribution</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    <span>Optimized peri-workout meal timing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    <span>Smart food swaps matching your palate</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Realistic Mini UI Preview */}
            <div className="bg-surface/80 border-t border-border p-5 sm:p-6 space-y-3 font-sans">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-border/40">
                <span className="font-mono text-primary-dim uppercase text-[10px]">Macro Breakdown</span>
                <span className="text-[10px] text-accent font-mono">2,640 KCAL</span>
              </div>

              {/* Macro Bars */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-primary-muted">Protein</span>
                    <span className="text-primary font-medium">165g (25%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full w-[25%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-primary-muted">Carbohydrates</span>
                    <span className="text-primary font-medium">330g (50%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-300 rounded-full w-[50%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-primary-muted">Fats</span>
                    <span className="text-primary font-medium">73g (25%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full w-[25%]" />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-primary-dim">
                <span className="font-mono">Preference: Eggetarian</span>
                <span className="text-accent font-mono text-[10px]">High Satiety</span>
              </div>
            </div>
          </Card>

          {/* Card 3: RECOVERY */}
          <Card
            variant="elevated"
            padding="none"
            className="flex flex-col justify-between overflow-hidden border-border/80 hover:border-border-hover transition-all duration-300 group"
          >
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-accent group-hover:border-accent/40 transition-colors">
                  <Moon className="w-5 h-5 text-accent" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-primary-dim">
                  Pillar 03
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-primary tracking-tight mb-2">
                  Recovery
                </h3>
                <p className="text-xs text-accent font-mono uppercase tracking-wider mb-4">
                  Systemic Rejuvenation
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-primary-muted">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    <span>Customized sleep targets & hygiene cues</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    <span>Hydration targets scaled to bodyweight</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    <span>Scheduled deload & rest intervals</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    <span>Daily micro-habits for nervous system reset</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Realistic Mini UI Preview */}
            <div className="bg-surface/80 border-t border-border p-5 sm:p-6 space-y-3 font-sans">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-border/40">
                <span className="font-mono text-primary-dim uppercase text-[10px]">Readiness Protocol</span>
                <span className="text-[10px] text-accent font-mono">OPTIMAL</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-surface-elevated border border-border/50">
                  <span className="text-[10px] font-mono text-primary-dim uppercase block">Sleep Window</span>
                  <span className="text-sm font-bold text-primary tabular-nums">7h 45m</span>
                  <span className="text-[10px] text-accent block mt-0.5">Consistent</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-elevated border border-border/50">
                  <span className="text-[10px] font-mono text-primary-dim uppercase block">Hydration</span>
                  <span className="text-sm font-bold text-primary tabular-nums">3.4 Liters</span>
                  <span className="text-[10px] text-accent block mt-0.5">+Electrolytes</span>
                </div>
              </div>

              <div className="rounded-xl bg-surface-elevated/70 p-2.5 border border-border/40 flex items-center justify-between text-[11px]">
                <span className="text-primary-muted">Active Recovery:</span>
                <span className="text-primary font-mono text-[10px]">Zone 2 Walk • 25m</span>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}
