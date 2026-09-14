import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database.types";

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function isValidSupabaseUrl(url?: string): boolean {
  const targetUrl = url || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!targetUrl) return false;
  const trimmed = targetUrl.trim();
  return (
    trimmed.startsWith("https://") &&
    trimmed.includes(".supabase.co") &&
    !trimmed.includes("your-project")
  );
}

export function getValidSupabaseKey(): string | null {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  // Accept either key if it starts with 'eyJ' or 'sb_publishable'
  if (anonKey && (anonKey.startsWith("eyJ") || anonKey.startsWith("sb_publishable"))) {
    return anonKey;
  }
  if (publishableKey && (publishableKey.startsWith("eyJ") || publishableKey.startsWith("sb_publishable"))) {
    return publishableKey;
  }
  return null;
}

export function isSupabaseConfigured(): boolean {
  return isValidSupabaseUrl() && getValidSupabaseKey() !== null;
}

export function getSupabaseConfigDiagnostics(): {
  isConfigured: boolean;
  missingUrl: boolean;
  missingKey: boolean;
} {
  const hasUrl = isValidSupabaseUrl();
  const hasKey = getValidSupabaseKey() !== null;
  return {
    isConfigured: hasUrl && hasKey,
    missingUrl: !hasUrl,
    missingKey: !hasKey,
  };
}

/**
 * Creates or retrieves the singleton Browser Supabase client.
 * Uses only browser-safe public environment variables and manages cookies automatically.
 */
export function getSupabase() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const key = getValidSupabaseKey()!;

  if (!clientInstance) {
    clientInstance = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      key
    );
  }

  return clientInstance;
}

export function createClient() {
  return getSupabase();
}

