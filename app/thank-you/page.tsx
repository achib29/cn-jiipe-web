'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ThankYouPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const allow = sessionStorage.getItem('allowThankYou');
    const name = sessionStorage.getItem('lastName');

    if (allow === '1' && name) {
      setAllowed(true);
      setLastName(name);

      // 🔔 Baidu AGL Conversion (type=validation)
      // Retry singkat (5x / 300ms) untuk memastikan fcagl.js sudah siap.
      let tries = 0;
      const maxTries = 5;
      const intervalMs = 300;
      const intervalId = setInterval(() => {
        try {
          if (window._agl && typeof window._agl.push === 'function') {
            // NOTE: sesuaikan { t: 3 } dengan parameter konversi dari Baidu Ads
            window._agl.push(['track', ['success', { t: 3 }]]);
            clearInterval(intervalId); // cukup sekali kirim
          }
        } catch (err) {
          console.warn('Baidu AGL tracking error:', err);
        } finally {
          tries += 1;
          if (tries >= maxTries) clearInterval(intervalId);
        }
      }, intervalMs);

      // Bersihkan flag agar tidak kebawa ke visit berikutnya
      const cleanupId = setTimeout(() => {
        sessionStorage.removeItem('allowThankYou');
        sessionStorage.removeItem('lastName');
      }, 2000);

      return () => {
        clearInterval(intervalId);
        clearTimeout(cleanupId);
      };
    } else {
      // Direct access → kembalikan ke homepage
      router.replace('/');
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
          感谢您的咨询{lastName && `, ${lastName}`}!
        </h2>
        <p className="text-gray-700 mb-6">
          我们已收到您的问询信息，<br />
          专属顾问团队会尽快与您联系。
        </p>

        {/* Chinese Desk Contact */}
        <div className="mb-6 text-center">
          <h3 className="text-lg font-semibold mb-2">中国区专属服务</h3>
          <p className="text-sm mb-2">微信扫码咨询</p>
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
            电话:{' '}
            <a href="tel:+8613641501595" className="text-blue-600 underline">
              +86 136 4150 1595
            </a>
          </p>
        </div>

        <button
          onClick={() => router.push('/')}
          className="mt-2 px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary/90 transition w-full"
        >
          关闭窗口
        </button>
      </div>
    </div>
  );
}
