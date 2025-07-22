"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isThankYouPage = pathname === "/thank-you";

  return (
    <>
      {!isThankYouPage && <Navbar />}
      <main>{children}</main>
      {!isThankYouPage && <Footer />}
      {/* ChatSimple Widget */}
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
    </>
  );
}