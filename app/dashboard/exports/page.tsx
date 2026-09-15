"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PdfDownloadButton } from "@/components/pdf/PdfDownloadButton";
import { ShareCardPreview } from "@/components/social/ShareCardPreview";
import { ShareControls } from "@/components/social/ShareControls";
import {
  FileText,
  Share2,
  Dumbbell,
  Utensils,
  Moon,
  Sparkles,
  ShoppingCart,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Printer,
} from "lucide-react";

export default function DashboardExportsPage() {
  const { activePlan, user } = useAuth();
  const [activeTab, setActiveTab] = useState<"social" | "pdf">("social");

  if (!activePlan) return null;

  const athleteName = activePlan.displayName || user?.email?.split("@")[0] || "Athlete";

  const pdfSections = [
    {
      icon: <FileText className="w-4 h-4 text-accent" />,
      title: "Cover & Anthropometric Architecture",
      desc: "Hero calorie & protein breakdown, body stats, target weight, and double progression overload model.",
    },
    {
      icon: <Dumbbell className="w-4 h-4 text-accent" />,
      title: "Periodized Resistance Protocol",
      desc: "7-day microcycle schedule, complete sets, rep targets, rest intervals, execution cues, and common mistakes.",
    },
    {
      icon: <Utensils className="w-4 h-4 text-accent" />,
      title: "Precision Nutrition & Recipes",
      desc: "Meal-by-meal timing, macro distribution, whole-food portion sizes, and step-by-step culinary preparation.",
    },
    {
      icon: <Sparkles className="w-4 h-4 text-accent" />,
      title: "Evidence-Based Supplements",
      desc: "Level-A consensus compounds (Creatine, Whey, D3+K2, Omega-3, Magnesium) with dosages and timing.",
    },
    {
      icon: <Moon className="w-4 h-4 text-accent" />,
      title: "Recovery & Sleep Architecture",
      desc: "Circadian sleep duration, hydration volume formula, and active rest day tissue repair directives.",
    },
    {
      icon: <ShoppingCart className="w-4 h-4 text-accent" />,
      title: "Consolidated Grocery Checklist",
      desc: "Master shopping list categorized into proteins, carbs, fresh produce, dairy, and pantry essentials.",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Section */}
      <div className="space-y-1.5 pb-5 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Badge variant="accent" size="sm">
            EXPORTS & ACQUISITION ASSETS
          </Badge>
          <span className="text-xs font-mono text-primary-dim">
            Verified Blueprint v{activePlan.version}.0
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
          Export & Share Your Blueprint
        </h1>
        <p className="text-xs sm:text-sm text-primary-muted max-w-2xl">
          Generate high-resolution social share cards (1080 × 1920) for Instagram Stories and WhatsApp, or download the full A4 physical print deliverable for gym floor tracking.
        </p>

        {/* Tab Navigation */}
        <div className="pt-4 flex items-center gap-2">
          <button
            onClick={() => setActiveTab("social")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "social"
                ? "bg-accent text-background shadow-lg shadow-accent/20"
                : "bg-surface border border-border text-primary-muted hover:text-primary hover:border-accent/40"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>9:16 Social Story Card (1080 × 1920)</span>
          </button>

          <button
            onClick={() => setActiveTab("pdf")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "pdf"
                ? "bg-accent text-background shadow-lg shadow-accent/20"
                : "bg-surface border border-border text-primary-muted hover:text-primary hover:border-accent/40"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Official A4 PDF Blueprint</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: 9:16 SOCIAL SHARE CARD                                  */}
      {/* ============================================================== */}
      {activeTab === "social" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Card Preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-2 px-2 text-xs font-mono text-primary-dim">
                <span>LIVE GENERATED PREVIEW</span>
                <span>9:16 PORTRAIT</span>
              </div>
              <ShareCardPreview
                plan={activePlan}
                userName={athleteName}
              />
              <p className="text-[11px] font-mono text-primary-dim mt-3 text-center">
                Interactive preview matches the deterministic 1080 × 1920 output
              </p>
            </div>

            {/* Right: Controls & Details */}
            <div className="lg:col-span-7 space-y-6">
              <Card
                variant="elevated"
                padding="lg"
                className="border-border/80 bg-surface/90 space-y-5"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-accent">
                    <ShieldCheck className="w-4 h-4" />
                    <span>DETERMINISTIC ACQUISITION ASSET</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-primary tracking-tight">
                    Share Your Fitness Architecture
                  </h2>
                  <p className="text-xs sm:text-sm text-primary-muted leading-relaxed">
                    Designed specifically for Instagram Stories, WhatsApp Status, and personal sharing. Crisp 1080 × 1920 portrait dimensions with high-contrast typography and clear calibration metrics.
                  </p>
                </div>

                {/* Share Controls */}
                <ShareControls
                  plan={activePlan}
                  userName={athleteName}
                />
              </Card>

              {/* Data Transparency Card */}
              <Card variant="default" padding="md" className="border-border/60 space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
                  Card Data Source Transparency
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-surface border border-border/50">
                    <span className="text-primary-dim text-[10px] block">GOAL CALIBRATION</span>
                    <span className="text-primary font-bold capitalize truncate block">
                      {activePlan.goal.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface border border-border/50">
                    <span className="text-primary-dim text-[10px] block">ENERGY TARGET</span>
                    <span className="text-accent font-bold block">
                      {activePlan.calories} kcal
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface border border-border/50">
                    <span className="text-primary-dim text-[10px] block">PROTEIN THRESHOLD</span>
                    <span className="text-accent font-bold block">
                      {activePlan.protein}g / day
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface border border-border/50">
                    <span className="text-primary-dim text-[10px] block">CADENCE SCHEDULE</span>
                    <span className="text-primary font-bold block">
                      {activePlan.trainingDays} Days / Week
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface border border-border/50">
                    <span className="text-primary-dim text-[10px] block">DIET ARCHETYPE</span>
                    <span className="text-primary font-bold uppercase block">
                      {activePlan.dietType || "Balanced"}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface border border-border/50">
                    <span className="text-primary-dim text-[10px] block">ACQUISITION WATERMARK</span>
                    <span className="text-primary font-bold block">
                      ironsync.online
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: OFFICIAL A4 PDF BLUEPRINT                              */}
      {/* ============================================================== */}
      {activeTab === "pdf" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Download Callout Banner */}
          <Card
            variant="elevated"
            padding="lg"
            className="border-accent/30 bg-gradient-to-br from-surface via-surface to-accent/[0.04] shadow-2xl relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 text-xs font-mono text-accent">
                  <ShieldCheck className="w-4 h-4" />
                  <span>OFFICIAL A4 PRINT-READY SPECIFICATION</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-primary tracking-tight">
                  Ready for Offline Gym Tracking & Kitchen Use
                </h2>
                <p className="text-xs sm:text-sm text-primary-muted leading-relaxed">
                  Formatted specifically for clean A4 printing without dark ink waste. Take it to the gym floor, hang it on your refrigerator, or save it to your tablet for offline access.
                </p>
              </div>

              <div className="w-full lg:w-80 shrink-0">
                <PdfDownloadButton
                  plan={activePlan}
                  userName={athleteName}
                  userEmail={user?.email}
                />
              </div>
            </div>
          </Card>

          {/* Document Content Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
              Included in Your Multi-Page Deliverable
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pdfSections.map((sec, idx) => (
                <Card
                  key={idx}
                  variant="elevated"
                  padding="md"
                  className="border-border/70 hover:border-accent/40 transition-colors space-y-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-surface border border-border">
                      {sec.icon}
                    </div>
                    <h4 className="text-xs font-bold text-primary">{sec.title}</h4>
                  </div>
                  <p className="text-xs text-primary-muted leading-relaxed">
                    {sec.desc}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Live Blueprint Summary Preview */}
          <Card variant="elevated" padding="lg" className="border-border/80 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/70">
              <div>
                <h3 className="text-sm font-bold text-primary">On-Screen Verification Summary</h3>
                <p className="text-xs text-primary-dim font-mono">
                  Athlete: {athleteName} &bull; Generated {new Date(activePlan.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge variant="accent" size="sm">
                Active System
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-surface border border-border/60 text-xs font-mono">
              <div>
                <span className="text-primary-dim block">DAILY CALORIES</span>
                <span className="text-base font-bold text-primary">{activePlan.calories} kcal</span>
              </div>
              <div>
                <span className="text-primary-dim block">PROTEIN TARGET</span>
                <span className="text-base font-bold text-accent">{activePlan.protein}g</span>
              </div>
              <div>
                <span className="text-primary-dim block">TRAINING SPLIT</span>
                <span className="text-base font-bold text-primary">{activePlan.trainingDays} Days / Wk</span>
              </div>
              <div>
                <span className="text-primary-dim block">GOAL ARCHITECTURE</span>
                <span className="text-base font-bold text-primary capitalize">
                  {activePlan.goal.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs text-primary-dim font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                Deterministic Algorithm Verified
              </span>
              <span>IronSync Engine v2.4</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
