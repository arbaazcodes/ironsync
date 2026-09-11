export type MovementPattern =
  | "horizontal_push"
  | "vertical_push"
  | "horizontal_pull"
  | "vertical_pull"
  | "squat_quad"
  | "hinge_posterior"
  | "lunge_unilateral"
  | "isolation_chest"
  | "isolation_deltoids"
  | "isolation_biceps"
  | "isolation_triceps"
  | "isolation_calves"
  | "core_abs";

export type EquipmentTier = "commercial_gym" | "home_gym" | "bodyweight";
export type ExperienceTier = "beginner" | "intermediate" | "advanced";
export type ExerciseType = "compound" | "isolation" | "bodyweight";

export interface ExerciseMetadata {
  id: string;
  name: string;
  movementPattern: MovementPattern;
  primaryMuscle: string;
  secondaryMuscles?: string[];
  equipment: EquipmentTier;
  difficulty: ExperienceTier;
  exerciseType: ExerciseType;
  defaultRest: string;
  executionCue: string;
  commonMistake: string;
  rationale: string;
}

export const EXERCISE_SWAP_DATABASE: ExerciseMetadata[] = [
  // ==========================================
  // HORIZONTAL PUSH (Chest / Anterior Delts / Triceps)
  // ==========================================
  {
    id: "ex-hp-1",
    name: "Barbell Bench Press",
    movementPattern: "horizontal_push",
    primaryMuscle: "Chest (Pectoralis Major)",
    secondaryMuscles: ["Anterior Deltoids", "Triceps"],
    equipment: "commercial_gym",
    difficulty: "intermediate",
    exerciseType: "compound",
    defaultRest: "120 sec",
    executionCue: "Retract scapulae, touch lower sternum, drive through midfoot without bouncing.",
    commonMistake: "Flaring elbows out at 90 degrees or lifting hips off bench.",
    rationale: "Gold standard maximal mechanical tension builder for pectorals.",
  },
  {
    id: "ex-hp-2",
    name: "Dumbbell Bench Press",
    movementPattern: "horizontal_push",
    primaryMuscle: "Chest (Pectoralis Major)",
    secondaryMuscles: ["Triceps", "Front Delts"],
    equipment: "home_gym",
    difficulty: "intermediate",
    exerciseType: "compound",
    defaultRest: "90 sec",
    executionCue: "Maintain 45-degree tuck, converge slightly at peak, allow deep stretch at bottom.",
    commonMistake: "Banging dumbbells together at top, losing chest tension.",
    rationale: "Unilateral freedom allows greater active range of motion and joint comfort.",
  },
  {
    id: "ex-hp-3",
    name: "Machine Chest Press",
    movementPattern: "horizontal_push",
    primaryMuscle: "Chest (Pectoralis Major)",
    secondaryMuscles: ["Front Delts", "Triceps"],
    equipment: "commercial_gym",
    difficulty: "beginner",
    exerciseType: "compound",
    defaultRest: "90 sec",
    executionCue: "Align handles with mid-chest, press smoothly along fixed converging arc, pause 1s at lockout.",
    commonMistake: "Letting weight stack slam down between repetitions.",
    rationale: "High stability reduces stabilizer fatigue for direct targeted pec recruitment.",
  },
  {
    id: "ex-hp-4",
    name: "Incline Barbell Bench Press",
    movementPattern: "horizontal_push",
    primaryMuscle: "Chest (Clavicular Head)",
    secondaryMuscles: ["Front Delts", "Triceps"],
    equipment: "commercial_gym",
    difficulty: "intermediate",
    exerciseType: "compound",
    defaultRest: "120 sec",
    executionCue: "Set bench to 30 degrees, touch bar softly to upper chest/clavicle, press vertical.",
    commonMistake: "Setting angle above 45 degrees, shifting load exclusively to shoulders.",
    rationale: "Emphasizes upper clavicular pectoralis head.",
  },
  {
    id: "ex-hp-5",
    name: "Incline Dumbbell Press",
    movementPattern: "horizontal_push",
    primaryMuscle: "Chest (Clavicular Head)",
    secondaryMuscles: ["Front Delts", "Triceps"],
    equipment: "home_gym",
    difficulty: "intermediate",
    exerciseType: "compound",
    defaultRest: "90 sec",
    executionCue: "Pinch shoulder blades into pad, drive dumbbells straight upward, control descent.",
    commonMistake: "Over-arching lumbar spine to turn it into a flat bench press.",
    rationale: "Excellent upper chest activation with customizable wrist orientation.",
  },
  {
    id: "ex-hp-6",
    name: "Floor Dumbbell Press",
    movementPattern: "horizontal_push",
    primaryMuscle: "Chest (Pectoralis Major)",
    secondaryMuscles: ["Triceps"],
    equipment: "home_gym",
    difficulty: "beginner",
    exerciseType: "compound",
    defaultRest: "75 sec",
    executionCue: "Lie flat on floor, lower upper arms until elbows touch floor softly, pause, then press up.",
    commonMistake: "Bouncing triceps hard off floor instead of controlled pause.",
    rationale: "Protects shoulder joint by limiting excessive hyperextension.",
  },
  {
    id: "ex-hp-7",
    name: "Push-ups",
    movementPattern: "horizontal_push",
    primaryMuscle: "Chest (Pectoralis Major)",
    secondaryMuscles: ["Triceps", "Core / Serratus"],
    equipment: "bodyweight",
    difficulty: "beginner",
    exerciseType: "bodyweight",
    defaultRest: "60 sec",
    executionCue: "Maintain rigid plank from head to heel, tuck elbows 45 degrees, chest touches floor.",
    commonMistake: "Sagging lower back or craning neck forward.",
    rationale: "Fundamental closed-kinetic-chain horizontal push requiring zero equipment.",
  },
  {
    id: "ex-hp-8",
    name: "Diamond Push-ups",
    movementPattern: "horizontal_push",
    primaryMuscle: "Chest (Inner/Triceps)",
    secondaryMuscles: ["Triceps Brachii", "Front Delts"],
    equipment: "bodyweight",
    difficulty: "intermediate",
    exerciseType: "bodyweight",
    defaultRest: "60 sec",
    executionCue: "Thumbs and index fingers touching in diamond shape under sternum, lower controlled.",
    commonMistake: "Elbows flaring excessively wide putting strain on wrists.",
    rationale: "High triceps and inner pectoralis recruitment without equipment.",
  },
  {
    id: "ex-hp-9",
    name: "Parallel Bar Dips",
    movementPattern: "horizontal_push",
    primaryMuscle: "Chest (Sternal/Lower)",
    secondaryMuscles: ["Triceps", "Anterior Deltoids"],
    equipment: "bodyweight",
    difficulty: "intermediate",
    exerciseType: "bodyweight",
    defaultRest: "90 sec",
    executionCue: "Lean torso 20 degrees forward for chest emphasis, lower until elbows reach 90 degrees.",
    commonMistake: "Descending too deep without adequate shoulder mobility.",
    rationale: "High-yield bodyweight compound for lower chest and tricep power.",
  },

  // ==========================================
  // VERTICAL PUSH (Shoulders / Deltoids / Triceps)
  // ==========================================
  {
    id: "ex-vp-1",
    name: "Standing Barbell Overhead Press",
    movementPattern: "vertical_push",
    primaryMuscle: "Shoulders (Anterior Deltoid)",
    secondaryMuscles: ["Lateral Deltoid", "Triceps", "Core"],
    equipment: "commercial_gym",
    difficulty: "intermediate",
    exerciseType: "compound",
    defaultRest: "120 sec",
    executionCue: "Glutes tight, brace core, press straight up clearing face, lock out bar over midfoot.",
    commonMistake: "Excessive backward lean turning movement into an incline press.",
    rationale: "Full-body kinetic chain vertical press with maximum load potential.",
  },
  {
    id: "ex-vp-2",
    name: "Seated Dumbbell Shoulder Press",
    movementPattern: "vertical_push",
    primaryMuscle: "Shoulders (Anterior Deltoid)",
    secondaryMuscles: ["Triceps", "Upper Chest"],
    equipment: "home_gym",
    difficulty: "beginner",
    exerciseType: "compound",
    defaultRest: "90 sec",
    executionCue: "Back supported on bench, start dumbbells at ear level, press up in slight arc.",
    commonMistake: "Clanking dumbbells together at top, losing shoulder tension.",
    rationale: "Stable vertical press ideal for home setups and beginners.",
  },
  {
    id: "ex-vp-3",
    name: "Machine Shoulder Press",
    movementPattern: "vertical_push",
    primaryMuscle: "Shoulders (Deltoids)",
    secondaryMuscles: ["Triceps"],
    equipment: "commercial_gym",
    difficulty: "beginner",
    exerciseType: "compound",
    defaultRest: "75 sec",
    executionCue: "Adjust seat so handles align with chin, drive up smoothly without locking elbows hard.",
    commonMistake: "Slumping shoulders forward into internal rotation.",
    rationale: "Guided path allows safe training to muscular failure.",
  },
  {
    id: "ex-vp-4",
    name: "Pike Push-ups",
    movementPattern: "vertical_push",
    primaryMuscle: "Shoulders (Anterior Deltoid)",
    secondaryMuscles: ["Triceps", "Upper Traps"],
    equipment: "bodyweight",
    difficulty: "intermediate",
    exerciseType: "bodyweight",
    defaultRest: "60 sec",
    executionCue: "Hips high in inverted V shape, lower crown of head forward between hands, press back up.",
    commonMistake: "Flaring elbows out rather than tracking slightly backward.",
    rationale: "Exceptional bodyweight vertical press requiring zero gear.",
  },

  // ==========================================
  // HORIZONTAL PULL (Upper Back / Lats / Rhomboids)
  // ==========================================
  {
    id: "ex-hpl-1",
    name: "Barbell Bent-Over Row",
    movementPattern: "horizontal_pull",
    primaryMuscle: "Back (Rhomboids & Lats)",
    secondaryMuscles: ["Rear Deltoids", "Biceps", "Spinal Erectors"],
    equipment: "commercial_gym",
    difficulty: "intermediate",
    exerciseType: "compound",
    defaultRest: "90 sec",
    executionCue: "Torso hinged at 45 degrees, pull bar toward belly button, lead with elbows.",
    commonMistake: "Yanking torso upright using hip momentum.",
    rationale: "Thickens middle and upper back with heavy loading potential.",
  },
  {
    id: "ex-hpl-2",
    name: "Single-Arm Dumbbell Row",
    movementPattern: "horizontal_pull",
    primaryMuscle: "Back (Latissimus Dorsi)",
    secondaryMuscles: ["Rhomboids", "Biceps"],
    equipment: "home_gym",
    difficulty: "beginner",
    exerciseType: "compound",
    defaultRest: "75 sec",
    executionCue: "Hand on bench, pull dumbbell in an arc toward hip pocket, squeeze lat at top.",
    commonMistake: "Rotating torso excessively to heave weight.",
    rationale: "Unilateral focus minimizes spinal compression and fixes imbalances.",
  },
  {
    id: "ex-hpl-3",
    name: "Seated Cable Row",
    movementPattern: "horizontal_pull",
    primaryMuscle: "Back (Mid-Trapezius & Rhomboids)",
    secondaryMuscles: ["Lats", "Biceps"],
    equipment: "commercial_gym",
    difficulty: "beginner",
    exerciseType: "compound",
    defaultRest: "75 sec",
    executionCue: "Upright posture, drive elbows back behind ribcage, pinch shoulder blades.",
    commonMistake: "Rocking back and forth from lower back.",
    rationale: "Constant tension throughout full contraction and stretch.",
  },
  {
    id: "ex-hpl-4",
    name: "Inverted Bodyweight Row",
    movementPattern: "horizontal_pull",
    primaryMuscle: "Back (Upper Back & Lats)",
    secondaryMuscles: ["Rear Delts", "Biceps", "Core"],
    equipment: "bodyweight",
    difficulty: "beginner",
    exerciseType: "bodyweight",
    defaultRest: "60 sec",
    executionCue: "Hang underneath a stable bar or table, heels on floor, pull chest up to bar.",
    commonMistake: "Sagging hips or failing to touch chest to bar.",
    rationale: "Scalable bodyweight horizontal pull accessible anywhere.",
  },

  // ==========================================
  // VERTICAL PULL (Lats / Upper Back)
  // ==========================================
  {
    id: "ex-vpl-1",
    name: "Pull-ups",
    movementPattern: "vertical_pull",
    primaryMuscle: "Back (Latissimus Dorsi)",
    secondaryMuscles: ["Teres Major", "Biceps", "Rhomboids"],
    equipment: "bodyweight",
    difficulty: "intermediate",
    exerciseType: "bodyweight",
    defaultRest: "90 sec",
    executionCue: "Pronated grip, depress scapulae before pulling, drive elbows to hips, chest to bar.",
    commonMistake: "Kicking legs or cutting range of motion short.",
    rationale: "Premier upper body vertical pulling test of relative strength.",
  },
  {
    id: "ex-vpl-2",
    name: "Chin-ups",
    movementPattern: "vertical_pull",
    primaryMuscle: "Back (Lats & Biceps)",
    secondaryMuscles: ["Biceps Brachii", "Lower Traps"],
    equipment: "bodyweight",
    difficulty: "intermediate",
    exerciseType: "bodyweight",
    defaultRest: "90 sec",
    executionCue: "Supinated palms-facing grip, pull chin clearly over bar, controlled eccentric.",
    commonMistake: "Dropping down quickly without controlling negative.",
    rationale: "Higher bicep activation while building lat width.",
  },
  {
    id: "ex-vpl-3",
    name: "Lat Pulldown",
    movementPattern: "vertical_pull",
    primaryMuscle: "Back (Latissimus Dorsi)",
    secondaryMuscles: ["Biceps", "Mid-Trapezius"],
    equipment: "commercial_gym",
    difficulty: "beginner",
    exerciseType: "compound",
    defaultRest: "75 sec",
    executionCue: "Thighs locked under pads, pull bar smoothly to collarbone, squeeze lats.",
    commonMistake: "Leaning back 45 degrees to turn movement into a row.",
    rationale: "Allows precise progressive overload calibrated to any strength level.",
  },
  {
    id: "ex-vpl-4",
    name: "Resistance Band Pulldown",
    movementPattern: "vertical_pull",
    primaryMuscle: "Back (Latissimus Dorsi)",
    secondaryMuscles: ["Biceps"],
    equipment: "home_gym",
    difficulty: "beginner",
    exerciseType: "compound",
    defaultRest: "60 sec",
    executionCue: "Anchor band high, kneel upright, pull elbows down into back pockets.",
    commonMistake: "Pulling with wrists rather than retracting scapula.",
    rationale: "Home-friendly vertical pull alternative when no pull-up bar is available.",
  },

  // ==========================================
  // SQUAT & QUAD DOMINANT (Quadriceps / Glutes)
  // ==========================================
  {
    id: "ex-sq-1",
    name: "Barbell Back Squat",
    movementPattern: "squat_quad",
    primaryMuscle: "Legs (Quadriceps)",
    secondaryMuscles: ["Gluteus Maximus", "Adductors", "Erectors"],
    equipment: "commercial_gym",
    difficulty: "intermediate",
    exerciseType: "compound",
    defaultRest: "150 sec",
    executionCue: "Feet shoulder-width, break knees and hips together, hit parallel depth, drive through midfoot.",
    commonMistake: "Knees caving inward (valgus collapse) or heels lifting off floor.",
    rationale: "Supreme bilateral lower body hypertrophy and strength stimulus.",
  },
  {
    id: "ex-sq-2",
    name: "Dumbbell Goblet Squat",
    movementPattern: "squat_quad",
    primaryMuscle: "Legs (Quadriceps)",
    secondaryMuscles: ["Glutes", "Core"],
    equipment: "home_gym",
    difficulty: "beginner",
    exerciseType: "compound",
    defaultRest: "90 sec",
    executionCue: "Hold dumbbell against upper chest, sink hips between knees, keep torso proud and upright.",
    commonMistake: "Allowing dumbbell to drift away from chest, bending at waist.",
    rationale: "Teaches optimal squat biomechanics with minimal lumbar stress.",
  },
  {
    id: "ex-sq-3",
    name: "Leg Press",
    movementPattern: "squat_quad",
    primaryMuscle: "Legs (Quadriceps)",
    secondaryMuscles: ["Glutes"],
    equipment: "commercial_gym",
    difficulty: "beginner",
    exerciseType: "compound",
    defaultRest: "90 sec",
    executionCue: "Back flat against pad, descend until knees hit 90 degrees, press through whole foot.",
    commonMistake: "Locking knees with sudden hyperextension at top, or lifting hips off pad.",
    rationale: "High quad volume with zero balance or spinal loading demands.",
  },
  {
    id: "ex-sq-4",
    name: "Bodyweight Squats",
    movementPattern: "squat_quad",
    primaryMuscle: "Legs (Quadriceps)",
    secondaryMuscles: ["Glutes", "Calves"],
    equipment: "bodyweight",
    difficulty: "beginner",
    exerciseType: "bodyweight",
    defaultRest: "60 sec",
    executionCue: "Arms extended forward for balance, descend until thighs parallel floor, stand tall.",
    commonMistake: "Partial shallow depth or letting knees travel sideways.",
    rationale: "Foundation bodyweight pattern suitable for any environment.",
  },
  {
    id: "ex-sq-5",
    name: "Bulgarian Split Squat",
    movementPattern: "squat_quad",
    primaryMuscle: "Legs (Quadriceps & Glutes)",
    secondaryMuscles: ["Hamstrings", "Hip Stabilizers"],
    equipment: "home_gym",
    difficulty: "intermediate",
    exerciseType: "compound",
    defaultRest: "90 sec",
    executionCue: "Rear foot on bench laces down, descend until back knee touches floor, drive through front heel.",
    commonMistake: "Pushing weight off rear foot instead of loading front quad.",
    rationale: "Brutal unilateral quad and glute hypertrophy without spinal compression.",
  },

  // ==========================================
  // HINGE & POSTERIOR CHAIN (Hamstrings / Glutes)
  // ==========================================
  {
    id: "ex-hg-1",
    name: "Barbell Romanian Deadlift",
    movementPattern: "hinge_posterior",
    primaryMuscle: "Legs (Hamstrings & Glutes)",
    secondaryMuscles: ["Spinal Erectors", "Forearms"],
    equipment: "commercial_gym",
    difficulty: "intermediate",
    exerciseType: "compound",
    defaultRest: "120 sec",
    executionCue: "Soft knee bend, push hips backward toward wall, lower bar to mid-shin feeling hamstring stretch.",
    commonMistake: "Rounding lower back or turning movement into a squat.",
    rationale: "High eccentric hamstring tension for posterior chain resilience.",
  },
  {
    id: "ex-hg-2",
    name: "Dumbbell Romanian Deadlift",
    movementPattern: "hinge_posterior",
    primaryMuscle: "Legs (Hamstrings & Glutes)",
    secondaryMuscles: ["Erectors"],
    equipment: "home_gym",
    difficulty: "beginner",
    exerciseType: "compound",
    defaultRest: "90 sec",
    executionCue: "Keep dumbbells grazing thighs, hinge hips back, squeeze glutes at top lockout.",
    commonMistake: "Squatting down rather than keeping shins perpendicular.",
    rationale: "Effective hamstring and glute builder using dumbbells in home gym.",
  },
  {
    id: "ex-hg-3",
    name: "Back Hyperextensions",
    movementPattern: "hinge_posterior",
    primaryMuscle: "Legs (Glutes & Hamstrings)",
    secondaryMuscles: ["Lower Back"],
    equipment: "commercial_gym",
    difficulty: "beginner",
    exerciseType: "compound",
    defaultRest: "60 sec",
    executionCue: "Hips over pad edge, round upper back slightly to isolate glutes, hinge up smoothly.",
    commonMistake: "Violently hyperextending lumbar spine at top.",
    rationale: "Safe isolated posterior chain loading without spinal compression.",
  },
  {
    id: "ex-hg-4",
    name: "Single-Leg Romanian Deadlift",
    movementPattern: "hinge_posterior",
    primaryMuscle: "Legs (Hamstrings & Glutes)",
    secondaryMuscles: ["Ankle Stabilizers"],
    equipment: "bodyweight",
    difficulty: "intermediate",
    exerciseType: "bodyweight",
    defaultRest: "60 sec",
    executionCue: "Extend non-working leg straight back like a lever, hinge forward with flat spine.",
    commonMistake: "Opening hips to the side, losing balance.",
    rationale: "Bodyweight unilateral posterior loading building balance and hamstrings.",
  },

  // ==========================================
  // ISOLATION: ARMS (Biceps & Triceps)
  // ==========================================
  {
    id: "ex-arm-b1",
    name: "Dumbbell Bicep Curl",
    movementPattern: "isolation_biceps",
    primaryMuscle: "Arms (Biceps Brachii)",
    secondaryMuscles: ["Brachialis"],
    equipment: "home_gym",
    difficulty: "beginner",
    exerciseType: "isolation",
    defaultRest: "60 sec",
    executionCue: "Elbows pinned to ribs, supinate wrist at mid-rep, squeeze peak bicep contraction.",
    commonMistake: "Swinging torso to cheat weight up.",
    rationale: "Standard hypertrophy isolation for biceps.",
  },
  {
    id: "ex-arm-b2",
    name: "Barbell Bicep Curl",
    movementPattern: "isolation_biceps",
    primaryMuscle: "Arms (Biceps Brachii)",
    secondaryMuscles: ["Forearms"],
    equipment: "commercial_gym",
    difficulty: "beginner",
    exerciseType: "isolation",
    defaultRest: "60 sec",
    executionCue: "Underhand grip shoulder-width, curl bar in smooth arc, resist eccentric descent.",
    commonMistake: "Elbows drifting forward turning lift into a front delt raise.",
    rationale: "Bilateral overload builder for arms.",
  },
  {
    id: "ex-arm-b3",
    name: "Cable Bicep Curl",
    movementPattern: "isolation_biceps",
    primaryMuscle: "Arms (Biceps Brachii)",
    secondaryMuscles: ["Forearms"],
    equipment: "commercial_gym",
    difficulty: "beginner",
    exerciseType: "isolation",
    defaultRest: "60 sec",
    executionCue: "Continuous cable tension from stretch to full squeeze, keep elbows stationary.",
    commonMistake: "Using back momentum.",
    rationale: "Maintains constant resistance curve throughout rep.",
  },
  {
    id: "ex-arm-t1",
    name: "Cable Tricep Pushdown",
    movementPattern: "isolation_triceps",
    primaryMuscle: "Arms (Triceps Brachii)",
    secondaryMuscles: ["Forearms"],
    equipment: "commercial_gym",
    difficulty: "beginner",
    exerciseType: "isolation",
    defaultRest: "60 sec",
    executionCue: "Elbows tight at sides, extend downward until arms lock out, control 2s eccentric.",
    commonMistake: "Allowing elbows to flare outward or drift forward.",
    rationale: "Direct lateral and medial triceps head isolation.",
  },
  {
    id: "ex-arm-t2",
    name: "Dumbbell Overhead Tricep Extension",
    movementPattern: "isolation_triceps",
    primaryMuscle: "Arms (Triceps Long Head)",
    secondaryMuscles: ["Triceps"],
    equipment: "home_gym",
    difficulty: "beginner",
    exerciseType: "isolation",
    defaultRest: "60 sec",
    executionCue: "Press dumbbell overhead, lower behind head keeping elbows pointed vertical.",
    commonMistake: "Flaring elbows wide or overarching lumbar spine.",
    rationale: "Stretches and targets the triceps long head at maximal muscle length.",
  },
  {
    id: "ex-arm-t3",
    name: "Bench Tricep Dips",
    movementPattern: "isolation_triceps",
    primaryMuscle: "Arms (Triceps Brachii)",
    secondaryMuscles: ["Front Delts"],
    equipment: "bodyweight",
    difficulty: "beginner",
    exerciseType: "bodyweight",
    defaultRest: "60 sec",
    executionCue: "Hands on bench behind hips, lower hips keeping back close to bench, press up.",
    commonMistake: "Hips drifting too far forward straining anterior shoulder capsule.",
    rationale: "Zero-equipment tricep hypertrophy builder.",
  },

  // ==========================================
  // ISOLATION: DELTOIDS & CORE
  // ==========================================
  {
    id: "ex-iso-d1",
    name: "Dumbbell Lateral Raises",
    movementPattern: "isolation_deltoids",
    primaryMuscle: "Shoulders (Lateral Deltoid)",
    secondaryMuscles: ["Traps"],
    equipment: "home_gym",
    difficulty: "beginner",
    exerciseType: "isolation",
    defaultRest: "60 sec",
    executionCue: "Slight forward torso lean, raise elbows to shoulder height in scaption plane.",
    commonMistake: "Shrugging traps or heaving hips to lift weights.",
    rationale: "Essential isolation for shoulder width and aesthetic V-taper.",
  },
  {
    id: "ex-iso-d2",
    name: "Cable Lateral Raises",
    movementPattern: "isolation_deltoids",
    primaryMuscle: "Shoulders (Lateral Deltoid)",
    secondaryMuscles: ["Traps"],
    equipment: "commercial_gym",
    difficulty: "beginner",
    exerciseType: "isolation",
    defaultRest: "60 sec",
    executionCue: "Cable set at wrist or knee height, smooth abduction across body without swinging.",
    commonMistake: "Over-loading weight and performing half reps.",
    rationale: "Smooth continuous resistance at the bottom stretch where dumbbells offer 0 tension.",
  },
  {
    id: "ex-core-1",
    name: "Hanging Leg Raises",
    movementPattern: "core_abs",
    primaryMuscle: "Core (Rectus Abdominis)",
    secondaryMuscles: ["Hip Flexors", "Obliques"],
    equipment: "commercial_gym",
    difficulty: "intermediate",
    exerciseType: "bodyweight",
    defaultRest: "60 sec",
    executionCue: "Hang from pull-up bar, tilt pelvis up, curl knees/legs to chest without swinging.",
    commonMistake: "Swinging legs like a pendulum with zero abdominal curling.",
    rationale: "Premier lower abdominal builder.",
  },
  {
    id: "ex-core-2",
    name: "Forearm Plank",
    movementPattern: "core_abs",
    primaryMuscle: "Core (Transverse & Rectus Abdominis)",
    secondaryMuscles: ["Glutes", "Shoulders"],
    equipment: "bodyweight",
    difficulty: "beginner",
    exerciseType: "bodyweight",
    defaultRest: "45 sec",
    executionCue: "Rigid straight line from heels to crown, squeeze glutes and quads, brace abs.",
    commonMistake: "Hips sagging or butt poking up into the air.",
    rationale: "Fundamental anti-extension core stability exercise requiring no equipment.",
  },
];

