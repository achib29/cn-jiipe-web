"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <picture className="absolute inset-0 z-0 block w-full h-full">
        <source
          media="(min-width: 768px)"
          srcSet="https://ik.imagekit.io/z3fiyhjnl/jiipe-gresik7.jpg?updatedAt=1764314866627"
        />
        <img
          src="https://ik.imagekit.io/z3fiyhjnl/Mobile-jiipe-gresik7.jpg"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
      </picture>

      {/* Hero Content */}
      <div className="container mx-auto px-4 z-10 mt-[-60px] sm:mt-16 md:mt-20">
        <div className="max-w-[90%] sm:max-w-xl md:max-w-3xl">
          {/* ✅ Ukuran heading lebih kecil di layar sempit */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="whitespace-nowrap">印度尼西亚首屈一指的</span>
            <br />
            <span className="whitespace-nowrap">临港综合工业园区</span>
          </h1>

          {/* ✅ Deskripsi optimal untuk 3 baris di mobile */}
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-[90%] sm:max-w-full">
            战略区位，配备世界级基础设施、专属深水港及全方位公用设施、<br />
            助力您的业务增长。
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="#facilities" passHref legacyBehavior>
              <a>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90"
                >
                  探索设施
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </Link>

            <Link href="#contact" passHref>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white/10"
              >
                联系我们
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
        <div className="w-1 h-10 relative">
          <div className="absolute inset-0 bg-white rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
