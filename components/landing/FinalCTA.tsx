"use client";

import React from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ShieldCheck, Zap, LogIn, Dumbbell } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

export function FinalCTA() {
  const { user } = useAuth();
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background ambient red spotlight */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[350px] bg-accent/[0.08] blur-[140px] rounded-full pointer-events-none" />

      <Container className="relative z-10">
        <div className="rounded-[32px] bg-card border border-border p-5 sm:p-14 lg:p-18 text-center max-w-4xl mx-auto shadow-card relative overflow-hidden group hover:border-accent/40 transition-colors duration-500">
          {/* Glowing Ferrari red accent line across top */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-90 shadow-[0_0_10px_rgba(255,30,30,0.8)]" />

          <div className="max-w-2xl mx-auto space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent font-mono text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>YOUR NEXT WORKOUT</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tight uppercase leading-[1.08]">
              SHOW UP. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-accent">
                LOG IT. REPEAT.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-primary-muted leading-relaxed max-w-xl mx-auto">
              Open your workout log, choose your first exercise, and build a training history one session at a time.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                href={user ? "/dashboard/workout" : "/auth?mode=signup"}
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                className="w-full sm:w-auto font-extrabold text-sm uppercase tracking-wider px-6 sm:px-10 py-4 shadow-accent-glow"
              >
                {user ? "My Workouts" : "Start Training"}
              </Button>

              <Button
                href={user ? "/onboarding" : "/auth?mode=signin"}
                variant="secondary"
                size="lg"
                icon={<LogIn className="w-5 h-5 text-accent" />}
                className="w-full sm:w-auto font-bold text-sm uppercase tracking-wider px-6 sm:px-8 py-4"
              >
                {user ? "Build a Plan" : "Sign In"}
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs text-primary-dim font-mono">
              <span className="flex items-center gap-1.5 text-primary">
                <Dumbbell className="w-4 h-4 text-accent" />
                Workout Tracking
              </span>
              <span className="flex items-center gap-1.5 text-primary">
                <ShieldCheck className="w-4 h-4 text-accent" />
                No credit card required
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
