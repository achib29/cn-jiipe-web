import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
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
    const buffer = new Uint8Array(arrayBuffer);

    // Create the brochure directory if it doesn't exist
    const publicDir = path.join(process.cwd(), "public", "brochure");
    await mkdir(publicDir, { recursive: true });

    // The name we are enforcing from the CMS request
    const filename = "cn-jiipe.pdf";
    const filePath = path.join(publicDir, filename);

    // Write file to public/brochure/cn-jiipe.pdf
    await writeFile(filePath, buffer);

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
