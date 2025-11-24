"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import {
  Facebook,
  MessageCircle,
  Link as LinkIcon,
  Check,
  ArrowLeft,
  Calendar,
  Share2,
} from "lucide-react";

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  summary: string;
  coverImage: string;
  content: string;
  date: string;
}

export default function ArticlePage() {
  const params = useParams();

  // 🔐 Normalisasi slug biar TypeScript nggak protes (string | string[])
  const rawSlug = params?.slug as string | string[] | undefined;
  const slug =
    typeof rawSlug === "string"
      ? rawSlug
      : Array.isArray(rawSlug)
      ? rawSlug[0]
      : "";

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Simpan URL browser saat ini untuk fitur share
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }

    const fetchArticle = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching article:", error);
        setArticle(null);
      } else {
        setArticle(data as Article);
      }

      setLoading(false);
    };

    fetchArticle();
  }, [slug]);

  // --- FUNGSI SHARE ---
  const handleShare = (platform: "facebook" | "whatsapp" | "wechat") => {
    if (!currentUrl || !article) return;

    const text = encodeURIComponent(article.title);
    const url = encodeURIComponent(currentUrl);
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${text}%0A${url}`;
        break;
      case "wechat":
        // Copy link (dipakai untuk WeChat)
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          navigator.clipboard.writeText(currentUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center pt-20 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center pt-20 bg-white">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Article Not Found
        </h1>
        <Link
          href="/news"
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back to Newsroom
        </Link>
      </div>
    );
  }

  return (
    <main className="w-full bg-white min-h-screen flex flex-col pt-20">
      {/* --- HERO SECTION (GAMBAR BESAR) --- */}
      <div className="relative w-full h-[60vh] md:h-[700px] bg-gray-900 overflow-hidden group">
        {/* Gambar Full */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
        />

        {/* Gradient Hitam di Bawah */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-90" />

        {/* Konten Judul */}
        <div className="absolute inset-0 flex flex-col justify-end items-center text-center px-4 md:px-20 z-10 pb-16 md:pb-24">
          <span className="bg-red-600 text-white px-4 py-1.5 text-xs md:text-sm font-bold rounded-full mb-6 uppercase tracking-wider shadow-lg border border-red-500/50 backdrop-blur-sm">
            {article.category}
          </span>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-2xl mb-6">
            {article.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-300 text-sm md:text-base font-medium bg-black/30 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
            <Calendar size={16} />
            <span>{article.date}</span>
          </div>
        </div>
      </div>

      {/* --- KONTEN ARTIKEL --- */}
      <div className="container mx-auto px-4 md:px-0 py-12 md:py-16 max-w-4xl">
        {/* Breadcrumb / Back */}
        <Link
          href="/news"
          className="group text-gray-500 hover:text-red-600 mb-10 inline-flex items-center text-sm font-bold transition-colors"
        >
          <span className="group-hover:-translate-x-1 transition-transform mr-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-red-50">
            <ArrowLeft size={16} />
          </span>
          Back to Newsroom
        </Link>

        {/* Isi Berita (HTML Render) */}
        <article
          className="prose prose-lg max-w-none text-gray-700 leading-loose
            prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mt-8 prose-headings:mb-4
            prose-p:text-gray-600 prose-p:mb-6
            prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-10 prose-img:w-full
            prose-blockquote:border-l-red-600 prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <hr className="my-12 border-gray-200" />

        {/* SHARE BUTTONS */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-3 text-gray-700 font-bold">
            <div className="p-2 bg-white rounded-full shadow-sm text-red-600">
              <Share2 size={20} />
            </div>
            <span>Share this article</span>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {/* WhatsApp */}
            <button
              onClick={() => handleShare("whatsapp")}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-sm font-bold transition shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <MessageCircle size={18} /> WhatsApp
            </button>

            {/* Facebook */}
            <button
              onClick={() => handleShare("facebook")}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl text-sm font-bold transition shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <Facebook size={18} /> Facebook
            </button>

            {/* WeChat / Copy */}
            <button
              onClick={() => handleShare("wechat")}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                copied
                  ? "bg-gray-800 text-white"
                  : "bg-[#07C160] hover:bg-[#06ad56] text-white"
              }`}
            >
              {copied ? <Check size={18} /> : <LinkIcon size={18} />}
              {copied ? "Copied!" : "WeChat / Copy"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
