import {
  AnalyticsEventName,
  AnalyticsEventRecord,
  FunnelAnalysis,
  FunnelStageConfig,
  FunnelStepMetric,
} from "./types";

/**
 * Canonical IronSync Conversion Funnel:
 * Landing -> Onboarding Started -> Onboarding Completed -> Blueprint Generated -> Auth Started -> Auth Completed -> Plan Saved
 */
export const FUNNEL_STAGES: readonly FunnelStageConfig[] = [
  {
    id: "landing",
    event: "landing_view",
    label: "Landing View",
  },
  {
    id: "onboarding_started",
    event: "blueprint_started",
    label: "Onboarding Started",
  },
  {
    id: "onboarding_completed",
    event: "deliverable_selected",
    label: "Onboarding Completed",
  },
  {
    id: "blueprint_generated",
    event: "blueprint_generated",
    label: "Blueprint Generated",
  },
  {
    id: "auth_started",
    event: "auth_started",
    label: "Auth Started",
  },
  {
    id: "auth_completed",
    event: "auth_completed",
    label: "Auth Completed",
  },
  {
    id: "plan_saved",
    event: "plan_saved",
    label: "Plan Saved",
  },
] as const;

/**
 * Calculates conversion and drop-off metrics for each step in the product funnel.
 */
export function calculateFunnelMetrics(
  events: AnalyticsEventRecord[],
  stages: readonly FunnelStageConfig[] = FUNNEL_STAGES
): FunnelAnalysis {
  // Count distinct occurrences of each event in the funnel
  const eventCounts: Record<AnalyticsEventName, number> = {} as any;
  for (const stage of stages) {
    eventCounts[stage.event] = 0;
  }

  for (const record of events) {
    if (record.name in eventCounts) {
      eventCounts[record.name] = (eventCounts[record.name] || 0) + 1;
    }
  }

  const stageMetrics: FunnelStepMetric[] = [];
  const firstStageCount = stages.length > 0 ? (eventCounts[stages[0].event] || 0) : 0;

  for (let i = 0; i < stages.length; i++) {
    const stage = stages[i];
    const currentCount = eventCounts[stage.event] || 0;
    const previousCount = i === 0 ? currentCount : (eventCounts[stages[i - 1].event] || 0);

    const conversionFromPrevious =
      previousCount > 0
        ? Math.min(100, Number(((currentCount / previousCount) * 100).toFixed(1)))
        : 0;

    const conversionFromFirst =
      firstStageCount > 0
        ? Math.min(100, Number(((currentCount / firstStageCount) * 100).toFixed(1)))
        : 0;

    const dropoffCount = Math.max(0, previousCount - currentCount);
    const dropoffRate =
      previousCount > 0
        ? Math.max(0, Number(((dropoffCount / previousCount) * 100).toFixed(1)))
        : 0;

    stageMetrics.push({
      stageId: stage.id,
      event: stage.event,
      label: stage.label,
      stepNumber: i + 1,
      count: currentCount,
      conversionFromPrevious: i === 0 ? 100 : conversionFromPrevious,
      conversionFromFirst: i === 0 ? 100 : conversionFromFirst,
      dropoffCount: i === 0 ? 0 : dropoffCount,
      dropoffRate: i === 0 ? 0 : dropoffRate,
    });
  }

  const lastStageCount = stages.length > 0 ? (eventCounts[stages[stages.length - 1].event] || 0) : 0;
  const overallConversionRate =
    firstStageCount > 0
      ? Math.min(100, Number(((lastStageCount / firstStageCount) * 100).toFixed(1)))
      : 0;

  return {
    stages: stageMetrics,
    totalStarted: firstStageCount,
    totalCompleted: lastStageCount,
    overallConversionRate,
  };
}
