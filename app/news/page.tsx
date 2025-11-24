"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, Flame, ArrowRight } from 'lucide-react'; 

const ITEMS_PER_PAGE = 3;

interface Article {
  id: number;
  title: string;
  slug: string;
  category: string;
  summary: string;
  coverImage: string;
  date: string;
  is_hot?: boolean;
}

export default function NewsIndexPage() {
  const [hotNews, setHotNews] = useState<Article | null>(null); 
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const { data: allArticles, error } = await supabase
          .from('articles')
          .select('*')
          .eq('status', 'Published');

        if (error) {
          console.error("Error fetching news:", error);
          setLoading(false);
          return;
        }

        if (!allArticles) return;

        const hotArticle = allArticles.find(a => a.is_hot === true);
        if (hotArticle) setHotNews(hotArticle);

        let regularArticles = allArticles.filter(a => a.id !== hotArticle?.id);

        regularArticles.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return (dateB || b.id) - (dateA || a.id);
        });

        const totalCount = regularArticles.length;
        setTotalItems(totalCount);
        setTotalPages(Math.ceil(totalCount / ITEMS_PER_PAGE));

        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE;
        
        setNews(regularArticles.slice(from, to));

      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo({ top: 0, behavior: 'smooth' });

  }, [currentPage]); 

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      
      {/* HEADER */}
      <section className="bg-gradient-to-r from-red-800 to-red-600 py-20 text-center px-4 relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Newsroom & Updates
            </h1>
            <p className="text-red-50 text-lg max-w-2xl mx-auto">
            Discover the latest milestones, industrial insights, and events from <br /> JIIPE - Gresik Special Economic Zone.
            </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        
        {/* --- FEATURED / HOT NEWS SECTION (CLEAN SPLIT) --- */}
        {hotNews && currentPage === 1 && (
          <div className="mb-24 animate-fade-in">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-orange-100 rounded-lg">
                    <Flame className="text-orange-600" size={24} fill="currentColor" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Featured Story</h2>
            </div>
            
            <Link href={`/news/${hotNews.slug}`} className="group block">
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col lg:flex-row h-auto lg:h-[500px]">
                    
                    {/* GAMBAR (KIRI) - UTUH */}
                    <div className="relative w-full lg:w-3/5 h-72 lg:h-full overflow-hidden">
                        <img 
                            src={hotNews.coverImage} 
                            alt={hotNews.title} 
                            className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                        />
                        {/* BADGE HOT NEWS DI POJOK KIRI ATAS GAMBAR */}
                        <div className="absolute top-6 left-6 z-20">
                            <span className="flex items-center gap-2 bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg uppercase tracking-wider border border-white/20">
                                <Flame size={14} fill="currentColor" /> HOT NEWS
                            </span>
                        </div>
                    </div>

                    {/* KONTEN (KANAN) - BERSIH */}
                    <div className="w-full lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center bg-white relative">
                        
                        <div className="mb-4 text-sm font-bold text-gray-400 flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-red-600 inline-block"></span>
                            {hotNews.date}
                        </div>

                        <h3 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight group-hover:text-red-600 transition-colors">
                            {hotNews.title}
                        </h3>
                        
                        <p className="text-gray-500 text-base lg:text-lg mb-8 line-clamp-4 leading-relaxed">
                            {hotNews.summary}
                        </p>

                        <div className="mt-auto">
                            <span className="inline-flex items-center gap-2 text-white bg-red-600 px-8 py-4 rounded-full font-bold text-sm shadow-lg hover:bg-red-700 transition-all transform group-hover:translate-x-2">
                                Read Full Article <ArrowRight size={18} />
                            </span>
                        </div>
                    </div>

                </div>
            </Link>
          </div>
        )}

        {/* --- REGULAR NEWS GRID --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">Latest Updates</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {news.map((article) => (
                <Link href={`/news/${article.slug}`} key={article.id} className="group h-full">
                  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                    <div className="h-60 relative overflow-hidden bg-gray-200">
                       <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                       {/* Kategori Regular News */}
                       <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-gray-100">
                         {article.category}
                       </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="text-xs font-semibold text-gray-400 mb-3 flex items-center gap-2">
                        <span>{article.date}</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors leading-snug">
                        {article.title}
                      </h2>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                        {article.summary}
                      </p>
                      <span className="text-red-600 font-bold text-sm mt-auto flex items-center gap-2 group-hover:gap-3 transition-all">
                        Read More <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* PAGINATION */}
            {!loading && news.length === 0 && !hotNews && (
              <div className="col-span-full text-center py-20">
                <p className="text-gray-400 text-lg">Belum ada berita yang diupload.</p>
              </div>
            )}

            {totalItems > ITEMS_PER_PAGE && (
              <div className="flex justify-center items-center gap-2">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`p-2 rounded-lg border ${currentPage === 1 ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-red-600 transition'}`}><ChevronLeft size={20} /></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} onClick={() => handlePageChange(page)} className={`w-10 h-10 rounded-lg font-bold transition ${currentPage === page ? 'bg-red-600 text-white shadow-md transform scale-105' : 'text-gray-600 hover:bg-gray-100'}`}>{page}</button>
                ))}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`p-2 rounded-lg border ${currentPage === totalPages ? 'text-gray-300 border-gray-200 cursor-not-allowed' : 'text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-red-600 transition'}`}><ChevronRight size={20} /></button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}