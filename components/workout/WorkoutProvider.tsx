"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { WorkoutStore, workoutTransport } from "@/lib/workouts/store";
const Context = createContext<WorkoutStore | null>(null);
export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? (
    <AccountStore key={user.id} ownerId={user.id}>
      {children}
    </AccountStore>
  ) : null;
}
function AccountStore({
  ownerId,
  children,
}: {
  ownerId: string;
  children: React.ReactNode;
}) {
  const [store] = useState(
    () =>
      new WorkoutStore(
        ownerId,
        {
          getItem: (key) => window.localStorage.getItem(key),
          setItem: (key, value) => window.localStorage.setItem(key, value),
        },
        workoutTransport,
      ),
  );
  useEffect(() => {
    void store.initialize();
    const refresh = () => {
      void store.refresh();
    };
    const retry = setInterval(() => {
      if (store.getSnapshot().draft?.dirty) void store.sync();
    }, 30000);
    const warn = (event: BeforeUnloadEvent) => {
      const s = store.getSnapshot();
      if (s.draft?.dirty && s.storageError) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("online", refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("beforeunload", warn);
    return () => {
      store.dispose();
      clearInterval(retry);
      window.removeEventListener("online", refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("beforeunload", warn);
    };
  }, [store]);
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function useWorkoutStore() {
  const store = useContext(Context);
  if (!store) throw new Error("WorkoutProvider required");
  return store;
}
export function useWorkoutState() {
  const store = useWorkoutStore();
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
}
