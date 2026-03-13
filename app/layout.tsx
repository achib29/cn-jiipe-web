import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import ClientRoot from '@/components/ClientRoot';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

// 1. IMPORT LIBRARY GOOGLE (Penting)
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';

// CMS Fetch for Layout components like Footer
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export const dynamic = 'force-dynamic';

async function getFooterContent() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT field_key, value_en, value_cn FROM site_content WHERE section = ?', ['footer']);
    const result: Record<string, { en: string | null; cn: string | null }> = {};
    for (const row of rows) {
      result[row.field_key] = { en: row.value_en, cn: row.value_cn };
    }
    return result;
  } catch (error) {
    console.error('Failed to fetch footer content SSR:', error);
    return {};
  }
}

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://cn.jiipe.com'),
  title: {
    default: 'JIIPE-吉配工业园官网-印尼吉配经济特区',
    template: '%s | JIIPE-吉配工业园官网',
  },
  description: 'Strategic industrial port estate in East Java, Indonesia offering world-class infrastructure and facilities for industrial and logistics operations.',
  keywords: ['JIIPE', '吉配工业园', '印尼工业园', 'East Java Industrial Estate', 'Port Estate', 'Gresik Industrial Estate'],
  icons: {
    icon: '/jiipe-favicon.png',
    apple: '/jiipe-favicon.png',
  },
  openGraph: {
    title: 'JIIPE-吉配工业园官网-印尼吉配经济特区',
    description: 'Strategic industrial port estate in East Java, Indonesia offering world-class infrastructure and facilities for industrial and logistics operations.',
    url: 'https://cn.jiipe.com',
    siteName: 'JIIPE-吉配工业园官网',
    images: [
      {
        url: '/logo-jiipe-red.png',
        width: 1200,
        height: 630,
        alt: 'JIIPE Logo',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JIIPE-吉配工业园官网',
    description: 'Strategic industrial port estate in East Java, Indonesia.',
    images: ['/logo-jiipe-red.png'],
  },
  verification: {
    google: '86od0FYRxpvcfqBnd-v-COuZGRJSeGHksBNdS_1Zafc',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerData = await getFooterContent();

  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* ClientScripts (Baidu) berjalan di dalam ClientRoot ini */}
          <ClientRoot footerData={footerData as any}>{children}</ClientRoot>
        </ThemeProvider>

        {/* Vercel Analytics */}
        <Analytics />
        <SpeedInsights />

        {/* === SETUP GOOGLE KHUSUS CN === */}

        {/* 1. GTM Container KHUSUS CN (ID BARU: GTM-PCRK853V) */}
        {/* Ini sesuai request kode script yang baru saja Anda kirim */}
        <GoogleTagManager gtmId="GTM-PCRK853V" />

        {/* 2. Google Ads Tag (ID: G-ZFDDK9WTWN) */}
        {/* Tetap dipasang agar alat cek vendor mendeteksi "Tag Ads" dan statusnya hijau */}
        <GoogleAnalytics gaId="G-ZFDDK9WTWN" />

      </body>
    </html>
  );
}