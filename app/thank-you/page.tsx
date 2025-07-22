"use client";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl px-8 py-8 max-w-sm w-full text-center">
        <svg className="mx-auto mb-4" height={56} width={56} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#22C55E" strokeWidth="2" fill="none"/>
          <path d="M8 12.5l2.5 2.5 5-5" stroke="#22C55E" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h2 className="text-2xl font-semibold mb-2">Thank You!</h2>
        <p className="text-gray-700 mb-6">
          Your inquiry has been received.<br />
          Our team will contact you as soon as possible.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-2 px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/90 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
