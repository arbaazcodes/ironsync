"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Clock, AlertTriangle, ShieldCheck, CheckCircle2, Info } from "lucide-react";

export default function DashboardSupplementsPage() {
  const supplements = [
    {
      name: "Creatine Monohydrate",
      purpose:
        "Elevates intramuscular phosphocreatine stores, accelerating rapid ATP resynthesis during high-intensity resistance training. Enhances maximal power output, repetition volume, and cellular hydration.",
      typicalUsage: "3–5g daily",
      evidence: "Strong (Level A Scientific Consensus)",
      notes:
        "Timing is non-critical; daily consistency is paramount. A loading phase (20g/day for 5 days) is optional but saturates stores faster than a continuous 3-5g dose.",
    },
    {
      name: "Whey Protein / Plant Protein Blend",
      purpose:
        "Provides a convenient, bioavailable source of essential amino acids (specifically leucine) to trigger muscle protein synthesis (MPS) post-training or when whole-food protein targets are difficult to reach.",
      typicalUsage: "20–35g per serving (1 scoop)",
      evidence: "Strong (Level A Scientific Consensus)",
      notes:
        "Use as an adjunct to whole foods, not as a replacement. Plant-based alternatives (pea/rice blends) provide equivalent anabolic stimulus when consumed in adequate leucine doses.",
    },
    {
      name: "Vitamin D3 + K2",
      purpose:
        "Regulates calcium metabolism, supports skeletal bone density, modulates immune defense, and facilitates healthy endocrine hormone production in individuals with suboptimal sun exposure.",
      typicalUsage: "2,000–4,000 IU daily",
      evidence: "Strong (Level A Scientific Consensus)",
      notes:
        "Fat-soluble vitamin; must be ingested alongside a meal containing dietary fat for optimal absorption. Ideally calibrated through annual 25-hydroxyvitamin D serum testing.",
    },
    {
      name: "Omega-3 Fatty Acids (EPA + DHA)",
      purpose:
        "Incorporates into cell membranes to improve fluidity, supports cardiovascular endothelial function, and attenuates systemic exercise-induced delayed onset muscle soreness (DOMS).",
      typicalUsage: "1,000–2,000mg combined EPA/DHA daily",
      evidence: "Strong (Level A Scientific Consensus)",
      notes:
        "Take with whole-food meals to avoid gastric distress. Vegans can substitute microalgae-derived EPA/DHA capsules for identical molecular bioavailability.",
    },
    {
      name: "Elemental Magnesium (Glycinate or Citrate)",
      purpose:
        "Serves as an essential enzymatic cofactor for neuromuscular transmission, relaxation of smooth and skeletal muscle fibers, and central nervous system parasympathetic down-regulation prior to sleep.",
      typicalUsage: "200–400mg 45 mins before bedtime",
      evidence: "Moderate to Strong",
      notes:
        "Magnesium glycinate is preferred for high bioavailability and minimal GI distress. Avoid magnesium oxide due to poor absorption rates.",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header */}
      <div className="space-y-1.5 pb-5 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Badge variant="accent" size="sm">
            EVIDENCE-BASED PROTOCOLS
          </Badge>
          <span className="text-xs font-mono text-primary-dim">
            Tier-A Validated Foundations
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
          Evidence-Based Supplement Science
        </h1>
        <p className="text-xs sm:text-sm text-primary-muted max-w-2xl">
          IronSync does not sell supplements or partner with commercial brands. We strictly review peer-reviewed scientific literature to provide transparent, unhyped guidance.
        </p>
      </div>

      {/* 2. Mandatory Medical Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-500/[0.06] border border-amber-500/25 flex items-start gap-3 text-xs text-primary-muted">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-300 font-mono text-[11px] uppercase tracking-wider">
            General Educational Guidance Only &bull; Not Medical Advice
          </p>
          <p className="leading-relaxed">
            The information below represents general sports nutrition consensus for healthy active adults. It is not intended to diagnose, treat, cure, or prevent any disease, nor does it replace professional consultation with a qualified medical physician. Always consult your doctor before introducing any new dietary supplement, particularly if you have pre-existing medical conditions or take prescription medications.
          </p>
        </div>
      </div>

      {/* 3. Supplement Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {supplements.map((supp, idx) => (
          <Card
            key={idx}
            variant="elevated"
            padding="md"
            className="space-y-4 border-border/80 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-border/60">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <h2 className="text-base sm:text-lg font-bold text-primary">
                      {supp.name}
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono text-accent block">
                    Evidence: {supp.evidence}
                  </span>
                </div>

                <span className="px-2.5 py-1 rounded-lg bg-surface border border-border text-primary font-mono text-xs font-bold whitespace-nowrap">
                  {supp.typicalUsage}
                </span>
              </div>

              {/* Purpose */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-primary-dim tracking-wider block">
                  Purpose & Mechanism
                </span>
                <p className="text-xs text-primary-muted leading-relaxed">
                  {supp.purpose}
                </p>
              </div>

              {/* Notes */}
              <div className="p-3 rounded-lg bg-surface border border-border/60 space-y-1">
                <span className="text-[10px] font-mono uppercase text-primary-dim tracking-wider block">
                  Usage Notes & Practical Guidance
                </span>
                <p className="text-xs text-primary-muted leading-relaxed">
                  {supp.notes}
                </p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs font-mono text-primary-dim">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                Zero Commercial Affiliation
              </span>
              <span>Peer-Reviewed</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
