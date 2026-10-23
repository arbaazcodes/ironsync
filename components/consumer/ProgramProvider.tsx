"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@/lib/context/AuthContext";
import type { Preferences, ProgramRecord } from "@/lib/program/types";
type State = {
  programs: ProgramRecord[];
  revision: number;
  overrides: Record<string, "skipped" | "planned">;
};
interface Value extends State {
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  save: (preferences: Preferences) => Promise<void>;
  markDay: (day: string, status: "skipped" | "planned") => Promise<void>;
}
const Context = createContext<Value | null>(null);
const initial: State = { programs: [], revision: 0, overrides: {} };
export function ProgramProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return (
    <AccountProgram key={user?.id || "guest"} owner={user?.id}>
      {children}
    </AccountProgram>
  );
}
function AccountProgram({
  owner,
  children,
}: {
  owner?: string;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<State>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    if (!owner) {
      setLoading(false);
      return;
    }
    setError("");
    try {
      const response = await fetch("/api/program", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setState(result);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Your plan could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [owner]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  async function save(preferences: Preferences) {
    const response = await fetch("/api/program", {
      method: "POST",
      signal: AbortSignal.timeout(12000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferences, expectedRevision: state.revision }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    setState((previous) => ({
      ...previous,
      revision: result.revision,
      programs: [result.record, ...previous.programs],
    }));
  }
  async function markDay(day: string, status: "skipped" | "planned") {
    const response = await fetch("/api/program/day", {
      method: "PUT",
      signal: AbortSignal.timeout(12000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day, status }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    setState((previous) => ({
      ...previous,
      overrides: { ...previous.overrides, [day]: status },
    }));
  }
  return (
    <Context.Provider
      value={{ ...state, loading, error, refresh, save, markDay }}
    >
      {children}
    </Context.Provider>
  );
}
export function useProgram() {
  const context = useContext(Context);
  if (!context) throw new Error("ProgramProvider required");
  return { ...context, program: context.programs[0]?.program || null };
}