/**
 * Normalizes user equipment input to the 3 standard tiers.
 */
export function normalizeUserEquipment(raw?: string | null): EquipmentTier {
  const lower = (raw || "").toLowerCase();
  if (lower.includes("bodyweight") || lower.includes("calisthenics") || lower.includes("home_bodyweight")) {
    return "bodyweight";
  }
  if (lower.includes("home") || lower.includes("dumbbell") || lower.includes("garage")) {
    return "home_gym";
  }
  return "commercial_gym";
}

/**
 * Normalizes user experience input to the 3 standard tiers.
 */
export function normalizeUserExperience(raw?: string | null): ExperienceTier {
  const lower = (raw || "").toLowerCase();
  if (lower.includes("beginner") || lower.includes("novice")) {
    return "beginner";
  }
  if (lower.includes("advanced") || lower.includes("expert")) {
    return "advanced";
  }
  return "intermediate";
}

/**
 * Checks if an exercise's equipment requirement is compatible with user equipment.
 * Hierarchy:
 * - commercial_gym user -> can access commercial_gym, home_gym, bodyweight
 * - home_gym user -> can access home_gym, bodyweight
 * - bodyweight user -> can access bodyweight ONLY
 */
export function isEquipmentCompatible(
  exerciseEquipment: EquipmentTier,
  userEquipment: EquipmentTier
): boolean {
  if (userEquipment === "bodyweight") {
    return exerciseEquipment === "bodyweight";
  }
  if (userEquipment === "home_gym") {
    return exerciseEquipment === "home_gym" || exerciseEquipment === "bodyweight";
  }
  return true; // commercial_gym can access all
}

