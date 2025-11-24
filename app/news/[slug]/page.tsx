"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation'; // Gunakan useParams untuk Client Component
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
  // PENTING: Di Client Component ("use client"), kita pakai hook useParams()
  // Ini lebih aman dan otomatis menangani slug dari URL
  const params = useParams(); 
  
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState(false); 

  useEffect(() => {
    // Simpan URL browser saat ini untuk fitur share
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }

    const fetchArticle = async () => {
      // Cek apakah params.slug ada dan valid (string)
      // Kita cast params.slug sebagai string karena useParams mengembalikan string | string[]
      const slug = params?.slug as string;

      if (!slug) return;

      // Cari artikel di Supabase berdasarkan slug
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error("Error fetching article:", error);
      } else {
        setArticle(data);
      }
      
      setLoading(false);
    };

    fetchArticle();
  }, [params]); // Dependency array memantau perubahan params

  // --- FUNGSI SHARE SOCIAL MEDIA ---
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
        // WeChat Copy Link
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); 
        return; 
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  // Tampilan Loading
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center pt-20 bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Tampilan Jika Artikel Tidak Ditemukan
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
      
      {/* --- HERO SECTION (GAMBAR BESAR & JUDUL) --- */}
      <div className="relative w-full h-[60vh] md:h-[700px] bg-gray-900 overflow-hidden group">
        
        {/* Gambar Full Background */}
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
        />
        
        {/* Gradient Hitam */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-90"></div>

        {/* Konten Judul */}
        <div className="absolute inset-0 flex flex-col justify-end items-center text-center px-4 md:px-20 z-10 pb-16 md:pb-24">
          
          {/* Kategori Badge */}
          <span className="bg-red-600 text-white px-4 py-1.5 text-xs md:text-sm font-bold rounded-full mb-6 uppercase tracking-wider shadow-lg border border-red-500/50 backdrop-blur-sm">
            {article.category}
          </span>
          
          {/* Judul Artikel */}
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-5xl drop-shadow-2xl mb-6">
            {article.title}
          </h1>
          
          {/* Tanggal Publish */}
          <div className="flex items-center gap-2 text-gray-300 text-sm md:text-base font-medium bg-black/30 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
            <Calendar size={16} />
            <span>{article.date}</span>
          </div>

        </div>
      </div>

      {/* --- KONTEN ARTIKEL --- */}
      <div className="container mx-auto px-4 md:px-0 py-12 md:py-16 max-w-4xl">
        
        {/* Tombol Kembali */}
        <Link href="/news" className="group text-gray-500 hover:text-red-600 mb-10 inline-flex items-center text-sm font-bold transition-colors">
          <span className="group-hover:-translate-x-1 transition-transform mr-2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-red-50">
            <ArrowLeft size={16} />
          </span> 
          Back to Newsroom
        </Link>

        {/* Isi Berita HTML */}
        <article 
          className="prose prose-lg max-w-none text-gray-700 leading-loose 
          prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mt-8 prose-headings:mb-4
          prose-p:text-gray-600 prose-p:mb-6
          prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-2xl prose-img:shadow-xl prose-img:my-10 prose-img:w-full
          prose-blockquote:border-l-red-600 prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic"
          dangerouslySetInnerHTML={{ __html: article.content }} 
        />
        
        {/* --- CTA SECTION (CALL TO ACTION) --- */}
        <div className="my-16 bg-gradient-to-r from-red-900 to-red-700 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden group">
            {/* Hiasan Background */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition duration-1000"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Interested in investing at JIIPE?
                </h3>
                <p className="text-red-100 mb-8 text-lg">
                    Discover world-class industrial facilities and strategic opportunities for your business growth in Indonesia.
                </p>
                <a 
                    href="/#contact" 
                    className="inline-flex items-center gap-2 bg-white text-red-700 hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1"
                >
                    Contact Us Now <ArrowRight size={20} />
                </a>
            </div>
        </div>

        <hr className="my-12 border-gray-200" />

        {/* TOMBOL SHARE */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3 text-gray-700 font-bold">
                <div className="p-2 bg-white rounded-full shadow-sm text-red-600">
                  <Share2 size={20} />
                </div>
                <span>Share this article</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
               {/* WhatsApp */}
               <button 
                 onClick={() => handleShare('whatsapp')}
                 className="flex-1 min-w-[140px] md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-sm font-bold transition shadow-sm hover:shadow-md hover:-translate-y-0.5"
               >
                 <MessageCircle size={18} /> WhatsApp
               </button>

               {/* Facebook */}
               <button 
                 onClick={() => handleShare('facebook')}
                 className="flex-1 min-w-[140px] md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl text-sm font-bold transition shadow-sm hover:shadow-md hover:-translate-y-0.5"
               >
                 <Facebook size={18} /> Facebook
               </button>

               {/* WeChat / Copy Link */}
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

      </div>

    </main>
  );
}