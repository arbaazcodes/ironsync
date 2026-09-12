"use client";

import React from "react";
import { Settings, Shield, Key, Database, Server, CheckCircle2 } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminSettingsPage() {
  const supabaseActive = isSupabaseConfigured();

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#FF1E1E] uppercase tracking-wider">
          <Settings className="w-3.5 h-3.5" />
          Infrastructure & Security
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
          Admin Settings
        </h1>
        <p className="text-xs sm:text-sm text-white/50">
          Cryptographic configurations, database sync status, and system security parameters.
        </p>
      </div>

      <div className="space-y-4">
        {/* Security Parameters */}
        <div className="p-6 rounded-2xl bg-[#121212] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#FF1E1E]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Authentication Security Architecture
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-white/40 uppercase">PIN Encryption</span>
              <div className="text-white font-bold">scrypt (16-byte salt, 64-byte key)</div>
              <div className="text-[11px] text-emerald-400">Constant-time verification enabled</div>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-white/40 uppercase">Session Token</span>
              <div className="text-white font-bold">HMAC-SHA256 HttpOnly Cookie</div>
              <div className="text-[11px] text-emerald-400">Cookie name: ironsync_member_session</div>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-white/40 uppercase">Member ID Generator</span>
              <div className="text-white font-bold">IS-2026-XXXX (Server Managed)</div>
              <div className="text-[11px] text-emerald-400">Strict sequential, no duplicate IDs</div>
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-1">
              <span className="text-white/40 uppercase">Access Rules</span>
              <div className="text-white font-bold">Zero Member Self-Registration</div>
              <div className="text-[11px] text-emerald-400">Admin-only member creation</div>
            </div>
          </div>
        </div>

        {/* Database & Cloud Connection */}
        <div className="p-6 rounded-2xl bg-[#121212] border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-sky-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Database Connectivity
            </h2>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/[0.06]">
            <div>
              <div className="text-xs font-bold text-white uppercase">Supabase PostgreSQL</div>
              <div className="text-[11px] text-white/50 font-mono">
                Project fdduamdeepiqdytqfwmb &bull; members table RLS protected
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                supabaseActive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
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
