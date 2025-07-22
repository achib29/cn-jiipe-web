"use client";

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { usePathname } from "next/navigation"; // <-- Tambah ini!
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JIIPE-吉配工业园官网-印尼吉配经济特区',
  description: 'Strategic industrial port estate in East Java, Indonesia offering world-class infrastructure and facilities for industrial and logistics operations.',
  icons: {
    icon: '/jiipe-favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Cek apakah sedang di /thank-you page
  const isThankYouPage = pathname === "/thank-you";

  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        {/* Analytics & Turnstile scripts... */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-YR9GTV5FCH" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-YR9GTV5FCH');
        `}</Script>
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
        <Script id="baidu-analytics" strategy="afterInteractive">{`
          var _hmt = _hmt || [];
          (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?11d4567d21afc44b50922f500bef6a4c";
            var s = document.getElementsByTagName("script")[0]; 
            s.parentNode.insertBefore(hm, s);
          })();
        `}</Script>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* Hanya render Navbar, Footer, dan Chat kalau BUKAN di /thank-you */}
          {!isThankYouPage && <Navbar />}
          <main>{children}</main>
          {!isThankYouPage && <Footer />}
        </ThemeProvider>

        {/* ChatSimple Widget juga hanya di non-thank-you */}
        {!isThankYouPage && (
          <>
            <chat-bot
              platform_id="8b6373a3-874f-42e5-9db5-ba1a4bc31e1e"
              user_id="874766c7-99d6-4131-8787-9587179b88c7"
              chatbot_id="66630d29-57a0-45be-a874-c434bf526860"
            >
              <a href="https://www.chatsimple.ai/?utm_source=widget&utm_medium=referral">
                chatsimple
              </a>
            </chat-bot>
            <script src="https://cdn.chatsimple.ai/chat-bot-loader.js" defer></script>
          </>
        )}
      </body>
    </html>
  );
}
