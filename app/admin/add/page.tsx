"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bold,
  Italic,
  Heading1,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
  Edit3,
  X as XIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ImagePlus,
  Loader2,
  ArrowLeft,
  Save,
  Flame,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

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
  const [uploadingBodyImg, setUploadingBodyImg] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // STATE UNTUK MODAL POPUP
  const [modal, setModal] = useState({
    isOpen: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bodyImageInputRef = useRef<HTMLInputElement>(null);

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

  // --- LOAD DATA EDIT ---
  useEffect(() => {
    if (editId) {
      const fetchArticle = async () => {
        setFetching(true);
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("id", editId)
          .single();

        if (error) {
          console.error("Error fetching data:", error);
          setModal({
            isOpen: true,
            type: "error",
            title: "Gagal Memuat Data",
            message: "Tidak dapat mengambil data artikel dari server.",
          });
        } else if (data) {
          // English
          setTitle(data.title || "");
          setCategory(data.category || "Industry News");
          setStatus(data.status || "Published");
          setSummary(data.summary || "");
          setContent((data.content || "").replaceAll("<br/>", "\n"));
          setImagePreview(data.coverImage || null);

          // Chinese
          setTitleCn(data.title_cn || "");
          setSummaryCn(data.summary_cn || "");
          setContentCn((data.content_cn || "").replaceAll("<br/>", "\n"));

          // Hot EN
          setIsHotEn(data.is_hot ?? false);
          setHotPriorityEn(data.hot_priority ?? null);

          // Hot CN
          setIsHotCn(data.is_hot_cn ?? false);
          setHotPriorityCn(data.hot_priority_cn ?? null);

          if (data.date) {
            const dateObj = new Date(data.date);
            if (!isNaN(dateObj.getTime())) {
              setPublishDate(dateObj.toISOString().split("T")[0]);
            }
          }
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

  const handleBodyImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploadingBodyImg(true);

    try {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "");
      const fileName = `body-${Date.now()}-${cleanFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("news-images")
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("news-images")
        .getPublicUrl(fileName);
      const imageUrl = urlData.publicUrl;

      const imgTag = `\n<img src="${imageUrl}" alt="Image" class="w-full rounded-xl my-6 shadow-md border border-gray-200" />\n<p class="text-center text-gray-500 text-sm italic mt-2">Caption Here</p>\n`;
      insertTag(imgTag, "");
    } catch (error) {
      console.error("Gagal upload gambar body:", error);
      setModal({
        isOpen: true,
        type: "error",
        title: "Upload Gagal",
        message: "Gagal mengupload gambar ke dalam artikel.",
      });
    } finally {
      setUploadingBodyImg(false);
      if (bodyImageInputRef.current) bodyImageInputRef.current.value = "";
    }
  };

  const insertTag = (startTag: string, endTag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const text = activeLang === "en" ? content : contentCn;

    const newText =
      text.substring(0, start) +
      startTag +
      text.substring(start, end) +
      endTag +
      text.substring(end);

    if (activeLang === "en") {
      setContent(newText);
    } else {
      setContentCn(newText);
    }

    setTimeout(() => {
      textarea.focus();
      const cursorPosition = start + startTag.length;
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    }, 0);
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

      if (imageFile) {
        const cleanFileName = imageFile.name.replace(/[^a-zA-Z0-9.]/g, "");
        const fileName = `cover-${Date.now()}-${cleanFileName}`;
        const { error: uploadError } = await supabase.storage
          .from("news-images")
          .upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage
          .from("news-images")
          .getPublicUrl(fileName);
        publicImageUrl = urlData.publicUrl;
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

      const finalContentEn = content.replace(/\n/g, "<br/>");
      const finalContentCn = contentCn.replace(/\n/g, "<br/>");

      const formattedDate = new Date(publishDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const articleData: any = {
        // English
        title,
        slug,
        category,
        status,
        summary,
        content: finalContentEn,
        coverImage: publicImageUrl,
        date: formattedDate,

        // Chinese (bisa kosong/null)
        title_cn: titleCn || null,
        summary_cn: summaryCn || null,
        content_cn: contentCn ? finalContentCn : null,

        // Hot EN (pakai kolom existing)
        is_hot: isHotEn,
        hot_priority: isHotEn ? hotPriorityEn : null,

        // Hot CN (kolom baru)
        is_hot_cn: isHotCn,
        hot_priority_cn: isHotCn ? hotPriorityCn : null,
      };

      // Pastikan PRIORITAS unik per bahasa
      if (isHotEn && hotPriorityEn) {
        if (editId) {
          await supabase
            .from("articles")
            .update({ is_hot: false, hot_priority: null })
            .eq("hot_priority", hotPriorityEn)
            .neq("id", editId);
        } else {
          await supabase
            .from("articles")
            .update({ is_hot: false, hot_priority: null })
            .eq("hot_priority", hotPriorityEn);
        }
      }

      if (isHotCn && hotPriorityCn) {
        if (editId) {
          await supabase
            .from("articles")
            .update({ is_hot_cn: false, hot_priority_cn: null })
            .eq("hot_priority_cn", hotPriorityCn)
            .neq("id", editId);
        } else {
          await supabase
            .from("articles")
            .update({ is_hot_cn: false, hot_priority_cn: null })
            .eq("hot_priority_cn", hotPriorityCn);
        }
      }

      if (editId) {
        const { error } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("articles")
          .insert([articleData]);
        if (error) throw error;
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

  const currentContent = activeLang === "en" ? content : contentCn;
  const setCurrentContent =
    activeLang === "en" ? setContent : setContentCn;

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

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col flex-grow overflow-hidden">
              {/* TOOLBAR */}
              <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap items-center gap-1">
                {/* Bahasa EN / CN */}
                <div className="flex bg-white rounded-lg border border-gray-200 p-1 mr-2">
                  <button
                    type="button"
                    onClick={() => setActiveLang("en")}
                    className={`px-3 py-1.5 rounded text-sm font-bold ${activeLang === "en"
                        ? "bg-red-50 text-red-600"
                        : "text-gray-500 hover:bg-gray-50"
                      }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveLang("cn")}
                    className={`px-3 py-1.5 rounded text-sm font-bold ${activeLang === "cn"
                        ? "bg-red-50 text-red-600"
                        : "text-gray-500 hover:bg-gray-50"
                      }`}
                  >
                    CN
                  </button>
                </div>

                {/* MODE WRITE / PREVIEW */}
                <div className="flex bg-white rounded-lg border border-gray-200 p-1 mr-2">
                  <button
                    type="button"
                    onClick={() => setPreviewMode(false)}
                    className={`px-3 py-1.5 rounded text-sm font-bold flex items-center gap-2 transition-colors ${!previewMode
                        ? "bg-red-50 text-red-600"
                        : "text-gray-500 hover:bg-gray-50"
                      }`}
                  >
                    <Edit3 size={14} /> Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(true)}
                    className={`px-3 py-1.5 rounded text-sm font-bold flex items-center gap-2 transition-colors ${previewMode
                        ? "bg-red-50 text-red-600"
                        : "text-gray-500 hover:bg-gray-50"
                      }`}
                  >
                    <Eye size={14} /> Preview
                  </button>
                </div>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button
                  type="button"
                  title="Bold"
                  onClick={() => insertTag("<b>", "</b>")}
                  className="p-2 hover:bg-gray-200 rounded text-gray-700"
                >
                  <Bold size={18} />
                </button>
                <button
                  type="button"
                  title="Italic"
                  onClick={() => insertTag("<i>", "</i>")}
                  className="p-2 hover:bg-gray-200 rounded text-gray-700"
                >
                  <Italic size={18} />
                </button>
                <button
                  type="button"
                  title="Heading 2"
                  onClick={() => insertTag("<h3>", "</h3>")}
                  className="p-2 hover:bg-gray-200 rounded text-gray-700 flex items-center gap-1"
                >
                  <Heading1 size={18} />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button
                  type="button"
                  title="Align Left"
                  onClick={() => insertTag('<div class="text-left">', "</div>")}
                  className="p-2 hover:bg-gray-200 rounded text-gray-700"
                >
                  <AlignLeft size={18} />
                </button>
                <button
                  type="button"
                  title="Align Center"
                  onClick={() =>
                    insertTag('<div class="text-center">', "</div>")
                  }
                  className="p-2 hover:bg-gray-200 rounded text-gray-700"
                >
                  <AlignCenter size={18} />
                </button>
                <button
                  type="button"
                  title="Align Right"
                  onClick={() =>
                    insertTag('<div class="text-right">', "</div>")
                  }
                  className="p-2 hover:bg-gray-200 rounded text-gray-700"
                >
                  <AlignRight size={18} />
                </button>
                <button
                  type="button"
                  title="Justify"
                  onClick={() =>
                    insertTag('<div class="text-justify">', "</div>")
                  }
                  className="p-2 hover:bg-gray-200 rounded text-gray-700"
                >
                  <AlignJustify size={18} />
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <button
                  type="button"
                  title="List"
                  onClick={() =>
                    insertTag(
                      '<ul class="list-disc list-inside space-y-1 ml-4"><li>',
                      "</li></ul>"
                    )
                  }
                  className="p-2 hover:bg-gray-200 rounded text-gray-700"
                >
                  <List size={18} />
                </button>
                <button
                  type="button"
                  title="Link"
                  onClick={() => {
                    const url = prompt("URL:", "https://");
                    if (url)
                      insertTag(
                        `<a href="${url}" class="text-red-600 hover:underline font-medium">`,
                        "</a>"
                      );
                  }}
                  className="p-2 hover:bg-gray-200 rounded text-gray-700"
                >
                  <LinkIcon size={18} />
                </button>
                <button
                  type="button"
                  title="Add Image Body"
                  onClick={() => bodyImageInputRef.current?.click()}
                  className={`p-2 hover:bg-red-50 rounded flex items-center gap-2 ${uploadingBodyImg ? "text-red-400" : "text-red-600"
                    }`}
                  disabled={uploadingBodyImg}
                >
                  {uploadingBodyImg ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <ImagePlus size={18} />
                  )}
                </button>
                <input
                  type="file"
                  ref={bodyImageInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleBodyImageUpload}
                />
              </div>

              {/* EDITOR / PREVIEW */}
              <div className="flex-grow relative bg-white h-full overflow-hidden">
                {previewMode ? (
                  <div
                    className="prose prose-lg max-w-none p-8 h-full overflow-y-auto whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html:
                        currentContent ||
                        "<p class='text-gray-400 italic'>Start writing...</p>",
                    }}
                  />
                ) : (
                  <textarea
                    ref={textareaRef}
                    required
                    value={currentContent}
                    onChange={(e) => setCurrentContent(e.target.value)}
                    className="w-full h-full p-8 outline-none resize-none font-mono text-base text-gray-800 leading-relaxed"
                    placeholder={
                      activeLang === "en"
                        ? "Write your article here (English)..."
                        : "Write your article here (Chinese)..."
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: SETTINGS */}
          <div className="space-y-6 h-full overflow-y-auto pb-10">
            {/* HOT NEWS EN & CN */}
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
                <option>Industry News</option>
                <option>Press Release</option>
                <option>Sustainability</option>
                <option>Events</option>
                <option>Awards</option>
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
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
