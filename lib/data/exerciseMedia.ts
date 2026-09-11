export interface ExerciseMediaItem {
  id: string;
  exerciseName: string;
  muscleGroup: "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Core" | "Full Body";
  targetMuscles: string[];
  secondaryMuscles?: string[];
  equipment: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  imageUrl: string;
  thumbnailUrl: string;
  videoUrl?: string;
  durationMinutes: number;
  caloriesBurnEstimate: number;
  tempo: string;
  timeUnderTension: string;
}

export const CATEGORY_HERO_IMAGES: Record<string, string> = {
  Chest: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop",
  Back: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1200&auto=format&fit=crop",
  Legs: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1200&auto=format&fit=crop",
  Shoulders: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop",
  Arms: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200&auto=format&fit=crop",
  Core: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop",
  "Full Body": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
  Default: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
};

export const EXERCISE_MEDIA_MAP: Record<string, ExerciseMediaItem> = {
  "barbell bench press": {
    id: "barbell-bench-press",
    exerciseName: "Barbell Bench Press",
    muscleGroup: "Chest",
    targetMuscles: ["Pectoralis Major", "Anterior Deltoid"],
    secondaryMuscles: ["Triceps Brachii", "Serratus Anterior"],
    equipment: "Barbell & Bench",
    difficulty: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    durationMinutes: 12,
    caloriesBurnEstimate: 110,
    tempo: "3-0-1-0",
    timeUnderTension: "45-60s",
  },
  "flat dumbbell press": {
    id: "flat-dumbbell-press",
    exerciseName: "Flat Dumbbell Press",
    muscleGroup: "Chest",
    targetMuscles: ["Pectoralis Major"],
    secondaryMuscles: ["Front Delts", "Triceps"],
    equipment: "Dumbbells & Bench",
    difficulty: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=400&auto=format&fit=crop",
    durationMinutes: 10,
    caloriesBurnEstimate: 95,
    tempo: "3-1-1-0",
    timeUnderTension: "40-50s",
  },
  "incline dumbbell press": {
    id: "incline-dumbbell-press",
    exerciseName: "Incline Dumbbell Press",
    muscleGroup: "Chest",
    targetMuscles: ["Upper Pectoralis (Clavicular Head)"],
    secondaryMuscles: ["Anterior Deltoid", "Triceps"],
    equipment: "Incline Bench & Dumbbells",
    difficulty: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=400&auto=format&fit=crop",
    durationMinutes: 10,
    caloriesBurnEstimate: 90,
    tempo: "3-0-1-0",
    timeUnderTension: "40-50s",
  },
  "cable chest fly": {
    id: "cable-chest-fly",
    exerciseName: "Cable Chest Fly",
    muscleGroup: "Chest",
    targetMuscles: ["Sternal Pectoralis Major"],
    secondaryMuscles: ["Anterior Deltoids"],
    equipment: "Dual Cable Tower",
    difficulty: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=400&auto=format&fit=crop",
    durationMinutes: 8,
    caloriesBurnEstimate: 70,
    tempo: "2-1-2-1",
    timeUnderTension: "50-60s",
  },
  "barbell back squat": {
    id: "barbell-back-squat",
    exerciseName: "Barbell Back Squat",
    muscleGroup: "Legs",
    targetMuscles: ["Quadriceps", "Gluteus Maximus"],
    secondaryMuscles: ["Hamstrings", "Erector Spinae", "Core"],
    equipment: "Power Rack & Barbell",
    difficulty: "Advanced",
    imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop",
    durationMinutes: 15,
    caloriesBurnEstimate: 160,
    tempo: "3-1-1-0",
    timeUnderTension: "45-60s",
  },
  "squat": {
    id: "squat",
    exerciseName: "Barbell Squat",
    muscleGroup: "Legs",
    targetMuscles: ["Quadriceps", "Glutes"],
    secondaryMuscles: ["Hamstrings", "Core"],
    equipment: "Barbell",
    difficulty: "Advanced",
    imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop",
    durationMinutes: 15,
    caloriesBurnEstimate: 150,
    tempo: "3-1-1-0",
    timeUnderTension: "45-60s",
  },
  "leg press": {
    id: "leg-press",
    exerciseName: "45° Leg Press",
    muscleGroup: "Legs",
    targetMuscles: ["Quadriceps", "Adductors"],
    secondaryMuscles: ["Glutes"],
    equipment: "Leg Press Machine",
    difficulty: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=400&auto=format&fit=crop",
    durationMinutes: 12,
    caloriesBurnEstimate: 120,
    tempo: "3-1-1-0",
    timeUnderTension: "50-60s",
  },
  "romanian deadlift": {
    id: "romanian-deadlift",
    exerciseName: "Romanian Deadlift (RDL)",
    muscleGroup: "Legs",
    targetMuscles: ["Hamstrings", "Gluteus Maximus"],
    secondaryMuscles: ["Erector Spinae", "Forearms"],
    equipment: "Barbell or Heavy Dumbbells",
    difficulty: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=400&auto=format&fit=crop",
    durationMinutes: 12,
    caloriesBurnEstimate: 130,
    tempo: "3-1-1-0",
    timeUnderTension: "45-55s",
  },
  "walking lunges": {
    id: "walking-lunges",
    exerciseName: "Dumbbell Walking Lunges",
    muscleGroup: "Legs",
    targetMuscles: ["Quadriceps", "Glutes"],
    secondaryMuscles: ["Calves", "Core"],
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop",
    durationMinutes: 10,
    caloriesBurnEstimate: 110,
    tempo: "2-0-1-0",
    timeUnderTension: "60s",
  },
  "deadlift": {
    id: "deadlift",
    exerciseName: "Conventional Barbell Deadlift",
    muscleGroup: "Back",
    targetMuscles: ["Erector Spinae", "Latissimus Dorsi", "Glutes"],
    secondaryMuscles: ["Hamstrings", "Trapezius", "Forearms"],
    equipment: "Olympic Barbell & Plates",
    difficulty: "Advanced",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop",
    durationMinutes: 15,
    caloriesBurnEstimate: 180,
    tempo: "2-1-1-0",
    timeUnderTension: "35-45s",
  },
  "barbell deadlift": {
    id: "barbell-deadlift",
    exerciseName: "Barbell Deadlift",
    muscleGroup: "Back",
    targetMuscles: ["Posterior Chain", "Lats", "Hamstrings"],
    secondaryMuscles: ["Glutes", "Traps"],
    equipment: "Barbell",
    difficulty: "Advanced",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop",
    durationMinutes: 15,
    caloriesBurnEstimate: 180,
    tempo: "2-1-1-0",
    timeUnderTension: "35-45s",
  },
  "pull up": {
    id: "pull-up",
    exerciseName: "Bodyweight Pull-Up",
    muscleGroup: "Back",
    targetMuscles: ["Latissimus Dorsi", "Teres Major"],
    secondaryMuscles: ["Biceps Brachii", "Lower Trapezius"],
    equipment: "Pull-Up Bar",
    difficulty: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop",
    durationMinutes: 10,
    caloriesBurnEstimate: 95,
    tempo: "2-1-1-0",
    timeUnderTension: "40s",
  },
  "lat pulldown": {
    id: "lat-pulldown",
    exerciseName: "Wide-Grip Lat Pulldown",
    muscleGroup: "Back",
    targetMuscles: ["Latissimus Dorsi"],
    secondaryMuscles: ["Rhomboids", "Biceps"],
    equipment: "Lat Pulldown Machine",
    difficulty: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop",
    durationMinutes: 10,
    caloriesBurnEstimate: 85,
    tempo: "3-0-1-1",
    timeUnderTension: "45s",
  },
  "seated cable row": {
    id: "seated-cable-row",
    exerciseName: "Seated Cable Row",
    muscleGroup: "Back",
    targetMuscles: ["Rhomboids", "Mid Trapezius", "Lats"],
    secondaryMuscles: ["Rear Delts", "Biceps"],
    equipment: "Cable Row Machine",
    difficulty: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop",
    durationMinutes: 10,
    caloriesBurnEstimate: 85,
    tempo: "2-1-1-1",
    timeUnderTension: "45s",
  },
  "overhead press": {
    id: "overhead-press",
    exerciseName: "Standing Overhead Barbell Press (OHP)",
    muscleGroup: "Shoulders",
    targetMuscles: ["Anterior & Lateral Deltoids"],
    secondaryMuscles: ["Triceps", "Upper Chest", "Core"],
    equipment: "Olympic Barbell",
    difficulty: "Advanced",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop",
    durationMinutes: 12,
    caloriesBurnEstimate: 110,
    tempo: "2-1-1-0",
    timeUnderTension: "40s",
  },
  "dumbbell shoulder press": {
    id: "dumbbell-shoulder-press",
    exerciseName: "Dumbbell Shoulder Press",
    muscleGroup: "Shoulders",
    targetMuscles: ["Deltoids"],
    secondaryMuscles: ["Triceps"],
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop",
    durationMinutes: 10,
    caloriesBurnEstimate: 90,
    tempo: "3-0-1-0",
    timeUnderTension: "40s",
  },
  "lateral raise": {
    id: "lateral-raise",
    exerciseName: "Dumbbell Lateral Raise",
    muscleGroup: "Shoulders",
    targetMuscles: ["Lateral Deltoid"],
    secondaryMuscles: ["Traps"],
    equipment: "Dumbbells",
    difficulty: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop",
    durationMinutes: 8,
    caloriesBurnEstimate: 65,
    tempo: "2-1-2-1",
    timeUnderTension: "45-50s",
  },
  "dumbbell bicep curl": {
    id: "dumbbell-bicep-curl",
    exerciseName: "Dumbbell Bicep Curl",
    muscleGroup: "Arms",
    targetMuscles: ["Biceps Brachii", "Brachialis"],
    secondaryMuscles: ["Brachioradialis"],
    equipment: "Dumbbells",
    difficulty: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop",
    durationMinutes: 8,
    caloriesBurnEstimate: 60,
    tempo: "3-1-1-1",
    timeUnderTension: "40s",
  },
  "bicep curl": {
    id: "bicep-curl",
    exerciseName: "Bicep Curl",
    muscleGroup: "Arms",
    targetMuscles: ["Biceps"],
    secondaryMuscles: ["Forearms"],
    equipment: "Dumbbells",
    difficulty: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop",
    durationMinutes: 8,
    caloriesBurnEstimate: 60,
    tempo: "3-1-1-1",
    timeUnderTension: "40s",
  },
  "cable tricep pushdown": {
    id: "cable-tricep-pushdown",
    exerciseName: "Cable Tricep Rope Pushdown",
    muscleGroup: "Arms",
    targetMuscles: ["Triceps (Lateral & Medial Heads)"],
    secondaryMuscles: ["Anconeus"],
    equipment: "Cable Tower & Rope",
    difficulty: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?q=80&w=400&auto=format&fit=crop",
    durationMinutes: 8,
    caloriesBurnEstimate: 60,
    tempo: "3-0-1-1",
    timeUnderTension: "45s",
  },
  "tricep pushdown": {
    id: "tricep-pushdown",
    exerciseName: "Tricep Pushdown",
    muscleGroup: "Arms",
    targetMuscles: ["Triceps"],
    secondaryMuscles: ["Forearms"],
    equipment: "Cable",
    difficulty: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?q=80&w=1000&auto=format&fit=crop",
    thumbnailUrl: "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?q=80&w=400&auto=format&fit=crop",
    durationMinutes: 8,
    caloriesBurnEstimate: 60,
    tempo: "3-0-1-1",
    timeUnderTension: "45s",
  },
};

