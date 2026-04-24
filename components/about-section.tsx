"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Play, X, Loader2 } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

interface AboutContent {
  [key: string]: { en: string; cn: string } | undefined;
  label?: { en: string; cn: string };
  heading?: { en: string; cn: string };
  paragraph_1?: { en: string; cn: string };
  paragraph_2?: { en: string; cn: string };
  image_url?: { en: string; cn: string };
  video_url?: { en: string; cn: string };
  features?: { en: string; cn: string };
}

const lang = "cn";

const defaults: Record<string, { en: string; cn: string }> = {
  label: { en: 'About JIIPE', cn: '关于 JIIPE' },
  heading: { en: "Indonesia's Premier Integrated Industrial Estate", cn: '印尼首席综合工业园区' },
  paragraph_1: { en: "Designated as a National Strategic Project, JIIPE spans 3,000 hectares in East Java. As the region's premier industrial hub, we integrate world-class infrastructure, comprehensive utilities, and a dedicated deep-water port—providing an ecosystem built for enterprise success across diverse sectors.", cn: 'JIIPE 被列为国家战略项目，占地 3,000 公顷，位于东爪哇。' },
  paragraph_2: { en: "JIIPE is positioned at the core of Indonesia's economic corridor, seamlessly connected to major transportation networks, offering unparalleled advantages for enterprises seeking to establish or expand their operations in Southeast Asia.", cn: 'JIIPE 位于印度尼西亚经济走廊的核心，与主要交通网络无缝连接。' },
  image_url: { en: '/images/jiipe-about-cover.jpg', cn: '/images/jiipe-about-cover.jpg' },
  video_url: { en: 'https://ik.imagekit.io/z3fiyhjnl/Rev3%20-%20Chinese%20Company%20at%20JIIPE.mp4', cn: 'https://ik.imagekit.io/z3fiyhjnl/Rev3%20-%20Chinese%20Company%20at%20JIIPE.mp4' },
  features: { en: JSON.stringify(['Strategic Location', 'Deep Water Port', 'Integrated Utilities', 'Energy Security', 'Tax Incentives', 'Skilled Workforce']), cn: JSON.stringify(['战略位置', '深水港口', '综合配套设施', '能源安全', '税收优惠', '技术人才']) },
};

function get(content: AboutContent, key: keyof typeof defaults): string {
  return (content[key] as any)?.[lang] ?? defaults[key][lang];
}

