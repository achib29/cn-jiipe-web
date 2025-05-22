"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2 } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div
            ref={ref}
            className={cn(
              "relative overflow-hidden rounded-lg opacity-0 transition-all duration-1000 ease-out",
              isInView && "opacity-100 translate-x-0"
            )}
            style={{ transform: isInView ? "translateX(0)" : "translateX(-50px)" }}
          >
            <div className="aspect-video overflow-hidden rounded-lg shadow-xl">
              <img
                src="https://images.pexels.com/photos/2226458/pexels-photo-2226458.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="JIIPE Industrial Port"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/30 to-transparent pointer-events-none" />
          </div>

          {/* Content Side */}
          <div>
            <div className="flex flex-col gap-2">
              <h2
                className={cn(
                  "text-sm uppercase font-semibold tracking-wider text-primary mb-2 opacity-0 transition-all duration-700 ease-out",
                  isInView && "opacity-100 translate-y-0"
                )}
                style={{ transitionDelay: "200ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
              >
                About JIIPE
              </h2>
              <h3
                className={cn(
                  "text-3xl md:text-4xl font-bold mb-6 opacity-0 transition-all duration-700 ease-out",
                  isInView && "opacity-100 translate-y-0"
                )}
                style={{ transitionDelay: "400ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
              >
                A Strategic Integrated Industrial & Port Estate
              </h3>
              <p
                className={cn(
                  "text-gray-600 dark:text-gray-400 mb-6 opacity-0 transition-all duration-700 ease-out",
                  isInView && "opacity-100 translate-y-0"
                )}
                style={{ transitionDelay: "600ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
              >
                JIIPE is a 3,000 hectare integrated industrial and port estate strategically located in East Java, Indonesia. Designed to be a center for industrial growth, JIIPE combines world-class infrastructure, utilities, and a dedicated deep-sea port to support businesses across various sectors.
              </p>
              <p
                className={cn(
                  "text-gray-600 dark:text-gray-400 mb-8 opacity-0 transition-all duration-700 ease-out",
                  isInView && "opacity-100 translate-y-0"
                )}
                style={{ transitionDelay: "800ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
              >
                With its seamless connectivity to major transportation networks and strategic location in the heart of Indonesia's economic corridor, JIIPE offers unparalleled advantages for businesses looking to establish or expand their operations in Southeast Asia.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Strategic Location",
                "Deep-sea Port Access",
                "Complete Infrastructure",
                "Power & Utilities",
                "Tax Incentives",
                "Skilled Workforce"
              ].map((feature, index) => (
                <div
                  key={feature}
                  className={cn(
                    "flex items-center gap-3 opacity-0 transition-all duration-700 ease-out",
                    isInView && "opacity-100 translate-y-0"
                  )}
                  style={{ transitionDelay: `${1000 + index * 100}ms`, transform: isInView ? "translateY(0)" : "translateY(20px)" }}
                >
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}