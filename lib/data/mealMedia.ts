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
  hindiName?: string;
  keyBenefits?: string;
  timingAdvice?: string;
  isVeg?: boolean;
}

export interface FoodItemMedia {
  name: string;
  hindiName: string;
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
    hindiName: "पनीर टिक्का और बासमती चावल (Paneer Rice Bowl)",
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
    keyBenefits: "धीमी गति से पचने वाला केसीन प्रोटीन • निरंतर ताकत (Sustained Muscle Recovery)",
    timingAdvice: "दोपहर 1:00 से 2:00 PM के बीच लें • 1 गिलास छाछ के साथ खाएं",
    ingredients: [
      { item: "Low-fat paneer (diced)", amount: "200g (लगभग 1 कटोरी)" },
      { item: "Cooked white or brown basmati rice", amount: "150g (1 कटोरी)" },
      { item: "Sautéed bell peppers & onions", amount: "1 cup" },
      { item: "Cold-pressed olive oil", amount: "1 tsp" },
      { item: "Garam masala, cumin, turmeric & sea salt", amount: "To taste" },
    ],
    cookingSteps: [
      "पनीर को 1-इंच के टुकड़ों में काटें और हल्दी, जीरा पाउडर और हल्के नमक से मैरीनेट करें।",
      "नॉन-स्टिक पैन में 1 चम्मच तेल गर्म करें। पनीर को 2–3 मिनट तक हल्का सुनहरा होने तक सेकें।",
      "शिमला मिर्च और प्याज को पैन में 2 मिनट टॉस करें ताकि कुरकुरापन बना रहे।",
      "गर्म चावल को बाउल में डालें, ऊपर पनीर और सब्जियां रखें और नींबू का रस निचोड़ें।",
    ],
  },
  "chicken bowl": {
    id: "chicken-bowl",
    name: "Grilled Herb Chicken & Steamed Rice Bowl",
    hindiName: "ग्रिल्ड चिकन ब्रेस्ट और बासमती चावल (Grilled Chicken & Rice)",
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
    keyBenefits: "अल्ट्रा-लीन प्रोटीन • शून्य अतिरिक्त फैट • मांसपेशियों का तेजी से विकास",
    timingAdvice: "दोपहर के मुख्य भोजन के रूप में लें • हरी सलाद जरूर शामिल करें",
    ingredients: [
      { item: "Skinless boneless chicken breast", amount: "200g (हथेली के बराबर)" },
      { item: "Cooked fragrant basmati rice", amount: "160g (1 कटोरी)" },
      { item: "Steamed broccoli & carrots", amount: "1 cup" },
      { item: "Crushed garlic & black pepper", amount: "1 tsp each" },
      { item: "Extra virgin olive oil", amount: "1 tsp" },
    ],
    cookingSteps: [
      "चिकन ब्रेस्ट पर हल्के कट लगाएं और लहसुन, काली मिर्च, नींबू और ऑलिव ऑयल से 10 मिनट मैरीनेट करें।",
      "गर्म ग्रिल पैन पर दोनों तरफ से 6–7 मिनट अच्छी तरह पकाएं।",
      "पकाने के बाद 3 मिनट चिकन को रेस्ट करने दें, फिर पतले टुकड़ों में काट लें।",
      "उबले बासमती चावल और भाप में पकी ब्रोकली के साथ सर्व करें।",
    ],
  },
  "tofu bowl": {
    id: "tofu-bowl",
    name: "Crispy Sesame Tofu & Edamame Quinoa Bowl",
    hindiName: "टोफू और क्विनोआ वेगन फिटनेस बाउल (Tofu Quinoa Bowl)",
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
    keyBenefits: "100% शुद्ध प्लांट प्रोटीन • फाइबर व ओमेगा-3 से भरपूर",
    timingAdvice: "दोपहर के भोजन में लें • पचने में अत्यंत हल्का",
    ingredients: [
      { item: "Extra-firm tofu (pressed & cubed)", amount: "200g (1 कटोरी)" },
      { item: "Steamed edamame or green peas", amount: "1/2 cup" },
      { item: "Quinoa or brown rice", amount: "150g" },
      { item: "Low sodium tamari / soy sauce", amount: "1 tbsp" },
      { item: "Toasted sesame seeds", amount: "1 tsp" },
    ],
    cookingSteps: [
      "टोफू को दबाकर अतिरिक्त पानी निकालें और चौकोर टुकड़ों में काटें।",
      "हल्के सोया सॉस में लपेटकर पैन में हल्का कुरकुरा होने तक सेकें।",
      "पके हुए क्विनोआ और उबली हरी मटर/एडेमामे के साथ बाउल तैयार करें।",
      "ऊपर से तिल बुरक कर गरमा-गरम परोसें।",
    ],
  },
  "oats breakfast": {
    id: "oats-breakfast",
    name: "Whey Protein Power Oats with Berries & Nuts",
    hindiName: "प्रोटीन ओट्स, फल और बादाम (Power Oatmeal)",
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
    keyBenefits: "दिनभर ऊर्जा बनाए रखने वाला कॉम्प्लेक्स कार्ब • 36g क्विक प्रोटीन",
    timingAdvice: "सुबह 7:30 से 9:00 AM के बीच नाश्ते में लें",
    ingredients: [
      { item: "Rolled oats", amount: "70g (1 मध्यम कटोरी)" },
      { item: "Whey Protein Powder", amount: "1 scoop (30g)" },
      { item: "Water or light milk", amount: "250ml (1 ग्लास)" },
      { item: "Sliced banana or berries", amount: "1/2 cup" },
      { item: "Crushed almonds / chia seeds", amount: "1 tbsp (10-12 बादाम)" },
    ],
    cookingSteps: [
      "ओट्स को पानी या दूध में 4–5 मिनट धीमी आंच पर पकाएं जब तक गाढ़ा न हो जाए।",
      "आंच बंद करें और ओट्स को 1 मिनट ठंडा होने दें (गरम में प्रोटीन पाउडर डालने से गांठें नहीं बनेंगी)।",
      "व्हे प्रोटीन पाउडर मिलाएं और अच्छी तरह फेंटें।",
      "ऊपर से कटे केले/बेरीज और बादाम डालकर तुरंत खाएं।",
    ],
  },
  "egg breakfast": {
    id: "egg-breakfast",
    name: "Whole Egg & White Scramble with Multigrain Toast",
    hindiName: "अंडे की भुर्जी और मल्टीग्रेन टोस्ट (Egg Scramble & Toast)",
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
    keyBenefits: "हाईएस्ट क्वालिटी प्रोटीन (100 Biological Value) • मस्तिष्क व मांसपेशियों के लिए कोलीन",
    timingAdvice: "सुबह नाश्ते में लें • कसरत के 1-2 घंटे बाद सबसे असरदार",
    ingredients: [
      { item: "Whole eggs", amount: "2 whole" },
      { item: "Egg whites", amount: "3 to 4 whites" },
      { item: "Multigrain / brown bread toast", amount: "2 slices" },
      { item: "Baby spinach & tomatoes", amount: "1 cup" },
      { item: "Light butter / olive oil", amount: "1 tsp" },
    ],
    cookingSteps: [
      "2 पूरे अंडे और 3-4 अंडे की सफेदी को चुटकी भर नमक और काली मिर्च के साथ फेंट लें।",
      "पैन में 1 छोटा चम्मच तेल या बटर डालें, धीमी आंच पर अंडे का मिश्रण डालें।",
      "चम्मच से धीरे-धीरे चलाकर नरम भुर्जी तैयार करें।",
      "दो टोस्ट की गई मल्टीग्रेन ब्रेड और टमाटर के साथ सर्व करें।",
    ],
  },
  "soya meal": {
    id: "soya-meal",
    name: "High-Protein Soya Chunks Curry with 2 Phulkas",
    hindiName: "सोया चंक्स करी और 2 फुल्के (Soya Bhurji / Curry & Rotis)",
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
    keyBenefits: "52% शाकाहारी प्रोटीन • कम बजट में सबसे अधिक मसल रिकवरी",
    timingAdvice: "रात 8:00 से 9:00 PM के बीच डिनर में लें",
    ingredients: [
      { item: "Soya chunks (boiled & squeezed dry)", amount: "60g dry (उबलने पर 1.5 कटोरी)" },
      { item: "Tomato-onion home gravy", amount: "1 cup" },
      { item: "Whole wheat rotis or rice", amount: "2 rotis (70g)" },
      { item: "Ginger-garlic & Indian spices", amount: "1 tsp" },
      { item: "Fresh green salad", amount: "1 bowl" },
    ],
    cookingSteps: [
      "सोया चंक्स को 5 मिनट गर्म पानी में चुटकी भर नमक के साथ उबालें।",
      "ठंडे पानी से धोकर सारा पानी पूरी तरह निचोड़ लें ताकि कड़वाहट न रहे।",
      "कड़ाही में प्याज, टमाटर, अदरक-लहसुन और हल्दी-धनिया का मसाला भूनें।",
      "निचोड़े हुए सोया चंक्स डालकर 5 मिनट पकाएं और 2 गर्म फुल्कों के साथ खाएं।",
    ],
  },
  "smoothie": {
    id: "smoothie",
    name: "Anabolic Berry & Peanut Butter Protein Shake",
    hindiName: "व्हे प्रोटीन, पीनट बटर और बनाना शेक (Power Shake)",
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
    keyBenefits: "वर्कआउट के बाद 20 मिनट के भीतर तुरंत मसल रिकवरी • स्वादिष्ट और आसान",
    timingAdvice: "जिम के तुरंत बाद (Post-Workout) या शाम 5 बजे पिएं",
    ingredients: [
      { item: "Whey Protein Isolate", amount: "1 scoop (32g)" },
      { item: "Natural Peanut Butter", amount: "1 tbsp (16g)" },
      { item: "Ripe Banana", amount: "1 medium fruit" },
      { item: "Water or Skimmed Milk", amount: "250ml - 300ml" },
      { item: "Ice cubes", amount: "3-4 cubes" },
    ],
    cookingSteps: [
      "ब्लेंडर में पहले 250ml पानी या दूध डालें (ताकि पाउडर नीचे न चिपके)।",
      "1 केला, 1 चम्मच पीनट बटर और 1 स्कूप प्रोटीन पाउडर डालें।",
      "45 सेकंड तक अच्छी तरह ब्लेंड करें जब तक क्रीमी झागदार शेक न बन जाए।",
      "वर्कआउट के बाद तुरंत पिएं।",
    ],
  },
  "salad": {
    id: "salad",
    name: "High-Protein Chickpea & Paneer/Chicken Power Salad",
    hindiName: "काबुली चना, पनीर और हरी सब्जियों की सलाद (Power Salad)",
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
    keyBenefits: "पाचन में सबसे सुगम • पेट भरा रखे और फैट बर्न में मददगार",
    timingAdvice: "रात के डिनर में या शाम के स्नैक के रूप में लें",
    ingredients: [
      { item: "Boiled Chickpeas (सफेद चना / छोले)", amount: "1 cup (150g)" },
      { item: "Diced Paneer or Tofu", amount: "100g (1/2 कटोरी)" },
      { item: "Cucumber, tomatoes, bell peppers", amount: "1 big bowl" },
      { item: "Lemon juice & chaat masala", amount: "1 tbsp" },
      { item: "Olive oil", amount: "1 tsp" },
    ],
    cookingSteps: [
      "उबले हुए चने और कटे हुए पनीर/टोफू को एक बड़े कटोरे में डालें।",
      "बारीक कटा खीरा, टमाटर और शिमला मिर्च मिलाएं।",
      "ऊपर से 1 चम्मच ऑलिव ऑयल, नींबू का रस और चाट मसाला डालकर टॉस करें।",
      "ताजा और कुरकुरा खाएं।",
    ],
  },
  "rajma bowl": {
    id: "rajma-bowl",
    name: "Classic Rajma Masala & Steamed Basmati Rice",
    hindiName: "राजमा मसाला और उबले चावल (Rajma Chawal Fitness Bowl)",
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
    keyBenefits: "धीमी गति से रिलीज होने वाले कार्ब्स और फाइबर • पेट के लिए सुपाच्य",
    timingAdvice: "दोपहर 12:30 से 2:00 PM के बीच लंच में लें",
    ingredients: [
      { item: "Boiled Red Kidney Beans (राजमा)", amount: "1.5 कटोरी (200g)" },
      { item: "Steamed White or Brown Rice", amount: "1 कटोरी (150g)" },
      { item: "Low-oil Tomato-Onion Gravy", amount: "1 cup" },
      { item: "Fresh Cucumber & Onion Salad", amount: "1 bowl" },
    ],
    cookingSteps: [
      "रातभर भीगे हुए राजमा को कुकर में अच्छी तरह उबाल लें।",
      "कम तेल और अदरक-लहसुन-टमाटर के तड़के में राजमा को पकाएं।",
      "1 कटोरी उबले चावल के साथ गर्मागर्म परोसें और खीरे की सलाद साथ लें।",
    ],
  },
  "khichdi": {
    id: "khichdi",
    name: "High-Protein Moong Dal Khichdi with Curd",
    hindiName: "मूंग दाल खिचड़ी और ताजा दही (Moong Dal Khichdi & Curd)",
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
    keyBenefits: "आंतों के लिए सर्वोत्तम • प्रोबायोटिक्स से भरपूर • गहरी नींद में सहायक",
    timingAdvice: "रात को सोने से 2 घंटे पहले डिनर में लें",
    ingredients: [
      { item: "Yellow Moong Dal & Rice (2:1 ratio)", amount: "1 big bowl (250g)" },
      { item: "Fresh Low-Fat Curd (दही)", amount: "1 bowl (150g)" },
      { item: "Cumin, hing & turmeric tempering", amount: "1 tsp ghee" },
      { item: "Roasted Papad (optional)", amount: "1 piece" },
    ],
    cookingSteps: [
      "मूंग दाल की मात्रा चावल से दोगुनी रखें ताकि प्रोटीन भरपूर मिले।",
      "कुकर में जीरा, हींग और हल्दी का हल्का छौंक लगाकर खिचड़ी पकाएं।",
      "ताजी ठंडी दही के साथ खाएं, जो आंतों के स्वास्थ्य को बेहतर बनाएगी।",
    ],
  },
  "pre-workout fuel": {
    id: "pre-workout",
    name: "Pre-Workout Banana, Peanut Butter Toast & Espresso",
    hindiName: "कसरत से पहले: केला, पीनट बटर टोस्ट (Pre-Gym Fuel)",
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
    keyBenefits: "भारी वजन उठाने के लिए तुरंत ताकत • मांसपेशियों में पंप और एकाग्रता",
    timingAdvice: "जिम जाने के 40 से 50 मिनट पहले खाएं",
    ingredients: [
      { item: "Medium Ripe Banana", amount: "1 fruit" },
      { item: "Natural Peanut Butter", amount: "1 tbsp (16g)" },
      { item: "Whole Wheat Bread or 2 Rice Cakes", amount: "1 slice / 2 cakes" },
      { item: "Black Coffee or Water", amount: "1 cup (optional)" },
    ],
    cookingSteps: [
      "ब्रेड स्लाइस या राइस केक पर 1 चम्मच पीनट बटर लगाएं।",
      "केले के टुकड़े ऊपर रखें।",
      "जिम जाने से 45 मिनट पहले 1 कप ब्लैक कॉफी के साथ लें।",
    ],
  },
  "fish meal": {
    id: "fish-meal",
    name: "Pan-Seared White Fish Fillet with Asparagus & Rice",
    hindiName: "ग्रिल्ड फिश और बासमती चावल (Fish Fillet & Rice)",
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
    keyBenefits: "ओमेगा-3 फैटी एसिड • जोड़ों का स्वास्थ्य और लीन वैस्कुलैरिटी",
    timingAdvice: "डिनर में रात 8:00 से 8:45 PM पर लें",
    ingredients: [
      { item: "Fresh White Fish / Rohu / Tilapia fillet", amount: "180g" },
      { item: "Steamed Basmati Rice", amount: "130g (1 छोटी कटोरी)" },
      { item: "Steamed greens or asparagus", amount: "1 cup" },
      { item: "Lemon & garlic herb seasoning", amount: "1 tbsp" },
    ],
    cookingSteps: [
      "फिश फिलेट पर नींबू का रस, लहसुन, काली मिर्च और हल्का नमक लगाएं।",
      "नॉन-स्टिक तवे पर 1 छोटा चम्मच ऑलिव ऑयल में 4-5 मिनट प्रति साइड सेकें।",
      "उबले चावल और हरी सब्जियों के साथ तुरंत सर्व करें।",
    ],
  },
};