import { getExerciseLibraryItem } from "./exerciseLibrary";

/**
 * Resolves high-resolution media details for any exercise name dynamically.
 * Features fuzzy matching against the 168+ exercise library and fallback to category-specific imagery.
 */
export function getExerciseMedia(exerciseName: string, categoryFallback?: string): ExerciseMediaItem {
  const normalized = exerciseName.toLowerCase().trim();

  // 1. Direct match in expanded 168+ Exercise Library
  const libItem = getExerciseLibraryItem(normalized);
  if (libItem) {
    return {
      id: libItem.id,
      exerciseName: libItem.name,
      muscleGroup: libItem.muscleGroup,
      targetMuscles: libItem.targetMuscles,
      secondaryMuscles: libItem.secondaryMuscles,
      equipment: libItem.equipment,
      difficulty: libItem.difficulty,
      imageUrl: libItem.imageUrl,
      thumbnailUrl: libItem.thumbnailUrl,
      videoUrl: libItem.videoUrl,
      durationMinutes: libItem.durationMinutes,
      caloriesBurnEstimate: libItem.caloriesBurnEstimate,
      tempo: libItem.tempo,
      timeUnderTension: libItem.timeUnderTension,
    };
  }

  // 2. Direct match in local map
  if (EXERCISE_MEDIA_MAP[normalized]) {
    return EXERCISE_MEDIA_MAP[normalized];
  }

  // 2. Partial keyword matching
  for (const [key, item] of Object.entries(EXERCISE_MEDIA_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return {
        ...item,
        exerciseName,
      };
    }
  }

  // 3. Muscle category inference
  let inferredGroup: "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Core" | "Full Body" = "Full Body";
  if (/bench|press|chest|push-up|fly|dip/i.test(normalized)) inferredGroup = "Chest";
  else if (/pull|row|lat|deadlift|back|chin/i.test(normalized)) inferredGroup = "Back";
  else if (/squat|leg|lunge|calf|quad|hamstring|rdl/i.test(normalized)) inferredGroup = "Legs";
  else if (/shoulder|deltoid|overhead|raise/i.test(normalized)) inferredGroup = "Shoulders";
  else if (/curl|tricep|bicep|skull/i.test(normalized)) inferredGroup = "Arms";
  else if (/plank|crunch|core|ab/i.test(normalized)) inferredGroup = "Core";

  const heroUrl = CATEGORY_HERO_IMAGES[inferredGroup] || CATEGORY_HERO_IMAGES.Default;

  return {
    id: normalized.replace(/\s+/g, "-"),
    exerciseName,
    muscleGroup: inferredGroup,
    targetMuscles: [inferredGroup],
    equipment: "Gym Equipment",
    difficulty: "Intermediate",
    imageUrl: heroUrl,
    thumbnailUrl: heroUrl,
    durationMinutes: 10,
    caloriesBurnEstimate: 80,
    tempo: "3-0-1-0",
    timeUnderTension: "45s",
  };
}
