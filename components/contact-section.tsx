"use client";

import { useRef, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.reason === "Other" && !formData.reasonOther.trim()) {
      alert("请填写‘其他’的具体原因。");
      setIsSubmitting(false);
      return;
    }

    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "inquiry_submit", {
        event_category: "Contact Form",
        event_label: "Submit Inquiry",
      });
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
          if (window._agl) {
            window._agl.push(["track", ["success", { t: 3 }]]);
          }
          router.push("/thank-you");
        } else {
          alert("Submission failed. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Background form submit failed:", err);
        alert("Submission error. Please try again.");
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
          <p
            className={cn(
              "text-gray-500 text-sm md:text-base leading-relaxed opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
          >
            提交下方表单后，我们将根据您的企业所属行业，提供对应的 JIIPE 工业园区招商专员联系方式。
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

              {/* Alasan */}
              <div className="space-y-2">
                <Label className="font-medium">考虑JIIPE的原因*</Label>
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
                    placeholder="请填写具体原因"
                    className="mt-2"
                    required
                  />
                )}
              </div>

              {/* Bidang & Waktu */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-medium">所属行业*</Label>
                  <select
                    name="industry"
                    className="w-full border rounded-md p-2"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                  >
                    <option value="">请选择行业类别</option>
                    <option value="Chemical">化工产业</option>
                    <option value="Energy">能源产业</option>
                    <option value="Electronic">电子产业</option>
                    <option value="Metal">金属产业</option>
                    <option value="Supporting & Logistic">
                      辅助和物流产业
                    </option>
                    <option value="Other">其他行业</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">所需工业用地面积（公顷）*</Label>
                  <Input
                    name="landPlot"
                    type="number"
                    value={formData.landPlot}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">预计建设需时*</Label>
                  <select
                    name="timeline"
                    className="w-full border rounded-md p-2"
                    value={formData.timeline}
                    onChange={handleChange}
                    required
                  >
                    <option value="">请选择时长</option>
                    <option value="0-6 months">6个月以内</option>
                    <option value="6-12 months">6-12个月</option>
                    <option value="12-24 months">12-24个月</option>
                    <option value="> 24 months">24个月以上</option>
                  </select>
                </div>
              </div>

              {/* Utilitas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-medium">所需电力总量（兆瓦）*</Label>
                  <Input
                    name="power"
                    type="number"
                    value={formData.power}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">所需工业用水总量（立方米/天）*</Label>
                  <Input
                    name="water"
                    type="number"
                    value={formData.water}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">所需天然气总量（百万英热单位/年）*</Label>
                  <Input
                    name="gas"
                    type="number"
                    value={formData.gas}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">预计港口吞吐量（吨/年）*</Label>
                  <Input
                    name="seaport"
                    type="number"
                    value={formData.seaport}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Turnstile hanya muncul di production */}
              {typeof window !== "undefined" &&
                window.location.hostname !== "localhost" && (
                  <div className="mt-4">
                    <div
                      className="cf-turnstile"
                      data-sitekey="0x4AAAAAABjC5aD3ciiyisDM"
                    ></div>
                  </div>
                )}

              {/* Submit */}
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
