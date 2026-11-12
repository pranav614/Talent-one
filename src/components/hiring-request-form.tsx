"use client";

import { useState, type FormEvent } from "react";
import { DemoNotice } from "@/components/demo-notice";

export function HiringRequestForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <form
      className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="field-label text-white" htmlFor="hiring-company">
          Company
        </label>
        <input
          className="field-control"
          id="hiring-company"
          name="company"
          required
        />
      </div>
      <div>
        <label className="field-label text-white" htmlFor="hiring-email">
          Contact email
        </label>
        <input
          className="field-control"
          id="hiring-email"
          name="email"
          required
          type="email"
        />
      </div>
      <div>
        <label className="field-label text-white" htmlFor="hiring-role">
          Role you are hiring
        </label>
        <input
          className="field-control"
          id="hiring-role"
          name="role"
          required
        />
      </div>
      <div className="md:col-span-2 xl:col-span-3">
        <button className="button-primary" type="submit">
          Send request
        </button>
        {submitted ? (
          <DemoNotice>
            This demo request was not sent or stored. Connect a backend to
            receive hiring enquiries.
          </DemoNotice>
        ) : null}
      </div>
    </form>
  );
}
