import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import OpenAI from "openai";

// === Validasi Env ===
const resendKey = process.env.RESEND_API_KEY;
const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!resendKey) throw new Error("Missing RESEND_API_KEY");
if (!turnstileSecret) throw new Error("Missing TURNSTILE_SECRET_KEY");
if (!openaiKey) throw new Error("Missing OPENAI_API_KEY");

const resend = new Resend(resendKey);
const openai = new OpenAI({ apiKey: openaiKey });

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
  if (!isLocal && !cfTurnstileResponse) {
    return res.status(400).json({ error: "Missing Turnstile token." });
  }

  if (!isLocal) {
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

  // === OpenAI Analysis ===
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
    const aiRes = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
      ],
      max_tokens: 250,
      temperature: 0.2
    });
    aiSummary = aiRes.choices?.[0]?.message?.content?.trim() || "";
  } catch (err) {
    aiSummary = "AI analysis is unavailable at the moment.";
    console.error("OpenAI API error:", err);
  }

  console.log("🔍 AI Summary:", aiSummary);

  // === Email Template ===
  const logoUrl = "https://jiipe.com/logo-jiipe.png"; // ganti sesuai
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 24px 0;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); overflow: hidden;">
        <div style="padding: 32px;">
          <div style="margin-bottom: 24px; font-size:1.08rem;">
            Dear Sir/Madam,<br>
            Please find below the details of a new inquiry received from the JIIPE Baidu Ads Landing Page.
          </div>
          <div style="margin-bottom: 18px; background: #f4f4f4; border-left: 4px solid #b1060f; padding: 12px 18px; font-size:1.04rem;">
            <b>AI Summary & Company Analysis:</b><br>
            ${aiSummary}
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
            Tim Branding & Communication<br><br>
            <img src="${logoUrl}" alt="JIIPE Logo" style="height:36px;margin-bottom:18px;margin-top:2px;"><br>
            <div style="margin-bottom: 6px;"><b>PT. Berkah Kawasan Manyar Sejahtera</b></div>
            Jl. Raya Manyar KM. 11 – Gresik, East Java 61151<br>
            T +623198540999
          </div>
          <div style="font-size:0.89rem; color:#888; margin-top: 24px; margin-bottom:0; font-style:italic;">
            This electronic mail and/or any files transmitted with it may contain confidential or copyright information of PT. Berkah Kawasan Manyar Sejahtera...
          </div>
        </div>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "cn.jiipe@jiipe.com",
      to: ["abdul.khasib@bkms.jiipe.co.id"
      ],
      subject: `New Contact Inquiry Baidu Ads from "${company}"`,
      html,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Submission failed:", err);
    res.status(500).json({ success: false, error: "Failed to process inquiry" });
  }
}
