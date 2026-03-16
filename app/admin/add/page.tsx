"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Image as ImageIcon,
  X as XIcon,
  Loader2,
  ArrowLeft,
  Save,
  Flame,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";

// --- KOMPONEN MODAL / POPUP NOTIFIKASI ---
const NotificationModal = ({ isOpen, type, title, message, onClose }: any) => {
  if (!isOpen) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center transform transition-all animate-in zoom-in-95 duration-300 border border-gray-100">
        {/* Icon Animasi */}
        <div className="mb-6 flex justify-center">
          {isSuccess ? (
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center">
                <CheckCircle size={40} strokeWidth={3} />
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse opacity-75"></div>
              <div className="relative bg-red-100 text-red-600 w-20 h-20 rounded-full flex items-center justify-center">
                <AlertCircle size={40} strokeWidth={3} />
              </div>
            </div>
          )}
        </div>

        {/* Text Content */}
        <h3
          className={`text-2xl font-bold mb-2 ${isSuccess ? "text-gray-900" : "text-red-600"
            }`}
        >
          {title}
        </h3>
        <p className="text-gray-500 mb-8 leading-relaxed">{message}</p>

        {/* Button */}
        <button
          onClick={onClose}
          className={`w-full py-3.5 rounded-xl text-white font-bold shadow-lg transition-transform transform hover:scale-[1.02] active:scale-[0.98] ${isSuccess
            ? "bg-green-600 hover:bg-green-700 shadow-green-500/30"
            : "bg-red-600 hover:bg-red-700 shadow-red-500/30"
            }`}
        >
          {isSuccess ? "Kembali ke Dashboard" : "Coba Lagi"}
        </button>
      </div>
    </div>
  );
};

