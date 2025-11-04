import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from '@/components/theme-provider';
import ClientRoot from '@/components/ClientRoot';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JIIPE-吉配工业园官网-印尼吉配经济特区',
  description:
    'Strategic industrial port estate in East Java, Indonesia offering world-class infrastructure and facilities for industrial and logistics operations.',
  icons: {
    icon: '/jiipe-favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-YR9GTV5FCH"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YR9GTV5FCH');
          `}
        </Script>

        {/* Cloudflare Turnstile */}
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />

        {/* Baidu Analytics */}
        <Script id="baidu-analytics" strategy="afterInteractive">
          {`
            var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?11d4567d21afc44b50922f500bef6a4c";
              var s = document.getElementsByTagName("script")[0];
              s.parentNode.insertBefore(hm, s);
            })();
          `}
        </Script>

        {/* Baidu AGL Basic Code */}
        <Script id="baidu-agl-base" strategy="afterInteractive">
          {`
            window._agl = window._agl || [];
            (function () {
              _agl.push(['production', '_f7L2XwGXjyszb4d1e2oxPybgD']);
              (function () {
                var agl = document.createElement('script');
                agl.type = 'text/javascript';
                agl.async = true;
                agl.src = 'https://fxgate.baidu.com/angelia/fcagl.js?production=_f7L2XwGXjyszb4d1e2oxPybgD';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(agl, s);
              })();
            })();
          `}
        </Script>

        {/* Baidu Tongji Tracking Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var _hmt = _hmt || [];
              (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?2c4fddebd05fedfb3cd6366fdb39bec6";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
              })();`,
          }}
        </script>
        
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ClientRoot>{children}</ClientRoot>
        </ThemeProvider>
        {/* Vercel Analytics */}
        <Analytics />
        {/* Vercel Speed Insights */}
        <SpeedInsights />
      </body>
    </html>
  );
}
