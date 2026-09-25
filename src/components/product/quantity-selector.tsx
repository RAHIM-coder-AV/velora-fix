"use client";

import { Minus, Plus } from "lucide-react";

export function QuantitySelector({
  value,
  onChange,
  max = 20,
}: {
  value: number;
  onChange: (n: number) => void;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center border border-line">
      <button
        type="button"
        className="p-3 hover:bg-cream-2"
        onClick={() => onChange(Math.max(1, value - 1))}
        aria-label="-"
      >
        <Minus size={14} />
      </button>
      <span className="min-w-8 text-center text-sm">{value}</span>
      <button
        type="button"
        className="p-3 hover:bg-cream-2"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="+"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
