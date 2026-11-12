"use client";

import { useRef, useState, type FormEvent } from "react";
import { jobTypes, sampleJobs, sectors, type Job, type JobStatus } from "@/lib/jobs";

type JobDraft = Omit<Job, "id">;

const emptyDraft: JobDraft = {
  title: "",
  company: "",
  location: "",
  type: jobTypes[0],
  sector: sectors[0],
  description: "",
  status: "Live",
};

export function AdminJobs() {
  const [jobs, setJobs] = useState(sampleJobs);
  const [draft, setDraft] = useState<JobDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function updateDraft<Key extends keyof JobDraft>(
    key: Key,
    value: JobDraft[Key],
  ) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function saveJob(status: JobStatus) {
    if (!formRef.current?.reportValidity()) return;

    const savedJob = { ...draft, status };
    if (editingId) {
      setJobs((current) =>
        current.map((job) =>
          job.id === editingId ? { ...savedJob, id: editingId } : job,
        ),
      );
    } else {
      setJobs((current) => [
        { ...savedJob, id: `demo-${Date.now()}` },
        ...current,
      ]);
    }

    setDraft(emptyDraft);
    setEditingId(null);
    setNotice("Changes are visible in this demo session only; nothing is stored.");
  }

  function editJob(job: Job) {
    const { id, ...jobDraft } = job;
    setDraft(jobDraft);
    setEditingId(id);
    setNotice("");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function removeJob(id: string) {
    setJobs((current) => current.filter((job) => job.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setDraft(emptyDraft);
    }
    setNotice("The sample job was removed from this demo session only.");
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Admin · Demo data</p>
          <h1 className="page-title mt-2">Jobs</h1>
        </div>
        <p className="max-w-xl text-sm leading-6 text-ink-muted">
          Add, edit, publish, and remove sample roles. Changes are held in
          browser memory and reset when this page is refreshed.
        </p>
      </div>

      <div className="mt-8 grid items-start gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <form
          className="surface-card space-y-5 p-5 sm:p-7"
          onSubmit={handleFormSubmit}
          ref={formRef}
        >
          <h2 className="text-2xl font-bold text-ink">
            {editingId ? "Edit job" : "Add a job"}
          </h2>
          <div>
            <label className="field-label" htmlFor="admin-job-title">
              Job title
            </label>
            <input
              className="field-control"
              id="admin-job-title"
              onChange={(event) => updateDraft("title", event.target.value)}
              required
              value={draft.title}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="admin-job-company">
              Company
            </label>
            <input
              className="field-control"
              id="admin-job-company"
              onChange={(event) => updateDraft("company", event.target.value)}
              required
              value={draft.company}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="admin-job-location">
              Location
            </label>
            <input
              className="field-control"
              id="admin-job-location"
              onChange={(event) => updateDraft("location", event.target.value)}
              required
              value={draft.location}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="admin-job-type">
                Job type
              </label>
              <select
                className="field-control"
                id="admin-job-type"
                onChange={(event) => updateDraft("type", event.target.value)}
                value={draft.type}
              >
                {jobTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="admin-job-sector">
                Sector
              </label>
              <select
                className="field-control"
                id="admin-job-sector"
                onChange={(event) => updateDraft("sector", event.target.value)}
                value={draft.sector}
              >
                {sectors.map((sector) => (
                  <option key={sector}>{sector}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="admin-job-description">
              Description
            </label>
            <textarea
              className="field-control min-h-32 resize-y"
              id="admin-job-description"
              onChange={(event) =>
                updateDraft("description", event.target.value)
              }
              required
              value={draft.description}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              className="button-primary"
              onClick={() => saveJob("Live")}
              type="button"
            >
              {editingId ? "Publish changes" : "Publish job"}
            </button>
            <button
              className="button-secondary"
              onClick={() => saveJob("Draft")}
              type="button"
            >
              Save draft
            </button>
            {editingId ? (
              <button
                className="button-quiet"
                onClick={() => {
                  setEditingId(null);
                  setDraft(emptyDraft);
                  setNotice("");
                }}
                type="button"
              >
                Cancel
              </button>
            ) : null}
          </div>
          {notice ? (
            <p aria-live="polite" className="text-sm text-brand-deep" role="status">
              {notice}
            </p>
          ) : null}
        </form>

        <section aria-labelledby="job-list-heading">
          <h2 className="mb-5 text-2xl font-bold text-ink" id="job-list-heading">
            Your jobs <span className="text-ink-muted">({jobs.length})</span>
          </h2>
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li className="surface-card p-5 sm:p-6" key={job.id}>
                <h3 className="text-lg font-bold text-ink">{job.title}</h3>
                <p className="mt-1 text-ink-muted">
                  {job.company} · {job.location} · {job.type}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand-deep">
                    {job.status}
                  </span>
                  <button
                    className="button-secondary px-4 py-2"
                    onClick={() => editJob(job)}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className="button-secondary px-4 py-2"
                    onClick={() => removeJob(job.id)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
            {!jobs.length ? (
              <li className="surface-card px-5 py-8 text-center text-ink-muted">
                There are no sample jobs.
              </li>
            ) : null}
          </ul>
        </section>
      </div>
    </>
  );
}
