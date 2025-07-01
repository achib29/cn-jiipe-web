import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

// === Validasi Environment Variables ===
const resendKey = process.env.RESEND_API_KEY;
const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

if (!resendKey) {
  throw new Error("Missing RESEND_API_KEY");
}
if (!turnstileSecret) {
  throw new Error("Missing TURNSTILE_SECRET_KEY");
}

// === Inisialisasi Resend
const resend = new Resend(resendKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const {
    firstName, lastName, phone, email, company,
    power, water, gas, seaport,
    country, reason, industry, landPlot, timeline,
    cfTurnstileResponse
  } = req.body;

  // === Validasi token Turnstile
  if (!cfTurnstileResponse) {
    return res.status(400).json({ error: "Missing Turnstile token." });
  }

  const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: turnstileSecret,
      response: cfTurnstileResponse,
    }),
  });

  const verifyData = await verifyRes.json();
  if (!verifyData.success) {
    console.error("❌ Turnstile verification failed:", verifyData);
    return res.status(400).json({ error: "Failed Turnstile verification." });
  }

  try {
    // === Kirim Email
    await resend.emails.send({
      from: "cn.jiipe@jiipe.com",
      to: ["abdul.khasib@bkms.jiipe.co.id"],
      subject: "New Contact Inquiry",
      html: `
        <h2>New Inquiry Received</h2>
        <table border="1" cellspacing="0" cellpadding="6" style="border-collapse: collapse;">
          <tr><td><strong>Name</strong></td><td>${firstName} ${lastName}</td></tr>
          <tr><td><strong>Email</strong></td><td>${email}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${phone}</td></tr>
          <tr><td><strong>Company</strong></td><td>${company}</td></tr>
          <tr><td><strong>Country</strong></td><td>${country}</td></tr>
          <tr><td><strong>Reason</strong></td><td>${reason}</td></tr>
          <tr><td><strong>Industry</strong></td><td>${industry}</td></tr>
          <tr><td><strong>Land Plot</strong></td><td>${landPlot} Ha</td></tr>
          <tr><td><strong>Timeline</strong></td><td>${timeline}</td></tr>
          <tr><td><strong>Power</strong></td><td>${power} MW</td></tr>
          <tr><td><strong>Water</strong></td><td>${water} m³/day</td></tr>
          <tr><td><strong>Gas</strong></td><td>${gas} MMBTU/annum</td></tr>
          <tr><td><strong>Seaport</strong></td><td>${seaport} Tons/year</td></tr>
        </table>
      `,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Submission failed:", err);
    res.status(500).json({ success: false, error: "Failed to process inquiry" });
  }
}
