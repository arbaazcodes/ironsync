import {
  assessPlanRecalibration,
  CheckInRecord,
  applyPlanRecalibration,
} from "../lib/data/checkInService";
import { SavedPlanData } from "../lib/supabase/planSync";

const mockPlan: SavedPlanData = {
  id: "plan-test-1",
  userId: "user-123",
  version: 1,
  goal: "fat_loss",
  calories: 2200,
  protein: 160,
  carbs: 230,
  fat: 65,
  trainingDays: 4,
  status: "active",
  createdAt: "2026-09-01T00:00:00.000Z",
  splitName: "Upper / Lower",
  schedule: [],
  meals: [],
  recoveryProtocol: {
    sleepTarget: "8h",
    hydrationTarget: "3L",
    mobilityWindow: "15 min",
  },
  dietStrategyNotes: "Standard deficit.",
  weightKg: 85,
  targetWeightKg: 78,
};

function runTests() {
  console.log("=== CHECK-IN & RECALIBRATION TESTS ===");

  // Test 1: Fewer than 2 check-ins
  const test1 = assessPlanRecalibration(
    [{ id: "1", userId: "u1", weightKg: 85, createdAt: "2026-09-01T00:00:00Z" }],
    mockPlan
  );
  console.assert(test1.status === "insufficient_data", "Test 1 failed: should be insufficient_data");
  console.log("✓ Test 1: Single check-in returns insufficient_data with message:", test1.reason);

  // Test 2: Two check-ins less than 3 days apart
  const test2 = assessPlanRecalibration(
    [
      { id: "1", userId: "u1", weightKg: 85, createdAt: "2026-09-01T00:00:00Z" },
      { id: "2", userId: "u1", weightKg: 84.8, createdAt: "2026-09-02T00:00:00Z" },
    ],
    mockPlan
  );
  console.assert(test2.status === "insufficient_time", "Test 2 failed: should be insufficient_time");
  console.log("✓ Test 2: Check-ins <3 days apart returns insufficient_time");

  // Test 3: Fat Loss Stalled (14 days, flat weight 85kg -> 85.1kg)
  const test3 = assessPlanRecalibration(
    [
      { id: "1", userId: "u1", weightKg: 85, createdAt: "2026-09-01T00:00:00Z" },
      { id: "2", userId: "u1", weightKg: 85.1, createdAt: "2026-09-15T00:00:00Z" },
    ],
    mockPlan
  );
  console.assert(test3.status === "adjustment_suggested", "Test 3 failed: should be adjustment_suggested");
  console.assert(test3.suggestedCalories === 2050, `Test 3 failed: expected 2050, got ${test3.suggestedCalories}`);
  console.log("✓ Test 3: Fat Loss Stalled suggests -150 kcal (2200 -> 2050 kcal)");

  // Test 4: Fat Loss Dropping Too Fast (14 days, -2.5 kg = -1.25 kg/week)
  const test4 = assessPlanRecalibration(
    [
      { id: "1", userId: "u1", weightKg: 85, createdAt: "2026-09-01T00:00:00Z" },
      { id: "2", userId: "u1", weightKg: 82.5, createdAt: "2026-09-15T00:00:00Z" },
    ],
    mockPlan
  );
  console.assert(test4.status === "adjustment_suggested", "Test 4 failed: should be adjustment_suggested");
  console.assert(test4.suggestedCalories === 2350, `Test 4 failed: expected 2350, got ${test4.suggestedCalories}`);
  console.log("✓ Test 4: Rapid Fat Loss suggests +150 kcal to protect muscle");

  // Test 5: Fat Loss On Track (14 days, -1.0 kg = -0.5 kg/week)
  const test5 = assessPlanRecalibration(
    [
      { id: "1", userId: "u1", weightKg: 85, createdAt: "2026-09-01T00:00:00Z" },
      { id: "2", userId: "u1", weightKg: 84.0, createdAt: "2026-09-15T00:00:00Z" },
    ],
    mockPlan
  );
  console.assert(test5.status === "on_track", "Test 5 failed: should be on_track");
  console.log("✓ Test 5: Fat Loss steady at -0.5 kg/week returns on_track");

  // Test 6: Muscle Gain Stalled (14 days, 75kg -> 75kg)
  const bulkPlan: SavedPlanData = { ...mockPlan, goal: "muscle_gain", calories: 2800, weightKg: 75 };
  const test6 = assessPlanRecalibration(
    [
      { id: "1", userId: "u1", weightKg: 75, createdAt: "2026-09-01T00:00:00Z" },
      { id: "2", userId: "u1", weightKg: 75.0, createdAt: "2026-09-15T00:00:00Z" },
    ],
    bulkPlan
  );
  console.assert(test6.status === "adjustment_suggested", "Test 6 failed: should suggest adjustment");
  console.assert(test6.suggestedCalories === 2950, `Test 6 failed: expected 2950, got ${test6.suggestedCalories}`);
  console.log("✓ Test 6: Muscle Gain Stalled suggests +150 kcal (2800 -> 2950 kcal)");

  // Test 7: Safety Floor Enforced (Current cal = 1450, -150 should cap at 1400)
  const lowCalPlan: SavedPlanData = { ...mockPlan, calories: 1450 };
  const test7 = assessPlanRecalibration(
    [
      { id: "1", userId: "u1", weightKg: 65, createdAt: "2026-09-01T00:00:00Z" },
      { id: "2", userId: "u1", weightKg: 65.1, createdAt: "2026-09-15T00:00:00Z" },
    ],
    lowCalPlan
  );
  console.assert(test7.suggestedCalories === 1400, `Test 7 failed: expected 1400 floor, got ${test7.suggestedCalories}`);
  console.log("✓ Test 7: Minimum safety floor 1400 kcal enforced");

  console.log("\nALL CHECK-IN & RECALIBRATION TESTS PASSED!");
}

runTests();
