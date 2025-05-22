"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/1554646/pexels-photo-1554646.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/60" />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 z-10 mt-20">
        <div className="max-w-3xl">
          <h1
            className={cn(
              "text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 opacity-0 transition-all duration-1000 ease-out",
              isVisible && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "200ms", transform: isVisible ? "translateY(0)" : "translateY(20px)" }}
          >
            Indonesia's Premier Integrated Industrial & Port Estate
          </h1>
          
          <p
            className={cn(
              "text-xl text-gray-200 mb-8 opacity-0 transition-all duration-1000 ease-out",
              isVisible && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "400ms", transform: isVisible ? "translateY(0)" : "translateY(20px)" }}
          >
            Strategic location with world-class infrastructure, dedicated deep-sea port, and comprehensive utilities for your business growth.
          </p>
          
          <div
            className={cn(
              "flex flex-col sm:flex-row gap-4 opacity-0 transition-all duration-1000 ease-out",
              isVisible && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "600ms", transform: isVisible ? "translateY(0)" : "translateY(20px)" }}
          >
            <Button
              size="lg"
              className="bg-primary text-white hover:bg-primary/90"
            >
              Explore Facilities
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
        <div className="w-1 h-10 relative">
          <div className="absolute inset-0 bg-white rounded-full animate-scroll-down"></div>
        </div>
      </div>
    </section>
  );
}