export default function AddNewsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit") ?? null;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // STATE UNTUK MODAL POPUP
  const [modal, setModal] = useState({
    isOpen: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
  });

  // State Form Data (EN)
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Industry News");
  const [status, setStatus] = useState("Published");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [publishDate, setPublishDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Chinese fields
  const [titleCn, setTitleCn] = useState("");
  const [summaryCn, setSummaryCn] = useState("");
  const [contentCn, setContentCn] = useState("");

  // Hot EN (pakai kolom is_hot & hot_priority)
  const [isHotEn, setIsHotEn] = useState(false);
  const [hotPriorityEn, setHotPriorityEn] = useState<number | null>(null);

  // Hot CN (pakai kolom is_hot_cn & hot_priority_cn)
  const [isHotCn, setIsHotCn] = useState(false);
  const [hotPriorityCn, setHotPriorityCn] = useState<number | null>(null);

  // Language toggle for editor
  const [activeLang, setActiveLang] = useState<"en" | "cn">("en");

  // Landing Page fields
  const [articleType, setArticleType] = useState<"news" | "landing">("news");
  const [ogImage, setOgImage] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");


  // --- LOAD DATA EDIT ---
  useEffect(() => {
    if (editId) {
      const fetchArticle = async () => {
        setFetching(true);
        try {
          const res = await fetch(`/api/articles/${editId}`);
          if (!res.ok) throw new Error("Failed to fetch article");
          const data = await res.json();

          // English
          setTitle(data.title || "");
          setCategory(data.category || "Industry News");
          setStatus(data.status || "Published");
          setSummary(data.summary || "");
          // Tiptap accepts raw HTML — no need to convert <br/> to \n
          setContent(data.content || "");
          setImagePreview(data.coverImage || null);

          // Chinese
          setTitleCn(data.title_cn || "");
          setSummaryCn(data.summary_cn || "");
          setContentCn(data.content_cn || "");

          // Hot EN
          setIsHotEn(data.is_hot ?? false);
          setHotPriorityEn(data.hot_priority ?? null);

          // Hot CN
          setIsHotCn(data.is_hot_cn ?? false);
          setHotPriorityCn(data.hot_priority_cn ?? null);

          // Landing page
          setArticleType(data.type === "landing" ? "landing" : "news");
          setOgImage(data.og_image || "");
          setSlug(data.slug || "");
          setCoverImageUrl(data.coverImage || "");


          if (data.date) {
            const dateObj = new Date(data.date);
            if (!isNaN(dateObj.getTime())) {
              setPublishDate(dateObj.toISOString().split("T")[0]);
            }
          }
        } catch (error: any) {
          console.error("Error fetching data:", error);
          setModal({
            isOpen: true,
            type: "error",
            title: "Gagal Memuat Data",
            message: "Tidak dapat mengambil data artikel dari server.",
          });
        }
        setFetching(false);
      };
      fetchArticle();
    }
  }, [editId]);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setModal({
          isOpen: true,
          type: "error",
          title: "File Terlalu Besar",
          message: "Ukuran gambar maksimal 2MB.",
        });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Upload image for body content (used by RichTextEditor)
  const handleBodyImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  };

  // --- SUBMIT DATA ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Data Belum Lengkap",
        message: "Judul dan konten artikel (EN) wajib diisi.",
      });
      return;
    }

    setLoading(true);

    try {
      let publicImageUrl =
        imagePreview || "https://via.placeholder.com/800x400";

      // Upload cover image if new file selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Failed to upload cover image");

        const uploadData = await uploadRes.json();
        publicImageUrl = uploadData.url;
      }

      const slugBase = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      const finalSlug = slug.trim() || slugBase;

      // Tiptap outputs clean HTML directly — no need to replace \n
      const finalContentEn = content;
      const finalContentCn = contentCn;

      const formattedDate = new Date(publishDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const articleData: any = {
        // English
        title,
        slug: finalSlug,
        category,
        status,
        summary,
        content: finalContentEn,
        coverImage: coverImageUrl || publicImageUrl,
        date: formattedDate,

        // Chinese (bisa kosong/null)
        title_cn: titleCn || null,
        summary_cn: summaryCn || null,
        content_cn: contentCn ? finalContentCn : null,

        // Hot EN
        is_hot: isHotEn,
        hot_priority: isHotEn ? hotPriorityEn : null,

        // Hot CN
        is_hot_cn: isHotCn,
        hot_priority_cn: isHotCn ? hotPriorityCn : null,

        // Landing page
        type: articleType,
        og_image: ogImage || null,
      };


      if (editId) {
        // UPDATE
        const res = await fetch(`/api/articles/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(articleData),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to update");
        }
      } else {
        // CREATE
        const res = await fetch("/api/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(articleData),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to create");
        }
      }

      // SUKSES! TAMPILKAN MODAL
      setModal({
        isOpen: true,
        type: "success",
        title: "Berhasil Disimpan!",
        message: editId
          ? "Artikel Anda telah berhasil diperbarui."
          : "Artikel baru telah berhasil diterbitkan ke website.",
      });
    } catch (error: any) {
      console.error("Error:", error);
      setModal({
        isOpen: true,
        type: "error",
        title: "Gagal Menyimpan",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fungsi menutup modal
  const handleCloseModal = () => {
    setModal({ ...modal, isOpen: false });
    if (modal.type === "success") {
      router.push("/admin");
    }
  };



  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-gray-500">
        <Loader2 size={40} className="animate-spin text-red-600 mb-4" />
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 relative">
      {/* MODAL */}
      <NotificationModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={handleCloseModal}
      />

      <div className="max-w-[1600px] mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-200 transition"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {editId ? "Edit Article" : "Write New Article"}
              </h1>
              <p className="text-gray-500">
                {editId
                  ? "Update existing content"
                  : "Create content for JIIPE Website"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex items-center gap-2 px-8 py-2 rounded-lg text-white font-bold shadow-md transition-all ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
                }`}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {loading
                ? "Saving..."
                : editId
                  ? "Update Article"
                  : "Publish Article"}
            </button>
          </div>
        </div>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
          {/* KOLOM KIRI: EDITOR */}
          <div className="lg:col-span-3 flex flex-col gap-4 h-full">
            {/* Title EN */}
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold p-4 bg-white border border-gray-200 rounded-xl focus:border-red-600 outline-none placeholder-gray-300 shadow-sm"
              placeholder="Enter Article Title Here (English)..."
            />
            {/* Title CN */}
            <input
              type="text"
              value={titleCn}
              onChange={(e) => setTitleCn(e.target.value)}
              className="w-full text-lg mt-2 p-3 bg-white border border-gray-200 rounded-xl focus:border-red-600 outline-none placeholder-gray-300 shadow-sm"
              placeholder="Chinese Title (用于 cn.jiipe.com)..."
            />

            {/* Language toggle tabs */}
            <div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm w-fit">
              <button
                type="button"
                onClick={() => setActiveLang("en")}
                className={`px-5 py-2.5 text-sm font-bold transition-colors ${
                  activeLang === "en" ? "bg-red-600 text-white" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                🇺🇸 English Content
              </button>
              <button
                type="button"
                onClick={() => setActiveLang("cn")}
                className={`px-5 py-2.5 text-sm font-bold transition-colors ${
                  activeLang === "cn" ? "bg-red-600 text-white" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                🇨🇳 Chinese Content
              </button>
            </div>

            {/* ToC Info for Landing Pages */}
            {articleType === "landing" && (
              <div className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2 text-xs text-blue-700">
                <span>📑</span>
                <span>
                  <b>Table of Contents</b> akan otomatis dibuat dari heading <code className="bg-blue-100 px-1 rounded">H2</code> dan <code className="bg-blue-100 px-1 rounded">H3</code>.
                </span>
              </div>
            )}

            {/* WYSIWYG Editor — EN */}
            <div className={`flex-grow ${activeLang === "en" ? "block" : "hidden"}`}>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Write English content here..."
                onImageUpload={handleBodyImageUpload}
              />
            </div>

            {/* WYSIWYG Editor — CN */}
            <div className={`flex-grow ${activeLang === "cn" ? "block" : "hidden"}`}>
              <RichTextEditor
                value={contentCn}
                onChange={setContentCn}
                placeholder="Write Chinese content here (用中文写内容)..."
                onImageUpload={handleBodyImageUpload}
              />
            </div>
          </div>

          {/* KOLOM KANAN: SETTINGS */}
          <div className="space-y-6 h-full overflow-y-auto pb-10">
            {/* HOT NEWS EN & CN */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                  <Flame size={20} />
                </div>
                <div>
                  <span className="block text-sm font-bold text-gray-700">
                    Hot News Settings
                  </span>
                  <span className="text-xs text-gray-500">
                    Atur Hot News terpisah untuk EN & CN.
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {/* EN */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-gray-700">
                        English Site (en.jiipe.com)
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Tampilkan artikel ini sebagai Hot di website English.
                      </p>
                    </div>

                    {/* SWITCH EN */}
                    <button
                      type="button"
                      onClick={() => setIsHotEn((prev) => !prev)}
                      className="relative w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1"
                      aria-pressed={isHotEn}
                    >
                      <span
                        className={`absolute inset-0 rounded-full transition-colors ${isHotEn ? "bg-orange-500" : "bg-gray-300"
                          }`}
                      />
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${isHotEn ? "translate-x-4" : ""
                          }`}
                      />
                    </button>
                  </div>

                  {isHotEn && (
                    <div className="mt-3">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                        Main / Featured Order (EN)
                      </label>
                      <select
                        value={hotPriorityEn ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHotPriorityEn(val ? parseInt(val, 10) : null);
                        }}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      >
                        <option value="">No Priority (Hot only)</option>
                        <option value="1">1 - MAIN STORY (Paling besar)</option>
                        <option value="2">2 - FEATURED #2</option>
                        <option value="3">3 - FEATURED #3</option>
                        <option value="4">4 - Queued #4</option>
                        <option value="5">5 - Queued #5</option>
                      </select>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Urutan ini dipakai untuk menentukan Main Story & Featured di
                        homepage English.
                      </p>
                    </div>
                  )}
                </div>

                {/* CN */}
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-gray-700">
                        Chinese Site (cn.jiipe.com)
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Tampilkan artikel ini sebagai Hot di website Chinese.
                      </p>
                    </div>

                    {/* SWITCH CN */}
                    <button
                      type="button"
                      onClick={() => setIsHotCn((prev) => !prev)}
                      className="relative w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1"
                      aria-pressed={isHotCn}
                    >
                      <span
                        className={`absolute inset-0 rounded-full transition-colors ${isHotCn ? "bg-orange-500" : "bg-gray-300"
                          }`}
                      />
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${isHotCn ? "translate-x-4" : ""
                          }`}
                      />
                    </button>
                  </div>

                  {isHotCn && (
                    <div className="mt-3">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                        Main / Featured Order (CN)
                      </label>
                      <select
                        value={hotPriorityCn ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHotPriorityCn(val ? parseInt(val, 10) : null);
                        }}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      >
                        <option value="">No Priority (Hot only)</option>
                        <option value="1">1 - MAIN STORY (Paling besar)</option>
                        <option value="2">2 - FEATURED #2</option>
                        <option value="3">3 - FEATURED #3</option>
                        <option value="4">4 - Queued #4</option>
                        <option value="5">5 - Queued #5</option>
                      </select>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Urutan ini dipakai untuk menentukan Main Story & Featured di
                        homepage Chinese.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>


            {/* PUBLISH DATE */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                <Calendar size={14} /> Publish Date
              </label>
              <input
                type="date"
                required
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 font-bold text-gray-700"
              />
              <p className="text-xs text-gray-400 mt-2">
                Choose date for latepost or scheduling.
              </p>
            </div>

            {/* CONTENT TYPE */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">
                📄 Content Type
              </label>
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setArticleType("news")}
                  className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
                    articleType === "news"
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  📰 News Article
                </button>
                <button
                  type="button"
                  onClick={() => setArticleType("landing")}
                  className={`flex-1 py-2.5 text-sm font-bold transition-colors ${
                    articleType === "landing"
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  📄 Landing Page
                </button>
              </div>
              {articleType === "landing" && (
                <p className="text-[11px] text-gray-400 mt-2">
                  Landing pages are accessible at <code>/articles/[slug]</code> — no Navbar/Footer shown.
                </p>
              )}
            </div>

            {/* OG IMAGE (landing pages) */}
            {articleType === "landing" && (
              <div className="bg-amber-50 p-5 rounded-xl shadow-sm border border-amber-200">
                <label className="block text-xs font-bold text-amber-700 uppercase mb-2">
                  🖼 OG Image URL (WhatsApp Preview)
                </label>
                <input
                  type="url"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="https://...image.jpg"
                  className="w-full p-3 bg-white border border-amber-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-400 text-sm"
                />
                <p className="text-[11px] text-amber-600 mt-2">
                  This image appears when the link is shared on WhatsApp, Telegram, and social media. Recommended: 1200×630.
                </p>
              </div>
            )}

            {/* STATUS */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 font-bold text-gray-700"
              >
                <option value="Published">Published (Live)</option>
                <option value="Draft">Draft (Hidden)</option>
              </select>
            </div>


            {/* CATEGORY */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
              >
                <optgroup label="--- News ---">
                  <option>Industry News</option>
                  <option>Press Release</option>
                  <option>Sustainability</option>
                  <option>Events</option>
                  <option>Awards</option>
                </optgroup>
                <optgroup label="--- Landing Pages ---">
                  <option>Investment Guide</option>
                  <option>Industrial Park</option>
                  <option>Regulations & Policy</option>
                  <option>Market Insight</option>
                  <option>Company Profile</option>
                  <option>Success Story</option>
                </optgroup>
              </select>
            </div>

            {/* SUMMARY EN & CN */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">
                Short Summary (English)
              </label>
              <textarea
                required
                rows={5}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 text-sm"
                placeholder="Brief description..."
              />

              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 mt-4">
                Short Summary (Chinese)
              </label>
              <textarea
                rows={5}
                value={summaryCn}
                onChange={(e) => setSummaryCn(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 text-sm"
                placeholder="Ringkasan singkat versi China..."
              />
            </div>

            {/* COVER IMAGE */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3">
                Cover Image
              </label>
              {imagePreview ? (
                <div className="mb-4 relative rounded-lg overflow-hidden border border-gray-200 group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XIcon />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
                  <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500 font-medium">
                    Click to upload
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    required={!editId}
                    onChange={handleCoverImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              )}
              {/* Cover Image URL (paste dari ImageKit) */}
              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  🔗 Or Paste Image URL (ImageKit / CDN)
                </label>
                <input
                  type="url"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="https://ik.imagekit.io/..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 text-sm"
                />
                <p className="text-[11px] text-gray-400 mt-1">URL ini akan dipakai sebagai cover image jika tidak ada file yang diupload.</p>
              </div>
            </div>

            {/* SLUG (editable) */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                🔗 URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                placeholder="auto-generated dari judul EN jika kosong"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500 text-sm font-mono"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Landing page URL: <code>/articles/{slug || "[slug]"}</code>. Kosongkan untuk auto-generate dari judul.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}