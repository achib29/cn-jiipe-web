"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const allow = sessionStorage.getItem("allowThankYou");
      const name = sessionStorage.getItem("lastName");

      if (allow === "1" && name) {
        setAllowed(true);
        setLastName(name);
        setTimeout(() => {
          sessionStorage.removeItem("allowThankYou");
          sessionStorage.removeItem("lastName");
        }, 2000);
      } else {
        router.replace("/");
      }
    }
  }, [router]);

  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl px-8 py-8 max-w-sm w-full text-center">
        <svg className="mx-auto mb-4" height={56} width={56} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#22C55E" strokeWidth="2" fill="none" />
          <path
            d="M8 12.5l2.5 2.5 5-5"
            stroke="#22C55E"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h2 className="text-2xl font-semibold mb-2">
          Thank You{lastName && `, ${lastName}`}!
        </h2>
        <p className="text-gray-700 mb-6">
          Your inquiry has been received.<br />
          Our team will contact you as soon as possible.
        </p>

        {/* Chinese Desk Contact */}
        <div className="mb-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Chinese Desk Contact</h3>

          <p className="text-sm mb-2">Scan WeChat QR Code:</p>
          <img
            src="/wechat-barcode.png"
            alt="WeChat QR Code"
            className="w-32 h-32 mx-auto border rounded mb-3"
          />

          <p className="text-sm flex justify-center items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-red-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 5a2 2 0 0 1 2-2h2.28a2 2 0 0 1 1.83 1.18l1.1 2.45a2 2 0 0 1-.45 2.28l-.9.9a16 16 0 0 0 6.36 6.36l.9-.9a2 2 0 0 1 2.28-.45l2.45 1.1A2 2 0 0 1 21 18.72V21a2 2 0 0 1-2 2h-.5C8.61 23 1 15.39 1 6.5V6a2 2 0 0 1 2-1z" />
            </svg>
            电话:{" "}
            <a href="tel:+8613641501595" className="text-blue-600 underline">
              +86 136 4150 1595
            </a>
          </p>
        </div>

        {/* Button: WhatsApp */}
        <a
          href="https://wa.me/8613641501595"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center justify-center w-full px-6 py-2 bg-green-600 text-white rounded-lg font-semibold shadow hover:bg-green-700 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 58 58"
            fill="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              fill="#ffffff"
              d="M0,58l4.988-14.963C2.457,38.78,1,33.812,1,28.5C1,12.76,13.76,0,29.5,0S58,12.76,58,28.5 S45.24,57,29.5,57c-4.789,0-9.299-1.187-13.26-3.273L0,58z"
            ></path>
            <path
              fill="#16A34A"
              d="M47.683,37.985c-1.316-2.487-6.169-5.331-6.169-5.331c-1.098-0.626-2.423-0.696-3.049,0.42
              c0,0-1.577,1.891-1.978,2.163c-1.832,1.241-3.529,1.193-5.242-0.52l-3.981-3.981l-3.981-3.981c-1.713-1.713-1.761-3.41-0.52-5.242
              c0.272-0.401,2.163-1.978,2.163-1.978c1.116-0.627,1.046-1.951,0.42-3.049c0,0-2.844-4.853-5.331-6.169
              c-1.058-0.56-2.357-0.364-3.203,0.482l-1.758,1.758c-5.577,5.577-2.831,11.873,2.746,17.45l5.097,5.097l5.097,5.097
              c5.577,5.577,11.873,8.323,17.45,2.746l1.758-1.758C48.048,40.341,48.243,39.042,47.683,37.985z"
            ></path>
          </svg>
          Chat via WhatsApp
        </a>

       {/* Button: Close */}
        <button
          onClick={() => router.push("/")}
          className="mt-2 px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/90 transition w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}
