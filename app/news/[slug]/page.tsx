"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import { Facebook, MessageCircle, Link as LinkIcon, Check, ArrowLeft, Calendar, Share2, ArrowRight } from 'lucide-react';

// Definisi tipe data artikel sesuai database Supabase
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
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]); // State untuk Related Articles
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState(false); 

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }

    const fetchData = async () => {
      const slug = params?.slug as string;
      if (!slug) return;

      // 1. Fetch Artikel Utama
      const { data: mainArticle, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error("Error fetching article:", error);
        setLoading(false);
        return;
      }

      setArticle(mainArticle);

      // 2. Fetch Related Articles (3 Artikel Terbaru selain yang sedang dibuka)
      if (mainArticle) {
        const { data: relatedData } = await supabase
          .from('articles')
          .select('*')
          .neq('id', mainArticle.id) // Kecualikan artikel ini
          .eq('status', 'Published') // Hanya yang published
          .order('id', { ascending: false }) // Urutkan dari terbaru
          .limit(3); // Ambil 3 saja

        if (relatedData) {
          setRelatedArticles(relatedData);
        }
      }
      
      setLoading(false);
    };

    fetchData();
  }, [params]);

  const handleShare = (platform: string) => {
    if (!currentUrl || !article) return;

    const text = encodeURIComponent(article.title);
    const url = encodeURIComponent(currentUrl);
    let shareUrl = "";

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${text}%0A${url}`;
        break;
      case 'wechat':
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); 
        return; 
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center pt-20 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center pt-20 bg-white">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h1>
        <Link href="/news" className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Newsroom
        </Link>
      </div>
    );
  }

  return (
    <main className="w-full bg-white min-h-screen flex flex-col pt-20">
      
      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-[60vh] md:h-[700px] bg-gray-900 overflow-hidden group">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-90"></div>

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
        
        <Link href="/news" className="group text-gray-500 hover:text-red-600 mb-10 inline-flex items-center text-sm font-bold transition-colors">
          <span className="group-hover:-translate-x-1 transition-transform mr-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-red-50">
            <ArrowLeft size={16} />
          </span> 
          Back to Newsroom
        </Link>

        <article 
          className="prose prose-lg max-w-none text-gray-700 leading-loose 
          prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mt-8 prose-headings:mb-4
          prose-p:text-gray-600 prose-p:mb-6
          prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-10 prose-img:w-full
          prose-blockquote:border-l-red-600 prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic"
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />
        
        {/* TOMBOL SHARE */}
        <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3 text-gray-700 font-bold">
                <div className="p-2 bg-white rounded-full shadow-sm text-red-600">
                  <Share2 size={20} />
                </div>
                <span>Share this article</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
               <button 
                 onClick={() => handleShare('whatsapp')}
                 className="flex-1 min-w-[140px] md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-sm font-bold transition shadow-sm hover:shadow-md hover:-translate-y-0.5"
               >
                 <MessageCircle size={18} /> WhatsApp
               </button>

               <button 
                 onClick={() => handleShare('facebook')}
                 className="flex-1 min-w-[140px] md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl text-sm font-bold transition shadow-sm hover:shadow-md hover:-translate-y-0.5"
               >
                 <Facebook size={18} /> Facebook
               </button>

               <button 
                 onClick={() => handleShare('wechat')}
                 className={`flex-1 min-w-[140px] md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm hover:shadow-md hover:-translate-y-0.5 ${copied ? 'bg-gray-800 text-white' : 'bg-[#07C160] hover:bg-[#06ad56] text-white'}`}
                 title="Salin link untuk dibagikan di WeChat"
               >
                 {copied ? <Check size={18} /> : <LinkIcon size={18} />} 
                 {copied ? "Copied!" : "WeChat / Copy"}
               </button>
            </div>
        </div>

        {/* CTA SECTION */}
        <div className="mt-12 mb-12 p-8 md:p-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl border border-gray-700/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
            
            <div className="relative z-10 text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Interested in JIIPE Industrial Estate?
                </h3>
                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                    Discover world-class infrastructure and strategic investment opportunities in Indonesia's first integrated industrial estate.
                </p>
                
                <a 
                  href="/#contact" 
                  className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 hover:shadow-lg group-hover:shadow-red-600/25"
                >
                  Contact Us Now
                  <ArrowRight size={20} />
                </a>
            </div>
        </div>

      </div>

      {/* --- RELATED ARTICLES SECTION (BARU) --- */}
      {relatedArticles.length > 0 && (
        <section className="bg-gray-50 py-16 border-t border-gray-200">
          <div className="container mx-auto px-4 max-w-6xl">
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  More News & Updates
                </h2>
                <p className="text-gray-500 mt-2">Discover more stories from JIIPE</p>
              </div>
              <Link href="/news" className="text-red-600 font-bold hover:text-red-700 flex items-center gap-1 group">
                View All Articles <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((item) => (
                <Link href={`/news/${item.slug}`} key={item.id} className="group block h-full">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100">
                    <div className="h-48 relative overflow-hidden bg-gray-200">
                       <img 
                         src={item.coverImage} 
                         alt={item.title} 
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                       />
                       <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-gray-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                         {item.category}
                       </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="text-xs font-semibold text-gray-400 mb-2">
                        {item.date}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-3 mb-4 flex-grow leading-relaxed">
                        {item.summary}
                      </p>
                      <span className="text-red-600 font-bold text-xs mt-auto flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>
      )}

    </main>
  );
}