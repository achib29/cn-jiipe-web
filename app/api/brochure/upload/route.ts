import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

async function ensureBrochureTable() {
  await pool.query(`
      CREATE TABLE IF NOT EXISTS brochures (
          id INT PRIMARY KEY,
          filename VARCHAR(255) NOT NULL,
          mime_type VARCHAR(100) NOT NULL,
          data LONGBLOB NOT NULL,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
}

export async function POST(req: NextRequest) {
  try {
    await ensureBrochureTable();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Only allow PDF files
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save/Update strictly at ID 1
    const filename = "cn-jiipe.pdf";
    await pool.query(
      `INSERT INTO brochures (id, filename, mime_type, data) 
       VALUES (1, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE filename=VALUES(filename), mime_type=VALUES(mime_type), data=VALUES(data)`,
      [filename, file.type, buffer]
    );

    return NextResponse.json({
      success: true,
      message: "Brochure updated successfully",
      url: `/brochure/${filename}`,
    });
  } catch (error) {
    console.error("Brochure upload failed:", error);
    return NextResponse.json({ error: "Failed to upload brochure" }, { status: 500 });
  }
}
