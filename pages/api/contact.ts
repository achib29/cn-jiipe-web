import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import OpenAI from "openai";
import pool from "../../lib/db";
import { RowDataPacket } from "mysql2";

// === Validasi Env ===
const resendKey = process.env.RESEND_API_KEY;
const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!resendKey) throw new Error("Missing RESEND_API_KEY");
if (!turnstileSecret) throw new Error("Missing TURNSTILE_SECRET_KEY");
if (!openaiKey) throw new Error("Missing OPENAI_API_KEY");

const resend = new Resend(resendKey);
const openai = new OpenAI({ apiKey: openaiKey });

// ─── Helper: fetch with AbortController timeout ────────────────────────────
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return promise
    .then((v) => { clearTimeout(timer); return v; })
    .catch((err) => {
      clearTimeout(timer);
      if (err.name === "AbortError" || controller.signal.aborted) {
        throw new Error(`${label} timed out after ${ms}ms`);
      }
      throw err;
    });
}

// ─── Helper: send email with a 5-second timeout ───────────────────────────
async function sendEmail(payload: Parameters<typeof resend.emails.send>[0]): Promise<void> {
  await withTimeout(resend.emails.send(payload), 5_000, "Resend");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const {
    firstName, lastName, phone, email, company,
    power, water, gas, seaport,
    country, reason, reasonOther, industry, landPlot, timeline,
    cfTurnstileResponse
  } = req.body;

  const isLocal = req.headers.host?.includes("localhost");

  console.log("✅ Inquiry Received:", req.body);

  // === Validasi token Turnstile ===
  if (!isLocal && cfTurnstileResponse !== "bypass" && !cfTurnstileResponse) {
    return res.status(400).json({ error: "Missing Turnstile token." });
  }

  if (!isLocal && cfTurnstileResponse !== "bypass") {
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
  }

  const reasonDisplay = reason === "Other" && reasonOther ? `Other (${reasonOther})` : reason;

  // === Logo + shared email HTML builder =====================================
  const logoUrl = "https://jiipe.com/logo-jiipe.png";

  // Builds the notification email. AI summary is inserted later if available.
  function buildNotificationHtml(aiSummary: string): string {
    return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 24px 0;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); overflow: hidden;">
        <div style="padding: 32px;">
          <div style="margin-bottom: 24px; font-size:1.08rem;">
            Dear Sir/Madam,<br>
            Please find below the details of a new inquiry received from the JIIPE Baidu Ads Landing Page.
          </div>
          <div style="margin-bottom: 18px; background: #f4f4f4; border-left: 4px solid #b1060f; padding: 12px 18px; font-size:1.04rem;">
            <b>AI Summary &amp; Company Analysis:</b><br>
            ${aiSummary || "AI analysis will follow in a separate update."}
          </div>
          <table width="100%" style="border-collapse: collapse; font-size: 1.02rem;">
            <tr><td style="padding:10px 8px;font-weight:600;color:#b1060f;">Name</td><td style="padding:10px 8px;">${firstName} ${lastName}</td></tr>
            <tr><td style="padding:10px 8px;font-weight:600;color:#b1060f;">Email</td><td style="padding:10px 8px;">${email}</td></tr>
            <tr><td style="padding:10px 8px;font-weight:600;color:#b1060f;">Phone</td><td style="padding:10px 8px;">${phone}</td></tr>
            <tr><td style="padding:10px 8px;font-weight:600;color:#b1060f;">Company</td><td style="padding:10px 8px;">${company}</td></tr>
            <tr><td style="padding:10px 8px;font-weight:600;color:#b1060f;">Country</td><td style="padding:10px 8px;">${country}</td></tr>
            <tr><td style="padding:10px 8px;font-weight:600;color:#b1060f;">Reason</td><td style="padding:10px 8px;">${reasonDisplay}</td></tr>
            <tr><td style="padding:10px 8px;font-weight:600;color:#b1060f;">Industry</td><td style="padding:10px 8px;">${industry}</td></tr>
            <tr><td style="padding:10px 8px;font-weight:600;color:#b1060f;">Land Plot</td><td style="padding:10px 8px;">${landPlot} Ha</td></tr>
            <tr><td style="padding:10px 8px;font-weight:600;color:#b1060f;">Timeline</td><td style="padding:10px 8px;">${timeline}</td></tr>
            <tr><td style="padding:10px 8px;font-weight:600;color:#b1060f;">Power</td><td style="padding:10px 8px;">${power} MW</td></tr>
            <tr><td style="padding:10px 8px;font-weight:600;color:#b1060f;">Water</td><td style="padding:10px 8px;">${water} m³/day</td></tr>
            <tr><td style="padding:10px 8px;font-weight:600;color:#b1060f;">Gas</td><td style="padding:10px 8px;">${gas} MMBTU/annum</td></tr>
            <tr><td style="padding:10px 8px;font-weight:600;color:#b1060f;">Seaport</td><td style="padding:10px 8px;">${seaport} Tons/year</td></tr>
          </table>
          <div style="border-top:1px solid #eee; margin:36px 0 16px 0"></div>
          <div style="font-size:1rem; color:#222; margin-top:10px;">
            <b>Regards</b><br/>
            Tim Branding &amp; Communication<br><br>
            <img src="${logoUrl}" alt="JIIPE Logo" style="height:36px;margin-bottom:18px;margin-top:2px;"><br>
            <div style="margin-bottom: 6px;"><b>PT. Berkah Kawasan Manyar Sejahtera</b></div>
            Jl. Raya Manyar KM. 11 – Gresik, East Java 61151
          </div>
          <div style="font-size:0.89rem; color:#888; margin-top: 24px; margin-bottom:0; font-style:italic;">
            This electronic mail and/or any files transmitted with it may contain confidential or copyright information of PT. Berkah Kawasan Manyar Sejahtera...
          </div>
        </div>
      </div>
    </div>
  `;
  }

  const autoResponderHtml = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 24px 0;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); overflow: hidden;">
        <div style="padding: 32px;">
          <div style="margin-bottom: 24px; font-size:1.08rem;">
            Dear <b>${firstName} ${lastName}</b>,<br><br>
            Thank you for considering JIIPE. We have successfully received your inquiry for <b>${company}</b>.<br>
            Our investment experts will contact you shortly.
          </div>
          <div style="border-top:1px solid #eee; margin:36px 0 16px 0"></div>
          <div style="font-size:1rem; color:#222; margin-top:10px;">
            <b>Warm Regards</b><br/>
            Investment Team<br><br>
            <img src="https://jiipe.com/logo-jiipe.png" alt="JIIPE Logo" style="height:36px;margin-bottom:18px;margin-top:2px;"><br>
            <div style="margin-bottom: 6px;"><b>PT. Berkah Kawasan Manyar Sejahtera</b></div>
            Jl. Raya Manyar KM. 11 – Gresik, East Java 61151
          </div>
          <div style="font-size:0.89rem; color:#888; margin-top: 24px; margin-bottom:0; font-style:italic;">
            This is an automated confirmation email. Please do not reply to this email address.
          </div>
        </div>
      </div>
    </div>
  `;

  try {
    // ── 1. Fetch target emails from DB ─────────────────────────────────────
    //   (runs first so we have the recipient list before sending)
    let targetEmails = ["abdul.khasib@bkms.jiipe.co.id", "donny.muchelly@bkms.jiipe.co.id"]; // Fallback
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT value_cn, value_en FROM site_content WHERE section = 'contact' AND field_key = 'rfi_emails' LIMIT 1"
      );
      if (rows && rows.length > 0) {
        const emailStr = rows[0].value_cn || rows[0].value_en || "";
        if (emailStr.trim()) {
          targetEmails = emailStr.split(",").map((e: string) => e.trim()).filter(Boolean);
        }
      }
    } catch (dbErr) {
      console.error("⚠️ Failed to fetch RFI emails from DB, using fallback:", dbErr);
    }

    // ── 2. Send notification + auto-responder emails IN PARALLEL ──────────
    //   Both sends have an individual 5-second AbortController timeout.
    //   We do NOT wait for OpenAI here — that runs after we respond.
    await Promise.all([
      sendEmail({
        from: "cn.jiipe@jiipe.com",
        to: targetEmails,
        subject: `New Contact Inquiry Baidu Ads from "${company}"`,
        html: buildNotificationHtml(""),  // AI summary injected in background later
      }),
      sendEmail({
        from: "JIIPE Investment Team <cn.jiipe@jiipe.com>",
        to: [email],
        subject: "We Have Received Your Inquiry - JIIPE",
        html: autoResponderHtml,
      }).catch((autoErr) => {
        // Auto-responder failure is non-critical — log and continue
        console.error("⚠️ Auto-responder failed (non-critical):", autoErr);
      }),
    ]);

    // ── 3. Respond to client immediately ──────────────────────────────────
    //   User sees thank-you overlay; spinner stops. All further work is
    //   background-only and does NOT affect the response time.
    res.status(200).json({ success: true });

    // ── 4. BACKGROUND: run OpenAI analysis and send a follow-up email ─────
    //   This runs AFTER res.status(200).json() — the Vercel function stays
    //   alive for maxDuration (30s) so this has time to complete.
    //   If it fails or times out (10s), we log silently.
    (async () => {
      const prompt = `
You are a professional business analyst. Analyze the following inquiry:
- Identify the company
- Explain what industry it operates in
- Comment whether the utility requests are reasonable for the industry and company profile
- Respond in clear English for management reporting. Keep it concise (max 5 lines), and note if anything seems unusual or suspicious.

DATA:
Company: ${company}
Country: ${country}
Industry: ${industry}
Power: ${power} MW
Water: ${water} m³/day
Gas: ${gas} MMBTU/annum
Seaport: ${seaport} Tons/year
Land Plot: ${landPlot} Ha
Timeline: ${timeline}
Reason: ${reasonDisplay}
`;

      let aiSummary = "";
      try {
        const controller = new AbortController();
        const aiTimer = setTimeout(() => controller.abort(), 10_000); // 10 s hard cap
        const aiRes = await openai.chat.completions.create(
          {
            model: "gpt-4o",
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: prompt }
            ],
            max_tokens: 250,
            temperature: 0.2
          },
          { signal: controller.signal }
        );
        clearTimeout(aiTimer);
        aiSummary = aiRes.choices?.[0]?.message?.content?.trim() || "";
        console.log("🔍 AI Summary:", aiSummary);
      } catch (aiErr) {
        console.error("⚠️ OpenAI background call failed (non-critical):", aiErr);
        return; // No follow-up email if AI fails
      }

      // Send a follow-up notification with the AI summary
      if (aiSummary) {
        try {
          await sendEmail({
            from: "cn.jiipe@jiipe.com",
            to: targetEmails,
            subject: `[AI Analysis] ${company} — JIIPE Inquiry`,
            html: buildNotificationHtml(aiSummary),
          });
        } catch (followUpErr) {
          console.error("⚠️ AI follow-up email failed (non-critical):", followUpErr);
        }
      }
    })();

  } catch (err) {
    console.error("❌ Main email send failed:", err);
    res.status(500).json({ success: false, error: "Failed to process inquiry" });
  }
}
