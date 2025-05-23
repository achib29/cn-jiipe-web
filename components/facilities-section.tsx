"use client";

import { useRef } from "react";
import { Anchor, Truck, Lightbulb, Building2, Warehouse } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";

export default function FacilitiesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  const facilities = [
    {
      id: "industrial-area",
      title: "Industrial Area",
      icon: <Building2 className="h-10 w-10 mb-4 text-primary" />,
      description: "A 1,800-hectare industrial zone designed to accommodate various industries with flexible lot sizes.",
      features: [
        "Flexible lot sizes from 0.5 to 50 hectares",
        "Ready-to-build land plots",
        "Dedicated areas for specific industries",
        "High-standard infrastructure and roads",
        "Modern waste management systems",
        "24/7 security and monitoring"
      ],
      image: "https://images.pexels.com/photos/247763/pexels-photo-247763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      id: "port-area",
      title: "Port Area",
      icon: <Anchor className="h-10 w-10 mb-4 text-primary" />,
      description: "A dedicated deep-sea port with modern facilities to handle various cargo types efficiently.",
      features: [
        "Deep draft berths for large vessels",
        "Multi-purpose terminal",
        "Liquid bulk terminal",
        "Container terminal",
        "Dry bulk terminal",
        "Advanced loading/unloading equipment"
      ],
      image: "https://images.pexels.com/photos/753331/pexels-photo-753331.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      id: "utilities",
      title: "Utilities",
      icon: <Lightbulb className="h-10 w-10 mb-4 text-primary" />,
      description: "Comprehensive utility systems designed to support industrial operations efficiently.",
      features: [
        "Dedicated power plant",
        "Water treatment facilities",
        "Natural gas distribution",
        "Telecommunications infrastructure",
        "Wastewater treatment plant",
        "Sustainable energy options"
      ],
      image: "https://images.pexels.com/photos/2581437/pexels-photo-2581437.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      id: "infrastructure",
      title: "Infrastructure",
      icon: <Truck className="h-10 w-10 mb-4 text-primary" />,
      description: "Well-planned infrastructure network facilitating seamless connectivity within and outside the estate.",
      features: [
        "Internal road network",
        "Railway connectivity",
        "Proximity to major highways",
        "Drainage systems",
        "Flood control measures",
        "Public transport facilities"
      ],
      image: "https://images.pexels.com/photos/4429854/pexels-photo-4429854.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      id: "residential",
      title: "Residential Area",
      icon: <Warehouse className="h-10 w-10 mb-4 text-primary" />,
      description: "Purpose-built residential areas providing comfortable living spaces for the workforce.",
      features: [
        "Employee housing facilities",
        "Executive residences",
        "Commercial spaces",
        "Educational institutions",
        "Healthcare facilities",
        "Recreational areas"
      ],
      image: "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  ];

  return (
    <section id="facilities" ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className={cn(
              "text-sm uppercase font-semibold tracking-wider text-primary mb-2 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "200ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
          >
            Our Facilities
          </h2>
          <h3
            className={cn(
              "text-3xl md:text-4xl font-bold mb-6 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "400ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
          >
            World-Class Industrial & Port Facilities
          </h3>
          <p
            className={cn(
              "text-gray-600 dark:text-gray-400 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "600ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
          >
            JIIPE offers comprehensive facilities designed to support various industries with cutting-edge infrastructure, utilities, and logistics capabilities.
          </p>
        </div>

        <Tabs defaultValue="industrial-area" className="w-full">
          <TabsList className="w-full flex flex-wrap justify-center mb-8 bg-gray-100 dark:bg-gray-800">
            {facilities.map((facility, index) => (
              <TabsTrigger
                key={facility.id}
                value={facility.id}
                className={cn(
                  "opacity-0 transition-all duration-700 ease-out",
                  isInView && "opacity-100 translate-y-0"
                )}
                style={{ transitionDelay: `${800 + index * 100}ms`, transform: isInView ? "translateY(0)" : "translateY(20px)" }}
              >
                {facility.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {facilities.map((facility, index) => (
            <TabsContent 
              key={facility.id} 
              value={facility.id}
              className={cn(
                "opacity-0 transition-all duration-1000 ease-out",
                isInView && "opacity-100 translate-y-0"
              )}
              style={{ transitionDelay: "1200ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <Card className="border-0 shadow-lg overflow-hidden">
                  <div className="aspect-video w-full">
                    <img
                      src={facility.image}
                      alt={facility.title}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </Card>
                
                <div>
                  <CardHeader>
                    <div className="mb-4">{facility.icon}</div>
                    <CardTitle className="text-2xl">{facility.title}</CardTitle>
                    <CardDescription className="text-base">
                      {facility.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {facility.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2">
                          <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-primary h-3 w-3"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
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