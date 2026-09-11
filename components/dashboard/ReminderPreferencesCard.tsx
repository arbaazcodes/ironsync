"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Dumbbell,
  Scale,
  Calendar,
  Sparkles,
  Check,
  Clock,
  Mail,
  Smartphone,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ReminderPreferences,
  DEFAULT_REMINDER_PREFERENCES,
  fetchUserReminderPreferences,
  saveUserReminderPreferences,
  DeliveryChannel,
} from "@/lib/data/reminderService";

interface ReminderPreferencesCardProps {
  userId: string;
  onSaveToast?: (msg: string) => void;
}

const DAYS_OF_WEEK = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export function ReminderPreferencesCard({
  userId,
  onSaveToast,
}: ReminderPreferencesCardProps) {
  const [prefs, setPrefs] = useState<ReminderPreferences>(DEFAULT_REMINDER_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!userId) return;
      try {
        const loaded = await fetchUserReminderPreferences(userId);
        if (mounted) setPrefs(loaded);
      } catch (err) {
        console.error("Failed to load reminders:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveUserReminderPreferences(userId, prefs);
      if (onSaveToast) {
        onSaveToast("Reminder preferences saved successfully.");
      }
    } catch (err: any) {
      alert("Failed to save reminder preferences: " + err?.message);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDay = (day: string) => {
    const existing = prefs.workoutReminderDays;
    const updated = existing.includes(day)
      ? existing.filter((d) => d !== day)
      : [...existing, day];
    setPrefs({ ...prefs, workoutReminderDays: updated });
  };

  const toggleChannel = (channel: DeliveryChannel) => {
    const existing = prefs.preferredChannels;
    const updated = existing.includes(channel)
      ? existing.filter((c) => c !== channel)
      : [...existing, channel];
    setPrefs({ ...prefs, preferredChannels: updated });
  };

  if (isLoading) {
    return (
      <Card variant="elevated" padding="lg" className="border-border/80">
        <div className="flex items-center justify-center py-12">
          <div className="w-7 h-7 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <Card variant="elevated" padding="lg" className="border-border/80 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/60 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-accent">
              <Bell className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-sans text-primary">
                Smart Reminder Preferences
              </h3>
              <p className="text-[11px] text-primary-dim font-mono">
                Strictly opt-in cadences to maintain training consistency
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 text-xs self-start sm:self-auto"
          >
            {isSaving ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                Save Preferences
              </span>
            )}
          </Button>
        </div>

        {/* 1. WORKOUT REMINDER */}
        <div className="p-4 rounded-xl bg-surface/60 border border-border/70 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-accent">
                <Dumbbell className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h4 className="text-xs font-bold font-sans text-primary">Workout Reminders</h4>
                <p className="text-[11px] text-primary-dim font-mono">
                  Prompts on your chosen scheduled training days
                </p>
              </div>
            </div>

            {/* Switch Toggle */}
            <button
              type="button"
              role="switch"
              aria-checked={prefs.workoutReminderEnabled}
              onClick={() =>
                setPrefs({
                  ...prefs,
                  workoutReminderEnabled: !prefs.workoutReminderEnabled,
                })
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                prefs.workoutReminderEnabled ? "bg-accent" : "bg-border"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                  prefs.workoutReminderEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {prefs.workoutReminderEnabled && (
            <div className="pt-3 border-t border-border/50 space-y-3 animate-in fade-in">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-primary-dim mb-1.5">
                  Scheduled Training Days
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = prefs.workoutReminderDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                          isSelected
                            ? "bg-accent/20 text-accent border border-accent/40 shadow-sm"
                            : "bg-surface border border-border text-primary-dim hover:text-primary"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-primary-dim mb-1.5">
                  Preferred Reminder Time
                </label>
                <div className="relative max-w-xs">
                  <input
                    type="time"
                    value={prefs.workoutReminderTime}
                    onChange={(e) =>
                      setPrefs({ ...prefs, workoutReminderTime: e.target.value })
                    }
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs font-mono text-primary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2. CHECK-IN REMINDER */}
        <div className="p-4 rounded-xl bg-surface/60 border border-border/70 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-accent">
                <Scale className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h4 className="text-xs font-bold font-sans text-primary">Check-in Reminders</h4>
                <p className="text-[11px] text-primary-dim font-mono">
                  Prompts to weigh in and observe weight trajectory
                </p>
              </div>
            </div>

            {/* Switch Toggle */}
            <button
              type="button"
              role="switch"
              aria-checked={prefs.checkInReminderEnabled}
              onClick={() =>
                setPrefs({
                  ...prefs,
                  checkInReminderEnabled: !prefs.checkInReminderEnabled,
                })
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                prefs.checkInReminderEnabled ? "bg-accent" : "bg-border"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                  prefs.checkInReminderEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {prefs.checkInReminderEnabled && (
            <div className="pt-3 border-t border-border/50 space-y-3 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Cadence */}
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-primary-dim mb-1.5">
                    Cadence
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: "weekly", label: "Weekly" },
                      { id: "bi_weekly", label: "Bi-Weekly" },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() =>
                          setPrefs({
                            ...prefs,
                            checkInFrequency: c.id as "weekly" | "bi_weekly",
                          })
                        }
                        className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                          prefs.checkInFrequency === c.id
                            ? "bg-accent/20 text-accent border border-accent/40"
                            : "bg-surface border border-border text-primary-dim hover:text-primary"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Day of Week */}
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-primary-dim mb-1.5">
                    Check-in Day
                  </label>
                  <select
                    value={prefs.checkInDay}
                    onChange={(e) => setPrefs({ ...prefs, checkInDay: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs font-mono text-primary focus:outline-none focus:border-accent"
                  >
                    {DAYS_OF_WEEK.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time */}
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-primary-dim mb-1.5">
                    Weigh-in Time
                  </label>
                  <input
                    type="time"
                    value={prefs.checkInTime}
                    onChange={(e) => setPrefs({ ...prefs, checkInTime: e.target.value })}
                    className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs font-mono text-primary focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. PLAN REVIEW REMINDER */}
        <div className="p-4 rounded-xl bg-surface/60 border border-border/70 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-accent">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold font-sans text-primary">Plan Review Reminders</h4>
                  <Badge variant="subtle" size="sm">
                    Every 30 Days
                  </Badge>
                </div>
                <p className="text-[11px] text-primary-dim font-mono">
                  Prompts every 30 days to evaluate energy balance and recalibrate
                </p>
              </div>
            </div>

            {/* Switch Toggle */}
            <button
              type="button"
              role="switch"
              aria-checked={prefs.planReviewReminderEnabled}
              onClick={() =>
                setPrefs({
                  ...prefs,
                  planReviewReminderEnabled: !prefs.planReviewReminderEnabled,
                })
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                prefs.planReviewReminderEnabled ? "bg-accent" : "bg-border"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out ${
                  prefs.planReviewReminderEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <p className="text-[11px] text-primary-muted leading-relaxed pt-1 font-sans">
            Periodic 30-day reviews ensure your caloric targets, protein intake, and training volume scale alongside changes in body composition and performance.
          </p>
        </div>

        {/* 4. FUTURE-READY DELIVERY CHANNELS */}
        <div className="p-4 rounded-xl bg-surface/40 border border-border/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary-dim">
              Future-Ready Notification Channels
            </span>
            <span className="text-[10px] font-mono text-primary-dim">Multi-Channel Foundation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Email Channel */}
            <button
              type="button"
              onClick={() => toggleChannel("email")}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                prefs.preferredChannels.includes("email")
                  ? "bg-accent/15 text-accent border-accent/40 font-bold"
                  : "bg-surface border-border text-primary-dim"
              }`}
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="text-xs font-mono">Email</span>
              </div>
              {prefs.preferredChannels.includes("email") && (
                <span className="text-xs text-accent">&check;</span>
              )}
            </button>

            {/* Push Notifications */}
            <button
              type="button"
              onClick={() => toggleChannel("push")}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                prefs.preferredChannels.includes("push")
                  ? "bg-accent/15 text-accent border-accent/40 font-bold"
                  : "bg-surface border-border text-primary-dim"
              }`}
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span className="text-xs font-mono">Push Alerts</span>
              </div>
              {prefs.preferredChannels.includes("push") && (
                <span className="text-xs text-accent">&check;</span>
              )}
            </button>

            {/* WhatsApp */}
            <button
              type="button"
              onClick={() => toggleChannel("whatsapp")}
              className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                prefs.preferredChannels.includes("whatsapp")
                  ? "bg-accent/15 text-accent border-accent/40 font-bold"
                  : "bg-surface border-border text-primary-dim"
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs font-mono">WhatsApp</span>
              </div>
              {prefs.preferredChannels.includes("whatsapp") && (
                <span className="text-xs text-accent">&check;</span>
              )}
            </button>
          </div>

          <div className="flex items-start gap-2 pt-1 text-[10px] text-primary-dim">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Preferences are preserved in your secure account. Push and WhatsApp providers will activate when delivery infrastructure is connected. No unsolicited messages will ever be sent.
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
