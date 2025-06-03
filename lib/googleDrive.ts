import { google } from "googleapis";
import { JWT } from "google-auth-library";
import fs from "fs";

// Inisialisasi auth dari ENV
const auth = new JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL!,
  key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

export const uploadToDrive = async (filePath: string, fileName: string, folderId: string) => {
  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    body: fs.createReadStream(filePath),
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id, webViewLink, webContentLink",
  });

  return response.data;
};
