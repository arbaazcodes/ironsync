import { DayMeal } from "@/lib/engine/mealGenerator";
import { getMealRecipe } from "@/lib/data/mealSwapData";

export interface CategorizedShoppingItem {
  name: string;
  portion: string;
  mealSources: string[];
}

export interface ConsolidatedShoppingList {
  proteinSources: CategorizedShoppingItem[];
  carbsAndGrains: CategorizedShoppingItem[];
  freshProduce: CategorizedShoppingItem[];
  dairyAndAlternatives: CategorizedShoppingItem[];
  pantryAndFats: CategorizedShoppingItem[];
  seasoningsAndOther: CategorizedShoppingItem[];
}

/**
 * Categorizes an ingredient string into a grocery section based on nutrient/food keywords.
 */
function categorizeIngredient(name: string): keyof ConsolidatedShoppingList {
  const lower = name.toLowerCase();

  // 1. Protein Sources
  if (
    lower.includes("egg") ||
    lower.includes("chicken") ||
    lower.includes("turkey") ||
    lower.includes("salmon") ||
    lower.includes("tuna") ||
    lower.includes("fish") ||
    lower.includes("paneer") ||
    lower.includes("tofu") ||
    lower.includes("tempeh") ||
    lower.includes("whey") ||
    lower.includes("protein powder") ||
    lower.includes("plant protein") ||
    lower.includes("beef") ||
    lower.includes("steak") ||
    lower.includes("shrimp") ||
    lower.includes("lentil") ||
    lower.includes("dal") ||
    lower.includes("chickpea")
  ) {
    return "proteinSources";
  }

  // 2. Dairy & Alternatives
  if (
    lower.includes("yogurt") ||
    lower.includes("curd") ||
    lower.includes("cottage cheese") ||
    lower.includes("milk") ||
    lower.includes("almond milk") ||
    lower.includes("soy milk") ||
    lower.includes("kefir") ||
    lower.includes("cheese")
  ) {
    return "dairyAndAlternatives";
  }

  // 3. Fresh Produce (Vegetables & Fruits)
  if (
    lower.includes("banana") ||
    lower.includes("apple") ||
    lower.includes("blueberr") ||
    lower.includes("berr") ||
    lower.includes("spinach") ||
    lower.includes("broccoli") ||
    lower.includes("asparagus") ||
    lower.includes("avocado") ||
    lower.includes("cucumber") ||
    lower.includes("tomato") ||
    lower.includes("pepper") ||
    lower.includes("salad") ||
    lower.includes("greens") ||
    lower.includes("lime") ||
    lower.includes("lemon") ||
    lower.includes("onion") ||
    lower.includes("garlic") ||
    lower.includes("zucchini")
  ) {
    return "freshProduce";
  }

  // 4. Carbs & Grains
  if (
    lower.includes("oat") ||
    lower.includes("rice") ||
    lower.includes("potato") ||
    lower.includes("quinoa") ||
    lower.includes("bread") ||
    lower.includes("sourdough") ||
    lower.includes("roti") ||
    lower.includes("chapati") ||
    lower.includes("wrap") ||
    lower.includes("tortilla") ||
    lower.includes("bagel") ||
    lower.includes("pasta") ||
    lower.includes("cereal")
  ) {
    return "carbsAndGrains";
  }

  // 5. Pantry, Healthy Fats & Nuts
  if (
    lower.includes("oil") ||
    lower.includes("olive oil") ||
    lower.includes("coconut oil") ||
    lower.includes("peanut butter") ||
    lower.includes("almond butter") ||
    lower.includes("almond") ||
    lower.includes("walnut") ||
    lower.includes("cashew") ||
    lower.includes("chia") ||
    lower.includes("flax") ||
    lower.includes("seeds") ||
    lower.includes("honey") ||
    lower.includes("maple")
  ) {
    return "pantryAndFats";
  }

  return "seasoningsAndOther";
}

/**
 * Extracts and consolidates all ingredients from active meals into categorized grocery lists.
 */
export function generateConsolidatedShoppingList(meals: DayMeal[]): ConsolidatedShoppingList {
  const result: ConsolidatedShoppingList = {
    proteinSources: [],
    carbsAndGrains: [],
    freshProduce: [],
    dairyAndAlternatives: [],
    pantryAndFats: [],
    seasoningsAndOther: [],
  };

  // Map to group and deduplicate items across meals
  const itemMap = new Map<
    string,
    {
      category: keyof ConsolidatedShoppingList;
      name: string;
      portions: string[];
      mealSources: Set<string>;
    }
  >();

  meals.forEach((meal) => {
    // If structured recipe has ingredients, prioritize extracting from there
    const recipe = getMealRecipe(meal);
    const sourceItems =
      recipe.ingredients && recipe.ingredients.length > 0
        ? recipe.ingredients.map((ing) => {
            // Attempt to parse "portion item" e.g. "65g Rolled oats"
            return {
              name: ing.replace(/^\d+[\w\s/.-]+\s+/i, "").trim() || ing,
              portion: ing.match(/^\d+[\w\s/.-]+/i)?.[0]?.trim() || "1 portion",
              fullName: ing,
            };
          })
        : meal.items.map((item) => ({
            name: item.name,
            portion: item.portion,
            fullName: `${item.portion} ${item.name}`,
          }));

    sourceItems.forEach((src) => {
      const normalizedKey = src.name.toLowerCase().trim();
      const category = categorizeIngredient(src.name);

      if (itemMap.has(normalizedKey)) {
        const existing = itemMap.get(normalizedKey)!;
        existing.portions.push(src.portion);
        existing.mealSources.add(meal.name);
      } else {
        itemMap.set(normalizedKey, {
          category,
          name: src.name,
          portions: [src.portion],
          mealSources: new Set([meal.name]),
        });
      }
    });
  });

  // Build the categorized result arrays
  itemMap.forEach((entry) => {
    const combinedPortion = entry.portions.join(", ");
    result[entry.category].push({
      name: entry.name,
      portion: combinedPortion,
      mealSources: Array.from(entry.mealSources),
    });
  });

  // Sort items alphabetically inside each category
  Object.keys(result).forEach((cat) => {
    const categoryKey = cat as keyof ConsolidatedShoppingList;
    result[categoryKey].sort((a, b) => a.name.localeCompare(b.name));
  });

  return result;
}
