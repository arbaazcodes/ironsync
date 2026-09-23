"use client";

import React, { useEffect, useRef, useState } from "react";
import { WorkoutExercise } from "@/lib/types/onboarding";
import { getExerciseDetails } from "@/lib/data/exerciseDetails";
import { getExerciseMedia } from "@/lib/data/exerciseMedia";
import { MUSCLE_ANATOMY_DATA } from "@/lib/data/muscleAnatomy";
import { Button } from "@/components/ui/Button";
import { WorkoutTimer } from "./WorkoutTimer";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Clock,
  Dumbbell,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Wind,
  ShieldCheck,
  Flame,
  Activity,
  Timer,
} from "lucide-react";

interface ExerciseDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: WorkoutExercise | null;
  onSwapClick?: (exercise: WorkoutExercise) => void;
}

function parseVideoSource(url?: string | null): {
  type: "youtube" | "vimeo" | "html5" | "none";
  embedUrl?: string;
  directUrl?: string;
} {
  if (!url) return { type: "none" };
  const trimmed = url.trim();
  if (!trimmed) return { type: "none" };

  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1&playsinline=1`,
    };
  }

  const vimeoMatch = trimmed.match(
    /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/i
  );
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`,
    };
  }

  return {
    type: "html5",
    directUrl: trimmed,
  };
}

