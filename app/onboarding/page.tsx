"use client";

import React from "react";
import {
  OnboardingProvider,
  useOnboarding,
} from "@/lib/context/OnboardingContext";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { StepGoal } from "@/components/onboarding/StepGoal";
import { StepBody } from "@/components/onboarding/StepBody";
import { StepTraining } from "@/components/onboarding/StepTraining";
import { StepNutrition } from "@/components/onboarding/StepNutrition";
import { StepDeliverables } from "@/components/onboarding/StepDeliverables";
import { StepCalculating } from "@/components/onboarding/StepCalculating";
import { StepPreview } from "@/components/onboarding/StepPreview";

function OnboardingContent() {
  const { currentStep } = useOnboarding();

  switch (currentStep) {
    case 1:
      return <StepGoal />;
    case 2:
      return <StepBody />;
    case 3:
      return <StepTraining />;
    case 4:
      return <StepNutrition />;
    case 5:
      return <StepDeliverables />;
    case 6:
      return <StepCalculating />;
    case 7:
      return <StepPreview />;
    default:
      return <StepGoal />;
  }
}

export default function OnboardingPage() {
  React.useEffect(() => {
    // Gate public onboarding - redirect visitors to member portal
    if (typeof window !== "undefined") {
      window.location.replace("/login?tab=member");
    }
  }, []);

  return (
    <OnboardingProvider>
      <OnboardingShell>
        <OnboardingContent />
      </OnboardingShell>
    </OnboardingProvider>
  );
}
