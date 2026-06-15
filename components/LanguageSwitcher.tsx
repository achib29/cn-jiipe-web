"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  variant?: "header" | "mobile" | "stickyNav";
  scrolled?: boolean;
}

export default function LanguageSwitcher({ variant = "header", scrolled = false }: LanguageSwitcherProps) {
  const [currentLang, setCurrentLang] = useState<"cn" | "en">("cn");

  useEffect(() => {
    const envLang = process.env.NEXT_PUBLIC_SITE_LANG;
    if (envLang === "en" || envLang === "cn") {
      setCurrentLang(envLang);
    } else if (typeof window !== "undefined") {
      if (window.location.hostname.includes("cn.jiipe")) {
        setCurrentLang("cn");
      } else {
        setCurrentLang("en");
      }
    }
  }, []);

  const handleSwitch = (targetLang: "cn" | "en") => {
    if (targetLang === currentLang) return;
    if (typeof window === "undefined") return;

    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const currentHash = window.location.hash;

    const cnUrl = process.env.NEXT_PUBLIC_CN_SITE_URL || "https://cn.jiipe.com";
    const enUrl = process.env.NEXT_PUBLIC_EN_SITE_URL || "https://en.jiipe.com";

    const targetDomain = targetLang === "cn" ? cnUrl : enUrl;
    const baseUrl = targetDomain.replace(/\/$/, "");

    window.location.href = `${baseUrl}${currentPath}${currentSearch}${currentHash}`;
  };

  if (variant === "mobile") {
    return (
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-full">
        <button
          type="button"
          onClick={() => handleSwitch("cn")}
          className={cn(
            "flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer",
            currentLang === "cn"
              ? "bg-red-600 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          中文 (CN)
        </button>
        <button
          type="button"
          onClick={() => handleSwitch("en")}
          className={cn(
            "flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer",
            currentLang === "en"
              ? "bg-red-600 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          English (EN)
        </button>
      </div>
    );
  }

  // StickyNav variant (e.g. on landing pages)
  if (variant === "stickyNav") {
    return (
      <div className="inline-flex items-center p-0.5 rounded-full border border-gray-200 bg-gray-50 text-xs select-none">
        <button
          type="button"
          onClick={() => handleSwitch("en")}
          className={cn(
            "px-2.5 py-1 rounded-full transition-all duration-200 font-bold text-[10px] tracking-wider cursor-pointer",
            currentLang === "en"
              ? "bg-red-600 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => handleSwitch("cn")}
          className={cn(
            "px-2.5 py-1 rounded-full transition-all duration-200 font-bold text-[10px] tracking-wider cursor-pointer",
            currentLang === "cn"
              ? "bg-red-600 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          CN
        </button>
      </div>
    );
  }

  // Header variant (capsule switch on navbar)
  const isSolid = scrolled;

  return (
    <div
      className={cn(
        "inline-flex items-center p-0.5 rounded-full border text-xs transition-all duration-300 select-none",
        isSolid
          ? "border-gray-200 bg-gray-50"
          : "border-white/20 bg-black/15 backdrop-blur-sm"
      )}
    >
      <button
        type="button"
        onClick={() => handleSwitch("en")}
        className={cn(
          "px-2.5 py-0.5 md:py-1 rounded-full transition-all duration-200 font-bold text-[10px] md:text-[11px] uppercase tracking-wider cursor-pointer",
          currentLang === "en"
            ? isSolid
              ? "bg-red-600 text-white shadow-sm"
              : "bg-white text-gray-900 shadow-sm"
            : isSolid
            ? "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
            : "text-white/70 hover:text-white hover:bg-white/10"
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handleSwitch("cn")}
        className={cn(
          "px-2.5 py-0.5 md:py-1 rounded-full transition-all duration-200 font-bold text-[10px] md:text-[11px] uppercase tracking-wider cursor-pointer",
          currentLang === "cn"
            ? isSolid
              ? "bg-red-600 text-white shadow-sm"
              : "bg-white text-gray-900 shadow-sm"
            : isSolid
            ? "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
            : "text-white/70 hover:text-white hover:bg-white/10"
        )}
      >
        中文
      </button>
    </div>
  );
}
