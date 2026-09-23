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
  hindiName?: string; // Maintained for backward compatibility, holds English subtitle
  subtitle?: string;
  keyBenefits?: string;
  timingAdvice?: string;
  isVeg?: boolean;
}

export interface FoodItemMedia {
  name: string;
  hindiName: string; // Maintained for backward compatibility, holds English subtitle
  subtitle?: string;
  imageUrl: string;
  benefit: string;
  portionTip: string;
  category: "Protein" | "Carbs" | "Healthy Fats" | "Vitamins & Fiber";
  isVeg: boolean;
}

export const MEAL_MEDIA_MAP: Record<string, MealMediaItem> = {
  "paneer bowl": {
    id: "paneer-bowl",
    name: "Spiced Paneer Quinoa & Rice Fitness Bowl",
    hindiName: "Cottage Cheese, Quinoa & Basmati Bowl",
    subtitle: "Cottage Cheese, Quinoa & Basmati Bowl",
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
    isVeg: true,
    keyBenefits: "Slow-digesting casein protein • Sustained amino acid release for recovery",
    timingAdvice: "Consume between 1:00 PM and 2:00 PM • Best paired with water or buttermilk",
    ingredients: [
      { item: "Low-fat paneer (diced)", amount: "200g (approx 1 bowl)" },
      { item: "Cooked white or brown basmati rice", amount: "150g (1 standard bowl)" },
      { item: "Sautéed bell peppers & onions", amount: "1 cup" },
      { item: "Cold-pressed olive oil", amount: "1 tsp" },
      { item: "Cumin, turmeric & pink salt", amount: "To taste" },
    ],
    cookingSteps: [
      "Dice low-fat paneer into 1-inch cubes and season lightly with turmeric, cumin, and sea salt.",
      "Heat 1 teaspoon of olive oil in a non-stick skillet. Sear paneer cubes for 2–3 minutes until lightly golden.",
      "Toss diced bell peppers and onions in the pan for 2 minutes to retain crisp texture.",
      "Assemble warm basmati rice in a bowl, top with seared paneer and vegetables, and garnish with fresh lime juice.",
    ],
  },
  "chicken bowl": {
    id: "chicken-bowl",
    name: "Grilled Herb Chicken & Steamed Rice Bowl",
    hindiName: "Lean Grilled Chicken Breast & Fragrant Rice",
    subtitle: "Lean Grilled Chicken Breast & Fragrant Rice",
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
    isVeg: false,
    keyBenefits: "Ultra-lean high-density protein • Zero excess fat • Rapid muscle repair",
    timingAdvice: "Ideal as midday power fuel • Pair with fresh fibrous green salad",
    ingredients: [
      { item: "Skinless boneless chicken breast", amount: "200g (1 palm-sized fillet)" },
      { item: "Cooked fragrant basmati rice", amount: "160g (1 standard bowl)" },
      { item: "Steamed broccoli & carrots", amount: "1 cup" },
      { item: "Crushed garlic & black pepper", amount: "1 tsp each" },
      { item: "Extra virgin olive oil", amount: "1 tsp" },
    ],
    cookingSteps: [
      "Score chicken breast lightly and marinate with garlic, crushed black pepper, lemon juice, and olive oil for 10 minutes.",
      "Grill over medium-high heat for 6–7 minutes per side until fully cooked and juicy.",
      "Rest meat for 3 minutes to retain moisture, then slice into strips.",
      "Serve hot alongside steamed basmati rice and tender broccoli florets.",
    ],
  },
  "tofu bowl": {
    id: "tofu-bowl",
    name: "Crispy Sesame Tofu & Edamame Quinoa Bowl",
    hindiName: "Plant-Based High-Protein Vegan Bowl",
    subtitle: "Plant-Based High-Protein Vegan Bowl",
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
    isVeg: true,
    keyBenefits: "100% plant-derived complete protein • High in dietary fiber and essential minerals",
    timingAdvice: "Excellent lunch choice • Extremely easy to digest before afternoon workouts",
    ingredients: [
      { item: "Extra-firm tofu (pressed & cubed)", amount: "200g (1 bowl)" },
      { item: "Steamed edamame or green peas", amount: "1/2 cup" },
      { item: "Quinoa or brown rice", amount: "150g" },
      { item: "Low sodium tamari / soy sauce", amount: "1 tbsp" },
      { item: "Toasted sesame seeds", amount: "1 tsp" },
    ],
    cookingSteps: [
      "Press tofu with a clean towel to remove excess liquid, then slice into bite-sized cubes.",
      "Coat lightly in low-sodium soy sauce and pan-sear until crisp on all edges.",
      "Assemble bowl with fluffy cooked quinoa, steamed edamame, and crispy tofu cubes.",
      "Garnish with toasted sesame seeds and fresh scallions.",
    ],
  },
  "oats breakfast": {
    id: "oats-breakfast",
    name: "Whey Protein Power Oats with Berries & Nuts",
    hindiName: "Complex Carbs, Whey Isolate & Antioxidants",
    subtitle: "Complex Carbs, Whey Isolate & Antioxidants",
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
    isVeg: true,
    keyBenefits: "Sustained all-day glycogen energy • 36g rapid-absorbing morning protein",
    timingAdvice: "Consume between 7:30 AM and 9:00 AM as your morning metabolic fuel",
    ingredients: [
      { item: "Rolled oats", amount: "70g (1 medium bowl)" },
      { item: "Whey Protein Powder", amount: "1 scoop (30g)" },
      { item: "Water or light milk", amount: "250ml (1 glass)" },
      { item: "Sliced banana or berries", amount: "1/2 cup" },
      { item: "Crushed almonds / chia seeds", amount: "1 tbsp (10-12 almonds)" },
    ],
    cookingSteps: [
      "Simmer rolled oats in water or skimmed milk over medium heat for 4–5 minutes until thick.",
      "Remove saucepan from heat and allow oats to cool for 60 seconds (prevents protein clumping).",
      "Stir in 1 scoop of whey protein powder until smooth and creamy.",
      "Top with sliced banana, fresh berries, and crushed almonds. Serve immediately.",
    ],
  },
  "egg breakfast": {
    id: "egg-breakfast",
    name: "Whole Egg & White Scramble with Multigrain Toast",
    hindiName: "Complete High-Biological-Value Breakfast",
    subtitle: "Complete High-Biological-Value Breakfast",
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
    isVeg: false,
    keyBenefits: "Highest biological value protein (BV 100) • Choline for focus and nervous system health",
    timingAdvice: "Ideal morning meal • Outstanding when eaten 1–2 hours after morning workout",
    ingredients: [
      { item: "Whole eggs", amount: "2 whole" },
      { item: "Egg whites", amount: "3 to 4 whites" },
      { item: "Multigrain / brown bread toast", amount: "2 slices" },
      { item: "Baby spinach & tomatoes", amount: "1 cup" },
      { item: "Light butter / olive oil", amount: "1 tsp" },
    ],
    cookingSteps: [
      "Whisk 2 whole eggs and 3-4 egg whites with a pinch of sea salt and freshly cracked black pepper.",
      "Heat 1 teaspoon of oil or butter in a skillet over low-medium heat; pour in egg mixture.",
      "Gently fold the eggs with a spatula until soft curds form.",
      "Serve warm with 2 toasted multigrain bread slices and sliced tomatoes.",
    ],
  },
  "soya meal": {
    id: "soya-meal",
    name: "High-Protein Soya Chunks Curry with 2 Whole Wheat Rotis",
    hindiName: "High-Density Plant Protein Dinner",
    subtitle: "High-Density Plant Protein Dinner",
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
    isVeg: true,
    keyBenefits: "52% pure plant protein • Maximum cost-effective muscle repair and satiety",
    timingAdvice: "Consume between 8:00 PM and 9:00 PM for overnight muscle recovery",
    ingredients: [
      { item: "Soya chunks (boiled & squeezed dry)", amount: "60g dry (yields 1.5 bowls cooked)" },
      { item: "Tomato-onion home gravy", amount: "1 cup" },
      { item: "Whole wheat rotis or rice", amount: "2 rotis (70g)" },
      { item: "Ginger-garlic & spices", amount: "1 tsp" },
      { item: "Fresh green salad", amount: "1 bowl" },
    ],
    cookingSteps: [
      "Boil soya chunks in water with a pinch of salt for 5 minutes until plump.",
      "Rinse thoroughly under cold water and squeeze completely dry to ensure clean flavor.",
      "Sauté onions, tomatoes, ginger, and garlic in a pan with minimal oil.",
      "Stir in squeezed soya chunks, simmer for 5 minutes, and serve with 2 whole wheat rotis.",
    ],
  },
  "smoothie": {
    id: "smoothie",
    name: "Anabolic Berry & Peanut Butter Protein Shake",
    hindiName: "Rapid Post-Workout Recovery Shake",
    subtitle: "Rapid Post-Workout Recovery Shake",
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
    isVeg: true,
    keyBenefits: "Rapid glycogen restoration & immediate muscle protein synthesis within 30 minutes",
    timingAdvice: "Drink within 20-30 minutes post-workout or as a 5:00 PM evening fuel",
    ingredients: [
      { item: "Whey Protein Isolate", amount: "1 scoop (32g)" },
      { item: "Natural Peanut Butter", amount: "1 tbsp (16g)" },
      { item: "Ripe Banana", amount: "1 medium fruit" },
      { item: "Water or Skimmed Milk", amount: "250ml - 300ml" },
      { item: "Ice cubes", amount: "3-4 cubes" },
    ],
    cookingSteps: [
      "Pour water or skimmed milk into the blender first to prevent powder sticking.",
      "Add 1 banana, 1 tablespoon of natural peanut butter, and 1 scoop of whey protein powder.",
      "Blend on high for 45 seconds until thick, frothy, and smooth.",
      "Drink immediately after your workout session.",
    ],
  },
  "salad": {
    id: "salad",
    name: "High-Protein Chickpea & Paneer/Chicken Power Salad",
    hindiName: "Fiber-Rich Recovery & Fat Loss Bowl",
    subtitle: "Fiber-Rich Recovery & Fat Loss Bowl",
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
    isVeg: true,
    keyBenefits: "High satiety and fiber • Supports gut microbiome and effortless caloric deficit",
    timingAdvice: "Ideal light dinner or 5:00 PM afternoon snack",
    ingredients: [
      { item: "Boiled Chickpeas (Garbanzo Beans)", amount: "1 cup (150g)" },
      { item: "Diced Paneer or Grilled Chicken", amount: "100g (1/2 bowl)" },
      { item: "Cucumber, tomatoes, bell peppers", amount: "1 large bowl" },
      { item: "Fresh lemon juice & seasoning", amount: "1 tbsp" },
      { item: "Extra virgin olive oil", amount: "1 tsp" },
    ],
    cookingSteps: [
      "Combine boiled chickpeas and diced paneer or chicken in a large mixing bowl.",
      "Add chopped crisp cucumbers, tomatoes, and vibrant bell peppers.",
      "Drizzle with 1 teaspoon of extra virgin olive oil, freshly squeezed lemon juice, and sea salt.",
      "Toss well and consume fresh for maximum crunch and nutrient absorption.",
    ],
  },
  "rajma bowl": {
    id: "rajma-bowl",
    name: "Classic Rajma Masala & Steamed Basmati Rice",
    hindiName: "Kidney Bean Protein & Complex Carb Lunch",
    subtitle: "Kidney Bean Protein & Complex Carb Lunch",
    category: "Lunch",
    dietTier: "Vegetarian",
    imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=400&auto=format&fit=crop",
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 1,
    calories: 540,
    proteinGrams: 28,
    carbsGrams: 76,
    fatGrams: 12,
    isVeg: true,
    keyBenefits: "Low glycemic index complex carbohydrates • Rich in soluble fiber and iron",
    timingAdvice: "Eat between 12:30 PM and 2:00 PM for sustained afternoon stamina",
    ingredients: [
      { item: "Boiled Red Kidney Beans (Rajma)", amount: "1.5 bowls (200g)" },
      { item: "Steamed White or Brown Rice", amount: "1 bowl (150g)" },
      { item: "Low-oil Tomato-Onion Gravy", amount: "1 cup" },
      { item: "Fresh Cucumber & Onion Salad", amount: "1 bowl" },
    ],
    cookingSteps: [
      "Pressure-cook soaked red kidney beans until soft and easily mashable.",
      "Simmer in an aromatic tomato-onion sauce prepared with minimal oil and gentle spices.",
      "Serve warm over 1 bowl of steamed basmati rice with cucumber salad on the side.",
    ],
  },
  "khichdi": {
    id: "khichdi",
    name: "High-Protein Moong Dal Khichdi with Curd",
    hindiName: "Easy-to-Digest Restorative Dinner",
    subtitle: "Easy-to-Digest Restorative Dinner",
    category: "Dinner",
    dietTier: "Vegetarian",
    imageUrl: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=400&auto=format&fit=crop",
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 1,
    calories: 460,
    proteinGrams: 26,
    carbsGrams: 64,
    fatGrams: 10,
    isVeg: true,
    keyBenefits: "Optimal gut health and probiotic balance • Promotes deep restorative sleep",
    timingAdvice: "Eat 2 hours before bedtime for seamless nocturnal digestion",
    ingredients: [
      { item: "Yellow Moong Dal & Rice (2:1 ratio)", amount: "1 large bowl (250g)" },
      { item: "Fresh Low-Fat Curd", amount: "1 bowl (150g)" },
      { item: "Cumin & turmeric tempering", amount: "1 tsp ghee" },
      { item: "Roasted Papad (optional)", amount: "1 piece" },
    ],
    cookingSteps: [
      "Use double the quantity of split yellow moong dal relative to rice to elevate protein content.",
      "Cook with turmeric, cumin, and a hint of ghee until light and comforting.",
      "Enjoy with a bowl of chilled probiotic curd for complete gut wellness.",
    ],
  },
  "pre-workout fuel": {
    id: "pre-workout",
    name: "Pre-Workout Banana, Peanut Butter Toast & Espresso",
    hindiName: "High-Energy Pre-Training Fuel",
    subtitle: "High-Energy Pre-Training Fuel",
    category: "Pre-Workout",
    dietTier: "Vegetarian",
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400&auto=format&fit=crop",
    prepTimeMinutes: 3,
    cookTimeMinutes: 0,
    servings: 1,
    calories: 320,
    proteinGrams: 14,
    carbsGrams: 48,
    fatGrams: 8,
    isVeg: true,
    keyBenefits: "Immediate glycogen availability • Elevated mental drive, strength, and muscular pump",
    timingAdvice: "Consume 40 to 50 minutes prior to stepping onto the gym floor",
    ingredients: [
      { item: "Medium Ripe Banana", amount: "1 fruit" },
      { item: "Natural Peanut Butter", amount: "1 tbsp (16g)" },
      { item: "Whole Wheat Bread or 2 Rice Cakes", amount: "1 slice / 2 cakes" },
      { item: "Black Coffee or Water", amount: "1 cup (optional)" },
    ],
    cookingSteps: [
      "Spread 1 tablespoon of natural peanut butter evenly onto whole wheat toast or rice cakes.",
      "Layer sliced ripe banana across the surface.",
      "Enjoy with 1 cup of unsweetened black coffee 45 minutes before intense training.",
    ],
  },
  "fish meal": {
    id: "fish-meal",
    name: "Pan-Seared White Fish Fillet with Asparagus & Rice",
    hindiName: "Omega-3 Rich Lean Vascular Dinner",
    subtitle: "Omega-3 Rich Lean Vascular Dinner",
    category: "Dinner",
    dietTier: "Non-Vegetarian",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&auto=format&fit=crop",
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    servings: 1,
    calories: 510,
    proteinGrams: 42,
    carbsGrams: 48,
    fatGrams: 14,
    isVeg: false,
    keyBenefits: "Anti-inflammatory Omega-3 fatty acids • Supports joint longevity and vascularity",
    timingAdvice: "Evening dinner between 8:00 PM and 8:45 PM",
    ingredients: [
      { item: "Fresh White Fish / Salmon / Tilapia fillet", amount: "180g" },
      { item: "Steamed Basmati Rice", amount: "130g (1 small bowl)" },
      { item: "Steamed greens or asparagus", amount: "1 cup" },
      { item: "Lemon & garlic herb seasoning", amount: "1 tbsp" },
    ],
    cookingSteps: [
      "Season fish fillet with fresh lemon juice, crushed garlic, sea salt, and black pepper.",
      "Sear in a non-stick pan with 1 teaspoon of olive oil for 4–5 minutes per side until flaky.",
      "Serve hot with steamed basmati rice and crisp tender greens.",
    ],
  },
};

