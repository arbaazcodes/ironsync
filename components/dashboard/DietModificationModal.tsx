"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Send, Loader2, AlertCircle, Utensils, CheckCircle2 } from "lucide-react";

interface DietModificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newRequest: any) => void;
  memberId?: string;
}

export function DietModificationModal({
  isOpen,
  onClose,
  onSuccess,
  memberId,
}: DietModificationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on ESC & manage body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setNotes("");
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = notes.trim();
    if (!trimmed) {
      setError("Please describe the dietary changes or feedback you need.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/member/change-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestedFields: {
            notes: `Dietary Revision Request: ${trimmed}`,
          },
          memberNote: trimmed,
        }),
      });

      const resData = await res.json();

      if (!res.ok || !resData.success) {
        throw new Error(resData.error || "Failed to submit diet revision request.");
      }

      onSuccess(resData.request);
      onClose();
    } catch (err: any) {
      console.error("Diet revision submit error:", err);
      setError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="diet-modal-title"
        className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl p-6 sm:p-7 z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-surface-elevated hover:bg-surface text-primary-muted hover:text-primary border border-border transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-bold">
            <Utensils className="w-3.5 h-3.5" />
            Dietary Adjustment
          </div>
          <h2 id="diet-modal-title" className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-primary">
            Request Changes to Diet
          </h2>
          <p className="text-xs text-primary-muted">
            Submit your dietary preferences, allergies, food swaps, or schedule changes. Your gym coach will review and update your plan.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="diet-changes-textarea"
              className="text-xs font-mono font-bold uppercase tracking-wider text-primary block"
            >
              What changes do you need?
            </label>
            <textarea
              id="diet-changes-textarea"
              ref={textareaRef}
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Please swap eggs for paneer/tofu in breakfast; reduce dairy intake; allergy update for peanuts; shift afternoon snack earlier."
              className="w-full p-4 rounded-2xl bg-surface-elevated border border-border text-primary text-xs leading-relaxed placeholder:text-primary-dim focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none"
              disabled={loading}
              maxLength={600}
            />
            <div className="flex items-center justify-between text-[11px] font-mono text-primary-dim">
              <span>Be specific about foods to swap or add</span>
              <span>{notes.length}/600</span>
            </div>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="py-2.5 px-4 rounded-xl bg-surface-elevated hover:bg-surface border border-border text-xs font-mono uppercase text-primary-muted hover:text-primary transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !notes.trim()}
              className="py-2.5 px-6 rounded-xl bg-accent hover:bg-accent-hover text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-accent-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
