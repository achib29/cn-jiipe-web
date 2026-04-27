// app/articles/[slug]/layout.tsx
// Standalone layout — overrides root layout, NO Navbar or Footer
// Tracking scripts are explicitly declared here because this layout
// does NOT inherit from app/layout.tsx.
import type { Metadata } from 'next';
import Script from 'next/script';
import '../../../app/globals.css';

export const metadata: Metadata = {
  title: 'JIIPE Industrial Article',
};

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
      <head>
        {/* ── GA4 Primary Tag (G-YR9GTV5FCH) ── */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-YR9GTV5FCH"
        />
        <Script id="ga4-article-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YR9GTV5FCH', { page_path: window.location.pathname, send_page_view: true });
            gtag('config', 'G-ZFDDK9WTWN');
          `}
        </Script>

        {/* ── Baidu Tongji ── */}
        <Script id="baidu-tongji-article" strategy="afterInteractive">
          {`
            var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.src = "https://hm.baidu.com/hm.js?2c4fddebd05fedfb3cd6366fdb39bec6";
              var s = document.getElementsByTagName("script")[0];
              s.parentNode.insertBefore(hm, s);
            })();
          `}
        </Script>

        {/* ── Baidu Conversion Tracking Base Code ── */}
        <Script id="baidu-agl-article" strategy="afterInteractive">
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
      </head>
      <body>
        {/* ── GTM Container (CN) ── */}
        <Script id="gtm-article" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PCRK853V');
          `}
        </Script>
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PCRK853V"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <div className="min-h-screen bg-white">
          {children}
        </div>
      </body>
    </html>
  );
}
