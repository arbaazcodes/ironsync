"use client";
import { useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase/client";
export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  return <main className="mx-auto max-w-md p-6 py-20 space-y-6">
    <h1 className="text-2xl font-bold">Choose a new password</h1>
    {done ? <Link href="/dashboard">Password updated. Open your workouts →</Link> :
      <form className="space-y-4" onSubmit={async event => {
        event.preventDefault(); setBusy(true); setMessage("");
        try {
          const client = getSupabase(); if (!client) throw new Error("Account service unavailable.");
          const { data: { user }, error } = await client.auth.getUser();
          if (error || !user) throw new Error("Open a valid password reset link from your email first.");
          const result = await client.auth.updateUser({ password });
          if (result.error) throw result.error;
          setDone(true);
        } catch (error) { setMessage(error instanceof Error ? error.message : "Could not update password."); }
        finally { setBusy(false); }
      }}>
        <label className="block">New password<input type="password" autoComplete="new-password" required minLength={12} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-surface p-3" /></label>
        <p className="text-sm">Use at least 12 characters.</p>
        {message && <p role="alert">{message}</p>}
        <button disabled={busy} className="rounded-xl bg-accent px-6 py-3 text-black">{busy ? "Saving…" : "Update password"}</button>
      </form>}
  </main>;
}
