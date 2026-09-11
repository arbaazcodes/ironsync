"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Bell, Timer as TimerIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface WorkoutTimerProps {
  defaultDuration?: number; // seconds
  onTimerComplete?: () => void;
  className?: string;
}

export function WorkoutTimer({
  defaultDuration = 90,
  onTimerComplete,
  className = "",
}: WorkoutTimerProps) {
  const [mode, setMode] = useState<"rest" | "stopwatch">("rest");
  const [duration, setDuration] = useState(defaultDuration);
  const [timeLeft, setTimeLeft] = useState(defaultDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const onTimerCompleteRef = useRef(onTimerComplete);
  onTimerCompleteRef.current = onTimerComplete;
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  // Synthesize beep via Web Audio API
  const playBeep = () => {
    if (!soundEnabledRef.current || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // High A
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  };

  useEffect(() => {
    let interval: any = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (mode === "rest") {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsRunning(false);
              playBeep();
              if (onTimerCompleteRef.current) onTimerCompleteRef.current();
              return 0;
            }
            return prev - 1;
          });
        } else {
          setStopwatchSeconds((prev) => prev + 1);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const handleReset = () => {
    setIsRunning(false);
    if (mode === "rest") {
      setTimeLeft(duration);
    } else {
      setStopwatchSeconds(0);
    }
  };

  const handleSelectPreset = (seconds: number) => {
    setDuration(seconds);
    setTimeLeft(seconds);
    setIsRunning(true);
  };

  // Ring Calculation
  const progress = mode === "rest" ? (timeLeft / duration) : 1;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className={`p-5 sm:p-6 rounded-[24px] bg-surface border border-border shadow-card flex flex-col items-center justify-between space-y-4 ${className}`}>
      {/* Header */}
      <div className="w-full flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <TimerIcon className="w-4 h-4 text-accent" />
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
            {mode === "rest" ? "Rest Interval" : "Set Stopwatch"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg text-primary-muted hover:text-primary transition-colors"
            title={soundEnabled ? "Mute beep" : "Enable sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-accent" /> : <VolumeX className="w-4 h-4 text-primary-dim" />}
          </button>

          <div className="flex rounded-lg bg-background p-0.5 border border-border">
            <button
              onClick={() => { setMode("rest"); setIsRunning(false); setTimeLeft(duration); }}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold transition-all ${
                mode === "rest" ? "bg-accent text-white shadow-sm" : "text-primary-muted hover:text-primary"
              }`}
            >
              REST
            </button>
            <button
              onClick={() => { setMode("stopwatch"); setIsRunning(false); setStopwatchSeconds(0); }}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-md font-semibold transition-all ${
                mode === "stopwatch" ? "bg-accent text-white shadow-sm" : "text-primary-muted hover:text-primary"
              }`}
            >
              SET
            </button>
          </div>
        </div>
      </div>

      {/* Circular Animated Timer */}
      <div className="relative flex items-center justify-center my-2">
        <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 128 128">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            className="stroke-black/10 dark:stroke-white/10"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Animated red progress ring */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            className="stroke-accent transition-all duration-1000 ease-linear"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: "drop-shadow(0 0 8px rgba(255, 30, 30, 0.6))",
            }}
          />
        </svg>

        {/* Center Digital Readout */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight text-primary font-mono tabular-nums">
            {mode === "rest" ? formatTime(timeLeft) : formatTime(stopwatchSeconds)}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-primary-dim mt-0.5">
            {isRunning ? (mode === "rest" ? "Counting down" : "Active Set") : "Paused"}
          </span>
        </div>
      </div>

      {/* Quick Interval Presets (Rest Mode) */}
      {mode === "rest" && (
        <div className="flex items-center gap-2 w-full justify-center">
          {[45, 60, 90, 120].map((sec) => (
            <button
              key={sec}
              onClick={() => handleSelectPreset(sec)}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg border transition-all ${
                duration === sec
                  ? "bg-accent/20 border-accent text-accent font-bold shadow-[0_0_12px_rgba(255,30,30,0.3)]"
                  : "bg-surface-elevated border-border text-primary-muted hover:text-primary"
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center gap-3 w-full pt-1">
        <Button
          onClick={() => setIsRunning(!isRunning)}
          variant="primary"
          size="md"
          className="flex-1 justify-center py-2.5"
          icon={isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        >
          {isRunning ? "Pause" : "Start"}
        </Button>

        <Button
          onClick={handleReset}
          variant="secondary"
          size="md"
          className="px-3"
          icon={<RotateCcw className="w-4 h-4" />}
          title="Reset Timer"
        />
      </div>
    </div>
  );
}
