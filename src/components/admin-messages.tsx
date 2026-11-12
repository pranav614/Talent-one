"use client";

import { useMemo, useState } from "react";

type MessageCategory = "contact" | "hiring" | "jobs";
type Audience = "Candidate" | "Employer";

type DemoMessage = {
  id: number;
  name: string;
  email: string;
  date: string;
  preview: string;
  category: MessageCategory;
  audience: Audience;
};

const categories: { id: MessageCategory; label: string }[] = [
  { id: "contact", label: "Contact messages" },
  { id: "hiring", label: "Hiring requests" },
  { id: "jobs", label: "Job enquiries" },
];

const demoMessages: DemoMessage[] = [
  {
    id: 1,
    name: "Alex Morgan",
    email: "alex@example.com",
    date: "Today",
    preview: "I would love to hear more about engineering roles in Canberra.",
    category: "contact",
    audience: "Candidate",
  },
  {
    id: 2,
    name: "Jordan Lee",
    email: "jordan@example.com",
    date: "Yesterday",
    preview: "We are looking for support with an upcoming finance hire.",
    category: "contact",
    audience: "Employer",
  },
  {
    id: 3,
    name: "Sam Taylor",
    email: "sam@example.com",
    date: "12 Nov",
    preview: "Could you help us find a senior project manager?",
    category: "hiring",
    audience: "Employer",
  },
  {
    id: 4,
    name: "Riley Chen",
    email: "riley@example.com",
    date: "11 Nov",
    preview: "I am interested in applying for the Software Developer role.",
    category: "jobs",
    audience: "Candidate",
  },
];

export function AdminMessages() {
  const [category, setCategory] = useState<MessageCategory>("contact");
  const [audience, setAudience] = useState("Everyone");
  const [search, setSearch] = useState("");

  const visibleMessages = useMemo(() => {
    const query = search.trim().toLowerCase();
    return demoMessages.filter((message) => {
      const matchesSearch =
        !query ||
        `${message.name} ${message.email} ${message.preview}`
          .toLowerCase()
          .includes(query);
      return (
        message.category === category &&
        matchesSearch &&
        (audience === "Everyone" || message.audience === audience)
      );
    });
  }, [audience, category, search]);

  return (
    <>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Admin · Demo data</p>
          <h1 className="page-title mt-2">Messages</h1>
        </div>
        <button
          className="button-secondary self-start sm:self-auto"
          onClick={() => {
            setSearch("");
            setAudience("Everyone");
          }}
          type="button"
        >
          Clear filters
        </button>
      </div>

      <div className="mt-8 flex flex-wrap gap-3" role="tablist" aria-label="Message type">
        {categories.map((item) => (
          <button
            aria-selected={category === item.id}
            className={`button-secondary ${category === item.id ? "button-selected" : ""}`}
            key={item.id}
            onClick={() => setCategory(item.id)}
            role="tab"
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-line bg-white p-3 md:grid-cols-2">
        <label className="sr-only" htmlFor="message-search">
          Search by name or email
        </label>
        <input
          className="field-control"
          id="message-search"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or email"
          value={search}
        />
        <label className="sr-only" htmlFor="message-audience">
          Filter by audience
        </label>
        <select
          className="field-control"
          id="message-audience"
          onChange={(event) => setAudience(event.target.value)}
          value={audience}
        >
          <option>Everyone</option>
          <option>Candidate</option>
          <option>Employer</option>
        </select>
      </div>

      <p className="mt-6 text-sm text-ink-muted" aria-live="polite">
        {visibleMessages.length} demo{" "}
        {visibleMessages.length === 1 ? "message" : "messages"}
      </p>
      <ul className="mt-5 space-y-5">
        {visibleMessages.map((message) => (
          <li className="surface-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7" key={message.id}>
            <div>
              <h2 className="text-xl font-bold text-ink">{message.name}</h2>
              <p className="mt-1 text-ink-muted">
                {message.email} · {message.date}
              </p>
              <p className="mt-3 text-ink">{message.preview}</p>
            </div>
            <span className="w-fit rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-deep">
              {message.audience}
            </span>
          </li>
        ))}
        {!visibleMessages.length ? (
          <li className="surface-card px-6 py-10 text-center text-ink-muted">
            No demo messages match these filters.
          </li>
        ) : null}
      </ul>
    </>
  );
}
