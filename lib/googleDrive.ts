import { google } from "googleapis";
import fs from "fs";

const KEYFILEPATH = "google-credentials.json";
const SCOPES = ["https://www.googleapis.com/auth/drive.file"];

export const uploadToDrive = async (filePath: string, fileName: string, folderId: string) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });

  const driveService = google.drive({ version: "v3", auth });

  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };

  const media = {
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    body: fs.createReadStream(filePath),
  };

  const response = await driveService.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: "id, webViewLink, webContentLink",
  });

  return response.data;
};
