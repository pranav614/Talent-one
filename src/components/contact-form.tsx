"use client";

import { useState, type FormEvent } from "react";
import { DemoNotice } from "@/components/demo-notice";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <form className="surface-card space-y-5 p-6 sm:p-8" onSubmit={handleSubmit}>
      <div>
        <label className="field-label" htmlFor="contact-name">
          Name
        </label>
        <input
          autoComplete="name"
          className="field-control"
          id="contact-name"
          name="name"
          required
        />
      </div>
      <div>
        <label className="field-label" htmlFor="contact-email">
          Email
        </label>
        <input
          autoComplete="email"
          className="field-control"
          id="contact-email"
          name="email"
          required
          type="email"
        />
      </div>
      <div>
        <label className="field-label" htmlFor="contact-type">
          I am a
        </label>
        <select className="field-control" id="contact-type" name="type">
          <option>Candidate</option>
          <option>Employer</option>
        </select>
      </div>
      <div>
        <label className="field-label" htmlFor="contact-message">
          Message
        </label>
        <textarea
          className="field-control min-h-36 resize-y"
          id="contact-message"
          name="message"
          required
          rows={5}
        />
      </div>
      <button className="button-primary" type="submit">
        Send message
      </button>
      {submitted ? (
        <DemoNotice>
          This demo form is ready, but messages are not sent or stored yet.
        </DemoNotice>
      ) : null}
    </form>
  );
}
