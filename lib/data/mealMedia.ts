export interface MealMediaItem {
  id: string;
  name: string;
  category: "Breakfast" | "Lunch" | "Dinner" | "Snack" | "Pre-Workout";
  dietTier: "Vegetarian" | "Eggetarian" | "Non-Vegetarian" | "Vegan";
  imageUrl: string;
  thumbnailUrl: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  ingredients: Array<{ item: string; amount: string }>;
  cookingSteps: string[];
}

export const MEAL_MEDIA_MAP: Record<string, MealMediaItem> = {
  "paneer bowl": {
    id: "paneer-bowl",
    name: "Spiced Paneer Quinoa Fitness Bowl",
    category: "Lunch",
    dietTier: "Vegetarian",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop",
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 1,
    calories: 580,
    proteinGrams: 34,
    carbsGrams: 52,
    fatGrams: 24,
    ingredients: [
      { item: "Low-fat paneer (diced)", amount: "200g" },
      { item: "Cooked white or brown basmati rice", amount: "150g" },
      { item: "Sautéed bell peppers & onions", amount: "1 cup" },
      { item: "Cold-pressed olive oil", amount: "1 tsp" },
      { item: "Garam masala, cumin, turmeric & sea salt", amount: "To taste" },
    ],
    cookingSteps: [
      "Dice paneer into 1-inch cubes and dust with turmeric, cumin, and sea salt.",
      "Heat olive oil in a non-stick skillet over medium-high heat. Sear paneer cubes for 2–3 minutes per side until golden.",
      "Toss in bell peppers and onions; flash fry for 2 minutes to retain crunch.",
      "Layer warm basmati rice into your bowl, top with golden paneer and vegetables, and squeeze fresh lime juice over top.",
    ],
  },
  "chicken bowl": {
    id: "chicken-bowl",
    name: "Grilled Chicken Herb & Rice Bowl",
    category: "Lunch",
    dietTier: "Non-Vegetarian",
    imageUrl: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=400&auto=format&fit=crop",
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    servings: 1,
    calories: 620,
    proteinGrams: 48,
    carbsGrams: 64,
    fatGrams: 14,
    ingredients: [
      { item: "Skinless boneless chicken breast", amount: "220g" },
      { item: "Cooked fragrant jasmine or basmati rice", amount: "180g" },
      { item: "Steamed broccoli florets", amount: "1 cup" },
      { item: "Crushed garlic & smoked paprika", amount: "1 tsp each" },
      { item: "Extra virgin olive oil", amount: "1 tsp" },
    ],
    cookingSteps: [
      "Score chicken breast lightly and marinate with garlic, smoked paprika, black pepper, and olive oil for 10 minutes.",
      "Sear on a preheated cast iron grill for 6–7 minutes per side until internal temperature reaches 165°F (74°C).",
      "Rest chicken for 5 minutes before carving into tender strips against the grain.",
      "Plate with fluffy rice and steamed broccoli. Drizzle with pan reduction.",
    ],
  },
  "tofu bowl": {
    id: "tofu-bowl",
    name: "Crispy Sesame Tofu & Edamame Bowl",
    category: "Lunch",
    dietTier: "Vegan",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop",
    prepTimeMinutes: 10,
    cookTimeMinutes: 12,
    servings: 1,
    calories: 520,
    proteinGrams: 32,
    carbsGrams: 58,
    fatGrams: 16,
    ingredients: [
      { item: "Extra-firm tofu (pressed & cubed)", amount: "220g" },
      { item: "Steamed edamame beans", amount: "1/2 cup" },
      { item: "Quinoa or brown rice", amount: "150g" },
      { item: "Low sodium tamari / soy sauce", amount: "1 tbsp" },
      { item: "Toasted sesame oil & seeds", amount: "1 tsp" },
    ],
    cookingSteps: [
      "Press tofu thoroughly to remove excess moisture and cut into cubes.",
      "Toss cubes in tamari and cornstarch for extra crispness.",
      "Pan-fry in sesame oil over medium heat until all sides are golden crisp.",
      "Serve warm over quinoa with steamed edamame and a sprinkle of toasted sesame seeds.",
    ],
  },
  "oats breakfast": {
    id: "oats-breakfast",
    name: "Whey Protein Power Oats with Berries",
    category: "Breakfast",
    dietTier: "Vegetarian",
    imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=400&auto=format&fit=crop",
    prepTimeMinutes: 5,
    cookTimeMinutes: 5,
    servings: 1,
    calories: 460,
    proteinGrams: 36,
    carbsGrams: 58,
    fatGrams: 10,
    ingredients: [
      { item: "Rolled oats", amount: "70g" },
      { item: "Whey Protein Isolate (Vanilla / Choc)", amount: "1 scoop (30g)" },
      { item: "Almond milk or water", amount: "250ml" },
      { item: "Fresh blueberries or banana slices", amount: "1/2 cup" },
      { item: "Chia seeds or crushed almonds", amount: "1 tbsp" },
    ],
    cookingSteps: [
      "Simmer rolled oats in almond milk over medium heat for 4–5 minutes until thick and creamy.",
      "Remove from direct heat and let cool for 60 seconds (prevents whey protein from clumping).",
      "Stir in protein powder vigorously until velvety smooth.",
      "Garnish with fresh blueberries and chia seeds.",
    ],
  },
  "egg breakfast": {
    id: "egg-breakfast",
    name: "Whole Egg & White Scramble with Sourdough",
    category: "Breakfast",
    dietTier: "Eggetarian",
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400&auto=format&fit=crop",
    prepTimeMinutes: 5,
    cookTimeMinutes: 6,
    servings: 1,
    calories: 490,
    proteinGrams: 35,
    carbsGrams: 42,
    fatGrams: 18,
    ingredients: [
      { item: "Whole pasture-raised eggs", amount: "2 whole" },
      { item: "Liquid egg whites", amount: "150ml (approx 4 whites)" },
      { item: "Artisan sourdough toast", amount: "2 slices (70g)" },
      { item: "Baby spinach & cherry tomatoes", amount: "1 cup" },
      { item: "Grass-fed butter or olive oil", amount: "1 tsp" },
    ],
    cookingSteps: [
      "Whisk whole eggs and egg whites together with cracked black pepper and Himalayan pink salt.",
      "Melt butter in skillet over low-medium heat; pour in egg mixture.",
      "Gently fold curds with a silicone spatula for soft, pillowy scramble texture.",
      "Toast sourdough until crisp and serve eggs hot alongside wilted spinach.",
    ],
  },
  "soya meal": {
    id: "soya-meal",
    name: "High-Protein Soya Chunks Curry Bowl",
    category: "Dinner",
    dietTier: "Vegan",
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=400&auto=format&fit=crop",
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 1,
    calories: 510,
    proteinGrams: 44,
    carbsGrams: 56,
    fatGrams: 9,
    ingredients: [
      { item: "Defatted soya chunks (boiled & squeezed)", amount: "70g dry (yields ~200g)" },
      { item: "Tomato-onion gravy base", amount: "1 cup" },
      { item: "Steamed rice or 2 whole wheat rotis", amount: "150g" },
      { item: "Ginger-garlic paste & Indian spices", amount: "1 tbsp" },
      { item: "Coriander leaves for garnish", amount: "Handful" },
    ],
    cookingSteps: [
      "Boil soya chunks in salted water for 5 minutes, rinse in cold water, and squeeze completely dry.",
      "Sauté ginger, garlic, onions, and ground spices in a drop of oil until aromatic.",
      "Add tomato puree and simmer until gravy thickens; fold in squeezed soya chunks to absorb flavor.",
      "Simmer for 5 minutes on low heat and serve hot with steamed basmati rice.",
    ],
  },
  "smoothie": {
    id: "smoothie",
    name: "Anabolic Berry & Peanut Butter Shake",
    category: "Snack",
    dietTier: "Vegetarian",
    imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=400&auto=format&fit=crop",
    prepTimeMinutes: 4,
    cookTimeMinutes: 0,
    servings: 1,
    calories: 430,
    proteinGrams: 38,
    carbsGrams: 44,
    fatGrams: 12,
    ingredients: [
      { item: "Whey or Plant Protein Isolate", amount: "1.5 scoops (40g)" },
      { item: "Frozen mixed berries", amount: "1 cup (140g)" },
      { item: "Natural creamy peanut butter", amount: "1 tbsp (16g)" },
      { item: "Unsweetened almond milk", amount: "300ml" },
      { item: "Ice cubes", amount: "4-5 cubes" },
    ],
    cookingSteps: [
      "Add almond milk first to the blender base to prevent protein powder from sticking.",
      "Add frozen berries, peanut butter, and protein powder.",
      "Blend on high for 45–60 seconds until thick, silky, and frost-like.",
      "Pour into an insulated shaker and consume post-workout or as an afternoon fuel stop.",
    ],
  },
  "salad": {
    id: "salad",
    name: "High-Protein Mediterranean Power Salad",
    category: "Dinner",
    dietTier: "Vegetarian",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop",
    prepTimeMinutes: 8,
    cookTimeMinutes: 0,
    servings: 1,
    calories: 410,
    proteinGrams: 30,
    carbsGrams: 36,
    fatGrams: 15,
    ingredients: [
      { item: "Grilled chicken or grilled paneer/tofu", amount: "160g" },
      { item: "Mixed dark greens (spinach, arugula)", amount: "3 cups" },
      { item: "Chickpeas (rinsed)", amount: "1/2 cup" },
      { item: "Cucumber, cherry tomatoes, kalamata olives", amount: "1 cup" },
      { item: "Lemon vinaigrette dressing", amount: "1.5 tbsp" },
    ],
    cookingSteps: [
      "Wash and spin dry mixed greens thoroughly.",
      "Toss with diced cucumbers, cherry tomatoes, olives, and chickpeas in a large mixing bowl.",
      "Drizzle lemon vinaigrette and toss lightly to coat every leaf.",
      "Top with warm sliced grilled protein of choice and cracked black pepper.",
    ],
  },
};

