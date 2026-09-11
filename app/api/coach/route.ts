import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

interface CoachRequestBody {
  message: string;
  context?: {
    planName?: string;
    goal?: string;
    calories?: number;
    protein?: number;
    split?: string;
    experienceLevel?: string;
    daysPerWeek?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user session using @supabase/ssr
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let userEmail: string | undefined = undefined;
    let userId: string | undefined = undefined;

    if (supabaseUrl && supabaseKey) {
      const response = NextResponse.next();
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        userEmail = user.email;
        userId = user.id;
      }
    }

    // 2. Validate input
    const body = (await request.json()) as CoachRequestBody;
    const rawMessage = body?.message?.trim();

    if (!rawMessage) {
      return NextResponse.json(
        { error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    // Length limit guardrail
    if (rawMessage.length > 500) {
      return NextResponse.json(
        { error: "Query exceeds the maximum allowable length of 500 characters." },
        { status: 400 }
      );
    }

    const context = body.context || {};
    const goal = context.goal || "Hypertrophy & Strength";
    const calories = context.calories || 2400;
    const protein = context.protein || 180;
    const split = context.split || "Push / Pull / Legs";
    const experience = context.experienceLevel || "Intermediate";

    // 3. Check for external AI Provider (OpenAI, Gemini, etc.)
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (openaiKey) {
      try {
        const systemPrompt = `You are the IRONSync Master Fitness Coach. Brand voice: Nike x Ferrari x Gymshark. Direct, elite, biomechanically rigorous, authoritative, zero fluff.
The user is currently running an active IronSync blueprint:
- Target Goal: ${goal}
- Target Calories: ${calories} kcal/day
- Target Protein: ${protein}g/day
- Training Split: ${split}
- Experience: ${experience}

Rules:
1. Provide concrete, actionable, science-based advice with sets, reps, tempo, or macro numbers where applicable.
2. Keep responses concise (under 150 words) with clear athletic bullet points.
3. Encourage discipline, high motor-unit recruitment, and adherence.`;

        const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: rawMessage },
            ],
            temperature: 0.7,
            max_tokens: 300,
          }),
        });

        if (openAiRes.ok) {
          const aiData = await openAiRes.json();
          const reply = aiData?.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({
              success: true,
              reply,
              source: "ai-llm",
              timestamp: new Date().toISOString(),
            });
          }
        }
      } catch (err) {
        console.warn("External OpenAI call failed, falling back to deterministic coach engine:", err);
      }
    }

    if (geminiKey) {
      try {
        const systemPrompt = `You are the IRONSync Master Fitness Coach. Brand voice: Nike x Ferrari x Gymshark. Direct, elite, biomechanically rigorous, authoritative, zero fluff.
User active plan: Goal: ${goal}, ${calories} kcal/day, ${protein}g protein, Split: ${split}, Experience: ${experience}. Keep answers under 150 words.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: systemPrompt },
                    { text: `User Question: ${rawMessage}` },
                  ],
                },
              ],
            }),
          }
        );

        if (geminiRes.ok) {
          const gData = await geminiRes.json();
          const reply = gData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({
              success: true,
              reply,
              source: "gemini-llm",
              timestamp: new Date().toISOString(),
            });
          }
        }
      } catch (err) {
        console.warn("External Gemini call failed, falling back to deterministic coach engine:", err);
      }
    }

    // 4. Deterministic Intelligent Rule-Based Coach Engine
    // High-performance fallback ensuring 100% reliability, zero downtime, and instant responses.
    const reply = generateDeterministicCoachAdvice(rawMessage, {
      goal,
      calories,
      protein,
      split,
      experience,
    });

    return NextResponse.json({
      success: true,
      reply,
      source: "ironsync-engine",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("IRONSync Coach API Error:", error);
    return NextResponse.json(
      { error: "Internal Coach Service failure", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * Intelligent deterministic response generator mapped to exercise science fundamentals.
 */
function generateDeterministicCoachAdvice(
  query: string,
  ctx: { goal: string; calories: number; protein: number; split: string; experience: string }
): string {
  const q = query.toLowerCase();

  // Bench Press / Chest plateau
  if (q.includes("bench") || (q.includes("chest") && (q.includes("plateau") || q.includes("stuck") || q.includes("weak")))) {
    return `### ⚡ BENCH PRESS PLATEAU PROTOCOL
To break through your current bench plateau under your **${ctx.split}** split:
1. **Implement Double Progression**: Choose a 4 × 6-8 rep range. Keep the load locked until you nail all 4 sets for 8 clean reps at RPE 8.5 before adding 2.5 kg.
2. **Arch & Leg Drive**: Retract your scapulae hard into the pad. Dig your heels backward to transfer ground reaction force directly into the bar path.
3. **Target The Weak Point**:
   - Sticking off chest? Add a 2-second pause bench at 70% 1RM.
   - Sticking at lockout? Add close-grip barbell presses (3 × 8) to overload triceps long head.`;
  }

  // Squat / Legs
  if (q.includes("squat") || q.includes("knee") || (q.includes("leg") && q.includes("form"))) {
    return `### ⚡ SQUAT BIOMECHANICS & STABILITY
For maximum quad recruitment without joint irritation:
1. **Root Your Feet**: Grip the floor using the 'tripod foot' cue (big toe, pinky toe, heel) to anchor your kinetic chain.
2. **Brace with Intra-Abdominal Pressure**: Take a diaphragmatic breath 360° into your abdominal wall before breaking hips and knees simultaneously.
3. **Depth**: Hit the crease of the hip level with or slightly below the top of the patella. If knees cave (valgus), lower the load 10% and focus on external femoral rotation.`;
  }

  // Deadlift / Back
  if (q.includes("deadlift") || q.includes("back pain") || (q.includes("lower back") && q.includes("pull"))) {
    return `### ⚡ DEADLIFT KINETIC INTEGRITY
Protect your posterior chain and maximize mechanical tension:
1. **Pull Slack First**: Never jerk the barbell off the floor. Wedge your hips in and pull the bar click against the plates before driving.
2. **Push the Floor Away**: Treat the first 4 inches of the deadlift as a leg press rather than a back pull.
3. **Engage the Lats**: Imagine bending the bar across your shins. This engages the latissimus dorsi, keeping the bar glued to your center of mass and shielding your lumbar spine.`;
  }

  // Nutrition / Calories / Deficit / Bulking
  if (q.includes("calorie") || q.includes("cut") || q.includes("bulk") || q.includes("deficit") || q.includes("surplus") || q.includes("diet")) {
    return `### ⚡ NUTRITION & ENERGY BALANCE
Based on your active **${ctx.goal}** target (**${ctx.calories} kcal/day**):
- **Protein Anchor**: Maintain **${ctx.protein}g protein daily** (~2.0-2.2g per kg of body weight) spread across 3-4 feedings to saturate Muscle Protein Synthesis (MPS).
- **Rate of Weight Change**:
  - Fat loss: Aim for 0.5% - 1.0% of body weight loss per week to spare lean muscle mass.
  - Lean bulk: Aim for +0.25% - 0.5% gain per month to avoid unnecessary adiposity.
- **Plateau Rule**: If your 7-day scale average stalls for 14 consecutive days, adjust calories by 150-200 kcal in the direction of your goal.`;
  }

  // Protein / Meals / Swapping
  if (q.includes("protein") || q.includes("shake") || q.includes("meal") || q.includes("chicken") || q.includes("food")) {
    return `### ⚡ MACRONUTRIENT ALLOCATION
Your current protocol calls for **${ctx.protein}g protein**:
1. **Distribution**: Target 35-50g of high-leucine protein per meal (chicken breast, whey isolate, lean beef, eggs, or tofu/tempeh).
2. **Timing**: Consume a meal with 30g+ protein within 90 minutes post-training to maximize muscle tissue remodeling.
3. **Substitutions**: If swapping animal for plant proteins, combine sources (e.g., peas + brown rice) to ensure a complete essential amino acid (EAA) profile.`;
  }

  // Recovery / Soreness / Sleep
  if (q.includes("sore") || q.includes("doms") || q.includes("sleep") || q.includes("recovery") || q.includes("rest day")) {
    return `### ⚡ RECOVERY & REPAIR OPTIMIZATION
Muscle growth occurs outside the gym during neurological and cellular recovery:
1. **Sleep Architecture**: 7.5 to 9 hours of quality sleep is non-negotiable. 70% of daily growth hormone pulses occur during Stage 3/4 deep slow-wave sleep.
2. **Active Recovery**: On rest days, perform 20-30 minutes of low-intensity Zone 2 cardio (120-130 BPM heart rate) to flush metabolic byproducts without incurring CNS fatigue.
3. **Hydration**: Drink 3-4 liters of water daily plus 500mg sodium pre-workout to maintain cellular hydration and muscular contractility.`;
  }

  // Workout Split / Frequency
  if (q.includes("split") || q.includes("frequency") || q.includes("routine") || q.includes("push pull legs") || q.includes("upper lower")) {
    return `### ⚡ PROGRAMMING ARCHITECTURE
Your blueprint is structured around **${ctx.split}**:
1. **Weekly Frequency**: Each major muscle group is stimulated every 48 to 72 hours, optimizing the 24-36 hour elevated MPS window.
2. **Volume Allocation**: Accumulate 10-18 hard working sets per muscle group per week taken within 1-3 Reps in Reserve (RIR).
3. **Deload Timing**: Schedule a deload every 6-8 weeks by reducing working sets by 40% while keeping load high to dissipate systemic fatigue.`;
  }

  // General Guidance / Motivation / Default
  return `### ⚡ IRONSYNC ATHLETIC PROTOCOL
Here is the tactical directive for your **${ctx.goal}** plan:
1. **Mechanical Overload**: Progressive overload is the primary driver of hypertrophy. Track every working set, weight, and repetition.
2. **Nutritional Adherence**: Hit your **${ctx.calories} kcal** and **${ctx.protein}g protein** targets with 90%+ consistency across the week.
3. **RPE Discipline**: Take every working set to an honest **RPE 8.0 - 9.0** (leaving 1 to 2 reps in reserve). Do not cheat range of motion for ego.

Stay locked in. Execution beats intention every single time.`;
}
