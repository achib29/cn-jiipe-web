"use client";

import { useRef } from "react";
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

  return (
    <section id="contact" ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={cn(
              "text-sm uppercase font-semibold tracking-wider text-primary mb-2 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "200ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}>
            Contact Us
          </h2>
          <h3 className={cn(
              "text-3xl md:text-4xl font-bold mb-6 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "400ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}>
            Get In Touch With Our Team
          </h3>
        </div>

        <Card className={cn(
            "max-w-4xl mx-auto border-0 shadow-xl overflow-hidden opacity-0 transition-all duration-1000 ease-out",
            isInView && "opacity-100 translate-y-0"
          )}
          style={{ transitionDelay: "600ms", transform: isInView ? "translateX(0)" : "translateX(-30px)" }}>
          <CardContent className="p-6 md:p-10">
            <form className="space-y-8" onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const data = {
                firstName: form.firstName.value,
                lastName: form.lastName.value,
                phone: form.phone.value,
                email: form.email.value,
                company: form.company.value,
                power: form.power.value,
                water: form.water.value,
                gas: form.gas.value,
                seaport: form.seaport.value,
              };

              const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });

              const result = await res.json();
              if (result.success) {
                alert("Inquiry submitted successfully!");
              } else {
                alert("Failed to send inquiry.");
              }
            }}>
              <div>
                <h4 className="text-xl font-semibold mb-6">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name*</Label>
                    <Input id="firstName" name="firstName" placeholder="First Name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name*</Label>
                    <Input id="lastName" name="lastName" placeholder="Last Name" required />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="phone">Phone Number*</Label>
                  <Input id="phone" name="phone" placeholder="(+62) xxx xxx xxx x" required />
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="email">Email*</Label>
                  <Input id="email" name="email" type="email" placeholder="yourname@mail.com" required />
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="company">Company Name*</Label>
                  <Input id="company" name="company" placeholder="Your Company Name" required />
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-6">Energy & Utility Needs</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="power">Total Required Power* (MW)</Label>
                    <Input id="power" name="power" type="number" placeholder="Enter power requirement" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="water">Total Industrial Water* (m³/day)</Label>
                    <Input id="water" name="water" type="number" placeholder="Enter water requirement" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gas">Total Required Natural Gas* (MMBTU/annum)</Label>
                    <Input id="gas" name="gas" type="number" placeholder="Enter gas requirement" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seaport">Est. Vol. Throughput via Seaport* (Tons/Year)</Label>
                    <Input id="seaport" name="seaport" type="number" placeholder="Enter throughput estimate" required />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Submit Inquiry
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
