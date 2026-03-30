"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { sendGAEvent } from '@next/third-parties/google';

interface HeroContent {
  title_line1?: { en: string; cn: string };
  title_line2?: { en: string; cn: string };
  title_line3?: { en: string; cn: string };
  subtitle?: { en: string; cn: string };
  bg_image_desktop?: { en: string; cn: string };
  bg_image_mobile?: { en: string; cn: string };
  brochure_url?: { en: string; cn: string };
  btn_brochure?: { en: string; cn: string };
  btn_contact?: { en: string; cn: string };
}

const lang = "cn";

const defaults = {
  title_line1: { en: "Indonesia's Premier", cn: '印尼首席' },
  title_line2: { en: 'Integrated Industrial', cn: '综合工业' },
  title_line3: { en: 'Port Estate', cn: '港口庄园' },
  subtitle: { en: 'A strategic location featuring world-class infrastructure, a dedicated deep-water port, and comprehensive utilities designed to support your business growth.', cn: '战略位置，旨在支持您的业务增长。' },
  bg_image_desktop: { en: 'https://ik.imagekit.io/z3fiyhjnl/jiipe-gresik7.jpg?updatedAt=1764314866627', cn: 'https://ik.imagekit.io/z3fiyhjnl/jiipe-gresik7.jpg?updatedAt=1764314866627' },
  bg_image_mobile: { en: 'https://ik.imagekit.io/z3fiyhjnl/Mobile-jiipe-gresik7.jpg', cn: 'https://ik.imagekit.io/z3fiyhjnl/Mobile-jiipe-gresik7.jpg' },
  brochure_url: { en: 'https://ik.imagekit.io/z3fiyhjnl/FlyerJIIPE-EN-2025.pdf', cn: 'https://ik.imagekit.io/z3fiyhjnl/FlyerJIIPE-CN-2025.pdf' },
  btn_brochure: { en: 'Download Brochure', cn: '下载简介' },
  btn_contact: { en: 'Contact Us', cn: '联系我们' },
};

function get(content: HeroContent, key: keyof typeof defaults): string {
  return (content[key] as any)?.[lang] ?? defaults[key][lang];
}

export default function HeroSection({ initialData }: { initialData?: HeroContent }) {
  const [content, setContent] = useState<HeroContent>(initialData || {});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/site-content?section=hero')
      .then(r => r.json())
      .then(data => {
        setContent(data.data ?? {});
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const bgDesktop = get(content, 'bg_image_desktop');
  const bgMobile = get(content, 'bg_image_mobile');

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <picture className="absolute inset-0 z-0 block w-full h-full">
        <source media="(min-width: 768px)" srcSet={bgDesktop} />
        <img
          src={bgMobile}
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
      </picture>

      {/* Hero Content */}
      <div className="container mx-auto px-4 z-10 mt-[-60px] sm:mt-16 md:mt-20">
        <div className="max-w-[90%] sm:max-w-xl md:max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="whitespace-nowrap">{get(content, 'title_line1')}</span>
            <br />
            <span className="whitespace-nowrap">{get(content, 'title_line2')}</span>
            <br />
            <span className="whitespace-nowrap">{get(content, 'title_line3')}</span>
          </h1>

          <p className="whitespace-pre-line text-base sm:text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-[90%] sm:max-w-full">
            {get(content, 'subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90 gap-2"
            >
              <a
                id="btn-download-hero"
                href={get(content, 'brochure_url')}
                target="_blank"
                rel="noopener noreferrer"
                data-track="download_brochure"
                data-article="homepage-hero"
              >
                <Download className="h-4 w-4" />
                {get(content, 'btn_brochure')}
              </a>
            </Button>

            <Link href="#contact" passHref>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white/10"
              >
                {get(content, 'btn_contact')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a
        href="#about"
        aria-label="Scroll down to About section"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 group cursor-pointer"
      >
        <span className="sr-only">Scroll to learn more about JIIPE</span>
        <div className="w-1 h-10 relative">
          <div className="absolute inset-0 bg-white rounded-full animate-pulse group-hover:bg-red-400 transition-colors"></div>
        </div>
      </a>
    </section>
  );
}
