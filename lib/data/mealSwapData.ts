import { DietType, BudgetTier } from "../types/onboarding";
import { DayMeal, MealItem } from "../engine/mealGenerator";

export interface MealRecipe {
  ingredients: string[];
  preparation: string[];
  servingSize: string;
}

export interface SwapAlternative {
  id: string;
  name: string;
  category: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: MealItem[];
  recipe: MealRecipe;
  dietCompatibility: DietType[];
  budgetTier: BudgetTier[];
  allergens: string[]; // "dairy", "eggs", "nuts", "gluten", "seafood", "soy"
}

export const STRUCTURED_SWAP_ALTERNATIVES: SwapAlternative[] = [
  // ==========================================
  // BREAKFAST ALTERNATIVES
  // ==========================================
  {
    id: "alt-b-1",
    name: "Classic Egg White & Oats Bowl",
    category: "Breakfast",
    calories: 590,
    protein: 36,
    carbs: 68,
    fat: 14,
    items: [
      { name: "Whole Eggs & Egg Whites", portion: "2 whole + 3 whites" },
      { name: "Rolled Oats with Cinnamon", portion: "65g dry" },
      { name: "Sliced Banana", portion: "1 medium" },
    ],
    recipe: {
      servingSize: "1 Large Bowl",
      ingredients: [
        "65g Rolled oats",
        "2 Whole free-range eggs + 3 egg whites",
        "1 Medium ripe banana",
        "1 pinch Ceylon cinnamon",
        "1 tsp Olive or coconut oil for scramble",
      ],
      preparation: [
        "Bring 150ml water or milk to boil, stir in oats and simmer 4-5 minutes with cinnamon.",
        "Whisk eggs with a pinch of sea salt and pepper in a small bowl.",
        "Scramble eggs in lightly oiled pan over medium heat for 2-3 minutes.",
        "Top warm oats with sliced banana and serve alongside warm scrambled eggs.",
      ],
    },
    dietCompatibility: ["eggetarian", "non_vegetarian"],
    budgetTier: ["budget", "balanced", "flexible"],
    allergens: ["eggs", "gluten"],
  },
  {
    id: "alt-b-2",
    name: "Greek Yogurt & Berry Power Parfait",
    category: "Breakfast",
    calories: 560,
    protein: 38,
    carbs: 65,
    fat: 12,
    items: [
      { name: "0% Greek Yogurt or Hung Curd", portion: "220g" },
      { name: "Toasted Granola or Rolled Oats", portion: "60g" },
      { name: "Fresh Blueberries or Strawberries", portion: "100g" },
      { name: "Raw Honey drizzle", portion: "1 tsp" },
    ],
    recipe: {
      servingSize: "1 Tall Glass / Bowl",
      ingredients: [
        "220g Plain unsweetened Greek yogurt (or strained curd)",
        "60g Low-sugar whole grain granola or rolled oats",
        "100g Mixed fresh berries",
        "1 tsp Raw organic honey",
      ],
      preparation: [
        "Spoon half the Greek yogurt into the bottom of a chilled glass or bowl.",
        "Layer with half the rolled oats/granola and fresh berries.",
        "Add remaining yogurt, top with remaining berries, and lightly drizzle with raw honey.",
      ],
    },
    dietCompatibility: ["vegetarian", "eggetarian", "non_vegetarian"],
    budgetTier: ["balanced", "flexible"],
    allergens: ["dairy", "gluten"],
  },
  {
    id: "alt-b-3",
    name: "High-Protein Tofu & Spinach Scramble",
    category: "Breakfast",
    calories: 540,
    protein: 35,
    carbs: 58,
    fat: 16,
    items: [
      { name: "Organic Firm Tofu (Crumbled)", portion: "200g" },
      { name: "Toasted Whole Wheat Sourdough", portion: "2 slices" },
      { name: "Baby Spinach & Cherry Tomatoes", portion: "1 cup" },
      { name: "Turmeric & Nutritional Yeast", portion: "1 tbsp" },
    ],
    recipe: {
      servingSize: "1 Plate",
      ingredients: [
        "200g Organic firm tofu, pressed and crumbled",
        "2 slices Whole wheat sourdough toast",
        "1 cup Baby spinach leaves",
        "1/2 cup Halved cherry tomatoes",
        "1/2 tsp Ground turmeric, black pepper, and garlic powder",
        "1 tbsp Nutritional yeast for savory B-vitamins",
      ],
      preparation: [
        "Heat skillet with olive oil spray over medium flame.",
        "Add crumbled tofu, turmeric, black pepper, and nutritional yeast, stirring for 4 minutes until golden.",
        "Fold in baby spinach and cherry tomatoes until wilted (1-2 minutes).",
        "Serve hot alongside toasted sourdough.",
      ],
    },
    dietCompatibility: ["vegan", "vegetarian", "eggetarian", "non_vegetarian"],
    budgetTier: ["budget", "balanced", "flexible"],
    allergens: ["soy", "gluten"],
  },

  // ==========================================
  // LUNCH ALTERNATIVES
  // ==========================================
  {
    id: "alt-l-1",
    name: "Flame-Grilled Chicken & Jasmine Rice Bowl",
    category: "Lunch",
    calories: 680,
    protein: 48,
    carbs: 76,
    fat: 14,
    items: [
      { name: "Skinless Chicken Breast Fillet", portion: "190g" },
      { name: "Steamed Fragrant Jasmine Rice", portion: "180g cooked" },
      { name: "Garlic Sauteed Broccoli florets", portion: "120g" },
      { name: "Extra Virgin Olive Oil", portion: "8ml" },
    ],
    recipe: {
      servingSize: "1 Balanced Lunch Bowl",
      ingredients: [
        "190g Raw skinless boneless chicken breast",
        "70g Dry jasmine rice (yields ~180g cooked)",
        "120g Fresh broccoli florets",
        "1 clove Minced fresh garlic",
        "1 tsp Smoked paprika, oregano, sea salt, black pepper",
      ],
      preparation: [
        "Steam jasmine rice in rice cooker or saucepan with 1:1.5 water ratio for 15 minutes.",
        "Season chicken breast evenly with smoked paprika, dried oregano, salt, and pepper.",
        "Sear on preheated cast iron grill for 5-6 minutes per side until internal temp reaches 74°C (165°F).",
        "Sauté broccoli with minced garlic and olive oil for 3 minutes until vibrant green and crisp-tender.",
      ],
    },
    dietCompatibility: ["non_vegetarian"],
    budgetTier: ["budget", "balanced", "flexible"],
    allergens: [],
  },
  {
    id: "alt-l-2",
    name: "Herb-Marinated Low-Fat Paneer Tikka Rice",
    category: "Lunch",
    calories: 650,
    protein: 38,
    carbs: 72,
    fat: 18,
    items: [
      { name: "Low-Fat Cottage Cheese / Paneer", portion: "160g" },
      { name: "Steamed Brown Basmati Rice", portion: "160g cooked" },
      { name: "Yellow Moong Dal & Spinach Curry", portion: "1 bowl" },
      { name: "Cucumber & Mint Kachumber", portion: "1 cup" },
    ],
    recipe: {
      servingSize: "1 Balanced Ayurvedic Plate",
      ingredients: [
        "160g Low-fat fresh paneer, cubed",
        "60g Dry brown basmati rice",
        "1/2 cup Cooked yellow split moong dal",
        "1/2 cup Diced cucumber, red onion, tomato, and fresh mint with lime juice",
        "1 tsp Roasted cumin and garam masala",
      ],
      preparation: [
        "Toss paneer cubes with hung yogurt, roasted cumin, turmeric, and sea salt; pan-grill 4 minutes until charred.",
        "Cook brown basmati rice in lightly salted water for 25 minutes.",
        "Simmer yellow moong dal with turmeric and garlic.",
        "Plate paneer alongside warm rice, dal, and chilled fresh kachumber salad.",
      ],
    },
    dietCompatibility: ["vegetarian", "eggetarian", "non_vegetarian"],
    budgetTier: ["budget", "balanced", "flexible"],
    allergens: ["dairy"],
  },
  {
    id: "alt-l-3",
    name: "Crispy Tempeh & Spiced Chickpea Quinoa",
    category: "Lunch",
    calories: 640,
    protein: 37,
    carbs: 78,
    fat: 16,
    items: [
      { name: "Organic Cultured Tempeh", portion: "160g" },
      { name: "Cooked Tricolor Quinoa", portion: "150g" },
      { name: "Spiced Chickpeas (Garbanzo)", portion: "80g" },
      { name: "Steamed Asparagus & Bell Peppers", portion: "1 cup" },
    ],
    recipe: {
      servingSize: "1 Plant Power Bowl",
      ingredients: [
        "160g Organic tempeh sliced into thin batons",
        "50g Dry tricolor quinoa",
        "80g Cooked chickpeas",
        "1 cup Sliced bell peppers and asparagus",
        "1 tbsp Tamari (gluten-free soy sauce) & lemon juice",
      ],
      preparation: [
        "Simmer quinoa in 120ml vegetable stock for 15 minutes until fluffy.",
        "Marinate tempeh batons in tamari, smoked paprika, and garlic for 5 minutes.",
        "Pan-sear tempeh in nonstick skillet for 3 minutes each side until crisp.",
        "Warm chickpeas with roasted cumin and combine all components in an open grain bowl.",
      ],
    },
    dietCompatibility: ["vegan", "vegetarian", "eggetarian", "non_vegetarian"],
    budgetTier: ["balanced", "flexible"],
    allergens: ["soy"],
  },

  // ==========================================
  // DINNER ALTERNATIVES
  // ==========================================
  {
    id: "alt-d-1",
    name: "Herb-Baked Salmon Fillet & Sweet Potato Mash",
    category: "Dinner",
    calories: 620,
    protein: 44,
    carbs: 58,
    fat: 18,
    items: [
      { name: "Wild-Caught Salmon Fillet", portion: "170g" },
      { name: "Roasted Sweet Potato Mash", portion: "180g" },
      { name: "Steamed Asparagus & Lemon Zest", portion: "1 cup" },
    ],
    recipe: {
      servingSize: "1 Dinner Plate",
      ingredients: [
        "170g Salmon fillet (skin-on)",
        "180g Sweet potato, peeled and cubed",
        "8-10 Stalks fresh asparagus spears",
        "1 tbsp Lemon juice, fresh dill, salt, cracked black pepper",
      ],
      preparation: [
        "Preheat oven to 200°C (400°F). Season salmon with lemon juice, sea salt, pepper, and fresh dill.",
        "Boil or roast sweet potato cubes until fork-tender (15 mins), then mash with a pinch of sea salt.",
        "Bake salmon and asparagus on parchment-lined sheet for 12-14 minutes until salmon flakes easily with a fork.",
      ],
    },
    dietCompatibility: ["non_vegetarian"],
    budgetTier: ["balanced", "flexible"],
    allergens: ["seafood"],
  },
  {
    id: "alt-d-2",
    name: "Spiced Egg Bhurji & Multigrain Rotis",
    category: "Dinner",
    calories: 590,
    protein: 38,
    carbs: 62,
    fat: 16,
    items: [
      { name: "Whole Eggs + Egg Whites Bhurji", portion: "2 whole + 4 whites" },
      { name: "Fresh Multigrain Roti / Chapatis", portion: "2 medium" },
      { name: "Sauteed Green Beans & Carrots", portion: "100g" },
    ],
    recipe: {
      servingSize: "1 Dinner Plate",
      ingredients: [
        "2 Whole eggs + 4 egg whites",
        "2 Whole wheat / multigrain rotis",
        "1/2 Diced red onion, 1 green chili, 1 tomato",
        "1/2 tsp Turmeric, coriander powder, cumin seeds",
        "1 cup Steamed green beans and diced carrots",
      ],
      preparation: [
        "Sauté cumin seeds, diced onions, green chilies, and tomatoes in a skillet with olive oil spray until soft.",
        "Pour in beaten eggs with turmeric and coriander, scrambling continuously until soft curds form.",
        "Warm rotis over open flame.",
        "Serve hot bhurji with freshly made rotis and tender green beans.",
      ],
    },
    dietCompatibility: ["eggetarian", "non_vegetarian"],
    budgetTier: ["budget", "balanced", "flexible"],
    allergens: ["eggs", "gluten"],
  },
  {
    id: "alt-d-3",
    name: "Paneer & Green Peas (Matar) Curry Bowl",
    category: "Dinner",
    calories: 610,
    protein: 36,
    carbs: 64,
    fat: 18,
    items: [
      { name: "Lightly Pan-Seared Paneer", portion: "150g" },
      { name: "Green Peas in Tomato Gravy", portion: "1 cup" },
      { name: "Steamed Basmati Rice or 2 Rotis", portion: "150g" },
    ],
    recipe: {
      servingSize: "1 Dinner Bowl",
      ingredients: [
        "150g Low-fat paneer cubes",
        "1/2 cup Sweet green peas",
        "1 cup Pureed tomato, ginger, and garlic gravy",
        "150g Cooked basmati rice",
        "1 tsp Garam masala and kasuri methi (fenugreek)",
      ],
      preparation: [
        "Lightly sear paneer cubes in skillet for 2 minutes to lock in moisture.",
        "Simmer tomato-ginger-garlic gravy with spices for 8 minutes, add green peas and paneer.",
        "Finish with a pinch of crushed fenugreek leaves and serve over steamed basmati rice.",
      ],
    },
    dietCompatibility: ["vegetarian", "eggetarian", "non_vegetarian"],
    budgetTier: ["budget", "balanced", "flexible"],
    allergens: ["dairy"],
  },
  {
    id: "alt-d-4",
    name: "Hearty Lentil Shepherd's Pie with Sweet Potato",
    category: "Dinner",
    calories: 580,
    protein: 34,
    carbs: 76,
    fat: 12,
    items: [
      { name: "Simmered Brown Lentils & Vegetables", portion: "220g" },
      { name: "Mashed Sweet Potato Crust", portion: "160g" },
      { name: "Steamed Green Peas & Carrots", portion: "80g" },
    ],
    recipe: {
      servingSize: "1 Individual Casserole",
      ingredients: [
        "1 cup Cooked brown or green lentils",
        "160g Boiled mashed sweet potato",
        "1/2 cup Diced carrots, celery, and peas",
        "1/2 cup Vegetable broth with rosemary and thyme",
      ],
      preparation: [
        "Simmer lentils with diced aromatic vegetables and vegetable broth until thick and stew-like.",
        "Transfer to baking dish and spread mashed sweet potato smoothly over top.",
        "Bake at 190°C (375°F) for 15 minutes until edges are bubbling and golden.",
      ],
    },
    dietCompatibility: ["vegan", "vegetarian", "eggetarian", "non_vegetarian"],
    budgetTier: ["budget", "balanced", "flexible"],
    allergens: [],
  },

  // ==========================================
  // SNACK / PRE-POST WORKOUT ALTERNATIVES
  // ==========================================
  {
    id: "alt-s-1",
    name: "Whey Protein Shake with Banana & Almonds",
    category: "Snack",
    calories: 340,
    protein: 32,
    carbs: 38,
    fat: 7,
    items: [
      { name: "Whey Protein Isolate", portion: "1 scoop (32g)" },
      { name: "Ripe Cavendish Banana", portion: "1 medium" },
      { name: "Roasted Whole Almonds", portion: "12 nuts (15g)" },
    ],
    recipe: {
      servingSize: "1 Shaker + Handful",
      ingredients: [
        "1 scoop (32g) Whey protein isolate (chocolate or vanilla)",
        "250ml Cold filtered water or unsweetened almond milk",
        "1 Medium ripe banana",
        "15g Whole roasted almonds",
      ],
      preparation: [
        "Shake whey protein vigorously in shaker bottle with cold water or ice.",
        "Consume alongside fresh ripe banana and almonds 45-60 minutes peri-workout.",
      ],
    },
    dietCompatibility: ["vegetarian", "eggetarian", "non_vegetarian"],
    budgetTier: ["budget", "balanced", "flexible"],
    allergens: ["dairy", "nuts"],
  },
  {
    id: "alt-s-2",
    name: "Plant Protein Shake with Rice Cakes & Peanut Butter",
    category: "Snack",
    calories: 330,
    protein: 30,
    carbs: 36,
    fat: 8,
    items: [
      { name: "Pea / Brown Rice Protein Powder", portion: "1 scoop (30g)" },
      { name: "Whole Grain Brown Rice Cakes", portion: "2 cakes" },
      { name: "Natural Peanut Butter (No Added Sugar)", portion: "15g" },
    ],
    recipe: {
      servingSize: "1 Snack Plate",
      ingredients: [
        "1 scoop Plant protein powder",
        "2 Plain brown rice cakes",
        "15g Natural peanut butter",
        "250ml Cold water",
      ],
      preparation: [
        "Shake plant protein with chilled water until completely dissolved.",
        "Spread natural peanut butter evenly across crisp brown rice cakes.",
      ],
    },
    dietCompatibility: ["vegan", "vegetarian", "eggetarian", "non_vegetarian"],
    budgetTier: ["budget", "balanced", "flexible"],
    allergens: ["nuts"],
  },
  {
    id: "alt-s-3",
    name: "Hard Boiled Eggs & Whole Apple Slices",
    category: "Snack",
    calories: 310,
    protein: 24,
    carbs: 28,
    fat: 10,
    items: [
      { name: "Hard Boiled Whole Eggs", portion: "3 whole eggs" },
      { name: "Crisp Red Apple", portion: "1 medium" },
      { name: "Pinch of Black Pepper & Salt", portion: "to taste" },
    ],
    recipe: {
      servingSize: "1 Snack Plate",
      ingredients: [
        "3 Large eggs boiled to medium/firm",
        "1 Crisp apple, sliced into wedges",
        "1 pinch Coarse sea salt and cracked pepper",
      ],
      preparation: [
        "Boil eggs in bubbling water for 8-9 minutes, transfer to ice bath, and peel.",
        "Slice eggs in halves, season with black pepper, and serve with crisp apple slices.",
      ],
    },
    dietCompatibility: ["eggetarian", "non_vegetarian"],
    budgetTier: ["budget", "balanced", "flexible"],
    allergens: ["eggs"],
  },
];

