"use client";

import React from "react";
import { Settings, Shield, Key, Database, Server, CheckCircle2 } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminSettingsPage() {
  const supabaseActive = isSupabaseConfigured();

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider font-bold">
          <Settings className="w-3.5 h-3.5" />
          Infrastructure & Security
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-primary mt-1">
          Admin Settings
        </h1>
        <p className="text-xs sm:text-sm text-primary-muted">
          Cryptographic configurations, database sync status, and system security parameters.
        </p>
      </div>

      <div className="space-y-4">
        {/* Security Parameters */}
        <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-accent" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
              Authentication Security Architecture
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
              <span className="text-primary-dim uppercase">PIN Encryption</span>
              <div className="text-primary font-bold">scrypt (16-byte salt, 64-byte key)</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400">Constant-time verification enabled</div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
              <span className="text-primary-dim uppercase">Session Token</span>
              <div className="text-primary font-bold">HMAC-SHA256 HttpOnly Cookie</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400">Cookie name: ironsync_member_session</div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
              <span className="text-primary-dim uppercase">Member ID Generator</span>
              <div className="text-primary font-bold">IS-2026-XXXX (Server Managed)</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400">Strict sequential, no duplicate IDs</div>
            </div>

            <div className="p-4 rounded-xl bg-surface border border-border space-y-1">
              <span className="text-primary-dim uppercase">Access Rules</span>
              <div className="text-primary font-bold">Zero Member Self-Registration</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400">Admin-only member creation</div>
            </div>
          </div>
        </div>

        {/* Database & Cloud Connection */}
        <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-sky-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
              Database Connectivity
            </h2>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border">
            <div>
              <div className="text-xs font-bold text-primary uppercase">Supabase PostgreSQL</div>
              <div className="text-[11px] text-primary-muted font-mono">
                Project fdduamdeepiqdytqfwmb &bull; members table RLS protected
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                supabaseActive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {supabaseActive ? "Connected (Live)" : "Offline Cache Fallback"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
