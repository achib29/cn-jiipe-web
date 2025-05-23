import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { firstName, lastName, phone, email, company, power, water, gas, seaport } = req.body;

  try {
    await resend.emails.send({
      from: "cn.jiipe@jiipe.com",
      to: ["abdul.khasib@bkms.jiipe.co.id"],
      subject: "New Contact Inquiry",
      html: `
        <h2>New Inquiry</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Power:</strong> ${power}</p>
        <p><strong>Water:</strong> ${water}</p>
        <p><strong>Gas:</strong> ${gas}</p>
        <p><strong>Seaport:</strong> ${seaport}</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    res.status(500).json({ success: false });
  }
}
