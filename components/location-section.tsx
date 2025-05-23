"use client";

import { useRef } from "react";
import { MapPin, Globe, Plane, Ship, Truck } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export default function LocationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  const connectivityData = [
    {
      icon: <Ship className="h-6 w-6 text-primary" />,
      title: "Sea Connectivity",
      description: "Direct access to international shipping routes through the Java Sea",
    },
    {
      icon: <Plane className="h-6 w-6 text-primary" />,
      title: "Air Connectivity",
      description: "45 minutes from Juanda International Airport",
    },
    {
      icon: <Truck className="h-6 w-6 text-primary" />,
      title: "Road Connectivity",
      description: "Connected to major highways for efficient land transportation",
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "Global Access",
      description: "Strategic position in Southeast Asia's growing economic corridor",
    },
  ];

  return (
    <section id="location" ref={ref} className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className={cn(
              "text-sm uppercase font-semibold tracking-wider text-primary mb-2 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "200ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
          >
            Strategic Location
          </h2>
          <h3
            className={cn(
              "text-3xl md:text-4xl font-bold mb-6 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "400ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
          >
            Perfectly Positioned for Success
          </h3>
          <p
            className={cn(
              "text-gray-600 dark:text-gray-400 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "600ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
          >
            JIIPE is strategically located in East Java, Indonesia, offering exceptional connectivity to domestic and international markets through multiple transportation networks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-3">
            <div
              className={cn(
                "aspect-video rounded-lg overflow-hidden shadow-xl opacity-0 transition-all duration-1000 ease-out",
                isInView && "opacity-100 translate-x-0"
              )}
              style={{ transitionDelay: "800ms", transform: isInView ? "translateX(0)" : "translateX(-30px)" }}
            >
              {/* Interactive Map - In a real implementation, this would be a Google Maps or similar embed */}
              <div className="w-full h-full bg-gray-200 dark:bg-gray-800 relative">
                <img
                  src="https://images.pexels.com/photos/1654748/pexels-photo-1654748.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="JIIPE Location Map"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-3 bg-primary text-white rounded-full animate-pulse">
                    <MapPin className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col justify-center">
            <div
              className={cn(
                "space-y-4 opacity-0 transition-all duration-1000 ease-out",
                isInView && "opacity-100 translate-x-0"
              )}
              style={{ transitionDelay: "1000ms", transform: isInView ? "translateX(0)" : "translateX(30px)" }}
            >
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">East Java, Indonesia</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Located in Gresik, East Java, JIIPE offers a strategic position in Indonesia's industrial heartland.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">Key Distances:</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• 45 minutes from Juanda International Airport</li>
                  <li>• 30 minutes from Surabaya city center</li>
                  <li>• 60 minutes from industrial areas in Sidoarjo and Pasuruan</li>
                  <li>• Direct access to shipping routes via Java Sea</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {connectivityData.map((item, index) => (
            <Card
              key={index}
              className={cn(
                "border-0 shadow-md hover:shadow-lg transition-all duration-300 opacity-0 transition-all duration-700 ease-out",
                isInView && "opacity-100 translate-y-0"
              )}
              style={{ transitionDelay: `${1200 + index * 100}ms`, transform: isInView ? "translateY(0)" : "translateY(30px)" }}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-full mb-4">
                    {item.icon}
                  </div>
                  <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}