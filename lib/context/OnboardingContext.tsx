"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CalculatedBlueprint, OnboardingData } from "@/lib/types/onboarding";
import { generateBlueprint } from "@/lib/engine";
import { trackEvent } from "@/lib/analytics";

const INITIAL_DATA: OnboardingData = {
  goal: null,
  age: "",
  gender: null,
  heightCm: "",
  weightKg: "",
  targetWeightKg: "",
  experience: null,
  equipment: null,
  daysPerWeek: 4,
  sessionDuration: 60,
  trainingTime: null,
  dietType: null,
  mealsPerDay: 3,
  budget: null,
  allergies: [],
  deliverables: ["workout", "nutrition"],
};

interface OnboardingContextType {
  currentStep: number;
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  isStepValid: (step: number) => boolean;
  calculatedBlueprint: CalculatedBlueprint | null;
  approximateTimeRemaining: string;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
  const [calculatedBlueprint, setCalculatedBlueprint] =
    useState<CalculatedBlueprint | null>(null);

  const updateData = (partial: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return data.goal !== null;
      case 2: {
        const hasAge = typeof data.age === "number" && data.age >= 14 && data.age <= 95;
        const hasGender = data.gender !== null;
        const hasHeight =
          typeof data.heightCm === "number" && data.heightCm >= 100 && data.heightCm <= 240;
        const hasWeight =
          typeof data.weightKg === "number" && data.weightKg >= 30 && data.weightKg <= 250;
        return hasAge && hasGender && hasHeight && hasWeight;
      }
      case 3:
        return (
          data.experience !== null &&
          data.equipment !== null &&
          data.daysPerWeek >= 3 &&
          data.sessionDuration >= 45 &&
          data.trainingTime !== null
        );
      case 4:
        return (
          data.dietType !== null &&
          data.mealsPerDay >= 3 &&
          data.budget !== null
        );
      case 5:
        return data.deliverables.length >= 1;
      case 6:
      case 7:
        return true;
      default:
        return false;
    }
  };

  // Track onboarding started on initial mount
  useEffect(() => {
    trackEvent("blueprint_started", { entry_source: "onboarding_flow" });
  }, []);

  const nextStep = () => {
    if (currentStep === 1 && isStepValid(1)) {
      trackEvent("goal_selected", { goal: data.goal });
      setCurrentStep(2);
    } else if (currentStep === 2 && isStepValid(2)) {
      // Privacy safeguard: NO raw body measurements (weight, height, bmi)
      trackEvent("body_step_completed", {
        gender: data.gender,
        has_target_goal: Boolean(data.targetWeightKg),
      });
      setCurrentStep(3);
    } else if (currentStep === 3 && isStepValid(3)) {
      trackEvent("training_step_completed", {
        experience: data.experience,
        equipment: data.equipment,
        days_per_week: data.daysPerWeek,
      });
      setCurrentStep(4);
    } else if (currentStep === 4 && isStepValid(4)) {
      // Privacy safeguard: NO allergy strings or health conditions
      trackEvent("nutrition_step_completed", {
        diet_type: data.dietType,
        meals_per_day: data.mealsPerDay,
        budget: data.budget,
      });
      setCurrentStep(5);
    } else if (currentStep === 5 && isStepValid(5)) {
      trackEvent("deliverable_selected", {
        deliverables_count: data.deliverables.length,
      });
      // Move to calculating step
      const blueprint = generateBlueprint(data);
      setCalculatedBlueprint(blueprint);
      trackEvent("blueprint_generated", {
        split_name: blueprint.splitName,
        training_days: data.daysPerWeek,
      });
      setCurrentStep(6);
    }
  };

  const prevStep = () => {
    if (currentStep === 7) {
      setCurrentStep(5);
    } else if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else if (currentStep === 1) {
      window.location.href = "/";
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  // Step timing estimations
  const timeRemainingMap: Record<number, string> = {
    1: "~45 sec",
    2: "~35 sec",
    3: "~25 sec",
    4: "~15 sec",
    5: "~5 sec",
    6: "Calculating",
    7: "Complete",
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        data,
        updateData,
        nextStep,
        prevStep,
        goToStep,
        isStepValid,
        calculatedBlueprint,
        approximateTimeRemaining: timeRemainingMap[currentStep] || "~30 sec",
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