export function ExerciseDetailDrawer({
  isOpen,
  onClose,
  exercise,
  onSwapClick,
}: ExerciseDetailDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showTimer, setShowTimer] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Close on ESC & manage body lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        drawerRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset video state when exercise changes
  useEffect(() => {
    setIsPlaying(false);
    setIsMuted(true);
    setShowTimer(false);
    setVideoError(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [exercise]);

  if (!isOpen || !exercise) return null;

  const details = getExerciseDetails(exercise.name);
  const media = getExerciseMedia(exercise.name);
  const activeVideoUrl = details.videoUrl || media.videoUrl;
  const videoSource = parseVideoSource(activeVideoUrl);
  const anatomy = MUSCLE_ANATOMY_DATA[media.muscleGroup] || MUSCLE_ANATOMY_DATA["Chest"];

  // Parse sets & reps from setsReps (e.g. "4 × 8-10")
  const parts = (exercise.setsReps || "3 × 10").split("×").map((s) => s.trim());
  const sets = parts[0] || "3-4";
  const reps = parts[1] || "8-12";
  const rest = exercise.rest || details.defaultRest || "90 sec";
  const rpe = exercise.rpe || "RPE 8.0";

  // Video Controls
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel: Slide-up on mobile, slide-over on desktop */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exercise-detail-title"
        className="relative w-full sm:max-w-xl h-[94vh] sm:h-full mt-auto sm:mt-0 bg-card border-t sm:border-t-0 sm:border-l border-border rounded-t-3xl sm:rounded-none shadow-2xl overflow-hidden flex flex-col z-10 animate-in slide-in-from-bottom-6 sm:slide-in-from-right-6 duration-300 focus:outline-none"
      >
        {/* Mobile Pull Bar */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center bg-card">
          <div className="w-12 h-1.5 rounded-full bg-primary-dim/30" />
        </div>

        {/* Hero Visual Header */}
        <div className="relative h-48 sm:h-56 w-full shrink-0 overflow-hidden bg-black border-b border-border">
          <img
            src={media.imageUrl}
            alt={exercise.name}
            className="w-full h-full object-cover brightness-75"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop";
            }}
          />
          {/* High contrast gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 hover:text-white border border-white/10 transition-colors focus:ring-2 focus:ring-accent"
            aria-label="Close details"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Hero Badges and Title */}
          <div className="absolute bottom-4 left-5 right-5 space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-accent text-white font-mono text-[10px] font-bold tracking-wider uppercase shadow-[0_0_10px_rgba(255,30,30,0.5)]">
                {media.muscleGroup}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/10 font-mono text-[10px] text-white/80 uppercase">
                {media.difficulty}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/10 font-mono text-[10px] text-white/80">
                {media.equipment}
              </span>
            </div>

            <h2
              id="exercise-detail-title"
              className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight"
            >
              {exercise.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Target Parameters Metric Grid */}
          <div className="grid grid-cols-4 gap-2 font-mono text-center">
            <div className="p-3 rounded-2xl bg-surface-elevated border border-border">
              <span className="text-[10px] text-primary-dim uppercase block">Sets</span>
              <span className="text-sm sm:text-base font-extrabold text-primary mt-0.5 block">
                {sets}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-elevated border border-border">
              <span className="text-[10px] text-primary-dim uppercase block">Reps</span>
              <span className="text-sm sm:text-base font-extrabold text-primary mt-0.5 block">
                {reps}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-elevated border border-border">
              <span className="text-[10px] text-primary-dim uppercase block">Rest</span>
              <span className="text-sm sm:text-base font-extrabold text-accent mt-0.5 block">
                {rest}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-surface-elevated border border-border">
              <span className="text-[10px] text-primary-dim uppercase block">Intensity</span>
              <span className="text-sm sm:text-base font-extrabold text-primary mt-0.5 block">
                {rpe}
              </span>
            </div>
          </div>

          {/* Biomechanical Tempo & Calorie Burn Cues */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
            <div className="p-3 rounded-xl bg-surface-elevated border border-border flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-accent shrink-0" />
              <div>
                <span className="text-[10px] text-primary-dim uppercase block">Tempo</span>
                <span className="text-primary font-bold">{media.tempo}</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-surface-elevated border border-border flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-accent shrink-0" />
              <div>
                <span className="text-[10px] text-primary-dim uppercase block">Tension</span>
                <span className="text-primary font-bold">{media.timeUnderTension}</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-surface-elevated border border-border flex items-center gap-2.5 col-span-2 sm:col-span-1">
              <Flame className="w-4 h-4 text-accent shrink-0" />
              <div>
                <span className="text-[10px] text-primary-dim uppercase block">Energy Burn</span>
                <span className="text-primary font-bold">~{media.caloriesBurnEstimate} kcal</span>
              </div>
            </div>
          </div>

          {/* Rest Timer Quick Launcher Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Timer className="w-4 h-4 text-accent" />
                Inter-Set Rest Timer
              </span>
              <button
                onClick={() => setShowTimer(!showTimer)}
                className="text-xs font-mono text-accent hover:text-accent-hover font-bold transition-colors"
              >
                {showTimer ? "Hide Timer" : "Launch Timer"}
              </button>
            </div>

            {showTimer && (
              <div className="animate-in slide-in-from-top-2 duration-200">
                <WorkoutTimer defaultDuration={90} />
              </div>
            )}
          </div>

          {/* ANATOMICAL MUSCLE ENGAGEMENT MAP */}
          <div className="p-4 sm:p-5 rounded-[20px] bg-surface-elevated border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-accent" />
                Anatomical Engagement
              </span>
              <span className="text-[11px] font-mono text-accent font-bold">{anatomy.latinName}</span>
            </div>

            <p className="text-xs text-primary-muted leading-relaxed">
              {anatomy.functionDescription}
            </p>

            {/* Target muscle pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {media.targetMuscles.map((muscle, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-accent/40 text-[11px] font-mono font-semibold text-primary shadow-sm"
                >
                  {muscle}
                </span>
              ))}
              {anatomy.focusMuscles.map((muscle, idx) => (
                <span
                  key={`focus-${idx}`}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-border text-[11px] font-mono text-primary-muted"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* DEMONSTRATION VIDEO OR COMING SOON PLACEHOLDER */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-[11px] text-primary-dim">
              <span className="flex items-center gap-1.5 font-bold text-primary">
                <Play className="w-3.5 h-3.5 text-accent" />
                BIOMECHANICAL DEMO LOOP
              </span>
              <span>{activeVideoUrl ? "Muted by Default" : "HD Movement Guide"}</span>
            </div>

            {videoSource.type === "youtube" || videoSource.type === "vimeo" ? (
              <div className="relative rounded-2xl overflow-hidden bg-black border border-border shadow-lg aspect-video w-full max-w-full">
                <iframe
                  src={videoSource.embedUrl}
                  title={`Exercise demonstration video for ${exercise.name}`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : videoSource.type === "html5" && !videoError ? (
              <div className="relative rounded-2xl overflow-hidden bg-black border border-border shadow-lg aspect-video w-full max-w-full flex items-center justify-center group">
                <video
                  ref={videoRef}
                  src={videoSource.directUrl}
                  playsInline
                  muted={isMuted}
                  preload="metadata"
                  onEnded={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={() => setVideoError(true)}
                  className="w-full h-full object-cover"
                  aria-label={`Exercise demonstration video for ${exercise.name}`}
                />

                {/* Video Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-between p-3 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex justify-end">
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-white/80 border border-white/10">
                      Form Demo
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={togglePlay}
                        className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors focus:ring-2 focus:ring-accent"
                        aria-label={isPlaying ? "Pause video" : "Play video"}
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 fill-white" />
                        )}
                      </button>

                      <button
                        onClick={toggleMute}
                        className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors focus:ring-2 focus:ring-accent"
                        aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={handleFullscreen}
                      className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors focus:ring-2 focus:ring-accent"
                      aria-label="View video fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-black border border-border shadow-lg aspect-video w-full max-w-full flex items-center justify-center group">
                <img
                  src={media.imageUrl}
                  alt={exercise.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop";
                  }}
                  className="w-full h-full object-cover brightness-[0.4] group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <div className="relative z-10 flex flex-col items-center text-center p-4 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-accent backdrop-blur-sm">
                    <Play className="w-5 h-5 fill-accent/20" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FF1E1E]/20 border border-[#FF1E1E]/40 text-[10px] font-mono font-bold uppercase text-[#FF1E1E]">
                      Form video coming soon
                    </span>
                    <p className="text-[11px] text-white/60 font-mono mt-1">
                      Biomechanical cues and form execution steps are detailed below.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4-STAGE HOW TO PERFORM BREAKDOWN */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-accent" />
              Kinetic Execution Sequence
            </h3>

            <div className="space-y-2.5">
              {/* Stage 1: Setup */}
              <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-surface border border-accent/40 font-mono text-[10px] font-bold text-accent flex items-center justify-center">
                    1
                  </span>
                  <h4 className="font-bold text-primary font-mono text-[11px] uppercase tracking-wider">
                    Setup & Initial Alignment
                  </h4>
                </div>
                <p className="text-primary-muted leading-relaxed pl-7">
                  {details.executionSteps?.setup || "Establish a stable base of support with neutral spinal alignment and engaged core stabilizers."}
                </p>
              </div>

              {/* Stage 2: Movement */}
              <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-surface border border-accent/40 font-mono text-[10px] font-bold text-accent flex items-center justify-center">
                    2
                  </span>
                  <h4 className="font-bold text-primary font-mono text-[11px] uppercase tracking-wider">
                    Movement & Active Drive
                  </h4>
                </div>
                <p className="text-primary-muted leading-relaxed pl-7">
                  {details.executionSteps?.movement || details.executionCue}
                </p>
              </div>

              {/* Stage 3: Return */}
              <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-surface border border-accent/40 font-mono text-[10px] font-bold text-accent flex items-center justify-center">
                    3
                  </span>
                  <h4 className="font-bold text-primary font-mono text-[11px] uppercase tracking-wider">
                    Return Phase & Deceleration
                  </h4>
                </div>
                <p className="text-primary-muted leading-relaxed pl-7">
                  {details.executionSteps?.returnPhase || "Control the eccentric phase over 2–3 seconds under muscular tension without allowing weights to drop."}
                </p>
              </div>

              {/* Stage 4: Breathing */}
              <div className="p-3.5 rounded-2xl bg-surface-elevated border border-border space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-surface border border-accent/40 font-mono text-[10px] font-bold text-accent flex items-center justify-center">
                    4
                  </span>
                  <h4 className="font-bold text-primary font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-accent" />
                    Breathing Mechanics
                  </h4>
                </div>
                <p className="text-primary-muted leading-relaxed pl-7">
                  {details.executionSteps?.breathing || "Inhale into abdomen on lowering/eccentric phase; exhale forcefully as you drive through the concentric contraction."}
                </p>
              </div>
            </div>
          </div>

          {/* FORM CUES */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              Biomechanical Form Cues
            </h3>

            <div className="p-4 rounded-2xl bg-accent/[0.05] border border-accent/25 space-y-2">
              {(details.formCues || [
                "Maintain active tension on target muscle throughout",
                "Control 2-second lowering phase",
                "Avoid bouncing or jerking using momentum",
              ]).map((cue, cIdx) => (
                <div key={cIdx} className="flex items-start gap-2.5 text-xs text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5 shadow-[0_0_6px_rgba(255,30,30,0.8)]" />
                  <span className="leading-relaxed">{cue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* COMMON MISTAKES TO AVOID */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              Common Mistakes to Avoid
            </h3>

            <div className="p-4 rounded-2xl bg-amber-500/[0.05] border border-amber-500/20 space-y-2">
              {(details.commonMistakes || [
                details.commonMistake || "Using excessive momentum to cheat the repetition",
                "Cutting range of motion short at the top or bottom",
              ]).map((mistake, mIdx) => (
                <div key={mIdx} className="flex items-start gap-2.5 text-xs text-primary-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{mistake}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Bottom Action Bar */}
        <div className="p-4 sm:p-5 border-t border-border bg-card flex items-center justify-between gap-3 shrink-0">
          {onSwapClick ? (
            <Button
              onClick={() => {
                onClose();
                onSwapClick(exercise);
              }}
              variant="secondary"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5 text-accent" />}
              className="font-mono text-xs"
            >
              Swap Exercise
            </Button>
          ) : (
            <span className="text-xs font-mono text-primary-dim flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              Biomechanically Certified
            </span>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={onClose}
            className="font-mono text-xs px-5 shadow-accent-glow"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
