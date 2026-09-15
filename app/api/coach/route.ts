import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { MEMBER_COOKIE_NAME, verifyMemberSessionToken } from "@/lib/security/memberSession";
import { getMemberById } from "@/lib/services/memberService";

interface CoachRequestBody {
  message: string;
  context?: {
    memberName?: string;
    goal?: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    split?: string;
    diet?: string;
    todayWorkout?: string;
    experienceLevel?: string;
    daysPerWeek?: number;
    weightKg?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user session: check Member Cookie FIRST, then Supabase Auth
    let memberName = "Athlete";
    let isMemberAuth = false;

    const token = request.cookies.get(MEMBER_COOKIE_NAME)?.value;
    if (token) {
      const payload = verifyMemberSessionToken(token);
      if (payload) {
        memberName = payload.fullName || "Athlete";
        isMemberAuth = true;
      }
    }

    if (!isMemberAuth) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey =
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
          memberName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin Coach";
        }
      }
    }

    // 2. Validate input
    const body = (await request.json().catch(() => ({}))) as CoachRequestBody;
    const rawMessage = body?.message?.trim();

    if (!rawMessage) {
      return NextResponse.json(
        { error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    // Length limit guardrail
    if (rawMessage.length > 600) {
      return NextResponse.json(
        { error: "Query exceeds the maximum allowable length of 600 characters." },
        { status: 400 }
      );
    }

    const context = body.context || {};
    const name = context.memberName || memberName;
    const goal = context.goal || "Hypertrophy & Strength";
    const calories = context.calories || 2400;
    const protein = context.protein || 180;
    const split = context.split || "Push / Pull / Legs";
    const diet = context.diet || "non_vegetarian";
    const todayWorkout = context.todayWorkout || "Scheduled Training Session";
    const experience = context.experienceLevel || "Intermediate";

    // 3. AI Providers: Check GEMINI_API_KEY first (matches user's curl specification), then OPENAI_API_KEY
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (geminiKey) {
      try {
        const systemPrompt = `You are the IRONSync Master Fitness Coach. Brand voice: Nike x Ferrari x Gymshark. Direct, elite, biomechanically rigorous, authoritative, zero fluff.
Active Member Profile:
- Member Name: ${name}
- Goal: ${goal}
- Caloric Target: ${calories} kcal/day
- Protein Target: ${protein}g/day
- Split: ${split}
- Diet: ${diet}
- Today's Session: ${todayWorkout}
- Experience: ${experience}

CRITICAL RULES:
1. Provide science-grounded, high-performance directives with sets, reps, or meal items.
2. Keep response strictly UNDER 180 words.
3. Use bullet points for high legibility.
4. NEVER contradict the calculated targets (${calories} kcal and ${protein}g protein).
5. If user asks for vegetarian/vegan alternatives, provide high-protein plant/dairy options without meat.
6. If user asks for exercise swaps, provide biomechanically equivalent alternatives.`;

        const geminiRes = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-goog-api-key": geminiKey,
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: `${systemPrompt}\n\nMember Inquiry: ${rawMessage}` },
                  ],
                },
              ],
              generationConfig: {
                maxOutputTokens: 350,
                temperature: 0.65,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const gData = await geminiRes.json();
          const reply = gData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply && reply.trim()) {
            return NextResponse.json({
              success: true,
              reply: reply.trim(),
              source: "gemini-llm",
              timestamp: new Date().toISOString(),
            });
          }
        } else {
          console.warn("Gemini API non-200 response:", await geminiRes.text());
        }
      } catch (err) {
        console.warn("Gemini call exception, falling back to deterministic coach engine:", err);
      }
    }

    if (openaiKey) {
      try {
        const systemPrompt = `You are the IRONSync Master Fitness Coach. Brand voice: Nike x Ferrari x Gymshark. Direct, elite, authoritative, zero fluff.
Member: ${name} | Goal: ${goal} | ${calories} kcal | ${protein}g protein | Split: ${split} | Diet: ${diet} | Today: ${todayWorkout}.
Rules: Under 180 words, bullet points, respect calculated macros strictly.`;

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
          if (reply && reply.trim()) {
            return NextResponse.json({
              success: true,
              reply: reply.trim(),
              source: "openai-llm",
              timestamp: new Date().toISOString(),
            });
          }
        }
      } catch (err) {
        console.warn("OpenAI call exception, falling back to deterministic coach engine:", err);
      }
    }

    // 4. Deterministic Intelligent Rule-Based Sports Science Engine
    // 100% reliable fallback: instant responses, zero spinners, zero 500 error, never sends pin_hash
    const reply = generateDeterministicCoachAdvice(rawMessage, {
      name,
      goal,
      calories,
      protein,
      split,
      diet,
      todayWorkout,
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
 * Intelligent deterministic sports-science advice generator.
 * Strictly formatted under 180 words in clean athletic bullets.
 */
function generateDeterministicCoachAdvice(
  query: string,
  ctx: {
    name: string;
    goal: string;
    calories: number;
    protein: number;
    split: string;
    diet: string;
    todayWorkout: string;
    experience: string;
  }
): string {
  const q = query.toLowerCase();

  // 1. Exercise Swap / Alternative
  if (q.includes("swap") || q.includes("substitute") || q.includes("replace") || q.includes("alternative")) {
    return `### ⚡ TACTICAL MOVEMENT SWAP PROTOCOL
For your **${ctx.todayWorkout}** under the **${ctx.split}** split:
- **Bench / Chest Press**: Swap with Dumbbell Flat Bench or Weighted Dips for equal mechanical tension with improved glenohumeral freedom.
- **Squat Variations**: If back squats irritate lower back, substitute with Dumbbell Bulgarian Split Squats or Hack Squats (same quad hypertrophy, reduced spinal load).
- **Deadlift / Back Pull**: Swap conventional deadlift for Chest-Supported T-Bar Rows or Romanian Deadlifts (RDLs).
- **Overhead Press**: Substitute barbell press with Seated Dumbbell Press (45° angle) to protect the rotator cuff.`;
  }

  // 2. Easier Variation / Regression / Joint Pain
  if (q.includes("easier") || q.includes("variation") || q.includes("pain") || q.includes("injury") || q.includes("regression") || q.includes("too heavy")) {
    return `### ⚡ BIOMECHANICAL REGRESSION DIRECTIVES
Maintain muscular tension while reducing joint shear stress:
- **Push-Ups / Bench**: Regress to Incline Push-Ups on an elevated bench or Cable Chest Press with neutral hand grip.
- **Pull-Ups**: Regress to Lat Pulldowns (strict 3-second eccentric) or Inverted Rows using an Olympic bar.
- **Squats**: Regress to Goblet Squats with a heel wedge to maximize quad engagement without spinal flexion.
- **RPE Guideline**: Drop working load by 15-20% and focus on a strict **3-1-1-0 tempo** (3s down, 1s pause, explosive drive).`;
  }

  // 3. Vegetarian / Vegan Dinner or High-Protein Meal
  if (q.includes("veg") || q.includes("dinner") || q.includes("vegetarian") || q.includes("plant") || q.includes("paneer") || q.includes("tofu")) {
    return `### ⚡ HIGH-PROTEIN VEGETARIAN PROTOCOL
To hit your **${ctx.protein}g daily protein** within your **${ctx.calories} kcal** target:
- **Dinner Blueprint (38g Protein &bull; ~520 kcal)**:
  - 180g Low-Fat Grilled Paneer or Pan-Seared Tofu
  - 150g Cooked Quinoa or 2 Whole Wheat Rotis
  - 1 bowl Spiced Yellow Moong Dal with sautéed spinach
- **Protein Boosters**: Add 20g hemp seeds or a scoop of soy/pea protein isolate post-dinner if protein is lagging.
- **Satiety Cue**: Drink 500ml water 15 minutes before dinner to prevent over-eating late carbohydrates.`;
  }

  // 4. Post-Workout / Pre-Workout Meal Timing
  if (q.includes("post-workout") || q.includes("pre-workout") || q.includes("timing") || q.includes("shake") || q.includes("fuel")) {
    return `### ⚡ NUTRIENT TIMING DIRECTIVE
Optimized for your **${ctx.calories} kcal** daily target:
- **Pre-Training (60–90m before)**: 30-40g complex carbs + 20g lean protein (e.g. oatmeal with scoop of whey/soy protein, or bananas + rice cakes).
- **Post-Training Window (within 60m)**:
  - 30-40g high-leucine protein to trigger Muscle Protein Synthesis (MPS).
  - 40-50g fast-digesting carbohydrates to restore glycogen and blunt cortisol.
- **Hydration**: Consume 500ml water with 300mg sodium right after training for rapid intramuscular rehydration.`;
  }

  // 5. Bench Press / Chest plateau
  if (q.includes("bench") || q.includes("chest")) {
    return `### ⚡ BENCH PRESS OVERLOAD PROTOCOL
Break through plateaus in your **${ctx.split}** program:
- **Double Progression**: Stick to 4 × 6-8 reps. Lock weight until all 4 sets hit 8 clean reps at RPE 8.5 before incrementing load.
- **Scapular Panning**: Pin shoulder blades hard into the bench pad; drive heels into the floor for kinetic leg drive.
- **Pause Work**: Incorporate a 1.5-second pause at chest height on set 1 & 2 to build explosive turn-around power.`;
  }

  // 6. Squats & Legs
  if (q.includes("squat") || q.includes("knee") || q.includes("leg")) {
    return `### ⚡ SQUAT MECHANICS DIRECTIVE
Maximize quad hypertrophy with zero knee discomfort:
- **Tripod Foot Base**: Distribute pressure across heel, big toe, and pinky toe.
- **Abdominal Brace**: Inhale 360° diaphragmatic air into your belt line before initiating hip crease break.
- **Femoral Alignment**: Drive knees out in line with 2nd toe to eliminate valgus collapse.`;
  }

  // 7. Deadlift & Back
  if (q.includes("deadlift") || q.includes("back")) {
    return `### ⚡ POSTERIOR CHAIN INTEGRITY
Deadlift cues for maximum lat engagement:
- **Pull Slack First**: Wedge hips in until barbell clicks against plates before floor drive.
- **Floor Push**: Initiate drive by pressing the floor away rather than pulling with upper lumbar spine.
- **Lat Lock**: Rotate elbows backward to lock the latissimus dorsi, keeping the bar path glued to shins.`;
  }

  // 8. Calories / Cutting / Bulking / Fat Loss
  if (q.includes("calorie") || q.includes("cut") || q.includes("bulk") || q.includes("fat loss") || q.includes("deficit") || q.includes("surplus") || q.includes("diet")) {
    return `### ⚡ ENERGY BALANCE DIRECTIVE
Configured for your active **${ctx.goal}** blueprint:
- **Calorie Anchor**: Adhere to **${ctx.calories} kcal/day** with weekly compliance >90%.
- **Protein Anchor**: Hit **${ctx.protein}g protein daily** to spare lean mass during caloric deficits.
- **Scale Trend**: Track 7-day rolling weight averages. Adjust calories by 150 kcal only if scale stalls for 14 consecutive days.`;
  }

  // 9. Recovery / Sleep / Soreness
  if (q.includes("sore") || q.includes("recovery") || q.includes("sleep") || q.includes("doms")) {
    return `### ⚡ RECOVERY PROTOCOL
Muscle adaptation occurs outside the gym:
- **Sleep Target**: 7.5–9.0 hours of sleep is mandatory; 70% of growth hormone is secreted during slow-wave Stage 3/4 sleep.
- **Active Reset**: On rest days, perform 20 minutes of Zone 2 cardio (120-130 BPM) to clear cellular waste.
- **Daily Water**: Target 3.5–4.0 liters with adequate dietary electrolytes.`;
  }

  // 10. Default Athletic Guidance
  return `### ⚡ IRONSYNC COACH DIRECTIVE
Protocol for **${ctx.name}** &bull; **${ctx.goal}**:
- **Today's Session**: Focus on **${ctx.todayWorkout}** under your **${ctx.split}** split.
- **Target Fuel**: Hit **${ctx.calories} kcal** and **${ctx.protein}g protein** without compromise.
- **RPE Discipline**: Take working sets to **RPE 8.0 - 9.0** (1 to 2 reps in reserve).
- **Execution Over Intent**: Log every working set in the workout tracker to enforce progressive overload.`;
}
