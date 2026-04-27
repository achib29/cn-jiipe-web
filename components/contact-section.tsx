"use client";

import React, { useRef, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CompanyCountrySelect from "@/components/ui/CompanyCountrySelect";

// Helper for Turnstile global object
declare global {
  interface Window {
    turnstile: {
      reset: (widgetId?: string) => void;
      render: (el: any, options: any) => void;
    };
  }
}

interface ContactContent {
  label?: { en: string | null; cn: string | null };
  heading?: { en: string | null; cn: string | null };
  description?: { en: string | null; cn: string | null };
}

const lang = "cn";

const DEFAULT: ContactContent = {
  label: { en: "Contact Us", cn: "联系我们" },
  heading: { en: "Connect with Our Investment Experts", cn: "联系我们的投资专家" },
  description: {
    en: "Please fill out the form below. Our investment consultants will contact you shortly to discuss your specific industrial needs.",
    cn: "请填写以下表格。我们的投资顾问将很快与您联系，讨论您的具体工业需求。"
  }
};

function get(content: ContactContent, key: keyof ContactContent): string {
  return (content[key] as any)?.[lang] ?? (DEFAULT[key] as any)?.[lang] ?? "";
}

export default function ContactSection({ initialData }: { initialData?: ContactContent }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });
  const router = useRouter();

  const [content, setContent] = React.useState<ContactContent>(initialData || DEFAULT);

  React.useEffect(() => {
    fetch("/api/site-content?section=contact")
      .then(r => r.json())
      .then(data => { if (data.data) setContent(data.data); })
      .catch(() => { });
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    country: "",
    reason: "",
    reasonOther: "",
    industry: "",
    landPlot: "",
    timeline: "",
    power: "",
    water: "",
    gas: "",
    seaport: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetTurnstile = () => {
    if (typeof window !== "undefined" && window.turnstile) {
      try {
        window.turnstile.reset();
      } catch (e) {
        console.warn("Turnstile reset failed", e);
      }
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.reason === "Other" && !formData.reasonOther.trim()) {
      alert("Please provide details for 'Other'.");
      setIsSubmitting(false);
      return;
    }

    const isLocal =
      typeof window !== "undefined" &&
      window.location.hostname === "localhost";

    const token = isLocal
      ? "bypass"
      : (
        document.querySelector(
          'input[name="cf-turnstile-response"]'
        ) as HTMLInputElement
      )?.value;

    if (!isLocal && !token) {
      alert("Turnstile verification failed. Please refresh and try again.");
      setIsSubmitting(false);
      resetTurnstile(); // Reset on missing token
      return;
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem("allowThankYou", "1");
      sessionStorage.setItem("lastName", formData.lastName);
    }

    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        ...(isLocal ? {} : { cfTurnstileResponse: token }),
      }),
    })
      .then((res) => {
        if (res.ok) {
          // Fire GA4 event before redirect
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'form_submission_success', {
              event_category: 'Contact Form',
              event_label: 'Homepage Contact Form',
              value: 1,
            });
          }
          // Fire Baidu Tongji custom event before redirect
          if (typeof window !== 'undefined' && (window as any)._hmt) {
            (window as any)._hmt.push(['_trackEvent', 'Contact Form', 'Submit', 'Homepage Contact Form']);
          }
          router.push("/thank-you");
        } else {
          alert("Submission failed. Please try again.");
          resetTurnstile(); // Reset on server error
        }
      })
      .catch((err) => {
        console.error("Background form submit failed:", err);
        alert("Submission error. Please try again.");
        resetTurnstile(); // Reset on network error
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="py-20 bg-gray-50 dark:bg-gray-900"
    >
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            className={cn(
              "text-sm uppercase font-semibold tracking-wider text-primary mb-2 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
          >
            {get(content, "label")}
          </h2>
          <h3
            className={cn(
              "text-3xl md:text-4xl font-bold mb-6 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
          >
            {get(content, "heading")}
          </h3>
          <p
            className={cn(
              "text-gray-500 text-sm md:text-base leading-relaxed opacity-0 transition-all duration-700 ease-out whitespace-pre-line",
              isInView && "opacity-100 translate-y-0"
            )}
          >
            {get(content, "description")}
          </p>
        </div>

        <Card
          className={cn(
            "max-w-4xl mx-auto border-0 shadow-xl overflow-hidden opacity-0 transition-all duration-1000 ease-out",
            isInView && "opacity-100 translate-y-0"
          )}
        >
          <CardContent className="p-4 md:p-10">
            <form className="space-y-8" onSubmit={handleSubmit}>
              {/* ... form fields tetap sama ... */}

              {/* Nama */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-medium">名字*</Label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">姓氏*</Label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Kontak */}
              <div className="space-y-2">
                <Label className="font-medium">手机号码*</Label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="font-medium">电子邮箱*</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="font-medium">公司名称*</Label>
                <Input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Negara */}
              <div className="space-y-2">
                <CompanyCountrySelect
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, country: val }))
                  }
                />
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label className="font-medium">
                  考虑JIIPE的原因*
                </Label>
                <RadioGroup
                  value={formData.reason}
                  onValueChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      reason: val,
                      reasonOther: val === "Other" ? prev.reasonOther : "",
                    }))
                  }
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
                    <Label htmlFor="other">其他（请注明）</Label>
                  </div>
                </RadioGroup>
                {formData.reason === "Other" && (
                  <Input
                    name="reasonOther"
                    value={formData.reasonOther}
                    onChange={handleChange}
                    placeholder="请提供详细信息"
                    className="mt-2"
                    required
                  />
                )}
              </div>

              {/* Bidang & Waktu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-medium">所属行业*</Label>
                  <select name="industry" className="w-full border rounded-md p-2 bg-transparent appearance-none" onChange={handleChange} required>
                    <option value="">请选择行业类别</option>
                    <option value="Chemical">化工</option>
                    <option value="Energy">能源</option>
                    <option value="Electronic">电子</option>
                    <option value="Metal">金属</option>
                    <option value="Supporting & Logistic">配套及物流</option>
                    <option value="Other">其他</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">所需工业用地面积（公顷）*</Label>
                  <Input name="landPlot" type="number" onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">预计建设需时*</Label>
                  <select name="timeline" className="w-full border rounded-md p-2 bg-transparent appearance-none" onChange={handleChange} required>
                    <option value="">请选择时长</option>
                    <option value="0-6 months">0–6 个月</option>
                    <option value="6-12 months">6–12 个月</option>
                    <option value="12-24 months">12–24 个月</option>
                    <option value="> 24 months">超过 24 个月</option>
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

              {typeof window !== "undefined" &&
                window.location.hostname !== "localhost" && (
                  <div className="mt-4">
                    <div
                      className="cf-turnstile"
                      data-sitekey="0x4AAAAAABjC5aD3ciiyisDM"
                    ></div>
                  </div>
                )}

              <Button
                type="submit"
                size="lg"
                className="w-full mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? "处理中..." : "立即咨询"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
