"use client";

import React, { useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BlueprintPreview } from "@/components/landing/BlueprintPreview";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function Hero() {
  useEffect(() => {
    trackEvent("landing_view", { source: "hero" });
  }, []);
  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
      {/* Background subtle ambient gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-emerald-500/[0.04] blur-[120px] rounded-full pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            {/* Eyebrow */}
            <Badge variant="accent" size="md" dot>
              PERSONALIZED FITNESS, BUILT AROUND YOU
            </Badge>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary tracking-tight leading-[1.08] max-w-2xl">
              Build a fitness plan that{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                actually fits your life.
              </span>

            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-primary-muted max-w-xl leading-relaxed">
              Tell us your goal, body stats, training routine and food preferences.
              Get a personalized fitness blueprint in under a minute.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto pt-2">
              <Button
                href="/onboarding"
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto font-semibold"
                onClick={() => trackEvent("blueprint_started", { entry_source: "hero_cta" })}
              >
                Create My Free Blueprint
              </Button>

              <Button
                href="#how-it-works"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                See How It Works
              </Button>
            </div>

            {/* Micro reassurance notes */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-primary-dim font-mono">
              <span className="inline-flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-accent" />
                Under 60 seconds
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                No sign up required to start
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
