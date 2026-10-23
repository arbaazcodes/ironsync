import React from "react";
import { Container } from "@/components/layout/Container";
import { Dumbbell, ListChecks, Timer, History } from "lucide-react";

export function TrustStrip() {
  const valuePoints = [
    {
      icon: Dumbbell,
      title: "Choose your exercises",
      description: "Build each session around the movements you want to train.",
    },
    {
      icon: ListChecks,
      title: "Track every set",
      description: "Keep your actual weights, reps, and completed sets together.",
    },
    {
      icon: Timer,
      title: "Rest between sets",
      description: "Use the built-in timer before your next effort.",
    },
    {
      icon: History,
      title: "Return to your log",
      description: "Review completed sessions and see what you lifted.",
    },
  ];

  return (
    <section className="border-y border-border bg-surface/50 py-8 sm:py-10">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {valuePoints.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-3.5 group"
              >
                <div className="w-9 h-9 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-accent shrink-0 group-hover:border-accent/30 transition-colors">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-primary tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-primary-muted leading-relaxed pretty-text">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
