"use client";

import React, { useState } from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => Promise<void>;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirmDelete,
}: DeleteAccountModalProps) {
  const [confirmationInput, setConfirmationInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const targetPhrase = "Delete my account";
  const isMatch = confirmationInput.trim() === targetPhrase;

  const handleDelete = async () => {
    if (!isMatch) return;
    try {
      setIsDeleting(true);
      setError(null);
      await onConfirmDelete();
    } catch (err: any) {
      setError(err?.message || "Failed to delete account. Please try again.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/85 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
        className="relative w-full max-w-md bg-surface-elevated border border-rose-500/40 rounded-2xl p-6 sm:p-7 shadow-2xl z-10 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-border/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 id="delete-account-title" className="text-base font-bold text-primary tracking-tight">
                Delete Account
              </h3>
              <p className="text-xs text-rose-400 font-mono mt-0.5">
                Irreversible Permanent Action
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

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Explanation */}
        <div className="p-4 rounded-xl bg-surface border border-border/80 mb-5 space-y-2 text-xs text-primary-muted leading-relaxed">
          <p className="font-semibold text-primary">
            Are you sure you want to permanently delete your IronSync account?
          </p>
          <p>
            This action immediately purges your profile, current and historical blueprints, personalized workouts, nutrition plans, and all check-in records.
          </p>
          <p className="text-rose-400 font-semibold">
            This action cannot be undone.
          </p>
        </div>

        {/* Confirmation Input Required by Spec */}
        <div className="space-y-2 mb-6">
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-dim">
            To confirm, type <span className="text-primary font-bold select-all">&ldquo;{targetPhrase}&rdquo;</span> below:
          </label>
          <input
            type="text"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder={targetPhrase}
            className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm font-mono text-primary placeholder:text-primary-dim/40 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
            autoFocus
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/70">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleDelete}
            disabled={!isMatch || isDeleting}
            className="bg-rose-600 hover:bg-rose-700 text-white border-rose-500 min-w-[170px]"
          >
            {isDeleting ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting Account...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Trash2 className="w-4 h-4" />
                Delete My Account
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