/**
 * Checks if exercise difficulty is compatible with user experience.
 * Hierarchy:
 * - beginner user -> beginner ONLY
 * - intermediate user -> beginner, intermediate
 * - advanced user -> beginner, intermediate, advanced
 */
export function isExperienceCompatible(
  exerciseDifficulty: ExperienceTier,
  userExperience: ExperienceTier
): boolean {
  if (userExperience === "beginner") {
    return exerciseDifficulty === "beginner";
  }
  if (userExperience === "intermediate") {
    return exerciseDifficulty === "beginner" || exerciseDifficulty === "intermediate";
  }
  return true; // advanced can do all
}

/**
 * Identifies or infers the movement pattern of an exercise by name.
 */
export function inferMovementPattern(exerciseName: string): MovementPattern {
  const lower = exerciseName.toLowerCase();

  if (lower.includes("bench") || lower.includes("chest press") || lower.includes("push-up") || lower.includes("dip") || lower.includes("floor press")) {
    return "horizontal_push";
  }
  if (lower.includes("overhead press") || lower.includes("shoulder press") || lower.includes("military press") || lower.includes("pike")) {
    return "vertical_push";
  }
  if (lower.includes("pull-up") || lower.includes("chin-up") || lower.includes("pulldown") || lower.includes("lat pull")) {
    return "vertical_pull";
  }
  if (lower.includes("row") || lower.includes("inverted row")) {
    return "horizontal_pull";
  }
  if (lower.includes("squat") || lower.includes("leg press") || lower.includes("hack squat")) {
    return "squat_quad";
  }
  if (lower.includes("deadlift") || lower.includes("rdl") || lower.includes("good morning") || lower.includes("hyperextension")) {
    return "hinge_posterior";
  }
  if (lower.includes("lunge") || lower.includes("split squat") || lower.includes("step-up")) {
    return "lunge_unilateral";
  }
  if (lower.includes("lateral raise") || lower.includes("front raise") || lower.includes("face pull")) {
    return "isolation_deltoids";
  }
  if (lower.includes("curl")) {
    return "isolation_biceps";
  }
  if (lower.includes("tricep") || lower.includes("skull crusher") || lower.includes("pushdown")) {
    return "isolation_triceps";
  }
  if (lower.includes("plank") || lower.includes("leg raise") || lower.includes("crunch") || lower.includes("abs")) {
    return "core_abs";
  }

  return "horizontal_push";
}

