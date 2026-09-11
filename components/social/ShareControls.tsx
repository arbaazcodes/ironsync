"use client";

import React, { useState } from "react";
import { SavedPlanData } from "@/lib/supabase/planSync";
import { logExport } from "@/lib/data/historyService";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";
import {
  Download,
  Share2,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  MessageCircle,
} from "lucide-react";

interface ShareControlsProps {
  plan: SavedPlanData;
  userName?: string;
  className?: string;
}

export const ShareControls: React.FC<ShareControlsProps> = ({
  plan,
  userName,
  className = "",
}) => {
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const athlete = userName || plan.displayName || "Athlete";
  const formattedGoal = (plan.goal || "Muscle Gain").replace(/_/g, " ").toUpperCase();
  const caloriesStr = Number(plan.calories).toLocaleString();
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://ironsync.fit";

  // Build high-converting social summary text
  const shareText = `🔥 My IronSync Fitness Blueprint
🎯 Goal: ${formattedGoal}
⚡ Daily Fuel: ${caloriesStr} kcal
💪 Protein Target: ${plan.protein}g
📅 Cadence: ${plan.trainingDays} Days / Week (${plan.splitName || "Microcycle"})

Build your own deterministic blueprint at ${siteUrl}`;

  // Fetch the 1080x1920 PNG blob from the server
  const fetchCardBlob = async (): Promise<Blob> => {
    const response = await fetch("/api/share-card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plan,
        userName: athlete,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to render share image (Status: ${response.status})`);
    }

    return await response.blob();
  };

  // Download 1080x1920 PNG Image
  const handleDownload = async () => {
    try {
      setDownloading(true);
      setStatusMessage("Rendering 1080×1920 high-res card...");

      const blob = await fetchCardBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const cleanGoal = (plan.goal || "fitness").replace(/\s+/g, "-").toLowerCase();

      link.href = url;
      link.download = `IronSync-ShareCard-${cleanGoal}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Log share card export & product analytics
      trackEvent("share_card_generated", { action: "download", goal: plan.goal });

      if (plan.userId) {
        logExport(plan.userId, plan.id, "share_card", plan.version, plan.goal).catch((e) =>
          console.warn("Could not log share card export:", e)
        );
      }

      setStatusMessage("1080×1920 PNG downloaded successfully!");
      setTimeout(() => {
        URL.revokeObjectURL(url);
        setStatusMessage(null);
      }, 4000);
    } catch (err: any) {
      console.error("Download failed:", err);
      setStatusMessage("Failed to download image. Please retry.");
    } finally {
      setDownloading(false);
    }
  };

  // Web Share API with fallback
  const handleShare = async () => {
    try {
      setSharing(true);
      setStatusMessage("Preparing asset for device share sheet...");

      trackEvent("share_card_generated", { action: "share", goal: plan.goal });

      const blob = await fetchCardBlob();
      const file = new File([blob], `IronSync-${formattedGoal}.png`, {
        type: "image/png",
      });

      // 1. Check if device supports sharing files
      if (
        typeof navigator !== "undefined" &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: "My IronSync Fitness Blueprint",
          text: shareText,
        });
        setStatusMessage("Shared successfully!");
      }
      // 2. Fallback: Can share text/URL only
      else if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: "My IronSync Fitness Blueprint",
          text: shareText,
          url: siteUrl,
        });
        // Also trigger image download so user has the photo
        await handleDownload();
        setStatusMessage("Link shared & high-res image downloaded!");
      }
      // 3. Fallback: No Web Share API (Desktop browser) -> Download image & copy text
      else {
        await handleDownload();
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setStatusMessage("Card downloaded! Summary text copied to clipboard.");
        setTimeout(() => setCopied(false), 3000);
      }
    } catch (err: any) {
      // Ignore user cancellation of share sheet
      if (err.name !== "AbortError") {
        console.error("Share error:", err);
        // If sharing failed, fallback to download
        await handleDownload();
      }
    } finally {
      setSharing(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  };

  // Direct WhatsApp Share
  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareText);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // Copy Summary text to clipboard
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setStatusMessage("Summary copied to clipboard!");
      setTimeout(() => {
        setCopied(false);
        setStatusMessage(null);
      }, 3000);
    } catch {
      setStatusMessage("Could not access clipboard.");
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button
          onClick={handleDownload}
          disabled={downloading || sharing}
          variant="primary"
          size="lg"
          icon={
            downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )
          }
          className="w-full min-h-[48px] font-semibold text-sm shadow-lg shadow-accent/15"
        >
          {downloading ? "Rendering PNG..." : "Download 1080×1920 Card"}
        </Button>

        <Button
          onClick={handleShare}
          disabled={downloading || sharing}
          variant="secondary"
          size="lg"
          icon={
            sharing ? (
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
            ) : (
              <Share2 className="w-4 h-4 text-accent" />
            )
          }
          className="w-full min-h-[48px] font-semibold text-sm"
        >
          {sharing ? "Opening Share Sheet..." : "Share to Stories / Sheet"}
        </Button>
      </div>

      {/* Secondary Fast Channels */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleWhatsAppShare}
          variant="outline"
          size="md"
          icon={<MessageCircle className="w-4 h-4 text-emerald-400" />}
          className="flex-1 text-xs font-mono"
        >
          WhatsApp Share
        </Button>

        <Button
          onClick={handleCopyText}
          variant="outline"
          size="md"
          icon={
            copied ? (
              <Check className="w-4 h-4 text-accent" />
            ) : (
              <Copy className="w-4 h-4" />
            )
          }
          className="flex-1 text-xs font-mono"
        >
          {copied ? "Copied!" : "Copy Summary"}
        </Button>
      </div>

      {/* Live Status Toast / Feedback */}
      {statusMessage && (
        <div className="p-3 rounded-xl bg-surface border border-accent/30 text-xs text-primary flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-accent shrink-0" />
          <span className="font-mono text-[11px]">{statusMessage}</span>
        </div>
      )}

      {/* Format & Specification Note */}
      <div className="p-3 rounded-xl bg-surface/50 border border-border/60 text-[11px] text-primary-muted space-y-1">
        <p className="font-mono text-primary font-bold text-[10px] uppercase tracking-wider">
          Story & Status Dimensions (9:16 Portrait &bull; 1080 × 1920)
        </p>
        <p className="leading-relaxed">
          Calibrated with safe margins so your goals, calories, and training splits remain perfectly visible without getting cut off by Instagram Stories or WhatsApp UI headers.
        </p>
      </div>
    </div>
  );
};
