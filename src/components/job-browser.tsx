"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { jobTypes, type Job, sectors } from "@/lib/jobs";

export function JobBrowser() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [sector, setSector] = useState("");
  const [type, setType] = useState("");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/jobs")
      .then(async (response) => {
        if (!response.ok) throw new Error("Jobs are temporarily unavailable.");
        return response.json() as Promise<Job[]>;
      })
      .then(setJobs)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load jobs."))
      .finally(() => setLoading(false));
  }, []);

  const visibleJobs = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const normalizedLocation = location.trim().toLowerCase();

    return jobs.filter((job) => {
      if (job.status !== "Live") return false;
      const matchesKeyword =
        !normalizedKeyword ||
        `${job.title} ${job.company} ${job.sector}`
          .toLowerCase()
          .includes(normalizedKeyword);
      const matchesLocation =
        !normalizedLocation ||
        job.location.toLowerCase().includes(normalizedLocation);
      return (
        matchesKeyword &&
        matchesLocation &&
        (!sector || job.sector === sector) &&
        (!type || job.type === type)
      );
    });
  }, [jobs, keyword, location, sector, type]);

  return (
    <div>
      <form
        className="grid gap-3 rounded-2xl border border-line bg-white p-3 shadow-sm lg:grid-cols-[1.2fr_1.2fr_1.2fr_1.2fr_auto]"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="sr-only" htmlFor="job-keyword">
          Keyword
        </label>
        <input
          className="field-control"
          id="job-keyword"
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Keyword"
          value={keyword}
        />
        <label className="sr-only" htmlFor="job-location">
          Location
        </label>
        <input
          className="field-control"
          id="job-location"
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Location"
          value={location}
        />
        <label className="sr-only" htmlFor="job-sector">
          Sector
        </label>
        <select
          className="field-control"
          id="job-sector"
          onChange={(event) => setSector(event.target.value)}
          value={sector}
        >
          <option value="">All sectors</option>
          {sectors.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="job-type">
          Job type
        </label>
        <select
          className="field-control"
          id="job-type"
          onChange={(event) => setType(event.target.value)}
          value={type}
        >
          <option value="">Any type</option>
          {jobTypes.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <button className="button-primary" type="submit">
          Search
        </button>
      </form>

      <p className="my-8 text-base text-ink-muted" aria-live="polite">
        {loading ? "Loading jobs…" : error || `${visibleJobs.length} ${visibleJobs.length === 1 ? "job" : "jobs"} found`}
      </p>

      {loading ? null : visibleJobs.length ? (
        <ul className="space-y-5">
          {visibleJobs.map((job) => {
            const isExpanded = expandedJob === job.id;
            return (
              <li className="surface-card p-5 sm:p-7" key={job.id}>
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                      {job.title}
                    </h2>
                    <p className="mt-1 text-base text-ink-muted sm:text-lg">
                      {job.company} · {job.location} · {job.type}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-deep">
                      {job.sector}
                    </span>
                    <button
                      aria-expanded={isExpanded}
                      className="button-secondary"
                      onClick={() =>
                        setExpandedJob(isExpanded ? null : job.id)
                      }
                      type="button"
                    >
                      {isExpanded ? "Hide role" : "View role"}
                    </button>
                  </div>
                </div>
                {isExpanded ? (
                  <div className="mt-5 border-t border-line pt-5">
                    <p className="max-w-3xl leading-7 text-ink-muted">
                      {job.description}
                    </p>
                    <Link
                      className="button-primary mt-5 inline-flex"
                      href="/contact"
                    >
                      Ask us about this role
                    </Link>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : error ? null : (
        <div className="surface-card px-6 py-12 text-center">
          <h2 className="text-xl font-bold text-ink">No roles match yet</h2>
          <p className="mt-2 text-ink-muted">
            Try broadening your search or clearing one of the filters.
          </p>
        </div>
      )}
    </div>
  );
}
