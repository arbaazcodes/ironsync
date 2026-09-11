export interface MuscleAnatomyHighlight {
  group: string;
  latinName: string;
  functionDescription: string;
  focusMuscles: string[];
  svgPath: string; // Vector silhouette coordinate path
}

export const MUSCLE_ANATOMY_DATA: Record<string, MuscleAnatomyHighlight> = {
  Chest: {
    group: "Chest",
    latinName: "Pectoralis Major & Minor",
    functionDescription: "Horizontal adduction and internal rotation of the humerus. Powers pushing strength.",
    focusMuscles: ["Clavicular Head (Upper Chest)", "Sternocostal Head (Mid Chest)", "Abdominal Head (Lower Chest)"],
    svgPath: "M150 120 C 130 140, 110 160, 100 200 C 120 220, 160 230, 200 230 C 240 230, 280 220, 300 200 C 290 160, 270 140, 250 120 Z",
  },
  Back: {
    group: "Back",
    latinName: "Latissimus Dorsi & Rhomboids",
    functionDescription: "Adduction, extension, and transverse extension of the arm. Retracts shoulder blades.",
    focusMuscles: ["Latissimus Dorsi", "Trapezius (Mid/Lower)", "Rhomboids Major/Minor", "Erector Spinae"],
    svgPath: "M120 110 C 140 100, 260 100, 280 110 C 260 180, 240 240, 200 260 C 160 240, 140 180, 120 110 Z",
  },
  Shoulders: {
    group: "Shoulders",
    latinName: "Deltoid Triad",
    functionDescription: "Arm abduction, flexion, and transverse abduction. Establishes upper body V-taper.",
    focusMuscles: ["Anterior Deltoid (Front)", "Lateral Deltoid (Side)", "Posterior Deltoid (Rear)"],
    svgPath: "M80 110 C 70 140, 75 180, 95 200 C 110 170, 110 130, 100 110 Z M320 110 C 330 140, 325 180, 305 200 C 290 170, 290 130, 300 110 Z",
  },
  Legs: {
    group: "Legs",
    latinName: "Quadriceps, Hamstrings & Calves",
    functionDescription: "Knee extension and hip flexion/extension. The metabolic power center of human locomotion.",
    focusMuscles: ["Rectus Femoris & Vastus Lateralis (Quads)", "Biceps Femoris (Hamstrings)", "Gastrocnemius (Calves)"],
    svgPath: "M130 250 C 120 340, 110 420, 130 500 C 150 420, 160 340, 155 250 Z M270 250 C 280 340, 290 420, 270 500 C 250 420, 240 340, 245 250 Z",
  },
  Arms: {
    group: "Arms",
    latinName: "Biceps Brachii & Triceps Brachii",
    functionDescription: "Elbow flexion, supination, and elbow extension. Provides grip and pressing lockdown.",
    focusMuscles: ["Biceps (Long & Short Head)", "Triceps (Lateral, Long & Medial Head)", "Brachialis"],
    svgPath: "M70 170 C 60 210, 55 260, 65 310 C 80 270, 85 220, 80 170 Z M330 170 C 340 210, 345 260, 335 310 C 320 270, 315 220, 320 170 Z",
  },
  Core: {
    group: "Core",
    latinName: "Rectus Abdominis & Obliques",
    functionDescription: "Spinal flexion and rotational anti-flexion. Transfers kinetic force between lower and upper body.",
    focusMuscles: ["Rectus Abdominis (Six-Pack)", "Transverse Abdominis", "Internal & External Obliques"],
    svgPath: "M160 210 C 150 260, 150 310, 160 350 C 180 355, 220 355, 240 350 C 250 310, 250 260, 240 210 Z",
  },
  Glutes: {
    group: "Glutes",
    latinName: "Gluteus Maximus, Medius & Minimus",
    functionDescription: "Hip extension, external rotation, and pelvic stabilization.",
    focusMuscles: ["Gluteus Maximus", "Gluteus Medius", "Piriformis"],
    svgPath: "M140 230 C 120 270, 125 320, 155 340 C 180 340, 195 280, 190 230 Z M260 230 C 280 270, 275 320, 245 340 C 220 340, 205 280, 210 230 Z",
  },
};