/**
 * Finds compatible exercise substitutions strictly respecting movement pattern,
 * equipment availability, and experience tier.
 */
export function getExerciseAlternatives(
  currentExerciseName: string,
  rawEquipment?: string | null,
  rawExperience?: string | null
): ExerciseMetadata[] {
  const userEquip = normalizeUserEquipment(rawEquipment);
  const userExp = normalizeUserExperience(rawExperience);

  const normalizedCurrent = currentExerciseName.toLowerCase().trim();

  // Find metadata or infer pattern
  const existingMeta = EXERCISE_SWAP_DATABASE.find(
    (e) => e.name.toLowerCase() === normalizedCurrent || normalizedCurrent.includes(e.name.toLowerCase())
  );

  const targetPattern: MovementPattern = existingMeta
    ? existingMeta.movementPattern
    : inferMovementPattern(currentExerciseName);

  return EXERCISE_SWAP_DATABASE.filter((item) => {
    // 1. Must NOT be the identical exercise
    if (item.name.toLowerCase() === normalizedCurrent) return false;

    // 2. Strict Movement Pattern match
    if (item.movementPattern !== targetPattern) return false;

    // 3. Strict Equipment constraint
    if (!isEquipmentCompatible(item.equipment, userEquip)) return false;

    // 4. Strict Experience constraint
    if (!isExperienceCompatible(item.difficulty, userExp)) return false;

    return true;
  });
}
