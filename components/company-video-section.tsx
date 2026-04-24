"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

interface CompanyVideoContent {
  [key: string]: { en: string; cn: string } | undefined;
  heading?: { en: string; cn: string };
  description?: { en: string; cn: string };
  cover_image?: { en: string; cn: string };
  bilibili_iframe?: { en: string; cn: string };
}

const lang = "cn";

const defaults: Record<string, { en: string; cn: string }> = {
  heading: { en: 'Company Profile Video', cn: '公司宣传片' },
  description: { en: 'Discover the latest milestones, industrial insights, and events.', cn: '了解我们最新的里程碑、行业见解和活动。' },
  cover_image: { en: '/images/jiipe-about-cover.jpg', cn: '/images/jiipe-about-cover.jpg' },
  bilibili_iframe: { 
    en: '<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=116458273119075&bvid=BV1atoLBBEW5&cid=37775344238&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>', 
    cn: '<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=116458273119075&bvid=BV1atoLBBEW5&cid=37775344238&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>' 
  },
};

function get(content: CompanyVideoContent, key: keyof typeof defaults): string {
  return (content[key] as any)?.[lang] ?? defaults[key][lang];
}

export default function CompanyVideoSection({ initialData }: { initialData?: CompanyVideoContent }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });
  const [content, setContent] = useState<CompanyVideoContent>(initialData || {});

  // Video Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    fetch('/api/site-content?section=company_video')
      .then(r => r.json())
      .then(data => setContent(data.data ?? {}))
      .catch(() => {});
  }, []);

  const handleOpenVideo = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsVideoModalOpen(true);
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    // Analytics hook
    if (typeof window !== 'undefined') {
      if ((window as any)._hmt) {
        (window as any)._hmt.push(['_trackEvent', 'Video', 'Play', 'Company Profile Video']);
      } else if ((window as any).gtag) {
        (window as any).gtag('event', 'video_open', { video_title: 'Company Profile Video' });
      }
    }
  };

  const handleCloseVideo = () => {
    setIsClosing(true);
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';

    // Analytics hook
    if (typeof window !== 'undefined') {
      if ((window as any)._hmt) {
        (window as any)._hmt.push(['_trackEvent', 'Video', 'Close', 'Company Profile Video']);
      } else if ((window as any).gtag) {
        (window as any).gtag('event', 'video_close', { video_title: 'Company Profile Video' });
      }
    }

    setTimeout(() => {
      setIsVideoModalOpen(false);
      setIsClosing(false);
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVideoModalOpen) {
        handleCloseVideo();
      }
    };
    if (isVideoModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVideoModalOpen]);

  const heading = get(content, 'heading');
  const description = get(content, 'description');
  const imageUrl = get(content, 'cover_image');
  const iframeCode = get(content, 'bilibili_iframe');

  return (
    <section id="company-video" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {heading}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>

        {/* Video Thumbnail */}
        <div 
          ref={ref}
          className={cn(
            "relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl opacity-0 transition-all duration-1000 ease-out",
            isInView && "opacity-100 translate-y-0"
          )}
          style={{ transform: isInView ? "translateY(0)" : "translateY(40px)" }}
        >
          <div className="aspect-video relative group cursor-pointer bg-gray-200 dark:bg-gray-800" onClick={handleOpenVideo}>
            {imageUrl && (
              <Image
                src={imageUrl}
                alt="Company Video"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            )}
            
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="relative flex items-center justify-center">
                <span className="absolute h-full w-full rounded-full bg-white opacity-30 animate-ping duration-1000" />
                <div className="relative flex items-center justify-center w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-white bg-white/20 backdrop-blur-sm shadow-2xl transition-transform duration-300 group-hover:scale-110">
                  <Play className="w-10 h-10 md:w-12 md:h-12 text-white fill-white translate-x-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div 
          className={cn(
            "fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ease-in-out",
            isClosing ? "opacity-0" : "opacity-100"
          )}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.92)', backdropFilter: 'blur(8px)' }}
          onClick={handleCloseVideo}
        >
          <div 
            className={cn(
              "relative w-full max-w-[1100px] aspect-video bg-black rounded-lg overflow-hidden shadow-2xl transition-transform duration-300",
              isClosing ? "scale-95" : "scale-100"
            )}
            style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleCloseVideo}
              aria-label="关闭视频"
              className="absolute top-4 right-4 z-[110] flex items-center justify-center rounded-full transition-all duration-300 hover:rotate-90 hover:bg-[#DA291C] hover:border-[#DA291C] cursor-pointer"
              style={{ 
                width: 'clamp(36px, 5vw, 40px)', 
                height: 'clamp(36px, 5vw, 40px)', 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                border: '1px solid rgba(255,255,255,0.2)' 
              }}
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Bilibili Iframe Container */}
            <div 
              className="absolute inset-0 w-full h-full [&>iframe]:w-full [&>iframe]:h-full"
              dangerouslySetInnerHTML={{ __html: iframeCode }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
