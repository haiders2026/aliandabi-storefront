import type { Metadata } from "next";
import Link from "next/link";
import { WC_PUBLIC_BASE } from "@/lib/woo";

export const metadata: Metadata = {
  title: "My Account",
  description: "Sign in or create your ali&abi account to track orders, save addresses and check out faster.",
};

const ACCOUNT = `${WC_PUBLIC_BASE}/my-account/`;

const PERKS = [
  ["Track your orders", "See the status of every order, from bench to doorstep."],
  ["Faster checkout", "Save your addresses and details for next time."],
  ["Order history", "Keep your receipts, warranties and certificates in one place."],
  ["Private access", "Be first to hear about limited custom drops."],
];

export default function AccountPage() {
  return (
    <>
      <section className="band">
        <div className="container section center narrow">
          <p className="eyebrow">Welcome</p>
          <h1>My Account</h1>
          <p>Sign in to manage your orders, or create an account in under a minute.</p>
        </div>
      </section>

      <section className="container section">
        <div className="account-cards">
          <div className="account-card account-card-dark">
            <p className="eyebrow">Returning customer</p>
            <h2>Sign in</h2>
            <p>Welcome back. Sign in with your email and password to see your orders and saved details.</p>
            <a href={ACCOUNT} className="btn btn-primary btn-block">
              Sign in
            </a>
            <p className="account-small">
              <a href={`${ACCOUNT}lost-password/`}>Forgot your password?</a>
            </p>
          </div>

          <div className="account-card">
            <p className="eyebrow">New to ali&amp;abi</p>
            <h2>Create an account</h2>
            <p>All you need is your email address. We&apos;ll send you a link to set your password.</p>
            <a href={ACCOUNT} className="btn btn-block">
              Create account
            </a>
            <p className="account-small muted">On the next page, use the Register box to get started.</p>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="container section">
          <header className="section-head">
            <h2>Why create an account?</h2>
          </header>
          <div className="trust">
            {PERKS.map(([title, text]) => (
              <div key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container section center">
        <p className="muted">
          Need help? <Link href="/contact-us">Contact us</Link> or call <a href="tel:+17184409510">(718) 440-9510</a>.
        </p>
      </section>
    </>
  );
}
