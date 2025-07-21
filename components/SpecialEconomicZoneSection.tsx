"use client";

import { useState } from "react";
import { FileText, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  {
    key: "fiscal",
    label: "财税优惠措施",
    icon: FileText,
    facilities: [
      {
        title: "增值税及奢侈品税减免",
        desc: "自由区/保税区内应税商品/服务交易免征增值税（开发商及租户适用）",
      },
      {
        title: "海关、进口关税及消费税政策",
        desc: "资本货物及消费品进口关税豁免或缓征",
      },
      {
        title: "地方税收优惠",
        desc: "享受50%-100%地方税及/或地方行政收费减免",
      },
    ],
  },
  {
    key: "nonfiscal",
    label: "Non-Fiscal Facilities",
    icon: ShieldCheck,
    facilities: [
      {
        title: "一站式服务",
        desc: "由KEK特区管理局提供涵盖执照与非执照类商务服务",
      },
      {
        title: "开发商建设许可",
        desc: "若开发商已制定园区规范，则无需申请建设许可",
      },
      {
        title: "土地权属保障",
        desc: "通过加速程序获得最长80年的土地使用权及所有权",
      },
      {
        title: "移民便利",
        desc: "落地签证延期、外籍人士及家属居留许可、业主永久居留权",
      },
      {
        title: "零负面清单",
        desc: "货物进口无限制",
      },
      {
        title: "开发商环境许可",
        desc: "环境许可证由开发商直接签发",
      },
      {
        title: "出口义务豁免",
        desc: "入驻企业无强制出口要求",
      },
      {
        title: "消费税政策",
        desc: "根据特定条款不适用于经济特区内货物",
      },
    ],
  },
];

export default function SEZSection() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <section className="py-20 bg-white dark:bg-gray-900" id="sez">
      <div className="container mx-auto px-4">
        {/* Title & Description */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h2 className="text-sm uppercase text-primary font-semibold mb-2">经济特区</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            战略性投资区域
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            经济特区（SEZ）是印尼国家战略政策的核心载体，旨在打造经济增长极、促进国民经济均衡发展、加速工业化进程并创造就业机会。该区域为国内外投资者提供最高级别的政策优惠。
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200",
                activeTab.key === tab.key
                  ? "bg-primary text-white border-primary"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-primary hover:text-white hover:border-primary"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Facility Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab.facilities.map((item, idx) => (
            <div
              key={idx}
              className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition"
            >
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {item.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 italic">
                法律依据：2021年第40号政府条例
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
