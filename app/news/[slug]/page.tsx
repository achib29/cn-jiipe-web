"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';
import { Facebook, Linkedin, MessageCircle, Link as LinkIcon, Check } from 'lucide-react'; // Icon baru

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
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState(false); // State untuk feedback copy link

  useEffect(() => {
    // Ambil URL browser saat ini setelah halaman dimuat
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }

    const fetchArticle = async () => {
      if (!params.slug) return;

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', params.slug)
        .single();

      if (error) {
        console.error("Error fetching article:", error);
      } else {
        setArticle(data);
      }
      
      setLoading(false);
    };

    fetchArticle();
  }, [params.slug]);

  // --- FUNGSI SHARE ---
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
        // WeChat tidak punya direct URL share untuk web.
        // Solusi standar: Copy link ke clipboard
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset icon setelah 2 detik
        alert("Link copied! You can now paste it in WeChat.");
        return; 
    }

    if (shareUrl) {
      // Buka jendela popup baru
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center pt-20">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Article Not Found</h1>
        <Link href="/news" className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          &larr; Back to Newsroom
        </Link>
      </div>
    );
  }

  return (
    <main className="w-full bg-white min-h-screen flex flex-col pt-20">
      
      {/* --- SECTION A: COVER ARTICLE --- */}
      <div className="relative w-full h-[70vh] md:h-[600px] bg-gray-900 overflow-hidden group">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-90"></div>

        <div className="absolute inset-0 flex flex-col justify-end items-center text-center px-4 md:px-20 z-10 pb-12 md:pb-16">
          <span className="bg-red-600 text-white px-4 py-1.5 text-xs md:text-sm font-bold rounded-full mb-4 uppercase tracking-wider shadow-lg">
            {article.category}
          </span>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-snug max-w-5xl drop-shadow-lg mb-4">
            {article.title}
          </h1>
          <div className="flex items-center gap-3 text-gray-300 text-sm md:text-base font-medium">
            <span>{article.date}</span>
          </div>
        </div>
      </div>

      {/* --- SECTION B: BODY CONTENT --- */}
      <div className="container mx-auto px-4 md:px-0 py-12 md:py-16 max-w-3xl">
        <Link href="/news" className="group text-gray-500 hover:text-red-600 mb-8 inline-flex items-center text-sm font-bold transition-colors">
          <span className="group-hover:-translate-x-1 transition-transform mr-2">&larr;</span> Back to Newsroom
        </Link>

        <article 
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed 
          prose-headings:font-bold prose-headings:text-gray-900 
          prose-p:text-gray-600 prose-p:leading-8
          prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8"
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />
        
        {/* SHARE SECTION BARU */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500 font-bold uppercase tracking-wide">
                Share this update
            </div>
            <div className="flex gap-3">
               
               {/* WhatsApp */}
               <button 
                 onClick={() => handleShare('whatsapp')}
                 className="flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-sm font-bold transition shadow-sm"
               >
                 <MessageCircle size={18} /> WhatsApp
               </button>

               {/* Facebook */}
               <button 
                 onClick={() => handleShare('facebook')}
                 className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg text-sm font-bold transition shadow-sm"
               >
                 <Facebook size={18} /> Facebook
               </button>

               {/* WeChat (Copy Link) */}
               <button 
                 onClick={() => handleShare('wechat')}
                 className="flex items-center gap-2 px-4 py-2 bg-[#07C160] hover:bg-[#06ad56] text-white rounded-lg text-sm font-bold transition shadow-sm"
                 title="Copy Link for WeChat"
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