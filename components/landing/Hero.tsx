"use client";

import React, { useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { BlueprintPreview } from "@/components/landing/BlueprintPreview";
import { ArrowRight, ShieldCheck, Zap, Activity } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { useAuth } from "@/lib/context/AuthContext";

export function Hero() {
  const { user } = useAuth();

  useEffect(() => {
    trackEvent("landing_view", { source: "hero" });
  }, []);

  return (
    <section aria-labelledby="hero-title" className="relative pt-28 pb-16 sm:pt-40 sm:pb-28 overflow-hidden">
      {/* Ambient Ferrari Red spotlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[500px] bg-accent/[0.08] blur-[160px] rounded-full pointer-events-none" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-7">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-[10px] sm:text-xs font-extrabold tracking-wider uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>YOUR WORKOUTS &bull; YOUR PROGRESS</span>
            </div>

            {/* Main Headline */}
            <h1 id="hero-title" className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-primary tracking-tight leading-[1.04] max-w-2xl uppercase">
              LOG EVERY SET. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-accent">
                KEEP GOING.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-primary-muted max-w-xl leading-relaxed">
              Choose your exercises, record weights and reps, and come back to your saved workouts. A training log that keeps up with you.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto pt-2">
              <Button
                href={user ? "/dashboard/workout" : "/auth?mode=signup"}
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto font-extrabold text-sm uppercase tracking-wider py-3.5 px-8 shadow-accent-glow"
              >
                {user ? "My Workouts" : "Start Training"}
              </Button>

              <Button
                href="/#how-it-works"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto font-bold text-sm uppercase tracking-wider py-3.5 px-6"
              >
                See How It Works
              </Button>
            </div>

            {/* Micro reassurance notes */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-primary-dim font-mono">
              <span className="inline-flex items-center gap-1.5 text-primary">
                <Zap className="w-4 h-4 text-accent" />
                Choose your exercises
              </span>
              <span className="inline-flex items-center gap-1.5 text-primary">
                <ShieldCheck className="w-4 h-4 text-accent" />
                Your own account
              </span>
              <span className="inline-flex items-center gap-1.5 text-primary">
                <Activity className="w-4 h-4 text-accent" />
                Weights in kg or lb
              </span>
            </div>
          </div>

          {/* Right Column: Blueprint Preview */}
          <div className="lg:col-span-5 w-full">
            <BlueprintPreview />
          </div>
        </div>
      </Container>
    </section>
  );
}
