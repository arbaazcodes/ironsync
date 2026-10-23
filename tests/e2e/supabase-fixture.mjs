// Local test double for Supabase Auth/PostgREST, backed by the real migration in PGlite.
// No production credentials or network calls. Not imported by application code.
import http from "node:http";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
const db = new PGlite();
const users = [
  { id: "00000000-0000-4000-8000-000000000011", email: "athlete@example.test" },
  { id: "00000000-0000-4000-8000-000000000012", email: "other@example.test" },
].map(u => ({ ...u, aud: "authenticated", role: "authenticated", user_metadata: { full_name: "Test Athlete" }, app_metadata: { provider: "email" }, created_at: new Date().toISOString(), email_confirmed_at: new Date().toISOString() }));
await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
create schema auth; grant usage on schema auth to authenticated;
create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;`);
for (const user of users) await db.query("insert into auth.users values ($1)", [user.id]);
await db.exec(readFileSync("supabase/migrations/20261023043606_public_signup_and_workout_security.sql", "utf8"));
const token = user => {
  const encode = object => Buffer.from(JSON.stringify(object)).toString("base64url");
  return encode({ alg: "HS256", typ: "JWT" }) + "." + encode({ sub: user.id, aud: "authenticated", role: "authenticated", exp: Math.floor(Date.now()/1000)+3600 }) + ".fixture-signature";
};
function fromRequest(req) {
  try { const id = JSON.parse(Buffer.from((req.headers.authorization || "").split(".")[1], "base64url").toString()).sub; return users.find(u => u.id === id); } catch { return null; }
}
http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3100");
  res.setHeader("Access-Control-Allow-Headers", "authorization, apikey, content-type, x-client-info, x-supabase-api-version, prefer, accept, accept-profile, content-profile");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Content-Type", "application/json");
  function send(data, status = 200) { res.statusCode = status; res.end(JSON.stringify(data)); }
  if (req.method === "OPTIONS") { res.statusCode = 204; res.end(); return; }
  const url = new URL(req.url, "http://127.0.0.1:54329");
  let body = {};
  try { let raw = ""; for await (const chunk of req) raw += chunk; if (raw) body = JSON.parse(raw); } catch { send({ error: "Invalid body" }, 400); return; }
  if (url.pathname === "/health") { send({ ok: true }); return; }
  if (url.pathname === "/auth/v1/token") {
    const user = users.find(u => u.email === body.email || body.refresh_token === u.id);
    if (!user || (body.password && body.password !== "test-password-123")) { send({ message: "Invalid login credentials", code: "invalid_credentials" }, 400); return; }
    send({ user, access_token: token(user), refresh_token: user.id, token_type: "bearer", expires_in: 3600, expires_at: Math.floor(Date.now()/1000)+3600 }); return;
  }
  if (url.pathname === "/auth/v1/signup") { send({ user: { ...users[0], email: body.email, identities: [{ id: "fixture" }] }, session: null }); return; }
  if (url.pathname === "/auth/v1/recover" || url.pathname === "/auth/v1/resend" || url.pathname === "/auth/v1/logout") { send({}); return; }
  const user = fromRequest(req);
  if (url.pathname === "/auth/v1/user") { send(user || { message: "Unauthorized" }, user ? 200 : 401); return; }
  if (!user) { send({ message: "Unauthorized" }, 401); return; }
  if (url.pathname === "/rest/v1/gym_admins") { send({ code: "42P01", message: "Simulated unavailable allowlist" }, 503); return; }
  if (["/rest/v1/plans", "/rest/v1/profiles"].includes(url.pathname)) { send([]); return; }
  if (url.pathname !== "/rest/v1/workout_sessions") { send({ message: "Not found" }, 404); return; }
  try {
    const rows = await db.transaction(async tx => {
      await tx.exec("set local role authenticated");
      await tx.query("select set_config('request.jwt.claim.sub', $1, true)", [user.id]);
      const filters = [];
      const values = [];
      for (const field of ["id","user_id","revision","status"]) {
        const value = url.searchParams.get(field);
        if (value?.startsWith("eq.")) { values.push(value.slice(3)); filters.push(field + " = $" + values.length); }
      }
      const where = filters.length ? " where " + filters.join(" and ") : "";
      if (req.method === "GET") return (await tx.query("select * from workout_sessions" + where + " order by started_at desc limit 50", values)).rows;
      const allowed = ["id","user_id","status","snapshot","revision","last_mutation_id","started_at","completed_at","updated_at"];
      const fields = allowed.filter(field => Object.hasOwn(body, field));
      if (req.method === "POST") return (await tx.query("insert into workout_sessions (" + fields.join(",") + ") values (" + fields.map((_,i) => "$"+(i+1)).join(",") + ") returning *", fields.map(f => f === "snapshot" ? JSON.stringify(body[f]) : body[f]))).rows;
      if (req.method === "PATCH") {
        const offset = values.length;
        return (await tx.query("update workout_sessions set " + fields.map((f,i) => f + "=$" + (offset+i+1)).join(",") + where + " returning *", [...values, ...fields.map(f => f === "snapshot" ? JSON.stringify(body[f]) : body[f])])).rows;
      }
      return [];
    });
    if (req.headers.accept?.includes("application/vnd.pgrst.object+json")) {
      if (rows.length === 1) send(rows[0]);
      else send({ code: "PGRST116", details: "The result contains " + rows.length + " rows", message: "Not a single result" }, 406);
    } else send(rows);
  } catch (error) { send({ code: error.code, message: error.message }, error.code === "23505" ? 409 : 403); }
}).listen(54329, "127.0.0.1", () => console.log("Local Supabase fixture ready"));
