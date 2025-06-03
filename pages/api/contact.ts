import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { google } from "googleapis";
import { JWT } from "google-auth-library";
import xlsx from "node-xlsx";
import fs from "fs";
import path from "path";

// Setup Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Setup Google Drive auth
const auth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
  key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const {
    firstName, lastName, phone, email, company,
    power, water, gas, seaport,
    country, reason, industry, landPlot, timeline
  } = req.body;

  // Generate Excel data
  const data = [
    ["Field", "Value"],
    ["Name", `${firstName} ${lastName}`],
    ["Email", email],
    ["Phone", phone],
    ["Company", company],
    ["Country", country],
    ["Reason", reason],
    ["Industry", industry],
    ["Land Plot", `${landPlot} Ha`],
    ["Timeline", timeline],
    ["Power", `${power} MW`],
    ["Water", `${water} m³/day`],
    ["Gas", `${gas} MMBTU/annum`],
    ["Seaport", `${seaport} Tons/year`],
  ];

  const buffer = xlsx.build([{ name: "Inquiry", data, options: {} }]);
  const tempPath = path.join("/tmp", `inquiry-${Date.now()}.xlsx`);
  fs.writeFileSync(tempPath, buffer);

  try {
    // Upload to Google Drive
    const driveRes = await drive.files.create({
      requestBody: {
        name: path.basename(tempPath),
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
      },
      media: {
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        body: fs.createReadStream(tempPath), // ✅ HARUS STREAM
      },
      fields: "id, webViewLink",
    });

    const fileLink = driveRes.data.webViewLink;

    // Kirim email
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
          <tr><td><strong>Excel File</strong></td><td><a href="${fileLink}" target="_blank">Download here</a></td></tr>
        </table>
      `,
    });

    res.status(200).json({ success: true, fileLink });
  } catch (err) {
    console.error("Submission failed:", err);
    res.status(500).json({ success: false, error: err });
  } finally {
  }
}
  