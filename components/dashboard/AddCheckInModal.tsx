"use client";

import React, { useState, useEffect } from "react";
import { X, Scale, Calendar, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AddCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { weightKg: number; notes?: string; createdAt?: string }) => Promise<void>;
  latestWeightKg?: number | null;
}

export function AddCheckInModal({
  isOpen,
  onClose,
  onSave,
  latestWeightKg,
}: AddCheckInModalProps) {
  const [weight, setWeight] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize date to today's local YYYY-MM-DD
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
      if (latestWeightKg) {
        setWeight(latestWeightKg.toString());
      } else {
        setWeight("");
      }
      setNotes("");
      setError(null);
    }
  }, [isOpen, latestWeightKg]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedWeight) || parsedWeight <= 20 || parsedWeight >= 350) {
      setError("Please enter a valid weight between 20 kg and 350 kg.");
      return;
    }

    try {
      setIsSubmitting(true);
      // Combine selected date with current time for clean chronological ordering
      const now = new Date();
      const [year, month, day] = date.split("-").map(Number);
      const submissionDate = new Date(year, month - 1, day, now.getHours(), now.getMinutes(), now.getSeconds());

      await onSave({
        weightKg: parsedWeight,
        notes: notes.trim() || undefined,
        createdAt: submissionDate.toISOString(),
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to save check-in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-check-in-title"
        className="relative w-full max-w-md bg-surface-elevated border border-border/90 rounded-2xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
              <Scale className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h3 id="add-check-in-title" className="text-sm font-bold text-primary tracking-tight font-sans">
                Log Weight Check-in
              </h3>
              <p className="text-[11px] text-primary-dim font-mono">
                Consistent weigh-ins calibrate your plan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-primary-dim hover:text-primary p-1.5 rounded-lg hover:bg-surface transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Weight input */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-1.5">
              Current Weight (kg) <span className="text-accent">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="20"
                max="350"
                required
                autoFocus
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 78.5"
                className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm font-bold text-primary placeholder:text-primary-dim focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors font-mono"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-primary-dim pointer-events-none">
                KG
              </span>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-1.5">
              Check-in Date
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors font-mono"
              />
            </div>
          </div>

          {/* Notes input */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-1.5">
              Notes <span className="text-primary-dim font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              maxLength={500}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Morning fasted, post-workout, well-hydrated..."
              className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-xs text-primary placeholder:text-primary-dim focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting || !weight}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Save Check-in
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
