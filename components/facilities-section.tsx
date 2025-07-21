"use client";

import { useRef, useEffect, useState } from "react";
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
      title: "工业区",
      icon: <Building2 className="h-10 w-10 mb-4 text-primary" />,
      description: "占地1,800公顷的产业集聚区，灵活适配多元产业需求",
      features: [
        "灵活的地块面积",
        "即用型地块",
        "产业分区",
        "高规格基建",
        "现代废物管理系统",
        "7×24安防体系"
      ],
      image: "https://ik.imagekit.io/z3fiyhjnl/PT%20Hailiang%20&%20PT%20Freeport%20Indonesia.jpg"
    },
    {
      id: "port-area",
      title: "多功能港口区",
      icon: <Anchor className="h-10 w-10 mb-4 text-primary" />,
      description: "配备现代化设施的专属深水港，高效处理各类货物",
      features: [
        "大型船舶深水泊位",
        "多用途码头",
        "液体散货码头",
        "集装箱码头",
        "干散货码头",
        "先进装卸设备"
      ],
      image: "https://ik.imagekit.io/z3fiyhjnl/JIIPE%20-%20Ports.jpg"
    },
    {
      id: "utilities",
      title: "公用设施",
      icon: <Lightbulb className="h-10 w-10 mb-4 text-primary" />,
      description: "高效支撑工业运营的综合性公用工程系统",
      features: [
        "专用发电厂",
        "水处理设施",
        "天然气供应系统",
        "电信基础设施",
        "污水处理厂",
        "可持续能源方案"
      ],
      image: "https://ik.imagekit.io/z3fiyhjnl/Utility%20Center.jpg"
    },
    {
      id: "infrastructure",
      title: "基础设施",
      icon: <Truck className="h-10 w-10 mb-4 text-primary" />,
      description: "规划完善的基础设施网络，可促进园区内外的无缝畅通连接。",
      features: [
        "内部道路网络",
        "铁路连接",
        "邻近主要高速公路",
        "排水系统",
        "防洪措施",
        "公共交通设施"
      ],
      image: "https://ik.imagekit.io/z3fiyhjnl/Gate%20-%20JIIPE.jpg"
    },
    {
      id: "residential",
      title: "住宅区",
      icon: <Warehouse className="h-10 w-10 mb-4 text-primary" />,
      description: "专为产业人才打造的高品质生活社区",
      features: [
        "员工住房",
        "行政公寓",
        "商业配套",
        "教育机构",
        "医疗设施",
        "休闲场所"
      ],
      image: "https://ik.imagekit.io/z3fiyhjnl/AKR%20LAND%201.jpg"
    }
  ];

  const [activeTab, setActiveTab] = useState("industrial-area");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const validTabs = facilities.map((f) => f.id);
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
        document.getElementById("facilities")?.scrollIntoView({ behavior: "smooth" });
      }
    };

    handleHashChange(); // apply on load
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  
  return (
    <section id="facilities" ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={cn("text-sm uppercase font-semibold tracking-wider text-primary mb-2 opacity-0 transition-all duration-700 ease-out", isInView && "opacity-100 translate-y-0")} style={{ transitionDelay: "200ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}>
            园区设施概览
          </h2>
          <h3 className={cn("text-3xl md:text-4xl font-bold mb-6 opacity-0 transition-all duration-700 ease-out", isInView && "opacity-100 translate-y-0")} style={{ transitionDelay: "400ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}>
            世界级工业园与港口设施
          </h3>
          <p className={cn("text-gray-600 dark:text-gray-400 opacity-0 transition-all duration-700 ease-out", isInView && "opacity-100 translate-y-0")} style={{ transitionDelay: "600ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}>
            JIIPE配备全方位工业设施体系，以前沿基础设施、高效公共配套及智能化物流能力，全面支撑多元产业发展。
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex flex-wrap justify-center mb-8 bg-gray-100 dark:bg-gray-800">
            {facilities.map((facility, index) => (
              <TabsTrigger key={facility.id} value={facility.id} className={cn("opacity-0 transition-all duration-700 ease-out", isInView && "opacity-100 translate-y-0")} style={{ transitionDelay: `${800 + index * 100}ms`, transform: isInView ? "translateY(0)" : "translateY(20px)" }}>
                {facility.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {facilities.map((facility, index) => (
            <TabsContent key={facility.id} value={facility.id} className={cn("opacity-0 transition-all duration-1000 ease-out", isInView && "opacity-100 translate-y-0")} style={{ transitionDelay: "1200ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}>
              {/* this div provides scroll target for anchor */}
              <div id={facility.id} className="scroll-mt-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <Card className="border-0 shadow-lg overflow-hidden">
                    <div className="aspect-video w-full">
                      <img src={facility.image} alt={facility.title} className="w-full h-full object-cover object-center" />
                    </div>
                  </Card>
                  <div>
                    <CardHeader>
                      <div className="mb-4">{facility.icon}</div>
                      <CardTitle className="text-2xl">{facility.title}</CardTitle>
                      <CardDescription className="text-base">{facility.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {facility.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-3 w-3">
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
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
