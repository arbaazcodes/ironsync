import React from "react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Dumbbell, Utensils, Moon, Check, ArrowRight, ShieldCheck, Flame, Zap } from "lucide-react";

export function BlueprintFeatures() {
  return (
    <section id="features" className="py-24 sm:py-32 bg-background-subtle border-y border-white/[0.08] scroll-mt-16">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20 sm:mb-28 space-y-4">
          <Badge variant="accent" size="md">
            THE ARCHITECTURE
          </Badge>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight uppercase">
            MORE THAN A WORKOUT PLAN.
          </h2>
          <p className="text-base sm:text-lg text-primary-muted leading-relaxed max-w-2xl">
            A cohesive three-pillar operating system engineered for athletic progression. Training, nutrition, and recovery synchronized to produce measurable adaptation.
          </p>
        </div>

        {/* Alternating Feature Rows */}
        <div className="space-y-24 sm:space-y-32">
          {/* PILLAR 1: WORKOUT (Visual Left, Content Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-6 relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-accent/30 via-accent/10 to-transparent rounded-[32px] blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative rounded-[28px] overflow-hidden bg-card border border-white/[0.1] shadow-2xl">
                <div className="relative h-72 sm:h-96 w-full">
                  <img
                    src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1200&auto=format&fit=crop"
                    alt="Heavy Squats Training"
                    className="w-full h-full object-cover brightness-[0.75] group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-black/30" />
                </div>

                {/* Floating HUD Card */}
                <div className="p-5 sm:p-6 bg-card border-t border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs pb-2 border-b border-white/[0.06]">
                    <span className="text-accent font-bold uppercase">Compound Strength Presets</span>
                    <span className="text-white">WEEK 4 &bull; INTENSIFICATION</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-white font-bold">Barbell Back Squat</span>
                    <span className="px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/30 font-bold">RPE 8.5</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-primary-dim">
                    <span>4 sets &times; 6 reps @ 82.5% 1RM</span>
                    <span className="text-white">Tempo 3-1-1-0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-wider">
                <Dumbbell className="w-4 h-4" />
                <span>Pillar 01 &bull; Biomechanical Resistance</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase leading-tight">
                Progressive Overload Without Plateaus.
              </h3>

              <p className="text-base text-primary-muted leading-relaxed">
                Every session is structured around mechanical tension, neuromuscular fatigue management, and intelligent exercise selection matched to your exact equipment.
              </p>

              <ul className="space-y-3 pt-2 text-sm text-white font-medium">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-accent/15 border border-accent/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <span>Deterministic exercise swapping preserves biomechanical movement patterns.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-accent/15 border border-accent/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <span>Dynamic tempo guidelines (eccentric, isometric, concentric) for maximum muscle fiber recruitment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-accent/15 border border-accent/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <span>Autoregulated RPE and rest duration intervals tuned to metabolic capacity.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* PILLAR 2: NUTRITION (Content Left, Visual Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-center">
            {/* Content Column */}
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-wider">
                <Utensils className="w-4 h-4" />
                <span>Pillar 02 &bull; Metabolic Precision</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase leading-tight">
                Caloric Architecture Tailored To Your Goal.
              </h3>

              <p className="text-base text-primary-muted leading-relaxed">
                Forget generic meal plans. IronSync calculates exact daily caloric output, protein synthesis requirements, and optimal peri-workout nutrient timing for your exact dietary tier.
              </p>

              <ul className="space-y-3 pt-2 text-sm text-white font-medium">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-accent/15 border border-accent/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <span>High-satiety macro balance engineered for consistent energy and zero brain fog.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-accent/15 border border-accent/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <span>1-Click macro-equivalent meal swaps for Vegetarian, Eggetarian, Non-Veg & Vegan diets.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-accent/15 border border-accent/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <span>Step-by-step culinary instructions with exact gram-weight portioning.</span>
                </li>
              </ul>
            </div>

            {/* Visual Column */}
            <div className="lg:col-span-6 relative group order-1 lg:order-2">
              <div className="absolute -inset-2 bg-gradient-to-r from-transparent via-accent/10 to-accent/30 rounded-[32px] blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative rounded-[28px] overflow-hidden bg-card border border-white/[0.1] shadow-2xl">
                <div className="relative h-72 sm:h-96 w-full">
                  <img
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop"
                    alt="Precision Macro Bowl"
                    className="w-full h-full object-cover brightness-[0.75] group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-black/30" />
                </div>

                {/* Floating HUD Card */}
                <div className="p-5 sm:p-6 bg-card border-t border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs pb-2 border-b border-white/[0.06]">
                    <span className="text-accent font-bold uppercase">Macro Distribution</span>
                    <span className="text-white">2,650 KCAL &bull; 175G PROTEIN</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center font-mono">
                    <div className="p-2 rounded-xl bg-surface-elevated border border-accent/30">
                      <span className="text-[10px] text-primary-dim block">PROTEIN</span>
                      <span className="text-xs font-bold text-accent">175g (26%)</span>
                    </div>
                    <div className="p-2 rounded-xl bg-surface-elevated border border-white/[0.06]">
                      <span className="text-[10px] text-primary-dim block">CARBS</span>
                      <span className="text-xs font-bold text-white">310g (47%)</span>
                    </div>
                    <div className="p-2 rounded-xl bg-surface-elevated border border-white/[0.06]">
                      <span className="text-[10px] text-primary-dim block">FATS</span>
                      <span className="text-xs font-bold text-primary-muted">72g (27%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PILLAR 3: RECOVERY (Visual Left, Content Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-6 relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-accent/30 via-accent/10 to-transparent rounded-[32px] blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative rounded-[28px] overflow-hidden bg-card border border-white/[0.1] shadow-2xl">
                <div className="relative h-72 sm:h-96 w-full">
                  <img
                    src="https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop"
                    alt="Active Recovery and Mobility"
                    className="w-full h-full object-cover brightness-[0.75] group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-black/30" />
                </div>

                {/* Floating HUD Card */}
                <div className="p-5 sm:p-6 bg-card border-t border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs pb-2 border-b border-white/[0.06]">
                    <span className="text-accent font-bold uppercase">Systemic Readiness</span>
                    <span className="text-white">OPTIMAL READINESS 94%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center font-mono">
                    <div className="p-2 rounded-xl bg-surface-elevated border border-white/[0.06]">
                      <span className="text-[10px] text-primary-dim block">SLEEP CADENCE</span>
                      <span className="text-xs font-bold text-white">8h 00m Continuous</span>
                    </div>
                    <div className="p-2 rounded-xl bg-surface-elevated border border-white/[0.06]">
                      <span className="text-[10px] text-primary-dim block">HYDRATION BASE</span>
                      <span className="text-xs font-bold text-accent">3.5L / Day</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-wider">
                <Moon className="w-4 h-4" />
                <span>Pillar 03 &bull; Neuromuscular Reset</span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase leading-tight">
                Growth Happens When You Recover.
              </h3>

              <p className="text-base text-primary-muted leading-relaxed">
                Fatigue masks fitness. IronSync implements scientifically scheduled active recovery days, hydration targets, and sleep optimization cues to ensure you enter every lifting session at peak central nervous system output.
              </p>

              <ul className="space-y-3 pt-2 text-sm text-white font-medium">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-accent/15 border border-accent/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <span>Zone 2 aerobic recovery protocols to accelerate metabolic waste clearance.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-accent/15 border border-accent/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <span>Bodyweight-scaled hydration targets with electrolyte replenishment advice.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-accent/15 border border-accent/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <span>Systematic deload frequency to protect tendons and connective tissue.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
