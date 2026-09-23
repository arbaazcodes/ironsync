"use client";

import React, { useState } from "react";
import { FileDown, Loader2, CheckCircle2, AlertCircle, Printer } from "lucide-react";
import { DayMeal } from "@/lib/engine/mealGenerator";

interface DietPdfDownloadButtonProps {
  member: {
    fullName: string;
    memberId: string;
    fitnessGoal?: string;
    dietType?: string;
  };
  assignedPlan: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    dietStrategyNotes?: string;
    meals?: DayMeal[];
  };
  className?: string;
}

type DownloadState = "idle" | "preparing" | "generating" | "ready" | "error";

export const DietPdfDownloadButton: React.FC<DietPdfDownloadButtonProps> = ({
  member,
  assignedPlan,
  className = "",
}) => {
  const [downloadState, setDownloadState] = useState<DownloadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generateAndDownloadPdf = async (openInNewTab = false) => {
    try {
      setErrorMessage(null);
      setDownloadState("preparing");

      // Give UI 1 frame to render "preparing" state
      await new Promise((resolve) => setTimeout(resolve, 200));

      setDownloadState("generating");

      // Dynamically import @react-pdf/renderer and document component on client only
      const { pdf } = await import("@react-pdf/renderer");
      const { DietChartPdfDocument } = await import("./DietChartPdfDocument");

      const docElement = React.createElement(DietChartPdfDocument, {
        member,
        assignedPlan,
      }) as any;

      const blob = await pdf(docElement).toBlob();
      const url = URL.createObjectURL(blob);

      setDownloadState("ready");

      if (openInNewTab) {
        window.open(url, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = url;
        const dateStr = new Date().toISOString().split("T")[0];
        link.download = `IronSync-Diet-Chart-${member.memberId}-${dateStr}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Revert to idle after 3 seconds
      setTimeout(() => {
        setDownloadState("idle");
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      }, 3000);
    } catch (err: any) {
      console.error("Diet PDF generation failed:", err);
      setDownloadState("error");
      setErrorMessage(err?.message || "Failed to generate Diet PDF. Please retry.");
    }
  };

  const getButtonText = () => {
    switch (downloadState) {
      case "preparing":
        return "Preparing Diet Plan...";
      case "generating":
        return "Generating PDF...";
      case "ready":
        return "Diet Chart Downloaded!";
      case "error":
        return "Retry Download";
      default:
        return "Download Diet Chart (PDF)";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <button
          onClick={() => generateAndDownloadPdf(false)}
          disabled={downloadState === "preparing" || downloadState === "generating"}
          className="flex-1 py-3 px-5 rounded-2xl bg-accent hover:bg-accent-hover text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-accent-glow transition-all active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {downloadState === "preparing" || downloadState === "generating" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : downloadState === "ready" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <FileDown className="w-4 h-4" />
          )}
          <span>{getButtonText()}</span>
        </button>

        <button
          onClick={() => generateAndDownloadPdf(true)}
          disabled={downloadState === "preparing" || downloadState === "generating"}
          className="py-3 px-4 rounded-2xl bg-surface-elevated hover:bg-surface border border-border text-primary text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-75"
          title="Open preview or print directly"
        >
          <Printer className="w-4 h-4 text-primary-muted" />
          <span>Preview / Print</span>
        </button>
      </div>

      {downloadState === "generating" && (
        <p className="text-[11px] font-mono text-accent animate-pulse flex items-center gap-1.5">
          <Loader2 className="w-3 h-3 animate-spin" />
          Compiling meal distribution & nutritional targets into A4 print-ready PDF...
        </p>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-500 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
