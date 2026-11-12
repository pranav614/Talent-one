"use client";

import { useState, type FormEvent } from "react";

export function HiringRequestForm() {
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setSending(true); setError(""); setNotice("");
    const company = String(fields.get("company") ?? "").trim();
    const role = String(fields.get("role") ?? "").trim();
    const details = String(fields.get("message") ?? "").trim();
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "hiring",
          audience: "Employer",
          name: company,
          company,
          email: fields.get("email"),
          role,
          message: details || `Hiring request for ${role}.`,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your request could not be sent.");
      form.reset();
      setNotice("Thanks — your hiring request has been sent.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Your request could not be sent.");
    } finally { setSending(false); }
  }

  return (
    <form className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" onSubmit={handleSubmit}>
      <div><label className="field-label text-white" htmlFor="hiring-company">Company</label><input className="field-control" id="hiring-company" maxLength={160} name="company" required /></div>
      <div><label className="field-label text-white" htmlFor="hiring-email">Contact email</label><input autoComplete="email" className="field-control" id="hiring-email" maxLength={320} name="email" required type="email" /></div>
      <div><label className="field-label text-white" htmlFor="hiring-role">Role you are hiring</label><input className="field-control" id="hiring-role" maxLength={160} name="role" required /></div>
      <div className="md:col-span-2 xl:col-span-3"><label className="field-label text-white" htmlFor="hiring-message">Extra details (optional)</label><textarea className="field-control min-h-28 resize-y" id="hiring-message" maxLength={10000} name="message" rows={3} /></div>
      <div className="md:col-span-2 xl:col-span-3"><button className="button-primary" disabled={sending} type="submit">{sending ? "Sending…" : "Send request"}</button>
        {notice ? <p aria-live="polite" className="mt-4 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-sm text-white" role="status">{notice}</p> : null}
        {error ? <p aria-live="polite" className="mt-4 text-sm text-red-200" role="alert">{error}</p> : null}
      </div>
    </form>
  );
}
