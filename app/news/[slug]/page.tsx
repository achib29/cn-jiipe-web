"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  date: string;
  content?: string;
  status?: string;
  is_hot?: boolean;
  created_at: string;
}

export default function NewsDetailPage() {
  const params = useParams();

  // 👇 Aman: handle kemungkinan params / slug bisa null / array
  const rawSlug = params?.slug;
  const slug =
    typeof rawSlug === "string"
      ? rawSlug
      : Array.isArray(rawSlug)
      ? rawSlug[0]
      : undefined;

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    const fetchArticle = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        console.error("Error fetching article:", error);
        setNotFound(true);
        setArticle(null);
      } else {
        setArticle(data as Article);
        setNotFound(false);
      }

      setLoading(false);
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-500">Loading article...</p>
        </div>
      </main>
    );
  }

  if (notFound || !article) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Artikel tidak ditemukan
          </h1>
          <p className="text-gray-600">
            Artikel yang Anda cari mungkin sudah dihapus atau URL-nya tidak
            valid.
          </p>
          <Link
            href="/news"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
          >
            Kembali ke daftar berita
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <Link
          href="/news"
          className="inline-flex items-center text-sm text-red-600 hover:text-red-700 font-semibold"
        >
          ← Kembali ke daftar berita
        </Link>

        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
          {article.category}
        </span>

        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          {article.title}
        </h1>

        <p className="text-sm text-gray-500">
          {article.date} {/* kalau mau, format tanggal di sini */}
        </p>

        <hr className="my-4 border-gray-200" />

        <article className="prose prose-gray max-w-none">
          {article.content ? (
            <p>{article.content}</p>
          ) : (
            <p className="text-gray-500">
              Konten artikel belum diisi di CMS.
            </p>
          )}
        </article>
      </div>
    </main>
  );
}
