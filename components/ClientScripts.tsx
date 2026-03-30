"use client";
import Script from "next/script";

export default function ClientScripts() {
  return (
    <>
      {/* Cloudflare Turnstile */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
      />
    </>
  );
}
