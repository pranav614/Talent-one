"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type MessageCategory = "contact" | "hiring" | "jobs";
type MessageStatus = "New" | "Read" | "Archived";
type Audience = "Candidate" | "Employer";
type Message = {
  id: string;
  category: MessageCategory;
  audience: Audience;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  message: string;
  status: MessageStatus;
  created_at: string;
};

const categories: { id: MessageCategory; label: string }[] = [
  { id: "contact", label: "Contact messages" },
  { id: "hiring", label: "Hiring requests" },
  { id: "jobs", label: "Job enquiries" },
];

export function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [category, setCategory] = useState<MessageCategory>("contact");
  const [audience, setAudience] = useState("Everyone");
  const [statusFilter, setStatusFilter] = useState("Active");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/messages", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) { router.replace("/admin"); return null; }
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Unable to load messages.");
        return payload as Message[];
      })
      .then((result) => { if (result) setMessages(result); })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load messages."))
      .finally(() => setLoading(false));
  }, [router]);

  const visibleMessages = useMemo(() => {
    const query = search.trim().toLowerCase();
    return messages.filter((message) => {
      const matchesSearch = !query ||
        `${message.name} ${message.email} ${message.company ?? ""} ${message.role ?? ""} ${message.message}`
          .toLowerCase().includes(query);
      const matchesStatus = statusFilter === "All" ||
        (statusFilter === "Active" ? message.status !== "Archived" : message.status === "Archived");
      return message.category === category && matchesSearch && matchesStatus &&
        (audience === "Everyone" || message.audience === audience);
    });
  }, [audience, category, messages, search, statusFilter]);

  async function changeStatus(message: Message, status: MessageStatus) {
    setUpdatingId(message.id); setError("");
    try {
      const response = await fetch("/api/admin/messages", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: message.id, status }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to update message.");
      setMessages((current) => current.map((item) => item.id === message.id ? payload as Message : item));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to update message.");
    } finally { setUpdatingId(null); }
  }

  return <>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div><p className="eyebrow">Admin · Supabase</p><h1 className="page-title mt-2">Messages</h1></div>
      <button className="button-secondary self-start sm:self-auto" onClick={() => { setSearch(""); setAudience("Everyone"); setStatusFilter("Active"); }} type="button">Clear filters</button>
    </div>

    <div className="mt-8 flex flex-wrap gap-3" role="tablist" aria-label="Message type">
      {categories.map((item) => <button aria-selected={category === item.id} className={`button-secondary ${category === item.id ? "button-selected" : ""}`} key={item.id} onClick={() => setCategory(item.id)} role="tab" type="button">{item.label}</button>)}
    </div>

    <div className="mt-6 grid gap-3 rounded-2xl border border-line bg-white p-3 md:grid-cols-3">
      <label className="sr-only" htmlFor="message-search">Search messages</label>
      <input className="field-control" id="message-search" onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email or message" value={search} />
      <label className="sr-only" htmlFor="message-audience">Filter by audience</label>
      <select className="field-control" id="message-audience" onChange={(event) => setAudience(event.target.value)} value={audience}><option>Everyone</option><option>Candidate</option><option>Employer</option></select>
      <label className="sr-only" htmlFor="message-status">Filter by status</label>
      <select className="field-control" id="message-status" onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}><option>Active</option><option>Archived</option><option>All</option></select>
    </div>

    {error ? <p aria-live="polite" className="mt-5 text-sm text-red-700" role="alert">{error}</p> : null}
    <p className="mt-6 text-sm text-ink-muted" aria-live="polite">{loading ? "Loading messages…" : `${visibleMessages.length} ${visibleMessages.length === 1 ? "message" : "messages"}`}</p>
    {loading ? null : <ul className="mt-5 space-y-5">
      {visibleMessages.map((message) => <li className="surface-card flex flex-col gap-5 p-5 sm:p-7" key={message.id}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div>
            <div className="flex flex-wrap items-center gap-3"><h2 className="text-xl font-bold text-ink">{message.name}</h2><span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-deep">{message.status}</span></div>
            <p className="mt-1 text-ink-muted"><a className="hover:text-brand" href={`mailto:${message.email}`}>{message.email}</a> · {new Intl.DateTimeFormat("en-AU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(message.created_at))}</p>
            {(message.company || message.role) ? <p className="mt-1 text-sm text-ink-muted">{[message.company, message.role].filter(Boolean).join(" · ")}</p> : null}
            <p className="mt-4 whitespace-pre-wrap leading-7 text-ink">{message.message}</p>
          </div>
          <span className="h-fit w-fit rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-deep">{message.audience}</span>
        </div>
        <div className="flex flex-wrap gap-3 border-t border-line pt-4">
          {message.status === "New" ? <button className="button-secondary px-4 py-2" disabled={updatingId === message.id} onClick={() => changeStatus(message, "Read")} type="button">Mark as read</button> : null}
          {message.status === "Read" ? <button className="button-secondary px-4 py-2" disabled={updatingId === message.id} onClick={() => changeStatus(message, "New")} type="button">Mark as new</button> : null}
          {message.status !== "Archived" ? <button className="button-secondary px-4 py-2" disabled={updatingId === message.id} onClick={() => changeStatus(message, "Archived")} type="button">Archive</button> : <button className="button-secondary px-4 py-2" disabled={updatingId === message.id} onClick={() => changeStatus(message, "New")} type="button">Restore</button>}
        </div>
      </li>)}
      {!visibleMessages.length ? <li className="surface-card px-6 py-10 text-center text-ink-muted">No messages match these filters.</li> : null}
    </ul>}
  </>;
}
