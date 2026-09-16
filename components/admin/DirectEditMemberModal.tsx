"use client";

import React, { useState } from "react";
import { X, Save, Loader2, AlertCircle, Edit3 } from "lucide-react";
import { GymMember, MemberStatus } from "@/lib/types/member";
import { GYM_PLAN_TEMPLATES } from "@/lib/data/gymPlans";

interface DirectEditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: GymMember;
  onSaved: () => void;
}

export function DirectEditMemberModal({
  isOpen,
  onClose,
  member,
  onSaved,
}: DirectEditMemberModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: member.fullName || "",
    phone: member.phone || "",
    email: member.email || "",
    status: member.status || "active",
    fitnessGoal: member.fitnessGoal || "hypertrophy",
    planId: member.planId || "plan-hypertrophy-ppl",
    expiryDate: member.expiryDate || "",
    gender: member.gender || "male",
    dateOfBirth: member.dateOfBirth || "",
    height: member.heightCm || member.height || "",
    weight: member.weightKg || member.weight || "",
    dietType: member.dietType || "non_vegetarian",
    experience: member.experience || "intermediate",
    daysPerWeek: member.daysPerWeek || 4,
    emergencyContact: member.emergencyContact || "",
    notes: member.notes || "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.fullName.trim()) {
      setError("Full Name is required.");
      return;
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/members/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
          status: formData.status as MemberStatus,
          fitnessGoal: formData.fitnessGoal,
          planId: formData.planId,
          expiryDate: formData.expiryDate || null,
          gender: formData.gender || null,
          dateOfBirth: formData.dateOfBirth || null,
          height: formData.height ? Number(formData.height) : null,
          weight: formData.weight ? Number(formData.weight) : null,
          dietType: formData.dietType,
          experience: formData.experience,
          daysPerWeek: Number(formData.daysPerWeek),
          emergencyContact: formData.emergencyContact.trim() || null,
          notes: formData.notes.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update member.");
      }

      onSaved();
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
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-accent uppercase tracking-wider font-bold">
              <Edit3 className="w-3.5 h-3.5" />
              Direct Administrator Edit
            </div>
            <h2 className="text-lg font-extrabold uppercase text-primary">
              Edit Member &bull; {member.memberId}
            </h2>
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
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Identity & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1 sm:col-span-2">
              <label className="font-mono uppercase text-primary-muted">Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono uppercase text-primary-muted">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as MemberStatus })}
                className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary uppercase font-mono focus:outline-none focus:border-accent"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-mono uppercase text-primary-muted">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary font-mono focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono uppercase text-primary-muted">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="athlete@example.com"
                className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Plan & Expiry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-mono uppercase text-primary-muted">Assigned Training Blueprint</label>
              <select
                value={formData.planId}
                onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary focus:outline-none focus:border-accent"
              >
                {GYM_PLAN_TEMPLATES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-mono uppercase text-primary-muted">Membership Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary font-mono focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Body Metrics & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="font-mono uppercase text-primary-muted">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="75.0"
                className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary font-mono focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono uppercase text-primary-muted">Height (cm)</label>
              <input
                type="number"
                step="0.5"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                placeholder="175"
                className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary font-mono focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono uppercase text-primary-muted">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary uppercase font-mono focus:outline-none focus:border-accent"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-mono uppercase text-primary-muted">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary font-mono focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Fitness Goal, Diet, Experience, Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="font-mono uppercase text-primary-muted">Goal</label>
              <select
                value={formData.fitnessGoal}
                onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary focus:outline-none focus:border-accent"
              >
                <option value="hypertrophy">Hypertrophy</option>
                <option value="fat_loss">Fat Loss</option>
                <option value="strength">Strength</option>
                <option value="endurance">Endurance</option>
                <option value="general_fitness">General</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-mono uppercase text-primary-muted">Diet</label>
              <select
                value={formData.dietType}
                onChange={(e) => setFormData({ ...formData, dietType: e.target.value })}
                className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary focus:outline-none focus:border-accent"
              >
                <option value="non_vegetarian">Non-Veg</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="eggetarian">Eggetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-mono uppercase text-primary-muted">Experience</label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary focus:outline-none focus:border-accent"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-mono uppercase text-primary-muted">Days / Wk</label>
              <select
                value={formData.daysPerWeek}
                onChange={(e) => setFormData({ ...formData, daysPerWeek: Number(e.target.value) })}
                className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary font-mono focus:outline-none focus:border-accent"
              >
                <option value={2}>2 Days</option>
                <option value={3}>3 Days</option>
                <option value={4}>4 Days</option>
                <option value={5}>5 Days</option>
                <option value={6}>6 Days</option>
              </select>
            </div>
          </div>

          {/* Emergency Contact & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-mono uppercase text-primary-muted">Emergency Contact</label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="Name & Contact Number"
                className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono uppercase text-primary-muted">Admin / Member Notes</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Health notes, locker, etc."
                className="w-full p-2.5 bg-surface border border-border rounded-xl text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Actions */}
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
              className="py-2.5 px-5 rounded-xl bg-accent hover:bg-accent-hover text-white font-bold uppercase tracking-wider flex items-center gap-2 shadow-accent-glow transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Member Record</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
