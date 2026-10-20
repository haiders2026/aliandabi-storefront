import { NextResponse } from "next/server";

// Sends the contact form by email through Resend (https://resend.com).
// Vercel environment variables: RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL (an address on a domain verified in Resend).
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ ok: true }); // honeypot filled: pretend success

  const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
  const name = str(body.name, 120);
  const email = str(body.email, 200);
  const phone = str(body.phone, 60);
  const subject = str(body.subject, 120) || "General inquiry";
  const message = str(body.message, 5000);
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !message) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) return NextResponse.json({ ok: false, error: "not configured" }, { status: 500 });

  const text = `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\nSubject: ${subject}\n\n${message}`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], reply_to: email, subject: `[ali&abi website] ${subject}`, text }),
  });
  return NextResponse.json({ ok: res.ok }, { status: res.ok ? 200 : 502 });
}
