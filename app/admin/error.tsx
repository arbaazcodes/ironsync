"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, LayoutDashboard, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AdminErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    console.error("[IronSync Admin Section Error]", error);
  }, [error]);

  const copyDigest = () => {
    if (!error.digest) return;
    navigator.clipboard?.writeText(error.digest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-12 px-4 max-w-2xl mx-auto">
      <div className="bg-surface-elevated border border-border/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-500 font-bold">
            Admin View Notice
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-primary tracking-tight">
            Unable to load this section
          </h1>
          <p className="text-xs text-primary-muted leading-relaxed max-w-md mx-auto">
            A rendering error occurred while displaying this admin view. The admin portal shell remains operational.
          </p>
        </div>

        {error.message && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-left overflow-x-auto">
            <p className="text-xs font-mono text-red-500 break-words">
              {error.message}
            </p>
          </div>
        )}

        {error.digest && (
          <div className="flex items-center justify-between gap-3 p-2.5 bg-surface rounded-xl border border-border text-xs font-mono text-primary-dim">
            <span className="truncate">Digest: {error.digest}</span>
            <button
              type="button"
              onClick={copyDigest}
              className="inline-flex items-center gap-1 text-primary hover:text-accent font-semibold shrink-0 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            variant="primary"
            size="sm"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </Button>

          <Link href="/admin" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
