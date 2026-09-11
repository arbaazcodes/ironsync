import {
  AnalyticsEventName,
  AnalyticsEventRecord,
  AnalyticsProvider,
  FunnelAnalysis,
} from "./types";
import { sanitizeProperties } from "./privacy";
import { calculateFunnelMetrics, FUNNEL_STAGES } from "./funnel";

export * from "./types";
export * from "./privacy";
export * from "./funnel";

const SESSION_STORAGE_KEY = "ironsync_analytics_event_log";
const MAX_LOG_SIZE = 500;

// In-memory buffer for current session events
let inMemoryEventLog: AnalyticsEventRecord[] = [];

/**
 * Loads cached events from sessionStorage if running in browser.
 */
function loadPersistedLog(): AnalyticsEventRecord[] {
  if (typeof window === "undefined") return inMemoryEventLog;
  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        inMemoryEventLog = parsed;
        return inMemoryEventLog;
      }
    }
  } catch {
    // Ignore sessionStorage errors
  }
  return inMemoryEventLog;
}

/**
 * Persists events to sessionStorage if running in browser.
 */
function persistLog(events: AnalyticsEventRecord[]) {
  inMemoryEventLog = events.slice(-MAX_LOG_SIZE);
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(inMemoryEventLog));
  } catch {
    // Ignore storage quota or disabled storage errors
  }
}

// Built-in default provider that buffers events for funnel calculation
const sessionBufferProvider: AnalyticsProvider = {
  name: "session_buffer",
  track: (name, properties) => {
    const record: AnalyticsEventRecord = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `ev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name,
      properties,
      timestamp: new Date().toISOString(),
    };
    const current = loadPersistedLog();
    persistLog([...current, record]);
  },
  reset: () => {
    inMemoryEventLog = [];
    if (typeof window !== "undefined") {
      try {
        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
  },
};

// Console logger active during browser client-side local development
const consoleLoggerProvider: AnalyticsProvider = {
  name: "console_logger",
  track: (name, properties) => {
    if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
      const propKeys = Object.keys(properties);
      const propsSummary = propKeys.length > 0 ? properties : "";
      console.log(`%c[IronSync Analytics]%c ${name}`, "color: #10B981; font-weight: bold", "color: inherit", propsSummary);
    }
  },
};

// Provider registry
const providers: AnalyticsProvider[] = [sessionBufferProvider, consoleLoggerProvider];

/**
 * Registers an analytics provider (e.g. PostHog, Mixpanel, Segment, GA4).
 * Ensures clean extensibility without scattering provider code across pages.
 */
export function registerAnalyticsProvider(provider: AnalyticsProvider): void {
  const existingIdx = providers.findIndex((p) => p.name === provider.name);
  if (existingIdx >= 0) {
    providers[existingIdx] = provider;
  } else {
    providers.push(provider);
  }
}

/**
 * Removes a provider by name (useful for testing).
 */
export function unregisterAnalyticsProvider(name: string): void {
  const idx = providers.findIndex((p) => p.name === name);
  if (idx >= 0) {
    providers.splice(idx, 1);
  }
}

/**
 * Main analytics dispatch function.
 * Automatically runs properties through the privacy sanitizer, then forwards
 * to all registered providers.
 *
 * @param name Event name from AnalyticsEventName union
 * @param properties Non-sensitive event metadata
 */
export function trackEvent(
  name: AnalyticsEventName,
  properties?: Record<string, any>
): void {
  try {
    const sanitized = sanitizeProperties(properties);

    for (const provider of providers) {
      try {
        provider.track(name, sanitized);
      } catch (err) {
        console.warn(`[IronSync Analytics] Provider "${provider.name}" track failed:`, err);
      }
    }
  } catch (err) {
    console.warn(`[IronSync Analytics] Failed to track event "${name}":`, err);
  }
}

/**
 * Identifies a user across registered analytics providers without exposing credentials.
 */
export function identifyUser(userId: string, safeTraits?: Record<string, any>): void {
  try {
    const sanitized = sanitizeProperties(safeTraits);
    for (const provider of providers) {
      if (provider.identify) {
        try {
          provider.identify(userId, sanitized);
        } catch (err) {
          console.warn(`[IronSync Analytics] Provider "${provider.name}" identify failed:`, err);
        }
      }
    }
  } catch (err) {
    console.warn("[IronSync Analytics] Failed to identify user:", err);
  }
}

/**
 * Returns recent analytics events recorded in the current session.
 */
export function getAnalyticsEventLog(): AnalyticsEventRecord[] {
  return [...loadPersistedLog()];
}

/**
 * Clears the session analytics log.
 */
export function clearAnalyticsEventLog(): void {
  for (const provider of providers) {
    if (provider.reset) {
      provider.reset();
    }
  }
}

/**
 * Calculates real-time conversion rates across the canonical IronSync funnel
 * based on events recorded in the current session.
 */
export function getFunnelMetrics(): FunnelAnalysis {
  const events = loadPersistedLog();
  return calculateFunnelMetrics(events, FUNNEL_STAGES);
}
