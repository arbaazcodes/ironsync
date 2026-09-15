import { DietType } from "../types/onboarding";

export interface MealItem {
  name: string;
  portion: string;
}

export interface DayMeal {
  id: string;
  name: string;
  timing: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: MealItem[];
  notes?: string;
  recipe?: {
    ingredients: string[];
    preparation: string[];
    servingSize: string;
  };
}

export function generateMealPlan(
  dietType: DietType | null,
  totalCalories: number,
  mealsCount: number = 4
): DayMeal[] {
  const diet = dietType || "eggetarian";

  // Calorie split percentages based on meal count
  let splits: { name: string; timing: string; percent: number }[] = [];
  if (mealsCount <= 3) {
    splits = [
      { name: "Breakfast", timing: "08:00 AM", percent: 0.32 },
      { name: "Lunch", timing: "01:00 PM", percent: 0.38 },
      { name: "Dinner", timing: "08:00 PM", percent: 0.30 },
    ];
  } else if (mealsCount === 4) {
    splits = [
      { name: "Breakfast", timing: "08:00 AM", percent: 0.28 },
      { name: "Lunch", timing: "01:00 PM", percent: 0.34 },
      { name: "Pre-Workout Fuel", timing: "05:00 PM", percent: 0.14 },
      { name: "Dinner", timing: "08:30 PM", percent: 0.24 },
    ];
  } else {
    splits = [
      { name: "Breakfast", timing: "07:30 AM", percent: 0.25 },
      { name: "Lunch", timing: "12:30 PM", percent: 0.30 },
      { name: "Pre-Workout Fuel", timing: "04:30 PM", percent: 0.12 },
      { name: "Post-Workout Recovery", timing: "06:30 PM", percent: 0.13 },
      { name: "Dinner", timing: "08:45 PM", percent: 0.20 },
    ];
  }

  return splits.map((split, index) => {
    const mealCals = Math.round(totalCalories * split.percent);
    const mealProtein = Math.round((mealCals * 0.28) / 4);
    const mealCarbs = Math.round((mealCals * 0.47) / 4);
    const mealFat = Math.round((mealCals * 0.25) / 9);

    let items: MealItem[] = [];

    switch (diet) {
      case "vegan":
        if (split.name.includes("Breakfast")) {
          items = [
            { name: "Rolled Oats with Almond Milk", portion: "80g" },
            { name: "Plant Pea/Rice Protein Powder", portion: "30g" },
            { name: "Banana & Chia Seeds", portion: "1 med + 1 tbsp" },
          ];
        } else if (split.name.includes("Lunch")) {
          items = [
            { name: "Pan-Seared Organic Tofu", portion: "180g" },
            { name: "Brown Basmati Rice", portion: "150g cooked" },
            { name: "Steamed Broccoli & Avocado Salad", portion: "1 cup" },
          ];
        } else if (split.name.includes("Pre") || split.name.includes("Post")) {
          items = [
            { name: "Rice Cakes with Peanut Butter", portion: "2 cakes + 20g" },
            { name: "Fresh Apple Slices", portion: "1 med" },
          ];
        } else {
          items = [
            { name: "Tempeh Stir-Fry with Bell Peppers", portion: "160g" },
            { name: "Spiced Chickpea & Quinoa Bowl", portion: "140g" },
            { name: "Cold-Pressed Olive Oil Drizzle", portion: "10ml" },
          ];
        }
        break;

      case "vegetarian":
        if (split.name.includes("Breakfast")) {
          items = [
            { name: "High-Protein Greek Yogurt / Curd Bowl", portion: "200g" },
            { name: "Oats with Crushed Walnuts & Honey", portion: "60g" },
            { name: "Sliced Banana or Blueberries", portion: "100g" },
          ];
        } else if (split.name.includes("Lunch")) {
          items = [
            { name: "Low-Fat Grilled Paneer Tikka", portion: "150g" },
            { name: "Whole Wheat Chapatis or Brown Rice", portion: "2 rotis / 150g" },
            { name: "Yellow Moong Dal & Spinach Salad", portion: "1 cup" },
          ];
        } else if (split.name.includes("Pre") || split.name.includes("Post")) {
          items = [
            { name: "Whey or Soy Protein Shake", portion: "1 scoop (30g)" },
            { name: "Ripe Banana", portion: "1 medium" },
          ];
        } else {
          items = [
            { name: "Paneer & Mixed Vegetable Curry", portion: "140g paneer" },
            { name: "Steamed Quinoa or 2 Rotis", portion: "120g" },
            { name: "Sprouted Green Moong Salad", portion: "1/2 cup" },
          ];
        }
        break;

      case "eggetarian":
        if (split.name.includes("Breakfast")) {
          items = [
            { name: "Whole Eggs + Egg Whites Scramble", portion: "2 whole + 3 whites" },
            { name: "Toasted Multigrain Sourdough", portion: "2 slices" },
            { name: "Sliced Avocado or Olive Oil", portion: "1/4 fruit" },
          ];
        } else if (split.name.includes("Lunch")) {
          items = [
            { name: "Herbed Boiled Eggs or Paneer", portion: "3 eggs / 100g" },
            { name: "Steamed White Rice with Lentil Dal", portion: "180g" },
            { name: "Cucumber, Tomato & Lime Salad", portion: "1 bowl" },
          ];
        } else if (split.name.includes("Pre") || split.name.includes("Post")) {
          items = [
            { name: "Banana with Whey Protein Shake", portion: "1 scoop + 1 fruit" },
            { name: "Handful Roasted Almonds", portion: "15g" },
          ];
        } else {
          items = [
            { name: "Egg Bhurji or Cottage Cheese Wrap", portion: "4 egg whites + 1 whole" },
            { name: "Sweet Potato Mash", portion: "150g" },
            { name: "Sauteed Green Beans & Olive Oil", portion: "100g" },
          ];
        }
        break;

      case "non_vegetarian":
      default:
        if (split.name.includes("Breakfast")) {
          items = [
            { name: "Whole Eggs + Egg White Omelet", portion: "2 whole + 3 whites" },
            { name: "Rolled Oatmeal with Cinnamon & Fruit", portion: "60g" },
          ];
        } else if (split.name.includes("Lunch")) {
          items = [
            { name: "Pan-Grilled Chicken Breast or Fish", portion: "180g" },
            { name: "Steamed Fragrant Jasmine Rice", portion: "160g" },
            { name: "Leafy Greens with Extra Virgin Olive Oil", portion: "1 bowl" },
          ];
        } else if (split.name.includes("Pre") || split.name.includes("Post")) {
          items = [
            { name: "Whey Protein Isolate Shake", portion: "1 scoop (32g)" },
            { name: "Banana + Rice Cakes", portion: "1 fruit + 2 cakes" },
          ];
        } else {
          items = [
            { name: "Baked Salmon or Chicken Fillet", portion: "170g" },
            { name: "Roasted Sweet Potato Wedges", portion: "180g" },
            { name: "Steamed Asparagus & Garlic Broccoli", portion: "1 cup" },
          ];
        }
        break;
    }

    return {
      id: `meal-${index + 1}`,
      name: split.name,
      timing: split.timing,
      calories: mealCals,
      protein: mealProtein,
      carbs: mealCarbs,
      fat: mealFat,
      items,
    };
  });
}

