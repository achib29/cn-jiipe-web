import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JIIPE - 古能工业园官网',
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
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>

        {/* ChatSimple Widget */}
        <chat-bot
          platform_id="0633efa7-7842-4c57-be89-04ecd02cb3a3"
          user_id="5c60a06c-b262-4c9f-8a3d-225f0a49f8a0"
          chatbot_id="c4625f04-a66a-4877-8c7d-deb8a32869c7"
        >
          <a href="https://www.chatsimple.ai/?utm_source=widget&utm_medium=referral">chatsimple</a>
        </chat-bot>
        <script src="https://cdn.chatsimple.ai/chat-bot-loader.js" defer></script>
      </body>
    </html>
  );
}
