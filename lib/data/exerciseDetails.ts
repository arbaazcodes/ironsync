export interface ExecutionSteps {
  setup: string;
  movement: string;
  returnPhase: string;
  breathing: string;
}

export interface StructuredExerciseDetail {
  primaryMuscles: string[];
  defaultRest: string;
  equipment?: string;
  difficulty?: string;
  executionCue: string;
  commonMistake: string; // Backward compatibility
  formCues: string[];
  commonMistakes: string[];
  executionSteps: ExecutionSteps;
  videoUrl?: string;
}

const EXERCISE_KNOWLEDGE_BASE: Record<string, StructuredExerciseDetail> = {
  // ==========================================
  // PUSH & CHEST
  // ==========================================
  "barbell bench press": {
    primaryMuscles: ["Chest (Pectoralis Major)", "Anterior Deltoids", "Triceps"],
    defaultRest: "120 sec",
    equipment: "Commercial Gym (Barbell & Bench)",
    difficulty: "Intermediate",
    executionCue: "Retract and depress scapulae, plant heels firmly, lower bar controlled to lower sternum, and press explosively without unlocking shoulders.",
    commonMistake: "Flaring elbows out at 90 degrees or letting wrists bend backwards under heavy load.",
    formCues: [
      "Retract shoulder blades tight into the bench pad",
      "Tuck elbows at roughly a 45–60 degree angle",
      "Lower bar controlled until it grazes lower sternum",
      "Drive through palms and midfoot without bouncing off ribcage",
    ],
    commonMistakes: [
      "Excessive elbow flaring placing anterior shoulder capsule at risk",
      "Bouncing the barbell off the sternum using trampoline momentum",
      "Lifting hips and glutes off the bench to cheat the lockout",
    ],
    executionSteps: {
      setup: "Lie flat on the bench with eyes aligned directly beneath the racked bar. Grip the knurling slightly wider than shoulder width. Retract your shoulder blades and drive your heels firmly into the floor.",
      movement: "Unrack the bar and stabilize it directly over your mid-chest. Lower the barbell in a controlled, diagonal path down to your lower sternum while keeping your wrists stacked directly over your forearms.",
      returnPhase: "Press the bar upward and slightly backward toward your rack line. Lock out your elbows smoothly while keeping your shoulder blades firmly pinned against the bench pad.",
      breathing: "Take a deep diaphragmatic breath into your core before initiating the descent. Hold through the bottom turn-around, then exhale forcefully as you drive past the sticking point.",
    },
    // W3C HTML5 standard open test video asset
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  "flat dumbbell press": {
    primaryMuscles: ["Pectoralis Major", "Triceps Brachii", "Front Delts"],
    defaultRest: "90 sec",
    equipment: "Home Gym / Commercial Gym",
    difficulty: "Intermediate",
    executionCue: "Maintain a 45-degree elbow angle, converge slightly at top without clanking dumbbells, feel deep stretch at the bottom.",
    commonMistake: "Dropping weights too fast on eccentric phase, losing tension at bottom.",
    formCues: [
      "Keep wrists neutral and stacked over elbows",
      "Converge dumbbells slightly at top without touching",
      "Control a 2–3 second lowering phase into deep chest stretch",
    ],
    commonMistakes: [
      "Clanking dumbbells together at top, which removes mechanical tension",
      "Dropping elbows below bench level without adequate rotator cuff control",
    ],
    executionSteps: {
      setup: "Sit on the bench edge with dumbbells resting vertically on your thighs. Kick your knees up one at a time to guide the weights into position as you lie back. Plant feet firmly.",
      movement: "Position the dumbbells at chest height with palms angled slightly inward (45 degrees). Press both dumbbells upward simultaneously along an arc that finishes directly over your mid-chest.",
      returnPhase: "Lower the dumbbells slowly over 2–3 seconds until your chest experiences a full, comfortable stretch, keeping forearms perpendicular to the floor.",
      breathing: "Inhale deeply as you lower the dumbbells to expand the ribcage; exhale powerfully through pursed lips as you press upward.",
    },
  },
  "incline barbell bench press": {
    primaryMuscles: ["Upper Pectoralis (Clavicular Head)", "Anterior Deltoids", "Triceps"],
    defaultRest: "120 sec",
    equipment: "Commercial Gym (Incline Bench & Barbell)",
    difficulty: "Intermediate",
    executionCue: "Set bench to 30 degrees, touch bar softly to upper chest/clavicle line, drive vertical.",
    commonMistake: "Setting incline angle too steep (>45 deg), shifting load onto front shoulders.",
    formCues: [
      "Keep bench angle at 30 degrees for maximal clavicular focus",
      "Touch bar gently to upper collarbone line",
      "Maintain active arch with glutes anchored to the seat",
    ],
    commonMistakes: [
      "Setting the incline bench too steep, which turns it into a front deltoid press",
      "Flaring elbows excessively wide",
    ],
    executionSteps: {
      setup: "Set an adjustable incline bench to 30 degrees. Lie back, retract your scapulae, and grip the bar with a medium overhand grip.",
      movement: "Unrack the bar and establish stable balance above your upper chest. Lower the bar smoothly to your upper sternum or clavicle line.",
      returnPhase: "Press the bar vertically along a straight trajectory to full elbow extension without rolling your shoulders forward.",
      breathing: "Inhale and brace your core during the descent; exhale as the bar crosses your chin level on the way up.",
    },
  },
  "incline dumbbell press": {
    primaryMuscles: ["Upper Pectoralis", "Front Delts", "Triceps"],
    defaultRest: "90 sec",
    equipment: "Home Gym / Dumbbells",
    difficulty: "Intermediate",
    executionCue: "Pinch shoulder blades together into bench, lower dumbbells slowly with elbows under wrists, squeeze upper chest at lockout.",
    commonMistake: "Over-arching lower back to turn movement into a flat press.",
    formCues: [
      "Keep chest lifted toward ceiling",
      "Maintain controlled 2-second negative",
      "Squeeze upper chest at top of rep",
    ],
    commonMistakes: [
      "Arching lower back off the pad to mimic a flat press",
      "Rushing repetitions without establishing stretch at bottom",
    ],
    executionSteps: {
      setup: "Adjust bench to 30 degrees. Hoist dumbbells onto knees and kick them back to shoulder height as you recline onto the pad.",
      movement: "Press both dumbbells upward in a slight converging arc, finishing directly above your upper chest with knuckles facing the ceiling.",
      returnPhase: "Lower the dumbbells with elbows tucked at 45 degrees, stopping when dumbbells are level with your upper chest.",
      breathing: "Inhale deeply as you descend into the stretch; exhale as you propel the dumbbells upward.",
    },
  },
  "push-ups": {
    primaryMuscles: ["Pectoralis Major", "Triceps", "Core / Serratus Anterior"],
    defaultRest: "60 sec",
    equipment: "Bodyweight (No Equipment)",
    difficulty: "Beginner",
    executionCue: "Maintain rigid plank from heels to crown, tuck elbows 45 degrees, chest touches floor every repetition.",
    commonMistake: "Sagging hips or poking head forward rather than lowering chest.",
    formCues: [
      "Lock glutes and abs in a rigid plank",
      "Lower until chest grazes the floor",
      "Tuck elbows at 45 degrees to protect shoulders",
      "Push floor away with full arm extension",
    ],
    commonMistakes: [
      "Sagging hips or hyperextending lumbar spine",
      "Craning neck forward to touch chin to floor rather than chest",
      "Incomplete lockout at top",
    ],
    executionSteps: {
      setup: "Place hands slightly wider than shoulder-width apart on the floor. Extend legs back so your body forms a straight, unbroken line from heels to crown. Squeeze glutes and abs.",
      movement: "Bend elbows to lower your entire torso simultaneously, keeping your elbows tracking backward at 45 degrees until your chest touches the floor.",
      returnPhase: "Press firmly through your palms to return to the starting plank position, spreading your shoulder blades slightly at the top.",
      breathing: "Inhale as your body descends toward the floor; exhale as you push yourself back up to the top position.",
    },
    // W3C HTML5 standard open test video asset
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
  },

  // ==========================================
  // VERTICAL PUSH & SHOULDERS
  // ==========================================
  "standing overhead press": {
    primaryMuscles: ["Deltoids (Anterior & Lateral)", "Upper Chest", "Triceps", "Core"],
    defaultRest: "120 sec",
    equipment: "Commercial Gym (Barbell)",
    difficulty: "Intermediate",
    executionCue: "Squeeze glutes and quads tight, clear head as bar passes face, lock out bar directly over midfoot.",
    commonMistake: "Leaning back excessively to recruit upper chest as a cheater mechanism.",
    formCues: [
      "Squeeze glutes and quads as rigid anchors",
      "Pull chin back slightly to clear the bar path",
      "Push head through the window at top lockout",
    ],
    commonMistakes: [
      "Excessive lumbar hyperextension that stresses the spine",
      "Pressing bar out in front rather than vertically over midfoot",
    ],
    executionSteps: {
      setup: "Grip the barbell just outside your shoulders. Rest the bar across your front deltoids and upper clavicles with wrists stacked over forearms. Squeeze glutes and lock your core.",
      movement: "Tilt your head back slightly to clear your chin. Press the barbell vertically in a straight line upward.",
      returnPhase: "Once the bar clears your forehead, push your head through the window and lock out directly over your midfoot. Lower the bar controlled back to your collarbone.",
      breathing: "Inhale and brace your abdominal wall before the press; exhale once the bar is secured overhead.",
    },
  },
  "overhead dumbbell press": {
    primaryMuscles: ["Anterior & Lateral Deltoids", "Triceps", "Upper Trapezius"],
    defaultRest: "90 sec",
    equipment: "Home Gym / Dumbbells",
    difficulty: "Beginner",
    executionCue: "Brace core, start dumbbells at ear level, press straight overhead in scaption plane without hyperextending ribs.",
    commonMistake: "Excessive lumbar extension to compensate for limited overhead mobility.",
    formCues: [
      "Start dumbbells at ear height with palms angled slightly in",
      "Press vertically without clanking bells together",
      "Keep ribcage pinned down to avoid lower back arching",
    ],
    commonMistakes: [
      "Allowing weights to flare excessively wide into extreme external rotation",
      "Arching lower back off seat pad",
    ],
    executionSteps: {
      setup: "Sit upright on a vertical bench with feet flat on the floor. Raise dumbbells to shoulder height with palms angled slightly inward (scaption plane).",
      movement: "Press both dumbbells straight overhead along a natural arc until your arms are fully extended.",
      returnPhase: "Lower the dumbbells in a controlled 2-second negative back to ear level before initiating the next rep.",
      breathing: "Inhale at the bottom; exhale continuously as you press the dumbbells overhead.",
    },
  },
  "lateral raises": {
    primaryMuscles: ["Lateral Deltoid (Side Cap)"],
    defaultRest: "60 sec",
    equipment: "Home Gym / Dumbbells",
    difficulty: "Beginner",
    executionCue: "Slight forward torso lean, lead with elbows up to shoulder height, imagine pouring out two water pitchers.",
    commonMistake: "Swinging hips or shrugging traps to heave dumbbells up.",
    formCues: [
      "Lean forward 10 degrees at hips",
      "Lead movement with your elbows",
      "Raise only to shoulder height, not overhead",
      "Control the descent; don't let weights drop",
    ],
    commonMistakes: [
      "Using hip momentum or swinging torso to heave the dumbbells",
      "Shrugging upper traps up toward ears",
    ],
    executionSteps: {
      setup: "Stand with feet shoulder-width apart, holding dumbbells at your sides with a slight bend in your knees. Lean forward approximately 10 degrees from hips.",
      movement: "Raise your arms outward to the sides, leading with your elbows, until your upper arms are parallel with the floor.",
      returnPhase: "Pause for a brief fraction of a second at peak height, then lower the dumbbells over 2 seconds under complete muscular control.",
      breathing: "Exhale on the lateral raise; inhale on the eccentric lowering phase.",
    },
  },

  // ==========================================
  // PULL & BACK
  // ==========================================
  "barbell deadlift": {
    primaryMuscles: ["Erector Spinae", "Gluteus Maximus", "Hamstrings", "Lats"],
    defaultRest: "180 sec",
    equipment: "Commercial Gym (Barbell & Plates)",
    difficulty: "Advanced",
    executionCue: "Bar over midfoot, pull slack out of bar, wedge hips into position, push the floor away like a leg press.",
    commonMistake: "Rounding lumbar spine off the floor, or hyperextending at top lockout.",
    formCues: [
      "Barbell must stay in contact with shins and thighs throughout",
      "Pull slack out of the bar before driving off the floor",
      "Push the floor away rather than pulling with your lower back",
      "Stand tall at lockout without hyperextending backwards",
    ],
    commonMistakes: [
      "Rounding the lower back off the floor",
      "Letting the bar drift away from the body",
      "Jerking the barbell aggressively off the floor instead of smooth leg drive",
    ],
    executionSteps: {
      setup: "Stand with feet hip-width apart and the bar directly over midfoot. Hinge at hips to grip the bar just outside your shins. Pull chest tall, engage lats, and pull the slack out of the barbell.",
      movement: "Push the floor away through midfoot, keeping your hips and shoulders rising at the exact same rate until the bar crosses your knees.",
      returnPhase: "Drive hips forward into the bar to complete the lockout. Reverse the movement by hinging hips back until the bar passes your knees, then set the weight down flat.",
      breathing: "Take a maximal diaphragmatic breath into your belt and brace hard before initiating pull. Exhale once locked out or upon rep completion.",
    },
  },
  "pull-ups": {
    primaryMuscles: ["Latissimus Dorsi", "Teres Major", "Biceps Brachii", "Rhomboids"],
    defaultRest: "90 sec",
    equipment: "Bodyweight (Pull-up Bar)",
    difficulty: "Intermediate",
    executionCue: "Full dead hang stretch at bottom, depress shoulder blades before pulling chest toward bar, drive elbows down to hips.",
    commonMistake: "Kicking legs or doing half-reps without completing full range of motion.",
    formCues: [
      "Start from complete dead hang with arms fully extended",
      "Depress scapulae down before bending your elbows",
      "Drive elbows toward hip pockets",
      "Clear chin fully over the bar at the top",
    ],
    commonMistakes: [
      "Kicking legs or using kipping momentum",
      "Shortchanging the bottom range of motion",
    ],
    executionSteps: {
      setup: "Grip a pull-up bar with an overhand grip slightly wider than shoulder width. Hang freely with legs straight or crossed behind you.",
      movement: "Depress your shoulder blades downward, then pull your body upward by driving your elbows down toward your hips until your chin clears the bar.",
      returnPhase: "Lower yourself with complete control over 2–3 seconds back to a full dead hang stretch.",
      breathing: "Inhale at the bottom hang; exhale as you pull your chest toward the bar.",
    },
  },
  "lat pulldown": {
    primaryMuscles: ["Latissimus Dorsi", "Biceps", "Mid-Trapezius"],
    defaultRest: "75 sec",
    equipment: "Commercial Gym (Cable Machine)",
    difficulty: "Beginner",
    executionCue: "Slight 10-degree torso lean, initiate pull with shoulder blades, pull bar to upper clavicle, control 3-second eccentric.",
    commonMistake: "Yanking torso backward 45 degrees to use momentum.",
    formCues: [
      "Thighs securely locked under roller pads",
      "Initiate the pull by retracting and depressing scapulae",
      "Pull bar to upper chest line, not to the stomach",
    ],
    commonMistakes: [
      "Leaning back excessively to turn the exercise into a horizontal row",
      "Allowing the weight stack to slam at the top",
    ],
    executionSteps: {
      setup: "Sit down with thighs securely anchored under the roller pads. Grasp the wide bar with an overhand grip outside shoulder width.",
      movement: "Lean back approximately 10 degrees. Pull the bar smoothly downward to touch your upper clavicles by driving your elbows down and back.",
      returnPhase: "Extend your arms upward with resistance, letting your lats stretch fully at the peak without losing torso stability.",
      breathing: "Exhale on the pulldown; inhale as you release the bar upward into the stretch.",
    },
  },
  "single-arm dumbbell row": {
    primaryMuscles: ["Latissimus Dorsi", "Rhomboids", "Biceps"],
    defaultRest: "75 sec",
    equipment: "Home Gym / Dumbbells & Bench",
    difficulty: "Beginner",
    executionCue: "Support hand and knee on bench, pull dumbbell in an arc toward hip pocket, keep shoulders square to floor.",
    commonMistake: "Rotating spine violently at the top rather than pulling with lats.",
    formCues: [
      "Keep torso parallel to the bench pad",
      "Pull dumbbell toward hip pocket, not straight up to chest",
      "Feel lat contract at top with 1-second pause",
    ],
    commonMistakes: [
      "Rotating shoulders and spine violently to heave the weight",
      "Pulling strictly with the biceps rather than driving the elbow back",
    ],
    executionSteps: {
      setup: "Place one knee and hand on a flat bench. Hold a dumbbell in the opposite hand with arm hanging directly beneath your shoulder. Keep your back flat.",
      movement: "Pull the dumbbell in a slight backward arc toward your hip pocket, driving your elbow behind your torso while keeping your shoulders square.",
      returnPhase: "Lower the weight slowly under tension until your lat achieves a full, comfortable stretch at the bottom.",
      breathing: "Exhale as you row the weight up; inhale as you lower the dumbbell back down.",
    },
  },

  // ==========================================
  // SQUATS & LEGS
  // ==========================================
  "barbell back squat": {
    primaryMuscles: ["Quadriceps", "Gluteus Maximus", "Adductors", "Core"],
    defaultRest: "150 sec",
    equipment: "Commercial Gym (Barbell & Squat Rack)",
    difficulty: "Intermediate",
    executionCue: "Big diaphragmatic breath into belt, break hips and knees simultaneously, descend to parallel, drive up through midfoot.",
    commonMistake: "Knees collapsing inward (valgus) or chest collapsing forward on ascent.",
    formCues: [
      "Position bar firmly across upper traps (high bar) or rear delts (low bar)",
      "Break knees and hips simultaneously",
      "Hit parallel depth with knees tracking in line with toes",
      "Drive through whole foot on ascent with chest proud",
    ],
    commonMistakes: [
      "Knees caving inward (valgus collapse) out of the hole",
      "Chest collapsing forward, turning squat into a good morning",
      "Heels lifting off the floor during descent",
    ],
    executionSteps: {
      setup: "Step under the barbell, resting it securely on your upper traps. Unrack with a two-step walkout, placing feet slightly wider than shoulder-width with toes flared out 15–30 degrees.",
      movement: "Take a deep diaphragmatic breath and brace your core. Sit down between your knees, descending under control until your hip crease drops parallel with or slightly below the tops of your knees.",
      returnPhase: "Drive the floor away through your midfoot, keeping your chest proud and knees tracking outward over your second toes until you stand tall.",
      breathing: "Inhale and perform a Valsalva brace at the top; hold breath through the descent and turnaround; exhale past the sticking point.",
    },
  },
  "dumbbell goblet squat": {
    primaryMuscles: ["Quadriceps", "Gluteus Maximus", "Upper Back / Core"],
    defaultRest: "90 sec",
    equipment: "Home Gym / Dumbbell",
    difficulty: "Beginner",
    executionCue: "Hold dumbbell vertically tight against chest, sink between hips keeping elbows inside knees, maintain upright torso.",
    commonMistake: "Allowing dumbbell to pull torso forward, rounding thoracic spine.",
    formCues: [
      "Hold dumbbell vertically against upper sternum like a goblet",
      "Keep torso upright and proud",
      "Sink hips down between heels",
      "Elbows track inside knees at bottom depth",
    ],
    commonMistakes: [
      "Allowing dumbbell to drift away from chest, rounding upper back",
      "Resting elbows heavily on knees at bottom",
    ],
    executionSteps: {
      setup: "Cup the top head of a vertical dumbbell with both hands against your upper chest. Set feet shoulder-width apart with toes pointed slightly outward.",
      movement: "Initiate squat by sitting your hips back and down between your legs, keeping your elbows tracking cleanly inside your knees.",
      returnPhase: "Hit full depth with flat feet, then push through your midfoot to stand tall, locking out your hips at the top.",
      breathing: "Inhale deeply as you descend; exhale as you stand back up.",
    },
  },
  "romanian deadlift": {
    primaryMuscles: ["Hamstrings", "Gluteus Maximus", "Erector Spinae"],
    defaultRest: "120 sec",
    equipment: "Commercial Gym / Barbell or Dumbbells",
    difficulty: "Intermediate",
    executionCue: "Slight knee bend fixed in place, hinge back by pushing hips toward back wall, stop when hamstrings reach full stretch.",
    commonMistake: "Squatting the weight down by bending knees excessively, losing hamstring tension.",
    formCues: [
      "Maintain a soft, fixed 15-degree knee bend",
      "Push hips backward as if touching a wall behind you",
      "Barbell or dumbbells remain in contact with thighs and shins",
      "Stop when hips cannot travel further back",
    ],
    commonMistakes: [
      "Bending knees excessively, which turns the hinge into a squat",
      "Rounding the lower back to lower the weight further",
    ],
    executionSteps: {
      setup: "Stand tall holding a barbell or dumbbells against your thighs. Set feet hip-width apart and soften your knees slightly.",
      movement: "Keep knees at the same slight bend and push your hips directly backward. Slide the weights down your thighs until you feel a deep, intense stretch in your hamstrings (mid-shin level).",
      returnPhase: "Squeeze your glutes and push your hips forward into the bar to return to a tall standing posture.",
      breathing: "Inhale into your abdomen as hips travel back; exhale forcefully as hips lock out.",
    },
  },
  "bulgarian split squat": {
    primaryMuscles: ["Quadriceps", "Gluteus Medius / Maximus", "Hamstrings"],
    defaultRest: "90 sec",
    equipment: "Home Gym / Dumbbells & Bench",
    difficulty: "Intermediate",
    executionCue: "Rear foot on bench laces-down, forward torso lean for glutes or upright for quads, descend until back knee hovers above floor.",
    commonMistake: "Pushing off rear foot rather than driving 90% load through front heel.",
    formCues: [
      "Set rear foot laces-down on the bench",
      "Place 90% of your bodyweight on the front working leg",
      "Lower until rear knee lightly kisses the floor",
      "Drive through front heel to rise",
    ],
    commonMistakes: [
      "Using the rear foot to push yourself up instead of the front leg",
      "Taking too short of a stride causing front heel to peel off floor",
    ],
    executionSteps: {
      setup: "Stand about two feet in front of a flat bench. Place the top of your rear foot onto the bench pad. Hold dumbbells at your sides.",
      movement: "Descend under control by bending your front knee and hip, allowing your back knee to drop toward the floor directly under your hip.",
      returnPhase: "Drive through your front heel to stand back up, keeping tension locked on the front quadricep and glute.",
      breathing: "Inhale on the descent; exhale as you push up through the front heel.",
    },
  },

  // ==========================================
  // ARMS & ISOLATION
  // ==========================================
  "bicep curl": {
    primaryMuscles: ["Biceps Brachii (Long/Short head)", "Brachialis"],
    defaultRest: "60 sec",
    equipment: "Home Gym / Dumbbells",
    difficulty: "Beginner",
    executionCue: "Pin elbows at sides, supinate wrist fully as weight passes thighs, squeeze peak bicep contraction.",
    commonMistake: "Swinging elbows forward or hyperextending back to bounce weights up.",
    formCues: [
      "Pin upper arms stationary at your ribcage",
      "Rotate wrists outward (supinate) on the way up",
      "Squeeze biceps hard for 1 second at the top",
      "Lower weights over 2 seconds under full tension",
    ],
    commonMistakes: [
      "Swinging elbows forward to recruit front delts",
      "Using torso momentum to cheat the reps",
    ],
    executionSteps: {
      setup: "Stand with feet shoulder-width apart, holding dumbbells at arm's length by your sides with palms facing each other.",
      movement: "Keeping your upper arms stationary, curl the weights forward while supinating your wrists so palms face upward at the top.",
      returnPhase: "Pause at peak contraction, then lower the dumbbells slowly back to the starting neutral position.",
      breathing: "Exhale as you curl the dumbbells up; inhale as you lower them.",
    },
  },
  "tricep extension": {
    primaryMuscles: ["Triceps Brachii (Lateral & Medial heads)"],
    defaultRest: "60 sec",
    equipment: "Commercial Gym (Cable)",
    difficulty: "Beginner",
    executionCue: "Lock elbows tight against ribs, extend downward spreading rope at bottom, control return to 90 degrees.",
    commonMistake: "Letting elbows flare outwards or drift forward during extension.",
    formCues: [
      "Keep elbows locked into sides throughout",
      "Lock out arms fully at the bottom",
      "Control the return phase without letting weights jerk your arms up",
    ],
    commonMistakes: [
      "Allowing elbows to drift forward or flare out",
      "Using shoulder momentum rather than isolated elbow extension",
    ],
    executionSteps: {
      setup: "Attach a rope or straight bar to a high cable pulley. Grasp handles and step back slightly with elbows pinned against your ribcage.",
      movement: "Extend your forearms downward until your elbows are completely locked out, spreading the rope handles apart at the bottom.",
      returnPhase: "Bend your elbows to allow the cable to return upward with control until forearms are parallel with floor.",
      breathing: "Exhale on extension; inhale on the upward return.",
    },
  },
  "hanging leg raises": {
    primaryMuscles: ["Rectus Abdominis", "Hip Flexors", "Obliques"],
    defaultRest: "60 sec",
    equipment: "Commercial Gym (Pull-up Bar)",
    difficulty: "Intermediate",
    executionCue: "Hang from bar without swinging, posterior pelvic tilt to initiate, curl pelvis toward chest rather than just swinging legs.",
    commonMistake: "Using pendulum momentum without actual abdominal contraction.",
    formCues: [
      "Eliminate swing before starting each repetition",
      "Tilt pelvis up toward ribcage",
      "Curl abdominal wall rather than just lifting legs with hip flexors",
    ],
    commonMistakes: [
      "Using pendulum momentum to kick legs up",
      "Failing to posteriorly tilt pelvis",
    ],
    executionSteps: {
      setup: "Hang from a pull-up bar with an overhand grip, shoulders active and body completely motionless.",
      movement: "Contract your lower abs and tilt your pelvis backward, bringing your knees or straight legs up toward your chest in a curling motion.",
      returnPhase: "Lower your legs slowly over 2 seconds to avoid swinging into the next repetition.",
      breathing: "Exhale forcefully as you raise your legs; inhale as you lower them back to hang.",
    },
  },
};

/**
 * Fallback generator for exercises not explicitly in the detailed dictionary.
 * Guarantees standard 4-stage execution, cues, and mistakes.
 */
function generateFallbackDetail(exerciseName: string): StructuredExerciseDetail {
  const normalized = exerciseName.toLowerCase();

  if (normalized.includes("press") || normalized.includes("bench") || normalized.includes("push")) {
    return {
      primaryMuscles: ["Chest", "Front Delts", "Triceps"],
      defaultRest: "90 sec",
      equipment: "Gym / Dumbbells",
      difficulty: "Intermediate",
      executionCue: "Set shoulders back, maintain controlled 2-second negative, drive through palms.",
      commonMistake: "Flaring elbows excessively wide or rushing the eccentric portion.",
      formCues: [
        "Retract shoulder blades tight into the pad",
        "Tuck elbows 45 degrees to protect shoulders",
        "Control a 2-second lowering phase",
        "Lock out smoothly without shrugging",
      ],
      commonMistakes: [
        "Flaring elbows excessively wide at 90 degrees",
        "Bouncing weight out of the bottom position",
      ],
      executionSteps: {
        setup: "Establish a stable base of support with feet planted firmly and shoulder blades retracted into the bench pad.",
        movement: "Unrack or position the weight over your mid-chest. Lower under control to touch or reach a deep muscular stretch.",
        returnPhase: "Press the weight vertically upward along a controlled trajectory until arms are fully extended.",
        breathing: "Inhale on the descent; exhale forcefully as you drive through the concentric press.",
      },
    };
  }

  if (normalized.includes("row") || normalized.includes("pull") || normalized.includes("chin") || normalized.includes("lat")) {
    return {
      primaryMuscles: ["Lats", "Upper Back", "Biceps"],
      defaultRest: "90 sec",
      equipment: "Gym / Free Weights",
      difficulty: "Intermediate",
      executionCue: "Initiate movement with scapular retraction, pull elbows back toward hips, pause at peak contraction.",
      commonMistake: "Jerking with body momentum or pulling entirely with forearms.",
      formCues: [
        "Initiate pull by retracting shoulder blades",
        "Drive elbows back toward hip pockets",
        "Squeeze back muscles for 1 second at peak contraction",
        "Resist the weight on the forward stretch",
      ],
      commonMistakes: [
        "Using excessive hip/back momentum to yank the weight",
        "Pulling with forearms rather than driving with elbows",
      ],
      executionSteps: {
        setup: "Position your torso with a neutral spine, bracing your core and gripping handles firmly.",
        movement: "Depress and retract your scapulae, driving your elbows back behind your torso until the weight meets your body.",
        returnPhase: "Extend your arms smoothly under resistance, feeling your back muscles stretch fully at the end range.",
        breathing: "Inhale on the stretch; exhale as you pull into the contraction.",
      },
    };
  }

  if (normalized.includes("squat") || normalized.includes("leg press") || normalized.includes("lunge")) {
    return {
      primaryMuscles: ["Quadriceps", "Glutes", "Hamstrings"],
      defaultRest: "120 sec",
      equipment: "Gym / Free Weights",
      difficulty: "Intermediate",
      executionCue: "Break knees and hips simultaneously, hit parallel depth with chest proud, drive through whole foot.",
      commonMistake: "Knees caving inward or heels peeling off the floor.",
      formCues: [
        "Keep feet planted firmly through whole foot",
        "Descend until thighs hit parallel with floor",
        "Keep chest proud and eyes forward",
        "Drive through midfoot out of the hole",
      ],
      commonMistakes: [
        "Knees caving inward on ascent",
        "Allowing heels to lift off the ground",
      ],
      executionSteps: {
        setup: "Position feet shoulder-width apart with toes angled slightly outward. Brace core and align spine.",
        movement: "Sit hips back and down, bending knees and hips together until reaching parallel depth.",
        returnPhase: "Drive through midfoot to return to a tall standing lockout.",
        breathing: "Inhale and brace core on descent; exhale forcefully on ascent.",
      },
    };
  }

  return {
    primaryMuscles: ["Target Muscle Group", "Core Stabilizers"],
    defaultRest: "90 sec",
    equipment: "Gym / Home",
    difficulty: "Intermediate",
    executionCue: "Maintain strict posture, perform controlled 2-second eccentric phase, breathe rhythmically through repetition.",
    commonMistake: "Rushing repetitions and using momentum over mechanical tension.",
    formCues: [
      "Maintain neutral spinal alignment throughout",
      "Control a 2-second negative phase on every rep",
      "Focus mechanical tension on the target muscle",
      "Breathe rhythmically without holding breath unnecessarily",
    ],
    commonMistakes: [
      "Rushing repetitions using ballistic momentum",
      "Cutting active range of motion short",
    ],
    executionSteps: {
      setup: "Establish a stable, balanced starting position. Check your grip and align your spine.",
      movement: "Initiate the movement smoothly under muscular control through a full active range of motion.",
      returnPhase: "Control the eccentric return phase over 2 seconds before beginning the next repetition.",
      breathing: "Inhale during the lowering/stretch phase; exhale through the working contraction.",
    },
  };
}

/**
 * Normalizes an exercise name and returns structured execution cues and metadata.
 */
export function getExerciseDetails(exerciseName: string): StructuredExerciseDetail {
  const normalized = exerciseName.toLowerCase().trim();

  // 1. Direct match in knowledge base
  if (EXERCISE_KNOWLEDGE_BASE[normalized]) {
    return EXERCISE_KNOWLEDGE_BASE[normalized];
  }

  // 2. Substring match in knowledge base
  for (const [key, details] of Object.entries(EXERCISE_KNOWLEDGE_BASE)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return details;
    }
  }

  // 3. Fallback safe standard
  return generateFallbackDetail(exerciseName);
}
