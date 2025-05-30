"use client";

import { useEffect, useRef, useState } from "react";
import { Anchor, Truck, Lightbulb, Building2, Warehouse } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FacilitiesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  const facilities = [
    {
      id: "industrial-area",
      title: "Industrial Area",
      icon: <Building2 className="h-10 w-10 mb-4 text-primary" />,
      description: "...",
      features: ["..."],
      image: "..."
    },
    {
      id: "port-area",
      title: "Port Area",
      icon: <Anchor className="h-10 w-10 mb-4 text-primary" />,
      description: "...",
      features: ["..."],
      image: "..."
    },
    {
      id: "utilities",
      title: "Utilities",
      icon: <Lightbulb className="h-10 w-10 mb-4 text-primary" />,
      description: "...",
      features: ["..."],
      image: "..."
    }
  ];

  const facilityIds = facilities.map(f => f.id);

  // NEW: Handle tab switching by hash
  const [activeTab, setActiveTab] = useState("industrial-area");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (facilityIds.includes(hash)) {
        setActiveTab(hash);
        document.getElementById("facilities")?.scrollIntoView({ behavior: "smooth" });
      }
    };

    handleHashChange(); // On first load
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <section id="facilities" ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={cn("text-sm uppercase font-semibold tracking-wider text-primary mb-2", isInView && "opacity-100 translate-y-0")}>
            Our Facilities
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-6">World-Class Industrial & Port Facilities</h3>
          <p className="text-gray-600 dark:text-gray-400">
            JIIPE offers comprehensive facilities designed to support various industries with cutting-edge infrastructure, utilities, and logistics capabilities.
          </p>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex flex-wrap justify-center mb-8 bg-gray-100 dark:bg-gray-800">
            {facilities.map((facility, index) => (
              <TabsTrigger key={facility.id} value={facility.id}>
                {facility.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {facilities.map((facility) => (
            <TabsContent key={facility.id} value={facility.id}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <Card className="border-0 shadow-lg overflow-hidden">
                  <div className="aspect-video w-full">
                    <img src={facility.image} alt={facility.title} className="w-full h-full object-cover" />
                  </div>
                </Card>

                <div>
                  <CardHeader>
                    <div className="mb-4">{facility.icon}</div>
                    <CardTitle className="text-2xl">{facility.title}</CardTitle>
                    <CardDescription>{facility.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {facility.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                            <svg width="16" height="16" stroke="currentColor" fill="none">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
