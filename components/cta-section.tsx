"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  return (
    <section
      ref={ref}
      className="py-20 bg-primary text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className={cn(
              "text-3xl md:text-4xl lg:text-5xl font-bold mb-6 opacity-0 transition-all duration-1000 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "200ms", transform: isInView ? "translateY(0)" : "translateY(30px)" }}
          >
            Ready to Grow Your Business with JIIPE?
          </h2>
          
          <p
            className={cn(
              "text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto opacity-0 transition-all duration-1000 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "400ms", transform: isInView ? "translateY(0)" : "translateY(30px)" }}
          >
            Join the growing community of businesses that have chosen JIIPE as their strategic location for success in Indonesia and Southeast Asia.
          </p>
          
          <div
            className={cn(
              "flex flex-col sm:flex-row gap-4 justify-center opacity-0 transition-all duration-1000 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "600ms", transform: isInView ? "translateY(0)" : "translateY(30px)" }}
          >
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
            >
              Contact Our Team
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="border-white text-white hover:bg-white/30"
            >
              Download Brochure
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}