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
          platform_id="8b6373a3-874f-42e5-9db5-ba1a4bc31e1e"
          user_id="874766c7-99d6-4131-8787-9587179b88c7"
          chatbot_id="66630d29-57a0-45be-a874-c434bf526860"
        >
          <a href="https://www.chatsimple.ai/?utm_source=widget&utm_medium=referral">chatsimple</a>
        </chat-bot>
        <script src="https://cdn.chatsimple.ai/chat-bot-loader.js" defer></script>
      </body>
    </html>
  );
}
