import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { newWorkout } from "@/lib/workouts/model";
let db: PGlite;
const a = "00000000-0000-4000-8000-000000000001";
const b = "00000000-0000-4000-8000-000000000002";
const migration = readFileSync("supabase/migrations/20261023043606_public_signup_and_workout_security.sql", "utf8");
async function asUser(id: string) { await db.exec("reset role; set role authenticated; select set_config('request.jwt.claim.sub', '" + id + "', false);"); }
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; grant usage on schema auth to authenticated;
    create table auth.users(id uuid primary key);
    create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    insert into auth.users values ('${a}'), ('${b}');
    create table public.profiles(id uuid primary key references auth.users, user_id uuid, display_name text);
    grant all on public.profiles to authenticated;
    create table public.notifications(id uuid primary key, audience text);
    create table public.attendance(id uuid primary key);
    create table public.member_change_requests(id uuid primary key);
    create table public.member_audit_log(id uuid primary key);
    create table public.members(id uuid primary key);
    grant all on public.notifications, public.attendance, public.member_change_requests, public.member_audit_log, public.members to anon, authenticated;
    alter table public.notifications enable row level security;
    create policy unsafe_old_policy on public.notifications for all using (true) with check (true);`);
  await db.exec(migration);
}, 60000);
afterAll(async () => { await db.close(); });
describe("Postgres security migration", () => {
  it("revokes legacy anon/authenticated access, including notifications", async () => {
    const result = await db.query<{ denied: boolean }>("select not has_table_privilege('anon','public.notifications','select') and not has_table_privilege('authenticated','public.members','update') as denied");
    expect(result.rows[0].denied).toBe(true);
    await db.exec("set role anon");
    await expect(db.query("select * from public.notifications")).rejects.toThrow(/permission denied/);
    await db.exec("reset role");
  });
  it("prevents client admin self-enrollment and profile impersonation", async () => {
    await asUser(a);
    await expect(db.query("insert into public.gym_admins(user_id) values ($1)", [a])).rejects.toThrow(/permission denied/);
    await expect(db.query("insert into public.profiles(id,user_id) values ($1,$2)", [b,a])).rejects.toThrow(/row-level security/);
    await db.query("insert into public.profiles(id,user_id) values ($1,$1)", [a]);
    await expect(db.query("update public.profiles set user_id=$1 where id=$2", [b,a])).rejects.toThrow(/row-level security/);
    await db.exec("reset role");
  });
  it("enforces workout ownership, one active session, CAS and atomic set snapshots", async () => {
    await asUser(a);
    const session = newWorkout(); const mutation = crypto.randomUUID();
    await db.query("insert into workout_sessions(id,user_id,status,snapshot,revision,last_mutation_id,started_at) values ($1,$2,'active',$3,1,$4,$5)", [session.id,a,JSON.stringify(session),mutation,session.startedAt]);
    await asUser(b);
    expect((await db.query("select * from workout_sessions")).rows).toHaveLength(0);
    expect((await db.query("update workout_sessions set revision=2 where id=$1 returning id", [session.id])).rows).toHaveLength(0);
    await expect(db.query("insert into workout_sessions(id,user_id,status,snapshot,revision,last_mutation_id,started_at) values ($1,$2,'active',$3,1,$4,$5)", [crypto.randomUUID(),a,JSON.stringify(session),crypto.randomUUID(),session.startedAt])).rejects.toThrow(/row-level security/);
    await asUser(a);
    expect((await db.query("update workout_sessions set revision=2 where id=$1 and revision=1 returning id", [session.id])).rows).toHaveLength(1);
    expect((await db.query("update workout_sessions set revision=3 where id=$1 and revision=1 returning id", [session.id])).rows).toHaveLength(0);
    await expect(db.query("insert into workout_sessions(id,user_id,status,snapshot,revision,last_mutation_id,started_at) values ($1,$2,'active',$3,1,$4,$5)", [crypto.randomUUID(),a,JSON.stringify(session),crypto.randomUUID(),session.startedAt])).rejects.toThrow(/duplicate key/);
    await db.exec("reset role");
  });
  it("limits attempts durably and allows quota RPC calls only from the service role", async () => {
    await asUser(a);
    await expect(db.query("select * from consume_request_limit($1,2,900)", ["a".repeat(64)])).rejects.toThrow(/permission denied/);
    await db.exec("reset role; set role service_role");
    expect((await db.query<{allowed:boolean}>("select * from consume_request_limit($1,2,900)", ["a".repeat(64)])).rows[0].allowed).toBe(true);
    expect((await db.query<{allowed:boolean}>("select * from consume_request_limit($1,2,900)", ["a".repeat(64)])).rows[0].allowed).toBe(true);
    expect((await db.query<{allowed:boolean}>("select * from consume_request_limit($1,2,900)", ["a".repeat(64)])).rows[0].allowed).toBe(false);
    await db.exec("reset role");
  });
});
