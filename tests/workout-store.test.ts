import { afterEach, describe, expect, it, vi } from "vitest";
import { newWorkout, newSet, workoutTotals, type RemoteWorkout, type SaveWorkout } from "@/lib/workouts/model";
import { WorkoutStore, WorkoutConflict, type WorkoutTransport, workoutStorageKey } from "@/lib/workouts/store";

const stores: WorkoutStore[] = [];
afterEach(() => { stores.forEach(s => s.dispose()); stores.length = 0; });
function storage() {
  const data = new Map<string, string>();
  return { data, getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => { data.set(k, v); } };
}
function backend() {
  const rows = new Map<string, RemoteWorkout>();
  const api: WorkoutTransport = {
    list: async () => [...rows.values()].map(row => structuredClone(row)),
    save: async (input: SaveWorkout) => {
      const existing = rows.get(input.session.id);
      if (existing?.mutationId === input.mutationId) return structuredClone(existing);
      if ((existing?.revision || 0) !== input.expectedRevision) throw new WorkoutConflict(existing || null);
      const row = { session: structuredClone(input.session), revision: input.expectedRevision + 1, mutationId: input.mutationId };
      rows.set(row.session.id, row); return structuredClone(row);
    },
  };
  return { rows, api };
}
function controller(owner: string, disk: ReturnType<typeof storage>, api: WorkoutTransport) {
  const store = new WorkoutStore(owner, disk, api); stores.push(store); return store;
}
function completedSet() {
  const session = newWorkout("Push", [{ name: "Bench Press", sets: 1 }]);
  session.exercises[0].sets[0] = { ...newSet(), weight: 22.5, reps: 12, completed: true };
  return session;
}
describe("workout persistence", () => {
  it("restores decimal weights, reps, completion, IDs and timer immediately after refresh while offline", async () => {
    const disk = storage(); const cloud = backend();
    cloud.api.save = vi.fn().mockRejectedValue(new Error("Offline"));
    const first = controller("a", disk, cloud.api); await first.initialize();
    const session = completedSet(); session.restEndsAt = new Date(Date.now() + 90000).toISOString();
    first.start(session); await first.sync();
    const second = controller("a", disk, cloud.api); await second.initialize();
    expect(second.getSnapshot().draft?.session).toEqual(session);
    expect(second.getSnapshot().draft?.dirty).toBe(true);
    expect(workoutTotals(session).volume).toBe(270);
  });
  it("recovers from the cloud on another device and isolates different accounts", async () => {
    const disk = storage(); const cloud = backend();
    const first = controller("a", disk, cloud.api); await first.initialize(); first.start(completedSet()); await first.sync();
    const nextDevice = controller("a", storage(), cloud.api); await nextDevice.initialize();
    expect(nextDevice.getSnapshot().draft?.session).toEqual(first.getSnapshot().draft?.session);
    const otherUser = controller("b", disk, backend().api); await otherUser.initialize();
    expect(otherUser.getSnapshot().draft).toBeNull();
  });
  it("replays a committed mutation after a lost response without duplicating the revision", async () => {
    const disk = storage(); const cloud = backend(); const save = cloud.api.save; let drop = true;
    cloud.api.save = async input => { const result = await save(input); if (drop) { drop = false; throw new Error("Response lost"); } return result; };
    const first = controller("a", disk, cloud.api); await first.initialize(); first.start(completedSet()); await first.sync();
    expect(first.getSnapshot().draft?.pending).not.toBeNull();
    const restored = controller("a", disk, cloud.api); await restored.initialize();
    expect(restored.getSnapshot().draft?.revision).toBe(1);
    expect(restored.getSnapshot().draft?.dirty).toBe(false);
    expect(cloud.rows.size).toBe(1);
  });
  it("saves edits made while an older request is in flight", async () => {
    const disk = storage(); const cloud = backend(); const save = cloud.api.save;
    let release!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    let first = true;
    cloud.api.save = async input => { if (first) { first = false; await gate; } return save(input); };
    const store = controller("a", disk, cloud.api); await store.initialize(); store.start(completedSet());
    const pending = store.sync();
    const edited = structuredClone(store.getSnapshot().draft!.session); edited.exercises[0].sets[0].reps = 15;
    store.edit(edited); release(); await pending;
    expect([...cloud.rows.values()][0].session.exercises[0].sets[0].reps).toBe(15);
    expect(store.getSnapshot().draft?.dirty).toBe(false);
    expect(store.getSnapshot().draft?.revision).toBe(2);
  });
  it("preserves both versions on conflict and requires an explicit overwrite choice", async () => {
    const cloud = backend(); const first = controller("a", storage(), cloud.api);
    await first.initialize(); first.start(completedSet()); await first.sync();
    const second = controller("a", storage(), cloud.api); await second.initialize();
    const editA = structuredClone(first.getSnapshot().draft!.session); editA.exercises[0].sets[0].weight = 30;
    first.edit(editA); await first.sync();
    const editB = structuredClone(second.getSnapshot().draft!.session); editB.exercises[0].sets[0].weight = 40;
    second.edit(editB); await second.sync();
    expect(second.getSnapshot().blocked).toBe(true);
    expect(second.getSnapshot().draft?.session.exercises[0].sets[0].weight).toBe(40);
    expect(second.getSnapshot().conflict?.session.exercises[0].sets[0].weight).toBe(30);
    second.keepDeviceVersion(); await second.sync();
    expect([...cloud.rows.values()][0].session.exercises[0].sets[0].weight).toBe(40);
  });
  it("persists finish and real totals; cannot replace an unsynced completed workout", async () => {
    const cloud = backend(); const disk = storage(); const first = controller("a", disk, cloud.api);
    await first.initialize(); first.start(completedSet()); await first.sync();
    const finished = { ...first.getSnapshot().draft!.session, status: "completed" as const, completedAt: new Date().toISOString() };
    first.edit(finished);
    expect(() => first.start(newWorkout())).toThrow();
    await first.sync();
    const refreshed = controller("a", disk, cloud.api); await refreshed.initialize();
    expect(refreshed.getSnapshot().draft?.session.status).toBe("completed");
    expect(workoutTotals(refreshed.getSnapshot().draft!.session)).toMatchObject({ sets: 1, volume: 270, reps: 12 });
    refreshed.start(newWorkout()); expect(refreshed.getSnapshot().draft?.session.exercises).toEqual([]);
  });
  it("reports quota failures instead of claiming a device save", async () => {
    const cloud = backend(); const disk = storage(); disk.setItem = () => { throw new Error("quota"); };
    const store = controller("a", disk, cloud.api); await store.initialize(); store.start(completedSet());
    expect(store.getSnapshot().storageError).toContain("Device storage");
    await store.sync(); expect(store.getSnapshot().draft?.dirty).toBe(false);
  });
  it("rejects malformed/cross-account local drafts", async () => {
    const disk = storage(); disk.setItem(workoutStorageKey("a"), '{"version":1,"ownerId":"b"}');
    const store = controller("a", disk, backend().api); await store.initialize();
    expect(store.getSnapshot().draft).toBeNull();
    expect(store.getSnapshot().storageError).toContain("could not be read");
  });
});
