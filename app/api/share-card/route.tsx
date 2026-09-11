import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

interface ShareCardProps {
  goal: string;
  calories: number;
  protein: number;
  trainingDays: number;
  splitName: string;
  dietType?: string;
  name?: string;
  version?: number | string;
  days: { dayName: string; focus: string; tag: string; isRest: boolean }[];
}

function renderCard(data: ShareCardProps) {
  const formattedGoal = data.goal.replace(/_/g, " ").toUpperCase();
  const caloriesStr = Number(data.calories).toLocaleString();
  const athlete = data.name || "ATHLETE";
  const dietBadge = data.dietType ? `${data.dietType.toUpperCase()} FUEL` : "BALANCED NUTRITION";

  // Dynamic font sizing for goal to prevent clipping
  let goalFontSize = 68;
  if (formattedGoal.length > 20) {
    goalFontSize = 48;
  } else if (formattedGoal.length > 14) {
    goalFontSize = 56;
  }

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#080A0E",
        backgroundImage:
          "radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.18) 0%, transparent 50%), radial-gradient(circle at 15% 85%, rgba(16, 185, 129, 0.12) 0%, transparent 50%)",
        padding: "80px 64px 64px 64px",
        fontFamily: "sans-serif",
        color: "#FFFFFF",
        boxSizing: "border-box",
      }}
    >
      {/* 1. TOP BRAND HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          paddingBottom: "32px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: "40px", fontWeight: 900, letterSpacing: "2px", color: "#FFFFFF" }}>
            IRON
          </span>
          <span style={{ fontSize: "40px", fontWeight: 900, letterSpacing: "2px", color: "#10B981" }}>
            SYNC
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.35)",
            borderRadius: "9999px",
            padding: "10px 24px",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#10B981",
              letterSpacing: "2px",
            }}
          >
            MY FITNESS BLUEPRINT
          </span>
        </div>
      </div>

      {/* 2. GOAL & CLIENT TITLE */}
      <div style={{ display: "flex", flexDirection: "column", marginTop: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "4px",
              color: "#9CA3AF",
            }}
          >
            CALIBRATED SPECIFICATION
          </span>
          <span style={{ fontSize: "20px", color: "#4B5563", margin: "0 12px" }}>•</span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "2px",
              color: "#10B981",
            }}
          >
            v{data.version || "1.0"}
          </span>
        </div>

        <div
          style={{
            fontSize: `${goalFontSize}px`,
            fontWeight: 900,
            lineHeight: 1.08,
            letterSpacing: "-1px",
            color: "#FFFFFF",
            marginBottom: "16px",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {formattedGoal}
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: "20px", color: "#6B7280" }}>ATHLETE:</span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#E5E7EB",
              marginLeft: "10px",
              letterSpacing: "1px",
            }}
          >
            {athlete}
          </span>
          <span style={{ fontSize: "20px", color: "#4B5563", margin: "0 12px" }}>•</span>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#9CA3AF",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              padding: "4px 14px",
              borderRadius: "6px",
            }}
          >
            {dietBadge}
          </span>
        </div>
      </div>

      {/* 3. HERO METRICS (CALORIES & PROTEIN) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "28px",
          marginBottom: "28px",
        }}
      >
        {/* Calories Card */}
        <div
          style={{
            width: "48%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "28px",
            padding: "36px 32px",
          }}
        >
          <span
            style={{
              fontSize: "19px",
              fontWeight: 700,
              letterSpacing: "2.5px",
              color: "#9CA3AF",
              marginBottom: "12px",
            }}
          >
            DAILY ENERGY
          </span>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span
              style={{
                fontSize: "76px",
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "-2px",
                lineHeight: 1,
              }}
            >
              {caloriesStr}
            </span>
          </div>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#10B981",
              marginTop: "8px",
              letterSpacing: "1px",
            }}
          >
            KCAL / DAY
          </span>
        </div>

        {/* Protein Card */}
        <div
          style={{
            width: "48%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "rgba(16, 185, 129, 0.06)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "28px",
            padding: "36px 32px",
          }}
        >
          <span
            style={{
              fontSize: "19px",
              fontWeight: 700,
              letterSpacing: "2.5px",
              color: "#10B981",
              marginBottom: "12px",
            }}
          >
            DAILY PROTEIN
          </span>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span
              style={{
                fontSize: "76px",
                fontWeight: 900,
                color: "#10B981",
                letterSpacing: "-2px",
                lineHeight: 1,
              }}
            >
              {data.protein}
            </span>
            <span
              style={{
                fontSize: "36px",
                fontWeight: 800,
                color: "#10B981",
                marginLeft: "4px",
              }}
            >
              G
            </span>
          </div>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#FFFFFF",
              marginTop: "8px",
              letterSpacing: "1px",
            }}
          >
            TARGET PROTEIN
          </span>
        </div>
      </div>

      {/* 4. TRAINING CADENCE & SPLIT BREAKDOWN */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "28px",
          padding: "32px 32px 28px 32px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: "20px",
            marginBottom: "20px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                fontSize: "22px",
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "1.5px",
              }}
            >
              {data.trainingDays} DAY TRAINING CADENCE
            </span>
          </div>
          <span
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "#10B981",
              letterSpacing: "1px",
            }}
          >
            {data.splitName ? data.splitName.toUpperCase() : "MICROCYCLE"}
          </span>
        </div>

        {/* Schedule Days Matrix */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {data.days.slice(0, 7).map((day, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 18px",
                marginBottom: "8px",
                borderRadius: "14px",
                backgroundColor: day.isRest
                  ? "rgba(255, 255, 255, 0.02)"
                  : "rgba(16, 185, 129, 0.08)",
                border: day.isRest
                  ? "1px solid rgba(255, 255, 255, 0.04)"
                  : "1px solid rgba(16, 185, 129, 0.2)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    width: "90px",
                    color: day.isRest ? "#6B7280" : "#10B981",
                  }}
                >
                  {day.dayName.toUpperCase()}
                </span>
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: day.isRest ? 500 : 700,
                    color: day.isRest ? "#9CA3AF" : "#FFFFFF",
                    marginLeft: "12px",
                  }}
                >
                  {day.focus.toUpperCase()}
                </span>
              </div>

              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  color: day.isRest ? "#D97706" : "#10B981",
                  backgroundColor: day.isRest
                    ? "rgba(217, 119, 6, 0.12)"
                    : "rgba(16, 185, 129, 0.15)",
                  padding: "4px 12px",
                  borderRadius: "6px",
                }}
              >
                {day.tag.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. ACQUISITION FOOTER */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "32px",
          paddingTop: "28px",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <span
          style={{
            fontSize: "22px",
            fontWeight: 800,
            letterSpacing: "3px",
            color: "#9CA3AF",
            marginBottom: "8px",
          }}
        >
          CREATE YOUR OWN BLUEPRINT
        </span>

        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: "32px", fontWeight: 900, color: "#10B981", letterSpacing: "1px" }}>
            IRONSYNC.FIT
          </span>
        </div>

        <span
          style={{
            fontSize: "16px",
            color: "#4B5563",
            marginTop: "8px",
            letterSpacing: "1px",
          }}
        >
          Evidence-Based Deterministic Calibration Architecture
        </span>
      </div>
    </div>
  );
}

