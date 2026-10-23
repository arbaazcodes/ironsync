import { z } from "zod";
import { type Workout, type RemoteWorkout, type SaveWorkout, workoutSchema, remoteWorkoutSchema, saveWorkoutSchema } from "./model";

const draftSchema = z.object({
  version: z.literal(1), ownerId: z.string(), session: workoutSchema,
  revision: z.number().int().min(0), mutationId: z.string().uuid(), dirty: z.boolean(),
  pending: saveWorkoutSchema.nullable(),
});
export type WorkoutDraft = z.infer<typeof draftSchema>;
export interface WorkoutTransport {
  list(): Promise<RemoteWorkout[]>;
  save(input: SaveWorkout): Promise<RemoteWorkout>;
}
export class WorkoutConflict extends Error {
  constructor(public remote: RemoteWorkout | null) { super("This workout changed elsewhere. Choose which version to keep."); }
}
interface StoreState {
  draft: WorkoutDraft | null; ready: boolean; saving: boolean; error: string; storageError: string;
  blocked: boolean; conflict: RemoteWorkout | null; history: RemoteWorkout[];
}
export const workoutStorageKey = (owner: string) => "ironsync_workout_v1:" + owner;

export class WorkoutStore {
  private state: StoreState = { draft: null, ready: false, saving: false, error: "", storageError: "", blocked: false, conflict: null, history: [] };
  private listeners = new Set<() => void>();
  private initialization: Promise<void> | null = null;
  private syncing: Promise<void> | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private key: string;
  constructor(private owner: string, private storage: Pick<Storage, "getItem" | "setItem">, private transport: WorkoutTransport) { this.key = workoutStorageKey(owner); }
  getSnapshot = () => this.state;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private emit(patch: Partial<StoreState>) { this.state = { ...this.state, ...patch }; this.listeners.forEach(listener => listener()); }
  private persist(draft: WorkoutDraft) {
    let storageError = "";
    try { this.storage.setItem(this.key, JSON.stringify(draft)); }
    catch { storageError = "Device storage is unavailable. Keep this page open until cloud saving succeeds."; }
    this.emit({ draft, storageError });
  }
  initialize() {
    if (!this.initialization) this.initialization = this.load();
    return this.initialization;
  }
  private async load() {
    try {
      const raw = this.storage.getItem(this.key);
      if (raw) {
        const draft = draftSchema.parse(JSON.parse(raw));
        if (draft.ownerId !== this.owner) throw new Error("Wrong owner");
        this.emit({ draft });
      }
    } catch { this.emit({ storageError: "The device draft could not be read. Cloud recovery will be attempted." }); }
    try {
      const history = await this.transport.list();
      this.emit({ history });
      if (!this.state.draft?.dirty) {
        const remote = history.find(row => row.session.status === "active") || history.find(row => row.session.id === this.state.draft?.session.id) || history[0];
        if (remote) this.acceptRemote(remote);
      }
    } catch { this.emit({ error: "Cloud workouts are unavailable. Device edits will sync when the connection returns." }); }
    this.emit({ ready: true });
    if (this.state.draft?.dirty) await this.sync();
  }
  private acceptRemote(remote: RemoteWorkout) {
    this.persist({ version: 1, ownerId: this.owner, session: remote.session, revision: remote.revision, mutationId: remote.mutationId, pending: null, dirty: false });
  }
  start(session: Workout) {
    if (!this.state.ready || this.state.draft?.dirty || this.state.draft?.session.status === "active") throw new Error("Finish and sync your current workout before starting another.");
    this.persist({ version: 1, ownerId: this.owner, session: workoutSchema.parse(session), revision: 0, mutationId: crypto.randomUUID(), pending: null, dirty: true });
    this.emit({ error: "", conflict: null, blocked: false });
    this.schedule();
  }
  edit(session: Workout) {
    const draft = this.state.draft;
    if (!draft || draft.session.status !== "active" || session.id !== draft.session.id) return;
    this.persist({ ...draft, session: workoutSchema.parse(session), mutationId: crypto.randomUUID(), dirty: true });
    this.schedule();
  }
  private schedule() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => { void this.sync(); }, 400);
  }
  sync(): Promise<void> {
    if (this.syncing) return this.syncing;
    this.syncing = this.flush().finally(() => { this.syncing = null; });
    return this.syncing;
  }
  private async flush() {
    if (!this.state.ready || this.state.blocked || !this.state.draft?.dirty) return;
    this.emit({ saving: true, error: "" });
    try {
      while (this.state.draft?.dirty && !this.state.blocked) {
        const draft = this.state.draft;
        // Persist the exact in-flight operation BEFORE sending it. A refresh replays the
        // same mutation ID, even if more edits were made while its response was pending.
        const pending = draft.pending || { session: draft.session, expectedRevision: draft.revision, mutationId: draft.mutationId };
        this.persist({ ...draft, pending });
        const remote = await this.transport.save(pending);
        const current = this.state.draft!;
        if (current.session.id !== remote.session.id) throw new Error("Unexpected workout response");
        const dirty = current.mutationId !== pending.mutationId;
        this.persist({ ...current, revision: remote.revision, dirty, pending: null });
        this.emit({ history: [remote, ...this.state.history.filter(row => row.session.id !== remote.session.id)].slice(0, 50) });
      }
    } catch (error) {
      if (error instanceof WorkoutConflict) this.emit({ blocked: true, conflict: error.remote });
      this.emit({ error: error instanceof Error ? error.message : "Cloud saving failed. Your device draft is preserved." });
    } finally { this.emit({ saving: false }); }
  }
  useCloudVersion() {
    if (!this.state.conflict || !this.state.draft) return;
    // Preserve the losing version for support/recovery; never silently discard dirty sets.
    try { this.storage.setItem(this.key + ":backup:" + this.state.draft.mutationId, JSON.stringify(this.state.draft)); }
    catch { throw new Error("Export the device copy before replacing it; storage is unavailable."); }
    this.acceptRemote(this.state.conflict);
    this.emit({ blocked: false, conflict: null, error: "" });
  }
  keepDeviceVersion() {
    const { conflict, draft } = this.state;
    if (!conflict || !draft || conflict.session.id !== draft.session.id || conflict.session.status !== "active") return;
    this.persist({ ...draft, revision: conflict.revision, pending: null, mutationId: crypto.randomUUID(), dirty: true });
    this.emit({ blocked: false, conflict: null, error: "" });
    this.schedule();
  }
  async refresh() {
    if (this.state.draft?.dirty) { await this.sync(); return; }
    try {
      const history = await this.transport.list();
      this.emit({ history, error: "" });
      const remote = history.find(row => row.session.status === "active") || history.find(row => row.session.id === this.state.draft?.session.id);
      if (remote && !this.state.draft?.dirty) this.acceptRemote(remote);
    } catch { this.emit({ error: "Cloud refresh failed. Your device copy is still available." }); }
  }
  dispose() { if (this.timer) clearTimeout(this.timer); }
}

async function callApi(method: "GET" | "PUT", body?: SaveWorkout) {
  const response = await fetch("/api/workouts", { method, cache: "no-store", credentials: "same-origin",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(12000) });
  const result = await response.json();
  if (response.status === 409) throw new WorkoutConflict(result.remote ? remoteWorkoutSchema.parse(result.remote) : null);
  if (!response.ok) throw new Error(result.error || "Cloud saving failed. Retry shortly.");
  return result;
}
export const workoutTransport: WorkoutTransport = {
  list: async () => z.array(remoteWorkoutSchema).parse((await callApi("GET")).sessions),
  save: async input => remoteWorkoutSchema.parse(await callApi("PUT", input)),
};
