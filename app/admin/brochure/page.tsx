"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Upload, CheckCircle } from "lucide-react";

export default function BrochureAdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setMessage({ type: "error", text: "Please select a valid PDF file." });
      return;
    }

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/brochure/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Brochure updated successfully! The new file will be served at /brochure/cn-jiipe.pdf" });
        setFile(null); // Reset form
      } else {
        setMessage({ type: "error", text: data.error || "Failed to upload brochure." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred during upload." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/admin">
            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium mb-4">
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Manage Brochure</h1>
          <p className="text-gray-500 mt-2">Upload a new PDF to replace the existing /brochure/cn-jiipe.pdf file.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 bg-gray-50">
            <FileText className="text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-800 mb-2">Upload New Brochure</h3>
            <p className="text-gray-500 text-sm mb-6 text-center max-w-md">
              The file must be a PDF format. Uploading a new file will automatically 
              replace the old brochure.
            </p>

            <input
              type="file"
              id="brochure-upload"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            {!file ? (
              <label
                htmlFor="brochure-upload"
                className="cursor-pointer flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all"
              >
                <Upload size={18} /> Choose PDF File
              </label>
            ) : (
              <div className="flex w-full max-w-sm items-center justify-between bg-white border border-gray-200 p-3 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                    <FileText size={20} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-gray-400 hover:text-red-500 transition-colors px-2"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {message && (
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  message.type === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {message.type === "success" ? <CheckCircle className="shrink-0 mt-0.5" size={18} /> : <FileText className="shrink-0 mt-0.5" size={18} />}
                <span className="text-sm font-medium">{message.text}</span>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-md transition-all ${
                  !file || uploading
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-900 hover:bg-black text-white"
                }`}
              >
                {uploading ? (
                  <>Uploading...</>
                ) : (
                  <>
                    <Upload size={18} /> Upload and Replace
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