export default function AboutSection({ initialData }: { initialData?: AboutContent }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });
  const [content, setContent] = useState<AboutContent>(initialData || {});

  // Video Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const milestoneRef = useRef(new Set<number>());

  const handleOpenVideo = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsVideoModalOpen(true);
    setIsVideoLoading(true);
    milestoneRef.current.clear();
    
    // Lock body scroll
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';

    // Analytics hook
    if (typeof window !== 'undefined') {
      if ((window as any)._hmt) {
        (window as any)._hmt.push(['_trackEvent', 'Video', 'Play', 'About JIIPE Video']);
      } else if ((window as any).gtag) {
        (window as any).gtag('event', 'video_open', { video_title: 'About JIIPE Video' });
      } else {
        console.log('Event: video_open');
      }
    }
  };

  const handleCloseVideo = () => {
    setIsClosing(true);
    
    // Unlock body scroll
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    // Analytics hook
    if (typeof window !== 'undefined') {
      if ((window as any)._hmt) {
        (window as any)._hmt.push(['_trackEvent', 'Video', 'Close', 'About JIIPE Video']);
      } else if ((window as any).gtag) {
        (window as any).gtag('event', 'video_close', { video_title: 'About JIIPE Video' });
      } else {
        console.log('Event: video_close');
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

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const { currentTime, duration } = videoRef.current;
    if (!duration) return;

    const percent = (currentTime / duration) * 100;
    const milestones = [25, 50, 75, 100];

    milestones.forEach(m => {
      if (percent >= m && !milestoneRef.current.has(m)) {
        milestoneRef.current.add(m);
        if (typeof window !== 'undefined') {
          if ((window as any)._hmt) {
            (window as any)._hmt.push(['_trackEvent', 'Video', `Milestone ${m}%`, 'About JIIPE Video']);
          } else if ((window as any).gtag) {
            (window as any).gtag('event', `video_milestone_${m}`, { video_title: 'About JIIPE Video' });
          } else {
            console.log(`Event: video_milestone_${m}%`);
          }
        }
      }
    });
  };

  const handleSeeked = () => {
    if (!videoRef.current) return;
    if (videoRef.current.currentTime < 1) {
      milestoneRef.current.clear();
    }
  };

  useEffect(() => {
    fetch('/api/site-content?section=about')
      .then(r => r.json())
      .then(data => setContent(data.data ?? {}))
      .catch(() => {});
  }, []);

  const videoLink = get(content, 'video_url');
  const imageUrl = get(content, 'image_url');

  let features: string[] = [];
  try { features = JSON.parse(get(content, 'features')); } catch { features = ['Strategic Location', 'Deep Water Port', 'Integrated Utilities', 'Energy Security', 'Tax Incentives', 'Skilled Workforce']; }

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* --- Image Side --- */}
          <div
            ref={ref}
            className={cn("relative overflow-hidden rounded-lg opacity-0 transition-all duration-1000 ease-out", isInView && "opacity-100 translate-x-0")}
            style={{ transform: isInView ? "translateX(0)" : "translateX(-50px)" }}
          >
            <div className="aspect-video overflow-hidden rounded-lg shadow-xl relative group">
              <Image
                src={imageUrl}
                alt="JIIPE Gate"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />

              <div className="absolute inset-0 bg-black/10 pointer-events-none" />

              <button onClick={handleOpenVideo} className="absolute inset-0 flex items-center justify-center z-20 group/play cursor-pointer border-none bg-transparent">
                <div className="relative flex items-center justify-center">
                  <span className="absolute h-full w-full rounded-full bg-white opacity-30 animate-ping duration-1000" />
                  <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white bg-white/10 backdrop-blur-sm shadow-xl transition-all duration-300 group-hover/play:scale-110">
                    <svg className="w-9 h-9 md:w-10 md:h-10 text-white fill-white translate-x-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
              </button>

              <button onClick={handleOpenVideo} className="hidden md:inline-flex absolute bottom-5 left-5 z-30 group/capsule border-none bg-transparent text-left">
                <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-white/50 transition-all duration-300 transform group-hover/capsule:-translate-y-1 group-hover/capsule:shadow-xl">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 shrink-0">
                    <Play className="h-4 w-4 text-red-600 fill-red-600 ml-0.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-gray-500 tracking-wider leading-none mb-1">Click to Play</span>
                    <span className="text-base font-bold text-gray-900 leading-none">Watch Video</span>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>

            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
          </div>

          {/* --- Content Side --- */}
          <div>
            <div className="flex flex-col gap-2">
              <h2 className={cn("text-sm uppercase font-semibold tracking-wider text-primary mb-2 opacity-0 transition-all duration-700 ease-out", isInView && "opacity-100 translate-y-0")} style={{ transitionDelay: "200ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}>
                {get(content, 'label')}
              </h2>
              <h3 className={cn("text-3xl md:text-4xl font-bold mb-6 opacity-0 transition-all duration-700 ease-out", isInView && "opacity-100 translate-y-0")} style={{ transitionDelay: "400ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}>
                {get(content, 'heading')}
              </h3>
              <p className={cn("text-gray-600 dark:text-gray-400 mb-6 opacity-0 transition-all duration-700 ease-out", isInView && "opacity-100 translate-y-0")} style={{ transitionDelay: "600ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}>
                {get(content, 'paragraph_1')}
              </p>
              <p className={cn("text-gray-600 dark:text-gray-400 mb-8 opacity-0 transition-all duration-700 ease-out", isInView && "opacity-100 translate-y-0")} style={{ transitionDelay: "800ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}>
                {get(content, 'paragraph_2')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={feature} className={cn("flex items-center gap-3 opacity-0 transition-all duration-700 ease-out", isInView && "opacity-100 translate-y-0")} style={{ transitionDelay: `${1000 + index * 100}ms`, transform: isInView ? "translateY(0)" : "translateY(20px)" }}>
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
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
              "relative w-full max-w-[1100px] aspect-video rounded-lg overflow-hidden shadow-2xl transition-transform duration-300",
              isClosing ? "scale-95" : "scale-100"
            )}
            style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button inside modal container but floating top right */}
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

            {isVideoLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10">
                <Loader2 className="w-10 h-10 text-[#DA291C] animate-spin mb-3" />
                <span className="text-white text-sm" style={{ fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif' }}>加载中...</span>
              </div>
            )}

            <video
              ref={videoRef}
              src={videoLink}
              className="w-full h-full object-cover"
              controls
              controlsList="nodownload"
              playsInline
              preload="metadata"
              autoPlay
              onLoadedData={() => setIsVideoLoading(false)}
              onTimeUpdate={handleTimeUpdate}
              onSeeked={handleSeeked}
            >
              Your browser does not support HTML5 video.
            </video>
          </div>
        </div>
      )}
    </section>
  );
}
