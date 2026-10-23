import { createHash } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/admin";

export async function consumeRateLimit(scope: string, identity: string, limit: number, seconds: number) {
  const client = createServiceClient();
  if (!client) throw new Error("Rate limit service unavailable");
  const key = createHash("sha256").update(scope + ":" + identity).digest("hex");
  const { data, error } = await client.rpc("consume_request_limit", { p_key: key, p_limit: limit, p_window_seconds: seconds });
  if (error || !data?.[0]) throw new Error("Rate limit service unavailable");
  return data[0];
}
