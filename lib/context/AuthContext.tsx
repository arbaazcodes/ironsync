"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "../supabase/client";
import {
  SavedPlanData,
  syncPendingBlueprintToDatabase,
  fetchUserActivePlan,
  clearActivePlanCache,
  clearPendingBlueprint,
} from "../supabase/planSync";
import { trackEvent } from "../analytics";
import { getAuthCallbackUrl } from "../config/site";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  activePlan: SavedPlanData | null;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithPhone: (phone: string) => Promise<{ error: Error | null }>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<{ error: Error | null }>;
  signInWithEmail: (
    email: string,
    pass: string
  ) => Promise<{ error: Error | null; user?: User | null }>;
  signUpWithEmail: (
    email: string,
    pass: string,
    name?: string
  ) => Promise<{ error: Error | null; requiresEmailConfirmation?: boolean; user?: User | null }>;
  signOut: () => Promise<void>;
  refreshPlan: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePlan, setActivePlan] = useState<SavedPlanData | null>(null);
  const isConfigured = isSupabaseConfigured();

  // Load initial session on mount
  useEffect(() => {
    let mounted = true;
    const supabase = getSupabase();

    async function initAuth() {
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          if (currentSession?.user) {
            const { plan: syncedPlan } = await syncPendingBlueprintToDatabase(
              currentSession.user.id,
              currentSession.user.user_metadata?.full_name || currentSession.user.email?.split("@")[0]
            );
            if (mounted) {
              setActivePlan(syncedPlan);
            }
          }
        }
      } catch (err) {
        console.error("Failed to initialize session:", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    // Listen to real-time auth state changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          setSession(newSession);
          setUser(newSession?.user ?? null);

          if (event === "SIGNED_IN") {
            trackEvent("auth_completed", { method: "supabase_session" });
          }

          if (newSession?.user) {
            // Synchronize any pending blueprint from onboarding into Supabase
            const { plan: syncedPlan } = await syncPendingBlueprintToDatabase(
              newSession.user.id,
              newSession.user.user_metadata?.full_name || newSession.user.email?.split("@")[0]
            );
            setActivePlan(syncedPlan);
          } else {
            setActivePlan(null);
          }
          setIsLoading(false);
        }
      );

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }
  }, []);

  const refreshPlan = async () => {
    if (user) {
      const plan = await fetchUserActivePlan(user.id);
      setActivePlan(plan);
    }
  };

  const signInWithGoogle = async (): Promise<{ error: Error | null }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: new Error("Supabase is not configured.") };
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getAuthCallbackUrl(),
        },
      });
      return { error: error ? new Error(error.message) : null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error("Failed to sign in with Google.") };
    }
  };

  const signInWithPhone = async (phone: string): Promise<{ error: Error | null }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: new Error("Supabase is not configured.") };
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
      });
      return { error: error ? new Error(error.message) : null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error("Failed to sign in with phone.") };
    }
  };

  const verifyPhoneOtp = async (phone: string, token: string): Promise<{ error: Error | null }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: new Error("Supabase is not configured.") };
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: "sms",
      });

      if (!error && data.user) {
        const { plan: syncedPlan, error: syncError } = await syncPendingBlueprintToDatabase(data.user.id);
        if (syncError) {
          console.warn("Sync error:", syncError.message);
        }
        setActivePlan(syncedPlan);
      }

      return { error: error ? new Error(error.message) : null };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error("Failed to verify OTP.") };
    }
  };

  const signInWithEmail = async (
    email: string,
    pass: string
  ): Promise<{ error: Error | null; user?: User | null }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return {
        error: new Error(
          "Supabase environment variables missing. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)."
        ),
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("invalid login credentials")) {
          return { error: new Error("Invalid email or password. Please check your credentials.") };
        }
        if (msg.includes("email not confirmed")) {
          return {
            error: new Error("Email not confirmed. Please check your email to confirm, then sign in."),
          };
        }
        return { error: new Error(error.message) };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        const { plan: syncedPlan } = await syncPendingBlueprintToDatabase(
          data.user.id,
          data.user.user_metadata?.full_name || email.split("@")[0]
        );
        setActivePlan(syncedPlan);
      }

      return { error: null, user: data.user };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error("Failed to sign in with email.") };
    }
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    name?: string
  ): Promise<{ error: Error | null; requiresEmailConfirmation?: boolean; user?: User | null }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return {
        error: new Error(
          "Supabase environment variables missing. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)."
        ),
      };
    }

    try {
      const redirectUrl = getAuthCallbackUrl();

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: pass,
        options: {
          data: {
            full_name: name || "Athlete",
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("already registered") || msg.includes("already exists")) {
          return {
            error: new Error("Account already exists. Please sign in instead."),
          };
        }
        return { error: new Error(error.message) };
      }

      // Supabase returns an empty identities array if user is already registered (when email confirmation is enabled)
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        return {
          error: new Error("Account already exists. Please sign in instead."),
        };
      }

      const requiresEmailConfirmation = !data.session;

      if (!requiresEmailConfirmation && data.user) {
        setUser(data.user);
        setSession(data.session);
        const { plan: syncedPlan } = await syncPendingBlueprintToDatabase(data.user.id, name || "Athlete");
        setActivePlan(syncedPlan);
      }

      return { error: null, requiresEmailConfirmation, user: data.user };
    } catch (err: unknown) {
      return { error: err instanceof Error ? err : new Error("Failed to create account.") };
    }
  };

  const signOut = async () => {
    const currentUserId = user?.id;
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    clearPendingBlueprint();
    clearActivePlanCache();

    // Session hygiene: purge user-scoped cache keys from local storage
    if (typeof window !== "undefined") {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith("ironsync_") || (currentUserId && key.includes(currentUserId)))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch (storageErr) {
        console.warn("Could not purge localStorage on sign out:", storageErr);
      }
    }

    setUser(null);
    setSession(null);
    setActivePlan(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        activePlan,
        isConfigured,
        signInWithGoogle,
        signInWithPhone,
        verifyPhoneOtp,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshPlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
