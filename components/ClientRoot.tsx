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
            platform_id="acbaaf56-c3d3-4c77-aa37-ac44cc4c0919"
            user_id="82a18dfe-0d52-4498-9d7d-408b0af909a0"
            chatbot_id="e0a54b3e-eaf6-405d-8685-61715efd28aa"
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
