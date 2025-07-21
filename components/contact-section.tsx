"use client";

// ✅ Tambahkan deklarasi gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

import { useRef, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CompanyCountrySelect from "@/components/ui/CompanyCountrySelect";

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    country: "",
    reason: "",
    industry: "",
    landPlot: "",
    timeline: "",
    power: "",
    water: "",
    gas: "",
    seaport: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // ✅ Tracking Google Analytics
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "inquiry_submit", {
        event_category: "Contact Form",
        event_label: "Submit Inquiry",
      });
    }

    // ✅ Ambil token Turnstile
    const token = (
      document.querySelector(
        'input[name="cf-turnstile-response"]'
      ) as HTMLInputElement
    )?.value;

    if (!token) {
      alert("Turnstile verification failed. Please refresh and try again.");
      return;
    }

    // ✅ Kirim inquiry
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        cfTurnstileResponse: token,
      }),
    });

    if (res.ok) {
      alert("Inquiry sent successfully!");
    } else {
      alert("Failed to send inquiry.");
    }
  };

  return (
    <section id="contact" ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className={cn(
              "text-sm uppercase font-semibold tracking-wider text-primary mb-2 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
          >
            联系我们
          </h2>
          <h3
            className={cn(
              "text-3xl md:text-4xl font-bold mb-6 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
          >
            欢迎咨询园区招商专员
          </h3>
        </div>

        <Card
          className={cn(
            "max-w-4xl mx-auto border-0 shadow-xl overflow-hidden opacity-0 transition-all duration-1000 ease-out",
            isInView && "opacity-100 translate-y-0"
          )}
        >
          <CardContent className="p-4 md:p-10">
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* Nama */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-medium">名字*</Label>
                  <Input name="firstName" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">姓氏*</Label>
                  <Input name="lastName" onChange={handleChange} required />
                </div>
              </div>

              {/* Kontak */}
              <div className="space-y-2">
                <Label className="font-medium">手机号码*</Label>
                <Input name="phone" onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label className="font-medium">电子邮箱*</Label>
                <Input name="email" type="email" onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label className="font-medium">公司名称*</Label>
                <Input name="company" onChange={handleChange} required />
              </div>

              {/* Negara */}
              <div className="space-y-2">
                <CompanyCountrySelect
                  onChange={(val) => setFormData((prev) => ({ ...prev, country: val }))}
                />
              </div>

              {/* Alasan */}
              <div className="space-y-2">
                <Label className="font-medium">考虑JIIPE的原因*</Label>
                <RadioGroup
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, reason: val }))}
                  className="flex flex-col gap-2 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Market" id="market" />
                    <Label htmlFor="market">市场拓展</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Seaport" id="seaport" />
                    <Label htmlFor="seaport">港口需求</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Other" id="other" />
                    <Label htmlFor="other">其他（请注明</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Bidang & Waktu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-medium">所属行业*</Label>
                  <select
                    name="industry"
                    className="w-full border rounded-md p-2"
                    onChange={handleChange}
                    required
                  >
                    <option value="">请选择行业类别</option>
                    <option value="Chemical">Chemical</option>
                    <option value="Energy">Energy</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Metal">Metal</option>
                    <option value="Supporting & Logistic">Supporting & Logistic</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">所需工业用地面积（公顷）*</Label>
                  <Input name="landPlot" type="number" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">预计建设需时*</Label>
                  <select
                    name="timeline"
                    className="w-full border rounded-md p-2"
                    onChange={handleChange}
                    required
                  >
                    <option value="">请选择时长</option>
                    <option value="0-6 months">0–6 months</option>
                    <option value="6-12 months">6–12 months</option>
                    <option value="12-24 months">12–24 months</option>
                    <option value="> 24 months">More than 24 months</option>
                  </select>
                </div>
              </div>

              {/* Utilitas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-medium">所需电力总量（兆瓦）*</Label>
                  <Input name="power" type="number" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">所需工业用水总量（立方米/天）*</Label>
                  <Input name="water" type="number" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">所需天然气总量（百万英热单位/年）*</Label>
                  <Input name="gas" type="number" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">预计港口吞吐量（吨/年）*</Label>
                  <Input name="seaport" type="number" onChange={handleChange} required />
                </div>
              </div>

              {/* Turnstile */}
              <div className="mt-4">
                <div
                  className="cf-turnstile"
                  data-sitekey="0x4AAAAAABjC5aD3ciiyisDM"
                ></div>
              </div>

              {/* Submit */}
              <Button type="submit" size="lg" className="w-full mt-6">
                立即咨询
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
