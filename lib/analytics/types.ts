export type AnalyticsEventName =
  | "landing_view"
  | "blueprint_started"
  | "goal_selected"
  | "body_step_completed"
  | "training_step_completed"
  | "nutrition_step_completed"
  | "deliverable_selected"
  | "blueprint_generated"
  | "blueprint_preview_viewed"
  | "auth_started"
  | "auth_completed"
  | "plan_saved"
  | "dashboard_viewed"
  | "workout_viewed"
  | "nutrition_viewed"
  | "pdf_generated"
  | "share_card_generated"
  | "check_in_completed"
  | "plan_recalibration_started";

export interface AnalyticsEventRecord {
  id: string;
  name: AnalyticsEventName;
  properties: Record<string, any>;
  timestamp: string;
}

export interface AnalyticsProvider {
  name: string;
  track: (event: AnalyticsEventName, properties: Record<string, any>) => void;
  identify?: (userId: string, traits?: Record<string, any>) => void;
  reset?: () => void;
}

export interface FunnelStageConfig {
  id: string;
  event: AnalyticsEventName;
  label: string;
}

export interface FunnelStepMetric {
  stageId: string;
  event: AnalyticsEventName;
  label: string;
  stepNumber: number;
  count: number;
  conversionFromPrevious: number; // percentage (0-100)
  conversionFromFirst: number; // percentage (0-100)
  dropoffCount: number;
  dropoffRate: number; // percentage (0-100)
}

export interface FunnelAnalysis {
  stages: FunnelStepMetric[];
  totalStarted: number;
  totalCompleted: number;
  overallConversionRate: number;
}
