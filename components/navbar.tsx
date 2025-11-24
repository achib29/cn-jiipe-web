"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Tambah usePathname
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "首页", href: "/#home" },
  { label: "关于JIIPE", href: "/#about" },
  {
    label: "核心设施",
    href: "/#facilities",
    dropdown: [
      { label: "工业区", href: "/#industrial-area" },
      { label: "多功能港口区", href: "/#port-area" },
      { label: "公用设施", href: "/#utilities" },
    ],
  },
  { label: "战略区位", href: "/#location" },
  { label: "新闻中心", href: "/news" }, 
  { label: "联系我们", href: "/#contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Cek URL saat ini

  // Cek apakah kita sedang di Homepage ("/")
  const isHomePage = pathname === "/";

  // Tentukan apakah Navbar harus mode "Gelap/Solid" (Teks hitam, Bg Putih)
  // Mode gelap aktif jika: User scroll ke bawah ATAU kita BUKAN di homepage
  const isDarkHeader = scrolled || !isHomePage;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    router.push(href);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isDarkHeader
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo - Ganti logo merah jika mode gelap */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={isDarkHeader ? "/logo-jiipe-red.png" : "/logo-jiipe-white.png"}
            alt="JIIPE Logo"
            width={160}
            height={64}
            priority
            className="object-contain h-10 w-auto md:h-16"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) =>
            item.dropdown ? (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="link"
                    className={cn(
                      "font-medium text-base no-underline",
                      isDarkHeader
                        ? "text-gray-900 hover:text-red-600" // Ubah hover jadi merah juga
                        : "text-white hover:text-gray-200"
                    )}
                  >
                    {item.label} <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white p-2 rounded-xl shadow-xl border-gray-100">
                  {item.dropdown.map((subItem) => (
                    <DropdownMenuItem
                      key={subItem.label}
                      onSelect={() => handleNavClick(subItem.href)}
                      className="cursor-pointer py-2 px-4 hover:bg-gray-50 rounded-lg text-gray-700 font-medium"
                    >
                      {subItem.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "font-medium text-base transition-colors",
                  isDarkHeader
                    ? "text-gray-900 hover:text-red-600"
                    : "text-white hover:text-gray-200"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* CTA Button */}
        <Link href="/#contact" passHref>
          <Button 
            variant="default"
            className={cn(
                "hidden md:flex font-bold rounded-full px-6 transition-colors",
                isDarkHeader
                    ? "bg-red-600 text-white hover:bg-red-700" // Merah JIIPE
                    : "bg-white text-red-600 hover:bg-gray-100"
            )} 
            size="sm"
          >
            立即咨询
          </Button>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className={cn(
              "md:hidden p-2", 
              isDarkHeader ? "text-gray-900" : "text-white"
          )}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-100">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.dropdown ? (
                  <div className="space-y-2">
                      <div className="font-bold text-gray-900 py-2 border-b border-gray-100">
                          {item.label}
                      </div>
                      <div className="pl-4 space-y-3 mt-2">
                          {item.dropdown.map((subItem) => (
                            <button
                                key={subItem.label}
                                onClick={() => handleNavClick(subItem.href)}
                                className="block w-full text-left text-gray-600 hover:text-red-600 font-medium py-1"
                            >
                              {subItem.label}
                            </button>
                          ))}
                      </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block py-3 text-gray-900 font-bold border-b border-gray-100 hover:text-red-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <Button 
                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6"
                onClick={() => handleNavClick('/#contact')}
            >
              立即咨询
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}