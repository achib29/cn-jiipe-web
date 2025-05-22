"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Factory, Lightbulb, Droplets, FlaskRound as Flask, Atom } from "lucide-react";

const companies = [
  {
    name: "Hailiang Group",
    description: "A global leader in copper processing and non-ferrous metal manufacturing.",
    icon: <Factory className="h-12 w-12 text-primary" />,
  },
  {
    name: "Xinyi Glass Indonesia",
    description: "A major manufacturer of high-quality float glass and automotive glass.",
    icon: <Lightbulb className="h-12 w-12 text-primary" />,
  },
  {
    name: "Xinyi Solar",
    description: "A key player in photovoltaic glass and solar energy solutions.",
    icon: <Atom className="h-12 w-12 text-primary" />,
  },
  {
    name: "Hebang Biotechnology",
    description: "Specializing in green chemical production and bio-based industrial applications.",
    icon: <Flask className="h-12 w-12 text-primary" />,
  },
  {
    name: "Golden Elephant",
    description: "Known for its advanced chemical manufacturing in sulfuric acid and fertilizer production.",
    icon: <Droplets className="h-12 w-12 text-primary" />,
  },
];

export default function ChineseCompaniesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className={cn(
              "text-3xl md:text-4xl font-bold mb-6 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "200ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
          >
            Trusted by Leading Chinese Companies
          </h2>
          <p
            className={cn(
              "text-gray-600 dark:text-gray-400 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "400ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
          >
            JIIPE is already home to a growing number of successful Chinese enterprises that have chosen Indonesia as their strategic expansion hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companies.map((company, index) => (
            <Card
              key={company.name}
              className={cn(
                "border-0 shadow-lg hover:shadow-xl transition-all duration-300 opacity-0",
                isInView && "opacity-100 translate-y-0"
              )}
              style={{
                transitionDelay: `${600 + index * 100}ms`,
                transform: isInView ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-primary/10 rounded-full">
                    {company.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{company.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{company.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}