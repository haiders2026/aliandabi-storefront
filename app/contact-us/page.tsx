import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Questions about a piece, an order or a custom design? Get in touch with the ali&abi team.",
};

const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL; // shown only if set in Vercel

export default function ContactPage() {
  return (
    <>
      <section className="band">
        <div className="container section center narrow">
          <p className="eyebrow">Get in touch</p>
          <h1>We&apos;d love to hear from you.</h1>
          <p>Our team can help with questions about a piece, an order, or a custom design.</p>
          <p>
            <a href="tel:+17184409510" className="btn btn-primary">
              Call (718) 440-9510
            </a>{" "}
            <a href="#message" className="btn">
              Send a message
            </a>
          </p>
        </div>
      </section>

      <section className="container section">
        <div className="contact-cards">
          <div>
            <h3>Call us</h3>
            <p>
              <a href="tel:+17184409510">(718) 440-9510</a>
            </p>
            <p className="muted">Mon–Fri, 9am–5pm ET</p>
          </div>
          {EMAIL && (
            <div>
              <h3>Email us</h3>
              <p>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </p>
              <p className="muted">We reply within one business day</p>
            </div>
          )}
          <div>
            <h3>Visit us</h3>
            <p>By appointment</p>
            <p className="muted">Address available on request</p>
          </div>
        </div>
      </section>

      <section id="message" className="container section contact-main">
        <div>
          <p className="eyebrow">Send a message</p>
          <h2>Tell us what you need.</h2>
          <p>Fill out the form and a member of our team will get back to you shortly.</p>
          <div className="contact-hours">
            <h3>Customer care hours</h3>
            <p>Monday–Friday</p>
            <p className="muted">9am–5pm ET</p>
          </div>
        </div>
        <ContactForm />
      </section>

      <section className="band">
        <div className="container section center narrow">
          <h2>Looking for something custom?</h2>
          <p>Share your idea with us and our master bench artisans will bring it to life.</p>
          <Link href="/custom-design" className="btn btn-primary">
            Start a custom design
          </Link>
        </div>
      </section>
    </>
  );
}
