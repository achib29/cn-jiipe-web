"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { BriefcaseBusiness, Globe, Factory } from "lucide-react";

const benefits = [
  {
    icon: <BriefcaseBusiness className="h-10 w-10 text-primary" />,
    title: "Business Incentives",
    description:
      "Enjoy fiscal and non-fiscal incentives designed to attract investors and streamline operations within the zone.",
  },
  {
    icon: <Globe className="h-10 w-10 text-primary" />,
    title: "Strategic Location",
    description:
      "Located in East Java with direct access to deep-sea port, highways, and international logistics routes.",
  },
  {
    icon: <Factory className="h-10 w-10 text-primary" />,
    title: "Integrated Facilities",
    description:
      "World-class infrastructure including utilities, port, industrial area, and residential zones in one estate.",
  },
];

export default function SpecialEconomicZoneSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  return (
    <section
      id="special-economic-zone"
      ref={ref}
      className="py-20 bg-white dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className={cn(
              "text-3xl md:text-4xl font-bold mb-6 transition-all duration-700 ease-out opacity-0",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{
              transitionDelay: "200ms",
              transform: isInView ? "translateY(0)" : "translateY(20px)",
            }}
          >
            Special Economic Zone
          </h2>
          <p
            className={cn(
              "text-gray-600 dark:text-gray-400 transition-all duration-700 ease-out opacity-0",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{
              transitionDelay: "400ms",
              transform: isInView ? "translateY(0)" : "translateY(20px)",
            }}
          >
            JIIPE is designated as a Special Economic Zone (SEZ), offering unique advantages and opportunities to companies seeking strategic growth in Indonesia.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {benefits.map((item, index) => (
            <div
              key={item.title}
              className={cn(
                "p-6 rounded-lg border shadow-lg bg-white dark:bg-gray-800 transition-all duration-700 ease-out opacity-0",
                isInView && "opacity-100 translate-y-0"
              )}
              style={{
                transitionDelay: `${600 + index * 150}ms`,
                transform: isInView ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
