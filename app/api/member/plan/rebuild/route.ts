import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { MEMBER_COOKIE_NAME, verifyMemberSessionToken } from "@/lib/security/memberSession";
import { getMemberById, updateMember, getMemberDashboardData } from "@/lib/services/memberService";
import { generateBlueprint } from "@/lib/engine/index";
import { generateMealPlan } from "@/lib/engine/mealGenerator";
import { DietType, GoalId, ExperienceLevel } from "@/lib/types/onboarding";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(MEMBER_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyMemberSessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const member = await getMemberById(payload.id);
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));

    // Merge request attributes with existing member record
    const fitnessGoal = (body.goal || body.fitnessGoal || member.fitnessGoal || "muscle_gain") as GoalId;
    const gender = body.gender || member.gender || "male";
    const age = body.age != null ? Number(body.age) : (member.age || 26);
    const height = body.height != null ? Number(body.height) : (member.height ? Number(member.height) : 178);
    const weight = body.weight != null ? Number(body.weight) : (member.weight ? Number(member.weight) : 78);
    const experience = (body.experience || member.experience || "intermediate") as ExperienceLevel;
    const dietType = (body.dietType || member.dietType || "non_vegetarian") as DietType;
    const daysPerWeek = body.daysPerWeek != null ? Number(body.daysPerWeek) : (member.daysPerWeek || 4);
    const notes = body.notes !== undefined ? body.notes : member.notes;

    // 1. Run deterministic sports-science calculation engine
    const blueprint = generateBlueprint({
      gender,
      age,
      weightKg: weight,
      heightCm: height,
      goal: fitnessGoal,
      daysPerWeek,
      sessionDuration: 60,
      equipment: "commercial_gym",
      experience,
      dietType,
      mealsPerDay: 4,
      budget: "balanced",
      allergies: [],
      deliverables: ["workout", "nutrition"],
      trainingTime: "evening",
    });

    // 2. Generate customized day meals matching the exact calorie target and diet preference
    const meals = generateMealPlan(dietType, blueprint.macros.calories, 4);

    // 3. Update member record in PostgreSQL (preserves pinHash, updates profile params)
    await updateMember(member.id, {
      fitnessGoal,
      gender,
      age,
      height,
      weight,
      experience,
      dietType,
      daysPerWeek,
      notes,
    });

    // 4. Return complete recalculated dashboard payload
    const updatedDashboard = await getMemberDashboardData(member.memberId);

    return NextResponse.json({
      success: true,
      message: "Plan recalculated from physical profile and biomechanics engine.",
      member: updatedDashboard?.member || member,
      assignedPlan: updatedDashboard?.assignedPlan || {
        id: member.planTemplateKey || "custom-plan",
        version: 1,
        goal: fitnessGoal,
        splitName: blueprint.splitName,
        calories: blueprint.macros.calories,
        protein: blueprint.macros.protein,
        carbs: blueprint.macros.carbs,
        fat: blueprint.macros.fat,
        trainingDays: daysPerWeek,
        schedule: blueprint.schedule,
        recoveryProtocol: blueprint.recoveryProtocol,
        dietStrategyNotes: blueprint.dietStrategyNotes,
        meals,
      },
    });
  } catch (error: any) {
    console.error("Error rebuilding member plan:", error);
    return NextResponse.json(
      { error: "Failed to recalculate plan", details: error?.message || "Internal error" },
      { status: 500 }
    );
  }
}
