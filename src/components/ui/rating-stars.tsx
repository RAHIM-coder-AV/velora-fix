import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            i + 1 <= Math.round(value) ? "fill-ink text-ink" : "text-line",
          )}
        />
      ))}
    </span>
  );
}
