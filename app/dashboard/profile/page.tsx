"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { getSupabase } from "@/lib/supabase/client";

import {
  UserProfileData,
  fetchUserProfile,
  saveUserProfile,
  detectCoreParameterChanges,
  regenerateBlueprintPlan,
  ParameterChange,
} from "@/lib/data/profileService";
import { RegeneratePlanModal } from "@/components/dashboard/RegeneratePlanModal";
import { DeleteAccountModal } from "@/components/dashboard/DeleteAccountModal";
import { ReminderPreferencesCard } from "@/components/dashboard/ReminderPreferencesCard";
import { trackEvent } from "@/lib/analytics";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  User as UserIcon,
  Mail,
  Phone,
  Dumbbell,
  Utensils,
  Bell,
  Shield,
  Save,
  CheckCircle2,
  LogOut,
  Trash2,
  FileText,
  Lock,
  Flame,
  Scale,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  GoalId,
  GenderType,
  ExperienceLevel,
  TrainingEnvironment,
  TrainingTime,
  DietType,
  BudgetTier,
} from "@/lib/types/onboarding";

const ALLERGIES_OPTIONS = [
  "Lactose / Dairy",
  "Gluten",
  "Peanuts / Tree Nuts",
  "Shellfish",
  "Soy",
  "Eggs",
];

