"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Upload, CheckCircle, Copy, Check } from "lucide-react";

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

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  const copyUrl = (text: string, type: 'link' | 'html') => {
    navigator.clipboard.writeText(text);
    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  const brochureUrl = "/brochure/cn-jiipe.pdf";
  const brochureHtml = `<a href="/brochure/cn-jiipe.pdf" data-track="download_brochure" class="btn-cta" target="_blank" rel="noopener noreferrer">Download Brochure</a>`;

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

        {/* Copy Link Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Brochure Links</h3>
          <p className="text-gray-500 text-sm mb-6">
            Gunakan Link atau kode HTML di bawah ini untuk menyisipkan tombol Download Brochure yang otomatis tertracking ke Google Analytics pada artikel manapun.
          </p>
          
          <div className="space-y-4">
            {/* Raw URL */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 uppercase">Direct Link URL</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={brochureUrl} 
                  className="flex-grow p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-600 font-mono text-sm"
                />
                <button
                  onClick={() => copyUrl(brochureUrl, 'link')}
                  className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-3 rounded-lg font-bold shadow-md transition-all shrink-0 w-32 justify-center"
                >
                  {copiedLink ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy URL</>}
                </button>
              </div>
            </div>

            {/* HTML Snippet */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-700 uppercase">Raw HTML Button (Untuk paste via Code View)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={brochureHtml} 
                  className="flex-grow p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none text-gray-600 font-mono text-sm"
                />
                <button
                  onClick={() => copyUrl(brochureHtml, 'html')}
                  className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-3 rounded-lg font-bold shadow-md transition-all shrink-0 w-32 justify-center"
                >
                  {copiedHtml ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy HTML</>}
                </button>
              </div>
              <p className="text-[11px] text-gray-400">Atribut <code className="bg-gray-100 text-red-500 rounded px-1">data-track="download_brochure"</code> WAJIB disertakan agar jumlah download tercatat secara spesifik untuk masing-masing artikel.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
