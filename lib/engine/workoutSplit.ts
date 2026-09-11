import {
  ExperienceLevel,
  GoalId,
  TrainingEnvironment,
  WorkoutDayPlan,
} from "../types/onboarding";

/**
 * Generates an individualized training split and day-by-day workout structure
 * tailored to experience, equipment, and weekly frequency.
 */
export function generateWorkoutSchedule(
  goal: GoalId,
  daysPerWeek: number,
  equipment: TrainingEnvironment,
  experience: ExperienceLevel
): { splitName: string; schedule: WorkoutDayPlan[] } {
  const isHome = equipment === "home_gym";
  const isBodyweight = equipment === "bodyweight";

  // Rep ranges adapted to goal
  const primaryReps =
    goal === "strength" ? "4 × 4-6" : goal === "endurance" ? "3 × 15-20" : "4 × 8-10";
  const secondaryReps =
    goal === "strength" ? "3 × 6-8" : goal === "endurance" ? "3 × 12-15" : "3 × 10-12";
  const accessoryReps = "3 × 12-15";

  if (daysPerWeek === 3) {
    const splitName = "3-Day Full Body Density";
    const schedule: WorkoutDayPlan[] = [
      {
        dayName: "MON",
        focus: "Full Body Foundation A",
        type: "workout",
        tag: "Full Body",
        exercises: [
          {
            name: isBodyweight
              ? "Pull-Ups / Inverted Rows"
              : isHome
              ? "Dumbbell Goblet Squat"
              : "Barbell Back Squat",
            setsReps: primaryReps,
            rpe: "RPE 8.0",
          },
          {
            name: isBodyweight
              ? "Decline Push-Ups"
              : isHome
              ? "Flat Dumbbell Press"
              : "Incline Barbell Bench Press",
            setsReps: primaryReps,
            rpe: "RPE 8.0",
          },
          {
            name: isBodyweight
              ? "Single Leg Bulgarian Squats"
              : isHome
              ? "Dumbbell Romanian Deadlift"
              : "Seated Cable Row",
            setsReps: secondaryReps,
            rpe: "RPE 8.5",
          },
          {
            name: isBodyweight ? "Pike Push-Ups" : "Overhead Dumbbell Press",
            setsReps: accessoryReps,
            locked: true,
          },
          {
            name: "Hanging Leg Raises / Core Hollows",
            setsReps: "3 × 15",
            locked: true,
          },
        ],
      },
      {
        dayName: "TUE",
        focus: "Rest & Active Recovery",
        type: "recovery",
        tag: "Recovery",
      },
      {
        dayName: "WED",
        focus: "Full Body Hypertrophy B",
        type: "workout",
        tag: "Full Body",
        exercises: [
          {
            name: isBodyweight
              ? "Dips (Parallel Bars / Chair)"
              : isHome
              ? "Dumbbell Romanian Deadlift"
              : "Conventional Deadlift / RDL",
            setsReps: primaryReps,
            rpe: "RPE 8.0",
          },
          {
            name: isBodyweight
              ? "Archer Push-Ups"
              : isHome
              ? "Incline Dumbbell Press"
              : "Lat Pulldown / Pull-Ups",
            setsReps: secondaryReps,
            rpe: "RPE 8.0",
          },
          {
            name: isBodyweight ? "Walking Lunges" : "Dumbbell Walking Lunges",
            setsReps: secondaryReps,
            rpe: "RPE 8.5",
          },
          {
            name: "Lateral Raises & Tricep Extensions",
            setsReps: accessoryReps,
            locked: true,
          },
        ],
      },
      {
        dayName: "THU",
        focus: "Mobility & Rest",
        type: "recovery",
        tag: "Recovery",
      },
      {
        dayName: "FRI",
        focus: "Full Body Athletic C",
        type: "workout",
        tag: "Full Body",
        exercises: [
          {
            name: isBodyweight
              ? "Chin-Ups"
              : isHome
              ? "Dumbbell Front Squat"
              : "Leg Press / Hack Squat",
            setsReps: primaryReps,
            rpe: "RPE 8.0",
          },
          {
            name: isBodyweight
              ? "Deficit Push-Ups"
              : isHome
              ? "Single-Arm Dumbbell Row"
              : "Standing Overhead Press",
            setsReps: secondaryReps,
            rpe: "RPE 8.0",
          },
          {
            name: "Rear Delt Flyes & Farmer Carries",
            setsReps: accessoryReps,
            locked: true,
          },
        ],
      },
      {
        dayName: "SAT",
        focus: "Active Recovery & Mobility",
        type: "recovery",
        tag: "Recovery",
      },
      {
        dayName: "SUN",
        focus: "Systemic Rest",
        type: "recovery",
        tag: "Rest",
      },
    ];
    return { splitName, schedule };
  }

  if (daysPerWeek === 4) {
    const splitName = "4-Day Upper / Lower Split";
    const schedule: WorkoutDayPlan[] = [
      {
        dayName: "MON",
        focus: "Upper Body Power",
        type: "workout",
        tag: "Upper A",
        exercises: [
          {
            name: isBodyweight
              ? "Push-Up Variations"
              : isHome
              ? "Flat Dumbbell Bench"
              : "Barbell Bench Press",
            setsReps: primaryReps,
            rpe: "RPE 8.0",
          },
          {
            name: isBodyweight
              ? "Weighted / Strict Pull-Ups"
              : isHome
              ? "Chest-Supported DB Row"
              : "Barbell Bent-Over Row",
            setsReps: primaryReps,
            rpe: "RPE 8.0",
          },
          {
            name: isBodyweight
              ? "Dips"
              : isHome
              ? "Seated Dumbbell Press"
              : "Incline Dumbbell Press",
            setsReps: secondaryReps,
            rpe: "RPE 8.5",
          },
          {
            name: "Cable Face Pulls & Hammer Curls",
            setsReps: accessoryReps,
            locked: true,
          },
          {
            name: "Overhead Tricep Cable Extensions",
            setsReps: accessoryReps,
            locked: true,
          },
        ],
      },
      {
        dayName: "TUE",
        focus: "Lower Body Strength",
        type: "workout",
        tag: "Lower A",
        exercises: [
          {
            name: isBodyweight
              ? "Pistol Squat Progressions"
              : isHome
              ? "Dumbbell Goblet Squat"
              : "Barbell Back Squat",
            setsReps: primaryReps,
            rpe: "RPE 8.0",
          },
          {
            name: isBodyweight
              ? "Nordic Hamstring Curl"
              : isHome
              ? "Dumbbell Romanian Deadlift"
              : "Romanian Deadlift",
            setsReps: secondaryReps,
            rpe: "RPE 8.0",
          },
          {
            name: "Bulgarian Split Squats",
            setsReps: secondaryReps,
            locked: true,
          },
          {
            name: "Calf Raises & Ab Wheel Rollouts",
            setsReps: accessoryReps,
            locked: true,
          },
        ],
      },
      {
        dayName: "WED",
        focus: "Midweek Rest & Mobility",
        type: "recovery",
        tag: "Recovery",
      },
      {
        dayName: "THU",
        focus: "Upper Body Hypertrophy",
        type: "workout",
        tag: "Upper B",
        exercises: [
          {
            name: isBodyweight
              ? "Incline Feet-Elevated Push-Ups"
              : isHome
              ? "Incline Dumbbell Press"
              : "Incline Dumbbell Press",
            setsReps: primaryReps,
            rpe: "RPE 8.0",
          },
          {
            name: isBodyweight ? "Chin-Ups" : "Lat Pulldowns",
            setsReps: secondaryReps,
            rpe: "RPE 8.5",
          },
          {
            name: "Lateral Raises & Tricep Pushdowns",
            setsReps: accessoryReps,
            locked: true,
          },
        ],
      },
      {
        dayName: "FRI",
        focus: "Lower Body Hypertrophy",
        type: "workout",
        tag: "Lower B",
        exercises: [
          {
            name: isBodyweight ? "Jumping Lunges" : "Leg Press / Hack Squat",
            setsReps: primaryReps,
            rpe: "RPE 8.0",
          },
          {
            name: "Seated Leg Curls & Calf Work",
            setsReps: accessoryReps,
            locked: true,
          },
        ],
      },
      {
        dayName: "SAT",
        focus: "Active Recovery & Mobility",
        type: "recovery",
        tag: "Recovery",
      },
      {
        dayName: "SUN",
        focus: "Systemic Rest",
        type: "recovery",
        tag: "Rest",
      },
    ];
    return { splitName, schedule };
  }

  if (daysPerWeek === 5) {
    const splitName = "5-Day Upper / Lower / PPL Hybrid";
    const schedule: WorkoutDayPlan[] = [
      {
        dayName: "MON",
        focus: "Chest + Triceps",
        type: "workout",
        tag: "Push Day",
        exercises: [
          {
            name: isBodyweight
              ? "Diamond Push-Ups"
              : isHome
              ? "Flat Dumbbell Press"
              : "Barbell Bench Press",
            setsReps: primaryReps,
            rpe: "RPE 8.0",
          },
          {
            name: isBodyweight
              ? "Decline Push-Ups"
              : isHome
              ? "Incline Dumbbell Press"
              : "Incline Dumbbell Press",
            setsReps: secondaryReps,
            rpe: "RPE 8.5",
          },
          {
            name: isBodyweight
              ? "Bench Dips"
              : isHome
              ? "Dumbbell Floor Flyes"
              : "Cable Chest Flyes",
            setsReps: accessoryReps,
            rpe: "RPE 8.5",
          },
          {
            name: "Tricep Rope Pushdowns",
            setsReps: "3 × 12-15",
            locked: true,
          },
          {
            name: "Overhead Dumbbell Tricep Extension",
            setsReps: "3 × 12",
            locked: true,
          },
        ],
      },
      {
        dayName: "TUE",
        focus: "Back + Biceps",
        type: "workout",
        tag: "Pull Day",
        exercises: [
          {
            name: isBodyweight ? "Strict Pull-Ups" : "Barbell Deadlift / RDL",
            setsReps: primaryReps,
            rpe: "RPE 8.0",
          },
          {
            name: isBodyweight
              ? "Inverted Australian Rows"
              : isHome
              ? "One-Arm DB Row"
              : "Chest-Supported T-Bar Row",
            setsReps: secondaryReps,
            rpe: "RPE 8.0",
          },
          {
            name: "Incline Dumbbell Bicep Curls",
            setsReps: accessoryReps,
            locked: true,
          },
          {
            name: "Hammer Cable Curls",
            setsReps: accessoryReps,
            locked: true,
          },
        ],
      },
      {
        dayName: "WED",
        focus: "Active Recovery & Mobility",
        type: "recovery",
        tag: "Recovery",
      },
      {
        dayName: "THU",
        focus: "Shoulders + Arms",
        type: "workout",
        tag: "Upper Focus",
        exercises: [
          {
            name: isBodyweight
              ? "Pike Push-Ups"
              : isHome
              ? "Seated DB Overhead Press"
              : "Standing Overhead Barbell Press",
            setsReps: primaryReps,
            rpe: "RPE 8.0",
          },
          {
            name: "Dumbbell Lateral Raises (Drop Sets)",
            setsReps: "4 × 12-15",
            rpe: "RPE 9.0",
          },
          {
            name: "Rear Delt Face Pulls & Skullcrushers",
            setsReps: accessoryReps,
            locked: true,
          },
        ],
      },
      {
        dayName: "FRI",
        focus: "Legs & Posterior Chain",
        type: "workout",
        tag: "Leg Day",
        exercises: [
          {
            name: isBodyweight
              ? "Bulgarian Split Squats"
              : isHome
              ? "Dumbbell Romanian Deadlift"
              : "Barbell Back Squat",
            setsReps: primaryReps,
            rpe: "RPE 8.0",
          },
          {
            name: "Leg Press & Seated Hamstring Curls",
            setsReps: secondaryReps,
            locked: true,
          },
          {
            name: "Standing Calf Raises & Core",
            setsReps: accessoryReps,
            locked: true,
          },
        ],
      },
      {
        dayName: "SAT",
        focus: "Upper Body Hypertrophy / Weak Points",
        type: "workout",
        tag: "Upper B",
        exercises: [
          {
            name: isBodyweight
              ? "Incline Feet-Elevated Push-Ups"
              : isHome
              ? "Incline Dumbbell Press"
              : "Incline Barbell Bench Press",
            setsReps: primaryReps,
            rpe: "RPE 8.0",
          },
          {
            name: isBodyweight ? "Pull-Ups / Inverted Rows" : "Chest-Supported T-Bar Row",
            setsReps: secondaryReps,
            rpe: "RPE 8.5",
          },
          {
            name: "Dumbbell Lateral Raises & Cable Curls",
            setsReps: accessoryReps,
            locked: true,
          },
        ],
      },
      {
        dayName: "SUN",
        focus: "Systemic Rest",
        type: "recovery",
        tag: "Rest",
      },
    ];
    return { splitName, schedule };
  }

  // 6 Days
  const splitName = "6-Day Push / Pull / Legs (PPL)";
  const schedule: WorkoutDayPlan[] = [
    {
      dayName: "MON",
      focus: "Push A (Chest Bias)",
      type: "workout",
      tag: "Push A",
      exercises: [
        {
          name: isHome ? "Dumbbell Bench Press" : "Barbell Bench Press",
          setsReps: primaryReps,
          rpe: "RPE 8.0",
        },
        {
          name: "Incline Dumbbell Press",
          setsReps: secondaryReps,
          rpe: "RPE 8.5",
        },
        {
          name: "Lateral Raises & Tricep Extensions",
          setsReps: accessoryReps,
          locked: true,
        },
      ],
    },
    {
      dayName: "TUE",
      focus: "Pull A (Back Width)",
      type: "workout",
      tag: "Pull A",
      exercises: [
        {
          name: "Weighted Pull-Ups / Lat Pulldown",
          setsReps: primaryReps,
          rpe: "RPE 8.0",
        },
        {
          name: "Chest-Supported Row",
          setsReps: secondaryReps,
          rpe: "RPE 8.0",
        },
        {
          name: "Incline Bicep Curls",
          setsReps: accessoryReps,
          locked: true,
        },
      ],
    },
    {
      dayName: "WED",
      focus: "Legs A (Quad Bias)",
      type: "workout",
      tag: "Legs A",
      exercises: [
        {
          name: isHome ? "Goblet Squats" : "Barbell Back Squat",
          setsReps: primaryReps,
          rpe: "RPE 8.0",
        },
        {
          name: "Walking Lunges & Leg Extensions",
          setsReps: secondaryReps,
          locked: true,
        },
      ],
    },
    {
      dayName: "THU",
      focus: "Push B (Shoulder Bias)",
      type: "workout",
      tag: "Push B",
      exercises: [
        {
          name: "Overhead Barbell Press",
          setsReps: primaryReps,
          rpe: "RPE 8.0",
        },
        {
          name: "Dips & Cable Flyes",
          setsReps: secondaryReps,
          locked: true,
        },
      ],
    },
    {
      dayName: "FRI",
      focus: "Pull B (Back Thickness)",
      type: "workout",
      tag: "Pull B",
      exercises: [
        {
          name: "Barbell Deadlift / Heavy Row",
          setsReps: primaryReps,
          rpe: "RPE 8.0",
        },
        {
          name: "Preacher Curls & Face Pulls",
          setsReps: accessoryReps,
          locked: true,
        },
      ],
    },
    {
      dayName: "SAT",
      focus: "Legs B (Hamstring Bias)",
      type: "workout",
      tag: "Legs B",
      exercises: [
        {
          name: "Romanian Deadlift & Hip Thrusts",
          setsReps: primaryReps,
          locked: true,
        },
      ],
    },
    {
      dayName: "SUN",
      focus: "Systemic Rest",
      type: "recovery",
      tag: "Recovery",
    },
  ];
  return { splitName, schedule };
}
