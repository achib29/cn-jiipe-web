"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface FooterContent {
  logo?: { en: string | null; cn: string | null };
  tagline?: { en: string | null; cn: string | null };
  address?: { en: string | null; cn: string | null };
  phone?: { en: string | null; cn: string | null };
  social_fb?: { en: string | null; cn: string | null };
  social_yt?: { en: string | null; cn: string | null };
  social_ig?: { en: string | null; cn: string | null };
  social_li?: { en: string | null; cn: string | null };
  quick_links?: { en: string | null; cn: string | null };
  facilities_links?: { en: string | null; cn: string | null };
}

const lang = "cn";

const DEFAULT: FooterContent = {
  logo: { en: "/logo-jiipe-white.png", cn: "/logo-jiipe-white.png" },
  tagline: { 
    en: "A strategic integrated industrial estate and deep seaport in East Java, Indonesia.", 
    cn: "印度尼西亚东爪哇的战略综合工业区和深水海港。" 
  },
  address: { 
    en: "Jl. Raya Manyar Km. 11, Manyar-Gresik, East Java 61151", 
    cn: "Jl. Raya Manyar Km. 11, Manyar-Gresik, East Java 61151" 
  },
  phone: { en: "+623198540999", cn: "+623198540999" },
  social_fb: { en: "https://www.facebook.com/jiipe.gresik", cn: "https://www.facebook.com/jiipe.gresik" },
  social_yt: { en: "https://www.youtube.com/@jiipeofficial", cn: "https://www.youtube.com/@jiipeofficial" },
  social_ig: { en: "https://www.instagram.com/jiipe.official", cn: "https://www.instagram.com/jiipe.official" },
  social_li: { en: "https://www.linkedin.com/company/jiipeofficial", cn: "https://www.linkedin.com/company/jiipeofficial" },
  quick_links: {
    en: JSON.stringify([{ label: "Home", url: "/#home" }, { label: "About Us", url: "/#about" }, { label: "Facilities", url: "/#facilities" }, { label: "Location", url: "/#location" }, { label: "Contact", url: "/#contact" }, { label: "News/Articles", url: "/news" }]),
    cn: JSON.stringify([{ label: "首页", url: "/#home" }, { label: "关于我们", url: "/#about" }, { label: "设施概览", url: "/#facilities" }, { label: "地理位置", url: "/#location" }, { label: "联系方式", url: "/#contact" }, { label: "新闻中心", url: "/news" }])
  },
  facilities_links: {
    en: JSON.stringify([{ label: "Industrial Area", url: "/#industrial-area" }, { label: "Port Area", url: "/#port-area" }, { label: "Utilities", url: "/#utilities" }, { label: "Infrastructure", url: "/#infrastructure" }, { label: "Residential Area", url: "/#residential" }]),
    cn: JSON.stringify([{ label: "工业区", url: "/#industrial-area" }, { label: "港口区", url: "/#port-area" }, { label: "公用设施", url: "/#utilities" }, { label: "基础设施", url: "/#infrastructure" }, { label: "住宅区", url: "/#residential" }])
  }
};

function get(content: FooterContent, key: keyof FooterContent): string {
  return (content[key] as any)?.[lang] ?? (DEFAULT[key] as any)?.[lang] ?? "";
}

function parseLinks(raw: string): Array<{label: string, url: string}> {
  try { return JSON.parse(raw); } catch { return []; }
}

export default function Footer({ initialData }: { initialData?: FooterContent }) {
  const router = useRouter();
  const pathname = usePathname();

  const [content, setContent] = useState<FooterContent>(initialData || DEFAULT);

  useEffect(() => {
    fetch("/api/site-content?section=footer")
      .then(r => r.json())
      .then(data => { if (data.data) setContent(data.data); })
      .catch(() => {});
  }, []);

  const handleNavClick = (href: string) => {
    // Internal section links like "/#industrial-area"
    if (href.startsWith("/#")) {
      const hash = href.split("#")[1]; // e.g. "industrial-area"

      if (pathname === "/") {
        // Already on homepage → just change hash to trigger "hashchange"
        if (hash) {
          window.location.hash = hash;
        }
      } else {
        // From another page → go to home + hash
        router.push(href);
      }

      return;
    }

    // Normal navigation (e.g. "/news")
    router.push(href);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo + Description + Social Media */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Image
                src={get(content, "logo") || "/logo-jiipe-white.png"}
                alt="JIIPE Logo"
                width={140}
                height={48}
                className="object-contain max-h-12 w-auto"
                priority
              />
            </div>
            <p className="text-gray-400 max-w-xs whitespace-pre-line">
              {get(content, "tagline")}
            </p>
            <div className="flex space-x-4 mt-4">
              {get(content, "social_fb") && (
                <Link href={get(content, "social_fb")} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </Link>
              )}
              {get(content, "social_yt") && (
                <Link href={get(content, "social_yt")} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.59.42a2.78 2.78 0 0 0-1.95 2A28.94 28.94 0 0 0 1 12a28.94 28.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 2C5.12 20 12 20 12 20s6.88 0 8.59-.42a2.78 2.78 0 0 0 1.95-2A28.94 28.94 0 0 0 23 12a28.94 28.94 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg>
                </Link>
              )}
              {get(content, "social_ig") && (
                <Link href={get(content, "social_ig")} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </Link>
              )}
              {get(content, "social_li") && (
                <Link href={get(content, "social_li")} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">快速链接</h3>
            <ul className="space-y-2">
              {parseLinks(get(content, "quick_links")).map((link, idx) => (
                <li key={idx}>
                  {link.url.startsWith("/") && link.url.includes("#") ? (
                    <button
                      onClick={() => handleNavClick(link.url)}
                      className="text-gray-400 hover:text-white text-left"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link href={link.url} className="text-gray-400 hover:text-white">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Facilities Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">设施详情</h3>
            <ul className="space-y-2">
              {parseLinks(get(content, "facilities_links")).map((link, idx) => (
                <li key={idx}>
                  {link.url.startsWith("/") && link.url.includes("#") ? (
                    <button
                      onClick={() => handleNavClick(link.url)}
                      className="text-gray-400 hover:text-white text-left"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link href={link.url} className="text-gray-400 hover:text-white">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">联系方式</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-gray-400 whitespace-pre-line">
                  {get(content, "address")}
                </span>
              </li>

              <li className="mt-2">
                <button
                  onClick={() => handleNavClick("/#contact")}
                  className="flex items-center gap-3 text-gray-400 hover:text-white font-medium"
                >
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  <span>Contact Us</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} JIIPE. 版权所有。
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white text-sm">
              隐私政策
            </Link>
            <Link href="/terms-of-service" className="text-gray-400 hover:text-white text-sm">
              服务条款
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