export interface WeekDietDay {
  dayName: string;
  dayShort: string;
  dayIndex: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  focus: string;
  meals: DayMeal[];
}

const DAY_NAMES = [
  { short: "MON", full: "Monday", focus: "Kinetic Ignition & High Glycogen" },
  { short: "TUE", full: "Tuesday", focus: "Hypertrophic Volume & Cellular Hydration" },
  { short: "WED", full: "Wednesday", focus: "Metabolic Optimization & Recovery" },
  { short: "THU", full: "Thursday", focus: "Posterior Chain Energy Density" },
  { short: "FRI", full: "Friday", focus: "Athletic Power & Protein Loading" },
  { short: "SAT", full: "Saturday", focus: "Weekend High Performance Fuel" },
  { short: "SUN", full: "Sunday", focus: "Systemic Tissue Reset & Digestive Balance" },
];

/**
 * Generates a complete 7-day personalized weekly diet chart tailored to caloric targets and dietary tier.
 */
export function generateWeeklyDietChart(
  dietType: DietType | null,
  totalCalories: number,
  mealsCount: number = 4
): WeekDietDay[] {
  const baseMeals = generateMealPlan(dietType, totalCalories, mealsCount);
  const diet = dietType || "non_vegetarian";

  return DAY_NAMES.map((d, dayIdx) => {
    // Generate slight daily ingredient rotation
    const dayMeals = baseMeals.map((meal, mIdx) => {
      let variantName = meal.name;
      let variantItems = [...meal.items];

      if (diet === "vegetarian") {
        if (meal.name.includes("Lunch")) {
          const proteins = [
            "Low-Fat Grilled Paneer Tikka (160g)",
            "Tofu & Edamame Quinoa Bowl (180g)",
            "Spiced Chana Masala with Brown Rice (200g)",
            "Paneer & Bell Pepper Skillet (150g)",
            "Yellow Dal Tadka & Soya Chunks (180g)",
            "Palak Paneer with Whole Wheat Rotis (170g)",
            "Sprouted Green Moong & Cottage Cheese Bowl (160g)",
          ];
          variantItems = [
            { name: proteins[dayIdx % proteins.length], portion: "1 portion" },
            { name: "Complex Carbohydrate Staple", portion: "150g" },
            { name: "Fresh Garden Cucumber & Tomato Salad", portion: "1 bowl" },
          ];
        } else if (meal.name.includes("Dinner")) {
          const dinners = [
            "High-Protein Soya Bhurji with 2 Phulkas",
            "Mixed Lentil Khichdi with Curd",
            "Tofu Vegetable Green Curry with Quinoa",
            "Methi Paneer with Multigrain Roti",
            "Rajma Bowl with Steamed Jasmine Rice",
            "Grilled Paneer & Roasted Veggie Medley",
            "Warm Moong Dal Khichdi with Steamed Greens",
          ];
          variantItems = [
            { name: dinners[dayIdx % dinners.length], portion: "1 plate" },
            { name: "Steamed Seasonal Greens", portion: "1 cup" },
          ];
        }
      } else if (diet === "vegan") {
        if (meal.name.includes("Lunch")) {
          const veganLunches = [
            "Pan-Seared Organic Tofu with Basmati Rice",
            "Tempeh Stir-Fry with Broccoli and Edamame",
            "Spiced Chickpea & Quinoa Bowl",
            "Lentil Bolognese with Gluten-Free Pasta",
            "Crispy Sesame Tofu & Bok Choy",
            "Black Bean & Sweet Potato Protein Skillet",
            "Tofu Scramble with Sautéed Spinach & Brown Rice",
          ];
          variantItems = [
            { name: veganLunches[dayIdx % veganLunches.length], portion: "1 portion" },
            { name: "Fresh Avocado & Citrus Greens", portion: "1 small bowl" },
          ];
        }
      } else if (diet === "eggetarian") {
        if (meal.name.includes("Lunch")) {
          const eggLunches = [
            "Herbed Boiled Eggs with Dal and Rice",
            "Egg Bhurji Wrap with Whole Wheat Tortilla",
            "Paneer & Egg White Salad Bowl",
            "Egg Curry with Brown Basmati Rice",
            "Boiled Egg Whites & Sweet Potato Mash",
            "High-Protein Egg White Frittata with Greens",
            "Classic 3-Egg Omelet with Avocado & Multigrain Toast",
          ];
          variantItems = [
            { name: eggLunches[dayIdx % eggLunches.length], portion: "1 serving" },
            { name: "Cucumber, Tomato & Mint Salad", portion: "1 bowl" },
          ];
        }
      } else {
        // Non-vegetarian
        if (meal.name.includes("Lunch")) {
          const nonVegLunches = [
            "Pan-Grilled Chicken Breast with Fragrant Rice",
            "Herbed Chicken Breast with Quinoa & Asparagus",
            "Grilled White Fish Fillet with Lemon & Rice",
            "Tender Chicken Tikka with Steamed Greens",
            "Ground Lean Turkey with Sweet Potato Mash",
            "Baked Atlantic Salmon with Jasmine Rice",
            "Roasted Chicken Bowl with Roasted Bell Peppers",
          ];
          variantItems = [
            { name: nonVegLunches[dayIdx % nonVegLunches.length], portion: "1 portion" },
            { name: "Steamed Broccoli & Olive Oil Drizzle", portion: "1 cup" },
          ];
        } else if (meal.name.includes("Dinner")) {
          const nonVegDinners = [
            "Baked Salmon or Chicken Fillet with Sweet Potato",
            "Grilled Chicken Skewers with Greek Salad",
            "Pan-Seared White Fish with Roasted Asparagus",
            "Herb-Crusted Chicken Fillet with Steamed Rice",
            "Baked Cod Fillet with Garlic Spinach & Quinoa",
            "Tenderloin Strips or Chicken with Roasted Veggies",
            "Slow-Cooked Chicken Broth with Shredded Breast & Greens",
          ];
          variantItems = [
            { name: nonVegDinners[dayIdx % nonVegDinners.length], portion: "1 serving" },
            { name: "Steamed Seasonal Greens", portion: "1 cup" },
          ];
        }
      }

      return {
        ...meal,
        id: `week-${d.short.toLowerCase()}-${mIdx + 1}`,
        items: variantItems,
      };
    });

    const totCals = dayMeals.reduce((acc, m) => acc + m.calories, 0);
    const totProtein = dayMeals.reduce((acc, m) => acc + m.protein, 0);
    const totCarbs = dayMeals.reduce((acc, m) => acc + m.carbs, 0);
    const totFat = dayMeals.reduce((acc, m) => acc + m.fat, 0);

    return {
      dayName: d.full,
      dayShort: d.short,
      dayIndex: dayIdx,
      totalCalories: totCals,
      totalProtein: totProtein,
      totalCarbs: totCarbs,
      totalFat: totFat,
      focus: d.focus,
      meals: dayMeals,
    };
  });
}

