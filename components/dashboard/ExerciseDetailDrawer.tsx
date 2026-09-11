"use client";

import React, { useEffect, useRef, useState } from "react";
import { WorkoutExercise } from "@/lib/types/onboarding";
import { getExerciseDetails } from "@/lib/data/exerciseDetails";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
  ChevronRight,
} from "lucide-react";

interface ExerciseDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: WorkoutExercise | null;
  onSwapClick?: (exercise: WorkoutExercise) => void;
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

  // Close on ESC & manage focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      // Auto-focus drawer for accessibility
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
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [exercise]);

  if (!isOpen || !exercise) return null;

  const details = getExerciseDetails(exercise.name);

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
        className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300"
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
        className="relative w-full sm:max-w-xl h-[94vh] sm:h-full mt-auto sm:mt-0 bg-surface-elevated border-t sm:border-t-0 sm:border-l border-border rounded-t-3xl sm:rounded-none shadow-2xl overflow-hidden flex flex-col z-10 animate-in slide-in-from-bottom-6 sm:slide-in-from-right-6 duration-300 focus:outline-none focus:ring-1 focus:ring-accent/50"
      >
        {/* Mobile Pull Bar */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-border flex items-center justify-between bg-surface/80 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="accent" size="sm" className="font-mono text-[10px]">
                {details.difficulty || "INTERMEDIATE"}
              </Badge>
              <span className="text-xs font-mono text-primary-dim">
                {details.equipment || "Standard Equipment"}
              </span>
            </div>
            <h2
              id="exercise-detail-title"
              className="text-lg sm:text-xl font-extrabold text-primary tracking-tight"
            >
              {exercise.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-primary-dim hover:text-primary hover:bg-surface border border-border/60 transition-colors focus:ring-2 focus:ring-accent"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Prescribed Target Parameters */}
          <div className="grid grid-cols-4 gap-2.5 font-mono text-center">
            <div className="p-3 rounded-xl bg-surface border border-border/80">
              <span className="text-[10px] text-primary-dim uppercase block">Sets</span>
              <span className="text-sm sm:text-base font-bold text-primary mt-0.5 block">
                {sets}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-border/80">
              <span className="text-[10px] text-primary-dim uppercase block">Reps</span>
              <span className="text-sm sm:text-base font-bold text-primary mt-0.5 block">
                {reps}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-border/80">
              <span className="text-[10px] text-primary-dim uppercase block">Rest</span>
              <span className="text-sm sm:text-base font-bold text-accent mt-0.5 block">
                {rest}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-surface border border-border/80">
              <span className="text-[10px] text-primary-dim uppercase block">Intensity</span>
              <span className="text-sm sm:text-base font-bold text-primary mt-0.5 block">
                {rpe}
              </span>
            </div>
          </div>

          {/* Primary Muscles Tag Pill Row */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-primary-dim tracking-wider block">
              Primary Anatomical Engagement
            </span>
            <div className="flex flex-wrap gap-1.5">
              {details.primaryMuscles.map((muscle, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-border text-[11px] font-medium text-primary"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* OPTIONAL COMPACT VIDEO PLAYER (Only rendered when valid videoUrl exists) */}
          {details.videoUrl && (
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px] text-primary-dim">
                <span className="flex items-center gap-1.5 font-bold text-primary">
                  <Play className="w-3.5 h-3.5 text-accent" />
                  DEMONSTRATION VIDEO
                </span>
                <span>Muted by Default</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-black border border-border/80 shadow-lg aspect-video flex items-center justify-center group">
                <video
                  ref={videoRef}
                  src={details.videoUrl}
                  playsInline
                  muted={isMuted}
                  preload="metadata"
                  onEnded={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-cover"
                  aria-label={`Exercise demonstration video for ${exercise.name}`}
                />

                {/* Video Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-between p-3 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex justify-end">
                    <span className="px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono text-gray-300">
                      Form Demo
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={togglePlay}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors focus:ring-2 focus:ring-accent"
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
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors focus:ring-2 focus:ring-accent"
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
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors focus:ring-2 focus:ring-accent"
                      aria-label="View video fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4-STAGE HOW TO PERFORM BREAKDOWN */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-accent" />
              How to Perform
            </h3>

            <div className="space-y-2.5">
              {/* Stage 1: Setup */}
              <div className="p-3.5 rounded-xl bg-surface border border-border/80 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-surface-elevated border border-border font-mono text-[10px] font-bold text-accent flex items-center justify-center">
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
              <div className="p-3.5 rounded-xl bg-surface border border-border/80 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-surface-elevated border border-border font-mono text-[10px] font-bold text-accent flex items-center justify-center">
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
              <div className="p-3.5 rounded-xl bg-surface border border-border/80 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-surface-elevated border border-border font-mono text-[10px] font-bold text-accent flex items-center justify-center">
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
              <div className="p-3.5 rounded-xl bg-surface border border-border/80 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-surface-elevated border border-border font-mono text-[10px] font-bold text-accent flex items-center justify-center">
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

          {/* FORM CUES (2-4 CONCISE BULLETS) */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              Concise Form Cues
            </h3>

            <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 space-y-2">
              {(details.formCues || [
                "Maintain active tension on target muscle throughout",
                "Control 2-second lowering phase",
                "Avoid bouncing or jerking using momentum",
              ]).map((cue, cIdx) => (
                <div key={cIdx} className="flex items-start gap-2.5 text-xs text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{cue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* COMMON MISTAKES TO AVOID */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Common Mistakes to Avoid
            </h3>

            <div className="p-4 rounded-xl bg-amber-500/[0.04] border border-amber-500/20 space-y-2">
              {(details.commonMistakes || [
                details.commonMistake || "Using excessive momentum to cheat the repetition",
                "Cutting range of motion short at the top or bottom",
              ]).map((mistake, mIdx) => (
                <div key={mIdx} className="flex items-start gap-2.5 text-xs text-primary-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{mistake}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Bottom Action Bar */}
        <div className="p-4 sm:p-5 border-t border-border bg-surface/80 flex items-center justify-between gap-3 shrink-0">
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
              Swap This Exercise
            </Button>
          ) : (
            <span className="text-xs font-mono text-primary-dim flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              Biomechanical Safety Verified
            </span>
          )}

          <Button variant="primary" size="sm" onClick={onClose} className="font-mono text-xs">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
