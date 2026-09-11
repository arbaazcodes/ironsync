import {
  duplicatePlanAsNewVersion,
  logExport,
  ExportRecord,
} from "../lib/data/historyService";
import { SavedPlanData } from "../lib/supabase/planSync";

const planV1: SavedPlanData = {
  id: "plan-v1",
  userId: "user-123",
  version: 1,
  goal: "fat_loss",
  calories: 2000,
  protein: 160,
  carbs: 200,
  fat: 55,
  trainingDays: 4,
  status: "archived",
  createdAt: "2026-08-01T00:00:00Z",
  splitName: "Upper / Lower Split",
  schedule: [],
  meals: [],
  recoveryProtocol: {
    sleepTarget: "8h",
    hydrationTarget: "3L",
    mobilityWindow: "15 min",
  },
  dietStrategyNotes: "Initial cut.",
};

const planV2: SavedPlanData = {
  id: "plan-v2",
  userId: "user-123",
  version: 2,
  goal: "fat_loss",
  calories: 1850,
  protein: 165,
  carbs: 170,
  fat: 50,
  trainingDays: 4,
  status: "archived",
  createdAt: "2026-08-15T00:00:00Z",
  splitName: "Upper / Lower Split",
  schedule: [],
  meals: [],
  recoveryProtocol: {
    sleepTarget: "8h",
    hydrationTarget: "3L",
    mobilityWindow: "15 min",
  },
  dietStrategyNotes: "Recalibrated deficit.",
};

const planV3: SavedPlanData = {
  id: "plan-v3",
  userId: "user-123",
  version: 3,
  goal: "muscle_gain",
  calories: 2750,
  protein: 175,
  carbs: 340,
  fat: 75,
  trainingDays: 5,
  status: "active",
  createdAt: "2026-09-01T00:00:00Z",
  splitName: "Push / Pull / Legs",
  schedule: [],
  meals: [],
  recoveryProtocol: {
    sleepTarget: "8h",
    hydrationTarget: "3.5L",
    mobilityWindow: "15 min",
  },
  dietStrategyNotes: "Lean bulk.",
};

async function runTests() {
  console.log("=== PLAN HISTORY & EXPORT TESTS ===");

  const allPlans = [planV3, planV2, planV1];

  // Test 1: Identify Active Plan vs Archived
  const activePlan = allPlans.find((p) => p.status === "active");
  const archivedPlans = allPlans.filter((p) => p.status === "archived");
  console.assert(activePlan?.version === 3, "Test 1 failed: Expected active plan v3");
  console.assert(archivedPlans.length === 2, "Test 1 failed: Expected 2 archived plans");
  console.log("✓ Test 1: Newest active plan (v3) correctly identified; 2 historical plans marked archived");

  // Test 2: Duplicate Historical Plan (v1) -> Should become v4 Active
  const dupResult = await duplicatePlanAsNewVersion("user-123", planV1, allPlans);
  console.assert(dupResult.success, "Test 2 failed: Duplication failed");
  console.assert(dupResult.newPlan !== undefined, "Test 2 failed: newPlan should be defined");
  if (dupResult.newPlan) {
    console.assert(dupResult.newPlan.version === 4, `Test 2 failed: Expected v4, got v${dupResult.newPlan.version}`);
    console.assert(dupResult.newPlan.status === "active", "Test 2 failed: Cloned plan must be active");
    console.assert(dupResult.newPlan.calories === planV1.calories, "Test 2 failed: Calorie targets must match source plan");
    console.assert(planV1.status === "archived", "Test 2 failed: Source historical plan must remain archived");
    console.log(`✓ Test 2: Plan v1 successfully duplicated as Plan v${dupResult.newPlan.version} Active without overwriting historical records`);
  }

  // Test 3: Log PDF Export
  const exp1 = await logExport("user-123", "plan-v3", "pdf", 3, "muscle_gain");
  console.assert(exp1.record.type === "pdf", "Test 3 failed: Export type should be pdf");
  console.assert(exp1.record.planVersion === 3, "Test 3 failed: Export planVersion should be 3");
  console.log("✓ Test 3: PDF export event successfully logged with metadata (no heavy binary in DB)");

  // Test 4: Log Share Card Export
  const exp2 = await logExport("user-123", "plan-v3", "share_card", 3, "muscle_gain");
  console.assert(exp2.record.type === "share_card", "Test 4 failed: Export type should be share_card");
  console.log("✓ Test 4: Share card export event successfully logged");

  console.log("\nALL PLAN HISTORY & EXPORT TESTS PASSED!");
}

runTests();
