"use client";

import { useEffect } from "react";

export default function BrochureTracker() {
  useEffect(() => {
    const handleDownloadClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-track="download_brochure"]');
      if (!target) return;

      // Ensure 'data-article' attribute exists, otherwise extract from URL
      const article =
        target.getAttribute("data-article") ||
        window.location.pathname.split("/").pop() ||
        "unknown";

      const eventParams = {
        article: article,
        page_type: "article",
        language: "cn",
        location: "body",
      };

      // Direct GTAG Tracking (No GTM Triggers Required)
      if (typeof window !== "undefined") {
        const w = window as any;
        w.dataLayer = w.dataLayer || [];
        if (typeof w.gtag !== "function") {
          w.gtag = function () {
            w.dataLayer.push(arguments);
          };
        }
        
        w.gtag("event", "download_brochure", eventParams);
      }
    };

    document.addEventListener("click", handleDownloadClick);

    return () => {
      document.removeEventListener("click", handleDownloadClick);
    };
  }, []);

  return null; // This component handles tracking invisibly
}
