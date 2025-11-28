"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ArrowRight, Calendar } from "lucide-react";

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  summary: string;
  coverImage: string;
  date: string;
  is_hot?: boolean;
  hot_priority?: number | null;
}

export default function HomeFeaturedStories() {
  const [featuredNews, setFeaturedNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("status", "Published");

        if (error) {
          console.error("Error fetching featured news:", error);
          setLoading(false);
          return;
        }
        if (!data) {
          setLoading(false);
          return;
        }

        const allArticles = data as Article[];

        // urutkan by tanggal terbaru (fallback)
        allArticles.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return (dateB || b.id) - (dateA || a.id);
        });

        // pilih berdasarkan hot_priority
        const mainStory = allArticles.find(
          (a) => a.is_hot && a.hot_priority === 1
        );
        const featured2 = allArticles.find(
          (a) => a.is_hot && a.hot_priority === 2
        );
        const featured3 = allArticles.find(
          (a) => a.is_hot && a.hot_priority === 3
        );

        let topFeatured: Article[] = [
          mainStory,
          featured2,
          featured3,
        ].filter(Boolean) as Article[];

        // fallback kalau belum ada priority
        if (topFeatured.length === 0) {
          const hotArticles = allArticles.filter((a) => a.is_hot);
          topFeatured = hotArticles.slice(0, 3);
        }

        setFeaturedNews(topFeatured);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="mb-8">
          <p className="text-xs md:text-sm font-bold tracking-[0.2em] text-red-600 uppercase">
            JIIPE NEWSROOM
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900">
            Featured Stories
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[450px]">
          <div className="lg:col-span-7 h-[350px] lg:h-full bg-gray-200 rounded-[1.5rem] animate-pulse" />
          <div className="lg:col-span-5 flex flex-col gap-4 h-full">
            <div className="flex-1 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="flex-1 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (!featuredNews.length) return null;

  const MainFeaturedCard = ({ article }: { article: Article }) => (
    <Link
      href={`/news/${article.slug}`}
      className="group block h-full w-full relative rounded-[1.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50"
    >
      <img
        src={article.coverImage}
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90" />
      <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-20">
        <span className="inline-block bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded mb-2">
          {article.category}
        </span>
        <h3 className="text-xl md:text-3xl font-bold text-white mb-3 leading-snug drop-shadow-md line-clamp-3 group-hover:text-orange-200 transition-colors">
          {article.title}
        </h3>
        <div className="flex items-center gap-2 text-gray-300 text-xs">
          <Calendar size={14} /> {article.date}
        </div>
      </div>
    </Link>
  );

  const SubFeaturedCard = ({ article }: { article: Article }) => (
    <Link
      href={`/news/${article.slug}`}
      className="group block h-full w-full relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-gray-200/50"
    >
      <img
        src={article.coverImage}
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-90" />
      <div className="absolute top-3 left-3 z-20">
        <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded border border-white/20">
          FEATURED
        </span>
      </div>
      <div className="absolute bottom-0 left-0 p-5 w-full z-20">
        <h4 className="text-base md:text-lg font-bold text-white mb-2 leading-snug drop-shadow-md line-clamp-2 group-hover:text-orange-200 transition-colors">
          {article.title}
        </h4>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-[10px]">{article.date}</span>
          <ArrowRight
            size={14}
            className="text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-5px] group-hover:translate-x-0"
          />
        </div>
      </div>
    </Link>
  );

  return (
    <section className="container mx-auto px-4 py-16">
      {/* HEADER */}
      <div className="mb-8 text-center">
        <p className="text-xs md:text-sm font-bold tracking-[0.2em] text-red-600 uppercase">
          JIIPE NEWSROOM
        </p>
        <h2 className="mt-2 text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900">
          Featured Stories
        </h2>
        <p className="mt-2 text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
          Discover the latest milestones, industrial insights, and events.
        </p>
      </div>

      {/* ===== MOBILE LAYOUT (<= lg) ===== */}
      <div className="lg:hidden space-y-6">
        {/* Item #1 – Main Featured (besar) */}
        <div className="h-[260px]">
          <MainFeaturedCard article={featuredNews[0]} />
        </div>

        {/* Item #2 & #3 – Kartu kecil tanpa gambar */}
        {featuredNews.slice(1).map((article) => (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            className="block p-4 rounded-2xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
              {article.category}
            </span>

            <h3 className="mt-2 text-base font-semibold text-gray-900 leading-snug line-clamp-2">
              {article.title}
            </h3>

            <div className="flex items-center justify-between mt-2 text-gray-500 text-xs">
              <span>{article.date}</span>
              <ArrowRight size={16} className="text-red-600" />
            </div>
          </Link>
        ))}
      </div>

      {/* ===== DESKTOP LAYOUT (lg+) ===== */}
      <div className="hidden lg:grid grid-cols-12 gap-4 h-auto lg:h-[450px] mt-4">
        {/* Kiri – Main Story */}
        <div
          className={`${
            featuredNews.length === 1 ? "lg:col-span-12" : "lg:col-span-7"
          } h-[350px] lg:h-full`}
        >
          <MainFeaturedCard article={featuredNews[0]} />
        </div>

        {/* Kanan – Featured #2 & #3 */}
        {featuredNews.length > 1 && (
          <div className="lg:col-span-5 flex flex-col gap-4 h-full">
            <div
              className={`flex-1 ${
                featuredNews.length === 2 ? "h-[350px] lg:h-full" : ""
              }`}
            >
              <SubFeaturedCard article={featuredNews[1]} />
            </div>
            {featuredNews.length > 2 && (
              <div className="flex-1">
                <SubFeaturedCard article={featuredNews[2]} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===== CTA: VIEW ALL ARTICLES (MOBILE & DESKTOP) ===== */}
      <div className="mt-8 text-center">
        <Link
          href="/news"
          className="inline-block px-6 py-2 rounded-full border border-red-600 text-red-600 font-semibold text-sm hover:bg-red-600 hover:text-white transition"
        >
          View All Articles
        </Link>
      </div>
    </section>
  );

}
