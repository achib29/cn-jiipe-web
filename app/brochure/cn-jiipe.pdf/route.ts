import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Check if table exists
    const [tables]: any = await pool.query("SHOW TABLES LIKE 'brochures'");
    if (tables.length === 0) {
      return new NextResponse("Brochure not found", { status: 404 });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT data, mime_type FROM brochures WHERE id = 1 LIMIT 1"
    );

    if (rows.length === 0) {
      return new NextResponse("Brochure not found", { status: 404 });
    }

    const pdfData = rows[0].data;
    const mimeType = rows[0].mime_type;

    return new NextResponse(pdfData, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Content-Disposition": 'inline; filename="cn-jiipe.pdf"',
      },
    });
  } catch (error) {
    console.error("Brochure download error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
