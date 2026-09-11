import React from "react";
import { Container } from "@/components/layout/Container";
import { Target, Flame, CalendarClock, Utensils } from "lucide-react";

export function TrustStrip() {
  const valuePoints = [
    {
      icon: Target,
      title: "Built around your goals",
      description: "Strength, fat loss, or recomposition tailored to your exact starting baseline.",
    },
    {
      icon: Flame,
      title: "Personalized calories",
      description: "Metabolic rate and macro allocations calculated for sustainable progression.",
    },
    {
      icon: CalendarClock,
      title: "Fits your schedule",
      description: "Structured around your actual free days, session lengths, and gym access.",
    },
    {
      icon: Utensils,
      title: "Food you actually eat",
      description: "Compatible with your dietary style without forced unpalatable restrictions.",
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
