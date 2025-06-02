"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  {
    label: "Facilities",
    href: "#facilities",
    dropdown: [
      { label: "Industrial Area", href: "#industrial-area" },
      { label: "Port Area", href: "#port-area" },
      { label: "Utilities", href: "#utilities" },
    ],
  },
  { label: "Location", href: "#location" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      )}
    >
      <div
        className={cn(
          "container mx-auto px-4 flex items-center justify-between transition-opacity duration-700 ease-out",
          loaded ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={scrolled ? "/logo-jiipe-red.png" : "/logo-jiipe-white.png"}
            alt="JIIPE Logo"
            width={160}
            height={64}
            className="transition-all duration-300"
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
                      "font-medium transition-colors",
                      scrolled
                        ? "text-primary"
                        : "text-white hover:text-primary/90"
                    )}
                  >
                    {item.label} <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {item.dropdown.map((subItem) => (
                    <DropdownMenuItem
                      key={subItem.label}
                      onSelect={() => {
                        window.location.hash = subItem.href;
                      }}
                      className="cursor-pointer"
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
                  "font-medium transition-colors",
                  scrolled
                    ? "text-primary"
                    : "text-white hover:text-primary/90"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* CTA Button */}
        <Link href="#contact" passHref>
          <Button variant="primary" className="hidden md:flex" size="sm">
            Get In Touch
          </Button>
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="block py-2 text-primary font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.dropdown && (
                  <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700 mt-1">
                    {item.dropdown.map((subItem) => (
                      <button
                        key={subItem.label}
                        onClick={() => {
                          setIsMenuOpen(false);
                          window.location.hash = subItem.href;
                        }}
                        className="block py-2 text-left w-full text-primary/80 font-medium"
                      >
                        {subItem.label}
                      </button>
                    ))}

                  </div>
                )}
              </div>
            ))}
            <Button variant="primary" size="sm" className="mt-2">
              Get In Touch
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
