"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  ArrowRight,
  Calendar,
} from "lucide-react";

interface Article {
  id: number;
  // English fields
  title: string;
  slug: string;
  category: string;
  summary: string;
  coverImage: string;
  date: string;
  is_hot?: boolean;
  hot_priority?: number | null;

  // Chinese fields (opsional, bisa null)
  title_cn?: string | null;
  summary_cn?: string | null;
  content_cn?: string | null;
  is_hot_cn?: boolean;
  hot_priority_cn?: number | null;
}

export default function NewsIndexPage() {
  const [featuredNews, setFeaturedNews] = useState<Article[]>([]);
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination Latest Updates
  const ITEMS_TO_SHOW = 3; // Menampilkan 3 item per halaman
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("status", "Published");

        if (error) {
          console.error("Error fetching news:", error);
          setLoading(false);
          return;
        }

        if (!data) {
          setLoading(false);
          return;
        }

        const allArticles = data as Article[];

        // 1. SORTING UTAMA (Latest Updates tetap urut terbaru)
        allArticles.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return (dateB || b.id) - (dateA || a.id);
        });

        // helper: gunakan config HOT khusus CN, fallback ke EN kalau CN belum diisi
        const getHotConfig = (a: Article) => {
          const isHot = a.is_hot_cn ?? a.is_hot ?? false;
          const priority = a.hot_priority_cn ?? a.hot_priority ?? null;
          return { isHot, priority };
        };

        // 2. FEATURED untuk CN: pakai is_hot_cn/hot_priority_cn (fallback EN jika CN kosong)
        const mainStory = allArticles.find((a) => {
          const { isHot, priority } = getHotConfig(a);
          return isHot && priority === 1;
        });
        const featured2 = allArticles.find((a) => {
          const { isHot, priority } = getHotConfig(a);
          return isHot && priority === 2;
        });
        const featured3 = allArticles.find((a) => {
          const { isHot, priority } = getHotConfig(a);
          return isHot && priority === 3;
        });

        const topFeatured: Article[] = [
          mainStory,
          featured2,
          featured3,
        ].filter(Boolean) as Article[];

        setFeaturedNews(topFeatured);

        // 3. LATEST UPDATES = semua artikel Published
        //    kecuali yang sudah dipakai sebagai Featured Stories
        const featuredIds = topFeatured.map((f) => f.id);
        const sliderArticles = allArticles.filter(
          (a) => !featuredIds.includes(a.id)
        );

        setNews(sliderArticles);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(news.length / ITEMS_TO_SHOW) || 1;

  const nextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : totalPages));
  };

  // --- KOMPONEN KARTU ---

  // Kartu Besar (Featured Utama)
  const MainFeaturedCard = ({ article }: { article: Article }) => {
    const displayTitle = article.title_cn || article.title; // CN dulu, kalau kosong pakai EN
    return (
      <Link
        href={`/news/${article.slug}`}
        className="group block h-full w-full relative rounded-[1.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50"
      >
        <img
          src={article.coverImage}
          alt={displayTitle}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90"></div>
        <div className="absolute top-4 left-4 z-20">
          <span className="flex items-center gap-2 bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
            <Flame size={12} fill="currentColor" /> HOT
          </span>
        </div>
        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-20">
          <span className="inline-block bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded mb-2">
            {article.category}
          </span>
          <h3 className="text-xl md:text-3xl font-bold text-white mb-3 leading-snug drop-shadow-md line-clamp-3 group-hover:text-orange-200 transition-colors">
            {displayTitle}
          </h3>
          <div className="flex items-center gap-2 text-gray-300 text-xs">
            <Calendar size={14} /> {article.date}
          </div>
        </div>
      </Link>
    );
  };

  // Kartu Kecil (Featured Samping)
  const SubFeaturedCard = ({ article }: { article: Article }) => {
    const displayTitle = article.title_cn || article.title;
    return (
      <Link
        href={`/news/${article.slug}`}
        className="group block h-full w-full relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-gray-200/50"
      >
        <img
          src={article.coverImage}
          alt={displayTitle}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-90"></div>
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-white/20 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded border border-white/20">
            FEATURED
          </span>
        </div>
        <div className="absolute bottom-0 left-0 p-5 w-full z-20">
          <h4 className="text-base md:text-lg font-bold text-white mb-2 leading-snug drop-shadow-md line-clamp-2 group-hover:text-orange-200 transition-colors">
            {displayTitle}
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
  };

  // Kartu Slider (Latest Updates) + Short Summary
  const SliderCard = ({ article }: { article: Article }) => {
    const displayTitle = article.title_cn || article.title;
    const displaySummary = article.summary_cn || article.summary;
    return (
      <Link
        href={`/news/${article.slug}`}
        className="group block h-[420px] relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-200 bg-white"
      >
        <div className="h-2/5 relative overflow-hidden">
          <img
            src={article.coverImage}
            alt={displayTitle}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-gray-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm">
            {article.category}
          </div>
        </div>
        <div className="h-3/5 p-5 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold text-gray-400 mb-2 flex items-center gap-1">
              <Calendar size={12} /> {article.date}
            </div>
            <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors mb-2">
              {displayTitle}
            </h3>
            {/* Short Summary */}
            <p className="text-sm text-gray-600 leading-snug line-clamp-3">
              {displaySummary}
            </p>
          </div>
          <span className="text-xs text-red-600 font-bold flex items-center gap-1 mt-3">
            Read More{" "}
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </span>
        </div>
      </Link>
    );
  };

  const paginatedNews = news.slice(
    (currentPage - 1) * ITEMS_TO_SHOW,
    currentPage * ITEMS_TO_SHOW
  );

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* HEADER */}
      <section className="bg-gradient-to-r from-red-800 to-red-600 py-16 text-center px-4 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            Newsroom & Updates
          </h1>
          <p className="text-red-100 text-sm md:text-base max-w-2xl mx-auto">
            Discover the latest milestones, industrial insights, and events.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-7xl">
        {/* --- 1. FEATURED STORIES --- */}
        {featuredNews.length > 0 && (
          <div className="mb-16 animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-orange-100 rounded-md">
                <Flame
                  className="text-orange-600"
                  size={20}
                  fill="currentColor"
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Featured Stories
              </h2>
            </div>

            {/* MOBILE */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
              {featuredNews.map((article) => (
                <div key={article.id} className="h-[260px]">
                  <MainFeaturedCard article={article} />
                </div>
              ))}
            </div>

            {/* DESKTOP */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-4 h-[450px]">
              <div
                className={`${featuredNews.length === 1 ? "lg:col-span-12" : "lg:col-span-7"
                  } h-full`}
              >
                <MainFeaturedCard article={featuredNews[0]} />
              </div>

              {featuredNews.length > 1 && (
                <div className="lg:col-span-5 flex flex-col gap-4 h-full">
                  <div
                    className={`flex-1 ${featuredNews.length === 2 ? "lg:h-full" : ""
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
          </div>
        )}

        {/* --- 2. LATEST UPDATES --- */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 bg-red-600 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900">
                Latest Updates
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-80 bg-gray-200 rounded-3xl animate-pulse"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedNews.length > 0 ? (
                paginatedNews.map((article) => (
                  <div key={article.id} className="animate-fade-in">
                    <SliderCard article={article} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-400">
                  No more updates available.
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {!loading && news.length > 0 && (
            <div className="flex flex-col items-center gap-2 mt-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={prevPage}
                  className="px-3 py-2 border rounded hover:bg-gray-100 text-sm"
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }).map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded border text-sm ${currentPage === page
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={nextPage}
                  className="px-3 py-2 border rounded hover:bg-gray-100 text-sm"
                >
                  ›
                </button>
              </div>

              <div className="text-xs text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