// Curated Map of Specific Food Items with High-Res Photos & Plain English Details
const FOOD_IMAGE_CATALOG: Array<{
  pattern: RegExp;
  data: FoodItemMedia;
}> = [
  {
    pattern: /paneer|cottage cheese/i,
    data: {
      name: "Low-Fat Paneer",
      hindiName: "Low-Fat Cottage Cheese",
      subtitle: "Low-Fat Cottage Cheese",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop",
      benefit: "Casein protein • Sustained release for overnight muscle recovery",
      portionTip: "1 medium bowl or palm-sized (150-180g)",
      category: "Protein",
      isVeg: true,
    },
  },
  {
    pattern: /egg|omelet|scramble/i,
    data: {
      name: "Eggs & Egg Whites",
      hindiName: "Whole Eggs & Egg Whites",
      subtitle: "Whole Eggs & Egg Whites",
      imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400&auto=format&fit=crop",
      benefit: "Highest biological value protein • Rich in choline and healthy lipids",
      portionTip: "2 Whole Eggs + 3 Whites",
      category: "Protein",
      isVeg: false,
    },
  },
  {
    pattern: /chicken|turkey/i,
    data: {
      name: "Lean Chicken Breast",
      hindiName: "Skinless Chicken Breast",
      subtitle: "Skinless Chicken Breast",
      imageUrl: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=400&auto=format&fit=crop",
      benefit: "Virtually zero fat • Pure high-density lean muscle builder",
      portionTip: "1 palm-sized piece (160-200g)",
      category: "Protein",
      isVeg: false,
    },
  },
  {
    pattern: /fish|salmon|tuna|cod/i,
    data: {
      name: "Fish Fillet",
      hindiName: "Fresh Fish Fillet",
      subtitle: "Fresh Fish Fillet",
      imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&auto=format&fit=crop",
      benefit: "Omega-3 rich • Supports cardiovascular and joint health",
      portionTip: "1 fillet portion (170-200g)",
      category: "Protein",
      isVeg: false,
    },
  },
  {
    pattern: /oat|oatmeal|porridge/i,
    data: {
      name: "Rolled Oats",
      hindiName: "Whole Grain Rolled Oats",
      subtitle: "Whole Grain Rolled Oats",
      imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=400&auto=format&fit=crop",
      benefit: "Beta-glucan soluble fiber • Steady all-day insulin and energy levels",
      portionTip: "1 medium bowl (60-80g raw)",
      category: "Carbs",
      isVeg: true,
    },
  },
  {
    pattern: /rice|basmati|jasmine/i,
    data: {
      name: "Steamed Basmati Rice",
      hindiName: "Steamed Basmati Rice",
      subtitle: "Steamed Basmati Rice",
      imageUrl: "https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=400&auto=format&fit=crop",
      benefit: "Extremely easy to digest • Rapid muscular glycogen replenishment",
      portionTip: "1 standard bowl cooked (150-180g)",
      category: "Carbs",
      isVeg: true,
    },
  },
  {
    pattern: /roti|chapati|phulka|sourdough|bread|toast/i,
    data: {
      name: "Whole Wheat Roti / Toast",
      hindiName: "Whole Wheat Roti or Toast",
      subtitle: "Whole Wheat Roti or Toast",
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop",
      benefit: "Complex grain carbohydrates and dietary fiber",
      portionTip: "2 medium flatbreads / slices",
      category: "Carbs",
      isVeg: true,
    },
  },
  {
    pattern: /dal|lentil|khichdi/i,
    data: {
      name: "Moong / Toor Dal",
      hindiName: "Yellow Lentil Dal",
      subtitle: "Yellow Lentil Dal",
      imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=400&auto=format&fit=crop",
      benefit: "Light, soothing plant-based protein and polyphenols",
      portionTip: "1 standard bowl (150ml)",
      category: "Protein",
      isVeg: true,
    },
  },
  {
    pattern: /soya|soy/i,
    data: {
      name: "Defatted Soya Chunks",
      hindiName: "Defatted Soya Chunks",
      subtitle: "Defatted Soya Chunks",
      imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=400&auto=format&fit=crop",
      benefit: "52% concentrated protein • Highest value vegetarian recovery food",
      portionTip: "1 bowl boiled (50-60g dry)",
      category: "Protein",
      isVeg: true,
    },
  },
  {
    pattern: /tofu|edamame/i,
    data: {
      name: "Organic Tofu",
      hindiName: "Organic Soy Tofu",
      subtitle: "Organic Soy Tofu",
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop",
      benefit: "Complete plant protein • Fortified with bone-strengthening calcium",
      portionTip: "1 bowl cubes (180-200g)",
      category: "Protein",
      isVeg: true,
    },
  },
  {
    pattern: /whey|protein powder|protein shake|shake|smoothie/i,
    data: {
      name: "Whey Protein Isolate",
      hindiName: "Whey Protein Isolate",
      subtitle: "Whey Protein Isolate",
      imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=400&auto=format&fit=crop",
      benefit: "25-30g rapid amino acid absorption within 30 minutes of exercise",
      portionTip: "1 level scoop (approx 30-32g)",
      category: "Protein",
      isVeg: true,
    },
  },
  {
    pattern: /peanut butter|almond|nut|walnut|chia|seed/i,
    data: {
      name: "Peanut Butter & Nuts",
      hindiName: "Natural Peanut Butter & Nuts",
      subtitle: "Natural Peanut Butter & Nuts",
      imageUrl: "https://images.unsplash.com/photo-1568827999250-3f04f05cb5c5?q=80&w=400&auto=format&fit=crop",
      benefit: "Essential monounsaturated fats for hormonal regulation and joint health",
      portionTip: "1 tablespoon (15g) or 10-12 almonds",
      category: "Healthy Fats",
      isVeg: true,
    },
  },
  {
    pattern: /banana|apple|berry|fruit/i,
    data: {
      name: "Fresh Fruits (Banana / Berries)",
      hindiName: "Fresh Fruits",
      subtitle: "Fresh Fruits",
      imageUrl: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=400&auto=format&fit=crop",
      benefit: "Natural potassium, fructose glycogen, and vital vitamins",
      portionTip: "1 medium fruit (approx 100-120g)",
      category: "Carbs",
      isVeg: true,
    },
  },
  {
    pattern: /sweet potato|yam/i,
    data: {
      name: "Sweet Potato",
      hindiName: "Steamed Sweet Potato",
      subtitle: "Steamed Sweet Potato",
      imageUrl: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?q=80&w=400&auto=format&fit=crop",
      benefit: "Vitamin A antioxidant and slow-digesting clean energy",
      portionTip: "1 medium boiled tuber (150g)",
      category: "Carbs",
      isVeg: true,
    },
  },
  {
    pattern: /curd|yogurt/i,
    data: {
      name: "Low-Fat Curd / Greek Yogurt",
      hindiName: "Low-Fat Probiotic Curd",
      subtitle: "Low-Fat Probiotic Curd",
      imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=400&auto=format&fit=crop",
      benefit: "Live probiotics for nutrient absorption and protein support",
      portionTip: "1 standard bowl (150-200g)",
      category: "Protein",
      isVeg: true,
    },
  },
  {
    pattern: /salad|cucumber|tomato|spinach|broccoli|green|vegetable/i,
    data: {
      name: "Fresh Green Salad & Veggies",
      hindiName: "Fresh Crunchy Salad",
      subtitle: "Fresh Crunchy Salad",
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=400&auto=format&fit=crop",
      benefit: "Essential micronutrients, hydration, and digestive fiber",
      portionTip: "1 large bowl (eat generously)",
      category: "Vitamins & Fiber",
      isVeg: true,
    },
  },
  {
    pattern: /chickpea|chana|rajma|kidney/i,
    data: {
      name: "Boiled Chickpeas / Rajma",
      hindiName: "Chickpeas & Kidney Beans",
      subtitle: "Chickpeas & Kidney Beans",
      imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=400&auto=format&fit=crop",
      benefit: "High soluble fiber and plant-based protein complex",
      portionTip: "1 to 1.5 standard bowls (150-200g)",
      category: "Protein",
      isVeg: true,
    },
  },
];

