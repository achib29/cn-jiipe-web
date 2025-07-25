"use client";

import { useRef, useEffect } from "react";
import { MapPin, Globe, Plane, Ship, Truck } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export default function LocationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  // Load 360° Tour script once after mount
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://tours.jiipe.com/public/shareScript.js";
    script.async = true;
    script.setAttribute("data-short", "5Ss66DNIH");
    script.setAttribute("data-path", "tours");
    script.setAttribute("data-is-self-hosted", "undefined");
    document.getElementById("tour-container")?.appendChild(script);
  }, []);

  const connectivityData = [
    {
      icon: <Ship className="h-6 w-6 text-primary" />,
      title: "海运",
      description: "直连爪哇海国际航运主干道",
    },
    {
      icon: <Plane className="h-6 w-6 text-primary" />,
      title: "空运",
      description: "45分钟直达朱安达国际机场",
    },
    {
      icon: <Truck className="h-6 w-6 text-primary" />,
      title: "陆运",
      description: "无缝衔接跨爪哇高速等核心干线",
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "全球通达性",
      description: "立足东南亚增长最快的经济走廊核心",
    },
  ];

  return (
    <section id="location" ref={ref} className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className={cn(
              "text-sm uppercase font-semibold tracking-wider text-primary mb-2 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "200ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
          >
            战略区位优势
          </h2>
          <h3
            className={cn(
              "text-3xl md:text-4xl font-bold mb-6 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "400ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
          >
            得天独厚，铸就成功
          </h3>
          <p
            className={cn(
              "text-gray-600 dark:text-gray-400 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "600ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
          >
            JIIPE坐落于印度尼西亚东爪哇省，通过多元交通网络高效连接国内外市场。
          </p>
        </div>

        {/* Map & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-3">
            <div
              className={cn(
                "aspect-video rounded-lg overflow-hidden shadow-xl opacity-0 transition-all duration-1000 ease-out",
                isInView && "opacity-100 translate-x-0"
              )}
              style={{ transitionDelay: "800ms", transform: isInView ? "translateX(0)" : "translateX(-30px)" }}
            >
              <div className="aspect-video overflow-hidden rounded-lg shadow-xl">
                <iframe
                  src="https://uri.amap.com/marker?position=112.606810,-7.085696"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
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
                  <h4 className="font-semibold text-lg">东爪哇核心区位</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    位于东爪哇省锦石县（Gresik），坐拥印尼工业核心地带的战略位置。
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">关键距离数据：</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• 距朱安达国际机场45分钟车程</li>
                  <li>• 距泗水市中心30分钟车程</li>
                  <li>• 距西多阿佐（Sidoarjo）和庞越（Pasuruan）工业区60分钟车程</li>
                  <li>• 直通爪哇海国际航运航线</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Judul & 360 Virtual Tour */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2
            className={cn(
              "text-sm uppercase font-semibold tracking-wider text-primary mb-2 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "200ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
          >
            虚拟实景导览
          </h2>
          <h3
            className={cn(
              "text-3xl md:text-4xl font-bold mb-6 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "400ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
          >
            360° 虚拟全景参观 JIIPE
          </h3>
          <p
            className={cn(
              "text-gray-600 dark:text-gray-400 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "600ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
          >
            通过以下虚拟导览，探索JIIPE园区的战略地理位置与关键设施。您可以沉浸式体验港口、工业区与办公区域，了解JIIPE为何是印尼及东南亚理想的投资目的地。
          </p>
        </div>

        <div id="tour-container" className="w-full h-[500px] rounded-lg overflow-hidden shadow-xl bg-gray-100" />


        {/* Connectivity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">

          {connectivityData.map((item, index) => (
            <Card
              key={index}
              className={cn(
                "border-0 shadow-md hover:shadow-lg transition-all duration-700 opacity-0 ease-out",
                isInView && "opacity-100 translate-y-0"
              )}
              style={{ transitionDelay: `${1200 + index * 100}ms`, transform: isInView ? "translateY(0)" : "translateY(30px)" }}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-primary/10 rounded-full mb-4">{item.icon}</div>
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
