"use client";

import { useRef, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
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
          <h2 className={cn("text-sm uppercase font-semibold tracking-wider text-primary mb-2 opacity-0 transition-all duration-700 ease-out", isInView && "opacity-100 translate-y-0")}>
            Contact Us
          </h2>
          <h3 className={cn("text-3xl md:text-4xl font-bold mb-6 opacity-0 transition-all duration-700 ease-out", isInView && "opacity-100 translate-y-0")}>
            Get In Touch With Our Team
          </h3>
        </div>

        <Card className={cn("max-w-4xl mx-auto border-0 shadow-xl overflow-hidden opacity-0 transition-all duration-1000 ease-out", isInView && "opacity-100 translate-y-0")}>
          <CardContent className="p-6 md:p-10">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><Label>First Name*</Label><Input name="firstName" onChange={handleChange} required /></div>
                <div><Label>Last Name*</Label><Input name="lastName" onChange={handleChange} required /></div>
              </div>
              <div><Label>Phone Number*</Label><Input name="phone" onChange={handleChange} required /></div>
              <div><Label>Email*</Label><Input name="email" type="email" onChange={handleChange} required /></div>
              <div><Label>Company Name*</Label><Input name="company" onChange={handleChange} required /></div>

              <div>
                <Label>Company Origin Country*</Label>
                <RadioGroup defaultValue="indonesia" onValueChange={(val) => setFormData((prev) => ({ ...prev, country: val }))} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="Indonesia" id="indo" /><Label htmlFor="indo">Indonesia</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="Outside of Indonesia" id="intl" /><Label htmlFor="intl">Outside of Indonesia</Label></div>
                </RadioGroup>
              </div>

              <div>
                <Label>The reason for considering JIIPE*</Label>
                <RadioGroup onValueChange={(val) => setFormData((prev) => ({ ...prev, reason: val }))} className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="Market" id="market" /><Label htmlFor="market">To Approach Market</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="Seaport" id="seaport" /><Label htmlFor="seaport">Require a seaport</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="Other" id="other" /><Label htmlFor="other">Other</Label></div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Industry*</Label>
                  <select name="industry" className="w-full border rounded-md p-2" onChange={handleChange} required>
                    <option value="">Select your Industry</option>
                    <option value="Chemical">Chemical</option>
                    <option value="Energy">Energy</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Metal">Metal</option>
                    <option value="Supporting & Logistic">Supporting & Logistic</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div><Label>Required Industrial Land Plot (Ha)*</Label><Input name="landPlot" type="number" onChange={handleChange} required /></div>
                <div>
                  <Label>Timeline Construction*</Label>
                  <select name="timeline" className="w-full border rounded-md p-2" onChange={handleChange} required>
                    <option value="">Select your Timeline</option>
                    <option value="0-6 months">0–6 months</option>
                    <option value="6-12 months">6–12 months</option>
                    <option value="12-24 months">12–24 months</option>
                    <option value="> 24 months">More than 24 months</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><Label>Total Required Power (MW)*</Label><Input name="power" type="number" onChange={handleChange} required /></div>
                <div><Label>Total Industrial Water (m³/day)*</Label><Input name="water" type="number" onChange={handleChange} required /></div>
                <div><Label>Total Required Natural Gas (MMBTU/annum)*</Label><Input name="gas" type="number" onChange={handleChange} required /></div>
                <div><Label>Est. Vol. Throughput via Seaport (Tons/Year)*</Label><Input name="seaport" type="number" onChange={handleChange} required /></div>
              </div>

              <Button type="submit" size="lg" className="w-full mt-4">Submit Inquiry</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
