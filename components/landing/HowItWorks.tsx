import React from "react";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { UserCheck, Dumbbell, History } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Create your account",
      subtitle: "Sign up with your email.",
      description:
        "Confirm your email and open your workout log. You can start your first session right away.",
      icon: UserCheck,
    },
    {
      number: "02",
      title: "Make every set count",
      subtitle: "Choose exercises. Log what you lift.",
      description:
        "Add exercises, enter your weights and reps, and mark each set complete. Use the rest timer between sets.",
      icon: Dumbbell,
    },
    {
      number: "03",
      title: "Pick up where you left off",
      subtitle: "Your training stays with you.",
      description:
        "Refresh without losing your sets. Finish your workout and revisit its exercises, weights, and reps in your recent sessions.",
      icon: History,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 relative scroll-mt-24">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-4">
          <Badge variant="subtle" size="md">
            GET STARTED
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">
            How IronSync Works
          </h2>
          <p className="text-base text-primary-muted leading-relaxed max-w-lg">
            From your first exercise to your last set, keep your training in one place.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={index}
                variant="interactive"
                padding="md"
                className="flex flex-col justify-between group h-full"
              >
                <div>
                  {/* Top Bar: Step Number & Icon */}
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/60">
                    <span className="font-mono text-3xl sm:text-4xl font-black tracking-tight text-accent/80 group-hover:text-accent transition-colors">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-primary-muted group-hover:text-accent group-hover:border-accent/40 transition-all duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Step Content */}
                  <h3 className="text-xl font-bold text-primary tracking-tight mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs font-mono uppercase tracking-wider text-accent mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-sm text-primary-muted leading-relaxed pretty-text">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-primary-dim font-mono">
                  <span>Step {index + 1} of 3</span>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
