import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo + Deskripsi + Sosmed */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Image
                src="/logo-jiipe-white.png"
                alt="JIIPE Logo"
                width={140}
                height={48}
                className="object-contain max-h-12 w-auto"
                priority
              />
            </div>
            <p className="text-gray-400 max-w-xs">
              印度尼西亚东爪哇的一个集战略工业园区与深水港于一体的综合性项目 <br />
              【印尼锦石经济特区】一个集战略工业园区与深水港于一体的综合性项目
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/jiipe.gresik"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Link>
              <Link
                href="https://www.youtube.com/@jiipeofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-2C18.88 4 12 4 12 4s-6.88 0-8.59.42a2.78 2.78 0 0 0-1.95 2A28.94 28.94 0 0 0 1 12a28.94 28.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 2C5.12 20 12 20 12 20s6.88 0 8.59-.42a2.78 2.78 0 0 0 1.95-2A28.94 28.94 0 0 0 23 12a28.94 28.94 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                </svg>
              </Link>
              <Link
                href="https://www.instagram.com/jiipe.official"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </Link>
              <Link
                href="https://www.linkedin.com/company/jiipeofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#home" className="text-gray-400 hover:text-white">
                  首页
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-400 hover:text-white">
                  关于我们
                </Link>
              </li>
              <li>
                <Link
                  href="#facilities"
                  className="text-gray-400 hover:text-white"
                >
                  设施概览
                </Link>
              </li>
              <li>
                <Link
                  href="#location"
                  className="text-gray-400 hover:text-white"
                >
                  地理位置
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-gray-400 hover:text-white"
                >
                  联系方式
                </Link>
              </li>
              {/* 🔥 Link baru ke News Center */}
              <li>
                <Link href="/news" className="text-gray-400 hover:text-white">
                  新闻中心
                </Link>
              </li>
            </ul>
          </div>

          {/* Facilities Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">设施详情</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#industrial-area"
                  className="text-gray-400 hover:text-white"
                >
                  工业区
                </Link>
              </li>
              <li>
                <Link
                  href="#port-area"
                  className="text-gray-400 hover:text-white"
                >
                  港口区
                </Link>
              </li>
              <li>
                <Link
                  href="#utilities"
                  className="text-gray-400 hover:text-white"
                >
                  公用设施
                </Link>
              </li>
              <li>
                <Link
                  href="#infrastructure"
                  className="text-gray-400 hover:text-white"
                >
                  基础设施
                </Link>
              </li>
              <li>
                <Link
                  href="#residential"
                  className="text-gray-400 hover:text-white"
                >
                  住宅区
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">联系方式</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-gray-400">印度尼西亚东爪哇省</span>
              </li>

              {/* CTA ke contact form */}
              <li className="mt-2">
                <a
                  href="/#contact"
                  className="flex items-center gap-3 text-gray-400 hover:hover:text-white font-medium"
                >
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  <span>Contact Us</span>
                </a>
              </li>

              {/* Kalau nanti mau tampilkan email lagi, bisa pakai ini:
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span className="text-gray-400">info@jiipe.com</span>
              </li> */}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} JIIPE. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-gray-400 hover:text-white text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
