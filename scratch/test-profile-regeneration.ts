import {
  UserProfileData,
  detectCoreParameterChanges,
  regenerateBlueprintPlan,
} from "../lib/data/profileService";
import { SavedPlanData } from "../lib/supabase/planSync";

const baseProfile: UserProfileData = {
  displayName: "Alex Vance",
  email: "alex@example.com",
  gender: "male",
  age: 28,
  heightCm: 180,
  weightKg: 80,
  targetWeightKg: 75,
  goal: "fat_loss",
  experience: "intermediate",
  daysPerWeek: 4,
  equipment: "commercial_gym",
  sessionDuration: 60,
  trainingTime: "morning",
  dietType: "non_vegetarian",
  mealsPerDay: 4,
  budget: "balanced",
  allergies: [],
};

const basePlan: SavedPlanData = {
  id: "plan-v1",
  userId: "user-123",
  version: 1,
  goal: "fat_loss",
  calories: 2100,
  protein: 168,
  carbs: 210,
  fat: 58,
  trainingDays: 4,
  status: "active",
  createdAt: "2026-09-01T00:00:00Z",
  splitName: "Upper / Lower Split",
  schedule: [],
  meals: [],
  recoveryProtocol: {
    sleepTarget: "8h",
    hydrationTarget: "3.2L",
    mobilityWindow: "15 min",
  },
  dietStrategyNotes: "Standard cut.",
};

async function runTests() {
  console.log("=== PROFILE & REGENERATION TESTS ===");

  // Test 1: Only Display Name Changed -> No Core Parameter Change
  const nameOnlyProfile: UserProfileData = {
    ...baseProfile,
    displayName: "Alexander Vance",
  };
  const diff1 = detectCoreParameterChanges(baseProfile, nameOnlyProfile);
  console.assert(!diff1.hasChanged, "Test 1 failed: Name change should not be a core parameter change");
  console.log("✓ Test 1: Display Name change does not trigger plan regeneration");

  // Test 2: Goal and Frequency Changed -> Core Parameter Change Detected
  const goalChangedProfile: UserProfileData = {
    ...baseProfile,
    goal: "muscle_gain",
    daysPerWeek: 5,
  };
  const diff2 = detectCoreParameterChanges(baseProfile, goalChangedProfile);
  console.assert(diff2.hasChanged, "Test 2 failed: Goal & days change should be detected");
  console.assert(diff2.changes.length === 2, `Test 2 failed: Expected 2 changes, got ${diff2.changes.length}`);
  console.log("✓ Test 2: Goal and Frequency change detected with 2 parameter diffs:", diff2.changes.map(c => c.label));

  // Test 3: Diet Type Changed -> Core Parameter Change Detected
  const dietChangedProfile: UserProfileData = {
    ...baseProfile,
    dietType: "vegan",
  };
  const diff3 = detectCoreParameterChanges(baseProfile, dietChangedProfile);
  console.assert(diff3.hasChanged, "Test 3 failed: Diet change should be detected");
  console.log("✓ Test 3: Diet Type change detected");

  // Test 4: Regenerate Blueprint Plan -> Increments version from v1 to v2 and updates active status
  const regenResult = await regenerateBlueprintPlan("user-123", basePlan, goalChangedProfile);
  console.assert(regenResult.success, "Test 4 failed: Regeneration should succeed");
  console.assert(regenResult.newPlan?.version === 2, `Test 4 failed: Expected version 2, got ${regenResult.newPlan?.version}`);
  console.assert(regenResult.newPlan?.goal === "muscle_gain", "Test 4 failed: Expected goal muscle_gain");
  console.assert(regenResult.newPlan?.trainingDays === 5, "Test 4 failed: Expected 5 training days");
  console.assert(regenResult.newPlan !== undefined, "Test 4 failed: newPlan should be defined");
  if (regenResult.newPlan) {
    console.assert(regenResult.newPlan.calories > basePlan.calories, "Test 4 failed: Muscle gain calories should be higher than fat loss");
  }

  console.log("\nALL PROFILE & REGENERATION TESTS PASSED!");
}

runTests();
