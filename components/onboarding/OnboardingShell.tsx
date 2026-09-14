"use client";

import React from "react";
import Link from "next/link";
import { Activity, ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { useOnboarding } from "@/lib/context/OnboardingContext";
import { useAuth } from "@/lib/context/AuthContext";
import { ProgressBar } from "@/components/onboarding/ProgressBar";
import { Button } from "@/components/ui/Button";

interface OnboardingShellProps {
  children: React.ReactNode;
}

export function OnboardingShell({ children }: OnboardingShellProps) {
  const {
    currentStep,
    prevStep,
    nextStep,
    isStepValid,
    approximateTimeRemaining,
  } = useOnboarding();
  const { user } = useAuth();
  const skipDestination = user ? "/dashboard" : "/login?next=/dashboard";

  // Screen 6 is Calculating, Screen 7 is Blueprint Preview
  const isQuestionScreen = currentStep >= 1 && currentStep <= 5;
  const canContinue = isStepValid(currentStep);

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col justify-between selection:bg-accent/20 selection:text-primary relative">

      {/* Ambient background light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-accent/[0.03] blur-[140px] pointer-events-none rounded-full" />

      {/* Top Navigation */}
      <header className="w-full border-b border-border/80 bg-background/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Left: Brand logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group outline-none"
            aria-label="IronSync Home"
          >
            <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-accent group-hover:border-accent/40 transition-colors">
              <Activity className="w-4 h-4 text-accent" strokeWidth={2.2} />
            </div>
            <span className="font-sans font-bold text-base tracking-tight text-primary">
              Iron<span className="text-accent">Sync</span>
            </span>
          </Link>

          {/* Right: Step Indicator & Skip Button */}
          <div className="flex items-center gap-3">
            {isQuestionScreen && (
              <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-primary-muted">
                <span className="font-semibold text-primary">
                  Step {currentStep} of 6
                </span>
                <span className="text-border">|</span>
                <span className="flex items-center gap-1.5 text-primary-dim">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  {approximateTimeRemaining}
                </span>
              </div>
            )}

            {currentStep === 7 && (
              <div className="text-xs font-mono text-accent flex items-center gap-1.5 font-semibold">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse-subtle" />
                Blueprint Ready
              </div>
            )}

            <Link
              href={skipDestination}
              className="text-xs font-mono uppercase tracking-wider text-primary-dim hover:text-accent transition-colors px-2.5 py-1 rounded-lg border border-border/60 hover:border-border flex items-center gap-1"
            >
              Skip to Dashboard
            </Link>
          </div>
        </div>

        {/* Progress Bar under header */}
        {isQuestionScreen && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-2">
            <ProgressBar currentStep={currentStep} totalSteps={6} />
          </div>
        )}
      </header>

      {/* Sub-bar with Back Button for Question Steps */}
      {isQuestionScreen && (
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-4">
          <button
            onClick={prevStep}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-primary-dim hover:text-primary transition-colors py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {currentStep === 1 ? "Exit to Home" : "Back to previous question"}
          </button>
        </div>
      )}

      {/* Question / Main Area */}
      <main className="flex-1 flex flex-col justify-center max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 z-10">
        {children}
      </main>

      {/* Bottom Sticky Action Bar for Question Steps */}
      {isQuestionScreen && (
        <footer className="sticky bottom-0 z-30 w-full bg-background/95 backdrop-blur-md border-t border-border/80 py-4 shadow-2xl">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={prevStep}
                className="text-xs font-mono text-primary-dim hover:text-primary transition-colors hidden sm:inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
              <Link
                href={skipDestination}
                className="text-xs font-mono text-primary-dim hover:text-accent transition-colors underline underline-offset-4 sm:hidden"
              >
                Skip to Dashboard
              </Link>
            </div>

            <div className="w-full sm:w-auto flex justify-end gap-3 items-center">
              <Link
                href={skipDestination}
                className="text-xs font-mono text-primary-dim hover:text-accent transition-colors hidden sm:inline-block px-3 py-2"
              >
                Skip to Dashboard
              </Link>
              <Button
                onClick={nextStep}
                disabled={!canContinue}
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto min-w-[180px] justify-center"
              >
                {currentStep === 5 ? "Build My Blueprint" : "Continue"}
              </Button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
