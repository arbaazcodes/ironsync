"use client";

import React, { useState } from "react";
import {
  X,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FileEdit,
  Info,
} from "lucide-react";
import { GymMember } from "@/lib/types/member";
import { AllowedChangeFieldKey, CHANGE_FIELD_METADATA } from "@/lib/types/changeRequest";

interface ChangeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Omit<GymMember, "pinHash">;
  onSuccess: () => void;
}

export function ChangeRequestModal({
  isOpen,
  onClose,
  member,
  onSuccess,
}: ChangeRequestModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states initialized with current values
  const [formData, setFormData] = useState({
    full_name: member.fullName || "",
    phone: member.phone || "",
    email: member.email || "",
    date_of_birth: member.dateOfBirth || "",
    gender: member.gender || "male",
    height_cm: member.heightCm || member.height || "",
    weight_kg: member.weightKg || member.weight || "",
    goal: member.fitnessGoal || "muscle_gain",
    diet_type: member.dietType || "non_vegetarian",
    experience: member.experience || "intermediate",
    days_per_week: member.daysPerWeek || 4,
    emergency_contact: member.emergencyContact || "",
    notes: member.notes || "",
    member_note: "",
  });

  // Track which fields the user specifically wishes to modify
  const [selectedFields, setSelectedFields] = useState<Record<AllowedChangeFieldKey, boolean>>({
    full_name: false,
    phone: false,
    email: false,
    date_of_birth: false,
    gender: false,
    height_cm: false,
    weight_kg: false,
    goal: false,
    diet_type: false,
    experience: false,
    days_per_week: false,
    emergency_contact: false,
    notes: false,
  });

  if (!isOpen) return null;

  const toggleField = (key: AllowedChangeFieldKey) => {
    setSelectedFields((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Collect checked fields
    const requestedFields: Partial<Record<AllowedChangeFieldKey, any>> = {};
    let count = 0;

    for (const key of Object.keys(selectedFields) as AllowedChangeFieldKey[]) {
      if (selectedFields[key]) {
        const val = formData[key as keyof typeof formData];
        if (val !== undefined && val !== null && String(val).trim() !== "") {
          if (key === "height_cm" || key === "weight_kg" || key === "days_per_week") {
            const num = Number(val);
            if (!isNaN(num) && num > 0) {
              requestedFields[key] = num;
              count++;
            }
          } else {
            requestedFields[key] = String(val).trim();
            count++;
          }
        }
      }
    }

    if (count === 0) {
      setError("Please check and provide at least one profile attribute you wish to change.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/member/change-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestedFields,
          memberNote: formData.member_note?.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit change request.");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase font-bold tracking-wider">
              <FileEdit className="w-3.5 h-3.5" />
              Member Self-Service
            </div>
            <h2 className="text-xl font-extrabold uppercase text-primary">
              Request Profile Update
            </h2>
            <p className="text-xs text-primary-muted">
              Select the fields you want to change. All updates remain pending until verified and approved by gym management.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-primary-muted hover:text-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Informational Guidance */}
        <div className="p-3.5 rounded-xl bg-surface-elevated border border-border text-xs text-primary-muted flex items-start gap-2.5">
          <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Check the box next to any attribute you want updated. Member ID, PIN, status, and membership expiration cannot be self-edited and require in-person desk verification.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Field Selection & Edit Grid */}
          <div className="space-y-3.5">
            {/* 1. Body Metrics: Weight & Height */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Weight */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  selectedFields.weight_kg
                    ? "bg-surface-elevated border-accent/60 shadow-sm"
                    : "bg-surface border-border opacity-85"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-primary">
                    <input
                      type="checkbox"
                      checked={selectedFields.weight_kg}
                      onChange={() => toggleField("weight_kg")}
                      className="rounded border-border text-accent focus:ring-accent accent-accent"
                    />
                    <span>Weight (kg)</span>
                  </label>
                  <span className="text-[10px] font-mono text-primary-dim">
                    Current: {member.weightKg || member.weight || "—"} kg
                  </span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  disabled={!selectedFields.weight_kg}
                  value={formData.weight_kg}
                  onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                  placeholder="e.g. 78.5"
                  className="w-full p-2 bg-background border border-border rounded-lg text-primary font-mono text-xs disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-accent"
                />
              </div>

              {/* Height */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  selectedFields.height_cm
                    ? "bg-surface-elevated border-accent/60 shadow-sm"
                    : "bg-surface border-border opacity-85"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-primary">
                    <input
                      type="checkbox"
                      checked={selectedFields.height_cm}
                      onChange={() => toggleField("height_cm")}
                      className="rounded border-border text-accent focus:ring-accent accent-accent"
                    />
                    <span>Height (cm)</span>
                  </label>
                  <span className="text-[10px] font-mono text-primary-dim">
                    Current: {member.heightCm || member.height || "—"} cm
                  </span>
                </div>
                <input
                  type="number"
                  step="0.5"
                  min="100"
                  max="250"
                  disabled={!selectedFields.height_cm}
                  value={formData.height_cm}
                  onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
                  placeholder="e.g. 178"
                  className="w-full p-2 bg-background border border-border rounded-lg text-primary font-mono text-xs disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* 2. Fitness & Diet Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Primary Goal */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  selectedFields.goal
                    ? "bg-surface-elevated border-accent/60 shadow-sm"
                    : "bg-surface border-border opacity-85"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-primary">
                    <input
                      type="checkbox"
                      checked={selectedFields.goal}
                      onChange={() => toggleField("goal")}
                      className="rounded border-border text-accent focus:ring-accent accent-accent"
                    />
                    <span>Primary Goal</span>
                  </label>
                  <span className="text-[10px] font-mono text-primary-dim uppercase">
                    Current: {member.fitnessGoal || "—"}
                  </span>
                </div>
                <select
                  disabled={!selectedFields.goal}
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  className="w-full p-2 bg-background border border-border rounded-lg text-primary text-xs disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-accent"
                >
                  <option value="muscle_gain">Muscle Gain / Hypertrophy</option>
                  <option value="fat_loss">Fat Loss / Shred</option>
                  <option value="strength">Strength & Power</option>
                  <option value="endurance">Athletic Conditioning</option>
                  <option value="general_fitness">General Health & Mobility</option>
                </select>
              </div>

              {/* Diet Type */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  selectedFields.diet_type
                    ? "bg-surface-elevated border-accent/60 shadow-sm"
                    : "bg-surface border-border opacity-85"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-primary">
                    <input
                      type="checkbox"
                      checked={selectedFields.diet_type}
                      onChange={() => toggleField("diet_type")}
                      className="rounded border-border text-accent focus:ring-accent accent-accent"
                    />
                    <span>Diet Preference</span>
                  </label>
                  <span className="text-[10px] font-mono text-primary-dim uppercase">
                    Current: {member.dietType || "—"}
                  </span>
                </div>
                <select
                  disabled={!selectedFields.diet_type}
                  value={formData.diet_type}
                  onChange={(e) => setFormData({ ...formData, diet_type: e.target.value })}
                  className="w-full p-2 bg-background border border-border rounded-lg text-primary text-xs disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-accent"
                >
                  <option value="non_vegetarian">Non-Vegetarian</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="eggetarian">Eggetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="keto">Ketogenic</option>
                </select>
              </div>
            </div>

            {/* 3. Training Frequency & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Training Days */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  selectedFields.days_per_week
                    ? "bg-surface-elevated border-accent/60 shadow-sm"
                    : "bg-surface border-border opacity-85"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-primary">
                    <input
                      type="checkbox"
                      checked={selectedFields.days_per_week}
                      onChange={() => toggleField("days_per_week")}
                      className="rounded border-border text-accent focus:ring-accent accent-accent"
                    />
                    <span>Days / Week</span>
                  </label>
                  <span className="text-[10px] font-mono text-primary-dim">
                    Current: {member.daysPerWeek || 4} days
                  </span>
                </div>
                <select
                  disabled={!selectedFields.days_per_week}
                  value={formData.days_per_week}
                  onChange={(e) => setFormData({ ...formData, days_per_week: Number(e.target.value) })}
                  className="w-full p-2 bg-background border border-border rounded-lg text-primary text-xs disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-accent"
                >
                  <option value={2}>2 Days / Week</option>
                  <option value={3}>3 Days / Week</option>
                  <option value={4}>4 Days / Week</option>
                  <option value={5}>5 Days / Week</option>
                  <option value={6}>6 Days / Week</option>
                </select>
              </div>

              {/* Experience Level */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  selectedFields.experience
                    ? "bg-surface-elevated border-accent/60 shadow-sm"
                    : "bg-surface border-border opacity-85"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-primary">
                    <input
                      type="checkbox"
                      checked={selectedFields.experience}
                      onChange={() => toggleField("experience")}
                      className="rounded border-border text-accent focus:ring-accent accent-accent"
                    />
                    <span>Experience Level</span>
                  </label>
                  <span className="text-[10px] font-mono text-primary-dim uppercase">
                    Current: {member.experience || "—"}
                  </span>
                </div>
                <select
                  disabled={!selectedFields.experience}
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full p-2 bg-background border border-border rounded-lg text-primary text-xs disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-accent"
                >
                  <option value="beginner">Beginner (&lt; 1 year)</option>
                  <option value="intermediate">Intermediate (1-3 years)</option>
                  <option value="advanced">Advanced (3+ years)</option>
                </select>
              </div>
            </div>

            {/* 4. Contact & Personal Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Phone */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  selectedFields.phone
                    ? "bg-surface-elevated border-accent/60 shadow-sm"
                    : "bg-surface border-border opacity-85"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-primary">
                    <input
                      type="checkbox"
                      checked={selectedFields.phone}
                      onChange={() => toggleField("phone")}
                      className="rounded border-border text-accent focus:ring-accent accent-accent"
                    />
                    <span>Phone Number</span>
                  </label>
                  <span className="text-[10px] font-mono text-primary-dim">
                    Current: {member.phone}
                  </span>
                </div>
                <input
                  type="tel"
                  disabled={!selectedFields.phone}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full p-2 bg-background border border-border rounded-lg text-primary font-mono text-xs disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-accent"
                />
              </div>

              {/* Email */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  selectedFields.email
                    ? "bg-surface-elevated border-accent/60 shadow-sm"
                    : "bg-surface border-border opacity-85"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-primary">
                    <input
                      type="checkbox"
                      checked={selectedFields.email}
                      onChange={() => toggleField("email")}
                      className="rounded border-border text-accent focus:ring-accent accent-accent"
                    />
                    <span>Email Address</span>
                  </label>
                  <span className="text-[10px] font-mono text-primary-dim">
                    Current: {member.email || "—"}
                  </span>
                </div>
                <input
                  type="email"
                  disabled={!selectedFields.email}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="athlete@example.com"
                  className="w-full p-2 bg-background border border-border rounded-lg text-primary text-xs disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* 5. Emergency Contact & Full Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Emergency Contact */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  selectedFields.emergency_contact
                    ? "bg-surface-elevated border-accent/60 shadow-sm"
                    : "bg-surface border-border opacity-85"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-primary">
                    <input
                      type="checkbox"
                      checked={selectedFields.emergency_contact}
                      onChange={() => toggleField("emergency_contact")}
                      className="rounded border-border text-accent focus:ring-accent accent-accent"
                    />
                    <span>Emergency Contact</span>
                  </label>
                  <span className="text-[10px] font-mono text-primary-dim">
                    Current: {member.emergencyContact || "—"}
                  </span>
                </div>
                <input
                  type="text"
                  disabled={!selectedFields.emergency_contact}
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                  placeholder="e.g. Spouse (+91 99999 88888)"
                  className="w-full p-2 bg-background border border-border rounded-lg text-primary text-xs disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-accent"
                />
              </div>

              {/* Full Name */}
              <div
                className={`p-3.5 rounded-xl border transition-all ${
                  selectedFields.full_name
                    ? "bg-surface-elevated border-accent/60 shadow-sm"
                    : "bg-surface border-border opacity-85"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-primary">
                    <input
                      type="checkbox"
                      checked={selectedFields.full_name}
                      onChange={() => toggleField("full_name")}
                      className="rounded border-border text-accent focus:ring-accent accent-accent"
                    />
                    <span>Full Legal Name</span>
                  </label>
                  <span className="text-[10px] font-mono text-primary-dim">
                    Current: {member.fullName}
                  </span>
                </div>
                <input
                  type="text"
                  disabled={!selectedFields.full_name}
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Legal name"
                  className="w-full p-2 bg-background border border-border rounded-lg text-primary text-xs disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Optional Member Note / Reason */}
            <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1.5">
              <label className="font-bold text-primary flex items-center justify-between">
                <span>Note for Gym Administrator (Optional)</span>
                <span className="text-[10px] font-mono text-primary-dim">Max 500 chars</span>
              </label>
              <textarea
                rows={2}
                value={formData.member_note}
                onChange={(e) => setFormData({ ...formData, member_note: e.target.value })}
                placeholder="Reason for change (e.g. 'Weighed in this morning at the gym', 'Switched to vegetarian diet')..."
                className="w-full p-2 bg-background border border-border rounded-lg text-primary text-xs focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-border flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-border text-primary-muted hover:text-primary hover:bg-surface-elevated transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-5 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold uppercase tracking-wider flex items-center gap-2 shadow-accent-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit for Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