export function getFoodItemDetail(itemName: string): FoodItemMedia {
  const normalized = itemName.toLowerCase().trim();

  for (const entry of FOOD_IMAGE_CATALOG) {
    if (entry.pattern.test(normalized)) {
      return {
        ...entry.data,
        name: itemName,
      };
    }
  }

  // Safe fallback
  return {
    name: itemName,
    hindiName: itemName,
    subtitle: itemName,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop",
    benefit: "Nutritious balanced dietary staple",
    portionTip: "1 standard serving",
    category: "Protein",
    isVeg: true,
  };
}

export function getMealMedia(mealName: string, dietHint?: string): MealMediaItem {
  const normalized = mealName.toLowerCase().trim();

  // Direct key check
  for (const [key, item] of Object.entries(MEAL_MEDIA_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return item;
    }
  }

  // Keyword check
  if (/pre/i.test(normalized) && /workout|gym|fuel/i.test(normalized)) return MEAL_MEDIA_MAP["pre-workout fuel"];
  if (/shake|smoothie|drink|post/i.test(normalized)) return MEAL_MEDIA_MAP["smoothie"];
  if (/rajma/i.test(normalized)) return MEAL_MEDIA_MAP["rajma bowl"];
  if (/khichdi/i.test(normalized)) return MEAL_MEDIA_MAP["khichdi"];
  if (/fish|salmon|tuna/i.test(normalized)) return MEAL_MEDIA_MAP["fish meal"];
  if (/chicken|turkey|meat/i.test(normalized)) return MEAL_MEDIA_MAP["chicken bowl"];
  if (/egg|omelet|scramble/i.test(normalized)) return MEAL_MEDIA_MAP["egg breakfast"];
  if (/oats|oatmeal|porridge/i.test(normalized)) return MEAL_MEDIA_MAP["oats breakfast"];
  if (/tofu|edamame/i.test(normalized)) return MEAL_MEDIA_MAP["tofu bowl"];
  if (/soya|soy|curry/i.test(normalized)) return MEAL_MEDIA_MAP["soya meal"];
  if (/salad|greens/i.test(normalized)) return MEAL_MEDIA_MAP["salad"];
  if (/paneer|cottage cheese/i.test(normalized)) return MEAL_MEDIA_MAP["paneer bowl"];

  // Diet tier fallback
  if (dietHint?.toLowerCase().includes("non_veg")) return MEAL_MEDIA_MAP["chicken bowl"];
  if (dietHint?.toLowerCase().includes("egg")) return MEAL_MEDIA_MAP["egg breakfast"];
  if (dietHint?.toLowerCase().includes("vegan")) return MEAL_MEDIA_MAP["tofu bowl"];

  return MEAL_MEDIA_MAP["paneer bowl"];
}
