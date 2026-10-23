import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSameOrigin, readLimitedJson } from "@/lib/security/request";
import { parseProgram } from "@/lib/program/validate";
import { dateInZone, weekdayOf } from "@/lib/program/types";
const json = (data: unknown, status = 200) =>
  NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
const schema = z
  .object({ day: z.iso.date(), status: z.enum(["skipped", "planned"]) })
  .strict();
export async function PUT(request: Request) {
  if (!isSameOrigin(request)) return json({ error: "Invalid origin." }, 403);
  try {
    const client = await createServerSupabaseClient();
    if (!client) return json({ error: "Account service unavailable." }, 503);
    const {
      data: { user },
      error,
    } = await client.auth.getUser();
    if (error || !user)
      return json({ error: "Sign in to update your calendar." }, 401);
    const parsed = schema.safeParse(
      await readLimitedJson(request).catch(() => null),
    );
    if (!parsed.success)
      return json({ error: "Choose a valid date and status." }, 400);
    const { data, error: queryError } = await client
      .from("training_programs")
      .select("snapshot,created_at")
      .eq("user_id", user.id)
      .order("revision", { ascending: false });
    if (queryError)
      return json({ error: "Could not load your schedule." }, 503);
    const programs = (data || []).map((row) => parseProgram(row.snapshot));
    const program = programs.find((p) => p.startsOn <= parsed.data.day);
    const current = programs[0];
    if (
      !current ||
      !program ||
      parsed.data.day > dateInZone(new Date(), current.preferences.timeZone) ||
      program.schedule[weekdayOf(parsed.data.day)]?.kind !== "training"
    )
      return json(
        {
          error:
            "Only a scheduled training day up to today can be marked skipped.",
        },
        400,
      );
    const result = await client
      .from("training_day_overrides")
      .upsert({
        user_id: user.id,
        day: parsed.data.day,
        status: parsed.data.status,
        updated_at: new Date().toISOString(),
      });
    if (result.error)
      return json({ error: "Calendar change was not saved. Try again." }, 503);
    return json(parsed.data);
  } catch {
    return json({ error: "Calendar change was not saved. Try again." }, 503);
  }
}
