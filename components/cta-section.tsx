"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { sendGAEvent } from '@next/third-parties/google';

interface CtaContent {
  [key: string]: { en: string; cn: string } | undefined;
  heading?: { en: string; cn: string };
  subtitle?: { en: string; cn: string };
  btn_contact?: { en: string; cn: string };
  btn_contact_url?: { en: string; cn: string };
  btn_brochure?: { en: string; cn: string };
  brochure_url?: { en: string; cn: string };
}

const lang = "cn";

const defaults: Record<string, { en: string; cn: string }> = {
  heading: { en: 'Ready to expand your business at JIIPE?', cn: '准备好在 JIIPE 扩展您的业务了吗？' },
  subtitle: { en: 'Join a thriving ecosystem of global leaders. Leverage JIIPE as your strategic gateway to Indonesia and Southeast Asia.', cn: '加入由全球领袖组成的蓬勃发展的生态系统。以 JIIPE 作为您进入印度尼西亚和东南亚的战略门户。' },
  btn_contact: { en: 'Contact Our Investment Team', cn: '联系我们的投资团队' },
  btn_contact_url: { en: '/#contact', cn: '/#contact' },
  btn_brochure: { en: 'Download Brochure', cn: '下载简介' },
  brochure_url: { en: 'https://ik.imagekit.io/z3fiyhjnl/FlyerJIIPE-EN-2025.pdf', cn: 'https://ik.imagekit.io/z3fiyhjnl/FlyerJIIPE-CN-2025.pdf' },
};

function get(content: CtaContent, key: keyof typeof defaults): string {
  return (content[key] as any)?.[lang] ?? defaults[key][lang];
}

export default function CTASection({ initialData }: { initialData?: CtaContent }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });
  const [content, setContent] = useState<CtaContent>(initialData || {});

  useEffect(() => {
    fetch('/api/site-content?section=cta')
      .then(r => r.json())
      .then(data => setContent(data.data ?? {}))
      .catch(() => {});
  }, []);

  return (
    <section ref={ref} className="py-20 bg-primary text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className={cn("text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center whitespace-normal md:whitespace-nowrap opacity-0 transition-all duration-1000 ease-out", isInView && "opacity-100 translate-y-0")}
            style={{ transitionDelay: "200ms", transform: isInView ? "translateY(0)" : "translateY(30px)" }}
          >
            {get(content, 'heading')}
          </h2>

          <p
            className={cn("text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto opacity-0 transition-all duration-1000 ease-out", isInView && "opacity-100 translate-y-0")}
            style={{ transitionDelay: "400ms", transform: isInView ? "translateY(0)" : "translateY(30px)" }}
          >
            {get(content, 'subtitle')}
          </p>

          <div
            className={cn("flex flex-col sm:flex-row gap-4 justify-center opacity-0 transition-all duration-1000 ease-out", isInView && "opacity-100 translate-y-0")}
            style={{ transitionDelay: "600ms", transform: isInView ? "translateY(0)" : "translateY(30px)" }}
          >
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white text-primary border border-white font-semibold px-8 shadow-md hover:bg-transparent hover:text-white hover:border-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <a href={get(content, 'btn_contact_url')}>
                {get(content, 'btn_contact')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent text-white border border-white/80 font-semibold px-8 shadow-md hover:bg-white hover:text-primary hover:border-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <a
                id="btn-download-cta"
                href={get(content, 'brochure_url')}
                target="_blank"
                rel="noopener noreferrer"
                data-track="download_brochure"
                data-article="homepage-cta"
              >
                {get(content, 'btn_brochure')}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
