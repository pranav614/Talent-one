"use client";

import { useState, type FormEvent } from "react";

export function ContactForm({ jobTitle }: { jobTitle?: string }) {
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setSending(true); setError(""); setNotice("");
    try {
      const text = String(fields.get("message") ?? "").trim();
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: jobTitle ? "jobs" : "contact",
          audience: fields.get("audience"),
          name: fields.get("name"),
          email: fields.get("email"),
          role: jobTitle || null,
          message: jobTitle ? `Enquiry about ${jobTitle}\n\n${text}` : text,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Your message could not be sent.");
      form.reset();
      setNotice("Thanks — your message has been sent.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Your message could not be sent.");
    } finally { setSending(false); }
  }

  return (
    <form className="surface-card space-y-5 p-6 sm:p-8" onSubmit={handleSubmit}>
      {jobTitle ? <p className="rounded-lg bg-brand-soft px-4 py-3 text-sm text-brand-deep">Enquiring about: <strong>{jobTitle}</strong></p> : null}
      <div><label className="field-label" htmlFor="contact-name">Name</label><input autoComplete="name" className="field-control" id="contact-name" maxLength={160} name="name" required /></div>
      <div><label className="field-label" htmlFor="contact-email">Email</label><input autoComplete="email" className="field-control" id="contact-email" maxLength={320} name="email" required type="email" /></div>
      <div><label className="field-label" htmlFor="contact-audience">I am a</label><select className="field-control" id="contact-audience" name="audience"><option>Candidate</option><option>Employer</option></select></div>
      <div><label className="field-label" htmlFor="contact-message">Message</label><textarea className="field-control min-h-36 resize-y" id="contact-message" maxLength={10000} name="message" required rows={5} /></div>
      <button className="button-primary" disabled={sending} type="submit">{sending ? "Sending…" : "Send message"}</button>
      {notice ? <p aria-live="polite" className="rounded-lg border border-brand/20 bg-brand-soft px-4 py-3 text-sm text-brand-deep" role="status">{notice}</p> : null}
      {error ? <p aria-live="polite" className="text-sm text-red-700" role="alert">{error}</p> : null}
    </form>
  );
}