export function getMealMedia(mealName: string, dietHint?: string): MealMediaItem {
  const normalized = mealName.toLowerCase().trim();

  // Direct key check
  for (const [key, item] of Object.entries(MEAL_MEDIA_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return item;
    }
  }

  // Keyword check
  if (/chicken|turkey|meat|fish|tuna|salmon/i.test(normalized)) return MEAL_MEDIA_MAP["chicken bowl"];
  if (/egg|omelet|scramble/i.test(normalized)) return MEAL_MEDIA_MAP["egg breakfast"];
  if (/oats|oatmeal|porridge/i.test(normalized)) return MEAL_MEDIA_MAP["oats breakfast"];
  if (/tofu|edamame/i.test(normalized)) return MEAL_MEDIA_MAP["tofu bowl"];
  if (/soya|soy|curry/i.test(normalized)) return MEAL_MEDIA_MAP["soya meal"];
  if (/shake|smoothie|drink/i.test(normalized)) return MEAL_MEDIA_MAP["smoothie"];
  if (/salad|greens|bowl/i.test(normalized)) return MEAL_MEDIA_MAP["salad"];
  if (/paneer|cottage cheese/i.test(normalized)) return MEAL_MEDIA_MAP["paneer bowl"];

  // Diet tier fallback
  if (dietHint?.toLowerCase().includes("non_veg")) return MEAL_MEDIA_MAP["chicken bowl"];
  if (dietHint?.toLowerCase().includes("egg")) return MEAL_MEDIA_MAP["egg breakfast"];
  if (dietHint?.toLowerCase().includes("vegan")) return MEAL_MEDIA_MAP["tofu bowl"];

  return MEAL_MEDIA_MAP["paneer bowl"];
}
