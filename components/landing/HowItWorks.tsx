import React from "react";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { UserCheck, Dumbbell, LogIn } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Front Desk Enrollment",
      subtitle: "Staff creates your member profile & credentials.",
      description:
        "Your gym administrator creates your profile, assigns your training track, and securely issues your unique Member ID and 4-digit security PIN.",
      icon: UserCheck,
    },
    {
      number: "02",
      title: "Assigned Workout Split",
      subtitle: "Periodized training tailored to your goals.",
      description:
        "Follow structured training routines and nutritional guidelines configured specifically for your experience level and gym equipment.",
      icon: Dumbbell,
    },
    {
      number: "03",
      title: "Member Portal Access",
      subtitle: "Sign in with your Member ID and PIN.",
      description:
        "Log into your free member dashboard to view scheduled workout splits, log attendance, and review training progress with zero recurring fees.",
      icon: LogIn,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 relative scroll-mt-16">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-4">
          <Badge variant="subtle" size="md">
            PROCESS
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">
            How IronSync Works
          </h2>
          <p className="text-base text-primary-muted leading-relaxed max-w-lg">
            A frictionless, roster-managed system connecting gym administration with athlete training and attendance.
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
                  <span className="text-accent/60 group-hover:text-accent transition-colors">
                    Phase ready &rarr;
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