export interface RankedMealSwap {
  alternative: SwapAlternative;
  calorieDelta: number;
  proteinDelta: number;
  carbsDelta: number;
  fatDelta: number;
  macroProximityScore: number;
  proximityPercentage: number;
}

/**
 * Filter swap alternatives strictly according to user's diet, allergies, and category,
 * and rank them by multi-dimensional macro proximity (calories, protein, carbs, fat).
 */
export function getMealAlternatives(
  currentMeal: DayMeal,
  userDiet: DietType,
  userBudget: BudgetTier = "balanced",
  userAllergies: string[] = []
): RankedMealSwap[] {
  // Determine meal category
  const lowerName = currentMeal.name.toLowerCase();
  let targetCategory: "Breakfast" | "Lunch" | "Dinner" | "Snack" = "Lunch";

  if (lowerName.includes("breakfast") || lowerName.includes("morning")) {
    targetCategory = "Breakfast";
  } else if (lowerName.includes("dinner") || lowerName.includes("night")) {
    targetCategory = "Dinner";
  } else if (lowerName.includes("pre") || lowerName.includes("post") || lowerName.includes("snack")) {
    targetCategory = "Snack";
  }

  const normalizedAllergies = (userAllergies || []).map((a) => a.toLowerCase().trim());

  const filtered = STRUCTURED_SWAP_ALTERNATIVES.filter((alt) => {
    // 1. Must match target category
    if (alt.category !== targetCategory) return false;

    // 2. Strict diet compatibility:
    // - vegetarian: no meat/fish
    // - eggetarian: eggs allowed, no meat/fish
    // - vegan: no meat, no eggs, no dairy
    // - non_vegetarian: standard compatibility
    if (!alt.dietCompatibility.includes(userDiet)) return false;

    // 3. Strict allergy / restriction check
    if (normalizedAllergies.length > 0) {
      const hasAllergen = alt.allergens.some((allergen) =>
        normalizedAllergies.some((userAllergy) => userAllergy.includes(allergen) || allergen.includes(userAllergy))
      );
      if (hasAllergen) return false;
    }

    // 4. Budget check: if budget-conscious, avoid strictly flexible-only
    if (userBudget === "budget" && !alt.budgetTier.includes("budget")) {
      return false;
    }

    // Don't return an exact duplicate of current meal name if matched
    if (alt.name.toLowerCase() === currentMeal.name.toLowerCase()) return false;

    return true;
  });

  // 5. Rank by multi-dimensional macro proximity
  return filtered
    .map((alt) => {
      const calDelta = alt.calories - currentMeal.calories;
      const protDelta = alt.protein - currentMeal.protein;
      const carbDelta = alt.carbs - currentMeal.carbs;
      const fatDelta = alt.fat - currentMeal.fat;

      const calDiff = Math.abs(calDelta) / Math.max(currentMeal.calories, 1);
      const protDiff = Math.abs(protDelta) / Math.max(currentMeal.protein, 1);
      const carbDiff = Math.abs(carbDelta) / Math.max(currentMeal.carbs, 1);
      const fatDiff = Math.abs(fatDelta) / Math.max(currentMeal.fat, 1);

      // Multi-macro weighted distance: Protein is 2.5x weight to ensure muscular nitrogen balance
      const macroProximityScore = (calDiff * 1.0) + (protDiff * 2.5) + (carbDiff * 1.0) + (fatDiff * 1.0);
      const proximityPercentage = Math.max(10, Math.min(99, Math.round(100 - (macroProximityScore * 25))));

      return {
        alternative: alt,
        calorieDelta: calDelta,
        proteinDelta: protDelta,
        carbsDelta: carbDelta,
        fatDelta: fatDelta,
        macroProximityScore,
        proximityPercentage,
      };
    })
    .sort((a, b) => a.macroProximityScore - b.macroProximityScore);
}

/**
 * Generates or extracts structured recipe for any DayMeal
 */
export function getMealRecipe(meal: DayMeal): MealRecipe {
  if (meal.recipe) return meal.recipe;

  return {
    servingSize: "1 Balanced Portion",
    ingredients: meal.items.map((item) => `${item.portion} ${item.name}`),
    preparation: [
      "Prepare all ingredients according to measured portions to maintain exact macronutrient timing.",
      "Lightly season with fresh herbs, salt, and black pepper; cook using zero-calorie cooking spray or healthy oils.",
      "Plate cleanly and enjoy within the scheduled timing window.",
    ],
  };
}
