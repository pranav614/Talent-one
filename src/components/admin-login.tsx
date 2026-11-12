"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function AdminLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to sign in.");
      router.replace("/admin/jobs");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in.");
    } finally { setBusy(false); }
  }

  return <div className="mx-auto max-w-md py-8"><section className="surface-card-plain p-7 sm:p-10">
    <p className="eyebrow">Talent One · Admin</p>
    <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink">Admin access</h1>
    <p className="mt-4 leading-7 text-ink-muted">Enter your PIN to view messages.</p>
    <form className="mt-7 space-y-5" onSubmit={submit}>
      <div><label className="field-label" htmlFor="admin-pin">PIN</label><input autoComplete="current-password" className="field-control" id="admin-pin" inputMode="numeric" maxLength={16} minLength={4} onChange={(event) => setPin(event.target.value)} pattern="[0-9]{4,16}" placeholder="Enter PIN" required type="password" value={pin} /></div>
      <button className="button-primary" disabled={busy} type="submit">{busy ? "Unlocking…" : "Unlock"}</button>
      {error ? <p aria-live="polite" className="text-sm text-red-700" role="alert">{error}</p> : null}
    </form>
  </section></div>;
}
