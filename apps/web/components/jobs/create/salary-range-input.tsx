"use client";

import { Input } from "@hackhyre/ui/components/input";
import { DollarCircle } from "@hackhyre/ui/icons";

interface SalaryRangeInputProps {
  minValue: number | undefined;
  maxValue: number | undefined;
  onMinChange: (value: number | undefined) => void;
  onMaxChange: (value: number | undefined) => void;
  currency?: string;
}

export function SalaryRangeInput({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  currency = "USD",
}: SalaryRangeInputProps) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            Minimum
          </label>
          <div className="relative">
            <DollarCircle
              size={16}
              variant="Bulk"
              className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
            />
            <Input
              type="number"
              className="pl-9"
              placeholder="80,000"
              value={minValue ?? ""}
              onChange={(e) =>
                onMinChange(e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-xs font-medium">
            Maximum
          </label>
          <div className="relative">
            <DollarCircle
              size={16}
              variant="Bulk"
              className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2"
            />
            <Input
              type="number"
              className="pl-9"
              placeholder="120,000"
              value={maxValue ?? ""}
              onChange={(e) =>
                onMaxChange(e.target.value ? Number(e.target.value) : undefined)
              }
            />
          </div>
        </div>
      </div>
      {minValue !== undefined && maxValue !== undefined && (
        <p className="text-muted-foreground text-center text-xs">
          {formatter.format(minValue)} – {formatter.format(maxValue)} / year
        </p>
      )}
    </div>
  );
}
