import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSameOrigin, readLimitedJson } from "@/lib/security/request";
import { preferencesSchema } from "@/lib/program/types";
import { parseProgram } from "@/lib/program/validate";
import { generateProgram } from "@/lib/program/generate";
import type { Json } from "@/lib/types/database.types";
export const dynamic = "force-dynamic";
const json = (data: unknown, status = 200) =>
  NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
async function identity() {
  const client = await createServerSupabaseClient();
  if (!client) return null;
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  return error || !user ? null : { client, user };
}
export async function GET() {
  try {
    const auth = await identity();
    if (!auth) return json({ error: "Sign in to see your plan." }, 401);
    const [plans, days] = await Promise.all([
      auth.client
        .from("training_programs")
        .select("*")
        .eq("user_id", auth.user.id)
        .order("revision", { ascending: false }),
      auth.client
        .from("training_day_overrides")
        .select("day,status")
        .eq("user_id", auth.user.id),
    ]);
    if (plans.error || days.error)
      return json(
        { error: "Your plan could not be loaded. Please retry." },
        503,
      );
    return json({
      programs: (plans.data || []).map((row) => ({
        id: row.id,
        program: parseProgram(row.snapshot),
        createdAt: row.created_at,
      })),
      revision: plans.data?.[0]?.revision || 0,
      overrides: Object.fromEntries(
        (days.data || []).map((row) => [row.day, row.status]),
      ),
    });
  } catch {
    return json({ error: "Your plan could not be loaded. Please retry." }, 503);
  }
}
const saveSchema = z
  .object({
    preferences: preferencesSchema,
    expectedRevision: z.number().int().min(0).max(1000000),
  })
  .strict();
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ error: "Invalid origin." }, 403);
  try {
    const auth = await identity();
    if (!auth)
      return json(
        { error: "Sign in again before saving your preferences." },
        401,
      );
    const parsed = saveSchema.safeParse(
      await readLimitedJson(request).catch(() => null),
    );
    if (!parsed.success)
      return json(
        {
          error:
            "Check your details. The planner supports adults aged 18–75, 2–5 training days, and the listed equipment and diets.",
        },
        400,
      );
    const latest = await auth.client
      .from("training_programs")
      .select("revision")
      .eq("user_id", auth.user.id)
      .order("revision", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (latest.error)
      return json(
        {
          error:
            "Cloud saving is unavailable. Your form has not been submitted.",
        },
        503,
      );
    if ((latest.data?.revision || 0) !== parsed.data.expectedRevision)
      return json(
        {
          error:
            "Your plan changed on another device. Reload your preferences before replacing it.",
        },
        409,
      );
    const program = generateProgram(parsed.data.preferences);
    const id = crypto.randomUUID();
    const revision = parsed.data.expectedRevision + 1;
    const saved = await auth.client
      .from("training_programs")
      .insert({
        id,
        user_id: auth.user.id,
        revision,
        snapshot: program as unknown as Json,
        created_at: program.createdAt,
      })
      .select("id")
      .single();
    if (saved.error)
      return json(
        {
          error:
            saved.error.code === "23505"
              ? "Your plan changed on another device. Reload and try again."
              : "Your plan was not saved. Please retry; your previous plan is unchanged.",
        },
        saved.error.code === "23505" ? 409 : 503,
      );
    return json({
      record: { id, program, createdAt: program.createdAt },
      revision,
    });
  } catch {
    return json(
      { error: "Could not save this plan. Your previous plan is unchanged." },
      503,
    );
  }
}
