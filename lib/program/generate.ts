import { FOODS, foodById } from "./foods";
import { TRAINING_EXERCISES, trainingExercise } from "./exercises";
import {
  dateInZone,
  preferencesSchema,
  type Meal,
  type Nutrients,
  type Preferences,
  type Program,
  type ProgramDay,
  type Prescription,
} from "./types";

const round = (value: number) => Math.round(value * 10) / 10;
export function mealTotals(ingredients: Meal["ingredients"]): Nutrients {
  const total = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  for (const item of ingredients) {
    const food = foodById(item.foodId);
    if (!food) throw new Error("Unknown food in meal");
    for (const key of Object.keys(total) as (keyof Nutrients)[])
      total[key] += (food.per100g[key] * item.grams) / 100;
  }
  return {
    calories: Math.round(total.calories),
    protein: round(total.protein),
    carbs: round(total.carbs),
    fat: round(total.fat),
  };
}
export function dailyTotals(meals: Meal[]): Nutrients {
  return meals.reduce(
    (sum, meal) => ({
      calories: sum.calories + meal.totals.calories,
      protein: round(sum.protein + meal.totals.protein),
      carbs: round(sum.carbs + meal.totals.carbs),
      fat: round(sum.fat + meal.totals.fat),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

function nutrition(p: Preferences): Program["nutrition"] {
  const notes = [
    "Food amounts use the preparation state shown. Calories and macros come from USDA FoodData Central per-100g records; brands and cooking methods vary.",
    "These are suggested portions, not a record of food you ate. The listed oil is included; extra oils, sauces and drinks are not.",
    "This starter menu covers calories and macronutrients, not a complete micronutrient assessment. Use variety and review individual needs with a dietitian.",
  ];
  if (p.needsProfessionalGuidance || p.allergies.includes("other"))
    return {
      targetCalories: null,
      proteinGuide: null,
      days: [],
      notes,
      unavailable:
        "A personal diet plan needs a dietitian's input for your restrictions. Your training log and calendar remain available.",
    };
  const bmi = p.weightKg / (p.heightCm / 100) ** 2;
  const bmr =
    10 * p.weightKg +
    6.25 * p.heightCm -
    5 * p.age +
    (p.sex === "male" ? 5 : -161);
  const activity = { seated: 1.35, mixed: 1.55, active: 1.75 }[p.activity];
  const adjustment =
    p.goal === "fat_loss" && bmi >= 18.5
      ? 0.9
      : p.goal === "muscle_gain"
        ? 1.05
        : 1;
  const rawTarget = Math.round((bmr * activity * adjustment) / 50) * 50;
  const targetCalories =
    p.sex === "skip"
      ? null
      : Math.min(3300, Math.max(p.sex === "female" ? 1500 : 1800, rawTarget));
  const proteinGuide = Math.round(
    p.weightKg * (p.goal === "general" ? 1.2 : 1.6),
  );
  if (p.sex === "skip")
    notes.push(
      "Calorie estimation is off. This menu uses standard starting portions; it is not a calculated energy prescription.",
    );
  else
    notes.push(
      "Energy uses the Mifflin–St Jeor estimate and your daily activity. Goal adjustments and portion limits are app starting rules, not measured needs; review your trend and adjust with professional advice.",
    );
  if (bmi < 18.5 && p.goal === "fat_loss")
    notes.push(
      "A weight-loss deficit was not applied because your entered measurements fall below the adult healthy BMI range. Discuss weight goals with a clinician.",
    );
  if (targetCalories !== null && rawTarget !== targetCalories)
    notes.push(
      "Your estimate is outside this app's starting range. Portions are limited; arrange an individual nutrition review.",
    );
  const allowed = (id: string) => {
    const f = foodById(id)!;
    return (
      f.diets.includes(p.diet) &&
      !f.allergens.some((a) =>
        p.allergies.includes(a as Preferences["allergies"][number]),
      )
    );
  };
  const proteinIds = [
    "chicken",
    "eggs",
    "tofu",
    "yogurt",
    "lentils",
    "chickpeas",
  ].filter(allowed);
  if (!proteinIds.length)
    return {
      targetCalories,
      proteinGuide,
      days: [],
      notes,
      unavailable:
        "This food catalog cannot make a balanced menu with your exclusions. Review the restrictions with a dietitian; we will not substitute an excluded food.",
    };
  const make = (
    name: string,
    items: [string, number][],
    preparation: string,
  ): Meal => ({
    name,
    ingredients: items
      .filter(([id]) => allowed(id))
      .map(([foodId, grams]) => ({ foodId, grams })),
    totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    preparation,
  });
  const days = Array.from({ length: 7 }, (_, weekday) => {
    const lean = proteinIds.filter((id) =>
      ["chicken", "eggs", "tofu"].includes(id),
    );
    const mainProtein = (lean.length ? lean : proteinIds)[
      weekday % (lean.length || proteinIds.length)
    ];
    const pulse =
      (weekday % 2 === 0
        ? ["lentils", "chickpeas"]
        : ["chickpeas", "lentils"]
      ).find(allowed) || mainProtein;
    const breakfastProtein = ["yogurt", "eggs", "tofu", ...proteinIds].find(
      allowed,
    )!;
    const fruit = ["banana", "apple", "orange"][weekday % 3];
    const vegetable = ["broccoli", "carrots", "spinach"][weekday % 3];
    const grain = weekday % 2 ? "brown-rice" : "rice";
    const dinnerStarch =
      weekday % 3 === 0 && allowed("wholewheat")
        ? "wholewheat"
        : weekday % 3 === 1
          ? "potato"
          : grain;
    const meals = [
      make(
        "Breakfast",
        [
          [
            allowed("oat-bran") ? "oat-bran" : "rice",
            allowed("oat-bran") ? 65 : 220,
          ],
          [fruit, 150],
          [breakfastProtein, breakfastProtein === "eggs" ? 150 : 220],
        ],
        "Cook the oat bran with water following the pack instructions, or use cooked rice. Serve fruit separately. Use the protein food prepared as listed; cook eggs thoroughly.",
      ),
      make(
        "Lunch",
        [
          [grain, 230],
          [mainProtein, mainProtein === "eggs" ? 150 : 220],
          [vegetable, 180],
          ["olive-oil", 15],
        ],
        "Serve warm rice, protein and boiled vegetables. Cook chicken thoroughly; weigh tofu before cooking it. Use the measured oil for cooking or dressing; it is included in the totals.",
      ),
      make(
        "Dinner",
        [
          [
            dinnerStarch,
            dinnerStarch === "wholewheat"
              ? 80
              : dinnerStarch === "potato"
                ? 300
                : 220,
          ],
          [pulse, 250],
          [["spinach", "broccoli", "carrots"][weekday % 3], 180],
          ["olive-oil", 15],
        ],
        "If flour is listed, weigh it dry and make roti with water; cook fully without extra oil. Otherwise use the listed cooked starch. Serve with the protein and vegetables, using only the measured oil. Herbs, water and salt to taste are optional.",
      ),
    ];
    if (p.meals === 4)
      meals.push(
        make(
          "Snack",
          [
            [["orange", "banana", "apple"][weekday % 3], 150],
            [
              ["yogurt", "chickpeas", "tofu", ...proteinIds].find(allowed)!,
              150,
            ],
          ],
          "Serve the fruit with the listed protein food. Follow its preparation state and package handling instructions.",
        ),
      );
    const baseCalories = meals.reduce(
      (sum, meal) => sum + mealTotals(meal.ingredients).calories,
      0,
    );
    const factor = targetCalories
      ? Math.min(1.8, Math.max(0.65, targetCalories / baseCalories))
      : 1;
    for (const meal of meals) {
      meal.ingredients = meal.ingredients.map((item) => ({
        ...item,
        grams:
          item.foodId === "olive-oil"
            ? Math.round(item.grams * factor)
            : Math.round((item.grams * factor) / 5) * 5,
      }));
      meal.totals = mealTotals(meal.ingredients);
    }
    return { weekday, meals, totals: dailyTotals(meals) };
  });
  return { targetCalories, proteinGuide, days, notes, unavailable: null };
}

export function generateProgram(input: Preferences, now = new Date()): Program {
  const p = preferencesSchema.parse(input);
  const available = TRAINING_EXERCISES.filter(
    (e) =>
      e.equipment.every((item) => p.equipment.includes(item)) &&
      (p.experience !== "beginner" || e.level === "beginner"),
  );
  const choose = (ids: string[]) =>
    ids.find((id) => available.some((e) => e.id === id));
  const push = choose([
    ...(p.goal === "strength" ? ["barbell-bench-press"] : []),
    "flat-dumbbell-press",
    "dumbbell-floor-press",
    "pushup-standard",
  ]);
  const squat = choose([
    "sled-leg-press",
    "dumbbell-squat",
    "bodyweight-squat",
  ]);
  const row = choose(["seated-cable-row", "dumbbell-bent-over-row"]);
  const pull = choose([
    "wide-grip-lat-pulldown",
    "dumbbell-bent-over-row",
    "seated-cable-row",
  ]);
  const hinge = choose(["romanian-deadlift", "glute-bridge"]);
  const shoulder = choose(["seated-dumbbell-press", "dumbbell-lateral-raise"]);
  const arm = choose(["standing-dumbbell-curl", "cable-triceps-pushdown"]);
  const full = [
    squat,
    push,
    row || "superman",
    hinge,
    "plank-standard",
    shoulder,
    arm,
  ];
  const upper = [
    push,
    row || "superman",
    shoulder,
    pull,
    arm,
    "plank-standard",
  ];
  const lower = [squat, hinge, "glute-bridge", "plank-standard"];
  const sortedDays = [...p.trainingDays].sort((a, b) => (a || 7) - (b || 7));
  const beginner = p.experience === "beginner";
  const split = sortedDays.length >= 4 && p.equipment.length > 0;
  const rationale = [
    `${beginner ? "Start with controlled repetitions and light loads" : "Choose loads that leave around two good repetitions in reserve"}. Increase gradually when every set feels controlled.`,
    `${p.duration}-minute sessions include a 5-minute warm-up. The suggested duration is approximate; take extra rest when needed.`,
    "The plan uses your goal, experience, available equipment and chosen days. It is a starting routine, not a trainer's individual assessment.",
  ];
  if (!row)
    rationale.push(
      "Without weights or a cable station, this plan has limited pulling work. A resistance option or gym access can add back-training variety.",
    );
  if (!split && sortedDays.some((day) => sortedDays.includes((day + 1) % 7)))
    rationale.push(
      "Some full-body days are consecutive. Move a day to allow recovery, or keep the second session light.",
    );
  const prescription = (id: string): Prescription => {
    const e = trainingExercise(id)!;
    const strength =
      p.goal === "strength" &&
      !beginner &&
      !["core", "arms", "shoulders"].includes(e.pattern);
    return {
      exerciseId: id,
      sets: beginner || p.duration === 30 ? 2 : 3,
      target:
        e.measure === "seconds"
          ? "20–30 sec"
          : strength
            ? "6–8 reps"
            : "8–12 reps",
      restSeconds: strength ? 150 : 90,
    };
  };
  const schedule: ProgramDay[] = Array.from({ length: 7 }, (_, weekday) => {
    const index = sortedDays.indexOf(weekday);
    if (index < 0 || p.needsProfessionalGuidance)
      return {
        weekday,
        title: "Rest & recover",
        kind: "rest",
        exercises: [],
        minutes: 0,
      };
    const fifth = sortedDays.length === 5 && index === 4;
    const ids =
      split && !fifth
        ? index % 2 === 0
          ? upper
          : lower
        : index % 2 === 0
          ? full
          : [
              squat,
              push,
              pull || "superman",
              hinge,
              "plank-standard",
              arm,
              shoulder,
            ];
    const unique = Array.from(
      new Set(ids.filter((id): id is string => Boolean(id))),
    );
    return {
      weekday,
      title:
        split && !fifth
          ? index % 2 === 0
            ? "Upper body"
            : "Lower body"
          : `Full body ${index % 2 === 0 ? "A" : "B"}`,
      kind: "training",
      exercises: unique
        .slice(0, p.duration === 30 ? 4 : p.duration === 45 ? 5 : 6)
        .map(prescription),
      minutes: p.duration,
    };
  });
  if (p.needsProfessionalGuidance)
    rationale.unshift(
      "Automatic exercise selection is paused because you indicated that you need professional guidance. You can still record a clinician- or trainer-approved workout.",
    );
  return {
    version: 1,
    preferences: p,
    createdAt: now.toISOString(),
    startsOn: dateInZone(now, p.timeZone),
    title: split ? "Upper / lower plan" : "Full-body plan",
    schedule,
    rationale,
    nutrition: nutrition(p),
  };
}
