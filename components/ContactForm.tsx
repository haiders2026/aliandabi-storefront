"use client";

import { FormEvent, useState } from "react";

const SUBJECTS = ["General inquiry", "Order status", "Custom design", "Returns & exchanges", "Something else"];

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("failed");
      form.reset();
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="contact-form">
        <h3>Thank you.</h3>
        <p>Your message has been sent. A member of our team will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <label className="field">
        <span>Full name</span>
        <input name="name" type="text" required autoComplete="name" />
      </label>
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label className="field">
        <span>Phone (optional)</span>
        <input name="phone" type="tel" autoComplete="tel" />
      </label>
      <label className="field">
        <span>Subject</span>
        <select name="subject" defaultValue={SUBJECTS[0]}>
          {SUBJECTS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Message</span>
        <textarea name="message" rows={6} required />
      </label>
      {/* Spam trap: real visitors never see or fill this */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp" />
      <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
      <p className="muted">By submitting, you agree to be contacted about your inquiry.</p>
      {state === "error" && (
        <p className="form-error">Sorry, your message could not be sent. Please call us at (718) 440-9510.</p>
      )}
    </form>
  );
}
