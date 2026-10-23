"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { getSupabase, getSupabaseConfigDiagnostics } from "../supabase/client";
import { type SavedPlanData, syncPendingBlueprintToDatabase, fetchUserActivePlan, clearActivePlanCache, clearPendingBlueprint } from "../supabase/planSync";
import { getAuthCallbackUrl } from "../config/site";

type AuthResult = { error: Error | null; user?: User | null; requiresEmailConfirmation?: boolean };
interface AuthContextType {
  user: User | null; session: Session | null; isLoading: boolean; activePlan: SavedPlanData | null;
  isConfigured: boolean; diagnostics: { missingUrl: boolean; missingKey: boolean };
  signInWithGoogle: () => Promise<AuthResult>;
  signInWithPhone: (phone: string) => Promise<AuthResult>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<AuthResult>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (email: string, password: string, name?: string) => Promise<AuthResult>;
  signOut: () => Promise<void>; refreshPlan: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | null>(null);
const unavailable = () => ({ error: new Error("Account service is unavailable. Please try again later.") });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePlan, setActivePlan] = useState<SavedPlanData | null>(null);
  const user = session?.user ?? null;
  const diagnostics = getSupabaseConfigDiagnostics();

  useEffect(() => {
    const client = getSupabase();
    if (!client) { setIsLoading(false); return; }
    // Never await another Supabase call from this callback: the auth lock is held.
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setIsLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const userId = user?.id;
  useEffect(() => {
    let cancelled = false;
    setActivePlan(null);
    if (userId) {
      void syncPendingBlueprintToDatabase(userId).then(({ plan }) => {
        if (!cancelled) setActivePlan(plan);
      }).catch(() => { /* Logger remains available if blueprint sync is unavailable. */ });
    }
    return () => { cancelled = true; };
  }, [userId]);

  async function refreshPlan() {
    if (userId) setActivePlan(await fetchUserActivePlan(userId));
  }
  async function signInWithGoogle(): Promise<AuthResult> {
    const client = getSupabase(); if (!client) return unavailable();
    const { error } = await client.auth.signInWithOAuth({ provider: "google", options: { redirectTo: getAuthCallbackUrl() } });
    return { error };
  }
  async function signInWithPhone(phone: string): Promise<AuthResult> {
    const client = getSupabase(); if (!client) return unavailable();
    const { error } = await client.auth.signInWithOtp({ phone }); return { error };
  }
  async function verifyPhoneOtp(phone: string, token: string): Promise<AuthResult> {
    const client = getSupabase(); if (!client) return unavailable();
    const { error, data } = await client.auth.verifyOtp({ phone, token, type: "sms" });
    return { error, user: data.user };
  }
  async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
    const client = getSupabase(); if (!client) return unavailable();
    const { error, data } = await client.auth.signInWithPassword({ email: email.trim(), password });
    return { error, user: data.user };
  }
  async function signUpWithEmail(email: string, password: string, name?: string): Promise<AuthResult> {
    const client = getSupabase(); if (!client) return unavailable();
    const { error, data } = await client.auth.signUp({
      email: email.trim(), password,
      options: { data: { full_name: name?.trim().slice(0, 100) || "Athlete" }, emailRedirectTo: getAuthCallbackUrl() },
    });
    // Keep confirmation enabled; do not reveal whether a confirmation-required account exists.
    return { error, user: data.user, requiresEmailConfirmation: !data.session };
  }
  async function signOut() {
    const client = getSupabase();
    const result = client ? await client.auth.signOut() : null;
    if (result?.error) throw result.error;
    clearPendingBlueprint(); clearActivePlanCache();
    setSession(null); setActivePlan(null);
    // Account-scoped unsynced workout drafts survive signout and require that account to resume.
    window.location.assign("/");
  }
  return <AuthContext.Provider value={{
    user, session, isLoading, activePlan, isConfigured: diagnostics.isConfigured, diagnostics,
    signInWithGoogle, signInWithPhone, verifyPhoneOtp, signInWithEmail, signUpWithEmail, signOut, refreshPlan,
  }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used within an AuthProvider");
  return value;
}
