"use client";

import React, { useState } from "react";
import { SavedPlanData } from "@/lib/supabase/planSync";
import { logExport } from "@/lib/data/historyService";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import { FileDown, Loader2, CheckCircle2, AlertCircle, Printer } from "lucide-react";

interface PdfDownloadButtonProps {
  plan: SavedPlanData;
  userName?: string;
  userEmail?: string;
  className?: string;
}

type DownloadState = "idle" | "preparing" | "generating" | "ready" | "error";

export const PdfDownloadButton: React.FC<PdfDownloadButtonProps> = ({
  plan,
  userName,
  userEmail,
  className = "",
}) => {
  const [downloadState, setDownloadState] = useState<DownloadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const generateAndDownloadPdf = async (openInNewTab = false) => {
    try {
      setErrorMessage(null);
      setDownloadState("preparing");

      // Give UI 1 frame to render "preparing" state
      await new Promise((resolve) => setTimeout(resolve, 250));

      setDownloadState("generating");

      // Dynamically import @react-pdf/renderer and document component on client only
      const { pdf } = await import("@react-pdf/renderer");
      const { BlueprintPdfDocument } = await import("./BlueprintPdfDocument");

      const docElement = React.createElement(BlueprintPdfDocument, {
        plan,
        userName,
        userEmail,
      }) as any;

      // Render PDF blob directly in browser
      const blob = await pdf(docElement).toBlob();
      const url = URL.createObjectURL(blob);

      setDownloadState("ready");

      if (openInNewTab) {
        window.open(url, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = url;
        const sanitizedGoal = (plan.goal || "fitness").replace(/\s+/g, "-").toLowerCase();
        const dateStr = new Date().toISOString().split("T")[0];
        link.download = `IronSync-Blueprint-${sanitizedGoal}-v${plan.version}-${dateStr}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Log export event to history & product analytics
      trackEvent("pdf_generated", {
        plan_version: plan.version,
        goal: plan.goal,
      });

      if (plan.userId) {
        logExport(plan.userId, plan.id, "pdf", plan.version, plan.goal).catch((e) =>
          console.warn("Could not log PDF export:", e)
        );
      }

      // Revert back to idle after 3 seconds so user can re-download if desired
      setTimeout(() => {
        setDownloadState("idle");
        // Revoke blob URL to free memory
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      }, 3000);
    } catch (err: any) {
      console.error("PDF generation failed:", err);
      setDownloadState("error");
      setErrorMessage(err?.message || "Failed to compile PDF. Please retry.");
    }
  };

  const getButtonText = () => {
    switch (downloadState) {
      case "preparing":
        return "Preparing your blueprint...";
      case "generating":
        return "Generating PDF...";
      case "ready":
        return "Download ready!";
      case "error":
        return "Retry Download";
      default:
        return "Download Official PDF Blueprint";
    }
  };

  const getButtonIcon = () => {
    switch (downloadState) {
      case "preparing":
      case "generating":
        return <Loader2 className="w-4 h-4 animate-spin text-accent" />;
      case "ready":
        return <CheckCircle2 className="w-4 h-4 text-accent" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <FileDown className="w-4 h-4" />;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Button
          onClick={() => generateAndDownloadPdf(false)}
          disabled={downloadState === "preparing" || downloadState === "generating"}
          variant="primary"
          size="lg"
          icon={getButtonIcon()}
          className="flex-1 min-h-[48px] shadow-lg shadow-accent/15 font-semibold text-sm"
        >
          {getButtonText()}
        </Button>

        <Button
          onClick={() => generateAndDownloadPdf(true)}
          disabled={downloadState === "preparing" || downloadState === "generating"}
          variant="secondary"
          size="lg"
          icon={<Printer className="w-4 h-4" />}
          className="min-h-[48px] text-xs font-mono"
        >
          Preview / Print
        </Button>
      </div>

      {downloadState === "generating" && (
        <p className="text-[11px] font-mono text-accent animate-pulse flex items-center gap-1.5">
          <Loader2 className="w-3 h-3 animate-spin" />
          Compiling vectors, workout cues & nutrition matrices into print-ready A4...
        </p>
      )}

      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