// Fallback sample schedule when none provided
function getFallbackDays(trainingDays: number) {
  if (trainingDays === 3) {
    return [
      { dayName: "Day 1", focus: "Full Body A (Squat & Press)", tag: "Workout", isRest: false },
      { dayName: "Day 2", focus: "Recovery & Hydration", tag: "Rest", isRest: true },
      { dayName: "Day 3", focus: "Full Body B (Hinge & Pull)", tag: "Workout", isRest: false },
      { dayName: "Day 4", focus: "Active Tissue Repair", tag: "Rest", isRest: true },
      { dayName: "Day 5", focus: "Full Body C (Hypertrophy)", tag: "Workout", isRest: false },
      { dayName: "Day 6", focus: "Central Recovery", tag: "Rest", isRest: true },
      { dayName: "Day 7", focus: "Complete Reset", tag: "Rest", isRest: true },
    ];
  }
  if (trainingDays === 4) {
    return [
      { dayName: "Day 1", focus: "Upper Body (Chest & Back)", tag: "Workout", isRest: false },
      { dayName: "Day 2", focus: "Lower Body (Quad & Calves)", tag: "Workout", isRest: false },
      { dayName: "Day 3", focus: "Active Recovery & Mobility", tag: "Rest", isRest: true },
      { dayName: "Day 4", focus: "Upper Body (Shoulders & Arms)", tag: "Workout", isRest: false },
      { dayName: "Day 5", focus: "Lower Body (Hams & Glutes)", tag: "Workout", isRest: false },
      { dayName: "Day 6", focus: "Active Tissue Reset", tag: "Rest", isRest: true },
      { dayName: "Day 7", focus: "Complete Rest Day", tag: "Rest", isRest: true },
    ];
  }
  // 5 or 6 day default
  return [
    { dayName: "Day 1", focus: "Upper Body Hypertrophy", tag: "Upper", isRest: false },
    { dayName: "Day 2", focus: "Lower Body Strength", tag: "Lower", isRest: false },
    { dayName: "Day 3", focus: "Active Rest & Walk", tag: "Rest", isRest: true },
    { dayName: "Day 4", focus: "Push (Chest & Delts)", tag: "Push", isRest: false },
    { dayName: "Day 5", focus: "Pull (Lats & Traps)", tag: "Pull", isRest: false },
    { dayName: "Day 6", focus: "Legs & Core Volume", tag: "Legs", isRest: false },
    { dayName: "Day 7", focus: "Systemic Recovery", tag: "Rest", isRest: true },
  ];
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Sanitize string lengths and numeric bounds against denial of service
    const goal = (searchParams.get("goal") || "Muscle Gain").slice(0, 80);
    const rawCalories = parseInt(searchParams.get("calories") || "2640", 10);
    const calories = isNaN(rawCalories) ? 2640 : Math.min(10000, Math.max(500, rawCalories));

    const rawProtein = parseInt(searchParams.get("protein") || "165", 10);
    const protein = isNaN(rawProtein) ? 165 : Math.min(800, Math.max(20, rawProtein));

    const rawTrainingDays = parseInt(searchParams.get("trainingDays") || "5", 10);
    const trainingDays = isNaN(rawTrainingDays) ? 5 : Math.min(7, Math.max(1, rawTrainingDays));

    const splitName = (searchParams.get("splitName") || "Upper / Lower Split").slice(0, 80);
    const dietType = (searchParams.get("dietType") || "Balanced").slice(0, 50);
    const name = (searchParams.get("name") || "ATHLETE").slice(0, 50);
    const version = (searchParams.get("version") || "1.0").slice(0, 20);

    // Parse optional custom schedule string with length bounds
    const rawDays = searchParams.get("days");
    let days: { dayName: string; focus: string; tag: string; isRest: boolean }[] = [];

    if (rawDays && rawDays.length <= 4096) {
      try {
        const parsed = JSON.parse(rawDays);
        if (Array.isArray(parsed)) {
          days = parsed.slice(0, 7).map((d: Record<string, unknown>, idx: number) => {
            const dayName = typeof d.dayName === "string" ? d.dayName.slice(0, 30) : `Day ${idx + 1}`;
            const focus = typeof d.focus === "string" ? d.focus.slice(0, 60) : typeof d.name === "string" ? d.name.slice(0, 60) : "Training";
            const tag = typeof d.tag === "string" ? d.tag.slice(0, 30) : d.type === "recovery" ? "Rest" : "Workout";
            const isRest = d.type === "recovery" || (typeof d.tag === "string" && d.tag.toLowerCase().includes("rest"));
            return { dayName, focus, tag, isRest };
          });
        }
      } catch {
        // Fallback if parsing failed
        days = getFallbackDays(trainingDays);
      }
    }

    if (days.length === 0) {
      days = getFallbackDays(trainingDays);
    }

    return new ImageResponse(
      renderCard({
        goal,
        calories,
        protein,
        trainingDays,
        splitName,
        dietType,
        name,
        version,
        days,
      }),
      {
        width: 1080,
        height: 1920,
      }
    );
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : "Unknown error";
    console.error("GET /api/share-card failed:", errorMsg);
    return new Response("Failed to generate share card.", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const plan = body.plan;

    if (!plan || typeof plan !== "object") {
      return new Response("Missing or invalid plan data in request body", { status: 400 });
    }

    const rawUserName = body.userName || plan?.displayName || "ATHLETE";
    const userName = (typeof rawUserName === "string" ? rawUserName : "ATHLETE").slice(0, 50);

    const rawGoal = plan.goal || "Fitness Architecture";
    const goal = (typeof rawGoal === "string" ? rawGoal : "Fitness Architecture").slice(0, 80);

    const rawCalories = Number(plan.calories);
    const calories = isNaN(rawCalories) ? 2400 : Math.min(10000, Math.max(500, rawCalories));

    const rawProtein = Number(plan.protein);
    const protein = isNaN(rawProtein) ? 160 : Math.min(800, Math.max(20, rawProtein));

    const rawTrainingDays = Number(plan.trainingDays);
    const trainingDays = isNaN(rawTrainingDays) ? 5 : Math.min(7, Math.max(1, rawTrainingDays));

    const rawSplit = plan.splitName || "Microcycle Split";
    const splitName = (typeof rawSplit === "string" ? rawSplit : "Microcycle Split").slice(0, 80);

    const rawDiet = plan.dietType || "Balanced";
    const dietType = (typeof rawDiet === "string" ? rawDiet : "Balanced").slice(0, 50);

    const version = String(plan.version || "1.0").slice(0, 20);

    const days = (Array.isArray(plan.schedule) ? plan.schedule : []).slice(0, 7).map((d: Record<string, unknown>) => ({
      dayName: typeof d.dayName === "string" ? d.dayName.slice(0, 30) : "Day",
      focus: typeof d.focus === "string" ? d.focus.slice(0, 60) : "Training",
      tag: typeof d.tag === "string" ? d.tag.slice(0, 30) : "Workout",
      isRest: d.type === "recovery" || (typeof d.tag === "string" && d.tag.toLowerCase().includes("rest")),
    }));

    return new ImageResponse(
      renderCard({
        goal,
        calories,
        protein,
        trainingDays,
        splitName,
        dietType,
        name: userName,
        version,
        days: days.length > 0 ? days : getFallbackDays(trainingDays),
      }),
      {
        width: 1080,
        height: 1920,
      }
    );
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : "Unknown error";
    console.error("POST /api/share-card failed:", errorMsg);
    return new Response("Failed to generate share card.", { status: 500 });
  }
}
