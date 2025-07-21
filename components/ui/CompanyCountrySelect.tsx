"use client";

import Select from "react-select";
import countryList from "react-select-country-list";
import { useMemo } from "react";
import { Label } from "@/components/ui/label";

export default function CompanyCountrySelect({ onChange }: { onChange: (value: string) => void }) {
  const options = useMemo(() => {
    return countryList().getData().map((c: { label: string; value: string }) => ({
      label: `${getFlagEmoji(c.value)} ${c.label}`,
      value: c.label,
    }));
  }, []);


  const customStyles = {
    control: (base: any) => ({
      ...base,
      padding: "6px",
      fontSize: "14px",
    }),
  };

  return (
    <div className="space-y-2">
      <Label className="block font-medium">公司所在国家*</Label>
      <Select
        options={options}
        styles={customStyles}
        onChange={(option: any) => onChange(option?.value)}
        placeholder="Select a country"
      />
    </div>
  );
}

// Helper to get emoji flag from ISO code
function getFlagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}