// Curated Map of Specific Food Items with High-Res Photos & Plain Language Details
const FOOD_IMAGE_CATALOG: Array<{
  pattern: RegExp;
  data: FoodItemMedia;
}> = [
  {
    pattern: /paneer|cottage cheese/i,
    data: {
      name: "Low-Fat Paneer",
      hindiName: "पनीर (Low-Fat Paneer)",
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop",
      benefit: "केसीन प्रोटीन • धीमी पाचन क्रिया से लंबे समय तक रिकवरी",
      portionTip: "1 कटोरी या हथेली भर (150-180g)",
      category: "Protein",
      isVeg: true,
    },
  },
  {
    pattern: /egg|omelet|scramble/i,
    data: {
      name: "Eggs & Egg Whites",
      hindiName: "अंडे (Whole & Egg Whites)",
      imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400&auto=format&fit=crop",
      benefit: "सर्वोत्तम बायो-अवेलेबल प्रोटीन और कोलीन",
      portionTip: "2 पूरे अंडे + 3 सफेदी (2 Whole + 3 Whites)",
      category: "Protein",
      isVeg: false,
    },
  },
  {
    pattern: /chicken|turkey/i,
    data: {
      name: "Lean Chicken Breast",
      hindiName: "चिकन ब्रेस्ट (Chicken Breast)",
      imageUrl: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=400&auto=format&fit=crop",
      benefit: "जीरो फैट • शुद्ध मसल बिल्डिंग लीन प्रोटीन",
      portionTip: "हथेली के बराबर 1 टुकड़ा (160-200g)",
      category: "Protein",
      isVeg: false,
    },
  },
  {
    pattern: /fish|salmon|tuna|cod/i,
    data: {
      name: "Fish Fillet",
      hindiName: "मछली (Fish Fillet)",
      imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&auto=format&fit=crop",
      benefit: "ओमेगा-3 से भरपूर • जोड़ों और दिल के लिए उत्तम",
      portionTip: "1 टुकड़ा (170-200g)",
      category: "Protein",
      isVeg: false,
    },
  },
  {
    pattern: /oat|oatmeal|porridge/i,
    data: {
      name: "Rolled Oats",
      hindiName: "ओट्स (Rolled Oats)",
      imageUrl: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=400&auto=format&fit=crop",
      benefit: "बीटा-ग्लूकन फाइबर • दिनभर स्थिर ऊर्जा स्तर",
      portionTip: "1 मध्यम कटोरी (60-80g कच्चा)",
      category: "Carbs",
      isVeg: true,
    },
  },
  {
    pattern: /rice|basmati|jasmine/i,
    data: {
      name: "Steamed Basmati Rice",
      hindiName: "बासमती चावल (Steamed Rice)",
      imageUrl: "https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=400&auto=format&fit=crop",
      benefit: "पचने में सबसे आसान • तुरंत ग्लाइकोजन रिफिल",
      portionTip: "1 मध्यम कटोरी पका हुआ (150-180g)",
      category: "Carbs",
      isVeg: true,
    },
  },
  {
    pattern: /roti|chapati|phulka|sourdough|bread|toast/i,
    data: {
      name: "Whole Wheat Roti / Toast",
      hindiName: "रोटी / फुल्का (Wheat Roti)",
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop",
      benefit: "भारतीय भोजन का मुख्य फाइबर और कार्ब स्रोत",
      portionTip: "2 मध्यम फुल्के (बिना अतिरिक्त घी के)",
      category: "Carbs",
      isVeg: true,
    },
  },
  {
    pattern: /dal|lentil|khichdi/i,
    data: {
      name: "Moong / Toor Dal",
      hindiName: "दाल (Yellow Dal / Lentils)",
      imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=400&auto=format&fit=crop",
      benefit: "हल्का और सुपाच्य शाकाहारी प्रोटीन",
      portionTip: "1 मध्यम कटोरी (150ml)",
      category: "Protein",
      isVeg: true,
    },
  },
  {
    pattern: /soya|soy/i,
    data: {
      name: "Defatted Soya Chunks",
      hindiName: "सोया चंक्स (Soya Chunks)",
      imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=400&auto=format&fit=crop",
      benefit: "52% सघन प्रोटीन • बजट में सर्वश्रेष्ठ",
      portionTip: "उबालने पर 1 कटोरी (50-60g सूखा)",
      category: "Protein",
      isVeg: true,
    },
  },
  {
    pattern: /tofu|edamame/i,
    data: {
      name: "Organic Tofu",
      hindiName: "टोफू (Soy Tofu)",
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop",
      benefit: "वेगन प्रोटीन और हड्डियों के लिए कैल्शियम",
      portionTip: "1 कटोरी टुकड़े (180-200g)",
      category: "Protein",
      isVeg: true,
    },
  },
  {
    pattern: /whey|protein powder|protein shake|shake|smoothie/i,
    data: {
      name: "Whey Protein Isolate",
      hindiName: "व्हे प्रोटीन (Whey Isolate)",
      imageUrl: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=400&auto=format&fit=crop",
      benefit: "कसरत के 30 मिनट में 25-30g तेज अवशोषण",
      portionTip: "1 स्कूप (लगभग 30-32 ग्राम)",
      category: "Protein",
      isVeg: true,
    },
  },
  {
    pattern: /peanut butter|almond|nut|walnut|chia|seed/i,
    data: {
      name: "Peanut Butter & Nuts",
      hindiName: "पीनट बटर और मेवे (Nuts & Seeds)",
      imageUrl: "https://images.unsplash.com/photo-1568827999250-3f04f05cb5c5?q=80&w=400&auto=format&fit=crop",
      benefit: "स्वस्थ हार्मोन और जोड़ों के लिए आवश्यक फैट",
      portionTip: "1 बड़ा चम्मच (15g) या 10-12 बादाम",
      category: "Healthy Fats",
      isVeg: true,
    },
  },
  {
    pattern: /banana|apple|berry|fruit/i,
    data: {
      name: "Fresh Fruits (Banana / Berries)",
      hindiName: "केला / सेब / फल (Fresh Fruit)",
      imageUrl: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=400&auto=format&fit=crop",
      benefit: "पोटैशियम और प्राकृतिक फ्रुक्टोज ऊर्जा",
      portionTip: "1 मध्यम आकार का फल (1 Medium Fruit)",
      category: "Carbs",
      isVeg: true,
    },
  },
  {
    pattern: /sweet potato|yam/i,
    data: {
      name: "Sweet Potato",
      hindiName: "शकरकंद (Sweet Potato)",
      imageUrl: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?q=80&w=400&auto=format&fit=crop",
      benefit: "विटामिन-ए और धीमी गति से पचने वाले कार्ब्स",
      portionTip: "1 मध्यम उबला हुआ (150g)",
      category: "Carbs",
      isVeg: true,
    },
  },
  {
    pattern: /curd|yogurt/i,
    data: {
      name: "Low-Fat Curd / Greek Yogurt",
      hindiName: "ताजा दही / योगर्ट (Curd / Yogurt)",
      imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=400&auto=format&fit=crop",
      benefit: "पाचन सुधारने वाले प्रोबायोटिक्स और प्रोटीन",
      portionTip: "1 कटोरी (150-200g)",
      category: "Protein",
      isVeg: true,
    },
  },
  {
    pattern: /salad|cucumber|tomato|spinach|broccoli|green|vegetable/i,
    data: {
      name: "Fresh Green Salad & Veggies",
      hindiName: "हरी सब्जियां व सलाद (Fresh Salad)",
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=400&auto=format&fit=crop",
      benefit: "माइक्रोन्यूट्रिएंट्स, पानी और पाचन फाइबर",
      portionTip: "1 बड़ा कटोरा (भरपेट खाएं)",
      category: "Vitamins & Fiber",
      isVeg: true,
    },
  },
  {
    pattern: /chickpea|chana|rajma|kidney/i,
    data: {
      name: "Boiled Chickpeas / Rajma",
      hindiName: "चना / राजमा (Chana / Rajma)",
      imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=400&auto=format&fit=crop",
      benefit: "उच्च फाइबर और प्लांट-बेस्ड प्रोटीन कॉम्प्लेक्स",
      portionTip: "1 से 1.5 कटोरी (150-200g)",
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
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop",
    benefit: "पोषण से भरपूर संतुलित आहार",
    portionTip: "1 मानक सर्विंग (1 Serving)",
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
