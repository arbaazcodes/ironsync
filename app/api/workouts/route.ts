import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { saveWorkoutSchema, workoutSchema } from "@/lib/workouts/model";
import { isSameOrigin, readLimitedJson } from "@/lib/security/request";
import type { Database, Json } from "@/lib/types/database.types";
export const dynamic = "force-dynamic";
type Row = Database["public"]["Tables"]["workout_sessions"]["Row"];
const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "private, no-store" } });
function remote(row: Row) { return { session: workoutSchema.parse(row.snapshot), revision: row.revision, mutationId: row.last_mutation_id }; }
async function identity() {
  const client = await createServerSupabaseClient();
  if (!client) return null;
  const { data: { user }, error } = await client.auth.getUser();
  return error || !user ? null : { client, user };
}
export async function GET(request: Request) {
  try {
    const auth = await identity();
    if (!auth) return json({ error: "Sign in to load your workouts." }, 401);
    const { data, error } = await auth.client.from("workout_sessions").select("*").eq("user_id", auth.user.id)
      .order("started_at", { ascending: false }).limit(50);
    if (error) return json({ error: "Cloud workouts are unavailable. Your device draft is safe." }, 503);
    return json({ sessions: (data || []).map(remote) });
  } catch { return json({ error: "Could not load workouts." }, 503); }
}
export async function PUT(request: Request) {
  if (!isSameOrigin(request)) return json({ error: "Invalid origin." }, 403);
  try {
    const auth = await identity();
    if (!auth) return json({ error: "Sign in again to sync this workout." }, 401);
    let parsed;
    try { parsed = saveWorkoutSchema.safeParse(await readLimitedJson(request)); }
    catch { return json({ error: "Invalid or oversized workout." }, 400); }
    if (!parsed.success) return json({ error: "Check the workout values before saving." }, 400);
    const { session, expectedRevision, mutationId } = parsed.data;
    const row = {
      id: session.id, user_id: auth.user.id, snapshot: session as unknown as Json, status: session.status,
      revision: expectedRevision + 1, last_mutation_id: mutationId, started_at: session.startedAt,
      completed_at: session.completedAt, updated_at: new Date().toISOString(),
    };
    const query = expectedRevision === 0
      ? auth.client.from("workout_sessions").insert(row).select("*").maybeSingle()
      : auth.client.from("workout_sessions").update(row).eq("id", session.id).eq("user_id", auth.user.id)
        .eq("revision", expectedRevision).eq("status", "active").select("*").maybeSingle();
    const result = await query;
    if (!result.error && result.data) return json(remote(result.data));
    if (result.error && result.error.code !== "23505") return json({ error: "Cloud saving is unavailable. Your workout is saved on this device." }, 503);
    // Recover a committed write whose response was lost, or surface a genuine concurrent edit.
    const existing = await auth.client.from("workout_sessions").select("*").eq("id", session.id).eq("user_id", auth.user.id).maybeSingle();
    if (existing.error) return json({ error: "Could not verify the saved workout. Retry shortly." }, 503);
    if (existing.data?.last_mutation_id === mutationId) return json(remote(existing.data));
    let conflict = existing.data;
    if (!conflict) {
      const active = await auth.client.from("workout_sessions").select("*").eq("user_id", auth.user.id).eq("status", "active").maybeSingle();
      conflict = active.data;
    }
    return json({ error: "This workout changed on another device. Choose a version before syncing.", remote: conflict ? remote(conflict) : null }, 409);
  } catch { return json({ error: "Cloud saving is unavailable. Please retry." }, 503); }
}