export default function DashboardProfilePage() {
  const router = useRouter();
  const { user, activePlan, signOut, refreshPlan } = useAuth();

  const [initialProfile, setInitialProfile] = useState<UserProfileData | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<"personal" | "fitness" | "nutrition" | "reminders" | "account">("personal");
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<ParameterChange[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Load profile on mount
  useEffect(() => {
    let mounted = true;
    async function loadData() {
      if (!user?.id) return;
      try {
        const loaded = await fetchUserProfile(user.id, user.email || undefined);
        if (mounted) {
          // Pre-populate phone from user metadata if available
          if (user.phone && !loaded.phone) {
            loaded.phone = user.phone;
          }
          setInitialProfile(loaded);
          setProfile(loaded);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [user?.id, user?.email, user?.phone]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Check if anything has been edited compared to initial
  const hasEdits = useMemo(() => {
    if (!initialProfile || !profile) return false;
    return JSON.stringify(initialProfile) !== JSON.stringify(profile);
  }, [initialProfile, profile]);

  // Handle Save
  const handleInitiateSave = () => {
    if (!profile || !initialProfile || !user?.id || !activePlan) return;

    // Detect if any core parameters that govern blueprint changed
    const { hasChanged, changes } = detectCoreParameterChanges(initialProfile, profile);

    if (hasChanged) {
      setPendingChanges(changes);
      trackEvent("plan_recalibration_started", { source: "profile_page" });
      setIsRegenerateModalOpen(true);
    } else {
      // Save profile only
      handleSaveProfileOnly();
    }
  };

  // Save profile only (no blueprint regeneration)
  const handleSaveProfileOnly = async () => {
    if (!profile || !user?.id) return;
    try {
      setIsSaving(true);
      await saveUserProfile(user.id, profile);
      setInitialProfile({ ...profile });
      await refreshPlan();
      showToast("Profile information updated successfully.");
    } catch (err: any) {
      alert("Failed to save profile: " + err?.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Create updated blueprint (regenerate plan)
  const handleRegenerateBlueprint = async () => {
    if (!profile || !user?.id || !activePlan) return;
    try {
      setIsSaving(true);
      const result = await regenerateBlueprintPlan(user.id, activePlan, profile);
      if (!result.success) throw new Error(result.error);

      setInitialProfile({ ...profile });
      await refreshPlan();
      showToast(`Blueprint v${result.newPlan?.version || 2} successfully generated and activated!`);
    } catch (err: any) {
      alert("Failed to regenerate blueprint: " + err?.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Account Deletion
  const handleConfirmDeleteAccount = async () => {
    try {
      const supabase = getSupabase();
      if (supabase && user) {
        await supabase.from("profiles").delete().eq("id", user.id);
      }
    } catch (err) {
      console.warn("Client account delete warning:", err);
    }

    // Wipe local caches
    if (typeof window !== "undefined") {
      try {
        localStorage.clear();
      } catch {}
    }

    await signOut();
    router.push("/");
  };


  if (!profile || !activePlan) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-accent text-background font-mono text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Profile Summary */}
      <div className="p-6 rounded-2xl bg-surface-elevated border border-border/80 relative overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent text-xl font-bold font-mono shrink-0">
              {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
                  {profile.displayName}
                </h1>
                <Badge variant="accent" size="sm">
                  v{activePlan.version || 1} Active
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-primary-dim font-mono mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {user?.email || "Local Sync"}
                </span>
                {profile.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {profile.phone}
                  </span>
                )}
                <span className="text-accent uppercase font-bold">
                  &bull; {profile.goal.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handleInitiateSave}
              disabled={!hasEdits || isSaving}
              className="flex items-center gap-2 min-w-[130px]"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-2 overflow-x-auto select-none">
        <button
          onClick={() => setActiveTab("personal")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
            activeTab === "personal"
              ? "bg-accent/15 text-accent border border-accent/40"
              : "text-primary-dim hover:text-primary hover:bg-surface"
          }`}
        >
          <UserIcon className="w-3.5 h-3.5" />
          <span>Personal Info</span>
        </button>

        <button
          onClick={() => setActiveTab("fitness")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
            activeTab === "fitness"
              ? "bg-accent/15 text-accent border border-accent/40"
              : "text-primary-dim hover:text-primary hover:bg-surface"
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5" />
          <span>Fitness & Training</span>
        </button>

        <button
          onClick={() => setActiveTab("nutrition")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
            activeTab === "nutrition"
              ? "bg-accent/15 text-accent border border-accent/40"
              : "text-primary-dim hover:text-primary hover:bg-surface"
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Nutrition & Diet</span>
        </button>

        <button
          onClick={() => setActiveTab("reminders")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
            activeTab === "reminders"
              ? "bg-accent/15 text-accent border border-accent/40"
              : "text-primary-dim hover:text-primary hover:bg-surface"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Reminders</span>
        </button>

        <button
          onClick={() => setActiveTab("account")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
            activeTab === "account"
              ? "bg-accent/15 text-accent border border-accent/40"
              : "text-primary-dim hover:text-primary hover:bg-surface"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Account & Security</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PERSONAL INFORMATION */}
      {/* ========================================================================= */}
      {activeTab === "personal" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Card variant="elevated" padding="lg" className="border-border/80">
            <div className="flex items-center gap-2 pb-4 mb-6 border-b border-border/60">
              <UserIcon className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                Personal Biometrics & Identity
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Display Name */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm text-primary font-bold focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-1.5">
                  Email Address <span className="text-[10px] text-primary-dim font-normal">(Verified Account)</span>
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || "Local Demo Mode"}
                  className="w-full bg-surface/40 border border-border/50 rounded-xl px-3.5 py-2.5 text-sm font-mono text-primary-dim cursor-not-allowed"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-1.5">
                  Phone Number <span className="text-[10px] text-primary-dim font-normal">(Optional SMS Auth)</span>
                </label>
                <input
                  type="tel"
                  value={profile.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm font-mono text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-1.5">
                  Biological Profile
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["male", "female", "prefer_not_to_say"] as GenderType[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setProfile({ ...profile, gender: g })}
                      className={`py-2 px-2 rounded-xl text-xs font-mono capitalize border transition-all ${
                        profile.gender === g
                          ? "bg-accent/15 text-accent border-accent font-bold"
                          : "bg-surface border-border text-primary-dim hover:text-primary"
                      }`}
                    >
                      {g === "prefer_not_to_say" ? "Neutral" : g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-1.5">
                  Age (Years)
                </label>
                <input
                  type="number"
                  min="14"
                  max="100"
                  value={profile.age}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      age: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-1.5">
                  Height (cm)
                </label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  value={profile.heightCm}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      heightCm: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>

              {/* Current Weight */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-1.5">
                  Current Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  value={profile.weightKg}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      weightKg: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>

              {/* Target Weight */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-1.5">
                  Target Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  value={profile.targetWeightKg}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      targetWeightKg: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  className="w-full bg-surface border border-border rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FITNESS & TRAINING */}
      {/* ========================================================================= */}
      {activeTab === "fitness" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Card variant="elevated" padding="lg" className="border-border/80">
            <div className="flex items-center gap-2 pb-4 mb-6 border-b border-border/60">
              <Dumbbell className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                Training Goals & Environment
              </h3>
            </div>

            <div className="space-y-6">
              {/* Goal */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-2">
                  Primary Fitness Goal
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: "muscle_gain", label: "Muscle Gain", desc: "Hypertrophy & strength" },
                    { id: "fat_loss", label: "Fat Loss", desc: "Energy deficit & lean cut" },
                    { id: "recomp", label: "Recomposition", desc: "Lose fat & build muscle" },
                    { id: "strength", label: "Pure Strength", desc: "Neuromuscular force" },
                    { id: "endurance", label: "Cardio & Stamina", desc: "Aerobic capacity" },
                    { id: "posture_mobility", label: "Mobility & Posture", desc: "Joint health" },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setProfile({ ...profile, goal: g.id as GoalId })}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        profile.goal === g.id
                          ? "bg-accent/15 text-accent border-accent shadow-accent-glow"
                          : "bg-surface border-border text-primary-dim hover:text-primary hover:bg-surface-elevated"
                      }`}
                    >
                      <span className="text-xs font-bold font-sans text-primary block">
                        {g.label}
                      </span>
                      <span className="text-[10px] font-mono text-primary-dim mt-0.5">
                        {g.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Training Frequency */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-2">
                  Weekly Training Frequency
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {[3, 4, 5, 6].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setProfile({ ...profile, daysPerWeek: days })}
                      className={`py-3 px-3 rounded-xl border text-center font-mono transition-all ${
                        profile.daysPerWeek === days
                          ? "bg-accent/15 text-accent border-accent font-black shadow-accent-glow"
                          : "bg-surface border-border text-primary-dim hover:text-primary"
                      }`}
                    >
                      <span className="text-base font-bold block">{days} Days</span>
                      <span className="text-[10px] text-primary-dim">Per Week</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-2">
                  Lifting Experience
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(["beginner", "intermediate", "advanced"] as ExperienceLevel[]).map((exp) => (
                    <button
                      key={exp}
                      type="button"
                      onClick={() => setProfile({ ...profile, experience: exp })}
                      className={`py-2.5 px-3 rounded-xl border text-center font-mono capitalize text-xs transition-all ${
                        profile.experience === exp
                          ? "bg-accent/15 text-accent border-accent font-bold"
                          : "bg-surface border-border text-primary-dim hover:text-primary"
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Equipment / Training Environment */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-2">
                  Training Environment
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: "commercial_gym", label: "Commercial Gym", desc: "Barbells, cables, machines" },
                    { id: "home_gym", label: "Home Gym", desc: "Dumbbells & bench" },
                    { id: "bodyweight", label: "Bodyweight", desc: "Calisthenics & bands" },
                  ].map((env) => (
                    <button
                      key={env.id}
                      type="button"
                      onClick={() => setProfile({ ...profile, equipment: env.id as TrainingEnvironment })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        profile.equipment === env.id
                          ? "bg-accent/15 text-accent border-accent shadow-accent-glow"
                          : "bg-surface border-border text-primary-dim hover:text-primary"
                      }`}
                    >
                      <span className="text-xs font-bold text-primary block">{env.label}</span>
                      <span className="text-[10px] font-mono text-primary-dim">{env.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Session Duration & Training Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-2">
                    Session Duration
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[45, 60, 90].map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => setProfile({ ...profile, sessionDuration: dur })}
                        className={`py-2.5 rounded-xl border font-mono text-xs transition-all ${
                          profile.sessionDuration === dur
                            ? "bg-accent/15 text-accent border-accent font-bold"
                            : "bg-surface border-border text-primary-dim hover:text-primary"
                        }`}
                      >
                        {dur} Min
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-2">
                    Preferred Time of Day
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["morning", "afternoon", "evening"] as TrainingTime[]).map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setProfile({ ...profile, trainingTime: time })}
                        className={`py-2.5 rounded-xl border font-mono text-xs capitalize transition-all ${
                          profile.trainingTime === time
                            ? "bg-accent/15 text-accent border-accent font-bold"
                            : "bg-surface border-border text-primary-dim hover:text-primary"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: NUTRITION & DIET */}
      {/* ========================================================================= */}
      {activeTab === "nutrition" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Card variant="elevated" padding="lg" className="border-border/80">
            <div className="flex items-center gap-2 pb-4 mb-6 border-b border-border/60">
              <Utensils className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                Nutritional Framework & Dietary Preferences
              </h3>
            </div>

            <div className="space-y-6">
              {/* Diet Type */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-2">
                  Dietary Style
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: "non_vegetarian", label: "Non-Vegetarian", desc: "Poultry, fish, eggs, dairy" },
                    { id: "eggetarian", label: "Eggetarian", desc: "Eggs, dairy, vegetarian" },
                    { id: "vegetarian", label: "Vegetarian", desc: "Dairy & plant-rich foods" },
                    { id: "vegan", label: "Vegan", desc: "100% plant-based staples" },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setProfile({ ...profile, dietType: d.id as DietType })}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        profile.dietType === d.id
                          ? "bg-accent/15 text-accent border-accent shadow-accent-glow"
                          : "bg-surface border-border text-primary-dim hover:text-primary"
                      }`}
                    >
                      <span className="text-xs font-bold text-primary block">{d.label}</span>
                      <span className="text-[10px] font-mono text-primary-dim mt-0.5">{d.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Meals Per Day & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-2">
                    Meals Per Day
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[3, 4, 5].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setProfile({ ...profile, mealsPerDay: m })}
                        className={`py-2.5 rounded-xl border font-mono text-xs transition-all ${
                          profile.mealsPerDay === m
                            ? "bg-accent/15 text-accent border-accent font-bold"
                            : "bg-surface border-border text-primary-dim hover:text-primary"
                        }`}
                      >
                        {m} Meals
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-2">
                    Grocery Budget Tier
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["budget", "balanced", "flexible"] as BudgetTier[]).map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setProfile({ ...profile, budget: b })}
                        className={`py-2.5 rounded-xl border font-mono text-xs capitalize transition-all ${
                          profile.budget === b
                            ? "bg-accent/15 text-accent border-accent font-bold"
                            : "bg-surface border-border text-primary-dim hover:text-primary"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Food Restrictions / Allergies */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-primary-muted mb-2">
                  Food Restrictions & Allergies
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ALLERGIES_OPTIONS.map((item) => {
                    const isSelected = profile.allergies.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          const updated = isSelected
                            ? profile.allergies.filter((a) => a !== item)
                            : [...profile.allergies, item];
                          setProfile({ ...profile, allergies: updated });
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-mono text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? "bg-accent/15 text-accent border-accent font-bold"
                            : "bg-surface border-border text-primary-dim hover:text-primary"
                        }`}
                      >
                        <span>{item}</span>
                        {isSelected && <span className="text-accent text-xs">&check;</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: REMINDER PREFERENCES */}
      {/* ========================================================================= */}
      {activeTab === "reminders" && user?.id && (
        <ReminderPreferencesCard
          userId={user.id}
          onSaveToast={showToast}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ACCOUNT & SECURITY */}
      {/* ========================================================================= */}
      {activeTab === "account" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Account Status Card */}
          <Card variant="elevated" padding="lg" className="border-border/80">
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border/60">
              <Shield className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                Account & Authentication
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-surface border border-border/60 gap-2">
                <div>
                  <p className="text-sm font-bold text-primary">Authenticated Session</p>
                  <p className="text-xs font-mono text-primary-dim">{user?.email || "Local Demo User"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="subtle" size="sm">
                    Active Session
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                    className="flex items-center gap-1.5 text-xs text-rose-400 border-border hover:bg-rose-500/10"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </Button>
                </div>
              </div>

              {/* Legal & Policy Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link
                  href="/privacy"
                  className="p-3 rounded-xl bg-surface border border-border/60 hover:border-accent/50 flex items-center justify-between transition-colors text-xs font-mono text-primary-muted hover:text-primary"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" />
                    Privacy Policy
                  </span>
                  <span className="text-[10px] text-primary-dim uppercase">View &rarr;</span>
                </Link>

                <Link
                  href="/terms"
                  className="p-3 rounded-xl bg-surface border border-border/60 hover:border-accent/50 flex items-center justify-between transition-colors text-xs font-mono text-primary-muted hover:text-primary"
                >
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-accent" />
                    Terms of Service
                  </span>
                  <span className="text-[10px] text-primary-dim uppercase">View &rarr;</span>
                </Link>
              </div>
            </div>
          </Card>

          {/* Danger Zone: Delete Account */}
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/[0.04] p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider font-mono">
                  Danger Zone &mdash; Delete Account
                </h4>
                <p className="text-xs text-primary-dim max-w-xl leading-relaxed">
                  Permanently erase your athlete profile, current and archived blueprints, check-in trajectories, and meal setups. This operation requires explicit confirmation.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteModalOpen(true)}
                className="border-rose-500/40 text-rose-400 hover:bg-rose-500/15 shrink-0 flex items-center gap-1.5 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Action Bar on Mobile if Changes Exist */}
      {hasEdits && (
        <div className="fixed bottom-14 md:bottom-6 inset-x-4 max-w-md mx-auto z-30 bg-surface-elevated/95 border border-accent/40 rounded-2xl p-3 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 pl-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span className="text-xs font-mono text-primary font-bold">Unsaved changes</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProfile(initialProfile)}
              className="text-xs"
            >
              Reset
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleInitiateSave}
              disabled={isSaving}
              className="text-xs"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}

      {/* Blueprint Regeneration Dialog */}
      <RegeneratePlanModal
        isOpen={isRegenerateModalOpen}
        onClose={() => setIsRegenerateModalOpen(false)}
        changes={pendingChanges}
        currentPlan={activePlan}
        onSaveProfileOnly={handleSaveProfileOnly}
        onRegenerateBlueprint={handleRegenerateBlueprint}
      />

      {/* Delete Account Dialog */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleConfirmDeleteAccount}
      />
    </div>
  );
}
