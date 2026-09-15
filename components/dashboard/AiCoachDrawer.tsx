"use client";

import React, { useEffect, useRef, useState } from "react";
import { MemberDashboardData } from "@/lib/types/member";
import { WeekDietChart } from "@/components/dashboard/WeekDietChart";
import { DietType, GoalId, ExperienceLevel } from "@/lib/types/onboarding";
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Flame,
  Dumbbell,
  Apple,
  RotateCcw,
  Copy,
  Check,
  Calendar,
  SlidersHorizontal,
  Loader2,
  ChevronRight,
  Printer,
  ArrowRight,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
}

interface AiCoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  memberData?: MemberDashboardData | null;
  onPlanUpdated?: () => void;
}

const QUICK_QUESTIONS = [
  "Swap an exercise from today's workout",
  "Easier variation for main compound lift",
  "Quick high-protein vegetarian dinner",
  "Optimal post-workout recovery meal timing",
];

export function AiCoachDrawer({
  isOpen,
  onClose,
  memberData,
  onPlanUpdated,
}: AiCoachDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // View state: "chat" | "diet_chart"
  const [activeView, setActiveView] = useState<"chat" | "diet_chart">("chat");

  // Profile Rebuilder Modal state
  const [isRebuilderOpen, setIsRebuilderOpen] = useState(false);
  const [rebuildLoading, setRebuildLoading] = useState(false);

  // Resolve member context
  const member = memberData?.member;
  const plan = memberData?.assignedPlan;

  const memberName = member?.fullName || "Athlete";
  const calories = plan?.calories || 2400;
  const protein = plan?.protein || 180;
  const splitName = plan?.splitName || "Push / Pull / Legs";
  const dietType = (member?.dietType as DietType) || "non_vegetarian";
  const fitnessGoal = member?.fitnessGoal || "muscle_gain";

  // Rebuilder form fields
  const [formGoal, setFormGoal] = useState<string>(fitnessGoal);
  const [formDiet, setFormDiet] = useState<string>(dietType);
  const [formWeight, setFormWeight] = useState<number>(member?.weight ? Number(member.weight) : 78);
  const [formHeight, setFormHeight] = useState<number>(member?.height ? Number(member.height) : 178);
  const [formAge, setFormAge] = useState<number>(member?.age ? Number(member.age) : 26);
  const [formDays, setFormDays] = useState<number>(member?.daysPerWeek || plan?.trainingDays || 4);
  const [formExperience, setFormExperience] = useState<string>(member?.experience || "intermediate");

  // Resolve today's workout name
  const todayIST = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "Asia/Kolkata",
  })
    .format(new Date())
    .toUpperCase();

  const todayScheduleItem = plan?.schedule?.find(
    (s) =>
      s.dayName.toUpperCase() === todayIST ||
      s.dayName.toUpperCase().startsWith(todayIST)
  ) || plan?.schedule?.[0];

  const todayWorkoutName = todayScheduleItem
    ? `${todayScheduleItem.dayName}: ${todayScheduleItem.focus} (${todayScheduleItem.type === "recovery" ? "Rest" : "Training"})`
    : "Scheduled Training Session";

  // Messages state with dynamic initial auto-welcome
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initialize tailored greeting on mount or memberData change
  useEffect(() => {
    setMessages([
      {
        id: "welcome-auto",
        sender: "coach",
        text: `### ⚡ IRONSYNC AI COACH INITIALIZED
Coach active for **${memberName}**. Your current protocol is calibrated to **${calories} kcal** and **${protein}g protein**. Today's directive is **${todayWorkoutName}**.

Ask for tactical exercise swaps, joint-friendly regressions, high-protein nutrition, or use the protocol actions below.`,
        timestamp: "Just now",
      },
    ]);
  }, [memberName, calories, protein, todayWorkoutName]);

  // Close on Escape & trap scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isRebuilderOpen) setIsRebuilderOpen(false);
        else onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      setTimeout(() => drawerRef.current?.focus(), 50);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, isRebuilderOpen]);

  // Scroll to bottom on new message in chat view
  useEffect(() => {
    if (isOpen && activeView === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, activeView]);

  if (!isOpen) return null;

  const handleSend = async (messageToSend?: string) => {
    const query = (messageToSend || inputText).trim();
    if (!query || isLoading) return;

    if (activeView !== "chat") setActiveView("chat");

    const userMessage: Message = {
      id: "user-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!messageToSend) setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          context: {
            memberName,
            goal: fitnessGoal,
            calories,
            protein,
            split: splitName,
            diet: dietType,
            todayWorkout: todayWorkoutName,
            experienceLevel: formExperience,
            daysPerWeek: formDays,
            weightKg: formWeight,
          },
        }),
      });

      const data = await response.json();
      const replyText = data?.reply || data?.error || "Coach engine unavailable. Please retry.";

      const coachMessage: Message = {
        id: "coach-" + Date.now(),
        sender: "coach",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, coachMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          sender: "coach",
          text: "Connection interrupted. Deterministic advice: Adhere to your prescribed workout sets and maintain protein targets.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 1. Rebuild from Profile Action
  const handleExecuteRebuild = async () => {
    setRebuildLoading(true);
    try {
      const res = await fetch("/api/member/plan/rebuild", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: formGoal,
          dietType: formDiet,
          weight: formWeight,
          height: formHeight,
          age: formAge,
          daysPerWeek: formDays,
          experience: formExperience,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setIsRebuilderOpen(false);
        setActiveView("chat");

        // Notify parent to refresh dashboard data
        if (onPlanUpdated) {
          onPlanUpdated();
        }

        const newCal = result.assignedPlan?.calories || calories;
        const newProt = result.assignedPlan?.protein || protein;
        const newSplit = result.assignedPlan?.splitName || splitName;

        const confirmationMsg: Message = {
          id: "rebuild-" + Date.now(),
          sender: "coach",
          text: `### ⚡ BLUEPRINT REBUILT FROM PROFILE
Your physical metrics were executed through the deterministic biomechanics & BMR/TDEE calculation engine:
- **Caloric Target**: **${newCal} kcal/day** (${formGoal.replace("_", " ")})
- **Protein Intake**: **${newProt}g/day** (optimized for ${formDiet.replace("_", " ")})
- **Training Architecture**: **${newSplit}** (${formDays} Days/Wk)
- **Status**: Synchronized across your dashboard, workout protocol, and diet charts.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, confirmationMsg]);
      }
    } catch (e) {
      console.error("Failed to rebuild plan:", e);
    } finally {
      setRebuildLoading(false);
    }
  };

  // 3. Today Workout Directive Action
  const handleShowTodayWorkout = () => {
    setActiveView("chat");
    const sessionDetails = todayScheduleItem
      ? todayScheduleItem.type === "recovery"
        ? `### ⚡ TODAY'S DIRECTIVE: ACTIVE REST & RECOVERY
- **Focus**: ${todayScheduleItem.focus}
- **Hydration**: Drink 3.5–4.0L water to maintain cellular volume.
- **Protein Goal**: Maintain **${protein}g protein** to support tissue protein synthesis.
- **Sleep**: 8+ hours non-negotiable for Central Nervous System repair.`
        : `### ⚡ TODAY'S WORKOUT DIRECTIVE
- **Session**: **${todayScheduleItem.dayName} — ${todayScheduleItem.focus}**
- **Prescribed Exercises**: ${todayScheduleItem.exercises?.length || 5} movements
${todayScheduleItem.exercises?.map((e, idx) => `  ${idx + 1}. **${e.name}** (${e.setsReps})`).join("\n") || ""}
- **Intensity Target**: All working sets at **RPE 8.0 - 8.5**.
- **Action**: Tap 'Start Workout' on your dashboard or navigate to the Workout tab.`
      : `### ⚡ TODAY'S DIRECTIVE\nMaintain **${calories} kcal** and **${protein}g protein**.`;

    setMessages((prev) => [
      ...prev,
      {
        id: "today-" + Date.now(),
        sender: "coach",
        text: sessionDetails,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-coach-title"
        className="relative w-full sm:max-w-xl h-[94vh] sm:h-full mt-auto sm:mt-0 bg-card border-t sm:border-t-0 sm:border-l border-border rounded-t-3xl sm:rounded-none shadow-2xl flex flex-col z-10 animate-in slide-in-from-bottom-6 sm:slide-in-from-right-6 duration-300 focus:outline-none"
      >
        {/* Mobile Pull Bar */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center bg-card">
          <div className="w-12 h-1.5 rounded-full bg-primary-dim/30" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border bg-surface-elevated flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shadow-[0_0_12px_rgba(255,30,30,0.3)]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="ai-coach-title" className="font-extrabold text-base sm:text-lg text-primary tracking-tight">
                  IRONSync AI Coach
                </h2>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-[11px] font-mono text-primary-muted truncate max-w-[260px] sm:max-w-none">
                {memberName} &bull; {calories} kcal &bull; {protein}g protein &bull; {splitName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-primary-muted hover:text-primary hover:bg-surface border border-transparent hover:border-border transition-all"
              aria-label="Close Coach"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Buttons Strip: Rebuild from profile | Diet chart | Today workout */}
        <div className="p-3 bg-surface border-b border-border flex items-center gap-2 shrink-0 overflow-x-auto scrollbar-none font-mono text-xs">
          <button
            onClick={() => setIsRebuilderOpen(true)}
            className="py-1.5 px-3 rounded-xl bg-surface-elevated hover:bg-surface border border-border text-primary font-bold flex items-center gap-1.5 shrink-0 transition-all hover:border-accent/40 active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-accent" />
            <span>Rebuild from profile</span>
          </button>

          <button
            onClick={() => setActiveView(activeView === "diet_chart" ? "chat" : "diet_chart")}
            className={`py-1.5 px-3 rounded-xl border font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-95 ${
              activeView === "diet_chart"
                ? "bg-accent border-accent text-white shadow-accent-glow"
                : "bg-surface-elevated hover:bg-surface border border-border text-primary hover:border-accent/40"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
            <span>{activeView === "diet_chart" ? "Return to Chat" : "Diet chart"}</span>
          </button>

          <button
            onClick={handleShowTodayWorkout}
            className="py-1.5 px-3 rounded-xl bg-surface-elevated hover:bg-surface border border-border text-primary font-bold flex items-center gap-1.5 shrink-0 transition-all hover:border-accent/40 active:scale-95"
          >
            <Dumbbell className="w-3.5 h-3.5 text-sky-500" />
            <span>Today workout</span>
          </button>
        </div>

        {/* View Content: Chat or Diet Chart */}
        {activeView === "diet_chart" ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            <WeekDietChart
              dietType={dietType}
              totalCalories={calories}
              mealsCount={4}
            />
          </div>
        ) : (
          /* Chat Message Stream */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 text-left ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`group relative max-w-[88%] sm:max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed transition-all shadow-sm ${
                        isUser
                          ? "bg-accent text-white font-medium rounded-tr-none shadow-accent/10"
                          : "bg-surface-elevated border border-border text-primary rounded-tl-none prose-sm dark:prose-invert"
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans break-words">{msg.text}</div>
                    </div>

                    <div
                      className={`flex items-center gap-2 mt-1 px-1 text-[10px] font-mono text-primary-dim ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <button
                          onClick={() => copyMessage(msg.id, msg.text)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-primary-dim hover:text-primary"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-xl bg-surface-elevated border border-border flex items-center justify-center text-primary-muted shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl rounded-tl-none bg-surface-elevated border border-border flex items-center gap-2 text-xs font-mono text-primary-muted">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                  <span>Synthesizing sports science directive...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Quick Question Suggestions */}
        {activeView === "chat" && (
          <div className="p-3 border-t border-border bg-surface/50 overflow-x-auto scrollbar-none flex items-center gap-2 shrink-0">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="py-1 px-2.5 rounded-xl bg-surface border border-border text-[11px] font-mono text-primary-muted hover:text-primary hover:border-accent/40 whitespace-nowrap transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input Footer */}
        {activeView === "chat" && (
          <div className="p-3 sm:p-4 border-t border-border bg-surface-elevated shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask coach (e.g. swap exercise, veg dinner, easier variation)..."
                disabled={isLoading}
                maxLength={600}
                className="flex-1 bg-surface border border-border text-primary rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-accent placeholder:text-primary-dim transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 rounded-xl bg-accent text-white hover:bg-accent-hover transition-all shadow-accent-glow disabled:opacity-40 active:scale-95"
                aria-label="Send Query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Profile Rebuilder Modal Dialog */}
      {isRebuilderOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-card border border-border p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <div className="text-xs font-mono text-accent uppercase font-bold">
                  Calculation Engine Configuration
                </div>
                <h3 className="text-lg font-black uppercase text-primary mt-0.5">
                  Rebuild Plan from Profile
                </h3>
              </div>
              <button
                onClick={() => setIsRebuilderOpen(false)}
                className="p-2 rounded-xl text-primary-muted hover:text-primary bg-surface border border-border"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              {/* Goal */}
              <div className="col-span-2 space-y-1">
                <label className="text-primary-dim uppercase">Fitness Goal</label>
                <select
                  value={formGoal}
                  onChange={(e) => setFormGoal(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface border border-border text-primary font-bold uppercase focus:ring-2 focus:ring-accent"
                >
                  <option value="muscle_gain">Hypertrophy (Muscle Gain)</option>
                  <option value="fat_loss">Fat Loss & Conditioning</option>
                  <option value="strength">Strength & Power Protocol</option>
                  <option value="recomp">Athletic Body Recomposition</option>
                </select>
              </div>

              {/* Diet Type */}
              <div className="space-y-1">
                <label className="text-primary-dim uppercase">Dietary Tier</label>
                <select
                  value={formDiet}
                  onChange={(e) => setFormDiet(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface border border-border text-primary font-bold focus:ring-2 focus:ring-accent"
                >
                  <option value="non_vegetarian">Non-Vegetarian</option>
                  <option value="vegetarian">Vegetarian (Plant/Dairy)</option>
                  <option value="eggetarian">Eggetarian</option>
                  <option value="vegan">Vegan (Strict Plant)</option>
                </select>
              </div>

              {/* Days/Week */}
              <div className="space-y-1">
                <label className="text-primary-dim uppercase">Training Frequency</label>
                <select
                  value={formDays}
                  onChange={(e) => setFormDays(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-surface border border-border text-primary font-bold focus:ring-2 focus:ring-accent"
                >
                  <option value={3}>3 Days / Week (Full Body)</option>
                  <option value={4}>4 Days / Week (Upper / Lower)</option>
                  <option value={5}>5 Days / Week (PPL Split)</option>
                  <option value={6}>6 Days / Week (Arnold / High Freq)</option>
                </select>
              </div>

              {/* Weight */}
              <div className="space-y-1">
                <label className="text-primary-dim uppercase">Weight (kg)</label>
                <input
                  type="number"
                  value={formWeight}
                  onChange={(e) => setFormWeight(Number(e.target.value))}
                  min={30}
                  max={250}
                  className="w-full p-2.5 rounded-xl bg-surface border border-border text-primary font-bold focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Height */}
              <div className="space-y-1">
                <label className="text-primary-dim uppercase">Height (cm)</label>
                <input
                  type="number"
                  value={formHeight}
                  onChange={(e) => setFormHeight(Number(e.target.value))}
                  min={100}
                  max={250}
                  className="w-full p-2.5 rounded-xl bg-surface border border-border text-primary font-bold focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Age */}
              <div className="space-y-1">
                <label className="text-primary-dim uppercase">Age (years)</label>
                <input
                  type="number"
                  value={formAge}
                  onChange={(e) => setFormAge(Number(e.target.value))}
                  min={12}
                  max={100}
                  className="w-full p-2.5 rounded-xl bg-surface border border-border text-primary font-bold focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Experience */}
              <div className="space-y-1">
                <label className="text-primary-dim uppercase">Experience</label>
                <select
                  value={formExperience}
                  onChange={(e) => setFormExperience(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-surface border border-border text-primary font-bold focus:ring-2 focus:ring-accent"
                >
                  <option value="beginner">Beginner (&lt;1 yr)</option>
                  <option value="intermediate">Intermediate (1-3 yrs)</option>
                  <option value="advanced">Advanced (3+ yrs)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setIsRebuilderOpen(false)}
                className="py-2.5 px-4 rounded-xl text-xs font-mono text-primary-muted hover:text-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRebuild}
                disabled={rebuildLoading}
                className="py-2.5 px-6 rounded-xl text-xs font-bold font-mono uppercase tracking-wider bg-accent hover:bg-accent-hover text-white flex items-center gap-2 shadow-accent-glow disabled:opacity-50"
              >
                {rebuildLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
                <span>Calculate &amp; Apply Blueprint</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
