import React from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { AuthCard } from "@/components/auth/AuthCard";
import { BlueprintMiniSummary } from "@/components/auth/BlueprintMiniSummary";
import { Activity, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Save Your Blueprint — IronSync",
  description: "Create your account to unlock the complete workout, nutrition and recovery plan.",
};

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-background text-primary flex flex-col justify-between selection:bg-accent/20 selection:text-primary relative">

      {/* Ambient background light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-accent/[0.04] blur-[140px] pointer-events-none rounded-full" />

      {/* Header */}
      <header className="w-full border-b border-border/80 bg-background/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
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

          <Link
            href="/onboarding"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-primary-dim hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Blueprint
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 z-10">
        <Container size="narrow" className="max-w-lg space-y-6">
          {/* 1. Context Preserving Mini Summary */}
          <BlueprintMiniSummary />

          {/* 2. Primary Auth Form Card */}
          <AuthCard />
        </Container>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/80 py-4 text-center text-xs font-mono text-primary-dim">
        <span>IronSync &bull; Row-Level Security Protected &bull; Zero Spam Guarantee</span>
      </footer>
    </div>
  );
}
