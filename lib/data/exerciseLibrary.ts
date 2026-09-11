/**
 * IRONSync Master Exercise Media & Biomechanical Knowledge Base
 * Over 160+ fully-indexed exercises across all 11 anatomical muscle subsystems.
 * Contains CDN video loops, high-res Unsplash imagery, 4-stage execution sequences,
 * tempo mechanics, and calorie burn metrics.
 */

export type MuscleGroup = "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Core" | "Full Body";

export type SubCategory =
  | "Chest"
  | "Back"
  | "Shoulders"
  | "Quads"
  | "Hamstrings"
  | "Glutes"
  | "Calves"
  | "Biceps"
  | "Triceps"
  | "Forearms"
  | "Core"
  | "Full Body";

export interface ExerciseLibraryEntry {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  subCategory: SubCategory;
  targetMuscles: string[];
  secondaryMuscles?: string[];
  equipment: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  mechanics: "Compound" | "Isolation";
  tempo: string;
  timeUnderTension: string;
  breathingCue: string;
  instructions: string[];
  durationMinutes: number;
  caloriesBurnEstimate: number;
  imageUrl: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export const EXERCISE_LIBRARY: ExerciseLibraryEntry[] = [
  {
    "id": "barbell-bench-press",
    "name": "Barbell Bench Press",
    "muscleGroup": "Chest",
    "subCategory": "Chest",
    "targetMuscles": [
      "Pectoralis Major (Sternal)",
      "Anterior Deltoid"
    ],
    "secondaryMuscles": [
      "Triceps Brachii",
      "Serratus Anterior"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "3-0-1-0",
    "timeUnderTension": "45-60s",
    "breathingCue": "Inhale deeply into diaphragm as bar lowers to lower chest; exhale explosively as you drive upward.",
    "instructions": [
      "Lie supine on bench with eyes directly under the racked bar. Retract scapulae and plant feet firmly.",
      "Unrack bar and stabilize directly over mid-chest with wrists stacked over forearms.",
      "Lower bar under control in a slight diagonal trajectory until touching lower sternum.",
      "Drive feet into the floor and press bar up and slightly backward to locked position."
    ],
    "durationMinutes": 12,
    "caloriesBurnEstimate": 120,
    "imageUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "incline-barbell-bench-press",
    "name": "Incline Barbell Bench Press",
    "muscleGroup": "Chest",
    "subCategory": "Chest",
    "targetMuscles": [
      "Upper Pectoralis (Clavicular Head)",
      "Anterior Deltoid"
    ],
    "secondaryMuscles": [
      "Triceps Brachii"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "3-0-1-0",
    "timeUnderTension": "45-60s",
    "breathingCue": "Inhale and brace core on descent to clavicle; exhale as bar punches toward ceiling.",
    "instructions": [
      "Set bench to 30 degrees. Retract shoulder blades into pad and grip bar slightly wider than shoulder width.",
      "Unrack bar and hold over upper chest line.",
      "Lower bar smoothly until it gently touches the upper clavicle area.",
      "Press vertically to lockout without letting shoulders roll forward off the bench."
    ],
    "durationMinutes": 12,
    "caloriesBurnEstimate": 115,
    "imageUrl": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "decline-barbell-bench-press",
    "name": "Decline Barbell Bench Press",
    "muscleGroup": "Chest",
    "subCategory": "Chest",
    "targetMuscles": [
      "Lower Pectoralis (Costal Head)"
    ],
    "secondaryMuscles": [
      "Triceps Brachii",
      "Anterior Deltoid"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "3-0-1-0",
    "timeUnderTension": "40-50s",
    "breathingCue": "Inhale as weight descends to lower ribs; exhale forcefully as you lock out arms.",
    "instructions": [
      "Lock ankles into decline bench roller pads and recline with shoulders retracted.",
      "Unrack bar with medium-wide grip directly above lower chest.",
      "Lower bar under strict control until touching the base of the pectorals.",
      "Drive upward along straight bar path to complete arm extension."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 100,
    "imageUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "flat-dumbbell-press",
    "name": "Flat Dumbbell Press",
    "muscleGroup": "Chest",
    "subCategory": "Chest",
    "targetMuscles": [
      "Pectoralis Major",
      "Anterior Deltoid"
    ],
    "secondaryMuscles": [
      "Triceps Brachii"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "45-55s",
    "breathingCue": "Inhale on lowering phase into deep stretch; exhale on converging press.",
    "instructions": [
      "Sit on flat bench with dumbbells resting on thighs. Kick dumbbells back to chest as you recline.",
      "Position weights with 45-degree inward elbow flare and wrists stacked.",
      "Lower weights over 3 seconds into deep chest stretch.",
      "Press upward in a converging arc, stopping just short of clanking dumbbells at the top."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 100,
    "imageUrl": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "incline-dumbbell-press",
    "name": "Incline Dumbbell Press",
    "muscleGroup": "Chest",
    "subCategory": "Chest",
    "targetMuscles": [
      "Upper Pectoralis (Clavicular Head)"
    ],
    "secondaryMuscles": [
      "Anterior Deltoid",
      "Triceps"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "40-50s",
    "breathingCue": "Inhale into chest during descent; exhale as dumbbells drive toward ceiling.",
    "instructions": [
      "Adjust bench to 30-45 degrees. Hoist dumbbells to shoulders and plant feet flat.",
      "Retract scapulae and stabilize weights directly above clavicles.",
      "Lower dumbbells with elbows angled at 45 degrees until deep stretch in upper pecs.",
      "Drive upward and converge slightly at top without losing tension."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 95,
    "imageUrl": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "decline-dumbbell-press",
    "name": "Decline Dumbbell Press",
    "muscleGroup": "Chest",
    "subCategory": "Chest",
    "targetMuscles": [
      "Lower Pectoralis"
    ],
    "secondaryMuscles": [
      "Triceps Brachii"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "3-0-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale as dumbbells descend; exhale as you push toward ceiling.",
    "instructions": [
      "Secure legs in decline bench, recline while bringing dumbbells to lower chest.",
      "Press dumbbells directly upward over sternum.",
      "Lower under control feeling stretch along bottom chest line.",
      "Press explosively back to starting point."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 85,
    "imageUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "dumbbell-flyes",
    "name": "Flat Dumbbell Flyes",
    "muscleGroup": "Chest",
    "subCategory": "Chest",
    "targetMuscles": [
      "Pectoralis Major (Sternal)"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "3-1-2-0",
    "timeUnderTension": "50s",
    "breathingCue": "Inhale deeply as arms spread wide; exhale as pecs squeeze dumbbells together.",
    "instructions": [
      "Lie on flat bench with dumbbells held directly over chest, slight bend in elbows.",
      "Lower dumbbells in wide arc until feeling pronounced stretch across chest.",
      "Maintain fixed elbow bend throughout the entire eccentric arc.",
      "Contract pecs to bring weights together in a hugging motion."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 75,
    "imageUrl": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "incline-dumbbell-flyes",
    "name": "Incline Dumbbell Flyes",
    "muscleGroup": "Chest",
    "subCategory": "Chest",
    "targetMuscles": [
      "Upper Pectoralis"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "tempo": "3-1-2-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale on outward fly arc; exhale as you bring dumbbells back overhead.",
    "instructions": [
      "Recline on a 30-degree incline bench with dumbbells extended above upper chest.",
      "Lower dumbbells outward in an expansive arc with soft elbows.",
      "Pause for 1 second at maximum comfortable stretch.",
      "Squeeze upper chest fibers to draw weights back together."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 70,
    "imageUrl": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "cable-crossover-high-to-low",
    "name": "High-to-Low Cable Crossover",
    "muscleGroup": "Chest",
    "subCategory": "Chest",
    "targetMuscles": [
      "Lower Pectoralis",
      "Inner Sternal Fibers"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "50-60s",
    "breathingCue": "Inhale as cables retreat high; exhale forcefully as hands cross downward in front of waist.",
    "instructions": [
      "Set pulleys at highest position. Grasp D-handles and step forward into staggered stance.",
      "Keep slight bend in elbows and lean torso forward 15 degrees.",
      "Bring handles down and forward in a sweeping arc toward your pelvis.",
      "Cross hands slightly at bottom and squeeze lower chest peak contraction for 1 full second."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 70,
    "imageUrl": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "cable-crossover-low-to-high",
    "name": "Low-to-High Cable Crossover",
    "muscleGroup": "Chest",
    "subCategory": "Chest",
    "targetMuscles": [
      "Upper Pectoralis (Clavicular)"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "50-60s",
    "breathingCue": "Inhale as handles lower; exhale as palms scoop upward toward chin level.",
    "instructions": [
      "Set pulleys to lowest notch. Grasp handles with palms facing forward.",
      "Step forward one pace with staggered stance and core braced.",
      "Sweep hands upward and inward in an arc toward chin level.",
      "Peak contract upper chest at top before controlled 2-second return."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 70,
    "imageUrl": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "pec-deck-fly-machine",
    "name": "Pec Deck Fly Machine",
    "muscleGroup": "Chest",
    "subCategory": "Chest",
    "targetMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "50s",
    "breathingCue": "Inhale on eccentric opening; exhale as pads/handles meet in front of chest.",
    "instructions": [
      "Adjust seat height so handles align with mid-chest. Press back firmly against pad.",
      "Grasp handles with slight elbow bend and keep wrists neutral.",
      "Draw handles together in front of sternum, squeezing pecs at full contraction.",
      "Return slowly until feeling gentle chest stretch before initiating next rep."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "machine-chest-press",
    "name": "Machine Chest Press",
    "muscleGroup": "Chest",
    "subCategory": "Chest",
    "targetMuscles": [
      "Pectoralis Major"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Anterior Deltoids"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "3-0-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale as handles return to chest; exhale as you push to full arm extension.",
    "instructions": [
      "Set seat height so handles align directly across mid-chest line.",
      "Pin shoulder blades firmly into back pad and grip handles.",
      "Push handles forward until arms are fully extended without shrugging.",
      "Lower handles back slowly over 3 seconds to preserve tension."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 85,
    "imageUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "incline-machine-press",
    "name": "Incline Machine Press",
    "muscleGroup": "Chest",
    "subCategory": "Chest",
    "targetMuscles": [
      "Upper Pectoralis"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Triceps"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "3-0-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale on eccentric descent; exhale as handles drive diagonally upward.",
    "instructions": [
      "Sit back firmly into incline machine seat with chest lifted.",
      "Grasp handles with overhand grip and depress scapulae.",
      "Drive handles upward along machine track to full extension.",
      "Control descent smoothly, stopping just before weights touch stack."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 85,
    "imageUrl": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "push-ups",
    "name": "Push-Ups",
    "muscleGroup": "Chest",
    "subCategory": "Chest",
    "targetMuscles": [
      "Pectoralis Major",
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Core / Abdominals",
      "Serratus Anterior"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "2-0-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale on descent to floor; exhale as palms press floor away.",
    "instructions": [
      "Assume rigid high plank position with hands slightly wider than shoulders.",
      "Tuck elbows at roughly 45 degrees to protect anterior shoulder.",
      "Lower entire body in straight line until chest grazes floor.",
      "Push forcefully through palms to return to full extension."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 70,
    "imageUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "diamond-push-ups",
    "name": "Diamond Push-Ups",
    "muscleGroup": "Chest",
    "subCategory": "Chest",
    "targetMuscles": [
      "Triceps Brachii",
      "Inner Pectoralis"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Core"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "2-0-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale as chest approaches thumbs; exhale pushing floor away.",
    "instructions": [
      "Place index fingers and thumbs together under chest forming diamond shape.",
      "Lock core and glutes in rigid plank.",
      "Lower chest until touching hands while keeping elbows tucked tight to torso.",
      "Press up powerfully through palms to full lockout."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 75,
    "imageUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "wide-grip-push-ups",
    "name": "Wide-Grip Push-Ups",
    "muscleGroup": "Chest",
    "subCategory": "Chest",
    "targetMuscles": [
      "Pectoralis Major (Outer)"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "2-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale as chest sinks; exhale as you push up.",
    "instructions": [
      "Place hands about 6-8 inches wider than standard push-up stance.",
      "Engage core and lower chest directly between palms.",
      "Pause for 1 second at bottom stretch.",
      "Press through outer palms to return to starting plank."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 70,
    "imageUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "weighted-push-ups",
    "name": "Weighted Push-Ups",
    "muscleGroup": "Chest",
    "subCategory": "Chest",
    "targetMuscles": [
      "Pectoralis Major",
      "Triceps"
    ],
    "secondaryMuscles": [
      "Core",
      "Serratus Anterior"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "tempo": "3-0-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale as weighted torso descends; exhale explosively on ascent.",
    "instructions": [
      "Place weight plate securely across mid/upper back or wear weighted vest.",
      "Set standard push-up stance and brace abdominals hard.",
      "Lower under strict 3-second control until chest touches floor.",
      "Drive floor away against added resistance to full lockout."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 95,
    "imageUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "chest-dips",
    "name": "Chest Dips",
    "muscleGroup": "Chest",
    "subCategory": "Chest",
    "targetMuscles": [
      "Lower Pectoralis",
      "Triceps"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale as you lower with forward lean; exhale as you push up.",
    "instructions": [
      "Mount parallel dip bars. Lean torso forward approximately 30 degrees.",
      "Flare elbows slightly outward to bias pectorals over triceps.",
      "Lower body until upper arms are parallel to floor or slight chest stretch is achieved.",
      "Push upward through palms to lock out chest at top."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 90,
    "imageUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "floor-dumbbell-press",
    "name": "Floor Dumbbell Press",
    "muscleGroup": "Chest",
    "subCategory": "Chest",
    "targetMuscles": [
      "Pectoralis Major",
      "Triceps"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "2-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale as triceps contact floor; exhale as dumbbells drive straight up.",
    "instructions": [
      "Lie supine on floor with knees bent and feet planted flat.",
      "Hold dumbbells over chest with elbows at 45-degree angle.",
      "Lower weights until triceps gently rest on the floor for 1 second pause.",
      "Press upward forcefully without letting floor absorb momentum."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 80,
    "imageUrl": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "svend-press",
    "name": "Svend Press",
    "muscleGroup": "Chest",
    "subCategory": "Chest",
    "targetMuscles": [
      "Inner Pectoralis",
      "Anterior Deltoids"
    ],
    "secondaryMuscles": [
      "Biceps Isometric"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-2-2-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale at chest; exhale as plates are pressed forward with continuous inward pinch.",
    "instructions": [
      "Stand tall holding two small weight plates pinched tightly together between flat palms at chest level.",
      "Apply continuous inward squeezing pressure between palms.",
      "Extend arms straight forward horizontally while maintaining maximum chest squeeze.",
      "Pause for 2 seconds at full arm reach before drawing plates back to chest."
    ],
    "durationMinutes": 6,
    "caloriesBurnEstimate": 50,
    "imageUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "barbell-deadlift",
    "name": "Conventional Barbell Deadlift",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Erector Spinae",
      "Latissimus Dorsi",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Trapezius",
      "Forearms"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "tempo": "2-1-1-0",
    "timeUnderTension": "35-45s",
    "breathingCue": "Inhale and Valsalva brace into belt before pull; exhale once bar is fully locked at hips.",
    "instructions": [
      "Stand with midfoot under barbell, feet hip-width apart. Hinge hips back to grip bar outside shins.",
      "Pull chest tall, depress lats, and pull the slack out of the barbell.",
      "Push the floor away through midfoot, keeping bar tracking in close contact with shins.",
      "Lock hips and knees out simultaneously without leaning backward at the top."
    ],
    "durationMinutes": 15,
    "caloriesBurnEstimate": 180,
    "imageUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "sumo-deadlift",
    "name": "Sumo Deadlift",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Adductors",
      "Gluteus Maximus",
      "Erector Spinae"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Trapezius"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "tempo": "2-1-1-0",
    "timeUnderTension": "35-45s",
    "breathingCue": "Big abdominal brace at bottom; exhale as hips drive through to lockout.",
    "instructions": [
      "Set feet wide with toes angled outward toward weight plates. Grip bar inside knees.",
      "Drop hips down and open groin, keeping torso more vertical than conventional stance.",
      "Spread floor apart with feet and drive hips forward into the barbell.",
      "Lock out hips and knees tall under complete control."
    ],
    "durationMinutes": 15,
    "caloriesBurnEstimate": 175,
    "imageUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "barbell-bent-over-row",
    "name": "Barbell Bent-Over Row",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Middle Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoids",
      "Erector Spinae"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "2-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale at arm hang; exhale as bar rows forcefully into lower ribcage/navel.",
    "instructions": [
      "Hinge at hips to 45-degree torso angle, maintaining flat lumbar spine.",
      "Grip bar slightly wider than shoulder width with overhand grip.",
      "Pull bar smoothly to navel by driving elbows up and back.",
      "Pause for 1 second at top contraction before lowering with control."
    ],
    "durationMinutes": 12,
    "caloriesBurnEstimate": 120,
    "imageUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "pendlay-row",
    "name": "Pendlay Row",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Upper Back",
      "Latissimus Dorsi",
      "Rhomboids"
    ],
    "secondaryMuscles": [
      "Posterior Chain",
      "Forearms"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "tempo": "1-0-X-0",
    "timeUnderTension": "35s",
    "breathingCue": "Inhale and brace with bar on floor; exhale explosively as bar hits lower chest.",
    "instructions": [
      "Start each rep with barbell dead-stop on the floor, torso strictly parallel to ground.",
      "Brace core and explosively pull bar to lower sternum without raising hips.",
      "Touch chest briefly then return bar immediately to dead stop on floor.",
      "Reset spinal brace before initiating next repetition."
    ],
    "durationMinutes": 12,
    "caloriesBurnEstimate": 130,
    "imageUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "single-arm-dumbbell-row",
    "name": "Single-Arm Dumbbell Row",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Latissimus Dorsi"
    ],
    "secondaryMuscles": [
      "Rhomboids",
      "Biceps",
      "Rear Deltoid"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "2-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale as dumbbell hangs; exhale pulling elbow up toward hip pocket.",
    "instructions": [
      "Place one knee and hand on flat bench. Torso parallel to floor.",
      "Hold dumbbell in opposite hand hanging vertically below shoulder.",
      "Row weight toward hip crease, driving elbow behind torso.",
      "Lower under control to full lat stretch without rotating spine."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 90,
    "imageUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "t-bar-row",
    "name": "T-Bar Row",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Middle Trapezius",
      "Rhomboids",
      "Lats"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Erector Spinae"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "2-1-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale at bottom stretch; exhale as handles touch chest.",
    "instructions": [
      "Straddle landmine or T-bar machine with close-grip handle attached.",
      "Hinge hips back to 45-degree angle with neutral spine.",
      "Pull handle into lower chest while pulling shoulder blades tightly together.",
      "Lower under control feeling upper back stretch."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 110,
    "imageUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "chest-supported-machine-row",
    "name": "Chest-Supported Machine Row",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Upper Back",
      "Rhomboids",
      "Mid Traps"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rear Delts"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "2-1-1-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale on extension; exhale as handles pull back with chest glued to pad.",
    "instructions": [
      "Adjust seat so chest rests firmly against support pad.",
      "Grasp handles with neutral or pronated grip.",
      "Pull handles back by retracting scapulae, keeping chest firmly against pad.",
      "Hold 1-second peak squeeze before controlled return."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 85,
    "imageUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "seated-cable-row",
    "name": "Seated Cable Row",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Rhomboids",
      "Traps"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Delts"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "2-1-1-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale reaching forward into stretch; exhale pulling handle to navel.",
    "instructions": [
      "Sit on machine with feet on footrests and knees slightly bent.",
      "Grasp V-bar handle and sit upright with tall posture.",
      "Row handle to lower abdomen, pulling elbows back and pinching shoulder blades.",
      "Extend arms smoothly without rounding lower back forward."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 85,
    "imageUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "lat-pulldown-wide-grip",
    "name": "Wide-Grip Lat Pulldown",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Latissimus Dorsi"
    ],
    "secondaryMuscles": [
      "Teres Major",
      "Biceps",
      "Rhomboids"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "3-0-1-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale at top stretch; exhale pulling bar to upper clavicles.",
    "instructions": [
      "Anchor thighs under pads. Grasp bar with wide overhand grip.",
      "Lean back 10 degrees, retract scapulae and pull bar down to upper chest.",
      "Drive elbows downward into ribcage.",
      "Resist weight on 3-second ascent into full overhead stretch."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 85,
    "imageUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "lat-pulldown-close-grip",
    "name": "Close-Grip V-Bar Lat Pulldown",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Lower Latissimus Dorsi"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Rhomboids"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "3-0-1-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale stretching high; exhale pulling handle to mid-chest.",
    "instructions": [
      "Attach V-bar to lat pulldown cable. Sit with legs anchored.",
      "Pull handle straight down to upper chest, leading with elbows.",
      "Hold squeeze for 1 second feeling deep lower lat contraction.",
      "Let cable pull arms back up into full overhead extension."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 85,
    "imageUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "lat-pulldown-reverse-grip",
    "name": "Reverse-Grip Underhand Lat Pulldown",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Lower Trapezius"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "3-0-1-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale on ascent; exhale pulling bar down.",
    "instructions": [
      "Grip bar shoulder-width with underhand (supinated) grip.",
      "Pull bar down to upper chest, driving elbows down and tight to body.",
      "Squeeze lats and biceps firmly at bottom.",
      "Extend arms smoothly back to start position."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 85,
    "imageUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "pull-ups",
    "name": "Pull-Ups (Overhand)",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Lower Trapezius"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "2-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale at dead hang; exhale as chin clears bar.",
    "instructions": [
      "Grasp pull-up bar with overhand grip wider than shoulders.",
      "Hang completely motionless in full dead hang.",
      "Depress scapulae and pull chest toward bar until chin clears.",
      "Lower under control over 2-3 seconds back to dead hang."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 95,
    "imageUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "chin-ups",
    "name": "Chin-Ups (Underhand)",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Rhomboids",
      "Pectoralis Minor"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "2-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale at hang; exhale as chest approaches bar.",
    "instructions": [
      "Grip bar shoulder-width with palms facing you (supinated grip).",
      "Pull body up vertically until upper chest touches bar.",
      "Squeeze biceps and lats at peak height.",
      "Lower under strict control back to full arm extension."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 95,
    "imageUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "neutral-grip-pull-ups",
    "name": "Neutral-Grip Pull-Ups",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Brachialis"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Upper Back"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "2-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale hanging; exhale pulling upward.",
    "instructions": [
      "Grasp parallel neutral handles with palms facing each other.",
      "Pull body upward keeping elbows tracking directly forward.",
      "Drive chin over handles and hold 1-second peak squeeze.",
      "Lower under control back to starting dead hang."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 95,
    "imageUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "straight-arm-cable-pulldown",
    "name": "Straight-Arm Cable Pulldown",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Latissimus Dorsi (Isolation)",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Triceps Long Head",
      "Core"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale at head height; exhale pulling bar in sweeping arc to thighs.",
    "instructions": [
      "Attach straight bar to high cable. Hinge hips back slightly with arms extended.",
      "Keep elbows locked with very soft bend.",
      "Pull bar down in a sweeping circular arc until touching upper thighs.",
      "Squeeze lats hard at bottom before slowly letting bar rise back up."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 70,
    "imageUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "face-pulls",
    "name": "Cable Face Pulls",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Rear Deltoids",
      "Rhomboids",
      "External Rotators"
    ],
    "secondaryMuscles": [
      "Trapezius"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "50s",
    "breathingCue": "Inhale with arms extended; exhale pulling rope to nose/forehead.",
    "instructions": [
      "Attach rope to eye-level cable. Grasp ends with thumbs pointed backward.",
      "Step back and pull rope directly toward bridge of nose.",
      "Externally rotate shoulders at end range, pulling knuckles past ears.",
      "Hold peak contraction for 1 second, then extend arms smoothly."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "hyperextensions-back-extensions",
    "name": "Hyperextensions (Back Extensions)",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Erector Spinae",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-1-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale lowering torso; exhale extending spine to straight line.",
    "instructions": [
      "Lock ankles in 45-degree hyperextension bench with pad below hip crease.",
      "Cross arms over chest or hold plate. Lower torso toward floor by hinging at hips.",
      "Raise torso by contracting glutes and spinal erectors until body forms straight line.",
      "Do not hyperextend lumbar spine past neutral at top."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "barbell-shrugs",
    "name": "Barbell Shrugs",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Upper Trapezius"
    ],
    "secondaryMuscles": [
      "Levator Scapulae",
      "Forearms"
    ],
    "equipment": "Barbell",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "1-1-2-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale at hang; exhale shrugging shoulders to ears.",
    "instructions": [
      "Stand holding loaded barbell at thighs with shoulder-width grip.",
      "Keep arms completely straight without bending elbows.",
      "Shrug shoulders straight up toward ears as high as possible.",
      "Hold peak contraction for 1 second before lowering slowly."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 70,
    "imageUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "dumbbell-shrugs",
    "name": "Dumbbell Shrugs",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Upper Trapezius"
    ],
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "1-1-2-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale at sides; exhale shrugging vertically.",
    "instructions": [
      "Hold heavy dumbbells at your sides with neutral grip.",
      "Elevate shoulders straight up toward ears without rolling shoulders.",
      "Hold 1-second maximal squeeze at the summit.",
      "Lower under tension back to full downward stretch."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 70,
    "imageUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "rack-pulls",
    "name": "Barbell Rack Pulls",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Upper Back",
      "Trapezius",
      "Erector Spinae"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Forearms"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "tempo": "2-1-1-0",
    "timeUnderTension": "35s",
    "breathingCue": "Valsalva brace before unpinning; exhale at hip lockout.",
    "instructions": [
      "Set rack safety pins so barbell rests at knee height.",
      "Assume conventional deadlift stance and grip bar tightly.",
      "Brace core, engage lats, and drive hips forward to pull bar off pins.",
      "Lock out hips tall, then lower bar under control back to pins."
    ],
    "durationMinutes": 12,
    "caloriesBurnEstimate": 140,
    "imageUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "inverted-row",
    "name": "Inverted Bodyweight Row",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Rhomboids",
      "Mid Trapezius",
      "Lats"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Core"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "2-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale at arm hang; exhale pulling chest to bar.",
    "instructions": [
      "Set barbell in rack at waist height. Hang underneath with heels on floor and body straight.",
      "Grip bar wider than shoulders with overhand grip.",
      "Pull chest to touch bar by driving elbows back.",
      "Lower slowly until arms are fully extended."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 75,
    "imageUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "incline-dumbbell-row",
    "name": "Incline Chest-Supported Dumbbell Row",
    "muscleGroup": "Back",
    "subCategory": "Back",
    "targetMuscles": [
      "Upper Back",
      "Rhomboids",
      "Rear Delts"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Lats"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "2-1-1-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale reaching down; exhale rowing dumbbells to hips.",
    "instructions": [
      "Lie face down on a 45-degree incline bench holding dumbbells.",
      "Let arms hang straight down with palms facing each other.",
      "Row dumbbells toward hip pockets, squeezing upper back.",
      "Lower under control feeling upper back stretch."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 85,
    "imageUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "standing-overhead-press",
    "name": "Standing Barbell Overhead Press (OHP)",
    "muscleGroup": "Shoulders",
    "subCategory": "Shoulders",
    "targetMuscles": [
      "Anterior Deltoid",
      "Lateral Deltoid"
    ],
    "secondaryMuscles": [
      "Triceps Brachii",
      "Upper Chest",
      "Core"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "tempo": "2-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale and brace core at collarbone; exhale as bar punches overhead past forehead.",
    "instructions": [
      "Grip bar just outside shoulders and rest across front delts.",
      "Squeeze glutes and quads rigid. Pull chin back slightly to clear bar path.",
      "Press bar vertically in straight line, pushing head through window at top.",
      "Lower bar controlled back to front clavicle rest position."
    ],
    "durationMinutes": 12,
    "caloriesBurnEstimate": 110,
    "imageUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "seated-dumbbell-shoulder-press",
    "name": "Seated Dumbbell Shoulder Press",
    "muscleGroup": "Shoulders",
    "subCategory": "Shoulders",
    "targetMuscles": [
      "Anterior Deltoid",
      "Lateral Deltoid"
    ],
    "secondaryMuscles": [
      "Triceps Brachii",
      "Trapezius"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "3-0-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale lowering weights to ear level; exhale pressing overhead.",
    "instructions": [
      "Sit upright on vertical bench with dumbbells held at shoulder level.",
      "Angle palms slightly inward in scaption plane (30 degrees).",
      "Press dumbbells straight overhead until arms are extended.",
      "Lower smoothly over 3 seconds back to ear level."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 90,
    "imageUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "arnold-press",
    "name": "Arnold Dumbbell Press",
    "muscleGroup": "Shoulders",
    "subCategory": "Shoulders",
    "targetMuscles": [
      "Anterior Deltoid",
      "Lateral Deltoid"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Rotator Cuff"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale at chest chin-level; exhale rotating and pressing upward.",
    "instructions": [
      "Hold dumbbells in front of chest with palms facing you (supinated).",
      "As you press up, rotate wrists outward so palms face forward at top.",
      "Extend arms fully overhead in locked position.",
      "Reverse rotation smoothly on eccentric descent back to chin."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 95,
    "imageUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "push-press",
    "name": "Push Press",
    "muscleGroup": "Shoulders",
    "subCategory": "Shoulders",
    "targetMuscles": [
      "Deltoids",
      "Triceps"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Glutes",
      "Core"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "tempo": "1-0-X-1",
    "timeUnderTension": "35s",
    "breathingCue": "Inhale into dip; exhale explosively driving bar through ceiling.",
    "instructions": [
      "Hold barbell in front rack position. Dip knees 3-4 inches keeping torso upright.",
      "Drive legs explosively and transfer momentum into upper body press.",
      "Lock bar out overhead with arms fully extended.",
      "Absorb bar softly back onto front deltoids and reset."
    ],
    "durationMinutes": 12,
    "caloriesBurnEstimate": 130,
    "imageUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "smith-machine-shoulder-press",
    "name": "Smith Machine Shoulder Press",
    "muscleGroup": "Shoulders",
    "subCategory": "Shoulders",
    "targetMuscles": [
      "Anterior Deltoid"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Upper Traps"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "3-0-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale on lowering phase; exhale pressing bar straight up.",
    "instructions": [
      "Position upright bench under Smith machine bar. Unhook bar at chin level.",
      "Lower bar under control until it reaches chin or upper chest.",
      "Press bar upward to full extension without arching back.",
      "Rerack safely by twisting wrists at completion."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 85,
    "imageUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "dumbbell-lateral-raise",
    "name": "Dumbbell Lateral Raise",
    "muscleGroup": "Shoulders",
    "subCategory": "Shoulders",
    "targetMuscles": [
      "Lateral Deltoid"
    ],
    "secondaryMuscles": [
      "Trapezius",
      "Supraspinatus"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "45-50s",
    "breathingCue": "Inhale at hips; exhale raising arms outward leading with elbows.",
    "instructions": [
      "Stand with dumbbells at sides, slight 10-degree forward torso lean.",
      "Raise arms out to sides with slight bend in elbows until parallel to floor.",
      "Pour water pitcher cue: tilt pinkies slightly higher than thumbs.",
      "Control descent over 2 seconds without letting weights swing."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "cable-lateral-raise",
    "name": "Single-Arm Cable Lateral Raise",
    "muscleGroup": "Shoulders",
    "subCategory": "Shoulders",
    "targetMuscles": [
      "Lateral Deltoid"
    ],
    "secondaryMuscles": [
      "Supraspinatus"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale at hip; exhale abducting arm outward to shoulder height.",
    "instructions": [
      "Set cable pulley to lowest setting. Grasp handle with opposite hand.",
      "Stand tall and raise arm outward across body to shoulder level.",
      "Pause 1 second at peak contraction under constant cable tension.",
      "Lower arm slowly back across body."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "machine-lateral-raise",
    "name": "Machine Lateral Raise",
    "muscleGroup": "Shoulders",
    "subCategory": "Shoulders",
    "targetMuscles": [
      "Lateral Deltoid"
    ],
    "secondaryMuscles": [
      "Trapezius"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale at bottom; exhale pushing pads upward.",
    "instructions": [
      "Sit in machine with elbow pads aligned with shoulder axis.",
      "Push pads upward with elbows until upper arms are parallel to floor.",
      "Squeeze lateral deltoids firmly at top.",
      "Lower under control back to starting rest."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "barbell-front-raise",
    "name": "Barbell Front Raise",
    "muscleGroup": "Shoulders",
    "subCategory": "Shoulders",
    "targetMuscles": [
      "Anterior Deltoid"
    ],
    "secondaryMuscles": [
      "Upper Chest",
      "Serratus Anterior"
    ],
    "equipment": "Barbell",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale at thighs; exhale raising bar to eye level.",
    "instructions": [
      "Stand holding barbell across thighs with overhand shoulder-width grip.",
      "Keep arms straight with minimal elbow bend.",
      "Raise bar forward until directly at eye level.",
      "Lower under control without swinging hips."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "dumbbell-front-raise",
    "name": "Alternating Dumbbell Front Raise",
    "muscleGroup": "Shoulders",
    "subCategory": "Shoulders",
    "targetMuscles": [
      "Anterior Deltoid"
    ],
    "secondaryMuscles": [
      "Upper Chest"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale at rest; exhale raising dumbbell forward.",
    "instructions": [
      "Stand holding dumbbells at thighs with neutral or pronated grip.",
      "Raise one dumbbell forward to shoulder level under strict control.",
      "Lower slowly while raising opposite dumbbell.",
      "Keep core tight and prevent backward torso sway."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "rear-delt-dumbbell-fly",
    "name": "Bent-Over Rear Delt Dumbbell Fly",
    "muscleGroup": "Shoulders",
    "subCategory": "Shoulders",
    "targetMuscles": [
      "Posterior Deltoid"
    ],
    "secondaryMuscles": [
      "Rhomboids",
      "Infraspinatus"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale hanging; exhale sweeping dumbbells out like wings.",
    "instructions": [
      "Hinge at hips until torso is nearly parallel to floor.",
      "Hold light dumbbells hanging vertically with soft elbows.",
      "Raise arms out to sides like wings leading with pinkies.",
      "Squeeze rear delts at peak before lowering under control."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "rear-delt-cable-fly",
    "name": "Reverse Cable Fly (Rear Delts)",
    "muscleGroup": "Shoulders",
    "subCategory": "Shoulders",
    "targetMuscles": [
      "Posterior Deltoid"
    ],
    "secondaryMuscles": [
      "Mid Traps",
      "Rhomboids"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale as cables cross; exhale opening arms wide.",
    "instructions": [
      "Set dual cables at head height without attachments. Grasp opposite cables.",
      "Stand centered and pull arms horizontally outward and backward.",
      "Focus mechanical tension strictly onto back of shoulders.",
      "Return slowly to cross in front of chest."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "upright-barbell-row",
    "name": "Upright Barbell Row",
    "muscleGroup": "Shoulders",
    "subCategory": "Shoulders",
    "targetMuscles": [
      "Lateral Deltoid",
      "Upper Trapezius"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Brachialis"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "2-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale at thighs; exhale pulling bar up chest leading with elbows.",
    "instructions": [
      "Hold barbell with grip shoulder-width apart at thighs.",
      "Pull bar vertically along torso leading with elbows high and wide.",
      "Stop when bar reaches mid-chest (do not exceed shoulder line).",
      "Lower under control over 2 seconds."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 75,
    "imageUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "upright-cable-row",
    "name": "Upright Cable Row",
    "muscleGroup": "Shoulders",
    "subCategory": "Shoulders",
    "targetMuscles": [
      "Lateral Deltoid",
      "Upper Traps"
    ],
    "secondaryMuscles": [
      "Biceps"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "2-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale at bottom; exhale rowing rope up to chest.",
    "instructions": [
      "Attach rope or straight bar to low pulley.",
      "Row upward along chest line, driving elbows high.",
      "Squeeze lateral delts at top for 1 second.",
      "Lower smoothly back to arm extension."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 70,
    "imageUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "lu-raises",
    "name": "Lu Raises (Full ROM Lateral Raise)",
    "muscleGroup": "Shoulders",
    "subCategory": "Shoulders",
    "targetMuscles": [
      "Lateral Deltoid",
      "Trapezius"
    ],
    "secondaryMuscles": [
      "Scapular Stabilizers"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "tempo": "3-1-2-0",
    "timeUnderTension": "50s",
    "breathingCue": "Inhale at bottom; exhale raising weights all the way overhead.",
    "instructions": [
      "Hold light weight plates or dumbbells at your thighs.",
      "Raise arms out laterally through full 180-degree arc until touching overhead.",
      "Maintain active control at top overhead position.",
      "Lower through complete wide arc over 3 controlled seconds."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 70,
    "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "landmine-shoulder-press",
    "name": "Single-Arm Landmine Shoulder Press",
    "muscleGroup": "Shoulders",
    "subCategory": "Shoulders",
    "targetMuscles": [
      "Anterior Deltoid",
      "Serratus Anterior"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Core"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "2-0-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale at shoulder; exhale pressing diagonally upward.",
    "instructions": [
      "Hold end of landmine bar at shoulder with neutral grip in split stance.",
      "Press bar upward and forward at natural 45-degree angle.",
      "Reach through serratus at top lockout.",
      "Lower under control back to shoulder shelf."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 85,
    "imageUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "behind-the-neck-press",
    "name": "Behind-the-Neck Barbell Press",
    "muscleGroup": "Shoulders",
    "subCategory": "Shoulders",
    "targetMuscles": [
      "Lateral & Posterior Deltoid"
    ],
    "secondaryMuscles": [
      "Triceps",
      "Traps"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "tempo": "3-0-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale lowering behind head to ear level; exhale pressing overhead.",
    "instructions": [
      "Sit on vertical bench with wide grip on barbell.",
      "Lower bar slowly behind head only to ear level under strict control.",
      "Press bar vertically overhead to lockout.",
      "Only perform if having sufficient shoulder external rotation mobility."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 90,
    "imageUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "dumbbell-y-raise",
    "name": "Incline Prone Dumbbell Y-Raise",
    "muscleGroup": "Shoulders",
    "subCategory": "Shoulders",
    "targetMuscles": [
      "Lower Trapezius",
      "Rear Delts"
    ],
    "secondaryMuscles": [
      "Rotator Cuff"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale at bottom; exhale raising arms in Y formation with thumbs up.",
    "instructions": [
      "Lie face down on 30-degree incline bench with light dumbbells.",
      "Raise arms diagonally forward into a 'Y' shape with thumbs pointed up.",
      "Squeeze lower trapezius and rear deltoids at peak contraction.",
      "Lower slowly over 2 seconds."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 55,
    "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "barbell-back-squat",
    "name": "Barbell Back Squat",
    "muscleGroup": "Legs",
    "subCategory": "Quads",
    "targetMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Adductors",
      "Core"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "45-60s",
    "breathingCue": "Valsalva diaphragmatic inhale at top; hold through parallel depth; exhale past sticking point.",
    "instructions": [
      "Rack bar on upper traps. Unrack with 2-step walkout, feet slightly wider than shoulders.",
      "Break hips and knees together, descending until hip crease is below knee line.",
      "Keep knees tracking inline with second toes and chest proud.",
      "Drive the floor away through midfoot to return to standing lockout."
    ],
    "durationMinutes": 15,
    "caloriesBurnEstimate": 160,
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "barbell-front-squat",
    "name": "Barbell Front Squat",
    "muscleGroup": "Legs",
    "subCategory": "Quads",
    "targetMuscles": [
      "Quadriceps (Vastus Medialis/Lateralis)"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Upper Back",
      "Core"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale deeply into chest; keep elbows high; exhale standing up.",
    "instructions": [
      "Rest bar across anterior deltoids in clean grip or cross-arm rack. Elbows held high.",
      "Descend vertically with upright torso until full deep squat depth.",
      "Prevent elbows from dropping as you hit the bottom turnaround.",
      "Drive straight up through midfoot to lockout."
    ],
    "durationMinutes": 15,
    "caloriesBurnEstimate": 155,
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "zercher-squat",
    "name": "Zercher Squat",
    "muscleGroup": "Legs",
    "subCategory": "Quads",
    "targetMuscles": [
      "Quadriceps",
      "Core",
      "Upper Back"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Biceps Isometric"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Brace hard against crooks of elbows; exhale on ascent.",
    "instructions": [
      "Cradle barbell in crooks of elbows with hands clasped tight against chest.",
      "Squat down with upright torso, allowing elbows to track inside knees.",
      "Hit deep parallel position without rounding upper spine.",
      "Drive out of hole with strong quad contraction."
    ],
    "durationMinutes": 12,
    "caloriesBurnEstimate": 150,
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "goblet-squat",
    "name": "Dumbbell Goblet Squat",
    "muscleGroup": "Legs",
    "subCategory": "Quads",
    "targetMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Core",
      "Calves"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale descending into hips; exhale standing tall.",
    "instructions": [
      "Hold dumbbell vertically against upper sternum like a goblet.",
      "Squat between legs, letting elbows track inside knees at bottom.",
      "Keep chest tall and heels glued to the floor.",
      "Push through floor to full hip extension."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 100,
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "hack-squat-machine",
    "name": "Hack Squat Machine",
    "muscleGroup": "Legs",
    "subCategory": "Quads",
    "targetMuscles": [
      "Quadriceps"
    ],
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Machine",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "45-50s",
    "breathingCue": "Inhale as sled lowers; exhale driving sled away.",
    "instructions": [
      "Step onto platform, resting shoulders snugly under pads with back pinned.",
      "Release safety handles and lower carriage until knees bend to 90 degrees.",
      "Keep knees aligned over toes throughout the descent.",
      "Drive through whole foot to press carriage up, stopping just short of locking knees."
    ],
    "durationMinutes": 12,
    "caloriesBurnEstimate": 130,
    "imageUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "45-degree-leg-press",
    "name": "45° Incline Leg Press",
    "muscleGroup": "Legs",
    "subCategory": "Quads",
    "targetMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Adductors",
      "Hamstrings"
    ],
    "equipment": "Machine",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "50s",
    "breathingCue": "Inhale lowering sled toward chest; exhale driving platform away.",
    "instructions": [
      "Place feet shoulder-width on platform, middle-height for quad emphasis.",
      "Lower weight sled under control until knees reach 90 degrees without lower back rounding.",
      "Drive platform away through midfoot.",
      "Never lock out knees aggressively at top of stroke."
    ],
    "durationMinutes": 12,
    "caloriesBurnEstimate": 125,
    "imageUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "single-leg-press",
    "name": "Single-Leg Press",
    "muscleGroup": "Legs",
    "subCategory": "Quads",
    "targetMuscles": [
      "Quadriceps (Unilateral)"
    ],
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Machine",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale on descent; exhale on single-leg drive.",
    "instructions": [
      "Place one foot centered on leg press platform, other foot rested safely on ground.",
      "Lower sled smoothly feeling deep quad stretch.",
      "Drive platform upward with working leg.",
      "Switch legs and maintain equal repetition cadence."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 110,
    "imageUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "bulgarian-split-squat",
    "name": "Bulgarian Split Squat",
    "muscleGroup": "Legs",
    "subCategory": "Quads",
    "targetMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Core"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale dropping into split squat; exhale pressing up through front heel.",
    "instructions": [
      "Place rear foot laces-down on bench two feet behind you.",
      "Hold dumbbells at sides and descend until rear knee hovers an inch above floor.",
      "Keep 85% of load balanced through front working heel.",
      "Drive straight up to lockout."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 110,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "walking-dumbbell-lunges",
    "name": "Walking Dumbbell Lunges",
    "muscleGroup": "Legs",
    "subCategory": "Quads",
    "targetMuscles": [
      "Quadriceps",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Calves"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "2-0-1-0",
    "timeUnderTension": "60s",
    "breathingCue": "Inhale stepping forward; exhale driving up and through into next stride.",
    "instructions": [
      "Hold dumbbells at sides with tall posture.",
      "Step forward smoothly, lowering trailing knee until lightly kissing floor.",
      "Drive through lead heel to stand and step immediately into next stride.",
      "Maintain upright torso and strong balance throughout."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 120,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "reverse-lunges",
    "name": "Reverse Dumbbell Lunges",
    "muscleGroup": "Legs",
    "subCategory": "Quads",
    "targetMuscles": [
      "Quadriceps",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "2-0-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale stepping back; exhale driving through front leg to return.",
    "instructions": [
      "Stand tall holding dumbbells at sides.",
      "Take a controlled step backward and sink hips until back knee hovers over floor.",
      "Drive through front heel to step back to starting position.",
      "Alternate legs each repetition."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 100,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "barbell-step-ups",
    "name": "Barbell / Dumbbell Step-Ups",
    "muscleGroup": "Legs",
    "subCategory": "Quads",
    "targetMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Calves"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "2-0-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale on floor; exhale driving foot down into box to elevate.",
    "instructions": [
      "Place one foot firmly on 18-24 inch plyo box.",
      "Drive through heel of elevated leg to stand tall on box.",
      "Do not push off rear foot; isolate working leg.",
      "Step down under slow control."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 105,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "leg-extensions-machine",
    "name": "Leg Extensions (Machine)",
    "muscleGroup": "Legs",
    "subCategory": "Quads",
    "targetMuscles": [
      "Quadriceps (Rectus Femoris)"
    ],
    "secondaryMuscles": [
      "Patellar Tendon Stabilizers"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale bending knees back; exhale kicking shin pad up.",
    "instructions": [
      "Set machine so shin pad rests just above ankles, knees aligned with pivot point.",
      "Extend legs fully until quads contract maximally.",
      "Hold 1-second peak squeeze at full leg lockout.",
      "Lower weight slowly over 2 seconds."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 70,
    "imageUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "sissy-squat",
    "name": "Sissy Squat (Bodyweight / Weighted)",
    "muscleGroup": "Legs",
    "subCategory": "Quads",
    "targetMuscles": [
      "Quadriceps (Distal Quad Focus)"
    ],
    "secondaryMuscles": [
      "Core"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Advanced",
    "mechanics": "Isolation",
    "tempo": "3-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale leaning torso back and bending knees; exhale driving quads up.",
    "instructions": [
      "Stand holding stable upright post for balance. Rise onto toes.",
      "Push knees forward while leaning torso backward in straight plane.",
      "Descend until quads experience intense stretch.",
      "Contract quads to pull body back upright."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 75,
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "cyclist-squat",
    "name": "Heels-Elevated Cyclist Squat",
    "muscleGroup": "Legs",
    "subCategory": "Quads",
    "targetMuscles": [
      "Quadriceps (VMO / Teardrop)"
    ],
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale sinking deep into knees; exhale pressing upright.",
    "instructions": [
      "Elevate heels 2-3 inches on wedge or plate with narrow foot stance.",
      "Squat straight down with vertical torso, letting knees track far forward over toes.",
      "Achieve full knee flexion stretch in teardrop quad.",
      "Drive up through balls of feet."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 100,
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "box-squat",
    "name": "Barbell Box Squat",
    "muscleGroup": "Legs",
    "subCategory": "Quads",
    "targetMuscles": [
      "Quadriceps",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Core"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "2-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale sitting back to box; exhale exploding off box.",
    "instructions": [
      "Set 12-14 inch box behind squat stance.",
      "Sit back onto box under complete control without plopping or relaxing core.",
      "Pause for 1 second on box keeping spine braced.",
      "Drive explosively off box to standing lockout."
    ],
    "durationMinutes": 12,
    "caloriesBurnEstimate": 130,
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "wall-sit",
    "name": "Isometric Wall Sit",
    "muscleGroup": "Legs",
    "subCategory": "Quads",
    "targetMuscles": [
      "Quadriceps (Isometric)"
    ],
    "secondaryMuscles": [
      "Calves",
      "Core"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "Isometric",
    "timeUnderTension": "45-60s",
    "breathingCue": "Maintain slow, steady diaphragmatic breathing through hold.",
    "instructions": [
      "Lean back against flat wall and slide down until thighs are parallel to floor.",
      "Knees stacked directly above ankles at 90-degree angles.",
      "Press entire spine flat against wall.",
      "Hold position under continuous quad tension for assigned duration."
    ],
    "durationMinutes": 6,
    "caloriesBurnEstimate": 50,
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "romanian-deadlift",
    "name": "Barbell Romanian Deadlift (RDL)",
    "muscleGroup": "Legs",
    "subCategory": "Hamstrings",
    "targetMuscles": [
      "Hamstrings (Biceps Femoris)",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Erector Spinae",
      "Forearms"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "45-55s",
    "breathingCue": "Inhale pushing hips back into deep stretch; exhale snapping hips forward into lockout.",
    "instructions": [
      "Stand tall holding barbell against thighs with soft, fixed 15-degree knee bend.",
      "Push hips directly backward as if touching a wall behind you.",
      "Slide bar down shins until hamstrings reach maximal stretch at mid-shin.",
      "Drive hips forward into the bar to return upright."
    ],
    "durationMinutes": 12,
    "caloriesBurnEstimate": 130,
    "imageUrl": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "dumbbell-romanian-deadlift",
    "name": "Dumbbell Romanian Deadlift",
    "muscleGroup": "Legs",
    "subCategory": "Hamstrings",
    "targetMuscles": [
      "Hamstrings",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Lower Back"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale hinging hips back; exhale standing tall.",
    "instructions": [
      "Hold pair of heavy dumbbells in front of thighs with neutral wrists.",
      "Hinge hips back while keeping dumbbells glued close to legs.",
      "Descend to mid-shin level while feeling intense hamstring stretch.",
      "Contract hamstrings and squeeze glutes to return tall."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 110,
    "imageUrl": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "stiff-legged-deadlift",
    "name": "Stiff-Legged Barbell Deadlift",
    "muscleGroup": "Legs",
    "subCategory": "Hamstrings",
    "targetMuscles": [
      "Hamstrings",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Erector Spinae"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale lowering bar toward floor; exhale pulling through hamstrings.",
    "instructions": [
      "Stand with knees nearly locked straight (minimal bend).",
      "Hinge at waist and lower bar directly over toes toward floor.",
      "Focus entire load along high hamstring attachments.",
      "Pull torso upright through hamstring strength alone."
    ],
    "durationMinutes": 12,
    "caloriesBurnEstimate": 125,
    "imageUrl": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "barbell-good-mornings",
    "name": "Barbell Good Mornings",
    "muscleGroup": "Legs",
    "subCategory": "Hamstrings",
    "targetMuscles": [
      "Hamstrings",
      "Erector Spinae"
    ],
    "secondaryMuscles": [
      "Glutes"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale hinging forward; exhale extending hips back upright.",
    "instructions": [
      "Rest barbell across upper traps like a high-bar squat. Soften knees.",
      "Hinge hips backward until torso is roughly parallel to floor.",
      "Feel deep stretch across hamstrings while maintaining flat spine.",
      "Drive hips forward to stand upright."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 100,
    "imageUrl": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "lying-leg-curl-machine",
    "name": "Lying Leg Curl Machine",
    "muscleGroup": "Legs",
    "subCategory": "Hamstrings",
    "targetMuscles": [
      "Hamstrings (Knee Flexion Focus)"
    ],
    "secondaryMuscles": [
      "Gastrocnemius"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale extending legs; exhale curling heels forcefully to glutes.",
    "instructions": [
      "Lie face down on machine with roller pad rested on Achilles tendons.",
      "Anchor hips firmly into pad by gripping handles.",
      "Curl heels up to touch glutes, squeezing hamstrings at peak contraction.",
      "Lower slowly over 2 seconds into full stretch."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 70,
    "imageUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "seated-leg-curl-machine",
    "name": "Seated Leg Curl Machine",
    "muscleGroup": "Legs",
    "subCategory": "Hamstrings",
    "targetMuscles": [
      "Hamstrings (Lengthened State)"
    ],
    "secondaryMuscles": [
      "Calves"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale legs rising; exhale pulling pad under seat.",
    "instructions": [
      "Sit with thighs clamped securely under top pad and roller behind ankles.",
      "Pull heels down and back underneath seat.",
      "Hold 1-second squeeze at maximum flexion.",
      "Allow pad to rise slowly over 2 seconds feeling lengthened stretch."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 70,
    "imageUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "standing-single-leg-curl",
    "name": "Standing Single-Leg Curl",
    "muscleGroup": "Legs",
    "subCategory": "Hamstrings",
    "targetMuscles": [
      "Hamstrings (Unilateral)"
    ],
    "secondaryMuscles": [
      "Calves"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale lowering foot; exhale curling heel to glute.",
    "instructions": [
      "Position working leg with roller behind heel.",
      "Curl heel up toward glute while keeping knee pointed straight down.",
      "Squeeze peak contraction for 1 second.",
      "Lower under control and repeat on other side."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "nordic-hamstring-curl",
    "name": "Nordic Hamstring Curl",
    "muscleGroup": "Legs",
    "subCategory": "Hamstrings",
    "targetMuscles": [
      "Hamstrings (Eccentric Overload)"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Core"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Advanced",
    "mechanics": "Isolation",
    "tempo": "4-0-1-0",
    "timeUnderTension": "35s",
    "breathingCue": "Inhale resisting descent toward floor; exhale pushing lightly off floor to return.",
    "instructions": [
      "Kneel on pad with ankles securely locked down by partner or pad.",
      "Lower body forward toward floor as slowly as possible resisting with hamstrings.",
      "Catch self with hands as chest approaches floor.",
      "Push lightly with hands to assist hamstrings back to kneeling position."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 90,
    "imageUrl": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "swiss-ball-leg-curl",
    "name": "Swiss Ball Hamstring Curl",
    "muscleGroup": "Legs",
    "subCategory": "Hamstrings",
    "targetMuscles": [
      "Hamstrings",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Core"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "2-1-2-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale extending legs out; exhale rolling ball in with hips elevated.",
    "instructions": [
      "Lie supine on floor with heels placed atop a Swiss ball.",
      "Elevate hips into bridge so body forms straight diagonal line.",
      "Pull ball in toward glutes by bending knees and driving hips higher.",
      "Roll ball back out smoothly while keeping hips elevated."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "glute-ham-raise",
    "name": "Glute-Ham Raise (GHR)",
    "muscleGroup": "Legs",
    "subCategory": "Hamstrings",
    "targetMuscles": [
      "Hamstrings",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Erector Spinae"
    ],
    "equipment": "Machine",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale descending over rounded pad; exhale pulling upright.",
    "instructions": [
      "Lock ankles into GHR machine with thighs on rounded bolster.",
      "Lower torso forward until horizontal to floor.",
      "Pull body up by curling knees into pad using pure hamstring drive.",
      "Finish tall in upright kneeling posture."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 95,
    "imageUrl": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "single-leg-romanian-deadlift",
    "name": "Single-Leg Dumbbell RDL",
    "muscleGroup": "Legs",
    "subCategory": "Hamstrings",
    "targetMuscles": [
      "Hamstrings (Unilateral)",
      "Gluteus Medius"
    ],
    "secondaryMuscles": [
      "Core",
      "Ankle Stabilizers"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale hinging forward with back leg extending; exhale snapping upright.",
    "instructions": [
      "Stand on one leg holding dumbbell in opposite hand.",
      "Hinge at hip, kicking non-working leg straight behind you like a seesaw.",
      "Descend until torso and rear leg are parallel to floor.",
      "Drive working heel into floor to return to standing balance."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 90,
    "imageUrl": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "kettlebell-swing",
    "name": "Kettlebell Swing (Hip Hinge)",
    "muscleGroup": "Legs",
    "subCategory": "Hamstrings",
    "targetMuscles": [
      "Hamstrings",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Core",
      "Upper Back"
    ],
    "equipment": "Kettlebell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "1-0-X-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale as kettlebell hikes between legs; sharp exhale snapping hips forward.",
    "instructions": [
      "Hike kettlebell backward between thighs like a football snap.",
      "Snap hips forward explosively, squeezing glutes and hamstrings.",
      "Allow kettlebell to float to chest height on hip power alone (not arm raise).",
      "Guide kettlebell back between legs and repeat fluidly."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 120,
    "imageUrl": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "trap-bar-deadlift",
    "name": "Trap Bar Deadlift (High/Low Handles)",
    "muscleGroup": "Legs",
    "subCategory": "Hamstrings",
    "targetMuscles": [
      "Hamstrings",
      "Quadriceps",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Trapezius",
      "Forearms"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "2-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale and brace core inside frame; exhale standing tall.",
    "instructions": [
      "Step inside hexagonal trap bar with neutral grip on handles.",
      "Hinge hips back and pull chest tall, setting flat back.",
      "Drive floor away through whole foot, standing up to complete hip lockout.",
      "Lower bar under control back to floor."
    ],
    "durationMinutes": 12,
    "caloriesBurnEstimate": 150,
    "imageUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "deficit-deadlift",
    "name": "Barbell Deficit Deadlift",
    "muscleGroup": "Legs",
    "subCategory": "Hamstrings",
    "targetMuscles": [
      "Hamstrings",
      "Posterior Chain"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Lats"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "tempo": "2-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Extra deep brace at bottom of increased range; exhale at lockout.",
    "instructions": [
      "Stand on 1-2 inch weight plate or platform. Grip bar on floor.",
      "Increased range demands greater hamstring and quad recruitment off floor.",
      "Push floor away smoothly without rounding lumbar spine.",
      "Lock hips out tall at top."
    ],
    "durationMinutes": 12,
    "caloriesBurnEstimate": 160,
    "imageUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "barbell-hip-thrust",
    "name": "Barbell Hip Thrust",
    "muscleGroup": "Legs",
    "subCategory": "Glutes",
    "targetMuscles": [
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Adductors"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "2-1-1-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale dropping hips down; exhale driving bar toward ceiling with 1-second top glute clamp.",
    "instructions": [
      "Sit on floor with upper back against bench pad and padded barbell across hip crease.",
      "Plant feet shoulder-width apart with shins vertical at top of thrust.",
      "Drive through heels to bridge hips up until thighs and torso align parallel to floor.",
      "Hold top position for 1 full second with posterior pelvic tilt."
    ],
    "durationMinutes": 12,
    "caloriesBurnEstimate": 125,
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "dumbbell-hip-thrust",
    "name": "Dumbbell Hip Thrust",
    "muscleGroup": "Legs",
    "subCategory": "Glutes",
    "targetMuscles": [
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "2-1-1-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale lowering hips; exhale bridging upward.",
    "instructions": [
      "Place upper back across bench with heavy dumbbell balanced across pelvis.",
      "Lower hips toward floor under control.",
      "Thrust upward through heels, clamping glutes hard at top lockout.",
      "Lower slowly over 2 seconds."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 95,
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "single-leg-hip-thrust",
    "name": "Single-Leg Hip Thrust",
    "muscleGroup": "Legs",
    "subCategory": "Glutes",
    "targetMuscles": [
      "Gluteus Maximus (Unilateral)"
    ],
    "secondaryMuscles": [
      "Hamstrings",
      "Core"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "tempo": "2-1-1-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale dipping hip; exhale driving single heel into floor.",
    "instructions": [
      "Set upper back on bench. Elevate one leg with knee bent at 90 degrees.",
      "Drive through heel of grounded foot to elevate pelvis.",
      "Squeeze working glute hard at top without twisting hips.",
      "Lower under control and switch legs."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 90,
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "cable-glute-kickback",
    "name": "Cable Glute Kickback",
    "muscleGroup": "Legs",
    "subCategory": "Glutes",
    "targetMuscles": [
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-1-1",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale bringing knee forward; exhale kicking heel back.",
    "instructions": [
      "Attach ankle strap to low cable. Face tower and hold frame for balance.",
      "Kick working heel directly backward and slightly outward.",
      "Squeeze glute hard at top contraction without hyperextending lower back.",
      "Return leg under control over 2 seconds."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "machine-hip-abduction",
    "name": "Seated Machine Hip Abduction",
    "muscleGroup": "Legs",
    "subCategory": "Glutes",
    "targetMuscles": [
      "Gluteus Medius",
      "Gluteus Minimus",
      "TFL"
    ],
    "secondaryMuscles": [
      "Piriformis"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "50s",
    "breathingCue": "Inhale bringing knees in; exhale pushing pads outward.",
    "instructions": [
      "Sit in machine with outside of knees against pads.",
      "Push knees apart as wide as possible by contracting outer glutes.",
      "Hold peak abduction for 1 full second.",
      "Resist weight on return until knees touch lightly."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "cable-pull-through",
    "name": "Cable Pull-Through",
    "muscleGroup": "Legs",
    "subCategory": "Glutes",
    "targetMuscles": [
      "Gluteus Maximus",
      "Hamstrings"
    ],
    "secondaryMuscles": [
      "Erector Spinae"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "2-1-1-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale hinging back; exhale standing tall and squeezing glutes.",
    "instructions": [
      "Attach rope to lowest cable. Straddle cable facing away from stack.",
      "Hinge hips backward with soft knees, reaching hands through legs.",
      "Snap hips forward to tall standing lockout, clamping glutes.",
      "Do not lean backward with upper spine at lockout."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 75,
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "frog-pumps",
    "name": "Frog Pumps",
    "muscleGroup": "Legs",
    "subCategory": "Glutes",
    "targetMuscles": [
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Gluteus Medius"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "1-1-1-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale at floor; exhale bridging hips with soles of feet pressed together.",
    "instructions": [
      "Lie supine with bottoms of feet pressed together and knees flared wide like butterfly stretch.",
      "Bridge hips upward toward ceiling by squeezing glutes.",
      "Maintain foot-to-foot pressure throughout each repetition.",
      "Lower hips lightly to tap floor and pump continuously."
    ],
    "durationMinutes": 6,
    "caloriesBurnEstimate": 50,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "curtsy-lunges",
    "name": "Curtsy Lunges (Dumbbell)",
    "muscleGroup": "Legs",
    "subCategory": "Glutes",
    "targetMuscles": [
      "Gluteus Medius",
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Quadriceps"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "2-0-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale stepping back diagonally; exhale driving through front foot.",
    "instructions": [
      "Stand holding dumbbells at sides.",
      "Step one leg back and diagonally behind front leg like a curtsy.",
      "Lower hips until front thigh is parallel with floor.",
      "Drive through front heel to return to starting posture."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 95,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "sumo-squat",
    "name": "Dumbbell Sumo Squat (Plie Squat)",
    "muscleGroup": "Legs",
    "subCategory": "Glutes",
    "targetMuscles": [
      "Glutes",
      "Adductors (Inner Thigh)"
    ],
    "secondaryMuscles": [
      "Quadriceps"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale lowering into wide stance; exhale driving knees out to stand.",
    "instructions": [
      "Take wide stance with feet flared at 45 degrees. Hold heavy dumbbell hanging vertically.",
      "Lower hips straight down, pushing knees outward over toes.",
      "Descend until dumbbell nearly touches floor.",
      "Drive through heels and squeeze inner thighs and glutes to stand."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 105,
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "step-ups-with-glute-squeeze",
    "name": "Glute-Biased Step-Ups",
    "muscleGroup": "Legs",
    "subCategory": "Glutes",
    "targetMuscles": [
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Hamstrings"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "2-1-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale on ground; exhale driving through top heel with forward torso lean.",
    "instructions": [
      "Step onto high box (knee height) with slight forward torso lean.",
      "Drive through front heel while keeping trailing leg passive.",
      "Squeeze lead glute firmly at top lockout.",
      "Descend slowly over 2-3 seconds back to floor."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 100,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "glute-bridge",
    "name": "Floor Glute Bridge (Weighted)",
    "muscleGroup": "Legs",
    "subCategory": "Glutes",
    "targetMuscles": [
      "Gluteus Maximus"
    ],
    "secondaryMuscles": [
      "Hamstrings"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-1-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale at floor; exhale bridging hips high.",
    "instructions": [
      "Lie supine on floor with knees bent and feet flat on floor close to glutes.",
      "Drive through heels to bridge hips up until body forms straight line from knees to shoulders.",
      "Squeeze glutes maximally for 2 seconds at peak elevation.",
      "Lower hips smoothly back down."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "banded-monster-walk",
    "name": "Banded Lateral Monster Walk",
    "muscleGroup": "Legs",
    "subCategory": "Glutes",
    "targetMuscles": [
      "Gluteus Medius",
      "Abductors"
    ],
    "secondaryMuscles": [
      "Quadriceps"
    ],
    "equipment": "Bands",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "Continuous",
    "timeUnderTension": "60s",
    "breathingCue": "Rhythmic breathing throughout side-stepping sequence.",
    "instructions": [
      "Place resistance band around knees or ankles. Drop into quarter-squat athletic stance.",
      "Step laterally, keeping tension on band throughout entire step.",
      "Never let feet touch together to maintain constant abduction resistance.",
      "Perform 15 steps in one direction, then reverse."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "standing-calf-raise-machine",
    "name": "Standing Calf Raise (Machine)",
    "muscleGroup": "Legs",
    "subCategory": "Calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)"
    ],
    "secondaryMuscles": [
      "Soleus"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-1-2",
    "timeUnderTension": "50s",
    "breathingCue": "Inhale dropping heels into deep stretch; exhale rising high onto big toes.",
    "instructions": [
      "Rest shoulder pads on shoulders with balls of feet on block and heels hanging off.",
      "Lower heels below platform into full deep calf stretch for 2-second pause.",
      "Drive up forcefully onto balls of feet as high as possible.",
      "Hold peak contraction for 1 second before controlled lowering."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "seated-calf-raise-machine",
    "name": "Seated Calf Raise (Soleus Focus)",
    "muscleGroup": "Legs",
    "subCategory": "Calves",
    "targetMuscles": [
      "Soleus"
    ],
    "secondaryMuscles": [
      "Gastrocnemius"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-1-2",
    "timeUnderTension": "50s",
    "breathingCue": "Inhale lowering heels; exhale pressing upward.",
    "instructions": [
      "Sit with knees bent at 90 degrees with thigh pads securely clamped above knees.",
      "Lower heels deeply beneath footrest to stretch soleus muscle.",
      "Extend ankles fully to elevate thigh pads.",
      "Pause 1 second at top and 2 seconds at deep stretch."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 55,
    "imageUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "leg-press-calf-press",
    "name": "Leg Press Calf Press",
    "muscleGroup": "Legs",
    "subCategory": "Calves",
    "targetMuscles": [
      "Gastrocnemius"
    ],
    "secondaryMuscles": [
      "Soleus"
    ],
    "equipment": "Machine",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "tempo": "2-1-1-2",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale letting sled flex ankles back; exhale pointing toes forward.",
    "instructions": [
      "Place balls of feet on bottom edge of 45-degree leg press sled with heels hanging off.",
      "Keep legs straight with soft, unlocked knees.",
      "Allow sled to push toes back into full dorsiflexion stretch.",
      "Plantarflex toes forward to drive sled upward."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "donkey-calf-raise",
    "name": "Donkey Calf Raise",
    "muscleGroup": "Legs",
    "subCategory": "Calves",
    "targetMuscles": [
      "Gastrocnemius"
    ],
    "secondaryMuscles": [
      "Soleus"
    ],
    "equipment": "Machine",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "tempo": "2-1-1-2",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale into stretch; exhale elevating onto tiptoes.",
    "instructions": [
      "Hinge hips forward at 90 degrees with lower back pad supporting resistance.",
      "Balls of feet on calf block.",
      "Drop heels to full hamstring and calf stretch.",
      "Press through big toes into peak contraction."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "single-leg-dumbbell-calf-raise",
    "name": "Single-Leg Dumbbell Calf Raise",
    "muscleGroup": "Legs",
    "subCategory": "Calves",
    "targetMuscles": [
      "Gastrocnemius (Unilateral)"
    ],
    "secondaryMuscles": [
      "Soleus",
      "Ankle Stabilizers"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "tempo": "2-1-1-2",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale dropping single heel; exhale rising high onto toes.",
    "instructions": [
      "Hold dumbbell in one hand while standing on edge of step with matching foot.",
      "Use other hand lightly against wall for balance.",
      "Sink heel down into deep single-leg stretch.",
      "Elevate high onto toes and hold 1 second."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "smith-machine-calf-raise",
    "name": "Smith Machine Calf Raise",
    "muscleGroup": "Legs",
    "subCategory": "Calves",
    "targetMuscles": [
      "Gastrocnemius"
    ],
    "secondaryMuscles": [
      "Soleus"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-1-2",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale descending; exhale driving up on balls of feet.",
    "instructions": [
      "Place calf block under Smith machine bar. Unrack bar onto upper traps.",
      "Step onto block with heels hanging off.",
      "Lower heels deeply, pause for 1 second.",
      "Press straight up to maximum height."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "tibialis-anterior-raise",
    "name": "Tibialis Anterior Raise",
    "muscleGroup": "Legs",
    "subCategory": "Calves",
    "targetMuscles": [
      "Tibialis Anterior (Shins)"
    ],
    "secondaryMuscles": [
      "Extensor Digitorum"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "1-1-2-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale lowering toes; exhale flexing toes high toward knees.",
    "instructions": [
      "Lean back against wall with feet about 18 inches out in front.",
      "Flex toes and balls of feet straight upward toward shins.",
      "Hold top contraction for 1 second feeling shin muscles burn.",
      "Lower balls of feet back to floor under control."
    ],
    "durationMinutes": 6,
    "caloriesBurnEstimate": 45,
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "jump-rope",
    "name": "Jump Rope Conditioning (Calf Endurance)",
    "muscleGroup": "Legs",
    "subCategory": "Calves",
    "targetMuscles": [
      "Gastrocnemius",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Cardiovascular System"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "Continuous",
    "timeUnderTension": "60-120s",
    "breathingCue": "Rhythmic breathing matching foot strike cadence.",
    "instructions": [
      "Hold handles with relaxed wrists and bounce lightly on balls of feet.",
      "Never let heels touch floor; absorb and propel using elastic Achilles tendon.",
      "Turn rope with quick wrist rotations rather than large arm swings.",
      "Maintain consistent, rhythmic pace."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 110,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "farmers-walk-on-toes",
    "name": "Farmer's Walk on Toes",
    "muscleGroup": "Legs",
    "subCategory": "Calves",
    "targetMuscles": [
      "Gastrocnemius",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Traps",
      "Forearms / Grip"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "Continuous",
    "timeUnderTension": "45s",
    "breathingCue": "Steady diaphragmatic breathing under heavy load.",
    "instructions": [
      "Deadlift two heavy dumbbells to sides.",
      "Elevate as high as possible onto tiptoes.",
      "Walk forward smoothly taking small controlled steps while staying on balls of feet.",
      "Lower safely when heels begin to drop."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 85,
    "imageUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "bodyweight-stair-calf-raise",
    "name": "Bodyweight Stair Calf Raise",
    "muscleGroup": "Legs",
    "subCategory": "Calves",
    "targetMuscles": [
      "Gastrocnemius",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Foot Arch Stabilizers"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-1-2",
    "timeUnderTension": "50s",
    "breathingCue": "Inhale dropping heels; exhale rising tall.",
    "instructions": [
      "Stand on edge of stair or curb with balls of feet.",
      "Drop heels into full gravitational stretch.",
      "Elevate high onto toes with maximum contraction.",
      "Perform high repetitions (20-30 reps) for endurance volume."
    ],
    "durationMinutes": 6,
    "caloriesBurnEstimate": 50,
    "imageUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "standing-barbell-curl",
    "name": "Standing Barbell Bicep Curl",
    "muscleGroup": "Arms",
    "subCategory": "Biceps",
    "targetMuscles": [
      "Biceps Brachii (Short & Long Heads)"
    ],
    "secondaryMuscles": [
      "Brachialis",
      "Forearms"
    ],
    "equipment": "Barbell",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "3-1-1-1",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale at bottom hang; exhale curling bar to chest without swinging elbows.",
    "instructions": [
      "Stand tall holding barbell with shoulder-width supinated grip.",
      "Pin elbows stationary against ribcage.",
      "Curl bar upward in an arc, squeezing biceps hard at top.",
      "Lower bar over 3 controlled seconds to full elbow extension."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "ez-bar-curl",
    "name": "EZ-Bar Bicep Curl",
    "muscleGroup": "Arms",
    "subCategory": "Biceps",
    "targetMuscles": [
      "Biceps Brachii",
      "Brachialis"
    ],
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Barbell",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "3-1-1-1",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale lowering; exhale curling.",
    "instructions": [
      "Grasp undulating inner knurling of EZ-bar to reduce wrist torque.",
      "Keep elbows tucked to sides and curl bar to clavicles.",
      "Pause for 1 second at maximum bicep shortening.",
      "Lower under control feeling bicep stretch."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "dumbbell-bicep-curl",
    "name": "Standing Dumbbell Bicep Curl",
    "muscleGroup": "Arms",
    "subCategory": "Biceps",
    "targetMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Brachioradialis"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "3-1-1-1",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale lowering dumbbells; exhale supinating and curling up.",
    "instructions": [
      "Hold dumbbells at sides with palms facing inward.",
      "As you curl, rotate wrists outward (supination) so palms face up at top.",
      "Squeeze biceps firmly at peak height.",
      "Lower weights slowly back to neutral starting position."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "incline-dumbbell-curl",
    "name": "Incline Dumbbell Curl",
    "muscleGroup": "Arms",
    "subCategory": "Biceps",
    "targetMuscles": [
      "Biceps Brachii (Long Head Stretch)"
    ],
    "secondaryMuscles": [
      "Brachialis"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "tempo": "3-1-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale letting arms hang in deep backward stretch; exhale curling up.",
    "instructions": [
      "Set incline bench to 45-60 degrees. Lie back letting arms hang straight behind torso.",
      "Curl dumbbells upward while keeping elbows pinned back behind shoulders.",
      "Squeeze long head at top contraction.",
      "Lower slowly into deep bicep stretch."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "dumbbell-hammer-curl",
    "name": "Dumbbell Hammer Curl",
    "muscleGroup": "Arms",
    "subCategory": "Biceps",
    "targetMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "secondaryMuscles": [
      "Biceps Brachii"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "3-0-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale at sides; exhale curling with neutral thumbs-up grip.",
    "instructions": [
      "Hold dumbbells with palms facing each other in neutral grip.",
      "Curl weights forward without rotating wrists, keeping thumbs pointing up.",
      "Peak squeeze forearm and brachialis at top.",
      "Lower under control over 3 seconds."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "cable-hammer-curl",
    "name": "Rope Cable Hammer Curl",
    "muscleGroup": "Arms",
    "subCategory": "Biceps",
    "targetMuscles": [
      "Brachialis",
      "Brachioradialis"
    ],
    "secondaryMuscles": [
      "Biceps"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale at bottom; exhale curling rope upward.",
    "instructions": [
      "Attach rope to low cable pulley. Grasp ends with neutral palms-in grip.",
      "Curl rope up to shoulders, spreading ends slightly apart at top.",
      "Squeeze peak tension for 1 second.",
      "Lower slowly feeling continuous cable resistance."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "preacher-curl-ez-bar",
    "name": "Preacher Curl (EZ-Bar)",
    "muscleGroup": "Arms",
    "subCategory": "Biceps",
    "targetMuscles": [
      "Biceps Brachii (Short Head Focus)"
    ],
    "secondaryMuscles": [
      "Brachialis"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "tempo": "3-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale lowering arms onto pad; exhale curling bar toward face.",
    "instructions": [
      "Sit at preacher bench with armpits snug against top edge of angled pad.",
      "Grip EZ-bar with supinated grip.",
      "Curl bar upward to vertical, keeping triceps flat against pad.",
      "Lower slowly, stopping just before full hyperextension lockout."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "machine-preacher-curl",
    "name": "Machine Preacher Curl",
    "muscleGroup": "Arms",
    "subCategory": "Biceps",
    "targetMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale on extension; exhale curling handles.",
    "instructions": [
      "Adjust seat so upper arms rest flat across machine pad.",
      "Grip handles and curl upward to peak bicep contraction.",
      "Hold squeeze for 1 second.",
      "Lower under control over 2 seconds."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "concentration-curl",
    "name": "Dumbbell Concentration Curl",
    "muscleGroup": "Arms",
    "subCategory": "Biceps",
    "targetMuscles": [
      "Biceps Brachii (Peak Contraction)"
    ],
    "secondaryMuscles": [
      "Brachialis"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale at bottom hang; exhale curling dumbbell toward cheek.",
    "instructions": [
      "Sit on bench, bracing working elbow against inner thigh of same side.",
      "Hang dumbbell with full arm extension.",
      "Curl weight toward face, squeezing bicep peak maximally.",
      "Lower slowly without allowing elbow to slip off thigh."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 55,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "spider-curl",
    "name": "Spider Curl (Prone Incline)",
    "muscleGroup": "Arms",
    "subCategory": "Biceps",
    "targetMuscles": [
      "Biceps Brachii (Short Head)"
    ],
    "secondaryMuscles": [
      "Brachialis"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale at vertical hang; exhale curling up toward forehead.",
    "instructions": [
      "Lie face down on 45-degree incline bench with chest over top edge.",
      "Let arms hang vertically with barbell or dumbbells.",
      "Curl weight upward, keeping upper arms strictly vertical.",
      "Squeeze biceps at top before slow descent."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "cable-bicep-curl",
    "name": "Standing Cable Bicep Curl",
    "muscleGroup": "Arms",
    "subCategory": "Biceps",
    "targetMuscles": [
      "Biceps Brachii"
    ],
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale lowering bar; exhale curling bar toward upper chest.",
    "instructions": [
      "Attach straight or cambered bar to low cable. Stand facing tower.",
      "Pin elbows into sides and curl bar to upper chest.",
      "Squeeze peak tension under continuous cable resistance.",
      "Lower bar smoothly over 2 seconds."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "reverse-grip-barbell-curl",
    "name": "Reverse-Grip Barbell Curl",
    "muscleGroup": "Arms",
    "subCategory": "Biceps",
    "targetMuscles": [
      "Brachioradialis",
      "Brachialis"
    ],
    "secondaryMuscles": [
      "Biceps",
      "Forearm Extensors"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "tempo": "2-1-2-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale at hang; exhale curling with overhand knuckles-up grip.",
    "instructions": [
      "Hold barbell with shoulder-width pronated (overhand) grip.",
      "Curl bar upward keeping wrists straight and locked.",
      "Squeeze forearms and brachialis at top.",
      "Lower under control back to arm extension."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "zottman-curl",
    "name": "Zottman Curl",
    "muscleGroup": "Arms",
    "subCategory": "Biceps",
    "targetMuscles": [
      "Biceps Brachii",
      "Brachioradialis"
    ],
    "secondaryMuscles": [
      "Forearm Flexors & Extensors"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "tempo": "3-1-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale lowering with palms down; exhale curling with palms up.",
    "instructions": [
      "Curl dumbbells up with palms facing upward (standard supinated curl).",
      "At top of curl, rotate wrists 180 degrees so palms face downward.",
      "Lower dumbbells slowly with palms-down grip to overload forearms.",
      "Rotate palms back upward at bottom for next rep."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "bicep-chin-up",
    "name": "Close-Grip Chin-Up (Bicep Overload)",
    "muscleGroup": "Arms",
    "subCategory": "Biceps",
    "targetMuscles": [
      "Biceps Brachii",
      "Brachialis"
    ],
    "secondaryMuscles": [
      "Lats"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "2-1-1-0",
    "timeUnderTension": "35s",
    "breathingCue": "Inhale hanging; exhale pulling with arms until chin clears bar.",
    "instructions": [
      "Grip pull-up bar with close underhand grip (6 inches between hands).",
      "Focus pulling force through arms rather than upper back.",
      "Pull until chin clears bar, holding bicep squeeze at top.",
      "Lower slowly back to full hang."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 85,
    "imageUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "close-grip-barbell-bench-press",
    "name": "Close-Grip Barbell Bench Press",
    "muscleGroup": "Arms",
    "subCategory": "Triceps",
    "targetMuscles": [
      "Triceps Brachii (All 3 Heads)"
    ],
    "secondaryMuscles": [
      "Chest",
      "Anterior Deltoids"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "3-0-1-0",
    "timeUnderTension": "40-45s",
    "breathingCue": "Inhale as bar lowers to lower sternum; exhale pressing up with tucked elbows.",
    "instructions": [
      "Lie on flat bench. Grip bar shoulder-width apart (do not grip too narrow to avoid wrist strain).",
      "Lower bar to lower chest while keeping elbows tucked at 30 degrees to torso.",
      "Press bar vertically by extending elbows forcefully.",
      "Lock out triceps cleanly at top."
    ],
    "durationMinutes": 12,
    "caloriesBurnEstimate": 110,
    "imageUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "tricep-rope-pushdown",
    "name": "Cable Tricep Rope Pushdown",
    "muscleGroup": "Arms",
    "subCategory": "Triceps",
    "targetMuscles": [
      "Triceps (Lateral Head)"
    ],
    "secondaryMuscles": [
      "Anconeus"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "3-0-1-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale letting rope rise to chest; exhale pushing down and spreading rope apart.",
    "instructions": [
      "Attach rope to high pulley. Pin elbows tight against ribcage.",
      "Extend forearms down until arms lock out completely.",
      "Spread rope ends apart at bottom for maximal lateral head squeeze.",
      "Control ascent back to 90 degrees."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "straight-bar-cable-pushdown",
    "name": "Straight Bar Cable Pushdown",
    "muscleGroup": "Arms",
    "subCategory": "Triceps",
    "targetMuscles": [
      "Triceps (Medial & Lateral Heads)"
    ],
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "3-0-1-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale bending elbows; exhale pressing bar to thighs.",
    "instructions": [
      "Grasp straight bar with overhand grip on high pulley.",
      "Keep elbows fixed into sides and press bar down until arms lock out.",
      "Hold squeeze for 1 second against thighs.",
      "Allow bar to rise slowly back to chest level."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "skull-crushers",
    "name": "Lying Tricep Skull Crushers (EZ-Bar)",
    "muscleGroup": "Arms",
    "subCategory": "Triceps",
    "targetMuscles": [
      "Triceps (Long Head)"
    ],
    "secondaryMuscles": [
      "Medial Head"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "tempo": "3-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale lowering bar toward forehead; exhale extending arms to vertical.",
    "instructions": [
      "Lie on flat bench holding EZ-bar with narrow overhand grip directly above chest.",
      "Angle upper arms back 10 degrees to keep continuous tension on long head.",
      "Bend elbows to lower bar smoothly to forehead or crown of head.",
      "Extend elbows to drive bar back up to starting position."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 75,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "overhead-dumbbell-tricep-extension",
    "name": "Overhead Dumbbell Tricep Extension",
    "muscleGroup": "Arms",
    "subCategory": "Triceps",
    "targetMuscles": [
      "Triceps (Long Head Lengthened)"
    ],
    "secondaryMuscles": [
      "Anconeus"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "3-1-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale lowering dumbbell behind neck; exhale extending arms overhead.",
    "instructions": [
      "Sit upright, cupping top inner plate of heavy dumbbell overhead with both hands.",
      "Keep elbows pointing forward rather than flaring wide.",
      "Lower weight behind head into deep stretch of triceps.",
      "Extend forearms straight up to full lockout overhead."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "overhead-cable-tricep-extension",
    "name": "Overhead Cable Rope Extension",
    "muscleGroup": "Arms",
    "subCategory": "Triceps",
    "targetMuscles": [
      "Triceps (Long Head)"
    ],
    "secondaryMuscles": [
      "Core"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "3-1-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale into stretch behind head; exhale pressing rope forward and overhead.",
    "instructions": [
      "Attach rope to cable, turn around facing away from stack in staggered stance.",
      "Lean forward 30 degrees with elbows held beside ears.",
      "Extend rope forward and outward until elbows lock out.",
      "Return slowly feeling deep long head tricep stretch."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "parallel-bar-dips",
    "name": "Parallel Bar Dips (Tricep Focus)",
    "muscleGroup": "Arms",
    "subCategory": "Triceps",
    "targetMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids",
      "Chest"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "3-0-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale on descent; exhale pushing up to full arm extension.",
    "instructions": [
      "Mount parallel bars, keeping torso strictly vertical to bias triceps.",
      "Keep elbows tucked close to sides rather than flared out.",
      "Lower body until elbows bend to 90 degrees.",
      "Drive straight up through palms to lock out arms."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 95,
    "imageUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "bench-dips",
    "name": "Bench Dips",
    "muscleGroup": "Arms",
    "subCategory": "Triceps",
    "targetMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "2-0-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale dipping down; exhale pushing back up.",
    "instructions": [
      "Place palms on edge of bench behind you with legs extended forward.",
      "Lower hips toward floor by bending elbows to 90 degrees.",
      "Keep back close to bench pad.",
      "Press through palms to full elbow extension."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "dumbbell-kickbacks",
    "name": "Dumbbell Tricep Kickbacks",
    "muscleGroup": "Arms",
    "subCategory": "Triceps",
    "targetMuscles": [
      "Triceps (Lateral Head Shortened)"
    ],
    "secondaryMuscles": [
      "Rear Deltoids"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale swinging dumbbell to 90 deg; exhale kicking back to full arm extension.",
    "instructions": [
      "Hinge at hips with torso parallel to floor, upper arm pinned against ribcage.",
      "Extend forearm backward until arm is completely straight.",
      "Hold 1-second maximal tricep squeeze at lockout.",
      "Lower dumbbell under control only to 90-degree elbow bend."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 55,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "tate-press",
    "name": "Dumbbell Tate Press",
    "muscleGroup": "Arms",
    "subCategory": "Triceps",
    "targetMuscles": [
      "Triceps (Medial Head & Lockout)"
    ],
    "secondaryMuscles": [
      "Anconeus"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "tempo": "2-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale lowering bells inward to chest; exhale pressing outward to lockout.",
    "instructions": [
      "Lie on flat bench with dumbbells held over chest, palms facing toward feet.",
      "Bend elbows outward to lower inner heads of dumbbells to touch chest.",
      "Extend elbows to drive dumbbells back up into starting position.",
      "Focus mechanical tension strictly on triceps."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "jm-press",
    "name": "Barbell JM Press",
    "muscleGroup": "Arms",
    "subCategory": "Triceps",
    "targetMuscles": [
      "Triceps Brachii (All Heads)"
    ],
    "secondaryMuscles": [
      "Chest",
      "Front Delts"
    ],
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "tempo": "3-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale lowering bar toward throat/chin; exhale pressing up.",
    "instructions": [
      "Hybrid bench and skull crusher movement. Grip bar shoulder-width.",
      "Lower bar straight down toward upper neck/chin area, letting elbows flare forward.",
      "Pause 1 second as forearms meet biceps.",
      "Press bar forcefully back to arm lockout."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 85,
    "imageUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "single-arm-cable-pushdown",
    "name": "Single-Arm Underhand Cable Pushdown",
    "muscleGroup": "Arms",
    "subCategory": "Triceps",
    "targetMuscles": [
      "Triceps (Medial Head Focus)"
    ],
    "secondaryMuscles": [
      "Forearms"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale at 90 degrees; exhale pressing down to lockout.",
    "instructions": [
      "Grasp single D-handle with underhand supinated grip on high cable.",
      "Pin working elbow against ribcage.",
      "Extend arm downward to complete lockout.",
      "Lower under control feeling medial head engagement."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 55,
    "imageUrl": "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "ez-bar-overhead-extension",
    "name": "Seated EZ-Bar Overhead Tricep Extension",
    "muscleGroup": "Arms",
    "subCategory": "Triceps",
    "targetMuscles": [
      "Triceps (Long Head)"
    ],
    "secondaryMuscles": [
      "Anconeus"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "tempo": "3-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale lowering bar behind head; exhale pressing overhead.",
    "instructions": [
      "Sit on vertical bench holding loaded EZ-bar overhead with narrow grip.",
      "Lower bar behind head by bending elbows while keeping upper arms vertical.",
      "Feel intense stretch across tricep long heads.",
      "Press bar straight back overhead to arm extension."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 70,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "machine-tricep-dip",
    "name": "Seated Machine Tricep Dip",
    "muscleGroup": "Arms",
    "subCategory": "Triceps",
    "targetMuscles": [
      "Triceps Brachii"
    ],
    "secondaryMuscles": [
      "Chest",
      "Front Delts"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "3-0-1-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale handles rising; exhale pressing handles down.",
    "instructions": [
      "Sit in machine with thighs secured under roller pads.",
      "Grasp handles and push downward to full elbow extension.",
      "Pause for 1 second squeezing triceps.",
      "Allow handles to rise slowly back to chest level."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 80,
    "imageUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "barbell-wrist-curl",
    "name": "Seated Barbell Wrist Curl",
    "muscleGroup": "Arms",
    "subCategory": "Forearms",
    "targetMuscles": [
      "Forearm Flexors"
    ],
    "secondaryMuscles": [
      "Grip Strength"
    ],
    "equipment": "Barbell",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale opening fingers; exhale curling wrists upward.",
    "instructions": [
      "Sit on bench resting forearms on thighs with wrists hanging off edge, palms facing up.",
      "Roll barbell down into fingertips for deep forearm stretch.",
      "Curl bar back up into palms and flex wrists upward as high as possible.",
      "Hold squeeze for 1 second before lowering."
    ],
    "durationMinutes": 6,
    "caloriesBurnEstimate": 45,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "barbell-reverse-wrist-curl",
    "name": "Barbell Reverse Wrist Curl",
    "muscleGroup": "Arms",
    "subCategory": "Forearms",
    "targetMuscles": [
      "Forearm Extensors"
    ],
    "secondaryMuscles": [
      "Brachioradialis"
    ],
    "equipment": "Barbell",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale dropping wrists; exhale extending wrists upward.",
    "instructions": [
      "Rest forearms on thighs with wrists hanging off, palms facing downward (pronated).",
      "Lower bar toward floor by flexing wrists down.",
      "Extend wrists upward toward ceiling against gravity.",
      "Lower under strict control."
    ],
    "durationMinutes": 6,
    "caloriesBurnEstimate": 45,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "dumbbell-wrist-curl",
    "name": "Single-Arm Dumbbell Wrist Curl",
    "muscleGroup": "Arms",
    "subCategory": "Forearms",
    "targetMuscles": [
      "Forearm Flexors"
    ],
    "secondaryMuscles": [
      "Grip"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale opening fingers; exhale curling dumbbell.",
    "instructions": [
      "Rest one forearm across bench pad holding dumbbell with palm up.",
      "Roll dumbbell to fingertips, then curl up into deep wrist flexion.",
      "Hold peak contraction for 1 second.",
      "Repeat on opposite arm."
    ],
    "durationMinutes": 6,
    "caloriesBurnEstimate": 40,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "behind-the-back-barbell-wrist-curl",
    "name": "Behind-the-Back Barbell Wrist Curl",
    "muscleGroup": "Arms",
    "subCategory": "Forearms",
    "targetMuscles": [
      "Forearm Flexors"
    ],
    "secondaryMuscles": [
      "Finger Flexors"
    ],
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale at hang; exhale curling bar behind glutes.",
    "instructions": [
      "Stand holding barbell behind glutes with palms facing backward.",
      "Let bar roll down into fingertips, then curl fingers and wrists upward.",
      "Squeeze inner forearms hard at peak contraction.",
      "Lower under control over 2 seconds."
    ],
    "durationMinutes": 6,
    "caloriesBurnEstimate": 45,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "farmers-carry",
    "name": "Heavy Dumbbell Farmer's Carry",
    "muscleGroup": "Arms",
    "subCategory": "Forearms",
    "targetMuscles": [
      "Forearms / Grip Endurance",
      "Trapezius"
    ],
    "secondaryMuscles": [
      "Core / Obliques"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "Continuous",
    "timeUnderTension": "45-60s",
    "breathingCue": "Deep rhythmic abdominal breathing while maintaining rigid posture.",
    "instructions": [
      "Deadlift two heavy dumbbells to sides. Stand tall with shoulders pulled back.",
      "Walk forward smoothly with small, fast, controlled steps.",
      "Do not allow dumbbells to bounce against thighs.",
      "Walk for designated time or 40 meters before safely lowering."
    ],
    "durationMinutes": 10,
    "caloriesBurnEstimate": 95,
    "imageUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "dead-hang-grip",
    "name": "Dead Hang (Grip & Forearm Endurance)",
    "muscleGroup": "Arms",
    "subCategory": "Forearms",
    "targetMuscles": [
      "Forearm Flexors / Grip"
    ],
    "secondaryMuscles": [
      "Shoulder Stabilizers",
      "Lats"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "Isometric",
    "timeUnderTension": "45-75s",
    "breathingCue": "Slow deep breathing through nose throughout hang duration.",
    "instructions": [
      "Grasp pull-up bar with overhand shoulder-width grip.",
      "Hang completely motionless with feet off floor and arms extended.",
      "Maintain active grip without letting fingers slip.",
      "Hold until grip reaches muscular fatigue."
    ],
    "durationMinutes": 6,
    "caloriesBurnEstimate": 45,
    "imageUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "plate-pinches",
    "name": "Weight Plate Pinches",
    "muscleGroup": "Arms",
    "subCategory": "Forearms",
    "targetMuscles": [
      "Pinch Grip / Forearm Intrinsic Muscles"
    ],
    "secondaryMuscles": [
      "Thumb Adductors"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "tempo": "Isometric",
    "timeUnderTension": "30-45s",
    "breathingCue": "Steady nasal breathing while maintaining maximal pinch force.",
    "instructions": [
      "Pinch two smooth 10-25 lb weight plates together with smooth sides facing out.",
      "Grip only with fingertips and thumb (no palm contact).",
      "Stand tall and hold plates at sides for duration.",
      "Lower safely to floor before grip fails."
    ],
    "durationMinutes": 6,
    "caloriesBurnEstimate": 40,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "towel-pull-ups",
    "name": "Towel Grip Pull-Ups",
    "muscleGroup": "Arms",
    "subCategory": "Forearms",
    "targetMuscles": [
      "Forearm Flexors",
      "Lats"
    ],
    "secondaryMuscles": [
      "Biceps"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "tempo": "2-0-1-0",
    "timeUnderTension": "35s",
    "breathingCue": "Inhale at bottom; exhale pulling chin up while crushing towel.",
    "instructions": [
      "Drape two thick gym towels over a pull-up bar.",
      "Grip ends of towels with firm white-knuckle grip.",
      "Pull body upward until hands reach chest height.",
      "Lower with control to dead hang without loosening grip."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 80,
    "imageUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "wrist-roller",
    "name": "Wrist Roller Forearm Protocol",
    "muscleGroup": "Arms",
    "subCategory": "Forearms",
    "targetMuscles": [
      "Forearm Flexors & Extensors"
    ],
    "secondaryMuscles": [
      "Anterior Deltoids"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "tempo": "Continuous",
    "timeUnderTension": "50s",
    "breathingCue": "Continuous steady breathing while rolling weight up and down.",
    "instructions": [
      "Hold wrist roller dowel horizontally at chest level with straight arms.",
      "Alternate rolling wrists backward to wind rope and weight plate to the top.",
      "Once at top, reverse wrist motion to lower weight smoothly under control.",
      "Do not allow weight to drop freely."
    ],
    "durationMinutes": 6,
    "caloriesBurnEstimate": 45,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "reverse-ez-bar-curl-forearms",
    "name": "Reverse EZ-Bar Curl (Forearms)",
    "muscleGroup": "Arms",
    "subCategory": "Forearms",
    "targetMuscles": [
      "Brachioradialis",
      "Forearm Extensors"
    ],
    "secondaryMuscles": [
      "Brachialis"
    ],
    "equipment": "Barbell",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale lowering bar; exhale curling bar with overhand grip.",
    "instructions": [
      "Grasp outer ridges of EZ-bar with pronated (palms down) grip.",
      "Keep wrists rigid in straight line with forearms.",
      "Curl bar to shoulder height, squeezing top of forearms.",
      "Lower under strict control over 2 seconds."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "hanging-leg-raise",
    "name": "Hanging Leg Raise",
    "muscleGroup": "Core",
    "subCategory": "Core",
    "targetMuscles": [
      "Rectus Abdominis (Lower)",
      "Hip Flexors"
    ],
    "secondaryMuscles": [
      "Obliques",
      "Grip Strength"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Advanced",
    "mechanics": "Isolation",
    "tempo": "2-1-2-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale at dead hang; exhale curling toes up to touch bar.",
    "instructions": [
      "Hang from pull-up bar with overhand grip, body completely still.",
      "Contract lower abdominals and tilt pelvis backward.",
      "Raise straight legs up until toes touch or reach parallel with bar.",
      "Lower legs slowly over 2 seconds to avoid pendulum swing."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "captains-chair-knee-raise",
    "name": "Captain's Chair Knee Raise",
    "muscleGroup": "Core",
    "subCategory": "Core",
    "targetMuscles": [
      "Rectus Abdominis",
      "Hip Flexors"
    ],
    "secondaryMuscles": [
      "Obliques"
    ],
    "equipment": "Machine",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale hanging; exhale tucking knees up to chest.",
    "instructions": [
      "Step into tower resting forearms on pads with back against cushion.",
      "Bend knees and raise them upward toward chest, rounding pelvis forward.",
      "Squeeze abs hard at top of contraction.",
      "Lower legs with control without arching lower back."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "ab-wheel-rollout",
    "name": "Ab Wheel Rollout",
    "muscleGroup": "Core",
    "subCategory": "Core",
    "targetMuscles": [
      "Rectus Abdominis (Anti-Extension)",
      "Transverse Abdominis"
    ],
    "secondaryMuscles": [
      "Lats",
      "Serratus Anterior"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Advanced",
    "mechanics": "Isolation",
    "tempo": "3-1-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale rolling out feeling core stretch; exhale pulling wheel back with abs.",
    "instructions": [
      "Kneel on pad holding ab wheel handles directly below shoulders.",
      "Round upper back slightly and tuck pelvis into posterior tilt.",
      "Roll wheel forward, extending body as far as possible without hyperextending lower back.",
      "Contract abdominals to pull wheel back to starting position."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 70,
    "imageUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "cable-woodchoppers",
    "name": "Cable Woodchoppers",
    "muscleGroup": "Core",
    "subCategory": "Core",
    "targetMuscles": [
      "Internal & External Obliques"
    ],
    "secondaryMuscles": [
      "Transverse Abdominis",
      "Shoulders"
    ],
    "equipment": "Cables",
    "difficulty": "Intermediate",
    "mechanics": "Compound",
    "tempo": "2-1-2-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale reaching high to pulley; exhale chopping diagonally across body.",
    "instructions": [
      "Set cable pulley high with D-handle. Stand sideways to cable in athletic stance.",
      "Grasp handle with both hands and arms extended.",
      "Rotate torso diagonally downward across body toward opposite hip.",
      "Pivot on back foot and squeeze obliques at completion."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "cable-crunch",
    "name": "Kneeling Cable Rope Crunch",
    "muscleGroup": "Core",
    "subCategory": "Core",
    "targetMuscles": [
      "Rectus Abdominis"
    ],
    "secondaryMuscles": [
      "Obliques"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale at upright stretch; exhale curling elbows down to knees.",
    "instructions": [
      "Attach rope to high pulley. Kneel 2 feet from stack with rope pinned beside ears.",
      "Lock hips stationary. Flex spine to crunch elbows down toward thighs.",
      "Squeeze abdominal wall for 1 full second at peak curl.",
      "Rise slowly back into full spinal extension."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "standard-floor-crunch",
    "name": "Standard Floor Crunch",
    "muscleGroup": "Core",
    "subCategory": "Core",
    "targetMuscles": [
      "Upper Rectus Abdominis"
    ],
    "secondaryMuscles": [
      "Transverse Abdominis"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale lying flat; exhale curling shoulder blades off mat.",
    "instructions": [
      "Lie supine with knees bent at 90 degrees and feet flat on floor.",
      "Place fingertips lightly behind head without pulling neck.",
      "Curl ribcage toward pelvis, lifting shoulder blades 3-4 inches off floor.",
      "Lower slowly back until shoulder blades tap floor."
    ],
    "durationMinutes": 6,
    "caloriesBurnEstimate": 45,
    "imageUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "decline-bench-crunch",
    "name": "Decline Bench Crunch",
    "muscleGroup": "Core",
    "subCategory": "Core",
    "targetMuscles": [
      "Rectus Abdominis"
    ],
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale reclining; exhale curling up against decline angle.",
    "instructions": [
      "Hook ankles securely in decline bench roller pads.",
      "Cross arms over chest. Lower torso until parallel to floor.",
      "Crunch upward curling spine until abdominal wall contracts hard.",
      "Lower under control over 2 seconds."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "plank-standard",
    "name": "Isometric Forearm Plank",
    "muscleGroup": "Core",
    "subCategory": "Core",
    "targetMuscles": [
      "Transverse Abdominis",
      "Rectus Abdominis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Deltoids"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "Isometric",
    "timeUnderTension": "45-60s",
    "breathingCue": "Rhythmic diaphragmatic breathing while pulling belly button to spine.",
    "instructions": [
      "Rest on forearms with elbows beneath shoulders and legs extended straight.",
      "Create rigid line from heels to crown with glutes and quads squeezed.",
      "Tuck pelvis slightly to engage deep abdominal wall.",
      "Hold without allowing hips to sag or hike upward."
    ],
    "durationMinutes": 6,
    "caloriesBurnEstimate": 50,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "side-plank",
    "name": "Isometric Side Plank",
    "muscleGroup": "Core",
    "subCategory": "Core",
    "targetMuscles": [
      "Quadratus Lumborum",
      "Obliques"
    ],
    "secondaryMuscles": [
      "Gluteus Medius"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "Isometric",
    "timeUnderTension": "40s",
    "breathingCue": "Slow, controlled breathing holding lateral brace.",
    "instructions": [
      "Lie on side supported by forearm beneath shoulder, feet stacked.",
      "Elevate hips until body forms straight diagonal line.",
      "Squeeze lower oblique and glute to keep hips high.",
      "Hold for designated time, then switch sides."
    ],
    "durationMinutes": 6,
    "caloriesBurnEstimate": 50,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "russian-twists",
    "name": "Russian Twists (Weighted)",
    "muscleGroup": "Core",
    "subCategory": "Core",
    "targetMuscles": [
      "Internal & External Obliques"
    ],
    "secondaryMuscles": [
      "Rectus Abdominis"
    ],
    "equipment": "Dumbbells",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "1-1-1-1",
    "timeUnderTension": "45s",
    "breathingCue": "Exhale as weight taps beside hip; inhale passing through center.",
    "instructions": [
      "Sit on floor with knees bent and feet elevated 6 inches off floor.",
      "Lean torso back 45 degrees into V-sit balance holding dumbbell or medicine ball.",
      "Rotate torso from side to side, tapping weight on floor beside hip.",
      "Follow weight with eyes to ensure genuine spinal rotation."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "hollow-body-hold",
    "name": "Gymnastics Hollow Body Hold",
    "muscleGroup": "Core",
    "subCategory": "Core",
    "targetMuscles": [
      "Rectus Abdominis",
      "Transverse Abdominis"
    ],
    "secondaryMuscles": [
      "Hip Flexors",
      "Serratus"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "tempo": "Isometric",
    "timeUnderTension": "30-45s",
    "breathingCue": "Breathe shallowly into chest while keeping lower back pressed hard into floor.",
    "instructions": [
      "Lie flat on back. Press lumbar spine completely flat against floor (zero gap).",
      "Extend arms overhead beside ears and hover legs 6 inches above floor.",
      "Lift shoulder blades off mat forming banana/crescent shape.",
      "Hold with unwavering abdominal brace."
    ],
    "durationMinutes": 6,
    "caloriesBurnEstimate": 50,
    "imageUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "dead-bug",
    "name": "Dead Bug Exercise",
    "muscleGroup": "Core",
    "subCategory": "Core",
    "targetMuscles": [
      "Transverse Abdominis (Core Stabilization)"
    ],
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale extending opposite arm and leg; exhale returning to center.",
    "instructions": [
      "Lie on back with arms pointing to ceiling and knees bent at 90 degrees above hips.",
      "Glue lower back to floor.",
      "Slowly extend right arm overhead and left leg straight out toward floor without arching back.",
      "Return to start and alternate opposite limbs."
    ],
    "durationMinutes": 6,
    "caloriesBurnEstimate": 45,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "bird-dog",
    "name": "Quadruped Bird Dog",
    "muscleGroup": "Core",
    "subCategory": "Core",
    "targetMuscles": [
      "Multifidus",
      "Erector Spinae",
      "Glutes"
    ],
    "secondaryMuscles": [
      "Deltoids",
      "Transverse Abdominis"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale at quadruped; exhale reaching opposite arm and leg straight out.",
    "instructions": [
      "Start on all fours with wrists under shoulders and knees under hips.",
      "Extend right arm forward and left leg backward until level with torso.",
      "Hold 1-second pause keeping hips square to floor.",
      "Return smoothly and switch sides."
    ],
    "durationMinutes": 6,
    "caloriesBurnEstimate": 45,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "mountain-climbers",
    "name": "Mountain Climbers (Dynamic Core)",
    "muscleGroup": "Core",
    "subCategory": "Core",
    "targetMuscles": [
      "Rectus Abdominis",
      "Hip Flexors"
    ],
    "secondaryMuscles": [
      "Shoulders",
      "Cardio"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Compound",
    "tempo": "Continuous",
    "timeUnderTension": "45s",
    "breathingCue": "Rhythmic breathing matching rapid knee drive cadence.",
    "instructions": [
      "Assume high push-up plank with hands under shoulders.",
      "Drive one knee toward chest without letting hips bounce high into air.",
      "Rapidly switch legs in sprinting motion.",
      "Keep core clamped tight throughout."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 80,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "v-ups",
    "name": "Bodyweight V-Ups",
    "muscleGroup": "Core",
    "subCategory": "Core",
    "targetMuscles": [
      "Rectus Abdominis",
      "Hip Flexors"
    ],
    "secondaryMuscles": [
      "Obliques"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "mechanics": "Isolation",
    "tempo": "2-0-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale lying flat; exhale snapping up into V-shape touching toes.",
    "instructions": [
      "Lie flat on back with arms extended overhead and legs straight together.",
      "Simultaneously lift torso and legs toward ceiling, balancing on glutes in 'V' shape.",
      "Reach hands to touch shins or toes at peak.",
      "Lower under control back to flat floor."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 65,
    "imageUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "bicycle-crunches",
    "name": "Bicycle Crunches",
    "muscleGroup": "Core",
    "subCategory": "Core",
    "targetMuscles": [
      "Obliques",
      "Rectus Abdominis"
    ],
    "secondaryMuscles": [
      "Hip Flexors"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-1-2-1",
    "timeUnderTension": "45s",
    "breathingCue": "Exhale as elbow drives to opposite knee; inhale passing through center.",
    "instructions": [
      "Lie on back with hands behind head and legs elevated at 90 degrees.",
      "Rotate torso to bring right elbow to left knee while extending right leg straight out.",
      "Hold 1-second squeeze, then switch to left elbow to right knee.",
      "Focus on genuine torso rotation rather than pulling neck."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 60,
    "imageUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "pallof-press",
    "name": "Cable Pallof Press (Anti-Rotation)",
    "muscleGroup": "Core",
    "subCategory": "Core",
    "targetMuscles": [
      "Obliques",
      "Transverse Abdominis (Anti-Rotation)"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Shoulders"
    ],
    "equipment": "Cables",
    "difficulty": "Beginner",
    "mechanics": "Isolation",
    "tempo": "2-2-2-0",
    "timeUnderTension": "45s",
    "breathingCue": "Inhale at chest; exhale pressing hands straight out resisting rotational pull.",
    "instructions": [
      "Set cable at chest height. Stand perpendicular to cable tower holding handle at chest with both hands.",
      "Step out to create cable tension in athletic quarter-squat.",
      "Press handle straight out in front of chest without allowing torso to twist.",
      "Hold for 2 seconds at full arm reach, then return to sternum."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 55,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  },
  {
    "id": "toes-to-bar",
    "name": "Toes-to-Bar",
    "muscleGroup": "Core",
    "subCategory": "Core",
    "targetMuscles": [
      "Rectus Abdominis",
      "Hip Flexors"
    ],
    "secondaryMuscles": [
      "Lats",
      "Forearms"
    ],
    "equipment": "Bodyweight",
    "difficulty": "Advanced",
    "mechanics": "Compound",
    "tempo": "2-0-1-0",
    "timeUnderTension": "40s",
    "breathingCue": "Inhale at hang; exhale snapping feet up to make contact with bar.",
    "instructions": [
      "Hang from bar with active shoulders. Engage lats and compress abdominal wall.",
      "Swing legs upward in unified motion until shins or toes contact bar between hands.",
      "Control descent smoothly to prevent uncontrolled kipping.",
      "Re-brace core at bottom and repeat immediately."
    ],
    "durationMinutes": 8,
    "caloriesBurnEstimate": 75,
    "imageUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop",
    "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "thumbnailUrl": "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=400&auto=format&fit=crop"
  }
];

/**
 * Normalized lookup dictionary mapping lowercase name and slug id to ExerciseLibraryEntry.
 */
export const EXERCISE_LIBRARY_MAP: Record<string, ExerciseLibraryEntry> = {};

EXERCISE_LIBRARY.forEach((entry) => {
  EXERCISE_LIBRARY_MAP[entry.id] = entry;
  EXERCISE_LIBRARY_MAP[entry.name.toLowerCase().trim()] = entry;
  // Clean variations (e.g. without punctuation)
  const cleanName = entry.name.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim();
  if (!EXERCISE_LIBRARY_MAP[cleanName]) {
    EXERCISE_LIBRARY_MAP[cleanName] = entry;
  }
});

/**
 * Fast lookup helper for any exercise name or slug.
 */
export function getExerciseLibraryItem(nameOrId: string): ExerciseLibraryEntry | undefined {
  if (!nameOrId) return undefined;
  const normalized = nameOrId.toLowerCase().trim();
  if (EXERCISE_LIBRARY_MAP[normalized]) return EXERCISE_LIBRARY_MAP[normalized];

  const clean = normalized.replace(/[^a-z0-9 ]/g, "").trim();
  if (EXERCISE_LIBRARY_MAP[clean]) return EXERCISE_LIBRARY_MAP[clean];

  // Fuzzy match
  for (const [key, item] of Object.entries(EXERCISE_LIBRARY_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return item;
    }
  }

  return undefined;
}

/**
 * Query exercises filtered by muscle group, equipment, or subCategory.
 */
export function queryExerciseLibrary(filters?: {
  muscleGroup?: MuscleGroup;
  subCategory?: SubCategory;
  equipment?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
}): ExerciseLibraryEntry[] {
  return EXERCISE_LIBRARY.filter((item) => {
    if (filters?.muscleGroup && item.muscleGroup !== filters.muscleGroup) return false;
    if (filters?.subCategory && item.subCategory !== filters.subCategory) return false;
    if (filters?.equipment && !item.equipment.toLowerCase().includes(filters.equipment.toLowerCase())) return false;
    if (filters?.difficulty && item.difficulty !== filters.difficulty) return false;
    return true;
  });
}
