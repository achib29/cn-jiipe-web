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
          <h2
            className={cn(
              "text-sm uppercase font-semibold tracking-wider text-primary mb-2 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "200ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
          >
            Contact Us
          </h2>
          <h3
            className={cn(
              "text-3xl md:text-4xl font-bold mb-6 opacity-0 transition-all duration-700 ease-out",
              isInView && "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "400ms", transform: isInView ? "translateY(0)" : "translateY(20px)" }}
          >
            Get In Touch With Our Team
          </h3>
        </div>

        <Card
          className={cn(
            "max-w-4xl mx-auto border-0 shadow-xl overflow-hidden opacity-0 transition-all duration-1000 ease-out",
            isInView && "opacity-100 translate-y-0"
          )}
          style={{ transitionDelay: "600ms", transform: isInView ? "translateX(0)" : "translateX(-30px)" }}
        >
          <CardContent className="p-6 md:p-10">
            <form className="space-y-8">
              <div>
                <h4 className="text-xl font-semibold mb-6">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name*</Label>
                    <Input id="firstName" placeholder="First Name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name*</Label>
                    <Input id="lastName" placeholder="Last Name" required />
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="phone">Phone Number*</Label>
                  <Input id="phone" placeholder="(+62) xxx xxx xxx x" required />
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="email">Email*</Label>
                  <Input id="email" type="email" placeholder="yourname@mail.com" required />
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="company">Company Name*</Label>
                  <Input id="company" placeholder="Your Company Name" required />
                </div>

                <div className="space-y-2 mt-4">
                  <Label>Company Origin Country*</Label>
                  <RadioGroup defaultValue="indonesia" className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="indonesia" id="indonesia" />
                      <Label htmlFor="indonesia">Indonesia</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="international" id="international" />
                      <Label htmlFor="international">Outside of Indonesia</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2 mt-4">
                  <Label>The reason for considering JIIPE*</Label>
                  <RadioGroup defaultValue="market" className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="market" id="market" />
                      <Label htmlFor="market">To Approach Market</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="seaport" id="seaport" />
                      <Label htmlFor="seaport">Require a seaport</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-6">Industrial Requirements</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry*</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your Industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="chemical">Chemical</SelectItem>
                        <SelectItem value="automotive">Automotive</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="landPlot">Required Industrial Land Plot* (Ha)</Label>
                    <Input id="landPlot" type="number" placeholder="Enter land size in hectares" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline">Timeline Construction*</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your Timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-6">0-6 months</SelectItem>
                        <SelectItem value="6-12">6-12 months</SelectItem>
                        <SelectItem value="12-24">12-24 months</SelectItem>
                        <SelectItem value="24+">More than 24 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-6">Energy & Utility Needs</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="power">Total Required Power* (MW)</Label>
                    <Input id="power" type="number" placeholder="Enter power requirement" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="water">Total Industrial Water* (m³/day)</Label>
                    <Input id="water" type="number" placeholder="Enter water requirement" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gas">Total Required Natural Gas* (MMBTU/annum)</Label>
                    <Input id="gas" type="number" placeholder="Enter gas requirement" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="seaport">Est. Vol. Throughput via Seaport* (Tons/Year)</Label>
                    <Input id="seaport" type="number" placeholder="Enter throughput estimate" required />
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