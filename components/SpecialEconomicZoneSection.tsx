"use client";

import { useState, useEffect } from "react";
import { FileText, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface IncentiveItem { title: string; desc: string; legal_basis?: string; }
interface SEZTab { key: string; label: string; items: IncentiveItem[]; }
interface SEZContent {
  label?: { en: string | null; cn: string | null };
  heading?: { en: string | null; cn: string | null };
  description?: { en: string | null; cn: string | null };
  tab_fiscal_label?: { en: string | null; cn: string | null };
  tab_fiscal_items?: { en: string | null; cn: string | null };
  tab_nonfiscal_label?: { en: string | null; cn: string | null };
  tab_nonfiscal_items?: { en: string | null; cn: string | null };
}

const lang = "cn";

const DEFAULT: SEZContent = {
  label: { en: "Special Economic Zone", cn: "经济特区" },
  heading: { en: "Exclusive SEZ Incentives & Benefits", cn: "独家经济特区激励措施与优惠" },
  description: {
    en: "As a designated Special Economic Zone (SEZ), JIIPE offers the highest level of fiscal and non-fiscal incentives in Indonesia. We provide a pro-business environment designed to accelerate your ROI through tax holidays, simplified licensing, and regulatory support.",
    cn: "作为指定的经济特区（SEZ），JIIPE 提供印度尼西亚最高水平的财政和非财政激励措施。我们提供有利于商业的环境，通过税收假期、简化许可证和监管支持来加速您的投资回报率。",
  },
  tab_fiscal_label: { en: "Fiscal Incentives", cn: "财政激励" },
  tab_fiscal_items: {
    en: JSON.stringify([
      { title: "VAT and Luxury Tax Exemptions", desc: "Exemption from VAT for taxable goods/services transactions in free zones/bonded zones" },
      { title: "Customs & Import Duty Exemptions", desc: "Exemption or deferral of import duties for capital goods and raw materials." },
      { title: "Local Tax Incentives", desc: "Benefit from a 50%-100% reduction in local taxes and/or local administrative fees." },
    ] as IncentiveItem[]),
    cn: JSON.stringify([
      { title: "增值税及奢侈品税豁免", desc: "对自由区/保税区内的应税商品/服务交易免征增值税" },
      { title: "关税及进口税豁免", desc: "对资本货物和原材料的进口关税豁免或延期缴纳。" },
      { title: "地方税激励", desc: "享受地方税及/或地方行政费用50%-100%的减免。" },
    ] as IncentiveItem[]),
  },
  tab_nonfiscal_label: { en: "Non-Fiscal Facilitation Measures", cn: "非财政便利措施" },
  tab_nonfiscal_items: {
    en: JSON.stringify([
      { title: "Integrated One-Stop Service", desc: "Streamlined licensing and non-licensing services managed directly by the SEZ Administrator." },
      { title: "Simplified Construction Licensing", desc: "Construction permits are expedited under the Estate's integrated regulations, eliminating bureaucratic delays." },
      { title: "Secure Long-Term Land Tenure", desc: "Obtain land use rights and ownership for up to 80 years through expedited procedures" },
      { title: "Visa & Residency Support", desc: "Visa on arrival extension, residence permits for foreigners and their families, permanent residency for owners" },
      { title: "Unrestricted Import Policy", desc: "Exemption from import restrictions for goods used within the SEZ." },
      { title: "Integrated Environmental Licensing", desc: "Streamlined environmental approval process facilitated directly within the estate." },
      { title: "Export Obligation Exemption", desc: "No mandatory export requirements for resident enterprises" },
      { title: "Consumption Tax Policies", desc: "Not applicable to goods within the economic special zone under specific terms" },
    ] as IncentiveItem[]),
    cn: JSON.stringify([
      { title: "综合一站式服务", desc: "由经济特区管理机构直接管理的简化许可证及非许可证服务。" },
      { title: "简化建筑许可证", desc: "在园区综合法规下加快施工许可证审批，消除官僚拖延。" },
      { title: "安全的长期土地使用权", desc: "通过加快程序获得长达80年的土地使用权和所有权" },
      { title: "签证及居留支持", desc: "落地签延期、外籍人士及家属居留许可、业主永久居留权" },
      { title: "无限制进口政策", desc: "对在经济特区内使用的商品免除进口限制。" },
      { title: "综合环境许可证", desc: "在园区内直接办理的简化环境审批程序。" },
      { title: "出口义务豁免", desc: "园区内企业无强制性出口要求" },
      { title: "消费税政策", desc: "在特定条件下不适用于经济特区内的商品" },
    ] as IncentiveItem[]),
  },
};

function get(content: SEZContent, key: keyof SEZContent): string {
  return (content[key] as any)?.[lang] ?? (DEFAULT[key] as any)?.[lang] ?? "";
}

function parseItems(raw: string): IncentiveItem[] {
  try { return JSON.parse(raw); } catch { return []; }
}

export default function SEZSection({ initialData }: { initialData?: SEZContent }) {
  const [content, setContent] = useState<SEZContent>(initialData || DEFAULT);
  const [activeTabKey, setActiveTabKey] = useState("fiscal");

  useEffect(() => {
    fetch("/api/site-content?section=sez")
      .then(r => r.json())
      .then(data => { if (data.data) setContent(data.data); })
      .catch(() => {});
  }, []);

  const tabs: SEZTab[] = [
    {
      key: "fiscal",
      label: get(content, "tab_fiscal_label"),
      items: parseItems(get(content, "tab_fiscal_items")),
    },
    {
      key: "nonfiscal",
      label: get(content, "tab_nonfiscal_label"),
      items: parseItems(get(content, "tab_nonfiscal_items")),
    },
  ];

  const activeTab = tabs.find(t => t.key === activeTabKey) ?? tabs[0];
  const tabIcons: Record<string, React.ElementType> = { fiscal: FileText, nonfiscal: ShieldCheck };

  return (
    <section className="py-20 bg-white dark:bg-gray-900" id="sez">
      <div className="container mx-auto px-4">
        {/* Title & Description */}
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h2 className="text-sm uppercase text-primary font-semibold mb-2">{get(content, "label")}</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">{get(content, "heading")}</h3>
          <p className="text-gray-600 dark:text-gray-300">{get(content, "description")}</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {tabs.map((tab) => {
            const Icon = tabIcons[tab.key] ?? FileText;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTabKey(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200",
                  activeTabKey === tab.key
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-primary hover:text-white hover:border-primary"
                )}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Incentive Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab.items.map((item, idx) => (
            <div
              key={idx}
              className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition"
            >
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{item.title}</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
              {item.legal_basis && (
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 italic">
                  {item.legal_basis}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}