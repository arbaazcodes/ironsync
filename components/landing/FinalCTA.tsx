"use client";

import React from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function FinalCTA() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/40 to-background pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[700px] h-[300px] bg-accent/[0.06] blur-[100px] rounded-full pointer-events-none" />

      <Container className="relative z-10">
        <div className="rounded-3xl bg-gradient-to-b from-surface-elevated to-surface border border-border/80 p-8 sm:p-14 lg:p-16 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          {/* Subtle accent line across top */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-80" />

          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary tracking-tight leading-[1.15]">
              Your blueprint starts with one minute.
            </h2>

            <p className="text-base sm:text-lg text-primary-muted leading-relaxed max-w-xl mx-auto">
              No account required to get started. Fill out your core parameters,
              and see your personalized training, nutrition, and recovery system immediately.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                href="/onboarding"
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
                className="w-full sm:w-auto font-semibold px-8 py-4 text-base"
                onClick={() => trackEvent("blueprint_started", { entry_source: "final_cta" })}
              >
                Build My Free Blueprint
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-primary-dim font-mono">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-accent" />
                60 seconds completion time
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                Zero credit card or account needed
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
